# Round 2 review: module la-m5 (Matrix algebra)

Reviewer for assignment 66. Scope: honors lessons 18h1 and 18h2, the round 2 additions to core
lessons 15–18, `questions/r2-la-m5.yaml` (48), `drills/r2-la-m5.yaml` (6),
`glossary-r2-la-m5.yaml` (11), `cards-r2-la-m5.yaml` (23), images `la-m5-*` (5).
`content/math/check-module.sh linear-algebra la-m5` reports zero problems after the fixes.

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| Lesson 18 (core), "when to use LU" Mermaid chart and its accDescr | The chart allows $PA = LU$ but then says "forward-substitute Ly = b" for every b. After swaps that is wrong: you solve $L\mathbf{y} = P\mathbf{b}$, the mistake 18h1 warns about. | Box now reads "forward-substitute Ly = b (or Ly = Pb after swaps)"; accDescr updated to match. Re-rendered. | $PA\mathbf{x} = P\mathbf{b}$ (standard; 18h1 Example 2) |
| 18h2, Sherman–Morrison history | Said the 1949–50 work was about one entry changing. The 1949 abstract was about a row or column changing; the 1950 paper about one element. | "after one entry, row or column changes" | Wikipedia "Sherman–Morrison formula" (Ann. Math. Statist. 20:621, 1949; 21(1):124–127, 1950) |
| 18h2, Kalman filter sentence | "the Kalman filter is usually derived with its higher-rank version" overstated how the filter is usually derived. | Now says the higher-rank (Woodbury) version "is a standard tool in deriving the Kalman filter's update equations". | Hedge; no source asserts "usually" |
| la-m5-r2-h12 (match), stem | "the situation it is meant for" was ambiguous. A matrix that suits LDLᵀ or Cholesky also has a plain LU, so "No row swaps needed" could fairly go with several factorizations. | Stem now reads "the most general situation in which it is guaranteed to exist". Each pairing is now unique. | — |

Counts: answer-key errors 0, factual fixes 2 (history wording, Kalman overstatement), picture/diagram
fixes 1 (lesson 18 chart), other fixes 1 (h12 stem ambiguity).

## Checked and found right (things a reader might doubt)

- **All 48 questions** were worked independently before I looked at the keys. The keys are right, every
  select-all set is complete, and the order questions have one order each. Notable checks:
  - q19: matrices 2 and 3 have a zero leading principal minor, so they have no LU even though both are invertible.
  - h06: the multipliers are swapped with their rows, giving $L$ rows (4, 1, 0) and (2, 0, 1).
  - h16: neither distractor sum happens to equal $AB$.
  - h23: the denominator is 2.
  - h25: "singular exactly when $1 + \mathbf{v}^TA^{-1}\mathbf{u} = 0$" holds with no extra condition, by the matrix determinant lemma.
- **Lesson numbers** were recomputed with sympy:
  - 18h1: Ex 1 ($PA$, $P^T$, $P^2 \ne I$), Ex 2 ($PA = LU$ and $\mathbf{x} = (1, 2, -1)$), Ex 4 (the partial-pivoting $PA = LU$), Ex 5 ($LDL^T$ of $S$, which is positive definite).
  - 18h2: Ex 1 (the outer-product sum), Ex 2 ($\mathbf{x} = (1, 2, -1)$), Ex 3 ($(A')^{-1}$), and the Schur complement $\begin{bmatrix} 3 & 3 \\ 3 & 5\end{bmatrix}$.
- **18h1 Example 3** (3-digit arithmetic): the exact solution is $x_1 = 1.00010$, $x_2 = 0.99990$. Without the swap you get $x_1 = 0$; with it, 1.00. The claim that $10^{-20}$ also gives $x_1 = 0$ in real double precision was checked in numpy: no-swap elimination gives (0, 1), while `numpy.linalg.solve` (which pivots) gives (1, 1).
- **LDU uniqueness proof and the $LDL^T$ argument**: correct. The proof needs $A$ invertible and no swaps, and the lesson states both.
- **Schur complement**: the block LU, the null-vector argument for "$M$ invertible ⟺ $S$ invertible", and the block triangular inverse are all correct.
- **History**: Schur's 1917 paper and Haynsworth's 1968 naming of the Schur complement are confirmed by Wikipedia "Schur complement" and its references. Woodbury's 1950 Princeton memorandum is the standard citation (Hager, "Updating the inverse of a matrix", SIAM Review 1989).
- **Partial pivoting**: the $2^{n-1}$ worst-case growth (Wilkinson) is standard (Higham, *Accuracy and Stability of Numerical Algorithms*, ch. 9). It is also standard that LAPACK `getrf`/`gesv` use partial pivoting, which `numpy.linalg.solve`, MATLAB `\` (for general square matrices) and R `solve` call.
- **Drills**: all 6 were generated 400× each with the app's own `generate()` (2,400 instances). The answers were recomputed independently in sympy from the prompt as shown: the matrices were parsed from the prompt TeX, then elimination with forced swaps (checking $PA = LU$ and that exactly one swap occurs), `LUsolve` on $A = P^TLU$, $LDL^T$ reconstruction, the full $M^{-1}$, the Schur complement checked against $\det M$, and the actual inverse of the modified $A'$. There were 0 mismatches. Fraction answers are exact, and there are no stray placeholders, "+ -" or thousands commas.
- **Pictures**: all 5 SVGs were rendered. The two label questions were checked with their markers: every marker sits on the part its label names (marker 2 of q01 falls between two shaded cells of column 2, still on the column). Text is readable and nothing overlaps or is cut off.
- **Diagrams and plots**: the 6 Mermaid diagrams (5 core, 1 honors) and the new lesson-16 shear `plot` were rendered. The shear maps (0,1)→(1,1) and (1,1)→(2,1), as captioned.
- **Glossary**: none of the 11 terms or aliases duplicates any other `glossary*.yaml` in the course.

## Notes / uncertain

- The writer's notes say "7 Mermaid (6 core, 1 honors)". There are 6: two in 17, and one each in 15, 16, 18 and 18h1.
- **Overlap**: the $LDL^T$ part of 18h1 previews what core lesson 39 (la-m9) states ($A = LDL^T$, Cholesky from $\sqrt{D}$). That is consistent and forward-linked, not a contradiction. 21h1 (la-m6) uses permutation matrices without bolding them, as agreed. No other round 2 lesson repeats Schur complements, Sherman–Morrison or partial pivoting (la-m1's earlier pivoting draft was replaced).
- The `−CA⁻¹` label in `la-m5-block-elimination.svg` is 15 px with a superscript. It is readable in the render and was left as is.
