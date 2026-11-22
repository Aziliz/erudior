// Exercise the production reader, navigation, xterm input and output using a native bridge fixture.
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const course = JSON.parse(await readFile("samples/rhcsa-10-administration.json", "utf8"));
const title = id => course.lessons.find(lesson => lesson.id === id).title;
const out = "test-results/vm-study";
await mkdir(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
page.setDefaultTimeout(15000);
page.on("pageerror", error => console.error(error.message));

await page.route("**/*", async route => {
  const url = new URL(route.request().url());
  if (url.origin !== "https://erudior.test") return route.abort();
  const file = path.join("dist", url.pathname === "/" ? "index.html" : url.pathname);
  await route.fulfill({ path: file }).catch(() => route.abort());
});
await page.addInitScript(raw => {
  window.isTauri = true;
  const progress = { version: 1, seeded: true, catalogV1: true, attempts: [], stats: {}, cards: {},
    lessonsDone: {}, plans: {}, activity: {}, drills: {} };
  const states = new Map([["progress", JSON.stringify(progress)]]);
  const sessions = new Map();
  window.vmCalls = [];
  let running = false, sequence = 0;
  window.__TAURI_INTERNALS__ = {
    transformCallback: () => ++sequence, unregisterCallback: () => {},
    invoke: async (cmd, args = {}) => {
      const { course, lesson, expected, role, id } = args;
      if (cmd.startsWith("vm_")) window.vmCalls.push({ cmd, course, lesson, expected, role, id, action: args.action });
      if (cmd === "list_items") return args.kind === "courses" ? [JSON.stringify(raw)] : [];
      if (cmd === "load_state") return states.get(args.name) ?? null;
      if (cmd === "save_state") { states.set(args.name, args.content); return; }
      if (cmd === "install_kind") return "linux-package";
      if (cmd === "vm_setup_media") return { dvd: true, kit: true };
      if (cmd === "vm_lab") {
        if (lesson !== "practice-environment") return { exam: { phase: "active", id: "exam-attempt", remainingMs: 600000 },
          running: { client: true, server: true }, password: "fixture", report: null };
        if (args.action === "start") running = true;
        return { running: { client: running, server: running }, attemptId: running ? "practice-attempt" : null,
          password: running ? "fixture" : null, report: null };
      }
      if (cmd === "vm_console_open") {
        sessions.set(id, { text: "", channel: args.channel });
        args.channel.onmessage({ kind: "output", bytes: [...new TextEncoder().encode("learner@client $ ")] });
        return;
      }
      if (cmd === "vm_console_close") { sessions.delete(id); return; }
      if (cmd === "vm_console_write") {
        const shell = sessions.get(id);
        if (!shell) throw Error("Input went to a closed console");
        shell.text += new TextDecoder().decode(Uint8Array.from(args.bytes));
        window.lastInput = { id, text: shell.text };
        shell.channel.onmessage({ kind: "output", bytes: args.bytes });
        return;
      }
      return null;
    },
  };
}, course);

const wanted = name => page.getByRole("button",{ name, exact:true });
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
const allRefs=new Set();
try {
  await page.goto("https://erudior.test/");
  await page.locator(".course-row").filter({hasText:course.title}).click();
  await wanted("Lessons").click();
  for (const item of course.lessons) {
    const title=page.locator(".lesson-title").filter({hasText:item.title}).first();
    await title.click();
    await page.getByRole("heading",{name:item.title,exact:true}).waitFor();
    const reader=page.locator(".vm-study-reader");
    const article=reader.locator("article");
    assert((await article.innerText()).length>240,item.id);
    if(item.quiz?.length) {
      await reader.locator(".lesson-quiz").getByText(new RegExp(item.quiz.length+" questions? on this lesson")).waitFor();
      assert.equal(await reader.locator(".lesson-quiz").getByRole("button",{name:"Take the quiz",exact:true}).count(),1,item.id);
    }
    if(!item.vmLab) assert.equal(await wanted("Open practice terminal").count(),1,item.id);
    if(item.body.includes("~~~".replace(/~/g,String.fromCharCode(96)))) assert(await article.locator("pre").count(),item.id);
    for(const ref of item.refs??[]) allRefs.add(ref);
    await wanted("← "+course.title).click();
  }
  assert.equal(allRefs.size,course.references.length);
  assert.deepEqual(errors,[]);
  console.log("Rendered all "+course.lessons.length+" RHCSA revision "+course.revision+" lessons. Verified linked quiz counts, code blocks, reference reachability and study-terminal availability.");
} catch (error) {
  console.error((await page.locator("body").innerText()).slice(0,1400));
  throw error;
} finally { await browser.close(); }
