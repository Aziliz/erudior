import { validateCourseActivityOrigin, type CourseActivityOrigin } from './courseActivityOrigin';
/** Canonical ordering for exact educational source comparison. No browser or storage dependencies. */
export function scientificJSON(value: unknown): string {
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
import { scientificCircuitV1, scientificGasV1 } from './scientificInstrumentV1';
export const SCIENTIFIC_DISCLAIMER = 'Educational investigation only. Simulated instruments are idealized models, not real measurements or safety-critical controls. Stated absolute uncertainty is not statistical confidence. Human review is required; no scientific certification. Do not enter confidential information.';
export const SCIENTIFIC_LIMITS = { bytes: 16 * 1024 * 1024, packBytes: 256 * 1024, events: 300 } as const;
export type ScientificInstrumentKind = 'manual' | 'circuit' | 'gas';
export interface ScientificChannel {
    id: string;
    title: string;
    unit: string;
    min: number;
    max: number;
    uncertaintyMax: number;
}
export interface ScientificPack {
    courseOrigin?: CourseActivityOrigin;
    format: 'erudior-scientific-pack';
    version: 1;
    id: string;
    revision: number;
    title: string;
    description: string;
    sourceNote: string;
    safety: string;
    assumptions: string;
    steps: {
        id: string;
        title: string;
        instructions: string;
        adult: boolean;
    }[];
    channels: ScientificChannel[];
    graph: {
        xChannelId: string;
        yChannelId: string;
    };
    instrument: {
        kind: ScientificInstrumentKind;
    };
    design: {
        brief: string;
        criteria: {
            id: string;
            title: string;
            channelId: string;
            min: number;
            max: number;
        }[];
    };
    approval?: {
        actor: string;
        at: string;
    };
}
export interface ScientificAssignment {
    id: string;
    revision: number;
    studentId: string;
    title: string;
    instructions: string;
    pack: ScientificPack;
    createdAt: string;
}
export interface ScientificReading {
    value: number;
    uncertainty: number;
}
export type ScientificCommand = {
    kind: 'step';
    stepId: string;
    note: string;
} | {
    kind: 'measure';
    trialId: string;
    label: string;
    values: Record<string, ScientificReading>;
    note: string;
    supersedes?: string;
} | {
    kind: 'simulate';
    trialId: string;
    label: string;
    parameters: Record<string, number | string>;
    note: string;
    supersedes?: string;
} | {
    kind: 'design';
    iterationId: string;
    trialId: string;
    description: string;
    rationale: string;
    tradeoffs: string;
} | {
    kind: 'conclude';
    text: string;
} | {
    kind: 'hypothesis';
    text: string;
};
export interface ScientificEvent {
    id: string;
    at: string;
    command: ScientificCommand;
}
export interface ScientificSession {
    caseId: string;
    caseRevision: number;
    revision: number;
    events: ScientificEvent[];
    updatedAt: string;
}
export interface ScientificSubmission {
    id: string;
    caseId: string;
    caseRevision: number;
    studentId: string;
    submittedAt: string;
    assignment: ScientificAssignment;
    session: ScientificSession;
}
export interface ScientificFeedback {
    id: string;
    submissionId: string;
    at: string;
    actor: string;
    status: 'reviewed' | 'needs_revision';
    note: string;
}
export interface ScientificPackReview {
    packKey: string;
    actor: string;
    at: string;
}
export interface ScientificLibrary {
    format: 'erudior-scientific-library';
    version: 1;
    packs: ScientificPack[];
    assignments: ScientificAssignment[];
    sessions: ScientificSession[];
    submissions: ScientificSubmission[];
    feedback: ScientificFeedback[];
    packReviews: ScientificPackReview[];
    deletedStudentIds: string[];
    restoredAt?: string;
    pendingApproval?: string[];
}
export interface ScientificTrial {
    id: string;
    label: string;
    values: Record<string, ScientificReading>;
    note: string;
    source: 'manual' | 'circuit' | 'gas';
    modelVersion: 1;
    parameters?: Record<string, number | string>;
    supersedes?: string;
}
export interface ScientificIteration {
    id: string;
    trialId: string;
    description: string;
    rationale: string;
    tradeoffs: string;
    criteria: {
        id: string;
        status: 'pass' | 'fail' | 'uncertain';
    }[];
}
export interface ScientificState {
    completedSteps: string[];
    trials: ScientificTrial[];
    iterations: ScientificIteration[];
    hypothesis: string;
    conclusion: string;
    complete: boolean;
}
const copy = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const equal = (a: unknown, b: unknown) => scientificJSON(a) === scientificJSON(b);
const key = (v: {
    id: string;
    revision: number;
}) => `${v.id}@${v.revision}`;
function fail(s: string): never { throw Error('Invalid scientific workspace: ' + s); }
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
function decode(input: unknown, max: number = SCIENTIFIC_LIMITS.bytes): unknown {
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
        if (new TextEncoder().encode(scientificJSON(v)).length > max)
            fail('byte limit');
    }
    catch {
        fail('invalid or oversized JSON');
    }
    return v;
}
function num(v: unknown, at: string, min = -1e9, max = 1e9): asserts v is number { if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max)
    fail(at + ' finite numeric bounds'); }
