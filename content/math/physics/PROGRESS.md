# Physics (science-physics), algebra-based

On 2026-10-16 the original Physics draft (described below, algebra then calculus for each topic) was split: the calculus versions became University Physics I and II (content/math/university-physics-1, -2), and this course became algebra-based (AP Physics 1–2 level). Four editors removed the calculus and reviewed their modules; two independent reviewers then checked everything.

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
- Circuits are described in words and, since round 2, drawn as SVG circuit diagrams; force diagrams, inclines, ray diagrams,
  field plots and kinematics graphs use figure blocks.


## Algebra-based edit and review (2026-10-16)

# phys-a notes (modules phys-m1 to phys-m3, lessons 01-10, cards.yaml)

## Lessons (all 10 edited)
Every "With calculus" section removed and replaced with algebra/graph-level teaching:
- 01: section on units of graph slopes and areas + Example 5 (F-t graph area units); key point replaced.
- 02: "With calculus: dot and cross products" -> "Multiplying two vectors" (AB cos, AB sin, right-hand rule; determinant form dropped); Example 3 keeps the angle and gives |A x B| = 12.1; new Example 4 (right-hand-rule direction). Removed "differentiating r(t)" line.
- 03: derivatives/integrals and Examples 3-4 removed; new sections "Instantaneous velocity from a curved graph" (tangent slope, Example 3 using the existing plot) and "Reading one graph from another" (table + a-t graph figure, Example 4 with areas).
- 04: calculus derivation replaced by algebraic derivation of v^2 = v0^2 + 2a dx; new two-phase Example 4; terminal-velocity forward reference fixed.
- 05: calculus section -> "Scaling" (Example 4, proportional reasoning) + qualitative "Air resistance".
- 06: calculus section + Example 4 (r(t)) -> "Moving frames agree on acceleration" (algebraic) + new Example 4 (ball tossed on a train). "differentiate" in relative-velocity derivation replaced.
- 07: dp/dt section + F(t) example -> proportional reasoning (Example 3) and systems of objects (Example 4, supports q-0710); dp/dt key point replaced.
- 08: drag differential equation -> qualitative terminal velocity with v-t figure, v_T = mg/b and sqrt(2mg/(C rho A)), Example 4 (skydiver).
- 09: constraint derivatives -> rope-counting argument; ropes with mass with Example 4.
- 10: parametric derivative section -> angular speed/rpm with Example 4; key point replaced.

## Questions (m01-m03: 108 -> 114)
Rewritten (calculus removed): 0307, 0308, 0411, 0709, 0711, 0810, 0811, 0607, 1010 (new content, same ids); explanations de-calculused: 0303, 0507, 0610.
Added: 0311, 0312, 0412, 0511, 0611, 0911.
Fixed: 0101 explanation named the wrong mistakes (1.2 is km/min, not "60 s per hour"; 2.0 explained); 0109 distractor 250 000 L had no real mistake behind it -> 2 500 000 L, all distractors explained; 0111 choice had non-TeX "m^(3/2)/s"; 0207 distractor -4 unreachable -> 4, distractors explained; 0310 had two choices meaning the same thing (v = 0 and a = 0 twice). Rebalanced answer positions (0711, 0810).
All numeric keys re-solved in Python (/tmp/claude-0/phys-a/solve.py).

## Drills
Removed: phys-calc-velocity (x(t) derivatives), phys-vector-kinematics (d r/dt).
Added: phys-vt-graph (slope/area of a v-t graph, with figure) for lesson 03; phys-avg-2d (average velocity/acceleration from vectors) for lesson 06.
All m01-m03 prompts now state rounding (3 s.f., nearest 0.1 deg, or exact); solution bold values switched to sig3 so they are accepted; convert-speed now uses sigfigs: 3 (was sig4 display vs "3 s.f." prompt); m² listed first in area units.
Checked 500 instances each of all 28 drills (/tmp/claude-0/phys-a/drillcheck.mts): answers recomputed from prompt text, shown answer, solution value and 3-s.f. answers all accepted.

