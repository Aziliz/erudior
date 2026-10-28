import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const runner = resolve("scripts/diagnostic-command.mjs");
function execute(exit, extra = "") {
  const dir = mkdtempSync(join(tmpdir(), "erudior-diagnostics-"));
  const result = spawnSync(process.execPath, [
    runner, "regression", "--", process.execPath, "-e",
    `console.error("AssertionError: ${extra}"); process.exit(${exit})`
  ], { env: { ...process.env, RUNNER_TEMP: dir, GITHUB_STEP_SUMMARY: "" }, encoding: "utf8" });
  const report = JSON.parse(readFileSync(join(dir, "erudior-ci-diagnostics", "regression-command.json"), "utf8"));
  rmSync(dir, { recursive: true, force: true });
  return { result, report };
}
test("records successful command status and schema", () => {
  const { result, report } = execute(0);
  assert.equal(result.status, 0);
  assert.equal(report.exitCode, 0);
  assert.equal(report.schema, "erudior.command-diagnostics.v1");
  assert.ok(report.durationMs >= 0);
});
test("preserves failed exit status without leaking error content into artifacts", () => {
  const secret = "token=secret-value-never-artifact";
  const { result, report } = execute(7, secret);
  assert.equal(result.status, 7);
  assert.equal(report.exitCode, 7);
  assert.ok(report.indicators.includes("runtime"));
  assert.ok(!JSON.stringify(report).includes(secret));
  assert.match(report.fingerprint, /^[0-9a-f]{16}$/);
});
test("consistent failure categories receive consistent fingerprints", () => {
  assert.equal(execute(3, "first").report.fingerprint, execute(3, "second").report.fingerprint);
});
