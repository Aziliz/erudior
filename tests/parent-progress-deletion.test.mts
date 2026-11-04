import assert from 'node:assert/strict';
const state=new Map<string,string>();let beforeCas:()=>void=()=>{};
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
 if(command==='load_state')return state.get(args.name)??null;
 if(command==='compare_and_swap_state'){const hook=beforeCas;beforeCas=()=>{};hook();if((state.get(args.name)??null)!==args.expected)return false;state.set(args.name,args.content);return true;}
 if(command==='save_state'){args.content===null?state.delete(args.name):state.set(args.name,args.content);return;}
 throw Error('Unexpected '+command);
}}};
const store=await import('../src/lib/storage.ts');
function reset(){state.clear();state.set('family',JSON.stringify({students:[{id:'alice'},{id:'bob'}]}));store.useStudentFiles('alice');}
const guard=async()=>{if(!await store.competencyProfileExists('alice'))throw Error('Alice deleted');};
reset();
const bob=JSON.stringify({...store.emptyProgress(),enrolled:['bob-course']});state.set('progress-bob',bob);
beforeCas=()=>{state.set('classroom-submissions',JSON.stringify({deletedStudentIds:['alice']}));state.set('family',JSON.stringify({students:[{id:'bob'}]}));state.delete('progress-alice');store.useStudentFiles('bob');};
await assert.rejects(store.saveProgress({...store.emptyProgress(),enrolled:['alice-private']},{guard}),/deleted/);
assert.equal(state.has('progress-alice'),false,'null-CAS race cannot recreate erased learner data');assert.equal(state.get('progress-bob'),bob,'cleanup never follows the switched active profile');
reset();state.set('progress-alice',JSON.stringify(store.emptyProgress()));
beforeCas=()=>{state.set('classroom-submissions',JSON.stringify({deletedStudentIds:['alice']}));state.set('family',JSON.stringify({students:[{id:'bob'}]}));state.delete('progress-alice');};
await assert.rejects(store.saveProgress({...store.emptyProgress(),enrolled:['alice-private']},{guard}),/deleted/);assert.equal(state.has('progress-alice'),false,'existing-file deletion rejects retry');
reset();state.set('progress-bob',bob);
await store.saveProgress({...store.emptyProgress(),enrolled:['alice-course']},{guard});
assert.deepEqual(JSON.parse(state.get('progress-alice')!).enrolled,['alice-course']);assert.equal(state.get('progress-bob'),bob);
// Mere switching is not deletion: a completed authorized write remains at its captured ID.
reset();beforeCas=()=>store.useStudentFiles('bob');await store.saveProgress({...store.emptyProgress(),enrolled:['alice-course']},{guard});assert.equal(state.has('progress-alice'),true);assert.equal(state.has('progress-bob'),false);
console.log('Progress post-CAS lifecycle: absent-file erase race cleans only captured profile; retry deletion, live save and nondeleted switch preserve proper data.');
