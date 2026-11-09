import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
// Isolated native boundary: no real files, accounts, network, or identities.
const states = new Map<string,string>(), items = new Map<string,string>();
const writes: string[] = [], reads: string[] = [];
let onRead: ((name:string)=>void)|undefined, onWrite: ((name:string)=>void)|undefined;
(globalThis as any).isTauri = true;
(globalThis as any).window = { __TAURI_INTERNALS__: { invoke: async (command:string,args:any) => {
  if(command==='load_state'){reads.push(args.name);onRead?.(args.name);return states.get(args.name)??null;}
  if(command==='list_items')return [...items].filter(([key])=>key.startsWith(args.kind+':')).map(([,raw])=>raw);
  if(command==='load_item')return items.get(args.kind+':'+args.id)??null;
  if(command==='save_state'){writes.push(args.name);args.content===null?states.delete(args.name):states.set(args.name,args.content);onWrite?.(args.name);return;}
  if(command==='compare_and_swap_state'){if((states.get(args.name)??null)!==args.expected)return false;writes.push(args.name);states.set(args.name,args.content);onWrite?.(args.name);return true;}
  if(command==='save_item'){const key=args.kind+':'+args.id;writes.push(key);items.set(key,args.content);onWrite?.(key);return;}
  if(command==='delete_item'){const key=args.kind+':'+args.id;writes.push(key);items.delete(key);onWrite?.(key);return;}
  throw Error('Unexpected command '+command);
} } };
const backup = await import('../src/lib/backup.ts');
const { emptyProgress, activeStudent, useStudentFiles } = await import('../src/lib/storage.ts');
const { emptyRecords } = await import('../src/lib/records.ts');
const { emptyCourse, serializeCourse } = await import('../src/lib/course.ts');
const { emptyBank, serializeBank } = await import('../src/lib/validate.ts');
const session = await import('../src/lib/localSession.ts');
const {verifyEncryptedBackup, restorePreparedBackup, discardPreparedBackup, restoreContents, encryptText, decryptText, FamilyRestoreError} = backup;
const parent = {password:{salt:Buffer.alloc(16,1).toString('base64'),hash:Buffer.alloc(32,2).toString('base64'),iterations:1000},recovery:{salt:Buffer.alloc(16,3).toString('base64'),hash:Buffer.alloc(32,4).toString('base64'),iterations:1000}};
const family = {format:'erudior-family',version:1,parent,state:'CO',route:'synthetic',year:{start:'2026-08-01',end:'2027-07-31'},dailyMinutes:180,reminders:[],done:[],students:[{id:'alice',name:'Synthetic Alice',grade:5,assigned:[],freeChoice:false}]};
const oldCourse={...emptyCourse('Current synthetic course'),id:'oldcourse'}, newCourse={...emptyCourse('Incoming synthetic course'),id:'newcourse'};
const current={courses:[oldCourse],banks:[]};
const record={...emptyRecords(),reading:[{id:'book1',title:'Private synthetic title',author:'Synthetic',date:'2026-11-01',subject:'Reading',note:'Private synthetic note'}]};
const content:any={format:'examiner-family-backup',version:1,createdAt:'2026-11-01T12:00:00.000Z',family,students:{alice:{progress:emptyProgress(),records:record,photos:[]}},progress:emptyProgress(),courses:[JSON.parse(serializeCourse(newCourse))],banks:[],files:{attachment:{mime:'text/plain',data:'YWJj'}}};
const text=JSON.stringify(content), password='Synthetic backup passphrase', encrypted=await encryptText(text,password,1000);
function reset(){
  onRead=undefined;onWrite=undefined;states.clear();items.clear();writes.length=0;reads.length=0;
  states.set('family',JSON.stringify(family));states.set('progress',JSON.stringify(emptyProgress()));states.set('progress-alice',JSON.stringify(emptyProgress()));
  items.set('courses:oldcourse',serializeCourse(oldCourse));items.set('documents:attachment',JSON.stringify({mime:'text/plain',data:'b2xk'}));items.set('documents:other',JSON.stringify({mime:'text/plain',data:'b3RoZXI='}));
  session.configureLocalSession(false);useStudentFiles('alice');
}
const snapshot=()=>JSON.stringify({states:[...states],items:[...items],active:activeStudent()});
async function noWrites(work:()=>Promise<unknown>){const before=snapshot();writes.length=0;await work();assert.deepEqual(writes,[]);assert.equal(snapshot(),before);}
async function rejected(work:()=>Promise<unknown>,pattern?:RegExp){await noWrites(async()=>{await assert.rejects(work,pattern);});}
reset();
let prepared=await verifyEncryptedBackup(encrypted,password,current);
assert.equal(prepared.digest,createHash('sha256').update(text).digest('hex'));
assert.equal(prepared.inventory.students,1);assert.equal(prepared.inventory.courses,1);assert.equal(prepared.inventory.records,1);assert.equal(prepared.inventory.files,1);
assert.deepEqual(prepared.currentInventory,{students:1,courses:1,banks:0});assert.equal(prepared.changes.coursesAdded,1);assert.equal(prepared.changes.coursesRemoved,1);
assert(!JSON.stringify(prepared).includes(parent.password.hash));assert(!JSON.stringify(prepared).includes('Private synthetic note'));
assert.deepEqual(writes,[]);assert.equal(activeStudent(),'alice');
assert(Object.isFrozen(prepared));assert(Object.isFrozen(prepared.inventory));assert(Object.isFrozen(prepared.warnings));assert(Object.isFrozen(prepared.inventory.studentNames));
assert.throws(()=>{(prepared as any).digest='forged';});
await noWrites(async()=>discardPreparedBackup(prepared));
await rejected(()=>restorePreparedBackup(prepared,current),/discarded|used/);
await rejected(()=>restorePreparedBackup({...prepared},current),/discarded|used/);

