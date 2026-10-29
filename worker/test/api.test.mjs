import { readFileSync } from "node:fs";
const readerTexts = JSON.parse(readFileSync(new URL("../../tests/fixtures/community-reader.json", import.meta.url), "utf8"));
const assessedWork = JSON.parse(readFileSync(new URL("../../tests/fixtures/community-assessed-work.json", import.meta.url), "utf8"));
// Smoke test of the community API against `npm run dev` (http://localhost:8787, dev sign-in on).
//   node test/api.test.mjs
const API = process.env.API ?? "http://localhost:8787";
const target = new URL(API);
if (target.protocol !== "http:" || !["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) || target.username || target.password || target.pathname !== "/" || target.search || target.hash)
  throw new Error("API tests only permit an explicit local loopback HTTP worker.");
const ORIGIN = "http://localhost:5181";
let fails = 0;
const ok = (name, cond, extra) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};

function client() {
  let cookie = "";
  const call = async (method, path, body, raw) => {
    const res = await fetch(API + path, {
      method,
      redirect: "manual",
      headers: { Origin: ORIGIN, Cookie: cookie, ...(body && !raw ? { "Content-Type": "application/json" } : {}) },
      body: raw ?? (body ? JSON.stringify(body) : undefined),
    });
    for (const c of res.headers.getSetCookie?.() ?? []) if (c.startsWith("erudior_session=")) cookie = c.split(";")[0];
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, data, headers: res.headers };
  };
  return { call, login: (name, role) => call("GET", `/auth/dev?name=${encodeURIComponent(name)}${role ? `&role=${role}` : ""}`) };
}

const tag = Math.random().toString(36).slice(2, 7);
const author = client();
const r0 = await author.login(`Author ${tag}`);
ok("dev login redirects", r0.status === 302);
let me = (await author.call("GET", "/me")).data;
ok("signed in, not accepted", me.user && !me.user.accepted && me.user.role === "author", me);
ok("drafts need acceptance", (await author.call("POST", "/drafts")).status === 403);
ok("accept needs both", (await author.call("POST", "/me/accept", { adult: true })).status === 400);
ok("accept", (await author.call("POST", "/me/accept", { adult: true, terms: true })).status === 200);
ok("bad origin refused", (await fetch(API + "/drafts", { method: "POST", headers: { Origin: "https://evil.example" } })).status === 403);

const created = await author.call("POST", "/drafts");
ok("draft created", created.status === 201 && created.data.id, created.data);
const id = created.data.id;

