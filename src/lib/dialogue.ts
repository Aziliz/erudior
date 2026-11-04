// Listening and speaking blocks for lessons (language courses mostly):
//
//   ```dialogue lang=de-DE                 ```speak
//   # Im Café                               # Introduce yourself
//   Kellner: Guten Tag! Was möchten Sie?    Ich heiße Anna.
//   = Hello! What would you like?           = My name is Anna.
//   audio: data:audio/mpeg;base64,…         audio: data:audio/mpeg;base64,…
//   Anna: Einen Kaffee, bitte.              Wie heißt du?
//   = A coffee, please.                     = What's your name?
//   ```                                     ```
//
// A dialogue plays line by line (each line, or all of them in order) with speaker labels and
// translations; "Hide the words" turns it into listening practice. A speak block is a list of
// phrases to say: listen to the model, record yourself, play both to compare, repeat. There's
// no automatic scoring (record-and-compare). Sound is the line's recorded `audio:` clip when the
// course has one, else the device's voice (lib/audio.ts).
//
// Like worked examples (lib/examples.ts), the blocks are parsed before Markdown runs, rendered
// to complete HTML (readable without JavaScript, e.g. prerendered pages and print), and the
// Markdown component wires the buttons through `mediaClick`.

import { playClip, playElement, stopAudio } from "./audio";
import { canSpeak } from "./speech";
import { canRecord, micError, recordingExt, startRecording, type ActiveRecording, type Recording } from "./recorder";

import { MEDIA_BLOCK, parseMedia, type MediaBlock, type MediaLine } from "./dialogueContent";
export { MEDIA_BLOCK, parseMedia, findMedia, mediaProblems } from "./dialogueContent";
export type { MediaBlock, MediaLine } from "./dialogueContent";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** One short paragraph's HTML without its <p> wrapper. */
const unwrap = (html: string) => {
  const m = /^\s*<p>([\s\S]*)<\/p>\s*$/.exec(html);
  return m && !m[1].includes("<p>") ? m[1] : html;
};

/**
 * The block as HTML. `md` renders a field's Markdown (sanitized); audio URLs were validated by
 * the parser (base64 only), so they're safe in an attribute. `key` makes ids unique.
 */
export function renderMedia(b: MediaBlock, md: (src: string) => string, key: string): string {
  const id = `${b.kind === "dialogue" ? "dlg" : "spk"}-${key}`;
  const langAttr = b.lang ? ` data-lang="${esc(b.lang)}"` : "";
  const textLang = b.lang ? ` lang="${esc(b.lang.split(/[-_]/)[0])}"` : "";
  const audio = (l: MediaLine) => (l.audio ? ` data-audio="${l.audio}"` : "");
  const tr = (l: MediaLine, cls: string) => (l.translation ? `<p class="${cls}">${unwrap(md(l.translation))}</p>` : "");
  if (b.kind === "dialogue") {
    const hasTr = b.lines.some((l) => l.translation);
    const lines = b.lines
      .map(
        (l, i) =>
          `<li class="dlg-line"${audio(l)}>` +
          `<span class="dlg-who">${esc(l.speaker ?? "")}</span>` +
          `<div class="dlg-say"><p class="dlg-text"${textLang}>${unwrap(md(l.text))}</p>${tr(l, "dlg-tr")}</div>` +
          `<button type="button" class="btn ghost sm media-btn dlg-play" data-media="line" aria-label="Play line ${i + 1} (${esc(l.speaker ?? "")})" title="Play this line">🔊</button>` +
          `</li>`,
      )
      .join("");
    return (
      `<section class="dlg"${langAttr} aria-labelledby="${id}-t">` +
      `<div class="dlg-head"><p class="dlg-title" id="${id}-t"><span class="media-kicker">Dialogue</span>${b.title ? `<span>${unwrap(md(b.title))}</span>` : ""}</p>` +
      `<div class="dlg-tools">` +
      `<button type="button" class="btn sm media-btn" data-media="all">▶ Play all</button>` +
      `<button type="button" class="btn sm ghost media-btn" data-media="words" aria-pressed="false">Hide the words</button>` +
      (hasTr ? `<button type="button" class="btn sm ghost media-btn" data-media="translations" aria-pressed="true">Translations</button>` : "") +
      `</div></div>` +
      `<ol class="dlg-lines">${lines}</ol>` +
      `<p class="media-status" role="status"></p>` +
      `</section>`
    );
  }
  const items = b.lines
    .map(
      (l, i) =>
        `<li class="spk-item"${audio(l)}>` +
        `<p class="spk-text"${textLang}>${unwrap(md(l.text))}</p>${tr(l, "spk-tr")}` +
        `<div class="spk-controls" role="group" aria-label="Phrase ${i + 1}">` +
        `<button type="button" class="btn sm media-btn" data-media="model">🔊 Listen</button>` +
        `<button type="button" class="btn sm ghost media-btn" data-media="slow">Slower</button>` +
        `<button type="button" class="btn sm media-btn spk-rec" data-media="record">● Record yourself</button>` +
        `<button type="button" class="btn sm media-btn" data-media="mine" hidden>▶ Your recording</button>` +
        `<button type="button" class="btn sm ghost media-btn" data-media="both" hidden>Compare: model, then you</button>` +
        `<button type="button" class="btn sm ghost media-btn" data-media="save" hidden>Keep a copy</button>` +
        `<button type="button" class="btn sm ghost media-btn" data-media="discard" hidden>Delete recording</button>` +
        `</div>` +
        `<p class="media-status" role="status"></p>` +
        `</li>`,
    )
    .join("");
  return (
    `<section class="spk"${langAttr} aria-labelledby="${id}-t">` +
    `<p class="spk-head" id="${id}-t"><span class="media-kicker">Speaking practice</span>${b.title ? `<span>${unwrap(md(b.title))}</span>` : ""}</p>` +
    `<p class="spk-note">Listen, then record yourself saying it and compare. Try again as often as you like. Recordings stay on this device and are deleted when you leave the page, unless you keep a copy.</p>` +
    `<ol class="spk-items">${items}</ol>` +
    `</section>`
  );
}

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/** Swap the blocks for placeholders before Markdown runs; `restore` puts the HTML back after sanitizing. */
export function protectMedia(src: string, md: (src: string) => string): { text: string; restore: (html: string) => string } {
  if (!src.includes("```dialogue") && !src.includes("```speak")) return { text: src, restore: (h) => h };
  const out: string[] = [];
  const text = src.replace(MEDIA_BLOCK, (whole, kind: "dialogue" | "speak", info: string, body: string) => {
    out.push(renderMedia(parseMedia(kind, info, body), md, `${out.length + 1}-${hash(whole)}`));
    return `\n\nXMEDIAX${out.length - 1}XMEDIAX\n\n`;
  });
  if (!out.length) return { text: src, restore: (h) => h };
  return {
    text,
    restore: (html) => html.replace(/<p>XMEDIAX(\d+)XMEDIAX<\/p>/g, (_m, n) => out[Number(n)]).replace(/XMEDIAX(\d+)XMEDIAX/g, (_m, n) => out[Number(n)]),
  };
}

