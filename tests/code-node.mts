// Runs code exercises outside the browser, for the course checker and tests: JavaScript in a
// worker thread (stopped after the time limit, like the app's Web Worker) with the app's own
// harness (src/lib/codeJs.ts); Python with the system's python3 and the app's Python harness
// (PY_HARNESS), so it's judged like Pyodide judges it. Python is skipped when python3 is missing.
import { spawnSync } from "node:child_process";
import { Worker } from "node:worker_threads";
import { PY_HARNESS, type RawResult } from "../src/lib/code.ts";
import type { JsJob } from "../src/lib/codeJs.ts";

let python: string | null | undefined;
export function pythonPath(): string | null {
  if (python !== undefined) return python;
  for (const p of ["python3", "python"]) {
    const r = spawnSync(p, ["-c", "import sys; print(sys.version_info[0])"], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim() === "3") return (python = p);
  }
  return (python = null);
}

const PY_DRIVER = `
import sys, json
job = json.loads(sys.stdin.read())
sys.stdin = None
print("\\x00" + __erudior_run(job["code"], job.get("stdin"), job.get("call"), json.dumps(job.get("args", []))))
`;

/** Each job in its own python3 process (-I: no user site, no script folder on the path). */
export function runPythonNode(code: string, jobs: JsJob[], timeLimitSec: number): RawResult[] | null {
  const py = pythonPath();
  if (!py) return null;
  const out: RawResult[] = [];
  let stuck = false;
  for (const job of jobs) {
    if (stuck) {
      out.push({ stdout: "", skipped: true });
      continue;
    }
    const r = spawnSync(py, ["-I", "-c", PY_HARNESS + PY_DRIVER], {
      input: JSON.stringify({ code, ...job }),
      encoding: "utf8",
      timeout: timeLimitSec * 1000 + 1000,
    });
    if (r.error || r.signal) {
      stuck = true;
      out.push({ stdout: "", timedOut: true });
      continue;
    }
    const line = r.stdout.split("\x00").pop() ?? "";
    try {
      out.push(JSON.parse(line) as RawResult);
    } catch {
      out.push({ stdout: r.stdout, error: { type: "HarnessError", message: r.stderr.slice(0, 400) } });
    }
  }
  return out;
}

/** All jobs in one worker thread; a job that runs past the limit stops the worker. */
export function runJsNode(code: string, jobs: JsJob[], timeLimitSec: number): Promise<RawResult[]> {
  return new Promise((resolve) => {
    const out: RawResult[] = [];
    const w = new Worker(new URL("./code-node-worker.mts", import.meta.url), { workerData: { code, jobs } });
    let timer: NodeJS.Timeout;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        w.terminate();
        out.push({ stdout: "", timedOut: true });
        while (out.length < jobs.length) out.push({ stdout: "", skipped: true });
        resolve(out);
      }, timeLimitSec * 1000);
    };
    arm();
    w.on("message", (m: RawResult) => {
      out.push(m);
      if (out.length === jobs.length) {
        clearTimeout(timer);
        w.terminate();
        resolve(out);
      } else arm();
    });
    w.on("error", (e) => {
      clearTimeout(timer);
      out.push({ stdout: "", error: { type: "HarnessError", message: String(e) } });
      while (out.length < jobs.length) out.push({ stdout: "", skipped: true });
      resolve(out);
    });
  });
}
