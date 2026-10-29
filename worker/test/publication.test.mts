import { emptyAdvancedAssessmentPack } from "../../src/lib/advancedAssessment.ts";
// Deterministic failure/race boundaries; API smoke tests separately exercise real D1/R2.
import assert from "node:assert/strict";
import { toCourse } from "../../src/lib/communityFormat.ts";
import { normalizeCourse } from "../../src/lib/course.ts";
import { emptyBranchingPack } from "../../src/lib/branchingEngine.ts";
import { emptyScientificPack } from "../../src/lib/scientificWorkspace.ts";
import worker, { type Env } from "../src/index.ts";
const doc = {
  format: "erudior-community", version: 1, title: "Observations", description: "Count observations.", subject: "Science", level: "Elementary School", type: "Course",
  lessons: [{ id: "l1", title: "Observe", blocks: [{ type: "text", md: "Count the birds." }] }], decks: [],
  spreadsheetAssignments: [{ id: "counts", lessonId: "l1", title: "Count", starter: { sheets: { Data: { A1: 2 } } }, protectedCells: [], answers: { "Data!A1": 2 } }],
};
const request = () => new Request("http://localhost/drafts/course/publish", { method: "POST", headers: { Origin: "http://localhost:5181", Cookie: "erudior_session=test" } });
function fixture(version = 1, race = false) {
  let reads = 0; let release!: () => void; const barrier = new Promise<void>(resolve => { release = resolve; });
  let row: any = { id: "course", owner_id: "author", draft: JSON.stringify(doc), status: "published", version, reviewed_version: version };
  const objects = new Map<string, string>(version ? [[`courses/course.v${version}.json`, JSON.stringify(doc)]] : []);
  const actor = { id: "author", role: "author", banned: 0, accepted_at: "yes", terms_version: 2 };
  const access = { session: true, expired: false, editor: false };
  let puts = 0;
  let beforeCommit: (() => void) | undefined;
  let failCommit = false;
  const env = {
    APP_ORIGIN: "http://localhost:5181", ALLOWED_ORIGINS: "", DB: { prepare(sql: string) {
      let values: any[] = [];
      return { bind(...args: any[]) { values = args; return this; }, async first() {
        if (sql.includes("FROM sessions")) return structuredClone(actor);
        if (sql === "SELECT * FROM courses WHERE id = ?") {
          const snapshot = row ? structuredClone(row) : null;
          if (race) { if (++reads === 2) release(); await barrier; }
          return snapshot;
        }
        if (sql.includes("FROM course_editors")) return access.editor ? { yes: 1 } : null;
        throw Error(`Unexpected read: ${sql}`);
      }, async run() {
        const review = sql.includes("SET reviewed_version");
        assert.ok(sql.includes("AND version = ?"));
        assert.ok(sql.includes("JOIN sessions session ON session.user_id = actor.id"));
        assert.ok(sql.includes("actor.banned = 0"));
        assert.ok(sql.includes("actor.accepted_at IS NOT NULL AND actor.accepted_at != ''"));
        assert.ok(sql.includes("actor.terms_version >= ?"));
        assert.ok(sql.includes("session.token_hash = ? AND session.expires_at > ?"));
        if (review) assert.ok(sql.includes("actor.role IN ('reviewer', 'admin')"));
        else assert.ok(sql.includes("courses.owner_id = actor.id OR actor.role = 'admin' OR EXISTS (SELECT 1 FROM course_editors editor WHERE editor.course_id = courses.id AND editor.user_id = actor.id)"));
        beforeCommit?.(); beforeCommit = undefined;
        if (failCommit) throw Error("Injected D1 failure");
        const permitted = access.session && !access.expired && !actor.banned && actor.accepted_at && actor.terms_version >= 2;
        if (review) {
          const [version, , , , id, prior] = values;
          if (!permitted || !["reviewer", "admin"].includes(actor.role) || !row || row.id !== id || row.version !== prior || row.status !== "published") return { meta: { changes: 0 } };
          row.reviewed_version = version; return { meta: { changes: 1 } };
        }
        if (!permitted || !(row?.owner_id === actor.id || actor.role === "admin" || access.editor)) return { meta: { changes: 0 } };
        const [next, , , , , , , , , id, prior, draft, status, owner] = values;
        if (!row || row.id !== id || row.version !== prior || row.draft !== draft || row.status !== status || row.owner_id !== owner) return { meta: { changes: 0 } };
        row = { ...row, version: next, status: "published" };
        return { meta: { changes: 1 } };
      } };
    } }, FILES: {
      async get(key: string) { const text = objects.get(key); return text === undefined ? null : { text: async () => text, json: async () => JSON.parse(text) }; },
      async put(key: string, text: string, options: any) {
        puts++;
        assert.equal(options.onlyIf.get("If-None-Match"), "*");
        if (objects.has(key)) return null;
        objects.set(key, text); return { key };
      },
    },
  } as unknown as Env;
  return { env, objects, actor, access, get row() { return row; }, get puts() { return puts; }, set beforeCommit(fn: () => void) { beforeCommit = fn; }, set failCommit(value: boolean) { failCommit = value; }, deleteRow() { row = null; } };
}
for (const change of ["remove", "reassign"] as const) {
  const f = fixture(); const changed = structuredClone(doc);
  if (change === "remove") changed.spreadsheetAssignments = [];
  else { changed.lessons.push({ id: "l2", title: "Second", blocks: [{ type: "text", md: "More." }] }); changed.spreadsheetAssignments[0].lessonId = "l2"; }
  f.row.draft = JSON.stringify(changed);
  assert.equal((await worker.fetch(request(), f.env)).status, 409, change);
  assert.equal(f.puts, 0, "continuity rejection happens before writes");
}
for (const corruption of [undefined, "not json", JSON.stringify({ ...doc, spreadsheetAssignments: [{}] })]) {
  const f = fixture();
  if (corruption === undefined) f.objects.delete("courses/course.v1.json"); else f.objects.set("courses/course.v1.json", corruption);
  assert.equal((await worker.fetch(request(), f.env)).status, 409);
  assert.equal(f.puts, 0);
}
for (const mutation of ["draft", "removed", "unpublished", "owner", "deleted"] as const) {
  const f = fixture();
  f.beforeCommit = () => {
    if (mutation === "draft") f.row.draft += " ";
    else if (mutation === "owner") f.row.owner_id = "another";
    else if (mutation === "deleted") f.deleteRow();
    else f.row.status = mutation;
  };
  assert.equal((await worker.fetch(request(), f.env)).status, 409, mutation);
  assert.equal(f.objects.get("courses/course.v1.json"), JSON.stringify(doc));
  assert.equal(f.objects.get("courses/course.v2.json"), JSON.stringify(doc), "losing snapshot retained");
  assert.ok(!f.row || f.row.version === 1);
}
{
  const f = fixture(1, true);
  const results = await Promise.all([worker.fetch(request(), f.env), worker.fetch(request(), f.env)]);
  assert.deepEqual(results.map(x => x.status).sort(), [200, 409]);
  assert.equal(f.row.version, 2);
  assert.equal(f.row.reviewed_version, 1, "new version is not reviewed");
  assert.equal(f.objects.get("courses/course.v2.json"), JSON.stringify(doc));
}
{
  const f = fixture(); f.objects.set("courses/course.v2.json", "retained orphan");
  const result = await worker.fetch(request(), f.env);
  assert.equal(result.status, 200); assert.equal(f.row.version, 3);
  assert.equal(f.objects.get("courses/course.v2.json"), "retained orphan");
  assert.equal(f.objects.get("courses/course.v3.json"), JSON.stringify(doc));
}
{
  const f = fixture(); f.failCommit = true;
  const old = console.error; console.error = () => {};
  try { assert.equal((await worker.fetch(request(), f.env)).status, 500); } finally { console.error = old; }
  assert.equal(f.row.version, 1); f.failCommit = false;
  assert.equal((await worker.fetch(request(), f.env)).status, 200);
  assert.equal(f.row.version, 2, "identical orphan recovered without overwrite");
}
{
  const f = fixture(); for (let version = 2; version < 18; version++) f.objects.set(`courses/course.v${version}.json`, "occupied");
  assert.equal((await worker.fetch(request(), f.env)).status, 409);
  assert.equal(f.puts, 16); assert.equal(f.row.version, 1);
}
for (const revoke of ["editor", "admin", "ban", "terms", "acceptance", "session", "expired"] as const) {
  const f = fixture();
  if (revoke === "editor") { f.row.owner_id = "owner"; f.access.editor = true; }
  if (revoke === "admin") { f.row.owner_id = "owner"; f.actor.role = "admin"; }
  f.beforeCommit = () => {
    if (revoke === "editor") f.access.editor = false;
    else if (revoke === "admin") f.actor.role = "author";
    else if (revoke === "ban") f.actor.banned = 1;
    else if (revoke === "terms") f.actor.terms_version = 1;
    else if (revoke === "acceptance") f.actor.accepted_at = "";
    else if (revoke === "session") f.access.session = false;
    else f.access.expired = true;
  };
  assert.equal((await worker.fetch(request(), f.env)).status, 409, `revoked ${revoke}`);
  assert.equal(f.row.version, 1); assert.equal(f.row.reviewed_version, 1);
}
const reviewRequest = () => new Request("http://localhost/review/course", { method: "POST", headers: { Origin: "http://localhost:5181", Cookie: "erudior_session=test", "Content-Type": "application/json" }, body: JSON.stringify({ action: "reviewed", version: 1 }) });
for (const mutation of ["version", "status", "role", "session", "ban"] as const) {
  const f = fixture(); f.actor.role = "reviewer"; f.row.reviewed_version = 0;
  f.beforeCommit = () => {
    if (mutation === "version") f.row.version = 2;
    else if (mutation === "status") f.row.status = "removed";
    else if (mutation === "role") f.actor.role = "author";
    else if (mutation === "session") f.access.session = false;
    else f.actor.banned = 1;
  };
  assert.equal((await worker.fetch(reviewRequest(), f.env)).status, 409, `review race ${mutation}`);
  assert.equal(f.row.reviewed_version, 0, "unseen or unauthorized version is never approved");
}
{
  const f = fixture(0);
  assert.equal((await worker.fetch(request(), f.env)).status, 200);
  assert.equal(f.row.version, 1);
}
console.log("community publication continuity, concurrency and recovery tests passed");

