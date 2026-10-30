/** Adult-owned educational follow-up ledger. UI input never supplies authority or mastery. */
import type { Course, Progress } from './types';
import { diagnoseLearning } from './learningDiagnostics';
import { parseInterventionState, appendInterventionPlan, appendInterventionEvent, validateInterventionActivities,
  type InterventionState, type InterventionActivity, type InterventionPlan, type InterventionEvent } from './interventions';

export interface InterventionPlanInput { id:string; skillId:string; goal:string; instructions:string; due?:string; activities:InterventionActivity[] }
export interface ObservationInput { id:string; planId:string; note:string; expectedEventCount:number }
export interface ReviewInput extends ObservationInput { action:'continue'|'revise'|'complete'|'cancel' }
export interface InterventionStoreIO {
  read():Promise<string|null>;
  update(change:(old:string|null)=>Promise<string>):Promise<string>;
  /** Check current adult unlock AND current learner membership when an ID is given. */
  authorize(studentId?:string):Promise<{actorId:string;actorName:string;authorityKey?:string}>;
  readProgress(studentId:string):Promise<Progress>;
  readCourses():Promise<Course[]>;
  now():string;
}
export function interventionStudentState(state:InterventionState,studentId:string):InterventionState {
  const plans=state.plans.filter(p=>p.studentId===studentId), ids=new Set(plans.map(p=>p.id));
  return {version:1,plans,events:state.events.filter(e=>ids.has(e.planId))};
}
/** Retain only an ID tombstone; remove all personal plan and observation data. */
export function deleteInterventionStudent(state:InterventionState,studentId:string):InterventionState {
  if(!/^[a-z0-9]{1,24}$/.test(studentId))throw Error('Invalid learner profile.');
  const plans=state.plans.filter(p=>p.studentId!==studentId),ids=new Set(plans.map(p=>p.id));
  return parseInterventionState({...state,plans,events:state.events.filter(e=>ids.has(e.planId)),deletedStudentIds:[...new Set([...(state.deletedStudentIds??[]),studentId])]});
}
const canonical=(v:unknown):string=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.entries(v).filter(([,value])=>value!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([key,value])=>JSON.stringify(key)+':'+canonical(value)).join(',')+'}':JSON.stringify(v);
const same=(a:unknown,b:unknown)=>canonical(a)===canonical(b);
export function createInterventionStore(io:InterventionStoreIO) {
  const check=async(studentId?:string)=>{
    if(studentId!==undefined&&!/^[a-z0-9]{1,24}$/.test(studentId))throw Error('Invalid learner profile.');
    const actor=await io.authorize(studentId);
    if(!actor.actorId||!actor.actorName)throw Error('Unlock the supervising adult area.');
    return actor;
  };
  const recheck=async(actor:{actorId:string;actorName:string;authorityKey?:string},studentId?:string)=>{
    if(!same(actor,await check(studentId)))throw Error('Adult authority changed; reopen diagnostics.');
  };
  const alive=(state:InterventionState,studentId:string)=>{
    if(state.deletedStudentIds?.includes(studentId))throw Error('This learner profile was deleted; its intervention history cannot be recreated.');
  };
  const read=async(studentId?:string)=>{
    const actor=await check(studentId),state=parseInterventionState(await io.read());
    if(studentId)alive(state,studentId);await recheck(actor,studentId);
    return studentId?interventionStudentState(state,studentId):state;
  };
  async function event(studentId:string,input:ObservationInput|ReviewInput,kind:'observation'|'review'):Promise<InterventionState> {
    const actor=await check(studentId);
    if(!Number.isSafeInteger(input.expectedEventCount)||input.expectedEventCount<0)throw Error('Invalid intervention revision.');
    const text=await io.update(async old=>{
      const state=parseInterventionState(old);alive(state,studentId);await recheck(actor,studentId);
      const plan=state.plans.find(p=>p.id===input.planId&&p.studentId===studentId);
      if(!plan)throw Error('This intervention is not assigned to the selected learner.');
      const existing=state.events.find(e=>e.id===input.id);
      const details={id:input.id,planId:input.planId,kind,note:input.note,...(kind==='review'?{action:(input as ReviewInput).action}:{}),actorId:actor.actorId,actorName:actor.actorName};
      if(existing){
        const {at:_,evidence:__,...previous}=existing;
        if(!same(previous,details))throw Error('Intervention event ID conflicts with saved history.');
        await recheck(actor,studentId);return JSON.stringify(state);
      }
      if(state.events.filter(e=>e.planId===plan.id).length!==input.expectedEventCount)throw Error('Intervention changed elsewhere. Reload before saving; your note has not been discarded.');
      const at=io.now();
      const evidence=kind==='review'?(await diagnoseLearning(await io.readCourses(),await io.readProgress(studentId),at)).skills.find(skill=>skill.skillId===plan.skillId):undefined;
      const next=appendInterventionEvent(state,{...details,at,...(evidence?{evidence}:{})} as InterventionEvent);
      await recheck(actor,studentId);return JSON.stringify(next);
    });
    await recheck(actor,studentId);
    return interventionStudentState(parseInterventionState(text),studentId);
  }
  return {
    load:(studentId:string)=>read(studentId),
    loadAll:()=>read(),
    /** One protected read session spans asynchronous evidence projection and private report data. */
    async report(studentId:string) {
      const actor=await check(studentId);
      const initial=parseInterventionState(await io.read());alive(initial,studentId);
      const courses=await io.readCourses(),progress=await io.readProgress(studentId);
      await recheck(actor,studentId);
      const diagnostics=await diagnoseLearning(courses,progress,io.now());
      const latest=parseInterventionState(await io.read());alive(latest,studentId);
      if(!same(await io.readProgress(studentId),progress))throw Error('Learning evidence changed while preparing this report. Retry the preview.');
      if(!same(await io.readCourses(),courses))throw Error('Installed sources changed while preparing this report. Retry the preview.');
      await recheck(actor,studentId);
      return {state:interventionStudentState(latest,studentId),diagnostics};
    },
    async createPlan(studentId:string,input:InterventionPlanInput):Promise<InterventionState> {
      const actor=await check(studentId);
      const text=await io.update(async old=>{
        const state=parseInterventionState(old);alive(state,studentId);await recheck(actor,studentId);
        const existing=state.plans.find(p=>p.id===input.id);
        const details={id:input.id,studentId,skillId:input.skillId,goal:input.goal,instructions:input.instructions,...(input.due?{due:input.due}:{}),activities:input.activities,actorId:actor.actorId,actorName:actor.actorName};
        if(existing){
          const {baseline:_,createdAt:__,...previous}=existing;
          if(!same(previous,details))throw Error('Intervention plan ID conflicts with saved history.');
          await recheck(actor,studentId);return JSON.stringify(state);
        }
        const courses=await io.readCourses();await validateInterventionActivities(courses,input.skillId,input.activities);
        const progress=await io.readProgress(studentId),at=io.now();
        const diagnostics=await diagnoseLearning(courses,progress,at);
        const baseline=diagnostics.skills.find(s=>s.skillId===input.skillId);
        if(!baseline)throw Error('This skill is unavailable; install and review the source course first.');
        // Cross-tab course replacement between initial read and commit must fail closed.
        await validateInterventionActivities(await io.readCourses(),input.skillId,input.activities);
        const next=appendInterventionPlan(state,{...details,baseline,createdAt:at} as InterventionPlan);
        await recheck(actor,studentId);return JSON.stringify(next);
      });
      await recheck(actor,studentId);
      return interventionStudentState(parseInterventionState(text),studentId);
    },
    observe:(studentId:string,input:ObservationInput)=>event(studentId,input,'observation'),
    review:(studentId:string,input:ReviewInput)=>event(studentId,input,'review'),
  };
}
