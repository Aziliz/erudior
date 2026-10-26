// Read-aloud: math to words, page text to words, recorded clips, lesson read units and the
// speech queue (with a fake speech engine).
// Run: npx tsx tests/readaloud.test.mts
import { JSDOM } from "jsdom";
import katex from "katex";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};

// A fake speech engine: one English voice; each utterance "ends" after a tick. cancel() fires
// onerror on the utterance being spoken, as browsers do ("interrupted").
const dom = new JSDOM("<!doctype html><html><body></body></html>");
const g = globalThis as Record<string, unknown>;
const spoken: string[] = [];
let current: { onend?: () => void; onerror?: () => void } | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let voices = [{ lang: "en-US", name: "Test" }];
const voiceListeners: (() => void)[] = [];
const fakeSynth = {
  getVoices: () => voices,
  speak(u: { text: string; onend?: () => void; onerror?: () => void }) {
    spoken.push(u.text);
    current = u;
    timer = setTimeout(() => {
      current = null;
      u.onend?.();
    }, 2);
  },
  cancel() {
    clearTimeout(timer);
    const c = current;
    current = null;
    c?.onerror?.();
  },
  addEventListener(_t: string, cb: () => void) {
    voiceListeners.push(cb);
  },
  removeEventListener() {},
};
Object.assign(dom.window, { speechSynthesis: fakeSynth });
g.window = dom.window;
g.document = dom.window.document;
g.HTMLElement = dom.window.HTMLElement;
g.SpeechSynthesisUtterance = class {
  text: string;
  lang = "";
  voice: unknown;
  rate = 1;
  onend?: () => void;
  onerror?: () => void;
  constructor(t: string) {
    this.text = t;
  }
};
const played: string[] = [];
g.Audio = class {
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public src: string) {}
  play() {
    played.push(this.src);
    if (this.src.includes("broken")) return Promise.reject(new Error("can't play"));
    setTimeout(() => this.onended?.(), 2);
    return Promise.resolve();
  }
  pause() {}
};

const { texToSpeech, mathTextSpeech, clipKey, audioLibrary, resolveAudio, sayItem, speechText, elementItem, markReadUnits, readUnits, sectionUnits, isAudioValue } = await import(
  "../src/lib/readAloud.ts"
);
const { speaker, splitSentences, canSpeak } = await import("../src/lib/speech.ts");
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const until = async (cond: () => boolean, ms = 500) => {
  const t0 = Date.now();
  while (!cond() && Date.now() - t0 < ms) await wait(2);
};

// --- Math to words ------------------------------------------------------------------
const cases: [string, string][] = [
  ["2 + 3 = 5", "2 plus 3 equals 5"],
  ["x^2 - 1", "x squared minus 1"],
  ["a^{n+1}", "a to the power n plus 1"],
  ["\\frac{1}{2}", "1 half"],
  ["\\frac{3}{4}", "3 fourths"],
  ["\\frac{x+1}{y}", "x plus 1 over y"],
  ["\\sqrt{16} = 4", "the square root of 16 equals 4"],
  ["\\sqrt[3]{8}", "the cube root of 8"],
  ["-3 + 5", "negative 3 plus 5"],
  ["7 - 2", "7 minus 2"],
  ["4 \\times 3", "4 times 3"],
  ["12 \\div 4", "12 divided by 4"],
  ["90^\\circ", "90 degrees"],
  ["x \\le 5", "x is less than or equal to 5"],
  ["\\text{area} = \\pi r^2", "area equals pi r squared"],
  ["1{,}000", "1000"],
  ["x_1", "x sub 1"],
  ["\\left( a \\right)", "a"],
  ["50\\%", "50 percent"],
];
for (const [tex, want] of cases) ok(`tex: ${tex}`, texToSpeech(tex) === want, texToSpeech(tex));
ok("math in text", mathTextSpeech("What is $2 + 3$?") === "What is 2 plus 3 ?", mathTextSpeech("What is $2 + 3$?"));
ok("prices stay text", mathTextSpeech("It costs $5 and $10.") === "It costs $5 and $10.", mathTextSpeech("It costs $5 and $10."));
ok("blanks read as blank", mathTextSpeech("The cat ___ on the mat.") === "The cat blank on the mat.");

