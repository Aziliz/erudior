import assert from 'node:assert/strict';
import {emptyCourse,exportCourseSnapshot,normalizeCourse} from '../src/lib/course.ts';
import {importValidatedCourseSnapshot} from '../src/lib/courseIntegrity.ts';
import {emptyAdvancedAssessmentPack} from '../src/lib/advancedAssessment.ts';
import {parseCourseAdvancedAssessments,setCourseAdvancedAssessment,advancedAssessmentRevisionProblems} from '../src/lib/advancedAssessmentCoursePackage.ts';
import {checkDoc,toCourse,migrateCommunityDocToCanonical} from '../src/lib/communityFormat.ts';
import {downloadCommunityCourse} from '../src/lib/community.ts';
import {canonicalAuthoringFromCourse,validateCanonicalAuthoring} from '../src/lib/canonicalAuthoring.ts';
import {sha256Hex} from '../src/lib/courseSign.ts';
import {compareCourseRevisions} from '../src/lib/courseRevision.ts';
const pack=emptyAdvancedAssessmentPack('fictional-project');pack.revision=1;
pack.instructions='Test-only measurement procedure';
let base=emptyCourse('Synthetic assessment portability');base.revision=1;base.lessons=[{id:'intro',module:base.modules[0].id,title:'Fixture',body:''}];
const course=setCourseAdvancedAssessment(base,{...pack,lessonId:'intro'});
assert.deepEqual(importValidatedCourseSnapshot(exportCourseSnapshot(course)).advancedAssessments,course.advancedAssessments);
const changedSource=structuredClone(course.advancedAssessments!);changedSource[0].title+=' revised';assert(advancedAssessmentRevisionProblems(course.advancedAssessments!,changedSource).length);changedSource[0].revision++;assert.deepEqual(advancedAssessmentRevisionProblems(course.advancedAssessments!,changedSource),[]);
const canonical=canonicalAuthoringFromCourse(course);assert.deepEqual(validateCanonicalAuthoring(canonical,{strict:true}),[]);
const digest=await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(course)));
for(const change of [(p:any)=>p.instructions+=' revised',(p:any)=>p.sourceNote+=' revised',(p:any)=>p.title+=" changed",(p:any)=>p.description+=' changed']){const next=structuredClone(course);change(next.advancedAssessments![0]);assert.notEqual(await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(next))),digest);}
assert(compareCourseRevisions(course,{...course,revision:2,advancedAssessments:[]}).some(x=>x.severity==='blocking' && x.path==='advancedAssessments'));
const doc:any={format:'erudior-community',version:1,title:'Synthetic project',description:'Tests only',subject:'Math',level:'High School',type:'Course',modules:[{id:'m1',title:'Fixture'}],lessons:[{id:'intro',module:'m1',title:'Fixture',blocks:[]}],decks:[],advancedAssessments:[{...pack,lessonId:'intro'}]};
assert.deepEqual(checkDoc(doc,true),[]);
for(const invalid of [null,{},[null]])assert(checkDoc({...doc,advancedAssessments:invalid},true).length);
assert.deepEqual(normalizeCourse(toCourse(doc,{id:'fixture',version:1,review:'not_reviewed',author:'Fixture'} as any,()=>{throw Error('Unexpected asset');})).advancedAssessments,doc.advancedAssessments);
const migrated=migrateCommunityDocToCanonical(doc,'fixture');assert.deepEqual(checkDoc(migrated,true),[]);
let responseDoc=doc,calls=0;const oldFetch=globalThis.fetch;
globalThis.fetch=async()=>{calls++;return Response.json({id:'fixture',version:1,review:'not_reviewed',author:'Fixture',doc:responseDoc});};
try{
 const installed=normalizeCourse(await downloadCommunityCourse('fixture'));assert.deepEqual(installed.advancedAssessments,doc.advancedAssessments);
 for(const mutate of [(p:any)=>p.variants=[],(p:any)=>p.approval={actor:'Imported',at:'2026-10-29T00:00:00Z'},(p:any)=>p.lessonId='missing',(p:any)=>p.version=99]){
  responseDoc=structuredClone(doc);mutate(responseDoc.advancedAssessments[0]);assert(checkDoc(responseDoc,true).length);calls=0;await assert.rejects(()=>downloadCommunityCourse('fixture'));assert.equal(calls,1,'invalid scenarios rejected before image requests');
 }
}finally{globalThis.fetch=oldFetch;}
assert.throws(()=>parseCourseAdvancedAssessments(Array(1),new Set()));assert.throws(()=>parseCourseAdvancedAssessments([Object.assign(Object.create({extra:true}),pack)],new Set()));assert.throws(()=>parseCourseAdvancedAssessments([pack,pack],new Set()));assert.throws(()=>parseCourseAdvancedAssessments(Array(31).fill(pack),new Set()));
console.log('Advanced assessment course: exact canonical/community roundtrip, source digest changes, retention and pre-download validation passed');
const rubricChanged=structuredClone(course.advancedAssessments!);rubricChanged[0].revision++;rubricChanged[0].rubric.criteria[0].levels[0].description+=' changed';assert(advancedAssessmentRevisionProblems(course.advancedAssessments!,rubricChanged).some(x=>x.includes('rubric')));rubricChanged[0].rubric.revision++;assert.deepEqual(advancedAssessmentRevisionProblems(course.advancedAssessments!,rubricChanged),[]);
const full=structuredClone(pack);full.misconceptions=[{id:'pattern',title:'Authored response pattern',explanation:'Discuss rather than infer cause.'}];const math=full.variants[0].questions.find(q=>q.kind==='math')!;if(math.kind==='math'){math.steps[0].expected={kind:'number',value:4,tolerance:0.01};math.steps[0].misconceptions=[{misconceptionId:'pattern',accepted:['5']}];math.steps[1].expected={kind:'text',accepted:['Explanation']};}full.variants.push({id:'b',title:'Variant B',questions:[{kind:'oral',id:'oral-b',prompt:'Explain an alternative approach.'}]});const all=setCourseAdvancedAssessment(base,{...full,lessonId:'intro'});assert.deepEqual(importValidatedCourseSnapshot(exportCourseSnapshot(all)).advancedAssessments,all.advancedAssessments);const allDoc={...doc,advancedAssessments:all.advancedAssessments};assert.deepEqual(checkDoc(allDoc,true),[]);assert.deepEqual(normalizeCourse(toCourse(allDoc,{id:'fixture',version:1,review:'not_reviewed',author:'Fixture'} as any,()=>{throw Error('Unexpected asset');})).advancedAssessments,all.advancedAssessments);
const allDigest=await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(all)));for(const change of [(p:any)=>p.rubric.criteria[0].levels[0].description+=' changed',(p:any)=>p.variants[0].questions[0].steps[0].expected.tolerance+=.01,(p:any)=>p.misconceptions[0].explanation+=' changed',(p:any)=>p.variants[1].questions[0].prompt+=' changed',(p:any)=>p.integrity+=' changed']){const next=structuredClone(all);change(next.advancedAssessments![0]);assert.notEqual(await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(next))),allDigest,'all assessment metadata participates in exact reviewed source digest');}
