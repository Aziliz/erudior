import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {markdownImageAssets,transformMarkdownImages} from '../src/lib/markdownAssets.ts';
import {validateMarkdownAssets,validateLessonSource} from '../src/lib/lessonSource.ts';
const owned='https://community.example/images/owned',external='https://evil.example/image.png',png='data:image/png;base64,AA==';
const image=`![a\\]b](${owned})`;
const bodies={
 map:`base: world\ntitle: ${image}\nlabel: ![plain](${external}) | 0, 0\ncaption: First paragraph\n\n![reference][asset]\n\n[asset]: ${owned}`,
 timeline:`title: ${image}\nera: 1900–2000 | ${image} | ![plain](${external})\nevent: 1950 | ${image}\ncaption: ${image}`,
 sim:`title: ${image}\nspeed: 20\ncaption: ${image}`,
};
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,localStorage:dom.window.localStorage});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const {renderMarkdown}=await import('../src/components/Markdown.tsx');
for(const [kind,body] of Object.entries(bodies))for(const newline of ['\n','\r\n']){
 const source=('```'+kind+(kind==='sim'?' projectile':'')+'\n'+body+'\n```').replaceAll('\n',newline);
 const parsed=markdownImageAssets(source);assert.deepEqual(parsed.errors,[]);
 assert.equal(parsed.assets.length,kind==='timeline'?4:2,kind);assert(parsed.assets.every(a=>a.src===owned));
 assert.deepEqual(validateLessonSource(source,{communityImageOrigin:'https://community.example'}),[],kind);
 assert(validateMarkdownAssets(source.replaceAll(owned,external)).length,kind+' rejects foreign media');
 const embedded=transformMarkdownImages(source,()=>png);assert.equal(markdownImageAssets(embedded).assets.filter(a=>a.src===png).length,parsed.assets.length);
 if(kind!=='sim')assert(embedded.includes(`![plain](${external})`),'plain widget labels unchanged');
 const root=document.createElement('div');root.innerHTML=renderMarkdown(embedded);
 assert.equal(root.querySelectorAll('img').length,parsed.assets.length,kind+' renderer parity');
 assert([...root.querySelectorAll('img')].every(img=>img.getAttribute('src')===png));
}
for(const kind of ['map','timeline','sim']){
 const source='```'+kind+(kind==='sim'?' projectile':'')+'\n'+(kind==='timeline'?'event: 1900 | Hello\n':'')+'caption: `![inert]('+external+')`\n```';
 assert.deepEqual(markdownImageAssets(source).assets,[]);assert.deepEqual(validateMarkdownAssets(source),[]);assert.equal(transformMarkdownImages(source,()=>png),source);
 assert(validateMarkdownAssets(source.replace('`![inert]('+external+')`','<script>bad()</script>')).length,'active widget HTML validated');
 const literal='````text\n'+source.replace('`![inert]('+external+')`',`![active](${external})`)+'\n````';
 assert.deepEqual(markdownImageAssets(literal).assets,[]);assert.equal(transformMarkdownImages(literal,()=>png),literal);
}
console.log('widget media: map/timeline/simulation rendered fields, ownership, offline embedding, CRLF, references, renderer parity and inert plain/code preservation passed');
