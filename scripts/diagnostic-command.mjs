// Run a CI command while recording bounded, secret-conscious incident metadata.
// Usage: node scripts/diagnostic-command.mjs <stage> -- <command> [arguments...]
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const args = process.argv.slice(2);
const divider = args.indexOf("--");
if (divider < 1 || divider === args.length - 1) {
  console.error("Usage: node scripts/diagnostic-command.mjs <stage> -- <command> [args...]");
  process.exit(2);
}
const stage = args[0].replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
if (!stage) process.exit(2);
const command = args[divider + 1];
const commandArgs = args.slice(divider + 2);
const started = Date.now();
const dir = join(process.env.RUNNER_TEMP || ".", "erudior-ci-diagnostics");
mkdirSync(dir, { recursive: true });
let tail = "";
let totalBytes = 0;
let streamHasError = false;
const MAX_BUFFER = 24000;
function capture(data) {
  const chunk = data.toString("utf8");
  totalBytes += Buffer.byteLength(data);
  // Never save the raw command output to artifacts. Preserve it only in memory,
  // bounded, until it can be reduced to strictly classified diagnostics.
  tail = (tail + chunk).slice(-MAX_BUFFER);
  if (/\b(error|failed|exception|fatal|panic)\b/i.test(chunk)) streamHasError = true;
}
function writeReport(code, signal, spawnError) {
  const lines = tail.split(/\r?\n/);
  const safeIndicators = [];
  for (const line of lines.slice(-200)) {
    // Do not store arbitrary log lines. Only bounded, known-safe error classes.
    for (const [pattern, label] of [
      [/\bTS\d{4,5}\b/g, "typescript"], [/\bERR_[A-Z_]+\b/g, "node"],
      [/\bE(?:ACCES|ADDRINUSE|CONNREFUSED|TIMEDOUT|NOENT|PIPE)\b/g, "system"],
      [/\b(?:AssertionError|SyntaxError|TypeError|ReferenceError)\b/g, "runtime"],
      [/\b(?:FAILED|FAIL|error:|panic:)\b/gi, "failure"]
    ]) {
      for (const match of line.matchAll(pattern)) {
        const value = label === "typescript" || label === "node" || label === "system"
          ? match[0] : label;
        if (!safeIndicators.includes(value)) safeIndicators.push(value);
        if (safeIndicators.length >= 20) break;
      }
      if (safeIndicators.length >= 20) break;
    }
    if (safeIndicators.length >= 20) break;
  }
  const record = {
    schema: "erudior.command-diagnostics.v1",
    timestamp: new Date(started).toISOString(),
    stage, durationMs: Date.now() - started,
    exitCode: Number.isInteger(code) ? code : null,
    signal: signal ? String(signal).replace(/[^a-zA-Z0-9]/g, "") : null,
    spawnFailure: spawnError ? "process_spawn_error" : null,
    outputBytes: totalBytes, outputHadErrorKeywords: streamHasError,
    indicators: safeIndicators,
    // Fingerprint lets us correlate repeated failures without revealing output.
    fingerprint: createHash("sha256").update(JSON.stringify([stage, code, signal, safeIndicators])).digest("hex").slice(0, 16),
    note: "Only generic error classes are retained. Consult masked GitHub step logs for detail."
  };
  writeFileSync(join(dir, stage + "-command.json"), JSON.stringify(record, null, 2) + "\n", { mode: 0o600 });
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      "\n#### " + stage + " diagnostics\n" +
      "- Exit: " + (record.exitCode ?? "unknown") + "; duration: " + record.durationMs + "ms\n" +
      "- Indicators: " + (safeIndicators.join(", ") || "none classified") + "\n" +
      "- Fingerprint: `" + record.fingerprint + "`\n");
  }
  console.log("[diagnostics] stage=" + stage + " exit=" + (code ?? "unknown") + " fingerprint=" + record.fingerprint);
}
let done = false;
function finish(code, signal, error) {
  if (done) return;
  done = true;
  writeReport(code, signal, error);
  process.exitCode = typeof code === "number" ? code : 1;
}
const child = spawn(command, commandArgs, { stdio: ["inherit", "pipe", "pipe"], shell: process.platform === "win32", windowsHide: true });
child.stdout?.on("data", data => { process.stdout.write(data); capture(data); });
child.stderr?.on("data", data => { process.stderr.write(data); capture(data); });
child.on("error", error => { console.error("[diagnostics] command failed to start (" + error.code + ")"); finish(null, null, error); });
child.on("close", (code, signal) => finish(code, signal));
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => { if (!done) child.kill(sig); });
}
