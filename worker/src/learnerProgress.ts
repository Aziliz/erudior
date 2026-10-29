/** Optional encrypted app practice progress. Community/credential identities are never accepted. */
import {
  learnerCanonical, learnerHash, learnerObject, learnerId, learnerBindingEqual,
  parseLearnerTrust, validateLearnerGrant, parseLearnerEnvelope,
  type LearnerBinding,
} from '../../src/lib/learnerPrivacy';

export interface LearnerProgressEnv {
  /** Separate public-key identity trust and storage. Absent in production. */
  LEARNER_PROGRESS_DB?: D1Database;
  LEARNER_PROGRESS_TRUST?: string;
  APP_ORIGIN: string;
}
interface Row {
  subject_hash: string; revision: number; state: 'active'|'erased'|'expired';
  envelope: string|null; envelope_hash: string|null; expires_at: number|null;
  last_request: string|null; last_hash: string|null;
}
interface ReceiptRow { body_hash: string; receipt: string }
class Failure extends Error { constructor(public status:number,message:string){super(message);} }
const fail=(status:number,message:string):never=>{throw new Failure(status,message);};
const headers = {
  'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store',
  'Referrer-Policy':'no-referrer', 'X-Content-Type-Options':'nosniff',
  'Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
};
const MAX_BODY=140000;
/** Bounded private retry history; erasure remains available when the budget is full. */
const MAX_RECEIPTS=10000;
async function body(req:Request):Promise<Record<string,unknown>> {
  if(req.headers.get('Content-Type')?.split(';')[0].trim()!=='application/json')return fail(415,'JSON required.');
  const reader=req.body?.getReader();if(!reader)return fail(400,'Invalid request.');
  const chunks:Uint8Array[]=[];let length=0;
  for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;
    if(length>MAX_BODY){await reader.cancel();return fail(413,'Request too large.');}chunks.push(value);}
  const bytes=new Uint8Array(length);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.length;}
  const value:unknown=JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:false}).decode(bytes));
  if(!value||typeof value!=='object'||Array.isArray(value))return fail(400,'Invalid request.');
  return value as Record<string,unknown>;
}
function readReceipt(raw:string,current:Row|null){const value:unknown=JSON.parse(raw);learnerObject(value,['state','revision','expiresAt']);if(value.state!=='active'||!Number.isSafeInteger(value.revision)||(value.revision as number)<1||(value.revision as number)>(current?.revision??0)||!Number.isSafeInteger(value.expiresAt)||(value.expiresAt as number)<1)return fail(409,'Stored receipt failed validation.');return value;}
const summary=(row:Row)=>({state:row.state,revision:row.revision,expiresAt:row.expires_at});
const get=(db:D1Database,key:string)=>db.prepare('SELECT * FROM learner_progress WHERE subject_hash = ?').bind(key).first<Row>();
async function expire(db:D1Database,key:string,now:number) {
  await db.batch([
    db.prepare("UPDATE learner_progress SET state='expired',revision=revision+1,envelope=NULL,envelope_hash=NULL,expires_at=NULL,last_request=NULL,last_hash=NULL WHERE subject_hash=? AND state='active' AND expires_at<=?").bind(key,now),
    db.prepare("DELETE FROM learner_progress_receipts WHERE subject_hash=? AND EXISTS (SELECT 1 FROM learner_progress WHERE subject_hash=? AND state!='active')").bind(key,key),
  ]);
}
/** Authorized deployment schedulers should call this; no production cron/binding is provisioned. */
export async function sweepLearnerProgress(db:D1Database,now=Math.floor(Date.now()/1000)):Promise<void> {
  if(!Number.isSafeInteger(now)||now<0)throw Error('Invalid retention clock.');
  await db.batch([
    db.prepare("UPDATE learner_progress SET state='expired',revision=revision+1,envelope=NULL,envelope_hash=NULL,expires_at=NULL,last_request=NULL,last_hash=NULL WHERE state='active' AND expires_at<=?").bind(now),
    db.prepare("DELETE FROM learner_progress_receipts WHERE EXISTS (SELECT 1 FROM learner_progress WHERE learner_progress.subject_hash=learner_progress_receipts.subject_hash AND state!='active')"),
  ]);
}