for(const change of ['remove','same-revision','decrease','valid-increase'] as const){
 const f=fixture();
 const source={...doc,branchingScenarios:[{...emptyBranchingPack('project'),revision:2,lessonId:'l1'}]};
 f.objects.set('courses/course.v1.json',JSON.stringify(source));
 const next=structuredClone(source);
 if(change==='remove')next.branchingScenarios=[];
 else {next.branchingScenarios[0].title+=' revised';next.branchingScenarios[0].revision=change==='decrease'?1:change==='valid-increase'?3:2;}
 f.row.draft=JSON.stringify(next);
 assert.equal((await worker.fetch(request(),f.env)).status,change==='valid-increase'?200:409,`branching ${change}`);
 if(change!=='valid-increase')assert.equal(f.puts,0,'branching lineage rejection occurs before immutable upload');
 else {
  const published=JSON.parse(f.objects.get('courses/course.v2.json')!);
  assert.deepEqual(published.branchingScenarios,next.branchingScenarios,'immutable publication preserves exact scenario metadata');
  const installed=normalizeCourse(toCourse(published,{id:'course',version:2,review:'not_reviewed',author:'Fixture'} as any,()=>{throw Error('Unexpected asset');}));
  assert.deepEqual(installed.branchingScenarios,next.branchingScenarios,'actual published artifact installation preserves exact source');
 }
}
console.log('community branching source revision continuity passed');

