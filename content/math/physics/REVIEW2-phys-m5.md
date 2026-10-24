# Round 2 review: phys-m5 (Rotation and gravitation)

Reviewed: honors lessons 20h1 (rolling dynamics), 20h2 (structures), 20h3 (orbital mechanics); round 2
additions to core lessons 15-20; `questions/r2-phys-m5.yaml` (73), `drills/r2-phys-m5.yaml` (9),
`glossary-r2-phys-m5.yaml` (13), `cards-r2-phys-m5.yaml` (25), the 16 `images/phys-m5-*` SVGs.
I worked every question before reading the key, recomputed every lesson number in Python, rendered
every SVG (label questions with their markers), every Mermaid diagram and every plot/shape block.
`content/math/check-module.sh physics phys-m5` reports OK after the fixes.

## Changes

### Answer key
- **phys-m5-r2-q18** (match, torque pivot): the distractor "The middle of the object" was also a correct
  answer for the seesaw row (the seesaw is pivoted at its center, so its pivot *is* its middle).
  Replaced it with "The top of the ladder" (clearly wrong for every row: about the ladder top the wall
  force you want drops out) and added a sentence to the explanation.

### Facts
- **20h2, Example 4 (refrigerator)**: the parenthetical said a fridge with its compressor at the bottom has
  a lower center of gravity and "is a little harder to tip". For a horizontal push the tipping force
  $F = mg\,(w/2)/H$ depends on the horizontal distance from the center of gravity to the tipping edge, not
  on its height. Rewrote the parenthetical to say that, and to note that height matters on a tilted
  surface (the ramp case).
- **20h3, vis-viva**: "an old name for kinetic energy" is loose; *vis viva* (Leibniz) was $mv^2$. Now:
  "Latin for 'living force,' an old name for $mv^2$, twice what we now call kinetic energy."
- **phys-m5-r2-h14 explanation**: claimed $\Omega = \tau/L$ "works for any axle angle". For a tilted axle
  $\Omega = \tau/(L\sin\phi)$; it is $Mgr/(I\omega)$ that is angle-independent. Rewrote the explanation
  (key unchanged: fast spin and ignoring nutation are the assumptions; "axle straight up" is wrong
  because then gravity has no torque).
- **Lesson 17, Mermaid "which quantities are conserved"**: the energy question was reached only on the
  "angular momentum conserved" branch, which implied energy is never considered when there is an
  external torque, though the lesson's main example (rolling down a ramp: friction torque about the
  center, mechanical energy conserved) is exactly that case. Both branches now lead to the energy
  question; it also mentions a motor doing work; accDescr updated.

### Pictures and figures
- **phys-m5-rolling-velocities.svg**: the "0 (at rest)" label crossed the wheel's rim; moved below the
  ground at the contact point.
