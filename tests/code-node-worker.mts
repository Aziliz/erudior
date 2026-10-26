// Worker thread for tests/code-node.mts: runs JavaScript jobs with the app's harness.
import { parentPort, workerData } from "node:worker_threads";
import { compileAsync, runJsJob, type JsJob } from "../src/lib/codeJs.ts";

const { code, jobs } = workerData as { code: string; jobs: JsJob[] };
for (const job of jobs) parentPort!.postMessage(await runJsJob(code, job, compileAsync));
