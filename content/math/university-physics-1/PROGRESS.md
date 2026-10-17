# University Physics I (science-uphys1)

Split on 2026-10-16 from the original Physics draft (lessons 01–28: mechanics, waves, fluids, thermodynamics; calculus-based). Reviewed in three parts, including the errors already found in the algebra-based twin course.

## Review (2026-10-16)

# University Physics I review: phys-m1 to phys-m3 (lessons 01-10, questions, drills, cards)

## Method
- Questions (108): solved every numeric stem in Python (solve.py) before comparing with keys; all 108 keys correct. Checked distractor values numerically.
- Lessons 01-10: recomputed every worked example; rendered all lesson figures and drill figures (figs.mts, shot.mjs, part*.png).
- Drills (30): drills.mts, 400 instances each, answers recomputed from the prompt text as shown; shown answer, bold solution values and my rounded answers (at the prompt's precision) all accepted. Only remaining flag is a harness artifact (vec-components "wrong" probe 1.05x+0.5 lands within 1% when a component is near -10).
- cards.yaml: all 149 checked; no errors found.

## Fixes
### Lessons
- All ten "With calculus" headings renamed to topic headings (e.g. "Velocity and acceleration as derivatives", "Drag and terminal velocity", "The momentum form of the second law"); L10 key point "With calculus:" reworded; L06 "Relative motion in calculus form" reworded; L02 "University physics uses two ways..." reworded.
- L03: "Newton's laws, two lessons from now" (it is four lessons later) -> "in the next module".
- L04: terminal-velocity forward reference now points to the friction lesson.
- L06 Example 1: claimed the boat is "mainly turning, not speeding up"; its speed goes 4.0 -> 6.4 m/s. Now says it turns 39 deg as well as speeding up.
- L06: "see the relativity lesson" (not in this course) -> University Physics II. L02: magnetic force marked as University Physics II.

### Questions
- q-0101: explanation named wrong mistakes (1.2 = km/min; 2.0 explained).
- q-0109: distractor 250 000 L matched no mistake -> 2 500 000 L; all distractors explained.
- q-0111: choice had non-TeX "m^(3/2)/s".
- q-0201: positional reference ("the second choice").
- q-0207: distractor -4 unreachable -> 4; distractors explained.
- q-0307: explanation mislabeled units ("5 m/s²" is a velocity, "3 m" ...); 8 m/s² explained.
- q-0310: two choices meant the same thing (v = 0 and a = 0 twice).
- q-1003: distractor 39 m/s matched no mistake -> 40 m/s (dividing by mu).
- Distractor mistakes added to 0308, 0404, 0506, 0607, 0702, 0704, 0707, 0709, 0710, 0804, 0810, 0811, 0901, 0903, 0904, 1005, 1009.

### Drills
- Every prompt now states rounding (3 s.f., nearest 0.1 deg, exact); bold solution values switched from num1/num2/int to sig3 (many were rejected, e.g. vertical-loop int, flat-curve 2 dp, stopping 1 dp).
- convert-speed: prompt said 3 s.f. but answer used sig4 with 0.5% tolerance -> sigfigs: 3.
- convert-area: prompt says the conversion is exact; m² listed first as displayed unit.
- proj-horizontal: fall time shown as 2 dp, so "v(t) = x" didn't multiply out -> t shown to 3 s.f.
- calc-velocity / vector-kinematics (calculus drills kept): prompts state exact / 3 s.f.; speed bold now sig3.
- Single-answer prompts say "Give the answer" (elevator, hanging-sign, flat-curve).
- thrown-up and proj-horizontal figures: curve labels overlapped the x-axis title; removed.

## Build / check
- build.py university-physics-1: OK. check-course: OK, 0 problems.

## Unresolved
- None in scope.

# University Physics I review: phys-m4, phys-m5 (lessons 11-19, questions m4/m5, drills m4/m5)

Method: solved all 93 questions in my head/Python from stems and choices before reading keys (93/93 keys match);
re-did every worked example; rendered all 5 lesson figures and 3 drill figures (3 instances each) and screenshotted
in Chromium; dr.mts generates 600 instances of each of the 24 drills, parses the values from the prompt as shown,
recomputes the answers independently, and checks shown answer, my 3 s.f. answer and bold solution values are accepted
and a wrong answer is rejected. Build and checker: OK, 0 problems.

## Lessons
- Calculus framing: "With calculus" headings retitled so calculus reads as the main treatment:
  L11 "Work as an integral", L12 "Force from potential energy", L13 "Time-varying forces and continuous objects",
  L14 "Going further: the center-of-mass frame" (content was not calculus), L15 "Derivatives and integrals in rotation",
  L16 "Torque as a vector", L17 "Angular momentum as a vector", L18 "Distributed loads and stability",
  L19 "Potential energy from the force law".
- L12 Example 4 (known error from algebra twin): "17.6/0.80 = 22.1 kW" -> 17.64/0.80 = 22.05 ≈ 22 kW.
- L18 beam figure: force labels sat on top of the arrows; moved to free labels beside them.
- No references to lessons outside this course found in 11-19. All other arithmetic, constants and figures check out.

## Questions
- Distractors with no real mistake behind them replaced (same as twin fixes): q-1207 (2000 N, 50 N -> 0.50 N, 2.0 N),
  q-1210 (8.2 m -> 0.82 m), q-1309 (225 N -> 1350 N), q-1407 (35 m/s -> 15.7 m/s; 500 m/s -> 2470 m/s, h left in cm),
  q-1702 (5.6 m/s -> 5.3 m/s, sphere's c), q-1303 (0.2 -> 0.20).
- q-1902: explanation named the wrong mistake for 4.9 m/s² (now 1/r instead of 1/r²; 1.1 explained).
- q-1610: stem asked for "torque or angular velocity vector" of a spinning wheel (torque isn't determined by spin) -> angular velocity.
- q-1402 and q-1706 referred to "the previous collision"/"the skater above" (quizzes reorder); made self-contained.
- q-1211: explanation now says dU/dx = 0 points are equilibria, not turning points (that distractor was unexplained).
- Distractor-mistake notes added to ~30 explanations (1101, 1104, 1109, 1201, 1203, 1204, 1206, 1209, 1303, 1308,
  1401, 1402, 1502, 1503, 1505, 1603, 1604, 1606, 1607, 1609, 1709, 1710, 1801, 1803, 1905, 1909, ...).

## Drills (24)
- Every prompt now states units and rounding (3 s.f.; CM 2 decimals).
- Bold final answers were num1/num2/num4/int (e.g. rot-ke "1 J" for 0.96 J), now sig3 to match the prompt;
  inelastic KE loss int -> sig3.
- phys-power: `\dfrac{mgh}{t}` had {t} substituted -> `{\,t}`.
- phys-ballistic: solution showed m = 0.02 for a 16 g bullet -> {m:dp3}.
- phys-grav-force / phys-pulley-disk: intermediate "m(g)" and "½M(a)" used 2-dp values that didn't multiply to the
  bold answer -> sig3. phys-angmom-skater I2 shown to 2 dp -> dp3 (exact).
- phys-elastic-1d: check line "v2f - (v1f) = v" with 2-dp values could be off by 0.01 -> algebraic check.
- 0 answer mismatches in 14,400 instances. Remaining harness flags are only exact .5 ties at 3 s.f. (both roundings
  accepted) and the exact integer friction work in phys-work-angle.

## Unresolved
- None. Cosmetic: in phys-torque the force label can touch the arrow at angles near 90-110°.

# University Physics I review: phys-m6, phys-m7 (lessons 20–28), glossary, references

## Method
- Questions (all 64 in m06/m07): solved from stem and choices before reading keys (solve.py), then compared: 64/64 match. Read every explanation.
- Lessons 20–28: re-did every worked example and derivation. Rendered all 6 figures (figs.mts and shot.py, screenshots in figs/).
- Drills (all 28 in m06/m07): verify.mts generates 1000 instances each and recomputes answers from the prompt text as shown. The shown answer and a 3 s.f. answer (4 s.f. or 1 dp where the prompt asks) must both be accepted: 0 mismatches, 0 rejections. bold.mts checks that every bold solution value is accepted: all are.

## Fixes
### Questions
- q-2701: explanation used Markdown italics (*on*). Now plain text.
- q-2505: set to module_quiz, so the m7 quiz covers "Temperature and expansion" (it was missing).
- q-2006: explanation called the 20 m/s distractor "20 m/s²". It now explains that 20 is just ω (numerically the same as A·ω²).

### Lessons
- 20: the x(t) label overlapped the "one period" point label; moved it to (1.0, 1.33).
- 21: said electromagnetic waves "come later in the course". They are in University Physics II now. Also removed the "n = 3" curve label, which overlapped the x-axis title.
- 25: "the same exponential approach seen in drag and RC circuits". RC circuits are not in this course, so it now says "seen with linear drag" (lesson 08).
- 26: Maxwell–Boltzmann plot. The y tick labels were clipped ("002", "0018"), and the curve label overlapped the axis title. The axis is now in units of 10⁻³ s/m (0–2.3), and the label is placed beside the curve.
- 27: the "isochoric (vertical)" label sat across the vertical line. It is now "isochoric", placed left of the line.
- 28: corrected "entropy measures ... the number of microscopic arrangements". It now says entropy grows with that number (S = k_B ln Ω).
- Calculus pairing: renamed the nine "With calculus" headings to topic headings (The equation of motion; The wave function and the wave equation; Displacement and pressure waves; Pressure as a differential equation; Bernoulli from Newton's second law; Varying specific heat and Newton's law of cooling; The Maxwell–Boltzmann distribution; Work as an integral; Entropy changes as integrals). In lesson 24, "Calculus also handles a draining tank" was reworded.

### Drills
- All 28 prompts now state units and rounding (3 s.f.; Doppler 4 s.f.; dB, final temperature and beat tone 1 dp). Fixes ported from the reviewed algebra draft and re-verified here.
- Bold solution values were num1/num2/int and disagreed with the requested precision; some were rejected when typed (e.g. hydraulic distance 0.45 shown as "0.5"; dL shown with 2 s.f.). They are now sig3.
- phys-pressure-depth: the value `atm` clashed with \text{atm}, which was a checker error; renamed it to natm. The bold answers are now the Pa values.
- phys-bernoulli: the answer was in Pa with 0.5% tolerance, which could reject a correct 3 s.f. answer. It is now in kPa with 1% tolerance.
- phys-beats: the tone was shown as x.5 but the prompt didn't ask for 1 dp; the prompt now does.
- phys-engine-efficiency: retitled. It had no Carnot part.
- phys-isothermal-work, phys-entropy-melt: kept their calculus solutions (∫P dV, ∫mc dT/T) and added rounding.

### References / glossary
- constants.md: removed e, k, ε₀, μ₀, h, hc, the particle-mass table, copper resistivity and refractive indices. Added the atomic mass unit as a constant.
- units.md: removed the coulomb, volt, ohm, farad, tesla, weber and henry rows and the eV row, and removed MeV from the u row.
- waves-thermo.md: labeled the entropy row's mc ln(T₂/T₁) as "heating at constant c".
- glossary.yaml: removed a stray "# ---- m8 Electrostatics" trailer. No entries fall under E&M, optics or modern physics topics. Every bolded term in lessons 20–28 has an entry.

## Build / check
- build.py university-physics-1: OK. check-course: OK, 0 problems (the 3 earlier problems, q-2701 and phys-pressure-depth, are fixed).

## Unresolved / notes
- The glossary still mentions electrostatic force and Coulomb's law in passing, as examples under "conservative force" and "inverse-square law". Both are correct, so they were left.
- Lesson 28 Example 3 quotes entropies to 0.1 J/K using T = 273 K. This is consistent but more precise than the data justifies; not changed.

## Source verification (2026-10-17)

Checked against OpenStax University Physics Vol 1-2 (LibreTexts), NIST CODATA 2022, MIT OCW 8.01SC, HyperPhysics, ETSU and UF Physics I syllabi. Fixes: steel-on-ice mu_k 0.03 -> 0.02 (L08); STP convention (1 atm, 22.4 L) now stated with the IUPAC 1 bar / 22.7 L note (L26, glossary); Carnot "maximum possible" qualified as "between the same two reservoirs" (glossary, card). Coverage additions: rocket equation (L13), stress/strain/Young's modulus (L18, 3 glossary terms), wave power on a string (L21). All ~115 re-solved questions and 16 drills checked agreed with sources; no key changes.
