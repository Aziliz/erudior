# Round 2 notes: alg-m5 (Exponents, polynomials, and factoring)

`content/math/check-module.sh algebra1 alg-m5`: build OK, checker OK (0 problems).

## Honors lessons (2)

| File | Id | Title | Words | Qs | Drills |
|---|---|---|---|---|---|
| 21h1-polynomial-division.md | alg-m5-h-polynomial-division | Dividing polynomials, the remainder theorem and the factor theorem | ~2,000 | 15 (h01–h15) | alg-m5-r2-synthetic, alg-m5-r2-remainder, alg-m5-r2-cubic-roots |
| 21h2-binomial-expansion.md | alg-m5-h-binomial-expansion | Pascal's triangle, binomial expansion and polynomial identities | ~1,750 | 14 (h16–h29) | alg-m5-r2-binomial-coef, alg-m5-r2-pascal-entry, alg-m5-r2-euclid-triple |

- 21h1: dividing by a monomial; long division (numbers, then polynomials); the division algorithm; missing powers; synthetic division and why it adds; the remainder theorem (with proof); the factor theorem (both directions); integer zeros divide the constant term (labeled as the integer case of the rational root theorem); factoring cubics. 5 worked examples.
- 21h2: the pattern in $(a+b)^n$; Pascal's triangle and why the addition rule works; binomial coefficients as counts, $\binom nk = \frac{n!}{k!(n-k)!}$; the binomial theorem; identities vs equations (counterexamples, why a few values aren't a proof, plus the "n + 1 values" fact stated without proof); Euclid's formula for Pythagorean triples; binomial estimate of $1.01^5$. 5 worked examples.
- Topic choice: rational exponents (listed as an optional gap in VERIFY.md) was left alone because the a1-m7 writer covers it (32h2-rational-exponents.md). Polynomial division was the other VERIFY.md optional gap.

## Core lessons (additions only)

