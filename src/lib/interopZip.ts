/** Restricted ZIP exchange reader/writer. No filesystem extraction or network access. */
export const ZIP_LIMITS = { archive: 4 * 1024 * 1024, expanded: 2 * 1024 * 1024, file: 512 * 1024, entries: 128 };
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
export interface ExchangeFile { path: string; text: string }
export function exchangePath(path: string): string {
  if (path.length > 180 || !/^[A-Za-z0-9_-]+(?:[./][A-Za-z0-9_-]+)*\.[A-Za-z0-9]+$/.test(path) || path.split('/').some(p => p === '.' || p === '..') || path.includes('..')) throw Error('Unsafe or unsupported archive path');
  return path;
}
export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const b of bytes) { crc ^= b; for (let i=0;i<8;i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}
export function writeExchangeZip(files: readonly ExchangeFile[]): Uint8Array {
  if (!files.length || files.length > ZIP_LIMITS.entries) throw Error('Archive entry limit exceeded');
  const seen = new Set<string>(); let total = 0, offset = 0;
  const locals: Uint8Array[] = [], central: Uint8Array[] = [];
  for (const file of files) {
    const path = exchangePath(file.path), key = path.toLowerCase();
    if (seen.has(key)) throw Error('Duplicate archive path'); seen.add(key);
    const name=encoder.encode(path), bytes=encoder.encode(file.text); total += bytes.length;
    if (bytes.length > ZIP_LIMITS.file || total > ZIP_LIMITS.expanded) throw Error('Archive expansion limit exceeded');
    const crc=crc32(bytes), local=new Uint8Array(30+name.length+bytes.length), l=new DataView(local.buffer);
    l.setUint32(0,0x04034b50,true); l.setUint16(4,20,true); l.setUint16(6,0x800,true); l.setUint32(14,crc,true); l.setUint32(18,bytes.length,true); l.setUint32(22,bytes.length,true); l.setUint16(26,name.length,true); local.set(name,30); local.set(bytes,30+name.length);
    const entry=new Uint8Array(46+name.length), c=new DataView(entry.buffer); c.setUint32(0,0x02014b50,true); c.setUint16(4,20,true); c.setUint16(6,20,true); c.setUint16(8,0x800,true); c.setUint32(16,crc,true); c.setUint32(20,bytes.length,true); c.setUint32(24,bytes.length,true); c.setUint16(28,name.length,true); c.setUint32(42,offset,true); entry.set(name,46);
    locals.push(local); central.push(entry); offset += local.length;
  }
  const size=central.reduce((sum,b)=>sum+b.length,0), out=new Uint8Array(offset+size+22); let p=0;
  for(const b of [...locals,...central]) { out.set(b,p); p+=b.length; }
  const end=new DataView(out.buffer,p,22); end.setUint32(0,0x06054b50,true); end.setUint16(8,files.length,true); end.setUint16(10,files.length,true); end.setUint32(12,size,true); end.setUint32(16,offset,true);
  return out;
}
export async function readExchangeZip(input: Uint8Array): Promise<ExchangeFile[]> {
  // Snapshot input before awaits, preventing external mutation during inflate.
  const bytes=new Uint8Array(input);
  if(bytes.length<22 || bytes.length>ZIP_LIMITS.archive) throw Error('Invalid archive size');
  const v=new DataView(bytes.buffer), u16=(p:number)=>v.getUint16(p,true), u32=(p:number)=>v.getUint32(p,true);
  let end=-1; for(let p=bytes.length-22;p>=Math.max(0,bytes.length-65557);p--) if(u32(p)===0x06054b50 && p+22+u16(p+20)===bytes.length) { end=p; break; }
  if(end<0 || u16(end+4) || u16(end+6) || u16(end+8)!==u16(end+10)) throw Error('Unsupported multi-volume or invalid ZIP');
  const count=u16(end+10), centralSize=u32(end+12), centralStart=u32(end+16);
  if(!count || count>ZIP_LIMITS.entries || centralStart+centralSize!==end) throw Error('Invalid archive directory');
  const files:ExchangeFile[]=[], seen=new Set<string>(); let p=centralStart, total=0, expectedLocal=0;
  for(let i=0;i<count;i++) {
    if(p+46>end || u32(p)!==0x02014b50) throw Error('Invalid archive directory entry');
    const flags=u16(p+8), method=u16(p+10), crc=u32(p+16), compressed=u32(p+20), expanded=u32(p+24), nl=u16(p+28), xl=u16(p+30), cl=u16(p+32), local=u32(p+42);
    if(flags & ~0x800 || ![0,8].includes(method) || u16(p+34) || xl || cl || p+46+nl>end || local!==expectedLocal || local+30>centralStart) throw Error('Unsupported ZIP flags, extras, ordering or compression');
    const path=exchangePath(decoder.decode(bytes.subarray(p+46,p+46+nl))), key=path.toLowerCase();
    if(seen.has(key)) throw Error('Duplicate archive path'); seen.add(key);
    if((u32(p+38)>>>16 & 0xf000)===0xa000) throw Error('Archive symlinks are forbidden');
    total += expanded;
    if(expanded>ZIP_LIMITS.file || total>ZIP_LIMITS.expanded || compressed>ZIP_LIMITS.archive || expanded>Math.max(1024,compressed*100)) throw Error('Archive expansion limit exceeded');
    if(u32(local)!==0x04034b50 || u16(local+6)!==flags || u16(local+8)!==method || u32(local+14)!==crc || u32(local+18)!==compressed || u32(local+22)!==expanded || u16(local+26)!==nl || u16(local+28)!==0) throw Error('ZIP local/directory mismatch');
    const start=local+30+nl, stop=start+compressed;
    if(stop>centralStart || decoder.decode(bytes.subarray(local+30,start))!==path) throw Error('Invalid ZIP content range');
    let data=bytes.slice(start,stop);
    if(method===8) {
      const stream=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      const reader=stream.getReader(); const chunks:Uint8Array[]=[]; let size=0;
      try { while(true) { const next=await reader.read(); if(next.done) break; size+=next.value.length; if(size>expanded || size>ZIP_LIMITS.file) throw Error('ZIP expansion exceeds declaration'); chunks.push(next.value); } }
      catch(e) { await reader.cancel().catch(()=>{}); throw e; }
      data=new Uint8Array(size); let pos=0; for(const chunk of chunks) {data.set(chunk,pos);pos+=chunk.length;}
    }
    if(data.length!==expanded || crc32(data)!==crc) throw Error('ZIP size or checksum mismatch');
    files.push({path,text:decoder.decode(data)}); expectedLocal=stop; p+=46+nl;
  }
  if(p!==end || expectedLocal!==centralStart) throw Error('Unaccounted ZIP bytes');
  return files;
}
