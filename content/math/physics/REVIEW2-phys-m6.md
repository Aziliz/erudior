# Round 2 review: phys-m6 (Oscillations, waves, and sound)

Reviewer, working independently of the writer. Scope: honors lessons 23h1, 23h2 and 23h3; round 2 additions to lessons 21, 22 and 23; `questions/r2-phys-m6.yaml` (55); `drills/r2-phys-m6.yaml` (9); `glossary-r2-phys-m6.yaml` (20); `cards-r2-phys-m6.yaml` (30); `images/phys-m6-*` (11 SVGs).

Result: answer-key errors 0, factual fixes 3, picture fixes 1 (pendulum SVG and its label markers), other fixes 8 (7 plot layout fixes, 1 stray space).

## Changes

### Pictures
- **images/phys-m6-pendulum.svg and -blank.svg (used by L21 and phys-m6-r2-q04).** The dashed arc labeled "s = Lθ (arc length)" was drawn at a radius of 230 px while the string (L) is 300 px. It ended on the string partway up, not at the bob, so the labeled arc was not Lθ, and it didn't match the lesson's alt text ("the arc from the bottom to the bob"). I redrew it on the bob's path (radius L, from the equilibrium point to the bob), colored it purple (#5b3f8c) so it reads separately from the green mg sin θ arrow, and moved its label up slightly. **q04 markers:** "Arc length from equilibrium" moved from (41.1, 51.2) to (36.4, 64.2), and "Restoring part of the weight" moved from (46.7, 63.9) to (45.0, 66.6), so the two markers sit on separate parts. I re-rendered both versions and checked them.

### Plots (rendered with scripts/preview-plots.mjs; every function rechecked in Python)
- **L22, beats plot:** the x-axis title "time t (s)" sat on the curve. I set the x range to [0, 2.5] with `to: 2` on the curves, so the title sits in empty space.
- **H1, decay plot:** same problem with the axis title. x range is now [0, 12.5] with the curves ending at 10.
- **H1, damping-regimes plot:** the three curve labels piled on top of each other at the right end, on the axis title. I removed them and named the curves in the caption by shape (the underdamped curve swings below zero, critical is solid, overdamped is dashed). Curves end at 6 inside an x range of [0, 7.5].
- **H1, resonance curves:** the three "Q =" labels piled up at the right end, on the axis title. I replaced them with free labels "Q = 10" above the tallest peak and "Q = 2" under the lowest hump, and the caption names all three by peak height. The x-axis title is now "ω / ω0" (the caption says "driving frequency"), with x range [0, 2.4] and the curves ending at 2.
- **H2, square-wave synthesis:** the "1 term" and "5 terms" labels overlapped each other and the axis title. I removed them and described dashed and solid in the caption. The x-axis title is now "t / T", with x range [0, 2.3] and the curves ending at 2.
- **H2, square-wave spectrum:** the axis title overlapped the n = 9 bar. It now reads "harmonic n", with x range [0, 11.5].
- **H2, coinciding-harmonics plot:** the axis title sat on the 1320 Hz lines. It now reads "f (Hz)", with x range [0, 1600].
- **H3, R against impedance ratio:** the point label "matched: no echo" sat on the curve. The point now has no label; a free label "no echo" sits at (1.45, 0.2) in the gap between the two branches, and the caption explains it.

### Facts and wording
- **H2, "Consonance and beats between harmonics":** the lesson called Helmholtz's beating-harmonics theory "still the leading account". That is contested. Experiments by McDermott, Lehr and Oxenham (Current Biology 20, 2010) found that harmonicity predicts listeners' preferences better than roughness or beating does. I reworded it as one of the main accounts, not settled, and named the harmonicity alternative. I also moved the caveat after the explanation so the mechanism reads first.
- **H3, Doppler section:** "the 'whoosh' of blood flow is a 1 to 3 kHz Doppler tone" was too specific. Clinical Doppler shifts commonly run from a few hundred Hz to several kHz, depending on probe frequency, velocity and angle. Example 4 in the same lesson gives 1.6 to 3.2 kHz. It now says "typically somewhere between a few hundred hertz and a few kilohertz".
- **H1, three regimes:** "Guitar strings, pendulums and tuning forks are strongly underdamped" could be read as "strongly damped". It now says they are underdamped and very lightly damped (far below critical).

### Other
- **L21:** removed a stray leading space before "For small angles" after the pendulum picture. It didn't render visibly but was left over from the insertion.

