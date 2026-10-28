import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><div id="root"></div>', {url:"https://example.test"});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});
const React = await import("react");
const {createRoot} = await import("react-dom/client");
const {default:Supervisor} = await import("../src/components/CompetencySupervisor.tsx");
const {emptyProgress} = await import("../src/lib/storage.ts");
const {FOUNDATION_COMPETENCIES} = await import("../src/lib/competencyCatalog.ts");
const fresh=()=>({...emptyProgress(),competencies:{version:1,sources:[],snapshots:[],decisions:[]}});
const records:any={alice:fresh(),bob:fresh()};
let family:any={students:[{id:"alice",name:"Alice"},{id:"bob",name:"Bob"}]};
let fail=false, calls:any[]=[], delayedLoad:((p:any)=>void)|undefined, delayedSave:(()=>void)|undefined, deferLoad=false,deferSave=false;
const access={load:async(id:string)=>{if(deferLoad && id==="alice")return new Promise<any>(resolve=>{delayedLoad=resolve;});return structuredClone(records[id]);},decide:async(id:string,input:any)=>{
  calls.push({id,input});if(fail)throw Error("Adult area is locked");
  if(deferSave)await new Promise<void>(resolve=>{delayedSave=resolve;});
  if(!records[id].competencies.decisions.some((d:any)=>d.id===input.id))records[id].competencies.decisions.push({...input,actorId:"parent",actorName:"Parent",at:"2026-10-28T22:00:00.000Z"});
  return structuredClone(records[id]);
}};
const api:any={allCourses:[],competencySupervisor:access};
const root=createRoot(document.getElementById("root")!);
const mount=()=>React.act(async()=>root.render(React.createElement(Supervisor,{api,family})));
const field=(label:string)=>{const l=[...document.querySelectorAll("label")].find(l=>l.querySelector("span")?.textContent===label);assert(l,label);return l.querySelector("input,textarea,select") as HTMLInputElement;};
async function fill(label:string,value:string){const input=field(label);await React.act(async()=>{const proto=input.tagName==="TEXTAREA"?dom.window.HTMLTextAreaElement.prototype:input.tagName==="SELECT"?dom.window.HTMLSelectElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,"value")!.set!.call(input,value);input.dispatchEvent(new dom.window.Event(input.tagName==="SELECT"?"change":"input",{bubbles:true}));});}
const text=()=>document.body.textContent!;
const submit=()=>React.act(async()=>document.querySelector("form")!.dispatchEvent(new dom.window.Event("submit",{bubbles:true,cancelable:true})));
await mount();
assert.match(text(),/Skill progression for Alice/);assert.match(text(),/Unknown — no current linked assessment evidence/);
assert.equal(document.querySelectorAll("tbody tr").length,FOUNDATION_COMPETENCIES.length);
const axe = (await import("axe-core")).default;
const accessibility = await axe.run(document.getElementById("root")!, {rules:{"color-contrast":{enabled:false}}});
assert.deepEqual(accessibility.violations.map(v=>({id:v.id,impact:v.impact})),[],"accessible supervisor form, table, names and landmarks");
assert.equal(document.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled,true);
await fill("Reason and evidence for this decision","Prior learning reviewed in person");
fail=true;await submit();assert.match(text(),/Decision not confirmed.*Adult area is locked/);assert.equal(records.alice.competencies.decisions.length,0);
const failedId=calls[0].input.id;
fail=false;deferSave=true;
await submit();await submit();assert.equal(calls.length,2,"repeated submit while pending cannot duplicate");assert.equal(calls[1].input.id,failedId,"uncertain retry keeps operation identity");
await React.act(async()=>delayedSave!());deferSave=false;
assert.equal(records.alice.competencies.decisions.length,1);assert.match(text(),/Decision saved for Alice/);assert.match(text(),/Assessment evidence was not changed/);
await fill("Adult decision","revoke");await fill("Reason and evidence for this decision","Return to measured guidance");await submit();
assert.equal(records.alice.competencies.decisions.length,2);assert.match(text(),/Adult decision history \(2\)/);
await fill("Learner to review","bob");assert.match(text(),/Skill progression for Bob/);assert.doesNotMatch(text(),/Prior learning reviewed in person/);assert.equal(field("Reason and evidence for this decision").value,"");
// A slow prior learner load cannot display or overwrite the currently selected learner.
deferLoad=true;await fill("Learner to review","alice");assert.match(text(),/Loading learning paths for Alice/);await fill("Learner to review","bob");await React.act(async()=>delayedLoad!(structuredClone(records.alice)));deferLoad=false;
assert.match(text(),/Skill progression for Bob/);assert.doesNotMatch(text(),/Prior learning reviewed in person/);
// Switching learners while saving never surfaces old success or old private history in the new view.
await fill("Reason and evidence for this decision","Bob evidence only");deferSave=true;await submit();await fill("Learner to review","alice");await React.act(async()=>delayedSave!());deferSave=false;
assert.match(text(),/Skill progression for Alice/);assert.doesNotMatch(text(),/Bob evidence only|Decision saved for Bob/);
// Removing selected learner clears all controls/private data instead of falling back silently.
family={students:[{id:"bob",name:"Bob"}]};await mount();assert.match(text(),/selected learner is no longer available/);assert.equal(document.querySelector("form"),null);
// Missing adult capability fails closed.
await fill("Learner to review","bob");api.competencySupervisor=undefined;await mount();assert.match(text(),/Adult learning-path access is not available/);assert.equal(document.querySelector("form"),null);
await React.act(async()=>root.unmount());
console.log("competency supervisor: unknown evidence, accessible controls, authorization denial, idempotent retry, repeated submit, revoke/history, profile switch/delete and stale read/write isolation passed");
