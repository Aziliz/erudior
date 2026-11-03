import assert from 'node:assert/strict';
import { emptyCourse } from '../src/lib/course.ts';
import { buildStudioDocument, STUDIO_KINDS, STUDIO_LIMITS, studioResources, studioChoices, studioProblems, parseStudioDocument, studioDigest, studioApprovalCurrent, studioLearnerView, importStudioCopy, type StudioDocument, type StudioInventory } from '../src/lib/adminStudio.ts';
const course=emptyCourse('Synthetic Studio source');course.id='synthetic';course.revision=1;
course.lessons=[{id:'lesson',module:'module',title:'Synthetic passage',body:'A synthetic observation, not curriculum.'}];
course.banks=[{id:'bank',title:'Synthetic bank',questions:[{id:'choice',topic:'Synthetic',stem:'Select B.',choices:['A','B'],answer:[1]}]}];
course.rubrics=[{id:'rubric',title:'Synthetic rubric',criteria:[{id:'evidence',name:'Evidence',description:'Include an observation.',levels:[{points:1,label:'Included',description:'One observation.'},{points:0,label:'Missing'}]}]}];
course.writing=[{id:'writing',title:'Synthetic writing',kind:'short',prompt:'Describe the observation.',words:{min:1,max:20},rubric:'rubric'}];
course.labs=[{id:'lab',title:'Synthetic lab',adult:true,safety:['Paper only.'],materials:['Paper'],steps:[{text:'Observe the paper.',adult:true}],tables:[{id:'table',columns:['Object','Observation'],rows:1,rowLabels:['Paper']}],questions:[{id:'reflection',kind:'conclusion',prompt:'What did you observe?'}],rubric:'rubric'}];
const inventory:StudioInventory[]=[{source:{courseId:course.id,revision:1,digest:'a'.repeat(64)},course}];
const original=JSON.stringify(inventory), pool=studioResources(inventory);
assert.equal(pool.excluded,0);assert.equal(pool.resources.length,5);
for(const kind of STUDIO_KINDS) {
  const doc:StudioDocument={format:'erudior-studio-material',version:1,id:`synthetic-${kind}`,revision:1,kind,title:`Synthetic ${kind}`,instructions:'Read the source.',teacherNotes:'PRIVATE TEACHER NOTES',resources:studioChoices(kind,inventory)};
  const built=buildStudioDocument(kind,'new-material',doc.title,doc.resources.map(r=>({source:r.source,key:r.key})),inventory);
  assert.deepEqual(built.resources,doc.resources);assert.equal(built.revision,0);
  assert(doc.resources.length,kind);assert.deepEqual(studioProblems(doc,inventory),[]);
  assert.deepEqual(parseStudioDocument(JSON.stringify(doc)),doc);
  const approval={revision:1,digest:await studioDigest(doc),reviewedBy:'synthetic-admin',reviewedAt:'2026-01-01T00:00:00.000Z'};
  assert.equal(await studioApprovalCurrent(doc,approval,inventory),true);
  for(const field of ['title','instructions','teacherNotes'] as const) {
    const changed={...doc,[field]:doc[field]+' changed'};
    assert.equal(await studioApprovalCurrent(changed,approval,inventory),false,`${kind}: edit invalidates ${field}`);
  }
  assert.equal(await studioApprovalCurrent({...doc,revision:2},approval,inventory),false);
  assert.equal(await studioApprovalCurrent(doc,approval,[]),false,'deleted source');
  const changed=structuredClone(inventory);changed[0].source.digest='b'.repeat(64);
  assert.equal(await studioApprovalCurrent(doc,approval,changed),false,'changed digest');
  const revision=structuredClone(inventory);revision[0].source.revision=2;revision[0].course.revision=2;
  assert.equal(await studioApprovalCurrent(doc,approval,revision),false,'changed source version');
  const copy=importStudioCopy(JSON.stringify(doc),'new-copy');assert.equal(copy.revision,0);assert.equal(copy.id,'new-copy');
  assert.equal(await studioApprovalCurrent(copy,approval,inventory),false,'copy cannot inherit approval');
  assert.throws(()=>parseStudioDocument({...doc,approval}),'approval is not importable authority');
  const learner=studioLearnerView(doc), serialized=JSON.stringify(learner);
  assert(!serialized.includes('PRIVATE TEACHER NOTES'));assert(!serialized.includes('"answer"'));assert(!serialized.includes('"teacherNotes"'));
  for(const resource of doc.resources) for(const block of resource.blocks) if(block.choices) {
    const projected=learner.resources.find(r=>r.title===resource.title)!.blocks.find(b=>b.label===block.label)!;
    assert.deepEqual(projected.choices,block.choices);assert(!('answer' in projected));
  }
  const tamper=structuredClone(doc);tamper.resources[0].blocks[0].text+=' tampered';
  assert(studioProblems(tamper,inventory).length);assert.equal(await studioApprovalCurrent(tamper,approval,inventory),false);
}
assert.equal(JSON.stringify(inventory),original,'no canonical content mutation');
const empty:StudioDocument={format:'erudior-studio-material',version:1,id:'empty',revision:0,kind:'project',title:'Draft',instructions:'',teacherNotes:'',resources:[]};
assert.equal(parseStudioDocument(empty).resources.length,0);assert(studioProblems(empty,inventory).length);
assert.throws(()=>parseStudioDocument({...empty,kind:'quiz',resources:pool.resources}));
assert.throws(()=>parseStudioDocument({...empty,kind:'presentation',resources:[pool.resources[0],pool.resources[0]]}));
for(const value of ['<script>alert(1)</script>','![image](https://example.test/image)','```unsafe','[link](javascript:alert(1))','\u0000']) assert.throws(()=>parseStudioDocument({...empty,instructions:value}));
assert.throws(()=>parseStudioDocument('x'.repeat(STUDIO_LIMITS.bytes+1)));
assert.throws(()=>parseStudioDocument({...empty,title:'😀'.repeat(300)}));
assert.throws(()=>parseStudioDocument({...empty,resources:Array(51).fill(pool.resources[0])}));
assert.throws(()=>parseStudioDocument({...empty,official:true}));
assert.throws(()=>parseStudioDocument({...empty,revision:-1}));
assert.throws(()=>parseStudioDocument({...empty,revision:Number.MAX_SAFE_INTEGER+1}));
assert.throws(()=>parseStudioDocument(JSON.parse('{"__proto__":{},"format":"erudior-studio-material"}')));
const corrupt=structuredClone(inventory);corrupt[0].course.labs![0].steps[0].text='<script>unsafe</script>';
assert(!studioResources(corrupt).resources.some(r=>r.kind==='lab'));
const duplicate=structuredClone(inventory);duplicate[0].course.lessons.push({...duplicate[0].course.lessons[0],body:'Different duplicate'});
assert(!studioResources(duplicate).resources.some(r=>r.kind==='passage'));
assert.equal(studioResources([...inventory,...inventory]).resources.length,0);
const mismatch=structuredClone(inventory);mismatch[0].course.revision=2;assert.equal(studioResources(mismatch).resources.length,0);
const lab=pool.resources.find(r=>r.kind==='lab')!;
assert(lab.blocks.some(b=>b.label==='Safety'&&b.text==='Paper only.'));
assert(lab.blocks.some(b=>b.label.includes('adult supervision required')));
assert(lab.blocks.some(b=>b.text.includes('Columns: Object | Observation')));
const quiz:StudioDocument={...empty,kind:'quiz',resources:studioChoices('quiz',inventory)};
const changedAnswer=structuredClone(quiz);changedAnswer.resources[0].blocks[0].answer=[0];assert(studioProblems(changedAnswer,inventory).length);
for(const answer of [[99],[],[1,1],[-1],['1']]) {const invalid=structuredClone(quiz) as any;invalid.resources[0].blocks[0].answer=answer;assert.throws(()=>parseStudioDocument(invalid));}
console.log('Admin Studio host-neutral model: all eight builders, exact source/revision binding, tamper rejection, approval invalidation, untrusted copies, answer projection and bounded unsafe-input checks passed. No server authorization or UI completion claimed.');

