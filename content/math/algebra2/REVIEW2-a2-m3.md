# Round 2 review: module a2-m3 (Polynomial functions)

Reviewer for assignment 11. Scope: honors lessons 12h1-locating-zeros and 12h2-roots-coefficients,
the round 2 additions to lessons 10, 11 and 12, `questions/r2-a2-m3.yaml` (43 questions),
`drills/r2-a2-m3.yaml` (6 drills), `glossary-r2-a2-m3.yaml` (12 terms), `cards-r2-a2-m3.yaml`
(20 cards) and the 5 `images/a2-m3-*` SVGs.

`content/math/check-module.sh algebra2 a2-m3` after my fixes: build and checker OK, zero problems.

## Changes

1. **12h1-locating-zeros, Example 4 plot (bisection).** The point label "zero ≈ 1.3247" (placed
   up and right of the point by the renderer) sat on the curve, which passes through about
   (1.4, 0.34). The "step 2" segment also started exactly on the curve at (1, −1), because f(1) = −1.
   Change: the label is now a free `labels` entry at (1.12, 0.45), left of the curve. The step
   segments moved to y = −0.5, −1.1 and −1.7, and the y-range became [−2.3, 5.5] so the three
   segments and their labels have room. I rendered it again to check.
2. **12h2-roots-coefficients, Example 2 plot (Vieta).** The point labels "−1" and "3" were drawn
   up and right of the zeros, and the steep curve passed through or touched them. Change: those two
   are now free `labels` at (−1.3, 0.9) and (2.75, 0.9), above the axis on the side away from the
   curve. "1/2" was already clear and stays as it was. I rendered it again to check.

No answer-key, factual or SVG changes were needed.

## Checked and found right (things a reader might doubt)

- **All 43 questions worked by hand before reading the key**, with roots and values checked in
  sympy/numpy. Examples: h05 $x^5 - 3x^2 + 4 = (x + 1)(\ldots)$ has only the real zero −1. h06 has
  real zeros −3 and 0.5698, so the (1, 1, 2) case is the actual one. h08's real zeros are −3.253,
  −0.520 and 1.773, so "exactly one negative zero" is rightly marked wrong. h27's substitution
  gives $x^3 + 4x^2 - 12x + 8$. For q06 and Example 3 of lesson 11, synthetic division gives
  2, 1, 6 | 7. Every select-all has exactly the keyed set right. The order questions (q07, q12,
  h11) have no two steps that could swap. Match and label answers are unambiguous: q04 calls
  marker 2 "local maximum" because the touch at −4 is also a local minimum.
- **Lesson 12h1 numbers:** 60 distinct candidates ±p/q for constant 60 and leading coefficient 12.
  For Example 1: f(±1) = 0, the other negative zero is −1.2296, and there is one conjugate pair.
  Example 2 has one positive zero (1.2952) and two conjugate pairs. For
  $x^4 - 2x^3 - 7x^2 + 8x + 12 = (x - 3)(x - 2)(x + 1)(x + 2)$ the rows are 1, 1, −4, −4, 0 at 3 and
  1, 2, 1, 12, 60 at 4. Example 3: the rows at c = 2, 3, −2, the values f(−2..3) = 2, −9, −6, −7,
  −6, 27, and the zeros −1.929 and 2.365 plus a conjugate pair. Example 4: all 7 bisection rows
  match exact arithmetic. The true zero is 1.3247 and 1/128 ≈ 0.0078. log2 10 ≈ 3.32 gives "about
  3⅓ steps per decimal place".
- **The math in 12h1:** the parity argument for "less by an even number" (counting with
  multiplicity) is correct. The upper-bound proof is correct. The lower-bound rule that "a 0 may be
  either sign" is correct as long as one consistent alternating pattern is used: each term of
  $q(x)$ then has sign $(-1)^{n-1}$ or is 0 for $x < c < 0$, so $f(x) \ne 0$. The lesson already
  labels the simplified parts ("at most" is not proved; the lower-bound proof is only sketched).
