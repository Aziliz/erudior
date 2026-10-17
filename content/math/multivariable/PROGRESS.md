# Multivariable Calculus (math-multivariable) — progress

Folder `content/math/multivariable`, id prefix `mv-`. College Calculus III; module 1 opens
with a bridge lesson reviewing the single-variable tools the course leans on.

## Outline

| # | Lesson id | Module | Title | Drills |
|---|---|---|---|---|
| 01 | mv-bridge | m1 | Bridge: the single-variable toolkit | mv-d-bridge-deriv, mv-d-bridge-integ |
| 02 | mv-vectors | m1 | Space and vectors | mv-d-dist3, mv-d-vec-ops, mv-d-unit |
| 03 | mv-dot | m1 | The dot product and projections | mv-d-dot-angle, mv-d-proj |
| 04 | mv-cross | m1 | The cross product | mv-d-cross, mv-d-tri-area, mv-d-triple |
| 05 | mv-lines-planes | m1 | Lines and planes | mv-d-plane-3pts, mv-d-point-plane |
| 06 | mv-surfaces | m1 | Cylinders and quadric surfaces | mv-d-sphere-center |
| 07 | mv-vector-functions | m2 | Vector functions and space curves | mv-d-vf-deriv, mv-d-vf-integ |
| 08 | mv-arc-length | m2 | Arc length and curvature | mv-d-arc-helix, mv-d-curv-plane |
| 09 | mv-tnb | m2 | The TNB frame and components of acceleration | mv-d-at-an |
| 10 | mv-motion | m2 | Motion in space and projectiles | mv-d-projectile, mv-d-speed |
| 11 | mv-several-vars | m3 | Functions of several variables | mv-d-domain-eval, mv-d-level |
| 12 | mv-limits | m3 | Limits and continuity | mv-d-limit-path |
| 13 | mv-partials | m3 | Partial derivatives | mv-d-partials, mv-d-second-partials |
| 14 | mv-tangent-planes | m3 | Tangent planes and linear approximation | mv-d-tangent-plane, mv-d-linearize |
| 15 | mv-chain-rule | m3 | The chain rule | mv-d-chain, mv-d-implicit |
| 16 | mv-gradient | m3 | Directional derivatives and the gradient | mv-d-gradient, mv-d-dir-deriv, mv-d-max-rate |
| 17 | mv-extrema | m4 | Local extrema and the second-derivative test | mv-d-crit-pt, mv-d-second-test |
| 18 | mv-absolute-extrema | m4 | Absolute extrema on closed regions | mv-d-abs-rect |
| 19 | mv-lagrange | m4 | Lagrange multipliers | mv-d-lagrange-line, mv-d-lagrange-box |
| 20 | mv-double-rect | m5 | Double integrals over rectangles | mv-d-dbl-rect, mv-d-dbl-avg |
| 21 | mv-double-general | m5 | Double integrals over general regions | mv-d-dbl-region, mv-d-reverse |
| 22 | mv-double-polar | m5 | Double integrals in polar coordinates | mv-d-polar-disk, mv-d-polar-area |
| 23 | mv-double-apps | m5 | Applications: mass, centers of mass, surface area | mv-d-mass-lamina, mv-d-centroid, mv-d-surf-area-graph |
| 24 | mv-triple | m6 | Triple integrals | mv-d-triple-box, mv-d-tetra-vol |
| 25 | mv-cylindrical | m6 | Cylindrical coordinates | mv-d-cyl-convert, mv-d-cyl-integral |
| 26 | mv-spherical | m6 | Spherical coordinates | mv-d-sph-convert, mv-d-sph-ball |
| 27 | mv-jacobian | m6 | Change of variables and Jacobians | mv-d-jacobian, mv-d-cov-linear |
| 28 | mv-vector-fields | m7 | Vector fields | mv-d-vf-eval, mv-d-grad-field |
| 29 | mv-line-integrals | m7 | Line integrals | mv-d-line-scalar, mv-d-work-line |
| 30 | mv-conservative | m7 | Conservative fields and the fundamental theorem | mv-d-potential, mv-d-ftli |
| 31 | mv-green | m7 | Green's theorem | mv-d-green-rect, mv-d-green-area |
| 32 | mv-curl-div | m8 | Curl and divergence | mv-d-curl, mv-d-div |
| 33 | mv-param-surfaces | m8 | Parametric surfaces and surface area | mv-d-param-normal, mv-d-cone-area |
| 34 | mv-surface-integrals | m8 | Surface integrals and flux | mv-d-flux-plane, mv-d-surf-int |
| 35 | mv-stokes | m8 | Stokes' theorem | mv-d-stokes-disk |
| 36 | mv-divergence | m8 | The Divergence theorem | mv-d-div-thm-box, mv-d-div-thm-ball |
| 37 | mv-physics | m8 | Vector calculus in physics | mv-d-gauss-flux |

