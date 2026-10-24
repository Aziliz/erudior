# Round 2 review: phys-m4 (Energy and momentum), University Physics I

Reviewer for item 137. Scope: honors lessons 14h1–14h3, round 2 additions to core lessons 11–14,
`questions/r2-phys-m4.yaml` (62), `drills/r2-phys-m4.yaml` (7), `glossary-r2-phys-m4.yaml` (14),
`cards-r2-phys-m4.yaml` (28), `images/phys-m4-*` (15 SVGs). After my fixes,
`content/math/check-module.sh university-physics-1 phys-m4` reports zero problems (7 lessons, 108 questions,
20 drills, 50 cards).

## Changes

### Answer key
- **phys-m4-r2-h22** (falling chain): the explanation said distractor 117.6 N "counts the flux twice", but
  weight + 2 × flux = 29.4 + 117.6 = 147 N; 117.6 N matched no stated mistake. Changed the choice to 147 N
  and the explanation to "doubles the flux (29.4 + 2 × 58.8), as if each link bounced back up". Correct
  answer (88.2 N, index 3) unchanged.

### Factual
- **14h3, "The largest deflection angle", history paragraph**: said "Around 1909–1911 … about 1 alpha particle
  in 8000 bounced off a thin metal foil" and that electrons "could never do that, however many there were along
  the path". The 1-in-8000 figure is Geiger and Marsden's 1909 result for a **platinum** reflector ("of the
  incident α-particles about 1 in 8000 was reflected", Proc. R. Soc. A 82, 495 (1909); text at
  chemteam.info/Chem-History/GM-1909.html); the same paper found thin gold foil also turned some back. And many
  random small deflections can in principle add up, so "however many" overstated it. Rewritten: 1909, platinum
  sheet, even thin gold foil turned some back; each electron collision deflects by at most 0.008°, and a thin foil
  gives far too few for random tiny deflections to add up to a reversal.
- **14h1, first vector-field plot caption**: "a trip around any loop gains work" is false for clockwise trips
  (the work is −2 × area). Now "a counterclockwise trip around any loop gains work".
- **glossary "moderator"**: "so they can cause further fission" implied fast neutrons can't; now "so that in a
  thermal reactor they are much more likely to cause further fission".

### Pictures
- **phys-m4-velocity-circle.svg**: the "lab velocity after" label touched the red arrow. Moved it up and left
  (x 150, y 128), clear of the arrow. The blank copy has no text, so its markers are unaffected.
- **phys-m4-energy-diagram.svg**: the "unstable equilibrium" label sat on the U(x) curve to the right of the
  hump (the white text halo hid part of the curve). Moved it above the hump (y 232). The blank copy is unaffected.

### Plots (other fixes)
- **13, Example 5 force pulse**: the "average 0.667 kN" curve label sat on the force curve near t = 8 ms.
  Replaced it with a free label at (5, 0.58), under the dashed line inside the shaded area.
- **14, elastic-collision velocity plot**: the "equal masses" point label overlapped the projectile curve. Moved it
  to a free label at (2.1, −0.45), below the axis.
- **14h1, F₂ = (−y, x) vector field**: arrows at the ±2.4 grid edge ran out of the plot box. Widened the range to
  [−3, 3]; all arrows now sit inside.
- **14h2, rocket speed plot**: the "rising against gravity" curve label sat on the "no gravity" curve. Replaced both
  curve labels with free labels: "no gravity" at (103, 3.1) above the upper curve and "rising against gravity" at
  (128, 0.5) below the lower one.
- **14h3, energy-transfer plot**: "equal masses: all of it" touched the curve near m₁/m₂ = 1.7. Moved to (4.6, 0.98).

## Checked and found right (a reader might doubt these)
- Every question worked before reading the key; all 62 keys are correct, and every distractor matches the mistake its
  explanation names (h22 was the one exception above). Includes h02 loop work 2π(1.5)² = 14.1 J, h03 1/3 J
  (2/3 J from ∫x dy), h16 2000 ln 3 − 980 = 1217 ≈ 1220 m/s and 353 m/s from u(1 − 1/3) − gt, h20 70.7 N (283 N =
  4×, diameter as radius), h31 7.68 J, h35 sin⁻¹(1/3) = 19.47° (18.4° tan, 70.5° cos), h36 (11/13)² = 0.716.
