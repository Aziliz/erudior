import { bindLocalSessionAuthority } from './localSession';
import type {Course,Progress} from './types';
import {parseInterventionState,interventionStatus,type InterventionActivity} from './interventions';
import {parseInterventionTask,parseInterventionTasks,taskFromPlan,addInterventionTask,sameInterventionTask,validateTaskActivity,type InterventionTask} from './interventionTasks';
import {FOUNDATION_COMPETENCIES} from './competencyCatalog';
import {resolveCompetencyEvidence} from './competencyEvidence';
import {captureCompetencyEvidence,syncCompetencyLedger} from './competencyState';
import {competencyPath} from './competencyPath';
export interface TaskContext {profileId:string|null;scope:string}
export interface InterventionTaskIO {
  context():Promise<TaskContext>;
  readInterventions():Promise<string|null>;
  readProgress(id:string|null):Promise<Progress>;
  updateProgress(id:string|null,change:(p:Progress)=>Promise<Progress>):Promise<Progress>;
  readCourses():Promise<Course[]>;
  allowed(courseId:string,context:TaskContext,progress:Progress,courses:Course[]):Promise<string|null>;
}
export function createInterventionTaskAccess(io:InterventionTaskIO){
  io = bindLocalSessionAuthority(io);
  const check=async(expected:TaskContext)=>{const next=await io.context();if(next.profileId!==expected.profileId||next.scope!==expected.scope)throw Error('Learner or permissions changed. Reopen the support task.');};
  const load=async(expected?:TaskContext):Promise<InterventionTask[]>=>{
    const context=expected??await io.context();await check(context);
    const p=await io.readProgress(context.profileId),state=parseInterventionState(await io.readInterventions());
    if(context.profileId&&state.deletedStudentIds?.includes(context.profileId))throw Error('This learner profile was deleted.');
    const local=state.plans.filter(plan=>plan.studentId===context.profileId&&interventionStatus(state,plan.id)==='active').map(taskFromPlan);
    const ids=new Set(state.plans.filter(plan=>plan.studentId===context.profileId).map(t=>t.id));
    const tasks=[...local,...parseInterventionTasks(p.interventionTasks).filter(t=>!ids.has(t.id))];
    await check(context);return tasks;
  };
  return {
    context:io.context,load,
    async install(raw:unknown,context:TaskContext):Promise<void>{
      const task=parseInterventionTask(raw);await check(context);
      const courses=await io.readCourses();await validateTaskActivity(courses,task,task.activities[0]);await check(context);
      await io.updateProgress(context.profileId,async current=>{await check(context);return {...current,interventionTasks:addInterventionTask(current.interventionTasks,task)};});
      await check(context);
    },
    async prepare(task:InterventionTask,activity:InterventionActivity){
      const context=await io.context(),tasks=await load(context),saved=tasks.find(t=>t.id===task.id);
      if(!saved||!sameInterventionTask(saved,parseInterventionTask(task)))throw Error('The support task changed or is no longer active. Reload it.');
      const courses=await io.readCourses();await validateTaskActivity(courses,saved,activity);
      const progress=await io.readProgress(context.profileId);
      const blocked=await io.allowed(activity.courseId,context,progress,courses);if(blocked)throw Error(blocked);
      const graph=resolveCompetencyEvidence(FOUNDATION_COMPETENCIES,courses,{allowMissingCourses:true});
      const fresh=syncCompetencyLedger(progress,await captureCompetencyEvidence(graph,courses,progress));
      const skill=competencyPath(courses,fresh,100).states.find(s=>s.id===saved.skillId);
      if(!skill||!skill.ready)throw Error('Prerequisite skills need review before this activity. Ask the supervising adult to review the learning path.');
      const verifiedCourses=await io.readCourses();
      await validateTaskActivity(verifiedCourses,saved,activity);
      const latest=await load(context);
      if(!latest.some(t=>sameInterventionTask(t,saved)))throw Error("This task was withdrawn or changed during launch. Reload it.");
      const latestProgress=await io.readProgress(context.profileId);
      const latestBlock=await io.allowed(activity.courseId,context,latestProgress,verifiedCourses);if(latestBlock)throw Error(latestBlock);
      const latestGraph=resolveCompetencyEvidence(FOUNDATION_COMPETENCIES,verifiedCourses,{allowMissingCourses:true});
      const latestFresh=syncCompetencyLedger(latestProgress,await captureCompetencyEvidence(latestGraph,verifiedCourses,latestProgress));
      const latestSkill=competencyPath(verifiedCourses,latestFresh,100).states.find(s=>s.id===saved.skillId);
      if(!latestSkill?.ready)throw Error('Prerequisite skills changed. Ask the supervising adult to review the learning path.');
      if(JSON.stringify(await io.readProgress(context.profileId))!==JSON.stringify(latestProgress))throw Error('Learning evidence changed during launch. Retry the activity.');
      await check(context);
      return {task:saved,activity,courses:verifiedCourses,progress:latestProgress,mastery:latestSkill.mastery,context};
    },
  };
}
