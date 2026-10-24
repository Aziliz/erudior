# Precalculus (math-precalculus) — progress

Prefix `pc-`. Assumes Algebra 2. Trig is a compact review (separate Trig course).

## Outline (10 modules, 43 core lessons)

### pc-m1 Functions in depth (HS)
1. pc-functions — Functions, notation, domain and range — drills: pc-eval-func, pc-domain-sqrt, pc-domain-rational
2. pc-piecewise — Piecewise functions and reading graphs — pc-piecewise-eval, pc-abs-solve
3. pc-behavior — Increasing/decreasing, extrema, average rate of change, difference quotient — pc-avg-rate, pc-diff-quotient, pc-quad-extremum

### pc-m2 Parent functions, transformations, composition, inverses
4. pc-parent-functions — Parent functions and symmetry (even/odd) — pc-even-odd-value
5. pc-transformations — Transformations — pc-transform-point, pc-transform-write
6. pc-composition — Combining functions, composition — pc-compose-eval, pc-compose-expr
7. pc-inverses — Inverse functions — pc-inverse-linear, pc-inverse-rational, pc-inverse-value

### pc-m3 Polynomial and rational functions
8. pc-polynomial-graphs — end behavior, zeros, multiplicity, IVT — pc-poly-leading, pc-poly-yint
9. pc-poly-division — long/synthetic division, remainder & factor theorems — pc-remainder, pc-synthetic-quotient
10. pc-complex-numbers — Complex numbers — pc-complex-mult, pc-complex-div, pc-complex-quadratic
11. pc-poly-zeros — rational zero theorem, FTA, complex conjugates — pc-cubic-roots, pc-conjugate-quadratic
12. pc-rational-asymptotes — domain, holes, VA, HA — pc-va-ha, pc-hole
13. pc-rational-graphs — slant asymptotes, intercepts, full graphs — pc-slant, pc-rational-intercepts
14. pc-inequalities — polynomial & rational inequalities — pc-quad-ineq, pc-rational-ineq

### pc-m4 Exponential and logarithmic functions
15. pc-exponential — pc-compound, pc-continuous
16. pc-logarithms — pc-log-eval, pc-change-base, pc-log-combine
17. pc-exp-log-equations — pc-exp-solve, pc-log-solve, pc-same-base
18. pc-exp-models — growth/decay, Newton cooling, logistic — pc-half-life, pc-doubling, pc-logistic, pc-cooling
19. pc-modeling-data — Modeling with functions and fitting data — pc-linreg, pc-exp-fit, pc-residual

### pc-m5 Trigonometry review (compact)
20. pc-unit-circle — pc-deg-to-rad, pc-exact-trig, pc-ref-angle
21. pc-trig-graphs-identities — pc-sinusoid, pc-identity-value, pc-double-angle

### pc-m6 Systems and matrices
22. pc-gaussian — pc-system3, pc-row-op
23. pc-matrix-ops — pc-matmul-2x2, pc-mat-combo, pc-matmul-entry
24. pc-matrix-inverse — pc-inverse-2x2, pc-solve-inverse
25. pc-determinants — pc-det-3x3, pc-cramer
26. pc-partial-fractions — pc-pf-linear, pc-pf-repeated
27. pc-linear-programming — Systems of inequalities and linear programming — pc-lp-max, pc-lp-min

### pc-m7 Conics, parametric equations and polar coordinates
28. pc-parabolas — pc-parabola-focus
29. pc-ellipses — pc-ellipse-foci, pc-ellipse-center
30. pc-hyperbolas — hyperbolas, general form, rotation brief — pc-hyperbola-foci, pc-conic-discriminant
31. pc-parametric — pc-param-point, pc-param-eliminate
32. pc-polar — pc-polar-to-rect, pc-rect-to-polar
33. pc-polar-conics — pc-polar-conic-e, pc-polar-conic-vertex

### pc-m8 Vectors
34. pc-vectors-2d — pc-vector-mag-dir, pc-vector-combo
35. pc-dot-product — dot product, angle, projection, 3D — pc-dot-angle, pc-projection, pc-3d-distance

