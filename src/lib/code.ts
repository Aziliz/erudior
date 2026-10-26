// Code exercises (Computer Science): the exercise format, how a run is judged against its tests,
// the "Run" stamp stored in a question's answer, and ```code lesson blocks. Pure functions only
// (no DOM, no workers), so the course checker and tests use the same rules as the app.
// Running code lives in codeRun.ts (browser workers); the editor in codeEditor.ts.

export type CodeLang = "python" | "javascript";

export const LANG_NAMES: Record<CodeLang, string> = { python: "Python", javascript: "JavaScript" };

/** One automatic check. A call test calls a function with `args` and compares what it returns
 * with `expect`; an output test runs the program (with `stdin` as typed input) and compares
 * what it printed with `stdout`. A test can do both. */
export interface CodeTest {
  name?: string;
  /** Function to call (defaults to the exercise's `function`). */
  call?: string;
  args?: unknown[];
  /** The value the call must return (any JSON; null is Python's None). Present = checked. */
  expect?: unknown;
  /** Lines typed in for input() (and prompt() in JavaScript), joined with newlines. */
  stdin?: string;
  /** What the program must print (trailing spaces and blank lines at the end are ignored). */
  stdout?: string;
  /** Not shown to the student: only "passed" or "failed" is reported. */
  hidden?: boolean;
  /** Numbers may differ by this much (default: tiny rounding differences only). */
  tolerance?: number;
}

export interface CodeSpec {
  language: CodeLang;
  starter: string;
  /** Model solution: shown after a correct answer or on request after checking. */
  solution?: string;
  /** Function the call tests call, unless a test names its own. */
  function?: string;
  tests: CodeTest[];
  hints?: string[];
  /** Seconds each test may run before it's stopped (an endless loop). Default 5. */
  timeLimit?: number;
}

export const DEFAULT_TIME_LIMIT = 5;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export function readLang(v: unknown): CodeLang | null {
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "python" || s === "py" || s === "python3") return "python";
  if (s === "javascript" || s === "js") return "javascript";
  return null;
}

const IDENT: Record<CodeLang, RegExp> = { python: /^[A-Za-z_][A-Za-z0-9_]*$/, javascript: /^[A-Za-z_$][A-Za-z0-9_$]*$/ };

/** stdin may be written as one string or a list of lines. */
function readStdin(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (Array.isArray(v)) return v.map((x) => String(x)).join("\n") + "\n";
  return String(v);
}

/**
 * Check and tidy a question's `code` object. Throws an Error whose message continues
 * "Question 3 …" (the same style as the other question kinds).
 */
