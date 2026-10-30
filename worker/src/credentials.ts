/** Optional credential service. No community login or role grants issuer authority. */
import nacl from 'tweetnacl';
import { createCredentialBundle, verifyCredentialBundle } from '../../src/lib/credentialPdf';
import { credentialBase64, credentialCanonical, credentialHash, credentialObject, credentialUnbase64, parseCredentialTrust, signCredentialEnvelope, validateCredentialIssue, validateCredentialRevocation, validateCredentialAudit, verifyCredentialChain, type CredentialEnvelope, type CredentialEvent, type CredentialTrust } from '../../src/lib/credentialIntegrity';
export interface CredentialEnv {
  /** All absent in production. Provisioning real trust/keys/registry requires separate approval. */
  CREDENTIAL_DB?: D1Database;
  CREDENTIAL_TRUST?: string;
  CREDENTIAL_SIGNING_KEY?: string;
  CREDENTIAL_SIGNING_KEY_ID?: string;
  APP_ORIGIN: string;
}
interface Row { credential_id:string;enrollment_id:string;lookup_hash:string;revision:number;issue_request:string;issue_hash:string;issue_command:string;issue_result:string;revoke_request:string|null;revoke_hash:string|null;revoke_command:string|null;revoke_result:string|null;events:string }
class Failure extends Error { constructor(public status:number,message:string){super(message);} }
const fail=(status:number,message:string):never=>{throw new Failure(status,message);};
const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'; base-uri 'none'",'Content-Type':'application/json; charset=utf-8'};
const token=(v:unknown):v is string=>typeof v==='string'&&/^[A-Za-z0-9_-]{43}$/.test(v);
async function body(req:Request):Promise<Record<string,unknown>> {
  if(req.headers.get('Content-Type')?.split(';')[0].trim()!=='application/json')return fail(415,'JSON required.');
  const reader=req.body?.getReader();if(!reader)return fail(400,'Invalid request.');
  const chunks:Uint8Array[]=[];let length=0;
  for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>64000){await reader.cancel();return fail(413,'Request too large.');}chunks.push(value);}
  const bytes=new Uint8Array(length);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.length;}
  const value:unknown=JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:false}).decode(bytes));
  if(!value||typeof value!=='object'||Array.isArray(value))return fail(400,'Invalid request.');return value as Record<string,unknown>;
}
async function savedResult(row:Row,trust:CredentialTrust,kind:'issue'|'revoke'){
  const result=JSON.parse(kind==='issue'?row.issue_result:row.revoke_result!);
  credentialObject(result,['bundle']);const verified=await verifyCredentialBundle(result.bundle,trust);
  const chain=await checked(row,trust),expected=kind==='issue'?[chain[0]]:chain;
  if(credentialCanonical(verified.bundle.events)!==credentialCanonical(expected))return fail(409,'Stored artifact integrity check failed.');
  return result;
}
async function checked(row:Row,trust:CredentialTrust):Promise<CredentialEnvelope<CredentialEvent>[]> {
  const envelopes:CredentialEnvelope<CredentialEvent>[]=JSON.parse(row.events);
  const events=await verifyCredentialChain(envelopes,trust);
  if(events.length!==row.revision||events[0].credentialId!==row.credential_id||events[0].lookupTokenHash!==row.lookup_hash||events[0].requestId!==row.issue_request||events[0].enrollmentId!==row.enrollment_id||events[0].requestDigest!==row.issue_hash||(events[1]&&(events[1].requestId!==row.revoke_request||events[1].requestDigest!==row.revoke_hash)))return fail(409,'Registry integrity check failed.');
  const issueEnvelope=JSON.parse(row.issue_command),issue=validateCredentialIssue(issueEnvelope,trust,events[0].at),first=events[0];
  if(await credentialHash(issueEnvelope)!==first.requestDigest||issue.credentialId!==first.credentialId||issue.enrollment.payload.id!==first.enrollmentId||issue.enrollment.payload.subject!==first.subject||issue.lookupTokenHash!==first.lookupTokenHash||await credentialHash(issue.enrollment)!==first.enrollmentDigest||await credentialHash(issue.approval)!==first.approvalDigest||issue.approval.payload.evidenceDigest!==first.evidenceDigest||issue.approval.payload.methodDigest!==first.methodDigest||issue.approval.payload.approvedMinutes!==first.approvedMinutes||issue.enrollment.payload.programId!==first.programId||issue.enrollment.payload.programVersion!==first.programVersion)return fail(409,'Registry authorization integrity check failed.');
  if(events[1]){const revokeEnvelope=JSON.parse(row.revoke_command!),revoke=validateCredentialRevocation(revokeEnvelope,trust,events[1].at);if(await credentialHash(revokeEnvelope)!==events[1].requestDigest||revoke.credentialId!==first.credentialId||revoke.expectedRevision!==1)return fail(409,'Registry revocation integrity check failed.');}
  if(events.some(e=>e.at>Math.floor(Date.now()/1000)+30))return fail(409,'Registry event time invalid.');
  return envelopes;
}
/** No caller-defined URLs, JWKS fetches, identity claims, or signing operations. */
export async function handleCredentials(req:Request,env:CredentialEnv):Promise<Response>{
  const respond=(value:unknown,status=200)=>{const h=new Headers(headers);if(req.headers.get('Origin')===env.APP_ORIGIN){h.set('Access-Control-Allow-Origin',env.APP_ORIGIN);h.set('Vary','Origin');h.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');h.set('Access-Control-Allow-Headers','Content-Type');}return new Response(JSON.stringify(value),{status,headers:h});};
  try{
    const path=new URL(req.url).pathname;
    const configured=!!(env.CREDENTIAL_DB&&env.CREDENTIAL_TRUST?.trim()&&env.CREDENTIAL_SIGNING_KEY&&env.CREDENTIAL_SIGNING_KEY_ID);
    if(!configured){if(path==='/credentials/status'&&req.method==='GET')return respond({enabled:false,reason:'Credential issuance is not configured. Approved program, independently verified authorities and separately provisioned issuer are required.'});return respond({error:'Credential service is disabled.'},503);}
    let trust:CredentialTrust,secret:Uint8Array;
    try{trust=parseCredentialTrust(env.CREDENTIAL_TRUST);secret=credentialUnbase64(env.CREDENTIAL_SIGNING_KEY,64);const actual=credentialBase64(nacl.sign.keyPair.fromSecretKey(secret).publicKey);if(!trust.keys.some(k=>k.id===env.CREDENTIAL_SIGNING_KEY_ID&&k.purpose==='issuer'&&k.publicKey===actual))throw Error();}catch{return respond({error:'Credential service configuration is unavailable.'},503);}
    if(req.headers.has('Origin')&&req.headers.get('Origin')!==env.APP_ORIGIN)return respond({error:'Origin not allowed.'},403);
    if(req.method==='OPTIONS')return respond({},200);
    if(path==='/credentials/status'&&req.method==='GET')return respond({enabled:true,issuerId:trust.issuerId});
    if(req.method!=='POST'||!['/credentials/issue','/credentials/revoke','/credentials/verify','/credentials/audit'].includes(path))return respond({error:'Not found.'},404);
    const value=await body(req),now=Math.floor(Date.now()/1000),db=env.CREDENTIAL_DB!;
    const sign=<T>(purpose:'event'|'status',payload:T)=>signCredentialEnvelope(purpose,payload,env.CREDENTIAL_SIGNING_KEY_ID!,secret);
    if(path==='/credentials/audit'){
      credentialObject(value,['command']);const command=validateCredentialAudit(value.command,trust,now);
      const row=await db.prepare('SELECT * FROM credential_registry WHERE credential_id = ?').bind(command.credentialId).first<Row>();
      if(!row)return fail(404,'Credential not found.');
      const result=await savedResult(row,trust,row.revision===2?'revoke':'issue');
      return respond({...result,currentStatus:'unknown',issueCommand:JSON.parse(row.issue_command),revokeCommand:row.revoke_command?JSON.parse(row.revoke_command):null});
    }
    if(path==='/credentials/verify'){
      credentialObject(value,['token','challenge']);if(!token(value.token)||!token(value.challenge))return fail(400,'Invalid verification request.');
      const lookup=await credentialHash(new TextEncoder().encode(value.token));
      const row=await db.prepare('SELECT * FROM credential_registry WHERE lookup_hash = ?').bind(lookup).first<Row>();
      if(!row)return respond({error:'Credential not found.'},404);
      const chain=await checked(row,trust);
      return respond({status:sign('status',{credentialId:row.credential_id,status:chain.length===2?'revoked':'issued',checkedAt:now,expiresAt:now+60,issuerId:trust.issuerId,audience:trust.audience,lookupTokenHash:lookup,challenge:value.challenge})});
    }
    if(path==='/credentials/issue'){
      credentialObject(value,['command','token']);if(!token(value.token))return fail(400,'Invalid issuance request.');
      const command=validateCredentialIssue(value.command,trust,now);
      if(command.lookupTokenHash!==await credentialHash(new TextEncoder().encode(value.token)))return fail(400,'Lookup capability does not match signed request.');
      const hash=await credentialHash(value.command);
      const existing=await db.prepare('SELECT * FROM credential_registry WHERE issue_request = ?').bind(command.requestId).first<Row>();
      if(existing){await checked(existing,trust);if(existing.issue_hash!==hash)return fail(409,'Request identifier already used.');return respond(await savedResult(existing,trust,'issue'));}
      const enrollment=command.enrollment.payload,approval=command.approval.payload;
      const event:CredentialEvent={issuerId:trust.issuerId,audience:trust.audience,credentialId:command.credentialId,revision:1,previousDigest:null,action:'issued',at:now,programId:enrollment.programId,programVersion:enrollment.programVersion,subject:enrollment.subject,enrollmentId:enrollment.id,enrollmentDigest:await credentialHash(command.enrollment),approvalDigest:await credentialHash(command.approval),requestDigest:hash,evidenceDigest:approval.evidenceDigest,methodDigest:approval.methodDigest,approvedMinutes:approval.approvedMinutes,lookupTokenHash:command.lookupTokenHash,requestId:command.requestId};
      const chain=[sign('event',event)],result={bundle:await createCredentialBundle(chain,trust,env.CREDENTIAL_SIGNING_KEY_ID!,secret)};
      const write=await db.prepare('INSERT INTO credential_registry (credential_id,enrollment_id,lookup_hash,revision,issue_request,issue_hash,issue_command,issue_result,events) VALUES (?,?,?,1,?,?,?,?,?) ON CONFLICT DO NOTHING').bind(command.credentialId,enrollment.id,command.lookupTokenHash,command.requestId,hash,credentialCanonical(value.command),credentialCanonical(result),credentialCanonical(chain)).run();
      if(write.meta.changes!==1){const raced=await db.prepare('SELECT * FROM credential_registry WHERE issue_request = ?').bind(command.requestId).first<Row>();if(raced&&raced.issue_hash===hash){return respond(await savedResult(raced,trust,'issue'));}return fail(409,'Enrollment, credential or request already registered.');}
      return respond(result,201);
    }
    credentialObject(value,['command']);const command=validateCredentialRevocation(value.command,trust,now),hash=await credentialHash(value.command);
    const row=await db.prepare('SELECT * FROM credential_registry WHERE credential_id = ?').bind(command.credentialId).first<Row>();
    if(!row)return fail(404,'Credential not found.');const chain=await checked(row,trust);
    if(row.revoke_request===command.requestId){if(row.revoke_hash!==hash)return fail(409,'Request identifier already used.');return respond(await savedResult(row,trust,'revoke'));}
    if(row.revision!==command.expectedRevision||row.revision!==1||command.requestId===row.issue_request)return fail(409,'Credential revision changed or is terminal.');
    const event:CredentialEvent={...chain[0].payload,revision:2,previousDigest:await credentialHash(chain[0]),action:'revoked',at:now,requestId:command.requestId,requestDigest:hash};
    const next=[...chain,sign('event',event)],result={bundle:await createCredentialBundle(next,trust,env.CREDENTIAL_SIGNING_KEY_ID!,secret)};
    const write=await db.prepare('UPDATE credential_registry SET revision=2,revoke_request=?,revoke_hash=?,revoke_command=?,revoke_result=?,events=? WHERE credential_id=? AND revision=1 AND events=? AND NOT EXISTS (SELECT 1 FROM credential_registry WHERE revoke_request=?)').bind(command.requestId,hash,credentialCanonical(value.command),credentialCanonical(result),credentialCanonical(next),command.credentialId,row.events,command.requestId).run();
    if(write.meta.changes!==1){const raced=await db.prepare('SELECT * FROM credential_registry WHERE credential_id = ?').bind(command.credentialId).first<Row>();if(raced&&raced.revoke_request===command.requestId&&raced.revoke_hash===hash)return respond(await savedResult(raced,trust,'revoke'));return fail(409,'Credential revision changed or request already used.');}
    return respond(result);
  }catch(error){return respond({error:error instanceof Failure?error.message:'Credential request could not be validated.'},error instanceof Failure?error.status:400);}
}
