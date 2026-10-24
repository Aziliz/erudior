# Round 2 notes: mv-m8 (Surface integrals and the big theorems)

`content/math/check-module.sh multivariable mv-m8`: build and checker OK, zero problems.

## Honors lessons
- `lessons/38h1-proofs.md`, **Proving the Divergence and Stokes theorems** (`mv-m8-h-proofs`, 45 min): component split; full proof of the k-part for a type 1 solid (FTC in z vs top/bottom/side flux); Stokes for a graph z = g(x, y) via dz = g_x dx + g_y dy, Green and Clairaut; cutting into pieces; coordinate-free divergence as a limit (shrinking-cube example with the h²/4 error term); what the proofs don't cover (generalized Stokes theorem, labeled as beyond scope); history. 3 worked examples, Mermaid proof-structure chart, SVG of a type 1 solid.
- `lessons/38h2-green-identities.md`, **Product rules, Green's identities and uniqueness** (`mv-m8-h-green-identities`, 45 min): product rules for ∇ (one proved, all checked in sympy), div of x/|x|³ via the product rule, integration by parts in 3D, Green's first and second identities, Poisson/Laplace, Dirichlet and Neumann problems, uniqueness proof via the energy identity, Neumann compatibility condition, mean value property (stated without proof, labeled). 4 worked examples, Mermaid derivation chart.
- I wrote 2 honors lessons, not 3. Vector potentials and Helmholtz decomposition were left out on purpose, because they are likely in the mv-h1 honors module.

## Core lessons (additions only)
- 33 curl-div: paddle-wheel SVG (`mv-m8-paddle-wheel`); Mermaid chart of the grad → curl → div chain ("two steps give zero").
- 34 param-surfaces: Mermaid "which parametrization" chart; SVG of the uv-domain mapped to a surface with r_u, r_v, N (`mv-m8-param-patch`).
- 35 surface-integrals: new short section "Choosing a method" with a Mermaid decision chart.
- 36 stokes: SVG of the dome, boundary and normal by the right-hand rule (`mv-m8-stokes-net`); new short section "Which side to compute" with a Mermaid chart.
- 37 divergence: Mermaid procedure for closing an open surface with a lid.
- 38 physics: Ampère-loop SVG (`mv-m8-amperian-loop`) plus one sentence on direction; Mermaid "integral law → differential law" chart.
Every core lesson already had at least one ```plot; each now has 2–4 figures.

## Questions (`questions/r2-mv-m8.yaml`, 53)
- Core `mv-m8-r2-q01`–`q25` (4–5 per lesson): 7 text, 5 match, 4 order, 5 select-all, 4 label. 9 are module_quiz (1–2 per lesson).
- Honors `mv-m8-r2-h01`–`h28` (14 per lesson): 18 multiple choice, 4 text, 2 match, 2 order, 2 select-all, so 10 of 28 (about a third) use the new types.

## Drills (`drills/r2-mv-m8.yaml`, 6)
- mv-m8-r2-div-cylinder, mv-m8-r2-stokes-plane, mv-m8-r2-cube-flux (38h1)
- mv-m8-r2-div-product, mv-m8-r2-grad-flux, mv-m8-r2-energy (38h2)
Tolerances: relTolerance 0.001/0.002, and smallest possible answers keep them ≥ 0.005 for "2 decimals".

## Pictures
SVGs, each with a `-blank` copy: mv-m8-paddle-wheel, mv-m8-param-patch, mv-m8-stokes-net, mv-m8-amperian-loop, mv-m8-z-simple (the z-simple blank is unused; I kept it for a possible label question). There are 8 Mermaid diagrams. I previewed all of them, and the label markers on the blanks.

## Glossary and cards
- `glossary-r2-mv-m8.yaml` (9): simple solid region, generalized Stokes theorem, normal derivative, Green's first identity, Green's second identity, Poisson's equation, Dirichlet problem, Neumann problem, energy identity.
- 38h2 also bolds **Laplace's equation** and **mean value property**. These are already defined in `glossary-r2-mv-m3.yaml` (mv-m3 writer), so I did not redefine them. Their definitions are the 2D (circle) versions; a reviewer may want them to mention 3D too.
- `cards-r2-mv-m8.yaml` (20): 10 per honors lesson.

## For a reviewer
- History in 38h1 / h08 / cards: Lagrange 1762, Gauss 1813, Ostrogradsky general proof 1826 (Wikipedia, Ostrogradsky); Thomson letter 1850, Smith's Prize 1854 (Macmillan vector calculus text, ch. 8 intro).
- 38h2: "hydraulic head in steady groundwater flow satisfies Poisson/Laplace" assumes a homogeneous aquifer (simplification).
- Label question q14 (Stokes net): the "flat disk" marker sits inside the drawn dome; the alt text and stem explain it.
- I checked all examples, question answers and drill formulas in sympy, along with the product-rule identities.

## Errors found in existing content
None.

## Sources
Wikipedia "Mikhail Ostrogradsky"; Macmillan (Marsden–Tromba style) vector calculus ch. 8 introduction (digfir-published.macmillanusa.com/uc_calc/vc_ch8_1.html); standard results (Green's identities, uniqueness for Dirichlet/Neumann problems).
