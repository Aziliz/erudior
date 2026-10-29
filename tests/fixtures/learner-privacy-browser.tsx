import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import Panel from '../../src/components/LearnerPrivacyPanel';
import {createLearnerPrivacyStore,type PrivacyRemote} from '../../src/lib/learnerPrivacyStore';
import {learnerBindingEqual,parseLearnerEnvelope,signLearnerGrant,validateLearnerGrant,learnerCanonical} from '../../src/lib/learnerPrivacy';
import {learnerPrivacyFixture,learnerPrivacyProgress} from './learnerPrivacy';
import type {Progress} from '../../src/lib/types';
const fixture=await learnerPrivacyFixture(Math.floor(Date.now()/1000));
const prefix='synthetic-learner-privacy-fixture.';
let fail=false,tail=Promise.resolve();
const getProgress=(id:string|null):Progress=>JSON.parse(localStorage.getItem(prefix+'progress.'+id)??JSON.stringify(learnerPrivacyProgress()));
const saveProgress=(id:string|null,value:Progress)=>localStorage.setItem(prefix+'progress.'+id,JSON.stringify(value));
const getRemote=()=>JSON.parse(localStorage.getItem(prefix+'remote')??'null');
function remote(id:string|null):PrivacyRemote{
 const binding={...fixture.binding,profile:id==='learnerone'?'profile-synthetic':'profile-synthetic-two'};
 return {binding,async request(operation,body){
  const now=Math.floor(Date.now()/1000),grant={...fixture.grant,...binding,issuedAt:now,expiresAt:now+120};delete (grant as any).schemaVersion;
  const verified=validateLearnerGrant(signLearnerGrant(grant,'synthetic-key',fixture.key.secretKey),fixture.trust,now,operation==='write'?'write':operation==='erase'?'erase':'read');
  if(verified.profile!==binding.profile)throw Error('Synthetic identity mismatch.');
  if(operation==='write'&&fail){fail=false;throw Error('Synthetic offline interruption; encrypted queue is preserved.');}
  const row=getRemote();
  if(operation==='read')return row?row.state==='active'?{state:'active',revision:row.revision,expiresAt:row.expiresAt,envelope:row.envelope}:{state:row.state,revision:row.revision,expiresAt:null}:{state:'empty',revision:0,expiresAt:null};
  if(row&&row.state!=='active')throw Error('410 Remote slot is terminal.');
  if(operation==='write'){
   const envelope=parseLearnerEnvelope(body.envelope);if(!learnerBindingEqual(envelope.binding,binding))throw Error('Synthetic encrypted subject mismatch.');
   if(row?.requestId===body.requestId){if(row.requestHash!==learnerCanonical(body))throw Error('409 Request changed.');return {state:'active',revision:row.revision,expiresAt:row.expiresAt};}
   if(body.expectedRevision!==(row?.revision??0))throw Error('409 Synthetic server revision changed; explicitly resolve the conflict.');
   const next={state:'active',revision:(row?.revision??0)+1,expiresAt:now+Number(body.retentionDays)*86400,envelope,requestId:body.requestId,requestHash:learnerCanonical(body)};localStorage.setItem(prefix+'remote',JSON.stringify(next));return {state:'active',revision:next.revision,expiresAt:next.expiresAt};
  }
  if(body.expectedRevision!==(row?.revision??0))throw Error('409 Synthetic server revision changed.');
  const next={state:'erased',revision:(row?.revision??0)+1,expiresAt:null};localStorage.setItem(prefix+'remote',JSON.stringify(next));return next;
 }};
}
function service(profile:string,enabled:boolean){return createLearnerPrivacyStore({
 read:async()=>localStorage.getItem(prefix+'state'),
 update:change=>{const operation=tail.then(async()=>{const next=await change(localStorage.getItem(prefix+'state'));localStorage.setItem(prefix+'state',next);return next;});tail=operation.then(()=>{},()=>{});return operation;},
 authorize:async id=>{if(id!==profile)throw Error('Synthetic profile changed.');return `synthetic-authority-${profile}`;},
 courses:async()=>[structuredClone(fixture.course)],progress:async id=>getProgress(id),updateProgress:async(id,change)=>{const next=await change(getProgress(id));saveProgress(id,next);return next;},
 ...(enabled?{remote:async(id:string|null)=>remote(id)}:{}),now:()=>new Date().toISOString(),
 }).forProfile(profile);}
Object.assign(window,{learnerPrivacyFixture:{clearRecoverableCheckpoint:()=>{const p=getProgress('learnerone');delete p.lessonsDone['synthetic-practice/lesson-one'];saveProgress('learnerone',p);},hasRecovered:()=>{const p=getProgress('learnerone');return p.lessonsDone['synthetic-practice/lesson-one']==='2026-10-29'&&p.qmeta?.private.note==='Private note NEVER included'&&p.drills['synthetic-practice/practice'].attempts===3;},failNextUpload:()=>{fail=true;},advanceRemoteRevision:()=>{const r=getRemote();if(!r)throw Error('No synthetic remote checkpoint.');r.revision++;r.requestId='other-synthetic-device';localStorage.setItem(prefix+'remote',JSON.stringify(r));}}});
function Fixture(){const [enabled,setEnabled]=useState(localStorage.getItem(prefix+'enabled')==='true'),[profile,setProfile]=useState('learnerone'),api=useMemo(()=>service(profile,enabled),[profile,enabled]);return <><p>Isolated synthetic fixture only. Ephemeral external-identity keys and browser-local fake transport do not configure production. The production API is tested separately with isolated real D1 and TLS.</p><div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}><button className="btn" style={{whiteSpace:'normal',minHeight:32}} onClick={()=>{localStorage.setItem(prefix+'enabled','true');setEnabled(true);}}>Use synthetic configured identity</button><button className="btn" style={{whiteSpace:'normal',minHeight:32}} onClick={()=>setProfile(p=>p==='learnerone'?'learnertwo':'learnerone')}>Switch synthetic profile</button></div><Panel service={api} profileKey={profile}/></>;}
export const fixtureRoot=createRoot(document.getElementById('root')!);
fixtureRoot.render(<React.StrictMode><Fixture/></React.StrictMode>);
