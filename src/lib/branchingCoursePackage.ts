import { parseBranchingPack, type BranchingPack } from './branchingEngine';
import type { Course } from './courseContentTypes';
export type CourseBranchingScenario = BranchingPack & { lessonId?: string };
/** Portable sources never carry local review authority. */
export function parseCourseBranchingScenarios(value: unknown, lessonIds: ReadonlySet<string>): CourseBranchingScenario[] {
 if(value===undefined)return [];
 if(!Array.isArray(value)||value.length>30)throw Error('At most 30 branching scenarios are supported.');
 const seen=new Set<string>();
 return value.map(item=>{
  if(!item||typeof item!=='object'||Array.isArray(item))throw Error('Invalid branching scenario.');
  const {lessonId,...source}=item;
  if('approval' in source)throw Error('Portable branching sources cannot carry local approval.');
  const pack=parseBranchingPack(source);
  if(seen.has(pack.id))throw Error('Duplicate branching scenario ID.');seen.add(pack.id);
  if(lessonId!==undefined&&(typeof lessonId!=='string'||!lessonIds.has(lessonId)))throw Error('Unknown branching scenario lesson.');
  return {...pack,...(lessonId===undefined?{}:{lessonId})};
 });
}
export function branchingCourseProblems(value:unknown,lessonIds:ReadonlySet<string>):string[]{try{parseCourseBranchingScenarios(value,lessonIds);return [];}catch(e){return [(e as Error).message];}}
export function setCourseBranchingScenario(course:Course,scenario:CourseBranchingScenario):Course {
 const values=course.branchingScenarios??[];
 const next=values.some(x=>x.id===scenario.id)?values.map(x=>x.id===scenario.id?scenario:x):[...values,scenario];
 return {...course,branchingScenarios:parseCourseBranchingScenarios(next,new Set(course.lessons.map(l=>l.id)))};
}

/** Stable IDs and explicit revisions preserve the meaning of published source labels. */
export function branchingRevisionProblems(previous:readonly CourseBranchingScenario[],next:readonly CourseBranchingScenario[]):string[]{
 const stable=(v:unknown):string=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
 const issues:string[]=[];
 for(const old of previous){const current=next.find(s=>s.id===old.id);
  if(!current){issues.push(`Branching scenario ${old.id}: published identity removed`);continue;}
  if(current.lessonId!==old.lessonId)issues.push(`Branching scenario ${old.id}: published lesson reference changed`);
  if(current.revision<old.revision || (stable(current)!==stable(old)&&current.revision<=old.revision))issues.push(`Branching scenario ${old.id}: changed source requires a greater revision`);
 }
 return issues;
}
