import { checkDoc, type CommunityDoc, LIMITS } from '../../src/lib/communityFormat';
import { preparePromotionCandidate, type PromotionCandidate } from '../../src/lib/promotionCandidate';
import { createPromotionReview, createPromotionHandoff, promotionDigest, parsePromotionJson, parsePromotionReviewInput, parsePromotionReviewRecord, promotionRequiresMediaEvidence, verifyPromotionCandidate, type PromotionReviewRecord } from '../../src/lib/promotionReview';
import { studioHash } from './adminStudio';

export interface PromotionEnv { DB:D1Database; FILES:R2Bucket; APP_ORIGIN:string; API_ORIGIN:string; }
class PromotionError extends Error { constructor(public status:number,message:string){super(message);} }
// Only this explicit result proves that the metadata transaction did not commit.
class NotCommitted extends PromotionError { constructor(){super(409,'Candidate, source, quota or administrator access changed. Retry with the same request identity.');} }
const fail=(status:number,message:string):never=>{throw new PromotionError(status,message);};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const validId=(value:unknown):value is string=>typeof value==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(value)&&!['__proto__','prototype','constructor'].includes(value);
const validDigest=(value:unknown):value is string=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const validRevision=(value:unknown):value is number=>Number.isSafeInteger(value)&&Number(value)>0;
const now=()=>new Date().toISOString();
const MAX_BUNDLE_BYTES=32*1024*1024, MAX_REQUEST_BYTES=204*1024, MAX_CANDIDATES_PER_ACTOR=100, MAX_SOURCE_IMAGES=256;
type State='prepared'|'reviewed'|'rejected'|'revoked';
interface Actor { id:string; tokenHash:string; }
interface SourceRow { id:string; owner_id:string; title:string; version:number; reviewed_at:string; reviewed_by:string; published_at:string; }
interface ImageGuard { id:string; owner_id:string; mime:string; bytes:number; created_at:string; sha256:string; }
interface SourceGuard extends SourceRow { packageSha256:string; images:ImageGuard[]; }
interface Source {communityId:string;title:string;publishedVersion:number;ownerId:string;reviewedAt:string;publishedAt:string;packageSha256:string;}
interface HistoryRow {id:string;candidate_revision:number;record:string;}
interface CandidateRow {id:string;title:string;source:string;source_guard:string;object_key:string;digest:string;revision:number;state:State;review:string|null;created_by:string;created_at:string;updated_at:string;}
const actorSQL=`SELECT 1 FROM users a JOIN sessions s ON s.user_id=a.id WHERE a.id=? AND a.role='admin' AND a.banned=0 AND a.accepted_at IS NOT NULL AND a.accepted_at!='' AND a.terms_version>=2 AND s.token_hash=? AND s.expires_at>strftime('%Y-%m-%dT%H:%M:%fZ','now')`;
// A source is the exact reviewed publication and owner, not an editable draft or a
// review badge for a different version. Media belongs to its current authoring team.
const sourceSQL=`SELECT 1 FROM courses c JOIN users owner ON owner.id=c.owner_id WHERE c.id=json_extract(?,'$.id')
 AND c.owner_id=json_extract(?,'$.owner_id') AND c.status='published' AND c.version=json_extract(?,'$.version') AND c.reviewed_version=c.version
 AND c.reviewed_by IS NOT NULL AND c.reviewed_by!='' AND c.reviewed_at=json_extract(?,'$.reviewed_at') AND c.reviewed_by IS json_extract(?,'$.reviewed_by') AND c.published_at=json_extract(?,'$.published_at')
 AND owner.banned=0 AND owner.accepted_at IS NOT NULL AND owner.accepted_at!='' AND owner.terms_version>=2
 AND NOT EXISTS (SELECT 1 FROM json_each(?,'$.images') wanted WHERE NOT EXISTS (
 SELECT 1 FROM images i JOIN users media_owner ON media_owner.id=i.owner_id WHERE i.id=json_extract(wanted.value,'$.id')
 AND i.owner_id=json_extract(wanted.value,'$.owner_id') AND i.mime=json_extract(wanted.value,'$.mime') AND i.bytes=json_extract(wanted.value,'$.bytes') AND i.created_at=json_extract(wanted.value,'$.created_at')
 AND media_owner.banned=0 AND (i.owner_id=c.owner_id OR EXISTS (SELECT 1 FROM course_editors e WHERE e.course_id=c.id AND e.user_id=i.owner_id))))`;
