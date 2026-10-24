# Review of round 2, alg-m6 (Quadratic equations and functions)

Reviewer for item 5. Scope: honors lessons 27h1 (Vieta), 27h2 (quadratic inequalities), 27h3
(history and golden ratio); the additions to core lessons 22–27 (found by diffing against the
pre-round-2 build `samples/math/math-algebra1.json`); `questions/r2-alg-m6.yaml` (69),
`drills/r2-alg-m6.yaml` (8), `glossary-r2-alg-m6.yaml` (9), `cards-r2-alg-m6.yaml` (26) and the
14 `images/alg-m6-*` SVGs. `content/math/check-module.sh algebra1 alg-m6`: OK, zero problems after
the fixes.

## Changes

| Where | Problem | Fix | Source |
|---|---|---|---|
| 27h1, "Building an equation from a sum and a product" | Said the max-product fact was "Lesson 26's result that, for a fixed sum, the product is largest when the two numbers are equal". Lesson 26 never states that; its only two-number problem is "differ by 10, minimize the product". | Stated the fact in its own right and tied it to what Lesson 26 does say (line 87: with fence on all four sides, the best rectangle is a square). | Lesson 26 text |
| 27h1, intro | "Lesson 22 ended by running the factoring method backward": that section is not the end of Lesson 22 (the garden application follows). | "Lesson 22 also ran the factoring method backward". | Lesson 22 text |
| 27h1, signs-of-roots Mermaid `accDescr` | "the sum minus b/a decides it" reads as a subtraction. | "the sum, minus b over a, decides it". | — |
| 27h3, intro | "That picture is close to four thousand years old" states as fact the cut-and-paste reading that the lesson itself later labels a debated reconstruction (Høyrup). | "The idea behind that picture may be close to four thousand years old." | Høyrup, *Algebra in Cuneiform*, BM 13901 #1 |
| `alg-m6-parabola-parts.svg` (Lesson 25 picture) | The label "vertex (3, −4)" sat on the rising right branch of the parabola. | Moved the label down 16 px (y 376 to 392), below the curve; re-rendered and checked. | preview |
| Drill `alg-m6-r2-quad-ineq-inside`, solution | "two numbers with product {c} and sum {b} give the roots p and q": the numbers with that sum and product are −p and −q, not the roots. A learner could take the wrong signs from it. | Solution now shows the factorization, e.g. $x^2 - 14x + 45 = (x - 5)(x - 9)$, so the roots are 5 and 9 (new calc values `np`, `nq`). | — |
| Drill `alg-m6-r2-khwarizmi`, solution | Negative root shown only as an unevaluated "$-19 - 7$". | Now "$x = -19 - 7 = -26$" (new calc value `neg`). | — |

No answer key was wrong.

## Checked and found right (things a reader might doubt)

