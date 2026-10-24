# Review of round 2, pre-m5 (Percents)

Reviewer worked every question before reading the key, recomputed every lesson number in Python, rendered every SVG (with label markers), every plot (with `scripts/preview-plots.mjs`) and every Mermaid diagram, and ran all 8 drills 2,000 times each through `src/lib/drills.ts`, checking each instance against an answer recomputed independently from the displayed prompt.

## Changes

| Where | What was wrong | Fix |
|---|---|---|
| `lessons/19-pct-apps.md`, "A note on compound interest" | The closing ```` ``` ```` of the new plot had the sentence "You'll study compounding in algebra; ..." on the same line. A closing fence can't carry text, so the code block never closed and the rest of the lesson (Common mistakes, Key points) would be swallowed into the plot block. | Put the fence on its own line and the sentence in its own paragraph after the plot. |
| `lessons/18-pct-solve.md`, Example 8 bar plot | Bar labels ("start: 100", "after +20%: 120", ...) were drawn on top of the x-axis tick numbers (0.5, 1, 1.5, ...), so they were unreadable. | `"grid": false` with a baseline segment; bars labeled "start", "after +20%", "after −20%"; the values $100, $120 and $96 placed above the bars as labels. Same content. |
| `lessons/19-pct-apps.md`, simple-vs-compound plot | y tick labels cut off at the left edge; the point labels "2,653.30" and "2,000" cut off at the right edge; "simple: 1000 + 50t" label sat across the compound curve. | x range −3 to 25 with both functions drawn from 0 to 20 (no negative tick label shows); simple-interest label moved below its line. |
| `lessons/19h1-compound-interest.md`, 30-year plot | Same: 5-digit y ticks cut off, "about 17,449" cut off, the "simple" label crossed the compound curve. | x range −4.5 to 37, functions from 0 to 30, point label shortened to "17,449", simple label moved below its line. |
| `lessons/19h1-compound-interest.md`, depreciation plot | y ticks cut off; "28,000" overlapped the axis title "value ($)"; the curve label ran across the curve and into "about 5,512" (also cut off); the 10-year point was at 5,511.8 instead of 5,512.48. | x range −1.9 to 12, y to 36,000, curve label moved to a free label in the empty upper right, point at 5,512.5 labeled "5,512". |
| `questions/r2-pre-m5.yaml`, pre-m5-r2-q09 (label) | Marker 3 ("10% of the base") sat on the top border of the bar, between a cell and the bracket area, so it didn't clearly point at a cell. | y 42.3 → 48: marker now inside the 8th cell. |
| `drills/r2-pre-m5.yaml`, pre-m5-r2-net-change | Solution printed the product of the multipliers with the default 2-decimal format, e.g. "0.85 × 1.15 = 0.98" when it is 0.9775, then "(0.98 − 1) × 100% = −2.25%". Answer key was right; the shown work was wrong. | `{mm}` → `{mm:num4}` (both places). |
| `glossary-r2-pre-m5.yaml` and `cards-r2-pre-m5.yaml`, Simpson's paradox | "because the groups have different sizes" is misleading: equal-sized groups overall can't explain it, and different group sizes alone don't cause it. The cause is that the groups make up different shares of each combined total (the lesson's own "weighted average" explanation). | Reworded to that. |

## Checked and right (a reader might doubt these)

- 19h1 numbers: the 10% year-by-year table; $1{,}000 \times 1.1^{30} = 17{,}449.40$; Example 1 \$3,700.61 vs \$3,500; Example 2 \$3,727.08; 6% compounding table (1,060.00 / 1,060.90 / 1,061.36 / 1,061.68 / 1,061.83) and continuous \$1,061.84; Example 3 APY 5.0116% and \$1.16 on \$10,000; $1.08^9 = 1.999$, $1.06^{12} = 2.012$, $1.03^{48} = 4.13$; Example 5 \$17,195.50; the "1.003 for 120 months" slip gives \$3,581.39.
- Rule of 72: doubling times 35.0 / 11.9 / 9.0 / 6.1 / 3.2 years are right; the "within about 4% for 3%–15%" claim holds (worst 3.2% at 15%) and the rule is exact near 7.85%, so "most accurate near 8%" is fair.
- APY disclosure: Truth in Savings Act / Regulation DD (12 CFR 1030) requires the APY in deposit-account disclosures and ads ([eCFR part 1030](https://www.ecfr.gov/current/title-12/chapter-X/part-1030)). APR as "generally without compounding": Regulation Z's APR is a nominal rate, the per-period rate times periods per year ([12 CFR 1026.22](https://www.law.cornell.edu/cfr/text/12/1026.22)); the lesson labels its description simplified. Fine.
- 19h2: Example 1 (0.99), Example 2 (\$95.40 both ways, 0.795), the undo table ($r/(1+r)$, $r/(1-r)$), Examples 3–5 and the invented Simpson table (Ana 90/60/65%, Bea 85/55/75%) are all right.
- All 43 questions: one defensible answer each; distractor explanations name real mistakes (h03's \$16,195.74 = 6% per month, h05 APY 4.917%, h19's 14.3% = divide by new value, etc.). Order questions q05, q15, h28 have distinct values (no ties); q10 and h14 have no swappable steps.
- Label markers: percent bar (25%, 60%, 90% at the right ticks), receipt (5 rows), bar model (after the fix).
- Drills: 16,000 instances, 0 mismatches. Every correctly rounded answer is accepted and every answer one unit off in the last place is rejected (rounding cases near a half are excluded by `where`). The three money drills use the default money tolerance of 0.01, so an answer one cent off is also accepted, as in the course's other money drills.
- Glossary: none of the 13 terms or aliases exists in another `glossary*.yaml` in the course; every bolded new term in the honors lessons has an entry.
- Mermaid (5): content right, accTitle/accDescr describe the whole diagram, readable.

## Left as is / uncertain

- q07 (match): the rent problem asks "by what percent", so a learner could try "The percent"; "A percent change" is also offered and fits better, and the lesson's decision chart makes the distinction, so I kept it.
- 17-pct-basics line 24 starts with a stray space left by the writer's insert. It's harmless in Markdown, so I didn't change it.
- Overlap: no other round 2 lesson in the course covers compound interest, percent chains, percentage points or Simpson's paradox. (The "compound inequalities" in pre-m7 are unrelated.)

`content/math/check-module.sh prealgebra pre-m5`: OK, zero problems.
