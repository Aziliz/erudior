import assert from 'node:assert/strict';
const state=new Map<string,string>(),files=new Map<string,string>();let mutations=0;
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,a:any)=>{
 const generation=()=>JSON.parse(state.get('progress')??'{}').anonymousGeneration??0;
 if(command==='load_state')return state.get(a.name)??null;
 if(command==='load_item')return files.get(a.id)??null;
 if(command==='compare_and_swap_state'){
  if(['progress','session'].includes(a.name)&&generation()!==(a.anonymousGeneration??0))throw Error('generation mismatch');
  if((state.get(a.name)??null)!==a.expected)return false;state.set(a.name,a.content);mutations++;return true;
 }
 if(command==='save_state'){a.content===null?state.delete(a.name):state.set(a.name,a.content);mutations++;return;}
 if(command==='replace_anonymous_state'){
  if(state.has('family')||(state.get('learner-privacy')??null)!==a.expectedPrivacy||(state.get('progress')??null)!==a.expectedProgress||(state.get('session')??null)!==a.expectedSession)throw Error('scope or snapshot mismatch');
  for(const [id,file]of Object.entries(a.files)){const old=files.get(id);if(old&&JSON.stringify(JSON.parse(old))!==JSON.stringify(file))throw Error('conflicting file');}
  const retained:string[]=[];for(const id of a.fileIds){const shared=[...state].some(([k,v])=>!['progress','session'].includes(k)&&v.includes(JSON.stringify(id)));if(shared)retained.push(id);else files.delete(id);}
  for(const [id,file]of Object.entries(a.files))files.set(id,JSON.stringify(file));
  state.set('progress',a.progress);state.set('session',a.session);state.set('learner-privacy',a.privacy);mutations++;return retained;
 }
 throw Error('Unexpected '+command);
}}};
const store=await import('../src/lib/storage.ts');
const at='2026-10-29T16:00:00.000Z';
const ref=(fileId:string)=>({id:fileId,fileId,name:'draft.txt',mime:'text/plain',bytes:1,caption:'Private',date:'2026-10-29'});
const progress={...store.emptyProgress(),seeded:true,theme:'dark' as const,seededCourses:['installed'],catalogV1:true,qmeta:{'bank/q':{note:'Private note'}},reading:{'course/text':{section:'first',at:0,seconds:2,read:{},last:'2026-10-29'}},work:{'course/essay':{kind:'writing' as const,started:at,updated:at,text:'Private writing',photos:[ref('unique'),ref('shared')]}}};
state.set('progress',JSON.stringify(progress));state.set('progress-bob',JSON.stringify({work:{photo:{fileId:'shared'}}}));state.set('credential-config',JSON.stringify('untouched'));files.set('unique',JSON.stringify({mime:'text/plain',data:'YQ=='}));files.set('shared',JSON.stringify({mime:'text/plain',data:'Yg=='}));
const {learnerPrivacyFixture}=await import('./fixtures/learnerPrivacy.ts');const f=await learnerPrivacyFixture();state.set('learner-privacy',JSON.stringify({format:'erudior-learner-privacy',version:1,revision:1,deletedStudentIds:['deleted'],profiles:[{studentId:null,consent:true,binding:f.binding,remoteRevision:0,status:'active',retentionDays:7,pending:{requestId:'test-request-12345',expectedRevision:0,retentionDays:7,envelope:f.envelope}}]}));
const snapshot=await store.readAnonymousPrivacy();assert(snapshot.anonymousPending);assert(snapshot.anonymousAssociation);assert.deepEqual(snapshot.files,{shared:{mime:'text/plain',data:'Yg=='},unique:{mime:'text/plain',data:'YQ=='}});assert.equal(snapshot.missingFiles.length,0);
const before=[...state];const oldMutations=mutations;await assert.rejects(store.eraseAnonymousPrivacy(snapshot,()=>{throw Error('cleared');}),/cleared/);assert.deepEqual([...state],before);assert.equal(mutations,oldMutations);
state.set('family','{}');await assert.rejects(store.eraseAnonymousPrivacy(snapshot),/anonymous/i);state.delete('family');
const erased=await store.eraseAnonymousPrivacy(snapshot);assert.deepEqual(JSON.parse(state.get('learner-privacy')!).profiles,[]);assert.deepEqual(JSON.parse(state.get('learner-privacy')!).deletedStudentIds,['deleted']);assert.equal(erased.progress.anonymousGeneration,1);assert.equal(erased.progress.theme,'dark');assert.equal(erased.progress.seeded,true);assert.equal(erased.progress.qmeta,undefined);assert.equal(erased.progress.work,undefined);assert.equal(erased.progress.reading,undefined);assert.deepEqual(erased.retainedFileIds,['shared']);assert(!files.has('unique'));assert(files.has('shared'));assert(state.has('progress-bob'));assert.equal(state.get('credential-config'),JSON.stringify('untouched'));assert(!state.get('progress')!.includes('Private'));
await assert.rejects(store.saveProgress(progress),/erased|reload/i);await assert.rejects(store.saveSessionState('{"private":"old timer"}'),/erased|reload/i);await assert.rejects(store.updateProfileProgress(null,current=>({...current,qmeta:{x:{note:'stale'}}})),/erased|reload/i);await assert.rejects(store.eraseAnonymousPrivacy(snapshot),/changed/i);
const {putFilePreserving}=await import('../src/lib/documents.ts');await assert.rejects(putFilePreserving('latefile',{mime:'text/plain',data:'Yw=='}),/erased|reload/i);assert(!files.has('latefile'));state.set('family','{}');store.useStudentFiles('bob');await assert.rejects(putFilePreserving('latefamily',{mime:'text/plain',data:'Yw=='}),/erased|reload/i);assert(!files.has('latefamily'));store.useStudentFiles(null);state.delete('family');
const cleared=await store.readAnonymousPrivacy();assert.equal(cleared.session,null);
const counts=mutations;await assert.rejects(store.recoverAnonymousPrivacy(cleared,progress,null,{...snapshot.files,shared:{mime:'text/plain',data:'Yw=='}}),/conflict/);assert.equal(mutations,counts);assert(!files.has('unique'),'conflict preflight creates no orphan');
await assert.rejects(store.recoverAnonymousPrivacy(cleared,progress,null,snapshot.files,()=>{throw Error('cancelled');}),/cancelled/);assert.equal(mutations,counts);
const recovered=await store.recoverAnonymousPrivacy(cleared,progress,null,snapshot.files);assert.equal(recovered.progress.anonymousGeneration,2);assert.equal(recovered.progress.work?.['course/essay'].text,'Private writing');assert(files.has('unique'));await assert.rejects(store.saveSessionState(null),/erased|reload/i);
console.log('Anonymous storage inventory, scoped erase/files, preserved profiles/settings, stale generations, cancelled/conflicting recovery and explicit restoration passed');
