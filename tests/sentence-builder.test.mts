// Sentence-builder questions (type "build"): the answer UI with the keyboard (jsdom), the
// review view, and the course checker's rules. Grading itself is in tests/questions.test.mts.
// Run: npx tsx tests/sentence-builder.test.mts
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { JSDOM } from "jsdom";
import type { Chosen, Question } from "../src/lib/types.ts";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "https://example.test" });
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  Element: dom.window.Element,
  HTMLElement: dom.window.HTMLElement,
  localStorage: dom.window.localStorage,
  IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });

const { act, createElement, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: QuestionBody } = await import("../src/components/QuestionBody.tsx");
const { normalizeQuestionKind, isCorrect } = await import("../src/lib/questions.ts");
const { bankOrder } = await import("../src/lib/sentenceBuild.ts");
const { checkCourse } = await import("./check-course.mts");

const q = {
  id: "ja-build",
  topic: "Sentences",
  stem: "Build the sentence.",
  ...normalizeQuestionKind({ type: "build", tiles: ["{私|わたし}は", "お{茶|ちゃ}を", "{飲|の}みます"], distractors: ["{水|みず}を"], punctuation: "。", prompt: "I drink tea." }),
} as Question;

let latest: Chosen = [];
function Harness({ start = [] as Chosen }) {
  const [chosen, setChosen] = useState<Chosen>(start);
  latest = chosen;
  return createElement(QuestionBody, { q, order: [], chosen, onChange: setChosen, lang: "ja", seed: "session-1" });
}

const host = document.getElementById("root")!;
const root = createRoot(host);
await act(async () => root.render(createElement(Harness)));

const bankButtons = () => [...host.querySelectorAll<HTMLButtonElement>(".build-bank button")];
const placedButtons = () => [...host.querySelectorAll<HTMLButtonElement>(".build-sentence button")];
const live = () => host.querySelector("[aria-live]")?.textContent ?? "";
const key = async (el: Element, k: string) =>
  act(async () => {
    el.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
  });
const click = async (el: HTMLElement) => act(async () => el.click());
const tileText = (el: Element) => {
  const c = el.cloneNode(true) as Element;
  c.querySelectorAll("rt, rp").forEach((n) => n.remove());
  return c.textContent?.trim();
};

// The bank: every tile is a button, furigana renders, the order is the stable shuffle.
assert.equal(bankButtons().length, 4);
assert.ok(host.querySelector(".build-bank ruby rt"), "furigana on tiles");
assert.deepEqual(bankButtons().map((b) => b.getAttribute("aria-label")), bankOrder(q, "session-1").map((i) => ["私は", "お茶を", "飲みます", "水を"][i]));
assert.equal(host.querySelector(".build-sentence")?.getAttribute("role"), "group");
assert.equal(host.querySelector(".build-sentence")?.getAttribute("lang"), "ja");
assert.ok(host.querySelector(".q-hint")?.textContent?.includes("arrow keys"), "instructions");
assert.ok(placedButtons().length === 0 && host.querySelector(".build-placeholder"));

// Bank arrows move focus between tiles without changing the answer.
bankButtons()[0].focus();
await key(bankButtons()[0], "ArrowRight");
assert.equal(document.activeElement, bankButtons()[1]);
await key(bankButtons()[1], "Home");
assert.equal(document.activeElement, bankButtons()[0]);

// Build it in the wrong order with clicks (Enter/Space on a button is a click).
const byLabel = (label: string) => bankButtons().find((b) => b.getAttribute("aria-label") === label)!;
await click(byLabel("お茶を"));
assert.ok(live().includes("Added “お茶を”") && live().includes("Sentence: お茶を。"), live());
assert.ok(document.activeElement?.closest(".build-bank"), "focus stays in the bank");
await click(byLabel("私は"));
await click(byLabel("飲みます"));
assert.deepEqual(placedButtons().map(tileText), ["お茶を", "私は", "飲みます"]);
assert.equal(placedButtons()[1].getAttribute("aria-label"), "私は, 2 of 3");
assert.ok(host.querySelectorAll(".build-bank .build-tile.ghost").length === 3, "placed tiles leave gaps in the bank");
assert.ok(!isCorrect(q, latest));