export function normalizeCodeSpec(raw: unknown): CodeSpec {
  if (!isObj(raw)) throw new Error(`(code) needs a "code" object with "language" and "tests".`);
  const language = readLang(raw.language);
  if (!language) throw new Error(`(code) needs "language": "python" or "javascript".`);
  const fn = raw.function === undefined ? undefined : String(raw.function).trim();
  if (fn !== undefined && !IDENT[language].test(fn)) throw new Error(`(code) has a "function" name that isn't a valid ${LANG_NAMES[language]} name ("${fn}").`);
  if (!Array.isArray(raw.tests) || !raw.tests.length) throw new Error(`(code) needs "tests": a list of checks to run.`);
  const tests = raw.tests.map((t, i): CodeTest => {
    const where = `(code) test ${i + 1}`;
    if (!isObj(t)) throw new Error(`${where} isn't an object.`);
    const out: CodeTest = {};
    if (typeof t.name === "string" && t.name.trim()) out.name = t.name.trim();
    const hasExpect = "expect" in t;
    if (t.args !== undefined && !Array.isArray(t.args)) throw new Error(`${where} has "args" that isn't a list (write [3] for one argument).`);
    if (hasExpect || t.args !== undefined || t.call !== undefined) {
      const call = t.call === undefined ? fn : String(t.call).trim();
      if (!call) throw new Error(`${where} calls a function, but neither the test ("call") nor the exercise ("function") names it.`);
      if (!IDENT[language].test(call)) throw new Error(`${where} has a "call" name that isn't a valid ${LANG_NAMES[language]} name ("${call}").`);
      if (t.call !== undefined) out.call = call;
      out.args = Array.isArray(t.args) ? t.args : [];
      if (hasExpect) out.expect = t.expect;
    }
    const stdin = readStdin(t.stdin);
    if (stdin !== undefined) out.stdin = stdin;
    if (t.stdout !== undefined) out.stdout = String(t.stdout);
    if (!hasExpect && out.stdout === undefined) throw new Error(`${where} checks nothing: give "expect" (what the function returns) or "stdout" (what the program prints).`);
    if (t.hidden === true) out.hidden = true;
    if (t.tolerance !== undefined) {
      const tol = Number(t.tolerance);
      if (!(tol >= 0)) throw new Error(`${where} has a "tolerance" that isn't a number of 0 or more.`);
      out.tolerance = tol;
    }
    return out;
  });
  if (tests.every((t) => t.hidden)) throw new Error(`(code) needs at least one test that isn't hidden, so the student can see what's expected.`);
  const spec: CodeSpec = { language, starter: typeof raw.starter === "string" ? raw.starter : "", tests };
  if (typeof raw.solution === "string" && raw.solution.trim()) spec.solution = raw.solution;
  if (fn) spec.function = fn;
  if (Array.isArray(raw.hints)) {
    const hints = raw.hints.map((h) => String(h).trim()).filter(Boolean);
    if (hints.length) spec.hints = hints;
  }
  if (raw.timeLimit !== undefined) {
    const s = Number(raw.timeLimit);
    if (!(s >= 1 && s <= 30)) throw new Error(`(code) has a "timeLimit" outside 1–30 seconds.`);
    spec.timeLimit = s;
  }
  return spec;
}

/** The function a test calls, or undefined for an output-only test. */
export const testCall = (spec: Pick<CodeSpec, "function">, t: CodeTest): string | undefined =>
  t.args !== undefined || "expect" in t ? (t.call ?? spec.function) : undefined;

// ---- What a run produces, and judging it -------------------------------------------------

export interface CodeError {
  /** Python exception class or JavaScript error name ("TypeError", "SyntaxError"…). */
  type: string;
  message: string;
  /** Line in the student's code, when known. */
  line?: number;
  /** Python: the student's own frames ("Line 4, in double: return n * 2"), innermost last. */
  trace?: string[];
}

/** One test run, straight from a worker (or the checker). */
export interface RawResult {
  stdout: string;
  /** The returned value as plain JSON-like data (call tests). */
  value?: unknown;
  hasValue?: boolean;
  /** The returned value written the way the language would show it. */
  repr?: string;
  error?: CodeError;
  /** Stopped after the time limit. */
  timedOut?: boolean;
  /** Not run, because an earlier test took too long. */
  skipped?: boolean;
}

export interface TestOutcome {
  ok: boolean;
  /** Short label: the call ("double(3)"), the test's name, or "Output". */
  label: string;
  hidden: boolean;
  expected?: string;
  actual?: string;
  expectedOut?: string;
  actualOut?: string;
  /** Friendly explanation of an error or a stop. */
  problem?: string;
  error?: CodeError;
}

/** Trailing spaces on each line and blank lines at the end don't count; Windows line ends don't either. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}

/** Deep equality of JSON-like values; numbers within `tol` (relative for big numbers). */
export function sameValue(a: unknown, b: unknown, tol?: number): boolean {
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) || Number.isNaN(b)) return Number.isNaN(a) && Number.isNaN(b);
    const t = tol ?? 1e-9;
    return a === b || Math.abs(a - b) <= t * (tol === undefined ? Math.max(1, Math.abs(a), Math.abs(b)) : 1);
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => sameValue(x, b[i], tol));
  }
  if (isObj(a) && isObj(b)) {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    return ka.length === kb.length && ka.every((k, i) => k === kb[i] && sameValue(a[k], b[k], tol));
  }
  return a === b;
}