### pc-m9 Sequences, series, induction, counting
36. pc-sequences — sigma, arithmetic — pc-arith-nth, pc-arith-sum, pc-sigma
37. pc-geometric — pc-geo-nth, pc-geo-sum, pc-infinite-geo
38. pc-induction — pc-closed-sum
39. pc-binomial — pc-binom-coef, pc-pascal
40. pc-counting-probability — pc-perm-comb, pc-prob-select, pc-prob-union

### pc-m10 Introduction to calculus
41. pc-limits-intro — numerical/graphical, one-sided — pc-limit-piecewise, pc-limit-table
42. pc-limits-algebra — algebraic, limits at infinity, continuity — pc-limit-factor, pc-limit-infinity, pc-limit-rationalize
43. pc-tangent — tangent slope, derivative — pc-tangent-slope, pc-tangent-line, pc-derivative-def

References: pc-ref-functions, pc-ref-exp-log, pc-ref-conics-polar, pc-ref-matrices-series

## Status
- [x] course.yaml
- [x] M1  - [x] M2  - [x] M3  - [x] M4  - [x] M5
- [x] M6  - [x] M7  - [x] M8  - [x] M9  - [x] M10
- [x] cards (204)  - [x] glossary (227)  - [x] references (4 sheets)

Notes: scratch scripts live in scratchpad/pc-work (scratchpad is shared with other writers). pc_check.sh = partial build + checker.

## Final state
40 lessons (10 modules), 481 questions (4 module-quiz questions per lesson; answer positions balanced ~114-128 each),
95 drills, 204 notecards, 227 glossary terms (every bolded lesson term has an entry), 4 reference sheets.
`python3 content/math/build.py precalculus` and `npx tsx tests/check-course.mts samples/math/math-precalculus.json`: zero problems
(checker re-run many times to catch rare random-input failures).

Notes for reviewers:
- Drills use `format: num1/num2/num4` on answer boxes for decimal display (same as other math courses).
- pc-conic-discriminant, pc-polar-conic-e and pc-limit-piecewise use a numeric "type" box (e.g. 1/2/3) to classify; a bit unusual.
- Trig module is intentionally compact (2 lessons); the separate Trigonometry course covers it in depth.
- Lesson 32 combines the dot product with 3D vectors and a brief cross product.


## Review (2026-10-16)

Independent review in three parts: every question solved before checking its key, every lesson example checked with sympy, every drill generated hundreds of times against an independent solver. All answer keys were correct.

Open cosmetic items: pc-exact-trig shows only a decimal; pc-system3's solution is generic; pc-transform-point shows 4/1 when B = 1; a lesson 08 graph is slightly clipped.

# Precalculus review: pc-m1 to pc-m3 (lessons 01-13, questions/drills m1-m3, cards.yaml)

Method: I solved every question in m1-m3 myself (sympy script q.py) before comparing it with the key. I hand-checked the lesson worked examples and rendered the lesson figures (figs.mts plus Playwright). I generated 300 instances of each of the 28 drills (gen.mts) and checked each answer by re-parsing the prompt as shown and solving it in sympy (chk.py).

All answer keys were correct and no question had two correct choices. No computed drill answer was wrong in 8,400 instances.

## Questions: Markdown that doesn't render
- pc-q-0101 and pc-q-1001: changed `**not**` to NOT.
- pc-q-0208 and pc-q-0604: replaced the Markdown tables with KaTeX `array`s.
- pc-q-0311: replaced the numbered list with "Step 1:/Step 2:/Step 3:" lines.
- pc-q-0101, 0107, 0113, 0208 and 0506: removed `*italics*`.

## Questions: explanations that named choices by position
These now name the expression itself: pc-q-0101 ("the first set"), 0305 ("second choice"), 0312 ("last choice"), 0602, 0607, 0612, 0703, 0709, 1005 and 1112.
- pc-q-0610: the explanation cited 49 and 19, which aren't choices. It now names the mistakes behind the real distractors 16, -2 and 42.

## Lessons: references to later material
- 01-functions: the range method cited $e^x > 0$ before exponentials are taught. Removed.
- 07-inverses Example 2: justified the range of g with "horizontal asymptote y = 1", which comes in Module 3. It now gives an algebraic reason.

