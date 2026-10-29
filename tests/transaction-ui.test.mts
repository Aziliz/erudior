import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {parseTransactionPack,parseTransactionLibrary,emptyTransactionLibrary,replayTransaction} from '../src/lib/transactionEngine.ts';
import {createTransactionEngineStore} from '../src/lib/transactionEngineStore.ts';
import {requestNavigation} from '../src/lib/navigationGuard.ts';

const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:dom.window.navigator});
const React=await import('react'),{createRoot}=await import('react-dom/client');
const {default:Learner}=await import('../src/components/LearnerTransactions.tsx'),{default:Adult}=await import('../src/components/TransactionStudio.tsx');
const source={format:'erudior-document-template',version:1,id:'form',revision:1,title:'Synthetic source',sourceNote:'Synthetic original test source',licenseNote:'Synthetic permission only',pages:[{id:'page',title:'Source',text:'Fictional document evidence.'}],fields:[{id:'reason',pageId:'page',label:'Reasoning',kind:'text',required:true,maxLength:100,anchor:{x:.1,y:.1,width:.4,height:.1}},{id:'quantity',pageId:'page',label:'Bounded quantity',kind:'number',required:false,min:0,max:10}]};
let time=0,saved:string|null=null,student='alice',fail=false,hold=false,release:(()=>void)|undefined,updates=0,confirm=false;
dom.window.confirm=()=>confirm;
const store=createTransactionEngineStore({read:async()=>saved,update:async change=>{updates++;if(hold){hold=false;await new Promise<void>(r=>release=r);}if(fail){fail=false;throw Error('Synthetic save interruption');}saved=await change(saved);return saved;},authorizeAdult:async()=>({actorId:'teacher',actorName:'Teacher',authorityKey:'test'}),learnerContext:async()=>({studentId:student,authorityKey:'scope-'+student}),now:()=>new Date(Date.UTC(2026,9,29,12,0,time++)).toISOString()});
let pack=parseTransactionPack({format:'erudior-transaction-pack',version:1,id:'pack',revision:0,title:'Synthetic pack',jurisdiction:{id:'fictional',name:'Fictional jurisdiction',version:'source-v1',sourceNote:'Synthetic rules, not legal authority',effectiveFrom:'2026-01-01',effectiveThrough:'2026-12-31'},currency:'USD',minorUnitDigits:2,documents:[source],formRoles:[{documentId:'form',role:'Educational contract'}],clients:[{id:'fund',name:'Fictional client'}],contingencies:[{id:'check',title:'Synthetic inspection',category:'inspection',dueDays:5,required:true,allowWaiver:false}],rules:{requireRepresentation:true,requireDocumentsForClose:true,requireReconciliationForClose:true,requireZeroTrustForArchive:true,minEarnestBasisPoints:0,depositDueDays:2}});
pack=await store.supervisor.savePack(pack,null);pack=await store.supervisor.approvePack(pack.id,pack.revision);
await store.supervisor.assign({id:'case',studentId:'alice',title:'Synthetic case',instructions:'Use fictional data.',startDate:'2026-10-29',pack},null);
await store.supervisor.assign({id:'case-two',studentId:'alice',title:'Other synthetic case',instructions:'Separate fictional case.',startDate:'2026-10-29',pack},null);
let api:any={student:{id:'alice',name:'Alice'},family:{parent:{password:'test'},students:[{id:'alice',name:'Alice'},{id:'bob',name:'Bob'}]},transactionLearner:store.learner,transactionSupervisor:store.supervisor,documentSupervisor:{load:async()=>({templates:[source]})}};
const root=createRoot(document.getElementById('root')!),wait=()=>new Promise(r=>setTimeout(r,0));
const render=async(Component:any)=>{await React.act(async()=>{root.render(React.createElement(React.StrictMode,null,React.createElement(Component,{api})));await wait();});};
const button=(name:string)=>{const b=[...document.querySelectorAll<HTMLButtonElement>('button')].find(x=>x.textContent===name);assert(b,`Button ${name}`);return b;};
const click=async(name:string)=>{await React.act(async()=>{button(name).click();await wait();});};
const input=async(label:string,value:string)=>{const el=document.querySelector(`[aria-label="${label}"]`) as HTMLInputElement;assert(el,label);await React.act(async()=>{const proto=el.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:el.tagName==='SELECT'?dom.window.HTMLSelectElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(el,value);el.dispatchEvent(new dom.window.Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));await wait();});};
const state=()=>parseTransactionLibrary(saved);
// Optional transaction APIs must remain compatible with legacy partial family callers.
const completeApi=api;
for (const family of [undefined, {}]) {
  api={student:{id:'alice'},family};
  await render(Learner);
  assert.match(document.body.textContent!,/Transaction practice is unavailable for this profile/);
  await render(Adult);
  assert.equal(document.querySelector('[role="alert"]'),null);
}
api=completeApi;
await render(Learner);await click('Synthetic case — transaction revision 1');
await input('Annotation note','Unposted note belonging only to first case');confirm=true;await click('Other synthetic case — transaction revision 1');assert.equal((document.querySelector('[aria-label="Annotation note"]') as HTMLTextAreaElement).value,'','Accepted discard remounts source-local annotation editor');await click('Synthetic case — transaction revision 1');confirm=false;
await input('Reasoning','First private explanation');await input('Bounded quantity','99');await click('Save transaction documents');assert.match(document.body.textContent!,/outside its declared bounds/);assert.equal((document.querySelector('[aria-label="Bounded quantity"]') as HTMLInputElement).value,'99','Invalid draft does not crash render');await input('Bounded quantity','5');assert.equal(requestNavigation(),false);assert.equal(button('Record phase transition').closest('fieldset')!.disabled,true);
api={...api,transactionLearner:{...store.learner}};await render(Learner);assert.equal((document.querySelector('[aria-label="Reasoning"]') as HTMLInputElement).value,'First private explanation','service rerender retains draft');
fail=true;await click('Save transaction documents');assert.match(document.body.textContent!,/Synthetic save interruption/);assert.equal((document.querySelector('[aria-label="Reasoning"]') as HTMLInputElement).value,'First private explanation');
hold=true;const before=updates;await click('Save transaction documents');await click('Save transaction documents');assert.equal(updates,before+1,'in-flight save guarded');await React.act(async()=>{release!();await wait();});assert.match(document.body.textContent!,/Transaction document draft saved/);
for(const stage of ['representation','pricing','offer']){await input('Next educational phase',stage);await input('Phase reasoning','Synthetic '+stage);await click('Record phase transition');}
assert.equal(state().sessions[0].events.length,3);await click('Record phase transition');assert.equal(state().sessions[0].events.length,3,'unchanged repeated action is idempotent');
await input('Offer client','fund');await input('Offer price','100.001');await input('Earnest amount','10.00');await input('Offer expiry date','2026-10-31');await input('Proposed closing date','2026-11-02');await input('Offer reasoning','Synthetic terms');await click('Record offer or counteroffer');assert.match(document.body.textContent!,/declared precision/);await input('Offer price','100.00');await click('Record offer or counteroffer');
const offer=state().sessions[0].events.find(e=>e.command.kind==='offer')!.command as any;
for (const label of ['Scrollable offer history','Scrollable trust register']) {
  const region=document.querySelector(`[role="region"][aria-label="${label}"]`) as HTMLElement;
  assert(region,`Named table region: ${label}`);
  assert.equal(region.tabIndex,0,'Horizontal table scrolling is keyboard accessible');
  assert(region.querySelector('table thead th'),'Semantic column headers retained');
}
const tableCss=await (await import('node:fs/promises')).readFile(new URL('../src/transactions.css',import.meta.url),'utf8');
assert.match(tableCss,/\.transaction-table table\s*\{[^}]*min-width:48rem/,'Tables retain readable column layout rather than compressing into the mobile viewport');
assert.match(tableCss,/\.transaction-table\s*\{[^}]*overflow:auto/,'Overflow remains inside the keyboard table region');

