/** Canonical ordering for exact educational source comparison. No browser or storage dependencies. */
export function branchingJSON(value: unknown): string {
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
            return '{' + Object.keys(v).sort().map(k => { if (['__proto__', 'constructor', 'prototype'].includes(k))
                fail('unsafe property'); return JSON.stringify(k) + ':' + visit((v as Record<string, unknown>)[k], depth + 1); }).join(',') + '}';
        }
        finally {
            active.delete(v);
        }
    };
    return visit(value, 0);
}
export const BRANCHING_DISCLAIMER = 'Fictional educational simulation only. Simulated ticks are not real deadlines. No legal, medical, financial or professional advice or credit. Do not enter confidential information.';
export const BRANCHING_LIMITS = { bytes: 16 * 1024 * 1024, packBytes: 256 * 1024, packs: 100, assignments: 300, sessions: 300, submissions: 600, feedback: 1200, events: 300 } as const;
export interface BranchingCondition {
    variable: string;
    op: 'eq' | 'ne' | 'gte' | 'lte';
    value: number | boolean;
}
export interface BranchingEffect {
    variable: string;
    op: 'set' | 'add';
    value: number | boolean;
}
export interface BranchingChoice {
    id: string;
    title: string;
    to: string;
    costTicks: number;
    conditions: BranchingCondition[];
    effects: BranchingEffect[];
    consequence: string;
}
export interface BranchingNode {
    id: string;
    title: string;
    text: string;
    terminal?: 'success' | 'adverse' | 'neutral';
    choices: BranchingChoice[];
}
export interface BranchingVariable {
    id: string;
    title: string;
    initial: number | boolean;
    min?: number;
    max?: number;
}
export interface BranchingMilestone {
    id: string;
    title: string;
    nodeId: string;
    deadlineTick: number;
    required: boolean;
    consequence: string;
    onMiss: BranchingEffect[];
}
export interface BranchingPack {
    format: 'erudior-branching-pack';
    version: 1;
    id: string;
    revision: number;
    title: string;
    description: string;
    sourceNote: string;
    timeUnit: string;
    maxTick: number;
    startNodeId: string;
    variables: BranchingVariable[];
    nodes: BranchingNode[];
    milestones: BranchingMilestone[];
    approval?: {
        actor: string;
        at: string;
    };
}
export interface BranchingAssignment {
    id: string;
    revision: number;
    studentId: string;
    title: string;
    instructions: string;
    startTick: number;
    pack: BranchingPack;
    createdAt: string;
}
export type BranchingCommand = {
    kind: 'choice';
    choiceId: string;
    note: string;
} | {
    kind: 'advance';
    tick: number;
    note: string;
};
export interface BranchingEvent {
    id: string;
    at: string;
    command: BranchingCommand;
}
export interface BranchingSession {
    caseId: string;
    caseRevision: number;
    revision: number;
    events: BranchingEvent[];
    updatedAt: string;
}
export interface BranchingSubmission {
    id: string;
    caseId: string;
    caseRevision: number;
    studentId: string;
    submittedAt: string;
    assignment: BranchingAssignment;
    session: BranchingSession;
}
export interface BranchingFeedback {
    id: string;
    submissionId: string;
    at: string;
    actor: string;
    status: 'reviewed' | 'needs_revision';
    note: string;
}
export interface BranchingPackReview {
    packKey: string;
    actor: string;
    at: string;
}
export interface BranchingLibrary {
    format: 'erudior-branching-library';
    version: 1;
    packs: BranchingPack[];
    assignments: BranchingAssignment[];
    sessions: BranchingSession[];
    submissions: BranchingSubmission[];
    feedback: BranchingFeedback[];
    packReviews: BranchingPackReview[];
    deletedStudentIds: string[];
    restoredAt?: string;
    pendingApproval?: string[];
}
export interface BranchingState {
    nodeId: string;
    tick: number;
    values: Record<string, number | boolean>;
    visited: string[];
    milestones: Record<string, 'pending' | 'completed' | 'missed'>;
    timeline: {
        tick: number;
        text: string;
        kind: 'start' | 'choice' | 'deadline' | 'milestone' | 'advance';
    }[];
    outcome: 'in-progress' | 'success' | 'adverse' | 'neutral' | 'incomplete';
    terminalOutcome?: 'success' | 'adverse' | 'neutral';
}
const copy = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const equal = (a: unknown, b: unknown) => branchingJSON(a) === branchingJSON(b);
const key = (v: {
    id: string;
    revision: number;
}) => `${v.id}@${v.revision}`;
function fail(s: string): never { throw Error('Invalid educational scenario: ' + s); }
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
function decode(input: unknown, max: number = BRANCHING_LIMITS.bytes): unknown {
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
        if (new TextEncoder().encode(branchingJSON(v)).length > max)
            fail('byte limit');
    }
    catch {
        fail('invalid or oversized JSON');
    }
    return v;
}
function conditions(v: unknown, variables: BranchingVariable[]) {
    arr(v, 'conditions', 30);
    for (const c of v) {
        obj(c, ['variable', 'op', 'value'], 'condition');
        const variable = variables.find(x => x.id === c.variable);
        if (!variable || !['eq', 'ne', 'gte', 'lte'].includes(String(c.op)) || typeof c.value !== typeof variable.initial)
            fail('condition type or variable');
        if (typeof c.value === 'number')
            int(c.value, 'condition value', -1000000, 1000000);
        else if (!['eq', 'ne'].includes(String(c.op)))
            fail('boolean comparison');
    }
}
function effects(v: unknown, variables: BranchingVariable[]) {
    arr(v, 'effects', 30);
    for (const e of v) {
        obj(e, ['variable', 'op', 'value'], 'effect');
        const variable = variables.find(x => x.id === e.variable);
        if (!variable || !['set', 'add'].includes(String(e.op)) || typeof e.value !== typeof variable.initial)
            fail('effect type or variable');
        if (typeof e.value === 'number') {
            int(e.value, 'effect value', -1000000, 1000000);
            if (e.op === 'set' && (e.value < variable.min! || e.value > variable.max!))
                fail('set outside variable bounds');
        }
        else if (e.op !== 'set')
            fail('boolean add');
    }
    unique(v.map(x => (x as BranchingEffect).variable), 'effect variable');
}
export function parseBranchingPack(input: unknown): BranchingPack {
    const v = decode(input, BRANCHING_LIMITS.packBytes);
    obj(v, ['format', 'version', 'id', 'revision', 'title', 'description', 'sourceNote', 'timeUnit', 'maxTick', 'startNodeId', 'variables', 'nodes', 'milestones', 'approval'], 'pack');
    if (v.format !== 'erudior-branching-pack' || v.version !== 1)
        fail('pack format/version');
    id(v.id, 'pack');
    int(v.revision, 'pack revision');
    text(v.title, 'title', 300);
    text(v.description, 'description');
    text(v.sourceNote, 'source provenance');
    text(v.timeUnit, 'simulated time unit', 80);
    int(v.maxTick, 'maximum simulated tick', 1);
    id(v.startNodeId, 'start node');
    arr(v.variables, 'variables', 30);
    for (const x of v.variables) {
        obj(x, ['id', 'title', 'initial', 'min', 'max'], 'variable');
        id(x.id, 'variable');
        text(x.title, 'variable title', 300);
        if (typeof x.initial === 'number') {
            int(x.min, 'variable minimum', -1000000, 1000000);
            int(x.max, 'variable maximum', -1000000, 1000000);
            int(x.initial, 'initial variable', x.min, x.max);
        }
        else if (typeof x.initial !== 'boolean' || x.min !== undefined || x.max !== undefined)
            fail('variable type or bounds');
    }
    const variables = v.variables as unknown as BranchingVariable[];
    unique(variables.map(x => x.id), 'variables');
    arr(v.nodes, 'nodes', 100, 1);
    for (const n of v.nodes) {
        obj(n, ['id', 'title', 'text', 'terminal', 'choices'], 'node');
        id(n.id, 'node');
        text(n.title, 'node title', 300);
        text(n.text, 'node text');
        arr(n.choices, 'choices', 8);
        if (n.terminal !== undefined && !['success', 'adverse', 'neutral'].includes(String(n.terminal)))
            fail('terminal outcome');
        if (n.terminal ? n.choices.length !== 0 : n.choices.length === 0)
            fail('terminal/choice shape');
        for (const c of n.choices) {
            obj(c, ['id', 'title', 'to', 'costTicks', 'conditions', 'effects', 'consequence'], 'choice');
            id(c.id, 'choice');
            text(c.title, 'choice title', 300);
            id(c.to, 'choice destination');
            int(c.costTicks, 'choice ticks', 0, v.maxTick);
            conditions(c.conditions, variables);
            effects(c.effects, variables);
            text(c.consequence, 'choice consequence');
        }
        unique(n.choices.map(c => (c as BranchingChoice).id), 'choices in node');
    }
    const nodes = v.nodes as unknown as BranchingNode[];
    unique(nodes.map(n => n.id), 'nodes');
    if (!nodes.some(n => n.id === v.startNodeId))
        fail('missing start node');
    const byId = new Map(nodes.map(n => [n.id, n]));
    for (const n of nodes)
        for (const c of n.choices)
            if (!byId.has(c.to))
                fail('missing destination');
    const active = new Set<string>(), seen = new Set<string>();
    const visit = (nid: string) => {
        if (active.has(nid))
            fail('cycles are not supported; model repeat work as explicit bounded nodes');
        if (seen.has(nid))
            return;
        active.add(nid);
        for (const c of byId.get(nid)!.choices)
            visit(c.to);
        active.delete(nid);
        seen.add(nid);
    };
    visit(v.startNodeId);
    if (seen.size !== nodes.length)
        fail('unreachable nodes');
    arr(v.milestones, 'milestones', 50);
    for (const m of v.milestones) {
        obj(m, ['id', 'title', 'nodeId', 'deadlineTick', 'required', 'consequence', 'onMiss'], 'milestone');
        id(m.id, 'milestone');
        text(m.title, 'milestone title', 300);
        id(m.nodeId, 'milestone node');
        if (!byId.has(String(m.nodeId)))
            fail('milestone node');
        int(m.deadlineTick, 'milestone deadline', 0, v.maxTick);
        if (typeof m.required !== 'boolean')
            fail('required flag');
        text(m.consequence, 'missed milestone consequence');
        effects(m.onMiss, variables);
    }
    unique(v.milestones.map(m => (m as BranchingMilestone).id), 'milestones');
    if (v.approval !== undefined) {
        obj(v.approval, ['actor', 'at'], 'approval');
        text(v.approval.actor, 'reviewer', 300);
        stamp(v.approval.at, 'review');
        if (v.revision < 1)
            fail('unsaved approval');
    }
    return copy(v as unknown as BranchingPack);
}
export function emptyBranchingPack(id: string): BranchingPack { return { format: 'erudior-branching-pack', version: 1, id, revision: 0, title: 'Untitled fictional scenario', description: 'Replace this scaffold with reviewed educational instructions.', sourceNote: 'Author-created fictional practice. Review before assigning.', timeUnit: 'simulated ticks', maxTick: 100, startNodeId: 'start', variables: [], nodes: [{ id: 'start', title: 'Scenario outcome', text: 'Replace this placeholder with your fictional scenario.', terminal: 'neutral', choices: [] }], milestones: [] }; }
export function exportBranchingPack(input: BranchingPack): string { const { approval: _, ...v } = parseBranchingPack(input); return JSON.stringify(v, null, 2); }
export function importBranchingPack(input: unknown, newId?: string): BranchingPack { const { approval: _, ...v } = parseBranchingPack(input); return parseBranchingPack({ ...v, id: newId ?? v.id, revision: 0 }); }
export function parseBranchingAssignment(input: unknown): BranchingAssignment {
    const v = decode(input);
    obj(v, ['id', 'revision', 'studentId', 'title', 'instructions', 'startTick', 'pack', 'createdAt'], 'assignment');
    id(v.id, 'assignment');
    int(v.revision, 'assignment revision', 1);
    id(v.studentId, 'learner');
    text(v.title, 'assignment title', 300);
    text(v.instructions, 'assignment instructions', 10000);
    stamp(v.createdAt, 'assignment');
    const pack = parseBranchingPack(v.pack);
    if (!pack.approval || Date.parse(v.createdAt) < Date.parse(pack.approval.at))
        fail('assignment requires prior exact pack review');
    int(v.startTick, 'start tick', 0, pack.maxTick);
    const assignment = { ...copy(v as unknown as BranchingAssignment), pack };
    initial(assignment); // Reject impossible initial deadline effects before persistence.
    return assignment;
}
export function parseBranchingCommand(input: unknown, pack: BranchingPack): BranchingCommand {
    const v = decode(input, 10000);
    if (!v || typeof v !== 'object')
        fail('command');
    const kind = (v as {
        kind?: unknown;
    }).kind;
    obj(v, kind === 'choice' ? ['kind', 'choiceId', 'note'] : ['kind', 'tick', 'note'], 'command');
    text(v.note, 'decision explanation', 5000);
    if (kind === 'choice')
        id(v.choiceId, 'choice');
    else if (kind === 'advance')
        int(v.tick, 'simulated tick', 0, pack.maxTick);
    else
        fail('command kind');
    return copy(v as unknown as BranchingCommand);
}
function applyEffects(state: BranchingState, pack: BranchingPack, effects: BranchingEffect[]) {
    for (const effect of effects) {
        const variable = pack.variables.find(v => v.id === effect.variable)!;
        const value = effect.op === 'set' ? effect.value : Number(state.values[effect.variable]) + Number(effect.value);
        if (typeof value === 'number' && (!Number.isSafeInteger(value) || value < variable.min! || value > variable.max!))
            fail('state effect exceeds reviewed variable bounds');
        state.values[effect.variable] = value;
    }
}
export function branchingConditionMatches(state: BranchingState, c: BranchingCondition): boolean { const value = state.values[c.variable]; return c.op === 'eq' ? value === c.value : c.op === 'ne' ? value !== c.value : c.op === 'gte' ? Number(value) >= Number(c.value) : Number(value) <= Number(c.value); }
/** Deadlines are inclusive. Missed effects run once, in due-tick order with authored
 * order breaking ties. Timeline timestamps record when the learner observed the
 * consequence, while its text retains the deadline; no real clock is consulted. */
