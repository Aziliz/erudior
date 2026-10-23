# Round 2 notes: de-m9 (Series solutions, Fourier series and PDEs)

`content/math/check-module.sh diffeq de-m9`: build and checker report zero problems (7 lessons,
105 questions, 14 drills).

## Honors lessons (3)
The module is broad (series, Fourier, PDEs), and VERIFY.md listed Frobenius and Laplace's
equation as coverage gaps, so there are three. None overlaps the de-h1 honors module
(nonlinear dynamics).
- `41h1-frobenius.md`, `de-m9-h-frobenius`: **The method of Frobenius and Bessel's equation**
  (45 min). Regular vs irregular singular points, Frobenius series, indicial equation, the three
  root cases (with a Mermaid chart), $2xy'' + y' + y = 0$ (closed forms $\cos\sqrt{2x}$,
  $\sin\sqrt{2x}/\sqrt2$), Bessel order 0 and $J_0$ (plot with zeros), Bessel order 1/2 as the
  "integer difference but no log" example, and why drums aren't harmonic (labeled as simplified).
- `41h2-laplace-equation.md`, `de-m9-h-laplace`: **Laplace's equation: steady states in two
  dimensions** (45 min). Dirichlet problem on a rectangle (sin and sinh), single-mode example with
  an isotherm plot, the square with one edge at 100° (series ≈ 25.00 plus the symmetry and
  superposition argument for exactly 25), the disk via Cauchy–Euler, mean value property,
  maximum principle, uniqueness.
- `41h3-dalembert.md`, `de-m9-h-dalembert`: **d'Alembert's solution: waves that travel** (45
  min). Traveling waves, the characteristic-coordinate derivation $u_{\xi\eta} = 0$, d'Alembert's
  formula, a plucked pulse splitting in two (plot), domain of dependence and range of influence
  (SVG), the hammer-blow example, fixed ends via the odd periodic extension (reflection upside
  down, period $2L/a$), and agreement with the Fourier modes.

## Core lessons (additions only)
- L38 series: Mermaid flowchart of the series method (including the ordinary/singular check);
  SVG `de-m9-radius.svg` of the convergence disk for $(1 + x^2)y'' + y = 0$.
- L39 Fourier: two plots (odd and even extensions of $x$ from $(0, \pi)$: sawtooth vs triangle
  wave); Mermaid chart "which Fourier series".
- L40 heat/wave: Mermaid flowchart of separation of variables; SVG `de-m9-string-modes.svg`
  (modes 1–3, node, antinode, fixed end).
- L41 heat boundary: SVG `de-m9-rod-ends.svg` (Dirichlet block, insulated cap, insulated
  sides); new short section "Choosing the method" with a Mermaid chart (end conditions to
  eigenfunctions).

## Questions: `questions/r2-de-m9.yaml` (60)
- Core, 21 (`de-m9-r2-q01`–`q21`): L38 6, L39 5, L40 5, L41 5. Module quiz: q01, q04, q07, q08,
  q12, q16, q17, q20.
- Honors, 39 (`de-m9-r2-h01`–`h39`, 13 per lesson).
- By type: multiple choice 21, text 14, select-all 7, order 7, match 7, label 4 (radius, string
  modes, rod ends, characteristics; each uses a `-blank.svg` with markers checked in a preview).
  Single-answer MC keys are spread 4/6/5/6 over positions 0–3.

## Drills: `drills/r2-de-m9.yaml` (6)
`de-m9-r2-indicial`, `de-m9-r2-frob-coef` (Frobenius); `de-m9-r2-plate-mode`, `de-m9-r2-disk`
(Laplace); `de-m9-r2-pulse`, `de-m9-r2-velocity-kick` (d'Alembert). Each was generated 400 times
and its answers recomputed independently from the prompt text (quadratic formula, the Frobenius
recurrence, sinh/sin formula, disk formula, triangle evaluation, numerical integration of $g$);
the shown answer and the recomputed answer are accepted and a perturbed answer is rejected for
every instance. Pulse and velocity answers are exact multiples of 1/16 and 1/8, shown with
`num4`.

## Glossary and cards
- `glossary-r2-de-m9.yaml`, 13 terms: irregular singular point, Frobenius series, Bessel's
  equation, Bessel function, Laplace's equation, harmonic function, Dirichlet problem, mean
  value property, maximum principle, characteristics, d'Alembert's formula, domain of
  dependence, range of influence. Checked against every `glossary*.yaml` in the course; no
  duplicates or alias clashes ("harmonic" is an alias of "harmonics", so the new term is
  "harmonic function"; "characteristics" is distinct from "characteristic equation").
- `cards-r2-de-m9.yaml`, 28 cards: 10 Frobenius method, 9 Laplace's equation, 9 d'Alembert's
  solution.

## Pictures
New SVGs (all under 18 KB, previewed): `de-m9-radius(-blank)`, `de-m9-string-modes(-blank)`,
`de-m9-rod-ends(-blank)`, `de-m9-characteristics(-blank)`, `de-m9-laplace-plate` (lesson only).
All plots were rendered with `renderFigure` and inspected. Labels that overlapped were removed,
and the captions now say which curve is which.

## For a reviewer
- The existing glossary entry **indicial equation** is defined only for Cauchy–Euler equations.
  The Frobenius lesson uses the phrase without bolding it and explains that it is the same
  equation as for the approximating Cauchy–Euler equation. The definition could be widened
  (I didn't edit it: it isn't wrong).
- History, all stated cautiously: Fuchs 1866 and Frobenius 1873 (singular point theory and
  series method); Laplace in the 1780s (gravitation), with Euler and Lagrange earlier in fluid
  flow; d'Alembert 1747 and Bernoulli's sine-mode proposal "a few years later" (1753).
- The drum paragraph is labeled a simplified model (radially symmetric modes only; air loading
  and $J_m$ modes mentioned as what real drums add).
- "Infinite speed" for the heat equation is described as a property of the model.
- The L39 extension plots draw each piece in a different palette color (solid = original
  piece, dashed = extension, as the caption says).
- `de-m9-r2-indicial` has about 31 distinct instances (integer and half-integer roots with
  nonzero coefficients). That is enough for practice, but the variety is modest.

## Errors found in existing content
None. I re-checked the L38–L41 examples I built on (Airy, square wave, |x|, heat Examples 1–3)
while writing, and they are correct.

## Verification
Every numeric value in the lessons and questions was recomputed in Python (sympy or mpmath):
the Frobenius series for $2xy'' + y' + y = 0$ against $\cos\sqrt{2x}$ and $\sin\sqrt{2x}/\sqrt2$;
$J_0$ coefficients, $J_0(1)$, $J_0(2)$ and its zeros, with the zero ratios 2.295 and 3.598; the
square-plate center value 25.000 from the series; $\sinh(\pi/4)/\sinh(\pi/2) = 0.37747$;
$10/\cosh(\pi/2) = 3.985$; the disk example; and d'Alembert's values. The finite-string example
was checked against a 400-term Fourier solution: $u(x, 2) = 0$, $u(x, 4) = -f(x)$,
$u(x, 8) = f(x)$.

## Sources
Standard results; no text was copied. Checked against general knowledge of the standard
sophomore ODE/PDE curriculum: Frobenius's theorem and its cases, Bessel functions, separation
of variables for Laplace's equation on rectangles and disks, the mean value property and
maximum principle, and d'Alembert's formula. Numerical values were computed (mpmath
`besselj`, `besseljzero`).
