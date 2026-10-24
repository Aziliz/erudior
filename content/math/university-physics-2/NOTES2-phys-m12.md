# Round 2 notes: phys-m12 (Modern physics)

Check: `content/math/check-module.sh university-physics-2 phys-m12` gives 7 lessons, 105 questions, 18 drills, 53 cards and 317 terms. Result: OK, 0 problems.

## Honors lessons (3)
| File | id | Title | Words | Questions | Drills |
|---|---|---|---|---|---|
| 23h1-spacetime-twins.md | phys-m12-h-spacetime | Spacetime diagrams, the twin paradox and the relativistic Doppler effect | 1923 | h01–h13 | phys-m12-r2-interval, phys-m12-r2-doppler |
| 23h2-quantum-tunneling.md | phys-m12-h-tunneling | Quantum tunneling | 1781 | h14–h27 | phys-m12-r2-tunneling, phys-m12-r2-stm |
| 23h3-nuclear-energetics.md | phys-m12-h-liquid-drop | Q-values and the liquid-drop model of the nucleus | 1931 | h28–h40 | phys-m12-r2-alpha-q, phys-m12-r2-semf |

What each lesson covers:
- **h1:** Minkowski diagrams, worldlines and light cones. The invariant interval, derived from the Lorentz transformation. Timelike, lightlike and spacelike separations. The twin paradox, worked with the interval. Hafele–Keating and the CERN muon storage ring. Relativistic Doppler, derived from time dilation, plus redshift z and the transverse Doppler effect. The twins' birthday signals are used as a consistency check.
- **h2:** The forbidden region and κ. The exact rectangular-barrier T and the thick-barrier limit. The electron-versus-proton contrast. STM sensitivity. Alpha decay as tunneling (Gamow; Gurney and Condon, 1928), with the Geiger–Nuttall law. Solar fusion, flash memory and tunnel diodes.
- **h3:** Q-values from atomic masses, with the electron bookkeeping for β⁺ (−1.022 MeV). Two-body sharing of energy. Ra-226 alpha decay and D–T fusion. The semi-empirical mass formula term by term, with Fe-56 worked in a table. The line of stability. Fission at about 200 MeV, and the Bohr–Wheeler fissility estimate.

Each honors lesson has 2–3 worked examples, a Common mistakes section and Key points.

## Core lessons: additions only
| Lesson | Added |
|---|---|
| 20 Relativity | Light-clock SVG with a lead-in sentence deriving γ; Mermaid "proper or not?" decision chart |
| 21 Quantum | Plot of K_max against f for two metals; hydrogen energy-level SVG drawn to scale, with a short lead-in |
| 22 Blackbody/Compton | Mermaid timeline of early quantum physics, 1900–1927 |
| 23 Nuclear | Plot of measured binding energy per nucleon; α/β/γ penetration SVG; Mermaid U-238 decay chain with half-lives, plus a short paragraph on the 8 α and 6 β⁻ decays |

## Questions (`questions/r2-phys-m12.yaml`, 60)
- **Core lessons (q01–q20, 5 per lesson):**
  - 4 text, 4 order, 4 match, 4 select-all, 3 label, 1 multiple choice.
  - Module quiz: q02, q04, q09, q10, q12, q18, q19.
- **Honors lessons (h01–h40):**
  - 26 multiple choice (3 of them select-all), 6 text, 3 order, 3 match, 2 label. That is about 1/3 new types per lesson.
  - No module_quiz flags, since honors lessons are left out of the module quiz.
- **Answer positions (multiple choice):** 6/5/7/6.

## Pictures and diagrams
- **SVGs:** phys-m12-light-clock, phys-m12-hydrogen-levels, phys-m12-penetration, phys-m12-twins and phys-m12-barrier. Each has a `-blank` copy for its label question. All were previewed, and the markers were checked on the blank copies.
- **Mermaid diagrams (6):**
  - L20: proper-time decision chart
  - L22: timeline
  - L23: decay chain
  - h1: interval classification
  - h2: tunneling applications
  - h3: Q-value procedure
- **Plots (4):**
  - L21: photoelectric plot
  - L23: binding-energy curve
  - h2: log T against L
  - h3: liquid-drop curve, built term by term with measured points

  All four were rendered with renderFigure and inspected.

## Drills (`drills/r2-phys-m12.yaml`, 6)
The six drills are interval, doppler, tunneling, stm, alpha-q and semf.
- 3 s.f. answers use relTolerance 0.006 or more.
- The tunneling T uses 0.025, to allow for the chain from a rounded κ (2κL ≤ 16).
- The Doppler and STM drills keep the choice label (receding/approaching, widens/narrows) separate from the numeric sign by using calc copies.

## Glossary and cards
- `glossary-r2-phys-m12.yaml`: 29 terms. These cover the spacetime/interval family, redshift, the relativistic and transverse Doppler effects, the tunneling terms (STM, penetration depth, Geiger–Nuttall law), Q-value, exo/endothermic, the SEMF (aliases liquid-drop model, SEMF) and its five terms. I checked every course glossary file for duplicates; none were found. The only duplicate in the course, `h`, is not mine.
- `cards-r2-phys-m12.yaml`: 29 cards (10 / 9 / 10 per honors lesson).

## For the reviewer
- **Overlap avoided:** my first draft of h1 was on relativistic collisions, invariant mass and thresholds. The phys-h2 writer's 93-four-momentum.md covers the same ground (invariant mass, pair production, the antiproton threshold, colliders), so I deleted that draft, its image and its drills, and wrote h1 on spacetime, twins and Doppler instead. h3 mentions thresholds only in passing ("somewhat more than |Q|"). The phys-h2 writer's glossary defines invariant mass and positron; I don't.
- **Simplified, and labeled as such in the lessons:**
  - The barrier SVG is schematic.
  - T ≈ e^(−2κL) is an order-of-magnitude form.
  - The SEMF coefficients are "one common fit" (Rohlf-style: 15.75, 17.8, 0.711, 23.7, 11.18/√A).
  - The line of stability ignores the n–p mass difference.
  - The fissility limit 2a_S/a_C ≈ 50 is an estimate.
  - Very distant redshifts are cosmological (general relativity).
- **Worth a second look:**
  - The flash-memory wording: "erases (and in many designs writes) by tunneling".
  - The Hafele–Keating summary ("tens to hundreds of ns, gravity also contributes").
  - The CERN muon ring γ ≈ 29.
  - Pa-234m, the excited state with a 1.2 min half-life, in the decay chain.
- **Number checks:** every number was recomputed in Python. Examples: κ = 8.87 nm⁻¹, exact T = 5.37×10⁻⁴, STM factor 0.114, Ra-226 Q = 4.871 MeV and K_α = 4.785 MeV, D–T Q = 17.59 MeV, Fe-56 SEMF 495.4 MeV, and the measured B/A values computed from AME atomic masses.

## Errors found in existing content
None. I didn't edit any existing question, drill, card or glossary entry.

## Sources
- Standard constants: CODATA values already in the course, plus ħc = 197.3 eV·nm.
- AME atomic masses, for the nuclides listed in the lessons and drills.
- Historical facts checked against standard references:
  - Minkowski 1908
  - Gamow, and Gurney and Condon, 1928
  - Geiger–Nuttall 1911
  - Binnig and Rohrer (STM) 1981, Nobel 1986
  - Esaki 1957
  - Weizsäcker 1935
  - Bohr and Wheeler 1939
  - Hafele and Keating 1971
  - Millikan 1916, Compton 1923, Davisson and Germer 1927
