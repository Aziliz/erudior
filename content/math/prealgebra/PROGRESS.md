# Pre-algebra and Arithmetic (math-prealgebra) — progress

Folder: content/math/prealgebra · id prefix `pre-` · 9 modules, 36 lessons.

## Outline

### pre-m1 Whole numbers
1. pre-place-value — Place value, rounding and estimation — drills: pre-digit-value, pre-round-whole
2. pre-whole-ops — Operations with whole numbers — drills: pre-long-division, pre-whole-word
3. pre-order-ops — Exponents and the order of operations — drills: pre-order-ops-1, pre-order-ops-2
4. pre-factors — Factors, multiples, divisibility and primes — drills: pre-count-factors
5. pre-gcf-lcm — Prime factorization, GCF and LCM — drills: pre-prime-factor, pre-gcf, pre-lcm

### pre-m2 Integers
6. pre-integers — Integers, the number line and absolute value — drills: pre-abs-value, pre-int-distance
7. pre-int-addsub — Adding and subtracting integers — drills: pre-int-add, pre-int-sub, pre-temp-change
8. pre-int-muldiv — Multiplying and dividing integers — drills: pre-int-mul-div, pre-int-order

### pre-m3 Fractions
9. pre-frac-basics — Fractions, equivalent fractions and simplifying — drills: pre-frac-simplify, pre-frac-missing
10. pre-frac-muldiv — Multiplying and dividing fractions — drills: pre-frac-mul, pre-frac-div
11. pre-frac-addsub — Adding and subtracting fractions — drills: pre-frac-add, pre-frac-sub
12. pre-mixed — Mixed numbers — drills: pre-mixed-to-improper, pre-mixed-add, pre-mixed-mul

### pre-m4 Decimals, ratios and proportions
13. pre-dec-basics — Decimals: place value, rounding, converting — drills: pre-dec-round, pre-frac-to-dec
14. pre-dec-ops — Operations with decimals — drills: pre-dec-mul, pre-dec-div, pre-dec-money
15. pre-ratio — Ratios, rates and unit rates — drills: pre-ratio-simplify, pre-unit-rate
16. pre-proportion — Proportions — drills: pre-proportion-solve, pre-proportion-word

### pre-m5 Percents
17. pre-pct-basics — Percents, fractions and decimals — drills: pre-pct-convert, pre-pct-to-frac
18. pre-pct-solve — Solving percent problems and percent change — drills: pre-pct-of, pre-pct-what, pre-pct-base, pre-pct-change
19. pre-pct-apps — Tax, tips, discounts, commission and simple interest — drills: pre-discount, pre-tax-tip, pre-simple-interest

### pre-m6 Exponents, roots and scientific notation
20. pre-powers-roots — Powers and square roots — drills: pre-power-eval, pre-sqrt-estimate
21. pre-exp-rules — Exponent rules, zero and negative exponents — drills: pre-exp-rules, pre-neg-exponent
22. pre-sci-notation — Scientific notation — drills: pre-sci-to-standard, pre-sci-multiply

### pre-m7 Variables, expressions and equations
23. pre-expressions — Variables, expressions and evaluating — drills: pre-evaluate, pre-translate
24. pre-simplify — Like terms and the distributive property — drills: pre-combine-like, pre-distribute
25. pre-equations-1 — Solving one- and two-step equations — drills: pre-one-step, pre-two-step
26. pre-equations-2 — Multi-step equations and word problems — drills: pre-multi-step, pre-distribute-solve, pre-eq-word
27. pre-inequalities — Inequalities and number lines — drills: pre-ineq-solve, pre-ineq-flip, pre-ineq-word

### pre-m8 Measurement and geometry
28. pre-units — Measurement and unit conversion — drills: pre-us-convert, pre-metric-convert, pre-dim-analysis
29. pre-angles — Angles, triangles and perimeter — drills: pre-angle-pair, pre-triangle-angle, pre-perimeter
30. pre-area — Area of polygons — drills: pre-area-triangle, pre-area-trapezoid, pre-area-composite
31. pre-circles — Circles — drills: pre-circumference, pre-circle-area
32. pre-volume — Volume and surface area — drills: pre-volume-box, pre-volume-cylinder, pre-surface-box
33. pre-pythagorean — The Pythagorean theorem — drills: pre-hypotenuse, pre-leg

