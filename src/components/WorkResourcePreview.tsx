import type { ActivityLogSpec, Lab, Rubric, WritingTask } from "../lib/courseWork";

/** Read-only structured preview. Does not submit work, play media or fetch linked assets. */
export default function WorkResourcePreview({ rubric, task, lab, log }: { rubric?: Rubric; task?: WritingTask; lab?: Lab; log?: ActivityLogSpec }) {
  const title = task?.title ?? lab?.title ?? log?.title ?? rubric?.title ?? "Rubric";
  return <details className="resource-author-preview"><summary>Preview selected resource</summary><section aria-label="Selected resource preview">
    <h3>{title}</h3><p className="small">Draft content preview. Text is shown literally; this does not create a learner attempt, submission, review or grade.</p>
    {task && <><p>{task.kind === "essay" ? "Essay" : "Short response"}{task.words?.min !== undefined ? ` · Minimum ${task.words.min} words` : ""}{task.words?.max !== undefined ? ` · Maximum ${task.words.max} words` : ""}</p><pre className="resource-text-preview">{task.prompt}</pre></>}
    {lab && <><p>{lab.adult ? "Adult supervision required" : "Follow the stated safety guidance"}</p><pre className="resource-text-preview">{lab.intro}</pre><h4>Safety</h4><ul>{lab.safety.map((x,i)=><li key={i}>{x}</li>)}</ul><h4>Materials</h4><ul>{lab.materials.map((x,i)=><li key={i}>{x}</li>)}</ul><h4>Steps</h4><ol>{lab.steps.map((x,i)=><li key={i}>{x.text}{x.adult ? " (Adult needed)" : ""}</li>)}</ol>{lab.tables.map(t=><section key={t.id}><h4>{t.title ?? "Data table"}</h4><p>Columns: {t.columns.join(" · ")} · Starting rows: {t.rows}</p></section>)}<h4>Questions</h4><ol>{lab.questions.map(q=><li key={q.id}>{q.prompt} ({q.kind})</li>)}</ol>{lab.photos && <p>Photo prompt: {lab.photos}</p>}</>}
    {log && <><pre className="resource-text-preview">{log.prompt}</pre><p>Activity types: {log.types.join(" · ")}</p><p>Uploads: {log.uploads ? "Allowed" : "Disabled"}</p><p>Weekly targets: {log.weeklyMinutes ?? "No"} minutes; {log.weeklyDays ?? "No"} days.</p></>}
    {rubric && <><h4>Rubric: {rubric.title ?? "Assessment criteria"}</h4>{rubric.criteria.map(c=><section key={c.id}><h4>{c.name}</h4>{c.description && <p>{c.description}</p>}<ul>{c.levels.map((l,i)=><li key={i}><strong>{l.points} points: {l.label}</strong>{l.description ? ` — ${l.description}` : ""}</li>)}</ul></section>)}</>}
  </section></details>;
}
