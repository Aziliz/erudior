import assert from 'node:assert/strict';
import { readFile, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import ts from 'typescript';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
const source = await readFile(path.join(root, 'src/pages/ParentArea.tsx'), 'utf8');
const parsed = ts.createSourceFile('ParentArea.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function tabLabels(name: string) {
  let initializer: ts.Expression | undefined;
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(parsed) === name) initializer = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(parsed); assert(initializer, `${name} exists in actual ParentArea`);
  const labels: string[] = [];
  function collect(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(parsed) === 'label' && ts.isStringLiteral(node.initializer)) labels.push(node.initializer.text);
    ts.forEachChild(node, collect);
  }
  collect(initializer); return labels;
}
const bundle = path.join(root, 'tests/.audience-pages-bundle.mjs');
await build({entryPoints:[path.join(root,'src/pages/AudiencePage.tsx')],outfile:bundle,bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},define:{'import.meta.env':'{}'}});
try {
  const {default:AudiencePage} = await import(pathToFileURL(bundle).href);
  const kinds = ['parents','teachers','live-rooms'] as const;
  const imageSources = new Set<string>();
  for (const kind of kinds) {
    const html = renderToStaticMarkup(React.createElement(AudiencePage,{kind}));
    const dom = new JSDOM(html); const doc = dom.window.document;
    assert.equal(doc.querySelectorAll('h1').length,1,`${kind}: one page heading`);
    const details = [...doc.querySelectorAll('.audience-tab-guide details')];
    assert(details.length >= (kind === 'live-rooms' ? 4 : 20),`${kind}: full walkthrough`);
    const labels = details.map(d => d.querySelector('summary')?.textContent?.trim()).filter(Boolean);
    assert.equal(new Set(labels).size,labels.length,`${kind}: unique summary labels`);
    if(kind !== 'live-rooms') {
      const expected = tabLabels(kind === 'parents' ? 'TABS' : 'CLASS_TABS');
      for(const label of expected) assert(labels.some(s => s === label || s?.endsWith(label)), `${kind}: actual tab ${label} documented`);
      assert.equal(labels.length,expected.length,`${kind}: no fabricated or missing tabs`);
    }
    const text = doc.body.textContent ?? '';
    assert.match(text,/browser/i,`${kind}: truthful capture environment`);
    assert.match(text,/synthetic|sample|fictional/i,`${kind}: sample records disclosed`);
    assert.match(text,/installer|installed|release/i,`${kind}: delivery caveat`);
    assert.equal(doc.querySelectorAll('form,input,textarea,select').length,0,`${kind}: no public account form`);
    for(const a of doc.querySelectorAll('a')) assert(!/^(?:javascript|data):/i.test(a.getAttribute('href')??''),'safe links');
    for(const image of doc.querySelectorAll('img')) {
      const src = image.getAttribute('src') ?? ''; const alt = image.getAttribute('alt') ?? '';
      assert(src.startsWith('/shots/'),`${kind}: local actual capture`);
      assert(alt.trim().length > 12,`${kind}: descriptive alternate text`);
      assert.equal(image.getAttribute('loading'),'lazy');
      assert(Number(image.getAttribute('width')) > 0 && Number(image.getAttribute('height')) > 0,'intrinsic dimensions');
      imageSources.add(src);
      const file = path.join(root,'public',src); const info = await stat(file);
      assert(info.isFile() && info.size > 100,`nonempty screenshot ${src}`);
      const bytes = await readFile(file);
      if(src.endsWith('.webp')) assert.equal(bytes.subarray(8,12).toString(),'WEBP',`real WebP ${src}`);
      if(src.endsWith('.png')) assert.equal(bytes.subarray(1,4).toString(),'PNG',`real PNG ${src}`);
    }
    for(const d of details) assert(d.querySelector('img'),`${kind}: each documented tab has a real capture`);
    dom.window.close();
  }
  assert(imageSources.size >= 30,'screenshots are distinct, not the same placeholder for all tabs');
  const manifest = JSON.parse(await readFile(path.join(root,'public/shots/audience/manifest.json'),'utf8'));
  assert.equal(manifest.schemaVersion,1); assert.equal(manifest.captureKind,'actual-app-browser');
  assert.equal(manifest.syntheticData,true); assert.match(manifest.sourceSha,/^[a-f0-9]{40}$/);
  assert(Array.isArray(manifest.captures) && manifest.captures.length >= 30);
  for (const src of imageSources) {
    const record = manifest.captures.find((c: {publicFile?:string}) => c.publicFile === src || c.publicFile === src.replace(/^\//,'') || c.publicFile === 'public'+src || c.publicFile === path.basename(src));
    assert(record,`manifest provenance for ${src}`);
    assert.equal(record.publicSha256,createHash('sha256').update(await readFile(path.join(root,'public',src))).digest('hex'),`published capture matches provenance ${src}`);
  }
  console.log('Audience pages: exact actual-tab coverage, honest screenshot and delivery labels, safe links, no public account forms, and valid local capture assets passed.');
} finally { await unlink(bundle); }
