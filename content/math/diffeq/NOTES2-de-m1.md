# Round 2 notes: module de-m1 (Bridge: differential equations at the AP level)

`content/math/check-module.sh diffeq de-m1`: build and checker report zero problems
(7 lessons, 106 questions, 17 drills, 45 cards, 214 terms).

## Added

**Honors lessons** (both `honors: true`, `module: de-m1`)
- `lessons/05h1-orthogonal-trajectories.md` (`de-m1-h-orthogonal`, "Families of curves and
  orthogonal trajectories", 40 min, ~1,850 words): finding a family's differential equation
  by differentiating and eliminating C; the slope rule $y' = -1/f$; worked examples
  $y = Cx^2$ → ellipses $x^2 + 2y^2 = K$ (with plot), $y = Ce^x$ → $y^2 = K - 2x$,
  $xy = C$ → $y^2 - x^2 = K$ (ideal corner flow, labeled as an idealization), circles ↔ lines
  through the origin; table of orthogonal families in science (contours/steepest descent,
  equipotentials/field lines, isotherms/heat flow, streamlines/potential lines);
  self-orthogonal confocal parabolas $y^2 = 4C(x + C)$; oblique trajectories and the
  logarithmic spiral (stated, not solved). Mermaid procedure chart.
- `lessons/05h2-beyond-logistic.md` (`de-m1-h-beyond-logistic`, "Beyond the logistic:
  epidemics, data and the Gompertz curve", 45 min, ~1,880 words): Verhulst / Pearl–Reed
  history; SI epidemic model as a mechanism for logistic growth (Mermaid compartment
  diagram, simplifications labeled, SIR mentioned); $u = 1/P$ linearizes the logistic;
  three-equally-spaced-points fit for K, A, k (derived); Gompertz model, its relative
  growth rate, inflection at K/e and max rate kK/e (derived), solution by $w = \ln(K/P)$;
  comparison table and plot of Gompertz vs logistic. Examples: rumor in a school of 5,000;
  fitting 200/400/600; illustrative Gompertz tumor model.

**Core lessons 01–05** (additions only; one or two sentences introduce each figure)
- 01: Mermaid "solving an initial value problem" chart (with check loop).
- 02: labeled slope-field picture for $y' = x - y$ (`de-m1-slope-field.svg`); Mermaid
  "reading the form of an equation from a slope field" decision chart.
- 03: Mermaid separation-of-variables procedure (equilibrium check first; text notes the
  IC/solve-for-y order can swap); plot of the family $y = Ae^{x^2/2}$ including A = 0.
- 04: labeled logistic-curve picture (`de-m1-logistic.svg`); Mermaid "exponential or
  logistic?" chart.
- 05: labeled one-Euler-step picture (`de-m1-euler-step.svg`); Mermaid Euler loop.

**Pictures** (6 original SVGs, 6–19 KB, all rendered and inspected; markers checked on the
blanks): de-m1-slope-field(-blank), de-m1-logistic(-blank), de-m1-euler-step(-blank).

**Diagrams**: 7 Mermaid (5 core, 2 honors), all with accTitle/accDescr, rendered. Plots: 3 new
(lesson 03, both honors lessons), rendered with the app's figure code and checked for
overlapping labels.

**Questions** (`questions/r2-de-m1.yaml`, 51 new)
- Core `de-m1-r2-q01`…`q25` (5 per lesson): text 5 (q01, q07, q13, q17, q23), match 4 (q02,
  q08, q14, q18), order 3 (q04, q11, q22), select-all 5 (q03, q09, q12, q19, q24), label 3
  (q06, q16, q21), MC 5 (q05, q10, q15, q20, q25). module_quiz: q01, q05, q07, q09, q12, q13,
  q17, q20, q23, q25 (2 per lesson).
- Honors `de-m1-r2-h01`…`h13` (orthogonal trajectories: 8 MC, 2 text, 1 select-all,
  1 order, 1 match) and `h14`…`h26` (beyond logistic: 8 MC, 2 text, 1 select-all, 1 match,
  1 order). No module_quiz (core-module honors lessons).
- Answer positions of the 21 four-choice MC questions: 0: 5, 1: 5, 2: 6, 3: 5.

**Drills** (`drills/r2-de-m1.yaml`, 5): de-m1-r2-orth-power, de-m1-r2-orth-slope (orthogonal
trajectories); de-m1-r2-si-peak, de-m1-r2-logistic-3pt (integer data built from
lcm so K and A are exact), de-m1-r2-gompertz (beyond logistic). Decimal answers ask for
2 decimal places with tolerance 0.01.

**Glossary** (`glossary-r2-de-m1.yaml`, 7 terms, checked against every glossary*.yaml):
orthogonal trajectories, self-orthogonal, oblique trajectories, logarithmic spiral, SI model,
transmission rate, Gompertz model. ("orthogonal" itself is already a Fourier-series term, so
the honors lesson italicizes it instead of bolding it.)

**Cards** (`cards-r2-de-m1.yaml`, 19): 10 Orthogonal trajectories, 5 Logistic growth (SI and
fitting), 4 Gompertz growth.

## For a reviewer
- New topics introduced: "Orthogonal trajectories", "Gompertz growth" (honors only).
- History in 05h2 (Verhulst 1838 and later naming "logistic"; Pearl and Reed 1920; Gompertz
  1825; Kermack and McKendrick 1927) is from standard references and was not re-checked
  online this round; worth a quick look.
- The Gompertz tumor example is labeled illustrative; its numbers are not clinical data.
- de-m3's writer may also touch modeling topics; I avoided Torricelli/draining tanks and
  anything in de-h1 (nonlinear dynamics and chaos).
- All numbers recomputed in Python/sympy (three-point formula, Gompertz inflection and
  values, SI peak, Euler steps, self-orthogonality of $y^2 = 4C(x + C)$).

## Errors found in existing content
None.

## Sources
Standard ODE texts (Boyce–DiPrima, Zill) for orthogonal trajectories and the logistic,
SI and Gompertz models; Verhulst (1838), Pearl & Reed (PNAS, 1920), Gompertz (Phil. Trans.,
1825), Kermack & McKendrick (Proc. R. Soc. A, 1927) for history. All explanations, examples
and figures are original.
