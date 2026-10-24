# Round 2 review: de-h1 (Honors: Nonlinear dynamics and chaos)

Reviewer's independent check of lessons 90–93, `questions/r2-de-h1.yaml` (58), `drills/r2-de-h1.yaml`
(11), `glossary-r2-de-h1.yaml` (31), `cards-r2-de-h1.yaml` (38), and `images/de-h1-*` (7 SVGs).
`content/math/check-module.sh diffeq de-h1` after fixes: OK, zero problems.

Totals: answer-key errors 0; factual fixes 11; picture/figure fixes 4; other fixes 2.

## Changes

### Factual
1. **L90 Dulac's criterion** (lesson statement, proof sentence; glossary "Dulac's criterion" and
   "Bendixson's criterion"; card "Bendixson / Dulac criterion"). The hypothesis "has one sign and
   is not zero everywhere" is too weak: a divergence ≥ 0 that vanishes on an open patch can surround
   a closed orbit (Green's integral is then 0). Changed to "not identically zero on any small disk"
   and the proof sentence now says the divergence must not vanish throughout Ω. (Strogatz §7.2;
   standard statement requires no open subset where it vanishes.)
2. **L90 key point and card "Reading cycles from r′ = f(r)"**: "positive zeros of f are circular
   limit cycles" needs θ′ ≠ 0 on the circle and an isolated zero (otherwise a circle of equilibria
   or a band of closed orbits). Added both conditions.
3. **L92 opening**: the h = 2.5 Euler 4-cycle was listed in sorted order (0.536, 0.701, 1.158,
   1.225) while the text says the values "repeat"; the actual cycle order is 0.536 → 1.158 → 0.701 →
   1.225. Reordered (recomputed by iterating 200 steps).
4. **L92 "period-doubling bifurcation, the map's version of a Hopf bifurcation"**: wrong as stated
   (the map analog of Hopf is the Neimark–Sacker bifurcation; period doubling is the flip
   bifurcation). Reworded as "plays a role like a Hopf bifurcation … though it is a different
   bifurcation".
5. **Feigenbaum universality** (L92 text, glossary, card, h38 explanation): "every smooth one-hump
   map" → "with a rounded (quadratic) peak"; δ ≈ 4.669 holds for quadratic maxima only (other
   orders of maximum give other constants). (Feigenbaum 1978/1979; Strogatz §10.6.)
6. **L92 "past R∞, for most values of R … chaos"** (text, Mermaid box, accDescr): the measure of
   chaotic parameters is positive (Jakobson) but "most" is not an established fact; changed to
   "many".
7. **L92 Mermaid "R = 4: chaos everywhere"** → "fully chaotic" (R = 4 still has dense unstable
   periodic points; chaos is for almost every start).
8. **L93 "For r a little above 1 … their Jacobian has one negative real eigenvalue and a complex
   pair"**: false just above r = 1. With σ = 10, b = 8/3 all three eigenvalues at C± are real and
   negative until r ≈ 1.346, then one real + a complex pair (numpy eigenvalues for r = 1.1 … 2).
   Rewritten to say so.
9. **de-h1-r2-h13 explanation**: said a sign-changing divergence "is necessary for a closed orbit";
   false (a linear center has divergence identically 0 and is full of closed orbits). Now: a
   sign-changing divergence proves nothing either way.
10. **de-h1-r2-h30 explanation**: distractor 2.5 was attributed to "1 + h + r" (= 3.5). Now "adding
    h + r instead of multiplying"; also explains 0.5 (h alone).
11. **Drill de-h1-r2-annulus**: for a = 3…7, the system x′ = ax − y − x³, y′ = x + ay − y³ has 8
    extra equilibria lying inside the annulus r₁ < r < r₂ (e.g. a = 4: equilibria at r ≈ 2.14 and
    2.72, annulus 2 to 2.83), so the solution's "(and no equilibria inside) traps trajectories"
    invited a false Poincaré–Bendixson conclusion. Changed the rotation term to match a:
    x′ = ax − ay − x³, y′ = ax + ay − y³. The radial computation and answers (√a, √(2a)) are
    unchanged (the ±axy terms cancel); numerically the origin is the only equilibrium for every
    a = 2…7. The solution now says so and draws the conclusion.

### Pictures and figures
1. `de-h1-hopf-subcritical.svg`: "unstable cycle" text sat on the dashed red branch and the
   jump-down arrowhead ran into "stable equilibrium". Moved both labels (two-line "unstable / cycle"
   right of the branch; "stable equilibrium" right of the arrow). Blank copy and markers unchanged.
2. L90 Example 1 plot: curve label "r = 1" sat on the circle → moved to a free label at (1.38, −0.8).
3. L91 supercritical plot: "stable" label sat on the μ-axis line near the origin → free label
   "stable equilibrium" at (−0.3, 0.12).
4. L92 cobweb: "y = 2.8x(1 − x)" ran into the curve and "x* ≈ 0.643" was hidden under the cobweb →
   both moved to free labels in empty space.

### Other
1. Drill de-h1-r2-lorenz-origin printed `\sqrt{2,401}` (thousands comma in math) → `{disc:dp0}`.
2. L92 Mermaid first box wrapped "1 − 1/R" across lines → "stable fixed point x* = 1 - 1/R".

