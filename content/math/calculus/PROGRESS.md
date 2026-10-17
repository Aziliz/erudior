# Calculus course — progress

id `math-calculus`, prefix `calc-`. Layered AP Calc AB → BC → college Calc I/II.
Question ids: calc-q-LLNN (LL = lesson number). Drill ids: calc-d-*. Refs: calc-ref-*.

## Outline (44 lessons, 11 modules)

### M1 Limits and continuity (calc-m1)
01 calc-limits-intro — graphical/numerical, one-sided — calc-d-limit-table, calc-d-limit-graph
02 calc-limit-laws — laws, factoring, conjugates — calc-d-limit-factor, calc-d-limit-conj
03 calc-limits-infinity — infinite limits, limits at infinity, asymptotes — calc-d-limit-inf-rational, calc-d-vert-asymptote
04 calc-squeeze-epsilon — squeeze, sin x/x, ε-δ — calc-d-limit-trig, calc-d-epsilon-delta
05 calc-continuity — continuity, discontinuity types, IVT — calc-d-continuity-k, calc-d-ivt-bisect

### M2 The derivative (calc-m2)
06 calc-derivative-def — slope, rate, limit definition, tangent line — calc-d-diff-quotient, calc-d-tangent-line
07 calc-derivative-function — f' as a function, graphs, differentiability — calc-d-avg-vs-inst, calc-d-piecewise-diff
08 calc-basic-rules — power/sum rules, e^x, higher derivatives — calc-d-power-rule, calc-d-second-deriv

### M3 Differentiation rules (calc-m3)
09 calc-product-quotient — calc-d-product, calc-d-quotient
10 calc-trig-derivs — calc-d-trig-deriv, calc-d-trig-tangent
11 calc-chain-rule — calc-d-chain-power, calc-d-chain-trig
12 calc-implicit — implicit, inverse trig — calc-d-implicit-slope, calc-d-inverse-trig
13 calc-exp-log-derivs — exp/log, log differentiation, inverse functions — calc-d-exp-log-deriv, calc-d-inverse-fn-deriv

### M4 Rates and approximation (calc-m4)
14 calc-related-rates — calc-d-rr-circle, calc-d-rr-ladder
15 calc-linearization — linearization, differentials, Newton — calc-d-linearization, calc-d-newton
16 calc-lhopital — calc-d-lhopital, calc-d-lhopital-exp

### M5 Analyzing functions (calc-m5)
17 calc-extreme-values — extrema, closed interval, Rolle, MVT — calc-d-closed-interval, calc-d-mvt-c
18 calc-first-derivative-test — calc-d-crit-points, calc-d-local-max
19 calc-concavity — second derivative test, inflection, sketching — calc-d-inflection, calc-d-second-test
20 calc-optimization — calc-d-opt-box, calc-d-opt-fence

### M6 Integrals (calc-m6)
21 calc-antiderivatives — calc-d-antideriv-poly, calc-d-ivp
22 calc-riemann-sums — sigma, Riemann sums, definite integral — calc-d-riemann, calc-d-sigma, calc-d-geometric-area
23 calc-ftc — both FTCs — calc-d-ftc-eval, calc-d-ftc1
24 calc-u-sub — calc-d-usub-indef, calc-d-usub-def
25 calc-motion-average — motion, net change, average value — calc-d-motion-velocity, calc-d-distance, calc-d-avg-value

### M7 Applications of integration (calc-m7)
26 calc-area-between — calc-d-area-between, calc-d-area-y
27 calc-volumes-disks — disks, washers, cross sections — calc-d-disk, calc-d-washer, calc-d-cross-section
28 calc-volumes-shells — calc-d-shell
29 calc-arc-length-surface — calc-d-arc-length, calc-d-surface-area
30 calc-physics-apps — work, fluid force, center of mass — calc-d-work-spring, calc-d-work-pump, calc-d-centroid

