import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import type { AppApi } from "../src/App.tsx";
import type { Progress } from "../src/lib/types.ts";
const dom=new JSDOM("<!doctype html><div id='root'></div>",{url:"https://example.test"});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true,isTauri:true});Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});
const docs=new Map<string,string>();let confirm!:(value:string)=>void;
(dom.window as any).__TAURI_INTERNALS__={invoke:async(cmd:string,args:any)=>{if(cmd==="load_state")return null;if(cmd==="load_item")return docs.get(args.id)??null;if(cmd==="save_item"){docs.set(args.id,args.content);return;}if(cmd==="plugin:dialog|message")return new Promise(resolve=>{confirm=resolve;});throw Error(cmd);}};
const {createElement,act}=await import("react");const {createRoot}=await import("react-dom/client");
const {default:WorkTab}=await import("../src/pages/WorkTab.tsx");const {emptyCourse}=await import("../src/lib/course.ts");const {emptyProgress,useStudentFiles}=await import("../src/lib/storage.ts");
const {getConfirmedAssessedWorkProgress,pendingAssessedWorkSubmission}=await import("../src/lib/assessedWorkSubmissionState.ts");
const root=createRoot(document.getElementById("root")!);let student="learnera",mode="fail",calls=0;let progress:Progress=emptyProgress();
const entry={id:"entry1",courseId:"course",date:"2026-10-28",type:"Music",minutes:15,note:"Scales"};progress.logs=[entry];
const course={...emptyCourse("Practice"),id:"course",activityLog:{title:"Original practice",types:["Music"],uploads:true}};
const api={get student(){return{id:student};},get progress(){return progress;},family:null,toast:()=>{},go:()=>{},updateProgress:async(fn:(p:Progress)=>Progress)=>{calls++;progress=fn(progress);render();if(mode==="fail")throw Error("disk failure");}} as unknown as AppApi;
function render(){root.render(createElement(WorkTab,{api,course}));}
const button=(text:string)=>{const node=[...document.querySelectorAll("button")].find(b=>b.textContent===text);assert(node,text);return node;};
useStudentFiles(student);await act(async()=>render());
await act(async()=>button("Submit activity log snapshot").click());const original=pendingAssessedWorkSubmission(student,"course","activity-log")!.submission;assert.deepEqual(getConfirmedAssessedWorkProgress(progress,student).assessedWorkSubmissions,{});
mode="ok";await act(async()=>button("Retry original activity submission").click());assert.deepEqual(progress.assessedWorkSubmissions![original.id],original);assert.deepEqual(progress.logs,[entry]);
// The file read finishes after a profile switch: it must never append to the new profile.
let readFile!:(buffer:ArrayBuffer)=>void;
const fakeFile={name:"recording.pdf",type:"application/pdf",size:1,arrayBuffer:()=>new Promise<ArrayBuffer>(resolve=>{readFile=resolve;})};
await act(async()=>{const input=document.querySelector('input[type="number"]')!;Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,"value")!.set!.call(input,"10");input.dispatchEvent(new dom.window.Event("input",{bubbles:true}));const upload=document.querySelector('input[type="file"]')!;Object.defineProperty(upload,"files",{value:[fakeFile],configurable:true});upload.dispatchEvent(new dom.window.Event("change",{bubbles:true}));});
const before=calls;await act(async()=>{document.querySelector("form")!.dispatchEvent(new dom.window.Event("submit",{bubbles:true,cancelable:true}));});
await act(async()=>{student="learnerb";useStudentFiles(student);progress=emptyProgress();render();});
await act(async()=>readFile(new Uint8Array([65]).buffer));assert.equal(calls,before);assert.equal(progress.logs,undefined);
// A delayed delete confirmation likewise cannot remove another learner's entries.
await act(async()=>{student="learnerc";useStudentFiles(student);progress={...emptyProgress(),logs:[entry]};render();});
await act(async()=>{[...document.querySelectorAll("button")].find(b=>b.textContent?.startsWith("Delete"))!.click();});
await act(async()=>{student="learnerd";useStudentFiles(student);progress={...emptyProgress(),logs:[entry]};render();});
await act(async()=>confirm("Yes"));assert.equal(calls,before);assert.deepEqual(progress.logs,[entry]);
await act(async()=>root.unmount());
console.log("assessed activity UI: immutable explicit snapshot/retry, legacy log preserved, delayed upload and confirmation profile isolation passed");
