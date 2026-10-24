// Screenshots of the desktop app for the home page (public/shots/*.png), with a made-up
// family and class. Needs the API for live rooms, the app as the desktop app shows it, and
// the web app for students joining a live room:
//   cd worker && npx wrangler dev --env dev --port 8787 --var APP_ORIGIN:https://app.erudior.com \
//     --var ALLOWED_ORIGINS:http://localhost:5181,http://localhost:5182
//   VITE_HOMESCHOOL=1 VITE_AS_DESKTOP=1 VITE_COMMUNITY_API=http://localhost:8787 npx vite --port 5181
//   VITE_COMMUNITY_API=http://localhost:8787 npx vite --port 5182
//   node scripts/site-shots.mjs [out dir]   (default public/shots)
// PLAYWRIGHT_MODULE overrides where Playwright is found.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import fs from "node:fs";

const OUT = process.argv[2] || "public/shots";
const B = "http://localhost:5181/";
const WEB = "http://localhost:5182/";
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const ctx = async (w = 1280, h = 800) => {
  const c = await b.newContext({ viewport: { width: w, height: h }, colorScheme: "light", deviceScaleFactor: 1 });
  return c.newPage();
};
const btn = (pg, name) => pg.getByRole("button", { name }).first();
const shot = async (pg, name) => {
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: `${OUT}/${name}.png` });
  console.log("wrote", `${OUT}/${name}.png`);
};

