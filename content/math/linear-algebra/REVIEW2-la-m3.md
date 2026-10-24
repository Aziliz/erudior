# Round 2 review: module la-m3 (Vector equations and linear independence)

Reviewer, independent of the writer. Scope: honors lessons 11h1 and 11h2, round 2 additions to
core lessons 08–11, `questions/r2-la-m3.yaml` (49), `drills/r2-la-m3.yaml` (4),
`glossary-r2-la-m3.yaml` (15), `cards-r2-la-m3.yaml` (23), `images/la-m3-*` (8).
`content/math/check-module.sh linear-algebra la-m3` after fixes: OK, zero problems.

## Changes

| Where | Problem | Fix |
|---|---|---|
| 09 plot (column view of Example 1) | Labels "a₁" (on the x-axis tick "1"), "2a₂" (touching its segment) and "Ax = (−3, 7)" (on the dashed segment) overlapped lines | Removed the segment labels, placed them with `labels` beside the segments; re-rendered, clear |
| 11h1 plot (line through p and q) | All five point labels and the segment label sat on the line (point labels go up-right, the line has positive slope) | Moved every label below-right or above-left of the line with `labels`; y-range to 5.5 for room; re-rendered, clear |
| 11h1 "Affine combinations" | "The linear combinations sp + tq … fill a whole plane through the origin" is false when p, q are multiples of each other | Added "when p and q are not multiples of each other (as in the picture below)" |
| la-m3-r2-h14 explanation | "the signed fraction of the triangle's area cut off by that edge" is vague and doesn't match the lesson's area statement | Now: signed area of triangle y v₂ v₃ as a fraction of the whole triangle's area, negative across edge v₂v₃ |
| la-m3-r2-h09 accept | "one-third" not accepted | Added `one-third` |
| card "5 × 5 Lights Out" | Said "rank 23"; rank isn't taught until Module 7 and the lesson says "23 pivots" | Now "23 pivots mod 2" |
| drill la-m3-r2-bary | p could coincide with a vertex (e.g. p = v₁ = (1, 1)), putting the "p" and "vᵢ" figure labels on top of each other | Added `where` conditions keeping p off the three vertices |

Counts: answer-key errors 0; factual fixes 1 (11h1 plane claim); picture fixes 2 (two plots);
other fixes 4 (h14 explanation, h09 accept, card wording, bary drill).

## Checked and found right

- Every one of the 49 questions worked independently before reading the key; all keys,
  select-all sets, order questions (unique orders) and match/label pairings are correct.
  Distractor explanations name real mistakes.
- Worked examples recomputed: 11h1 Example 1 (y = 2v₁ + v₂ − 2v₃; z gives pivot −4/5 in last
  column), Example 2 (1/4, 3/8, 3/8; areas 16 and 4), Example 3 (2/15, 8/15, 1/3 and 17/15,
  −7/15, 1/3; N and P checks). 11h2 Examples 1–4 including the symbolic 5-light reduction
  (condition b₁ + b₂ + b₄ + b₅ = 0, solutions (1,1,0,0,0) and (0,0,0,1,1), quiet pattern
  (1,1,0,1,1)) and Hamming encode/decode.
- GF(2) ranks recomputed in Python: 5 × 5 Lights Out matrix rank 23, 3 × 3 rank 9, 1 × 5 row rank
  4, 1 × 3 row rank 3.
- Drills: lights4 formula verified for all 16 starts (unique solution each); hamming verified for
  all 16 data × 7 error positions (syndrome = flipped position); bary checked against sympy on
  ~3,000 random instances; affine-weights is exact by construction (differences required
  non-parallel). All answers exact integers/fractions.
- Barycentric SVG: the drawn points are exactly the stated combinations of the drawn vertices
  (p = (1/4, 3/8, 3/8), m = (0, 1/2, 1/2), q = (−1/2, 1, 1/2)); label markers for h08 on the right
  parts. The figure is an affine image of Example 2's triangle, not the same coordinates, which is
  fine because barycentric coordinates are affine-invariant.
- Solution-sets SVG: the dashed p → p + v_h arrow is parallel and equal to v_h. Span SVG,
  dependent/independent SVG and Lights Out SVG (press 1 then 2 clears light 3) correct. All label
  markers (q01, q11, h08) sit on the named parts.
- All 6 Mermaid diagrams rendered: content correct, accTitle/accDescr describe the whole
  diagram. The independence chart (lesson 11) has two crossing edges near the bottom whose "no"
  labels sit close together; I tried reordering and Mermaid still crosses them. The arrows are
  traceable, so I left it.
- Facts and attributions: Lights Out by Tiger Electronics, 1995; Anderson and Feil, "Turning
  Lights Out with Linear Algebra", Mathematics Magazine 71(4), 1998 (1/4 of patterns solvable,
  4 solutions each); R. W. Hamming, Bell System Technical Journal 29(2), 1950, at Bell Labs;
  Möbius, Der barycentrische Calcul, 1827; integers mod n form a field exactly when n is prime;
  the barycentric area interpretation (signed areas). Sources: Wikipedia "Lights Out (game)",
  "Hamming(7,4)", "Barycentric coordinate system"; Lay, Linear Algebra and Its Applications,
  "The geometry of vector spaces".
- Glossary: no term or alias duplicates any other `glossary*.yaml` in the course (grepped all).

## Overlap

- la-h1's writer explicitly dropped a Hamming-code lesson in favour of 11h2 (NOTES2-la-h1.md), so
  no duplication there.
- 21h2 (determinant geometry, la-m6) mentions the orientation test for "is a point inside a
  triangle" and convex hulls in one sentence; 11h1 refers forward to Module 6 for the area proof.
  They are complementary, not repeated.

## Left as is / uncertain

- 11h1 Example 3 writes "phosphate (P)"; real fertilizer labels give P as P₂O₅ equivalent. The
  writer flagged this; it is a mixing illustration and the math is unaffected.
- q07 (match): "A has a pivot in every row" also implies "this particular system has at least one
  solution", but the intended pairing is clearly the most specific one, and each answer has one
  best match.