for(const malformed of [{...emptyBranchingPack('broken'),nodes:[]},{...emptyBranchingPack('broken'),approval:{actor:'Forged',at:'2026-10-29T00:00:00Z'}}]){
 const f=fixture(0);f.row.draft=JSON.stringify({...doc,branchingScenarios:[malformed]});
 assert.equal((await worker.fetch(request(),f.env)).status,400);
 assert.equal(f.puts,0,'malformed or authority-bearing portable source rejected before public artifact');
}

for(const change of ['remove','same-revision','decrease','valid-increase'] as const){
 const f=fixture();
 const source={...doc,scientificWorkspaces:[{...emptyScientificPack('project'),revision:2,lessonId:'l1'}]};
 f.objects.set('courses/course.v1.json',JSON.stringify(source));
 const next=structuredClone(source);
 if(change==='remove')next.scientificWorkspaces=[];
 else {next.scientificWorkspaces[0].title+=' revised';next.scientificWorkspaces[0].revision=change==='decrease'?1:change==='valid-increase'?3:2;}
 f.row.draft=JSON.stringify(next);
 assert.equal((await worker.fetch(request(),f.env)).status,change==='valid-increase'?200:409,`scientific ${change}`);
 if(change!=='valid-increase')assert.equal(f.puts,0,'scientific lineage rejection occurs before immutable upload');
 else {
  const published=JSON.parse(f.objects.get('courses/course.v2.json')!);
  assert.deepEqual(published.scientificWorkspaces,next.scientificWorkspaces,'immutable publication preserves exact scenario metadata');
  const installed=normalizeCourse(toCourse(published,{id:'course',version:2,review:'not_reviewed',author:'Fixture'} as any,()=>{throw Error('Unexpected asset');}));
  assert.deepEqual(installed.scientificWorkspaces,next.scientificWorkspaces,'actual published artifact installation preserves exact source');
 }
}
console.log('community scientific source revision continuity passed');

