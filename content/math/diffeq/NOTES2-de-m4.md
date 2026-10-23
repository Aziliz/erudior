# Round 2 notes: de-m4 (Autonomous equations and numerical methods)

## Honors lessons (3)
The module has two halves (qualitative and numerical), and Lesson 17 already points to stiff and adaptive solvers, so it gets three honors lessons. All three avoid limit cycles, chaos and 2-D bifurcations, which belong to the de-h1 honors module.
- `lessons/17h1-harvesting-resilience.md`, `de-m4-h-harvesting`, **Harvesting policies and resilience** (45 min, about 1,640 words). Covers constant-quota versus constant-effort harvesting, effort harvesting rewritten as a logistic equation, the transcritical bifurcation at E = r, the sustainable-yield curve with MSY at E = r/2, return time T_R = 1/|f′(P*)| for both policies, critical slowing down and early-warning signals (flagged as an active research area that is not foolproof), and a shock comparison that solves the collapse time exactly with partial fractions. Drills: de-m4-r2-effort-yield, de-m4-r2-return-time.
- `lessons/17h2-stiff-implicit.md`, `de-m4-h-stiff`, **Stiff equations and implicit methods** (50 min, about 1,680 words). Covers the test equation, stability functions R(z) for Euler, Heun and RK4, regions of absolute stability, explicit step limits (2/|λ| and 2.785/|λ|), stiffness (labeled as a working definition), backward Euler and the trapezoidal method, A- and L-stability, BDF, and Newton's method for a nonlinear implicit step. Drills: de-m4-r2-stability-limit, de-m4-r2-backward-euler.
- `lessons/17h3-adaptive-steps.md`, `de-m4-h-adaptive`, **Error estimates and adaptive step size** (45 min, about 1,340 words). Covers Richardson's error estimate and extrapolation, embedded pairs (Heun–Euler; RKF45 and Dormand–Prince named), the step-size formula with a safety factor, the accept/reject loop, local extrapolation, and what a tolerance does and doesn't control. Drills: de-m4-r2-richardson, de-m4-r2-new-step.

## Core lessons (additions only)
- 14 autonomous: a Mermaid chart for drawing and reading a phase line, and an SVG phase line for y′ = (y + 2)(y − 1)²(y − 3) showing a sink, a source and a semistable point.
- 15 bifurcations: an SVG with the three standard bifurcation diagrams side by side, and a Mermaid chart for naming a bifurcation.
- 16 improved Euler: an SVG of one Heun step (k₁ line, Euler prediction, k₂, average slope, true curve), and a Mermaid chart of the predictor–corrector step.
- 17 Runge–Kutta: an SVG of the four RK4 sample points, and a Mermaid "which method when" chart.

## Questions (`questions/r2-de-m4.yaml`, 61)
- Core (de-m4-r2-q01–q20): 5 per lesson, one each of text, label, order, match and select-all. Module quiz: q02, q04, q07, q10, q12, q14, q16, q20 (two per lesson).
- Honors (de-m4-r2-h01–h41): 14 harvesting, 14 stiff, 13 adaptive. Overall: 20 multiple choice (correct answers 5 at each index), 12 text, 10 select-all, 7 order, 7 match, 5 label.

## Pictures and diagrams
- SVGs in `images/` (each with a `-blank` copy for its label question): de-m4-phase-line, de-m4-bifurcation-types, de-m4-heun-step, de-m4-rk4-samples, de-m4-stability-regions. All are 13 KB or smaller and were previewed with markers. In the phase-line blank all the dots look the same, so the dot style doesn't give the answer away. The RK4 region boundary is a computed contour of |R(z)| = 1.
- Mermaid diagrams: 6 (L14, L15, L16, L17, 17h2 "is it stiff?", 17h3 adaptive loop). All were rendered and checked.
- Plots: 5 in the honors lessons (effort bifurcation diagram, yield curve, return time against quota, backward Euler on a stiff problem, adaptive steps on a logistic curve). They were rendered with the app CSS, and labels were moved off the curves.

## Drills (`drills/r2-de-m4.yaml`, 6)
de-m4-r2-effort-yield, -return-time, -stability-limit, -backward-euler, -richardson, -new-step. Each was generated 400 times from the built JSON. Answers were recomputed independently from the prompt text in Python: the RK4 limit by bisection on |R(hλ)| ≤ 1, and the backward Euler steps checked against the implicit equation. The shown answers are accepted, and correctly rounded answers fall within tolerance (the 3-s.f. answers use relTolerance 0.006). Values that could reach 1,000 inside TeX use sig6, so no thousands commas appear.

## Glossary and cards
- `glossary-r2-de-m4.yaml`, 24 terms: constant-quota harvesting, constant-effort harvesting, sustainable yield, return time, resilience, critical slowing down, early-warning signal, test equation, stability function, region of absolute stability, explicit method, implicit method, backward Euler method, trapezoidal method, A-stable, L-stable, backward differentiation formulas (BDF), Richardson extrapolation, embedded pair, Dormand–Prince method, tolerance, safety factor, adaptive step-size control, local extrapolation. I checked every glossary*.yaml for duplicates. "stiff equation" already existed, so I reused it.
- `cards-r2-de-m4.yaml`, 28 cards: 11 on harvesting models, 9 on stiff equations, 8 on adaptive step size.

## For a reviewer
- Every number in the lessons was recomputed in Python and sympy. This covers the exact solution of y′ = −1000(y − cos t), the backward Euler and trapezoidal tables, the Newton iterates, the collapse time 5 ln(10/3) ≈ 6.0, the recovery time to 59 of about 6.2 years, the Richardson tables, and the Heun–Euler controller run (31 accepted steps, 8 rejected, step sizes from 0.028 to 0.234, maximum error 0.034).
- Facts worth a second look: SciPy `solve_ivp` defaults (RK45, rtol 1e-3, atol 1e-6), Dormand–Prince behind MATLAB ode45 and SciPy RK45 (7 stages, FSAL, about 6 evaluations per step), "stiff" coming from 1950s chemical-kinetics work, and Richardson's use of extrapolation in the early twentieth century.
- 17h3 Example 3 says plainly that adaptivity does not beat a well-chosen fixed step on that mild problem.
- Overlap with de-h1 (nonlinear dynamics and chaos): critical slowing down appears in 17h1 as a 1-D idea. If the de-h1 writer also defines it, one glossary entry should go.
- Label questions q02 and h18 have no distractors, because any plausible extra label would be either right or too subtle to be clearly wrong.

## Errors found in existing content
None. I read lessons 14–17 and the m4 question and drill files; no edits were needed.

## Sources
Standard numerical-analysis material, written from general knowledge and checked by computation: the test equation and A-stability (Dahlquist), backward Euler, the trapezoidal method and BDF, Richardson extrapolation, embedded Runge–Kutta pairs (Fehlberg; Dormand–Prince), and the SciPy `solve_ivp` documentation for method names and default tolerances. The harvesting models are the standard logistic quota and effort models. Ecology uses "resilience" in two senses (return speed and capacity to absorb a disturbance). Early-warning signals of critical transitions are described in the ecology literature (for example Scheffer et al.) and are presented here with caveats.
