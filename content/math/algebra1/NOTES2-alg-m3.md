# Round 2 notes: alg-m3 (Functions and linear functions)

Check: `content/math/check-module.sh algebra1 alg-m3` gives 9 lessons, 143 questions, 22 drills, 60 cards. Result: OK (0 problems).

## Honors lessons (3)

The module has six core lessons, so it gets three honors lessons. Each one teaches a separate idea.

| File | Id | Title | Words | Questions | Drills |
|---|---|---|---|---|---|
| 13h1-inverse-functions.md | alg-m3-h-inverse-functions | Inverse functions | ~1,890 | h01–h14 | alg-m3-r2-inverse-eval, alg-m3-r2-inverse-formula |
| 13h2-piecewise-linear-models.md | alg-m3-h-piecewise-models | Piecewise linear models | ~1,650 | h15–h28 | alg-m3-r2-plan-bill, alg-m3-r2-continuity, alg-m3-r2-bracket-tax |
| 13h3-average-rate-of-change.md | alg-m3-h-average-rate | Average rate of change and the slope of a curve | ~1,650 | h29–h42 | alg-m3-r2-arc-quadratic, alg-m3-r2-secant-line, alg-m3-r2-diff-quotient |

- **Inverse functions.** Undoing a function (°C to °F), definition and notation (f⁻¹ is not 1/f), one-to-one functions and the horizontal line test, finding an inverse from a formula, the inverse of a linear function (its slope is the reciprocal 1/m, contrasted with the perpendicular slope), why the graph reflects across y = x (proved with Lesson 12 slopes and the midpoint), restricted domains ((x − 2)² + 1 on x ≥ 2), and the meaning of an inverse in context. 4 examples, 2 Mermaid diagrams, 2 plots.
- **Piecewise linear models.** Writing pieces in point-slope form through the breakpoint (a data plan), continuity at breakpoints and solving for a missing constant, a made-up 10/20/30% bracket tax schedule, marginal vs average tax rate, the "a raise into a higher bracket lowers take-home pay" myth, and working backward (including rejecting a solution that falls outside its piece). 4 examples, 1 SVG, 4 plots.
- **Average rate of change.** Secant lines, average velocity of a thrown ball, rates from an unequally spaced table, reading the shape of a graph from changing rates, the quadratic shortcut a(p + q) + b (derived using only the distributive property), the difference quotient, and the instantaneous rate as a preview of calculus. 4 examples, 2 plots.

## Core lessons (additions only)

| Lesson | Pictures and diagrams added | New questions |
|---|---|---|
| 08 Functions | SVG mapping diagrams (a function vs not a function), Mermaid "is it a function?" chart; bolded new term **mapping diagram** | q01 label, q02 text, q03 select-all, q04 match, q05 order |
| 09 Domain and range | Mermaid "domain from a formula" chart, SVG showing domain and range as the graph's shadow on each axis | q06 label (graph features), q07 text, q08 select-all, q09 match, q10 text |
| 10 Slope | plot with two similar slope triangles, SVG of the four kinds of slope | q11 label, q12 text, q13 order, q14 select-all, q15 match |
| 11 Line forms | plot of the horizontal and vertical lines through a point, Mermaid "which form?" chart | q16 text, q17 match, q18 order, q19 select-all, q20 text |
| 12 Parallel and perpendicular | plot of parallel lines with matching slope triangles, Mermaid "parallel, perpendicular or neither?" chart | q21 text, q22 match, q23 select-all, q24 order, q25 text |
| 13 Piecewise | Mermaid chart for evaluating a piecewise function | q26 text, q27 order, q28 select-all, q29 match |

Each core lesson has two `module_quiz: true` questions: q01, q04, q06, q09, q11, q12, q16, q19, q22, q25, q26, q29.

## Totals

- **Questions:** 71 in `questions/r2-alg-m3.yaml`.
  - Core: 29 (9 text, 6 match, 5 order, 6 select-all, 3 label).
  - Honors: 42, 14 per lesson. Each lesson has 8 multiple choice, 2 text, 1 order, 1 match and 2 select-all. The correct answers to the multiple-choice questions are spread evenly over positions 0–3.
- **Drills:** 8 in `drills/r2-alg-m3.yaml`, all linked from the honors lessons.
- **Pictures:** 7 SVGs: `alg-m3-mapping`, `-mapping-blank`, `-domain-range`, `-features-blank`, `-slope-types`, `-slope-types-blank` and `-tax-brackets`.
- **Diagrams:** 7 Mermaid diagrams, 5 in core lessons and 2 in honors. Also 11 new `plot` figures.
- **Glossary:** 14 terms in `glossary-r2-alg-m3.yaml`: mapping diagram, inverse function, one-to-one, horizontal line test, piecewise linear, breakpoint, continuous, tax bracket, marginal tax rate, average tax rate, secant line, average velocity, difference quotient, instantaneous rate of change. I checked every `glossary*.yaml` in the course, and none of these terms or aliases is already defined. Every bolded term in the 9 lessons has an entry.
- **Cards:** 29 in `cards-r2-alg-m3.yaml`: 3 core, 10 inverse functions, 8 piecewise models, 8 average rate.

## Verification

- I re-solved every question in Python with sympy, including the distractor values named in the explanations.
- I generated each drill 2,000 times with tsx, using `generate` and `checkAll` on the built JSON. In every case, an answer computed independently from the raw inputs was accepted, the displayed answer was accepted when typed, a wrong value was rejected, and the text had no `+ 0`, `1x`, `1k` or doubled signs.
- I rendered and looked at every SVG, every Mermaid diagram and every new plot, using the app's CSS for the plots. Label markers were checked with `--markers`. On the features picture, the endpoint markers sit just beside the dots, so the learner can still see which dot is solid and which is hollow.

## For a reviewer to double-check

- **Overlap avoided.** alg-m1's honors lesson 05h2 already covers the round-trip average speed (120 miles at 60 mph and 40 mph). I removed that from 13h3 and used a battery-charge table and a tank question (h31) instead. 13h3 keeps one sentence: never average the rates of the pieces.
- **Tax schedule.** The schedule in 13h2 is labeled made-up. The lesson's general claims:
  - US federal income tax uses marginal brackets.
  - Benefit "cliffs" can create jumps.
  - The average rate is below the marginal rate only once income is past the first bracket. This was qualified in the lesson and the glossary.
- **Continuity.** The definition is informal and labeled as such ("calculus makes it precise"). 13h3 also mentions concave up/down and the derivative, as a labeled preview only.
- **Question q19** has 3 of 4 choices correct.
- **Question h12** match answers use plain text such as "x² for x ≥ 0".

## Errors found in existing content

None. No existing questions, drills, cards or glossary entries were edited.

## Sources

Everything is standard algebra; all the numbers were recomputed in Python. On brackets and marginal rates, I checked these:
- [Cornell LII Wex: tax bracket](https://www.law.cornell.edu/wex/tax_bracket)
- [Schwab: What are tax brackets and marginal tax rates?](https://www.schwab.com/learn/story/what-are-tax-brackets-and-marginal-tax-rates)
