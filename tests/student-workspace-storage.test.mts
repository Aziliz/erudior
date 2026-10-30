import assert from "node:assert/strict";
import type { Course } from "../src/lib/types";
// Exercise the production profile and backup boundaries with isolated synthetic state.
const state = new Map<string, string>();
const writes: string[] = [];
let beforeCas: (() => void) | undefined;
(globalThis as any).isTauri = true;
(globalThis as any).window = { __TAURI_INTERNALS__: { invoke: async (command: string, args: any) => {
  if (command === "load_state") return state.get(args.name) ?? null;
  if (command === "compare_and_swap_state") {
    const hook=beforeCas;beforeCas=undefined;hook?.();
    if ((state.get(args.name) ?? null) !== args.expected) return false;
    state.set(args.name, args.content); writes.push(args.name); return true;
  }
  if (command === "save_state") {
    if (args.content === null) state.delete(args.name); else state.set(args.name, args.content);
    writes.push(args.name); return;
  }
  if (command === "delete_item") { writes.push("delete:" + args.id); return; }
  throw new Error("Unexpected storage command " + command);
} } };

const store=await import('../src/lib/storage');
const {parseStudentWorkspace,upsertWorkspaceEntry}=await import('../src/lib/studentWorkspace');
const {parseAnonymousProgress,captureAnonymousRecovery,parseAnonymousRecovery,recoveryProgress}=await import('../src/lib/anonymousPrivacy');
const {collect,restoreContents,encryptText,decryptText}=await import('../src/lib/backup');
const entry={id:'note-1',kind:'note' as const,title:'Synthetic notes',body:'Private text',status:'active' as const,createdAt:'2026-10-30T10:00:00.000Z',updatedAt:'2026-10-30T10:00:00.000Z'};
const workspace={version:1 as const,entries:[entry]};
state.set('family',JSON.stringify({format:'erudior-family',version:1,students:[{id:'alice',name:'Learner A',grade:7,assigned:[],freeChoice:true},{id:'bob',name:'Learner B',grade:8,assigned:[],freeChoice:true}]}));
store.useStudentFiles('alice');
await store.updateProfileProgress('alice',current=>({...current,studentWorkspace:workspace}));
store.useStudentFiles('bob');assert.equal((await store.loadProgress()).studentWorkspace,undefined);
const original=JSON.stringify(entry);
await Promise.all(['one','two'].map(id=>store.updateProfileProgress('alice',current=>({...current,studentWorkspace:upsertWorkspaceEntry(current.studentWorkspace,{...entry,id},null)}))));
assert.deepEqual((await store.loadProfileProgress('alice')).studentWorkspace?.entries.map(x=>x.id).sort(),['note-1','one','two']);
const attempts=await Promise.allSettled(['A','B'].map(title=>store.updateProfileProgress('alice',current=>({...current,studentWorkspace:upsertWorkspaceEntry(current.studentWorkspace,{...entry,title},original)}))));
assert.equal(attempts.filter(x=>x.status==='fulfilled').length,1,'concurrent same-entry edits cannot silently overwrite');
let release!:()=>void;const wait=new Promise<void>(resolve=>release=resolve);
const pending=store.updateProfileProgress('alice',async current=>{await wait;return {...current,studentWorkspace:workspace};});
store.useStudentFiles('bob');release();await pending;assert.equal((await store.loadProgress()).studentWorkspace,undefined);
store.useStudentFiles(null);
const stale=store.emptyProgress();await store.saveProgress(stale);
await store.updateProfileProgress(null,current=>({...current,studentWorkspace:workspace}));
await store.saveProgress(stale);assert.deepEqual((await store.loadBaseProgress()).studentWorkspace,workspace,'ordinary stale activity preserves private workspace');
await store.saveProgress(stale,{replaceStudentWorkspace:true});assert.equal((await store.loadBaseProgress()).studentWorkspace,undefined);
await store.saveProgress({...stale,studentWorkspace:workspace});assert.equal((await store.loadBaseProgress()).studentWorkspace,undefined,'stale activity cannot resurrect removed workspace');
const archived={...stale,studentWorkspace:workspace};
assert.deepEqual(parseAnonymousProgress(archived).studentWorkspace,workspace);
const recovery=await captureAnonymousRecovery(archived,null,{},[],[],'2026-10-30T10:00:00Z');
assert.deepEqual(parseAnonymousRecovery(JSON.stringify(recovery)).progress.studentWorkspace,workspace);
assert.deepEqual(recoveryProgress(recovery,stale).studentWorkspace,workspace);
const plain={format:'erudior-backup',version:1,progress:archived,courses:[],banks:[]};
await store.restoreBackup(plain,{courses:[],banks:[]});assert.deepEqual((await store.loadBaseProgress()).studentWorkspace,workspace);
for(const malformed of [null,{version:1,entries:[{...entry,grade:100}]},{version:1,entries:[{...entry,body:'x'.repeat(20001)}]}]){
 const before=[...state];writes.length=0;
 await assert.rejects(store.restoreBackup({...plain,progress:{...archived,studentWorkspace:malformed}},{courses:[{id:'never-delete'} as Course],banks:[]}),/Invalid student workspace/);
 assert.deepEqual([...state],before);assert.deepEqual(writes,[]);
 assert.throws(()=>parseAnonymousProgress({...archived,studentWorkspace:malformed}),/Invalid student workspace/);
}
const family=await collect([],[]),encrypted=await encryptText(JSON.stringify(family),'synthetic workspace recovery passphrase');
state.delete('progress-alice');await restoreContents(await decryptText(JSON.parse(encrypted),'synthetic workspace recovery passphrase'),{courses:[],banks:[]});
assert.deepEqual((await store.loadProfileProgress('alice')).studentWorkspace,workspace);
assert.equal((await store.loadProfileProgress('bob')).studentWorkspace,undefined);
const before=[...state];writes.length=0;
await assert.rejects(restoreContents(JSON.stringify({...family,students:{...family.students,alice:{...family.students.alice,progress:{...family.students.alice.progress,studentWorkspace:{version:1,entries:[{...entry,grade:99}]}}}}}),{courses:[{id:'never-delete'} as Course],banks:[]}),/Invalid student workspace/);
assert.deepEqual([...state],before);assert.deepEqual(writes,[],'encrypted restore preflights before any mutations');
await restoreContents(JSON.stringify({...family,progress:stale}),{courses:[],banks:[]});assert.equal((await store.loadBaseProgress()).studentWorkspace,undefined);
await store.restoreBackup({...plain,progress:stale},{courses:[],banks:[]});assert.equal((await store.loadBaseProgress()).studentWorkspace,undefined);
const invalid={version:1,entries:[{...entry,status:'awarded'}]};
state.set('progress-bob',JSON.stringify({...stale,studentWorkspace:invalid}));
await assert.rejects(store.loadProfileProgress('bob'),/Invalid student workspace/);state.delete('progress-bob');
const beforeInvalid=[...state];writes.length=0;
await assert.rejects(store.updateProfileProgress('bob',current=>({...current,studentWorkspace:invalid as any})),/Invalid student workspace/);
await assert.rejects(store.saveProgress({...stale,studentWorkspace:invalid as any}),/Invalid student workspace/);
await assert.rejects(store.exportBackup([],[],{...stale,studentWorkspace:invalid as any}),/Invalid student workspace/);
assert.deepEqual([...state],beforeInvalid);assert.deepEqual(writes,[]);
const authoritative={...stale,studentWorkspace:workspace,spreadsheetGrades:{'course/task':{score:80,gradedAt:'2026-10-30',revision:1}},lessonsDone:{'course/lesson':'2026-10-30'}};
await store.updateProfileProgress('alice',()=>authoritative);
await store.updateProfileProgress('alice',current=>({...current,studentWorkspace:upsertWorkspaceEntry(current.studentWorkspace,{...entry,status:'done'},JSON.stringify(entry))}));
const afterTask=await store.loadProfileProgress('alice');
assert.deepEqual(afterTask.spreadsheetGrades,authoritative.spreadsheetGrades);assert.deepEqual(afterTask.lessonsDone,authoritative.lessonsDone);
assert.deepEqual(JSON.parse(state.get('family')!).students[0].assigned,[],'self-directed completion never assigns parent work');
// Deleting an empty learner between validation and null-CAS must not resurrect private notes.
state.delete('progress-alice');
state.set('progress-bob',JSON.stringify({...stale,studentWorkspace:workspace}));
const bobBefore=state.get('progress-bob');
beforeCas=()=>{
 state.set('classroom-submissions',JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:['alice']}));
 state.delete('progress-alice');
 const family=JSON.parse(state.get('family')!);family.students=family.students.filter((s:any)=>s.id!=='alice');state.set('family',JSON.stringify(family));
};
await assert.rejects(store.updateStudentWorkspaceProfile('alice',current=>upsertWorkspaceEntry(current,entry,null)),/deleted during the workspace save/);
assert.equal(state.has('progress-alice'),false,'post-CAS cleanup removes null-CAS resurrection');
assert.equal(state.get('progress-bob'),bobBefore,'cleanup never touches another learner');
await assert.rejects(store.updateStudentWorkspaceProfile('alice',()=>workspace),/deleted/);
assert.equal(state.has('progress-alice'),false);
let guardCalls=0;
await assert.rejects(store.updateStudentWorkspaceProfile('bob',()=>workspace,()=>{if(++guardCalls===2)throw Error('selection changed');}),/selection changed/);
assert.equal(state.get('progress-bob'),bobBefore,'selection changed during existence await aborts before write');
guardCalls=0;
await assert.rejects(store.updateStudentWorkspaceProfile('bob',()=>({version:1,entries:[]}),()=>{if(++guardCalls===5)throw Error('late selection changed');}),/late selection changed/);
assert.deepEqual((await store.loadProfileProgress('bob')).studentWorkspace,{version:1,entries:[]},'late UI selection rejection must not delete a valid learner');
const anonymousBefore=state.get('progress');
let sawCurrent=false;
const capturedGeneration=(JSON.parse(anonymousBefore??'{}').anonymousGeneration??0)+1;
await assert.rejects(store.updateStudentWorkspaceProfile(null,()=>workspace,current=>{if(current){sawCurrent=true;if((current.anonymousGeneration??0)!==capturedGeneration)throw Error('captured anonymous generation changed');}}),/captured anonymous generation changed/);
assert(sawCurrent,'generation guard receives the current CAS progress');assert.equal(state.get('progress'),anonymousBefore);
console.log('Student workspace storage: learner scope, CAS concurrency, stale saves, plain/encrypted/anonymous recovery and malformed archive preflight passed.');
