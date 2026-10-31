import assert from 'node:assert/strict';
import { emptyClassroomWorkflowState, parseClassroomWorkflowState, restoreClassroomWorkflowState, deleteClassroomWorkflowStudent, validateClassroomWorkflowFamily, latestWorkflowItems, type WorkflowItemInput } from '../src/lib/classroomWorkflows.ts';
import { createClassroomWorkflowStore, type ClassroomWorkflowStoreIO } from '../src/lib/classroomWorkflowStore.ts';
import { configureLocalSession, unlockLocalAdult, unlockLocalLearner, lockLocalSession } from '../src/lib/localSession.ts';
import type { Family } from '../src/lib/family.ts';
const f={mode:'classroom',students:['alice','bob','cara','dave'].map(id=>({id,name:id})),classes:[{id:'class1',students:['alice','bob','cara'],assignments:[{courseId:'course1'}]},{id:'class2',students:['dave'],assignments:[]}],parent:{password:'same'}} as unknown as Family;
const source={key:'receipt:work',studentId:'alice',receiptId:'["class1","alice","mac"]',version:'mac',text:'Original exact work'};
let sourceAvailable=true;
let raw:string|null=null,current=structuredClone(f),who='bob',authority='teacher1',sourceText=source.text;
const io:ClassroomWorkflowStoreIO={read:async()=>raw,update:async fn=>raw=await fn(raw),authorizeAdult:async()=>({authorityKey:authority}),learnerContext:async()=>({studentId:who}),family:async()=>structuredClone(current),resolvePeerSource:async()=>({...source,text:sourceText,classId:'class1',courseId:'course1'}),peerSourceCurrent:async()=>sourceAvailable,now:()=> '2026-10-31T02:00:00.000Z'};
configureLocalSession(true);unlockLocalAdult();let teacher=createClassroomWorkflowStore(io);
const peer:WorkflowItemInput={id:'peer1',classId:'class1',kind:'peer_review',title:'Review work',instructions:'Be constructive',memberIds:['alice','bob'],courseId:'course1',source,reviewerIds:['bob']};
await teacher.saveItem(peer,0);await teacher.setPublication('peer1',1,'publish');
unlockLocalLearner('bob');let bob=createClassroomWorkflowStore(io);let view=await bob.learnerLoad('class1');assert.equal(view.items[0].source?.text,source.text);assert.equal(view.responses.length,0);
await bob.respond('peer1',1,{id:'feedback1',kind:'feedback',text:'Detailed private feedback'});await bob.respond('peer1',1,{id:'feedback1',kind:'feedback',text:'Detailed private feedback'});assert.equal(parseClassroomWorkflowState(raw).responses.length,1);
await assert.rejects(()=>bob.respond('peer1',1,{id:'feedback1',kind:'feedback',text:'Altered identity'}),/conflict/);
await assert.rejects(()=>bob.saveItem(peer,1),/adult/);
who='alice';unlockLocalLearner('alice');let alice=createClassroomWorkflowStore(io);assert.equal((await alice.learnerLoad('class1')).responses.length,0);await assert.rejects(()=>alice.respond('peer1',1,{id:'cheat',kind:'feedback',text:'Own feedback'}),/reviewer/);
who='cara';unlockLocalLearner('cara');let cara=createClassroomWorkflowStore(io);assert.equal((await cara.learnerLoad('class1')).items.length,0);await assert.rejects(()=>cara.respond('peer1',1,{id:'outsider',kind:'feedback',text:'No'}),/available/);
who='dave';unlockLocalLearner('dave');await assert.rejects(()=>createClassroomWorkflowStore(io).learnerLoad('class1'),/member/);
unlockLocalAdult();teacher=createClassroomWorkflowStore(io);await teacher.review('feedback1',{id:'review1',note:'Private teacher note',status:'reviewed',released:false},0);
who='alice';unlockLocalLearner('alice');alice=createClassroomWorkflowStore(io);assert.equal((await alice.learnerLoad('class1')).responses.length,0);
unlockLocalAdult();teacher=createClassroomWorkflowStore(io);await teacher.review('feedback1',{id:'review2',note:'Safe released note',status:'reviewed',released:true},1);
who='alice';unlockLocalLearner('alice');alice=createClassroomWorkflowStore(io);view=await alice.learnerLoad('class1');assert.equal(view.responses.length,1);assert.deepEqual(view.reviews,[],'source author sees moderated peer text, never teacher evaluation of reviewer');
who='bob';unlockLocalLearner('bob');bob=createClassroomWorkflowStore(io);assert.deepEqual((await bob.learnerLoad('class1')).reviews.map(r=>r.note),['Safe released note'],'teacher evaluation is visible only to response author');
unlockLocalAdult();teacher=createClassroomWorkflowStore(io);await teacher.saveGroup({id:'group1',classId:'class1',name:'Group one',memberIds:['alice','bob']},0);
const project:WorkflowItemInput={id:'project1',classId:'class1',kind:'project',title:'Group project',instructions:'Collaborate',memberIds:['alice','bob'],groupId:'group1',courseId:'course1',milestones:[{id:'m1',title:'First draft'}]};
await teacher.saveItem(project,0);await teacher.setPublication('project1',1,'publish');
who='bob';unlockLocalLearner('bob');bob=createClassroomWorkflowStore(io);await bob.respond('project1',1,{id:'submission1',kind:'submission',targetId:'m1',text:'My contribution'});await assert.rejects(()=>bob.respond('project1',1,{id:'badtarget',kind:'submission',targetId:'missing',text:'No'}),/milestone/);
who='alice';unlockLocalLearner('alice');alice=createClassroomWorkflowStore(io);assert.equal((await alice.learnerLoad('class1')).responses.some(r=>r.id==='submission1'),false);
unlockLocalAdult();teacher=createClassroomWorkflowStore(io);await teacher.review('submission1',{id:'projectreview',note:'Private evaluation of contributor',status:'reviewed',released:true},0);
who='alice';unlockLocalLearner('alice');alice=createClassroomWorkflowStore(io);view=await alice.learnerLoad('class1');assert(view.responses.some(r=>r.id==='submission1'));assert(!JSON.stringify(view).includes('Private evaluation of contributor'));
unlockLocalAdult();teacher=createClassroomWorkflowStore(io);await teacher.saveGroup({id:'group1',classId:'class1',name:'Updated group',memberIds:['alice','bob','cara']},1);assert.equal(latestWorkflowItems(parseClassroomWorkflowState(raw)).find(i=>i.id==='project1')?.published,false);
await teacher.saveItem({...project,memberIds:['alice','bob','cara']},1);await teacher.setPublication('project1',2,'publish');
who='cara';unlockLocalLearner('cara');cara=createClassroomWorkflowStore(io);assert.equal((await cara.learnerLoad('class1')).responses.length,0,'new member never receives prior revision submissions');
unlockLocalAdult();teacher=createClassroomWorkflowStore(io);
for(const item of [
{id:'conference1',kind:'conference',scheduledAt:'2026-11-01T10:00:00Z',privateNote:'TEACHER ONLY',actions:[{id:'a1',title:'Bring draft'}]},
{id:'notice1',kind:'notice'},
{id:'trip1',kind:'field_trip',scheduledAt:'2026-11-02',location:'Museum'}
] as const){await teacher.saveItem({...item,classId:'class1',title:item.id,instructions:'Local only',memberIds:['bob']} as WorkflowItemInput,0);await teacher.setPublication(item.id,1,'publish');}
who='bob';unlockLocalLearner('bob');bob=createClassroomWorkflowStore(io);view=await bob.learnerLoad('class1');assert.equal(JSON.stringify(view).includes('TEACHER ONLY'),false);
await bob.respond('conference1',1,{id:'action1',kind:'action',targetId:'a1',text:'I will bring it'});await bob.respond('notice1',1,{id:'ack1',kind:'acknowledgment',text:''});await bob.respond('notice1',1,{id:'ack2',kind:'acknowledgment',text:''});await bob.respond('trip1',1,{id:'reflection1',kind:'reflection',text:'I noticed fossils'});assert.equal(parseClassroomWorkflowState(raw).responses.filter(r=>r.kind==='acknowledgment').length,1);
sourceAvailable=false;assert.equal((await bob.learnerLoad('class1')).items.some(i=>i.kind==='peer_review'),false);await assert.rejects(()=>bob.respond('peer1',1,{id:'missing-source',kind:'feedback',text:'No'}),/source/);sourceAvailable=true;
// Current membership and assignment changes narrow visibility immediately.
current.classes![0].students=current.classes![0].students.filter(id=>id!=='bob');
await assert.rejects(()=>bob.learnerLoad('class1'),/member/);
await assert.rejects(()=>bob.respond('trip1',1,{id:'removed',kind:'reflection',text:'No'}),/available/);
current=structuredClone(f);current.classes![0].assignments=[];
assert.equal((await bob.learnerLoad('class1')).items.some(i=>i.id==='peer1'),false);
current=structuredClone(f);
// A multi-class learner never receives another class's DTO or notices.
current.classes![1].students.push('bob');
unlockLocalAdult();teacher=createClassroomWorkflowStore(io);
await teacher.saveItem({id:'otherclassnotice',classId:'class2',kind:'notice',title:'Other class',instructions:'Class2 only',memberIds:['bob']},0);
await teacher.setPublication('otherclassnotice',1,'publish');
unlockLocalLearner('bob');bob=createClassroomWorkflowStore(io);
assert((await bob.learnerLoad('class1')).items.every(i=>i.classId==='class1'));
assert((await bob.learnerLoad('class2')).items.every(i=>i.classId==='class2'));
// Cross-tab, restore, membership and session guards reject stale callbacks.
await bob.learnerLoad('class1');raw=JSON.stringify({...parseClassroomWorkflowState(raw),revision:parseClassroomWorkflowState(raw).revision+1});await assert.rejects(()=>bob.respond('trip1',1,{id:'stale',kind:'reflection',text:'No'}),/elsewhere/);await bob.learnerLoad('class1');lockLocalSession();await assert.rejects(()=>bob.respond('trip1',1,{id:'locked',kind:'reflection',text:'No'}),/session/);
unlockLocalAdult();teacher=createClassroomWorkflowStore(io);await teacher.teacherLoad('class1');sourceText='Changed';await assert.rejects(()=>teacher.setPublication('peer1',1,'publish'),/source/);sourceText=source.text;await teacher.setPublication('peer1',1,'revoke');await assert.rejects(()=>teacher.setPublication('peer1',1,'publish'),/revoked/);
const restored=restoreClassroomWorkflowState(parseClassroomWorkflowState(raw));assert(restored.items.every(i=>!i.published));assert(restored.reviews.every(r=>!r.released));
const deleted=deleteClassroomWorkflowStudent(parseClassroomWorkflowState(raw),'bob');assert(!JSON.stringify(deleted.items).includes('Original exact work'));assert(deleted.responses.every(r=>r.studentId!=='bob'));assert.deepEqual(deleteClassroomWorkflowStudent(deleted,'bob'),deleted);assert.throws(()=>validateClassroomWorkflowFamily(deleted,f),/deleted/);validateClassroomWorkflowFamily(emptyClassroomWorkflowState(),null);
assert.throws(()=>parseClassroomWorkflowState({...emptyClassroomWorkflowState(),extra:true}),/unsupported/);assert.throws(()=>parseClassroomWorkflowState({...emptyClassroomWorkflowState(),deletedStudentIds:['bob','bob']}),/duplicate/);
assert.throws(()=>parseClassroomWorkflowState({...parseClassroomWorkflowState(raw),responses:[{id:'bad',itemId:'peer1',itemRevision:1,studentId:'cara',kind:'feedback',text:'No',createdAt:io.now()}]}),/audience/);
// Authority changed while the CAS updater was suspended must not commit.
const before=raw;let raced=false;const raceIO={...io,update:async(fn:(v:string|null)=>Promise<string>)=>{if(!raced){authority='changed';raced=true;}const next=await fn(raw);raw=next;return next;}};teacher=createClassroomWorkflowStore(raceIO);await assert.rejects(()=>teacher.saveItem({...peer,id:'race'},0),/authority/);assert.equal(raw,before);
configureLocalSession(false);
console.log('Classroom workflows: role projections, five full loops, moderation, exact source, revision/CAS, session, restore and deletion passed.');