## cards.yaml (ids preserved: replaced in place, none deleted)
Calculus removed from: x(t)->v,a card (now tangent-slope card), linear-drag v(t), variable-force work integral, F = -dU/dx, impulse integral, center-of-mass integral, I = int r^2 dm, dL/dt, SHM differential equation, W = int P dV, flux/Gauss surface integrals, -grad V, dQ/dt, Ampere line integral, Faraday dPhi/dt, L dI/dt.

## Unresolved / for other editors
- Not in my scope but seen: references/*.md and glossary.yaml may still have calculus; checker problems remain in q-2701 (Markdown) and drill phys-pressure-depth ({atm}).
- Cards kept that use ln results beyond AP level (isothermal work nRT ln, entropy mc ln(T2/T1)); remove if the m07 editor drops them.

# Physics m4–m6 (lessons 11–22): algebra-based conversion + review

## Lessons (all 12 edited; 1,127–1,453 words each, 2–6 worked examples)
- L11 work: "With calculus" (line integral, F(x)=3x²−2x example) -> "Reading work from a force–position graph" (piecewise areas, spring trapezoid, Example 4 graph-area + speed). Key point fixed.
- L12 energy: calculus section (F=−dU/dx, U'' test, P=dW/dt, Example 5) -> "Force from a potential energy graph" (F = −slope, stable/unstable, new Example 5). Intro/key point reworded.
- L13 momentum: removed J=∫F dt, ∫x dm, calculus kick example and "differentiating" CM argument -> algebraic CM-velocity argument, "Force–time graphs" (triangle pulse Example 5), composite-object CM Example 6.
- L14 collisions: "With calculus: CM frame" retitled "Going further" (content was algebra).
- L15 rotation: removed dθ/dt and ∫r²dm derivations -> "Graphs of rotational motion" + Example 5; I table stated as given.
- L16 torque: cross-product/dω/dt/∫τdθ section -> "Torque direction and the right-hand rule" (keeps τz = xFy − yFx as lever-arm algebra).
- L17 rolling: dL/dt derivation and Ω=τ/L removed -> qualitative vector L, ΔL = τΔt, precession, Kepler 2.
- L18 equilibrium: ∫w(x)dx section -> "Spread-out loads and stability" (area/centroid).
- L19 gravitation: ∫ for U and g(r) inside planet removed -> "Where the formulas come from" (shell theorem stated, U via area argument) + Example 4 (lift to height R vs mgh).
- L20 SHM: differential-equation section and exponential damping formula removed -> "SHM and circular motion" (reference circle gives vmax=Aω, amax=Aω², a=−ω²x) + Example 4.
- L21 waves: wave PDE/∂y/∂t removed; kept y=A sin(kx−ωt) and standing-wave identity as "The wave function". Beats moved here from L22 (keeps both lessons at ≤3 drills).
- L22 sound: ∂s/∂x pressure section -> "Pressure and displacement" (qualitative, v=√(B/ρ)) + Example 4 (closed pipe from two resonances). Beats section moved to L21.

## Questions (m04 +5 net, m05 +1, m06 0)
- Rewritten (calculus): 1108 (∫4x³ -> F–x triangle area), 1209 (−dU/dx -> U-graph slope), 1308 (∫30t² -> F–t triangle), 1310 (λ=cx rod -> composite CM), 1509 (∫r²dm -> ω–t area), 1510 (dθ/dt -> ω²=ω0²+2αΔθ), 2009 (ẍ=−36x -> a=−36x).
- Added: 1111, 1112 (work), 1212 (power, module quiz – Power topic previously had no module-quiz question), 1213 (energy), 1511 (rot KE).
- Explanations de-calculused: 1109, 1211 (choice text too), 1709, 1809, 1909, 2011.
- 2208 (beats) moved to lesson phys-waves / topic Wave properties.
- Errors fixed: 1902 explanation named the wrong mistake for 4.9 m/s²; 1407 distractor 35 m/s matched no mistake (now 15.7 = energy through collision); 1207/1210/1309/1702 distractors replaced with real-mistake values; 1503 explanation referred to a choice by position (now by value). Added distractor-mistake notes to ~26 explanations.
- All numeric keys re-solved in Python (q.py); all matched.

## Drills (none removed/added; none needed calculus)
- phys-beats moved from L22's list to L21's; topic -> Wave properties; prompt now says tone to 1 decimal (shown x.5 answers were rejected at 3 s.f.).
- phys-power solution: `\dfrac{mgh}{t}` had {t} substituted (rendered "mgh over 3, 5") -> `{\,t}`.
- phys-ballistic solution showed m = 0.02 for a 16 g bullet (2-dp format) -> {m:dp3}.
- phys-pulley-disk solution α shown to 1 dp -> 2 dp.
- Every prompt now states units and rounding (3 s.f.; Doppler 4 s.f.; dB 1 dp; CM 2 dp).
- dr.mts: 33 drills × 400 instances, answers recomputed from the prompt text: 0 mismatches; shown answers and my 3-s.f. answers all accepted.

## Build/check
- Real repo and scratch copy: build OK, check-course OK (0 problems).
- Unresolved: none in scope. Glossary still has entries for "wave equation" (no longer bolded in L21) – harmless, outside my files.

# phys-m7 to m9 (lessons 23–36): algebra conversion and first review

## Lessons (all 14 edited)
Every "With calculus" section was removed and replaced with algebra-level teaching plus a new worked example:
- 23: force on a dam/pool wall from average gauge pressure (Ex 5), and air pressure falling off with height (qualitative). Removed key point dP/dy.
- 24: pipe changing height, Bernoulli with all three terms (Ex 4); draining tank, qualitative.
- 25: conduction proportional reasoning plus a window example (Ex 4). Removed Newton's law of cooling and c(T).
- 26: internal-energy example (Ex 4); qualitative Maxwell–Boltzmann section (temperature and mass effects, evaporation). Kept the plot and added a 900 K curve. Removed f(v), the integrals and vp/v̄/vrms ratios.
- 27: work explained as P·Δx, then as area under a PV graph (thin rectangles); trapezoid example with a figure (new Ex 3). Isothermal W = nRT ln(Vf/Vi) and PV^γ are now stated, with a graphical reason. Examples renumbered 4 and 5.
- 28: replaced ∫dQ/T with the Carnot result Q_H/T_H = Q_C/T_C derived from entropy balance (Ex 4) and entropy as probability (free expansion). Rounded Ex 3 to 1223/−1121/+103 J/K.
- 29: proportional reasoning; balance-point example (Ex 4). Removed the vector form and the rod integral, and fixed the common mistake that referred to the removed form.
- 30: electron deflection between plates (Ex 4), and why plates give a uniform field. Removed the ring, line and sheet integrals. Clarified the gravity-vs-electric-force remark.
- 31: flux as a sum over patches instead of ∮; rewrote the intro; cube-face flux by symmetry (Ex 4). Removed the nonuniform ρ(r) integral and the divergence form.
- 32: field as the negative slope of a V–x graph, with a figure (new Ex 3). Removed line integrals, gradient and the ring potential.
- 33: energy as the area under a V–Q graph; battery connected vs disconnected with a dielectric (Ex 4); isolated sphere C = 4πε₀R by algebra. Removed the cylindrical/spherical integrals.
- 34: charge as the area under an I–t graph (Ex 3); wire-scaling power example (Ex 4). Removed dQ/dt, current density and the cone integral.
- 35: maximum power transfer shown with a table, not dP/dR; bulb-brightness example (Ex 4). Removed the matrix/Cramer section.
- 36: loop-rule-at-any-instant reasoning; energy half-lost argument by average voltage; steady-state RC example (Ex 3). Removed the separation of variables and integrals.

## Questions (all keys verified in Python, no errors found in the existing keys)
- Rewrote 11 calculus questions: 2309, 2510, 2609, 2810, 2910, 3009, 3208, 3309, 3410, 3511, 3609 (all now AP-style proportional or graph questions). 2705's explanation dropped ∫P dV.
- Added 14: 2311, 2411, 2511, 2611, 2711, 2811, 2911, 3011, 3111, 3211, 3311, 3411, 3512, 3611 (one per lesson).
- Fixed explanation wording in 2701 (Markdown italics), 3108 and 3307 (integral wording).
- Marked 2505 module_quiz so the m7 quiz covers "Temperature and expansion" (it was missing).
- Counts: 11 questions per lesson (12 in dc-circuits), ≥3 module-quiz questions per lesson, every topic covered. Answer positions across m07–m09: 39/39/39/38.

## Drills (none removed; all 40 checked with 400 generated instances against my own calculation from the prompt text)
- phys-entropy-melt: part (b) used ∫mc dT/T. Rewritten as ice / room / total entropy for ice melting in a warm room.
- phys-isothermal-work: the solution no longer uses ∫P dV, and the prompt states the formula.
- phys-gauss-sphere: BUG. The prompt showed r to 2 decimals in meters (e.g. 0.02 m for 0.021 m), but the answer used the unrounded value. Distances are now shown in cm, exact.
- phys-rc-charging: BUG. The prompt showed t to 3 s.f. but the answer used the unrounded t (up to about 2% off at large t/τ). t is now exact (num4).
- phys-parallel-plate: the solution showed A to 2 dp (e.g. 0.03 for 0.0289); it now uses num4.
- phys-pressure-depth: the value `atm` clashed with \text{atm*} and was renamed natm; the bolded answer is now the Pa value.
- phys-bernoulli: answer now in kPa with 1% tolerance (0.5% could reject a correct 3 s.f. answer).
- phys-energy-cost: kWh could display as 0.00 (2 dp); now 3 s.f. with E ≥ 1 kWh.
- phys-kirchhoff: dropped the unexplained "determinant" in the solution and describes elimination instead.
- phys-engine-efficiency: retitled (it had no Carnot part).
- Every prompt now states units and rounding (3 s.f., nearest 0.1°C, nearest cent).

## For other editors / unresolved (outside my scope)
- references/waves-thermo.md (dP/dy, ∫P dV, ∫dQ/T, mc ln) and references/em-modern.md (−∫E·dl, ∇V, I = dQ/dt) still have calculus.
- cards.yaml: "Work done by a gas" (∫P dV) and "Current" (dQ/dt) cards.
- glossary.yaml: "Newton's law of cooling" and "current density" are no longer used in lessons 23–36. "Maxwell–Boltzmann distribution", "impedance matching", "electric flux", "Gaussian surface" and "area vector" are still used.
- Lesson 25 still lists 4 drills (calorimetry, phase-change, expansion, conduction), unchanged. All four are taught in it.

# Physics m10–m12 (lessons 37–46), glossary, references: algebra-based conversion + review

## Lessons (all 10 edited; every "With calculus" section removed)
- 37 Magnetic force: removed current-element integral and Lorentz-force ODE; added "torque but no net force on a loop" (algebraic), Example 4 velocity selector.
- 38 Sources: removed Biot–Savart integrals and integral Ampère's law; added superposition section + Example 4 (two wires, midpoint field), Ampère's law in symmetric form (B × path length = μ0 I_enc) deriving wire and solenoid fields. Key points updated.
- 39 Induction: removed integral Faraday law and B(t) = 0.20 + 0.30t² derivative example; added motional-emf derivation of generator peak NBAω, "Reading a flux graph" section with plot and new Example 3 (slopes of a flux–time graph). Key points: emf = N × slope.
- 40 Inductance/AC: removed RL/LC differential equations and rms integral; added average-power reasoning for ½LI², 63%/86% time-constant reasoning, sin² averaging argument with plot, Example 4 (series RLC impedance, resonance). Key points dI/dt → ΔI/Δt.
- 41 Light: removed wave equation and Fermat-principle derivative; added wavefront-geometry derivation of Snell's law, Example 3 (three polarizers).
- 42 Mirrors/lenses: removed longitudinal-magnification derivative; kept lensmaker's equation (algebraic) with proportional reasoning; added Example 4 (two-lens system).
- 43 Wave optics: removed single-slit integral and N-slit phasor formula; added Example 4 (single-slit band width, proportional reasoning), Example 5 (anti-reflection coating, two phase flips), qualitative fringe brightness/grating sharpness. Key points now give the two-flip coating condition.
- 44 Relativity: removed Lorentz transformation derivative and KE integral; added Example 4 (K = rest energy at 0.866c), "When does relativity matter" table (low-speed approximation, GPS).
- 45 Quantum: removed Schrödinger equation; added standing-wave quantization (particle in a box derived algebraically, Bohr orbits as 2πr = nλ), Example 5 (electron in 0.50 nm box).
- 46 Nuclear: removed dN/dt ODE and mean-lifetime integral; added "why exponential" (constant fraction, slope ∝ N, logs give T½ = ln2/λ), Example 4 (activity of 1.0 μg I-131).
- Drill lists trimmed to 3: lesson 41 no longer lists phys-em-wavelength, lesson 45 no longer lists phys-photon-energy (both drills still exist in the course).

## Errors fixed
- Lesson 44: muon rest-frame half-life 1.56 μs → 1.52 μs (mean life 2.20 μs × ln 2); numbers updated (15.2 μs, 4.54 km, 454 m).
- q-3801: explanation said 3.1e-4 T comes from "forgetting the 2π" (that gives 6.3e-4); it comes from using the loop formula μ0I/(2r).
- Module quiz gaps: no "AC circuits" question (lesson 40) and no "Nuclear structure" question (lesson 46) were in the module quizzes; q-4005 and q-4605 now module_quiz.
- phys-faraday-emf: area values like 0.028 m² displayed as "0.03" (default 2-decimal format) while the answer used 0.028 → {A:dp3}.
- phys-time-dilation: speeds like 0.995c displayed rounded ("0.99"/"1") → {b:dp3}.
- phys-grating: highest order used floor(d/λ), wrong when d/λ is a whole number (that order is at 90° and never appears) → ceil(d/λ) − 1 with explanation.
- phys-rl-time: prompt showed t rounded to 3 s.f. but answer used the unrounded t → answer now computed from the shown t.
- phys-solenoid: asked for inductance, which lesson 38 doesn't teach → now turns per meter + field.
- phys-charge-in-b: solution showed proton mass as 1.67e-27 while prompt gave 1.673e-27 → shows 1.673.
- phys-rel-energy: rest energy printed as "938.3000"/"0.5110" → now in the particle label.
- All 29 m10–m12 drill prompts now state units and rounding (3 s.f.; 4 s.f. where tolerance is 0.5%; nearest 0.1° for angles); de Broglie drill says to ignore relativistic effects.

## Questions (m10–m12: 106 → 117, none deleted outright; answer positions 29/29/30/29)
- Rewritten (calculus removed): q-3808 (Ampère symmetric form), q-3909 (now flux-graph slopes), q-4110 (now wavelength/frequency in glass), q-4311 (dark-fringe path difference, no intensity formula), q-4411 (now speed for K = mc²), q-3810 (now two-wire superposition; old one needed thick-wire Ampère).
- Explanations de-calculused: q-3703, 3907, 4008, 4009, 4608.
- Added: q-3711, 3712, 3811, 3911, 3912, 4011, 4012, 4112, 4212, 4312, 4612 (concept, proportional reasoning, graph reading).
- Choices reordered for balance: q-4108, 4110, 4205, 4402, 4601, 4610, 4612.
- Every question solved in Python; all keys confirmed.

## Drills
- None removed; none needed calculus. 4 rewritten (solenoid, rl-time, grating, rel-energy prompt), 2 display fixes, all prompts got units/rounding.
- Verified with /tmp/claude-0/phys-d/verify.mts: 1000 instances per drill, answers recomputed independently from the prompt text as shown, shown answers and 3/4-s.f. answers accepted.

## Glossary / references
- Glossary: removed Biot–Savart law and wave equation (calculus-only). Rewrote with Δ/slope/area or symmetric forms: instantaneous velocity, acceleration, Newton's second law, work, impulse, angular velocity, angular acceleration, moment of inertia, angular momentum, Newton's law of cooling, entropy, electric flux, Gauss's law, electric current, Ampère's law, magnetic flux, Faraday's law, inductance, generator (adds peak NBAω).
- mechanics.md: dx/dt, ∫ rows → graph slopes/areas; removed F = −dU/dx, ∫x dm, ∫r² dm; τ = ΔL/Δt.
- waves-thermo.md: ẍ → a = −ω²x; removed dP/dy; W = area under PV curve; entropy Q/T.
- em-modern.md: Gauss symmetric form; field from potential (uniform field); I = ΔQ/Δt; Biot–Savart removed, Ampère symmetric; Faraday with Δ, generator peak; transformer power; solenoid L; thin-film row now covers zero/two flips.

## Unresolved / for reviewers
- Inductance, RL/LC and impedance (lesson 40) are beyond AP Physics 2 but are standard in algebra-based college physics, so they were kept.
- phys-em-wavelength and phys-photon-energy are no longer linked from any lesson (to keep 2–3 drills per lesson); they still exist in the course.
- Glossary keeps algebraic but now-unreferenced entries (Lorentz transformation, Fermat's principle, mean lifetime).

# Physics review, modules phys-m1 to phys-m6 (lessons 01-22, questions m01-m06, drills m01-m06, cards.yaml)

## Method
- Questions (all 173 in m01-m06): solved every stem from the stem and choices alone (keys hidden), then compared with the keys: 173/173 match. Then read every explanation and checked each named distractor value numerically.
- Lessons 01-22: re-did the arithmetic for every worked example and checked every claim and figure spec against the text; rendered all lesson and drill figures with renderFigure (app CSS) and screenshotted them in Chromium (`figs.html`, `shot*.png`).
- Drills (all 61 in m01-m06): `drills.mts` generates 400 instances each and recomputes every answer independently from the numbers printed in the prompt. It also checks that the shown answer, the bold solution values and my own rounded answers (at the precision the prompt asks for) are accepted, and that a wrong answer is rejected. Answer values: 0 mismatches.
- cards.yaml: read all 250 cards and checked them against the lessons.

## Fixes
### Questions
- q-0201: the explanation referred to a choice by position ("gives the second choice"). It now names the value ($A_x = 8.7$ m, $A_y = 5.0$ m).

### Lessons
- L12 Example 4: "17.6/0.80 = 22.1 kW" is inconsistent (17.6/0.80 = 22.0). Changed to 17.64/0.80 = 22.05 ≈ 22 kW.
- L20 SHM figure: the "x(t) = A cos(ωt)" label sat on top of the "one period T = 2 s" point label. Moved it to (1.0, 1.33).
- L21 standing-wave figure: the "n = 3" curve label overlapped the x-axis title at the right edge. Removed it (the caption already says third harmonic).

### Drills
- 61 bold final answers in the m04-m06 solutions were printed with num1/num2/int formats, so they disagreed with the "3 significant figures" the prompts ask for, and typing them was often rejected. Examples: phys-rot-ke showed "**1 J**" for 0.9595 J; phys-spring-launch showed "0.24 m" for 0.245 m; phys-seesaw, phys-elastic-1d, phys-rot-kinematics, phys-spring-period, phys-grav-force and phys-escape-speed showed 2-decimal values that the answer box rejected. All are now sig3 (Doppler sig4, matching its prompt). Kept as they were: CM to 2 dp, dB and beat tone to 1 dp, and the integer KE loss and friction work.
- phys-proj-horizontal: the intermediate fall time was shown as 0.71 s, so "13(0.71) = 9.29" didn't multiply out. It now shows t to 3 s.f.

### Cards
- Card 155, "Entropy change heating from T1 to T2: ΔS = mc ln(T2/T1)", needs integration and is no longer taught in L28. Replaced it in place (card ids are positional) with "Total entropy change when heat Q flows from T_H to T_C: ΔS = Q/T_C − Q/T_H > 0", which L28 does teach.

## Verified, no change needed
- All other explanations name real mistakes (each named distractor value was recomputed).
- No positional references, Markdown or stray TeX in m01-m06 questions. Answer positions are reasonably balanced.
- No leftover calculus in lessons 01-22, the in-scope drills, the questions or the cards. The only "→ 0" limits are informal (L09, L10, L16) and fine at AP level.
- Cards that use ln or exponentials (isothermal work, RC charging and discharging, decay) match lessons 27, 36 and 46, which still teach them. That is the m7-m12 reviewer's call.

## Build / check
- `python3 content/math/build.py physics`: OK (46 lessons, 517 questions, 133 drills, 250 cards).
- `npx tsx tests/check-course.mts samples/math-drafts/science-physics.json`: OK, 0 problems.
- Remaining flags in drills.mts are harness artifacts: the TeX display of sci-format answers (typed plain answers are accepted), and a wrong-value probe that equals the target when a component is exactly −10.

## Unresolved
- None in scope. Cosmetic only: in phys-hanging-sign, the angle label touches the cable at small angles.

# Physics review: phys-m7 to phys-m12 (lessons 23–46), glossary, references

Method: solved all 248 m07–m12 questions in Python before reading the keys, then read every explanation.
Checked the physics and arithmetic of every worked example. Verified all 72 m07–m12 drills with
/tmp/claude-0/review-phys-b/verify.mts: 1000 instances per drill, answers recomputed independently from
the prompt text as shown, and both the shown answer and a 3 s.f. answer typed and accepted (4 s.f. where
asked). Rendered all 16 lesson figures in scope and screenshotted them in Chromium with the app stylesheet.
Build and checker: 0 problems.

## Errors fixed

### Lessons
- 27 First law, Example 3: the alternative path said the gas "expanded at 100 kPa and then had its pressure
  raised at constant volume". Going from A (300 kPa) to B (100 kPa) that's impossible. It now cools at constant
  volume from 300 to 100 kPa and then expands at 100 kPa (still 300 J).
- 30 Electric field: said the electric force on an electron in 100 N/C is "about 10^13" times its weight.
  The real ratio is eE/(mg) = 1.8×10^12, so it now says "about 2×10^12".
- 31 Gauss: claimed that symmetry shows why the field just outside a charged conductor is perpendicular to the
  surface. That's wrong: a general conductor has no symmetry, and the field is perpendicular because charges
  can't move along the surface. The sentence now keeps only the valid symmetry claim (a sphere's radial field).

### Figures (new figures, readability)
- 26 Maxwell–Boltzmann plot: the y tick labels (0.0002 to 0.0022) were clipped to "002", "0018" and so on, and
  both curve labels overlapped the x-axis title. The y axis is now "fraction of molecules per km/s" (values 0–2.3,
  same curves ×1000), and the curve labels are placed beside the curves.
- 32 V–x plot: the "(0.60, 0)" point label overlapped the "x (m)" axis title, so it was moved above the point.
- 40 sin² plot: the "V/V₀", "V²/V₀²" and average labels piled up on the axis title at the right edge. They are now
  placed in clear space.

### Questions
- q-4012 (series RLC current): the explanation said that adding X_L and X_C inside the root gives 1.5 A, but
  √(40² + 70²) = 80.6 Ω gives 1.24 A. That distractor is now 1.2 A and the explanation shows the 81 Ω.
- All other 247 keys matched my independent solutions. Each question has exactly one correct choice, the named
  distractor mistakes check out, choices are never referenced by position, and there is no Markdown and no calculus.

### Drills
- Linked phys-em-wavelength from lesson 41 (light) and phys-photon-energy from lesson 45 (quantum). Each of those
  lessons now lists 4 drills.
- phys-kirchhoff solution: a comma splice ("= E2$, Solve these…") is now a sentence break.
- No answer errors: all 72 drills match the prompt as shown, with shown and rounded answers accepted and units and
  rounding stated in every prompt.

### References
- waves-thermo.md: removed the entropy row's "heating at constant c: mc ln(T2/T1)". It needs calculus and is no
  longer taught. The row now says "ΔS = Q/T for heat at constant T" and gives the Carnot relation Q_H/T_H = Q_C/T_C.
- em-modern.md: wrote the uncertainty bound as h/(4π) instead of the ambiguous h/4π.

### Glossary
- No errors found. Every bolded term in lessons 23–46 has an entry, and there are no calculus definitions. Some
  terms are still correct but no longer used in lessons (current density, Newton's law of cooling, Lorentz
  transformation, Fermat's principle, mean lifetime). They were left in.

## Unresolved / notes
- Older figures outside the new material (25 heating curve, 36 RC, 31 sphere field, 42 ray diagram) have small
  label crowding near the axis titles, which comes from the renderer placing labels automatically. They are
  readable, so I left them unchanged.
- The lesson 40 sin² figure label says "green line", so it relies on color. The dark theme also uses a green for
  that series.

# Gap lessons (2026-10-17)

Closes the VERIFY.md coverage gaps (core: blackbody/Compton practice; common: elasticity, vision and optical instruments, atomic physics beyond Bohr).

## New lessons
| File | Id | Title | Module | Qs | Drills |
|---|---|---|---|---|---|
| lessons/19-elasticity.md | phys-elasticity | Elasticity | phys-m5 | 12 | phys-stretch-wire, phys-shear-pad, phys-bulk-compression |
| lessons/44-optical-instruments.md | phys-optical-instruments | The eye and optical instruments | phys-m11 | 12 | phys-magnifier, phys-microscope, phys-telescope |
| lessons/48-atomic-physics.md | phys-atomic | Atoms with many electrons, X-rays, and lasers | phys-m12 | 12 | phys-atomic-states, phys-xray-tube, phys-moseley |

Each: 1,550–1,780 words, 4–5 worked examples, figures (stress–strain curve, shear block; magnifier and telescope ray diagrams; X-ray spectrum, three-level laser), Common mistakes, Key points.

Lesson files renumbered (ids unchanged): old 19–42 → 20–43, old 43–45 → 45–47, old 46 → 49. So "lesson 45" (quantum) is now lessons/47-quantum.md.

## New questions (41; answer positions 10/10/10/11)
- phys-elasticity: phys-q-el01 – el12 (module quiz: el01, el04, el08, el11)
- phys-optical-instruments: phys-q-oi01 – oi12 (module quiz: oi01, oi02, oi06, oi07)
- phys-atomic: phys-q-at01 – at12 (module quiz: at01, at03, at06, at08, at10)
- phys-quantum (blackbody/Compton, Task B): phys-q-4512 – 4516 (module quiz: 4512, 4514)
Inserted after each lesson's existing block so module quizzes stay in lesson order.

## New drills (11)
phys-stretch-wire, phys-shear-pad, phys-bulk-compression (drills/m05.yaml); phys-magnifier, phys-microscope, phys-telescope (m11); phys-wien, phys-compton, phys-atomic-states, phys-xray-tube, phys-moseley (m12).

## Other edits
- Cross-references: L18 equilibrium points to elasticity; L23 sound links the bulk modulus to the elasticity lesson; L43 "Optical instruments, briefly" retitled "Lens power and lens systems" and points to the new lesson; L45 wave optics notes telescopes from the previous lesson; L47 quantum points to the atomic lesson (one phrase trimmed elsewhere to keep it at about 1,800 words).
- L47 quantum links 4 drills (phys-photoelectric, phys-compton, phys-bohr, phys-de-broglie); phys-photon-energy and phys-wien remain in the course, unlisted.
- glossary.yaml: +45 terms (elasticity, vision/instruments, quantum numbers, X-rays, lasers). cards.yaml: +24 cards appended at the end (card ids are positional), including Wien and Compton cards.
- References: mechanics.md Elasticity table; constants.md elastic moduli table; em-modern.md rows for vision, angular magnification, microscope/telescope, quantum numbers, X-rays.

## Verification
- Every new question solved in Python (/tmp/claude-0/gaps/physics/solve.py) before fixing keys; each named distractor value recomputed.
- Drills: /tmp/claude-0/gaps/physics/verify.mts, 1000 instances each, answers recomputed independently from the prompt text: 0 mismatches; shown answers, bold solution values and 3-s.f. answers all accepted.
- New figures rendered and screenshotted (figs.mts, shot.mjs).
- Build: 49 lessons, 558 questions, 144 drills, 274 cards, 407 terms. check-course: OK.

## Notes for a reviewer
- Moduli are typical textbook values (steel Y 2.0e11, copper 1.1e11, aluminum 7.0e10, bone 1.5e10; water B 2.2e9); structural-steel elastic limit 2.5e8 Pa is approximate.
- Kα estimate uses 10.2 eV (Z − 1)² (Moseley); copper gives 0.155 nm vs measured 0.154 nm, molybdenum 17.1 keV vs 17.5 keV (stated in q-at08).
- L47 quantum lists 4 drills (trimmed from 6 in review); cards now 274 (guideline 120–250).
- Global answer positions are 141/135/144/138 (the new questions are balanced; the older imbalance was left alone).

## Review (2026-10-17)
- All 41 new keys re-solved independently: correct. Drills: 1500 instances each recomputed from the prompt; no mismatches.
- Fixed: L19 Example 1 strain shown as 6.2e-4 but used as 6.24e-4 (now 6.24e-4); L19 Example 4 used $\Delta P = \rho gh$ before the fluid-statics lesson (now stated with a pointer). L47 drills trimmed to 4.