const pyStr = (s: string) => `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\t/g, "\\t")}'`;

/** A JSON value written as a literal in the language (for "Expected" lines). */
export function literal(v: unknown, lang: CodeLang): string {
  if (v === null || v === undefined) return lang === "python" ? "None" : String(v);
  if (typeof v === "boolean") return lang === "python" ? (v ? "True" : "False") : String(v);
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return lang === "python" ? pyStr(v) : JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map((x) => literal(x, lang)).join(", ")}]`;
  if (isObj(v)) {
    if (typeof v.$repr === "string" && Object.keys(v).length === 1) return v.$repr;
    const parts = Object.entries(v).map(([k, x]) =>
      lang === "python" ? `${pyStr(k)}: ${literal(x, lang)}` : `${IDENT.javascript.test(k) ? k : JSON.stringify(k)}: ${literal(x, lang)}`,
    );
    return lang === "python" ? `{${parts.join(", ")}}` : parts.length ? `{ ${parts.join(", ")} }` : "{}";
  }
  return String(v);
}

/** How a call test reads: double(3), greet('Ada'). */
export function callLabel(name: string, args: unknown[], lang: CodeLang): string {
  return `${name}(${args.map((a) => literal(a, lang)).join(", ")})`;
}

/** Plain-language advice for common errors (students are often children). */
const TIPS: Record<CodeLang, Record<string, string>> = {
  python: {
    SyntaxError: "Python couldn't read this line. Look for a missing colon, bracket or quote mark.",
    IndentationError: "The spaces at the start of a line don't line up. Lines inside an if, for, while or def need the same indent.",
    TabError: "Mixing tabs and spaces confuses Python. Use spaces only.",
    NameError: "Python doesn't know this name. Check the spelling (capital letters count) and that it's set before it's used.",
    TypeError: "A value is the wrong kind for what you're doing with it, like adding a number to text. str() and int() change kinds.",
    ValueError: "The value has the right kind but won't work here, like int('hello').",
    ZeroDivisionError: "Something is being divided by zero.",
    IndexError: "The list doesn't have an item at that position. Positions start at 0, and the last one is len(list) - 1.",
    KeyError: "The dictionary doesn't have that key.",
    AttributeError: "That kind of value doesn't have this method or property. Check the spelling.",
    RecursionError: "The function keeps calling itself and never stops. Check the case that should end it.",
    EOFError: "The program asked for more input() than this test types in.",
    ModuleNotFoundError: "That module isn't available here. Only Python's built-in modules can be used.",
    ImportError: "That module isn't available here. Only Python's built-in modules can be used.",
    MissingFunction: "Keep the function's name exactly as the exercise gives it.",
  },
  javascript: {
    SyntaxError: "JavaScript couldn't read this. Look for a missing bracket, brace, quote mark or comma.",
    ReferenceError: "JavaScript doesn't know this name. Check the spelling (capital letters count) and that it's declared before it's used.",
    TypeError: "A value is the wrong kind for what you're doing with it, like calling something that isn't a function, or reading a property of undefined.",
    RangeError: "A number is out of range. \"Maximum call stack size exceeded\" means a function keeps calling itself and never stops.",
    EOFError: "The program asked for more input than this test types in.",
    MissingFunction: "Keep the function's name exactly as the exercise gives it.",
  },
};

export function errorTip(lang: CodeLang, type: string): string | undefined {
  return TIPS[lang][type];
}

/** "Line 3: TypeError: …" */
export function errorHeadline(e: CodeError): string {
  const what = e.type === "MissingFunction" ? e.message : `${e.type}: ${e.message}`;
  return e.line ? `Line ${e.line}: ${what}` : what;
}

export const timeoutText = (seconds: number) =>
  `Stopped after ${seconds} second${seconds === 1 ? "" : "s"}. Is there a loop that never ends?`;

/** Compare one run with its test. */
export function judge(spec: CodeSpec, t: CodeTest, r: RawResult): TestOutcome {
  const lang = spec.language;
  const call = testCall(spec, t);
  const label = t.name ?? (call ? callLabel(call, t.args ?? [], lang) : t.stdin ? "Output with typed input" : "Output");
  const out: TestOutcome = { ok: false, label, hidden: !!t.hidden };
  if ("expect" in t) out.expected = literal(t.expect, lang);
  if (t.stdout !== undefined) out.expectedOut = normalizeOutput(t.stdout);
  out.actualOut = normalizeOutput(r.stdout ?? "");
  if (r.skipped) {
    out.problem = "Not run, because an earlier check took too long.";
    return out;
  }
  if (r.timedOut) {
    out.problem = timeoutText(spec.timeLimit ?? DEFAULT_TIME_LIMIT);
    return out;
  }
  if (r.error) {
    out.error = r.error;
    out.problem = errorHeadline(r.error);
    return out;
  }
  let ok = true;
  if ("expect" in t) {
    out.actual = r.repr ?? literal(r.value, lang);
    if (!r.hasValue || !sameValue(t.expect ?? null, r.value === undefined ? (lang === "python" ? null : undefined) : r.value, t.tolerance)) ok = false;
  }
  if (t.stdout !== undefined && out.expectedOut !== out.actualOut) ok = false;
  out.ok = ok;
  return out;
}

// ---- The answer stamp ------------------------------------------------------------------------

/** A short hash of code (trailing spaces ignored), so a stamp goes stale when the code changes. */
export function codeHash(code: string): string {
  const s = code.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").replace(/\n+$/, "");
  let h1 = 5381,
    h2 = 52711;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = ((h1 * 33) ^ c) >>> 0;
    h2 = ((h2 * 31) ^ c) >>> 0;
  }
  return h1.toString(36) + h2.toString(36);
}

/**
 * A code question's answer is `[code]` while editing, and `[code, stamp]` after its tests run:
 * "pass:<hash>:3/3" or "fail:<hash>:1/3". The stamp only counts while the hash still matches the
 * code, so grading stays a plain synchronous check (isCorrect) like every other kind, and it
 * survives save-and-resume.
 */
export function makeStamp(code: string, passed: number, total: number): string {
  return `${passed === total ? "pass" : "fail"}:${codeHash(code)}:${passed}/${total}`;
}

export interface Stamp {
  pass: boolean;
  passed: number;
  total: number;
}

/** The stamp on an answer, if it matches the code in it. */
export function readStamp(chosen: (string | number)[] | undefined): Stamp | null {
  const code = chosen?.[0];
  const stamp = chosen?.[1];
  if (typeof code !== "string" || typeof stamp !== "string") return null;
  const m = /^(pass|fail):([a-z0-9]+):(\d+)\/(\d+)$/.exec(stamp);
  if (!m || m[2] !== codeHash(code)) return null;
  return { pass: m[1] === "pass", passed: Number(m[3]), total: Number(m[4]) };
}

// ---- ```code lesson blocks -------------------------------------------------------------------