// Caller mutations while PBKDF2 yields never replace the exact encrypted input.
const mutable=JSON.parse(encrypted);const pending=verifyEncryptedBackup(mutable,password,current);mutable.data='AAAA';mutable.kdf.iterations=2_000_001;
prepared=await pending;assert.equal(prepared.digest,createHash('sha256').update(text).digest('hex'));discardPreparedBackup(prepared);
const mutableCurrent=structuredClone(current);const pendingCurrent=verifyEncryptedBackup(encrypted,password,mutableCurrent);mutableCurrent.courses[0].title='Changed during verify';
await rejected(()=>pendingCurrent,/changed during verification/);
await rejected(()=>verifyEncryptedBackup(encrypted,'wrong',current),/Wrong passphrase/);
const corrupt=JSON.parse(encrypted);corrupt.data=(corrupt.data[0]==='A'?'B':'A')+corrupt.data.slice(1);
await rejected(()=>verifyEncryptedBackup(corrupt,password,current),/Wrong passphrase/);
for(const mutate of [
  (x:any)=>x.version=99,(x:any)=>x.kdf.name='unknown',(x:any)=>x.kdf.iterations=1,(x:any)=>x.kdf.iterations=2_000_001,
  (x:any)=>x.kdf.iterations=1000.5,(x:any)=>x.kdf.iterations=NaN,(x:any)=>x.kdf.salt='AAAA',(x:any)=>x.iv='AAAA',
  (x:any)=>x.data='AA=A',(x:any)=>x.data='AB==',(x:any)=>x.data='',(x:any)=>x.kdf=null,(x:any)=>x.extra=true,
]){const bad=JSON.parse(encrypted);mutate(bad);await rejected(()=>verifyEncryptedBackup(bad,password,current));}
await rejected(()=>verifyEncryptedBackup('x'.repeat(backup.MAX_ENCRYPTED_BACKUP_BYTES+1),password,current),/size limit/);
await rejected(()=>encryptText('x'.repeat(backup.MAX_BACKUP_PLAINTEXT_BYTES+1),password),/size limit/);
for(const iterations of [0,999,1000.5,2_000_001,NaN,Infinity])await rejected(()=>encryptText(text,password,iterations),/work factor/);
await rejected(()=>verifyEncryptedBackup(encrypted.replace('"version":1','"version":1,"version":1'),password,current),/duplicate/);