// Left arrow on 私は moves it to the front; focus follows the tile.
const watashi = placedButtons()[1];
watashi.focus();
await key(watashi, "ArrowLeft");
assert.deepEqual(placedButtons().map(tileText), ["私は", "お茶を", "飲みます"]);
assert.equal(document.activeElement?.getAttribute("aria-label"), "私は, 1 of 3");
assert.ok(live().includes("position 1 of 3") && live().includes("私はお茶を飲みます。"), live());
assert.ok(isCorrect(q, latest), "built by keyboard");
// An arrow at the end is still handled (so it never changes the question).
const ev = new dom.window.KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true });
await act(async () => void document.activeElement!.dispatchEvent(ev));
assert.ok(ev.defaultPrevented);

// Delete sends a tile back; clicking a placed tile does too.
const tea = placedButtons()[1];
tea.focus();
await key(tea, "Delete");
assert.deepEqual(placedButtons().map(tileText), ["私は", "飲みます"]);
assert.ok(live().includes("Removed “お茶を”"), live());
assert.equal(document.activeElement?.getAttribute("aria-label"), "飲みます, 2 of 2", "focus moves to the next tile");
await click(placedButtons()[1]);
assert.deepEqual(placedButtons().map(tileText), ["私は"]);
await click(host.querySelector<HTMLButtonElement>(".build .row button")!);
assert.equal(placedButtons().length, 0);
assert.deepEqual(latest, []);
assert.ok(live().includes("empty"));
await act(async () => root.unmount());

// After checking: wrong positions are marked and the correct sentence is shown.
const shown = document.createElement("div");
document.body.append(shown);
const r2 = createRoot(shown);
await act(async () => r2.render(createElement(QuestionBody, { q, order: [], chosen: [1, 0, 2], reveal: true, lang: "ja" })));
assert.equal(shown.querySelectorAll("button").length, 0, "no controls after checking");
assert.equal(shown.querySelectorAll(".build-tile.is-wrong").length, 2);
assert.equal(shown.querySelectorAll(".build-tile.is-right").length, 1);
assert.ok(shown.textContent?.includes("(wrong place)"));
const answer = shown.querySelector(".build-answer")!.cloneNode(true) as Element;
answer.querySelectorAll("rt, rp").forEach((n) => n.remove());
assert.ok(answer.textContent?.includes("私はお茶を飲みます。"), answer.textContent);
await act(async () => r2.render(createElement(QuestionBody, { q, order: [], chosen: [0, 1, 2], reveal: true, review: true, lang: "ja" })));
assert.ok(shown.querySelector(".part-mark.ok"), "right in review");
await act(async () => r2.render(createElement(QuestionBody, { q, order: [], chosen: [], reveal: true, review: true, lang: "ja" })));
assert.ok(shown.textContent?.includes("(not answered)"));
await act(async () => r2.unmount());

// German: spaces between tiles by default.
const de = { id: "de", topic: "t", stem: "Build", ...normalizeQuestionKind({ type: "build", tiles: ["Ich", "möchte", "Tee"], punctuation: "." }) } as Question;
const r3 = createRoot(shown);
await act(async () => r3.render(createElement(QuestionBody, { q: de, order: [], chosen: [0, 2, 1], reveal: true, lang: "de" })));
assert.ok(shown.querySelector(".build-answer")?.textContent?.includes("Ich möchte Tee."));
await act(async () => r3.unmount());

