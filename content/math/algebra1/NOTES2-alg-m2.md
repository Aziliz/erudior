# Round 2 notes: alg-m2 (Inequalities and absolute value)

`content/math/check-module.sh algebra1 alg-m2`: build and checker report zero problems
(4 lessons, 66 questions, 9 drills, 28 cards).

## Added

**Honors lessons** (`honors: true`, `module: alg-m2`)
- `lessons/07h1-abs-cases.md`, `alg-m2-h-abs-cases`, "Honors: Absolute value by cases" (45 min,
  about 2,100 words with alt text). Covers the piecewise definition of $|u|$, critical values,
  case analysis, extraneous solutions of $|u| = v$ when $v$ contains $x$, why
  $|u| < v \iff -v < u < v$ and $|u| > v \iff u < -v$ or $u > v$ hold for every $v$ (proof via
  $|u| = \max(u, -u)$), splitting a three-part inequality with $x$ in every part, and sums of two
  absolute values by regions, with the distance reading (flat bottom, 0, 2 or infinitely many
  solutions). Examples: $|x - 3| = 2x$ (two methods), $|2x + 1| = x - 4$ (no solution),
  $|2x - 1| \le x + 4$, $|x + 2| > 2x - 1$, $|x - 1| + |x + 2| = 5$.
- `lessons/07h2-tolerance-error.md`, `alg-m2-h-tolerance`, "Honors: Tolerance, error bounds and
  the triangle inequality" (45 min, about 1,700 words). Covers the interval ↔ $|x - m| \le h$
  conversion (midpoint, half-width), tolerances and percent tolerances, absolute and relative error,
  how error passes through $y = kx + b$ (factor $|k|$, the backward question as a preview of the
  limit definition), the triangle inequality with a proof and its distance form, and why error
  bounds add for both sums and differences. Examples: thermostat and $-3 < x < 8$, 470-ohm 5%
  resistor, fence cost, $x \pm 0.2$ and $y \pm 0.1$.

**Core lessons** (additions only; nothing rewritten)
- 06-inequalities: Mermaid flowchart of the solving procedure (with the "negative? reverse"
  decision), and the SVG `alg-m2-and-or.svg` comparing $A$, $B$, "A and B", "A or B" on four
  stacked number lines, each with a short lead-in sentence. (The lesson already had 3 number lines.)
- 07-absolute-value: SVG `alg-m2-distance.svg` (center $c$, half-width $r$, endpoints $c \pm r$)
  and a Mermaid decision chart (isolate → is $k$ negative? → which symbol → rule). (The lesson
  already had 2 number lines and a plot.)

**Pictures** (7 SVGs, original, 1–10 KB each, rendered and checked, label markers checked):
alg-m2-and-or, alg-m2-and-or-blank, alg-m2-distance, alg-m2-distance-blank, alg-m2-h-regions,
alg-m2-h-regions-blank, alg-m2-h-triangle. The three `-blank` files are for label questions.

**Diagrams** (3 Mermaid, all with accTitle/accDescr, `flowchart TD`, rendered): solving a linear
inequality (06), choosing the absolute value rule (07), the case method (07h1).

**Figures in honors lessons**: 07h1 has 3 plots ($|x - 3|$ vs $2x$; $|2x - 1|$ vs $x + 4$;
$|x - 1| + |x + 2|$ vs $y = 5$) and the regions SVG; 07h2 has a number line and the triangle
inequality SVG.

**Questions** (39, `questions/r2-alg-m2.yaml`)
- Core, `alg-m2-r2-q01`…`q11`. Lesson 06 (q01–q05): text q01, order q02, match q03, select-all
  q04, label q05. Lesson 07 (q06–q11): text q06 and q11, match q07, select-all q08, label q09,
  order q10. module_quiz: q01, q05, q06, q09.
- Honors 07h1, `h01`…`h14` (14): MC 8, text 2 (h03, h11), select-all 1 (h04), order 1 (h07),
  label 1 (h08), match 1 (h09).
- Honors 07h2, `h15`…`h28` (14): MC 8, text 2 (h16, h21), select-all 2 (h19, h25), match 1
  (h24), order 1 (h26).
- No module_quiz on honors questions. Answer positions of the 16 MC questions: 4 each at 0–3.

**Drills** (4, `drills/r2-alg-m2.yaml`): `alg-m2-r2-abs-eq-var` ($|x + a| = bx$, one real and one
extraneous candidate) and `alg-m2-r2-sum-distances` ($|x - p| + |x - q| = s$) for 07h1;
`alg-m2-r2-interval-to-abs` (midpoint and half-width) and `alg-m2-r2-error-bound` (forward and
backward error through $y = kx + b$; exact terminating decimals, shown with `num4`) for 07h2.
Each was generated 2,000 times with tsx (`generate()` + `checkAll()`) against an independent
solver (brute force for the equations): every correct answer accepted, a wrong one rejected,
and no stray signs or unfilled placeholders in the text.

**Glossary** (`glossary-r2-alg-m2.yaml`, 8 terms): critical value, case analysis, midpoint,
half-width, tolerance, absolute error, relative error, triangle inequality. Checked against
every `glossary*.yaml` in the course. "extraneous solution" is bolded in 07h1 but was already
defined by the a1-h1 writer in `glossary-r2-a1-h1.yaml` (general definition that fits), so I did
not add a second entry.

**Cards** (`cards-r2-alg-m2.yaml`, 18): 9 on "Absolute value by cases", 9 on "Tolerance and
error".

## For a reviewer to double-check
- 07h1 bolds "extraneous solution", which relies on the a1-h1 writer's glossary entry. If that
  entry is removed or renamed, add it to `glossary-r2-alg-m2.yaml`.
- The claim that $|u| < v \iff -v < u < v$ and $|u| > v \iff u < -v$ or $u > v$ hold for every
  real $v$ (07h1). It follows from $|u| = \max(u, -u)$; also checked with sympy on the examples.
- Euclid attribution: the triangle inequality for triangles is Proposition 20 of Book I of the
  *Elements*, "about 300 BC".
- 07h2 says resistors are "commonly sold with 5% or 1% tolerance" and mentions the
  root-sum-of-squares rule only as a statistics estimate of typical error, clearly marked as not a
  guarantee. Choice "$3.6 \pm 0.0087$ m" in h27 is that estimate ($0.005\sqrt3$), used as a
  distractor.
- Label markers: and-or-blank at x = 15 (left margin of each row); distance-blank on the two
  endpoints, the center tick and the right half of the double arrow ("Distance r from the
  center"); regions-blank in the middle of each region box.

## Errors found in existing content
None. All existing alg-m2 questions, drills, cards and glossary entries were read; nothing was
edited.

## Sources
Standard algebra (definitions of absolute value, interval notation, triangle inequality). Euclid,
*Elements*, Book I, Proposition 20. Resistor tolerance bands (common E-series values: 5% and 1%)
from general electronics references. All numbers recomputed in Python/sympy.
