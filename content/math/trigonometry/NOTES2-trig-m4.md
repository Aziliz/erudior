# Round 2 notes: trig-m4 (Graphs of trig functions)

`content/math/check-module.sh trigonometry trig-m4`: builds and checks with 0 problems (7 lessons, 112 questions, 16 drills, 47 cards).

## Honors lessons (new)

- `lessons/17h1-combining-graphs.md`: **Sums, products and envelopes: combining trig graphs** (id `trig-m4-h-combining`, 45 min, about 1,780 words of prose). Covers addition of ordinates; the period of a sum (least common multiple of the periods via the ratio $p/q = m/n$, $L = np = mq$), with a "usually the smallest period" caveat and the counterexample $|\sin x| + |\cos x|$ (period $\pi/2$); non-periodic sums when the ratio is irrational ($\sin x + \sin\sqrt2 x$); products and envelopes ($f(x)\sin x$ between $\pm|f(x)|$, touching where $\sin x = \pm1$), including that the peaks of $x\sin x$ are not at the touching points; damped waves; $\tfrac{\sin x}{x}$ near 0. 5 examples: $x + \sin x$; $\sin x + \sin 2x$ (table); periods of $\sin\tfrac{\pi x}{3} + \cos\tfrac{\pi x}{2}$ and $\sin 2x + \cos 3x$; $x\sin x$; how long $3e^{-0.2t}\cos 2\pi t$ lasts.
- `lessons/17h2-rates-of-change.md`: **How fast a sinusoid changes: slopes, speeds and the pendulum** (id `trig-m4-h-rates`, 50 min, about 1,820 words). Covers average rate of change, difference quotients, a table showing the slope of $\sin x$ matches $\cos x$, the argument that the slope of $\sin x$ is $\cos x$ (sum formula plus the two small-angle limits), the slope of $\cos x$ by the shift, slopes of $A\sin(B(x - C)) + D$ and the steepest slope $|A|B$, velocity in simple harmonic motion, and the small-swing pendulum $T = 2\pi\sqrt{L/g}$. 6 examples: average rates of sine; slope of $3\sin 2x$ at $\pi/6$; the Ferris wheel's fastest rise (checked against $r\omega$ from Lesson 4); the rule of twelfths against Lesson 17's tide model; the Lesson 17 spring's speed; the seconds pendulum.

## Core lessons (additions only, nothing rewritten)

- 13: "unrolling the unit circle" picture (SVG) with two introducing sentences.
- 14: Mermaid flowchart of the four graphing steps (one introducing line); labeled sinusoid-parts picture (SVG) with one introducing sentence before the summary table.
- 15: labeled tangent-branch picture (SVG); Mermaid flowchart for the features of transformed tangent and cotangent graphs, with a two-sentence lead-in (the cotangent center is half a period after $C$).
- 16: Mermaid flowchart for graphing sec/csc from the guide curve ("As a procedure:"); secant-from-cosine picture (SVG).
- 17: Mermaid decision chart choosing $A\cos$, $-A\cos$, $A\sin$, $-A\sin$ from the known moment (two introducing sentences); Ferris wheel picture (SVG) in Example 2.

## Pictures and diagrams

- 7 SVGs, all original, each with a `-blank` copy used by a label question (14 files, 4–16 KB): `trig-m4-unroll`, `trig-m4-sinusoid-parts`, `trig-m4-tan-branch`, `trig-m4-sec-guide`, `trig-m4-ferris`, `trig-m4-envelope`, `trig-m4-slopes` (plus the blanks). Curves are computed from the real functions. All were rendered and inspected, and every blank was rendered with its label markers to confirm each marker sits on its part.
- 5 Mermaid diagrams (all `flowchart TD`, accTitle/accDescr, `#gt;` for >): lessons 14, 15, 16, 17 and the period-of-a-sum chart in 17h1. All were rendered and checked.
- 5 new plots in the honors lessons: $x + \sin x$, $\sin x + \sin 2x$, $\tfrac{\sin x}{x}$ with its envelope, and $\sin x$ with $\cos x$ as its slope.

## Questions (`questions/r2-trig-m4.yaml`, 55)

- Core (25, `trig-m4-r2-q01`–`q25`, 5 per lesson): label 5 (q01, q06, q11, q16, q21), text 5 (q02, q07, q12, q17, q22), order 5 (q03, q08, q15, q18, q25), match 5 (q05, q10, q13, q20, q23), select-all 5 (q04, q09, q14, q19, q24). module_quiz: q01, q04, q06, q09, q11, q14, q16, q19, q21, q23 (2 per lesson).
- Honors, combining graphs (15, h01–h15): 10 MC (answer positions 0:2, 1:2, 2:3, 3:3), then text h11, match h12, select-all h13, label h14, order h15.
- Honors, rates (15, h16–h30): 10 MC (0:2, 1:2, 2:3, 3:3), then text h26, match h27, select-all h28, order h29, label h30.
- Honors questions have no `module_quiz`. Order questions were checked for a single possible order; match/label answers are plain text.

