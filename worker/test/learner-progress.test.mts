import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import nacl from 'tweetnacl';
import { learnerBase64, learnerHash, signLearnerGrant, encryptLearnerSnapshot, decryptLearnerSnapshot, type LearnerGrant, type LearnerTrust } from '../../src/lib/learnerPrivacy.ts';
import { handleLearnerProgress, sweepLearnerProgress, type LearnerProgressEnv } from '../src/learnerProgress.ts';

export async function learnerServerFixture() {
 const keys=nacl.sign.keyPair(),now=Math.floor(Date.now()/1000);
 const trust:LearnerTrust={issuer:'synthetic-app-identity',audience:'https://api.example/learner-progress',namespace:'synthetic-app',keys:[{id:'identity-synthetic',publicKey:learnerBase64(keys.publicKey)}]};
 const grant:LearnerGrant={issuer:trust.issuer,audience:trust.audience,namespace:trust.namespace,account:'account-synthetic-01',profile:'profile-synthetic-01',authority:'verified-guardian',consentReceipt:'consent-synthetic-01',consentVersion:1,scopes:['read','write','erase'],issuedAt:now,expiresAt:now+300};
 const binding={namespace:grant.namespace,account:grant.account,profile:grant.profile,schemaVersion:1 as const};
 const snapshot={format:'erudior-learner-practice' as const,version:1 as const,educationalOnly:true as const,createdAt:new Date().toISOString(),courses:[{courseId:'neutral-course',revision:1,sourceDigest:'a'.repeat(64),lessons:[{lessonId:'neutral-lesson',completedOn:'2026-10-29'}],practice:{attempts:4,correct:3}}]};
 const passphrase='synthetic-only passphrase',envelope=await encryptLearnerSnapshot(snapshot,passphrase,binding);
 const sign=(overrides:Partial<LearnerGrant>={})=>signLearnerGrant({...grant,...overrides},'identity-synthetic',keys.secretKey);
 return {keys,trust,grant,binding,snapshot,passphrase,envelope,sign};
}
type Fixture=Awaited<ReturnType<typeof learnerServerFixture>>;
type Call=(path:string,value?:unknown,authorization?:unknown,headers?:Record<string,string>)=>Promise<{status:number;body:any;headers:Headers}>;
export async function runLearnerProgressTests(f:Fixture,call:Call) {
 assert.equal((await call('/status')).body.enabled,true);
 const grant=f.sign();
 assert.equal((await call('/read',{})).status,401,'Community cookies never authenticate learner progress');
 assert.equal((await call('/read',{},grant,{Origin:'https://evil.example'})).status,403);
 assert.equal((await call('/read',{},f.sign({expiresAt:f.grant.issuedAt-1,issuedAt:f.grant.issuedAt-10}))).status,401);
 assert.equal((await call('/read',{},f.sign({audience:'https://wrong.example'}))).status,401);
 assert.equal((await call('/read',{},f.sign({scopes:['write']}))).status,401);
 assert.equal((await call('/read',{}, {...grant,purpose:'credential-event'})).status,401);
 assert.equal((await call('/read',{}, {...grant,signature:'A'.repeat(88)})).status,401);
 assert.equal((await call('/read',{name:'do-not-store'},grant)).status,400);
 assert.deepEqual((await call('/read',{},grant)).body,{state:'empty',revision:0,expiresAt:null});
 const write={requestId:'write-0001',expectedRevision:0,retentionDays:7,envelope:f.envelope};
 assert.equal((await call('/write',{...write,retentionDays:31},grant)).status,400);
 assert.equal((await call('/write',{...write,envelope:{...f.envelope,binding:{...f.binding,profile:'another-profile'}}},grant)).status,403);
 const replies=await Promise.all([call('/write',write,grant),call('/write',write,grant)]);
 assert.ok(replies.every(r=>r.status===200||r.status===201));assert.deepEqual(replies[0].body,replies[1].body,'Concurrent identical requests create one revision');assert.equal(replies[0].body.revision,1);
 const read=await call('/read',{},grant);assert.equal(read.status,200);assert.equal(read.body.revision,1);
 assert.deepEqual(await decryptLearnerSnapshot(read.body.envelope,f.passphrase,f.binding),f.snapshot);
 assert.equal(read.headers.get('cache-control'),'no-store');assert.equal(read.headers.get('referrer-policy'),'no-referrer');
 assert.ok(!JSON.stringify(read.body).includes('neutral-course'),'Server returns only ciphertext, not lesson data');
 const other=f.sign({profile:'other-profile-0001'});assert.equal((await call('/read',{},other)).body.state,'empty');
 assert.equal((await call('/write',{...write,requestId:'stale-write-01'},grant)).status,409);
 assert.equal((await call('/write',{...write,retentionDays:6},grant)).status,409,'Same identifier cannot bind another body');
 const next={...write,requestId:'write-0002',expectedRevision:1};
 const competing=await Promise.all([call('/write',next,grant),call('/write',{...next,requestId:'write-competing'},grant)]);
 assert.deepEqual(competing.map(x=>x.status).sort(),[200,409],'Concurrent different writes never silently merge');
 assert.equal((await call('/read',{},grant)).body.revision,2);
 assert.deepEqual((await call('/write',write,grant)).body,replies[0].body,'Older exact request returns historical receipt, not a new write');
 assert.equal((await call('/read',{},grant)).body.revision,2);
 assert.equal((await call('/erase',{requestId:'erase-stale',expectedRevision:1},grant)).status,409);
 const erase={requestId:'erase-0001',expectedRevision:2};
 const erased=await Promise.all([call('/erase',erase,grant),call('/erase',erase,grant)]);
 assert.ok(erased.every(x=>x.status===200));assert.deepEqual(erased[0].body,erased[1].body);
 assert.deepEqual(erased[0].body,{state:'erased',revision:3,expiresAt:null});
 assert.equal((await call('/read',{},grant)).body.state,'erased');
 assert.equal((await call('/write',write,grant)).status,410,'Old exact retry cannot resurrect deleted ciphertext');
 assert.equal((await call('/write',{...write,requestId:'new-write-after-erase',expectedRevision:3},f.sign())).status,410,'Fresh identity grant cannot resurrect tombstone');
 const emptyErase={requestId:'erase-never-synced',expectedRevision:0};
 assert.equal((await call('/erase',emptyErase,other)).body.state,'erased','Erase before first upload blocks delayed offline writes');
 assert.equal((await call('/write',{...write,envelope:{...f.envelope,binding:{...f.binding,profile:'other-profile-0001'}}},other)).status,410);
 console.log('Learner progress auth isolation, opaque encryption, CAS/conflicts, exact retries, terminal erasure and minimal responses passed.');
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
 // Actual SQLite SQL semantics, in addition to the isolated Cloudflare D1/TLS suite.
 const {DatabaseSync}=await import('node:sqlite');const sql=new DatabaseSync(':memory:');
 sql.exec(await readFile(new URL('../learner-progress-migrations/0001_progress.sql',import.meta.url),'utf8'));
 let accesses=0;
 const db:any={prepare(query:string){let values:any[]=[];const statement:any={bind(...args:any[]){values=args;return statement;},async first(){accesses++;return sql.prepare(query).get(...values)??null;},async run(){accesses++;const r=sql.prepare(query).run(...values);return {meta:{changes:Number(r.changes)}};},execute(){accesses++;const r=sql.prepare(query).run(...values);return {meta:{changes:Number(r.changes)}};}};return statement;},async batch(statements:any[]){sql.exec('BEGIN');try{const out=statements.map(s=>s.execute());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const f=await learnerServerFixture(),env:LearnerProgressEnv={APP_ORIGIN:'https://app.example',LEARNER_PROGRESS_DB:db,LEARNER_PROGRESS_TRUST:JSON.stringify(f.trust)};
 for(const missing of ['LEARNER_PROGRESS_DB','LEARNER_PROGRESS_TRUST'] as const){const res=await handleLearnerProgress(new Request('https://api.example/learner-progress/status'),{...env,[missing]:undefined});assert.equal((await res.json() as any).enabled,false);assert.equal(accesses,0);}
 const call:Call=async(path,value,grant,headers={})=>{const r=await handleLearnerProgress(new Request('https://api.example/learner-progress'+path,{method:value===undefined?'GET':'POST',headers:{'Content-Type':'application/json',Cookie:'erudior_session=untrusted',...(grant?{Authorization:'Bearer '+JSON.stringify(grant)}:{}),...headers},...(value===undefined?{}:{body:JSON.stringify(value)})}),env);return {status:r.status,body:await r.json(),headers:r.headers};};
 await runLearnerProgressTests(f,call);
 const row=sql.prepare('SELECT * FROM learner_progress WHERE subject_hash=?').get(await learnerHash(f.binding)) as any;
 assert.equal(row.envelope,null);assert.equal(row.envelope_hash,null);assert.equal(row.expires_at,null);
 assert.equal(sql.prepare('SELECT COUNT(*) n FROM learner_progress_receipts').get()!.n,0,'Erasure scrubs receipt history');
 assert.ok(!JSON.stringify(row).includes(f.binding.account));assert.ok(!JSON.stringify(row).includes(f.binding.profile));
 const expiredGrant=f.sign({profile:'profile-expiring-01'}),expBinding={...f.binding,profile:'profile-expiring-01'};
 const encrypted=await encryptLearnerSnapshot(f.snapshot,f.passphrase,expBinding);
 assert.equal((await call('/write',{requestId:'expiry-first',expectedRevision:0,retentionDays:1,envelope:encrypted},expiredGrant)).status,201);
 await sweepLearnerProgress(db,Math.floor(Date.now()/1000)+86401);
 assert.deepEqual((await call('/read',{},expiredGrant)).body,{state:'expired',revision:2,expiresAt:null});
 assert.equal((await call('/write',{requestId:'expiry-old',expectedRevision:2,retentionDays:1,envelope:encrypted},expiredGrant)).status,410);
 const lazy=f.sign({profile:'profile-lazy-0001'}),lazyBinding={...f.binding,profile:'profile-lazy-0001'};
 const lazyEncrypted=await encryptLearnerSnapshot(f.snapshot,f.passphrase,lazyBinding);
 await call('/write',{requestId:'lazy-first',expectedRevision:0,retentionDays:1,envelope:lazyEncrypted},lazy);
 sql.prepare('UPDATE learner_progress SET expires_at=? WHERE subject_hash=?').run(1,await learnerHash(lazyBinding));
 assert.equal((await call('/read',{},lazy)).body.state,'expired','No expired data is returned before scheduled sweep');
 const capped=f.sign({profile:'profile-cap-0001'}),capBinding={...f.binding,profile:'profile-cap-0001'},capKey=await learnerHash(capBinding);
 const capEnvelope=await encryptLearnerSnapshot(f.snapshot,f.passphrase,capBinding);
 await call('/write',{requestId:'cap-first',expectedRevision:0,retentionDays:1,envelope:capEnvelope},capped);
 sql.prepare("WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<9999) INSERT INTO learner_progress_receipts SELECT ?, 'synthetic-'||x,'synthetic','{}' FROM n").run(capKey);
 assert.equal((await call('/write',{requestId:'cap-next',expectedRevision:1,retentionDays:1,envelope:capEnvelope},capped)).status,409,'Retry metadata is bounded');
 assert.equal((await call('/read',{},capped)).body.state,'active','Export remains possible at cap');
 assert.equal((await call('/erase',{requestId:'cap-erase',expectedRevision:1},capped)).status,200,'Erasure remains possible at cap');
 const denied=await call('/read',{},'x'.repeat(20000));assert.equal(denied.status,401);
 const fakeTrust={...f.trust,keys:[]};assert.equal((await handleLearnerProgress(new Request('https://api.example/learner-progress/status'),{...env,LEARNER_PROGRESS_TRUST:JSON.stringify(fakeTrust)})).status,503);
 sql.close();console.log('SQLite transactions, disabled-before-storage, expiry sweep/lazy redaction and hashed minimal tombstones passed.');
}
