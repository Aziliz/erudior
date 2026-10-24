# NOTES2-phys-h1: Honors module phys-h1, Frontiers of physics

`content/math/check-module.sh physics phys-h1`: build and checker report **zero problems** (4 lessons, 56 questions, 12 drills, 40 cards).

## What was added

**Lessons** (module `phys-h1`, already `honors: true` in course.yaml). Cross-cutting capstones, each drawing on several core modules:

| File | Id | Title | Min | Prose words* | Worked examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|---|
| 90-gravity-spacetime.md | phys-h1-gravity | Gravity as curved spacetime: clocks, black holes and gravitational waves | 45 | ~2,190 | 4 (Everest clock gains 30 μs/yr; GPS +45.7 − 7.2 = +38.5 μs/day; Schwarzschild radii of Sun, 10 M☉, Sgr A*, Earth; GW150914 ΔL = 4×10⁻¹⁸ m and 5×10⁴⁷ J) | phys-h1-ligo.svg; Mermaid "equivalence principle → predictions"; plot of an orbiting clock's daily gain vs radius (break-even at 1.5 R_E) | grav-clock, schwarzschild, gw-strain |
| 91-standard-model.md | phys-h1-particles | Particles and forces: the Standard Model | 50 | ~2,240 | 4 (making antiprotons: p + p → p + p + p + p̄, 938 MeV per beam head-on vs 5.6 GeV fixed target; weak-force range from the W mass; three reactions checked against conservation laws; LHC bending radius 2.80 km at 8.33 T) | phys-h1-standard-model.svg; Mermaid particle classification; table of the four interactions | annihilation, force-range, accelerator |
| 92-cosmology.md | phys-h1-cosmology | The expanding universe: cosmology, dark matter and dark energy | 50 | ~1,800 | 4 (Proxima Centauri parallax; galaxy distance from Hα redshift; Hubble time 14.0 Gyr; Milky Way mass 1×10¹¹ M☉ inside the Sun's orbit) + critical density in text | phys-h1-parallax.svg; Hubble-diagram plot (illustrative data, labeled); rotation-curve plot (schematic, labeled); Mermaid timeline of the universe | parallax, hubble, rotation-mass |
| 93-climate-physics.md | phys-h1-climate | Climate physics: forcing, feedbacks and sensitivity | 50 | ~1,780 | 4 (ε = 0.78 for 288 K; 180 m rise in emission height → 1.2 K; CO₂ forcing 2.2 W/m² so far and 3.7 per doubling; feedback factor f = 0.6 and the 2.4–4.0 K spread) | phys-h1-energy-balance.svg; plot of T_s vs ε; Mermaid ice–albedo loop | layer-model, co2-forcing, feedback |

*Prose without figure/Mermaid source; tables and alt text included.

Every lesson has an intro tying back to core lessons (gravitation, relativity, quantum, nuclear, magnetic force, sound/Doppler, heat) and to the relevant honors lessons, "Common mistakes" and "Key points".

**Questions** (`questions/r2-phys-h1.yaml`, phys-h1-r2-h01 to h56): 14 per lesson.
- 35 four-choice MC, correct positions 9 / 9 / 9 / 8.
- 21 other types (38%): 5 text (one numeric), 4 select-all, 4 order, 4 match, 4 label (LIGO interferometer, Standard Model chart, parallax, energy balance).
- `module_quiz: true` on 20 (5 per lesson), covering every topic: General relativity; Black holes and gravitational waves; Particle physics; Conservation laws in particle reactions; Cosmology; Dark matter and dark energy; Greenhouse models; Climate forcing and feedbacks.

**Pictures** (original, 1.2–5.8 KB, previewed with markers): phys-h1-ligo, phys-h1-standard-model, phys-h1-parallax, phys-h1-energy-balance (each with `-blank`). **Mermaid**: 4 (all previewed). **Plots**: 4.

**Drills** (`drills/r2-phys-h1.yaml`, 12, ids `phys-h1-r2-…`): grav-clock, schwarzschild, gw-strain, annihilation, force-range, accelerator, parallax, hubble, rotation-mass, layer-model, co2-forcing, feedback. Every prompt asks for 3 significant figures and every box has `relTolerance: 0.01`. Each drill was generated 2,000 times with tsx (`generate` + `checkAll`): the correct answer rounded to 3 s.f. accepted every time, a 3% wrong answer rejected, no unfilled placeholders, "+ -", NaN or thousands separators inside math. Spot values recomputed independently in Python.

**Glossary** (`glossary-r2-phys-h1.yaml`): 48 terms: general relativity, equivalence principle, gravitational redshift, gravitational time dilation, gravitational lensing, black hole, event horizon, Schwarzschild radius, gravitational wave; Standard Model, antiparticle, annihilation, pair production, hadron, quark, baryon, meson, confinement, generation, lepton, fermion, boson, gauge boson, gluon, W and Z bosons, Higgs boson, baryon number, lepton number; cosmology, parallax angle, parsec, light-year, standard candle, redshift, Hubble's law, Hubble constant, Hubble time, Big Bang, cosmic microwave background, rotation curve, dark matter, dark energy, critical density; radiative forcing, climate feedback, climate sensitivity, lapse rate, emission height. Checked against every glossary*.yaml in the course: no duplicate terms or aliases. Bolded terms that other writers already define are linked to their entries, not redefined: **positron**, **neutrinos** (glossary-r2-phys-m12), **solar constant**, **albedo**, **equilibrium temperature**, **greenhouse effect**, **greenhouse gases** (glossary-r2-phys-m7).

**Cards** (`cards-r2-phys-h1.yaml`): 40 (10 / 12 / 10 / 8 by lesson), on the lesson topics above.

## For a reviewer to double-check

- **Overlap with core-module honors lessons, found while writing and resolved:** phys-m7's `29h3-radiation-balance` already derives T_e = 255 K, Mars, and the all-absorbing one-layer model (303 K), so lesson 93 only recaps those in one section and teaches the partial-absorber model, emission height and lapse rate, logarithmic forcing, the Planck response, the feedback factor ΔT₀/(1 − f) and climate sensitivity. phys-m12's `49h2-nuclear-energy` covers annihilation, pair production and PET (and points forward to this module), so lesson 91's antimatter section is a short recap plus a new example (antiproton production threshold). phys-m11's `45h2-interferometers` mentions LIGO briefly; lesson 90 refers to it. phys-m5's `20h3` weighs Sgr A* with S2; lesson 90 refers to it. Topic names were chosen not to collide with m7's "Planetary energy balance".
- **Lesson cross-references to honors lessons** (accelerating frames 10h2, gravitation 20h3, interferometers 45h2, nuclear reactions 49h2, insulation and radiation 29h3): if any of those lessons is renamed or dropped, the sentence needs adjusting.
- **Simplifications, labeled in the text:** weak-field formulas (gh/c², GM/c² differences); GPS calculation ignores Earth's rotation (~0.1 μs/day) and orbit eccentricity; Michell's escape-speed argument for r_s called partly luck; Yukawa range R ≈ ħc/mc² called an estimate; relative strengths of the interactions called rough and convention-dependent; v ≈ cz only for small z, cosmological redshift is stretching of space; galaxy mass treats the mass as central; critical density from a Newtonian argument (noted that GR gives the same); one-layer and emission-height models called teaching models; ΔT₀ = ΔF/3.7 gives 1.0 K, with "careful calculations give about 1.2 K" stated.
- **Contested or open, labeled:** Hubble tension (67 vs 73 km/s/Mpc); nature of dark matter (and a minority view of modified gravity); nature of dark energy; cloud feedback and the range of climate sensitivity.
- **Facts worth a second look:** MICROSCOPE (2022) equivalence to ~10⁻¹⁵; Pound–Rebka 1959, 22.5 m; 2010 atomic-clock test at 30 cm; GW150914 masses 36 + 29 → 62 M☉, peak strain 1.0×10⁻²¹, 7 ms arrival difference, 1.3 billion ly; GW170817 speed to ~10⁻¹⁵; EHT images 2019 (M87*) and 2022 (Sgr A*); Bevatron antiproton 1955; top quark 1995; neutrino oscillation 1998–2001; Higgs 2012 / Nobel 2013; LHC 8.33 T and 2.80 km bending radius at 7 TeV; proton lifetime > 10³⁴ yr; Leavitt 1912, Lemaître 1927, Hubble 1929, Penzias and Wilson 1965, COBE 1990, Rubin and Ford 1970s, Zwicky 1933, 1998 supernova teams / Nobel 2011; Planck 2018 composition 5 / 27 / 68%; Foote 1856, Tyndall 1859, Arrhenius 1896 (5–6 °C), Manabe and Wetherald 1967 (~2.3 °C), Nobel 2021; IPCC AR6 sensitivity 3 °C (likely 2.5–4) and 1.1 °C warming for 2011–2020 vs 1850–1900; CO₂ about 420 ppm in the early 2020s.
- The Hubble-diagram data points are illustrative (scattered about v = 70d), and the rotation-curve plot is schematic; both captions say so.
- Lesson 91 prose is ~2,240 words counting the alt text and the interactions table (body prose ~2,120); lesson 90 is ~2,190.

## Errors found in existing content

None found. Core lessons 46–49 and honors lessons 20h3 and 29h3 were read in part; core lessons 26, 45 and honors lessons 10h2, 45h2, 49h1, 49h2 were searched for overlapping topics and the cross-references used. (Note: core lesson 45 does not describe the Michelson interferometer; 45h2 does, so lesson 90 points there.)

## Sources

No web lookups were made while writing; the facts below come from these standard references as known to the writer, so the dated facts listed above are the ones to spot-check.

- OpenStax *College Physics 2e* and *University Physics* Vol. 3 (particle physics, cosmology, general relativity chapters); HyperPhysics for standard values.
- NIST CODATA 2022 constants; PDG particle masses (W 80.4 GeV, Z 91.2 GeV, π 139.6 MeV, Higgs ~125 GeV, quark masses).
- LIGO Scientific Collaboration, GW150914 discovery paper (Phys. Rev. Lett. 116, 061102, 2016) and GW170817 / GRB 170817A speed constraint.
- Pound and Rebka (1959–60); MICROSCOPE final results (2022); Chou et al., Science 2010 (optical clocks, 33 cm).
- Event Horizon Telescope results (2019, 2022); GRAVITY collaboration / 2020 Nobel (Sgr A* mass ~4.3×10⁶ M☉).
- CERN LHC design report (8.33 T, 7 TeV); Planck 2018 cosmological parameters; SH0ES (Riess et al.) for H₀ ≈ 73.
- IPCC AR6 WG1 (2021) Summary for Policymakers and Ch. 7 (ECS 3 °C, likely 2.5–4 °C; feedbacks); Myhre et al. (1998) for ΔF = 5.35 ln(C/C₀); NOAA Mauna Loa CO₂ record; Manabe and Wetherald (1967); Arrhenius (1896); Nobel Prize 2021 citation.
- All numbers recomputed in Python (/tmp/r2-phys-h1/nums.py during writing): GPS terms, r_s values, ΔL, GW energy, ranges, LHC radius, γ, Hubble times, critical density, z and distances, Milky Way mass, Wien peaks, T_e, ε, forcing, Planck response, feedback examples, and every question key and distractor.
