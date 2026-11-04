import assert from "node:assert/strict";
import {readerRevision,reconcileReaderState,applyReaderWrite,ReaderPersistence,READER_PROGRESS_LIMITS,readerPersistence} from "../src/lib/readerPersistence.ts";
import {emptyProgress} from "../src/lib/storage.ts";
import type {ReaderText} from "../src/lib/types.ts";
const text:ReaderText={id:"text",title:"Title",sections:[{id:"one",title:"One",body:"First paragraph",questions:["q1"]},{id:"two",title:"Two",body:"Second paragraph"}]};
const question={id:"q1",stem:"What?",answer:[0]};
const revision=await readerRevision(text,ids=>ids.map(()=>question));
assert.deepEqual(await readerRevision({...text,title:"Retitled",source:"Different attribution"},ids=>ids.map(()=>question)),revision);
const changed=await readerRevision({...text,sections:[{...text.sections[0],body:"Changed"},text.sections[1]]},ids=>ids.map(()=>question));
assert.notEqual(changed.sections.one,revision.sections.one);assert.equal(changed.sections.two,revision.sections.two);
assert.notEqual((await readerRevision(text,ids=>ids.map(()=>({...question,answer:[1]})))).sections.one,revision.sections.one);
let progress=emptyProgress();const controller=new ReaderPersistence("course",text,revision,progress);controller.addTime(10.4,"2026-10-28");controller.finish("one");controller.setPlace("two",2);
let fail=true;const update=async(fn:any)=>{progress=fn(progress);if(fail)throw Error("disk failure");};
assert.equal(await controller.persist(update,()=>true),false);assert.equal(progress.reading!["course/text"].seconds,10);assert.equal(controller.confirmed.seconds,0);assert.equal(controller.confirmed.read.one,undefined);
assert.equal(await controller.persist(update,()=>true),false);assert.equal(progress.activity["2026-10-28"].readingSec,10);
fail=false;assert.equal(await controller.persist(update,()=>true),true);assert.equal(controller.confirmed.seconds,10);assert(controller.confirmed.read.one);
controller.addTime(.6,"2026-10-28");await controller.persist(update,()=>true);assert.equal(progress.reading!["course/text"].seconds,11);
// Reload/another writer rebases against authoritative receipts, not a stale copy.
const tab=new ReaderPersistence("course",text,revision,emptyProgress());tab.addTime(7,"2026-10-28");await tab.persist(update,()=>true);assert.equal(progress.reading!["course/text"].seconds,18);
const replay={writer:controller.writer,time:{"2026-10-28":11},read:{}};progress=applyReaderWrite(progress,"course",text,revision,replay);assert.equal(progress.reading!["course/text"].seconds,18);assert.equal(progress.activity["2026-10-28"].readingSec,18);
controller.finish("two");await controller.persist(update,()=>true);assert(progress.reading!["course/text"].finished);
const prior=progress.reading!["course/text"];const next=reconcileReaderState(prior,text,changed);assert.equal(next.seconds,18);assert.equal(next.section,"two");assert.equal(next.at,2);assert(next.read.two);assert.equal(next.read.one,undefined);assert.equal(next.finished,undefined);assert(next.priorRead!["one:"+revision.sections.one]);assert(next.completedRevisions![revision.revision]);
const reverted=reconcileReaderState(next,text,revision);assert(reverted.read.one&&reverted.finished);
const legacy=reconcileReaderState({section:"one",at:8,seconds:20,read:{one:"2026-01-01"},last:"2026-01-01"},text,revision);assert.equal(legacy.at,0);assert.deepEqual(legacy.read,{});assert.equal(legacy.priorRead!["one:legacy"],"2026-01-01");assert.equal(legacy.seconds,20);
const full={...progress,reading:{"course/text":{...prior,seconds:READER_PROGRESS_LIMITS.writers,writerSeconds:Object.fromEntries(Array.from({length:READER_PROGRESS_LIMITS.writers},(_,i)=>[`w${i}:2026-10-28`,1]))}}};const before=JSON.stringify(full);assert.throws(()=>applyReaderWrite(full,"course",text,revision,{writer:"overflow",time:{"2026-10-28":1},read:{}}),/limit/);assert.equal(JSON.stringify(full),before);
const blocked=new ReaderPersistence("course",text,revision,progress);blocked.addTime(5);let writes=0;assert.equal(await blocked.persist(async()=>{writes++;},()=>false),false);assert.equal(writes,0);assert(blocked.pending);
const scoped=readerPersistence("student","course",text,revision,progress);scoped.addTime(2);assert.equal(readerPersistence("student","course",text,revision,progress),scoped);assert.notEqual(readerPersistence("other","course",text,revision,progress),scoped);
console.log("reader persistence: semantic revisions, retained history, optimistic failure/retry, reload/multi-writer counters, fractional time, caps, profile/remount isolation passed");

for(const invalid of [{...prior,at:-1},{...prior,last:"2026-02-31"},{...prior,writerSeconds:{"writer:2026-10-28":1000}},{...prior,read:{},finished:"2026-10-28"},{...prior,sectionRevisions:{}}]) assert.throws(()=>reconcileReaderState(invalid,text,revision));

let optimistic=emptyProgress();const originalPending=readerPersistence("revisionpending","course",text,revision,optimistic);originalPending.finish("one");await originalPending.persist(async fn=>{optimistic=fn(optimistic);throw Error("disk");},()=>true);
const secondChanged=await readerRevision({...text,sections:[text.sections[0],{...text.sections[1],body:"Changed second"}]},ids=>ids.map(()=>question));
const newView=readerPersistence("revisionpending","course",text,secondChanged,optimistic);assert.equal(newView.confirmed.read.one,undefined,"revision cannot display an earlier optimistic completion as confirmed");
await newView.persist(async fn=>{optimistic=fn(optimistic);throw Error("disk");},()=>true);assert.equal(newView.confirmed.read.one,undefined);
