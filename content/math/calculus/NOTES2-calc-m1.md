# Round 2 notes: module calc-m1 (Limits and continuity)

`content/math/check-module.sh calculus calc-m1`: build and checker report zero problems
(7 lessons, 107 questions, 14 drills; the card and term counts include other writers' r2 files).

## Added

**Honors lessons** (both `honors: true`, 45 min)
- `lessons/05h1-precise-limits.md` (calc-m1-h-precise-limits), "Precise limits: infinity, the limit
  laws, and limits that fail", ~1,900 words: a table of all six limit definitions (two-sided, both
  one-sided, infinite limits, limits at infinity, infinite at infinity); the M-δ definition with a
  proof that 1/(x − 2)² → ∞ (δ = 1/√M); the ε-N definition with a proof that (3x + 1)/(x + 2) → 3
  (N = max(0, 5/ε − 2)); a full proof of the sum law (triangle inequality, ε/2 split, min of deltas)
  and an outline of the product law; negating the definition, with proofs that the Heaviside step
  function and sin(1/x) have no limit at 0; a Mermaid routine for nonexistence proofs.
- `lessons/05h2-ivt-at-work.md` (calc-m1-h-ivt-at-work), "The IVT at work: bisection, fixed points
  and existence proofs", ~1,850 words: bisection error bounds ((b − a)/2ⁿ bracket, (b − a)/2ⁿ⁺¹
  midpoint error, steps needed = ⌈log₂((b − a)/t)⌉, 2¹⁰ ≈ 10³); a bisection flowchart; the
  one-dimensional fixed-point theorem with proof; cos x = x (existence and uniqueness without
  derivatives); every odd-degree polynomial has a real root; the two-day hike; the runner's 5 km in
  25 minutes and the universal chord theorem (stated, not proved); what the IVT depends on
  (Dirichlet function; x² − 2 on the rationals).

**Core lessons 01–05**: additions only, each picture introduced by a sentence or two; nothing
rewritten or removed.
- 01: "does the two-sided limit exist?" flowchart (Mermaid); labeled jump picture separating the
  left-hand limit, right-hand limit and f(a) (SVG); sin(π/x) oscillation plot with a short paragraph.
- 02: plug-in-first loop (Mermaid, deliberately compact for phones; the existing table keeps the
  technique details); plot of Example 2 with its hole at (0, 1/6); plot of Example 5's jump.
- 03: labeled hole + vertical + horizontal asymptote picture for (x² − x − 2)/(x² − 4) (SVG, with a
  short paragraph); degree-comparison chart (Mermaid); plot of Example 3's two horizontal asymptotes.
- 04: x sin(1/x) squeezed by ±|x| (plot, short paragraph); labeled ε-δ bands picture (SVG) with a
  paragraph on why δ is the smaller of the two distances; ε-δ proof routine (Mermaid).
- 05: three kinds of discontinuity side by side (SVG); classification flowchart including the
  oscillating kind (Mermaid); IVT plot where y = 3 is crossed three times (x³ − 6x² + 9x + 1 on
  [0, 4]), showing "at least one".

**Pictures** (11 SVGs, original, 7–28 KB, all rendered and looked at; markers previewed):
calc-m1-limit-reading (+ -blank), calc-m1-asymptotes (+ -blank), calc-m1-epsilon-delta (+ -blank),
calc-m1-discontinuities (+ -blank), calc-m1-epsilon-n (+ -blank), calc-m1-bisection.

**Diagrams**: 7 Mermaid (5 core, 1 per honors lesson), all with accTitle/accDescr, all rendered.
Figures: 7 new plot blocks (6 core, 1 honors).

**Questions** (53, `questions/r2-calc-m1.yaml`)
- Core calc-m1-r2-q01…q25 (5 per lesson): label 4 (q01, q11, q16, q21), text 5 (q02 two blanks,
  q06, q12 two blanks, q17, q22), match 4 (q03, q09, q13, q23), order 2 (q07, q18), select-all 5
  (q04, q08, q14, q19, q24), MC 5. Every lesson has a text, an order or match, and a select-all;
  every lesson with a labelable picture has a label question (02 has none). module_quiz: q01, q03,
  q06, q10, q11, q14, q17, q21, q23.
- Honors h01…h14 (precise limits) = 9 MC + text, label, match, select-all, order; h15…h28 (IVT at
  work) = 9 MC + 2 text, order, match, select-all. No module_quiz (core-module honors).
- MC answer positions: core 0:1, 1:2, 2:1, 3:1; honors 0:5, 1:4, 2:4, 3:5.

**Drills** (4, `drills/r2-calc-m1.yaml`): calc-m1-r2-infinite-delta (δ = √(c/M), relTolerance
0.001 for a 4-sig-fig answer), calc-m1-r2-epsilon-n (smallest N = |q − pr|/ε − r, always a whole
number), calc-m1-r2-bisection-steps (integer), calc-m1-r2-bisection-error (exact fraction).
Step counts and N values checked exhaustively over every input in Python with exact fractions
(no input makes the ratio an exact power of 2, so the ceiling is never borderline). No drill value
is named n/y/on/off.

**Glossary** (11, `glossary-r2-calc-m1.yaml`, checked against every glossary*.yaml in the course,
including the other writers' r2 files present at the end): M-δ definition, ε-N definition,
triangle inequality, negation, Heaviside step function, bracket, error bound, fixed point,
fixed-point theorem, universal chord theorem, Dirichlet function.

**Cards** (20, `cards-r2-calc-m1.yaml`): 10 on Precise limit definitions, 10 on IVT applications.

## For a reviewer to double-check
- "M-δ definition" and "ε-N definition" are convenient names, not universal ones; the glossary says so.
- 05h2's universal chord theorem is stated without proof: guaranteed for lengths (whole)/n,
  counterexamples for every other length (the standard one is sin²(πx/ℓ) − x·sin²(π/ℓ); scaled
  small, it is a valid pace plan, so the runner claim holds). Not attributed in the lesson
  (usually credited to Paul Lévy, 1934).
- The runner example assumes she never stops, so time-as-a-function-of-distance is continuous; the
  lesson says why the assumption matters.
- The sin(π/x) plot in lesson 01 can't show every swing near 0 (the caption says so); check it
  looks acceptable in the app.
- In the discontinuity label question (q21) the markers sit below each panel, not on the break, so
  they don't cover the hole or dots that identify each kind.
- Possible overlap with the calc-h1 honors module ("Toward analysis", another writer): 05h1 proves
  the sum law and negates the limit definition, and 05h2 mentions completeness in one paragraph
  only. If calc-h1 also proves the limit laws, one of the two should point to the other.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Standard definitions and theorems (ε-δ, M-δ and ε-N definitions, limit-law proofs, IVT, fixed-point
theorem, universal chord theorem). No outside text was opened during this round; every number,
limit, root and drill answer was recomputed in Python/sympy. For a reviewer: OpenStax Calculus
Volume 1 §2.5 (precise definition of a limit) and §2.4 (continuity, IVT) cover the core facts.
