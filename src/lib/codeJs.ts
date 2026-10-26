// Running one JavaScript test: captured console, input()/prompt() from the test's typed input,
// the function call, and errors with the student's line numbers. Used by the browser worker
// (code.jsworker.ts) and by the course checker in Node, so both judge code the same way.
// `compile` turns a function body into a function taking (input, prompt, console).

import { parser } from "@lezer/javascript";
import type { CodeError, RawResult } from "./code";

export interface JsJob {
  stdin?: string;
  call?: string;
  args?: unknown[];
}

export type Compile = (body: string) => (...a: unknown[]) => unknown;

/** Compiles to an async function, so top-level `await` works and errors arrive in one place. */
export const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (...a: string[]) => (...a: unknown[]) => Promise<unknown>;
export const compileAsync: Compile = (body) => new AsyncFunction("input", "prompt", "console", body);

const OUT_LIMIT = 20000;
export const SOURCE_NAME = "your-code.js";

/** Like a browser console: strings as they are at the top level, everything else as a literal. */
export function inspect(v: unknown, depth = 0, seen: unknown[] = []): string {
  if (typeof v === "string") return depth ? JSON.stringify(v) : v;
  if (v === null || v === undefined || typeof v === "boolean" || typeof v === "number" || typeof v === "bigint") return typeof v === "bigint" ? `${v}n` : String(v);
  if (typeof v === "symbol") return v.toString();
  if (typeof v === "function") return `[Function: ${v.name || "anonymous"}]`;
  if (seen.includes(v)) return "[Circular]";
  if (depth > 4) return Array.isArray(v) ? "[Array]" : "[Object]";
  const next = [...seen, v];
  if (Array.isArray(v)) return `[${v.map((x) => inspect(x, depth + 1, next)).join(", ")}]`;
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (v instanceof Map) return `Map(${v.size}) {${[...v].map(([k, x]) => ` ${inspect(k, depth + 1, next)} => ${inspect(x, depth + 1, next)}`).join(",")}${v.size ? " " : ""}}`;
  if (v instanceof Set) return `Set(${v.size}) {${[...v].map((x) => ` ${inspect(x, depth + 1, next)}`).join(",")}${v.size ? " " : ""}}`;
  const entries = Object.entries(v as object);
  if (!entries.length) return "{}";
  return `{ ${entries.map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${inspect(x, depth + 1, next)}`).join(", ")} }`;
}

/** A returned value as JSON-like data for comparing with the test's `expect`. */
export function plain(v: unknown, depth = 0): unknown {
  if (v === null || typeof v === "boolean" || typeof v === "string") return v;
  if (typeof v === "number") return Number.isFinite(v) ? v : { $repr: String(v) };
  if (v === undefined) return undefined;
  if (depth > 40) return { $repr: "..." };
  if (Array.isArray(v)) return v.map((x) => (x === undefined ? null : plain(x, depth + 1)));
  if (v instanceof Map) return Object.fromEntries([...v].map(([k, x]) => [String(k), plain(x, depth + 1)]));
  if (v instanceof Set) return [...v].map((x) => plain(x, depth + 1));
  if (typeof v === "object") return Object.fromEntries(Object.entries(v as object).map(([k, x]) => [k, plain(x, depth + 1)]));
  return { $repr: inspect(v, 1) };
}

const STACK_LINE = new RegExp(`${SOURCE_NAME.replace(".", "\\.")}:(\\d+)`);
const offsets = new WeakMap<Compile, number>();

/** Lines the engine adds in front of a compiled body (2 in Chrome), found by throwing from a
 * probe instead of assuming one engine. */
async function lineOffset(compile: Compile): Promise<number> {
  const known = offsets.get(compile);
  if (known !== undefined) return known;
  let off = 0;
  try {
    await compile(`throw new Error("probe")\n//# sourceURL=${SOURCE_NAME}`)();
  } catch (e) {
    const m = STACK_LINE.exec(String((e as Error).stack));
    off = m ? Number(m[1]) - 1 : 0;
  }
  offsets.set(compile, off);
  return off;
}

/** The student's line from an error's stack, if it's in their code. */
function errorLine(e: unknown, offset: number, lines: number): number | undefined {
  const m = STACK_LINE.exec(String((e as { stack?: string })?.stack ?? ""));
  const raw = m ? Number(m[1]) - offset : undefined;
  return raw !== undefined && raw >= 1 && raw <= lines ? raw : undefined;
}

/** Where a syntax error is: some engines (Chrome) don't say for compiled code, so parse it. */
export function syntaxErrorLine(code: string): number | undefined {
  let at = -1;
  parser.parse(code).iterate({
    enter: (n) => {
      if (at < 0 && n.type.isError) at = n.from;
      return at < 0;
    },
  });
  return at < 0 ? undefined : code.slice(0, at).split("\n").length;
}

export function toCodeError(e: unknown, offset: number, code: string): CodeError {
  const lines = code.split("\n").length;
  if (e instanceof Error || (typeof e === "object" && e !== null && "message" in e)) {
    const err = e as Error;
    const line = errorLine(e, offset, lines) ??(err.name === "SyntaxError" ? syntaxErrorLine(code) : undefined);
    return { type: err.name || "Error", message: String(err.message), line };
  }
  return { type: "Error", message: `Your code threw ${inspect(e, 1)}` };
}

/** Run the program once (and call its function, if the test does). */
export async function runJsJob(code: string, job: JsJob, compile: Compile): Promise<RawResult> {
  let stdout = "";
  const write = (s: string) => {
    if (stdout.length < OUT_LIMIT) stdout += s.slice(0, OUT_LIMIT - stdout.length);
  };
  const log = (...a: unknown[]) => write(a.map((x) => inspect(x)).join(" ") + "\n");
  const con = { log, info: log, debug: log, warn: log, error: log, table: log, dir: log, trace: log, assert: (c: unknown, ...a: unknown[]) => c || log("Assertion failed:", ...a) };
  const lines = (job.stdin ?? "").replace(/\r\n?/g, "\n").split("\n");
  if (lines.length && lines[lines.length - 1] === "") lines.pop();
  // input() works like Python's: shows the question, returns the next typed line.
  const input = (q?: unknown) => {
    if (q !== undefined) write(String(q));
    if (!lines.length) {
      const e = new Error("The program asked for more input than was typed in.");
      e.name = "EOFError";
      throw e;
    }
    return lines.shift()!;
  };
  const prompt = (q?: unknown) => (lines.length ? input(q) : null);
  const res: RawResult = { stdout: "" };
  const offset = await lineOffset(compile);
  try {
    const tail = job.call ? `\n;return typeof ${job.call} === "function" ? ${job.call} : undefined;` : "";
    const fn = compile(`${code}${tail}\n//# sourceURL=${SOURCE_NAME}`);
    let target = fn(input, prompt, con);
    if (target instanceof Promise) target = await target;
    if (job.call) {
      if (typeof target !== "function") res.error = { type: "MissingFunction", message: `Your code needs a function named ${job.call}().` };
      else {
        let v = (target as (...a: unknown[]) => unknown)(...(job.args ?? []));
        if (v instanceof Promise) v = await v;
        res.hasValue = true;
        res.value = plain(v);
        res.repr = inspect(v, 1).slice(0, 2000);
      }
    }
    // Let timers that were set for "right away" print too.
    await new Promise((r) => setTimeout(r, 0));
  } catch (e) {
    res.error = toCodeError(e, offset, code);
  }
  res.stdout = stdout;
  return res;
}
