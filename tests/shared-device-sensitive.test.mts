import assert from 'node:assert/strict';
import { configureLocalSession, unlockLocalAdult, unlockLocalLearner, lockLocalSession } from '../src/lib/localSession.ts';
const data = new Map<string,string>(), writes: string[] = [];
let afterWrite: (()=>void) | undefined;
(globalThis as any).isTauri = true;
(globalThis as any).window = {__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
  if(command==='load_state')return data.get(args.name)??null;
  if(command==='save_state'||command==='compare_and_swap_state') {
    if(command==='compare_and_swap_state' && (data.get(args.name)??null)!==args.expected)return false;
    writes.push(args.name); if(args.content===null)data.delete(args.name);else data.set(args.name,args.content);
    afterWrite?.(); return command==='compare_and_swap_state'?true:undefined;
  }
  if(command==='delete_item'){writes.push('delete:'+args.id);afterWrite?.();return;}
  throw Error('Unexpected command '+command);
}}};
const {restoreContents,exportEncrypted}=await import('../src/lib/backup.ts');
const {emptyProgress}=await import('../src/lib/storage.ts');
const backup=JSON.stringify({format:'examiner-family-backup',version:1,students:{},family:null,courses:[],banks:[],progress:emptyProgress()});
configureLocalSession(true);
for (const role of ['locked','learner']) {
  if(role==='learner')unlockLocalLearner('synthetic');
  await assert.rejects(restoreContents(backup,{courses:[],banks:[]}),/session|adult/i);
  await assert.rejects(exportEncrypted([],[],'Synthetic passphrase'),/session|adult/i);
  assert.deepEqual(writes,[]);
}
unlockLocalAdult();
await assert.rejects(restoreContents(backup,{courses:[],banks:[]},()=>{throw Error('revoked test authority');}),/revoked/);
assert.deepEqual(writes,[]);
// A lock during a multi-file restore stops later writes, and no old grant revives.
unlockLocalAdult(); afterWrite=()=>{lockLocalSession();unlockLocalAdult();};
await assert.rejects(restoreContents(backup,{courses:[{id:'synthetic-old'} as any],banks:[]}),/session|locked/i);
assert.deepEqual(writes,['delete:synthetic-old']);
afterWrite=undefined; configureLocalSession(false);
console.log('shared-device sensitive recovery: locked/learner denial, explicit guard rejection and lock/reauth interruption passed');
const {createClassroomSubmissionStore}=await import('../src/lib/classroomSubmissionStore.ts');
const {stateTransactions}=await import('../src/lib/stateLock.ts');
const family={format:'erudior-family',version:1,students:[{id:'alice',name:'Synthetic Alice'},{id:'bob',name:'Synthetic Bob'}]} as any;
let resume!:()=>void, reached!:()=>void;
const waiting=new Promise<void>(resolve=>{resume=resolve;}), started=new Promise<void>(resolve=>{reached=resolve;});
const removed:string[]=[];
const tx=stateTransactions({read:async()=>null,write:async name=>{removed.push(name);}});
const deletion=createClassroomSubmissionStore({readState:async()=>null,writeState:tx.save,updateState:tx.update,
  readFamily:async()=>{reached();await waiting;return family;},writeFamily:async()=>{},readFile:async()=>null,writeFile:async()=>{},now:()=>new Date().toISOString()});
configureLocalSession(true);unlockLocalAdult();
const pending=deletion.deleteStudent('alice',family);
await started;lockLocalSession();unlockLocalAdult();resume();
await assert.rejects(pending,/session|locked/i);
assert.deepEqual(removed,[],'old deletion must not borrow newly authenticated adult session');
unlockLocalLearner('alice');
await assert.rejects(deletion.deleteStudent('bob',family),/adult/i);
assert.deepEqual(removed,[]);
configureLocalSession(false);
console.log('shared-device deletion: stale queued auth and learner attempt rejected before tombstone/data writes');
