import { useEffect, useState, type ReactNode } from 'react';
import type { CourseBranchingScenario } from '../lib/branchingCoursePackage';
import type { CourseScientificWorkspace } from '../lib/scientificCoursePackage';
import type { CourseAdvancedAssessment } from '../lib/advancedAssessmentCoursePackage';
import type { SpreadsheetAssignment } from '../lib/spreadsheetAssignments';
import { sha256Hex } from '../lib/courseSign';

export interface EngineSources {
  branchingScenarios?: CourseBranchingScenario[];
  scientificWorkspaces?: CourseScientificWorkspace[];
  advancedAssessments?: CourseAdvancedAssessment[];
  spreadsheetAssignments?: Array<SpreadsheetAssignment & { lessonId: string }>;
}
/** Stable inspection bytes include every authored field, including the lesson binding.
 * This is an inspection fingerprint, not a signed course artifact or local approval. */
export function engineInspectionJSON(source: unknown): string {
  return JSON.stringify(source, (_key, value) => value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, value[key]])) : value);
}
function Source({ source, kind, children }: { source: { id: string; title: string; revision?: number; lessonId?: string }; kind: string; children: ReactNode }) {
  const json = engineInspectionJSON(source);
  const [fingerprint, setFingerprint] = useState<{ json: string; value: string } | null>(null);
  useEffect(() => {
    let current = true;
    sha256Hex(new TextEncoder().encode(json)).then(value => { if (current) setFingerprint({ json, value }); })
      .catch(() => { if (current) setFingerprint({ json, value: 'Unavailable — do not infer an exact-source match.' }); });
    return () => { current = false; };
  }, [json]);
  return <article aria-label={`${kind} source: ${source.title}`}>
    <h4>{kind}: {source.title}</h4>
    <p>Source ID: <code>{source.id}</code> · Source revision: {source.revision ?? 'Uses course revision'} · Linked lesson: <code>{source.lessonId ?? 'Course-wide'}</code></p>
    <p style={{ overflowWrap: 'anywhere' }}>Inspection SHA-256: <code>{fingerprint?.json === json ? fingerprint.value : 'Calculating…'}</code></p>
    {children}
    <details><summary>Exact authored source JSON — {source.id}</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(source, null, 2)}</pre></details>
  </article>;
}
const effects = (items: Array<{ variable: string; op: string; value: unknown }>) => items.length ? items.map(x => `${x.variable} ${x.op} ${String(x.value)}`).join('; ') : 'None';
/** Read-only: no source execution, local approval, learner assignment, or history writes. */
export default function CourseEngineInspection({ sources, includeSpreadsheets = true }: { sources: EngineSources; includeSpreadsheets?: boolean }) {
  if (![sources.branchingScenarios, sources.scientificWorkspaces, sources.advancedAssessments, includeSpreadsheets ? sources.spreadsheetAssignments : []].some(x => x?.length)) return null;
  return <section aria-label="Engine source inspection">
    <h3>Lesson-linked engine sources</h3>
    <p>Inspect the linked lesson, exact source ID and revision, and complete source below. The inspection SHA-256 hashes stable authored JSON including the lesson link; it is not the signed package digest, proof of permissions, or approval.</p>
    <p>Adult handoff: after installation, unlock the supervising-adult area, open the matching engine studio, and choose this installed course and exact source revision. Copy it for local review, save and review the exact local revision, then explicitly select a learner and assign it. Local copies receive independent IDs and revisions. Publication review never substitutes for local review or assigns work automatically. Spreadsheet activities use the existing course assignment workflow.</p>
    {sources.branchingScenarios?.map(p => <Source key={p.id} source={p} kind="Branching scenario">
      <p>{p.description}</p><p>Source and permissions: {p.sourceNote}</p>
      <p>Start node: {p.startNodeId} · Time limit: {p.maxTick} {p.timeUnit}</p>
      <h5>Initial state</h5><ul>{p.variables.map(v => <li key={v.id}>{v.title} ({v.id}): {String(v.initial)}; bounds {v.min ?? 'none'}–{v.max ?? 'none'}</li>)}</ul>
      <h5>Decisions and consequences</h5>{p.nodes.map(n => <section key={n.id}><h6>{n.title} ({n.id}){n.terminal && ` — ${n.terminal}`}</h6><p>{n.text}</p><ul>{n.choices.map(c => <li key={c.id}>{c.title} ({c.id}) → {c.to}; cost {c.costTicks} {p.timeUnit}. Conditions: {effects(c.conditions)}. State changes: {effects(c.effects)}. Consequence: {c.consequence}</li>)}</ul></section>)}
      <h5>Deadlines</h5><ul>{p.milestones.map(m => <li key={m.id}>{m.title} ({m.id}): node {m.nodeId} by {m.deadlineTick} {p.timeUnit}; {m.required ? 'required' : 'optional'}. Missed deadline: {m.consequence}. State changes: {effects(m.onMiss)}</li>)}</ul>
    </Source>)}
    {sources.scientificWorkspaces?.map(p => <Source key={p.id} source={p} kind="Scientific workspace">
      <p>{p.description}</p><p>Source and permissions: {p.sourceNote}</p><h5>Safety and model assumptions</h5><p>{p.safety}</p><p>{p.assumptions}</p><p>Instrument: {p.instrument.kind}</p>
      <h5>Procedure</h5><ol>{p.steps.map(s => <li key={s.id}>{s.title} ({s.id}): {s.instructions} — {s.adult ? 'Adult required' : 'Not marked adult-required'}</li>)}</ol>
      <h5>Measurement and uncertainty limits</h5><ul>{p.channels.map(c => <li key={c.id}>{c.title} ({c.id}): {c.min}–{c.max} {c.unit}; maximum uncertainty {c.uncertaintyMax} {c.unit}</li>)}</ul><p>Graph axes: {p.graph.xChannelId} (x), {p.graph.yChannelId} (y)</p>
      <h5>Design brief and criteria</h5><p>{p.design.brief}</p><ul>{p.design.criteria.map(c => <li key={c.id}>{c.title} ({c.id}): channel {c.channelId}, {c.min}–{c.max}</li>)}</ul>
    </Source>)}
    {sources.advancedAssessments?.map(p => <Source key={p.id} source={p} kind="Advanced assessment">
      <p>{p.description}</p><p>Source and permissions: {p.sourceNote}</p><h5>Instructions and integrity policy</h5><p>{p.instructions}</p><p>{p.integrity}</p>
      <h5>Rubric: {p.rubric.title} ({p.rubric.id}, revision {p.rubric.revision})</h5>{p.rubric.criteria.map(c => <section key={c.id}><h6>{c.title} ({c.id})</h6><ul>{c.levels.map(l => <li key={l.id}>{l.label} ({l.id}), {l.points} points: {l.description}</li>)}</ul></section>)}
      <h5>Explicit variants and expected responses</h5>{p.variants.map(v => <section key={v.id}><h6>{v.title} ({v.id})</h6>{v.questions.map(q => <section key={q.id}><p>{q.id} ({q.kind}): {q.prompt}</p>{q.kind === 'oral' ? <p>Transcript or accessible equivalent; optional audio. Human review, no automatic oral score.</p> : <ol>{q.steps.map(s => <li key={s.id}>{s.id}: {s.prompt}<p>Feedback: {!s.expected ? 'Human review only' : s.expected.kind === 'number' ? `${s.expected.value} ± ${s.expected.tolerance} absolute tolerance` : s.expected.accepted.join(' / ')}</p><ul>{s.misconceptions.map((m, i) => <li key={i}>Pattern {m.misconceptionId}: {m.accepted.join(' / ')}</li>)}</ul></li>)}</ol>}</section>)}</section>)}
      <h5>Authored response patterns, not diagnoses</h5><ul>{p.misconceptions.map(m => <li key={m.id}>{m.title} ({m.id}): {m.explanation}</li>)}</ul>
    </Source>)}
    {includeSpreadsheets && sources.spreadsheetAssignments?.map(p => <Source key={p.id} source={p} kind="Spreadsheet">
      <p>Engine version: {p.starter.engineVersion ?? 1} · Numeric tolerance: {p.tolerance ?? 0}</p>
      <h5>Starter values and formulas (not executed)</h5>{Object.entries(p.starter.sheets).map(([name, cells]) => <section key={name}><h6>{name}</h6><ul>{Object.entries(cells).map(([address, value]) => <li key={address}><code>{name}!{address}</code>: <code>{String(value)}</code>{p.starter.cellExplanations?.[`${name}!${address}`] && <p>{p.starter.cellExplanations[`${name}!${address}`]}</p>}</li>)}</ul></section>)}
      <h5>Protection and expected values</h5><p>Protected cells: {p.protectedCells.join(', ') || 'None'}</p><ul>{Object.entries(p.answers).map(([address, value]) => <li key={address}>{address}: {String(value)}</li>)}</ul>
      <h5>Named ranges</h5><ul>{Object.entries(p.starter.namedRanges ?? {}).map(([name, range]) => <li key={name}>{name}: {range.sheet}!{range.range}</li>)}</ul>
      <h5>Validation rules</h5><ul>{p.starter.validationRules?.map((r, i) => <li key={i}>{r.sheet}!{r.range}: {r.kind}; minimum {r.min ?? 'none'}, maximum {r.max ?? 'none'}; values {r.values?.join(', ') ?? 'not specified'}; blank {r.allowBlank ? 'allowed' : 'not allowed'}</li>)}</ul>
      <h5>Declarative macros (not run)</h5>{p.starter.macroDefinitions?.map(m => <section key={m.id}><h6>{m.title} ({m.id})</h6><ol>{m.steps.map((s, i) => <li key={i}>{s.op === 'set' ? `Set ${s.target} to ${String(s.value)}` : `Copy ${s.source} to ${s.target}`}</li>)}</ol></section>)}
    </Source>)}
  </section>;
}
