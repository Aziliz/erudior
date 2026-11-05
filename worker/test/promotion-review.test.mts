// Deterministic real SQLite transactions with asynchronous R2/crypto boundaries.
// Synthetic accounts and local bytes only: no production data, accounts or signing.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readdirSync,readFileSync } from 'node:fs';
import { handlePromotionReview,type PromotionEnv } from '../src/promotionReview.ts';
import { studioHash } from '../src/adminStudio.ts';
import { emptyCourse } from '../../src/lib/course.ts';
import { canonicalAuthoringFromCourse } from '../../src/lib/canonicalAuthoring.ts';
import { emptyDoc,checkDoc } from '../../src/lib/communityFormat.ts';
import { verifyPromotionHandoff,type PromotionReviewInput } from '../../src/lib/promotionReview.ts';

const db=new DatabaseSync(':memory:');
for(const file of readdirSync(new URL('../migrations/',import.meta.url)).filter(n=>n.endsWith('.sql')).sort())db.exec(readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
const token='synthetic-promotion-session',tokenHash=await studioHash(token),app='https://app.example',api='https://api.example',time='2026-01-01T00:00:00.000Z';
const execute=(sql:string,...values:any[])=>db.prepare(sql).run(...values);
let hook:((sql:string)=>Promise<void>)|null=null,r2Hook:((key:string,action:string)=>Promise<void>)|null=null;
let counter=0,checks=0,lostBatchResponse=false;
let hashHook:((text:string)=>Promise<void>)|null=null;
const originalDigest=crypto.subtle.digest.bind(crypto.subtle);
crypto.subtle.digest=async(algorithm,data)=>{const result=await originalDigest(algorithm,data);if(hashHook)await hashHook(new TextDecoder().decode(data));return result;};
class Statement {
 values:any[]=[];constructor(public sql:string){} bind(...values:any[]){this.values=values;return this;}
 async first(){if(hook)await hook(this.sql);return db.prepare(this.sql).get(...this.values)??null;}
 async all(){if(hook)await hook(this.sql);return {results:db.prepare(this.sql).all(...this.values),success:true};}
 async run(){if(hook)await hook(this.sql);return this.rawRun();}
 rawRun(){return {success:true,meta:{changes:Number(db.prepare(this.sql).run(...this.values).changes)}};}
}
const wrappedDB={prepare:(sql:string)=>new Statement(sql),async batch(statements:Statement[]){
 if(hook)await hook(statements[0].sql);db.exec('BEGIN');try{const result=statements.map(statement=>statement.rawRun());db.exec('COMMIT');if(lostBatchResponse){lostBatchResponse=false;throw Error('Synthetic lost response after durable commit');}return result;}catch(e){try{db.exec('ROLLBACK');}catch{/* already committed */}throw e;}
}};
const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3foAAAAASUVORK5CYII=','base64'));
const objects=new Map<string,{bytes:Uint8Array;mime:string}>();
function object(key:string,text:string,mime='application/json'){objects.set(key,{bytes:new TextEncoder().encode(text),mime});}
const files={async get(key:string){
 if(r2Hook)await r2Hook(key,'get');const found=objects.get(key);if(!found)return null;const bytes=found.bytes.slice();
 return {size:bytes.length,httpMetadata:{contentType:found.mime},body:new ReadableStream({start(controller){controller.enqueue(bytes);controller.close();}}),async arrayBuffer(){if(r2Hook)await r2Hook(key,'arrayBuffer');return bytes.buffer;}};
},async put(key:string,value:string,options:any){
 if(r2Hook)await r2Hook(key,'put');assert.equal(options.onlyIf.get('If-None-Match'),'*');if(objects.has(key))return null;object(key,value,options.httpMetadata.contentType);return {key};
},async delete(key:string){objects.delete(key);}};
const env={DB:wrappedDB,FILES:files,APP_ORIGIN:app,API_ORIGIN:api} as unknown as PromotionEnv;
const course=emptyCourse('Synthetic promotion source');course.id='canonical-source';course.revision=1;
course.lessons=[{id:'lesson',module:'m1',title:'Observe',body:`PRIVATE_SOURCE_TEXT\n\n![Owned diagram](${api}/images/owned-image)`}];
const community={...emptyDoc(),title:course.title,description:'Synthetic source only.',lessons:[],decks:[],canonical:canonicalAuthoringFromCourse(course,{strict:true,communityImageOrigin:api})};
assert.deepEqual(checkDoc(community,true,{communityImageOrigin:api}),[]);
function request(method:string,path:string,value?:unknown,options:{cookie?:boolean;origin?:string;raw?:string|Uint8Array;contentType?:string}={}){
 const supplied=value!==undefined||options.raw!==undefined;
 return handlePromotionReview(new Request(api+'/admin/promotions'+path,{method,headers:{Origin:options.origin??app,...(options.cookie===false?{}:{Cookie:`erudior_session=${token}`}),...(supplied?{'Content-Type':options.contentType??'application/json'}:{})},...(supplied?{body:options.raw??JSON.stringify(value)}:{})}),env);
}
async function ok(response:Response,status=200){const value=await response.json();assert.equal(response.status,status,JSON.stringify(value));assert.equal(response.headers.get('Cache-Control'),'no-store');checks++;return value as any;}
async function denied(response:Response,label='denied'){const text=await response.text();assert([400,401,403,404,405,409,413,415].includes(response.status),`${label}: ${response.status} ${text}`);assert.equal(response.headers.get('Cache-Control'),'no-store');assert(!text.includes('PRIVATE_'),`${label}: private data leaked`);checks++;}
const rid=()=>`request-${++counter}`;
function before(pattern:RegExp,change:()=>unknown|Promise<unknown>){hook=async sql=>{if(pattern.test(sql)){hook=null;await change();}};}
function duringR2(pattern:RegExp,action:string,change:()=>unknown|Promise<unknown>){r2Hook=async(key,event)=>{if(pattern.test(key)&&event===action){r2Hook=null;await change();}};}
async function reset(){
 hook=null;r2Hook=null;hashHook=null;lostBatchResponse=false;objects.clear();for(const table of ['promotion_operations','promotion_reviews','promotion_candidates','course_editors','images','reports','courses','sessions','users'])db.exec(`DELETE FROM ${table}`);
 for(const [id,role] of [['actor','admin'],['owner','author'],['other','author'],['reviewer-admin','admin']])execute('INSERT INTO users(id,provider,provider_id,display_name,role,banned,accepted_at,terms_version,created_at) VALUES(?,?,?,?,?,0,?,2,?)',id,'dev',id,id,role,time,time);
 execute('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)',tokenHash,'actor','2999-01-01T00:00:00.000Z');
 execute("INSERT INTO courses(id,owner_id,draft,status,version,reviewed_version,reviewed_by,reviewed_at,published_at,title,created_at,updated_at) VALUES('community-row','owner',?,'published',1,1,'reviewer-admin',?,?,?,?,?)",JSON.stringify(community),time,time,course.title,time,time);
 execute("INSERT INTO images(id,owner_id,mime,bytes,created_at) VALUES('owned-image','owner','image/png',?,?)",png.length,time);
 object('courses/community-row.v1.json',JSON.stringify(community));objects.set('images/owned-image',{bytes:png.slice(),mime:'image/png'});
 return await ok(await request('GET','/sources/community-row?version=1'));
}
function preparation(preview:any){return {requestId:rid(),communityId:preview.source.communityId,publishedVersion:preview.source.publishedVersion,sourceDigest:preview.source.packageSha256,digest:preview.digest};}
async function prepare(preview:any){return await ok(await request('POST','/candidates',preparation(preview)),201);}
function reviewInput(candidate:any,decision:PromotionReviewInput['decision']='approved-for-handoff'):PromotionReviewInput{
 return {decision,intendedOfficial:{courseId:candidate.candidate.course.id,revision:candidate.candidate.course.revision},checklist:{contentAccuracy:true,accessibility:true,attribution:true,sourceRights:true,mediaRights:true,parityReviewed:true},evidence:[{id:'content',kind:'content',reference:'Synthetic content inspection',text:'Reviewed exact source and embedded candidate parity.'},{id:'rights',kind:'rights',reference:'Synthetic license evidence',text:'Human rights attestation only, no software legal finding.'},{id:'media',kind:'media-rights',reference:'Synthetic media evidence',text:'Human media rights attestation retained.'}],notes:decision==='approved-for-handoff'?'Synthetic review.':'Synthetic withdrawal reason.'};
}
async function approve(saved:any){return await ok(await request('POST',`/candidates/${saved.id}/review`,{requestId:rid(),expectedRevision:saved.revision,digest:saved.digest,review:reviewInput(saved)}));}
try{
 let preview=await reset();
 for(const role of ['author','reviewer']){execute("UPDATE users SET role=? WHERE id='actor'",role);await denied(await request('GET','/sources'),'role '+role);}execute("UPDATE users SET role='admin' WHERE id='actor'");
 for(const path of ['/sources','/session','/candidates','/sources/community-row?version=1'])await denied(await request('GET',path,undefined,{cookie:false}),'anonymous '+path);
 await denied(await request('POST','/candidates',preparation(preview),{origin:'https://evil.example'}),'CSRF');
 await denied(await request('GET','/sources/community-row'),'missing version');await denied(await request('GET','/sources/community-row?version=2'),'wrong version');
 assert.equal((await ok(await request('GET','/sources'))).sources[0].communityId,'community-row');
 const initialRequest=preparation(preview);let saved=await ok(await request('POST','/candidates',initialRequest),201);
 assert.equal(saved.state,'prepared');assert.equal(saved.review,null);assert.deepEqual(saved.history,[]);assert.equal(saved.canExport,false);assert.equal(saved.candidate.provenance.status,'unapproved-candidate');
 assert(saved.candidate.course.lessons[0].body.includes('data:image/png;base64,'));assert.equal(saved.candidate.source.course.lessons[0].body,course.lessons[0].body);
 assert.equal((await ok(await request('POST','/candidates',initialRequest))).id,saved.id);
 assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_candidates').get()!.n,1);
 await denied(await request('POST','/candidates',{...initialRequest,digest:'0'.repeat(64)}),'request identity reuse');
 await denied(await request('GET',`/candidates/${saved.id}/export`),'unreviewed export');
 await denied(await request('POST',`/candidates/${saved.id}/review`,{requestId:rid(),expectedRevision:1,digest:saved.digest,review:{...reviewInput(saved),checklist:{...reviewInput(saved).checklist,sourceRights:false}}}),'missing rights');
 const reviewRequest={requestId:rid(),expectedRevision:1,digest:saved.digest,review:reviewInput(saved)};
 saved=await ok(await request('POST',`/candidates/${saved.id}/review`,reviewRequest));assert.equal(saved.revision,2);assert.equal(saved.state,'reviewed');assert.equal(saved.canExport,true);
 assert.equal((await ok(await request('POST',`/candidates/${saved.id}/review`,reviewRequest))).revision,2);
 const handoff=await ok(await request('GET',`/candidates/${saved.id}/export`));assert.equal(handoff.status,'reviewed-not-authorized');await verifyPromotionHandoff(handoff,{communityImageOrigin:api,expectedHandoffSha256:handoff.handoffSha256});
 assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_reviews').get()!.n,1);
 await denied(await request('POST',`/candidates/${saved.id}/revoke`,{requestId:rid(),expectedRevision:1,digest:saved.digest,review:reviewInput(saved,'revoked')}),'stale revision');
 const revoke={requestId:rid(),expectedRevision:2,digest:saved.digest,review:reviewInput(saved,'revoked')};saved=await ok(await request('POST',`/candidates/${saved.id}/revoke`,revoke));assert.equal(saved.revision,3);assert.equal(saved.canExport,false);assert.equal(saved.state,'revoked');assert.equal(saved.history.length,2);assert.equal(saved.history[0].decision,'approved-for-handoff');assert.equal(saved.history[1].decision,'revoked');assert.deepEqual(saved.history[0].evidence,reviewRequest.review.evidence);
 await ok(await request('POST',`/candidates/${saved.id}/revoke`,revoke));assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_reviews').get()!.n,2);
 await denied(await request('GET',`/candidates/${saved.id}/export`),'revoked export');await denied(await request('POST',`/candidates/${saved.id}/review`,{requestId:rid(),expectedRevision:3,digest:saved.digest,review:reviewInput(saved)}),'terminal revoke');
 await denied(await request('POST','/candidates',initialRequest),'old preparation replay cannot revive');
 preview=await reset();saved=await prepare(preview);saved=await ok(await request('POST',`/candidates/${saved.id}/reject`,{requestId:rid(),expectedRevision:1,digest:saved.digest,review:reviewInput(saved,'rejected')}));assert.equal(saved.state,'rejected');await denied(await request('GET',`/candidates/${saved.id}/export`));
 const actorChanges:[string,()=>unknown][]=[['session deleted',()=>execute('DELETE FROM sessions')],['session expired',()=>execute("UPDATE sessions SET expires_at='2000-01-01T00:00:00.000Z'")],['role removed',()=>execute("UPDATE users SET role='author' WHERE id='actor'")],['actor banned',()=>execute("UPDATE users SET banned=1 WHERE id='actor'")],['terms revoked',()=>execute("UPDATE users SET terms_version=0 WHERE id='actor'")],['acceptance revoked',()=>execute("UPDATE users SET accepted_at=NULL WHERE id='actor'")]];
 for(const [label,change] of actorChanges){
  preview=await reset();duringR2(/^courses\//,'get',change);await denied(await request('GET','/sources/community-row?version=1'),'source '+label);
  preview=await reset();before(/INSERT INTO promotion_candidates/,change);await denied(await request('POST','/candidates',preparation(preview)),'prepare commit '+label);assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_candidates').get()!.n,0);assert.equal([...objects.keys()].filter(key=>key.startsWith('promotion-candidates/')).length,0);
  preview=await reset();saved=await prepare(preview);before(/UPDATE promotion_candidates SET/,change);await denied(await request('POST',`/candidates/${saved.id}/review`,{requestId:rid(),expectedRevision:1,digest:saved.digest,review:reviewInput(saved)}),'review commit '+label);assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_reviews').get()!.n,0);
  preview=await reset();saved=await approve(await prepare(preview));duringR2(/^promotion-candidates\//,'get',change);await denied(await request('GET',`/candidates/${saved.id}`),'private recovery '+label);
  preview=await reset();saved=await approve(await prepare(preview));before(/SELECT CASE WHEN EXISTS/,change);await denied(await request('GET',`/candidates/${saved.id}/export`),'export '+label);
 }
 const sourceChanges:[string,()=>unknown][]=[['withdrawn',()=>execute("UPDATE courses SET status='unpublished'")],['review removed',()=>execute('UPDATE courses SET reviewed_version=0')],['version advanced',()=>execute('UPDATE courses SET version=2')],['review replaced',()=>execute("UPDATE courses SET reviewed_at='2027-01-01T00:00:00.000Z'")],['reviewer replaced',()=>execute("UPDATE courses SET reviewed_by='actor'")],['owner changed',()=>execute("UPDATE courses SET owner_id='other'")],['owner banned',()=>execute("UPDATE users SET banned=1 WHERE id='owner'")],['owner terms revoked',()=>execute("UPDATE users SET terms_version=0 WHERE id='owner'")],['image owner changed',()=>execute("UPDATE images SET owner_id='other'")],['image bytes metadata changed',()=>execute('UPDATE images SET bytes=bytes+1')],['image MIME changed',()=>execute("UPDATE images SET mime='image/jpeg'")],['image deleted',()=>execute('DELETE FROM images')],['image too large',()=>execute('UPDATE images SET bytes=2097153')],['review attribution missing',()=>execute('UPDATE courses SET reviewed_by=NULL')]];
 for(const [label,change] of sourceChanges){
  preview=await reset();before(/INSERT INTO promotion_candidates/,change);await denied(await request('POST','/candidates',preparation(preview)),'prepare source '+label);assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_candidates').get()!.n,0);assert.equal([...objects.keys()].filter(key=>key.startsWith('promotion-candidates/')).length,0);
  preview=await reset();saved=await prepare(preview);before(/UPDATE promotion_candidates SET/,change);await denied(await request('POST',`/candidates/${saved.id}/review`,{requestId:rid(),expectedRevision:1,digest:saved.digest,review:reviewInput(saved)}),'review source '+label);assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_reviews').get()!.n,0);
  preview=await reset();saved=await approve(await prepare(preview));before(/SELECT CASE WHEN EXISTS/,change);await denied(await request('GET',`/candidates/${saved.id}/export`),'export source '+label);
  const invalid=await ok(await request('GET',`/candidates/${saved.id}`));assert.equal(invalid.history.length,1);assert.equal(invalid.canExport,false);assert(invalid.problems.length);assert.equal(invalid.candidate.provenance.status,'unapproved-candidate');
  saved=await ok(await request('POST',`/candidates/${saved.id}/revoke`,{requestId:rid(),expectedRevision:2,digest:saved.digest,review:reviewInput(saved,'revoked')}));assert.equal(saved.state,'revoked');assert.equal(saved.history.length,2);
 }
 // History stays private, strictly bound and immutable even during async responses.
 preview=await reset();saved=await approve(await prepare(preview));saved=await ok(await request('POST',`/candidates/${saved.id}/revoke`,{requestId:rid(),expectedRevision:2,digest:saved.digest,review:reviewInput(saved,'revoked')}));
 await denied(await request('GET',`/candidates/${saved.id}`,undefined,{cookie:false}),'anonymous history');before(/SELECT CASE WHEN EXISTS/,()=>execute('DELETE FROM sessions'));await denied(await request('GET',`/candidates/${saved.id}`),'history session revoked');
 for(const alteration of ["UPDATE promotion_reviews SET record='{}'","DELETE FROM promotion_reviews","UPDATE promotion_reviews SET candidate_revision=9"]){
  preview=await reset();saved=await approve(await prepare(preview));execute(alteration);await denied(await request('GET',`/candidates/${saved.id}`),'malformed history');await denied(await request('GET',`/candidates/${saved.id}/export`),'malformed history export');
 }
 preview=await reset();saved=await approve(await prepare(preview));const missingMedia=JSON.stringify({...saved.review,evidence:saved.review.evidence.filter((e:any)=>e.kind!=='media-rights')});execute('UPDATE promotion_reviews SET record=?',missingMedia);execute('UPDATE promotion_candidates SET review=?',missingMedia);await denied(await request('GET',`/candidates/${saved.id}`),'invalid retained media evidence');
 preview=await reset();saved=await approve(await prepare(preview));before(/SELECT CASE WHEN EXISTS/,()=>execute('DELETE FROM promotion_reviews'));await denied(await request('GET',`/candidates/${saved.id}`),'late history replacement');
 // A removed editor can no longer provide source-owned media, even with intact bytes.
 preview=await reset();execute("INSERT INTO course_editors VALUES('community-row','other','owner',?)",time);execute("UPDATE images SET owner_id='other'");preview=await ok(await request('GET','/sources/community-row?version=1'));saved=await prepare(preview);before(/UPDATE promotion_candidates SET/,()=>execute('DELETE FROM course_editors'));await denied(await request('POST',`/candidates/${saved.id}/review`,{requestId:rid(),expectedRevision:1,digest:saved.digest,review:reviewInput(saved)}),'editor association revoked');
 // Mutable source/media bytes never inherit an earlier candidate's human review.
 for(const variant of ['media','package','private']){
  preview=await reset();saved=await approve(await prepare(preview));
  if(variant==='media'){const bytes=png.slice();bytes[bytes.length-1]^=1;objects.set('images/owned-image',{bytes,mime:'image/png'});}
  if(variant==='package')object('courses/community-row.v1.json',JSON.stringify(community)+' ');
  if(variant==='private'){const key=[...objects.keys()].find(key=>key.startsWith('promotion-candidates/'))!;const stored=JSON.parse(new TextDecoder().decode(objects.get(key)!.bytes));stored.course.title='Tampered';object(key,JSON.stringify(stored));}
  await denied(await request('GET',`/candidates/${saved.id}/export`),variant+' tampering');
 }
 preview=await reset();const bytes=png.slice();bytes[bytes.length-1]^=1;objects.set('images/owned-image',{bytes,mime:'image/png'});await denied(await request('POST','/candidates',preparation(preview)),'media changed since preview');
 preview=await reset();objects.set('images/owned-image',{bytes:new Uint8Array(png.length),mime:'image/png'});await denied(await request('GET','/sources/community-row?version=1'),'false image bytes');
 // Revocation/concurrent state changes at the last asynchronous export barrier.
 for(const update of ["UPDATE promotion_candidates SET state='revoked',revision=revision+1,review=NULL","UPDATE promotion_candidates SET source_guard='{}'","UPDATE promotion_candidates SET object_key='promotion-candidates/replaced.json'","DELETE FROM promotion_candidates"]){preview=await reset();saved=await approve(await prepare(preview));before(/SELECT CASE WHEN EXISTS/,()=>{if(update.startsWith('DELETE')){execute('DELETE FROM promotion_operations');execute('DELETE FROM promotion_reviews');}execute(update);});await denied(await request('GET',`/candidates/${saved.id}/export`),'late material revocation');}
 // Revocation during the last awaited handoff hash still cannot release authority.
 for(const change of [()=>execute('DELETE FROM sessions'),()=>execute('UPDATE courses SET reviewed_version=0'),()=>execute("UPDATE promotion_candidates SET state='revoked',revision=revision+1")]){
  preview=await reset();saved=await approve(await prepare(preview));let reached=false;hashHook=async text=>{if(text.includes('"status":"reviewed-not-authorized"')){hashHook=null;reached=true;change();}};
  await denied(await request('GET',`/candidates/${saved.id}/export`),'asynchronous final hash revocation');assert(reached);
 }
 // Original reviewer lost authority but another current admin can inspect/revoke.
 preview=await reset();saved=await approve(await prepare(preview));execute("UPDATE sessions SET user_id='reviewer-admin'");execute("UPDATE users SET role='author' WHERE id='actor'");await denied(await request('GET',`/candidates/${saved.id}/export`),'reviewer authority revoked');const invalidReviewer=await ok(await request('GET',`/candidates/${saved.id}`));assert(!invalidReviewer.canExport);assert(invalidReviewer.problems.length);
 // Concurrent identical request IDs cannot create a second authority record.
 preview=await reset();const concurrent=preparation(preview);before(/INSERT INTO promotion_candidates/,async()=>{await ok(await request('POST','/candidates',concurrent),201);});await denied(await request('POST','/candidates',concurrent),'same-id prepare race');assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_candidates').get()!.n,1);saved=await ok(await request('POST','/candidates',concurrent));
 const concurrentReview={requestId:rid(),expectedRevision:1,digest:saved.digest,review:reviewInput(saved)};before(/UPDATE promotion_candidates SET/,async()=>{await ok(await request('POST',`/candidates/${saved.id}/review`,concurrentReview));});await denied(await request('POST',`/candidates/${saved.id}/review`,concurrentReview),'same-id review race');assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_reviews').get()!.n,1);await ok(await request('POST',`/candidates/${saved.id}/review`,concurrentReview));
 // An uncertain lost response must retain committed immutable bytes and replay once.
 preview=await reset();const lost=preparation(preview);lostBatchResponse=true;let uncertain=await request('POST','/candidates',lost);assert.equal(uncertain.status,500);assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_candidates').get()!.n,1);assert.equal([...objects.keys()].filter(key=>key.startsWith('promotion-candidates/')).length,1);saved=await ok(await request('POST','/candidates',lost));
 const lostReview={requestId:rid(),expectedRevision:1,digest:saved.digest,review:reviewInput(saved)};lostBatchResponse=true;uncertain=await request('POST',`/candidates/${saved.id}/review`,lostReview);assert.equal(uncertain.status,500);assert.equal(db.prepare('SELECT COUNT(*) n FROM promotion_reviews').get()!.n,1);saved=await ok(await request('POST',`/candidates/${saved.id}/review`,lostReview));assert.equal(saved.canExport,true);
 // Retention includes every terminal state; early quota denial does not upload.
 preview=await reset();saved=await prepare(preview);const template=db.prepare('SELECT * FROM promotion_candidates').get()!;
 for(let i=1;i<100;i++)execute("INSERT INTO promotion_candidates(id,title,source,source_guard,object_key,digest,revision,state,review,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,1,'rejected',NULL,'actor',?,?)",`quota-${i}`,template.title,template.source,template.source_guard,`promotion-candidates/quota-${i}.json`,template.digest,time,time);
 await denied(await request('POST','/candidates',preparation(preview)),'retention quota');assert.equal([...objects.keys()].filter(key=>key.startsWith('promotion-candidates/')).length,1);
 // No authored/imported material or unbounded/ambiguous request can create authority.
 preview=await reset();for(const extra of [{candidate:preview.candidate},{source:preview.source},{review:reviewInput({candidate:preview.candidate})},{state:'reviewed'}])await denied(await request('POST','/candidates',{...preparation(preview),...extra}),'imported authority');
 for(const raw of ['x'.repeat(210000),'[]','null','{"requestId":"a","requestId":"b"}','{"__proto__":{}}',new Uint8Array([0xff])])await denied(await request('POST','/candidates',undefined,{raw}),'malformed bounded request');
 await denied(await request('POST','/candidates',preparation(preview),{contentType:'text/plain'}),'wrong MIME');
 await denied(await request('GET','/sources?cursor=../bad'),'bad cursor');
 // Bounded keyset selection is not an ever-growing all-catalog read.
 for(let i=0;i<28;i++)execute("INSERT INTO courses(id,owner_id,draft,status,version,reviewed_version,reviewed_by,reviewed_at,published_at,title,created_at,updated_at) VALUES(?,'owner',?,'published',1,1,'reviewer-admin',?,?,?,?,?)",`page-${String(i).padStart(2,'0')}`,JSON.stringify(community),time,time,course.title,time,time);
 const page=await ok(await request('GET','/sources'));assert.equal(page.sources.length,25);assert(page.nextCursor);const next=await ok(await request('GET','/sources?cursor='+page.nextCursor));assert.equal(next.sources.length,4);assert(!next.nextCursor);assert(!page.sources.some((source:any)=>next.sources.some((other:any)=>source.communityId===other.communityId)));
 const session=await ok(await request('GET','/session'));assert.equal(session.userId,'actor');assert.notEqual(session.sessionKey,tokenHash);assert(!JSON.stringify(session).includes(token));
 console.log(`Promotion server: ${checks} checks passed across real SQLite/R2 lifecycle, CAS, request replay, immutable bytes, media ownership, source/actor revocation and private response races.`);
}finally{crypto.subtle.digest=originalDigest;db.close();}
