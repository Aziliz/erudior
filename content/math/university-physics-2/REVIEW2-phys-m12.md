# Round 2 review: phys-m12 (Modern physics)

Reviewer, item 146. Scope: honors lessons 23h1–23h3, the round 2 additions to lessons 20–23, `questions/r2-phys-m12.yaml` (60), `drills/r2-phys-m12.yaml` (6), `glossary-r2-phys-m12.yaml`, `cards-r2-phys-m12.yaml`, `images/phys-m12-*`.
Final check: `content/math/check-module.sh university-physics-2 phys-m12` gives OK, 0 problems.

## Changes

### Questions (answer keys were all right; distractor explanations fixed)
| Id | Problem | Change |
|---|---|---|
| h01 | The 6.0 μs distractor wasn't explained | Explanation now says 6.0 μs is Δx/c |
| h03 | The 0.60c distractor matched no real mistake; 0.25c wasn't explained | 0.60c replaced by 0.87c (= √(1 − 0.5²), mixing up β and 1/γ); 0.25c explained (ratio squared) |
| h16 | The 2×10⁻³ distractor wasn't explained | Explained as treating the dependence as proportional to L |
| h17 | The "95%" distractor wasn't explained | Explained as e^(−0.05), with 2κ left out |
| h18 | The distractors 0.27 and 0.0044 matched no computable mistake | Replaced by 0.17 (sinh not squared; computed 0.174) and 0.098 (E used for U − E in κ; computed 0.0977); both explained |
| h28 | The 3730 MeV distractor wasn't explained | Explained as the He-4 atom's whole rest energy |
| h29 | The 5.20 MeV distractor matched no real mistake | Replaced by 2.71 MeV (Q split evenly); every distractor explained |
| h31 | The 3.5 and 17.6 MeV distractors weren't explained | Explanations added |
| h33 | The distractors Z ≈ 45 and Z ≈ 40 matched no real mistake | Replaced by 32 (A in place of A^(2/3): 120/3.80) and 58 (A^(1/3): 120/2.074); explained |

### Factual
- **23h3, "The peak":** Fe-58 was given as 8.790 MeV/nucleon; it is 8.792. Fe-56 is 8.790 and Ni-62 is 8.795 (AME2020). Fixed here and on the matching card.
- **23h3, Fission:** "a barrier of a few MeV remains, which absorbing a neutron can supply" read as if it held for all uranium. It now says the barrier is about 6 MeV, U-235 gains about 6.5 MeV when it absorbs a slow neutron (the neutron separation energy of U-236 is 6.55 MeV), and U-238 gains less and needs a fast neutron. Source: standard nuclear texts (Krane, *Introductory Nuclear Physics*, ch. 13).
- **23h2, flash memory:** "an oxide layer a few nanometers thick" became "only about 10 nanometers thick or less". Flash tunnel oxides are typically about 7–10 nm (Fowler–Nordheim tunneling).
- **23h3, Q-values section:** a cross-reference pointed to "the honors lesson on relativistic collisions", which doesn't exist. The writer deleted that draft. It now points to the phys-h2 lesson on invariant mass and thresholds.

### Pictures and plots
- **L21 photoelectric plot:**
  - Both "−φ" point labels sat on the dashed extension lines. They became free labels placed below each intercept.
  - The x-axis label "frequency f (10¹⁴ Hz)" was crossed by the φ = 4.3 eV line. It is now shortened to "f (10¹⁴ Hz)", which clears the line.
- **L23 binding-energy plot:**
  - The ⁴He label overlapped the C-12 point and the data line.
  - The label now sits above the curve with a dashed leader line, and the y-range is extended to 11 so it clears the y-axis title.
- All 5 SVGs and their blank copies were rendered with the label markers. Geometry, labels and marker placement are all correct. No SVG changes.

### Other
- **Drill phys-m12-r2-interval:**
  - At β = 0.05 the proper time differs from Δt by only 0.13%, so with relTolerance 0.006 the clearly wrong answer "proper time = Δt" was accepted.
  - The minimum β is raised from 0.05 to 0.2. At that speed the difference is 2%, and adding the squares is off by 4%.
