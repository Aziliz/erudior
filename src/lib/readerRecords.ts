/** Confirmed official-reader projection, serialized with profile deletion. */
import { emptyRecords, logBook, parseRecords, recordsMutation, type BookEntry } from "./records";
import { validateClassroomSubmissionState } from "./classroomSubmissionStore";
import { loadState, saveState, updateState } from "./storage";
export interface ReaderRecordIO {
 readState(name:string):Promise<string|null>;
 updateState(name:string,change:(previous:string|null)=>string|Promise<string>):Promise<unknown>;
 writeState(name:string,text:string|null):Promise<void>;
}
const defaultIO:ReaderRecordIO={readState:loadState,writeState:saveState,updateState};
export async function persistReaderBook(studentId:string,book:Omit<BookEntry,"id">,community:boolean,io:ReaderRecordIO=defaultIO):Promise<void> {
 if(community)throw Error("Community reading cannot enter official reading records.");
 if(!/^[a-z0-9]{1,24}$/.test(studentId))throw Error("Invalid reader profile");
 const deleted=async()=>validateClassroomSubmissionState(await io.readState("classroom-submissions")).deletedStudentIds?.includes(studentId)??false;
 const key="records-"+studentId;
 await io.updateState(key,async previous=>{
  if(await deleted())throw Error("This learner profile was deleted; its reading log was not recreated.");
  const raw=await io.readState("family");const family=raw===null?null:JSON.parse(raw);
  if(!family||!Array.isArray(family.students)||!family.students.some((s:{id?:unknown})=>s?.id===studentId))throw Error("The learner no longer belongs to this family; its reading log was not changed.");
  const records=previous===null?emptyRecords():parseRecords(previous);
  if(!Array.isArray(records.reading))throw Error("Existing reading records are damaged; no records were replaced.");
  const old=records.reading.find(item=>item.textKey===book.textKey);
  const next=logBook(records,{...book,minutes:Math.max(book.minutes??0,old?.minutes??0)});
  return JSON.stringify(next===records?records:recordsMutation(records,next,"Reading log updated"));
 });
 // Per-key native CAS does not atomically lock tombstones and profile records.
 // As in classroom imports, remove any late write if deletion crossed persistence.
 if(await deleted()){await io.writeState(key,null);throw Error("The learner was deleted during reading-log persistence; its records were removed.");}
}
