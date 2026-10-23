# Round 2 notes: module calc-m8 (Techniques of integration)

`content/math/check-module.sh calculus calc-m8`: build and checker report zero problems
(9 lessons, 139 questions, 17 drills, 63 cards).

## Added

**Honors lessons** (`honors: true`, `module: calc-m8`; about 1,450 words each including inline math,
45 min)
- `lessons/36h1-reduction-formulas.md` (calc-m8-h-reduction, "Reduction formulas and the Wallis
  product"). Covers deriving reduction formulas: $\int x^ne^x$, $\int\sin^n x$ (where the integral
  comes back) and $\int\tan^n x$ (an identity, no parts). Then the Wallis integrals $W_n$ with their
  closed forms, a proof of the Wallis product by squeezing $W_{2k+1} \le W_{2k} \le W_{2k-1}$, and how
  slowly it converges. Ends with a warning about forward recurrences: $J_n = e - nJ_{n-1}$ multiplies
  the error by about $n!$, and in double precision $J_{20} \approx -129$; running it backward is
  stable.
  - Examples: $\int x^3e^x$, $W_5 = 8/15$ and $W_6 = 5\pi/32$, $\int_0^{\pi/4}\tan^4x = \pi/4 - 2/3$,
    and the partial products $P_1$, $P_2$, $P_{10}$, $P_{100}$.
  - Figures: 1 Mermaid diagram (how to derive a reduction formula), 1 plot ($\sin^n x$ for
    n = 1, 2, 4, 8).
- `lessons/36h2-gamma-function.md` (calc-m8-h-gamma, "The gamma function"). Covers
  $\int_0^\infty x^ne^{-x}\,dx = n!$; the definition and a convergence proof by comparison at both
  ends; the functional equation by parts and $\Gamma(n+1) = n!$; $\Gamma(1/2) = \sqrt\pi$ from the
  Gaussian integral (its value is quoted, and the lesson says the proof needs double integrals); two
  substitution patterns; history; and, stated without proof and labeled as such, the extension to
  negative non-integers and Stirling's approximation.
  - Examples: $\int_0^\infty xe^{-x}$ and $\int_0^\infty x^2e^{-x}$, $\int_0^\infty x^3e^{-2x} = 3/8$,
    $\int_0^\infty\sqrt x e^{-x} = \sqrt\pi/2$, $\int_0^\infty x^4e^{-x^2} = 3\sqrt\pi/8$,
    $\int_0^1(-\ln x)^3 = 6$, and all moments $E(X^n) = n!/\lambda^n$ of the exponential
    distribution (standard deviation = mean). That example points back to 30h2, which found the mean
    by parts.
  - Figures: 1 plot of $\Gamma(x)$ with $(n, (n-1)!)$ and $(1/2, \sqrt\pi)$ marked.
- `lessons/36h3-richardson-romberg.md` (calc-m8-h-romberg, "Richardson extrapolation and Romberg
  integration"). Covers the Euler–Maclaurin error series for the trapezoidal rule (stated without
  proof and labeled asymptotic), checked numerically; the Richardson step; the proof that
  $(4T_{2n} - T_n)/3 = S_{2n}$; the Romberg table; and when it fails (rough integrands like
  $\sqrt x$, step sizes too large) or isn't needed (smooth periodic integrands).
  - Examples: the trapezoid error table for $\int_1^2 dx/x$ vs $h^2/16$, one Richardson step, and a
    4-row Romberg table for $\int_0^1e^x$ (corner error below $10^{-9}$).
  - Derivative extrapolation is covered by 08h1 and Euler's method by 39h2, so this lesson only
    points to them and doesn't repeat them.
  - Figures: 1 Mermaid diagram of the Romberg table.

**Core lessons 31–36** (additions only, each figure introduced by a sentence or two):
- 31: an SVG of integration by parts as areas in the $uv$-plane (`calc-m8-parts-area.svg`), with a
  paragraph deriving $\int u\,dv = u_2v_2 - u_1v_1 - \int v\,du$; a Mermaid chart for planning parts
  (LIATE, then simpler / comes back / harder).
- 32: a Mermaid chart for $\sin^m x\cos^n x$ (odd sine, odd cosine, both even); an SVG of the three
  trig-substitution reference triangles (`calc-m8-trig-sub-triangles.svg`) with a paragraph on
  labeling them.
- 33: a Mermaid chart of the whole partial fractions procedure; a plot of the area in Example 5 with
  the asymptote $x = 1$.
- 34: a Mermaid strategy chart; a plot showing why the trapezoid overestimates and the midpoint
  underestimates for a concave-up function ($\frac12x^2 + 1$ on $[0, 2]$: $T_1 = 4$, $M_1 = 3$, true
  $10/3$), using the tangent-line view of the midpoint rectangle.
- 35: a Mermaid chart for setting up an improper integral; a plot of the Type 2 region under
  $1/\sqrt x$.
- 36: a Mermaid chart matching $\sqrt{a^2 - x^2}$, $\sqrt{x^2 + a^2}$, $\sqrt{x^2 - a^2}$ to their
  substitutions and inverse functions.

**Pictures** (original SVGs, all under 4 KB, rendered and checked): `calc-m8-parts-area.svg` and
`-blank.svg`, `calc-m8-trig-sub-triangles.svg` and `-blank.svg`. The blank triangle picture keeps
the labels that aren't asked. Markers were computed from the drawing coordinates and checked in a
preview.

**Diagrams**: 8 Mermaid diagrams (lessons 31–36, 36h1, 36h3). All are `flowchart TD`, each with
accTitle and accDescr, at most 9 boxes, and all rendered.

