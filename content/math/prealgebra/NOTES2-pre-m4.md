# Round 2 notes: pre-m4 (Decimals, ratios and proportions)

`content/math/check-module.sh prealgebra pre-m4`: build and checker report zero problems
(6 lessons, 90 questions, 14 drills, 39 cards).

## Added

**Honors lessons** (`honors: true`, `module: pre-m4`)
- `lessons/16h1-repeating-decimals.md`, `pre-m4-h-repeating`, "Honors: Repeating decimals as
  fractions" (40 min, about 1,800 words). Covers why long division must repeat (remainder cycle for
  1/7, period at most d − 1), shift and subtract, the nines pattern, mixed repeating decimals (two
  shifts, plus the 9s-and-0s shortcut), why 0.999… = 1 (three arguments; finite 0.999 < 1;
  0.5 = 0.4999…), exact arithmetic by converting to fractions, and "every repeating decimal is a
  fraction" tied to Lesson 20's rational numbers. Examples: 0.7 and 0.135 repeating, 2.3(18) =
  51/22, 0.(4) × 0.(3) = 4/27 = 0.(148), 0.(12) + 0.(87) = 1.
- `lessons/16h2-inverse-proportion.md`, `pre-m4-h-inverse`, "Honors: Direct and inverse
  proportion" (45 min, about 1,750 words). Covers direct vs inverse (constant ratio vs constant
  product, constant of proportionality, graphs), solving with x₁y₁ = x₂y₂, the law of the lever,
  gears, recognizing the relationship from a table, string length and pitch (labeled idealized),
  and mixed direct/inverse problems via a fixed quantity (worker-days per job). Examples: painters,
  seesaw, three tables, 60 cm string at 220 Hz, painters and houses, machines and bottles.
- A third lesson (scaling area and volume, k² and k³) was written and then removed: the pre-m8
  writer's `35h1-scaling.md` covers the same material in the geometry module, where it belongs.
  Working together and average speed were also cut from 16h2 because `12h2-fraction-problems.md`
  (pre-m3) teaches them; 16h2 refers learners to "the Module 3 honors lesson on fraction problems".

**Core lessons** (additions only; nothing rewritten)
- 13-dec-basics: place value chart SVG (with intro sentence); Mermaid "terminate or repeat?" chart,
  plus one sentence on simplifying first (3/12 = 1/4).
- 14-dec-ops: 10 × 10 grid SVG for 0.3 × 0.2 = 0.06 (with two sentences); new short section
  "Where the point goes: a summary" with a Mermaid chart of the rule for each operation.
- 15-ratio: tape diagram SVG for Example 2 (one sentence introduces **tape diagram**); new short
  section "Ratio or rate?" with a Mermaid classification chart.
- 16-proportion: plot of 2x (proportional) vs 3 + 2x (taxi) with two sentences; Mermaid chart of the
  proportion word-problem method, starting with "is it proportional?".

**Pictures** (8 SVGs, original, 1.7–11.5 KB, rendered and checked; label markers checked):
pre-m4-place-value (+ -blank), pre-m4-dec-grid, pre-m4-tape (+ -blank), pre-m4-h-cycle,
pre-m4-h-lever (+ -blank). In the lever blank the masses stay and the distances are removed, so the
label question needs the lever law.

**Diagrams**: 6 Mermaid (all `flowchart TD`, accTitle/accDescr, rendered): lessons 13, 14, 15, 16,
16h1 (shift and subtract), 16h2 (direct, inverse or neither). Plots: lesson 16 and 16h2
(time = 120/speed).

**Questions** (46, `questions/r2-pre-m4.yaml`)
- Core `q01`–`q20`, 5 per lesson. 13: text q01, match q02, select-all q03, label q04, order q05.
  14: text q06, q10, order q07, select-all q08, match q09. 15: label q11, text q12, match q13,
  select-all q14, order q15. 16: text q16, q20, select-all q17, order q18, match q19.
  module_quiz: q01, q04, q08, q11, q14, q16, q17.
- 16h1 `h01`–`h13`: MC 8, text 2 (h03, h12), order h07, select-all h08, match h10.
- 16h2 `h14`–`h26`: MC 6, select-all 2 (h15, h26), text 2 (h16, h20), label h17, order h22, match h24.
- No module_quiz on honors questions. MC answer positions: 3 / 4 / 4 / 3 at 0–3.

**Drills** (4, `drills/r2-pre-m4.yaml`): `pre-m4-r2-rep-pure` (0.(ab) → fraction, lowest terms),
`pre-m4-r2-rep-mixed` (0.a(b) → fraction) for 16h1; `pre-m4-r2-inverse` (workers × days) and
`pre-m4-r2-work-units` (workers, rooms and days) for 16h2. Each was generated 3,000 times with tsx
against an independent solver (the repeating-decimal ones also check the fraction's actual decimal
digits): correct answers accepted, a typical wrong one rejected, unreduced fractions rejected, no
unfilled placeholders. Note: the fraction answers needed `tolerance: 0.0000001`; with the default
(0.01) 89/100 was accepted for 0.(89).

**Glossary** (`glossary-r2-pre-m4.yaml`, 9): tape diagram, repetend, period, pure repeating decimal,
mixed repeating decimal, directly proportional, inversely proportional, constant of
proportionality, fulcrum. Checked against every `glossary*.yaml` in the course.

**Cards** (`cards-r2-pre-m4.yaml`, 19): 1 Ratios (tape diagram), 10 Repeating decimals,
8 Inverse proportion.

## For a reviewer to double-check
- History claims: Archimedes proved the law of the lever (3rd century BC, *On the Equilibrium of
  Planes*); "the ancient Greeks already knew that halving a string raises its note by an octave"
  (the Pythagorean tradition). Both are stated without further detail.
- The string example (frequency × length constant) is labeled an idealized model; it holds for
  ideal strings of the same material and tension.
- 16h1 says a fraction with denominator d has period at most d − 1 (true; 1/7 and 1/17 reach it).
- 16h1 uses the terms "pure" and "mixed repeating decimal" and notes that names vary.
- The pre-h1 honors module (number theory) had no lessons yet when I finished; if it adds a lesson
  on repeating decimals or decimal periods, check it against 16h1.

## Errors found in existing content
None. No existing questions, drills, cards or glossary entries were edited.

## Sources
Standard arithmetic; all numbers recomputed in Python (fractions module) and in the drill checks.
