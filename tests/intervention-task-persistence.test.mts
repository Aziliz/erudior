import assert from 'node:assert/strict';
const state=new Map<string,string>();
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
 if(command==='load_state')return state.get(args.name)??null;
 if(command==='compare_and_swap_state'){if((state.get(args.name)??null)!==args.expected)return false;state.set(args.name,args.content);return true;}
 if(command==='save_state'){args.content===null?state.delete(args.name):state.set(args.name,args.content);return;}
 throw Error('Unexpected command '+command);
}}};
const store=await import('../src/lib/storage.ts');
const task={format:'erudior-intervention-task' as const,version:1 as const,id:'task',skillId:'math.place-value',goal:'Goal',instructions:'Instructions',issuedAt:'2026-10-29T00:00:00Z',activities:[{kind:'lesson' as const,courseId:'math-prealgebra',title:'Place value',sourceFingerprint:'a'.repeat(64),lessonId:'pre-place-value'}]};
const stale=store.emptyProgress();await store.saveProgress(stale);
await store.updateProfileProgress(null,current=>({...current,interventionTasks:[task]}));
await store.saveProgress({...stale,seeded:true});assert.deepEqual((await store.loadBaseProgress()).interventionTasks,[task],'ordinary stale progress save cannot erase imported support tasks');
await store.saveProgress(stale,{replaceInterventionTasks:true});assert.equal((await store.loadBaseProgress()).interventionTasks,undefined,'explicit full restore can replace imported tasks');
await assert.rejects(store.restoreBackup({format:'erudior-backup',version:1,progress:{...stale,interventionTasks:[{...task,actorId:'fake-adult'}]},courses:[],banks:[]},{courses:[],banks:[]}),/Invalid/);
console.log('Support task stale-progress preservation and explicit restore replacement passed.');
