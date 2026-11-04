import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
const React=await import('react');const {createRoot}=await import('react-dom/client');
class WS {static OPEN=1;static all:WS[]=[];readyState=1;sent:any[]=[];onopen?:()=>void;onmessage?:(e:any)=>void;onclose?:(e:any)=>void;constructor(public url:string){WS.all.push(this)}send(s:string){this.sent.push(JSON.parse(s))}close(){}message(m:any){this.onmessage?.({data:JSON.stringify(m)})}}
Object.assign(globalThis,{WebSocket:WS});
const {setHosting}=await import('../src/lib/live.ts');
const {default:LiveHost}=await import('../src/pages/LiveHost.tsx');
setHosting({code:'ABC123',token:'secret',joinUrl:'https://example.test/?live=ABC123',title:'Synthetic',questions:[{stem:'Q',choices:['A','B'],answer:[0]}]} as any);
const root=createRoot(document.getElementById('root')!);const api:any={toast(){},allCourses:[]};
await React.act(async()=>root.render(React.createElement(LiveHost,{api})));
const ws=WS.all.at(-1)!;
const lobby={t:'state',phase:'lobby',index:-1,total:0,title:'Synthetic',timed:false,seconds:20,deadline:0,question:null,answered:0,players:[],history:[],mode:'individual',teams:[],teamCount:2,cooperative:{correct:0,answered:0}};
await React.act(async()=>{ws.onopen?.();ws.message(lobby)});
assert.equal(ws.sent.filter(m=>m.t==='setup').length,1);
// Repeat state on the same connection is not an uncontrolled resend loop.
await React.act(async()=>ws.message(lobby));assert.equal(ws.sent.filter(m=>m.t==='setup').length,1);
// A lost setup is re-sent after reconnect, not left permanently empty.
await React.act(async()=>ws.onclose?.({code:1006,reason:''}));
await React.act(async()=>new Promise(r=>setTimeout(r,1100)));
const again=WS.all.at(-1)!;assert.notEqual(again,ws);
await React.act(async()=>{again.onopen?.();again.message(lobby)});
assert.equal(again.sent.filter(m=>m.t==='setup').length,1);
// Exhausted transport retries retain the host credential and offer explicit recovery.
const realTimeout=globalThis.setTimeout;
const queued:(()=>void)[]=[];
globalThis.setTimeout=((fn:()=>void,ms:number,...args:any[])=> ms>=500 ? (queued.push(fn),0 as any) : realTimeout(fn,ms,...args)) as any;
try {
  for(let i=0;i<31;i++){
    await React.act(async()=>WS.all.at(-1)!.onclose?.({code:1006,reason:''}));
    if(queued.length) await React.act(async()=>queued.shift()!());
  }
} finally {globalThis.setTimeout=realTimeout;}
assert.match(document.body.textContent!,/room may still be open/);
const live=await import('../src/lib/live.ts');assert.equal(live.hosting?.token,'secret');
const reconnect=[...document.querySelectorAll('button')].find(b=>b.textContent==='Reconnect to room')!;
assert(reconnect);
window.confirm=()=>false;
const forget=[...document.querySelectorAll('button')].find(b=>b.textContent==='Forget room on this device')!;
await React.act(async()=>forget.click());
assert.equal(live.hosting?.token,'secret','canceling local forget retains credential');
await React.act(async()=>reconnect.click());
const resumed=WS.all.at(-1)!;assert.notEqual(resumed,again);
await React.act(async()=>{resumed.onopen?.();resumed.message(lobby)});
assert.equal(resumed.sent.filter(m=>m.t==='setup').length,1);
window.confirm=()=>true;
const close=[...document.querySelectorAll('button')].find(b=>b.textContent==='Close room')!;
await React.act(async()=>close.click());
assert.equal(live.hosting?.token,'secret','close request is not closure acknowledgement');
assert.equal(resumed.sent.at(-1).t,'close');
// A stalled close remains explicitly uncertain; forgetting is a separate local-only choice.
globalThis.setTimeout=((fn:()=>void,ms:number,...args:any[])=> ms>=500 ? (queued.push(fn),0 as any) : realTimeout(fn,ms,...args)) as any;
try {
  for(let i=0;i<31;i++){
    await React.act(async()=>WS.all.at(-1)!.onclose?.({code:1006,reason:''}));
    if(queued.length) await React.act(async()=>queued.shift()!());
  }
} finally {globalThis.setTimeout=realTimeout;}
assert.match(document.body.textContent!,/closure is not confirmed/);
let warning='';
window.confirm=(message)=>{warning=String(message);return true;};
await React.act(async()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Forget room on this device')!.click());
assert.match(warning,/does not close the server room/);
assert.equal(live.hosting,null,'explicit local forget clears only local credential');
await React.act(async()=>root.unmount());setHosting(null);
console.log('live host UI setup acknowledgement/reconnect passed');
