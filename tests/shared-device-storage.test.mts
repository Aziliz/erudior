import assert from 'node:assert/strict';
import { stateTransactions, withStateLock } from '../src/lib/stateLock.ts';
import { configureLocalSession, unlockLocalAdult, lockLocalSession, captureLocalSession,
  bindLocalSessionCredential, assertLocalSessionCredential } from '../src/lib/localSession.ts';
// Pure queue assertions use this module's fallback, not Node's process-wide Web Locks.
const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
Object.defineProperty(globalThis, 'navigator', {value:undefined,configurable:true});
const deferred = () => { let resolve!:()=>void;const promise = new Promise<void>(r=>{resolve=r;});return {promise,resolve}; };
const values = new Map<string,string>(), writes: string[] = [];
const tx=stateTransactions({read:async name=>values.get(name)??null,write:async(name,value)=>{writes.push(name);if(value===null)values.delete(name);else values.set(name,value);},compareAndSwap:async(name,old,value)=>{if((values.get(name)??null)!==old)return false;writes.push(name);values.set(name,value);return true;}});
configureLocalSession(true);unlockLocalAdult();
for(const operation of ['save','update']) {
  const entered=deferred(),release=deferred();
  const occupied=withStateLock('records-alice',async()=>{entered.resolve();await release.promise;});
  await entered.promise;
  const guard=captureLocalSession();
  const pending=operation==='save'?tx.save('records-alice','stale',guard):tx.update('records-alice',()=> 'stale',guard);
  lockLocalSession();unlockLocalAdult();release.resolve();await occupied;
  await assert.rejects(pending,/session|locked/i);
  assert.deepEqual(writes,[],`${operation} queued before lock must not borrow new auth`);
}
const entered=deferred(),release=deferred();
const pending=tx.update('records-alice',async()=>{entered.resolve();await release.promise;return 'stale';},captureLocalSession());
await entered.promise;lockLocalSession();unlockLocalAdult();release.resolve();
await assert.rejects(pending,/session|locked/i);assert.deepEqual(writes,[]);
await tx.update('records-alice',()=> 'authorized',captureLocalSession());
assert.equal(values.get('records-alice'),'authorized');assert.deepEqual(writes,['records-alice']);
// Synthetic hashes only: failure bookkeeping cannot revoke a valid credential,
// but any credential channel change must invalidate all prior grants.
const parent={password:{salt:'synthetic',hash:'pw1',iterations:1},pin:{salt:'synthetic',hash:'pin1',iterations:1},recovery:{salt:'synthetic',hash:'recovery1',iterations:1},failures:0};
bindLocalSessionCredential(parent);
assert.doesNotThrow(()=>assertLocalSessionCredential({...parent,failures:4,lockedUntil:123} as any));
for(const key of ['password','pin','recovery'] as const) {
  const changed={...parent,[key]:{...parent[key],hash:'changed'}};
  assert.throws(()=>assertLocalSessionCredential(changed),/credentials changed/i);
}
assert.throws(()=>assertLocalSessionCredential({...parent,pin:undefined}),/credentials changed/i);
lockLocalSession();assert.throws(()=>assertLocalSessionCredential({...parent,pin:undefined}),/credentials changed/i,'lock must not clear credential binding');
unlockLocalAdult();bindLocalSessionCredential({...parent,pin:undefined});assert.doesNotThrow(()=>assertLocalSessionCredential({...parent,pin:undefined}));
configureLocalSession(false);configureLocalSession(true);unlockLocalAdult();
assert.throws(()=>assertLocalSessionCredential(parent),/credentials changed/i,'a configured workspace without an explicit credential binding fails closed');
configureLocalSession(false);
console.log('shared-device storage: queued saves/updates, lock during updater, fresh success and password/PIN/recovery binding passed');

if(navigatorDescriptor)Object.defineProperty(globalThis,'navigator',navigatorDescriptor);
