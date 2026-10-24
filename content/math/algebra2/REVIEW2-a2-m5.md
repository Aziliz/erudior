# Round 2 review: module a2-m5 (Rational expressions and functions)

Reviewer for item 13. Scope: honors lessons 19h1 and 19h2, the round 2 additions to core lessons
15–19, `questions/r2-a2-m5.yaml` (53 questions), `drills/r2-a2-m5.yaml` (5 drills),
`glossary-r2-a2-m5.yaml` (8 terms), `cards-r2-a2-m5.yaml` (21 cards) and the 3 `images/a2-m5-*`
SVGs. `content/math/check-module.sh algebra2 a2-m5` reports zero problems after the fixes
(7 lessons, 108 questions, 18 drills, 43 cards).

## Changes

**Answer keys:** none needed. All 53 keys are right, and each question has exactly one
defensible answer.

**Factual fixes**
- 19 (rational inequalities), the paragraph under Example 3's new plot: it said the graph of
  $\frac{x+1}{x-3}$ "touches the $x$-axis at $x = -1$". It crosses there, because the sign changes,
  and "touches" usually means tangent without crossing. The sentence also said "above it
  everywhere else". It now reads "crosses … stays below it from there to the vertical asymptote
  $x = 3$, and is above it for $x < -1$ and for $x > 3$."
- 19 Mermaid sign-chart flowchart: the branches "numerator zero, with ≤ or ≥ → include" and
  "denominator zero → leave out" overlapped when a value is a zero of both. The lesson's step 5
  already says to leave that value out. The edge now reads "denominator zero (even if also a
  numerator zero)", and the accDescr has the same wording.
- 19h1, "Which side of the asymptote?": the lesson said there are finitely many crossings
  "because $r$ has smaller degree than $Q$". That is the wrong reason. The real reason is that a
  nonzero polynomial has finitely many zeros. I reworded it and added the $r = 0$ case (then $f$ is
  the polynomial $q$, apart from holes).

