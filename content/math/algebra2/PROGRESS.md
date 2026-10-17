# algebra2


# Algebra 2: writer A progress

Scope: module a2-m1, the new lessons in a2-m2 and a2-m5, renumbering, and cleanup of the 15 lessons carried over from the old Algebra draft. Modules a2-m8 and a2-m9 belong to writer B (files 22–26, `*-b.yaml`, `prob-trig.md`). I didn't touch any of those.

## Lesson order (files)

| File | Id | Module | Status |
|---|---|---|---|
| 01-transformations | a2-transformations | a2-m1 | new |
| 02-piecewise | a2-piecewise | a2-m1 | new |
| 03-combining-functions | a2-composition | a2-m1 | new |
| 04-inverse-functions | a2-inverses | a2-m1 | new |
| 05-complex-numbers | alg-complex | a2-m2 | carried over (was 01) |
| 06-complex-quadratics | a2-complex-quadratics | a2-m2 | new |
| 07-three-variables | alg-three-var | a2-m2 | was 02 |
| 08–10 polynomial functions, division, rational roots | alg-poly-* / alg-rational-roots | a2-m3 | were 03–05 |
| 11–12 radicals, radical equations | alg-radicals, alg-radical-eq | a2-m4 | were 06–07 |
| 13–15 rational expressions, adding, equations | alg-rational-* | a2-m5 | were 08–10 |
| 16-rational-graphs | a2-rational-graphs | a2-m5 | new |
| 17–19 exponential, logarithms, exp/log equations | alg-exp-functions, alg-logs, alg-exp-log-eq | a2-m6 | were 11–13 |
| 20–21 arithmetic, geometric sequences | alg-arith-seq, alg-geom-seq | a2-m7 | were 14–15 |

None of the carried-over lessons changed id.

## New lessons

Each lesson runs about 1,260–1,590 words of prose (not counting figures). Each one has worked examples, figures, Common mistakes and Key points, and links `alg-ref-functions`.

- **a2-transformations**: parent function gallery (table and plot), translations, reflections, stretches and compressions, $a f(x - h) + k$ point mapping. 3 examples, 4 figures.
- **a2-piecewise**: evaluating, graphing with open and closed dots, joins vs jumps, $\lvert x \rvert$ as a piecewise function, floor function, a parking step function. 3 examples, 4 figures.
- **a2-composition**: $f \pm g$, $fg$, $f/g$ with domains, composition (machine diagram), order, domain of a composition, decomposing. 4 examples, 1 figure.
- **a2-inverses**: one-to-one, horizontal line test, restricting the domain, the swap-and-solve method, reflection across $y = x$, checking by composition. 4 examples, 1 figure.
- **a2-complex-quadratics**: vertex form and completing the square, the discriminant table, the quadratic formula with $D < 0$, why the roots are conjugates, sum and product of roots, building a quadratic from $p \pm qi$. 5 examples, 1 figure.
- **a2-rational-graphs**: the reciprocal function, holes vs vertical asymptotes, horizontal asymptotes by degree, intercepts, sketching steps, inverse and direct variation. 4 examples, 3 figures.

## Questions (72 new, 12 per lesson)

- `questions/a2-m1.yaml` (new): a2-q-0101–0112, 0201–0212, 0301–0312, 0401–0412.
- `questions/a2-m2.yaml`: added a2-q-0601–0612.
- `questions/a2-m5.yaml`: added a2-q-1601–1612.
- module_quiz: 4 per a2-m1 lesson, 3 for 06 and 4 for 16 (22 in total).
- Each lesson's correct answers are spread evenly, 3 at each index from 0 to 3.
- I solved every question myself and checked the numeric ones and the lesson examples with sympy (`/tmp/claude-0/a2a/vq.py`).

## Drills (18 new, 3 per lesson)

