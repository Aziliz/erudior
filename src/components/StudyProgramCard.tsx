import type { ReactNode } from "react";
import { CATALOG } from "../lib/catalog";
import { poolStatus, programCourseIds, programCourses, type ProgramCourse, type StudyProgram } from "../lib/studyPrograms";
import type { LearningPathwayProgress } from "../lib/learningPathways";

/** Shared public/app outline. Availability comes from the real catalog, never an outline. */
export default function StudyProgramCard({ program, availableIds, action, summaries = [], onOpenCourse, selection }: {
  program: StudyProgram;
  availableIds: ReadonlySet<string>;
  action?: ReactNode;
  summaries?: LearningPathwayProgress[];
  onOpenCourse?: (id: string) => void;
  /** A followed program's chosen courses and which are complete, for area progress. */
  selection?: { chosen: readonly string[]; completed: ReadonlySet<string> };
}) {
  const courses = programCourses(program);
  const outlines = new Map(courses.map(course => [course.courseId, course]));
  const titles = new Map([...CATALOG.map(entry => [entry.id, entry.title] as const), ...courses.map(course => [course.courseId, course.title] as const)]);
  const pools = program.pools ?? [];
  const ids = pools.length ? programCourseIds(program) : courses.map(course => course.courseId);
  const available = ids.filter(id => availableIds.has(id)).length;
  const outline = (course: ProgramCourse, none: string) => <>
    <p className="small"><b>Recommended first:</b> {course.recommendedBefore.length ? course.recommendedBefore.map(id => titles.get(id) ?? id).join("; ") : none}</p>
    <h4>Module outline</h4><ol>{course.modules.map(module => <li key={module}>{module}</li>)}</ol>
    <h4>Learning outcomes</h4><ul>{course.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
    <p><b>Planned assignment:</b> {course.assignment}</p>
  </>;
  return <article className="panel study-program" aria-label={`${program.title} program`}>
    <header className="progress-section-heading"><div><p className="small muted">Program · {pools.length ? `${pools.length} areas · ${ids.length} courses to choose from` : `${program.stages.length} stages · ${courses.length} courses`}</p>
      <h3>{program.title}</h3><p>{program.description}</p></div>{action}</header>
    <p className="notice">{program.notice}</p>
    <p className="small muted">{available} of {ids.length} courses available · {ids.length - available} planned. {pools.length ? "Choose at least the minimum in each area, and add more if you like. Edit your pathway to change your choices." : "Recommended prerequisites guide your study order; they do not grant credit or block public reading."}</p>
    {pools.length > 0 && <p className="small muted">Minimum to finish: {pools.filter(pool => !pool.theme).reduce((n, pool) => n + pool.minimum, 0)} courses. Shared areas are met by courses you take in other areas.</p>}
    {pools.map(pool => {
      const status = selection ? poolStatus(pool, selection.chosen, selection.completed) : null;
      return <details key={pool.id} className="pathway-sequence">
        <summary>{pool.title} · choose at least {pool.minimum}{pool.theme ? " (shared)" : ""}{status ? ` · ${status.chosen.length} chosen · ${status.completed.length} completed${status.met ? " · met" : ""}` : ""}</summary>
        <p>{pool.summary}</p>
        {status && <div className="learning-progress-meter"><progress max={pool.minimum} value={Math.min(pool.minimum, status.completed.length)} aria-label={`${pool.title} progress`} /><strong>{Math.min(pool.minimum, status.completed.length)} of {pool.minimum}</strong></div>}
        {status && !status.planned && <p className="small notice">Your pathway needs {pool.minimum - status.chosen.length > 0 ? `${pool.minimum - status.chosen.length} more course${pool.minimum - status.chosen.length === 1 ? "" : "s"}` : "different courses"} here{status.requirements.filter(req => req.chosen < req.minimum).map(req => `, including ${req.minimum} in ${req.label}`).join("")}.</p>}
        {pool.requirements?.length ? <p className="small">Includes at least {pool.requirements.map(req => `${req.minimum} in ${req.label}`).join(" and ")}.</p> : null}
        <ul>{pool.courseIds.map(id => {
          const course = outlines.get(id);
          const label = `${titles.get(id) ?? id} — ${availableIds.has(id) ? "Available" : "Planned"}${selection?.chosen.includes(id) ? (selection.completed.has(id) ? " · Completed" : " · Chosen") : ""}`;
          return <li key={id}>
            {course ? <details><summary>{label}</summary>{outline(course, "None.")}
              {availableIds.has(id) && onOpenCourse && <button className="btn sm" onClick={() => onOpenCourse(id)}>View course<span className="sr-only">: {course.title}</span></button>}
            </details> : <span>{label}{availableIds.has(id) && onOpenCourse && <> <button className="btn sm" onClick={() => onOpenCourse(id)}>View course<span className="sr-only">: {titles.get(id) ?? id}</span></button></>}</span>}
          </li>;
        })}</ul>
      </details>;
    })}
    {program.stages.map((stage, index) => {
      const summary = summaries[index];
      return <details key={stage.id} className="pathway-sequence">
        <summary>Stage {index + 1}: {stage.title} · {stage.courses.length} courses{summary ? ` · ${summary.completedCourses}/${summary.totalCourses} completed` : ""}</summary>
        <p>{stage.summary}</p>
        {summary && <div className="learning-progress-meter"><progress max={100} value={summary.percent} aria-label={`${stage.title} progress`} /><strong>{summary.percent}%</strong></div>}
        <ol>{stage.courses.map(course => <li key={course.courseId}>
          <details><summary>{course.title} — {availableIds.has(course.courseId) ? "Available" : "Planned"}</summary>
            {outline(course, "No prior legal study required.")}
            {availableIds.has(course.courseId) && onOpenCourse && <button className="btn sm" onClick={() => onOpenCourse(course.courseId)}>View course<span className="sr-only">: {course.title}</span></button>}
          </details>
        </li>)}</ol>
        <p><b>Stage portfolio:</b> {stage.milestone}</p>
        <p className="small muted">Portfolio work is a study recommendation, separate from measured course completion. It is not automatically graded or credited.</p>
      </details>;
    })}
    <details className="pathway-sequence"><summary>Curriculum references</summary>
      <p className="small muted">Reviewed {program.reviewedOn}. {pools.length ? "Area minimums come from these state requirements; individual schools set their own." : "This is Erudior’s preparation sequence; individual schools set their own requirements and course order."}</p>
      <ul>{program.sources.map(source => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul>
    </details>
  </article>;
}
