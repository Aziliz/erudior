# Round 2, calc-m3 (Differentiation rules): writer notes

## Added

- **Honors lessons (3)**, all `honors: true`, `module: calc-m3`, 45 min, refs `calc-ref-derivatives`:
  - `13h1-leibniz-rule.md` (calc-m3-h-leibniz-rule, "Higher derivatives and Leibniz's rule", ~1,500 words): nth-derivative patterns (falling factorial, e^{ax}, sin(ax+b) with the π/2 shift, 1/(x−c), ln x) and proof by induction; nth derivative of 1/(x²−1) by splitting into reciprocals; Leibniz's rule with the binomial-coefficient argument (Mermaid tree for (fg)″); second derivative of a composite and a mention of Faà di Bruno. 4 worked examples (incl. (x²e^{3x})^{(10)} and the 20th derivative of x³ sin x at 0, cross-checked against the Taylor coefficient). Drills: calc-m3-r2-leibniz-at-zero, calc-m3-r2-nth-reciprocal, calc-m3-r2-nth-sine.
  - `13h2-proofs.md` (calc-m3-h-proofs, "Proving the chain rule and the inverse function rule", ~1,700 words): why the Lesson 11 sketch fails (x² sin(1/x)); Carathéodory's slope-function form of differentiability with proof; full proofs of the chain rule and product rule; inverse function theorem with hypotheses (strictly monotonic, f′(a) ≠ 0) and the x³ / ∛x counterexample; (x^r)′ for real r; (1 + 1/n)^n → e from ln′(1) = 1. 4 worked examples. Plots: secant/slope function, x³ vs ∛x. Mermaid: structure of the chain rule proof. Drills: calc-m3-r2-e-limit, plus the existing calc-d-inverse-fn-deriv.
  - `13h3-implicit-curves.md` (calc-m3-h-implicit-curves, "Implicit curves: special tangents, singular points and orthogonal families", ~1,700 words): dy/dx = −F_x/F_y (justified term by term for polynomial F); horizontal/vertical tangents; singular points (folium node, y² = x³ cusp); orthogonal trajectories (circles/lines, x² − y² = c / xy = k, y = kx² / x² + 2y² = C) with physics applications labeled as idealized. 5 worked examples. Picture `calc-m3-folium.svg`; plots of the tilted ellipse with its 4 special tangents, the cusp, and the two hyperbola families. Drills: calc-m3-r2-horizontal-tangent, calc-m3-r2-folium-tangent.
- **Core lessons** (additions only, one or two sentences introducing each picture):
  - L09: Mermaid "which rule for a product or quotient" decision chart.
  - L10: SVG `calc-m3-trig-cycle.svg` (sin → cos → −sin → −cos cycle).
  - L11: SVG `calc-m3-chain-layers.svg` (e^{cos 3x} as three machines with their rates); plot of the greenhouse temperature with its tangent at t = 4.
  - L12: Mermaid flowchart of the implicit-differentiation steps; plot of the folium with its tangent at (3, 3).
  - L13: Mermaid "base^exponent: which rule" chart; plot of x ln x with the tangent at (e, e) and the horizontal tangent at (1/e, −1/e).
- **Questions** `questions/r2-calc-m3.yaml` (67):
  - Core: calc-m3-r2-q01–q25, 5 per lesson: label 4 (L09–L12), text 6, order 5, match 5, select-all 5 (L13 has no label question; its pictures are a chart and a plot). module_quiz: q01, q05, q06, q10, q11, q15, q16, q17, q21, q22 (2 per lesson).
  - Honors: calc-m3-r2-h01–h42, 14 per lesson. 25 four-choice (answer positions 0×6, 1×6, 2×7, 3×6), text 7, select-all 3, order 3, match 3, label 1 (h29, folium); 17 of 42 are new types.
- **Pictures** (8 SVGs, original, each under 30 KB): calc-m3-product-area-blank, calc-m3-sine-points-blank, calc-m3-chain-layers(+blank), calc-m3-trig-cycle, calc-m3-arcsin-triangle-blank, calc-m3-folium(+blank). Blanks back label questions q01, q06, q11, q16, h29. All previewed with preview-figure.mjs (label ones with their markers); lesson plot blocks rendered with renderFigure and looked at.
- **Mermaid diagrams (5)**: L09 decision chart, L12 steps, L13 decision chart, 13h1 product tree, 13h2 proof structure. All with accTitle/accDescr, previewed.
- **Drills (6)** `drills/r2-calc-m3.yaml`: calc-m3-r2-leibniz-at-zero, -nth-reciprocal, -nth-sine (expression answer), -e-limit, -horizontal-tangent, -folium-tangent. Each generated 300 times and checked against sympy / direct substitution, and the typed correct answers accepted.
- **Glossary** `glossary-r2-calc-m3.yaml`: 8 terms (nth derivative, falling factorial, mathematical induction, Leibniz rule, slope function, partial derivative, singular point, orthogonal trajectories). Checked against every glossary*.yaml in the course; no duplicates.
- **Cards** `cards-r2-calc-m3.yaml`: 26 (10 / 8 / 8 per honors lesson).
- `content/math/check-module.sh calculus calc-m3`: build and checker OK, zero problems.

## For the reviewer

- 13h2 attributes the slope-function form of differentiability to Carathéodory with "usually credited to"; Jacob Bernoulli's compound-interest limit is dated "in the 1680s" (1683 in the usual account); Faà di Bruno's formula "published in the 1850s".
- 13h2's inverse-function proof takes as given that the inverse of a continuous strictly monotonic function on an interval is continuous (said so in the text).
- 13h3 calls F_x, F_y "partial derivatives" and defines them informally; the derivation of −F_x/F_y is done term by term for polynomial F, with "any smooth F, by the multivariable chain rule" stated without proof. "Cusp" is italic, not bold, because the existing glossary already has cusp as an alias of corner.
- 13h3's fluid-flow example (xy = k streamlines, x² − y² = c potential lines for flow into a corner) is labeled as an idealized model.
- Label q16 uses short answer texts ("1", "x", "√(1 − x²)") for the sides of the arcsin triangle.
- 13h2's x² sin(1/x) example also appears in calc-m2's honors lesson 08h2 (for a different point: a derivative that is not continuous); no conflict, but the two could cross-reference.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Standard results (Leibniz rule, Carathéodory's criterion, inverse function theorem, folium of Descartes, orthogonal trajectories) as in Apostol, Calculus Vol. 1, and Stewart / OpenStax Calculus Vol. 1; the Carathéodory, Faà di Bruno and Bernoulli attributions are the commonly cited ones, hedged in the text and not re-checked online this round, so worth a spot check. All numbers, examples, question keys and drill answers checked with sympy/Python. All writing and drawings original.