export function scientificInstrumentChannels(kind: ScientificInstrumentKind): ScientificChannel[] {
    if (kind === 'circuit')
        return [{ id: 'voltage', title: 'Battery voltage', unit: 'V', min: 1, max: 24, uncertaintyMax: 0 }, { id: 'current', title: 'Ideal total current', unit: 'A', min: 0, max: 72, uncertaintyMax: 0 }, { id: 'power', title: 'Ideal total power', unit: 'W', min: 0, max: 1728, uncertaintyMax: 0 }];
    if (kind === 'gas')
        return [{ id: 'temperature', title: 'Absolute temperature', unit: 'K', min: 50, max: 1000, uncertaintyMax: 0 }, { id: 'pressure', title: 'Ideal pressure', unit: 'kPa', min: 0, max: 25000, uncertaintyMax: 0 }];
    return [{ id: 'x', title: 'Independent measurement', unit: 'unit', min: -1000, max: 1000, uncertaintyMax: 100 }, { id: 'y', title: 'Dependent measurement', unit: 'unit', min: -1000, max: 1000, uncertaintyMax: 100 }];
}
export function defaultScientificParameters(kind: ScientificInstrumentKind): Record<string, number | string> { return kind === 'circuit' ? { voltage: 9, r1: 10, r2: 20, r3: 0, layout: 'series' } : kind === 'gas' ? { temperature: 300, volume: 25, amount: 1 } : {}; }
export function scientificInstrumentAssumptions(kind: ScientificInstrumentKind): string { return kind === 'circuit' ? 'Ideal DC source and resistors; no heating, tolerances, wiring or real-world safety model. Zero reported uncertainty means deterministic model output, not exact physical truth.' : kind === 'gas' ? 'Ideal gas PV=nRT; R=8.314 J/(mol K), volume in L gives pressure in kPa. No phase changes or real-gas effects. Zero reported uncertainty means deterministic model output, not exact physical truth.' : 'Author-defined units and stated absolute bounds; no inferred calibration, probability or confidence level.'; }
function parameters(v: unknown, kind: ScientificInstrumentKind): Record<string, number | string> {
    if (kind === 'circuit') {
        obj(v, ['voltage', 'r1', 'r2', 'r3', 'layout'], 'circuit parameters');
        num(v.voltage, 'voltage', 1, 24);
        num(v.r1, 'resistor 1', 1, 100);
        num(v.r2, 'resistor 2', 1, 100);
        num(v.r3, 'resistor 3', 0, 100);
        if (v.r3 > 0 && v.r3 < 1)
            fail('optional resistor must be absent or at least 1 ohm');
        if (v.layout !== 'series' && v.layout !== 'parallel')
            fail('circuit layout');
    }
    else if (kind === 'gas') {
        obj(v, ['temperature', 'volume', 'amount'], 'gas parameters');
        num(v.temperature, 'temperature', 50, 1000);
        num(v.volume, 'volume', 1, 50);
        num(v.amount, 'amount', .1, 3);
    }
    else
        fail('manual instrument cannot simulate');
    return copy(v as Record<string, number | string>);
}
export function simulateScientificInstrument(kind: ScientificInstrumentKind, input: Record<string, number | string>): Record<string, ScientificReading> {
    const p = parameters(input, kind);
    let raw: Record<string, number>;
    if (kind === 'circuit')
        raw = scientificCircuitV1(p);
    else
        raw = scientificGasV1(p);
    for (const value of Object.values(raw))
        num(value, 'simulated output');
    return Object.fromEntries(Object.entries(raw).map(([k, value]) => [k, { value, uncertainty: 0 }]));
}
function readings(v: unknown, p: ScientificPack) { obj(v, p.channels.map(c => c.id), 'measurements'); if (Object.keys(v).length !== p.channels.length)
    fail('all measurement channels required'); for (const c of p.channels) {
    const r = v[c.id];
    obj(r, ['value', 'uncertainty'], 'reading');
    num(r.value, c.title, c.min, c.max);
    num(r.uncertainty, 'absolute uncertainty', 0, c.uncertaintyMax);
    num(r.value - r.uncertainty, 'lower uncertainty bound');
    num(r.value + r.uncertainty, 'upper uncertainty bound');
} }
export function parseScientificPack(input: unknown): ScientificPack {
    const v = decode(input, SCIENTIFIC_LIMITS.packBytes);
    obj(v, ['format', 'version', 'id', 'revision', 'title', 'description', 'sourceNote', 'safety', 'assumptions', 'steps', 'channels', 'graph', 'instrument', 'design', 'approval', 'courseOrigin'], 'pack');
    validateCourseActivityOrigin(v.courseOrigin);
    if (v.format !== 'erudior-scientific-pack' || v.version !== 1)
        fail('pack format/version');
    id(v.id, 'pack');
    int(v.revision, 'revision');
    for (const k of ['title', 'description', 'sourceNote', 'safety', 'assumptions'])
        text(v[k], k, k === 'title' ? 300 : 5000);
    arr(v.steps, 'steps', 30, 1);
    for (const s of v.steps) {
        obj(s, ['id', 'title', 'instructions', 'adult'], 'step');
        id(s.id, 'step');
        text(s.title, 'step title', 300);
        text(s.instructions, 'step instructions');
        if (typeof s.adult !== 'boolean')
            fail('adult supervision flag');
    }
    unique(v.steps.map(s => (s as {
        id: string;
    }).id), 'steps');
    arr(v.channels, 'channels', 12, 2);
    for (const c of v.channels) {
        obj(c, ['id', 'title', 'unit', 'min', 'max', 'uncertaintyMax'], 'channel');
        id(c.id, 'channel');
        text(c.title, 'channel title', 300);
        text(c.unit, 'unit', 40);
        num(c.min, 'channel min');
        num(c.max, 'channel max');
        if (c.min >= c.max)
            fail('channel ordered bounds');
        num(c.uncertaintyMax, 'uncertainty maximum', 0, 1e8);
    }
    const channels = v.channels as unknown as ScientificChannel[];
    unique(channels.map(c => c.id), 'channels');
    obj(v.graph, ['xChannelId', 'yChannelId'], 'graph');
    if (v.graph.xChannelId === v.graph.yChannelId || ![v.graph.xChannelId, v.graph.yChannelId].every(k => channels.some(c => c.id === k)))
        fail('graph channels');
    obj(v.instrument, ['kind'], 'instrument');
    if (!['manual', 'circuit', 'gas'].includes(String(v.instrument.kind)))
        fail('instrument kind');
    if (v.instrument.kind !== 'manual' && !equal(channels, scientificInstrumentChannels(v.instrument.kind as ScientificInstrumentKind)))
        fail('simulated channels must retain model units and bounds');
    obj(v.design, ['brief', 'criteria'], 'design');
    text(v.design.brief, 'design brief');
    arr(v.design.criteria, 'design criteria', 20, 1);
    for (const c of v.design.criteria) {
        obj(c, ['id', 'title', 'channelId', 'min', 'max'], 'criterion');
        id(c.id, 'criterion');
        text(c.title, 'criterion title', 300);
        const channel = channels.find(x => x.id === c.channelId);
        if (!channel)
            fail('criterion channel');
        num(c.min, 'criterion min', channel.min, channel.max);
        num(c.max, 'criterion max', c.min, channel.max);
    }
    unique(v.design.criteria.map(c => (c as {
        id: string;
    }).id), 'criteria');
    if (v.approval !== undefined) {
        obj(v.approval, ['actor', 'at'], 'approval');
        text(v.approval.actor, 'reviewer', 300);
        stamp(v.approval.at, 'approval');
        if (v.revision < 1)
            fail('unsaved approval');
    }
    return copy(v as unknown as ScientificPack);
}
export function emptyScientificPack(id: string): ScientificPack { return { format: 'erudior-scientific-pack', version: 1, id, revision: 0, title: 'Untitled educational investigation', description: 'Replace with a reviewed investigation question.', sourceNote: 'Author-created educational workspace. Review before assignment.', safety: 'Simulation or recorded observations only. No real instrument control. Adult review is required.', assumptions: scientificInstrumentAssumptions('manual'), steps: [{ id: 'observe', title: 'Observe and record', instructions: 'Describe the procedure and record observations.', adult: false }], channels: scientificInstrumentChannels('manual'), graph: { xChannelId: 'x', yChannelId: 'y' }, instrument: { kind: 'manual' }, design: { brief: 'Compare a design iteration against the stated criteria and explain its tradeoffs.', criteria: [{ id: 'target', title: 'Target interval', channelId: 'y', min: 0, max: 100 }] } }; }
export function exportScientificPack(input: ScientificPack): string { const { approval: _, courseOrigin: _origin, ...v } = parseScientificPack(input); return JSON.stringify(v, null, 2); }
export function importScientificPack(input: unknown, newId?: string): ScientificPack { const { approval: _, courseOrigin: _origin, ...v } = parseScientificPack(input); return parseScientificPack({ ...v, id: newId ?? v.id, revision: 0 }); }
export function parseScientificAssignment(input: unknown): ScientificAssignment { const v = decode(input); obj(v, ['id', 'revision', 'studentId', 'title', 'instructions', 'pack', 'createdAt'], 'assignment'); id(v.id, 'assignment'); int(v.revision, 'assignment revision', 1); id(v.studentId, 'learner'); text(v.title, 'assignment title', 300); text(v.instructions, 'assignment instructions', 10000); stamp(v.createdAt, 'assignment'); const pack = parseScientificPack(v.pack); if (!pack.approval || Date.parse(v.createdAt) < Date.parse(pack.approval.at))
    fail('assignment requires prior exact pack review'); return { ...copy(v as unknown as ScientificAssignment), pack }; }
