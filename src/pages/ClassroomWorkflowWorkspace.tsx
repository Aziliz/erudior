import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AppApi } from "../App";
import { classesOf, isClassroom, type Family, type Student } from "../lib/family";
import { emptyClassroomWorkflowState, latestWorkflowItems, type ClassroomWorkflowState, type WorkflowGroup, type WorkflowItem, type WorkflowItemInput, type WorkflowKind, type WorkflowResponse, type WorkflowReview, type WorkflowTarget } from "../lib/classroomWorkflows";
import { LIVE } from "../lib/live";
import { siteUrl } from "../lib/site";
import { localSessionEpoch } from "../lib/localSession";
import { registerNavigationGuard } from "../lib/navigationGuard";
import "../classroom-workflows.css";

type Section = WorkflowKind | "groups";
type PeerOption = { key:string; label:string; classId:string; studentId:string; courseId:string; receiptId:string; version:string; text:string };
type ItemDraft = { input:WorkflowItemInput; expected:number; targets:string; sourceKey:string; scheduled:string };
const SECTIONS: { id:Section; label:string; singular:string }[] = [
  {id:"groups",label:"Groups",singular:"group"}, {id:"project",label:"Projects",singular:"project"},
  {id:"peer_review",label:"Peer review",singular:"peer review"}, {id:"conference",label:"Conferences",singular:"conference"},
  {id:"notice",label:"Notices",singular:"notice"}, {id:"field_trip",label:"Field trips",singular:"field trip"},
];
const newId = () => `cw-${crypto.randomUUID()}`;
const message = (e:unknown) => e instanceof Error ? e.message : String(e);
const prettyDate = (value:string) => value.includes("T") ? new Date(value).toLocaleString() : value;
const localTime = (value?:string) => { if(!value)return "";const date=new Date(value);return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16); };
const targetsFor = (text:string, old:WorkflowTarget[] = []):WorkflowTarget[] => {const used=new Set<string>();return text.split("\n").map(v=>v.trim()).filter(Boolean).map(title=>{const previous=old.find(t=>t.title===title&&!used.has(t.id));const id=previous?.id??newId();used.add(id);return {id,title};});};
const itemInput = (item:WorkflowItem):WorkflowItemInput => { const {revision:_revision,published:_published,revoked:_revoked,createdAt:_createdAt,...input}=item;return input; };

export default function ClassroomWorkflowWorkspace(props:{api:AppApi;teacher?:boolean;family?:Family}) {
  return <ClassroomWorkspace key={`${!!props.teacher}:${props.api.student?.id??"adult"}`} {...props}/>;
}

