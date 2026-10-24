# Round 2 review: phys-m6 (Oscillations, waves, and sound)

Reviewer for assignment 139. Scope: honors lessons 23h1-fourier-analysis.md and 23h2-normal-modes.md, the round 2 additions to lessons 20–23, questions/r2-phys-m6.yaml (48), drills/r2-phys-m6.yaml (4), glossary-r2-phys-m6.yaml (13), cards-r2-phys-m6.yaml (18), images/phys-m6-* (8 files).

`content/math/check-module.sh university-physics-1 phys-m6` after fixes: build OK, checker OK (0 problems).

## Changes

| Where | Problem | Change |
|---|---|---|
| 23h1, square-wave partial-sum plot | The "1 term" label at (0.25, 1.45) printed over the y-axis label ("y / A1 term"); the "t / T" axis label sat on the curves at t = 2. | Moved "1 term" below the dashed trough at (0.75, −1.47); x range 0–2.2 with every function ending at `"to": 2` so the axis label is clear. Re-rendered and checked. |
| 23h2, both beat plots (x₁, x₂) | The "t (s)" axis label sat on the curves near t = 12.5. | x range 0–13 → 0–14 (curves still end at 12.6). Re-rendered and checked. |
| 23h2, alt text of phys-m6-coupled-modes.svg | Said mode 2 shows "stretching and compressing the middle spring"; the picture shows the blocks moved toward each other, compressing it. | Alt text now says the blocks move toward each other, compressing the middle spring, and stretch it half a cycle later. |
| 23h1, intro | "The waves lesson ended with a claim" that a plucked string vibrates in a mix of harmonics. That sentence is in the middle of lesson 22 (standing waves), not at its end. | "made a claim". |
| phys-m6-r2-h01 explanation | The garbled line "the last two are not multiples of 100 Hz at all, or skip the fundamental" ran two distractors together; 200, 400, 600 Hz… *are* multiples of 100 Hz. | Each distractor now has its own reason (200, 400… leaves out the fundamental and keeps only even harmonics; 50, 150… are not multiples). |

No answer keys were wrong.

## Checked and found right (a reader might doubt)

- **Every question worked independently** before looking at the key, all 48. Recomputed in Python: q10 amplitudes (0.125, 0.0955, 0.0330, 0.0195, 0.0031 m; the order is unique, and the amplitude peak at √(ω₀² − 2γ²) = 19.8 rad/s does not change it), h02 (1.27 V; distractors 1.0, 3.82, 0.424), h04 (8/π² = 0.811; 0.637; 0.405), h07 (1, 0.354, 0.111, |−0.040|, 0), h10 (0.25), h15 (10.0/12.2; 11.2 = √125, 14.1 = √200), h19 (Δω = 0.0632, π/Δω = 49.7 s, 2π/Δω = 99.4, 1/Δω = 15.8, 2π/ω₁ = 2.01 s), h27 (0.699, 1.398, 0.222, π/ω̄ = 0.141 s).
- **q19 ordering** (rock concert below the threshold of pain) matches the lesson's own values (110 dB vs ~120 dB, 1 W/m²).
- **q20**: same direction at the same speed gives no shift whichever party is ahead ((v−u)/(v−u) or (v+u)/(v+u)).
- **Plucked-string formula** B_n = 2hL²/(π²n²d(L−d))·sin(nπd/L): derived with sympy from the triangle shape for n = 1, 2, 3 (difference 0).
- **Square wave**: b_n = 2A(1 − cos nπ)/(nπ); the 200 Hz, 5.0 V numbers (6.37, 2.12, 1.27 V); Gibbs peak 1.1790A with 2000 odd terms (8.95% of the 2A jump); Parseval 81.1% / 93.3%. Sawtooth from −A to +A has c_n = 2A/(nπ).
- **Beats derivation**: x₁ = A cos(Δωt/2)cos(ω̄t), x₂ = A sin(Δωt/2)sin(ω̄t) from q₁ = q₂ = A; transfer at π/Δω. Example 2: ω₁ = 3.500, ω₂ = 3.674, t = 18.03 s, return 36.1 s, period 1.795 s.
- **Example 3 / beaded string**: F/a = 100 N/m, 100 rad/s (15.9 Hz) and 173 rad/s (27.6 Hz); ω_n = 2√(F/ma)·sin(nπ/2(N+1)) is the standard result (French, *Vibrations and Waves*, ch. 5) and reduces to 1 and √3 for N = 2; its continuum limit gives f_n = nv/2L.
- **CO₂**: 3N − 5 = 4 vibrational modes; the asymmetric stretch (~2349 cm⁻¹) and the doubly degenerate bend (~667 cm⁻¹) are IR-active and the symmetric stretch is not (standard spectroscopy; NIST Chemistry WebBook, CO₂ vibrational data).
- **History**: Fourier's 1807 memoir and *Théorie analytique de la chaleur* (1822); Cooley and Tukey, *Math. Comp.* 19 (1965). "Claimed" is the right word, since rigorous convergence came later (Dirichlet 1829).
- **Bandwidth–time**: a high-Q oscillator's power FWHM Δω = 2γ matches the lesson 21 definition, and the energy decay time is 1/(2γ) ~ 1/Δω. Δf ~ 1/Δt is labeled as an order of magnitude.
- **Labeled simplifications** are present and correct: piecewise-smooth condition, phase insensitivity of hearing ("approximation"), clarinet odd harmonics in the lower register only, Δf ~ 1/Δt, beaded-string formula quoted.
- **Pictures** were rendered and inspected: the pendulum's components are drawn to scale (mg cos θ arrow 119 px vs 138·cos θ = 120; mg sin θ 66 vs 69) and in the right directions; the pipes show displacement N/A correctly for open–open, closed–open fundamental and third harmonic; the coupled-modes springs are consistent with the displacements in both modes; the driven setup and the wave parts are correct. All label markers (q01, q06, q11) sit on the parts their labels name. The mg cos θ arrow being unmarked in q01 is fine.
- **Mermaid** (5: ω recipe, damping regimes, wave kinds, Doppler signs, normal-mode procedure) were rendered: correct, readable, and accTitle/accDescr describe the whole diagram.
- **Drills**: worked by hand and with every input. Square-harmonics: n·f is always an exact multiple of 10, so "3 s.f." is exact, and 1% relTolerance covers 3-s.f. rounding. Plucked-string: n < p keeps the ratio positive and nonzero, and the lowest missing harmonic is always p. Two-mass: across every allowed input, a learner who rounds ω to 4 s.f. is off by at most 0.87% (tolerance 2%). Coupled pendulums: across all 4,015 allowed inputs, at most 1.07% (tolerance 2%); 4-s.f. ω is within the 0.1% tolerance. Wrong answers (2π/Δω, 1/Δω) are far outside.
- **Glossary/cards**: definitions correct, and no term duplicates another glossary*.yaml in the course.

## Overlap

There is no overlap. phys-h1 (Lagrangian/Hamiltonian, Kepler, maneuvers) only mentions coupled oscillators in passing (90-lagrangian-mechanics.md line 113) and does not treat normal modes; its notes explicitly defer to 23h2. No other round 2 lesson covers Fourier analysis.

## Left uncertain

- The tick label "2" on the Fourier partial-sum plot sits under the final rising edge at t = 2. It is a cosmetic axis-tick overlap. I left it, because ending the curves earlier would cut the jump.
- The Doppler Mermaid chart shows `v_o`/`v_s` with literal underscores (plain text, readable).
