# Round 2 review: pc-m1 (Functions in depth)

Reviewed: honors lessons 03h1-concavity and 03h2-piecewise-models, the round 2 additions to
01-functions, 02-piecewise and 03-behavior-rate, `questions/r2-pc-m1.yaml` (45 questions),
`drills/r2-pc-m1.yaml` (6), `glossary-r2-pc-m1.yaml` (12), `cards-r2-pc-m1.yaml` (20) and the 10
`images/pc-m1-*` SVGs. `content/math/check-module.sh precalculus pc-m1`: OK, zero problems after
the fixes.

## Changes

### Answer keys
None needed. I worked all 45 questions before reading the keys, and every key is right.

### Explanations (distractors that did not name a real mistake)
- **pc-m1-r2-h15**: the explanation said $2x + 3$ comes from "forgetting to change the sign of
  $x - 1$". That mistake actually gives $2x + 1$. Changed it to the mistake that does give
  $2x + 3$: writing $-(x - 1)$ as $x + 1$.
- **pc-m1-r2-h09**: the distractor 14 was not explained. Added that it comes from dividing 28 by 2
  instead of by $2h = 1$.
- **pc-m1-r2-h20**: the distractors 20% and 26% were not explained. Added that 20% is the middle
  bracket's rate (and the average of the three rates), and that 26% comes from taxing everything above
  \$20,000 at 30% ($2{,}000 + 0.30 \cdot 80{,}000 = 26{,}000$).
- **pc-m1-r2-h21**: the distractors \$600 and \$400 were not explained. Added that they come from taxing the
  whole \$2,000 raise at 30% or at 20%.

### Factual
- **glossary "effective rate"**: the definition said the effective rate "is lower than the top marginal rate
  that applies". That is false when all income falls in the first bracket, where the two rates are equal.
  It now says the effective rate is never higher than the marginal rate, and is lower once part of the
  income falls in a higher bracket.

### Drill
- **pc-m1-r2-abs-sum-min**: the solution printed "$(r - q)$" with a negative $q$ as e.g. `(-2 - -4)` in
  123 of 300 generated instances. Changed it to `({r} - ({q}))`.

### Pictures and plots
- **images/pc-m1-piecewise-graph.svg**: the "closed dot (1, 3)" box touched the parabola and
  covered the y-axis. The "y = x² for x < 1" box covered the y-axis and its "8" tick. I moved the
  first box above the dot, right of the axis. I made the second a two-line box between the curve
  and the axis.
- **images/pc-m1-behavior.svg**: the "local max (−1, 5.5)" box hid the y-axis "6" tick. Shifted
  the box left.
- **images/pc-m1-concavity.svg** and **-blank.svg**: the curve ran through the x-axis tick label
  "3". Moved the label to the left of the tick.
- **images/pc-m1-abs-sum.svg**: the "y = −2x − 1" and "y = 2x + 1" boxes sat on their lines. Moved
  them off the lines. In both the labeled and blank copies, the flat segment y = 3 ran through the
  y-axis tick label "3". Raised the label just above the segment.
- **03h2 tax plot**: the y tick labels (2000–22000) were cut off at the left edge, and the
  "(50,000, 8,000)" label sat on the 30% line. Rescaled the plot to thousands of dollars (axes
  "taxable income / tax (thousands of dollars)"). The two point labels are now placed clear of
  the lines, and the caption says the units.
- **03h1 secant plot**: the "concave up" curve label touched the top of the curve. Replaced it
  with a free label "y = x²/2, concave up" in open space.

The label-question markers were already right. I re-rendered every blank SVG with its markers,
and each marker sits on the part it names.

## Checked and found right (a reader might doubt)
- 03h1: $\sqrt{x}$ rates $1, \tfrac13, \tfrac15$; $\tfrac1x$ rates $-\tfrac12, -\tfrac16$; ball
  heights 1.5/16.2/21.1/16.2/1.5 and rate change $2a = -9.8$; $a(p+q)+b$ derivation; Example 3
  (12.61, 11.41, 12.01; forward error $3xh + h^2 = 0.61$, symmetric $3x^2 + h^2$); rates 4, −2,
  −2, 4 for $x^3 - 3x^2$; Example 4 depressed cubic $u^3 - 7u - 5$ and point $(2, -5)$; secant
  slope $s^2 + st + t^2 - 7$. All recomputed in sympy.
- "Graphing calculators … typically use this symmetric formula": TI-83/84 `nDeriv(` uses the
  symmetric difference quotient (TI-84 Plus guidebook). The claim is hedged, which is fine.
- g ≈ 9.8 m/s² (standard gravity 9.80665 m/s², NIST/CODATA).
- 03h2: piecewise forms of $|x-1|+|x+2|$ and $|2x-4|-|x+1|$, the rejected $x = 5$, the
  median/mean distances (11 vs 38/3 ≈ 12.67; D = 15 on [5, 9] with a store at 9), the tax values
  (12,200; 19.06% ≈ 19.1%; 7,800 → 8,300), the floor/ceiling identities, rounding as
  $\lfloor x + 0.5 \rfloor$ with halves rounded up, and Example 4's $[2, 2.5)$. US federal income
  tax is marginal by bracket (IRS), and the lesson labels its schedule as made up.
- Core additions: $x^3 - 1.5x^2 - 6x + 2$ has extrema at (−1, 5.5) and (2, −8). The numberline
  for $[-4,-3)\cup(-3,3)\cup(3,\infty)$, the floor staircase, the mapping diagram and the three
  Mermaid charts are correct. All five Mermaid diagrams render, and their accTitle/accDescr
  describe the whole chart.
- Cross-references exist: Lesson 4 defines odd functions, Lesson 19 covers least-squares
  regression, and Module 10 covers limits and the derivative.
- Drills: I generated 300 instances of each (1,800 in all) with the app's `generate()`. I
  recomputed each answer in Python from the prompt text alone (sympy for the rates and the
  inflection point; brute force for the distance minimum and the floor interval) and found 0
  mismatches. Each correct answer was accepted, including "$28,400"-style money input, and each
  wrong answer was rejected (0 errors). Every prompt and solution is free of "+ -", "1x",
  doubled minus signs and unfilled placeholders.
- Glossary and cards: definitions are correct, and there are no duplicate terms (the module
  check reports none).

## Overlap with other round 2 lessons
- pc-m2's honors lesson 07h1-symmetry also proves that every cubic is symmetric about the point at
  $x = -B/(3A)$ (with its own drill, pc-m2-r2-cubic-center). The results agree. 03h1 comes earlier
  and reaches the point through concavity, so the overlap is partial. However, 07h1 says "In
  calculus this point is called the inflection point; you will not need that word here", even
  though 03h1 (an earlier honors lesson) already teaches the term. The pc-m2 writer or reviewer may
  want to soften that line. I did not edit it.
- pc-m3's 14h1-cubic-formula also depresses a cubic with $x = t - b/(3a)$. That is a different
  purpose (solving), so there is no conflict.

## Left uncertain / not fixed
- 02-piecewise floor staircase (```plot): the renderer's tick labels "−1" (y-axis) and "1"
  (x-axis) sit partly under the open dots at (0, −1) and (1, 0). Every step endpoint is a lattice
  point, so any plot of $\lfloor x \rfloor$ has dots on the axes. The plot spec has no option to
  move the tick labels. The figure is still readable, so I left it.
