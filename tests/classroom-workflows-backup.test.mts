import assert from 'node:assert/strict';
// Production recovery orchestration, isolated native IO; no real learner files.
const state = new Map<string,string>(), writes:string[]=[];
let injectFirstErasure:string|null=null, erasureInjected=false;
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
  if(command==='load_state')return state.get(args.name)??null;
  if(command==='save_state'){writes.push(args.name);args.content===null?state.delete(args.name):state.set(args.name,args.content);return;}
  if(command==='compare_and_swap_state'){if(args.name==='classroom-submissions'&&injectFirstErasure){state.set(args.name,JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:[injectFirstErasure]}));injectFirstErasure=null;erasureInjected=true;}if((state.get(args.name)??null)!==args.expected)return false;writes.push(args.name);state.set(args.name,args.content);return true;}
  if(command==='load_progress')return state.get('progress')??null;
  if(command==='save_progress'){writes.push('progress');state.set('progress',args.content);return;}
  throw Error('Unexpected native command '+command);
}}};
const {collect,restoreContents,encryptText,decryptText}=await import('../src/lib/backup.ts');
const {validStateName,stateTransactions}=await import('../src/lib/stateLock.ts');
const {parseClassroomWorkflowState}=await import('../src/lib/classroomWorkflows.ts');
assert(validStateName('classroom-workflows'));
for(const name of ['../classroom-workflows','classroom-workflows/other','classroom-workflows-extra','classroom-workflows-alice'])assert(!validStateName(name));
const empty=parseClassroomWorkflowState(null);
state.set('classroom-workflows',JSON.stringify(empty));
const snapshot=await collect([],[]);
assert.deepEqual(snapshot.classroomWorkflows,empty);
const encrypted=await encryptText(JSON.stringify(snapshot),'synthetic classroom backup passphrase');
state.delete('classroom-workflows');
await restoreContents(await decryptText(JSON.parse(encrypted),'synthetic classroom backup passphrase'),{courses:[],banks:[]});
assert.equal(writes.at(-1),'family','credentials installed last');
assert.deepEqual({...parseClassroomWorkflowState(state.get('classroom-workflows')!),revision:0},empty);
for(const invalid of [null,{}, {...empty,version:999}, {...empty,unknownAuthority:true}]){
  const before=[...state];writes.length=0;
  await assert.rejects(restoreContents(JSON.stringify({...snapshot,classroomWorkflows:invalid}),{courses:[],banks:[]}));
  assert.deepEqual([...state],before);assert.deepEqual(writes,[],'malformed workflow rejected before restore mutation');
}
state.set('classroom-workflows','{corrupt');await assert.rejects(collect([],[]));
state.set('classroom-workflows',JSON.stringify(empty));
// Full private-content lifecycle is retained by encrypted backup, never as imported sharing authority.
const family:any={format:'erudior-family',version:1,mode:'classroom',students:[{id:'alice',name:'Alice',assigned:[]},{id:'bob',name:'Bob',assigned:[]}],classes:[{id:'class1',name:'Class',students:['alice','bob'],assignments:[{courseId:'math',assigned:'2026-10-31'}],handins:{}}]};
const at='2026-10-31T02:00:00Z';
const erasedIdentityMessage='This backup contains a deleted learner. Erased learner records cannot be restored to their old identity.';
const item={id:'project',classId:'class1',kind:'project',title:'Private shared project',instructions:'Private teacher plan',memberIds:['alice','bob'],courseId:'math',milestones:[{id:'draft',title:'Draft'}],revision:1,published:true,revoked:false,createdAt:at};
const unrelated={id:'notice',classId:'class1',kind:'notice',title:'Bob notice',instructions:'Unrelated instruction',memberIds:['bob'],revision:1,published:true,revoked:false,createdAt:at};
const full=parseClassroomWorkflowState({...empty,groups:[{id:'group1',classId:'class1',name:'Team',memberIds:['alice','bob'],revision:1}],items:[item,unrelated],responses:[{id:'response',itemId:'project',itemRevision:1,studentId:'alice',kind:'submission',text:'Private learner response',targetId:'draft',createdAt:at}],reviews:[{id:'review',responseId:'response',status:'reviewed',note:'Private teacher review',released:true,createdAt:at}]});
state.set('family',JSON.stringify(family));state.set('classroom-workflows',JSON.stringify(full));
const complete=await collect([],[]);assert.deepEqual(complete.classroomWorkflows,full);
const privateEncrypted=await encryptText(JSON.stringify(complete),'private classroom passphrase');
assert(!privateEncrypted.includes('Private learner response'));assert(!privateEncrypted.includes('Private teacher review'));
state.set('classroom-workflows',JSON.stringify({...full,revision:41}));
await restoreContents(await decryptText(JSON.parse(privateEncrypted),'private classroom passphrase'),{courses:[],banks:[]});
const restored=parseClassroomWorkflowState(state.get('classroom-workflows')!);
assert.equal(restored.revision,42,'older backup invalidates every open editor revision');
assert(restored.items.every(i=>!i.published));assert(restored.reviews.every(r=>!r.released));
assert.equal(restored.responses[0].text,'Private learner response','history retained without sharing authority');
const foreign=structuredClone(full);foreign.items[0].memberIds.push('outsider');
{const before=[...state];writes.length=0;await assert.rejects(restoreContents(JSON.stringify({...complete,classroomWorkflows:foreign}),{courses:[],banks:[]}),/family|learner/i);assert.deepEqual([...state],before);assert.deepEqual(writes,[]);}
const tx=stateTransactions({read:async key=>state.get(key)??null,write:async(key,value)=>{value===null?state.delete(key):state.set(key,value);}});
const {createClassroomSubmissionStore}=await import('../src/lib/classroomSubmissionStore.ts');
const deletion=createClassroomSubmissionStore({readState:async name=>state.get(name)??null,writeState:tx.save,updateState:tx.update,readFamily:async()=>JSON.parse(state.get('family')!),writeFamily:async value=>tx.save('family',JSON.stringify(value)),readFile:async()=>null,writeFile:async()=>{},now:()=>at});
await deletion.deleteStudent('alice',family);
const cleaned=parseClassroomWorkflowState(state.get('classroom-workflows')!);
assert(cleaned.deletedStudentIds.includes('alice'));assert.equal(cleaned.items.length,1);assert.equal(cleaned.items[0].id,'notice');assert.equal(cleaned.responses.length,0);assert.equal(cleaned.reviews.length,0);
assert(!JSON.stringify(cleaned).includes('Private learner response'));assert(!JSON.stringify(cleaned).includes('Private teacher review'));assert.deepEqual(cleaned.groups[0].memberIds,['bob']);
{const before=[...state];writes.length=0;await assert.rejects(restoreContents(JSON.stringify(complete),{courses:[],banks:[]}),{message:erasedIdentityMessage});assert.deepEqual([...state],before);assert.deepEqual(writes,[]);}
// Shared ledger erasure markers survive a legacy full restore that predates workflows.
state.set('classroom-submissions',JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:['erased']}));
const {classroomWorkflows:_,...legacy}=snapshot;
await restoreContents(JSON.stringify(legacy),{courses:[],banks:[]});
assert(parseClassroomWorkflowState(state.get('classroom-workflows')!).deletedStudentIds.includes('erased'));
const before=[...state];writes.length=0;
await assert.rejects(restoreContents(JSON.stringify({...snapshot,family:{format:'erudior-family',version:1,mode:'homeschool',students:[{id:'erased',name:'Erased'}]},students:{erased:{progress:snapshot.progress,records:{}}}}),{courses:[],banks:[]}),{message:erasedIdentityMessage});
assert.deepEqual([...state],before);assert.deepEqual(writes,[]);
console.log('Classroom workflow backup: exact namespace, encrypted history, imported release quarantine, revision invalidation, outsider/malformed preflight, profile erasure and legacy tombstones passed');

