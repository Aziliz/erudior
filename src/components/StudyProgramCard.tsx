import type { ReactNode } from "react";
import { programCourses, type StudyProgram } from "../lib/studyPrograms";
import type { LearningPathwayProgress } from "../lib/learningPathways";

/** Shared public/app outline. Availability comes from the real catalog, never an outline. */
export default function StudyProgramCard({ program, availableIds, action, summaries = [], onOpenCourse }: {
  program: StudyProgram;
  availableIds: ReadonlySet<string>;
  action?: ReactNode;
  summaries?: LearningPathwayProgress[];
  onOpenCourse?: (id: string) => void;
}) {
  const courses = programCourses(program);
  const titles = new Map(courses.map(course => [course.courseId, course.title]));
  const available = courses.filter(course => availableIds.has(course.courseId)).length;
  return <article className="panel study-program" aria-label={`${program.title} program`}>
    <header className="progress-section-heading"><div><p className="small muted">Program · {program.stages.length} stages · {courses.length} courses</p>
      <h3>{program.title}</h3><p>{program.description}</p></div>{action}</header>
    <p className="notice">{program.notice}</p>
    <p className="small muted">{available} of {courses.length} courses available · {courses.length - available} planned. Recommended prerequisites guide your study order; they do not grant credit or block public reading.</p>
    {program.stages.map((stage, index) => {
      const summary = summaries[index];
      return <details key={stage.id} className="pathway-sequence">
        <summary>Stage {index + 1}: {stage.title} · {stage.courses.length} courses{summary ? ` · ${summary.completedCourses}/${summary.totalCourses} completed` : ""}</summary>
        <p>{stage.summary}</p>
        {summary && <div className="learning-progress-meter"><progress max={100} value={summary.percent} aria-label={`${stage.title} progress`} /><strong>{summary.percent}%</strong></div>}
        <ol>{stage.courses.map(course => <li key={course.courseId}>
          <details><summary>{course.title} — {availableIds.has(course.courseId) ? "Available" : "Planned"}</summary>
            <p className="small"><b>Recommended first:</b> {course.recommendedBefore.length ? course.recommendedBefore.map(id => titles.get(id) ?? id).join("; ") : "No prior legal study required."}</p>
            <h4>Module outline</h4><ol>{course.modules.map(module => <li key={module}>{module}</li>)}</ol>
            <h4>Learning outcomes</h4><ul>{course.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
            <p><b>Planned assignment:</b> {course.assignment}</p>
            {availableIds.has(course.courseId) && onOpenCourse && <button className="btn sm" onClick={() => onOpenCourse(course.courseId)}>View course<span className="sr-only">: {course.title}</span></button>}
          </details>
        </li>)}</ol>
        <p><b>Stage portfolio:</b> {stage.milestone}</p>
        <p className="small muted">Portfolio work is a study recommendation, separate from measured course completion. It is not automatically graded or credited.</p>
      </details>;
    })}
    <details className="pathway-sequence"><summary>Curriculum references</summary>
      <p className="small muted">Reviewed {program.reviewedOn}. This is Erudior’s preparation sequence; individual schools set their own requirements and course order.</p>
      <ul>{program.sources.map(source => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul>
    </details>
  </article>;
}
