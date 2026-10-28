import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:"https://example.test"});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});
const React=await import("react");const {createRoot}=await import("react-dom/client");
const {default:ProgressPage}=await import("../src/pages/ProgressPage.tsx");
const {emptyProgress}=await import("../src/lib/storage.ts");
const {emptyCourse}=await import("../src/lib/course.ts");
const {FOUNDATION_COMPETENCIES}=await import("../src/lib/competencyCatalog.ts");
const {resolveCompetencyEvidence}=await import("../src/lib/competencyEvidence.ts");
const {captureCompetencyEvidence,syncCompetencyLedger,applyCompetencyDecision}=await import("../src/lib/competencyState.ts");
const course=emptyCourse("Synthetic graph test");course.id="math-prealgebra";
course.lessons=[...new Set(FOUNDATION_COMPETENCIES.flatMap(s=>s.lessons[course.id]??[]))].map(id=>({id,module:"module",title:id,topics:[],body:"",quiz:id==="pre-place-value"?["q-place"]:id==="pre-whole-ops"?["q-linked"]:[]}));
course.modules=[{id:"module",title:"Module"}];
const question=(id:string)=>({id,topic:"shared topic",section:"Math",stem:"Synthetic question",choices:["Yes","No"],answer:[0],explanation:"Synthetic explanation"});
course.banks=[{id:"math-prealgebra__test",courseId:course.id,title:"Synthetic bank",questions:[question("q-place"),question("q-linked"),question("q-unrelated")],sections:[{id:"Math",title:"Math"}],exam:{count:3}} as any];
let progress:any=emptyProgress();progress.stats[course.banks[0].id]={"q-place":{seen:100,correct:100,lastCorrect:true,lastSeen:"2026-10-28T20:00:00Z"},"q-unrelated":{seen:100,correct:100,lastCorrect:true,lastSeen:"2026-10-28T20:00:00Z"}};
const graph=resolveCompetencyEvidence(FOUNDATION_COMPETENCIES,[course],{allowMissingCourses:true});
progress=syncCompetencyLedger(progress,await captureCompetencyEvidence(graph,[course],progress,"2026-10-28T20:30:00Z"));
const {competencyPath}=await import("../src/lib/competencyPath.ts");
assert.equal(competencyPath([course],progress).states.some(s=>s.assessedMastered),false,"legacy revisionless scores do not prove current mastery");
// New study after the identity baseline provides current evidence; unrelated old scores remain excluded.
progress={...progress,stats:{...progress.stats,[course.banks[0].id]:{...progress.stats[course.banks[0].id],"q-place":{seen:200,correct:200,lastCorrect:true,lastSeen:"2026-10-28T21:00:00Z"}}}};
progress=syncCompetencyLedger(progress,await captureCompetencyEvidence(graph,[course],progress,"2026-10-28T22:00:00Z"));
const views:any[]=[];let retries=0;
let api:any={courses:[course],allCourses:[course],banks:course.banks,progress,family:{},student:{id:"alice"},go:(v:any)=>views.push(v),toast(){},competencySync:{pending:false,error:""},retryCompetencySync:async()=>{retries++;api.competencySync={pending:false,error:""};},notifyUpdate(){}};
const root=createRoot(document.getElementById("root")!);
const mount=()=>React.act(async()=>root.render(React.createElement(ProgressPage,{api})));
const path=()=>document.querySelector('[aria-labelledby="skill-path-title"]')!;
const text=()=>path().textContent!;
const skillRow=(title:string)=>[...path().querySelectorAll("li")].find(li=>li.querySelector("strong")?.textContent===title)!;
await mount();
assert.match(text(),/1 assessed as mastered/);assert.match(text(),/Whole-number operations/);
const whole=skillRow("Whole-number operations");assert(whole);assert.match(whole.textContent!,/no current linked assessment evidence/);
const practice=[...whole.querySelectorAll("button")].find(b=>b.textContent?.startsWith("Start focused practice"))!;assert(practice);
await React.act(async()=>practice.click());
assert.deepEqual(views.at(-1).session.items.map((item:any)=>item.q.id),["q-linked"],"same-topic unrelated question excluded from launched practice");
assert.equal(views.at(-1).session.intervention.skillId,"math.whole-operations");
assert.equal(path().querySelector("form"),null,"no adult mutation form in learner path");assert.doesNotMatch(text(),/Save adult decision|Reason and evidence for this decision/);
// Adult decisions are explicit instructional guidance, never labeled assessed mastery.
api.progress=applyCompetencyDecision(progress,{id:"manual1",skillId:"math.whole-operations",action:"mastered",reason:"Reviewed prior learning",actorId:"parent",actorName:"Parent",at:"2026-10-28T22:01:00Z"});
await mount();assert.match(text(),/1 assessed as mastered · 1 adult decisions/);assert.match(text(),/Adult placement/);assert.match(text(),/This is not assessed mastery or certification/);assert.match(text(),/Reviewed prior learning/);
// Removing the source course keeps retained prerequisite evidence without offering unavailable practice.
api={...api,courses:[],allCourses:[],banks:[]};await mount();assert.match(text(),/1 assessed as mastered/);assert.match(text(),/Place value/);assert.equal([...path().querySelectorAll("button")].some(b=>/focused practice/.test(b.textContent!)),false);
// Pending and failed synchronization suppress stale guidance and expose retry without granting mastery.
api.competencySync={pending:true,error:""};await mount();assert.match(text(),/Updating the private learning path/);assert.doesNotMatch(text(),/Reviewed prior learning/);
api.competencySync={pending:false,error:"Disk unavailable"};await mount();assert.match(text(),/Learning-path evidence could not be verified: Disk unavailable/);
const retry=[...path().querySelectorAll("button")].find(b=>b.textContent==="Retry learning path")!;await React.act(async()=>retry.click());assert.equal(retries,1);await mount();assert.match(text(),/Reviewed prior learning/);
// Rerendering another learner cannot inherit the prior learner's retained decisions/evidence.
api={...api,student:{id:"bob"},progress:emptyProgress(),competencySync:{pending:false,error:""}};await mount();assert.match(text(),/Install a supported course/);assert.doesNotMatch(text(),/Reviewed prior learning|1 assessed as mastered/);
api.progress={...emptyProgress(),competencies:{version:999}};await mount();assert.match(text(),/Learning-path evidence could not be verified/);assert.equal(path().querySelectorAll("li").length,0);
await React.act(async()=>root.unmount());
console.log("competency learner UI: exact-ID practice, same-topic exclusion, retained prerequisites, manual distinction, pending/error/retry, no adult mutation controls and profile isolation passed");
