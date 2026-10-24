# Round 2 review: alg-m3 (Functions and linear functions)

Reviewer for item 2. Scope: the 3 honors lessons (13h1, 13h2, 13h3), the round 2 additions to core lessons 08–13, `questions/r2-alg-m3.yaml` (71 questions), `drills/r2-alg-m3.yaml` (8 drills), `glossary-r2-alg-m3.yaml` (14 terms), `cards-r2-alg-m3.yaml` (29 cards) and the 7 `images/alg-m3-*` SVGs.

Final check: `content/math/check-module.sh algebra1 alg-m3` gives 9 lessons, 143 questions, 22 drills, 60 cards. Result: OK (0 problems).

## Changes

### Answer keys
None needed. I worked all 71 questions before looking at the keys and found no errors (details below).

### Facts and teaching
- **Drill `alg-m3-r2-bracket-tax`, calc `marg`.**
  - Problem: the formula was `if(x <= B1, …)`. When the income lands exactly on a breakpoint, the solution said "the marginal rate, on the next dollar, is 10%". The next dollar is actually taxed at the next bracket's rate. Incomes go up in \$500 steps, so this happens for 20,000, 25,000, 30,000, 60,000, 70,000 and 80,000.
  - Fix: changed to strict `<`, so the stated rate is the one on the next dollar.
- **13h2, "Pieces that join".**
  - Problem: "Billing rules are usually designed to be continuous" overstates it. Many real bills are step functions, such as the parking garage in Lesson 13 and data sold in whole-GB blocks.
  - Fix: now reads "Many billing rules are designed to be continuous."

### Pictures, plots and diagrams
- **11 new `plot` figures had labels sitting on curves or segments.** I rendered every plot with `renderFigure` and the app's CSS. Point labels are drawn up and to the right of the point, and segment labels are centered on the segment, so many of them ran into a rising line or a vertical segment.
  - Fix: I removed the clashing `label`s and placed them with explicit `labels` entries in clear space. Then I re-rendered and checked every plot.
  - Lesson 10, two-triangle plot: (0, 1), (2, 2), (8, 5), "rise 1", "rise 3". "(8, 5)" also clashed with the curve label.
  - Lesson 11, horizontal and vertical lines: "x = 3".
  - Lesson 12, parallel lines: the solid line's slope triangle used to sit where the dashed line crossed its "run" segment. I moved it to the other side of the line, from (−2, 6) down to (−2, 3) and across to (0, 3). The dashed line's triangle now goes from (4, −1) to (6, −1) to (6, −4). Both still show run 2 and rise −3, as the text says. The x-range is now [−4, 8], and the "(0, 3)", "run 2" and "rise −3" labels were placed by hand.
  - 13h1, reflection plot: (−1, −1), (1, 3), (3, 1).
  - 13h1, square root plot: (4, 2).
  - 13h2: the phone plan (both data points and the "breakpoint" label), k = 4 (the point (3, 7)), k = 3 (the point (3, 4)), and the tax function ((20, 2), (60, 10), (75, 14.5) and "average rate").
  - 13h3: the ball ("slope 48", "slope −16", (1, 53)) and the tangent plot ((3, 9), (4, 16), (5, 25)).
- **Lesson 08, Mermaid chart "Deciding whether a relation is a function".**
  - Problem: the six yes/no arrows crossed in the middle of the chart, so the "yes" and "no" labels were hard to match to their arrows.
  - Fix: all three checks now feed one shared question, "Did you find an input with two outputs?", which has one yes branch and one no branch. That is 10 boxes and no crossings. This matches the sentence just before the chart ("They all ask the same question…"). I updated `accDescr` to match.
- **Lesson 13, Mermaid "evaluating a piecewise function".**
  - Problem: the label had a raw `<`, which the round 2 rules forbid because it can vanish.
  - Fix: the label is now "At a boundary, check strict #lt; versus ≤". The preview renders it correctly.

### Other
- **13h1 Example 2 and question h07.**
  - Problem: they wrote the Lesson 8 streaming plan as $C(n)$, but Lesson 8, Example 3 (which 13h1 cites) uses $C(r)$ with $r$ rentals.
  - Fix: both now use $r$. The generic card about "$C(n)$, the cost of $n$ items" is unchanged.
- **Drill `alg-m3-r2-bracket-tax`, solution text.**
  - Problem: the prompt asks for the average rate "as a percent (1 decimal place)", but the solution showed `{avgp:num1}`, which prints "22%" for 22.0.
  - Fix: changed to `{avgp:dp1}`, which prints "22.0%". The answer box is unchanged.

