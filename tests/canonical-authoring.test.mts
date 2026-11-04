import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {emptyCourse,normalizeCourse,exportCourseSnapshot,serializeCourse,looksLikeCourse,importCourseSnapshot} from '../src/lib/course.ts';
import {canonicalAuthoringFromCourse,courseFromCanonicalAuthoring,validateCanonicalAuthoring,demoteRuntimeCourse,runtimeCourseFromCanonicalAuthoring,canonicalRevisionProblems,migrateLegacyCourseToCanonical} from '../src/lib/canonicalAuthoring.ts';
const course={...emptyCourse(' Exact title '),description:'description',author:'Original author',updated:'2025-01-02',revision:4,changelog:'Original revision',disclaimer:'Training only',calculator:'none' as const,readAloud:false,language:{code:'ja',name:'Japanese',tts:'ja-JP',keys:['字'],ime:'ja',level:'N5',vocabTarget:100,vocabSource:'Example'},readingList:[{title:'Book',author:'Author',publisher:'Publisher',level:'1',url:'https://example.test/book',isbn:'123',free:false,note:'Note'}],decks:[{id:'deck',title:'Deck',description:'Description',cards:[{id:'card',front:'Front',back:'Back',topic:'Original topic'}]}],glossary:[{term:'Term',definition:'Meaning',aliases:[],topic:'Topic'}]};
const payload=canonicalAuthoringFromCourse(course);assert.deepEqual(courseFromCanonicalAuthoring(payload),course);assert.equal(payload.course.author,'Original author');
const installed=runtimeCourseFromCanonicalAuthoring(payload,{id:'community-test',revision:8,community:{id:'test',version:8,author:'Publisher',review:'not_reviewed'}});assert.equal(installed.author,'Original author');assert.equal(payload.course.id,course.id);assert.equal(payload.course.revision,4);
assert.deepEqual(demoteRuntimeCourse(installed).removedCommunity,installed.community);
for(const mutate of [(p:any)=>p.version=2,(p:any)=>p.course.community={review:'reviewed'},(p:any)=>p.course.extra=true,(p:any)=>p.course.language.extra=true,(p:any)=>p.course.decks[0].cards[0].extra=true,(p:any)=>p.course.modules[0].id='constructor',(p:any)=>p.course.readingList[0].url='javascript:alert(1)']){const bad=structuredClone(payload);mutate(bad);assert.ok(validateCanonicalAuthoring(bad).length);assert.throws(()=>courseFromCanonicalAuthoring(bad));}
const withQuestion=structuredClone(payload) as any;withQuestion.course.banks=[{format:'examiner-bank',version:1,id:'main',title:'Bank',sections:[],exam:{questionCount:1,timeLimitMinutes:10,passingPercent:70},questions:[{id:'q1',topic:'Topic',stem:'Question',choices:['A','B'],answer:[0]}]}];
assert.deepEqual(validateCanonicalAuthoring(withQuestion),[]);assert.deepEqual(courseFromCanonicalAuthoring(canonicalAuthoringFromCourse(withQuestion.course)),withQuestion.course);
const namespaced=runtimeCourseFromCanonicalAuthoring(withQuestion,{id:'community-test',revision:8});assert.equal(namespaced.banks[0].id,'community-test__main');assert.deepEqual(demoteRuntimeCourse(namespaced).payload.course.banks,withQuestion.course.banks);
const withSource=structuredClone(payload);withSource.course.lessons=[{id:'lesson',title:'Lesson',module:course.modules[0].id,body:'```sim\nunsafe\n```'}];assert.ok(validateCanonicalAuthoring(withSource).length,'invalid advanced source fails closed');
const next=structuredClone(payload);next.course.decks[0].cards=[];assert.ok(canonicalRevisionProblems(payload,next).some(e=>e.includes('card')));
const badBank=structuredClone(withQuestion);badBank.course.banks[0].courseId='forged';assert.ok(validateCanonicalAuthoring(badBank).some(e=>e.includes('runtime')));