function ClassroomWorkspace({api,teacher=false,family:providedFamily}:{api:AppApi;teacher?:boolean;family?:Family}) {
  const family=providedFamily??api.family;
  const classes=api.homeschool&&family&&isClassroom(family)?teacher?(family.classes??[]):api.student?classesOf(family,api.student.id):[]:[];
  const [classId,setClassId]=useState(classes[0]?.id??"");
  const selected=classes.find(c=>c.id===classId)??classes[0];
  const cid=selected?.id??"";
  const [section,setSection]=useState<Section>("project");
  const [data,setData]=useState<ClassroomWorkflowState>(emptyClassroomWorkflowState);
  const [sources,setSources]=useState<PeerOption[]>([]);
  const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
  const [draft,setDraft]=useState<ItemDraft|null>(null);
  const [groupDraft,setGroupDraft]=useState<{group:Omit<WorkflowGroup,"revision">;expected:number}|null>(null);
  const [formDirty,setFormDirty]=useState<Record<string,boolean>>({});
  const scope=`${teacher}:${api.student?.id??""}:${cid}`;
  const activeScope=useRef(scope);activeScope.current=scope;
  const busyRef=useRef(false),loadRequest=useRef(0),editor=useRef<HTMLElement>(null);
  const guard=useRef(false);guard.current=!!draft||!!groupDraft||busy||Object.values(formDirty).some(Boolean);
  const epoch=localSessionEpoch();
  const service=api.classroomWorkflows;
  const students=(family?.students??[]).filter(s=>selected?.students.includes(s.id));
  const studentName=(id:string)=>students.find(s=>s.id===id)?.name??"Former class member";
  const currentSection=SECTIONS.find(s=>s.id===section)!;
  const groups=data.groups.filter(g=>g.classId===cid);
  const items=latestWorkflowItems(data).filter(i=>i.classId===cid&&i.kind===section);
  async function reload() {
    if(!service||!cid){setLoading(false);return;}
    const requested=scope,token=++loadRequest.current;setLoading(true);
    try {
      const fresh=teacher?await service.teacherLoad(cid):await service.learnerLoad(cid);
      const options=teacher&&api.classroomPeerSources?await api.classroomPeerSources(cid):[];
      if(activeScope.current===requested&&token===loadRequest.current){setData(fresh);setSources(options);}
    } catch(e){if(activeScope.current===requested&&token===loadRequest.current){setData(emptyClassroomWorkflowState());setSources([]);setError(message(e));}}
    finally {if(activeScope.current===requested&&token===loadRequest.current)setLoading(false);}
  }
  useEffect(()=>{setData(emptyClassroomWorkflowState());setSources([]);setDraft(null);setGroupDraft(null);setFormDirty({});setError("");setNotice("");void reload();return()=>{loadRequest.current++;};},[scope]);
  useEffect(()=>{void reload();},[epoch]);
  useEffect(()=>{editor.current?.querySelector<HTMLElement>("input,select,textarea")?.focus();},[draft?.input.id,groupDraft?.group.id]);
  useEffect(()=>registerNavigationGuard(()=>{if(!guard.current)return true;api.toast("Save or cancel your classroom changes before leaving.");return false;}),[api.toast]);
  useEffect(()=>{const unload=(event:BeforeUnloadEvent)=>{if(guard.current){event.preventDefault();event.returnValue="";}};window.addEventListener("beforeunload",unload);return()=>window.removeEventListener("beforeunload",unload);},[]);
  const dirty=(key:string,value:boolean)=>setFormDirty(old=>({...old,[key]:value}));
  async function perform(action:()=>Promise<void>,success:string,after?:()=>void) {
    if(busyRef.current)return false;
    const requested=scope;busyRef.current=true;setBusy(true);setError("");setNotice("");
    try {await action();if(activeScope.current!==requested)return false;after?.();setNotice(success);await reload();return true;}
    catch(e){if(activeScope.current===requested)setError(message(e));return false;}
    finally {if(activeScope.current===requested){busyRef.current=false;setBusy(false);}}
  }
  function changeSection(next:Section){if(guard.current){setError("Save or cancel your changes before changing sections.");return;}setSection(next);setNotice("");setError("");}
  function edit(item?:WorkflowItem) {
    if(busy||draft||groupDraft)return;
    const input=item?itemInput(item):{id:newId(),classId:cid,kind:section as WorkflowKind,title:"",instructions:"",memberIds:students.map(s=>s.id)};
    const source= input.source;
    setDraft({input,expected:item?.revision??0,targets:(input.milestones??input.actions??[]).map(t=>t.title).join("\n"),sourceKey:source?.key??"",scheduled:localTime(input.scheduledAt)});
    setError("");
  }
  async function saveItem(event:FormEvent) {
    event.preventDefault();if(!draft||!service)return;
    let input={...draft.input};
    if(input.kind==="project")input.milestones=targetsFor(draft.targets,input.milestones);
    if(input.kind==="conference"){input.actions=targetsFor(draft.targets,input.actions);input.privateNote??="";}
    if(input.kind==="conference"||input.kind==="field_trip"){const scheduled=new Date(draft.scheduled);if(!Number.isFinite(scheduled.getTime())){setError("Enter a valid scheduled date and time.");return;}input.scheduledAt=scheduled.toISOString();}
    if(input.kind==="peer_review"){
      const source=sources.find(s=>s.key===draft.sourceKey);if(!source){setError("Select a current complete submission for peer review.");return;}
      input={...input,source:{key:source.key,studentId:source.studentId,receiptId:source.receiptId,version:source.version,text:source.text},courseId:source.courseId,memberIds:[source.studentId,...(input.reviewerIds??[]).filter(id=>id!==source.studentId)]};
    }
    await perform(()=>service.saveItem(input,draft.expected),"Draft saved on this device. Review it, then publish to its selected learners.",()=>setDraft(null));
  }
  const updateDraft=(patch:Partial<WorkflowItemInput>)=>setDraft(old=>old?{...old,input:{...old.input,...patch}}:old);
  const assignedCourses=selected?.assignments??[];
  if(!api.homeschool||!family||!isClassroom(family)||!service)return <section className="panel"><h1>Classroom collaboration</h1><p>These private local workflows require a configured Classroom in the app. Public learning remains account-free. No learner records are opened here.</p><a className="btn" href={siteUrl("/download")}>Download app</a></section>;
  return <div className="classroom-workflows">
    <h1>{teacher?"Class collaboration":"My classroom"}</h1>
    <p className="cw-notice">Saved on this device for the selected classroom. Notices and conference plans are not remote messages or video calls. Project work and field-trip participation do not automatically add grades, credit or attendance.</p>
    {teacher&&<nav aria-label="Existing classroom tools" className="cw-toolbar">{[{tab:"classes",label:"Classes and assignments"},{tab:"handins",label:"Hand-ins"},{tab:"gradebook",label:"Gradebook"},{tab:"games",label:"Learning games"},{tab:"live",label:"Live room"}].filter(link=>link.tab!=="live"||LIVE).map(link=><button key={link.tab} className="btn ghost sm" onClick={()=>api.go({name:"parent",tab:link.tab as "classes"})}>{link.label}</button>)}</nav>}
    {!classes.length?<p>No classes are available. {teacher?"Create a class and add learners in Classes and assignments.":"Ask your teacher to add you to a local class."}</p>:<>
      <div className="cw-toolbar"><label className="field"><span>Class</span><select className="select" value={cid} disabled={guard.current} onChange={e=>setClassId(e.target.value)}>{classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><button className="btn" disabled={busy||loading} onClick={()=>{setError("");void reload();}}>Refresh classroom</button></div>
      <nav aria-label="Classroom collaboration sections" className="cw-tabs">{SECTIONS.filter(s=>teacher||s.id!=="groups").map(s=><button className="btn" key={s.id} aria-pressed={s.id===section} onClick={()=>changeSection(s.id)}>{s.label}</button>)}</nav>
      <div role="status" aria-live="polite">{loading?"Loading classroom…":notice}</div>
      {error&&<div className="panel" role="alert"><strong>Changes were not confirmed.</strong><p>{error}</p><p>Your open draft is retained. Refresh to inspect current records before trying again.</p></div>}
      <div className="cw-toolbar"><h2>{currentSection.label}</h2>{teacher&&<button className="btn primary" disabled={busy||loading||!!draft||!!groupDraft} onClick={()=>section==="groups"?setGroupDraft({group:{id:newId(),classId:cid,name:"",memberIds:[]},expected:0}):edit()}>New {currentSection.singular}</button>}</div>
      {groupDraft&&<section ref={editor} className="panel cw-editor"><h3>{groupDraft.expected?"Edit group":"New group"}</h3><form aria-label="Group editor" onSubmit={e=>{e.preventDefault();void perform(()=>service.saveGroup(groupDraft.group,groupDraft.expected),"Group saved. Existing linked activities must be reviewed and published again.",()=>setGroupDraft(null));}}><fieldset disabled={busy}><TextField label="Group name" value={groupDraft.group.name} set={name=>setGroupDraft({...groupDraft,group:{...groupDraft.group,name}})} max={300} required/><Members label="Group members" students={students} selected={groupDraft.group.memberIds} set={memberIds=>setGroupDraft({...groupDraft,group:{...groupDraft.group,memberIds}})}/><p>Changing membership withdraws linked activities. Previously shared work stays historical; recheck its audience before publishing.</p><div className="cw-actions"><button className="btn primary" type="submit">Save group</button><button className="btn" type="button" onClick={()=>setGroupDraft(null)}>Cancel changes</button></div></fieldset></form></section>}
      {draft&&<section ref={editor} className="panel cw-editor"><h3>{draft.expected?"Edit":"New"} {currentSection.singular}</h3><form aria-label={`${currentSection.singular} editor`} onSubmit={saveItem}><fieldset disabled={busy}>
        <TextField label="Title" value={draft.input.title} set={title=>updateDraft({title})} max={300} required/>
        <TextField label="Instructions" value={draft.input.instructions} set={instructions=>updateDraft({instructions})} max={12000} multiline/>
        {draft.input.kind!=="peer_review"&&<><label className="field"><span>Assigned course</span><select className="select" value={draft.input.courseId??""} onChange={e=>updateDraft({courseId:e.target.value||undefined})}><option value="">Class activity (no course)</option>{assignedCourses.map(a=><option key={a.courseId} value={a.courseId}>{api.allCourses.find(c=>c.id===a.courseId)?.title??a.courseId}</option>)}</select></label><label className="field"><span>Audience group</span><select className="select" value={draft.input.groupId??""} onChange={e=>{const group=groups.find(g=>g.id===e.target.value);updateDraft({groupId:group?.id,memberIds:group?.memberIds??students.map(s=>s.id)});}}><option value="">Select class members</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label><Members label="Members" students={students.filter(s=>!draft.input.groupId||groups.find(g=>g.id===draft.input.groupId)?.memberIds.includes(s.id))} selected={draft.input.memberIds} set={memberIds=>updateDraft({memberIds})}/></>}
        {draft.input.kind==="peer_review"&&<><label className="field"><span>Approved submission</span><select required className="select" value={draft.sourceKey} onChange={e=>{const source=sources.find(s=>s.key===e.target.value);setDraft({...draft,sourceKey:e.target.value,input:{...draft.input,reviewerIds:(draft.input.reviewerIds??[]).filter(id=>id!==source?.studentId)}});}}><option value="">Choose a complete hand-in snapshot</option>{sources.map(source=><option key={source.key} value={source.key}>{source.label}</option>)}</select></label>{!sources.length&&<p>Import a complete assigned writing or lab hand-in first. Peer review shares only the selected immutable text—not grades, attachments or the learner’s other work.</p>}{sources.find(s=>s.key===draft.sourceKey)&&<section aria-label="Snapshot preview" tabIndex={0} className="cw-source cw-text">{sources.find(s=>s.key===draft.sourceKey)!.text}</section>}<Members label="Reviewers" students={students.filter(s=>s.id!==sources.find(source=>source.key===draft.sourceKey)?.studentId)} selected={draft.input.reviewerIds??[]} set={reviewerIds=>updateDraft({reviewerIds})}/><p>Only selected reviewers see this exact snapshot. Their feedback stays private until you moderate and release it to the source learner.</p></>}
        {draft.input.kind==="project"&&<TextField label="Milestones (one per line)" value={draft.targets} set={targets=>setDraft({...draft,targets})} max={12000} multiline required/>}
        {(draft.input.kind==="conference"||draft.input.kind==="field_trip")&&<label className="field"><span>Scheduled time</span><input className="input" required type="datetime-local" value={draft.scheduled} onChange={e=>setDraft({...draft,scheduled:e.target.value})}/><small>Shown in this device’s local time zone.</small></label>}
        {draft.input.kind==="conference"&&<><TextField label="Private teacher note" value={draft.input.privateNote??""} set={privateNote=>updateDraft({privateNote})} max={12000} multiline/><TextField label="Action items (one per line)" value={draft.targets} set={targets=>setDraft({...draft,targets})} max={12000} multiline/><p>Private notes stay in the teacher view. Instructions and action items are visible to the selected learners.</p></>}
        {draft.input.kind==="field_trip"&&<TextField label="Location" value={draft.input.location??""} set={location=>updateDraft({location})} max={1000} required/>}
        <label className="field"><span>Due date (optional)</span><input className="input" type="date" value={draft.input.due??""} onChange={e=>updateDraft({due:e.target.value||undefined})}/></label>
        <p>Saving makes an unpublished revision. Older responses remain attached to the exact instructions they answered. Publish separately after checking the audience.</p>
        <div className="cw-actions"><button className="btn primary" type="submit">Save draft</button><button className="btn" type="button" onClick={()=>setDraft(null)}>Cancel changes</button></div>
      </fieldset></form></section>}
      {section==="groups"?<div className="cw-grid">{groups.length===0&&!loading&&<p>No groups yet. Create a group or assign an activity to selected class members.</p>}{groups.map(group=><section key={group.id} className="panel cw-card" aria-label={group.name}><h3>{group.name}</h3><p>{group.memberIds.map(studentName).join(", ")||"No members"}</p><button className="btn" disabled={busy||!!draft||!!groupDraft} onClick={()=>setGroupDraft({group:{id:group.id,classId:group.classId,name:group.name,memberIds:[...group.memberIds]},expected:group.revision})}>Edit group</button></section>)}</div>:<div className="cw-grid">{items.length===0&&!loading&&<p>{teacher?"No activities in this section yet.":"No published activities for you in this section."}</p>}{items.map(item=><section key={item.id} className="panel cw-card" aria-label={item.title}>
        <div className="cw-card-head"><h3>{item.title}</h3><span className="cw-badge">{item.revoked?"Revoked":item.published?"Published locally":"Draft / withdrawn"} · revision {item.revision}</span></div>
        <p className="cw-text">{item.instructions}</p>
        {teacher&&<p className="small">Audience: {item.memberIds.map(studentName).join(", ")}</p>}
        {item.scheduledAt&&<p>Scheduled: <time dateTime={item.scheduledAt}>{prettyDate(item.scheduledAt)}</time></p>}
        {item.location&&<p>Location: {item.location}</p>}
        {item.due&&<p>Due: <time dateTime={item.due}>{item.due}</time></p>}
        {item.courseId&&<p>{api.allCourses.some(c=>c.id===item.courseId)?<button className="btn ghost sm" onClick={()=>api.go({name:"course",courseId:item.courseId!})}>Open assigned course</button>:<span>Assigned course: {item.courseId}</span>}</p>}
        {item.kind==="project"&&<ol>{item.milestones?.map(target=><li key={target.id}>{target.title}</li>)}</ol>}
        {item.kind==="conference"&&<><h4>Action items</h4>{item.actions?.length?<ol>{item.actions.map(target=><li key={target.id}>{target.title}</li>)}</ol>:<p>No action items yet.</p>}{teacher&&<details><summary>Private teacher note</summary><p className="cw-text">{item.privateNote||"No private note."}</p></details>}</>}
        {item.source&&<details><summary>Approved peer snapshot</summary><p className="small">Exact receipt version: {item.source.version}</p><div className="cw-source cw-text" tabIndex={0}>{item.source.text}</div></details>}
        {teacher&&<div className="cw-actions"><button className="btn" disabled={busy||!!draft||!!groupDraft} onClick={()=>edit(item)}>Edit</button>{!item.revoked&&<><button className="btn" disabled={busy||!!draft||!!groupDraft} onClick={()=>void perform(()=>service.setPublication(item.id,item.revision,item.published?"withdraw":"publish"),item.published?"Activity withdrawn from learner views.":"Activity published to selected learners on this device.")}>{item.published?"Withdraw":"Publish"}</button><button className="btn" disabled={busy||!!draft||!!groupDraft} onClick={()=>void perform(()=>service.setPublication(item.id,item.revision,"revoke"),"Activity revoked. Historical teacher records are retained.")}>Revoke</button></>}</div>}
        {!teacher&&item.published&&!item.revoked&&<LearnerResponse item={item} studentId={api.student?.id??""} responses={data.responses} busy={busy} dirty={value=>dirty(`response:${item.id}`,value)} submit={async input=>perform(()=>service.respond(item.id,item.revision,input),"Response saved on this device. Your teacher can review it here.")}/>}
        <ResponseHistory item={item} data={data} teacher={teacher} studentName={studentName} busy={busy} dirty={dirty} review={async(response,input,count)=>perform(()=>service.review(response.id,input,count),input.released?"Review marked for release with the published activity.":"Review saved privately; learners cannot see unreleased feedback.")}/>
      </section>)}</div>}
    </>}
  </div>;
}

function TextField({label,value,set,max,required=false,multiline=false}:{label:string;value:string;set:(value:string)=>void;max:number;required?:boolean;multiline?:boolean}) {
  return <label className="field"><span>{label}</span>{multiline?<textarea className="input" value={value} maxLength={max} required={required} onChange={e=>set(e.target.value)}/>:<input className="input" value={value} maxLength={max} required={required} onChange={e=>set(e.target.value)}/>}</label>;
}
function Members({label,students,selected,set}:{label:string;students:Student[];selected:string[];set:(ids:string[])=>void}) {
  return <fieldset className="cw-members"><legend>{label}</legend><div className="cw-members-list">{students.map(student=><label key={student.id}><input type="checkbox" checked={selected.includes(student.id)} onChange={e=>set(e.target.checked?[...selected,student.id]:selected.filter(id=>id!==student.id))}/>{student.name}</label>)}</div></fieldset>;
}

type ResponseInput={id:string;kind:WorkflowResponse["kind"];text:string;targetId?:string};
function LearnerResponse({item,studentId,responses,busy,dirty,submit}:{item:WorkflowItem;studentId:string;responses:WorkflowResponse[];busy:boolean;dirty:(value:boolean)=>void;submit:(input:ResponseInput)=>Promise<boolean>}) {
  const [text,setText]=useState(""),[target,setTarget]=useState("");const retryId=useRef(newId()),draftRevision=useRef(item.revision);
  if(!text&&!target)draftRevision.current=item.revision;
  const staleDraft=(!!text||!!target)&&draftRevision.current!==item.revision;
  const own=responses.filter(r=>r.itemId===item.id&&r.itemRevision===item.revision&&r.studentId===studentId);
  const targets=item.milestones??item.actions??[];
  if(item.kind==="peer_review"&&!item.reviewerIds?.includes(studentId))return <p>Released peer feedback appears below after teacher review.</p>;
  async function send(event?:FormEvent){event?.preventDefault();if(staleDraft)return;const kind:WorkflowResponse["kind"]=item.kind==="project"?"submission":item.kind==="peer_review"?"feedback":item.kind==="conference"?"action":item.kind==="notice"?"acknowledgment":"reflection";if(await submit({id:retryId.current,kind,text:kind==="acknowledgment"?"Acknowledged":text,...(target?{targetId:target}:{})})){setText("");setTarget("");retryId.current=newId();dirty(false);}}
  if(item.kind==="notice")return <div className="cw-response">{own.length?<p>✓ Acknowledged on this device</p>:<button className="btn" disabled={busy} onClick={()=>void send()}>Acknowledge</button>}</div>;
  if(item.kind==="conference"&&!targets.length)return null;
  return <form className="cw-response" aria-label={`Respond to ${item.title}`} onSubmit={send}><fieldset disabled={busy}>
    {staleDraft&&<p role="alert">These instructions changed while you were writing. Your text is retained; copy it if needed, then cancel this response and review the new revision before submitting.</p>}
    <h4>{item.kind==="peer_review"?"Write peer feedback":item.kind==="project"?"Submit milestone work":item.kind==="conference"?"Record action completion":"Reflect on the field trip"}</h4>
    {targets.length>0&&<label className="field"><span>{item.kind==="project"?"Milestone":"Action"}</span><select className="select" required value={target} onChange={e=>{setTarget(e.target.value);dirty(true);}}><option value="">Choose a target</option>{targets.map(t=><option key={t.id} value={t.id} disabled={item.kind==="conference"&&own.some(r=>r.targetId===t.id)}>{t.title}{item.kind==="conference"&&own.some(r=>r.targetId===t.id)?" (recorded)":""}</option>)}</select></label>}
    <TextField label="Response text" value={text} set={value=>{setText(value);dirty(!!value||!!target);}} max={20000} required multiline/>
    <p className="small">Responses are saved as dated records, not overwritten. {item.kind==="peer_review"?"Your teacher moderates feedback before sharing it with the source learner.":"Your teacher reviews this work; submitting does not award academic credit."}</p>
    <div className="cw-actions"><button className="btn primary" type="submit" disabled={staleDraft}>Submit response</button><button className="btn" type="button" onClick={()=>{setText("");setTarget("");retryId.current=newId();dirty(false);}}>Cancel response</button></div>
  </fieldset></form>;
}

type ReviewInput={id:string;note:string;status:WorkflowReview["status"];released:boolean};
function ResponseHistory({item,data,teacher,studentName,busy,dirty,review}:{item:WorkflowItem;data:ClassroomWorkflowState;teacher:boolean;studentName:(id:string)=>string;busy:boolean;dirty:(key:string,value:boolean)=>void;review:(response:WorkflowResponse,input:ReviewInput,count:number)=>Promise<boolean>}) {
  const responses=data.responses.filter(r=>r.itemId===item.id);
  if(!responses.length)return null;
  return <section className="cw-response" aria-label={`Response history for ${item.title}`}><h4>Response history</h4><ol className="cw-history">{responses.map(response=>{const reviews=data.reviews.filter(r=>r.responseId===response.id);const latest=reviews.at(-1);const source=data.items.find(i=>i.id===response.itemId&&i.revision===response.itemRevision);const target=source?.milestones?.find(t=>t.id===response.targetId)??source?.actions?.find(t=>t.id===response.targetId);const late=!!source?.due&&response.createdAt.slice(0,10)>source.due;return <li key={response.id}><p><strong>{teacher?studentName(response.studentId):"Response"}</strong> · revision {response.itemRevision} · <time dateTime={response.createdAt}>{prettyDate(response.createdAt)}</time>{target&&<> · {target.title}</>}{late&&<> · After due date</>}</p>{response.itemRevision!==item.revision&&teacher&&<details><summary>Original instructions</summary><p className="cw-text">{source?.instructions??"Historical revision unavailable"}</p></details>}<p className="cw-text">{response.text}</p>{latest&&<div><strong>{latest.status==="reviewed"?"Reviewed":"Needs revision"}{teacher?latest.released?" · released":" · private":""}</strong><p className="cw-text">{latest.note}</p></div>}{teacher&&<ReviewEditor response={response} latest={latest} count={reviews.length} busy={busy} dirty={value=>dirty(`review:${response.id}`,value)} save={(input,count)=>review(response,input,count)}/>}</li>;})}</ol></section>;
}
function ReviewEditor({response,latest,count,busy,dirty,save}:{response:WorkflowResponse;latest?:WorkflowReview;count:number;busy:boolean;dirty:(value:boolean)=>void;save:(input:ReviewInput,count:number)=>Promise<boolean>}) {
  const [open,setOpen]=useState(false),[note,setNote]=useState(""),[status,setStatus]=useState<WorkflowReview["status"]>("reviewed");const retryId=useRef(newId()),baseCount=useRef(count);
  async function submit(released:boolean){if(await save({id:retryId.current,note,status,released},baseCount.current)){setOpen(false);setNote("");retryId.current=newId();dirty(false);}}
  if(!open)return <div className="cw-actions"><button className="btn sm" disabled={busy} onClick={()=>{setNote(latest?.note??"");setStatus(latest?.status??"reviewed");baseCount.current=count;setOpen(true);dirty(true);}}>Review response</button>{latest?.released&&<button className="btn sm" disabled={busy} onClick={async()=>{await save({id:newId(),note:latest.note,status:latest.status,released:false},count);}}>Revoke release</button>}</div>;
  return <form aria-label={`Review response ${response.id}`} onSubmit={e=>{e.preventDefault();void submit(false);}}><fieldset disabled={busy}><TextField label="Review note" value={note} set={setNote} max={12000} multiline/><label className="field"><span>Review status</span><select className="select" value={status} onChange={e=>setStatus(e.target.value as WorkflowReview["status"])}><option value="reviewed">Reviewed</option><option value="needs_revision">Needs revision</option></select></label><div className="cw-actions"><button className="btn" type="submit">Save review (private)</button><button className="btn primary" type="button" onClick={()=>void submit(true)}>Release review</button><button className="btn" type="button" onClick={()=>{setOpen(false);retryId.current=newId();dirty(false);}}>Cancel review</button></div></fieldset></form>;
}
