# Round 2 review: de-m6 (Nonhomogeneous equations and applications)

Reviewed: honors lessons 27h1 (annihilators), 27h2 (quality factor), 27h3 (beams and buckling);
round 2 additions to lessons 22–27 (plots, Mermaid charts, SVGs and their intro sentences);
`questions/r2-de-m6.yaml` (72), `drills/r2-de-m6.yaml` (7), `glossary-r2-de-m6.yaml` (17),
`cards-r2-de-m6.yaml` (30), `images/de-m6-*` (4 pictures + 4 blanks). After fixes,
`content/math/check-module.sh diffeq de-m6` reports OK (9 lessons, 144 questions, 22 drills).

## Changes

| Where | Problem | Fix |
|---|---|---|
| de-m6-r2-h38 (order) | The step "use $y(0) = 0$, $y'(0) = 0$ to get $c_0 = c_1 = 0$" is independent of the free-end steps and could go anywhere between integrating and evaluating $y(L)$, so the order had more than one correct answer. | Removed that item (4 items now: integrate, $y'''(L)$ for $c_3$, $y''(L)$ for $c_2$, evaluate). Explanation now says why the clamped conditions are left out. |
| de-m6-r2-h29 (label), markers 2 and 3 | The pinned and roller markers sat right on the triangle and the wheels, hiding the details that tell the two supports apart. | Moved both to y = 36.2% (onto the ground hatching under each support), so the triangle and wheels stay visible. Previewed. |
| L25 resonance plot (¾t sin 2t) | The curve label goes at the right end of the curve (x = 15, y ≈ −11), where it sat on the curve's trough and on the dashed envelope. | Dropped the curve `label` and added a free label "u = ¾t sin 2t" at (4, 9), which is well clear of both. |
| 27h3 mode-shape plot | The "n = 2 (dashed)" label at (0.75, −1.1) sat on the trough of the dashed curve at y = −1 (about 11 px away, and the text overlapped it). | Moved it to (0.75, −0.5), between the two curves. |
| 27h1 "Annihilators", sums | "If the two share a factor, you need it only once" could be read as using the factor to the first power, which fails for $e^t + te^t$. | Now: "need it only once, to the higher of its two powers", with the example $(D - 1)^2$ for $e^t + te^t$. Same wording added to the matching card. |
| 27h3 Common mistakes | "A pinned end has $y'' = 0$ but $y' \ne 0$" makes $y' \ne 0$ sound like a boundary condition. | Now "no condition on $y'$ (it may rotate)". |
| drill de-m6-r2-annihilator-pick | The example in the prompt, ((r-1)^2+4)^2, is the actual answer for one of the possible instances. | Example changed to ((r-5)^2+9)^3, which no instance can produce (α only goes up to 3). |

## Checked and right (things a reader might doubt)

- Every one of the 72 questions worked independently. Keys, `accept` lists, select-all sets, order and match uniqueness all correct apart from h38. Notable: q08 (an Euler equation counts as "variable coefficients" for this course); q14 (energy never increases since $dE/dt = -\gamma u'^2$); h07 ($\sin^2 t$ has annihilator $D(D^2 + 4)$); h10 ($D(tD) \ne (tD)D$); h24 ($\tfrac12 < Q \le 1/\sqrt2$ oscillates freely but has no amplitude peak); h28 (exact ζ = 0.031814 and δ/2π = 0.031831 both round to 0.0318).
- h1 worked examples checked with sympy: Ex 2, $y'' + y = t\sin t$ gives $Y = -\tfrac14t^2\cos t + \tfrac14t\sin t$; Ex 3, $\tfrac16t^3e^t + 4$ solves $y'' - 2y' + y = te^t + 4$; Ex 4 coefficients $A = -\tfrac38$, $B = -\tfrac18$, $C = 0$, $E = -\tfrac14$. Ex 1 ($A = 1$) is right. Cross-references to L22 Ex 4, L26 (operator notation $p(D)$) and L27 ($t^s$ rule) match those lessons.
- h2: log decrement Ex 1 (δ = 0.2231, ζ = 0.0355, Q = 14.09 vs π/δ = 14.08); Ex 2 (ω_max = 9.994, R_max = 0.4001); RLC Ex 3 (ω0 = 10⁴ rad/s ≈ 1592 Hz, Q = 20, Δω = 500 rad/s ≈ 80 Hz). The half-power roots, Δω = γ/m exactly, ω₊ω₋ = ω0², and the phase lags π/4 and 3π/4 were derived again. The plot's ω± ≈ 0.905 and 1.105 for γ = 0.2 are right, and its point labels clear the curve. The energy definition of Q and the displacement-vs-power bandwidth are labeled as approximate or definition-dependent, as they should be.
- h3: simply supported 5wL⁴/384EI, cantilever wL⁴/8EI, clamped–clamped wL⁴/384EI (1/5 of the pinned value), ratio 9.6, Ex 1 sag 0.0264 m, Ex 3 P_cr ≈ 21.9 kN / 87.7 kN; pinned–pinned π²EI/L² and clamped–free π²EI/(4L²) are standard (e.g. Timoshenko & Gere, *Theory of Elastic Stability*; Gere & Goodno, *Mechanics of Materials*, deflection tables). Signs are consistent with y and w both measured downward. "Euler, 18th century" is safe (1744 *Methodus inveniendi*; 1757 paper).
- L25 transient plot: $u = e^{-t}(-2\cos 2t - 1.5\sin 2t) + 2\cos t + \sin t$ has u(0) = u'(0) = 0 and solves the equation. L22 plot curves are solutions of Example 2's equation.
- All 7 Mermaid charts rendered; content correct, accTitle/accDescr describe the whole chart, readable. All 4 SVGs and blanks rendered with markers. Spring–mass, RLC and complex-gain markers sit on their parts.
- Drills: formulas recomputed independently; over every possible input, correct 3-s.f. rounding stays within relTolerance 0.006 (worst cases: 0.29% log decrement Q, 0.39% RLC, 0.44% beam/buckling). Fixed-decimal tolerances are ≥ half the last place. Units are right (beam sag in mm, loads in kN).
- Glossary: no term or alias duplicates any glossary*.yaml in the course. Definitions and cards checked.
- Overlap: none with the other round 2 lessons in Differential Equations (checked every NOTES2 file and grepped the lessons for annihilator, Q factor, half-power, buckling, Euler–Bernoulli and exponential shift). 28-laplace-definition's s-shift is a different (transform) fact.

## Left uncertain

- Nothing material. The clamped–free factor 1/4 is stated without derivation (labeled as such by the writer); that's fine for an honors lesson.
