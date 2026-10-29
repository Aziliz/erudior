import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import Panel from '../../src/components/LearnerPrivacyPanel';
import {createLearnerPrivacyStore,type PrivacyRemote} from '../../src/lib/learnerPrivacyStore';
import {learnerBindingEqual,parseLearnerEnvelope,signLearnerGrant,validateLearnerGrant,learnerCanonical,learnerHash} from '../../src/lib/learnerPrivacy';
import {learnerPrivacyFixture,learnerPrivacyProgress} from './learnerPrivacy';
import type {Progress} from '../../src/lib/types';
const fixture=await learnerPrivacyFixture(Math.floor(Date.now()/1000));
const prefix='synthetic-learner-privacy-fixture.';
let fail=false,tail=Promise.resolve();
const getProgress=(id:string|null):Progress=>JSON.parse(localStorage.getItem(prefix+'progress.'+id)??JSON.stringify(learnerPrivacyProgress()));
const saveProgress=(id:string|null,value:Progress)=>localStorage.setItem(prefix+'progress.'+id,JSON.stringify(value));
const getRemote=()=>JSON.parse(localStorage.getItem(prefix+'remote')??'null');
const anonymousState=()=>JSON.parse(localStorage.getItem(prefix+'state')??'null');
const clearAnonymousState=()=>{const state=anonymousState();if(state){state.profiles=state.profiles.filter((p:{studentId:string|null})=>p.studentId!==null);state.revision++;localStorage.setItem(prefix+'state',JSON.stringify(state));}};
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
function service(profile:string|null,enabled:boolean){return createLearnerPrivacyStore({
 anonymous:{
 read:async()=>{const progress=getProgress(null),session=null,generation=Number(localStorage.getItem(prefix+'generation')??0);const profile=anonymousState()?.profiles?.find((p:{studentId:string|null})=>p.studentId===null);return {progress,session,files:{},missingFiles:[],generation,progressDigest:await learnerHash(progress),sessionDigest:await learnerHash(session),privacyDigest:await learnerHash(anonymousState()),anonymousAssociation:!!profile?.consent,anonymousPending:!!profile?.pending};},
 erase:async(expected,guard)=>{const progress=getProgress(null),generation=Number(localStorage.getItem(prefix+'generation')??0);if(generation!==expected.generation||await learnerHash(anonymousState())!==expected.privacyDigest||await learnerHash(progress)!==expected.progressDigest)throw Error('Anonymous data changed. Inspect again.');await guard?.();const next={version:1,seeded:false,attempts:[],stats:{},cards:{},lessonsDone:{},plans:{},activity:{},drills:{}} as Progress;clearAnonymousState();saveProgress(null,next);localStorage.setItem(prefix+'generation',String(generation+1));return {progress:next,retainedFileIds:[]};},
 recover:async(expected,progress,_session,_files,guard)=>{const generation=Number(localStorage.getItem(prefix+'generation')??0);if(generation!==expected.generation||await learnerHash(anonymousState())!==expected.privacyDigest||await learnerHash(getProgress(null))!==expected.progressDigest)throw Error('Anonymous data changed. Preview again.');await guard?.();clearAnonymousState();saveProgress(null,progress);localStorage.setItem(prefix+'generation',String(generation+1));return {progress,retainedFileIds:[]};},
 sources:async()=>({courses:[fixture.course],banks:[]}),changed:async()=>{},
 },
 read:async()=>localStorage.getItem(prefix+'state'),
 update:change=>{const operation=tail.then(async()=>{const next=await change(localStorage.getItem(prefix+'state'));localStorage.setItem(prefix+'state',next);return next;});tail=operation.then(()=>{},()=>{});return operation;},
 authorize:async id=>{if(id!==profile)throw Error('Synthetic profile changed.');return `synthetic-authority-${profile}`;},
 courses:async()=>[structuredClone(fixture.course)],progress:async id=>getProgress(id),updateProgress:async(id,change)=>{const next=await change(getProgress(id));saveProgress(id,next);return next;},
 ...(enabled?{remote:async(id:string|null)=>remote(id)}:{}),now:()=>new Date().toISOString(),
 }).forProfile(profile);}
