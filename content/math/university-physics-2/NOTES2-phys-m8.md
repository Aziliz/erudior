# Round 2 notes: module phys-m8 (Electrostatics)

`content/math/check-module.sh university-physics-2 phys-m8`: build and checker report zero problems
(9 lessons, 135 questions, 22 drills, 60 cards, 245 terms).

## Added

**Honors lessons** (3; the module has 6 core lessons and plenty beyond them)
- `lessons/06h1-images-laplace.md` (phys-m8-h-images, "Laplace's equation and the method of images",
  45 min, ~1,900 words): Poisson and Laplace equations (checked on plates and a point charge), the
  averaging property, Earnshaw's theorem (Penning/Paul traps), the uniqueness theorem with a sketch
  proof and the Faraday cage as a corollary, the image charge for a grounded plane (force, induced
  σ(r), total −q, work kq²/(4d) and why it is half the pair energy), the grounded-sphere image
  (−qR/a at R²/a, verified at two points, isolated neutral sphere), the image potential of an
  electron near a metal (labeled a simplification). Examples: charge above a plate; charge near a
  grounded sphere (compared with a plate); electron image energy 0.72 eV at 0.5 nm.
- `lessons/06h2-dielectrics.md` (phys-m8-h-dielectrics, "Dielectrics in depth", 45 min, ~1,900
  words): polarization vector, bound vs free charge, σ_b = P·n̂, linear dielectrics and
  κ = 1 + χ_e, σ_b = σ_f(1 − 1/κ), D and Gauss's law for free charge, permittivity, point charge in
  a dielectric and why salt dissolves (labeled rough), partly filled capacitors (stacked = series,
  side by side = parallel), inserting a slab with the battery disconnected or connected (energy
  bookkeeping), the fringing-field force (κ − 1)ε0wV²/(2d), dielectric strength and maximum energy
  density. Examples: glass slab in an air gap (C, fields, 83% of V across the air); 20 pF capacitor
  with and without battery; polymer film vs air energy density (film values labeled illustrative).
