// Build once with an ephemeral fixture trust root. Both production host entry points
// then see revised signed releases on GitHub's normal URL without changing any assets.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { build } from "vite";
import { chromium } from "playwright";
import nacl from "tweetnacl";
import { GITHUB_COURSE_FEED } from "../src/lib/githubCourseFeed.ts";

const dir = await mkdtemp(path.join(tmpdir(), "erudior-feed-test-"));
const key = nacl.sign.keyPair();
const b64 = bytes => Buffer.from(bytes).toString("base64");
const demo = JSON.parse(await readFile("samples/demo-code-course.json", "utf8"));
const files = new Map();
function entry(id, title, revision) {
  const file = id + ".r" + revision + ".json";
  const body = JSON.stringify({ ...demo, id, title, revision });
  files.set(file, body);
  return { id, title, revision, file, sha256: createHash("sha256").update(body).digest("hex"), bytes: Buffer.byteLength(body),
    order: 1, description: "Approved revision " + revision, level: [], type: [], subject: "Science", lessons: 1, questions: 0, cards: 0, drills: 0 };
}
function sign(courses, stagedPrograms) {
  const text = JSON.stringify({ format: "examiner-catalog", version: 1, courses, stagedPrograms });
  return { text, sig: b64(nacl.sign.detached(Buffer.from(text), key.secretKey)) };
}
let catalog = sign([entry("feed-first", "Existing feed course", 1)]);
const accepted = [];
let offline = false;
let browser;
try {
  await build({ logLevel: "error", build: { outDir: dir, emptyOutDir: true }, plugins: [{
    name: "ephemeral-course-test-key", enforce: "pre",
    transform(_, id) {
      if (id.endsWith("/src/lib/courseKeys.ts")) return "export const COURSE_PUBLIC_KEYS = [" + JSON.stringify(b64(key.publicKey)) + "];";
    },
  }] });
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  const ctx = await browser.newContext();
  await ctx.route("**/*", async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.href.startsWith(GITHUB_COURSE_FEED)) {
      const file = url.href.slice(GITHUB_COURSE_FEED.length);
      accepted.push(file);
      assert.equal(request.method(), "GET");
      const headers = await request.allHeaders();
      assert.ok(!headers.cookie && !headers.authorization);
      if (offline) return route.abort();
      const body = file === "catalog.signed.json" ? JSON.stringify(catalog) : files.get(file);
      return route.fulfill({ status: body ? 200 : 404, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: body || "" });
    }
    if (!["erudior.com", "app.erudior.com"].includes(url.hostname)) return route.abort();
    const ext = path.extname(url.pathname);
    const mime = { ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png" };
    try {
      const body = await readFile(path.join(dir, ext ? url.pathname : "index.html"));
      return route.fulfill({ contentType: mime[ext] || (ext ? "application/octet-stream" : "text/html"), body });
    } catch { return route.fulfill({ status: 404 }); }
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  await page.goto("https://erudior.com/");
  await page.getByRole("link", { name: "Existing feed course", exact: true }).waitFor({ state: "attached" });
  const next = entry("feed-new", "New feed course", 1);
  const program = { id: "feed-pathway", version: 1, category: "Trades and transportation", title: "Workshop pathway",
    description: "A signed workshop sequence.", notice: "Independent study.", reviewedOn: "2026-11-26", sources: [],
    stages: [{ id: "practice", title: "Practice", summary: "Study the new course.", milestone: "Finish a project.", courses: [
      { courseId: next.id, title: next.title, recommendedBefore: [], modules: ["Workshop"], outcomes: ["Build a project."], assignment: "Present a project." },
    ] }] };
  const second = sign([entry("feed-first", "Existing feed course", 2), next], [program]);
  const library = await ctx.newPage();
  await library.goto("https://app.erudior.com/");
  const search = library.getByRole("searchbox", { name: "Search programs" });
  await search.fill(program.title);
  const card = library.getByRole("article", { name: program.title + " catalog entry" });
  assert.equal(await card.count(), 0);
  catalog = second;
  await library.getByRole("button", { name: "Refresh catalog" }).click();
  await card.waitFor();
  offline = true;
  await library.reload();
  await search.fill(program.title);
  await card.waitFor();
  offline = false;
  await library.close();
  catalog = second;
  await page.reload();
  const link = page.getByRole("link", { name: next.title, exact: true });
  await link.waitFor({ state: "attached" });
  const url = await link.getAttribute("href");
  await page.goto(url);
  await page.getByRole("heading", { name: next.title, exact: true }).waitFor();
  assert.equal(await page.evaluate(() => JSON.parse(JSON.parse(localStorage.getItem("examiner.catalog.v1")).text).courses[0].revision), 2);

  catalog = { ...second, text: second.text.replace(next.title, "Tampered feed course") };
  await page.reload();
  await page.getByRole("heading", { name: next.title, exact: true }).waitFor();
  assert.equal(await page.getByText("Tampered feed course").count(), 0);
  offline = true;
  await page.reload();
  await page.getByRole("heading", { name: next.title, exact: true }).waitFor();
  offline = false;
  catalog = second;
  const clean = files.get(next.file);
  files.set(next.file, clean + " ");
  await page.getByRole("button", { name: "Browse lessons" }).click();
  await page.getByText(/didn't match the catalog/).first().waitFor();
  files.set(next.file, clean);
  await page.getByRole("button", { name: "Browse lessons" }).click();
  await page.getByText("First programs", { exact: true }).first().waitFor();
  assert.ok(accepted.includes(next.file));
  console.log("One engine discovered a new course and an updated revision, opened its direct link, recovered offline, rejected altered data and installed the verified package.");
} finally {
  await browser?.close();
  await rm(dir, { recursive: true, force: true });
}
