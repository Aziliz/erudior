/** Local classroom collaboration. Data only: never academic credit or remote delivery authority. */
export type WorkflowKind = 'peer_review'|'project'|'conference'|'notice'|'field_trip';
export interface WorkflowGroup { id:string; classId:string; name:string; memberIds:string[]; revision:number }
export interface WorkflowTarget { id:string; title:string }
export interface WorkflowSource { key:string; studentId:string; receiptId:string; version:string; text:string }
export interface WorkflowItemInput {
  id:string; classId:string; kind:WorkflowKind; title:string; instructions:string; memberIds:string[];
  groupId?:string; courseId?:string; due?:string; milestones?:WorkflowTarget[];
  source?:WorkflowSource; reviewerIds?:string[]; scheduledAt?:string; privateNote?:string;
  actions?:WorkflowTarget[]; location?:string;
}
export interface WorkflowItem extends WorkflowItemInput { revision:number; published:boolean; revoked:boolean; createdAt:string }
export type WorkflowResponseKind = 'feedback'|'submission'|'acknowledgment'|'action'|'reflection';
export interface WorkflowResponse { id:string; itemId:string; itemRevision:number; studentId:string; kind:WorkflowResponseKind; text:string; targetId?:string; createdAt:string }
export interface WorkflowReview { id:string; responseId:string; status:'reviewed'|'needs_revision'; note:string; released:boolean; createdAt:string }
export interface ClassroomWorkflowState { version:1; revision:number; groups:WorkflowGroup[]; items:WorkflowItem[]; responses:WorkflowResponse[]; reviews:WorkflowReview[]; deletedStudentIds:string[] }
export const emptyClassroomWorkflowState=():ClassroomWorkflowState=>({version:1,revision:0,groups:[],items:[],responses:[],reviews:[],deletedStudentIds:[]});
const fail=(s:string):never=>{throw Error(`Invalid classroom workflows: ${s}.`);};
const obj=(v:unknown,allowed:string[],at:string):Record<string,any>=>{if(!v||typeof v!=='object'||Array.isArray(v)||![Object.prototype,null].includes(Object.getPrototypeOf(v)))fail(at);const x=v as Record<string,any>;if(Object.keys(x).some(k=>!allowed.includes(k)))fail(at+' unsupported field');return x;};
const str=(v:unknown,at:string,max=4000)=>{if(typeof v!=='string'||v.length>max)fail(at);};
const id=(v:unknown,at:string)=>{if(typeof v!=='string'||!/^[A-Za-z0-9_-]{1,200}$/.test(v)||['__proto__','constructor','prototype'].includes(v))fail(at);};
const learner=(v:unknown)=>{if(typeof v!=='string'||!/^[a-z0-9]{1,24}$/.test(v))fail('learner ID');};
const integer=(v:unknown,min=0)=>{if(!Number.isSafeInteger(v)||(v as number)<min||(v as number)>1000000)fail('revision');};
const bool=(v:unknown)=>{if(typeof v!=='boolean')fail('flag');};
const date=(v:unknown)=>{if(typeof v!=='string'||!/^\d{4}-\d\d-\d\d(?:T\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?Z)?$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v.slice(0,10))fail('date');};
const list=(v:unknown,max=2000):any[]=>{if(!Array.isArray(v)||v.length>max)fail('list bounds');return v as any[];};
const ids=(v:unknown)=>{const a=list(v,500);a.forEach(learner);if(new Set(a).size!==a.length)fail('duplicate learner');};
const unique=(a:any[],key:(v:any)=>string)=>{if(new Set(a.map(key)).size!==a.length)fail('duplicate identity');};
const targets=(v:unknown)=>{const a=list(v,100);a.forEach(t=>{obj(t,['id','title'],'target');id(t.id,'target ID');str(t.title,'target title',300);if(!t.title.trim())fail('empty target');});unique(a,t=>t.id);};
export function validateWorkflowItemInput(raw:unknown):asserts raw is WorkflowItemInput {
 const x=obj(raw,['id','classId','kind','title','instructions','memberIds','groupId','courseId','due','milestones','source','reviewerIds','scheduledAt','privateNote','actions','location'],'item');
 id(x.id,'item ID');id(x.classId,'class ID');str(x.title,'title',300);if(!x.title.trim())fail('empty title');str(x.instructions,'instructions',12000);ids(x.memberIds);if(!x.memberIds.length)fail('empty audience');
 if(!['peer_review','project','conference','notice','field_trip'].includes(x.kind))fail('item kind');
 for(const k of ['groupId','courseId'])if(x[k]!==undefined)id(x[k],k);
 for(const k of ['due','scheduledAt'])if(x[k]!==undefined)date(x[k]);
 if(x.kind==='project'){targets(x.milestones);if(!x.milestones.length)fail('empty milestones');}else if(x.milestones!==undefined)fail('unexpected milestones');
 if(x.kind==='peer_review') {const s=obj(x.source,['key','studentId','receiptId','version','text'],'peer source');str(s.key,'source key',500);if(!s.key)fail('source key');learner(s.studentId);str(s.receiptId,'receipt',1000);if(!s.receiptId)fail('receipt');str(s.version,'source version',200);str(s.text,'source text',20000);if(!s.version||!s.text.trim())fail('empty source');ids(x.reviewerIds);if(!x.reviewerIds.length||x.reviewerIds.includes(s.studentId)||!x.memberIds.includes(s.studentId)||x.reviewerIds.some((v:string)=>!x.memberIds.includes(v)))fail('peer audience');if(!x.courseId)fail('peer course');}
 else if(x.source!==undefined||x.reviewerIds!==undefined)fail('unexpected peer data');
 if(x.kind==='conference'){date(x.scheduledAt);str(x.privateNote,'private note',12000);targets(x.actions);}else if(x.privateNote!==undefined||x.actions!==undefined)fail('unexpected conference data');
 if(x.kind==='field_trip'){date(x.scheduledAt);str(x.location,'location',1000);}else if(x.location!==undefined)fail('unexpected location');
}
export function parseClassroomWorkflowState(raw:unknown):ClassroomWorkflowState {
 if(raw===null||raw===undefined)return emptyClassroomWorkflowState();
 if(typeof raw==='string'){if(raw.length>8*1024*1024)fail('state too large');raw=JSON.parse(raw);}
 const x=obj(raw,['version','revision','groups','items','responses','reviews','deletedStudentIds'],'state');if(x.version!==1)fail('version');integer(x.revision);list(x.deletedStudentIds,10000).forEach(learner);unique(x.deletedStudentIds,v=>v);
 list(x.groups,500).forEach(g=>{obj(g,['id','classId','name','memberIds','revision'],'group');id(g.id,'group ID');id(g.classId,'class ID');str(g.name,'group name',300);if(!g.name.trim())fail('group name');ids(g.memberIds);integer(g.revision,1);});unique(x.groups,g=>g.id);
 list(x.items).forEach(i=>{const {revision,published,revoked,createdAt,...input}=i;validateWorkflowItemInput(input);integer(revision,1);bool(published);bool(revoked);date(createdAt);if(published&&revoked)fail('revoked publication');});unique(x.items,i=>i.id+':'+i.revision);
 for(const item of x.items as WorkflowItem[]){const versions=(x.items as WorkflowItem[]).filter(i=>i.id===item.id);if(versions.some(i=>i.classId!==item.classId||i.kind!==item.kind))fail('item history scope');if(item.published&&versions.some(i=>i.revision>item.revision))fail('superseded publication');}
 list(x.responses,10000).forEach(r=>{obj(r,['id','itemId','itemRevision','studentId','kind','text','targetId','createdAt'],'response');id(r.id,'response ID');id(r.itemId,'item ID');integer(r.itemRevision,1);learner(r.studentId);str(r.text,'response text',20000);date(r.createdAt);if(!['feedback','submission','acknowledgment','action','reflection'].includes(r.kind))fail('response kind');if(r.targetId!==undefined)id(r.targetId,'target ID');const item=x.items.find((i:WorkflowItem)=>i.id===r.itemId&&i.revision===r.itemRevision) as WorkflowItem|undefined;if(!item)fail('orphan response');if(!item!.memberIds.includes(r.studentId))fail('response audience');const kind={peer_review:'feedback',project:'submission',conference:'action',notice:'acknowledgment',field_trip:'reflection'}[item!.kind];if(r.kind!==kind)fail('response kind mismatch');if(item!.kind==='peer_review'&&!item!.reviewerIds!.includes(r.studentId))fail('reviewer');if(item!.kind==='project'&&!item!.milestones!.some(t=>t.id===r.targetId)||item!.kind==='conference'&&!item!.actions!.some(t=>t.id===r.targetId))fail('response target');if(!['project','conference'].includes(item!.kind)&&r.targetId!==undefined)fail('unexpected response target');});unique(x.responses,r=>r.id);
 list(x.reviews,10000).forEach(r=>{obj(r,['id','responseId','status','note','released','createdAt'],'review');id(r.id,'review ID');id(r.responseId,'response ID');if(!['reviewed','needs_revision'].includes(r.status))fail('review status');str(r.note,'review note',12000);bool(r.released);date(r.createdAt);if(!x.responses.some((v:WorkflowResponse)=>v.id===r.responseId))fail('orphan review');});unique(x.reviews,r=>r.id);
 const deleted=new Set(x.deletedStudentIds);if(x.groups.some((g:WorkflowGroup)=>g.memberIds.some(v=>deleted.has(v)))||x.items.some((i:WorkflowItem)=>i.memberIds.some(v=>deleted.has(v))||i.source&&deleted.has(i.source.studentId))||x.responses.some((r:WorkflowResponse)=>deleted.has(r.studentId)))fail('deleted learner data');
 if(JSON.stringify(x).length>8*1024*1024)fail('state too large');return structuredClone(x) as ClassroomWorkflowState;
}
export function latestWorkflowItems(state:ClassroomWorkflowState):WorkflowItem[]{const m=new Map<string,WorkflowItem>();for(const i of state.items)if((m.get(i.id)?.revision??0)<i.revision)m.set(i.id,i);return [...m.values()];}
export function deleteClassroomWorkflowStudent(state:ClassroomWorkflowState,studentId:string):ClassroomWorkflowState {
 learner(studentId);if(state.deletedStudentIds.includes(studentId))return structuredClone(state);const next=structuredClone(state);next.deletedStudentIds=[...new Set([...next.deletedStudentIds,studentId])];
 // Delete entire shared work containing this learner: free-text snapshots may identify them.
 const removed=new Set(next.items.filter(i=>i.memberIds.includes(studentId)||i.source?.studentId===studentId).map(i=>i.id));
 next.items=next.items.filter(i=>!removed.has(i.id));next.responses=next.responses.filter(r=>r.studentId!==studentId&&!removed.has(r.itemId));const keep=new Set(next.responses.map(r=>r.id));next.reviews=next.reviews.filter(r=>keep.has(r.responseId));next.groups=next.groups.map(g=>g.memberIds.includes(studentId)?({...g,memberIds:g.memberIds.filter(v=>v!==studentId),revision:g.revision+1}):g);next.revision++;return parseClassroomWorkflowState(next);
}
export function restoreClassroomWorkflowState(state:ClassroomWorkflowState,currentDeletedIds:string[]=[]):ClassroomWorkflowState {
 let next=parseClassroomWorkflowState(state);for(const id of currentDeletedIds)next=deleteClassroomWorkflowStudent(next,id);
 next.items=next.items.map(i=>({...i,published:false}));next.reviews=next.reviews.map(r=>({...r,released:false}));next.revision++;return parseClassroomWorkflowState(next);
}

export function validateClassroomWorkflowFamily(state:ClassroomWorkflowState,family:{students:{id:string}[]}|null):void {
 const ids=new Set((family?.students??[]).map(s=>s.id));
 if(state.deletedStudentIds.some(id=>ids.has(id)))throw Error('A deleted learner cannot be restored.');
 const referenced=[...state.groups.flatMap(g=>g.memberIds),...state.items.flatMap(i=>i.memberIds),...state.responses.map(r=>r.studentId)];
 if(referenced.some(id=>!ids.has(id)))throw Error('Classroom workflows reference an unavailable learner.');
}
