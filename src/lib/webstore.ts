// Browser-only key/value store (web version and `npm run dev` without Tauri).
//
// Courses are far too big for localStorage (about 5 MB per site; one math course is
// ~0.7 MB), so everything goes in IndexedDB, which allows hundreds of MB. Anything an
// older version left in localStorage is moved over the first time it's opened.

const DB = "erudior";
const STORE = "kv";
const MOVE_PREFIXES = ["erudior.course.", "erudior.bank.", "erudior.progress", "erudior.session"];

let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }).then(async (db) => {
    await migrate(db);
    return db;
  });
  return dbPromise!;
}

function run<T>(db: IDBDatabase, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req ? req.result : (undefined as T));
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("Storage write was aborted (disk full?)"));
  });
}

async function migrate(db: IDBDatabase): Promise<void> {
  let keys: string[] = [];
  try {
    keys = Object.keys(localStorage).filter((k) => MOVE_PREFIXES.some((p) => k.startsWith(p)));
  } catch {
    return;
  }
  if (!keys.length) return;
  const items = keys.map((k) => [k, localStorage.getItem(k)] as const);
  await run(db, "readwrite", (s) => {
    for (const [k, v] of items) if (v !== null) s.put(v, k);
  });
  for (const k of keys) localStorage.removeItem(k);
}

export async function webGet(key: string): Promise<string | null> {
  const v = await run<string | undefined>(await open(), "readonly", (s) => s.get(key));
  return v ?? null;
}

export async function webSet(key: string, value: string): Promise<void> {
  await run(await open(), "readwrite", (s) => s.put(value, key));
}

/** Compare and replace in one IndexedDB transaction. Readwrite transactions on
 * this store serialize across tabs even where navigator.locks is unavailable.
 * Resolve only on commit, never merely when the put request succeeds. */
export async function webCompareAndSwap(key: string, expected: string | null, content: string, anonymousGeneration?: number): Promise<boolean> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    let matched = false;
    let failure: unknown;
    tx.oncomplete = () => resolve(matched);
    tx.onerror = () => reject(failure ?? tx.error ?? new Error("Storage comparison failed"));
    tx.onabort = () => reject(failure ?? tx.error ?? new Error("Storage comparison was aborted"));
    const store = tx.objectStore(STORE);
    const check = anonymousGeneration === undefined ? null : store.get("erudior.progress");
    const request = store.get(key);
    request.onsuccess = () => {
      if (check) {
        let generation = 0;
        try { generation = check.result == null ? 0 : (JSON.parse(check.result).anonymousGeneration ?? 0); }
        catch { failure = new Error("Damaged anonymous progress"); tx.abort(); return; }
        if (generation !== anonymousGeneration) { failure = new Error("Anonymous data changed or was erased. Reload before saving."); tx.abort(); return; }
      }
      if ((request.result ?? null) !== expected) return;
      try {
        store.put(content, key);
        matched = true;
      } catch (error) {
        failure = error;
        tx.abort();
      }
    };
  });
}

export async function webDelete(key: string): Promise<void> {
  await run(await open(), "readwrite", (s) => s.delete(key));
}

/** All values whose key starts with prefix. */
export async function webList(prefix: string): Promise<string[]> {
  const db = await open();
  const range = IDBKeyRange.bound(prefix, prefix + "￿");
  return run<string[]>(db, "readonly", (s) => s.getAll(range) as IDBRequest<string[]>);
}

