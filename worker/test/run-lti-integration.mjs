// Real isolated D1 + Chromium cross-site HTTPS OIDC form_post. No remote bindings/credentials.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { createServer as netServer } from 'node:net';
import { createServer as httpsServer } from 'node:https';
import { generateKeyPairSync, sign } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const worker=fileURLToPath(new URL('../',import.meta.url));
const root=path.dirname(worker.replace(/\/$/,''));
const wrangler=path.join(worker,'node_modules/wrangler/bin/wrangler.js');
const temporary=await mkdtemp(path.join(os.tmpdir(),'erudior-lti-test-'));
const children=new Set();
const env=Object.fromEntries(['PATH','Path','SystemRoot','WINDIR','LANG','TMP','TEMP','TMPDIR'].filter(k=>process.env[k]).map(k=>[k,process.env[k]]));
Object.assign(env,{HOME:temporary,USERPROFILE:temporary,XDG_CONFIG_HOME:temporary,CI:'true',WRANGLER_SEND_METRICS:'false',NO_COLOR:'1'});
function launch(command,args){const child=spawn(command,args,{cwd:temporary,env,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']});children.add(child);child.log='';for(const stream of [child.stdout,child.stderr])stream.on('data',d=>{child.log=(child.log+d.toString()).slice(-100000);});child.done=new Promise(resolve=>{child.once('error',e=>{child.failure=e;resolve(-1);});child.once('exit',c=>{child.finished=true;resolve(c??-1);});});return child;}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function stop(child){if(!child.pid)return;try{process.kill(-child.pid,'SIGTERM');}catch(e){if(e.code!=='ESRCH')throw e;}await Promise.race([child.done,delay(1500)]);try{process.kill(-child.pid,'SIGKILL');}catch(e){if(e.code!=='ESRCH')throw e;}children.delete(child);}
async function bounded(child,ms,label){let timer;try{const c=await Promise.race([child.done,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(label+' timed out')),ms);})]);if(c!==0)throw Error(label+' failed: '+(child.failure??child.log));}finally{clearTimeout(timer);await stop(child);}}
async function freePort(){const s=netServer();await new Promise((r,j)=>{s.once('error',j);s.listen(0,'127.0.0.1',r);});const p=s.address().port;await new Promise(r=>s.close(r));return p;}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const C='https://purl.imsglobal.org/spec/lti/claim/';
let browser,platform,server,lastPost;
async function cleanup(){await browser?.close();if(platform)await new Promise(r=>platform.close(r));await Promise.all([...children].map(stop));await rm(temporary,{recursive:true,force:true});}
const interrupt=()=>{void cleanup().finally(()=>process.exit(1));};process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
try{
  const apiPort=await freePort(), platformPort=await freePort();
  const api=`https://127.0.0.1:${apiPort}`,issuer=`https://localhost:${platformPort}`,target=issuer+'/resource';
  const cert=path.join(temporary,'cert.pem'),certKey=path.join(temporary,'key.pem');
  await bounded(launch('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',certKey,'-out',cert,'-days','1','-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost,IP:127.0.0.1']),30000,'Ephemeral loopback certificate');
  const pair=generateKeyPairSync('rsa',{modulusLength:2048});
  const jwk={...pair.publicKey.export({format:'jwk'}),kid:'ephemeral-test',alg:'RS256',use:'sig'};
  const registration={issuer,clientId:'synthetic-client',deploymentId:'synthetic-deployment',authorizationEndpoint:issuer+'/authorize',targets:[target],keys:[jwk]};
  function token(params,patch={}){const now=Math.floor(Date.now()/1000);const claims={iss:issuer,aud:registration.clientId,sub:'synthetic-private-person',iat:now,exp:now+120,nonce:params.get('nonce'),[C+'message_type']:'LtiResourceLinkRequest',[C+'version']:'1.3.0',[C+'deployment_id']:registration.deploymentId,[C+'target_link_uri']:target,[C+'resource_link']:{id:'synthetic-resource'},[C+'roles']:['http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor'],email:'synthetic-private@example.test',...patch};const b64=v=>Buffer.from(JSON.stringify(v)).toString('base64url');const unsigned=b64({alg:'RS256',kid:jwk.kid})+'.'+b64(claims);return unsigned+'.'+sign('RSA-SHA256',Buffer.from(unsigned),pair.privateKey).toString('base64url');}
  const login=api+'/lti/login?'+new URLSearchParams({iss:issuer,client_id:registration.clientId,lti_deployment_id:registration.deploymentId,target_link_uri:target,login_hint:'synthetic-hint'});
  platform=httpsServer({key:await readFile(certKey),cert:await readFile(cert)},(req,res)=>{
    const url=new URL(req.url,issuer);
    res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','text/html; charset=utf-8');
    if(url.pathname==='/resource'){res.end('<!doctype html><html lang="en"><title>Isolated resource</title><main><h1>Verified resource opened</h1><p>No account, grade or privilege was created.</p></main></html>');return;}
    if(url.pathname==='/authorize'){
      assert.equal(url.searchParams.get('redirect_uri'),api+'/lti/launch');assert.equal(url.searchParams.get('response_mode'),'form_post');
      lastPost={state:url.searchParams.get('state'),id_token:token(url.searchParams)};
      res.end('<!doctype html><html lang="en"><title>Synthetic platform</title><form method="post" action="'+escape(api+'/lti/launch')+'">'+Object.entries(lastPost).map(([k,v])=>'<input type="hidden" name="'+k+'" value="'+escape(v)+'">').join('')+'</form><script>document.forms[0].submit()</script></html>');return;
    }
    res.end('<!doctype html><html lang="en"><title>Synthetic platform</title><main><h1>Synthetic platform</h1><a href="'+escape(login)+'">Launch synthetic resource</a></main></html>');
  });
  await new Promise((r,j)=>{platform.once('error',j);platform.listen(platformPort,'localhost',r);});
  const config=path.join(temporary,'wrangler.toml'),state=path.join(temporary,'state');
  await writeFile(config,`name = "erudior-isolated-lti-test"
main = ${JSON.stringify(path.join(worker,'src/index.ts'))}
compatibility_date = "2025-02-01"
workers_dev = false
[[migrations]]
tag = "v1"
new_sqlite_classes = ["LiveRoom"]
[vars]
APP_ORIGIN = ${JSON.stringify(issuer)}
API_ORIGIN = ${JSON.stringify(api)}
ALLOWED_ORIGINS = ""
ADMIN_EMAILS = ""
GOOGLE_CLIENT_ID = ""
GITHUB_CLIENT_ID = ""
LTI_REGISTRATIONS = ${JSON.stringify(JSON.stringify([registration]))}
[[durable_objects.bindings]]
name = "LIVE"
class_name = "LiveRoom"
[[d1_databases]]
binding = "DB"
database_name = "erudior-isolated-lti-test"
database_id = "00000000-0000-0000-0000-000000000000"
migrations_dir = ${JSON.stringify(path.join(worker,'migrations'))}
[[r2_buckets]]
binding = "FILES"
bucket_name = "erudior-isolated-lti-test"
`);
  const common=['--config',config,'--local','--persist-to',state];
  await bounded(launch(process.execPath,[wrangler,'d1','migrations','apply','erudior-isolated-lti-test',...common]),90000,'Isolated LTI D1 migrations');
  server=launch(process.execPath,[wrangler,'dev',...common,'--ip','127.0.0.1','--port',String(apiPort),'--inspector-port','0','--local-protocol','https','--https-key-path',certKey,'--https-cert-path',cert]);
  const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright');const chromium=pw.chromium||pw.default.chromium;
  browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
  // Invalid certificate acceptance is confined to this ephemeral, loopback-only test context.
  const context=await browser.newContext({ignoreHTTPSErrors:true});
  await context.route('**/*',route=>{const u=new URL(route.request().url());return ['127.0.0.1','localhost'].includes(u.hostname)?route.continue():route.abort();});
  const deadline=Date.now()+90000;
  for(;;){if(server.finished||server.failure)throw Error('Isolated worker exited: '+server.log);try{if((await context.request.get(api+'/me',{timeout:1000})).status()===200)break;}catch{}if(Date.now()>deadline)throw Error('Isolated LTI worker did not start: '+server.log);await delay(250);}
  const page=await context.newPage();await page.goto(issuer);await page.getByRole('link',{name:'Launch synthetic resource'}).click();await page.getByRole('heading',{name:'Verified resource opened'}).waitFor();assert.equal(page.url(),target);
  assert.ok(!(await context.cookies()).some(c=>c.name.startsWith('__Host-erudior_lti_')),'One-use browser binding is cleared');
  const out=process.env.BROWSER_ARTIFACTS||path.join(root,'test-results','lti-browser');await mkdir(out,{recursive:true});await page.screenshot({path:path.join(out,'cross-site-resource.png'),fullPage:true});
  const replay=await context.request.post(api+'/lti/launch',{form:lastPost,maxRedirects:0});assert.equal(replay.status(),400);
  async function begin(){const response=await context.request.get(login,{maxRedirects:0});assert.equal(response.status(),302,await response.text());return new URL(response.headers().location).searchParams;}
  {const params=await begin(),form={state:params.get('state'),id_token:token(params)};const responses=await Promise.all([context.request.post(api+'/lti/launch',{form,maxRedirects:0}),context.request.post(api+'/lti/launch',{form,maxRedirects:0})]);assert.deepEqual(responses.map(r=>r.status()).sort(),[303,400],'Real D1 atomically consumes concurrent callbacks');}
  {const params=await begin();const r=await context.request.post(api+'/lti/launch',{form:{state:params.get('state'),id_token:token(params,{[C+'target_link_uri']:'https://evil.example'})},maxRedirects:0});assert.equal(r.status(),400);}
  {const params=await begin(),form={state:params.get('state'),id_token:token(params)};const fresh=await browser.newContext({ignoreHTTPSErrors:true});const r=await fresh.request.post(api+'/lti/launch',{form,maxRedirects:0});assert.equal(r.status(),400,'A different browser cannot redeem state');await fresh.close();assert.equal((await context.request.post(api+'/lti/launch',{form,maxRedirects:0})).status(),303);}
  // LTI's isolated cross-origin form endpoint must not weaken community mutation protection.
  const unrelated=await context.request.post(api+'/drafts',{headers:{Origin:'https://untrusted.example','Content-Type':'application/json'},data:'{}'});assert.equal(unrelated.status(),403);
  assert.ok(!server.log.includes('synthetic-private-person')&&!server.log.includes('synthetic-private@example.test'),'Private launch claims not logged');
  console.log('Real D1 atomic replay, Chromium cross-site HTTPS form_post, browser binding, privacy and unchanged community CSRF passed.');
}catch(error){if(server)process.stderr.write(server.log);console.error(error);process.exitCode=1;}
finally{await cleanup();process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);}
