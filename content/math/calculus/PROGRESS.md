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
