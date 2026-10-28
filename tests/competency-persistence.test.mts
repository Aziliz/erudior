import assert from 'node:assert/strict';
const state=new Map<string,string>();let tombstoneRead=0,deleteAt=Infinity;
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
 if(command==='load_state'){
  if(args.name==='classroom-submissions'&&++tombstoneRead===deleteAt){state.set('classroom-submissions',JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:['alice']}));state.delete('progress-alice');}
  return state.get(args.name)??null;
 }
 if(command==='compare_and_swap_state'){if((state.get(args.name)??null)!==args.expected)return false;state.set(args.name,args.content);return true;}
 if(command==='save_state'){if(args.content===null)state.delete(args.name);else state.set(args.name,args.content);return;}
 throw Error('Unexpected native command '+command);
}}};
const store=await import('../src/lib/storage.ts');
const {applyCompetencyDecision,competencyLedgerEvidence}=await import('../src/lib/competencyState.ts');
const initial=store.emptyProgress();await store.saveProgress(initial);assert(state.has('progress'));
const newer=applyCompetencyDecision(initial,{id:'event',skillId:'math.skill',action:'ready',reason:'Local placement',actorId:'parent',actorName:'Adult',at:'2026-10-28T12:00:00.000Z'});
await store.updateProfileProgress(null,()=>newer);
await store.saveProgress({...initial,seeded:true});assert.equal((await store.loadBaseProgress()).competencies?.decisions.length,1,'stale normal save preserves current ledger');
state.set('family',JSON.stringify({students:[{id:'alice'},{id:'bob'}]}));
await store.syncCompetencyState('alice',[],[]);assert(state.has('progress-alice'));assert(!state.has('progress-bob'));
// Deletion tombstone appears during the captured update, while family still includes Alice.
tombstoneRead=0;deleteAt=3;await assert.rejects(store.syncCompetencyState('alice',[],[]),/deleted/);assert(!state.has('progress-alice'),'pending sync cannot resurrect deleted learner');
await assert.rejects(store.syncCompetencyState('missing',[],[]),/no longer exists/);
// Returning to a previous identical score selects it, rather than an intervening snapshot.
const source={skillId:'math.skill',courseId:'course',bankId:'bank',questionId:'q',fingerprint:'a'.repeat(64),revision:1,snapshotId:'b'.repeat(64)};
const high={...source,id:'b'.repeat(64),at:'2026-10-28T12:00:00.000Z',mastery:.9,confidence:.9,n:30};
const low={...source,id:'c'.repeat(64),at:'2026-10-28T13:00:00.000Z',mastery:.5,confidence:.9,n:30};
const p={...initial,competencies:{version:1 as const,sources:[source],snapshots:[high,low],decisions:[]}};
assert.equal(competencyLedgerEvidence(p).course['["bank","q"]'].mastery,.9);
console.log('competency persistence: base/profile native CAS, stale-save preservation, deletion race/tombstone and repeated-score active snapshot passed');
// Plaintext learner recovery is not an adult authorization channel, and its target
// cannot follow a later active-profile switch during asynchronous restoration.
state.delete('classroom-submissions');deleteAt=Infinity;
state.set('progress-alice',JSON.stringify(newer));state.set('progress-bob',JSON.stringify(initial));
store.useStudentFiles('alice');
const forged=applyCompetencyDecision(initial,{id:'forged',skillId:'math.other',action:'mastered',reason:'A backup cannot authenticate this claim',actorId:'fake-adult',actorName:'Claimed adult',at:'2026-10-28T14:00:00.000Z'});
const restoring=store.restoreBackup({format:'erudior-backup',version:1,courses:[],banks:[],progress:forged},{courses:[],banks:[]});
store.useStudentFiles('bob');await restoring;
const alice=await store.loadProfileProgress('alice'),bob=await store.loadProfileProgress('bob');
assert.equal(alice.competencies!.decisions.find(d=>d.id==='forged')!.imported,true,'plaintext cannot claim authenticated adult authority');
assert.equal(alice.competencies!.decisions.find(d=>d.id==='event')!.imported,undefined,'current operative local history is preserved');
assert.equal(bob.competencies,undefined,'delayed restore remains bound to captured learner');
const {competencyLedgerStates}=await import('../src/lib/competencyState.ts');
assert.equal(competencyLedgerStates([{id:'math.other',title:'Other',prerequisites:[],evidence:{},assessments:[]}],alice)[0].mastered,false,'imported manual claim cannot satisfy a prerequisite');
console.log('competency plaintext recovery: imported history non-operative, current adult history retained and captured profile target preserved');
