# Review of round 2, module a2-m1 (Functions and their transformations)

Reviewer for item 9. Scope: honors lessons 04h1-symmetry and 04h2-inverses-in-depth, the round 2
additions to core lessons 01–04 (5 SVG pictures, 6 Mermaid charts, the sentences introducing them),
`questions/r2-a2-m1.yaml` (48), `drills/r2-a2-m1.yaml` (5), `glossary-r2-a2-m1.yaml` (9),
`cards-r2-a2-m1.yaml` (18), `images/a2-m1-*` (10).

## Changes

| Where | What was wrong | Change |
|---|---|---|
| 04h1, "Even and odd functions" | "Mix the two kinds and the polynomial is usually neither." It is *always* neither when both kinds have nonzero coefficients (the even/odd split is unique). "Usually" suggests exceptions that don't exist. | "Mix the two kinds (both with nonzero coefficients) and the polynomial is neither." |
| 04h1, "Combining even and odd functions" | "even plus odd is usually neither": same problem. If f is even, g odd and f + g is even, then g = (f + g) − f is both even and odd, so g = 0. | "even plus odd is neither unless one of the two is the zero function" |
| a2-m1-r2-h05 explanation | Same "usually neither" aside. | Same wording as the lesson. |
| a2-m1-r2-h07 explanation | Distractor (2, 11) had no explanation. | Added: adding 3 instead of subtracting gives y = 11. |
| a2-m1-r2-h15 explanation | Distractor 2x − 6 had no explanation. | Added: it repeats the multiplication instead of undoing it. |
| a2-m1-r2-h16 explanation | Distractor ∛((x − 1)/4) + 2 had no explanation. | Added: both undo steps have the wrong sign. |
| a2-m1-r2-h17 explanation | Distractor 1/5 had no explanation. | Added: it treats f⁻¹(5) as the reciprocal of 5. |
| cards-r2-a2-m1, "Self-inverse function" | Listed k/x and (ax + b)/(cx − a) as self-inverse with no conditions. They fail when k = 0 or a² + bc = 0 (then the function is constant). | Added "(k ≠ 0)" and "(a² + bc ≠ 0)", matching the lesson. |
| cards-r2-a2-m1, "Reading f(bx − c)" | "Compress by 1/b" is only a compression when b > 1. | "Scale horizontally by 1/b (a compression when b > 1), then shift right c/b; or shift right c first, then scale." |
| 01-transformations, Mermaid "where is the change?" chart | Boxes said "a·f(x): vertical stretch by a" and "f(bx): compress by 1/b" with no condition, which is wrong for 0 < a < 1 and 0 < b < 1 (the lesson text gets this right). | Boxes now "a·f(x), a > 1: stretch by a" and "f(bx), b > 1: compress by 1/b"; accDescr updated to match. Rendered again and checked. |

No answer key was wrong. Question ids unchanged.

## Checked and found right (a reader might doubt these)

