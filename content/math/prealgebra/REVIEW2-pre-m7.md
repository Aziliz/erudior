# Round 2 review: pre-m7 (Variables, expressions and equations)

Reviewer for item 100. I reviewed the round 2 work on its own: 3 honors lessons (29h1, 29h2, 29h3), the additions to core lessons 23–29, `questions/r2-pre-m7.yaml` (78 questions), `drills/r2-pre-m7.yaml` (7 drills), `glossary-r2-pre-m7.yaml` (10 terms), `cards-r2-pre-m7.yaml` (25 cards) and `images/pre-m7-*` (6 SVGs).

## Changes

| Where | What was wrong | What I changed |
|---|---|---|
| 23-expressions.md, Mermaid "How to evaluate an expression" | The lesson says "the steps always come in the same order", but the chart went straight from substituting to powers. It left out grouping symbols, so a learner following it would square before working inside parentheses, as in $2(x - 1)^2$ (question q05) or the fraction bar in Example 2. | Added the step "Work inside grouping symbols: parentheses, above and below a fraction bar" between substituting and powers. Updated accDescr to describe five steps. Re-rendered it. |
| 29h1-systems.md, Example 1 plot | The label "y = -x + 5" sat on the dashed line at the right edge. | Removed the function label and put a free label at (4.5, 1.9), beside the dashed line and clear of everything else. |
| 29h1-systems.md, Example 6 plot (parallel lines) | The label "2x + 4y = 15" sat on the dashed line and on the x-axis next to the axis letter. The label "x + 2y = 4" touched the end of the solid line. | Replaced both with free labels: "2x + 4y = 15" above the dashed line at (5.5, 3.4), and "x + 2y = 4" below the solid line at (-2.2, 0.9). |
| 29h3-line-equations.md, candle plot | The point label "(9.6, 0)" ran into the x-axis title "t (hours)" and hid part of it. | Removed the point's label and placed "(9.6, 0)" as a free label at (10.5, 2.6). |
| 29h2-absolute-value.md, Common mistakes | "Distributing a number into the bars" mislabeled the first example, $\lvert x - 2\rvert + 3 \ne \lvert x + 1\rvert$, which involves addition, not distribution. | Changed it to "Moving a number or a sign into the bars". |

After the fixes, `content/math/check-module.sh prealgebra pre-m7` reports OK with 0 problems.

## Checked and found right

- **All 78 questions.** I worked each one before reading the key. Every key is correct, and so is every distractor's explanation, for example:
  - h11: "first by 4, second by 6" gives $16y$ and $-36y$; "$-3$ and 2" gives $-12y$ and $-12y$.
  - h21: $-\tfrac73 < x \le \tfrac{11}{3}$ comes from subtracting 2 from the middle only.
  - q10: $3x - 9$ comes from computing $5 - 2$ first.
  - q25: 10 lb of each tea gives \$7.50 a pound.
  - h31: $\tfrac13 x + \tfrac{14}{3}$ is the line with slope $\tfrac13$ through $(1, 5)$.
  - Every select-all has the right set. Every order question has one possible order: q05, q09, q13, q16, q21, q29, q35, h07, h23 and h35 each have a single dependency chain.
  - Match items are unambiguous. q19 and h34 reuse an answer, which the format allows.
  - The text accept lists cover the natural forms: q06 lists the reordered forms; q26 lists `<=`, `≤` and `=<`; q32 and h32 are fractions, compared by value.
