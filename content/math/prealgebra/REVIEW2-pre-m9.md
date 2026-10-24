# Round 2 review: pre-m9 (Data and probability)

Reviewed: honors lessons 38h1 (MAD, quartiles, box plots) and 38h2 (tree diagrams, dependent events, expected value), the additions to core lessons 36–38, `questions/r2-pre-m9.yaml` (45), `drills/r2-pre-m9.yaml` (6), `glossary-r2-pre-m9.yaml` (20), `cards-r2-pre-m9.yaml` (21), and the 15 `images/pre-m9-*` files.

## Changes

| Where | Problem | Fix |
|---|---|---|
| 38h2, spinner-game ```plot | The bar labels "+1" and "+3" were drawn on top of the axis tick labels 1 and 3 (garbled), and the point label "expected value -0.5" sat on the x-axis title. | Removed the bar labels (the ticks already show −3, 1, 3); the expected value is now a label in the empty upper left with an arrow to the dot at −0.5; x range widened to [−4, 5] and x title shortened to "Net gain (dollars)" so it no longer crosses the +3 bar. Rendered and checked. |
| pre-m9-r2-q08 (match) | "Monthly rainfall in one city over a year" → Line graph only. Monthly rainfall is very often shown as a bar graph, so the pairing was arguable. | Now "How a city's average temperature changed month by month over a year" (clearly change over time, matching Lesson 37's line-graph example); explanation says why. |
| pre-m9-r2-h13 (explanation) | "P's laps are usually within about 0.8 s of 60 s": a MAD of 0.8 is an average distance, not a bound most laps fall within. | "P's laps are typically about 0.8 s from 60 s, while Q's are typically about 3.5 s away." |
| 38h1, "Mean absolute deviation" (factual) | Standard deviation described only as "squares the deviations instead of taking absolute values", which omits the square root. | Added "(and takes a square root at the end to get back to the original units)". |
| 38h1, Example 6 | "The rule is stricter than the eye" could be read as the rule flagging *more* values; the point is the opposite. | "The rule is more cautious than the eye: it flags fewer values." |
| 38h1, quartile convention | "the one most school courses use": unverifiable. | "many school courses". |
| 38, "Which rule when" Mermaid | Edge "one event" → favorable ÷ total omitted the equally-likely condition (the accDescr had it). | Edge now reads "one event, equally likely outcomes". Re-rendered. |

## Checked and right
- All 45 questions worked before reading the keys: every key is right. Order questions (q02 3<5<8<17; q11; q16 1, 2, 3, 5, 6 of 36; h09; h20 6, 20, 30, 50 of 56) have one order only. Select-all sets (q04, q10, q15, h07, h25) are exact; h25 option "two coins, two heads pays $4" is fair (1/4 × 4 = 1). Distractor explanations name real mistakes (h01 ÷4 gives 3; h04 6 and 11 come from including the median in both halves; h16 11/15 = 4/10 + 3/9; h24 −$4.00 counts only the $1,000 prize).
- Numbers recomputed in Python: town MADs 20/6 ≈ 3.3 and 8; Example 3 summary 12, 16.5, 25, 35.5, 60 and fences −12, 64; Example 4 summary 3, 6, 10, 14, 30 and fences −6, 26; resistance table (range 7→49, MAD 2→76.67/6 ≈ 12.8, IQR 5→6); center-spread data 1, 7, 8, 9, 9, 10 (mean 7.33, median 8.5); raffle (1.75, −3.25, 1,300/400); 8/10·7/9·6/8 = 7/15; 25/64 vs 5/14.
- Drills: 2,000 instances each through the app's `generate`/`checkAll`, answers recomputed independently from the prompt text (quartiles sorted from the shuffled list; fractions exact). Every correct answer accepted, a wrong one rejected in every instance, no unfilled placeholders or "+ -"; the dice game's net is never positive; MAD and quartile answers are exact decimals, so no rounding issue.
- Pictures: all 15 SVGs rendered and looked at; geometry matches the stated values (box plot 52/68/75/84/97 and two-class plots placed to scale, probability scale points at 0, 1/6, 1/2, 5/6, 1 to scale). Label markers on all five `-blank.svg` files sit on the parts their labels name.
- Mermaid: all 5 diagrams render; accTitle/accDescr describe the whole diagram.
- Attributions: John Tukey introduced the box plot (1970) and popularized it with *Exploratory Data Analysis* (Addison-Wesley, 1977), where the 1.5 × IQR fences also appear; the lesson's "made box plots popular in the 1970s" and "also from Tukey" are accurate. Source: Tukey, EDA (1977); Wikipedia, "Box plot" (history section).
- Quartile convention: median-of-halves excluding the median for odd n (Tukey-hinge-like, the TI-84 method) is consistent across lesson, questions, drills and the engine's `quartile()`; the lesson labels it a convention.
- Back references: Lesson 6 (absolute value as distance), Lesson 10 (fraction of a fraction), Lesson 36 (balance point, outlier wording matches the glossary), Lesson 37 (frequency-table mean), Lesson 38 (gambler's fallacy, without-replacement warning, experimental → theoretical) all exist.
- Glossary: no term or alias duplicates any `glossary*.yaml` in the course (checked by script). Definitions and cards correct.

## Overlap
None in this course: no other prealgebra round 2 lesson covers spread, box plots, tree diagrams or expected value. Lesson 38 core's coin-and-die tree is a counting picture; 38h2 extends it to weighted and dependent branches.

## Uncertain
- The fences drill uses 1/0 for "outlier?" because there is no yes/no answer type; acceptable but slightly awkward.

`content/math/check-module.sh prealgebra pre-m9`: OK, zero problems after the fixes.
