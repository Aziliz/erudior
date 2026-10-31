import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import View from '../src/components/StudioMaterialView.tsx';
import { emptyCourse } from '../src/lib/course.ts';
import { STUDIO_KINDS,buildStudioDocument,studioChoices,studioLearnerView,type StudioInventory } from '../src/lib/adminStudio.ts';
const course=emptyCourse('Synthetic renderer source');course.id='synthetic-render';course.revision=1;
course.lessons=[{id:'lesson',module:'module',title:'Synthetic text',body:'Inert lesson text.'}];
course.decks=[{id:'cards',title:'Cards',cards:[{id:'card',front:'Card prompt',back:'SECRET_CARD_BACK_91'}]}];
course.banks=[{id:'bank',title:'Bank',questions:[{id:'q',topic:'Synthetic',stem:'Choose B.',choices:['A','B'],answer:[1]}]}];
course.rubrics=[{id:'rubric',title:'Source rubric',criteria:[{id:'c',name:'Criterion',levels:[{points:1,label:'Included'},{points:0,label:'Missing'}]}]}];
course.writing=[{id:'writing',title:'Essay source',kind:'essay',prompt:'Explain your observation.',rubric:'rubric',selfCheck:true}];
course.labs=[{id:'lab',title:'Paper lab',adult:true,safety:['Use paper only.'],materials:['Paper'],steps:[{text:'Look at paper.',adult:true}],tables:[{id:'observations',title:'Observation table',columns:['A | B','C'],rows:1,rowLabels:['Paper']}],questions:[{id:'q',kind:'conclusion',prompt:'Describe it.'}],rubric:'rubric'}];
const inventory:StudioInventory[]=[{source:{courseId:course.id,revision:1,digest:'a'.repeat(64)},course}];
for(const kind of STUDIO_KINDS) {
  const doc=buildStudioDocument(kind,'render',`Synthetic ${kind}`,studioChoices(kind,inventory).map(r=>({source:r.source,key:r.key})),inventory);doc.teacherNotes='SECRET_TEACHER_NOTE_81';
  const view=studioLearnerView(doc), html=renderToStaticMarkup(React.createElement(View,{view}));
  assert(html.includes(doc.title));assert(!html.includes('SECRET_CARD_BACK_91'));assert(!html.includes('SECRET_TEACHER_NOTE_81'));
  assert(!/<(?:script|iframe|img|audio|video)\b/.test(html));assert(!html.includes('dangerouslySetInnerHTML'));
  if(kind==='lab') {assert(html.includes('Adult supervision required'));assert(html.includes('<th scope="col">A | B</th><th scope="col">C</th>'));assert(html.includes('Use paper only.'));assert(html.includes('<caption>Observation table</caption>'));}
  if(kind==='project') {assert(html.includes('Essay'));assert(html.includes('Check your work against'));}
  const first=renderToStaticMarkup(React.createElement(View,{view,resourceIndex:0}));assert(first.includes(view.resources[0].title));
  for(const resourceIndex of [-1,999,NaN,0.5]) assert(renderToStaticMarkup(React.createElement(View,{view,resourceIndex})).includes('No material selected.'));
}
const badTitle={kind:'worksheet' as const,title:'<script>unsafe</script>',instructions:'<img src=x onerror=alert(1)>',resources:[]};
const escaped=renderToStaticMarkup(React.createElement(View,{view:badTitle}));assert(escaped.includes('&lt;script&gt;'));assert(!escaped.includes('<script>'));assert(!escaped.includes('<img'));
console.log('Studio unmounted learner renderer: eight material views, structured safety/rubric/tables, answer exclusion and inert rendering passed; no browser/admin E2E claim.');

for(const partial of [false,true]) {
  const changed=structuredClone(inventory);
  changed[0].course.labs![0].tables=[{id:'one-column',columns:['Observation'],rows:2,...(partial?{rowLabels:['Fixed label']}: {})}];
  const doc=buildStudioDocument('lab','lab-tables','Lab tables',studioChoices('lab',changed).map(r=>({source:r.source,key:r.key})),changed);
  const html=renderToStaticMarkup(React.createElement(View,{view:studioLearnerView(doc)}));
  assert.equal((html.match(/<td>/g)??[]).length,partial?1:2,'unlabeled first-column cells must remain blank learner response cells');
  assert.equal((html.match(/scope="row"/g)??[]).length,partial?1:0);
  assert(html.includes('Blank response row 2 column 1'));
}