for(const malformed of [{...emptyScientificPack('broken'),steps:[]},{...emptyScientificPack('broken'),approval:{actor:'Forged',at:'2026-10-29T00:00:00Z'}}]){
 const f=fixture(0);f.row.draft=JSON.stringify({...doc,scientificWorkspaces:[malformed]});
 assert.equal((await worker.fetch(request(),f.env)).status,400);
 assert.equal(f.puts,0,'malformed or authority-bearing portable source rejected before public artifact');
}

for(const change of ['remove','same-revision','decrease','valid-increase'] as const){
 const f=fixture();
 const source={...doc,advancedAssessments:[{...emptyAdvancedAssessmentPack('project'),revision:2,lessonId:'l1'}]};
 f.objects.set('courses/course.v1.json',JSON.stringify(source));
 const next=structuredClone(source);
 if(change==='remove')next.advancedAssessments=[];
 else {next.advancedAssessments[0].title+=' revised';next.advancedAssessments[0].revision=change==='decrease'?1:change==='valid-increase'?3:2;}
 f.row.draft=JSON.stringify(next);
 assert.equal((await worker.fetch(request(),f.env)).status,change==='valid-increase'?200:409,`advanced assessment ${change}`);
 if(change!=='valid-increase')assert.equal(f.puts,0,'advanced assessment lineage rejection occurs before immutable upload');
 else {
  const published=JSON.parse(f.objects.get('courses/course.v2.json')!);
  assert.deepEqual(published.advancedAssessments,next.advancedAssessments,'immutable publication preserves exact scenario metadata');
  const installed=normalizeCourse(toCourse(published,{id:'course',version:2,review:'not_reviewed',author:'Fixture'} as any,()=>{throw Error('Unexpected asset');}));
  assert.deepEqual(installed.advancedAssessments,next.advancedAssessments,'actual published artifact installation preserves exact source');
 }
}
console.log('community advanced assessment source revision continuity passed');

for(const malformed of [{...emptyAdvancedAssessmentPack('broken'),variants:[]},{...emptyAdvancedAssessmentPack('broken'),approval:{actor:'Forged',at:'2026-10-29T00:00:00Z'}}]){
 const f=fixture(0);f.row.draft=JSON.stringify({...doc,advancedAssessments:[malformed]});
 assert.equal((await worker.fetch(request(),f.env)).status,400);
 assert.equal(f.puts,0,'malformed or authority-bearing portable source rejected before public artifact');
}
for(const bump of [false,true]){
 const f=fixture();const source={...doc,advancedAssessments:[{...emptyAdvancedAssessmentPack('rubric-lineage'),revision:1,lessonId:'l1'}]};f.objects.set('courses/course.v1.json',JSON.stringify(source));const next=structuredClone(source);next.advancedAssessments[0].revision=2;next.advancedAssessments[0].rubric.criteria[0].levels[0].description+=' revised';if(bump)next.advancedAssessments[0].rubric.revision++;f.row.draft=JSON.stringify(next);assert.equal((await worker.fetch(request(),f.env)).status,bump?200:409,'changed rubric needs its own explicit revision, not just source revision');if(!bump)assert.equal(f.puts,0);
}
