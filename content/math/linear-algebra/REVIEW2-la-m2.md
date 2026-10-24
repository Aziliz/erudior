# Round 2 review: la-m2 (Systems of linear equations)

Reviewed: honors lessons 07h1 (uniqueness of the RREF) and 07h2 (Jacobi and Gauss–Seidel), the
round 2 additions to core lessons 04–07, `questions/r2-la-m2.yaml` (48), `drills/r2-la-m2.yaml`
(4), `glossary-r2-la-m2.yaml` (10), `cards-r2-la-m2.yaml` (21), and the 8 `images/la-m2-*` SVGs.
`content/math/check-module.sh linear-algebra la-m2` reports zero problems after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| 06-existence-uniqueness, Example 2 plot | Rendered with the app's code, all three line labels and the "(2, 0)" label sat on the lines and overlapped each other; the h = 10 line (slope −0.4) was almost on top of the slope −1/3 lines, so the "crossing" case was hard to see. | Redrew the block: h = 12, k = −4 (dashed, clearly parallel) and h = 4, k = 8 (slope −1, crosses at (2, 0)); labels placed in clear space with `labels`; caption says which is which without relying on color. Lines checked in Python (4·2 + 4·0 = 8, 2 + 0 = 2). Re-rendered: nothing on a line, nothing cut off. |
| la-m2-r2-q18 (order) | "Identify the conservation or matching rule" and "Choose the unknowns" can be done in either order (the lesson's own network example names the flows first), so two orders were defensible. | Merged the rule into the equation step: Choose the unknowns → Use the rule to write one equation per node/element/point → Row-reduce → General solution → Constraints. Explanation updated. |
| 07h2, "Big systems" | "it cannot exploit sparsity well" overstated (sparse direct solvers exist). | "so plain row reduction does not take full advantage of sparsity." |
| la-m2-r2-h26 explanation | Same overstatement. | "plain row reduction". |
| cards-r2-la-m2, plate card | "Gauss–Seidel error shrinks by about 4 each sweep": the first ratio is 25/8.75 ≈ 2.9; only the later ratios are 4 (the lesson correctly says "eventually"). | "eventually shrinks by about a factor of 4 each sweep". |

## Checked and right (things a reader might doubt)

- All 48 questions worked independently before reading keys: every key correct, every select-all
  list exact, match/label pairings unambiguous, distractor explanations name real mistakes.
  Notable checks: h04 ($\mathbf{a}_3 = (2,-3,1)$; the stated RREF is indeed the RREF of
  $[\mathbf{a}_1\ \mathbf{a}_2\ \mathbf{a}_3]$), h08 (RREF of $A$ is $B$), h12 ($\mathbf{a}_4 = -\mathbf{a}_1 + 3\mathbf{a}_3$, pivot columns 1 and 3),
  h15/h16/h28 sweeps, h17 dominance of all five matrices, h25 (solution (1, 1)), q14, q15, q20.
- 07h1: Examples 1–4 recomputed with sympy (two echelon paths of $M$; lesson 05's $A$ → $R$ and
  its relations; $P$, $Q$ both → $[1\,0\,3; 0\,1\,{-2}; 0\,0\,0]$, $Q'$ → $I$; Example 4 RREF).
  The proof is correct, including the "column $j$ is a combination of earlier columns ⇔ a relation
  with $c_j = -1$, $c_{j+1..n} = 0$" step and the row-equivalence test.
  Yuster's proof (*Mathematics Magazine* 57, 1984) is by induction on the number of columns, as
  stated. The *Nine Chapters* date ("roughly two thousand years ago") is fine.
- 07h2: plate system solves to 55, 60, 40, 45; the Jacobi/Gauss–Seidel tables in Examples 2–4 and
  the max-error table (25, 12.5, 6.25, 3.125, 1.5625 vs 25, 8.75, 2.1875, 0.547, 0.137) recomputed
  from a zero start; ratios 1/2 and 1/4 match the spectral radii for this grid. "Fewer than 50,000
  nonzeros" on a 100×100 grid: exactly 49,600. The convergence theorem for strictly diagonally
  dominant matrices is stated correctly and labeled as stated without proof; the remark about
  weakly dominant larger grids (irreducible diagonal dominance) is correct. History: Gauss's
  letter to Gerling (1823), Jacobi (1845), Seidel (1874), so "decades before Seidel" is right.
- Drills: 1,500 instances of each of the 4 drills generated with the app's `generate()`, answers
  recomputed in Python from the prompt text alone (sympy RREF for the two RREF drills; parsed
  equations for the sweeps): all match, every system shown is strictly diagonally dominant, the
  correct answers pass `checkAll`, a wrong answer is rejected, and there are no "+ -", "1x" or
  unfilled placeholders.
- Pictures: all 8 SVGs rendered; blanks rendered with the label questions' markers. Each marker
  is on the part its label names; text readable, nothing overlapping or cut off.
- Mermaid: all 6 diagrams rendered; content and accTitle/accDescr correct.
- Glossary: no term or alias duplicates another glossary file in the course. Definitions correct.
- Overlap: no other round 2 lesson in the course covers RREF uniqueness or Jacobi/Gauss–Seidel
  (la-h1's PageRank lesson uses the power method, a different iteration). The writer's switch away
  from pivoting/conditioning (covered by la-m1 03h2 and la-m5 18h1) avoided an overlap.

## Left uncertain

- Nothing material. The glossary alias "diagonally dominant" points to the strict definition;
  harmless while the lessons only bold the strict term.

## Sources

- T. Yuster, "The Reduced Row Echelon Form of a Matrix Is Unique: A Simple Proof", *Mathematics
  Magazine* 57(2), 1984 (MAA listing).
- Y. Saad, "Iterative methods for linear systems of equations: A brief historical journey"
  (arXiv:1908.01083); Wikipedia, "Gauss–Seidel method" (Gauss–Gerling letter 1823, Seidel 1874).
- Standard numerical linear algebra (convergence of Jacobi/Gauss–Seidel for strictly diagonally
  dominant matrices; e.g. Burden & Faires, *Numerical Analysis*, ch. 7).
