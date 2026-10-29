/** Canonical ordering for exact educational source comparison. No browser or storage dependencies. */
export function advancedAssessmentJSON(value: unknown): string {
    let count = 0;
    const active = new Set<object>();
    const visit = (v: unknown, depth: number): string => {
        if (++count > 250000 || depth > 32)
            fail('JSON structure limit');
        if (v === null || typeof v === 'boolean' || typeof v === 'string')
            return JSON.stringify(v);
        if (typeof v === 'number' && Number.isFinite(v))
            return JSON.stringify(v);
        if (!v || typeof v !== 'object' || active.has(v) || (!Array.isArray(v) && ![Object.prototype, null].includes(Object.getPrototypeOf(v))))
            fail('finite acyclic plain JSON required');
        active.add(v);
        try {
            if (Array.isArray(v)) {
                if (Object.keys(v).length !== v.length || Array.from({ length: v.length }, (_, i) => i).some(i => !Object.prototype.hasOwnProperty.call(v, i)))
                    fail('sparse or decorated array');
                return '[' + v.map(x => visit(x, depth + 1)).join(',') + ']';
            }
            return '{' + Object.keys(v).sort().map(k => {
                if (['__proto__', 'constructor', 'prototype'].includes(k))
                    fail('unsafe property');
                return JSON.stringify(k) + ':' + visit((v as Record<string, unknown>)[k], depth + 1);
            }).join(',') + '}';
        }
        finally {
            active.delete(v);
        }
    };
    return visit(value, 0);
}
import { scoreAdvancedAssessmentV1, type AdvancedAssessmentComputedFeedback } from './advancedAssessmentScoringV1';
export const ADVANCED_ASSESSMENT_DISCLAIMER = 'Educational feedback only, not a qualification or automatic academic grade. Local history and assistance declarations do not establish identity, proctoring or tamper-proof integrity. Oral evidence is reviewed by a person, not voice-scored. Do not include confidential information.';
export const ADVANCED_ASSESSMENT_LIMITS = { bytes: 32 * 1024 * 1024, packBytes: 256 * 1024, events: 200, audioBytes: 1024 * 1024 } as const;
export type AdvancedAssessmentExpected = {
    kind: 'number';
    value: number;
    tolerance: number;
} | {
    kind: 'text';
    accepted: string[];
};
export interface AdvancedAssessmentStep {
    id: string;
    prompt: string;
    expected?: AdvancedAssessmentExpected;
    misconceptions: {
        misconceptionId: string;
        accepted: string[];
    }[];
}
export type AdvancedAssessmentQuestion = {
    kind: 'math';
    id: string;
    prompt: string;
    steps: AdvancedAssessmentStep[];
} | {
    kind: 'oral';
    id: string;
    prompt: string;
};
export interface AdvancedAssessmentPack {
    format: 'erudior-advanced-assessment-pack';
    version: 1;
    id: string;
    revision: number;
    title: string;
    description: string;
    sourceNote: string;
    instructions: string;
    integrity: string;
    rubric: {
        id: string;
        revision: number;
        title: string;
        criteria: {
            id: string;
            title: string;
            levels: {
                id: string;
                points: number;
                label: string;
                description: string;
            }[];
        }[];
    };
    misconceptions: {
        id: string;
        title: string;
        explanation: string;
    }[];
    variants: {
        id: string;
        title: string;
        questions: AdvancedAssessmentQuestion[];
    }[];
    approval?: {
        actor: string;
        at: string;
    };
}
export interface AdvancedAssessmentAssignment {
    id: string;
    revision: number;
    studentId: string;
    title: string;
    instructions: string;
    pack: AdvancedAssessmentPack;
    variantId: string;
    createdAt: string;
}
export interface AdvancedAssessmentAudio {
    mime: string;
    data: string;
    seconds: number;
}
export type AdvancedAssessmentCommand = {
    kind: 'math';
    questionId: string;
    stepId: string;
    answer: string;
    reasoning: string;
} | {
    kind: 'oral';
    questionId: string;
    transcript: string;
    audio?: AdvancedAssessmentAudio;
} | {
    kind: 'assistance';
    text: string;
};
export interface AdvancedAssessmentEvent {
    id: string;
    at: string;
    command: AdvancedAssessmentCommand;
}
export interface AdvancedAssessmentSession {
    caseId: string;
    caseRevision: number;
    revision: number;
    events: AdvancedAssessmentEvent[];
    updatedAt: string;
}
export interface AdvancedAssessmentSubmission {
    id: string;
    caseId: string;
    caseRevision: number;
    studentId: string;
    submittedAt: string;
    assignment: AdvancedAssessmentAssignment;
    session: AdvancedAssessmentSession;
    feedback: AdvancedAssessmentComputedFeedback;
}
export interface AdvancedAssessmentFeedback {
    id: string;
    submissionId: string;
    at: string;
    actor: string;
    status: 'reviewed' | 'needs_revision';
    note: string;
    previousReviewId: string | null;
    rubricRatings: {
        criterionId: string;
        levelId: string;
        note: string;
    }[];
    misconceptions: {
        misconceptionId: string;
        questionId: string;
        stepId?: string;
        note: string;
    }[];
}
export interface AdvancedAssessmentPackReview {
    packKey: string;
    actor: string;
    at: string;
}
export interface AdvancedAssessmentLibrary {
    format: 'erudior-advanced-assessment-library';
    version: 1;
    packs: AdvancedAssessmentPack[];
    assignments: AdvancedAssessmentAssignment[];
    sessions: AdvancedAssessmentSession[];
    submissions: AdvancedAssessmentSubmission[];
    feedback: AdvancedAssessmentFeedback[];
    packReviews: AdvancedAssessmentPackReview[];
    deletedStudentIds: string[];
    restoredAt?: string;
    pendingApproval?: string[];
    pendingReviewIds?: string[];
}
export type AdvancedAssessmentResponse = Exclude<AdvancedAssessmentCommand, {
    kind: 'assistance';
}> & {
    eventId: string;
};
export interface AdvancedAssessmentState {
    responses: AdvancedAssessmentResponse[];
    assistance: string;
    complete: boolean;
}
const copy = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const equal = (a: unknown, b: unknown) => advancedAssessmentJSON(a) === advancedAssessmentJSON(b);
const key = (v: {
    id: string;
    revision: number;
}) => `${v.id}@${v.revision}`;
function fail(s: string): never { throw Error('Invalid advanced assessment: ' + s); }
function obj(v: unknown, keys: string[], at: string): asserts v is Record<string, unknown> {
    if (!v || typeof v !== 'object' || Array.isArray(v) || ![Object.prototype, null].includes(Object.getPrototypeOf(v)) || Object.keys(v).some(k => !keys.includes(k)))
        fail(at + ' unsupported fields');
}
function text(v: unknown, at: string, max = 5000): asserts v is string {
    if (typeof v !== 'string' || !v.trim() || v.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v))
        fail(at + ' bounded text');
}
function id(v: unknown, at: string): asserts v is string {
    if (typeof v !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$/.test(v) || ['constructor', 'prototype', '__proto__'].includes(v))
        fail(at + ' identity');
}
function int(v: unknown, at: string, min = 0, max = 100000): asserts v is number {
    if (!Number.isSafeInteger(v) || Number(v) < min || Number(v) > max)
        fail(at + ' bounded integer');
}
function arr(v: unknown, at: string, max: number, min = 0): asserts v is unknown[] {
    if (!Array.isArray(v) || v.length < min || v.length > max)
        fail(at + ' list bounds');
}
function unique(v: string[], at: string) {
    if (new Set(v).size !== v.length)
        fail(at + ' duplicate identities');
}
function stamp(v: unknown, at: string): asserts v is string {
    if (typeof v !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(v) || !Number.isFinite(Date.parse(v)) || new Date(v).toISOString().slice(0, 10) !== v.slice(0, 10))
        fail(at + ' timestamp');
}
function decode(input: unknown, max: number = ADVANCED_ASSESSMENT_LIMITS.bytes): unknown {
    let v = input;
    if (typeof v === 'string') {
        if (new TextEncoder().encode(v).length > max)
            fail('byte limit');
        try {
            v = JSON.parse(v);
        }
        catch {
            fail('malformed JSON');
        }
    }
    try {
        if (new TextEncoder().encode(advancedAssessmentJSON(v)).length > max)
            fail('byte limit');
    }
    catch {
        fail('invalid or oversized JSON');
    }
    return v;
}
function num(v: unknown, at: string, min = -1e9, max = 1e9): asserts v is number {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max)
        fail(at + ' finite numeric bounds');
}
function strings(v: unknown, at: string, max = 20) { arr(v, at, max, 1); for (const x of v)
    text(x, at, 500); unique(v as string[], at); }