function milestones(s: BranchingState, p: BranchingPack) {
    for (const m of [...p.milestones].sort((a, b) => a.deadlineTick - b.deadlineTick)) {
        if (s.milestones[m.id] !== 'pending')
            continue;
        if (s.tick > m.deadlineTick) {
            s.milestones[m.id] = 'missed';
            applyEffects(s, p, m.onMiss);
            s.timeline.push({ tick: s.tick, kind: 'deadline', text: `Missed ${m.title} (due by tick ${m.deadlineTick}): ${m.consequence}` });
        }
        else if (s.nodeId === m.nodeId) {
            s.milestones[m.id] = 'completed';
            s.timeline.push({ tick: s.tick, kind: 'milestone', text: `Completed ${m.title}` });
        }
    }
    const node = p.nodes.find(n => n.id === s.nodeId)!;
    s.terminalOutcome = node.terminal;
    s.outcome = node.terminal ? (p.milestones.some(m => m.required && s.milestones[m.id] !== 'completed') ? 'incomplete' : node.terminal) : (s.tick >= p.maxTick ? 'incomplete' : 'in-progress');
}
function initial(a: BranchingAssignment): BranchingState { const p = a.pack; const s: BranchingState = { nodeId: p.startNodeId, tick: a.startTick, values: Object.fromEntries(p.variables.map(v => [v.id, v.initial])), visited: [p.startNodeId], milestones: Object.fromEntries(p.milestones.map(m => [m.id, 'pending'])), timeline: [{ tick: a.startTick, kind: 'start', text: p.nodes.find(n => n.id === p.startNodeId)!.title }], outcome: 'in-progress' }; milestones(s, p); return s; }
/** A choice tests pre-action conditions, consumes its declared ticks, applies its
 * effects, moves to the destination, then resolves overdue/milestone effects.
 * Any rejected effect aborts the whole candidate journal before it is persisted. */
