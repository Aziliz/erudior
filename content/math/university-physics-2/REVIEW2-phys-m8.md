# Round 2 review: module phys-m8 (Electrostatics)

Reviewer for assignment 142. Scope: honors lessons 06h1–06h3, round 2 additions to core lessons
01–06, `questions/r2-phys-m8.yaml`, `drills/r2-phys-m8.yaml`, `glossary-r2-phys-m8.yaml`,
`cards-r2-phys-m8.yaml`, `images/phys-m8-*`. After the fixes,
`content/math/check-module.sh university-physics-2 phys-m8` reports zero problems (9 lessons,
135 questions, 22 drills, 60 cards).

## Changes

### Answer key
- **phys-m8-r2-h38** (match): the distractor "Energy density of the field inside a capacitor" was
  a correct match for $\sigma^2/(2\varepsilon_0)$, because the field between plates is
  $\sigma/\varepsilon_0$, so $\tfrac12\varepsilon_0E^2 = \sigma^2/(2\varepsilon_0)$. The explanation's
  "energy per volume, not pressure" doesn't hold up: J/m³ and Pa are the same unit. The question had
  two defensible answers for one row. I replaced the distractor with "Field just outside a charged
  conductor" ($\sigma/\varepsilon_0$, clearly not on the list) and rewrote the last sentence of the
  explanation.

### Factual fixes
- **04-electric-potential.md, Mermaid "Which route…"**: the box "Uniform field: ΔV = Ed" sat right
  under "ΔV = minus the integral of E", so it read as a sign contradiction (along the field
  ΔV = −Ed). Changed it to "Uniform field: V drops by Ed along E" and updated accDescr to match. This
  also matches the lesson's own wording ("drops the potential by").
- **06h2 Example 3**: "illustrative values in the range of common polymer films" changed to
  "illustrative values like those listed for common plastics in textbook tables; thin films made for
  capacitors can withstand considerably higher fields". The values κ = 3.0 and 20 MV/m fit
  bulk-plastic tables (OpenStax University Physics 2, Table 8.1: nylon 3.4 / 14 MV/m, polystyrene
  2.56 / 24 MV/m). Thin capacitor films such as polypropylene and PET are rated at hundreds of MV/m,
  so the old wording understated them.
- **06h1, isolated neutral sphere**: "This is the full story behind a charged balloon pulling on a
  neutral metal object" overstated it, because real objects aren't spheres. It now reads "The same
  mechanism lets a charged balloon pull on a neutral metal object."

### Picture / figure fixes
- **06h3 surface-layer plot**: the "average" label touched the dashed vertical line at x = 1. I
  moved it to (1.35, 0.5), beside the end of the dashed average line, then re-rendered and checked it.

### Other fixes
- **phys-m8-r2-h32**: the explanation didn't name the mistake behind the $5.6\times10^{-7}$ J
  distractor. Added: using the diameter (0.20 m) as R.
- **drill phys-m8-r2-assembly-energy, solution**: "a negative one means the charges would pull
  themselves together" isn't right for mixed-sign sets, where some pairs still repel. It now says
  that assembling them released energy, and the same amount of work is needed to pull them apart
  again.
- **glossary "Earnshaw's theorem"**: "no minimum" changed to "no local minimum or maximum", since a
  negative charge would need a maximum.

## Checked and found right (in case a reader doubts them)
- Every number in the three honors lessons was recomputed in Python. 06h1: Ex. 1 (1.0e-5 N,
  −3.5e-7 and −1.3e-7 C/m², 3.0e-7 J), Ex. 2 (−1.33 nC, 1.67 cm, 2.7e-6 N; plate comparison
  3.6e-6 N), Ex. 3 (−0.72 eV). 06h2: Ex. 1 (44.3 / 73.8 pF, 41.7 / 8.33 kV/m, 83%), Ex. 2, Ex. 3
  (200 V, 5.3e3 vs 40 J/m³, ratio ≈ 133), salt estimate (5.1 eV → 0.064 eV). 06h3: Ex. 1 (0.49 J
  both ways), U-238 (983 MeV; 238 × 7.57 ≈ 1,800 MeV total binding), plate force (4.4 Pa, 0.18 N),
  ball self-energy split (kQ²/2R outside + kQ²/10R inside).
- Image-charge results (plane σ(r), work kq²/4d, sphere q′ = −qR/a at R²/a, neutral-sphere second
  image), σ_b = P·n̂ sign on each face, κ = 1 + χ_e, σ_b = σ_f(1 − 1/κ), the fringing-force formula
  (κ − 1)ε0wV²/(2d), electrostatic pressure σ²/(2ε0) with the profile-independent derivation, and
  the virtual-work signs all agree with Griffiths, *Introduction to Electrodynamics*, ch. 2–4.
- Penning trap (static E + B) and Paul trap (RF) as ways around Earnshaw; the classical electron
  radius 2.818 fm (CODATA 2022) and its role in the Thomson cross-section; Kelvin's attracted-disk
  (absolute) electrometer weighing the plate force; MEMS comb drives using F = ½V² dC/dx.
- All 72 questions were worked before reading the key. Every MC distractor value was recomputed and
  matches the mistake its explanation names (after the h32 fix). The order questions (q01, q13, q25,
  q28, h11, h26, h39) each have exactly one order; the q25/h26/h39 values are recomputed in the
  explanations. Every select-all choice is clearly right or clearly wrong.
- Drills: formulas re-derived independently. For phys-m8-r2-image-plane I sampled 3,000 instances
  and confirmed that 3-s.f. answers fall within relTolerance 0.01 (worst case is 0.5%). The sphere
  force matches the closed form kq²Ra/(a² − R²)². The nuclear self-energy for C-12 is 11.3 MeV and
  for U-238 is 983 MeV.
- All 14 SVGs were rendered and read. The deflection path's parabola is tangent-continuous with the
  straight segment (both slopes 0.318). The water angle measures ≈105°. The plate equipotentials sit
  at 1/4, 1/2 and 3/4 of the gap. Field lines in the image-plane figure all point away from +q and
  meet the plate at right angles. Every label-question marker sits on the part it names (q06, q11,
  q16, q21, q26, h13).
- All six Mermaid diagrams were rendered. accTitle/accDescr describe the whole diagram.

## Left as is / uncertain
- `phys-m8-dielectric.svg` and `phys-m8-deflection.svg` draw the plates' + and − signs on the outer
  side of each plate. This is the usual schematic convention, but strictly, free charge sits on the
  inner faces. I didn't change it.
- Overlap: none found. 06h1/06h2 are the only lessons in the course with Poisson/Laplace, images,
  P and D. The phys-h2 lesson `92-radiation.md` bolds "classical electron radius", which is defined
  only in this module's glossary, so there is no duplicate. That lesson gives
  r_e = 2.81 × 10⁻¹⁵ m, while CODATA 2.8179 fm rounds to 2.82. This is a phys-h2 file, so I left it
  for that module's reviewer.

## Sources
- Griffiths, *Introduction to Electrodynamics* (4th ed.), ch. 2–4.
- OpenStax, *University Physics Volume 2*, ch. 5–8 (Table 8.1 dielectric constants and strengths).
- NIST CODATA 2022: classical electron radius 2.8179403 × 10⁻¹⁵ m.
- AME/NNDC binding energy of U-238: 7.570 MeV per nucleon.