Modules: m1 Vectors and the geometry of space · m2 Vector functions and motion ·
m3 Partial derivatives · m4 Optimization · m5 Double integrals · m6 Triple integrals and
change of variables · m7 Vector fields and line integrals · m8 Surface integrals and the
big theorems.

References: mv-ref-vectors, mv-ref-differential, mv-ref-integrals, mv-ref-vector-calculus.

## Status

- [x] course.yaml
- [x] m1 (6 lessons, 71 q, 13 drills)  - [x] m2 (4 lessons, 47 q, 7 drills)  - [x] m3 (6 lessons, 69 q, 12 drills)  - [x] m4 (3 lessons, 38 q, 5 drills)  - [x] m5 (4 lessons, 46 q, 9 drills)  - [x] m6 (4 lessons, 44 q, 8 drills)  - [x] m7 (4 lessons, 48 q, 8 drills)  - [x] m8 (6 lessons, 62 q, 10 drills)
- [x] cards, glossary, references
- [x] final build + check (zero problems)

## Final counts

37 lessons in 8 modules, 425 questions (152 in module quizzes; answer positions balanced),
72 drills, 187 notecards, 182 glossary terms, 4 reference sheets.

## Notes for reviewers

- Numbers in lessons, questions and drill formulas were checked with sympy; drills use closed
  forms (nested numerical `integ` works but is ~1.7 s per generation, too slow).
- Lessons 20, 25, 26 are near the 900-word floor; most others are 950-1500.
- Lesson 36 uses `\oiint` once (KaTeX accepts it).
- `mv-d-second-test` asks for a classification as a number code (1 min, 2 max, 3 saddle),
  since drills cannot take text answers.
- Lesson 37 (physics) states Maxwell's equations in SI vacuum form; worth a physics reviewer's glance.


## Review (2026-10-16)

Independent review in three parts: every question solved before checking its key, every lesson example checked with sympy, every drill generated hundreds of times against an independent solver. All answer keys were correct.

# Review: math-multivariable, modules mv-m1 to mv-m3 (lessons 01-16, questions m1-m3, drills m1-m3, cards)

All 187 questions were solved independently before I looked at the keys. All keys are correct, and each question has exactly one correct choice. I checked the worked examples in lessons 01-16 with sympy. They are correct. I generated each of the 32 drills 400-500 times and checked them against my own calculations; every computed answer matched.

## Questions (explanations)
- Some explanations pointed to choices by position. Answer positions are shuffled, so I replaced each reference with the choice's actual expression. Affected questions: mv-q-0306, 0501, 0511, 0611, 0705, 0707, 0709, 0903, 1003 (twice), 1301, 1305, 1403, 1504.
- mv-q-0310: removed Markdown italics (*unit*).