export function parseAdvancedAssessmentPack(input: unknown): AdvancedAssessmentPack {
    const v = decode(input, ADVANCED_ASSESSMENT_LIMITS.packBytes);
    obj(v, ['format', 'version', 'id', 'revision', 'title', 'description', 'sourceNote', 'instructions', 'integrity', 'rubric', 'misconceptions', 'variants', 'approval'], 'pack');
    if (v.format !== 'erudior-advanced-assessment-pack' || v.version !== 1)
        fail('pack format/version');
    id(v.id, 'pack');
    int(v.revision, 'revision');
    for (const k of ['title', 'description', 'sourceNote', 'instructions', 'integrity'])
        text(v[k], k, k === 'title' ? 300 : 5000);
    obj(v.rubric, ['id', 'revision', 'title', 'criteria'], 'rubric');
    id(v.rubric.id, 'rubric');
    int(v.rubric.revision, 'rubric revision', 1);
    text(v.rubric.title, 'rubric title', 300);
    arr(v.rubric.criteria, 'criteria', 20, 1);
    for (const c of v.rubric.criteria) {
        obj(c, ['id', 'title', 'levels'], 'criterion');
        id(c.id, 'criterion');
        text(c.title, 'criterion title', 300);
        arr(c.levels, 'levels', 10, 2);
        for (const l of c.levels) {
            obj(l, ['id', 'points', 'label', 'description'], 'level');
            id(l.id, 'level');
            int(l.points, 'level points', 0, 100);
            text(l.label, 'level label', 300);
            text(l.description, 'level description');
        }
        unique(c.levels.map(l => (l as {
            id: string;
        }).id), 'levels');
        unique(c.levels.map(l => String((l as {
            points: number;
        }).points)), 'level points');
    }
    unique(v.rubric.criteria.map(c => (c as {
        id: string;
    }).id), 'criteria');
    arr(v.misconceptions, 'misconceptions', 30);
    for (const m of v.misconceptions) {
        obj(m, ['id', 'title', 'explanation'], 'misconception');
        id(m.id, 'misconception');
        text(m.title, 'misconception title', 300);
        text(m.explanation, 'misconception explanation');
    }
    unique(v.misconceptions.map(m => (m as {
        id: string;
    }).id), 'misconceptions');
    const misconceptionIds = v.misconceptions.map(m => (m as {
        id: string;
    }).id);
    arr(v.variants, 'variants', 12, 1);
    for (const variant of v.variants) {
        obj(variant, ['id', 'title', 'questions'], 'variant');
        id(variant.id, 'variant');
        text(variant.title, 'variant title', 300);
        arr(variant.questions, 'questions', 30, 1);
        for (const q of variant.questions) {
            obj(q, ['kind', 'id', 'prompt', ...(q && typeof q === 'object' && (q as {
                    kind?: unknown;
                }).kind === 'math' ? ['steps'] : [])], 'question');
            id(q.id, 'question');
            text(q.prompt, 'question prompt');
            if (q.kind === 'math') {
                arr(q.steps, 'steps', 20, 1);
                for (const s of q.steps) {
                    obj(s, ['id', 'prompt', 'expected', 'misconceptions'], 'step');
                    id(s.id, 'step');
                    text(s.prompt, 'step prompt');
                    if (s.expected !== undefined) {
                        obj(s.expected, ['kind', 'value', 'tolerance', 'accepted'], 'expected response');
                        if (s.expected.kind === 'number') {
                            obj(s.expected, ['kind', 'value', 'tolerance'], 'number expectation');
                            num(s.expected.value, 'expected value');
                            num(s.expected.tolerance, 'absolute tolerance', 0, 1e6);
                        }
                        else if (s.expected.kind === 'text') {
                            obj(s.expected, ['kind', 'accepted'], 'text expectation');
                            strings(s.expected.accepted, 'accepted responses');
                        }
                        else
                            fail('expected kind');
                    }
                    arr(s.misconceptions, 'step misconceptions', 30);
                    for (const m of s.misconceptions) {
                        obj(m, ['misconceptionId', 'accepted'], 'mapping');
                        if (!misconceptionIds.includes(String(m.misconceptionId)))
                            fail('unknown misconception');
                        strings(m.accepted, 'mapped responses');
                    }
                    unique(s.misconceptions.map(m => (m as {
                        misconceptionId: string;
                    }).misconceptionId), 'mapped misconceptions');
                }
                unique(q.steps.map(s => (s as {
                    id: string;
                }).id), 'steps');
            }
            else if (q.kind !== 'oral')
                fail('question kind');
        }
        unique(variant.questions.map(q => (q as {
            id: string;
        }).id), 'questions');
    }
    unique(v.variants.map(v => (v as {
        id: string;
    }).id), 'variants');
    if (v.approval !== undefined) {
        obj(v.approval, ['actor', 'at'], 'approval');
        text(v.approval.actor, 'reviewer', 300);
        stamp(v.approval.at, 'approval');
        if (v.revision < 1)
            fail('unsaved approval');
    }
    return copy(v as unknown as AdvancedAssessmentPack);
}
export function emptyAdvancedAssessmentPack(id: string): AdvancedAssessmentPack { return { format: 'erudior-advanced-assessment-pack', version: 1, id, revision: 0, title: 'Untitled educational assessment', description: 'Replace with the assessment purpose.', sourceNote: 'Author-created educational assessment; review before assignment.', instructions: 'Explain each response and declare assistance.', integrity: 'Declare any assistance. This local record is not proctoring or identity verification.', rubric: { id: 'reasoning', revision: 1, title: 'Reasoning and communication', criteria: [{ id: 'explanation', title: 'Evidence-based explanation', levels: [{ id: 'developing', points: 0, label: 'Developing', description: 'Explanation needs clarification.' }, { id: 'supported', points: 1, label: 'Supported', description: 'Explanation supports the response.' }] }] }, misconceptions: [], variants: [{ id: 'a', title: 'Variant A', questions: [{ kind: 'math', id: 'reason', prompt: 'Show and explain the steps for an instructor-authored task.', steps: [{ id: 'first', prompt: 'Record the first step.', misconceptions: [] }, { id: 'second', prompt: 'Explain the next step.', misconceptions: [] }] }, { kind: 'oral', id: 'explain', prompt: 'Explain your reasoning aloud; provide a transcript or a transcript with optional audio.' }] }] }; }
export function exportAdvancedAssessmentPack(p: AdvancedAssessmentPack): string { const { approval: _, ...v } = parseAdvancedAssessmentPack(p); return JSON.stringify(v, null, 2); }
export function importAdvancedAssessmentPack(input: unknown, newId?: string): AdvancedAssessmentPack { const { approval: _, ...v } = parseAdvancedAssessmentPack(input); return parseAdvancedAssessmentPack({ ...v, id: newId ?? v.id, revision: 0 }); }
export function parseAdvancedAssessmentAssignment(input: unknown): AdvancedAssessmentAssignment { const v = decode(input); obj(v, ['id', 'revision', 'studentId', 'title', 'instructions', 'pack', 'variantId', 'createdAt'], 'assignment'); id(v.id, 'assignment'); int(v.revision, 'assignment revision', 1); id(v.studentId, 'learner'); text(v.title, 'assignment title', 300); text(v.instructions, 'instructions', 10000); stamp(v.createdAt, 'assignment'); const pack = parseAdvancedAssessmentPack(v.pack); if (!pack.approval || Date.parse(v.createdAt) < Date.parse(pack.approval.at))
    fail('assignment requires prior source review'); if (!pack.variants.some(x => x.id === v.variantId))
    fail('assigned variant missing'); return { ...copy(v as unknown as AdvancedAssessmentAssignment), pack }; }