for(const rawId of [{toString:'not callable'},[],42,null]){const malformed=structuredClone(payload) as any;malformed.course.modules[0].id=rawId;malformed.course.modules[0].quiz=[rawId];assert.ok(validateCanonicalAuthoring(malformed).length);}

const normalized=normalizeCourse(course);assert.deepEqual(JSON.parse(exportCourseSnapshot(normalized)),course,'valid authored fields survive normalization exactly');
const edited={...normalized,title:'Edited current title',author:'Edited author'};assert.equal(normalizeCourse(edited).title,'Edited current title');assert.equal(normalizeCourse(edited).author,'Edited author');
const doubleId=structuredClone(withQuestion);doubleId.course.banks[0].id='local__bank';const runtime=normalizeCourse(doubleId.course);assert.equal(runtime.banks[0].id,`${doubleId.course.id}__local__bank`);assert.equal(normalizeCourse(runtime).banks[0].id,runtime.banks[0].id);assert.equal(JSON.parse(exportCourseSnapshot(runtime)).banks[0].id,'local__bank');
const malformedEnvelope=structuredClone(payload) as any;malformedEnvelope.course.writing=[null];assert.throws(()=>normalizeCourse(malformedEnvelope),'canonical envelope cannot fall back to legacy repair');
const large={...course,description:'x'.repeat(490000),changelog:'y'.repeat(490000)};assert.throws(()=>canonicalAuthoringFromCourse(large),/byte limit/);assert.deepEqual(JSON.parse(exportCourseSnapshot(normalizeCourse(large))),large,'community byte cap cannot cause installed-source lossy fallback');

const repeated=structuredClone(withQuestion);repeated.course.banks[0].sections=[{id:'part',name:'Part'}];repeated.course.banks[0].exam.sectionPassing={part:71.6};repeated.course.banks[0].questions[0]={id:'match',topic:'Match',type:'match',stem:'Match each',left:['One','Two'],choices:['Same'],answer:[0,0]};assert.deepEqual(validateCanonicalAuthoring(repeated),[],'fractional section pass marks and reused match answers are supported');

for(const fixture of ['demo-code-course','demo-listening','demo-maps-timelines-sims','demo-reader','demo-student-work','early-readers-demo','manipulatives-demo','math-sampler-course']){
 const source=JSON.parse(exportCourseSnapshot(normalizeCourse(JSON.parse(readFileSync(`samples/${fixture}.json`,'utf8')))));
 const authored=canonicalAuthoringFromCourse(source);
 assert.deepEqual(courseFromCanonicalAuthoring(authored),source,`${fixture} exact portable roundtrip`);
 assert.deepEqual(JSON.parse(exportCourseSnapshot(normalizeCourse(source))),source,`${fixture} normalization retains semantic fields`);
}

assert.equal(looksLikeCourse(payload),true);assert.deepEqual(JSON.parse(exportCourseSnapshot(importCourseSnapshot(JSON.stringify(payload)))),course);assert.deepEqual(JSON.parse(serializeCourse(normalizeCourse(course))),course,'durable serialization must not rewrite authored updated metadata');
assert.deepEqual(JSON.parse(serializeCourse(normalizeCourse({...course,updated:'Edited timestamp'}))).updated,'Edited timestamp');
const assetDoc=structuredClone(withQuestion);assetDoc.course.banks[0].questions[0].image={src:'https://community.example.test/images/asset1',alt:'Example'};
assert.ok(validateCanonicalAuthoring(assetDoc).some(e=>e.includes('image')));
assert.deepEqual(validateCanonicalAuthoring(assetDoc,{communityImageOrigin:'https://community.example.test'}),[]);
assetDoc.course.banks[0].questions[0].image.src='https://evil.example/images/asset1';assert.ok(validateCanonicalAuthoring(assetDoc,{communityImageOrigin:'https://community.example.test'}).length);
assetDoc.course.communityImageOrigin='https://evil.example';assert.ok(validateCanonicalAuthoring(assetDoc).some(e=>e.includes('unsupported')),'authored payload cannot select a trusted media origin');

