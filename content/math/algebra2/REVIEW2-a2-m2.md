# Round 2 review: module a2-m2 (Complex numbers, quadratics, and systems)

Reviewer for item 10. Scope: honors lessons 09h1, 09h2, 09h3; round 2 additions to core lessons
05–09; `questions/r2-a2-m2.yaml` (65), `drills/r2-a2-m2.yaml` (7), `glossary-r2-a2-m2.yaml` (14),
`cards-r2-a2-m2.yaml` (30), `images/a2-m2-*` (10 SVGs). After the fixes,
`content/math/check-module.sh algebra2 a2-m2` reports `OK` (8 lessons, 122 questions, 21 drills,
52 cards).

## Changes

| Where | Problem | Change |
|---|---|---|
| `lessons/08-three-variables.md`, the paragraph that introduces the planes picture | "like the three sides of a tent with no floor": a tent with no floor has only two long sides, so the comparison doesn't match the triangular-tube case (three planes meeting in pairs along three parallel lines). | Now reads "like the three long faces of a triangular prism (the two sloping sides and the floor of a ridge tent)". |
| `a2-m2-r2-q19` explanation | Same tent comparison. | Now reads "like the three long faces of a triangular prism". |
| `lessons/09h1-complex-plane.md`, "Adding is sliding" | Said equality in $\lvert z + w\rvert \le \lvert z\rvert + \lvert w\rvert$ holds "only when $z$ and $w$ point in the same direction". It also holds when one of them is 0, which has no direction. | Added "(or one of them is 0)". |
| `cards-r2-a2-m2.yaml`, "Triangle inequality" card | Same missing case. | Added "(or one is 0)". |

No question ids changed. No answer key was wrong.

## Checked and found right

- **All 65 questions** worked by hand before reading the keys. Numeric ones were recomputed in
  sympy: h16 product, h17 ($2A - B$ and the three distractors, which really are $2(A - B)$,
  $A - 2B$, $2A + B$), h20 inverse, h21 determinants (12, −2, −1, 0), h22 decoding (GO), h28
  Cramer, h30 (9), h32 (−20, so area 10), h35 ($2k - 14$, so $k = 7$), h37 (−7, −6, 0, 5: distinct,
  so there is only one order), h40 ($D = 9$, $D_z = 27$, $D_x = 9$, $D_y = 18$). Every select-all
  set (q04, q08, q14, q19, q24, h12, h26, h38) has every keyed choice right and every other choice
  clearly wrong. All order questions (q05, q09, q12, q17, q22, h25, h37) have one possible order.
  The text answers accept the ASCII and Unicode minus signs, and q10 lists the common spellings of
  $-2 - 5i$. The distractor explanations name real mistakes (for example, in h01, 17 adds the parts
  without signs and 7 adds them with signs).
- **Lesson numbers** (sympy): 09h1 Examples 1–5 ($(1+2i)(2+3i) = -4+7i$, $(1+2i)(2-3i) = 8+i$,
  $(3+4i)(1+i) = -1+7i$, roots of $z^2 - 3z + 3 - i$ are $2+i$ and $1-i$, $(2+i)^3 = 2+11i$,
  $1/(3-4i) = 3/25 + 4i/25$). 09h2: bakery sums and differences, $QP$ = [[13.90, 13.70],
  [21.30, 21.70]], the two non-commuting products, $A^{-1}$ in Example 3 and both right-hand sides
  in Example 4, the MATH encoding (27, 14, 48, 28) and $K^{-1}$. 09h3: Example 2 (25), Example 3
  ($D = 7$, $D_x = 7$, $D_y = 14$, $D_z = 21$), triangle area (19, so 9.5), the collinear example,
  the box-subtraction area argument for the pictured columns (12 − 3 − 2 − 2 = 5), $20! \approx
  2.43 \times 10^{18}$ and $\tfrac13 \cdot 20^3 \approx 2{,}667$ ("about 2,700").
- **Proof of $|zw| = |z||w|$** and the Brahmagupta–Fibonacci identity: algebra correct. The
  square-root method (sign of $q$ pairs the signs of $x$ and $y$) is correct.
