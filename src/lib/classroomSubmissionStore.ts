import { parseAdvancedAssessmentLibrary } from './advancedAssessment';
import { deleteAdvancedAssessmentStudent } from './advancedAssessmentStore';
import { parseScientificLibrary } from './scientificWorkspace';
import { deleteScientificStudent } from './scientificWorkspaceStore';
import { parseBranchingLibrary } from './branchingEngine';
import { deleteBranchingStudent } from './branchingEngineStore';
import { parseInstructionalLibrary } from './instructionalEvidence';
import { deleteInstructionalStudent } from './instructionalEvidenceStore';
import { parseTransactionLibrary } from './transactionEngine';
import { deleteTransactionStudent } from './transactionEngineStore';
import { parseDocumentLibrary } from './documentEngine';
import { deleteDocumentStudent } from './documentEngineStore';
import { parseInterventionState } from './interventions';
import { deleteInterventionStudent } from './interventionStore';
/** Durable instructor-side hand-in receipt, retryable projection and review storage.
 * The ledger is authoritative evidence; merged progress is a recoverable projection.
 * Existing UI parent/teacher gates control access, not the class-file HMAC alone.
 */
import type { Family } from "./family";
import { loadFamily, saveFamily } from "./family";
import { mergeWork, verifyHandIn, missingHandInAttachments } from "./classroom";
import { parseSubmissionHistory, recordHandIn, reviewHandIn, type SubmissionRecord, type SubmissionAssessment } from "./submissionHistory";
import { loadState, saveState, updateState, emptyProgress } from "./storage";
import { loadFile, putFilePreserving } from "./documents";
import type { Progress } from "./types";