- Order questions (q07, q13, h12, h26, h40) each have one order only. Select-all q03, q09, q14, q19, h11, h25, h39:
  every keyed answer right, every other clearly wrong (q19: carts that collide must have v_rel ≠ 0, so some KE is
  always lost; h25: a faster burn of the same propellant shortens t_b, so the gravity loss falls).
- 14h1 Example 3: released from rest at (1.0, 0.50) with ω_y = 2ω_x, x = cos ωt, y = 0.5 cos 2ωt, so the puck does
  pass through (0, −0.50), moving at √8 = 2.83 m/s along the parabola y = x² − 0.5. The force (−4, −8) N is
  perpendicular to the ellipse at P (checked in the SVG: P at (1.0, 0.507) m in picture coordinates, arrow slope 2:1).
- Green's theorem check (loop work 2 J = curl 2 × area 1 m², counterclockwise loop), Example 2 W = 14 J
  (also by line integral along (t, 2t, 3t)).
- 14h2: Example 1 (thrust 3.0 MN, a = 5.2 m/s², 3000 ln 4 − 1470 = 2689 m/s), fire hose 125.7 N, conveyor half-heat
  argument, Pelton optimum V = v/2 with power ½ρAv³ (with a wheel the whole jet's mass flow ρAv is intercepted, so
  the force 2ρAv(v − V) is right), chain 3λgy. "Real chains sometimes somewhat larger" matches Hamm & Géminard,
  Am. J. Phys. 78, 828 (2010), who found the falling part falls faster than g.
- 14h3: Example 1 (36 = 12 + 24 J, 18 J lost, v = 0 and 3.0 m/s), transfer fractions 1, 0.889, 0.284, 0.0167,
  n = 54.5, isotropic average 2A/(1 + A)² = half the head-on value (standard (1 − α)/2 result), ~115 collisions in
  carbon and ~18 in hydrogen (ln(2 MeV/0.025 eV)/ξ with ξ_C = 0.158, ξ_H = 1), m_α/m_e ≈ 7294,
  sin⁻¹(1/7300) = 0.00785°, sin⁻¹(1/4) = 14.48°. Velocity-circle SVG is drawn to scale for m₁ = 2m₂ (radius half
  of OC, tangent at 30°, incoming arrow = OC + radius).
- SVGs to scale: raft (95 px/m; raft 1.33 m, person 2.67 m; CM line at the computed position in both scenes),
  momentum triangle (ratio 1.18 vs 21 600/18 000 = 1.2), equipotential ellipses (semi-axes for U = 1, 2, 4, 6 J
  correct at 150 px/m). All 7 label questions rendered with their markers: each marker sits on the part its label
  names.
- All 7 Mermaid diagrams rendered: readable, accTitle/accDescr describe the whole diagram.
- Drills: 400 instances each (2,800) from the app's own generator with a seeded random source. I recomputed every
  answer in Python from the prompt text alone (numerical line integral for path-work, finite-difference gradient,
  rocket from the stated masses, restitution solved from momentum + restitution directly, transfer from the elastic
  velocities), rounded to the precision the prompt asks for: all accepted by `checkAll`; perturbed wrong answers all
  rejected. No unfilled placeholders, "+ -", "1x" or comma groups in prompts or solutions.
- Glossary: no term or alias duplicates any glossary*.yaml in the course. Cards agree with the lessons.

## Overlap
- 14h3 extends core lesson 14's short "Going further: the center-of-mass frame" section (intended, not a duplicate).
- phys-h1 lesson 92 uses reduced mass and central forces for the Kepler problem and relies on this module's glossary
  entries; lesson 93 uses the rocket equation for delta-v budgets. Different purpose; no repeated teaching.

## Left uncertain
- "Real Pelton wheels reach roughly 90%" and "roughly 115 collisions in carbon" are standard textbook figures I
  did not check against a primary source.
- In the two vector-field plots some arrows cross the axis tick numbers (the app places field arrows on a fixed
  grid); still readable.

## Sources
Geiger & Marsden, "On a diffuse reflection of the α-particles", Proc. R. Soc. A 82 (1909) 495
(https://www.chemteam.info/Chem-History/GM-1909.html); OpenStax University Physics Vol. 1 ch. 7–9;
Hamm & Géminard, Am. J. Phys. 78 (2010); standard reactor-physics values for the log-energy decrement ξ.
