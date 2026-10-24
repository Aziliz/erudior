# Round 2 notes: trig-m1 (Angles and their measure)

`content/math/check-module.sh trigonometry trig-m1`: build and checker report zero problems (6 lessons, 93 questions, 16 drills).

## Honors lessons (2)

- `lessons/04h1-measuring-earth-and-sky.md`, id `trig-m1-h-earth-sky`: **Measuring the Earth and the sky with arcs** (45 min). It uses $s = r\theta$ three ways. Eratosthenes' measurement (parallel rays, alternate interior angles, $r = s/\theta$, with an honest section on why his accuracy is debated). Latitude, meridians, great circles, the nautical mile and the knot. Angular size with the small-angle approximation, arcminutes, arcseconds and milliradians, and the Sun/Moon coincidence. Parallax, the astronomical unit and the parsec. 4 worked examples. Topics: Measuring the Earth, Small angles.
- `lessons/04h2-relative-rotation.md`, id `trig-m1-h-relative-rotation`: **Relative rotation: clocks, gears, rolling wheels and the sky** (45 min). It covers relative angular speed with the clock-hand angle and overlap times; the sidereal and solar day; the Moon's synodic month ($1/T = 1/T_1 - 1/T_2$); gear trains (tooth counts, direction reversal, idler and compound gears); rolling without slipping (top at $2v$, contact point at rest, the cycloid); and a speedometer error from a tire change. It ends with a "which link?" decision chart. 5 worked examples. Topics: Relative rotation, Gears and rolling.

The lessons don't duplicate other writers' work. The m3 and m4 honors lessons on small angles cover $\sin t \approx t$; mine uses only the arc/chord idea for angular size. The m2 horizon lesson measures the Earth by the dip of the horizon, not by Eratosthenes' method. I did not bold "small-angle approximation", because the m4 writer bolds it and will define it in the glossary.

## Core lesson additions (additions only)

- 01 Angles: the SVG `trig-m1-angle-parts.svg` (vertex, initial side, terminal side, positive rotation) and a Mermaid loop for finding the coterminal angle in [0°, 360°).
- 02 Radians: a plot of six radius-length arcs around a circle (2π ≈ 6.28), and a Mermaid chart for degrees ↔ radians.
- 03 Arc/sector: a new short section "The parts of a circle you need" with `trig-m1-sector-parts.svg`, and a Mermaid chart (radians? → length or area → formula → units).
- 04 Speed: a Mermaid chain from rpm to mph (Example 1), and a belt-and-pulley shape figure for Example 3.

## Questions (`questions/r2-trig-m1.yaml`, 49)

- Core lessons: 20 (`trig-m1-r2-q01`–`q20`), 5 per lesson. Each lesson has a text, an order, a select-all and a match question. Lessons 01 and 03 also have a label question; lessons 02 and 04 have a second text question. 8 are `module_quiz: true`, two per lesson.
- Honors: 29 (`h01`–`h15` for earth-sky, `h16`–`h29` for relative rotation). 14 are multiple choice, 5 text, 4 select-all, 2 match, 2 order, 2 label. Honors questions have no `module_quiz` (it would be ignored).
- The multiple-choice answer positions are spread over 0–3.
- In total: 11 text, 6 order, 6 match, 8 select-all, 4 label, and 14 single-answer multiple choice (all in the honors lessons).

## Pictures and diagrams

- SVGs (all original, each with a `-blank` copy for its label question): `trig-m1-angle-parts`, `trig-m1-sector-parts`, `trig-m1-eratosthenes`, `trig-m1-gear-train`. Each is 1–5 KB. I previewed every one, with markers.
- Mermaid diagrams: 5 (4 in the core lessons, 1 in h2). Figures: 4 new shape/plot blocks.

## Drills (`drills/r2-trig-m1.yaml`, 6)

`trig-m1-r2-meridian-distance`, `-angular-size`, `-parallax` (lesson h1) and `-clock-angle` (with a clock figure), `-gear-train`, `-tire-size` (lesson h2). I generated 400 instances of each and checked them against independent Python formulas. I also checked that answers a student rounds at intermediate steps are still accepted: parallax light-years computed with 3.26 from a rounded distance, and gear output from a middle speed rounded to 2 decimals. There are no thousands separators inside math.

## Glossary and cards

- `glossary-r2-trig-m1.yaml`: 21 terms: gnomon, latitude, meridian, great circle, nautical mile, knot, angular size, arcsecond, milliradian, parallax, parallax angle, astronomical unit, parsec, relative angular speed, solar day, sidereal day, synodic period, gear train, idler gear, compound gears, cycloid. I checked them against every `glossary*.yaml` in the course and found no duplicate terms or aliases.
- `cards-r2-trig-m1.yaml`: 25 cards, 13 for h1 and 12 for h2.

## For the reviewer to double-check

- Eratosthenes. The dates (about 276–194 BC); Cleomedes as the main source; 5000 stadia and 1/50 of a circle; proposed stadion lengths of about 157.5–185 m, giving within about 2% or about 16% too large; Aswan about 3° east of Alexandria; a latitude difference of about 7.1°. All of this is labeled as debated or approximate in the text.
- Defined values. The nautical mile is exactly 1852 m (international since 1929). The au is 149,597,870.7 km (IAU 2012). The parsec is exactly 648,000/π au (IAU 2015). The Proxima Centauri parallax is about 0.768″, and stellar parallax was first measured by Bessel in 1838.
- The solar day varies from 24 h by "up to about half a minute" (simplified; labeled as a mean in the text). The sidereal day is 23 h 56 min 4 s. The Venus synodic period of about 584 days is used in h21.
- q19: the pairs from bicycle Example 4 are sprocket and wheel (shared ω) and chainring and sprocket (shared linear speed).
- I recomputed every number in Python: arc/chord errors (0.13% at 10°, 0.001% at 1°, about 1% at 30°, about 4.5% at 60°), Sun/Moon angular sizes, clock times, gear ratios and tire factors.

## Errors found in existing content

None in the trig-m1 lessons, questions, drills, cards or glossary. I edited no existing items.

## Sources

Standard reference values, recalled rather than looked up in this session: IAU 2012 Resolution B2 (au), IAU 2015 Resolution B2 (parsec), the 1929 International Hydrographic Conference (nautical mile), NASA fact-sheet sizes and distances for the Sun and Moon, the Gaia DR3 parallax for Proxima Centauri, and standard histories of Greek astronomy for Eratosthenes and Cleomedes. The facts are in my own words; nothing is copied.
