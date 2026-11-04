/** Versioned original assessed work. Learner evidence is never an academic grade. */
import type { ActivityLogSpec, Lab, Rubric, WritingTask } from "./courseWork";
import { validateAssessedWorkTaskV1 } from "./assessedWorkTaskV1";
import type { LogEntry, WorkRecord, WorkFile } from "./work";
export interface AssessedWorkSubmission {
  version: 1;
  id: string;
  submittedAt: number;
  courseId: string;
  assignmentId: string;
  kind: "writing" | "lab" | "log";
  task: WritingTask | Lab | ActivityLogSpec;
  rubric?: Rubric;
  response: WorkRecord | LogEntry[];
  files: Record<string, { mime: string; data: string }>;
}
export type AssessedWorkSubmissionMap = Record<string, AssessedWorkSubmission>;
export const ASSESSED_WORK_LIMITS = { count: 100, submissionBytes: 16 * 1024 * 1024, aggregateBytes: 32 * 1024 * 1024, files: 50, entries: 1000, text: 200000, nodes: 100000, depth: 32 } as const;
const plain = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const text = (value: unknown, max: number = ASSESSED_WORK_LIMITS.text): value is string => typeof value === "string" && value.length <= max;
const id = (value: unknown): value is string => text(value,200) && /^[A-Za-z0-9_-]+$/.test(value) && !["__proto__", "constructor", "prototype"].includes(value);
const day = (value: unknown): value is string => text(value,10) && /^\d{4}-\d\d-\d\d$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
const timestamp = (value: unknown): value is string => text(value,40) && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?(?:Z|[+-]\d\d:\d\d)$/.test(value) && day(value.slice(0,10)) && Number.isFinite(Date.parse(value));
const mime = (value: unknown): value is string => text(value,200) && /^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/i.test(value);
/** Canonical finite JSON; bounded traversal and no silently dropped data. */
export function assessedWorkJSON(value: unknown): string {
 let nodes=0; const seen=new Set<object>();
 function visit(value: unknown, depth: number): string {
  if(++nodes>ASSESSED_WORK_LIMITS.nodes || depth>ASSESSED_WORK_LIMITS.depth) throw Error("Assessed work exceeds structural limits");
  if(value===null || typeof value==="boolean" || typeof value==="string") return JSON.stringify(value);
  if(typeof value==="number" && Number.isFinite(value)) return JSON.stringify(value);
  if(typeof value!=="object" || seen.has(value) || (!Array.isArray(value)&&!plain(value))) throw Error("Assessed work must be finite acyclic JSON");
  seen.add(value);
  try { return Array.isArray(value) ? `[${Array.from(value, child=>visit(child,depth+1)).join(",")}]` : `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${visit((value as Record<string, unknown>)[key],depth+1)}`).join(",")}}`; }
  finally {seen.delete(value);}
 }
 return visit(value,0);
}
const bytes = (value: unknown) => new TextEncoder().encode(assessedWorkJSON(value)).length;
function frozen<T>(value:T):T { const clone=structuredClone(value); const freeze=(v:unknown)=>{if(v&&typeof v==="object"){Object.values(v).forEach(freeze);Object.freeze(v);}};freeze(clone);return clone; }
function fileRefs(response: WorkRecord | LogEntry[]): WorkFile[] { return Array.isArray(response) ? response.flatMap(entry=>entry.file ? [entry.file] : []) : response.photos ?? []; }

export function validateAssessedWorkSubmission(value: unknown): string[] {
 try {
  if(!plain(value)) return ["Assessed work submission must be an object"];
  if(value.version!==1) return ["Unsupported or missing assessed work version"];
  if(bytes(value)>ASSESSED_WORK_LIMITS.submissionBytes) return ["Assessed work submission exceeds byte limit"];
  const errors:string[]=[];
  if(Object.keys(value).some(key=>!["version","id","submittedAt","courseId","assignmentId","kind","task","rubric","response","files"].includes(key))) errors.push("Unknown assessed work evidence field");
  for(const key of ["id","courseId","assignmentId"]) if(!id(value[key])) errors.push(`Invalid ${key}`);
  if(!Number.isSafeInteger(value.submittedAt)||(value.submittedAt as number)<0||!Number.isFinite(new Date(value.submittedAt as number).getTime())) errors.push("Invalid submission time");
  if(!["writing","lab","log"].includes(value.kind as string)) return [...errors,"Invalid assessed work kind"];
  const key=value.kind==="writing"?"writing":value.kind==="lab"?"labs":"activityLog";
  const raw={ [key]: value.kind==="log"?value.task:[value.task], ...(value.rubric===undefined?{}:{rubrics:[value.rubric]}) };
  errors.push(...validateAssessedWorkTaskV1(raw));
  if(!plain(value.task)) return [...errors,"Invalid task snapshot"];
  if(value.kind==="log" ? value.assignmentId!=="activity-log" : value.task.id!==value.assignmentId) errors.push("Task ID does not match snapshot");
  if(value.task.rubric===undefined ? value.rubric!==undefined : !plain(value.rubric)||value.rubric.id!==value.task.rubric) errors.push("Rubric does not match task snapshot");
  const response=value.response;
  if(value.kind==="log") {
   if(!Array.isArray(response)||!response.length||response.length>ASSESSED_WORK_LIMITS.entries) return [...errors,"Invalid activity response"];
   const seen=new Set<string>();
   for(const entry of response) {
    if(!plain(entry)||!id(entry.id)||seen.has(entry.id)||entry.courseId!==value.courseId||!day(entry.date)||!text(entry.type,200)||!entry.type||!Number.isInteger(entry.minutes)||(entry.minutes as number)<1||(entry.minutes as number)>1440||!text(entry.note)) return [...errors,"Invalid activity entry"];
    if(Object.keys(entry).some(key=>!["id","courseId","date","type","minutes","note","file","credited"].includes(key))) errors.push("Unknown activity response field");
    if(entry.credited!==undefined&&!id(entry.credited)) errors.push("Invalid credited learner ID");
    if(!(value.task as unknown as ActivityLogSpec).types.includes(entry.type)&&entry.type!=="Other") errors.push("Unknown activity type");
    seen.add(entry.id);
   }
  } else {
   if(!plain(response)||response.kind!==value.kind||!timestamp(response.started)||!timestamp(response.updated)||!timestamp(response.submitted)||Date.parse(response.submitted as string)!==value.submittedAt||!Number.isInteger(response.rounds)||(response.rounds as number)<1) return [...errors,"Invalid work response metadata"];
   if(Object.keys(response).some(key=>!["kind","started","updated","text","have","done","tables","answers","photos","self","submitted","rounds"].includes(key))) errors.push("Unknown work response field");
   if(Date.parse(response.started as string)>Date.parse(response.updated as string)||Date.parse(response.updated as string)>Date.parse(response.submitted as string)) errors.push("Work response timestamps are not chronological");
   if(value.kind==="writing"&&["have","done","tables","answers"].some(key=>response[key]!==undefined)) errors.push("Lab response fields are not allowed in writing");
   if(value.kind==="lab"&&response.text!==undefined) errors.push("Writing response fields are not allowed in a lab");
   if(response.text!==undefined&&!text(response.text)) errors.push("Invalid writing response");
   if(value.kind==="writing"&&(!text(response.text)||!response.text.trim())) errors.push("Writing response is empty");
   for(const field of ["have","done"]) if(response[field]!==undefined && (!Array.isArray(response[field])||(response[field] as unknown[]).some(x=>!Number.isInteger(x)||(x as number)<0))) errors.push(`Invalid ${field} response`);
   if(value.kind==="lab") {
    const task=value.task as unknown as Lab;
    for(const [field,max] of [["have",task.materials?.length],["done",task.steps?.length]] as const) if(Array.isArray(response[field])&&(new Set(response[field] as unknown[]).size!==(response[field] as unknown[]).length||(response[field] as number[]).some(n=>n>=max))) errors.push(`Unknown ${field} index`);
    if(response.answers!==undefined&&(!plain(response.answers)||Object.entries(response.answers).some(([key,answer])=>!task.questions?.some(q=>q.id===key)||!text(answer)))) errors.push("Invalid lab answer");
    if(response.tables!==undefined&&(!plain(response.tables)||Object.entries(response.tables).some(([key,rows])=>{const table=task.tables?.find(t=>t.id===key);return !table||!Array.isArray(rows)||rows.length>1000||rows.some(row=>!Array.isArray(row)||row.length!==table.columns.length||row.some(cell=>!text(cell,10000)));}))) errors.push("Invalid lab table");
   }
   if(response.self!==undefined&&(!plain(response.self)||Object.entries(response.self).some(([key,points])=>!plain(value.rubric)||!(value.rubric as unknown as Rubric).criteria.some(c=>c.id===key&&c.levels.some(l=>l.points===points))))) errors.push("Invalid rubric self-check");
   if(response.photos!==undefined&&(!Array.isArray(response.photos)||response.photos.length>ASSESSED_WORK_LIMITS.files)) return [...errors,"Invalid work attachments"];
  }
  if(!plain(value.files)||Object.keys(value.files).length>ASSESSED_WORK_LIMITS.files) return [...errors,"Invalid embedded files"];
  const referenced=new Set<string>(), referenceIds=new Set<string>();
  for(const ref of fileRefs(response as unknown as WorkRecord | LogEntry[])) {
   if(!plain(ref)||!id(ref.id)||!id(ref.fileId)||ref.fileId.length>100||referenceIds.has(ref.id)||!text(ref.name,500)||!mime(ref.mime)||!Number.isSafeInteger(ref.bytes)||ref.bytes<0||!text(ref.caption)||!day(ref.date)) return [...errors,"Invalid file reference"];
   referenceIds.add(ref.id);
   const file=value.files[ref.fileId];
   if(!plain(file)||file.mime!==ref.mime||!text(file.data,ASSESSED_WORK_LIMITS.submissionBytes)||file.data.length%4!==0||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(file.data)||Object.keys(file).some(key=>key!=="mime"&&key!=="data")) errors.push("Missing or invalid original attachment bytes");
   if(plain(file) && typeof file.data === "string" && ref.bytes !== file.data.length * 3 / 4 - (file.data.endsWith("==") ? 2 : file.data.endsWith("=") ? 1 : 0)) errors.push("Attachment byte count does not match original bytes");
   if(Object.keys(ref).some(key=>!["id","fileId","name","mime","bytes","caption","date"].includes(key))) errors.push("Unknown attachment reference field");
   referenced.add(ref.fileId);
  }
  if(Object.keys(value.files).some(key=>!referenced.has(key))) errors.push("Unreferenced embedded attachment");
  return errors;
 } catch { return ["Invalid or oversized assessed work evidence"]; }
}
export function createAssessedWorkSubmission(input:Omit<AssessedWorkSubmission,"version">):AssessedWorkSubmission { const entry:AssessedWorkSubmission={...input,version:1};const errors=validateAssessedWorkSubmission(entry);if(errors.length)throw Error(errors.join("; "));return frozen(entry); }
function checkMap(value:unknown):asserts value is AssessedWorkSubmissionMap {
 if(!plain(value)||Object.keys(value).length>ASSESSED_WORK_LIMITS.count)throw Error("Invalid or oversized assessed work history; no history was removed");
 if(bytes(value)>ASSESSED_WORK_LIMITS.aggregateBytes)throw Error("Assessed work history byte limit exceeded; no history was removed");
 for(const [key,entry]of Object.entries(value)){const errors=validateAssessedWorkSubmission(entry);if(errors.length)throw Error(errors.join("; "));if(key!==(entry as AssessedWorkSubmission).id)throw Error("Assessed work history ID mismatch");}
}
export function mergeAssessedWorkSubmissions(left:AssessedWorkSubmissionMap,right:AssessedWorkSubmissionMap):AssessedWorkSubmissionMap {checkMap(left);checkMap(right);const merged={...left};for(const [key,entry]of Object.entries(right)){if(Object.prototype.hasOwnProperty.call(merged,key)&&assessedWorkJSON(merged[key])!==assessedWorkJSON(entry))throw Error("Conflicting assessed work submission ID");merged[key]=entry;}checkMap(merged);return frozen(merged);}
export function appendAssessedWorkSubmission(ledger:AssessedWorkSubmissionMap,entry:AssessedWorkSubmission):AssessedWorkSubmissionMap{return mergeAssessedWorkSubmissions(ledger,{[entry.id]:entry});}
export function assessedWorkSubmissionsForCourses(ledger:AssessedWorkSubmissionMap,courseIds:readonly string[]):AssessedWorkSubmissionMap {checkMap(ledger);return frozen(Object.fromEntries(Object.entries(ledger).filter(([,entry])=>courseIds.includes(entry.courseId))));}
