// Math manipulatives: specs, lesson blocks, moves, checking model questions, words for screen
// readers, community courses, and the controls in a DOM (keyboard only).
// Run: npx tsx tests/manip.test.mts
import { JSDOM } from "jsdom";
import {
  blockBreak,
  blockTrade,
  blocksValue,
  clockAdd,
  coinAdd,
  describe,
  fewestCoins,
  fracSplit,
  manipCorrect,
  manipProblems,
  parseManipBlock,
  protectManipulatives,
  readSpec,
  solution,
  startState,
  targetFromState,
  targetProblems,
  targetText,
  validState,
  type ManipTarget,
} from "../src/lib/manip.ts";
import { answerText, chosenText, isAnswered, isComplete, isCorrect, normalizeQuestionKind, typeLabel } from "../src/lib/questions.ts";
import { checkDoc, toCourse, type CommunityDoc } from "../src/lib/communityFormat.ts";
import type { Question } from "../src/lib/types.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};
const eq = (name: string, a: unknown, b: unknown) => ok(name, JSON.stringify(a) === JSON.stringify(b), `${JSON.stringify(a)} != ${JSON.stringify(b)}`);
const model = (spec: object) => readSpec(spec).model;

// --- Specs -----------------------------------------------------------------------------
let r = readSpec({ kind: "blocks", value: 347 });
eq("blocks start", startState(r.model), [7, 4, 3]);
ok("blocks clean", r.problems.length === 0, r.problems);
ok("unknown kind", readSpec({ kind: "abacus" }).problems[0].includes("unknown kind"));
ok("wrong field for kind", readSpec({ kind: "clock", places: 3 }).problems.some((p) => p.includes('"places"')));
ok("bad time", readSpec({ kind: "clock", time: "13:70" }).problems.some((p) => p.includes("time")));
ok("too many counters", readSpec({ kind: "counters", count: 11 }).problems.some((p) => p.includes("don't fit")));
ok("count2 needs colors", readSpec({ kind: "counters", count2: 2 }).problems.some((p) => p.includes("colors: 2")));
r = readSpec({ kind: "numberline", min: -5, max: 5, at: 2 });
eq("numberline start", startState(r.model), [2]);
r = readSpec({ kind: "numberline", min: 0, max: 2, step: "1/4" });
ok("fraction line", r.model.den === 4 && r.model.step === 0.25 && r.problems.length === 0, r);
ok("at off the ticks", readSpec({ kind: "numberline", min: 0, max: 10, step: 2, at: 3 }).problems.some((p) => p.includes("isn't a tick")));
ok("too many ticks", readSpec({ kind: "numberline", min: 0, max: 1000 }).problems.some((p) => p.includes("too many ticks")));
r = readSpec({ kind: "fractions", bars: ["1/2", "0/4"] });
eq("fraction bars start", startState(r.model), [2, 1, 4, 0]);
ok("bad bar", readSpec({ kind: "fractions", bars: ["5/4"] }).problems.length === 1);
r = readSpec({ kind: "coins", coins: ["pennies", "dime", "quarter"], start: ["dime", "dime"] });
eq("coins offered (plural names)", r.model.coins, [0, 2, 3]);
eq("coins start", startState(r.model), [0, 0, 2, 0, 0, 0]);
ok("start coin not offered", readSpec({ kind: "coins", coins: ["penny"], start: ["dime"] }).problems.some((p) => p.includes("isn't in coins")));
eq("clean spec keeps only valid fields", readSpec({ kind: "clock", time: "3:15", step: 15, junk: 1 }).spec, { kind: "clock", time: "3:15", step: 15 });

