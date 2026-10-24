# Round 2 review: a2-m9 (Introduction to trigonometry)

Reviewed independently: honors lessons 30h1 (tangent and reciprocal functions) and 30h2 (inverse trig and equations), the additions to 29-unit-circle and 30-sine-cosine-graphs, `questions/r2-a2-m9.yaml` (40), `drills/r2-a2-m9.yaml` (6), `glossary-r2-a2-m9.yaml` (8), `cards-r2-a2-m9.yaml` (20) and the 7 `images/a2-m9-*` SVGs. `content/math/check-module.sh algebra2 a2-m9`: 0 problems after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| Drill `a2-m9-r2-model-when`, solution | The last line subtracted the 2-decimal times but showed the answer computed from unrounded times, so the shown arithmetic was often off by 0.01 (e.g. "3.70 − 2.30 ≈ 1.41"). This would confuse a learner checking the work. | The intermediate times are now shown to 4 decimals (`{t1:dp4}`, `{t2:dp4}`), so the subtraction matches the bold answer, and a short note says to keep unrounded times until the end. Answers and tolerances not changed. |
| `images/a2-m9-sinusoid-parts.svg` | The "midline" label sat on the curve where it crosses the midline, and the halo hid part of the curve. The "maximum" label was very close to the rising curve. | Moved "midline" to x = 520 (on the dashed line, clear of the curve) and raised "maximum" 5 px. Re-rendered and checked. The blank copy and q07's markers were not affected. |
| 30h1, "Why it is called tangent" | "The same similar triangles give the length of OT as 1/cos θ". That is a signed value, and it is only the length in quadrant I. | Added "For an angle in quadrant I, as in the picture," before it. |
| q `a2-m9-r2-h25` (text) | Accepted `60` and `-90` but not `60°` / `-90°`. q03 in the same file accepts `150°`. | Added `60°`, `-90°` and `−90°`. |

## Checked and found right (a reader might doubt these)

- **Every question was worked before I looked at the key.** All 40 keys are right. The select-all sets (q06, q11, h12, h28) contain exactly the true options. The order questions (q04, q09, h14, h26) each have only one valid order. In q04, the quadrant has to come before the reference angle because $180^\circ - \theta$ is the quadrant II formula. The h14 tangent values come out as −5.671, −0.176, 0.176, 1.192 and 11.43. The match and label pairings are unambiguous.
- **Lesson numbers (recomputed in Python):**
  - $\arccos 0.3 = 1.2661$ and $2\pi - 1.2661 = 5.0171$.
  - $\arccos(-0.4) = 113.58^\circ$ and $246.42^\circ$. The distractor pairs (66.4/293.6 and 23.6/156.4) are correct for $\cos x = 0.4$ and $\sin x = 0.4$.
  - $\arcsin\tfrac13 = 0.3398$ and $\pi - 0.3398 = 2.8018$.
  - All six functions of 240°, Example 3 ($\tan\theta = 2$ in quadrant III) and the angle of inclination of 135° are correct.
  - Ferris-wheel Example 5 and h23: $t = 10/3$, $20/3$, $5/3$ and $25/3$. The wheel model matches Example 3 of lesson 30, as the text says.
- **Fincke attribution.** MacTutor (https://mathshistory.st-andrews.ac.uk/Biographies/Fincke/) says Fincke's *Geometriae rotundi libri XIIII* (Basel, 1583) introduced the terms tangent and secant, and it calls him a Danish doctor. He was born in Flensburg, then under Danish rule. The lesson's wording is fine. *Secare* = "to cut" is right.
- **Principal-value ranges, domains, the $\sin^{-1}$ notation and the general-solution formulas** match OpenStax *Precalculus 2e* §6.3 and §7.5. The lesson calls the restricted ranges conventions.
- The claim that **csc x is sec x shifted π/2 to the right** is correct ($\csc x = \sec(x - \tfrac{\pi}{2})$).
- **Drills.** I generated 600 seeded instances of each drill from the built course (1,560 distinct problems) and recomputed every answer independently in Python:
  - exact surd strings for the reciprocal drill;
  - exact `Fraction` arithmetic for the Pythagorean drill, checking that $\sin^2 + \cos^2 = 1$ and the quadrant signs;
  - reconstructed principal values for the inverse drill;
  - both solutions of the basic-equation drill, checked by substituting back;
  - bisection on $h(t)$ for the Ferris-wheel drill.

  I fed the answers to the app's own `checkAll`:
  - **Right answers:** every correct answer was accepted, as an exact string (`sqrt(3)/3`, `pi/10`, `-7/25`) and as a 3-decimal value.
  - **Ferris-wheel rounding:** for "time above", the value from subtracting the two rounded times was also accepted.
  - **Wrong answers:** none were accepted. These were: sign flips, sec↔csc swaps, a $2\pi/b$ period, the wrong asymptote, off by $2\pi$, the two solutions swapped, off by 0.15°, $T - t_1$ given as the time above, and $t_1$ off by 0.02.

  I found no placeholder leaks, "+ -" or "1x" in prompts or solutions.
- **Pictures.** All 7 SVGs were rendered and the 3 label questions were checked with their markers (q01, q07, h13). Every marker sits on the part its label names. The geometry is right: P is on the circle, and O, P and T are collinear.
- **Mermaid.** All 4 diagrams were rendered. Their content is correct, and each `accDescr` describes the whole diagram.
- **Plots.** I checked the plots by reasoning, because the preview script does not render plot blocks. The tan plot's free labels "x = π/2" at (2.5, −3.5) and "x = −π/2" at (−2.55, −3.5) are 0.2 or more units from the curve (tan crosses −3.5 at x ≈ 1.85). The other plots use only point labels and function labels. The functions and captions are correct.
- **Glossary and cards.** All 8 definitions and 20 cards are correct. No term or alias duplicates another glossary file. a2-h1 defines "secant line" (aliases: secant lines), which is a different term from "secant".

## Overlap

- a2-h1 lesson 92 (polar form of complex numbers) uses $\tan^{-1}$ and says a calculator returns angles from −90° to 90°. That is consistent with 30h2's arctan range, and it is a brief use, not a second lesson on the topic. a2-h1 lesson 93 teaches secant *lines* (calculus sense), which is unrelated to the secant function. Neither repeats this module's lessons, and no files were changed.

## Left uncertain / minor

- Distractor explanation in h01 for $-\tfrac12$ ("uses a reference angle of 30° for sine alone") is terse but names a real mistake; left as is.
- The 30° row of the reciprocal drill's solution says "$\csc\theta = 2$ (rationalized)", although nothing needed rationalizing. This is harmless and I left it.

Counts: answer-key errors 0; factual fixes 1 (OT length qualifier); picture fixes 1; other fixes 2 (drill solution arithmetic, h25 accept list).