/** Fill in weeks of made-up study for each named student (lessons, quiz scores, time, days). */
async function seed(pg, plan) {
  await pg.evaluate(async (plan) => {
    const db = await new Promise((res, rej) => {
      const r = indexedDB.open("examiner", 1);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const get = (k) =>
      new Promise((res) => {
        const q = db.transaction("kv", "readonly").objectStore("kv").get(k);
        q.onsuccess = () => res(q.result ?? null);
      });
    const put = (k, v) =>
      new Promise((res) => {
        const t = db.transaction("kv", "readwrite");
        t.objectStore("kv").put(v, k);
        t.oncomplete = () => res();
      });
    const fam = JSON.parse(await get("examiner.family"));
    let s = 11;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const days = [];
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const start = `${d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1}-08-03`;
    while (d.toISOString().slice(0, 10) >= start) {
      if (d.getDay() % 6) days.unshift(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() - 1);
    }
    for (const st of fam.students) {
      const want = plan[st.name];
      if (!want) continue;
      const p = { version: 1, seeded: true, attempts: [], stats: {}, cards: {}, lessonsDone: {}, plans: {}, activity: {}, drills: {}, ...(JSON.parse((await get(`examiner.progress-${st.id}`)) ?? "null") ?? {}) };
      p.enrolled = [...new Set([...(p.enrolled ?? []), ...Object.keys(want)])];
      const rec = JSON.parse((await get(`examiner.records-${st.id}`)) ?? "null") ?? {
        format: "examiner-records", version: 1, time: {}, manual: [], days: {}, courses: {}, grades: [], outside: [], tests: [], narratives: {}, documents: [], reading: [], activities: [],
      };
      for (const [cid, n] of Object.entries(want)) {
        const c = JSON.parse(await get(`examiner.course.${cid}`));
        const lessons = c.lessons.filter((l) => !l.honors).slice(0, n);
        lessons.forEach((l, i) => {
          const day = days[Math.min(days.length - 1, Math.floor((i * days.length) / Math.max(n, 1)))];
          p.lessonsDone[`${cid}/${l.id}`] = day;
          const total = 8;
          const correct = 6 + Math.floor(rnd() * 3);
          p.attempts.push({
            id: `seed-${st.id}-${l.id}`, bankId: `${cid}__lessons`, bankTitle: c.title, mode: "practice",
            startedAt: `${day}T15:00:00.000Z`, finishedAt: `${day}T15:12:00.000Z`, durationSec: 700, total, answered: total, correct,
            passingPercent: 70, lesson: { courseId: cid, lessonId: l.id }, byTopic: {}, bySection: {}, answers: [],
          });
          p.activity[day] ??= { questions: 0, cards: 0, lessons: 0, drills: 0 };
          p.activity[day].lessons++;
          p.activity[day].questions += total;
        });
      }
      for (const day of days) {
        rec.time[day] ??= {};
        for (const cid of Object.keys(want)) rec.time[day][cid] = (rec.time[day][cid] ?? 0) + 6000 + Math.floor(rnd() * 2400);
        rec.days[day] = "present";
      }
      await put(`examiner.progress-${st.id}`, JSON.stringify(p));
      await put(`examiner.records-${st.id}`, JSON.stringify(rec));
    }
  }, plan);
}

async function startCourse(pg, search, title) {
  await pg.fill('[aria-label="Search courses"]', search);
  await pg.waitForTimeout(300);
  await pg.getByRole("button", { name: new RegExp(`${title}\\b.*view overview`) }).first().click();
  await pg.waitForTimeout(300);
  await btn(pg, "Start course").click();
  await pg.waitForTimeout(1500);
  await btn(pg, /^Library$/).click().catch(() => {});
  await pg.waitForTimeout(500);
}

// ---------- A homeschool family ----------
const h = await ctx();
await h.goto(B);
await h.waitForTimeout(1500);
await btn(h, "Homeschool or classroom").click();
await h.waitForTimeout(300);
await h.getByRole("combobox", { name: /^State/ }).selectOption("CO");
await h.getByLabel("Name").first().fill("Maya");
await h.getByLabel(/^Grade/).first().selectOption("7");
await btn(h, "Add another student").click();
await h.getByLabel("Name").nth(1).fill("Leo");
await h.getByLabel(/^Grade/).nth(1).selectOption("9");
await h.getByLabel("Password (8 characters or more)").fill("parent pass");
await h.getByLabel("Type it again").fill("parent pass");
await btn(h, "Set up homeschool").click();
await h.waitForTimeout(2500);
await btn(h, "I've written it down").click();
await h.waitForTimeout(1200);
// Install the courses (they're shared between students), then make up a few weeks of work.
await h.locator(".who-card", { hasText: "Leo" }).click({ timeout: 3000 }).catch(() => {});
await h.waitForTimeout(800);
for (const [q, t] of [["Algebra 1", "Algebra 1"], ["Biology", "Biology"], ["German A1", "German A1"], ["Pre-algebra", "Pre-algebra and Arithmetic"]])
  await startCourse(h, q, t);
await h.fill('[aria-label="Search courses"]', "");
await seed(h, {
  Leo: { "math-algebra1": 12, "science-biology": 9, "lang-german-a1": 6 },
  Maya: { "math-prealgebra": 15, "lang-german-a1": 8 },
});
await h.goto(B);
await h.waitForTimeout(2000);
await h.locator(".who-card", { hasText: "Leo" }).click();
await h.waitForTimeout(1200);
await shot(h, "kid-library");

// A lesson with the graphing calculator.
await h.locator(".course-row").filter({ hasText: "Algebra 1" }).click();
await h.waitForTimeout(600);
await btn(h, /^Lessons/).click();
await h.waitForTimeout(400);
await h.locator("main").getByText("The quadratic formula and the discriminant").first().click();
await h.waitForTimeout(1200);
await h.locator(".calc-toggle").click().catch(() => {});
await h.waitForTimeout(300);
await h.locator(".calc-tabs button", { hasText: "Graph" }).click();
await h.locator(".graph-fn input").nth(1).fill("2x + 1");
await h.locator(".lesson-box.sec-example").first().scrollIntoViewIfNeeded();
await h.mouse.move(120, 470);
await shot(h, "lesson");
await h.locator(".calc-head button").click();

// Parent area.
await btn(h, /^Parent$/).click();
await h.waitForTimeout(300);
await h.getByLabel("Parent password").fill("parent pass");
await btn(h, /^Open$/).click();
await h.waitForTimeout(1500);
for (const done of await h.getByRole("button", { name: /^Done/ }).all()) await done.click().catch(() => {});
await h.waitForTimeout(500);
await shot(h, "parent-overview");

// Live room: the parent hosts, two kids join on phones.
await btn(h, /^Live room$/).click();
await h.waitForTimeout(500);
await h.getByLabel(/^How many/).fill("5");
await btn(h, "Open the room").click();
await h.waitForTimeout(1500);
const code = (await h.locator(".live-code").textContent())?.trim();
const p1 = await ctx(390, 760);
const p2 = await ctx(390, 760);
for (const [pg, name] of [[p1, "Maya"], [p2, "Leo"]]) {
  await pg.goto(`${WEB}?live=${code}`);
  await pg.waitForTimeout(1500);
  await pg.getByLabel("Nickname").fill(name);
  await btn(pg, /^Join$/).click();
  await pg.waitForTimeout(800);
}
await btn(h, /Start with question 1/).click();
await h.waitForTimeout(1000);
await shot(p1, "live-player");
for (const [pg, pick] of [[p2, 0], [p1, 1]]) {
  const boxes = pg.locator(".live-choice input[type=checkbox]");
  if (await boxes.count()) {
    await boxes.nth(pick).check();
    await btn(pg, "Send answer").click();
  } else await pg.locator("button.live-choice").nth(pick).click();
  await pg.waitForTimeout(400);
}
await h.waitForTimeout(1200);
await shot(h, "live-host");

// ---------- A classroom ----------
const t = await ctx();
await t.goto(B);
await t.waitForTimeout(1500);
await btn(t, "Homeschool or classroom").click();
await t.waitForTimeout(300);
await t.getByLabel(/^Classroom/).check();
await t.getByLabel(/^Your name/).fill("Ms. Ruiz");
await t.getByLabel(/^School/).fill("Lincoln Middle School");
await t.getByLabel("First class name").fill("Period 3 Algebra");
await t.getByRole("combobox", { name: /^Grade/ }).selectOption("8");
await t.getByLabel(/^Students, one name per line/).fill("Ana Torres\nBen Okafor\nChloe Park\nDiego Ramos\nElla Novak\nFinn Walsh\nGrace Liu\nHenry Adams");
await t.getByLabel("Password (8 characters or more)").fill("teacher pass");
await t.getByLabel("Type it again").fill("teacher pass");
await btn(t, "Set up the classroom").click();
await t.waitForTimeout(2500);
await btn(t, "I've written it down").click();
await t.waitForTimeout(1000);
await t.getByRole("combobox", { name: /^Course/ }).selectOption("math-algebra1");
const due = new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10);
await t.getByLabel("Due (optional)").fill(due);
await btn(t, /^Assign$/).click();
await t.waitForTimeout(400);
await t.getByRole("combobox", { name: /^Course/ }).selectOption("math-prealgebra");
await t.getByLabel("Due (optional)").fill(new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10));
await btn(t, /^Assign$/).click();
await t.waitForTimeout(400);
// Install the two courses through a student's library, then seed everyone.
await btn(t, /^Lock$/).click();
await t.waitForTimeout(500);
await t.locator(".who-card", { hasText: "Ana Torres" }).click();
await t.waitForTimeout(800);
for (const row of await t.locator(".assigned-row").all()) {
  await row.getByRole("button", { name: /Start/ }).click();
  await t.waitForTimeout(1500);
  await btn(t, /^Library$/).click().catch(() => {});
  await t.waitForTimeout(600);
}
const counts = [[14, 30], [9, 30], [16, 30], [5, 22], [11, 30], [7, 26], [15, 30], [3, 18]];
const names = ["Ana Torres", "Ben Okafor", "Chloe Park", "Diego Ramos", "Ella Novak", "Finn Walsh", "Grace Liu", "Henry Adams"];
await seed(t, Object.fromEntries(names.map((n, i) => [n, { "math-algebra1": counts[i][0], "math-prealgebra": counts[i][1] }])));
await t.goto(B);
await t.waitForTimeout(2000);
await btn(t, /^Teacher$/).click();
await t.waitForTimeout(300);
await t.getByLabel("Teacher password").fill("teacher pass");
await btn(t, /^Open$/).click();
await t.waitForTimeout(1200);
await btn(t, /^Gradebook$/).click();
await t.waitForTimeout(1200);
await shot(t, "gradebook");

await b.close();
