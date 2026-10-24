# Round 2 notes: module phys-m5 (Rotation and gravitation)

`content/math/check-module.sh university-physics-1 phys-m5`: build and checker OK, zero problems
(8 lessons, 123 questions, 19 drills, 52 cards).

## Added

**Honors lessons** (three: the module has five core lessons and there was clearly more worth teaching)
- `lessons/19h1-skidding-rolling.md` (phys-m5-h-skidding, "Skidding, rolling and the sweet spot",
  45 min, ~1,750 words): slip velocity and the direction of kinetic friction, sliding-to-rolling
  with forces and torques, the same result from angular momentum about a floor point,
  $v_f = (v_0 + cR\omega_0)/(1 + c)$, energy lost $c/(1 + c)$, backspin, center of percussion
  ($b = I_P/Md$), cue-ball strike height $1.4R$, bat sweet spot (labeled as a simplified model).
  Examples: bowling ball (2.33 s, 5.71 m/s, 16.0 m, 64 J of 224 J lost); hoop with backspin
  returning at 0.90 m/s; rod held at an end ($\tfrac23L$).
- `lessons/19h2-gyroscopes.md` (phys-m5-h-gyroscopes, "Gyroscopes, precession and unbalanced spin",
  45 min, ~1,730 words): derivation of $\Omega = Mgr/(I\omega)$, independence of tilt, direction by
  the right-hand rule, gyroscopic approximation, nutation (qualitative, labeled), Earth's axial
  precession, crooked dumbbell ($\vec L$ not along $\vec\omega$, bearing torque
  $2ma^2\omega^2\sin\beta\cos\beta$), principal axes, static vs dynamic wheel balancing, control
  moment gyroscopes, the bicycle-gyroscope claim (labeled contested). Examples: toy gyroscope
  (2.04 rad/s, 3.1 s), crooked rotor (1.92 N·m, 9.6 N per bearing), flipping a wheel on a stool.
- `lessons/19h3-shell-theorem-tides.md` (phys-m5-h-tides, "The shell theorem, gravity inside a
  planet, and tides", 50 min, ~1,810 words): gravitational potential, proof of the shell theorem
  by rings ($dV = -GM\,ds/2rR$), $g$ inside a uniform planet (and the real Earth, labeled), tunnel
  through Earth as SHM, tidal acceleration $2GMd/D^3$, two bulges, spring/neap tides, equilibrium
  tide labeled as simplified, tidal friction, Moon's recession, tidal locking, Roche limit (rigid
  estimate derived, Roche's fluid value quoted). Examples: tunnel (84.4 min, 42 min one way,
  7.9 km/s); Moon vs Sun tides ($1.10\times10^{-6}$ vs $5.05\times10^{-7}$ m/s²); Earth–Moon Roche
  limit (9,500 km rigid, 18,400 km fluid).

Topics chosen to avoid the phys-h1 honors module (Lagrangian/Hamiltonian, Kepler problem, orbital
transfers): no orbit derivations here.

**Core lessons 15–19** (additions only; each has 2–3 new figures, introduced by a sentence):
- 15: SVG disk with θ, s, r, v, aₜ, a꜀; Mermaid "which constant-α equation" chart; ω–t plot of
  Example 1 with the angle as shaded area.
- 16: SVG lever arm / line of action; Mermaid two routes for massive-pulley problems (forces and
  torques vs energy).
- 17: SVG translation + rotation = rolling; Mermaid "is angular momentum conserved?" chart.
- 18: SVG tipping boxes (20° falls back, 45° tips; one sentence with the 31° tipping angle);
  Mermaid solving procedure; SVG free-body diagram of Example 3.
- 19: SVG ellipse to scale (e = 0.6) with equal-area wedges computed from Kepler's equation,
  foci, perihelion, aphelion, semimajor axis; plot of K, U, E against r for circular orbits.

**Pictures** (14 SVGs, original, 1.5–4.7 KB each, all rendered and looked at; blanks checked
with their markers): phys-m5-disk-kinematics(+blank), lever-arm(+blank), rolling-sum(+blank),
hinged-beam(+blank), tipping, kepler-ellipse(+blank), skid(+blank), sweet-spot, gyroscope(+blank),
dumbbell, shell-ring, tides(+blank).

**Diagrams**: 5 Mermaid (lessons 15, 16, 17, 18, 19h1), all with accTitle/accDescr, rendered.
Plots: 4 new (`plot` blocks in 15, 19, 19h1, 19h3), rendered with the app's CSS and labels moved
off the curves.

