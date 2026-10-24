# Round 2 review: trig-m1 (Angles and their measure)

Reviewer for item 124. Scope: honors lessons `04h1-measuring-earth-and-sky.md` and
`04h2-relative-rotation.md`, the round 2 additions to core lessons 01–04,
`questions/r2-trig-m1.yaml` (49), `drills/r2-trig-m1.yaml` (6), `glossary-r2-trig-m1.yaml` (21),
`cards-r2-trig-m1.yaml` (25), `images/trig-m1-*` (4 SVGs + blanks).

`content/math/check-module.sh trigonometry trig-m1` after fixes: 6 lessons, 93 questions,
16 drills, OK (zero problems).

## Changes

### Answer key / question fixes
- **trig-m1-r2-h17** (clock at 9:30): distractor $120^\circ$ matched no real mistake. Replaced it with
  $255^\circ$ (the larger of the two angles) and the explanation now names the mistakes behind
  $75^\circ$ (moving the hour hand back toward the 8) and $255^\circ$. Answer index unchanged (2).
- **trig-m1-r2-h07** (tower angle): the $14^\circ$ distractor had no explanation; added one
  (ten times too big, misplaced decimal point). The $25^\circ$ note kept.
- **trig-m1-r2-h24** (match): "A belt or chain → same direction" is false for a crossed belt. Left
  item changed to "A chain or an uncrossed belt"; explanation adjusted.
- **trig-m1-r2-h01** (label): marker 3 (Well at Syene) sat at the bottom edge of the well box;
  moved from y 35.9 to 33.4 (box center).

### Factual fixes
- **04h1, Eratosthenes:** "the first measurement of the Earth based on geometry that we know of"
  overstated. Aristotle (*De Caelo* II.14, 400,000 stadia) and Archimedes (*Sand Reckoner*,
  300,000 stadia) report earlier figures whose methods are unknown. Now: "the earliest measurement
  of the Earth whose geometric method we know", with a one-line note about those figures.
- **04h1, Example 4:** shown arithmetic $1.30 \times 3.26 \approx 4.25$ is wrong (it is 4.238).
  Now $d \approx 1.302$ pc and $1.302 \times 3.26 \approx 4.24$ ly (Gaia DR3 parallax 768.07 mas gives
  1.302 pc ≈ 4.25 ly with 3.2616 ly/pc, so 4.24 is consistent with the stated factor).
- **04h1, latitude:** defined as the central angle, which is only true on a spherical Earth
  (geodetic latitude differs slightly). Added "Treating the Earth as a sphere,".
- **04h2, gears:** "a belt or chain keeps the same direction" is labeled now: a chain or an
  uncrossed belt does; a crossed belt reverses. Same change in the Mermaid chart (edge label and
  accDescr) and in the "Forgetting direction" common mistake.
- **cards-r2-trig-m1, "Angular size of the Sun and the Moon":** "(about 31′ and 32′)" was in the
  wrong order for "Sun and Moon" (Sun ≈ 32.0′, Moon ≈ 31.1′). Now "Sun about 32′, Moon about 31′".
- **glossary "synodic period":** the formula needs $T_1 < T_2$ and motion in the same direction;
  stated now.

### Picture / figure fixes
- **04 core, belt-and-pulley shape:** the "5 cm" segment label sat on the small pulley's rim and
  radius. Moved to a free label between the pulleys.
- **04h1, small-angle shape:** the "D" label overlapped the object segment and the dashed arc.
  Moved to a free label just right of the object.
- **04h2, rolling-wheel shape:** "speed 0" touched the ground line; moved down and right.

### Drill fix
- **trig-m1-r2-parallax:** the prompt says to use 1 pc ≈ 3.26 ly, but `ly` was computed with
  3.2616, so the solution line "{d} × 3.26 ≈ {ly}" showed wrong arithmetic for 8 of 76 inputs
  (e.g. p = 0.06″: 16.67 × 3.26 = 54.3 shown as 54.4). `ly` now uses 3.26 and the solution shows
  `d` to 3 decimals (no mismatches on any input). Checked that answers using 3.2616, or `d` rounded
  to 2 decimals, still fall inside the 0.12 tolerance for every input.

