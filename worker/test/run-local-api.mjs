// Self-contained local API regression runner. Never uses remote Cloudflare bindings.
import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const worker = fileURLToPath(new URL("../", import.meta.url));
const wrangler = path.join(worker, "node_modules/wrangler/bin/wrangler.js");
const temporary = await mkdtemp(path.join(os.tmpdir(), "erudior-local-api-"));
const children = new Set();
// Do not inherit production tokens, proxy settings, .dev.vars, or Wrangler login state.
const env = Object.fromEntries(["PATH", "Path", "SystemRoot", "WINDIR", "LANG", "TMP", "TEMP", "TMPDIR"]
  .filter(key => process.env[key]).map(key => [key, process.env[key]]));
Object.assign(env, { HOME: temporary, USERPROFILE: temporary, XDG_CONFIG_HOME: temporary,
  CI: "true", WRANGLER_SEND_METRICS: "false", NO_COLOR: "1" });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function launch(args, extraEnv = {}) {
  const child = spawn(process.execPath, args, {
    cwd: temporary, env: { ...env, ...extraEnv }, detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.add(child);
  child.log = "";
  for (const stream of [child.stdout, child.stderr]) stream.on("data", data => {
    child.log = (child.log + data.toString()).slice(-100_000);
  });
  child.done = new Promise(resolve => {
    child.once("error", error => { child.failure = error; resolve(-1); });
    child.once("exit", code => { child.finished = true; resolve(code ?? -1); });
  });
  return child;
}

async function stop(child) {
  if (!child.pid) return;
  if (process.platform === "win32") {
    await new Promise(resolve => {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      killer.once("error", resolve); killer.once("exit", resolve);
    });
  } else {
    // Wrangler launches workerd; terminate its process group, not just the CLI.
    try { process.kill(-child.pid, "SIGTERM"); } catch (error) { if (error.code !== "ESRCH") throw error; }
    await Promise.race([child.done, delay(1500)]);
    try { process.kill(-child.pid, "SIGKILL"); } catch (error) { if (error.code !== "ESRCH") throw error; }
  }
  children.delete(child);
}

async function bounded(child, milliseconds, label) {
  let timer;
  try {
    const code = await Promise.race([child.done, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${milliseconds / 1000}s`)), milliseconds);
    })]);
    if (code !== 0) throw new Error(`${label} failed (${code}): ${child.failure ?? ""}`);
    process.stdout.write(child.log);
  } catch (error) {
    process.stderr.write(child.log);
    throw error;
  } finally { clearTimeout(timer); await stop(child); }
}

async function freePort() {
  const socket = createServer();
  await new Promise((resolve, reject) => { socket.once("error", reject); socket.listen(0, "127.0.0.1", resolve); });
  const port = socket.address().port;
  await new Promise((resolve, reject) => socket.close(error => error ? reject(error) : resolve()));
  return port;
}

let server;
const interrupted = signal => { process.stderr.write(`Interrupted (${signal})\n`); process.exitCode = 1; };
const onSignal = signal => { interrupted(signal); void cleanup().finally(() => process.exit(1)); };
async function cleanup() {
  await Promise.all([...children].map(stop));
  await rm(temporary, { recursive: true, force: true });
}
process.once("SIGINT", onSignal); process.once("SIGTERM", onSignal);
try {
  const port = await freePort();
  const api = `http://127.0.0.1:${port}`;
  const config = path.join(temporary, "wrangler.toml");
  const state = path.join(temporary, "state");
  // Explicit local-only config also prevents accidental loading of repository secrets.
  await writeFile(config, `name = "erudior-isolated-api-test"
main = ${JSON.stringify(path.join(worker, "src/index.ts"))}
compatibility_date = "2025-02-01"
workers_dev = false
[[migrations]]
tag = "v1"
new_sqlite_classes = ["LiveRoom"]
[env.dev]
name = "erudior-isolated-api-test-dev"
workers_dev = false
routes = []
[env.dev.vars]
APP_ORIGIN = "http://localhost:5181"
ALLOWED_ORIGINS = "http://localhost:5181"
API_ORIGIN = "https://community.test"
ADMIN_EMAILS = "admin@example.test"
GOOGLE_CLIENT_ID = ""
GITHUB_CLIENT_ID = ""
DEV_LOGIN = "1"
[[env.dev.durable_objects.bindings]]
name = "LIVE"
class_name = "LiveRoom"
[[env.dev.d1_databases]]
binding = "DB"
database_name = "erudior-local-test"
database_id = "00000000-0000-0000-0000-000000000000"
migrations_dir = ${JSON.stringify(path.join(worker, "migrations"))}
[[env.dev.r2_buckets]]
binding = "FILES"
bucket_name = "erudior-local-test"
`);
  const common = ["--config", config, "--env", "dev", "--local", "--persist-to", state];
  await bounded(launch([wrangler, "d1", "migrations", "apply", "erudior-local-test", ...common]), 90_000, "Local migrations");
  server = launch([wrangler, "dev", ...common, "--ip", "127.0.0.1", "--port", String(port), "--inspector-port", "0"]);
  const deadline = Date.now() + 90_000;
  for (;;) {
    if (server.finished || server.failure) throw new Error("Local API exited during startup");
    try {
      const response = await fetch(`${api}/me`, { signal: AbortSignal.timeout(1000) });
      if (response.status === 200) break;
    } catch { /* Wait for the isolated local server, never a remote endpoint. */ }
    if (Date.now() >= deadline) throw new Error("Local API startup timed out after 90s");
    await delay(250);
  }
  await bounded(launch([path.join(worker, "test/api.test.mjs")], { API: api }), 120_000, "Local API regression");
  await bounded(launch([path.join(worker, "test/live.test.mjs")], { API: api }), 120_000, "Local live-room protocol regression");
  console.log("Local API and live-room regressions passed using isolated D1/R2 state.");
} catch (error) {
  if (server) process.stderr.write(server.log);
  console.error(error);
  process.exitCode = 1;
} finally {
  await cleanup();
  process.removeListener("SIGINT", onSignal); process.removeListener("SIGTERM", onSignal);
}
