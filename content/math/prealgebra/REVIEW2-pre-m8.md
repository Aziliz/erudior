# Round 2 review: pre-m8 (Measurement and geometry)

Reviewer for item 101. Scope: honors lessons 35h1, 35h2, 35h3; the round 2 additions to core lessons 30 to 35; `questions/r2-pre-m8.yaml` (70); `drills/r2-pre-m8.yaml` (9); `glossary-r2-pre-m8.yaml` (20); `cards-r2-pre-m8.yaml` (29); the 17 `images/pre-m8-*` SVGs.

`content/math/check-module.sh prealgebra pre-m8`: build and checker OK, zero problems after the fixes.

## Changes

| Where | Problem | Fix | Source |
|---|---|---|---|
| `pre-m8-r2-q13` (match, area formulas) | Answer key error. "Rectangle → length times width" alongside "Parallelogram → base times height". A rectangle's area is also base times height, and match answers may repeat, so a learner who matched Rectangle to "base times height" would be marked wrong for a correct answer. | Replaced the Rectangle row with "L-shaped room → split into rectangles and add their areas" (Lesson 32, composite figures). Explanation updated. | Lesson 32 |
| `pre-m8-r2-q16` (label, circle parts) | Ambiguous key. Marker 3 sits on the left half of the diameter, and that half (from the edge to the center) is itself a radius, so "Radius" was a defensible answer for marker 3. | Stem now says marker 2 is on the red segment and marker 3 is on the black segment that runs all the way across the circle. | Definition of radius and diameter, Lesson 33 |
| 35h3, intro | Factual error about the course. It said the module's lessons used a board that was "8 ft". No pre-m8 lesson has one. | Changed to the fish tank that was "30 in" long (Lesson 34, Example 1). The can that was "11 cm" tall is real (Lesson 34, Example 2). | Lessons 30 to 35 |
| 35h1, "Cutting a polygon into triangles" | Incomplete reasoning. It said triangle corners fit side by side only "at the chosen vertex". In a fan triangulation, the far end of each diagonal also has two triangle corners meeting there. | Now says "wherever two or more triangles share a vertex (the chosen vertex, and the far end of each diagonal)". | Standard proof |
| 35h1, end of the tilings section | Overstated. It said the 360° rule "tells you which mixtures can work". The rule is necessary but not sufficient: some vertex arrangements add to 360° but can't be continued across the whole plane (for example 3.7.42). | Now says the rule rules out mixtures that can't work, and that passing it at one point doesn't by itself guarantee a whole floor can be covered. | Grünbaum and Shephard, *Tilings and Patterns* (vertex types vs. tilings) |
| 35h1, honeycomb note | Date imprecise (the writer flagged it). The proof was announced in 1999 and published in 2001. | Now reads "In 1999 (published in 2001)". | Hales, arXiv [math/9906042](https://arxiv.org/abs/math/9906042) (June 1999); *Discrete Comput. Geom.* 25 (2001) 1–22, [doi:10.1007/s004540010071](https://doi.org/10.1007/s004540010071) |
| 35h2, "Volume: why one third?" | Possibly misleading. The lesson had just said that its pyramids are *right* pyramids (apex over the center of the base). The three pyramids that fill a cube are not right pyramids: each apex is above a corner of its base. | Added a parenthetical that says so and notes that the height is still the perpendicular distance, $s$. | Standard decomposition of the cube |

Counts: answer-key errors 2 (q13, q16), factual fixes 3 (35h3 board, 35h1 tiling overstatement, 35h1 Hales date), picture fixes 0, other fixes 2 (35h1 proof wording, 35h2 right-pyramid note).

## Checked and found right

- **All 70 questions worked independently.** Every MC key and distractor explanation is correct; e.g. h03 (605°, 115°; 295° = 900 − 605), h16 ($240\pi$ = diameter used as $r$), h18 (340 = height used, 620 = no ½), h20, h25 ($24\pi \approx 75$, $72\pi \approx 226$), h26. q25's order is unique: 24 < 25 < $8\pi \approx 25.1$ < 27. h12's 3.3.3.4.4 arrangement is a real vertex type. All order questions have exactly one order.
- **Select-all items.** q03, q09, q14 (the two-triangle split $18 + 10 = 28$ is right), q19, q24, q28, h09, h12, h23, h32, h38: every listed answer is right and every other choice is clearly wrong. h38's "5.0 m" relies on trailing zeros after a decimal point showing precision. That matches pre-m6 22h2, which treats only whole-number trailing zeros as ambiguous, and the whole-number items in this module (h30's 5,600, 35h3's 4,300 m and the bounds drill's 920 cm) all state their precision.
- **Lesson numbers recomputed in Python.**
  - Great Pyramid: $230^2 \cdot 147/3 = 2{,}592{,}100$ m³. Standard figures are about 230.3 m base, 146.6 m original height and about 2.6 million m³.
  - Cones and spheres: $12\pi \approx 37.7$; $90\pi \approx 282.7$; basketball $2{,}304\pi \approx 7{,}238$ and $576\pi \approx 1{,}810$ (a size 7 ball is 29.5 in around, so the diameter is about 23.9 cm); silo $108\pi \approx 339.3$.
  - 35h3 bounds: 33.75 and 46.75 (+16.9% and −15.6%); 857.375 and 1,157.625; $\pi(4.2)^2 = 55.4177$, with bounds 54.1 and 56.7.