export function parseScientificCommand(input: unknown, p: ScientificPack): ScientificCommand {
    const v = decode(input, 30000);
    if (!v || typeof v !== 'object')
        fail('command');
    const k = (v as {
        kind?: unknown;
    }).kind;
    if (k === 'step') {
        obj(v, ['kind', 'stepId', 'note'], 'step command');
        if (!p.steps.some(s => s.id === v.stepId))
            fail('unknown procedure step');
        text(v.note, 'procedure observation');
    }
    else if (k === 'measure' || k === 'simulate') {
        obj(v, k === 'measure' ? ['kind', 'trialId', 'label', 'values', 'note', 'supersedes'] : ['kind', 'trialId', 'label', 'parameters', 'note', 'supersedes'], 'trial');
        id(v.trialId, 'trial');
        text(v.label, 'trial label', 300);
        text(v.note, 'trial observation');
        if (v.supersedes !== undefined)
            id(v.supersedes, 'corrected trial');
        if (k === 'measure') {
            if (p.instrument.kind !== 'manual')
                fail('manual capture requires manual instrument');
            readings(v.values, p);
        }
        else {
            const values = simulateScientificInstrument(p.instrument.kind, parameters(v.parameters, p.instrument.kind));
            readings(values, p);
        }
    }
    else if (k === 'design') {
        obj(v, ['kind', 'iterationId', 'trialId', 'description', 'rationale', 'tradeoffs'], 'design iteration');
        id(v.iterationId, 'iteration');
        id(v.trialId, 'design trial');
        for (const key of ['description', 'rationale', 'tradeoffs'])
            text(v[key], key);
    }
    else if (k === 'conclude' || k === 'hypothesis') {
        obj(v, ['kind', 'text'], 'conclusion');
        text(v.text, 'conclusion');
    }
    else
        fail('command kind');
    return copy(v as unknown as ScientificCommand);
}
function initial(): ScientificState { return { completedSteps: [], trials: [], iterations: [], hypothesis: '', conclusion: '', complete: false }; }
export function activeScientificTrials(s: ScientificState): ScientificTrial[] { const replaced = new Set(s.trials.map(t => t.supersedes).filter(Boolean)); return s.trials.filter(t => !replaced.has(t.id)); }
function command(s: ScientificState, p: ScientificPack, c: ScientificCommand) {
    // New evidence invalidates the current conclusion, while earlier conclusions remain in the journal.
    if (c.kind !== 'conclude')
        s.conclusion = '';
    if (c.kind === 'step') {
        if (s.completedSteps.includes(c.stepId))
            fail('procedure step already recorded');
        s.completedSteps.push(c.stepId);
    }
    else if (c.kind === 'measure' || c.kind === 'simulate') {
        if (!s.hypothesis)
            fail('record a hypothesis before capturing trials');
        if (s.trials.some(t => t.id === c.trialId))
            fail('trial identity already exists');
        if (c.supersedes && !activeScientificTrials(s).some(t => t.id === c.supersedes))
            fail('correction must reference active prior trial');
        const values = c.kind === 'measure' ? c.values : simulateScientificInstrument(p.instrument.kind, c.parameters);
        s.trials.push({ id: c.trialId, label: c.label, values: copy(values), note: c.note, source: c.kind === 'measure' ? 'manual' : p.instrument.kind, modelVersion: 1, ...(c.kind === 'simulate' ? { parameters: copy(c.parameters) } : {}), ...(c.supersedes ? { supersedes: c.supersedes } : {}) });
    }
    else if (c.kind === 'design') {
        if (s.iterations.some(i => i.id === c.iterationId))
            fail('design iteration identity already exists');
        const trial = activeScientificTrials(s).find(t => t.id === c.trialId);
        if (!trial)
            fail('design requires active captured trial');
        s.iterations.push({ id: c.iterationId, trialId: c.trialId, description: c.description, rationale: c.rationale, tradeoffs: c.tradeoffs, criteria: p.design.criteria.map(criterion => { const r = trial.values[criterion.channelId], lo = r.value - r.uncertainty, hi = r.value + r.uncertainty; return { id: criterion.id, status: lo >= criterion.min && hi <= criterion.max ? 'pass' : hi < criterion.min || lo > criterion.max ? 'fail' : 'uncertain' }; }) });
    }
    else if (c.kind === 'hypothesis') {
        if (s.trials.length)
            fail('record hypothesis before trials; revise in conclusion');
        s.hypothesis = c.text;
    }
    else
        s.conclusion = c.text;
    const active = activeScientificTrials(s);
    s.complete = p.steps.every(step => s.completedSteps.includes(step.id)) && active.length > 0 && s.iterations.some(i => active.some(t => t.id === i.trialId)) && Boolean(s.hypothesis) && Boolean(s.conclusion);
}
export function createScientificSession(a: ScientificAssignment, at = a.createdAt): ScientificSession { return { caseId: a.id, caseRevision: a.revision, revision: 0, events: [], updatedAt: at }; }
export function parseScientificSession(input: unknown, assignment: ScientificAssignment): ScientificSession {
    const v = decode(input);
    obj(v, ['caseId', 'caseRevision', 'revision', 'events', 'updatedAt'], 'session');
    if (v.caseId !== assignment.id || v.caseRevision !== assignment.revision)
        fail('session source identity');
    int(v.revision, 'session revision', 0, SCIENTIFIC_LIMITS.events);
    arr(v.events, 'events', SCIENTIFIC_LIMITS.events);
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
        return { id: e.id, at: e.at, command: parseScientificCommand(e.command, assignment.pack) };
    });
    unique(events.map(e => e.id), 'events');
    if (Date.parse(v.updatedAt) !== previous)
        fail('updated timestamp must match last event');
    const result = { ...copy(v as unknown as ScientificSession), events };
    const s = initial();
    for (const e of events)
        command(s, assignment.pack, e.command);
    return result;
}
export function replayScientificSession(a: ScientificAssignment, input: ScientificSession): ScientificState {
    const source = parseScientificAssignment(a), session = parseScientificSession(input, source);
    const state = initial();
    for (const event of session.events)
        command(state, source.pack, event.command);
    return state;
}
export function applyScientificCommand(a: ScientificAssignment, input: ScientificSession, value: ScientificCommand, eventId: string, at: string): ScientificSession { const source = parseScientificAssignment(a), session = parseScientificSession(input, source); id(eventId, 'event'); stamp(at, 'event'); return parseScientificSession({ ...session, revision: session.revision + 1, events: [...session.events, { id: eventId, at, command: parseScientificCommand(value, source.pack) }], updatedAt: at }, source); }
export function makeScientificSubmission(a: ScientificAssignment, s: ScientificSession, id: string, submittedAt: string): ScientificSubmission { return parseScientificSubmission({ id, caseId: a.id, caseRevision: a.revision, studentId: a.studentId, submittedAt, assignment: a, session: s }); }
export function parseScientificSubmission(input: unknown): ScientificSubmission {
    const v = decode(input);
    obj(v, ['id', 'caseId', 'caseRevision', 'studentId', 'submittedAt', 'assignment', 'session'], 'submission');
    id(v.id, 'submission');
    stamp(v.submittedAt, 'submission');
    const assignment = parseScientificAssignment(v.assignment), session = parseScientificSession(v.session, assignment);
    if (v.caseId !== assignment.id || v.caseRevision !== assignment.revision || v.studentId !== assignment.studentId || Date.parse(v.submittedAt) < Date.parse(session.updatedAt))
        fail('submission identity/time');
    return { ...copy(v as unknown as ScientificSubmission), assignment, session };
}
export function parseScientificFeedback(input: unknown): ScientificFeedback {
    const v = decode(input, 20000);
    obj(v, ['id', 'submissionId', 'at', 'actor', 'status', 'note'], 'feedback');
    id(v.id, 'feedback');
    id(v.submissionId, 'feedback submission');
    stamp(v.at, 'feedback');
    text(v.actor, 'reviewer', 300);
    text(v.note, 'feedback note', 10000);
    if (v.status !== 'reviewed' && v.status !== 'needs_revision')
        fail('feedback decision');
    return copy(v as unknown as ScientificFeedback);
}
export function parseScientificLibrary(input: unknown): ScientificLibrary {
    if (input === null || input === undefined)
        return { format: 'erudior-scientific-library', version: 1, packs: [], assignments: [], sessions: [], submissions: [], feedback: [], packReviews: [], deletedStudentIds: [] };
    const v = decode(input);
    obj(v, ['format', 'version', 'packs', 'assignments', 'sessions', 'submissions', 'feedback', 'packReviews', 'deletedStudentIds', 'restoredAt', 'pendingApproval'], 'library');
    if (v.format !== 'erudior-scientific-library' || v.version !== 1)
        fail('library format/version');
    for (const [field, max] of [['packs', 100], ['assignments', 300], ['sessions', 300], ['submissions', 600], ['feedback', 1200], ['packReviews', 1000], ['deletedStudentIds', 1000]] as const)
        arr(v[field], field, max);
    const packs = (v.packs as unknown[]).map(parseScientificPack);
    if (packs.some(p => p.revision < 1))
        fail('unsaved library pack');
    const assignments = (v.assignments as unknown[]).map(parseScientificAssignment);
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
        const raw = s as ScientificSession;
        const a = assignments.find(a => a.id === raw?.caseId && a.revision === raw?.caseRevision);
        if (!a)
            fail('orphan session');
        return parseScientificSession(s, a);
    });
    unique(sessions.map(s => `${s.caseId}@${s.caseRevision}`), 'sessions');
    const submissions = (v.submissions as unknown[]).map(parseScientificSubmission);
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
    const feedback = (v.feedback as unknown[]).map(parseScientificFeedback);
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
    return { ...copy(v as unknown as ScientificLibrary), packs, assignments, sessions, submissions, feedback };
}