// --- Lesson blocks ---------------------------------------------------------------------
let b = parseManipBlock(" coins", "coins: penny, nickel, dime, quarter\nstart: quarter quarter\ncaption: Make 75¢\nreadout: false");
ok("block parses", b.problems.length === 0 && b.model.start[3] === 2 && !b.model.readout && b.model.caption === "Make 75¢", b);
b = parseManipBlock(" numberline", "min: -10\nmax: 10\nat: -3\nhops: 1, 5");
eq("block numbers and lists", [b.model.min, b.model.max, b.model.at, b.model.hops], [-10, 10, -3, [1, 5]]);
b = parseManipBlock(" fractions", '{"bars": ["1/2", "2/4"], "fixed": true}');
ok("JSON body", b.problems.length === 0 && b.model.fixed && b.model.bars.length === 2, b);
ok("garbage line", parseManipBlock(" clock", "hello").problems.some((p) => p.includes("key: value")));
ok("given twice", parseManipBlock(" clock", "time: 3:00\ntime: 4:00").problems.some((p) => p.includes("twice")));
ok("no kind", parseManipBlock("", "value: 3").problems.some((p) => p.includes("no kind")));
const lesson = "Intro\n\n```manipulative blocks\nvalue: 124\ncaption: Build <124>\n```\n\nAfter\n\n```manipulative clock\ntime: 9:30\n```";
eq("lesson problems", manipProblems(lesson), []);
ok("unclosed", manipProblems("```manipulative clock\ntime: 3:00\n").some((p) => p.includes("never closed")));
ok("problem numbered", manipProblems("```manipulative clock\ntime: 3:00\n```\n\n```manipulative blocks\nplaces: 9\n```")[0].startsWith("manipulative 2:"));
const prot = protectManipulatives(lesson);
ok("placeholders", !prot.text.includes("```manipulative") && /XMANIPX1XMANIPX/.test(prot.text));
const html = prot.restore(prot.text.split(/\n\n+/).map((p) => `<p>${p}</p>`).join(""));
ok("restored figure with spec", (html.match(/<figure class="manip"/g) ?? []).length === 2 && html.includes("data-manip=\"{&quot;kind&quot;:&quot;blocks&quot;"));
ok("caption escaped", html.includes("Build &lt;124&gt;") && !html.includes("<124>"));
ok("static description", html.includes("1 hundred, 2 tens, 4 ones: 124") && html.includes("The clock shows 9:30"));
ok("static svg hidden from screen readers", /<svg class="mp-svg[^"]*"[^>]*aria-hidden="true"/.test(html));

// --- Moves -----------------------------------------------------------------------------
eq("break a hundred", blockBreak([7, 4, 3], 2), [7, 14, 2]);
eq("trade ones", blockTrade([12, 4, 3], 0), [2, 5, 3]);
eq("can't trade 9", blockTrade([9, 4, 3], 0), [9, 4, 3]);
ok("value kept", blocksValue(blockBreak([7, 4, 3], 2)) === 347);
eq("clock wraps hour", clockAdd([2, 55], 10), [3, 5]);
eq("clock back past 12", clockAdd([12, 0], -5), [11, 55]);
eq("clock 12 o'clock", clockAdd([11, 30], 30), [12, 0]);
eq("split keeps amount", fracSplit([2, 1], 0), [4, 2]);
eq("coins limit", coinAdd([0, 0, 0, 0, 0, 0], 0, -1), [0, 0, 0, 0, 0, 0]);
eq("fewest 68¢", fewestCoins([0, 1, 2, 3], 68), [3, 1, 1, 2, 0, 0]);
eq("fewest 30¢ without nickels", fewestCoins([0, 2, 3], 30), [0, 0, 3, 0, 0, 0]);
eq("fewest 31¢ without nickels (greedy would use 7)", fewestCoins([0, 2, 3], 31), [1, 0, 3, 0, 0, 0]);
eq("fewest 30¢ dimes only", fewestCoins([2], 30), [0, 0, 3, 0, 0, 0]);
ok("unmakeable", fewestCoins([2], 15) === null);