await input('Offer to respond to',offer.offerId);await input('Response reasoning','Accept exact source terms');await click('Accept exact offer');
await input('Contingency','check');await input('Condition evidence','Synthetic inspection evidence');await click('Record contingency outcome');
await input('Trust client','fund');await input('Trust amount','10.00');await input('Trust reference','deposit-1');await input('Trust entry reason','Synthetic deposit');fail=true;await click('Post trust entry');assert.match(document.body.textContent!,/Synthetic save interruption/);await click('Post trust entry');await click('Post trust entry');assert.equal(replayTransaction(state().assignments[0],state().sessions[0].events).cashRegister,1000,'retry and repeat do not duplicate funds');
await input('Bank statement balance','-1.00');await input('Reported balance for Fictional client','-1.00');await input('Reconciliation reasoning','Negative independent statement audit');await click('Record three-way reconciliation');assert.match(document.body.textContent!,/Bank statement reports a negative balance/,'Signed audit inputs reach exact model, not nonnegative amount parser');
await input('Bank statement balance','9.00');await input('Reported balance for Fictional client','10.00');await input('Reconciliation reasoning','Compare independent values');await click('Record three-way reconciliation');assert(state().sessions[0].events.some(e=>e.command.kind==='reconcile'));
await input('Bank statement balance','10.00');await click('Record three-way reconciliation');
await click('Submit transaction evidence');await click('Submit transaction evidence');assert.equal(state().submissions.length,1);const immutable=JSON.stringify(state().submissions[0]);
await input('Next educational phase','closing');await input('Phase reasoning','All configured educational conditions met');await click('Record phase transition');assert.equal(button('Save transaction documents').disabled,true,'closed source answers cannot be edited');
assert.equal((document.querySelector('[aria-label="Reasoning"]') as HTMLInputElement).closest('fieldset')!.disabled,true);
assert.equal(JSON.stringify(state().submissions[0]),immutable);
confirm=true;await click('Reload transaction cases');await click('Synthetic case — transaction revision 1');assert.match(document.body.textContent!,/Case state: closing/,'persistent case reopens');
student='bob';api={...api,student:{id:'bob'}};await render(Learner);assert.equal(document.querySelector('[aria-label="Reasoning"]'),null);assert.match(document.body.textContent!,/No transaction cases assigned/);
await render(Adult);await input('Saved rule pack revision','pack@1');assert.match(document.body.textContent!,/Field definitions and constraints/);assert.match(document.body.textContent!,/character limit 100/);assert.match(document.body.textContent!,/Synthetic permission only/);assert.match(document.body.textContent!,/Currency: USD; decimal places: 2/);
await input('Transaction submission',state().submissions[0].id);await input('Transaction case title','Unsaved assignment');await input('Transaction instructor feedback','Human review note');await click('Append transaction feedback');confirm=false;assert.equal(requestNavigation(),false,'feedback save does not discard assignment dirty guard');
const updated=await store.supervisor.savePack({...pack,currency:'EUR',contingencies:[{...pack.contingencies[0],dueDays:9}],documents:[{...pack.documents[0],fields:[{...pack.documents[0].fields[0],maxLength:80}]}]},1);
await click('Refresh transaction library');await input('Compare saved rule pack',`pack@${updated.revision}`);const comparison=document.querySelector('.transaction-compare')!.textContent!;assert.match(comparison,/Currency: EUR/);assert.match(comparison,/9 simulated days/);assert.match(comparison,/character limit 80/);assert.match(comparison,/Currency: USD/);
await React.act(async()=>root.unmount());assert.equal(requestNavigation(),true);
console.log('Transaction UI StrictMode: usable contract/trust/lifecycle controls, precision errors, save retry, repeated-action idempotence, private profile isolation, immutable evidence, close freeze, independent dirty guards and complete source/rule revision comparison passed.');
