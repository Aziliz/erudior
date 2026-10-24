# REVIEW2-a2-h1: Honors module a2-h1, "Toward precalculus and beyond"

Reviewer for item 18. Scope: lessons 90–93, `questions/r2-a2-h1.yaml` (h01–h56), `drills/r2-a2-h1.yaml` (12),
`glossary-r2-a2-h1.yaml` (28), `cards-r2-a2-h1.yaml` (41), `images/a2-h1-*` (5 SVGs + 4 blanks), 7 plots, 3 Mermaid diagrams.
`content/math/check-module.sh algebra2 a2-h1` after the fixes: **zero problems** (4 lessons, 56 questions, 12 drills, 41 cards).

## Changes

### Answer keys
- **a2-h1-r2-h46** (match, rates-of-change patterns): the pair `m(x) = 7` → "The rates are all zero" was ambiguous, because a constant
  function's rates (0, 0, 0) also "stay the same", which was the answer for the linear function. Replaced it with
  `m(x) = 4 - x^2` → "The rates go down by the same amount each step" (rates −1, −3, −5), moved "The rates are all zero" to the
  distractors, and rewrote the explanation to match.
- **a2-h1-r2-h34** (text, `___ cis ___°`): the second blank accepted only `150`. Added `150°` and `150 degrees`, since the stem puts
  ° right after the blank and learners will type it.

### Pictures and plots
- **images/a2-h1-secant.svg**: the "tangent line" label sat on the dashed tangent line. Moved it below the line (y 275.8 → 300).
  The blank copy has no labels, so it needed no change; markers for h52 were rechecked and are on their parts.
- **Lesson 90, hyperbola plot**: the automatic function label "y = −3x/4" was drawn on the asymptote itself. Removed both function labels
  and named the asymptotes in the caption ("the asymptotes y = ±3x/4 (dashed)").
- **Lesson 91, Example 1 plot**: the right-hand orientation arrow was drawn about 0.15–0.2 units above the curve, while the left one was on it.
  Moved it onto the curve: (1.9, 5.1) → (2.1, 5.4), since y(1.9) = 5.1025 and y(2.1) = 5.4025.
- **Lesson 91, cycloid plot**: the "t = π" point label sat on the wheel and curve, and "t = 2π" ran into the x-axis letter. Moved both to
  `labels` above or beside the curve and widened x to [−0.5, 7.5].

### Other
- **a2-h1-r2-h24**: the distractor "18 ft" didn't come from any real mistake. Replaced it with "48 ft" (forgetting to square $t$:
  $72 - 16 \cdot 1.5$), and the explanation now names it.
- **a2-h1-r2-h55**: the explanation now accounts for the distractor 16 ($k(4)$, the value at the midpoint).
- **Lesson 92**: "modulus" is now bolded. The writer left it plain until `glossary-r2-a2-m2.yaml` existed. That file now defines
  `modulus`, so the pop-up works, and this module can be studied without 09h1. No new glossary entry was needed.
- **Drill a2-h1-r2-de-moivre**: the solution printed $n\theta$ with a thousands comma inside math (for example `1,680^\circ`, in 62 of 300
  instances). It now uses `{nth:dp0}`.
- **Drill a2-h1-r2-projectile**: the solution bolded the distance to 1 decimal ("396.9 ft"), but the prompt asks for the nearest foot. It now
  reads "≈ 396.9, which rounds to **397 ft**".

## Checked and found right (a reader might doubt these)
- **All 56 question keys** were worked by hand before reading the key, and the numeric ones were recomputed with sympy/Python:
  - h12: the expansion of $9(x-1)^2 - 4(y+2)^2 = 36$ reproduces the stem;
  - h14: $(x-2)^2 + (y+1)^2 = 11/2$;
  - h23: $t = 3$; 5.2 s is $96\cos 30^\circ/16$;
  - h31: 210°;
  - h38: arguments 18.4°, 116.6°, 194.0°, 251.6°, 291.8°, so the order is unique;
  - h41: the last choice is the fourth roots of −81;
  - h42: 20° + 72°k;
  - h43, h44, h47, h49, h51, h54.

  Select-all items h09, h22, h37 and h50 each have exactly the listed answers right. The order items h08, h21 and h48 have no swappable steps.
- **Worked examples** were all recomputed:
  - Example 4 in lesson 90: expanding back gives $4x^2 + 9y^2 - 16x + 18y - 11$;
  - Example 4 in lesson 91: landing $t = (20 + \sqrt{496})/16 \approx 2.642$ s, $x \approx 183$ ft, and $y = 6 + x/\sqrt3 - x^2/300$;
  - lesson 92: $(1+\sqrt3 i)^5 = 16 - 16\sqrt3 i$, $(1+i)^8 = 16$, the roots of $z^4 = -16$ and $z^3 = 8$, and the polar product $= 6i$;
  - lesson 93: Example 5's quotient $64 - 32t - 16\Delta t$.
