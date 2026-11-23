import assert from "node:assert/strict";
import { test } from "node:test";
import { AppUpdateController, type Release } from "../src/lib/appUpdateController.ts";

const tick = () => new Promise<void>(resolve => setTimeout(resolve, 0));

function fixture() {
  const calls: string[] = [];
  const release: Extract<Release, { kind: "desktop" }> = {
    version: "2.0.0", kind: "desktop",
    download: async progress => { calls.push("download"); progress(50); },
    install: async () => { calls.push("install"); },
    restart: async () => { calls.push("restart"); },
    close: async () => { calls.push("close"); },
  };
  const controller = new AppUpdateController(async () => { calls.push("check"); return release; });
  return { controller, calls, release };
}

test("automatic and manual checks share one verified download and one installer", async () => {
  const { controller, calls } = fixture();
  await Promise.all([controller.check(), controller.check()]);
  await tick();
  assert.equal(controller.snapshot()?.phase, "ready");
  assert.deepEqual(calls, ["check", "download"]);
  await Promise.all([controller.act(), controller.act(), controller.check()]);
  assert.deepEqual(calls, ["check", "download", "install", "close", "restart"]);
});

test("a rejected download cannot install and can recover on reconnect", async () => {
  const { controller, calls, release } = fixture();
  const download = release.download;
  release.download = async () => { throw Error("signature verification failed"); };
  await controller.check(); await tick();
  assert.equal(controller.snapshot()?.phase, "failed");
  assert.match(controller.snapshot()?.message ?? "", /signature/);
  assert.deepEqual(calls, ["check", "close"]);
  release.download = download;
  await controller.check(); await tick();
  assert.equal(controller.snapshot()?.phase, "ready");
  await controller.act();
  assert.equal(calls.filter(c => c === "install").length, 1);
});

test("install refusal waits for manual retry and a relaunch failure retries only relaunch", async () => {
  const { controller, release, calls } = fixture();
  const install = release.install, restart = release.restart;
  release.install = async () => { calls.push("denied"); throw Error("OS declined"); };
  await controller.check(); await tick(); await controller.act();
  await controller.check();
  assert.deepEqual(calls, ["check", "download", "denied"]);
  release.install = install;
  release.restart = async () => { calls.push("relaunch failed"); throw Error("relaunch failed"); };
  await controller.act();
  release.restart = restart;
  await controller.act();
  assert.deepEqual(calls, ["check", "download", "denied", "install", "close", "relaunch failed", "restart"]);
});

test("a current install stays quiet and Android keeps its explicit installer action", async () => {
  let offers = 0, installs = 0;
  const controller = new AppUpdateController(async () => ++offers === 1 ? null : {
    version: "2.0.0", kind: "android", install: async () => { installs++; },
  });
  assert.equal(await controller.check(), null);
  assert.equal(controller.snapshot(), null);
  await controller.check(); await tick();
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
