// Web Worker that runs a student's JavaScript (one worker per run; the page stops it after the
// time limit, which is what ends an endless loop). Before any student code runs, everything that
// could reach the app's saved data or the network is removed from this worker: a worker shares
// the app's origin, so IndexedDB (where the web version keeps progress) would otherwise be open
// to it. There is no DOM in a worker.
import { compileAsync, runJsJob, type JsJob } from "./codeJs";

const post = self.postMessage.bind(self);

const BLOCKED = [
  "indexedDB",
  "caches",
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "WebSocketStream",
  "WebTransport",
  "EventSource",
  "importScripts",
  "Worker",
  "SharedWorker",
  "BroadcastChannel",
  "navigator",
  "cookieStore",
  "postMessage",
  "close",
];

// Remove each name everywhere on the global object's prototype chain; where a property can't be
// deleted, pin it to undefined.
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

self.addEventListener("message", async (e: MessageEvent<{ code: string; jobs: JsJob[] }>) => {
  const { code, jobs } = e.data;
  for (let i = 0; i < jobs.length; i++) post({ i, result: await runJsJob(code, jobs[i], compileAsync) });
  post({ done: true });
});

post({ ready: true });