**Questions** (68, `questions/r2-phys-m5.yaml`)
- Core phys-m5-r2-q01…q25, five per lesson, one of each type in every lesson (label, text,
  match, order, select-all).
  module_quiz: q02, q07, q12, q14, q17, q22, q24.
- Honors phys-m5-r2-h01…h14 (skidding: 8 MC, 2 text, 1 order, 1 match, 1 label, 1 select-all),
  h15…h28 (gyroscopes: 9 MC, 2 text, 1 match, 1 select-all, 1 label), h29…h43 (tides: 9 MC,
  2 text, 1 order, 1 match, 1 label, 1 select-all). No module_quiz (core-module honors lessons).
- Correct positions of the 26 four-choice MC: 0: 6, 1: 7, 2: 7, 3: 6.
- Every numeric key and distractor recomputed in Python; text answers are exact values
  (20, 10, 1/2, 1.0, 4, 3.0, 2/7, 1/6, 8) with unit and word variants listed.

**Drills** (6, `drills/r2-phys-m5.yaml`): phys-m5-r2-skid-to-roll, phys-m5-r2-sweet-spot (19h1);
phys-m5-r2-precession, phys-m5-r2-imbalance (19h2); phys-m5-r2-inside-planet, phys-m5-r2-tidal
(19h3). Each generated 600 times with a script that re-reads the numbers from the prompt as shown
and recomputes independently: 0 mismatches; my 3 s.f. answers and every bold solution value
accepted; a 5% wrong answer rejected; no unfilled placeholders. (The TeX display of the `sci`
answers in the tidal drill can't be typed back literally, as with the existing elastic-stretch
drill; typed 3 s.f. values like 3.18e-4 are accepted.)

**Glossary** (13, `glossary-r2-phys-m5.yaml`, checked against every glossary*.yaml in the course,
including other writers' r2 files): slip velocity, center of percussion, gyroscopic approximation,
nutation, axial precession, principal axis, gravitational potential, shell theorem, tidal force,
spring tide, neap tide, tidal locking, Roche limit. Every bolded term in the honors lessons has an
entry (kinetic friction and precession already existed).

**Cards** (25, `cards-r2-phys-m5.yaml`): 8 skidding, 9 gyroscopes, 8 tides.

## For a reviewer to double-check
- Bowling example uses $\mu_k = 0.10$ "chosen for round numbers" (real lanes are oiled unevenly);
  the 18.3 m lane is foul line to head pin.
- Real Earth: $g$ peaks at about 10.7 m/s² near the core–mantle boundary (PREM, via LibreTexts).
- Axial precession about 25,800 years ("about 26,000"), Hipparchus about 130 BCE (Britannica:
  25,772 yr, c. 129 BCE); "roughly 12,000 years from now the pole will lie near Vega"; tropical
  year about 20 minutes shorter than the sidereal year.
- Moon recedes about 3.8 cm/yr (NASA GSFC lunar laser ranging page).
- Bicycle stability: Kooijman, Meijaard, Papadopoulos, Ruina, Schwab, Science 332 (2011) 339–342.
- Roche limit: our rigid estimate gives $1.26R_p(\rho_p/\rho_m)^{1/3}$; Roche's fluid value
  $2.44R_p(\rho_p/\rho_m)^{1/3}$; densities 5510 and 3340 kg/m³. "Saturn's main rings lie largely
  inside Saturn's Roche limit" and Shoemaker–Levy 9 (broken up 1992, impact 1994) are stated
  without numbers.
- Bay of Fundy tidal range "more than 15 m".
- The disk picture in lesson 15 draws the tangential acceleration backward (the disk is slowing);
  its label question numbers four parts and leaves that arrow unnumbered because it lies along
  the rim arc.

## Errors found in existing content
None. (All existing phys-m5 questions, drills, glossary entries and cards left unchanged.)

## Sources
OpenStax University Physics Vol. 1 (rolling, angular momentum, precession, gravitation);
LibreTexts "Earth Density Model" (PREM gravity profile); Britannica "precession of the equinoxes";
NASA GSFC "Measuring the Moon's Distance" (3.8 cm/yr); SWOV summary of Kooijman et al. 2011
(Science 332:339). Standard constants: $G = 6.67\times10^{-11}$, $M_E = 5.97\times10^{24}$ kg,
$R_E = 6.37\times10^6$ m, $M_{\text{Moon}} = 7.35\times10^{22}$ kg, $D = 3.84\times10^8$ m,
$M_{\text{Sun}} = 1.99\times10^{30}$ kg, 1 AU $= 1.496\times10^{11}$ m.
