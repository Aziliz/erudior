# Round 2 review: phys-m12 (Modern physics)

Reviewed independently: both honors lessons (49h1 spacetime, 49h2 nuclear energy), the round 2 additions to
lessons 46–49, `questions/r2-phys-m12.yaml` (48), `drills/r2-phys-m12.yaml` (6),
`glossary-r2-phys-m12.yaml` (26), `cards-r2-phys-m12.yaml` (21), and the 10 `images/phys-m12-*` files.
`content/math/check-module.sh physics phys-m12` reports zero problems after the fixes.

## Changes

### Answer key / question fixes
- **phys-m12-r2-q10 (match):** two answers could be swapped. "Light's energy arrives in packets of hf"
  (photoelectric) and "Energy is exchanged in quanta (Planck)" (blackbody) both describe quantization, so a
  student could reasonably pair either with either. Changed the blackbody answer to "Planck's quanta remove
  the classical short-wavelength runaway" (what lesson 47 says Planck's assumption did), and added that point
  to the explanation.
- **phys-m12-r2-h13 (match):** "Time read by a clock present at both events" is not $\Delta s/c$ for an
  accelerated clock: a bent worldline between the same events reads less, which is the point of the twin
  paradox lesson. Changed it to "Time read by an inertial clock present at both events".

