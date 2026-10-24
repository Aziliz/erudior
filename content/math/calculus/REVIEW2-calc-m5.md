# Round 2 review: calc-m5 (Analyzing functions with derivatives)

Reviewer for item 33. Scope: honors lessons 20h1–20h3, the round 2 additions to lessons 17–20,
`questions/r2-calc-m5.yaml` (63), `drills/r2-calc-m5.yaml` (6), `glossary-r2-calc-m5.yaml` (16),
`cards-r2-calc-m5.yaml` (30), `images/calc-m5-*` (5 pictures + 5 blanks).

## Changes

| Where | Problem | Fix |
|---|---|---|
| `calc-m5-r2-h18` explanation | Said Jensen's equality holds "only for linear $f$ or equal $x_i$". False: a convex function that is linear on part of its domain (e.g. $\max(0, x)$ with all $x_i > 0$) gives equality with unequal $x_i$. | Now: "For a strictly convex $f$, equality holds only when the $x_i$ are all equal." (matches the lesson) |
| 20h2, tangent line theorem | Hypothesis said "$f'$ is increasing (for instance, if $f'' \ge 0$)". In this course "increasing" means strictly increasing (L18), and $f'' \ge 0$ only gives a nondecreasing $f'$ (e.g. a line, which is convex). The proof only uses $f'(c) \ge f'(a)$. | "$f'$ never decreases there (for instance, if $f'' \ge 0$)". Same wording in the Mermaid box and its `accDescr`. |
| L18, after the f′ picture | The trough of $f' = -\tfrac14(x+2)(x-1)(x-4)$ at $x = 1 - \sqrt3 \approx -0.73$ is also an inflection point of $f$, but the picture marks only the peak; a student could conclude the peak is the only one. | Added one sentence: the low point of $f'$ near $x \approx -0.73$ is a second inflection point; the picture marks only one. |
| `calc-m5-fprime.svg`, `-blank.svg` | Axis label "x" sat against the tick label "5" (read as "5x"). | Moved the "x" above the axis at the arrow tip; re-rendered. |
| drill `calc-m5-r2-ladder` solution | Display math ended in a dangling "≈" with the bold answer outside it. | Ends with ",$$" and "so the longest ladder is **{L}** ft." |

Counts: answer-key errors 0; factual fixes 2 (h18 explanation, 20h2 hypothesis); picture fixes 1 (f′ axis label); other fixes 2 (L18 clarifying sentence, ladder solution layout).

## Checked and found right (a reader might doubt)

- Every question worked independently before reading the key (all 63 keys correct): e.g. q04 ($\sqrt{x+1}$ satisfies the MVT hypotheses on $[-1,1]$: non-differentiable only at the endpoint), q09/q15 sign charts with even-power factors, h09 ($x^3 - 12x + 5$: $f(-2) = 21$, $f(2) = -11$, three roots), h28 (products $16x$, $64$, $4x^3$, $3x^3$; min 12 at $x = 2$), h32 ($\arcsin(1/3) = 19.47°$; distractors 48.59° and 20°), h38 ($16\sqrt2 \approx 22.63$), h42 ($k = 2$: 1.25).
- 20h1 numbers (Python): $10 + 1/20.1 = 10.049751$, $\sqrt{101} = 10.049876$, bound width < 0.00025; roots of $x^3 + 4x - 7$ (1.2554) and $x^4 - 4x + 1$ (0.2510, 1.4934); $x = \cos x$ at 0.739085; $\cos 0.2 = 0.980067$; $\ln 1.1 = 0.0953$. The backward racetrack argument and the isolated-zeros argument for $x - \cos x$ are correct.
- 20h2: plot points ($\ln 3.5 = 1.2528$, chord midpoint 0.8959) and labels clear of the curve and chord; can: $300\sqrt[3]{2\pi} = 553.58$, $r = (500/\pi)^{1/3} = 5.419$ (matches L20).
- 20h3: lifeguard optimum $x = 47.105$, $T = 29.543$ s, $T(20) = 32.998$, $T(60) = 30.541$, $\theta_1 = 66.99°$, $\theta_2 = 17.87°$, both ratios 0.15341 (scipy). Pond: $\theta_2 = 35.17°$. EOQ 600, cost 1200; $k = 1.2$ gives 1.0167. Ladder $\tan\theta = 0.8736$, $\theta = 41.14°$, $L = 14.047$; $13\sqrt{13} = 46.87$. Corner shape: the segment (0, 9.2415)–(10.5789, 0) passes through the inner corner (6, 4) and its slope is $\tan\theta$; the "4" and "6" width markers are right. EOQ plot labels clear of the curves.
- History: Ibn Sahl about 984 (*On Burning Mirrors and Lenses*; Rashed 1990), Snellius 1621 (unpublished), Descartes *La Dioptrique* 1637, Fermat's least-time derivation in his letter of 1 January 1662 to Cureau de la Chambre; J. L. W. V. Jensen, Acta Mathematica 30 (1906) 175–193; Ford W. Harris, "How Many Parts to Make at Once", *Factory, The Magazine of Management* 10 (1913). Fermat's principle is labeled as simplified (stationary time; not a minimum for some curved-mirror reflections), which is correct. Refractive index of water 1.33 (OpenStax University Physics Vol. 3, Table 1.1).
- Core additions: L17 Mermaid chain (EVT + Fermat ⇒ Rolle ⇒ MVT ⇒ consequences) right; L18 decision chart right; L19 sin quarters (direction from $\cos x$, concavity from $-\sin x$) and "which test" chart right; L20 procedure chart and river-fence shape right. All accTitle/accDescr describe the whole diagram.
- Pictures: all 5 rendered and all 5 blanks rendered with the questions' markers; every marker sits on the part its label names (lifeguard θ₂ marker sits on the small arc beside the water path, as the writer noted; acceptable).
- Drills: built the module and generated 400 instances of each of the 6 drills with the app's generator, re-solved each from the prompt text in Python (numpy roots, scipy minimize), typed the 2-dp rounded answer (accepted in 2400/2400) and a wrong answer (+1; rejected in 2400/2400). No "+ -", "1x", unfilled placeholders or thousands commas inside math in prompts or solutions.
- Glossary: no term or alias duplicates any other glossary file in the course. Definitions and cards correct.

## Overlap

- 20h1's $x = \cos x$ "exactly one root" case repeats the equation of 05h2 Example 2 (IVT at work), but 05h2 works on $[0, 1]$ with monotonicity of $\cos$, while 20h1 uses $f' = 1 + \sin x \ge 0$ on all of $\mathbb{R}$ with isolated zeros. Complementary, not duplicate; left as is.
- No other overlap found with 16h1/16h2, calc-h1 (90–93) or the other NOTES2 files.

## Left uncertain

- Nothing material. The "racetrack principle" name is used by Hughes-Hallett et al.; the lesson already says only some books use it.

`content/math/check-module.sh calculus calc-m5`: OK (zero problems).
