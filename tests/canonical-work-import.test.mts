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
const invalids=[{...valid,writing:[null]},{...valid,writing:[{...valid.writing[0],extra:'lost'}]},{...valid,writing:[{...valid.writing[0],module:'missing'}]},{...valid,lessons:[{id:'lesson',module:valid.modules[0].id,title:'Missing',body:'```assignment\nwriting: absent\n```'}]}];
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
async function importFile(course:unknown){picked=JSON.stringify(course);saved=undefined;notices.length=0;await act(async()=>{[...document.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Import')!.click();});}
for(const invalid of invalids){await importFile(invalid);assert.equal(saved,undefined);assert.match(notices.join('\n'),/Invalid course work/);}
await importFile(valid);assert.deepEqual(saved.writing,valid.writing);
const legacy=JSON.parse(readFileSync('samples/demo-student-work.json','utf8'));await importFile(legacy);assert.ok(saved.labs.length);assert.ok(saved.writing.length);
await act(async()=>root.unmount());dom.window.close();
console.log('actual Library import and backup restore reject malformed work before writes; canonical exact fields and legacy imports preserved');