const KEY = "classroom-submissions";
type State = { version: 1; records: SubmissionRecord[]; complete: string[]; deletedStudentIds?: string[] };
export type StoredSubmissionRecord = SubmissionRecord & { importComplete: boolean };
export type ClassroomReviewInput = { submissionId: string; eventId: string; status: "reviewed" | "needs_revision"; reviewedAt: string; note: string; assessment?: SubmissionAssessment };
export interface ClassroomSubmissionIO {
  readState(name: string): Promise<string | null>;
  writeState(name: string, text: string | null): Promise<void>;
  updateState(name: string, change: (previous: string | null) => string | Promise<string>): Promise<string>;
  readFamily(): Promise<Family | null>;
  writeFamily(family: Family): Promise<void>;
  readFile(id: string): Promise<{ mime: string; data: string } | null>;
  writeFile(id: string, file: { mime: string; data: string }): Promise<void>;
  now(): string;
}
export function validateClassroomSubmissionState(text: string | null): State {
  if (text !== null && new TextEncoder().encode(text).byteLength > 65 * 1024 * 1024) throw Error("Classroom history exceeds the storage limit.");
  if (text === null) return { version: 1, records: [], complete: [] };
  const value = JSON.parse(text);
  if (!value || value.version !== 1 || !Array.isArray(value.complete) || !value.complete.every((x: unknown) => typeof x === "string"))
    throw Error("Classroom history is damaged. Restore a backup before importing; existing evidence was not replaced.");
  const records = parseSubmissionHistory(value.records);
  if (new Set(value.complete).size !== value.complete.length || value.complete.some((id: string) => !records.some(r => r.id === id)))
    throw Error("Classroom history completion markers are invalid.");
  const deletedStudentIds = value.deletedStudentIds ?? [];
  if (!Array.isArray(deletedStudentIds) || deletedStudentIds.length > 10000 ||
      !deletedStudentIds.every((id: unknown) => typeof id === "string" && /^[a-z0-9]{1,24}$/.test(id)) ||
      new Set(deletedStudentIds).size !== deletedStudentIds.length || records.some(r => deletedStudentIds.includes(r.studentId)))
    throw Error("Classroom deletion markers are invalid.");
  return { version: 1, records, complete: value.complete, ...(deletedStudentIds.length ? { deletedStudentIds } : {}) };
}
function assertNotDeleted(state: State, studentId: string): void {
  if (state.deletedStudentIds?.includes(studentId)) throw Error("This student profile was deleted. Its hand-ins cannot recreate deleted records.");
}
const view = (state: State): StoredSubmissionRecord[] => state.records.map(r => ({ ...r, importComplete: state.complete.includes(r.id) }));
export function createClassroomSubmissionStore(io: ClassroomSubmissionIO) {
  let tail: Promise<unknown> = Promise.resolve();
  const serial = <T,>(run: () => Promise<T>): Promise<T> => {
    const execute = async () => typeof navigator !== "undefined" && navigator.locks?.request
      ? navigator.locks.request("erudior-classroom-submissions", run) : run();
    const next = tail.then(execute, execute); tail = next.catch(() => {}); return next;
  };
  const read = async () => validateClassroomSubmissionState(await io.readState(KEY));
  const mutate = async (change: (current: State) => State): Promise<State> => {
    const text = await io.updateState(KEY, previous => {
      const next = change(validateClassroomSubmissionState(previous));
      const text = JSON.stringify(next);
      validateClassroomSubmissionState(text);
      return text;
    });
    return validateClassroomSubmissionState(text);
  };
  const currentFamily = async (expected: Family): Promise<Family> => {
    const latest = await io.readFamily();
    if (!latest || expected.mode !== "classroom" || latest.mode !== "classroom") throw Error("Open the current teacher classroom before changing submission history.");
    return latest;
  };
  return {
    load: async (): Promise<StoredSubmissionRecord[]> => view(await read()),
    import: (raw: unknown, expectedFamily: Family): Promise<{ record: StoredSubmissionRecord; inserted: boolean }> => serial(async () => {
      const family = await currentFamily(expectedFamily);
      const { h, cls } = await verifyHandIn(raw, family);
      let state = await read();
      assertNotDeleted(state, h.studentId);
      const recorded = recordHandIn(state.records, h, io.now());
      const record = recorded.records.find(r => r.classId === h.classId && r.studentId === h.studentId && r.snapshot.mac === h.mac)!;
      // Re-import also repairs projections after an explicit restore/reset.
      // Preflight the entire projection and file collisions before any write.
      const previous = await io.readState(`progress-${h.studentId}`);
      let progress: Progress;
      try { progress = previous === null ? emptyProgress() : { ...emptyProgress(), ...JSON.parse(previous) }; }
      catch { throw Error("Existing learner progress is damaged; no import was written."); }
      mergeWork(progress, h.progress, h.courses);
      for (const [id, file] of Object.entries(h.files ?? {})) {
        const existing = await io.readFile(id);
        if (existing && (existing.mime !== file.mime || existing.data !== file.data)) throw Error("An attached file ID conflicts with existing evidence. No files were replaced.");
      }
      // A receipt survives interruption. It is explicitly pending until all projections finish.
      let inserted = recorded.inserted;
      state = await mutate(current => {
        assertNotDeleted(current, h.studentId);
        const receipt = recordHandIn(current.records, h, record.receivedAt);
        inserted = receipt.inserted;
        return { ...current, records: receipt.records, complete: current.complete.filter(id => id !== record.id) };
      });
      for (const [id, file] of Object.entries(h.files ?? {})) await io.writeFile(id, file);
      await io.updateState(`progress-${h.studentId}`, async previous => {
        // Checked while holding this profile's named-state lock. Deletion writes
        // its tombstone before joining this lock, so no late projection survives.
        assertNotDeleted(await read(), h.studentId);
        const current = previous === null ? emptyProgress() : { ...emptyProgress(), ...JSON.parse(previous) };
        return JSON.stringify(mergeWork(current, h.progress, h.courses));
      });
      // Native CAS is per key. Recheck after persistence as a defense against a
      // concurrent deletion in another view that lacks Web Locks.
      if ((await read()).deletedStudentIds?.includes(h.studentId)) {
        await io.writeState(`progress-${h.studentId}`, null);
        throw Error("This student profile was deleted during import; its progress was removed.");
      }
      await io.updateState("family", async previous => {
        assertNotDeleted(await read(), h.studentId);
        const latest: Family | null = previous === null ? null : JSON.parse(previous);
        if (!latest || latest.mode !== "classroom") throw Error("The teacher classroom changed during import.");
        await verifyHandIn(h, latest); // Recheck under the same lock as the marker write.
        return JSON.stringify({ ...latest, classes: (latest.classes ?? []).map(c => c.id !== cls.id ? c : {
          ...c, handins: { ...c.handins, [h.studentId]: !c.handins[h.studentId] || Date.parse(h.created) > Date.parse(c.handins[h.studentId]) ? h.created : c.handins[h.studentId] },
        }) });
      });
      state = await mutate(current => {
        assertNotDeleted(current, h.studentId);
        return { ...current, complete: [...new Set([...current.complete, record.id])] };
      });
      return { record: { ...state.records.find(r => r.id === record.id)!, importComplete: true }, inserted };
    }),
    /** Explicit full-profile deletion only. Roster/class removal must not call this.
     * Keep the profile visible until every cleanup succeeds so failures are retryable.
     * ID-only tombstones prevent old hand-ins from recreating deleted personal data.
     */
    deleteStudent: (studentId: string, expectedFamily: Family): Promise<Family> => serial(async () => {
      if (!/^[a-z0-9]{1,24}$/.test(studentId) || !expectedFamily.students.some(s => s.id === studentId)) throw Error("Select the student profile to delete.");
      const family = await io.readFamily();
      if (!family || family.mode !== expectedFamily.mode) throw Error("The current family changed. Reload before deleting.");
      if (family.students.some(s => s.id === studentId) && family.students.length < 2) throw Error("A family needs at least one student.");
      await mutate(current => {
        const records = current.records.filter(r => r.studentId !== studentId);
        const kept = new Set(records.map(r => r.id));
        return { ...current, records, complete: current.complete.filter(id => kept.has(id)),
          deletedStudentIds: [...new Set([...(current.deletedStudentIds ?? []), studentId])] };
      });
      await io.updateState("instructional-evidence", previous => JSON.stringify(deleteInstructionalStudent(parseInstructionalLibrary(previous), studentId)));
      await io.updateState("branching-engine", previous => JSON.stringify(deleteBranchingStudent(parseBranchingLibrary(previous), studentId)));
      await io.updateState("advanced-assessment", previous => JSON.stringify(deleteAdvancedAssessmentStudent(parseAdvancedAssessmentLibrary(previous), studentId)));
      await io.updateState("scientific-workspace", previous => JSON.stringify(deleteScientificStudent(parseScientificLibrary(previous), studentId)));
      await io.updateState("transaction-engine", previous => JSON.stringify(deleteTransactionStudent(parseTransactionLibrary(previous), studentId)));
      await io.updateState("document-engine", previous => JSON.stringify(deleteDocumentStudent(parseDocumentLibrary(previous), studentId)));
      await io.updateState("interventions", previous => JSON.stringify(deleteInterventionStudent(parseInterventionState(previous), studentId)));
      for (const prefix of ["progress", "records", "session", "portfolio"])
        await io.writeState(`${prefix}-${studentId}`, null);
      const text = await io.updateState("family", previous => {
        const latest: Family | null = previous === null ? null : JSON.parse(previous);
        if (!latest || latest.mode !== expectedFamily.mode) throw Error("The current family changed during deletion. Reload and retry cleanup.");
        if (latest.students.some(s => s.id === studentId) && latest.students.length < 2) throw Error("A family needs at least one student.");
        return JSON.stringify({ ...latest, students: latest.students.filter(s => s.id !== studentId),
          classes: latest.classes?.map(c => ({ ...c, students: c.students.filter(id => id !== studentId),
            handins: Object.fromEntries(Object.entries(c.handins ?? {}).filter(([id]) => id !== studentId)) })) });
      });
      return JSON.parse(text) as Family;
    }),
    review: (input: ClassroomReviewInput, expectedFamily: Family): Promise<StoredSubmissionRecord[]> => serial(async () => {
      const family = await currentFamily(expectedFamily);
      const state = await read();
      const record = state.records.find(r => r.id === input.submissionId);
      if (!record || !state.complete.includes(record.id)) throw Error("Finish importing this exact submission before reviewing it.");
      assertNotDeleted(state, record.studentId);
      await verifyHandIn(record.snapshot, family);
      if (missingHandInAttachments(record.snapshot).length) throw Error("This receipt is missing referenced attachments. Request a complete hand-in before reviewing it.");
      const updated = await mutate(current => {
        assertNotDeleted(current, record.studentId);
        if (!current.complete.includes(input.submissionId)) throw Error("Finish importing this exact submission before reviewing it.");
        return { ...current, records: reviewHandIn(current.records, input.submissionId, input.status, input.reviewedAt, input.note, input.eventId, input.assessment) };
      });
      return view(updated);
    }),
  };
}
const defaultStore = createClassroomSubmissionStore({ readState: loadState, writeState: saveState, updateState, readFamily: loadFamily, writeFamily: saveFamily, readFile: loadFile, writeFile: putFilePreserving, now: () => new Date().toISOString() });
export const loadClassroomSubmissions = defaultStore.load;
export const importClassroomSubmission = defaultStore.import;
export const saveClassroomSubmissionReview = defaultStore.review;

export const deleteStudentWithSubmissionHistory = defaultStore.deleteStudent;
