# Round 2 review: pc-m2 (Parent functions, transformations and inverses)

Reviewer pass over the round 2 work in NOTES2-pc-m2.md: honors lessons 07h1-symmetry and
07h2-composition-algebra, the additions to core lessons 04-07, `questions/r2-pc-m2.yaml` (49),
`drills/r2-pc-m2.yaml` (4), `glossary-r2-pc-m2.yaml` (10), `cards-r2-pc-m2.yaml` (20) and the 10
`images/pc-m2-*` SVGs. `content/math/check-module.sh precalculus pc-m2` reports zero problems
after the fixes.

## Changes

### Answer key / explanations
- **pc-m2-r2-h18**: distractor `7` matched no mistake that anyone makes. Replaced it with `6`
  (what you get by forgetting to apply $f^{-1}$: $2 + 4$). Explanation now names that mistake.
  The answer is still index 3 ($3$).
- **pc-m2-r2-h04**: the explanation did not say where distractor `13` comes from. Added: "adding
  $f(-1)$ to $2b$ instead of subtracting it".
- **pc-m2-r2-h30**: the explanation did not cover the distractors. Added: 7 is $x_2$, 6.25 is $x_4$,
  and 5.5 puts $x_3$ on the wrong side of 6.

No key was wrong. I worked every question before reading its key.

### Factual / wording
- **07h2, cobweb alt text**: said the path is "spiraling in a staircase". Spiral and staircase are
  the two different cobweb patterns (oscillating vs monotone convergence), and this one is a
  staircase. It now says "climbing in a staircase".
- **07h1, Example 4**: said students "will meet" cosh and sinh "in calculus". This course already
  teaches them in 19h1-hyperbolic (pc-m4 honors). It now points to that lesson as well.

### Pictures and plots
- **pc-m2-inverse-mirror-blank.svg** (q15): the $2^x - 1$ curve ran above the top of the grid and
  $\log_2(x+1)$ ran below the bottom. Both are now clipped to the grid at y = 6 and y = −2.
- **pc-m2-cubic-center.svg and -blank.svg** (07h1, h12): the curve ran past the grid top and
  bottom and went through the y-axis tick label "−1", so it read as "1". The curve is now clipped
  to the grid (y from −1 to 7), the "−1" label moved left, clear of the curve, and the other y
  tick labels moved 5 px left so the "1" doesn't touch the (0, 1) dot.
- **pc-m2-cobweb.svg and -blank.svg** (07h2, h28): the dashed line y = x ran past the grid top
  and bottom. It is now clipped to the grid.
- **07h1, both ```plot blocks**: the two automatic curve labels ("y = f(x)", "y = |f(x)|" and
  "y = f(|x|)") were drawn on top of each other in the top-right corner and couldn't be read. In
  the second plot, "(−1, −4)" also sat on the cusp at (0, −3). Fixes: removed the curve labels;
  put free `labels` in empty space; moved the vertex labels below the vertices; added "(dashed)"
  and "(solid)" to both captions.
- **07-inverses, horizontal-line-test plot**: the "(2, 4)" point label sat on the parabola. It is
  now a free label at (2.75, 3.2), below and to the right of the point.

I re-rendered every change and looked at it, with the label markers on the blank SVGs.

## Checked and found right (a reader might doubt these)
- **07h1 Example 1**: $f(3+t) = 2t^2 - 11$. **Example 2**: $f(2+t) = t^3 - 3t + 3$; the
  turning points (1, 5) and (3, 1) come from $f'(x) = 3(x-1)(x-3)$; $f(4) = 5$.
- **07h1 Example 4**: $E = 2/(x^2-4)$ and $O = x/(x^2-4)$ for $1/(x-2)$, checked with sympy. The
  remark that the split needs $x \ne \pm 2$ is right.
- **07h1 parity table**: correct, including "even ∘ odd is even" and "f ∘ even is even for any f".
- **07h1 uniqueness proof** and the "nonzero even + nonzero odd is neither" argument: both sound.
- **07h2 inverse formulas**: $(f\circ g)^{-1} = g^{-1}\circ f^{-1}$ is correct. The inverse of
  $a f(b(x-h)) + k$ is $h + \frac1b f^{-1}(\frac{x-k}{a})$ (verified symbolically). Lesson 6's
  $9x^2 - 12x + 5$ and $3x^2 + 1$ are quoted correctly.
- **07h2 linear fractional functions**: the inverse is $(dx - b)/(-cx + a)$. The function is an
  involution when $d = -a$. The matrix correspondence (composition ↔ matrix product, up to a
  scalar) is a true standard result, stated without proof and labeled as a preview. The
  degenerate example $(2x+4)/(x+2)$ has $ad - bc = 0$.
- **07h2 Example 5 iterates** (Python): 1, 2.6458, 2.9404, 2.9900, 2.9983. $-2$ is extraneous.
- **07h2 linear iteration**: $x_n - p = m^n(x_0 - p)$. $2x - 3$ from 4 gives 5, 7, 11, 19.
- **07h2, $-x^3$ meeting its inverse at (±1, ∓1)**: correct. The proof for increasing $f$ is
  valid.
- **SVG geometry** checked against the functions: gallery panels, transform panels, the
  2^x − 1 / log₂(x + 1) mirror with the (2, 3)–(3, 2) segment, the cubic and the cobweb steps.
  All markers sit on the parts their labels name.
- **Mermaid (5)**: content correct; accTitle and accDescr describe the whole diagram; readable.
- **Drills**: checked over the full parameter grid in Python.
  - cubic-center: shifted $f$ minus the height is odd in $t$ for every instance.
  - lft-inverse: $f(f^{-1}(x)) = x$.
  - fixed-point: three iterations equal $p + m^3 e$ exactly; largest value 114.
  - even-odd-parts: $O(-p) = (v - u)/2$.
  - All answers are exact numbers (some are .5 / .125 decimals), so default comparison works.
- **Glossary and cards**: definitions correct. "Möbius transformation" as an alias of linear
  fractional function is fine (the real case).

## Overlap with other round 2 lessons (not changed)
- **pc-m3 14h3-linear-fractional** covers the same function family. Its writer says it only
  recaps 07h2's inverse formula and points back to it, so the two complement each other.
- **pc-m9 40h1-recurrences** repeats the linear-map fixed point $c/(1-m)$ and
  $x_n - p = m^n(x_0 - p)$ (as $a_{n+1} = ra_n + c$). The results are consistent, and 40h1 uses
  the pc-m2 glossary term "fixed point".
- **pc-m1 03h1-concavity, Example 4**: also shows a cubic's point symmetry, through concavity.
  It is consistent with 07h1, which names the inflection point only in passing.
- **pc-m4 19h1-hyperbolic**: opens with the even/odd split of $e^x$, the same idea as 07h1
  Example 4 (which uses $2^x$). 07h1 now cross-references it.

## Uncertain
- Nothing on accuracy.
- In the label questions the app's markers cover a tick label: the "1" on the y-axis in h12 and
  "−5" on the x-axis in h28. This is cosmetic; the gridlines still give the values.
