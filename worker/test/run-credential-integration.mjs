// Real isolated D1 + certificate-verified loopback HTTPS. No remote bindings/credentials.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { createServer as netServer } from 'node:net';
import { request as httpsRequest } from 'node:https';
import { credentialFixture } from '../../tests/fixtures/credentialIntegrity.ts';
import { credentialBase64 } from '../../src/lib/credentialIntegrity.ts';
import { runCredentialTests } from './credentials.test.mts';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const worker=fileURLToPath(new URL('../',import.meta.url));
const root=path.dirname(worker.replace(/\/$/,''));
const wrangler=path.join(worker,'node_modules/wrangler/bin/wrangler.js');
const temporary=await mkdtemp(path.join(os.tmpdir(),'erudior-credential-test-'));
const children=new Set();
const env=Object.fromEntries(['PATH','Path','SystemRoot','WINDIR','LANG','TMP','TEMP','TMPDIR'].filter(k=>process.env[k]).map(k=>[k,process.env[k]]));
Object.assign(env,{HOME:temporary,USERPROFILE:temporary,XDG_CONFIG_HOME:temporary,CI:'true',WRANGLER_SEND_METRICS:'false',NO_COLOR:'1'});
function launch(command,args){const child=spawn(command,args,{cwd:temporary,env,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']});children.add(child);child.log='';for(const stream of [child.stdout,child.stderr])stream.on('data',d=>{child.log=(child.log+d.toString()).slice(-100000);});child.done=new Promise(resolve=>{child.once('error',e=>{child.failure=e;resolve(-1);});child.once('exit',c=>{child.finished=true;resolve(c??-1);});});return child;}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function stop(child){if(!child.pid)return;try{process.kill(-child.pid,'SIGTERM');}catch(e){if(e.code!=='ESRCH')throw e;}await Promise.race([child.done,delay(1500)]);try{process.kill(-child.pid,'SIGKILL');}catch(e){if(e.code!=='ESRCH')throw e;}children.delete(child);}
async function bounded(child,ms,label){let timer;try{const c=await Promise.race([child.done,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(label+' timed out')),ms);})]);if(c!==0)throw Error(label+' failed: '+(child.failure??child.log));}finally{clearTimeout(timer);await stop(child);}}
async function freePort(){const s=netServer();await new Promise((r,j)=>{s.once('error',j);s.listen(0,'127.0.0.1',r);});const p=s.address().port;await new Promise(r=>s.close(r));return p;}
let server;
async function cleanup(){await Promise.all([...children].map(stop));await rm(temporary,{recursive:true,force:true});}
const interrupt=()=>{void cleanup().finally(()=>process.exit(1));};process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
try{
 const apiPort=await freePort(),api=`https://127.0.0.1:${apiPort}`;
 const cert=path.join(temporary,'cert.pem'),certKey=path.join(temporary,'key.pem');
 await bounded(launch('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',certKey,'-out',cert,'-days','1','-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost,IP:127.0.0.1']),30000,'Ephemeral loopback certificate');
 let fixture;
 const config=path.join(temporary,'wrangler.toml'),state=path.join(temporary,'state');
 // No repository config, .dev.vars, production bindings, secrets or authenticated Wrangler environment.
 const configText=(enabled)=>`name = "erudior-isolated-credential-test"
main = ${JSON.stringify(path.join(worker,'src/index.ts'))}
compatibility_date = "2025-02-01"
workers_dev = false
[[migrations]]
tag = "v1"
new_sqlite_classes = ["LiveRoom"]
[vars]
APP_ORIGIN = "https://app.example"
API_ORIGIN = ${JSON.stringify(api)}
ALLOWED_ORIGINS = ""
ADMIN_EMAILS = ""
GOOGLE_CLIENT_ID = ""
GITHUB_CLIENT_ID = ""
${enabled?`CREDENTIAL_TRUST = ${JSON.stringify(JSON.stringify(fixture.trust))}\nCREDENTIAL_SIGNING_KEY_ID = "issuer-synthetic"\nCREDENTIAL_SIGNING_KEY = ${JSON.stringify(credentialBase64(fixture.keys.issuer.secretKey))}`:''}
[[durable_objects.bindings]]
name = "LIVE"
class_name = "LiveRoom"
[[d1_databases]]
binding = "DB"
database_name = "erudior-isolated-community-test"
database_id = "00000000-0000-0000-0000-000000000001"
migrations_dir = ${JSON.stringify(path.join(worker,'migrations'))}
[[d1_databases]]
binding = "CREDENTIAL_DB"
database_name = "erudior-isolated-credential-test"
database_id = "00000000-0000-0000-0000-000000000002"
migrations_dir = ${JSON.stringify(path.join(worker,'credential-migrations'))}
[[r2_buckets]]
binding = "FILES"
bucket_name = "erudior-isolated-credential-test"
`;
 await writeFile(config,configText(false),{mode:0o600});
 const common=['--config',config,'--local','--persist-to',state];
 for(const db of ['erudior-isolated-community-test','erudior-isolated-credential-test'])await bounded(launch(process.execPath,[wrangler,'d1','migrations','apply',db,...common]),90000,'Isolated D1 migrations');
 const ca=await readFile(cert);
 const request=(method,url,options={})=>new Promise((resolve,reject)=>{
   if(new URL(url).origin!==api)return reject(Error('Non-loopback request denied'));
   const data=options.form?new URLSearchParams(options.form).toString():options.data;
   const headers={...options.headers,...(options.form?{'Content-Type':'application/x-www-form-urlencoded'}:{})};
   const req=httpsRequest(url,{method,ca,headers,rejectUnauthorized:true},res=>{
     let size=0;const chunks=[];
     res.on('data',chunk=>{size+=chunk.length;if(size>1000000){req.destroy(Error('Oversized response'));return;}chunks.push(chunk);});
     res.on('end',()=>{const text=Buffer.concat(chunks).toString('utf8');resolve({status:()=>res.statusCode,json:async()=>JSON.parse(text),headers:()=>Object.fromEntries(Object.entries(res.headers).map(([k,v])=>[k,Array.isArray(v)?v.join(', '):v]))});});
   });req.setTimeout(options.timeout||10000,()=>req.destroy(Error('Request timeout')));req.on('error',reject);if(data!==undefined)req.write(typeof data==='string'?data:JSON.stringify(data));req.end();
 });
 const context={request:{get:(url,options)=>request('GET',url,options),post:(url,options)=>request('POST',url,options)}};
 const start=async()=>{server=launch(process.execPath,[wrangler,'dev',...common,'--ip','127.0.0.1','--port',String(apiPort),'--inspector-port','0','--local-protocol','https','--https-key-path',certKey,'--https-cert-path',cert]);const deadline=Date.now()+90000;for(;;){if(server.finished||server.failure)throw Error('Isolated worker exited');try{if((await context.request.get(api+'/credentials/status',{timeout:1000})).status()===200)break;}catch{}if(Date.now()>deadline)throw Error('Isolated worker startup timed out');await delay(250);}};
 await start();
 assert.equal((await (await context.request.get(api+'/credentials/status')).json()).enabled,false);
 assert.equal((await context.request.post(api+'/credentials/issue',{data:{}})).status(),503,'Actual worker stays disabled with no trust/signing configuration');
 await stop(server);fixture=await credentialFixture(Math.floor(Date.now()/1000));await writeFile(config,configText(true),{mode:0o600});await start();
 const call=async(p,value,headers={})=>{const r=value===undefined?await context.request.get(api+'/credentials'+p,{headers}):await context.request.post(api+'/credentials'+p,{headers:{'Content-Type':'application/json',...headers},data:JSON.stringify(value)});return {status:r.status(),body:await r.json(),headers:new Headers(r.headers())};};
 await runCredentialTests(fixture,call);
 // Verify community authentication and CSRF remain isolated from credential commands.
 assert.equal((await context.request.post(api+'/drafts',{headers:{Origin:'https://evil.example','Content-Type':'application/json'},data:'{}'})).status(),403);
 assert.equal((await context.request.get(api+'/me')).status(),200);
 assert.equal((await context.request.post(api+'/lti/launch',{form:{state:'no-registration'}})).status(),404);
 for(const privateValue of [fixture.enrollment.subject,fixture.enrollment.id,fixture.approval.evidenceDigest,fixture.token,credentialBase64(fixture.keys.issuer.secretKey)])assert.ok(!server.log.includes(privateValue),'Private evidence/capability/key not logged');
 console.log('Actual isolated D1 concurrent issuance/revocation, exact signed PDF, disabled worker, TLS, request privacy and unchanged community/LTI boundaries passed.');
}catch(error){console.error(error);process.exitCode=1;}
finally{await cleanup();process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);}