- **phys-m5-orbit.svg**: "perihelion" sat on the sector edge and the ellipse, "Sun (focus)" on the sector
  edge; both moved clear. (Equal-area sectors checked: polygon areas 5593 and 5581 px², equal to 0.2%;
  the drawn eccentricity is 0.83, not the 0.78 in the writer's notes; nothing depends on it.)
- **20h1 plot (bowling ball)**: the function labels "v (center)" and "Rω" were drawn on top of each other
  at the meeting point; replaced by free labels beside each line.
- **20h2 shape (A-frame)**: "12 kN" and both "6 kN" labels sat on their arrows; moved beside them.

### Other
- **Lesson 18, Ladders**: the new image was glued to the start of the existing paragraph (`...svg)A ladder`)
  with three blank lines above; separated into its own paragraph (text unchanged).
- **"Front bottom edge"** (20h2 push case, h26 explanation, tip-slide drill solution): the example pushes
  on the fridge/cabinet's *front face*, so "front bottom edge" pointed at the wrong edge. Now "the bottom
  edge on the far side from you (the edge it tips over)".
- **phys-m5-r2-h26**: distractor "47 N" matched no mistake; replaced with "735 N" (lever arms swapped,
  $mgH/(2w)$) and named in the explanation.
- **phys-m5-r2-h17**: explanation said 3.5 kN "halves the answer again"; now "is half the rafter force".
- **Drill phys-m5-r2-ladder**: could ask what friction the floor "must supply" at an angle where, with the
  given $\mu_s$, the ladder cannot stand (e.g. 50° with $\mu_s = 0.2$, minimum 68°). Added
  `where: ['th > thmin + 1']`.

## Checked and right (a reader might doubt)
- 20h1: Ex 1 (3.27 m/s², 6.53 N, μ ≥ 0.192, hoop needs 0.289); bowling $t_1 = 2.33$ s, 16.0 m, 5.71 m/s,
  224 → 160 J (also confirmed by a step-by-step simulation); angular momentum about a lane point (normal
  force and weight on the same vertical line); rod center of percussion 2L/3; Ex 3 ω = 6.25 rad/s,
  $J_p = -0.75$ N·s; gyroscope 0.43 rad/s, 14.6 s, Ω/ω ≈ 1.4%. Regulation lane foul line to head pin
  60 ft = 18.3 m.
- 20h2: Warren truss AB −17.3, AC +8.66, BC +17.3, BD −17.3 kN (BD also = M_C / h = 60/3.46); A-frame
  12 and 10.4 kN, 6.93 and 3.46 kN at 60°; ladder 51.3°, painter x = 3.66 m; tip at 21.8° vs slide 26.6°;
  fridge 397 N slide vs 257 N tip, H = 0.78 m.
- 20h3: Ex 1 v_p = 8.71, v_a = 4.35 km/s, T = 2.98 h; LEO→GEO 2.43 + 1.47 km/s (3.89 total from unrounded
  values), 5.3 h; Earth–Mars 8.5 months, windows ~26 months (synodic period 25.6 months); Io → 1.90×10²⁷ kg
  (≈319 Earth masses; NASA Jupiter fact sheet 1.898×10²⁷ kg); Europa 1.90×10²⁷ kg, Europa mass 4.80×10²² kg.
  Sirius A–B a ≈ 19.8 AU, P ≈ 50.1 yr, masses ≈ 2.06 + 1.02 M☉ (Bond et al. 2017, ApJ 840, 70);
  S2 a ≈ 1000 AU, P ≈ 16.0 yr, Sgr A* ≈ 4.3×10⁶ M☉ (GRAVITY Collaboration 2020; Ghez/Genzel, Nobel 2020);
  Hohmann 1925 (*Die Erreichbarkeit der Himmelskörper*); bi-elliptic beats Hohmann above r₂/r₁ ≈ 11.94
  ("usually ... below about 12").
- Core: 4:1 ladder rule = 76.0°; ISS gravity ≈ 88.5% of surface (q29 says "about 89%"); periods in q28;
  q07 torques 0, 7.8, 12.0, 15.0, 15.6 N·m (15.0 vs 15.6 close but distinct).
- All 73 keys and all 9 drill formulas recomputed; drill tolerances (relTolerance 0.01 against a 3 s.f.
  prompt, max rounding error 0.5%) accept correctly rounded answers. Unit factors (N→kN 0.001, m/s→km/s
  0.001, min→h 1/60, cm→m 0.01) correct.
- Pictures: directions consistent (windlass α clockwise with rope on the right; Hohmann orbits and
  transfer all counterclockwise; transfer ellipse semi-minor axis √(r₁r₂) as drawn; rolling arrows
  v : 2v : 1.41v in length; ladder weight at midpoint). All label markers sit on their parts.
- Glossary: no term or alias duplicates any `glossary*.yaml` in the course.

## Uncertain / notes
- 20h2 bolds **tension**, which links to the course's rope-tension entry ("a taut rope, string or cable");
  it fits loosely for a truss member. Left as is (shared glossary.yaml is not mine to edit).
- h07 (order, bowling stages): "Rω catches up with v" and "kinetic friction stops acting" happen at the
  same instant; the order given is the causal one and I think it is defensible, but a reviewer may prefer
  merging them.
- The gyroscope SVG draws the torque (into the page) as an oblique arrow; readable as perspective, and the
  alt text states its direction in words.
- Overlap: Sgr A* (4.3×10⁶ M☉) also appears in phys-h1's 90-gravity-spacetime (Schwarzschild radius), and
  92-cosmology weighs the Milky Way from an orbit. Values agree and the treatments are complementary
  (S2's orbit here vs horizon size / rotation curve there); no change. delta-v is defined by phys-m4
  (rockets), and this module correctly does not redefine it.

## Sources
OpenStax *University Physics* Vol. 1, ch. 10–13 (rolling, equilibrium, orbits, vis-viva); NASA GSFC planetary
fact sheets (Jupiter, Io, Europa); Bond et al. 2017 (Sirius B); GRAVITY Collaboration 2020, A&A 636, L5 (S2);
Nobel Prize in Physics 2020 press release; Hohmann 1925.
