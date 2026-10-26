// Phonics and handwriting: sounds/blend/trace blocks (parsing, authoring checks, HTML, clicks),
// stroke data for all 52 letters and the tracing check.
// Run: npx tsx tests/phonics.test.mts
import { JSDOM } from "jsdom";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};

const dom = new JSDOM("<!doctype html><html><body></body></html>");
const g = globalThis as Record<string, unknown>;
g.window = dom.window;
g.document = dom.window.document;
// No speech engine at all (like some desktop webviews): nothing may throw.

const { parseSounds, parseBlend, parseTrace, phonicsProblems, protectPhonics, renderSounds, renderBlend, renderTrace, handlePhonicsClick, hydratePhonics, soundKey, parseUnits, phonicsKeys } =
  await import("../src/lib/phonics.ts");
const { letterGuide, TRACE_LETTERS, checkStroke, TOLERANCE, resample } = await import("../src/lib/handwriting.ts");
type Pt = [number, number];

// --- sounds ------------------------------------------------------------------------------
const s = parseSounds("", 'Mm word=moon\ns word=sun say="sss"\nsh word=ship sound=data:audio/wav;base64,AA\n# a comment\n');
ok("three tiles", s.tiles.length === 3 && !s.problems.length, s);
ok("default sound key", s.tiles[0].sound === "sound:m" && s.tiles[1].sound === "sound:s");
ok("quoted say", s.tiles[1].say === "sss");
ok("explicit sound", s.tiles[2].sound.startsWith("data:audio/"));
ok("soundKey", soundKey("Mm") === "sound:m" && soundKey("sh") === "sound:sh" && soundKey("A") === "sound:a");
ok("sounds problems", parseSounds("x", "m color=red extra\n").problems.length === 3, parseSounds("x", "m color=red extra\n").problems);
const sh = renderSounds(s.tiles);
ok("tile HTML", sh.includes('data-key="sound:m"') && sh.includes('data-text="m, as in moon"') && sh.includes("data-noread"), sh);
ok("escaped", renderSounds(parseSounds("", "<b> word=x").tiles).includes("&lt;b&gt;"));

// --- blend -------------------------------------------------------------------------------
const b = parseBlend("", "cat = c a t\nship = sh i p\ncity = c[s] i t y\n");
ok("blend words", b.words.length === 3 && !b.problems.length, b);
ok("units", b.words[1].units.map((u) => u.show).join() === "sh,i,p");
ok("sound override", b.words[2].units[0].sound === "sound:s" && b.words[2].units[0].show === "c");
ok("spelling check", parseBlend("", "cat = c o t").problems.some((p) => p.includes("don't spell")));
ok("format check", parseBlend("", "cat c a t").problems.some((x) => x.includes("should look like")));
ok("units parse", parseUnits("c[k] a t").map((u) => u.sound).join() === "sound:k,sound:a,sound:t");
const bh = renderBlend(b.words);
ok("first word visible, rest hidden", /data-i="0">/.test(bh) && /data-i="1" hidden/.test(bh));
ok("first unit visible only", (bh.match(/<li hidden>/g) ?? []).length === 2 + 2 + 3);
ok("keys for the checker", phonicsKeys("```blend\ncat = c a t\n```").join() === "sound:c,sound:a,sound:t");

// --- trace -------------------------------------------------------------------------------
const t = parseTrace(" tolerance=loose", "a b\nAB");
ok("trace letters", t.letters.join("") === "abAB" && t.tolerance === "loose" && !t.problems.length, t);
ok("trace problems", parseTrace("size=2", "a1é").problems.length === 3, parseTrace("size=2", "a1é").problems);
ok("bad tolerance", parseTrace("tolerance=huge", "a").problems[0].includes("loose, normal or tight"));
const th = renderTrace(t);
ok("pad per letter", (th.match(/<svg class="trace-pad"/g) ?? []).length === 4);
ok("pad label", th.includes('aria-label="Trace the small letter a: 2 strokes.'));
ok("numbered starts", th.includes(">1</text>") && th.includes(">2</text>"));

// --- Markdown placeholders and problems ----------------------------------------------------
const md = "Intro\n\n```sounds\nm word=moon\n```\n\nMiddle\n\n```trace\nq\n```\n";
const p = protectPhonics(md);
ok("placeholders", !p.text.includes("```") && (p.text.match(/XPHONICSX/g) ?? []).length === 4);
ok("restore", p.restore(`<p>Intro</p><p>XPHONICSX0XPHONICSX</p><p>XPHONICSX1XPHONICSX</p>`).includes("ph-sounds"));
ok("no blocks untouched", protectPhonics("plain").text === "plain");
ok("problems listed", phonicsProblems("```blend\ncat = c o t\n```\n\n```trace\n9\n```").length === 3, phonicsProblems("```blend\ncat = c o t\n```\n\n```trace\n9\n```"));
ok("unclosed", phonicsProblems("```trace\na\n").some((x) => x.includes("never closed")));

