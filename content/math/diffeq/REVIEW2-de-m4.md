# Round 2 review: de-m4 (Autonomous equations and numerical methods)

Reviewer for item 44. I checked all round 2 work: the 3 honors lessons (17h1, 17h2, 17h3), the additions to core lessons 14–17, `questions/r2-de-m4.yaml` (61), `drills/r2-de-m4.yaml` (6), `glossary-r2-de-m4.yaml` (24), `cards-r2-de-m4.yaml` (28) and the 10 `images/de-m4-*` SVGs. `content/math/check-module.sh diffeq de-m4` reports OK after my fixes.

## Changes

### Answer key / question fixes
- **de-m4-r2-h09** (match): the pairing was ambiguous. "Collapse from any starting stock" also fits effort above $r$, because under $E > r$ every stock also declines to zero. I reworded the two answers so they differ in a way that can be checked. Quota above MSY: "Stock hits zero in finite time from any start" ($P' \le rK/4 - h < 0$). Effort above $r$: "Slow decline, approaching zero only as t grows without bound" ($P' \approx (r - E)P$, exponential decay). I updated the explanation to match.
- **de-m4-r2-h38** (explanation): the explanation said that distractor 1.7498 came from "subtracting the correction". It did not: subtracting the correction gives 1.7716 − 0.0436 = 1.7280. The distractor 1.7498 is the average of the two results, and the explanation now says so. The key (1.8152) was already correct.

### Factual fixes
- **17h2, "Example 3" paragraph**: "Most production stiff solvers are built on backward-Euler-like formulas" became "Many widely used stiff solvers…". "Most" overstates it. BDF/NDF codes (LSODE, CVODE, DASSL, MATLAB ode15s) are widespread, but so are Radau IIA and Rosenbrock codes (SciPy `Radau`, MATLAB ode23s), and the lesson itself names SciPy's `Radau`.

### Picture and plot fixes
- **de-m4-stability-regions.svg and -blank.svg**: the white halo behind the "−2" tick label (Euler panel) and the "2" tick label (backward Euler panel) hid part of the circle boundary, so each circle looked open where it crosses the real axis. I moved those two labels beside their ticks so the circles draw closed. The markers did not change.
- **17h1 yield plot**: the label "Y = EK(1 − E/r)" sat on the curve, and the "effort E" axis label touched the curve's end at E = 1. I moved the label to (0.9, 22) and widened x to [0, 1.2].
- **17h1 return-time plot**: the "quota h" axis label crossed the dashed h = 25 line. I widened x to [0, 30].
- **17h2 backward Euler plot and 17h3 adaptive plot**: the automatic function label "exact" sat on the curve. I replaced it with a free label, "exact solution", placed off the curve.

### Other
- **17h2 Mermaid "Is a problem stiff?"**: "about 2 / |λ|" wrapped with |λ| alone on a second line. It now reads "about 2/|λ|".

## Checked and found right (a reader might doubt these)
- **Numbers, recomputed in Python/sympy:**
  - 17h1: Example 1 (312.5, 93.75, 100, 125, 75) and the Example 2 table.
  - 17h1 Example 3: collapse time 5 ln(10/3) = 6.02, from partial fractions −100/((P−40)(P−60)). The logistic recovery $60/(1 + \tfrac57 e^{-0.6t})$ passes 59 at t = 6.23.
  - 17h2: the exact solution of y′ = −1000(y − cos t) (dsolve). Euler gives 100, −9800.5, 970347. Backward Euler gives 0.9852, 0.9801, 0.9556 and the plotted dots through t = 1. The trapezoidal method gives 1.956, 0.057, 1.843 (errors ±0.9). The Newton iterates are 0.75 and 0.732143. The RK4 real stability limit is −2.78529.
  - 17h3: the Richardson tables (Euler estimate 0.059555 against actual 0.064984; extrapolated error 0.0054, about 12× smaller; Heun 0.001037 against 0.001091, error 5.4e−5). Example 2 is right (0.84, 0.04, 0.02846, est 0.00081, z 0.97235, next h 0.0285, y(0.2) = 0.83746).
  - 17h3 Example 3: I re-ran the Heun–Euler controller (first try h = 0.1, σ = 0.9, continuing from the Heun value). It gives exactly 31 accepted and 8 rejected steps, h from 0.028 to 0.234, maximum error 0.0338, and the plotted points match.
