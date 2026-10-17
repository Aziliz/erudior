# Algebra 1 (math-algebra1): progress

Split out of the longer "Algebra" draft (content/math/algebra). Lessons 1–25 and their
questions, drills, cards and glossary came from that draft (ids keep the `alg-` prefix so
existing progress stays valid); lessons 26–32 are new (`a1-` prefix).

Status: **complete**. `python3 content/math/build.py algebra1` and
`npx tsx tests/check-course.mts samples/math-drafts/math-algebra1.json` both report zero
problems. Still a draft (no `released: true` in course.yaml).

## Counts

| Item | Count |
|---|---|
| Modules | 8 |
| Lessons | 32 |
| Questions | 379 (85 new: 49 in a1-m7, 36 in a1-m8) |
| Drills | 80 (20 new) |
| Notecards | 166 (44 new) |
| Glossary terms | 217 (62 new) |
| Reference sheets | 4 |

## Outline

| # | Module | Lesson id | Title | Qs | Drills |
|---|---|---|---|---|---|
| 01 | alg-m1 Foundations and linear equations | alg-real-numbers | Real numbers and their properties | 12 | alg-d-fraction-arith, alg-d-abs-distance |
| 02 | alg-m1 | alg-expressions | Expressions, order of operations, and like terms | 11 | alg-d-order-ops, alg-d-evaluate-expr, alg-d-combine-like |
| 03 | alg-m1 | alg-linear-eq | Solving linear equations | 11 | alg-d-two-step, alg-d-both-sides, alg-d-eq-fractions |
| 04 | alg-m1 | alg-literal | Literal equations and formulas | 11 | alg-d-literal-solve, alg-d-formula-eval |
| 05 | alg-m1 | alg-linear-apps | Linear equations in applications | 11 | alg-d-consecutive, alg-d-percent-change, alg-d-distance-rate |
| 06 | alg-m2 Inequalities and absolute value | alg-inequalities | Linear and compound inequalities | 14 | alg-d-ineq-smallest-int, alg-d-ineq-largest-int, alg-d-compound-ineq |
| 07 | alg-m2 | alg-abs-value | Absolute value equations and inequalities | 13 | alg-d-abs-eq, alg-d-abs-ineq |
| 08 | alg-m3 Functions and linear functions | alg-functions | Functions and function notation | 11 | alg-d-eval-function, alg-d-function-expr |
| 09 | alg-m3 | alg-domain-range | Domain, range, and graphs of functions | 13 | alg-d-read-graph, alg-d-domain-sqrt |
| 10 | alg-m3 | alg-slope | Slope and rate of change | 12 | alg-d-slope-two-points, alg-d-slope-graph |
| 11 | alg-m3 | alg-line-forms | Equations of lines | 12 | alg-d-line-point-slope, alg-d-line-two-points, alg-d-intercepts |
| 12 | alg-m3 | alg-parallel-perp | Parallel and perpendicular lines; linear models | 12 | alg-d-perp-line, alg-d-linear-model |
| 13 | alg-m4 Systems of equations and inequalities | alg-systems-sub | Systems by graphing and substitution | 11 | alg-d-system-graph, alg-d-system-sub |
| 14 | alg-m4 | alg-elimination | Solving systems by elimination | 10 | alg-d-system-elim, alg-d-system-sub |
| 15 | alg-m4 | alg-system-apps | Applications of linear systems | 11 | alg-d-tickets, alg-d-mixture, alg-d-wind |
| 16 | alg-m4 | alg-ineq-systems | Linear inequalities in two variables and systems of inequalities | 11 | alg-d-corner-point, alg-d-lp-max |
| 17 | alg-m5 Exponents, polynomials, and factoring | alg-exponent-rules | Exponent rules and scientific notation | 13 | alg-d-exp-simplify, alg-d-negative-exp, alg-d-sci-notation |
| 18 | alg-m5 | alg-poly-ops | Polynomial operations and special products | 12 | alg-d-poly-add, alg-d-foil, alg-d-binomial-square |
| 19 | alg-m5 | alg-factor-gcf | Factoring: GCF and grouping | 11 | alg-d-factor-gcf, alg-d-factor-grouping |
| 20 | alg-m5 | alg-factor-trinomials | Factoring trinomials and special patterns | 15 | alg-d-factor-ac, alg-d-factor-special, alg-d-factor-cubes |
| 21 | alg-m6 Quadratic equations and functions | alg-quad-factoring | Solving quadratic equations by factoring | 11 | alg-d-factor-monic, alg-d-zero-product, alg-d-quad-factor-solve |
| 22 | alg-m6 | alg-complete-square | The square root property and completing the square | 11 | alg-d-sqrt-property, alg-d-complete-square |
| 23 | alg-m6 | alg-quad-formula | The quadratic formula and the discriminant | 12 | alg-d-quad-formula, alg-d-discriminant |
| 24 | alg-m6 | alg-quad-graphs | Graphing quadratic functions | 12 | alg-d-vertex-standard, alg-d-quad-from-graph, alg-d-quad-intercepts |
| 25 | alg-m6 | alg-quad-apps | Quadratic applications: max, min, projectiles | 11 | alg-d-projectile, alg-d-fence-max, alg-d-revenue-max |
| 26 | a1-m7 Square roots, exponential functions, and sequences | a1-square-roots | Square roots and simplifying radicals | 12 | a1-d-simplify-root, a1-d-radical-add, a1-d-radical-multiply |
| 27 | a1-m7 | a1-exponential | Exponential functions: growth and decay | 12 | a1-d-exp-evaluate, a1-d-percent-growth, a1-d-exp-from-table |
| 28 | a1-m7 | a1-lin-vs-exp | Comparing linear and exponential models | 12 | a1-d-two-models, a1-d-exp-overtakes |
| 29 | a1-m7 | a1-sequences | Arithmetic and geometric sequences | 13 | a1-d-arith-nth, a1-d-geom-nth, a1-d-arith-two-terms |
| 30 | a1-m8 Data and statistics | a1-one-var-data | Describing data: displays, center, and spread | 13 | a1-d-mean-median, a1-d-five-number, a1-d-std-dev |
| 31 | a1-m8 | a1-two-way | Two-way tables and relative frequency | 11 | a1-d-two-way-freq, a1-d-two-way-complete |
| 32 | a1-m8 | a1-scatter | Scatter plots, correlation, and lines of fit | 12 | a1-d-fit-two-points, a1-d-predict-residual, a1-d-fit-solve-x |

