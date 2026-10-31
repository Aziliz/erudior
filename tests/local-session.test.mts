import assert from 'node:assert/strict';
import { configureLocalSession, localSessionEpoch, localSessionLocked, lockLocalSession, unlockLocalLearner, unlockLocalAdult, assertLocalLearner, assertLocalAdult, captureLocalSession, bindLocalSessionAuthority } from '../src/lib/localSession.ts';
// Public/standalone learning has no family gate.
assertLocalLearner(null); assertLocalAdult();
const publicCallback = captureLocalSession();
configureLocalSession(true);
assert(localSessionLocked()); assert.throws(publicCallback, /session changed/);
assert.throws(assertLocalAdult, /adult/);
assert.throws(() => assertLocalLearner('alice'), /Unlock/);
const lockedView = bindLocalSessionAuthority({ learnerContext: async () => ({studentId:'alice'}) });
unlockLocalLearner('alice');
assertLocalLearner('alice');
assert.throws(() => assertLocalLearner('bob'), /Unlock/);
assert.throws(() => assertLocalLearner(null), /Unlock/);
assert.throws(assertLocalAdult, /adult/);
await assert.rejects(lockedView.learnerContext(), /session changed/);
const learner = bindLocalSessionAuthority({learnerContext: async () => ({studentId:'alice'}), authorize: async () => 'not authority'});
assert.deepEqual(await learner.learnerContext(), {studentId:'alice'});
await assert.rejects(learner.authorize(), /adult/);
const stale = captureLocalSession();
lockLocalSession(); unlockLocalLearner('alice');
assert.throws(stale, /session changed/);
await assert.rejects(learner.learnerContext(), /session changed/);
let release!: () => void;
const pending = new Promise<void>(resolve => release=resolve);
const delayed = bindLocalSessionAuthority({learnerContext: async () => {await pending; return {studentId:'alice'};}});
const loading = delayed.learnerContext();
lockLocalSession(); release();
await assert.rejects(loading, /session changed/);
unlockLocalAdult();
assertLocalAdult(); assertLocalLearner('alice'); assertLocalLearner('bob');
const adult = bindLocalSessionAuthority({authorizeAdult: async () => 'adult'});
assert.equal(await adult.authorizeAdult(), 'adult');
const epoch = localSessionEpoch(); configureLocalSession(true); assert.equal(localSessionEpoch(),epoch,'rerender configuration does not revoke a grant');
configureLocalSession(false);
await assert.rejects(adult.authorizeAdult(), /session changed/);
assertLocalLearner(null); assertLocalAdult();
assert.throws(() => unlockLocalLearner('../other'), /Invalid/);
console.log('Local session isolation, role checks and stale async authorization passed');

// A real engine service cannot borrow a newly unlocked adult after a suspended read.
const { createPresentationStore } = await import('../src/lib/presentationStore.ts');
configureLocalSession(true); unlockLocalAdult();
let releaseRead!: () => void;
const readDelay = new Promise<void>(resolve => releaseRead=resolve);
let written = false;
const engine = createPresentationStore({
  authorize: async () => 'same-credential',
  read: async () => { await readDelay; return null; },
  update: async change => { const value=await change(null); written=true; return value; },
});
const read = engine.load();
await new Promise(resolve => setTimeout(resolve,0));
lockLocalSession(); unlockLocalAdult(); releaseRead();
await assert.rejects(read, /session changed/);
await assert.rejects(engine.save({format:'erudior-presentation',version:1,id:'synthetic',title:'Synthetic',revision:0,slides:[]},null), /session changed/);
assert.equal(written,false,'stale real-engine facade cannot mutate after identical-credential reauthentication');
const currentEngine=createPresentationStore({authorize:async()=> 'same-credential',read:async()=>null,update:async change=>change(null)});
assert.deepEqual((await currentEngine.load()).decks,[]);
unlockLocalLearner('alice');
await assert.rejects(currentEngine.load(), /session changed/);
configureLocalSession(false);
console.log('Real presentation service rejects pre-lock callbacks after reauthentication');

// Native monotonic absence still revokes when WebView pause/timers never ran.
const { applyNativeLifecycle } = await import('../src/lib/nativeLifecycle.ts');
const lifecycleCalls:string[]=[];
const lifecycleHandlers={conceal:()=>lifecycleCalls.push('conceal'),reveal:()=>lifecycleCalls.push('reveal'),lock:()=>lifecycleCalls.push('lock')};
for(const detail of [null,{}, {paused:'true',backgroundMs:0},{paused:false,backgroundMs:NaN},{paused:false,backgroundMs:-1}])applyNativeLifecycle(detail,lifecycleHandlers);
assert.deepEqual(lifecycleCalls,[]);
applyNativeLifecycle({paused:true,backgroundMs:0},lifecycleHandlers);
applyNativeLifecycle({paused:false,backgroundMs:500},lifecycleHandlers);
assert.deepEqual(lifecycleCalls,['conceal','reveal']);lifecycleCalls.length=0;
applyNativeLifecycle({paused:false,backgroundMs:30_000},lifecycleHandlers);
assert.deepEqual(lifecycleCalls,['lock','reveal'],'missed native pause still locks before showing UI');
console.log('Native monotonic lifecycle signal validation and revoke-before-reveal passed');
