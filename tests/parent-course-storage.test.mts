import assert from 'node:assert/strict';
import fs from 'node:fs';
// Deterministic IDB model; browser suite also exercises actual IndexedDB.
const values=new Map<string,string>();let tail=Promise.resolve();
const db={transaction(_store:string,mode:string){
const requests:Array<()=>void>=[];let staged:Map<string,string>,aborted=false;
const tx:any={error:null,abort(){aborted=true;},objectStore(){return{
get(key:string){const req:any={};requests.push(()=>{req.result=staged.get(key);req.onsuccess?.();});return req;},
put(value:string,key:string){const req:any={};requests.push(()=>{staged.set(key,value);req.onsuccess?.();});return req;},
};}};
tail=tail.then(async()=>{staged=new Map(values);await new Promise(r=>setImmediate(r));while(requests.length&&!aborted)requests.shift()!();if(aborted){tx.onabort?.();return;}if(mode==='readwrite'){values.clear();for(const[k,v]of staged)values.set(k,v);}tx.oncomplete?.();});return tx;
}};
Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:{open(){const request:any={result:db};queueMicrotask(()=>request.onsuccess?.());return request;}}});
const {emptyCourse,serializeCourse}=await import('../src/lib/course.ts');
const {loadStoredCourseSnapshot,compareAndSwapCourse}=await import('../src/lib/storage.ts');
const course={...emptyCourse('Synthetic CAS course'),id:'synthetic-cas'};
assert.equal(await loadStoredCourseSnapshot(course.id),null);assert(await compareAndSwapCourse(null,course));
const captured=await loadStoredCourseSnapshot(course.id);assert(captured);assert.equal(captured.course.id,course.id);
const [a,b]=await Promise.all([compareAndSwapCourse(captured.raw,{...course,title:'Winner A'}),compareAndSwapCourse(captured.raw,{...course,title:'Winner B'})]);
assert.equal(Number(a)+Number(b),1);
const winner=await loadStoredCourseSnapshot(course.id);assert.equal(winner?.course.title,a?'Winner A':'Winner B');
assert.equal(await compareAndSwapCourse(captured.raw,{...course,title:'Late stale review'}),false);assert.equal((await loadStoredCourseSnapshot(course.id))?.raw,winner?.raw);
assert.equal(await compareAndSwapCourse(null,course),false);
values.set('erudior.course.'+course.id,JSON.stringify(JSON.parse(serializeCourse(course))));
const historical=await loadStoredCourseSnapshot(course.id);assert(historical);assert(await compareAndSwapCourse(historical.raw,{...course,title:'Reviewed replacement'}));
await assert.rejects(loadStoredCourseSnapshot('../private'),/Invalid/);await assert.rejects(compareAndSwapCourse(null,{...course,id:'../private'}),/Invalid/);
const native=fs.readFileSync('src-tauri/src/lib.rs','utf8');
assert.match(native,/fn compare_and_swap_course[\s\S]*?item_path\(&app, "courses", &id\)[\s\S]*?NAMED_STATE_LOCK.lock\(\)[\s\S]*?compare_and_swap_course_path\(&path, &id, expected.as_deref\(\), &content\)/);
assert.match(native,/save_item,\s+compare_and_swap_course,/);
console.log('Parent course storage exact-byte CAS, competing writers, stale/absent previews, formatting and path safety passed.');
