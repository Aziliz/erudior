# Round 2 review: calc-m1 (Limits and continuity)

Reviewer for item 29. Scope: honors lessons 05h1 and 05h2, the round 2 additions to core lessons
01–05, `questions/r2-calc-m1.yaml` (53 questions), `drills/r2-calc-m1.yaml` (4 drills),
`glossary-r2-calc-m1.yaml` (11 terms), `cards-r2-calc-m1.yaml` (20 cards) and the 11
`images/calc-m1-*` SVGs. After the fixes, `content/math/check-module.sh calculus calc-m1` reports OK
(7 lessons, 107 questions, 14 drills, zero problems).

## Changes

| Where | Problem | Fix |
|---|---|---|
| 05h1, after Example 2 | The text said "for ε ≥ 2.5 the formula would give a negative N". At ε = 2.5 it gives N = 0, which isn't negative. | Changed it to "ε > 2.5". |
| calc-m1-r2-h06, explanation | The distractor "for every ε there is a δ such that some x … is far" was dismissed with "a single bad δ always exists". That isn't true: for a constant function, no δ is bad. | The explanation now says that statement asks for only one bad δ per ε, and that a wide window can contain far-off points even when the limit really is L. |
| calc-m1-r2-q01, alt text | It said the right-hand line "comes down to" the open circle at 3.5. Read from right to left the line rises, so this was confusing for a screen-reader user. | Changed to "heads to". |
| 02, sentence before the plug-in Mermaid chart | The chart's "A number → that number is the limit" is wrong for piecewise functions. For example, Lesson 1's g(2) = 5, but the limit does not exist. | Added one sentence: the chart is for a single formula; for a piecewise function the value at a may not be the limit, so use one-sided limits. The chart itself is unchanged. |

Counts: answer-key errors 0; factual fixes 2 (05h1 ε bound, h06 explanation); picture fixes 0;
other fixes 2 (q01 alt text, lesson 02 caveat).

## Checked and found right

- **Every question worked independently before I read the key** (q01–q25, h01–h28). All keys are
  right, every select-all set is exact, and each order question has only one valid order. The
  match and label pairings are unambiguous. Specific checks:
  - q05: 2/201 gives π/x = 100π + π/2, so the sine is 1.
  - q12: the hole is at x = 2 (height 12/5) and the vertical asymptote at x = −3.
  - q15: +∞.
  - q20: δ = 0.5.
  - q24: f has a local maximum f(1) = 5 and f(4) = 5, so "never exceeds 5 on [0, 4]" is true.
  - h13: N = 5/ε is valid and 5/ε − 3 is not.
  - h20: x⁴ + x + 3 has minimum ≈ 2.53 > 0, and x⁶ − 2x³ + 5 = (x³ − 1)² + 4.
  - h21: only 2 km = 10/5 is a length of the form 10/n.
- **Numbers recomputed in Python:**
  - 1/0.0099² ≈ 10,203 and 5/501 ≈ 0.00998.
  - log₂10⁶ ≈ 19.93, so 20 steps; log₂100 ≈ 6.64, so 7 steps.
  - f(1.125) = −0.4512 and f(1.25) = 0.2031. The root of x³ + x − 3 is 1.21341, so the midpoint error 0.0259 is within 1/16.
  - cos 1 = 0.5403 and the fixed point of cos is 0.739085.
  - x³ − 6x² + 9x + 1 = 3 at x = 2 and x = 2 ± √3.
- **Drills**, recomputed exactly with fractions over every input:
  - epsilon-n: N = k/ε − r is always a whole number, and it is the smallest N (at x = N the distance equals ε exactly).
  - bisection-steps: the step count matches exact powers-of-2 counting for every (len, t) pair, and no ratio is a power of 2.
  - infinite-delta: relTolerance 0.001 accepts any 4-significant-figure rounding (worst case 0.0005).
  - bisection-error: exact fraction, as the prompt says.
