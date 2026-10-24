# Round 2 notes: pre-m3 (Fractions)

## Honors lessons (honors: true, module pre-m3)
- `lessons/12h1-complex-fractions.md`, **pre-m3-h-complex-fractions**, "Complex fractions and continued fractions" (about 1,780 words, 40 min). Covers what a complex fraction is, the main fraction bar and the 3/4/5 ambiguity, Method 1 (simplify top and bottom, then divide), Method 2 (multiply by the LCD, with why it works), signs and mixed numbers, continued fractions (evaluating, building one by repeated division, why the process always stops), and the continued fraction of π (3, 22/7, 333/106, 355/113). 5 worked examples, a "which method" Mermaid chart, a table.
- `lessons/12h2-fraction-problems.md`, **pre-m3-h-fraction-problems**, "Fraction problems: the rest, working together and average speed" (about 1,610 words, 45 min). Covers fractions of the remainder (multiply the fractions left), working backward, work rates (add rates, subtract a drain, product over sum with a derivation), and average speed for a round trip (harmonic mean, derived; equal times vs equal distances). 6 worked examples, a bar-model picture, a Mermaid procedure chart. The steady-rate assumption in work problems is labeled as a simplified model.

Two honors lessons, not three: the module's four core lessons are covered well, and the obvious third topics (Egyptian fractions, Farey/mediants, repeating decimals) belong to pre-h1 (number theory) or pre-m4 (decimals).

## Core lessons (additions only)
- 09-frac-basics: fraction-wall picture (`images/pre-m3-fraction-wall.svg`) with two introducing sentences and the new bold term **fraction wall**; a Mermaid "which comparison method" chart.
- 10-frac-muldiv: picture of 3 ÷ 3/4 = 4 (`images/pre-m3-divide-quarters.svg`) with an introducing paragraph; a Mermaid procedure chart for multiplying/dividing (new `### The whole procedure` heading).
- 11-frac-addsub: Mermaid procedure chart for adding/subtracting; a ```numberline showing 5/12 and 7/8 against the benchmarks.
- 12-mixed: picture of 2 3/4 = 11/4 with quartered circles (`images/pre-m3-mixed-pies.svg`) with an introducing paragraph; a Mermaid "which method when" chart.

## Questions (`questions/r2-pre-m3.yaml`, 48 total)
- Core, 19 (pre-m3-r2-q01 to q19): text 6, order 4, match 4, select-all 4, label 1 (fraction wall). Module quiz: q02, q05, q08, q12, q18 (at least one per lesson).
- Honors lesson 1, 15 (h01 to h15): multiple choice 8, text 3, order 2, match 1, select-all 1.
- Honors lesson 2, 14 (h16 to h29): multiple choice 6, text 3, select-all 2, order 1, match 1, label 1 (bar model).
- Choice answer positions: 0 ×3, 1 ×4, 2 ×4, 3 ×3.

## Drills (`drills/r2-pre-m3.yaml`, 5)
pre-m3-r2-complex (complex fraction with 1 ± a/b), pre-m3-r2-contfrac (evaluate a two-level continued fraction), pre-m3-r2-rest-backward (start amount from what's left after m/p and then 1/q of the rest), pre-m3-r2-work-together (two workers), pre-m3-r2-avg-speed (round trip; restricted so the plain average in the solution is a whole number, since decimals come in pre-m4). All answers are exact fractions (`lowestTerms`), and mixed numbers are accepted.

## Pictures, diagrams, terms, cards
- Images (all original, checked in preview): pre-m3-fraction-wall.svg and -blank.svg, pre-m3-divide-quarters.svg, pre-m3-mixed-pies.svg, pre-m3-rest-bars.svg and -blank.svg.
- Mermaid: 6 (4 in the core lessons, 1 in each honors lesson), all previewed.
- Glossary (`glossary-r2-pre-m3.yaml`, 7): fraction wall, complex fraction, main fraction bar, continued fraction, work rate, average speed, harmonic mean. None of them existed in any glossary file in the course.
- Cards (`cards-r2-pre-m3.yaml`, 22): 1 for the fraction wall, 12 for honors lesson 1, 9 for honors lesson 2.

## For a reviewer
- **App behavior for text answers:** the app removes spaces before comparing numbers, so a typed mixed number "1 1/2" is read as "11/2" (5.5). For that reason none of my text questions has a mixed-number answer; they ask for an improper fraction or a whole number. Other writers should know about this too: an accept list that includes "1 1/2" would also accept "11/2".
- Historical claim in 12h1: Zu Chongzhi (429–500 CE) found 355/113, and his estimates of π were not improved on for roughly 900 years (the usual account; al-Kashi's 1424 value is generally cited as the first better one). Error sizes in the π table were computed in Python: 22/7 is about +0.00126, 333/106 about −0.0000832, 355/113 about +0.000000267.
- 12h1 uses `\cfrac` for continued fractions (KaTeX supports it; the checker passed).
- pre-h1 (number theory) might also touch continued fractions or the Euclidean algorithm. 12h1 avoids naming the Euclidean algorithm and treats continued fractions only as fractions practice.
- Every number in the lessons, questions and drill formulas was recomputed with Python's `fractions`.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Checks
`content/math/check-module.sh prealgebra pre-m3`: build and checker OK, zero problems.

## Sources
Original writing. Standard facts only: the continued fraction of π [3; 7, 15, 1, 292, …] and the attribution of 355/113 to Zu Chongzhi, both checked against standard histories of π.
