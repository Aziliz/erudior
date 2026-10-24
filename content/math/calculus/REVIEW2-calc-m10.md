# Round 2 review: calc-m10 (Sequences and series)

Reviewer pass over the round 2 additions to lessons 40 to 44, honors lessons 44h1 (computing with
series) and 44h2 (complex power series), `questions/r2-calc-m10.yaml` (53), `drills/r2-calc-m10.yaml`
(5), `glossary-r2-calc-m10.yaml` (11), `cards-r2-calc-m10.yaml` (19) and the 9 `images/calc-m10-*`
SVGs. `content/math/check-module.sh calculus calc-m10` reports zero problems after the fixes.

## Changes

### Answer-key errors (2)
- **calc-m10-r2-q13** (match, "the test the strategy chart sends it to first"): $\sum\frac{n!}{10^n}$
  was keyed "Ratio test", but its terms go to infinity, so the chart's first box (do the terms go to 0?)
  sends it to the divergence test, the same answer as $\sum\frac{n}{n+1}$. Two left items had the same
  correct answer, and the stem's "first" also clashed with the alternating item (the chart says to
  test $\sum|a_n|$ before the AST). Changed the item to $\sum\frac{10^n}{n!}$ (terms go to 0, factorial,
  ratio test gives $L = 0$), the stem to "Following the strategy chart, match each series to the test
  that settles it", and the explanation to match.
- **calc-m10-r2-h10** (match): "$\sum\frac1{n^2}$ to 4 decimals" paired with "a partial sum plus
  integral bounds", and the explanation said ten terms give about 4 decimals. The lesson's own
  Example 2 midpoint is off by 0.00029 (recomputed with mpmath), which is 3 decimals; 4 decimals need
  about $N = 20$ (error 3.9e-5). Changed to "to 3 decimals" and gave the numbers in the explanation.

### Factual fixes (2)
- **44h2, "Series with complex terms"**: "The real interval of convergence is just the part of the
  disk that lies on the real axis." The disk is open, so its slice is $(a - R, a + R)$; the interval
  of convergence may also include endpoints. Now says the endpoints lie on the boundary circle and are
  still checked separately (Lesson 43). Same caveat added to the Key point and the matching card.
- **Card "Radius of convergence of the Taylor series of a rational function"**: added "(in lowest
  terms)", as the lesson states (a cancelled factor's zero doesn't limit $R$).

### Picture fixes (3)
- `images/calc-m10-disk.svg`: both "blows up" labels and "R = 1" sat on the dashed radius-$\sqrt2$
  circle; moved them clear of it (labels now inside the dashed circle beside $\pm i$; "R = 1" up and
  left). Blank copy unaffected; markers re-checked.
- Lesson 41 comparison plot ($1/n^2$ vs $1/(n^2+4)$): the "1/(n² + 4)" label overlapped the filled dot
  at $n = 2$ and the curve, and the "1/x²" curve label sat on dots at $n = 8$. Removed those two labels;
  the caption now names the dashed curve. The "1/n²" label stays.
- Lesson 44 plot of $e^x$ with $P_1, P_2, P_3$: the "eˣ"/"P₃" curve-end labels collided and "(0, 1)"
  sat on the curves. Switched to free `labels` placed beside each curve (x range −3 to 2.6), dropped
  the point label and put "(0, 1)" in the caption. Rendered and checked.

### Other fixes (2, drills)
- **calc-m10-r2-integral-bounds**: tolerance ±0.00015 on 4-decimal bounds let the lower bound be
  accepted in the upper box (and the reverse) when the interval is narrow (p = 4, N = 10: width
  0.000083). Tolerance now ±0.00006 (≥ half the last place), and a `where` excludes cases whose width
  is under 0.00012 (only p = 4, N = 10). Tested 300 instances: correct rounded answers accepted,
  swapped bounds and $S_N$ alone rejected.
