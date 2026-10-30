/** Private family intentions and observations, never enrollment authority or earned credit. */
export const HOMESCHOOL_PLANNING_NOTICE = "Plans and completion labels are family planning notes, not earned credit, course approval or graduation eligibility. Use Academic records to review credit and evidence.";
export const MAX_PLANNING_BYTES = 1024 * 1024;
export interface SubjectPlacement { id: string; subject: string; level: string; rationale: string }
export interface PlannedCourse { id: string; title: string; courseId: string; subject: string; year: string; grade: number; credits: number; status: "planned" | "current" | "completed"; notes: string; evidenceIds: string[] }
export interface PlanMaterial { id: string; title: string; coursePlanId: string; quantity: string; ready: boolean; notes: string }
export interface PlannedTrip { id: string; title: string; date: string; location: string; subject: string; notes: string; evidenceIds: string[]; status: "planned" | "completed" }
export interface HomeschoolPlanning { version: 1; origin: "local" | "imported"; placements: SubjectPlacement[]; courses: PlannedCourse[]; materials: PlanMaterial[]; trips: PlannedTrip[] }
export const emptyHomeschoolPlanning = (): HomeschoolPlanning => ({version:1,origin:"local",placements:[],courses:[],materials:[],trips:[]});
const fail = (): never => { throw Error("Invalid or oversized homeschool planning data. Existing records were not replaced."); };
function object(v: unknown, keys: string[]): Record<string, unknown> { if (!v || typeof v !== "object" || Array.isArray(v) || ![Object.prototype,null].includes(Object.getPrototypeOf(v)) || Object.keys(v).some(k=>!keys.includes(k))) return fail(); return v as Record<string,unknown>; }
function text(v:unknown,max=1000,required=false):string { if(typeof v!=="string"||v.length>max||required&&!v.trim()||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v))return fail();return v; }
const id=(v:unknown)=>text(v,160,true);
function list<T>(v:unknown,max:number,parse:(v:unknown)=>T):T[]{if(!Array.isArray(v)||v.length>max)return fail();return v.map(parse);}
function unique(values:string[]){if(new Set(values).size!==values.length)fail();}
function evidence(v:unknown):string[]{const ids=list(v,100,id);unique(ids);return ids;}
function placement(v:unknown):SubjectPlacement{const o=object(v,["id","subject","level","rationale"]);return{id:id(o.id),subject:text(o.subject,100,true),level:text(o.level,200,true),rationale:text(o.rationale,4000)};}
function course(v:unknown):PlannedCourse{
 const o=object(v,["id","title","courseId","subject","year","grade","credits","status","notes","evidenceIds"]);
 if(!Number.isInteger(o.grade)||(o.grade as number)<0||(o.grade as number)>12||typeof o.credits!=="number"||!Number.isFinite(o.credits)||o.credits<0||o.credits>100||!["planned","current","completed"].includes(o.status as string))return fail();
 return{id:id(o.id),title:text(o.title,300,true),courseId:text(o.courseId,200),subject:text(o.subject,100,true),year:text(o.year,100,true),grade:o.grade as number,credits:o.credits,status:o.status as PlannedCourse["status"],notes:text(o.notes,4000),evidenceIds:evidence(o.evidenceIds)};
}
function material(v:unknown):PlanMaterial{const o=object(v,["id","title","coursePlanId","quantity","ready","notes"]);if(typeof o.ready!=="boolean")return fail();return{id:id(o.id),title:text(o.title,300,true),coursePlanId:text(o.coursePlanId,160),quantity:text(o.quantity,100),ready:o.ready,notes:text(o.notes,4000)};}
function trip(v:unknown):PlannedTrip{
 const o=object(v,["id","title","date","location","subject","notes","evidenceIds","status"]),date=text(o.date,10);
 if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date))return fail();
 if(!["planned","completed"].includes(o.status as string))return fail();
 return{id:id(o.id),title:text(o.title,300,true),date,location:text(o.location,500),subject:text(o.subject,100,true),notes:text(o.notes,4000),evidenceIds:evidence(o.evidenceIds),status:o.status as PlannedTrip["status"]};
}
export function parseHomeschoolPlanning(value:unknown):HomeschoolPlanning{
 if(value===undefined)return emptyHomeschoolPlanning();
 if(new TextEncoder().encode(JSON.stringify(value)).length>MAX_PLANNING_BYTES)return fail();
 const o=object(value,["version","origin","placements","courses","materials","trips"]);if(o.version!==1||!["local","imported"].includes(o.origin as string))return fail();
 const p:HomeschoolPlanning={version:1,origin:o.origin as HomeschoolPlanning["origin"],placements:list(o.placements,100,placement),courses:list(o.courses,1000,course),materials:list(o.materials,2000,material),trips:list(o.trips,1000,trip)};
 for(const rows of [p.placements,p.courses,p.materials,p.trips])unique(rows.map(r=>r.id));unique(p.placements.map(r=>r.subject.trim().toLocaleLowerCase("en-US")));
 const ids=new Set(p.courses.map(c=>c.id));if(p.materials.some(m=>m.coursePlanId&&!ids.has(m.coursePlanId)))return fail();return p;
}
function save<T extends{id:string}>(rows:T[],row:T):T[]{return rows.some(r=>r.id===row.id)?rows.map(r=>r.id===row.id?row:r):[...rows,row];}
export const savePlacement=(p:HomeschoolPlanning,row:SubjectPlacement):HomeschoolPlanning=>parseHomeschoolPlanning({...p,placements:save(p.placements,row)});
export const savePlannedCourse=(p:HomeschoolPlanning,row:PlannedCourse):HomeschoolPlanning=>parseHomeschoolPlanning({...p,courses:save(p.courses,row)});
export const savePlanMaterial=(p:HomeschoolPlanning,row:PlanMaterial):HomeschoolPlanning=>parseHomeschoolPlanning({...p,materials:save(p.materials,row)});
export const savePlannedTrip=(p:HomeschoolPlanning,row:PlannedTrip):HomeschoolPlanning=>parseHomeschoolPlanning({...p,trips:save(p.trips,row)});
export type PlanningKind="placements"|"courses"|"materials"|"trips";
/** Course removal preserves materials as general items, never deletes learning records. */
export function removePlanningEntry(p:HomeschoolPlanning,kind:PlanningKind,entryId:string):HomeschoolPlanning{if(!["placements","courses","materials","trips"].includes(kind))return fail();return parseHomeschoolPlanning({...p,[kind]:p[kind].filter(r=>r.id!==entryId),...(kind==="courses"?{materials:p.materials.map(m=>m.coursePlanId===entryId?{...m,coursePlanId:""}:m)}:{})});}
export const restoreHomeschoolPlanning=(v:unknown):HomeschoolPlanning=>({...parseHomeschoolPlanning(v),origin:"imported"});
export function fourYearPlan(p:HomeschoolPlanning):{grade:number;courses:PlannedCourse[];projectedCredits:number}[]{const checked=parseHomeschoolPlanning(p);return[9,10,11,12].map(grade=>{const courses=checked.courses.filter(c=>c.grade===grade);return{grade,courses,projectedCredits:courses.reduce((n,c)=>n+c.credits,0)};});}
/** Missing attachment references stay visible after deletion; no invented evidence. */
export function planningEvidenceStatus(ids:string[],documents:{id:string;name:string}[]):{id:string;name:string;missing:boolean}[]{return evidence(ids).map(id=>{const doc=documents.find(d=>d.id===id);return{id,name:doc?.name??"Missing attachment",missing:!doc};});}