export async function handleLearnerProgress(req:Request,env:LearnerProgressEnv):Promise<Response> {
  const respond=(value:unknown,status=200)=>{const h=new Headers(headers);
    if(req.headers.get('Origin')===env.APP_ORIGIN){h.set('Access-Control-Allow-Origin',env.APP_ORIGIN);h.set('Vary','Origin');h.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');h.set('Access-Control-Allow-Headers','Content-Type, Authorization');}
    return new Response(JSON.stringify(value),{status,headers:h});};
  try {
    const path=new URL(req.url).pathname;
    if(!env.LEARNER_PROGRESS_DB||!env.LEARNER_PROGRESS_TRUST?.trim()) {
      if(path==='/learner-progress/status'&&req.method==='GET')return respond({enabled:false,reason:'Optional app progress requires separately approved identity, guardian-consent, encryption-recovery and retention configuration. Local practice remains available without an account.'});
      return respond({error:'Server progress is disabled.'},503);
    }
    let trust;try{trust=parseLearnerTrust(env.LEARNER_PROGRESS_TRUST);}catch{return respond({error:'Server progress configuration is unavailable.'},503);}
    if(req.headers.has('Origin')&&req.headers.get('Origin')!==env.APP_ORIGIN)return respond({error:'Origin not allowed.'},403);
    if(req.method==='OPTIONS')return respond({},200);
    if(path==='/learner-progress/status'&&req.method==='GET')return respond({enabled:true,retentionDays:{min:1,max:30}});
    if(req.method!=='POST'||!['/learner-progress/read','/learner-progress/write','/learner-progress/erase'].includes(path))return respond({error:'Not found.'},404);
    const operation=path.slice(path.lastIndexOf('/')+1) as 'read'|'write'|'erase';
    const authorization=req.headers.get('Authorization')??'';
    if(!authorization.startsWith('Bearer ')||authorization.length>16000)return respond({error:'Fresh app identity authorization is required.'},401);
    let grant;try{grant=validateLearnerGrant(JSON.parse(authorization.slice(7)),trust,Math.floor(Date.now()/1000),operation);}catch{return respond({error:'App identity authorization is invalid or expired.'},401);}
    const binding:LearnerBinding={namespace:grant.namespace,account:grant.account,profile:grant.profile,schemaVersion:1};
    const key=await learnerHash(binding),value=await body(req),now=Math.floor(Date.now()/1000),db=env.LEARNER_PROGRESS_DB;
    // Strict parsing and authorization occur before any storage write, including expiry cleanup.
    let envelope:ReturnType<typeof parseLearnerEnvelope>|undefined;
    if(operation==='read')learnerObject(value,[]);
    else {
      learnerObject(value,operation==='write'?['requestId','expectedRevision','retentionDays','envelope']:['requestId','expectedRevision']);
      learnerId(value.requestId);
      if(!Number.isSafeInteger(value.expectedRevision)||(value.expectedRevision as number)<0)return fail(400,'Invalid expected revision.');
      if(operation==='write') {
        if(!Number.isSafeInteger(value.retentionDays)||(value.retentionDays as number)<1||(value.retentionDays as number)>30)return fail(400,'Retention must be 1 through 30 days.');
        envelope=parseLearnerEnvelope(value.envelope);
        if(!learnerBindingEqual(envelope.binding,binding))return fail(403,'Encrypted progress belongs to a different profile.');
      }
    }
    if(grant.expiresAt<=now)return fail(401,'App identity authorization expired before the request was complete.');
    await expire(db,key,now);
    let row=await get(db,key);
    if(operation==='read') {
      if(!row)return respond({state:'empty',revision:0,expiresAt:null});
      if(row.state!=='active')return respond(summary(row));
      const parsed=parseLearnerEnvelope(JSON.parse(row.envelope!));
      if(!learnerBindingEqual(parsed.binding,binding)||await learnerHash(parsed)!==row.envelope_hash)return fail(409,'Stored encrypted progress failed integrity validation.');
      return respond({...summary(row),envelope:parsed});
    }
    const requestHash=await learnerHash(value.requestId),hash=await learnerHash({operation,...value});
    if(row&&row.state!=='active') {
      if(operation==='erase'&&row.state==='erased'&&row.last_request===requestHash&&row.last_hash===hash)return respond(summary(row));
      return respond({error:'This profile was erased or expired; old grants and offline snapshots cannot recreate it.',...summary(row)},410);
    }
    const prior=await db.prepare('SELECT body_hash,receipt FROM learner_progress_receipts WHERE subject_hash=? AND request_hash=?').bind(key,requestHash).first<ReceiptRow>();
    if(prior){if(prior.body_hash!==hash)return fail(409,'Request identifier already used.');return respond(readReceipt(prior.receipt,row));}
    if((row?.revision??0)!==value.expectedRevision)return respond({error:'Server revision changed. Read and explicitly resolve the conflict.',revision:row?.revision??0},409);
    if(operation==='write'){const count=await db.prepare('SELECT COUNT(*) AS total FROM learner_progress_receipts WHERE subject_hash=?').bind(key).first<{total:number}>();if((count?.total??0)>=MAX_RECEIPTS)return fail(409,'The encrypted profile retry-history limit was reached. Export or erase remains available.');}
    const revision=(row?.revision??0)+1,state=operation==='write'?'active':'erased',expires=operation==='write'?now+(value.retentionDays as number)*86400:null;
    const receipt={state,revision,expiresAt:expires};
    const encoded=envelope?learnerCanonical(envelope):null,envelopeHash=envelope?await learnerHash(envelope):null;
    const mutation=row
      ? db.prepare('UPDATE learner_progress SET revision=?,state=?,envelope=?,envelope_hash=?,expires_at=?,last_request=?,last_hash=? WHERE subject_hash=? AND revision=? AND state=\'active\' AND expires_at>? AND (?=1 OR (SELECT COUNT(*) FROM learner_progress_receipts WHERE subject_hash=?)<?)').bind(revision,state,encoded,envelopeHash,expires,requestHash,hash,key,value.expectedRevision,now,operation==='erase'?1:0,key,MAX_RECEIPTS)
      : db.prepare('INSERT INTO learner_progress(subject_hash,revision,state,envelope,envelope_hash,expires_at,last_request,last_hash) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT DO NOTHING').bind(key,revision,state,encoded,envelopeHash,expires,requestHash,hash);
    const receiptStatement=db.prepare('INSERT INTO learner_progress_receipts(subject_hash,request_hash,body_hash,receipt) SELECT ?,?,?,? WHERE EXISTS (SELECT 1 FROM learner_progress WHERE subject_hash=? AND last_request=? AND last_hash=?) ON CONFLICT DO NOTHING').bind(key,requestHash,hash,learnerCanonical(receipt),key,requestHash,hash);
    if(grant.expiresAt<=Math.floor(Date.now()/1000))return fail(401,'App identity authorization expired before storage.');
    await db.batch([mutation,receiptStatement,...(operation==='erase'?[db.prepare("DELETE FROM learner_progress_receipts WHERE subject_hash=? AND EXISTS (SELECT 1 FROM learner_progress WHERE subject_hash=? AND state!='active')").bind(key,key)]:[])]);
    row=await get(db,key);
    if(!row||row.last_request!==requestHash||row.last_hash!==hash) {
      const raced=await db.prepare('SELECT body_hash,receipt FROM learner_progress_receipts WHERE subject_hash=? AND request_hash=?').bind(key,requestHash).first<ReceiptRow>();
      if(raced&&raced.body_hash===hash&&row?.state==='active')return respond(readReceipt(raced.receipt,row));
      return respond({error:'Server revision changed. Read and explicitly resolve the conflict.',revision:row?.revision??0},409);
    }
    return respond(summary(row),value.expectedRevision===0&&operation==='write'?201:200);
  } catch(error) {
    return respond({error:error instanceof Failure?error.message:'Progress request could not be validated.'},error instanceof Failure?error.status:400);
  }
}
