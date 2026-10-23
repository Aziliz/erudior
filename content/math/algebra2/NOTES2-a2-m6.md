# Algebra 2, module a2-m6 (Exponential and logarithmic functions), round 2: writer notes

## Honors lessons (2)

- `lessons/22h1-continuous-growth.md`: **Continuous growth rates, e and effective yield** (id `a2-m6-h-continuous-growth`, 45 min, about 1,540 words of prose).
  - Covers rewriting $ab^t$ as $ae^{kt}$ with $k = \ln b$, and why $k < r$ for growth.
  - Derives $(1 + r/n)^{nt} \to e^{rt}$ by substituting $m = n/r$. The series for $e$ is previewed, labeled as a calculus fact.
  - Nominal rate vs effective annual rate / APY, with the Truth in Savings Act disclosure noted.
  - Exact doubling time and where the rule of 72 comes from: $\ln(1 + r) \approx r$, and $R \cdot T \approx 72.05$ at 8%. It is labeled a rule of thumb and "usually traced to" Pacioli (1494).
  - Decay constant $\lambda = \ln 2/h$, and radiocarbon dating. The method is labeled simplified: calibration curves, the 5,568-year Libby half-life convention, and a limit of about 50,000 years.
  - 4 worked examples, 1 Mermaid conversion diagram, and 1 plot of $(1 + 1/n)^n \to e$.
