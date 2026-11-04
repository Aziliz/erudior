import type { CourseWork } from "../lib/courseWork";
import Markdown from "./Markdown";

/** Read-only authored assessment data, never learner scores or official approval controls. */
export default function CourseWorkInspection({ work }: { work: CourseWork }) {
  return <section aria-label="Assessed work inspection">
    <h3>Writing, rubrics, labs, and activity logs</h3>
    {work.writing?.map(task => <article key={task.id}>
      <h4>Writing: {task.title}</h4><p>ID: {task.id} · Kind: {task.kind} · Module: {task.module ?? "Any"} · Rubric: {task.rubric ?? "None"}</p>
      <Markdown source={task.prompt} />
      <p>Target words: {task.words?.min ?? "No minimum"}–{task.words?.max ?? "No maximum"} · Minutes: {task.minutes ?? "Unspecified"} · Self-check: {task.selfCheck === false ? "Off" : "On"}</p>
    </article>)}
    {work.rubrics?.map(rubric => <article key={rubric.id}>
      <h4>Rubric: {rubric.title ?? rubric.id}</h4><p>ID: {rubric.id}</p>
      {rubric.criteria.map(criterion => <div key={criterion.id}><h5>{criterion.name} ({criterion.id})</h5><p>{criterion.description}</p>
        <ul>{criterion.levels.map((level, i) => <li key={i}>{level.points} points — {level.label}: {level.description}</li>)}</ul>
      </div>)}
    </article>)}
    {work.labs?.map(lab => <article key={lab.id}>
      <h4>Lab: {lab.title}</h4><p>ID: {lab.id} · Module: {lab.module ?? "Any"} · Rubric: {lab.rubric ?? "None"} · Minutes: {lab.minutes ?? "Unspecified"}</p>
      <Markdown source={lab.intro ?? ""} /><p>Adult supervision: {lab.adult ? "Required" : "Not marked required"}</p>
      <h5>Safety</h5><ul>{lab.safety.map((note, i) => <li key={i}>{note}</li>)}</ul>
      <h5>Materials</h5><ul>{lab.materials.map((material, i) => <li key={i}>{material}</li>)}</ul>
      <h5>Steps</h5><ol>{lab.steps.map((step, i) => <li key={i}>{step.text}{step.adult && " — Adult required"}</li>)}</ol>
      <h5>Data tables</h5>{lab.tables.map(table => <div key={table.id}><p>{table.title ?? table.id} ({table.id}) · Rows: {table.rows}</p><p>Columns: {table.columns.join(" · ")}</p><p>Row labels: {table.rowLabels?.join(" · ") ?? "None"}</p></div>)}
      <h5>Observation and conclusion questions</h5><ul>{lab.questions.map(question => <li key={question.id}>{question.id} ({question.kind}): {question.prompt}</li>)}</ul>
      <p>Photo instructions: {lab.photos ?? "None"} · Self-check: {lab.selfCheck === false ? "Off" : "On"}</p>
    </article>)}
    {work.activityLog && <article><h4>Activity log: {work.activityLog.title}</h4><p>Activity types: {work.activityLog.types.join(" · ")}</p>
      <p>Weekly minutes: {work.activityLog.weeklyMinutes ?? "Unspecified"} · Weekly days: {work.activityLog.weeklyDays ?? "Unspecified"} · Uploads: {work.activityLog.uploads ? "Allowed" : "Disabled"}</p>
      <Markdown source={work.activityLog.prompt ?? ""} />
    </article>}
  </section>;
}
