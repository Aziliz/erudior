import assert from 'node:assert/strict';
import {createAnonymousPrivacyService,type AnonymousSnapshot} from '../src/lib/anonymousPrivacyService';
import {learnerHash} from '../src/lib/learnerPrivacy';
import {learnerPrivacyProgress,learnerPrivacyCourse} from './fixtures/learnerPrivacy';
import {emptyProgress} from '../src/lib/storage';
let progress={...learnerPrivacyProgress(),anonymousGeneration:0},authority='anonymous',writes=0,changed=0;
let privacyRevision=0;
let pauseAuth:(()=>Promise<void>)|undefined,pauseRead:(()=>Promise<void>)|undefined;
async function read():Promise<AnonymousSnapshot>{await pauseRead?.();return {progress:structuredClone(progress),session:null,files:{},missingFiles:[],generation:progress.anonymousGeneration,progressDigest:await learnerHash(progress),sessionDigest:await learnerHash(null),privacyDigest:await learnerHash(privacyRevision),anonymousAssociation:false,anonymousPending:false};}
async function cas(expected:Pick<AnonymousSnapshot,'generation'|'progressDigest'|'sessionDigest'|'privacyDigest'>){const current=await read();assert.equal(current.generation,expected.generation);assert.equal(current.progressDigest,expected.progressDigest);}
const service=createAnonymousPrivacyService({read,sources:async()=>({courses:[learnerPrivacyCourse],banks:[]}),erase:async(expected,guard)=>{await cas(expected);await guard?.();writes++;progress={...emptyProgress(),anonymousGeneration:progress.anonymousGeneration+1};return {progress,retainedFileIds:[]};},recover:async(expected,next,_session,_files,guard)=>{await cas(expected);await guard?.();writes++;progress={...next,anonymousGeneration:progress.anonymousGeneration+1};return {progress,retainedFileIds:[]};},changed:async()=>{changed++;}},async()=>{await pauseAuth?.();if(!authority)throw Error('Anonymous scope changed');return authority;});
const phrase='synthetic archive passphrase';
const cancelled=service.prepareArchive(phrase);service.clearPrivate();await assert.rejects(cancelled,/changed/);
const archive=await service.prepareArchive(phrase);assert(!archive.encrypted.includes('Private note'));
const inspected=await service.inspect();progress.lessonsDone['synthetic-practice/lesson-two']='2026-10-29';await assert.rejects(service.erase(inspected),/changed/);assert.equal(writes,0);
const fresh=await service.inspect();service.clearPrivate();await assert.rejects(service.erase(fresh),/Inspect/);
await service.erase(await service.inspect());assert.equal(writes,1);assert.deepEqual(progress.lessonsDone,{});assert.equal(changed,1);
const recovery=await service.previewArchive(archive.encrypted,phrase);assert.equal(recovery.inventory.rows.find(x=>x.label==='Question notes')?.count,1);authority='';await assert.rejects(service.recover(recovery),/scope/);authority='anonymous';
const cleared=await service.previewArchive(archive.encrypted,phrase);service.clearPrivate();await assert.rejects(service.recover(cleared),/Preview/);
await service.recover(await service.previewArchive(archive.encrypted,phrase));assert.equal(progress.qmeta?.private.note,'Private note NEVER included');assert.equal(writes,2);assert.equal(changed,2);
await assert.rejects(service.previewArchive(archive.encrypted,'wrong password long enough'));
const malformed=JSON.parse(archive.encrypted);malformed.kdf.iterations=2147483647;await assert.rejects(service.previewArchive(JSON.stringify(malformed),phrase),/Invalid encrypted/);
await assert.rejects(service.erase({id:'forged',rows:[],attachmentFiles:0,missingFiles:0}),/Inspect/);
console.log('Anonymous privacy service authority, archive, stale previews and cancellation passed');

for(const boundary of ['auth','read'] as const){let enter!:()=>void,release!:()=>void;const entered=new Promise<void>(r=>enter=r),gate=new Promise<void>(r=>release=r);const pause=async()=>{enter();await gate;};if(boundary==='auth')pauseAuth=pause;else pauseRead=pause;const pending=service.inspect();await entered;service.clearPrivate();release();await assert.rejects(pending,/changed/);pauseAuth=undefined;pauseRead=undefined;}
// Final mutation guard must recheck cancellation AFTER asynchronous authority resolution.
const finalReceipt=await service.inspect();let calls=0,enter!:()=>void,release!:()=>void;const entered=new Promise<void>(r=>enter=r),gate=new Promise<void>(r=>release=r);pauseAuth=async()=>{if(++calls===2){enter();await gate;}};const beforeWrites=writes,pendingErase=service.erase(finalReceipt);await entered;service.clearPrivate();release();await assert.rejects(pendingErase,/cleared/);assert.equal(writes,beforeWrites);pauseAuth=undefined;
console.log('Anonymous deferred-read/authority cancellation guards passed');

const beforeQueueChange=await service.inspect();privacyRevision++;await assert.rejects(service.erase(beforeQueueChange),/changed/);assert.equal(writes,beforeWrites);
console.log('Anonymous queue/consent snapshot changes invalidate destructive receipts');
