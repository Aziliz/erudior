import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
// Exercise the actual App adapter in isolation, not a second copied authorization implementation.
const app=await readFile(new URL('../src/App.tsx',import.meta.url),'utf8');
const start=app.indexOf('  const documentEngine = createDocumentEngineStore({');
const end=app.indexOf('  const learnerPrivacy =',start);
assert(start>=0&&end>start,'Document adapter remains an explicit narrow App boundary');
const adapter=ts.transpileModule(app.slice(start,end)+'\nreturn documentEngine;', {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
let family:any={parent:{password:{hash:'first'}},students:[{id:'alice',name:'Alice'}],school:{administrator:'Teacher'}};
let selected:string|null='alice',reads=0,afterRead=()=>{};
const access={current:{unlocked:true,parentView:true}},credential={current:JSON.stringify(family.parent.password)};
const io=new Function('createDocumentEngineStore','store','loadFamily','adultAccess','documentUnlockedCredential','isClassroom',adapter)(
 (v:any)=>v,{loadState:async()=>null,updateState:async()=>{},activeStudent:()=>selected},
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
// Credential capture must occur only at existing explicit gate/setup unlock paths.
assert.match(app,/const documentUnlockedCredential = useRef<string \| null>\(null\)/);
const captures=[...app.matchAll(/documentUnlockedCredential\.current\s*=/g)];
assert.equal(captures.length,2,'Only explicit ParentGate unlock and classroom setup capture authority');
assert.match(app,/<ParentGate[^\n]+onUnlock=\{\(\) => \{ documentUnlockedCredential\.current = JSON\.stringify\(family\.parent\.password\)/);
assert.match(app,/if \(isClassroom\(f\)\) \{[\s\S]{0,250}documentUnlockedCredential\.current = JSON\.stringify\(f\.parent\.password\)/);
assert.match(app,/if \(!adultAccess\.current\.unlocked \|\| !adultAccess\.current\.parentView\)/);
console.log('Document App authority: explicit unlock binding, pre-operation credential replacement, locked/non-parent gates, current membership and async profile/lock changes passed');
