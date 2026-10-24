# Round 2 review: module trig-m5 (Inverse functions and basic equations)

Reviewer for item 128. Scope: honors lessons 20h1 and 20h2, the round 2 additions to lessons 18–20,
`questions/r2-trig-m5.yaml` (44 questions), `drills/r2-trig-m5.yaml` (3 drills),
`glossary-r2-trig-m5.yaml`, `cards-r2-trig-m5.yaml`, and the 11 `images/trig-m5-*` SVGs.
`content/math/check-module.sh trigonometry trig-m5` after the fixes: OK, zero problems
(5 lessons, 85 questions, 11 drills, 41 cards).

## Changes

**Plots (labels sitting on curves, lines or each other).** The app places a function label at the
right end of its curve and a point label above-right of the point; in four of the new plots these
collided. Moved them to `labels` entries placed in clear space, re-rendered with
`scripts/preview-plots.mjs` and checked each PNG.
- Lesson 18, "kept piece" plot: "kept piece" sat on the curve's peak and the y-axis tick 1, and "π/6" sat
  on the curve. Now at (−2.4, −1.35) and (1.0, 0.2).
- Lesson 20, Example 3 plot of tan x = 4/3: "4.0689 (233.13°)" overlapped the "y = 4/3" label and the
  curve, and "y = tan x" sat on the curve. All four labels moved to clear space.
- 20h1, plot of tan⁻¹x + tan⁻¹(1/x): "x < 0: −π/2" ran into the y-axis and its tick label. Both labels moved
  above their lines.
- 20h2, plot of cos x = x: "y = cos x" sat on the curve and the point label touched the y = x line. Curve
  labels moved; the value x ≈ 0.7391 moved into the caption.

**Picture.** `trig-m5-cos-equation.svg` (Lesson 20): the lower arc (the clockwise angle −β) had no label,
so it could be read as the angle 2π − β that the lower point is labeled with. Added a "−β" label to the
arc and said so in the alt text. The blank copy and the q15 markers are unchanged (still correct).

**20h2, "Choosing a method" flowchart (misleading).** Its last box sent every equation that was not
"one function = number", equal sines/cosines/tangents, or sine = cosine to "a trig function mixed with a
plain x: solve numerically". That would send a factorable equation such as $2\sin^2 x - \sin x - 1 = 0$
(Lesson 20, Example 6) to numerical methods. Added a decision "A trig function mixed with a plain x?"
with yes → graph and solve numerically, no → factor or use identities (Lesson 20, Module 6). Updated
accDescr and re-rendered.

**20h2, Example 2 (gap in the argument).** It used $\cos x = \sin(\tfrac{\pi}{2} - x)$ for every $x$, citing
Lesson 6, but Lesson 6 proves the cofunction identities only for acute angles in a right triangle (and
no later lesson extends them). Added one sentence: the identity holds for every angle, because reflecting
the unit circle across $y = x$ swaps the coordinates and takes angle $x$ to angle $\tfrac{\pi}{2} - x$.

**20h2, "One formula for each family".** $\beta$ in "$\pm\beta + 2n\pi$" was undefined; added "with $\beta = \cos^{-1}c$".

**20h2 and glossary, "transcendental equation" (overstated definition).** The lesson defined the term as
an equation that mixes trig functions with polynomials. Strictly any equation built from transcendental
functions is transcendental, $\sin x = \tfrac12$ included. Added a parenthetical saying so (the name matters most
for mixed equations like $\cos x = x$) and reworded the glossary definition to match.

**20h1, intro (overstated time span).** "almost three centuries of hand calculations of π" → "about two and a
half centuries". Arctangent-series records ran from Sharp (1699) and Machin (1706) to Ferguson's
desk-calculator work (1946–47) and ENIAC (1949): roughly 240–250 years. This matches the lesson's own
later "more than two centuries".

**Card.** "Solution of cos x = x" back now says "radians".

No answer-key errors were found. No question ids changed.

## Checked and found right (things a reader might doubt)

- **Every question (q01–q15, h01–h29)** worked independently before reading the key; all keys,
  `accept` lists, select-all sets, order and match pairings are right, and every distractor explanation
  names a real mistake. Points worth noting: q07 $\tan^{-1}(\tan\tfrac{5\pi}{6}) = -\tfrac{\pi}{6}$; q08 $\sin^{-1}(\sin 1.6) = \pi - 1.6 \approx 1.5416$,
  $\sin^{-1}(\sin(-2)) = 2 - \pi \approx -1.1416$; q10 $\cos^{-1}(\cos 5) = 2\pi - 5 \approx 1.2832$; q12 repeats the answer "2 solutions",
  which AUTHORING allows for match; h12 $\tan^{-1}3 + \tan^{-1}4 = 2.57487$; h15 $0.1 - 0.001/3 = 0.099667$ and the
  "÷6" distractor 0.099833; h18 $\cos 3x = \cos x$ has 4 distinct solutions; h26 $\sin x = x/2$ has
  3 ($0$, $\pm 1.895494$); h27 $0.7390851$; h28 $E_1 = 1.168294$, degree-mode distractor $1 + 0.2\sin 1^\circ = 1.00349$;
  h29 $\tan 2x = \tan x$ gives only $0, \pi$.