### M8 Techniques of integration (calc-m8)
31 calc-by-parts — calc-d-parts, calc-d-parts-def
32 calc-trig-integrals — trig integrals and trig substitution — calc-d-trig-integral, calc-d-trig-sub
33 calc-partial-fractions — calc-d-partial-fractions
34 calc-numerical-integration — strategy, tables, trapezoid/midpoint/Simpson — calc-d-trapezoid, calc-d-simpson
35 calc-improper — calc-d-improper, calc-d-improper-p

### M9 Differential equations (calc-m9)
36 calc-slope-fields-euler — calc-d-euler, calc-d-slope-field
37 calc-separable — separable, exponential, logistic — calc-d-separable, calc-d-exp-growth, calc-d-logistic

### M10 Sequences and series (calc-m10)
38 calc-sequences-series — sequences, geometric, telescoping, divergence test — calc-d-geometric-series, calc-d-sequence-limit
39 calc-integral-comparison — integral test, p-series, comparison, limit comparison — calc-d-pseries-bound
40 calc-alternating-ratio — alternating series, abs/cond, ratio, root, error — calc-d-alt-error, calc-d-ratio
41 calc-power-series — calc-d-radius, calc-d-power-series-rep
42 calc-taylor — Taylor/Maclaurin, remainder — calc-d-taylor-coeff, calc-d-taylor-approx

### M11 Parametric and polar (calc-m11)
43 calc-parametric — calc-d-param-slope, calc-d-param-arc
44 calc-polar — calc-d-polar-area, calc-d-polar-slope

## Status
- [x] course.yaml
- [x] M1 lessons 01-05, questions/m1.yaml (54 q), drills/m1.yaml (10), ref calc-ref-limits — built+checked
- [x] M2 lessons 06-08, questions/m2.yaml (34 q), drills/m2.yaml (6), ref calc-ref-derivatives — built+checked
- [x] M3 lessons 09-13, questions/m3.yaml (54 q), drills/m3.yaml (10) — built+checked
- [x] M4 lessons 14-16, questions/m4.yaml (35 q), drills/m4.yaml (6) — built+checked
- [x] M5 lessons 17-20, questions/m5.yaml (45 q), drills/m5.yaml (8) — built+checked
- [x] M6 lessons 21-25, questions/m6.yaml (55 q), drills/m6.yaml (12), refs calc-ref-integrals + calc-ref-applications — built+checked
- [x] M7 lessons 26-30, questions/m7.yaml (52 q), drills/m7.yaml (11) — built+checked
- [x] M8 lessons 31-35, questions/m8.yaml (55 q), drills/m8.yaml (9) — built+checked
- [x] M9 lessons 36-37, questions/m9.yaml (25 q), drills/m9.yaml (5) — built+checked
- [x] M10 lessons 38-42, questions/m10.yaml (55 q), drills/m10.yaml (9), ref calc-ref-series — built+checked
- [x] M11 lessons 43-44, questions/m11.yaml (22 q), drills/m11.yaml (4) — full build OK (44 lessons, 480 q, 90 drills, 5 refs)
- [x] glossary.yaml (200 terms; every bolded lesson term covered; emphasis bold converted to italics), cards.yaml (282) — full build+check OK

## Final state (all done)

- 11 modules, 44 lessons (all 900+ words, 2+ worked examples, common mistakes, key points), 480 questions
  (10-13 per lesson, answer positions 120/120/120/120, every lesson has 3+ module-quiz questions, module
  quizzes cover every lesson topic), 90 drills (19 expression incl. 6 antiderivative plusC, 24 exact
  fraction, 32 with figures: tangents, shaded areas, slope fields, parametric/polar curves, Riemann bars),
  282 notecards, 200 glossary terms, 5 reference sheets (limits, derivatives, integrals, applications,
  series + parametric/polar).
