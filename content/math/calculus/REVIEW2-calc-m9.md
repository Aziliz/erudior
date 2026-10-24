# Calculus, module calc-m9 (Differential equations): round 2 review

Reviewer for item 37 (independent of the writer). Scope: honors lessons 39h1 and 39h2, the additions to core lessons 37–39, `questions/r2-calc-m9.yaml` (43), `drills/r2-calc-m9.yaml` (5), `glossary-r2-calc-m9.yaml` (13), `cards-r2-calc-m9.yaml` (19), `images/calc-m9-*` (4 SVGs + 4 blanks).

## Changes

| Where | Problem | Change |
|---|---|---|
| 39h2, Euler vs improved Euler plot | The "improved Euler 10.946" point label is drawn up and to the right of its point, so it sat beside the green exact-value dot (11.778) instead of the red 10.946 dot. The exact dot's label was in the far top-left corner. A student could pair the wrong label with the wrong dot. | Took the labels off the improved-Euler and exact dots. Added free labels "exact 11.778" (beside the top dot) and "improved Euler 10.946" (just below the red dot). Rendered the plot with the app's figure renderer and CSS and checked it by eye. |
| 39h1, harvest plot | The "183.8" point label ran across the rising H = 90 curve. | Took the label off that point. Added a free label "183.8" at (110, 8), left of the point and clear of all four curves. Rendered and checked. |
| cards-r2-calc-m9, "Stiff equation" card | Gave $y_{n+1} = \frac{y_n}{1+kh}$ as if it were the general backward Euler formula. It only holds for $y' = -ky$. | Now says "on $y' = -ky$ it gives $y_{n+1} = \frac{y_n}{1+kh}$, stable for every $h$". |
| cards-r2-calc-m9, "What uniqueness implies" card | "solutions are monotonic and never reach an equilibrium" is false for the constant (equilibrium) solutions themselves. | Changed "solutions" to "nonconstant solutions". |

No answer-key errors found.

## Checked and found right (things a reader might doubt)

- **Questions:** I worked all 43 questions before looking at the keys and all agree. Points worth noting:
  - h02: $g'(0)=10$, $g'(2)=-6$, $g'(5)=15$.
  - h16: RK4 gives 1.6484375; improved Euler gives 1.625.
  - h26: improved Euler is exact for $y'=2x$ (trapezoid rule on a linear integrand).
  - h22: the threshold is $h<0.1$, and the explanation correctly separates sign-flipping decay ($0.05<h<0.1$) from same-sign decay.
  - h06 choice 4: inflection points of a solution occur only where $g'(y)=0$, since $y''=g'(y)g(y)$ and $g\ne0$ along a nonconstant solution.
  - h11: $y'=\sqrt y$, $y(0)=0$ really has two solutions, $0$ and $x^2/4$ for $x\ge0$.
  - Every select-all, order and match item has exactly one defensible answer. Text `accept` lists are complete (`-2`/`−2`, `0.2`/`1/5`, number words for the orders).
- **39h1 numbers (Python):**
  - $500\pm100\sqrt{10}=183.77,\ 816.23$.
  - MSY $kM/4=150$.
  - Blow-up of $y'=x^2+y^2$, $y(0)=1$: scipy finds 0.96981, matching "near 0.970". The rigorous bound $x\le1$ comes from comparison with $1/(1-x)$.
  - For Example 1, the $y(0)=4$ solution really does blow up in finite time, at $t=\tfrac12\ln3\approx0.549$.
  - At $H=kM/4$ the only equilibrium is semi-stable: $g=-0.0006(P-500)^2$.
  - Below the threshold, $g(0)=-H<0$, so $P$ reaches 0 in finite time. Correct.
  - $y'=|y|$ has unique solutions despite the non-differentiable right side: it is Lipschitz.
- **39h2 numbers (Python):**
  - Euler errors 0.124539, 0.064984, 0.033218, and error/h tending to $e/2$.
  - Richardson estimate 2.712853 (off by 0.0054); about 13,600 steps to get the error below $10^{-4}$, which the lesson rounds to "about 14,000".
  - Improved Euler table, ending at 10.94580, with error 0.832 (Euler's error is 4.653).
  - One RK4 step gives 2.708333.
  - Equal-work errors 0.03322, 0.001091, 2.08e-6: ratios about 15,900 ("about 16,000") and about 523 ("about 500").
  - The instability example values $(-1.5)^n$ are right.
- **Theory:**
  - Theorem statement (continuity of $F$ and $F_y$ on an open rectangle gives a unique local solution) and Peano's existence-only theorem: standard, as in Boyce & DiPrima, ch. 2.
  - Dates: Picard 1890, Lindelöf 1894, Runge 1895, Kutta 1901, so "1890s" and "around 1900" are fair.
  - The improved-Euler/trapezoid and RK4/Simpson correspondences when $F=f(x)$ ($k_2=k_3$): standard, as in Burden & Faires ch. 5.
  - The Euler stability region $|1-kh|<1$ and backward Euler's multiplier $1/(1+kh)$ are correct.
  - The global-error argument and "stiff" are labeled as heuristic or simplified. Lesson references (15 linearization, 34 numerical integration with the h² and h⁴ error rates, 38 with $2xy^2$ blow-up and the 0.6/1000 lake, 44 Taylor) all point to the right lessons.
- **Core additions:**
  - The constant-solution sentence in 38 is correct.
  - "Three exact methods and one approximate" in 39 is correct (antidifferentiation, separation, integrating factor; Euler).
  - "$y'+ky=b$ is both separable and linear" is correct.
- **Pictures:** I rendered all four SVGs and the four blanks with their question markers.
  - The geometry is right: the Euler tangent segment falls below a concave-up curve; the logistic curve starts near 0.1M and inflects at M/2; the tank's outflow is at Q/V; the phase-line dots, arrows and solution curves match $(y-1)(y-3)$.
  - Text is readable with nothing cut off, and every marker sits on the part its label names.
- **Mermaid:** I rendered all 5 diagrams. Each is correct and readable, and the accTitle/accDescr describe the whole diagram.
- **Drills:** 400 instances of each drill (2,000 total), recomputed independently in Python from the prompt text as shown, by parsing the coefficients:
  - Phase line: the equilibria were classified numerically, and the limit was found by simulation.
  - Harvest: quadratic formula.
  - Heun and RK4: my own loops.
  - Euler stability: power of the multiplier.
  - Results: 0 mismatches. The correctly rounded 4-decimal answer was accepted every time, a wrong answer (off by about 1%) was rejected every time, and there were no unfilled placeholders or "+ -".
- **Glossary:** no duplicate term or alias in any `glossary*.yaml`, and the definitions are correct.
- **Check:** `content/math/check-module.sh calculus calc-m9` reports OK, zero problems, after my fixes.

## Overlap

- 39h2's short "Estimating the error without the answer" (Richardson for an order-1 method) overlaps calc-m2's 08h1 and calc-m8's 36h3. It is brief, cross-references them and doesn't redefine the term, so I left it.
- calc-m8's notes say 36h3 leaves Euler's method to 39h2, so the two lessons are consistent.

## Uncertain / left as is

- The glossary alias "Picard's theorem" for the existence and uniqueness theorem is used in ODE texts, but the same name also refers to Picard's theorems in complex analysis. I left it.
- The phase-line plot's "P (fish)" axis label crowds the "1000" tick label. That comes from the renderer's layout, not this module's content.