- **Facts.**
  - Archimedes (c. 287–212 BC): "the 200s BC" is right for *On the Sphere and Cylinder*.
  - Cicero, *Tusculan Disputations* V.64–66: as quaestor in Sicily (75 BC) he found the overgrown tomb marked with a sphere and cylinder. That was more than a century after 212 BC.
  - Hales' theorem is stated correctly: equal-area partitions of the plane, least total perimeter.
- **Course conventions.**
  - "Ties round up" matches Lesson 01 (5 or more rounds up).
  - The significant-figures rule cited in 35h3 matches pre-m6 22h2 (products round to the fewest significant figures).
  - Lesson 31 does mention quadrilaterals' 360°, as 35h1 says.
- **The tiling argument.** It is valid even without "corner to corner". A vertex landing on another tile's edge would need 108° multiples to make 180°, which is impossible, so only triangles, squares and hexagons tile alone.
- **Drills.** I generated 400 instances of each of the 9 drills (3,600 total) with the app's own generator. Python recomputed the answers from the prompt text as shown. Every correctly rounded answer was accepted (tolerance 0.051 for tenths; exact bounds), and every off-by-one answer was rejected. There are no unfilled placeholders and no thousands commas inside math. All integer-angle choices give whole exterior angles.
- **Pictures.** I rendered all 11 labeled SVGs and all 6 blanks with their markers. The geometry is right: the cylinder net's rectangle is about $2\pi r$ wide relative to the circles, the tilings are 6.6.6 and 4.8.8, and the ruler box covers 6.5 to 7.5. No text overlaps or is cut off, and every marker sits on the part its label names.
- **Mermaid and figures.** I previewed all 7 Mermaid charts (30, 31 ×2, 32, 33, 34, 35). The content is right and they are readable, and `accTitle`/`accDescr` describe each whole chart. The 35h2 ```shape (sphere in cylinder) and the 35h3 ```numberline (6.5 closed, 7.5 open) render cleanly with no labels on lines.
- **Glossary and cards.** Definitions are correct. No term or alias duplicates any glossary file in the course (checked case-insensitively across every `glossary*.yaml`).

## Uncertain or for the course owner

- **Overlap / gap: scaling area and volume is now taught nowhere.** NOTES2-pre-m8 says the writer deleted a scaling lesson because "the pre-m4 writer's 16h3-scaling-area-volume.md covers the same ground". NOTES2-pre-m4 says the pre-m4 writer deleted *their* 16h3 because "the pre-m8 writer's 35h1-scaling.md covers the same material". Neither file exists (`lessons/` has only 16h1, 16h2, 35h1–35h3). The $k^2$/$k^3$ square–cube material was dropped by both writers. If it should exist, it belongs in a pre-m8 honors lesson; that is outside a reviewer's remit.
- No other overlap with the other modules' round 2 lessons. 35h3 and pre-m6 22h2 cross-reference each other and are consistent.
- The q06 marker 2 sits inside the right angle, a little up and right of the square. It is clear, but it could be moved closer.
