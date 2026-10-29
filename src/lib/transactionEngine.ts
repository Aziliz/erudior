import {documentJSON, parseDocumentTemplate, parseDocumentResponse, emptyDocumentResponse, parseDocumentFeedback, type DocumentTemplate, type DocumentResponse, type CaseAssignment, type DocumentApproval, type DocumentFeedback} from './documentEngine';

export const TRANSACTION_DISCLAIMER = 'Educational simulation only. Use fictional data. No legal advice, real transactions, filings, trust-account service or professional credit.';
export const TRANSACTION_LIMITS = {bytes:24*1024*1024, packBytes:2*1024*1024, packs:100, assignments:300, sessions:300, submissions:600, feedback:1200, events:500} as const;
export interface TransactionPack {
  format:'erudior-transaction-pack'; version:1; id:string; revision:number; title:string;
  jurisdiction:{id:string; name:string; version:string; sourceNote:string; effectiveFrom:string; effectiveThrough:string};
  currency:string; minorUnitDigits:number; documents:DocumentTemplate[];
  formRoles:{documentId:string; role:string}[]; clients:{id:string; name:string}[];
  contingencies:{id:string; title:string; category:'title'|'inspection'|'financing'|'other'; dueDays:number; required:boolean; allowWaiver:boolean}[];
  rules:{requireRepresentation:boolean; requireDocumentsForClose:boolean; requireReconciliationForClose:boolean; requireZeroTrustForArchive:boolean; minEarnestBasisPoints:number; depositDueDays:number};
  approval?:DocumentApproval;
}
export interface TransactionAssignment {id:string; revision:number; studentId:string; title:string; instructions:string; startDate:string; pack:TransactionPack; createdAt:string}
export type TransactionStage = 'intake'|'representation'|'pricing'|'offer'|'negotiation'|'due-diligence'|'closing'|'terminated'|'archived';
export type TransactionParty = 'buyer'|'seller';
export type TransactionCommand =
  | {kind:'stage'; stage:'representation'|'pricing'|'offer'|'closing'|'archived'; note:string}
  | {kind:'offer'; offerId:string; party:TransactionParty; parentOfferId?:string; clientId:string; price:number; earnest:number; expiresOn:string; closingDate:string; note:string}
  | {kind:'accept'|'reject'|'withdraw'; offerId:string; party:TransactionParty; note:string}
  | {kind:'contingency'; contingencyId:string; status:'satisfied'|'waived'|'failed'; note:string}
  | {kind:'clock'; date:string; note:string}
  | {kind:'deposit'|'disburse'; entryId:string; clientId:string; amount:number; reference:string; note:string}
  | {kind:'reverse'; entryId:string; targetEntryId:string; reference:string; note:string}
  | {kind:'reconcile'; bankBalance:number; outstandingEntryIds:string[]; reportedClientBalances:Record<string,number>; note:string}
  | {kind:'terminate'; note:string};
export interface TransactionEvent {id:string; at:string; command:TransactionCommand; response:DocumentResponse}
export interface TransactionSession {caseId:string; caseRevision:number; revision:number; events:TransactionEvent[]; response:DocumentResponse; updatedAt:string}
export interface TransactionSubmission {id:string; caseId:string; caseRevision:number; studentId:string; submittedAt:string; assignment:TransactionAssignment; session:TransactionSession}
export type TransactionFeedback = DocumentFeedback;
export interface TransactionLibrary {format:'erudior-transaction-library'; version:1; packs:TransactionPack[]; assignments:TransactionAssignment[]; sessions:TransactionSession[]; submissions:TransactionSubmission[]; feedback:TransactionFeedback[]; deletedStudentIds:string[]; restoredAt?:string; pendingApproval?:string[]}
export interface TransactionOffer {id:string; party:TransactionParty; parentOfferId?:string; clientId:string; price:number; earnest:number; expiresOn:string; closingDate:string; note:string; status:'pending'|'superseded'|'accepted'|'rejected'|'withdrawn'|'expired'; acceptedOn?:string}
export interface TrustEntry {id:string; clientId:string; amount:number; reference:string; note:string; date:string; reversalOf?:string}
export interface TransactionReconciliation {bankBalance:number; adjustedBank:number; cashRegister:number; clientLedgerTotal:number; expectedClientBalances:Record<string,number>; reportedClientBalances:Record<string,number>; outstandingEntryIds:string[]; issues:string[]; date:string; entryCount:number}
export interface TransactionState {stage:TransactionStage; date:string; represented:boolean; offers:TransactionOffer[]; acceptedOfferId?:string; contingencies:Record<string,'satisfied'|'waived'|'failed'>; entries:TrustEntry[]; clientBalances:Record<string,number>; cashRegister:number; reconciliation?:TransactionReconciliation; auditFindings:string[]; outcome:'in-progress'|'closed'|'terminated'; response:DocumentResponse}

