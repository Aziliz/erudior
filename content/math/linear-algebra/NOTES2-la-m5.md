# Round 2 notes: module la-m5 (Matrix algebra)

`content/math/check-module.sh linear-algebra la-m5`: build and checker report zero problems
(6 lessons, 100 questions, 17 drills, 44 cards, 295 terms, 4 refs).

## Added

**Honors lessons** (both `honors: true`, `module: la-m5`, 45 min, ref `la-ref-factor`)
- `lessons/18h1-pivoting-ldu.md` (la-m5-h-pivoting-ldu), "Row exchanges, PA = LU and the LDU
  factorization", about 1,700 words of prose (2,700 counting math and diagrams). Permutation
  matrices ($PA$ vs $AP$, $P^{-1} = P^T$ with proof, $n!$ of them); why
  $\begin{bmatrix} 0 & 1 \\ 1 & 1\end{bmatrix}$ has no LU; the $PA = LU$ theorem and the rule
  that multipliers move with their rows; partial pivoting ($|\ell| \le 1$, library default,
  $2^{n-1}$ worst-case growth labeled rare); LDU, its uniqueness proof, and $A = LDL^T$ for
  symmetric $A$ (links forward to lesson 39). 5 examples: a 3-cycle permutation and its inverse;
  a forced mid-way swap with $PA = LU$ and a full solve with $P\mathbf{b}$; 3-digit rounding
  with and without a swap (labeled as a simplified model of floating point); partial pivoting on
  a 3×3 with two swaps; LDU of the lesson-18 matrix and $LDL^T$ of a symmetric 3×3. Diagram:
  "which triangular factorization" decision chart (Mermaid).
- `lessons/18h2-block-elimination.md` (la-m5-h-block-elimination), "Block elimination, Schur
  complements and rank-one updates", about 1,260 words of prose (1,960 total). Column–row
  (outer product) expansion of $AB$; block upper triangular inverse derived from block
  equations; block elimination, the Schur complement, block LU, invertibility of $M$ ⟺ $S$
  (with the null-vector proof), solving block systems, and ordinary elimination as the 1×1
  case (checked against the lesson-18 matrix); the Sherman–Morrison formula with proof, cost,
  singular case, history (Sherman and Morrison 1949–50, Woodbury 1950, Haynsworth's 1968 name for
  the Schur complement). 3 examples: outer-product expansion; a 3×3 block solve; updating the
  lesson-16 inverse after $a_{33}$ changes. Picture: `la-m5-block-elimination.svg`.

**Core lessons** (additions only: a sentence or two plus the figure, nothing rewritten)
- 15 matrix operations: row–column picture with size rule (SVG `la-m5-row-column`), composition
  diagram $\mathbb{R}^p \to \mathbb{R}^n \to \mathbb{R}^m$ (Mermaid).
- 16 inverse: shear and inverse shear (`plot`), "find the inverse or detect singularity" decision
  chart (Mermaid) with a one-line reminder that a single system doesn't need $A^{-1}$.
- 17 IMT: elementary-matrix chain $A \to E_1A \to \cdots \to I$ (Mermaid), IMT structure diagram
  (n pivots → pivot in every column / every row → the three statements of each) (Mermaid).
- 18 LU: shape of $L$ and $U$ (SVG `la-m5-lu-shape`), "when to use LU" chart (Mermaid).

**Pictures** (5 original SVGs in `images/`, 4–8 KB, all rendered and looked at):
la-m5-row-column, la-m5-row-column-blank, la-m5-lu-shape, la-m5-lu-shape-blank,
la-m5-block-elimination. Blank copies are for the two label questions; marker positions come
from the generator's coordinates and were checked with `--markers`. Generator:
`/tmp/r2-la-m5/gen/svgs.py` (scratch).

**Diagrams**: 7 Mermaid (6 core, 1 honors), all with accTitle/accDescr, rendered; 1 new `plot`.

**Questions** (`questions/r2-la-m5.yaml`, 48)
- Core, la-m5-r2-q01…q20 (5 per lesson): label 2 (q01, q16), text 5 (q02, q06, q14, q15, q18),
  order 4 (q03, q07, q11, q17), match 4 (q05, q09, q12, q20), select-all 4 (q04, q08, q13, q19),
  MC 1 (q10). module_quiz: q01, q03 (15), q06, q07 (16), q12, q15 (17), q16, q18 (18).
- Honors 18h1, la-m5-r2-h01…h14: 9 MC, 2 text, 1 order, 1 select-all, 1 match.
- Honors 18h2, la-m5-r2-h15…h28: 8 MC, 3 text, 1 order, 1 select-all, 1 match.
- The 18 four-choice MC answers are spread 0: 5, 1: 4, 2: 5, 3: 4.

**Drills** (`drills/r2-la-m5.yaml`, 6): la-m5-r2-plu, la-m5-r2-plu-solve, la-m5-r2-ldlt (18h1);
la-m5-r2-block-inv, la-m5-r2-schur, la-m5-r2-sherman (18h2). 400 instances of each were
generated from the built JSON with `generate()` and every answer recomputed independently with
sympy (elimination with forced swaps and $P A = LU$ check, `solve`, `LUdecomposition` with
$LDL^T$ check, full inverses of $M$ and of the updated $A'$, Schur complement vs $\det M$):
2,400 instances, 0 mismatches. Fraction answers use `kind: fraction, lowestTerms`.

**Glossary** (`glossary-r2-la-m5.yaml`, 11): permutation matrix, partial pivoting, LDU factorization, LDLᵀ factorization, outer
product, column–row expansion, block upper triangular, Schur complement, block LU
factorization, rank-one update, Sherman–Morrison formula. **Cards** (`cards-r2-la-m5.yaml`,
23): 11 "Pivoting and LDU", 12 "Block elimination".

## For the reviewer

- **Glossary ownership.** While I worked, the la-m1 and la-m2 writers both had round-off /
  partial pivoting honors lessons (03h2, 07h2) defining **partial pivoting**; both have since
  been replaced (now 03h2-leontief, 07h2-iterative-methods), and la-m6's 21h1 no longer bolds
  **permutation matrix**. So `glossary-r2-la-m5.yaml` now defines both terms (11 entries), and
  18h1 teaches the 3-digit rounding example itself. If an earlier module brings back a
  definition of either term, one copy must go.
- History in 18h2: Sherman–Morrison dates and names from Wikipedia (1949 abstract, 1950 Annals
  of Math. Stat. paper; the page notes earlier appearances, which the lesson says); Haynsworth
  1968 from Wikipedia's Schur complement page. Not confirmed from a fetched source: Woodbury's
  1950 report (Max A. Woodbury, "Inverting modified matrices", Princeton) and the 1917 date of
  Schur's paper (it appears in that page's references; standard accounts give it). "Kalman filter is
  usually derived with its higher-rank version" is a hedged general statement.
- Partial pivoting's $2^{n-1}$ growth bound (Wilkinson) and "default in LAPACK and the
  MATLAB/NumPy/R solvers built on it" are standard but not fetched from a source this round.
- 18h1 Example 4's $P$ is deliberately the same matrix as Example 1 (rows 3, 1, 2).

## Errors found in existing content

None in la-m5's lessons, questions, drills, cards or glossary.

## Sources

Wikipedia, "Sherman–Morrison formula" and "Schur complement" (history only). All mathematics
standard; every example, question and drill answer recomputed with sympy.
