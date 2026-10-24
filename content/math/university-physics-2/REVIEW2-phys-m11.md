# Round 2 review: phys-m11 (Light and optics)

Reviewer for item 145. Scope: honors lessons 19h1 to 19h3, the round 2 additions to core lessons 15 to 19, `questions/r2-phys-m11.yaml` (67), `drills/r2-phys-m11.yaml` (7), `glossary-r2-phys-m11.yaml` (20), `cards-r2-phys-m11.yaml` (29) and `images/phys-m11-*` (14 SVGs). After the fixes, `content/math/check-module.sh university-physics-2 phys-m11` reports OK with 0 problems.

## Changes

| Where | Problem | Fix |
|---|---|---|
| 19h2, the N = 2 vs N = 8 plot | The `N = 2` and `N = 8` curve labels and the long x-axis label all rendered on top of each other and on the curves at the bottom right. The y-axis tick labels (at x = 0) ran through the central peak. | Range changed to x = 0.5 to 3.75, so the y axis is on the left edge and the peaks are the orders 1, 2 and 3. Curve labels removed. x label shortened to "m". The caption now says which curve is dashed (N = 2) and which is solid (N = 8), and that the axis is φ/2π, which equals m at each principal maximum. Re-rendered: nothing overlaps. |
| q11 (concave-mirror label question), marker "Real image" | At (56.8, 57.2) the marker sat on the ray through F, just to the right of the image arrow, so it could be read as marking the ray. | Moved to (52.6, 56.0), beside the image arrow's shaft and clear of every ray. Re-rendered. |
| h39, explanation | Said splitting the power in proportion to V (+3.0 D and +2.0 D) would "double the color error". It doesn't double anything in particular. | Now gives the actual leftover error, 3.0/60.0 + 2.0/40.0 = 0.10 D, and notes that two converging lenses can't cancel each other's color spread. |
| Card "History of X-ray diffraction" | Dated the Braggs' plane explanation to 1913. W. L. Bragg presented it in November 1912 and it was published in 1913. | Changed to "1912–13". |

Counts: answer-key errors 0, factual fixes 1 (the Bragg date), picture fixes 2 (the plot and the q11 marker), other fixes 1 (the h39 explanation).

## Checked and found right (things a reader might doubt)

- **Every question was worked independently**, with the numbers recomputed in Python.
  - h01 to h05: 400 fringes, 600 nm, 30 fringes, 20 fringes. Each distractor was recomputed and matches its stated mistake. "Using n" in h04 gives 100 030; in h05 it gives 60.
  - h07 to h08: 1.0 mm and 1.897 mm.
  - h15 to h16: N = 1000 and R = 60 000.
  - h18: 5.16e-4 rad/nm. The second-order value is 1.15e-3 and the 2d value is 2.58e-4.
  - h21: 11.54°. The other choices are 23.58° (the 2 dropped), 78.5° (from the normal) and 23.07° (2θ).
  - h22 to h24: 0.1173 nm, 0.0586 nm, 0.552 nm, and m = 2 (since 2d/λ = 2.6).
  - h27: 11.1°, 15.8°, 22.6° and 30.9°.
  - h31 to h32: 15 cm (1/(AC) = 41.7 cm) and 15 cm (12 cm for lenses in contact).
  - h39 to h40: +15/−10 D and 63.80.
  - q03 critical angles: 41.1°, 48.8° and 61.0°.
  - q12: |m| = 10, 5, 2 and 0.67. These are distinct, so there is only one order.
  - q25: mλ = 700, 800, 1000 and 1200 nm.
- **Worked examples were recomputed.**
  - h1: 633 nm; n − 1 = 2.78e-4; D = 47 μm; white-light coherence length about 1.0 μm.
  - h2: the dispersion of 6.41e-4 rad/nm (0.0367°/nm); the sodium doublet at 20.695° and 20.717°, which are 3.78e-4 rad apart against a half-width of 3.15e-4 rad; 44.4° and 467 nm; the NaCl angles of 15.85°, 33.1° and 55.0° with 2d/λ = 3.66; and 0.183 nm.
  - h3: every matrix product was checked with numpy. The telephoto pair gives f = 20 cm and a BFD of 10 cm with determinant 1. The thick lens gives f = 10.345 cm and a BFD of 9.655 cm, which also matches the thick-lens lensmaker formula. The achromat gives +23.1 D / 43.3 mm and −13.1 D / −76.4 mm.
  - The surface matrix reproduces n1/d_o + n2/d_i = (n2 − n1)/R with lesson 18's sign convention, and the determinant is n_start/n_end.
