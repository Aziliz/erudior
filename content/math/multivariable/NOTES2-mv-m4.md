# Round 2 notes: mv-m4 (Optimization)

## Honors lessons (3)
| File | id | Title | Words | Drills |
|---|---|---|---|---|
| lessons/20h1-hessian-test.md | mv-m4-h-hessian | Why the second-derivative test works: quadratic forms and the Hessian | ~1,990 | mv-m4-r2-minors, mv-m4-r2-crit3 |
| lessons/20h2-inequality-constraints.md | mv-m4-h-kkt | Inequality constraints and the meaning of the multiplier | ~1,550 | mv-m4-r2-kkt |
| lessons/20h3-numerical-optimization.md | mv-m4-h-numerical | Optimization by computer: gradient descent and Newton's method | ~1,390 | mv-m4-r2-gd, mv-m4-r2-newton |

- H1: second-order Taylor at a critical point, completing-the-square proof of the D test (with the EVT argument for the remainder, the error bound stated without proof), Hessian eigenvalues and curvature directions, 3-variable test by leading principal minors (Sylvester's criterion). Plot of rotated level ellipses, Mermaid decision chart.
- H2: chain-rule proof that λ = dF/dk (shadow price), inequality constraints, active/inactive, KKT conditions with complementary slackness and the sign rule, sufficiency for concave f / convex g (stated without proof). Mermaid case chart, plot of the nearest-point example.
- H3: gradient descent, step-size limit α < 2/λmax (for quadratics; labeled as a local guide otherwise), Newton's method from the Taylor model, quadratic convergence table, comparison table, Mermaid iteration loop, plot of smooth vs zigzag paths.

## Core lessons (additions only)
- L17: Mermaid "classify a critical point" chart; new short subsection "Reading critical points on a contour map" with images/mv-m4-critical-points.svg.
- L18: images/mv-m4-region-candidates.svg with an introducing paragraph; Mermaid closed-region method chart.
- L19: images/mv-m4-lagrange-tangency.svg with a paragraph (crossing vs touching vs missing level lines); Mermaid "which method when" chart before Common mistakes.
- L20: images/mv-m4-residuals.svg with two sentences; Mermaid least squares procedure before Example 1.

## Questions: questions/r2-mv-m4.yaml (60)
- Core q01–q20 (5 per lesson, 2 module_quiz each): 4 text, 3 order, 3 match, 4 select-all, 4 label, 2 multiple choice.
- Honors h01–h40 (H1: 14, H2: 13, H3: 13): 9 text, 3 order, 4 match, 4 select-all, 20 multiple choice.
- Totals by type: 22 MC (correct positions 0×4, 1×6, 2×7, 3×5), 8 select-all, 13 text, 7 match, 6 order, 4 label.

## Drills: drills/r2-mv-m4.yaml (5)
mv-m4-r2-minors (3×3 Hessian minors + type code), mv-m4-r2-crit3 (critical point of a 3-variable quadratic + type code), mv-m4-r2-kkt (nearest point of a half-plane; x, y, λ as fractions; ~45% inactive cases), mv-m4-r2-gd (two gradient descent steps, exact decimals), mv-m4-r2-newton (one Newton step, 3 dp, tolerance 0.001). Each generated 600 times against an independent solver: every target matched, the expected answer (fractions for kkt/newton too) was accepted, a wrong answer rejected, no "+ -", "+ 0", "1x" output. Type-code mixes are about 1/3 each.

## Pictures (8 SVG files, all original, 2–22 KB)
mv-m4-critical-points(.svg, -blank.svg), mv-m4-region-candidates, mv-m4-lagrange-tangency, mv-m4-residuals; each labeled version is in a lesson, each blank version is used by a label question. All previewed with markers.

## Glossary and cards
- glossary-r2-mv-m4.yaml (17): positive definite, negative definite, indefinite, leading principal minors, Sylvester's criterion, shadow price, feasible region, active constraint, inactive constraint, KKT conditions, complementary slackness, iterative methods, gradient descent, step size, iterate, quadratic convergence, stopping criterion. Checked against every glossary*.yaml: no duplicate terms or aliases.
- cards-r2-mv-m4.yaml (26): 10 / 8 / 8 per honors lesson.

## For the reviewer
- Overlap with mv-m1's honors lesson 06h2-quadratic-forms.md (written at the same time): it defines quadratic form, eigenvalue, eigenvector and says the second-derivative-test link is taken on trust. My H1 cross-references it as optional, supplies that proof, and does NOT bold or define "quadratic form"/"eigenvalue" in the glossary (left to mv-m1). I dropped a planned 2×2 eigenvalue drill because mv-m1 has mv-m1-r2-eigen2.
- H1's "Taylor error is small compared with h² + k²" is stated without proof (labeled).
- H2: KKT history (Karush 1939 master's thesis; Kuhn and Tucker 1951) from memory of standard accounts; the constraint qualification is given only as "∇g ≠ 0 when active" (enough for one constraint).
- H3: the claim that Newton's method on x⁴ + y² − 2xy from (0.3, 0.3) converges to the saddle at the origin was checked numerically (also from (0.1, 0.05), (0.2, 0.1)); gradient descent's "46 steps" is from a direct run (α = 0.1, both coordinates within 0.001).
- mv-m4-r2-h07 asks for the direction of greatest curvature; the answer uses u^T H u (no ½), consistent with the lesson.
- Label q14: marker 3 sits on the crossing line inside the circle (moved off the intersection point so it can't be read as the circle).

## Errors found in existing content
None.

## Sources / verification
All lesson examples and question keys recomputed with sympy/numpy (scratch keycheck.py, h1–h3.py); figures rendered with the app's renderer and screenshotted. Standard references for content: OpenStax Calculus Vol 3 §4.7–4.8, Paul's Online Notes Calc III (as in VERIFY.md); Sylvester's criterion, KKT and Newton/gradient descent convergence are standard results (Nocedal and Wright, Numerical Optimization, for the step-size and quadratic-convergence statements).

Build and checker (content/math/check-module.sh multivariable mv-m4): OK, zero problems.