Reference sheets: `alg-ref-equations` (equations, lines, systems), `alg-ref-functions`
(functions and square roots), `alg-ref-polynomials` (exponents, factoring, quadratics),
`a1-ref-data` (exponential growth, sequences, statistics; new).

## Work done in this pass

- Lessons 26–32 written (about 1,150–1,550 words of prose each, 2–4 worked examples, figures:
  √x graph, growth/decay graphs, linear vs exponential graph, sequence points, dot plot,
  histogram, two box plots, conditional-percent bar chart, scatter plot with line of best
  fit, residual plot). Box plots are drawn as `shape` figures (box, whiskers, hand-made
  axis), since the engine has no box-plot type.
- Questions: a1-q-2601…2913 (a1-m7) and a1-q-3001…3212 (a1-m8); correct answers spread
  evenly across positions; module quizzes cover every topic in both modules (12 + 11
  module-quiz questions). Every question was worked by hand and numeric ones checked in
  Python.
- Drills: 20 new; each verified with 400 generated instances against an independent
  recomputation (script in /tmp, using `generate()` from src/lib/drills.ts on the built
  JSON), plus the course checker.
- Old lessons fixed for the split: renumbered cross-references (the draft's lessons
  17–26 are now 16–25), removed forward references to complex numbers (Lessons 20, 22,
  23 and question alg-q-2308), three-variable systems (Lesson 14), polynomial functions
  "Module 8" (Lesson 18) and rational expressions "Module 7" (Lesson 19). Lesson 22 now
  points to Lesson 26 for simplifying radicals. Cards/glossary entries that mentioned
  complex roots or logarithms reworded.
- `references/functions.md` trimmed to functions + Algebra 1 square roots (complex
  numbers, rational expressions and polynomial-function theorems removed); the
  discriminant row in polynomials.md no longer mentions complex roots.
- Every bolded term in all 32 lessons has a glossary entry (checked by script). The
  glossary entry for "range" now also gives the statistics meaning.

## Notes for a reviewer