All other worked examples, sign charts, holes and asymptotes, and figures checked out.

## Drills: ugly output and prompt wording
- These solutions printed `(x - (-2))` and `(x - (4))`. They now use signed negated values like `(x + 2)`: pc-domain-rational, pc-transform-point, pc-cubic-roots, pc-hole, pc-rational-intercepts, pc-quad-ineq and pc-conjugate-quadratic.
- pc-transform-point: also changed "`+ (-3)`" to signed form and `1(x - 3)` to coef form.
- pc-conjugate-quadratic: the prompt and solution showed "1i". They now use `{b:coef}i`.
- pc-rational-intercepts: the y-intercept answer box is a fraction kind, but the prompt didn't say how to answer. It now says "Give the y-intercept as an exact fraction or integer".

## Cards
- Sinusoid period changed from 2π/B to 2π/|B|. Everything else in cards.yaml checked out.

## Unresolved, or outside my scope
- The lesson figure in 08 (y = ½(x+2)(x-1)²(x-3)) is clipped slightly at the bottom: its minimum is about -8.1 and the window is [-8, 8]. Cosmetic, so I left it.
- pc-transform-point with B = 1 shows "x - 2 = (x - 2)" and "4/1". It's awkward but correct.

Final state: `build.py precalculus` OK; `check-course.mts` reports OK (0 problems).

# Precalculus review, modules pc-m4 to pc-m6 (lessons 14-24)

Verification: I solved all 108 questions independently (Python/sympy) and found every answer key correct with exactly one correct choice. I checked every lesson worked example with sympy: compound/continuous interest, log/exp solutions, models, unit circle, identities, Gaussian elimination, matrix products, 3x3 inverse, determinants, Cramer, and all 4 partial-fraction decompositions. All were correct. I generated 300 instances of each of the 29 drills (8,700 total), parsed each prompt as shown, and solved it independently. Every target matched, and a mutation test confirmed the checker catches wrong targets. I rendered all lesson figures with renderFigure plus app CSS and took Playwright screenshots; they match the text.

## Questions
- pc-q-2003: the explanation misnamed the distractor mistakes. It now says that adding in the constant column gives 16 and that not multiplying the constant by 3 gives -4.
- pc-q-1609: the stem used a Markdown numbered list. Rewrote it inline as "Step 1: ... Step 2: ...".
- pc-q-1508: removed Markdown italics. pc-q-2008 and pc-q-2105: removed Markdown bold from the stems.
- Positional references to choices ("first/second/third/last choice") replaced with the choice content in pc-q-1507, 1608, 1906, 2002, 2009, 2102, 2103, 2106, 2109, 2201, 2202, 2203, 2211 and 2412.
- pc-q-1909: the explanation's counterexample was garbled ("sin π = 0 ≠ 2"). Rewrote it to cover each false identity.

## Lessons
- 18: "This course has a separate Trigonometry course" changed to "Examiner has a separate Trigonometry course".
- 24: removed two references to telescoping sums in Module 9, which has none. The text now points to calculus series.
- 14 (Example 1 figure) and 19 (Example 1 figure): removed the parent-curve labels that overlapped the transformed-curve labels. The captions already identify the dashed curve.

## Drills (answers all correct; text cleanup)
- pc-log-combine: "1\log", "(3)\log" changed to coef/signedcoef forms.
- pc-exp-solve: "(5)^x" changed to "5^x".
- pc-log-solve: "= 27 - (5)" replaced by the computed right side.
- pc-same-base: "3^{1(x - 5)}" changed to use coef.
- pc-sinusoid: "4(x - (-1))", "1(x - (2))" changed to "{B:coef}(x {mC:signed})".
- pc-pf-linear: "= 1B", "= -1A" changed to coef.

## Unresolved / notes
- pc-exact-trig asks for an exact value, but the solution and answer display show only a 4-decimal value. The template system can't build the exact string. Grading is unaffected.
- pc-system3: the solution text is generic (describes the method, gives the answer) rather than showing this instance's row operations.
- No errors noticed in references/02-exp-log-trig.md or 03-matrices-series.md (not edited).

