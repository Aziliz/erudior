import { parseAdvancedAssessmentPack, advancedAssessmentJSON, type AdvancedAssessmentPack } from './advancedAssessment';
import type { Course } from './courseContentTypes';
export type CourseAdvancedAssessment = AdvancedAssessmentPack & { lessonId?: string };
/** Portable sources never carry local review authority. */
export function parseCourseAdvancedAssessments(value: unknown, lessonIds: ReadonlySet<string>): CourseAdvancedAssessment[] {
 if(value===undefined)return [];
 advancedAssessmentJSON(value);
 if(!Array.isArray(value)||value.length>30)throw Error('At most 30 advanced assessments are supported.');
 const seen=new Set<string>();
 return value.map(item=>{
  if(!item||typeof item!=='object'||Array.isArray(item))throw Error('Invalid advanced assessment.');
  const {lessonId,...source}=item;
  if('courseOrigin' in source)throw Error('Portable course sources cannot carry local course bindings.');
  if('approval' in source)throw Error('Portable advanced assessment sources cannot carry local approval.');
  const pack=parseAdvancedAssessmentPack(source);
  if(seen.has(pack.id))throw Error('Duplicate advanced assessment ID.');seen.add(pack.id);
  if(lessonId!==undefined&&(typeof lessonId!=='string'||!lessonIds.has(lessonId)))throw Error('Unknown advanced assessment lesson.');
  return {...pack,...(lessonId===undefined?{}:{lessonId})};
 });
}
export function advancedAssessmentCourseProblems(value:unknown,lessonIds:ReadonlySet<string>):string[]{try{parseCourseAdvancedAssessments(value,lessonIds);return [];}catch(e){return [(e as Error).message];}}
export function setCourseAdvancedAssessment(course:Course,scenario:CourseAdvancedAssessment):Course {
 const values=course.advancedAssessments??[];
 const next=values.some(x=>x.id===scenario.id)?values.map(x=>x.id===scenario.id?scenario:x):[...values,scenario];
 return {...course,advancedAssessments:parseCourseAdvancedAssessments(next,new Set(course.lessons.map(l=>l.id)))};
}

/** Stable IDs and explicit revisions preserve the meaning of published source labels. */
export function advancedAssessmentRevisionProblems(previous:readonly CourseAdvancedAssessment[],next:readonly CourseAdvancedAssessment[]):string[]{
 const stable=(v:unknown):string=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
 const issues:string[]=[];
 for(const old of previous){const current=next.find(s=>s.id===old.id);
  if(!current){issues.push(`Advanced assessment ${old.id}: published identity removed`);continue;}
  if(current.rubric.id===old.rubric.id && (current.rubric.revision<old.rubric.revision || (stable(current.rubric)!==stable(old.rubric)&&current.rubric.revision<=old.rubric.revision)))issues.push(`Advanced assessment ${old.id}: changed rubric requires a greater rubric revision`);
  if(current.lessonId!==old.lessonId)issues.push(`Advanced assessment ${old.id}: published lesson reference changed`);
  if(current.revision<old.revision || (stable(current)!==stable(old)&&current.revision<=old.revision))issues.push(`Advanced assessment ${old.id}: changed source requires a greater revision`);
 }
 return issues;
}
