# Round 2 notes: pc-m10 (Introduction to limits and the derivative)

## Honors lessons (honors: true, module pc-m10)
1. `43h1-squeeze-trig-limits.md` (pc-m10-h-squeeze), "The squeeze theorem and the limits of trigonometry", ~1,680 words, 45 min. Squeeze theorem; x² sin(1/x) and sin x / x at infinity; unit-circle area proof that sin x / x → 1 (labeled "geometric proof, not a proof from axioms"); degrees vs radians (π/180); sin kx / x, tan x / x, (1 − cos x)/x, (1 − cos x)/x²; derivative of sin (and cos) from the definition; tangent lines to sin. 5 worked examples.
2. `43h2-derivative-rules-approximation.md` (pc-m10-h-rules), "Derivative rules, differentiability and linear approximation", ~1,680 words, 50 min. Power rule proved for positive integers with the binomial theorem (other exponents stated, not proved); sum and constant multiple rules; no naive product rule; differentiable implies continuous (proof) with |x| and cube-root counterexamples; piecewise junction example; linear approximation and its error; Newton's method (√2 table, history). 6 worked examples.

## Core lessons (additions only)
- 41: Mermaid "does the limit exist / is f continuous" decision chart; SVG `pc-m10-discontinuities.svg` (hole, jump, asymptote, continuous point) with a short explanatory paragraph.
- 42: new "## Choosing a method" section with a Mermaid "which method when" chart (before Common mistakes).
- 43: SVG `pc-m10-secant-tangent.svg` (P, Q, secant, tangent, run, rise); Mermaid chart of the derivative-from-definition steps; ```plot of |x| with its corner.

## Questions (`questions/r2-pc-m10.yaml`, 44)
- Core q01–q15 (5 per lesson): 5 text, 3 match, 3 select-all, 2 order, 2 label. module_quiz on q01, q04, q06, q09, q11, q13 (2 per lesson).
- Honors h01–h15 (squeeze, 15): 8 MC, 2 text, 2 order, 1 label, 1 match, 1 select-all.
- Honors h16–h29 (rules, 14): 8 MC, 3 text, 1 order, 1 match, 1 select-all.
- MC answer positions balanced 4/4/4/4. No module_quiz on honors questions (ignored anyway).

## Pictures and diagrams
- SVG (original, each with a -blank copy for label questions): pc-m10-discontinuities, pc-m10-secant-tangent, pc-m10-squeeze-circle. All previewed with markers.
- Mermaid: 3 in core lessons, 1 in 43h1, 2 in 43h2. Plots: 2 in 43h1, 2 in 43h2, 1 added to 43.

## Drills (`drills/r2-pc-m10.yaml`, 6)
pc-m10-r2-sin-ratio, pc-m10-r2-one-minus-cos, pc-m10-r2-sin-slope (2 decimals, tolerance 0.0051), pc-m10-r2-poly-slope, pc-m10-r2-linear-approx (4 decimals, tolerance 0.000051), pc-m10-r2-newton-step (fraction or 4 decimals).

## Glossary and cards
- `glossary-r2-pc-m10.yaml` (8): squeeze theorem, power rule, constant multiple rule, sum rule, differentiable, vertical tangent, linear approximation, Newton's method. No collisions with any glossary*.yaml in the course at the time of writing.
- `cards-r2-pc-m10.yaml` (20): 10 per honors lesson.

## For the reviewer
- `check-module.sh precalculus pc-m10`: OK, zero problems.
- All numbers recomputed in Python/sympy (5/3, 1/2, π/180, √4.1, 1.02^10, √9.2, Newton iterates 17/12 and 577/408, −161/27, etc.).
- History: Newton's version around 1669 (De analysi), Raphson 1690; Heron of Alexandria (1st century CE, Metrica) for the averaging step. Worded cautiously.
- The pc-h1 honors writer could add "squeeze theorem" or similar terms later; if so one of us should drop the duplicate.
- Existing content: no errors found in lessons 41–43, questions/m10.yaml or drills/m10.yaml.

## Sources
Standard results (squeeze theorem, sin x / x via unit-circle areas, power rule via the binomial theorem, differentiability implies continuity, linear approximation, Newton's method) as found in any calculus text (e.g. OpenStax Calculus Volume 1, chapters 2-4). No web pages were fetched for this round; every number was recomputed in Python. Explanations, examples and questions are original.
