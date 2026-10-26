// Maps, timelines and simulations: block parsing and checks, map geometry, dates, physics
// models, the map/timeline question kinds and the course checker.
// Run: npx tsx tests/widgets.test.mts
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { canonicalPlace, samePlace } from "../src/lib/mapNames.ts";
import { mapBlockProblems, parseCoord, parseMapSpec, renderMapBlock } from "../src/lib/mapSpec.ts";
import { baseNames, buildMap, readSvg } from "../src/lib/mapGeo.ts";
import { hydrateTimelines, parseDate, parseSpan, parseTimeline, renderTimeline, timelineProblems, yearLabel } from "../src/lib/timeline.ts";
import { parseSim, renderSim, simProblems, simValues } from "../src/lib/sims.ts";
import { circuitFacts, gasPressure, pendulum, population, projectile, projectileFacts } from "../src/lib/simModels.ts";
import { lessonBlockProblems, protectLessonBlocks } from "../src/lib/lessonBlocks.ts";
import { answerText, chosenText, isAnswered, isComplete, isCorrect, normalizeQuestionKind, partsCorrect, typeLabel } from "../src/lib/questions.ts";
import type { Question } from "../src/lib/types.ts";
import { checkCourse } from "./check-course.mts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};
const throws = (name: string, f: () => unknown, re: RegExp) => {
  try {
    f();
    ok(`${name} (no error)`, false);
  } catch (e) {
    ok(name, re.test((e as Error).message), (e as Error).message);
  }
};
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// --- Place names --------------------------------------------------------------------
ok("US abbreviation", canonicalPlace("us", "CO") === "Colorado");
ok("US case", samePlace("us", "colorado", "Colorado"));
ok("world alias", canonicalPlace("world", "USA") === "United States");
ok("world rename", canonicalPlace("world", "Dem. Rep. Congo") === "Democratic Republic of the Congo");
ok("accents ignored", samePlace("world", "Cote d'Ivoire", "Côte d'Ivoire"));
ok("ivory coast", samePlace("world", "Ivory Coast", "Côte d'Ivoire"));
ok("different places differ", !samePlace("us", "Colorado", "Utah"));
ok("2-letter only for states", canonicalPlace("world", "CO") === "CO");

// --- Map spec --------------------------------------------------------------------
ok("lat/lon", JSON.stringify(parseCoord("39.74, -104.99")) === "[39.74,-104.99]");
ok("N/W", JSON.stringify(parseCoord("39.74N, 104.99W")) === "[39.74,-104.99]");
ok("out of range", parseCoord("120, 10") === null);
ok("plain x,y", JSON.stringify(parseCoord("400, 300", true)) === "[400,300]");
let spec = parseMapSpec("base: us\ntitle: T\nview: fit\nregion: CO, Utah | West\nregion: Texas\npoint: Denver | 39.74, -104.99 | Cities\nroute: R | 38, -90; 46, -123\nline: L | 30, -100; 40, -100\nlabels: on");
ok("clean spec", spec.problems.length === 0, spec.problems);
ok("groups in order", spec.groups.join() === "West,Cities");
ok("route arrow / line none", spec.routes[0].arrow && !spec.routes[1].arrow);
ok("labels on", spec.showLabels === "marked");
spec = parseMapSpec("base: mars\npoint: X | nowhere\nwhatever\nview: 1, 2 to nope");
ok("bad base", spec.problems.some((p) => p.includes("base must be")));
ok("bad point", spec.problems.some((p) => p.includes('point "X"')));
ok("stray line", spec.problems.some((p) => p.includes("isn't understood")));
ok("bad view", spec.problems.some((p) => p.includes("corners")));
ok("geojson implies base none", parseMapSpec('geojson: {"type":"FeatureCollection","features":[]}').base === "none");
ok("none needs shapes", parseMapSpec("base: none").problems.length === 1);
ok("unclosed block", mapBlockProblems("```map\nbase: us\n").some((p) => p.includes("never closed")));
const mapHtml = renderMapBlock("base: world\ntitle: The *Silk* Road\nregion: China | Start\npoint: Xi'an | 34.3, 108.9", (s) => `<p>${s}</p>`, "k1");
ok("map html has key", mapHtml.includes('class="map-key"') && mapHtml.includes("Start") && mapHtml.includes("Xi&#39;an"));
ok("map html carries spec", mapHtml.includes("data-geo-map=") && !mapHtml.includes("<script"));

