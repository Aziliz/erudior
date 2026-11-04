import { bindLocalSessionAuthority } from './localSession';
import { scientificJSON as documentJSON } from './scientificWorkspace';
import {
  parseScientificPack, parseScientificLibrary, parseScientificAssignment,
  parseScientificFeedback, createScientificSession,
  applyScientificCommand, makeScientificSubmission,
  type ScientificPack, type ScientificLibrary, type ScientificAssignment,
  type ScientificSession, type ScientificCommand, type ScientificFeedback,
} from './scientificWorkspace';


export interface ScientificAdult {
  actorId: string;
  actorName: string;
  authorityKey: string;
}
export interface ScientificLearnerContext { studentId: string; authorityKey: string }
export interface ScientificEngineIO {
  read(): Promise<string | null>;
  /** Callback must rerun on CAS conflict rather than overwriting another writer. */
  update(change: (previous: string | null) => Promise<string>): Promise<string>;
  authorizeAdult(studentId?: string): Promise<ScientificAdult>;
  learnerContext(): Promise<ScientificLearnerContext>;
  now(): string;
}
export interface ScientificAssignmentInput {
  id: string;
  studentId: string;
  title: string;
  instructions: string;
  pack: ScientificPack;
}
export type ScientificReviewInput = Pick<ScientificFeedback, 'id' | 'submissionId' | 'status' | 'note'>;
const equal = (a: unknown, b: unknown) => documentJSON(a) === documentJSON(b);
const copy = <T>(value: T): T => JSON.parse(documentJSON(value));
const key = (value: { id: string; revision: number }) => `${value.id}@${value.revision}`;
const latest = <T extends { id: string; revision: number }>(values: T[], id: string) =>
  values.filter(value => value.id === id).sort((a, b) => b.revision - a.revision)[0];
function validStudent(id: string) {
  if (!/^[a-z0-9]{1,24}$/.test(id)) throw Error('Select a current learner profile.');
}
function active(state: ScientificLibrary, id: string) {
  validStudent(id);
  if (state.deletedStudentIds.includes(id)) throw Error('This learner profile was deleted.');
}
function own(state: ScientificLibrary, id: string): ScientificLibrary {
  const assignments = state.assignments.filter(value => value.studentId === id);
  const cases = new Set(assignments.map(key));
  const packs = new Set(assignments.map(value => key(value.pack)));
  const submissions = state.submissions.filter(value => value.studentId === id);
  const evidence = new Set(submissions.map(value => value.id));
  return parseScientificLibrary({
    ...state,
    packReviews: state.packReviews.filter(value => packs.has(value.packKey)),
    packs: state.packs.filter(value => packs.has(key(value))),
    assignments,
    sessions: state.sessions.filter(value => cases.has(`${value.caseId}@${value.caseRevision}`)),
    submissions,
    feedback: state.feedback.filter(value => evidence.has(value.submissionId)),
    deletedStudentIds: [],
    ...(state.pendingApproval ? { pendingApproval: state.pendingApproval.filter(value => packs.has(value)) } : {}),
  });
}
/** Only explicit full-profile deletion calls this; roster changes do not erase evidence. */
export function deleteScientificStudent(input: ScientificLibrary, studentId: string): ScientificLibrary {
  validStudent(studentId);
  const state = parseScientificLibrary(input);
  const cases = new Set(state.assignments.filter(value => value.studentId === studentId).map(value => value.id));
  const submissions = state.submissions.filter(value => value.studentId !== studentId);
  const evidence = new Set(submissions.map(value => value.id));
  return parseScientificLibrary({
    ...state,
    assignments: state.assignments.filter(value => value.studentId !== studentId),
    sessions: state.sessions.filter(value => !cases.has(value.caseId)),
    submissions,
    feedback: state.feedback.filter(value => evidence.has(value.submissionId)),
    deletedStudentIds: [...new Set([...state.deletedStudentIds, studentId])],
  });
}

