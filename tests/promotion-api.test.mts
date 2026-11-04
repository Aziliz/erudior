import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const bundle=resolve('tests/.promotion-api-bundle.mjs');
await build({entryPoints:['src/lib/promotionApi.ts'],outfile:bundle,bundle:true,platform:'node',format:'esm',packages:'external',define:{'import.meta.env.VITE_COMMUNITY_API':'"https://community.example.test"'}});
const {promotionApi,promotionRequest,PromotionApiError}=await import(pathToFileURL(bundle).href);
const oldFetch=globalThis.fetch;const calls:{url:string;options:RequestInit}[]=[];
let response:()=>Promise<Response>=async()=>new Response(JSON.stringify({ok:true}),{status:200});
globalThis.fetch=async(url,options)=>{calls.push({url:String(url),options:options??{}});return response();};
try{
 const signal=new AbortController().signal;
 await promotionApi.session(signal);await promotionApi.me(signal);await promotionApi.sources('cursor value',signal);await promotionApi.source('course/id',3,signal);await promotionApi.list('candidate/page',signal);await promotionApi.read('a/b',signal);
 const preview={source:{communityId:'source-id',publishedVersion:3,packageSha256:'source-digest'},digest:'candidate-digest',candidate:{private:'must not be submitted'}};
 await promotionApi.prepare('same-request-id',preview,signal);
 const body=JSON.parse(calls.at(-1)!.options.body as string);assert.deepEqual(body,{requestId:'same-request-id',communityId:'source-id',publishedVersion:3,sourceDigest:'source-digest',digest:'candidate-digest'});assert(!('candidate'in body),'browser cannot author imported candidate content');
 const envelope={id:'candidate/id',revision:7,digest:'exact-digest'};
 for(const [decision,route]of[['approved-for-handoff','review'],['rejected','reject'],['revoked','revoke']]){const input={decision,notes:'retained'};await promotionApi.decide('decision-id',envelope,input,signal);assert(calls.at(-1)!.url.endsWith(`/candidates/candidate%2Fid/${route}`));assert.deepEqual(JSON.parse(calls.at(-1)!.options.body as string),{requestId:'decision-id',expectedRevision:7,digest:'exact-digest',review:input});}
 await promotionApi.export('candidate/id',signal);await promotionApi.logout(signal);
 for(const {url,options}of calls){assert(url.startsWith('https://community.example.test/'));assert.equal(options.cache,'no-store');assert.equal(options.credentials,'include');assert.equal(options.signal,signal);assert(!Object.keys(options.headers??{}).some(k=>/authorization|session|fingerprint/i.test(k)),'session comparison is never an authority header');}
 assert(calls.some(c=>c.url.includes('cursor=cursor%20value')));assert(calls.some(c=>c.url.includes('/sources/course%2Fid?version=3')));
 response=async()=>{throw new TypeError('offline');};await assert.rejects(promotionRequest('/admin/promotions/session'),e=>e instanceof PromotionApiError&&e.status===0);
 response=async()=>new Response('{"error":"Source was withdrawn."}',{status:409});await assert.rejects(promotionRequest('/admin/promotions/session'),e=>e instanceof PromotionApiError&&e.status===409&&e.message==='Source was withdrawn.');
 response=async()=>new Response('{"error":"Temporary outage"}',{status:503});await assert.rejects(promotionRequest('/admin/promotions/session'),e=>e instanceof PromotionApiError&&e.status===503);
 response=async()=>new Response('broken',{status:200});await assert.rejects(promotionRequest('/admin/promotions/session'),e=>e instanceof PromotionApiError&&e.status===0);
 const abort=new DOMException('Aborted','AbortError');response=async()=>{throw abort;};await assert.rejects(promotionRequest('/admin/promotions/session'),e=>e===abort);
 console.log('Promotion API: cookies only, no-store responses, URL encoding, exact version/digest/CAS payloads, no uploaded content authority, decision routing, unknown-outcome and abort handling passed.');
}finally{globalThis.fetch=oldFetch;await unlink(bundle);}
