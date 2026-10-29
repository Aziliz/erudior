import { documentJSON, parseDocumentTemplate, parseDocumentLibrary, parseCaseAssignment, parseDocumentDraft, parseDocumentFeedback, parseDocumentResponse, makeDocumentSubmission, type DocumentTemplate, type DocumentLibrary, type CaseAssignment, type DocumentResponse, type DocumentFeedback } from './documentEngine';

export interface DocumentAdult { actorId: string; actorName: string; authorityKey: string }
export interface DocumentLearnerContext { studentId: string; authorityKey: string }
export interface DocumentEngineIO {
 read(): Promise<string | null>;
 /** Must rerun callback on CAS conflict, never overwrite another writer. */
 update(change: (previous: string | null) => Promise<string>): Promise<string>;
 authorizeAdult(studentId?: string): Promise<DocumentAdult>;
 learnerContext(): Promise<DocumentLearnerContext>;
 now(): string;
}
export interface DocumentAssignmentInput { id: string; studentId: string; title: string; instructions: string; documents: DocumentTemplate[] }
export type DocumentReviewInput = Pick<DocumentFeedback, 'id' | 'submissionId' | 'status' | 'note'>;
const equal = (a: unknown,b: unknown) => documentJSON(a) === documentJSON(b);
const student = (id: string) => { if(!/^[a-z0-9]{1,24}$/.test(id)) throw Error('Select an existing learner profile.'); };
const active = (s: DocumentLibrary,id: string) => { student(id); if(s.deletedStudentIds.includes(id)) throw Error('This learner profile was deleted.'); };
const latest = <T extends {id:string;revision:number}>(values:T[],id:string) => values.filter(v=>v.id===id).sort((a,b)=>b.revision-a.revision)[0];
function own(s:DocumentLibrary,id:string):DocumentLibrary {
 const assignments=s.assignments.filter(a=>a.studentId===id), keys=new Set(assignments.map(a=>a.id+'@'+a.revision));
 const submissions=s.submissions.filter(a=>a.studentId===id), ids=new Set(submissions.map(a=>a.id));
 const templateKeys=new Set(assignments.flatMap(a=>a.documents.map(t=>t.id+'@'+t.revision)));
 return parseDocumentLibrary({...s,templates:s.templates.filter(t=>templateKeys.has(t.id+'@'+t.revision)),assignments,drafts:s.drafts.filter(d=>keys.has(d.caseId+'@'+d.caseRevision)),submissions,feedback:s.feedback.filter(f=>ids.has(f.submissionId)),deletedStudentIds:[],...(s.pendingApproval ? {pendingApproval:s.pendingApproval.filter(key=>templateKeys.has(key))} : {})});
}
/** Full-profile deletion only. Retained sources contain no learner responses. */
export function deleteDocumentStudent(state:DocumentLibrary,studentId:string):DocumentLibrary {
 student(studentId);const s=parseDocumentLibrary(state),cases=new Set(s.assignments.filter(a=>a.studentId===studentId).map(a=>a.id)),submissions=s.submissions.filter(x=>x.studentId!==studentId),ids=new Set(submissions.map(x=>x.id));
 return parseDocumentLibrary({...s,assignments:s.assignments.filter(a=>a.studentId!==studentId),drafts:s.drafts.filter(d=>!cases.has(d.caseId)),submissions,feedback:s.feedback.filter(f=>ids.has(f.submissionId)),deletedStudentIds:[...new Set([...s.deletedStudentIds,studentId])]});
}
/** Authority comes from current device authorization, never from imported actor labels.
 * A restored library retains exact historical snapshots, but pendingApproval revokes
 * source authority until an adult explicitly reviews that exact revision locally.
 */
