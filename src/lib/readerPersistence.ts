/** Scoped reader persistence. Cumulative writer/day counters make optimistic retries idempotent.
 * Limits fail visibly without pruning receipts or old completion evidence.
 * Writers rebase through the supplied latest-progress updater; this module does
 * not add cross-process locking to the application-wide progress store.
 */
import type { Progress, ReaderText, ReadingState } from "./types";
import { today } from "./srs";
export const READER_PROGRESS_LIMITS = { writers: 1024, priorSections: 4096, completedVersions: 1024, bytes: 1024 * 1024 } as const;
export type ReaderRevision = { revision: string; sections: Record<string,string> };
const canonical=(value:unknown):string=>JSON.stringify(value,(_key,v)=>v&&typeof v==="object"&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0)):v);
export async function readerRevision(text:ReaderText, questions:(ids:string[])=>unknown[]):Promise<ReaderRevision> {
 const digest=async(value:unknown)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(canonical(value))))).map(n=>n.toString(16).padStart(2,"0")).join("");
 const sections=Object.fromEntries(await Promise.all(text.sections.map(async s=>[s.id,await digest({body:s.body,kind:text.kind??"prose",questions:questions(s.questions??[])})])));
 return {sections,revision:await digest(text.sections.map(s=>[s.id,sections[s.id]]))};
}
const day=()=>today();
const validDay=(value:unknown):value is string=>typeof value==="string"&&/^\d{4}-\d\d-\d\d$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==="object"&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const safeId=(value:unknown):value is string=>typeof value==="string"&&/^[A-Za-z0-9_-]{1,100}$/.test(value)&&!["__proto__","constructor","prototype"].includes(value);

