# Trigonometry course — progress

Course id `math-trigonometry`, folder `content/math/trigonometry`, prefix `trig-`.
Lesson ids `trig-<slug>`, question ids `trig-q-LLNN` (LL = lesson number), drill ids `trig-d-<slug>`,
reference ids `trig-ref-<slug>`.

## Outline (9 modules, 38 lessons)

### trig-m1 Angles and their measure (high school)
1. 01 trig-angles — Angles and degree measure (standard position, coterminal, DMS). Drills: trig-d-coterminal, trig-d-dms, trig-d-decimal-dms
2. 02 trig-radians — Radian measure. Drills: trig-d-deg2rad, trig-d-rad2deg
3. 03 trig-arc-sector — Arc length and sector area. Drills: trig-d-arc-length, trig-d-sector-area, trig-d-arc-angle
4. 04 trig-speed — Angular and linear speed. Drills: trig-d-linear-speed, trig-d-angular-speed

### trig-m2 Right-triangle trigonometry
5. 05 trig-ratios — The six trig ratios. Drills: trig-d-six-ratios, trig-d-ratio-from-one
6. 06 trig-special — Special right triangles, exact values, cofunctions. Drills: trig-d-special-sides, trig-d-exact-special
7. 07 trig-solve-right — Solving right triangles. Drills: trig-d-right-side, trig-d-right-angle, trig-d-solve-right
8. 08 trig-applications — Elevation, depression, bearings. Drills: trig-d-elevation, trig-d-depression, trig-d-bearing

### trig-m3 Trig functions of any angle
9. 09 trig-any-angle — Trig functions of any angle. Drills: trig-d-point-ratios, trig-d-quadrant-given
10. 10 trig-reference — Reference angles. Drills: trig-d-reference-angle, trig-d-reference-rad
11. 11 trig-unit-circle — The unit circle. Drills: trig-d-exact-sin-cos, trig-d-exact-radian, trig-d-exact-tan
12. 12 trig-properties — Domain, range, periodicity, even/odd. Drills: trig-d-periodic, trig-d-even-odd

### trig-m4 Graphs of trig functions
13. 13 trig-graph-sincos — Graphs of sine and cosine. Drills: trig-d-read-graph
14. 14 trig-transform — Amplitude, period, phase shift, vertical shift. Drills: trig-d-amp-period, trig-d-write-sinusoid
15. 15 trig-graph-tan — Tangent and cotangent graphs. Drills: trig-d-tan-features
16. 16 trig-graph-sec — Secant and cosecant graphs. Drills: trig-d-sec-features
17. 17 trig-modeling — Modeling periodic data, simple harmonic motion. Drills: trig-d-model-data, trig-d-shm

### trig-m5 Inverse functions and basic equations
18. 18 trig-inverse — Inverse sine, cosine, tangent. Drills: trig-d-inverse-exact, trig-d-inverse-calc
19. 19 trig-inverse-comp — Compositions, other inverse functions. Drills: trig-d-inverse-comp, trig-d-inv-comp-algebra
20. 20 trig-basic-equations — Basic trig equations. Drills: trig-d-basic-eq, trig-d-eq-multiple-angle

### trig-m6 Identities and equations (college)
21. 21 trig-fundamental-ids — Fundamental identities. Drills: trig-d-pyth-find, trig-d-simplify
22. 22 trig-verifying — Verifying identities. Drills: trig-d-simplify-2
23. 23 trig-sum-difference — Sum and difference formulas. Drills: trig-d-sum-exact, trig-d-sum-given
24. 24 trig-double-angle — Double-angle, power-reducing. Drills: trig-d-double-given, trig-d-power-reduce
25. 25 trig-half-angle — Half-angle formulas. Drills: trig-d-half-exact, trig-d-half-given
26. 26 trig-product-sum — Product-to-sum, sum-to-product. Drills: trig-d-prod-to-sum, trig-d-sum-to-prod
27. 27 trig-equations-ids — Equations using identities. Drills: trig-d-eq-quadratic, trig-d-eq-calc

### trig-m7 Oblique triangles
28. 28 trig-law-sines — Law of sines (AAS, ASA). Drills: trig-d-los-side, trig-d-los-angle
29. 29 trig-ambiguous — The SSA ambiguous case. Drills: trig-d-ssa-count, trig-d-ssa-solve
30. 30 trig-law-cosines — Law of cosines. Drills: trig-d-loc-side, trig-d-loc-angle
31. 31 trig-triangle-area — Area formulas, Heron. Drills: trig-d-area-sas, trig-d-heron

### trig-m8 Vectors in the plane
32. 32 trig-vectors — Components, magnitude, direction, operations. Drills: trig-d-vec-components, trig-d-vec-mag-dir, trig-d-vec-ops
33. 33 trig-dot-product — Dot product, angle, projection. Drills: trig-d-dot, trig-d-vec-angle, trig-d-projection
34. 34 trig-vector-apps — Forces, navigation, work. Drills: trig-d-resultant, trig-d-navigation, trig-d-work

### trig-m9 Polar coordinates and complex numbers
35. 35 trig-polar — Polar coordinates. Drills: trig-d-polar-to-rect, trig-d-rect-to-polar
36. 36 trig-polar-graphs — Polar equations and graphs. Drills: trig-d-polar-eval, trig-d-rose
37. 37 trig-complex-trig — Trig form of complex numbers, products/quotients. Drills: trig-d-complex-trig, trig-d-complex-mult, trig-d-complex-to-rect
38. 38 trig-demoivre — De Moivre's theorem and nth roots. Drills: trig-d-demoivre, trig-d-nth-roots

References: trig-ref-unit-circle, trig-ref-identities, trig-ref-triangles (triangles, vectors, polar, complex).

## Status
- [x] m1  - [x] m2  - [x] m3  - [x] m4  - [x] m5  - [x] m6  - [x] m7  - [x] m8  - [x] m9
- [x] cards  - [x] glossary  - [x] references  - [x] final build/check

## Notes
- Placeholder trap: never write {x}/{y}/{r} etc. as TeX args when those are drill values; use \, prefix.
- Peek script (scratchpad) prints a sample of each drill.
- References written: unit-circle, identities, triangles-vectors-polar.
- Exact-answer display trick: two choice vars (question label, answer label) with `where: k == ans` (or equal numeric values).
- Answer-index balance is skewed to 1; rebalance at the end by swapping choices (text-level script).

## Final state (build + checker: zero problems; also stress-tested drills at 400 runs each)
- 9 modules, 38 lessons (~880-1100 words each, 3-8 worked examples, many plots/shapes)
- 430 questions (152 in module quizzes; answer index balanced 107-108 per position)
- 88 drills, 206 notecards, 168 glossary terms, 3 reference sheets
- Drill notes: exact-value drills accept typed forms like sqrt(3)/2 and show exact answers in the
  solution via paired choice labels; several drills exclude values near -15.54 so the checker's
  synthetic wrong answer (1.5x + 7.77) is never within tolerance.
- Lesson topics drill ids that changed from the outline: trig-d-identity-check dropped;
  extra drills added (trig-d-sincos-value, trig-d-sinusoid-cycle, trig-d-ferris, trig-d-eq-calc-basic,
  trig-d-two-observations, trig-d-loc-nav, trig-d-roots-unity, trig-d-half-*, etc.).

## For a reviewer
- Inverse cotangent uses the range (0, π) convention (stated in lesson 19); some books differ.
- Lesson word counts are measured including inline math; a few are just under 900 plain words.
- Glossary includes every bolded term; non-term bold (step labels, "Common mistakes" items) is emphasis only.
