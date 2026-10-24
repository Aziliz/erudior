# Round 2 review: pc-m10 (Introduction to limits and the derivative)

Reviewer, independent of the writer. Scope: honors lessons 43h1 and 43h2, the round 2 additions to lessons 41–43, `questions/r2-pc-m10.yaml` (44), `drills/r2-pc-m10.yaml` (6), `glossary-r2-pc-m10.yaml` (8), `cards-r2-pc-m10.yaml` (20), and `images/pc-m10-*` (3 SVGs plus blank copies). `content/math/check-module.sh precalculus pc-m10` reports OK, zero problems, after the fixes.

## Changes

### Answer key / explanations
- **pc-m10-r2-h11** (slope of sin x at π/3): the explanation said the distractor $-\frac12$ "would come from using $-\sin$ or $-\cos$". $-\sin\frac{\pi}{3} = -\frac{\sqrt3}{2}$, not $-\frac12$, so half the explanation was wrong. Now: $-\frac12$ has the wrong sign; the minus sign belongs to the derivative of $\cos x$. The key (index 3, $\frac12$) was already right.

### Factual / wording fixes
- **43h2, "Linear approximation"**: "halve the step and the error drops by much more than half" overstated what the argument shows. The bracket going to 0 only proves error/h → 0; it does not guarantee any particular ratio when the step is halved. Replaced with: error/h → 0, and for the functions students meet the error is roughly proportional to $h^2$, so halving the step cuts it to about a quarter. Checked in Python: √4.05 from a = 4 has error 3.9e-5 against 1.54e-4 for √4.1 (ratio 0.25), and 1.01^10 has error 0.00462 against 0.0190 (ratio 0.24).
- **43h2, "Differentiable functions are continuous"**: "|h|/h ... (Lesson 42, Example 5)". That example is $\frac{|x-2|}{x-2}$ at 2, not $\frac{|h|}{h}$. Changed to "(the same split as Lesson 42, Example 5)".
- **glossary-r2-pc-m10 "power rule"**: lessons 16 and 17 use "power rule" for the logarithm rule $\log_b x^p = p\log_b x$, so a glossary lookup there would show the derivative rule. Added a note to the definition saying it is not the logarithm power rule.
- **glossary-r2-pc-m10 "sum rule"**: lesson 39 uses "sum rule" for Pascal's triangle. Added a note to the definition about that meaning.

### Picture fixes
- **pc-m10-r2-q01 (label, discontinuities)**: marker 1 at (26.5, 46.5) sat exactly on the open dot and hid the hole, which is the feature it asks about. Moved it to (26.5, 37.2), between the hole (height 2) and the filled dot f(−2) = 4, the same way marker 2 sits between the two dots of the jump. Updated the alt text to match.
- **pc-m10-squeeze-circle.svg and -blank.svg**: the "P" label was crossed by the unit-circle arc. Moved it to (333, 152), centered, in the gap between the arc and segment OT.
- **43 plot of |x|**: the point label "corner: slope −1 on the left, 1 on the right" ran over the right branch and was cut off at the edge. Replaced it with free labels: "slope −1" and "slope 1" beside the branches and "corner at (0, 0)" below the axis.
- **43h1 plot of x² sin(1/x)**: the three curve labels piled up at the top right and lay on the dashed parabola. Took the curve labels off and put "y = x²" and "y = −x²" next to their parabolas; the caption already names the solid curve.
- **43h1 plot of sin x with tangents**: "(π/3, √3/2)" and "y = sin x" lay on the curve. Moved both to free labels in empty space.
- **43h2 Newton plot**: "(1, −1)" lay on the curve and tangent, and "x₁ = 1.5" lay on the tangent. Moved both to free labels clear of the lines.
All of these were re-rendered with `preview-plots.mjs` / `preview-figure.mjs` and inspected.

### Drill fixes
- **pc-m10-r2-sin-ratio**: with a or b = 1 the prompt and solution printed "sin 1x" and "1x". Changed the ranges to 2–9.
- **pc-m10-r2-one-minus-cos**: with k = 1 or c = 1 the prompt printed "cos 1x" or "1x^2". Changed the ranges to k 2–6 and c 2–5.
- **pc-m10-r2-poly-slope**: d = 0 printed "+ 0" at the end of the polynomial. Added `d != 0`.

## Checked and found right (a reader might doubt these)
- All 44 questions were worked before I looked at the keys. Every MC key, select-all set, order and match pairing is correct and unique. Text accepts are complete: h24 accepts 91/30, 3.0333 and 3.03333, and mixed numbers or other equal values compare by value.
- Numbers, recomputed in Python/sympy: sin 0.05/sin 0.03 = 1.66622. (1 − cos 0.01)/0.0001 = 0.4999958. cos 0.5 = 0.8776 < 0.9589 and 0.99500 < 0.99833. π/180 = 0.017453. √4.1 = 2.024846. 1.02^10 = 1.21899. √9.2 = 3.03315. 1.01^8 = 1.08286. f(2/3) = −161/27 and f(1) = −6 in 43h2 Example 2. Newton iterates for √2 are 1.5, 17/12 and 577/408, then 1.41421356237469, giving 0, 2, 5 and 11 correct decimals. A geometric check of the circle SVG: angle 45.8°, OB/OA = 0.697 = cos, AT/OA = 1.030 = tan.
- Drills: limits checked symbolically for every (a, b) and (k, c) in range. Every Newton `c` choice has at least one valid x0. Tolerances: 0.0051 for 2 dp and 0.000051 for 4 dp, both at least half the last place. Linear-approximation worst-case error is 0.0037, so the "true value" note makes sense.
- The unit-circle proof is labeled as a geometric proof, not a proof from axioms. The power rule is labeled as proved only for positive integers. Both labels are appropriate.
- History: Newton's version is in *De analysi* (written 1669, published 1711). Raphson's *Analysis aequationum universalis* is from 1690. Heron of Alexandria (1st century CE, *Metrica*) gives the averaging step for square roots. Sources: T. J. Ypma, "Historical development of the Newton–Raphson method," SIAM Review 37(4), 1995; MacTutor History of Mathematics biographies of Heron and Raphson.
- Mermaid diagrams: 3 in the core lessons, 1 in 43h1 and 2 in 43h2. All six were rendered and are correct, and their accTitle/accDescr describe the whole diagram. The "which method" chart in lesson 42 says direct substitution gives the limit. That is right for the continuous functions the lesson covers.
- Glossary: none of the 8 terms or their aliases duplicates any `glossary*.yaml` in the course. Cards are correct.
- SVGs: content is right (hole/jump/asymptote/continuous point; secant, tangent, run, rise; nested triangle–sector–triangle), and all label markers sit on the parts their labels name.

## Overlap
None found with pc-h1 (proof, infinity, series, area) or the pc-m9 honors lessons. The pc-h1 writer also checked and found none.

## Left as is / uncertain
- Lesson 43 secant/tangent plot from round 1 (out of scope): its "P (2, 4)" and "Q" labels touch the lines. This is cosmetic.
- 43h2 plot of ∛x: the dashed vertical tangent is the y-axis, so it overlays the axis, and the auto tick "−0.5" touches the curve. This is unavoidable without hiding the axis, and it is readable.
- The renderer places some tick labels under points (for example "1.4" under the open dot in the Newton plot). This is app behavior, not content.

## Counts
Answer-key errors: 1 (an explanation error in h11; no wrong keys). Factual fixes: 4 (2 in the lesson, 2 glossary disambiguations). Picture fixes: 6 (1 label marker, 1 SVG, 4 plots). Other fixes: 3 (drills).