- **Lesson 12h2 numbers:** $2x^3 - 5x^2 - 4x + 3 = (x - 3)(x + 1)(2x - 1)$. The roots of
  $x^3 - 4x^2 + x + 5$ are −0.912, 1.714 and 3.199. $x^3 - 2x^2 + 3x - 4$ has one real root (1.651)
  and a pair, which matches the negative sum of squares. Example 4 has roots 1, 2, 3. Example 5:
  $8\,p(x/2) = x^3 - 8x^2 + 4x + 40$. The Euclid table and the 3-4-5 `shape` (legs labeled
  correctly) are right.
- **Cross-references:** lesson 06 (a2-m2) teaches $r + s = -b/a$, $rs = c/a$. Lesson 12 states the
  FTA and the n-linear-factors result. Lesson 10 has the IVT example $x^3 - x - 1$ on [1, 2] and
  "at most n zeros".
- **Core additions:** the degree-6 picture for $(x + 4)^2(x + 2)(x - 1)^3$ is right. The critical
  points are −4 (min, the touch), −2.920 (max, 64.6), −0.913 (min, −72.5) and 1 (a stationary
  inflection, not a turning point), and the y-intercept is −32. In the SVG the x-ticks are evenly
  spaced, and the peak, trough and intercept heights are roughly to scale. The end-behavior grid
  and the synthetic-division picture are right. The 5 Mermaid diagrams render, are readable and
  correct, and their accTitle/accDescr describe the whole diagram.
- **Label markers:** I rendered both blanks with the question markers. Every marker sits on the
  part its label names (q04: touch, peak, crossing, y-intercept, flattened crossing; q06: box c,
  top row, middle row, quotient strip, remainder box).
- **Drills:** I generated 400 instances of each of the 6 drills with the app's `generate()`.
  I recomputed every answer from the prompt text as shown, using my own code: sign counts on f
  and f(−x), the smallest passing c by synthetic division plus a numpy check that no real root
  exceeds it, exact-fraction bisection, Vieta values with numpy root sums and products, symmetric
  sums from numpy roots, and the missing root from the factored cubic. All 2,400 agreed.
  - Three upper-bound cases with the largest root exactly equal to c (remainder 0) are still
    right, because the row has no negative entries and no zero is greater than c.
  - Correct answers are accepted by `checkAll`, including 2-decimal decimals for the Vieta
    fractions. A wrong sign is rejected.
  - No "+ −", "1x", stray braces or unfilled placeholders appear.
- **Glossary and cards:** definitions are correct, and none of the 12 terms or aliases duplicates
  an entry in any course glossary file. Every bolded term in both honors lessons has an entry.
  The 20 cards are correct.
- **History:**
  - Descartes stated the rule in *La Géométrie* (1637) without proof, and later mathematicians
    proved it.
  - Viète found cases of the root–coefficient relations, and Girard stated the general pattern in
    *Invention nouvelle en l'algèbre* (1629) (MacTutor biography of Albert Girard,
    https://mathshistory.st-andrews.ac.uk/Biographies/Girard_Albert/; DSB entry,
    https://mathshistory.st-andrews.ac.uk/DSB/Girard_Albert.pdf).
  - Euclid's formula appears in *Elements* X, lemma 1 to Prop. 29.
  - Britannica on *La Géométrie*: https://www.britannica.com/topic/La-Geometrie.

## Left as is / notes

- Lesson 10: the new degree-6 picture (also with 3 turning points) now sits between Example 2
  and the round 1 sentence "The quartic above has 3 turning points". The sentence is still
  correct, because it says "quartic" and means Example 2. I left it alone because it is round 1
  text.
- The drill `a2-m3-r2-symmetric` accepts $1/r + 1/s + 1/t$ within 0.005. A 2-decimal rounding of
  an eighth (for example 0.13 for 1/8) sits exactly on the edge and may be rejected. The prompt
  asks for fractions and doesn't ask for rounding, so I didn't change it.
- Overlap: 14h1-irrational-roots (a2-m4) also uses the rational root theorem to show roots are
  irrational, and it approximates roots with Heron's method. 12h1 uses bisection and only
  mentions Newton's method. The two lessons complement each other and don't repeat each other.
  19h2-partial-fractions (a2-m5) uses comparing coefficients but doesn't define it again. No
  changes needed.

## Counts

Answer-key errors: 0. Factual fixes: 0. Picture fixes: 2 (plot labels on curves in 12h1 and
12h2). Other fixes: 0.