// --- Clicks without speech: reveal order still works, nothing throws -------------------------
const doc = dom.window.document;
const host = doc.createElement("div");
host.innerHTML = renderBlend(parseBlend("", "cat = c a t\nsun = s u n").words);
doc.body.append(host);
hydratePhonics(host, { lang: "en-US" });
ok("no sound note shown", host.querySelector<HTMLElement>(".ph-nosound")!.hidden === false);
ok("units marked silent", host.querySelector(".ph-unit")!.classList.contains("is-silent"));
ok("nav shown", host.querySelector<HTMLElement>(".ph-nav")!.hidden === false);
const units = () => [...host.querySelectorAll<HTMLElement>('.ph-bw[data-i="0"] .ph-units li')];
ok("tap 1", handlePhonicsClick(units()[0].querySelector("button")!, { lang: "en-US" }));
ok("second sound shows", !units()[1].hidden && units()[2].hidden);
handlePhonicsClick(units()[1].querySelector("button")!, { lang: "en-US" });
handlePhonicsClick(units()[2].querySelector("button")!, { lang: "en-US" });
const go = host.querySelector<HTMLButtonElement>('.ph-bw[data-i="0"] .ph-go')!;
ok("blend button after the last sound", !go.hidden);
handlePhonicsClick(go, { lang: "en-US" });
ok("whole word shown", !host.querySelector<HTMLElement>('.ph-bw[data-i="0"] .ph-whole')!.hidden);
ok("blended", host.querySelector('.ph-bw[data-i="0"] .ph-units')!.classList.contains("is-blended"));
handlePhonicsClick(host.querySelector('[data-ph="next"]')!, { lang: "en-US" });
ok("next word", host.querySelector<HTMLElement>('.ph-bw[data-i="1"]')!.hidden === false && host.querySelector<HTMLElement>('.ph-bw[data-i="0"]')!.hidden);
ok("count updated", host.querySelector(".ph-count")!.textContent === "Word 2 of 2");
ok("next disabled at end", host.querySelector<HTMLButtonElement>('[data-ph="next"]')!.disabled);
ok("other clicks ignored", !handlePhonicsClick(doc.body, { lang: "en-US" }));

// Sounds with a recording stay usable without speech; word buttons without one hide.
const sh2 = doc.createElement("div");
sh2.innerHTML = renderSounds(parseSounds("", "m word=moon").tiles);
hydratePhonics(sh2, { lang: "en-US", lib: new Map([["sound:m", "data:audio/wav;base64,AA"]]) });
ok("recorded sound not silent", !sh2.querySelector(".ph-letter")!.classList.contains("is-silent"));
ok("word without recording shown but silent", !sh2.querySelector<HTMLElement>(".ph-word")!.hidden && sh2.querySelector(".ph-word")!.classList.contains("is-silent"));

// --- Letters ---------------------------------------------------------------------------------
ok("52 letters", TRACE_LETTERS.length === 52 && /^[A-Za-z]+$/.test(TRACE_LETTERS));
for (const ch of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  const lg = letterGuide(ch);
  if (!lg) {
    ok(`letter ${ch}`, false);
    continue;
  }
  const all = lg.strokes.flat();
  const ys = all.map((q) => q[1]);
  const xs = all.map((q) => q[0]);
  const lower = ch === ch.toLowerCase();
  ok(`${ch}: on the writing lines`, Math.min(...ys) >= -1 && Math.max(...ys) <= 151 && Math.min(...xs) === 0 && lg.width <= 100, { ys: [Math.min(...ys), Math.max(...ys)], w: lg.width });
  if (!lower) ok(`${ch}: capital fills top to baseline`, Math.min(...ys) <= 1 && Math.max(...ys) >= 99 && Math.max(...ys) <= 110);
  if ("aceimnorsuvwxz".includes(ch)) ok(`${ch}: small letter between midline and baseline`, Math.min(...ys) >= 20 && Math.max(...ys) <= 101, [Math.min(...ys), Math.max(...ys)]);
  if ("gjpqy".includes(ch)) ok(`${ch}: has a tail`, Math.max(...ys) > 125);
  if ("bdfhklt".includes(ch)) ok(`${ch}: tall`, Math.min(...ys) <= 15);
  for (const [i, st] of lg.strokes.entries()) {
    const name = `${ch} stroke ${i + 1}`;
    ok(`${name}: tracing the guide passes`, checkStroke(st, st).ok);
    const wobble = st.map(([x, y], k): Pt => [x + 5 * Math.sin(k / 4), y + 4]);
    ok(`${name}: a wobbly tracing within tolerance passes`, checkStroke(st, wobble).ok);
    if (st.length > 2) {
      ok(`${name}: backwards fails`, !checkStroke(st, st.slice().reverse()).ok);
      const half = checkStroke(st, st.slice(0, Math.floor(st.length / 2)));
      ok(`${name}: half is "keep going", not done`, !half.ok && half.partial, half);
      const a = st[0];
      const z = st[st.length - 1];
      const L = Math.hypot(z[0] - a[0], z[1] - a[1]);
      const off = L > 5 ? st.map(([x, y]): Pt => [x - (22 * (z[1] - a[1])) / L, y + (22 * (z[0] - a[0])) / L]) : st.map(([x, y]): Pt => [x + 24, y + 24]);
      ok(`${name}: off the path fails`, !checkStroke(st, off).ok);
    }
  }
}
// Two goes at one stroke (pen lifted part way) add up.
const line = letterGuide("l")!.strokes[0];
const first = line.slice(0, 50);
const rest = line.slice(48);
ok("first part partial", checkStroke(line, first).partial);
ok("both parts together pass", checkStroke(line, first.concat(rest)).ok);
// A dot is a tap.
const dot = letterGuide("i")!.strokes[1];
ok("dot by tap", checkStroke(dot, [[dot[0][0] + 3, dot[0][1] - 2]]).ok);
ok("dot missed", !checkStroke(dot, [[dot[0][0] + 40, dot[0][1]]]).ok);
// Tolerance levels.
const shifted = resample(line, 30).map(([x, y]): Pt => [x + 15, y]);
ok("loose accepts 15 off", checkStroke(line, shifted, TOLERANCE.loose).ok);
ok("tight rejects 15 off", !checkStroke(line, shifted, TOLERANCE.tight).ok);
ok("start far away fails", !checkStroke(line, line.slice(30)).startOk);

if (fails) {
  console.log(`${fails} phonics test(s) failed`);
  process.exit(1);
}
console.log("phonics tests passed");
