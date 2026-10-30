import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const dom = new JSDOM('<!doctype html><div id="root"></div>', {url:'https://example.test'});
Object.assign(globalThis, {window:dom.window, document:dom.window.document, HTMLElement:dom.window.HTMLElement, FileReader:dom.window.FileReader, localStorage:dom.window.localStorage, IS_REACT_ACT_ENVIRONMENT:true, isTauri:true});
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
let picked: string | null = null;
let holdPicker = false, finishPicker: ((text:string|null)=>void) | undefined;
(window as any).__TAURI_INTERNALS__ = {invoke:async(command:string) => {
  if(command==='pick_portable_course') return holdPicker ? new Promise(resolve=>{finishPicker=resolve;}) : picked;
  if(command==='read_text_file') return picked;
  if(command==='load_state') return null;
  throw new Error(`Unexpected native write: ${command}`);
}};
const {createElement,act}=await import('react');
const {createRoot}=await import('react-dom/client');
const {emptyCourse}=await import('../src/lib/course.ts');
const {emptyProgress}=await import('../src/lib/storage.ts');
const {createOfflineCoursePackage,importOfflineCoursePackage}=await import('../src/lib/offlineCourse.ts');
const {default:Export}=await import('../src/components/OfflineCourseExport.tsx');
const {default:Library}=await import('../src/pages/Library.tsx');
const root=createRoot(document.getElementById('root')!);
const course=emptyCourse('Synthetic offline course');
course.lessons=[{id:'intro',module:course.modules[0].id,title:'Introduction',body:'A local lesson.'}];
const button=(label:string)=>{const node=[...document.querySelectorAll('button')].find(n=>n.textContent?.trim()===label);assert(node,`Missing ${label}`);return node;};
const click=async(label:string)=>act(async()=>button(label).click());
const until=async(predicate:()=>boolean)=>{const deadline=Date.now()+5000;while(!predicate()&&Date.now()<deadline)await act(async()=>{await new Promise(resolve=>setTimeout(resolve,10));});assert(predicate(),'UI operation timed out');};
let exports=0,closed=0,content='',mode='cancel',release:(()=>void)|undefined;
const save=async(text:string)=>{exports++;content=text;if(mode==='fail')throw new Error('Disk unavailable');if(mode==='hold')await new Promise<void>(resolve=>release=resolve);return mode!=='cancel';};
const renderExport=async(c=course)=>act(async()=>root.render(createElement(Export,{course:c,onClose:()=>{closed++;root.render(null);},saveFile:save})));
await renderExport();
assert.match(document.body.textContent!,/All lesson media is already embedded/);
assert.match(document.body.textContent!,/not learner progress/);
assert.equal(document.activeElement?.id,'offline-export-title');
await click('Save offline package');await until(()=>document.body.textContent!.includes('Save cancelled'));
assert.equal(exports,1);assert.equal((await importOfflineCoursePackage(content)).lessons[0].id,'intro');
mode='fail';await click('Save offline package');await until(()=>!!document.querySelector('[role="alert"]'));
assert.match(document.querySelector('[role="alert"]')!.textContent!,/Disk unavailable/);
mode='hold';await click('Save offline package');await until(()=>!!release);
assert(button('Save offline package').disabled);await click('Save offline package');assert.equal(exports,3,'repeat click does not start a second save');
await click('Close');await act(async()=>release!());assert.equal(closed,1);assert.equal(document.body.textContent,'','closed save does not resurrect report');