// --- Clip keys and the audio library ----------------------------------------------------
ok("clipKey ignores case/punctuation", clipKey("  The Cat, sat. ") === "the cat sat");
ok("clipKey keeps named keys", clipKey("sound:sh") === "sound:sh");
ok("clipKey drops loose colons", clipKey("Note: hi") === "note hi");
ok("audio values", isAudioValue("data:audio/mpeg;base64,AAA") && isAudioValue("say:mmm") && isAudioValue("audio/m.mp3") && !isAudioValue("http://x/a.mp3") && !isAudioValue("hello"));
const lib = audioLibrary({ audio: { "The cat sat.": "data:audio/wav;base64,AAAA", "sound:m": "say:mmm", bad: "nope" } });
ok("library normalizes keys", lib.get("the cat sat") === "data:audio/wav;base64,AAAA");
ok("library drops unusable values", !lib.has("bad"));
ok("resolve by text", resolveAudio(lib, "the CAT sat!").clip === "data:audio/wav;base64,AAAA");
ok("resolve say:", resolveAudio(lib, "sound:m").say === "mmm");
ok("inline data URL", resolveAudio(lib, "data:audio/ogg;base64,BB").clip === "data:audio/ogg;base64,BB");
ok("no match", Object.keys(resolveAudio(lib, "dog")).length === 0);
ok("sayItem with clip", sayItem(lib, "The cat sat").clip === "data:audio/wav;base64,AAAA");
ok("sayItem with say", sayItem(lib, "m", { key: "sound:m" }).text === "mmm");

// --- Page text to words ----------------------------------------------------------------------
const doc = dom.window.document;
const el = doc.createElement("div");
el.innerHTML =
  `<p>Add <span class="math-inline">${katex.renderToString("2 + 3", { output: "htmlAndMathml" })}</span> now.` +
  `<img alt="Three red apples" src="data:image/png;base64,AA"> <span aria-hidden="true">decor</span>` +
  `<button class="ra-btn">speaker</button><span hidden>secret</span></p>` +
  `<table><tr><th>Name</th><th>Count</th></tr><tr><td>Apples</td><td>3</td></tr></table>`;
const said = speechText(el);
ok("math as words", said.includes("Add 2 plus 3 now."), said);
ok("alt text read", said.includes("Three red apples"), said);
ok("hidden and decorations skipped", !/decor|speaker|secret/.test(said), said);
ok("table rows and cells", said.includes("Name, Count. Apples, 3"), said);
ok("tex mode for keys", speechText(el.querySelector("p")!, { tex: true }).includes("2 + 3"), speechText(el.querySelector("p")!, { tex: true }));

// After sanitizing (as the app does) KaTeX's <annotation> is gone; the TeX rides in data-tex.
{
  const { default: createDOMPurify } = await import("dompurify");
  const { renderMathText } = await import("../src/lib/math.ts");
  const purify = createDOMPurify(dom.window as unknown as Window & typeof globalThis);
  const p2 = doc.createElement("p");
  p2.innerHTML = purify.sanitize(renderMathText("Half is $\\frac{1}{2}$ and $2 + 3 = 5$."));
  ok("sanitized math still spoken", speechText(p2) === "Half is 1 half and 2 plus 3 equals 5.", speechText(p2));
}

// --- Lesson read units ------------------------------------------------------------------------
const html = markReadUnits(
  `<h2>Counting</h2><p>One two three.</p><ul><li>Apples</li><li><p>Pears</p></li></ul><h3>More</h3><p>Four.</p><h2>Next</h2><p>Five.</p>` +
    `<section class="ph" data-noread><p>tile</p></section><div class="math-display">x</div>`,
  true,
);
const host = doc.createElement("div");
host.innerHTML = html;
const units = readUnits(host);
ok("units found", units.length === 9, units.map((u) => u.tagName + ":" + u.textContent));
ok("phonics blocks not units", !units.some((u) => u.textContent === "tile"));
ok("li with p: the p is the unit", units.some((u) => u.tagName === "P" && u.textContent?.includes("Pears")) && !units.some((u) => u.tagName === "LI" && u.textContent?.includes("Pears")));
ok("button per unit", host.querySelectorAll("button.ra-btn").length === 9);
ok("section button after heading", host.querySelector("h2")!.nextElementSibling?.classList.contains("ra-section") === true);
ok("paragraph button inside", host.querySelector("p")!.firstElementChild?.classList.contains("ra-btn") === true);
ok("button not read", elementItem(host.querySelector("p")!).text === "One two three.", elementItem(host.querySelector("p")!).text);
const sec = sectionUnits(units, units[0]);
ok("section stops at next h2", sec.length === 6 && sec[sec.length - 1].textContent === "Four.", sec.map((u) => u.textContent));
ok("subsection stops at h2", sectionUnits(units, units.find((u) => u.tagName === "H3")!).length === 2);
ok("no buttons mode", !markReadUnits("<p>a</p>", false).includes("ra-btn") && markReadUnits("<p>a</p>", false).includes('data-ra="1"'));

