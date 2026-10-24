# REVIEW2-phys-h1: Honors module phys-h1, "Honors: Analytical mechanics and orbits" (item 141)

Reviewer's scope: lessons 90–93, `questions/r2-phys-h1.yaml` (h01–h56), `drills/r2-phys-h1.yaml` (10 drills),
`glossary-r2-phys-h1.yaml` (37 terms), `cards-r2-phys-h1.yaml` (41 cards), `images/phys-h1-*` (3 pictures + 3 blanks),
4 Mermaid diagrams, 2 plots. After the fixes, `content/math/check-module.sh university-physics-1 phys-h1` reports zero problems
(4 lessons, 56 questions, 10 drills, 41 cards).

## Changes

| Where | What was wrong | Change |
|---|---|---|
| Drill `phys-h1-r2-ellipse-orbit`, solution | `{rp}` and `{rap}` use the default format, which prints thousands commas inside math (`$r_p = 7,970$ km`) | `{rp:sig5}`, `{rap:sig5}` (prints `7970`) |
| Drill `phys-h1-r2-vis-viva`, solution | Same problem: `$a = \tfrac12(10,700 + 57,500) = …$` | `{rp:sig5}`, `{rap:sig5}`, `{sma:sig5}` |
| Lesson 91, pendulum phase-portrait plot | The "stable" label touched the innermost loop; the "unstable" label sat against the dashed separatrix; the x-axis title "θ (rad)" sat on the open point at θ = π | Inner loop widened from amplitude 1 rad to 1.4 rad (still a valid libration curve, `sqrt(2(cos x − cos 1.4))` on [−1.4, 1.4]); "stable" moved to (0.6, 0.3); "unstable" to (3.65, 0.65); x range widened to [−4, 4.6] so the axis title clears θ = π. Re-rendered with the app's code: no label touches a curve, axis or another label |
| Question h39 (text) | British spelling of an accepted synonym missing | Added `pericentre` to `accept` |

Counts: answer-key errors 0, factual fixes 0, picture fixes 1 (the plot), other fixes 3 (2 drill formatting, 1 accept list).

## Checked and found right