## Drills
- mv-d-chain: a value named `dz` collided with the `\dfrac{dz}{dt}` TeX, so the prompt, label and solution showed "\dfrac-36{dt}". I renamed the value to `rate`.
- Cleaned ugly output:
  - mv-d-bridge-deriv: "x^1" (n range is now 3-5) and "1e^{x}" in the solution.
  - mv-d-vf-deriv: "t^{1}" (n range is now 3-5) and "1e^{t}" / "-1e^{-t}" in the shown answer.
  - mv-d-arc-helix: "1\cos t" and "1t" (now uses coef).
  - mv-d-at-an: "1t" and "0t" (c != 0).
  - mv-d-vf-integ: "+ 0" (nonzero start values).
  - mv-d-curv-plane: "+ 0x" (b != 0), and "(1 + -3^2)" is now "(1 + (-3)^2)".
  - mv-d-plane-3pts: "1x" / "+ -" in the plane equation.
  - mv-d-domain-eval: "- 1x".
  - mv-d-limit-path: "0x^2", "y = 0x", "1x" and "x^2 + 1x^2".
  - mv-d-chain: "t^2 + 0" (b != 0).
  - mv-d-dir-deriv: "+ 1y^2" / "+ 0y^2".
  - mv-d-linearize and mv-d-max-rate: "1x^2" / "1y^2".
  - mv-d-tangent-plane: the solution printed "(x - (-2))", "0x" and "+ 0". It now gives A, B and C directly.
- mv-d-sphere-center: the "half of m with its sign flipped" wording was ambiguous. It now says h = -1/2(m).

## Lessons
- Figure labels were overlapping or clipped so badly that they could not be read. I moved or replaced them, and the content of the figures is unchanged:
  - 01 (cardioid/circle), 03 (proj labels on the tick numbers), 04 (|b| sin θ on top of b)
  - 06 (ellipse traces, saddle k labels), 07 (helix projection labels)
  - 10 (α labels piled at the landing point; the caption now identifies the curves)
  - 11 (circle labels, and parabola c labels piled at the top; c labels now sit at the vertices)
  - 12 ("c = -1" label sat at the origin), 13 (P on top of +y, c labels), 16 (c labels)
- Lesson 10: said "we found a = -ω²r" for a result Lesson 9 never derives. Changed to "differentiating twice gives".

## Cards
- All 187 cards checked; no errors.

## Final checks
- build.py and check-course both pass with 0 problems.

## Outside my scope
- I noticed nothing wrong in other modules. mv-d-centroid uses a "{k:coef}{n}" pattern that looks intentional; I did not check it.

# Review: math-multivariable, modules mv-m4 to mv-m6 (lessons 17-27)

## Method
- Solved all 124 questions in questions/m4-m6.yaml from stems and choices alone, then compared with the keys: all 124 keys correct, exactly one correct choice each. Read every explanation and distractor note.
- Checked every worked example in lessons 17-27 (second-derivative tests, closed-region tables, Lagrange systems, iterated, polar, cylindrical and spherical integrals, Jacobians) with sympy. No math errors found.
- Rendered all 22 lesson figures in the scope and sample drill figures with renderFigure, then took Playwright/Chromium screenshots. All regions match their bounds.
- Generated 400 instances of each of the 22 drills (8,800 total) and solved each one independently from the prompt text as shown (sympy/scipy; area by shoelace; Lagrange by solving the system). 0 mismatches, and every shown answer is accepted when typed.

## Fixes

### Questions (positional references; choices are shuffled)
- mv-q-2104: "the third choice" changed to name the integral itself.
- mv-q-2207: "The last choice" changed to name the theta range.