- **Phase line** (y′ = (y + 2)(y − 1)²(y − 3)): the signs, the dot styles and the label markers are correct. The **bifurcation types** figure has the right branches and stability. The **Heun step** figure is to scale: Euler lands at 2, k₂ is twice k₁, the Heun value 2.5 is below e. The **RK4 samples** sit at heights 1.5, 1.75 and 2.75, the true curve passes between the two midpoints, and the label markers are on the right parts. The **stability regions** are right: Euler disk at −1, RK4 to −2.785 with its small bulge across the imaginary axis, backward Euler outside the disk at +1, trapezoidal on the closed left half-plane.
- **Questions:** I worked all 61 before reading the keys. The keys are correct, every select-all has exactly the listed answers, and every order question has one order. The text `accept` lists are sufficient, since numbers compare by value.
- **Drills:** I generated 500 instances of each of the 6 drills from the built JSON. For each one I parsed the prompt and recomputed the answers independently (the RK4 limit by bisection on |R| ≤ 1, backward Euler by solving the implicit step, Richardson, Heun–Euler). Every correctly rounded answer was accepted and every shown answer was accepted. The only "wrong answer accepted" cases were artifacts of my perturbation (values near −1 or 0). There were no unfilled placeholders, "+ -" or thousands commas.
- **Facts:**
  - SciPy `solve_ivp` defaults are method RK45, rtol 1e-3 and atol 1e-6, with Radau and BDF for stiff problems (SciPy `solve_ivp` documentation).
  - Dormand–Prince is a 5(4) pair with 7 stages and FSAL (about 6 evaluations per step), used by MATLAB ode45 and SciPy RK45 (Dormand & Prince 1980; Hairer, Nørsett & Wanner, *Solving ODEs I*).
  - RKF45 pairs orders 4 and 5 (Fehlberg 1969).
  - "Stiff" comes from 1950s chemical kinetics (Curtiss & Hirschfelder 1952).
  - L. F. Richardson used extrapolation in the early twentieth century (1911; "deferred approach to the limit", 1927).
  - Definitions of A- and L-stability and the exponent 1/(p+1) for the error of the 4th-order Dormand–Prince solution follow Hairer & Wanner, *Solving ODEs II*.
  - Using "resilience" in two senses (return speed and capacity to absorb a disturbance) is standard in ecology (Holling 1973; Pimm). Critical slowing down is labeled as a research area that is not foolproof (Scheffer et al. 2009).
- **Cross-references:** Lesson 4 is logistic growth, Lesson 5 is Euler, Lesson 8 is linear first-order equations, Lesson 15 has the f = f_y = 0 recipe, and Module 8 is systems. All are correct.
- **Glossary:** none of the 24 terms or their aliases duplicate any `glossary*.yaml` in the course. The cards are correct.

## Overlap
None found. de-h1 (90–93: limit cycles, Hopf, logistic map, Lorenz) does not define critical slowing down or treat stiffness or harvesting. The "stiffness" in de-m8 and 27h3 is spring/beam stiffness, a different term.

## Left uncertain
- de-m4-r2-h24 (order, backward Euler with Newton): "Rewrite it as g(Y) = 0" and "Start Newton's method at Y₀ = yₙ" could arguably be swapped, since a starting guess can be picked before rewriting. I left it as is because "start Newton's method" reads as running it, which needs g. A future editor could merge those two items.
- 17h3 Example 3 does not state the first trial step (0.1). Its 31/8 counts depend on that choice, but the lesson gives them only as an illustration.
