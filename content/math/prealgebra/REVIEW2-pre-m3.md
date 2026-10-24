# Round 2 review: pre-m3 (Fractions)

Reviewed: honors lessons 12h1 (complex and continued fractions) and 12h2 (fraction problems), the additions to core lessons 09–12, `questions/r2-pre-m3.yaml` (48), `drills/r2-pre-m3.yaml` (5), `glossary-r2-pre-m3.yaml` (7), `cards-r2-pre-m3.yaml` (22), and the six `images/pre-m3-*` files.

## Changes

| Where | Problem | Fix |
|---|---|---|
| pre-m3-r2-q19 (explanation) | Said 7/4 and 6/5 "come from adding the whole number to the numerator". Neither does (that mistake gives 3/3, 3/5, 6/4, 5/2). | Now says 7/4 = 1 3/4 and 6/5 = 1 1/5 match none of the mixed numbers. |
| pre-m3-r2-h01 (explanation) | Said 27/8 "flips the top instead of the bottom". Flipping the top gives 2/3 (also a choice); 27/8 flips both fractions. | Each distractor now has the right mistake: 8/27 multiplies, 2/3 flips the top, 27/8 flips both. |
| pre-m3-r2-h05 (explanation) | Distractor 5/7 not explained. | Added: 5/7 multiplies the top by 3 but the bottom by 6. |
| pre-m3-r2-h08 (explanation) | Distractor 2/3 not explained. | Added: 2/3 loses the sign. |
| pre-m3-r2-h21 (explanation) | Distractor "1 hour 20 minutes" not explained. | Added: it misreads 1.2 hours as 1 h 20 min. |
| 12h2, "The harmonic mean" section (factual) | "Both use reciprocals, because both add *times* that come from dividing by a rate." Wrong for work problems, which add rates, not times. | Rewritten: work problems add the rates 1/a + 1/b, round trips add the times d/a + d/b; the two-worker time ab/(a+b) is exactly half the harmonic mean of the times. |
| cards-r2-pre-m3, "Equal times vs equal distances" | "harmonic mean, which is smaller": not true when the speeds are equal. | Added "(unless the two speeds are equal)". |

## Checked and right
- Every question worked independently. All keys are right; order questions have one order only; select-all sets are exact; match and label pairs are unambiguous.
- π table (Python): 22/7 − π ≈ +0.00126, 333/106 − π ≈ −0.0000832, 355/113 − π ≈ +2.67×10⁻⁷. The partial quotients [3; 7, 15, 1, 292] are right, and the claim that the convergents alternate around π is right.
- Zu Chongzhi (429–500) and 355/113, "not improved on for roughly 900 years": Wikipedia, *Approximations of π*, says "without improvement for close to a millennium" until Madhava (c. 1400). Al-Kashi (1424) came about 925 years after Zu. "Roughly 900 years" holds.
- Back references are true: Lesson 3 lists the fraction bar as a grouping symbol; Lesson 10 has the "big fraction" argument and "of means multiply"; Lesson 11 has "what fraction is left means subtract from 1".
- Drills, checked by enumerating every input in Python: the complex-fraction drill (924 instances) matches the exact value; in rest-backward the amount left is always a positive whole number; avg-speed and work-together use the right formulas; contfrac is right.
- Pictures rendered: fraction wall, the 3 ÷ 3/4 runs (4 runs of 3 quarters), the 2 3/4 pies and the rest bars (1/3, then 1/6, then 1/2 left) are all correct and readable. Label markers on both `-blank.svg` files sit on the named pieces. The numberline in Lesson 11 is readable: the 5/12 and 1/2 labels are close but don't overlap.
- All 6 Mermaid diagrams render, and their accTitle/accDescr match the content.

## Notes and uncertainty
- The writer's notes say the app reads "1 1/2" as "11/2". That is out of date: `src/lib/questions.ts` keeps a space between two digits, so mixed numbers compare by value. No content depended on this claim.
- Overlap: none. pre-m4's 16h2 (inverse proportion) mentions work rates in one sentence and points to 12h2.
- `content/math/check-module.sh prealgebra pre-m3`: OK, zero problems after the fixes.
