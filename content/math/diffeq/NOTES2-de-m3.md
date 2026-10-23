# Round 2 notes: de-m3 (Modeling with first-order equations)

Check: `content/math/check-module.sh diffeq de-m3` gives OK (5 lessons, 79 questions, 15 drills, 30 cards, zero problems).

## Honors lessons (new)
- `lessons/13h1-quadratic-drag.md`, id `de-m3-h-quadratic-drag`, "Quadratic drag in depth" (45 min, about 1,600 words). Covers where linear (Stokes) and quadratic drag come from (Reynolds number, drag equation), a derivation of $v = v_T\tanh(gt/v_T)$ by separation and partial fractions, distance $\frac{v_T^2}{g}\ln\cosh$, speed against distance (substitution $w = v^2$), an upward throw split at the top (time to the top with arctan, max height, landing speed $v_0v_T/\sqrt{v_0^2+v_T^2}$, a fall that takes longer than the rise), and linear vs quadratic with the same $v_T$. Worked examples: a skydiver, and up and back down.
- `lessons/13h2-drug-dosing.md`, id `de-m3-h-drug-dosing`, "Drug dosing and compartment models" (50 min, about 1,500 words). Covers the one-compartment model (V, k, clearance, half-life), the IV bolus and fitting it from two samples, constant infusion and the 4 to 5 half-life rule, a loading dose by superposition, repeated doses as a geometric series (peak, trough, accumulation factor, average $D/(\text{CL}\,\tau)$), and oral dosing as two tanks in series ($t_{\max}$, the $k_a = k$ case tied to tank B in Lesson 12). Four worked examples. It says plainly that this is a teaching model, not dosing advice.

## Core lesson additions (additions only)
- L11: Mermaid modeling-cycle flowchart, and a plot of the loan balance at three payment levels (15,000 / 12,000 / 10,000 per year).
- L12: tank picture `de-m3-tank.svg`, Mermaid two-tank flow diagram, and a plot of $Q_A$ and $Q_B$ for the two-tank example. The sentence "You solve A first…" now comes right after the diagram.
- L13: force diagram `de-m3-falling-forces.svg`, circuit symbols picture `de-m3-circuits.svg` (RL and RC), and a new short section "One equation, four models" with a Mermaid chart linking falling, RL, RC and cooling to $y' + ay = b$.

## Questions (`questions/r2-de-m3.yaml`, 41)
- Core q01–q15 (5 per lesson): text 4, order 2, match 3, select-all 3, label 3 (tank, forces, circuits). Module quiz: q02, q04, q06, q09, q11, q14.
- Honors h01–h13 (quadratic drag): 8 multiple choice, 2 text, 1 order, 1 match, 1 select-all.
- Honors h14–h26 (drug dosing): 8 multiple choice, 2 text, 1 order, 1 match, 1 select-all.
- Multiple-choice answers are spread evenly (4 at each index); select-all answer sets vary in position.

## Drills (`drills/r2-de-m3.yaml`, 6)
de-m3-r2-quad-fall, de-m3-r2-quad-height, de-m3-r2-quad-return (13h1); de-m3-r2-bolus-fit, de-m3-r2-infusion, de-m3-r2-dose-steady (13h2). Every decimal answer has a tolerance of at least half the last place; bolus-fit uses 3 significant figures and computes its answers from the rounded concentrations it shows.

## Pictures and diagrams
- SVG: de-m3-tank(+blank), de-m3-falling-forces(+blank), de-m3-circuits(+blank), de-m3-drag-up-down. All are original, under 5 KB each, and were previewed with their markers.
- Mermaid: modeling cycle (L11), two tanks (L12), four models one equation (L13), choosing a drag model (13h1), oral-dose compartments (13h2).
- Plots: loan balances (L11), two tanks (L12), linear vs quadratic drag (13h1), repeated-dose sawtooth (13h2). All were rendered with renderFigure and checked by eye. Curve labels were replaced with placed labels or captions where they overlapped.

## Glossary and cards
- `glossary-r2-de-m3.yaml` (16): Reynolds number, Stokes' law, drag equation, hyperbolic tangent, pharmacokinetics, one-compartment model, volume of distribution, elimination rate constant, clearance, bolus, infusion, loading dose, maintenance dose, dosing interval, accumulation factor, bioavailability. No duplicates in any glossary*.yaml.
- `cards-r2-de-m3.yaml` (20): 10 on Quadratic drag, 10 on Pharmacokinetics.

## For a reviewer
- Approximate physical figures, labeled in the text as rough: the Reynolds cutoffs (below about 1 linear, above about 1,000 quadratic), sphere $C_d$ of about 0.4 to 0.5, the drag crisis near Re ≈ 300,000, air values ρ ≈ 1.2 kg/m³ and μ ≈ 1.8×10⁻⁵ Pa·s, and belly-down skydivers at roughly 50 to 55 m/s.
- Naming: the course glossary uses "drag coefficient" for Lesson 13's γ. 13h1 notes that engineers use the same name for the dimensionless $C_d$ and does not bold it.
- Pharmacokinetics simplifications are stated in the lesson: first-order elimination (alcohol is the named exception), an apparent volume V, and one compartment.
- Possible overlap: if the de-m8 writer adds compartment or pharmacokinetic models for systems, 13h2 is the scalar first-order version.

## Errors found in existing content
None. I re-checked L11–L13's examples (radiocarbon, annuity, loan, coffee, time of death, tanks, drag, RL/RC, the steady state of $I' + 5I = 6\sin t$), and they are correct.

## Verification
Every number in the lessons and question keys was computed in Python. The quadratic-drag formulas (time to 90%, distance, flight up and down) were checked against solve_ivp. Repeated dosing, the loading dose, the oral $t_{\max}$/$C_{\max}$ and the $k_a = k$ peak were checked by simulation, and the average steady level by quadrature.

## Sources
Standard results: Stokes' drag and the drag equation, the Reynolds number, and one-compartment pharmacokinetics (the bolus, infusion, superposition of repeated doses and the Bateman function for oral absorption), as covered in introductory fluid mechanics and pharmacokinetics texts. All explanations, examples and numbers are original.
