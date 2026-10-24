# Round 2 notes: phys-m12 (Modern physics)

`content/math/check-module.sh physics phys-m12` reports zero problems (6 lessons, 99 questions, 19 drills).

## Honors lessons (new)

1. `lessons/49h1-spacetime.md`, id `phys-m12-h-spacetime`: **Spacetime diagrams, the interval, and the twin paradox** (45 min, about 2,050 words of prose). Spacetime diagrams, events, worldlines, light cones; the invariant interval derived from the light clock; timelike, lightlike and spacelike pairs; the Lorentz transformation and the simultaneity shift; the twin paradox (4.0 ly at 0.80c: 10 yr against 6 yr), where the "missing" Earth years go (the line of simultaneity jumps from Earth time 1.8 yr to 8.2 yr at the turnaround); the relativistic Doppler effect and counting birthday signals (10 and 6). Four worked examples.
2. `lessons/49h2-nuclear-energy.md`, id `phys-m12-h-nuclear-energy`: **Nuclear reactions: Q-values, fission, fusion, and radiation dose** (50 min, about 2,100 words of prose). Q-values from atomic masses; alpha decay of U-238 (Q = 4.27 MeV, alpha gets 4.20 MeV); beta decay, the continuous spectrum and the neutrino; the 2mₑc² term for beta-plus (F-18, Q = 0.634 MeV, PET); threshold energy (Rutherford's N-14(α,p)O-17, Q = −1.19 MeV, threshold 1.53 MeV); fission Q (173 MeV for the Ba-141 + Kr-92 channel, about 200 MeV in all, 8×10¹³ J/kg), chain reaction, k, moderator, control rods; D–T fusion (17.6 MeV, 14.1 MeV to the neutron) and the Coulomb barrier; absorbed and equivalent dose (Gy, Sv, w_R), typical doses, the LNT model (labeled as debated). Six worked examples.

I wrote two honors lessons rather than three: the Frontiers honors module (phys-h1) already covers general relativity and particle physics, so a third lesson here would have overlapped with it.

## Core lessons: pictures and diagrams added (additions only)

- 46 Relativity: light-clock SVG (`phys-m12-light-clock.svg`) with one sentence explaining the triangle; a ```plot of γ against v/c; a Mermaid chart "proper or not?" (time vs length, then same place / at rest).
- 47 Quantum: a ```plot of K_max against frequency for two metals (same slope h); a ```plot of blackbody spectra at 4000, 5000 and 6000 K (Planck curves, same scale); hydrogen energy-level SVG (`phys-m12-hydrogen-levels.svg`, spacing labeled "not to scale") with a short paragraph naming the Lyman, Balmer and Paschen series.
- 48 Atomic: X-ray tube SVG (`phys-m12-xray-tube.svg`); a Mermaid chart of the two ways X-rays are made (bremsstrahlung and characteristic lines).
- 49 Nuclear: a ```plot of binding energy per nucleon (10 nuclei, computed from AME masses); penetration SVG (`phys-m12-penetration.svg`: alpha, beta, gamma against paper, aluminum, lead); a Mermaid chart of which decay an unstable nucleus undergoes, labeled as simplified.
- Honors: twin-paradox spacetime-diagram SVG (`phys-m12-twin-spacetime.svg`), a Mermaid chart for classifying intervals, and a Mermaid chart of the chain-reaction cycle.

Images: 5 SVGs, each with a `-blank.svg` copy for its label question (10 files, all under 5 KB). All previewed, with markers.

## Questions (`questions/r2-phys-m12.yaml`, 48)

- Core (q01–q20, 5 per lesson; 2 per lesson are `module_quiz: true`): 4 label, 5 text, 3 order, 4 match, 4 select-all.
- Honors spacetime (h01–h14): 8 multiple choice, 2 text, 1 order, 1 label, 1 match, 1 select-all.
- Honors nuclear energy (h15–h28): 8 multiple choice, 2 text, 1 order, 1 match, 2 select-all.
- Multiple-choice answer positions are balanced (4 each at 0–3).

## Drills (`drills/r2-phys-m12.yaml`, 6)

`phys-m12-r2-interval`, `-simultaneity`, `-twin` (spacetime); `phys-m12-r2-alpha-q` (4 parent nuclei), `-fusion-split` (4 fusion reactions), `-dose` (4 radiation types). Answers given "to 3 significant figures" use `relTolerance: 0.006`, and the 2-decimal answer uses `tolerance: 0.006`, so any correctly rounded answer is accepted.

## Glossary and cards

- `glossary-r2-phys-m12.yaml`, 26 terms: spacetime, spacetime diagram, event, worldline, light cone, spacetime interval, timelike, lightlike, spacelike, twin paradox, relativistic Doppler effect, Q-value, neutrino, positron, threshold energy, chain reaction, multiplication factor, moderator, control rod, Coulomb barrier, absorbed dose, gray, equivalent dose, radiation weighting factor, sievert, linear no-threshold model. Checked against every glossary file: no duplicate terms or aliases. ("Q value" is not an alias here because phys-m6 already uses it for the Q factor.)
- `cards-r2-phys-m12.yaml`, 21 cards (10 Spacetime geometry, 8 Nuclear reactions, 3 Radiation dose).

## For the reviewer

- **Overlap with phys-h1 lesson 91 (Standard Model)**: that lesson bolds positron, antiparticle, annihilate, pair production and neutrinos, and also has a PET example. I removed my bolding and glossary entries for annihilation and pair production. I kept glossary entries for **neutrino** (aliases neutrinos, antineutrino, antineutrinos) and **positron** (alias positrons), because beta decay needs them. The phys-h1 writer must not define them again, and should reuse these entries or merge them. My F-18 example is a Q-value calculation, not the annihilation-photon calculation.
- Atomic masses are AME2020 values rounded to 6 decimals, from memory. Every Q-value I computed matches the accepted value (U-238 α 4.270, Ra-226 4.871, Am-241 5.637, C-14 β⁻ 0.156, F-18 β⁺ 0.634, D–T 17.59, D–D 3.27 / 4.03, D–He-3 18.35, N-14(α,p) −1.19 MeV). Po-210 comes out 5.408 MeV against the accepted 5.4075 MeV because of the 6-decimal rounding. It appears only in drill `alpha-q`, and the 0.6% tolerance covers it.
- Doses: about 6.2 mSv/yr total and about 3.1 mSv natural for the U.S. (NRC backgrounder). The chest X-ray figure is written as "roughly 0.1 mSv or less". w_R values are from ICRP Publication 103 (2007). The LNT model is described as a cautious assumption whose accuracy at low doses is debated.
- Simplifications that are labeled as such: the decay-type chart, and the Coulomb barrier / tunneling paragraph (also notes that the Sun mainly runs the p-p chain, not D–T). The threshold formula is stated as nonrelativistic.
- The core lesson's statement that binding energy per nucleon "peaks near iron-56" is fine as written. Strictly, Ni-62 is highest (8.795 against 8.790 MeV). I left it alone.
- Errors found in existing content: none.

## Sources

NRC, "Backgrounder on Biological Effects of Radiation" (average U.S. dose 620 mrem, 310 mrem natural, LNT basis of standards); ICRP Publication 103 (radiation weighting factors); AME2020 atomic mass evaluation (masses); standard history: Minkowski 1908, Pauli 1930, Cowan and Reines 1956, Rutherford 1919, Davisson–Germer 1927.
