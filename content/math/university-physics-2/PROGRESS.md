# University Physics II (science-uphys2)

Split on 2026-10-16 from the original Physics draft (old lessons 29–46: electricity and magnetism, optics, modern physics; calculus-based), renumbered 01–18. Reviewed in two parts, including the errors already found in the algebra-based twin course.

## Review (2026-10-16)

# University Physics II review: phys-m8, phys-m9 (lessons 01-08, questions m8/m9, drills m8/m9, cards.yaml)

## Method
- Questions (61): every numeric stem recomputed in Python (q.py) and compared with keys: all keys correct, one correct choice each, no positional references or Markdown.
- Lessons 01-08: recomputed every worked example and derivation (ring field/potential, rod integral, nonuniform sphere, cylindrical/spherical C, sphere field energy, Kirchhoff matrix, dP/dR, RC ODE and heat integral). Rendered all 4 figures (figs.mts, shot.mjs, all.png).
- Drills (21): verify.mts, 1000 instances each, answers recomputed from prompt text as shown; shown answer, 3 s.f. answer and every bold solution value accepted. 0 mismatches.
- cards.yaml: all 101 cards checked.

## Fixes
### Drills (known errors from the algebra draft, still present here)
- Ported all m08/m09 fixes from the reviewed physics draft: every prompt states units and 3 s.f.; phys-gauss-sphere showed r rounded to 2 dp in m while the answer used the unrounded r (now exact cm); phys-rc-charging showed t to 3 s.f. but the answer used unrounded t (now exact); phys-parallel-plate showed A to 2 dp; phys-energy-cost could show 0.00 kWh (E >= 1, 1% tolerance); phys-kirchhoff "determinant" dropped.
- All bold final answers switched from num1/num2/num4/int to sig3 to match the prompts (e.g. coulomb-net 0.05 for 0.0512 N, parallel-plate charge 0.00 nC, efield-two 0.14 for 0.144 kN/C were rejected or wrong precision). Intermediate FA/FB and V1 also sig3.
- phys-efield-accel: solution showed proton mass 1.67e-27 though prompt gives 1.673e-27; now shows 1.673.
- phys-resistivity: "A aluminum wire" -> "A wire made of aluminum".
### Lessons
- All eight "With calculus" headings renamed to topic headings; L03 intro "mostly at the University Physics level ... every level" reworded; L08 now points to the derivation section; L06 key point gives I = dQ/dt.
- L02: "gravity negligible by about 10^13" -> eE/(m_e g) about 2e12 in 100 N/C; ring-axis field now shows the integral step.
- Figures: L03 and L08 curve labels overlapped axis titles (moved); L04 equipotential plot had field-line arrows drawn on top of the axes (axes/grid hidden, two missing diagonals added).
### Questions
- q-2901: explanation said forgetting the uC conversion gives 6e5 N (that gives 6e11); 6e5 comes from converting only one charge.
### Cards
- Grating maxima: "highest m <= d/lambda" -> largest whole m < d/lambda (order at 90 deg never appears).

## Build / check
- build.py university-physics-2: OK. check-course: OK, 0 problems.

## Unresolved
- None in scope. phys-resistivity can produce very large voltage drops (nichrome, 0.2 mm, 200 m: ~64 kV); correct but unrealistic.

# University Physics II review: phys-m10 to phys-m12 (lessons 09-18), glossary, references

## How I checked it
- Questions: I solved all 106 m10-m12 questions before reading the keys. All 106 keys match.
- Lessons: I redid every worked example and derivation by hand or in Python.
- Figures: I rendered all 5 lesson figures with renderFigure and screenshotted them in Chromium (fig01-05.png).
- Drills: verify.mts runs 1000 instances of each of the 32 drills. For each one it:
  - recomputes the answers from the prompt text as shown;
  - checks that the shown answer and my 3 s.f. or 4 s.f. answer are accepted;
  - checks every bolded solution value against the correct answer.
  It found 0 mismatches.
- Build and checker: OK, 0 problems.

## Lessons
- L16 (known error from the algebra twin): the muon rest-frame half-life was 1.56 μs. It is now 1.52 μs (mean life 2.20 μs × ln 2), with the numbers that follow updated: 15.2 μs, 4.54 km, 454 m, and "normal 1.52 μs".
- Calculus framing: I retitled every "With calculus" section so it reads as part of the main treatment:
  - L09: Current elements and the full Lorentz force
  - L10: Deriving the fields: the Biot–Savart law and Ampère's law (with a forward pointer added to the first formula)
  - L11: Faraday's law in integral form
  - L12: Deriving the RL, LC and rms results
  - L13: The wave equation and Fermat's principle
  - L14: The lensmaker's equation and moving images
  - L15: Intensity patterns
  - L16: The Lorentz transformation and relativistic kinetic energy
  - L17: Bohr radii and the Schrödinger equation
  - L18: The decay law as a differential equation
