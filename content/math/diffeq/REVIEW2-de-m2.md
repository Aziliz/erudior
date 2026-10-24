# Round 2 review: de-m2 (Classification and first-order methods)

Reviewer's scope: honors lessons 10h1–10h3, the round 2 additions to core lessons 06–10,
`questions/r2-de-m2.yaml` (64), `drills/r2-de-m2.yaml` (6), `glossary-r2-de-m2.yaml` (13),
`cards-r2-de-m2.yaml` (28), `images/de-m2-*` (3 pictures + 3 blanks).

## Changes

### Answer-key / explanation errors (2)
- **de-m2-r2-q25** (explanation): said the distractor "$1 + x^3/3$" comes from treating $y$ as 0,
  but the choice is $1 - x + x^3/3$ (which is what $y = 0$ on the right side actually gives:
  $y' = x^2 - 1$). Explanation now names the listed choice.
- **de-m2-r2-h02** (distractor): choice $2 + t + \frac{t^2}{2}$ matched no real mistake; the
  explanation said "using $\varphi_0 = 0$ inside $f$ loses the $2t$", which gives
  $2 + \frac{t^2}{2}$. Changed the choice to $2 + \frac{t^2}{2}$ and said so in the explanation.
  Key (index 0) unchanged.

### Ambiguous select-all choices (2)
- **de-m2-r2-h34**: wrong choice "A Clairaut equation is linear in $y$" was arguably true ($y$
  itself does appear linearly; only $f(y')$ is nonlinear, and $f(p) = kp$ makes the equation
  linear). Now "Every Clairaut equation is a linear differential equation." (clearly false);
  explanation cites $f(p) = -p^2$.
- **de-m2-r2-h23**: "for $y' = ky$, $k > 0$, the estimate is exact" holds only forward in time
  (backward, $e^{L|t - t_0|}$ overstates the actual $e^{k(t - t_0)}$). Added "for $t \ge t_0$".

### Factual tightening (2)
- **10h2 "Sensitive dependence"**: "systems of three or more equations can [be chaotic]" left the
  impression two never can. Now: autonomous systems of three or more, or two equations with a
  periodic forcing term (driven pendulum). (Poincaré–Bendixson rules out autonomous planar chaos;
  forced Duffing/pendulum are standard chaotic examples: Strogatz, *Nonlinear Dynamics and
  Chaos*, ch. 7 and 12.)
- **glossary "sensitive dependence on initial conditions"**: same correction.

### Picture fix (1)
- **10h3 Clairaut plot**: the auto-placed point label "(3, 2)" sat on the dashed line
  $y = x - 1$ (the writer flagged it). Moved it to an explicit label at (3.9, 1.6), clear of all
  lines; re-rendered and checked.

### Other fixes (2)
- **Lesson 10 Mermaid "Choosing a substitution"**: the last decision had no "no" branch (dead
  end). Added "no → Try another method" and updated `accDescr` to match. Re-rendered.
- **10h3 intro**: "two older, famous nonlinear equations" — Riccati (1720s) and Clairaut (1730s)
  are younger than Bernoulli's equation (1695). Now "two other famous".

## Checked and right (things a reader might doubt)
- Picard error bound $\frac{MK^nh^{n+1}}{(n+1)!}e^{Kh}$ and gap sum $\frac MK(e^{Kh} - 1)$:
  correct tail estimates. Example 4: bound 0.00859, actual 0.00289 (Python).
- $b/(1 + b)^2$ max $\frac14$ at $b = 1$; $y' = y^2$ interval claims.
- 10h2 Example 1: $y(3) = 2.95983$, $z(3) = 2.96195$, gap 0.00213 vs bound 0.2009; plot labels
  off the curves (actual gap peaks ≈ 0.0118 at t ≈ 0.6). Example 3: $0.1e^{-2} = 0.01353$.
  Example 4: $\varepsilon = 0.6^5/120 = 0.000648$, bound 0.00111, numerical difference
  $8.85\times10^{-5}$ at $t = 1$ (scipy, rtol 1e-12); $y(1) = 0.5325 < 0.54$.
- One-sided bound argument and the $\varepsilon/L\,(e^{L(t - t_0)} - 1)$ perturbation estimate.
- Riccati: $v' = -(q_1 + 2q_2y_1)v - q_2$; Examples 1–2 ($K = 4$, blow-up at $\sqrt[3]{4}$);
  the second-order form $u'' - (q_1 + q_2'/q_2)u' + q_0q_2u = 0$ verified symbolically for
  general $q_0, q_1, q_2$ (sympy). Clairaut singular solutions, tangency points, normal form
  $\partial_y = \mp 1/\sqrt{x^2 - 4y}$, counting table.
- h39: solutions of $y' = t^2 + y^2$ do involve Bessel functions and do blow up in finite time
  ($y' \ge y^2$).
- History: Picard 1890 memoir on successive approximations, Liouville's earlier use (1830s,
  linear equations), Lindelöf 1894, Peano 1886/1890, Grönwall 1919 (Annals of Math.), Bellman
  1943 (Duke Math. J.), Hadamard's well-posedness (1902), Jacopo Riccati 1724 (Acta Eruditorum),
  Clairaut 1734, Liouville 1841 on Riccati, Lorenz 1963. Consistent with standard histories
  (MacTutor biographies; Hairer–Nørsett–Wanner, *Solving ODEs I*, §I.7–I.10).
- All 64 questions worked independently before reading keys; all other keys, `accept` lists and
  distractor explanations correct. q22 item 3 is also Bernoulli ($n = 2$), but $v = y^{-1}$ is not
  offered, so the match is unambiguous.
- Core plots: c₂ sin t BVP family, 07 numberline, 08 $y = t - 1 + Ce^{-t}$ curves (C = 4, 2, −1),
  09 level curves (parametrizations and C values), 10 Bernoulli plot ($1/(1 + e^t)$,
  $1/(1 - e^t/2)$, blow-up at ln 2). All rendered and read.
- SVGs (linear-parts, existence-rect, picard-cone and blanks): rendered; content, text and
  markers on the named parts all correct. The picard-cone bow-tie wedges are the correct
  regions $|y - y_0| \le M|t - t_0|$.
- All 7 Mermaid diagrams rendered; content and accDescr match.
- Drills: 1,800 instances generated from the built JSON (300 per drill), 377 distinct ones
  recomputed in Python from the prompt text (Picard iterates by sympy integration, $h$ exact,
  Grönwall bounds and δ to 3 s.f., Riccati solution checked against the ODE and the initial
  condition, Clairaut roots), then fed to `checkAll`: every correct answer accepted, every
  perturbed answer rejected. No unfilled placeholders, "+ -" or "1t".
- Glossary: no duplicate terms/aliases against any `glossary*.yaml` in the course.
- Overlap: none. No other diffeq lesson or NOTES2 covers Picard, Grönwall/Lipschitz, Riccati or
  Clairaut; the chaos paragraph is a short pointer, and the full treatment is in de-h1
  `93-lorenz-chaos.md`.

## Left as is / uncertain
- 10h1 uses $a$ for the rectangle half-width ($|t - t_0| \le a$), while Lesson 7 and its SVG
  use $a < t < b$, $c < y < d$. Each lesson is self-consistent; I didn't change it.
- de-m2-r2-q01 labels marker 3 (on "(sin t)") "Coefficient of y"; strictly, the coefficient is
  −sin t. The explanation says so, so I kept it.
- de-m2-r2-h21: the rounded answer 0.0068 is slightly above the true maximum 0.006767. That's
  normal for "to 4 decimal places", so it isn't changed.
- `de-m2-r2-gronwall-bound` shows `sig3` answers without trailing zeros (e.g. 4.5); 3-s.f.
  entries are still accepted.

`content/math/check-module.sh diffeq de-m2`: OK (zero problems).