// --- Map geometry ------------------------------------------------------------------
const world = await baseNames("world");
ok("world has 177 countries", world.length === 177, world.length);
ok("world names renamed", world.includes("United States") && world.includes("Bosnia and Herzegovina") && !world.includes("Bosnia and Herz."));
const us = await baseNames("us");
ok("us has 50 states + DC", us.length === 51, us.length);
let built = await buildMap(parseMapSpec("base: us\nregion: CO, Wyoming | West\npoint: Denver | 39.74, -104.99\nview: fit\nregion: Atlantis"));
ok("missing name reported", built.missing.join() === "Atlantis");
ok("CO marked", built.regions.find((r) => r.name === "Colorado")?.group === 0);
ok("unmarked stays unmarked", built.regions.find((r) => r.name === "Ohio")?.group === undefined);
const co = built.regions.find((r) => r.name === "Colorado")!;
const den = built.points[0];
ok("Denver inside Colorado's box", den.x > co.box[0] && den.x < co.box[2] && den.y > co.box[1] && den.y < co.box[3]);
ok("fit view zooms in", built.view[2] < built.width * 0.6, built.view);
built = await buildMap(parseMapSpec("base: world"));
ok("Antarctica left off", !built.regions.some((r) => r.name === "Antarctica") && built.regions.length === 176);
built = await buildMap(parseMapSpec("base: world\nregion: Antarctica"));
ok("Antarctica when asked", built.regions.some((r) => r.name === "Antarctica"));
built = await buildMap(parseMapSpec("base: world\nview: France"));
const fr = built.regions.find((r) => r.name === "France")!;
ok("France label in Europe, not Guiana", fr.c[0] > built.width / 2 - 60);
ok("view: France is small", built.view[2] < 300, built.view);
// GeoJSON in RFC 7946 winding (counterclockwise) is drawn as the shape, not the whole globe.
const gj = JSON.stringify({ type: "Feature", properties: { name: "Box" }, geometry: { type: "Polygon", coordinates: [[[-109, 37], [-102, 37], [-102, 41], [-109, 41], [-109, 37]]] } });
built = await buildMap(parseMapSpec(`geojson: ${gj}\nregion: Box`));
ok("geojson region", built.regions.length === 1 && built.regions[0].group === -1);
ok("geojson rewound (box fills the width, not a sliver)", built.regions[0].box[2] - built.regions[0].box[0] > 800, built.regions[0].box);
built = await buildMap(parseMapSpec(`geojson: data:application/json;base64,${Buffer.from(gj).toString("base64")}`));
ok("geojson data URL", built.regions[0]?.name === "Box");
// SVG: only shape geometry is read.
const svg = readSvg('<svg viewBox="0 0 200 100"><script>alert(1)</script><rect id="A" x="0" y="0" width="100" height="100"/><path d="M100 0h100v100h-100z"><title>B</title></path><circle cx="5" cy="5" r="2"/><path id="bad" d="M0 0 url(javascript:x)"/></svg>');
ok("svg named shapes", svg.named.map((s) => s.name).join() === "A,B", svg.named);
ok("svg decor", svg.decor.length === 1);
built = await buildMap(parseMapSpec('svg: <svg viewBox="0 0 200 100"><rect data-name="Gym" x="0" y="0" width="100" height="100"/></svg>\npoint: Door | 100, 50'));
ok("svg scaled to width", built.width === 960 && near(built.height, 480, 0.5) && built.points[0].x === 480);

