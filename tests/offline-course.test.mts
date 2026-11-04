/** Synthetic course transport tests: no reviewed curriculum, network, credentials, or learner records. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {emptyCourse, exportCourseSnapshot, normalizeCourse} from '../src/lib/course.ts';
import {canonicalAssetSources} from '../src/lib/canonicalAssets.ts';
import {createOfflineCoursePackage, importOfflineCoursePackage, inspectOfflineCourse, isOfflineCoursePackage, MAX_OFFLINE_COURSE_BYTES} from '../src/lib/offlineCourse.ts';
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=';
const wavBytes=Buffer.alloc(46);wavBytes.write('RIFF',0);wavBytes.writeUInt32LE(38,4);wavBytes.write('WAVEfmt ',8);wavBytes.writeUInt32LE(16,16);wavBytes.writeUInt16LE(1,20);wavBytes.writeUInt16LE(1,22);wavBytes.writeUInt32LE(8000,24);wavBytes.writeUInt32LE(16000,28);wavBytes.writeUInt16LE(2,32);wavBytes.writeUInt16LE(16,34);wavBytes.write('data',36);wavBytes.writeUInt32LE(2,40);
const wav='data:audio/wav;base64,'+wavBytes.toString('base64');
const course=emptyCourse('Synthetic private draft');course.id='original-course';course.revision=7;course.author='Authored attribution';course.lessons=[{id:'lesson',module:course.modules[0].id,title:'Lesson',body:'Local instructions.'}];
let assertions=0;
async function rejects(text:string,pattern?:RegExp){await assert.rejects(()=>importOfflineCoursePackage(text),pattern);assertions++;}
function checksum(raw:any){raw.sha256=createHash('sha256').update(JSON.stringify(raw.payload)).digest('hex');return JSON.stringify(raw);}
const originalFetch=globalThis.fetch;let fetches=0;globalThis.fetch=async()=>{fetches++;throw Error('No network is permitted during offline transport');};
try {
 const before=structuredClone(course);const plain=await createOfflineCoursePackage(course);assert.deepEqual(course,before,'export is nonmutating');
 assert(isOfflineCoursePackage(JSON.parse(plain)));for(const raw of [null,{},[],{format:'unknown'},'erudior-offline-course'])assert(!isOfflineCoursePackage(raw));
 const first=await importOfflineCoursePackage(plain),second=await importOfflineCoursePackage(plain);
 assert.notEqual(first.id,course.id);assert.notEqual(first.id,second.id);assert.match(first.id,/^offline-[A-Za-z0-9_-]+$/);assert.equal(first.lessons[0].id,'lesson');assert.equal(first.lessons[0].module,course.modules[0].id);assert.equal(first.revision,7);assert.equal(first.author,'Authored attribution');assert.equal(first.community,undefined);
 const long=structuredClone(course);long.id='x'.repeat(100);assert((await importOfflineCoursePackage(await createOfflineCoursePackage(long))).id.length<=100,'fresh ID does not append to maximum length source ID');
 const draft=emptyCourse('Unfinished local draft');assert.equal((await importOfflineCoursePackage(await createOfflineCoursePackage(draft))).lessons.length,0,'private editable drafts do not need publication completeness');
 const community={...course,community:{id:'example',version:7,author:'Claimed publisher',review:'reviewed' as const}};
 const demoted=await importOfflineCoursePackage(await createOfflineCoursePackage(community));assert.equal(demoted.community,undefined);assert.equal(demoted.author,'Authored attribution');
 const fixture=JSON.parse(readFileSync(new URL('./fixtures/community-canonical.json',import.meta.url),'utf8').replaceAll('data:audio/mpeg;base64,AA==',wav)).course;
 const img='assets/chart.png',remote='https://media.example.test/chart.png';
 fixture.lessons[0].body+='\n![chart]('+img+')\n![reference][visual]\n\n[visual]: '+remote+'\n\n`![inert](assets/inert.png)`';
 fixture.references[0].body+='\n<img src="'+img+'" alt="Reference">';
 fixture.decks[0].cards[0].front+='\n![front]('+img+')';fixture.decks[0].cards[0].back+='\n![back]('+img+')';
 fixture.banks[0].questions[0].image={src:img,alt:'Chart'};
 fixture.drills=[{id:'synthetic-drill',title:'Count',vars:{x:{min:1,max:2}},prompt:'Count',answer:'x',format:'number',solution:'Count'}];
 fixture.drills[0].prompt+='\n![prompt]('+img+')';fixture.drills[0].solution+='\n![solution]('+img+')';
 fixture.texts[0].about+='\n![about]('+img+')';fixture.texts[0].sections[0].body+='\n\nImage note.[^asset]\n\n[^asset]: ![footnote]('+img+')';
 fixture.writing[0].prompt+='\n![writing]('+img+')';fixture.labs[0].intro+='\n![lab]('+img+')';fixture.labs[0].steps[0].text+='\n![step]('+img+')';fixture.labs[0].questions[0].prompt+='\n![question]('+img+')';fixture.activityLog.prompt+='\n![log]('+img+')';
 fixture.audio={Recording:'audio/recording.wav',Spoken:'say:  Keep exact text.  '};fixture.banks[0].questions[0].audio={src:'audio/question.wav',text:'Transcript',lang:'en-US'};fixture.banks[0].questions[0].listen='Recording';fixture.vocab[0].audio='audio/word.wav';
 const normalized=fixture;const original=structuredClone(normalized);const report=inspectOfflineCourse(normalized);
 assert.deepEqual(new Set(report.assets.map(a=>a.source)),new Set([img,remote,'audio/recording.wav','audio/question.wav','audio/word.wav']));assert(report.warnings.some(w=>/Python/.test(w)));assert(report.warnings.some(w=>/not.*signature/.test(w)));assert(!report.assets.some(a=>a.source.includes('inert')));
 await assert.rejects(()=>createOfflineCoursePackage(normalized),/Choose a local/);
 await assert.rejects(()=>createOfflineCoursePackage(course,{unused:png}),/Unexpected/);
 const packed=await createOfflineCoursePackage(normalized,{[img]:png,[remote]:png,'audio/recording.wav':wav,'audio/question.wav':wav,'audio/word.wav':wav});
 assert.deepEqual(normalized,original);const imported=await importOfflineCoursePackage(packed);const portable=JSON.parse(exportCourseSnapshot(imported));
 assert.deepEqual(canonicalAssetSources(portable),[png]);assert.equal(imported.audio?.Recording,wav);assert.equal(imported.audio?.Spoken,'say:  Keep exact text.  ');assert.equal(imported.banks[0].questions[0].audio?.src,wav);assert.equal(imported.banks[0].questions[0].audio?.text,'Transcript');assert.equal(imported.vocab?.[0].audio,wav);assert.equal(imported.banks[0].questions[0].listen,'Recording');assert.equal(imported.banks[0].id,imported.id+'__first-bank');assert.equal(imported.banks[0].questions[0].id,'l1-q1');assert(imported.lessons[0].body.includes('`![inert](assets/inert.png)`'));
 for(const source of ['../secret.png','/tmp/secret.png','file:///secret.png','blob:https://example.test/id','javascript:alert(1)','https://user:secret@example.test/a.png','https://example.test/a.png?token=secret','https://example.test/a.png#secret']){
  const bad=structuredClone(course);bad.lessons[0].body=`![x](${source})`;await assert.rejects(()=>createOfflineCoursePackage(bad,{[source]:png}),undefined,source);assertions++;
 }
 for(const source of ['data:image/png;base64,AB==','data:image/png;base64,%%%','data:image/svg+xml;base64,'+Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>').toString('base64'),'data:image/svg+xml;base64,'+Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><image href="https://evil.test/x"/></svg>').toString('base64')]){
  const bad=structuredClone(course);bad.lessons[0].body=`![x](${source})`;await assert.rejects(()=>createOfflineCoursePackage(bad));assertions++;
 }
 for(const mutate of [(r:any)=>r.version=2,(r:any)=>r.signature='forged',(r:any)=>r.payload.course.community={review:'reviewed'},(r:any)=>r.payload.course.progress={},(r:any)=>r.payload.course.submissions=[],(r:any)=>r.payload.course.lessons[0].approval={actor:'Forged'},(r:any)=>r.payload.course.modules[0].id='constructor',(r:any)=>r.payload.course.revision=-1]){
  const bad=JSON.parse(plain);mutate(bad);await rejects(checksum(bad));
 }
 const tampered=JSON.parse(plain);tampered.payload.course.title='Changed';await rejects(JSON.stringify(tampered),/checksum/);
 for(const text of ['null','[]','{}','{','"text"',JSON.stringify({...JSON.parse(plain),sha256:'g'.repeat(64)})])await rejects(text);
 await rejects(' '.repeat(MAX_OFFLINE_COURSE_BYTES+1),/24 MiB/);
 const huge=structuredClone(course);huge.description='x'.repeat(MAX_OFFLINE_COURSE_BYTES);await assert.rejects(()=>createOfflineCoursePackage(huge),/24 MiB/);
 const excessive=structuredClone(course);excessive.audio={clip:'data:audio/wav;base64,'+Buffer.alloc(400001).toString('base64')};await assert.rejects(()=>createOfflineCoursePackage(excessive));
 const structural=JSON.parse(plain);structural.payload.course.lessons[0].body='<iframe src="https://example.test"></iframe>';await rejects(checksum(structural));
 assert.equal(fetches,0,'inspection, export, and import never fetch authored media');
 console.log(`offline course: roundtrip, semantic images/audio, drafts, trust demotion, namespace isolation, immutable source, zero network and ${assertions} hostile inputs passed`);
}finally{globalThis.fetch=originalFetch;}

// Semantic audio spans retain surrounding syntax, newlines, transcripts, and inert examples.
const {transformOfflineAudio}=await import('../src/lib/offlineAudio.ts');
const media=structuredClone(course);
media.lessons[0].body='Before audio: untouched.wav\r\n```dialogue lang=en-US\r\nTeacher: Hello.\r\n  audio: audio/hello.wav  \r\n= A translation.\r\n```\r\n\n```speak\nA phrase.\naudio: audio/phrase.wav\n```\n\n```text\naudio: inert.wav\n```\n\n```sounds\nA sound="'+wav+'" say="A"\n```\n\n```blend\nat = a['+wav+'] t\n```';
const seen:string[]=[];const changed=transformOfflineAudio(media,s=>{seen.push(s);return s.startsWith('data:')?s:wav;});
assert.equal(seen.filter(s=>s===wav).length,2);assert(seen.includes('audio/hello.wav'));assert(seen.includes('audio/phrase.wav'));assert(!seen.includes('inert.wav'));assert(changed.lessons[0].body.includes('  audio: '+wav+'  \r\n'));assert(changed.lessons[0].body.includes('audio: inert.wav'));assert(changed.lessons[0].body.includes('Before audio: untouched.wav'));assert.equal(media.lessons[0].body.includes('audio: audio/hello.wav'),true);
const repeated=structuredClone(course);repeated.audio=Object.fromEntries(Array.from({length:1000},(_,i)=>['clip'+i,'tiny.wav']));let calls=0;assert.throws(()=>transformOfflineAudio(repeated,()=>{calls++;return wav.repeat(1000);},100000),/expansion/);assert(calls<3,'audio budget rejects before repeated expansion is materialized');
const reader=structuredClone(course);reader.texts=[{id:'reader',title:'Reader',kind:'prose',sections:[{id:'section',title:'Part',body:'```speak\nReader phrase.\naudio: audio/reader.wav\n```'}]}] as any;
assert(transformOfflineAudio(reader,()=>wav).texts![0].sections[0].body.includes(wav));
const {emptyBranchingPack}=await import('../src/lib/branchingEngine.ts');
const withPack=structuredClone(course);const branching=emptyBranchingPack('transport-scenario');branching.revision=1;branching.nodes=[{id:'start',title:'Start',text:'Synthetic only.',terminal:'success',choices:[]}];withPack.branchingScenarios=[{...branching,lessonId:'lesson'}];
const packText=await createOfflineCoursePackage(withPack);assert.equal((await importOfflineCoursePackage(packText)).branchingScenarios![0].id,branching.id);
const forgedPack=JSON.parse(packText);forgedPack.payload.course.branchingScenarios[0].approval={actor:'Forged teacher',at:'2026-10-30T00:00:00Z'};await rejects(checksum(forgedPack),/approval/);
console.log('offline audio: active dialogue/speak/phonics, inert source and CRLF preservation, reader fields, incremental expansion bounds and nested approval rejection passed');
const mediaInspection=inspectOfflineCourse(media);assert.deepEqual(mediaInspection.assets.map(a=>a.source),['audio/phrase.wav','audio/hello.wav']);
const mediaPackage=await createOfflineCoursePackage(media,{'audio/hello.wav':wav,'audio/phrase.wav':wav});
const mediaImported=await importOfflineCoursePackage(mediaPackage);assert(mediaImported.lessons[0].body.includes('  audio: '+wav+'  \r\n'));assert(mediaImported.lessons[0].body.includes('audio: inert.wav'));
const importBadAudio=JSON.parse(mediaPackage);importBadAudio.payload.course.lessons[0].body=importBadAudio.payload.course.lessons[0].body.replace(wav,'data:audio/wav;base64,UklGRg==');await rejects(checksum(importBadAudio));
const importRemoteAudio=JSON.parse(mediaPackage);importRemoteAudio.payload.course.lessons[0].body=importRemoteAudio.payload.course.lessons[0].body.replace(wav,'audio/unbundled.wav');await rejects(checksum(importRemoteAudio));
console.log('offline audio end-to-end: media report, local dialogue embedding, exact imported source and malicious embedded media rejection passed');
