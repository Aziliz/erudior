// Browser-only key/value store (web version and `npm run dev` without Tauri).
//
// Courses are far too big for localStorage (about 5 MB per site; one math course is
// ~0.7 MB), so everything goes in IndexedDB, which allows hundreds of MB. Anything an
// older version left in localStorage is moved over the first time it's opened.

const DB = "examiner";
const STORE = "kv";
const MOVE_PREFIXES = ["examiner.course.", "examiner.bank.", "examiner.progress", "examiner.session"];

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

export async function webDelete(key: string): Promise<void> {
  await run(await open(), "readwrite", (s) => s.delete(key));
}

/** All values whose key starts with prefix. */
export async function webList(prefix: string): Promise<string[]> {
  const db = await open();
  const range = IDBKeyRange.bound(prefix, prefix + "￿");
  return run<string[]>(db, "readonly", (s) => s.getAll(range) as IDBRequest<string[]>);
}
