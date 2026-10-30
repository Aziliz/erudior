// Development/CI fixture, never a catalog entry, real account or production publication.
import React, {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import CreateHome from '../../src/pages/CreateHome';
import CommunityEditor from '../../src/pages/CommunityEditor';
import LessonView from '../../src/pages/LessonView';
import {checkDoc,type CommunityDoc} from '../../src/lib/communityFormat';
import {downloadCommunityCourse} from '../../src/lib/community';
import {normalizeCourse} from '../../src/lib/course';
import {emptyProgress as initialProgress} from '../../src/lib/storage';
import {requestNavigation} from '../../src/lib/navigationGuard';
import {K_DEMO_SUBJECTS,createKDemoDoc,demoCourseMeta,demoRuntimeManifest,demoSourceCourse,type KDemoId} from './community-k-demo-data';
import type {Course} from '../../src/lib/types';
import '../../src/styles.css';
const mode=new URLSearchParams(location.search).get('mode')==='canonical'?'canonical':'legacy';
const key='synthetic-k-demo-'+mode;
const routeKey=key+'-route';
type Draft={doc:CommunityDoc,published:CommunityDoc[],saves:number,publishes:number};
type State={drafts:Record<string,Draft>,selected:KDemoId,installed:Record<string,Course>,requests:string[]};
const initial=():State=>({drafts:{},selected:K_DEMO_SUBJECTS[0].id,installed:{},requests:[]});
let state:State=JSON.parse(sessionStorage.getItem(key)||'null')||initial();
let failSaves=false,failPublish=false,delay=0;
const persist=()=>sessionStorage.setItem(key,JSON.stringify(state));
const originalFetch=window.fetch.bind(window);
const emptyProgress=()=>({...initialProgress(),pretests:{},work:{}});
const selectedId=()=>`${mode}-${state.selected}`;
function expected(){const d=state.drafts[selectedId()];return demoSourceCourse(d.doc,state.selected);}
window.fetch=async(input,init)=>{
 const u=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.href);
 if(!u.pathname.startsWith('/synthetic-api/'))return originalFetch(input,init);
 const method=init?.method||'GET',route=u.pathname.slice('/synthetic-api'.length);
 state.requests.push(method+' '+route);const response=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
 if(delay)await new Promise(resolve=>setTimeout(resolve,delay));
 if(route==='/me')return response({user:{id:'synthetic-adult',name:'Synthetic adult author',role:'author',accepted:true,provider:'fixture'},providers:{google:false,github:false,dev:false}});
 if(route==='/mine')return response({courses:Object.entries(state.drafts).map(([id,d])=>({id,title:d.doc.title,status:d.published.length?'published':'draft',version:d.published.length,review:'not_reviewed',reviewNote:null,updated:'2026-01-01',openReports:0,role:'owner'}))});
 if(route==='/drafts'&&method==='POST'){
  const id=selectedId();if(state.drafts[id])return response({error:'This synthetic subject already exists.'},409);
  state.drafts[id]={doc:createKDemoDoc(state.selected,mode),published:[],saves:0,publishes:0};persist();return response({id});
 }
 const match=route.match(/^\/(drafts|courses)\/([^/]+)(?:\/(editors|publish))?$/);
 if(!match)throw Error('Unexpected synthetic route: '+method+' '+route);
 const[,kind,id,action]=match;const d=state.drafts[id];if(!d)return response({error:'Unknown synthetic course'},404);
 if(action==='editors')return response({owner:{id:'synthetic-adult',name:'Synthetic adult author'},editors:[]});
 if(kind==='drafts'&&method==='GET')return response({id,doc:d.doc,status:d.published.length?'published':'draft',version:d.published.length,review:'not_reviewed',reviewNote:null,role:'owner'});
 if(kind==='drafts'&&method==='PUT'){
  if(failSaves)return response({error:'Synthetic save interrupted; retry without losing the draft.'},503);
  const doc=JSON.parse(String(init?.body));const errors=checkDoc(doc,false,{communityImageOrigin:location.origin});if(errors.length)return response({error:'Invalid draft',errors},422);
  d.doc=structuredClone(doc);d.saves++;persist();return response({ok:true});
 }
 if(action==='publish'&&method==='POST'){
  if(failPublish)return response({error:'Synthetic publication interrupted; no version created.'},503);
  const errors=checkDoc(d.doc,true,{communityImageOrigin:location.origin});if(errors.length)return response({error:'Invalid publication',errors},422);
  d.published.push(structuredClone(d.doc));d.publishes++;persist();return response({version:d.published.length});
 }
 if(kind==='courses'&&method==='GET')return d.published.length?response({...demoCourseMeta(id,d.published.length),doc:d.published.at(-1)}):response({error:'Not published'},404);
 throw Error('Unexpected synthetic method: '+method+' '+route);
};
function Fixture(){
 const[notice,setNotice]=useState(''),[selected,setSelected]=useState(state.selected),[view,setView]=useState<'list'|'editor'|'installed'|'source'>(()=>JSON.parse(sessionStorage.getItem(routeKey)||'null')?.view||'list'),[id,setId]=useState(()=>JSON.parse(sessionStorage.getItem(routeKey)||'null')?.id||''),[epoch,setEpoch]=useState(0),[reset,setReset]=useState(false),[progress,setProgress]=useState<any>(emptyProgress);
 useEffect(()=>{sessionStorage.setItem(routeKey,JSON.stringify({view,id}));},[view,id]);
 const go=(route:any)=>{if(!requestNavigation('app',route))return;if(route.name==='communityEdit'){const subject=K_DEMO_SUBJECTS.find(s=>`${mode}-${s.id}`===route.id);if(!subject){setNotice('Unknown synthetic subject route.');return;}state.selected=subject.id;persist();setSelected(subject.id);setId(route.id);setView('editor');}else{setView('list');setEpoch(n=>n+1);}};
 const course=state.installed[selectedId()];
 const api:any={toast:setNotice,go,courses:course?[course]:[],allCourses:course?[course]:[],progress,updateProgress:async(fn:any)=>setProgress((p:any)=>fn(p)),family:null,student:null};
 async function install(){const installed=normalizeCourse(await downloadCommunityCourse(selectedId()));state.installed[selectedId()]=installed;persist();setEpoch(n=>n+1);return installed;}
 Object.assign(window,{communityKDemoFixture:{state:()=>structuredClone(state),progress:()=>structuredClone(progress),faults:()=>({failSaves,failPublish,delay}),selectedId,source:()=>structuredClone(state.drafts[selectedId()]?.doc),installed:()=>structuredClone(state.installed[selectedId()]),expected,manifest:demoRuntimeManifest,failSaves:(on:boolean)=>{failSaves=on;},failPublish:(on:boolean)=>{failPublish=on;},delay:(ms:number)=>{delay=ms;},install}});
 return <><aside className="notice" aria-label="Synthetic acceptance environment"><strong>Eight-subject K authoring acceptance demo</strong><p>Original tiny test fixtures, not reviewed curriculum. Local mock adult identity and publication only; no real accounts, network uploads, official approval or course-signing claims. Seed templates exercise the real editors and learner renderer.</p><label className="field">Synthetic subject<select aria-label="Synthetic subject" className="select" value={selected} onChange={e=>{if(!requestNavigation('app',{name:'create'}))return;state.selected=e.target.value as KDemoId;persist();setSelected(e.target.value as KDemoId);setView('list');setEpoch(n=>n+1);}}>{K_DEMO_SUBJECTS.map(s=><option value={s.id} key={s.id}>{s.title}</option>)}</select></label><div className="row"><button className="btn" onClick={()=>go({name:'create'})}>Demo course list</button><button className="btn" disabled={!state.drafts[selectedId()]?.published.length} onClick={()=>install().catch(e=>setNotice(String(e)))}>Install published demo</button><button className="btn" disabled={!course} onClick={()=>{if(requestNavigation('app',{name:'lesson'}))setView('installed');}}>View installed lesson</button><button className="btn" disabled={!course} onClick={()=>{if(requestNavigation('app',{name:'lesson'}))setView('source');}}>View source lesson</button><button className="btn" onClick={()=>setReset(true)}>Reset synthetic demo</button></div>{reset&&<section aria-label="Reset confirmation"><p>Remove only this fixture's eight-subject {mode} session?</p><button className="btn" onClick={()=>setReset(false)}>Keep synthetic demo</button><button className="btn" onClick={()=>{if(!requestNavigation('app',{name:'create'}))return;state=initial();failSaves=false;failPublish=false;delay=0;setProgress(emptyProgress());setNotice('');setId('');persist();setSelected(state.selected);setReset(false);setView('list');setEpoch(n=>n+1);}}>Confirm demo reset</button></section>}</aside>{notice&&<p role="status">{notice}</p>}{view==='list'?<CreateHome key={epoch} api={api}/>:view==='editor'?<CommunityEditor key={id} api={api} id={id}/>:<section aria-label={view==='source'?'Source runtime lesson':'Installed runtime lesson'}><p>{view==='source'?'Official-format synthetic source comparator (not an approved course).':'Installed community copy: not reviewed.'}</p><LessonView key={view+selectedId()} api={api} course={view==='source'?expected():course} lesson={(view==='source'?expected():course).lessons[0]}/></section>}</>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