export function createDocumentEngineStore(io:DocumentEngineIO) {
 const adult=async(id?:string)=>{if(id)student(id);const a=await io.authorizeAdult(id);if(!a.actorId.trim()||!a.actorName.trim()||!a.authorityKey.trim())throw Error('Fresh adult authorization is required.');return a;};
 const learner=async()=>{const a=await io.learnerContext();student(a.studentId);if(!a.authorityKey.trim())throw Error('Fresh learner context is required.');return a;};
 const checkAdult=async(a:DocumentAdult,id?:string)=>{if(!equal(a,await adult(id)))throw Error('Adult authority changed. Reload before continuing.');};
 const checkLearner=async(a:DocumentLearnerContext)=>{if(!equal(a,await learner()))throw Error('Learner profile changed. Reload before continuing.');};
 const assignment=(s:DocumentLibrary,a:DocumentLearnerContext,id:string,revision:number)=>{active(s,a.studentId);const found=latest(s.assignments,id);if(!found||found.studentId!==a.studentId||found.revision!==revision)throw Error('This assignment changed or is not assigned to this learner. Reload before continuing.');if(found.documents.some(t=>s.pendingApproval?.includes(t.id+'@'+t.revision)))throw Error('Restored source history needs fresh adult review and reassignment before learner work continues.');return found;};
 const supervisor={
  async load(){const a=await adult(),s=parseDocumentLibrary(await io.read());await checkAdult(a);return s;},
  async saveTemplate(input:DocumentTemplate,expectedRevision:number|null){const parsed=parseDocumentTemplate(input),{approval:_,...body}=parsed,a=await adult();let result!:DocumentTemplate;
   await io.update(async old=>{const s=parseDocumentLibrary(old);await checkAdult(a);const current=latest(s.templates,body.id);const wanted=parseDocumentTemplate({...body,revision:(expectedRevision??0)+1});
    if(current&&current.revision===wanted.revision&&equal(current,wanted)){result=current;return JSON.stringify(s);}
    if((current?.revision??null)!==expectedRevision)throw Error('Template changed. Reload before saving.');result=wanted;
    const next=parseDocumentLibrary({...s,templates:[...s.templates,result]});await checkAdult(a);return JSON.stringify(next);});await checkAdult(a);return result;
  },
  async approveTemplate(id:string,revision:number){const a=await adult();let result!:DocumentTemplate;await io.update(async old=>{const s=parseDocumentLibrary(old);await checkAdult(a);const newest=latest(s.templates,id),pending=s.pendingApproval?.includes(id+'@'+revision);const t=pending?s.templates.find(t=>t.id===id&&t.revision===revision):newest;if(!t||t.revision!==revision)throw Error('Review the latest exact source revision before approval.');result=t.approval?t:parseDocumentTemplate({...t,approval:{at:io.now(),actor:a.actorName}});const next=parseDocumentLibrary({...s,templates:s.templates.map(x=>x.id===id&&x.revision===revision?result:x),...(s.pendingApproval ? {pendingApproval:s.pendingApproval.filter(key=>key!==id+'@'+revision)} : {})});await checkAdult(a);return JSON.stringify(next);});await checkAdult(a);return result;},
  async assign(input:DocumentAssignmentInput,expectedRevision:number|null){const safe=JSON.parse(JSON.stringify(input)) as DocumentAssignmentInput,a=await adult(safe.studentId);let result!:CaseAssignment;await io.update(async old=>{const s=parseDocumentLibrary(old);active(s,safe.studentId);await checkAdult(a,safe.studentId);const current=latest(s.assignments,safe.id);if(current&&current.studentId!==safe.studentId)throw Error('A case cannot change learner identity.');
   for(const doc of safe.documents){const t=s.templates.find(t=>t.id===doc.id&&t.revision===doc.revision);if(!t?.approval||s.pendingApproval?.includes(t.id+'@'+t.revision)||!equal(t,doc))throw Error('Choose an exact locally approved source revision.');}
   const candidate=parseCaseAssignment({...safe,revision:(expectedRevision??0)+1,createdAt:current?.revision===(expectedRevision??0)+1?current.createdAt:io.now()});
   if(current&&equal(current,candidate)){result=current;return JSON.stringify(s);}if((current?.revision??null)!==expectedRevision)throw Error('Assignment changed. Reload before reassigning.');result=candidate;const next=parseDocumentLibrary({...s,assignments:[...s.assignments,result]});await checkAdult(a,safe.studentId);return JSON.stringify(next);});await checkAdult(a,safe.studentId);return result;},
  async review(input:DocumentReviewInput){const safe=JSON.parse(JSON.stringify(input)) as DocumentReviewInput,a=await adult();let result!:DocumentFeedback;let target:string|undefined;await io.update(async old=>{const s=parseDocumentLibrary(old),submission=s.submissions.find(x=>x.id===safe.submissionId);if(!submission)throw Error('Select an immutable submission.');target=submission.studentId;active(s,target);await checkAdult(a,target);const existing=s.feedback.find(f=>f.id===safe.id);result=parseDocumentFeedback({...safe,at:existing?.at??io.now(),actor:a.actorName});if(existing){if(!equal(existing,result))throw Error('Feedback identity already exists.');return JSON.stringify(s);}const next=parseDocumentLibrary({...s,feedback:[...s.feedback,result]});await checkAdult(a,target);return JSON.stringify(next);});await checkAdult(a,target);return result;},
 };
 const learnerFacade={
  async load(){const a=await learner(),s=parseDocumentLibrary(await io.read());active(s,a.studentId);await checkLearner(a);return own(s,a.studentId);},
  async saveDraft(caseId:string,caseRevision:number,response:DocumentResponse,expectedRevision:number|null){const safe=JSON.parse(JSON.stringify(response)) as DocumentResponse,a=await learner();let result!:ReturnType<typeof parseDocumentDraft>;await io.update(async old=>{const s=parseDocumentLibrary(old),source=assignment(s,a,caseId,caseRevision);await checkLearner(a);const existing=s.drafts.find(d=>d.caseId===caseId&&d.caseRevision===caseRevision),answer=parseDocumentResponse(safe,source);
   if(existing&&existing.revision===(expectedRevision??0)+1&&equal(existing.response,answer)){result=existing;return JSON.stringify(s);}if((existing?.revision??null)!==expectedRevision)throw Error('Draft changed in another window. Reload before saving.');result=parseDocumentDraft({caseId,caseRevision,revision:(expectedRevision??0)+1,response:answer,updatedAt:io.now()},source);const next=parseDocumentLibrary({...s,drafts:[...s.drafts.filter(d=>d!==existing),result]});await checkLearner(a);return JSON.stringify(next);});await checkLearner(a);return result;},
  async submit(caseId:string,caseRevision:number,response:DocumentResponse,id:string,expectedDraftRevision:number|null){const safe=JSON.parse(JSON.stringify(response)) as DocumentResponse,a=await learner();let result!:ReturnType<typeof makeDocumentSubmission>;await io.update(async old=>{const s=parseDocumentLibrary(old),source=assignment(s,a,caseId,caseRevision);await checkLearner(a);const existing=s.submissions.find(x=>x.id===id);result=makeDocumentSubmission(source,safe,id,existing?.submittedAt??io.now());if(existing){if(!equal(existing,result))throw Error('Submission identity already exists.');return JSON.stringify(s);}const draft=s.drafts.find(d=>d.caseId===caseId&&d.caseRevision===caseRevision);if((draft?.revision??null)!==expectedDraftRevision)throw Error('Draft changed. Reload before submitting.');const next=parseDocumentLibrary({...s,submissions:[...s.submissions,result]});await checkLearner(a);return JSON.stringify(next);});await checkLearner(a);return result;},
 };
 return {supervisor,learner:learnerFacade};
}
export type DocumentSupervisor=ReturnType<typeof createDocumentEngineStore>['supervisor'];
export type DocumentLearner=ReturnType<typeof createDocumentEngineStore>['learner'];
