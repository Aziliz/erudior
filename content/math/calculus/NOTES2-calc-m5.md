# Round 2 notes: calc-m5 (Analyzing functions with derivatives)

## Honors lessons (3)
- `lessons/20h1-mvt-inequalities.md`, `calc-m5-h-mvt-inequalities`: "The Mean Value Theorem at work: inequalities and counting roots" (45 min, ~1,950 words). Derivative bounds ($m(b-a) \le f(b)-f(a) \le M(b-a)$), $|\sin a - \sin b| \le |a-b|$, $\sqrt{101}$ with a guaranteed error, the racetrack principle (forward and backward), $e^x \ge 1+x$, $\ln(1+x) \le x$, stacking to $\cos x \ge 1 - x^2/2$ and $\sin x \ge x - x^3/6$ (link to Taylor, L44), Rolle root counting with IVT existence ($x^3+4x-7$, $x^4-4x+1$, cubics $x^3-3k^2x+q$), the isolated-zero case $x = \cos x$, uniqueness of $f'=f$. 6 examples, 1 plot, 1 Mermaid.
- `lessons/20h2-convexity.md`, `calc-m5-h-convexity`: "Convex functions and the classic inequalities" (45 min, ~1,700 words). Chord definition, tangent line inequality proved with the MVT, tangents imply chords, convex + $f'(c)=0$ gives an absolute min (ties to L20's can), Jensen's inequality (tangent-at-the-mean proof), variance as the Jensen gap, AM–GM from concavity of ln, optimizing with AM–GM (L20's can redone). 4 examples, SVG, 1 plot, 1 Mermaid.
- `lessons/20h3-optimization-models.md`, `calc-m5-h-optimization-models`: "Optimization models: light, inventory and corners" (45 min, ~1,730 words). Lifeguard problem, Fermat's principle and Snell's law, the EOQ inventory model (with sensitivity), longest ladder around a corner. 4 examples, SVG, 1 plot, 1 shape figure.

Chosen to avoid overlap with the other calculus honors lessons: Cauchy's MVT / L'Hôpital proof is in 16h2, Newton error in 16h1, EVT/IVT proofs in calc-h1.

## Core lessons (additions only)
- L17: labeled SVG of extrema kinds on [a, b] (`calc-m5-extrema.svg`) + Mermaid theorem chain (EVT, Fermat → Rolle → MVT → consequences).
- L18: Mermaid first-derivative-test decision chart + SVG graph of f′ with readings for f (`calc-m5-fprime.svg`) and one sentence about x = 4.
- L19: SVG of one period of sin x showing the four increasing/decreasing × concave up/down combinations (`calc-m5-shapes.svg`) + Mermaid "which test" chart.
- L20: Mermaid optimization procedure (closed vs open domain branch) + shape figure for the river-fence example.

## Questions (`questions/r2-calc-m5.yaml`, 63)
- Core `calc-m5-r2-q01`–`q21` (L17: 6, L18: 5, L19: 5, L20: 5); module quiz: q01, q05, q07, q09, q12, q15, q17, q20 (2 per lesson).
- Honors `calc-m5-r2-h01`–`h42` (14 per lesson; no module_quiz).
- By type: 26 multiple choice, 12 text, 7 select-all, 7 match, 6 order, 5 label. Single-answer positions 6/7/7/6.

## Pictures and diagrams
- SVGs (original, each with a `-blank` copy for label questions): `calc-m5-extrema`, `calc-m5-fprime`, `calc-m5-shapes`, `calc-m5-convex`, `calc-m5-lifeguard` (all under 13 KB; previewed with markers).
- Mermaid: 6 (L17, L18, L19, L20, 20h1, 20h2). Figures: 5 new plot/shape blocks (L20, 20h1, 20h2, 20h3 ×2), rendered with the app stylesheet and checked.

## Drills (`drills/r2-calc-m5.yaml`, 6)
`calc-m5-r2-derivative-bounds`, `calc-m5-r2-cubic-roots` (20h1); `calc-m5-r2-amgm-min` (20h2); `calc-m5-r2-lifeguard`, `calc-m5-r2-eoq`, `calc-m5-r2-ladder` (20h3). 600 instances each checked against an independent Python/scipy computation from the prompt (0 mismatches); answers typed rounded to 2 dp accepted, +1 rejected; no "+ -", "+ 0" or thousands commas inside math.

## Glossary and cards
- `glossary-r2-calc-m5.yaml` (16): racetrack principle, convex function, concave function, strictly convex, tangent line inequality, Jensen's inequality, arithmetic mean, geometric mean, AM–GM inequality, normal, Fermat's principle, index of refraction, Snell's law, ordering cost, holding cost, economic order quantity. No duplicates across the course's glossary files (checked).
- `cards-r2-calc-m5.yaml` (30: 11 / 11 / 8 per honors lesson).

## For a reviewer
- "Racetrack principle" is a name some textbooks use (said so in the lesson). "Convex = concave up" convention is stated with a caution that books differ.
- History: Ibn Sahl (about 984), Snellius (1621), Descartes (published 1637), Fermat's least-time derivation (1662), Jensen (1906), Harris's EOQ (1913). Worth a second look.
- Fermat's principle is labeled as simplified (stationary time); EOQ and ladder models list their assumptions.
- Label marker positions were computed from the drawing code and checked in previews; the θ₂ marker in the lifeguard picture sits on the small arc right next to the water path.
- Lifeguard Example 1 (a = 20, b = 40, d = 60, v = 6 and 2): x ≈ 47.1 m, T ≈ 29.5 s (straight line 33.0 s, run to x = 60: 30.5 s), checked numerically.

## Errors found in existing content
None. (Cosmetic only: L20's "Example 3 (the cheapest can (open domain))" heading has nested parentheses; left as is.)

## Sources
Standard results (MVT, Rolle, Jensen, AM–GM, Snell's law, EOQ formula); all numbers recomputed in Python/sympy/scipy. History from general references (Ibn Sahl's *On Burning Mirrors and Lenses*; Jensen, Acta Mathematica 30, 1906; F. W. Harris, "How Many Parts to Make at Once", 1913).

## Checks
`content/math/check-module.sh calculus calc-m5`: OK (zero problems).
