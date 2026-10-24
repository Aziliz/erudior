# Round 2 review: calc-m7 (Applications of integration)

Reviewer pass over the writer's round 2 work: honors lessons 30h1 (Pappus) and 30h2 (probability
densities), the additions to core Lessons 26–30, `questions/r2-calc-m7.yaml` (55),
`drills/r2-calc-m7.yaml` (6), `glossary-r2-calc-m7.yaml` (13), `cards-r2-calc-m7.yaml` (20) and
the 12 `images/calc-m7-*` files. `content/math/check-module.sh calculus calc-m7` reports OK
(zero problems) after the fixes.

## Changes

### Answer key / question fixes
- **calc-m7-r2-q20** (match, $1 + (y')^2$): the answer "It is a perfect square" for
  $y = \frac{x^3}{6} + \frac1{2x}$ also fits $y = \ln(\cos x)$ ($1 + \tan^2x = \sec^2x$ is a perfect
  square), and match answers may repeat, so a learner could defensibly answer it for both and be
  marked wrong. Changed the answer to the exact expression "It equals (x²/2 + 1/(2x²))²" and added
  a sentence to the explanation.

### Picture / marker fixes
- **calc-m7-r2-q04** (area-slice label): markers 1 (Top curve) and 2 (Bottom curve) sat on parts of
  the line and parabola *outside* the region, where their roles are reversed (beyond $x = 2$ and
  left of $x = -1$ the parabola is above the line). Moved both markers onto the boundaries between
  the crossings (line at $x = 1.3$, parabola at $x = 1.6$, computed from the SVG's scale) and
  updated the alt text.
- **calc-m7-r2-q09** (washer label): marker 2 (Outer radius R) sat at the arrow's midpoint, right
  on the edge of the hole, so it could be read as the hole's edge. Moved it out along the arrow
  into the washer's face (42.7, 59.2).
- **calc-m7-r2-h13** (torus label): marker 5 (Path of the centroid) sat where the dashed path
  crosses the axis line, so it touched both. Moved to the lower-left of the dashed path (30.1, 62.3).
- **images/calc-m7-washer.svg** (lesson picture): the word "hole" straddled the washer's outer edge
  with its leader line through the text. Moved the text outside the washer and redrew the leader.
- **30h1 plot (Example 1)**: rendered with the app's figure code; the curve labels "y = x" and
  "y = x²" collided at the top right, and the point label "centroid (1/2, 2/5)" ran across the
  parabola. Replaced them with free `labels` placed off the curves; the caption now names the dot
  as the centroid.
- **30h2 plot (Example 1)**: the curve label sat on the curve and the x-axis near $x = 2$. Moved
  to a free `labels` entry above the curve.
- **30h2 plot (Example 3)**: the point labels "median 2.77" and "mean 4" printed on top of each
  other, and the curve label sat inside the shaded tail across the curve. Moved the curve label
  above the curve; dropped the two point labels and said in the caption which dot is which.

### Other fixes
- **Lesson 29** (core addition): the writer's sentence under the band picture ended with "not the
  horizontal step $dx$", repeating the very next (original) sentence. Trimmed the added sentence.
- **calc-m7-r2-pdf-mean-median** (drill): `b` could be 1, printing the density as
  $\dfrac{3x^2}{1}$. Raised `b` min to 2. (Answers were already correct.)

## Checked and found right
- Every new question worked independently before reading the key (all 55). Numbers recomputed:
  $32/3$; $7\pi/15$ about $y = -1$; $\pi/6$ both ways for q13 and $2\pi/15$ for the distractor;
  $16\pi$ for the triangle in h04 (Pappus and shells); $40\pi^2$, $16\pi^2$; $4/\pi$ vs $6/\pi$;
  $k = 1/8$, $P = 1/4$; mean $2/3$, median $1/\sqrt2$; $e^{-1} \approx 0.368$; $10\ln2 \approx 6.93$;
  variance $3/20$. Order questions have no swappable steps; select-all sets are exact.
- Lesson numbers: Example 2's table in 30h1 matches Lesson 27 ($2\pi/15$, $8\pi/15$ about $y = 2$)
  and Lesson 28 ($\pi/2$ about $x = 2$); the cone check $\frac13\pi a^2h$; torus
  $6\pi^2 \approx 59.22$, $12\pi^2 \approx 118.4$; half-disk $4r/3\pi \approx 0.424r$, arc
  $2r/\pi \approx 0.637r$. In 30h2: $k = 3/4$ and $5/32$; Example 2's $\mu = 3/2$,
  $m = \sqrt[3]4 \approx 1.587$, $\sigma^2 = 3/20$, $\sigma \approx 0.387$; Example 3's 0.223, 0.393,
  2.77. The exponential mean's antiderivative $-(x + 1/\lambda)e^{-\lambda x}$ checked with sympy.
- Cross-references: Lesson 16 is L'Hôpital, 23 FTC, 31 by parts, 32 includes trig substitution,
  34 numerical integration, 35 improper integrals: all correct.
- Proofs of both Pappus theorems (shell integral $= 2\pi M_y$, washer integral $= 2\pi M_x$,
  $S = 2\pi\int y\,ds$) are correct; the "axis must not cut the interior" condition is stated.
- Drills: all six formulas verified symbolically for every input in range (centroid of the region
  between $y = mx$ and $y = x^2$; Pappus volume about $y = -k$ against the washer integral;
  normalization, CDF, mean and median of $kx^n$; exponential tail and median). Tolerances accept
  a correctly rounded answer for every input (Pappus-line `relTolerance` 0.0005 against a smallest
  volume of 1.466, which needs only 0.00034; 4 dp uses 0.00006, 3 dp 0.0006, 2 dp 0.006).
- All six pictures rendered and looked at, labeled and blank, with markers: geometry consistent
  (slice endpoints on the curves, arrow tips on the ellipses, torus dimensions $R - r$ and $R + r$
  match the hole and outer edge). The torus is schematic (cut disk drawn face-on), as the writer
  noted; acceptable.
- All five Mermaid diagrams rendered; content and accTitle/accDescr correct.
- Glossary: no term or alias duplicates any other glossary file in the course. Cards correct.
- History: Pappus, *Collection* Book VII, about AD 320; Guldin's *Centrobaryca* (four volumes,
  1635–1641), the rule in volume 2 (1640). Consistent with the MacTutor biography of Guldin
  (https://mathshistory.st-andrews.ac.uk/Biographies/Guldin/) and the standard account; I could
  not re-fetch the page in this session, so this rests on that source as I know it.

## Overlap
- calc-m8's honors lesson 36h2 (gamma function) builds on 30h2's exponential distribution and
  variance shortcut: complementary, not duplicated. **But 36h2 (line 114) says 30h2 "found its
  mean $\frac1\lambda$ with integration by parts"; 30h2 actually gives the antiderivative and checks
  it by differentiating (by parts comes later, in Lesson 31).** That's calc-m8's file; not edited.
  The calc-m8 reviewer should change it to something like "found its mean $\frac1\lambda$".

## Left uncertain
- Nothing in the content. The washer label's marker 2 now partly covers the outer arrowhead;
  it is still unambiguous.