- Quartiles use the median-of-halves method (median excluded when n is odd), matching the
  engine's `quartile()`. Lesson 30 says calculators may differ slightly.
- Standard deviation: lessons and drills use the population σ (divide by n) and mention
  the sample s (n − 1); questions say which one they want.
- Lesson 16 (from the source draft) still includes a short linear-programming section and
  drill (alg-d-lp-max). It is a stretch topic for Algebra 1 but self-contained; kept.
- Lesson 32 quotes a line of best fit ŷ = 5.5x + 56.4 rounded from the least-squares fit
  (5.49x + 56.37, r ≈ 0.96); residuals in the lesson are computed from the rounded line.
- Question stems render as plain text with math (not Markdown), so the two-way-table
  questions show their table as a KaTeX `array`.


## Review (2026-10-16)

Independent review in two halves: every question solved before checking its key, every lesson example checked, every drill generated hundreds of times against an independent solver.

# Algebra 1 review: lessons 01–16, their questions and drills, cards.yaml

Method: solved all 186 questions independently, then compared with the keys. Read every lesson worked example and figure spec. Ran 1,000 instances of each of the 37 drills against an independent solver (tsx, generate() + checkAll()) and read sample prompts and solutions. Read all 166 cards.

All answer keys were correct. Every drill computed the right answer in every instance. No card errors.

## Fixes

### Question explanations
- alg-q-0206 (alg-m1): the explanation said "In the first pair…", which refers to a choice by its position. Rewrote it to name the pairs.
- alg-q-0305 (alg-m1): the explanation said "The first and third…", which refers to choices by position. It now names the equations.
- alg-q-0306 (alg-m1): the explanation said "Subtracting 1.5 instead of adding it gives x = 8". That mistake actually gives −8. The mistake that gives 8 is moving the 0.3 with the wrong sign, and the explanation now says so.
- alg-q-0606 (alg-m2): the explanation said "Not reversing the symbols leads to [−2, 1)". Not reversing gives an empty set, not [−2, 1). It now names the real mistake: reordering the endpoints without moving the brackets.
- alg-q-0911 (alg-m3): the explanation used factoring (−16t(t − 3)), which isn't taught until lesson 19. It now checks h(3) = 0 directly.

### Lessons
- 13-systems-substitution: "(3, 4) satisfies the first equation **but** … so it works for both" was confusing. Rewritten.
- 09-domain-range: the ball example said "setting h(t) = 0 gives t = 4", which needs factoring (taught later). It now verifies h(4) = 0.
- 16-inequality-systems: the reason a single test point decides the side to shade was circular. Rewrote it.

### Drills
- alg-d-eq-fractions: the solution could print "1x". Changed to `{qmp:coef}`.
- alg-d-system-graph: the solution said "Check with the equations" but never showed them. It now states both line equations.

## Checked, no change needed
- Cross-references (Lesson 1/2/3/4, Modules 2/3) all match this course's order.
- Lesson 16 (linear programming) is self-contained and correct.
- No Markdown in stems, choices or explanations.

## Outside scope
- None found. Glossary and references were not reviewed in depth.

Build and check-course: both report zero problems.

# Algebra 1 review: lessons 17–32, their questions and drills, glossary, references

Scope checked: 16 lessons (alg-m5, alg-m6, a1-m7, a1-m8), 194 questions, 32 drills, glossary.yaml (217 terms), 4 reference sheets.
Method: every question solved independently (sympy for algebraic choices); worked examples and lesson numbers recomputed in Python (regression and residuals refit with numpy); figure coordinates (box plots, area models, dot plot, histogram) compared with the text; every drill generated 1,000–2,000 times, with each answer checked by an independent TypeScript check and the displayed text scanned for formatting faults.

## Fixes

### Questions
- alg-q-2206: the explanation referred to "the last choice" by its position. It now names the expression $2x^2 - 9x + 4$.
- a1-q-2904: the explanation said "the second choice skips the given first term". That was wrong (the second choice is $3, -15, 75, \dots$) and it referred to a choice by position. It now names $-2, -7, -12, -17$.
- alg-q-2602: the explanation said 133 comes from "$+64$ instead of $-64$". That gives 197. 133 comes from leaving out the $-16t^2$ term.
- alg-q-2211: the explanation said "$\pm\tfrac94$ are the values of $x^2$". $x^2$ has only the value $\tfrac94$. It is reworded.

