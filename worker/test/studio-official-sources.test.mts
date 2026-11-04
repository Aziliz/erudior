import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { emptyCourse, serializeCourse } from '../../src/lib/course';
import { b64, newKeyPair, signBytes, sha256Hex } from '../../src/lib/courseSign';
import { createOfficialStudioLoader, OFFICIAL_LIMITS, STUDIO_OFFICIAL_ORIGIN } from '../src/studioOfficialSources';
const keys=newKeyPair(),encode=(v:unknown)=>new TextEncoder().encode(typeof v==='string'?v:JSON.stringify(v));
const c=emptyCourse('Synthetic official source');c.id='synthetic';c.revision=1;c.modules=[{id:'m',title:'Module'}];c.lessons=[{id:'l',module:'m',title:'Lesson',body:'Observe paper.'}];
const pkg=encode(serializeCourse(c));
const entry={id:c.id,title:c.title,revision:1,file:'synthetic.r1.json',bytes:pkg.length,sha256:await sha256Hex(pkg)};
let catalog:any={format:'examiner-catalog',version:1,courses:[entry]};let raw=encode(catalog),packageBytes=pkg;
let mode='good',calls:string[]=[];
const fake=async (input:RequestInfo|URL,init?:RequestInit)=>{
 const u=new URL(String(input));calls.push(u.pathname);
 assert.equal(u.origin,new URL(STUDIO_OFFICIAL_ORIGIN).origin);assert.equal(init?.redirect,'error');assert.equal(init?.credentials,undefined);assert.deepEqual(init?.headers,{'Cache-Control':'no-store'});assert(init?.signal);
 if(mode==='unavailable')return new Response('',{status:503});
 if(mode==='redirect')return new Response('',{status:302,headers:{location:'https://example.invalid/source'}});
 let bytes=u.pathname.endsWith('.sig')?encode(signBytes(raw,b64.decode(keys.secretKey))):u.pathname.endsWith('catalog.json')?raw:packageBytes;
 if(mode==='bad-signature'&&u.pathname.endsWith('.sig'))bytes=encode('bad');
 if(mode==='oversized-header')return new Response(bytes,{headers:{'Content-Length':String(OFFICIAL_LIMITS.packageBytes+1)}});
 if(mode==='oversized-stream'&&u.pathname.endsWith('.sig'))return new Response(new Uint8Array(257));
 return new Response(bytes);
};
const loader=createOfficialStudioLoader({fetch:fake as typeof fetch,keys:[keys.publicKey]});
const baseline=await loader.manifest();const inventory=await loader.load(baseline,'synthetic');assert.equal(inventory.source.digest,entry.sha256);assert.equal(inventory.course.lessons[0].body,'Observe paper.');await loader.assertCurrent(baseline);
for(mode of ['unavailable','redirect','bad-signature','oversized-header','oversized-stream'])await assert.rejects(()=>loader.manifest(),mode);
mode='good';await assert.rejects(()=>createOfficialStudioLoader({fetch:fake as typeof fetch}).manifest(),'test key is never production-trusted');
for(const change of [
 (d:any)=>{d.version=2;},(d:any)=>{d.courses.push({...entry});},(d:any)=>{d.courses[0].file='../secret';},(d:any)=>{d.courses[0].file='https://evil.invalid/x.json';},(d:any)=>{d.courses[0].revision=0;},(d:any)=>{d.courses[0].sha256='bad';},(d:any)=>{d.courses[0].bytes=0;},(d:any)=>{d.courses[0].title='';},
]) {catalog={format:'examiner-catalog',version:1,courses:[{...entry}]};change(catalog);raw=encode(catalog);await assert.rejects(()=>loader.manifest());}
catalog={format:'examiner-catalog',version:1,courses:[{...entry}]};raw=encode(catalog);
packageBytes=encode('tampered');await assert.rejects(()=>loader.load(baseline,'synthetic'));packageBytes=pkg;await assert.rejects(()=>loader.load(baseline,'absent'));
raw=new Uint8Array([0xc3,0x28]);await assert.rejects(()=>loader.manifest(),'signed malformed UTF-8 rejected');
raw=encode({...catalog,courses:[]});await assert.rejects(()=>loader.assertCurrent(baseline),'source deletion invalidates freshness');
raw=encode({...catalog,published:'changed'});await assert.rejects(()=>loader.assertCurrent(baseline),'any signed manifest change rejected');
mode='unavailable';await assert.rejects(()=>loader.assertCurrent(baseline),'no stale fallback');mode='good';
// Signed package identity mismatch is rejected even if integrity bytes match.
const mismatched=encode(serializeCourse({...c,id:'another'}));packageBytes=mismatched;raw=encode({...catalog,courses:[{...entry,bytes:mismatched.length,sha256:await sha256Hex(mismatched)}]});
await assert.rejects(async()=>loader.load(await loader.manifest(),'synthetic'));
// Even a correctly signed/hash-matching malformed package fails UTF-8/schema checks.
for(const malformed of [new Uint8Array([0xc3,0x28]),encode({format:'examiner-course',version:1,id:'synthetic',revision:1,title:'Bad',lessons:[{id:'x',module:'missing',body:'text'}]})]) {
 packageBytes=malformed;raw=encode({...catalog,courses:[{...entry,bytes:malformed.length,sha256:await sha256Hex(malformed)}]});
 await assert.rejects(async()=>loader.load(await loader.manifest(),'synthetic'));
}
// Validate real repository signed-source candidates through the same canonical path,
// with synthetic signatures only; this publishes nothing and modifies no course.
const existing=JSON.parse(await readFile(new URL('../../samples/catalog.json',import.meta.url),'utf8'));
const knownUnsupported:Record<string,RegExp>={'math-geometry':/cards\[234\]\.(?:E|F\)):/,'math-linear-algebra':/cards\[96\]\.4\) code:/,'science-biology':/cards\[328\]\.C4 and CAM plants:/};
let checked=0; const unsupported: {id:string;error:string}[]=[];
for(const e of existing){
 packageBytes=new Uint8Array(await readFile(new URL('../../samples/'+e.file,import.meta.url)));
 raw=encode({format:'examiner-catalog',version:1,courses:[{id:e.id,title:e.title,revision:e.revision,file:`${e.id}.r${e.revision}.json`,bytes:packageBytes.length,sha256:await sha256Hex(packageBytes)}]});
 try { const result=await loader.load(await loader.manifest(),e.id);assert.equal(result.course.id,e.id);checked++; } catch(error) {assert(knownUnsupported[e.id]?.test(String(error)),`Unexpected official source rejection ${e.id}: ${error}`);unsupported.push({id:e.id,error:String(error)});}
}
console.log(JSON.stringify({checked,unsupported},null,2));
console.log(`Studio official sources: signed manifests, bounded streams, redirect rejection, UTF-8/schema/identity/hash checks, fail-closed optimistic freshness, no dev trust and ${checked} current repository course migrations passed.`);
