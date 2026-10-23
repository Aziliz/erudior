# Round 2 notes: de-m5 (Second-order linear equations)

`content/math/check-module.sh diffeq de-m5`: build and checker report zero problems
(6 lessons, 92 questions, 12 drills, 37 cards).

## Added

**Honors lessons** (honors: true, module de-m5)
- `lessons/21h1-inside-wronskian.md` (de-m5-h-wronskian), "Inside the Wronskian: Abel's formula
  and the space of solutions", 40 min, about 1,650 words. Proof of Abel's theorem (q cancels);
  the solution space has dimension 2 (existence = onto, uniqueness = one-to-one); principal
  fundamental set; $(y_2/y_1)' = W/y_1^2$ gives the reduction-of-order formula; rebuilding an
  equation from two solutions ($p = -W'/W$, $q = (y_1'y_2'' - y_1''y_2')/W$); Peano's warning
  ($t^2$, $t|t|$) and the uniqueness proof that W = 0 means dependence for solutions.
  Examples: W(2) from W(1); principal set of $y'' - y = 0$ (cosh, sinh); second solution $t$ of
  $(t-1)y'' - ty' + y = 0$ from $e^t$; recovering $t^2y'' - 2ty' + 2y = 0$ from $t$, $t^2$.
- `lessons/21h2-sturm-zeros.md` (de-m5-h-sturm), "Zeros of solutions: Sturm's theorems",
  45 min, about 1,750 words. Removing the $y'$ term ($Q = q - p^2/4 - p'/2$); Bessel's equation
  ($\nu = 1/2$ gives zeros exactly $\pi$ apart); separation theorem with proof; comparison
  theorem with proof; spacing bounds $\pi/M \le d \le \pi/m$; $Q \le 0$ gives at most one zero.
  Examples: Bessel; Airy on [4, 9] (checked against actual Ai(−t) zeros); counting zeros of
  $u'' + (4 + \cos t)u = 0$ on [0, 100] (55 to 72; numerically 63 or 64).

**Core lessons** (additions only, nothing rewritten)
- 18: plot of Example 1 as a sum of its two pieces; Mermaid flowchart "two solutions → W → general
  solution → add Y → fit constants". Drill de-m5-r2-abel added to front matter.
- 19: SVG of the root cases in the complex plane; Mermaid "which solution form" decision chart;
  plot of Example 3's repeated-root solution against $2e^{-3t}$.
- 20: Mermaid "complex roots → real solutions" chain; labeled SVG of a damped oscillation
  (envelope, peak-to-peak time, y(0), y = 0). Drill de-m5-r2-phase added to front matter.
- 21: Mermaid reduction-of-order steps; Mermaid Cauchy–Euler cases; plot of $t^2$ and $t^2\ln t$.

**Pictures** (4 SVGs, all under 30 KB, rendered and checked, markers checked on blanks):
de-m5-root-cases, de-m5-root-cases-blank, de-m5-damped-parts, de-m5-damped-parts-blank.

**Diagrams**: 7 Mermaid (5 in core lessons, 1 per honors lesson), all with accTitle/accDescr,
all rendered. **Plots**: 5 new (3 core, 2 honors).

**Questions** (`questions/r2-de-m5.yaml`, 48)
- Core de-m5-r2-q01…q20 (5 per lesson): text 6 (q01, q04, q07, q12, q17 + none other), match 3
  (q02, q08, q18), order 2 (q13, q16), select-all 5 (q03, q09, q14, q19), label 2 (q06, q11),
  MC 4 (q05, q10, q15, q20). module_quiz: q01, q03, q07, q09, q12, q17, q20.
- Honors de-m5-r2-h01…h14 (Wronskian lesson: 8 MC, 3 text, 1 select-all, 1 match, 1 order) and
  h15…h28 (Sturm lesson: 8 MC, 2 text, 2 select-all, 1 match, 1 order).
- Totals by type: MC 20, text 10, select-all 7, match 5, order 4, label 2.
- MC answer positions: 5 at each of 0–3.

**Drills** (`drills/r2-de-m5.yaml`, 5): de-m5-r2-abel (W(t1) from W(1), exact fraction; L18 and
21h1), de-m5-r2-phase (R and δ via atan2, 3 decimals, tolerance 0.0006; L20),
de-m5-r2-recover-eq (b, c of a Cauchy–Euler equation from $t^m$, $t^n$; 21h1),
de-m5-r2-invariant (K in $Q = A + K/t^2$; 21h2), de-m5-r2-zero-spacing (π/√(A+B), π/√(A−B);
21h2). Formulas checked over every input combination with sympy.

**Glossary** (`glossary-r2-de-m5.yaml`, 6, checked against every glossary*.yaml): solution
space, principal fundamental set, Sturm separation theorem, Sturm comparison theorem,
interlace, oscillatory.

**Cards** (`cards-r2-de-m5.yaml`, 19): 10 Solution spaces, 9 Oscillation theory.

## For a reviewer
- New topics: "Solution spaces" (21h1) and "Oscillation theory" (21h2).
- The comparison theorem is stated with "$Q_2 \ge Q_1$, not identically equal" so the
  conclusion (a zero strictly between) holds; the spacing bounds handle the equality case
  separately in the text.
- 21h1 says Liouville extended Abel's formula to any order (Liouville's formula); no date given.
- h22 relies on the counting argument from 21h2 Example 3 ("kth zero at most kπ/m").
- q14 "consecutive zeros π/3 apart" is about zeros (exact), not peaks.

## Errors found in existing content
None.

## Sources
- Sturm, "Mémoire sur les équations différentielles linéaires du second ordre", J. Math. Pures
  Appl. 1 (1836) 106–186 (numdam.org, JMPA_1836_1_1__106_0).
- Peano, "Sur le déterminant wronskien", Mathesis 9 (1889) 75–76; English translation and notes
  at maa.org (Convergence, "Peano on Wronskians: A Translation"). Muir named the Wronskian (1882).
- Airy zeros and zero counts computed with scipy (ai_zeros, solve_ivp); all algebra with sympy.