- **Label markers.** I rendered both blank SVGs with the questions' markers. In q01, markers 1–4 sit on the 3, the x, the exponent 2 and the 8, and marker 5 sits on the bracket under −5x. In q31, they sit on the x-axis, the y-axis, the origin, (4, 0), (0, 3) and the Quadrant II region. The coordinate-plane line really has intercepts (4, 0) and (0, 3) on the 30 px grid, so its slope is −3/4. The balance has 3 boxes and 5 cubes on the left and 20 cubes on the right. The distribute figure and the expression-parts figure match their alt text. All six SVGs are original, small, and use text of 16 px or larger.
- **Drills.** I generated 300 instances of each of the 7 drills with `src/lib/drills.ts`. For each one I parsed the prompt as displayed and solved it independently with sympy: the systems with `solve`, the absolute value equation by splitting, the compound and absolute value inequalities with `solveset` (comparing the interval type too: `[L, U)` and `(L, U)`), and the two line drills as expressions. That gave 2,100 instances and 0 mismatches. All answers are integers or exact expressions, so no rounding tolerance is needed. No "+ -", "- -" or "1x" appears.
- **Lessons.**
  - I recomputed every worked example: systems Examples 1–7, absolute value Examples 1–7 (including the wrong split $x = -\tfrac{13}{3}$), and lines Examples 1–6 (including the −40 crossover and candle burnout at $t = 9.6$).
  - The core Example 8 figure: $w = 8$, length 20, perimeter 56.
  - Cross-references hold: Lesson 6 defines absolute value; Lesson 27 has the 30-coin, \$5.10 jar; Lesson 28 ends with $-1 \le x < 3$; Lesson 23 has $F = \tfrac95 C + 32$; Lesson 29 has $y = \tfrac34 x - 2$; Example 5 in Lesson 25 is $3x + 5 = 20$.
  - The Mermaid absolute value chart is correct for $c = 0$ as well. $\lvert u\rvert < 0$ gives the empty set $0 < u < 0$, and $\lvert u\rvert > 0$ gives $u \ne 0$.
- **Facts.**
  - Water freezes at 0 °C (32 °F) and boils at 100 °C (212 °F) at standard pressure, which gives $F = \tfrac95 C + 32$ (NIST SP 811, Appendix B.9 conversion). The lesson says "at sea level", which is fine for this level.
  - *The Nine Chapters on the Mathematical Art*: the commonly cited compilation is around the 1st century BCE to 1st century CE, with Liu Hui's commentary in 263 CE. Chapter 8 (fangcheng) solves linear systems by column operations on counting-rod arrays. So "final form roughly 2,000 years ago", hedged as uncertain, is accurate (MacTutor, "Nine chapters on the mathematical art"; Katz, *A History of Mathematics*, ch. 7).
  - The perpendicular-slope argument is labeled as a sketch, as it should be. The rotation picture matches the text: (3, 2) turns to (−2, 3), with the right angle at the origin.
- **Figures and diagrams.** I rendered every new plot, shape and numberline block with `preview-plots.mjs`, and all 10 new Mermaid diagrams with `preview-figure.mjs`. Apart from the label fixes above, all are readable, nothing is cut off, and every accDescr describes the whole chart.
- **Glossary and cards.**
  - No term or alias duplicates another glossary file. "absolute value equation" is in pre-m2's file, and "parallel" and "perpendicular" are in `glossary.yaml`. 29h2 and 29h3 bold these terms without redefining them, and the existing definitions fit.
  - All 25 cards are correct.

## Overlap

- 29h2 overlaps the pre-m2 honors lesson `08h2-distance-abs.md`. That lesson already teaches $|x - a| = d$ and $|x - a| \le d$ as distance. 29h2's Example 5, $|x - 4| \le 2.5$, and question h24 (oven within 15 °F) repeat that "within" idea. The writer flagged this, and 29h2 points back to 08h2. The new material (a general linear $u$, isolating first, "or" inequalities, compound inequalities with a negative divisor) is not in 08h2.
- Core Lesson 28 already has a short "Compound inequalities" section. 29h2 extends it rather than repeating it.

## Left uncertain or cosmetic (not changed)

- The elimination drill sometimes says "multiply the first equation by $1$" (or $-1$) when $|a_2| = 1$. This is correct, just slightly wordy.
- The two-point drill's solution writes positive numbers in parentheses, as in $\dfrac{11 - (3)}{9 - (3)}$. This is correct.
- The 29h2 number line for $|x - 3| = 5$ marks the center 3 with an open circle, and the caption explains it.

## Counts

- Answer-key errors: 0
- Factual fixes: 1 (the evaluation-order chart in Lesson 23 was missing grouping symbols)
- Picture fixes: 3 (plot labels: two in 29h1, one in 29h3)
- Other fixes: 1 (the Common-mistakes wording in 29h2)
