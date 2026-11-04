import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {activitySourceMatches} from '../src/lib/activitySourceMatch.ts';
import {syntheticAdvancedAssessmentPack} from './fixtures/advanced-assessment-data.ts';
import {syntheticScientificPack} from './fixtures/scientific-data.ts';
import {syntheticBranchingPack} from './fixtures/branching-data.ts';
import * as advanced from '../src/lib/advancedAssessment.ts';
import * as scientific from '../src/lib/scientificWorkspace.ts';
import * as branching from '../src/lib/branchingEngine.ts';
import {createAdvancedAssessmentStore} from '../src/lib/advancedAssessmentStore.ts';
import {createScientificWorkspaceStore} from '../src/lib/scientificWorkspaceStore.ts';
import {createBranchingEngineStore} from '../src/lib/branchingEngineStore.ts';
import {parseCourseAdvancedAssessments} from '../src/lib/advancedAssessmentCoursePackage.ts';
import {parseCourseScientificWorkspaces} from '../src/lib/scientificCoursePackage.ts';
import {parseCourseBranchingScenarios} from '../src/lib/branchingCoursePackage.ts';
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const React=await import('react'),{createRoot}=await import('react-dom/client');
const cases=[
 {pack:syntheticAdvancedAssessmentPack(),model:advanced,stem:'AdvancedAssessment',store:createAdvancedAssessmentStore,course:parseCourseAdvancedAssessments,service:'advancedAssessmentLearner',extra:{variantId:'a'}},
 {pack:syntheticScientificPack(),model:scientific,stem:'Scientific',store:createScientificWorkspaceStore,course:parseCourseScientificWorkspaces,service:'scientificLearner',extra:{}},
 {pack:syntheticBranchingPack(),model:branching,stem:'Branching',store:createBranchingEngineStore,course:parseCourseBranchingScenarios,service:'branchingLearner',extra:{startTick:0}},
];
const root=createRoot(document.getElementById('root')!),wait=()=>new Promise(r=>setTimeout(r,0));
for(const c of cases){
 const source={...c.pack,revision:7},m=c.model as any,origin={courseId:'synthetic-course',courseRevision:9,sourceId:source.id,sourceRevision:7};
 const local={...m['import'+c.stem+'Pack'](source,'local-copy'),courseOrigin:origin};
 assert(activitySourceMatches(local,source,origin.courseId,9));
 assert(!activitySourceMatches(local,source,'other-course',9));assert(!activitySourceMatches(local,source,origin.courseId,10));
 assert(!activitySourceMatches({...local,title:'Changed title'},source,origin.courseId,9));
 assert(!activitySourceMatches({...local,sourceNote:'Changed provenance'},source,origin.courseId,9));
 assert(!activitySourceMatches({...local,courseOrigin:undefined},source,origin.courseId,9));
 assert(!('courseOrigin' in m['import'+c.stem+'Pack'](local)));
 assert(!('courseOrigin' in JSON.parse(m['export'+c.stem+'Pack'](local))));
 assert.throws(()=>c.course([local],new Set()));
 assert.throws(()=>m['parse'+c.stem+'Pack']({...local,courseOrigin:{...origin,sourceRevision:-1}}));
 let saved:string|null=null,writes=0;
 const store=(c.store as any)({read:async()=>saved,update:async(change:any)=>{writes++;saved=await change(saved);return saved;},authorizeAdult:async()=>({actorId:'teacher',actorName:'Teacher',authorityKey:'key'}),learnerContext:async()=>({studentId:'alice',authorityKey:'alice'}),now:()=>new Date().toISOString()});
 let pack=await store.supervisor.savePack(local,null);assert.equal(pack.revision,1);assert.deepEqual(pack.courseOrigin,origin);
 pack=await store.supervisor.approvePack(pack.id,pack.revision);
 assert(activitySourceMatches(pack,source,origin.courseId,9));
 await store.supervisor.assign({id:'assigned',studentId:'alice',title:'Matching assignment',instructions:'Synthetic only.',pack,...c.extra},null);
 const snapshot=saved,before=writes;
 const Learner=(await import('../src/components/Learner'+c.stem+'.tsx')).default;
 let resolve:((value:any)=>void)|undefined;
 const api:any={student:{id:'alice'},family:{parent:{password:'key'}},[c.service]:store.learner};
 const render=async(props:any)=>React.act(async()=>{root.render(React.createElement(React.StrictMode,null,React.createElement(Learner,{api,source,courseId:origin.courseId,courseRevision:9,...props})));await wait();});
 await render({});assert.match(document.body.textContent!,/Matching assignment/);
 const open=[...document.querySelectorAll<HTMLButtonElement>('button')].find(b=>b.textContent?.startsWith('Matching assignment'))!;
 await React.act(async()=>{open.click();await wait();});
 assert.match(document.body.textContent!,/Synthetic only/);
 await render({source:{...source,title:'Changed title'}});assert.doesNotMatch(document.body.textContent!,/Matching assignment|Synthetic only/);assert.match(document.body.textContent!,/No assignment matches this exact course source/);
 // Delayed previous-source load cannot overwrite the newly selected source.
 await render({api:{...api,[c.service]:{...store.learner,load:()=>new Promise(r=>resolve=r)}},source});
 await render({source:{...source,revision:8}});
 await React.act(async()=>{resolve?.(await store.learner.load());await wait();});
 assert.doesNotMatch(document.body.textContent!,/Matching assignment/);
 await render({source:undefined,courseId:undefined,courseRevision:undefined});assert.match(document.body.textContent!,/Matching assignment/);
 assert.equal(writes,before);assert.equal(saved,snapshot);
}
await React.act(async()=>root.unmount());
console.log('Exact course activity binding, authority-neutral import/export, source filtering, generic history and stale-source races passed for all three engines.');
