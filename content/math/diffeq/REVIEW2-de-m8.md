# Round 2 review: de-m8 (Systems of differential equations)

Reviewer: independent check of the round 2 work listed in NOTES2-de-m8.md (honors lessons 37h1 and 37h2,
additions to core lessons 33–37, questions/r2-de-m8.yaml, drills/r2-de-m8.yaml,
glossary-r2-de-m8.yaml, cards-r2-de-m8.yaml, images/de-m8-*).

## Changes

| Where | Problem | Fix |
|---|---|---|
| images/de-m8-complex-portraits.svg and -blank.svg, "Center" panel | The arrows ran counterclockwise. The stated matrix [[0, 1], [-2, 0]] gives velocity (0, -2) at (1, 0), so the motion is **clockwise** (Lesson 35's own rule, and its Example 2 spring is clockwise too). | Reversed the six arrowheads (point reflection about each triangle's centroid). Re-rendered: arrows now run clockwise. The spiral sink, spiral source and improper node arrows were checked against their matrices and are right. |
| 37h1, "Why are the eigenvalues positive" | "For any number of masses the same holds" is false for a chain with no wall spring (free–free: K is singular, ω = 0 rigid-body mode). | Now "for any number of masses in a chain attached to at least one wall". |
| 37h1, Example 4 | "Mass 1 is momentarily still" at t = π/(ω₂ − ω₁): the envelope is zero there, but the velocity is −((ω₂−ω₁)/2)·cos(...), which is small, not zero. | "Mass 1 is almost still (its envelope is zero), with nearly all the motion in mass 2". |
| 37h2, after Example 1 | Said the three-tank chain "with the gut, the blood and the body's tissues as compartments" is the standard oral-dosing model. The standard simplified model is the two-link chain gut → blood → eliminated (as in 13h2); tissues are not a one-way third tank. | "The first two links of such a chain, with the gut and the blood as compartments, are the standard simplified model…" |
| 37 (core), linearization Mermaid chart and accDescr | Said "same type and stability" whenever no eigenvalue has zero real part, contradicting the lesson's own caveat (repeated real eigenvalue can become a spiral). | Box and description now say same stability, and same type except that a repeated eigenvalue may give a spiral. Re-previewed. |
| de-m8-r2-q20 (match) | Asked for "a method that works": variation of parameters works for every forcing, so assigning it to all four is defensible but would be marked wrong. | Stem now asks for "the simplest method that works"; explanation adds that VP would also work for the first three. |
| drill de-m8-r2-critical-gain | Asked for "the largest k for which the steady state is stable", but at k = k_c it is only borderline (roots ±i√a₂), so no largest stable k exists. | Prompt asks for the critical strength k_c (stable for 0 ≤ k < k_c, unstable above); solution says "the threshold is". |

## Checked and found right (things a reader might doubt)

- 37h1: discriminant of M⁻¹K = ((k₁+k₂)/m₁ − (k₂+k₃)/m₂)² + 4k₂²/(m₁m₂); determinant (k₁k₂+k₁k₃+k₂k₃)/(m₁m₂). Example 1 (ω = 2, 2√3), Example 2, modal coordinates, Example 3 building (μ = (3 ± √5)/2, ω ≈ 6.18 and 16.18 rad/s ≈ 0.98 and 2.58 Hz, shapes (1, 1.618), (1, −0.618)), beat identities for x₁ and x₂ (sign checked), Example 4 (π/0.04881 = 64.4 s, 128.7 s), plot envelope rate 0.0244044. Wilberforce pendulum description is correct.
- 37h2: Q₂ and Q₃ verified symbolically (sympy: ODEs and initial values); peak at 10 ln 2 ≈ 6.9 min with 50 g; at t = 60 about 96% of the remaining salt is in tank 3. Example 2 principal minors 11, 0, 0 and det −6. λ³+λ²+λ+2 roots 0.177 ± 1.203i (numpy). Sketch p(iω) algebra and the factorization (λ+a₁)(λ²+a₂) at a₁a₂ = a₃. Mermaid branches (a₁a₂ < a₃ with a₁, a₃ > 0 gives two sign changes in the Routh array, so unstable). Example 3 (a₂ = 10, det −4, eigenvalues −2, −2 ± √2, eigenvector (1, √2, 1)). Example 4 (det(λI − A) = (λ+1)³ + k by expansion; stable for −1 < k < 8; λ = −3, ±i√3; period 3.63).
- History: Maxwell, "On Governors", Proc. Roy. Soc. 1868; Routh, *A Treatise on the Stability of a Given State of Motion*, Adams Prize 1877; Hurwitz, Math. Annalen 46 (1895), found independently. Standard (e.g. Gantmacher, *Theory of Matrices* vol. 2; Ogata, *Modern Control Engineering*).
- Core additions: pendulum separatrix y = ±2|cos(x/2)| from energy ½y² − cos x = 1; trace–determinant and real-eigenvalue Mermaid charts agree with the lessons' tables; two-tank picture and pipe labels match the equations.
- All 51 questions worked independently before reading keys; numerics checked in numpy (h15 polynomial via numpy.poly = [1, 6, 11, 4]; h16 roots 0.066 ± 1.811i; h24 roots −1.651, −0.175 ± 1.547i; h26 eigen-data). No other key errors found; order questions have one valid order; select-all and match items unambiguous.
- Drills, recomputed independently: mode-freqs vs numpy eigenvalues for all 5,184 inputs; peak-time vs ODE integration for all 450 inputs; critical-gain stable just below and unstable just above k_c, and ω = √s₂, for all 64 inputs; beat-time formula. Tolerances 0.006 (2 dp) and 0.06 (1 dp) accept correctly rounded values.
- Pictures: all five rendered with their label markers; markers sit on the named parts (pipes, portraits, springs, x₂ arrow, tanks). Real portraits: saddle arrows (out along (1, 2), in along (1, −2)), sink/source tangent to the slow eigenvector (1, 1), line of equilibria correct.
- Glossary: none of the 9 terms or aliases exists in another glossary file in the course. Cards correct.

## Overlap

- 37h2 overlaps with de-m7's 32h3 (poles and stability): both teach the cubic Routh–Hurwitz test with the same history (Maxwell 1868, Routh 1877, Hurwitz 1895), both have a critical-gain feedback example and drill (de-m7-r2-routh-gain vs de-m8-r2-critical-gain), and de-m8-r2-h24 uses the same polynomial λ³ + 2λ² + 3λ + 4 as 32h3's Example 3. 32h3 already points forward to 37h2. Content agrees; nothing changed (not my files to edit beyond de-m8).

## Uncertain / left as is

- The saddle panel's dashed eigenvector lines are drawn under the solid straight-line trajectories, so they look solid; the alt text's "dashed" is technically true. Left.
- 37h2 Example 3: "the middle block stays the warmest" assumes the slow mode's coefficient is positive (e.g. all blocks start above the surroundings). Left; reasonable reading.

check-module.sh diffeq de-m8: OK (zero problems) after fixes.
