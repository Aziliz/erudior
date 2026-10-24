# Round 2 review: de-m5 (Second-order linear equations)

Reviewer for item 45. `content/math/check-module.sh diffeq de-m5` reports zero problems after the
fixes (6 lessons, 92 questions, 12 drills, 37 cards).

Counts: answer-key errors 0, factual fixes 4, picture fixes 4 (plot labels), other fixes 4.

## Changes

### Factual
- **21h2, intro.** Said Module 9 solves "Airy's equation $y'' + ty = 0$" by power series; lesson 38
  solves $y'' - xy = 0$. Now says the lesson writes Airy's equation as $y'' + ty = 0$ and Module 9
  solves the same equation as $y'' - xy = 0$ with $x = -t$.
- **21h2, Key points.** "Sturm (1836) got these from the Wronskian alone" is not accurate history:
  Sturm's 1836 memoir used different arguments; the Wronskian-identity proofs are the modern
  route. Now: "These results go back to Sturm (1836); the proofs here use only Wronskian-type
  identities, without solving anything." (Sturm, JMPA 1 (1836) 106–186.)
- **21h1, Peano paragraph.** "Correcting textbooks … (His pair was built from $t^2$ the same way.)"
  made precise: Peano's 1889 pair was $t^2 + t|t|$ and $t^2 - t|t|$ (his $t^2[1 \pm \varphi(t)]$),
  and he corrected a claim found in "nearly all papers" (citing Hermite, Jordan, Laurent), not
  specific textbooks. Source: MAA Convergence, "Peano on Wronskians: A Translation".
- **21h1, Abel attribution.** "Liouville later extended it to equations of any order" softened to
  "the same identity for equations of any order, and for systems, is usually credited to Joseph
  Liouville (Liouville's formula)" (Wikipedia, Abel's identity / Liouville's formula give no
  firm attribution for the nth-order case).

### Other (proof gap, rounding, drill text)
- **21h2, spacing bound "at least π/M apart".** The comparison theorem needs $Q_2 > Q_1$
  somewhere, so the case $Q \equiv M^2$ on $[a, b]$ was not covered. Added: then $u$ is a
  multiple of $v$ and $b = a + \pi/M$ exactly.
- **de-m5-r2-h26 explanation.** $\pi/\sqrt{99} = 0.31574$, given as 0.3158; now 0.3157.
- **Drill de-m5-r2-recover-eq solution.** Printed "$t^{-3} \cdot -t^{-2} - -3t^{-4}$",
  "$-\dfrac{-5}{t}$" and "$(-3 + -1)$". Rewritten with parentheses, $p = \dfrac{b}{t}$, and an
  indicial check by sum and product of roots (new calc `s`). Values unchanged.
- **Drill de-m5-r2-invariant.** Prompt printed "$1t^2$" (now `{A:coef}`); solution printed
  "$-\dfrac{-3}{2t^2}$" and "$+ \dfrac{-3}{2}$". Now writes $q$ as one fraction, $p' = \dfrac{-k}{t^2}$
  (new calc `nk`) and $-\tfrac12(\ldots)$. Values unchanged.
- **Drills de-m5-r2-phase, de-m5-r2-zero-spacing.** Prompts ask for 3 decimals but the shown
  answer rounded to 2; added `format: dp3` (tolerance 0.0006 kept).

### Pictures (plots: labels sat on curves or on each other)
- L18 Example 1 plot: "(0, 1)" point label overlapped the dashed curve; moved to a free label.
- L19 Example 3 plot: function label sat on the curves near the axis; moved to (1.7, 0.7).
- L21 Example 2 plot: "y₁ = t²" label sat on the dashed curve; both labels placed in free space.
- 21h1 Peano plot: the two function labels overlapped each other ("g f=|t|t"); placed separately
  above and below the curves.

## Checked and right
- Every one of the 48 questions worked independently: keys, accept lists, select-all sets, order
  uniqueness, match/label pairings, distractor explanations. No answer-key errors.
- 21h1: Abel proof, Examples 1–4 (W(2) = 20; cosh/sinh principal set; second solution $t$ of
  $(t-1)y'' - ty' + y = 0$; $t^2y'' - 2ty' + 2y = 0$), the determinant formulas $p = -W'/W$,
  $q = (y_1'y_2'' - y_1''y_2')/W$, the $t^2$, $t|t|$ counterexample and the uniqueness argument.
- 21h2: $Q = q - p^2/4 - p'/2$ (re-derived), Bessel $Q$, separation and comparison proofs, the
  π/M and π/m bounds, Cauchy–Euler zeros $e^{\pi/4 + k\pi/2}$ / $e^{k\pi/2}$ (plot points match).
  Airy zeros 4.088, 5.521, 6.787, 7.944 (scipy `ai_zeros`); Example 3 bounds 55 and 72
  (100√3/π = 55.13, 1 + 100√5/π = 72.18); numerical counts 63/64 on [0, 100] and, for h22,
  28/29 on [0, 10π] confirmed with solve_ivp over 90 initial phases. h22 key 14 (10√2 = 14.14).
- Comparison theorem stated with "$Q_2 > Q_1$ somewhere" (correct strict-zero conclusion).
- Core additions: L20 picture equation $16y'' + 8y' + 65y = 0$ has roots $-\tfrac14 \pm 2i$;
  peak spacing $2\pi/\mu = \pi$; SVG geometry matches $2e^{-t/4}\cos 2t$.
- Both SVGs and blanks rendered; markers sit on the named parts. All 7 Mermaid diagrams rendered,
  content and accDescr correct.
- Drills: 400 instances each regenerated; every answer recomputed in Python (exact fractions for
  abel and invariant, atan2 for phase). Rounded answers accepted (tolerance 0.0006 ≥ 0.0005).
- Glossary (6) and cards (19) correct; no duplicate terms in any diffeq glossary file.
- Overlap: none with other round 2 lessons (no other NOTES2 covers Abel, Sturm or solution spaces).

## Uncertain / out of scope
- Round 1 plots with labels touching curves (not changed): L19 Example 2 plot, L20 Example 2
  plot ("y(t)" label on the curve).
- Exact attribution of the nth-order Abel identity (Liouville 1838 is commonly cited) left
  deliberately hedged.
