# Round 2 notes: phys-m3 (Forces and Newton's laws)

## Honors lessons (honors: true, module phys-m3)
- `lessons/10h1-friction-systems.md`, id `phys-m3-h-friction-systems`, "Friction in systems of objects" (45 min): static friction as an unknown (assume no slip, then check against μs n), impending motion, stacked blocks (friction that drives; slipping case), ramp block tied over a pulley to a hanging mass (direction of friction, range of masses at rest), banked curves with friction (v_max and v_min derived, limiting-case checks, no minimum when μs ≥ tan θ), friction that drives a car (labeled as simplified). 3 worked examples, Mermaid "does it slip?" chart, stacked-blocks SVG.
- `lessons/10h2-accelerating-frames.md`, id `phys-m3-h-accelerating-frames`, "Accelerating frames and fictitious forces" (45 min): non-inertial frames, a' = a − A, fictitious force −mA, effective gravity, pendulum accelerometer (both frames), dropped ball in an elevator, centrifugal force and artificial gravity, Earth's rotation (ω²R ≈ 0.034 m/s²), Coriolis force (qualitative plus 2mωv, 2ωv sin φ estimate; not sink drains). 3 worked examples, Mermaid "choose a frame" chart, car-pendulum and space-station SVGs.

## Core lesson additions (additions only)
- 07: third-law exploded-view SVG (book/table/Earth) with an intro sentence; Mermaid chart of the second-law solving procedure.
- 08: plot of friction vs applied force (static rises to μs n, drops to μk n); Mermaid "static or kinetic?" decision chart; SVG of the incline showing why the weight makes angle θ with the into-slope axis.
- 09: SVG of the table block and hanging block with all six forces; SVG of a movable pulley (2T = W, rope counting).
- 10: Mermaid "what supplies the centripetal force"; banked-curve force SVG; vertical-loop top/bottom SVG.

## Questions (`questions/r2-phys-m3.yaml`, 46)
- Core q01–q20 (5 per lesson): 4 text, 4 order, 4 match, 4 select-all, 4 label; module_quiz on q01, q04, q07, q10, q11, q14, q17 (1–2 per lesson).
- Honors h01–h13 (lesson 10h1): 7 multiple choice, 2 text, 1 select-all, 1 order, 1 match, 1 label.
- Honors h14–h26 (lesson 10h2): 7 multiple choice, 2 text, 1 select-all, 1 order, 1 match, 1 label.
- Honors questions have no module_quiz flags.

## Drills (`drills/r2-phys-m3.yaml`, 5)
phys-m3-r2-stacked-blocks, phys-m3-r2-incline-pulley, phys-m3-r2-banked-range (10h1); phys-m3-r2-car-pendulum, phys-m3-r2-space-station (10h2). All "3 significant figures" with relTolerance 0.01.

## Pictures (`images/`, all original, generated from one script, previewed)
phys-m3-third-law(+blank), phys-m3-incline(+blank), phys-m3-table-pulley(+blank), phys-m3-movable-pulley, phys-m3-banked(+blank), phys-m3-loop, phys-m3-stacked(+blank), phys-m3-car-pendulum(+blank), phys-m3-space-station. 6 Mermaid diagrams (07, 08, 10, 10h1, 10h2) and 1 plot (08). All previewed; label markers checked so they don't hide arrowheads.

## Glossary and cards
- `glossary-r2-phys-m3.yaml` (7): impending motion, design speed, fictitious force, non-inertial frame, effective gravity, centrifugal force, Coriolis force (none existed in any physics glossary file when checked).
- `cards-r2-phys-m3.yaml` (17): 9 for 10h1 (topic Friction in systems), 8 for 10h2 (topic Accelerating frames).

## For a reviewer to double-check
- 10h2: "a few rpm" tolerance for rotating stations is hedged as uncertain; the claim that the equatorial bulge accounts for the rest of the pole–equator difference in g is simplified.
- 10h1 "Friction that drives a car" is labeled as a simplified model (max acceleration ≈ μs g for all-wheel drive).
- q02 / q12 / h10 order questions follow the lessons' own procedures; check that no two steps read as swappable.
- All numbers recomputed in Python (g = 9.8 m/s²).

## Errors found in existing content
None. No existing questions, drills, cards or glossary entries were edited.

## Check
`content/math/check-module.sh physics phys-m3`: 6 lessons, 90 questions, 17 drills, 37 cards: OK (zero problems).

## Sources
Standard mechanics (Newton's laws, friction model, banked-curve and rotating-frame results), derived and checked here. Earth's rotation rate 7.29 × 10⁻⁵ rad/s (sidereal day). Coriolis deflection direction and the sink-drain point are standard textbook results.