- **History** (checked from my knowledge of the standard accounts, the MacTutor History of
  Mathematics biographies and Katz, *A History of Mathematics*; I did not open them in this
  session, so these are not independently re-verified sources): *Ars Magna* 1545 and the "divide 10 into two parts with product 40"
  problem, with Cardano calling the result useless; Bombelli's *L'Algebra* (1572) and
  $x^3 = 15x + 4$; Descartes' "imaginary" (*La Géométrie*, 1637); Wessel (paper of 1797,
  published 1799), Argand (1806), Gauss (1831 publication, so "the 1830s" is fair); Cramer 1750;
  Maclaurin's *Treatise of Algebra* published 1748, two years after his death; Seki 1683;
  Leibniz 1693; Lester Hill's cipher, *American Mathematical Monthly* 1929. The identity's
  appearance in Diophantus (*Arithmetica* III.19) is the standard attribution. "About two centuries
  later" (h09, 1572 to 1799) is fair.
- **Hedges are present** where needed: operation counts are stated as orders of magnitude, the area
  argument is limited to the pictured arrangement, the Hill-cipher example is labeled simplified
  and insecure, and the lesson 06 method chart is labeled a rule of thumb.
- **Drills**: generated with the app's own `generate()` from `src/lib/drills.ts` and rendered
  prompts and solutions read (no unfilled placeholders, "+ -" or "1x"). Separately, a few thousand
  instances of each drill were recomputed in Python from the prompt: modulus and distance, the
  complex square root with positive real part (cross-checked against `sympy.sqrt`), 2 × 2 sum and
  product, Cramer 2 × 2 against `sympy.solve` (exact fractions), 3 × 3 determinant against
  `Matrix.det`, and triangle area against the shoelace formula. 0 mismatches. Modulus tolerance
  0.006 accepts every correctly rounded 2-decimal answer, and `sqrt(…)` entries are accepted per
  COURSE_FORMAT. The triangle area is a whole or half-integer and `tolerance: 0` compares by value,
  so 9.5 and 19/2 both pass.
- **Pictures**: all 5 full SVGs and 5 blanks rendered with their question markers and read. The
  geometry is right. In the line-circle picture, the panel 2 line is exactly tangent (distance from
  the center 61.99 against a radius of 62), the panel 1 intersection points lie on the circle, and
  the panel 3 line misses it (distance 84). The modulus triangle has legs 4 and 3, and the conjugate
  is reflected correctly. In the augmented matrix the entries match the system. The i-cycle arrows
  run counterclockwise. Every marker sits on the part its label names. q11's markers sit at the
  circle centers and q16's 4th marker sits inside the prism, because each panel as a whole is what
  is labeled. No text overlaps, nothing is cut off, and all files are under 4 KB.
- **Mermaid** (6): all rendered and read. Content is right, `accTitle`/`accDescr` describe the whole
  diagram, and the TD layout is readable.
- **Plots**: functions and points check out. In lesson 06, $x^2 - 2x + c$ with D = 16, 0, −8, and
  the zeros $1 \pm i\sqrt2$ in the caption. The 09h1 parallelogram and quarter-turn points
  ($iz = -1 + 3i$, $i^2z = -3 - i$, $i^3z = 1 - 3i$) are right. The 09h3 parallelogram has
  determinant 5, and its "area 5" label sits in the interior, off the edges.
- **Glossary/cards**: definitions correct, with no duplicate terms or aliases (the module build
  loads every glossary file without complaint). "modulus" is defined here, which settles the
  question raised in NOTES2-a2-h1.

## Overlap with other round 2 lessons

- a2-h1 lesson 92 (polar form) also has a plot of repeated multiplication by $i$ and a
  modulus/argument drill (`a2-h1-r2-modulus-argument`). This is a mild overlap with 09h1's
  quarter-turn plot and `a2-m2-r2-modulus`. The two lessons divide the topic on purpose: 09h1
  covers the modulus, 92 the angle, and each points to the other. Nothing to fix.
- No other algebra2 round 2 notes cover matrices, determinants or Cramer's rule.

## Left uncertain

- Nothing material. The prism panel of the planes picture is schematic, not a true 3-D drawing,
  but it reads correctly and its alt text explains it.
