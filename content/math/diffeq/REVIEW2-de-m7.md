# Round 2 review: de-m7 (Laplace transforms)

Reviewer check: `content/math/check-module.sh diffeq de-m7` → OK, zero problems
(8 lessons, 121 questions, 16 drills, 54 cards) after the fixes below.

## Changes

1. **32h1, Example 4 plot (picture/plot fix).** The `0.269` label of the dashed steady-state
   line sat on the response curve at the right edge (the curve reaches m ≈ 0.269 at t = 8,
   exactly where the end-of-line label is drawn). Removed the end-of-line labels from the two
   dashed lines and added free labels "M ≈ 0.731" at (1.6, 0.79) and "m ≈ 0.269" at (5, 0.19),
   clear of the curve. Re-rendered with `scripts/preview-plots.mjs` and checked.
2. **32h2, Example 5 cautions (tightening).** "it has only one solution that is bounded there"
   → "up to a constant factor, it has only one solution that is bounded there" (any multiple of
   J₀ is bounded; the second solution Y₀ has a log singularity).
3. **cards-r2-de-m7.yaml, "Proportional control trade-off" (overstatement).** Said raising K
   eventually pushes poles past the imaginary axis; that is false in general (a first- or
   second-order plant with positive coefficients stays stable for every K > 0). Now qualified:
   "for plants like three lags in series".

No answer-key errors found.

## Checked and found right (things a reader might doubt)

- All 66 questions worked independently before reading keys. Notable ones: q03 (sin(eᵗ) has a
  transform, tan t does not), q19 (choice 2, e^(−2s)·L{t + 2}, is correct), q20 (2(1 − e⁻²) =
  1.7293), h03 (±1 square wave → (1/s)tanh(as/2)), h17 (sign: (e^(−5t) − e^(−2t))/t), h21,
  h27, h33 (FVT misuse, f = ½(e^(2t) − 1)), h34 (K < 10, (s + 2)(s² + 5)), h35 (roots −1.353,
  0.177 ± 1.203i), h36 (order unique: real parts −5, −2, −1, −0.2), h41.
- Order questions: each has one valid order. Select-all: every non-key choice clearly wrong.
  Match/label: unambiguous.
- Recomputed in Python/sympy/scipy: half-wave transform at s = 1 = 0.52258 (numeric integral
  agrees); all eight piece coefficients in the 32h1 plot (0.632121, 0.767456, 0.717669, …,
  0.730813); M = 0.7311, m = 0.2689; Example 5 (2.1932, 0.8068); y(1.5) = 0.3834; sawtooth and
  half-wave one-period integrals; L{te^(−2t)cos 3t} = (s² + 4s − 5)/(…)²; series of
  1/√(s² + 1) → 1 − t²/4 + t⁴/64; Example 4 of 32h3, y = 2 − e^(−t)(2cos 2t + sin 2t);
  resonance (sin 2t − 2t cos 2t)/8; roots of s³ + 2s² + 3s + 4 (−1.651, −0.175 ± 1.547i) and
  s³ + 6s² + 11s + 66 (−6, ±3.317i), period 1.894; ∫e^(−t) sin t / t = π/4; ln 3.
- Zero-input/zero-state formula added to Lesson 30 matches the derivative rules.
- 32h2 claims: L{tf} = −F′ (justified for s above the abscissa of absolute convergence), the
  f/t rule with the finite-limit condition, Γ(½) = √π, the Dirichlet-integral step flagged as
  needing an extra argument (correct: |sin t|/t is not integrable), term-by-term inversion of a
  1/s series (legitimate when the series converges for large |s|; labeled as a check).
- 32h3: BIBO criterion for proper rational H, internal-stability caveat, cubic
  Routh–Hurwitz condition, FVT hypothesis and counterexamples, K range −6 < K < 60, error
  6/(6 + K), 1/11 floor.
- History: Maxwell "On Governors" (1868), Routh's Adams Prize essay (1877), Hurwitz (1895);
  Heaviside's operational calculus (1880s–1890s), justified by Bromwich (1916) and Carson
  (1917–1926); Euler's Gamma function in letters to Goldbach, 1729–1730 ("around 1730").
  Sources: standard control texts (Ogata, *Modern Control Engineering*; Franklin–Powell–Emami-
  Naeini), MacTutor biographies of Routh, Hurwitz and Heaviside; Boyce–DiPrima ch. 6 for the
  periodic-function and t-multiplication formulas; DLMF 5.2 and 10.22 (Gamma, L{J₀}).
- Drills: all six regenerated independently in Python (periodic pulse against a direct sum of
  numeric integrals; steady state by iterating 4,000 half-periods; t·e^(at) sin bt against
  sympy's transform; sinc integral by quadrature; Routh gain against numpy roots). All match;
  tolerances (0.00006 for 4 dp, 0.0006 for 3 dp) accept correct rounding. No placeholder
  collisions (`{b}`, `{a}` in the steady-state solution are intended values).
- Pictures: rendered all three SVGs and their blank copies with markers; markers sit on the
  parts named (step panels 1–4, the three waves, the five pole positions). Lesson plots in 28
  and 32 and all five Mermaid diagrams previewed: readable, accTitle/accDescr complete.
- Glossary: no term or alias duplicates another glossary file (the only repeat is
  "Gamma function"/"gamma function" within one entry).

## Overlap

32h3's cubic Routh–Hurwitz test and history repeat 37h2 (de-m8). The statements agree, but
the two lessons index coefficients differently (32h3: a₃s³ + a₂s² + a₁s + a₀, condition
a₂a₁ > a₃a₀; 37h2: λ³ + a₁λ² + a₂λ + a₃). Each is internally consistent; a learner doing both
should watch the indexing. 32h2's J₀ series repeats 41h1 (de-m9) by design and points to it.

## Left uncertain

- 28's first plot: the "s = 1" and "s = 2" labels sit between neighboring curves; readable
  in the preview (colors and positions make the match clear), left as is.
- The periodic-steady drill can give m as small as 0.0008 (a = 3, p = 2, b = 1); correct but
  not a very informative 4-decimal answer.
