import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const dom=new JSDOM("<!doctype html><div id='root'></div>",{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true,isTauri:true});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
let picked='';const mutations:string[]=[];
(window as any).__TAURI_INTERNALS__={invoke:async(command:string,args:any)=>{
 if(command==='plugin:dialog|open')return '/test/course.json';
 if(command==='read_text_file')return picked;
 if(command==='load_state')return null;
 mutations.push(command);return;
}};
const {restoreBackup,emptyProgress}=await import('../src/lib/storage.ts');
const {emptyCourse}=await import('../src/lib/course.ts');
const {createElement,act}=await import('react');
const {createRoot}=await import('react-dom/client');
const {default:Library}=await import('../src/pages/Library.tsx');
const valid=emptyCourse('Import test');
valid.writing=[{id:'essay',title:'Explain',kind:'short',prompt:'Give evidence.',selfCheck:true}];
valid.texts=[{id:'reading',title:'Original reading',kind:'prose',lang:'en',source:'Synthetic fixture',lineNumbers:0,glossary:[{term:'Term',definition:'Meaning',aliases:[],topic:'Topic'}],sections:[{id:'part',title:'Part',body:'Original body',questions:[]}]}];
const invalids=[{...valid,writing:[null]},{...valid,writing:[{...valid.writing[0],extra:'lost'}]},{...valid,writing:[{...valid.writing[0],module:'missing'}]},{...valid,lessons:[{id:'lesson',module:valid.modules[0].id,title:'Missing',body:'```assignment\nwriting: absent\n```'}]}];
invalids.push(...[{...valid,texts:[null]},{...valid,texts:[{...valid.texts[0],unknown:'must not drop'}]},{...valid,texts:[{...valid.texts[0],sections:[{id:'part',title:'Part',body:'Text',questions:['missing']}]}]}] as any);
const backup=(course:unknown)=>({format:'erudior-backup',version:1,progress:emptyProgress(),courses:[course],banks:[]});
for(const invalid of invalids){mutations.length=0;await assert.rejects(restoreBackup(backup(invalid),{courses:[{id:'never-delete'} as any],banks:[]}),/Invalid backup course work/);assert.deepEqual(mutations,[]);}
for (const field of ['assessedWorkSubmissions','spreadsheetSubmissions']) {
 for (const invalid of [null,[],{attempt:{id:'attempt',version:999}}]) {
  mutations.length=0;
  await assert.rejects(restoreBackup({...backup(valid),progress:{...emptyProgress(),[field]:invalid}},{courses:[{id:'never-delete'} as any],banks:[]}));
  assert.deepEqual(mutations,[],`${field} must be validated before writes`);
 }
}
let saved:any;const notices:string[]=[];
const api:any={courses:[],allCourses:[],progress:emptyProgress(),family:{mode:'family',students:[]},student:null,catalog:{source:'website'},assignmentBlock:()=>null,toast:(s:string)=>notices.push(s),saveCourse:async(c:any)=>{saved=c;},go:()=>{}};
const root=createRoot(document.getElementById('root')!);
await act(async()=>root.render(createElement(Library,{api,broken:[],standalone:[]})));
async function importFile(course:unknown){
 picked=JSON.stringify(course);saved=undefined;notices.length=0;
 await act(async()=>{[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Import')!.click();});
 // The native picker is dynamically imported outside React's event promise.
 // Wait for the actual completion/error callback, not a fast local module load.
 const deadline=Date.now()+5000;
 while(!notices.length&&Date.now()<deadline)await act(async()=>{await new Promise(resolve=>setTimeout(resolve,10));});
 assert.ok(notices.length,`Import did not complete; saved=${!!saved}, mutations=${mutations.join(',')}`);
}
for(const invalid of invalids){await importFile(invalid);assert.equal(saved,undefined);assert.match(notices.join('\n'),/Invalid course work/);}
await importFile(valid);assert.deepEqual(saved.writing,valid.writing);assert.deepEqual(saved.texts,valid.texts);
const unknownLegacy={...valid,decks:[{id:'deck',title:'Deck',cards:[{id:'card',front:'Prompt',back:'Answer',unknownAuthoredField:'must not disappear'}]}]};
await importFile(unknownLegacy);assert.equal(saved,undefined);assert.match(notices.join('\n'),/unknownAuthoredField|unknown|unsupported/);
mutations.length=0;await assert.rejects(restoreBackup(backup(unknownLegacy),{courses:[{id:'never-delete'} as any],banks:[]}));assert.deepEqual(mutations,[]);
const { canonicalAuthoringFromCourse } = await import('../src/lib/canonicalAuthoring.ts');
const envelope = canonicalAuthoringFromCourse({...valid,updated:'2024-01-01',readAloud:false});
await importFile(envelope);assert.equal(saved.updated,'2024-01-01');assert.equal(saved.readAloud,false);assert.deepEqual(saved.texts,valid.texts);
for(const mutate of [(p:any)=>p.version=99,(p:any)=>p.course.community={review:'reviewed'},(p:any)=>p.course.audio={bad:'https://evil.test/audio.mp3'}]){const invalid=structuredClone(envelope);mutate(invalid);await importFile(invalid);assert.equal(saved,undefined);mutations.length=0;await assert.rejects(restoreBackup(backup(invalid),{courses:[{id:'never-delete'} as any],banks:[]}));assert.deepEqual(mutations,[]);}
const legacy=JSON.parse(readFileSync('samples/demo-student-work.json','utf8'));await importFile(legacy);assert.ok(saved.labs.length);assert.ok(saved.writing.length);
await act(async()=>root.unmount());dom.window.close();
console.log('actual Library import and backup restore reject malformed work before writes; canonical exact fields and legacy imports preserved');