### Drills
- alg-d-sci-notation (wrong answer key): when $c$ had 3 decimals (e.g. 1.625), the displayed correct answer and the solution were rounded to 2 decimals (1.63), but the stored answer was 1.625 with tolerance 0.0001. Typing the answer shown as correct would have been marked wrong. Added `format: num4` and `{c:num4}`/`{prod:num4}` in the solution.
- a1-d-exp-evaluate (wrong answer key): fractional answers such as 7/3 were shown as "2.33", and 2.33 fails the 0.0001 tolerance. Added `format: fraction`, so the answer now shows as $\tfrac73$.
- Zero terms showing as "+ 0", "(x + 0)", "-0": alg-d-quad-factor-solve (m, n ≠ 0), alg-d-sqrt-property (k ≠ 0), alg-d-quad-formula (b ≠ 0), alg-d-vertex-standard (c ≠ 0), alg-d-quad-from-graph (k ≠ 0), alg-d-projectile (h0 ≥ 2), a1-d-fit-two-points (`mx1: m*x1 + 0` to avoid "−0").
- alg-d-factor-grouping: it could produce $(x+p)(x^2-4)$ or $(x+p)(4x^2-1)$ as the "answer", which isn't fully factored and contradicts the lesson's "factor completely". A `where` now excludes cases where $qx^2 + r$ is a difference of squares.

### Lessons
- 29 Sequences: "a geometric sequence is an exponential function of $n$" is false for $r < 0$, and the lesson's own example has $r = -2$. Added "when $r > 0$" in the body and the key points.
- 26 Square roots: refs listed a1-ref-data (statistics and growth), which has nothing on square roots. Removed it.

### Glossary and references
- glossary "geometric sequence": added "When $r > 0$" to the exponential-function claim.
- references/data-and-growth.md: in the sequences table, the geometric column now says "exponential in $n$ (when $r > 0$)".
- references/polynomials.md: "$D > 0$: rational if $D$ is a perfect square" now adds "and $a$, $b$, $c$ are integers".

## Verified correct (no change)
- All other question keys, distractors and explanations. Algebraic choices were checked with sympy. Where an equivalent distractor exists (2002, 2008, 2112, 2115), the stem says "completely".
- Statistics conventions are consistent across lesson 30, its questions, drills, glossary and reference sheet: population $\sigma$ (divide by $n$) unless stated; quartiles by median of halves, leaving out the median when $n$ is odd (matches `quartile()`); outliers by the 1.5·IQR fences from $Q_1$/$Q_3$. Both box plots match their five-number summaries; the dot plot (18 values, sum 46, median 2) and histogram (26 values) match the text.
- Lesson 32 regression: refit gives $\hat y = 5.49x + 56.37$ with $r = 0.956$; the U-shaped residuals in Example 3 match a refit ($8.93x - 14.68$, $r = 0.976$).
- All lesson/module cross-references point to existing lessons with matching content.

## Not fixed / for others
- cards.yaml (other reviewer): the card "Arithmetic and geometric sequences as functions" says geometric = exponential function of $n$ with no "$r > 0$" caveat.
- Engine limitation (src/, not editable): expression answers are checked by numeric equivalence, so on factoring drills (factor-gcf, grouping, ac, special, cubes, monic) typing the unfactored or expanded polynomial is also accepted.
- Cosmetic only, left as is: `x^{1}` / `(…)^{1}` can appear in alg-d-exp-simplify, alg-d-negative-exp and alg-d-sci-notation prompts and solutions when an exponent is 1.

Build: `python3 content/math/build.py algebra1` OK; `npx tsx tests/check-course.mts samples/math-drafts/math-algebra1.json` reports OK (0 problems).


## Gap lessons (2026-10-17)

Fills the "Common" coverage gaps from VERIFY.md. Build and check-course: zero problems. Totals now: 36 lessons, 435 questions, 93 drills, 184 cards, 229 glossary terms, 4 reference sheets.

### New lessons

| File | Id | Title | Module |
|---|---|---|---|
| 13-piecewise-functions.md | a1-piecewise | Piecewise and step functions | alg-m3 |
| 27-linear-quadratic-systems.md | a1-solve-fg | Solving f(x) = g(x): linear-quadratic systems and intersections | alg-m6 |
| 29-root-functions.md | a1-root-functions | Square root and cube root functions | a1-m7 |
| 36-regression-models.md | a1-regression-models | Fitting quadratic and exponential models to data | a1-m8 |

