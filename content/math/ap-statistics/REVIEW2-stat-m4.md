# Review of round 2, stat-m4 (Collecting data)

Reviewed: honors lessons 18h1, 18h2 and 18h3; the additions to core lessons 16, 17 and 18; `questions/r2-stat-m4.yaml` (58 questions);
`drills/r2-stat-m4.yaml` (6 drills); `glossary-r2-stat-m4.yaml` (21 terms); `cards-r2-stat-m4.yaml` (33 cards); and the 7 images `images/stat-m4-*`.
`content/math/check-module.sh ap-statistics stat-m4` reports OK after the fixes.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| 18h1, Example 3 | "Reporting ±3.1 points would overstate the precision by half." This is unclear: the honest margin is 4.6 points, about 1.48 times 3.1. | It now says the honest margin is about half again as large (±4.6). |
| 18h1, design-effect plot | The point label "2.2" was drawn on top of the dashed ρ = 0.05 line. | The label moved below the point with a `labels` entry. |
| 18h2, Example 1 interaction plot | The four mean points were colored from the palette by index. Massed study's right-hand point was orange, the same color as the spaced line, and the spaced line's points were green and purple. That misleads readers who match points to lines by color. | Points removed. The lines end at the four means. |
| 18h2, Example 3 interaction plot | Same point-color problem. The "wet soil" label also sat on the dashed line, because the renderer puts labels above-left of a curve's right end and this line falls. | Points removed. "wet soil" is now a `labels` entry above the line. |
| 18h2, fractional factorials; the glossary entry and the card for "fractional factorial design" | They said that only "some higher-order interactions can no longer be separated from each other". In a fraction, every effect is aliased, and main effects are aliased with higher-order interactions too. In the half fraction of a 2^5 design, for example, each main effect is aliased with a 4-factor interaction. | Reworded in all three places: each effect is mixed up (aliased) with another effect, usually a higher-order interaction. Source: Montgomery, *Design and Analysis of Experiments*, ch. 8. |
| 18h3, Hill viewpoints paragraph | "Only temporality is generally treated as essential" could read as Hill's own view. Hill (1965) wrote that none of his viewpoints "can be required as a sine qua non". | Added "today" and a parenthetical with Hill's own position (Hill 1965, Proc. R. Soc. Med. 58:295–300). |
| 18h3, Key points | "Natural experiments use assignment that happened by chance (Snow's water companies…)". Snow's assignment was as-if random, not chance, and the lesson body itself says "close to random". | Now "by chance or close to it". |
| Question h38, explanation | "Hill stressed that the others support a judgment but none is required" implies Hill exempted temporality. He did not. | Now "Hill himself said no single viewpoint was indispensable…". |
| Question h37, explanation | The distractor "150 and 45" had no named mistake. | Added "150 and 45 converts only X's count to a rate". |
| Drill `stat-m4-r2-design-effect`, solution | `{nn}` inside math uses the default format, which inserts thousands commas (n reaches 2,400). | Changed to `{nn:dp0}`. |

## Checked and found right (a reader might doubt these)

- **Every number in 18h1.**
  - Example 1: 0.83 weighted; rural SE 0.035 against 0.056.
  - Stratified SE 0.0184, proportional 0.0174, SRS 0.0188.
  - Example 2: SE 658 against 474, a 28% cut.
  - Example 3: deff 2.2, effective n 455, margin 0.031 → 0.046.
  - Example 4: 0.565.
- **Every number in 18h2.** Main effects 12 and 8, interaction 8 both ways, the OFAT prediction 74 against 82, 40/3 ≈ 13 per group, fertilizer 0 and −12.
- **Every number in 18h3.**
  - Example 1: ATE 5; naive 23.5 = 3.5 + 20; the random draw gives 7.5.
  - All 70 assignments, enumerated in Python, average exactly 5.0.
  - Standardized rates: 81.7% and 72.5%.
  - Snow: 315.4 and 37.5 per 10,000, ratio 8.40.
- **Snow's table.** S&V had 40,046 houses and 1,263 deaths; Lambeth had 26,107 and 98. Snow printed 315 and 37. Lambeth moved its intake upstream in 1852. Koch isolated the bacterium in 1883–84. Source: Snow, *On the Mode of Communication of Cholera* (2nd ed., 1855), Table IX.
- **Literary Digest 1936.** About 10 million mailed, about 2.4 million returned, Landon about 57%, Roosevelt 60.8%. The frame and nonresponse explanation, with nonresponse weighted more heavily, matches Squire (1988, POQ 52:125) and Lohr & Brick (2017, *Stat. & Public Policy*). Gallup's quota sample picked Roosevelt.
- **Other history.** Neyman (1934) for allocation, with Chuprov (1923) earlier. Neyman 1923 and Rubin 1974 for potential outcomes. Doll & Hill 1950 (BMJ, case-control). British Doctors Study from 1951. Surgeon General 1964 ("in men" is accurate). Hill 1965 with its nine viewpoints. The 2008 Oregon Medicaid lottery. Fisher at Rothamsted, *The Design of Experiments* 1935. The "difference of differences" interaction convention is labeled in the lesson, in h17 and in the drill.
- **All 58 questions, worked before reading the keys.** Every key is correct, every distractor is wrong for a named reason, and the order questions have one order only.
  - The accept lists are complete. q13 also accepts "lurking", which is reasonable given the lesson's note that the two terms are close cousins.
  - q11 matches lesson 17's Example 1 (tomatoes, 3 × 2).
- **Drills.** I recomputed them in Python on thousands of random instances:
  - Neyman sizes are always whole numbers.
  - Design effects are exact at 2 dp, and the effective-n tolerance of 0.501 accepts only the correctly rounded integer.
  - The stratified estimate tolerance of 0.0006 accepts any correctly rounded value at 3 dp.
  - Standardized rates use tolerance 0.06 at 1 dp.
  - The ratio of rounded rates is at most 0.57% from the exact ratio, inside the 1% relTolerance.
- **Pictures.** I rendered all 7 SVGs and the 3 label questions with their markers. Each marker sits on the part its label names: q01 panel titles, q07 gentle block / assignment / treatment group / comparison box, q12 the three variables. The text is readable and nothing is cut off.
- **Diagrams and figures.**
  - I rendered all 6 Mermaid diagrams. The notes say 7, but there are 6: one each in L16 and 18h3, and two each in L17 and L18. All have correct `accTitle` and `accDescr`.
  - I rendered all 5 plot and shape figures in the honors lessons with `src/lib/figure.ts`, which is how I found the label and point-color problems above.
- **Glossary.** None of the 21 terms or their aliases duplicates any other `glossary*.yaml` in the course.

## Overlap

- 18h3's "Adjusting for a measured confounder" (direct standardization, plus the `stat-m4-r2-standardize` drill) overlaps 15h3 (stat-m3: direct standardization of the lesson-15 hospitals, plus the `stat-m3-r2-standardize` drill).
  - The framings differ: confounder adjustment here, the weighted-average view of Simpson's paradox there. The stat-m3 writer added a cross-reference.
  - stat-m3 relies on this module's glossary entry for **standardization**, so keep it here.

## Uncertain

- "Several later studies point to nonresponse as the larger one" (Literary Digest) is a fair summary of Squire and of Lohr & Brick, but historians still debate it. The lesson already says so.
