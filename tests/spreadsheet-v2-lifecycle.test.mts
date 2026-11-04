import assert from 'node:assert/strict';
const state=new Map<string,string>();const writes:string[]=[];
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
 if(command==='load_state')return state.get(args.name)??null;
 if(command==='compare_and_swap_state'){if((state.get(args.name)??null)!==args.expected)return false;writes.push(args.name);state.set(args.name,args.content);return true;}
 if(command==='save_state'){writes.push(args.name);if(args.content===null)state.delete(args.name);else state.set(args.name,args.content);return;}
 if(command==='load_progress')return state.get('progress')??null;
 if(command==='save_progress'){writes.push('progress');state.set('progress',args.content);return;}
 if(command==='delete_item'){writes.push('delete:'+args.id);return;}
 throw Error('Unexpected storage command: '+command);
}}};

const { emptyCourse, exportCourseSnapshot, normalizeCourse }=await import('../src/lib/course.ts');
const { importValidatedCourseSnapshot }=await import('../src/lib/courseIntegrity.ts');
const { checkDoc }=await import('../src/lib/communityFormat.ts');
const { downloadCommunityCourse, ApiError }=await import('../src/lib/community.ts');
const { attachSpreadsheetAssignment }=await import('../src/lib/spreadsheetCoursePackage.ts');
const { acknowledgeSpreadsheetReview }=await import('../src/lib/spreadsheetReview.ts');
const { validateSpreadsheetReleaseApproval }=await import('../src/lib/spreadsheetReleaseApproval.ts');
const { sha256Hex }=await import('../src/lib/courseSign.ts');
const { gradeAssignment, SAMPLE_ASSIGNMENT }=await import('../src/lib/spreadsheetAssignments.ts');
const { createSpreadsheetSubmission, validateSpreadsheetSubmission }=await import('../src/lib/spreadsheetEvidence.ts');
import type { Workbook } from '../src/lib/spreadsheet.ts';

const starter: Workbook = {
 engineVersion:2, sheets:{Data:{A1:12,A2:8,B1:''},Summary:{A1:'=SUM(Amounts)'}},
 namedRanges:{Amounts:{sheet:'Data',range:'A1:A2'}},
 validationRules:[{sheet:'Data',range:'B1',kind:'number',min:0,max:30,allowBlank:true}],
 cellExplanations:{'Data!B1':'Use the exact named input range.'},
 macroDefinitions:[{id:'total',title:'Simulate writing a total formula',steps:[{op:'set',target:'Data!B1',value:'=SUM(Amounts)'}]}],
};
const assignment={id:'v2-total',title:'Synthetic functions fixture',starter,protectedCells:['Data!A1','Data!A2','Summary!A1'],answers:{'Data!B1':20,'Summary!A1':20}};
const base=emptyCourse('Synthetic portable spreadsheet fixture');base.revision=1;
base.lessons=[{id:'intro',module:base.modules[0].id,title:'Synthetic fixture',body:'Test-only source.'}];
const course=attachSpreadsheetAssignment(base,'intro',assignment);
const snapshot=exportCourseSnapshot(course);
assert.deepEqual(importValidatedCourseSnapshot(snapshot).spreadsheetAssignments,course.spreadsheetAssignments);
const receipt=acknowledgeSpreadsheetReview(course,'Test reviewer','2026-10-29T09:00:00Z');
assert.equal(receipt.snapshot,snapshot);
const approval={courseId:course.id,revision:1,snapshotSha256:await sha256Hex(new TextEncoder().encode(snapshot)),reviewer:'Test reviewer',reviewedAt:'2026-10-29T09:00:00Z'};
assert.deepEqual(await validateSpreadsheetReleaseApproval(course,approval),[]);
for(const mutate of [
 (b:Workbook)=>{b.namedRanges!.Amounts.range='A1';},
 (b:Workbook)=>{b.validationRules![0].max=40;},
 (b:Workbook)=>{b.cellExplanations!['Data!B1']='Changed explanation';},
 (b:Workbook)=>{(b.macroDefinitions![0].steps[0] as any).value='=SUM(A1:A2)';},
]) {
 const changed=structuredClone(course);mutate(changed.spreadsheetAssignments![0].starter);
 assert((await validateSpreadsheetReleaseApproval(changed,approval)).some(e=>/digest/.test(e)),'every executable or instructional metadata change invalidates exact review');
 assert.equal(receipt.snapshot,snapshot,'earlier review remains immutable');
}
const solved=structuredClone(starter);solved.sheets.Data.B1='=SUM(Amounts)';
assert.equal(gradeAssignment(assignment,solved).score,1);
const doc:any={format:'erudior-community',version:1,title:'Synthetic portability fixture',description:'Tests only',subject:'Math',level:'High School',type:'Course',modules:[{id:'m1',title:'Fixture'}],lessons:[{id:'intro',module:'m1',title:'Fixture',blocks:[{type:'text',md:'Synthetic fixture.'}]}],decks:[],spreadsheetAssignments:[{...assignment,lessonId:'intro'}]};
assert.deepEqual(checkDoc(doc,true),[]);
let responseDoc=doc;let calls=0;const previousFetch=globalThis.fetch;
globalThis.fetch=async()=>{calls++;return Response.json({id:'fixture',version:3,review:'not_reviewed',author:'Fixture',doc:responseDoc});};
try {
 const installed=normalizeCourse(await downloadCommunityCourse('fixture'));
 assert.deepEqual(installed.spreadsheetAssignments,doc.spreadsheetAssignments);
 assert.deepEqual(gradeAssignment(installed.spreadsheetAssignments![0],solved),gradeAssignment(assignment,solved));
 assert.deepEqual(importValidatedCourseSnapshot(exportCourseSnapshot(installed)).spreadsheetAssignments,doc.spreadsheetAssignments);
 for(const mutate of [
  (b:any)=>{b.macroDefinitions[0].steps=[{op:'eval',code:'globalThis.pwned=true'}];},
  (b:any)=>{b.namedRanges.Amounts.range='A1:XFD1048576';},
  (b:any)=>{b.validationRules[0].kind='script';},
 ]) {
  responseDoc=structuredClone(doc);mutate(responseDoc.spreadsheetAssignments[0].starter);calls=0;
  responseDoc.lessons[0].blocks.push({type:'image',imageId:'should-not-fetch',alt:'Fixture'});
  assert(checkDoc(responseDoc,true).length>0);
  await assert.rejects(downloadCommunityCourse('fixture'),e=>e instanceof ApiError&&e.status===422);
  assert.equal(calls,1,'malformed V2 rejects before ancillary downloads');
 }
} finally {globalThis.fetch=previousFetch;}