## Checked and found right (a reader might doubt)
- Eratosthenes: dates about 276–194 BC; Cleomedes as main source; 5000 stadia, 1/50 circle,
  250,000 stadia; 157.5 m → 39,375 km (−1.6%, "within about 2%"), 185 m → 46,250 km (+15.6%,
  "about 16%") vs 40,008 km polar circumference; Aswan ≈ 3.0° east of Alexandria; latitudes
  31.20° N and 24.09° N differ by 7.1°. Shadow angle = central angle as alternate interior angles
  (the gnomon's radius line is the transversal of the two parallel rays): correct.
- Nautical mile 1852 m (International Hydrographic Conference, Monaco, 1929); a minute of
  latitude runs ≈1843–1862 m, so "good to well under 1%" holds. 1° ≈ 111.2 km; 1′ ≈ 1.853 km.
- au = 149,597,870.7 km (IAU 2012 B2); parsec = 648,000/π au (IAU 2015 B2) ≈ 3.0857e13 km
  ≈ 3.2616 ly. 1 rad ≈ 3437.7′ ≈ 206,264.8″. Bessel 1838 (61 Cygni) as first published stellar
  parallax.
- Chord vs arc: 0.13% at 10°, 0.0013% ("about 0.001%") at 1°, 1.1% at 30°, 4.5% at 60°.
- Sun 0.533° (32.0′), Moon 0.518° (31.1′); size ratio 400.8, distance ratio 389.2.
- Example 2: 16°05′ = 965′ = 965 nmi = 1787.2 km, 64.3 h. Example 1: r = 20,000/π ≈ 6366 km.
- 04h2: 3:40 → 130°; overlap at 180/11 min ≈ 16 min 22 s; every 720/11 ≈ 65.45 min, 11 times
  in 12 h; sidereal day 24 × 365.24/366.24 = 23.9345 h = 23 h 56 min 4 s; synodic month
  1/(1/27.32 − 1/365.24) = 29.53 d; Venus 583.9 d (sum-rate distractor 139.1 d); gearbox
  1200 → 300 → 75 rpm; tires 66/63.5 → 103.9 km/h, odometer 3.8% low. Solar day deviations
  (+30 s / −21 s) fit "up to about half a minute", labeled as a mean.
- Gear SVG: pitch radii consistent (12:20:30 teeth with 4 px/tooth spacing between centers),
  arrows clockwise / counterclockwise / clockwise as stated.
- All 49 questions worked independently; every key correct apart from the items above. Order
  questions (q03, q07, q13, q17, h11, h22) have one possible order. Select-alls clean.
- Drills: meridian-distance, angular-size, clock-angle, gear-train, tire-size recomputed
  independently; tolerances ≥ half the last place; clock figure uses x = sin, y = cos
  (clockwise from 12), correct.
- Every new SVG rendered with its label markers; all five Mermaid diagrams and all plot/shape
  blocks rendered and read. No glossary term or alias duplicates any `glossary*.yaml` in the course.

## Overlap with other round 2 lessons
- `39h2-cycloids.md` (trig-m9 honors) treats cycloids in depth; 04h2 only introduces the word
  with one figure and bolds **cycloid** (glossary entry is in this module; no duplicate found).
- `93-great-circle-navigation.md` (trig-h1) defines great circles and computes great-circle
  distance; 04h1 only defines "great circle" (glossary term here) and uses meridians. Light overlap,
  consistent statements.
- `12h2-small-angles.md` (trig-m4) refers back to this module's angular-size use; consistent.

## Left uncertain
- The 04h2 decision chart is `flowchart LR` with five branches; it reads fine on desktop but is
  wide (~900 px) on a phone. Not changed (it is a fan, not a chain).
- The small-angle figure's dashed arc is drawn through the object's endpoints (radius ≈ 10.2),
  while the caption says "radius d"; at this angle the difference is invisible, so left as is.

Sources: IAU 2012 Resolution B2 and IAU 2015 Resolution B2; NASA Sun and Moon fact sheets;
Gaia DR3 (Proxima Cen parallax 768.07 mas); Aristotle *De Caelo* II.14; Archimedes *Sand
Reckoner*; Cleomedes *Caelestia* I.7; IHO history of the nautical mile (1929); standard
coordinates for Alexandria (31.20° N, 29.92° E) and Aswan (24.09° N, 32.90° E).