// Structural and existing specialized validators all run before any destructive call.
for(const mutate of [
  (x:any)=>x.version=2,(x:any)=>x.students.alice.progress=null,(x:any)=>x.progress.stats=[],(x:any)=>x.students.alice.records=null,
  (x:any)=>x.family.students.push(x.family.students[0]),(x:any)=>delete x.students.alice,(x:any)=>x.students.outside=x.students.alice,
  (x:any)=>x.courses.push(x.courses[0]),(x:any)=>x.students.alice.photos=[{id:'photo',date:'',subject:'',caption:'',image:'javascript:alert(1)'}],
  (x:any)=>x.files['../escape']=x.files.attachment,(x:any)=>x.files.attachment.mime='not a mime',(x:any)=>x.files.attachment.data='ab=c',
  (x:any)=>x.files.attachment=null,(x:any)=>x.classroomWorkflows=null,(x:any)=>x.learnerPrivacy=null,
  (x:any)=>x.courses[0].lessons=[{id:'duplicate',module:'main',title:'First',body:''},{id:'duplicate',module:'main',title:'Second',body:''}],
  (x:any)=>x.students.alice.records.documents=[{id:'d',fileId:'../../bad',name:'bad',mime:'text/plain',bytes:1,kind:'Other',date:'',note:''}],
]){
 const bad=structuredClone(content);mutate(bad);const raw=JSON.stringify(bad);await rejected(()=>restoreContents(raw,current));
 await rejected(async()=>verifyEncryptedBackup(await encryptText(raw,password,1000),password,current));
}
for(const invalidText of [text.replace('"version":1','"version":1,"version":1'),text.replace('"grade":5','"grade":1e999'),text.replace('"grade":5','"__proto__":{},"grade":5')]){
 await rejected(()=>restoreContents(invalidText,current));
 await rejected(async()=>verifyEncryptedBackup(await encryptText(invalidText,password,1000),password,current));
}
const bank=JSON.parse(serializeBank(emptyBank('Synthetic questions')));bank.questions=[{id:'q',stem:'Question',choices:['a','b'],answer:0},{id:'q',stem:'Other',choices:['a','b'],answer:0}];
await rejected(()=>restoreContents(JSON.stringify({...content,banks:[bank]}),current),/duplicate/);
const missing=structuredClone(content);missing.students.alice.records.documents=[{id:'d',fileId:'missing',name:'Synthetic',mime:'text/plain',bytes:2,kind:'Other',date:'',note:''}];
await noWrites(async()=>{prepared=await verifyEncryptedBackup(await encryptText(JSON.stringify(missing),password,1000),password,current);assert.equal(prepared.inventory.missingFiles,1);assert(prepared.warnings.some(w=>w.includes('missing from this backup')));discardPreparedBackup(prepared);});

// Actual verified Family recovery rejects malformed/missing credential material.
for (const mutate of [(x:any)=>delete x.family.parent,(x:any)=>delete x.family.parent.recovery,(x:any)=>x.family.parent.password.salt='AAAA',(x:any)=>x.family.parent.password.hash=Buffer.alloc(31).toString('base64'),(x:any)=>x.family.parent.pin={salt:'bad',hash:'bad',iterations:1000}]) {
 const bad=structuredClone(content);mutate(bad);await rejected(async()=>verifyEncryptedBackup(await encryptText(JSON.stringify(bad),password,1000),password,current),/credential/);
}
reset();items.set('documents:attachment','{broken existing bytes');await noWrites(async()=>{prepared=await verifyEncryptedBackup(encrypted,password,current);discardPreparedBackup(prepared);});

// Required runtime settings and every optional typed Family structure fail before writes.
for (const mutate of [
 (x:any)=>{x.family.students=[];x.students={};},(x:any)=>x.family.students[0].grade=13,(x:any)=>delete x.family.year,(x:any)=>delete x.family.state,(x:any)=>delete x.family.route,(x:any)=>delete x.family.dailyMinutes,
 (x:any)=>x.family.year={start:'2026-02-30',end:'2027-08-01'},(x:any)=>x.family.year={start:'2027-08-01',end:'2026-08-01'},
 (x:any)=>x.family.parent.failures=-1,(x:any)=>x.family.parent.lockedUntil='bad',
 (x:any)=>delete x.family.students[0].grade,(x:any)=>x.family.students[0].freeChoice='yes',(x:any)=>x.family.students[0].birthDate='bad',
 (x:any)=>x.family.reminders=[{id:'r',date:'bad',text:'Reminder'}],(x:any)=>x.family.done=[{}],
 (x:any)=>x.family.school={name:'Synthetic'},(x:any)=>x.family.grading={cutoffs:{A:90,B:80,C:70,D:60},weights:{lessons:0,modules:0,final:0,parent:0}},
 (x:any)=>x.family.grading={cutoffs:{A:80,B:80,C:70,D:60},weights:{lessons:25,modules:25,final:25,parent:25}},
 (x:any)=>x.family.classes=[{id:'class',name:'Synthetic',secret:Buffer.alloc(32).toString('base64'),students:['alice'],assignments:[],freeChoice:false,handins:[]}],
 (x:any)=>x.family.classes=[{id:'class',name:'Synthetic',secret:'bad',students:['alice'],assignments:[],freeChoice:false,handins:{}}],
]) {const bad=structuredClone(content);mutate(bad);await rejected(async()=>verifyEncryptedBackup(await encryptText(JSON.stringify(bad),password,1000),password,current));}
const optionalFamily=structuredClone(content);optionalFamily.family.school={name:'Synthetic school',administrator:'Synthetic adult',address:'Synthetic address'};optionalFamily.family.reminders=[{id:'r',date:'2026-11-01',text:'Synthetic reminder'}];optionalFamily.family.done=['r'];optionalFamily.family.grading={cutoffs:{A:90,B:80,C:70,D:60},weights:{lessons:25,modules:35,final:25,parent:15}};
await noWrites(async()=>{prepared=await verifyEncryptedBackup(await encryptText(JSON.stringify(optionalFamily),password,1000),password,current);discardPreparedBackup(prepared);});