- `lessons/22h2-log-scales.md`: **Logarithmic scales and fitting models to data** (id `a2-m6-h-log-scales`, 45 min, about 1,520 words of prose).
  - Logarithmic scales, illustrated with an SVG.
  - Decibels: $L = 10\log(I/I_0)$, +3 dB for doubling the intensity.
  - Earthquake magnitudes: Richter 1935 amplitude ×10 per unit vs moment magnitude, about 32× energy per unit. Both are flagged as simplifications.
  - Semi-log graphs and linearizing exponential data, with a worked bacteria data set.
  - Fitting $ab^x$ through two points.
  - Log-log graphs for power laws, with planetary data showing $T = a^{1.5}$ (Kepler's third law) and a Neptune prediction.
  - A "linear, exponential or power?" decision chart.
  - 4 worked examples, 2 plots (semi-log and log-log), 1 SVG and 1 Mermaid diagram.
  - The Module 4 honors lesson `14h2-power-laws` (another writer) already defines power functions and power laws, uses Kepler as an example, and says that general exponents need "logarithms (Module 6)". This lesson picks up that thread: it refers back to that lesson, does not re-bold or re-define those terms, and uses Kepler only to show how to discover the exponent from data on a log-log graph.

## Core lesson additions (additions only; no existing text changed)

| Lesson | Added |
|---|---|
| 20-exponential-functions | Plot comparing $y = 2x$ and $y = 2^x$ (after the table); labeled SVG `a2-m6-exp-graph.svg` (intercept, asymptote, growth and decay curves, ×2 staircase); Mermaid "choosing an exponential model" chart |
| 21-logarithms | Labeled SVG `a2-m6-log-parts.svg` (base / argument / value ↔ exponential form) before the conversion table; Mermaid "how to evaluate a logarithm" chart after Example 5 |
| 22-exp-log-equations | Plot of $y = 3^x$ meeting $y = 10$ after Example 3; new section "Choosing a method" with a Mermaid method chart before Common mistakes |

## Questions: `questions/r2-a2-m6.yaml` (43)

- Core (15): a2-m6-r2-q01–q15, 5 per lesson.
  - By type: 3 text (one with two blanks), 3 order, 3 match, 3 select-all, 2 label (q01 exp graph, q06 log parts), plus 1 more text in lesson 22 (q15).
  - Lesson 22 has no label question: its pictures are a plot and a flowchart, with nothing worth labeling.
  - `module_quiz: true` on q01, q05, q06, q09 and q13 (2 / 2 / 1 per lesson).
- Honors (28): a2-m6-r2-h01–h14 (continuous growth) and h15–h28 (log scales).
  - 17 multiple choice: answer positions 0→4, 1→4, 2→4, 3→5.
  - 11 other types: 4 text, 2 match, 2 order, 2 select-all, 1 label (h15, log-scale marks).
  - No `module_quiz` on honors questions.

## Drills: `drills/r2-a2-m6.yaml` (6)

- 22h1:
  - a2-m6-r2-continuous-rate: yearly → continuous and continuous → yearly, 2 decimal places.
  - a2-m6-r2-apy: quarterly, monthly, daily or continuous compounding, 3 decimal places.
  - a2-m6-r2-radiocarbon: nearest year.
- 22h2:
  - a2-m6-r2-decibels: 1 decimal place.
  - a2-m6-r2-fit-exp: integer $a$ and $b$ through two points.
  - a2-m6-r2-power-law: $p$ and $c$ through two points.
- Verification: each drill was generated 300 times with `generate()` on the built module JSON. Every answer was recomputed independently in Python, from the prompt values where possible: 1,800 instances, 0 mismatches.
  - The displayed answer typed back was accepted every time, and a wrong answer was rejected.
  - Wherever the prompt says "to N decimal places", the correctly rounded value is within tolerance.

## Pictures

All are original SVGs drawn by a script, each rendered with preview-figure.mjs and checked by eye. Markers were checked on the blank versions.

- `a2-m6-exp-graph.svg` + `-blank` (lesson 20; q01)
- `a2-m6-log-parts.svg` + `-blank` (lesson 21; q06)
- `a2-m6-log-scale.svg` + `-blank` (22h2; h15)

Mermaid diagrams: 5 (lessons 20, 21, 22, 22h1, 22h2). All were rendered and checked. They avoid ">" in labels, because the renderer drops it.

## Glossary and cards

- `glossary-r2-a2-m6.yaml` (+11): continuous growth rate, nominal rate, effective annual rate (aliases include annual percentage yield, APY), rule of 72, decay constant, radiocarbon dating, logarithmic scale, decibel, semi-log graph, log-log graph, linearize.
  - These cover every term bolded in the two honors lessons.
  - Every glossary*.yaml was checked before and after writing: no duplicate terms or aliases. "power function" and "power law" already exist in `glossary-r2-a2-m4.yaml`, so they are not bolded or defined here.
- `cards-r2-a2-m6.yaml` (+18): 10 for 22h1 (topics Continuous growth, Effective rates) and 8 for 22h2 (topics Logarithmic scales, Fitting models to data).

## Check

`content/math/check-module.sh algebra2 a2-m6`: OK, zero problems (5 lessons, 78 questions, 15 drills).

## For a reviewer

- h03: the distractor "72.00%" is $6\% \times 12$. It's a weak distractor but harmless.
- a2-m6-r2-apy: the solution states the general formula ($(1 + r/n)^n$, or $e^r$ for continuous) rather than one tailored to the chosen case. A drill can't switch text by case.
- a2-m6-r2-fit-exp: when the gap is 1, the solution shows "$b^{1}$". This is cosmetic only.
- Planet data (22h2) are J2000 mean elements, rounded (a: 0.387, 0.723, 1, 1.524, 5.203, 9.537 AU). NASA's fact sheet gives Saturn as 9.58 AU, a slightly different averaging; 9.537 is consistent with the 29.46-year period under $T^2 = a^3$.
- The Truth in Savings Act statement is general: US banks must disclose APY on deposit accounts.

## Errors found in existing content

None. The lesson 20–22 worked examples were rechecked (e.g. Ex. 4 of lesson 22: 2.269; Ex. 10: 30.0 years; lesson 21 Ex. 4: consistent with $b \approx 7$). Existing question keys were not re-solved; earlier reviewers covered them.

## Sources

- Truth in Savings Act (12 U.S.C. 4301 ff.) and Regulation DD (APY disclosure).
- Carbon-14 half-life 5,730 ± 40 years ("Cambridge" value); Libby half-life 5,568 years for conventional radiocarbon ages (Stuiver & Polach 1977).
- Richter (1935), local magnitude scale. Moment magnitude: energy ∝ $10^{1.5M}$ (Hanks & Kanamori 1979; USGS explanations).
- Sound intensity reference $I_0 = 10^{-12}$ W/m² (standard textbook value).
- Planetary semi-major axes and periods: JPL approximate planetary elements (J2000) and the NASA planetary fact sheet. Neptune: 30.07 AU, period about 164.8 years.
- Kepler, *Harmonices Mundi* (1619). The rule of 72 is attributed to Pacioli, *Summa de arithmetica* (1494).
- All numbers were recomputed in Python (`math`).