// --- Dates and timelines ------------------------------------------------------------
ok("year", parseDate("1776")?.y === 1776);
ok("BCE astronomical", parseDate("44 BCE")?.y === -43);
ok("BC", parseDate("44 BC")?.y === -43);
ok("AD prefix", parseDate("AD 476")?.y === 476);
ok("circa", parseDate("c. 3000 BCE")?.approx === true && parseDate("c. 3000 BCE")?.y === -2999);
ok("month day year", near(parseDate("July 4, 1776")!.y, 1776 + 6 / 12 + 3 / 365, 1e-9));
ok("ISO", near(parseDate("1969-07-20")!.y, 1969 + 6 / 12 + 19 / 365, 1e-9));
ok("day month year", near(parseDate("15 March 44 BCE")!.y, -43 + 2 / 12 + 14 / 365, 1e-9));
ok("million years ago", parseDate("66 million years ago")?.y === 2000 - 66e6);
ok("mya", parseDate("66 mya")?.y === 2000 - 66e6);
ok("nonsense", parseDate("the olden days") === null);
ok("bad month", parseDate("Smarch 3, 1990") === null);
let sp = parseSpan("753–509 BCE")!;
ok("era on both ends", sp.a.y === -752 && sp.b!.y === -508);
sp = parseSpan("27 BCE – 14 CE")!;
ok("BCE to CE", sp.a.y === -26 && sp.b!.y === 14);
ok("plain year range", parseSpan("1861-1865")?.b?.y === 1865);
ok("to", parseSpan("1914 to 1918")?.b?.y === 1918);
sp = parseSpan("15th century")!;
ok("century", sp.a.y === 1401 && sp.b!.y === 1500);
sp = parseSpan("5th century BCE")!;
ok("century BCE", sp.a.y === -499 && sp.b!.y === -400);
ok("decade", parseSpan("1960s")?.b?.y === 1969);
ok("labels", yearLabel(-43, true) === "44 BCE" && yearLabel(1776, false) === "1776" && yearLabel(14, true) === "14 CE" && yearLabel(2000 - 66e6, true) === "66 million years ago");
const tl = parseTimeline("title: Rome\nevent: 476 CE | Fall | Rome\nevent: 44 BCE | Caesar | Rome\nera: 509–27 BCE | Republic\nevent: 264–146 BCE | Punic Wars | Wars");
ok("timeline clean", tl.problems.length === 0, tl.problems);
ok("events sorted oldest first", tl.events.map((e) => e.text).join() === "Punic Wars,Caesar,Fall");
ok("categories", tl.cats.join() === "Rome,Wars");
const tp = timelineProblems("```timeline\nevent: someday | X\nera: 1900 | Not a range\nevent: 1900–1800 | Backwards\n```");
ok("timeline problems", tp.length === 3, tp);
const tlHtml = renderTimeline("event: 1969 | Moon | US\nevent: 1957 | Sputnik | USSR\nera: 1955–1975 | Space race", (s) => `<p>${s}</p>`, "t");
ok("timeline html ordered list", /<ol class="tl-events"[^>]*>.*Sputnik.*Moon/.test(tlHtml));
ok("timeline positions", tlHtml.includes('data-a="1957"') && tlHtml.includes('data-b="1975"'));
// Hydrating in a too-narrow (or unmeasured) box keeps the list.
const dom = new JSDOM(`<!doctype html><div id="r">${tlHtml}</div>`);
(globalThis as Record<string, unknown>).document = dom.window.document;
const undo = hydrateTimelines(dom.window.document.getElementById("r")!);
ok("narrow stays a list", !dom.window.document.querySelector(".tl-live") && !!dom.window.document.querySelector(".tl-events"));
undo();
delete (globalThis as Record<string, unknown>).document;