- **Drill phys-m12-r2-semf:** relTolerance 0.006 accepted a wrong pairing sign or a missing pairing term at small A (up to about 1%). The tolerance is tightened to 0.002 for E_B (asked to 4 s.f.) and 0.003 for E_B/A (3 s.f.). Correctly rounded answers, and answers worked from the solution's 4-s.f. terms, still pass.
- **Glossary, light cone:** "inside its future half" became "inside or on", since light-speed signals reach events on the cone.

## Checked and found right (a reader might doubt these)
- **Example and question numbers (Python):**
  - κ = 8.87 nm⁻¹; exact T = 5.37×10⁻⁴; doubled width gives 7.51×10⁻⁸ (a factor of about 7150).
  - Proton 2κL = 380, so T ≈ 10⁻¹⁶⁵. STM: κ = 10.87 nm⁻¹ and a factor of 0.114 per 0.1 nm.
  - h18 exact T = 0.0444.
  - U-238 Coulomb barrier ≈ 28 MeV; outer turning point ≈ 61 fm.
  - Half-lives of Po-212 (0.299 μs) and U-238 (4.468 Gy) differ by 4.7×10²³.
  - Ra-226 gives Q = 4.871 and K_α = 4.785 MeV (the measured main line is 4.784). D–T gives Q = 17.59 MeV with 14.07 MeV to the neutron.
  - Fe-56 SEMF = 495.4 MeV, 0.63% above the measured 492.26. He-4 SEMF = 22.8 MeV.
  - Line of stability: 25.2 at A = 56 and 92.4 at A = 238. Fissility 2a_S/a_C = 50.1; Z²/A = 35.9 (A = 236).
  - Doppler: 803.8 nm and β = 0.0644. Twin birthday pulses arrive at 2, 4, … 16 years, then every half year.
  - All 7 drill nuclides have Q-values that match AME2020 (4.270, 4.871, 5.408, 5.244, 4.082, 5.591, 5.638 MeV).
- **F-18 β⁺ Q:** the lesson's rounded masses give 0.635 MeV; the evaluated value is 0.634 MeV. This is a rounding difference only, so I left it.
- **Line-of-stability formula:** re-derived. The coefficient a_C/(2a_A) = 0.0150 is correct.
- **History:**
  - Minkowski 1908.
  - Hafele–Keating 1971: observed −59 ± 10 ns eastward and +273 ± 7 ns westward, matching the predictions within error, with a gravitational part.
  - CERN muon storage ring (Bailey et al., *Nature* 1977): γ = 29.3.
  - Gamow, and Gurney and Condon, 1928. Geiger–Nuttall 1911 (the original was in terms of range, so "refined later" is fair).
  - Binnig and Rohrer: STM 1981, Nobel 1986. Esaki 1957. Weizsäcker 1935. Bohr–Wheeler 1939.
  - Millikan 1916, Compton 1923, de Broglie 1924, Davisson–Germer 1927.
- **Transverse Doppler wording:** the source moves at right angles to the line of sight in the observer's frame, so the light is redshifted by γ. Correct as stated.
- **Flash memory:** "erases (and in many designs writes) by tunneling" is correct. NAND programs by Fowler–Nordheim tunneling; NOR programs by hot-electron injection.
- **U-238 chain half-lives:**
  - Th-234: 24.1 d.
  - Pa-234m: 1.17 min. It is a metastable state, and 99.8% of it decays by β⁻ to U-234.
  - U-234: 2.455×10⁵ y. Th-230: 7.54×10⁴ y. Ra-226: 1600 y.
  - The chain has 8 α and 6 β⁻ decays.
- **Binding energies per nucleon** in both binding-energy plots match AME2020 for every nuclide shown.
- **SEMF plot:** the model curve matches the formula, and the labels are clear of the curves.
- **Mermaid:** all 6 diagrams rendered. Content and accTitle/accDescr are correct.

## Overlap
None found. h1 (spacetime, twins, Doppler) sits beside phys-h2's 91 (fields in relativity) and 93 (four-momentum) without repeating them. The writer deliberately dropped a collisions/threshold draft that overlapped 93. No other NOTES2 file in the course covers tunneling, the SEMF or the Doppler effect.

## Left uncertain or minor
- In the h2 log-T plot, the descending curve passes close to the "0.1" tick label near the origin. This can't be avoided with the renderer's fixed axis placement; it is readable.
- In the barrier SVG, ψ is drawn oscillating about the E line, a common schematic convention. The lesson labels it schematic.
