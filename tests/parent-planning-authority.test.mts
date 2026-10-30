import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
// Execute the actual App mutation callback, not a copied security implementation.
const app=fs.readFileSync('src/App.tsx','utf8');
const start=app.indexOf('  const setProgress = useCallback('),end=app.indexOf('\n  const saveLearnerSession',start);
assert(start>=0&&end>start);
const code=ts.transpileModule(app.slice(start,end)+'\nreturn setProgress;',{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const build=new Function('useCallback','store','view','viewRef','courses','family','studentId','studentSelectionRequest','progressSelectionGeneration','isClassroom','parentCourseDigest','assertCurrentParentCourseAccess','progressRef','setProgressState',code);
const course={id:'community-fixture',community:{id:'fixture',version:1},banks:[]};
function setup(){
 let selected:string|null='alice',allowed=true,checks=0,afterCheck=()=>{},beforeWrite=()=>{};
 const writes:Array<{profile:string|null;p:any}>=[],published:any[]=[];
 const selection={current:1},progressRef={current:{original:true}},view={name:'lesson',courseId:course.id};
 const store={activeStudent:()=>selected,competencyProfileExists:async()=>true,saveProgress:async(p:any,options:any)=>{beforeWrite();await options.guard?.();writes.push({profile:selected,p});}};
 const set=build((fn:any)=>fn,store,view,{current:view},[course],{students:[{id:'alice'},{id:'bob'}]},'alice',selection,1,()=>false,async()=> 'digest',async()=>{checks++;afterCheck();if(!allowed)throw Error('Parent review revoked');},progressRef,(p:any)=>published.push(p));
 return{set,writes,published,progressRef,selection,switch:(id:string)=>{selected=id;selection.current++;},revoke:()=>{allowed=false;},after:(fn:()=>void)=>{afterCheck=fn;},beforeWrite:(fn:()=>void)=>{beforeWrite=fn;},checks:()=>checks};
}
const failures:string[]=[];
async function caseOf(name:string,test:()=>Promise<void>){try{await test();}catch(e){failures.push(name+': '+String(e));}}
await caseOf('authorized write publishes only after persistence',async()=>{const f=setup();f.beforeWrite(()=>assert.equal(f.published.length,0));await f.set({answer:'synthetic'});assert.equal(f.writes.length,1);assert.equal(f.writes[0].profile,'alice');assert.equal(f.published.length,1);});
await caseOf('revoked approval writes nothing',async()=>{const f=setup();f.revoke();await assert.rejects(f.set({answer:'synthetic'}),/review|authority|revoked/i);assert.equal(f.writes.length,0);assert.equal(f.published.length,0);});
await caseOf('late callback retains original learner scope',async()=>{const f=setup();f.switch('bob');await assert.rejects(f.set({answer:'Alice answer'}),/learner|profile|changed/i);assert.equal(f.writes.length,0);assert.equal(f.published.length,0);});
await caseOf('away and back does not reauthorize old callback',async()=>{const f=setup();f.switch('bob');f.switch('alice');await assert.rejects(f.set({answer:'Stale Alice answer'}),/learner|profile|changed/i);assert.equal(f.writes.length,0);});
await caseOf('profile change while final authority is awaited never publishes stale UI',async()=>{const f=setup();f.after(()=>{if(f.checks()===3)f.switch('bob');});await assert.rejects(f.set({answer:'Alice answer'}),/learner|profile|changed/i);assert.equal(f.published.length,0);assert.deepEqual(f.progressRef.current,{original:true});});
if(failures.length)throw Error(failures.join('\n'));
console.log('Actual parent-planning App activity callback: authorized persistence ordering, revocation, stale origin and async final-profile race passed.');

const sessionStart=app.indexOf('  const saveLearnerSession = useCallback('),sessionEnd=app.indexOf('\n  useEffect(',sessionStart);
const sessionCode=ts.transpileModule(app.slice(sessionStart,sessionEnd)+'\nreturn saveLearnerSession;',{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const sessionBuild=new Function('useCallback','store','view','courses','family','studentId','studentSelectionRequest','progressSelectionGeneration','isClassroom','parentCourseDigest','assertCurrentParentCourseAccess',sessionCode);
let selected='alice',generation={current:1},exists=true,authorized=true;const sessionWrites:any[]=[];
const saveSession=sessionBuild((fn:any)=>fn,{activeStudent:()=>selected,competencyProfileExists:async()=>exists,saveProfileSessionState:async(id:string,content:string|null,guard:()=>Promise<void>)=>{await guard();sessionWrites.push({id,content});}}, {name:'lesson',courseId:course.id},[course],{students:[{id:'alice'}]},'alice',generation,1,()=>false,async()=>'digest',async()=>{if(!authorized)throw Error('Parent review revoked');});
await saveSession('synthetic-session');assert.deepEqual(sessionWrites,[{id:'alice',content:'synthetic-session'}]);
authorized=false;await assert.rejects(saveSession('revoked-session'),/revoked/);assert.equal(sessionWrites.length,1);
authorized=true;exists=false;await assert.rejects(saveSession(null),/deleted/i);assert.equal(sessionWrites.length,1);
exists=true;selected='bob';generation.current++;await assert.rejects(saveSession('late Alice session'),/Learner changed/);assert.equal(sessionWrites.length,1);
console.log('Actual App session callback: scoped destination, review revocation, deleted learner and stale cleanup protected.');
