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
  const states = new Map([["progress", sessionStorage.getItem("test.progress") ?? JSON.stringify(progress)]]);
  const sessions = new Map();
  window.vmCalls = [];
  window.releaseCalls = [];
  let running = false, sequence = 0;
  window.__TAURI_INTERNALS__ = {
    transformCallback: () => ++sequence, unregisterCallback: () => {},
    invoke: async (cmd, args = {}) => {
      const { course, lesson, expected, role, id } = args;
      if (cmd.startsWith("vm_")) window.vmCalls.push({ cmd, course, lesson, expected, role, id, action: args.action });
      if (cmd === "list_items") return args.kind === "courses" ? [JSON.stringify(raw)] : [];
      if (cmd === "load_state") return states.get(args.name) ?? null;
      if (cmd === "save_state" || cmd === "compare_and_swap_state") {
        if (cmd === "compare_and_swap_state" && (states.get(args.name) ?? null) !== args.expected) return false;
        states.set(args.name, args.content);
        if (args.name === "progress") sessionStorage.setItem("test.progress", args.content);
        return cmd === "compare_and_swap_state" ? true : undefined;
      }
      if (cmd === "install_kind") return "rpm";
      if (cmd.startsWith("plugin:updater|") || cmd === "plugin:process|restart") {
        window.releaseCalls.push(cmd);
        switch (cmd) {
          case "plugin:updater|check":
            return window.offerRelease ? { rid: 90, currentVersion: "1.0.0", version: "1.1.0", rawJson: {} } : null;
          case "plugin:updater|download":
            return 91;
          case "plugin:updater|install":
            if (args.bytesRid !== 91 || args.updateRid !== 90) throw Error("Wrong staged update");
        }
        return;
      }
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
const calculatorSetting = page.getByRole("checkbox", { name: "Show calculator in this course" });
const grip = pane => pane.getByRole("separator", { name: "Terminal height" });
const height = pane => pane.locator(".vm-console-screen").evaluate(el => el.getBoundingClientRect().height);
const rows = pane => pane.locator(".xterm-accessibility-tree [role=listitem]").count();

async function dragHeight(pane, delta) {
  const handle = grip(pane);
  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  assert(box);
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + delta, { steps: 5 });
  await page.mouse.up();
}

try {
  await page.goto("https://erudior.test/");
  await page.locator(".course-row").filter({ hasText: course.title }).click();
  assert.equal(await calculatorSetting.isChecked(), false);
  await button("Lessons").click();
  await button("Open practice terminal").click();
  await practice.getByRole("button", { name: "Start lab" }).click();
  await practice.getByText("Connected. Press Enter for the login prompt.").waitFor();
  const [first] = await opens();
  assert.equal(first.lesson, "practice-environment");
  await read.getByRole("button", { name: new RegExp(title("first-prompt")) }).first().click();
  await read.getByRole("heading", { name: title("first-prompt"), exact: true }).waitFor();
  assert.equal(await page.locator(".calc-toggle, .calc-panel, html.calc-open").count(), 0);
  await geometry(false);
  const screen = practice.locator(".vm-console-screen");
  const width = (await screen.boundingBox()).width;
  const original = await height(practice);
  const originalRows = await rows(practice);
  await dragHeight(practice, 84);
  assert(await height(practice) > original + 65);
  assert.equal((await screen.boundingBox()).width, width);
  await page.waitForFunction(count => document.querySelectorAll(".xterm-accessibility-tree [role=listitem]").length > count, originalRows);
  const taller = await height(practice);
  await grip(practice).press("ArrowUp");
  assert(await height(practice) < taller);
  assert(await height(practice) > original);
  const chosen = await grip(practice).getAttribute("aria-valuenow");
  await read.locator("article").scrollIntoViewIfNeeded();
  const before = await read.evaluate(el => el.scrollTop);
  await input(practice, "pwd");
  await page.keyboard.press("F6");
  assert(await read.evaluate(el => el === document.activeElement));
  await page.keyboard.press("F6");
  assert(await practice.locator(".xterm-helper-textarea").evaluate(el => el === document.activeElement));
  assert.equal(await read.evaluate(el => el.scrollTop), before);
  await page.screenshot({ path: out + "/desktop.png" });
  await read.getByRole("button", { name: "Previous", exact: true }).click();
  await read.getByRole("heading", { name: title("install-workbench"), exact: true }).waitFor();
  assert.equal(await read.evaluate(el => el.scrollTop), 0);
  assert.equal((await opens()).length, 1, "Reading navigation reopened the session");
  await page.setViewportSize({ width: 820, height: 720 });
  await geometry(true);
  assert.equal(await grip(practice).getAttribute("aria-valuenow"), chosen);
  const narrowBefore = await height(practice);
  const readerBefore = (await read.boundingBox()).height;
  await dragHeight(practice, -60);
  assert(await height(practice) > narrowBefore + 40);
  assert((await read.boundingBox()).height < readerBefore - 40);
  await grip(practice).press("Home");
  assert.equal(await grip(practice).getAttribute("aria-valuenow"), await grip(practice).getAttribute("aria-valuemin"));
  const shortest = await height(practice);
  await grip(practice).press("ArrowUp");
  assert(await height(practice) > shortest);
  await grip(practice).press("End");
  assert.equal(await grip(practice).getAttribute("aria-valuenow"), await grip(practice).getAttribute("aria-valuemax"));
  await grip(practice).press("ArrowDown");
  await grip(practice).press("ArrowDown");
  const remembered = await grip(practice).getAttribute("aria-valuenow");
  await geometry(true);
  assert.equal((await opens()).length, 1, "Resizing must preserve the live serial connection");
  await input(practice, "whoami");
  assert.equal(await page.evaluate(() => window.lastInput.id), first.id);
  await page.screenshot({ path: out + "/narrow.png" });
  await practice.getByRole("button", { name: "Server console" }).click();
  await practice.getByRole("region", { name: "server serial console" }).waitFor();
  assert.equal(await grip(practice).getAttribute("aria-valuenow"), remembered);
  await input(practice, "hostname");
  const serverId = await page.evaluate(() => window.lastInput.id);

  await page.setViewportSize({ width: 1280, height: 850 });
  await read.getByRole("button", { name: "← " + course.title }).click();
  await calculatorSetting.check();
  await read.getByRole("button", { name: new RegExp(title("shell-words")) }).first().click();
  await read.getByRole("heading", { name: title("shell-words"), exact: true }).waitFor();
  await input(practice, "pwd");
  assert.equal(await page.evaluate(() => window.lastInput.id), serverId, "Changing modules kept the server shell");
  await read.getByRole("button", { name: "← " + course.title }).click();
  await read.getByRole("button", { name: new RegExp(title("shared-directory")) }).first().click();
  await button("Open the basic calculator").waitFor();
  assert.equal(await exam.isVisible(), false, "A practical only shows its own console");
  await read.getByRole("button", { name: "Client console" }).click();
  const examClient = exam.getByRole("region", { name: "client serial console" });
  await examClient.getByText("Connected. Press Enter for the login prompt.").waitFor();
  assert.equal(await exam.getByRole("region", { name: "server serial console" }).count(), 0);
  assert.equal(await grip(exam).getAttribute("aria-valuenow"), remembered);
  await grip(exam).press("ArrowUp");
  await input(examClient, "pwd");
  const last = (await opens()).at(-1);
  assert.equal(last.lesson, "shared-directory");
  assert.equal(last.expected, "exam-attempt");
  assert(await read.getByRole("region", { name: "Timed practical exam" }).isVisible());
  assert.equal(await button("Open practice terminal").count(), 0);
  const examHeight = await grip(exam).getAttribute("aria-valuenow");
  await exam.getByRole("button", { name: "Close console" }).click();
  assert.equal(await exam.isVisible(), false);
  await read.getByRole("button", { name: "Previous", exact: true }).click();
  await read.getByRole("heading", { name: title("shell-evidence"), exact: true }).waitFor();
  assert.equal(await grip(practice).getAttribute("aria-valuenow"), examHeight);
  await input(practice, "whoami");
  assert.deepEqual(await page.evaluate(() => window.lastInput), { id: serverId, text: "hostname\rpwd\rwhoami\r" });
  assert.equal((await opens()).length, 3, "Returning from a practical reused the original practice console");
  await button("Hide practice terminal").click();
  await page.waitForFunction(id => window.vmCalls.some(c => c.cmd === "vm_console_close" && c.id === id), serverId);
  assert.equal(await practice.isVisible(), false);
  assert.equal(await page.evaluate(() => window.vmCalls.some(c => c.action === "stop" || c.action === "reset")), false);
  await page.goto("https://erudior.test/");
  await page.locator(".course-row").filter({ hasText: course.title }).click();
  assert.equal(await calculatorSetting.isChecked(), true, "Course preference survived reopening the app");
  await calculatorSetting.uncheck();
  await button("Open practice terminal").click();
  await practice.getByRole("button", { name: "Start lab" }).click();
  await practice.getByText("Connected. Press Enter for the login prompt.").waitFor();
  assert.equal(await grip(practice).getAttribute("aria-valuenow"), examHeight, "The preferred height should survive reopening the app");
  // A release is discovered on reconnect while a live practice session is open.
  await page.evaluate(() => {
    window.offerRelease = true;
    window.dispatchEvent(new Event("online"));
    window.dispatchEvent(new Event("online"));
  });
  await page.getByRole("button", { name: "Install and restart now" }).waitFor();
  await input(practice, "id");
  assert.equal(await page.evaluate(() => window.releaseCalls.includes("plugin:updater|install")), false);
  await page.getByRole("navigation", { name: "Main", exact: true }).getByRole("button", { name: "Library", exact: true }).click();
  await page.waitForFunction(() => window.releaseCalls.includes("plugin:process|restart"));
  assert.deepEqual(await page.evaluate(() => window.releaseCalls.filter(cmd => !cmd.endsWith("|check"))),
    ["plugin:updater|download", "plugin:updater|install", "plugin:process|restart"]);
  await page.addInitScript(() => { window.offerRelease = true; });
  await page.goto("https://erudior.test/");
  await page.waitForFunction(() => window.releaseCalls.includes("plugin:process|restart"));
  assert.deepEqual(await page.evaluate(() => window.releaseCalls),
    ["plugin:updater|check", "plugin:updater|download", "plugin:updater|install", "plugin:process|restart"]);
  console.log("A newer signed release installed and restarted from a cold launch without a click.");
  console.log("A live lesson survived automatic download, and returning to the Library installed the staged RPM update once.");
  console.log("Pointer and keyboard resizing, row refit, unchanged width and remembered terminal height passed.");
  console.log("Lesson reading, serial input, session continuity, two pane widths, guest switching and exam isolation passed.");
} catch (error) {
  console.error((await page.locator("body").innerText()).slice(0,2300));
  await page.screenshot({ path: out + "/failure.png" });
  throw error;
} finally { await browser.close(); }