- **Writer's "for the reviewer" items.** (1) "Only the zero function is both even and odd (on a symmetric domain)": correct, since f(x) = f(−x) = −f(x) forces f(x) = 0. (2) The two descriptions of f(2x − 6) in 04h1 "Order matters": compress by ½ then shift right 3 gives f(2(x − 3)); shift right 6 then compress gives f(x − 6) → f(2x − 6). Both correct, and the mixed version, f(2x − 12), is correctly called wrong. The vertical analogue (2f(x) + 6 = "up 3, then stretch by 2") is also right. (3) (ax + b)/(cx − a) is self-inverse when a² + bc ≠ 0: the inverse of (ax + b)/(cx + d) is (dx − b)/(−cx + a) (derived by swap-and-solve), and with d = −a that is (−ax − b)/(−cx + a) = the original; ad − bc ≠ 0 becomes −(a² + bc) ≠ 0. (4) The electricity/water rates are labeled made-up in the lesson and question h25. (5) q10 and q20 stems restate the function.
- **Honors lesson math**, recomputed in Python/sympy: Example 1 parities; Example 2 E = 3x² + 1, O = x³ + 3x; 2^x parts at 1 (1.25, 0.75); Example 3 points (4, −1), (2, 5), domain x ≤ 4, range y ≥ −1; Example 4 midpoint (−1, −3); 04h2 Example 1 h⁻¹(21) = 3; Example 2 f⁻¹(8) = 2, f⁻¹(−7) = −1; Example 3 piecewise inverse and ranges; Example 4 bills (350 and 700 kWh); f(x) = (2x + 1)/(x − 2) with f(3) = 7, f(7) = 3; Example 5 x³ − 3x + 2 = (x − 1)²(x + 2), points (1, 1), (−2, −2); −x³ meets −∛x at x⁹ = x, i.e. x = 0, ±1, giving (0, 0), (1, −1), (−1, 1). The proof that an increasing f meets f⁻¹ only on y = x, the (f∘g)⁻¹ = g⁻¹∘f⁻¹ proof, and the 1/x one-to-one-but-not-monotonic counterexample are all sound. The 04h2 reference to core lesson 04 Example 3 (a = 2, b = 1, c = 1, d = −3, inverse (3x + 1)/(x − 2)) matches that lesson.
- **All 48 questions** worked independently before reading the key: every key right, each select-all set complete and its other choices clearly wrong, each order question has one order (q07 values are −3, −2, −1, 0, 1, all distinct; q12, q17, h13, h28 have fixed step orders), each match unambiguous (h27's distractor "f(1) = f(−1)" is false for every listed function). Text accept lists are complete (h10 accepts 2.125 and 17/8; mixed numbers compare by value). Honors MC answer positions are spread (0–3).
- **Pictures** (all 5 full and 5 blank SVGs rendered, markers overlaid): parabola vertices at (0, 0), (4, 1), (−3, 5), (0, −4) and the curves match their equations; the piecewise graph's join at (−1, 1), closed dot (2, 4), open dot (2, 3) and line 2x + 3 through (−3, −3); arrow diagram values 1, 2, 3 → 4, 7, 10 → −2, 1, 4; √(x − 2) and x² + 2 mirrored across y = x with (6, 2)/(2, 6); even/odd panels (x²/2 − 1 and a cubic with zeros ±2). Every marker sits on the part its label names. Text readable, nothing cut off, all under 20 KB.
- **Mermaid charts** (6): all rendered; content correct; accTitle/accDescr describe the whole diagram.
- **Plots** in 04h1/04h2: every function and labeled point checked (e.g. g(0) = −1, g(−2) = −5; (0, 1) and (1, 0) are the break points of f and f⁻¹). `cbrt` is supported by the figure expression engine.
- **Drills**: generated 400 instances of each of the 5 drills with the app's `generate()` on the built module and recomputed every answer in Python/sympy from the prompt text alone (2,000 instances, 0 mismatches). The shown answer typed back was always accepted, and answer + 1 (or a wrong expression) was always rejected. All answers are exact integers or polynomial expressions, so no rounding issue arises. The prompts and solutions have no unfilled placeholders, "+ −", "1x" or commas inside math. (The tiered drill prints usage such as "1,160" in plain text, outside math, and the checker accepts it.)
- **Glossary**: 9 terms and their aliases don't duplicate any term or alias in any `glossary*.yaml` in the course; definitions correct.
- **Overlap**: no other round 2 lesson in Algebra 2 covers even/odd functions, self-inverse functions, monotonicity or piecewise inverses (checked all NOTES2-*.md and lesson texts). a2-h1 only ties back to lesson 01 for conics; no repetition.

## Left as is / uncertain

- Label question q10: markers 2 and 3 sit exactly on the closed and open dots, so they hide which dot is filled. The question can still be answered from the function in the stem (the upper dot ends the x² piece, which includes x = 2). Moving the markers off the dots would make them point at the line, and "the piece for x > 2" is one of the distractors, so I kept the writer's placement.
- Small cosmetic points not changed: in the parabola-family picture the "−4" y-tick label is partly under the vertex dot; the inverse-composite drill's solution says "adds -12" and "subtract -12" when k is negative (correct, but awkward).
- Sources: standard algebra (even/odd functions and transformations as in OpenStax *Precalculus 2e*, "Transformation of Functions"); every claim here was checked by derivation and sympy rather than by looking it up, so no outside text was needed for the fixes.

## Checker

`content/math/check-module.sh algebra2 a2-m1`: OK, zero problems after the fixes.
