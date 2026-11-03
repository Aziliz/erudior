// Real SQLite statements and transactions with deterministic asynchronous interleavings.
// Real D1/R2/browser coverage is separate; no production accounts, network or keys.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readdirSync,readFileSync } from 'node:fs';
import { handleAdminStudio, studioHash, type StudioEnv } from '../src/adminStudio.ts';
import { officialStudioSources } from '../src/studioOfficialSources.ts';
import { emptyCourse } from '../../src/lib/course.ts';
import { canonicalAuthoringFromCourse } from '../../src/lib/canonicalAuthoring.ts';
import { emptyDoc,checkDoc } from '../../src/lib/communityFormat.ts';
import { buildStudioDocument,studioChoices,studioDigest,type StudioDocument,type StudioInventory } from '../../src/lib/adminStudio.ts';

const db=new DatabaseSync(':memory:');
for(const file of readdirSync(new URL('../migrations/',import.meta.url)).filter(n=>n.endsWith('.sql')).sort())db.exec(readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
const token='synthetic-studio-session',tokenHash=await studioHash(token),app='https://app.example',api='https://api.example';
const time='2026-01-01T00:00:00.000Z';
const execute=(sql:string,...args:any[])=>db.prepare(sql).run(...args);
let hook:((sql:string)=>Promise<void>)|null=null;let r2Hook:(()=>Promise<void>)|null=null;
let requestCounter=0;
class Statement {
 values:any[]=[]; constructor(public sql:string){}
 bind(...args:any[]){this.values=args;return this;}
 async boundary(){if(hook)await hook(this.sql);}
 async first(){await this.boundary();return db.prepare(this.sql).get(...this.values)??null;}
 async all(){await this.boundary();return {results:db.prepare(this.sql).all(...this.values),success:true};}
 async run(){await this.boundary();return this.rawRun();}
 rawRun(){const result=db.prepare(this.sql).run(...this.values);return {success:true,meta:{changes:Number(result.changes)}};}
}
const wrappedDB={prepare:(sql:string)=>new Statement(sql),async batch(statements:Statement[]){
 // Interleaving before transaction starts models authorization/source change after all awaits.
 if(hook)await hook(statements[0].sql);
 db.exec('BEGIN');try{const result=statements.map(s=>s.rawRun());db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}
}};
const course=emptyCourse('Synthetic studio source');course.id='canonical-course';course.revision=1;
course.lessons=[{id:'lesson',module:'m1',title:'Observe',body:'Observe the paper.'}];
course.banks=[{format:'examiner-bank',version:1,id:'bank',title:'Questions',sections:[],exam:{questionCount:1,timeLimitMinutes:10,passingPercent:70},questions:[{id:'q',topic:'Paper',stem:'Choose B.',choices:['A','B'],answer:[1]}]}];
course.decks=[{id:'cards',title:'Cards',cards:[{id:'card',front:'Prompt',back:'PRIVATE_CARD_BACK'}]}];
const community={...emptyDoc(),title:course.title,lessons:[],decks:[],description:'Synthetic test source only.',canonical:canonicalAuthoringFromCourse(course,{strict:true})};
assert.deepEqual(checkDoc(community,true),[]);
let packageText=JSON.stringify(community);
const files={async get(){if(r2Hook){const h=r2Hook;r2Hook=null;await h();}return {size:new TextEncoder().encode(packageText).length,async text(){return packageText;}};}};
const env={DB:wrappedDB,FILES:files,APP_ORIGIN:app,API_ORIGIN:api} as unknown as StudioEnv;
const originalOfficial={...officialStudioSources};
officialStudioSources.manifest=async()=>{throw Error('Synthetic catalog unavailable');};
function request(method:string,path:string,body?:unknown,options:{cookie?:boolean;origin?:string;raw?:string}={}){
 return handleAdminStudio(new Request(api+'/admin/studio'+path,{method,headers:{Origin:options.origin??app,...(options.cookie===false?{}:{Cookie:`erudior_session=${token}`}),...(body===undefined&&options.raw===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined&&options.raw===undefined?{}:{body:options.raw??JSON.stringify(body)})}),env);
}
async function ok(response:Response,status=200){const data=await response.json();assert.equal(response.status,status,JSON.stringify(data));assert.equal(response.headers.get('Cache-Control'),'no-store');return data as any;}
async function denied(response:Response,label='denied'){const text=await response.text();assert([400,401,403,404,409,413,415].includes(response.status),`${label}: ${response.status} ${text}`);assert.equal(response.headers.get('Cache-Control'),'no-store');assert(!text.includes('PRIVATE_'),label+' leaked teacher content');}
const rid=()=>`request-${++requestCounter}-synthetic`;
async function reset(){hook=null;r2Hook=null;packageText=JSON.stringify(community);for(const t of ['studio_operations','studio_materials','studio_sources','studio_official_sources','course_editors','reports','courses','sessions','users'])db.exec(`DELETE FROM ${t}`);
 for(const [id,role] of [['actor','admin'],['owner','author']])execute('INSERT INTO users(id,provider,provider_id,display_name,role,banned,accepted_at,terms_version,created_at) VALUES(?,?,?,?,?,0,?,2,?)',id,'dev',id,id,role,time,time);
 execute('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)',tokenHash,'actor','2999-01-01T00:00:00.000Z');
 execute("INSERT INTO courses(id,owner_id,draft,status,version,reviewed_version,reviewed_at,published_at,title,created_at,updated_at) VALUES('community-row','owner',?,'published',1,1,?,?,?, ?,?)",packageText,time,time,course.title,time,time);
 const loaded=await ok(await request('GET','/sources/community%3Acommunity-row'));return loaded.inventory as StudioInventory;
}
function before(pattern:RegExp,change:()=>unknown|Promise<unknown>){hook=async sql=>{if(pattern.test(sql)){hook=null;await change();}};}
function doc(inventory:StudioInventory){const result=buildStudioDocument('worksheet','untrusted-import','Synthetic worksheet',studioChoices('worksheet',[inventory]).map(r=>({source:r.source,key:r.key})),[inventory]);result.teacherNotes='PRIVATE_TEACHER_NOTES';return result;}
async function create(inventory:StudioInventory){return await ok(await request('POST','/materials',{requestId:rid(),document:doc(inventory)}),201);}
async function approve(document:StudioDocument){return await ok(await request('POST',`/materials/${document.id}/approve`,{requestId:rid(),expectedRevision:document.revision,digest:await studioDigest(document)}));}
let checks=0;
try{
 let inventory=await reset();
 for(const role of ['author','reviewer']){execute("UPDATE users SET role=? WHERE id='actor'",role);await denied(await request('GET','/materials'),role);checks++;}execute("UPDATE users SET role='admin' WHERE id='actor'");
 await denied(await request('GET','/materials',undefined,{cookie:false}),'anonymous');await denied(await request('POST','/materials',{requestId:rid(),document:doc(inventory)},{origin:'https://evil.example'}),'origin');checks+=2;
 const catalog=await ok(await request('GET','/sources'));assert.equal(catalog.sources[0].id,'community:community-row');assert(catalog.warning.includes('unavailable'));
 const body={requestId:rid(),document:doc(inventory)};let saved=await ok(await request('POST','/materials',body),201);assert.notEqual(saved.document.id,body.document.id);assert.equal(saved.document.revision,1);assert.equal(saved.approval,null);
 const replay=await ok(await request('POST','/materials',body));assert.equal(replay.document.id,saved.document.id);assert.equal(db.prepare('SELECT COUNT(*) n FROM studio_materials').get()!.n,1);
 await denied(await request('POST','/materials',{...body,document:{...body.document,title:'Different'}}),'identity reuse');
 await denied(await request('GET',`/materials/${saved.document.id}/present?audience=learner`),'unapproved delivery');
 assert((await ok(await request('GET',`/materials/${saved.document.id}/export?audience=teacher`))).document.teacherNotes.includes('PRIVATE'));
 saved=await approve(saved.document);assert(saved.approval);
 const delivery=await ok(await request('GET',`/materials/${saved.document.id}/present?audience=learner`));assert(!JSON.stringify(delivery).includes('PRIVATE_'));assert(!JSON.stringify(delivery).includes('answer'));
 assert((await ok(await request('GET',`/materials/${saved.document.id}/present?audience=teacher`))).document.teacherNotes.includes('PRIVATE'));
 const changed={...saved.document,title:'Edited'};const write={requestId:rid(),expectedRevision:1,document:changed};saved=await ok(await request('PUT',`/materials/${changed.id}`,write));assert.equal(saved.approval,null);assert.equal(saved.document.revision,2);
 await denied(await request('PUT',`/materials/${changed.id}`,{...write,requestId:rid()}),'stale save');
 saved=await approve(saved.document);
 const deletion={requestId:rid(),expectedRevision:2};const archived=await ok(await request('DELETE',`/materials/${changed.id}`,deletion));assert.equal(archived.revision,3);
 assert.deepEqual(await ok(await request('DELETE',`/materials/${changed.id}`,deletion)),archived);
 await denied(await request('GET',`/materials/${changed.id}`),'archived');
 const list=await ok(await request('GET','/materials?archived=1'));assert.equal(list.materials.length,1);
 saved=await ok(await request('POST',`/materials/${changed.id}/restore`,{requestId:rid(),expectedRevision:3}));assert.equal(saved.document.revision,4);assert.equal(saved.approval,null);checks+=12;
 // Archive and recover a source-invalid draft. Restore never recovers approval.
 execute("UPDATE courses SET reviewed_version=0");const invalid=await ok(await request('GET',`/materials/${changed.id}`));assert(invalid.problems.length);assert.equal(invalid.approval,null);
 await denied(await request('GET',`/materials/${changed.id}/export?audience=learner`),'invalid source');
 await ok(await request('GET',`/materials/${changed.id}/export?audience=teacher`));checks+=3;
 const actorChanges:[string,()=>unknown][]=[['session deletion',()=>execute('DELETE FROM sessions')],['session expiry',()=>execute("UPDATE sessions SET expires_at='2000-01-01T00:00:00.000Z'")],['role revoked',()=>execute("UPDATE users SET role='author' WHERE id='actor'")],['ban',()=>execute("UPDATE users SET banned=1 WHERE id='actor'")],['terms revoked',()=>execute("UPDATE users SET terms_version=0 WHERE id='actor'")]];
 for(const [label,change] of actorChanges){
  inventory=await reset();before(/INSERT INTO studio_materials/,change);await denied(await request('POST','/materials',{requestId:rid(),document:doc(inventory)}),'create '+label);assert.equal(db.prepare('SELECT COUNT(*) n FROM studio_materials').get()!.n,0);checks++;
  inventory=await reset();saved=await create(inventory);before(/UPDATE studio_materials SET approval/,change);await denied(await request('POST',`/materials/${saved.document.id}/approve`,{requestId:rid(),expectedRevision:1,digest:await studioDigest(saved.document)}),'approve '+label);assert.equal(db.prepare('SELECT approval FROM studio_materials').get()!.approval,null);checks++;
  inventory=await reset();saved=await create(inventory);r2Hook=async()=>{change();};await denied(await request('GET',`/materials/${saved.document.id}`),'read '+label);checks++;
 }
 const sourceChanges:[string,()=>unknown][]=[['unpublished',()=>execute("UPDATE courses SET status='unpublished'")],['review revoked',()=>execute('UPDATE courses SET reviewed_version=0')],['new version',()=>execute('UPDATE courses SET version=2')],['owner banned',()=>execute("UPDATE users SET banned=1 WHERE id='owner'")],['review replaced',()=>execute("UPDATE courses SET reviewed_at='2027-01-01T00:00:00.000Z'")]];
 for(const [label,change] of sourceChanges){
  inventory=await reset();before(/INSERT INTO studio_materials/,change);await denied(await request('POST','/materials',{requestId:rid(),document:doc(inventory)}),'create source '+label);assert.equal(db.prepare('SELECT COUNT(*) n FROM studio_materials').get()!.n,0);checks++;
  inventory=await reset();saved=await create(inventory);saved=await approve(saved.document);before(/SELECT id FROM studio_materials WHERE id=\? AND revision=\? AND digest=\? AND approval=\?/,change);await denied(await request('GET',`/materials/${saved.document.id}/present?audience=learner`),'present source '+label);checks++;
 }
 // Revocation after asynchronous package load, before the final envelope release.
 inventory=await reset();saved=await create(inventory);saved=await approve(saved.document);let authChecks=0;
 hook=async sql=>{if(sql.startsWith('SELECT 1 AS ok')&&++authChecks===2){hook=null;execute('UPDATE courses SET reviewed_version=0');}};
 await denied(await request('GET',`/materials/${saved.document.id}`),'late source revocation');checks++;
 inventory=await reset();saved=await create(inventory);saved=await approve(saved.document);before(/SELECT id FROM studio_materials WHERE id=\? AND revision=\? AND digest=\? AND approval IS/,()=>execute('UPDATE courses SET reviewed_version=0'));await denied(await request('GET',`/materials/${saved.document.id}`),'final envelope source guard');checks++;
 // Saved revision changes while source content is awaited: do not release stale review.
 inventory=await reset();saved=await create(inventory);saved=await approve(saved.document);
 r2Hook=async()=>{execute('UPDATE studio_materials SET revision=revision+1,approval=NULL');};await denied(await request('GET',`/materials/${saved.document.id}`),'concurrent material edit');checks++;
 inventory=await reset();const tampered=doc(inventory);tampered.resources[0].blocks[0].text+=' altered';await denied(await request('POST','/materials',{requestId:rid(),document:tampered}),'tampered source');
 await denied(await request('POST','/materials',{requestId:rid(),document:{...doc(inventory),approval:{digest:'forged'}}}),'imported authority');
 await denied(await request('POST','/materials',undefined,{raw:'x'.repeat(510000)}),'bounded body');checks+=3;

 // Two requests race with one idempotency identity; only one material is committed.
 inventory=await reset();const concurrentBody={requestId:rid(),document:doc(inventory)};
 before(/INSERT INTO studio_materials/,async()=>{await ok(await request('POST','/materials',concurrentBody),201);});
 await denied(await request('POST','/materials',concurrentBody),'concurrent same request');
 assert.equal(db.prepare('SELECT COUNT(*) n FROM studio_materials').get()!.n,1);
 await ok(await request('POST','/materials',concurrentBody));checks++;
 // Approval cannot survive source changes injected immediately before approval commit.
 inventory=await reset();saved=await create(inventory);before(/UPDATE studio_materials SET approval/,()=>execute('UPDATE courses SET reviewed_version=0'));
 await denied(await request('POST',`/materials/${saved.document.id}/approve`,{requestId:rid(),expectedRevision:1,digest:await studioDigest(saved.document)}),'approval source race');checks++;
 // Ordinary update and archive are authority guarded at their actual SQL commit.
 for(const method of ['PUT','DELETE']){inventory=await reset();saved=await create(inventory);before(/UPDATE studio_materials SET document/,()=>execute('DELETE FROM sessions'));
  await denied(await request(method,`/materials/${saved.document.id}`,{requestId:rid(),expectedRevision:1,...(method==='PUT'?{document:{...saved.document,title:'Unauthorized edit'}}:{})}),'mutation session race');
  assert.equal(db.prepare('SELECT revision FROM studio_materials').get()!.revision,1);checks++;
 }
 // Official adapter cryptography is covered separately. Here its asynchronous
 // freshness barrier revokes session/source state before the same SQL guards.
 inventory=await reset();const officialInventory=structuredClone(inventory);officialInventory.source.digest='b'.repeat(64);
 const manifest={digest:'c'.repeat(64),entries:[{id:course.id,title:course.title,revision:1,file:'synthetic.r1.json',bytes:1,sha256:officialInventory.source.digest}]};
 officialStudioSources.manifest=async()=>manifest;officialStudioSources.load=async()=>officialInventory;officialStudioSources.assertCurrent=async()=>{};
 await ok(await request('GET','/sources/official%3A'+course.id));
 officialStudioSources.assertCurrent=async()=>{execute('DELETE FROM sessions');};
 await denied(await request('POST','/materials',{requestId:rid(),document:doc(officialInventory)}),'official refresh actor race');assert.equal(db.prepare('SELECT COUNT(*) n FROM studio_materials').get()!.n,0);checks++;
 inventory=await reset();officialStudioSources.assertCurrent=async()=>{};await ok(await request('GET','/sources/official%3A'+course.id));
 officialStudioSources.assertCurrent=async()=>{throw Error('Official catalog changed');};
 await denied(await request('POST','/materials',{requestId:rid(),document:doc(officialInventory)}),'official freshness change');checks++;
 officialStudioSources.manifest=async()=>{throw Error('Synthetic catalog unavailable');};
 // Session generation is not a credential; changes when the same user signs in anew.
 await reset();const firstSession=await ok(await request('GET','/session'));assert.equal(firstSession.userId,'actor');assert.notEqual(firstSession.sessionKey,tokenHash);assert(!JSON.stringify(firstSession).includes(token));
 execute('DELETE FROM sessions');await denied(await request('GET','/session'),'session endpoint revocation');checks++;
 console.log(`Studio server: ${checks} authorization, SQLite CAS/transaction, immutable-source race, exact approval, replay, recovery and leakage checks passed.`);
}finally{Object.assign(officialStudioSources,originalOfficial);db.close();}
