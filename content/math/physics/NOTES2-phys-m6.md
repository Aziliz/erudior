# Round 2 notes: phys-m6 (Oscillations, waves, and sound)

## Honors lessons (3)
| File | Id | Title | Words | Qs | Drills | Cards |
|---|---|---|---|---|---|---|
| lessons/23h1-damped-driven-oscillators.md | phys-m6-h-damped-driven | Damped and driven oscillators | ~2,000 | 14 (h01–h14) | damped-decay, driven-amplitude, critical-damping | 11 |
| lessons/23h2-harmonics-music.md | phys-m6-h-harmonics-music | Harmonics, timbre, and musical scales | ~1,600 | 13 (h15–h27) | equal-temperament, cents, harmonic-beats | 10 |
| lessons/23h3-impedance-ultrasound.md | phys-m6-h-impedance-ultrasound | Wave reflection, impedance, and ultrasound imaging | ~1,570 | 13 (h28–h40) | reflection, echo-depth, doppler-ultrasound | 9 |

Each has 4 worked examples, Common mistakes and Key points, and is algebra-based (results that need calculus, such as the damped and driven solutions, are stated and labeled as such).
- H1: linear damping model, exponential decay, under/critical/over damping, Q (three rules of thumb), driven steady state and resonance curves, phase, width ω0/Q, tuned mass dampers; Millennium Bridge and Tacoma Narrows told with the usual simplifications labeled.
- H2: Fourier's theorem, square/sawtooth spectra, timbre, missing fundamental, pluck position, consonance via coinciding harmonics (Helmholtz, labeled as the leading account, not the whole story), Pythagorean comma, equal temperament, cents.
- H3: string and acoustic impedance, R = ((Z2−Z1)/(Z2+Z1))², inversion on reflection (ties to fixed/free ends), tissue impedance table, coupling gel, matching layers, pulse-echo depth, frequency trade-off, Doppler ultrasound (double shift).

## Core lesson additions (additions only)
- L21 SHM: spring-cycle SVG (three snapshots), pendulum-forces SVG, Mermaid "Finding the period of an oscillator".
- L22 Waves: transverse vs longitudinal SVG, wave-anatomy SVG, beats plot (8 Hz + 9 Hz with envelope).
- L23 Sound: pipe-modes SVG (open–open n = 1, 2; closed–open n = 1, 3), Doppler wavefront SVG, Mermaid "Choosing the signs in the Doppler formula".

## Questions: questions/r2-phys-m6.yaml (55)
- Core q01–q15 (5 per lesson): text 4, order 4, match 3, select-all 3, label 3 (pendulum forces, wave anatomy, pipe modes); module_quiz: q03, q05, q06, q09, q11, q13.
- Honors h01–h40: 23 multiple choice (answer positions 6/6/5/6), 3 select-all, 6 text, 3 match, 3 order, 1 label (ultrasound layers).

## Pictures and diagrams (images/)
phys-m6-spring-cycle, phys-m6-pendulum (+ -blank), phys-m6-wave-anatomy (+ -blank), phys-m6-transverse-longitudinal, phys-m6-pipe-modes (+ -blank), phys-m6-doppler-wavefronts, phys-m6-ultrasound-layers (+ -blank). All original, under 25 KB, previewed (label markers checked on the blanks). 2 Mermaid diagrams in core lessons, 1 in H3. Plots in honors: damped decay, damping regimes, resonance curves (H1); square-wave synthesis, square-wave spectrum, coinciding harmonics of a fifth (H2); R vs impedance ratio (H3).

## Drills: drills/r2-phys-m6.yaml (9)
phys-m6-r2-damped-decay, -driven-amplitude, -critical-damping, -equal-temperament, -cents, -harmonic-beats, -reflection, -echo-depth, -doppler-ultrasound. Verified with a script: 500 instances each, answers recomputed independently from the prompt text, and answers rounded as the prompt asks were all accepted (0 failures).

## Glossary and cards
- glossary-r2-phys-m6.yaml: 20 terms (damping constant, underdamped, critically damped, overdamped, quality factor, driving frequency, steady state, tuned mass damper, Fourier's theorem, Fourier analysis, spectrum, timbre, musical interval, equal temperament, semitone, cent, wave impedance, acoustic impedance, transducer, matching layer). Checked against every glossary file for duplicate terms and aliases: none.
- cards-r2-phys-m6.yaml: 30 cards.

## For a reviewer to double-check
- Tissue impedances are typical textbook values (fat 1.38, soft tissue 1.63, muscle 1.69, bone 7.8 ×10⁶ rayl; bone varies widely); the attenuation rule of 0.5 dB/(cm·MHz) is labeled as a rule of thumb.
- Q values (car suspension under 1, tuning fork in the thousands, quartz tens of thousands or more) are given as rough orders of magnitude; Taipei 101 damper "roughly 660 tonnes".
- Tacoma Narrows is described as aeroelastic flutter, not simple resonance; Millennium Bridge as synchronous lateral excitation (opened June 2000, reopened 2002).
- Clarinet "odd harmonics" and the pluck-point rule are labeled as simplifications.
- L21's existing sentence that car shock absorbers are tuned to critical damping is a simplification; H1 says suspensions are usually somewhat below critical. I didn't change the core text.

## Errors found in existing content
None.

## Sources
Standard results (checked numerically in Python): damped and driven harmonic oscillator, Q, Fourier series of the square wave, equal temperament and cents, normal-incidence reflection R = ((Z2−Z1)/(Z2+Z1))², pulse-echo and Doppler ultrasound. Histories: Fourier, Théorie analytique de la chaleur (1822); Helmholtz, On the Sensations of Tone (1863); Millennium Bridge (2000, reopened 2002); Tacoma Narrows (November 1940).

## Checks
`content/math/check-module.sh physics phys-m6`: build and checker OK, 0 problems (6 lessons, 88 questions, 18 drills).
