import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {normalizeCourse,exportCourseSnapshot,serializeCourse} from '../src/lib/course.ts';
import {canonicalAuthoringFromCourse,courseFromCanonicalAuthoring,migrateLegacyCourseToCanonical} from '../src/lib/canonicalAuthoring.ts';
const options={mode:'source' as const,maxBytes:Number.MAX_SAFE_INTEGER};
const defects:Record<string,string[]>={
 'math/math-geometry.json':['decks[0].cards[234].E: unsupported or authority/runtime field','decks[0].cards[234].F): unsupported or authority/runtime field'],
 'math/math-linear-algebra.json':['decks[0].cards[96].4) code: unsupported or authority/runtime field'],
 'math/science-biology.json':['decks[0].cards[328].C4 and CAM plants: unsupported or authority/runtime field'],
};
let courses=0,rawPassed=0,rawRejected=0;
for(const file of readdirSync('samples',{recursive:true}).filter((x):x is string=>typeof x==='string'&&x.endsWith('.json'))){
 const raw=JSON.parse(readFileSync('samples/'+file,'utf8'));if(!raw.modules&&!raw.lessons)continue;courses++;
 const portable=JSON.parse(exportCourseSnapshot(normalizeCourse(raw)));
 const payload=canonicalAuthoringFromCourse(portable,options);
 assert.deepEqual(courseFromCanonicalAuthoring(payload,options),portable,`${file}: supported runtime model roundtrip`);
 assert.deepEqual(JSON.parse(serializeCourse(normalizeCourse(portable))),portable,`${file}: durable normalized metadata roundtrip`);
 try{const migrated=migrateLegacyCourseToCanonical(raw,options);assert.deepEqual(courseFromCanonicalAuthoring(migrated.payload,options),migrated.payload.course);assert.ok(migrated.transformations.every(t=>t.path&&t.reason));rawPassed++;}
 catch(error){assert.ok(defects[file],`${file}: unexpected migration rejection: ${String(error)}`);assert.deepEqual((error as Error).message.split('; ').sort(),defects[file].slice().sort(),`${file}: only documented unknown fields may fail`);rawRejected++;}
}
assert.equal(courses,28,'entire checked-in course corpus covered');
assert.equal(rawPassed+rawRejected,courses);
console.log(`canonical corpus: ${courses} supported runtime models roundtrip exactly; ${rawPassed} raw packages migrate; ${rawRejected} malformed raw packages fail closed with documented field errors`);
