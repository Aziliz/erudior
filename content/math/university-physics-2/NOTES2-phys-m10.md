# phys-m10 (Magnetism and induction): round 2 writer notes

## Honors lessons (3, all `honors: true`)
The module has five core lessons, and three gaps listed in VERIFY.md (induced electric fields and back emf; driven RLC phasors and Q) plus field calculation beyond the textbook shapes, so it gets three honors lessons. I checked them against the phys-h2 honors module (Maxwell in differential form, fields and relativity) and phys-m9's 09h2 (RC filters). They don't overlap.

| File | id | Title | Words | Examples | Drills |
|---|---|---|---|---|---|
| 14h1-field-calculations.md | phys-m10-h-field-calculations | Field calculations: loops, coils and magnetic dipoles | ~1,750 | 4 | phys-m10-r2-loop-axis, -helmholtz, -wire-segment |
| 14h2-induced-fields.md | phys-m10-h-induced-fields | Induced electric fields, magnetic braking and back emf | ~1,900 | 4 | phys-m10-r2-induced-field, -magnetic-braking, -back-emf |
| 14h3-driven-rlc.md | phys-m10-h-driven-rlc | Driven RLC circuits: phasors, resonance and Q | ~1,650 | 4 | phys-m10-r2-rlc-phasor, -rlc-resonance |

- **14h1** covers the loop-axis field derived by Biot–Savart; the dipole far field (axis and equator) and its analogy with the electric dipole; Earth's dipole moment as a worked estimate; the finite straight segment and the square loop; Helmholtz coils (why the spacing is R: an inflection point at R/2); and the toroid by Ampère's law.
- **14h2** covers conservative versus induced electric fields; E inside and outside a changing solenoid; why no potential exists (path-dependent "voltage"); the betatron and its two-to-one condition, derived; magnetic braking v = v0 e^(−t/τ) with τ = mR/(B²L²); and motor back emf (start-up surge, power split, efficiency, maximum power at ℰb = V/2).
- **14h3** covers phasors derived from differentiating and integrating the current; complex impedance (j), including a parallel R–L example; P(ω); Q, with the exact bandwidth derivation Δω = R/L and ω+ω− = ω0²; the energy definition of Q; ringing for about Q/π cycles; voltage magnification QV; and AM tuner selectivity.

## Core lessons (additions only)
- L10 (Magnetic forces): an orbit picture (v, F, center) and a mass-spectrometer picture. A sentence introduces each.
- L11 (Sources): a cut-away solenoid picture and a Mermaid chart for choosing a method (known result, Ampère's law or Biot–Savart).
- L12 (Hall and matter): a Mermaid chain showing how the Hall voltage builds up, and a Mermaid chart sorting materials into dia-, para- and ferromagnetic.
- L13 (Induction): a Mermaid chart of the Lenz's-law procedure, a sliding-rod picture (current and force directions explained in an added sentence) and a transformer picture.
- L14 (Inductance/AC): an RL current-rise plot, a Mermaid diagram of the LC energy cycle, a plot of X_L and X_C against frequency, and an RLC circuit picture.

## Questions (`questions/r2-phys-m10.yaml`, 67)
- **Core: phys-m10-r2-q01 to q25**, 5 per lesson.
  - By type: label 4, text 7, select-all 5, match 5, order 4.
  - module_quiz: q01, q04, q06, q08, q11, q12, q16, q19, q21, q24 (2 per lesson).
- **Honors: phys-m10-r2-h01 to h42**, 14 per lesson.
  - 25 four-choice, with answer positions 0×6, 1×7, 2×6, 3×6.
  - Other types: select-all 3, text 7, match 3, order 3, label 1. That is 17 of 42 other-type questions (14h3 has 6).
  - Honors questions carry no module_quiz.

## Pictures (9 SVGs + 5 blanks, all original, 1–13 KB)
- Pictures: phys-m10-mass-spec(+blank), -orbit, -solenoid(+blank), -rails(+blank), -transformer, -rlc(+blank), -loop-axis, -induced-e, -phasor(+blank).
- Blanks back the label questions q01, q06, q16, q21 and h37.
- All were rendered with preview-figure.mjs, the blanks with their markers, and inspected. Overlapping labels were moved.

## Diagrams and figures
- **Mermaid (5):** L11 method chooser, L12 Hall build-up, L12 material sort, L13 Lenz procedure, L14 LC cycle. All are TD, with accTitle/accDescr, and were previewed.
- **Plots (5):** L14 RL rise, L14 reactance vs frequency, 14h1 Helmholtz axial field, 14h2 E(r) around a solenoid, 14h3 resonance curves for Q = 2 and 8.

## Drills (`drills/r2-phys-m10.yaml`, 8)
- The 8 drills: loop-axis, helmholtz, wire-segment, induced-field, magnetic-braking, back-emf, rlc-phasor, rlc-resonance.
- 3 s.f. answers use relTolerance 0.01. The phase angle (1 decimal place) uses tolerance 0.06.
- Single-letter TeX denominators that collide with value names are written `{\,R}`.

## Glossary and cards
- **Glossary (`glossary-r2-phys-m10.yaml`, 10 terms):** Helmholtz coils, toroid, conservative, induced electric field, betatron, back emf, phasor, quality factor, half-power points, bandwidth.
  - Checked against glossary.yaml and the other writers' glossary-r2 files: no duplicate terms or aliases.
  - "magnetic dipole moment" and "impedance" are bolded in the honors lessons but already exist in glossary.yaml.
- **Cards (`cards-r2-phys-m10.yaml`, 28):** 10 / 9 / 9 per honors lesson.

## For the reviewer
- Earth's field (14h1 Example 2, card, h03):
  - The model is a centered dipole, labeled as a simplification (tilt about 10°).
  - It uses an equatorial surface field of 3.0×10⁻⁵ T, which gives μ ≈ 7.8×10²² A·m². The accepted value is given as "a little under 8×10²²".
  - The pole field "about 6×10⁻⁵ T" is "roughly what is measured".
- Betatron (14h2):
  - "Donald Kerst built the first working betatron at the University of Illinois in 1940."
  - The two-to-one rule is derived from p = eB_orbit r. The lesson notes this holds relativistically.
  - Example 2's turn count assumes v ≈ c throughout. The lesson says the electrons are near c, and the 24 MeV totals agree.
- 14h2: eddy brakes "cannot hold a vehicle still; a friction brake or a stop usually finishes the job". This is hedged.
- 14h2: the two-voltmeter remark is qualitative only.
- 14h3:
  - "Q/π cycles to 1/e amplitude" is labeled approximate (valid for Q well above 1).
  - AM spacing of 10 kHz is stated as North American.
  - The tuner example is labeled a simplified estimate.
- 14h1 Helmholtz uniformity: computed numerically. Within ±0.1R the field varies by 0.011%; within ±0.2R by 0.18%.
- L12 Mermaid build-up: the text says "practically instantaneous". No time scale is claimed.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Checks
- Every worked example, question key and distractor was recomputed in Python.
- `content/math/check-module.sh university-physics-2 phys-m10`: build and checker OK, 0 problems (8 lessons, 126 questions, 23 drills).

## Sources
- Standard results: Biot–Savart, Helmholtz, toroid, induced E, betatron condition, RLC resonance and Q. These were derived in the lessons and checked against OpenStax University Physics Vol. 2 (ch. 12, 13, 15) and MIT OCW 8.02 topic lists.
- Earth's dipole moment and field magnitudes follow commonly quoted geomagnetic values (IGRF-era dipole moment ≈ 7.7–8.0×10²² A·m²).
- All writing and drawings are original.
