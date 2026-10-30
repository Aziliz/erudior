/** Exercise actual App persistence callbacks, not a copied no-enrollment implementation. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import {isClassroom} from '../src/lib/family.ts';
import {emptyCourse} from '../src/lib/course.ts';
import {validateCourseIntegrity} from '../src/lib/courseIntegrity.ts';
import {createOfflineCoursePackage,importOfflineCoursePackage} from '../src/lib/offlineCourse.ts';
const app=await readFile(new URL('../src/App.tsx',import.meta.url),'utf8');
function section(startMarker:string,endMarker:string){const start=app.indexOf(startMarker),end=app.indexOf(endMarker,start);assert(start>=0&&end>start,`App boundary missing: ${startMarker}`);return app.slice(start,end);}
const source=section('  const reload = useCallback(', '  useEffect(() => {')+section('  const enroll = useCallback(', '  const assignmentBlock = useCallback(')+'\nreturn {saveCourse};';
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const progress=new Map<string,any>([['alice',{enrolled:['alice-course'],lessonsDone:{'alice-course/lesson':'2026-10-30'},submissions:['alice-private']}],['bob',{enrolled:['bob-course'],lessonsDone:{},submissions:['bob-private']}]]);
let selected='alice',progressWrites=0,persistenceWrites=0,reloads=0,stateUpdates=0;
let gate:Promise<void>|undefined,release:(()=>void)|undefined,writeError:Error|undefined;
const saved=new Map<string,unknown>();const progressRef={current:structuredClone(progress.get(selected))};
const store={
 activeStudent:()=>selected,
 competencyProfileExists:async()=>true,
 saveCourse:async(course:any)=>{persistenceWrites++;if(gate)await gate;if(writeError)throw writeError;saved.set(course.id,structuredClone(course));},
 saveProgress:async(value:any)=>{progressWrites++;progress.set(selected,structuredClone(value));},
 listBanks:async()=>({banks:[],broken:[]}),
 listCourses:async()=>{reloads++;return {courses:[...saved.values()],broken:[]};},
};
const create=()=>new Function('useCallback','store','setStandalone','setCourses','setBroken','progressRef','setProgressState','family','studentId','validateCourseIntegrity','courses','view','isClassroom','useRef',compiled)(
 (callback:any)=>callback,store,()=>{},()=>{},()=>{},progressRef,()=>{stateUpdates++;},{students:[{id:'alice'},{id:'bob'}]},selected,validateCourseIntegrity,[],{name:"library"},isClassroom,(value:any)=>({current:value}),
);
function switchProfile(id:string){selected=id;progressRef.current=structuredClone(progress.get(id));}
const original=structuredClone([...progress]);
const authored=emptyCourse('Synthetic private import');authored.lessons=[{id:'intro',module:authored.modules[0].id,title:'Introduction',body:'Local learning.'}];
const text=await createOfflineCoursePackage(authored),first=await importOfflineCoursePackage(text);
await create().saveCourse(first,{enroll:false});
assert.equal(persistenceWrites,1);assert(saved.has(first.id));assert.equal(reloads,1);assert.equal(progressWrites,0);assert.equal(stateUpdates,0);assert.deepEqual([...progress],original);
// The course write began in Alice's UI but finishes after the active storage scope changes.
const second=await importOfflineCoursePackage(text);gate=new Promise<void>(resolve=>release=resolve);
const pending=create().saveCourse(second,{enroll:false});assert.equal(persistenceWrites,2);switchProfile('bob');release!();await pending;gate=undefined;
assert(saved.has(second.id));assert.notEqual(first.id,second.id);assert.equal(reloads,2);assert.equal(progressWrites,0,'deferred import cannot enroll the newly selected learner');assert.equal(stateUpdates,0);assert.deepEqual([...progress],original);assert.deepEqual(progressRef.current,progress.get('bob'));
// No failure path enrolls, writes private state, or pretends to reload a failed persistence write.
writeError=Error('Storage unavailable');await assert.rejects(create().saveCourse(await importOfflineCoursePackage(text),{enroll:false}),/Storage unavailable/);writeError=undefined;
assert.equal(reloads,2);assert.equal(progressWrites,0);assert.deepEqual([...progress],original);
const invalid=structuredClone(first);invalid.lessons[0].module='missing';const attempts=persistenceWrites;await assert.rejects(create().saveCourse(invalid,{enroll:false}),/Cannot save course/);assert.equal(persistenceWrites,attempts,'integrity validation precedes persistence');
// Existing intentional enroll-on-save calls retain their contract; the test observes real mutations.
await create().saveCourse(first);assert.equal(progressWrites,1);assert.equal(stateUpdates,1);assert.deepEqual(progress.get('bob').enrolled,['bob-course',first.id]);assert.deepEqual(progress.get('alice'),original[0][1]);
assert.deepEqual(progress.get('bob').submissions,['bob-private']);
const library=await readFile(new URL('../src/pages/Library.tsx',import.meta.url),'utf8');assert.match(library,/api\.saveCourse\(offlineImport,\s*\{\s*enroll:\s*false\s*\}\)/,'the confirmed offline-import UI uses the no-enrollment boundary');
console.log('Offline App authority: actual persistence/integrity callbacks, import no-enrollment, deferred profile switch isolation, failure paths and intentional legacy enrollment passed');