// --- Simulations --------------------------------------------------------------------
let sim = parseSim("projectile", "speed: 30\nangle: 60 [10, 80]\nfixed: gravity\ntitle: Throw");
ok("sim clean", sim.problems.length === 0, sim.problems);
ok("sim values", simValues(sim).speed === 30 && simValues(sim).gravity === 9.8 && sim.ranges.angle.join() === "10,80");
sim = parseSim("projectile", "speed: 300\nangle: 60 [80, 10]\nfixed: color\nwind: 3");
ok("sim problems", sim.problems.length === 4, sim.problems);
ok("unknown kind", parseSim("rocket", "").problems.some((p) => p.includes("unknown kind")));
ok("choice value", parseSim("circuit", "layout: sideways").problems.some((p) => p.includes("series or parallel")));
ok("sim block problems", simProblems("```sim\n```").length === 1);
ok("sim static html lists settings", renderSim("pendulum", "length: 2", (s) => s, "p").includes("String length: 2.0 m"));
// Projectile: range v² sin 2θ / g on flat ground.
const pv = { speed: 20, angle: 45, height: 0, gravity: 9.8 };
ok("projectile range", near(projectileFacts(pv).range, (400 * 1) / 9.8, 1e-9));
let ps = projectile.init(pv);
for (let i = 0; i < 400 && !projectile.done!(ps, pv); i++) ps = projectile.step(ps, 1 / 60, pv);
ok("projectile lands at the range", ps.landed && near(ps.x, 400 / 9.8, 1e-6) && ps.y === 0);
ok("projectile from a height goes farther", projectileFacts({ ...pv, height: 10 }).range > projectileFacts(pv).range);
// Pendulum: small swings match 2π√(L/g).
const pd = { length: 1, angle: 5, gravity: 9.8, damping: 0 };
let st = pendulum.init(pd);
for (let i = 0; i < 600; i++) st = pendulum.step(st, 1 / 60, pd);
const per = st.crossings[st.crossings.length - 1] - st.crossings[st.crossings.length - 2];
ok("pendulum period", near(per, 2 * Math.PI * Math.sqrt(1 / 9.8), 0.005), per);
const big = { ...pd, angle: 90 };
st = pendulum.init(big);
for (let i = 0; i < 600; i++) st = pendulum.step(st, 1 / 60, big);
const perBig = st.crossings[st.crossings.length - 1] - st.crossings[st.crossings.length - 2];
ok("big swings are slower (≈1.18×)", near(perBig / per, 1.18, 0.01), perBig / per);
// Circuits.
let cf = circuitFacts({ voltage: 9, r1: 10, r2: 20, r3: 0, layout: "series" });
ok("series", cf.total === 30 && near(cf.I, 0.3, 1e-12) && near(cf.each[1].V, 6, 1e-12));
cf = circuitFacts({ voltage: 9, r1: 10, r2: 20, r3: 0, layout: "parallel" });
ok("parallel", near(cf.total, 20 / 3, 1e-12) && near(cf.each[0].I, 0.9, 1e-12) && near(cf.I, 1.35, 1e-12));
cf = circuitFacts({ voltage: 12, r1: 10, r2: 10, r3: 10, layout: "parallel" });
ok("three in parallel", near(cf.total, 10 / 3, 1e-12));
// Gas: 1 mol at 273.15 K in 22.4 L ≈ 1 atm.
ok("gas STP", near(gasPressure(1, 273.15, 22.414) / 101.325, 1, 0.001));
// Populations: logistic approaches the capacity; predator–prey keeps both alive and cycles.
const lv = { model: "logistic", start: 10, rate: 0.5, capacity: 500 };
let pp = population.init(lv);
for (let i = 0; i < 40; i++) pp = population.step(pp, 1, lv);
ok("logistic levels off", near(pp.a, 500, 1));
const pr = { model: "predator-prey", prey: 40, predators: 9, birth: 0.6, catch: 0.025, gain: 0.01, death: 0.5 };
pp = population.init(pr);
let minA = Infinity, maxA = 0;
for (let i = 0; i < 400; i++) {
  pp = population.step(pp, 0.1, pr);
  minA = Math.min(minA, pp.a);
  maxA = Math.max(maxA, pp.a);
}
ok("predator-prey cycles", minA > 1 && maxA > 60 && pp.b > 0, [minA, maxA]);

// --- Lesson blocks in Markdown -------------------------------------------------------
const md = "Intro\n\n```map\nbase: us\nregion: CO\n```\n\nMiddle\n\n```timeline\nevent: 1776 | Independence\n```\n\n```sim gas\n```\n\nEnd";
const prot = protectLessonBlocks(md, (s) => `<p>${s}</p>`);
ok("three placeholders", (prot.text.match(/XLBLOCKX\d+XLBLOCKX/g) ?? []).length === 3);
const restored = prot.restore(prot.text.replace(/\n\n(XLBLOCKX\d+XLBLOCKX)\n\n/g, "<p>$1</p>"));
ok("restored", restored.includes('class="geo-map"') && restored.includes('class="tl"') && restored.includes('class="sim"') && !restored.includes("XLBLOCKX"));
ok("no blocks untouched", protectLessonBlocks("plain", (s) => s).text === "plain");
ok("block problems combined", lessonBlockProblems("```map\nbase: mars\n```\n\n```sim nope\n```").length === 2);

