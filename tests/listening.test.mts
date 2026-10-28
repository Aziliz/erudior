// Listening and speaking practice: ```dialogue and ```speak blocks (lib/dialogue.ts), audio
// fields on words and questions, and the microphone error messages (lib/recorder.ts).
// Run: npx tsx tests/listening.test.mts
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { findMedia, mediaProblems, parseMedia, prepareMedia, mediaClick, releaseMedia, renderMedia } from "../src/lib/dialogue.ts";
import { AUDIO_SRC, audioBytes, isAudioSrc } from "../src/lib/audio.ts";
import { micError, recordingExt } from "../src/lib/recorder.ts";
import { normalizeCourse, exportCourseSnapshot } from "../src/lib/course.ts";
import { isCorrect } from "../src/lib/questions.ts";
import { checkCourse } from "./check-course.mts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};

const CLIP = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0U=";
const fence = (kind: string, info: string, body: string) => "```" + kind + info + "\n" + body + "\n```";

// --- Audio data URLs ----------------------------------------------------------------------
ok("mp3 data URL accepted", isAudioSrc(CLIP));
ok("other types refused", !isAudioSrc("data:text/html;base64,PGI+") && !isAudioSrc("https://x/a.mp3") && !isAudioSrc("data:audio/mpeg,raw"));
ok("quotes can't sneak into an attribute", !AUDIO_SRC.test('data:audio/mpeg;base64,AAAA" onerror="x'));
ok("size estimate", audioBytes("data:audio/mpeg;base64,AAAA") === 3);

// --- Dialogue parsing ---------------------------------------------------------------------
let b = parseMedia(
  "dialogue",
  " lang=de-DE",
  `# Im Café
Kellner: Guten Tag! Was möchten Sie?
= Hello! What would you like?
audio: ${CLIP}
Anna: Einen Kaffee,
bitte.
= A coffee,
please.
Kellner: Gern.`,
);
ok("title", b.title === "Im Café");
ok("lang", b.lang === "de-DE");
ok("three lines with speakers", b.lines.map((l) => l.speaker).join() === "Kellner,Anna,Kellner", b.lines);
ok("translation and audio attach to the line above", b.lines[0].translation === "Hello! What would you like?" && b.lines[0].audio === CLIP);
ok("plain lines continue the text or the translation", b.lines[1].text === "Einen Kaffee, bitte." && b.lines[1].translation === "A coffee, please.", b.lines[1]);
ok("no problems", b.problems.length === 0, b.problems);

b = parseMedia("dialogue", " voice=x lang=??", `= early\naudio: ${CLIP}\nno speaker here\nA: one\n= x\n= y\naudio: https://x/a.mp3`);
const has = (s: string) => b.problems.some((p) => p.includes(s));
ok("unknown option", has('unknown option "voice=x"'), b.problems);
ok("bad lang", has("lang must be a language code"));
ok("translation before any line", has("translation (=) before the first line"));
ok("audio before any line", has("audio: before the first line"));
ok("line without a speaker", has("has no speaker"));
ok("two translations", has("more than one translation"));
ok("audio must be embedded", has("audio must be a data:audio"));
ok("empty block", parseMedia("dialogue", "", "").problems.some((p) => p.includes("no lines")));

// --- Speak blocks ---------------------------------------------------------------------------
b = parseMedia("speak", "", `# Say it\nIch heiße Anna.\n= My name is Anna.\naudio: ${CLIP}\nWie: heißt du?`);
ok("speak: every line is a phrase (colons are fine)", b.lines.length === 2 && b.lines[1].text === "Wie: heißt du?", b.lines);
ok("speak: translation and audio", b.lines[0].translation === "My name is Anna." && b.lines[0].audio === CLIP);
ok("speak: empty block", parseMedia("speak", "", "").problems.some((p) => p.includes("no phrases")));

const md = `Intro\n\n${fence("dialogue", "", "A: Hallo!")}\n\n${fence("speak", "", "Tschüss!")}\n\n\`\`\`dialogue\nB: never closed`;
ok("findMedia finds both", findMedia(md).length === 2);
ok("unclosed block reported", mediaProblems(md).some((p) => p.includes("never closed")), mediaProblems(md));

