# Round 2 notes: de-m2 (Classification and first-order methods)

## Honors lessons (3, all `honors: true`, module de-m2, 45 min)
- `lessons/10h1-picard-iteration.md`, id `de-m2-h-picard`: "Picard iteration: where existence comes from". Integral-equation form, Picard iterates (y′ = y gives the Taylor polynomials of eᵗ; y′ = 2t(1 + y); y′ = y²), the guaranteed interval h = min(a, b/M) with the bow-tie picture, a sketch of the convergence proof (gap bound MKⁿhⁿ⁺¹/(n+1)!, error bound), why h for y′ = y², y(0) = 1 is at most 1/4, Peano existence vs uniqueness. About 1,650 words.
- `lessons/10h2-gronwall.md`, id `de-m2-h-gronwall`: "Grönwall's inequality and continuous dependence". Lipschitz condition (from |f_y| ≤ L; |y| is Lipschitz; √y is not), Grönwall's inequality with proof, the continuous dependence estimate and uniqueness from it, when the bound is sharp (y′ = ky) or pessimistic (y′ = sin y), the one-sided bound f_y ≤ λ, errors in the equation itself (ε/L)(e^{Lt} − 1), a short labeled note on sensitive dependence and chaos. About 1,650 words.
- `lessons/10h3-riccati-clairaut.md`, id `de-m2-h-riccati`: "Riccati and Clairaut equations". Riccati with a known solution (y = y₁ + 1/v gives v′ = −(q₁ + 2q₂y₁)v − q₂), two worked IVPs with blow-up, the substitution y = −u′/(q₂u) to a second-order linear equation (y′ = 1 + y² gives tan), Liouville 1841; Clairaut lines and singular solution, y = xy′ − (y′)² with tangent lines to y = x²/4, counting solutions through a point, why uniqueness fails on the parabola. About 1,500 words.

## Core lessons (additions only)
- 06: SVG of the parts of a linear equation; plot of the BVP family c₂ sin t; Mermaid "classify a DE" flowchart before the summary table.
- 07: numberline for Example 1's interval (0, 3); SVG of the existence rectangle and guaranteed interval; Mermaid "which theorem when" section before Common mistakes.
- 08: Mermaid flowchart of the integrating-factor recipe; plot of solutions of y′ + y = t approaching y = t − 1.
- 09: plot of the level curves x²y + y³ = C (parametric curves); Mermaid chart of the exact / integrating-factor procedure after Example 4.
- 10: one short paragraph plus a plot showing two solutions of y′ + y = y² (one decays, one blows up at t = ln 2); Mermaid "choosing a substitution" chart after the table.

## Pictures and diagrams
- `images/de-m2-linear-parts.svg` / `-blank.svg`, `images/de-m2-existence-rect.svg` / `-blank.svg`, `images/de-m2-picard-cone.svg` / `-blank.svg` (all previewed, markers checked on the blanks).
- Mermaid: 7 diagrams (5 core, 2 honors), all rendered with preview-figure.mjs. Plots: 5 core (incl. 1 numberline), 3 honors; all rendered with the app's renderFigure and inspected.

## Questions: `questions/r2-de-m2.yaml` (64)
- Core, de-m2-r2-q01 … q25 (5 per lesson): 2 label, 4 match, 5 order, 5 text, 5 select-all, 4 multiple choice. Module quiz: q01, q02, q06, q08, q11, q15, q17, q20, q22, q25 (2 per lesson).
- Honors, de-m2-r2-h01 … h39 (13 per lesson): Picard h01–h13, Grönwall h14–h26, Riccati/Clairaut h27–h39. Types: 1 label, 2 match, 3 order, 6 text, 3 select-all, 24 multiple choice (note: 6 of 13 per lesson are new types). Single-answer multiple-choice positions are balanced (6 at each index across the file).

## Drills: `drills/r2-de-m2.yaml` (6)
de-m2-r2-picard-iterate (expression), de-m2-r2-picard-h (exact fraction), de-m2-r2-gronwall-bound and de-m2-r2-gronwall-precision (sigfigs 3), de-m2-r2-riccati (expression), de-m2-r2-clairaut (two numbers). Linked from the honors lessons.

## Glossary and cards
- `glossary-r2-de-m2.yaml`: 13 terms (integral equation, Picard iteration, Picard–Lindelöf theorem, Lipschitz condition, Peano existence theorem, continuous dependence, Grönwall's inequality, continuous dependence estimate, one-sided Lipschitz condition, sensitive dependence on initial conditions, Riccati equation, Clairaut equation, singular solution). Checked against every glossary*.yaml in the course: no duplicate terms or aliases. "envelope" was deliberately not bolded or added (the existing entry means the amplitude envelope).
- `cards-r2-de-m2.yaml`: 28 cards (9 Picard iteration, 9 Continuous dependence, 10 Riccati and Clairaut equations).

## Checking
- `content/math/check-module.sh diffeq de-m2`: OK (8 lessons, 119 questions, 15 drills).
- Every honors example recomputed in sympy/scipy (Picard iterates, error bound 0.0086 vs actual 0.0029, b/(1+b)² max 1/4, sin y gap 0.0021 vs bound 0.201, the sin y vs y − y³/6 comparison 0.00009 vs bound 0.0011, Riccati solutions and K = 4, the Riccati → second-order identity in general form, Clairaut singular solution).
- Question keys worked by hand and the computational ones checked in sympy; each distractor checked wrong.
- Drills: 300 instances each generated from the built JSON; 375 distinct instances recomputed independently in sympy (Picard iterates by integration, Riccati solution checked against the ODE and initial condition, Clairaut roots, bounds), correct answers accepted and perturbed ones rejected by checkAll.

## For a reviewer
- History lines to double-check: Picard around 1890 (with Liouville's earlier successive approximations), Lindelöf 1894, Peano 1886/1890, Grönwall 1919 and Bellman's integral form 1943, Hadamard's "well posed" (early 1900s), Riccati 1720s, Clairaut 1730s, Liouville 1841 on y′ = t² + y², Lorenz 1963.
- The convergence argument in 10h1 is labeled a sketch (it skips continuity of the iterates and the formal uniform-convergence step).
- de-m2-r2-gronwall-bound shows answers with the `sig3` format, which drops trailing zeros (e.g. 4.5 rather than 4.50); 3-significant-figure answers are still accepted.
- Clairaut plot: the auto-placed label "(3, 2)" sits close to a dashed line; readable but not ideal.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Standard results (Picard–Lindelöf, Peano, Grönwall–Bellman, Riccati and Clairaut equations); all explanations, examples and questions are original. Historical dates from general mathematical-history knowledge (see the reviewer list above).