## Checked and found right

- **All 71 questions, worked independently.**
  - Text answers: q02 −5, q07 4, q10 2, q12 −3/4, q16 −7, q20 10, q21 3/4, q25 5, q26 5, h09 5, h10 x / y = x, h23 19000, h24 2, h37 14, h38 8. Each is the only correct answer, and every equivalent form is accepted.
  - Select-all keys: q03, q08, q14, q19, q23, q28, h13, h14, h27, h28, h41, h42.
  - The order questions have exactly one correct order. For q13 the |m| values are 0, ½, 1, 3; for h39 the average rates are −4, 2, 3, 7.
  - Match pairings are unambiguous. In q29 two inputs correctly share "Second piece".
- **Distractor values named in the explanations all check out.** For example: h16 \$132; h21 \$43,333 and \$75,000; h22 \$2,800; h30 75, 45 and 46⅔; h31 −35; h40 64 ft/s (the velocity at t = 0).
- **Every number in the honors lessons, recomputed.** This covers the °C/°F conversions, the examples in all three lessons, the tax amounts at \$75,000, \$59,000, \$61,000, \$50,000 and \$53,333 (rejected), the ball heights and rates, the battery table, the quadratic shortcut $a(p+q)+b$ and its derivation, and the difference quotients.
- **Plot geometry.** The function formulas, points, segments and captions in all new plots are correct, for example $y = 0.5x + 1$ through (8, 5) and the tax function's slopes 0.1, 0.2 and 0.3.
- **SVGs.** I rendered all 7 SVGs and checked them.
  - The mapping diagrams match their alt text.
  - The features curve is $y = -\tfrac12(x+1)(x-5)$. It passes through every point named in the alt text: endpoints (−2, −3.5) closed and (6, −3.5) open, zeros −1 and 5, y-intercept 2.5, maximum (2, 4.5).
  - The domain-range picture shows $-(x-1)^2+4$ on $[-2, 4)$, with the range band [−5, 4].
  - The slope-type panels and the tax bar for \$75,000 (\$2,000 + \$8,000 + \$4,500 = \$14,500, 19.3%) are right.
  - All label markers (q01, q06, q11) sit on the parts their labels name. On q06 the endpoint markers sit beside the dots, so the learner can still see which dot is solid and which is hollow.
  - The features picture has an unmarked dot at the second zero (5, 0). It is a key point, not an endpoint, and it doesn't make any answer ambiguous.
- **Drills.** I generated each drill 3,000 times with `generate`/`checkAll` and recomputed the answers in Python-equivalent code from the raw inputs.
  - Correct answers were always accepted, a wrong value was always rejected, and no placeholder was left unfilled. There was no "+ -" or "1x" in the math.
  - The average-rate tolerance of 0.051 accepts any correctly rounded 1-decimal answer.
  - The arc-quadratic and secant answers are always integers.
- **Mermaid diagrams.** I rendered all 7, and every `accDescr` describes the whole diagram.
- **Glossary.** No term or alias duplicates any `glossary*.yaml` in the course; the closest names are additive/multiplicative inverse and marginal frequency, which are different terms. The definitions are correct, and "continuous" is labeled informal.
- **Cards.** All 29 are correct.
- **Tax claims.** The US federal income tax does use marginal brackets, the schedule is labeled made-up, and the after-tax-income argument is right for a continuous schedule with rates below 100%. The "cliff" caveat about benefits that phase out is appropriately hedged. Sources: Cornell LII Wex, "tax bracket" (https://www.law.cornell.edu/wex/tax_bracket); 26 U.S.C. §1 (rate tables applied to layers of taxable income).

## Overlap

- 13h3 keeps one sentence, "never average the rates of the pieces". This repeats the idea of alg-m1's 05h2 (rates and averages), but 13h3 uses a different example (a battery table and a tank), so I left it.
- Lesson 29 (a1-m7) mentions that √x is the reflection of x² across y = x. That is consistent with 13h1 and not a duplicate lesson.
- No other round 2 lesson in algebra1 covers inverse functions, tax brackets or difference quotients.

## Uncertain or not done

- I couldn't open the IRS brackets page (https://www.irs.gov/filing/federal-income-tax-rates-and-brackets): the permission request timed out. The bracket claim rests on LII and the statute.
- Plot label positions were tuned with the current `renderFigure` layout. If the renderer's sizing or fonts change, I would re-check them.
