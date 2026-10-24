# REVIEW2-la-h1: review of honors module la-h1, "Linear algebra at work"

Reviewer, independent of the writer. Scope: lessons 90–93, `questions/r2-la-h1.yaml` (56),
`drills/r2-la-h1.yaml` (12), `glossary-r2-la-h1.yaml` (28), `cards-r2-la-h1.yaml` (35),
`images/la-h1-*` (7 SVGs), 4 Mermaid diagrams, 3 plots.
`content/math/check-module.sh linear-algebra h1` after the fixes: **OK, zero problems**.

## Changes

| Where | Problem | Fix | Source |
|---|---|---|---|
| 91, "How fast does PageRank converge?" | Said "every eigenvalue of G other than 1 is α times an eigenvalue of S other than 1". That is false when S has eigenvalue 1 more than once (e.g. two closed groups of pages): G then has eigenvalue α = α·1. The claim was also given without saying it is unproved. | Now: if S has eigenvalues 1, λ₂, …, λₙ (listed with repeats), G has eigenvalues 1, αλ₂, …, αλₙ; marked "stated without proof". | Haveliwala & Kamvar (2003); Langville & Meyer, *Google's PageRank and Beyond*, Thm 4.7.1 |
| la-h1-r2-h20 explanation | Same misstatement. | Same correct statement. | as above |
| 93, "Geometry matters" | Said σ²(JᵀJ)⁻¹ is the covariance of the *position* and the diagonal holds "the coordinates", but the lesson's J has the clock column, so the unknowns include cb, and √tr over all four is GDOP, not a pure position figure. | Now "the estimated unknowns" and "variances of the unknowns (for GPS, the three coordinates and the clock term cb)"; added one sentence that all four entries give geometric DOP and the three position entries give position DOP. | Misra & Enge, *Global Positioning System*, ch. 6 (DOP definitions) |
| 93, "Turning circles into lines" | Said each subtracted equation "is the line through the two intersection points" of two circles. With noisy ranges the circles may not cross. | Now: the line is perpendicular to pᵢ − p₁, and *when the circles cross* it passes through their intersection points. | standard (radical line) |
| 90, end of circuits section | "which is why engineers call it the fundamental equation of equilibrium": unsourced attribution. | "which is why applied mathematicians treat it as the basic equation of equilibrium." | — |
| la-h1-r2-h13 (match) | Distractor "Currents fed into the nodes from outside" arguably describes Row A = Col Aᵀ: for a connected graph the admissible source vectors s (entries summing to 0) are exactly Row A. A learner could defend matching it to Row A. | Distractor now "Potentials that differ at every node" (not a subspace; exactly what Nul A excludes); explanation updated. | — |
| la-h1-r2-h38 (text) | Stem is "___%"; typing "81.25%" was rejected (the matcher doesn't strip %). | accept: ['81.25', '81.25%']. | src/lib/questions.ts textMatches |
| questions file comment | Lesson 92 header still said "low-rank approximation" (a dropped draft). | Comment corrected (no effect on the app). | — |
| 91 plot (error vs step) | The "step k" axis title sat right on the points at k = 11–12. | x range [0, 12] → [0, 15]. | rendered |
| 92 plot (leaves) | "mean" sat on both lines and "least squares" sat on the dashed line. | Point and curve labels replaced by placed `labels` (mean below the point; "least squares" above the dashed line and "first component" below the solid line, both at the left). | rendered |
| 93 plot (three circles) | Circles 1 and 2 were cut off at the bottom/right; "p3" sat on the small circle and the dashed line; "you (3, 4)" on circle 2 and a dashed line; p1/p2 near tick labels. | Range now x [−6, 15], y [−7, 10]; vertical dashed line extended; labels placed clear of every curve. | rendered |
| 90 Mermaid | Last box wrapped as "… x = / s". | Label "Result: A transpose C A x = s" (fits one line). | rendered |
| 92 Mermaid | Covariance box wrapped as "(N - / 1)". | Label "Covariance S = BB^T/(N-1)". | rendered |

## Checked and right (things a reader might doubt)

- **Lesson 90:** Ax entries; loop vectors y₁ = (1,1,−1,0,0), y₂ = (0,0,1,1,−1) and Aᵀy = 0; b·y = 0 for Example 1, with potentials (0,2,3,−1); Laplacian matches degrees (3,2,3,2); det of the reduced Laplacian = 8, which matches 10 − 2 triples listed by hand; the sign derivation of AᵀCAx = s with current = c(x_tail − x_head); Example 3 potentials (½,1,½,0), currents, balanced bridge, 1 Ω effective resistance; Euler's formula rearrangement. Matrix-tree theorem attributed to Kirchhoff 1847 (standard).
- **Lesson 91:** S eigenvalues 1, 0, −½ ± ½i, so |λ₂(G)| = 0.85·0.707 ≈ 0.601. PageRank (0.3797, 0.1989, 0.3839, 0.0375) and x₁ (numpy); undamped (0.4, 0.2, 0.4, 0); all 13 plotted error values match (rounded to 3 dp). Power-method iterates in Example 2 and gap ratios ≈ 0.4; 0.85⁵⁰ ≈ 2.96×10⁻⁴ (≈3,400-fold); Example 3 (2/11, 3/11, 6/11), repaired S² positive, damped ≈ (0.198, 0.282, 0.521). The Perron (positive-matrix) statement is consistent with 32h3's primitive-matrix version. Brin & Page 1998, α = 0.85, |λ₂| ≤ α (Haveliwala & Kamvar 2003) are correct.
- **Lesson 92:** BBᵀ = [[20,8],[8,8]], S = [[5,2],[2,2]], λ = 6, 1, scores and sums 24 and 4; perpendicular SS 4 vs 4.138 and vertical SS 5 vs 4.8; Example 3 λ ≈ 100.36, 0.64, u₁ ≈ (0.998, 0.060), 99.4%, and the correlation-matrix version 1.6/0.4. Pearson 1901 ("On lines and planes of closest fit…"), Hotelling 1933 (educational-psychology test data), Turk & Pentland 1991, Novembre et al. 2008 (*Nature* 456:98–101; 1,387 individuals after filtering from ~3,000 sampled, so "about 1,400" is right). The yield-curve claim (a few components) matches Litterman & Scheinkman (1991). The k-selection rules are labeled conventions.
- **Lesson 93:** Example 1 (3, 4) and circle radii √41, √5; Example 2 normal equations → (3.083, 3.983); Example 3 trace 2, det sin²θ, DOP = √2/sinθ, 4.13 at 20°. GPS facts: ~299.8 m per µs; 4 unknowns; satellite clocks gain ≈ 38 µs/day net (+45.9 GR − 7.2 SR; Ashby 2003, *Living Reviews in Relativity*); Earth-centre starting guess is standard.
- **Questions:** I worked all 56 before reading the keys, and every key matches. Every distractor is wrong for the stated reason. For select-all items h11/h24/h40/h54, every listed choice is right and the others are clearly wrong. The orders in h14/h25/h41/h55 are the only possible ones. The match/label pairings are unambiguous (after the h13 fix). Text answers h10 (9), h23 (29; 0.85²⁸ ≈ 0.0105, 0.85²⁹ ≈ 0.0089), h28, h38, h52 accept the reasonable forms. h44: two beacons leave y = ±3, but only x is asked.
- **Label markers:** I rendered all three label pictures with their markers. Graph markers sit on e1–e5 in the order of the rows, PCA markers on mean / PC1 / PC2 / point / foot, and GPS markers on the receiver / satellite / range line / clustered group. The full SVGs are correct, readable and nothing overlaps (the web picture matches the link list and S).
- **Drills:** I generated 300 instances of each drill (3,600 total) with the app's own engine and recomputed every answer independently in numpy from the values shown: 0 mismatches. Correctly rounded answers (dp3/num2/num1) are accepted, and answers off by 4× the tolerance are rejected. Tolerances are ≥ half the last place: 0.0006, 0.006, 0.06. There are no unfilled placeholders. Collinear or degenerate inputs are ruled out (trilaterate has cc ≥ 3; pc-direction has λ₁ > λ₂ and integer S entries).
- **Glossary and cards:** all 28 terms and aliases are unique across every glossary*.yaml. Definitions are correct. Perron–Frobenius is defined in glossary-r2-la-m8 (m8's notes worried that la-h1 would bold it; it doesn't, so there is no duplicate and no gap).

## Overlap

- 32h3 (m8, population models and Perron–Frobenius) mentions the power method in one sentence and regular stochastic matrices. 91 covers the power method in depth and points back to 32h3 for Perron–Frobenius. This is complementary, not a repeat.
- 92 points to 40h3 for low-rank approximation instead of repeating it, and reuses the matrix from lesson 38 on purpose, saying so. 93 does not overlap 11h2 (Hamming codes). No changes were needed.

## Left uncertain

- Drill answers with `format: num1`/`num2` are normalized to "number" by the app. So `la-h1-r2-explained` and `pc-direction` *show* the key with 2 decimals (e.g. 81.82) even though the prompt asks for 1. A 1-dp answer is still accepted. This is cosmetic and I didn't change it.
- In the GPS label picture, marker 4 ("Clustered satellites: large DOP") floats just above the right-hand group rather than on one satellite. I left it there on purpose so it can't be read as a single satellite.
