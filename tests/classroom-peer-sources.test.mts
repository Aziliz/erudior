import assert from 'node:assert/strict';
import { classroomPeerSourceOptions,resolveClassroomPeerSource } from '../src/lib/classroomPeerSources.ts';
import type { Family } from '../src/lib/family.ts';
import type { StoredSubmissionRecord } from '../src/lib/classroomSubmissionStore.ts';
const family={mode:'classroom',students:[{id:'alice'}],classes:[{id:'class1',students:['alice'],assignments:[{courseId:'science'}]}]} as Family;
const receipt={id:'receipt1',classId:'class1',studentId:'alice',studentName:'Synthetic Alice',submittedAt:'2026-10-31T00:00:00Z',importComplete:true,courses:['science'],snapshot:{mac:'signed-receipt',progress:{work:{'science/report':{kind:'writing',submitted:'2026-10-31',text:'Original selected text',photos:[{name:'PRIVATE PHOTO'}]},'science/private-draft':{text:'PRIVATE DRAFT'},'other/report':{submitted:'2026-10-31',text:'UNASSIGNED'}},attempts:[{secret:'PRIVATE GRADE'}],studentWorkspace:{note:'PRIVATE NOTE'}}}} as unknown as StoredSubmissionRecord;
const options=classroomPeerSourceOptions(family,'class1',[receipt]);assert.equal(options.length,1);assert.equal(options[0].text,'Original selected text');assert(!JSON.stringify(options).includes('PRIVATE'));assert(!JSON.stringify(options).includes('UNASSIGNED'));
assert.equal(resolveClassroomPeerSource(options,options[0].key),options[0]);assert.throws(()=>resolveClassroomPeerSource(options,'unknown'),/no longer available/);
for(const override of [{importComplete:false},{studentId:'outsider'},{classId:'class2'},{courses:['other']}])assert.deepEqual(classroomPeerSourceOptions(family,'class1',[{...receipt,...override}]),[]);
const removed=structuredClone(family);removed.classes![0].students=[];assert.deepEqual(classroomPeerSourceOptions(removed,'class1',[receipt]),[]);
const unassigned=structuredClone(family);unassigned.classes![0].assignments=[];assert.deepEqual(classroomPeerSourceOptions(unassigned,'class1',[receipt]),[]);
const oversized=structuredClone(receipt);oversized.snapshot.progress.work!['science/report'].text='x'.repeat(20001);assert.deepEqual(classroomPeerSourceOptions(family,'class1',[oversized]),[]);
const changed=structuredClone(receipt);changed.snapshot.mac='different-version';assert.notEqual(classroomPeerSourceOptions(family,'class1',[changed])[0].version,options[0].version);
assert.throws(()=>classroomPeerSourceOptions({...family,mode:'homeschool'},'class1',[receipt]),/current local/);

const spaced=structuredClone(receipt);spaced.snapshot.progress.work!['science/report'].text='  exact submitted whitespace\n';assert.equal(classroomPeerSourceOptions(family,'class1',[spaced])[0].text,'  exact submitted whitespace\n');


// Valid bounded IDs must not disappear merely because their identity is long.
const longCourse='c'.repeat(200),longWork='w'.repeat(200),longClass='k'.repeat(200);
const longFamily={...family,classes:[{...family.classes![0],id:longClass,assignments:[{courseId:longCourse}]}]};
const longReceipt=structuredClone(receipt);longReceipt.classId=longClass;longReceipt.id=JSON.stringify([longClass,'alice','m'.repeat(44)]);longReceipt.courses=[longCourse];longReceipt.snapshot.mac='m'.repeat(44);longReceipt.snapshot.progress.work={[longCourse+'/'+longWork]:{kind:'writing',submitted:'2026-10-31',text:'Same submitted text'},[longCourse+'/second']:{kind:'writing',submitted:'2026-10-31',text:'Same submitted text'}} as any;
const longOptions=classroomPeerSourceOptions(longFamily,longClass,[longReceipt]);assert.equal(longOptions.length,2);assert.equal(longOptions[0].version,longReceipt.snapshot.mac);assert.notEqual(longOptions[0].key,longOptions[1].key);assert.equal(resolveClassroomPeerSource(longOptions,longOptions[0].key).key,longOptions[0].key);
const {validateWorkflowItemInput}=await import('../src/lib/classroomWorkflows.ts');
const {key,studentId,receiptId,version,text}=longOptions[0];
validateWorkflowItemInput({id:'peerlong',classId:longClass,kind:'peer_review',title:'Long bounded source',instructions:'Review exact work',memberIds:['alice','bob'],courseId:longCourse,source:{key,studentId,receiptId,version,text},reviewerIds:['bob']});
console.log('Classroom peer sources: exact complete submitted text only; roster/course scope, privacy, size and version bounds passed.');