/** Atomic anonymous-only replacement; unrelated profiles, courses and authentication are untouched. */
export async function webReplaceAnonymous(expectedProgress:string|null,expectedSession:string|null,progress:string,session:string,fileIds:string[],files:Record<string,{mime:string;data:string}>={},expectedPrivacy:string|null=null,privacy:string=""):Promise<{retainedFileIds:string[]}> {
 const old=expectedProgress===null?{}:JSON.parse(expectedProgress),next=JSON.parse(progress),wrapped=JSON.parse(session),generation=old.anonymousGeneration??0;
 if(!Number.isSafeInteger(generation)||generation<0||next.anonymousGeneration!==generation+1||wrapped.format!=='erudior-anonymous-session'||wrapped.version!==1||wrapped.generation!==generation+1||(wrapped.content!==null&&typeof wrapped.content!=='string')||progress.length>24*1024*1024||session.length>3*1024*1024)throw Error('Invalid anonymous replacement generation or size');
 const safe=(id:string)=>/^[A-Za-z0-9_-]{1,100}$/.test(id)&&!['__proto__','constructor','prototype'].includes(id);
 if(fileIds.length>10000||fileIds.some(id=>!safe(id))||Object.keys(files).length>100||JSON.stringify(files).length>24*1024*1024||Object.entries(files).some(([id,f])=>!safe(id)||!f||Object.keys(f).sort().join(',')!=='data,mime'||typeof f.mime!=='string'||typeof f.data!=='string'))throw Error('Invalid anonymous replacement attachments');
 if(!privacy)throw Error('Anonymous association cleanup is required');
 if(privacy){const old=expectedPrivacy===null?{format:'erudior-learner-privacy',version:1,revision:0,profiles:[],deletedStudentIds:[]}:JSON.parse(expectedPrivacy);const expected={...old,revision:old.revision+1,profiles:old.profiles.filter((p:{studentId:unknown})=>p.studentId!==null)};const canonical=(v:any):string=>JSON.stringify(v&&typeof v==='object'?(Array.isArray(v)?v.map(x=>JSON.parse(canonical(x))):Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(canonical(v[k]))]))):v);if(canonical(JSON.parse(privacy))!==canonical(expected))throw Error('Only anonymous association removal is allowed');}
 const db=await open();return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readwrite'),s=tx.objectStore(STORE);let failure:unknown;const retainedFileIds:string[]=[];
  tx.oncomplete=()=>resolve({retainedFileIds});tx.onerror=tx.onabort=()=>reject(failure??tx.error??Error('Anonymous replacement failed'));
  const all=s.getAll(),keys=s.getAllKeys();keys.onsuccess=()=>{try{
   const values=new Map(keys.result.map((k,i)=>[String(k),all.result[i]]));
   if(values.get('erudior.family')!=null||(values.get('erudior.progress')??null)!==expectedProgress||(values.get('erudior.session')??null)!==expectedSession||(values.get('erudior.learner-privacy')??null)!==expectedPrivacy)throw Error('Anonymous scope or data changed. Inspect again.');
   for(const [id,file]of Object.entries(files)){const old=values.get('erudior.document.'+id);if(old!=null){const parsed=JSON.parse(old);if(parsed.mime!==file.mime||parsed.data!==file.data)throw Error('Recovery attachment conflicts with existing bytes.');}}
   for(const [id,file]of Object.entries(files))s.put(JSON.stringify(file),'erudior.document.'+id);
   s.put(progress,'erudior.progress');s.put(session,'erudior.session');if(privacy)s.put(privacy,'erudior.learner-privacy');
   for(const id of fileIds){const docKey='erudior.document.'+id;const has=(v:unknown):boolean=>v===id||(Array.isArray(v)?v.some(has):!!v&&typeof v==='object'&&Object.entries(v).some(([key,value])=>key===id||has(value)));const shared=[...values].some(([k,v])=>{if(k===docKey||k==='erudior.progress'||k==='erudior.session'||k==='erudior.learner-privacy')return false;try{return typeof v==='string'?has(JSON.parse(v)):has(v);}catch{return true;}});if(shared)retainedFileIds.push(id);else s.delete(docKey);}
  }catch(e){failure=e;tx.abort();}};
 });
}

/** Anonymous document writes share the same IndexedDB generation fence as progress. */
export async function webAnonymousDocument(key:string,value:string|null,generation:number):Promise<void>{
 const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite'),s=tx.objectStore(STORE);let failure:unknown;
 tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(failure??tx.error??Error('Document write failed'));
 const p=s.get('erudior.progress');p.onsuccess=()=>{try{const current=p.result==null?0:(JSON.parse(p.result).anonymousGeneration??0);if(current!==generation)throw Error('Anonymous data was erased; reload before saving attachments.');if(value===null)s.delete(key);else s.put(value,key);}catch(e){failure=e;tx.abort();}};});
}
