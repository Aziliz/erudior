# phys-m10 (Magnetism and induction): round 2 review

I reviewed this independently: 3 honors lessons (14h1, 14h2, 14h3), the additions to core lessons 10–14, `questions/r2-phys-m10.yaml` (67), `drills/r2-phys-m10.yaml` (8), `glossary-r2-phys-m10.yaml` (10), `cards-r2-phys-m10.yaml` (28) and the 14 `images/phys-m10-*` SVGs. I worked every question before looking at its key and recomputed every worked example and distractor in Python. I rendered every SVG (the blanks with their label markers), every new plot (with `preview-plots.mjs`) and every new Mermaid diagram. I generated 300 instances of each drill with the app's own `generate()`. For each one I recomputed the answers in Python from the prompt text, checked that a correctly rounded 3 s.f. (or 1 d.p.) answer is accepted, and checked that a 3% wrong answer is rejected.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| Drill `phys-m10-r2-rlc-resonance`, solution (c) | The placeholder trap: `\dfrac{f_0}{Q}` printed the value of Q into the TeX, so the formula rendered as "f₀ divided by 65.33", which is broken TeX. | Changed it to `\dfrac{f_0}{\,Q}`. |
| q16 (label, rails) | Marker 1 ("Sliding rod") sat where the rod crosses the bottom rail. It could be read as pointing at the rail. | Moved the marker up onto the rod: y 72.7 → 39.0. I re-rendered it to check. |
| 14-inductance-ac.md, RLC picture | The image line ran straight into " In a series RLC circuit…" with no blank line, so the image and the text would share one paragraph. | Added a blank line and removed the stray leading space. The text itself is unchanged. |
| 14-inductance-ac.md, RL-rise plot | The point label "63% at t = τ" ran into the curve. The curve's own label sat on the dashed final-value line. | Removed both labels. Added free labels "63% at t = τ" (below the curve) and "final value ℰ/R" (above the dashed line). |
| 14-inductance-ac.md, reactance plot | The X_L line ran through "resonance: X_L = X_C". The "X_C = 1/(ωC)" label sat on the dashed curve and on the axis title "ω/ω₀". | Replaced these with free labels placed clear of the curves. |
| 14h1, Helmholtz plot | Several labels overlapped. The "total" label sat on its curve. "coil at z = −R/2" sat on the dashed curve and on the x-axis title, and it was placed next to the wrong coil's tail. With x from −2 to 2, the y-axis is drawn at z = 0, where both dashed curves cross, so the tick labels 0.3 and 0.4 sat on them. | Plotted the half from the midpoint outward (x from 0 to 1.25), so the ticks sit outside the plot area. Free labels now name each curve. The caption says the other side is a mirror image. The physics is unchanged. |
| 14h3, resonance plot | The "Q = 2" label sat on the dashed curve. "Q = 8" sat on its curve and on the axis title. | Replaced them with free labels "Q = 2 (dashed)" and "Q = 8", placed clear of the curves. |
| 14h2, betatron | The sentence "the field is stronger near the center than at the orbit, by exactly this factor" can be read as saying the central field is twice the orbit field. The condition is about the *average* field inside the orbit. | Changed it to: "…making the average field inside the orbit exactly twice the field at the orbit." |
| 14h1, dipole section | "A bar magnet's field, made by the aligned atomic current loops inside it" stated a simplification as fact. Much of an atom's moment comes from electron spin, which is not an orbital current. | Changed it to "aligned atomic magnetic moments (each acts like a tiny current loop, though much of it comes from electron spin rather than orbital motion)". |
| 12-hall-magnetism.md, intro to the material-sorting chart (writer's sentence) | "The two questions that sort any material" overclaims. The chart has no place for antiferromagnets or ferrimagnets (ferrites). | Changed it to: "In this simplified scheme (it leaves out other types, such as antiferromagnets and ferrimagnets), two questions sort a material: …" |

## Checked and right (things a reader might doubt)

- **Every answer key and every distractor's stated origin**, including:
  - h01: 8.89 μT; the 1.26×10⁻⁵ distractor is the sum of every dB without taking the axial part.
  - h04: 1.70×10⁻⁵ T.
  - h06: 6.74×10⁻⁴ T; one coil at R/2 gives 3.37×10⁻⁴ T.
  - h08: 0.64 A·m².
  - h19: 42.4 eV.
  - h20: τ = 0.50 s.
  - h32: 30 Ω in parallel with −40j Ω is 19.2 − 14.4j, magnitude 24 Ω.
  - h33: ω₀ = 10⁴ rad/s and Q = 20; f₀L/R = 3.18.
  - h36: 2π·200 = 1257.
  - q07: 1.989 A.
  - q15: 14.98 mV.
  - q10: the order is unique. The wire's 20 μT is below even the weakest surface value of Earth's field (about 25 μT).
- **Order questions** (q11, q17, q23, h13, h27, h41): each has only one correct order. q23 fixes its start, so the cycle has a single order.
- **Worked examples:**
  - 14h1: Example 1 gives 1.885 mT and 1.072×10⁻⁴ T, and the dipole estimate 1.364×10⁻⁴ T is 27% high. Example 2 gives 7.75×10²² A·m². Example 3 gives 1.414×10⁻⁵ T, 5.657×10⁻⁵ T and a ratio of 0.900. Example 4 gives 1.199 mT.
  - 14h2: Example 1 gives 0.40, 1.0 and 0.50 V/m, and an emf of 0.314 V. Example 2 gives 25.1 V per turn; p = 1.28×10⁻²⁰ kg·m/s, so pc = 24.0 MeV; 9.55×10⁵ turns; KE = 23.5 MeV. Example 3 gives τ = 0.125 s, v = 0.271 m/s, 0.25 m and 0.40 J. Example 4 gives 3.0 A, 24 A, 31.5 W and 87.5%.
  - 14h3: Example 2 gives 14.4 + 19.2j and 24 Ω at 53.1°. Example 3 gives ω₀ = 3162 rad/s, f₀ = 503 Hz, Q = 15.8, half-power points at 3064 and 3264 rad/s (488 and 519 Hz), and V_C = 158 V.
- **Derivations:**
  - Loop-axis field; finite-segment formula.
  - Helmholtz: the second derivative of (R²+z²)^(−3/2) is ∝ 4z² − R², and the midpoint field is (4/5)^{3/2} = 0.7155. I computed the uniformity numerically: 0.011% within ±0.1R and 0.18% within ±0.2R, which matches the lesson.
  - Induced E inside and outside the solenoid; the direction (field into the page and increasing gives counterclockwise E).
  - Betatron two-to-one rule; braking τ and stopping distance v₀τ.
  - Back emf: maximum mechanical power at ℰ_b = V/2.
  - Phasor leads and lags.
  - Half-power roots: ω₊ − ω₋ = R/L and ω₊ω₋ = ω₀².
  - Energy-stored definition of Q, Q/π cycles to 1/e amplitude, and the no-oscillation condition Q < ½ ⇔ R > 2√(L/C).
- **Pictures:** all the directions are consistent.
  - Orbit: a positive charge, B into the page, moving up at the right edge, gives a force toward the center (counterclockwise motion).
  - Mass spectrometer: positive ions moving down with B into the page bend right, onto the detector.
  - Solenoid: dots on top and crosses below give an interior field to the right, so N is on the right, and the return field outside points left.
  - Rails: the current is counterclockwise and up through the rod, and F = IL×B points left.
  - Loop-axis: dB is perpendicular to r (the dot product is about 0), and its axial part points along +z for current out of the page at the top.
  - Induced-E: the arrows run counterclockwise.
  - Phasor: V_L − V_C and V_R close the triangle on V.
  - Every marker sits on the part its label names (q01, q06, q16 after the fix, q21, h37).
- **Mermaid (5 diagrams):** the content is correct, each accDescr describes the whole diagram, and all are readable at phone width.
- **14h2 plot:** E(r) matches r/2 inside and 1/(2r) outside, in units of R·dB/dt. The "r = R" label is clear of the curve.
- **Drills:** 2,400 instances matched my Python recomputation, with 0 mismatches. Correctly rounded answers were always accepted (relTolerance 0.01 covers 3 s.f. rounding, at most 0.5%; the phase angle uses tolerance 0.06 for 1 d.p.), and answers 3% off were always rejected. The text shows no "+ -" and no thousands commas. The only unfilled placeholder was the one fixed above.
- **Facts:**
  - Donald Kerst's first working betatron, University of Illinois, 1940. Source: D. W. Kerst, "Acceleration of electrons by magnetic induction", *Phys. Rev.* 58, 841 (1940).
  - Earth's dipole moment of about 7.7–8.0×10²² A·m², a dipole tilt of about 10° (about 9.5° today), an equatorial surface field of about 30 μT and polar fields of about 60 μT. Source: IGRF-13 (Alken et al., *Earth Planets Space* 73, 49, 2021) and NOAA NCEI geomagnetism pages.
  - 10 kHz AM channel spacing in the Americas (ITU Region 2).
  - The Curie temperature of iron, 770°C.
  - The Q, bandwidth and phasor results match OpenStax *University Physics* Vol. 2, ch. 15.
- **Glossary and cards:** the definitions are correct. No term or alias duplicates glossary.yaml or the other writers' glossary-r2 files. The alias "Q" for quality factor does not clash with phys-m12's "Q value" aliases.
- **Overlap:** none found. phys-h2 (Maxwell in differential form, fields and relativity, radiation) and phys-m9's 09h2 (RC transients and filters) don't cover phasors, RLC resonance, induced-field calculations, the betatron or Biot–Savart applications.

## Uncertain or left as is

- The mass-spectrometer drawing shows the radius ratio of the two paths larger than any real isotope pair would give. It is schematic, which is fine for a label question.
- The figure tool can't color free labels, so the reactance plot names its curves by position, and the Q = 2 curve is named with "(dashed)".
- `content/math/check-module.sh university-physics-2 phys-m10`: OK, 0 problems (8 lessons, 126 questions, 23 drills).
