# Round 2 notes: module ps-m3 (Continuous random variables)

`content/math/check-module.sh probstats ps-m3`: build and checker report zero problems
(7 lessons, 116 questions, 21 drills, 54 cards).

## Added

**Honors lessons** (both `honors: true`, `module: ps-m3`, 45 min)
- `lessons/14h1-hazard-weibull.md` (ps-m3-h-hazard-weibull, "Hazard functions and the Weibull
  distribution", ~1,700 words): hazard as a conditional failure rate; $h = -(\ln S)'$, cumulative
  hazard, $S = e^{-H}$, when a function can be a hazard (defective distributions, cure models);
  Weibull (survival, hazard, density, shape regimes, Rayleigh, characteristic life, mean and variance
  via the tail formula and the gamma function, percentiles, B10 life, Weibull's weakest-link
  origin); series systems (hazards add, Weibull closed under minima); bathtub curve, burn-in,
  Gompertz; mean residual life. Examples: linear hazard → Rayleigh; wearing bearing
  (k = 1.5, s = 2000); four parts in series; mean residual life for exponential, uniform, Rayleigh.
- `lessons/14h2-mixed-distributions.md` (ps-m3-h-mixed-distributions, "Mixed distributions,
  censoring and the general quantile function", ~1,500 words): properties of every cdf
  (right-continuity), jumps as point masses, mixed random variables, probabilities and
  expectations (split formula and the general tail formula), capping/limited expected value,
  censoring in life tests, deductibles and policy limits, the generalized inverse
  $F^{-1}(u) = \min\{x : F(x) \ge u\}$ and inverse transform sampling for every distribution; why
  $F(X)$ is uniform only for continuous $F$. Examples: traffic-light wait; exponential claims with a
  deductible (and a cap); censored exponential life test; simulating from jumps (traffic light, die,
  Bernoulli).

**Core lessons 10–14**: additions only (a sentence or two introducing each figure).
- 10: labeled density picture (SVG) after the pdf properties; Mermaid diagram linking pdf, cdf,
  quantile, interval probability and mean.
- 11: Poisson-process time line (SVG) showing exponential gaps, gamma arrival time and Poisson count.
- 12: labeled normal curve with μ, inflection points, 68–95–99.7 brackets and the upper 2.3% tail
  (SVG); Mermaid flowchart of the normal approximation to the binomial.
- 13: Mermaid chart of relations (exponential, gamma, chi-square, Z², beta, uniform).
- 14: `plot` of inverse transform sampling (U = 0.7 → X ≈ 2.408 on the Exponential(0.5) cdf);
  Mermaid "which method when" chart (LOTUS / discrete / change of variables / cdf method).

**Pictures** (8 SVGs, original, 2–14 KB, all rendered and checked, markers checked on blanks):
ps-m3-density-parts(+blank), ps-m3-poisson-timeline(+blank), ps-m3-normal-curve(+blank),
ps-m3-bathtub(+blank).

**Diagrams**: 6 Mermaid (lessons 10, 12, 13, 14, 14h1 f/F/S/h/H links, 14h2 simulating the
traffic-light wait), all with accTitle/accDescr, rendered. Plots: 3 new (lesson 14 inverse
transform, 14h1 Weibull hazards, 14h2 mixed cdf with a jump).

**Questions** (53, `questions/r2-ps-m3.yaml`)
- Core ps-m3-r2-q01…q24 (5 per lesson; 4 for lesson 14): label 3 (q01, q06, q11), text 6 (q02,
  q07, q12, q16, q20, q22), order 5 (q03, q10, q13, q19, q21), match 5 (q05, q09, q15, q17, q24),
  select-all 5 (q04, q08, q14, q18, q23). module_quiz: q01, q04, q06, q09, q11, q14, q17, q20,
  q23, q24 (two per lesson).
- Honors 14h1 ps-m3-r2-h01…h15 (10 MC, 1 text, 1 match, 1 order, 1 label, 1 select-all);
  14h2 h16…h29 (9 MC, 2 text, 1 match, 1 order, 1 select-all). No module_quiz (core-module honors).
- Answer positions of the 19 new 4-choice MC questions: 0: 5, 1: 5, 2: 5, 3: 4.

**Drills** (6, `drills/r2-ps-m3.yaml`): ps-m3-r2-weibull-survival, ps-m3-r2-weibull-mean,
ps-m3-r2-series-weibull (14h1); ps-m3-r2-mixed-wait, ps-m3-r2-deductible,
ps-m3-r2-censored-mean (14h2). Each generated 600 times and compared with an independent
calculation (own Lanczos gamma); the shown answer, the answer correctly rounded to the stated
places / significant figures, and a 10%-off wrong answer were typed back through `checkAll()`
(accepted, accepted, rejected).

**Glossary** (14 new in `glossary-r2-ps-m3.yaml`, checked against every glossary file, no
duplicate terms or aliases): cumulative hazard function, Rayleigh distribution, characteristic
life, B10 life, bathtub curve, burn-in, Gompertz distribution, mean residual life,
right-continuous, point mass, mixed random variable, limited expected value, censoring, quantile
function. Other bolded terms in the honors lessons (hazard rate, Weibull distribution, shape and
scale parameter, series system) link to existing entries.

**Cards**: 18 in `cards-r2-ps-m3.yaml` (10 for 14h1, 8 for 14h2).

## For a reviewer to double-check
- Historical/empirical claims: Weibull used the family for material strength in the late 1930s and
  popularized it in his 1951 paper (he did not invent it; earlier uses exist, which the lesson does
  not claim otherwise); Gompertz 1825; adult mortality "roughly doubles every 8 years or so" is
  labeled rough and population-dependent; the bathtub curve is labeled an idealization.
- Lesson 14h2 mentions singular (Cantor-type) distributions in one parenthetical, labeled as not
  needed; the match question h26 uses "Singular" only as a distractor.
- Label marker on the Poisson time line (q06, marker 1) sits on the first event dot, and marker 2
  on the normal curve sits on the inflection dot; both are the intended targets.
- q11 shades only the upper tail beyond μ + 2σ (2.3%); the 99.7% bracket is unnumbered.
- 14h2 Example 2 uses dollars written as plain numbers (no `$` signs) to avoid math parsing.
- The m2 writer also has a Poisson-process picture (ps-m2-poisson-process.svg) for lesson 08; mine
  (lesson 11) emphasizes gaps vs. gamma arrival time vs. counts, so they overlap a little.
- A third honors lesson (acceptance–rejection sampling, Box–Muller) would fit, but it leans on
  two-variable transformations from Module 4 and may overlap ps-h1; left out.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was changed.

## Sources
Standard results checked against Casella and Berger, *Statistical Inference* (cdf properties,
generalized inverse, probability integral transform); Klugman, Panjer and Willmot, *Loss Models*
(limited expected value, deductibles); Meeker and Escobar, *Statistical Methods for Reliability
Data* and the NIST/SEMATECH e-Handbook of Statistical Methods, ch. 8 (hazard, cumulative hazard,
Weibull, bathtub curve, B10, burn-in); Weibull (1951), J. Appl. Mech. 18, 293–297; Gompertz (1825),
Phil. Trans. R. Soc. 115. All numbers recomputed in Python (scipy) and the drills in TypeScript.
