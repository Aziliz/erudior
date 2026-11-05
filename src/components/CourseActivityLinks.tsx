import type { AppApi } from '../App';
import type { Course } from '../lib/types';
import { activityLabels, courseActivities } from '../lib/courseActivities';

export default function CourseActivityLinks({api, course, lessonId}: {api: AppApi; course: Course; lessonId?: string}) {
  const activities = courseActivities(course, lessonId);
  if (!activities.length) return null;
  return <section style={{overflowWrap:"anywhere"}} className="panel" aria-label={lessonId ? 'Linked lesson activities' : 'Course engine activities'}>
    <h2>{lessonId ? 'Apply this lesson' : 'Course activities'}</h2>
    <p>Open the activity linked to this source. Self-study activities open directly. Supervised activities require an adult to review the source and assign it.</p>
    <ul className="work-list">{activities.map(activity => <li key={`${activity.kind}:${activity.id}`} className="work-row course-activity-card" data-activity-kind={activity.kind}>
      <div><strong>{activity.title}</strong><span className="small activity-type">{activityLabels[activity.kind]}</span></div>
      <button style={{whiteSpace:"normal",maxWidth:"100%",overflowWrap:"anywhere"}} className="btn sm" onClick={() => api.go({name:'courseActivity',courseId:course.id,kind:activity.kind,sourceId:activity.id})}>Open {activity.title}</button>
      {!lessonId && activity.lessonId && <button style={{whiteSpace:"normal",maxWidth:"100%",overflowWrap:"anywhere"}} className="btn sm ghost" onClick={() => api.go({name:'lesson',courseId:course.id,lessonId:activity.lessonId!})}>Open linked lesson<span className="sr-only"> for {activity.title}</span></button>}
    </li>)}</ul>
  </section>;
}
