# Calculus, module calc-m9 (Differential equations), round 2: writer notes

## Honors lessons (2)

- `lessons/39h1-phase-lines-stability.md`: **Phase lines, stability and uniqueness** (id `calc-m9-h-phase-lines`, 45 min, about 2,040 words of prose).
  - Phase lines for $y' = g(y)$; stable, unstable and semi-stable equilibria (the "some books count semi-stable as unstable" convention is noted).
  - Why phase lines are reliable: solutions are monotonic and have limits at equilibria (uses uniqueness).
  - Derivative test $g'(y^*)$, derived by linearizing; $|g'(y^*)|$ as the exponential rate. Concavity $y'' = g'(y)g(y)$, which recovers the logistic inflection at $M/2$.
  - Harvesting $kP(1 - P/M) - H$ on Lesson 38's lake: threshold and stable equilibria, collapse below the threshold, bifurcation at $H = kM/4$, maximum sustainable yield. Labeled a simplified model; MSY described as a ceiling, not a target.
  - Existence and uniqueness theorem (Picard–Lindelöf; Peano for existence only), non-uniqueness of $y' = 3y^{2/3}$, finite-interval blow-up of $y' = x^2 + y^2$ (bounded by comparison with $1/(1 - x)$; numeric blow-up near 0.970), and what uniqueness buys.
  - 4 worked examples; 1 SVG (phase line + solution curves), 1 Mermaid classification chart, 1 plot (harvest curves), 1 table.
