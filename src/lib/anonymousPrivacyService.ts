/** Explicit local-only anonymous archive, preview and erasure. Never a cloud payload. */
import type {Bank,Course,Progress} from './types';
import type {StoredDocument} from './documents';
export interface AnonymousSnapshot {progress:Progress;session:string|null;files:Record<string,StoredDocument>;missingFiles:string[];generation:number;progressDigest:string;sessionDigest:string;privacyDigest:string;anonymousAssociation:boolean;anonymousPending:boolean}
export interface AnonymousInventory {id:string;rows:{label:string;count:number}[];attachmentFiles:number;missingFiles:number}
export interface AnonymousRecoveryPreview {id:string;inventory:AnonymousInventory;warnings:string[];sessionRestorable:boolean}
export interface AnonymousPrivacyService {
 clearPrivate():void;
 inspect():Promise<AnonymousInventory>;
 prepareArchive(passphrase:string):Promise<{encrypted:string;inventory:AnonymousInventory}>;
 previewArchive(raw:string,passphrase:string):Promise<AnonymousRecoveryPreview>;
 erase(inventory:AnonymousInventory):Promise<{retainedFileIds:string[]}>;
 recover(preview:AnonymousRecoveryPreview):Promise<{retainedFileIds:string[]}>;
}
export interface AnonymousPrivacyIO {
 read():Promise<AnonymousSnapshot>;
 erase(expected:Pick<AnonymousSnapshot,'generation'|'progressDigest'|'sessionDigest'|'privacyDigest'>,guard?:()=>Promise<void>):Promise<{progress:Progress;retainedFileIds:string[]}>;
 recover(expected:Pick<AnonymousSnapshot,'generation'|'progressDigest'|'sessionDigest'|'privacyDigest'>,progress:Progress,session:string|null,files:Record<string,StoredDocument>,guard?:()=>Promise<void>):Promise<{progress:Progress;retainedFileIds:string[]}>;
 sources():Promise<{courses:Course[];banks:Bank[]}>;
 changed(progress:Progress):Promise<void>;
}
import {ANONYMOUS_PRIVACY_LIMITS,captureAnonymousRecovery,inventoryAnonymousData,parseAnonymousRecovery,previewAnonymousRecovery,recoveryProgress,type AnonymousRecovery} from './anonymousPrivacy';
import {encryptText,decryptText} from './backup';
import {learnerCanonical,learnerHash} from './learnerPrivacy';
export function createAnonymousPrivacyService(io:AnonymousPrivacyIO,authorize:()=>Promise<string>):AnonymousPrivacyService {
 let epoch=0;
 const inventories=new Map<string,{snapshot:AnonymousSnapshot;authority:string}>();
 const recoveries=new Map<string,{snapshot:AnonymousSnapshot;archive:AnonymousRecovery;authority:string;sourcesDigest:string}>();
 const checkPass=(p:string)=>{if(typeof p!=='string'||p.length<12||p.length>1024)throw Error('Use a recovery passphrase of 12–1024 characters.');};
 function equal(a:AnonymousSnapshot,b:AnonymousSnapshot){return a.generation===b.generation&&a.progressDigest===b.progressDigest&&a.sessionDigest===b.sessionDigest&&a.privacyDigest===b.privacyDigest&&learnerCanonical(a.files)===learnerCanonical(b.files)&&learnerCanonical(a.missingFiles)===learnerCanonical(b.missingFiles);}
 async function assertCurrent(snapshot:AnonymousSnapshot,authority:string,token:number){const currentAuthority=await authorize(),current=await io.read();if(epoch!==token||currentAuthority!==authority||!equal(snapshot,current))throw Error('Anonymous data, authority or private preparation changed. Inspect again.');}
 function inventory(snapshot:AnonymousSnapshot):AnonymousInventory {
  const counts=inventoryAnonymousData(snapshot.progress,snapshot.session,snapshot.files);
  const labels:Record<string,string>={questionAnnotations:'Question flags and annotations',practiceGrades:'Spreadsheet practice grades',competencyEvidence:'Competency evidence snapshots',lessonCompletions:'Lesson completions',moduleCompletions:'Module completions',questionStats:'Question statistics',flashcards:'Flashcard schedules',vocabulary:'Vocabulary schedules',plans:'Learning plans',activityDays:'Activity days',drillTallies:'Drill tallies',enrollments:'Local course enrollments',pretests:'Warm-up checkpoints',supportTasks:'Imported support tasks',studyPreferences:'Study preferences',attempts:'Question attempts',answers:'Recorded answers',notes:'Question notes',work:'Writing and lab records',logs:'Activity logs',reading:'Reading records',assessedWork:'Assessed work histories',spreadsheets:'Spreadsheet histories',competencyDecisions:'Historical placement decisions',session:'Unfinished session',files:'Available attachment files',fileBytes:'Attachment bytes',progressBytes:'Progress bytes',sessionBytes:'Session bytes'};
  return {id:crypto.randomUUID(),rows:[{label:'Local transfer association',count:Number(snapshot.anonymousAssociation)},{label:'Queued encrypted transfers',count:Number(snapshot.anonymousPending)},...Object.entries(counts).filter(([key])=>key!=='missingFiles').map(([key,value])=>({label:labels[key]??key,count:typeof value==='boolean'?Number(value):typeof value==='number'?value:0}))],attachmentFiles:Object.keys(snapshot.files).length,missingFiles:snapshot.missingFiles.length};
 }
 async function inspect(){const token=epoch,authority=await authorize(),snapshot=await io.read();await assertCurrent(snapshot,authority,token);const result=inventory(snapshot);inventories.clear();inventories.set(result.id,{snapshot,authority});return result;}
 return {
  clearPrivate(){epoch++;inventories.clear();recoveries.clear();},
  inspect,
  async prepareArchive(passphrase){checkPass(passphrase);const token=epoch,authority=await authorize(),snapshot=await io.read(),sources=await io.sources();const archive=await captureAnonymousRecovery(snapshot.progress,snapshot.session,snapshot.files,sources.courses,sources.banks);const encrypted=await encryptText(JSON.stringify(archive),passphrase);await assertCurrent(snapshot,authority,token);return {encrypted,inventory:inventory(snapshot)};},
  async previewArchive(raw,passphrase){checkPass(passphrase);const token=epoch,authority=await authorize(),snapshot=await io.read();if(typeof raw!=='string'||raw.length>Math.ceil(ANONYMOUS_PRIVACY_LIMITS.archiveBytes*1.4)+4096)throw Error('Anonymous archive exceeds the supported size.');const envelope=JSON.parse(raw);if(!envelope||envelope.format!=='examiner-backup-encrypted'||envelope.version!==1||envelope.kdf?.name!=='PBKDF2-SHA-256'||envelope.kdf.iterations!==600000||typeof envelope.kdf.salt!=='string'||atob(envelope.kdf.salt).length!==16||typeof envelope.iv!=='string'||atob(envelope.iv).length!==12||typeof envelope.data!=='string')throw Error('Invalid encrypted anonymous archive.');const archive=parseAnonymousRecovery(await decryptText(envelope,passphrase)),sources=await io.sources(),preview=await previewAnonymousRecovery(archive,sources.courses,sources.banks);const sourcesDigest=await learnerHash(sources);await assertCurrent(snapshot,authority,token);const id=crypto.randomUUID();recoveries.clear();recoveries.set(id,{snapshot,archive,authority,sourcesDigest});return {id,inventory:inventory({...snapshot,progress:archive.progress,session:archive.session,files:archive.files,missingFiles:archive.missingFiles,anonymousAssociation:false,anonymousPending:false}),warnings:[...preview.sourceChanges,'Recovery replaces only anonymous local learning data. Imported adult placement decisions remain unverified history. Saved backups and remote checkpoints are separate.',...(!preview.sessionRestorable?['The archived unfinished session cannot safely resume against currently installed sources. It stays in the archive but will not be activated.']:[])],sessionRestorable:preview.sessionRestorable};},
  async erase(preview){const token=epoch,stage=inventories.get(preview.id);if(!stage)throw Error('Inspect anonymous data again before erasing.');await assertCurrent(stage.snapshot,stage.authority,token);const result=await io.erase(stage.snapshot,async()=>{const currentAuthority=await authorize();if(epoch!==token||currentAuthority!==stage.authority)throw Error('Anonymous erasure preparation was cleared or authority changed.');});epoch++;inventories.clear();recoveries.clear();await io.changed(result.progress).catch(()=>{});return {retainedFileIds:result.retainedFileIds};},
  async recover(preview){const token=epoch,stage=recoveries.get(preview.id);if(!stage)throw Error('Preview the anonymous archive again before recovery.');await assertCurrent(stage.snapshot,stage.authority,token);const sources=await io.sources();if(await learnerHash(sources)!==stage.sourcesDigest)throw Error('Installed sources changed. Preview the anonymous archive again.');const current=await previewAnonymousRecovery(stage.archive,sources.courses,sources.banks);await assertCurrent(stage.snapshot,stage.authority,token);const result=await io.recover(stage.snapshot,recoveryProgress(stage.archive,stage.snapshot.progress),current.restoredSession,stage.archive.files,async()=>{const currentAuthority=await authorize();if(epoch!==token||currentAuthority!==stage.authority)throw Error('Anonymous recovery preparation was cleared or authority changed.');});epoch++;inventories.clear();recoveries.clear();await io.changed(result.progress).catch(()=>{});return {retainedFileIds:result.retainedFileIds};},
 };
}
