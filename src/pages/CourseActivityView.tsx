import type { AppApi } from '../App';
import type { Course } from '../lib/types';
import { activityLabels, type CourseActivityKind } from '../lib/courseActivities';
import CourseEngineInspection, { type EngineSources } from '../components/CourseEngineInspection';
import LearnerAdvancedAssessment from '../components/LearnerAdvancedAssessment';
import LearnerScientific from '../components/LearnerScientific';
import LearnerBranching from '../components/LearnerBranching';
import SpreadsheetCourseAssignment from '../components/SpreadsheetCourseAssignment';

/** A course-specific entrance, never an implicit assignment or approval. */
export default function CourseActivityView({api, course, kind, sourceId}: {api: AppApi; course: Course; kind: CourseActivityKind; sourceId: string}) {
  const advanced = kind === 'advanced' ? course.advancedAssessments?.find(s => s.id === sourceId) : undefined;
  const scientific = kind === 'scientific' ? course.scientificWorkspaces?.find(s => s.id === sourceId) : undefined;
  const branching = kind === 'branching' ? course.branchingScenarios?.find(s => s.id === sourceId) : undefined;
  const spreadsheet = kind === 'spreadsheet' ? course.spreadsheetAssignments?.find(s => s.id === sourceId) : undefined;
  const source = advanced ?? scientific ?? branching ?? spreadsheet;
  const lesson = source?.lessonId ? course.lessons.find(l => l.id === source.lessonId) : undefined;
  const inspection: EngineSources = {
    advancedAssessments: advanced ? [advanced] : [], scientificWorkspaces: scientific ? [scientific] : [],
    branchingScenarios: branching ? [branching] : [], spreadsheetAssignments: spreadsheet ? [spreadsheet] : [],
  };
  const props = {api,courseId:course.id,courseRevision:course.revision};
  return <div className="page" style={{overflowWrap:"anywhere"}}>
    <div className="row">
      {lesson && <button style={{whiteSpace:"normal",maxWidth:"100%",overflowWrap:"anywhere"}} className="back" onClick={() => api.go({name:'lesson',courseId:course.id,lessonId:lesson.id})}>← Return to lesson: {lesson.title}</button>}
      <button style={{whiteSpace:"normal",maxWidth:"100%",overflowWrap:"anywhere"}} className="btn ghost" onClick={() => api.go({name:'course',courseId:course.id,tab:'work'})}>All course activities</button>
    </div>
    {!source ? <p role="alert">This activity source is no longer in the installed course. Nothing was assigned or changed. Historical results remain on Progress.</p> : <>
      <h1>{source.title}</h1>
      <p>{activityLabels[kind]} · Course {course.title} (<code>{course.id}</code>), revision {course.revision ?? 'unversioned'} · Source <code>{source.id}</code>{'revision' in source ? `, revision ${source.revision}` : ''}</p>
      {!spreadsheet && <section className="notice" aria-label="Adult review and assignment handoff">
        <h2>Review and assignment handoff</h2>
        <p>Only assignments bound to this exact course source appear below. A supervising adult must open the matching installed course source in the appropriate studio, save it locally, review its exact content and permissions, then explicitly select the learner and assign it. For assessments, select the intended question variant as well.</p>
        <p>A course update or edited local copy does not replace old evidence. Older assignments remain on Progress; they are not silently relabeled as this source. Local review is separate from publication review.</p>
        {api.family && <button style={{whiteSpace:"normal",maxWidth:"100%",overflowWrap:"anywhere"}} className="btn" onClick={() => api.go({name:'parent',tab:kind === 'advanced' ? 'advanced-assessment' : kind === 'scientific' ? 'scientific' : 'branching'})}>Open supervising-adult studio (unlock required)</button>}
        {!api.family && <p>Set up or select a family learner and supervising adult to assign these activities. You can inspect the source without creating a profile.</p>}
      </section>}
      {advanced && <LearnerAdvancedAssessment {...props} source={advanced} />}
      {scientific && <LearnerScientific {...props} source={scientific} />}
      {branching && <LearnerBranching {...props} source={branching} />}
      {spreadsheet && <SpreadsheetCourseAssignment api={api} courseId={course.id} assignment={spreadsheet} />}
      <details><summary>Inspect this exact course activity</summary><CourseEngineInspection sources={inspection} /></details>
    </>}
  </div>;
}
