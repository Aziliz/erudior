import assert from 'node:assert/strict';
import {emptyCourse,exportCourseSnapshot,normalizeCourse} from '../src/lib/course.ts';
import {importValidatedCourseSnapshot} from '../src/lib/courseIntegrity.ts';
import {emptyBranchingPack} from '../src/lib/branchingEngine.ts';
import {parseCourseBranchingScenarios,setCourseBranchingScenario,branchingRevisionProblems} from '../src/lib/branchingCoursePackage.ts';
import {checkDoc,toCourse,migrateCommunityDocToCanonical} from '../src/lib/communityFormat.ts';
import {downloadCommunityCourse} from '../src/lib/community.ts';
import {canonicalAuthoringFromCourse,validateCanonicalAuthoring} from '../src/lib/canonicalAuthoring.ts';
import {sha256Hex} from '../src/lib/courseSign.ts';
import {compareCourseRevisions} from '../src/lib/courseRevision.ts';
const pack=emptyBranchingPack('fictional-project');pack.revision=1;
pack.variables=[{id:'resources',title:'Resources',initial:3,min:0,max:10}];
pack.nodes=[{id:'start',title:'Plan',text:'Test-only fictional project.',choices:[{id:'proceed',title:'Proceed',to:'finish',costTicks:2,conditions:[{variable:'resources',op:'gte',value:1}],effects:[{variable:'resources',op:'add',value:-1}],consequence:'A simulated resource was used.'}]},{id:'finish',title:'Completed',text:'Test-only outcome.',terminal:'success',choices:[]}];
pack.milestones=[{id:'delivery',title:'Deliver project',nodeId:'finish',deadlineTick:3,required:true,consequence:'Missed delivery.',onMiss:[{variable:'resources',op:'set',value:0}]}];
let base=emptyCourse('Synthetic branching portability');base.revision=1;base.lessons=[{id:'intro',module:base.modules[0].id,title:'Fixture',body:''}];
const course=setCourseBranchingScenario(base,{...pack,lessonId:'intro'});
assert.deepEqual(importValidatedCourseSnapshot(exportCourseSnapshot(course)).branchingScenarios,course.branchingScenarios);
const changedSource=structuredClone(course.branchingScenarios!);changedSource[0].title+=' revised';assert(branchingRevisionProblems(course.branchingScenarios!,changedSource).length);changedSource[0].revision++;assert.deepEqual(branchingRevisionProblems(course.branchingScenarios!,changedSource),[]);
const canonical=canonicalAuthoringFromCourse(course);assert.deepEqual(validateCanonicalAuthoring(canonical,{strict:true}),[]);
const digest=await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(course)));
for(const change of [(p:any)=>p.nodes[0].choices[0].costTicks++,(p:any)=>p.milestones[0].deadlineTick++,(p:any)=>p.variables[0].initial++,(p:any)=>p.nodes[0].text+=' changed']){const next=structuredClone(course);change(next.branchingScenarios![0]);assert.notEqual(await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(next))),digest);}
assert(compareCourseRevisions(course,{...course,revision:2,branchingScenarios:[]}).some(x=>x.severity==='blocking' && x.path==='branchingScenarios'));
const doc:any={format:'erudior-community',version:1,title:'Synthetic project',description:'Tests only',subject:'Math',level:'High School',type:'Course',modules:[{id:'m1',title:'Fixture'}],lessons:[{id:'intro',module:'m1',title:'Fixture',blocks:[]}],decks:[],branchingScenarios:[{...pack,lessonId:'intro'}]};
assert.deepEqual(checkDoc(doc,true),[]);
for(const invalid of [null,{},[null]])assert(checkDoc({...doc,branchingScenarios:invalid},true).length);
assert.deepEqual(normalizeCourse(toCourse(doc,{id:'fixture',version:1,review:'not_reviewed',author:'Fixture'} as any,()=>{throw Error('Unexpected asset');})).branchingScenarios,doc.branchingScenarios);
const migrated=migrateCommunityDocToCanonical(doc,'fixture');assert.deepEqual(checkDoc(migrated,true),[]);
let responseDoc=doc,calls=0;const oldFetch=globalThis.fetch;
globalThis.fetch=async()=>{calls++;return Response.json({id:'fixture',version:1,review:'not_reviewed',author:'Fixture',doc:responseDoc});};
try{
 const installed=normalizeCourse(await downloadCommunityCourse('fixture'));assert.deepEqual(installed.branchingScenarios,doc.branchingScenarios);
 for(const mutate of [(p:any)=>p.nodes[0].choices[0].to='missing',(p:any)=>p.approval={actor:'Imported',at:'2026-10-29T00:00:00Z'},(p:any)=>p.lessonId='missing',(p:any)=>p.nodes[0].choices[0].effects[0].op='eval']){
  responseDoc=structuredClone(doc);mutate(responseDoc.branchingScenarios[0]);assert(checkDoc(responseDoc,true).length);calls=0;await assert.rejects(()=>downloadCommunityCourse('fixture'));assert.equal(calls,1,'invalid scenarios rejected before image requests');
 }
}finally{globalThis.fetch=oldFetch;}
assert.throws(()=>parseCourseBranchingScenarios([pack,pack],new Set()));assert.throws(()=>parseCourseBranchingScenarios(Array(31).fill(pack),new Set()));
console.log('Branching course: exact canonical/community roundtrip, source digest changes, retention and pre-download validation passed');