- **Plot geometry**:
  - the focal distances 4/4 and 10/10 in the parabola plot;
  - both secants in lesson 93 pass through their points ($8x - 15$ through (3, 9) and (5, 25), $7x - 12$ through (4, 16));
  - the cycloid wheel is centered at $x = t = \pi$;
  - the cone picture's "parabola" plane has slope −1.49 against the cone side's −1.5, so it is parallel.
- **Pictures**: all 5 SVGs and 4 blank copies were rendered, and every marker of h10, h26, h40 and h52 sits on the part its label names. The 3 Mermaid diagrams were rendered and are correct. Their accDescr text describes the whole chart.
- **Drills**: 300 instances of each drill (3,600 in all) were generated from the built course and re-solved independently in Python from the prompt text alone.
  - Correct answers were accepted in every instance: exact forms (`sqrt(13)`, fractions in lowest terms, `sqrt(53)`), decimals rounded as each prompt asks, and projectile answers from a student who rounds the components to 2 decimals first.
  - Deliberately wrong answers were rejected. The only "accepted wrong" cases were my own test input $r_1 + r_2$ when $r_1 = r_2 = 2$, which equals $r_1 r_2$ and so isn't actually wrong.
  - The tolerances are adequate: ±0.02 / ±0.006 for 2-decimal answers, ±1 ft for the nearest foot, and ±0.06° for tenths.
  - No `+ -`, `1x`, unfilled placeholders or (after the fix) thousands commas inside math.
- **Conventions**: the argument in $[0^\circ, 360^\circ)$ is stated, and the lesson notes the other common convention. The calculator-$\tan^{-1}$ warning ("wrong by 180° whenever $a < 0$") is correct.
- **History**, checked against sources:
  - Apollonius (c. 200 BC; *Conics* in eight books; named the ellipse, parabola and hyperbola): MacTutor, "Apollonius of Perga".
  - De Moivre (1667–1754, French-born, worked in London). The formula is named for him although he never stated it in this form: Wikipedia, "De Moivre's formula"; MacTutor biography.
  - Kepler's ellipse law in *Astronomia Nova* (1609), Euler's formula in the *Introductio* (1748), and Newton and Leibniz independently in the later 1600s: standard.
  - Eccentricities: Earth 0.0167 and Halley's comet 0.967 (standard published values; I did not re-fetch them this round), so ≈ 0.017 and ≈ 0.97 are right.
  - $g \approx 32$ ft/s²: standard gravity is 9.80665 m/s², which is 32.17 ft/s².
- **Simplifications are labeled**: no air resistance; the reflection property is stated without proof; the angle-sum formulas are proved later; Euler's formula and limits are previews; the general-form table assumes the conic is not degenerate and has no $xy$ term.
- **Cross-references**:
  - Lesson 07 does call $x^2 - y^2 = 5$ a hyperbola, "you'll meet it in precalculus", so lesson 90's "promised you'd meet it later" fits.
  - 09h1 exists and points forward to lesson 92 ("proved in the honors lesson on complex numbers in polar form").
  - a2-h1 is the last module in course.yaml, so "This last lesson of the course" (lesson 93) is right.
- **Glossary**: no term or alias duplicates another `glossary*.yaml` in the course (the build would fail). Every bolded term in 90–93 has an entry.

## Overlap with other round 2 lessons (not changed)
- 92's paragraph on multiplying by $i$ as a quarter turn repeats a short section of **09h1-complex-plane** ("Multiplying by i is a quarter turn"). It is deliberate and brief: 92 gives the polar reason, and 09h1 points forward to it.
- 93's table "How different families change" (constant rates, constant second differences, rates multiplied by a constant factor) touches **24h1-finite-differences**, which proves that constant second differences mean a quadratic. The overlap is small, and 93 uses it only as motivation.
- The glossary has both "secant" (the trig function, from a2-m9's `30h1-tangent-reciprocal`) and "secant line" (a2-h1). They are distinct terms, not duplicates.

## Left uncertain or not changed
- In the de-moivre drill solution, the base modulus is shown as "$r \approx 2$" even when it is exactly 2, and the power as "$r^n \approx 32$". This is cosmetic, and the writer noted it as a format limitation.
- In the lesson 90 parabola plot, the automatic "(4, 2)" point label touches the curve slightly. It is still readable, so I left it.
