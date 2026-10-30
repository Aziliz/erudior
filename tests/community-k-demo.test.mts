import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {K_DEMO_SUBJECTS,K_DEMO_NOTICE,K_DEMO_AUDIO,createKDemoDoc,demoCourseMeta,demoRuntimeManifest,demoSourceCourse} from './fixtures/community-k-demo-data.ts';
import {checkDoc,toCourse,communityWorkRevisionProblems} from '../src/lib/communityFormat.ts';
import {normalizeCourse,exportCourseSnapshot} from '../src/lib/course.ts';
import {validateCourseIntegrity,importValidatedCourseSnapshot} from '../src/lib/courseIntegrity.ts';
import {canonicalAuthoringFromCourse,courseFromCanonicalAuthoring} from '../src/lib/canonicalAuthoring.ts';
import {downloadCommunityCourse} from '../src/lib/community.ts';

assert.equal(K_DEMO_SUBJECTS.length,8);
assert.equal(new Set(K_DEMO_SUBJECTS.map(s=>s.id)).size,8);
assert.equal(new Set(K_DEMO_SUBJECTS.map(s=>s.subject)).size,8);
const ids=new Set<string>();
const fetchBefore=globalThis.fetch;
try {
 for(const subject of K_DEMO_SUBJECTS)for(const mode of ['legacy','canonical'] as const){
  const doc=createKDemoDoc(subject.id,mode), before=structuredClone(doc), meta=demoCourseMeta(`synthetic-k-${subject.id}`);
  assert.match(doc.title,/^Synthetic K /);
  assert.equal(doc.level,'Elementary School');
  assert.equal(doc.description,K_DEMO_NOTICE);
  assert.deepEqual(checkDoc(doc,false),[],`${subject.id}/${mode} draft`);
  assert.deepEqual(checkDoc(doc,true),[],`${subject.id}/${mode} publish`);
  const source=toCourse(doc,meta,()=>{throw Error('No network image is part of this fixture');});
  const installed=normalizeCourse(source);
  const officialInput=demoSourceCourse(doc,subject.id);
  assert.equal(officialInput.community,undefined,'canonical source input confers no review or signing authority');
  assert.deepEqual(demoRuntimeManifest(installed),demoRuntimeManifest(officialInput),'official canonical import and community install preserve identical authored semantics');
  assert.deepEqual(validateCourseIntegrity(installed),[],`${subject.id}/${mode} same runtime integrity as official packages`);
  assert.equal(installed.id,`community-synthetic-k-${subject.id}`);
  assert.equal(installed.revision,1);assert.equal(installed.community?.review,'not_reviewed');
  assert.deepEqual(installed.modules.map(m=>m.id),['explore']);
  assert.deepEqual(installed.lessons.map(l=>l.id),['observe']);
  assert.deepEqual(installed.banks.flatMap(b=>b.questions.map(q=>q.id)),['observe-notice','explore-recall']);
  assert.deepEqual(installed.lessons[0].quiz,['observe-notice']);
  assert.deepEqual(installed.modules[0].quiz,['explore-recall']);
  assert.deepEqual(installed.decks[0].cards.map(c=>c.id),['card']);
  assert.equal(installed.glossary[0].term,'synthetic');
  assert.match(installed.lessons[0].body,/Original synthetic acceptance example/);
  assert.equal(installed.banks[0].questions[0].choices[0],subject.answer);
  assert.deepEqual(installed.banks[0].questions[0].answer,[0]);
  const saved=JSON.parse(JSON.stringify(doc));
  assert.deepEqual(saved,doc,'JSON save/reopen does not alter the source');
  assert.deepEqual(demoRuntimeManifest(importValidatedCourseSnapshot(exportCourseSnapshot(installed))),demoRuntimeManifest(installed),'offline runtime snapshot parity');
  globalThis.fetch=async()=>Response.json({...meta,doc:saved});
  const downloaded=normalizeCourse(await downloadCommunityCourse(meta.id));
  assert.deepEqual(demoRuntimeManifest(downloaded),demoRuntimeManifest(installed),'real community download/install semantic parity');
  assert.deepEqual(downloaded.community,installed.community,'unreviewed authority is not promoted');
  assert.deepEqual(doc,before,'normalization/download never mutates authoring source');
  const next=structuredClone(doc);
  if(next.canonical)next.canonical.course.lessons[0].title+=' edited';else next.lessons[0].title+=' edited';
  assert.deepEqual(communityWorkRevisionProblems(doc,next,meta.id),[],'stable-ID title edits are allowed');
  if(mode==='canonical'){
   assert.equal(installed.readAloud,true);
   assert.equal(installed.disclaimer,K_DEMO_NOTICE);
   // Canonical authoring has the same exact semantic roundtrip as official course input.
   const canonical=canonicalAuthoringFromCourse(doc.canonical!.course);
   assert.deepEqual(courseFromCanonicalAuthoring(canonical),doc.canonical!.course);
  }
  if(subject.id==='math')assert.match(installed.lessons[0].body,/```manipulative/);
  if(['language-arts','art'].includes(subject.id)){
   assert.equal(installed.texts?.[0].sections[0].questions?.[0],'observe-notice');
   assert.equal(installed.texts?.[0].source,K_DEMO_NOTICE);
  }
  if(['social-studies','health'].includes(subject.id)){
   assert.equal(installed.writing?.[0].id,'response');assert.equal(installed.writing?.[0].rubric,'response-rubric');
   assert.match(installed.lessons[0].body,/writing: response/);
  }
  if(subject.id==='science'){assert.equal(installed.labs?.[0].id,'paper-shapes');assert.match(installed.lessons[0].body,/lab: paper-shapes/);}
  if(subject.id==='physical-education'){assert.equal(installed.activityLog?.uploads,false);assert.match(installed.lessons[0].body,/```assignment\nlog/);}
  if(subject.id==='music'&&mode==='canonical')assert.equal(installed.banks[0].questions[0].audio?.src,K_DEMO_AUDIO);
  if(subject.id==='language-arts'&&mode==='canonical')assert.deepEqual(installed.banks[0].questions[0].blend,['c','a','t']);
  ids.add(installed.id);
 }
} finally {globalThis.fetch=fetchBefore;}
assert.equal(ids.size,8,'eight independent runtime course identities, same identity across explicit authoring modes');
// Existing official-format sample fixtures, read-only: this compares shared runtime
// acceptance/portable field preservation, not official status or curriculum equivalence.
for(const filename of ['early-readers-demo','manipulatives-demo','demo-reader','demo-student-work']){
 const bytes=readFileSync(new URL(`../samples/${filename}.json`,import.meta.url),'utf8');
 const course=normalizeCourse(JSON.parse(bytes));
 assert.deepEqual(validateCourseIntegrity(course),[],`${filename} reference runtime integrity`);
 assert.deepEqual(demoRuntimeManifest(importValidatedCourseSnapshot(exportCourseSnapshot(course))),demoRuntimeManifest(course),`${filename} same portable runtime behavior`);
 assert.equal(readFileSync(new URL(`../samples/${filename}.json`,import.meta.url),'utf8'),bytes,'reference sample remains unchanged');
}
const bad=createKDemoDoc('science','canonical');bad.canonical!.course.community={id:'forged',version:1,author:'forged',review:'reviewed'};
assert(checkDoc(bad,true).length,'synthetic source cannot manufacture reviewed provenance');
const a=createKDemoDoc('math'), b=createKDemoDoc('math');a.lessons[0].title='Changed instance';assert.notEqual(a.lessons[0].title,b.lessons[0].title,'seed instances are isolated');
assert.throws(()=>createKDemoDoc('unknown' as never),/Unknown synthetic subject/);
console.log('Eight synthetic K subjects: strict legacy/canonical authoring, immutable IDs/resources, real download/install, portable runtime parity and unreviewed authority passed.');