// --- The course checker ----------------------------------------------------------------------
for (const f of ["samples/demo-japanese.json", "samples/demo-listening.json"]) assert.deepEqual(await checkCourse(f, { runs: 1 }), [], f);
const dir = mkdtempSync(`${tmpdir()}/build-`);
const file = `${dir}/c.json`;
writeFileSync(
  file,
  JSON.stringify({
    title: "Bad",
    language: { code: "ja", name: "Japanese" },
    lessons: [{ id: "l", title: "L", body: "x" }],
    banks: [{ title: "b", questions: [
      { id: "dup", stem: "s", type: "build", tiles: ["{猫|ねこ}が", "いる"], accept: [["{猫|ねこ}が", "いる"]], distractors: ["いる"] },
      { id: "kana", stem: "s", type: "build", tiles: ["{ねこ|neko}が", "いる"], joiner: " " },
      { id: "all", stem: "s", type: "build", tiles: ["あ", "い"], accept: [["い", "あ"]] },
      { id: "punct", stem: "s", type: "build", tiles: ["いる。", "ねこ"], punctuation: "。" },
    ] }],
  }),
);
const p = await checkCourse(file, { runs: 1 });
const has = (s: string) => assert.ok(p.some((x) => x.includes(s)), `${s}\n${p.join("\n")}`);
has('question dup: "accept" entry 1 is the same as "tiles"');
has("question dup: distractor");
has("question kana tile 1: {ねこ|neko}");
has('question kana: "joiner" is a space in a Japanese course');
has("question all: so many orders are right");
has('question punct: a tile ends with the "punctuation" mark');

// --- The canonical content model accepts build questions and checks them -----------------------
{
  const { readFileSync } = await import("node:fs");
  const { migrateLegacyCourseToCanonical, validateCanonicalAuthoring } = await import("../src/lib/canonicalAuthoring.ts");
  const raw = JSON.parse(readFileSync("samples/demo-japanese.json", "utf8"));
  const { payload } = migrateLegacyCourseToCanonical(raw);
  assert.deepEqual(validateCanonicalAuthoring(payload, { strict: true }), []);
  const built = payload.course.banks.flatMap((b: { questions: Question[] }) => b.questions).find((x: Question) => x.type === "build");
  assert.ok(built?.tiles?.length && built.prompt && built.punctuation === "。");
  const bad = structuredClone(payload);
  const bq = bad.course.banks[0].questions.find((x: Question) => x.type === "build");
  bq.accept = [["{私|わたし}は", "ねこ"]];
  assert.ok(validateCanonicalAuthoring(bad).some((e: string) => e.includes("build:") && e.includes("not in")), "accept must come from the tiles");
  delete bq.accept;
  bq.choices = ["x"];
  assert.ok(validateCanonicalAuthoring(bad).some((e: string) => e.includes("choices")), "build keeps choices empty");
}

// A sentence starts with a capital wherever its first tile came from.
{
  const { buildCorrect, sentenceText, startCase } = await import("../src/lib/sentenceBuild.ts");
  const q = { tiles: ["die Fenster", "müssen", "bis Ende Mai", "geputzt werden"], accept: [["bis Ende Mai", "müssen", "die Fenster", "geputzt werden"]], punctuation: "." };
  assert.equal(startCase("die Fenster"), "Die Fenster");
  assert.equal(startCase("„ja"), "„Ja");
  assert.equal(startCase("日本"), "日本");
  assert.ok(buildCorrect(q, [0, 1, 2, 3]), "authored order");
  assert.ok(buildCorrect(q, [2, 1, 0, 3]), "alternative order starting with a lowercase tile");
  assert.ok(!buildCorrect(q, [1, 0, 2, 3]), "wrong order");
  assert.equal(sentenceText(q, ["bis Ende Mai", "müssen", "die Fenster", "geputzt werden"], "de"), "Bis Ende Mai müssen die Fenster geputzt werden.");
  assert.equal(sentenceText({ ...q, punctuation: "?" }, ["cómo", "te llamas"], "es"), "¿Cómo te llamas?", "Spanish questions open with ¿");
  assert.equal(sentenceText({ ...q, punctuation: "!" }, ["qué padre"], "es"), "¡Qué padre!");
  assert.equal(sentenceText({ ...q, punctuation: "?" }, ["¿cómo", "te llamas"], "es"), "¿Cómo te llamas?", "no second ¿ when the tile has one");
  assert.equal(sentenceText({ ...q, punctuation: "?" }, ["wie", "heißt du"], "de"), "Wie heißt du?");
  const cap = { tiles: ["Am Montag", "fahre", "ich", "nach Berlin"], accept: [["ich", "fahre", "am Montag", "nach Berlin"]] };
  assert.ok(buildCorrect(cap, [2, 1, 0, 3]) === false, "tiles must match apart from the first letter of the sentence");
}

console.log("sentence builder: all passed");
