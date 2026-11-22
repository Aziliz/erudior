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
  if (url.origin !== "http://erudior.test") return route.abort();
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

const button = name => page.getByRole("button", { name, exact: true });
const read = page.getByRole("region", { name: "Course reading" });
const practice = page.getByRole("complementary", { name: "Practice terminal" });
const exam = page.getByRole("complementary", { name: "Lesson terminal" });
const opens = () => page.evaluate(() => window.vmCalls.filter(c => c.cmd === "vm_console_open"));
async function geometry(stacked) {
  const a = await read.boundingBox(), b = await practice.boundingBox();
  assert(a && b && a.height > 120 && b.height > 120);
  if (stacked) assert(a.y + a.height <= b.y + 1, "Narrow reader must be visible above terminal");
  else assert(a.x + a.width <= b.x + 1, "Desktop reader must be visible beside terminal");
  assert(b.y + b.height <= page.viewportSize().height + 1, "Terminal must be on screen");
}
async function input(pane, command) {
  await pane.locator(".xterm-helper-textarea").focus();
  await page.keyboard.type(command);
  await page.keyboard.press("Enter");
  await page.waitForFunction(value => window.lastInput?.text.endsWith(value + "\r"), command);
}
try {
  await page.goto("http://erudior.test/");
  await page.locator(".course-row").filter({ hasText: course.title }).click();
  await button("Lessons").click();
  await button("Open practice terminal").click();
  await practice.getByRole("button", { name: "Start lab" }).click();
  await practice.getByText("Connected. Press Enter for the login prompt.").waitFor();
  const [first] = await opens();
  assert.equal(first.lesson, "practice-environment");
  await read.getByRole("button", { name: new RegExp(title("first-prompt")) }).first().click();
  await read.getByRole("heading", { name: title("first-prompt"), exact: true }).waitFor();
  await geometry(false);
  await read.locator("article").scrollIntoViewIfNeeded();
  const before = await read.evaluate(el => el.scrollTop);
  await input(practice, "pwd");
  assert.equal(await read.evaluate(el => el.scrollTop), before);
  await page.screenshot({ path: out + "/desktop.png" });
  await read.getByRole("button", { name: "Previous", exact: true }).click();
  await read.getByRole("heading", { name: title("install-workbench"), exact: true }).waitFor();
  assert.equal(await read.evaluate(el => el.scrollTop), 0);
  assert.equal((await opens()).length, 1, "Reading navigation reopened the session");
  await page.setViewportSize({ width: 820, height: 720 });
  await geometry(true);
  await input(practice, "whoami");
  assert.equal(await page.evaluate(() => window.lastInput.id), first.id);
  await page.screenshot({ path: out + "/narrow.png" });
  await practice.getByRole("button", { name: "Server console" }).click();
  await practice.getByRole("region", { name: "server serial console" }).waitFor();
  await input(practice, "hostname");
  await button("Hide practice terminal").click();
  await page.waitForFunction(() => window.vmCalls.filter(c => c.cmd === "vm_console_close").length === 2);
  assert.equal(await practice.isVisible(), false);
  assert.equal(await page.evaluate(() => window.vmCalls.some(c => c.action === "stop" || c.action === "reset")), false);

  await page.setViewportSize({ width: 1280, height: 850 });
  await read.getByRole("button", { name: "← " + course.title }).click();
  await read.getByRole("button", { name: new RegExp(title("shared-directory")) }).first().click();
  await read.getByRole("button", { name: "Client console" }).click();
  await exam.getByText("Connected. Press Enter for the login prompt.").waitFor();
  await input(exam, "pwd");
  const last = (await opens()).at(-1);
  assert.equal(last.lesson, "shared-directory");
  assert.equal(last.expected, "exam-attempt");
  assert(await read.getByRole("region", { name: "Timed practical exam" }).isVisible());
  assert.equal(await button("Open practice terminal").count(), 0);
  await exam.getByRole("button", { name: "Close console" }).click();
  assert.equal(await exam.isVisible(), false);
  console.log("Lesson reading, serial input, session continuity, two pane widths, guest switching and exam isolation passed.");
} catch (error) {
  console.error((await page.locator("body").innerText()).slice(0,2300));
  await page.screenshot({ path: out + "/failure.png" });
  throw error;
} finally { await browser.close(); }
