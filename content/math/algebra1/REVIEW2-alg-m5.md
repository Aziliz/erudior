# Round 2 review: alg-m5 (Exponents, polynomials, and factoring)

Reviewer for assignment 4. Scope: honors lessons 21h1 and 21h2, the round 2 additions to core
lessons 18–21, `questions/r2-alg-m5.yaml` (49), `drills/r2-alg-m5.yaml` (6),
`glossary-r2-alg-m5.yaml` (13), `cards-r2-alg-m5.yaml` (20), `images/alg-m5-*` (13 files).

`content/math/check-module.sh algebra1 alg-m5` after the fixes: build OK, checker OK (0 problems).

## Changes

| Where | Problem | Change |
|---|---|---|
| 21h1, `plot` of $y = x^3 - 7x + 6$ | The point label "x = 2" (drawn up and to the right of its point) sat on the rising branch of the curve. | Point (2, 0) kept without a label; added a free label "x = 2" at (2.55, −2.6), below the axis where the curve is positive. Re-rendered with `renderFigure`: clear of the curve and the tick numbers. |
| alg-m5-r2-q18 (match) | Stem "the method that factors it" is ambiguous: the ac method also factors $x^2 + 10x + 25$ (and $4x^2 - 49$). | Stem now "Match each polynomial to the method the factoring strategy in this lesson chooses for it", which ties it to lesson 21's decision chart (perfect square checked before sum-product/ac). Key unchanged. |
| alg-m5-r2-h02 | Distractor "remainder $-1$" had no explanation. | Added: it comes from subtracting the wrong way round, $6 - 7$. |
| alg-m5-r2-h03 | Distractors $x^2 + 4$ and $x^2 + 2x - 4$ unexplained. | Added: one leaves out the middle term; the other copies the sign of $-8$ onto the last term. |
| alg-m5-r2-h14 | Distractors $x^2 + 6x + 11$ and $x^2 + 5x + 5$ unexplained. | Added: $x^2 + 5x + 5$ comes from multiplying by the top-row number instead of the one just written below the line ($11 + 6(-1) = 5$, checked); $x^2 + 6x + 11$ drops the last coefficient without dividing. |
| alg-m5-r2-h22 | Distractor 5 unexplained. | Added: leaving out the $2^4$ altogether gives 5. |
| alg-m5-r2-q04 | Explanation said the decimal part "must be at least 1 and less than 10", but the lesson's definition is $1 \le |c| < 10$ (negative numbers allowed). | "…which (ignoring its sign) must be at least 1 and less than 10". |

No answer key was wrong. No factual errors found in the lessons.

## Checked and found right (things a reader might doubt)

