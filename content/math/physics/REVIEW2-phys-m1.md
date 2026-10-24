# Review of round 2, phys-m1 (Measurement and vectors)

Reviewer for item 81. I checked both honors lessons (02h1-uncertainty, 02h2-vector-algebra), the core-lesson additions in 01-measurement and 02-vectors, all 41 questions in `questions/r2-phys-m1.yaml`, the 6 drills, 15 glossary terms, 19 cards and the 6 SVGs. I worked every question before looking at the key, recomputed every number in Python, rendered every SVG (with the label-question markers), every plot/shape block and every Mermaid diagram, and read the PNGs.

## Changes

### Answer-key / question fixes (no keyed answer was wrong)
- **phys-m1-r2-h16**: the distractor $0.2\hat\imath + 0.25\hat k$ was explained as "takes reciprocals of the components", which it isn't (1/3 = 0.33). Replaced it with $0.12\hat\imath + 0.16\hat k$ (dividing by $A^2 = 25$ instead of $A$) and updated the explanation.
- **phys-m1-r2-h18**: the distractor 1.33 had no mistake behind it and wasn't explained. Replaced it with 1.31 ($6/\sqrt{21}$, dividing by $B$ instead of $A$), explained in the explanation.
- **phys-m1-r2-h21**: explanation now names the 1.5 m² distractor (halving twice).
- **phys-m1-r2-q02**: left item `kg·m/s (momentum)` matched to answer `kg·m/s` gave the answer away; changed the left item to `unit of momentum (mass × velocity)`.
- **phys-m1-r2-q01**: added `10⁶` to `accept`.
- **phys-m1-r2-h26**: added `−j`, `−ĵ` (Unicode minus) and `negative j` to `accept`.

### Picture / figure fixes
- **h25 label marker 4** (`phys-m1-parallelogram-blank.svg`): the marker at x = 61.1 covered half of the dot-in-circle symbol it labels; moved to x = 63.3 so it sits right beside it.
- **02h1 error-bar plot**: the ±0.08 s² bars were about 5 px long, hidden under the point markers, so the plot showed no error bars at all although the caption and text describe them. Made them ±0.15 s² with end caps (caption updated). The data and fit are unchanged; every point still lies well within its bar (largest residual 0.025 s²).
- **02h2 ramp shape**: labels "W", "W cos θ" and "W sin θ" overlapped each other, the box and arrowheads. Redrew it larger (ramp 10 × 5.774, still exactly 30°), longer arrows with correct lengths (W = 3.2, W sin θ = 1.6 along −x′, W cos θ = 2.771 along −y′), and moved all text to separate `labels` placed clear of lines.
- **02-vectors subtraction shape**: the "A − B" label sat on the dashed resultant; moved it to a separate label beside the line.

### Other fixes
- **Drills phys-m1-r2-cross-components, -projection, -triple-product**: prompts printed vectors as `{a1}\hat\imath {a2:signed}\hat\jmath …`, which shows "1î", "+ 0ĵ", "− 1k̂" for many inputs (the brief's "1x" rule). Prompts now give the vectors in component form, $\vec A = (a_1, a_2, a_3)$, the notation the lesson itself uses. Solutions unchanged.

## Checked and found right (a reader might doubt)
- 02h1 Example 1: mean 2.010 s, s = 0.0367 s, SEM = 0.0164 s → 2.010 ± 0.016 s (two sig figs because it starts with 1).
- 02h1 Example 2: g = 9.802 m/s², fractional 0.611 %, δg = 0.060; direct sum 0.079 ≈ 0.08. Example 3: 0.28 → 0.3 g, 8 %. Example 4: combined 0.078, ratio 2.3; B's percent error 1.8 % vs 0.52 % stated uncertainty (more than 3×). Measuring to the top of the bob shortens L and lowers g (g ∝ L): correct.
- Error-bar data: least-squares slope through the origin 4.031 s²/m → g = 9.79 m/s², as stated.
- Rounding conventions (1 sig fig, 2 if leading 1; half the smallest division; ±1 last digit; agreement within combined uncertainty, 2–3× = discrepancy) are labeled as conventions in the text, consistent with Taylor, *An Introduction to Error Analysis* (2nd ed., ch. 2–3) and the GUM/NIST TN 1297 treatment of combined standard uncertainty (root-sum-square for independent inputs).
- Power rule with direct addition for $x^n$ (fully correlated factors), quadrature for independent errors: correct.
- h11 counts a consistent parallax reading as systematic; that is the standard classification when the viewing angle is the same every time.
- 02h2: all five examples recomputed (Example 1 angle 79.0°, F⊥·d = 0; Example 2 √146 = 12.08 matches 12.1 from the core lesson; torque (4, −8, 6), |τ| = 10.8; volume 24 m³; ramp −24.5 N, −42.4 N). Rotated-axes formulas and h22 (8.66, −5.00) N correct for axes rotated counterclockwise.
- Targets SVG: cluster 3's mean is exactly the center (200, 419.7); cluster 4's mean is up and to the left, as the alt text says.
- Components and parallelogram SVGs: geometry consistent; right-angle marks correct; markers on the right parts.
- Mermaid diagrams (sig-fig rule, vector addition, propagation rule, cyclic unit vectors): content correct, accTitle/accDescr describe the whole diagram, readable.
- Drills: 2,000 random instances in Python: the 3-dp mean is exact (readings to 0.01, n = 5) so tolerance 0.0006 is enough; g stays 9.6–10.0 m/s²; cross product and triple product formulas match numpy. `sigfigs` accepts correctly rounded answers.
- Glossary: no term or alias duplicates any other glossary file in the course.
- Overlap: no other NOTES2 file in Physics covers uncertainty/propagation or 3D vector algebra; no overlap.

## Left as is / uncertain
- The round 1 tip-to-tail shape in 02-vectors (first figure) has the same label-on-line issue as the subtraction figure ("A + B" sits on the dashed line). It is round 1 content and out of scope; worth a follow-up.
- Round 1 drill phys-dot-product (drills/m01.yaml) prints vectors the same "1î / + 0ĵ" way; out of scope.

`content/math/check-module.sh physics phys-m1`: OK, zero problems.