| Lesson | Drills |
|---|---|
| a2-transformations | a2-d-transform-point, a2-d-transform-vertex, a2-d-transform-write |
| a2-piecewise | a2-d-piecewise-eval, a2-d-piecewise-abs, a2-d-step-cost |
| a2-composition | a2-d-function-ops, a2-d-compose-eval, a2-d-compose-expr |
| a2-inverses | a2-d-inverse-linear, a2-d-inverse-value, a2-d-inverse-rational |
| a2-complex-quadratics | a2-d-cq-vertex, a2-d-cq-formula, a2-d-cq-from-roots (in drills/a2-m2.yaml) |
| a2-rational-graphs | a2-d-rat-features, a2-d-rat-hole, a2-d-inverse-variation (in drills/a2-m5.yaml) |

To verify the drills, I generated 300 instances of each with `generate()` on the built JSON (`/tmp/claude-0/a2a/dump.mts`). A Python script (`vd.py`) then recomputed every answer independently, plugged expression answers in at random points, and scanned the text for `+ 0`, `1i`, NaN and similar. All 5,400 instances passed.

## Cards, glossary, references

- `cards.yaml`: added 27 cards (now 101 in this file).
- `glossary.yaml`: added 35 terms (now 118 in this file). These cover every term bolded in the new lessons, plus 4 that the split had dropped (inconsistent, zero, base, growth factor). `inverse functions` now has a general definition with topic Inverse functions.
- `references/functions.md` (id unchanged) gained:
  - function-operation and inverse rows;
  - a Transformations table;
  - a Quadratics section;
  - a Graphs of rational functions section.
  
  Its title is now "Functions, quadratics, radicals, rational functions and polynomials".

## Fixes to the carried-over lessons

References to the old "Lesson N" numbers were replaced:

- **Now point to Algebra 1:** elimination, leading coefficient, exponent rules, factoring, equations with fractions, literal equations, repeating decimals, and $x^2 + 9$ not factoring over the reals.
- **Now point within this course:**
  - the Factor Theorem → "the next lesson";
  - the Intermediate Value Theorem → "the polynomial functions lesson";
  - the quadratic formula → "Module 2";
  - exponential functions → "Module 6";
  - logarithms as inverse functions → "see Module 1".
- 05-complex-numbers now points ahead to the new 06 lesson.
- 17-exponential-functions: "**factor**" became "**growth factor**", so the glossary doesn't link the plain word "factor".

## For the reviewer

- `python3 content/math/build.py algebra2` gives 26 lessons, 298 questions, 71 drills, 166 cards, 173 terms and 4 refs. `check-course` passes with 0 problems on the full course, writer B's modules included.
- Some overlap is intentional: 05-complex-numbers still has short examples of complex roots (its Examples 3–4), and the new 06 lesson covers that topic in depth.
- Every bolded term in all 21 of my lessons has a glossary entry, checked with `/tmp/claude-0/a2a/bold.py`.


# Algebra 2: modules a2-m8 and a2-m9 (writer B)

