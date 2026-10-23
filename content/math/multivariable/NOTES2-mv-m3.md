# Module 3 round 2 (mv-m3, Partial derivatives): writer notes

## Added
- **Honors lessons (3)**, all `honors: true`, refs `mv-ref-differential`:
  - `16h1-differentiability.md` (mv-h-differentiability, "Differentiability in depth: proofs and counterexamples", 45 min, ~1,800 words): precise definition with error term; proofs that differentiable ⇒ partials, continuity, D_u f = ∇f·u; counterexamples xy/(x²+y²), x²y/(x²+y²), xy²/(x²+y⁴); proof that C¹ ⇒ differentiable (MVT on two legs); ρ² sin(1/ρ) (differentiable, partials discontinuous); second-difference idea behind Clairaut; Peano's example f_xy(0,0) = −1 ≠ f_yx(0,0) = 1. 4 worked examples, plot of directional slopes cos²θ sin θ, Mermaid implication chart with counterexamples. Drills mv-m3-r2-dir-origin, mv-m3-r2-mixed-unequal.
  - `16h2-derivative-matrix.md` (mv-h-derivative-matrix, "The derivative as a matrix", 45 min, ~1,650 words): maps ℝⁿ→ℝᵐ, derivative matrix (rows = gradients, columns = ∂F/∂xⱼ), linear approximation of maps, polar map and the r in dA = r dr dθ (plot of image patch vs parallelogram), matrix chain rule (Mermaid), tree diagram as matrix product, gradient in polar coordinates (|∇f|² = z_r² + z_θ²/r², |∇θ| = 1/r), inverse function theorem stated without proof (local vs global, polar map at r = 0). 3 worked examples. Drills mv-m3-r2-deriv-matrix, mv-m3-r2-matrix-chain.
  - `16h3-pdes.md` (mv-h-pdes, "Partial differential equations and the chain rule", 45 min, ~1,450 words): heat/wave/Laplace table (labeled idealizations), linear/homogeneous and superposition, e^(−αn²t) sin nx and decay by frequency (plot), traveling waves, characteristic coordinates reducing the wave equation to U_ξη = 0 (full chain-rule derivation), d'Alembert's formula (plot of a splitting bump), harmonic functions, polar Laplacian, ln r and rⁿ cos nθ, mean value property and maximum principle (stated without proof). 4 worked examples. Drills mv-m3-r2-heat-decay, mv-m3-r2-dalembert.
- **Core lessons improved** (additions only):
  - L11: contour-map picture with peak, saddle point (pass), pit, steep and gentle slopes, plus a short paragraph on saddles (unbolded; "saddle point" is taught in Lesson 17).
  - L12: "A strategy at a glance" section with a Mermaid decision chart (continuity → algebra → paths → squeeze/polar).
  - L13: 3D picture of a surface sliced by the plane y = b, the trace, and the tangent line with slope f_x(a, b), plus two sentences.
  - L14: Mermaid chart of implications (C¹ ⇒ differentiable ⇒ continuous / partials exist; dotted arrows that fail).
  - L15: "Which form do I need?" Mermaid decision chart (implicit vs one vs several independent variables).
  - L16: picture of ∇f, −∇f, the level-curve direction and a direction at angle θ; a sentence on |∇f| cos θ; Mermaid of the directional-derivative procedure.
- **Questions**: `questions/r2-mv-m3.yaml`, 72 total.
  - Core: mv-m3-r2-q01 – q30 (5 per lesson): text 12, select-all 6, match 5, order 4, label 3. module_quiz: q01, q03, q06, q08, q11, q14, q17, q18, q22, q25, q26, q29 (2 per lesson).
  - Honors: mv-m3-r2-h01 – h42 (14 per lesson): 24 four-choice (answer positions 0/1/2/3 = 6/6/6/6), text 7, select-all 5, order 3, match 3 (18 of 42 other types).
- **Pictures** (6 SVGs, all original, generated from computed coordinates, each under 32 KB): mv-m3-contour-terrain (+blank), mv-m3-partial-slice (+blank), mv-m3-gradient-directions (+blank). Blanks back label questions q01, q11, q26. All previewed with preview-figure.mjs, blanks with their markers.
- **Mermaid diagrams (6)**: L12, L14, L15, L16, 16h1, 16h2. All with accTitle/accDescr, previewed.
- **Plots in honors lessons (4)**: 16h1 directional slopes; 16h2 polar patch vs parallelogram; 16h3 heat decay; 16h3 d'Alembert bump.
- **Drills (6)** in `drills/r2-mv-m3.yaml`: mv-m3-r2-dir-origin (3 dp, tolerance 0.0006), mv-m3-r2-mixed-unequal, mv-m3-r2-deriv-matrix, mv-m3-r2-matrix-chain, mv-m3-r2-heat-decay (λ integer; half-life with sigfigs 3), mv-m3-r2-dalembert (exact fraction, computed as reduced num/den).
- **Glossary**: 16 new terms in `glossary-r2-mv-m3.yaml` (counterexample, error term, continuously differentiable, mean value theorem, second difference, derivative matrix, matrix chain rule, inverse function theorem, local inverse, wave equation, Laplace's equation, superposition principle, traveling wave, characteristic coordinates, d'Alembert's formula, mean value property). Checked against glossary.yaml and the m1, m2, m5 round-2 glossaries: no duplicate terms or aliases.
- **Cards**: 27 in `cards-r2-mv-m3.yaml` (9 per honors lesson).
- `content/math/check-module.sh multivariable mv-m3`: build and checker OK, zero problems.

## For the reviewer
- 16h1: Peano's example is "often credited to Giuseppe Peano (1884)"; attribution hedged. The remark that only one partial needs to be continuous is stated as a known sharper version, without proof.
- 16h1 claims the Peano function is C¹ with |f| ≤ |xy| ≤ ρ²/2; its mixed partials off the origin are (x² − y²)(x⁴ + 10x²y² + y⁴)/(x² + y²)³ (1 on the x-axis, −1 on the y-axis), checked in sympy.
- 16h2: inverse function theorem stated without proof; the "1×1 version" link to the implicit function theorem is informal by design.
- 16h3: d'Alembert's date given as "in the 1740s" (1747 paper); Fourier "in the early 1800s". The steady-temperature "no interior hot spot" argument is labeled as common sense, not a proof. Polar Laplacian stated, not derived in full.
- 16h3 Example 3 / h36: u(3, 3) and u(2, 2) are 0.5 to many decimals (e^(−36), e^(−16) negligible).
- Core label q11 uses "fx(a, b)" in plain text (drop-down answers cannot hold math).
- All numeric answers, worked examples and distractors checked in Python/sympy (λ = 18, 36/125, 3/10, polar DP and its inverse, D(G∘F) = [[5, 4], [1, −1]], linear-approximation estimate (1.7687, 1.1366) vs true (1.7639, 1.1396), harmonic checks, wave-equation change of variables).

## Errors found in existing content
None. No existing question, drill, card or glossary entry was changed.

## Sources
Standard results (definitions and theorems as in Stewart, OpenStax Calculus Vol. 3, and Apostol/Marsden–Tromba for the derivative matrix, C¹ ⇒ differentiable and the inverse function theorem); Strauss, *Partial Differential Equations*, for characteristic coordinates and d'Alembert's formula. All explanations, examples, questions and drawings original.
