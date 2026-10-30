import { useId, useState } from "react";
import { ASSIGN_BLOCK, parseAssignBlock, workProblems, type CourseWork, type Rubric, type WritingTask, type Lab, type ActivityLogSpec } from "../lib/work";
import { validateCourseWork } from "../lib/courseWork";
import { uid } from "../lib/util";
import TextResourceFileInput from "./TextResourceFileInput";
import WorkResourcePreview from "./WorkResourcePreview";

type Kind = "rubric" | "writing" | "lab" | "log";
type LinkKind = Exclude<Kind, "rubric">;
export type WorkResourceEditorProps = {
  work: CourseWork;
  modules: Array<{ id: string; title: string }>;
  lessons: Array<{ id: string; title: string; body: string }>;
  onChange: (next: CourseWork) => void;
  onLessonBodyChange?: (lessonId: string, body: string) => void;
  onAssignmentAttachmentChange?: (lessonId: string, reference: { kind: "writing" | "lab" | "log"; id?: string }, attached: boolean) => void;
};
const matches = (link: ReturnType<typeof parseAssignBlock>["links"][number], kind: LinkKind, id: string) => link.kind === kind && (link.kind === "log" || link.id === id);
export function lessonReferencesWork(body: string, kind: LinkKind, id: string): boolean {
  return [...body.matchAll(ASSIGN_BLOCK)].some(match => parseAssignBlock(match[1]).links.some(link => matches(link, kind, id)));
}
/** Modify only parsed assignment directives, preserving all other lesson bytes. */
export function linkLessonWork(body: string, kind: LinkKind, id: string, attached: boolean): string {
  if (attached) return lessonReferencesWork(body, kind, id) ? body : body + `${body && !body.endsWith("\n") ? "\n" : ""}\n\`\`\`assignment\n${kind === "log" ? "log" : `${kind}: ${id}`}\n\`\`\`\n`;
  return body.replace(ASSIGN_BLOCK, (whole, content: string) => {
    if (parseAssignBlock(content).problems.length) return whole;
    const lines = content.split(/\r?\n/).filter(line => !parseAssignBlock(line).links.some(link => matches(link, kind, id)));
    return lines.some(line => line.trim()) ? whole.replace(content, lines.join(whole.includes("\r\n") ? "\r\n" : "\n")) : "";
  });
}
const lines = (value: string) => value.split("\n");
function Text({ label, value, onChange, multiline = false }: { label: string; value?: string; onChange: (value: string) => void; multiline?: boolean }) {
  const id = useId();
  return <label className="field" htmlFor={id}><span id={`${id}-label`}>{label}</span>{multiline ? <textarea id={id} aria-labelledby={`${id}-label`} className="textarea" value={value ?? ""} onChange={e => onChange(e.target.value)} /> : <input id={id} aria-labelledby={`${id}-label`} className="input" value={value ?? ""} onChange={e => onChange(e.target.value)} />}</label>;
}
function NumberField({ label, value, onChange, max }: { label: string; value?: number; onChange: (value: number | undefined) => void; max?: number }) {
  return <label className="field"><span>{label}</span><input className="input" type="number" min={0} max={max} step={1} value={value ?? ""} onChange={e => onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></label>;
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="row" style={{ minHeight: 40, gap: 8 }}><input type="checkbox" style={{ width: 24, height: 24, flexShrink: 0 }} checked={checked} onChange={e => onChange(e.target.checked)} />{label}</label>;
}
export default function WorkResourceEditor({ work, modules, lessons, onChange, onLessonBodyChange, onAssignmentAttachmentChange }: WorkResourceEditorProps) {
  const [selected, setSelected] = useState<{ kind: Kind; id: string } | null>(null);
  const [error, setError] = useState("");
  const [pendingRemoval, setPendingRemoval] = useState<{ kind: Kind; id: string; snapshot: string } | null>(null);
  const writing = work.writing ?? [], labs = work.labs ?? [], rubrics = work.rubrics ?? [];
  const putRubric = (value: Rubric) => onChange({ ...work, rubrics: rubrics.map(item => item.id === value.id ? value : item) });
  const putWriting = (value: WritingTask) => onChange({ ...work, writing: writing.map(item => item.id === value.id ? value : item) });
  const putLab = (value: Lab) => onChange({ ...work, labs: labs.map(item => item.id === value.id ? value : item) });
  const putLog = (value: ActivityLogSpec) => onChange({ ...work, activityLog: value });
  function add(kind: Kind) {
    const id = `${kind}-${uid()}`;
    if (kind === "rubric") onChange({ ...work, rubrics: [...rubrics, { id, title: "New rubric", criteria: [{ id: `criterion-${uid()}`, name: "Criterion", levels: [{ points: 1, label: "Meets criterion" }, { points: 0, label: "Not yet" }] }] }] });
    if (kind === "writing") onChange({ ...work, writing: [...writing, { id, title: "New writing task", kind: "short", prompt: "", selfCheck: true }] });
    if (kind === "lab") onChange({ ...work, labs: [...labs, { id, title: "New lab", adult: false, safety: [], materials: [], steps: [], tables: [], questions: [] }] });
    if (kind === "log") onChange({ ...work, activityLog: { title: "Activity log", types: [], uploads: true } });
    setSelected({ kind, id: kind === "log" ? "log" : id }); setError(""); setPendingRemoval(null);
  }
  const malformedLinks = lessons.some(lesson => {
    const blocks = [...lesson.body.matchAll(ASSIGN_BLOCK)];
    return blocks.some(block => parseAssignBlock(block[1]).problems.length) || (lesson.body.match(/^```assignment\b/gm) ?? []).length !== blocks.length;
  });
  function removalReason(kind: Kind, id: string) {
    if (kind === "rubric") return [...writing, ...labs].some(item => item.rubric === id) ? "Choose another rubric for its writing tasks and labs first." : "";
    if (malformedLinks) return "Repair malformed lesson assignment blocks before removing resources.";
    return lessons.some(lesson => lessonReferencesWork(lesson.body, kind, id)) ? "Detach this resource from its lessons first." : "";
  }
  const resource = (kind: Kind, id: string) => kind === "rubric" ? rubrics.find(x => x.id === id) : kind === "writing" ? writing.find(x => x.id === id) : kind === "lab" ? labs.find(x => x.id === id) : work.activityLog;
  function remove(kind: Kind, id: string) {
    if (!pendingRemoval || pendingRemoval.kind !== kind || pendingRemoval.id !== id || JSON.stringify(resource(kind, id)) !== pendingRemoval.snapshot) { setPendingRemoval(null); setError("The resource changed. Review it before deleting."); return; }
    const reason = removalReason(kind, id); if (reason) { setError(reason); return; }
    if (kind === "rubric") onChange({ ...work, rubrics: rubrics.filter(item => item.id !== id) });
    if (kind === "writing") onChange({ ...work, writing: writing.filter(item => item.id !== id) });
    if (kind === "lab") onChange({ ...work, labs: labs.filter(item => item.id !== id) });
    if (kind === "log") { const next = { ...work }; delete next.activityLog; onChange(next); }
    setSelected(null); setError(""); setPendingRemoval(null);
  }
  const rubric = selected?.kind === "rubric" ? rubrics.find(item => item.id === selected.id) : undefined;
  const task = selected?.kind === "writing" ? writing.find(item => item.id === selected.id) : undefined;
  const lab = selected?.kind === "lab" ? labs.find(item => item.id === selected.id) : undefined;
  const log = selected?.kind === "log" ? work.activityLog : undefined;
  const common = <T extends WritingTask | Lab>(item: T, update: (value: T) => void) => <>
    <Text label="Resource title" value={item.title} onChange={title => update({ ...item, title })} />
    <label className="field"><span>Resource module</span><select aria-label="Resource module" value={item.module ?? ""} onChange={e => { const next = { ...item }; if (e.target.value) next.module = e.target.value; else delete next.module; update(next); }}><option value="">All modules</option>{modules.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}</select></label>
    <NumberField label="Estimated minutes" value={item.minutes} onChange={minutes => { const next = { ...item }; if (minutes === undefined) delete next.minutes; else next.minutes = minutes; update(next); }} />
    <label className="field"><span>Resource rubric</span><select aria-label="Resource rubric" value={item.rubric ?? ""} onChange={e => { const next = { ...item }; if (e.target.value) next.rubric = e.target.value; else delete next.rubric; update(next); }}><option value="">No rubric</option>{rubrics.map(r => <option key={r.id} value={r.id}>{r.title || r.id}</option>)}</select></label>
    <Check label="Offer rubric self-check" checked={item.selfCheck !== false} onChange={selfCheck => update({ ...item, selfCheck })} />
  </>;
  const problems = [...validateCourseWork(work, { moduleIds: modules.map(module => module.id) }), ...workProblems({ ...work, modules, lessons: lessons.map(lesson => ({ ...lesson, module: "" })) })];
  return <section aria-label="Work resources" className="stack visual-work-resources">
    <p>Structured writing, rubric, lab and activity resources. Changes belong to the course draft; stable resource IDs are retained when editing.</p>
    <div className="row"><button type="button" onClick={() => add("rubric")}>Add rubric</button><button type="button" onClick={() => add("writing")}>Add writing task</button><button type="button" onClick={() => add("lab")}>Add lab</button><button type="button" disabled={!!work.activityLog} onClick={() => add("log")}>Add activity log</button></div>
    <nav aria-label="Work resource list">{([...rubrics.map(item => ({ kind: "rubric" as const, id: item.id, title: item.title })), ...writing.map(item => ({ ...item, kind: "writing" as const })), ...labs.map(item => ({ ...item, kind: "lab" as const })), ...(work.activityLog ? [{ kind: "log" as const, id: "log", title: work.activityLog.title }] : [])]).map(item => <button type="button" key={item.kind + item.id} onClick={() => { setSelected(item); setError(""); setPendingRemoval(null); }}>Edit {item.title || item.id}</button>)}</nav>
    {rubric && <fieldset><legend>Rubric</legend><Text label="Rubric title" value={rubric.title} onChange={title => putRubric({ ...rubric, title })} />
      {rubric.criteria.map((criterion, i) => <fieldset key={criterion.id}><legend>Criterion {i + 1}</legend>
        <Text label={`Criterion ${i + 1} name`} value={criterion.name} onChange={name => putRubric({ ...rubric, criteria: rubric.criteria.map((c, j) => j === i ? { ...c, name } : c) })} />
        <Text label={`Criterion ${i + 1} description`} value={criterion.description} multiline onChange={description => putRubric({ ...rubric, criteria: rubric.criteria.map((c, j) => j === i ? { ...c, description } : c) })} />
        {criterion.levels.map((level, n) => { const update = (patch: Partial<typeof level>) => putRubric({ ...rubric, criteria: rubric.criteria.map((c, j) => j === i ? { ...c, levels: c.levels.map((l, k) => k === n ? { ...l, ...patch } : l) } : c) }); return <fieldset key={n}><legend>Level {n + 1}</legend><NumberField label={`Criterion ${i + 1} level ${n + 1} points`} value={level.points} onChange={points => update({ points: points ?? 0 })} /><Text label={`Criterion ${i + 1} level ${n + 1} label`} value={level.label} onChange={label => update({ label })} /><Text label={`Criterion ${i + 1} level ${n + 1} description`} value={level.description} multiline onChange={description => update({ description })} /><button type="button" onClick={() => putRubric({ ...rubric, criteria: rubric.criteria.map((c, j) => j === i ? { ...c, levels: c.levels.filter((_, k) => k !== n) } : c) })}>Remove level {n + 1} from criterion {i + 1}</button></fieldset>; })}
        <button type="button" onClick={() => putRubric({ ...rubric, criteria: rubric.criteria.map((c, j) => j === i ? { ...c, levels: [...c.levels, { points: Math.max(...c.levels.map(l => l.points), 0) + 1, label: "New level" }] } : c) })}>Add level to criterion {i + 1}</button>
        <button type="button" onClick={() => putRubric({ ...rubric, criteria: rubric.criteria.filter((_, j) => j !== i) })}>Remove criterion {i + 1}</button>
      </fieldset>)}<button type="button" onClick={() => putRubric({ ...rubric, criteria: [...rubric.criteria, { id: `criterion-${uid()}`, name: "New criterion", levels: [{ points: 1, label: "Meets criterion" }, { points: 0, label: "Not yet" }] }] })}>Add criterion</button></fieldset>}
    {task && <fieldset><legend>Writing task</legend>{common(task, putWriting)}
      <label className="field"><span>Writing format</span><select aria-label="Writing format" value={task.kind} onChange={e => putWriting({ ...task, kind: e.target.value as WritingTask["kind"] })}><option value="short">Short response</option><option value="essay">Essay</option></select></label>
      <Text label="Writing prompt" value={task.prompt} multiline onChange={prompt => putWriting({ ...task, prompt })} />
      <TextResourceFileInput key={task.id} label="Writing prompt" value={task.prompt} onApply={prompt => putWriting({ ...task, prompt })} />
      {(["min", "max"] as const).map(key => <NumberField key={key} label={key === "min" ? "Minimum words" : "Maximum words"} value={task.words?.[key]} onChange={value => { const words = { ...task.words }; if (value === undefined) delete words[key]; else words[key] = value; const next = { ...task }; if (Object.keys(words).length) next.words = words; else delete next.words; putWriting(next); }} />)}
    </fieldset>}
    {lab && <fieldset><legend>Lab</legend>{common(lab, putLab)}
      <Text label="Lab introduction" value={lab.intro} multiline onChange={intro => putLab({ ...lab, intro })} />
      <TextResourceFileInput key={lab.id} label="Lab introduction" value={lab.intro ?? ""} onApply={intro => putLab({ ...lab, intro })} />
      <Check label="Adult supervision required" checked={lab.adult} onChange={adult => putLab({ ...lab, adult })} />
      <Text label="Safety notes (one per line)" value={lab.safety.join("\n")} multiline onChange={value => putLab({ ...lab, safety: lines(value) })} />
      <Text label="Materials (one per line)" value={lab.materials.join("\n")} multiline onChange={value => putLab({ ...lab, materials: lines(value) })} />
      {lab.steps.map((step, i) => <fieldset key={i}><legend>Step {i + 1}</legend><Text label={`Step ${i + 1} instructions`} value={step.text} multiline onChange={text => putLab({ ...lab, steps: lab.steps.map((s, j) => j === i ? { ...s, text } : s) })} /><Check label={`Step ${i + 1} requires an adult`} checked={!!step.adult} onChange={adult => putLab({ ...lab, ...(adult ? { adult: true } : {}), steps: lab.steps.map((s, j) => j === i ? { ...s, adult } : s) })} /><button type="button" onClick={() => putLab({ ...lab, steps: lab.steps.filter((_, j) => j !== i) })}>Remove step {i + 1}</button></fieldset>)}
      <button type="button" onClick={() => putLab({ ...lab, steps: [...lab.steps, { text: "" }] })}>Add step</button>
      {lab.tables.map((table, i) => { const update = (patch: Partial<typeof table>) => putLab({ ...lab, tables: lab.tables.map((t, j) => j === i ? { ...t, ...patch } : t) }); return <fieldset key={table.id}><legend>Data table {i + 1}</legend><Text label={`Table ${i + 1} title`} value={table.title} onChange={title => update({ title })} /><Text label={`Table ${i + 1} columns (one per line)`} value={table.columns.join("\n")} multiline onChange={value => update({ columns: lines(value) })} /><NumberField label={`Table ${i + 1} starting rows`} value={table.rows} onChange={rows => update({ rows: rows ?? 0 })} /><Text label={`Table ${i + 1} row labels (one per line)`} value={table.rowLabels?.join("\n")} multiline onChange={value => { const next = { ...table }; if (value) next.rowLabels = lines(value); else delete next.rowLabels; putLab({ ...lab, tables: lab.tables.map((t, j) => j === i ? next : t) }); }} /><button type="button" onClick={() => putLab({ ...lab, tables: lab.tables.filter((_, j) => j !== i) })}>Remove table {i + 1}</button></fieldset>; })}
      <button type="button" onClick={() => putLab({ ...lab, tables: [...lab.tables, { id: `table-${uid()}`, columns: ["Observation"], rows: 1 }] })}>Add data table</button>
      {lab.questions.map((question, i) => <fieldset key={question.id}><legend>Question {i + 1}</legend><Text label={`Question ${i + 1} prompt`} value={question.prompt} multiline onChange={prompt => putLab({ ...lab, questions: lab.questions.map((q, j) => j === i ? { ...q, prompt } : q) })} /><label className="field"><span>Question {i + 1} kind</span><select aria-label={`Question ${i + 1} kind`} value={question.kind} onChange={e => putLab({ ...lab, questions: lab.questions.map((q, j) => j === i ? { ...q, kind: e.target.value as "observation" | "conclusion" } : q) })}><option value="observation">Observation</option><option value="conclusion">Conclusion</option></select></label><button type="button" onClick={() => putLab({ ...lab, questions: lab.questions.filter((_, j) => j !== i) })}>Remove question {i + 1}</button></fieldset>)}
      <button type="button" onClick={() => putLab({ ...lab, questions: [...lab.questions, { id: `question-${uid()}`, prompt: "", kind: "observation" }] })}>Add question</button>
      <Text label="Photo prompt" value={lab.photos} multiline onChange={photos => putLab({ ...lab, photos })} />
    </fieldset>}
    {log && <fieldset><legend>Activity log</legend><Text label="Activity log title" value={log.title} onChange={title => putLog({ ...log, title })} /><Text label="Activity types (one per line)" value={log.types.join("\n")} multiline onChange={value => putLog({ ...log, types: lines(value) })} /><Text label="Activity prompt" value={log.prompt} multiline onChange={prompt => putLog({ ...log, prompt })} /><NumberField label="Weekly minutes target" value={log.weeklyMinutes} onChange={weeklyMinutes => { const next = { ...log }; if (weeklyMinutes === undefined) delete next.weeklyMinutes; else next.weeklyMinutes = weeklyMinutes; putLog(next); }} /><NumberField label="Weekly active days target" value={log.weeklyDays} max={7} onChange={weeklyDays => { const next = { ...log }; if (weeklyDays === undefined) delete next.weeklyDays; else next.weeklyDays = weeklyDays; putLog(next); }} /><Check label="Allow activity uploads" checked={log.uploads} onChange={uploads => putLog({ ...log, uploads })} /></fieldset>}
    {selected && <WorkResourcePreview key={selected.kind + selected.id} rubric={rubric ?? rubrics.find(r => r.id === (task?.rubric ?? lab?.rubric))} task={task} lab={lab} log={log} />}
    {selected && selected.kind !== "rubric" && <fieldset><legend>Lesson attachments</legend>{lessons.map(lesson => <Check key={lesson.id} label={`Attach to ${lesson.title}`} checked={lessonReferencesWork(lesson.body, selected.kind as LinkKind, selected.id)} onChange={attached => { if (malformedLinks) { setError("Repair malformed assignment blocks before changing attachments."); return; } if (onAssignmentAttachmentChange) onAssignmentAttachmentChange(lesson.id, { kind: selected.kind as LinkKind, ...(selected.kind === "log" ? {} : { id: selected.id }) }, attached);
      else onLessonBodyChange?.(lesson.id, linkLessonWork(lesson.body, selected.kind as LinkKind, selected.id, attached)); }} />)}</fieldset>}
    {selected && <><p className="small">Stable resource ID: {selected.id}</p><button type="button" disabled={!!removalReason(selected.kind, selected.id)} title={removalReason(selected.kind, selected.id)} onClick={() => setPendingRemoval({ ...selected, snapshot: JSON.stringify(resource(selected.kind, selected.id)) })}>Remove selected resource</button>{removalReason(selected.kind, selected.id) && <p>{removalReason(selected.kind, selected.id)}</p>}</>}
    {pendingRemoval && <div role="alert"><p>Remove this resource from the draft? Existing learner records are not erased. Attached resources cannot be removed.</p><button type="button" className="btn" onClick={() => remove(pendingRemoval.kind, pendingRemoval.id)}>Confirm resource removal</button><button type="button" className="btn" onClick={() => setPendingRemoval(null)}>Keep resource</button></div>}
    {error && <p role="alert">{error}</p>}{problems.length > 0 && <div role="status"><strong>Resolve before publishing:</strong><ul>{problems.map((problem, i) => <li key={i}>{problem}</li>)}</ul></div>}
  </section>;
}
