// Running students' code in the browser, away from the page: JavaScript in a fresh Web Worker per
// run, Python in one Pyodide worker that's loaded on first use and kept. A run that goes past the
// time limit is stopped (the JavaScript worker is ended; Python is interrupted when the page is
// cross-origin isolated, otherwise its worker is ended and Python reloads on the next run).
//
// Where Python comes from: Pyodide's core (about 6 MB to download, 13 MB unpacked) is loaded from
// jsDelivr at a pinned version, by the website and the desktop app alike, so it's fetched only by
// people who run Python and then served from the browser cache. Bundling it would add 13 MB to
// every installer and deploy for a feature most courses don't use. VITE_PYODIDE_URL points
// elsewhere (a self-hosted copy of the npm package's files) if that changes.

import type { RawResult } from "./code";
import type { CodeLang } from "./code";
import type { JsJob } from "./codeJs";

export const PYODIDE_VERSION = "314.0.7";
export const PYODIDE_URL: string = (import.meta.env?.VITE_PYODIDE_URL as string | undefined) || `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VERSION}/`;
export const PYTHON_DOWNLOAD_MB = 6;

export type RunStatus = "loading" | "restarting" | "running";

/** What to tell the student while code runs. */
export const statusLine = (s: RunStatus, lang: CodeLang) =>
  s === "loading"
    ? `Loading Python (one-time download, about ${PYTHON_DOWNLOAD_MB} MB)…`
    : s === "restarting"
      ? "Restarting Python…"
      : `Running your ${lang === "python" ? "Python" : "JavaScript"}…`;

export const LOAD_TEXT =
  "Python couldn't be loaded. The first time Python is used it needs an internet connection; check the connection and try again.";

export class PythonLoadError extends Error {}

interface PyHandle {
  worker: Worker;
  ready: Promise<void>;
  isReady: boolean;
  interrupt?: Int32Array;
}

let py: PyHandle | null = null;
let pyLoadedOnce = false;
let pyQueue: Promise<unknown> = Promise.resolve();

function startPython(): PyHandle {
  const worker = new Worker(new URL("./code.pyworker.ts", import.meta.url), { type: "module" });
  // A shared flag lets an endless loop be stopped without throwing Python away; browsers only
  // allow it on cross-origin isolated pages.
  const interrupt =
    typeof SharedArrayBuffer !== "undefined" && (globalThis as { crossOriginIsolated?: boolean }).crossOriginIsolated
      ? new Int32Array(new SharedArrayBuffer(4))
      : undefined;
  const h: PyHandle = { worker, isReady: false, interrupt, ready: Promise.resolve() };
  h.ready = new Promise<void>((resolve, reject) => {
    const onMsg = (e: MessageEvent<{ type: string; message?: string }>) => {
      if (e.data.type === "ready") {
        worker.removeEventListener("message", onMsg);
        h.isReady = true;
        pyLoadedOnce = true;
        resolve();
      } else if (e.data.type === "error") {
        worker.removeEventListener("message", onMsg);
        reject(new PythonLoadError(e.data.message));
      }
    };
    worker.addEventListener("message", onMsg);
    worker.addEventListener("error", (e) => reject(new PythonLoadError(e.message || "The Python worker didn't start.")));
  });
  h.ready.catch(() => {
    if (py === h) py = null;
    worker.terminate();
  });
  worker.postMessage({ type: "init", indexURL: PYODIDE_URL, interrupt });
  return h;
}

/** Is Python loaded and waiting? */
export const pythonReady = () => !!py?.isReady;

/** Start loading Python now (e.g. when a Python exercise opens), so it's ready by the first run. */
export function preloadPython(onStatus?: (s: RunStatus) => void): Promise<void> {
  if (!py) {
    onStatus?.(pyLoadedOnce ? "restarting" : "loading");
    py = startPython();
  } else if (!py.isReady) onStatus?.("loading");
  return py.ready;
}

function stopPython() {
  py?.worker.terminate();
  py = null;
}

/** Collect one result per job from a worker, arming a timer per job. */
function collect(
  worker: Worker,
  n: number,
  limitMs: number,
  /** Try to stop the job without ending the worker (its result then arrives as timed out). */
  soft: (() => Promise<void>) | null,
  /** End the worker. */
  hard: () => void,
  match:(data: unknown) => { i?: number; result?: RawResult; done?: boolean } | null,
): Promise<RawResult[]> {
  return new Promise((resolve) => {
    const out: RawResult[] = [];
    let timer: number | undefined;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      worker.removeEventListener("message", onMsg);
      while (out.length < n) out.push({ stdout: "", skipped: true });
      resolve(out);
    };
    const arm = (ms: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(async () => {
        const at = out.length;
        if (soft) await soft();
        if (!finished && out.length === at) {
          hard();
          out.push({ stdout: "", timedOut: true });
          finish();
        }
      }, ms);
    };
    const onMsg = (e: MessageEvent) => {
      const m = match(e.data);
      if (!m) return;
      if (m.result) {
        out.push(m.result);
        if (out.length < n) arm(limitMs);
      }
      if (m.done || out.length >= n) finish();
    };
    worker.addEventListener("message", onMsg);
    arm(limitMs + 1000); // the first job also covers the worker starting up
  });
}

/**
 * Run a program once per job (each job: typed input, and maybe a function call). Resolves with a
 * result per job; a job that times out is marked, and the ones after it are skipped.
 * Throws PythonLoadError when Python can't be loaded (offline on first use, blocked network).
 */
export async function runCode(lang: CodeLang, code: string, jobs: JsJob[], opts: { timeLimitSec: number; onStatus?: (s: RunStatus) => void }): Promise<RawResult[]> {
  const limitMs = opts.timeLimitSec * 1000;
  if (lang === "javascript") {
    opts.onStatus?.("running");
    const worker = new Worker(new URL("./code.jsworker.ts", import.meta.url), { type: "module" });
    try {
      const results = collect(worker, jobs.length, limitMs, null, () => worker.terminate(), (d) => {
        const m = d as { i?: number; result?: RawResult; done?: boolean };
        return "result" in m || "done" in m ? m : null;
      });
      worker.postMessage({ code, jobs });
      return await results;
    } finally {
      worker.terminate();
    }
  }
  // Python: one run at a time through the shared worker.
  const task = pyQueue.then(async () => {
    await preloadPython(opts.onStatus);
    opts.onStatus?.("running");
    const h = py!;
    const results = collect(
      h.worker,
      jobs.length,
      limitMs,
      h.interrupt
        ? async () => {
            Atomics.store(h.interrupt!, 0, 2); // SIGINT: Python raises KeyboardInterrupt
            await new Promise((r) => window.setTimeout(r, 1500));
          }
        : null,
      () => {
        if (py === h) stopPython();
      },
      (d) => {
        const m = d as { type?: string; i?: number; result?: RawResult };
        return m.type === "result" ? { i: m.i, result: m.result } : m.type === "done" ? { done: true } : null;
      },
    );
    h.worker.postMessage({ type: "run", code, jobs });
    return results;
  });
  pyQueue = task.catch(() => {});
  return task;
}