// Competing native/webview deletion inserts the FIRST marker after restore's
// preflight/read but before its atomic commit. CAS must retry, never replace it.
state.clear();state.set('family',JSON.stringify(family));state.set('classroom-workflows',JSON.stringify(full));
const beforeRaceFamily=state.get('family');writes.length=0;injectFirstErasure='alice';erasureInjected=false;
await assert.rejects(restoreContents(JSON.stringify(complete),{courses:[],banks:[]}),{message:erasedIdentityMessage});
assert(erasureInjected,'exercise a deletion between the restore read and CAS');
assert.deepEqual(JSON.parse(state.get('classroom-submissions')!).deletedStudentIds,['alice']);
assert.equal(state.get('family'),beforeRaceFamily,'restore stops before installing imported Family');
assert(!writes.includes('classroom-submissions'),'failed CAS must not replace the first marker');
assert(!writes.includes('classroom-workflows'),'restore stops before republishing/restoring collaboration');
assert(!writes.includes('family'));
// A concurrently erased unrelated identity remains erased through a successful
// legacy restore. Legacy empty evidence is represented by an empty CAS ledger.
state.clear();writes.length=0;injectFirstErasure='unrelated';erasureInjected=false;
await restoreContents(JSON.stringify(legacy),{courses:[],banks:[]});
assert(erasureInjected);
assert.deepEqual(JSON.parse(state.get('classroom-submissions')!).deletedStudentIds,['unrelated']);
assert(parseClassroomWorkflowState(state.get('classroom-workflows')!).deletedStudentIds.includes('unrelated'));
console.log('Classroom restore race: first concurrent tombstone survives CAS; erased learner restore stops, unrelated legacy erasure preserved');
