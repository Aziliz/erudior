# Geometry module 1 (geo-m1), round 2: review

Reviewer for item 51. Scope: honors lessons 04h1 and 04h2, round 2 additions to core lessons 01–04,
`questions/r2-geo-m1.yaml` (48), `drills/r2-geo-m1.yaml` (4), `glossary-r2-geo-m1.yaml` (16),
`cards-r2-geo-m1.yaml` (20), and the 14 `images/geo-m1-*` SVGs.

## Changes

### Answer-key / explanation errors (2)
- **geo-m1-r2-h05** (explanation): said $(2, 4)$ is on $\ell$ "but beyond $Q$". $(2, 4)$ is not on line $PQ$ at all
  (segment $PQ$ has $x = 2$ only at $Q(2, 1)$). Changed to "on $\ell$ but not on $\overline{PQ}$ (the segment
  reaches $x = 2$ only at $Q(2, 1)$)". The key itself, $(1.5, 2.5)$, is right.
- **geo-m1-r2-q20** (explanation): "there is no way to measure out 3.7 cm" is only true when no unit is given; from a
  given 1 cm segment, 3.7 cm is constructible (rational lengths are constructible). Added "with no given unit length
  … (if a 1 cm segment were given, 3.7 cm could be constructed from it)". The key [0, 2] stays defensible since
  the choice says "with compass and straightedge alone".

### Picture fixes (5)
- **geo-m1-figures.svg / -blank.svg** (Lesson 1, q01): the new picture named the ray $CD$ and the segment $EF$, while
  the round 1 `shape` block directly below it names segment $CD$ and ray $EF$. Two adjacent figures with the
  same letters for different objects would confuse a learner. Relabeled the picture to ray $EF$ (starts at $E$)
  and segment $CD$, matching the shape block; updated the lesson alt text and q01's alt text and explanation.
  Markers rechecked: all five sit on their figures.
- **geo-m1-box.svg**: label B overlapped the vertical edge $BF$; moved it right into the side face.
- **geo-m1-hexagon.svg**: label O sat on a dashed radius; moved it directly below the center, between the two lower radii.
- **geo-m1-pasch.svg**: label D sat on line $\ell$, and the lower arrowhead of $\ell$ was cut off at the image
  edge. Moved D left of $\ell$ and shortened the lower end (arrowhead moved with it) so it fits.
- **geo-m1-half-planes.svg**: label X sat on the dashed segment $XR$; moved it below the crossing point.

### Factual fixes in lessons (0)
None needed.

### Other fixes (0)

## Checked and found right
- **All 48 questions worked independently** before reading keys; every key, `accept` list and select-all set is
  correct; order questions (q05, q09, q14, q17, h09, h21) each have one order only (h21 counts 15, 20, 21, 22 are
  distinct). Match/label answers are plain text.
- **04h1 math**: betweenness via $AB + BC = AC$ and the $2(b - c)$ excess; ray definition (Moise-style); crossing
  fraction $t = d_P/(d_P - d_Q)$ (d is affine along a segment); Example 2 midpoint $(3/2, 2)$; Example 3; the Pasch
  proof from plane separation is complete and correct, including "never all three sides". Crossbar outline
  (choose $E$ with $A$ between $E$ and $B$, Pasch on $\triangle EBC$ with $\overleftrightarrow{AD}$) is the
  standard proof (Greenberg, *Euclidean and Non-Euclidean Geometries*; Moise) and is labeled as an outline.
  The reference to Lesson 13's base-angles proof ("draw the bisector of $\angle B$, meeting $\overline{AC}$")
  matches the lesson text.
- **Isosceles fallacy**: steps 1–3 valid (AAS with shared hypotenuse $AP$; HL); $AC - AB = 2\,EB$ follows from
  $AB = AE - EB$, $AC = AF + FC$. The accurate panel was checked numerically from its SVG coordinates: $AP$ bisects
  $\angle A$ (31.13° each side), $PB = PC$, $P$ on the circumcircle (R = 158.2 vs 158.1), $E$ on line $AB$ beyond $B$,
  $F$ on side $AC$, both feet perpendicular, $AE = AF$, $EB = FC$. $P$ lying on the circumcircle (arc midpoint of
  $BC$) is a standard fact, correctly deferred to Module 7.
