// Synthetic browser fixture only. No account, real learner or production API is used.
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import CommunityEditor from '../../src/pages/CommunityEditor';
import {emptyDoc,checkDoc,migrateCommunityDocToCanonical,type CommunityDoc} from '../../src/lib/communityFormat';
import {downloadCommunityCourse} from '../../src/lib/community';
import {normalizeCourse} from '../../src/lib/course';
import {requestNavigation} from '../../src/lib/navigationGuard';
import '../../src/styles.css';
const key='synthetic-community-controls';
const mode=new URLSearchParams(location.search).get('mode')||'legacy';
function seed():CommunityDoc {
 const doc=emptyDoc('Synthetic community controls');doc.description='Original synthetic browser-test material only.';
 doc.modules=[{id:'first',title:'First unit'},{id:'second',title:'Second unit'}];
 doc.lessons=[{id:'alpha',title:'Alpha lesson',blocks:[{type:'text',md:'Alpha original body. **Preserve this text.**'}]},{id:'beta',module:'second',title:'Beta lesson',blocks:[{type:'text',md:'Beta original body.'}]}];
 doc.glossary=[{term:'synthetic',definition:'An original test example.'}];doc.decks=[{id:'cards',title:'Original cards',cards:[{id:'c1',front:'Original front',back:'Original back'}]}];
 return mode==='canonical'?migrateCommunityDocToCanonical(doc,'synthetic-controls',()=>'',location.origin):doc;
}
type State={draft:CommunityDoc,published:CommunityDoc|null,version:number,saves:number,publishes:number,requests:string[]};
let state:State=JSON.parse(sessionStorage.getItem(key+mode)||'null')||{draft:seed(),published:null,version:0,saves:0,publishes:0,requests:[]};
let failSaves=false;let delay=0;
const persist=()=>sessionStorage.setItem(key+mode,JSON.stringify(state));persist();
const originalFetch=window.fetch.bind(window);
window.fetch=async(input,init)=>{
 const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.href);
 if(!url.pathname.startsWith('/synthetic-api/'))return originalFetch(input,init);
 const method=init?.method||'GET';const route=url.pathname.replace('/synthetic-api','');state.requests.push(method+' '+route);
 const response=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
 if(delay)await new Promise(resolve=>setTimeout(resolve,delay));
 if(route==='/drafts/synthetic-controls/editors')return response({owner:{id:'fixture-author',name:'Synthetic author'},editors:[]});
 if(route==='/drafts/synthetic-controls'&&method==='GET')return response({id:'synthetic-controls',doc:structuredClone(state.draft),status:state.version?'published':'draft',version:state.version,review:'not_reviewed',reviewNote:null,role:'owner'});
 if(route==='/drafts/synthetic-controls'&&method==='PUT'){
  if(failSaves)return response({error:'Synthetic save interruption'},503);
  const doc=JSON.parse(String(init?.body));const errors=checkDoc(doc,false,{communityImageOrigin:location.origin});if(errors.length)return response({error:'Invalid synthetic draft',errors},422);
  state.draft=structuredClone(doc);state.saves++;persist();return response({ok:true});
 }
 if(route==='/drafts/synthetic-controls/publish'&&method==='POST'){
  const errors=checkDoc(state.draft,true,{communityImageOrigin:location.origin});if(errors.length)return response({error:'Invalid publication',errors},422);
  state.published=structuredClone(state.draft);state.version++;state.publishes++;persist();return response({version:state.version});
 }
 if(route==='/courses/synthetic-controls'&&method==='GET')return state.published?response({id:'synthetic-controls',doc:state.published,version:state.version,review:'not_reviewed',author:'Synthetic author'}):response({error:'Not published'},404);
 throw Error('Unexpected synthetic API call: '+method+' '+route);
};
function Fixture(){const[notice,setNotice]=useState(''),[installed,setInstalled]=useState<any>(null),[epoch,setEpoch]=useState(0);
 const api:any={toast:setNotice,go:()=>setNotice('Returned to synthetic author courses'),courses:[],allCourses:[],progress:{attempts:[],lessonsDone:{}}};
 Object.assign(window,{communityControlsFixture:{state:()=>structuredClone(state),failSaves:(on:boolean)=>{failSaves=on;},delay:(ms:number)=>{delay=ms;},install:async()=>{const course=normalizeCourse(await downloadCommunityCourse('synthetic-controls'));setInstalled(course);return course;},reopen:()=>{if(requestNavigation('app',{name:'communityEdit',id:'synthetic-controls'} as any))setEpoch(x=>x+1);},check:()=>checkDoc(state.draft,true,{communityImageOrigin:location.origin})}});
 return <><p className="notice">Synthetic-only test environment. No real author accounts or production publication.</p>{notice&&<p role="status">{notice}</p>}<CommunityEditor key={epoch} api={api} id="synthetic-controls"/>{installed&&<section aria-label="Installed synthetic course"><h2>{installed.title}</h2><p>{installed.community?.review}</p><ul>{installed.lessons.map((lesson:any)=><li key={lesson.id}>{lesson.title}: {lesson.module}</li>)}</ul></section>}</>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
