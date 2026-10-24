# Round 2 review: la-m1 (Bridge: vectors, systems and matrices)

Reviewed: honors lessons `03h1-vector-geometry.md` and `03h2-leontief.md`; round 2 additions to
01-plane-vectors, 02-elimination, 03-matrix-arithmetic; `questions/r2-la-m1.yaml` (41 questions),
`drills/r2-la-m1.yaml` (5 drills), `glossary-r2-la-m1.yaml` (14 terms), `cards-r2-la-m1.yaml`
(20 cards), 10 SVGs `images/la-m1-*`, 5 Mermaid diagrams, 4 new plot/shape blocks.
`content/math/check-module.sh linear-algebra la-m1` reports zero problems after the fixes.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| `la-m1-r2-q10` (match) | Stem said "elimination on a system"; for an overdetermined system (e.g. $x+y=2$, $x-y=0$, $2x=2$) a row $0 = 0$ with no contradiction still leaves exactly one solution, so the pairing "0 = 0 → infinitely many" was not always true. | Stem now says "a system with as many equations as unknowns" (the setting of the lesson's 3×3 chart). |
| `la-m1-r2-q14` (order) | "Swap and negate" and "Divide every entry by $ad - bc$" commute (dividing $A$ first and then swapping/negating gives the same matrix), so the order had two defensible answers. | Step now reads "Divide every entry of that new matrix by $ad - bc = 1$", which fixes it after the swap step. |
| 03h2, after Example 1 | "even though households only want \$90 billion": the lesson defines final demand as households, government and exports. | "even though final demand is only \$90 billion of goods in total". |
| 03h2, Rounds of production | "the entries of $C\mathbf{v}$ add up to at most $s$ times the entries of $\mathbf{v}$" compared a sum with a vector. | "...at most $s$ times the sum of the entries of $\mathbf{v}$". |
| 01-plane-vectors, multiples-of-v plot | The $2\mathbf{v}$ arrow ended on the x-axis, its arrowhead sitting on the tick label 4. | Moved $2\mathbf{v}$ to (1, −2.5)→(5, −0.5) and $0.5\mathbf{v}$ to (5, 1.5)→(6, 2); same vectors, nothing touches an axis. |
| 03h1, Example 1 plot | Point labels P and "R (2/3 of the way)" sat on the segment. | Points unlabeled; labels placed off the line with `labels`. |
| 03h1, Varignon shape | Labels P and S sat on the dashed sides. | Points unlabeled; P, Q, R, S placed outside the parallelogram with `labels`. |
| `drills/r2-la-m1.yaml` header comment | Still said "03h2 sensitive systems" (the writer's discarded topic). | Now "03h2 Leontief input-output model". |

## Checked and right (a reader might doubt)

- Every question worked independently before reading the key; all 41 keys right, all
  distractor explanations name the real mistake (e.g. h04's $(9,7) = \mathbf{b}+\mathbf{c}-\mathbf{a}$ is
  the order ABDC; h21's $(55.6, 142.9)$ divides by the diagonal of $I-C$; h24's $(18, 26)$ is
  $\mathbf{d} + C^T\mathbf{d}$).
- h17 claims: $\begin{bmatrix}0.6&0.1\\0.5&0.2\end{bmatrix}$ fails the column test but is productive
  ($\det(I-C) = 0.27$, inverse $\frac{1}{0.27}\begin{bmatrix}0.8&0.1\\0.5&0.4\end{bmatrix} > 0$);
  $\begin{bmatrix}0.7&0.2\\0.2&0.9\end{bmatrix}$ has $\det(I-C) = -0.01$ and an all-negative inverse. Both true.
- h25 / lesson: $C = \begin{bmatrix}0.5&0.6\\0.7&0.5\end{bmatrix}$, $\det(I-C) = -0.17$, $\mathbf{d} = (17,17)$ gives $(-110, -120)$.
- 03h2 numbers: Example 1 $(110, 70)$, Leontief inverse, Example 2 $(8, 16)$, rounds 60, 84, 97.2, 103.56, 106.79, 108.39, 109.2, 109.6 (the bar plot heights), Example 4 $(100, 120, 80)$ with every elimination line and all three rows checked.
- "Column sums < 1 is sufficient, not necessary" and "production is at least $\mathbf{d}$" are correctly labeled/true for nonnegative productive $C$; the series argument is labeled as a sketch.
- Varignon: the proof shows $\overrightarrow{PQ} = \overrightarrow{SR}$; the claim it also holds for non-convex (simple) quadrilaterals is standard. Numeric check $(4, 2.5)$ right.
- Matrix product picture: $AB = \begin{bmatrix}13&19\\7&13\end{bmatrix}$ recomputed.
- All 10 SVGs rendered: geometry right (vector 4:3 triangle, centroid triangle midpoints and $G$ at the exact average, Leontief arrows point in the direction goods flow, matching $c_{12}=0.40$, $c_{21}=0.30$), text readable, every label marker on the part its label names.
- 5 Mermaid diagrams rendered and readable, accTitle/accDescr describe the whole diagram.
- Drills: 500 instances of each generated with the app's `generate()`; answers recomputed in Python with exact fractions from the prompt text (Leontief $\mathbf{d}$ parsed back and re-solved): 0 mismatches. Exact fraction answers accepted, value+1 rejected, 2- and 3-dp answers accepted for the two Leontief drills (tolerance 0.01 / 0.006); all generated economies have $\mathbf{d} > 0$ and positive production; no unfilled placeholders, "+ -" or thousands commas.
- Glossary: no term or alias duplicates any other `glossary*.yaml` in the course; every bolded term in the honors lessons has an entry.
- History: Hamilton quaternions 1843, Grassmann *Ausdehnungslehre* 1844, Gibbs and Heaviside vector analysis in the 1880s, Varignon 1654–1722, Leontief 1905–1999 and the 1973 Nobel Memorial Prize in Economic Sciences for the input–output method (nobelprize.org, Leontief facts page; MacTutor for Varignon/Grassmann/Hamilton).

## Overlap

No other lesson in the course covers the Leontief model (la-m5's notes confirm the earlier
conditioning version was dropped). 03h1 touches the same "weights adding to 1" idea as la-m3's
`11h1-affine-convex.md`, as the writer noted; light and from a different angle (plane geometry
proofs), so no change.

## Left uncertain

- The Leontief SVG's final-demand box reads "households, exports" (government omitted for space);
  the lesson text lists all three, so I left it.
- `la-m1-r2-q12` marker 3 sits on the edge of the green box next to the 7; the 7 stays readable.
