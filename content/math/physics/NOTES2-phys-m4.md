# Round 2 notes: module phys-m4 (Energy and momentum)

`content/math/check-module.sh physics m4`: build and checker report zero problems
(6 lessons, 95 questions, 17 drills, 39 cards).

## Added

**Honors lessons** (honors: true, module phys-m4, 45 min each)
- `lessons/14h1-rockets.md` (phys-m4-h-rockets, "Honors: Rockets and variable-mass systems",
  about 2,200 words): thrust $T = uR$ from momentum, liftoff and $a = T/m - g$, the rocket
  equation built up by summing $u\,\Delta m/m$ over 6/60/600 steps (table converging to
  $u\ln(m_0/m_f)$), mass ratio and delta-v, why orbit needs ~93% propellant, staging, rain
  into a rail car, sand leaking from a car (no speed change), sand onto a conveyor (force $Rv$,
  power $Rv^2$, half becomes heat), ion engines. Five worked examples.
- `lessons/14h2-restitution.md` (phys-m4-h-restitution, "Honors: Restitution, bouncing, and
  gravity assists", about 1,900 words): general 1D collision with restitution $e$ (labeled an
  approximate empirical model; Newton's Principia experiments), CM frame and
  $K_{\text{lost}} = (1 - e^2)K_{\text{rel}}$ with reduced mass, bouncing ball (height ratio
  $e^2$, finite total distance and time, ITF tennis-ball rebound test), light ball off a moving
  heavy wall (bat estimate, labeled an overestimate), gravity assists as elastic collisions
  (head-on $v + 2U$ labeled an upper limit; Voyager 2; Jupiter's tiny recoil). Five worked
  examples.

**Core lessons 11–14** (additions only; nothing rewritten)
- 11: sled forces SVG (after Example 1) with an intro sentence; new short section "Choosing a
  method" with a Mermaid chart (Newton's laws vs work–energy).
- 12: energy bar chart SVG for a frictionless track (after Example 1, with a short paragraph that
  bolds **energy bar chart**); Mermaid "steps for an energy problem".
- 13: labeled force–time graph SVG before "Conservation of momentum"; Mermaid "is momentum
  conserved?" decision chart before Example 2.
- 14: Mermaid collision classification chart; ballistic pendulum SVG in Example 2; momentum
  vector-triangle SVG in Example 4.

**Pictures** (13 original SVGs, all 1.5–8 KB, rendered and checked, markers checked on the
blanks): m4-sled-forces(+blank), m4-energy-track(+blank), m4-impulse-graph(+blank),
m4-ballistic-pendulum(+blank), m4-intersection, m4-rocket(+blank), m4-gravity-assist(+blank).
**Plots**: Δv/u against mass ratio (rockets), bouncing-ball height against time for e = 0.8
(restitution). **Mermaid**: 5 (four core, one staging chart in the rockets lesson), all with
accTitle/accDescr, rendered.

**Questions** (49, `questions/r2-phys-m4.yaml`)
- Core phys-m4-r2-q01…q20 (5 per lesson; each lesson has a label, a text, a match or order and a
  select-all): label 4 (q01, q06, q11, q16), text 4 (q03, q08, q12, q19), order 4 (q04, q07, q15,
  q17), match 4 (q05, q10, q14, q18), select-all 4 (q02, q09, q13, q20).
  module_quiz: q02, q08, q12, q17, q20.
- Honors phys-m4-r2-h01…h15 (rockets: 8 MC, 2 text, 1 select-all, 1 order, 1 match, 1 label)
  and h16…h29 (restitution: 9 MC, 1 text, 1 select-all, 1 order, 1 match, 1 label). No
  module_quiz (core-module honors lessons).
- MC answer positions (18): 0: 5, 1: 4, 2: 4, 3: 5.

**Drills** (5, `drills/r2-phys-m4.yaml`): phys-m4-r2-thrust, phys-m4-r2-rocket-eq,
phys-m4-r2-conveyor (rockets lesson); phys-m4-r2-restitution, phys-m4-r2-bounce (restitution
lesson). 3 s.f. answers use relTolerance 0.01; the 2-decimal velocities use tolerance 0.011.

**Glossary** (12, `glossary-r2-phys-m4.yaml`, checked against every glossary*.yaml in the
course): energy bar chart, thrust, mass flow rate, exhaust speed, rocket equation, mass ratio,
delta-v, staging, center-of-mass frame, relative kinetic energy, reduced mass, gravity assist.

**Cards** (19, `cards-r2-phys-m4.yaml`): 10 rockets, 9 restitution.

## For the reviewer
- Every number recomputed in Python (thrust/acceleration, step sums 1691/1991 → 1833 m/s,
  e^(9.4/3.5) = 14.7, staging 4830 vs 6259 m/s, conveyor 100 N/250 W/125 W, rain car 2.73 m/s,
  restitution 0.40/2.4 m/s and 7.2 J both ways, bounce 4.56 m and 4.07 s, ITF e = 0.73–0.76,
  Jupiter Δv ≈ 2×10⁻²⁰ m/s).
- Rockets lesson simplifications are labeled: nozzle pressure thrust omitted; "9 to 10 km/s" to
  orbit and "2.5 to 4.5 km/s" chemical exhaust speeds are round figures.
- Possible overlap: if the phys-m5 (gravitation) or phys-h1 writer covers rockets or gravity
  assists, check for duplication. I kept orbital mechanics out.
- The bat example (65 m/s) is explicitly an overestimate from a heavy-bat model.
- Glossary alias "bar chart" for energy bar chart is generic; fine in this course today.

## Errors found in existing content
None.

## Sources
- Tsiolkovsky rocket equation history (Moore 1810/1813, Tsiolkovsky 1903, Goddard, Oberth):
  https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation
- ITF tennis-ball rebound test (254 cm drop, 135–147 cm rebound):
  https://en.wikipedia.org/wiki/Tennis_ball and the ITF technical booklet
  (https://www.itftennis.com/media/4420/2023-technical-booklet.pdf)
- Standard facts (Voyager 2 1977 launch and flybys through Neptune 1989; Newton's Principia
  impact experiments; Jupiter orbital speed about 13.1 km/s, mass about 1.9×10²⁷ kg) from
  general knowledge.