- **All 69 questions worked independently before reading the keys.** Every key is right; every
  select-all has only right answers listed and clearly wrong others; every order question has one
  order only (q08 and q14 items show the divided-by-a form, so "divide" must come before "move
  the constant"; h11's sum step uses $s = -3$, so it must follow the product step). Match answers
  that repeat (q18 "(2, 5)", h23 "x < 1 or x > 4") are intentional and correct.
- q11 / q26 distractors that pair a right picture name with a wrong sign ("Two real roots
  (D < 0)", "Tangent line (D > 0)") are clearly wrong. q22 accepts 1.5 and 3/2; h35 accepts 16.2
  and 16.18 ($10\varphi = 16.180\ldots$). q25: $h = 52$ at $t = 1, 3$, peak 68 ft at $t = 2$,
  landing $t \approx 4.06$ s.
- **Drills**: generated 400 instances of each and recomputed every answer in Python/sympy from the
  prompt text as shown (roots by `solve`, not from the drill's variables): 0 mismatches. 1,000 more
  per drill through `checkAll`: exact fractions and integers accepted, value + 1 rejected, swapped
  answer boxes rejected; for golden-cut, both correctly rounded 2-decimal answers and the
  "shorter = L − rounded longer" answer accepted (tolerance 0.006), ±0.02 rejected. No "+ -",
  "- -", "1x", "+ 0", thousands commas or unfilled placeholders in any prompt or solution.
- **Lesson numbers recomputed**: Ex. 6 of 27h1 roots $-6.14, 1.14$ and $1.46, 7.54$; Ex. 3
  $\tfrac{3 \pm \sqrt7}{2}$, $r^2 + s^2 = 8$; Ex. 7 $2.618^2 + 0.382^2 = 7$; 27h2 Ex. 5 ($1 < t < 3$,
  $h(2) = 69$), Ex. 6 ($R(n) = 10000 + 100n - 20n^2$, matches Lesson 26); Ex. 4 roots $2 \pm \sqrt5$
  (matches Lesson 24 Ex. 2); 27h3 Ex. 5 ($-5 + 5\sqrt5 = 6.180$, $3.820$); Fibonacci ratios
  1.6, 1.625, 1.615, 1.619; the golden-rectangle SVG strip is 0.617 of the square's width.
- **History (27h3)**: BM 13901 #1 ("area plus side = 0;45", recipe halve 1, square 0;15, add,
  root 1, subtract 0;30) per Høyrup's translation; Old Babylonian period ≈ 2000–1600 BCE. Euclid
  *Elements* II.4 statement; extreme and mean ratio (VI Def. 3, VI.30). Brahmagupta (628) rule
  $x = \tfrac{\sqrt{4ac + b^2} - b}{2a}$ for $ax^2 + bx = c$ (MacTutor biography's translation of
  *Brāhmasphuṭasiddhānta* 18.44). al-Khwarizmi c. 820 in Baghdad, six types, $x^2 + 10x = 39$ with
  the four $2\tfrac12$-by-$x$ rectangles and four $6\tfrac14$ corners, $x^2 + 21 = 10x$ with both 3
  and 7 given, and "impossible" when $(b/2)^2 < c$ (MacTutor; Harvard Math 21a exhibit). "Three
  roots and four equal a square" (h30) is in fact al-Khwarizmi's own example, so "in the style of"
  is safe. Viète 1591 (*In artem analyticem isagoge*, letters for knowns too); Descartes 1637
  *La Géométrie* ($x, y, z$ unknowns, $a, b, c$ knowns). Viète's dates 1540–1603. Golden-ratio
  "fact and fiction" claims are suitably hedged ("often", "mixed results").
- **Core-lesson additions** (Mermaid in 22–27, garden `shape` in 22, area model in 23,
  discriminant picture and method chart in 24, parabola picture and sketch checklist in 25,
  optimization chart and river-fence area plot in 26, system chart in 27): content correct; the
  plot $-2x^2 + 240x$ peaks at (60, 7200) and returns to 0 at $x = 120$; all `accTitle`/`accDescr`
  describe the whole diagram. All 9 Mermaid diagrams rendered and were read.
- **Pictures**: all 14 SVGs rendered; label markers checked against their `labels` for q06, q11,
  q16, q21, q26, h36: each marker sits on the part named. The khwarizmi figure is not to scale
  ($x = 3$ vs $2\tfrac12$), which is normal for a schematic.
- **Plots** in 27h1/27h2: the "x = sum ÷ 2 = 5" label at (8.6, −2.5) is well clear of the curve
  (the curve is at $y = -2.5$ only near $x = 6.2$).
- **Glossary**: no term or alias duplicates any `glossary*.yaml` in the course; definitions right.
  Cards right.

## Overlap

No real duplication with other round 2 lessons. Light, complementary contact: a1-h1 Lesson 91
(equivalence) also warns that $x^2 = 9$ has two solutions, and alg-m2's honors lessons treat
$|x| > 3$; 27h2's "$x > \pm 3$" section is about the inequality and links back to Lesson 7, so both
can stay.

## Left uncertain

Nothing that affects accuracy. The interpretive points (Høyrup's cut-and-paste reading, the
"geometric algebra" reading of Euclid II) are labeled as interpretations in the lesson.

## Sources

- MacTutor, "Al-Khwarizmi and quadratic equations": https://mathshistory.st-andrews.ac.uk/Extras/Al-Khwarizmi_quadratics
- MacTutor biography of Brahmagupta (quadratic rule translation): https://mathshistory.st-andrews.ac.uk/Biographies/Brahmagupta/
- Harvard Math 21a exhibit, completion of squares: https://people.math.harvard.edu/archive/21a_fall_05/exhibits/completion/index.html
- J. Høyrup, *Algebra in Cuneiform* (2017), BM 13901 #1.
- Euclid, *Elements* II.4, VI Def. 3, VI.30 (Heath translation).