function bounded(state:ReadingState) {
 if(!record(state)||!safeId(state.section)||!Number.isSafeInteger(state.at)||state.at<0||!Number.isSafeInteger(state.seconds)||state.seconds<0||!record(state.read)||Object.keys(state.read).length>READER_PROGRESS_LIMITS.priorSections||Object.entries(state.read).some(([id,date])=>!safeId(id)||!validDay(date))||!validDay(state.last)||(state.finished!==undefined&&!validDay(state.finished)))throw Error("Saved reading progress is invalid; existing progress was not replaced.");
 for(const [value,limit]of [[state.writerSeconds,READER_PROGRESS_LIMITS.writers],[state.priorRead,READER_PROGRESS_LIMITS.priorSections],[state.completedRevisions,READER_PROGRESS_LIMITS.completedVersions]] as const)
  if(value!==undefined&&(!record(value)||Object.keys(value).length>limit))throw Error("Reader progress limit reached; no history was removed.");
 if(state.revision!==undefined&&!/^[a-f0-9]{64}$/.test(state.revision))throw Error("Invalid reading revision");
 if(state.sectionRevisions!==undefined&&(!record(state.sectionRevisions)||Object.keys(state.sectionRevisions).length>500||Object.entries(state.sectionRevisions).some(([id,hash])=>!safeId(id)||typeof hash!=="string"||!/^[a-f0-9]{64}$/.test(hash))))throw Error("Invalid reading section revisions");
 for(const history of [state.priorRead,state.completedRevisions])if(Object.entries(history??{}).some(([id,date])=>id.length>200||!validDay(date)))throw Error("Invalid historical reading completion");
 if(Object.keys(state.writerSeconds??{}).some(id=>{const cut=id.lastIndexOf(":");return !safeId(id.slice(0,cut))||!validDay(id.slice(cut+1));}))throw Error("Invalid reader writer receipt");
 if(Object.values(state.writerSeconds??{}).some(n=>!Number.isSafeInteger(n)||n<0))throw Error("Invalid reading-time receipts");
 if(new TextEncoder().encode(JSON.stringify(state)).length>READER_PROGRESS_LIMITS.bytes)throw Error("Reader progress byte limit reached; no history was removed.");
 const receipted=Object.values(state.writerSeconds??{}).reduce((sum,n)=>sum+n,0);
 if(!Number.isSafeInteger(receipted)||receipted>state.seconds)throw Error("Reading-time receipts exceed recorded time");
}
/** Preserve time and historical completion, invalidate only changed section semantics. */
export function reconcileReaderState(raw:ReadingState|undefined,text:ReaderText,version:ReaderRevision):ReadingState {
 const old=raw??{section:text.sections[0].id,at:0,seconds:0,read:{},last:day()};bounded(old);
 if(old.revision===version.revision){
  if(canonical(old.sectionRevisions)!==canonical(version.sections)||old.finished&&!text.sections.every(s=>old.read[s.id]))throw Error("Saved reading completion does not match this revision");
  return structuredClone(old);
 }
 const priorRead={...old.priorRead},completedRevisions={...old.completedRevisions},read:Record<string,string>={};
 for(const [id,date]of Object.entries(old.read)) {
  const hash=old.sectionRevisions?.[id];
  if(hash&&hash===version.sections[id])read[id]=date;
  else priorRead[`${id}:${hash??"legacy"}`]=date;
 }
 if(old.finished)completedRevisions[old.revision??"legacy"]=old.finished;
 for(const s of text.sections) if(!read[s.id]&&priorRead[`${s.id}:${version.sections[s.id]}`])read[s.id]=priorRead[`${s.id}:${version.sections[s.id]}`];
 const section=text.sections.some(s=>s.id===old.section)?old.section:text.sections[0].id;
 const {finished:_finished,...rest}=old;
 const finished=text.sections.every(s=>read[s.id])?(completedRevisions[version.revision]??old.finished??day()):undefined;
 const result={...rest,section,at:old.section===section&&old.sectionRevisions?.[section]===version.sections[section]?old.at:0,read,revision:version.revision,sectionRevisions:{...version.sections},priorRead,completedRevisions,...(finished?{finished}:{})};bounded(result);return result;
}
export interface ReaderWrite {writer:string;time:Record<string,number>;place?:{section:string;at:number};read:Record<string,string>}
export function applyReaderWrite(progress:Progress,courseId:string,text:ReaderText,version:ReaderRevision,write:ReaderWrite):Progress {
 if(!safeId(write.writer))throw Error("Invalid reading writer");
 const key=courseId+"/"+text.id;let state=reconcileReaderState(progress.reading?.[key],text,version);
 const receipts={...state.writerSeconds},activity={...progress.activity};let seconds=state.seconds;
 for(const [date,total]of Object.entries(write.time)) {
  if(!validDay(date)||!Number.isSafeInteger(total)||total<0)throw Error("Invalid reading-time operation");
  const receipt=write.writer+":"+date,previous=receipts[receipt]??0;
  if(total===0&&receipts[receipt]===undefined)continue;
  const delta=Math.max(0,total-previous);receipts[receipt]=Math.max(previous,total);seconds+=delta;
  if(delta){const prior=activity[date]??{questions:0,cards:0,lessons:0,drills:0};activity[date]={...prior,readingSec:(prior.readingSec??0)+delta};}
 }
 const read={...state.read};for(const [section,date]of Object.entries(write.read)){if(!version.sections[section]||!validDay(date))throw Error("Unknown reading section or invalid completion date");read[section]??=date;}
 const finished=state.finished??(text.sections.every(s=>read[s.id])?day():undefined);
 if(write.place&&(!version.sections[write.place.section]||!Number.isSafeInteger(write.place.at)||write.place.at<0))throw Error("Invalid reading position");
 state={...state,...write.place,seconds,read,writerSeconds:receipts,last:day(),...(finished?{finished,completedRevisions:{...state.completedRevisions,[version.revision]:finished}}:{})};bounded(state);
 return {...progress,activity,reading:{...progress.reading,[key]:state}};
}
const sessions=new Map<string,ReaderPersistence>();
const identity=(studentId:string|null,courseId:string,textId:string,revision:string)=>JSON.stringify([studentId,courseId,textId,revision]);
/** A single stable counter per text/version in this app session, reused on remount. */
export function readerPersistence(studentId:string|null,courseId:string,text:ReaderText,version:ReaderRevision,initial:Progress):ReaderPersistence {
 const key=identity(studentId,courseId,text.id,version.revision);let session=sessions.get(key);
 // A course revision/remount must not present another live controller's failed
 // optimistic completion as confirmed. Actual writes still rebase on latest progress.
 let displayInitial=initial;
 for(const [scope,other]of sessions){const [sid,cid,tid]=JSON.parse(scope);if(sid===studentId&&cid===courseId&&tid===text.id&&(other.pending||other.busy))displayInitial={...initial,reading:{...initial.reading,[courseId+"/"+text.id]:other.confirmed}};}
 if(session&&!session.pending&&!session.busy){
  const current=displayInitial.reading?.[courseId+"/"+text.id];
  const lostReceipts=Object.entries(session.confirmed.writerSeconds??{}).some(([id,n])=>id.startsWith(session!.writer+":")&&(current?.writerSeconds?.[id]??0)<n);
  if(lostReceipts)session=undefined;
  else session.confirmed=reconcileReaderState(current,text,version);
 }
 if(!session){session=new ReaderPersistence(courseId,structuredClone(text),version,displayInitial);sessions.set(key,session);}return session;
}
export class ReaderPersistence {
 readonly writer=crypto.randomUUID();
 private time:Record<string,number>={};private read:Record<string,string>={};private place?:{section:string;at:number};
 private generation=0;private saved=-1;private running:Promise<boolean>|null=null;
 private listeners=new Set<()=>void>();private versionNumber=0;
 confirmed:ReadingState;error="";busy=false;logError="";logSaved=false;
 questions:Record<string,{session:import("./session").Session;initial:import("./session").RunState}>={};
 constructor(readonly courseId:string,readonly text:ReaderText,readonly revision:ReaderRevision,initial:Progress){this.confirmed=reconcileReaderState(initial.reading?.[courseId+"/"+text.id],text,revision);}
 subscribe=(fn:()=>void)=>{this.listeners.add(fn);return()=>{this.listeners.delete(fn);};};
 version=()=>this.versionNumber;
 notify(){this.versionNumber++;for(const listener of this.listeners)listener();}
 get pending(){return this.saved!==this.generation;}
 addTime(seconds:number,date=day()){if(seconds>0){this.time[date]=(this.time[date]??0)+seconds;this.generation++;this.notify();}}
 setPlace(section:string,at:number){if(this.place?.section===section&&this.place.at===at)return;this.place={section,at};this.generation++;this.notify();}
 finish(section:string){if(!this.read[section]&&!this.confirmed.read[section]){this.read[section]=day();this.generation++;this.notify();}}
 async persist(update:(fn:(p:Progress)=>Progress)=>Promise<void>,allowed:()=>boolean):Promise<boolean>{
  if(this.running)return this.running;
  const run=async()=>{this.busy=true;this.error="";this.notify();try{
   while(this.pending){if(!allowed())throw Error("The active reader changed. Return to this learner and text to retry its unsaved progress.");
    const generation=this.generation,write:ReaderWrite={writer:this.writer,time:Object.fromEntries(Object.entries(this.time).map(([d,n])=>[d,Math.floor(n)])),read:{...this.read},...(this.place?{place:{...this.place}}:{})};let saved:ReadingState|undefined;
    await update(p=>{if(!allowed())throw Error("The active reader changed before persistence.");const next=applyReaderWrite(p,this.courseId,this.text,this.revision,write);saved=next.reading![this.courseId+"/"+this.text.id];return next;});
    if(saved)this.confirmed=structuredClone(saved);this.saved=generation;this.notify();
   }return true;
  }catch(e){this.error=(e as Error).message;this.notify();return false;}finally{this.busy=false;this.notify();}};
  const promise=run();this.running=promise;void promise.finally(()=>{if(this.running===promise)this.running=null;});return promise;
 }
}