// --- Checking ----------------------------------------------------------------------------
const check = (spec: object, t: ManipTarget, s: number[]) => manipCorrect(model(spec), t, s);
ok("347 standard", check({ kind: "blocks" }, { value: 347 }, [7, 4, 3]));
ok("347 regrouped", check({ kind: "blocks" }, { value: 347 }, [7, 14, 2]));
ok("347 regrouped not fewest", !check({ kind: "blocks" }, { value: 347, fewest: true }, [7, 14, 2]));
ok("top place may exceed 9 with fewest", check({ kind: "blocks", places: 2 }, { value: 120, fewest: true }, [0, 12]));
ok("wrong value", !check({ kind: "blocks" }, { value: 347 }, [7, 3, 3]));
ok("counters", check({ kind: "counters" }, { count: 5 }, [1, 0, 1, 1, 0, 1, 1, 0, 0, 0]));
ok("counter colors", check({ kind: "counters", colors: 2 }, { colors: [3, 2] }, [1, 1, 1, 2, 2, 0, 0, 0, 0, 0]));
ok("counter colors wrong mix", !check({ kind: "counters", colors: 2 }, { colors: [3, 2] }, [1, 1, 2, 2, 2, 0, 0, 0, 0, 0]));
ok("line -3", check({ kind: "numberline", min: -5, max: 5 }, { at: -3 }, [-3]));
ok("line fraction", check({ kind: "numberline", max: 2, step: "1/4" }, { at: "3/4" }, [0.75]));
ok("3/4 equal fraction", check({ kind: "fractions" }, { values: ["3/4"] }, [8, 6]));
ok("3/4 exact rejects 6/8", !check({ kind: "fractions" }, { values: ["3/4"], exact: true }, [8, 6]));
ok("clock", check({ kind: "clock" }, { time: "2:45" }, [2, 45]));
ok("clock wrong", !check({ kind: "clock" }, { time: "2:45" }, [9, 10]));
ok("68¢ any way", check({ kind: "coins" }, { cents: 68 }, [8, 0, 6, 0, 0, 0]));
ok("68¢ fewest rejects", !check({ kind: "coins" }, { cents: 68, fewest: true }, [8, 0, 6, 0, 0, 0]));
ok("68¢ fewest", check({ kind: "coins" }, { cents: 68, fewest: true }, [3, 1, 1, 2, 0, 0]));
ok("bad state rejected", !check({ kind: "clock" }, { time: "2:45" }, [2, 45, 1]));
ok("valid state", validState(model({ kind: "fractions", bars: ["0/4"] }), [4, 3]) && !validState(model({ kind: "fractions" }), [4, 5]));

ok("target needs fields", targetProblems(model({ kind: "coins" }), {}).some((p) => p.includes("cents")));
ok("target unreachable", targetProblems(model({ kind: "coins", coins: ["dime"] }), { cents: 15 }).some((p) => p.includes("can't be made")));
ok("target already shown", targetProblems(model({ kind: "blocks", value: 5 }), { value: 5 }).some((p) => p.includes("already shows")));
ok("target fixed parts", targetProblems(model({ kind: "fractions", bars: ["0/4"], fixed: true }), { values: ["1/3"] }).some((p) => p.includes("can't show")));
ok("target fixed parts fine", targetProblems(model({ kind: "fractions", bars: ["0/8"], fixed: true }), { values: ["3/4"] }).length === 0);
ok("target clock step", targetProblems(model({ kind: "clock" }), { time: "2:47" }).some((p) => p.includes("5-minute")));
ok("target wrong key", targetProblems(model({ kind: "clock" }), { time: "2:45", cents: 3 }).some((p) => p.includes('"cents"')));
for (const [spec, t] of [
  [{ kind: "counters", frames: 2 }, { count: 13 }],
  [{ kind: "blocks", places: 4 }, { value: 2048, fewest: true }],
  [{ kind: "numberline", min: -10, max: 10 }, { at: -7 }],
  [{ kind: "fractions", bars: ["0/1", "0/1"] }, { values: ["2/3", "3/4"] }],
  [{ kind: "clock", step: 1 }, { time: "7:23" }],
  [{ kind: "coins", coins: ["penny", "nickel", "dime", "quarter", "half", "dollar"] }, { cents: 187, fewest: true }],
] as [object, ManipTarget][]) {
  const m = model(spec);
  const sol = solution(m, t);
  ok(`solution right: ${m.kind}`, !!sol && manipCorrect(m, t, sol), sol);
  ok(`target from solution: ${m.kind}`, !!sol && manipCorrect(m, targetFromState(m, sol!, { fewest: t.fewest, exact: t.exact }), sol!));
}
eq("target from fraction line", targetFromState(model({ kind: "numberline", max: 2, step: "1/4" }), [1.25]), { at: "5/4" });

