# Round 2 notes: phys-m6 (Oscillations, waves, and sound)

## Honors lessons (2)
| File | id | Title | Words | Examples |
|---|---|---|---|---|
| lessons/23h1-fourier-analysis.md | phys-m6-h-fourier | Fourier analysis: harmonics and spectra | ~1,890 | square-wave series; plucked string at L/4 |
| lessons/23h2-normal-modes.md | phys-m6-h-normal-modes | Coupled oscillators and normal modes | ~2,050 | two masses/three springs; coupled pendulums (energy transfer); two beads on a string |

- Fourier: Fourier's theorem, coefficients by orthogonality, symmetry shortcuts, square-wave series with partial-sum plot and Gibbs overshoot, spectrum (bar plot), Parseval (81% of square-wave power in the fundamental), sawtooth, plucked-string amplitudes $B_n \propto \sin(n\pi d/L)/n^2$ (missing harmonics), pulse bandwidth $\Delta f \sim 1/\Delta t$ (labeled order of magnitude).
- Normal modes: normal coordinates, in/out-of-phase modes, beats as energy transfer ($\pi/\Delta\omega$), determinant/eigenvalue method (Mermaid procedure), CO₂ modes, beaded string $\omega_n = 2\sqrt{F/ma}\sin\frac{n\pi}{2(N+1)}$ (quoted, not derived) and its continuum limit $f_n = nv/2L$, dispersion.
- Two honors lessons, not three: the remaining candidates (dispersion/group velocity, reflection and impedance) overlap what these two touch; worth a third later if wanted.

## Core lesson additions (additions only)
- 20 SHM: pendulum force diagram (SVG) with a sentence on the components; Mermaid "finding ω of a new oscillator" procedure.
- 21 Damped/driven: Mermaid damping-regime decision chart; driven-damped lab setup (SVG) with an intro sentence.
- 22 Waves: Mermaid classification of waves; labeled transverse/longitudinal wave-parts picture (SVG).
- 23 Sound: open/closed pipe displacement standing waves, incl. closed-pipe 3rd harmonic (SVG); Mermaid Doppler sign chooser.

## Pictures (images/)
phys-m6-pendulum(.svg, -blank.svg), phys-m6-driven-setup(.svg, -blank.svg), phys-m6-wave-parts(.svg, -blank.svg), phys-m6-pipes.svg, phys-m6-coupled-modes.svg. All original, 3–13 KB, previewed (blanks with markers).
Plots added in honors lessons: square-wave partial sums, square-wave spectrum (bars), two beat plots (x₁, x₂).

## Questions: questions/r2-phys-m6.yaml (48)
- Core (phys-m6-r2-q01–q20, 5 per lesson): 3 label, 4 text, 4 order, 4 match, 5 select-all. Module quiz (2 per lesson): q01, q03, q06, q10, q11, q14, q16, q20.
- Honors (h01–h14 Fourier, h15–h28 normal modes): 16 MC (correct index 4/4/4/4), 4 select-all, 4 text, 2 order, 2 match.

## Drills: drills/r2-phys-m6.yaml (4)
phys-m6-r2-square-harmonics, phys-m6-r2-plucked-string (Fourier lesson); phys-m6-r2-two-mass-modes, phys-m6-r2-coupled-pendulums (normal modes). Transfer-time answers use 2% tolerance; inputs restricted (k′/k in 0.1–0.5; pendulum transfer 4–40 s) so a learner working from 4-s.f. ω values stays within it (checked over every input: worst 0.8% and 1.1%).

## Glossary (glossary-r2-phys-m6.yaml, 13): Fourier analysis, Fourier's theorem, Fourier series, Fourier coefficients, orthogonal, Gibbs phenomenon, spectrum, Parseval's theorem, coupled oscillators, coupling spring, normal mode, normal coordinates, dispersion. No duplicates across glossary*.yaml.

## Cards (cards-r2-phys-m6.yaml, 18): 10 Fourier analysis, 8 Normal modes.

## Checks
- check-module.sh university-physics-1 phys-m6: build OK, checker OK (0 problems).
- All numbers recomputed in Python/sympy: square and sawtooth coefficients, Gibbs peak 1.179A (8.95% of jump), Parseval 81%/93%, plucked-string ratios (0.354, 0.111, 0; L/3 → 0.25), mode frequencies (20.0/24.5 rad/s; 3.500/3.674 rad/s, 18.0 s; 49.7 s), beaded-string limit, driven amplitudes for q10 (0.125, 0.0955, 0.0330, 0.0194, 0.0031 m).

## For a reviewer
- Possible overlap with the phys-h1 honors module (analytical mechanics) if it covers small oscillations/normal modes via Lagrangians; this lesson uses Newton's laws only.
- Labeled simplifications: piecewise-smooth condition for Fourier series; ear insensitivity to phase ("approximation"); clarinet odd harmonics (lower register only); Δf ~ 1/Δt (order of magnitude); beaded-string formula quoted.
- Pendulum label question has 5 markers; the mg cos θ arrow is drawn but not marked.

## Errors found in existing content
None.

## Sources
Standard results checked against OpenStax University Physics Vol. 1 (ch. 15–17) and standard texts (French, *Vibrations and Waves*; Taylor, *Classical Mechanics*, ch. 11) from knowledge; history: Fourier's 1807 memoir and 1822 *Théorie analytique de la chaleur*; Cooley & Tukey (1965) FFT; CO₂ IR activity (asymmetric stretch and bend active, symmetric stretch inactive).
