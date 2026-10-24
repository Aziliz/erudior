# REVIEW2-a1-h1: Honors module a1-h1, Algebraic reasoning and modeling

Reviewer for item 8. Scope: lessons 90–93, `questions/r2-a1-h1.yaml` (h01–h60), `drills/r2-a1-h1.yaml` (10), `glossary-r2-a1-h1.yaml` (21), `cards-r2-a1-h1.yaml` (37), `images/a1-h1-*` (6). Every question worked before reading the key; every lesson number recomputed in Python; every SVG, Mermaid diagram and plot rendered and looked at; every drill generated 1,500 times and checked against an independent calculation.

`content/math/check-module.sh algebra1 a1-h1` after the fixes: **zero problems** (4 lessons, 60 questions, 10 drills, 37 cards).

## Changes

### Questions
| Id | Problem | Fix |
|---|---|---|
| a1-h1-r2-h56 (order) | The items were symbolic ("Find $E = d/(1-r)$", "Find $a_1 - E$", "Write $a_n = E + (a_1 - E)r^{n-1}$", "Substitute"). The general formula can be written before $E$ or $a_1 - E$ is computed, so more than one order was defensible. | Made it concrete ($a_1 = 50$, $a_n = 0.5a_{n-1} + 30$): $E = 60$ → $a_1 - E = -10$ → $a_n = 60 - 10(0.5)^{n-1}$ → $a_{20} \approx 59.99998$. Each step now uses the previous step's number, so only one order works. Explanation updated. |
| a1-h1-r2-h52 | Explanation said \$618.18 "gives every deposit three months of interest". That gives $200(1.01^3 + 1.01^2 + 1.01) = 612.08$, not 618.18. 618.18 is $600 \times 1.01^3$. | Explanation now says \$618.18 gives all \$600 three months of interest ($600 \times 1.01^3$). Key (\$606.02) was right. |

### Lessons
| Lesson / section | Problem | Fix |
|---|---|---|
| 91, "Steps that can be undone" + Key points | "Adding … the same number or expression on both sides is reversible" is false for expressions that are undefined somewhere (adding $1/x$ to both sides of $x = 0$ loses the solution). | Added: the expression must make sense for every value of the variable, as $2x$ or $x^2$ does; adding $\tfrac1x$ would rule out $x = 0$. Key point now says "adding the same number or polynomial". |
| 91, same section | "Two kinds of steps are not reversible" introduced a table of four steps. | "Some steps are not reversible in general. They can lose solutions or add them:" |
| 92, Example 1 step 3 | "it matches the reaction distances that driver handbooks commonly list": unsourced, and handbooks vary (many list 0.75 s). | Replaced with a checkable comparison: US highway design (AASHTO, *A Policy on Geometric Design of Highways and Streets*) allows 2.5 s brake reaction time, chosen to cover most drivers, so 1.5 s is realistic. Source: AASHTO Green Book; summary at https://en.wikipedia.org/wiki/Stopping_sight_distance. |
| 92, "Choosing the type of function" | "The graph is an exponential decay curve moved up by $L$" is only true for $a > 0$, but the same paragraph lists warming drinks and rising test scores ($a < 0$). | Now: for $a > 0$ it's decay moved up by $L$; for $a < 0$ it's that curve flipped, rising toward $L$. |

### Pictures and plots
| Figure | Problem | Fix |
|---|---|---|
| `a1-h1-modeling-cycle.svg` and `-blank.svg` | "good" sat above the Validate→Report arrow and "enough" below it, so it read as two labels. | Both words moved above the arrow (y 304 / 322). Re-rendered; label markers unchanged and still centered on the six boxes. |
| Lesson 91 plot ($\sqrt{x+6}$, $y = x$, $y = -x$) | The curve label "y = √(x + 6)" overlapped the line $y = x$ and the point label "(3, 3): real solution", which was cut off at the right edge. The "(−2, 2): solves …" label sat on the $\sqrt{}$ curve, and "y = −x" sat on its own dashed line. | Curve labels for $\sqrt{x+6}$ and $-x$ and both point labels replaced with placed `labels` in clear space: "y = √(x + 6)", "(3, 3)", "(−2, 2)", "y = −x". The explanation moved into the caption. Rendered and checked. |
| Lesson 92 coffee plot | "revised: …" and "room temperature 20 °C" were drawn on top of each other at the right edge, and "first try: …" sat on its own dashed curve and the x-axis title. | Replaced the curve labels with placed labels ("revised model", "first try", "room temperature 20 °C"). The first-try curve is now drawn to $t = 40$, by which point it has clearly dropped below 20 °C. Formulas moved into the caption. |
| Lesson 93 fish plot | "start 1400" label sat on the dashed curve and the points near $n = 9$–10. | Placed the label at (3, 1080), under the lower curve. |

Medicine plot (lesson 93), all four SVGs' content and all four Mermaid diagrams were already correct and readable.

