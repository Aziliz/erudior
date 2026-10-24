# Round 2 notes: phys-m7 (Fluids and thermodynamics)

`content/math/check-module.sh physics phys-m7`: build and checker report zero problems (9 lessons, 138 questions, 27 drills).

## Honors lessons (3; the module is large and covers two subjects)
- `29h1-real-fluids.md`, `phys-m7-h-real-fluids`: "Real fluids: viscosity, drag, and surface tension" (about 1,750 words, 45 min). Viscous force $F = \eta Av/d$, Poiseuille's law with the reason for $R^4$ and flow resistance, Reynolds number, Stokes's law and terminal speed, surface tension, drop/bubble pressure, capillary rise. 5 worked examples.
- `29h2-engine-cycles.md`, `phys-m7-h-engine-cycles`: "Engine cycles: Otto, Diesel, and the refrigerator" (about 1,650 words, 45 min). Step-by-step cycle tables, a rectangular cycle compared with Carnot, the Otto efficiency derived from $TV^{\gamma-1}$, knock, the Diesel cycle (qualitative), the vapor-compression refrigerator. 4 worked examples.
- `29h3-radiation-balance.md`, `phys-m7-h-radiation-balance`: "Insulation, radiation, and a planet's temperature" (about 1,500 words, 45 min). Thermal resistance in series (R-values), net radiation, solar constant, planetary equilibrium temperature (Earth, Mars), the one-layer greenhouse model, labeled as a simplified teaching model. 4 worked examples.

## Core lessons (additions only)
- 24: hydraulic-lift SVG; Mermaid "sink or float" decision chart.
- 25: Venturi-tube SVG; Mermaid procedure for pipe-flow problems.
- 26: Mermaid calorimetry plan (with the phase-change check); heat-transfer SVG (pot on a burner).
- 27: Mermaid "which gas law" chart; isotherm plot.
- 28: piston-cylinder SVG (Q in, W out); Mermaid "identify the process" chart.
- 29: engine/refrigerator energy-flow SVG; Mermaid Carnot-cycle loop.

## Questions (`questions/r2-phys-m7.yaml`, 72)
- Core q01–q30 (5 per lesson): 5 label, 7 text, 6 order, 6 match, 6 select-all (every lesson has a text, an order or match, a select-all, and a label question on its new picture; lesson 27's label slot is a second text). Module quiz: 2 per lesson (q02, q04, q07, q09, q13, q14, q16, q18, q22, q23, q27, q28).
- Honors h01–h42 (14 per lesson): 25 multiple choice, 4 text, 4 order, 3 match, 4 select-all, 2 label; 5–7 new-type questions per honors lesson. Honors questions are not marked module_quiz.

## Pictures and diagrams
SVGs (all original): `phys-m7-hydraulic`, `-venturi`, `-heat-transfer`, `-piston`, `-capillary`, `-fridge-loop` (each with a `-blank` copy for a label question), `phys-m7-engine` (engine and refrigerator; `-engine-blank` shows the engine panel only), `phys-m7-energy-balance`. Mermaid: 7 (6 core, 1 honors: four strokes). Plots: isotherms (27), laminar profile (29h1), Otto PV cycle (29h2). Every SVG and Mermaid diagram was previewed; markers sit on their parts.

## Drills (`drills/r2-phys-m7.yaml`, 8)
`phys-m7-r2-poiseuille`, `-stokes`, `-capillary` (29h1); `-rect-cycle`, `-otto` (29h2); `-wall`, `-net-radiation`, `-eq-temp` (29h3). All ask for 3 significant figures and accept answers within 1%. Input ranges keep the needle flow laminar (Re below about 1,900) and the Stokes droplets at Re below 0.5.

## Glossary and cards
- `glossary-r2-phys-m7.yaml`: 22 terms (laminar flow, turbulent flow, Reynolds number, Poiseuille's law, surface tension, capillary action, meniscus, contact angle, four-stroke engine, Otto cycle, compression ratio, engine knock, Diesel cycle, vapor-compression cycle, refrigerant, thermal resistance, emissivity, solar constant, albedo, equilibrium temperature, greenhouse gas, greenhouse effect). Checked against every glossary file in the course: no duplicate terms or aliases. "Stokes's law" (bolded in 29h1) is defined by the phys-m8 writer's `glossary-r2-phys-m8.yaml` (Millikan), added at the same time, so I removed my duplicate entry; their definition fits 29h1.
- `cards-r2-phys-m7.yaml`: 26 cards (9 / 9 / 8 per honors lesson).

## For the reviewer
- Approximate values, given as approximate in the text: viscosities (blood, olive oil, honey), Reynolds-number thresholds (about 2000/4000), mercury contact angle about 140°, compression ratios (gasoline about 9–14, diesel about 15–22), diesel autoignition about 200–250°C, real engine efficiency 30–40%, Mars average about 210 K, Venus surface about 735 K.
- The one-layer greenhouse model (303 K) is labeled as a simplification that overestimates the real 288 K.
- Example 2 of 29h1 (needle) ignores entrance effects; it says so.
- All numbers were recomputed in Python.

## Errors found in existing content
None.

## Sources
Standard results (Poiseuille, Stokes, Jurin capillary rise, Otto efficiency, Stefan–Boltzmann energy balance); NIST/CODATA value of σ; solar constant about 1361 W/m² (Kopp & Lean 2011); Earth's Bond albedo about 0.30 and mean surface temperature about 288 K, Mars albedo about 0.25 (NASA planetary fact sheets); OpenStax College Physics chapters on fluids and heat transfer for typical property values.
