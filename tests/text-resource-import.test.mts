import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const reads:any[]=[];
class Reader {onload:any;onerror:any;result:any;readAsArrayBuffer(){reads.push(this);}}
Object.assign(globalThis,{FileReader:Reader});
const React=await import('react'),{createRoot}=await import('react-dom/client');
const {default:Input}=await import('../src/components/TextResourceFileInput.tsx');
const root=createRoot(document.getElementById('root')!);let value='Existing',applied=0;
const render=()=>React.act(async()=>root.render(React.createElement(Input,{label:'Prompt',value,onApply:(v:string)=>{value=v;applied++;}})));
const button=(text:string)=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent===text);assert(b,text);return b;};
const click=(text:string)=>React.act(async()=>button(text).click());
async function pick(name='prompt.md',size=50){const input=document.querySelector('input')!;Object.defineProperty(input,'files',{configurable:true,value:[{name,size}]});await React.act(async()=>input.dispatchEvent(new dom.window.Event('change',{bubbles:true})));}
async function complete(text:string){const r=reads.shift();assert(r);r.result=new TextEncoder().encode(text).buffer;await React.act(async()=>r.onload());}
await render();await pick('bad.pdf');assert(document.body.textContent!.includes('not supported'));assert.equal(reads.length,0);
await pick();await complete('<script>window.bad=true</script>\n# Prompt');assert.equal(applied,0);assert.equal(document.querySelectorAll('script').length,0);await click('Cancel Prompt import');assert.equal(value,'Existing');
await pick();await complete('New prompt');value='Newer manual edit';await render();await click('Replace Prompt with file text');assert.equal(value,'Newer manual edit');assert.equal(applied,0);assert(document.body.textContent!.includes('destination changed'));
await pick();await click('Cancel Prompt import');await complete('Late');assert.equal(document.querySelector('pre'),null);assert.equal(applied,0);
await pick();await complete('Valid prompt');await click('Replace Prompt with file text');assert.equal(value,'Valid prompt');assert.equal(applied,1);
await render();await pick();await React.act(async()=>root.unmount());await complete('Unmounted');assert.equal(applied,1);
dom.window.close();console.log('Local text resource import: inert preview, explicit apply, cancel, stale destination, late read and unmount safety pass');
