/** Data-only learner handoff. It never carries adult review authority or mastery. */
import { validateInterventionActivity, validateInterventionActivities, type InterventionActivity, type InterventionPlan } from './interventions';
import type { Course } from './types';
export interface InterventionTask {
  format:'erudior-intervention-task'; version:1; id:string; skillId:string;
  goal:string; instructions:string; due?:string; activities:InterventionActivity[]; issuedAt:string;
}
const fail=():never=>{throw Error('Invalid or oversized learner support task.');};
const text=(v:unknown,max:number)=>typeof v==='string'&&!!v.trim()&&v.length<=max&&!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v);
const id=(v:unknown)=>text(v,200)&&!['__proto__','constructor','prototype'].includes(String(v));
export function parseInterventionTask(raw:unknown):InterventionTask {
  if(typeof raw==='string'){if(raw.length>256000)fail();try{raw=JSON.parse(raw);}catch{fail();}}
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||![Object.prototype,null].includes(Object.getPrototypeOf(raw)))fail();
  const t=raw as Record<string,unknown>;
  if(Object.keys(t).some(k=>!['format','version','id','skillId','goal','instructions','due','activities','issuedAt'].includes(k))||t.format!=='erudior-intervention-task'||t.version!==1||!id(t.id)||!id(t.skillId)||!text(t.goal,2000)||!text(t.instructions,10000)||typeof t.issuedAt!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(t.issuedAt)||!Number.isFinite(Date.parse(t.issuedAt))||!Array.isArray(t.activities)||!t.activities.length||t.activities.length>20)fail();
  if(t.due!==undefined&&(typeof t.due!=='string'||!/^\d{4}-\d\d-\d\d$/.test(t.due)||!Number.isFinite(Date.parse(t.due))||new Date(t.due).toISOString().slice(0,10)!==t.due))fail();
  for(const a of t.activities as unknown[])validateInterventionActivity(a);
  if(new TextEncoder().encode(JSON.stringify(t)).length>256000)fail();
  return structuredClone(t) as unknown as InterventionTask;
}
export function parseInterventionTasks(raw:unknown):InterventionTask[]{
  if(raw===undefined)return [];
  if(!Array.isArray(raw)||raw.length>200)fail();
  const tasks=(raw as unknown[]).map(parseInterventionTask);
  if(new Set(tasks.map(t=>t.id)).size!==tasks.length)fail();
  if(new TextEncoder().encode(JSON.stringify(tasks)).length>2*1024*1024)fail();
  return tasks;
}
export function taskFromPlan(plan:InterventionPlan):InterventionTask {
  return parseInterventionTask({format:'erudior-intervention-task',version:1,id:plan.id,skillId:plan.skillId,goal:plan.goal,instructions:plan.instructions,...(plan.due?{due:plan.due}:{}),activities:plan.activities,issuedAt:plan.createdAt});
}
const canonical=(v:unknown):string=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>JSON.stringify(k)+':'+canonical(x)).join(',')+'}':JSON.stringify(v);
export function sameInterventionTask(a:InterventionTask,b:InterventionTask):boolean{return canonical(a)===canonical(b);}
export function addInterventionTask(raw:unknown,task:InterventionTask):InterventionTask[]{
  const tasks=parseInterventionTasks(raw),next=parseInterventionTask(task),old=tasks.find(t=>t.id===next.id);
  if(old){if(!sameInterventionTask(old,next))throw Error('This task ID already has different instructions. Ask the supervising adult for a new task.');return tasks;}
  return parseInterventionTasks([...tasks,next]);
}
export async function validateTaskActivity(courses:Course[],task:InterventionTask,activity:InterventionActivity):Promise<void>{
  const valid=parseInterventionTask(task);validateInterventionActivity(activity);
  if(!valid.activities.some(a=>canonical(a)===canonical(activity)))throw Error('This activity is not part of the selected support task.');
  await validateInterventionActivities(courses,valid.skillId,valid.activities);
}
