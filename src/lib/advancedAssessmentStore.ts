import { advancedAssessmentJSON as documentJSON } from './advancedAssessment';
import {
  parseAdvancedAssessmentPack, parseAdvancedAssessmentLibrary, parseAdvancedAssessmentAssignment,
  parseAdvancedAssessmentFeedback, createAdvancedAssessmentSession,
  applyAdvancedAssessmentCommand, makeAdvancedAssessmentSubmission,
  type AdvancedAssessmentPack, type AdvancedAssessmentLibrary, type AdvancedAssessmentAssignment,
  type AdvancedAssessmentSession, type AdvancedAssessmentCommand, type AdvancedAssessmentFeedback,
} from './advancedAssessment';


export interface AdvancedAssessmentAdult {
  actorId: string;
  actorName: string;
  authorityKey: string;
}
export interface AdvancedAssessmentLearnerContext { studentId: string; authorityKey: string }
export interface AdvancedAssessmentEngineIO {
  read(): Promise<string | null>;
  /** Callback must rerun on CAS conflict rather than overwriting another writer. */
  update(change: (previous: string | null) => Promise<string>): Promise<string>;
  authorizeAdult(studentId?: string): Promise<AdvancedAssessmentAdult>;
  learnerContext(): Promise<AdvancedAssessmentLearnerContext>;
  now(): string;
}
export interface AdvancedAssessmentAssignmentInput {
  id: string;
  studentId: string;
  title: string;
  instructions: string;
  pack: AdvancedAssessmentPack;
  variantId: string;
}
export type AdvancedAssessmentReviewInput = Pick<AdvancedAssessmentFeedback, 'id' | 'submissionId' | 'status' | 'note' | 'rubricRatings' | 'misconceptions' | 'previousReviewId'>;
const equal = (a: unknown, b: unknown) => documentJSON(a) === documentJSON(b);
const copy = <T>(value: T): T => JSON.parse(documentJSON(value));
const key = (value: { id: string; revision: number }) => `${value.id}@${value.revision}`;
const latest = <T extends { id: string; revision: number }>(values: T[], id: string) =>
  values.filter(value => value.id === id).sort((a, b) => b.revision - a.revision)[0];
function validStudent(id: string) {
  if (!/^[a-z0-9]{1,24}$/.test(id)) throw Error('Select a current learner profile.');
}
function active(state: AdvancedAssessmentLibrary, id: string) {
  validStudent(id);
  if (state.deletedStudentIds.includes(id)) throw Error('This learner profile was deleted.');
}
function own(state: AdvancedAssessmentLibrary, id: string): AdvancedAssessmentLibrary {
  const assignments = state.assignments.filter(value => value.studentId === id);
  const cases = new Set(assignments.map(key));
  const packs = new Set(assignments.map(value => key(value.pack)));
  const submissions = state.submissions.filter(value => value.studentId === id);
  const evidence = new Set(submissions.map(value => value.id));
  return parseAdvancedAssessmentLibrary({
    ...state,
    packReviews: state.packReviews.filter(value => packs.has(value.packKey)),
    packs: state.packs.filter(value => packs.has(key(value))),
    assignments,
    sessions: state.sessions.filter(value => cases.has(`${value.caseId}@${value.caseRevision}`)),
    submissions,
    feedback: state.feedback.filter(value => evidence.has(value.submissionId)),
    deletedStudentIds: [],
    ...(state.pendingReviewIds ? { pendingReviewIds: state.pendingReviewIds.filter(id => evidence.has(state.feedback.find(f=>f.id===id)?.submissionId ?? '')) } : {}),
    ...(state.pendingApproval ? { pendingApproval: state.pendingApproval.filter(value => packs.has(value)) } : {}),
  });
}
/** Only explicit full-profile deletion calls this; roster changes do not erase evidence. */
export function deleteAdvancedAssessmentStudent(input: AdvancedAssessmentLibrary, studentId: string): AdvancedAssessmentLibrary {
  validStudent(studentId);
  const state = parseAdvancedAssessmentLibrary(input);
  const cases = new Set(state.assignments.filter(value => value.studentId === studentId).map(value => value.id));
  const submissions = state.submissions.filter(value => value.studentId !== studentId);
  const evidence = new Set(submissions.map(value => value.id));
  return parseAdvancedAssessmentLibrary({
    ...state,
    assignments: state.assignments.filter(value => value.studentId !== studentId),
    sessions: state.sessions.filter(value => !cases.has(value.caseId)),
    submissions,
    feedback: state.feedback.filter(value => evidence.has(value.submissionId)),
    deletedStudentIds: [...new Set([...state.deletedStudentIds, studentId])],
    ...(state.pendingReviewIds ? {pendingReviewIds: state.pendingReviewIds.filter(id => state.feedback.some(f=>f.id===id&&evidence.has(f.submissionId)))} : {}),
  });
}

