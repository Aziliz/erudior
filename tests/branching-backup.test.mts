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
const {parseBranchingLibrary}=await import('../src/lib/branchingEngine.ts');
assert(validStateName('branching-engine'));
for(const bad of ['../branching-engine','branching-engine/other','branching-engine-extra'])assert(!validStateName(bad));
const {createBranchingEngineStore,deleteBranchingStudent}=await import('../src/lib/branchingEngineStore.ts');
const family={format:'erudior-family',version:1,students:[{id:'alice',name:'Alice'},{id:'bob',name:'Bob'}]};
state.set('family',JSON.stringify(family));
const pack:any={format:'erudior-branching-pack',version:1,id:'pack',revision:0,title:'Fictional project',description:'Synthetic private project evidence',sourceNote:'Fictional test only',timeUnit:'simulated ticks',maxTick:20,startNodeId:'start',variables:[],nodes:[{id:'start',title:'Start',text:'Synthetic project',choices:[{id:'finish',title:'Finish',to:'done',costTicks:2,conditions:[],effects:[],consequence:'Project completed'}]},{id:'done',title:'Done',text:'Synthetic outcome',terminal:'success',choices:[]}],milestones:[{id:'delivery',title:'Delivery',nodeId:'done',deadlineTick:5,required:true,consequence:'Missed fictional delivery',onMiss:[]}]};
const tx=stateTransactions({read:async name=>state.get(name)??null,write:async(name,value)=>{value===null?state.delete(name):state.set(name,value);}});
let reviewer='Teacher';
const engine=createBranchingEngineStore({read:async()=>state.get('branching-engine')??null,update:change=>tx.update('branching-engine',change),authorizeAdult:async()=>({actorId:'adult',actorName:reviewer,authorityKey:'session'}),learnerContext:async()=>({studentId:'alice',authorityKey:'alice'}),now:()=> '2026-10-29T00:00:00Z'});
await engine.supervisor.savePack(pack,null);
const approved=await engine.supervisor.approvePack('pack',1);
const assignment={id:'case',studentId:'alice',title:'Fictional case',instructions:'Private educational practice',startTick:0,pack:approved};
await engine.supervisor.assign(assignment,null);
await engine.learner.command('case',1,{kind:'choice',choiceId:'finish',note:'Private simulated decision'},'event',null);
await engine.learner.submit('case',1,'evidence',1);
await engine.supervisor.review({id:'feedback',submissionId:'evidence',status:'reviewed',note:'Private adult feedback'});
await engine.supervisor.savePack({...approved,title:'Newer unapproved rules'},1);
const library=parseBranchingLibrary(state.get('branching-engine'));
const snapshot=await collect([],[]);assert.deepEqual(snapshot.branchingEngine,library);
const encrypted=await encryptText(JSON.stringify(snapshot),'branching backup test phrase');assert(!encrypted.includes('Private simulated decision'));
state.delete('branching-engine');await restoreContents(await decryptText(JSON.parse(encrypted),'branching backup test phrase'),{courses:[],banks:[]});
let restored=parseBranchingLibrary(state.get('branching-engine'));
assert(restored.restoredAt);assert.deepEqual(restored.pendingApproval,['pack@1','pack@2']);assert.deepEqual(restored.submissions,library.submissions);assert.deepEqual(restored.feedback,library.feedback);
await assert.rejects(engine.supervisor.assign({...assignment,id:'newcase'},null),/approved/);
await assert.rejects(engine.learner.command('case',1,{kind:'advance',tick:3,note:'New'},'blocked',1),/fresh adult review/);
reviewer='Fresh local reviewer';
await engine.supervisor.approvePack('pack',1);
restored=parseBranchingLibrary(state.get('branching-engine'));assert.deepEqual(restored.pendingApproval,['pack@2'],'old assigned exact pack can be re-reviewed while newer revision stays quarantined');
assert.equal(restored.packReviews.at(-1)?.actor,'Fresh local reviewer');
assert.equal(restored.packReviews.length,library.packReviews.length+1);
assert.deepEqual(restored.assignments[0].pack,library.assignments[0].pack);
await engine.supervisor.assign({...assignment,id:'newcase'},null);
const forged=structuredClone(library);for(const value of [forged.packs[0],forged.assignments[0].pack,forged.submissions[0].assignment.pack])value.approval.actor='External claimed authority';forged.feedback[0].actor='Fabricated reviewer';forged.pendingApproval=[];
await restoreContents(JSON.stringify({...snapshot,branchingEngine:forged}),{courses:[],banks:[]});
restored=parseBranchingLibrary(state.get('branching-engine'));assert.deepEqual(restored.pendingApproval,['pack@1','pack@2']);assert.equal(restored.feedback[0].actor,'Fabricated reviewer','retained history is not authenticated authority');
await assert.rejects(engine.supervisor.assign({...assignment,id:'forged',pack:forged.packs[0]},null),/approved/);
const before=[...state];mutations.length=0;
const foreign=structuredClone(library);foreign.assignments[0].studentId='outsider';foreign.submissions[0].studentId='outsider';foreign.submissions[0].assignment.studentId='outsider';
const corrupt=structuredClone(library);(corrupt.sessions[0].events[0].command as any).choiceId='unsupported';
for(const malformed of [null,foreign,corrupt,{...library,packs:[]},{...library,sessions:[]}]){
  await assert.rejects(restoreContents(JSON.stringify({...snapshot,branchingEngine:malformed}),{courses:[],banks:[]}));
  assert.deepEqual([...state],before);assert.deepEqual(mutations,[],'all branching validation precedes destructive restore');
}
state.set('branching-engine','{broken');await assert.rejects(collect([],[]));state.set('branching-engine',JSON.stringify(library));
const {branchingEngine:_,...legacy}=snapshot;await restoreContents(JSON.stringify(legacy),{courses:[],banks:[]});assert(!state.has('branching-engine'),'legacy restore clears unrelated private state');
state.set('branching-engine',JSON.stringify(library));
const classroom=createClassroomSubmissionStore({readState:async name=>state.get(name)??null,writeState:tx.save,updateState:tx.update,readFamily:async()=>JSON.parse(state.get('family')!),writeFamily:async value=>tx.save('family',JSON.stringify(value)),readFile:async()=>null,writeFile:async()=>{},now:()=> '2026-10-29T00:00:00Z'});
await classroom.deleteStudent('alice',family as any);
const removed=parseBranchingLibrary(state.get('branching-engine'));assert.deepEqual(removed.deletedStudentIds,['alice']);assert.equal(removed.assignments.length,0);assert.equal(removed.sessions.length,0);assert.equal(removed.submissions.length,0);assert.equal(removed.feedback.length,0);assert(!state.get('branching-engine')!.includes('Private simulated decision'));assert.equal(removed.packs.length,2);await assert.rejects(engine.learner.submit('case',1,'stale',1),/deleted/);assert.deepEqual(deleteBranchingStudent(removed,'alice'),removed);
console.log('Branching backup: encrypted exact history, forged-approval quarantine, old-pack re-review, preflight isolation and profile cleanup passed');