- `python3 content/math/build.py calculus` and `npx tsx tests/check-course.mts samples/math/math-calculus.json`: zero problems.
- Answers checked with sympy/python as written; drills sampled and scanned for formatting glitches
  (no thousands commas inside math, no `+ 0` terms, no placeholder collisions).

## For a reviewer

- Bold in lessons is reserved for glossary terms; emphasis/lead-ins use italics.
- Drill expression answers that involve logs use ln(x - r) (no abs) in the key so both ln|...| and ln(...)
  typed answers are accepted by the sampling checker.
- Lesson 7 (differentiability) and Lesson 4 (ε-δ) are the most theory-heavy; Lesson 32 combines trig
  integrals and trig substitution in one lesson to stay within 44 lessons.


## Review (2026-10-16)

Independent review in four parts: every question solved before checking its key, every lesson example checked with sympy, every drill generated hundreds of times against an independent solver (expression answers tested with equivalent and wrong forms). All answer keys were correct.

# Calculus review A (calc-m1..m3: lessons 01-13, questions m1-m3, drills m1-m3, cards.yaml)

Method: every question re-solved in sympy (q.py) before reading the key; all 13 lessons' worked
examples re-checked (sympy where computational); all lesson + drill figures rendered with
renderFigure and screenshotted (Chromium/Playwright); 26 drills x 300 seeded instances, each
answer recomputed in sympy from the prompt text as shown (verify.py), and checkAll run with a
correct equivalent form (must accept) and a common wrong form (must reject): 7800/7800 pass.

