# Precalculus (math-precalculus) — progress

Prefix `pc-`. Assumes Algebra 2. Trig is a compact review (separate Trig course).

## Outline (10 modules, 40 lessons)

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
10. pc-poly-zeros — rational zero theorem, FTA, complex conjugates — pc-cubic-roots, pc-conjugate-quadratic
11. pc-rational-asymptotes — domain, holes, VA, HA — pc-va-ha, pc-hole
12. pc-rational-graphs — slant asymptotes, intercepts, full graphs — pc-slant, pc-rational-intercepts
13. pc-inequalities — polynomial & rational inequalities — pc-quad-ineq, pc-rational-ineq

### pc-m4 Exponential and logarithmic functions
14. pc-exponential — pc-compound, pc-continuous
15. pc-logarithms — pc-log-eval, pc-change-base, pc-log-combine
16. pc-exp-log-equations — pc-exp-solve, pc-log-solve, pc-same-base
17. pc-exp-models — growth/decay, Newton cooling, logistic — pc-half-life, pc-doubling, pc-logistic, pc-cooling

### pc-m5 Trigonometry review (compact)
18. pc-unit-circle — pc-deg-to-rad, pc-exact-trig, pc-ref-angle
19. pc-trig-graphs-identities — pc-sinusoid, pc-identity-value, pc-double-angle

### pc-m6 Systems and matrices
20. pc-gaussian — pc-system3, pc-row-op
21. pc-matrix-ops — pc-matmul-2x2, pc-mat-combo, pc-matmul-entry
22. pc-matrix-inverse — pc-inverse-2x2, pc-solve-inverse
23. pc-determinants — pc-det-3x3, pc-cramer
24. pc-partial-fractions — pc-pf-linear, pc-pf-repeated

### pc-m7 Conics, parametric equations and polar coordinates
25. pc-parabolas — pc-parabola-focus
26. pc-ellipses — pc-ellipse-foci, pc-ellipse-center
27. pc-hyperbolas — hyperbolas, general form, rotation brief — pc-hyperbola-foci, pc-conic-discriminant
28. pc-parametric — pc-param-point, pc-param-eliminate
29. pc-polar — pc-polar-to-rect, pc-rect-to-polar
30. pc-polar-conics — pc-polar-conic-e, pc-polar-conic-vertex

### pc-m8 Vectors
31. pc-vectors-2d — pc-vector-mag-dir, pc-vector-combo
32. pc-dot-product — dot product, angle, projection, 3D — pc-dot-angle, pc-projection, pc-3d-distance

### pc-m9 Sequences, series, induction, counting
33. pc-sequences — sigma, arithmetic — pc-arith-nth, pc-arith-sum, pc-sigma
34. pc-geometric — pc-geo-nth, pc-geo-sum, pc-infinite-geo
35. pc-induction — pc-closed-sum
36. pc-binomial — pc-binom-coef, pc-pascal
37. pc-counting-probability — pc-perm-comb, pc-prob-select, pc-prob-union

### pc-m10 Introduction to calculus
38. pc-limits-intro — numerical/graphical, one-sided — pc-limit-piecewise, pc-limit-table
39. pc-limits-algebra — algebraic, limits at infinity, continuity — pc-limit-factor, pc-limit-infinity, pc-limit-rationalize
40. pc-tangent — tangent slope, derivative — pc-tangent-slope, pc-tangent-line, pc-derivative-def

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