function fail(message:string):never {throw Error('Invalid educational transaction: '+message);}
const copy=<T>(value:T):T=>JSON.parse(JSON.stringify(value));
const equal=(a:unknown,b:unknown)=>documentJSON(a)===documentJSON(b);
function object(value:unknown,keys:readonly string[],where:string):asserts value is Record<string,unknown> {
  if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value))||Object.keys(value).some(k=>!keys.includes(k)))fail(where+' has unsupported fields');
}
function text(value:unknown,where:string,max=5000):asserts value is string {if(typeof value!=='string'||!value.trim()||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))fail(where+' must be bounded text');}
function identifier(value:unknown,where:string):asserts value is string {if(typeof value!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$/.test(value)||['constructor','prototype','__proto__'].includes(value))fail(where+' identity');}
function integer(value:unknown,where:string,min=0,max=Number.MAX_SAFE_INTEGER):asserts value is number {if(!Number.isSafeInteger(value)||Number(value)<min||Number(value)>max)fail(where+' must be an exact bounded integer');}
function list(value:unknown,where:string,max:number,min=0):asserts value is unknown[] {if(!Array.isArray(value)||value.length<min||value.length>max)fail(where+' list bounds');}
function unique(values:string[],where:string){if(new Set(values).size!==values.length)fail(where+' duplicates');}
function day(value:unknown,where:string):asserts value is string {if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)fail(where+' calendar date');}
function timestamp(value:unknown,where:string):asserts value is string {if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value.slice(0,10))fail(where+' timestamp');}
function decode(input:unknown,max=TRANSACTION_LIMITS.bytes):unknown {
  let value=input;
  if(typeof input==='string'){if(new TextEncoder().encode(input).length>max)fail('byte limit');try{value=JSON.parse(input);}catch{fail('malformed JSON');}}
  if(new TextEncoder().encode(documentJSON(value)).length>max)fail('byte limit');return value;
}
function add(a:number,b:number):number {const result=a+b;if(!Number.isSafeInteger(result))fail('money arithmetic overflow');return result;}
// Compare epoch days instead of formatting a potentially five-digit year.
// Inputs are validated four-digit calendar dates and bounded day counts.
function deadlinePassed(date:string,start:string,days:number):boolean {
  return Date.parse(date+'T00:00:00Z') > Date.parse(start+'T00:00:00Z') + days*86400000;
}
export function parseMinorUnits(input:string,digits=2):number {
  integer(digits,'minor unit scale',0,4);if(typeof input!=='string'||input.length>40)fail('money input limit');const re=new RegExp('^(0|[1-9][0-9]*)(?:\\.([0-9]{1,'+Math.max(1,digits)+'}))?$');const m=re.exec(input.trim());
  if(!m||(digits===0&&m[2]))return fail('money requires a nonnegative decimal with the declared precision');
  const result=BigInt(m[1])*10n**BigInt(digits)+BigInt((m[2]??'').padEnd(digits,'0')||'0');if(result>BigInt(Number.MAX_SAFE_INTEGER))fail('money overflow');return Number(result);
}
export function formatMinorUnits(value:number,digits=2):string {integer(value,'money',-Number.MAX_SAFE_INTEGER);integer(digits,'minor unit scale',0,4);const sign=value<0?'-':'';const s=String(Math.abs(value)).padStart(digits+1,'0');return sign+(digits?s.slice(0,-digits)+'.'+s.slice(-digits):s);}

