import { assertExplicitCredentialCaptures } from './helpers/app-unlock-source.mts';
import { configureLocalSession, unlockLocalAdult, lockLocalSession, bindLocalSessionAuthority } from '../src/lib/localSession.ts';
configureLocalSession(true); unlockLocalAdult();
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
// Exercise the actual App adapter in isolation, not a second copied authorization implementation.
const app=await readFile(new URL('../src/App.tsx',import.meta.url),'utf8');
const start=app.indexOf('  const transactionEngine = createTransactionEngineStore({');
const end=app.indexOf('  const documentEngine =',start);
assert(start>=0&&end>start,'Transaction adapter remains an explicit narrow App boundary');
const adapter=ts.transpileModule(app.slice(start,end)+'\nreturn transactionEngine;', {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
let family:any={parent:{password:{hash:'first'}},students:[{id:'alice',name:'Alice'}],school:{administrator:'Teacher'}};
let selected:string|null='alice',reads=0,afterRead=()=>{};
const access={current:{unlocked:true,parentView:true}},credential={current:JSON.stringify(family.parent.password)};
const io=new Function('createTransactionEngineStore','store','loadFamily','adultAccess','documentUnlockedCredential','isClassroom',adapter)(
 (v:any)=>bindLocalSessionAuthority(v),{loadState:async()=>null,updateState:async()=>{},activeStudent:()=>selected},
 async()=>{reads++;afterRead();return family;},access,credential,()=>true,
);
assert.equal((await io.authorizeAdult('alice')).actorName,'Teacher');
family={...family,parent:{password:{hash:'replaced-before-operation'}}};
await assert.rejects(io.authorizeAdult('alice'),/authority/,'An old unlocked tab cannot adopt replaced credentials');
credential.current=JSON.stringify(family.parent.password);
await io.authorizeAdult('alice');
await assert.rejects(io.authorizeAdult('outsider'),/membership/);
access.current.unlocked=false;const before=reads;await assert.rejects(io.authorizeAdult(),/Unlock/);assert.equal(reads,before,'Closed adult gate rejects before private reads');
access.current={unlocked:true,parentView:false};await assert.rejects(io.authorizeAdult(),/Unlock/);
access.current={unlocked:true,parentView:true};afterRead=()=>{access.current.unlocked=false;};await assert.rejects(io.authorizeAdult('alice'),/authority/,'Lock during load is rechecked');
afterRead=()=>{};access.current.unlocked=true;
assert.equal((await io.learnerContext()).studentId,'alice');
selected='outsider';await assert.rejects(io.learnerContext(),/current learner/);
selected='alice';afterRead=()=>{selected='outsider';};await assert.rejects(io.learnerContext(),/current learner/,'Profile switch during load is rechecked');
// Every authority adapter is bound to its original local session, including after reauth.
lockLocalSession(); unlockLocalAdult();
await assert.rejects(io.authorizeAdult('alice'), /session|locked/i);
await assert.rejects(io.learnerContext(), /session|locked/i);
configureLocalSession(false);
assertExplicitCredentialCaptures(app);
assert.match(app,/if \(!adultAccess\.current\.unlocked \|\| !adultAccess\.current\.parentView\)/);
console.log('Transaction App authority: explicit unlock binding, pre-operation credential replacement, locked/non-parent gates, current membership and async profile/lock changes passed');