## Checked and found right (a reader might doubt these)
- All worked numbers recomputed in Python/scipy (rtol 1e-10): Example 1 Bernoulli formula and
  r(1) ≈ 0.84 / 1.05; Example 3 degree-9 polynomial has only the real root 0, cycle radius
  1.0695–1.2483; Van der Pol amplitude 2.0001 (μ = 0.1), 2.0086 (μ = 1), period 6.663 at μ = 1,
  y_max ≈ 2.68 (matches the plotted polygon); period ≈ 19.1 at μ = 10 vs leading-order 1.614μ
  (labeled "to leading order", fine). Example 4 amplitude 0.4000 (μ = 0.04), 1.0003 (μ = 0.25)
  (exact scaling x = √μ·u reduces it to Van der Pol, so ≈ 2√μ is right). Brusselator a = 1,
  b = 2.1: x in [0.709, 1.473], period 6.32. Subcritical radii 0.336 / 0.942 at μ = −0.1.
- L92: Euler sequences for h = 0.5, 1.5, 2.5; R = 2.8 cobweb values; R = 3.2 iterates; 2-cycle
  polynomial, multiplier 4 + 2R − R², stability to 1 + √6; R = 4 runs from 0.3 and 0.3000001 (agree
  to 3 decimals through step 13, differ 0.065 at step 20, plot values match); λ = ln 0.4 on the
  2-cycle; period-doubling values 3.4495, 3.5441, 3.5644, R∞ 3.5699, gap ratios 4.75, 4.66; R = 3.83
  is in the period-3 window (iterates settle on 0.156, 0.505, 0.957); R = 3.5 gives the 4-cycle.
- L93: divergence −41/3, e^−13.67 ≈ 1.2e−6; origin eigenvalues 11.83, −22.83, −8/3; C± eigenvalues
  −13.855, 0.094 ± 10.195i; r_H = 470/19 = 24.737 (subcritical, Strogatz §9.2); separation of runs
  from (1,1,1) and (1,1,1.000001) with DOP853 rtol 1e−13: exceeds 1e−5 at t ≈ 9.6, 0.0072 at t = 20,
  1.63 at t = 25. Horizon arithmetic (15, 30, 2.5 per decade). λ ≈ 0.906 and dimension ≈ 2.06 are
  the usual published values (Sprott, *Chaos and Time-Series Analysis*).
- History: Poincaré 1880s / Bendixson 1901; Van der Pol 1920s; Liénard 1928; Hopf 1942 with
  Andronov's school 1930s; Prigogine–Lefever 1968 (J. Chem. Phys. 48); Rosenzweig 1971 (Science 171,
  labeled as debated); May 1976 (Nature 261); Li–Yorke 1975; Sharkovsky 1964; Lorenz 1963 (J. Atmos.
  Sci. 20), the 12-variable model rounding story (~1961, three-decimal printout) and the 1972 AAAS
  talk; Saltzman's convection model (1962); Tucker 2002 (Found. Comput. Math. 2); Rössler 1976.
  Lorenz's physical meanings of x, y, z match the 1963 paper.
- The Van der Pol "degenerate case of the theorem" remark in L91 is right: at μ = 0 the equation is
  the linear center x″ + x = 0, so the first Lyapunov coefficient vanishes and the √μ law fails.
- Questions: all 58 worked before reading the key; every key right, every select-all set right, the
  4 order questions have a single valid order, match/label pairings unambiguous, text accepts
  complete (numbers compare by value).
- Label markers: trapping annulus (centre, inner circle, cycle, outer circle), subcritical Hopf
  (5 parts) and Lorenz (C+, C−, origin, outer loop) all sit on the named parts; all SVGs readable,
  ≥14 px text, under 20 KB. Orbit diagram: two-band region with the gap around x* up to band merging
  at R ≈ 3.68 is correct, period-3 window at 3.83 visible.
- Drills: 300 instances each generated with the app's generator; targets recomputed independently
  (numpy eigenvalues, iterating the map for the 2-cycle, etc.); correctly rounded answers accepted
  and answers off by 0.02 (or 1 for integers) rejected in every instance (1,288 distinct checks).
  No unfilled placeholders, "+ -" or thousands commas after the fix.
- Glossary: no term or alias duplicates any other glossary file in the course.

## Overlap
`10h2-gronwall.md` (de-m2) has a one-paragraph preview of sensitive dependence and Lorenz 1963; it
is consistent with L93 and the shared term "sensitive dependence on initial conditions" is defined
once (in de-m2's glossary). de-m4's honors lessons avoid limit cycles/Hopf/chaos; "critical slowing
down" is not defined in de-h1, so no duplicate. No other overlap.

## Left uncertain
- "Numerical attractor statistics are reliable under refinement" (L93) is correctly labeled as
  supported by computation rather than proved; left as is.
- The L90 decision flowchart box "Each root r = c > 0 is a circular limit cycle" omits the
  θ′ ≠ 0 / isolated-root caveat now in the key point; acceptable as a summary, not changed.
