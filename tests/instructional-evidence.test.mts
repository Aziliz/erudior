import assert from 'node:assert/strict';
import {parseInstructionalPack,parseInstructionalAssignment,parseInstructionalEvidence,parseInstructionalLibrary,emptyInstructionalLibrary,instructionalReport,importInstructionalPack,exportInstructionalReport,deleteInstructionalStudent,parseInstructionalSource} from '../src/lib/instructionalEvidence';
const at='2026-01-01T12:00:00Z';
const source={kind:'lesson',courseId:'synthetic',courseRevision:1,itemId:'lesson',title:'Synthetic lesson',snapshot:JSON.stringify({id:'lesson',module:'m',title:'Synthetic lesson',body:'Synthetic test source only.'})};
const pack:any={format:'erudior-instructional-pack',version:1,id:'pack',revision:1,title:'Synthetic requirements',jurisdiction:{id:'test',name:'Synthetic jurisdiction',version:'1',sourceNote:'Synthetic, no regulatory claim.',effectiveFrom:'2026-01-01',effectiveThrough:'2026-12-31'},methodNote:'Human review of equivalent workload, no timer.',requirements:[{id:'r',title:'Synthetic outline objective',minutes:60}],mappings:[{id:'m',requirementId:'r',title:'Lesson work',minutes:60,rationale:'Synthetic calibrated task workload.',source}],approval:{at,actor:'Reviewer'}};
const assignment:any={id:'a',revision:1,studentId:'alice',title:'Synthetic assignment',instructions:'Complete and provide evidence.',startDate:'2026-01-01',pack,createdAt:at};
const evidence:any={id:'e',assignmentId:'a',assignmentRevision:1,studentId:'alice',mappingId:'m',sourceKey:'lesson/synthetic/lesson',observedAt:at,activityDate:'2026-01-01',note:'Existing completion observation, historical source unverified.',provenance:'local-observation',raw:'{"done":true,"rawSeconds":123}',completed:true};
const decision:any={id:'d',evidenceId:'e',at,actor:'Reviewer',status:'approved',minutes:60,note:'Explicit reviewed equivalent workload.'};
const state:any={...emptyInstructionalLibrary(),packs:[pack],assignments:[assignment],evidence:[evidence],decisions:[decision]};
assert.equal(parseInstructionalPack(pack).title,pack.title);
assert.equal(instructionalReport(state,'a').approvedMinutes,60);
assert.equal(instructionalReport(state,'a').complete,true);
assert.equal(instructionalReport({...state,decisions:[]},'a').approvedMinutes,0,'raw completion and seconds never credit');
assert.equal(instructionalReport({...state,pendingApproval:['pack@1']},'a').approvedMinutes,0);
assert.equal(instructionalReport({...state,pendingDecisionIds:['d']},'a').approvedMinutes,0);
assert.equal(instructionalReport({...state,pendingDecisionIds:['d'],decisions:[decision,{...decision,id:'d2',note:'Fresh explicit evidence review'}]},'a').approvedMinutes,60);
assert.equal(instructionalReport({...state,decisions:[decision,{...decision,id:'d2',status:'revoked',minutes:0}]},'a').approvedMinutes,0);
assert.equal(instructionalReport({...state,decisions:[decision,{...decision,id:'d2',status:'rejected',minutes:0}]},'a').evidence[0].history.length,2);
assert.equal(importInstructionalPack(pack).approval,undefined);assert.equal(importInstructionalPack(pack).revision,0);
assert.match(exportInstructionalReport(state,'a'),/rawSeconds/);
assert.match(exportInstructionalReport(state,'a'),/source history.*unverified/);
const deleted=deleteInstructionalStudent({...state,pendingDecisionIds:['d']},'alice');assert.equal(deleted.evidence.length,0);assert.equal(deleted.decisions.length,0);assert.equal(deleted.packs.length,1);assert.deepEqual(deleted.pendingDecisionIds,[]);
const mutation=(base:any,change:(v:any)=>void)=>{const v=structuredClone(base);change(v);return v;};
for(const [name,change] of [
 ['normalized date',(v:any)=>v.jurisdiction.effectiveFrom='2026-02-30'],
 ['unknown field',(v:any)=>v.approved=true],
 ['fractional workload',(v:any)=>v.requirements[0].minutes=0.5],
 ['uncovered requirement',(v:any)=>v.requirements[0].minutes=61],
 ['duplicate source',(v:any)=>v.mappings.push({...v.mappings[0],id:'m2',source:{...source,courseRevision:2}})],
 ['missing assessment',(v:any)=>v.requirements[0].minimumAssessmentPercent=80],
 ['unknown source',(v:any)=>v.mappings[0].source.snapshot='{"id":"other"}'],
 ['malformed source',(v:any)=>v.mappings[0].source.snapshot='{'],
 ['prototype ID',(v:any)=>v.id='constructor'],
] as const)assert.throws(()=>parseInstructionalPack(mutation(pack,change)),undefined,name);
assert.throws(()=>parseInstructionalSource({...source,snapshot:JSON.stringify({id:'lesson',body:'No module/title'})}));
assert.throws(()=>parseInstructionalAssignment({...assignment,pack:{...pack,approval:undefined}}));
assert.throws(()=>parseInstructionalEvidence({...evidence,activityDate:'2027-01-01'}));
for(const [name,change] of [
 ['unknown assignment',(s:any)=>s.evidence[0].assignmentId='missing'],
 ['wrong owner',(s:any)=>s.evidence[0].studentId='bob'],
 ['wrong mapping',(s:any)=>s.evidence[0].mappingId='missing'],
 ['future decision',(s:any)=>s.decisions[0].at='2025-01-01T00:00:00Z'],
 ['overcredit',(s:any)=>s.decisions[0].minutes=61],
 ['incomplete',(s:any)=>s.evidence[0].completed=false],
 ['false provenance',(s:any)=>s.evidence[0].provenance='external-attestation'],
 ['lesson score',(s:any)=>s.evidence[0].assessmentPercent=100],
 ['unknown pending',(s:any)=>s.pendingDecisionIds=['missing']],
 ['changed exact snapshot',(s:any)=>s.assignments[0].pack={...s.assignments[0].pack,title:'Changed'}],
 ['deleted history',(s:any)=>s.deletedStudentIds=['alice']],
] as const)assert.throws(()=>parseInstructionalLibrary(mutation(state,change)),undefined,name);
const duplicate=mutation(state,s=>{s.assignments.push({...assignment,id:'other'});s.evidence.push({...evidence,id:'e2',assignmentId:'other',sourceKey:'different-attempt'});s.decisions.push({...decision,id:'d2',evidenceId:'e2'});});
assert.throws(()=>parseInstructionalLibrary(duplicate),/mapped source already credited/,'new assignment/attempt identity does not duplicate workload');
const revoked=mutation(duplicate,s=>s.decisions.splice(1,0,{...decision,id:'revoke',status:'revoked',minutes:0}));assert.equal(parseInstructionalLibrary(revoked).decisions.length,3);
const assessment=mutation(state,s=>{const p=s.packs[0];p.requirements[0].minimumAssessmentPercent=80;p.mappings.push({id:'exam',requirementId:'r',title:'Assessment',minutes:0,rationale:'Required assessment gate, no additional minutes.',source:{kind:'assessment',courseId:'synthetic',courseRevision:1,itemId:'bank',title:'Synthetic bank',snapshot:'{"id":"bank","title":"Synthetic bank","questions":[{"id":"q","topic":"Synthetic","stem":"Synthetic?","choices":["Yes"],"answer":[0]}]}'}});s.assignments[0].pack=structuredClone(p);});
assert.equal(instructionalReport(assessment,'a').complete,false,'instructional minutes do not replace assessment');
assessment.evidence.push({...evidence,id:'exam-e',mappingId:'exam',sourceKey:'attempt-1',assessmentPercent:80});assessment.decisions.push({...decision,id:'exam-d',evidenceId:'exam-e',minutes:0});assert.equal(instructionalReport(assessment,'a').complete,true);
assert.throws(()=>parseInstructionalLibrary(mutation(assessment,s=>s.evidence[1].assessmentPercent=79)),/threshold/);
const receipts={...state,restoredAt:at,packReviews:[{packKey:'pack@1',at,actor:'Fresh reviewer'}]};assert.equal(instructionalReport(receipts,'a').packReviews[0].actor,'Fresh reviewer');assert.equal(instructionalReport(receipts,'a').restoredAt,at);assert.throws(()=>parseInstructionalLibrary({...state,packReviews:[{packKey:'missing@1',at,actor:'Reviewer'}]}),/source missing/);
const copy=parseInstructionalLibrary(state);copy.evidence[0].note='changed';assert.notEqual(state.evidence[0].note,'changed');
console.log('Instructional evidence model: strict sources/dates/limits, exact history, equivalent workload, assessment gates, cross-assignment duplicate prevention, corrections, restore quarantine and deletion passed');