## Questions (all 130 answer keys correct; fixes are wording/scope)
- 0501: distractor used $f'(a)$ before derivatives are taught -> replaced.
- 0606, 0701, 0901, 0902, 1001, 1101: explanations referred to choices by position ("the last
  choice", "the third choice", "the first choice", "the others") -> name the expression instead.
- 0703: distractor "inflection point" (taught in Lesson 19) -> "a point where the graph is falling".

## Lessons
- 07: Example 3 used d/dx x^2 = 2x without saying where it comes from -> note it follows from the
  definition. Key point "f rising <=> f' > 0" is false (x^3 at 0) -> one-directional statement.
- 07 figure: f and f' labels overprinted each other -> moved into caption.
- 04 figure: "sin θ" label sat on the hypotenuse (length 1) -> moved beside the dashed vertical leg.
- 13 figure: inverse-function slopes illustrated with slope 1 vs 1/1 (shows nothing) -> tangents
  at (3, 2.25)/(2.25, 3), slopes 3/2 and 2/3, caption updated.

## Drills
- calc-d-product (Lesson 9): needed the chain rule (e^{cx}) two lessons early -> now
  (ax^2 + bx + c)e^x; answer/show/solution rewritten.
- calc-d-epsilon-delta: prompt used f(x) without defining it; answer box displayed 0.01 for
  0.0142857 (default 2-dp format) -> f defined, "exact or 4 significant figures", format sig4.
- calc-d-power-rule: n = 2 printed "14x^{1}" -> n now 3..6.
- calc-d-inverse-trig: n = 2 printed "x^{1}" -> n in {3,4,5}.
- calc-d-diff-quotient: "10 - 1h"; "+ (5)(2 + h)"; quotient "0 + 2h" possible -> signedcoef,
  added where 2ap + b != 0.
- calc-d-tangent-line: "y - (-1) = 7(x - (-1))", "-1·3x^2" -> cleaned; solution now explains f'
  via the definition (drill sits in Lesson 6, before the power rule).
- calc-d-limit-factor, -limit-conj, -continuity-k, -vert-asymptote, -avg-vs-inst, -piecewise-diff,
  -trig-tangent, -chain-trig: removed "(x - (-2))", "- (3)", "1·2x", "-(-10x - 4)" patterns;
  trig-tangent solution shows 3 dp to match the prompt.

## Cards
- sqrt(x + c^2) - c over x -> 1/(2c): added "c > 0".
- "Where f is increasing, f' is positive" (false at x^3, 0) -> "Where f' is positive, f is increasing".
- "Three ways a continuous function can fail to be differentiable" listed a discontinuity -> reworded.
- Remaining cards (whole file, incl. later modules) checked; no other errors.

## Unresolved / notes for others
- Lesson 5 IVT figure: point label "(1, −1)" overlaps the "root" label slightly (cosmetic).
- Lesson 12 says inverse-trig antiderivatives appear in Lesson 24; they first appear in Lesson 21's
  table (both are fine).
- Build + check-course: zero problems.

# Calculus review B: modules calc-m4 to calc-m6 (lessons 14-25)

## Questions (m4, m5, m6): 104 checked
I solved every question independently before looking at its key. All 104 keys were correct, each had exactly one correct choice, and every distractor was wrong.
- calc-q-2101: the explanation said "The second choice is the derivative", which refers to a choice by position. It now names $12x^2 - 6$.
- calc-q-2505: the explanation said "The first choice ... the second ...". It now names the two formulas.
- calc-q-1911: the stem was self-contradictory ("a point $(c, f(c))$ where $f(c)$ is undefined"). I reworded the stem and the matching choice.

## Lessons 14-25
I checked every worked example, definition and theorem hypothesis (EVT, Rolle, MVT, FTC 1/2, L'Hôpital, second derivative test). The arithmetic is correct throughout.
- L15 Example 1: the error of the $\sqrt{4.1}$ estimate was stated as 0.00016. The true error is 0.000154, so it now says 0.00015.
- L15 differentials figure: the Δy segment was drawn at x = 2.45, but its top was set at f(2.3), so it did not touch the curve. I added dashed connectors and a point on the curve at x = 2.3.
- L21 antiderivative-family figure: the four curve labels overlapped into unreadable text. I replaced them with placed labels and moved the C values into the caption.
- I rendered all the other figures, including the R₄ bars, which are centered and use right-endpoint heights. They match their text.

## Drills (26 in scope)
I generated 300 instances of each drill, then 150 more after the fixes, and recomputed every answer in sympy from the prompt text.

Correctness and grading:
- calc-d-opt-fence: placeholder trap. A value named `x` turned `\dfrac{A}{x}` into `\dfrac{450}15`. I renamed the values to px and py. Separately, `2{A}/x^3` rendered as "2450/x³"; it now shows `\dfrac{2\cdot A}{x^3}`.
- calc-d-antideriv-poly: the solution rendered `+ \cdot\frac{x^{-1}}{-1}` when c = 1 and `+ \cdot` when b = ±1. Both are fixed.
- calc-d-rr-circle: relTolerance 0.001 rejected correct answers typed to the requested 4 decimals (for example 0.0111). Changed to an absolute tolerance of 0.0001.
- calc-d-usub-def: the same problem (for example 0.1054 was rejected). Changed to an absolute tolerance of 0.0001, with display format num4.
- calc-d-lhopital-exp: the answer and solution showed "≈ 0" for e^-12. They now use 5 significant figures, and the prompt says "exact or 5 significant figures".
- calc-d-local-max: relTolerance 0.0005 was on the edge for 4 significant figures. Changed to 0.001.
- calc-d-riemann and calc-d-geometric-area: the prompts now say how to round.

Ugly output cleaned up:
- `(x - (-3))` in calc-d-closed-interval and calc-d-crit-points.
- Unreduced `\dfrac{2}{4}` and `4.5x^2` in calc-d-antideriv-poly. b is now even, with `a != n+1` added to `where`.
- Unreduced `\dfrac{6}{12}` in calc-d-usub-indef. Added `a != 2(n+1)` to `where`.
- `x^{1}` in calc-d-ftc1 and calc-d-local-max. n now starts at 3.
- `e^{-x/1}` in calc-d-local-max. k now starts at 2.
- `0 + \sqrt{}` in calc-d-geometric-area. k now starts at 1.
- `+ \left(-4\right)x^2 + (-1)x` in calc-d-ftc-eval.
- `1(285) + (-9)` in calc-d-sigma.
- `1\ln` and `-\frac{-4}{x^2}` in calc-d-lhopital-exp.
- `+ \dfrac{-0.3}{8}` in calc-d-linearization.
- `-0` in calc-d-motion-velocity and calc-d-ivp.

Expression drills (antideriv-poly, ivp, ftc1, usub-indef): checkAll accepted 800 out of 800 equivalent correct forms (expanded, factored, or shifted by +C) and rejected every wrong form.

The build and `tests/check-course.mts` both report OK.

# Review: calculus calc-m7 / calc-m8 (lessons 26-35, questions m7/m8, drills m7/m8)

All 109 questions solved independently (sympy) before checking keys: every answer key was correct.
All worked examples in lessons 26-35 re-derived; all arithmetic correct.
All 20 drills: 400 generated instances each checked against an independent sympy/scipy computation from the
prompt as shown (all targets correct); antiderivative drills checked with checkAll (sympy antiderivative + 7
accepted, a common wrong form rejected).

## Questions
- calc-q-2702: explanation referred to "the first choice" (positions are shuffled); now names the integrand and also explains the reversed $x^2 - x$ distractor.
- calc-q-2902: two distractors had the same value ($18$ and $\tfrac{54}{3}$). Replaced $\tfrac{54}{3}$ with $\tfrac{26}{3}$; explanation now names both mistakes.
- calc-q-2904: explanation said "the first choice ... the second"; now names the formulas.
- calc-q-3101: "The first choice is the sign slip" -> names the $-\cos x$ answer.
- calc-q-3309: two choices were correct antiderivatives ($\ln|x| + \ln|x+3|$ equals $\ln|x^2+3x|$), keyed only on "fastest method". Changed that distractor to the sign-slip $\ln|x| - \ln|x + 3|$; explanation updated.
- calc-q-3406: "The first two ... the third" -> names the integrals.
- calc-q-3407: "the second choice" -> names the expression and why it fails.
- calc-q-3502: "the first two fail" -> names $1/\sqrt x$ and $1/x$.

## Lessons
- 29-arc-length-surface, Example 6: used $\int\sec x\,dx = \ln|\sec x + \tan x|$ with no explanation; it is first introduced in Lesson 32. Added the formula with a pointer (check by differentiating; Lesson 32 derives it).
- 26-area-between, first figure: "top:" and "bottom:" curve labels overlapped into an unreadable string; widened y-range to [-1, 7].
- 28-volumes-shells, first figure: curve label sat on top of the "radius x" label; moved the curve label to a free spot.

## Drills
- calc-d-disk: prompt says "3 decimals" but relTolerance 0.0005 rejected 0.628 for pi/5 = 0.62832; raised to 0.001.
- calc-d-surface-area: prompt says 3 decimals but answer displayed with 2; added format dp3.
- calc-d-area-between: solution printed "(x - (-3))(x - (2))" and "(2 - (-3))^3"; now "(x + 3)(x - 2)" and "{gap}^3".
- calc-d-trig-integral: solution printed "u^{3 + 2}"; now uses a computed exponent.
- calc-d-trig-sub: a = 1 produced "1\tan\theta", "1^3", "\frac{1}{1}"; a now 2-6.
- calc-d-parts-def: k = 1 produced "\frac{x}{1}", "\tfrac{1}{1}"; k now 2-4.
- calc-d-improper-p: prompt now says how to answer ("Exact value.").

## Unresolved / notes
- None in scope. Lesson 26 "Example 4" (area of x^3 vs x) sits under the "Area from a rate" heading; harmless, left as is.
- calc-d-improper: p = 2 printed "\frac{6}{1}" and "\frac{1}{1\,t^{1}}" in the solution; p now 3-6 (p = 2 is covered in the lesson's examples and questions).

# Calculus review, modules calc-m9 to calc-m11 (lessons 36-44)

Every question in m9/m10/m11 was solved independently (sympy/scipy). All answer keys were correct, each had exactly one correct choice, and every distractor was wrong. All lesson worked examples, figures, glossary entries and the five reference sheets were checked. 18 drills x 300 instances were checked against an independent Python solver working from the prompt text: 0 wrong answers.

## Questions
- calc-q-4202: the explanation referred to choices by position ("the second choice ... the third"). It now names the series.
- calc-q-4301: same problem ("The first choice is upside down"). It now says "4/11 is dx/dy, upside down".
- calc-q-4410: same problem ("The first choice squares the difference"). It now names $(2\cos\theta - 1)^2$.
- calc-q-4002: "(The sum is $e^2 - 1$)" depended on an unstated start index. It now reads "Starting at $n = 0$, the sum is $e^2$".

## Drills
- calc-d-alt-error: "within $10^{-k}$" was ambiguous (it reads as <=). When $10^{k/p}$ is an integer, that reading gives an answer 1 lower than the key, which uses strict <. The prompt now says "with error less than". Also fixed the display of `n^1` and `(N+1)^1` using labelled choices.
- calc-d-separable: `x^{1}` appeared in the prompt and solution when n = 1. Now uses labelled choices (x / x^2).
- calc-d-geometric-series: a coefficient of 1 printed as "1\left(...\right)^n". Now uses :coef.
- calc-d-sequence-limit: "1n^2", "1n" when p = 1 or q = 1. Now uses :coef.
- calc-d-pseries-bound: "1·N^1" in the bound, and a thousands comma inside TeX (5,184). The bound now shows (p - 1)N^(p-1) = den, formatted with dp0.
- calc-d-radius: the prompt showed "b^n · 1" for the constant-denominator case. Now uses labelled choices (blank / n / n^2), plus a separate tied label for the solution text.
- calc-d-slope-field: could print "(0 - y)". Added the condition r2 != 0.
- calc-d-param-arc: the solution printed "x' = \cdot 2t" when a = 1. Now shows 2a and 3b as numbers.
- calc-d-polar-area: "1\cos^2" and "1\pi" when a = 1. Now uses :coef.

## Lessons
- 36: the Euler figure x-range was widened (2.2 to 2.9) so the "exact ≈ 11.78" and "Euler ≈ 7.125" labels are no longer clipped.
- All other examples, theorems and figures in lessons 36-44 checked out. Figures were rendered and screenshotted, and each matches its text.

## Glossary / references
No errors found.

## Not changed (cosmetic, noted)
- calc-d-euler figure: the slope-field step x3/6 is used on both axes, so for h = 0.1 the field is very dense. It is correct but busy.
- Lesson 44 cardioid/rose figure and lesson 41 geometric-series figure: curve labels overlap a little near their ends.
- calc-d-separable solution leaves the exponent unsimplified (e.g. $3x^3/3$). This is correct.
- calc-d-geometric-series solution shows $(r)^1$ for the n = 1 first term. This is intentional and correct.

## Gap lessons (2026-10-17)

Fills the two "Common" coverage gaps from VERIFY.md and makes the three short source-check sections quizzable.

### New lessons
- `calc-hyperbolic`, "Hyperbolic functions" (calc-m8), `lessons/36-hyperbolic.md`: definitions, graphs, identities (with the hyperbola picture), derivatives/integrals, inverse hyperbolics as logs with derivatives and the $\int dx/\sqrt{x^2 \pm a^2}$ forms, the catenary (sag and arc length). 4 worked examples, 4 figures. Placed last in the techniques module (after improper integrals) so it can use trig substitution (L32) and arc length (L29).
- `calc-linear-de`, "First-order linear equations and integrating factors" (calc-m9), `lessons/39-linear-de.md`: standard form, integrating factor derivation, constant-coefficient steady state/transient/time constant, mixing (constant and changing volume), RL (and RC) circuits. 5 worked examples, 1 figure.

### Renumbered files (ids unchanged)
36-slope-fields-euler -> 37, 37-separable -> 38, 38-sequences-series -> 40, 39-integral-comparison -> 41, 40-alternating-ratio -> 42, 41-power-series -> 43, 42-taylor -> 44, 43-parametric -> 45, 44-polar -> 46. Every "Lesson N" cross-reference with N >= 36 in lessons was updated to the new numbers. Question ids keep the original scheme (calc-q-43xx still belongs to calc-parametric, now file 45).

### New questions (38; positions 9/10/10/9)
- Hyperbolic (questions/m8.yaml): calc-q-hyp-01 … calc-q-hyp-13 (module quiz: 01, 03, 06, 10).
- Linear DE (questions/m9.yaml): calc-q-lin-01 … calc-q-lin-12 (module quiz: 01, 04, 07, 10).
- Lesson 22 trapezoidal sums with uneven data: calc-q-2212 (module quiz), 2213, 2214, 2215.
- Lesson 24 completing the square: calc-q-2412 (module quiz), 2413, 2414, 2415.
- Lesson 45 (was 43) vector-valued functions: calc-q-4312 (module quiz), 4313, 4314 (module quiz), 4315, 4316.

### New drills (9)
- m8: calc-d-hyp-deriv (expression), calc-d-hyp-integral (Pythagorean-triple limits, exact ln answer accepted), calc-d-catenary (sag + length).
- m9: calc-d-linear-ode (xy' + ny = cx^e, exact fraction), calc-d-mixing, calc-d-rl-circuit.
- m6: calc-d-trap-table (uneven table, trapezoidal + left sum; lesson 22), calc-d-complete-square (h, k, then arctan integral; lesson 24).
- m11: calc-d-vector-motion (r(T), speed, distance; lesson 45).

### Other edits
- glossary +14 (hyperbolic functions, hyperbolic cosine/sine/tangent, inverse hyperbolic sine, catenary, linear differential equation, standard form, integrating factor, steady-state solution, transient, time constant, mixing problem, RL circuit) -> 216. Cards +20 -> 302.
- References: hyperbolic derivative table (calc-ref-derivatives); hyperbolic integrals, "Hyperbolic forms" technique row and uneven-width trapezoid line (calc-ref-integrals); linear/mixing/RL rows and planar vector motion (calc-ref-applications). Lesson 45 now also links calc-ref-applications.
- Cross-references added: L29 (catenary pointer), L32 Example 6 (sinh⁻¹ pointer), L37 intro (Lessons 38 and 39), L38 common mistakes (x + y is linear; next lesson). course.yaml description mentions hyperbolic functions and first-order linear equations (protected fields untouched).

### Verification
- Every new question solved in sympy before keying (tmp script vq.py); distractors checked to be wrong; all lesson examples re-derived (dsolve for the ODE examples).
- Each new drill generated 600 times (tsx: generate/checkAll on the built JSON): answers matched an independent computation parsed from the prompt (RK4 for ODE drills, Simpson for integrals), the displayed answers were accepted when typed, alternative exact forms accepted (ln(5/3), pi/12, sqrt(981), expanded derivative), common wrong answers rejected, no unfilled placeholders or "+ -" text: 0 failures.
- Figures for both lessons and drills rendered with the app stylesheet and inspected.
- build.py and check-course: zero problems (46 lessons, 518 questions, 99 drills).

### For a reviewer
- Lesson 22 now links 4 drills (calc-d-riemann, calc-d-trap-table, calc-d-sigma, calc-d-geometric-area), one over the guideline of 3, to avoid orphaning an existing drill.
- The catenary ODE $y'' = \frac1a\sqrt{1 + (y')^2}$ is stated, not derived (the lesson verifies that $a\cosh(x/a)$ satisfies it).
- calc-d-hyp-deriv expects learners to type sinh/cosh; the parser has no sech, so the drill avoids tanh.