Object.assign(window,{learnerPrivacyFixture:{clearRecoverableCheckpoint:()=>{const p=getProgress('learnerone');delete p.lessonsDone['synthetic-practice/lesson-one'];saveProgress('learnerone',p);},hasRecovered:()=>{const p=getProgress('learnerone');return p.lessonsDone['synthetic-practice/lesson-one']==='2026-10-29'&&p.qmeta?.private.note==='Private note NEVER included'&&p.drills['synthetic-practice/practice'].attempts===3;},anonymousErased:()=>Object.keys(getProgress(null).lessonsDone).length===0&&!getProgress(null).qmeta,anonymousRecovered:()=>getProgress(null).qmeta?.private.note==='Private note NEVER included',managedPreserved:()=>getProgress('learnerone').qmeta?.private.note==='Private note NEVER included',failNextUpload:()=>{fail=true;},advanceRemoteRevision:()=>{const r=getRemote();if(!r)throw Error('No synthetic remote checkpoint.');r.revision++;r.requestId='other-synthetic-device';localStorage.setItem(prefix+'remote',JSON.stringify(r));}}});
function Fixture(){const [enabled,setEnabled]=useState(localStorage.getItem(prefix+'enabled')==='true'),[profile,setProfile]=useState<string|null>('learnerone'),api=useMemo(()=>service(profile,enabled),[profile,enabled]);return <><p>Isolated synthetic fixture only. Ephemeral external-identity keys and browser-local fake transport do not configure production. The production API is tested separately with isolated real D1 and TLS.</p><div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}><button className="btn" style={{whiteSpace:'normal',minHeight:32}} onClick={()=>{localStorage.setItem(prefix+'enabled','true');setEnabled(true);}}>Use synthetic configured identity</button><button className="btn" style={{whiteSpace:'normal',minHeight:32}} onClick={()=>setProfile(p=>p==='learnerone'?'learnertwo':'learnerone')}>Switch synthetic profile</button><button className="btn" style={{whiteSpace:'normal',minHeight:32}} onClick={()=>{setEnabled(false);setProfile(null);}}>Use synthetic anonymous practice</button></div><Panel service={api} profileKey={profile??'anonymous'}/></>;}
export const fixtureRoot=createRoot(document.getElementById('root')!);
fixtureRoot.render(<React.StrictMode><Fixture/></React.StrictMode>);
// Actual browser IndexedDB regression; invoked only in this isolated synthetic fixture.
export const actualSession=JSON.stringify({version:1,savedAt:'2026-10-29T16:00:00.000Z',session:{id:'synthetic-session',bankId:'synthetic-bank',bankTitle:'Synthetic practice',mode:'practice',items:[{qid:'question',order:[0,1]}],blocks:[{start:0,end:1}],startedAt:1},state:{index:0,answers:{},flags:{},checked:{},blockIdx:0,blockUsed:[0]}});
Object.assign(window,{anonymousStorageProof:{
 async seed(){const s=await import('../../src/lib/storage'),d=await import('../../src/lib/documents');s.useStudentFiles(null);const p=learnerPrivacyProgress(),ref=(fileId:string)=>({id:fileId,fileId,name:'Synthetic attachment',mime:'text/plain',bytes:4,caption:'Synthetic only',date:'2026-10-29'});p.logs=[{id:'unique-log',courseId:fixture.course.id,date:'2026-10-29',type:'practice',minutes:1,note:'synthetic',file:ref('anon_unique')},{id:'shared-log',courseId:fixture.course.id,date:'2026-10-29',type:'practice',minutes:1,note:'synthetic',file:ref('anon_shared')}];const model=await import('../../src/lib/anonymousPrivacy');model.parseAnonymousProgress(p);model.parseAnonymousSession(actualSession);await d.putFile('anon_unique',{mime:'text/plain',data:'dGVzdA=='});await d.putFile('anon_shared',{mime:'text/plain',data:'dGVzdA=='});await s.saveProgress(p);await s.saveSessionState(actualSession);await s.saveState('progress-preserved',JSON.stringify({...s.emptyProgress(),logs:[{id:'managed-shared',courseId:fixture.course.id,date:'2026-10-29',type:'practice',minutes:1,note:'managed synthetic record',file:ref('anon_shared')}]}));await s.saveCourse(fixture.course);localStorage.setItem(prefix+'actualRecovery',JSON.stringify(await s.readAnonymousPrivacy()));return true;},
 async erase(){const s=await import('../../src/lib/storage'),d=await import('../../src/lib/documents');const snapshot=await s.readAnonymousPrivacy(),result=await s.eraseAnonymousPrivacy(snapshot);let staleProgress=false,staleSession=false,staleAttachment=false;try{await s.saveProgress(snapshot.progress);}catch{staleProgress=true;}try{await s.saveSessionState('stale writer');}catch{staleSession=true;}try{await d.putFile('anon_late',{mime:'text/plain',data:'dGVzdA=='});}catch{staleAttachment=true;}return {staleProgress,staleSession,staleAttachment,retained:result.retainedFileIds,uniqueRemoved:await d.loadFile('anon_unique')===null,sharedPresent:!!await d.loadFile('anon_shared'),managedPresent:!!await s.loadState('progress-preserved'),coursePresent:(await s.listCourses()).courses.some(c=>c.id===fixture.course.id)};},
 async recover(){const s=await import('../../src/lib/storage'),d=await import('../../src/lib/documents'),saved=JSON.parse(localStorage.getItem(prefix+'actualRecovery')!);const current=await s.readAnonymousPrivacy();const recovered=await s.recoverAnonymousPrivacy(current,saved.progress,saved.session,saved.files);if(recovered.progress.anonymousGeneration!==current.generation+1)throw Error('Wrong recovered generation');const after=await s.readAnonymousPrivacy();return after.progress.qmeta?.private.note==='Private note NEVER included'&&after.session===actualSession&&!!await d.loadFile('anon_unique')&&!!await s.loadState('progress-preserved');},
 async fresh(){const s=await import('../../src/lib/storage');const p=await s.loadBaseProgress();await s.saveProgress(p);await s.saveSessionState(actualSession);return true;},
 async stale(){const s=await import('../../src/lib/storage');try{await s.saveSessionState('old realm retry');return false;}catch{return true;}}
}});
