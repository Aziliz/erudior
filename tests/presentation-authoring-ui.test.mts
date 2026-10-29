import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,HTMLInputElement:dom.window.HTMLInputElement,HTMLTextAreaElement:dom.window.HTMLTextAreaElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const React=await import('react'),{createRoot}=await import('react-dom/client');
const {default:Presentations}=await import('../src/pages/Presentations.tsx');
const {emptyCourse}=await import('../src/lib/course.ts');
const {createPresentationStore}=await import('../src/lib/presentationStore.ts');
const {parsePresentationLibrary,presentationSources}=await import('../src/lib/presentations.ts');
const {stateTransactions}=await import('../src/lib/stateLock.ts');
const {requestNavigation}=await import('../src/lib/navigationGuard.ts');
let state:string|null=null,failWrite=false,release:(()=>void)|null=null,saveCalls=0;
const tx=stateTransactions({read:async()=>state,write:async(_,v)=>{state=v;},compareAndSwap:async(_,expected,value)=>{if(failWrite)throw Error('Synthetic disk unavailable');if(release)await new Promise<void>(resolve=>{release=resolve;});if(state!==expected)return false;state=value;return true;}});
const backing=createPresentationStore({read:async()=>state,update:f=>tx.update('presentations',f),authorize:async()=>'unlocked-adult'});
const service={...backing,save:async(...args:Parameters<typeof backing.save>)=>{saveCalls++;return backing.save(...args);}};
const course=emptyCourse('Synthetic teaching source');course.id='source';course.revision=1;
course.lessons=[{id:'lesson',module:'m',title:'First lesson',body:'Complete source text.'}];
course.banks=[{id:'bank',title:'Review bank',questions:[{id:'q',stem:'Which synthetic option?',choices:['First option','Second option'],answer:[1],topic:'Topic'}]}];
const toasts:string[]=[];const api:any={allCourses:[course],presentationLibrary:service,toast:(s:string)=>toasts.push(s)};
const root=createRoot(document.getElementById('root')!);
const render=()=>React.act(async()=>{root.render(React.createElement(Presentations,{api}));});
const button=(label:string)=>{const b=[...document.querySelectorAll<HTMLButtonElement>('button')].find(b=>b.textContent===label||b.getAttribute('aria-label')===label);assert(b,`Missing button: ${label}`);return b;};
const click=async(label:string)=>{const b=button(label);assert(!b.disabled,`Disabled button: ${label}`);await React.act(async()=>b.click());};
const field=(label:string)=>{const e=document.querySelector<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>(`[aria-label="${label}"]`);assert(e,`Missing field: ${label}`);return e;};
const input=async(label:string,value:string)=>{const e=field(label);await React.act(async()=>{const proto=e.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:e.tagName==='SELECT'?dom.window.HTMLSelectElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(e,value);e.dispatchEvent(new dom.window.Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));});};
const saved=()=>parsePresentationLibrary(state).decks;
await render();assert.equal(requestNavigation(),true);
await click('New presentation');assert.equal(requestNavigation(),false);assert.match(toasts.at(-1)!,/Save or explicitly discard/);
await input('Presentation title','');assert(button('Save presentation').disabled);assert.match(document.body.textContent!,/Invalid presentation/,'empty title renders an error rather than throwing');
await input('Presentation title','My reusable lesson');
const sources=presentationSources([course]).slides;
await input('Presentation resource',sources.find(s=>s.kind==='content')!.id);await click('Add selected slide');
await input('Presentation resource',sources.find(s=>s.kind==='question')!.id);await click('Add selected slide');
assert.equal(document.querySelectorAll('.presentation-slides > li').length,2);
await click('Move slide 2 up');assert.match(document.querySelector('.presentation-slides > li')!.textContent!,/Review bank/);
await click('Move slide 1 down');assert.match(document.querySelector('.presentation-slides > li')!.textContent!,/First lesson/);
await click('Save presentation');assert.equal(saved().length,1);assert.equal(saved()[0].slides.length,2);assert.equal(requestNavigation(),true);
await click('Reload library');await click('My reusable lesson · 2 slides · revision 1');assert.equal((field('Presentation title') as HTMLInputElement).value,'My reusable lesson');
// A transient video form is protected even before Apply mutates the deck.
await click('Video settings for slide 2');await input('Video URL','https://media.school.org/clip.mp4');assert.equal(requestNavigation('history'),false);assert(button('Save presentation').disabled);assert(button('Remove slide 1').disabled);
await click('Cancel video changes');assert.equal(requestNavigation(),true);assert.equal(saved()[0].slides[1].kind,'question');
await click('Video settings for slide 2');await input('Video URL','https://media.school.org/clip.mp4');await input('Video transcript','Synthetic accessible equivalent.');await input('Video pause seconds','8');
const reviewed=[...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].find(e=>e.parentElement?.textContent?.includes('I reviewed'));assert(reviewed);await React.act(async()=>reviewed.click());await click('Apply video question');assert.equal(requestNavigation(),false);await click('Save presentation');assert.equal(saved()[0].slides[1].kind,'video');
// Source replacement prevents delivery of stale content, without losing the saved resource.
api.allCourses=[{...course,revision:2}];await render();assert(button('Teacher-paced preview').disabled);assert.match(document.body.textContent!,/exact installed source is missing, changed or unsupported/);assert.equal(saved().length,1);api.allCourses=[course];await render();assert(!button('Teacher-paced preview').disabled);
await click('Duplicate presentation');assert.equal(requestNavigation(),false);await click('Remove slide 1');assert.equal(document.querySelectorAll('.presentation-slides > li').length,1);await click('Save presentation');assert.equal(saved().length,2);assert.equal(saved()[1].slides.length,1);assert.equal(saved()[0].slides.length,2,'copy editing must not mutate original');
await input('Presentation title','Unsaved failed edit');failWrite=true;await click('Save presentation');assert.match(document.body.textContent!,/Synthetic disk unavailable/);assert.equal((field('Presentation title') as HTMLInputElement).value,'Unsaved failed edit');assert.equal(requestNavigation(),false);failWrite=false;
await click('Discard unsaved changes');assert.equal(requestNavigation(),true);assert.equal((field('Presentation title') as HTMLInputElement).value,'My reusable lesson (copy)');
// An external writer wins CAS; editor retains its own draft and reports the conflict.
const current=saved()[1];await backing.save({...current,title:'Another window'},current.revision);await input('Presentation title','My conflicting draft');await click('Save presentation');assert.match(document.body.textContent!,/changed elsewhere/);assert.equal((field('Presentation title') as HTMLInputElement).value,'My conflicting draft');assert.equal(saved()[1].title,'Another window');assert.equal(requestNavigation(),false);
await click('Discard unsaved changes');await click('Reload library');await click('Another window · 1 slides · revision 2');await input('Presentation title','One save only');
// Two rapid clicks during an outstanding write cause one mutation, not two revisions.
release=()=>{};const beforeCalls=saveCalls;await React.act(async()=>{const b=button('Save presentation');b.click();b.click();await new Promise(r=>setTimeout(r,0));});assert.equal(saveCalls,beforeCalls+1);assert.equal(requestNavigation(),false);const unblock=release!;release=null;await React.act(async()=>{unblock();await new Promise(r=>setTimeout(r,0));});assert.equal(saved().length,2);assert.equal(saved()[1].revision,3);assert.equal(saved()[1].title,'One save only');assert.equal(requestNavigation(),true);
await click('Delete this saved presentation');assert.equal(saved().length,1);assert.match(document.body.textContent!,/Presentation deleted/);
await React.act(async()=>root.unmount());assert.equal(requestNavigation(),true,'unmounted editor removes navigation veto');
// Wiring is deliberately checked separately from the component fixture: storage authority
// is re-read after await, not derived from a stale rendered adult flag.
const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');const wiring=app.slice(app.indexOf('const presentationLibrary = createPresentationStore'),app.indexOf('const api: AppApi'));
assert.match(wiring,/loadState\("presentations"\)/);assert.match(wiring,/updateState\("presentations", change\)/);assert.equal((wiring.match(/adultAccess\.current\.unlocked/g)||[]).length,2);assert.match(wiring,/await loadFamily\(\)/);
console.log('presentation authoring UI: create/source/reorder/save/reopen/copy/delete, invalid title, stale source, video/navigation protection, failed and conflicting saves, repeated-save guard passed');

// A cancelled browser picker releases the editor rather than leaving its async lock pending.
const storage=await import('../src/lib/storage.ts');const create=document.createElement.bind(document);
document.createElement=((tag:string,...args:any[])=>{const element=(create as any)(tag,...args);if(tag==='input')element.click=()=>element.dispatchEvent(new dom.window.Event('cancel'));return element;}) as typeof document.createElement;
try{assert.equal(await Promise.race([storage.pickJsonFile(),new Promise(resolve=>setTimeout(()=>resolve('stuck'),100))]),null);}finally{document.createElement=create;}
console.log('presentation import picker cancellation releases the pending action');
