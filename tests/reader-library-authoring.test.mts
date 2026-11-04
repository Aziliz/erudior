import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { emptyCourse } from "../src/lib/course.ts";
import type { Course } from "../src/lib/types.ts";
import type { AppApi } from "../src/App.tsx";
import { validateReaderTexts } from "../src/lib/readerContent.ts";
import { requestNavigation } from "../src/lib/navigationGuard.ts";
const dom = new JSDOM("<!doctype html><div id='root'></div>", {url:"https://example.test"});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,localStorage:dom.window.localStorage,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});
const {createElement,act}=await import("react");const {createRoot}=await import("react-dom/client");
const {default:CourseEditor}=await import("../src/pages/CourseEditor.tsx");
const root=createRoot(document.getElementById("root")!);
const course=emptyCourse("Reading workshop");
const question=(id:string,stem:string)=>({id,stem,topic:"Reading",choices:["Yes","No"],answer:[0],explanation:""});
course.banks=[{id:"first",title:"First bank",questions:[question("q1","Explain the passage.")]},{id:"other",title:"Other bank",questions:[question("q2","Not a first-bank question.")]}];
const original=structuredClone(course);let saved:Course|undefined,saves=0;const notices:string[]=[];
const api={courses:[course],progress:{},toast:(message:string)=>notices.push(message),saveCourse:async(value:Course)=>{await new Promise(resolve=>setTimeout(resolve,5));saved=structuredClone(value);saves++;},go:()=>{}} as unknown as AppApi;
function button(text:string){const found=[...document.querySelectorAll("button")].find(el=>el.textContent?.trim()===text);assert.ok(found,text);return found;}
function field(text:string){const label=[...document.querySelectorAll("label")].find(el=>el.firstChild?.textContent===text);assert.ok(label,text);const found=label.querySelector("input,textarea,select");assert.ok(found,text);return found as HTMLInputElement;}
async function click(text:string){await act(async()=>button(text).click());}
async function fill(label:string,value:string){const el=field(label);const proto=el.tagName==="SELECT"?dom.window.HTMLSelectElement.prototype:el.tagName==="TEXTAREA"?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;await act(async()=>{Object.getOwnPropertyDescriptor(proto,"value")!.set!.call(el,value);el.dispatchEvent(new dom.window.Event(el.tagName==="SELECT"?"change":"input",{bubbles:true}));});}
async function waitFor(check:()=>boolean){const end=Date.now()+3000;while(!check()){assert.ok(Date.now()<end,"bounded asynchronous completion");await act(async()=>{await new Promise(resolve=>setTimeout(resolve,10));});}}
await act(async()=>root.render(createElement(CourseEditor,{api,course})));
await click("Reading library");await click("Add reading text");await fill("Text title","Reading example");await fill("Text author","Example author");await fill("Publication date or period","c. 1900");await fill("Text language","en-GB");await fill("Reading subject","Literature");await fill("About this text","An **introduction**.");await fill("Source, edition and rights attribution","Author-provided example; permission documented separately.");await fill("Line number interval (0 hides, blank uses default)","5");
await click("Add text glossary term");await fill("Glossary 1 term","observe");await fill("Glossary 1 definition","Notice carefully.");await fill("Glossary 1 topic","Close reading");await fill("Glossary 1 aliases (one per line)","observed\nobserving");
await click("Add section");await fill("Section title","Opening");await fill("Section body","An original example paragraph.");await click("Add footnote");const footnoted=field("Section body").value;assert.match(footnoted,/\[\^note1\]: Footnote explanation/);
assert.equal(document.body.textContent!.includes("Link question q2"),false,"question picker uses only first bank");await click("Link question q1: Explain the passage.");assert.equal(button("Remove section").disabled,true);assert.equal(button("Remove reading text").disabled,true);
await click("Add section");await fill("Section title","Closing");await fill("Section body","An original closing paragraph.");await click("Move section earlier");assert.equal(button("Move section earlier").disabled,true);
assert.equal(requestNavigation(),false,"reader edits share existing dirty-navigation guard");
for(const kind of ["poem","play","document"]){await click("Add reading text");await fill("Text title",`${kind} example`);await fill("Text kind",kind);await click("Add section");await fill("Section title",`${kind} part`);await fill("Section body",kind==="play"?"SPEAKER: An original line.\n[Pauses]":"Original line one.\nOriginal line two.");}
await click("Save course");await waitFor(()=>saves===1);assert.ok(saved);assert.deepEqual(validateReaderTexts(saved.texts,{questionIds:["q1"]}),[]);assert.deepEqual(course,original,"editor does not mutate original course");
const texts=structuredClone(saved.texts!);assert.deepEqual(texts.map(t=>t.kind),["prose","poem","play","document"]);assert.deepEqual(texts[0].sections.map(s=>s.title),["Closing","Opening"]);assert.equal(texts[0].sections[1].body,footnoted);assert.deepEqual(texts[0].glossary![0].aliases,["observed","observing"]);assert.equal(texts[0].glossary![0].topic,"Close reading");assert.equal(texts[0].source,"Author-provided example; permission documented separately.");
await act(async()=>root.render(createElement(CourseEditor,{key:"reopened",api:{...api,courses:[saved!]},course:saved!})));
await click("Reading library");await click("Edit text: Reading example");assert.equal(field("Text author").value,"Example author");await click("Edit section: Opening");assert.equal(field("Section body").value,footnoted);await fill("Section title","Renamed opening");await fill("Section body",footnoted+"\nMissing note[^missing]");await click("Save course");assert.equal(saves,1);assert.match(notices.at(-1)!,/reading library/i);
await fill("Section body",footnoted);await click("Save course");await waitFor(()=>saves===2);assert.equal(saved!.texts![0].id,texts[0].id);assert.equal(saved!.texts![0].sections[1].id,texts[0].sections[1].id);
await click("Unlink question q1");await click("Remove section");await click("Keep reading content");assert.equal(field("Section title").value,"Renamed opening");await click("Remove section");await click("Confirm reading removal");await click("Save course");await waitFor(()=>saves===3);assert.equal(saved!.texts![0].sections.length,1);
// Existing learner references cannot be silently orphaned by deletion.
const progress={reading:{[saved!.id+"/"+texts[0].id]:{section:texts[0].sections[0].id,at:0,seconds:1,read:{[texts[0].sections[0].id]:"2026-10-28"}}}};
await act(async()=>root.render(createElement(CourseEditor,{key:"progress",api:{...api,courses:[saved!],progress} as unknown as AppApi,course:saved!})));
await click("Reading library");await click("Edit text: Reading example");assert.equal(button("Remove reading text").disabled,true);await click("Edit section: Closing");assert.equal(button("Remove section").disabled,true);
// A separately edited bank cannot make save validate stale questions then persist dangling links.
const withReferences={...saved!,texts};
const withoutQuestion={...withReferences,banks:[{...withReferences.banks[0],questions:[]},...withReferences.banks.slice(1)]};
await act(async()=>root.render(createElement(CourseEditor,{key:"changed-bank",api:{...api,courses:[withoutQuestion]},course:withReferences})));
await click("Reading library");await click("Edit text: Reading example");await fill("Text title","Changed title");await click("Save course");assert.equal(saves,3,"validate question links against latest persisted first bank");assert.match(notices.at(-1)!,/first bank/);
await act(async()=>root.unmount());dom.window.close();console.log("reader library authoring: four text kinds, all metadata, glossary/footnotes, first-bank links, stable reorder/reopen, validation, protected deletion and dirty guard passed");
