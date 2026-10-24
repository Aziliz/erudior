# Round 2 review: a1-m7 (Square roots, exponential functions, and sequences)

Reviewed: honors lessons 32h1, 32h2 and 32h3; the round 2 additions to core lessons 28–32 (found by
diffing against the round 1 build in `samples/math/math-algebra1.json`); `questions/r2-a1-m7.yaml`
(67 questions); `drills/r2-a1-m7.yaml` (8 drills); `glossary-r2-a1-m7.yaml` (16 terms);
`cards-r2-a1-m7.yaml` (28 cards); 14 SVGs `images/a1-m7-*`; 7 Mermaid diagrams; 5 new
plot/shape figures. `content/math/check-module.sh algebra1 a1-m7` reports zero problems after the fixes.

## Changes

### Answer keys
None needed. I worked all 67 questions before reading the keys and got the same answer every time.

### Facts and procedures
- **32h2, Mermaid "Evaluating a power with a rational exponent".** On the negative-exponent path the
  box said "Use the reciprocal: a^(−m/n) = 1 / a^(m/n)" and the next box said "Take the nth root of
  a". Following the chart for 27^(−2/3) gives 9 instead of 1/9, because the base is never flipped.
  The box now says "Flip the base and drop the minus sign: a^(−m/n) = (1/a)^(m/n)", the next one
  says "Take the nth root of the base", and accDescr matches.
- **30, Mermaid "Writing an exponential model".** The edge labels said "grows r%" and led to
  "b = 1 + r", so a reader could take 5% growth as b = 6. They now say "grows by rate r" and
  "b = 1 + r (r as a decimal)", the same for shrinking, and accDescr matches. This is the convention
  the lesson itself uses ("a growth rate r (as a decimal)").
- **32h2, intro.** It said Lesson 30 stated that "a growth factor of b per year is √b per
  half-year". Lesson 30 shows only one example (21% a year equals 10% per half-year). The sentence
  now describes that example.