/** A runnable example in a lesson: ```code python (or js), optionally `readonly`. */
export interface CodeBlock {
  language: CodeLang | null;
  source: string;
  /** Text typed in for input(), from a `--- input ---` line in the block. */
  stdin?: string;
  readonly: boolean;
  problems: string[];
}

/** A whole ```code block at the start of a line; group 1 is the info string, 2 the body. */
export const CODE_BLOCK = /^```code\b([^\n]*)\r?\n([\s\S]*?)^```[ \t]*$/gm;

const INPUT_LINE = /^-{3,}\s*input\s*-{3,}[ \t]*$/im;

export function parseCodeBlock(info: string, body: string): CodeBlock {
  const problems: string[] = [];
  const toks = info.trim().split(/\s+/).filter(Boolean);
  const language = readLang(toks[0]);
  if (!toks.length) problems.push("no language (write ```code python or ```code js)");
  else if (!language) problems.push(`unknown language "${toks[0]}" (python or js)`);
  let readonly = false;
  for (const tok of toks.slice(1)) {
    if (tok.toLowerCase() === "readonly") readonly = true;
    else problems.push(`unknown option "${tok}" (only readonly is understood)`);
  }
  let source = body.replace(/\r\n?/g, "\n");
  let stdin: string | undefined;
  const m = INPUT_LINE.exec(source);
  if (m) {
    stdin = source.slice(m.index + m[0].length).replace(/^\n/, "");
    source = source.slice(0, m.index);
  }
  source = source.replace(/\n+$/, "\n");
  if (!source.trim()) problems.push("no code");
  return { language, source, stdin, readonly, problems };
}

