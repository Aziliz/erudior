import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {emptyCourse} from '../src/lib/course.ts';
const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,FileReader:dom.window.FileReader,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
const {createElement,act}=await import('react');const {createRoot}=await import('react-dom/client');
const {CourseMetadataEditor}=await import('../src/components/CourseMetadataEditor.tsx');
const {QuestionAudioEditor}=await import('../src/components/QuestionAudioEditor.tsx');
const {EmbeddedAudioInput}=await import('../src/components/AudioResourceEditor.tsx');
const root=createRoot(document.getElementById('root')!);
let course=emptyCourse('Synthetic');course.updated=' original date ';course.changelog=' Original\n text ';course.readAloud=false;course.language={code:'xx',name:'Synthetic',keys:[' x ','y'],ime:'custom',vocabTarget:0,vocabSource:' Original source '};course.vocab=Array.from({length:3000},(_,i)=>({id:`v${i}`,lesson:'l',term:`Term ${i}`,meanings:['Meaning'],from:' source ',directions:['recall','meaning'] as ('recall'|'meaning')[]}));course.readingList=[{title:'Book',publisher:' Publisher ',level:' Level ',isbn:' ISBN '}];course.glossary=[{term:'Term',meaning:'Meaning',topic:' Topic '}];
let changes=0;
const render=()=>root.render(createElement(CourseMetadataEditor,{course,onChange:(next)=>{course=next;changes++;render();}}));
const field=(name:string)=>{const label=[...document.querySelectorAll('label')].find(el=>Array.from(el.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent).join('')===name);assert.ok(label,name);const el=label.querySelector('input,textarea,select');assert.ok(el,name);return el as HTMLInputElement;};
async function fill(name:string,value:string){const el=field(name);const proto=el.tagName==='SELECT'?dom.window.HTMLSelectElement.prototype:el.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;await act(async()=>{Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(el,value);el.dispatchEvent(new dom.window.Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));});}
async function click(name:string){const b=[...document.querySelectorAll('button')].find(e=>e.textContent===name);assert.ok(b,name);await act(async()=>b.click());}
await act(async()=>render());assert.equal(changes,0,'mount does not default/normalize authored data');assert.equal(field('Read-aloud setting').value,'false');assert.ok(document.querySelectorAll('input').length<30,'one vocabulary row, not 3000');
await fill('Course disclaimer','  Original limitations\n ');assert.equal(course.disclaimer,'  Original limitations\n ');assert.equal(course.changelog,' Original\n text ');
await fill('Prerequisite course IDs (one per line)','foundation-one\nfoundation-two');assert.deepEqual(course.requires,['foundation-one','foundation-two']);await click('Omit prerequisites');assert.equal(Object.hasOwn(course,'requires'),false);
await fill('Language ime','custom-new');await fill('Vocabulary target','25');await fill('Language vocabSource','  exact citation  ');await fill('Language typing keys (one per line)',' a \nb');assert.deepEqual(course.language!.keys,[' a ','b']);assert.equal(course.language!.vocabTarget,25);
await fill('Vocabulary source course',' source-two ');await fill('Vocabulary directions','["meaning"]');await click('Next vocabulary entry');assert.equal(field('Vocabulary source course').value,' source ');assert.deepEqual(course.vocab![1].directions,['recall','meaning']);
await fill('Reading publisher',' New publisher ');await fill('Reading level','Intermediate');await fill('Reading isbn','123');assert.equal(course.readingList![0].publisher,' New publisher ');assert.equal(course.readingList![0].isbn,'123');
await fill('Glossary topic (Term)',' New topic ');assert.equal(course.glossary[0].topic,' New topic ');
await fill('New clip key','Word');await click('Add audio entry');await fill('Spoken replacement','  Exact pronunciation  ');assert.equal(course.audio!.Word,'say:  Exact pronunciation  ');await fill('New clip key','ｗｏｒｄ!');await click('Add audio entry');assert.equal(Object.keys(course.audio!).length,1,'normalized collisions blocked');
await fill('Calculator','none');await fill('Read-aloud setting','');assert.equal(Object.hasOwn(course,'readAloud'),false);
let question={id:'q',topic:'Topic',stem:'Prompt',audio:{text:' Original transcript ',lang:'xx'},blend:['c[k]','a'],listen:' word '} as import('../src/lib/courseContentTypes').Question;
const renderQuestion=()=>root.render(createElement(QuestionAudioEditor,{question,onChange:next=>{question=next;renderQuestion();}}));await act(async()=>renderQuestion());await fill('Transcript or spoken text','  Exact transcript\n ');await fill('Blending sound units (one per line)','c[k]\n a \nt');assert.equal(question.audio!.text,'  Exact transcript\n ');assert.deepEqual(question.blend,['c[k]',' a ','t']);await click('Use course voice language');assert.equal(Object.hasOwn(question.audio!,'lang'),false);
let callbacks=0;let current:string|undefined;
const renderUpload=()=>root.render(createElement(EmbeddedAudioInput,{label:'Test audio',value:current,onChange:v=>{callbacks++;current=v;renderUpload();}}));await act(async()=>renderUpload());
async function upload(file:File){const input=document.querySelector('input[type=file]')!;Object.defineProperty(input,'files',{value:[file],configurable:true});await act(async()=>{input.dispatchEvent(new dom.window.Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,20));});}
await upload(new dom.window.File(['x'],'x.html',{type:'text/html'}));assert.equal(callbacks,0);assert.match(document.body.textContent!,/supported audio MIME/);
await upload(new dom.window.File([new Uint8Array(400001)],'large.wav',{type:'audio/wav'}));assert.equal(callbacks,0);
await upload(new dom.window.File([new Uint8Array([0])],'tiny.wav',{type:'audio/wav'}));assert.equal(callbacks,1);assert.equal(current,'data:audio/wav;base64,AA==');assert.equal(document.querySelectorAll('audio').length,0,'editor never autoplays audio');
// A slow read cannot overwrite a subsequent removal or unmounted editor.
let pending:{result:string;onload:()=>void}|undefined;
class DeferredReader{result='data:audio/wav;base64,AQ==';onload=()=>{};onerror=()=>{};readAsDataURL(){pending=this;}}
Object.assign(globalThis,{FileReader:DeferredReader});await upload(new dom.window.File(['x'],'slow.wav',{type:'audio/wav'}));await click('Remove Test audio');const after=callbacks;await act(async()=>pending!.onload());assert.equal(callbacks,after);assert.equal(current,undefined);
await upload(new dom.window.File(['x'],'slow.wav',{type:'audio/wav'}));await act(async()=>root.unmount());await act(async()=>pending!.onload());assert.equal(callbacks,after);
dom.window.close();console.log('metadata/audio editors: exact fields, bounded DOM, collisions, local upload safety, stale read guards passed');
