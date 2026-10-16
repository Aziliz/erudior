# Physics course (science-physics) — progress

Folder `content/math/physics`, id prefix `phys-`. Each lesson teaches the algebra-based
treatment first, then a "With calculus" section for the University Physics level.

## Status: complete

All 12 modules, cards, glossary and reference sheets are written.
`python3 content/math/build.py physics` and
`npx tsx tests/check-course.mts samples/math/science-physics.json` both pass with zero problems.

Final counts: 46 lessons, 12 modules, 481 questions (answer positions balanced 120/121/120/120),
133 drills, 250 notecards, 361 glossary terms, 5 reference sheets
(constants, units and conversions, mechanics equations, waves/fluids/thermo equations,
E&M/optics/modern equations).

## Outline

| # | Module | Lesson id | Title | Qs | Drills |
|---|---|---|---|---|---|
| 01 | m1 | phys-measurement | Measurement, units, and significant figures | 12 | convert-speed, convert-area, sigfigs |
| 02 | m1 | phys-vectors | Vectors | 12 | vec-components, vec-add, dot-product |
| 03 | m2 | phys-motion-1d | Describing motion in one dimension | 10 | avg-velocity, calc-velocity |
| 04 | m2 | phys-const-accel | Constant acceleration and free fall | 11 | stopping, free-fall, thrown-up |
| 05 | m2 | phys-projectiles | Projectile motion | 10 | proj-horizontal, proj-angle |
| 06 | m2 | phys-motion-2d | Motion in two dimensions and relative motion | 10 | river-crossing, plane-wind, vector-kinematics |
| 07 | m3 | phys-newton | Newton's laws and free-body diagrams | 11 | fnet-accel, elevator, two-forces |
| 08 | m3 | phys-friction | Friction and inclined planes | 11 | incline-frictionless, incline-friction, static-friction |
| 09 | m3 | phys-tension | Tension, pulleys, and connected objects | 10 | atwood, table-pulley, hanging-sign |
| 10 | m3 | phys-circular | Uniform circular motion | 11 | centripetal, flat-curve, vertical-loop |
| 11 | m4 | phys-work | Work and kinetic energy | 10 | work-angle, work-ke, spring-work |
| 12 | m4 | phys-energy | Potential energy, conservation of energy, and power | 11 | energy-ramp, spring-launch, power |
| 13 | m4 | phys-momentum | Momentum, impulse, and center of mass | 10 | impulse, recoil, com |
| 14 | m4 | phys-collisions | Collisions | 11 | inelastic, elastic-1d, ballistic |
| 15 | m5 | phys-rot-kin | Rotational kinematics and moment of inertia | 10 | rot-kinematics, moment-inertia, rot-ke |
| 16 | m5 | phys-torque | Torque and rotational dynamics | 10 | torque, pulley-disk |
| 17 | m5 | phys-rolling | Rolling and angular momentum | 10 | rolling-incline, angmom-skater |
| 18 | m5 | phys-equilibrium | Static equilibrium | 10 | seesaw, beam-supports |
| 19 | m5 | phys-gravitation | Gravitation and orbits | 11 | grav-force, orbit-speed, escape-speed |
| 20 | m6 | phys-shm | Simple harmonic motion | 11 | spring-period, pendulum-period, shm-max |
| 21 | m6 | phys-waves | Waves and superposition | 11 | wave-speed, string-wave |
| 22 | m6 | phys-sound | Sound | 11 | decibels, doppler, pipe-harmonics, beats |
| 23 | m7 | phys-fluid-statics | Pressure and buoyancy | 10 | pressure-depth, buoyancy, hydraulic |
| 24 | m7 | phys-fluid-flow | Fluid flow and Bernoulli's equation | 10 | continuity, bernoulli, torricelli |
| 25 | m7 | phys-heat | Temperature, heat, and phase changes | 10 | calorimetry, phase-change, expansion, conduction |
| 26 | m7 | phys-gases | Ideal gases and kinetic theory | 10 | ideal-gas, combined-gas, vrms |
| 27 | m7 | phys-first-law | The first law of thermodynamics | 10 | first-law, isobaric-work, isothermal-work |
| 28 | m7 | phys-second-law | Heat engines, entropy, and the second law | 10 | carnot, engine-efficiency, entropy-melt |
| 29 | m8 | phys-coulomb | Electric charge and Coulomb's law | 10 | coulomb-force, coulomb-net |
| 30 | m8 | phys-efield | The electric field | 10 | efield-point, efield-accel, efield-two |
| 31 | m8 | phys-gauss | Gauss's law | 10 | gauss-sphere, gauss-line |
| 32 | m8 | phys-potential | Electric potential and potential energy | 10 | potential-point, accel-voltage, uniform-field-v |
| 33 | m8 | phys-capacitance | Capacitance and dielectrics | 10 | parallel-plate, cap-combo, cap-energy |
| 34 | m9 | phys-current | Current, resistance, and power | 10 | ohms-law, resistivity, energy-cost |
| 35 | m9 | phys-dc-circuits | DC circuits and Kirchhoff's rules | 11 | series-parallel, internal-resistance, kirchhoff |
| 36 | m9 | phys-rc | RC circuits | 10 | rc-charging, rc-time |
| 37 | m10 | phys-mag-force | Magnetic forces | 10 | charge-in-b, wire-force, mass-spec |
| 38 | m10 | phys-mag-sources | Sources of magnetic fields | 10 | wire-field, solenoid, parallel-wires |
| 39 | m10 | phys-induction | Electromagnetic induction | 10 | faraday-emf, motional-emf, transformer |
| 40 | m10 | phys-inductance | Inductance, RL and LC circuits, and AC | 10 | rl-time, lc-frequency, ac-rms |
| 41 | m11 | phys-light | Light: electromagnetic waves, reflection, and refraction | 11 | em-wavelength, snell, critical-angle, malus |
| 42 | m11 | phys-mirrors-lenses | Mirrors and thin lenses | 11 | thin-lens, mirror, two-lens |
| 43 | m11 | phys-wave-optics | Interference and diffraction | 11 | double-slit, grating, thin-film |
| 44 | m12 | phys-relativity | Special relativity | 11 | time-dilation, length-contraction, rel-energy |
| 45 | m12 | phys-quantum | Photons, atoms, and matter waves | 11 | photon-energy, photoelectric, bohr, de-broglie |
| 46 | m12 | phys-nuclear | Nuclear physics and radioactivity | 11 | half-life, binding-energy, carbon-dating |

Drill ids are `phys-<name>`.

## Notes for reviewers

- Glossary has 361 terms (above the 120–250 guideline) because every bolded term in 46 lessons has
  an entry; 22 extra entries are unbolded but useful (e.g. photoelectric effect, Kepler's laws).
- Numeric answers in lessons, questions and drills were checked in Python.
- All drill answers display with `format: sig4` unless another format was needed.
- Drill authoring traps found and fixed: single-letter values in TeX braces (e.g. a var `E`
  inside `\mathcal{E}`, `\dfrac{c}{f}`); thousands separators inside math (use `:dp0`);
  the checker's wrong answer is target*1.5+7.77, so targets near -15.54 are excluded with `where`.
- Circuits are described in words (no circuit diagrams); force diagrams, inclines, ray diagrams,
  field plots and kinematics graphs use figure blocks.
