import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import ts from 'typescript';
// Execute the exact production ParentArea shell with only its IO/child boundaries replaced.
// Deferred attendance IO makes the family-refresh unmount race deterministic; the actual
// planning/review children are covered separately by their UI and full-browser suites.
const source=await readFile(new URL('../src/pages/ParentArea.tsx',import.meta.url),'utf8');
const start=source.indexOf('export default function ParentArea('),end=source.indexOf('// ---------- Overview ----------',start);
assert(start>=0&&end>start,'Production ParentArea extraction boundaries must remain explicit.');
const shell=source.slice(start,end).replace('export default function ParentArea(','function ParentArea(');
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const React=await import('react'),{createRoot}=await import('react-dom/client');
let mounts=0,unmounts=0;
function Workspace({kind}:{kind:string}){
 const [draft,setDraft]=React.useState(''),[saved,setSaved]=React.useState(false);
 React.useEffect(()=>{mounts++;return()=>{unmounts++;};},[]);
 return React.createElement('section',{'aria-label':kind},React.createElement('input',{'aria-label':'Workspace draft',value:draft,onChange:(e:any)=>setDraft(e.target.value)}),React.createElement('button',{onClick:()=>setSaved(true)},'Finish review'),saved&&React.createElement('p',{role:'status'},'Reviewed version assigned.'));
}
const pending:Array<{id:string;resolve:(records:any)=>void}>=[];
const deps={
 useState:React.useState,useRef:React.useRef,useEffect:React.useEffect,
 loadRecords:(id:string)=>new Promise(resolve=>pending.push({id,resolve})),saveRecords:async()=>{throw Error('No aggregate write expected');},
 isClassroom:()=>false,adultLabel:()=> 'Parent',stateInfo:()=>undefined,fmtDate:(d:string)=>d,
 TABS:[{id:'courses',label:'Courses'},{id:'planning',label:'Planning'},{id:'overview',label:'Overview'}],CLASS_TABS:[],LIVE:false,
 Courses:()=>React.createElement(Workspace,{kind:'Course review'}),HomeschoolPlanningWorkspace:()=>React.createElement(Workspace,{kind:'Planning draft'}),Overview:()=>React.createElement('p',null,'Attendance overview ready'),
};
const compiled=ts.transpileModule(`const {${Object.keys(deps).join(',')}} = deps;\n${shell}\nreturn ParentArea;`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None,jsx:ts.JsxEmit.React}}).outputText;
const ParentArea=new Function('React','deps',compiled)(React,deps);
const initial={format:'erudior-family',version:1,state:'',year:{start:'2026-08-01',end:'2027-07-31'},students:[{id:'child',name:'Synthetic',grade:9,assigned:[]}]};
const api={go:()=>{},toast:()=>{}};const root=createRoot(document.getElementById('root')!);
const render=async(family:any,tab:string)=>React.act(async()=>root.render(React.createElement(ParentArea,{api,family,tab,onLock:()=>{}})));
async function fill(value:string){const input=document.querySelector<HTMLInputElement>('[aria-label="Workspace draft"]');assert(input,'Independently guarded workspace remains present during aggregate record loading');await React.act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(input,value);input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});return input;}
await render(initial,'courses');assert.equal(pending.length,1);const original=await fill('Personal review draft');await React.act(async()=>document.querySelector('section button')!.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));
assert.match(document.body.textContent!,/Reviewed version assigned/);const refreshed={...initial,students:initial.students.map(s=>({...s,assigned:[{courseId:'community-fixture',subject:'Science'}]}))};
await render(refreshed,'courses');assert.equal(pending.length,2,'Family assignment refresh requests aggregate records again');assert.equal(document.querySelector('[aria-label="Workspace draft"]'),original);assert.equal(original.value,'Personal review draft');assert.match(document.body.textContent!,/Reviewed version assigned/);assert.equal(mounts,1);assert.equal(unmounts,0);
await React.act(async()=>pending[0].resolve({stale:true}));assert.equal(document.querySelector('[aria-label="Workspace draft"]'),original,'Late old attendance response must not replace child state');await React.act(async()=>pending[1].resolve({fresh:true}));assert.match(document.body.textContent!,/Reviewed version assigned/);assert.equal(mounts,1);
await render(refreshed,'planning');const planning=await fill('Unfinished four-year plan');const changed={...refreshed,students:refreshed.students.map(s=>({...s,name:'Synthetic renamed'}))};await render(changed,'planning');assert.equal(pending.length,3);assert.equal(document.querySelector('[aria-label="Workspace draft"]'),planning);assert.equal(planning.value,'Unfinished four-year plan');assert.equal(mounts,2);assert.equal(unmounts,1);
// Other attendance-dependent areas retain their existing loading boundary.
await render(changed,'overview');assert.match(document.body.textContent!,/Loading records/);assert.doesNotMatch(document.body.textContent!,/Attendance overview ready/);await React.act(async()=>pending[2].resolve({fresh:true}));assert.match(document.body.textContent!,/Attendance overview ready/);
await React.act(async()=>root.unmount());assert.equal(mounts,unmounts);console.log('ParentArea production shell: pending attendance/family refresh preserves independent course confirmation and planning draft; dependent overview remains gated.');