/** Independent whole-pack approval is local authority; imported labels are historical data only. */
export function createAdvancedAssessmentStore(io: AdvancedAssessmentEngineIO) {
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
  const checkAdult = async (context: AdvancedAssessmentAdult, id?: string) => {
    if (!equal(context, await adult(id))) throw Error('Adult authority changed. Reload before continuing.');
  };
  const checkLearner = async (context: AdvancedAssessmentLearnerContext) => {
    if (!equal(context, await learnerContext())) throw Error('Learner profile changed. Reload before continuing.');
  };
  const assignment = (state: AdvancedAssessmentLibrary, context: AdvancedAssessmentLearnerContext, id: string, revision: number) => {
    active(state, context.studentId);
    const found = latest(state.assignments, id);
    if (!found || found.studentId !== context.studentId || found.revision !== revision)
      throw Error('This advanced assessment assignment changed or belongs to another learner. Reload before continuing.');
    if (state.pendingApproval?.includes(key(found.pack)))
      throw Error('Restored definitions and source history need fresh adult review before learner work continues.');
    return found;
  };
  const supervisor = {
    async load() {
      const context = await adult();
      const state = parseAdvancedAssessmentLibrary(await io.read());
      await checkAdult(context);
      return state;
    },
    async savePack(input: AdvancedAssessmentPack, expectedRevision: number | null) {
      const { approval: _approval, ...body } = parseAdvancedAssessmentPack(input);
      const context = await adult();
      let result!: AdvancedAssessmentPack;
      await io.update(async previous => {
        const state = parseAdvancedAssessmentLibrary(previous);
        await checkAdult(context);
        const current = latest(state.packs, body.id);
        const candidate = parseAdvancedAssessmentPack({ ...body, revision: (expectedRevision ?? 0) + 1 });
        if (current && current.revision === candidate.revision && equal(current, candidate)) {
          result = current;
          return JSON.stringify(state);
        }
        if ((current?.revision ?? null) !== expectedRevision) throw Error('Assessment source changed. Reload before saving.');
        result = candidate;
        const next = parseAdvancedAssessmentLibrary({ ...state, packs: [...state.packs, result] });
        await checkAdult(context);
        return JSON.stringify(next);
      });
      await checkAdult(context);
      return result;
    },
    async approvePack(id: string, revision: number) {
      const context = await adult();
      let result!: AdvancedAssessmentPack;
      await io.update(async previous => {
        const state = parseAdvancedAssessmentLibrary(previous);
        await checkAdult(context);
        const pending = state.pendingApproval?.includes(`${id}@${revision}`);
        const selected = pending ? state.packs.find(value => value.id === id && value.revision === revision) : latest(state.packs, id);
        if (!selected || selected.revision !== revision) throw Error('Review the latest exact saved assessment source before approval.');
        result = selected.approval ? selected : parseAdvancedAssessmentPack({ ...selected, approval: { at: io.now(), actor: context.actorName } });
        const next = parseAdvancedAssessmentLibrary({
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
    async assign(input: AdvancedAssessmentAssignmentInput, expectedRevision: number | null) {
      const safe = copy(input);
      const context = await adult(safe.studentId);
      let result!: AdvancedAssessmentAssignment;
      await io.update(async previous => {
        const state = parseAdvancedAssessmentLibrary(previous);
        active(state, safe.studentId);
        await checkAdult(context, safe.studentId);
        const current = latest(state.assignments, safe.id);
        if (current && current.studentId !== safe.studentId) throw Error('An advanced assessment assignment cannot change learner identity.');
        const pack = state.packs.find(value => key(value) === key(safe.pack));
        if (!pack?.approval || state.pendingApproval?.includes(key(pack)) || !equal(pack, safe.pack))
          throw Error('Choose an exact locally approved assessment source and source snapshot.');
        const candidate = parseAdvancedAssessmentAssignment({ ...safe, revision: (expectedRevision ?? 0) + 1,
          createdAt: current?.revision === (expectedRevision ?? 0) + 1 ? current.createdAt : io.now() });
        if (current && equal(current, candidate)) { result = current; return JSON.stringify(state); }
        if ((current?.revision ?? null) !== expectedRevision) throw Error('Assignment changed. Reload before reassigning.');
        result = candidate;
        const next = parseAdvancedAssessmentLibrary({ ...state, assignments: [...state.assignments, result] });
        await checkAdult(context, safe.studentId);
        return JSON.stringify(next);
      });
      await checkAdult(context, safe.studentId);
      return result;
    },
    async review(input: AdvancedAssessmentReviewInput) {
      const safe = copy(input);
      const context = await adult();
      let result!: AdvancedAssessmentFeedback;
      let target: string | undefined;
      await io.update(async previous => {
        const state = parseAdvancedAssessmentLibrary(previous);
        const submission = state.submissions.find(value => value.id === safe.submissionId);
        if (!submission) throw Error('Select immutable advanced assessment evidence.');
        target = submission.studentId;
        active(state, target);
        await checkAdult(context, target);
        const existing = state.feedback.find(value => value.id === safe.id);
        result = parseAdvancedAssessmentFeedback({ ...safe, at: existing?.at ?? io.now(), actor: context.actorName });
        if (existing) {
          if (!equal(existing, result)) throw Error('Feedback identity already exists.');
          return JSON.stringify(state);
        }
        if ((state.feedback.filter(f => f.submissionId === safe.submissionId).at(-1)?.id ?? null) !== safe.previousReviewId) throw Error('Review changed. Reload before reviewing.');
        if (state.pendingApproval?.includes(key(submission.assignment.pack))) throw Error('Re-review restored source before recording a new local review.');
        const next = parseAdvancedAssessmentLibrary({ ...state, feedback: [...state.feedback, result] });
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
      const state = parseAdvancedAssessmentLibrary(await io.read());
      active(state, context.studentId);
      await checkLearner(context);
      return own(state, context.studentId);
    },
    async command(caseId: string, caseRevision: number, command: AdvancedAssessmentCommand, eventId: string, expectedRevision: number | null) {
      const safe = copy(command);
      const context = await learnerContext();
      let result!: AdvancedAssessmentSession;
      await io.update(async previous => {
        const state = parseAdvancedAssessmentLibrary(previous);
        const source = assignment(state, context, caseId, caseRevision);
        await checkLearner(context);
        const existing = state.sessions.find(value => value.caseId === caseId && value.caseRevision === caseRevision);
        const event = existing?.events.find(value => value.id === eventId);
        if (event) {
          if (!equal(event.command, safe)) throw Error('AdvancedAssessment event identity already exists.');
          result = existing!;
          return JSON.stringify(state);
        }
        if ((existing?.revision ?? null) !== expectedRevision) throw Error('AdvancedAssessment session changed in another window. Reload before continuing.');
        result = applyAdvancedAssessmentCommand(source, existing ?? createAdvancedAssessmentSession(source, source.createdAt), safe, eventId, io.now());
        const next = parseAdvancedAssessmentLibrary({ ...state, sessions: [...state.sessions.filter(value => value !== existing), result] });
        await checkLearner(context);
        return JSON.stringify(next);
      });
      await checkLearner(context);
      return result;
    },
    async submit(caseId: string, caseRevision: number, id: string, expectedRevision: number | null) {
      const context = await learnerContext();
      let result!: ReturnType<typeof makeAdvancedAssessmentSubmission>;
      await io.update(async previous => {
        const state = parseAdvancedAssessmentLibrary(previous);
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
        if ((session?.revision ?? null) !== expectedRevision) throw Error('AdvancedAssessment session changed. Reload before submitting.');
        result = makeAdvancedAssessmentSubmission(source, session ?? createAdvancedAssessmentSession(source, source.createdAt), id, io.now());
        const next = parseAdvancedAssessmentLibrary({ ...state, submissions: [...state.submissions, result] });
        await checkLearner(context);
        return JSON.stringify(next);
      });
      await checkLearner(context);
      return result;
    },
  };
  return { supervisor, learner };
}
export type AdvancedAssessmentSupervisor = ReturnType<typeof createAdvancedAssessmentStore>['supervisor'];
export type AdvancedAssessmentLearner = ReturnType<typeof createAdvancedAssessmentStore>['learner'];