/** Independent whole-pack approval is local authority; imported labels are historical data only. */
export function createScientificWorkspaceStore(io: ScientificEngineIO) {
  io = bindLocalSessionAuthority(io);
  const adult = async (id?: string) => {
    if (id) validStudent(id);
    const context = await io.authorizeAdult(id);
    if (!context.actorId.trim() || !context.actorName.trim() || !context.authorityKey.trim())
      throw Error('Fresh adult authorization is required.');
    return context;
  };
  const learnerContext = async () => {
    const context = await io.learnerContext();
    validStudent(context.studentId);
    if (!context.authorityKey.trim()) throw Error('Fresh learner context is required.');
    return context;
  };
  const checkAdult = async (context: ScientificAdult, id?: string) => {
    if (!equal(context, await adult(id))) throw Error('Adult authority changed. Reload before continuing.');
  };
  const checkLearner = async (context: ScientificLearnerContext) => {
    if (!equal(context, await learnerContext())) throw Error('Learner profile changed. Reload before continuing.');
  };
  const assignment = (state: ScientificLibrary, context: ScientificLearnerContext, id: string, revision: number) => {
    active(state, context.studentId);
    const found = latest(state.assignments, id);
    if (!found || found.studentId !== context.studentId || found.revision !== revision)
      throw Error('This scientific assignment changed or belongs to another learner. Reload before continuing.');
    if (state.pendingApproval?.includes(key(found.pack)))
      throw Error('Restored definitions and source history need fresh adult review before learner work continues.');
    return found;
  };
  const supervisor = {
    async load() {
      const context = await adult();
      const state = parseScientificLibrary(await io.read());
      await checkAdult(context);
      return state;
    },
    async savePack(input: ScientificPack, expectedRevision: number | null) {
      const { approval: _approval, ...body } = parseScientificPack(input);
      const context = await adult();
      let result!: ScientificPack;
      await io.update(async previous => {
        const state = parseScientificLibrary(previous);
        await checkAdult(context);
        const current = latest(state.packs, body.id);
        const candidate = parseScientificPack({ ...body, revision: (expectedRevision ?? 0) + 1 });
        if (current && current.revision === candidate.revision && equal(current, candidate)) {
          result = current;
          return JSON.stringify(state);
        }
        if ((current?.revision ?? null) !== expectedRevision) throw Error('Workspace source changed. Reload before saving.');
        result = candidate;
        const next = parseScientificLibrary({ ...state, packs: [...state.packs, result] });
        await checkAdult(context);
        return JSON.stringify(next);
      });
      await checkAdult(context);
      return result;
    },
    async approvePack(id: string, revision: number) {
      const context = await adult();
      let result!: ScientificPack;
      await io.update(async previous => {
        const state = parseScientificLibrary(previous);
        await checkAdult(context);
        const pending = state.pendingApproval?.includes(`${id}@${revision}`);
        const selected = pending ? state.packs.find(value => value.id === id && value.revision === revision) : latest(state.packs, id);
        if (!selected || selected.revision !== revision) throw Error('Review the latest exact saved workspace source before approval.');
        result = selected.approval ? selected : parseScientificPack({ ...selected, approval: { at: io.now(), actor: context.actorName } });
        const next = parseScientificLibrary({
          ...state,
          packs: state.packs.map(value => key(value) === key(result) ? result : value),
          packReviews: pending || !selected.approval ? [...state.packReviews, {packKey:key(result),actor:context.actorName,at:io.now()}] : state.packReviews,
          ...(state.pendingApproval ? { pendingApproval: state.pendingApproval.filter(value => value !== key(result)) } : {}),
        });
        await checkAdult(context);
        return JSON.stringify(next);
      });
      await checkAdult(context);
      return result;
    },
    async assign(input: ScientificAssignmentInput, expectedRevision: number | null) {
      const safe = copy(input);
      const context = await adult(safe.studentId);
      let result!: ScientificAssignment;
      await io.update(async previous => {
        const state = parseScientificLibrary(previous);
        active(state, safe.studentId);
        await checkAdult(context, safe.studentId);
        const current = latest(state.assignments, safe.id);
        if (current && current.studentId !== safe.studentId) throw Error('A scientific case cannot change learner identity.');
        const pack = state.packs.find(value => key(value) === key(safe.pack));
        if (!pack?.approval || state.pendingApproval?.includes(key(pack)) || !equal(pack, safe.pack))
          throw Error('Choose an exact locally approved workspace source and source snapshot.');
        const candidate = parseScientificAssignment({ ...safe, revision: (expectedRevision ?? 0) + 1,
          createdAt: current?.revision === (expectedRevision ?? 0) + 1 ? current.createdAt : io.now() });
        if (current && equal(current, candidate)) { result = current; return JSON.stringify(state); }
        if ((current?.revision ?? null) !== expectedRevision) throw Error('Assignment changed. Reload before reassigning.');
        result = candidate;
        const next = parseScientificLibrary({ ...state, assignments: [...state.assignments, result] });
        await checkAdult(context, safe.studentId);
        return JSON.stringify(next);
      });
      await checkAdult(context, safe.studentId);
      return result;
    },
    async review(input: ScientificReviewInput) {
      const safe = copy(input);
      const context = await adult();
      let result!: ScientificFeedback;
      let target: string | undefined;
      await io.update(async previous => {
        const state = parseScientificLibrary(previous);
        const submission = state.submissions.find(value => value.id === safe.submissionId);
        if (!submission) throw Error('Select immutable scientific evidence.');
        target = submission.studentId;
        active(state, target);
        await checkAdult(context, target);
        const existing = state.feedback.find(value => value.id === safe.id);
        result = parseScientificFeedback({ ...safe, at: existing?.at ?? io.now(), actor: context.actorName });
        if (existing) {
          if (!equal(existing, result)) throw Error('Feedback identity already exists.');
          return JSON.stringify(state);
        }
        const next = parseScientificLibrary({ ...state, feedback: [...state.feedback, result] });
        await checkAdult(context, target);
        return JSON.stringify(next);
      });
      await checkAdult(context, target);
      return result;
    },
  };
  const learner = {
    async load() {
      const context = await learnerContext();
      const state = parseScientificLibrary(await io.read());
      active(state, context.studentId);
      await checkLearner(context);
      return own(state, context.studentId);
    },
    async command(caseId: string, caseRevision: number, command: ScientificCommand, eventId: string, expectedRevision: number | null) {
      const safe = copy(command);
      const context = await learnerContext();
      let result!: ScientificSession;
      await io.update(async previous => {
        const state = parseScientificLibrary(previous);
        const source = assignment(state, context, caseId, caseRevision);
        await checkLearner(context);
        const existing = state.sessions.find(value => value.caseId === caseId && value.caseRevision === caseRevision);
        const event = existing?.events.find(value => value.id === eventId);
        if (event) {
          if (!equal(event.command, safe)) throw Error('Scientific event identity already exists.');
          result = existing!;
          return JSON.stringify(state);
        }
        if ((existing?.revision ?? null) !== expectedRevision) throw Error('Scientific session changed in another window. Reload before continuing.');
        result = applyScientificCommand(source, existing ?? createScientificSession(source, source.createdAt), safe, eventId, io.now());
        const next = parseScientificLibrary({ ...state, sessions: [...state.sessions.filter(value => value !== existing), result] });
        await checkLearner(context);
        return JSON.stringify(next);
      });
      await checkLearner(context);
      return result;
    },
    async submit(caseId: string, caseRevision: number, id: string, expectedRevision: number | null) {
      const context = await learnerContext();
      let result!: ReturnType<typeof makeScientificSubmission>;
      await io.update(async previous => {
        const state = parseScientificLibrary(previous);
        const source = assignment(state, context, caseId, caseRevision);
        await checkLearner(context);
        const session = state.sessions.find(value => value.caseId === caseId && value.caseRevision === caseRevision);
        const existing = state.submissions.find(value => value.id === id);
        if (existing) {
          if (!equal(existing.assignment, source) || (existing.session.revision === 0 ? null : existing.session.revision) !== expectedRevision)
            throw Error('Submission identity already exists.');
          result = existing;
          return JSON.stringify(state);
        }
        if ((session?.revision ?? null) !== expectedRevision) throw Error('Scientific session changed. Reload before submitting.');
        result = makeScientificSubmission(source, session ?? createScientificSession(source, source.createdAt), id, io.now());
        const next = parseScientificLibrary({ ...state, submissions: [...state.submissions, result] });
        await checkLearner(context);
        return JSON.stringify(next);
      });
      await checkLearner(context);
      return result;
    },
  };
  return { supervisor, learner };
}
export type ScientificSupervisor = ReturnType<typeof createScientificWorkspaceStore>['supervisor'];
export type ScientificLearner = ReturnType<typeof createScientificWorkspaceStore>['learner'];
