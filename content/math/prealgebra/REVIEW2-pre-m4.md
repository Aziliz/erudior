# Round 2 review: pre-m4 (Decimals, ratios and proportions)

Reviewer for item 97. Reviewed: honors lessons 16h1 and 16h2, the round 2 additions to lessons
13–16, `questions/r2-pre-m4.yaml` (46), `drills/r2-pre-m4.yaml` (4), `glossary-r2-pre-m4.yaml` (9),
`cards-r2-pre-m4.yaml` (19), and the 8 `images/pre-m4-*` SVGs.
`content/math/check-module.sh prealgebra pre-m4` after fixes: OK, zero problems.

## Changes

| Where | Problem | Change |
|---|---|---|
| 16-proportion, taxi ```plot | Both curve labels sat on the lines ("2 dollars per mile: proportional" was drawn across the dashed line), and the point labels (5, 10) and (10, 23) touched lines. | Removed the curve and point labels; placed free `labels` off the lines: "2 per mile (proportional)", "3 + 2 per mile (not proportional)" and the four coordinate labels (below the solid line, above the dashed one). Re-rendered: nothing overlaps. |
| 16h2, time = 120/speed ```plot | Curve label "time = 120 / speed" sat on the curve and over the (60, 2) label; the curve's top end ran into the "time (hours)" axis title. | Removed the curve label, added a free label at (45, 6); y range 0–10 → 0–12 so the curve (from x = 12, y ≤ 10) stays clear of the axis title. Re-rendered. |
| h14 | Distractor "12 days" matched no mistake. | Changed to "11 days" (15 − 4, additive thinking); explanation now names the additive mistakes behind 11 and 19. Answer unchanged (10 days, index 2). |
| h18 | Distractors 106 and 216 rpm were unexplained; 216 matched no mistake. | 216 → 3600 rpm (teeth per minute, forgot to divide by 24); explanation names 106 (adding the 16-tooth difference) and 3600. Answer unchanged (150, index 3). |
| h21 | Distractor 9.6 hours unexplained. | Explanation adds: 9.6 = 12 × 4/5, treating fewer machines as less time. |
| h23 | Distractor 240 Hz unexplained. | Explanation adds: 240 Hz adds 20 Hz for 20 cm (additive thinking). |

No answer key was wrong; no lesson facts needed correcting.

## Checked and right (a reader might doubt)

- Every question worked independently before reading the key; all 46 keys are right, select-all
  sets complete (q03, q08, q14, q17, h08, h15, h26), order questions have one order only, match and
  label pairings unambiguous.
- Numbers recomputed in Python: 2295/990 = 51/22; 0.2(45) = 243/990 = 27/110; 0.1(45) = 144/990
  = 8/55; 0.4(3) = 13/30; 4/27 = 0.(148) (and 0.44 × 0.33 = 0.1452); 1/13 period 6; 1/17 period 16;
  1/7 remainder cycle 1, 3, 2, 6, 4, 5 with digits 1, 4, 2, 8, 5, 7 (matches the cycle SVG);
  painters/houses 18, bottles 7.2 h, gear 60 rpm, string 293.3 Hz and 330 Hz, Table C products
  40, 51, 56, 48.
- "Period at most d − 1" is true (remainders 1 … d − 1); 0.999… = 1 arguments are sound and the
  finite/infinite distinction is stated.
- Drills: enumerated every input of both repeating-decimal drills and checked the fraction's actual
  decimal digits against the prompt (0 failures); fraction kind rejects decimals and unreduced
  fractions, and `tolerance: 0.0000001` is far below the gap between distinct candidate fractions.
  Work-units drill: all 7,327 allowed inputs give whole-number days and painters (max 120 painters,
  realistic enough). Inverse drill: integer answers by `where`.
- History: Archimedes proved the law of the lever in *On the Equilibrium of Planes* (3rd century BC)
  — standard (e.g. Heath, *The Works of Archimedes*, 1897). Halving a string gives the octave: the
  Pythagorean tradition, stated without a specific attribution, which is appropriate. Frequency ∝
  1/length for strings of the same material and tension is Mersenne's law (OpenStax *University
  Physics* Vol. 1, §16.6, f = (n/2L)√(T/μ)); the lesson labels it idealized.
- Seesaw uses kg with "weight × distance": weight is proportional to mass, so the balance
  condition is the same; acceptable at this level.
- Cross-references: Lesson 13 does prove "stops or repeats"; Lesson 20 does define rational
  numbers; Module 7 (lesson 29) graphs lines; 12h2 (pre-m3) covers working together.
- Pictures: all 8 SVGs rendered; content, text and markers correct (place-value blank markers on
  the five numbered headings, tape markers on whole/one part/A/B, lever markers on fulcrum and the
  2 m / 3 m arrows). All 6 Mermaid diagrams rendered, readable, accDescr complete.
- Glossary: none of the 9 terms or aliases exists in any other `glossary*.yaml` in the course.

## Overlap

None found. Repeating decimals and inverse proportion appear in no other round 2 lesson
(pre-h1's 90–93 do not touch decimal periods); scaling (35h1) and work/average speed (12h2) were
already left to their modules by the writer.

## Uncertain / left as is

- Text questions h03 and h12 ask for lowest terms, but text answers compare by value, so an
  unreduced equal fraction (e.g. 144/990 for h12) would also be marked right. The text type has no
  lowest-terms option; the drills enforce it instead.
- h25 distractors 12 and 2 are not named in the explanation (16 is); harmless.