### pre-m9 Data and probability
34. pre-stats — Mean, median, mode and range — drills: pre-mean, pre-median, pre-missing-score
35. pre-graphs — Reading tables and graphs — drills: pre-bar-graph, pre-circle-graph
36. pre-probability — Simple probability — drills: pre-prob-simple, pre-prob-complement, pre-prob-independent

References: pre-ref-arithmetic (number facts, divisibility, fractions/decimals/percents table), pre-ref-algebra (order of ops, exponent rules, equation steps), pre-ref-geometry (units, perimeter/area/volume formulas).

## Status

- [x] course.yaml
- [x] m1  - [x] m2  - [x] m3  - [x] m4  - [x] m5  - [x] m6  - [x] m7  - [x] m8  - [x] m9
- [x] cards  - [x] glossary  - [x] references
- [x] final build + check (build.py and check-course.mts: zero problems)

## Notes

Final counts: 9 modules, 36 lessons (≈900–1,350 words each, 3–9 worked examples), 400 questions
(11–12 per lesson, 115 in module quizzes, correct index spread 101/100/100/99), 87 drills,
196 notecards, 214 glossary terms, 3 reference sheets (pre-ref-arithmetic, pre-ref-algebra,
pre-ref-geometry).

Extra drills beyond the outline: pre-unit-price, pre-distribute-solve, pre-ineq-flip,
pre-ineq-word.

For a reviewer:
- Correct-answer positions were rebalanced by a script that swaps the correct choice into a
  target slot; explanations no longer refer to choice positions.
- pre-ineq-solve / pre-ineq-flip ask for the boundary plus a direction code (1 = greater,
  -1 = less), since the answer format has no inequality type.
- pre-sci-to-standard shows large numbers without thousands separators (sig3 format), e.g. 80100000.
- pre-pct-change excludes values near -15.54% only so the checker's synthetic wrong answer
  (1.5x + 7.77) isn't within tolerance.
- Lesson 33's area proof of the Pythagorean theorem has a two-panel figure.

## Review (2026-10-16)

Independent review of every question (solved before checking the key), lesson, drill (hundreds of generated instances each), card, glossary term and reference sheet. All answer keys were correct. Fixes:

# Review: prealgebra pre-m1..pre-m3 (lessons 01-12, questions m1-m3, drills m1-m3)

Method: solved all 89 questions independently before looking at the keys (all keys matched); read every explanation;
checked every lesson's worked examples, claims and figure specs; generated 200 instances of each of the 26 drills
and recomputed each answer from the prompt as shown (verify.py): 0 mismatches.

## Fixes
1. questions/m2.yaml pre-q-0811 (integer mult/div lesson): the answer was -2.5 lb, a decimal, but decimals aren't
   taught until module 4. Changed the total to -18 lb, so the answer is -3 lb. The new distractors are -108 (multiplied), -12 and 3 (dropped the sign),
   and the explanation now names each mistake.
2. questions/m1.yaml pre-q-0504: the explanation said "The other pairs share 6, 7 and 5 respectively", which is out of
   order with the choices (14&21 share 7, 12&18 share 6). It now names each pair explicitly.
3. questions/m3.yaml pre-q-1011: the explanation used the decimal 10.5 in a fractions lesson. Changed it to $10\tfrac12$.
4. drills/m1.yaml pre-order-ops-2 (module 1, before integers): about 65% of instances had negative answers
   (e.g. (1+1)^2 / 4 - 9*5). Added `where: v >= 0`.

