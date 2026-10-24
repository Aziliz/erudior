# NOTES2-phys-m2: Round 2 for Kinematics (University Physics I)

`content/math/check-module.sh university-physics-1 phys-m2`: build and checker report **zero problems** (6 lessons, 90 questions, 15 drills, 37 cards).

## Honors lessons (both `honors: true`, module `phys-m2`)

| File | Id | Title | Min | Prose words* | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|---|
| 06h1-aiming-projectiles.md | phys-m2-h-aiming | Aiming a projectile: targets, slopes and the safety parabola | 45 | ~1,630 | 3 (firefighter: two angles to a window; minimum speed to a ledge; throw up a 20° slope) | Mermaid "can I hit it?" flowchart; plot of five 20 m/s trajectories and the safety parabola; phys-m2-slope-launch.svg | launch-angles, min-speed, incline-range |
| 06h2-curved-paths.md | phys-m2-h-curved-paths | Curved paths: tangential and normal acceleration | 45 | ~1,470 | 4 (a_t, a_n, ρ for the core lesson's r(t) at t = 1 s; projectile ρ at top and launch; car on a curve; arc length) | phys-m2-osculating.svg; Mermaid procedure; plot of the path with its osculating circle | tn-accel, proj-curvature |

*Prose only; with display math, Mermaid and plot source the files are ~1,980 and ~1,750 words.

Content: h1 derives the quadratic in tan θ for hitting a target, the safety parabola (envelope), the minimum launch speed v0² = g(y + d) with the 45° + α/2 bisector rule, and range along a slope L = 2v0² cos θ sin(θ − α)/(g cos² α) with maximum v0²/[g(1 + sin α)], showing why the two "45° + α/2" results coincide; short history note (Galileo, *Two New Sciences*, 1638). Air resistance is explicitly labeled as neglected (a simplification) in the intro, history note and key points. h2 derives a = (dv/dt)T̂ + (v²/ρ)N̂ from T̂·T̂ = 1 and dφ = ds/ρ, the vector formulas a_t = a·v/v, a_n = |vx ay − vy ax|/v, ρ = v³/|vx ay − vy ax|, the projectile result ρ = v³/(g vx) (sharpest bend at the top), d|v|/dt vs |dv/dt|, and arc length. It does not use polar coordinates (left for the phys-h1 honors module on analytical mechanics and orbits).

## Core lesson additions (additions only, no existing text changed)

- 03-motion-1d: Mermaid (slope/area links between x–t, v–t, a–t graphs); phys-m2-vt-segments.svg (v–t graph with the four kinds of motion labeled), with one introducing sentence each.
- 04-constant-acceleration: plot of the v–t area split into rectangle v0t and triangle ½at² (beside the derivation of equation 2); Mermaid "which equation" decision chart; phys-m2-roof-throw.svg (Example 2's four key points and velocities).
- 05-projectiles: phys-m2-projectile-parts.svg (velocity and components on the way up, at the top, on the way down; g; H; R); Mermaid projectile-solving procedure.
- 06-motion-2d: phys-m2-curve-accel.svg (car braking on a curve: velocity, tangential and radial components, total acceleration); Mermaid river-crossing heading chart.

## Questions (`questions/r2-phys-m2.yaml`, 49)

- Core (phys-m2-r2-q01–q20, 5 per lesson, all new types): 7 text, 3 match, 2 order, 4 select-all, 4 label (vt-segments, roof-throw, projectile-parts, curve-accel). `module_quiz: true` on 8 (2 per lesson).
- Honors h1 (h01–h15): 9 MC (answer positions 0/1/2/3 = 2/2/3/2), 2 text, 1 select-all, 1 order, 1 match, 1 label (slope-launch). 6 of 15 new types.
- Honors h2 (h16–h29): 8 MC (positions 2/2/2/2), 1 text, 2 select-all, 1 order, 1 match, 1 label (osculating). 6 of 14 new types.

## Pictures (6 pairs, 12 SVG files, all under 6 KB, original, previewed with markers)

phys-m2-vt-segments(-blank), phys-m2-roof-throw(-blank), phys-m2-projectile-parts(-blank), phys-m2-curve-accel(-blank), phys-m2-slope-launch(-blank), phys-m2-osculating(-blank). Labeled versions are in the lessons; blank versions are used by the label questions.

## Drills (`drills/r2-phys-m2.yaml`, 5)

phys-m2-r2-launch-angles (both angles, nearest 0.1°, tolerance 0.1°; discriminant kept ≥ 0.1x² so the angles are well separated), phys-m2-r2-min-speed (3 s.f. + angle), phys-m2-r2-incline-range (L at a given angle and L_max), phys-m2-r2-tn-accel (a_t, a_n, ρ from r(t) = (pt², qt + ct³); |a_t| and a_n ≥ 0.5 so the 1% tolerance is meaningful), phys-m2-r2-proj-curvature (ρ at launch and top). Formulas re-checked in Python on 2,000 random instances (trajectory passes through the target; minimum-speed point lies on the safety parabola; a_t² + a_n² = a²).

## Glossary and cards

- `glossary-r2-phys-m2.yaml`: 9 terms (trajectory equation, safety parabola, unit tangent vector, unit normal vector, osculating circle, radius of curvature, curvature, normal acceleration, arc length); terms and aliases checked against every glossary*.yaml in the course: no duplicates. "Normal acceleration" notes it is also called radial/centripetal acceleration (existing terms radial acceleration and centripetal acceleration are kept as they are).
- `cards-r2-phys-m2.yaml`: 20 cards (10 per honors lesson; topics Projectile targeting, Projectiles on slopes, Curvilinear motion).

## For a reviewer to double-check

- Every number recomputed in Python: Example 1 (k = 11.025, angles 36.1° and 63.3°, times 1.86 s and 3.34 s, safety parabola 9.38 m at x = 30 m); Example 2 (12.8 m/s, 54.2°); Example 3 (13.6 m, 55°, 17.1 m; level 23.0 m; downhill 34.9 m); h2 Example 1 (v = 7.81, a_t = 0.768, a_n = 8.45, ρ = 7.22 m; osculating-circle center (7.62, 1.45) in the plot); Example 2 (22.2 m, 40.4 m, −5.62 m/s²); Example 3 (5.22 m/s², 73.3°); Example 4 (3.66 m vs 3.61 m). All question keys and distractors recomputed (e.g. h08: 7.73 m correct; 7.47 m = L cos α; 7.22 m without cos² α; 10.2 m level range).
- h03 hinges on a close call: (18 m, 2 m) is just above the 14 m/s safety parabola (1.9 m there). Intended, and the explanation shows the numbers.
- Galileo attribution (parabolic path; equal ranges for elevations equally above and below 45°): *Two New Sciences*, 1638, Fourth Day. Kept general; no claim about earlier gunners beyond "tabulated ranges by experience".
- The lesson 04 plot uses `shade` between f and g = 4 plus an outlined rectangle polygon; renders correctly.
- In the roof-throw picture the up and down legs are drawn side by side (stated in the caption and alt text); the ball actually moves on one vertical line.

## Errors found in existing content

None. All worked examples in lessons 03–06 were re-checked while writing (e.g. lesson 05 Example 1 impact angle 58°, lesson 06 Example 1 turning angle 39°); no question, drill, card or glossary entry was edited.

## Sources

- OpenStax *University Physics* Vol. 1, ch. 4 (motion in two and three dimensions; projectile motion; tangential and normal components of acceleration) for standard results and notation.
- Galileo Galilei, *Dialogues Concerning Two New Sciences* (1638), Fourth Day (projectile parabola; equal ranges about 45°).
- Standard results derived in the lessons themselves: envelope of projectile trajectories (safety parabola), minimum-speed and slope-range maxima, curvature formula ρ = v³/|v × a|.
