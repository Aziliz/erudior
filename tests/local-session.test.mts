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

const { createNativeLifecycleConsumer } = await import('../src/lib/nativeLifecycle.ts');
const consume = createNativeLifecycleConsumer();
let nativeCalls:string[]=[];
const handlers={conceal:()=>nativeCalls.push('conceal'),reveal:()=>nativeCalls.push('reveal'),lock:()=>nativeCalls.push('lock')};
const commit=(run:()=>void)=>{run();nativeCalls.push('committed');};
const event=(sequence:number,revocation:number,paused=false,backgroundMs=0)=>({bridgeId:'test-native',sequence,revocation,paused,backgroundMs});
assert.equal(consume(event(2,2,false,30_000),handlers,commit),true,'resume alone revokes after missed pause/listener');
assert.deepEqual(nativeCalls,['lock','reveal','committed']);nativeCalls=[];
assert.equal(consume(event(2,2,false,30_000),handlers,commit),true);
assert.deepEqual(nativeCalls,[],'duplicate ACK never relocks freshly authenticated work');
assert.equal(consume(event(1,0,true),handlers,commit),true);
assert.deepEqual(nativeCalls,[],'older pause cannot overwrite newer resume');
consume(event(3,2),handlers,commit);
assert.deepEqual(nativeCalls,['reveal','committed'],'same owed obligation is not applied twice after lost ACK');nativeCalls=[];
consume(event(4,4,false,31_000),handlers,commit);
assert.deepEqual(nativeCalls,['lock','reveal','committed'],'new absence revokes a fresh grant');nativeCalls=[];
const late = createNativeLifecycleConsumer();
late(event(7,6,true),handlers,commit);
assert.deepEqual(nativeCalls,['lock','conceal','committed'],'long resume superseded by pause retains owed revocation');nativeCalls=[];
const failure=createNativeLifecycleConsumer();
assert.throws(()=>failure(event(8,8),handlers,()=>{throw Error('commit failed');}),/commit failed/);
assert.equal(failure(event(8,8),handlers,commit),true);
assert.deepEqual(nativeCalls,['lock','reveal','committed'],'failed commit is never consumed or ACKed');nativeCalls=[];
for(const invalid of [{},event(9,0,false,30_000),event(9,10),{...event(9,0),sequence:NaN},{...event(9,0),bridgeId:'other-native'}]) {
  assert.equal(consume(invalid,handlers,commit),false);
}
assert.deepEqual(nativeCalls,[],'invalid/foreign envelopes cannot reveal or ACK');
// Actual EventTarget dispatch result is the native callback ACK contract.
const target=new EventTarget(), delivery=createNativeLifecycleConsumer();
const makeEvent=()=>new CustomEvent('native',{cancelable:true,detail:event(10,10,false,32_000)});
assert.equal(target.dispatchEvent(makeEvent()),true,'absent subscriber is not acknowledged');
const listener=(e:Event)=>{if(delivery((e as CustomEvent).detail,handlers,commit))e.preventDefault();};
target.addEventListener('native',listener);
assert.equal(target.dispatchEvent(makeEvent()),false,'replay acknowledged only by a committed consumer');
target.removeEventListener('native',listener);target.addEventListener('native',listener);
nativeCalls=[];
assert.equal(target.dispatchEvent(makeEvent()),false);
assert.deepEqual(nativeCalls,[],'subscription churn retains document consumption state');
console.log('Native lifecycle acknowledged delivery, loss/replay and commit ordering passed');

const startupConsumer=createNativeLifecycleConsumer();
const startupCalls:string[]=[];
assert.equal(startupConsumer(event(1,0),{conceal:()=>startupCalls.push('conceal'),reveal:()=>startupCalls.push('ready'),lock:()=>startupCalls.push('lock')},run=>run()),true);
assert.deepEqual(startupCalls,['ready'],'benign startup is ACKed without a Family or grant');
