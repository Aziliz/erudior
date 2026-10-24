# Round 2 review: mv-m7 (Vector fields and line integrals)

Reviewer for item 78. Scope: honors lessons 32h1 and 32h2, round 2 additions to lessons 29-32,
`questions/r2-mv-m7.yaml` (48), `drills/r2-mv-m7.yaml` (3), `glossary-r2-mv-m7.yaml` (9),
`cards-r2-mv-m7.yaml` (17), `images/mv-m7-*` (10 SVGs).

## Changes

### Answer keys / questions
- **mv-m7-r2-q18** (order, Green's theorem steps): "Check the hypotheses" and "Compute $Q_x - P_y$"
  were independent steps that could be swapped, so the order was not unique. Merged reading off
  $P$, $Q$ into the first step ("Identify $P$ and $Q$, and check ...") and made the second step
  "Compute $Q_x - P_y$ from that $P$ and $Q$", so it now depends on step 1. Explanation updated.
- **mv-m7-r2-h19** (bowtie): the correct choice was "$0$, though the outline encloses two triangles
  of total area 8", much longer than the other choices and a giveaway. Shortened to "$0$" and moved
  the remark into the explanation.

### Pictures and plots
- **32h1 vortex-field plot** (Example 2): with `step: 0.4` on $x \in [-1.8, 1.8]$ the renderer's grid
  lands on a floating-point near-zero point ($\approx 2\cdot10^{-16}$), where $1/r$ is huge; the arrows
  are scaled to that maximum, so the plot showed a single stray arrow and no field. Changed to
  `step: 0.5` (grid hits 0 exactly, the 0/0 point is skipped); re-rendered: the counterclockwise
  field now shows around the square and dashed circle.
- **32h2 fan-triangle plot**: the point labels "(0, 2)" and "(1, 0)" were crossed by polygon edges and
  "O" sat on a triangle edge. Moved these three labels to `labels` placed clear of all lines (and
  widened the view to $x \ge -1$, $y \ge -0.9$); re-rendered.
- **mv-m7-green-tiles.svg**: the big top and bottom arrowheads of the outer boundary $C$ sat on top of
  the middle squares' small arrows. Moved them into the gaps between columns (x = 213-237).
- **mv-m7-annulus.svg**: the label "C₂ clockwise" ran across the outer circle. Moved it inside the
  ring (x = 256, y = 290), clear of both circles and of "D".

### Lessons (facts / wording)
- **31 decision chart** ("Which method for a line integral?"): the Green branch asked "Is C a closed
  plane curve ...". Green's theorem as taught needs a *simple* closed curve; added "simple" to the
  node and to `accDescr`.
- **32h2 "Where this is used"**: "its wheel adds up a line integral equal to the enclosed area" →
  "proportional to the enclosed area, and the dial is scaled to read the area" (a polar planimeter's
  wheel rolls a distance equal to area divided by arm length).

## Checked and found right
- All 48 questions worked independently before reading keys; all keys, accept lists and
  distractor explanations correct apart from the two items above. Spot checks: q08 (7.5), q12 (13),
  q15 (3), q17 (24), q20 (all five pairs), h07 ($4\pi$; ellipse contains the unit circle), h08
  ($10\pi$), h15 (3), h16 (5.5), h17 (16), h23 ($(14/9, 8/9)$, also by square + triangle), h25,
  h26 (2,850 m²).
- 32h1: $\nabla\theta = \langle -y, x\rangle/(x^2+y^2)$; Example 1 ($4\pi$, $w = 2$); Example 2
  ($\pi/2$ per side); Example 3 decomposition $\mathbf F = \nabla\ln|\mathbf x| + 3\mathbf V$ and the
  three circulations ($6\pi$, 0, $-12\pi$); deformation-principle proof; decomposition theorem
  proof, with the self-crossing case correctly flagged as taken on trust. Physics:
  $\mathbf B = \frac{\mu_0 I}{2\pi}\mathbf V$ for current along $+z$ matches $B = \mu_0 I/(2\pi r)$
  with right-hand-rule direction (OpenStax University Physics Vol. 2, §12.3/§12.5); point vortex
  irrotational away from its center; both labeled idealizations.
- 32h2: edge integral derivation; Example 1 (area 9, corner triangles 1 + 1.5 + 1.5 + 3);
  fan triangles 6.5 and −1; bowtie orientations (left CCW, right CW); centroid formula; L-plate
  sums (c = 0, 4, 3, 2, 3, 0; 54; 36) recomputed in Python; centroid (1.5, 1) does lie on the inner
  edge. History: Meister 1769 and the names "Gauss's area formula" / "surveyor's formula" match
  Wikipedia "Shoelace formula"; the lesson makes no claim about Gauss's own date.
- Pictures: gradient-contours ellipses have the right $\sqrt2$ axis ratio for $x^2 + 2y^2 = 1, 3, 6$,
  all 8 gradient arrows are on $f = 3$ or $f = 6$ and within 0.2° of the $\nabla f$ direction, and the
  flow line is $y = x^2/4$ (a true gradient flow line). Tangential: green component along the
  tangent at P, normal part perpendicular (checked from coordinates). Winding figure: winding numbers
  of the three marker points computed from the SVG polyline: 2, 1, 0. Orientation arrows on the
  annulus and tile figures correct. All label markers (q01, q06, q16, h10) sit on the named parts.
- Mermaid (4): rendered; content and `accTitle`/`accDescr` correct.
- Drills: 300/200/200 random instances recomputed independently (sympy Polygon area/centroid;
  numerical contour integration for the winding drill). Shoelace quadrilaterals are always simple
  and counterclockwise; centroid tolerance 0.006 accepts 2-decimal rounding; winding drill excludes
  circles through the origin.
- Glossary: no term or alias duplicates any glossary file in the course. Cards correct.
- `content/math/check-module.sh multivariable mv-m7`: OK, zero problems after fixes.

## Overlap
- Ampère's law for a straight wire is also taught in core lesson 38 (round 1) and mv-m8's round 2
  Ampère-loop picture; 32h1 uses it only as an application of the winding number, which is fine.
- "Centroid of a triangle is the average of its vertices" also appears in 28h2 (mv-m6). Minor.
- 92-harmonic-functions (mv-h1) points forward to this winding-number lesson; consistent.

## Left uncertain
- Nothing substantive. The vortex-field plot still draws a few arrows on the axes and on the
  square's sides (the renderer's grid always includes multiples of the step); readable.
