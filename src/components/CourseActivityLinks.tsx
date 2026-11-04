import type { AppApi } from '../App';
import type { Course } from '../lib/types';
import { activityLabels, courseActivities } from '../lib/courseActivities';

export default function CourseActivityLinks({api, course, lessonId}: {api: AppApi; course: Course; lessonId?: string}) {
  const activities = courseActivities(course, lessonId);
  if (!activities.length) return null;
  return <section style={{overflowWrap:"anywhere"}} className="panel" aria-label={lessonId ? 'Linked lesson activities' : 'Course engine activities'}>
    <h2>{lessonId ? 'Apply this lesson' : 'Course activities'}</h2>
    <p>Open the activity linked to this source. Advanced assessments, scientific workspaces and branching scenarios require a supervising adult to review and assign the exact source; opening a link does not create an assignment.</p>
    <ul className="work-list">{activities.map(activity => <li key={`${activity.kind}:${activity.id}`} className="work-row">
      <div><strong>{activity.title}</strong><span className="small muted">{activityLabels[activity.kind]} · Source {activity.id}{activity.revision !== undefined ? ` · revision ${activity.revision}` : ' · unversioned course'}</span></div>
      <button style={{whiteSpace:"normal",maxWidth:"100%",overflowWrap:"anywhere"}} className="btn sm" onClick={() => api.go({name:'courseActivity',courseId:course.id,kind:activity.kind,sourceId:activity.id})}>Open {activity.title}</button>
      {!lessonId && activity.lessonId && <button style={{whiteSpace:"normal",maxWidth:"100%",overflowWrap:"anywhere"}} className="btn sm ghost" onClick={() => api.go({name:'lesson',courseId:course.id,lessonId:activity.lessonId!})}>Open linked lesson<span className="sr-only"> for {activity.title}</span></button>}
    </li>)}</ul>
  </section>;
}
