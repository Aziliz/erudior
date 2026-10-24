# Round 2 review: alg-m2 (Inequalities and absolute value)

Reviewed independently: honors lessons 07h1 (absolute value by cases) and 07h2 (tolerance, error
bounds, triangle inequality), the additions to 06 and 07, `questions/r2-alg-m2.yaml` (39),
`drills/r2-alg-m2.yaml` (4), `glossary-r2-alg-m2.yaml` (8), `cards-r2-alg-m2.yaml` (18), and the 7
`images/alg-m2-*` SVGs. `content/math/check-module.sh algebra1 alg-m2` reports zero problems after
the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| `images/alg-m2-distance.svg`, `alg-m2-distance-blank.svg` (used by q09) | The two arrows from the center looked like one double arrow from end to end (length 2r). Marker 4 ("Distance r from the center") sits on its right half, and the distractor is "Distance 2r from the center", so a careful student could read the arrow as 2r. | Added a dot at the center where the two arrows start, so each arrow clearly runs from c to an endpoint. Re-rendered with markers; all 4 markers sit on their parts. |
| q09 `alt` | Alt text said "a double arrow runs from one dot to the other". | Now says two arrows start at a dot over the middle tick and run out to the dots. |
| 07-absolute-value, Mermaid chart and its lead-in | For k = 0 the "no" branch is misleading: "less than → one interval" is wrong for $\lvert u\rvert < 0$ (no solution) and $\lvert u\rvert \le 0$ (one point). Labels also used raw `<` / `>` (the brief asks for `#lt;` / `#gt;`). | Added one sentence after the lead-in pointing to the table for k = 0 and saying what happens there; matching sentence in `accDescr`; labels now use `#lt;` / `#gt;`. Rendered; reads correctly. |
| 07h1, Example 3 plot | Automatic labels sat on curves: "y = x + 4" was crossed by the steep arm of the V, and "(5, 9)" and "(-1, 3)" overlapped the lines. | Removed the automatic labels and placed `labels` in clear space (V label on the left, line label above the line, point labels below the points). Rendered with `renderFigure`; nothing overlaps. |
| 07h2, "How an error travels" | $|y - y_0| = |k||x - x_0|$ used $x_0$, $y_0$ without saying what they are. | Added "with measured input $x_0$ and computed output $y_0 = kx_0 + b$". |

## Checked and found right (things a reader might doubt)

- **All 39 questions** worked before reading the key; keys confirmed with sympy (`solveset`) for
  every equation and inequality, including h03 ($x = 3$ only), h06 ($(-\infty, 3)$; the "or" union
  swallows $x < -\tfrac13$), h11 ($(-4, 3)$), h12 ($-3$, $7$), h14 ($x > \tfrac12$), q04 ($-2 \le x < 5$,
  so $-2$, 0, 4.5), q08, q11 (8 integers). Select-all sets complete and exclusive; order questions
  have one order each (h26: the "Require $4|x - 5| \le 0.1$" step needs the factored form, so it
  can't move up). Match/label answers are plain text. MC answer positions 4/4/4/4.
- h24: $a = 0$, $b = -7$ gives equality, consistent with "do not have opposite signs".
- h28: $|a - b| = |a| + |b| \iff ab \le 0$ (equality case of the triangle inequality with $-b$).
- h27 distractor $0.0087 = 0.005\sqrt3$ (root-sum-of-squares), labelled in the lesson as an estimate,
  not a guarantee. Correct.
- The claim that $|u| < v \iff -v < u < v$ and $|u| > v \iff u < -v$ or $u > v$ hold for **every** real
  $v$ (07h1): true; the max$(u, -u)$ proof in the lesson is complete. For $v < 0$ the first side is
  empty and the second is all reals, matching.
- Triangle inequality proof (adding $-|a| \le a \le |a|$ and $-|b| \le b \le |b|$) and the equality
  condition: correct.
- Euclid, *Elements* Book I, Proposition 20 (any two sides of a triangle together exceed the third),
  "about 300 BC": correct (Heath's translation, *The Thirteen Books of Euclid's Elements*, Vol. 1;
  D. E. Joyce's online edition of the *Elements*, I.20).
- Resistor tolerance: 5% (E24 series) and 1% (E96 series) are the common tolerances (IEC 60063
  preferred-number series). 470 Ω ± 5% → 446.5–493.5 Ω; 492 passes, 446 fails. Correct.
- Relative error definition (divide by the true value) matches OpenStax *College Physics 2e*
  §1.3 / standard usage; h20 key (4%) correct, 4.2% distractor named.
- 07h1 references: Lesson 1 does define $|a|$ as distance from 0 (01-real-numbers.md); Lesson 6
  Example 3 is $-5 \le 2x + 3 < 9$ as quoted.
- **Drills**: generated each of the 4 drills 1,500 times with `generate()` on the built course and
  recomputed answers independently from the prompt text (both candidates substituted for
  `abs-eq-var`; brute-force search over half-integers for `sum-distances`; midpoint/half-width and
  $|k|\delta$, $\varepsilon/|k|$ for the others). Every correct answer accepted, a wrong one rejected,
  no unfilled placeholders, "+ -", "1x" or thousands commas. 0 failures.
- **Pictures**: all 7 SVGs rendered; and-or, regions and triangle content correct (the
  triangle figure's arrows: 3 + 2 = 5, and 3 + (−5) = −2 with |a| + |b| = 8); label markers of
  and-or-blank (x = 15, left of each row) and regions-blank (centre of each box) on their parts.
- **Mermaid**: all 3 rendered; accTitle/accDescr describe the whole diagram; 06 chart and 07h1
  chart correct.
- **Plots**: 07h1 Example 1 and Example 5 plots rendered; functions and points correct, labels clear.
- **Glossary**: 8 terms, no duplicate term or alias in any `glossary*.yaml` of the course; every
  bolded term in 07h1/07h2 has an entry ("extraneous solution" is defined in
  `glossary-r2-a1-h1.yaml`, which fits). Cards: all 18 correct.

## Overlap

- `91-equivalence-extraneous.md` (a1-h1) has a section "Absolute value and hidden conditions" that
  solves $|2x - 1| = x - 5$ with the same "right side must be ≥ 0, check candidates" idea as 07h1
  Example 2 ($|2x + 1| = x - 4$, no solution). Both are fine on their own; it is a repeat of one
  worked idea across two honors lessons, not a contradiction. Not changed (91 is not my file).

## Left uncertain

- 07h2 Example 1(b) number line shows the midpoint 2.5 as a filled dot, which could be read as an
  "included endpoint" style; the caption names it as the midpoint, so I left it.
- The 07h1 Example 1 plot's "(1, 2)" label touches the line $y = 2x$ slightly; readable, left as is.
