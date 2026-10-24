# Round 2 notes: phys-h2 (Honors: Maxwell, relativity and quanta)

This is an honors module with 4 new lessons (files 90–93, `module: phys-h2`; the module is already marked honors in course.yaml). It is a cross-cutting capstone that follows one thread. Maxwell's equations at a point lead to light at speed c. From there, relativity explains the magnetic force as an electric force seen from another frame. Accelerated charges radiate, so the classical atom collapses, and Bohr's correspondence principle answers that. The last lesson treats photons as relativistic particles through four-momentum.

`content/math/check-module.sh university-physics-2 h2`: OK, zero problems (4 lessons, 58 questions, 8 drills, 34 cards).

## Lessons
| File | Id | Title | Words (prose / with figures) | Examples |
|---|---|---|---|---|
| 90-maxwell-differential.md | phys-h2-maxwell | Maxwell's equations in differential form | 1,700 / 1,850 | 3 |
| 91-fields-relativity.md | phys-h2-fields-relativity | Electric and magnetic fields in relativity | 1,930 / 2,180 | 3 |
| 92-radiation.md | phys-h2-radiation | Radiation from accelerating charges and the classical atom | 1,600 / 1,810 | 4 |
| 93-four-momentum.md | phys-h2-four-momentum | Photons as relativistic particles: invariant mass and thresholds | 1,600 / 1,750 | 3 |

What each lesson covers:
- **L90:** Divergence and curl as limits of flux and circulation. The divergence theorem and Stokes's theorem, and how they turn the integral laws into the four point laws. The continuity equation, and why div curl = 0 forces the displacement current. The vacuum wave equation from the curl-of-curl identity, c from μ0 and ε0, and plane-wave transversality with E = cB. Examples: ρ from a field; B between charging circular plates; B from E for a 100 MHz wave. The lesson closes with "a speed with no reference", which sets up L91.
- **L91:** Invariance of charge and λ = γλ0. Purcell's wire, derived in both frames, with F′ = γF explained. The general net density γvI/c². The full field transformations and the invariants E·B and E² − c²B², with a Mermaid decision chart. Examples: the proton beside a 15 A wire in two frames; a pure B field seen by a moving observer; the velocity-selector frame. The field of a fast charge is shown as a polar plot at 0.8c. A note covers the limits of the picture (spin, field tensor).
- **L92:** Thomson's kink picture (geometry stated, not derived) and the radiation field ∝ sin θ / r. The Poynting integral gives the Larmor formula. Applications: antennas, bremsstrahlung, synchrotron radiation and Rayleigh 1/λ⁴ (labeled as a simplified model). Classical collapse of hydrogen: 4.7e-8 W, then t = r0³/(4 r_e² c) ≈ 1.6e-11 s, derived. Bohr's stationary states and the correspondence principle, with a ratio plot and n = 100 worked out.
- **L93:** Four-momentum and the invariant product. Invariant mass of a system and of two photons (π0 identification). Why a free electron can't absorb a photon and why a lone photon can't pair-produce. The fixed-target threshold formula, applied to pair production on a nucleus (1.022 MeV) and on a free electron (2.044 MeV), and to the antiproton threshold of 6 m_p c² = 5.63 GeV (Bevatron, 1955). Compton's formula in four lines by squaring Q′. γγ absorption on the CMB is labeled a rough estimate.

**Overlap check.** No core lesson and no other round-2 honors lesson covers the differential Maxwell equations, field transformations, Larmor radiation and the classical atom, or four-momentum and thresholds. I checked the honors lessons that existed when I finished: 06h1–3, 09h1–2, 14h1–3, 19h1–3 and 23h1–3. Two links to other writers' work:
- 23h1 (phys-m12) teaches the spacetime interval. L93 only mentions it in passing ("like the spacetime interval").
- "classical electron radius" is already defined in glossary-r2-phys-m8.yaml. L92 bolds it and reuses that entry rather than defining it again.

## Questions (`questions/r2-phys-h2.yaml`, 58: phys-h2-r2-h01 … h58)
- Questions per lesson: 14 / 15 / 15 / 14. Module quiz: 5 per lesson, 20 in total, covering every lesson topic.
- Types:
  - 34 multiple choice, with the correct index spread 9/9/8/8.
  - 4 select-all.
  - 8 text.
  - 4 match.
  - 4 order. Each order question is a dependency chain or a numeric ranking with only one valid order.
  - 4 label.
