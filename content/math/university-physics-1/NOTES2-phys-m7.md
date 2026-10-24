# Round 2 notes: module phys-m7 (Fluids and thermodynamics)

`content/math/check-module.sh university-physics-1 phys-m7`: build and checker report zero problems
(9 lessons, 131 questions, 26 drills, 58 cards).

## Honors lessons (3; the module has 6 core lessons spanning fluids and thermodynamics)
- `lessons/29h1-engine-cycles.md` (phys-m7-h-engine-cycles, "Real engine cycles: Otto, Diesel and Brayton", 45 min, ~1,700 words): why real engines don't run Carnot cycles, the air-standard model (labeled as a simplification), the Otto cycle with its efficiency derived from the adiabats, the four strokes, engine knock, the Diesel cycle with cutoff ratio, the Brayton cycle, and combined-cycle plants. Examples: Otto at r = 10 (60.2%, 754 K, 25 atm, 15.6 kJ/mol, compared with Carnot's 85%); Diesel at r = 18, r_c = 2 (63.2%); Brayton at r_p = 20 (57.5%, 706 K). Figures: Otto PV diagram (SVG), four-stroke Mermaid, plot of efficiency against r.
- `lessons/29h2-statistical-entropy.md` (phys-m7-h-statistical-entropy, "Counting microstates: the statistical meaning of entropy", 45 min, ~1,560 words): microstates, macrostates and multiplicity; coins (4 and 100); the statistical second law and small-system fluctuations; S = k ln Ω; 1/T = ∂S/∂E and why heat flows from hot to cold; the Einstein solid; the Boltzmann factor; the isothermal atmosphere (it reproduces lesson 24's 8.6 km scale height); the third law. Examples: free expansion by counting (5.76 J/K); two 3-oscillator Einstein solids sharing 6 quanta (28, 63, 90, 100, …; total 462); N₂ and He scale heights. Two bar charts.
- `lessons/29h3-viscous-flow.md` (phys-m7-h-viscous-flow, "Viscous flow, Stokes drag and the Reynolds number", 45 min, ~1,520 words): the viscosity definition and a table of values, no slip, Poiseuille's law derived (parabolic profile, average = ½ max), flow resistance, the Reynolds number with pipe thresholds (labeled approximate), Stokes' law, terminal speed, the falling-ball viscometer and quadratic drag. Examples: hypodermic needle at R = 0.20 and 0.10 mm (3.98 kPa / 0.31 N, then 64 kPa / 5.0 N); household pipe Re = 15,000; silt settling (0.36 mm/s, Re = 0.007, 46 min per meter); a sand grain where Stokes' law fails. Figures: pipe velocity-profile SVG and a Reynolds-number decision chart (Mermaid).

## Core lessons 24–29 (additions only; at most a sentence or two of lead-in)
- 24: hydraulic lift SVG, buoyancy pressure-forces SVG (with a short explanatory sentence), sink-or-float Mermaid.
- 25: Venturi tube SVG (with a lead-in), draining-tank h(t) plot.
- 26: heat-transfer scene SVG, calorimetry procedure Mermaid, Newton's-cooling plot.
- 27: kinetic-theory box SVG, "which gas law" Mermaid, isotherms plot.
- 28: piston/cylinder SVG (plus 2 sentences on signs), "which process" Mermaid, rectangular-cycle plot (one sentence computes its 600 J).
- 29: Carnot-steps Mermaid, Carnot PV plot, engine/refrigerator energy-flow SVG (with a lead-in).

## Pictures (17 SVGs, original, each under 5 KB, all rendered and checked; blanks were checked with markers)
phys-m7-hydraulic(+blank), -buoyancy, -venturi(+blank), -heat-transfer(+blank), -kinetic-box(+blank), -piston(+blank), -engine-fridge(+blank), -otto(+blank), -pipe-profile(+blank).
Diagrams: 7 Mermaid (5 core, 2 honors). Plots: 9 new (6 core, 3 honors).

## Questions (71, in questions/r2-phys-m7.yaml)
- Core phys-m7-r2-q01…q31 (5–6 per lesson; every lesson has a label, a text, a match or order, and a select-all question): label 6, text 7, match 4, order 3, select-all 5, MC 6. module_quiz: q01, q05, q06, q10, q11, q15, q18, q21, q22, q26, q27, q31.
- Honors phys-m7-r2-h01…h40 (engine cycles 14, statistical entropy 13, viscous flow 13): MC 23, text 6, label 2, match 3, order 3, select-all 4. No module_quiz (these are honors lessons in a core module).
- Positions of the correct answer across all 29 MC questions: 0: 7, 1: 8, 2: 7, 3: 7.

## Drills (7, in drills/r2-phys-m7.yaml)
phys-m7-r2-otto, -diesel-brayton, -free-expansion, -boltzmann-factor, -poiseuille, -reynolds, -stokes. Checked by generating 600 instances each against an independent solver: the 3 s.f. answers are all accepted, answers 5% off are rejected, and there are no unfilled placeholders and no comma-grouped numbers in math. Poiseuille is restricted to Q ≥ 0.01 mL/s and Re < 1500; Stokes to Re < 0.5.

## Glossary and cards
- glossary-r2-phys-m7.yaml: 30 terms, every one bolded in the honors lessons. Checked against every glossary*.yaml in the course: no duplicates.
- cards-r2-phys-m7.yaml: 28 cards (9 Engine cycles, 10 Statistical entropy, 9 Viscous flow).

## For a reviewer to double-check
- Real-world figures stated as approximate: gasoline engines reach 25–35%, near 40% at best; the largest marine diesels about 50%; simple-cycle gas turbines 35–45%; combined cycle about 60%; diesel r of 14–22, gasoline 8–12; pipe Re thresholds 2000/3000; viscosities of blood, olive oil and glycerin; C ≈ 0.5 for a sphere.
- History: Boltzmann's tombstone (S = k log W, in the form written by Planck), Stokes 1851, Millikan 1909–1913.
- The isothermal-atmosphere example and question h25 say that the real lower atmosphere (below about 100 km) is well mixed.
- Lesson 27's isotherms plot uses 200/400/800 K so the curve labels don't collide.

## Errors found in existing content
None. No existing questions, drills, cards or glossary entries were edited.

## Sources
Standard results checked against OpenStax University Physics Vols 1–2 (fluids, kinetic theory, the second law); Schroeder, *An Introduction to Thermal Physics* (Einstein solid, statistical temperature); and standard engineering-thermodynamics treatments of the air-standard Otto, Diesel and Brayton cycles. Every number was recomputed in Python.