function audio(v: unknown) { obj(v, ['mime', 'data', 'seconds'], 'audio'); if (!['audio/webm', 'audio/webm;codecs=opus', 'audio/ogg', 'audio/ogg;codecs=opus', 'audio/mp4', 'audio/wav'].includes(String(v.mime)))
    fail('audio MIME'); num(v.seconds, 'audio seconds', 0.001, 30); if (typeof v.data !== 'string' || !v.data.length || v.data.length > Math.ceil(ADVANCED_ASSESSMENT_LIMITS.audioBytes / 3) * 4 || v.data.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(v.data))
    fail('bounded audio base64'); const size = v.data.length / 4 * 3 - (v.data.endsWith('==') ? 2 : v.data.endsWith('=') ? 1 : 0); if (size > ADVANCED_ASSESSMENT_LIMITS.audioBytes)
    fail('audio bytes'); const raw = atob(v.data.slice(0, 32)); const signature = String(v.mime).startsWith('audio/webm') ? raw.startsWith(String.fromCharCode(0x1a, 0x45, 0xdf, 0xa3)) : String(v.mime).startsWith('audio/ogg') ? raw.startsWith('OggS') : v.mime === 'audio/wav' ? raw.startsWith('RIFF') && raw.slice(8, 12) === 'WAVE' : raw.slice(4, 8) === 'ftyp'; if (!signature)
    fail('audio container signature'); }
