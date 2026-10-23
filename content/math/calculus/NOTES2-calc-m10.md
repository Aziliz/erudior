# Round 2 notes: calc-m10 (Sequences and series)

`content/math/check-module.sh calculus calc-m10`: build and checker report zero problems
(7 lessons, 107 questions, 14 drills, 55 cards).

## Added

**Honors lessons** (2; `honors: true`, module calc-m10)
- `lessons/44h1-computing-with-series.md` (calc-m10-h-computing, "Computing with series: π, e and
  logarithms", 45 min, ~1,770 words): fast vs slow series (Leibniz series vs $\sum 1/k!$, tail
  bound $1/(n!\,n)$), trapping a positive series' sum between integral bounds and the midpoint
  estimate, a short pointer to harmonic growth and γ, the $\ln\frac{1+x}{1-x}$ series for fast
  logarithms, Machin's formula with its tangent-formula proof, argument reduction for $e^x$.
  Examples: $e$ to $10^{-10}$ (14 terms); $\sum 1/n^2$ from $S_{10}$ plus bounds; $\ln 2$ with
  $x = 1/3$; π from Machin with error bound; $e^{10} = 2^{14}e^{r}$.
- `lessons/44h2-complex-series.md` (calc-m10-h-complex, "Complex power series and Euler's formula",
  45 min, ~1,790 words): complex numbers in brief, series with complex terms, disk of convergence,
  $e^z$ by its series and Euler's formula, Euler's identity, $re^{i\theta}$ form and De Moivre,
  cos/sin as exponentials (link to cosh), why the radius is the distance to the nearest complex
  singularity (partial fractions for $1/(1+z^2)$; general statement given without proof).
  Examples: values of $e^{i\theta}$; $\cos 3\theta$, $\sin 3\theta$; $\int e^x\cos x\,dx$ without
  parts; $R = \sqrt2$ for $1/(1+x^2)$ at 1; $R$ for $1/(x^2-4x+13)$, $\tan x$, $\ln(1+x)$ at 2.
- Two rather than three: a third topic (rearrangements, Cauchy products) would overlap the
  calc-h1 "Toward analysis" module.

**Core lessons 40–44**: additions only (pictures/diagrams plus a sentence or two introducing them).
- 40: halves-of-a-square picture (SVG), geometric-series procedure (Mermaid).
- 41: decision chart for positive-term series (Mermaid), comparison plot of $1/(n^2+4)$ vs $1/n^2$.
- 42: nested regions absolutely / conditionally convergent / divergent (SVG), full test-strategy
  flowchart (Mermaid).
- 43: radius-of-convergence number line (SVG), interval-of-convergence procedure (Mermaid),
  number line for Example 1's $[1, 5)$.
- 44: plot of $e^x$ with $P_1$, $P_2$, $P_3$; "find a Taylor series and judge its accuracy" chart
  (Mermaid).

**Pictures** (9 original SVGs, all under 2 KB, rendered and checked, markers checked on blanks):
calc-m10-halves(-blank), calc-m10-series-types(-blank), calc-m10-radius(-blank), calc-m10-disk(-blank),
calc-m10-euler-circle.

**Diagrams** (6 Mermaid, all `flowchart TD` with accTitle/accDescr, rendered): geometric-series
steps, positive-term test choice, full series strategy, interval of convergence, Taylor series and
error bound, argument reduction (honors 1). Plus 4 new plots/number lines (2 core, 2 honors 1).

**Questions** (`questions/r2-calc-m10.yaml`, 53 new)
- Core calc-m10-r2-q01…q25 (5 per lesson; each lesson has a text, a match or order, and a
  select-all; label where there is a picture): label 3 (q01, q10, q15), text 6 (q02, q06, q11,
  q16, q20, q25), select-all 5 (q03, q08, q12, q18, q22), order 3 (q04, q17, q23), match 4 (q05,
  q07, q13, q21), MC 4 (q09, q14, q19, q24). module_quiz: q02, q05, q06, q08, q10, q12, q16, q17,
  q20, q21 (2 per lesson).
- Honors 1, h01…h14: MC 9, text 2, select-all 1, match 1, order 1.
- Honors 2, h15…h28: MC 8, text 2, select-all 1, match 1, order 1, label 1.
- Answer positions of the 21 four-choice MC questions: 0: 6, 1: 5, 2: 5, 3: 5.

**Drills** (`drills/r2-calc-m10.yaml`, 5): calc-m10-r2-e-terms, calc-m10-r2-integral-bounds,
calc-m10-r2-log-series (honors 1); calc-m10-r2-complex-radius, calc-m10-r2-de-moivre (honors 2).
Rounded answers: 4-decimal bounds accept ±0.00015, 5-decimal log ±0.00001, 3-decimal radius
±0.001 (exact `sqrt(n)` also accepted).

**Glossary** (`glossary-r2-calc-m10.yaml`, 11, checked against every calculus glossary file):
Leibniz series, Machin's formula, argument reduction, complex number, complex plane, modulus,
disk of convergence, Euler's formula, Euler's identity, De Moivre's formula, singularity.
"Euler–Mascheroni constant" is not bolded or redefined: calc-m6 (lesson 25h2) already defines it.

**Cards** (`cards-r2-calc-m10.yaml`, 19): 8 computing with series, 11 complex series / Euler.

## For a reviewer to double-check
- Overlap with calc-m6's honors lesson 25h2 (harmonic bounds, γ, "more than $e^{99}$ terms to pass
  100"): honors 1 now only mentions these in one paragraph and points to that lesson.
- The radius theorem is stated without proof: exact for rational functions in lowest terms; the
  extension to "nearest singularity" (tan, ln) is described in words and labeled as coming from
  complex analysis.
- Argument reduction is labeled a simplified picture (real libraries use tuned polynomials; some
  calculators use other methods such as CORDIC, which is not named in the lesson).
- History: Leibniz published 1682, Gregory 1671, Kerala school "traditionally credited to Madhava
  (around 1400)"; Machin 1706, 100 decimals; Euler's formula 1748 (Introductio); De Moivre
  "early 1700s"; Euler computed $\sum 1/n^2$ numerically "in the 1730s" before the exact value.
- Leibniz count "about 4 million terms" is what the error bound promises for six decimals
  (actual error is about half the bound).
- Label markers: halves (1/2, 1/4, 1/8, 1/16 centers), series-types (on the region names' spots),
  radius (band, outside, left endpoint, arrow), disk (point i, shaded disk, real segment, dashed
  circle). The disk label "Singularity where f blows up" marks i only (−i is left unnumbered).

## Errors found in existing content
None. No existing question, drill, card or glossary entry was changed.

## Sources
OpenStax Calculus Vol. 2 ch. 5–6 (series tests, power and Taylor series); Paul's Online Notes
(Lamar) Calc II series pages (estimating series, integral test bounds); MacTutor biographies of
Machin, Gregory, Madhava, Euler and de Moivre (dates); standard complex-analysis results
(radius = distance to nearest singularity; zeros of cos z are real). Every number in lessons,
questions and drill samples recomputed in Python (mpmath/sympy), including Taylor coefficients of
$1/(1+x^2)$ at 1 and $\tan x$ at 0 to confirm $R = \sqrt2$ and $\pi/2$.
