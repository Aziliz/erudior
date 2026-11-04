import assert from 'node:assert/strict';
// The real storage facade and its real local-session singleton, with only native
// command IO replaced. Synthetic hash strings are not usable credentials.
const state = new Map<string,string>(), writes: string[] = [];
(globalThis as any).isTauri = true;
(globalThis as any).window = {__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
  if(command==='load_state')return state.get(args.name)??null;
  if(command==='compare_and_swap_state') {
    if((state.get(args.name)??null)!==args.expected)return false;
    state.set(args.name,args.content);writes.push(args.name);return true;
  }
  if(command==='save_state') {
    if(args.content===null)state.delete(args.name);else state.set(args.name,args.content);
    writes.push(args.name);return;
  }
  throw Error('Unexpected command '+command);
}}};
const store=await import('../src/lib/storage.ts');
const session=await import('../src/lib/localSession.ts');
const parent={password:{salt:'synthetic',hash:'password-one',iterations:1},recovery:{salt:'synthetic',hash:'recovery-one',iterations:1}};
const family={format:'erudior-family',version:1,parent,students:[{id:'alice',name:'Synthetic Alice',grade:4,assigned:[],freeChoice:true}],reminders:[],done:[]};
const persist=(nextParent:any)=>state.set('family',JSON.stringify({...family,parent:nextParent}));
const update=()=>store.updateProfileProgress('alice',current=>({...current,lessonsDone:{...current.lessonsDone,'synthetic/one':'2026-10-31'}}));
persist(parent);store.useStudentFiles('alice');session.configureLocalSession(true);session.unlockLocalLearner('alice');
async function rejectsBoth(reason:RegExp) {
  const before=[...state],count=writes.length;
  await assert.rejects(update(),reason);
  await assert.rejects(store.saveState('session-alice','synthetic session'),reason);
  assert.equal(writes.length,count,'rejected credential writes never reach native IO');
  assert.deepEqual([...state],before,'rejected writes preserve all saved state');
}
await rejectsBoth(/credentials changed/i); // Missing binding fails closed.
session.bindLocalSessionCredential(parent);
await update();assert.equal(writes.length,1);
await store.saveState('session-alice','authorized synthetic session');assert.equal(writes.length,2);
for(const changed of [
  {...parent,pin:{salt:'synthetic',hash:'new-pin',iterations:1}},
  {...parent,password:{...parent.password,hash:'new-password'}},
  {...parent,recovery:{...parent.recovery,hash:'new-recovery'}},
]) {
  persist(changed);await rejectsBoth(/credentials changed/i);
  // A fresh authenticated session may bind the newly read credential set.
  session.bindLocalSessionCredential(changed);session.unlockLocalLearner('alice');await update();
  session.bindLocalSessionCredential(parent);session.unlockLocalLearner('alice');persist(parent);
}
persist({...parent,failures:4,lockedUntil:123456});
await update();await store.saveState('session-alice','counter-only change is not a credential rotation');
// A mutation waiting in its real updater cannot borrow a later same-learner grant.
let reached!:()=>void,release!:()=>void;
const started=new Promise<void>(resolve=>{reached=resolve;}),wait=new Promise<void>(resolve=>{release=resolve;});
const pending=store.updateProfileProgress('alice',async current=>{reached();await wait;return {...current,lessonsDone:{...current.lessonsDone,'synthetic/stale':'2026-10-31'}};});
await started;const before=[...state],count=writes.length;
session.lockLocalSession();session.unlockLocalLearner('alice');release();
await assert.rejects(pending,/session|locked/i);assert.equal(writes.length,count);assert.deepEqual([...state],before);
// Re-read persisted credentials after awaiting caller work, not only at invocation.
let rotate!:()=>void,atUpdater!:()=>void;
const ready=new Promise<void>(resolve=>{atUpdater=resolve;}),hold=new Promise<void>(resolve=>{rotate=resolve;});
const racing=store.updateProfileProgress('alice',async current=>{atUpdater();await hold;return current;});
await ready;persist({...parent,pin:{salt:'synthetic',hash:'other-view-pin',iterations:1}});const saved=[...state];rotate();
await assert.rejects(racing,/credentials changed/i);assert.equal(writes.length,count);assert.deepEqual([...state],saved);
session.configureLocalSession(false);
console.log('Real storage credential binding: missing binding, external PIN/password/recovery rotation, counters-only change, fresh rebind and awaited stale-session/credential races passed');