export function findCodeBlocks(md: string): CodeBlock[] {
  return [...md.matchAll(CODE_BLOCK)].map((m) => parseCodeBlock(m[1], m[2]));
}

export function codeBlockProblems(md: string): string[] {
  const blocks = findCodeBlocks(md);
  const unclosed = (md.match(/^```code\b/gm) ?? []).length - blocks.length;
  const out = blocks.flatMap((b, i) => b.problems.map((p) => `code block ${i + 1}: ${p}`));
  if (unclosed > 0) out.push("a ```code block is never closed with ```");
  return out;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Does a program read typed input? (Then the block offers an input box.) */
export const readsInput = (src: string, lang: CodeLang) => (lang === "python" ? /\binput\s*\(/ : /\b(input|prompt)\s*\(/).test(src);

/**
 * The static HTML of a code block: the code in a <pre>, readable and printable without
 * JavaScript (prerendered pages). The Markdown component turns it into an editor with a Run
 * button (codeBlocks.ts). Built from escaped text only.
 */
export function renderCodeBlock(b: CodeBlock, key: string): string {
  const lang = b.language ?? "python";
  const attrs =
    `class="code-block" data-code-lang="${lang}" data-code-key="${esc(key)}"` +
    (b.readonly ? ` data-code-readonly=""` : "") +
    (b.stdin !== undefined ? ` data-code-stdin="${esc(b.stdin)}"` : "");
  return (
    `<figure ${attrs}>` +
    `<figcaption class="code-head"><span class="code-lang">${LANG_NAMES[lang]}</span></figcaption>` +
    `<pre class="code-src"><code>${esc(b.source)}</code></pre>` +
    `</figure>`
  );
}

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/**
 * Swap code blocks (and other code fences and `code spans`, which are never math) for
 * placeholders before Markdown and math run; `restore` puts them back after sanitizing.
 */
export function protectCode(src: string): { text: string; restore: (html: string) => string } {
  if (!src.includes("`")) return { text: src, restore: (h) => h };
  const out: string[] = [];
  const slot = (html: string, block: boolean) => {
    out.push(html);
    const tag = `XCODEX${out.length - 1}XCODEX`;
    return block ? `\n\n${tag}\n\n` : tag;
  };
  let text = src.replace(CODE_BLOCK, (whole, info: string, body: string) => slot(renderCodeBlock(parseCodeBlock(info, body), `${out.length + 1}-${hash(whole)}`), true));
  // Other fenced blocks keep marked's usual output; code spans too.
  text = text.replace(/^```([^\n`]*)\r?\n([\s\S]*?)^```[ \t]*$/gm, (_m, info: string, body: string) => {
    const lang = info.trim().split(/\s+/)[0];
    return slot(`<pre><code${lang ? ` class="language-${esc(lang)}"` : ""}>${esc(body.replace(/\r\n?/g, "\n"))}</code></pre>`, true);
  });
  text = text.replace(/(`+)([^`\n]|[^`\n][^\n]*?[^`\n])\1(?!`)/g, (_m, _t, body: string) => {
    const inner = body.length > 2 && body.startsWith(" ") && body.endsWith(" ") ? body.slice(1, -1) : body;
    return slot(`<code>${esc(inner)}</code>`, false);
  });
  if (!out.length) return { text: src, restore: (h) => h };
  return {
    text,
    restore: (html) => html.replace(/<p>XCODEX(\d+)XCODEX<\/p>/g, (_m, n) => out[Number(n)]).replace(/XCODEX(\d+)XCODEX/g, (_m, n) => out[Number(n)]),
  };
}

