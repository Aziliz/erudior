# Round 2 review: calc-m4 (Rates and approximation), item 32

Reviewed: honors lessons 16h1 (error bounds, Newton convergence) and 16h2 (Cauchy's MVT, proof of
L'Hôpital, orders of growth); the round 2 additions to core lessons 14–16; `questions/r2-calc-m4.yaml`
(43 questions); `drills/r2-calc-m4.yaml` (4 drills); `glossary-r2-calc-m4.yaml` (7 terms);
`cards-r2-calc-m4.yaml` (19 cards); 4 SVGs (`images/calc-m4-*`); 4 Mermaid diagrams; 4 plots.
`content/math/check-module.sh calculus calc-m4` reports zero problems after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| q06 (label, differentials) | Marker 2 ("Tangent line at a") was at (54.2, 58.3), where the tangent and the curve are only about 18 px apart, so the marker covered both. | Moved it to (61.4, 52.1), on the tangent line about 37 px below the curve. Re-rendered: every marker sits on its part. |
| 16h1, "The error of a linear approximation" | Said "a function whose derivative is never negative never decreases" was *proved in Lesson 17*. Lesson 17 states only the f' > 0 version. | Reworded to "one consequence of the Mean Value Theorem (Lesson 17, by the same argument that shows f' > 0 makes f increasing)". |
| 16h1, "Why Newton's method doubles the digits" | Cited "the exact form of the error from Lesson 44" (f''(ξ)/2 · (r − x)²). Lesson 44 states only the Lagrange *bound*, not the equality. | Reworded to "the exact (Lagrange) form of the error, the equality behind the bound that Lesson 44 states". |
| Lesson 16, (1 + 3/x)^x plot | The "y = 1" line label at the right end overlapped the x-axis letter "x". | Gave the y = 1 line `"to": 56` so its label ends left of the axis letter. Re-rendered. |

## Checked and right (things a reader might doubt)

- **All 43 questions** worked independently before reading the key; every key, `accept` list,
  select-all set, order and match is right, and each distractor explanation names a real mistake.
  Notable checks: h01 (M = 1/108, bound 1/5400; 1/2700, 1/1080, 1/1800 are the stated slips; actual
  error 0.000183), q05 (s = 3x/2, shadow grows at 2 ft/s, tip at 6), q09 (x₂ = 3.162281 agrees with
  √10 to 5 decimals), h12 (secant 2.2; Newton from 2 gives 2.25), h15 (c = 2; separate MVT points 3/2
  and √3), h24 ((ln 10¹⁰⁰)⁵ ≈ 6.5 × 10¹¹ vs 10).
- **16h1 numbers** (mpmath): √x error table (0.00238/0.0025, 0.00061/0.000625, 0.000154/0.000156,
  0.0000388/0.0000391); sin x careful bound ≈ 0.0005 vs actual 0.000167; root 2.0945514815, C = 0.56298,
  Newton iterates 2.1, 2.0945681, 2.0945514817 with ratios 0.609, 0.561, 0.563 and e₄ ≈ 1.4 × 10⁻²⁰;
  double-root errors 0.556, 0.298, 0.155, 0.080, 0.040, 0.020; the m = 2 fix 0.111, 0.0019, 6.3 × 10⁻⁷;
  secant iterates 2.0588, 2.0813, 2.09482, 2.0945494, 2.0945514812 with errors 1.3 × 10⁻², 2.7 × 10⁻⁴,
  2.1 × 10⁻⁶, 3.2 × 10⁻¹⁰; the 0 ↔ 1 Newton cycle for x³ − 2x + 2 (real root −1.7693); x^{1/3} gives
  x_{n+1} = −2x_n. The Newton error derivation's signs check out.
- **16h2**: h(a) = h(b) = f(b)g(a) − f(a)g(b) in the Cauchy proof; c = 14/9 and the plotted point
  (3.764, 2.420) and tangent segment (slope 3/7); c₁ = 3/2, c₂ = √(7/3); the x = 1/t reduction;
  Stolz's derivatives (f' = 2cos²x, g' = e^{sin x}cos x (x + sin x cos x + 2cos x)) and f/g = e^{−sin x};
  (b/x)^x < (1/2)^x for x > 2b; crossovers of (ln x)² and √x at 0.44, 4.177 and 5503.7 (the plot is
  for x ≥ 0 and its caption is about the region x > 1, which is fine); x^{0.01} vs (ln x)⁵ at
  u = 1.002 (x ≈ 2.72) and u = 4167.5 (x ≈ 10^1809.9).
- **Stolz attribution**: O. Stolz, "Ueber die Grenzwerthe der Quotienten", *Mathematische Annalen* 15
  (1879), as cited in Wikipedia's "L'Hôpital's rule" article (https://en.wikipedia.org/wiki/L%27H%C3%B4pital%27s_rule)
  and in R. P. Boas, "Counterexamples to L'Hôpital's rule", *Amer. Math. Monthly* 93 (1986).
- **Secant order** (golden ratio ≈ 1.618) is the standard result (e.g. Burden & Faires, *Numerical
  Analysis*); "often just as fast" is hedged and correct per function evaluation.
- **Drills**: generated 2,000 instances of each with the app's drill engine and recomputed the answers
  independently from the prompt text. Correctly rounded answers accepted (including a secant x₃
  computed from a rounded x₂), answers 0.001–0.002 off and a bound 2% off rejected, inverse/unreduced
  fractions rejected; Cauchy c always inside (a, b). No leftover placeholders, "+ -", "1x", thousands
  commas or exponent notation.
- **Pictures**: streetlight geometry is to scale (post 241 px for 15 ft, person 96 px for 6 ft; the
  ray passes exactly over the head; s/x = 1.664 vs 15/9). Differentials picture: P is on the curve,
  the tangent's slope matches the curve's there, Δy > dy for the concave-up curve. q01 markers all on
  their parts.
- **Mermaid** (4): rendered, readable, top-down, accTitle/accDescr describe the whole diagram; content
  correct (the Lesson 16 chart's "nonzero over 0 means infinite or DNE" matches the core lesson).
- **Plots**: rendered all four new ones with the app's figure code; labels are off the curves.
- **Glossary**: no duplicate term or alias in any calculus glossary file, including other writers'
  `glossary-r2-*`. Definitions correct. Cards correct.

## Overlap

None. calc-m5's notes say they avoided Cauchy's MVT and Newton error because they are here; 20h1,
20h3 and 05h2 only refer to Newton's method from Lesson 15. calc-h1 cross-references 16h2.

## Uncertain / left as is

- h16 (text, "Cauchy's MVT with g(x) = ___ is the ordinary MVT") accepts only `x`. Any nonconstant
  linear g also reduces to the MVT, but the lesson states it with g(x) = x, so `x` is the intended
  answer; left unchanged.
- The Lesson 16 flowchart is the widest of the four (four siblings under one decision) but readable.