function command(s: BranchingState, p: BranchingPack, c: BranchingCommand) {
    if (s.outcome !== 'in-progress')
        fail('terminal case is immutable; assign a new revision');
    if (c.kind === 'advance') {
        if (c.tick <= s.tick)
            fail('clock must advance strictly');
        s.tick = c.tick;
        s.timeline.push({ tick: s.tick, kind: 'advance', text: c.note });
        milestones(s, p);
        return;
    }
    const node = p.nodes.find(n => n.id === s.nodeId)!;
    const choice = node.choices.find(x => x.id === c.choiceId);
    if (!choice || !choice.conditions.every(x => branchingConditionMatches(s, x)))
        fail('choice is unavailable in current state');
    if (s.tick + choice.costTicks > p.maxTick)
        fail('choice exceeds simulated time horizon');
    s.tick += choice.costTicks;
    applyEffects(s, p, choice.effects);
    s.nodeId = choice.to;
    s.visited.push(choice.to);
    s.timeline.push({ tick: s.tick, kind: 'choice', text: `${choice.title}: ${choice.consequence}\n${c.note}` });
    milestones(s, p);
}
export function createBranchingSession(a: BranchingAssignment, at = a.createdAt): BranchingSession { return { caseId: a.id, caseRevision: a.revision, revision: 0, events: [], updatedAt: at }; }
export function parseBranchingSession(input: unknown, assignment: BranchingAssignment): BranchingSession {
    const v = decode(input);
    obj(v, ['caseId', 'caseRevision', 'revision', 'events', 'updatedAt'], 'session');
    if (v.caseId !== assignment.id || v.caseRevision !== assignment.revision)
        fail('session source identity');
    int(v.revision, 'session revision', 0, BRANCHING_LIMITS.events);
    arr(v.events, 'events', BRANCHING_LIMITS.events);
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
        return { id: e.id, at: e.at, command: parseBranchingCommand(e.command, assignment.pack) };
    });
    unique(events.map(e => e.id), 'events');
    if (Date.parse(v.updatedAt) !== previous)
        fail('updated timestamp must match last event');
    const result = { ...copy(v as unknown as BranchingSession), events };
    const s = initial(assignment);
    for (const e of events)
        command(s, assignment.pack, e.command);
    return result;
}
export function replayBranchingSession(a: BranchingAssignment, input: BranchingSession): BranchingState {
    const source = parseBranchingAssignment(a), session = parseBranchingSession(input, source);
    const state = initial(source);
    for (const event of session.events)
        command(state, source.pack, event.command);
    return state;
}
export function applyBranchingCommand(a: BranchingAssignment, input: BranchingSession, value: BranchingCommand, eventId: string, at: string): BranchingSession { const source = parseBranchingAssignment(a), session = parseBranchingSession(input, source); id(eventId, 'event'); stamp(at, 'event'); return parseBranchingSession({ ...session, revision: session.revision + 1, events: [...session.events, { id: eventId, at, command: parseBranchingCommand(value, source.pack) }], updatedAt: at }, source); }
export function makeBranchingSubmission(a: BranchingAssignment, s: BranchingSession, id: string, submittedAt: string): BranchingSubmission { return parseBranchingSubmission({ id, caseId: a.id, caseRevision: a.revision, studentId: a.studentId, submittedAt, assignment: a, session: s }); }
export function parseBranchingSubmission(input: unknown): BranchingSubmission {
    const v = decode(input);
    obj(v, ['id', 'caseId', 'caseRevision', 'studentId', 'submittedAt', 'assignment', 'session'], 'submission');
    id(v.id, 'submission');
    stamp(v.submittedAt, 'submission');
    const assignment = parseBranchingAssignment(v.assignment), session = parseBranchingSession(v.session, assignment);
    if (v.caseId !== assignment.id || v.caseRevision !== assignment.revision || v.studentId !== assignment.studentId || Date.parse(v.submittedAt) < Date.parse(session.updatedAt))
        fail('submission identity/time');
    return { ...copy(v as unknown as BranchingSubmission), assignment, session };
}
export function parseBranchingFeedback(input: unknown): BranchingFeedback {
    const v = decode(input, 20000);
    obj(v, ['id', 'submissionId', 'at', 'actor', 'status', 'note'], 'feedback');
    id(v.id, 'feedback');
    id(v.submissionId, 'feedback submission');
    stamp(v.at, 'feedback');
    text(v.actor, 'reviewer', 300);
    text(v.note, 'feedback note', 10000);
    if (v.status !== 'reviewed' && v.status !== 'needs_revision')
        fail('feedback decision');
    return copy(v as unknown as BranchingFeedback);
}
export function parseBranchingLibrary(input: unknown): BranchingLibrary {
    if (input === null || input === undefined)
        return { format: 'erudior-branching-library', version: 1, packs: [], assignments: [], sessions: [], submissions: [], feedback: [], packReviews: [], deletedStudentIds: [] };
    const v = decode(input);
    obj(v, ['format', 'version', 'packs', 'assignments', 'sessions', 'submissions', 'feedback', 'packReviews', 'deletedStudentIds', 'restoredAt', 'pendingApproval'], 'library');
    if (v.format !== 'erudior-branching-library' || v.version !== 1)
        fail('library format/version');
    for (const [field, max] of [['packs', 100], ['assignments', 300], ['sessions', 300], ['submissions', 600], ['feedback', 1200], ['packReviews', 1000], ['deletedStudentIds', 1000]] as const)
        arr(v[field], field, max);
    const packs = (v.packs as unknown[]).map(parseBranchingPack);
    if (packs.some(p => p.revision < 1))
        fail('unsaved library pack');
    const assignments = (v.assignments as unknown[]).map(parseBranchingAssignment);
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
        const raw = s as BranchingSession;
        const a = assignments.find(a => a.id === raw?.caseId && a.revision === raw?.caseRevision);
        if (!a)
            fail('orphan session');
        return parseBranchingSession(s, a);
    });
    unique(sessions.map(s => `${s.caseId}@${s.caseRevision}`), 'sessions');
    const submissions = (v.submissions as unknown[]).map(parseBranchingSubmission);
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
    const feedback = (v.feedback as unknown[]).map(parseBranchingFeedback);
    unique(feedback.map(f => f.id), 'feedback');
    for (const f of feedback) {
        const s = submissions.find(s => s.id === f.submissionId);
        if (!s || Date.parse(f.at) < Date.parse(s.submittedAt))
            fail('feedback evidence/time');
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
    return { ...copy(v as unknown as BranchingLibrary), packs, assignments, sessions, submissions, feedback };
}