- **calc-m10-r2-complex-radius**: with q = 1 the solution printed "−1 ± 1i" and "1^2" (the brief's
  "1x" rule). q now ranges over 2 to 4. Tested 300 instances: `sqrt(R²)` and the 3-decimal value
  accepted, `sqrt(R² + 1)` rejected.

## Checked and found right (a reader might doubt)
- All honors-lesson numbers recomputed in mpmath: Leibniz partial sums in the plot, the 4/(2N+1)
  bound and "about 4 million terms" for 6 decimals; $12!\cdot12 \approx 5.7\times10^9$,
  $13!\cdot13 \approx 8.1\times10^{10}$, error with 14 terms 1.2e-11; Example 2 bounds 1.640677 /
  1.649768, midpoint 1.645222; $\ln 2$ terms and tail bound 1.27e-5, actual error 1.24e-5, "about
  40,000 terms" of the alternating harmonic series; Machin estimate 3.14162, bound 2.94e-5, actual
  2.83e-5, one more term gives 9.8e-7; $e^{10}$: k = 14, r = 0.295939, $P_5(r) = 1.3443878$,
  Lagrange bound 1.3e-6, 22026.45 vs 22026.47, $P_5(10) = 1477.7$.
- 44h2: partial fractions for $1/(1+z^2)$ and $\frac1{z-i} = \frac{i}{1+iz}$; $\cos3\theta$,
  $\sin3\theta$; $\int e^x\cos x$ and $\int e^x\sin x$; radii $\sqrt2$, $\sqrt{13}$, $\pi/2$, 3; the
  $\ln(1+x)$ series at 2. "$\cos z$ has no zeros off the real axis" is correct.
- Every one of the 53 questions worked before reading the key; the other 51 keys are right, each
  select-all set is complete, order questions have one order, text accept lists are complete.
- Drills: e-terms (counts n with $n!\,n \le 10^k$; equality handled), log-series (x ≤ 1/2, exact
  fraction, ±0.00001 on 5 decimals), de-moivre (all 36 base/exponent pairs match Python's complex
  powers).
- History: Gregory 1671, Leibniz published 1682 (Acta Eruditorum), Madhava c. 1340–1425 ("traditionally
  credited", "around 1400" is fair), Machin 1706 with 100 digits, Machin-type formulas the main method
  until the 1970s, Euler's formula in the Introductio (1748), Euler's numerical value of
  $\sum1/n^2$ (1731) before the exact value (1734–35). These agree with the standard references
  (MacTutor biographies of Gregory, Madhava, Machin and Euler; Wikipedia "Leibniz formula for π" and
  "Basel problem"; OpenStax Calculus Vol. 2, §5.3 for integral-test remainder bounds and §6.1 for power
  series), checked from knowledge, not re-fetched in this review.
- Pictures: halves (areas 1/2, 1/4, 1/8, 1/16 geometrically exact), series-types, radius, disk (dashed
  circle radius 141.4 px = √2 units, through ±i, meets the real axis at 1 + √2), Euler circle: content
  right, text ≥ 14 px, markers on the parts named. Six Mermaid diagrams rendered: correct, readable,
  accTitle/accDescr describe the whole chart.
- Glossary: no duplicates of terms in other calculus glossary files.

## Overlap
- 44h1's harmonic-series paragraph (bounds on $H_N$, γ, "more than $e^{99}$ terms to pass 100")
  repeats calc-m6's 25h2 in short form and points to it. Kept as a pointer; nothing else overlaps
  another round 2 lesson (rearrangements and Cauchy products are left to calc-h1).

## Left uncertain / not changed
- The series-types picture shows $\sum(-1)^n/\ln n$ without a starting index (it must start at
  n = 2); q12 states n = 2. Left as picture shorthand.
- The Lesson 43 number line draws the center 3 as a filled dot like the closed endpoint 1; it is
  labeled "center 3". Left as is.
- De Moivre drill writes "$(\sqrt2)^n \approx$" even when the value is a whole number (n even).
  Cosmetic.