// --- Words -------------------------------------------------------------------------------
eq("blocks words", describe(model({ kind: "blocks" }), [7, 4, 3]), "3 hundreds, 4 tens, 7 ones: 347");
eq("blocks words singular", describe(model({ kind: "blocks", readout: false }), [1, 1, 1]), "1 hundred, 1 ten, 1 one");
eq("coins words", describe(model({ kind: "coins" }), [3, 1, 1, 2, 0, 0]), "2 quarters, 1 dime, 1 nickel, 3 pennies: 68¢");
eq("no coins", describe(model({ kind: "coins" }), [0, 0, 0, 0, 0, 0]), "No coins: 0¢");
eq("dollars", describe(model({ kind: "coins" }), [0, 0, 0, 0, 1, 1]), "1 dollar coin, 1 half dollar: $1.50");
eq("clock words", describe(model({ kind: "clock" }), [2, 45]), "The clock shows 2:45");
eq("clock hands (no readout)", describe(model({ kind: "clock", readout: false }), [2, 47]), "On the clock, the hour hand is between 2 and 3; the minute hand is 2 marks past 9");
eq("fractions compare", describe(model({ kind: "fractions", bars: ["1/2", "2/4"] }), [2, 1, 4, 2]), "Bar 1: 1 of 2 parts shaded (1/2). Bar 2: 2 of 4 parts shaded (2/4). 1/2 is equal to 2/4");
eq("line words", describe(model({ kind: "numberline", max: 2, step: "1/4" }), [1.25]), "The marker is at 1 1/4");
eq("negative line", describe(model({ kind: "numberline", min: -5, max: 5 }), [-3]), "The marker is at −3");
eq("two colors", describe(model({ kind: "counters", colors: 2 }), [1, 1, 2, 0, 0, 0, 0, 0, 0, 0]), "2 red and 1 yellow: 3 counters in all");
ok("target text", targetText(model({ kind: "coins" }), { cents: 68, fewest: true }).startsWith("68¢ with the fewest coins (for example 2 quarters"));

// --- Questions ---------------------------------------------------------------------------
const raw = { type: "model", stem: "Show 347 with base-ten blocks.", model: { kind: "blocks", extra: 1 }, target: { value: 347 } };
ok("normalize rejects bad field", (() => { try { normalizeQuestionKind(raw); return false; } catch (e) { return /model problem/.test((e as Error).message); } })());
const kind = normalizeQuestionKind({ ...raw, model: { kind: "blocks" } });
const q: Question = { id: "m1", topic: "Place value", stem: raw.stem, ...kind };
eq("normalized", [q.type, q.choices, q.answer, q.model, q.target], ["model", [], [], { kind: "blocks" }, { value: 347 }]);
ok("normalize rejects bad target", (() => { try { normalizeQuestionKind({ ...raw, model: { kind: "blocks" }, target: { cents: 3 } }); return false; } catch (e) { return /target problem/.test((e as Error).message); } })());
ok("not answered until changed", !isAnswered(q, []) && !isAnswered(q, undefined));
ok("answered", isAnswered(q, [0, 0, 1]) && isComplete(q, [0, 0, 1]));
ok("correct", isCorrect(q, [7, 4, 3]) && !isCorrect(q, [7, 4, 2]));
ok("saved state survives JSON", isCorrect(q, JSON.parse(JSON.stringify([7, 4, 3]))));
eq("chosen text", chosenText(q, [7, 14, 2]), "2 hundreds, 14 tens, 7 ones: 347");
ok("answer text", answerText(q).startsWith("347 (for example 3 hundreds"));
eq("type label", typeLabel(q), "Build it with blocks");

// --- Community courses -----------------------------------------------------------------------
const doc = {
  format: "erudior-community",
  version: 1,
  title: "Manipulatives",
  description: "d",
  subject: "Math",
  level: "Elementary School",
  type: "Course",
  lessons: [
    {
      id: "l1",
      title: "Place value",
      blocks: [
        { type: "text", md: "Build numbers." },
        { type: "manipulative", spec: { kind: "blocks", value: 23, caption: "Try it" } },
        { type: "question", id: "q1", kind: "model", stem: "Set the clock to 2:45.", choices: [], answer: [], explanation: "", model: { kind: "clock" }, target: { time: "2:45" } },
      ],
    },
  ],
  decks: [],
} as unknown as CommunityDoc;
eq("community doc checks", checkDoc(doc, true), []);
const bad = JSON.parse(JSON.stringify(doc));
bad.lessons[0].blocks[2].target = { time: "2:47" };
ok("community bad target", checkDoc(bad, true).some((e: string) => e.includes("5-minute")));
const course = toCourse(doc, { id: "x", version: 1, review: "unreviewed", author: "a" } as never, (id) => id) as { lessons: { body: string }[]; banks: { questions: Question[] }[] };
ok("community lesson block", course.lessons[0].body.includes('```manipulative blocks\n{"kind":"blocks","caption":"Try it","value":23}\n```'), course.lessons[0].body);
const cq = course.banks[0].questions[0];
ok("community question", cq.type === "model" && isCorrect({ ...cq, id: "q1", topic: "t" } as Question, [2, 45]), cq);
eq("community block round trip", manipProblems(course.lessons[0].body), []);

