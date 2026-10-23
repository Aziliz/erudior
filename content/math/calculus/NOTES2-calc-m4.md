# Round 2 notes: module calc-m4 (Rates and approximation)

`content/math/check-module.sh calculus calc-m4`: build and checker report zero problems
(5 lessons, 77 questions, 10 drills, 35 cards).

## Added

**Honors lessons** (2; the module has only 3 core lessons, so a third did not seem warranted)
- `lessons/16h1-error-convergence.md` (calc-m4-h-error-convergence, "How accurate? Error bounds and
  the speed of Newton's method", 45 min, ~1,900 words). Covers the tangent-line error bound
  $|f - L| \le \frac M2(x - a)^2$ with a short proof (uses "f' ≥ 0 ⇒ nondecreasing" from Lesson 17,
  stated as such), choosing M well, the derivation of $e_{n+1} \approx \frac{f''(r)}{2f'(r)}e_n^2$,
  multiple roots (linear convergence, the $m\frac{f}{f'}$ fix), failure modes (the 0 ↔ 1 cycle for
  $x^3 - 2x + 2$, divergence for $x^{1/3}$), and the secant method. There are 5 worked examples: a bound
  for √4.1 with a table showing the square law, a careful versus a lazy M for sin x ≈ x, the Newton
  error table for x³ − 2x − 5 (the ratio settles on C ≈ 0.563), a double root, and the secant method.
  It has 1 plot (the Newton cycle).
- `lessons/16h2-cauchy-growth.md` (calc-m4-h-cauchy-growth, "Why L'Hôpital's rule works, and orders
  of growth", 45 min, ~1,800 words). Covers Rolle's theorem (statement only, with a pointer to
  Lesson 17), Cauchy's MVT with its proof and its geometric meaning (a path parallel to its chord),
  and a proof of the 0/0 case of L'Hôpital's rule (one-sided, then x → ∞ by x = 1/t). The ∞/∞ case
  is stated without proof and labeled as such. Then Stolz's counterexample (why g' ≠ 0 is needed),
  little-o and ~, and the growth ladder. Worked examples: Cauchy's c for x², x³; Stolz; ranking four
  functions, plus the crossover of x^0.01 and (ln x)^5 near 10^1810; and ln(x² + 1) ~ 2 ln x. It has
  1 parametric plot, 1 growth plot ((ln x)² against √x, crossing near 5504) and 1 Mermaid growth
  ladder.

**Core lessons 14–16**: additions only, each with a sentence or two of lead-in.
- 14: a related-rates procedure flowchart (Mermaid) and a streetlight/shadow picture (SVG) with a
  short paragraph on the similar-triangle relation.
- 15: a labeled differentials picture (SVG: dx, dy, Δy, tangent, curve) with a sentence on the
  error gap, and a Newton's-method loop flowchart (Mermaid).
- 16: a "which strategy for which form" flowchart (Mermaid), and a plot of (1 + 3/x)^x approaching e³
  rather than 1.

**Pictures** (4 original SVGs, each 2–5 KB, all rendered and checked, markers checked on the
blanks): calc-m4-streetlight, calc-m4-streetlight-blank, calc-m4-differentials,
calc-m4-differentials-blank.

**Diagrams**: 4 Mermaid (related-rates procedure, Newton loop, indeterminate-form strategy, growth
ladder), all with accTitle/accDescr, top-down, 4–10 boxes, rendered. 4 new plots (Newton cycle,
Cauchy path, (ln x)² vs √x, (1 + 3/x)^x), rendered with the app's figure code and labels moved
off the curves.

**Questions** (43, all in `questions/r2-calc-m4.yaml`)
- Core, calc-m4-r2-q01…q15 (5 per lesson). Label: q01, q06. Text: q03, q07, q12. Order: q02,
  q09, q14. Match: q08, q11. Select-all: q04, q10, q13. MC: q05, q15. module_quiz: q01, q03, q06,
  q10, q12, q14 (2 per lesson).
- Honors 16h1, calc-m4-r2-h01…h14: 8 MC, 2 text (h03, h07), 2 select-all (h05, h13), 1 match (h09),
  1 order (h10).
- Honors 16h2, calc-m4-r2-h15…h28: 7 MC, 2 text (h16, h23), 2 order (h17, h22), 2 select-all (h19,
  h27), 1 match (h21). No module_quiz on honors questions.
- Correct positions of the 17 four-choice MC questions: 0: 4, 1: 4, 2: 4, 3: 5.

**Drills** (4, in `drills/r2-calc-m4.yaml`):
- calc-m4-r2-tangent-error: estimate √(n² + d), plus the error bound (3 s.f., `sigfigs: 3`).
- calc-m4-r2-secant: two secant steps for a cube root.
- calc-m4-r2-cauchy-c: Cauchy's c for x², x³ on [a, b], as an exact fraction.
- calc-m4-r2-log-ratio: lim ln(x^p + k)/ln(x^q + m) = p/q, as an exact fraction.

Each drill was generated 1,500 times and compared with an independent computation parsed from
the prompt. All targets matched. Correctly rounded answers were accepted, including a secant x₃
computed from a rounded x₂, and so were reduced fractions; wrong or unreduced answers were rejected.
No leftover placeholders, "+ -", x^{1}, thousands commas in TeX, or exponent notation appeared.

**Glossary** (7, `glossary-r2-calc-m4.yaml`; checked against every glossary*.yaml, no duplicate
terms or aliases): quadratic convergence, linear convergence, multiple root, secant method,
Cauchy's mean value theorem, little-o notation, asymptotically equivalent. Every bolded term in
both honors lessons links (Rolle's theorem was already in glossary.yaml).

**Cards** (19, `cards-r2-calc-m4.yaml`): 10 for 16h1, 9 for 16h2.

## For a reviewer to double-check
- Stolz's counterexample is attributed to Otto Stolz, 1879 (Mathematische Annalen). I checked this
  against Wikipedia's L'Hôpital's rule article and confirmed the algebra with sympy:
  f' = 2cos²x, g' = e^{sin x} cos x (x + sin x cos x + 2cos x), f/g = e^{−sin x}.
- The secant method's order (golden ratio ≈ 1.618) is quoted as a known result, not derived. "In
  practice often just as fast" as Newton is a hedged efficiency remark.
- 16h1 uses the Lagrange form of the tangent-line error ("from Lesson 44") in the Newton
  derivation. It is labeled as a forward reference.
- The calc-m5 writer may also define Cauchy's MVT or Rolle-related terms. If so, the glossary entry
  here should be kept in one place.
- Lesson 16's new flowchart is about 650 px wide (4 siblings under one decision). It is readable,
  but it is the widest of the four diagrams.

## Errors found in existing content
None. All existing m4 questions, drills and lesson examples that the new material builds on were
re-read; no changes were made to them.

## Sources
Standard results: the error bound and Taylor's theorem, Newton and secant convergence, Cauchy's MVT,
and L'Hôpital's rule. The Stolz attribution comes from Wikipedia's "L'Hôpital's rule" article,
which cites Stolz (1879). All numbers were recomputed with Python/mpmath/sympy: error tables, the
Newton, double-root and secant iterates, C ≈ 0.563, the crossovers at 4.18 and 5504 (for (ln x)² vs
√x) and at u ≈ 4167.5 (x ≈ 10^1810, for x^0.01 vs (ln x)^5), and Cauchy c = 14/9.