## Checked, no change needed
- Lessons 01-12: all arithmetic in the examples is correct (e.g. 7,385/6 = 1,230 R 5; 84/90 GCF 6, LCM 1,260;
  9/14 x 35/12 = 15/8; 6 1/4 - 2 5/6 = 3 5/12). The figures (factor tree for 84, fraction bars, 2/3-of-4/5 grid,
  1/3 + 1/4 bars, number lines) match the text.
- Mixed-number entry ("8 5/12") is accepted by the mixed-add and mixed-mul drills, as their prompts say.

Build: 0 problems; check-course: OK.

# Review: prealgebra modules pre-m4, pre-m5, pre-m6 (lessons 13-22)

## Method
- Questions: solved all 112 (m4 44, m5 34, m6 34) independently before looking at the keys, then compared. All keys correct, exactly one correct choice each, distractors wrong, explanation arithmetic correct, and each question within its lesson's content. Topics match lesson topics; answer positions are balanced.
- Lessons 13-22: checked every worked example, definition, table and cross-reference to other lessons/modules step by step. Figures (lesson 13 number line, 16 similar triangles, 20 square and number line) match the text. No errors found.
- Drills (24 in m4-m6): generated sample instances and read the prompts and solutions, then ran 400 instances per drill against independent exact-integer answers (scripts: gen.mts, verify.mts, scan.mts in this folder). All answers match, and no dollar amount is parsed as TeX.

## Fixes
1. lessons/15-ratio.md: drill `pre-unit-price` (Better buy by unit price) was defined in drills/m4.yaml but no lesson linked to it. Added it to lesson 15's `drills` list, since it practices that lesson's unit-price section.

## Not changed (style or cosmetic only)
- pre-sci-to-standard prints large numbers without thousands separators (e.g. 214000000), because the sig3 format adds none.
- pre-power-eval shows a positive base in parentheses, e.g. (9)^3.
- pre-pct-change has an odd but harmless `where` clause (`abs(pc + 15.54) > 0.3`).

## Build
`python3 content/math/build.py prealgebra` and `npx tsx tests/check-course.mts samples/math/math-prealgebra.json` both report OK with zero problems.

# Review: prealgebra m7-m9 (lessons 23-36), cards, glossary, references

All 94 questions in m7/m8/m9 were solved independently before the keys were checked. Every key is correct, and each question has exactly one correct choice.
All 36 drills in m7/m8/m9 were generated 3-4 times each, and the answers and solutions were checked. All lesson worked examples and figure specs were checked.

## Fixes
1. questions/m7.yaml pre-q-2406: the explanation named choices by position ("first and third", "last"). Those positions are wrong after the index rebalancing, so the explanation now names the expressions.
2. questions/m7.yaml pre-q-2507: the explanation gave the wrong reason for distractor 54 ("multiplies by 6 before subtracting" actually gives 30). 54 comes from adding 2 (x/6 = 9).
3. questions/m8.yaml pre-q-2909: the stem was ambiguous ("Fencing one side costs $12 per foot ... fence the whole garden"). It now reads "Fencing costs $12 per foot."
4. drills/m8.yaml pre-hypotenuse, pre-circumference, pre-circle-area, pre-volume-cylinder: the solutions used num1, which drops a trailing zero. For example, "≈ 22" appeared where the prompt asks for the nearest tenth (22.0). Changed to dp1.
5. lessons/32-volume.md Example 5: the sandbox example brought in an unstated rule ("sand is sold in whole or half yards") right after "sold by the cubic yard". It is now worded as a conditional.
6. lessons/33-pythagorean.md: added a two-panel shape figure for the area proof. It shows four triangles around the c² square, and the same triangles as two a×b rectangles leaving a² and b². The final step of the text proof is also clearer.

## Checked, no change needed
Cards (196), glossary (214), and all 3 reference sheets: no errors found.

## Notes (not errors)
- pre-median solution doesn't list the sorted values (the expression language has no sort).
- pre-ineq-flip solution doesn't write the final flipped inequality symbol, but it states the reversal and gives the boundary and direction.
- PROGRESS.md still says lesson 33 has no figure (left untouched because it is a shared file).

Build: 0 problems; check-course: OK.