export function parseTransactionPack(input:unknown):TransactionPack {
  const v=decode(input,TRANSACTION_LIMITS.packBytes);object(v,['format','version','id','revision','title','jurisdiction','currency','minorUnitDigits','documents','formRoles','clients','contingencies','rules','approval'],'pack');
  if(v.format!=='erudior-transaction-pack'||v.version!==1)fail('pack format/version');identifier(v.id,'pack');integer(v.revision,'pack revision',0,100000);text(v.title,'pack title',300);
  object(v.jurisdiction,['id','name','version','sourceNote','effectiveFrom','effectiveThrough'],'jurisdiction');identifier(v.jurisdiction.id,'jurisdiction');text(v.jurisdiction.name,'jurisdiction name',300);text(v.jurisdiction.version,'jurisdiction source version',100);text(v.jurisdiction.sourceNote,'source provenance');day(v.jurisdiction.effectiveFrom,'effective start');day(v.jurisdiction.effectiveThrough,'effective end');if(v.jurisdiction.effectiveFrom>v.jurisdiction.effectiveThrough)fail('effective interval');
  if(typeof v.currency!=='string'||!/^[A-Z]{3}$/.test(v.currency))fail('currency label');integer(v.minorUnitDigits,'minor unit scale',0,4);
  list(v.documents,'documents',10,1);const documents=v.documents.map(parseDocumentTemplate);if(documents.some(d=>d.revision<1))fail('embedded sources must retain a saved revision');unique(documents.map(d=>d.id),'document');
  list(v.formRoles,'form roles',10,1);for(const r of v.formRoles){object(r,['documentId','role'],'form role');identifier(r.documentId,'form');text(r.role,'form role',100);if(!documents.some(d=>d.id===r.documentId))fail('unknown form role source');}unique(v.formRoles.map(r=>(r as {documentId:string}).documentId),'form roles');if(v.formRoles.length!==documents.length)fail('each document requires a declared form role');
  list(v.clients,'clients',30,1);for(const c of v.clients){object(c,['id','name'],'client');identifier(c.id,'client');text(c.name,'fictional client name',300);}unique(v.clients.map(c=>(c as {id:string}).id),'client');
  list(v.contingencies,'contingencies',30);for(const c of v.contingencies){object(c,['id','title','category','dueDays','required','allowWaiver'],'contingency');identifier(c.id,'contingency');text(c.title,'contingency title',300);if(!['title','inspection','financing','other'].includes(String(c.category)))fail('contingency category');integer(c.dueDays,'simulated deadline days',0,3650);if(typeof c.required!=='boolean'||typeof c.allowWaiver!=='boolean')fail('contingency flags');}unique(v.contingencies.map(c=>(c as {id:string}).id),'contingency');
  object(v.rules,['requireRepresentation','requireDocumentsForClose','requireReconciliationForClose','requireZeroTrustForArchive','minEarnestBasisPoints','depositDueDays'],'rules');for(const k of ['requireRepresentation','requireDocumentsForClose','requireReconciliationForClose','requireZeroTrustForArchive'])if(typeof v.rules[k]!=='boolean')fail('rule flags');integer(v.rules.minEarnestBasisPoints,'earnest basis points',0,10000);integer(v.rules.depositDueDays,'deposit due days',0,3650);
  if(v.approval!==undefined){object(v.approval,['at','actor'],'approval');timestamp(v.approval.at,'approval');text(v.approval.actor,'approver',300);if(v.revision<1)fail('unsaved pack approval');}
  return {...copy(v as unknown as TransactionPack),documents};
}
export function emptyTransactionPack(id:string):TransactionPack {
  return {format:'erudior-transaction-pack',version:1,id,revision:0,title:'',jurisdiction:{id:'',name:'',version:'',sourceNote:'',effectiveFrom:'',effectiveThrough:''},currency:'USD',minorUnitDigits:2,documents:[],formRoles:[],clients:[],contingencies:[],rules:{requireRepresentation:true,requireDocumentsForClose:true,requireReconciliationForClose:true,requireZeroTrustForArchive:true,minEarnestBasisPoints:0,depositDueDays:0}};
}
export function exportTransactionPack(input:TransactionPack):string {const {approval:_,...pack}=parseTransactionPack(input);return JSON.stringify({...pack,documents:pack.documents.map(({approval:__,...d})=>d)},null,2);}
export function importTransactionPack(input:unknown,newId?:string):TransactionPack {const {approval:_,...pack}=parseTransactionPack(input);return parseTransactionPack({...pack,id:newId??pack.id,revision:0,documents:pack.documents.map(({approval:__,...d})=>d)});}
export function parseTransactionAssignment(input:unknown):TransactionAssignment {
  const v=decode(input);object(v,['id','revision','studentId','title','instructions','startDate','pack','createdAt'],'assignment');identifier(v.id,'case');integer(v.revision,'case revision',1,100000);identifier(v.studentId,'learner');text(v.title,'case title',300);text(v.instructions,'instructions',10000);day(v.startDate,'simulated start');timestamp(v.createdAt,'assigned');const pack=parseTransactionPack(v.pack);if(!pack.approval)fail('assignment requires reviewed exact pack');if(Date.parse(v.createdAt)<Date.parse(pack.approval.at))fail('assignment predates pack review');if(v.startDate<pack.jurisdiction.effectiveFrom||v.startDate>pack.jurisdiction.effectiveThrough)fail('pack is not effective on the simulated case date');return {...copy(v as unknown as TransactionAssignment),pack};
}
/** Pack approval reviews these exact copied sources; imported document approval labels are not consulted. */
export function transactionDocumentAssignment(a:TransactionAssignment):CaseAssignment {
  return {id:a.id,revision:a.revision,studentId:a.studentId,title:a.title,instructions:a.instructions,createdAt:a.createdAt,documents:a.pack.documents.map(d=>({...copy(d),revision:d.revision,approval:copy(a.pack.approval!)}))};
}
export const emptyTransactionResponse=emptyDocumentResponse;
export function emptyTransactionSession(a:TransactionAssignment,at=a.createdAt):TransactionSession {return {caseId:a.id,caseRevision:a.revision,revision:0,events:[],response:emptyDocumentResponse(),updatedAt:at};}
export const createTransactionSession=emptyTransactionSession;
export const documentAssignment=transactionDocumentAssignment;
export type TransactionReview=TransactionFeedback;
export const parseTransactionFeedback=parseDocumentFeedback;

