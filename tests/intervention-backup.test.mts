import assert from 'node:assert/strict';
const state=new Map<string,string>(),mutations:string[]=[];
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
const {parseInterventionState}=await import('../src/lib/interventions.ts');
const {deleteInterventionStudent}=await import('../src/lib/interventionStore.ts');
const {createClassroomSubmissionStore}=await import('../src/lib/classroomSubmissionStore.ts');
const {stateTransactions}=await import('../src/lib/stateLock.ts');
const family={format:'erudior-family',version:1,students:[{id:'alice',name:'Alice'},{id:'bob',name:'Bob'}]};
state.set('family',JSON.stringify(family));
const baseline={skillId:'math.place-value',title:'Place value',mastery:null,confidence:0,answers:0,status:'unknown',reason:'No evidence yet.',blockedBy:[],sources:[],patterns:[],measuredAt:'2026-10-29T00:00:00Z'};
const plan={id:'plan',studentId:'alice',skillId:baseline.skillId,goal:'Review place value',instructions:'Discuss with an adult.',activities:[{kind:'lesson',courseId:'math-prealgebra',title:'Place value',sourceFingerprint:'a'.repeat(64),lessonId:'pre-place-value'}],baseline,actorId:'adult',actorName:'Teacher',createdAt:baseline.measuredAt};
const ledger=parseInterventionState({version:1,plans:[plan],events:[{id:'note',planId:'plan',kind:'observation',note:'Private observation.',actorId:'adult',actorName:'Teacher',at:baseline.measuredAt}]});
state.set('interventions',JSON.stringify(ledger));
const snapshot=await collect([],[]);assert.deepEqual(snapshot.interventions,ledger);
const encrypted=await encryptText(JSON.stringify(snapshot),'backup test passphrase');assert(!encrypted.includes('Private observation'));
state.delete('interventions');await restoreContents(await decryptText(JSON.parse(encrypted),'backup test passphrase'),{courses:[],banks:[]});assert.deepEqual(JSON.parse(state.get('interventions')!),ledger);
const before=[...state];mutations.length=0;
for(const malformed of [null,{...ledger,events:[{...ledger.events[0],actorId:''}]},{...ledger,plans:[{...plan,studentId:'outsider'}]}]){
 await assert.rejects(restoreContents(JSON.stringify({...snapshot,interventions:malformed}),{courses:[],banks:[]}));assert.deepEqual([...state],before);assert.deepEqual(mutations,[],'history validation precedes destructive restore');
}
await assert.rejects(restoreContents(JSON.stringify({...snapshot,progress:{...snapshot.progress,interventionTasks:{forged:true}}}),{courses:[],banks:[]}));assert.deepEqual(mutations,[]);
state.set('interventions','{damaged');await assert.rejects(collect([],[]));state.set('interventions',JSON.stringify(ledger));
const {taskFromPlan}=await import('../src/lib/interventionTasks.ts');
state.set('progress',JSON.stringify({...snapshot.progress,interventionTasks:[taskFromPlan(plan as any)]}));
const {interventions:_,...legacy}=snapshot;await restoreContents(JSON.stringify(legacy),{courses:[],banks:[]});assert(!state.has('interventions'),'legacy backup clears unrelated private history');assert.equal(JSON.parse(state.get('progress')!).interventionTasks,undefined,'explicit full restore clears previous base-profile imported tasks');
// Exercise actual full-profile deletion orchestration and retry safety.
state.set('interventions',JSON.stringify(ledger));
const tx=stateTransactions({read:async name=>state.get(name)??null,write:async(name,value)=>{value===null?state.delete(name):state.set(name,value);}});
const store=createClassroomSubmissionStore({readState:async name=>state.get(name)??null,writeState:tx.save,updateState:tx.update,readFamily:async()=>JSON.parse(state.get('family')!),writeFamily:async value=>tx.save('family',JSON.stringify(value)),readFile:async()=>null,writeFile:async()=>{},now:()=>baseline.measuredAt});
await store.deleteStudent('alice',family as any);
const removed=parseInterventionState(state.get('interventions'));assert.deepEqual(removed.deletedStudentIds,['alice']);assert.equal(removed.plans.length,0);assert.equal(removed.events.length,0);assert(!state.get('interventions')!.includes('Private observation'));
assert.deepEqual(deleteInterventionStudent(removed,'alice'),removed,'repeated cleanup remains idempotent');
console.log('intervention backup: encrypted recovery, malformed/foreign learner preflight, task validation, legacy clearing and full-profile privacy deletion passed');
