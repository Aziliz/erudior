import type { Family } from './family';
import { assertLocalAdult, assertLocalLearner, captureLocalSession } from './localSession';
import { parseClassroomWorkflowState, validateWorkflowItemInput, latestWorkflowItems,
 type ClassroomWorkflowState, type WorkflowGroup, type WorkflowItem, type WorkflowItemInput, type WorkflowSource, type WorkflowResponse, type WorkflowReview } from './classroomWorkflows';
export interface ClassroomWorkflowStoreIO {
 read():Promise<string|null>;
 update(change:(old:string|null)=>Promise<string>):Promise<string>;
 authorizeAdult():Promise<{authorityKey:string}>;
 learnerContext():Promise<{studentId:string}>;
 family():Promise<Family>;
 resolvePeerSource(classId:string,key:string):Promise<WorkflowSource & {classId:string;courseId:string}>;
 peerSourceCurrent(classId:string,source:WorkflowSource):Promise<boolean>;
 now():string;
}
export interface WorkflowResponseInput {id:string;kind:WorkflowResponse['kind'];text:string;targetId?:string}
export interface WorkflowReviewInput {id:string;note:string;status:WorkflowReview['status'];released:boolean}
const canonical=(v:unknown):string=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.entries(v).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}':JSON.stringify(v);
const same=(a:unknown,b:unknown)=>canonical(a)===canonical(b);
const error=(s:string):never=>{throw Error(s);};
const latest=(s:ClassroomWorkflowState,id:string)=>latestWorkflowItems(s).find(i=>i.id===id)??error('Classroom item no longer exists.');
const allowed=(f:Family,s:ClassroomWorkflowState,i:WorkflowItem,studentId:string)=>{
 const c=f.classes?.find(c=>c.id===i.classId);
 return !!c&&f.students.some(v=>v.id===studentId)&&c.students.includes(studentId)&&!s.deletedStudentIds.includes(studentId)&&i.memberIds.includes(studentId)
  &&(!i.courseId||c.assignments.some(a=>a.courseId===i.courseId))
  &&(!i.groupId||!!s.groups.find(g=>g.id===i.groupId&&g.classId===i.classId&&g.memberIds.includes(studentId)))
  &&(!i.source||c.students.includes(i.source.studentId)&&!s.deletedStudentIds.includes(i.source.studentId));
};
export function createClassroomWorkflowStore(io:ClassroomWorkflowStoreIO) {
 const session=captureLocalSession();
 let observedRevision:number|undefined;
 const adult=async()=>{session();assertLocalAdult();const a=await io.authorizeAdult();session();assertLocalAdult();if(!a.authorityKey)error('Teacher authority unavailable.');return a;};
 const learner=async()=>{session();const c=await io.learnerContext();session();assertLocalLearner(c.studentId);if(!/^[a-z0-9]{1,24}$/.test(c.studentId))error('Select a learner.');return c;};
 const family=async()=>{session();const f=await io.family();session();if(f.mode!=='classroom')error('Open a configured local Classroom.');return f;};
 const classCheck=(f:Family,classId:string)=>f.classes?.find(c=>c.id===classId)??error('Class was removed.');
 const recheck=async(role:'teacher'|'learner',actor:unknown,f:Family)=>{if(!same(actor,await(role==='teacher'?adult():learner()))||!same(f,await family()))error('Classroom authority or membership changed. Reopen this view.');};
 const sourceCheck=async(i:WorkflowItemInput)=>{
  if(!i.source)return;const fresh=await io.resolvePeerSource(i.classId,i.source.key);session();
  const {key,studentId,receiptId,version,text}=fresh;
  if(fresh.classId!==i.classId||fresh.courseId!==i.courseId||!same({key,studentId,receiptId,version,text},{key:i.source.key,studentId:i.source.studentId,receiptId:i.source.receiptId,version:i.source.version,text:i.source.text}))error('Peer source changed or is unavailable. Select the exact imported work again.');
 };
 const validateAudience=(f:Family,s:ClassroomWorkflowState,i:WorkflowItemInput)=>{
  const c=classCheck(f,i.classId);if(i.memberIds.some(id=>!c.students.includes(id)||!f.students.some(v=>v.id===id)||s.deletedStudentIds.includes(id)))error('Select only current class members.');
  if(i.groupId&&!s.groups.some(g=>g.id===i.groupId&&g.classId===i.classId&&i.memberIds.every(id=>g.memberIds.includes(id))))error('Audience is no longer in this group.');
  if(i.courseId&&!c.assignments.some(a=>a.courseId===i.courseId))error('Course is no longer assigned to this class.');
  if(i.kind==='peer_review'&&(i.memberIds.length!==1+i.reviewerIds!.length))error('Peer review audience must contain only the author and selected reviewers.');
 };
 async function mutate(role:'teacher'|'learner',change:(s:ClassroomWorkflowState,f:Family,studentId?:string)=>Promise<void>):Promise<void>{
  const actor=await(role==='teacher'?adult():learner()), f=await family();
  const expectedRevision=observedRevision??parseClassroomWorkflowState(await io.read()).revision;
  const saved=await io.update(async raw=>{await recheck(role,actor,f);const s=parseClassroomWorkflowState(raw);if(s.revision!==expectedRevision)error('Classroom changed elsewhere or was restored. Reload before saving; your draft remains.');await change(s,f,'studentId' in actor?actor.studentId:undefined);s.revision++;const next=parseClassroomWorkflowState(s);await recheck(role,actor,f);return JSON.stringify(next);});
  await recheck(role,actor,f);observedRevision=parseClassroomWorkflowState(saved).revision;
 }
 return {
  async teacherLoad(classId:string):Promise<ClassroomWorkflowState>{const actor=await adult(),f=await family();classCheck(f,classId);const raw=await io.read(),s=parseClassroomWorkflowState(raw);await recheck('teacher',actor,f);if(await io.read()!==raw)error('Classroom changed while loading. Reload the view.');await recheck('teacher',actor,f);observedRevision=s.revision;const items=s.items.filter(i=>i.classId===classId), ids=new Set(items.map(i=>i.id)),responses=s.responses.filter(r=>ids.has(r.itemId)),rids=new Set(responses.map(r=>r.id));return {...s,groups:s.groups.filter(g=>g.classId===classId),items,responses,reviews:s.reviews.filter(r=>rids.has(r.responseId)),deletedStudentIds:[]};},
  async learnerLoad(classId:string):Promise<ClassroomWorkflowState>{
   const actor=await learner(),f=await family(),c=classCheck(f,classId);if(!c.students.includes(actor.studentId)||!f.students.some(v=>v.id===actor.studentId))error('You are not a current class member.');
   const raw=await io.read(),s=parseClassroomWorkflowState(raw);if(s.deletedStudentIds.includes(actor.studentId))error('Learner was deleted.');
   const candidates=latestWorkflowItems(s).filter(i=>i.classId===classId&&i.published&&!i.revoked&&allowed(f,s,i,actor.studentId));
   const items:WorkflowItem[]=[];for(const i of candidates)if(!i.source||await io.peerSourceCurrent(i.classId,i.source))items.push(i);
   const responses=s.responses.filter(r=>{const i=items.find(i=>i.id===r.itemId&&i.revision===r.itemRevision);if(!i||!allowed(f,s,i,r.studentId))return false;if(r.studentId===actor.studentId)return true;const review=s.reviews.filter(v=>v.responseId===r.id).at(-1);return !!review?.released&&review.status==='reviewed'&&(i.kind==='project'||i.kind==='peer_review'&&i.source?.studentId===actor.studentId);});
   const rids=new Set(responses.map(r=>r.id));const reviews=s.reviews.filter((r,index)=>r.released&&rids.has(r.responseId)&&responses.some(response=>response.id===r.responseId&&response.studentId===actor.studentId)&&!s.reviews.slice(index+1).some(v=>v.responseId===r.responseId));
   await recheck('learner',actor,f);if(await io.read()!==raw)error('Classroom changed while loading. Reload the view.');await recheck('learner',actor,f);observedRevision=s.revision;
   return {version:1,revision:s.revision,groups:s.groups.filter(g=>g.classId===classId&&g.memberIds.includes(actor.studentId)).map(g=>({...g,memberIds:[actor.studentId]})),items:items.map(i=>{const {privateNote:_,...safe}=i;return {...safe,memberIds:i.memberIds.filter(id=>id===actor.studentId||id===i.source?.studentId),...(i.reviewerIds?{reviewerIds:i.reviewerIds.filter(id=>id===actor.studentId)}:{})};}),responses,reviews,deletedStudentIds:[]};
  },
  async saveGroup(input:Omit<WorkflowGroup,'revision'>,expectedRevision:number):Promise<void>{await mutate('teacher',async(s,f)=>{const c=classCheck(f,input.classId),old=s.groups.find(g=>g.id===input.id);if((old?.revision??0)!==expectedRevision)error('Group changed. Reload before saving.');if(old&&old.classId!==input.classId)error('Cannot move a group to another class.');if(input.memberIds.some(id=>!c.students.includes(id)||!f.students.some(v=>v.id===id)||s.deletedStudentIds.includes(id)))error('Select current class members.');const group={...input,revision:expectedRevision+1};s.groups=s.groups.filter(g=>g.id!==input.id).concat(group);s.items=s.items.map(i=>i.groupId===input.id?{...i,published:false}:i);});},
  async saveItem(input:WorkflowItemInput,expectedRevision:number):Promise<void>{validateWorkflowItemInput(input);await mutate('teacher',async(s,f)=>{const old=latestWorkflowItems(s).find(i=>i.id===input.id);if((old?.revision??0)!==expectedRevision)error('Item changed. Reload before saving; your draft remains.');if(old&&(old.classId!==input.classId||old.kind!==input.kind))error('Cannot change item class or kind.');validateAudience(f,s,input);await sourceCheck(input);s.items=s.items.map(i=>i.id===input.id?{...i,published:false}:i);s.items.push({...structuredClone(input),revision:expectedRevision+1,published:false,revoked:false,createdAt:io.now()});});},
  async setPublication(itemId:string,revision:number,mode:'publish'|'withdraw'|'revoke'):Promise<void>{if(!['publish','withdraw','revoke'].includes(mode))error('Unknown publication action.');await mutate('teacher',async(s,f)=>{const i=latest(s,itemId);if(i.revision!==revision)error('Item changed. Reload before publishing.');if(mode==='publish'){validateAudience(f,s,i);await sourceCheck(i);if(i.revoked)error('Create a new revision before sharing revoked work.');}i.published=mode==='publish';i.revoked=mode==='revoke'||i.revoked;});},
  async respond(itemId:string,revision:number,input:WorkflowResponseInput):Promise<void>{await mutate('learner',async(s,f,studentId)=>{if(!studentId)throw Error('Select a learner.');const i=latest(s,itemId);if(i.revision!==revision||!i.published||i.revoked||!allowed(f,s,i,studentId))error('This assignment is no longer available to this learner.');
    if(i.source&&!await io.peerSourceCurrent(i.classId,i.source))error('Peer source is no longer available. Ask the teacher to review the assignment.');
    const expected={peer_review:'feedback',project:'submission',conference:'action',notice:'acknowledgment',field_trip:'reflection'}[i.kind];if(input.kind!==expected)error('Response does not match this activity.');
    if(i.kind==='peer_review'&&!i.reviewerIds!.includes(studentId))error('Only the assigned reviewer can submit feedback.');
    if(i.kind==='project'&&!i.milestones?.some(t=>t.id===input.targetId)||i.kind==='conference'&&!i.actions?.some(t=>t.id===input.targetId))error('Select a current milestone or action.');
    if(!['project','conference'].includes(i.kind)&&input.targetId!==undefined)error('Unexpected response target.');
    if(input.kind!=='acknowledgment'&&!input.text.trim())error('Enter a response before saving.');
    const existing=s.responses.find(r=>r.id===input.id);const body={...input,itemId,itemRevision:revision,studentId};if(existing){const {createdAt:_,...old}=existing;if(!same(old,body))error('Response identity conflicts with saved work.');return;}
    if(['acknowledgment','action'].includes(input.kind)&&s.responses.some(r=>r.itemId===itemId&&r.itemRevision===revision&&r.studentId===studentId&&r.kind===input.kind&&r.targetId===input.targetId))return;
    s.responses.push({...body,createdAt:io.now()});
   });},
  async review(responseId:string,input:WorkflowReviewInput,expectedReviewCount:number):Promise<void>{await mutate('teacher',async(s,f)=>{const r=s.responses.find(r=>r.id===responseId)??error('Response no longer exists.'),i=latest(s,r.itemId);validateAudience(f,s,i);if(r.itemRevision!==i.revision||i.revoked)error('Review the current revision, not superseded work.');const existing=s.reviews.find(r=>r.id===input.id),body={...input,responseId};if(existing){const {createdAt:_,...old}=existing;if(!same(body,old))error('Review identity conflicts.');return;}if(s.reviews.filter(r=>r.responseId===responseId).length!==expectedReviewCount)error('Review changed. Reload before saving.');s.reviews.push({...body,createdAt:io.now()});});},
 };
}
export type ClassroomWorkflowStore=ReturnType<typeof createClassroomWorkflowStore>;
