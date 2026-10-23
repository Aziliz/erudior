# Round 2 notes: de-h1 (Honors: Nonlinear dynamics and chaos)

Honors module, 4 new lessons (files 90–93, `module: de-h1`, honors from course.yaml). They build on
Lessons 14–15 (phase lines, bifurcations), 5/17 (Euler, step-size stability), 35 (trace–determinant)
and 37 (linearization, Lotka–Volterra), and run as one arc: limit cycles, how they are born, chaos in
maps, chaos in a real ODE. No overlap with the other writers' honors lessons (checked: no other
lesson covers limit cycles, Hopf, maps or Lorenz; 10h2 has a one-paragraph preview of chaos, and
its glossary term "sensitive dependence on initial conditions" is reused, not redefined).

`content/math/check-module.sh diffeq de-h1`: OK, zero problems.

## Lessons
| File | Id | Title | Words | Examples |
|---|---|---|---|---|
| 90-limit-cycles.md | de-h1-limit-cycles | Limit cycles and the Poincaré–Bendixson theorem | ~2,030 | 4 |
| 91-hopf-bifurcation.md | de-h1-hopf | Bifurcations in the plane and the Hopf bifurcation | ~1,870 | 4 |
| 92-logistic-map.md | de-h1-logistic-map | From Euler's method to chaos: the logistic map | ~1,840 | 3 |
| 93-lorenz-chaos.md | de-h1-lorenz | The Lorenz equations and strange attractors | ~1,890 | 3 |

Contents: polar identities and circular limit cycles; Poincaré–Bendixson with a trapping annulus
(proof for $x' = x - y - x^3$, $y' = x + y - y^3$); Bendixson/Dulac with the Green's-theorem proof;
Van der Pol and Liénard. Eigenvalue-crossing classification; super/subcritical Hopf prototypes,
informal Hopf theorem, Brusselator, hysteresis, paradox of enrichment. Euler on the logistic
equation = logistic map ($R = 1 + hr$), map stability, cobwebs, 2-cycle formula and multiplier,
period-doubling cascade and Feigenbaum, period 3, Lyapunov exponent. Lorenz: symmetry, divergence,
equilibria, origin eigenvalues, $r_H$ (subcritical), strange attractor, Lorenz map, predictability
horizon, what numerics can and can't tell you.

## Questions (`questions/r2-de-h1.yaml`, 58: de-h1-r2-h01 … h58)
- 15 / 14 / 15 / 14 per lesson; module quiz 5 per lesson (20 total), covering every topic.
- Types: 33 multiple choice (correct index 0/1/2/3 = 8/9/8/8), 5 select-all, 9 text, 4 match,
  4 order, 3 label (trapping annulus, subcritical Hopf diagram, Lorenz attractor).

## Pictures and diagrams
- SVG (generated from computed data, original): `de-h1-trapping-annulus.svg` (+ `-blank`),
  `de-h1-hopf-subcritical.svg` (+ `-blank`), `de-h1-orbit-diagram.svg` (logistic-map orbit diagram,
  14.7 KB), `de-h1-lorenz.svg` (+ `-blank`; x–z projection of an RK4 trajectory). All under 20 KB.
- Plots: Example 1 field with exact spiral trajectories (L90), Van der Pol field with numerically
  computed cycle (L90), supercritical Hopf diagram (L91), cobweb for R = 2.8 (L92), R = 4 time series
  from two nearby starts (L92).
- Mermaid (one per lesson): closed-orbit decision chart; how an equilibrium loses stability;
  period-doubling route to chaos; long-run behavior by dimension.

## Drills (`drills/r2-de-h1.yaml`, 11)
de-h1-r2-polar-cycle, -annulus (L90); -hopf-cycle, -brusselator (L91); -map-iterate, -map-fixed,
-euler-map, -two-cycle (L92); -lorenz-eq, -lorenz-origin, -horizon (L93). 300 instances of each
were generated from the built JSON and checked against independent Python (numerical root-finding
for $r_H$, eigenvalues with numpy, iterating the map for the 2-cycle): all correct; displayed
answers carry the precision the prompt asks for.

