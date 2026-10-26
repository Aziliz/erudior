// Turns the static ```code blocks in a lesson (see renderCodeBlock in code.ts) into small
// playgrounds: an editor (unless the block is readonly), Run, Start over, a box for typed input
// when the program asks for some, and the output. Loaded by the Markdown component only when a
// page has a code block. Edits are kept as drafts on this device.
import { DEFAULT_TIME_LIMIT, errorHeadline, errorTip, normalizeOutput, readLang, readsInput, timeoutText, type CodeError, type CodeLang } from "./code";
import { createEditor, type EditorHandle } from "./codeEditor";
import { LOAD_TEXT, PythonLoadError, runCode, statusLine } from "./codeRun";
import { loadDraft, saveDraft } from "./codeDrafts";

let seq = 0;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function errorBox(error: CodeError, lang: CodeLang): HTMLElement {
  const box = el("div", "code-err");
  box.append(el("p", "code-err-head", errorHeadline(error)));
  const tip = errorTip(lang, error.type);
  if (tip) box.append(el("p", "small", tip));
  if (error.trace && error.trace.length > 1) {
    const pre = el("pre", "code-trace", error.trace.join("\n"));
    pre.setAttribute("aria-label", "Where it happened, innermost last");
    box.append(pre);
  }
  return box;
}

function mountOne(fig: HTMLElement): () => void {
  const lang = readLang(fig.dataset.codeLang) ?? "python";
  const readonly = fig.dataset.codeReadonly !== undefined;
  const pre = fig.querySelector<HTMLElement>("pre.code-src");
  const source = pre?.textContent ?? "";
  const draftKey = `lesson.${fig.dataset.codeKey ?? ""}`;
  const start = (!readonly && loadDraft(draftKey)) || source;
  const n = ++seq;

  const bar = el("div", "code-ex-actions");
  const run = el("button", "btn sm primary", "Run");
  run.type = "button";
  const reset = el("button", "btn sm ghost", "Start over");
  reset.type = "button";
  reset.hidden = start === source;
  bar.append(run, reset);

  const host = el("div", "code-editor");
  const keys = el("p", "code-keys small muted", "Tab indents a line. To leave the editor with the keyboard, press Esc, then Tab.");
  keys.id = `code-keys-${n}`;
  let editor: EditorHandle | null = null;
  editor = createEditor(host, {
    doc: start,
    language: lang,
    readOnly: readonly,
    label: `${readonly ? "Example code" : "Example code you can edit"} (${lang === "python" ? "Python" : "JavaScript"})`,
    describedBy: readonly ? undefined : keys.id,
    onChange: (code) => {
      reset.hidden = code === source;
      saveDraft(draftKey, code === source ? null : code);
    },
  });
  pre?.replaceWith(host);
  if (!readonly) host.after(keys);

  // Typed input, for programs that ask with input() (or prompt() in JavaScript).
  let stdinBox: HTMLTextAreaElement | null = null;
  if (fig.dataset.codeStdin !== undefined || readsInput(source, lang)) {
    const label = el("label", "field code-stdin");
    label.append(el("span", undefined, "Typed input (one line for each time the program asks)"));
    stdinBox = el("textarea", "textarea code-input");
    stdinBox.rows = 2;
    stdinBox.spellcheck = false;
    stdinBox.value = fig.dataset.codeStdin ?? "";
    label.append(stdinBox);
    fig.append(label);
  }

  const status = el("p", "code-status small");
  status.setAttribute("role", "status");
  const out = el("div", "code-run");
  out.hidden = true;
  fig.append(bar, status, out);

  reset.addEventListener("click", () => {
    editor?.setValue(source);
    editor?.markLine(null);
    editor?.focus();
  });

  run.addEventListener("click", async () => {
    if (!editor) return;
    run.disabled = true;
    status.replaceChildren(Object.assign(el("span", "code-spinner"), { ariaHidden: "true" }), document.createTextNode(""));
    const say = (t: string) => (status.lastChild!.textContent = t);
    try {
      const limit = DEFAULT_TIME_LIMIT;
      const [r] = await runCode(lang, editor.getValue(), [{ stdin: stdinBox?.value }], { timeLimitSec: limit, onStatus: (s) => say(statusLine(s, lang)) });
      const io = el("div", "code-io");
      io.append(el("span", "code-io-label", "Output"));
      const text = normalizeOutput(r.stdout);
      const outPre = el("pre", "code-out");
      if (text) outPre.textContent = text;
      else outPre.append(el("span", "muted", "(nothing)"));
      io.append(outPre);
      out.replaceChildren(io);
      if (r.timedOut) out.append(el("p", "code-err-head", timeoutText(limit)));
      if (r.error) out.append(errorBox(r.error, lang));
      out.hidden = false;
      editor.markLine(r.error?.line ?? null);
      say(r.timedOut ? "The program was stopped." : r.error ? "The program stopped with an error." : "The program finished.");
    } catch (e) {
      say(e instanceof PythonLoadError ? LOAD_TEXT : `Couldn't run the code: ${(e as Error).message}`);
    } finally {
      run.disabled = false;
      status.querySelector(".code-spinner")?.remove();
    }
  });

  fig.dataset.mounted = "";
  return () => {
    editor?.destroy();
    editor = null;
  };
}

/** Make every code block under `root` runnable. Returns a function that tears them down. */
export function mountCodeBlocks(root: HTMLElement): () => void {
  const undo = [...root.querySelectorAll<HTMLElement>("figure.code-block:not([data-mounted])")].map(mountOne);
  return () => undo.forEach((u) => u());
}