// ---------- behavior (browser only) ----------

/** Recordings by phrase element; dropped (and their blob: URLs revoked) on re-record, delete or leaving. */
const recordings = new WeakMap<Element, Recording>();
const live = new Set<Element>();
let active: { item: Element; rec: ActiveRecording } | null = null;
/** Bumped to cancel a "Play all" or "Compare" sequence. */
let run = 0;

const status = (el: Element | null | undefined, text: string) => {
  const s = el?.querySelector<HTMLElement>(":scope > .media-status");
  if (s) s.textContent = text;
};
const plain = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
const langOf = (el: Element, fallback?: string) => el.closest<HTMLElement>("[data-lang]")?.dataset.lang ?? fallback;

/** Play one line: its clip, else the device's voice. False when neither is possible. */
async function playLine(li: HTMLElement, textSel: string, lang: string | undefined, rate = 1): Promise<boolean> {
  const src = li.dataset.audio;
  const text = plain(li.querySelector(textSel));
  if (!src && !canSpeak(lang)) return false;
  li.classList.add("is-playing");
  try {
    await playClip({ src, text }, { rate, fallbackLang: lang });
  } finally {
    li.classList.remove("is-playing");
  }
  return true;
}

const NO_VOICE = "This device has no voice for this language, so it can't be read aloud here. The words are written above.";

function setAll(btn: HTMLButtonElement, playing: boolean) {
  btn.textContent = playing ? "■ Stop" : "▶ Play all";
  btn.setAttribute("aria-pressed", String(playing));
}

/** Leaving the page (or its text changed): stop sound and recording, and drop the recordings under `root`. */
export function releaseMedia(root: Element) {
  run++;
  stopAudio();
  if (active && root.contains(active.item)) {
    active.rec.stop();
    active = null;
  }
  for (const item of [...live]) if (root.contains(item)) dropRecording(item);
}

/** After render: hide recording where the device can't record, and say why once. */
export function prepareMedia(root: Element) {
  if (canRecord()) return;
  root.querySelectorAll<HTMLElement>(".spk").forEach((box) => {
    box.querySelectorAll<HTMLButtonElement>('[data-media="record"]').forEach((b) => (b.hidden = true));
    const note = box.querySelector(".spk-note");
    if (note && !box.querySelector(".spk-norec")) {
      const p = document.createElement("p");
      p.className = "spk-norec";
      p.textContent = "Recording isn't available here, so listen and repeat out loud.";
      note.after(p);
    }
  });
}

function showRecorded(item: HTMLElement, has: boolean) {
  for (const k of ["mine", "both", "save", "discard"]) {
    const b = item.querySelector<HTMLButtonElement>(`[data-media="${k}"]`);
    if (b) b.hidden = !has;
  }
}

function dropRecording(item: Element) {
  const r = recordings.get(item);
  if (r) URL.revokeObjectURL(r.url);
  recordings.delete(item);
  live.delete(item);
}

