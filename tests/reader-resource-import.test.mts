import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { parseReaderImport, readerImportFileProblem, appendReaderImport, READER_IMPORT_BYTES } from '../src/lib/readerImport.ts';
import type { ReaderText } from '../src/lib/readerContent.ts';
const bytes = (text: string) => new TextEncoder().encode(text);
const originalBody = '# Original\r\n\r\nA **reading** passage.\r\n![remote](https://never.test/image.png)\r\n';
const imported = parseReaderImport('Folder/Reading.MD', bytes(originalBody));
assert.equal(imported.title, 'Reading'); assert.equal(imported.body, originalBody);
assert.equal(parseReaderImport('bom.txt', new Uint8Array([239,187,191,...bytes('content')])).body, 'content');
assert.throws(() => parseReaderImport('a.txt', new Uint8Array([0xff])), /UTF-8/);
assert.throws(() => parseReaderImport('a.txt', bytes('abc\u0000')), /control/);
assert.throws(() => parseReaderImport('a.pdf', bytes('content')), /not supported/);
assert.throws(() => parseReaderImport('a.html', bytes('<p>x</p>')), /not supported/);
assert.throws(() => parseReaderImport('a.txt', bytes('  \r\n')), /empty/);
assert.match(readerImportFileProblem('a.md', READER_IMPORT_BYTES + 1)!, /bytes/);
const original: ReaderText[] = [{ id:'existing', title:'Existing', source:'Original attribution', sections:[{id:'part0',title:'Original',body:'Unchanged'}] }];
const before = structuredClone(original); let id = 0;
const next = appendReaderImport(original, imported, 'Imported', 'Source permission noted', null, () => `${++id}`);
assert.deepEqual(original, before); assert.equal(next[0], original[0]); assert.equal(next[1].source, 'Source permission noted'); assert.equal(next[1].sections[0].body, originalBody);
const appended = appendReaderImport(original, imported, 'Append', 'Ignored attribution', 'existing', () => `${++id}`);
assert.equal(appended[0].source, original[0].source); assert.equal(appended[0].sections[0], original[0].sections[0]); assert.equal(appended[0].sections[1].body, originalBody);
assert.throws(() => appendReaderImport(original, imported, '', '', null, ()=>'x'), /title/);
assert.throws(() => appendReaderImport(original, imported, 'a', '', 'missing', ()=>'x'), /no longer exists/);
const full = Array.from({length:100},(_,i)=>({...original[0],id:`text${i}`}));
assert.throws(() => appendReaderImport(full, imported, 'a', '', null, ()=>'x'), /at most 100/);

const dom = new JSDOM('<!doctype html><div id="root"></div>', { url:'https://example.test' });
Object.assign(globalThis,{ window:dom.window, document:dom.window.document, HTMLElement:dom.window.HTMLElement, FileReader:dom.window.FileReader, IS_REACT_ACT_ENVIRONMENT:true });
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const { createElement, useState, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const { default: ReaderLibraryEditor } = await import('../src/components/ReaderLibraryEditor.tsx');
let state = structuredClone(original), external!: (value:ReaderText[])=>void, changes = 0;
function Harness() { const [texts,setTexts]=useState(state); state=texts; external=setTexts; return createElement(ReaderLibraryEditor,{texts,questions:[],onChange:value=>{changes++;setTexts(value);}}); }
const root = createRoot(document.getElementById('root')!);
const button=(name:string)=>{const el=[...document.querySelectorAll('button')].find(b=>b.textContent===name);assert.ok(el,name);return el;};
const field=(name:string)=>{const el=[...document.querySelectorAll('label')].find(l=>l.querySelector('span')?.textContent===name)?.querySelector('input,textarea');assert.ok(el,name);return el as HTMLInputElement;};
const click=async(name:string)=>act(async()=>button(name).click());
async function fill(name:string,value:string){const el=field(name);await act(async()=>{const proto=el.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(el,value);el.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});}
async function choose(name:string,content:string){const el=field('Choose reading text file');Object.defineProperty(el,'files',{configurable:true,value:[new dom.window.File([content],name,{type:'text/plain'})]});await act(async()=>{el.dispatchEvent(new dom.window.Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,25));});}
await act(async()=>root.render(createElement(Harness)));
await choose('example.pdf','not converted'); assert.match(document.body.textContent!,/not supported/);assert.equal(changes,0);
await choose('example.md',originalBody);assert.equal(changes,0,'preview never changes library');
assert.equal(document.querySelector('[aria-label="Imported reading source preview"]')!.textContent, originalBody);
assert.equal(document.querySelector('img'),null,'preview never loads remote content');
await click('Cancel reading import'); assert.equal(document.querySelector('[aria-label="Reading import preview"]'),null);assert.equal(changes,0);
await choose('example.md',originalBody);await fill('Imported text or section title','Imported title');await fill('Imported text source and rights attribution','Original teacher text');await click('Add as new reading text');
assert.equal(changes,1); assert.equal(state.length,2);assert.equal(state[1].title,'Imported title');assert.equal(state[1].source,'Original teacher text');assert.equal(state[1].sections[0].body,originalBody);assert.deepEqual(state[0],original[0]);
await click('Preview section source');assert.equal(document.querySelector('[aria-label="Reading section source preview"]')!.textContent,originalBody);
await click('Edit text: Existing');await choose('extra.txt','Additional body');await click('Append as new section');assert.equal(state[0].sections.length,2);assert.equal(state[0].sections[1].body,'Additional body');assert.equal(state[0].sections[0].id,'part0');
await choose('stale.txt','Must not be appended');await act(async()=>external(state.map(t=>t.id==='existing'?{...t,title:'Changed externally'}:t)));const count=changes;await click('Append as new section');assert.equal(changes,count);assert.match(document.body.textContent!,/changed.*Choose the file again/);
await click('Cancel reading import');await click('Edit section: extra');await click('Remove section');await fill('Section body','Edited after removal confirmation');await click('Confirm reading removal');assert.equal(state[0].sections.length,2);assert.match(document.body.textContent!,/Review it before deleting/);
await click('Remove section');await click('Keep reading content');assert.equal(state[0].sections.length,2);
// Late file completion after selection change or cancellation cannot apply or resurrect a preview.
let release!:()=>void;
class DelayedReader {
  result:ArrayBuffer|null=null; onload:(()=>void)|null=null; onerror:(()=>void)|null=null; onabort:(()=>void)|null=null;
  readAsArrayBuffer(){release=()=>{this.result=bytes('Late file').buffer;this.onload?.();};}
  abort(){this.onabort?.();}
}
Object.assign(globalThis,{FileReader:DelayedReader});
await choose('late.txt','not read');await click('Edit text: Imported title');await act(async()=>release());assert.equal(document.querySelector('[aria-label="Reading import preview"]'),null);
await choose('late.txt','not read');await click('Cancel reading import');await act(async()=>release());assert.equal(document.querySelector('[aria-label="Reading import preview"]'),null);
await choose('late.txt','not read');await act(async()=>root.unmount());await act(async()=>release());
dom.window.close();console.log('reader resource imports: bounded UTF8, inert preview, append-only identities, stale/cancel/late-read and deletion guards pass');
