import assert from 'node:assert/strict';
import {emptyCourse,exportCourseSnapshot,normalizeCourse} from '../src/lib/course.ts';
import {importValidatedCourseSnapshot} from '../src/lib/courseIntegrity.ts';
import {emptyScientificPack,scientificInstrumentChannels} from '../src/lib/scientificWorkspace.ts';
import {parseCourseScientificWorkspaces,setCourseScientificWorkspace,scientificRevisionProblems} from '../src/lib/scientificCoursePackage.ts';
import {checkDoc,toCourse,migrateCommunityDocToCanonical} from '../src/lib/communityFormat.ts';
import {downloadCommunityCourse} from '../src/lib/community.ts';
import {canonicalAuthoringFromCourse,validateCanonicalAuthoring} from '../src/lib/canonicalAuthoring.ts';
import {sha256Hex} from '../src/lib/courseSign.ts';
import {compareCourseRevisions} from '../src/lib/courseRevision.ts';
const pack=emptyScientificPack('fictional-project');pack.revision=1;
pack.steps[0].instructions='Test-only measurement procedure';
let base=emptyCourse('Synthetic scientific portability');base.revision=1;base.lessons=[{id:'intro',module:base.modules[0].id,title:'Fixture',body:''}];
const course=setCourseScientificWorkspace(base,{...pack,lessonId:'intro'});
assert.deepEqual(importValidatedCourseSnapshot(exportCourseSnapshot(course)).scientificWorkspaces,course.scientificWorkspaces);
const changedSource=structuredClone(course.scientificWorkspaces!);changedSource[0].title+=' revised';assert(scientificRevisionProblems(course.scientificWorkspaces!,changedSource).length);changedSource[0].revision++;assert.deepEqual(scientificRevisionProblems(course.scientificWorkspaces!,changedSource),[]);
const canonical=canonicalAuthoringFromCourse(course);assert.deepEqual(validateCanonicalAuthoring(canonical,{strict:true}),[]);
const digest=await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(course)));
for(const change of [(p:any)=>p.safety+=' revised',(p:any)=>p.assumptions+=' revised',(p:any)=>p.channels[0].uncertaintyMax+=1,(p:any)=>p.design.brief+=' changed']){const next=structuredClone(course);change(next.scientificWorkspaces![0]);assert.notEqual(await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(next))),digest);}
assert(compareCourseRevisions(course,{...course,revision:2,scientificWorkspaces:[]}).some(x=>x.severity==='blocking' && x.path==='scientificWorkspaces'));
const doc:any={format:'erudior-community',version:1,title:'Synthetic project',description:'Tests only',subject:'Math',level:'High School',type:'Course',modules:[{id:'m1',title:'Fixture'}],lessons:[{id:'intro',module:'m1',title:'Fixture',blocks:[]}],decks:[],scientificWorkspaces:[{...pack,lessonId:'intro'}]};
assert.deepEqual(checkDoc(doc,true),[]);
for(const invalid of [null,{},[null]])assert(checkDoc({...doc,scientificWorkspaces:invalid},true).length);
assert.deepEqual(normalizeCourse(toCourse(doc,{id:'fixture',version:1,review:'not_reviewed',author:'Fixture'} as any,()=>{throw Error('Unexpected asset');})).scientificWorkspaces,doc.scientificWorkspaces);
const migrated=migrateCommunityDocToCanonical(doc,'fixture');assert.deepEqual(checkDoc(migrated,true),[]);
let responseDoc=doc,calls=0;const oldFetch=globalThis.fetch;
globalThis.fetch=async()=>{calls++;return Response.json({id:'fixture',version:1,review:'not_reviewed',author:'Fixture',doc:responseDoc});};
try{
 const installed=normalizeCourse(await downloadCommunityCourse('fixture'));assert.deepEqual(installed.scientificWorkspaces,doc.scientificWorkspaces);
 for(const mutate of [(p:any)=>p.graph.xChannelId='missing',(p:any)=>p.approval={actor:'Imported',at:'2026-10-29T00:00:00Z'},(p:any)=>p.lessonId='missing',(p:any)=>p.instrument.kind='eval']){
  responseDoc=structuredClone(doc);mutate(responseDoc.scientificWorkspaces[0]);assert(checkDoc(responseDoc,true).length);calls=0;await assert.rejects(()=>downloadCommunityCourse('fixture'));assert.equal(calls,1,'invalid scenarios rejected before image requests');
 }
}finally{globalThis.fetch=oldFetch;}
assert.throws(()=>parseCourseScientificWorkspaces(Array(1),new Set()));assert.throws(()=>parseCourseScientificWorkspaces([Object.assign(Object.create({extra:true}),pack)],new Set()));assert.throws(()=>parseCourseScientificWorkspaces([pack,pack],new Set()));assert.throws(()=>parseCourseScientificWorkspaces(Array(31).fill(pack),new Set()));
console.log('Scientific course: exact canonical/community roundtrip, source digest changes, retention and pre-download validation passed');

for(const kind of ['circuit','gas'] as const){const p=emptyScientificPack(`fixture-${kind}`);p.revision=1;p.instrument={kind};p.channels=scientificInstrumentChannels(kind);p.graph={xChannelId:p.channels[0].id,yChannelId:p.channels[1].id};p.design.criteria=[{id:'target',title:'Synthetic criterion',channelId:p.channels[1].id,min:p.channels[1].min,max:p.channels[1].max}];const c=setCourseScientificWorkspace(base,{...p,lessonId:'intro'});assert.deepEqual(importValidatedCourseSnapshot(exportCourseSnapshot(c)).scientificWorkspaces,c.scientificWorkspaces);const d={...doc,scientificWorkspaces:c.scientificWorkspaces};assert.deepEqual(checkDoc(d,true),[]);assert.deepEqual(normalizeCourse(toCourse(d,{id:'fixture',version:1,review:'not_reviewed',author:'Fixture'} as any,()=>{throw Error('Unexpected asset');})).scientificWorkspaces,c.scientificWorkspaces);}