export function parseAdvancedAssessmentCommand(input: unknown, a: AdvancedAssessmentAssignment): AdvancedAssessmentCommand { const v = decode(input, 2 * 1024 * 1024); if (!v || typeof v !== 'object')
    fail('command'); const k = (v as {
    kind?: unknown;
}).kind; if (k === 'assistance') {
    obj(v, ['kind', 'text'], 'assistance');
    text(v.text, 'assistance');
}
else {
    obj(v, k === 'math' ? ['kind', 'questionId', 'stepId', 'answer', 'reasoning'] : ['kind', 'questionId', 'transcript', 'audio'], 'response');
    const q = a.pack.variants.find(x => x.id === a.variantId)!.questions.find(q => q.id === v.questionId);
    if (!q || q.kind !== k)
        fail('response source');
    if (k === 'math' && q.kind === 'math') {
        if (!q.steps.some(s => s.id === v.stepId))
            fail('unknown step');
        text(v.answer, 'answer', 2000);
        text(v.reasoning, 'reasoning');
    }
    else if (k === 'oral') {
        text(v.transcript, 'oral transcript', 10000);
        if (v.audio !== undefined)
            audio(v.audio);
    }
    else
        fail('command kind');
} return copy(v as unknown as AdvancedAssessmentCommand); }
function initial(): AdvancedAssessmentState { return { responses: [], assistance: '', complete: false }; }
function command(s: AdvancedAssessmentState, a: AdvancedAssessmentAssignment, c: AdvancedAssessmentCommand, eventId: string) { if (c.kind === 'assistance')
    s.assistance = c.text;
else {
    s.responses = s.responses.filter(r => !(r.questionId === c.questionId && (r.kind === 'oral' || (r.kind === 'math' && c.kind === 'math' && r.stepId === c.stepId))));
    s.responses.push({ ...copy(c), eventId });
} const questions = a.pack.variants.find(v => v.id === a.variantId)!.questions; s.complete = !!s.assistance && questions.every(q => q.kind === 'oral' ? s.responses.some(r => r.kind === 'oral' && r.questionId === q.id) : q.steps.every(step => s.responses.some(r => r.kind === 'math' && r.questionId === q.id && r.stepId === step.id))); }
export function createAdvancedAssessmentSession(a: AdvancedAssessmentAssignment, at = a.createdAt): AdvancedAssessmentSession { return { caseId: a.id, caseRevision: a.revision, revision: 0, events: [], updatedAt: at }; }
export function parseAdvancedAssessmentSession(input: unknown, assignment: AdvancedAssessmentAssignment): AdvancedAssessmentSession {
    const v = decode(input);
    obj(v, ['caseId', 'caseRevision', 'revision', 'events', 'updatedAt'], 'session');
    if (v.caseId !== assignment.id || v.caseRevision !== assignment.revision)
        fail('session source identity');
    int(v.revision, 'session revision', 0, ADVANCED_ASSESSMENT_LIMITS.events);
    arr(v.events, 'events', ADVANCED_ASSESSMENT_LIMITS.events);
    if (v.revision !== v.events.length)
        fail('session revision must match append-only event count');
    stamp(v.updatedAt, 'session');
    let previous = Date.parse(assignment.createdAt);
    const events = v.events.map(e => {
        obj(e, ['id', 'at', 'command'], 'event');
        id(e.id, 'event');
        stamp(e.at, 'event');
        if (Date.parse(e.at) < previous)
            fail('event time order');
        previous = Date.parse(e.at);
        return { id: e.id, at: e.at, command: parseAdvancedAssessmentCommand(e.command, assignment) };
    });
    unique(events.map(e => e.id), 'events');
    if (Date.parse(v.updatedAt) !== previous)
        fail('updated timestamp must match last event');
    const result = { ...copy(v as unknown as AdvancedAssessmentSession), events };
    const s = initial();
    for (const e of events)
        command(s, assignment, e.command, e.id);
    return result;
}
export function replayAdvancedAssessmentSession(a: AdvancedAssessmentAssignment, input: AdvancedAssessmentSession): AdvancedAssessmentState {
    const source = parseAdvancedAssessmentAssignment(a), session = parseAdvancedAssessmentSession(input, source);
    const state = initial();
    for (const event of session.events)
        command(state, source, event.command, event.id);
    return state;
}
export function applyAdvancedAssessmentCommand(a: AdvancedAssessmentAssignment, input: AdvancedAssessmentSession, value: AdvancedAssessmentCommand, eventId: string, at: string): AdvancedAssessmentSession { const source = parseAdvancedAssessmentAssignment(a), session = parseAdvancedAssessmentSession(input, source); id(eventId, 'event'); stamp(at, 'event'); return parseAdvancedAssessmentSession({ ...session, revision: session.revision + 1, events: [...session.events, { id: eventId, at, command: parseAdvancedAssessmentCommand(value, source) }], updatedAt: at }, source); }
export function makeAdvancedAssessmentSubmission(a: AdvancedAssessmentAssignment, s: AdvancedAssessmentSession, id: string, submittedAt: string): AdvancedAssessmentSubmission { return parseAdvancedAssessmentSubmission({ id, caseId: a.id, caseRevision: a.revision, studentId: a.studentId, submittedAt, assignment: a, session: s, feedback: scoreAdvancedAssessmentV1(a, replayAdvancedAssessmentSession(a, s)) }); }
export function parseAdvancedAssessmentSubmission(input: unknown): AdvancedAssessmentSubmission {
    const v = decode(input);
    obj(v, ['id', 'caseId', 'caseRevision', 'studentId', 'submittedAt', 'assignment', 'session', 'feedback'], 'submission');
    id(v.id, 'submission');
    stamp(v.submittedAt, 'submission');
    const assignment = parseAdvancedAssessmentAssignment(v.assignment), session = parseAdvancedAssessmentSession(v.session, assignment);
    if (v.caseId !== assignment.id || v.caseRevision !== assignment.revision || v.studentId !== assignment.studentId || Date.parse(v.submittedAt) < Date.parse(session.updatedAt))
        fail('submission identity/time');
    const feedback = scoreAdvancedAssessmentV1(assignment, replayAdvancedAssessmentSession(assignment, session));
    if (!equal(v.feedback, feedback))
        fail('computed feedback does not match frozen V1 replay');
    return { ...copy(v as unknown as AdvancedAssessmentSubmission), assignment, session, feedback };
}
export function parseAdvancedAssessmentFeedback(input: unknown): AdvancedAssessmentFeedback {
    const v = decode(input, 50000);
    obj(v, ['id', 'submissionId', 'at', 'actor', 'status', 'note', 'previousReviewId', 'rubricRatings', 'misconceptions'], 'feedback');
    id(v.id, 'feedback');
    id(v.submissionId, 'submission');
    stamp(v.at, 'feedback');
    text(v.actor, 'reviewer', 300);
    text(v.note, 'feedback', 10000);
    if (v.status !== 'reviewed' && v.status !== 'needs_revision')
        fail('review status');
    if (v.previousReviewId !== null)
        id(v.previousReviewId, 'previous review');
    arr(v.rubricRatings, 'rubric ratings', 20, 1);
    for (const r of v.rubricRatings) {
        obj(r, ['criterionId', 'levelId', 'note'], 'rating');
        id(r.criterionId, 'criterion');
        id(r.levelId, 'level');
        text(r.note, 'rating explanation');
    }
    unique(v.rubricRatings.map(r => (r as {
        criterionId: string;
    }).criterionId), 'ratings');
    arr(v.misconceptions, 'review observations', 30);
    for (const m of v.misconceptions) {
        obj(m, ['misconceptionId', 'questionId', 'stepId', 'note'], 'review observation');
        id(m.misconceptionId, 'misconception');
        id(m.questionId, 'question');
        if (m.stepId !== undefined)
            id(m.stepId, 'step');
        text(m.note, 'observation');
    }
    return copy(v as unknown as AdvancedAssessmentFeedback);
}
export function parseAdvancedAssessmentLibrary(input: unknown): AdvancedAssessmentLibrary {
    if (input === null || input === undefined)
        return { format: 'erudior-advanced-assessment-library', version: 1, packs: [], assignments: [], sessions: [], submissions: [], feedback: [], packReviews: [], deletedStudentIds: [] };
    const v = decode(input);
    obj(v, ['format', 'version', 'packs', 'assignments', 'sessions', 'submissions', 'feedback', 'packReviews', 'deletedStudentIds', 'restoredAt', 'pendingApproval', 'pendingReviewIds'], 'library');
    if (v.format !== 'erudior-advanced-assessment-library' || v.version !== 1)
        fail('library format/version');
    for (const [field, max] of [['packs', 100], ['assignments', 300], ['sessions', 300], ['submissions', 600], ['feedback', 1200], ['packReviews', 1000], ['deletedStudentIds', 1000]] as const)
        arr(v[field], field, max);
    const packs = (v.packs as unknown[]).map(parseAdvancedAssessmentPack);
    if (packs.some(p => p.revision < 1))
        fail('unsaved library pack');
    const assignments = (v.assignments as unknown[]).map(parseAdvancedAssessmentAssignment);
    unique(packs.map(key), 'pack revisions');
    unique(assignments.map(key), 'assignment revisions');
    for (const a of assignments) {
        const p = packs.find(p => key(p) === key(a.pack));
        if (!p || !equal(p, a.pack))
            fail('assignment exact source missing');
        if (assignments.some(x => x.id === a.id && x.studentId !== a.studentId))
            fail('assignment learner changed');
    }
    const sessions = (v.sessions as unknown[]).map(s => {
        const raw = s as AdvancedAssessmentSession;
        const a = assignments.find(a => a.id === raw?.caseId && a.revision === raw?.caseRevision);
        if (!a)
            fail('orphan session');
        return parseAdvancedAssessmentSession(s, a);
    });
    unique(sessions.map(s => `${s.caseId}@${s.caseRevision}`), 'sessions');
    const submissions = (v.submissions as unknown[]).map(parseAdvancedAssessmentSubmission);
    unique(submissions.map(s => s.id), 'submissions');
    for (const s of submissions) {
        const a = assignments.find(a => key(a) === key(s.assignment));
        if (!a || !equal(a, s.assignment))
            fail('submission exact assignment missing');
        const session = sessions.find(x => x.caseId === s.caseId && x.caseRevision === s.caseRevision);
        if (!session && s.session.events.length)
            fail('submitted journal has no resumable session');
        if (session && (session.events.length < s.session.events.length || !equal(session.events.slice(0, s.session.events.length), s.session.events)))
            fail('submission history is not a session prefix');
    }
    const feedback = (v.feedback as unknown[]).map(parseAdvancedAssessmentFeedback);
    unique(feedback.map(f => f.id), 'feedback');
    for (const f of feedback) {
        const s = submissions.find(s => s.id === f.submissionId);
        if (!s || Date.parse(f.at) < Date.parse(s.submittedAt))
            fail('feedback evidence/time');
        const prior = feedback.slice(0, feedback.indexOf(f)).filter(x => x.submissionId === f.submissionId).at(-1);
        if (f.previousReviewId !== (prior?.id ?? null) || prior && Date.parse(f.at) < Date.parse(prior.at))
            fail('review lineage/time');
        const rubric = s.assignment.pack.rubric;
        if (f.rubricRatings.length !== rubric.criteria.length || f.rubricRatings.some(r => !rubric.criteria.some(c => c.id === r.criterionId && c.levels.some(l => l.id === r.levelId))))
            fail('review rubric differs from evidence');
        const state = replayAdvancedAssessmentSession(s.assignment, s.session), questions = s.assignment.pack.variants.find(v => v.id === s.assignment.variantId)!.questions;
        for (const m of f.misconceptions) {
            const q = questions.find(q => q.id === m.questionId);
            if (!s.assignment.pack.misconceptions.some(x => x.id === m.misconceptionId) || !q || m.stepId !== undefined && (q.kind !== 'math' || !q.steps.some(x => x.id === m.stepId)) || !state.responses.some(r => r.questionId === m.questionId && (m.stepId === undefined || r.kind === 'math' && r.stepId === m.stepId)))
                fail('review observation must reference captured evidence');
        }
    }
    for (const d of v.deletedStudentIds as unknown[])
        id(d, 'deleted learner');
    unique(v.deletedStudentIds as string[], 'deleted learners');
    if (assignments.some(a => (v.deletedStudentIds as string[]).includes(a.studentId)))
        fail('deleted learner evidence retained');
    const reviews = v.packReviews as unknown[];
    for (const r of reviews) {
        obj(r, ['packKey', 'actor', 'at'], 'pack review');
        text(r.actor, 'reviewer', 300);
        stamp(r.at, 'review');
        if (!packs.some(p => key(p) === r.packKey && p.approval))
            fail('review pack missing');
    }
    if (v.restoredAt !== undefined)
        stamp(v.restoredAt, 'restore');
    if (v.pendingApproval !== undefined) {
        arr(v.pendingApproval, 'pending approvals', 100);
        unique(v.pendingApproval as string[], 'pending approvals');
        for (const k of v.pendingApproval)
            if (!packs.some(p => key(p) === k))
                fail('unknown quarantined pack');
    }
    if (v.pendingReviewIds !== undefined) {
        arr(v.pendingReviewIds, 'quarantined reviews', 1200);
        unique(v.pendingReviewIds as string[], 'quarantined reviews');
        for (const id of v.pendingReviewIds)
            if (!feedback.some(f => f.id === id))
                fail('unknown quarantined review');
    }
    // A rubric identity/revision is immutable even across source package revisions.
    for (const p of packs)
        for (const other of packs)
            if (p.id === other.id && p.rubric.id === other.rubric.id) {
                if (p.rubric.revision === other.rubric.revision && !equal(p.rubric, other.rubric))
                    fail('changed rubric requires new rubric revision');
                if (p.revision > other.revision && p.rubric.revision < other.rubric.revision)
                    fail('rubric revision cannot decrease');
            }
    return { ...copy(v as unknown as AdvancedAssessmentLibrary), packs, assignments, sessions, submissions, feedback };
}