Build and check-course: 0 problems.

# Precalculus review, part C (pc-m7 to pc-m10, lessons 25-40, glossary, references)

Method: solved all 192 questions in m7-m10 independently before comparing keys; checked every lesson's worked examples (with Python where numeric); generated 400 instances of each of the 38 drills and verified every computed answer with an independent Python calculation; rendered every lesson figure and sample drill figures with the app stylesheet and screenshotted them.

## Answer keys
- All 192 keys correct; exactly one correct choice each; distractors wrong. No key changes needed.

## Questions fixed
- pc-q-3801: the stem used a Markdown table, which questions don't render. Rewrote the values inline as plain text.
- Explanations that pointed to choices by position (positions are shuffled). Each now names the choice instead: pc-q-2512, 2612, 2805, 2901, 3105, 3203, 3206, 3301, 3312, 3410, 3610, 3709, 3711, 3805.
- pc-q-2805: the stem now says the segment starts at (2, -1) when t = 0 and ends at (6, 3) when t = 1. Before, the reversed parametrization was arguably also correct.

## Drills fixed
- pc-arith-sum, pc-geo-sum: the prompts showed "23 + (28) + (33)" and "3 + (1.5) + (0.75)". They now list the terms. The solutions had "(23 + (173))" and "1 - (0.5)"; these are now clean signed or fraction forms.
- pc-geo-nth: terms and r now show as fractions instead of decimals like 1.25 and 0.5.
- pc-ellipse-center, pc-tangent-line: "(x - (-2))" in the solutions is now "(x + 2)".
- pc-ellipse-foci: the prompt now says to give the eccentricity as a fraction. The answer box only accepts fractions.
- pc-param-point: the figure's x-range was [-20, 20], but the point can reach x = ±22. Widened it to [-24, 24].
- pc-binom-coef: j now starts at 2, which removes "x^{1}" from the prompt.
- pc-prob-select: fixed the grammar ("exactly 1 of the marbles drawn are red").
- pc-parabola-vertex-form wasn't linked from any lesson. Added it to lesson 25's drills.
- All other computed answers matched in 400 instances each.

## Lessons
- Worked examples, definitions, conic foci and eccentricity, polar quadrant handling and the induction proofs all checked correct.
- Figures with overlapping or clipped labels:
  - L25 Example 3: "vertex" and "focus" labels overlapped.
  - L26: F2 label overlapped the vertex and curve labels.
  - L27: (4, 0) label overlapped "focus".
  - L28: two problems. In Example 1 the curve label overlapped "t = 2". The projectile plot had squashed y ticks and a clipped "lands" label.
  - L29: rose, cardioid and point labels overlapped.
  - L30: curve, focus, (2, 0) and directrix labels overlapped.
  - L39: two labels overlapped.
  - L40: the secant, tangent and curve labels overlapped.
  - Fix for all of these: moved the information into captions or placed free labels.
- L33: "(Lesson 35 proves them)" was inaccurate, because lesson 35 doesn't prove the sum of k. Reworded it.

## Glossary and references
- Glossary: the horizontal compression and stretch entries now give the factor as 1/|b| and note the reflection when b < 0. Period is now 2π/|B|.
- Reference sheets: no errors.

## Outside my scope
- No errors seen.

Build and check-course: 0 problems.

## Gap lessons (2026-10-17)

Fills the coverage gaps listed in VERIFY.md. Now 43 lessons, 527 questions, 105 drills, 225 cards, 256 glossary terms.

### New lessons
- `pc-complex-numbers` — Complex numbers (pc-m3) — `lessons/10-complex-numbers.md`. Drills: pc-complex-mult, pc-complex-div, pc-complex-quadratic. Ref: pc-ref-functions.
- `pc-modeling-data` — Modeling with functions and fitting data (pc-m4) — `lessons/19-modeling-data.md`. Drills: pc-linreg, pc-exp-fit, pc-residual. Ref: pc-ref-exp-log.
- `pc-linear-programming` — Systems of inequalities and linear programming (pc-m6, last lesson of the module) — `lessons/27-linear-programming.md`. Drills: pc-lp-max, pc-lp-min. Ref: pc-ref-matrices-series.