/**
 * Click handling for dialogue and speak blocks (event delegation from the Markdown component).
 * `ctx.lang` is the course's voice language. Returns true when it handled the click.
 */
export function mediaClick(target: Element, ctx: { lang?: string; save?: (r: Recording, name: string) => Promise<boolean> } = {}): boolean {
  const btn = target.closest<HTMLButtonElement>("button.media-btn");
  if (!btn) return false;
  const what = btn.dataset.media;
  const box = btn.closest<HTMLElement>(".dlg, .spk");
  if (!box) return false;
  const lang = langOf(btn, ctx.lang);

  if (box.classList.contains("dlg")) {
    if (what === "words" || what === "translations") {
      const on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", String(on));
      box.classList.toggle(what === "words" ? "hide-words" : "hide-tr", what === "words" ? on : !on);
      if (what === "words") btn.textContent = on ? "Show the words" : "Hide the words";
      return true;
    }
    if (what === "line") {
      const li = btn.closest<HTMLElement>(".dlg-line")!;
      const mine = ++run;
      box.querySelectorAll<HTMLButtonElement>('[data-media="all"]').forEach((b) => setAll(b, false));
      playLine(li, ".dlg-text", lang).then((ok) => mine === run && !ok && status(box, NO_VOICE));
      return true;
    }
    if (what === "all") {
      if (btn.getAttribute("aria-pressed") === "true") {
        run++;
        stopAudio();
        setAll(btn, false);
        return true;
      }
      const mine = ++run;
      setAll(btn, true);
      const lines = [...box.querySelectorAll<HTMLElement>(".dlg-line")];
      (async () => {
        for (const li of lines) {
          if (mine !== run) return;
          if (!(await playLine(li, ".dlg-text", lang))) {
            status(box, NO_VOICE);
            break;
          }
          // A short pause between speakers, as in a real conversation.
          await new Promise((r) => window.setTimeout(r, 350));
        }
        if (mine === run) setAll(btn, false);
      })();
      return true;
    }
    return false;
  }

  // Speaking practice.
  const item = btn.closest<HTMLElement>(".spk-item");
  if (!item) return false;
  const say = (t: string) => status(item, t);
  if (what === "model" || what === "slow") {
    run++;
    playLine(item, ".spk-text", lang, what === "slow" ? 0.7 : 1).then((ok) => !ok && say(NO_VOICE));
    return true;
  }
  if (what === "record") {
    if (active?.item === item) {
      active.rec.stop();
      return true;
    }
    if (active) active.rec.stop();
    run++;
    stopAudio();
    (async () => {
      let rec: ActiveRecording;
      try {
        rec = await startRecording();
      } catch (e) {
        say(micError(e));
        return;
      }
      active = { item, rec };
      btn.textContent = "■ Stop recording";
      btn.classList.add("is-recording");
      btn.setAttribute("aria-pressed", "true");
      say("Recording… say the phrase, then press Stop.");
      try {
        const r = await rec.done;
        if (!item.isConnected) {
          // The page closed while recording: nothing to keep.
          URL.revokeObjectURL(r.url);
          return;
        }
        dropRecording(item);
        recordings.set(item, r);
        live.add(item);
        showRecorded(item, true);
        say("Recorded. Play it, or compare it with the model.");
      } catch (e) {
        say(micError(e));
      } finally {
        if (active?.item === item) active = null;
        btn.textContent = "● Record again";
        btn.classList.remove("is-recording");
        btn.setAttribute("aria-pressed", "false");
      }
    })();
    return true;
  }
  const r = recordings.get(item);
  if (what === "mine" && r) {
    run++;
    item.classList.add("is-playing");
    playElement(new Audio(r.url)).finally(() => item.classList.remove("is-playing"));
    return true;
  }
  if (what === "both" && r) {
    const mine = ++run;
    (async () => {
      const ok = await playLine(item, ".spk-text", lang);
      if (!ok) say(NO_VOICE);
      if (mine !== run) return;
      await new Promise((res) => window.setTimeout(res, 400));
      if (mine !== run) return;
      item.classList.add("is-playing");
      await playElement(new Audio(r.url));
      item.classList.remove("is-playing");
    })();
    return true;
  }
  if (what === "save" && r) {
    const base = plain(item.querySelector(".spk-text")).replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 40) || "recording";
    // Cancelling the save dialog says nothing.
    (ctx.save ?? (async () => false))(r, `${base}.${recordingExt(r.type)}`).then(
      (saved) => saved && say("Saved a copy."),
      () => say("Couldn't save the recording."),
    );
    return true;
  }
  if (what === "discard") {
    run++;
    stopAudio();
    dropRecording(item);
    showRecorded(item, false);
    const rec = item.querySelector<HTMLButtonElement>('[data-media="record"]');
    if (rec) {
      rec.textContent = "● Record yourself";
      rec.focus();
    }
    say("Recording deleted.");
    return true;
  }
  return false;
}
