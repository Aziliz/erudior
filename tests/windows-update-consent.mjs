// Drive the installed WebView2 window using the loopback debugging port enabled by this test.
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const endpoint = "http://127.0.0.1:9222";
let browser, page;
for (let i = 0; i < 120 && !page; i++) {
  try {
    browser ??= await chromium.connectOverCDP(endpoint, { timeout: 2000 });
    page = browser.contexts().flatMap(c => c.pages()).find(p => p.url().startsWith("http://tauri.localhost") || p.url().startsWith("https://tauri.localhost"));
  } catch { /* The runtime may still be starting. */ }
  if (!page) await delay(500);
}
assert.ok(page, "Installed Erudior WebView2 page");
page.setDefaultTimeout(120_000);
const banner = page.getByRole("region", { name: "App update", exact: true });
const install = banner.getByRole("button", { name: "Install and restart now" });
if (process.argv[2] === "download") {
  await banner.getByRole("button", { name: "Download update" }).click();
  await install.waitFor();
} else {
  await install.waitFor();
  assert.equal(await banner.getByRole("button", { name: "Download update" }).count(), 0);
  // Native NSIS exits the calling app during the click.
  await install.click({ noWaitAfter: true }).catch(e => { if (!/closed|disconnected/i.test(String(e))) throw e; });
}
await browser.close();