Lesson files renumbered to make room (ids unchanged): old 10–17 are now 11–18, old 18–24 are 20–26, old 25–40 are 28–43. "Lesson N" cross-references updated in 15, 25, 33, 36, 39 and 42; 11-poly-zeros now points back to the complex-numbers lesson, 32-polar points to the complex plane in Lesson 10, and 22-gaussian's intro mentions the new last lesson of the module.

### New questions
- pc-complex-numbers: pc-q-cn01 to pc-q-cn13 (module quiz: cn01, cn03, cn07, cn13) in questions/m3.yaml.
- pc-modeling-data: pc-q-md01 to pc-q-md13 (module quiz: md01, md04, md10, md13) in questions/m4.yaml.
- pc-linear-programming: pc-q-lp01 to pc-q-lp12 (module quiz: lp01, lp03, lp08, lp12) in questions/m6.yaml.
- Task B, lesson pc-gaussian (nonlinear systems): pc-q-2013 to pc-q-2016 (module quiz: 2013); topic "Nonlinear systems" added to the lesson.
- Task B, lesson pc-polar (polar form, De Moivre): pc-q-2913 to pc-q-2916 (module quiz: 2913, 2915); topic "Polar form of complex numbers" added to the lesson.
- Correct-answer positions of the 46 new questions: 12/11/11/12.

### New drills
pc-complex-mult, pc-complex-div, pc-complex-quadratic (drills/m3.yaml); pc-linreg, pc-exp-fit, pc-residual (drills/m4.yaml); pc-nonlinear-system, pc-lp-max, pc-lp-min (drills/m6.yaml); pc-de-moivre (drills/m7.yaml). pc-nonlinear-system is linked from pc-gaussian and pc-de-moivre from pc-polar.

### Cards, glossary, references
- 21 cards (topics Complex numbers, Fitting models to data, Systems of inequalities, Linear programming, Nonlinear systems, Polar form of complex numbers).
- 27 glossary terms: imaginary unit, complex number, real part, imaginary part, pure imaginary, complex plane, modulus; scatter plot, regression, residual, least-squares regression line, correlation coefficient, interpolation, extrapolation, linearizing, residual plot; linear programming, half-plane, boundary line, test point, system of linear inequalities, feasible region, corner point, bounded, objective function, constraint, corner point principle.
- Reference rows: "Complex numbers" table (pc-ref-functions), "Fitting models to data" tables (pc-ref-exp-log), a nonlinear-systems row and an "Inequalities and linear programming" table (pc-ref-matrices-series), and a polar-form/De Moivre table (pc-ref-conics-polar).

### Verification
- All 46 new questions solved in Python (sympy, numpy, scipy linprog) before fixing keys; distractors checked wrong. Lesson worked examples were checked the same way.
- Each new drill was generated 400 to 500 times with generate()/checkAll() on the built JSON (script /tmp/claude-0/gaps/precalculus/work/drills.mts). An independent solver reads each prompt as shown, and its answers matched every target. The shown answer, typed back in, was accepted every time, and a wrong answer was rejected. No "+ -", "1i", "1x" or "+ 0" output.
- New lesson figures were rendered with renderFigure and the app CSS and screenshotted. Labels on the two linear-programming figures were placed by hand.
- `build.py precalculus` and `check-course.mts`: 0 problems.

### Notes for a reviewer
- pc-de-moivre shows angles in degrees in its solution (like pc-rect-to-polar), and its decimal answers (e.g. 13.86 for 8√3) are shown to 2 decimals; exact forms such as 8sqrt(3) are accepted.
- pc-linreg uses x = 1..5 so the least-squares sums can be done by hand. The lesson also names the calculator commands (LinReg, QuadReg, ExpReg, LnReg) but doesn't depend on them.
- The modeling lesson introduces r only qualitatively (no formula).
- pc-lp-max/min choose the region so the optimum is unique (no ties); in about 2/3 of instances the optimum is at the crossing corner.