- **20h1 proof.** $C = (1, a) + b(-a, 1) = (1 - ab, a + b)$; in the frame $(1, a), (-a, 1)$ the point $C$ has
  coordinates $(1, b)$, so the signed angle from $OB$ to $OC$ is $\tan^{-1}b$ for any sign of $b$. The case table, the
  difference rule ($ab > -1$) and doubling rule ($|a| < 1$) are right.
- **20h1 numbers** (Python): grid proof ($A(6,2)$, $D(5,5)$, $AD \perp OA$, $OA = 2\sqrt{10}$, $AD = \sqrt{10}$); Machin check
  $120 \cdot 239 - 119 = 119 \cdot 239 + 120 = 28561 = 13^4$; 1,000 Leibniz terms give 3.1405927; three terms + one term
  give 3.1416209, four terms give 3.1415917; term ratios $< 1/25$ and $239^2 = 57121$.
- **20h1 history**: Machin 1706, 100 places; Gregory 1671; Leibniz 1673–74; Madhava about 1340–1425
  (credited in later Kerala texts); Shanks 1873, 707 places, wrong from the 528th, error found by Ferguson in
  1946; ENIAC 1949, 2,037 places with Machin's formula. Sources: Wikipedia, "Chronology of computation of π"
  and "Machin-like formula"; Beckmann, *A History of π*; Reitwiesner, "An ENIAC determination of π and e to
  more than 2000 decimal places", MTAC 4 (1950). The lesson already labels the history as simplified.
- **20h2 numbers**: Example 1 (six solutions, also from $2\cos 2x\sin x = 0$), Example 2 (four solutions, also from
  $\cos x(2\sin x - 1) = 0$), Example 3 ($u \in [-\tfrac{\pi}{3}, \tfrac{11\pi}{3})$, $x = \tfrac{\pi}{4}, \tfrac{7\pi}{12}, \tfrac{5\pi}{4}, \tfrac{19\pi}{12}$), the bisection
  table (0.3776, −0.0183, 0.1860, 0.0853, 0.0339), the uniqueness argument for $\cos x = x$, and the Kepler
  iterates 1.168294, 1.184017, 1.185226, 1.185317, 1.185324 (check gives 0.99998).
- **Kepler's equation**: derived by Kepler in *Astronomia nova* (1609), ch. 60, in the Mars work; $|g'(E)| = |e\cos E| \le 0.2$
  explains the convergence. Source: Wikipedia "Kepler's equation"; Colwell, *Solving Kepler's Equation over
  Three Centuries* (1993).
- **Drills**: generated 800 instances of each with the app's own `generate`/`checkAll`; every displayed
  answer (fractions typed as p/q) was accepted. Recomputed each independently in Python from the prompt text:
  arctan-sum (exact $\tfrac{a + b}{1 - ab}$, $\tan^{-1}a + \tan^{-1}b$ to within $5 \times 10^{-5}$, and the quadrant sentence matches the
  sign of $1 - ab$; all three cases occur); shifted-eq (all roots listed from both families and confirmed by a
  sign-change scan; count, smallest root, and the exact $\tfrac{p}{q}\pi$ in the solution all match; typed answers like
  `17pi/12` are accepted); Kepler (fixed-point to convergence, $E_1$ and $E$ match). Tolerances (0.0002, 0.001)
  are at least half the last place shown. No "+ -", "1x" or unfilled placeholders.
- **Pictures**: all 11 SVGs rendered; geometry matches (P(−5, 12) triangle in 5:12; arctan construction drawn
  with $a = 0.5$, $b = 0.6$, $C = (0.7, 1.1)$; grid points; $\cos^{-1}0.3$ for the cosine picture). Every label-question
  marker (q04, q09, q15, h10, h25) sits on the part its label names. No overlap or clipping.
- **Mermaid** (4): content right, accTitle/accDescr describe the whole diagram, readable.
- **Glossary**: 8 terms, no term or alias duplicates any `glossary*.yaml` in the course.
- **Overlap**: none with the other round 2 trig lessons. Module 9's notes mention Kepler's first law in
  39h1 (orbits as conics), which is a different topic from Kepler's equation. No other honors lesson covers
  arctangent sums, equal-value rules or numerical root-finding.

## Left uncertain

- Nothing that affects correctness. The q04 label question tells inverse sine from inverse tangent only by
  open versus filled endpoint dots, as the writer noted; the stem explains the dots, so I left it.