// --- Rendering and buttons (DOM) -----------------------------------------------------------------
const id = (s: string) => `<p>${s}</p>`;
const dlgHtml = renderMedia(parseMedia("dialogue", " lang=de-DE", `# T\nA: Eins\n= One\naudio: ${CLIP}\nB: Zwei\n= Two`), id, "k");
const spkHtml = renderMedia(parseMedia("speak", "", `Drei\n= Three`), id, "k");
const dom = new JSDOM(`<!doctype html><body><div id="root">${dlgHtml}${spkHtml}</div></body>`);
const g = globalThis as Record<string, unknown>;
g.window = dom.window;
g.document = dom.window.document;
const doc = dom.window.document;
const root = doc.getElementById("root")!;
ok("dialogue section labelled by its title", root.querySelector(".dlg")?.getAttribute("aria-labelledby") === root.querySelector(".dlg-title")?.id);
ok("voice language on the block, lang on the text", root.querySelector(".dlg")?.getAttribute("data-lang") === "de-DE" && root.querySelector(".dlg-text")?.getAttribute("lang") === "de");
ok("clip on its line only", root.querySelectorAll(".dlg-line[data-audio]").length === 1);
ok("speakers and translations shown without JavaScript", root.querySelector(".dlg-who")?.textContent === "A" && root.querySelector(".dlg-tr")?.textContent === "One");
ok("a play button per line, with a name", [...root.querySelectorAll(".dlg-play")].every((x) => /Play line \d/.test(x.getAttribute("aria-label") ?? "")));
ok("status region", !!root.querySelector(".dlg > .media-status[role=status]"));
ok("recording buttons start hidden", [...root.querySelectorAll('.spk [data-media="mine"], .spk [data-media="save"]')].every((x) => (x as HTMLElement).hidden));

const btn = (sel: string) => root.querySelector(sel) as HTMLElement;
mediaClick(btn('[data-media="words"]'));
ok("hide the words", root.querySelector(".dlg")!.classList.contains("hide-words") && btn('[data-media="words"]').getAttribute("aria-pressed") === "true" && btn('[data-media="words"]').textContent === "Show the words");
mediaClick(btn('[data-media="words"]'));
ok("show them again", !root.querySelector(".dlg")!.classList.contains("hide-words"));
mediaClick(btn('[data-media="translations"]'));
ok("translations off", root.querySelector(".dlg")!.classList.contains("hide-tr") && btn('[data-media="translations"]').getAttribute("aria-pressed") === "false");
ok("other clicks ignored", mediaClick(doc.body) === false);

// No speech engine in jsdom: a line without a clip says so instead of failing silently.
mediaClick(root.querySelectorAll(".dlg-play")[1]);
await new Promise((r) => setTimeout(r, 0));
ok("no voice: the student is told", /no voice for this language/.test(root.querySelector(".dlg > .media-status")?.textContent ?? ""), root.querySelector(".dlg > .media-status")?.textContent);

// No MediaRecorder in jsdom: recording is hidden with a note.
prepareMedia(root);
ok("can't record: Record hidden, note shown", btn('[data-media="record"]').hidden && !!root.querySelector(".spk-norec"));
prepareMedia(root);
ok("note added once", root.querySelectorAll(".spk-norec").length === 1);
releaseMedia(root);