**Questions** (`questions/r2-calc-m8.yaml`, 72 new)
- Core, calc-m8-r2-q01…q30, 5 per lesson. Each lesson has a text question, a match or order
  question, and a select-all question; lessons 31 and 32 also have a label question.
  - text (6): q01, q06, q11, q16, q21, q26
  - match (6): q05, q07, q12, q17, q22, q27
  - order (5): q02, q14, q19, q24, q29
  - select-all (6): q03, q08, q13, q18, q23, q28
  - label (2): q04, q09
  - MC (5): q10, q15, q20, q25, q30
  - module_quiz, 2 per lesson: q01, q03, q06, q08, q11, q15, q16, q18, q21, q25, q26, q28
- Honors, 14 per lesson: h01–h14 (36h1), h15–h28 (36h2), h29–h42 (36h3). No module_quiz.
  - text (9): h02, h03, h14, h16, h17, h22, h30, h34, h39
  - order (4): h06, h19, h31, h42
  - match (3): h07, h20, h32
  - select-all (6): h08, h12, h21, h26, h33, h40
  - MC (20): the rest
- MC answer positions (25 questions): 0: 6, 1: 6, 2: 6, 3: 7.

**Drills** (`drills/r2-calc-m8.yaml`, 5)
- 36h1: calc-m8-r2-wallis ($\int_0^{\pi/2}\sin^n$ or $\cos^n$, n = 3–10; exact answer such as
  3pi/16, checked as an expression; the solution shows the product chain).
- 36h2: calc-m8-r2-gamma-moment ($\int_0^\infty x^ne^{-ax}$, exact fraction) and
  calc-m8-r2-gamma-half ($\Gamma(m/2) = c\sqrt\pi$, fraction $c$).
- 36h3: calc-m8-r2-richardson (one step from $T_2$ and $T_4$ for $\int dx/x$, 4 dp, tolerance
  0.0001) and calc-m8-r2-romberg ($R_{1,1}$, $R_{2,1}$, $R_{2,2}$ for $\int_0^1e^{cx}$, 4 dp).
- The decimal answers are computed from the rounded $T$ values shown in the prompt, and their
  display format is num4, so the answer shown to the learner can be typed back and is accepted.

**Glossary** (`glossary-r2-calc-m8.yaml`, 9 terms): reduction formula, Wallis integral, Wallis
product, gamma function, functional equation, Gaussian integral, Stirling's approximation, Romberg
integration, Euler–Maclaurin formula.
- Each was checked against every `glossary*.yaml` in the course: no duplicate term or alias.
- **Richardson extrapolation** is bolded in 36h3 but already defined in `glossary-r2-calc-m2.yaml`,
  so I did not add it.

**Cards** (`cards-r2-calc-m8.yaml`, 24): 8 Reduction formulas, 8 Gamma function, 8 Richardson
extrapolation.

## Verification

- Every number in the three honors lessons and every question key and distractor was checked with
  sympy or Python (scripts in my /tmp folder, since deleted). This covers:
  - the Wallis values $W_0$–$W_{10}$ and the partial products;
  - the forward and backward recurrence for $J_n$;
  - the gamma values, the minimum of $\Gamma$ and the Stirling ratios;
  - the trapezoid errors against $h^2/12\,[f'(b) - f'(a)] - h^4/720\,[f'''(b) - f'''(a)]$;
  - the Romberg tables for $1/x$, $e^x$ and $\sqrt x$, and the periodic $e^{\sin x}$ case.
- Each drill was generated 400 times with `generate()` on the built module JSON and checked against
  an independent computation:
  - the independently computed answer was accepted;
  - a wrong answer was rejected;
  - the shown answer, typed back, was accepted;
  - the text was scanned for NaN, unfilled placeholders, `+ -` and thousands commas inside TeX.

  0 problems. Two bugs were found this way and fixed: a value named `n` was filling the TeX
  `\dfrac{n - 1}{n}`, and `{den}` printed `15,625` inside a fraction.
- Lesson plots were rendered with the app's `renderFigure` and the app CSS, and checked by eye. The
  36h1 curve labels collided at $(\pi/2, 1)$, so the caption gives the order instead.
- Order questions were checked for a single valid order (h31 uses grouped steps so that $T_4$
  can't be placed between the $R$ steps).

## For the reviewer

- History: Wallis, *Arithmetica Infinitorum* (1656; some sources give 1655 for the writing).
  Euler's letters to Goldbach of 1729 (infinite product) and 1730 (integral). Legendre's $\Gamma$
  notation is given as "early 1800s". Richardson's 1911 paper, and the phrase "the deferred approach
  to the limit" (1927). Romberg in 1955.
- 36h1 quotes $J_{15} \approx 0.16050$ and $J_{20} \approx -129$ from IEEE double-precision forward
  recurrence. These are exact for standard doubles but would differ in other arithmetic; the
  wording says "in standard double-precision arithmetic".
- The Euler–Maclaurin series and Stirling's approximation are stated without proof and labeled.
  The Gaussian integral's value is quoted (as in Lesson 35), with the proof deferred.
- 36h2 Example 5 builds on 30h2 (the exponential distribution and the variance shortcut). If 30h2
  changes its notation, check that example.

## Errors found in existing content

None. All six core lessons' examples were re-read, and the cross-references to lesson numbers
(16, 22, 29, 35, 36, 38, 40, 41) match the files. No existing question, drill, card or glossary
entry was edited.

## Sources

Standard results only: integration by parts and reduction formulas, the Wallis integrals and
product, the gamma function (Euler; Legendre's notation), the Gaussian integral, Stirling's formula,
the Euler–Maclaurin formula, Richardson extrapolation and Romberg's method. These match standard
treatments, for example OpenStax Calculus Vol. 2 §3.1 and §3.6 and the Romberg and Richardson
material common to numerical analysis texts. All explanations, examples, figures and questions are
original.