// --- Controls in a DOM (keyboard only) -----------------------------------------------------
const dom = new JSDOM("<!doctype html><html><body><div id=root></div></body></html>", { pretendToBeVisual: true });
const g = globalThis as Record<string, unknown>;
g.window = dom.window;
g.document = dom.window.document;
g.HTMLElement = dom.window.HTMLElement;
g.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { act } = React;
const { ManipModel } = await import("../src/components/Manipulative.tsx");
const doc2 = dom.window.document;
const root = createRoot(doc2.getElementById("root")!);
let state: number[] = [];
const show = async (spec: object, s?: number[]) => {
  const m = model(spec);
  state = s ?? startState(m);
  const draw = () => React.createElement(ManipModel, { model: m, state, onChange: (n: number[]) => ((state = n), root.render(draw())) });
  await act(async () => root.render(draw()));
};
const press = async (label: string) => {
  const btn = [...doc2.querySelectorAll("button")].find((x) => (x.getAttribute("aria-label") ?? x.textContent) === label);
  if (!btn) throw new Error(`no button "${label}"`);
  await act(async () => btn.click());
};
const live = () => doc2.querySelector("[aria-live]")?.textContent;

await show({ kind: "blocks" });
for (let i = 0; i < 3; i++) await press("Add a hundred");
for (let i = 0; i < 4; i++) await press("Add a ten");
for (let i = 0; i < 7; i++) await press("Add a one");
eq("blocks by buttons", state, [7, 4, 3]);
eq("announced", live(), "3 hundreds, 4 tens, 7 ones: 347");
await press("Break a hundred into 10 tens");
eq("break by button", state, [7, 14, 2]);
await press("Trade 10 tens for a hundred");
eq("trade by button", state, [7, 4, 3]);
await press("Start over");
eq("start over", state, [0, 0, 0]);
const take = [...doc2.querySelectorAll("button")].find((x) => x.getAttribute("aria-label") === "Take away a one")!;
ok("unusable button stays focusable", take.getAttribute("aria-disabled") === "true" && !take.disabled);
await act(async () => take.click());
eq("unusable button does nothing", state, [0, 0, 0]);

await show({ kind: "clock" });
const clock = doc2.querySelector<HTMLElement>("[role=slider]")!;
const key = async (el: HTMLElement, k: string) => act(async () => void el.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: k, bubbles: true })));
await key(clock, "PageUp");
await key(clock, "PageUp");
for (let i = 0; i < 9; i++) await key(clock, "ArrowRight");
eq("clock by keys", state, [2, 45]);
eq("clock slider text", clock.getAttribute("aria-valuetext"), "The clock shows 2:45");
await key(clock, "ArrowLeft");
eq("clock back", state, [2, 40]);

await show({ kind: "numberline", min: -5, max: 5, hops: [1, 2] });
const line = doc2.querySelector<HTMLElement>("[role=slider]")!;
await key(line, "ArrowLeft");
await key(line, "PageDown");
eq("line keys (step, biggest hop)", state, [-3]);
await press("Hop forward 2");
eq("hop button", state, [-1]);
ok("hops drawn", doc2.querySelectorAll(".mp-hop").length === 3);

await show({ kind: "coins" });
await press("Add a quarter");
await press("Add a quarter");
await press("Add a dime");
await press("Add a nickel");
for (let i = 0; i < 3; i++) await press("Add a penny");
eq("coins by buttons", state, [3, 1, 1, 2, 0, 0]);
ok("coins announced", live() === "2 quarters, 1 dime, 1 nickel, 3 pennies: 68¢");

await show({ kind: "fractions", bars: ["0/1"] });
await press("More parts in the bar");
await press("Cut each part of the bar in half");
for (let i = 0; i < 3; i++) await press("Shade one more part of the bar");
eq("fractions by buttons", state, [4, 3]);
eq("fractions announced", live(), "3 of 4 parts shaded (3/4)");

await show({ kind: "counters", colors: 2 });
await press("Add a red counter");
await press("Add a yellow counter");
await press("Add a red counter");
eq("counters fill in order", state, [1, 2, 1, 0, 0, 0, 0, 0, 0, 0]);
await press("Take away a red counter");
eq("counters remove last of a color", state, [1, 2, 0, 0, 0, 0, 0, 0, 0, 0]);

await act(async () => root.render(React.createElement(ManipModel, { model: model({ kind: "clock" }), state: [3, 0], disabled: true })));
ok("read only: no buttons or sliders", !doc2.querySelector("#root button") && !doc2.querySelector("[role=slider]"));
await act(async () => root.unmount());

if (fails) {
  console.log(`${fails} manipulative test(s) failed`);
  process.exit(1);
}
console.log("manipulative tests passed");
