import { addDays, previewInterval, schedule, today, type Rating } from "../src/lib/srs.ts";
import type { CardState } from "../src/lib/types.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};

const D0 = "2026-01-01";
const sane = (s: CardState) =>
  Number.isFinite(s.stability) &&
  s.stability! > 0 &&
  Number.isFinite(s.difficulty) &&
  s.difficulty! >= 1 &&
  s.difficulty! <= 10 &&
  s.ivl >= 0 &&
  s.ivl <= 365;

// New card: hard < good < easy, again stays in session.
const fresh = (r: Rating) => schedule(undefined, r, D0);
const [a, h, g, e] = (["again", "hard", "good", "easy"] as Rating[]).map(fresh);
ok("new again ivl 0", a.ivl === 0 && a.due === D0, a);
ok("new again no lapse", a.lapses === 0 && a.reps === 0, a);
ok("new hard<good<easy", h.ivl >= 1 && h.ivl < g.ivl && g.ivl < e.ivl, [h.ivl, g.ivl, e.ivl]);
ok("new sets first", g.first === D0);
ok("new has memory", sane(a) && sane(h) && sane(g) && sane(e), [a, h, g, e]);

// Repeated good, reviewed on time, keeps growing.
let s = g;
const ivls = [s.ivl];
for (let i = 0; i < 8; i++) {
  s = schedule(s, "good", s.due);
  ivls.push(s.ivl);
}
ok("good grows", ivls.every((v, i) => i === 0 || v > ivls[i - 1] || v === 365), ivls);
ok("cap 365", ivls.every((v) => v <= 365) && ivls[ivls.length - 1] === 365, ivls);
ok("reps counted", s.reps === 9, s.reps);

// Mature review: hard<good<easy as well.
const mature = schedule(g, "good", g.due);
const mh = schedule(mature, "hard", mature.due);
const mg = schedule(mature, "good", mature.due);
const me = schedule(mature, "easy", mature.due);
ok("review hard<good<easy", mh.ivl < mg.ivl && mg.ivl < me.ivl, [mh.ivl, mg.ivl, me.ivl]);

// Again resets: ivl 0, due today, lapse counted, stability drops.
const lapsed = schedule(mature, "again", mature.due);
ok("again resets", lapsed.ivl === 0 && lapsed.due === mature.due, lapsed);
ok("again lapse", lapsed.lapses === 1);
ok("again stability drops", lapsed.stability! < mature.stability!, [lapsed.stability, mature.stability]);
const relearn = schedule(lapsed, "good", lapsed.due);
ok("relearn short", relearn.ivl >= 1 && relearn.ivl < mg.ivl, relearn.ivl);

// Easy on top of easy hits the cap and stays there.
let big = e;
for (let i = 0; i < 10; i++) big = schedule(big, "easy", big.due);
ok("easy capped", big.ivl === 365 && sane(big), big);
ok("preview 1y", previewInterval(big, "good") === "1y", previewInterval(big, "good"));

// Legacy SM-2 state: converted only when rated, sane result.
const legacy: CardState = { due: "2026-02-10", ivl: 20, ease: 2.5, reps: 5, lapses: 1, last: "2026-01-21" };
const copy = { ...legacy };
ok("legacy untouched by preview", previewInterval(legacy, "good") !== "" && JSON.stringify(legacy) === JSON.stringify(copy));
const lg = schedule(legacy, "good", "2026-02-10");
const lh = schedule(legacy, "hard", "2026-02-10");
const le = schedule(legacy, "easy", "2026-02-10");
const la = schedule(legacy, "again", "2026-02-10");
ok("legacy good grows", lg.ivl > 20 && lg.ivl < 200, lg.ivl);
ok("legacy hard<good<easy", lh.ivl < lg.ivl && lg.ivl < le.ivl, [lh.ivl, lg.ivl, le.ivl]);
ok("legacy sane", sane(lg) && sane(lh) && sane(le) && sane(la), [lg, lh, le, la]);
ok("legacy difficulty mid", Math.abs(lg.difficulty! - 5) < 1, lg.difficulty);
ok("legacy again", la.ivl === 0 && la.lapses === 2 && la.due === "2026-02-10", la);
const hardEase = schedule({ ...legacy, ease: 1.3 }, "good", "2026-02-10");
ok("low ease = harder", hardEase.difficulty! > lg.difficulty! && hardEase.ivl < lg.ivl, [hardEase, lg]);
const legacyLapsed = schedule({ ...legacy, ivl: 0 }, "good", "2026-02-10");
ok("legacy ivl 0 sane", sane(legacyLapsed) && legacyLapsed.ivl >= 1, legacyLapsed);
const legacyHuge = schedule({ ...legacy, ivl: 365, last: "2025-02-10" }, "good", "2026-02-10");
ok("legacy cap", sane(legacyHuge) && legacyHuge.ivl === 365, legacyHuge);
const legacyNew = schedule({ ...legacy, reps: 0, ivl: 0 }, "good", "2026-02-10");
ok("legacy never-passed treated as new", legacyNew.ivl === g.ivl, legacyNew);

// Overdue review grows more than on-time.
const late = schedule(mature, "good", addDays(mature.due, 30));
ok("overdue grows more", late.ivl >= mg.ivl, [late.ivl, mg.ivl]);

// Preview labels.
ok("preview now", previewInterval(undefined, "again") === "now");
ok("preview days", /^\d+d$/.test(previewInterval(undefined, "good")), previewInterval(undefined, "good"));
const monthly = { ...mature, stability: 90, ivl: 90, last: addDays(today(), -90) };
ok("preview months", /^\d+mo$/.test(previewInterval(monthly, "hard")), previewInterval(monthly, "hard"));

if (fails) {
  console.log(`${fails} fsrs test(s) failed`);
  process.exit(1);
}
console.log("fsrs tests passed");