// A library already stale before verification cannot hide undeleted installed courses/banks.
reset();await rejected(()=>verifyEncryptedBackup(encrypted,password,{courses:[],banks:[]}),/changed before verification/);
items.set('courses:extra',serializeCourse({...oldCourse,id:'extra'}));await rejected(()=>verifyEncryptedBackup(encrypted,password,current),/changed before verification/);reset();
items.set('banks:existing-bank',serializeBank({...emptyBank('Existing synthetic bank'),id:'existing-bank'}));
await rejected(()=>verifyEncryptedBackup(encrypted,password,current),/changed before verification/);
reset();await rejected(()=>verifyEncryptedBackup(encrypted,password,{courses:[{...oldCourse,id:'missing-current'}],banks:[]}),/changed before verification/);

// Every relevant persisted edit makes the review stale; no implicit re-verification.
for(const mutate of [
 ()=>states.set('progress-alice',JSON.stringify({...emptyProgress(),seeded:true})),
 ()=>states.set('family',JSON.stringify({...family,state:'changed'})),
 ()=>states.set('classroom-submissions',JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:['alice']})),
 ()=>states.set('session-alice','{"changed":true}'),()=>states.set('portfolio-alice','{"photos":[]}'),
 ()=>states.set('learner-privacy','{"changed":true}'),()=>items.set('courses:new',serializeCourse({...oldCourse,id:'new'})),
 ()=>{const a=items.get('documents:attachment')!,b=items.get('documents:other')!;items.set('documents:attachment',b);items.set('documents:other',a);},
]){reset();prepared=await verifyEncryptedBackup(encrypted,password,current);mutate();await rejected(()=>restorePreparedBackup(prepared,current),/changed/);await rejected(()=>restorePreparedBackup(prepared,current),/used/);}
reset();prepared=await verifyEncryptedBackup(encrypted,password,current);let baselineReads=0;
onRead=name=>{if(name==='family'&&++baselineReads===2)states.set('presentations','{"intervening":true}');};
await assert.rejects(()=>restorePreparedBackup(prepared,current),(e:any)=>e instanceof FamilyRestoreError&&!e.partial&&/changed/.test(e.message));assert.deepEqual(writes,[]);onRead=undefined;

// Session rotation, persisted credential changes, explicit revocation: all zero-write.
for(const revoke of [()=>session.lockLocalSession(),()=>{session.lockLocalSession();session.unlockLocalAdult();},()=>states.set('family',JSON.stringify({...family,parent:{...parent,password:{...parent.password,hash:'new'}}}))]){
 reset();session.configureLocalSession(true);session.unlockLocalAdult();session.bindLocalSessionCredential(parent);prepared=await verifyEncryptedBackup(encrypted,password,current);revoke();
 await noWrites(async()=>{await assert.rejects(()=>restorePreparedBackup(prepared,current),(e:any)=>e instanceof FamilyRestoreError&&!e.partial);});
}
reset();let allowed=true;prepared=await verifyEncryptedBackup(encrypted,password,current,()=>{if(!allowed)throw Error('Explicitly revoked');});allowed=false;await rejected(()=>restorePreparedBackup(prepared,current),/revoked/);
reset();session.configureLocalSession(true);await rejected(()=>verifyEncryptedBackup(encrypted,password,current),/session|adult/);session.unlockLocalLearner('alice');await rejected(()=>verifyEncryptedBackup(encrypted,password,current),/adult/);session.configureLocalSession(false);