// History is append-only and bounded by this terminal state machine (at most two
// decisions). Bind the exact retained rows as well as the current candidate row.
const historySQL=`(SELECT COUNT(*) FROM promotion_reviews h WHERE h.candidate_id=promotion_candidates.id)=? AND NOT EXISTS (
 SELECT 1 FROM json_each(?) wanted WHERE NOT EXISTS (SELECT 1 FROM promotion_reviews h WHERE h.candidate_id=promotion_candidates.id
 AND h.id=json_extract(wanted.value,'$.id') AND h.candidate_revision=json_extract(wanted.value,'$.candidate_revision') AND h.record=json_extract(wanted.value,'$.record')))`;
const historyArgs=(rows:HistoryRow[])=>[rows.length,JSON.stringify(rows)];
const args=(a:Actor)=>[a.id,a.tokenHash];
const sourceArgs=(guard:SourceGuard)=>Array(7).fill(JSON.stringify(guard));
const reviewActorSQL=`SELECT 1 FROM users reviewer WHERE reviewer.id=json_extract(?,'$.reviewer') AND reviewer.role='admin' AND reviewer.banned=0 AND reviewer.accepted_at IS NOT NULL AND reviewer.accepted_at!='' AND reviewer.terms_version>=2`;
async function actor(req:Request,env:PromotionEnv):Promise<Actor>{
 let token='';try{for(const part of (req.headers.get('Cookie')??'').split(';')){const index=part.indexOf('=');if(part.slice(0,index).trim()==='erudior_session')token=decodeURIComponent(part.slice(index+1));}}catch{fail(401,'Sign in first.');}
 if(!token||token.length>1000)fail(401,'Sign in first.');
 const a={id:'',tokenHash:await studioHash(token)};
 const row=await env.DB.prepare(`SELECT a.id FROM users a JOIN sessions s ON s.user_id=a.id WHERE a.role='admin' AND a.banned=0 AND a.accepted_at IS NOT NULL AND a.accepted_at!='' AND a.terms_version>=2 AND s.token_hash=? AND s.expires_at>strftime('%Y-%m-%dT%H:%M:%fZ','now')`).bind(a.tokenHash).first<{id:string}>();
 if(!row)fail(403,'Current administrator access and accepted terms are required.');a.id=row!.id;return a;
}
async function recheck(env:PromotionEnv,a:Actor,guard?:SourceGuard){
 const found=await env.DB.prepare(`SELECT 1 AS ok WHERE EXISTS (${actorSQL}) ${guard?`AND EXISTS (${sourceSQL})`:''}`).bind(...args(a),...(guard?sourceArgs(guard):[])).first();
 if(!found)fail(409,'Administrator access or the reviewed source changed. Reload before continuing.');
}
function keys(body:Record<string,unknown>,allowed:string[]){if(Object.keys(body).some(key=>!allowed.includes(key)))fail(400,'Unsupported request fields. Imported content cannot create review authority.');}
async function body(req:Request):Promise<Record<string,unknown>>{
 if(!/^application\/json(?:\s*;|$)/i.test(req.headers.get('Content-Type')??''))fail(415,'JSON is required.');
 const reader=req.body?.getReader();if(!reader)fail(400,'A JSON body is required.');
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader!.read();if(done)break;size+=value.byteLength;if(size>MAX_REQUEST_BYTES){await reader!.cancel();fail(413,'The promotion request exceeds its limit.');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 let value:unknown;try{value=parsePromotionJson(bytes,MAX_REQUEST_BYTES);}catch{fail(400,'Invalid JSON.');}
 if(!value||typeof value!=='object'||Array.isArray(value))fail(400,'Invalid request.');return value as Record<string,unknown>;
}
async function boundedText(object:R2ObjectBody|null,max:number,label:string):Promise<string>{
 if(!object||object.size>max)fail(409,`${label} is unavailable or too large.`);
 const reader=object!.body.getReader();const chunks:Uint8Array[]=[];let length=0;
 while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>max){await reader.cancel();fail(409,`${label} is too large.`);}chunks.push(value);}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{return new TextDecoder('utf-8',{fatal:true,ignoreBOM:false}).decode(bytes);}catch{return fail(409,`${label} is not valid UTF-8.`);}
}
function mimeFor(bytes:Uint8Array):string|null{
 if(bytes.length>=8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n))return 'image/png';
 if(bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';
 const first=String.fromCharCode(...bytes.subarray(0,12));
 if(first.startsWith('GIF87a')||first.startsWith('GIF89a'))return 'image/gif';
 if(first.slice(0,4)==='RIFF'&&first.slice(8,12)==='WEBP')return 'image/webp';return null;
}
async function loadSource(env:PromotionEnv,a:Actor,id:string,version:number):Promise<{source:Source;guard:SourceGuard;candidate:PromotionCandidate;digest:string}>{
 const row=await env.DB.prepare(`SELECT c.id,c.owner_id,c.title,c.version,c.reviewed_at,c.reviewed_by,c.published_at FROM courses c JOIN users owner ON owner.id=c.owner_id WHERE c.id=? AND c.version=? AND c.status='published' AND c.reviewed_version=c.version AND c.reviewed_at IS NOT NULL AND c.reviewed_by IS NOT NULL AND c.reviewed_by!='' AND c.published_at IS NOT NULL AND owner.banned=0 AND owner.accepted_at IS NOT NULL AND owner.accepted_at!='' AND owner.terms_version>=2 AND EXISTS (${actorSQL})`).bind(id,version,...args(a)).first<SourceRow>();
 if(!row)fail(409,'That exact reviewed publication is no longer available.');
 const text=await boundedText(await env.FILES.get(`courses/${id}.v${version}.json`),LIMITS.docBytes,'Published source');
 let doc:CommunityDoc;try{doc=parsePromotionJson(text,LIMITS.docBytes) as CommunityDoc;}catch{return fail(409,'The published source is invalid.');}
 if(!doc!.canonical||checkDoc(doc!,true,{communityImageOrigin:env.API_ORIGIN}).length)fail(409,'Promotion requires a valid reviewed canonical publication.');
 const guard:SourceGuard={...row!,packageSha256:await studioHash(text),images:[]};
 let candidate:PromotionCandidate;
 try{candidate=await preparePromotionCandidate({payload:doc!.canonical,communityId:id,publishedVersion:version,communityImageOrigin:env.API_ORIGIN},async imageId=>{
  if(guard.images.length>=MAX_SOURCE_IMAGES)fail(409,'A promotion candidate can contain at most 256 community images.');
  const image=await env.DB.prepare(`SELECT i.id,i.owner_id,i.mime,i.bytes,i.created_at FROM images i JOIN users image_owner ON image_owner.id=i.owner_id WHERE i.id=? AND image_owner.banned=0 AND (i.owner_id=? OR EXISTS (SELECT 1 FROM course_editors e WHERE e.course_id=? AND e.user_id=i.owner_id)) AND EXISTS (${actorSQL})`).bind(imageId,row!.owner_id,id,...args(a)).first<Omit<ImageGuard,'sha256'>>();
  if(!image||image.bytes<1||image.bytes>LIMITS.imageBytes)fail(409,'A source image is missing or is not owned by the current authoring team.');
  const object=await env.FILES.get(`images/${imageId}`);
  if(!object||object.size!==image!.bytes||object.size>LIMITS.imageBytes||object.httpMetadata?.contentType!==image!.mime)fail(409,'A source image no longer matches its ownership record.');
  const bytes=new Uint8Array(await object!.arrayBuffer());
  if(bytes.length!==image!.bytes||mimeFor(bytes)!==image!.mime)fail(409,'A source image has invalid or changed bytes.');
  let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
  const sha256=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
  guard.images.push({...image!,sha256});return `data:${image!.mime};base64,${btoa(binary)}`;
 });}catch(e){if(e instanceof PromotionError)throw e;return fail(409,(e as Error).message||'Source media cannot be prepared.');}
 const digest=await promotionDigest(candidate!);
 if(new TextEncoder().encode(JSON.stringify(candidate!)).length>MAX_BUNDLE_BYTES)fail(409,'The prepared candidate exceeds its private storage limit.');
 await recheck(env,a,guard);
 return {source:{communityId:id,title:row!.title,publishedVersion:version,ownerId:row!.owner_id,reviewedAt:row!.reviewed_at,publishedAt:row!.published_at,packageSha256:guard.packageSha256},guard,candidate:candidate!,digest};
}
async function candidateRow(env:PromotionEnv,a:Actor,id:string):Promise<CandidateRow>{
 const row=await env.DB.prepare(`SELECT * FROM promotion_candidates WHERE id=? AND EXISTS (${actorSQL})`).bind(id,...args(a)).first<CandidateRow>();
 if(!row)fail(404,'Candidate not found or access changed.');return row!;
}
async function storedCandidate(env:PromotionEnv,row:CandidateRow):Promise<PromotionCandidate>{
 const text=await boundedText(await env.FILES.get(row.object_key),MAX_BUNDLE_BYTES,'Private candidate');
 let candidate:PromotionCandidate;try{candidate=parsePromotionJson(text,MAX_BUNDLE_BYTES) as PromotionCandidate;await verifyPromotionCandidate(candidate,{communityImageOrigin:env.API_ORIGIN});}catch{return fail(409,'The private candidate failed integrity validation.');}
 if(await promotionDigest(candidate!)!==row.digest)fail(409,'The private candidate digest changed.');return candidate!;
}
async function currentSource(env:PromotionEnv,a:Actor,row:CandidateRow){
 const guard=JSON.parse(row.source_guard) as SourceGuard;
 const current=await loadSource(env,a,guard.id,guard.version);
 if(current.digest!==row.digest||JSON.stringify(current.guard)!==row.source_guard)fail(409,'The exact source package, media, ownership or review changed. Prepare a new candidate.');
 return current.guard;
}
async function decisionHistory(env:PromotionEnv,a:Actor,row:CandidateRow,candidate:PromotionCandidate){
 const result=await env.DB.prepare(`SELECT id,candidate_revision,record FROM promotion_reviews WHERE candidate_id=? AND EXISTS (${actorSQL}) ORDER BY candidate_revision LIMIT 3`).bind(row.id,...args(a)).all<HistoryRow>();
 const rows=result.results;const decisions:Record<State,string[]>={prepared:[],reviewed:['approved-for-handoff'],rejected:['rejected'],revoked:['approved-for-handoff','revoked']};
 if(rows.length!==decisions[row.state].length||row.revision!==rows.length+1||(rows.at(-1)?.record??null)!==row.review)fail(409,'Retained decision history failed integrity validation.');
 const records:PromotionReviewRecord[]=[];
 for(const [index,item] of rows.entries()){
  let record:PromotionReviewRecord;try{record=parsePromotionReviewRecord(item.record);}catch{return fail(409,'Retained decision history failed integrity validation.');}
  if(record!.id!==item.id||record!.revision!==item.candidate_revision||record!.revision!==index+2||record!.decision!==decisions[row.state][index]
   ||record!.candidateSha256!==row.digest||record!.communityId!==candidate.provenance.communityId||record!.publishedVersion!==candidate.provenance.publishedVersion
   ||record!.sourceSha256!==candidate.provenance.sourceSha256||record!.courseSha256!==candidate.provenance.courseSha256
   ||record!.intendedOfficial.courseId!==candidate.course.id||record!.intendedOfficial.revision!==(candidate.course.revision??1)
   ||record!.decision==='approved-for-handoff'&&promotionRequiresMediaEvidence(candidate.course)&&!record!.evidence.some(e=>e.kind==='media-rights'))fail(409,'Retained decision history failed integrity validation.');
  records.push(record!);
 }
 return {rows,records};
}
// Last SQL statement binds session, exact candidate state and source/media metadata
// after all R2/crypto awaits. No stale review authority is released by an envelope.
async function finalGuard(env:PromotionEnv,a:Actor,row:CandidateRow,history:HistoryRow[],requireCurrent:boolean,requireReviewer=false){
 const current=await env.DB.prepare(`SELECT CASE WHEN EXISTS (${sourceSQL}) THEN 1 ELSE 0 END AS source_current,
 CASE WHEN EXISTS (${reviewActorSQL}) THEN 1 ELSE 0 END AS reviewer_current
 FROM promotion_candidates WHERE id=? AND revision=? AND digest=? AND state=? AND review IS ? AND source_guard=? AND object_key=? AND source=? AND EXISTS (${actorSQL}) AND ${historySQL}`).bind(...sourceArgs(JSON.parse(row.source_guard)),row.review,row.id,row.revision,row.digest,row.state,row.review,row.source_guard,row.object_key,row.source,...args(a),...historyArgs(history)).first<{source_current:number;reviewer_current:number}>();
 if(!current||requireCurrent&&(!current.source_current||requireReviewer&&row.state==='reviewed'&&!current.reviewer_current))fail(409,'Candidate, source review or administrator authority changed. Reload before continuing.');
 return current!;
}
async function envelope(env:PromotionEnv,a:Actor,row:CandidateRow){
 const candidate=await storedCandidate(env,row);const history=await decisionHistory(env,a,row,candidate);const problems:string[]=[];
 try{await currentSource(env,a,row);}catch(e){if(e instanceof PromotionError&&e.status===409)problems.push(e.message);else throw e;}
 const authority=await finalGuard(env,a,row,history.rows,problems.length===0);
 if(!authority.source_current&&!problems.length)problems.push('The reviewed source is no longer current.');
 if(row.state==='reviewed'&&!authority.reviewer_current)problems.push('The recorded reviewer no longer has administrator authority.');
 return {id:row.id,title:row.title,revision:row.revision,state:row.state,source:JSON.parse(row.source) as Source,candidate,digest:row.digest,review:row.review?JSON.parse(row.review) as PromotionReviewRecord:null,history:history.records,problems,canExport:row.state==='reviewed'&&!problems.length,createdAt:row.created_at,updatedAt:row.updated_at};
}
async function replay(env:PromotionEnv,a:Actor,requestId:string,fingerprint:string):Promise<Response|null>{
 const op=await env.DB.prepare(`SELECT candidate_id,result_revision,fingerprint FROM promotion_operations WHERE actor_id=? AND request_id=? AND EXISTS (${actorSQL})`).bind(a.id,requestId,...args(a)).first<{candidate_id:string;result_revision:number;fingerprint:string}>();
 if(!op)return null;if(op.fingerprint!==fingerprint)fail(409,'That request identity was already used for different content.');
 const row=await candidateRow(env,a,op.candidate_id);if(row.revision!==op.result_revision)fail(409,'This request completed, but the candidate changed afterward. Reload the saved candidate.');
 return reply(await envelope(env,a,row));
}
async function journal(env:PromotionEnv,a:Actor,requestId:string,fingerprint:string,id:string,revision:number,action:string,statement:D1PreparedStatement,review?:PromotionReviewRecord){
 const writes=[statement];
 if(review)writes.push(env.DB.prepare(`INSERT INTO promotion_reviews(id,candidate_id,candidate_revision,record,created_at) SELECT ?,?,?,?,? WHERE changes()=1`).bind(review.id,id,revision,JSON.stringify(review),now()));
 writes.push(env.DB.prepare(`INSERT INTO promotion_operations(actor_id,request_id,fingerprint,candidate_id,result_revision,action,created_at) SELECT ?,?,?,?,?,?,? WHERE changes()=1`).bind(a.id,requestId,fingerprint,id,revision,action,now()));
 const results=await env.DB.batch(writes);
 if(results[0].meta.changes!==1)throw new NotCommitted();
}
export async function handlePromotionReview(req:Request,env:PromotionEnv):Promise<Response>{
 try{return await route(req,env);}catch(e){if(e instanceof PromotionError)return reply({error:e.message},e.status);console.error('Promotion request failed',e instanceof Error?e.name:'unknown');return reply({error:'Promotion review is temporarily unavailable. Retry with the same request identity.'},500);}
}
async function route(req:Request,env:PromotionEnv):Promise<Response>{
 const a=await actor(req,env),url=new URL(req.url),path=url.pathname.replace(/\/+$/,'').slice('/admin/promotions'.length),method=req.method;
 if(method!=='GET'&&req.headers.get('Origin')!==env.APP_ORIGIN)fail(403,'Bad origin.');
 if(method==='GET'&&path==='/session'){const sessionKey=await studioHash('promotions-ui-session:'+a.tokenHash);await recheck(env,a);return reply({userId:a.id,sessionKey});}
 if(method==='GET'&&path==='/sources'){
  const cursor=url.searchParams.get('cursor')??'';if(cursor&&!validId(cursor))fail(400,'Invalid cursor.');
  const rows=await env.DB.prepare(`SELECT c.id AS communityId,c.title,c.version AS publishedVersion FROM courses c JOIN users owner ON owner.id=c.owner_id WHERE c.id>? AND c.status='published' AND c.version>0 AND c.reviewed_version=c.version AND c.reviewed_at IS NOT NULL AND c.reviewed_by IS NOT NULL AND c.reviewed_by!='' AND c.published_at IS NOT NULL AND owner.banned=0 AND owner.accepted_at IS NOT NULL AND owner.accepted_at!='' AND owner.terms_version>=2 AND EXISTS (${actorSQL}) ORDER BY c.id LIMIT 26`).bind(cursor,...args(a)).all<{communityId:string;title:string;publishedVersion:number}>();
  await recheck(env,a);return reply({sources:rows.results.slice(0,25),nextCursor:rows.results.length>25?rows.results[24].communityId:null});
 }
 let match=path.match(/^\/sources\/([A-Za-z0-9_-]+)$/);
 if(method==='GET'&&match){const raw=url.searchParams.get('version');if(!validId(match[1])||!raw||!/^\d{1,12}$/.test(raw)||!validRevision(Number(raw)))fail(400,'Choose an exact published version.');const loaded=await loadSource(env,a,match[1],Number(raw));await recheck(env,a,loaded.guard);return reply({source:loaded.source,candidate:loaded.candidate,digest:loaded.digest});}
 if(method==='GET'&&path==='/candidates'){
  const cursor=url.searchParams.get('cursor')??'';if(cursor&&!validId(cursor))fail(400,'Invalid cursor.');
  const rows=await env.DB.prepare(`SELECT id,title,revision,state,updated_at AS updatedAt FROM promotion_candidates WHERE id>? AND EXISTS (${actorSQL}) ORDER BY id LIMIT 26`).bind(cursor,...args(a)).all<{id:string}>();
  await recheck(env,a);return reply({candidates:rows.results.slice(0,25),nextCursor:rows.results.length>25?rows.results[24].id:null});
 }
 match=path.match(/^\/candidates\/([A-Za-z0-9_-]+)(?:\/(review|reject|revoke|export))?$/);
 if(method==='GET'&&match){
  const row=await candidateRow(env,a,match[1]);if(!match[2])return reply(await envelope(env,a,row));if(match[2]!=='export')fail(405,'Method not allowed.');
  if(row.state!=='reviewed'||!row.review)fail(409,'A current human review is required before handoff.');
  const candidate=await storedCandidate(env,row);const history=await decisionHistory(env,a,row,candidate);await currentSource(env,a,row);
  const handoff=await createPromotionHandoff(candidate,JSON.parse(row.review!),{communityImageOrigin:env.API_ORIGIN});
  await finalGuard(env,a,row,history.rows,true,true);return reply(handoff);
 }
 const create=method==='POST'&&path==='/candidates';
 if(!create&&!(method==='POST'&&match&&['review','reject','revoke'].includes(match[2])))fail(404,'Not found.');
 const input=await body(req);keys(input,create?['requestId','communityId','publishedVersion','sourceDigest','digest']:['requestId','expectedRevision','digest','review']);
 if(!validId(input.requestId)||!validDigest(input.digest))fail(400,'A stable request identity and exact candidate digest are required.');
 const requestId=input.requestId as string,fingerprint=await promotionDigest({method,path,input});
 const prior=await replay(env,a,requestId,fingerprint);if(prior)return prior;
 const operationAbsent=`NOT EXISTS (SELECT 1 FROM promotion_operations WHERE actor_id=? AND request_id=?)`;
 let id:string;
 if(create){
  if(!validId(input.communityId)||!validRevision(input.publishedVersion)||!validDigest(input.sourceDigest))fail(400,'An exact reviewed source and digest are required.');
  const loaded=await loadSource(env,a,input.communityId as string,input.publishedVersion as number);
  if(loaded.source.packageSha256!==input.sourceDigest||loaded.digest!==input.digest)fail(409,'The source or embedded media changed. Inspect a fresh candidate before saving.');
  const quota=await env.DB.prepare(`SELECT COUNT(*) AS n FROM promotion_candidates WHERE created_by=? AND EXISTS (${actorSQL})`).bind(a.id,...args(a)).first<{n:number}>();
  if(!quota||quota.n>=MAX_CANDIDATES_PER_ACTOR)fail(409,'The private candidate retention limit has been reached. Contact an administrator.');
  await recheck(env,a,loaded.guard);
  id=crypto.randomUUID();const key=`promotion-candidates/${id}.json`,created=now();
  const written=await env.FILES.put(key,JSON.stringify(loaded.candidate),{onlyIf:new Headers({'If-None-Match':'*'}),httpMetadata:{contentType:'application/json'}});
  if(!written)fail(409,'Private candidate storage conflicted. Retry the same request.');
  // The random write-once object is private and carries no authority until this
  // atomic metadata+journal transaction commits. Uncertain commits are not deleted.
  try{await journal(env,a,requestId,fingerprint,id,1,'prepare',env.DB.prepare(`INSERT INTO promotion_candidates(id,title,source,source_guard,object_key,digest,revision,state,review,created_by,created_at,updated_at)
 SELECT ?,?,?,?,?,?,1,'prepared',NULL,?,?,? WHERE EXISTS (${actorSQL}) AND EXISTS (${sourceSQL}) AND (SELECT COUNT(*) FROM promotion_candidates WHERE created_by=?)<? AND ${operationAbsent}`).bind(id,loaded.source.title,JSON.stringify(loaded.source),JSON.stringify(loaded.guard),key,loaded.digest,a.id,created,created,...args(a),...sourceArgs(loaded.guard),a.id,MAX_CANDIDATES_PER_ACTOR,a.id,requestId));}
  catch(e){if(e instanceof NotCommitted){try{await env.FILES.delete(key);}catch{/* Private orphan only; no metadata or authority. */}}throw e;}
 }else{
  id=match![1];const action=match![2],row=await candidateRow(env,a,id);
  if(!validRevision(input.expectedRevision)||input.expectedRevision!==row.revision||input.digest!==row.digest)fail(409,'The candidate changed. Reload before reviewing.');
  if((action==='revoke'&&row.state!=='reviewed')||(action!=='revoke'&&row.state!=='prepared'))fail(409,'That transition is not available for this candidate.');
  const candidate=await storedCandidate(env,row);const history=await decisionHistory(env,a,row,candidate);let reviewInput:ReturnType<typeof parsePromotionReviewInput>;
  try{reviewInput=parsePromotionReviewInput(input.review);}catch(e){return fail(400,(e as Error).message);}
  if(reviewInput!.decision!==({review:'approved-for-handoff',reject:'rejected',revoke:'revoked'} as Record<string,string>)[action])fail(400,'Review decision does not match the requested action.');
  if(action==='review')await currentSource(env,a,row);
  const revision=row.revision+1,updated=now();let review:PromotionReviewRecord;
  try{review=await createPromotionReview(candidate,reviewInput!,{id:crypto.randomUUID(),revision,reviewer:a.id,reviewedAt:updated},{communityImageOrigin:env.API_ORIGIN});}catch(e){return fail(400,(e as Error).message);}
  const state:State=action==='review'?'reviewed':action==='reject'?'rejected':'revoked';
  await journal(env,a,requestId,fingerprint,id,revision,action,env.DB.prepare(`UPDATE promotion_candidates SET revision=?,state=?,review=?,updated_at=? WHERE id=? AND revision=? AND digest=? AND state=? AND review IS ? AND source_guard=? AND object_key=? AND source=? AND EXISTS (${actorSQL}) AND ${historySQL} ${action==='review'?`AND EXISTS (${sourceSQL})`:''} AND ${operationAbsent}`).bind(revision,state,JSON.stringify(review!),updated,id,row.revision,row.digest,row.state,row.review,row.source_guard,row.object_key,row.source,...args(a),...historyArgs(history.rows),...(action==='review'?sourceArgs(JSON.parse(row.source_guard)):[]),a.id,requestId),review!);
 }
 return reply(await envelope(env,a,await candidateRow(env,a,id)),create?201:200);
}