// ---- The Python harness ----------------------------------------------------------------------

/**
 * Runs one test in a fresh namespace: input() reads `stdin`, print() output is captured, the
 * function (if any) is called with JSON arguments, and errors are trimmed to the student's own
 * lines. Shared by the Pyodide worker and the course checker (system python3), so both judge
 * code the same way. Returns a JSON string shaped like RawResult.
 */
export const PY_HARNESS = String.raw`
import sys, io, json, math, traceback

class _ErudiorOut(io.StringIO):
    LIMIT = 20000
    def write(self, s):
        room = self.LIMIT - self.tell()
        if room > 0:
            super().write(s[:room])
        return len(s)

def _erudior_plain(v, depth=0):
    if depth > 40:
        return {"$repr": "..."}
    if v is None or isinstance(v, (bool, str)):
        return v
    if isinstance(v, int):
        return v if abs(v) < 2**53 else {"$repr": repr(v)}
    if isinstance(v, float):
        return v if math.isfinite(v) else {"$repr": repr(v)}
    if isinstance(v, (list, tuple)):
        return [_erudior_plain(x, depth + 1) for x in v]
    if isinstance(v, dict):
        return {str(k): _erudior_plain(x, depth + 1) for k, x in v.items()}
    if isinstance(v, (set, frozenset)):
        items = [_erudior_plain(x, depth + 1) for x in v]
        try:
            return sorted(items)
        except TypeError:
            return items
    return {"$repr": repr(v)}

def _erudior_error(e, code):
    lines = code.split("\n")
    name = type(e).__name__
    if isinstance(e, SyntaxError) and e.filename == "<your code>":
        return {"type": name, "message": e.msg, "line": e.lineno}
    frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "<your code>"]
    trace = []
    for f in frames:
        where = "Line %d" % f.lineno + ("" if f.name == "<module>" else ", in %s" % f.name)
        text = lines[f.lineno - 1].strip() if 0 < f.lineno <= len(lines) else ""
        trace.append(where + (": " + text if text else ""))
    out = {"type": name, "message": str(e), "trace": trace[-6:]}
    if frames:
        out["line"] = frames[-1].lineno
    return out

def __erudior_run(code, stdin, call, args_json):
    out = _ErudiorOut()
    saved = (sys.stdout, sys.stderr, sys.stdin)
    sys.stdout = out
    sys.stderr = out
    sys.stdin = io.StringIO(stdin or "")
    res = {}
    try:
        ns = {"__name__": "__main__"}
        try:
            exec(compile(code, "<your code>", "exec"), ns)
        except SystemExit:
            pass
        if isinstance(call, str) and call:
            fn = ns.get(call)
            if not callable(fn):
                res["error"] = {"type": "MissingFunction", "message": "Your code needs a function named %s()." % call}
            else:
                v = fn(*json.loads(args_json or "[]"))
                res["hasValue"] = True
                res["value"] = _erudior_plain(v)
                res["repr"] = repr(v)[:2000]
    except KeyboardInterrupt:
        res["timedOut"] = True
    except BaseException as e:
        res["error"] = _erudior_error(e, code)
    finally:
        sys.stdout, sys.stderr, sys.stdin = saved
    res["stdout"] = out.getvalue()
    return json.dumps(res)
`;
