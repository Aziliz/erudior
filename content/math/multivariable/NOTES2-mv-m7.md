# Round 2 notes: mv-m7 (Vector fields and line integrals)

## Honors lessons (2)
- `lessons/32h1-winding-number.md`, **Holes and the winding number** (`mv-m7-h-winding`, 45 min): the vortex field as locally $\nabla\theta$, why it is only locally conservative, the winding number and why it is an integer, the deformation principle (proved from Green with a hole), the theorem that every curl-free field on the punctured plane is $\nabla f + c\mathbf V$, and Ampère's law and point vortices. 3 worked examples (circle traced twice, the square two ways, decomposing a field).
- `lessons/32h2-shoelace.md`, **Polygons, the shoelace formula and centroids** (`mv-m7-h-shoelace`, 40 min): one edge's contribution to $\oint x\,dy - y\,dx$, the shoelace formula, signed area and the fan of triangles, orientation test, self-crossing outlines, centroids from Green and the polygon centroid formula, uses (surveying, GIS, planimeters, graphics). 3 worked examples (quadrilateral, bowtie, L-shaped plate).

## Core lessons (additions only)
- 29: SVG of level curves, gradient arrows and a gradient flow line (`mv-m7-gradient-contours`); Mermaid diagram linking a potential, its gradient field, level curves and flow lines.
- 30: SVG splitting a force into tangential and normal parts (`mv-m7-tangential`); Mermaid procedure for evaluating line integrals (new short section "The procedure at a glance").
- 31: Mermaid diagram of the three equivalent conditions; SVG of simply connected vs. not (`mv-m7-regions`); Mermaid "which method for a line integral" decision chart (new short section).
- 32: SVG of the tiny-squares proof sketch (`mv-m7-green-tiles`); SVG of the annulus with orientations (`mv-m7-annulus`).

## Questions (`questions/r2-mv-m7.yaml`, 48)
- Core (q01-q20, 5 per lesson, 2 module_quiz per lesson): 3 label, 4 text, 4 match, 3 order, 4 select-all, 2 multiple choice.
- Honors (h01-h28, 14 per lesson): winding lesson has 1 label, 2 text, 1 match, 1 order, 1 select-all, 8 MC; shoelace lesson has 2 text, 1 match, 1 order, 1 select-all, 9 MC.

## Drills (`drills/r2-mv-m7.yaml`, 3)
- `mv-m7-r2-shoelace` (quadrilateral with one vertex per quadrant, shifted: always simple and counterclockwise), `mv-m7-r2-poly-centroid` (2 decimals, tolerance 0.006), `mv-m7-r2-winding-circ` (circulation of $a\nabla\ln r + c\mathbf V$ around a circle traversed once or twice, either direction; answer accepts typed `6pi`).

## Pictures
10 SVGs: gradient-contours (+blank), tangential (+blank), regions, green-tiles, annulus (+blank), winding (+blank). All previewed, markers checked on the blanks. 5 Mermaid diagrams (4 in core lessons, previewed).

## Glossary and cards
- `glossary-r2-mv-m7.yaml` (9): punctured plane, vortex field, locally conservative, winding number, deformation principle, point vortex, shoelace formula, signed area, orientation test. Checked against every glossary file in the course; no duplicates.
- `cards-r2-mv-m7.yaml` (17): 9 winding, 8 shoelace/centroid.

## For reviewers
- 32h1: the decomposition theorem is proved only for simple closed curves. The lesson says outright that the self-crossing case is taken on trust.
- 32h1 physics: $\mathbf B = \frac{\mu_0 I}{2\pi}\mathbf V$ for current along $+z$, and the point vortex having zero curl away from its center. Both are labeled as idealizations.
- 32h2 history: "described by A. L. F. Meister in 1769; also called Gauss's area formula / surveyor's formula" (from Wikipedia, Shoelace formula). The lesson makes no claim about when Gauss described it.
- All numbers were recomputed in Python (sympy/fractions/scipy), including the winding numbers of the limaçon figure (2, 1, 0).

## Errors found in existing content
None.

## Check
`content/math/check-module.sh multivariable mv-m7`: 6 lessons, 96 questions, 11 drills: OK, zero problems.

## Sources
- Shoelace formula history: https://en.wikipedia.org/wiki/Shoelace_formula
- Everything else is standard vector calculus (Green's theorem, Ampère's law), worked independently.
