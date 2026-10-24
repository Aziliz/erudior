# Round 2 notes: pc-m4 (Exponential and logarithmic functions)

`content/math/check-module.sh precalculus pc-m4`: build and checker OK, zero problems.

## Honors lessons (3)

The module has five dense core lessons, and three distinct directions were worth teaching, so I wrote three. (Algebra 2 already has honors lessons on effective rates / rule of 72, log scales and log-log power laws; these deliberately go elsewhere.)

1. `19h1-hyperbolic.md`, `pc-m4-h-hyperbolic`: **Hyperbolic functions: exponentials in disguise** (45 min). cosh/sinh/tanh as the even and odd parts of eˣ, graphs, cosh² − sinh² = 1 and the unit hyperbola (sector area t/2 stated without proof), trig/hyperbolic identity table, inverse sinh and cosh via the quadratic in u = eˣ, the catenary (cable example), history. 4 worked examples.
2. `19h2-logistic-fitting.md`, `pc-m4-h-logistic`: **Inside the logistic model: symmetry, the logit and fitting S-curves** (45 min). Midpoint form, point symmetry P(tₘ + s) + P(tₘ − s) = C with proof, solving for t, the logit as a linearization (fit with known C), the three-point method for unknown C via reciprocals, rise time ln 81 / k, Pearl and Reed's 1920 forecast as a cautionary tale. 4 worked examples.
3. `19h3-comparing-growth.md`, `pc-m4-h-growth-rates`: **Comparing growth: huge numbers, crossover points and bisection** (45 min). Comparing huge numbers with logs, counting digits, the growth hierarchy ln x ≪ xᵖ ≪ bˣ with an elementary proof from ln y ≤ y − 1, crossover of 1.1ˣ and x¹⁰, the bisection method, exponential vs. polynomial running times. 5 worked examples.

## Questions: `questions/r2-pc-m4.yaml` (67)

- Core (pc-m4-r2-q01–q25, 5 per lesson): 6 text, 3 label, 5 match, 4 order, 5 select-all, 2 multiple choice. 2 `module_quiz: true` per lesson (10).
- Honors (pc-m4-r2-h01–h42, 14 per lesson): 20 multiple choice, 5 select-all, 10 text, 3 match, 3 order, 1 label. Honors questions have no `module_quiz` (ignored in a core module).
- Multiple-choice answer positions spread over 0–3.

## Pictures and diagrams

SVG (original, with `-blank` copies for label questions; all previewed):
- `images/pc-m4-exp-features.svg` (lesson 15): growth and decay curves sharing asymptote and y-intercept.
- `images/pc-m4-log-features.svg` (lesson 16): y = log₂(x − 2) with asymptote, intercept, (4, 1), excluded region.
- `images/pc-m4-logistic-features.svg` (lesson 18): anatomy of the logistic curve from Example 4.
- `images/pc-m4-unit-hyperbola.svg` (honors 1): unit hyperbola, (cosh t, sinh t), sector, asymptotes.

Plots added: lesson 15 (2ˣ vs x²), lesson 16 (log₂, ln, log compared), lesson 17 (graph explaining the extraneous root in Example 5), lesson 18 (carbon-14 half-life curve), lesson 19 (linearized ln N vs t for Example 3); honors: hyperbolic graphs, logistic symmetry, logit line, log comparison of 1.1ˣ and x¹⁰.

Mermaid: lesson 17 "Choosing a strategy" (new short section), lesson 18 "Choosing a model" (new short section), lesson 19 model-type decision chart; honors 2 fitting chart; honors 3 bisection flowchart.

Core lessons: additions only (figures plus one or two introducing sentences each; two new short `##` sections in lessons 17 and 18 that only hold a chart). No existing text changed.

## Drills: `drills/r2-pc-m4.yaml` (9)

pc-m4-r2-hyperbolic-value, -arsinh, -catenary (honors 1); -logistic-time, -logit-rate, -three-point (honors 2); -digits, -largest-n, -bisection-steps (honors 3). Rounded answers have tolerance at least half the last place; logit-rate computes k from the rounded value shown in the prompt.

## Glossary and cards

- `glossary-r2-pc-m4.yaml` (12): hyperbolic cosine, hyperbolic sine, hyperbolic tangent, unit hyperbola, arsinh, catenary, logistic midpoint, midpoint form, logit, dominates, crossover point, bisection method. Checked against every glossary file in the course; no duplicates. ("Linearizing", bolded in honors 2, already exists.)
- `cards-r2-pc-m4.yaml` (28): 10 hyperbolic, 9 logistic, 9 comparing growth.

## For a reviewer to double-check

- History: Galileo (1638) on the chain ≈ parabola; the catenary solved in 1691 by Leibniz, Huygens and Johann Bernoulli; Riccati and Lambert (1750s–60s) for hyperbolic functions; Gateway Arch described as a modified ("weighted") inverted catenary; Verhulst 1838; Pearl and Reed 1920 forecasting about 197 million (from census data 1790–1910); U.S. passed 200 million in 1967; 2020 census over 330 million; Lucas proved 2¹²⁷ − 1 prime in 1876 and it was the largest known prime until 1951. All are standard facts from memory, not re-fetched this round.
- Stated without proof and labeled so: hyperbolic sector area t/2; eᵘ ≥ 1 + u (taken from the graph, "calculus proves it"); the three-point method is labeled sensitive to noise, and nonlinear least squares is what's used in practice.
- Numbers were recomputed in Python (crossovers 1.0097 and 685.08; bisection table; logit fit k = 0.600, A = 24.0; catenary sag 10.86 m and x = ±13.86 m; all question keys).
- Lesson 18's new chart treats exponential decay as "not leveling off at a nonzero value" (it decays toward 0); worded that way on purpose.

## Errors found in existing content

None.

## Sources

Standard definitions and identities for hyperbolic and logistic functions (the same material as OpenStax Calculus Volume 1, section 1.5, and OpenStax Precalculus 2e, chapter 4); no web pages were fetched this round. History items as listed above.
