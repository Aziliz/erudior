import assert from "node:assert/strict";
import {addTime, emptyRecords, loadRecords, MAX_RECORDS_AUDIT, parseRecords, recordsMutation, restoredRecords, saveRecords, updateRecordsAtomic, type RecordsIO} from "../src/lib/records.ts";
import {stateTransactions} from "../src/lib/stateLock.ts";
function fixture() {
  const state = new Map<string,string>(); let exists=true, afterWrite:(()=>void)|undefined;
  const transactions=stateTransactions({read:async key=>state.get(key)??null,write:async(key,v)=>{if(v===null)state.delete(key);else state.set(key,v);},compareAndSwap:async(key,old,next)=>{if((state.get(key)??null)!==old)return false;state.set(key,next);afterWrite?.();return true;}});
  const io:RecordsIO={read:async key=>state.get(key)??null,update:transactions.update,remove:async key=>{state.delete(key);},exists:async()=>exists};
  return {state,io,deleted:()=>{exists=false;state.delete("records-child");},after:(fn:()=>void)=>{afterWrite=fn;}};
}
const f=fixture(); const initial=await loadRecords("child",f.io);
const first=await saveRecords("child",{...initial,days:{"2026-10-30":"present"}},{action:"Attendance confirmed"},f.io);
assert.equal(first.revision,1);assert.equal(first.audit?.[0].action,"Attendance confirmed");
await assert.rejects(saveRecords("child",{...initial,days:{"2026-10-29":"absent"}},{},f.io),/changed in another view/);
assert.equal((await loadRecords("child",f.io)).days["2026-10-30"],"present");
await Promise.all(Array.from({length:10},()=>updateRecordsAtomic("child",r=>addTime(r,"2026-10-30","math",60),{action:"Study time"},f.io)));
const latest=await loadRecords("child",f.io);assert.equal(latest.time["2026-10-30"].math,600);assert.equal(latest.days["2026-10-30"],"present");assert.equal(latest.revision,11);
const second=fixture();second.state.set("records-other",JSON.stringify(first));await saveRecords("child",emptyRecords(),{},second.io);assert.equal(second.state.get("records-other"),JSON.stringify(first));
let active=true;const capture=await loadRecords("child",second.io);active=false;
await assert.rejects(saveRecords("child",capture,{guard:()=>{if(!active)throw Error("Profile changed");}},second.io),/Profile changed/);
const bad=fixture();bad.state.set("records-child","{broken");await assert.rejects(loadRecords("child",bad.io),/quarantined/);await assert.rejects(saveRecords("child",emptyRecords(),{},bad.io),/quarantined/);assert.equal(bad.state.get("records-child"),"{broken");
for(const invalid of [{...emptyRecords(),manual:{}},{...emptyRecords(),time:{today:{math:-2}}},{...emptyRecords(),courses:{math:{credits:Infinity}}},{...emptyRecords(),days:{today:"false"}},JSON.parse('{"format":"erudior-records","version":1,"__proto__":{"polluted":true}}')]) assert.throws(()=>parseRecords(invalid),/damaged/);
// A historical test fixture used a Progress-style finished field; that was never a valid BookEntry.
assert.throws(()=>parseRecords({...emptyRecords(),reading:[{id:'book',title:'Book',author:'Author',finished:'2026-10-27',minutes:1}]}),/damaged/);
const absent=fixture();absent.deleted();await assert.rejects(saveRecords("child",emptyRecords(),{},absent.io),/deleted/);assert.equal(absent.state.size,0);
const crossing=fixture();crossing.after(crossing.deleted);await assert.rejects(saveRecords("child",emptyRecords(),{},crossing.io),/deleted/);assert.equal(crossing.state.size,0);
let bounded=emptyRecords();for(let i=0;i<MAX_RECORDS_AUDIT+5;i++)bounded=recordsMutation(bounded,{...bounded,days:{}},"Edit");assert.equal(bounded.audit?.length,MAX_RECORDS_AUDIT);assert.equal(bounded.revision,MAX_RECORDS_AUDIT+5);
const restored=restoredRecords(first);assert.equal(restored.audit?.[0].origin,"imported");assert(restored.restoredAt);assert.equal(restored.days["2026-10-30"],"present");
console.log("Academic records storage: conflict, atomic increments, isolation, stale view, malformed quarantine, deleted-profile races, audit bounds and imported provenance passed.");