### Factual fixes
- **49h1, Common mistakes (simultaneity):** "That holds only for events at the same place" is false in 3D:
  events separated only perpendicular to the motion stay simultaneous. Reworded to "only for events with no
  separation along the direction of motion (in this lesson's one dimension, events at the same place)".
- **49h2, Radiation dose:** the "about 6 mSv, roughly half natural, half mostly medical" figures are NCRP's
  mid-2000s estimates (NCRP Report 160). Added that they are mid-2000s estimates and that the medical share
  fell to about 2.3 mSv in 2016 (NCRP Report 184, Mettler et al., *Radiology* 2020), so natural sources are now
  a bit more than half. h26 ("about a third of a typical yearly dose") and h28 ("roughly half natural") remain
  correct.

### Picture and plot fixes
- **46 γ plot:** the "0.9c: γ = 2.29" label ran off the right edge, and the "0.6c" label sat on the curve.
  Moved both to free labels above-left of their points.
- **47 photoelectric plot:** "f0 = 10.4" sat on the axis title, and the axis title crossed the φ = 4.3 eV
  line. Widened x to 0–20 (lines still end at 15) and put the f0 labels as free labels left of each threshold.
- **47 blackbody plot:** the three curve labels piled on top of each other (and on the axis title) where the
  tails meet, and "peak 0.72 μm" sat on the 5000 K curve. Removed the curve-end labels and labeled each peak
  dot with its temperature instead (the dots take the curves' colors). The peak wavelengths (0.48, 0.58,
  0.72 μm) moved into the caption. Widened x to 0–3.2 (curves end at 2.3) and y to 1.25 so nothing overlaps.
  The function expressions are unchanged.
- **49 binding-energy plot:** the "He-4" and "C-12" labels overlapped the C-12/O-16 points and the line,
  because A = 4–16 is only about 20 px wide. Dropped the Li-6 point (still "selected nuclei"), removed the C-12
  label, and placed "He-4" as a free label below-right of its point. The remaining values (AME masses) are
  unchanged.
- **h07 (twin label):** marker 3 (return leg) sat about 15 px from the dashed light signal. Moved it up the
  return leg to (28.1, 25.8), where it is clearly on the red line.

### Other
- **Drill phys-m12-r2-twin:** a learner who subtracts the rounded 3-s.f. Earth and traveler times gets the
  age difference wrong in 311 of 1,850 input combinations (up to 3.4% off). Added "subtract unrounded values
  for the age difference" to the prompt.

## Checked and found right (in case a reader doubts it)
- **49h1:** Minkowski 1908, Einstein's former teacher at ETH. All numbers recomputed: Example 1
  (√1.75 = 1.32 yr, γ = 1.512, √8 = 2.83 ly, v = c/3); Example 2 (Δt′ = −1.5 μs, 750 m, interval −360,000 m² in
  both frames, track 480 m); twin trip 10 vs 6 yr; simultaneity jump 1.8 → 8.2 yr; Doppler factors 1/3 and 3;
  signal counts 1 + 9 = 10 and 3 + 3 = 6. Sign of the simultaneity shift (the event farther ahead happens first
  in S′) is correct.
- **49h2:** Every Q-value recomputed from the given masses: U-238 α 4.270 (K_α 4.20), C-14 0.156, F-18 0.634,
  N-14(α,p) −1.192 (threshold 1.53; reverse 5.4), fission channel 173.3 MeV, D–T 17.59 (neutron 14.05 ≈ 14.1),
  8.2×10¹³ J/kg, D–T 3.4×10¹⁴ J/kg (about 4×), Coulomb barrier 0.48 MeV, k_BT at 1.5×10⁷ K = 1.29 keV. The
  masses match AME2020 to 6 decimals. Pauli 1930; Cowan and Reines 1956; Rutherford 1919. ICRP 103 w_R values
  (1, 1, 2, 20, a continuous 2.5–20 for neutrons). Positron range in PET is "a millimeter or two" (F-18 mean range
  about 0.6 mm, max about 2.4 mm). The β⁺ 2m_e argument is right. The U-238 main alpha line is 4.198 MeV (about
  79%).
- **Core additions:** the γ plot values; the photoelectric slope 0.41357 eV per 10¹⁴ Hz and thresholds
  5.513 and 10.397; the Planck curves (c₂ = 14388 μm·K, normalization 0.267374 = the 6000 K peak; 4000 K peak
  0.1317 at 0.7245 μm); the binding energy per nucleon of all 10 nuclei; the hydrogen levels; and the arrow lengths
  in the not-to-scale SVG, which keep the energy order. The X-ray spectrum plot, laser shape and decay plot in
  lessons 48–49 are round 1 (out of scope).
- **All 48 questions worked independently.** Notable: q07 order (0.66 < 1.89 < 2.55 < 10.2 < 12.75 eV); h06
  (the signal arrives at 3.0 yr; the order holds wherever the first birthday falls); h08 5.33 μs and its
  distractors; h10 16 yr; h15 4.871 MeV (3730 = forgetting He); h16 5.31; h19 2.00; h24 2.45 MeV. The
  multiple-choice answer positions are balanced.
- **Drills:** formulas checked against the prompts. relTolerance 0.006 covers 3-s.f. rounding (worst case
  0.5%), and tolerance 0.006 covers 2 decimals. The Po-210 and Am-241 masses match AME2020. The D–D (T + p)
  4.03 MeV and D–³He 18.35 MeV values are right. The ns/km unit factors are right.
- **Glossary and cards:** definitions correct. No duplicate terms or aliases with any physics glossary.
  "Lorentz transformation" (bolded in 49h1) is already defined in glossary.yaml.
- **Mermaid (5):** all rendered and readable. accTitle/accDescr describe the whole diagram. The decay-type
  chart is labeled as simplified (it leaves out electron capture, which is acceptable under that label).
- **SVGs (5 + 5 blanks):** all rendered with markers. Geometry is right (the twin diagram has equal scales, so
  the light lines really are at 45°), and every marker sits on its part.

## Overlap
- The 49h2 annihilation and pair-production paragraph and its PET example overlap phys-h1 lesson 91
  (Standard Model), which bolds and defines annihilation, pair production and antiparticle and also uses PET.
  The m12 writer already removed the duplicate bolding and glossary entries, and phys-h1 links to the m12
  `positron`/`neutrino` entries. The remaining overlap is a short recap; no change.
- 49h1 (special-relativity spacetime) and phys-h1 lesson 90 (curved spacetime in GR) share the word
  spacetime but not the content.

## Left uncertain
- None that affects correctness. The X-ray tube SVG shows only one filament lead joined to the HV supply; a
  real tube also has a separate filament heater supply. This is an acceptable simplification and is not
  tested.

## Sources
- NCRP Report 160 (2009) / NRC "Backgrounder on Biological Effects of Radiation" (6.2 mSv, about 3.1 natural).
- Mettler et al., "Patient Exposure from Radiologic and Nuclear Medicine Procedures in the United States:
  Procedure Volume and Effective Dose for the Period 2006–2016", *Radiology* 295 (2020),
  https://pubs.rsna.org/doi/10.1148/radiol.2020192256 (NCRP 184: medical 2.9 → 2.3 mSv).
- ICRP Publication 103 (2007), radiation weighting factors. AME2020 atomic mass evaluation.
- Standard texts (OpenStax University Physics Vol. 3, chs. 5 and 10) for the Lorentz transformation, Doppler,
  Q-value and threshold formulas.