### Drills
| Drill | Problem | Fix |
|---|---|---|
| a1-h1-r2-savings | The solution showed $(1+i)^n$ to 4 decimals and multiplied by $-E$ (up to 200,000). The shown product could miss the bolded answer by several dollars, so a student copying the method could be wrong. | Power and power − 1 shown with `dp8` (error at most \$0.001), plus a note to keep every calculator digit. |
| a1-h1-r2-consecutive-sum | "There are 1 integers below the middle one" (for cnt = 3). | "The smallest integer is $(3 - 1) \div 2 = 1$ below the middle one, so it is …" |
| a1-h1-r2-unit-convert | "a reaction time of 1 seconds". | "a reaction time of {tt} s". |

### Glossary and cards
- `reversible step`: "adding the same expression" changed to "adding the same number or polynomial" (same reason as lesson 91).
- `stable equilibrium` / `unstable equilibrium`: added "with $r > 0$". The conditions $0 < r < 1$ and $r > 1$ are only complete for positive $r$, which is the lesson's stated restriction.
- Cards: "Which solving steps are reversible?" got the same number-or-polynomial wording, and "Stable vs unstable equilibrium" got "With $r > 0$".

## Checked and found right (things a reader might doubt)
- $n^2 + n + 41$ is prime for $n = 0$–39 and $40^2 + 40 + 41 = 1681 = 41^2$ (sympy). Euler, 1772 letter: "wrote about this expression in the 1700s" is accurate.
- $x^2 - y^2 \equiv 2 \pmod 4$ is impossible (the factors $x \pm y$ have the same parity). The extension to 6, 10, 14, … is correct. $6x + 9y = 100$ has no integer solutions.
- Lesson 90: $x = 0$ and $x = 1$ are counterexamples to $x^2 > x$. Odd squares are $8m + 1$. h04 uses $\ge$, so only $\tfrac13$ is a counterexample among the choices.
- Lesson 91: $\sqrt{x+6} = x$ → 3 (−2 extraneous). $\sqrt{x-3} + 5 = x$ → 7. $|2x - 1| = x - 5$ has no solution: $|2x - 1| - (x - 5)$ is $x + 4 > 0$ for $x \ge \tfrac12$ and $6 - 3x > 0$ for $x < \tfrac12$. h18, h19, h21, h29 re-solved: keys right.
- Lesson 92: 60 mi/h = 88 ft/s; 1.5 s → 132 ft; NBA court 94 ft. Shower estimate 17,520 / 21,900 / 13,140 gal. US maximum of 2.5 gal/min for new showerheads (Energy Policy Act of 1992, at 80 psi). Coffee: $90(55/90)^3 = 20.54$, $90(55/90)^2 = 33.6$; revised model gives 69.50, 44.75, 37.5, 28.75. The made-up data (70/45/37) are consistent with it.
- Lesson 93: dose table $a_1$–$a_{10}$ (200, 280, 312, 324.8, 329.92, 331.97, 332.79, 333.11, 333.25, 333.30) and plot points. "Within 1 mg" first at $n = 7$ (distances 1.365 at $n = 6$, 0.546 at $n = 7$); 7th dose at 48 h. Fish table to $n = 10$ and plot points. Savings $20{,}000(1.005^{24} - 1) = 2{,}543.20$, matching 24 direct iterations.
- All 60 keys and every distractor explanation (except h52, fixed). The answer index spread is even. 20 questions are `module_quiz` (5 per lesson). Label markers match the parts their labels name in all three blank SVGs.
- Drills (1,500 instances each, independent recomputation from the prompt text: brute-force integer search for both radical drills, direct iteration for iterate and savings, direct formulas otherwise): every exact and correctly rounded answer accepted, every answer + 1 rejected. There is exactly one valid and one extraneous root in every radical instance. No unfilled placeholders, "+ -", "1x" or long decimals (except the intended `dp8` in savings).
- Glossary: no term or alias duplicates any `glossary*.yaml` in the course.

## Overlap with other round 2 lessons (not changed; for the editor)
- **Lesson 91 Example 4 / 07h1-abs-cases (alg-m2):** 07h1 already teaches extraneous solutions of $|u| = v$, with the same $v \ge 0$ test. Lesson 91's version is short and framed as an equivalence example, but it is a repeat. 07h1 also bolds **extraneous solution**, whose only glossary entry is in `glossary-r2-a1-h1.yaml`. If a1-h1 is ever dropped, alg-m2 needs that entry.
- **Lesson 90 / 05h1-decimals-fractions (alg-m1) and 32h1-irrational-roots (a1-m7):** both already introduce proof by contradiction. 05h1 calls itself "your first proof by contradiction". Lesson 90 introduces it again from scratch with different examples. Its term entry lives in `glossary-r2-a1-m7.yaml`.
- **Lesson 90 / 21h2-binomial-expansion (alg-m5):** 21h2 already disproves $(a+b)^3 = a^3 + b^3$ with $a = b = 1$, and lesson 90 does the same for $(a+b)^2$. 21h2 points forward to lesson 90, so this is mild.
- **Lesson 93 Example 3 / 32h3-series (a1-m7):** both compute a savings balance with regular deposits, 93 via the equilibrium and 32h3 via a geometric series. They complement each other, as the writer noted.

## Left uncertain
- The plot previews were made by inlining the app's `styles.css` figure rules into the `renderFigure` output. Label spacing in the app should match, but fonts on a real device may be a few pixels wider.
