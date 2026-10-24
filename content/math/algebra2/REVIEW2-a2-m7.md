# Algebra 2 module a2-m7 (Sequences and series), round 2: review

Reviewer for assignment 15. Scope: honors lessons 24h1 and 24h2, the round 2 additions to lessons 23
and 24, `questions/r2-a2-m7.yaml` (40), `drills/r2-a2-m7.yaml` (6), `glossary-r2-a2-m7.yaml` (10),
`cards-r2-a2-m7.yaml` (19), `images/a2-m7-*` (4).

## Changes

| Where | Problem | Fix |
|---|---|---|
| a2-m7-r2-h20 (order) | Steps "Add the interest to the balance" and "Subtract the monthly payment" could be swapped and still give the same balance (B + iB − M = B − M + iB), so the order was not unique. | Replaced those two steps with "Find the principal part: the payment minus that interest" and "Subtract the principal part from the balance". Each step now depends on the one before (as in the lesson's amortization table). Explanation rewritten to show $B_{k-1} - (M - iB_{k-1}) = (1 + i)B_{k-1} - M$. |
| a2-m7-r2-h07 (order) | "Add both sides from k = 1 to n" could be read as coming before the expansion, since the lesson itself telescopes first and expands second. | Reworded to "Add both sides of that identity from k = 1 to k = n", which ties it to the expanded identity in step 1. |
| a2-m7-r2-h13 | Distractor 165 had no explanation. | Added: 165 comes from subtracting the sum up to 9 (45), which wrongly keeps the 10. |
| 24h2, amortization plot | The two curve labels ("balance" and "straight line, for comparison") are both placed at the right end of their curves, and both curves end at (60, 0), so the labels were drawn on top of each other and on the curves (checked by rendering the figure with `src/lib/figure.ts`). | Removed the curve labels and placed free labels "loan balance (solid)" at (44, 12500) and "straight line (dashed)" at (15, 9500), clear of both curves. Re-rendered and looked at it. |
| images/a2-m7-halving.svg | The "1/32" leader line ran along y = 310, exactly on top of the line between the two smallest white pieces, which hid that line. The leftover region looked like one piece (the alt text says two), and the leader crossing it made it unclear which piece was 1/32. | Moved the "1/32" label below the square with a vertical leader and a dot inside the purple piece. "and so on…" stays to the right with a short leader that starts outside the square. Caption moved down 10 px. Re-rendered. The blank copy was already correct and is unchanged. |
| 24-geometric-sequences, Mermaid chart | Label `Is \|r\| < 1?` had a raw `<`, which ROUND2.md says can disappear in rendering. | Changed to "Is \|r\| less than 1?". |
| drill a2-m7-r2-loan-payment, solution | The solution said "60 × $111.04 ≈ $6,662.49", but 60 × 111.04 = 6,662.40. The total had been computed from the unrounded payment, so a student checking the multiplication would find a mismatch. | Changed to "{n} payments of about {M}, which is about {tot} using the unrounded payment". The answer and tolerance are unchanged. |

Counts: answer-key errors 0; factual fixes 0; picture fixes 2 (halving SVG, loan plot labels);
other fixes 5 (2 order questions, 1 distractor explanation, 1 Mermaid label, 1 drill solution line).

## Checked and found right

- **All 40 questions worked independently before reading the keys.** Every key is right. Numbers I recomputed in Python include: 402, 225, 5/11, the order 1 < 1.5 < 2 < 8/3, 25/9, 18, 650, 225, 385, 49/50, 9/10, 155 (with the 144 and 165 distractors), A = 2 for third differences of 12, L = 20 / 125 / 120, a₃ = 14, FV = 15,363.20 (annuity due 15,424.65, lump sum 19,374.33), M = 344.08 (simple-interest distractor 372.50), 1,199.10 for a 30-year mortgage at 6% (principal 199.10), M = 537.86 for 18,000 over 36 months (36 × 537.86 = 19,362.96), and ln 4 / ln 1.05 = 28.41.
- **h03:** each wrong formula gives a₁ = 3 but a₂ = 9, 9 or 8, as the explanation says.
- **h19 (match):** the four cases map to one outcome each. "c = 0" alone doesn't settle whether the terms converge, so it can't be matched to "approach".
- **Label markers:** q04 (staircase) and q10 (halving) each land inside the part their label names. Checked by rendering with the markers on. Staircase rows are 1–5 blue and 5–1 yellow, and the picture is 5 × 6.
- **24h1:** the telescoping derivation is right step by step: 3S = (n+1)³ − (n+1) − 3n(n+1)/2 = (n+1)·n(2n+1)/2. So are the first difference 2An + A + B, mth differences = m!·A, and every worked example (n² + n + 1, n(n−1)/2 and 190, 385, 8290, 2485, 99/100). The ratio of neighbouring terms of 1/(k(k+1)) is k/(k+2). Circle regions C(n,4) + C(n,2) + 1 = 1, 2, 4, 8, 16, 31, 57, and the lesson states the assumption that no three chords meet at one point. "Nicomachus's theorem" is a standard name for Σk³ = (Σk)².
- **24h2:** medication terms 260, 278, 283.4, 285.02, L = 285.71, (0.3)⁶ = 0.000729 (so a₇ is within 0.07 mg). Fish pond: L = 3000, n = 11.53, about 147 fish after 11 years. Annuity: FV = 200,903, and most of the interest comes in the last decade (84,495 of 128,903). Loan: M = 463.99, interest 3,839.23 unrounded or 3,839.40 from the rounded payment. The first three amortization rows match exactly with cent rounding. B₂₄ = 27,051.83 − 11,800.17 = 15,252 (63.5%, "about 64%"). B₃₀ / 24,000 = 53.7%, which matches "about 54%" in h26. The payment and future value formulas are the standard ones (OpenStax College Algebra 2e §13.4 and introductory finance texts). The simplified models (medication, fish pond) are labeled as such, and the switch to a₀ indexing is stated in the lesson.
- **Drills:** 300 instances of each were generated with `src/lib/drills.ts` `generate()`. Each answer was recomputed independently in Python from the prompt text: sums by brute force, the fixed point and a₄ with exact fractions, the annuity by month-by-month iteration, and the loan payment by bisection on the month-by-month balance. 0 mismatches out of 1,800. Correctly rounded answers are accepted in every instance: a₄ to 2 dp, FV to the dollar, the payment to the cent, and interest to the dollar, including interest computed from the rounded payment. Answers 2 or more off are rejected. For the expression drill, the right polynomial is accepted and a constant off by 1 is rejected. There are no unfilled placeholders, no "+ -", no "1n", and no thousands commas inside math.
- **Mermaid (4):** all rendered and read. The content is right and each accDescr covers the whole chart.
- **Plots:** the 24h1 parabola and the 24h2 medication plot were rendered with the app's figure code. Their labels sit beside the curves, not on them.
- **Glossary and cards:** definitions are right. No term or alias duplicates any `glossary*.yaml` in the course. "telescoping sum" is now defined in `glossary-r2-a2-m5.yaml`, which resolves the writer's open item.
- `content/math/check-module.sh algebra2 a2-m7`: OK, zero problems after the fixes.

## Overlap

- 24h1's section "Telescoping a fraction sum" repeats the Σ 1/(k(k+1)) = n/(n+1) example from a2-m5's honors lesson 19h2 (partial fractions). 24h1 cross-references 19h2 and adds the infinite-series remark. This is minor and was left as is.
- No other round 2 lesson in Algebra 2 covers finite differences, recurrences, annuities or loans.

## Uncertain

- Nothing in the content. The plot preview needed my own CSS (the app styles figures with its stylesheet), so the exact pixel spacing in the app may differ slightly. The new label positions leave a wide margin from both curves.
