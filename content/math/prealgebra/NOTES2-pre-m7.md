# Round 2 notes: pre-m7 (Variables, expressions and equations)

## Honors lessons (3, all `honors: true`, `module: pre-m7`, 45 min)
- `lessons/29h1-systems.md`, `pre-m7-h-systems`: **Systems of two linear equations** (~1,670 words). Covers solutions as intersection points, graphing, substitution, elimination (with and without multiplying first), one, none or infinitely many solutions (table plus parallel-lines plot), a method-choice Mermaid chart, a two-variable word problem, and a short dated-with-caution note on *The Nine Chapters*. 7 worked examples, 2 plots, 1 diagram. It ties back to the Lesson 27 coin jar, which is the substitution method in disguise.
- `lessons/29h2-absolute-value.md`, `pre-m7-h-absolute-value`: **Absolute value equations and compound inequalities** (~1,610 words). Covers $|a-b|$ as distance, $|u| = c$ with any linear $u$ (isolate first), and/or compound inequalities, three-part inequalities with a negative divisor, $|u| < c$ and $|u| > c$, special cases, and a thermostat application. 7 examples, 3 number lines, 1 decision diagram.
- `lessons/29h3-line-equations.md`, `pre-m7-h-line-equations`: **Writing equations of lines** (~1,470 words). Covers a derivation of point-slope form, a line through two points, parallel lines, perpendicular lines (quarter-turn argument with a two-triangle shape figure, labeled as a sketch rather than a full proof), linear models (deriving $F = \tfrac95 C + 32$ from two facts, the $-40$ crossover, and a candle model with a stated range of validity). 6 examples, 1 shape, 1 plot, 1 diagram.

## Core lessons (additions only)
- 23: labeled SVG of the parts of $3x^2 - 5x + 8$, and a Mermaid diagram of the evaluation steps.
- 24: SVG of the arrows in $-2(4y - 7)$, and a Mermaid flowchart for simplifying (distribute, then the like-terms test).
- 25: balance-scale SVG for $3x + 5 = 20$, and a Mermaid diagram that builds the equation and then undoes it in reverse order.
- 26: Mermaid flowchart of the general strategy (including the identity and no-solution branches), and a shape figure for Example 8.
- 27: Mermaid set-up flow for money problems.
- 28: Mermaid "does the symbol flip?" decision chart.
- 29: labeled coordinate-plane SVG (axes, origin, quadrants, intercepts of $3x + 4y = 12$), and a Mermaid "how to graph a line" chart.

## Questions: `questions/r2-pre-m7.yaml` (78)
- Core: 36 (`pre-m7-r2-q01`–`q36`), 5 per lesson and 6 for lesson 29. Each lesson has at least one text question, one order or match question, and one select-all question. There are 2 label questions (lessons 23 and 29) and 1 picture MC (balance, lesson 25). Module quiz: 2 per lesson (14 total).
- Honors: 42 (`pre-m7-r2-h01`–`h42`), 14 per lesson, with 6–7 new-type questions each.
- By type: 28 MC (correct index 7/7/7/7), 13 select-all, 15 text, 10 match, 10 order, 2 label.

## Drills: `drills/r2-pre-m7.yaml` (7)
`pre-m7-r2-system-sub`, `pre-m7-r2-system-elim` (h1); `pre-m7-r2-abs-equation` (with an isolation step), `pre-m7-r2-compound` (negative coefficient, both symbols flip), `pre-m7-r2-abs-inequality` (h2); `pre-m7-r2-two-point-line`, `pre-m7-r2-perpendicular-line` (h3, expression answers). Each drill was generated 400 times through `src/lib/drills.ts`, and every answer was recomputed independently in Python/sympy from the displayed numbers: 0 mismatches. Every answer is an integer or an exact expression, so no rounding is involved.

## Glossary and cards
- `glossary-r2-pre-m7.yaml`: 10 terms: system of linear equations, solution of a system, substitution method, elimination method, compound inequality, absolute value inequality, point-slope form, negative reciprocals, linear model, rate of change. I grepped every `glossary*.yaml` first. "absolute value equation" already exists in `glossary-r2-pre-m2.yaml`, so 29h2 bolds it but doesn't redefine it. "parallel" and "perpendicular" already exist in `glossary.yaml`.
- `cards-r2-pre-m7.yaml`: 25 cards (9 on systems, 8 on absolute value and compound inequalities, 8 on equations of lines).

## Pictures
`images/pre-m7-expression-parts.svg` (+ `-blank`), `pre-m7-coordinate-plane.svg` (+ `-blank`), `pre-m7-balance.svg`, `pre-m7-distribute.svg`. All are original, under 5 KB, and were previewed. The label markers were checked on the blank versions. All Mermaid diagrams and the new plot, shape and number-line figures were rendered and looked at.

## For a reviewer
- Overlap: the pre-m2 honors lesson `08h2-distance-abs.md` also teaches $|x - a| = d$ and "within a distance" ($\le$). To limit duplication, 29h2 points back to it and focuses on a general linear expression inside the bars, on $>$ ("or") inequalities and on compound inequalities. Its application is "outside" (a thermostat) rather than a second tolerance example. Question h24 (an oven "at most 15° away") is still a within-type item.
- 29h1 cites *The Nine Chapters on the Mathematical Art* as reaching its final form "roughly 2,000 years ago," with the dating flagged as uncertain. Its fangcheng (array) method is the elimination idea.
- 29h3's proof of the perpendicular-slope rule is a quarter-turn sketch and says so.
- q26 is a two-blank text question that asks for an inequality symbol. It accepts `<=`, `≤` and `=<`.
- The core-lesson question q16 (order of the general strategy) merges "collect variables" and "collect constants" into one step, so the order is unique.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Checks
`content/math/check-module.sh prealgebra pre-m7`: OK, 0 problems. Every question key and the worked examples were recomputed in sympy.

## Sources
Standard algebra facts only (point-slope form, slopes of parallel and perpendicular lines, solving absolute value equations and inequalities, substitution and elimination). The water freezing and boiling points (0/100 °C = 32/212 °F, at sea level) are standard definitions. The note on *The Nine Chapters* (Chapter 8, fangcheng) is general history-of-mathematics knowledge, and its dating is given only roughly. All text, examples and questions are original.