- **Proofs in 05h1** are all correct:
  - M-δ with δ = 1/√M;
  - ε-N with N = max(0, 5/ε − 2);
  - sum law;
  - the product-law outline: the bound (|L| + 1)·ε/(2(|L| + 1)) + |K|·ε/(2(|K| + 1)) < ε works;
  - the negation;
  - Heaviside (the value at 0 is a convention, and the glossary says so);
  - sin(1/x): the choice 2πn > 1/δ puts p_n and q_n inside the window.
- **Proofs and examples in 05h2** are all correct: the fixed-point theorem proof, the odd-degree root, the hike, and the runner. In the runner example, T is continuous because she never stops.
- **Universal chord theorem:** correctly stated as guaranteeing exactly the lengths (b − a)/n. Small perturbations of the standard counterexample keep T increasing, so the "4 km can fail" claim holds for a real pace plan. Sources: P. Lévy (1934), and the standard statement in, e.g., Boas, *A Primer of Real Functions*. The lesson states it without attribution, which is fine.
- **Facts in 05h2:**
  - Newton's method is in Lesson 15 (15-linearization.md).
  - "Often doubles the number of correct digits" is properly hedged (quadratic convergence near a simple root).
  - Brouwer's theorem is the higher-dimensional version of the fixed-point theorem.
  - The Dirichlet function is continuous nowhere.
  - x² − 2 has no rational zero, so the IVT fails on the rationals.
- **Pictures:** all 6 SVGs rendered, and all 5 label questions previewed with their markers.
  - The geometry matches each function: the asymptote picture is (x + 1)/(x + 2) with a hole at (2, 3/4) and the right sides of both branches; the ε-N picture is y = 3 − 5/(x + 2) with N = 8 and ε = 0.5; the bisection picture is to scale with the root at 1.2134.
  - In the ε-δ picture the curve leaves the lower band slightly left of a − δ, which matches "δ is the smaller distance".
  - Text is readable, nothing overlaps or is cut off, and every marker is on or directly under the part its label names.
- **Mermaid (7):** all rendered and readable, and every accTitle/accDescr describes the whole diagram.
- **Plots (7):** the functions and the points on them are correct, e.g. f(−9) = 1/3 in lesson 02's conjugate plot, and the swing counts given for sin(π/x) in lesson 01 are right.
- **Glossary and cards:** definitions are correct. The writer's notes say no term duplicates another in the course, and the checker passes.

Sources: OpenStax *Calculus Volume 1*, §2.4 (continuity, IVT) and §2.5 (precise definition of a limit, one-sided and infinite limits) and §4.6 (precise definition of limits at infinity); Abbott, *Understanding Analysis*, §1.4 and §4.5 (completeness and the IVT); Lévy, "Sur une généralisation du théorème de Rolle", C. R. Acad. Sci. Paris 198 (1934) for the universal chord theorem.

## Overlap with other round 2 lessons

- **calc-h1 lessons 90–93** (another writer) overlap with this module in four places. All are already handled by cross-references and are not duplication:
  - Lesson 90 proves the sum law for sequences and points to 05h1.
  - Lesson 92 proves the IVT by bisection (05h2 only says that proof "belongs to real analysis").
  - Lesson 93 uses the Dirichlet function.
  - Lesson 91 quotes a sentence of 05h2 word for word: "is really a statement that the real line has no holes". I left that sentence unchanged.
- **Drills:** calc-h1 also has a `calc-h1-r2-bisection-steps` drill, similar to `calc-m1-r2-bisection-steps`. That is a mild duplication, acceptable for practice.
- **Shared glossary terms:** "triangle inequality" and "Dirichlet function" are defined only here, and calc-h1 relies on them. Don't remove them.

## Left uncertain

- I haven't seen the lesson 01 sin(π/x) plot in the app itself. Its caption already says no drawing can show every swing.