const withImage=structuredClone(course);withImage.lessons[0].body='![Chart](https://example.test/chart.png)';
await renderExport(withImage);assert(button('Save offline package').disabled);
const input=()=>document.querySelector('input[type=file]') as HTMLInputElement;
const select=async(file:File)=>act(async()=>{Object.defineProperty(input(),'files',{value:[file],configurable:true});input().dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
await select(new dom.window.File([new Uint8Array(2*1024*1024+1)],'huge.png',{type:'image/png'}) as any);
assert.match(document.querySelector('[role="alert"]')!.textContent!,/2 MiB/);
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=','base64');
await select(new dom.window.File([png],'chart.png',{type:'image/png'}) as any);
await until(()=>!button('Save offline package').disabled);mode='ok';await click('Save offline package');await until(()=>document.body.textContent!.includes('Offline package saved'));
const restored=await importOfflineCoursePackage(content);assert.match(restored.lessons[0].body,/data:image\/png;base64,/);
await click('Cancel');
// Closing during a file read must abort it and ignore its eventual callback.
let delayedReader:any;
const originalReader=globalThis.FileReader;
(globalThis as any).FileReader=class {
  result='data:image/png;base64,'+png.toString('base64');
  onload:any; onerror:any; onabort:any; aborted=false;
  constructor(){delayedReader=this;}
  readAsDataURL(){} abort(){this.aborted=true;this.onabort?.();}
};
await renderExport(withImage);
await select(new dom.window.File([png],'delayed.png',{type:'image/png'}) as any);
assert(button('Save offline package').disabled);await click('Cancel');assert(delayedReader.aborted);
await act(async()=>delayedReader.onload());assert.equal(document.body.textContent,'');
(globalThis as any).FileReader=originalReader;

const notices:string[]=[];const saved:any[]=[];let fail=false;
const api:any={courses:[course],allCourses:[course],progress:emptyProgress(),family:{mode:'family',students:[]},student:null,catalog:{source:'website'},assignmentBlock:()=>null,toast:(s:string)=>notices.push(s),saveCourse:async(c:any)=>{if(fail)throw new Error('Storage unavailable');saved.push(c);},go:()=>{}};
await act(async()=>root.render(createElement(Library,{api,broken:[],standalone:[]})));
picked=null;await click('Import');await until(()=>!button('Import').disabled);assert.equal(saved.length,0);
picked=await createOfflineCoursePackage(course,{});await click('Import');await until(()=>!!document.getElementById('offline-import-title'));
assert.equal(saved.length,0,'package requires explicit consent before writes');assert(button('Import').disabled);
assert.match(document.body.textContent!,/not an author signature/);await click('Cancel import');assert.equal(saved.length,0);
await click('Import');await until(()=>!!document.getElementById('offline-import-title'));fail=true;await click('Import as local copy');await until(()=>notices.some(n=>n.includes('Storage unavailable')));assert.equal(saved.length,0);assert(document.getElementById('offline-import-title'),'failure preserves retry');
fail=false;await click('Import as local copy');await until(()=>saved.length===1);assert.notEqual(saved[0].id,course.id);assert.equal(saved[0].community,undefined);
await click('Import');await until(()=>!!document.getElementById('offline-import-title'));await click('Import as local copy');await until(()=>saved.length===2);assert.notEqual(saved[0].id,saved[1].id,'repeated import is isolated');
// A profile/family switch invalidates both a prepared confirmation and an in-flight picker.
picked=await createOfflineCoursePackage(course,{});await click('Import');await until(()=>!!document.getElementById('offline-import-title'));
api.family={...api.family};await act(async()=>root.render(createElement(Library,{api,broken:[],standalone:[]})));
assert.equal(document.getElementById('offline-import-title'),null);assert.equal(saved.length,2);
holdPicker=true;await click('Import');await until(()=>!!finishPicker);
api.publicLearning=true;await act(async()=>root.render(createElement(Library,{api,broken:[],standalone:[]})));
await act(async()=>finishPicker!(picked));holdPicker=false;
assert.equal(document.getElementById('offline-import-title'),null);assert.equal(saved.length,2,'late file selection cannot cross storage scope');
picked='{"format":"erudior-offline-course","version":999}';await click('Import');await until(()=>notices.some(n=>n.startsWith('Import failed:')));assert.equal(saved.length,2);
await act(async()=>root.unmount());dom.window.close();
console.log('Offline export/import UI: explicit consent, local media, limits, cancellation, failures, repeated actions, isolated imports passed');
