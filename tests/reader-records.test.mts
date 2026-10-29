import assert from "node:assert/strict";
import {persistReaderBook,type ReaderRecordIO} from "../src/lib/readerRecords.ts";
const book={title:"Original",author:"Writer",subject:"Language",note:"Read locally",date:"2026-10-28",minutes:2,textKey:"course/text"};
function fixture(){const state=new Map<string,string>([["family",JSON.stringify({students:[{id:"learner"},{id:"other"}]})]]);let before:(()=>void)|undefined,after:(()=>void)|undefined,writes=0;
 const io:ReaderRecordIO={readState:async key=>state.get(key)??null,writeState:async(key,text)=>{writes++;if(text===null)state.delete(key);else state.set(key,text);},updateState:async(key,change)=>{before?.();const next=await change(state.get(key)??null);after?.();await io.writeState(key,next);}};
 const tombstone=()=>{state.set("classroom-submissions",JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:["learner"]}));state.delete("records-learner");};
 return{state,io,tombstone,before:(fn:()=>void)=>{before=fn;},after:(fn:()=>void)=>{after=fn;},writes:()=>writes};}
const normal=fixture();await persistReaderBook("learner",book,false,normal.io);await persistReaderBook("learner",book,false,normal.io);assert.equal(JSON.parse(normal.state.get("records-learner")!).reading.length,1);
const community=fixture();await assert.rejects(persistReaderBook("learner",book,true,community.io),/Community/);assert.equal(community.writes(),0);
const removed=fixture();removed.before(removed.tombstone);await assert.rejects(persistReaderBook("learner",book,false,removed.io),/deleted/);assert(!removed.state.has("records-learner"));
const late=fixture();late.after(late.tombstone);await assert.rejects(persistReaderBook("learner",book,false,late.io),/deleted/);assert(!late.state.has("records-learner"),"late CAS projection is cleaned after deletion");
const absent=fixture();absent.state.set("family",JSON.stringify({students:[{id:"other"}]}));await assert.rejects(persistReaderBook("learner",book,false,absent.io),/no longer/);assert.equal(absent.writes(),0);
const corrupt=fixture();corrupt.state.set("records-learner","{damaged");await assert.rejects(persistReaderBook("learner",book,false,corrupt.io));assert.equal(corrupt.state.get("records-learner"),"{damaged");
console.log("reader records: idempotent original book credit, community denial, deletion-before-write, late-delete cleanup, membership and corrupt-record preservation passed");