## Drills (`drills/r2-trig-m4.yaml`, 6)

- 17h1: `trig-m4-r2-sum-period` (periods of $\sin\tfrac{\pi x}{a}$ and $\cos\tfrac{\pi x}{b}$ and the LCM; $a \ne b$, so the LCM is the smallest period), `trig-m4-r2-envelope` (envelope height at a time, and time to fall to 50/25/10/5%; 2 dp, tolerance 0.006).
- 17h2: `trig-m4-r2-avg-rate` (3 dp, tolerance 0.0011 so a learner who rounds the two heights to 4 decimals first is still accepted), `trig-m4-r2-slope-at` ($AB\cos(Bx)$ or $-AB\sin(Bx)$, 3 dp, tolerance 0.0006; slopes within 0.01 of 0 excluded so "-0.000" never shows), `trig-m4-r2-max-rate` (fastest increase $2\pi A/P$ and the time of the upward midline crossing $C + 3P/4$), `trig-m4-r2-pendulum` (period from length and length from period, $g = 9.81$, 2 dp, tolerance 0.006).
- Verification: 400 instances of each were generated with `generate()` on the built JSON, and every answer was recomputed independently in Python (LCM by `math.lcm`, slopes by central differences, the max-rate time by brute-force search over a period). 0 mismatches; every answer rounded as the prompt asks falls inside its tolerance.

## Glossary and cards

- `glossary-r2-trig-m4.yaml` (9): addition of ordinates, least common multiple (LCM), envelope, average rate of change, difference quotient, slope of the curve, steepest slope, rule of twelfths, velocity. Every term and alias was checked against every `glossary*.yaml` in the course (including the other round 2 files): no duplicates.
- `cards-r2-trig-m4.yaml` (23): 11 on Combining trig graphs, 8 on Rates of change of sinusoids, 4 on Oscillation speed.

## For the reviewer

- **Overlap avoided.** I first drafted a small-angle lesson, then found the trig-m3 writer's `12h2-small-angles.md` already proves $\sin t < t < \tan t$, $\tfrac{\sin t}{t} \to 1$ and $\cos t \approx 1 - \tfrac{t^2}{2}$ with error sizes. I replaced it with the rates lesson, which cites 12h2 for those two limits instead of reproving them (17h1 also points to 12h2 for $\tfrac{\sin x}{x} \to 1$). If 12h2 is renamed or dropped, those two pointers ("the Module 3 honors lesson on small angles") need updating. The phasors lesson (`91`) adds same-frequency waves; 17h1 deals with different frequencies, so they don't overlap.
- Stated without proof and labeled as such: that $\sin x + \sin(\sqrt2 x)$ is not periodic (the lesson notes a proof needs the Module 6 sum formulas), the two limits used in the slope argument, and the pendulum formula (taken from physics).
- "The LCM is usually the smallest period" is hedged in the text, with a counterexample. For two sinusoids with different frequencies it is exactly the smallest period; every question and the drill use such pairs.
- Pendulum period increase for larger swings (0.2% at 10°, 1.7% at 30°, 18% at 90°) was computed from the exact elliptic-integral formula $T/T_0 = \tfrac{2}{\pi}K(\sin\tfrac{\theta_0}{2})$ with scipy.
- The rule of twelfths is labeled a rule of thumb, and the lesson repeats Lesson 17's caveat that real tides are only roughly sinusoidal.
- The $\tfrac{\sin x}{x}$ plot is evaluated across $x = 0$. The checker renders it without problems, but a reviewer may want to look at it in the app.

## Errors found in existing content

None. No existing question, drill, card or glossary entry was edited.

## Sources

- Standard results (graphs and transformations of sinusoids, reciprocal graphs, simple harmonic motion) as in OpenStax *Precalculus 2e* ch. 6 and *Calculus Volume 1* §3.5 (derivative of sine via the sum formula and the two trig limits), which the course's VERIFY.md also uses. All explanations, examples and questions are original.
- Pendulum: $T = 2\pi\sqrt{L/g}$ for small amplitudes, as in OpenStax *University Physics Volume 1* §15.4; the large-amplitude correction is the standard complete-elliptic-integral result. The seconds-pendulum length $g/\pi^2 \approx 0.994$ m was computed with $g = 9.81$ m/s².
- Rule of twelfths: a standard navigation rule of thumb; the sinusoid comparison was computed here.
- All numbers in the lessons, questions and drills were recomputed in Python (scripts in /tmp/r2-trig-m4).
