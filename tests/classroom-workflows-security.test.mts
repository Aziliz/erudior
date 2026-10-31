import assert from 'node:assert/strict';
import {createClassroomWorkflowStore} from '../src/lib/classroomWorkflowStore.ts';
import {emptyClassroomWorkflowState,parseClassroomWorkflowState} from '../src/lib/classroomWorkflows.ts';
const at='2026-10-31T02:00:00Z';
let family:any={mode:'classroom',students:[{id:'alice'},{id:'bob'}],classes:[{id:'class1',students:['alice','bob'],assignments:[]}]};
const item:any={id:'project',classId:'class1',kind:'project',title:'Shared project',instructions:'Instructions',memberIds:['alice','bob'],milestones:[{id:'draft',title:'Draft'}],revision:1,published:true,revoked:false,createdAt:at};
let state=parseClassroomWorkflowState({...emptyClassroomWorkflowState(),items:[item],responses:[{id:'response',itemId:'project',itemRevision:1,studentId:'alice',kind:'submission',text:'Former member private contribution',targetId:'draft',createdAt:at}],reviews:[{id:'review',responseId:'response',status:'reviewed',note:'Private peer grade-like feedback',released:true,createdAt:at}]});
const io={read:async()=>JSON.stringify(state),update:async(change:any)=>{const raw=await change(JSON.stringify(state));state=parseClassroomWorkflowState(raw);return raw;},authorizeAdult:async()=>({authorityKey:'adult'}),learnerContext:async()=>({studentId:'bob'}),family:async()=>structuredClone(family),resolvePeerSource:async()=>{throw Error('not used');},now:()=>at};
const store=createClassroomWorkflowStore(io);
const shared=await store.learnerLoad('class1');
assert.equal(shared.responses.length,1,'explicitly released group contribution visible to current member');
assert.equal(shared.reviews.length,0,'teacher evaluation of another contributor must not be exposed to peers');
assert(!JSON.stringify(shared).includes('Private peer grade-like feedback'));
family.classes[0].students=['bob'];
const removed=await store.learnerLoad('class1');
assert.equal(removed.responses.length,0,'removed learner contribution must not remain exposed to peers');
assert.equal(removed.reviews.length,0,'removed learner feedback must not leak through projection');
console.log('Classroom security review: removed-member response and review projections fail closed');

// Execute the actual App authority closure with synthetic IO. The surrounding React
// tree is covered by browser acceptance; this isolates the asynchronous deletion gap.
const {readFileSync}=await import('node:fs');
const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const access=app.slice(app.indexOf('  const classroomAccess = useMemo(() => {'));
const start=access.indexOf('    const currentFamily = async () => {')+'    const currentFamily = async () => {'.length;
const end=access.indexOf('\n    };',start);
assert(start>0&&end>start,'actual App classroom authority closure must remain testable');
const body=access.slice(start,end);
const {validateClassroomSubmissionState}=await import('../src/lib/classroomSubmissionStore.ts');
let locked=false,deleted:string[]=[];
const authority=new Function('guard','HOMESCHOOL','TEMPORARY_GUEST','loadFamily','isClassroom','assertLocalSessionCredential','validateClassroomSubmissionState','store',`return async()=>{${body}}`)(
 ()=>{if(locked)throw Error('locked');},true,false,async()=>structuredClone(family),(f:any)=>f.mode==='classroom',()=>{},validateClassroomSubmissionState,
 {loadState:async(name:string)=>{assert.equal(name,'classroom-submissions');return JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:deleted});}}
);
assert.equal((await authority()).mode,'classroom');
deleted=['alice'];
await assert.rejects(authority(),/removal.*progress/i,'shared tombstone blocks before workflow cleanup and final Family roster removal');
deleted=[];locked=true;await assert.rejects(authority(),/locked/);
console.log('Classroom App authority: partial learner deletion and locked origin fail closed before returning Family');

// An intervening withdrawal while an asynchronous view is loading must not return
// the previously readable snapshot. The UI retains its draft and asks to reload.
family.classes[0].students=['alice','bob'];
let reads=0;
const racing=createClassroomWorkflowStore({...io,read:async()=>{const raw=JSON.stringify(state);if(++reads===1){state={...state,revision:state.revision+1,items:state.items.map(i=>({...i,published:false}))};}return raw;}});
await assert.rejects(racing.learnerLoad('class1'),/changed.*load|reload/i);
console.log('Classroom security review: concurrent withdrawal invalidates in-flight learner projection');
