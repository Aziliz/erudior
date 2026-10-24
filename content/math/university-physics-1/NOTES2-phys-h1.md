# NOTES2-phys-h1: Honors module phys-h1, "Honors: Analytical mechanics and orbits"

`content/math/check-module.sh university-physics-1 phys-h1`: build and checker report **zero problems** (4 lessons, 56 questions, 10 drills, 41 cards).

## What was added

The module is a capstone. It rebuilds mechanics from energy (Lagrangian, then Hamiltonian), uses the result to solve the Kepler problem exactly, and then applies it to spaceflight. Before choosing topics I checked the core writers' honors lessons in this course (02h1–29h3). None of them covers Lagrangian/Hamiltonian mechanics, orbit shapes or transfers. 19h3 covers the shell theorem and tides, 14h3 the CM frame and reduced mass, 14h1 central forces as conservative fields, and 23h2 normal modes. Lesson 92 bolds "central force" and "reduced mass" but uses phys-m4's glossary entries for them and doesn't redefine them.

**Lessons** (module `phys-h1`, no `honors:` line needed):

| File | Id | Min | Prose words* | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|
| 90-lagrangian-mechanics.md | phys-h1-lagrangian | 45 | ~1,750 | 3 (simple pendulum; Atwood with a 2.0 kg disk pulley, a = 1.63 m/s²; swinging rod, ω = √(3g/2ℓ)) | phys-h1-pendulum.svg; Mermaid "Lagrangian recipe" | atwood-pulley, rod-pendulum |
| 91-symmetry-hamiltonian.md | phys-h1-symmetry | 45 | ~1,700 | 3 (puck on a string through a hole; oscillator in phase space; pendulum separatrix speed) | plot: pendulum phase portrait; Mermaid "Noether: symmetry → conservation" | string-hole, phase-ellipse |
| 92-kepler-problem.md | phys-h1-kepler | 50 | ~1,500 | 3 (Halley's comet; 7000 × 10 000 km Earth orbit; classify an orbit from r and v) | phys-h1-ellipse.svg; plot: effective potential; Mermaid "classify an orbit" | ellipse-orbit, vis-viva, orbit-state |
| 93-orbital-maneuvers.md | phys-h1-maneuvers | 50 | ~1,600 | 3 (LEO→GEO Hohmann; Earth→Mars Hohmann with phase angle and synodic period; departure burn and the Oberth effect) | phys-h1-hohmann.svg; Mermaid "Hohmann steps" | hohmann, mars-transfer, escape-burn |

*Prose words leave out code blocks, display math and image alt text.

Content by lesson:
- **90.** Generalized coordinates and constraints; L = T − U; the action and Hamilton's principle (labeled "stationary", not always least); a derivation of Euler–Lagrange by varying the path; a check against Newton; limits of the method (constraint forces, friction and drag need generalized forces).
- **91.** Generalized momentum and cyclic coordinates; angular momentum and Kepler's second law; Noether's theorem (stated, not proved); the Hamiltonian and when H = T + U; Hamilton's equations; phase space, phase portraits, the separatrix; Liouville's theorem (stated, not proved).
- **92.** Reduction to the reduced mass; the effective potential; Binet's u = 1/r orbit equation and its conic solution; ellipse geometry; E = −GMm/2a and vis-viva derived; Kepler's third law proved for ellipses; Bertrand's theorem and Mercury's precession (mentioned).
- **93.** Delta-v and impulsive burns; how a burn reshapes an orbit; the Hohmann transfer (with the bi-elliptic threshold mentioned); interplanetary timing; hyperbolic excess speed and the Oberth effect; patched conics (labeled); gravity assists (qualitative).

**Questions** (`questions/r2-phys-h1.yaml`, phys-h1-r2-h01 to h56): 14 per lesson, 56 in total.
- 36 four-choice multiple choice. Answer positions per lesson are 2/2/2/3 or 3/2/2/2.
- 20 other types (36%): 7 text (fill in the blank: 3 terms, 4 numeric), 3 match, 3 order, 4 select-all, 3 label (pendulum, orbital ellipse, Hohmann transfer).
- `module_quiz: true` on 20 questions (5 per lesson), covering every topic of the module.

**Pictures**: original SVGs, each under 2 KB, all previewed as PNG.
- phys-h1-pendulum.svg, with a blank copy for its label question
- phys-h1-ellipse.svg, with a blank copy
- phys-h1-hohmann.svg, with a blank copy

Label markers were checked on the blank copies with `--markers`. The 2 plots were rendered with the app's `renderFigure` and CSS and inspected. The 4 Mermaid diagrams were rendered with `preview-figure.mjs`.

**Drills** (`drills/r2-phys-h1.yaml`): 10, all with ids `phys-h1-r2-<slug>` as in the table above.

**Glossary** (`glossary-r2-phys-h1.yaml`): 37 terms.
- Lagrangian mechanics: constraint, degrees of freedom, generalized coordinates, Lagrangian, action, principle of stationary action (aliases: Hamilton's principle, principle of least action), Euler–Lagrange equation.
- Symmetry and the Hamiltonian: generalized momentum, generalized force, cyclic coordinate, Noether's theorem, Hamiltonian, Hamilton's equations, phase space, phase portrait, separatrix, Liouville's theorem.
- Orbits: Kepler problem, effective potential (alias centrifugal barrier), orbit equation, Bertrand's theorem, conic section, eccentricity, semimajor axis, periapsis (aliases perigee, perihelion), apoapsis (aliases apogee, aphelion), vis-viva equation, specific orbital energy.
- Maneuvers: delta-v, impulsive burn, Hohmann transfer, transfer orbit, hyperbolic excess speed, Oberth effect, synodic period, launch window, gravity assist.

On 2026-10-23 I checked these terms and aliases against every `glossary*.yaml` in the course (the m1, m2, m4 and m6 r2 files included) and found no duplicates. Every bolded term in lessons 90–93 has an entry, here or in an existing file.

**Cards** (`cards-r2-phys-h1.yaml`): 41 in total (10 / 10 / 11 / 10 by lesson), on the lesson topics: Lagrangian mechanics, Symmetry and conservation, Hamiltonian mechanics, Central forces, Kepler orbits, Orbital maneuvers.

## Verification

- I recomputed every worked-example number and every question key in Python. Each distractor was checked to be wrong and tied to a named mistake.
  - Order questions have only one valid order. Select-all choices are clearly right or clearly wrong.
- Drills: I generated 400 instances of each with `generate()` on the built JSON (`/tmp/r2-phys-h1/vd.mts`) and recomputed the answers from the shown inputs with independent formulas. In every instance:
  - answers rounded to 3 s.f. were accepted;
  - every bolded solution value was accepted;
  - a 5% error in any one box was rejected.

  There were 0 failures.
- Constants follow the course: G = 6.67 × 10⁻¹¹, M_E = 5.97 × 10²⁴ kg, R_E = 6370 km, so GM_E = 3.98 × 10¹⁴ m³/s² (the accepted value is 3.986 × 10¹⁴; the lessons say the value comes from the course's G and M_E). For the Sun: M = 1.99 × 10³⁰ kg and 1 AU = 1.50 × 10¹¹ m.

## Notation and simplifications a reviewer should know

- Following advanced texts, the module uses T for kinetic energy; lesson 90 says so. Tensions get no symbol, to avoid a clash. In lesson 92, ℓ is angular momentum (stated there), not the pendulum length used in lesson 90.
- Labeled as simplified: "least" vs "stationary" action; L = T − U only for conservative forces with workless constraints; H = T + U only for fixed constraints; impulsive burns; coplanar circular planetary orbits; patched conics; the idealized 2U gravity-assist limit; no plane change in the LEO→GEO example.
- Proofs not given (stated as such): Noether's theorem, Liouville's theorem, Bertrand's theorem.

## For a reviewer to double-check

These are facts quoted from standard references, not re-verified online in this session:
- Halley's comet: perihelion about 0.586 AU, aphelion about 35.1 AU, period 74–79 yr.
- Mercury's anomalous precession: about 43″ per century.
- Bi-elliptic transfers beat Hohmann for radius ratios above about 11.9.
- Hohmann published his transfer in 1925; Noether's theorem was published in 1918.
- Earth–Mars Hohmann trip: about 258–259 days.

## Errors found in existing content

None. No existing files were edited.

## Sources

Standard results as presented in Taylor, *Classical Mechanics* (Lagrangian, Hamiltonian, central-force chapters); OpenStax *University Physics* Vol. 1 ch. 13 (gravitation, Kepler's laws); Curtis, *Orbital Mechanics for Engineering Students* (vis-viva, Hohmann, bi-elliptic, patched conics); NASA/JPL small-body data for Halley's comet. All explanations, examples and questions are original.
