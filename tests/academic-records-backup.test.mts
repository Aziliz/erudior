import assert from 'node:assert/strict';
const state=new Map<string,string>(),writes:string[]=[];
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
 if(command==='load_state')return state.get(args.name)??null;
 if(command==='save_state'){writes.push(args.name);args.content===null?state.delete(args.name):state.set(args.name,args.content);return;}
 if(command==='compare_and_swap_state'){if((state.get(args.name)??null)!==args.expected)return false;writes.push(args.name);state.set(args.name,args.content);return true;}
 throw Error('Unexpected '+command);
}}};
const {emptyRecords,saveRecords,loadRecords}=await import('../src/lib/records.ts');
const {collect,restoreContents,encryptText,decryptText}=await import('../src/lib/backup.ts');
state.set('family',JSON.stringify({format:'erudior-family',version:1,students:[{id:'alice',name:'Synthetic learner',assigned:[]}]}));
await saveRecords('alice',{...emptyRecords(),days:{'2026-10-30':'present'}});
const snapshot=await collect([],[]),encrypted=await encryptText(JSON.stringify(snapshot),'synthetic records test passphrase');
state.delete('records-alice');await restoreContents(await decryptText(JSON.parse(encrypted),'synthetic records test passphrase'),{courses:[],banks:[]});
const restored=await loadRecords('alice');assert.equal(restored.days['2026-10-30'],'present');assert.equal(restored.audit?.[0].origin,'imported');assert(restored.restoredAt);
const revision=restored.revision!;await restoreContents(JSON.stringify(snapshot),{courses:[],banks:[]});assert((await loadRecords('alice')).revision!>revision);
const before=[...state];writes.length=0;
await assert.rejects(restoreContents(JSON.stringify({...snapshot,students:{...snapshot.students,alice:{...snapshot.students.alice,records:{...emptyRecords(),manual:'broken'}}}}),{courses:[],banks:[]}),/quarantined/);assert.deepEqual([...state],before);assert.deepEqual(writes,[]);
state.set('classroom-submissions',JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:['alice']}));writes.length=0;await assert.rejects(restoreContents(JSON.stringify(snapshot),{courses:[],banks:[]}),/deleted learner/);assert.deepEqual(writes,[]);
state.set('classroom-submissions',JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:['erased']}));await restoreContents(JSON.stringify(snapshot),{courses:[],banks:[]});assert.deepEqual(JSON.parse(state.get('classroom-submissions')!).deletedStudentIds,['erased']);
console.log('Academic records backup: encrypted/plain import provenance, editor revision invalidation, zero-write malformed preflight, erased-ID refusal and monotonic tombstones passed.');
