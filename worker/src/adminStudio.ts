import { parseStudioDocument, studioDigest, studioProblems, studioLearnerView, studioResources, type StudioDocument, type StudioInventory, type StudioApproval, STUDIO_LIMITS } from '../../src/lib/adminStudio';
import { checkDoc, type CommunityDoc, LIMITS } from '../../src/lib/communityFormat';
import { courseFromCanonicalAuthoring } from '../../src/lib/canonicalAuthoring';
import { officialStudioSources, type OfficialStudioManifest } from './studioOfficialSources';

export interface StudioEnv { DB:D1Database; FILES:R2Bucket; APP_ORIGIN:string; API_ORIGIN:string; }
class StudioError extends Error { constructor(public status:number,message:string){super(message);} }
const fail=(status:number,message:string):never=>{throw new StudioError(status,message);};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const idOK=(x:unknown):x is string=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(x);
const now=()=>new Date().toISOString();
export async function studioHash(text:string):Promise<string>{return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
interface Actor { id:string; tokenHash:string; }
interface SourceGuard { community_id:string; canonical_id:string; revision:number; digest:string; version:number; reviewed_at:string; published_at:string; }
interface SourceRow { id:string; title:string; version:number; reviewed_at:string; published_at:string; }
interface MaterialRow { id:string; document:string; revision:number; title:string; kind:string; digest:string; created_by:string; updated_at:string; approval:string|null; deleted_at:string|null; }
// These predicates execute in the same SQLite statement as data access/mutation.
const actorSQL=`SELECT 1 FROM users a JOIN sessions s ON s.user_id=a.id WHERE a.id=? AND a.role='admin' AND a.banned=0 AND a.accepted_at IS NOT NULL AND a.accepted_at!='' AND a.terms_version>=2 AND s.token_hash=? AND s.expires_at>strftime('%Y-%m-%dT%H:%M:%fZ','now')`;
const sourcesSQL=`NOT EXISTS (SELECT 1 FROM json_each(?) wanted WHERE NOT EXISTS (
 SELECT 1 FROM courses c JOIN users owner ON owner.id=c.owner_id WHERE c.id=json_extract(wanted.value,'$.community_id')
 AND c.status='published' AND c.version=json_extract(wanted.value,'$.version') AND c.reviewed_version=c.version
 AND c.reviewed_at=json_extract(wanted.value,'$.reviewed_at') AND c.published_at=json_extract(wanted.value,'$.published_at') AND owner.banned=0))`;
const actorArgs=(a:Actor)=>[a.id,a.tokenHash];
async function actor(req:Request,env:StudioEnv):Promise<Actor>{
 let token='';try {for(const part of (req.headers.get('Cookie')??'').split(';')) {const i=part.indexOf('=');if(part.slice(0,i).trim()==='erudior_session')token=decodeURIComponent(part.slice(i+1));}}catch{fail(401,'Sign in first.');}
 if(!token||token.length>1000)fail(401,'Sign in first.');
 const tokenHash=await studioHash(token);
 const found=await env.DB.prepare(`SELECT a.id FROM sessions s JOIN users a ON a.id=s.user_id WHERE s.token_hash=? AND s.expires_at>strftime('%Y-%m-%dT%H:%M:%fZ','now') AND a.banned=0 AND a.role='admin' AND a.accepted_at IS NOT NULL AND a.accepted_at!='' AND a.terms_version>=2`).bind(tokenHash).first<{id:string}>();
 if(!found)fail(403,'Current administrator access and accepted terms are required.');
 return {id:found!.id,tokenHash};
}
async function recheck(env:StudioEnv,a:Actor,guards:SourceGuard[]=[]):Promise<void>{
 const ok=await env.DB.prepare(`SELECT 1 AS ok WHERE EXISTS (${actorSQL}) AND ${sourcesSQL}`).bind(...actorArgs(a),JSON.stringify(guards)).first();
 if(!ok)fail(409,'Your administrator session or source review changed. Reload before continuing.');
}
async function readBody(req:Request):Promise<{body:Record<string,unknown>;raw:string}>{
 if(!req.headers.get('Content-Type')?.toLowerCase().startsWith('application/json'))fail(415,'JSON is required.');
 const reader=req.body?.getReader();if(!reader)fail(400,'A JSON body is required.');
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader!.read();if(done)break;size+=value.byteLength;if(size>STUDIO_LIMITS.bytes+4096){await reader!.cancel();fail(413,'Material exceeds the request limit.');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 let raw:string;let body:unknown;try{raw=new TextDecoder('utf-8',{fatal:true,ignoreBOM:false}).decode(bytes);body=JSON.parse(raw);}catch{fail(400,'Invalid JSON.');}
 if(!body||typeof body!=='object'||Array.isArray(body))fail(400,'Invalid request.');
 return {body:body as Record<string,unknown>,raw:raw!};
}
function keys(body:Record<string,unknown>,allowed:string[]){if(Object.keys(body).some(k=>!allowed.includes(k)))fail(400,'Unsupported request fields.');}
function parse(input:unknown):StudioDocument{try{return parseStudioDocument(input);}catch(e){return fail(400,(e as Error).message);}}
async function sourceRow(env:StudioEnv,a:Actor,id:string):Promise<SourceRow>{
 const row=await env.DB.prepare(`SELECT c.id,c.title,c.version,c.reviewed_at,c.published_at FROM courses c JOIN users owner ON owner.id=c.owner_id WHERE c.id=? AND c.status='published' AND c.version>0 AND c.reviewed_version=c.version AND c.reviewed_at IS NOT NULL AND c.published_at IS NOT NULL AND owner.banned=0 AND EXISTS (${actorSQL})`).bind(id,...actorArgs(a)).first<SourceRow>();
 if(!row)fail(409,'That reviewed source is no longer available.');return row!;
}
async function loadSource(env:StudioEnv,a:Actor,id:string):Promise<{inventory:StudioInventory;guard:SourceGuard}>{
 const row=await sourceRow(env,a,id);
 const object=await env.FILES.get(`courses/${row.id}.v${row.version}.json`);
 if(!object||object.size>LIMITS.docBytes)fail(409,'Source package is unavailable or too large.');
 const text=await object!.text();if(new TextEncoder().encode(text).length>LIMITS.docBytes)fail(409,'Source package is too large.');
 let doc:CommunityDoc;try{doc=JSON.parse(text);}catch{return fail(409,'Source package is invalid.');}
 if(!doc!.canonical||checkDoc(doc!,true,{communityImageOrigin:env.API_ORIGIN}).length)fail(409,'Studio requires a valid reviewed canonical course.');
 const course=courseFromCanonicalAuthoring(doc!.canonical!,{strict:true,maxBytes:LIMITS.docBytes,communityImageOrigin:env.API_ORIGIN});
 const digest=await studioHash(text);
 const source={courseId:course.id,revision:course.revision??0,digest};
 if(!idOK(source.courseId)||!Number.isSafeInteger(source.revision)||source.revision<1)fail(409,'Source must have a stable canonical identity and revision.');
 const guard:SourceGuard={community_id:row.id,canonical_id:source.courseId,revision:source.revision,digest,version:row.version,reviewed_at:row.reviewed_at,published_at:row.published_at};
 await recheck(env,a,[guard]);return {inventory:{source,course},guard};
}
async function registerSource(env:StudioEnv,a:Actor,guard:SourceGuard):Promise<void>{
 const result=await env.DB.prepare(`INSERT INTO studio_sources(community_id,canonical_id,revision,digest,version,reviewed_at,published_at)
 SELECT ?,?,?,?,?,?,? WHERE EXISTS (${actorSQL}) AND ${sourcesSQL}
 ON CONFLICT(community_id) DO UPDATE SET canonical_id=excluded.canonical_id,revision=excluded.revision,digest=excluded.digest,version=excluded.version,reviewed_at=excluded.reviewed_at,published_at=excluded.published_at`).bind(guard.community_id,guard.canonical_id,guard.revision,guard.digest,guard.version,guard.reviewed_at,guard.published_at,...actorArgs(a),JSON.stringify([guard])).run();
 if(result.meta.changes!==1)fail(409,'Source or administrator access changed.');
}
interface ResolvedSources { inventory:StudioInventory[]; guards:SourceGuard[]; official?:OfficialStudioManifest; }
async function officialCall<T>(action:()=>Promise<T>):Promise<T>{try{return await action();}catch(e){return fail(409,(e as Error).message||'Official source is unavailable.');}}
async function recheckResolved(env:StudioEnv,a:Actor,resolved:ResolvedSources){
 if(resolved.official)await officialCall(()=>officialStudioSources.assertCurrent(resolved.official!));
 await recheck(env,a,resolved.guards);
}
async function resolveSources(env:StudioEnv,a:Actor,doc:StudioDocument):Promise<ResolvedSources>{
 const selected=[...new Map(doc.resources.map(r=>[`${r.source.courseId}@${r.source.revision}:${r.source.digest}`,r.source])).values()];
 if(selected.length>10)fail(400,'Use at most ten source courses per material.');
 const result:ResolvedSources={inventory:[],guards:[]};
 for(const source of selected){
  const rows=await env.DB.prepare(`SELECT community_id FROM studio_sources WHERE canonical_id=? AND revision=? AND digest=? AND EXISTS (${actorSQL}) LIMIT 2`).bind(source.courseId,source.revision,source.digest,...actorArgs(a)).all<{community_id:string}>();
  const knownOfficial=await env.DB.prepare(`SELECT 1 AS known FROM studio_official_sources WHERE canonical_id=? AND revision=? AND digest=? AND EXISTS (${actorSQL})`).bind(source.courseId,source.revision,source.digest,...actorArgs(a)).first();
  if(rows.results.length+(knownOfficial?1:0)!==1)fail(409,'A source is unavailable or ambiguous. Open its source library entry again.');
  if(knownOfficial){
   result.official??=await officialCall(()=>officialStudioSources.manifest());
   const item=await officialCall(()=>officialStudioSources.load(result.official!,source.courseId));
   if(JSON.stringify(item.source)!==JSON.stringify(source))fail(409,'An official source changed. Choose its current version.');
   result.inventory.push(item);
  }else{
   const loaded=await loadSource(env,a,rows.results[0].community_id);
   if(JSON.stringify(loaded.inventory.source)!==JSON.stringify(source))fail(409,'A selected source changed. Choose its current version.');
   result.inventory.push(loaded.inventory);result.guards.push(loaded.guard);
  }
 }
 return result;
}
async function materialRow(env:StudioEnv,a:Actor,id:string,archived=false):Promise<MaterialRow>{
 const row=await env.DB.prepare(`SELECT * FROM studio_materials WHERE id=? ${archived?'':'AND deleted_at IS NULL'} AND EXISTS (${actorSQL})`).bind(id,...actorArgs(a)).first<MaterialRow>();
 if(!row)fail(404,'Material not found or access changed.');return row!;
}
async function envelope(env:StudioEnv,a:Actor,row:MaterialRow){
 const document=parse(row.document);let problems:string[]=[];let resolved:ResolvedSources|undefined;
 try{resolved=await resolveSources(env,a,document);problems=studioProblems(document,resolved.inventory);}catch(e){if(e instanceof StudioError&&e.status===409)problems=[e.message];else throw e;}
 // Draft recovery remains available for invalidated sources, but authority never does.
 if(!problems.length&&resolved)await recheckResolved(env,a,resolved);else await recheck(env,a);
 const current=await env.DB.prepare(`SELECT id FROM studio_materials WHERE id=? AND revision=? AND digest=? AND approval IS ? AND deleted_at IS ? AND EXISTS (${actorSQL}) AND ${sourcesSQL}`).bind(row.id,row.revision,row.digest,row.approval,row.deleted_at,...actorArgs(a),JSON.stringify(!problems.length&&resolved?resolved.guards:[])).first();
 if(!current)fail(409,'Material changed while it was loading. Reload the saved revision.');
 const approval:StudioApproval|null=row.approval?JSON.parse(row.approval):null;
 return {document,approval:approval&&approval.digest===row.digest&&approval.revision===row.revision&&!problems.length?approval:null,problems,archived:!!row.deleted_at,updated:row.updated_at};
}
async function replay(env:StudioEnv,a:Actor,requestId:string,fingerprint:string):Promise<Response|null>{
 const op=await env.DB.prepare(`SELECT material_id,result_revision,fingerprint,action FROM studio_operations WHERE actor_id=? AND request_id=? AND EXISTS (${actorSQL})`).bind(a.id,requestId,...actorArgs(a)).first<{material_id:string;result_revision:number;fingerprint:string;action:string}>();
 if(!op)return null;if(op.fingerprint!==fingerprint)fail(409,'Request identity was already used for different content.');
 const row=await materialRow(env,a,op.material_id,true);
 if(row.revision!==op.result_revision)fail(409,'This request completed, but the material changed afterward. Reload the saved material.');
 if(op.action==='archive'){await recheck(env,a);return reply({deleted:true,id:row.id,revision:row.revision});}
 return reply(await envelope(env,a,row));
}
async function journal(env:StudioEnv,a:Actor,requestId:string,fingerprint:string,id:string,revision:number,action:string,statement:D1PreparedStatement){
 const results=await env.DB.batch([statement,env.DB.prepare(`INSERT INTO studio_operations(actor_id,request_id,fingerprint,material_id,result_revision,action,created_at) SELECT ?,?,?,?,?,?,? WHERE changes()=1`).bind(a.id,requestId,fingerprint,id,revision,action,now())]);
 if(results[0].meta.changes!==1)fail(409,'Material, source or administrator access changed. Reload before saving.');
}

export async function handleAdminStudio(req:Request,env:StudioEnv):Promise<Response>{
 try{return await routeStudio(req,env);}catch(e){if(e instanceof StudioError)return reply({error:e.message},e.status);console.error('Studio request failed',e instanceof Error?e.name:'unknown');return reply({error:'Studio is temporarily unavailable. Retry with the same request identity.'},500);}
}
async function routeStudio(req:Request,env:StudioEnv):Promise<Response>{
 const a=await actor(req,env), url=new URL(req.url), path=url.pathname.replace(/\/+$/,'').slice('/admin/studio'.length), method=req.method;
 if(method!=='GET'&&req.headers.get('Origin')!==env.APP_ORIGIN)fail(403,'Bad origin.');
 if(method==='GET'&&path==='/session'){const sessionKey=await studioHash('studio-ui-session:'+a.tokenHash);await recheck(env,a);return reply({userId:a.id,sessionKey});}
 if(method==='GET'&&path==='/sources'){
  const cursor=url.searchParams.get('cursor')??'0';if(!/^\d{1,4}$/.test(cursor))fail(400,'Invalid cursor.');
  const rows=await env.DB.prepare(`SELECT c.id,c.title,c.version FROM courses c JOIN users owner ON owner.id=c.owner_id WHERE c.status='published' AND c.version>0 AND c.reviewed_version=c.version AND c.reviewed_at IS NOT NULL AND owner.banned=0 AND EXISTS (${actorSQL}) ORDER BY c.id LIMIT 1001`).bind(...actorArgs(a)).all<{id:string;title:string;version:number}>();
  if(rows.results.length>1000)fail(409,'The source catalog exceeds its supported limit.');
  let official:OfficialStudioManifest|undefined;let warning:string|null=null;
  try{official=await officialStudioSources.manifest();}catch{warning='Official course catalog unavailable. Reviewed community sources remain available.';}
  const sources=[...(official?.entries??[]).map(e=>({id:`official:${e.id}`,title:e.title,version:e.revision,sourceType:'official'})),...rows.results.map(e=>({...e,id:`community:${e.id}`,sourceType:'community'}))];
  await recheck(env,a);const offset=Number(cursor);return reply({sources:sources.slice(offset,offset+25),nextCursor:offset+25<sources.length?String(offset+25):null,warning,scope:'Verified official courses and currently reviewed canonical community courses. Unsupported source packages cannot be selected.'});
 }
 let match=path.match(/^\/sources\/([^/]+)$/);
 if(method==='GET'&&match){
  let selected:string;try{selected=decodeURIComponent(match[1]);}catch{return fail(400,'Invalid source identity.');}
  if(selected.startsWith('official:')){
   const id=selected.slice(9);if(!idOK(id))fail(400,'Invalid source identity.');
   const manifest=await officialCall(()=>officialStudioSources.manifest());const inventory=await officialCall(()=>officialStudioSources.load(manifest,id));
   await officialCall(()=>officialStudioSources.assertCurrent(manifest));
   const inserted=await env.DB.prepare(`INSERT INTO studio_official_sources(canonical_id,revision,digest) SELECT ?,?,? WHERE EXISTS (${actorSQL}) ON CONFLICT(canonical_id,revision,digest) DO UPDATE SET digest=excluded.digest`).bind(inventory.source.courseId,inventory.source.revision,inventory.source.digest,...actorArgs(a)).run();
   if(inserted.meta.changes!==1)fail(409,'Administrator access changed.');await recheck(env,a);
   return reply({inventory,exclusions:studioResources([inventory]).excluded});
  }
  const id=selected.startsWith('community:')?selected.slice(10):selected;if(!idOK(id))fail(400,'Invalid source identity.');
  const loaded=await loadSource(env,a,id);await registerSource(env,a,loaded.guard);await recheck(env,a,[loaded.guard]);return reply({inventory:loaded.inventory,exclusions:studioResources([loaded.inventory]).excluded});
 }
 if(method==='GET'&&path==='/materials'){
  const cursor=url.searchParams.get('cursor')??'';if(cursor&&!idOK(cursor))fail(400,'Invalid cursor.');const archived=url.searchParams.get('archived')==='1';
  const rows=await env.DB.prepare(`SELECT id,title,kind,revision,updated_at,approval FROM studio_materials WHERE id>? AND deleted_at IS ${archived?'NOT ':''}NULL AND EXISTS (${actorSQL}) ORDER BY id LIMIT 26`).bind(cursor,...actorArgs(a)).all<MaterialRow>();await recheck(env,a);
  return reply({materials:rows.results.slice(0,25).map(r=>({id:r.id,title:r.title,kind:r.kind,revision:r.revision,approved:false,reviewRecorded:!!r.approval,updated:r.updated_at})),nextCursor:rows.results.length>25?rows.results[24].id:null});
 }
 match=path.match(/^\/materials\/([\w-]+)(?:\/(approve|present|export|restore))?$/);
 if(method==='GET'&&match){const row=await materialRow(env,a,match[1]);const result=await envelope(env,a,row);
  if(!match[2])return reply(result);
  if(!['present','export'].includes(match[2]))fail(405,'Method not allowed.');
  const audience=url.searchParams.get('audience');if(audience!=='teacher'&&audience!=='learner')fail(400,'Choose teacher or learner output.');
  if(match[2]==='export'&&audience==='teacher'){await recheck(env,a);return reply({document:result.document});}
  if(!result.approval||result.problems.length)fail(409,'Review and approve the current saved material before delivery.');
  const resolved=await resolveSources(env,a,result.document);if(studioProblems(result.document,resolved.inventory).length)fail(409,'Sources changed.');
  await recheckResolved(env,a,resolved);
  // Final statement also binds the exact persisted revision/digest/approval after source awaits.
  const current=await env.DB.prepare(`SELECT id FROM studio_materials WHERE id=? AND revision=? AND digest=? AND approval=? AND deleted_at IS NULL AND EXISTS (${actorSQL}) AND ${sourcesSQL}`).bind(row.id,row.revision,row.digest,row.approval,...actorArgs(a),JSON.stringify(resolved.guards)).first();
  if(!current)fail(409,'Approval, source or access changed before delivery.');
  return reply(audience==='learner'?{view:studioLearnerView(result.document)}:{document:result.document});
 }
 const create=path==='/materials'&&method==='POST';
 if(!create&&!match)fail(404,'Studio route not found.');
 if(!create&&!((method==='PUT'||method==='DELETE')&&!match![2]||method==='POST'&&['approve','restore'].includes(match![2])))fail(405,'Method not allowed.');
 const {body,raw}=await readBody(req);keys(body,create?['requestId','document']:method==='PUT'?['requestId','expectedRevision','document']:match![2]==='approve'?['requestId','expectedRevision','digest']:['requestId','expectedRevision']);
 if(!idOK(body.requestId)||body.requestId.length<12)fail(400,'A stable request identity is required.');
 const requestId=body.requestId as string,fingerprint=await studioHash(`${method}:${path}:${raw}`);
 const previous=await replay(env,a,requestId,fingerprint);if(previous)return previous;
 const old=create?null:await materialRow(env,a,match![1],match![2]==='restore');
 if(old&&(!Number.isSafeInteger(body.expectedRevision)||body.expectedRevision!==old.revision))fail(409,'A newer saved revision exists. Reload or save a separate copy.');
 const id=create?crypto.randomUUID():old!.id,revision=create?1:old!.revision+1;
 const operationAbsent=`NOT EXISTS (SELECT 1 FROM studio_operations WHERE actor_id=? AND request_id=?)`;
 if(create||method==='PUT'){
  const incoming=parse(body.document);
  if(!create&&(incoming.id!==old!.id||incoming.revision!==old!.revision))fail(409,'Material identity or revision does not match.');
  const document={...incoming,id,revision};const resolved=await resolveSources(env,a,document);const problems=studioProblems(document,resolved.inventory);if(document.resources.length&&problems.length)fail(409,problems.join(' '));
  const digest=await studioDigest(document),updated=now();
  await recheckResolved(env,a,resolved);
  const statement=create?env.DB.prepare(`INSERT INTO studio_materials(id,document,revision,title,kind,digest,created_by,updated_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (${actorSQL}) AND ${sourcesSQL} AND ${operationAbsent} AND (SELECT COUNT(*) FROM studio_materials WHERE created_by=?)<200`).bind(id,JSON.stringify(document),revision,document.title,document.kind,digest,a.id,updated,...actorArgs(a),JSON.stringify(resolved.guards),a.id,requestId,a.id):
   env.DB.prepare(`UPDATE studio_materials SET document=?,revision=?,title=?,kind=?,digest=?,approval=NULL,updated_at=? WHERE id=? AND revision=? AND deleted_at IS NULL AND EXISTS (${actorSQL}) AND ${sourcesSQL} AND ${operationAbsent}`).bind(JSON.stringify(document),revision,document.title,document.kind,digest,updated,id,old!.revision,...actorArgs(a),JSON.stringify(resolved.guards),a.id,requestId);
  await journal(env,a,requestId,fingerprint,id,revision,create?'create':'save',statement);
 }else if(match![2]==='approve'){
  const document=parse(old!.document);const resolved=await resolveSources(env,a,document);const problems=studioProblems(document,resolved.inventory);if(problems.length)fail(409,problems.join(' '));
  const digest=await studioDigest(document);if(body.digest!==digest||digest!==old!.digest)fail(409,'Review must refer to the exact saved content digest.');
  const approval:StudioApproval={revision:old!.revision,digest,reviewedBy:a.id,reviewedAt:now()};
  await recheckResolved(env,a,resolved);
  await journal(env,a,requestId,fingerprint,id,old!.revision,'approve',env.DB.prepare(`UPDATE studio_materials SET approval=?,updated_at=? WHERE id=? AND revision=? AND digest=? AND deleted_at IS NULL AND EXISTS (${actorSQL}) AND ${sourcesSQL} AND ${operationAbsent}`).bind(JSON.stringify(approval),now(),id,old!.revision,digest,...actorArgs(a),JSON.stringify(resolved.guards),a.id,requestId));
 }else{
  const restore=match![2]==='restore';if(restore&&!old!.deleted_at)fail(409,'Material is already active.');
  const document={...parse(old!.document),revision},digest=await studioDigest(document);
  await journal(env,a,requestId,fingerprint,id,revision,restore?'restore':'archive',env.DB.prepare(`UPDATE studio_materials SET document=?,revision=?,digest=?,deleted_at=?,approval=NULL,updated_at=? WHERE id=? AND revision=? AND deleted_at IS ${restore?'NOT ':''}NULL AND EXISTS (${actorSQL}) AND ${operationAbsent}`).bind(JSON.stringify(document),revision,digest,restore?null:now(),now(),id,old!.revision,...actorArgs(a),a.id,requestId));
  if(!restore){await recheck(env,a);return reply({deleted:true,id,revision});}
 }
 return reply(await envelope(env,a,await materialRow(env,a,id)),create?201:200);
}
