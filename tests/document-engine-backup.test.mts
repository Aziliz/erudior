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
const {createClassroomSubmissionStore}=await import('../src/lib/classroomSubmissionStore.ts');
const {stateTransactions}=await import('../src/lib/stateLock.ts');
const family={format:'erudior-family',version:1,students:[{id:'alice',name:'Alice'},{id:'bob',name:'Bob'}]};
state.set('family',JSON.stringify(family));
const {emptyDocumentTemplate,parseDocumentLibrary}=await import('../src/lib/documentEngine.ts');
const {createDocumentEngineStore,deleteDocumentStudent}=await import('../src/lib/documentEngineStore.ts');
const tx=stateTransactions({read:async name=>state.get(name)??null,write:async(name,value)=>{value===null?state.delete(name):state.set(name,value);}});
const engine=createDocumentEngineStore({read:async()=>state.get('document-engine')??null,update:fn=>tx.update('document-engine',fn),authorizeAdult:async()=>({actorId:'adult',actorName:'Teacher',authorityKey:'session'}),learnerContext:async()=>({studentId:'alice',authorityKey:'alice'}),now:()=> '2026-10-29T00:00:00Z'});
await engine.supervisor.saveTemplate(emptyDocumentTemplate('source'),null);
const template=await engine.supervisor.approveTemplate('source',1);
await engine.supervisor.assign({id:'case',studentId:'alice',title:'Case',instructions:'Educational exercise',documents:[template]},null);
await engine.learner.submit('case',1,{values:{},annotations:[{id:'note',documentId:'source',pageId:'page1',note:'Private learner note',anchor:{x:0,y:0,width:0.5,height:0.5}}]},'submission',null);
await engine.supervisor.saveTemplate({...template,title:'Newer unapproved revision'},1);
await engine.supervisor.review({id:'review',submissionId:'submission',status:'reviewed',note:'Instructor feedback'});
const ledger=parseDocumentLibrary(state.get('document-engine'));
const snapshot=await collect([],[]);assert.deepEqual(snapshot.documentEngine,ledger);
const encrypted=await encryptText(JSON.stringify(snapshot),'backup test passphrase');assert(!encrypted.includes('Private learner note'));
state.delete('document-engine');await restoreContents(await decryptText(JSON.parse(encrypted),'backup test passphrase'),{courses:[],banks:[]});const restored=parseDocumentLibrary(state.get('document-engine'));assert(restored.restoredAt);assert.deepEqual(restored.pendingApproval,['source@1','source@2']);assert.deepEqual(restored.submissions,ledger.submissions);assert.deepEqual(restored.feedback,ledger.feedback);
await assert.rejects(engine.supervisor.assign({id:'newcase',studentId:'alice',title:'New',instructions:'Exercise',documents:[template]},null),/approved/);
await assert.rejects(engine.learner.submit('case',1,{values:{},annotations:[]},'newsubmission',null),/fresh adult review/);
await engine.supervisor.approveTemplate('source',1);
assert.deepEqual(parseDocumentLibrary(state.get('document-engine')).pendingApproval,['source@2'],'old assigned source can be explicitly re-reviewed without rewriting it or approving a newer revision');
await engine.supervisor.assign({id:'newcase',studentId:'alice',title:'New',instructions:'Exercise',documents:[template]},null);
// Even fabricated external approval/feedback and a cleared quarantine list are not authority.
const forged=structuredClone(ledger);for(const t of [forged.templates[0],forged.assignments[0].documents[0],forged.submissions[0].assignment.documents[0]])t.approval!.actor='External authority';forged.feedback[0].actor='Fabricated reviewer';forged.pendingApproval=[];
await restoreContents(JSON.stringify({...snapshot,documentEngine:forged}),{courses:[],banks:[]});
const quarantined=parseDocumentLibrary(state.get('document-engine'));assert.deepEqual(quarantined.pendingApproval,['source@1','source@2']);assert.equal(quarantined.feedback[0].actor,'Fabricated reviewer','history is retained, not asserted authentic');assert(quarantined.restoredAt);
await assert.rejects(engine.supervisor.assign({id:'forgedcase',studentId:'alice',title:'New',instructions:'Exercise',documents:[forged.templates[0]]},null),/approved/);
const before=[...state];mutations.length=0;
const foreign=structuredClone(ledger);foreign.assignments[0].studentId='outsider';foreign.submissions[0].studentId='outsider';foreign.submissions[0].assignment.studentId='outsider';
const corrupt=structuredClone(ledger);corrupt.submissions[0].response.annotations[0].anchor!.width=2;
for(const malformed of [null,foreign,corrupt,{...ledger,templates:[]}]){
 await assert.rejects(restoreContents(JSON.stringify({...snapshot,documentEngine:malformed}),{courses:[],banks:[]}));assert.deepEqual([...state],before);assert.deepEqual(mutations,[],'document validation precedes destructive restore');
}
state.set('document-engine','{damaged');await assert.rejects(collect([],[]));state.set('document-engine',JSON.stringify(ledger));
const {documentEngine:_,...legacy}=snapshot;await restoreContents(JSON.stringify(legacy),{courses:[],banks:[]});assert(!state.has('document-engine'),'legacy backup clears unrelated private history');
state.set('document-engine',JSON.stringify(ledger));
const store=createClassroomSubmissionStore({readState:async name=>state.get(name)??null,writeState:tx.save,updateState:tx.update,readFamily:async()=>JSON.parse(state.get('family')!),writeFamily:async value=>tx.save('family',JSON.stringify(value)),readFile:async()=>null,writeFile:async()=>{},now:()=> '2026-10-29T00:00:00Z'});
await store.deleteStudent('alice',family as any);
const removed=parseDocumentLibrary(state.get('document-engine'));assert.deepEqual(removed.deletedStudentIds,['alice']);assert.equal(removed.assignments.length,0);assert.equal(removed.submissions.length,0);assert.equal(removed.feedback.length,0);assert(!state.get('document-engine')!.includes('Private learner note'));
assert.deepEqual(deleteDocumentStudent(removed,'alice'),removed,'repeated cleanup remains idempotent');
console.log('document backup: encrypted exact evidence recovery, malformed/foreign learner preflight, legacy clearing and full-profile privacy deletion passed');