### Pictures and figures
The 14 SVGs needed no changes (see below). The new ```plot and ```shape blocks did need fixes. I
rendered them with `renderFigure` and the app's figure CSS:
- **28, ladder triangle (```shape).** The hypotenuse label "ladder 12 ft" lay across the line. It is
  now a free `labels` entry beside the hypotenuse.
- **31, Example 3 plot.** Four problems. The point label "year 10: B 10,240" was cut off at the right
  edge. "year 9: A 5,500" sat on top of both curves and a point. The automatic label for line A was
  crossed by curve B. And the y-tick labels 10000 and 12000 were cut off on the left, so the top
  tick read "2000". I redrew the plot in thousands of dollars (y from 0 to 12, yLabel "bonus
  (thousands of dollars)"), put the two curve labels in empty space, removed the year labels (the
  table above the plot gives the values, and the caption now says the dots are years 9 and 10), and
  colored each dot to match its curve. Before, the palette cycled, so a point on line A was drawn
  purple.
- **32, geometric-sequence plot.** The labels "a₁ = 3" and "a₅ = 48" overlapped the dashed curve.
  They are now `labels` placed off the curve, and the points match the curve's color.
- **32h2, half-step plot.** All the point labels (for example "x = 1/2: 3√2 ≈ 4.24") ran along the
  rising curve. The labels are now short values placed below and to the right of their points, the
  caption names the x-values (3√2, 6√2, 12√2), and the points match the curve's color.
- **32h3, partial-sum plot.** I changed only the point colors so they match (all one color), not
  the content.

### Other fixes
- **Drill a1-m7-r2-rationalize-mono.** When c = 1 the solution printed "1√14 / 14". It now uses
  `{c:coef}`.
- **Drill a1-m7-r2-geom-series.** For |r|ⁿ ≥ 1000 the solution printed thousands commas inside
  math, for example "(−3)^8 = 6,561" and "(1 − (6,561))". It now uses `{rn:dp0}`.
- **28, Mermaid "simplify a square root".** The box said "largest perfect square", but the loop and
  the sentence before the chart are about not spotting the largest one the first time. The box now
  says "the largest perfect square you spot", and accDescr matches.
- **32h3, Mermaid "which formula".** I added "for r ≠ 1" to the finite geometric box and changed the
  raw "<" in "Is |r| < 1?" to "less than", following the brief's rule on raw comparison signs.
- **32h2, nth roots.** "A positive number has two, such as 3 and −3 for ⁴√81" seemed to say that
  ⁴√81 has two values. It now reads "two real even roots, such as 3 and −3, the two fourth roots of
  81".

## Checked and found right (things a reader might doubt)
- **Drills.** I generated 2,000 instances of each drill with `generate()` and recomputed the answers
  independently from the drawn values (exact fractions; 2-decimal values rounded with toFixed).
  Correctly rounded answers are always accepted (tolerance 0.0051). A wrong answer is always
  rejected: off by one, the naive yearly/12 rate when it rounds differently, the sum with one term
  too many, the wrong sign of r. I found no unfilled placeholders, "+ -" or "1x" after the fixes.
  The monthly-rate drill's naive answer sometimes rounds to the same 2 decimals as the correct one
  (for example 2%/12); that is not an error.
- **Numbers, recomputed in Python.**
  - 1.12^(1/12) = 1.009489; 1.01^12 = 1.12683; 100·0.5^2.5 = 17.68.
  - 1.524^1.5 = 1.8814 (NASA Mars fact sheet: semi-major axis 1.524 AU, period 1.881 yr).
  - 100(1.05^10 − 1)/0.05 = 1257.79; 2^64 − 1 = 18,446,744,073,709,551,615.
  - 5000·0.96^25 ≈ 1802 (q20).
  - h23: 1.09^(1/12) = 1.00721, 1.0075^12 = 1.0938, 0.09^(1/12) = 0.818.
  - h24: 80·0.5^1.5 = 28.28. h40: 1083.26, 1216.65 and 1126.60 are all right.
  - √(5/12) = √15/6 = 0.6455.
- **Chessboard.** 1.8 × 10^19 grains × 25 mg ≈ 4.6 × 10^11 t. World rice production is roughly
  0.5–0.8 × 10^9 t a year (FAO; milled versus paddy), so "hundreds of times" holds.
- **History.**
  - Aristotle's odd/even remark is in Prior Analytics I.23 (41a26–27).
  - Theodorus and the roots of 3, 5, … up to 17 is from Plato's Theaetetus 147d. Whether 17 itself
    is included is debated; "up to 17" is fine.
  - The Hippasus drowning story is called a legend.
  - The Gauss story comes from Sartorius von Waltershausen's memoir (1856, a year after Gauss's
    death in 1855), which doesn't give the numbers 1–100 (B. Hayes, American Scientist 94, 2006).
    The lesson calls it a legend.
  - Kepler's third law appeared in Harmonices Mundi (1619).
  - Iodine-131's half-life is 8.02 d (NNDC), so "about 8 days" is right.
- **Cross-references.**
  - Lesson 1 does claim that repeating decimals are rational (cited in 32h3 Example 5).
  - Lesson 18 defines zero and negative exponents by keeping the rules (cited in 32h2).
  - Lesson 19 gives the difference of squares (cited in 32h1).
  - Lesson 32's ball example (10 ft, 60%) and its sequence 3, 6, 12, … match the new figures and
    Example 6.
- **32h1 proofs.** I checked each step of the √2, √3 and √4 arguments and the prime-factorization
  sketch (labeled a sketch).
- **SVGs.** I rendered all 14 and checked them; all the label markers sit on the parts their labels
  name.
  - The bouncing-ball heights are drawn to scale (6, 3.6, 2.16, 1.3 ft measured from the bottom of
    the ball).
  - The Theodorus spiral's hypotenuses measure √2 … √8 (√8 = 249 px at 88 px per unit). Every label
    sits on its own segment.
  - The exponential curves match 2(1.6)^x and 2(0.6)^x, and the root graphs match √x, −√x, √(−x)
    and ∛x at x = ±10.
  - The staircase is 5 × 6, and the halves-square pieces are in the right proportions.
  - Text is readable and nothing is cut off.
- **Glossary and cards.**
  - No term or alias duplicates any other `glossary*.yaml` in the course.
  - Every bolded term in the honors lessons has an entry, except the run-in labels "Even
    index"/"Odd index" (formatting) and "power rule" (already defined).
  - All definitions and card backs are correct.

## Overlap with other round 2 lessons
- **√2 is irrational.** alg-m1's `05h1` mentions it and points forward to this module's proof
  without proving it. a1-h1's NOTES2 says lesson 90 deliberately avoids it. No duplication.
- **Repeating decimals to fractions.** `05h1` does this with linear equations and 32h3 with
  geometric series, using a different decimal. 32h3 points back to 05h1. This is complementary.
- **Savings balances.** a1-h1's `93-recursive-models` reaches them through the equilibrium of
  a_n = r·a_(n−1) + d, while 32h3 Example 4 uses the geometric series formula. Same topic, different
  method; acceptable.
- **"proof by contradiction".** It is bolded in 05h1, 90 and 32h1; only this module's glossary
  defines it.

## Left uncertain or not fixed
- **h35** asks for "a fraction in lowest terms" (3/11). Because answers compare by value, 27/99 is
  also accepted. This is a limit of the text type, not a key error.
- **The 28 ladder shape is not drawn to scale.** Shape figures stretch to fit, so the 4 : 11.3 legs
  look about 1 : 1.7. Its labels are correct.
- **Figure styling.** I previewed the figures with `renderFigure` and the app's figure CSS, not
  inside the running app. Exact label positions may shift slightly with the app's fonts; there is
  margin in every case.
