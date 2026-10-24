# Round 3 notes: de-m8, honors lesson on Lyapunov functions

Fills the gap left by NOTES2-de-m8 (Lyapunov functions deferred) and not covered by de-h1 (90–93).

## Lesson
- `lessons/37h3-lyapunov-functions.md`: **Lyapunov functions and the direct method**
  (id `de-m8-h-lyapunov`, `honors: true`, module de-m8, 50 min, topic "Lyapunov functions").
  Sections: Lyapunov vs asymptotic stability (ε–δ); damped-pendulum energy ($\dot E = -cy^2$);
  derivative along trajectories; Lyapunov's theorem (stable / asymptotically stable) with short
  proofs of both cases and an SVG of the ε–δ–level-curve argument; mirror-image instability test;
  converse theorems (Massera 1949) mentioned only; quadratic candidates ($4ac - b^2 > 0$ test,
  $\dot V = \mathbf{x}^T(A^TP + PA)\mathbf{x}$, Lyapunov equation, why the same $V$ works for
  the nonlinear system, labeled "in outline"); linearization-fails cases (center: $x' = \mp y \mp x^3$
  pair; zero eigenvalue: $x'' + x' + x^3 = 0$); LaSalle's invariance principle (statement only,
  labeled "stated without proof") and the practical corollary; global asymptotic stability and
  radial unboundedness; basin estimates from level sets (safe disk of radius √2 with the saddles on
  its edge; pendulum region $E < 2$); history.
- Four worked examples, Mermaid workflow chart, three ```plot figures (pendulum with energy level
  curves and vector field; spiral solution vs ellipses and a circle; basin example with vector
  field, circles and saddles), one SVG. All plots and the SVG were previewed.
- About 1,870 words of prose (about 2,400 counting math tokens; denser than 37h1/37h2 because the
  brief listed seven topics).

## Questions (`questions/r3-de-m8.yaml`, 16, ids de-m8-r3-h01…h16)
- 9 multiple choice (correct index 0 ×2, 1 ×2, 2 ×3, 3 ×2), 1 select-all, 3 text, 1 match,
  1 order, 1 label (`images/de-m8-lyapunov-proof-blank.svg`). No `module_quiz` (honors lesson
  in a core module).

## Drills (`drills/r3-de-m8.yaml`, 3)
- `de-m8-r3-vdot`: $\dot V$ at a point for a quadratic $V$ and a polynomial system (integer answer).
- `de-m8-r3-posdef`: the bound $K = \sqrt{4ac}$ for $ax^2 + kxy + cy^2$ to be positive definite
  (tolerance 0.006, exact surds accepted).
- `de-m8-r3-basin`: safe-disk radius $\sqrt{2a/m}$ for $x' = -ax + mxy^2$, $y' = -ay + mx^2y$
  (tolerance 0.006). Checked numerically for all 18 inputs (sup of $\dot V$ on circles just inside
  and just outside the radius); the saddles $(\pm\sqrt{a/m}, \pm\sqrt{a/m})$ lie on the edge.

## Pictures
- `images/de-m8-lyapunov-proof.svg` and `-blank.svg` (label question): ε-circle, level curve
  $V = m$ touching it, δ-disk, a trajectory (drawn as a decaying elliptical spiral that respects
  the level curves of $V$, so it moves farther from the equilibrium for a while while $V$ decreases).

## Glossary (`glossary-r3-de-m8.yaml`, 13) and cards (`cards-r3-de-m8.yaml`, 14)
- Terms: direct method, Lyapunov stable, conserved quantity, derivative along trajectories, positive
  definite, Lyapunov function, Lyapunov equation, invariant set, positively invariant, LaSalle's
  invariance principle, globally asymptotically stable, radially unbounded, basin of attraction.
  Checked against every glossary*.yaml: no term or alias clashes. ("asymptotically stable",
  "center", "Jacobian matrix", "linearization", "trapping region" already exist and were not
  redefined or bolded.)

## Verification
- Every derivative, $\dot V$, Jacobian, eigenvalue, matrix product and question answer recomputed
  with sympy; the spiral $x = 3e^{-t}\cos 3t$, $y = -e^{-t}\sin 3t$ solved with sympy and its three
  crossings of $r = 1$ found numerically ($t \approx 0.39, 0.77, 1.09$); pendulum level-curve
  parametrization $x = 2\arcsin(\sqrt{c/2}\sin t)$, $y = \sqrt{2c}\cos t$ checked to give $E = c$;
  Lyapunov-equation solutions with $Q = I$ checked positive definite with scipy.
- `content/math/check-module.sh diffeq de-m8`: OK, zero problems.

## For a reviewer / uncertain
- Simplifications, labeled in the text: LaSalle stated without proof; the "same $V$ works for the
  nonlinear system" argument is an outline; the instability test is the simple Lyapunov version
  (Chetaev's sharper theorem is not mentioned); "a bounded piece of $\{V \le c\}$" glosses over
  connected components.
- The remark that attraction without stability is possible refers to Vinograd's 1957 example; it is
  not named in the lesson.
- Pre-existing, not mine: glossary-r2-de-h1.yaml lists "Van der Pol equation/oscillator" in two
  capitalizations, and glossary-r2-de-m7.yaml has "gamma function" twice (case-insensitive
  duplicates); the checker does not flag them.

## Sources
Standard results; history checked against standard accounts: A. M. Lyapunov, *The General Problem
of the Stability of Motion* (Kharkov Mathematical Society, 1892; French translation, Annales de la
Faculté des Sciences de Toulouse, 1907; English, Int. J. Control 1992). J. L. Massera, "On
Liapounoff's conditions of stability", Annals of Mathematics 50 (1949). E. A. Barbashin and N. N.
Krasovskii, Doklady Akad. Nauk SSSR (1952). J. P. LaSalle, "Some extensions of Liapunov's second
method", IRE Trans. Circuit Theory 7 (1960). R. E. Kalman and J. E. Bertram, "Control system
analysis and design via the second method of Lyapunov", J. Basic Engineering (1960). Textbook
treatments consulted from memory: Khalil, *Nonlinear Systems*; Strogatz, *Nonlinear Dynamics and
Chaos*; Boyce–DiPrima §9.6.