- Each lesson has at least one text, select-all, match, order and label question.
- Every numeric key and distractor was recomputed in Python, and each distractor's mistake is named in its explanation.

## Pictures and diagrams
- SVGs: all original and script-generated, with a white background, #1c2833 ink, text ≥14px, and each under 16 KB. Each one has a `-blank` copy for its label question.
  - `phys-h2-capacitor-gap` (L90)
  - `phys-h2-wire-frames` (L91): the lab frame and the charge's frame
  - `phys-h2-dipole-pattern` (L92): the true sin²θ polar curve
  - `phys-h2-pair-production` (L93): bubble chamber, with track curvature that matches q v × B for a field into the page
- Every SVG and every set of marker positions was previewed with preview-figure.mjs.
- Mermaid diagrams, one per lesson, all previewed:
  - from the integral laws to the wave equation (L90)
  - what a change of frame can do to E and B (L91)
  - classical collapse vs Bohr (L92)
  - checking whether a reaction can happen (L93)
- Plots: field strength of a charge at rest vs at 0.8c, as polar curves (L91); f_photon/f_orbit against n (L92).

## Drills (`drills/r2-phys-h2.yaml`, 8)
- phys-h2-r2-divergence-charge, -capacitor-b (L90)
- phys-h2-r2-field-transform, -wire-frames (L91)
- phys-h2-r2-larmor-cyclotron, -correspondence (L92)
- phys-h2-r2-two-photon-mass, -threshold (L93; seven reactions, using PDG-rounded masses that are stated in the prompt)

How they were checked:
- I generated 1,000 instances of each with the app's generator and compared every answer with independent TypeScript formulas. There were 0 mismatches.
- I typed my own 3 s.f. answer (3 decimal places for the ratio) into each instance: always accepted. A 10%-off answer was always rejected.
- Solutions use texsci and dp1 inside math, so no "10^" text or thousands commas appear there.

## Glossary and cards
- `glossary-r2-phys-h2.yaml`: 23 terms.
  - L90: divergence, divergence theorem, curl, Stokes's theorem, continuity equation, wave equation, plane wave
  - L91: invariance of charge, field transformations, field invariants
  - L92: radiation field, Larmor formula, synchrotron radiation, bremsstrahlung, Rayleigh scattering, stationary states, correspondence principle
  - L93: four-momentum, invariant mass, center-of-momentum frame, positron, pair production, threshold energy
- I checked every glossary*.yaml in the course: no duplicate terms or aliases.
- `cards-r2-phys-h2.yaml`: 34 cards (9 / 8 / 8 / 9).

## For a reviewer
- L92's radiation field comes from Thomson's kink argument, but only the result is stated: the similar-triangles geometry is described, not carried out. Larmor and the collapse time are nonrelativistic estimates; the lesson says so.
- L91 derives the wire result only for a test charge moving at the electron drift speed (Purcell's case). The general net density γvI/c² is stated and is consistent with the field transformations.
- Historical claims to double-check:
  - Maxwell first reached the displacement current in 1861–62 through a mechanical ether model and kept it in his 1865 theory.
  - Thomson's kink picture.
  - The antiproton was discovered by Chamberlain, Segrè and team at the Bevatron in 1955. The Bevatron was built to reach about 6 GeV.
  - The highest-energy gamma rays detected come from galactic sources (LHAASO).
- phys-h2-r2-threshold: a calc line written as a bare number (`mt: 938.3`) made the expression parser fail with "Unexpected end". I worked around it with `mt: 2*469.15`. This may be a parser bug worth a look in src/lib (not touched).
- The L90 capacitor figure shows the B loop's arrow schematically, and the text does not rely on its sense.

## Errors found in existing content
None. I edited no existing files.

## Sources
Standard results (Griffiths, *Introduction to Electrodynamics*: field transformations, Larmor; Purcell & Morin, *Electricity and Magnetism*: the wire argument and Thomson's kink), the course's constants sheet, and PDG-rounded particle masses. All numbers were recomputed in Python and TypeScript.