// Production encrypted backup orchestration at the in-memory native boundary.
const {collect,restoreContents,encryptText,decryptText}=await import('../src/lib/backup.ts');
const {recordHandIn,reviewHandIn}=await import('../src/lib/submissionHistory.ts');
const {previewWorkbookMacro,applyWorkbookMacro}=await import('../src/lib/spreadsheetMacros.ts');
const preview=previewWorkbookMacro(starter,'total',assignment.protectedCells);
const macroSolved=applyWorkbookMacro(starter,preview,assignment.protectedCells,true);
assert.deepEqual(macroSolved.workbook,solved);
const v2=createSpreadsheetSubmission({id:'v2',submittedAt:1793264400000,courseId:course.id,lessonId:'intro',assignment,workbook:solved,macroRuns:[preview.trace]});
const v1=createSpreadsheetSubmission({id:'v1',submittedAt:1793264300000,courseId:'legacy',lessonId:'intro',assignment:SAMPLE_ASSIGNMENT,workbook:SAMPLE_ASSIGNMENT.starter});
assert.equal(v2.gradingVersion,2);assert.equal(v2.grade.score,1);assert.equal(v1.gradingVersion,1);assert.equal(v1.grade.score,0);
assert.deepEqual(validateSpreadsheetSubmission(v2),[]);assert.deepEqual(validateSpreadsheetSubmission(v1),[]);
const evidence={v1,v2};
const handin:any={format:'erudior-handin',version:1,classId:'class',className:'Fixture',studentId:'student',studentName:'Fixture',created:'2026-10-29T09:00:00Z',courses:[course.id,'legacy'],progress:{attempts:[],lessonsDone:{},drills:{},spreadsheetSubmissions:evidence},mac:btoa('s'.repeat(32))};
let records=recordHandIn([],handin,'2026-10-29T09:01:00Z').records;
records=reviewHandIn(records,records[0].id,'needs_revision','2026-10-29T09:02:00Z','Explain the named range','review');
const ledger={version:1,records,complete:[records[0].id]};
state.set('classroom-submissions',JSON.stringify(ledger));state.set('progress',JSON.stringify(handin.progress));
const backup=await collect([],[]);
const encrypted=await encryptText(JSON.stringify(backup),'synthetic backup passphrase');
assert(!encrypted.includes('Explain the named range'));
await assert.rejects(decryptText(JSON.parse(encrypted),'wrong passphrase'),/Wrong passphrase/);
state.clear();await restoreContents(await decryptText(JSON.parse(encrypted),'synthetic backup passphrase'),{courses:[],banks:[]});
assert.deepEqual(JSON.parse(state.get('classroom-submissions')!),ledger);
assert.deepEqual(JSON.parse(state.get('progress')!).spreadsheetSubmissions,evidence);
for(const corrupt of [
 {...v2,gradingVersion:1},
 {...v2,macroRuns:[{...preview.trace,changes:[]}]},
 {...v1,gradingVersion:2},
 {...v2,grade:{...v2.grade,score:0}},
 {...v2,workbook:{...solved,namedRanges:{Amounts:{sheet:'Data',range:'A1'}}}},
]) {
 const invalid=structuredClone(backup);(invalid.progress as any).spreadsheetSubmissions={v1,v2:corrupt};
 const before=[...state];writes.length=0;
 await assert.rejects(restoreContents(JSON.stringify(invalid),{courses:[{id:'never-delete'} as any],banks:[]}));
 assert.deepEqual([...state],before);assert.deepEqual(writes,[],'bad evidence rejected before mutation/deletion');
}
console.log('spreadsheet V2 lifecycle: exact canonical/community portability, review invalidation, malformed import preflight, immutable mixed-version classroom history and encrypted recovery passed');
