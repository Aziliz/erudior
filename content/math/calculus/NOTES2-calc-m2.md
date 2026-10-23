# Round 2 notes: calc-m2 (The derivative)

`content/math/check-module.sh calculus calc-m2`: build and checker OK, zero problems (5 lessons, 75 questions, 10 drills).

## Honors lessons (new)

1. `lessons/08h1-numerical-derivatives.md`, id `calc-m2-h-numerical`: **Numerical derivatives: how good is a difference quotient?** (45 min, about 1,700 words). Forward, backward and central differences; exact errors for $x^3$; truncation error and order of accuracy (first vs second order) with a table for $e^x$; Richardson extrapolation (first-order and central forms); round-off error and subtractive cancellation, with the measured V-shaped error curve in double precision; choosing $h$ by balancing $Ah + B/h$ (AM-GM argument, no calculus needed); noisy sensor data. 4 worked examples, a "which quotient when" Mermaid chart, a secant plot, an SVG error graph.
2. `lessons/08h2-smoothness.md`, id `calc-m2-h-smoothness`: **How smooth is smooth? Corners, splines and strange derivatives** (45 min, about 1,700 words). One-sided derivatives and when the piece-by-piece shortcut is valid (continuity required; counterexample with a jump); $x^2\sin(1/x)$, differentiable with a discontinuous derivative; Darboux's theorem; smoothness classes $C^0 \ldots C^\infty$ with $|x|$, $x|x|$, $|x|^3$; curvature, transition curves on railways and highways, a $C^2$ join worked example; cubic splines; Weierstrass's nowhere-differentiable function and its history. 3 worked examples, a smoothness-ladder Mermaid chart, two plots, an SVG transition-curve picture.

## Core lessons (additions only)

- 06: SVG of secant vs tangent with run $h$ and rise $f(a+h) - f(a)$ (plus intro sentences); Mermaid flowchart of the five steps of a derivative from the definition.
- 07: SVG showing a smooth peak, a corner, a jump and a vertical tangent on one graph; Mermaid decision chart "Is f differentiable at a?".
- 08: Mermaid checklist "rewrite before you differentiate"; plot of $s$, $v$, $a$ for Example 4 with a sentence connecting the zeros.

## Questions (`questions/r2-calc-m2.yaml`, 41)

- Core (15, `calc-m2-r2-q01`–`q15`, 5 per lesson; 2 `module_quiz` per lesson): text 5, match 3, order 2, select-all 3, label 2 (secant/tangent, nondifferentiable features). Lesson 8 has no label question (no picture worth labeling).
- Honors (26, `calc-m2-r2-h01`–`h26`, 13 per lesson): multiple choice 14, text 4, select-all 2, match 2, order 2, label 2 (error-vs-step graph, transition curve); 6 of 13 per lesson are new types. MC answer positions 0/1/2/3 = 4/3/4/3.

## Drills (`drills/r2-calc-m2.yaml`, 4)

- `calc-m2-r2-central-error` (forward and central differences of a cubic, exact decimals; solution shows the central error is exactly $ah^2$).
- `calc-m2-r2-richardson` (Richardson on central differences generated from a hidden quartic, so the extrapolation is exact).
- `calc-m2-r2-one-sided` (left/right derivatives at a continuous seam).
- `calc-m2-r2-c2-join` ($kx^3$ joined to $Ax^2 + Bx + C$ with matching value, slope and second derivative).
Sampled 300 times each: no `+ 0`, `- -`, thousands commas or rounding glitches. Values that need 3 decimals use `:sig7` (the default placeholder format rounds to 2 decimals).

## Pictures (`images/`)

`calc-m2-secant-tangent.svg` / `-blank.svg`, `calc-m2-nondiff.svg` / `-blank.svg`, `calc-m2-step-error.svg` / `-blank.svg` (data computed in Python with IEEE double precision), `calc-m2-transition.svg` / `-blank.svg` (plan view integrated numerically: straight, clothoid, arc). All previewed, blanks previewed with markers. 4–14 KB each.

## Glossary and cards

- `glossary-r2-calc-m2.yaml` (14): forward difference, backward difference, truncation error, order of accuracy, Richardson extrapolation, round-off error, subtractive cancellation, one-sided derivative, Darboux's theorem, smoothness class, continuously differentiable, infinitely differentiable, transition curve, cubic spline. Checked against every `glossary*.yaml` in the course (including other writers' r2 files): no duplicate terms or aliases. "Central difference" was already an alias of *symmetric difference quotient*, so it is not bolded.
- `cards-r2-calc-m2.yaml` (19): 10 Numerical differentiation, 9 Smoothness.

## For a reviewer to double-check

- Error formulas $D_+ - f' \approx \frac{f''}{2}h$ and $D_c - f' \approx \frac{f'''}{6}h^2$ are stated with a forward reference to Taylor's theorem (Lesson 44) and checked exactly on $x^3$ in the lesson.
- Round-off model (about $2\varepsilon|f|/h$, best $h \approx 2\sqrt{\varepsilon}$ forward, $\approx \varepsilon^{1/3}$ central) is labeled as a rule of thumb for well-scaled functions. The error table and graph are actual double-precision results (Python `math.exp`).
- Lesson h2 uses $f'(x) = 2x\sin(1/x) - \cos(1/x)$ before the product/chain rules (Lessons 9, 11); it says so explicitly. The curvature formula is quoted, not derived, and labeled; "sideways acceleration $v^2\kappa$" ignores track tilt (stated).
- History/attribution, from standard references, not re-checked online in this session: Richardson's extrapolation (L. F. Richardson, 1911 paper); Darboux's theorem (1875); Weierstrass's example presented to the Berlin Academy in 1872 with $ab > 1 + 3\pi/2$, Hardy's 1916 relaxation to $ab \ge 1$; Ampère's 1806 attempted proof; Bolzano's earlier unpublished example (about 1830); Hermite's "lamentable plague" (1893 letter to Stieltjes); Brownian paths nowhere differentiable with probability 1; clothoid and cubic parabola as transition curves.
- Opening line of h1 was softened: GPS receivers mostly get velocity from Doppler, so it now names a motion sensor's software instead.

## Errors found in existing content

None. No existing question, drill, card or glossary entry was edited.

## Sources

Standard numerical-analysis treatments of finite differences, Richardson extrapolation and floating-point error (e.g. Burden and Faires, *Numerical Analysis*; Sauer, *Numerical Analysis*); IEEE 754 double precision; real-analysis texts for Darboux's theorem and the Weierstrass function (e.g. Abbott, *Understanding Analysis*); Hardy, "Weierstrass's non-differentiable function" (Trans. AMS, 1916); railway/highway geometric design practice for transition curves. All numbers recomputed with Python/sympy.