## Glossary and cards
- `glossary-r2-de-h1.yaml`: 31 terms (closed orbit, limit cycle, Poincaré–Bendixson theorem,
  trapping region, Dulac's and Bendixson's criteria, Van der Pol equation, relaxation oscillation,
  Hopf bifurcation, supercritical, subcritical, Brusselator, saddle-node bifurcation of cycles,
  hysteresis, paradox of enrichment, iterated map, logistic map, fixed point, multiplier, cobweb
  diagram, 2-cycle, period-doubling bifurcation, Feigenbaum constant, chaos, Lyapunov exponent,
  Lorenz equations, dissipative, attractor, strange attractor, predictability horizon, butterfly
  effect). Checked against every glossary*.yaml: no duplicate terms or aliases.
- `cards-r2-de-h1.yaml`: 38 cards (10 / 8 / 10 / 10).

## For a reviewer
- Numbers stated from numerical solutions (not closed forms), all recomputed with scipy/RK4:
  Example 3 cycle radius 1.07–1.25; Van der Pol amplitude ≈ 2.00–2.02 and period 6.66 at μ = 1;
  Brusselator cycle at a = 1, b = 2.1 (x from 0.71 to 1.47, period ≈ 6.32); amplitude ≈ 2√μ for
  $x'' - (\mu - x^2)x' + x = 0$; Lorenz Lyapunov exponent 0.92 by my estimate (literature ≈ 0.906,
  the lesson says ≈ 0.91); separation of runs from (1,1,1) and (1,1,1.000001): 6e-6 at t = 10,
  0.007 at t = 20, 1.6 at t = 25.
- Statements given without proof and labeled so: closed orbits enclose an equilibrium (index
  theory); Liénard's uniqueness theorem; the Lorenz trapping ellipsoid; the subcritical nature of
  the Lorenz Hopf; reliability of attractor statistics under refinement (said to be supported by
  computation, not fully proved).
- History/attribution, checked: Poincaré (1880s) and Bendixson (1901); Liénard 1928; Van der Pol
  1920s; Hopf 1942 with Andronov's school in the 1930s; Prigogine–Lefever 1968; Rosenzweig 1971
  (labeled a debated model prediction); May 1976; Feigenbaum mid-1970s; Li–Yorke 1975 and
  Sharkovsky 1964; Lorenz 1963, his ~1961 rounding anecdote (12-variable model, not the 1963
  system) and 1972 butterfly talk; Saltzman's convection model; Tucker 2002; Rössler 1976.
- Doubling values in the L92 table (3.4495, 3.5441, 3.5644, R∞ ≈ 3.5699) are standard published
  values; gap ratios recomputed (4.75, 4.66, 4.67).

## Errors found in existing content
None that needed fixing. (Minor, not changed: PROGRESS.md's outline numbers lessons differently from
the files, e.g. it lists de-nonlinear as 35 while the file is 37; the lessons themselves use the file
numbers, which these lessons follow.)

## Sources (for checking; all writing is original)
- S. H. Strogatz, *Nonlinear Dynamics and Chaos* (2nd ed.): limit cycles, Poincaré–Bendixson, Dulac,
  Hopf, logistic map, Lorenz (r_H formula, Lyapunov exponent ≈ 0.9, Lorenz map).
- E. N. Lorenz, "Deterministic Nonperiodic Flow," J. Atmos. Sci. 20 (1963); *The Essence of Chaos* (1993).
- R. M. May, "Simple mathematical models with very complicated dynamics," Nature 261 (1976).
- T.-Y. Li and J. A. Yorke, "Period three implies chaos," Amer. Math. Monthly 82 (1975).
- W. Tucker, "A rigorous ODE solver and Smale's 14th problem," Found. Comput. Math. 2 (2002).
- I. Prigogine and R. Lefever, J. Chem. Phys. 48 (1968); M. L. Rosenzweig, Science 171 (1971).
- All numerical values recomputed in Python (sympy, numpy, scipy, mpmath).