// A 1x1 PNG.
const png = Uint8Array.from(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64"));
const img = await author.call("POST", "/images", null, png);
ok("image uploaded", img.status === 201 && img.data.id, img.data);
ok("not an image refused", (await author.call("POST", "/images", null, new TextEncoder().encode("<svg onload=alert(1)>"))).status === 415);

const doc = {
  ...assessedWork,
  texts: readerTexts,
  modules: [{ id: "m1", title: "Reading", quiz: [{ id: "mq1", stem: "What does the poem describe?", choices: ["A bird", "A fish"], answer: [0], explanation: "It describes a bird." }] }],
  format: "erudior-community",
  version: 1,
  title: `Backyard birds ${tag}`,
  description: "Common birds and how to tell them apart.",
  subject: "Science",
  level: "Elementary",
  lessons: [
    {
      id: "l1",
      title: "Backyard birds",
      blocks: [
        { type: "assignment", kind: "writing", id: "bird-report" },
        { type: "assignment", kind: "lab", id: "bird-observation" },
        { type: "assignment", kind: "log" },
        { type: "heading", text: "Look and listen" },
        { type: "text", md: "The **black-capped chickadee** says its name. <script>x</script>" },
        { type: "list", ordered: false, items: ["Chickadee", "Junco"] },
        { type: "image", imageId: img.data.id, alt: "A chickadee on a branch", caption: "Chickadee" },
        { type: "question", id: "q1", stem: "Which bird says its name?", choices: ["Chickadee", "Junco"], answer: [0], explanation: "Chick-a-dee-dee-dee." },
      ],
    },
  ],
  spreadsheetAssignments: [{ id: "bird-counts", lessonId: "l1", title: "Count observations",
    starter: { sheets: { Observations: { A1: 2, A2: 3 }, Summary: { B1: "=SUM(Observations!A1:A2)" } } },
    protectedCells: ["Observations!A1", "Observations!A2"], answers: { "Summary!B1": 5 }, tolerance: 0.01 }],
  decks: [{ id: "d1", title: "Bird names", cards: [{ id: "c1", front: "Small, black cap", back: "Chickadee" }] }],
};
ok("save draft", (await author.call("PUT", `/drafts/${id}`, doc)).status === 200);
const bad = await author.call("PUT", `/drafts/${id}`, { ...doc, subject: "Nope" });
ok("invalid draft refused", bad.status === 400 && /subject/i.test(bad.data.error), bad.data);
const reopened = await author.call("GET", `/drafts/${id}`);
ok("spreadsheet draft roundtrip", JSON.stringify(reopened.data.doc.spreadsheetAssignments) === JSON.stringify(doc.spreadsheetAssignments), reopened.data);
for (const [name, assignment] of [
  ["missing workbook", { ...doc.spreadsheetAssignments[0], starter: undefined }],
  ["unknown lesson", { ...doc.spreadsheetAssignments[0], lessonId: "missing" }],
  ["bad cell", { ...doc.spreadsheetAssignments[0], answers: { "Missing!A1": 5 } }],
]) {
  const invalid = await author.call("PUT", `/drafts/${id}`, { ...doc, spreadsheetAssignments: [assignment] });
  ok(`direct API refuses ${name}`, invalid.status === 400, invalid.data);
}
ok("direct API refuses duplicate assignments", (await author.call("PUT", `/drafts/${id}`, { ...doc, spreadsheetAssignments: [...doc.spreadsheetAssignments, ...doc.spreadsheetAssignments] })).status === 400);
for (const key of ["writing", "rubrics", "labs", "activityLog"]) ok(`assessed-work draft ${key} parity`, JSON.stringify(reopened.data.doc[key]) === JSON.stringify(doc[key]));
for (const [name, change] of [
  ["missing rubric", { writing: [{ ...doc.writing[0], rubric: "missing" }] }],
  ["bad rubric score", { rubrics: [{ ...doc.rubrics[0], criteria: [{ ...doc.rubrics[0].criteria[0], levels: [{ points: -1, label: "Bad" }, { points: 0, label: "None" }] }] }] }],
  ["unknown lab module", { labs: [{ ...doc.labs[0], module: "missing" }] }],
  ["dangling typed reference", { lessons: [{ ...doc.lessons[0], blocks: [{ type: "assignment", kind: "writing", id: "missing" }] }] }],
]) ok(`API refuses assessed work ${name}`, (await author.call("PUT", `/drafts/${id}`, { ...doc, ...change })).status === 400);
ok("incomplete assessed-work draft is editable", (await author.call("PUT", `/drafts/${id}`, { ...doc, writing: [{ ...doc.writing[0], prompt: "" }] })).status === 200);
ok("incomplete assessed work cannot publish", (await author.call("POST", `/drafts/${id}/publish`)).status === 400);
await author.call("PUT", `/drafts/${id}`, doc);
ok("reader draft full-field parity", JSON.stringify((await author.call("GET", `/drafts/${id}`)).data.doc.texts) === JSON.stringify(readerTexts));
ok("reader rejects raw instead of installed question ID", (await author.call("PUT", `/drafts/${id}`, { ...doc, texts: [{ ...readerTexts[0], sections: [{ ...readerTexts[0].sections[0], questions: ["q1"] }] }] })).status === 400);
ok("reader rejects unknown question", (await author.call("PUT", `/drafts/${id}`, { ...doc, texts: [{ ...readerTexts[0], sections: [{ ...readerTexts[0].sections[0], questions: ["missing"] }] }] })).status === 400);
ok("incomplete reader draft remains editable", (await author.call("PUT", `/drafts/${id}`, { ...doc, texts: [{ ...readerTexts[0], sections: [{ ...readerTexts[0].sections[0], body: "" }, readerTexts[0].sections[1]] }] })).status === 200);
ok("incomplete reader publication refused", (await author.call("POST", `/drafts/${id}/publish`)).status === 400);
await author.call("PUT", `/drafts/${id}`, doc);
const pub = await author.call("POST", `/drafts/${id}/publish`);
ok("publish", pub.status === 200 && pub.data.version === 1, pub.data);

const anon = client();
let cat = (await anon.call("GET", "/catalog")).data;
let entry = cat.courses.find((c) => c.id === id);
ok("in catalog, not reviewed", entry && entry.review === "not_reviewed" && entry.counts.questions === 2 && entry.author === `Author ${tag}`, entry);
const full = await anon.call("GET", `/courses/${id}`);
ok("public course", full.status === 200 && full.data.doc.lessons[0].blocks.length === 8);
ok("public spreadsheet parity", JSON.stringify(full.data.doc.spreadsheetAssignments) === JSON.stringify(doc.spreadsheetAssignments));
for (const key of ["writing", "rubrics", "labs", "activityLog"]) ok(`public assessed-work ${key} parity`, JSON.stringify(full.data.doc[key]) === JSON.stringify(doc[key]));
for (const [name, change] of [
  ["writing removal", { writing: [], lessons: [{ ...doc.lessons[0], blocks: doc.lessons[0].blocks.filter(b => !(b.type === "assignment" && b.kind === "writing")) }] }],
  ["rubric reassignment", { writing: [{ ...doc.writing[0], rubric: undefined }] }],
  ["lab question removal", { labs: [{ ...doc.labs[0], questions: [doc.labs[0].questions[0]] }] }],
  ["lesson reference removal", { lessons: [{ ...doc.lessons[0], blocks: doc.lessons[0].blocks.filter(b => b.type !== "assignment") }] }],
]) {
  ok(`save reversible ${name} draft`, (await author.call("PUT", `/drafts/${id}`, { ...doc, ...change })).status === 200);
  ok(`publish guards ${name}`, (await author.call("POST", `/drafts/${id}/publish`)).status === 409);
}
await author.call("PUT", `/drafts/${id}`, doc);
ok("public reader full-field parity", JSON.stringify(full.data.doc.texts) === JSON.stringify(readerTexts));
for (const [name, texts] of [
  ["text removal", []],
  ["section removal", [{ ...readerTexts[0], sections: [readerTexts[0].sections[0]] }]],
  ["question unlink", [{ ...readerTexts[0], sections: [{ ...readerTexts[0].sections[0], questions: [] }, readerTexts[0].sections[1]] }]],
]) {
  ok(`save reversible reader ${name}`, (await author.call("PUT", `/drafts/${id}`, { ...doc, texts })).status === 200);
  ok(`reader publication guards ${name}`, (await author.call("POST", `/drafts/${id}/publish`)).status === 409);
}
await author.call("PUT", `/drafts/${id}`, doc);
// Saving a draft remains reversible; publishing cannot orphan existing progress.
await author.call("PUT", `/drafts/${id}`, { ...doc, spreadsheetAssignments: [] });
ok("cannot remove published assignment", (await author.call("POST", `/drafts/${id}/publish`)).status === 409);
await author.call("PUT", `/drafts/${id}`, { ...doc, lessons: [...doc.lessons, { id: "l2", title: "More birds", blocks: [{ type: "text", md: "Practice." }] }], spreadsheetAssignments: [{ ...doc.spreadsheetAssignments[0], lessonId: "l2" }] });
ok("cannot reassign published assignment", (await author.call("POST", `/drafts/${id}/publish`)).status === 409);
ok("rejected publication preserves public snapshot", JSON.stringify((await anon.call("GET", `/courses/${id}`)).data.doc) === JSON.stringify(full.data.doc));
await author.call("PUT", `/drafts/${id}`, doc);
ok("CORS for app", full.headers.get("access-control-allow-origin") === ORIGIN);
const pic = await fetch(`${API}/images/${img.data.id}`);
ok("image served safely", pic.status === 200 && pic.headers.get("content-type") === "image/png" && pic.headers.get("x-content-type-options") === "nosniff");

ok("report needs reason", (await anon.call("POST", `/courses/${id}/report`, { reason: "x" })).status === 400);
ok("report", (await anon.call("POST", `/courses/${id}/report`, { reason: "Wrong or misleading", details: "Juncos don't sing that." })).status === 201);

// Another author can't touch it.
const other = client();
await other.login(`Other ${tag}`);
await other.call("POST", "/me/accept", { adult: true, terms: true });
ok("not yours", (await other.call("GET", `/drafts/${id}`)).status === 404);
ok("authors can't review", (await other.call("GET", "/review")).status === 403);

// Reviewer.
const rev = client();
await rev.login(`Reviewer ${tag}`, "reviewer");
await rev.call("POST", "/me/accept", { adult: true, terms: true });
// Full canonical mode: the same payload survives draft, publication and exact-version review.
const canonicalPayload = JSON.parse(readFileSync(new URL("../../tests/fixtures/community-canonical.json", import.meta.url), "utf8"));
const canonicalDoc = { format: "erudior-community", version: 1, title: canonicalPayload.course.title,
  description: "All supported authored families", subject: "Science", level: "Middle School", type: "Course", lessons: [], decks: [], canonical: canonicalPayload };
canonicalPayload.course.banks[0].questions[0].image = { src: img.data.url, alt: "Owned evidence" };
canonicalPayload.course.lessons[0].body += `\n![Owned evidence](${img.data.url})`;
const canonicalCreated = await author.call("POST", "/drafts");
const canonicalId = canonicalCreated.data.id;
const canonicalSave = await author.call("PUT", `/drafts/${canonicalId}`, canonicalDoc);
ok("canonical full-family draft saved with configured HTTPS images", canonicalSave.status === 200, canonicalSave.data);
ok("canonical reopened exact payload", JSON.stringify((await author.call("GET", `/drafts/${canonicalId}`)).data.doc) === JSON.stringify(canonicalDoc));
for (const [name, mutate] of [
  ["authority", d => d.canonical.course.community = { review: "reviewed" }],
  ["runtime bank authority", d => d.canonical.course.banks[0].courseId = "forged"],
  ["unknown field", d => d.canonical.course.banks[0].questions[0].unexpected = true],
  ["conflicting mirror", d => d.lessons = [{ id: "mirror", title: "Mirror", blocks: [] }]],
  ["unsafe advanced source", d => d.canonical.course.lessons[0].body = "```sim\nunsafe\n```"],
  ["external audio", d => d.canonical.course.audio.Bird = "https://external.example/audio.mp3"],
  ["wrong bank question reference", d => d.canonical.course.texts[0].sections[0].questions = ["other-question"]],
]) {
  const invalid = structuredClone(canonicalDoc); mutate(invalid);
  ok(`canonical refuses ${name}`, (await author.call("PUT", `/drafts/${canonicalId}`, invalid)).status === 400);
}
const canonicalPublished = await author.call("POST", `/drafts/${canonicalId}/publish`);
ok("canonical publication", canonicalPublished.status === 200, canonicalPublished.data);
const canonicalPublic = (await anon.call("GET", `/courses/${canonicalId}`)).data;
ok("canonical immutable publication retains every source field", JSON.stringify(canonicalPublic.doc) === JSON.stringify(canonicalDoc), canonicalPublic);
ok("canonical catalog counts every bank", (await anon.call("GET", "/catalog")).data.courses.find(c => c.id === canonicalId)?.counts.questions === canonicalPayload.course.banks.reduce((n, b) => n + b.questions.length, 0));
ok("canonical exact-version review", (await rev.call("POST", `/review/${canonicalId}`, { action: "reviewed", version: 1 })).status === 200);
const foreignImage = await other.call("POST", "/images", null, png);
// Legacy reader Markdown shares canonical image validation and team ownership checks.
const readerImageDraft = (await author.call("POST", "/drafts")).data.id;
const inertReaderGlossary = structuredClone(doc);
inertReaderGlossary.texts[0].glossary[0].definition = "Literal ![image](https://external.example/image.png)";
ok("legacy reader glossary stays inert plain text", (await author.call("PUT", `/drafts/${readerImageDraft}`, inertReaderGlossary)).status === 200);
ok("legacy reader inert glossary publication", (await author.call("POST", `/drafts/${readerImageDraft}/publish`)).status === 200);
ok("legacy reader inert glossary preserved", (await anon.call("GET", `/courses/${readerImageDraft}`)).data.doc.texts[0].glossary[0].definition === inertReaderGlossary.texts[0].glossary[0].definition);

for (const [name, field] of [
  ["about", d => [d.texts[0], "about"]],
  ["section", d => [d.texts[0].sections[0], "body"]],
]) {
  for (const [source, expectedSave, expectedPublish] of [
    ["https://external.example/image.png", 400, undefined],
    [foreignImage.data.url, 200, 400],
    [img.data.url, 200, 200],
  ]) {
    const readerDoc = structuredClone(doc);
    const [owner, key] = field(readerDoc);
    owner[key] += `\n![Escaped \\] reader image](${source})`;
    const save = await author.call("PUT", `/drafts/${readerImageDraft}`, readerDoc);
    ok(`legacy reader ${name} ${source === img.data.url ? "owned" : source === foreignImage.data.url ? "foreign" : "external"} draft boundary`, save.status === expectedSave, save.data);
    if (expectedPublish !== undefined) {
      const publication = await author.call("POST", `/drafts/${readerImageDraft}/publish`);
      ok(`legacy reader ${name} image ownership publication`, publication.status === expectedPublish, publication.data);
      if (expectedPublish === 200) ok(`legacy reader ${name} immutable source retained`, JSON.stringify((await anon.call("GET", `/courses/${readerImageDraft}`)).data.doc.texts) === JSON.stringify(readerDoc.texts));
    }
  }
}

// Upgrade a previously published legacy reader/question/workbook as one capability.
const upgradeId = (await author.call("POST", "/drafts")).data.id;
const upgradeLegacy = { format: "erudior-community", version: 1, title: "Upgrade", description: "Upgrade parity", subject: "Science", level: "Middle School", decks: [],
  lessons: [{ id: "l1", title: "Lesson", blocks: [{ type: "text", md: "Read." }, { type: "question", id: "q1", kind: "choice", stem: "Which?", choices: ["A", "B"], answer: [0], explanation: "A." }] }, { id: "l2", title: "Other", blocks: [{ type: "text", md: "Other." }] }],
  texts: [{ id: "reading", title: "Reading", kind: "prose", sections: [{ id: "s1", title: "Section", body: `Read[^1]\n\n[^1]: ![Owned](${img.data.url})`, questions: ["l1-q1"] }] }],
  spreadsheetAssignments: [{ id: "sheet", title: "Sheet", lessonId: "l1", starter: { sheets: { Sheet1: { A1: 1 } } }, protectedCells: [], answers: { "Sheet1!A1": 1 }, tolerance: 0 }] };
ok("legacy upgrade baseline saved", (await author.call("PUT", `/drafts/${upgradeId}`, upgradeLegacy)).status === 200);
ok("legacy upgrade baseline published", (await author.call("POST", `/drafts/${upgradeId}/publish`)).status === 200);
const upgradeCanonical = { format: "erudior-community", version: 1, type: "Course", title: "Upgrade", description: "Upgrade parity", subject: "Science", level: "Middle School", lessons: [], decks: [],
  canonical: { format: "erudior-canonical-authoring", version: 1, course: {
    format: "examiner-course", version: 1, id: `community-${upgradeId}`, title: "Upgrade", revision: 1,
    modules: [{ id: "m1", title: "Upgrade" }], lessons: [{ id: "l1", module: "m1", title: "Lesson", body: "Read.", quiz: ["l1-q1"] }, { id: "l2", module: "m1", title: "Other", body: "Other." }],
    banks: [{ format: "examiner-bank", version: 1, id: "main", title: "Upgrade: questions", sections: [], exam: { questionCount: 1, timeLimitMinutes: 10, passingPercent: 70 }, questions: [{ id: "l1-q1", type: "choice", topic: "Lesson", stem: "Which?", choices: ["A", "B"], answer: [0] }] }],
    decks: [], references: [], drills: [], glossary: [], texts: structuredClone(upgradeLegacy.texts), spreadsheetAssignments: structuredClone(upgradeLegacy.spreadsheetAssignments)
  } } };
for (const [name, mutate] of [
  ["removed workbook", c => c.spreadsheetAssignments = []],
  ["reassigned workbook", c => c.spreadsheetAssignments[0].lessonId = "l2"],
  ["removed question", c => { c.banks[0].questions = []; c.lessons[0].quiz = []; c.texts[0].sections[0].questions = []; }],
]) {
  const invalidUpgrade = structuredClone(upgradeCanonical); mutate(invalidUpgrade.canonical.course);
  const saved = await author.call("PUT", `/drafts/${upgradeId}`, invalidUpgrade);
  ok(`legacy upgrade ${name} editable draft`, saved.status === 200, saved.data);
  const refused = await author.call("POST", `/drafts/${upgradeId}/publish`);
  ok(`legacy upgrade ${name} continuity refused`, refused.status === 409, refused.data);
}
ok("complete canonical upgrade saved", (await author.call("PUT", `/drafts/${upgradeId}`, upgradeCanonical)).status === 200);
const upgraded = await author.call("POST", `/drafts/${upgradeId}/publish`);
ok("complete canonical reader question workbook upgrade published", upgraded.status === 200 && upgraded.data.version === 2, upgraded.data);
const upgradePublic = (await anon.call("GET", `/courses/${upgradeId}`)).data;
ok("canonical upgrade exact source and owned reader URL preserved", JSON.stringify(upgradePublic.doc) === JSON.stringify(upgradeCanonical));
ok("canonical downgrade draft saved", (await author.call("PUT", `/drafts/${upgradeId}`, upgradeLegacy)).status === 200);
ok("canonical downgrade publication refused", (await author.call("POST", `/drafts/${upgradeId}/publish`)).status === 409);

for (const [name, mutate] of [
  ["question", c => c.banks[0].questions[0].image.src = foreignImage.data.url],
  ["lab step", c => c.labs[0].steps[0].text += `\n![Lab evidence](${foreignImage.data.url})`],
  ["escaped alt", c => c.lessons[0].body += `\n![Escaped \\] description](${foreignImage.data.url})`],
]) {
  const foreignDoc = structuredClone(canonicalDoc); mutate(foreignDoc.canonical.course);
  ok(`canonical foreign ${name} image structurally valid draft`, (await author.call("PUT", `/drafts/${canonicalId}`, foreignDoc)).status === 200);
  ok(`canonical foreign ${name} image publication refused`, (await author.call("POST", `/drafts/${canonicalId}/publish`)).status === 400);
}
for (const [name, mutate] of [
  ["bank", c => c.banks.pop()],
  ["reader section", c => c.texts[0].sections.pop()],
  ["reader question link", c => c.texts[0].sections[0].questions = []],
  ["lab question", c => c.labs[0].questions.pop()],
  ["notecard", c => c.decks[0].cards.pop()],
]) {
  const removed = structuredClone(canonicalDoc); mutate(removed.canonical.course);
  ok(`canonical reversible ${name} deletion draft`, (await author.call("PUT", `/drafts/${canonicalId}`, removed)).status === 200);
  ok(`canonical published ${name} identity protected`, (await author.call("POST", `/drafts/${canonicalId}/publish`)).status === 409);
}
const unchangedCanonical = (await anon.call("GET", `/courses/${canonicalId}`)).data;
ok("canonical rejected publications preserve reviewed immutable version", unchangedCanonical.version === 1 && unchangedCanonical.review === "reviewed" && JSON.stringify(unchangedCanonical.doc) === JSON.stringify(canonicalDoc));
canonicalDoc.description = "Updated canonical listing";
ok("canonical next draft", (await author.call("PUT", `/drafts/${canonicalId}`, canonicalDoc)).status === 200);
ok("canonical next publication", (await author.call("POST", `/drafts/${canonicalId}/publish`)).status === 200);
ok("canonical stale review refused", (await rev.call("POST", `/review/${canonicalId}`, { action: "reviewed", version: 1 })).status === 409);
ok("canonical new version unreviewed", (await anon.call("GET", `/courses/${canonicalId}`)).data.review === "not_reviewed");

const queue = (await rev.call("GET", "/review")).data;
ok("in review queue with report", queue.waiting.some((c) => c.id === id) && queue.reports.some((x) => x.course_id === id), queue);
ok("mark reviewed", (await rev.call("POST", `/review/${id}`, { action: "reviewed", version: 1, note: "Checked facts." })).status === 200);
entry = (await anon.call("GET", "/catalog")).data.courses.find((c) => c.id === id);
ok("tag reviewed", entry.review === "reviewed");

ok("review requires explicit version", (await rev.call("POST", `/review/${id}`, { action: "reviewed" })).status === 400);
// A new version is not reviewed again.
await author.call("PUT", `/drafts/${id}`, { ...doc, description: "Updated." });
await author.call("POST", `/drafts/${id}/publish`);
entry = (await anon.call("GET", "/catalog")).data.courses.find((c) => c.id === id);
ok("new version not reviewed", entry.version === 2 && entry.review === "not_reviewed", entry);

ok("stale review refused", (await rev.call("POST", `/review/${id}`, { action: "reviewed", version: 1 })).status === 409);
ok("stale review leaves current version unreviewed", (await anon.call("GET", `/courses/${id}`)).data.review === "not_reviewed");
// Real local D1/R2 concurrency: successful requests have distinct versions;
// contending snapshots never overwrite an already published version.
const raced = await Promise.all(Array.from({ length: 8 }, () => author.call("POST", `/drafts/${id}/publish`)));
const winners = raced.filter(result => result.status === 200);
ok("concurrent publication has a winner", winners.length > 0, raced);
ok("concurrent publication only returns success or conflict", raced.every(result => [200, 409].includes(result.status)), raced);
ok("concurrent winners have unique versions", new Set(winners.map(result => result.data.version)).size === winners.length, raced);
const afterRace = (await anon.call("GET", `/courses/${id}`)).data;
ok("latest version points at complete spreadsheet snapshot", JSON.stringify(afterRace.doc.spreadsheetAssignments) === JSON.stringify(doc.spreadsheetAssignments));
ok("latest version equals highest committed publication", afterRace.version === Math.max(...winners.map(result => result.data.version)), afterRace);

// Take down and restore.
ok("remove needs note", (await rev.call("POST", `/review/${id}`, { action: "remove" })).status === 400);
ok("remove", (await rev.call("POST", `/review/${id}`, { action: "remove", note: "Copied text." })).status === 200);
ok("gone from catalog", !(await anon.call("GET", "/catalog")).data.courses.some((c) => c.id === id));
ok("410 when removed", (await anon.call("GET", `/courses/${id}`)).status === 410);
ok("author can't republish", (await author.call("POST", `/drafts/${id}/publish`)).status === 403);
const mine = (await author.call("GET", "/mine")).data.courses.find((c) => c.id === id);
ok("author sees why", mine.status === "removed" && mine.reviewNote === "Copied text.", mine);
ok("restore", (await rev.call("POST", `/review/${id}`, { action: "restore" })).status === 200);
ok("back in catalog", (await anon.call("GET", "/catalog")).data.courses.some((c) => c.id === id));

// Editors: the owner adds another author by email; editors can change and publish, not delete.
ok("editor can't before being added", (await other.call("PUT", `/drafts/${id}`, doc)).status === 404);
ok("unknown email refused", (await author.call("POST", `/drafts/${id}/editors`, { email: "nobody@example.test" })).status === 404);
const add = await author.call("POST", `/drafts/${id}/editors`, { email: `other.${tag.toLowerCase()}@example.test` });
ok("add editor", add.status === 201, add.data);
ok("editor saves", (await other.call("PUT", `/drafts/${id}`, { ...doc, description: "Edited by an editor." })).status === 200);
ok("editor publishes", (await other.call("POST", `/drafts/${id}/publish`)).status === 200);
ok("editor can't delete", (await other.call("DELETE", `/drafts/${id}`)).status === 404);
ok("editor can't add editors", (await other.call("POST", `/drafts/${id}/editors`, { email: "x@example.test" })).status === 404);
const ed = (await other.call("GET", "/mine")).data.courses.find((c) => c.id === id);
ok("shows in editor's courses", ed && ed.role === "editor", ed);
const list = (await author.call("GET", `/drafts/${id}/editors`)).data;
ok("editor list", list.editors.length === 1 && list.owner.name === `Author ${tag}`, list);

// Takeover: only after the owner has been away for a year; the old owner stays as an editor.
const taker = client();
await taker.login(`Taker ${tag}`);
await taker.call("POST", "/me/accept", { adult: true, terms: true });
ok("can't take over an active author's course", (await taker.call("POST", `/drafts/${id}/claim`)).status === 403);
await author.login(`Author ${tag}`);
await author.call("GET", `/auth/dev?name=${encodeURIComponent(`Author ${tag}`)}&away=400`);
entry = (await anon.call("GET", "/catalog")).data.courses.find((c) => c.id === id);
ok("catalog marks it claimable", entry.claimable === true, entry);
ok("take over", (await taker.call("POST", `/drafts/${id}/claim`)).status === 200);
ok("new owner edits", (await taker.call("GET", `/drafts/${id}`)).data.role === "owner");
ok("old owner is an editor", (await author.call("GET", `/drafts/${id}`)).data.role === "editor");
ok("no longer claimable", !(await anon.call("GET", "/catalog")).data.courses.find((c) => c.id === id).claimable);

// Admin: role changes and bans.
const admin = client();
await admin.login("Admin", null);
const adminMe = (await admin.call("GET", "/me")).data;
await admin.call("POST", "/me/accept", { adult: true, terms: true });
ok("admin from ADMIN_EMAILS", adminMe.user.role === "admin", adminMe);
const users = (await admin.call("GET", `/admin/users?q=Other ${tag}`)).data.users;
ok("find user", users.length === 1);
ok("ban", (await admin.call("POST", `/admin/users/${users[0].id}`, { banned: true })).status === 200);
ok("banned user signed out", (await other.call("GET", "/me")).data.user === null);

// Real isolated D1/R2 branching lifecycle independent of other fixture versions.
const scenarioId=(await author.call("POST","/drafts")).data.id;
const scenarioPack={format:"erudior-branching-pack",version:1,id:"project",revision:1,title:"Synthetic project",description:"Test-only fictional project",sourceNote:"Synthetic fixture",timeUnit:"ticks",maxTick:20,startNodeId:"start",variables:[],nodes:[{id:"start",title:"Outcome",text:"Synthetic outcome",terminal:"neutral",choices:[]}],milestones:[]};
const scenarioDoc={format:"erudior-community",version:1,title:"Scenario fixture",description:"Synthetic fixture",subject:"Science",level:"Elementary School",type:"Course",lessons:[{id:"l1",title:"Fixture",blocks:[{type:"text",md:"Test-only source"}]}],decks:[],branchingScenarios:[{...scenarioPack,lessonId:"l1"}]};
ok("branching draft save",(await author.call("PUT",`/drafts/${scenarioId}`,scenarioDoc)).status===200);
ok("branching reopen exact",JSON.stringify((await author.call("GET",`/drafts/${scenarioId}`)).data.doc.branchingScenarios)===JSON.stringify(scenarioDoc.branchingScenarios));
ok("branching first publication",(await author.call("POST",`/drafts/${scenarioId}/publish`)).status===200);
ok("branching public exact source",JSON.stringify((await anon.call("GET",`/courses/${scenarioId}`)).data.doc.branchingScenarios)===JSON.stringify(scenarioDoc.branchingScenarios));
const changedScenario=structuredClone(scenarioDoc);changedScenario.branchingScenarios[0].nodes[0].text="Changed synthetic outcome";
await author.call("PUT",`/drafts/${scenarioId}`,changedScenario);
ok("branching same revision rejects publication",(await author.call("POST",`/drafts/${scenarioId}/publish`)).status===409);
ok("branching rejected publication retains source",JSON.stringify((await anon.call("GET",`/courses/${scenarioId}`)).data.doc.branchingScenarios)===JSON.stringify(scenarioDoc.branchingScenarios));
changedScenario.branchingScenarios[0].revision=2;await author.call("PUT",`/drafts/${scenarioId}`,changedScenario);
ok("branching explicit revision publication",(await author.call("POST",`/drafts/${scenarioId}/publish`)).status===200);
ok("branching updated public exact",JSON.stringify((await anon.call("GET",`/courses/${scenarioId}`)).data.doc.branchingScenarios)===JSON.stringify(changedScenario.branchingScenarios));
const invalidScenario=structuredClone(changedScenario);invalidScenario.branchingScenarios[0].nodes=[];
ok("branching malformed draft rejected",(await author.call("PUT",`/drafts/${scenarioId}`,invalidScenario)).status===400);

ok("logout", (await author.call("POST", "/auth/logout")).status === 200 && (await author.call("GET", "/me")).data.user === null);

if (fails) {
  console.log(`${fails} API test(s) failed`);
  process.exit(1);
}
console.log("community API tests passed");
