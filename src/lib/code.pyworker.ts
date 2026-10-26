// Web Worker that runs Python with Pyodide. It's started the first time Python is needed and
// kept for later runs (loading Python takes a few seconds). Pyodide comes from `indexURL` (a
// pinned jsDelivr address, see codeRun.ts). After it loads, the network and the app's storage are
// removed from this worker, as in code.jsworker.ts, and Python's `js` bridge is closed off.
import { PY_HARNESS } from "./code";

interface Init {
  type: "init";
  indexURL: string;
  /** Shared flag for stopping an endless loop without restarting (cross-origin isolated pages only). */
  interrupt?: Int32Array;
}
interface Run {
  type: "run";
  code: string;
  jobs: { stdin?: string; call?: string; args?: unknown[] }[];
}

interface Pyodide {
  runPython(src: string): unknown;
  globals: { get(name: string): (...a: unknown[]) => string };
  setInterruptBuffer(buf: Int32Array): void;
}

const post = self.postMessage.bind(self);
let run: ((...a: unknown[]) => string) | null = null;
let interrupt: Int32Array | undefined;

const BLOCKED = ["indexedDB", "caches", "fetch", "XMLHttpRequest", "WebSocket", "WebSocketStream", "WebTransport", "EventSource", "importScripts", "Worker", "SharedWorker", "BroadcastChannel", "navigator", "cookieStore", "postMessage", "close"];

function lockDown() {
  for (const name of BLOCKED) {
    for (let o: object | null = self; o; o = Object.getPrototypeOf(o)) {
      if (!Object.prototype.hasOwnProperty.call(o, name)) continue;
      try {
        delete (o as Record<string, unknown>)[name];
      } catch {
        /* not configurable */
      }
      if (Object.prototype.hasOwnProperty.call(o, name)) {
        try {
          Object.defineProperty(o, name, { value: undefined, writable: false, configurable: false });
        } catch {
          /* leave it */
        }
      }
    }
  }
}

async function init(m: Init) {
  try {
    const mod = (await import(/* @vite-ignore */ `${m.indexURL}pyodide.mjs`)) as { loadPyodide(o: object): Promise<Pyodide> };
    const py = await mod.loadPyodide({ indexURL: m.indexURL, stdout: () => {}, stderr: () => {} });
    py.runPython(PY_HARNESS);
    // Student code can't import the bridge to JavaScript (the worker is locked down anyway).
    py.runPython("import sys\nfor _m in ('js', 'pyodide_js'):\n    sys.modules[_m] = None\ndel _m");
    if (m.interrupt) {
      interrupt = m.interrupt;
      py.setInterruptBuffer(m.interrupt);
    }
    run = py.globals.get("__erudior_run");
    lockDown();
    post({ type: "ready" });
  } catch (e) {
    post({ type: "error", message: String((e as Error)?.message ?? e) });
  }
}

function runJobs(m: Run) {
  let stopped = false;
  m.jobs.forEach((job, i) => {
    // After an endless loop was interrupted, the later tests would most likely loop too.
    if (stopped) return post({ type: "result", i, result: { stdout: "", skipped: true } });
    if (interrupt) interrupt[0] = 0;
    let result;
    try {
      result = JSON.parse(run!(m.code, job.stdin ?? "", job.call ?? undefined, JSON.stringify(job.args ?? [])));
    } catch (e) {
      result = { stdout: "", error: { type: "Error", message: String((e as Error)?.message ?? e) } };
    }
    if (result.timedOut) stopped = true;
    post({ type: "result", i, result });
  });
  post({ type: "done" });
}

self.addEventListener("message", (e: MessageEvent<Init | Run>) => {
  if (e.data.type === "init") init(e.data);
  else if (e.data.type === "run") runJobs(e.data);
});