export function parseTransactionCommand(input:unknown,pack:TransactionPack):TransactionCommand {
  const v=decode(input);if(!v||typeof v!=='object')fail('command');const k=(v as {kind?:unknown}).kind;
  const keys:Record<string,string[]>={stage:['stage'],offer:['offerId','party','parentOfferId','clientId','price','earnest','expiresOn','closingDate'],accept:['offerId','party'],reject:['offerId','party'],withdraw:['offerId','party'],contingency:['contingencyId','status'],clock:['date'],deposit:['entryId','clientId','amount','reference'],disburse:['entryId','clientId','amount','reference'],reverse:['entryId','targetEntryId','reference'],reconcile:['bankBalance','outstandingEntryIds','reportedClientBalances'],terminate:[]};
  if(typeof k!=='string'||!Object.prototype.hasOwnProperty.call(keys,k))fail('unsupported command');object(v,['kind','note',...keys[k]],'command');text(v.note,'decision rationale');
  if(k==='stage'&&!['representation','pricing','offer','closing','archived'].includes(String(v.stage)))fail('stage');
  if(['offer','accept','reject','withdraw'].includes(k)){identifier(v.offerId,'offer');if(v.party!=='buyer'&&v.party!=='seller')fail('fictional party');}
  if(k==='offer'){if(v.parentOfferId!==undefined)identifier(v.parentOfferId,'parent offer');identifier(v.clientId,'offer client');integer(v.price,'offer price',1);integer(v.earnest,'earnest money');if(v.earnest>v.price)fail('earnest exceeds price');day(v.expiresOn,'offer expiry');day(v.closingDate,'proposed closing date');if(v.closingDate<v.expiresOn)fail('closing precedes offer expiry');}
  if(k==='contingency'){identifier(v.contingencyId,'contingency');if(!['satisfied','waived','failed'].includes(String(v.status)))fail('contingency resolution');}
  if(k==='clock')day(v.date,'simulated date');
  if(k==='deposit'||k==='disburse'){identifier(v.entryId,'entry');identifier(v.clientId,'ledger client');integer(v.amount,'entry amount',1);text(v.reference,'ledger reference',200);}
  if(k==='reverse'){identifier(v.entryId,'entry');identifier(v.targetEntryId,'reversed entry');text(v.reference,'ledger reference',200);}
  if(k==='reconcile'){
    integer(v.bankBalance,'bank statement balance',-Number.MAX_SAFE_INTEGER);list(v.outstandingEntryIds,'outstanding entries',TRANSACTION_LIMITS.events);v.outstandingEntryIds.forEach(x=>identifier(x,'outstanding entry'));unique(v.outstandingEntryIds as string[],'outstanding entry');
    object(v.reportedClientBalances,pack.clients.map(c=>c.id),'reported client ledgers');if(Object.keys(v.reportedClientBalances).length!==pack.clients.length)fail('report every client ledger');for(const amount of Object.values(v.reportedClientBalances))integer(amount,'reported client balance',-Number.MAX_SAFE_INTEGER);
  }
  return copy(v as unknown as TransactionCommand);
}
function initialState(a:TransactionAssignment):TransactionState {
  return {stage:'intake',date:a.startDate,represented:false,offers:[],contingencies:{},entries:[],clientBalances:Object.fromEntries(a.pack.clients.map(c=>[c.id,0])),cashRegister:0,auditFindings:[],outcome:'in-progress',response:emptyDocumentResponse()};
}
function findings(a:TransactionAssignment,s:TransactionState):string[] {
  const result:string[]=[];const accepted=s.offers.find(o=>o.id===s.acceptedOfferId);
  if(accepted&&s.outcome==='in-progress'){
    for(const c of a.pack.contingencies)if(c.required&&!s.contingencies[c.id]&&deadlinePassed(s.date,accepted.acceptedOn!,c.dueDays))result.push('Overdue contingency: '+c.title);
    if(deadlinePassed(s.date,accepted.acceptedOn!,a.pack.rules.depositDueDays)&&s.clientBalances[accepted.clientId]<accepted.earnest)result.push('Required simulated earnest funds are overdue or insufficient.');
    if(s.date>accepted.closingDate&&s.stage!=='closing')result.push('Proposed simulated closing date has passed.');
  }
  if(s.entries.length&&!s.reconciliation)result.push('Trust activity has not been reconciled.');
  if(s.reconciliation){result.push(...s.reconciliation.issues);if(s.reconciliation.entryCount!==s.entries.length)result.push('Reconciliation is stale after new trust activity.');}
  if(s.outcome!=='in-progress'&&s.cashRegister!==0)result.push('Unresolved client funds remain after the case outcome.');
  return result;
}
function processCommand(a:TransactionAssignment,s:TransactionState,c:TransactionCommand,response:DocumentResponse):void {
  const pack=a.pack;
  if(s.stage==='archived')fail('archived case is immutable; assign a new case revision');
  if(s.outcome!=='in-progress'&&!equal(response,s.response))fail('closed or terminated source answers are immutable; assign a new case revision');
  if(s.outcome!=='in-progress'&&!['deposit','disburse','reverse','reconcile','clock','stage'].includes(c.kind))fail('terminated or closed case cannot renegotiate');
  if(c.kind==='clock'){
    if(c.date<s.date)fail('simulated clock cannot move backwards');if(c.date<pack.jurisdiction.effectiveFrom||c.date>pack.jurisdiction.effectiveThrough)fail('simulated date is outside reviewed pack effectiveness');s.date=c.date;
    for(const o of s.offers)if(o.status==='pending'&&s.date>o.expiresOn)o.status='expired';
  } else if(c.kind==='stage') {
    if(c.stage==='representation'){if(s.stage!=='intake')fail('representation follows intake');s.represented=true;s.stage='representation';}
    else if(c.stage==='pricing'){if(s.stage!=='representation'&&!(s.stage==='intake'&&!pack.rules.requireRepresentation))fail('pricing requires the configured representation review');s.stage='pricing';}
    else if(c.stage==='offer'){if(s.stage!=='pricing')fail('offer preparation follows pricing');s.stage='offer';}
    else if(c.stage==='closing'){
      const accepted=s.offers.find(o=>o.id===s.acceptedOfferId);if(s.stage!=='due-diligence'||!accepted)fail('closing requires accepted terms and due diligence');
      if(s.date>accepted.closingDate)fail('simulated closing deadline missed; terminate and review this outcome');
      if(pack.contingencies.some(x=>x.required&&!['satisfied','waived'].includes(s.contingencies[x.id])))fail('required contingencies remain unresolved');
      if(s.clientBalances[accepted.clientId]<accepted.earnest)fail('required client earnest funds are insufficient');
      if(pack.rules.requireDocumentsForClose)parseDocumentResponse(response,transactionDocumentAssignment(a),true);
      if(pack.rules.requireReconciliationForClose&&(!s.reconciliation||s.reconciliation.issues.length||s.reconciliation.entryCount!==s.entries.length))fail('closing requires a current balanced three-way reconciliation');
      s.stage='closing';s.outcome='closed';
    } else {
      if(!['closing','terminated'].includes(s.stage))fail('archive requires a closed or terminated outcome');
      if(pack.rules.requireZeroTrustForArchive&&s.cashRegister!==0)fail('client trust funds must be resolved before archive');
      if(pack.rules.requireReconciliationForClose&&s.entries.length&&(!s.reconciliation||s.reconciliation.issues.length||s.reconciliation.entryCount!==s.entries.length))fail('archive requires a current balanced reconciliation');
      s.stage='archived';
    }
  } else if(c.kind==='offer') {
    if(!['offer','negotiation'].includes(s.stage))fail('offer is not available at this lifecycle stage');if(pack.rules.requireRepresentation&&!s.represented)fail('representation required');
    if(!Object.prototype.hasOwnProperty.call(s.clientBalances,c.clientId))fail('unknown fictional client');if(s.offers.some(o=>o.id===c.offerId))fail('offer identity already exists');
    if(c.expiresOn<s.date||c.closingDate<s.date||c.closingDate>pack.jurisdiction.effectiveThrough)fail('offer dates outside reviewed simulation period');
    if(BigInt(c.earnest)*10000n<BigInt(c.price)*BigInt(pack.rules.minEarnestBasisPoints))fail('earnest does not meet the authored educational rule');
    const pending=s.offers.find(o=>o.status==='pending');
    if(c.parentOfferId){if(!pending||pending.id!==c.parentOfferId||pending.party===c.party)fail('counteroffer must replace the current opposite-party offer');pending.status='superseded';}
    else if(pending)fail('respond to or explicitly withdraw the current offer before creating another');
    s.offers.push({id:c.offerId,party:c.party,...(c.parentOfferId?{parentOfferId:c.parentOfferId}:{}),clientId:c.clientId,price:c.price,earnest:c.earnest,expiresOn:c.expiresOn,closingDate:c.closingDate,note:c.note,status:'pending'});s.stage='negotiation';
  } else if(['accept','reject','withdraw'].includes(c.kind)) {
    const action=c as Extract<TransactionCommand,{kind:'accept'|'reject'|'withdraw'}>;const offer=s.offers.find(o=>o.id===action.offerId);
    if(!offer||offer.status!=='pending'||s.stage!=='negotiation'||s.date>offer.expiresOn)fail('only current unexpired terms can receive this response');
    if((action.kind==='withdraw')!==(offer.party===action.party))fail('only the offer author withdraws; the other party accepts or rejects');
    offer.status=action.kind==='accept'?'accepted':action.kind==='reject'?'rejected':'withdrawn';
    if(action.kind==='accept'){offer.acceptedOn=s.date;s.acceptedOfferId=offer.id;s.stage='due-diligence';}
  } else if(c.kind==='contingency') {
    if(s.stage!=='due-diligence')fail('contingencies require accepted contract terms');const item=pack.contingencies.find(x=>x.id===c.contingencyId);if(!item)fail('unknown contingency');if(s.contingencies[item.id])fail('contingency decision is already recorded');
    const accepted=s.offers.find(o=>o.id===s.acceptedOfferId)!;if(c.status!=='failed'&&deadlinePassed(s.date,accepted.acceptedOn!,item.dueDays))fail('contingency deadline passed; record adverse outcome');if(c.status==='waived'&&!item.allowWaiver)fail('authored rule does not allow waiver');
    s.contingencies[item.id]=c.status;if(c.status==='failed'){s.stage='terminated';s.outcome='terminated';}
  } else if(c.kind==='terminate') {s.stage='terminated';s.outcome='terminated';for(const o of s.offers)if(o.status==='pending')o.status='withdrawn';}
  else if(c.kind==='deposit'||c.kind==='disburse'||c.kind==='reverse') {
    if(s.entries.some(e=>e.id===c.entryId))fail('trust entry identity already exists');if(s.entries.some(e=>e.reference===c.reference))fail('duplicate trust reference');
    let clientId:string,amount:number,reversalOf:string|undefined;
    if(c.kind==='reverse'){const target=s.entries.find(e=>e.id===c.targetEntryId);if(!target||target.reversalOf||s.entries.some(e=>e.reversalOf===target.id))fail('entry cannot be reversed twice or reverse a reversal');clientId=target.clientId;amount=-target.amount;reversalOf=target.id;}
    else {clientId=c.clientId;amount=c.kind==='deposit'?c.amount:-c.amount;}
    if(!Object.prototype.hasOwnProperty.call(s.clientBalances,clientId))fail('unknown trust client');const next=add(s.clientBalances[clientId],amount);if(next<0)fail('client trust overdraft; other clients funds cannot cover it');
    s.cashRegister=add(s.cashRegister,amount);s.clientBalances[clientId]=next;s.entries.push({id:c.entryId,clientId,amount,reference:c.reference,note:c.note,date:s.date,...(reversalOf?{reversalOf}:{})});
  } else if(c.kind==='reconcile') {
    let outstanding=0;for(const entryId of c.outstandingEntryIds){const entry=s.entries.find(e=>e.id===entryId);if(!entry||entry.date>s.date)fail('unknown or future outstanding entry');outstanding=add(outstanding,entry.amount);}
    const adjustedBank=add(c.bankBalance,outstanding);let clientLedgerTotal=0;for(const value of Object.values(c.reportedClientBalances))clientLedgerTotal=add(clientLedgerTotal,value);
    const issues:string[]=[];if(c.bankBalance<0)issues.push('Bank statement reports a negative balance; review this educational audit risk.');if(adjustedBank!==s.cashRegister)issues.push('Adjusted bank differs from cash register.');if(clientLedgerTotal!==s.cashRegister)issues.push('Reported client ledger total differs from cash register.');
    for(const client of pack.clients)if(c.reportedClientBalances[client.id]!==s.clientBalances[client.id])issues.push('Client ledger discrepancy: '+client.name);
    s.reconciliation={bankBalance:c.bankBalance,adjustedBank,cashRegister:s.cashRegister,clientLedgerTotal,expectedClientBalances:copy(s.clientBalances),reportedClientBalances:copy(c.reportedClientBalances),outstandingEntryIds:[...c.outstandingEntryIds],issues,date:s.date,entryCount:s.entries.length};
  }
  s.response=copy(response);s.auditFindings=findings(a,s);
}

