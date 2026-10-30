import { documentJSON } from './documentEngine';
import { parseInstructionalPack, parseInstructionalAssignment, parseInstructionalEvidence, parseInstructionalDecision, parseInstructionalLibrary, type InstructionalPack, type InstructionalAssignment, type InstructionalEvidence, type InstructionalDecision, type InstructionalLibrary, type InstructionalSource } from './instructionalEvidence';
import type { Course, Progress } from './types';

export interface InstructionalAdult {actorId:string;actorName:string;authorityKey:string}
export interface InstructionalLearnerContext {studentId:string;authorityKey:string}
export interface InstructionalEvidenceIO {
 read():Promise<string|null>;
 update(change:(previous:string|null)=>Promise<string>):Promise<string>;
 authorizeAdult(studentId?:string):Promise<InstructionalAdult>;
 learnerContext():Promise<InstructionalLearnerContext>;
 readCourses():Promise<Course[]>;
 readProgress(studentId:string):Promise<Progress>;
 readRecords(studentId:string):Promise<string|null>;
 now():string;
}
export interface InstructionalCaptureInput {id:string;assignmentId:string;assignmentRevision:number;mappingId:string;note:string;external?:{activityDate:string;description:string;completed:boolean;assessmentPercent?:number}}
export type InstructionalAssignmentInput=Omit<InstructionalAssignment,'revision'|'createdAt'>;
export type InstructionalDecisionInput=Pick<InstructionalDecision,'id'|'evidenceId'|'status'|'minutes'|'note'>&{expectedDecisionId:string|null};
const equal=(a:unknown,b:unknown)=>documentJSON(a)===documentJSON(b);
const copy=<T>(v:T):T=>JSON.parse(documentJSON(v));
const key=(v:{id:string;revision:number})=>`${v.id}@${v.revision}`;
const latest=<T extends {id:string;revision:number}>(all:T[],id:string)=>all.filter(v=>v.id===id).sort((a,b)=>b.revision-a.revision)[0];
function active(s:InstructionalLibrary,id:string){if(!/^[a-z0-9]{1,24}$/.test(id)||s.deletedStudentIds.includes(id))throw Error('This learner profile is unavailable or deleted.');}
export function deleteInstructionalStudent(input:InstructionalLibrary,id:string):InstructionalLibrary {
 const s=parseInstructionalLibrary(input);active({...s,deletedStudentIds:[]},id);
 const evidence=s.evidence.filter(e=>e.studentId!==id), ids=new Set(evidence.map(e=>e.id));
 const decisions=s.decisions.filter(d=>ids.has(d.evidenceId)), decisionIds=new Set(decisions.map(d=>d.id));
 return parseInstructionalLibrary({...s,assignments:s.assignments.filter(a=>a.studentId!==id),evidence,decisions,deletedStudentIds:[...new Set([...s.deletedStudentIds,id])],...(s.pendingDecisionIds?{pendingDecisionIds:s.pendingDecisionIds.filter(x=>decisionIds.has(x))}:{})});
}
function own(s:InstructionalLibrary,id:string):InstructionalLibrary {
 const assignments=s.assignments.filter(a=>a.studentId===id), packs=new Set(assignments.map(a=>key(a.pack))), evidence=s.evidence.filter(e=>e.studentId===id), ids=new Set(evidence.map(e=>e.id));
 const decisions=s.decisions.filter(d=>ids.has(d.evidenceId)), decisionIds=new Set(decisions.map(d=>d.id));
 return parseInstructionalLibrary({...s,...(s.packReviews?{packReviews:s.packReviews.filter(r=>packs.has(r.packKey))}:{}),assignments,packs:s.packs.filter(p=>packs.has(key(p))),evidence,decisions,deletedStudentIds:[],...(s.pendingApproval?{pendingApproval:s.pendingApproval.filter(x=>packs.has(x))}:{}),...(s.pendingDecisionIds?{pendingDecisionIds:s.pendingDecisionIds.filter(x=>decisionIds.has(x))}:{})});
}
/** Current installed content is a reviewed source, never proof of a historical attempt's question version. */
export function instructionalSources(courses:Course[]):InstructionalSource[] {
 const official=courses.filter(c=>!c.community);
 if(new Set(official.map(c=>c.id)).size!==official.length)throw Error('Installed course identities are ambiguous.');
 for(const c of official)if(new Set(c.lessons.map(l=>l.id)).size!==c.lessons.length||new Set(c.banks.map(b=>b.id)).size!==c.banks.length)throw Error('Installed lesson or bank identities are ambiguous.');
 return official.flatMap(c=>[
  ...c.lessons.map(lesson=>({kind:'lesson' as const,courseId:c.id,courseRevision:c.revision??0,itemId:lesson.id,title:`${c.title} — ${lesson.title}`,snapshot:documentJSON(lesson)})),
  ...c.banks.map(bank=>({kind:'assessment' as const,courseId:c.id,courseRevision:c.revision??0,itemId:bank.id,title:`${c.title} — ${bank.title}`,snapshot:documentJSON(bank)})),
 ]);
}
export function createInstructionalEvidenceStore(io:InstructionalEvidenceIO){
 const adult=async(id?:string)=>{const c=await io.authorizeAdult(id);if(!c.actorId.trim()||!c.actorName.trim()||!c.authorityKey.trim())throw Error('Fresh adult authorization required.');return c;};
 const learnerContext=async()=>{const c=await io.learnerContext();if(!/^[a-z0-9]{1,24}$/.test(c.studentId)||!c.authorityKey.trim())throw Error('Fresh learner context required.');return c;};
 const checkAdult=async(c:InstructionalAdult,id?:string)=>{if(!equal(c,await adult(id)))throw Error('Adult authority changed. Reload before continuing.');};
 const checkLearner=async(c:InstructionalLearnerContext)=>{if(!equal(c,await learnerContext()))throw Error('Learner profile changed. Reload before continuing.');};
 const checkSources=async(pack:InstructionalPack)=>{const sources=instructionalSources(await io.readCourses());for(const m of pack.mappings)if(m.source.kind!=='external'&&!sources.some(s=>equal(s,m.source)))throw Error('Mapped installed source changed or is unavailable. Create and review a new pack revision.');};
 async function capture(input:InstructionalCaptureInput,isAdult:boolean){
  const safe=copy(input), ac=isAdult?await adult():null, lc=isAdult?null:await learnerContext();let result!:InstructionalEvidence;let studentId:string|undefined;
  const check=async()=>ac?checkAdult(ac,studentId):checkLearner(lc!);
  await io.update(async previous=>{
   const state=parseInstructionalLibrary(previous), a=latest(state.assignments,safe.assignmentId);
   if(!a||a.revision!==safe.assignmentRevision||(!isAdult&&a.studentId!==lc!.studentId))throw Error('Assignment changed or belongs to another learner.');
   studentId=a.studentId;active(state,studentId);await check();
   if(state.pendingApproval?.includes(key(a.pack)))throw Error('Restored requirements need fresh adult review.');
   const mapping=a.pack.mappings.find(m=>m.id===safe.mappingId);if(!mapping)throw Error('Unknown mapped activity.');
   const existing=state.evidence.find(e=>e.id===safe.id);
   if(existing){if(existing.assignmentId!==a.id||existing.assignmentRevision!==a.revision||existing.mappingId!==safe.mappingId||existing.note!==safe.note||(safe.external&& !equal(JSON.parse(existing.raw).external,safe.external)))throw Error('Evidence identity already exists.');result=existing;return JSON.stringify(state);}
   await checkSources(a.pack);await check();
   const source=mapping.source, observedAt=io.now();let activityDate=observedAt.slice(0,10),completed=false,assessmentPercent:number|undefined,raw:unknown,sourceKey:string;
   if(source.kind==='external'){
    if(!safe.external)throw Error('Supply an explicit outside-activity attestation.');
    activityDate=safe.external.activityDate;completed=safe.external.completed;assessmentPercent=safe.external.assessmentPercent;raw={external:safe.external,warning:'Self-reported outside observation, not independently authenticated.'};sourceKey=`external:${source.courseId}:${source.itemId}`;
   }else{
    if(safe.external)throw Error('Installed activity evidence cannot be replaced by self-reported data.');
    const progress=await io.readProgress(studentId), recordsText=await io.readRecords(studentId);await check();
    if(!progress||!Array.isArray(progress.attempts)||!progress.lessonsDone||typeof progress.lessonsDone!=='object'||Array.isArray(progress.lessonsDone))throw Error('Existing progress is damaged; no original records were changed.');
    const records=recordsText===null?null:JSON.parse(recordsText);
    let observation:unknown;
    if(source.kind==='lesson'){
     const done=progress.lessonsDone[`${source.courseId}/${source.itemId}`];completed=!!done;if(done)activityDate=done;observation={completionDate:done??null};sourceKey=`lesson:${source.courseId}:${source.itemId}`;
    }else{
     const attempts=progress.attempts.filter(t=>t.bankId===source.itemId&&(!t.lesson||t.lesson.courseId===source.courseId)&&(!t.module||t.module.courseId===source.courseId)).sort((a,b)=>b.finishedAt.localeCompare(a.finishedAt));
     const attempt=attempts[0];if(attempt&&!attempt.lesson&&!attempt.module&&(await io.readCourses()).filter(c=>c.banks.some(b=>b.id===source.itemId)).length!==1)throw Error('Assessment bank identity is ambiguous across installed courses.');if(!attempt)throw Error('No recorded assessment attempt for this mapping.');
     if(!Number.isSafeInteger(attempt.total)||attempt.total<=0||!Number.isSafeInteger(attempt.correct)||attempt.correct<0||attempt.correct>attempt.total||!Number.isSafeInteger(attempt.answered)||attempt.answered<0||attempt.answered>attempt.total)throw Error('Assessment observation is damaged; original progress was not changed.');
     const bank=JSON.parse(source.snapshot);
     if(!Array.isArray(attempt.answers)||attempt.answers.length!==attempt.total||new Set(attempt.answers.map(a=>a.qid)).size!==attempt.answers.length||attempt.answers.some(a=>!bank.questions.some((q:{id:string})=>q.id===a.qid))||attempt.answers.filter(a=>a.correct===true).length!==attempt.correct)throw Error('Assessment question evidence is incomplete, inconsistent or outside the mapped source.');
     completed=attempt.answered===attempt.total&&attempt.answers.length===bank.questions.length&&bank.questions.every((q:{id:string})=>attempt.answers.some(a=>a.qid===q.id));assessmentPercent=attempt.correct/attempt.total*100;activityDate=attempt.finishedAt.slice(0,10);observation=attempt;sourceKey=`assessment:${source.courseId}:${source.itemId}:${attempt.id}`;
    }
    const seconds=records?.time?.[activityDate]?.[source.courseId];
    const courseActivity=seconds===undefined?null:{date:activityDate,courseId:source.courseId,observedCourseSeconds:seconds,scope:'Same-course, same-day ambient activity; not proof of work on this mapped lesson or assessment.'};
    raw={observation,courseActivity,warning:'Observed local records only. Legacy progress does not retain the historical lesson/question source version. Current mapped source is not proof of historical equivalence. Elapsed activity is not awarded credit.'};
   }
   result=parseInstructionalEvidence({id:safe.id,assignmentId:a.id,assignmentRevision:a.revision,studentId,mappingId:mapping.id,sourceKey,observedAt,activityDate,note:safe.note,provenance:source.kind==='external'?'external-attestation':'local-observation',raw:documentJSON(raw),completed,...(assessmentPercent===undefined?{}:{assessmentPercent})});
   const next=parseInstructionalLibrary({...state,evidence:[...state.evidence,result]});await checkSources(a.pack);await check();return JSON.stringify(next);
  });await check();return result;
 }
 const supervisor={
  async load(){const c=await adult(),s=parseInstructionalLibrary(await io.read());await checkAdult(c);return s;},
  async sources(){const c=await adult(),s=instructionalSources(await io.readCourses());await checkAdult(c);return s;},
  async savePack(input:InstructionalPack,expectedRevision:number|null){
   const {approval:_,...safe}=parseInstructionalPack(input),c=await adult();let result!:InstructionalPack;
   await io.update(async previous=>{const s=parseInstructionalLibrary(previous);await checkAdult(c);const current=latest(s.packs,safe.id);result=parseInstructionalPack({...safe,revision:(expectedRevision??0)+1});
    if(current&&equal(current,result))return JSON.stringify(s);if((current?.revision??null)!==expectedRevision)throw Error('Requirements changed. Reload before saving.');
    await checkSources(result);const next=parseInstructionalLibrary({...s,packs:[...s.packs,result]});await checkAdult(c);return JSON.stringify(next);});await checkAdult(c);return result;
  },
  async approvePack(id:string,revision:number){const c=await adult();let result!:InstructionalPack;
   await io.update(async previous=>{const s=parseInstructionalLibrary(previous);await checkAdult(c);const selected=s.pendingApproval?.includes(`${id}@${revision}`)?s.packs.find(p=>p.id===id&&p.revision===revision):latest(s.packs,id);if(!selected||selected.revision!==revision)throw Error('Review the exact saved requirements revision.');await checkSources(selected);
    result=parseInstructionalPack({...selected,approval:selected.approval??{at:io.now(),actor:c.actorName}});
    const packReviews=(!selected.approval||s.pendingApproval?.includes(key(selected)))?[...(s.packReviews??[]),{packKey:key(selected),at:io.now(),actor:c.actorName}]:s.packReviews;
    const next=parseInstructionalLibrary({...s,...(packReviews?{packReviews}:{}),packs:s.packs.map(p=>key(p)===key(result)?result:p),...(s.pendingApproval?{pendingApproval:s.pendingApproval.filter(k=>k!==key(result))}:{})});await checkAdult(c);return JSON.stringify(next);});await checkAdult(c);return result;
  },
  async assign(input:InstructionalAssignmentInput,expectedRevision:number|null){const safe=copy(input),c=await adult(safe.studentId);let result!:InstructionalAssignment;
   await io.update(async previous=>{const s=parseInstructionalLibrary(previous);active(s,safe.studentId);await checkAdult(c,safe.studentId);const current=latest(s.assignments,safe.id),pack=s.packs.find(p=>key(p)===key(safe.pack));if(current&&current.studentId!==safe.studentId)throw Error('An assignment cannot change learner identity.');if(!pack?.approval||s.pendingApproval?.includes(key(pack))||!equal(pack,safe.pack))throw Error('Choose exact locally reviewed requirements.');await checkSources(pack);
    result=parseInstructionalAssignment({...safe,revision:(expectedRevision??0)+1,createdAt:current?.revision===(expectedRevision??0)+1?current.createdAt:io.now()});if(current&&equal(current,result))return JSON.stringify(s);if((current?.revision??null)!==expectedRevision)throw Error('Assignment changed. Reload before saving.');const next=parseInstructionalLibrary({...s,assignments:[...s.assignments,result]});await checkAdult(c,safe.studentId);return JSON.stringify(next);});await checkAdult(c,safe.studentId);return result;
  },
  capture:(input:InstructionalCaptureInput)=>capture(input,true),
  async decide(input:InstructionalDecisionInput){const {expectedDecisionId,...safe}=copy(input),c=await adult();let result!:InstructionalDecision;let studentId:string|undefined;
   await io.update(async previous=>{const s=parseInstructionalLibrary(previous),e=s.evidence.find(e=>e.id===safe.evidenceId);if(!e)throw Error('Select immutable evidence.');studentId=e.studentId;active(s,studentId);await checkAdult(c,studentId);const a=s.assignments.find(a=>a.id===e.assignmentId&&a.revision===e.assignmentRevision);if(!a||s.pendingApproval?.includes(key(a.pack)))throw Error('Requirements need fresh local review before an educational decision.');const old=s.decisions.find(d=>d.id===safe.id);result=parseInstructionalDecision({...safe,at:old?.at??io.now(),actor:c.actorName});if(old){if(!equal(old,result))throw Error('Decision identity already exists.');return JSON.stringify(s);}const prior=s.decisions.filter(d=>d.evidenceId===safe.evidenceId).at(-1);if((prior?.id??null)!==expectedDecisionId)throw Error('Evidence review changed. Reload and inspect the latest decision before deciding.');const next=parseInstructionalLibrary({...s,decisions:[...s.decisions,result]});await checkAdult(c,studentId);return JSON.stringify(next);});await checkAdult(c,studentId);return result;
  },
 };
 const learner={async load(){const c=await learnerContext(),s=parseInstructionalLibrary(await io.read());active(s,c.studentId);await checkLearner(c);return own(s,c.studentId);},capture:(input:InstructionalCaptureInput)=>capture(input,false)};
 return {supervisor,learner};
}