### Drills
- mv-d-lagrange-line: the solution wrote `{a}^2 + {b}^2`, which shows as -3^2 (that is, -9) for negative coefficients. It now writes `({a})^2`. Also fixed "-1\lambda" by using coef.
- mv-d-dbl-region: q could be 0, giving "+ 0x" in the integrand (added `q != 0`). Fixed "1x" for m = 1 in the solution and the figure label.
- mv-d-dbl-rect: the inner-integral step showed "1x(2)"-style text. Rewrote it as an evaluated antiderivative.
- mv-d-reverse: k = 1 gave "x/1" and "1y" (k now runs from 2 to 4).
- mv-d-polar-disk: the solution showed "1r^2", "H/1" and a rounded radius sqrt(3.3333). It now uses coef and an exact fraction.
- mv-d-polar-area: the outer integral had no limits (added them). The caption showed "1 cos". The figure range now scales with a, so small roses aren't tiny.
- mv-d-mass-lamina: density could show "+ 0x + 0y". q and s are now at least 1, and coef avoids "1x".
- mv-d-centroid: the prompt and solution showed "x^1" and "1x^1". The power term is now a labeled choice. The figure's y-range was fixed at 10 and clipped the region and the centroid point (up to y = 54), so it now scales with the curve.
- mv-d-surf-area-graph: "z = 0 + ..." (c is now at least 1).
- mv-d-triple-box: "1x" and "(1)yz" fixed with coef.
- mv-d-tetra-vol: "x/1" in the prompt and caption (a, b and c are now at least 2).
- mv-d-sph-convert: displayed "-0.00" (values are now rounded and normalized to 0).
- mv-d-sph-ball: the integrand showed "(...)^0" or "^1". It now uses labeled choices (sqrt, square, 3/2 power, 4th power), and the solution no longer prints rho^1.
- mv-d-jacobian: "1v" and "1u" for c = 1 (coef).

### Lesson figures (overlapping, unreadable labels)
- Lesson 17 contour map: the five level-curve labels were stacked at the top edge. Replaced them with placed labels.
- Lesson 25 (r, z) cross-section: the "cone z = r" and "plane z = 2" labels overlapped. Replaced them with placed labels.

## Outside my scope (not edited)
Questions that refer to choices by position, which break when choices are shuffled:
- m1: 112, 278, 425, 444, 530
- m2: 48, 66, 82, 240, 347-348
- m3: 196, 229, 323, 426
- m7: 60, 186, 239
- m8: 11, 53, 104, 171, 231, 452

These are line numbers in questions/mN.yaml.

## Final state
`python3 content/math/build.py multivariable` and `npx tsx tests/check-course.mts samples/math-drafts/math-multivariable.json` both report OK with zero problems.

# Review: multivariable mv-m7 / mv-m8 (lessons 28-37), glossary, references

All 58 m7/m8 questions solved independently (sympy, q.py); all keys correct, one correct choice each.
All lesson worked examples re-derived (curls, divs, line/surface integrals, cross products): no math errors.
18 drills x 400 instances checked against independent calcs (drills.mts): all answers correct, shown answers accepted.

## Fixes
Questions
- 10 explanations referred to choices by position (answers are shuffled): mv-q-2807, 2911, 3005, 3011, 3201, 3206, 3301, 3309, 3406, 3701. Now name the choice by content.
- mv-q-3306: distractor "<f_x, f_y, -1> only" had a stray "only"; removed.

