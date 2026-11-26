// Run against the installed release WebView on an isolated Windows runner.
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const endpoint = "http://127.0.0.1:9222";
let browser, page;
try {
  const deadline = Date.now() + 90_000;
  while (!page && Date.now() < deadline) {
    if (!browser) browser = await chromium.connectOverCDP(endpoint, { timeout: 3000 }).catch(() => null);
    page = browser?.contexts().flatMap(context => context.pages()).find(p => /\/\/tauri\.localhost(?:\/|$)/.test(p.url()));
    if (!page) await delay(500);
  }
  assert(page, "The installed Erudior WebView did not open.");
  page.setDefaultTimeout(45_000);
  const catalogFetch = page.waitForResponse(response => response.url().endsWith("/v1/catalog.signed.json") && response.ok());
  await page.getByRole("button", { name: "Refresh catalog", exact: true }).click();
  await catalogFetch;
  await page.waitForFunction(() => !!localStorage.getItem("examiner.catalog.v1"));
  const catalog = await page.evaluate(() => JSON.parse(JSON.parse(localStorage.getItem("examiner.catalog.v1")).text));
  assert(Array.isArray(catalog.stagedPrograms), "The Windows app must accept the signed program list.");
  const program = catalog.stagedPrograms[0];
  if (program) {
    await page.getByRole("searchbox", { name: "Search programs" }).fill(program.title);
    const card = page.getByRole("article", { name: program.title + " catalog entry", exact: true });
    await card.waitFor();
    console.log("Windows Library found signed program", program.title);
  }
  const id = program?.stages.flatMap(stage => stage.courses)[0]?.courseId;
  const entry = id ? catalog.courses.find(c => c.id === id) : catalog.courses.find(c => !c.requires?.length && c.lessonIds?.length);
  assert(entry?.lessonIds?.length, "Expected an accessible course with lessons.");
  await page.getByRole("searchbox", { name: "Search courses" }).fill(entry.title);
  const course = page.locator(".catalog-card").filter({ has: page.getByRole("button", { name: /view overview/ }) }).filter({ hasText: entry.title }).first();
  const download = page.waitForResponse(r => r.url().endsWith("/" + entry.file) && r.ok());
  await course.getByRole("button", { name: "Start course", exact: true }).click();
  await download;
  await page.getByRole("navigation", { name: "Course sections" }).getByRole("button", { name: "Lessons", exact: true }).click();
  const lesson = entry.outline.flatMap(module => module.lessons)[0];
  await page.getByRole("button").filter({ hasText: lesson }).first().click();
  await page.getByRole("heading", { name: lesson, exact: true }).waitFor();
  console.log("Installed Windows release opened", entry.id, "revision", entry.revision, "lesson", lesson);
} finally {
  await browser?.close();
}
