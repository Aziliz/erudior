# Round 2 notes: phys-m5 (Rotation and gravitation)

## Honors lessons (3; the module has 6 core lessons spanning rotation, structures and gravitation)
- `20h1-rolling-dynamics.md`, `phys-m5-h-rolling-dynamics`: "Honors: Rolling with friction, angular impulse and precession". Friction force and minimum mu_s for rolling; bowling ball skid-to-roll (force method and angular momentum about a lane point, v0/(1+c), energy lost c/(1+c)); angular impulse and the center of percussion (2L/3); quantitative precession Omega = tau/L (labeled a fast-spin simplification). 4 worked examples, plot, gyroscope SVG.
- `20h2-structures.md`, `phys-m5-h-structures`: "Honors: Trusses, ladders and tipping". Two-force members, method of joints (Mermaid procedure), A-frame and a 7-member Warren truss (SVG), ladder minimum angle tan(theta) >= 1/(2 mu_s) and climber limit, tip vs slide on a ramp (w/h vs mu_s) and when pushed (w/(2H) vs mu_s). Idealizations stated.
- `20h3-orbital-mechanics.md`, `phys-m5-h-orbits`: "Honors: Elliptical orbits, transfers and weighing the heavens". r_p v_p = r_a v_a, algebraic derivation of E = -GMm/(2a), vis-viva, Hohmann transfer (LEO to GEO numbers, Earth-Mars 8.5 months; coplanar simplification stated), M = 4 pi^2 a^3/(G T^2), Io/Jupiter, binary stars (Sirius), S2 and Sgr A*.

## Core lesson additions (additions only)
- 15: rotating-disk SVG (theta, s, r, v, a_c); Mermaid "which constant-alpha equation".
- 16: Mermaid procedure for a pulley with mass; windlass SVG (forces) in Example 3.
- 17: rolling-velocities SVG + two sentences (instantaneous rotation about the contact point, front point at sqrt2 v); Mermaid "which quantities are conserved".
- 18: Mermaid equilibrium procedure; ladder free-body SVG.
- 19: deformations SVG (tension/shear/bulk); Mermaid "which modulus".
- 20: orbit SVG (focus, perihelion, aphelion, semimajor axis, equal-area sectors computed with Kepler's equation, e = 0.78); Mermaid "which gravity formula" (end of the potential energy section).

## Questions (`questions/r2-phys-m5.yaml`, 73)
- Core q01-q31 (5-6 per lesson): text 11, match 6, order 4, select-all 6, label 6 (disk, windlass, rolling wheel, ladder, deformations, orbit). module_quiz on 7.
- Honors h01-h42 (14 per lesson): MC 22, text 9, select-all 4, order 3, match 3, label 1 (Hohmann). No module_quiz (honors in a core module).

## Drills (`drills/r2-phys-m5.yaml`, 9)
roll-friction, bowling, precession (h1); aframe, ladder, tip-slide (h2); ellipse-speeds, hohmann, orbit-mass (h3). All ids `phys-m5-r2-*`, 3 s.f. with relTolerance 0.01.

## Pictures (images/, all original SVG)
phys-m5-rotating-disk, -windlass, -rolling-velocities, -ladder, -deformations, -orbit, -hohmann (each with a -blank copy for its label question), phys-m5-gyroscope, phys-m5-warren-truss.

## Glossary / cards
- `glossary-r2-phys-m5.yaml` (13): angular impulse, center of percussion, precession angular speed, truss, two-force member, compression, periapsis (aliases perigee, perihelion), apoapsis (apogee, aphelion), semimajor axis, orbital energy, vis-viva equation, Hohmann transfer, transfer orbit. "delta-v" is bolded in h3 but already defined in glossary-r2-phys-m4.yaml, so not redefined.
- `cards-r2-phys-m5.yaml` (25): 9 / 8 / 8 for the three honors lessons.

## For reviewers
- All numbers recomputed in Python (g = 9.8, G = 6.67e-11, GM_E = 3.98e14). Check: bowling example uses a hypothetical mu_k = 0.10; Sirius a = 19.8 AU, T = 50.1 yr (masses ~2.1 + 1.0); S2 a ~1000 AU, T ~16 yr, ~4e6 solar masses (fits give ~4.3e6; 2020 Nobel); Hohmann "usually cheapest below about 12 times r1" (bi-elliptic threshold 11.94).
- The rolling-body angular momentum L = M v R + I_cm omega is stated without proof (said so in the lesson).
- Bolded "tension" in h2 links to the existing rope-tension glossary entry; its definition fits loosely.
- Possible overlap: if other writers (phys-m3/m4/h1) add perigee/aphelion-type glossary terms later, duplicates should be resolved.

## Errors found in existing content
None.

## Sources
Standard mechanics (OpenStax University Physics Vol. 1 ch. 10-13 for comparison of rolling, equilibrium and orbit treatments); NASA/JPL fact sheets for Io, Europa and Jupiter; published Sirius and S2 orbital elements (Gravity Collaboration / Ghez group summaries); Hohmann (1925), Die Erreichbarkeit der Himmelskörper.
