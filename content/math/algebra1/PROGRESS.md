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
