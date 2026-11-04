import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { credentialFixture } from '../../tests/fixtures/credentialIntegrity.ts';
import { credentialCanonical,credentialHash,signCredentialEnvelope,verifyCredentialStatus,credentialBase64 } from '../../src/lib/credentialIntegrity.ts';
import { verifyCredentialBundle } from '../../src/lib/credentialPdf.ts';
import { handleCredentials,type CredentialEnv } from '../src/credentials.ts';
type Fixture=Awaited<ReturnType<typeof credentialFixture>>;
type Call=(path:string,body?:unknown,headers?:Record<string,string>)=>Promise<{status:number;body:any;headers:Headers}>;
export async function runCredentialTests(f:Fixture,call:Call){
 const sign=(payload:typeof f.issue)=>signCredentialEnvelope('issue',payload,'issuer-synthetic',f.keys.issuer.secretKey);
 assert.equal((await call('/status')).body.enabled,true);
 assert.equal((await call('/issue',{command:f.command,token:f.token},{Origin:'https://evil.example'})).status,403);
 assert.equal((await call('/issue',{command:{...f.command,signature:'A'.repeat(88)},token:f.token})).status,400);
 assert.equal((await call('/issue',{command:sign({...f.issue,exp:f.now-1}),token:f.token})).status,400);
 assert.equal((await call('/issue',{command:sign({...f.issue,audience:'https://wrong.example'}),token:f.token})).status,400);
 assert.equal((await call('/issue',{command:f.command,token:'A'.repeat(43)})).status,400);
 const wrongEnrollment=signCredentialEnvelope('enrollment',{...f.enrollment,programId:'unapproved'},'enrollment-synthetic',f.keys.enrollment.secretKey);
 assert.equal((await call('/issue',{command:sign({...f.issue,enrollment:wrongEnrollment}),token:f.token})).status,400);
 const community={version:1,purpose:'issue',keyId:'community-admin',payload:f.issue,signature:f.command.signature};
 assert.equal((await call('/issue',{command:community,token:f.token})).status,400);
 const replies=await Promise.all([call('/issue',{command:f.command,token:f.token}),call('/issue',{command:f.command,token:f.token})]);
 assert.deepEqual(replies.map(r=>r.status).sort(),[200,201],'Concurrent identical request creates exactly one issuance');
 assert.deepEqual(replies[0].body,replies[1].body,'Idempotent response is exact');
 const issued=await verifyCredentialBundle(replies[0].body.bundle,f.trust);assert.equal(issued.historicalStatus,'issued');assert.equal(issued.currentStatus,'unknown');
 assert.equal((await call('/issue',{command:sign({...f.issue,credentialId:'credential-synthetic-other'}),token:f.token})).status,409,'Request ID cannot bind new payload');
 assert.equal((await call('/issue',{command:sign({...f.issue,requestId:'request-issue-synthetic-other',credentialId:'credential-synthetic-other'}),token:f.token})).status,409,'Enrollment cannot mint duplicate');
 const challenge='challenge-'+ 'x'.repeat(33);
 const status=await call('/verify',{token:f.token,challenge});assert.equal(status.status,200);
 const checked=verifyCredentialStatus(status.body.status,f.trust,f.issue.credentialId,Math.floor(Date.now()/1000),challenge,f.issue.lookupTokenHash);assert.equal(checked.status,'issued');
 for(const privateText of [f.enrollment.subject,f.enrollment.id,f.approval.evidenceDigest,f.approval.methodDigest,'approvedMinutes','reasonCode'])assert.ok(!JSON.stringify(status.body).includes(privateText),'Public status excludes '+privateText);
 assert.equal(status.headers.get('cache-control'),'no-store');assert.equal(status.headers.get('referrer-policy'),'no-referrer');
 assert.throws(()=>verifyCredentialStatus(status.body.status,f.trust,f.issue.credentialId,Math.floor(Date.now()/1000),'other-challenge-'+ 'x'.repeat(27),f.issue.lookupTokenHash));
 assert.equal((await call('/verify',{token:'B'.repeat(43),challenge})).status,404);
 const revocations=await Promise.all([call('/revoke',{command:f.revokeCommand}),call('/revoke',{command:f.revokeCommand})]);
 assert.deepEqual(revocations.map(r=>r.status),[200,200]);assert.deepEqual(revocations[0].body,revocations[1].body);
 assert.equal((await verifyCredentialBundle(revocations[0].body.bundle,f.trust)).historicalStatus,'revoked');
 const final=await call('/verify',{token:f.token,challenge});assert.equal(verifyCredentialStatus(final.body.status,f.trust,f.issue.credentialId,Math.floor(Date.now()/1000),challenge,f.issue.lookupTokenHash).status,'revoked');
 const again=signCredentialEnvelope('revoke',{...f.revoke,requestId:'request-revoke-again-0001',expectedRevision:2},'issuer-synthetic',f.keys.issuer.secretKey);
 assert.equal((await call('/revoke',{command:again})).status,409,'Revocation terminal');
 assert.deepEqual((await call('/issue',{command:f.command,token:f.token})).body,replies[0].body,'Historical issuance remains exact after revocation; fresh status separately revoked');
 const auditPayload={requestId:'request-audit-synthetic-0001',credentialId:f.issue.credentialId,iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+120,audience:f.trust.audience};
 const auditCommand=signCredentialEnvelope('audit',auditPayload,'issuer-synthetic',f.keys.issuer.secretKey);
 assert.equal((await call('/audit',{command:f.command})).status,400,'Wrong purpose cannot retrieve private audit');
 assert.equal((await call('/audit',{command:signCredentialEnvelope('audit',auditPayload,'instructor-synthetic',f.keys.instructor.secretKey)})).status,400,'Instructor cannot retrieve private issuer audit');
 assert.equal((await call('/audit',{command:signCredentialEnvelope('audit',{...auditPayload,iat:f.now-500,exp:f.now-400},'issuer-synthetic',f.keys.issuer.secretKey)})).status,400,'Expired audit command rejected');
 assert.equal((await call('/audit',{token:f.token})).status,400,'Public capability cannot authorize private audit');
 const recovered=await call('/audit',{command:auditCommand});assert.equal(recovered.status,200);assert.equal(recovered.body.currentStatus,'unknown');
 assert.deepEqual(recovered.body.bundle,revocations[0].body.bundle);assert.deepEqual(recovered.body.issueCommand,f.command);assert.deepEqual(recovered.body.revokeCommand,f.revokeCommand);
 assert.equal((await verifyCredentialBundle(recovered.body.bundle,f.trust)).historicalStatus,'revoked','Read-only recovery never reactivates');
 const altered=structuredClone(replies[0].body.bundle);altered.pdfBase64=altered.pdfBase64.slice(0,-8)+'AAAAAA==';await assert.rejects(()=>verifyCredentialBundle(altered,f.trust));
 console.log('Credential signed commands, exact PDF, D1/CAS-compatible concurrency, idempotency, terminal revocation, fresh status and privacy passed.');
}
// Small deterministic adapter test; the separate integration runner repeats this suite on actual D1/TLS.
class MemoryDB{
 rows=new Map<string,any>();reads=0;
 prepare(sql:string){let v:any[]=[];const db=this;return {bind(...args:any[]){v=args;return this;},async first(){db.reads++;const field=sql.includes('lookup_hash =')?'lookup_hash':sql.includes('issue_request =')?'issue_request':'credential_id';return structuredClone([...db.rows.values()].find(r=>r[field]===v[0])??null);},async run(){
 if(sql.startsWith('INSERT')){const [id,enrollment,lookup,request,hash,command,result,events]=v;if([...db.rows.values()].some(r=>r.credential_id===id||r.enrollment_id===enrollment||r.lookup_hash===lookup||r.issue_request===request))return {meta:{changes:0}};db.rows.set(id,{credential_id:id,enrollment_id:enrollment,lookup_hash:lookup,revision:1,issue_request:request,issue_hash:hash,issue_command:command,issue_result:result,events,revoke_request:null,revoke_hash:null,revoke_command:null,revoke_result:null});return {meta:{changes:1}};}
 const [request,hash,command,result,events,id,previous]=v,r=db.rows.get(id);if(!r||r.revision!==1||r.events!==previous||[...db.rows.values()].some(x=>x.revoke_request===request))return {meta:{changes:0}};Object.assign(r,{revision:2,revoke_request:request,revoke_hash:hash,revoke_command:command,revoke_result:result,events});return {meta:{changes:1}};
 }};}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const f=await credentialFixture(Math.floor(Date.now()/1000)),db=new MemoryDB();
 const env:CredentialEnv={APP_ORIGIN:'https://app.example',CREDENTIAL_DB:db as any,CREDENTIAL_TRUST:JSON.stringify(f.trust),CREDENTIAL_SIGNING_KEY:credentialBase64(f.keys.issuer.secretKey),CREDENTIAL_SIGNING_KEY_ID:'issuer-synthetic'};
 for(const missing of ['CREDENTIAL_DB','CREDENTIAL_TRUST','CREDENTIAL_SIGNING_KEY','CREDENTIAL_SIGNING_KEY_ID'] as const){const absent={...env,[missing]:undefined};assert.equal((await handleCredentials(new Request('https://api.example/credentials/issue',{method:'POST'}),absent)).status,503);assert.equal(db.reads,0);}
 for(const corrupt of ['invalid',JSON.stringify({...f.trust,keys:[]})])assert.equal((await handleCredentials(new Request('https://api.example/credentials/status'),{...env,CREDENTIAL_TRUST:corrupt})).status,503);
 const call:Call=async(path,value,headers={})=>{const r=await handleCredentials(new Request('https://api.example/credentials'+path,{method:value===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...headers},...(value===undefined?{}:{body:JSON.stringify(value)})}),env);return {status:r.status,body:await r.json(),headers:r.headers};};
 await runCredentialTests(f,call);
 const row=[...db.rows.values()][0],original=structuredClone(row);
 for(const [field,value] of [['enrollment_id','forged-enrollment-0001'],['issue_hash','0'.repeat(64)],['revoke_hash','0'.repeat(64)],['issue_command','{}'],['revoke_command','{}'],['issue_result','{}']] as const){
   Object.assign(row,structuredClone(original),{[field]:value});
   const path=field==='issue_result'?'/issue':'/verify',input=field==='issue_result'?{command:f.command,token:f.token}:{token:f.token,challenge:'x'.repeat(43)};
   assert.ok((await call(path,input)).status>=400,'Tampered '+field+' fails closed');
 }
 Object.assign(row,structuredClone(original));row.events=row.events.replace('"approvedMinutes":60','"approvedMinutes":61');assert.equal((await call('/verify',{token:f.token,challenge:'x'.repeat(43)})).status,400,'Tampered registry fails closed');
 Object.assign(row,structuredClone(original));
 const realNow=Date.now;try{
   Date.now=()=>realNow()+600000;
   assert.equal((await call('/issue',{command:f.command,token:f.token})).status,400,'Old issuance authorization expires');
   const now=Math.floor(Date.now()/1000),audit=signCredentialEnvelope('audit',{requestId:'request-audit-late-000001',credentialId:f.issue.credentialId,iat:now,exp:now+120,audience:f.trust.audience},'issuer-synthetic',f.keys.issuer.secretKey);
   const recovered=await call('/audit',{command:audit});assert.equal(recovered.status,200,'Fresh issuer authorization recovers exact evidence after original command expiry');assert.equal(recovered.body.currentStatus,'unknown');assert.equal((await verifyCredentialBundle(recovered.body.bundle,f.trust)).historicalStatus,'revoked');
 }finally{Date.now=realNow;}
 const before=db.reads;
 const expiredTrust={...f.trust,programs:f.trust.programs.map(p=>({...p,validThrough:f.now-1}))};
 const rejected=await handleCredentials(new Request('https://api.example/credentials/issue',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({command:f.command,token:f.token})}),{...env,CREDENTIAL_TRUST:JSON.stringify(expiredTrust)});
 assert.equal(rejected.status,400);assert.equal(db.reads,before,'Unapproved/expired program denied before DB access');
 console.log('Disabled/malformed trust before storage and tampered registry rejection passed.');
}