// --- Through the Markdown pipeline ---------------------------------------------------------
{
  const { renderMarkdown } = await import("../src/components/Markdown.tsx");
  const out = renderMarkdown(`Text\n\n${fence("dialogue", "", `A: Das ist $x^2$ und [[Wort]].\n= That's *it*.\naudio: ${CLIP}`)}\n\n<script>alert(1)</script>`);
  ok("pipeline: math in a line", out.includes('class="katex"'));
  ok("pipeline: glossary link in a line", out.includes('class="gloss"'));
  ok("pipeline: translation Markdown", out.includes("<em>it</em>"));
  ok("pipeline: clip kept", out.includes(`data-audio="${CLIP}"`));
  ok("pipeline: still sanitized", !out.includes("<script"));
}

// --- Words and questions with sound -----------------------------------------------------------
const course = normalizeCourse(JSON.parse(readFileSync("samples/demo-listening.json", "utf8")));
ok("word clips kept", course.vocab!.filter((v) => v.audio).length === 2);
const qs = course.banks[0].questions;
ok("question clip and transcript", !!qs[0].audio?.src && qs[0].audio?.text === "Guten Tag! Was möchten Sie trinken?");
ok("voice-only authored question retains omitted language", qs[3].audio?.lang === undefined && !qs[3].audio?.src, qs[3].audio);
// Voice inheritance belongs to playback, not the portable authored object. Exercise
// the actual learner component with the same course fallback Runner/Results supply.
{
  const { createElement, act } = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { QuestionAudio } = await import("../src/components/QuestionBody.tsx");
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  const spoken: { text: string; lang: string; onend?: () => void }[] = [];
  class Utterance { lang = ""; rate = 1; voice: unknown; onend?: () => void; onerror?: () => void; constructor(public text: string) {} }
  Object.assign(globalThis, { SpeechSynthesisUtterance: Utterance });
  Object.defineProperty(dom.window, "speechSynthesis", { configurable: true, value: {
    getVoices: () => [{ lang: "de-DE" }, { lang: "en-US" }], cancel: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    speak: (u: Utterance) => { spoken.push(u); queueMicrotask(() => u.onend?.()); },
  } });
  const container = document.createElement("div"); document.body.append(container);
  const audioRoot = createRoot(container);
  const sourceBefore = exportCourseSnapshot(course);
  await act(async () => audioRoot.render(createElement(QuestionAudio, { q: qs[3], fallbackLang: course.language?.tts ?? course.language?.code, revealed: true })));
  ok("course voice makes listening button available", container.querySelectorAll("button").length === 2, container.textContent);
  await act(async () => (container.querySelector("button") as HTMLButtonElement).click());
  ok("voice-only question plays in course voice", spoken.at(-1)?.lang === "de-DE" && spoken.at(-1)?.text === qs[3].audio?.text, spoken);
  ok("inherited transcript has language", container.querySelector("[lang]")?.getAttribute("lang") === "de");
  const explicit = { ...qs[3], audio: { ...qs[3].audio, lang: "en-US" } };
  await act(async () => audioRoot.render(createElement(QuestionAudio, { q: explicit, fallbackLang: "de-DE", revealed: true })));
  await act(async () => (container.querySelector("button") as HTMLButtonElement).click());
  ok("explicit question voice wins over course fallback", spoken.at(-1)?.lang === "en-US", spoken);
  ok("playback does not persist derived voice metadata", exportCourseSnapshot(course) === sourceBefore && qs[3].audio?.lang === undefined);
  await act(async () => audioRoot.unmount()); container.remove();
  delete (dom.window as any).speechSynthesis;
}
ok("dictation accepts the sentence without its period", isCorrect(qs[2], ["ich trinke gern tee"]));
const bad = () =>
  normalizeCourse({ title: "x", banks: [{ title: "b", questions: [{ id: "q", stem: "s", choices: ["a", "b"], answer: 0, audio: { src: "https://x/a.mp3" } }] }] });
let threw = "";
try {
  bad();
} catch (e) {
  threw = (e as Error).message;
}
ok("audio without a usable source or text is refused", threw.includes('"audio"'), threw);
const dropped = normalizeCourse({ title: "x", vocab: [{ id: "w", lesson: "l", term: "a", meanings: ["b"], audio: "https://x/a.mp3" }] });
ok("a word's linked (not embedded) audio is dropped", !dropped.vocab![0].audio);

// --- Microphone messages ---------------------------------------------------------------------
ok("permission denied", micError({ name: "NotAllowedError" }).includes("allow Erudior to use the microphone"));
ok("no microphone", micError({ name: "NotFoundError" }).includes("No microphone"));
ok("busy", micError({ name: "NotReadableError" }).includes("busy"));
ok("anything else", micError(new Error("x")).includes("listen and repeat"));
ok("file extensions", recordingExt("audio/mp4") === "m4a" && recordingExt("audio/webm;codecs=opus") === "webm" && recordingExt("audio/ogg") === "ogg");

// --- The demo courses pass the course checker ----------------------------------------------------
for (const f of ["samples/demo-listening.json", "samples/demo-reader.json"]) {
  const p = await checkCourse(f, { runs: 2 });
  ok(`${f} passes the checker`, p.length === 0, p);
}
{
  const { writeFileSync, mkdtempSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const dir = mkdtempSync(`${tmpdir()}/listen-`);
  const f = `${dir}/c.json`;
  writeFileSync(
    f,
    JSON.stringify({
      title: "Bad",
      lessons: [{ id: "l", title: "L", body: fence("dialogue", "", "no speaker") }],
      vocab: [{ id: "w", lesson: "l", term: "a", meanings: ["b"], audio: "https://x/a.mp3" }],
      banks: [{ title: "b", questions: [{ id: "q", stem: "s", choices: ["a", "b"], answer: 0, audio: { text: "hallo" } }] }],
    }),
  );
  const p = await checkCourse(f, { runs: 1 });
  ok("checker: malformed dialogue", p.some((x) => x.includes("dialogue 1") && x.includes("no speaker")), p);
  ok("checker: word audio not embedded", p.some((x) => x.includes('word w: "audio" must be')), p);
  ok("checker: spoken text needs a language", p.some((x) => x.includes('needs a "lang"')), p);
}

if (fails) {
  console.log(`${fails} listening test(s) failed`);
  process.exit(1);
}
console.log("listening tests passed");
