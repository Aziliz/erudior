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
const {stateTransactions}=await import('../src/lib/stateLock.ts');
const {parseTransactionLibrary}=await import('../src/lib/transactionEngine.ts');
const {emptyDocumentTemplate}=await import('../src/lib/documentEngine.ts');
const {createTransactionEngineStore,deleteTransactionStudent}=await import('../src/lib/transactionEngineStore.ts');
const family={format:'erudior-family',version:1,students:[{id:'alice',name:'Alice'},{id:'bob',name:'Bob'}]};
state.set('family',JSON.stringify(family));
const pack:any={format:'erudior-transaction-pack',version:1,id:'pack',revision:0,title:'Fictional transaction',jurisdiction:{id:'synthetic',name:'Synthetic test rules',version:'test',sourceNote:'Fictional test only',effectiveFrom:'2026-01-01',effectiveThrough:'2027-12-31'},currency:'USD',minorUnitDigits:2,documents:[{...emptyDocumentTemplate('source'),revision:1}],formRoles:[{documentId:'source',role:'Educational agreement'}],clients:[{id:'buyer',name:'Fictional buyer'}],contingencies:[],rules:{requireRepresentation:true,requireDocumentsForClose:true,requireReconciliationForClose:true,requireZeroTrustForArchive:true,minEarnestBasisPoints:0,depositDueDays:7}};
const tx=stateTransactions({read:async name=>state.get(name)??null,write:async(name,value)=>{value===null?state.delete(name):state.set(name,value);}});
const engine=createTransactionEngineStore({read:async()=>state.get('transaction-engine')??null,update:change=>tx.update('transaction-engine',change),authorizeAdult:async()=>({actorId:'adult',actorName:'Teacher',authorityKey:'session'}),learnerContext:async()=>({studentId:'alice',authorityKey:'alice'}),now:()=> '2026-10-29T00:00:00Z'});
await engine.supervisor.savePack(pack,null);
const approved=await engine.supervisor.approvePack('pack',1);
const assignment={id:'case',studentId:'alice',title:'Fictional case',instructions:'Private educational practice',startDate:'2026-10-29',pack:approved};
await engine.supervisor.assign(assignment,null);
await engine.learner.saveDocuments('case',1,{values:{},annotations:[{id:'note',documentId:'source',pageId:'page1',note:'Private response',quote:{start:0,end:5,text:'Enter'}}]},null);
await engine.learner.command('case',1,{kind:'stage',stage:'representation',note:'Private simulated decision'},'event',1);
await engine.learner.submit('case',1,'evidence',2);
await engine.supervisor.review({id:'feedback',submissionId:'evidence',status:'reviewed',note:'Private adult feedback'});
await engine.supervisor.savePack({...approved,title:'Newer unapproved rules'},1);
const library=parseTransactionLibrary(state.get('transaction-engine'));
const snapshot=await collect([],[]);assert.deepEqual(snapshot.transactionEngine,library);
const encrypted=await encryptText(JSON.stringify(snapshot),'transaction backup test phrase');assert(!encrypted.includes('Private response'));
state.delete('transaction-engine');await restoreContents(await decryptText(JSON.parse(encrypted),'transaction backup test phrase'),{courses:[],banks:[]});
let restored=parseTransactionLibrary(state.get('transaction-engine'));
assert(restored.restoredAt);assert.deepEqual(restored.pendingApproval,['pack@1','pack@2']);assert.deepEqual(restored.submissions,library.submissions);assert.deepEqual(restored.feedback,library.feedback);
await assert.rejects(engine.supervisor.assign({...assignment,id:'newcase'},null),/approved/);
await assert.rejects(engine.learner.command('case',1,{kind:'stage',stage:'pricing',note:'New'},'blocked',2),/fresh adult review/);
await engine.supervisor.approvePack('pack',1);
restored=parseTransactionLibrary(state.get('transaction-engine'));assert.deepEqual(restored.pendingApproval,['pack@2'],'old assigned exact pack can be re-reviewed while newer revision stays quarantined');
await engine.supervisor.assign({...assignment,id:'newcase'},null);
const forged=structuredClone(library);for(const value of [forged.packs[0],forged.assignments[0].pack,forged.submissions[0].assignment.pack])value.approval.actor='External claimed authority';forged.feedback[0].actor='Fabricated reviewer';forged.pendingApproval=[];
await restoreContents(JSON.stringify({...snapshot,transactionEngine:forged}),{courses:[],banks:[]});
restored=parseTransactionLibrary(state.get('transaction-engine'));assert.deepEqual(restored.pendingApproval,['pack@1','pack@2']);assert.equal(restored.feedback[0].actor,'Fabricated reviewer','retained history is not authenticated authority');
await assert.rejects(engine.supervisor.assign({...assignment,id:'forged',pack:forged.packs[0]},null),/approved/);
const before=[...state];mutations.length=0;
const foreign=structuredClone(library);foreign.assignments[0].studentId='outsider';foreign.submissions[0].studentId='outsider';foreign.submissions[0].assignment.studentId='outsider';
const corrupt=structuredClone(library);corrupt.sessions[0].events[0].command.stage='unsupported';
for(const malformed of [null,foreign,corrupt,{...library,packs:[]}]){
  await assert.rejects(restoreContents(JSON.stringify({...snapshot,transactionEngine:malformed}),{courses:[],banks:[]}));
  assert.deepEqual([...state],before);assert.deepEqual(mutations,[],'all transaction validation precedes destructive restore');
}
state.set('transaction-engine','{broken');await assert.rejects(collect([],[]));state.set('transaction-engine',JSON.stringify(library));
const {transactionEngine:_,...legacy}=snapshot;await restoreContents(JSON.stringify(legacy),{courses:[],banks:[]});assert(!state.has('transaction-engine'),'legacy restore clears unrelated private state');
state.set('transaction-engine',JSON.stringify(library));
const classroom=createClassroomSubmissionStore({readState:async name=>state.get(name)??null,writeState:tx.save,updateState:tx.update,readFamily:async()=>JSON.parse(state.get('family')!),writeFamily:async value=>tx.save('family',JSON.stringify(value)),readFile:async()=>null,writeFile:async()=>{},now:()=> '2026-10-29T00:00:00Z'});
await classroom.deleteStudent('alice',family as any);
const removed=parseTransactionLibrary(state.get('transaction-engine'));assert.deepEqual(removed.deletedStudentIds,['alice']);assert.equal(removed.assignments.length,0);assert.equal(removed.sessions.length,0);assert.equal(removed.submissions.length,0);assert.equal(removed.feedback.length,0);assert(!state.get('transaction-engine')!.includes('Private response'));assert.deepEqual(deleteTransactionStudent(removed,'alice'),removed);
console.log('Transaction backup: encrypted exact history, forged-approval quarantine, old-pack re-review, preflight isolation and profile cleanup passed');
