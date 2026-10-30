import assert from "node:assert/strict";
import {JSDOM} from "jsdom";
import type {AppApi} from "../src/App.tsx";
import type {Progress,ReaderText} from "../src/lib/types.ts";
const dom=new JSDOM("<!doctype html><main class='main'><div id='root'></div></main>",{url:"https://example.test"});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,Element:dom.window.Element,IS_REACT_ACT_ENVIRONMENT:true,isTauri:true});Object.defineProperty(globalThis,"navigator",{value:dom.window.navigator,configurable:true});
const realNow=Date.now.bind(Date);
let visible="visible";Object.defineProperty(document,"visibilityState",{get:()=>visible,configurable:true});
(dom.window.HTMLElement.prototype as any).scrollIntoView=function(){this.dataset.restored="yes";};
(globalThis as any).requestAnimationFrame=(cb:()=>void)=>setTimeout(cb,0);(globalThis as any).cancelAnimationFrame=(id:any)=>clearTimeout(id);
const intervals=new Map<number,{fn:()=>void,ms:number}>();let intervalId=0;
dom.window.setInterval=((fn:()=>void,ms:number)=>{intervals.set(++intervalId,{fn,ms});return intervalId;}) as any;dom.window.clearInterval=((id:number)=>intervals.delete(id)) as any;
const native=new Map<string,string>(),sessionAttempts:string[]=[];let failSession=false,failRecords=false,recordsWrites=0;let deferSession=false,nativeReady:(()=>void)|undefined;
(dom.window as any).__TAURI_INTERNALS__={invoke:async(cmd:string,args:any)=>{if(cmd==="load_state")return native.get(args.name)??null;if(cmd==="compare_and_swap_state"){if((native.get(args.name)??null)!==args.expected)return false;if(args.name.startsWith("session-")){sessionAttempts.push(args.content);if(failSession)throw Error("question disk failure");}if(args.name.startsWith("records-")){recordsWrites++;if(failRecords)throw Error("record disk failure");}native.set(args.name,args.content);if(deferSession&&args.name.startsWith("session-"))await new Promise<void>(resolve=>{nativeReady=resolve;});return true;}if(cmd==="save_state"){if(args.name.startsWith("records-")){recordsWrites++;if(failRecords)throw Error("record disk failure");}if(args.name.startsWith("session-")){sessionAttempts.push(args.content);if(failSession)throw Error("question disk failure");}native.set(args.name,args.content);if(deferSession&&args.name.startsWith("session-"))await new Promise<void>(resolve=>{nativeReady=resolve;});return;}throw Error(cmd);}};
const {act,createElement}=await import("react");const {createRoot}=await import("react-dom/client");
const {default:Reader}=await import("../src/pages/Reader.tsx");const {emptyCourse}=await import("../src/lib/course.ts");const {emptyProgress,useStudentFiles,saveProfileSessionState}=await import("../src/lib/storage.ts");
native.set("family",JSON.stringify({students:[{id:"readerone"},{id:"readertwo"}]}));
const root=createRoot(document.getElementById("root")!);let student="readerone",mount=0,progress:Progress=emptyProgress(),durable:Progress=structuredClone(progress),fail=false;let calls=0;const views:any[]=[];
let text:ReaderText={id:"text",title:"Offline text",lang:"es-MX",sections:[{id:"s1",title:"First",body:"First paragraph[^n].\n\nSecond paragraph.\n\n[^n]: Footnote detail",questions:["q1"]},{id:"s2",title:"Second",body:"Last section."}]};
let course={...emptyCourse("Reading"),id:"course",texts:[text],community:{id:"community"} as any,banks:[{id:"bank",title:"Questions",questions:[{id:"q1",section:"s",stem:"What?",choices:["A","B"],answer:[0]}]} as any]};
const api={get progress(){return progress;},get student(){return{id:student,name:student};},family:{mode:"homeschool"},saveLearnerSession:async(content:string|null)=>{const profile=student;await saveProfileSessionState(profile,content,()=>{if(student!==profile)throw Error("Learner changed during session save");});},toast:()=>{},go:(view:any)=>views.push(view),updateProgress:async(fn:(p:Progress)=>Progress)=>{calls++;progress=fn(progress);render();if(fail)throw Error("disk failure");durable=structuredClone(progress);}} as unknown as AppApi;
function render(){root.render(createElement(Reader,{key:mount,api,course,text}));}
async function waitFor(fn:()=>boolean,label:string){const until=realNow()+5000;while(!fn()){assert(realNow()<until,label);await act(async()=>{await new Promise(r=>setTimeout(r,5));});}}
const button=(label:string)=>{const b=[...document.querySelectorAll("button")].find(b=>b.textContent===label||b.getAttribute("aria-label")===label);assert(b,label);return b;};
async function click(label:string){await act(async()=>button(label).click());}
useStudentFiles(student);await act(async()=>render());await waitFor(()=>!!document.querySelector(".reader-text"),"offline text opened");await waitFor(()=>!document.body.textContent!.includes("not yet confirmed"),"initial position saved");
assert.equal(document.querySelector("article")!.lang,"es");assert.match(document.body.textContent!,/Second paragraph/);
const note=document.querySelector<HTMLButtonElement>(".fn-ref")!;assert(note);note.focus();await act(async()=>note.click());assert(document.querySelector('[role="dialog"]'));await act(async()=>note.dispatchEvent(new dom.window.KeyboardEvent("keydown",{key:"Escape",bubbles:true})));assert.equal(document.querySelector('[role="dialog"]'),null);assert.equal(document.activeElement,note);
// Active time is confirmed only once, pauses while hidden/idle, resumes after input.
let now=realNow();Date.now=()=>now;
const tick=async(ms:number)=>{now+=ms;await act(async()=>{for(const timer of intervals.values())if(timer.ms===5000)timer.fn();});};
const saveTick=async()=>{await act(async()=>{for(const timer of intervals.values())if(timer.ms===30000)timer.fn();});};
await tick(10000);fail=true;await saveTick();assert.equal(progress.reading!["course/text"].seconds,10);assert.equal(durable.reading!["course/text"].seconds,0);
await saveTick();assert.equal(progress.reading!["course/text"].seconds,10,"failed optimistic retry cannot double credit time");
fail=false;await click("Retry saving reading");assert.equal(durable.reading!["course/text"].seconds,10);
await act(async()=>{visible="hidden";document.dispatchEvent(new dom.window.Event("visibilitychange"));});await tick(300000);await saveTick();assert.equal(progress.reading!["course/text"].seconds,10);
await act(async()=>{visible="visible";document.dispatchEvent(new dom.window.Event("visibilitychange"));});await tick(5000);assert.match(document.body.textContent!,/paused while you're away/);
await act(async()=>window.dispatchEvent(new dom.window.KeyboardEvent("keydown",{key:"a"})));await tick(5000);await saveTick();assert.equal(progress.reading!["course/text"].seconds,15);
// Capture second paragraph and persist before navigation; no network content fetch.
const paragraphs=[...document.querySelectorAll<HTMLElement>(".reader-text > p")];paragraphs.forEach((p,i)=>p.getBoundingClientRect=(()=>({bottom:i?100:0,top:0,height:10,left:0,right:100,width:100,x:0,y:0,toJSON(){}})) as any);
await act(async()=>document.querySelector("main")!.dispatchEvent(new dom.window.Event("scroll")));
await click("Next part");assert.equal(durable.reading!["course/text"].section,"s2");await click("Previous part");
// Completion remains unconfirmed after optimistic failure and survives remount as a retry.
fail=true;await click("I've read this part: next");assert.match(document.body.textContent!,/disk failure/);assert.doesNotMatch(document.body.textContent!,/You finished this part/);
await act(async()=>{mount++;render();});await waitFor(()=>!!document.querySelector(".reader-text"),"remount");assert.match(document.body.textContent!,/not yet confirmed/);
fail=false;await click("Retry saving reading");assert(progress.reading!["course/text"].read.s1);assert.match(document.body.textContent!,/You finished this part/);
await click("Next part");await click("I've finished the book");assert(progress.reading!["course/text"].finished);assert.equal(recordsWrites,0);assert.match(document.body.textContent!,/community reading stays outside official/);assert.doesNotMatch(document.body.textContent!,/it's in .*reading log/);
// Revised first section does not inherit completion; unchanged second stays read.
await act(async()=>{text={...text,sections:[{...text.sections[0],body:"Revised body."},text.sections[1]]};course={...course,texts:[text]};render();});await waitFor(()=>!!document.querySelector(".reader-text"),"revised text");await waitFor(()=>!document.body.textContent!.includes("not yet confirmed"),"revision persisted");assert.equal(progress.reading!["course/text"].finished,undefined);assert(progress.reading!["course/text"].read.s2);assert(progress.reading!["course/text"].priorRead);
await click("Previous part");failSession=true;await click("Answer the questions");assert.equal(views.length,0);assert.match(document.body.textContent!,/question disk failure/);const firstSession=JSON.parse(sessionAttempts.at(-1)!);
failSession=false;await click("Retry question launch");assert.equal(views.at(-1).session.id,firstSession.session.id);assert.equal(JSON.parse(native.get("session-readerone")!).session.id,firstSession.session.id);
// A delayed session save remains bound to its captured learner and cannot navigate a new one.
deferSession=true;await click("Answer the questions");await waitFor(()=>!!nativeReady,"question save entered");const priorViews=views.length;
// New profile gets no old position or finished indicator.
await act(async()=>{student="readertwo";useStudentFiles(student);progress=emptyProgress();durable=structuredClone(progress);mount++;render();});await waitFor(()=>!!document.querySelector(".reader-text"),"new learner");assert.equal(document.querySelector("select")!.value,"s1");assert.doesNotMatch(document.body.textContent!,/You finished this part/);
await act(async()=>nativeReady!());deferSession=false;assert.equal(views.length,priorViews);assert.equal(native.has("session-readertwo"),false);
// Official completion writes one retryable log entry, never duplicate book credit.
await act(async()=>{course={...course,community:undefined};render();});await waitFor(()=>!!document.querySelector(".reader-text"),"official reader");await click("I've read this part: next");failRecords=true;await click("I've finished the book");assert.match(document.body.textContent!,/reading-log entry is not confirmed/);failRecords=false;await click("Retry saving reading");assert.equal(JSON.parse(native.get("records-readertwo")!).reading.length,1);
await act(async()=>{mount++;render();});await waitFor(()=>!!document.querySelector(".reader-text"),"official reload");await waitFor(()=>document.body.textContent!.includes("it's in"),"log reconciled");assert.equal(JSON.parse(native.get("records-readertwo")!).reading.length,1);
// Verse line numbering and language remain available offline with native keyboard controls.
await act(async()=>{text={id:"poem",title:"Poem",kind:"poem",lineNumbers:1,lang:"fr-CA",sections:[{id:"verse",title:"Verse",body:"First line\nSecond line"}]};course={...course,texts:[text],community:{id:"community"} as any};mount++;render();});
await waitFor(()=>!!document.querySelector(".is-verse"),"verse rendered");assert.equal(document.querySelectorAll(".ln").length,2);assert.equal(document.querySelector("article")!.lang,"fr");assert(document.querySelector('h2[tabindex="-1"]'));
await act(async()=>root.unmount());Date.now=realNow;console.log("reader DOM: offline sections, notes/Escape/language, place, failed completion/remount/retry, semantic revision, persisted question retry, profile isolation, community exclusion and official log recovery passed");
