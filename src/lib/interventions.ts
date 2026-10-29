/** Immutable human-supervised intervention plans; no score, grade or clinical authority. */
import type {Course} from './types';
import {FOUNDATION_COMPETENCIES, type AuthoredCompetency} from './competencyCatalog';
import {resolveCompetencyEvidence} from './competencyEvidence';
import type {SkillDiagnostic} from './learningDiagnostics';
export interface InterventionActivity {kind:'lesson'|'practice';courseId:string;title:string;sourceFingerprint:string;lessonId?:string;bankId?:string;questionIds?:string[]}
export interface InterventionPlan {id:string;studentId:string;skillId:string;goal:string;instructions:string;due?:string;activities:InterventionActivity[];baseline:SkillDiagnostic;actorId:string;actorName:string;createdAt:string}
export interface InterventionEvent {id:string;planId:string;kind:'observation'|'review';action?:'continue'|'revise'|'complete'|'cancel';note:string;actorId:string;actorName:string;at:string;evidence?:SkillDiagnostic}
export interface InterventionState {version:1;plans:InterventionPlan[];events:InterventionEvent[];deletedStudentIds?:string[]}
export const INTERVENTION_LIMITS={plans:2000,events:20000,bytes:16*1024*1024};
const object=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v)&&[Object.prototype,null].includes(Object.getPrototypeOf(v));
const text=(v:unknown,max=200)=>typeof v==='string'&&!!v.trim()&&v.length<=max&&!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v);
const id=(v:unknown)=>text(v)&&!['__proto__','constructor','prototype'].includes(String(v));
const date=(v:unknown)=>typeof v==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v.replace(/Z$/,v.includes('.')?'Z':'.000Z');
const hash=(v:unknown)=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const keys=(v:Record<string,any>,allowed:string[])=>Object.keys(v).every(k=>allowed.includes(k));
function fail():never {throw Error('Invalid or oversized intervention history.');}
function canonical(v:any):string {return Array.isArray(v)?'['+v.map(canonical).join(',')+']':object(v)?'{'+Object.entries(v).filter(([,x])=>x!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>JSON.stringify(k)+':'+canonical(x)).join(',')+'}':JSON.stringify(v);}
async function fingerprint(v:unknown){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(v))))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function emptyInterventionState():InterventionState{return {version:1,plans:[],events:[]};}
export function validateDiagnostic(value:unknown):asserts value is SkillDiagnostic {
  if(!object(value)||!keys(value,['skillId','title','mastery','confidence','answers','status','reason','blockedBy','sources','patterns','measuredAt'])||!id(value.skillId)||!text(value.title,2000)||!text(value.reason,2000)||!date(value.measuredAt)||!['unknown','insufficient','needs-review','established'].includes(value.status)||!(value.mastery===null||Number.isFinite(value.mastery)&&value.mastery>=0&&value.mastery<=1)||!Number.isFinite(value.confidence)||value.confidence<0||value.confidence>1||!Number.isSafeInteger(value.answers)||value.answers<0||!Array.isArray(value.blockedBy)||value.blockedBy.length>500||!value.blockedBy.every(id)||!Array.isArray(value.sources)||value.sources.length>10000||!Array.isArray(value.patterns)||value.patterns.length>10000)fail();
  for(const s of value.sources){if(!object(s)||!keys(s,['skillId','courseId','bankId','questionId','fingerprint','revision','since','baselineSeen','baselineCorrect','snapshotId','n','mastery','confidence','at','latestAttemptAt'])||s.skillId!==value.skillId||![s.courseId,s.bankId,s.questionId].every(id)||!hash(s.fingerprint)||!Number.isSafeInteger(s.revision)||s.revision<0||!Number.isSafeInteger(s.n)||s.n<0||!(s.mastery===null||Number.isFinite(s.mastery)&&s.mastery>=0&&s.mastery<=1)||!Number.isFinite(s.confidence)||s.confidence<0||s.confidence>1||(s.snapshotId!==undefined&&!hash(s.snapshotId))||(s.at!==undefined&&!date(s.at))||(s.latestAttemptAt!==undefined&&!date(s.latestAttemptAt))||(s.since!==undefined&&(!date(s.since)||!Number.isSafeInteger(s.baselineSeen)||s.baselineSeen<0||!Number.isSafeInteger(s.baselineCorrect)||s.baselineCorrect<0||s.baselineCorrect>s.baselineSeen)))fail();}
  if(new Set(value.sources.map((s:any)=>JSON.stringify([s.courseId,s.bankId,s.questionId]))).size!==value.sources.length)fail();
  for(const p of value.patterns)if(!object(p)||!keys(p,['courseId','bankId','questionId','questionTitle','incorrect','answered','reason'])||![p.courseId,p.bankId,p.questionId].every(id)||!text(p.questionTitle,500)||!text(p.reason,2000)||!Number.isSafeInteger(p.answered)||p.answered<1||p.answered>30||!Number.isSafeInteger(p.incorrect)||p.incorrect<1||p.incorrect>p.answered)fail();
}
export function validateInterventionActivity(a:unknown):asserts a is InterventionActivity{
  if(!object(a)||!keys(a,['kind','courseId','title','sourceFingerprint','lessonId','bankId','questionIds'])||!id(a.courseId)||!text(a.title,2000)||!hash(a.sourceFingerprint))fail();
  if(a.kind==='lesson'){if(!id(a.lessonId)||a.bankId!==undefined||a.questionIds!==undefined)fail();}
  else if(a.kind==='practice'){if(a.lessonId!==undefined||!id(a.bankId)||!Array.isArray(a.questionIds)||!a.questionIds.length||a.questionIds.length>1000||!a.questionIds.every(id)||new Set(a.questionIds).size!==a.questionIds.length)fail();}else fail();
}
export function parseInterventionState(raw:unknown):InterventionState{
  if(raw===null||raw===undefined)return emptyInterventionState();
  if(typeof raw==='string'){if(raw.length>INTERVENTION_LIMITS.bytes)fail();try{raw=JSON.parse(raw);}catch{fail();}}
  try{if(new TextEncoder().encode(JSON.stringify(raw)).length>INTERVENTION_LIMITS.bytes)fail();}catch{fail();}
  if(!object(raw)||!keys(raw,['version','plans','events','deletedStudentIds'])||raw.version!==1||!Array.isArray(raw.plans)||raw.plans.length>INTERVENTION_LIMITS.plans||!Array.isArray(raw.events)||raw.events.length>INTERVENTION_LIMITS.events)fail();
  if(raw.deletedStudentIds!==undefined&&(!Array.isArray(raw.deletedStudentIds)||raw.deletedStudentIds.length>10000||!raw.deletedStudentIds.every((v:unknown)=>typeof v==='string'&&/^[a-z0-9]{1,24}$/.test(v))||new Set(raw.deletedStudentIds).size!==raw.deletedStudentIds.length))fail();
  for(const p of raw.plans){if(raw.deletedStudentIds?.includes(p?.studentId))fail();if(!object(p)||!keys(p,['id','studentId','skillId','goal','instructions','due','activities','baseline','actorId','actorName','createdAt'])||![p.id,p.studentId,p.skillId,p.actorId].every(id)||!text(p.actorName,200)||!text(p.goal,2000)||!text(p.instructions,10000)||!date(p.createdAt)||!Array.isArray(p.activities)||!p.activities.length||p.activities.length>20||(p.due!==undefined&&(typeof p.due!=='string'||!/^\d{4}-\d\d-\d\d$/.test(p.due)||!Number.isFinite(Date.parse(p.due))||new Date(p.due).toISOString().slice(0,10)!==p.due)))fail();validateDiagnostic(p.baseline);if(p.baseline.skillId!==p.skillId)fail();p.activities.forEach(validateInterventionActivity);if(new Set(p.activities.map(canonical)).size!==p.activities.length)fail();}
  if(new Set(raw.plans.map((p:any)=>p.id)).size!==raw.plans.length||new Set(raw.events.map((e:any)=>e.id)).size!==raw.events.length)fail();
  const plans=new Map(raw.plans.map((p:any)=>[p.id,p]));const closed=new Set<string>();const lastAt=new Map<string,number>();
  for(const e of raw.events){const p=plans.get(e?.planId) as InterventionPlan|undefined;if(!object(e)||!keys(e,['id','planId','kind','action','note','actorId','actorName','at','evidence'])||![e.id,e.planId,e.actorId].every(id)||!text(e.actorName,200)||!text(e.note,10000)||!date(e.at)||!p||Date.parse(e.at)<Date.parse(p.createdAt)||closed.has(e.planId)||(lastAt.has(e.planId)&&Date.parse(e.at)<lastAt.get(e.planId)!))fail();lastAt.set(e.planId,Date.parse(e.at));if(e.kind==='review'){if(e.evidence!==undefined){validateDiagnostic(e.evidence);if(e.evidence.skillId!==p.skillId)fail();}if(!['continue','revise','complete','cancel'].includes(e.action))fail();if(e.action==='complete'||e.action==='cancel')closed.add(e.planId);}else if(e.kind!=='observation'||e.action!==undefined||e.evidence!==undefined)fail();}
  return structuredClone(raw) as InterventionState;
}
export function appendInterventionPlan(state:InterventionState,plan:InterventionPlan):InterventionState{
  const current=parseInterventionState(state),old=current.plans.find(p=>p.id===plan.id);if(old){if(canonical(old)!==canonical(plan))throw Error('Intervention plan ID conflicts with saved history.');return current;}return parseInterventionState({...current,plans:[...current.plans,plan]});
}
export function appendInterventionEvent(state:InterventionState,event:InterventionEvent):InterventionState{
  const current=parseInterventionState(state),old=current.events.find(e=>e.id===event.id);if(old){if(canonical(old)!==canonical(event))throw Error('Intervention event ID conflicts with saved history.');return current;}return parseInterventionState({...current,events:[...current.events,event]});
}
export function interventionStatus(state:InterventionState,planId:string):'active'|'revise'|'complete'|'cancel'{const event=[...state.events].reverse().find(e=>e.planId===planId&&e.kind==='review');return event?.action==='complete'||event?.action==='cancel'||event?.action==='revise'?event.action:'active';}
/** Exact installed sources only. Full semantic content is fingerprinted, not just an ID/revision. */
export async function interventionActivities(courses:Course[],skillId:string,authored:AuthoredCompetency[]=FOUNDATION_COMPETENCIES):Promise<InterventionActivity[]>{
  const definition=authored.find(s=>s.id===skillId);if(!definition)throw Error('Unknown intervention skill.');
  const graph=resolveCompetencyEvidence(authored,courses,{allowMissingCourses:true}),skill=graph.find(s=>s.id===skillId)!;const result:InterventionActivity[]=[];
  for(const course of courses){for(const lesson of course.lessons.filter(l=>(definition.lessons[course.id]??[]).includes(l.id)))result.push({kind:'lesson',courseId:course.id,lessonId:lesson.id,title:lesson.title,sourceFingerprint:await fingerprint({courseId:course.id,revision:course.revision??0,lesson})});
    for(const assessment of skill.assessments?.filter(a=>a.courseId===course.id)??[]){const bank=course.banks.find(b=>b.id===assessment.bankId)!;const questionIds=[...assessment.questionIds].sort();result.push({kind:'practice',courseId:course.id,bankId:bank.id,questionIds,title:`Focused practice: ${definition.title}`,sourceFingerprint:await fingerprint({courseId:course.id,revision:course.revision??0,bankId:bank.id,questions:bank.questions.filter(q=>questionIds.includes(q.id))})});}}
  return result;
}
export async function validateInterventionActivities(courses:Course[],skillId:string,activities:InterventionActivity[],authored:AuthoredCompetency[]=FOUNDATION_COMPETENCIES):Promise<void>{
  if(!activities.length||activities.length>20)throw Error('Choose between one and twenty linked activities.');
  const available=await interventionActivities(courses,skillId,authored),seen=new Set<string>();
  for(const activity of activities){validateInterventionActivity(activity);const key=canonical(activity);if(seen.has(key)||!available.some(a=>canonical(a)===key))throw Error('An intervention activity is unavailable or its source changed. Review the plan against the installed content.');seen.add(key);}
}
export interface InterventionComparison {comparable:boolean;newEvidence:boolean;baseline:number|null;current:number|null;delta:number|null;reason:string}
export function compareIntervention(plan:InterventionPlan,current:SkillDiagnostic|undefined):InterventionComparison{
  const base=plan.baseline;const no=(reason:string):InterventionComparison=>({comparable:false,newEvidence:false,baseline:base.mastery,current:current?.mastery??null,delta:null,reason});
  if(!current||current.skillId!==plan.skillId)return no('Current evidence for this skill is unavailable.');
  const lineage=(s:SkillDiagnostic['sources'][number])=>canonical([s.courseId,s.bankId,s.questionId,s.fingerprint,s.since??null,s.baselineSeen??null,s.baselineCorrect??null]);
  const before=new Map(base.sources.map(s=>[lineage(s),s]));
  if(!before.size||before.size!==current.sources.length||current.sources.some(s=>!before.has(lineage(s))))return no('Source identity or baseline changed; old and new mastery estimates are not comparable.');
  if(current.sources.some(s=>s.n<(before.get(lineage(s))?.n??0)))return no('Assessment evidence was removed or reset; reassess before comparing outcomes.');
  const newEvidence=current.sources.some(s=>s.snapshotId!==before.get(lineage(s))?.snapshotId&&s.latestAttemptAt!==undefined&&Date.parse(s.latestAttemptAt)>Date.parse(plan.createdAt)&&s.n>0);
  if(!newEvidence)return no('No new linked assessment evidence after this plan; observations alone do not change mastery.');
  if(base.mastery===null||current.mastery===null)return {...no('New evidence is available, but no comparable pre-plan mastery estimate exists.'),newEvidence:true};
  return {comparable:true,newEvidence:true,baseline:base.mastery,current:current.mastery,delta:current.mastery-base.mastery,reason:'Descriptive change in the same linked evidence lineage; not proof that the intervention caused improvement.'};
}
export function interventionReport(state:InterventionState,studentId:string,studentName:string,current:SkillDiagnostic[]=[]):string {
  const safe=parseInterventionState(state),plans=safe.plans.filter(p=>p.studentId===studentId);
  if(current.length>500||new Set(current.map(s=>s.skillId)).size!==current.length)throw Error('Invalid learner diagnostic summary.');
  current.forEach(validateDiagnostic);
  const evidence=current.flatMap(skill=>[
    `\n${skill.title} (${skill.skillId}): ${skill.status}. ${skill.reason}`,
    `Checked ${skill.measuredAt}. ${skill.answers} linked answers; estimated mastery ${skill.mastery===null?'unknown':Math.round(skill.mastery*100)+'%'}; confidence ${Math.round(skill.confidence*100)}%.`,
    ...(skill.blockedBy.length?[`Prerequisite support: ${skill.blockedBy.join(', ')}. Adult placement and assessment evidence remain separate.`]:[]),
    ...skill.patterns.map(p=>`Observed pattern to discuss: ${p.questionTitle} — ${p.incorrect} incorrect of ${p.answered} responses. ${p.reason}`),
    ...skill.sources.map(source=>`Source: ${source.courseId} / ${source.bankId} / ${source.questionId}; revision ${source.revision}; fingerprint ${source.fingerprint}; identity baseline ${source.since??'unavailable'}; ${source.n} assessed answers${source.latestAttemptAt?`; latest linked attempt ${source.latestAttemptAt}`:''}.`),
  ]);
  return [
    `Learning support report — ${studentName}`,
    'Private educational guidance only. Not a clinical diagnosis, grade or credential. Share only with the intended learner/guardian.',
    '\nCurrent educational evidence',
    ...(evidence.length?evidence:['No current linked skill evidence is available. Absence of evidence is not a demonstrated misconception.']),
    '\nHuman-supervised support plans',
    ...(!plans.length?['No targeted support plans have been assigned. Review the evidence with the learner before choosing support.']:[]),
    ...plans.flatMap(p=>[
      `\n${p.baseline.title}: ${p.goal}`,
      `Status: ${interventionStatus(safe,p.id)}. Assigned by ${p.actorName} on ${p.createdAt}${p.due?`; due ${p.due}`:''}.`,
      `Instructions: ${p.instructions}`,
      `Activities: ${p.activities.map(a=>a.title).join('; ')}`,
      `Evidence at assignment: ${p.baseline.reason} ${p.baseline.answers} answers; mastery ${p.baseline.mastery===null?'unknown':Math.round(p.baseline.mastery*100)+'%'}.`,
      comparisonText(compareIntervention(p,current.find(s=>s.skillId===p.skillId))),
      ...safe.events.filter(e=>e.planId===p.id).map(e=>`${e.at} — ${e.actorName}: ${e.kind}${e.action?' / '+e.action:''}. ${e.note}${e.evidence?' '+comparisonText(compareIntervention(p,e.evidence)):''}`),
    ]),
  ].join('\n');
}

export function parseInterventionActivity(raw:unknown):InterventionActivity {validateInterventionActivity(raw);return structuredClone(raw);}

function comparisonText(c:InterventionComparison):string{return c.comparable?`Mastery estimate ${Math.round(c.baseline!*100)}% → ${Math.round(c.current!*100)}% (${c.delta!>=0?'+':''}${Math.round(c.delta!*100)} points). ${c.reason}`:c.reason;}