// Successful explicit restore uses the reviewed bytes and token exactly once.
reset();prepared=await verifyEncryptedBackup(encrypted,password,current);const apply=restorePreparedBackup(prepared,current);
await assert.rejects(()=>restorePreparedBackup(prepared,current),/used/);const result=await apply;assert.deepEqual(result,{students:1,courses:1});
assert(!items.has('courses:oldcourse'));assert(items.has('courses:newcourse'));assert.deepEqual(JSON.parse(items.get('documents:attachment')!),content.files.attachment);
assert.equal(JSON.parse(states.get('records-alice')!).reading[0].title,'Private synthetic title');assert(writes.length>0);

// A failed actual write or post-write authority loss is explicitly partial, never retryable.
reset();prepared=await verifyEncryptedBackup(encrypted,password,current);onWrite=()=>{throw Error('Synthetic storage failure');};
await assert.rejects(()=>restorePreparedBackup(prepared,current),(e:any)=>e instanceof FamilyRestoreError&&e.partial&&/storage failure/.test(e.message));assert.equal(activeStudent(),'alice');onWrite=undefined;
await rejected(()=>restorePreparedBackup(prepared,current),/used/);
reset();prepared=await verifyEncryptedBackup(encrypted,password,current);onWrite=name=>{if(name==='presentations')throw Error('Failure after base save');};
await assert.rejects(()=>restorePreparedBackup(prepared,current),(e:any)=>e.partial===true);assert.equal(activeStudent(),'alice','partial failure restores storage profile selection');
onWrite=undefined;

// An erasure between the last library write and Family installation must not resurrect a learner.
for (const changeFamily of [false,true]) {
 reset();prepared=await verifyEncryptedBackup(encrypted,password,current);
 onWrite=name=>{if(name==='classroom-workflows'){
  states.set('classroom-submissions',JSON.stringify({version:1,records:[],complete:[],deletedStudentIds:['alice']}));
  if(changeFamily)states.set('family',JSON.stringify({...family,students:[]}));
 }};
 await assert.rejects(()=>restorePreparedBackup(prepared,current),(e:any)=>e instanceof FamilyRestoreError&&e.partial&&/deleted|Family changed/.test(e.message));
 assert(!writes.includes('family'));assert.deepEqual(JSON.parse(states.get('classroom-submissions')!).deletedStudentIds,['alice']);
 if(changeFamily)assert.deepEqual(JSON.parse(states.get('family')!).students,[]);
 onWrite=undefined;
}
// Supported fresh Classroom learners have sparse progress until first activity.
const {createFamily}=await import('../src/lib/family.ts');
for (const mode of ['homeschool','classroom'] as const) {
 reset();const created=await createFamily({mode,className:'Synthetic classroom',state:mode==='classroom'?'':'CO',route:'',year:{start:'2026-08-01',end:'2027-07-31'},dailyMinutes:180,password,school:{name:'',administrator:'',address:''},students:[{name:'Synthetic new learner',grade:4}]});
 const learner=created.family.students[0].id, expected=mode==='classroom'?{catalogV1:true,enrolled:[]}:emptyProgress();
 assert.deepEqual(JSON.parse(states.get('progress-'+learner)!),expected);
 const createdBackup=await backup.collect([],[]);assert.deepEqual(createdBackup.students[learner].progress,expected);
 writes.length=0;const createdText=await encryptText(JSON.stringify(createdBackup),password,1000);
 await noWrites(async()=>{prepared=await verifyEncryptedBackup(createdText,password,current);});
 await restorePreparedBackup(prepared,current);assert.deepEqual(JSON.parse(states.get('progress-'+learner)!),expected);
}

// V8 must not recurse/overflow its regex stack on valid large encrypted JSON/base64.
reset();const large='x'.repeat(8*1024*1024);const largeEnvelope=await encryptText(large,password,1000);await noWrites(async()=>assert.equal(await decryptText(largeEnvelope,password),large));
console.log('Family backup preflight: authenticated bounded envelopes, read-only inventory/cancel/failures, immutable bytes/handles, stale data/document swaps, adult revocation, single apply and explicit partial failure passed');
