import assert from "node:assert/strict";
import { test } from "node:test";
import { AppUpdateController, type Release } from "../src/lib/appUpdateController.ts";

function fixture() {
  const calls: string[] = [];
  const saved = new Map<string, string>();
  const preferences = {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => { saved.set(key, value); },
    removeItem: (key: string) => { saved.delete(key); },
  };
  const release: Extract<Release, { kind: "desktop" }> = {
    version: "2.0.0", kind: "desktop", cached: false,
    download: async progress => { calls.push("download"); progress(50); release.cached = true; },
    install: async () => { calls.push("install"); return release.cached; },
    restart: async () => { calls.push("restart"); },
    close: async () => { calls.push("close"); },
  };
  const reopen = () => new AppUpdateController(async () => { calls.push("check"); return { ...release }; }, preferences);
  return { controller: reopen(), calls, release, reopen };
}

test("concurrent automatic and manual checks only offer; download and install each need a click", async () => {
  const { controller, calls } = fixture();
  await Promise.all([controller.check(), controller.check(true)]);
  assert.equal(controller.snapshot()?.phase, "offered");
  assert.deepEqual(calls, ["check"]);
  await Promise.all([controller.act(), controller.act(), controller.check()]);
  assert.equal(controller.snapshot()?.phase, "ready");
  assert.deepEqual(calls, ["check", "download"]);
  await Promise.all([controller.act(), controller.act(), controller.check()]);
  assert.deepEqual(calls, ["check", "download", "install", "close", "restart"]);
});

test("Later survives reopening and reconnect; manual check or a newer release can offer again", async () => {
  const { controller, calls, release, reopen } = fixture();
  await controller.check();
  controller.dismiss();
  const next = reopen();
  await next.check();
  assert.equal(next.snapshot(), null);
  await Promise.all([next.check(), next.check(true)]);
  assert.equal(next.snapshot()?.phase, "offered");
  next.dismiss();
  release.version = "2.0.1";
  await next.check();
  assert.equal(next.snapshot()?.release.version, "2.0.1");
  assert.equal(calls.includes("download"), false);
});

test("a refused install survives reopening and retries the verified package without another download", async () => {
  const { controller, calls, release, reopen } = fixture();
  await controller.check();
  await controller.act();
  release.install = async () => { calls.push("denied"); throw Error("System authorization denied"); };
  const next = reopen();
  await next.check();
  assert.equal(next.snapshot()?.phase, "ready");
  await next.act();
  assert.match(next.snapshot()?.message ?? "", /authorization denied/);
  await next.check();
  assert.deepEqual(calls, ["check", "download", "check", "denied"]);
  const last = reopen();
  release.install = async () => { calls.push("install"); return true; };
  let restartAttempts = 0;
  release.restart = async () => { if (++restartAttempts === 1) throw Error("relaunch failed"); };
  await last.check();
  await last.act();
  assert.equal(last.snapshot()?.retry, "restart");
  await last.act();
  assert.equal(restartAttempts, 2);
  assert.equal(calls.filter(c => c === "install").length, 1);
  assert.equal(calls.filter(c => c === "download").length, 1);
});

test("a lost or corrupt staged package returns to the download prompt", async () => {
  const { controller, release, calls } = fixture();
  release.cached = true;
  await controller.check();
  release.cached = false;
  await controller.act();
  assert.equal(controller.snapshot()?.phase, "offered");
  assert.match(controller.snapshot()?.message ?? "", /fresh copy/);
  assert.deepEqual(calls, ["check", "install"]);
  await controller.act();
  assert.equal(controller.snapshot()?.phase, "ready");
});

test("failed download recovers on reconnect only after renewed consent", async () => {
  const { controller, release, calls } = fixture();
  const download = release.download;
  release.download = async () => { throw Error("signature verification failed"); };
  await controller.check();
  await controller.act();
  assert.match(controller.snapshot()?.message ?? "", /signature/);
  release.download = download;
  await controller.check();
  assert.equal(controller.snapshot()?.phase, "offered");
  assert.equal(calls.includes("download"), false);
  await controller.act();
  assert.equal(controller.snapshot()?.phase, "ready");
});

test("a current install stays quiet and Android keeps its explicit installer action", async () => {
  let offers = 0, installs = 0;
  const controller = new AppUpdateController(async () => ++offers === 1 ? null : {
    version: "2.0.0", kind: "android", install: async () => { installs++; },
  });
  assert.equal(await controller.check(), null);
  assert.equal(controller.snapshot(), null);
  await controller.check();
  assert.equal(installs, 0);
  assert.equal(controller.snapshot()?.phase, "offered");
  await controller.act(); assert.equal(installs, 1);
  assert.equal(controller.snapshot()?.phase, "opened");
  await controller.check();
  assert.equal(controller.snapshot()?.phase, "offered");
});

test("an unavailable feed retries after connectivity returns", async () => {
  let attempts = 0;
  const controller = new AppUpdateController(async () => {
    if (++attempts === 1) throw Error("offline");
    return { kind: "external", version: "2.0.0" };
  });
  await assert.rejects(controller.check(), /offline/);
  assert.equal(await controller.check(), "2.0.0");
  controller.dismiss();
  assert.equal(controller.snapshot(), null);
});