// --- Question kinds ----------------------------------------------------------------------
const find = { id: "f", topic: "t", stem: "Click Colorado", ...normalizeQuestionKind({ type: "map", map: "base: us", targets: ["CO"] }) } as Question;
ok("find kind", find.type === "map" && find.targets?.join() === "CO" && find.choices.length === 0);
ok("find answered", !isAnswered(find, []) && isAnswered(find, ["Utah"]));
ok("find right (alias)", isCorrect(find, ["Colorado"]));
ok("find wrong", !isCorrect(find, ["Utah"]));
ok("find extra pick wrong", !isCorrect(find, ["Colorado", "Utah"]));
ok("find label", typeLabel(find) === "Find it on the map" && answerText(find) === "CO" && chosenText(find, ["Utah"]) === "Utah");
const multi = { id: "m", topic: "t", stem: "Iberia", ...normalizeQuestionKind({ type: "map", map: "base: world", targets: ["Spain", "Portugal"] }) } as Question;
ok("multi complete only with two", !isComplete(multi, ["Spain"]) && isComplete(multi, ["Spain", "Portugal"]));
ok("multi parts", partsCorrect(multi, ["Portugal"]).join() === "false,true");
ok("multi order free", isCorrect(multi, ["Portugal", "Spain"]));
const marks = { id: "k", topic: "t", stem: "Name", ...normalizeQuestionKind({ type: "map", map: "base: world", marks: ["Brazil", "Peru"] }) } as Question;
ok("marks default choices", marks.choices.join() === "Brazil,Peru" && marks.answer.join() === "0,1");
ok("marks grading", isCorrect(marks, [0, 1]) && !isCorrect(marks, [1, 0]) && typeLabel(marks) === "Label the map");
throws("map needs map", () => normalizeQuestionKind({ type: "map", targets: ["X"] }), /needs a "map"/);
throws("map spec problem", () => normalizeQuestionKind({ type: "map", map: "base: mars", targets: ["X"] }), /problem in its "map"/);
throws("map needs targets or marks", () => normalizeQuestionKind({ type: "map", map: "base: us" }), /targets/);
throws("map not both", () => normalizeQuestionKind({ type: "map", map: "base: us", targets: ["CO"], marks: ["UT", "WY"] }), /both/);
const tq = { id: "tl", topic: "t", stem: "Place", ...normalizeQuestionKind({ type: "timeline", slots: ["44 BCE", "476 CE"], choices: ["Caesar", "Fall", "Moon"], answer: [0, 1], timeline: "era: 27 BCE – 476 CE | Empire" }) } as Question;
ok("timeline kind", tq.slots?.length === 2 && tq.timeline?.includes("Empire"));
ok("timeline grading", isCorrect(tq, [0, 1]) && !isCorrect(tq, [1, 0]) && isAnswered(tq, [0, -1]) && !isComplete(tq, [0, -1]));
ok("timeline text", answerText(tq) === "44 BCE: Caesar; 476 CE: Fall" && chosenText(tq, [1, -1]) === "44 BCE: Fall; 476 CE: (none)");
throws("timeline bad slot", () => normalizeQuestionKind({ type: "timeline", slots: ["soon", "1900"], choices: ["a", "b"], answer: [0, 1] }), /can't be read/);
throws("timeline answer per slot", () => normalizeQuestionKind({ type: "timeline", slots: ["1800", "1900"], choices: ["a", "b"], answer: [0] }), /one choice index per slot/);
const oq = { id: "o", topic: "t", stem: "Order", ...normalizeQuestionKind({ type: "order", choices: ["A", "B"], dates: ["1957", "1969"] }) } as Question;
ok("order dates kept", oq.dates?.join() === "1957,1969" && typeLabel(oq) === "Put in time order" && answerText(oq) === "A (1957) → B (1969)");
throws("order dates count", () => normalizeQuestionKind({ type: "order", choices: ["A", "B"], dates: ["1957"] }), /one entry in "dates"/);

// --- Course checker -------------------------------------------------------------------
const demo = await checkCourse("samples/demo-maps-timelines-sims.json", { runs: 1 });
ok("demo course passes the checker", demo.length === 0, demo);
const dir = mkdtempSync(join(tmpdir(), "widgets-"));
const bad = {
  format: "examiner-course",
  version: 1,
  id: "bad",
  title: "Bad",
  lessons: [{ id: "l1", title: "L", body: "```map\nbase: us\nregion: Narnia\n```\n\n```timeline\nevent: soon | X\n```\n\n```sim pendulum\nlength: 99\n```" }],
  banks: [
    {
      id: "b",
      title: "B",
      questions: [
        { id: "q1", topic: "t", type: "map", stem: "Click it", map: "base: world", targets: ["Gondor"] },
        { id: "q2", topic: "t", type: "order", stem: "Order", choices: ["A", "B"], dates: ["1969", "1957"] },
        { id: "q3", topic: "t", type: "timeline", stem: "Place", slots: ["1969", "1957"], choices: ["A", "B"], answer: [0, 1] },
      ],
    },
  ],
};
writeFileSync(join(dir, "bad.json"), JSON.stringify(bad));
const probs = await checkCourse(join(dir, "bad.json"), { runs: 1 });
for (const want of ['"Narnia" isn\'t on the us base map', "can't read the date", "length 99 is outside", '"Gondor" isn\'t', "aren't oldest first", "list \"slots\" oldest first"])
  ok(`checker reports: ${want}`, probs.some((p) => p.includes(want)), probs);

if (fails) {
  console.log(`${fails} widgets test(s) failed`);
  process.exit(1);
}
console.log("widgets tests passed");
