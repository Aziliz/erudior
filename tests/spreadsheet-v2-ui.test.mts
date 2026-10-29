import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { emptyCourse } from '../src/lib/course.ts';
import type { Course, Progress } from '../src/lib/types.ts';
import type { AppApi } from '../src/App.tsx';
import { spreadsheetDraftKey } from '../src/lib/spreadsheetLearnerState.ts';
const dom=new JSDOM('<!doctype html><body><div id="root"></div></body>',{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
const {createElement,act}=await import('react');const {createRoot}=await import('react-dom/client');
const {default:Editor}=await import('../src/components/CourseSpreadsheetEditor.tsx');
const {default:Learner}=await import('../src/components/SpreadsheetCourseAssignment.tsx');
const root=createRoot(document.getElementById('root')!);
const button=(text:string)=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent?.trim()===text);assert.ok(b,`button ${text}`);return b;};
const field=(name:string)=>{const l=[...document.querySelectorAll('label')].find(x=>(x.firstChild?.textContent?.trim()===name||x.textContent?.trim()===name));assert.ok(l,`label ${name}`);const input=l.querySelector('input,textarea,select')??document.getElementById(l.htmlFor);assert.ok(input,`input ${name}`);return input as HTMLInputElement;};
async function click(t:string){await act(async()=>button(t).click());}
async function fill(t:string,v:string){const el=field(t);const proto=el.tagName==='SELECT'?dom.window.HTMLSelectElement.prototype:el.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;await act(async()=>{Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(el,v);el.dispatchEvent(new dom.window.Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));});}
let course=emptyCourse('Synthetic functions workflow');course.lessons=[{id:'lesson',module:course.modules[0].id,title:'Fixture',body:''}];
function renderEditor(){return createElement(Editor,{course,update:(fn:(c:Course)=>Course)=>{course=fn(course);},onEditingChange:()=>{}});}
await act(async()=>root.render(renderEditor()));await click('Add spreadsheet assignment');await click('Enable version 2 workbook features');
await fill('Range name','Inputs');await fill('Feature range','B1:B2');await click('Add or replace named range');
await fill('Feature range','B3');await fill('Minimum (optional)','0');await click('Add validation rule');
await fill('Explanation cell','B3');await fill('Cell explanation','Use SUM on the named input range.');await click('Add or replace explanation');
await fill('Macro ID','sum');await fill('Macro title','Calculate sum');await fill('Step target (worksheet!cell)','Budget!B3');await fill('Step value','=SUM(Inputs)');await click('Add macro step');await click('Save macro definition');
await fill('Expected result','1650');await fill('Graded cell','Budget!B3');await click('Add or replace criterion');
await fill('Range name','Unapplied');await click('Apply assignment to course');assert.equal(course.spreadsheetAssignments?.length??0,0,'pending feature fields block apply');await click('Discard pending feature fields');await click('Apply assignment to course');assert.equal(course.spreadsheetAssignments?.length,1);const assignment=course.spreadsheetAssignments![0];assert.equal(assignment.starter.engineVersion,2);assert.equal(assignment.starter.namedRanges?.Inputs.range,'B1:B2');assert.equal(assignment.starter.macroDefinitions?.[0].steps.length,1);
await act(async()=>root.render(createElement(Editor,{key:'reopen',course,update:(fn:(c:Course)=>Course)=>{course=fn(course);},onEditingChange:()=>{}})));await click('Edit New spreadsheet assignment');await fill('Starter cell','C1');await fill('Starter content','Retained metadata');await click('Set starter cell');await click('Apply assignment to course');assert.deepEqual(course.spreadsheetAssignments![0].starter.namedRanges,assignment.starter.namedRanges);
let progress={} as Progress;const api={student:null,progress,updateProgress:async(fn:(p:Progress)=>Progress)=>{progress=fn(progress);api.progress=progress;}} as unknown as AppApi;
await act(async()=>root.render(createElement(Learner,{api,courseId:course.id,assignment})));
await fill('Budget!B3','-2');await click('Apply cell edit');assert.match(document.body.textContent!,/minimum|validation|range|below/i);assert.equal(JSON.parse(localStorage.getItem(spreadsheetDraftKey(null,course.id,assignment.id))??'{}').workbook,undefined,'invalid edit not persisted');
await click('Discard cell edit');await click('Preview Calculate sum');assert.equal(button('Apply simulated macro').disabled,true);await click('Cancel macro preview');assert.equal(field('Budget!B3').value,'');
await click('Preview Calculate sum');await act(async()=>document.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click());await click('Apply simulated macro');assert.equal(field('Budget!B3').value,'=SUM(Inputs)');assert.match(document.body.textContent!,/Result: 1650/);
const raw=localStorage.getItem(spreadsheetDraftKey(null,course.id,assignment.id))!;assert.equal(JSON.parse(raw).macroRuns.length,1);
await click('Submit for instructor review');const submission=Object.values(progress.spreadsheetSubmissions!)[0];assert.equal(submission.gradingVersion,2);assert.equal(submission.macroRuns?.length,1);assert.equal(submission.grade.score,1);
await fill('Budget!B3','100');await click('Apply cell edit');assert.equal(submission.workbook.sheets.Budget.B3,'=SUM(Inputs)','history unchanged');assert.equal(submission.macroRuns?.[0].after.sheets.Budget.B3,'=SUM(Inputs)');
await act(async()=>root.render(createElement(Learner,{key:'reopen-learner',api,courseId:course.id,assignment})));assert.equal(field('Budget!B3').value,'100');assert.match(document.body.textContent!,/Run 1: Calculate sum/);
// Public practice lab must not grade old committed values or silently discard staged edits.
const {default:Lab}=await import('../src/components/SpreadsheetLab.tsx');
await act(async()=>root.render(createElement(Lab)));
await click('Start graded assignment');
const labInput=()=>document.querySelector<HTMLInputElement>('[aria-label="Selected cell contents"]')!;
async function labFill(value:string){await act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!.call(labInput(),value);labInput().dispatchEvent(new dom.window.Event('input',{bubbles:true}));});}
await labFill('pending input');await click('Grade assignment');assert.doesNotMatch(document.body.textContent!,/Assignment score:/,'pending value not graded');await click('Start graded assignment');assert.equal(labInput().value,'pending input');
await click('Create assignment');assert.equal(document.querySelector('[aria-label="Spreadsheet assignment author"]'),null,'pending cell blocks author switch');
await click('Reset workbook');await click('Keep workbook');assert.equal(labInput().value,'pending input','reset cancel retains edit');
await click('Discard pending workbook edits');await click('Reset workbook');await click('Confirm reset workbook');await click('Edit workbook features');await click('Enable version 2 workbook features');await fill('Range name','UnappliedName');await click('Close workbook features');assert.ok(document.querySelector('[aria-label="Workbook feature authoring"]'),'feature close blocked');await click('Start graded assignment');assert.ok(document.querySelector('[aria-label="Workbook feature authoring"]'),'start cannot discard pending metadata');
await click('Discard pending workbook edits');await click('Close workbook features');await click('Create assignment');await fill('Assignment title','Unapplied assignment');await click('Close assignment editor');assert.ok(document.querySelector('[aria-label="Spreadsheet assignment author"]'),'author close blocked');await click('Discard pending workbook edits');assert.equal(document.querySelector('[aria-label="Spreadsheet assignment author"]'),null);
await act(async()=>root.unmount());console.log('Spreadsheet v2 UI: structured author/reopen, validation, explicit macro consent/cancel, traces, immutable submit/recovery passed');