- `lessons/39h2-numerical-methods.md`: **Better numerical methods and their errors** (id `calc-m9-h-numerical-methods`, 45 min, about 1,880 words of prose).
  - Local vs global error and order of accuracy for Euler's method (heuristic, labeled as such), with an error table for $y' = y$.
  - Error estimates from two step sizes and Richardson extrapolation (refers back to the other writers' honors lessons 08h1 and 36h3, which also use this term).
  - Improved Euler (Heun), with why it is order 2 (it is the trapezoidal rule when $y' = f(x)$), and a full table for Lesson 37's $y' = x + y$ (10.946 vs Euler's 7.125 vs exact 11.778).
  - Classical RK4 (it is Simpson's rule when $y' = f(x)$), one step on $y' = y$, and the link to the Taylor series of $e^h$ (Lesson 44).
  - Equal-work comparison (40 slope evaluations): Euler 0.0332, Heun 0.00109, RK4 0.0000021.
  - Stability of Euler on $y' = -ky$ ($h < 2/k$), stiff equations, and backward Euler, labeled beyond the course.
  - 4 worked examples; 1 Mermaid (Heun step), 1 plot (Euler vs Heun vs exact), 3 tables.

## Core lesson additions (additions only; no existing text changed)

| Lesson | Added |
|---|---|
| 37-slope-fields-euler | Sentence + labeled SVG `calc-m9-euler-step.svg` (one Euler step: run, rise, estimate, true value, error); Mermaid "Euler's method as a loop" |
| 38-separable | Sentence on constant solutions lost when dividing by $h(y)$ + Mermaid "Solving a separable equation" chart; labeled SVG `calc-m9-logistic-parts.svg` before "Facts AP exams test" |
| 39-linear-de | Labeled SVG `calc-m9-mixing-tank.svg` in Mixing problems; new short section "Choosing a method" with a Mermaid decision chart (x only / separable / linear / numerical), before Common mistakes |

## Questions: `questions/r2-calc-m9.yaml` (43)

- Core (15): calc-m9-r2-q01–q15, 5 per lesson.
  - By type: 3 label (q01 Euler step, q06 logistic, q11 tank), 3 text, 3 match, 2 order, 4 select-all.
  - `module_quiz: true` on q01, q04 (37), q06, q09 (38), q11, q14 (39).
- Honors (28): h01–h14 (39h1) and h15–h28 (39h2).
  - 17 multiple choice, answer positions 0→4, 1→4, 2→4, 3→5.
  - 11 other types: 4 text, 2 select-all, 2 order, 2 match, 1 label (h01, phase line).
  - No `module_quiz` on honors questions.

## Drills: `drills/r2-calc-m9.yaml` (5)

- 39h1: calc-m9-r2-phase-line (cubic $g$: unstable equilibrium, $g'$ at the top root, limit of a solution), calc-m9-r2-harvest (two equilibria and MSY; inputs chosen so all answers are whole numbers).
- 39h2: calc-m9-r2-heun (two improved-Euler steps, 4 decimals), calc-m9-r2-rk4-step ($k_2$ and one RK4 step, 4 decimals), calc-m9-r2-euler-stability (multiplier, $y_n$ to 4 decimals, stability limit $2/k$).
- Verification: each drill was generated 300 times with `generate()` on the built module JSON (1,500 instances). Every answer was recomputed independently (loops for Euler/Heun/RK4, quadratic formula, numerical simulation of the phase-line limit): 0 mismatches. The rounded answer and the displayed answer were accepted every time, and a wrong answer was rejected. 4-decimal answers use tolerance 0.0001 (≥ half the last place).
- The Heun drill excludes $y_0 = -1$ with $a = \pm1$, where $y = -ax - 1$ is an exact straight-line solution and every slope is constant (a trivial instance).

## Pictures

Original SVGs, drawn by a script; each was rendered with preview-figure.mjs and checked by eye, and markers were checked on the blank versions. All are under 20 KB.

- `calc-m9-euler-step.svg` + `-blank` (lesson 37; q01)
- `calc-m9-logistic-parts.svg` + `-blank` (lesson 38; q06)
- `calc-m9-mixing-tank.svg` + `-blank` (lesson 39; q11)
- `calc-m9-phase-line.svg` + `-blank` (39h1; h01). Its solution curves are the exact solutions of $y' = (y-1)(y-3)$.

Mermaid diagrams: 5 (lessons 37, 38, 39, 39h1, 39h2), all rendered and checked. The two honors plots were rendered through `src/lib/figure.ts` and adjusted so labels don't overlap.

## Glossary and cards

- `glossary-r2-calc-m9.yaml` (+13): phase line, stable, unstable, semi-stable, bifurcation, maximum sustainable yield, existence and uniqueness theorem, local truncation error, global error, improved Euler method (alias Heun's method), Runge–Kutta method (alias RK4), numerical instability, stiff.
  - Checked against every glossary*.yaml: no duplicate terms or aliases.
  - "order of accuracy", "Richardson extrapolation" (glossary-r2-calc-m2) and "trapezoidal rule" (glossary.yaml) already exist, so 39h2 bolds them without redefining.
- `cards-r2-calc-m9.yaml` (+19): 11 for 39h1 (topics Phase lines and stability, Existence and uniqueness) and 8 for 39h2 (topic Numerical methods for differential equations).

## Check

`content/math/check-module.sh calculus calc-m9`: OK, zero problems (5 lessons, 80 questions, 13 drills). The only warning is another writer's file (cards-r2-calc-m4.yaml has a YAML error).

## For a reviewer

- 39h1 "semi-stable": the terminology varies (some texts say "semistable", some count it as unstable); this is stated in the lesson.
- 39h1 Example 4: the blow-up point of $y' = x^2 + y^2$, $y(0) = 1$ is quoted as "near $x \approx 0.970$" (numerical, scipy, 0.96981). The lesson's rigorous claim is only "at some $x \le 1$".
- 39h2: the global-error argument ($N$ steps × $Ch^2$) is labeled a heuristic. The "error ÷ h → e/2" remark for $y' = y$ is true (Euler gives $(1+h)^{1/h} = e(1 - h/2 + \dots)$).
- 39h2 equal-work table: "about 16,000 times" (0.03322 / 2.084e-6) and "about 500 times" (0.001091 / 2.084e-6).
- Lesson 38 addition: the sentence on constant solutions lost when dividing by $h(y)$ is new content, not a correction. The existing lesson didn't mention it, though Example 2 ($y' = 2xy^2$) does lose $y = 0$; it doesn't matter there because of the initial condition.
- calc-d-euler (existing drill, not mine) can roll $a = -1$, $y_0 = -1$, where the exact solution is the line $y = x - 1$ and every slope is 1. That instance is harmless but trivial; not changed.

## Errors found in existing content

None. The worked examples of lessons 37–39 were rechecked in Python (Euler table 7.125; $2e^2 - 3 = 11.78$; 10.91 h; 42.9 °C; 690.6 fish; 3.66 years; 45.1 kg; 23.3 kg; 4.75 A). No existing question, drill, card or glossary entry was edited.

## Sources

- Existence and uniqueness: Picard (1890) and Lindelöf (1894); Peano's existence theorem (1886/1890). Standard statements as in Boyce & DiPrima, *Elementary Differential Equations*, ch. 2, and Paul's Online Notes (Lamar), "Existence and Uniqueness" and "Equilibrium Solutions".
- Harvesting and maximum sustainable yield in the logistic model: standard textbook model (e.g. Strogatz, *Nonlinear Dynamics and Chaos*, saddle-node bifurcation exercises); the caution about MSY reflects common fisheries-science practice.
- Euler, improved Euler (Heun 1900) and RK4 (Runge 1895, Kutta 1901): Burden & Faires, *Numerical Analysis*, ch. 5; OpenStax and Lamar notes on Euler's method. Stability of Euler on $y' = -ky$ ($|1 - kh| < 1$) and backward Euler: same.
- All numbers recomputed in Python (math, scipy for the blow-up time).
