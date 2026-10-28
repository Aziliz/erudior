import {transformCanonicalAssets} from '../src/lib/canonicalAssets.ts';
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {markdownImageAssets,transformMarkdownImages} from '../src/lib/markdownAssets.ts';
import {checkDoc,imageIds,toCourse} from '../src/lib/communityFormat.ts';
import {validateMarkdownAssets} from '../src/lib/lessonSource.ts';
const src='https://community.example/images/owned',png='data:image/png;base64,AA==';
for(const md of [`![a\\]b](${src})`,`![nested [alt]](${src})`,`> ![a](${src})\n`,`- ![a](${src})\n`,`![a][ref]\n\n[ref]: ${src} "Title"`,`![ref]\n\n[ref]: ${src}`,`<img alt="test > marker" src="${src}">`,`| Picture |\n| --- |\n| ![a](${src}) |`]){assert.deepEqual(markdownImageAssets(md).errors,[],md);assert.equal(markdownImageAssets(md).assets.length,1,md);assert(transformMarkdownImages(md,()=>png).includes(png),md);}
const literal=`Plain ${src}\n[Link](${src})\n\n\`![a](${src})\`\n\n\`\`\`text\n![a](${src})\n\`\`\`\n\n![a](${src})`;
assert.equal(transformMarkdownImages(literal,()=>png),literal.slice(0,literal.lastIndexOf(src))+png+literal.slice(literal.lastIndexOf(src)+src.length));
const refs=`![picture][same] and [ordinary link][same]\n\n[same]: ${src} "Title"`;
assert.equal(transformMarkdownImages(refs,()=>png),`![picture](${png} "Title") and [ordinary link][same]\n\n[same]: ${src} "Title"`);
for(const md of ['![a\\]b](https://evil.test/x.png)','![nested [alt]](https://evil.test/x.png)','![x][ref]\n\n[ref]: https://evil.test/x.png','<img title="src=good" src="https://evil.test/x.png">','<img src="data:image/png;base64,AA==" SRC="https://evil.test/x">'])assert(validateMarkdownAssets(md).length,md);
const p=JSON.parse(readFileSync(new URL('./fixtures/community-canonical.json',import.meta.url),'utf8'));p.course.labs[0].steps[0].text=`![Lab](${src})`;p.course.lessons[0].body+='\n'+literal;
const doc:any={format:'erudior-community',version:1,title:p.course.title,description:'Listing',subject:'Science',level:'Middle School',type:'Course',lessons:[],decks:[],canonical:p};
assert.deepEqual(checkDoc(doc,true,{communityImageOrigin:'https://community.example'}),[]);assert.deepEqual(imageIds(doc,'https://community.example'),['owned']);
const before=structuredClone(doc);const installed=toCourse(doc,{id:'test',version:1,author:'Publisher',review:'not_reviewed'},()=>png,'https://community.example') as any;
assert.equal(installed.labs[0].steps[0].text,`![Lab](${png})`);assert(installed.lessons[0].body.includes(`[Link](${src})`));assert.deepEqual(doc,before);
assert.throws(()=>toCourse(doc,{id:'test',version:1,author:'Publisher',review:'not_reviewed'},()=>'', 'https://community.example'),/required community image/);
console.log('canonical assets: parsed Markdown ownership, escaped/nested/reference/HTML images, all lab fields, exact inert/link preservation and fail-closed embedding passed');

const repeatedTable=`| Image |\n| --- |\n| ![x](${src}) |\n| ![x](${src}) |`;
assert.equal(transformMarkdownImages(repeatedTable,()=>png).split(png).length-1,2);

const expansion=structuredClone(p.course);expansion.lessons[0].body=Array.from({length:100},()=>`![x](${src})`).join('\n');let resolved=0;
assert.throws(()=>transformCanonicalAssets(expansion,()=>{resolved++;return 'data:image/png;base64,'+'A'.repeat(100000);},{maxBytes:300000}),/expansion exceeds/);
assert(resolved<10,'reject expansion before materializing all repeated assets');
const {resolveCommunityImageDataUrl}=await import('../src/lib/community.ts');const previousFetch=globalThis.fetch;const previousReader=globalThis.FileReader;
try {
 let calls=0;globalThis.fetch=async(_url,options)=>{calls++;assert.equal(options?.redirect,'error');return new Response(new Uint8Array(2*1024*1024+1),{headers:{'content-type':'image/png'}});};
 await assert.rejects(()=>resolveCommunityImageDataUrl('../auth'),/Invalid community image ID/);assert.equal(calls,0);
 await assert.rejects(()=>resolveCommunityImageDataUrl('owned'),/size limit/);
 class Reader {result='';onload:(()=>void)|null=null;onerror:(()=>void)|null=null;readAsDataURL(blob:Blob){void blob.arrayBuffer().then(bytes=>{this.result=`data:${blob.type};base64,${Buffer.from(bytes).toString('base64')}`;this.onload?.();});}}
 globalThis.FileReader=Reader as any;globalThis.fetch=async()=>new Response('<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>',{headers:{'content-type':'image/svg+xml'}});
 await assert.rejects(()=>resolveCommunityImageDataUrl('owned'),/invalid/);
 globalThis.fetch=async()=>new Response(new Uint8Array([0]),{headers:{'content-type':'image/png'}});assert.equal(await resolveCommunityImageDataUrl('owned'),png);
}finally{globalThis.fetch=previousFetch;globalThis.FileReader=previousReader;}
