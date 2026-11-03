import { COURSE_PUBLIC_KEYS } from '../../src/lib/courseKeys';
import { sha256Hex, verifySignature } from '../../src/lib/courseSign';
import { courseFromCanonicalAuthoring, migrateLegacyCourseToCanonical, runtimeCourseFromCanonicalAuthoring } from '../../src/lib/canonicalAuthoring';
import type { StudioInventory } from '../../src/lib/adminStudio';

/** Existing public course distribution origin and signing trust, never request-supplied. */
export const STUDIO_OFFICIAL_ORIGIN = 'https://courses.erudior.com/v1/';
export const OFFICIAL_LIMITS = { catalogBytes: 2_000_000, packageBytes: 20_000_000, courses: 1000, timeoutMs: 15000 } as const;
export interface OfficialStudioEntry { id: string; title: string; revision: number; file: string; bytes: number; sha256: string }
export interface OfficialStudioManifest { digest: string; entries: OfficialStudioEntry[] }
const object = (v:unknown):v is Record<string,unknown> => !!v && typeof v==='object' && !Array.isArray(v);
function fail(message:string):never { throw Error(message); }
const utf8 = (bytes:Uint8Array) => new TextDecoder('utf-8',{fatal:true,ignoreBOM:false}).decode(bytes);

/** Dependencies are injectable only by code/tests, never by HTTP/env configuration.
 * Freshness is optimistic across the independently published CDN and D1: callers
 * MUST assertCurrent immediately before committing or releasing private results.
 * This rejects an observed intervening publication; it is not an atomic CDN lock.
 * A network failure never falls back to an older manifest or browser cache.
 */
export function createOfficialStudioLoader(deps: { fetch?: typeof fetch; keys?: readonly string[] } = {}) {
  const request = deps.fetch ?? globalThis.fetch;
  const keys = [...(deps.keys ?? COURSE_PUBLIC_KEYS)];
  async function bytes(file:string, limit:number):Promise<Uint8Array> {
    if (!/^[A-Za-z0-9_.-]+$/.test(file) || file.includes('..')) fail('Invalid official source path.');
    const target=new URL(file,STUDIO_OFFICIAL_ORIGIN);
    // Signed catalogs are public; no cookies, Authorization, or caller URL is forwarded.
    target.searchParams.set('studioFresh',crypto.randomUUID());
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),OFFICIAL_LIMITS.timeoutMs);
    try {
      const response=await request(target.toString(),{redirect:'error',headers:{'Cache-Control':'no-store'},signal:controller.signal});
      if(response.status!==200 || response.redirected) fail('Official source is unavailable or redirected.');
      if(response.url) { const actual=new URL(response.url); if(actual.origin!==target.origin || actual.pathname!==target.pathname)fail('Official source response escaped its trusted path.'); }
      const declared=response.headers.get('content-length');
      if(declared!==null && (!/^\d+$/.test(declared) || Number(declared)>limit))fail('Official source exceeds its byte limit.');
      if(!response.body) fail('Official source body is missing.');
      const reader=response.body.getReader(),chunks:Uint8Array[]=[];let total=0;
      try {
        while(true) { const part=await reader.read();if(part.done)break;total+=part.value.byteLength;if(total>limit){await reader.cancel();fail('Official source exceeds its byte limit.');}chunks.push(part.value); }
      } finally {reader.releaseLock();}
      const result=new Uint8Array(total);let at=0;for(const chunk of chunks){result.set(chunk,at);at+=chunk.length;}return result;
    } finally {clearTimeout(timer);}
  }
  async function manifest():Promise<OfficialStudioManifest> {
    const [raw,sig]=await Promise.all([bytes('catalog.json',OFFICIAL_LIMITS.catalogBytes),bytes('catalog.json.sig',256)]);
    if(!verifySignature(raw,utf8(sig).trim(),keys))fail('Official source catalog signature is invalid.');
    const value:unknown=JSON.parse(utf8(raw));
    if(!object(value)||value.format!=='examiner-catalog'||value.version!==1||!Array.isArray(value.courses)||value.courses.length>OFFICIAL_LIMITS.courses)fail('Invalid official source catalog.');
    const ids=new Set<string>(),files=new Set<string>();
    const entries=(value.courses as unknown[]).map((item):OfficialStudioEntry=>{
      if(!object(item)||typeof item.id!=='string'||!/^[A-Za-z0-9_-]{1,100}$/.test(item.id)||typeof item.title!=='string'||!item.title.trim()||item.title.length>500||!Number.isSafeInteger(item.revision)||Number(item.revision)<1||typeof item.file!=='string'||item.file!==`${item.id}.r${item.revision}.json`||!Number.isSafeInteger(item.bytes)||Number(item.bytes)<1||Number(item.bytes)>OFFICIAL_LIMITS.packageBytes||typeof item.sha256!=='string'||!/^[a-f0-9]{64}$/.test(item.sha256))fail('Invalid official course identity or integrity metadata.');
      const e=item as unknown as OfficialStudioEntry;
      if(ids.has(e.id)||files.has(e.file))fail('Duplicate official course identity.');ids.add(e.id);files.add(e.file);
      return {id:e.id,title:e.title,revision:e.revision,file:e.file,bytes:e.bytes,sha256:e.sha256};
    });
    return {digest:await sha256Hex(raw),entries};
  }
  async function load(current:OfficialStudioManifest,id:string):Promise<StudioInventory> {
    const entry=current.entries.find(e=>e.id===id);if(!entry)fail('Official source is no longer listed.');
    const raw=await bytes(entry.file,entry.bytes);
    if(raw.length!==entry.bytes||await sha256Hex(raw)!==entry.sha256)fail('Official source package integrity mismatch.');
    const parsed:unknown=JSON.parse(utf8(raw));
    // Pure strict canonical ingestion avoids browser state and permissive legacy
    // normalization. Documented legacy shorthand is expanded by its validator.
    const options={strict:false,maxBytes:OFFICIAL_LIMITS.packageBytes,mode:'source' as const};
    const payload=object(parsed)&&parsed.format==='erudior-canonical-authoring' ? parsed : migrateLegacyCourseToCanonical(parsed,options).payload;
    const source=courseFromCanonicalAuthoring(payload,options);
    if(source.id!==entry.id||source.revision!==entry.revision)fail('Official source package identity mismatch.');
    const course=runtimeCourseFromCanonicalAuthoring(payload,{id:entry.id,revision:entry.revision},options);
    return {source:{courseId:entry.id,revision:entry.revision,digest:entry.sha256},course};
  }
  async function assertCurrent(current:OfficialStudioManifest):Promise<void> {
    if((await manifest()).digest!==current.digest)fail('Official source catalog changed. Reload and review the current source.');
  }
  return {manifest,load,assertCurrent};
}
export const officialStudioSources=createOfficialStudioLoader();