- **All 56 questions** worked independently before reading the keys; every numeric key and every numeric distractor recomputed in Python (e.g. h05 1.96 / 2.45 / 1.63 / 7.84 m/s²; h08 1.27 s, with 1.55, 1.10, 0.898 s each matching its named mistake; h33 7.73 km/s with 7.05, 6.31 and 9.97 km/s = circular at 8000 km, circular at 10 000 km, escape at 8000 km; h37 ε = −9.25 MJ/kg, a = 21 500 km; h44 83 / 166 / 123 / 235 min; h47 3.6 km/s; h48 e^1.5 = 4.48, e^(2/3) = 1.95; h49 3.0 yr; h56 2.73 yr). One defensible answer each; select-all sets (h12, h26, h41, h55) clean; order questions (h11, h28, h53) have no swappable steps; match/label pairings unambiguous.
- **Lesson numbers**: Atwood 1.63 m/s², 24.5 N; rod ω = 4.04 rad/s, 1.55 s vs 1.90 s; puck 8.0 rad/s, 0.10 → 0.40 J; oscillator ellipse 0.20 m, 2.0 kg·m/s, area 1.26 J·s = 2πE/ω; separatrix 6.26 m/s (rod) vs 7.0 m/s (string); Halley a = 17.8 AU, e = 0.967, T = 75.4 yr, v_p/v_a = 59.9; 7000 × 10 000 km orbit e = 0.176, 8.18 / 5.73 km/s, 130 min; Example 3 ε = −2.49 × 10⁷ J/kg, a = 8.01 × 10⁶ m, apogee 9.01 × 10⁶ m (≈2640 km up), 119 min; LEO→GEO 2.42 + 1.46 = 3.88 km/s, 5.3 h, mass ratio 3.6 (72.6% propellant, "almost three-quarters"); Earth→Mars 258 days, 29.7 / 32.7 / 21.5 / 24.1 km/s, v∞ 2.93 and 2.63 km/s, lead 44°, synodic 2.14 yr (25.7 months, "about 26"); departure burn 3.58 vs 6.12 km/s (Oberth saving 2.5 km/s). μ for Earth–Sun is 3 × 10⁻⁶ below Earth's mass.
- **Derivations**: Euler–Lagrange by parts, Binet substitution (ṙ = −(ℓ/m) du/dφ, r̈ = −(ℓ²u²/m²) d²u/dφ²), sum of turning-point roots giving E = −GMm/2a, Kepler III from πab and p = a(1 − e²), dH/dt = −∂L/∂t, Hohmann Δv formulas, separatrix curve 2cos(θ/2) in units of √(g/ℓ), phase-ellipse direction (clockwise with x across and p up). "Stationary, not least" action correctly labeled (minimum for short enough times).
- **Plots**: effective potential `1/x² − 2/x` has its minimum −1 at x = 1; the E = −0.6 turning points 0.612 and 2.72 and the E = 0.3 turning point 0.467 are exact roots.
- **Pictures** (rendered and read): pendulum bob at the 30° rod end lies on the r = 200 arc; ellipse a = 150, b = 120 so foci at ±90 (e = 0.6), orbiting body exactly on the ellipse; Hohmann transfer ellipse a = 100, c = 40 puts its focus at the planet, b = 91.65; both burn arrows point in the (counterclockwise) direction of motion. All label markers (h13, h38, h52) sit on the parts their labels name.
- **Mermaid** (4, rendered): content right, `accTitle`/`accDescr` describe each whole diagram, `flowchart TD` for the long chains.
- **Drills**: 300 instances of each of the 10 drills generated with the app's `generate()`; answers recomputed independently in Python from the prompt text; all 3000 bolded solution values agree to within 0.6%; 3-s.f. answers accepted in every instance; a 5% error in any one box rejected in every instance; orbit-state's "perigee" claim (v above circular speed) holds in every instance.
- **Glossary/cards**: definitions correct; no term or alias of the 37 duplicates any `glossary*.yaml` in the course.
- **Facts from the writer's list**:
  - Halley: q ≈ 0.586 AU, Q ≈ 35.1 AU, period 74–79 yr: matches the commonly cited 1986-apparition elements (current osculating elements, theskylive.com: q = 0.575, Q = 35.3 AU, a = 17.9 AU, e = 0.968, T = 75.9 yr; the lesson's "about" covers this).
  - Mercury's anomalous perihelion advance ≈ 43″/century: standard (GR prediction 42.98″/cy).
  - Bi-elliptic beats Hohmann above a radius ratio of about 11.94 (and always above 15.58): Wikipedia "Bi-elliptic transfer" / Curtis. The lesson's "can do slightly better" wording is right.
  - Hohmann 1925, *Die Erreichbarkeit der Himmelskörper* (Wikipedia "Hohmann transfer orbit"); Noether 1918 ("Invariante Variationsprobleme").
  - Earth–Mars Hohmann ≈ 259 days in the circular model (0.707 yr × 365.25 = 258.3 d).
- **Cross-references** checked: lesson 12 (F = −dU/dx, energy diagrams, turning points), 13 (rocket equation), 16 (Atwood with massive pulley, Newtonian), 19 (Kepler III proved for circles, E = −GMm/2r), 20 (pendulum), 14 (elastic collisions).

## Overlap (report only)

- Lesson 19 (core) already shows an e = 0.6 Kepler ellipse (`phys-m5-kepler-ellipse.svg`) with perihelion/aphelion/semimajor axis; lesson 92's `phys-h1-ellipse.svg` covers similar ground but adds the empty focus, center, r and φ for the orbit equation. Acceptable reinforcement.
- 14h3 (CM frame) introduces reduced mass and 14h2 (mass flow) the rocket equation; lessons 92/93 use both briefly with back-references rather than re-teaching. No substantive duplication with 19h3 (shell theorem, tides) or 23h2 (normal modes).

## Left uncertain

Nothing material. Note that `content/math/physics/NOTES2-phys-h1.md` belongs to a different course (Physics, "Frontiers of physics") that reuses the module id; it was not reviewed here.