- **History**: Pasch, *Vorlesungen über neuere Geometrie* (1882); Hilbert, *Grundlagen der Geometrie* (1899) includes
  Pasch's axiom among the order axioms; SMSG/Moise (1960s) use a plane separation postulate. The lesson says the
  fallacy was "popularized by W. W. Rouse Ball in the 1890s", which is supported: it appears in his *Mathematical
  Recreations and Problems of Past and Present Times* (1st ed. 1892; later *Mathematical Recreations and Essays*) and
  is often called the Rouse Ball paradox (sources below). The writer's notes give the 1892 title as *…and Essays*;
  the lesson does not name the book, so nothing to fix.
- **04h2 math** (all recomputed in Python): $\binom{n}{2}$, $\binom{n}{3}$; Example 1 (40); regions
  $(n^2 + n + 2)/2$, $2n$ unbounded and $\binom{n-1}{2}$ bounded (identity checked n = 3..15); Examples 2–4
  (15/22/10/12; n = 8; 24 angles, 12 pairs, 8 each of 45/90/135 and 4 opposite pairs = 28 = $\binom{8}{2}$); the
  parallel example 4 → 8 → 13 (agrees with $1 + n + \sum(\text{lines through point} - 1) = 1 + 5 + 7$); concurrent
  lines $\binom{2n}{2} - n = 2n(n-1)$, vertical partners always distinct; Moser $1 + \binom{n}{2} + \binom{n}{4}$
  (16, 31, 57). "$2^n$ right only for $n \le 2$" and "$2^{n-1}$ agreed for $n \le 5$" are both correct.
- **Four-lines picture**: 6 crossings, 11 regions numbered once each, 3 bounded (1–3), 8 unbounded (traced the 8 arcs
  around the boundary).
- **Other pictures** (rendered and read): protractor rays at 45° and 130° measured from the drawn coordinates, tick
  labels at the right angles; pairs-compare angles measure about 35/55, 60/120, 120/60; hexagon vertices on the
  circle; convex panel; perp-bisector and angle-parts label markers each on the named part.
- **Mermaid (6)**: rendered all; content right, accTitle/accDescr describe the whole chart. Lesson 4's chart is LR
  but only two boxes deep, so it fits.
- **Drills**: crossing drill recomputed independently (line–segment intersection, 20,000 random cases, all match,
  crossing always strictly inside the segment); tolerance 0.006 ≥ 0.005 for 2-decimal answers. Lines-points,
  regions and concurrent formulas verified; smallest angle 180/n with tolerance 0.006 (e.g. 25.71 for n = 7). No
  placeholder collisions.
- **Glossary**: no term or alias duplicates any other `glossary*.yaml` in the course (grepped each term and alias).
  Definitions correct. Cards correct.
- `content/math/check-module.sh geometry geo-m1`: OK after fixes.

## Overlap
- geo-m2's honors lesson `07h3-mathematical-induction.md` re-derives the line-regions formula (as an induction proof)
  and restates the circle-regions formula. Its writer already cross-references 04h2 and dropped a duplicate drill,
  glossary entry and cards, so the overlap is deliberate and small. No other round 2 lesson in the course repeats
  plane separation, Pasch or the Crossbar Theorem.

## Left uncertain
- None affecting correctness. q01-figure letters now follow the round 1 shape block; if the course owner prefers
  alphabetical order in the picture, the round 1 block would have to change instead.

## Sources
- Greenberg, *Euclidean and Non-Euclidean Geometries* (plane separation, Pasch, Crossbar Theorem proof).
- Moise, *Elementary Geometry from an Advanced Standpoint* (betweenness, plane separation).
- Hilbert, *Grundlagen der Geometrie* (1899); Pasch, *Vorlesungen über neuere Geometrie* (1882).
- Rouse Ball fallacy: [UGA EMAT, "Rouse Ball Paradox"](https://jwilson.coe.uga.edu/EMAT6680Fa09/Arican/emat6690/Rouse%20Ball/Rouse%20Ball%20Paradox.html);
  [HathiTrust record, *Mathematical recreations and problems of past and present times*](https://catalog.hathitrust.org/Record/000419135/Cite);
  [cut-the-knot, All Triangles Are Isosceles](https://www.cut-the-knot.org/Curriculum/Fallacies/AllTrianglesIsosceles.shtml).
- Wantzel (1837) for the impossibility of angle trisection (q20 says "1800s").
