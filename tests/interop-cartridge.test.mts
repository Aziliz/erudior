import assert from 'node:assert/strict';
import { deflateRawSync } from 'node:zlib';
import { exportCartridge,importCartridge,reexportCartridge,CC_NS, type CartridgeContent } from '../src/lib/interopCartridge.ts';
import { readExchangeZip,writeExchangeZip,crc32,ZIP_LIMITS } from '../src/lib/interopZip.ts';
const sample:CartridgeContent={identifier:'test-cartridge',title:'Synthetic fixture & safety',items:[{identifier:'root',title:'Unit',children:[{identifier:'one',title:'Lesson',resourceId:'lesson-1',children:[]},{identifier:'two',title:'Reference',resourceId:'ref-1',children:[]}]}],resources:[{identifier:'lesson-1',kind:'text',title:'Lesson',text:'Synthetic text <not markup> &\nsecond line.'},{identifier:'ref-1',kind:'link',title:'Reference',url:'https://example.test/resource?a=1&b=2'}]};
const bytes=exportCartridge(sample), preview=await importCartridge(bytes);
assert.equal(preview.identifier,sample.identifier);assert.equal(preview.title,sample.title);assert.deepEqual(preview.items,sample.items);assert.deepEqual(preview.resources,sample.resources);
assert.deepEqual(await readExchangeZip(reexportCartridge(preview)),await readExchangeZip(bytes));
const whitespaceText='  leading\r\n\ttext\ntrailing  ';const whitespace=await importCartridge(exportCartridge({...sample,resources:[{...sample.resources[0],text:whitespaceText} as any,sample.resources[1]]}));assert.equal((whitespace.resources[0] as any).text,whitespaceText);
async function changed(file:string, change:(s:string)=>string) {const fs=await readExchangeZip(bytes);const target=fs.find(f=>f.path===file)!;target.text=change(target.text);return writeExchangeZip(fs);}
for(const bad of ['../evil.xml','a/../b.xml','/absolute.xml','C:/evil.xml','a\\b.xml','a%2fb.xml','a//b.xml']) assert.throws(()=>writeExchangeZip([{path:bad,text:'x'}]),/path/);
assert.throws(()=>writeExchangeZip([{path:'A.txt',text:'x'},{path:'a.txt',text:'x'}]),/Duplicate/);
assert.throws(()=>writeExchangeZip([{path:'x.txt',text:'x'.repeat(ZIP_LIMITS.file+1)}]),/limit/);
await assert.rejects(importCartridge(new Uint8Array([1,2,3])),/size/);
const corrupt=new Uint8Array(bytes);corrupt[65]^=1;await assert.rejects(importCartridge(corrupt),/checksum|mismatch/);
const encrypted=new Uint8Array(bytes);new DataView(encrypted.buffer).setUint16(6,1,true);await assert.rejects(importCartridge(encrypted),/mismatch/);
const badType=await changed('imsmanifest.xml',s=>s.replace('type="webcontent"','type="imsqti_xmlv1p2/imscc_xmlv1p3/assessment"'));await assert.rejects(importCartridge(badType),/Unsupported Common Cartridge resource/);
await assert.rejects(importCartridge(await changed('imsmanifest.xml',s=>s.replace(CC_NS,CC_NS.replace('v1p3','v1p2')))),/1.3/);
await assert.rejects(importCartridge(await changed('imsmanifest.xml',s=>s.replace('identifierref="lesson-1"','identifierref="missing"'))),/Dangling/);
await assert.rejects(importCartridge(await changed('imsmanifest.xml',s=>s.replace('<resources>','<resources><resource identifier="other" type="webcontent" href="absent.html"><file href="absent.html"/></resource>'))),/Missing/);
for(const injection of ['<script>alert(1)</script>','<img src="https://example.test/tracker"/>','<iframe/>','<p onclick="x()">x</p>','<p style="color:red">x</p>']) {
 await assert.rejects(importCartridge(await changed('resources/r0.html',s=>s.replace('<pre>',injection+'<pre>'))),/Unsupported or active/);
}
await assert.rejects(importCartridge(await changed('resources/r0.html',s=>s.replace('<html','<!DOCTYPE html [<!ENTITY xx SYSTEM "file:///etc/passwd">]><html'))),/Document types/);
await assert.rejects(importCartridge(await changed('resources/r1.xml',s=>s.replace('https://example.test/resource?a=1&amp;b=2','javascript:alert(1)'))),/HTTPS/);
await assert.rejects(importCartridge(await changed('resources/r1.xml',s=>s.replace('https://example.test/','https://user:pass@example.test/'))),/HTTPS/);
const unreferenced=await readExchangeZip(bytes);unreferenced.push({path:'unreferenced.txt',text:'extra'});await assert.rejects(importCartridge(writeExchangeZip(unreferenced)),/Unreferenced/);
const mixed=await importCartridge(await changed('resources/r0.html',s=>s.replace(/<pre>[\s\S]*<\/pre>/,'<p>Before <strong>middle</strong> after.</p>')));assert.equal((mixed.resources[0] as {text:string}).text,'Before middle after.');
assert.throws(()=>exportCartridge({...sample,resources:[{...sample.resources[0],text:'x\u0000'}] as any}),/XML|disallowed|invalid/i);
assert.throws(()=>exportCartridge({...sample,items:[{identifier:'x',title:'x',children:[],resourceId:'missing'}]}),/Dangling/);
assert.throws(()=>exportCartridge({...sample,resources:[{identifier:'x',kind:'link',title:'x',url:'file:///etc/passwd'}]}),/HTTPS/);
// Deflate ZIP fixture (independent compressor), retaining strict central/local sizes and CRC.
function deflatedZip(path:string,text:string):Uint8Array {
 const enc=new TextEncoder(), name=enc.encode(path), raw=enc.encode(text), compressed=deflateRawSync(raw), local=new Uint8Array(30+name.length+compressed.length), l=new DataView(local.buffer);
 l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);l.setUint16(8,8,true);l.setUint32(14,crc32(raw),true);l.setUint32(18,compressed.length,true);l.setUint32(22,raw.length,true);l.setUint16(26,name.length,true);local.set(name,30);local.set(compressed,30+name.length);
 const central=new Uint8Array(46+name.length), c=new DataView(central.buffer);c.setUint32(0,0x02014b50,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(10,8,true);c.setUint32(16,crc32(raw),true);c.setUint32(20,compressed.length,true);c.setUint32(24,raw.length,true);c.setUint16(28,name.length,true);central.set(name,46);
 const out=new Uint8Array(local.length+central.length+22);out.set(local);out.set(central,local.length);const e=new DataView(out.buffer,local.length+central.length);e.setUint32(0,0x06054b50,true);e.setUint16(8,1,true);e.setUint16(10,1,true);e.setUint32(12,central.length,true);e.setUint32(16,local.length,true);return out;
}
assert.deepEqual(await readExchangeZip(deflatedZip('plain.txt','Independent deflated UTF-8: café')), [{path:'plain.txt',text:'Independent deflated UTF-8: café'}]);
await assert.rejects(readExchangeZip(deflatedZip('bomb.txt','A'.repeat(100000))),/expansion/);
for (const duplicate of ['test-cartridge','org','org_root','root']) {
 assert.throws(()=>exportCartridge({...sample,resources:[{...sample.resources[0],identifier:duplicate},sample.resources[1]],items:[{identifier:'root',title:'Unit',children:[]}]}),/Duplicate document-wide/);
}
await assert.rejects(importCartridge(await changed('imsmanifest.xml',s=>s.replace('identifier="org"','identifier="lesson-1"'))),/Duplicate document-wide/);
await assert.rejects(importCartridge(await changed('imsmanifest.xml',s=>s.replace('identifier="one"','identifier="lesson-1"'))),/Duplicate document-wide/);
assert.throws(()=>exportCartridge({...sample,identifier:'org'}),/Duplicate document-wide/);
await assert.rejects(importCartridge(await changed('imsmanifest.xml',s=>s.replace('<item identifier="org_root">','<item identifier="org_root"><title>Not permitted here</title>'))),/organization|item/);
for(const extra of [ {...sample,score:1}, {...sample,resources:[{...sample.resources[0],grading:'ignored'},sample.resources[1]]}, {...sample,items:[{...sample.items[0],prerequisites:['ignored']}]} ]) assert.throws(()=>exportCartridge(extra as any),/Unsupported export/);
console.log('Common Cartridge static profile and bounded ZIP tests passed');
