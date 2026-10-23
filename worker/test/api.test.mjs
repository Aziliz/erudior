// Smoke test of the community API against `npm run dev` (http://localhost:8787, dev sign-in on).
//   node test/api.test.mjs
const API = process.env.API ?? "http://localhost:8787";
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
  format: "erudior-community",
  version: 1,
  title: `Birds of Colorado ${tag}`,
  description: "Common birds and how to tell them apart.",
  subject: "Science",
  level: "Elementary",
  lessons: [
    {
      id: "l1",
      title: "Backyard birds",
      blocks: [
        { type: "heading", text: "Look and listen" },
        { type: "text", md: "The **black-capped chickadee** says its name. <script>x</script>" },
        { type: "list", ordered: false, items: ["Chickadee", "Junco"] },
        { type: "image", imageId: img.data.id, alt: "A chickadee on a branch", caption: "Chickadee" },
        { type: "question", id: "q1", stem: "Which bird says its name?", choices: ["Chickadee", "Junco"], answer: [0], explanation: "Chick-a-dee-dee-dee." },
      ],
    },
  ],
  decks: [{ id: "d1", title: "Bird names", cards: [{ id: "c1", front: "Small, black cap", back: "Chickadee" }] }],
};
ok("save draft", (await author.call("PUT", `/drafts/${id}`, doc)).status === 200);
const bad = await author.call("PUT", `/drafts/${id}`, { ...doc, subject: "Nope" });
ok("invalid draft refused", bad.status === 400 && /subject/i.test(bad.data.error), bad.data);
const pub = await author.call("POST", `/drafts/${id}/publish`);
ok("publish", pub.status === 200 && pub.data.version === 1, pub.data);

const anon = client();
let cat = (await anon.call("GET", "/catalog")).data;
let entry = cat.courses.find((c) => c.id === id);
ok("in catalog, not reviewed", entry && entry.review === "not_reviewed" && entry.counts.questions === 1 && entry.author === `Author ${tag}`, entry);
const full = await anon.call("GET", `/courses/${id}`);
ok("public course", full.status === 200 && full.data.doc.lessons[0].blocks.length === 5);
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
const queue = (await rev.call("GET", "/review")).data;
ok("in review queue with report", queue.waiting.some((c) => c.id === id) && queue.reports.some((x) => x.course_id === id), queue);
ok("mark reviewed", (await rev.call("POST", `/review/${id}`, { action: "reviewed", note: "Checked facts." })).status === 200);
entry = (await anon.call("GET", "/catalog")).data.courses.find((c) => c.id === id);
ok("tag reviewed", entry.review === "reviewed");

// A new version is not reviewed again.
await author.call("PUT", `/drafts/${id}`, { ...doc, description: "Updated." });
await author.call("POST", `/drafts/${id}/publish`);
entry = (await anon.call("GET", "/catalog")).data.courses.find((c) => c.id === id);
ok("new version not reviewed", entry.version === 2 && entry.review === "not_reviewed", entry);

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

ok("logout", (await author.call("POST", "/auth/logout")).status === 200 && (await author.call("GET", "/me")).data.user === null);

if (fails) {
  console.log(`${fails} API test(s) failed`);
  process.exit(1);
}
console.log("community API tests passed");
