import { parseScientificPack, scientificJSON, type ScientificPack } from './scientificWorkspace';
import type { Course } from './courseContentTypes';
export type CourseScientificWorkspace = ScientificPack & { lessonId?: string };
/** Portable sources never carry local review authority. */
export function parseCourseScientificWorkspaces(value: unknown, lessonIds: ReadonlySet<string>): CourseScientificWorkspace[] {
 if(value===undefined)return [];
 scientificJSON(value);
 if(!Array.isArray(value)||value.length>30)throw Error('At most 30 scientific workspaces are supported.');
 const seen=new Set<string>();
 return value.map(item=>{
  if(!item||typeof item!=='object'||Array.isArray(item))throw Error('Invalid scientific workspace.');
  const {lessonId,...source}=item;
  if('approval' in source)throw Error('Portable scientific sources cannot carry local approval.');
  const pack=parseScientificPack(source);
  if(seen.has(pack.id))throw Error('Duplicate scientific workspace ID.');seen.add(pack.id);
  if(lessonId!==undefined&&(typeof lessonId!=='string'||!lessonIds.has(lessonId)))throw Error('Unknown scientific workspace lesson.');
  return {...pack,...(lessonId===undefined?{}:{lessonId})};
 });
}
export function scientificCourseProblems(value:unknown,lessonIds:ReadonlySet<string>):string[]{try{parseCourseScientificWorkspaces(value,lessonIds);return [];}catch(e){return [(e as Error).message];}}
export function setCourseScientificWorkspace(course:Course,scenario:CourseScientificWorkspace):Course {
 const values=course.scientificWorkspaces??[];
 const next=values.some(x=>x.id===scenario.id)?values.map(x=>x.id===scenario.id?scenario:x):[...values,scenario];
 return {...course,scientificWorkspaces:parseCourseScientificWorkspaces(next,new Set(course.lessons.map(l=>l.id)))};
}

/** Stable IDs and explicit revisions preserve the meaning of published source labels. */
export function scientificRevisionProblems(previous:readonly CourseScientificWorkspace[],next:readonly CourseScientificWorkspace[]):string[]{
 const stable=(v:unknown):string=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
 const issues:string[]=[];
 for(const old of previous){const current=next.find(s=>s.id===old.id);
  if(!current){issues.push(`Scientific workspace ${old.id}: published identity removed`);continue;}
  if(current.lessonId!==old.lessonId)issues.push(`Scientific workspace ${old.id}: published lesson reference changed`);
  if(current.revision<old.revision || (stable(current)!==stable(old)&&current.revision<=old.revision))issues.push(`Scientific workspace ${old.id}: changed source requires a greater revision`);
 }
 return issues;
}
