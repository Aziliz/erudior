/** Durable instructor-side hand-in receipt, retryable projection and review storage.
 * The ledger is authoritative evidence; merged progress is a recoverable projection.
 * Existing UI parent/teacher gates control access, not the class-file HMAC alone.
 */
import type { Family } from "./family";
import { loadFamily, saveFamily } from "./family";
import { mergeWork, verifyHandIn } from "./classroom";
import { parseSubmissionHistory, recordHandIn, reviewHandIn, type SubmissionRecord } from "./submissionHistory";
import { loadState, saveState, updateState, emptyProgress } from "./storage";
import { loadFile, putFilePreserving } from "./documents";
import type { Progress } from "./types";

const KEY = "classroom-submissions";
type State = { version: 1; records: SubmissionRecord[]; complete: string[] };
export type StoredSubmissionRecord = SubmissionRecord & { importComplete: boolean };
export type ClassroomReviewInput = { submissionId: string; eventId: string; status: "reviewed" | "needs_revision"; reviewedAt: string; note: string };
export interface ClassroomSubmissionIO {
  readState(name: string): Promise<string | null>;
  writeState(name: string, text: string): Promise<void>;
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
  return { version: 1, records, complete: value.complete };
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
      parseSubmissionHistory(next.records);
      return JSON.stringify(next);
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
        const receipt = recordHandIn(current.records, h, record.receivedAt);
        inserted = receipt.inserted;
        return { ...current, records: receipt.records, complete: current.complete.filter(id => id !== record.id) };
      });
      for (const [id, file] of Object.entries(h.files ?? {})) await io.writeFile(id, file);
      await io.updateState(`progress-${h.studentId}`, previous => {
        const current = previous === null ? emptyProgress() : { ...emptyProgress(), ...JSON.parse(previous) };
        return JSON.stringify(mergeWork(current, h.progress, h.courses));
      });
      await io.updateState("family", async previous => {
        const latest: Family | null = previous === null ? null : JSON.parse(previous);
        if (!latest || latest.mode !== "classroom") throw Error("The teacher classroom changed during import.");
        await verifyHandIn(h, latest); // Recheck under the same lock as the marker write.
        return JSON.stringify({ ...latest, classes: (latest.classes ?? []).map(c => c.id !== cls.id ? c : {
          ...c, handins: { ...c.handins, [h.studentId]: !c.handins[h.studentId] || Date.parse(h.created) > Date.parse(c.handins[h.studentId]) ? h.created : c.handins[h.studentId] },
        }) });
      });
      state = await mutate(current => ({ ...current, complete: [...new Set([...current.complete, record.id])] }));
      return { record: { ...state.records.find(r => r.id === record.id)!, importComplete: true }, inserted };
    }),
    review: (input: ClassroomReviewInput, expectedFamily: Family): Promise<StoredSubmissionRecord[]> => serial(async () => {
      const family = await currentFamily(expectedFamily);
      const state = await read();
      const record = state.records.find(r => r.id === input.submissionId);
      if (!record || !state.complete.includes(record.id)) throw Error("Finish importing this exact submission before reviewing it.");
      await verifyHandIn(record.snapshot, family);
      const updated = await mutate(current => {
        if (!current.complete.includes(input.submissionId)) throw Error("Finish importing this exact submission before reviewing it.");
        return { ...current, records: reviewHandIn(current.records, input.submissionId, input.status, input.reviewedAt, input.note, input.eventId) };
      });
      return view(updated);
    }),
  };
}
const defaultStore = createClassroomSubmissionStore({ readState: loadState, writeState: saveState, updateState, readFamily: loadFamily, writeFamily: saveFamily, readFile: loadFile, writeFile: putFilePreserving, now: () => new Date().toISOString() });
export const loadClassroomSubmissions = defaultStore.load;
export const importClassroomSubmission = defaultStore.import;
export const saveClassroomSubmissionReview = defaultStore.review;
