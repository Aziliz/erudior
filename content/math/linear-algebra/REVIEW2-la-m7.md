# Round 2 review, module la-m7 (Vector spaces)

Reviewer for item 68. I reviewed the three honors lessons (26h1, 26h2, 26h3), the round 2 additions to
core lessons 22–26, `questions/r2-la-m7.yaml` (67 questions), `drills/r2-la-m7.yaml` (6 drills),
`glossary-r2-la-m7.yaml` (11 terms), `cards-r2-la-m7.yaml` (30 cards) and the 12 `images/la-m7-*` files.

## Changes

| Where | What was wrong | What I changed | Source |
|---|---|---|---|
| 26h3, "Finding a basis", first bullet | The starting pairs of $r_1^k$ and $r_2^k$ were given as $(1, 1)$ and $(r_1, r_2)$. Those are the *rows* of the Casorati matrix; the starting pairs $(y_0, y_1)$ are $(1, r_1)$ and $(1, r_2)$. (The independence claim was right; the vectors named were wrong.) | "$(1, r_1)$ and $(1, r_2)$" | direct check |
| 26h2, proof of rank–nullity | The theorem is stated for finite-dimensional $V$, and the proof was labeled "for finite-dimensional $W$" with no word on the rest of the theorem. | Added one sentence: if $W$ is infinite-dimensional, replace $W$ by $\operatorname{range} T$, which is spanned by $T(\mathbf{b}_1), \dots, T(\mathbf{b}_n)$ and so is finite-dimensional. The proof now covers the theorem as stated. | Axler, *Linear Algebra Done Right*, 3.22 |
| 26h3, ```plot of $L_0, L_1, L_2, p$ | The labels "L₀" and "p" were drawn on top of each other at the right edge (the two curves both pass through $(2.5, 0.375)$). "L₁" sat on its own curve, on the x-axis and on the tick "2". "(0, 1)" sat on the curve $p$. | Removed the curve labels for $L_0$, $L_1$, $p$ and the point label for $(0, 1)$, and placed them as free `labels` in clear space: L₀ at $(-0.25, 1.75)$, L₁ above the peak of $L_1$ at $(1, 1.15)$, p at $(1.62, 3.0)$, "(0, 1)" at $(-0.3, 0.65)$. Rendered again with preview-plots.mjs: nothing overlaps. | render |
| `la-m7-h-planes.svg` | The label "H ∩ K = Span{(1, 1, 2)}" ran across the right edge of plane H. | The label next to the red line is now just "H ∩ K"; the span moved into a two-line caption ("…meet in the line H ∩ K = Span{(1, 1, 2)}, / so dim(H + K) = 2 + 2 − 1 = 3"). The lesson's alt text still fits. | render |
| `la-m7-four-subspaces.svg` and `-blank.svg` | The "0" label touched the tip of the dashed "sent to 0" arrow. | Moved "0" to the right of the dot. | render |
| q11 markers (`la-m7-pivot-columns-blank.svg`) | Marker 3 (Zero row) sat *below* the pink zero row, outside the matrix, and marker 2 (Pivot position) sat on the gap between a circled 1 and the zero row, so 2 and 3 could be read either way. Markers 1 and 4 covered matrix entries. | Marker 1 → (27.6, 39.5), on shaded column 3 between rows; marker 2 → (80.3, 45.8), centred in the circled pivot of row 2; marker 3 → (76.6, 61.5), inside the pink zero row; marker 4 → (87.6, 39.5), inside the dashed column. Previewed with the markers. | render |

Counts: answer-key errors 0, factual fixes 2 (26h3 starting pairs, 26h2 proof gap), picture fixes 4 (plot labels,
h-planes label, four-subspaces "0", q11 markers), other fixes 0.

## Checked and found right

- **Questions:** I worked all 67 before reading the keys. Every key is right. Every distractor is wrong for the
  reason its explanation gives. Select-all sets (q04, q09, q14, q19, q24, h04, h08, h20, h32, h38) are exact. The
  order questions (q08, q18, h03, h26, h36) have no steps that can be swapped. Every match pairing is unambiguous;
  in h10 the repeated "dim(H + K) = 2" is intended. The text blanks are all integers and are in the order the stem
  asks for (h35 says "smaller root first"). Some I recomputed: q15 (det = 2), q16 (all four grid points in standard
  coordinates), q20, h18, h24, h27, h30 ($L_1(2) = 1$), h31, h37, h38 ($k^2 2^k$ leaves $8 \cdot 2^k$), h40, h41
  (constant 3; 9 leaves 27), h42.
- **Honors lessons, recomputed with sympy:** the RREF in 26h1 Example 2 (pivots 1–4, last columns $(-1,1,1,1)$
  and $(1,0,-1,-2)$); the null space in Example 3 ($(\tfrac12,\tfrac12,\tfrac12,1)$); the rank of 3 in Example 4
  and the check $x_1 - x_2 - x_3 + x_4 = 0$ on all four spanning vectors; 26h2 Examples 1–4, including the
  product of the shift matrices being $I_3$; 26h3 Examples 1–4, $V^{-1}$ for nodes 0, 1, 2, and
  $V^{-1}(1,3,2) = (1, \tfrac72, -\tfrac32)$. The proofs of the exchange lemma, the extension theorem, the
  dimension formula and the uniqueness of direct-sum splitting are correct. So is the repeated-root substitution.
- **Names and terms:** "Steinitz exchange lemma" after Ernst Steinitz (Wikipedia, *Steinitz exchange lemma*). The
  alias "replacement theorem" is Friedberg–Insel–Spence's name. "Grassmann's formula" for
  $\dim(H+K) = \dim H + \dim K - \dim(H\cap K)$ is in ProofWiki (*Grassmann's Identity / Grassmann's Formula*) and
  in university notes. "Auxiliary equation" and "Casorati matrix" are Lay's terms (*Linear Algebra and Its
  Applications*, §4.8). The Casorati test is stated only for two solutions of the same recurrence, where it is an
  equivalence (the map $y \mapsto (y_0, y_1)$ is an isomorphism). The auxiliary equation is the characteristic
  equation of the companion matrix $\begin{bmatrix}0&1\\-b&-a\end{bmatrix}$, as the lesson says.
- **Drills:** I generated 300 instances of each drill with the app's own `generate()` (1,800 in all). I parsed each
  prompt as shown and recomputed every answer independently in sympy: plane intersection by solving with
  $x_3 = 1$, the dimension formula and its minimum, polynomial substitution for the shift, the factored kernel
  $(t-u_1)(t-u_2)$, `interpolate` for the Lagrange weights and value, and the roots plus a 2×2 solve for the
  recurrence. Result: 0 mismatches, and no "+ -", "1x", "0x" glitches. All answers are integers, so exact
  matching is right.
- **Pictures:** I rendered all 7 SVGs and the 6 blanks with their markers. The coordinate grid is exact (origin
  (340, 390), 56 px per unit; the points (1,5), (0,3), (5,1) and (−3,0) sit on grid nodes). The nul-col picture
  matches Example 2: Nul A = Span{(−2, 1)}, Col A = Span{(1, 2, −1)}, and (0, 0, 2) is off the line. In the planes
  picture, the red line lies in both drawn parallelograms (both are spanned by the projected (1, 1, 2) direction
  and one other). Markers on q01, q06, q16, q21 and h15 sit on the parts their labels name.
- **Mermaid:** all 7 render, are readable, and have accTitle/accDescr lines that describe the whole chart. The
  logic is right (the subspace test order, the three bases from one row reduction, the basis-by-count chart, the
  coordinate conversions $P_{\mathcal{C}}^{-1}P_{\mathcal{B}}$).
- **Glossary:** no term or alias duplicates any other `glossary*.yaml` in the course; "characteristic equation of
  a recurrence" does not clash with the existing "characteristic equation". The definitions are correct.
- **Cards:** all 30 are correct.
- `content/math/check-module.sh linear-algebra la-m7`: OK, zero problems.

## Overlap

There is no real overlap with other round 2 lessons in this course. 26h3 uses the Vandermonde matrix as a
change-of-basis matrix. 21h1 (la-m4 honors) computes the Vandermonde *determinant*. The two treatments complement
each other, and neither needs to change. 26h2 points ahead to the B-matrix of lesson 29 rather than repeating it.

## Left uncertain

- The h-planes picture is a schematic oblique projection. I checked that it is self-consistent, but it is not a
  true-angle drawing of the specific planes in Example 3 (the lesson doesn't claim that it is).
