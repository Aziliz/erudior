import assert from 'node:assert/strict';
const state = new Map<string,string>(), mutations:string[]=[];
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
  if(command==='load_state')return state.get(args.name)??null;
  if(command==='save_state'){mutations.push(args.name);args.content===null?state.delete(args.name):state.set(args.name,args.content);return;}
  if(command==='compare_and_swap_state'){if((state.get(args.name)??null)!==args.expected)return false;mutations.push(args.name);state.set(args.name,args.content);return true;}
  if(command==='load_progress')return state.get('progress')??null;
  if(command==='save_progress'){mutations.push('progress');state.set('progress',args.content);return;}
  throw Error('Unexpected command '+command);
}}};
const {collect,restoreContents,encryptText,decryptText}=await import('../src/lib/backup.ts');
const {createClassroomSubmissionStore}=await import('../src/lib/classroomSubmissionStore.ts');
const {stateTransactions,validStateName}=await import('../src/lib/stateLock.ts');
const {parseLearnerPrivacyLibrary,restoreLearnerPrivacyLibrary,createLearnerPrivacyStore}=await import('../src/lib/learnerPrivacyStore.ts');
const {learnerPrivacyFixture}=await import('./fixtures/learnerPrivacy.ts');
const f=await learnerPrivacyFixture();
assert(validStateName('learner-privacy'));for(const bad of ['../learner-privacy','learner-privacy/other','learner-privacy-extra'])assert(!validStateName(bad));
const family={format:'erudior-family',version:1,students:[{id:'alice',name:'Alice'},{id:'bob',name:'Bob'}]};state.set('family',JSON.stringify(family));
const profile={studentId:'alice',consent:true,binding:f.binding,remoteRevision:0,status:'active',retentionDays:7,pending:{requestId:'synthetic-request-123',expectedRevision:0,retentionDays:7,envelope:f.envelope}};
const library=parseLearnerPrivacyLibrary({format:'erudior-learner-privacy',version:1,revision:2,profiles:[profile,{...profile,studentId:null}],deletedStudentIds:['oldprofile']});
state.set('learner-privacy',JSON.stringify(library));
const snapshot=await collect([],[]);assert.deepEqual(snapshot.learnerPrivacy,library);
const encrypted=await encryptText(JSON.stringify(snapshot),'privacy backup test passphrase');assert(!encrypted.includes(f.binding.account));
state.set('learner-privacy',JSON.stringify({...library,profiles:[],deletedStudentIds:['currentdeleted']}));
await restoreContents(await decryptText(JSON.parse(encrypted),'privacy backup test passphrase'),{courses:[],banks:[]});
let restored=parseLearnerPrivacyLibrary(state.get('learner-privacy'));assert.deepEqual(restored.profiles,[]);assert.deepEqual(new Set(restored.deletedStudentIds),new Set(['oldprofile','currentdeleted']));
assert(!state.get('learner-privacy')!.includes(f.binding.account));assert(!state.get('learner-privacy')!.includes(f.envelope.data));
const before=[...state];mutations.length=0;
for(const malformed of [null,{...library,profiles:[{...profile,studentId:'outsider'}]},{...library,profiles:[{...profile,secretKey:'forbidden'}]},{...library,profiles:[{...profile,consent:false}]},{...library,deletedStudentIds:['alice']}]){
 await assert.rejects(restoreContents(JSON.stringify({...snapshot,learnerPrivacy:malformed}),{courses:[],banks:[]}));assert.deepEqual([...state],before);assert.deepEqual(mutations,[],'privacy preflight before any mutation');
}
state.set('learner-privacy','{broken');await assert.rejects(collect([],[]));state.set('learner-privacy',JSON.stringify(library));
const {learnerPrivacy:_,...legacy}=snapshot;await restoreContents(JSON.stringify(legacy),{courses:[],banks:[]});restored=parseLearnerPrivacyLibrary(state.get('learner-privacy'));assert.equal(restored.profiles.length,0);assert.deepEqual(restored.deletedStudentIds,['oldprofile']);
state.set('learner-privacy',JSON.stringify(library));
const tx=stateTransactions({read:async name=>state.get(name)??null,write:async(name,value)=>{value===null?state.delete(name):state.set(name,value);}});
const classroom=createClassroomSubmissionStore({readState:async name=>state.get(name)??null,writeState:tx.save,updateState:tx.update,readFamily:async()=>JSON.parse(state.get('family')!),writeFamily:async value=>tx.save('family',JSON.stringify(value)),readFile:async()=>null,writeFile:async()=>{},now:()=> '2026-10-29T00:00:00Z'});
await classroom.deleteStudent('alice',family as any);restored=parseLearnerPrivacyLibrary(state.get('learner-privacy'));assert(!restored.profiles.some(p=>p.studentId==='alice'));assert(restored.deletedStudentIds.includes('alice'));assert.equal(restored.profiles.length,1,'anonymous practice metadata not another learner');
const service=createLearnerPrivacyStore({read:async()=>state.get('learner-privacy')??null,update:change=>tx.update('learner-privacy',change),authorize:async()=> 'stale-authority',courses:async()=>[],progress:async()=>({} as any),updateProgress:async()=>({} as any)}).forProfile('alice');await assert.rejects(service.load(),/deleted/);
const recovery=restoreLearnerPrivacyLibrary(library,restored);assert(recovery.deletedStudentIds.includes('alice'));assert.equal(recovery.profiles.length,0,'old backup cannot resurrect deleted association');
console.log('Learner privacy backup: encrypted metadata, restore consent/queue removal, monotonic tombstones, preflight and local deletion passed');