| Lesson | Added |
|---|---|
| 18 exponent rules | `plot` of powers of 2 from $2^{-3}$ to $2^3$ (why $2^0 = 1$ and negative exponents halve); Mermaid routine for simplifying exponent expressions; SVG naming the parts of $7x^4$ and $3.2 \times 10^{-5}$ |
| 19 polynomial operations | SVG naming the parts of $4x^5 - 2x^3 - x + 9$ (the lesson's own example); `shape` grid for Example 2, $(x - 2)(x^2 + 3x - 4)$; Mermaid "which way to multiply" decision chart |
| 20 GCF and grouping | SVG area model $6x^2 + 9x = 3x(2x + 3)$ (with a one-sentence intro); Mermaid grouping procedure with the "binomials don't match" loop |
| 21 trinomials | SVG box method for Example 3, $6x^2 + 11x - 10$, with two sentences on choosing the row sign; Mermaid factoring-strategy decision chart |

## Questions: `questions/r2-alg-m5.yaml` (49)

- Core (20, alg-m5-r2-q01–q20, 5 per lesson): 4 text, 4 order, 4 match, 4 label, 4 select-all. Module quiz: q01, q04, q06, q08, q11, q14, q16, q18 (2 per lesson).
- Honors 21h1 (15): 9 multiple choice, 2 text, 1 order, 1 match, 1 label, 1 select-all.
- Honors 21h2 (14): 8 multiple choice, 2 text, 1 order, 1 match, 1 label, 1 select-all.
- Single-answer correct positions across the 17 multiple-choice questions: 4 / 4 / 4 / 5.
- Every key and distractor was checked with sympy (divisions, factorizations, expansions, $P(c)$ values, binomial coefficients).

## Pictures (`images/`, 13 files, all under 8 KB, previewed)

alg-m5-power-parts(-blank), alg-m5-poly-parts(-blank), alg-m5-gcf-area(-blank), alg-m5-box-method(-blank), alg-m5-synthetic(-blank), alg-m5-pascal(-blank), alg-m5-long-division. The blank copies carry a leader line ending in an empty circle (or an empty cell) where each marker goes. Marker positions were computed from the same coordinates that drew the parts and checked with `--markers`. Generator: /tmp/r2-alg-m5/gen/make_svgs.py.

Mermaid diagrams: 6 (lessons 18, 19, 20, 21, 21h1, 21h2), all `flowchart TD` with accTitle/accDescr, at most 9 boxes. Other figures: 3 (plot in 18, shape grid in 19, plot of $x^3 - 7x + 6$ in 21h1).

## Drills: `drills/r2-alg-m5.yaml` (6, honors only)

alg-m5-r2-synthetic (quotient + remainder), -remainder, -cubic-roots (other two zeros, smaller first), -binomial-coef, -pascal-entry, -euclid-triple. Each was generated 1,500 times (tsx, `generate` + `checkAll` on the built JSON) against an independent recomputation from the displayed numbers. The right answers were accepted, and an off-by-one answer (and the swapped root order) was rejected. Text was scanned for "+ -", "+ 0", "1x" and unfilled placeholders. Answers are all integers, so no rounding issues.

## Glossary and cards

- `glossary-r2-alg-m5.yaml` (13): dividend, divisor, quotient, remainder, division algorithm, polynomial long division, synthetic division, remainder theorem, factor theorem, Pascal's triangle, binomial coefficient, binomial theorem, Pythagorean triple. **identity** is bolded in 21h2 but already exists in glossary.yaml. Every glossary file was grepped first.
- `cards-r2-alg-m5.yaml` (20): 10 for each honors lesson (topics Polynomial division, Binomial expansion, Polynomial identities).

## For a reviewer

- **Possible duplicate "remainder":** 05h1-decimals-and-proof.md (alg-m1 writer) also bolds **remainder**. When I last checked there was no glossary-r2-alg-m1.yaml. My entry covers both whole numbers and polynomials. If alg-m1 adds one too, keep one.
- **Overlap with a1-h1 lesson 90 ("Proving it with algebra"):** it teaches counterexamples and identities. 21h2 keeps that part short and points to it. "counterexample" is italic, not bolded, and has no glossary entry from me. 21h2 uses $(a+b)^3$ as its counterexample example so it doesn't repeat lesson 90's $(a+b)^2$.
- **Card ids:** build.py reads `cards*.yaml` in sorted order, and `cards-r2-…` sorts before `cards.yaml`. Every round-2 cards file therefore shifts the generated ids (c1, c2, …) of the existing cards. This affects all writers; it is not specific to this module.
- **Text-answer matching:** `textMatches` (src/lib/questions.ts) compares plain decimals by value but treats `1/2` as text, and it keeps inner spaces (`x + 3` ≠ `x+3`). ROUND2.md says `1/2` and `0.5` are equal automatically, which the code doesn't do. All my text answers are integers or a decimal (5.2, −6), so they are unaffected.
- **Engine limitation (known):** the synthetic-division quotient box is an expression answer, so any equivalent form is accepted. That's harmless here.
- **History in 21h2:** Pascal wrote his treatise in 1654 (published 1665, after his death); al-Karaji around 1000; Jia Xian 11th century; Yang Hui 13th century; Euclid's formula in the *Elements* (about 300 BC). Kept to century-level claims.
- **Stated without proof (and labeled as such):** two polynomials of degree at most $n$ that agree at $n + 1$ values are identical; every primitive Pythagorean triple comes from Euclid's formula (legs possibly swapped).

## Errors found in existing content

None in alg-m5's lessons, questions, drills, cards or glossary.

## Sources

- EBSCO Research Starters, "Pascal's triangle" (Pascal's treatise written 1654, published 1665; Jia Xian, Yang Hui, Omar Khayyam): https://www.ebsco.com/research-starters/mathematics/pascals-triangle/
- Utah State University MATH 5010 student page, "The History of Pascal's Triangle" (al-Karaji, 11th century; Jia Xian; Yang Hui c. 1238–1298): https://5010.mathed.usu.edu/Fall2022/EHumes/history.html
- Standard results (division algorithm, remainder and factor theorems, binomial theorem, Euclid's formula): checked against the course's own conventions and recomputed in sympy.