Renumbered files (ids unchanged): old 13–25 are now 14–26, old 26 (square roots) is 28, old 27–32 are 30–35. Every "Lesson N" cross-reference in the lessons was renumbered to match. The Outline table above still shows the old numbers.

Cross-references added: 09 (Lesson 29 graphs the cube root), 25 (Lesson 29 uses the transformations; refs now include alg-ref-functions), 28 (next lesson graphs √x), 35 (no longer "this last lesson"; points to the next lesson for curved models).

### New questions (56)

- a1-piecewise: a1-q-pw01 … a1-q-pw12 (module quiz: pw01, pw03, pw05, pw08)
- a1-solve-fg: a1-q-fg01 … a1-q-fg12 (module quiz: fg01, fg02, fg07)
- a1-root-functions: a1-q-rt01 … a1-q-rt12 (module quiz: rt01, rt03, rt06)
- a1-regression-models: a1-q-rg01 … a1-q-rg12 (module quiz: rg01, rg02, rg07)
- Task B, Lesson 25 general transformations (alg-quad-graphs): alg-q-2413 … alg-q-2416 (module quiz: 2413, 2414)
- Task B, Lesson 30 restating rates over another time step (a1-exponential): a1-q-2713 … a1-q-2716 (module quiz: 2713)

Correct answers are spread evenly (3 per position in each 12-question set, 1 per position in each Task B set).

### New drills (13)

- Lesson 13: a1-d-piecewise-eval, a1-d-step-cost, a1-d-floor-eval
- Lesson 27: a1-d-lin-quad-system, a1-d-intersection-count, a1-d-abs-line
- Lesson 29: a1-d-root-transform, a1-d-cbrt-eval, a1-d-root-from-graph
- Lesson 36: a1-d-exp-model-predict, a1-d-quad-model-predict
- Task B: a1-d-transform-point (linked from Lesson 25), a1-d-rate-restate (linked from Lesson 30). Both lessons now list 4 drills.

Also added: 12 glossary terms (piecewise function, step function, greatest integer function, linear-quadratic system, tangent line, square root function, cube root, cube root function, regression, quadratic regression, exponential regression, second differences) and 18 notecards, appended to the end of cards.yaml so existing card ids (c1…c166) keep their positions. Reference sheets: functions.md gained transformations, piecewise/step, and root-function tables; polynomials.md gained linear-quadratic systems; data-and-growth.md gained "another time step" and a model-choice table.

### Verification

- All 56 questions solved independently in Python/sympy/numpy before fixing the keys (script: /tmp/claude-0/gaps/algebra1/work/verify_q.py); distractor explanations checked by recomputing each mistake.
- Each new drill generated 1,000 times with tsx (generate + checkAll on the built JSON): answers matched an independent calculation from the raw inputs, the displayed answer and independently rounded answers were accepted, a wrong value in each box was rejected, and the text was scanned for "+ 0", "1x", double signs, unrounded values and unfilled placeholders.
- Lesson numbers were recomputed (regression fits with numpy and scipy). Figures were rendered and inspected.

### Notes for a reviewer

- Lesson 36's data sets are made up for the lesson. Rocket: quadratic fit −4.91t² + 21.01t + 1.29. Car values: the log-linear exponential fit (what most calculators' ExpReg does) gives 30,980(0.8603)^x, and a direct least-squares fit gives 30,920(0.8609)^x. The lesson quotes 30,980(0.86)^x and says tools may differ slightly. Residuals in Example 3 come from the rounded models.
- Lesson 13 introduces ⌈x⌉ only in passing. Drills and questions model "per hour or part of an hour" as a list of pieces, not with ceiling notation.
- Lesson 27 Example 4 and question fg12 find approximate intersections with tables or technology. Logarithms are not used.
- Question fg11 mentions in its explanation that squaring √x = x − 2 gives a false solution. Squaring both sides is not taught in this course, so the lesson itself only uses graphs and checking.
- The VERIFY.md conventions are kept: exponential b > 0 and b ≠ 1, residual = actual − predicted, and no hand computation of r.