**Picture/plot fixes** (rendered with the app's own `renderFigure`; curve labels are drawn at
the right end of each curve, and segment labels at the segment's midpoint)
- 19h1 Example 1 plot: the two curve labels collided at the top right on top of both curves.
  They are now free `labels` in empty space ("f(x) = …" upper left; "y = x + 1 (dashed)" lower
  left).
- 19h1 Example 3 plot: the point label "crosses at (−5, 2)" ran across the rising branch and the
  asymptote $x = -2$. The "y = 2" segment label sat on the vertical asymptote. Both labels moved
  to clear space.
- 19h1 average-cost plot: the "minimum (150, 18)" label lay on the curve, and the two curve
  labels overlapped the curves at the right edge. All three are now placed labels clear of the
  curves.
- 17 Example 2 plot (left vs right side): both curve labels sat on the curves at the right edge.
  They are now "right side (dashed)" and "left side (solid)" in clear space on the left.
- 19 Example 3 plot: the curve label sat on the curve. Moved to the empty upper-left area.

**Other fixes** (distractor explanations that didn't name the mistake)
- q09: added that $-3x$ is the reciprocal of the answer.
- h01: added where $y = x + 3$ and $y = x + 1$ come from.
- h23: added that $\tfrac{20}{11}$ doubles the gap-of-one answer.
- h24: added that $-\tfrac13$ is $B$ with a sign slip.

## Checked and found right

- **Questions:** I worked every question before reading the key and confirmed the numeric ones
  with sympy. That covers every `apart` decomposition (h15, h16, h24, h25, h26 and lesson
  Examples 1–4 of 19h2), every division (h01, h03, h05, h06, h10 and 19h1 Example 2), the sums
  175/132 and 49/50, the inequality sets (q22, q25) and q09/q11.
- **Match and label questions:** every pairing is unambiguous and no distractor fits a left item.
  The order questions have one valid order each.
- **h11's claim that "a hole and a vertical asymptote can't occur at the same $x$":** this is true
  under the course's definition. After cancelling, a factor either is gone (hole) or remains
  (asymptote).
- **19h1 examples:** $f(3) = 2.5$ and $f(-1) = 1.5$ relative to the line. $g(x) - 2 = \frac{x+5}{x^2-4}$,
  with the crossing at $(-5, 2)$ and the stated signs. The AM–GM proof and the equality case are
  correct. $A(100) = A(225) = 19$ and the minimum is \$18 at 150 items. The average-cost model is
  labeled a simplification.
- **19h2 facts:**
  - Substituting excluded values is justified by polynomial identity.
  - The cover-up method finds the coefficient of a simple factor and of the highest power of a
    repeated factor, and nothing else.
  - The number of unknowns equals the degree of the denominator.
  - Uniqueness is stated and labeled "proved in more advanced courses".
  - The gap-2 telescoping formula is right.
- **Heaviside attribution:** "often named after the English engineer Oliver Heaviside" is accurate.
  The method is widely called the Heaviside cover-up method, and Heaviside was an English
  electrical engineer, physicist and mathematician. Sources:
  [Wikipedia, Heaviside cover-up method](https://en.wikipedia.org/wiki/Heaviside_cover-up_method);
  [J. Orloff, MIT 18.04 notes](https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/a7ec9d19a389c73c6b4747ac54df6b16_MIT18_04S18_pf-coverup.pdf);
  [Gustafson, Utah](https://www.math.utah.edu/~gustafso/s2010/HeavisideCoverup2008.pdf).
- **Core lesson additions:**
  - 17: the left and right sides of Example 2 do differ by exactly 1.
  - 18: hole $(-4, 4)$, VA $x = -1$, HA $y = 2$, and intercepts $(2, 0)$ and $(0, -4)$ all check.
- **SVGs:**
  - `a2-m5-rational-features.svg`: I measured the coordinates against the grid. The hole, the
    intercepts and both asymptotes are at the right places, and the branch values at the edges
    match $f$.
  - `a2-m5-rational-features-blank.svg` with q16's markers: each of the 5 markers sits on its
    feature.
  - `a2-m5-lcd-columns.svg`: correct and readable.
- **Mermaid diagrams:** all 7 render. Their content is correct, and their accDescr describe the
  whole chart.
- **Drills:** each was generated 600 times, and the answers were recomputed from the prompt text
  alone. 0 problems:
  - `slant`: synthetic division recomputed, and $R \ne 0$ in every run.
  - `cross-ha`: crossing point solved, denominator nonzero.
  - `avg-cost`: brute-force integer minimum over 1–5000; the answer is accepted typed with or
    without "$".
  - `partial`: cover-up recomputed.
  - `telescope`: exact BigInt fraction.

  In every case the correct answers were accepted and answers off by 1 were rejected. No "+ -",
  "1x" or unfilled placeholders appeared.
- **Glossary and cards:** definitions are correct, and no term or alias duplicates any
  `glossary*.yaml` in the course.

## Overlap and notes

- a2-m7's honors lesson `24h1-finite-differences.md` also bolds **telescoping sum** and teaches the
  same $\sum \frac{1}{k(k+1)} = \frac{n}{n+1}$ example, with a cross-reference to 19h2. The a2-m7
  writer deliberately added no glossary entry, so the only entry is in this module's file. Keep it
  that way.
- Round 1 lesson 18 says oblique asymptotes are something "you'll find … in precalculus". 19h1 now
  covers them as an honors lesson. That doesn't contradict anything, but a later editor may want
  to add "(or in the honors lesson at the end of this module)". I left it alone because it is
  round 1 text.
- **Uncertain:** nothing. The plot label positions were checked with the app's renderer, using
  approximate CSS (13 px text). If the app's figure font is much larger, recheck the 19h1
  average-cost labels, which are the longest.