export function replayTransaction(assignment:TransactionAssignment,events:TransactionEvent[],response?:DocumentResponse):TransactionState {
  const a=parseTransactionAssignment(assignment);list(events,'events',TRANSACTION_LIMITS.events);const s=initialState(a);let lastAt=a.createdAt;const eventIds:string[]=[];
  for(const raw of events){object(raw,['id','at','command','response'],'event');identifier(raw.id,'event');timestamp(raw.at,'event');if(Date.parse(raw.at)<Date.parse(lastAt))fail('event timestamp order');lastAt=raw.at;eventIds.push(raw.id);const c=parseTransactionCommand(raw.command,a.pack);const answer=parseDocumentResponse(raw.response,transactionDocumentAssignment(a));processCommand(a,s,c,answer);}
  unique(eventIds,'event');if(response!==undefined){const answer=parseDocumentResponse(response,transactionDocumentAssignment(a));if(s.outcome!=='in-progress'&&!equal(answer,s.response))fail('closed or terminated source answers are immutable; assign a new case revision');s.response=answer;}return s;
}
export function parseTransactionSession(input:unknown,assignment:TransactionAssignment):TransactionSession {
  const v=decode(input);object(v,['caseId','caseRevision','revision','events','response','updatedAt'],'session');identifier(v.caseId,'session case');integer(v.caseRevision,'session case revision',1,100000);integer(v.revision,'session revision',0,1000000);timestamp(v.updatedAt,'session update');if(v.caseId!==assignment.id||v.caseRevision!==assignment.revision||Date.parse(v.updatedAt)<Date.parse(assignment.createdAt))fail('session source identity/time');
  list(v.events,'events',TRANSACTION_LIMITS.events);if(v.revision<v.events.length)fail('session revision precedes events');const events=v.events as unknown as TransactionEvent[];const response=parseDocumentResponse(v.response,transactionDocumentAssignment(assignment));const replayed=replayTransaction(assignment,events,response);if(replayed.stage==='archived'&&events.length&&!equal(response,events[events.length-1].response))fail('archived document responses cannot be edited');if(events.some(e=>Date.parse(e.at)>Date.parse(v.updatedAt as string)))fail('session update precedes journal');return {...copy(v as unknown as TransactionSession),response};
}
export function applyTransactionCommand(assignment:TransactionAssignment,session:TransactionSession,command:TransactionCommand,eventId:string,at:string):TransactionSession {
  const current=parseTransactionSession(session,assignment);const event:TransactionEvent={id:eventId,at,command:parseTransactionCommand(command,assignment.pack),response:copy(current.response)};
  return parseTransactionSession({...current,revision:current.revision+1,events:[...current.events,event],updatedAt:at},assignment);
}
export function parseTransactionSubmission(input:unknown):TransactionSubmission {
  const v=decode(input);object(v,['id','caseId','caseRevision','studentId','submittedAt','assignment','session'],'evidence');identifier(v.id,'evidence');identifier(v.caseId,'evidence case');identifier(v.studentId,'evidence learner');integer(v.caseRevision,'evidence case revision',1,100000);timestamp(v.submittedAt,'submission');const assignment=parseTransactionAssignment(v.assignment);if(v.caseId!==assignment.id||v.caseRevision!==assignment.revision||v.studentId!==assignment.studentId)fail('evidence source identity');const session=parseTransactionSession(v.session,assignment);if(Date.parse(v.submittedAt)<Date.parse(session.updatedAt))fail('submission precedes session');return {...copy(v as unknown as TransactionSubmission),assignment,session};
}
/** Any stage may be submitted for human review; only replayed terminal state denotes a completed simulation. */
export function makeTransactionSubmission(assignment:TransactionAssignment,session:TransactionSession,id:string,submittedAt:string):TransactionSubmission {return parseTransactionSubmission({id,caseId:assignment.id,caseRevision:assignment.revision,studentId:assignment.studentId,submittedAt,assignment,session});}
export function emptyTransactionLibrary():TransactionLibrary {return {format:'erudior-transaction-library',version:1,packs:[],assignments:[],sessions:[],submissions:[],feedback:[],deletedStudentIds:[]};}
export function parseTransactionLibrary(input:unknown):TransactionLibrary {
  if(input===null||input===undefined)return emptyTransactionLibrary();const v=decode(input);object(v,['format','version','packs','assignments','sessions','submissions','feedback','deletedStudentIds','restoredAt','pendingApproval'],'library');if(v.format!=='erudior-transaction-library'||v.version!==1)fail('library format');
  for(const key of ['packs','assignments','sessions','submissions','feedback'] as const)list(v[key],key,TRANSACTION_LIMITS[key]);list(v.deletedStudentIds,'deleted learners',10000);
  const packs=(v.packs as unknown[]).map(parseTransactionPack),assignments=(v.assignments as unknown[]).map(parseTransactionAssignment),submissions=(v.submissions as unknown[]).map(parseTransactionSubmission),feedback=(v.feedback as unknown[]).map(parseTransactionFeedback),deletedStudentIds=v.deletedStudentIds as string[];
  deletedStudentIds.forEach(x=>identifier(x,'deleted learner'));unique(deletedStudentIds,'deleted learner');unique(packs.map(p=>p.id+'@'+p.revision),'pack revision');unique(assignments.map(a=>a.id+'@'+a.revision),'assignment revision');unique(submissions.map(s=>s.id),'submission');unique(feedback.map(f=>f.id),'feedback');if(packs.some(p=>p.revision<1))fail('unsaved library pack');
  for(const a of assignments){if(deletedStudentIds.includes(a.studentId)||assignments.some(b=>b.id===a.id&&b.studentId!==a.studentId))fail('case learner identity');const pack=packs.find(p=>p.id===a.pack.id&&p.revision===a.pack.revision);if(!pack||!equal(pack,a.pack))fail('assignment differs from retained reviewed pack');}
  const sessions=(v.sessions as unknown[]).map(raw=>{if(!raw||typeof raw!=='object')return fail('session');const d=raw as TransactionSession;const a=assignments.find(a=>a.id===d.caseId&&a.revision===d.caseRevision);if(!a)return fail('orphan session');return parseTransactionSession(raw,a);});unique(sessions.map(s=>s.caseId+'@'+s.caseRevision),'session');
  for(const evidence of submissions){const a=assignments.find(a=>a.id===evidence.caseId&&a.revision===evidence.caseRevision);if(!a||!equal(a,evidence.assignment))fail('evidence differs from assigned source');}
  for(const review of feedback){const evidence=submissions.find(s=>s.id===review.submissionId);if(!evidence||Date.parse(review.at)<Date.parse(evidence.submittedAt))fail('orphan or early review');}
  if(v.restoredAt!==undefined)timestamp(v.restoredAt,'restore provenance');if(v.pendingApproval!==undefined){list(v.pendingApproval,'pending review',TRANSACTION_LIMITS.packs);for(const key of v.pendingApproval)if(typeof key!=='string'||!packs.some(p=>p.id+'@'+p.revision===key))fail('unknown quarantined pack');unique(v.pendingApproval as string[],'quarantined pack');}
  return {format:'erudior-transaction-library',version:1,packs,assignments,sessions,submissions,feedback,deletedStudentIds:[...deletedStudentIds],...(v.restoredAt!==undefined?{restoredAt:v.restoredAt as string}:{}),...(v.pendingApproval!==undefined?{pendingApproval:[...(v.pendingApproval as string[])]}:{})};
}