## Checked and found right (things a reader might doubt)
- **Every question, worked before reading the key:** q01–q15 and h01–h40. No key errors. Order questions (q02, q10, q15, h10, h25, h34) each have a single valid order. h10 recomputed: 20, 5.12, 4.61, 1.33, 0.33. Select-all keys are correct, and so is every match pairing. In q13 the equal-velocity case cancels whichever one is in front.
- **H1 numbers:** the overdamped plot function solves the ODE with x(0) = 1 and x′(0) = 0 (roots −0.5359 and −7.4641, so γ = 4 and ω0 = 2), and so do the underdamped and critical ones. Example 3 gives 125 mm, 25.9 mm and 1.67 mm. The amplitude peak at ω0√(1 − 1/2Q²) is under 3% from ω0 for Q > 3 (2.8% at Q = 3). Example 2's Q ≈ 160 is consistent with the 2π/fraction rule (the exact log-decrement value is 156).
- **H2 numbers:** (3/2)¹² / 2⁷ = 1.0136, so the Pythagorean comma is about 1.4%. Pure fifth 701.96 cents, pure major third 386.31 cents (13.7 cents below 400). C4 = 261.63 Hz. The tempered-fifth beat is 0.745 Hz. The note table is right: 293.3 Hz and 275 Hz.
- **H3 numbers:** the Z table products are right: 412; 1.48, 1.38, 1.63 and 1.69 ×10⁶; bone 7.75 ×10⁶, shown as 7.8. R values: 0.0102, 0.414, 0.999 and 0.0023. Echo depth 5.0 cm; absorption 25 dB, a factor of 316. Doppler 3.25 kHz and 1.62 kHz; f(v+u)/(v−u) is the right full form for a reflector. The tissue values match standard tables (Hendee & Ritenour, *Medical Imaging Physics*; Bushberg et al., *The Essential Physics of Medical Imaging*). The 0.5 dB/(cm·MHz) figure is the usual soft-tissue rule of thumb and is labeled as one.
- **Dates and attributions:** Fourier, *Théorie analytique de la chaleur*, 1822. Helmholtz, *Die Lehre von den Tonempfindungen*, 1863. The Millennium Bridge opened 10 June 2000, closed two days later and reopened in February 2002 (Dallard et al., *The Structural Engineer* 79, 2001). Tacoma Narrows collapsed on 7 November 1940; the flutter explanation follows Billah & Scanlan, *Am. J. Phys.* 59 (1991). The Taipei 101 damper is about 660 tonnes. The quartz watch crystal runs at 32 768 Hz.
- **Core pictures** (spring cycle, wave anatomy, transverse/longitudinal, pipe modes, Doppler wavefronts, ultrasound layers): content is right and nothing is cut off. The Doppler circles have centers offset by half their radius, which is correct for v_s = v/2. The C/R labels line up with the dense and sparse regions. The pipe modes show the right nodes and antinodes. The pendulum force parallelogram has correct lengths (76, 163 and 180 for θ = 25°). Label markers for q06, q11 and h33 are on the parts named.
- **Mermaid diagrams (L21 period chart, L23 Doppler signs, H3 pulse-echo):** previewed. Content is right, and the accTitle/accDescr lines describe the whole of each diagram.
- **Drills:** generated 400 instances of each of the 9 drills with the app's own generator. I recomputed every answer in Python from the prompt text alone (0 mismatches) and typed answers rounded as each prompt asks (all accepted). Answers wrong by about 1.37 + 60% are rejected (check-course). Note: the cents (±0.6) and harmonic-beats (±0.06) tolerances accept the neighbouring rounding when the true value is within 0.1 of a half-step. That is lenient but not wrong, so I left it.
- **Glossary:** the 20 terms and aliases don't duplicate any other physics glossary file. The definitions are correct.
- **Cards:** all 30 are correct.
- **Overlap:** no other physics round 2 lesson covers damping, Fourier analysis, musical scales or ultrasound. 41h2 (AC power) mentions electrical resonance only in passing. H3's reference to the wave optics lesson's anti-reflection coating matches lesson 45 (Example 5).

## Left uncertain
- The L21 core text (round 1) says car shock absorbers are tuned to critical damping. H1 correctly says suspensions are usually somewhat below critical. This is out of round 2 scope and I didn't change it; it's worth a one-word fix ("near critical damping") in a later round.
- The glossary uses "rayl" as an alias of acoustic impedance. It is the unit, not the quantity, but the pop-up definition explains the unit, so I left it.

`content/math/check-module.sh physics phys-m6`: build and checker OK, 0 problems.
