# Round 2 notes: calc-m7 (Applications of integration)

## Honors lessons (2)
- `lessons/30h1-pappus.md`, `calc-m7-h-pappus`, "Honors: Centroids and the theorems of Pappus" (45 min, about 1,700 words). Moments $M_x$, $M_y$ of a region between two curves; proof of Pappus's volume theorem from the shell and washer integrals; three earlier volumes from Lessons 27–28 redone from one centroid; torus; the cone as a check; Pappus run backward (half-disk centroid $4r/3\pi$); centroid of a curve and the second theorem (torus surface, semicircular arc centroid $2r/\pi$); when the theorem fails (axis through the region). 6 worked examples.
- `lessons/30h2-probability.md`, `calc-m7-h-probability`, "Honors: Probability density functions" (45 min, about 1,600 words). Densities, CDF and $F' = f$, mean as the centroid of the region under $f$, median, variance, exponential distribution (improper integral explained in place, with a pointer to Lesson 35; the mean's antiderivative is given and checked by differentiating, since by parts comes later in Lesson 31), uniform, and a short note on the normal density. This was listed as an optional coverage gap in VERIFY.md. 3 worked examples.

## Core lessons: additions only
- 26: labeled region-and-slice picture; Mermaid "vertical or horizontal slices?" chart.
- 27: washer picture (axis, R, r, thickness); Mermaid disk/washer setup flowchart.
- 28: shell and unrolled-slab picture; Mermaid "disks/washers or shells?" chart.
- 29: surface-band picture (radius y, slant width ds, circumference 2πy).
- 30: Mermaid "what varies → which slice" chart; submerged trapezoid plate picture (depth, width w(h), Δh).

## Questions: `questions/r2-calc-m7.yaml` (55)
- Core q01–q25, 5 per lesson: 5 text, 3 order, 4 match (one lesson has two), 5 select-all, 5 label; actually per lesson 1 text, 1 order or match (26, 27, 28, 30 have both), 1 select-all, 1 label. Module quiz: 2 per lesson (q01, q05, q06, q10, q11, q15, q16, q20, q21, q25).
- Honors Pappus h01–h15: 9 multiple choice, 2 text, 1 order, 1 match, 1 label (torus), 1 select-all.
- Honors probability h16–h30: 10 multiple choice, 2 text, 1 order, 1 match, 1 select-all.

## Drills: `drills/r2-calc-m7.yaml` (6, all for honors lessons)
`calc-m7-r2-centroid-between`, `calc-m7-r2-pappus-torus`, `calc-m7-r2-pappus-line`, `calc-m7-r2-pdf-power`, `calc-m7-r2-pdf-mean-median`, `calc-m7-r2-exponential`. Formulas checked symbolically for every input (Pappus volumes against washer integrals, densities normalized, means and medians). Rounded answers: 4 dp uses tolerance 0.00006, 3 dp 0.0006, 2 dp 0.006; Pappus torus uses `sigfigs: 3`.

## Pictures: `images/` (6 drawings, 5 with `-blank` copies)
calc-m7-area-slice, calc-m7-washer, calc-m7-shell, calc-m7-band, calc-m7-dam-gate, calc-m7-torus (each also `-blank.svg`, used by the label questions). All previewed with markers.

## Glossary and cards
- `glossary-r2-calc-m7.yaml`: 13 terms (moment about the y-axis / x-axis, torus, centroid of a curve, second theorem of Pappus, continuous random variable, probability density function, cumulative distribution function, expected value, median, variance, exponential distribution, uniform distribution). Checked against every glossary file in the course; "theorem of Pappus", "moment" and "centroid" already existed and were not redefined.
- `cards-r2-calc-m7.yaml`: 20 cards (11 Pappus/centroids, 9 probability). New topics: "Theorems of Pappus", "Probability density functions".

## For the reviewer
- History in 30h1 and h15: Pappus, Book VII of the *Collection*, about AD 320; Guldin restated the rule in 1640 (Centrobaryca vol. 2). I didn't say whether Pappus had a proof, since sources differ.
- The torus SVG is schematic (the cut cross-section disk is drawn face-on beside an oblique ring).
- Lesson 30h2 uses an improper integral and an antiderivative of $\lambda xe^{-\lambda x}$ before Lessons 31 and 35; both are explained in place.
- Label question q09 (washer) has the inner-radius marker inside the hole; "Hole" is not offered as a label, so it shouldn't be ambiguous.

## Errors found in existing content
None. Every worked example in Lessons 26–30 that I reused was rechecked (for example, Pappus reproduces 2π/15, 8π/15 and π/2 from Lessons 27–28).

## Sources
MacTutor biography of Paul Guldin (Centrobaryca, 1635–1641; the rule in vol. 2, 1640); Wikipedia, "Pappus's centroid theorem" (Collection Book 7, c. 320). The formulas are the standard ones (OpenStax Calculus Vol. 2 §2.6 moments and centers of mass, including Pappus; probability density material as in standard Calculus II texts).
