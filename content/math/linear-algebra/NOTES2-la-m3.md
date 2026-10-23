# Round 2 notes: module la-m3 (Vector equations and linear independence)

`content/math/check-module.sh linear-algebra la-m3`: build and checker report zero problems
(6 lessons, 97 questions, 12 drills, 39 cards).

## Added

**Honors lessons** (both `honors: true`, `module: la-m3`, 45 min, about 1,550 and 1,700 words of prose
plus math, figures and diagrams)
- `lessons/11h1-affine-convex.md` (la-m3-h-affine), "Affine and convex combinations": affine
  combinations and the line through two points; affine hull; theorem (with proof) reducing
  "affine combination" to a span question by differences, plus the lifted-vector (row of 1s) form;
  flats, with solution sets of $A\mathbf{x} = \mathbf{b}$ as flats; affine independence (three
  equivalent tests, at most n + 1 points in Rⁿ, affine vs linear independence); barycentric
  coordinates (uniqueness, sign table, area meaning, Möbius 1827, graphics interpolation with the
  perspective-correction simplification labeled); convex combinations, convex hulls, mixtures.
  Examples: point in/not in the plane through three points of R³; barycentric coordinates of
  (4, 4) with an area check; a three-blend fertilizer mix (one feasible target, one outside the hull).
- `lessons/11h2-mod-2.md` (la-m3-h-mod2), "Linear algebra mod 2: Lights Out and error-correcting
  codes": fields; GF(2); spans of p vectors have at most 2ᵖ elements (exactly when independent,
  with proof); row reduction mod 2 and 2ᵏ solutions; Lights Out (Tiger Electronics, 1995) as
  $A\mathbf{x} = \mathbf{b}$ mod 2, quiet patterns as homogeneous solutions; 5 × 5 board rank 23
  (Anderson and Feil, 1998: 1/4 solvable, 4 solutions each), 3 × 3 board full rank; parity bit;
  Hamming(7,4) (Hamming, 1950) with parity-check matrix, codewords as a homogeneous solution set,
  syndrome. Examples: vectors independent over R but dependent mod 2; 3-light puzzle; 5-light
  puzzle with symbolic consistency condition and two solutions; Hamming encode/flip/decode.

**Core lessons 08–11** (additions only; one or two sentences introduce each picture):
- 08: SVG of a plane and a line through the origin and a vector outside the plane
  (la-m3-span-r3); Mermaid flowchart "is b in the span?".
- 09: head-to-tail ```plot of Example 1's column view; Mermaid decision chart "is Ax = b solvable
  for every b?" (09 had no figure before).
- 10: Mermaid flowchart of the parametric-vector-form recipe; SVG of parallel solution planes for
  Ax = 0 and Ax = b with p, v_h and p + v_h (la-m3-solution-sets).
- 11: two-panel SVG, dependent vs independent triples in R³ (la-m3-dependent-independent); Mermaid
  decision chart for independence (quick tests, then row reduction).

**Pictures** (8 original SVGs, 1.5–5 KB each, all rendered and checked; label markers checked on
the blanks): la-m3-span-r3, la-m3-span-r3-blank, la-m3-solution-sets, la-m3-solution-sets-blank,
la-m3-dependent-independent, la-m3-barycentric, la-m3-barycentric-blank, la-m3-lights-out.

**Diagrams** (6 Mermaid, all `flowchart TD`, with accTitle/accDescr, rendered): span test,
solvable-for-every-b, parametric vector form recipe, independence decision chart, linear/affine/
convex combinations, Hamming decoding. Plus 2 new ```plot figures (09 column view; 11h1 line
through p and q).

**Questions** (49 in `questions/r2-la-m3.yaml`)
- Core, la-m3-r2-q01…q20 (5 per lesson; each lesson has a text, a match or order, and a
  select-all): text 6 (q02, q06, q09, q13, q17, q20), match 3 (q05, q07, q16),
  order 2 (q03, q12), label 2 (q01, q11), select-all 4 (q04, q08, q14, q18), MC 3 (q10, q15, q19).
  module_quiz: q02, q05 (L08), q06, q10 (L09), q12 (L10), q16 (L11).
- Honors 11h1, la-m3-r2-h01…h14 (14): MC 8, text 2 (h03, h09), select-all 1 (h06), label 1 (h08),
  match 1 (h11), order 1 (h14).
- Honors 11h2, la-m3-r2-h15…h29 (15): MC 8, text 3 (h16, h21, h27), select-all 2 (h18, h23),
  order 1 (h26), match 1 (h28). No module_quiz on honors questions (core-module honors lessons).
- 4-choice MC answer positions over the file: 0: 5, 1: 5, 2: 4, 3: 5.

**Drills** (4, `drills/r2-la-m3.yaml`): la-m3-r2-affine-weights (weights of an affine combination
in R³), la-m3-r2-bary (barycentric coordinates as exact fractions, with figure), la-m3-r2-lights4
(4-light Lights Out solution mod 2), la-m3-r2-hamming (find the flipped bit from the syndrome).
The bary drill was cross-checked against sympy on ~2,000 random instances; lights4 and hamming
were checked exhaustively (all 16 starts; all 16 × 7 data/error cases).

**Glossary** (15 terms, `glossary-r2-la-m3.yaml`, checked against every glossary*.yaml in the
course, no duplicate terms or aliases): affine combination, affine hull, flat, affinely
independent, barycentric coordinates, convex combination, convex hull, field, GF(2), quiet
pattern, parity bit, parity-check matrix, codeword, Hamming code, syndrome.

**Cards** (23, `cards-r2-la-m3.yaml`): 12 for 11h1 (topics Affine combinations, Convex
combinations), 11 for 11h2 (Linear algebra mod 2, Error-correcting codes).

## For the reviewer
- Every worked example, question key and distractor was computed in Python/sympy (GF(2) ranks
  and solution sets by exhaustive search; 5 × 5 Lights Out rank 23 and 3 × 3 rank 9 recomputed).
- Possible overlap: the honors module la-h1 ("Linear algebra at work") is being written at the same
  time and might also choose coding theory or Lights Out. If it does, one of the two should be
  trimmed; 11h2 is tied to this module's ideas (span = solvable patterns, homogeneous solutions =
  quiet patterns/codewords, independence depends on the field).
- Glossary terms such as convex combination, field or GF(2) could be added by another writer later;
  re-run the duplicate check at merge.
- 11h1 states the area meaning of barycentric coordinates and refers to Module 6 for the proof
  (Cramer's rule + determinant area) rather than proving it.
- Example 3 in 11h1 uses "phosphate (P)" percentages as a plain mixing illustration; real
  fertilizer labels state P as P₂O₅ equivalent, which does not affect the math.
- The SVG perspective drawings are schematic (oblique projection), not to scale.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
- Marlow Anderson and Todd Feil, "Turning Lights Out with Linear Algebra", Mathematics Magazine
  71(4), 1998, 300–303 (via Wikipedia, "Lights Out (game)", which also gives Tiger Electronics, 1995).
- R. W. Hamming, "Error detecting and error correcting codes", Bell System Technical Journal 29(2),
  1950 (standard citation).
- A. F. Möbius, Der barycentrische Calcul, 1827 (standard attribution).
- Affine/convex combinations follow the standard treatment (e.g. Lay, Linear Algebra and Its
  Applications, chapter "The geometry of vector spaces"); all text and examples are original.
