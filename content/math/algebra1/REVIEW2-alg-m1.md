# Round 2 review: module alg-m1 (Foundations and linear equations)

Reviewer for item 0. Scope: honors lessons 05h1 and 05h2, round 2 additions to core lessons
01–05, `questions/r2-alg-m1.yaml` (51), `drills/r2-alg-m1.yaml` (5), `glossary-r2-alg-m1.yaml`
(9), `cards-r2-alg-m1.yaml` (20), `images/alg-m1-*` (10 SVGs).
`content/math/check-module.sh algebra1 alg-m1` after fixes: OK, zero problems
(7 lessons, 107 questions, 18 drills, 47 cards).

## Changes

| Where | What was wrong | Change |
|---|---|---|
| 05h1, intro | Said Lesson 1 "made a claim without proving it", but Lesson 1 does sketch the remainder argument for one direction. | "made a claim and only sketched the reason for it". |
| 05h1, "0.999… = 1" | "Every terminating decimal has a twin ending in repeating 9s" is false for 0 (0 has only one decimal name). | "Every terminating decimal except 0 …". |
| cards-r2-alg-m1, card "Is 0.999… less than 1?" | Same overstatement. | Same fix. |
| 05h1, "Numbers in between: density" | The recipe for an irrational between two decimals ("copy the digits they share, then continue with a non-repeating pattern") can land outside the interval (the first differing digit has to be chosen, too). | Rewrote the sentence: take a terminating decimal strictly between them, then add a non-repeating tail small enough to stay below the larger number (as Example 4 does). |
| 05h2, distance–time plot | The point label "(2, 120)" sat on the 40 mph segment (point labels draw up and to the right). | Removed the point's label and placed "(2, 120)" with a free `labels` entry at (1.45, 150), clear of all curves. Re-rendered. |
| 03, parallel-lines plot (Example 4) | The curve label "y = 4x - 5" was drawn across the dashed line y = 4x − 1. | Removed that curve label and placed it as a free label at (3.2, 2), below its own line. Re-rendered. |

No answer key, drill, glossary or SVG needed a change.

## Checked and found right (things a reader might doubt)

- **All 51 questions worked independently before reading keys.** Notable: q07's order is unique
  (4·9 before ÷6 by left-to-right); q11 and q17 orders are unique given the listed equations;
  q13 (4 − x = −(x − 4) is an identity; 7x = 0 has exactly one solution); h02 (bound 12 even
  though 1/13 has block 6, and the explanation says so); h05 (2025/9999 = 225/1111, gcd 9);
  h12 (3/7 = 0.428571 repeating, remainders 3, 2, 6, 4, 5, 1); h21 (two trips both 40 mph is a
  legitimate repeated answer); h24 (balance rule gives 18 L; 2 L is the swapped-weights error);
  h25 (impossible; 90 mph gives 60 mi in 80 min = 45 mph). Every distractor's explanation names
  a real mistake.
- **Text questions**: all answers are whole numbers (13, −24, 2, −40, 77, 9, 6, 6, 96); the app's
  `normText` maps a Unicode minus to "-", so "−24"/"−40" typed either way match.
- **Writer's note about fractions in text answers is out of date**: `textMatches` in
  `src/lib/questions.ts` does compare by value (`numValue` handles `1/2`, `.5`, mixed numbers),
  as ROUND2.md says. Harmless here since every blank is a whole number.
- **Drills** recomputed in Python over every input: repeating-two (n/99 reduced, multiples of
  11 excluded so the block really has 2 digits), repeating-delayed ((9a + b)/90; b = 9 and a = b
  excluded), work-together (tolerance 0.0051 ≥ half of 0.01; number answers accept typed
  fractions), round-trip (16 valid speed/distance combinations, all integer times and averages),
  final-needed (1,279 valid inputs, all integer F in [40, 100], weighted average reproduces the
  goal exactly). No unfilled placeholders.
- **Lesson numbers** recomputed: 1/7 cycle; 3/40 = 0.075; Example 1 (7/20, 5/12, 9/75, 11/30);
  5/37; 7/15; 41/140 ≈ 0.2929 between 2/7 and 3/10; Ana/Ben 2 h; tank 20/3 h; printer 30 min;
  48 mph; 120 mph and the 80 mph impossibility; F = 75.333…; mixture 20/3 L by the balance rule.
- Facts: terminating-decimal criterion (lowest terms, denominator 2^a·5^b), block length ≤ q − 1,
  harmonic mean < arithmetic mean unless a = b, and the label of "multiply an endless decimal
  and subtract" as needing limits are all standard (OpenStax Prealgebra 2e §5.3/§7.1; Elementary
  Algebra 2e §1.8; OpenStax Introductory Statistics 2e §2.5 for weighted mean).
- **Pictures** (all 10 rendered and looked at): number sets (nesting and examples correct; 6
  markers on the box titles), expression parts (5 markers on 4, exponent, x, −7xy, 9),
  cylinder net (rectangle width ≈ 2π × circle radius, true to scale; 4 markers on top circle,
  rectangle centre, left side, bottom edge), balance (3x + 2 = 11 → 3x = 9, square counts right),
  mixture (liquid and acid heights proportional to 10 L/15%, 6.67 L/40%, 16.67 L/25%),
  remainder cycle (remainders 1→3→2→6→4→5, digits 1,4,2,8,5,7), work tape. Text readable,
  nothing cut off.
- **Mermaid** (6) rendered: number-classification, order of operations, solving strategy (with
  no-solution / identity branches), solving-for-a-variable, word-problem routine, decimal →
  fraction. Content correct; accTitle/accDescr describe the whole diagram. Labels beginning
  "1." render as text (no markdown-list problem).
- Other new figures (Lesson 1 distance numberline, Lesson 3 intersecting-lines plot, Lesson 5
  cyclists shape, 05h2 balance numberline) rendered with the app's `renderFigure`: no labels on
  curves.
- Glossary: none of the 9 terms or aliases exists in any other `glossary*.yaml`; **remainder**
  (alg-m5) and **proof by contradiction** (a1-m7) are reused, and their definitions fit this use.

## Overlap with other round 2 lessons

- 32h3 (a1-m7, series) also converts a repeating decimal (0.3636…) to a fraction, by geometric
  series, and cross-references 05h1. Complementary methods, not a duplicate.
- 36h2 (a1-m8, Simpson's paradox) also uses and bolds **weighted average**; it relies on this
  module's glossary entry (no duplicate entry). Light overlap of the idea only.
- 05h1 points to "an honors lesson in Module 7" (32h1) for the √2 proof; that lesson exists and
  does prove it.

## Left uncertain

Nothing substantive. q04 accepts only "13" (not "13 units"); acceptable since the stem's blank
is a bare number.
