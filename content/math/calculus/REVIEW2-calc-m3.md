# Round 2 review, calc-m3 (Differentiation rules)

Reviewer pass over the three honors lessons (13h1, 13h2, 13h3), the additions to core lessons 09 to 13,
`questions/r2-calc-m3.yaml` (67 questions), `drills/r2-calc-m3.yaml` (6 drills),
`glossary-r2-calc-m3.yaml` (8 terms), `cards-r2-calc-m3.yaml` (26 cards) and the 8 `images/calc-m3-*` SVGs.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| 13h2, inverse function theorem statement | Said "on an open interval" without saying the interval contains $a$ (the proof needs $f^{-1}$ defined near $b = f(a)$) | Now "on an open interval containing $a$" |
| calc-m3-r2-h20, choice 0 | Same wording as the theorem | Matched it: "...on an open interval containing $a$" (still a correct choice) |
| 13h3, "Singular points", cusp bullet | Called $x = y^{2/3}$ "the kind of cusp Lesson 7 listed". Lesson 7 lists "Corner (or cusp): the left and right slopes differ" with $\lvert x\rvert$ as its example, so a reader could take this cusp to have finite one-sided slopes | Now says its one-sided slopes at 0 are $-\infty$ and $+\infty$, "a cusp, one of the ways Lesson 7 listed for a derivative to fail to exist" |
| calc-m3-r2-h01, explanation | The $-100$ distractor was explained as "multiplies by $-2$ fifty times as if adding" (garbled), and the $(-2)^{49}$ distractor was not explained | Rewritten: $-2^{50}$ reads $(-2)^{50}$ as $-(2^{50})$; $-100$ adds $-2$ fifty times; $(-2)^{49}$ is off by one |
| drill calc-m3-r2-nth-reciprocal | (1) `c` could be 0, which prints $\frac{1}{x + 0}$. (2) The answer uses `lowestTerms: true`, but the prompt only said "exact fraction". Results like $\frac{2}{8}$ (n = 2, d = 2) would be marked wrong unless reduced, and the prompt didn't say so | Added `where: ["c != 0"]`. Prompt now says "as an exact fraction in lowest terms (or a whole number)" |
| images/calc-m3-sine-points-blank.svg (q06) | Label markers 3 and 4 sit on the dots at $(\pi, 0)$ and $(2\pi, 0)$ and covered the "π" and "2π" tick labels | Moved those two tick labels down 12 px. Re-rendered with markers, and both are now readable |

Counts: answer-key errors 0, factual fixes 1 (cusp description), picture fixes 1, other fixes 4 (theorem hypothesis wording + h20 to match, h01 explanation, drill prompt/where).

## Checked and found right

- **All 67 questions:** I worked each one before reading its key. Every key is correct and every select-all, order and match item has exactly one defensible answer. Quotes in YAML such as `f''(0)` render as $f'(0)$. These are worth a second look by a reader, but they are correct:
  - h06 ordering: −64, 0, 2, 81, 120.
  - h10: $y^{(10)}(0) = 90$ for $x^2\cos x$, checked against the Taylor coefficient $10!/8!$.
  - h13: $f^{(4)}(0) = -24$.
  - h33: horizontal tangents of $x^2 - xy + y^2 = 3$ at $(\pm1, \pm2)$.
  - h35: only the origin is singular for $y^2 = x^2(x + 1)$, because $(-\frac23, 0)$ is not on the curve.
  - h40: the circles give a slope product of $-2$.
- **Lesson numbers, recomputed with sympy:**
  - $(x^2e^{3x})^{(10)} = 3^9e^{3x}(3x^2 + 20x + 30)$.
  - $(x^3\sin x)^{(20)}(0) = 6840$.
  - $f^{(n)}(0)$ for $1/(x^2 - 1)$ is $-n!$ for even $n$ and 0 for odd $n$.
  - The $(1 + 1/n)^n$ table, $e^6 \approx 403.43$ and $1/(1 + e) \approx 0.269$.
  - The ellipse tangent points at $\pm\sqrt{7/3}$.
  - The folium top at $(2\sqrt[3]2, 2\sqrt[3]4)$ with $F_y \approx 15.1$.
  - The folium's only singular point.
  - The orthogonal-family examples and the 8 crossing points in the hyperbola plot.
  - The parametrization of the tilted-ellipse plot ($3u^2 + v^2 = 7$).
  - The folium parametrization in L12.
  - The greenhouse slope $5\pi/12$ and the $x\ln x$ tangents.
- **Proofs in 13h2** (slope-function criterion, chain rule, product rule, inverse rule): each step is valid. The one fact taken without proof (the inverse of a continuous strictly monotonic function is continuous) is flagged in the text, as the writer said.
- **Attributions:**
  - Constantin Carathéodory (1873–1950). The slope-function criterion is commonly traced to his *Funktionentheorie* (1950), as cited in [arXiv 1910.11531](https://arxiv.org/pdf/1910.11531), and the lesson hedges it with "usually credited".
  - Faà di Bruno published his formula in 1855 and 1857 ([Wikipedia: Faà di Bruno's formula](https://en.wikipedia.org/wiki/Fa%C3%A0_di_Bruno%27s_formula); [arXiv 1612.05393](https://arxiv.org/pdf/1612.05393)), so "the 1850s" is right.
  - Jacob Bernoulli and compound interest, 1683, so "the 1680s" is right.
  - Leibniz's dates are 1646–1716.
- **Folium asymptote and fluid flow:** the folium's asymptote $x + y = -2$ follows from $x^3 + y^3 = 3axy$ with $a = 2$. The corner-flow model ($w = z^2$: streamlines $xy = k$, potential lines $x^2 - y^2 = c$) is right and is labeled as idealized.
- **Drills:** I checked all 6 against sympy for every input combination (1,334 inputs for the horizontal-tangent drill), including the uniqueness of the $x > 0$ horizontal-tangent point and $F_y \ne 0$ there. The dp3 answers use tolerance 0.001, which is at least half the last place.
- **Pictures:** I rendered all 8 SVGs (label ones with their markers) and all 5 Mermaid diagrams. The content is correct, the text is readable and nothing is cut off. The markers sit on the parts their labels name. The accTitle/accDescr lines describe each whole diagram.
- **Glossary and cards:** there are no duplicates of terms or aliases in any `glossary*.yaml` in the course, and the definitions and card formulas are correct.
- **Cross-references:** I checked these against the lessons they cite: Lesson 7 (|x|, cusp), 8, 9 (rectangle picture), 11 (the quoted "fully rigorous proof" sentence), 13 (log-differentiation proof of the power rule), 16 (1^∞), 33, 38 and 44.

## Overlap

- **13h2 and calc-m2's 08h2:** 13h2's $x^2\sin(1/x)$ example also appears in 08h2, where it makes a different point (a derivative that exists but is discontinuous). There is no conflict.
- **13h3 and core Lesson 12:** 13h3 extends Lesson 12's one-line remark on horizontal and vertical tangents. It doesn't repeat it.
- **13h2 and Lesson 16:** the $1^\infty$ remark in 13h2 agrees with Lesson 16.

I found no other round 2 lesson in the course covering Leibniz's rule, slope functions or orthogonal trajectories.

## Uncertain

- 13h1's opener says applying the product rule ten times makes the expression "double in length at every step". That is true of the number of terms before you combine like terms, and it is rhetorical, so I left it.

`content/math/check-module.sh calculus calc-m3` reports zero problems after the fixes.