- **Drills.** The formulas were checked against independent matrix products in Python (lens-pair: A = 1 − d/f1, C = −1/f1 − A/f2) and against the lessons. relTolerance 0.01 always accepts a correctly rounded 3 s.f. answer (the largest rounding error is 0.5%). The units maps are consistent, and no placeholders are left unfilled.
- **Facts.**
  - Michelson designed the interferometer in 1881. The Michelson–Morley experiment was in 1887, and Michelson won the 1907 Nobel Prize for "optical precision instruments and the spectroscopic and metrological investigations".
  - The meter was defined by the krypton-86 orange-red line from 1960 to 1983 (BIPM). The refractive index of air near room conditions is about 1.00027 to 1.00029.
  - LIGO: 4 km arms; GW150914 on 14 September 2015; the 2017 Nobel Prize went to Weiss, Barish and Thorne. ΔL = 4e-18 m is about 0.002 of a proton diameter.
  - X-ray diffraction: Laue, Friedrich and Knipping in 1912. The Braggs won the 1915 Nobel Prize, with W. L. Bragg aged 25. Franklin's lab made its DNA fiber images in 1952 (Photo 51, taken by Gosling).
  - Hubble's mirror was 2.4 m and about 2.2 μm too flat at the edge. Corrective optics (COSTAR and WFPC2) were installed on STS-61 in December 1993.
  - The Fraunhofer d, F and C lines are at 587.6, 486.1 and 656.3 nm. The achromat dates to Hall (around 1730) and Dollond (1758 patent). The Cu Kα line is 0.154 nm, and the NaCl d200 spacing is 0.282 nm.
  - Sources: NobelPrize.org, BIPM SI history, LIGO Caltech pages, NASA Hubble mission pages, and Hecht's *Optics* (ray matrices, Abbe number, achromat).
- **Pictures.** All 14 SVGs were rendered, and the 6 blank copies were rendered with their markers.
  - The EM wave is consistent: E up, B toward the viewer, and E × B along the direction of travel, in phase.
  - The concave-mirror geometry matches the mirror equation: d_i = 209 px and m = −0.44 in the drawing.
  - The Michelson splitter's orientation sends the beams the right way.
  - The Bragg and double-slit path-difference constructions are correct.
  - In the aberration panels, the edge rays focus short and violet focuses short.
  - The resistor-flow SVG deliberately has no arrowheads on the B loops. That is acceptable, since the text gives the direction.
  - The markers of q01, q16, q21, h11 and h25 are on their parts.
- **Mermaid.** All 7 diagrams were rendered. They are readable, their content is correct, and their accDescr lines describe the whole chart. The Brewster box after "refracts away from the normal" is correct: an internal Brewster angle exists and is below the critical angle.
- **Contested points are labeled.** Labeled as debated: the influence of the Michelson–Morley result on Einstein. Labeled as an order-of-magnitude estimate: λ²/Δλ.
- **Glossary.** No term or alias repeats any glossary file in the course (checked with a script).

## Overlap

None found. phys-h2 (L92 radiation, L91 fields and relativity) and the phys-m12 honors lessons don't cover interferometers, Bragg diffraction, ray matrices or Poynting flow into a resistor. h1 mentions Michelson–Morley only as history.

## Left uncertain (minor, not changed)

- q25 assumes the grating spacing is large enough for all four maxima (mλ up to 1200 nm) to appear. That's implied, but not stated.
- h36 says the effective focal length acts "as if measured from a plane inside the lens". That is true for this lens (the principal plane is 0.69 cm inside the back surface), but it isn't true for every system.