- `lessons/06h3-energy-forces.md` (phys-m8-h-energy, "Electrostatic energy and forces on
  conductors", 45 min, ~1,450 words): assembly energy (pair sum and ½ΣqV), U = ½∫ρV = (ε0/2)∫E²,
  self-energy of a shell and of a uniform ball (derived layer by layer, checked with the field
  integral), infinite point-charge self-energy, classical electron radius (stated as not a real
  size), Coulomb energy of U-238 (~980 MeV), electrostatic pressure σ²/(2ε0) with the average-field
  argument (profile-independent derivation), force between plates ½QE, virtual work at fixed Q and
  at fixed V. Examples: four charges on a square (0.49 J, checked both ways); U-238; plate force
  0.18 N.

**Core lessons 01–06** (additions only, each figure introduced or referred to in the text):
- 01 Coulomb: charging-by-induction picture (4 panels, SVG); net-force procedure (Mermaid).
- 02 Field: deflection-plates picture (SVG) with two new sentences on the electron's path; ring
  geometry figure (```plot) for the ring-axis derivation.
- 03 Gauss: Gaussian surfaces for the three symmetries (SVG); "which Gaussian surface" decision
  chart (Mermaid).
- 04 Potential: plates with field lines and equipotentials (SVG) plus one sentence; "which route to
  E or V" chart (Mermaid).
- 05 Dipoles: water molecule as a dipole (SVG) plus a short paragraph (bent shape; CO₂ cancels).
- 06 Capacitance: polarized dielectric between plates (SVG) with a short paragraph on bound
  charge; series and parallel circuit diagrams (SVG).

**Pictures** (14 SVGs, all original, 1–12 KB, rendered and checked): phys-m8-induction,
phys-m8-deflection(+blank), phys-m8-gauss-surfaces(+blank), phys-m8-plates(+blank),
phys-m8-water(+blank), phys-m8-cap-combos, phys-m8-dielectric(+blank), phys-m8-image-plane(+blank).
The field lines in phys-m8-image-plane are computed numerically from the charge and its image.
Label markers were previewed on every blank.

**Other figures**: Mermaid 6 (3 core, 1 per honors lesson: method of images, battery
connected/disconnected, virtual-work rule), all with accTitle/accDescr, rendered. Inline figures 4
(ring geometry; grounded-sphere image; slab capacitor; E across the gap; surface-layer field ramp,
which is 5 counting both in 06h2), rendered with the app's renderer and checked.

**Questions** (72, `questions/r2-phys-m8.yaml`)
- Core phys-m8-r2-q01…q30, 5 per lesson: text 8 (q02, q05, q07, q12, q15, q17, q22, q27), select-all
  6 (q03, q08, q14, q19, q24, q29), match 5 (q04, q09, q18, q23, q30), order 4 (q01, q13, q25, q28),
  label 5 (q06, q11, q16, q21, q26), MC 2 (q10, q20). Every lesson has a text, a select-all and an
  order or match question; every lesson with a labelable picture (02–06) has a label question.
  module_quiz: q01, q08, q14, q19, q23, q29 (one per lesson).
- Honors phys-m8-r2-h01…h14 (images: 8 MC, 2 text, 1 select-all, 1 order, 1 match, 1 label),
  h15…h28 (dielectrics: 9 MC, 2 text, 1 select-all, 1 match, 1 order), h29…h42 (energy: 8 MC,
  3 text, 1 select-all, 1 match, 1 order). No module_quiz (core-module honors lessons).
- Answer positions of the 27 new 4-choice MC questions: 0: 7, 1: 6, 2: 7, 3: 7. Every distractor's
  mistake is named in its explanation.

**Drills** (7, `drills/r2-phys-m8.yaml`): phys-m8-r2-image-plane, phys-m8-r2-image-sphere
(06h1); phys-m8-r2-slab-capacitor, phys-m8-r2-dielectric-insert (06h2);
phys-m8-r2-assembly-energy, phys-m8-r2-sphere-self-energy (nuclei C-12 to U-238),
phys-m8-r2-plate-force (06h3). All ask for 3 significant figures with relTolerance 0.01.

**Glossary** (18 terms, `glossary-r2-phys-m8.yaml`, checked against every glossary*.yaml in the
course, no duplicates): Poisson's equation, Laplace's equation, Earnshaw's theorem, uniqueness
theorem, image charge, method of images, polarization vector, bound charge, free charge, electric
susceptibility, electric displacement, permittivity, fringing field, dielectric strength,
self-energy, classical electron radius, electrostatic pressure, virtual work. Every bolded term in
the three honors lessons has an entry.

**Cards** (30, `cards-r2-phys-m8.yaml`): 10 method of images, 11 dielectrics, 9 electrostatic
energy.

## Verification
- Every number in the lessons, questions and explanations recomputed in Python (calc scripts),
  including each distractor's mistake value; image-sphere potential checked to be zero at random
  points of the sphere, and the induced charge on the plane integrated numerically to −q.
- Drills: 2,000 instances each, answers recomputed independently from the prompt text as shown;
  answers rounded to 3 s.f. accepted, a 5%-off answer rejected, and every bold solution value
  matches. 0 mismatches.

## For a reviewer to double-check
- **Glossary clash to watch:** the phys-h2 writer's lesson `92-radiation.md` also bolds
  "classical electron radius". It is defined in `glossary-r2-phys-m8.yaml`, so their glossary file
  must not define it again (their value 2.81 fm agrees with mine).
- 06h3 Example 2 (U-238 Coulomb energy ≈ 980 MeV with Z²) and the 23h3 honors lesson's
  semi-empirical Coulomb term (Z(Z − 1), a_C = 0.711 MeV) agree: 0.6 × 1.44/1.2 = 0.72 MeV.
- Simplifications are labeled in the text: the electron image potential near a surface (fails
  within a few tenths of a nm), salt dissolving in water (smooth-dielectric model at molecular
  distances), and the polymer film's κ = 3.0 and 20 MV/m (illustrative values).
- Historical/factual claims: Penning and Paul traps get around Earnshaw's theorem; the electron
  shows no structure far below r_e (stated without a specific limit); "nineteenth-century attracted
  disk electrometers" measured voltage by weighing the plate force (Kelvin's absolute
  electrometer); U-238 total binding energy about 1,800 MeV (7.57 MeV per nucleon).
- The classical electron radius is quoted as ≈ 2.8 × 10⁻¹⁵ m (CODATA 2.818 fm; the course's rounded
  constants give 2.81).
- 06h3 is ~1,450 words of prose, toward the low end of the range but with three examples and three
  figures.
- The sig formats drop trailing zeros in shown answers (for example "12 V"), as elsewhere in the
  course.

## Errors found in existing content
- None. While reading lessons 01–06 I rechecked the worked examples I built on (water dipole
  0.04 nm shift, Example 3 ratio of about 670, Earth's capacitance about 0.7 mF, ring-axis field);
  all are correct.

## Sources
- OpenStax University Physics Vol. 2, ch. 5–8 (scope and notation only; no text used).
- Griffiths, Introduction to Electrodynamics, ch. 3–4 (standard results: uniqueness theorem, image
  charges for the plane and sphere, polarization and bound charge, D, electrostatic pressure).
- NIST CODATA 2022 values for e, m_e, c (classical electron radius 2.8179 fm).
- Nuclear radius rule R ≈ 1.2 fm · A^(1/3) and U-238 binding energy per nucleon (7.57 MeV), as used
  elsewhere in this course.