Lessons
- L29: Example 3 now states that path-independent fields are exactly the conservative ones (mv-q-2903, in L29's quiz, relied on that fact).
- Figures: L29 overlapping path labels (unreadable) moved; L35 overlapping S1/S2/n labels moved; L36 "n = -k" label overlapped the lid label; L37 curve label clipped off the plot; side views in L34/35/36 now label the vertical axis z, not y.

Drills
- mv-d-vf-eval: b could be 0, giving "xy + 0"; added b != 0.
- mv-d-line-scalar: "+ (0)t" in parametrization; require x1 != x2, y1 != y2.
- mv-d-work-line: "2t^{1}" in solution; now "{n}t^{{n} - 1}".
- mv-d-green-rect: "(1x)" / "(-1x)"; now uses :coef.
- mv-d-cone-area: "1r" in solution; now :coef.
- mv-d-surf-int: "1z" in solution; now :coef.
- mv-d-div-thm-ball: "-1 + 1 + -1"; now signed.

References
- vectors.md: cone traces "ellipses, line pairs" -> vertical traces are hyperbolas (line pairs only through the axis).
- vectors.md: point-to-plane formula now names the plane form ax + by + cz = d (sign of d was ambiguous).

Glossary: no errors found.

## Unresolved / notes
- mv-d-gauss-flux answer box shows "2,258.87" while asking for 3 sig figs (accepted either way; display only).
- mv-d-work-line figure label shows "y = x^2" with a caret (figure text can't superscript a variable).
- No errors noticed outside my area.

Build + check-course: OK, zero problems.

## Source verification (2026-10-17)

Checked against Paul's Online Notes Calc III (Lamar), OpenStax Calculus Vol 3 / LibreTexts, MIT OCW 18.02SC and NIST CODATA 2022. Edits: hypotheses added (two-constraint Lagrange, Clairaut and Lagrange on the reference sheet, continuity for the conservative-field equivalences, Fubini card), cone traces (L06 and glossary), glossary wording (differentiable, Ampère), spherical-coordinate convention note (L26), constants and thermal diffusivity (L37), mu_0 "approximately" in mv-q-3704, and a new probability paragraph with glossary term "joint density function" (L23).

## Gap lessons (2026-10-17)

Fills the "least squares" coverage gap from VERIFY.md and makes the lesson-23 (now file 24) probability paragraph quizzable.
Totals now: 38 lessons, 443 questions, 76 drills, 196 cards, 188 glossary terms, 4 reference sheets. Build and check-course: zero problems.

### New lesson
| File | id | Module | Title |
|---|---|---|---|
| lessons/20-least-squares.md | mv-least-squares | mv-m4 | Least squares fitting (residuals, SSE, normal equations, second-derivative check, line through the origin, other linear models) |

Placed last in mv-m4, after Lagrange (it is unconstrained optimization; Lesson 17's test is what it uses).
Renumbered files (ids unchanged): old 20–37 are now 21–38. Every in-text "Lesson N" with N ≥ 20 was bumped by one (28 references across lessons 01, 03, 04 and 24–38).
New cross-references: lesson 01 tool table, lesson 17 intro, and lesson 19 end ("the next lesson") point to Lesson 20.
course.yaml: description mentions least squares; no module changes; id/revision/released/order untouched.

### New questions (18)
- mv-least-squares: mv-q-1951 – mv-q-1963 (13; module quiz 1951, 1954, 1957, 1963)
- Task B, mv-double-apps (joint densities): mv-q-2313 – mv-q-2317 (5; module quiz 2314, 2317). New topic "Joint densities" added to that lesson's topics (glossary term "joint density function" moved to this topic).
- Correct positions across the 18: 0×4, 1×5, 2×4, 3×5.

### New drills (4)
- m4: mv-d-ls-points (line through 4 points, number answers, figure), mv-d-ls-sums (normal equations from given sums, integer answers), mv-d-ls-origin (y = kx, 3 decimals)
- m5: mv-d-joint-density (C, P(X ≤ s, Y ≤ t), E(X) for Cxy on a rectangle; exact fractions), linked from lesson 24

### Also added
- Glossary (5): least squares line, method of least squares, normal equations, residual, sum of squared errors (alias SSE).
- Cards (9): 7 least squares, 2 joint densities.
- References: differential.md Optimization table gets two least-squares rows; integrals.md Applications table gets a joint-density row.

### Verification
- Every new question solved in Python (scratch keycheck.py, sympy/fractions) before fixing keys; all match; distractors checked to be wrong.
- Lesson examples checked with numpy/sympy (fits, S(m, b) expansion, ellipse contours from the eigen-decomposition).
- Each new drill generated 500–600 times (scratch drills.mts): targets match an independent solver reading the prompt (Cramer's rule; numerical double integration for the density); shown answer, a 2/3-decimal answer and an exact fraction accepted; a wrong answer rejected; no "+ -", "+ 0", "1x" or comma-grouped numbers.
- Lesson and drill figures rendered and screenshotted.

### Notes for a reviewer
- course.yaml revision not bumped (not allowed in this task); whoever releases should bump it and mention the new lesson.
- Lesson 24 (mv-double-apps) now links 4 drills (AUTHORING suggests 1–3).
- mv-d-ls-sums placeholder trap fixed during writing (a lone {n} in TeX was being filled); b is now shown as (Σy − mΣx)/n.
- Lesson 20 mentions the matrix form AᵀAc = Aᵀy only as an aside (no linear algebra prerequisite assumed).
