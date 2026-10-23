# Round 2 notes: de-m8 (Systems of differential equations)

## Honors lessons (honors: true, module de-m8)
- `lessons/37h1-coupled-oscillators.md`: **Coupled oscillators and normal modes** (id `de-m8-h-coupled-oscillators`, 45 min).
  Mass–spring equations $M\mathbf{x}'' = -K\mathbf{x}$, the eigenproblem $M^{-1}K\mathbf{v} = \omega^2\mathbf{v}$, why
  the $\omega^2$ are real and positive (2×2 proof; general case stated), in-phase and out-of-phase
  modes, fitting initial conditions, modal coordinates, a two-story shear building (golden-ratio
  modes), weak coupling, beats and energy transfer time $\pi/(\omega_2 - \omega_1)$.
  Four worked examples, Common mistakes, Key points.
- `lessons/37h2-larger-systems.md`: **Larger systems and the Routh–Hurwitz test** (id `de-m8-h-larger-systems`, 45 min).
  n×n eigenvalue method, the 3×3 characteristic polynomial from trace, principal minors and
  determinant, stability iff all Re λ < 0, dominant eigenvalue, a three-tank chain (compartment
  model, solved exactly, peak time), a third-order equation's companion matrix, the Routh–Hurwitz
  criterion for degrees 2 and 3 with why positive coefficients are necessary and a sketch (labeled
  as such) of where $a_1a_2 > a_3$ comes from, three blocks exchanging heat, and the critical
  feedback strength of a three-stage negative-feedback loop (labeled a simplified linear model).
  History: Maxwell 1868 (governors), Routh 1877 (Adams Prize), Hurwitz 1895.
- I wrote 2 honors lessons, not 3. Lyapunov functions would be the natural third topic, but they
  fit the de-h1 honors module (nonlinear dynamics), so I left them to that writer.

## Core lessons (additions only)
- 33: two-tank picture `de-m8-two-tanks.svg` (with an intro sentence); Mermaid chart of the eigenvalue solution procedure.
- 34: Mermaid decision chart for real eigenvalues; picture `de-m8-real-portraits.svg` (saddle, nodal sink, nodal source, line of equilibria).
- 35: picture `de-m8-complex-portraits.svg` (spiral sink, spiral source, center, improper node); Mermaid trace–determinant decision chart.
- 36: new short section "Choosing a method" with a Mermaid chart (undetermined coefficients vs variation of parameters).
- 37: Mermaid linearization procedure; pendulum phase-plane plot with separatrices $y = \pm2|\cos(x/2)|$ and two sentences on energy conservation.

## Questions (`questions/r2-de-m8.yaml`, 51)
- Core q01–q25 (5 per lesson): 5 text, 4 order, 5 match, 5 select-all, 3 label, 3 multiple choice.
  module_quiz: 2 per lesson (q02, q04, q06, q10, q11, q15, q16, q18, q21, q24).
- Honors h01–h13 (coupled oscillators) and h14–h26 (larger systems): per lesson 1 label, 2 text,
  1 order, 1 match, 1 select-all, 7 multiple choice. No module_quiz (honors lessons).
- Multiple-choice correct positions over the module's 17: index 0 ×5, 1 ×4, 2 ×4, 3 ×4.

## Pictures (all original SVG, with `-blank` copies for label questions)
de-m8-two-tanks, de-m8-real-portraits, de-m8-complex-portraits, de-m8-coupled-masses, de-m8-tank-chain.
Portrait trajectories were computed numerically (RK4) for the actual matrices:
saddle [[1,1],[4,1]], sink [[-2,1],[1,-2]], source [[2,-1],[-1,2]], line of equilibria [[-1,1],[1,-1]],
spiral sink [[-0.4,-2],[2,-0.4]], spiral source [[0.3,-2],[2,0.3]], center [[0,1],[-2,0]],
improper node [[-3,1],[-1,-1]]. All previewed with markers.

## Drills (`drills/r2-de-m8.yaml`, 5)
de-m8-r2-mode-freqs, de-m8-r2-beat-time (37h1); de-m8-r2-peak-time, de-m8-r2-char-poly-3x3,
de-m8-r2-critical-gain (37h2). Rounded answers use tolerance 0.006 (2 dp) or 0.06 (1 dp).
Formulas were checked independently in Python (numpy eigenvalues over every input combination
for mode-freqs; ODE integration for peak-time and beat-time; eigenvalues just below/above the
threshold for every critical-gain input; numpy.poly for 2,000 random 3×3 matrices).

## Glossary and cards
- `glossary-r2-de-m8.yaml` (9): coupled oscillators, stiffness matrix, mode shape, in-phase mode,
  out-of-phase mode, modal coordinates, principal minors, dominant eigenvalue, Routh–Hurwitz criterion.
- Not bolded because they already exist: "normal mode" (glossary.yaml, defined for the wave
  equation) and "compartment model" (an alias in glossary-r2-de-m3.yaml).
- `cards-r2-de-m8.yaml` (20): 10 on Coupled oscillators, 10 on Stability of larger systems.

## For a reviewer
- 37h2 states Routh–Hurwitz for degrees 2 and 3 only, and the reason for $a_1a_2 > a_3$ is a sketch based on continuity of roots, labeled as one.
- 37h1 states without proof that the $\omega^2$ are positive for any number of masses (positive-definite $K$); the 2×2 case is proved.
- The building model (rigid floors, no damping) and the gene-feedback model are labeled as simplified.
- check-module.sh diffeq de-m8: zero problems.

## Errors found in existing content
None.

## Sources
Standard results (normal modes, Routh–Hurwitz, characteristic polynomial coefficients). History
dates: J. C. Maxwell, "On Governors" (1868); E. J. Routh, *A Treatise on the Stability of a Given
State of Motion* (Adams Prize, 1877); A. Hurwitz (1895). All numbers recomputed in Python (sympy/numpy/scipy).