assert.throws(()=>buildStudioDocument('quiz','copy','Quiz',[{source:inventory[0].source,key:'missing'}],inventory));
assert.throws(()=>buildStudioDocument('quiz','copy','Quiz',[{source:inventory[0].source,key:'lab/lab'}],inventory));
assert(lab.blocks.some(b=>b.label==='Evidence'&&b.text.includes('1: Included')),'source rubric preserved with lab');
// Exact structured semantics survive adaptation, even when a flattened preview looks identical.
for(const mutate of [
  (c:typeof course)=>{c.writing![0].kind='essay';},
  (c:typeof course)=>{c.writing![0].selfCheck=true;},
  (c:typeof course)=>{c.labs![0].selfCheck=true;},
  (c:typeof course)=>{c.labs![0].questions[0].id='another-id';},
]) {
  const changed=structuredClone(inventory);mutate(changed[0].course);
  assert.notDeepEqual(studioResources(changed).resources,pool.resources);
}
const tableA=structuredClone(inventory),tableB=structuredClone(inventory);
tableA[0].course.labs![0].tables[0].columns=['A | B','C'];tableB[0].course.labs![0].tables[0].columns=['A','B | C'];
assert.notDeepEqual(studioResources(tableA).resources,studioResources(tableB).resources,'canonical columns cannot collide through text joining');
const cards=structuredClone(inventory);cards[0].course.decks=[{id:'cards',title:'Synthetic cards',cards:[{id:'card',front:'Visible prompt',back:'PRIVATE_CARD_ANSWER_724'}]}];
for(const kind of ['worksheet','discussion','presentation','study-guide'] as const) {
  const doc=buildStudioDocument(kind,'card-test','Card material',studioChoices(kind,cards).map(r=>({source:r.source,key:r.key})),cards);
  assert(JSON.stringify(doc).includes('PRIVATE_CARD_ANSWER_724'));
  assert(!JSON.stringify(studioLearnerView(doc)).includes('PRIVATE_CARD_ANSWER_724'));
  assert(!JSON.stringify(studioLearnerView(doc)).includes('answerText'));
}
console.log('Independent audit regressions: canonical kind/self-check/IDs/table structure preserved; flashcard backs excluded from learner material.');
