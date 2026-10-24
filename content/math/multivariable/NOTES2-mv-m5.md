# Round 2 notes: module mv-m5 (Double integrals)

`content/math/check-module.sh multivariable mv-m5`: build and checker report zero problems
(6 lessons, 99 questions, 15 drills, 40 cards).

## Added

**Honors lessons** (honors: true, module mv-m5)
- `lessons/24h1-numerical-double.md` (mv-m5-h-numerical, 45 min, ~1,850 words): "Approximating
  double integrals: midpoint, Simpson and Monte Carlo". Midpoint rule and its leading error term
  $\frac{h^2}{24}\iint f_{xx} + \frac{k^2}{24}\iint f_{yy}$ (order 2, exact for a + bx + cy + dxy);
  two-variable Simpson (product weights 1-4-1, exact for degree ≤ 3 in each variable, order 4);
  Monte Carlo integration, standard error ~ 1/√N, curse of dimensionality; comparison table of rates.
  Examples: halving the mesh for x² + y (9 → 9.25 vs 28/3); pond volume from a depth table
  (1410 m³); Simpson vs midpoint for e^{xy} on the unit square (exact Σ1/(n·n!) ≈ 1.317902);
  estimating π with 100 random points (78 hits, 3.12 ± 0.16).
- `lessons/24h2-improper-fubini.md` (mv-m5-h-improper, 45 min, ~1,530 words): "Improper double
  integrals and when Fubini fails". Exhaustions; absolute integrability; the Gaussian integral made
  rigorous by squeezing the square between two disks; critical exponent 2 for r^{-q}; comparison
  test; Tonelli and Fubini (general form); the counterexample (x² − y²)/(x² + y²)² with iterated
  integrals ±π/4; exponential waiting times P(X < Y) = a/(a + b). Examples: squeeze numbers at
  R = 1, 2; ∬ 1/r over the unit disk = 2π; comparison for 1/(x⁴ + y⁴); the counterexample; the
  waiting-time race (1/3).

**Core lessons 21–24** (additions only, each with a one-sentence intro where needed):
- 21: SVG of the solid with a slice A(x) and a Riemann column; Mermaid "choosing how to evaluate
  over a rectangle".
- 22: SVG of a Type I region with the slicing line; Mermaid "Type I / Type II / split / reverse".
- 23: SVG of a labeled polar rectangle (Δr, r Δθ, Δθ, r); Mermaid "rectangular or polar?".
- 24: Mermaid "center of mass steps"; SVG of a surface patch, its tangent-plane parallelogram,
  shadow ΔA and normal ⟨−fx, −fy, 1⟩.

**Pictures** (8 SVGs, original, each under 10 KB, rendered and checked, blank versions with
markers checked): mv-m5-slice(-blank), mv-m5-type1(-blank), mv-m5-polar-patch(-blank),
mv-m5-surface-patch(-blank).

**Diagrams**: 6 Mermaid (4 core, 1 in each honors lesson: choosing a numerical method; when an
improper integral may be iterated), all with accTitle/accDescr and rendered. Plus 3 new ```plot
figures in the honors lessons (Simpson weights grid, 100 Monte Carlo points, disk–square–disk
squeeze).

**Questions** (`questions/r2-mv-m5.yaml`, 48 new)
- Core mv-m5-r2-q01…q20 (5 per lesson): label 4 (q01, q06, q11, q16), text 4 (q02, q07, q12,
  q17), order 2 (q03, q08), match 4 (q05, q10, q14, q18), select-all 4 (q04, q09, q13, q19),
  MC 2 (q15, q20). module_quiz: q01, q02, q06, q10, q11, q14, q16.
- Honors mv-m5-r2-h01…h14 (numerical, 14: 9 MC, 2 text, 1 select-all, 1 order, 1 match) and
  h15…h28 (improper, 14: 8 MC, 2 text, 2 select-all, 1 order, 1 match). No module_quiz.
- Answer positions of the 19 new single-answer MC questions: 0: 4, 1: 6, 2: 5, 3: 4.

**Drills** (`drills/r2-mv-m5.yaml`, 5): mv-m5-r2-midpoint (2×2 midpoint estimate and its error),
mv-m5-r2-simpson (one Simpson panel for e^{cxy}, 4 decimals, tolerance 0.0001),
mv-m5-r2-monte-carlo (area from hits, points needed to cut the standard error),
mv-m5-r2-power-disk (∬ over a disk of (x² + y²)^{-q/2}, tolerance 0.01),
mv-m5-r2-exp-race (P(X < Y) as a fraction, box probability to 3 decimals, tolerance 0.0006).

**Glossary** (`glossary-r2-mv-m5.yaml`, 11 terms, checked against every glossary*.yaml in the
course, no duplicates): midpoint rule, Simpson's rule, order of accuracy, Monte Carlo
integration, standard error, curse of dimensionality, improper double integral, exhaustion,
absolutely integrable, comparison test, Tonelli's theorem.

**Cards** (`cards-r2-mv-m5.yaml`, 20): 11 numerical/Monte Carlo, 9 improper/Fubini–Tonelli.

## For a reviewer to double-check
- All numbers recomputed in Python/sympy/scipy: midpoint 9, 9.25; Simpson 1.318124 and 3×3
  midpoint 1.313376 for e^{xy}; ∬(x² + y²)e^{xy} = 1 (so predicted error 1/96 vs actual 0.0099);
  squeeze bounds 1.986/2.231/2.716 and 3.084/3.112/3.141; ∫∫1/(x⁴ + y⁴) over r ≥ 1 = √2 π;
  counterexample ±π/4; ∬|f| diverges (log growth checked numerically); 1 − 2/e; a/(a + b).
- Simplifications labeled as such in 24h2: improper integrals via exhaustions rather than
  Lebesgue theory; the claim that sign-changing double integrals have no conditional convergence
  is stated for this definition.
- The error-rate table (N^{-2/d}, N^{-4/d}, N^{-1/2}) is labeled as typical behavior for smooth
  integrands, not a guarantee; "within two standard errors about 95% of the time" is labeled
  approximate (CLT).
- History: Monte Carlo attributed to Ulam, von Neumann and Metropolis at Los Alamos, late 1940s;
  Fubini 1907, Tonelli 1909.
- The pond depth table in 24h1 Example 2 is invented, illustrative data.
- The honors ```plot figures passed the checker's render but were not viewed as images.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Standard results (midpoint/Simpson error terms, Monte Carlo standard error, Fubini–Tonelli,
the classical (x² − y²)/(x² + y²)² counterexample); checked against my own computation. No text
copied.