Status: done. The full course builds, and `tests/check-course.mts` reports OK on `samples/math-drafts/math-algebra2.json` (checked 2026-10-16, after the other writer's part also built).

## Files owned by writer B

- `lessons/22-counting.md` … `lessons/26-sine-cosine-graphs.md`
- `questions/a2-m8.yaml`, `questions/a2-m9.yaml`
- `drills/a2-m8.yaml`, `drills/a2-m9.yaml`
- `cards-b.yaml`, `glossary-b.yaml`
- `references/prob-trig.md` (id `a2-ref-prob-trig`, linked from all five lessons)

## Lessons

| # | id | Module | Topics | Words | Questions (module quiz) | Drills |
|---|---|---|---|---|---|---|
| 22 | a2-counting | a2-m8 | Counting principle; Permutations and combinations | ~1,310 | 12 (4) | a2-d-permutation, a2-d-combination, a2-d-committee |
| 23 | a2-probability | a2-m8 | Probability rules; Conditional probability | ~1,220 | 12 (5) | a2-d-addition-rule, a2-d-two-way, a2-d-prob-draw |
| 24 | a2-normal | a2-m8 | Normal distribution; Sampling and surveys | ~1,440 | 13 (5) | a2-d-empirical-rule, a2-d-normal-area, a2-d-margin-error |
| 25 | a2-unit-circle | a2-m9 | Angles and radians; Unit circle | ~1,230 | 12 (4) | a2-d-deg-rad, a2-d-coterminal-ref, a2-d-unit-circle |
| 26 | a2-trig-graphs | a2-m9 | Sinusoid graphs; Periodic models | ~1,290 | 12 (4) | a2-d-sinusoid-features, a2-d-sinusoid-from-graph, a2-d-periodic-model |

Each lesson has at least 4 worked examples, figures (a tree diagram, normal curves with shading, an angle in standard position, the unit circle, and sinusoid graphs), Common mistakes and Key points.

Totals: 61 questions (a2-q-2201 … a2-q-2612; 22 marked module_quiz, covering every topic), 15 drills, 65 cards, 55 glossary terms, 1 reference sheet.

## Verification

- Every question's answer and every worked-example number was checked in Python (math, fractions, scipy.stats.norm). The correct choice positions are spread evenly (3 per index per lesson; lesson 24 has 13 questions).
- Every drill was generated 300 times with `generate()` (via `normalizeCourse` on the built JSON), and each answer was recomputed independently in Python: 0 mismatches. Typical inputs were also tested: `sqrt(2)/2`, `7pi/6`, `pi/4` and `81.5%` are accepted, and unreduced fractions are rejected where lowest terms are required.
- Every bolded term in lessons 22–26 has an entry in `glossary-b.yaml`. No term or alias duplicates one in `glossary.yaml`.

## Notes for a reviewer

- `a2-d-unit-circle` stores each angle's worked solution in the choice label (`{ang}` prints the solution text and `{ang:int}` prints the angle). The labels were generated by a script and checked against `sind`/`cosd`.
- `a2-d-sinusoid-features` uses choice labels for `b` the same way: the label is the exact period (for example `\tfrac{2\pi}{3}`).
- The normal-area answer uses `format: dp4` to display 4 decimals. `formatNum` supports this, but the `NumFormat` type doesn't list it.
- Sin and cos drill answers need exact values (tolerance 0.001), so `0.71` is rejected for $\tfrac{\sqrt2}{2}$. This is intentional, and the prompt says "Type roots like sqrt(3)/2."
- Lesson 24 teaches `normalcdf`/`invNorm` as calculator commands and gives a z-table in the reference sheet for learners without one.


## Review (2026-10-16)

Independent review in two halves: every question solved before checking its key, every lesson example checked, every drill generated hundreds of times against an independent solver.

# Algebra 2 review, lessons 01–13 (reviewer A)

Scope: lessons 01–13, their questions (138) and drills (33), cards.yaml, glossary.yaml.
Every question was solved independently (by hand and with sympy) before the key was read. Every drill was generated 200–300 times and checked against an independent sympy computation (scripts: gen.mts, verify.py in this folder).

## Fixes

### Questions
- a2-q-0308 (questions/a2-m1.yaml): explanation used choice positions ("second and third pairs", "the last"), and the positions were wrong. Rewrote it to name each pair by content.
- a2-q-0409 (a2-m1): explanation used choice positions ("second pair", "third", "last"). Now names each pair.
- alg-q-3407 (a2-m3): "gives the third choice" changed to the actual result ($x + 7$, remainder 21).
- alg-q-3501 (a2-m3): "the last forgets the negatives" pointed at the correct answer, not the distractor. Rewrote it to describe the distractors by content.
- alg-q-3509 (a2-m3): "The second choice has non-real coefficients" now names the expression and also explains why $x^2 + 4$ is wrong.
- alg-q-3007 (a2-m5): the distractor $\frac{(x-1)^2}{x(x+3)^2}$ was described as "not flipping", but not flipping gives $\frac{(x-1)^2(x+1)}{x(x+3)^2}$. Corrected the distractor and replaced the positional explanation with the actual work.

### Lessons
- 13-rational-expressions: "Rational functions are studied in depth in precalculus" was out of date after the split, since lesson 16 of this module covers them. Now says "later in this module".
- 01-transformations: "a horizontal stretch looks exactly like a vertical one: $(2x)^2 = 4x^2$" changed to "a horizontal compression looks exactly like a vertical stretch". $f(2x)$ is a compression.
- 12-radical-equations, Example 7: "complete one swing" / "swing once every 2 seconds" was ambiguous with $T = 2\pi\sqrt{L/g}$. It now says the period is one full back-and-forth swing.

### Drills
- a2-d-compose-expr: when $a = -1$, the answer display and the solution showed "1x^2". Now uses `{A:coef}`.
- a2-d-function-ops: the solution showed "-1x^2" or "1x^2" when $ac = \pm1$. Now uses `{p2:coef}`.
- alg-d-rational-exp: could show unreduced exponents like $9^{-2/2}$. Changed `where` from `p != q` to `abs(p) != q`.
- alg-d-complex-div: the solution jumped from the numerator to the answer without dividing. Added the step that divides by $c^2 + d^2$.

## Checked, no change needed
- All lesson worked examples (01–13) verified step by step, figure specs read against the text, and cross-references to Modules 1, 2, 5 and 6 confirmed correct.
- All other question keys, distractors and explanations are correct.
- All 33 drills give correct answers, and their prompts state the answer format.
- cards.yaml and glossary.yaml: no errors found.

## Notes (not errors)
- Answer-index balance in a2-m3 (lessons 08–10) leans toward index 0 and 3. Left as is.
- Cosmetic only: alg-d-poly-zeros-graph shows the exponent ^{1} when m = 1; alg-d-find-zeros solution writes (x - (4)).

Build: `python3 content/math/build.py algebra2` OK; `npx tsx tests/check-course.mts samples/math-drafts/math-algebra2.json` OK (zero problems).

# Algebra 2 review, part B (lessons 14–26, cards-b, glossary-b, references)

All 135 questions for lessons 14–26 were solved independently before the keys were checked: every key is correct, and each has exactly one correct choice. Every worked example and lesson number was rechecked in Python (fractions, sympy, scipy). The 38 drills were each generated 400 times and checked against independent Python recomputation: 0 mismatches. Realistic typed answers (pi/6, sqrt(3)/2, 2pi/3, answers rounded as the prompt asks) are accepted.

Final state: `build.py algebra2` and `check-course.mts` both report OK.

## Fixes

### Questions
- a2-q-1612 (m5): the explanation named distractors by position ("the second… the third… the last"), and the order didn't match the choices. It now names each function.
- alg-q-4010 (m7): the explanation said "the last two". It now names the sequences.
- a2-q-2306, a2-q-2307 (m8): the stems used Markdown tables, which show as raw pipes in question text. Each is now a KaTeX `array` in `$$…$$`. The 2307 stem said "Using the same café survey", which can't be relied on once questions are shuffled, so it now introduces the survey itself.
- a2-q-2403, a2-q-2409 (m8): removed Markdown `*emphasis*` from the explanations (it rendered literally).
- a2-q-2407 (m8): removed the backtick code span from the explanation.

### Lessons
- Lesson 14: the heading "Three denominators" sat over an example with two fractions. Renamed it "Denominators with several factors".
- Lesson 18: the lesson said decibels work like the pH scale (each step of 1 is a factor of 10). Corrected: each 10 dB step is a factor of 10.

### Drills
- Answer-box labels don't fill `{placeholders}` (DrillRunner shows `spec.label` raw), so these labels showed literally:
  - a2-d-normal-area: "z-score of {lo}:" and "z-score of {hi}:" became "z-score of the lower/upper value:".
  - a2-d-deg-rad: `${deg}^\circ =$` became "Radians:".
  - a2-d-periodic-model: "Height after {t} min (m)" became "Height (m)".
- In some drills the answer shown after a miss was more rounded than the tolerance accepts. For example, 0.71 was shown for √2/2 with tolerance 0.001, so typing the shown value was marked wrong. Added `format: num4` to:
  - a2-d-unit-circle (sin and cos)
  - a2-d-deg-rad (radians)
  - a2-d-sinusoid-features (period)
  - a2-d-sinusoid-from-graph (b)
  - a2-d-periodic-model (b)
- The 1-decimal prompts showed 2-decimal answers. Added `format: num1` to a2-d-periodic-model (height) and a2-d-margin-error (all three boxes).
- alg-d-rat-add, alg-d-rat-eq: the solutions printed "-1x", "+ 1x" and "1x". They now use coef/signedcoef.
- alg-d-geom-sum, a2-d-margin-error: thousands commas inside TeX, such as `(1 - (65,536))` and `\sqrt{2,000}`, now use `:dp0`.
- alg-d-compound-interest, alg-d-continuous: the prompts now say "(to the nearest cent)".

### Glossary-b
- "normal CDF": removed a backtick code span. Glossary pop-ups render plain text, so the backticks showed.

## Checked with no errors
- cards-b.yaml (65 cards)
- glossary-b.yaml (55 terms)
- references: equations, functions, explog, prob-trig. The z-table values were verified with scipy.
- All lesson figures match their text.

## For the other reviewer (not edited)
- a2-q-0106 explanation contains Markdown `*stretch*`, which renders literally in question text.
- These answer labels in drills a2-m1 and a2-m3 contain `{placeholders}` that never get filled, so they show as literal text:
  - `$f({t1}) =$`, `$f({t2}) =$`
  - `$(f \circ g)({t}) =$`, `$(g \circ f)({t}) =$`
  - `$f^{-1}({v}) =$` (twice)
  - "Multiplicity at $x = {s}$"
- `$a_{{n}} =$` and `$S_{{n}} =$` in a2-m7 render as "a_n =" and "S_n =". They're harmless, so I left them.
- references/equations.md mentions linear programming, which this course doesn't teach. It's harmless, so I left it.


## Gap lessons (2026-10-17)

Fills the four "Common" coverage gaps from VERIFY.md and makes the lesson 12 (now file 14) even-numerator section quizzable.

### New lessons

| File | Id | Module | Title | Topics | Drills |
|---|---|---|---|---|---|
| 07-nonlinear-systems | a2-nonlinear-systems | a2-m2 | Nonlinear systems | Nonlinear systems | a2-d-nls-line-parabola, a2-d-nls-line-circle, a2-d-nls-elimination |
| 09-matrices | a2-matrices | a2-m2 | Solving systems with matrices | Matrices | a2-d-aug-2x2, a2-d-row-operation, a2-d-inverse-2x2 |
| 19-polynomial-rational-inequalities | a2-poly-rational-ineq | a2-m5 | Polynomial and rational inequalities | Polynomial inequalities; Rational inequalities | a2-d-poly-ineq-signs, a2-d-rat-ineq, a2-d-ineq-height |
| 26-binomial-theorem | a2-binomial | a2-m8 | The binomial theorem and Pascal's triangle | Pascal's triangle; Binomial theorem | a2-d-binom-expand, a2-d-binom-coef, a2-d-binom-term |

About 950–1,050 words of prose each (not counting display math or figures), 4–5 worked examples each, Common mistakes and Key points. Figures: 3 in 07 (intersections of lines, a parabola, a circle and a hyperbola), 3 in 19 (a parabola and two sign charts), 1 in 26 (Pascal's triangle). 09 has none, since its displayed matrices carry the visuals.

### Renumbering (ids unchanged)

07-three-variables → 08; 08–12 → 10–14; 13–16 → 15–18; 17–21 → 20–24; 22-counting → 25; 23–26 → 27–30. The source check's "Lesson 12" (radical equations) is now file 14. Order in module a2-m2: complex numbers, complex quadratics, nonlinear systems (uses the discriminant from the lesson before), three variables, matrices.

### Cross-references updated

- 08-three-variables: intro points to the matrices lesson next.
- 18-rational-graphs: intro points to the inequalities lesson next.
- 25-counting: "the next lesson" now names the binomial theorem, then probability.
- 27-probability: "the last lesson" became "the counting lesson".
- 14-radical-equations: links the new drill a2-d-even-exp.

### Questions (53 new)

- `questions/a2-m2.yaml`: a2-q-nls-01…12 (module quiz: 03, 05, 10, 12) and a2-q-mat-01…12 (module quiz: 03, 06, 09, 12).
- `questions/a2-m5.yaml`: a2-q-ineq-01…12 (module quiz: 02, 05, 08, 10; 01–06 polynomial, 07–12 rational).
- `questions/a2-m8.yaml` (placed after the counting questions): a2-q-binom-01…12 (module quiz: 02, 06, 09, 12; 01–04 Pascal's triangle).
- `questions/a2-m4.yaml`: alg-q-2811…2815 for alg-radical-eq, all on $u^{m/n} = c$ with $m$ even (module quiz: 2812, 2815). Lesson alg-radical-eq now has 15 questions with answer positions 4/4/4/3.
- Each new lesson has answer positions 3/3/3/3.

### Drills (13 new)

The 12 drills listed above, plus a2-d-even-exp (`drills/a2-m4.yaml`): solve $(x + h)^{m/3} = c$ with $m = 2$ or $4$, both solutions.

### Cards, glossary, references

- `glossary.yaml`: +19 terms (nonlinear system, circle, matrix, dimensions, entry, augmented matrix, coefficient matrix, row operations, row echelon form, Gaussian elimination, reduced row echelon form, RREF, identity matrix, inverse matrix, determinant, critical values, sign chart, polynomial inequality, rational inequality). `glossary-b.yaml`: +5 (binomial, binomial expansion, Pascal's triangle, binomial coefficients, binomial theorem). No duplicate names or aliases; every bolded term in all 30 lessons has an entry.
- `cards.yaml` +14, `cards-b.yaml` +6.
- `references/equations.md` (title now "…, systems and matrices"): three-variable line, Nonlinear systems and Matrices sections. `references/functions.md`: Polynomial and rational inequalities section. `references/prob-trig.md`: Binomial theorem section.
- `course.yaml`: description only (mentions the new topics). id, revision, released, order, subject, level, type and modules unchanged.

### Verification

- Every new question solved with sympy before fixing its key (`/tmp/claude-0/gaps/algebra2/vq.py`): 53/53 keys match.
- Every new drill generated 300 times with `generate()` on the built JSON (`dump.mts`). `vd.py` re-solved each instance from the prompt text alone (so the prompt values are the ones used), with sympy: 3,900 instances, 0 mismatches. The shown answer, typed back, was accepted in every instance, and a wrong answer was rejected. The term drill also accepts implicit products like `84x^5y^2` and rejects the unexpanded binomial.
- Lesson examples checked in sympy; figures rendered to PNG and inspected.
- `python3 content/math/build.py algebra2`: 30 lessons, 351 questions, 84 drills, 186 cards, 197 terms, 4 refs. `npx tsx tests/check-course.mts samples/math/math-algebra2.json`: OK.

### Notes for a reviewer

- The hyperbola figure in 07 sets `"color": "var(--fig-0)"` on both branches so they match. The CSS variable keeps the colour right in dark mode; the renderer passes it straight into a style attribute.
- a2-d-nls-elimination: about a third of instances have $y = 0$ (2 solutions), the rest 4, so the "number of solutions" box can't be answered by rote (reviewer change).
- a2-d-poly-ineq-signs asks for a count of integer solutions between the outer critical values. This tests endpoint inclusion without typing interval notation.
- Matrices are taught at Algebra 2 depth: row reduction, RREF read-off, and the $2 \times 2$ inverse formula. $3 \times 3$ inverses are left to a calculator.
- VERIFY.md's coverage-gap list is unchanged; its four "Common" items are now covered.
