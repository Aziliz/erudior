import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createKDemoDoc } from './fixtures/community-k-demo-data.ts';
import { validatePublicCommunityCatalog, validatePublicCommunityDetail, validatePublicCommunityEntry, publicCommunityId } from '../src/lib/publicCommunity.ts';
const entry = { id:'public-one', title:'Synthetic K Mathematics', description:'Synthetic public catalog.', author:'Example author', version:1, review:'not_reviewed', subject:'Math', level:'Elementary School', type:'Course', updated:null, counts:{lessons:1,questions:3,cards:1} };
const detail = (id = entry.id, mode:'legacy'|'canonical'='legacy') => { const doc=createKDemoDoc('math',mode); return {...entry,id,title:doc.title,description:doc.description,doc}; };
assert.equal(publicCommunityId('../bad'),false);assert.equal(publicCommunityId('good-id_1'),true);
assert.equal(validatePublicCommunityEntry(entry).subject,'Math');
for(const bad of [{...entry,id:'../bad'}, {...entry,review:['reviewed']}, {...entry,review:'unknown'}, {...entry,counts:{lessons:-1,questions:1,cards:0}}, {...entry,title:{}}, {...entry,version:0}, {...entry,author:'x'.repeat(201)}]) assert.throws(()=>validatePublicCommunityEntry(bad));
assert.throws(()=>validatePublicCommunityCatalog([entry,entry]));assert.throws(()=>validatePublicCommunityCatalog({courses:[entry]}));
for(const mode of ['legacy','canonical'] as const) { const raw=detail(entry.id,mode), before=structuredClone(raw); const parsed=validatePublicCommunityDetail(raw,entry.id); assert.equal(parsed.lessons.length,1); assert.equal(parsed.lessons[0].id,'observe'); assert.deepEqual(raw,before); }
assert.throws(()=>validatePublicCommunityDetail(detail(),'another'));
assert.throws(()=>validatePublicCommunityDetail({...detail(),doc:null},entry.id));
assert.throws(()=>validatePublicCommunityDetail({...detail(),title:'Wrong listing'},entry.id));
const invalid=detail(); invalid.doc.lessons[0].blocks.push({type:'text',md:'<script>alert(1)</script>'});
// User text is rendered as text only by public metadata/outline; unsupported raw document still follows strict validator.
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://erudior.com/community'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,localStorage:dom.window.localStorage,sessionStorage:dom.window.sessionStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const React=await import('react');const {createRoot}=await import('react-dom/client');
const {default:PublicCommunity}=await import('../src/pages/PublicCommunity.tsx');
const {api}=await import('../src/lib/community.ts'); const original={...api};
const root=createRoot(document.getElementById('root')!);
const deferred=<T,>()=>{let resolve!:(value:T)=>void;let reject!:(reason:unknown)=>void;const promise=new Promise<T>((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject};};
const render=(props:Record<string,unknown>={})=>React.act(async()=>root.render(React.createElement(PublicCommunity,props)));
const click=(label:string)=>React.act(async()=>{const button=[...document.querySelectorAll('button')].find(b=>b.textContent===label);assert(button,label);button.click();});
let reads=0,writes=0;api.me=async()=>{throw Error('No identity read allowed')};api.create=async()=>{writes++;throw Error('No creation')};
try {
  api.catalog=async()=>{reads++;return [detail()] as never};await render();
  assert.equal(reads,1);assert(document.body.textContent!.includes('Community courses'));assert(!document.querySelector('button')?.textContent?.includes('Create'));
  let called:string|undefined;await render({onNavigate:(id:string)=>{called=id}});
  await React.act(async()=>{(document.querySelector('a[href="/community/public-one"]') as HTMLElement).click()});assert.equal(called,entry.id);
  const a=deferred<any>(),b=deferred<any>();api.course=(id)=>id==='public-one'?a.promise:b.promise;
  await render({id:'public-one'});await render({id:'public-two'});
  await React.act(async()=>b.resolve(detail('public-two')));assert(document.querySelector('a[href="https://app.erudior.com/community/public-two"]'));
  await React.act(async()=>a.resolve(detail('public-one')));assert(document.querySelector('a[href="https://app.erudior.com/community/public-two"]'));assert(!document.querySelector('a[href="https://app.erudior.com/community/public-one"]'));
  api.course=async()=>{throw Error('Offline')};await render({id:'retry'});assert(document.querySelector('[role="alert"]')?.textContent?.includes('Offline'));
  api.course=async()=>detail('retry') as never;await click('Retry loading courses');assert(document.querySelector('a[href="https://app.erudior.com/community/retry"]'));
  api.course=async()=>({...detail('broken'),doc:null}) as never;await render({id:'broken'});assert(document.body.textContent!.includes('could not be validated'));assert(!document.querySelector('a[href*="app.erudior.com/community/broken"]'));
  api.course=async()=>detail('valid') as never;const start=deferred<void>();let starts=0;
  await render({id:'valid',appContext:true,onStart:()=>{starts++;return start.promise}});
  await React.act(async()=>{const button=[...document.querySelectorAll('button')].find(b=>b.textContent==='Start or open course')!;button.click();button.click()});assert.equal(starts,1);
  await render({id:'valid',appContext:true});await React.act(async()=>start.resolve());assert(!document.querySelector('a[href*="app.erudior.com/community/"]'));assert(document.body.textContent!.includes('Preview only in this profile'));
  await render({id:'../invalid'});assert(document.body.textContent!.includes('link is invalid'));
  assert.equal(writes,0);
} finally {Object.assign(api,original);await React.act(async()=>root.unmount());dom.window.close();}
console.log('Public community metadata, canonical/legacy outlines, anonymous browsing, stale navigation and explicit app start passed');