// --- Sentences --------------------------------------------------------------------------------
ok("split sentences", splitSentences("One. Two! Three?").length === 3);
const long = splitSentences("word ".repeat(100), 60);
ok("long text cut", long.every((s) => s.length <= 60) && long.join(" ").split(" ").length === 100, long);

// --- The speaker queue --------------------------------------------------------------------------
ok("can speak with a voice", canSpeak("en-US") && canSpeak("en"));
ok("can't speak German here", !canSpeak("de"));
const a = doc.createElement("p");
const b = doc.createElement("p");
speaker.play([{ text: "First. Second.", el: a }, { text: "Third", el: b }], { lang: "en-US", owner: "t1" });
ok("playing", speaker.getState().status === "playing" && speaker.getState().owner === "t1");
ok("highlight first", a.classList.contains("ra-now"));
await until(() => speaker.getState().status === "idle");
ok("read in order, by sentence", spoken.join("|") === "First.|Second.|Third", spoken);
ok("highlight cleared", !a.classList.contains("ra-now") && !b.classList.contains("ra-now"));

spoken.length = 0;
speaker.play([{ text: "One" }, { text: "Two" }, { text: "Three" }], { lang: "en-US", owner: "t2" });
await until(() => spoken.length >= 1);
speaker.pause();
ok("paused", speaker.getState().status === "paused");
await wait(15);
const atPause = speaker.getState().index;
speaker.resume();
await until(() => speaker.getState().status === "idle");
ok("resume restarts the item and goes on", spoken.slice(-2).join() === "Two,Three" || spoken.slice(-3).join() === "One,Two,Three", { spoken, atPause });

spoken.length = 0;
speaker.play([{ text: "Alpha" }, { text: "Beta" }], { lang: "en-US", owner: "t3" });
speaker.stop();
await wait(20);
ok("stop: nothing more", spoken.join() === "Alpha" && speaker.getState().status === "idle", spoken);

spoken.length = 0;
played.length = 0;
speaker.play([{ text: "fallback words", clip: "data:audio/wav;base64,broken" }, { text: "x", clip: "data:audio/wav;base64,good" }], { lang: "en-US", owner: "t4" });
await until(() => speaker.getState().status === "idle");
ok("clips play; a failed clip falls back to speech", played.length === 2 && spoken.join() === "fallback words", { played, spoken });

// Starting a new reading replaces the old one.
spoken.length = 0;
speaker.play([{ text: "old one" }, { text: "old two" }], { lang: "en-US", owner: "a" });
speaker.play([{ text: "new" }], { lang: "en-US", owner: "b" });
await until(() => speaker.getState().status === "idle");
ok("replaced", !spoken.includes("old two") && spoken.includes("new"), spoken);

// No voices: nothing speaks, nothing hangs, nothing throws.
voices = [];
voiceListeners.forEach((f) => f());
ok("no voice: can't speak", !canSpeak("en-US"));
spoken.length = 0;
speaker.play([{ text: "Hello" }, { text: "World" }], { lang: "en-US", owner: "t5" });
await until(() => speaker.getState().status === "idle");
ok("no voice: queue finishes silently", spoken.length === 0 && speaker.getState().status === "idle");

if (fails) {
  console.log(`${fails} read-aloud test(s) failed`);
  process.exit(1);
}
console.log("read-aloud tests passed");