const units=structuredClone(payload) as any;units.course.drills=[{id:'units',title:'Unit conversion',vars:{x:{min:1,max:2}},prompt:'Convert',answer:'x',format:'number',solution:'Convert units',answers:[{name:'x',units:{m:1,nm:'1e-9'}}]}];assert.deepEqual(courseFromCanonicalAuthoring(canonicalAuthoringFromCourse(units.course)).drills,units.course.drills);units.course.drills[0].answers[0].units.nm='1/100';assert.ok(validateCanonicalAuthoring(units).length,'unit expressions are not numeric-string factors');

const legacy={...course,requires:['prior-course'],banks:[{id:'main',title:'Bank',questions:[{id:'q',stem:'Choose',choices:['A','B'],answer:0}]}]};
const migrated=migrateLegacyCourseToCanonical(legacy);assert.ok(migrated.transformations.length);assert.deepEqual(migrated.payload.course.requires,['prior-course']);assert.deepEqual(migrated.payload.course.banks[0].questions[0].answer,[0]);assert.equal((legacy.banks[0].questions[0] as any).answer,0,'migration is nonmutating');
assert.deepEqual(JSON.parse(exportCourseSnapshot(normalizeCourse(legacy))),migrated.payload.course,'known legacy defaults preserve all other metadata');
assert.throws(()=>migrateLegacyCourseToCanonical({...legacy,unknownField:'cannot drop'}),/unsupported/);
assert.throws(()=>migrateLegacyCourseToCanonical({...legacy,description:()=>''}),/plain JSON/);
assert.deepEqual(migrated.transformations.map(t=>t.path),[
 'course.banks[0].format','course.banks[0].version','course.banks[0].sections','course.banks[0].exam',
 'course.banks[0].exam.questionCount','course.banks[0].exam.timeLimitMinutes','course.banks[0].exam.passingPercent',
 'course.banks[0].questions[0].topic','course.banks[0].questions[0].answer',
],'legacy migration has an explicit golden list, never silent field repair');
assert.equal(migrated.transformations.at(-1)!.reason,'Wrapped documented scalar answer index');
const {generate}=await import('../src/lib/drills.ts');const {readAnswer}=await import('../src/lib/answers.ts');
units.course.drills[0].answers[0].units.nm='1e-9';const instance=generate(units.course.drills[0]);assert.equal(readAnswer(instance.parts[0],'1000000000 nm').value,1,'preserved numeric-string unit factor retains runtime calculation semantics');

assert.throws(()=>runtimeCourseFromCanonicalAuthoring(payload,{id:'community-test',revision:8,community:{id:'test',version:7,review:'reviewed',author:'Publisher'}}),/provenance/);
assert.throws(()=>runtimeCourseFromCanonicalAuthoring(payload,{id:'official-id',revision:8,community:{id:'test',version:8,review:'reviewed',author:'Publisher'}}),/provenance/);
const empty={format:'erudior-canonical-authoring',version:1,course:emptyCourse('Empty draft')};assert.deepEqual(validateCanonicalAuthoring(empty,{strict:false}),[]);assert.ok(validateCanonicalAuthoring(empty).some(e=>e.includes('requires learner content')));
console.log('canonical authoring core: exact metadata roundtrip, explicit runtime demotion, authority rejection, identity continuity, strict source and question validation passed');

const vocabularyDraft = structuredClone(withQuestion);
vocabularyDraft.course.lessons = [{ id: 'lesson', module: course.modules[0].id, title: 'Lesson', body: 'Words.' }];
vocabularyDraft.course.vocab = [{ id: 'word', lesson: 'lesson', term: 'Word', meanings: [] }];
const vocabularyBefore = structuredClone(vocabularyDraft);
assert.deepEqual(validateCanonicalAuthoring(vocabularyDraft, { strict: false }), [], 'incomplete vocabulary remains editable');
assert.ok(validateCanonicalAuthoring(vocabularyDraft).some(e => e.includes('at least one accepted meaning')), 'publication rejects impossible vocabulary recall');
assert.deepEqual(vocabularyDraft, vocabularyBefore, 'validation never deletes or repairs authored vocabulary');
vocabularyDraft.course.vocab[0].meanings = ['Meaning'];
assert.deepEqual(validateCanonicalAuthoring(vocabularyDraft), []);