- L11: Faraday's law is now stated as $-N\,d\Phi_B/dt$, with $\Delta\Phi/\Delta t$ as the steady-change case. The key point was updated to match. The generator derivation differentiated "$\Phi_B = NBA\cos\omega t$"; it now differentiates the flux through all N turns, $N\Phi_B$.
- L12: the inductor emf is now $-L\,dI/dt$, used in the text, in Example 1 and in the switch-spark sentence. Added a pointer from the RL result to its derivation.
- L15: "the superposition principle from the waves lesson" referred to a lesson that is not in this course. It now points to University Physics I.
- L18: the mean-lifetime formula divided by 1 for no reason. It is now written cleanly, with the meaning of $\lambda e^{-\lambda t}dt$ explained.
- L10 figure bug: the wire-field vectorField drew only one arrow. A grid point landed at about 1e-16 from the singular origin, and its huge vector set the arrow scale for the whole field. Changing the step from 0.65 to 0.5 makes the grid hit the origin exactly (that point is NaN and skipped), and all the arrows now show.
- L14 ray diagram: the "lens" label sat on the optical axis next to F. It is now a free label at the top of the lens.
- Everything else checked out: all constants, worked examples and the other figures.

## Questions
- q-3801 (known error from the twin): the explanation said that "forgetting the 2π" gives 3.1e-4 T. That value actually comes from using the loop-center formula μ0I/(2r).
- Module quiz gaps (known from the twin): no AC circuits question and no Nuclear structure question was in the module quizzes. q-4005 and q-4605 are now module_quiz.
- Answer-position balance was 20/28/25/33. I moved the correct choice to the first position in q-4108, q-4205, q-4402, q-4601 and q-4610, which gives 25/28/25/28.
- q-3701: the distractor 8.0e-14 N matched no real mistake. It is now 1.7e-21 N (the proton's mass used in place of its charge).
- Distractor-mistake notes added to: 3701, 3704, 3706, 3803, 3901, 3904, 3906, 4002, 4010, 4101, 4201, 4208, 4310, 4503, 4607 and 4611.
- None of the explanations refer to a choice by position, and none contain Markdown.

## Drills (32)
- Ported the twin's fixes (same ids):
  - phys-faraday-emf: the area was shown as "0.03" while the answer used 0.028. It now uses {A:dp3}.
  - phys-time-dilation: speeds like 0.995 were shown rounded. It now uses {b:dp3}.
  - phys-grating: floor(d/λ) was wrong when d/λ is a whole number. It is now ceil(d/λ)−1, with an explanation.
  - phys-rl-time: the prompt showed t rounded to 3 s.f., but the answer used the unrounded t. The answer is now computed from the t shown.
  - phys-charge-in-b: the solution showed $m_p$ as 1.67e-27 while the prompt gave 1.673e-27. It now shows the prompt's value.
  - phys-rel-energy: the rest energy is now given in the particle label.
  - phys-solenoid: it asked for inductance, which lesson 10 doesn't teach (that comes in lesson 12). It now asks for turns per meter and the field.
  - All prompts now state units and rounding.
- Same proton-mass display bug in phys-de-broglie: the solution showed 1.67e-27 where the prompt gave 1.673e-27. Fixed.
- About 35 bold final answers were printed with num1/num2/num4/dp0/dp6 formats instead of the precision the prompts ask for. Examples: the motional-emf force printed to 4 decimals, the two-lens image distance to 2 decimals, and the carbon-dating age with dp0. These now use sig3, or sig4 where the prompt asks for 4 s.f. (γ, Bohr, binding energy).

## Glossary / references
- em-modern.md: $h/4\pi$ is now $h/(4\pi)$ (known from the twin).
- Glossary: no errors found, and every bolded term in lessons 09-18 has an entry.
- constants.md: all values checked; no errors.

## Unresolved
- None. Cosmetic issues I left alone:
  - The sig formats drop trailing zeros (for example "1.1 N" for 1.10 N).
  - In the L10 field plot, the outermost arrows are small and the "I out of page" label touches one arrow.
  - Lessons 13 and 17 link 4 drills each (AUTHORING says 1-3), as in the twin.