- Every question worked by hand before reading the key (49/49); every distractor checked as wrong. Divisions, remainders, factorizations, expansions and binomial coefficients recomputed with sympy (e.g. h07 $P(\pm1), P(\pm2) = 0, 2, 5, -3$; h11 $P(4) = 126$; h27 $1.02^4 = 1.08243216$; h25 $21^2 + 20^2 = 29^2$).
- Order questions have one order only (q02 values $-4 < \tfrac18 < \tfrac13 < 1 < 4$; q10 degrees 0, 1, 2, 3, 5; h06 columns fixed by position; h23 values 5, 6, 10, 15, 20).
- Label/match uniqueness: q16 box (with distractors −5, +2 the top row forces 2x, +5, so the rows are 3x and −2); h18 markers are the middle of row 4 (6), third entry of row 5 (10), third and fourth of row 6 (15, 20).
- Text answers: `textMatches` in `src/lib/questions.ts` now compares fractions and mixed numbers by value, drops spaces, and maps "−" to "-". **The writer's note that `1/2` ≠ `0.5` and `x + 3` ≠ `x+3` is out of date**; it doesn't affect this module (all answers are integers or 5.2).
- Lesson worked examples: 21h1 Examples 1–5 (long division, missing power, synthetic division, $P(-2) = 31$ with quotient $x^3 - 5x^2 + 10x - 18$, factoring $x^3 - 7x + 6$) and 21h2 Examples 1–5 (expansions of $(x + 2)^4$ and $(3x - 2)^4$, coefficient 20,000, Euclid identity, $1.01^5 = 1.0510100501$) all recomputed in sympy.
- Math claims: integer zeros of an integer-coefficient polynomial divide the constant term (correctly labeled as the integer case of the rational root theorem); two polynomials of degree ≤ n agreeing at n + 1 points are identical (labeled as stated without proof; the proof does use the factor theorem); every primitive Pythagorean triple comes from Euclid's formula, legs possibly swapped (labeled "take it on trust").
- History (21h2): Pascal's *Traité du triangle arithmétique* written 1654, published 1665 after his death (1662); al-Karaji about 1000; Jia Xian 11th century; Yang Hui 13th century; "Yang Hui's triangle" in China; Euclid's formula in the *Elements* (Book X, lemma before Prop. 29), about 300 BC. Sources: EBSCO Research Starters, "Pascal's triangle" (https://www.ebsco.com/research-starters/mathematics/pascals-triangle/); USU MATH 5010, "The History of Pascal's Triangle" (https://5010.mathed.usu.edu/Fall2022/EHumes/history.html).
- Pictures: all 13 SVGs rendered with `preview-figure.mjs`, label-question blanks rendered with the questions' markers. Content correct (box method cells $6x^2, 15x, -4x, -10$ with factors 3x, −2 / 2x, +5; GCF area model; synthetic division rows 2, −3, −11, 6 / 6, 9, −6 / 2, 3, −2, 0; long division layout with quotient terms over the right columns; Pascal rows 0–6 with the 4 + 6 = 10 arrows). Text readable, nothing cut off, markers on the named parts.
- Mermaid: all 6 diagrams rendered; content right, `accTitle`/`accDescr` describe the whole diagram, at most 9 boxes, `flowchart TD`.
- Plots and shapes: lesson 18 powers-of-2 plot, lesson 19 grid for $(x - 2)(x^2 + 3x - 4)$ (cells and diagonals right), 21h1 cubic plot rendered with the app's `renderFigure`.
- Drills: each generated 1,000 times; answers recomputed in Python/sympy from the prompt text (quotient and remainder by `sympy.div`, $P(c)$, roots of the cubic, coefficient from the full expansion, $\binom nk$, Euclid triple): 0 mismatches. 500 more per drill through `checkAll`: correct answers accepted, off-by-one answers and swapped cubic zeros rejected. No "+ -", "1x", unfilled placeholders or thousands commas inside math. All answers are integers, so no rounding issues.
- Glossary: no term or alias duplicates any other `glossary*.yaml` in the course (checked by script); every term bolded in 21h1/21h2 has an entry (**identity** already in glossary.yaml). Definitions and cards correct.

## Overlap

- 21h2's "Identities: equal for every value" section and its Mermaid chart (test values → counterexample, else prove by standard form) partly repeat a1-h1 lesson 90 "Proving it with algebra" (counterexamples, identities from Lesson 19's special products, its own counterexample flowchart). 21h2 keeps it short, uses different examples ($(a + b)^3$, $x^3 = x$) and points to lesson 90. Not changed.
- No overlap with other round 2 lessons on polynomial division, Pascal's triangle or the binomial theorem in algebra1 (grepped every NOTES2 and honors lesson).

## Uncertain / left as is

- "Decimal part" for $c$ in $c \times 10^n$ is the course's round 1 term; many books say coefficient or significand, and "decimal part" sometimes means the fractional part (.2 of 3.2). Left alone because round 1 lesson text uses it and q04 needs it distinct from "Coefficient".
- Writer's card-id note (round 2 `cards-r2-*` files sort before `cards.yaml` and shift generated card ids) applies to every writer; not something this module can fix.
