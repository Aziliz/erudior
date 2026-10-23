# Round 2 notes: a1-m8 (Data and statistics)

`content/math/check-module.sh algebra1 a1-m8`: build and checker report zero problems
(7 lessons, 110 questions, 18 drills, 53 cards).

## Added

**Honors lessons** (honors: true, module a1-m8, 45–50 min, about 1,900–2,050 words each)
- `lessons/36h1-normal-distributions.md` (a1-m8-h-normal), "Honors: z-scores and normal
  distributions". Covers z-scores and going back with x = μ + zσ, why z-scores have mean 0, SD 1
  and no units, the normal curve (inflection points at μ ± σ, de Moivre 1733, Gauss 1809), the
  68–95–99.7 rule and its band split (34 / 13.5 / 2.35 / 0.15), a short z-table, percentiles,
  and when the normal model fails. Examples: comparing two test scores; rice-bag weights by the
  rule; reaction times with the table and the 90th percentile; the Lesson 33 books data as a
  model that doesn't fit (78% within 1σ, and an impossible negative 2σ bound).
- `lessons/36h2-simpsons-paradox.md` (a1-m8-h-simpsons-paradox), "Honors: Simpson's paradox and
  expected counts". Covers a reversal with fictional hospitals, overall rates as weighted
  averages (p_severe + w(p_mild − p_severe)), the two ingredients of the paradox, the real kidney
  stone data (Charig et al. 1986; Julious and Mullee 1994), the 1973 Berkeley admissions case
  (Bickel, Hammel and O'Connell 1975), observational studies vs randomized experiments, and
  expected counts = row × column ÷ grand total, worked on Lesson 34's tables. The 2×2 gaps are
  equal in size with alternating signs. Chi-square is only mentioned as later work.
- `lessons/36h3-least-squares.md` (a1-m8-h-least-squares), "Honors: Where the line of best fit
  comes from". Explains why residuals are squared (with absolute values named as an alternative;
  Legendre 1805 and Gauss 1809, with the priority dispute labeled as debated). Derives the line
  with Algebra 1 tools only: for a fixed slope, SSE is a parabola in the intercept, so the line
  passes through (x̄, ȳ); then SSE is a parabola in the slope, whose vertex gives
  b = Σd_xd_y / Σd_x². Then r from deviations, b = r·σy/σx (with sample or population SDs),
  r² = 1 − SSE/Σd_y² proved from the parabola's minimum value, and regression to the mean
  (ẑ_y = r z_x, Galton 1886). Examples: a 5-point line by hand (ŷ = 0.9x + 1.3, SSE 1.9, r = 0.9);
  Lesson 35's study-hours line rebuilt from summary statistics; an illustrative regression-to-the-
  mean prediction.

**Core lessons 33–36**: pictures and diagrams only, each introduced by a sentence or two. No
existing text was changed.
- 33: three-shapes histogram SVG (skewed left / symmetric / skewed right with mean vs median);
  a labeled box-plot SVG of Example 1 (IQR bracket, fence at 40, outlier); a Mermaid chart for
  choosing mean/SD or median/IQR.
- 34: a two-way table SVG with joint and marginal cells and the grand total shaded and named; a
  Mermaid chart for which total goes in the denominator; a segmented bar chart SVG of the row
  percents.
- 35: a gallery of six scatter plots with r = 0.95, 0.60, 0, −0.60, −0.95 and a curve with r = 0
  (points built so these r values are exact); a Mermaid lurking-variable diagram (hot weather,
  ice cream, pool accidents); a residual SVG (ŷ = 4x + 20, residuals 12 and −10).
- 36: a Mermaid model-choice flowchart (differences, ratios, residual plot loop); a `plot` of
  the car data with both the exponential and linear models.

**Pictures** (16 SVGs, all original, 2.6–10.7 KB, each rendered and checked, with markers
checked on every blank): a1-m8-boxplot, -boxplot-blank, -shapes, -two-way, -two-way-blank,
-segmented, -correlation, -correlation-blank, -residual, -residual-blank, -empirical,
-empirical-blank, -simpson-bars, -weighted, -squares, -squares-blank.

**Diagrams** (6 Mermaid, all with accTitle/accDescr, all rendered): summaries chart (33),
denominator chart (34), lurking variable (35), model choice (36), using a normal model (36h1),
stone size as a lurking variable (36h2). **Plots**: car data with two models (36), shaded
z ≤ 1.28 area (36h1), SSE parabola S(m) = 10m² − 18m + 10 (36h3).

**Questions** (62, all in `questions/r2-a1-m8.yaml`)
- Core, a1-m8-r2-q01…q18 (18): 33 has 5 (label, text, order, select-all, match), 34 has 4
  (label, text, match, select-all), 35 has 5 (label, match with image, text, select-all, order),
  36 has 4 (match, text, select-all, text). Totals: label 3, text 5, match 4, order 2,
  select-all 4. module_quiz: q01, q02, q06, q08, q10, q12, q15, q16.
- Honors, a1-m8-r2-h01…h44 (44): normal 15 (9 MC, 2 text, label, select-all, order, match),
  Simpson 14 (9 MC, 2 text, select-all, order, match), least squares 15 (9 MC, 2 text,
  select-all, order, match, label). No module_quiz (core-module honors lessons).
- Answer positions of the 27 four-choice MC questions: 0: 7, 1: 7, 2: 7, 3: 6.

**Drills** (8, `drills/r2-a1-m8.yaml`): a1-m8-r2-z-score, -empirical, -normal-table (36h1);
-overall-rate, -expected-count (36h2); -lsrl-points, -lsrl-summary, -r-squared (36h3). Each was
generated 3,000 times against an independent TypeScript solver. Correct answers, answers rounded
as the prompt asks (including ties at …5), and answers built from a rounded intermediate are all
accepted; answers off by 1 are rejected.

**Glossary** (12, `glossary-r2-a1-m8.yaml`, checked against every glossary*.yaml): z-score,
normal distribution, empirical rule, standard normal distribution, percentile, Simpson's paradox,
observational study, randomized experiment, expected count, sum of squared residuals,
coefficient of determination, regression to the mean. "weighted average" is bolded in 36h2 but
already defined in glossary-r2-alg-m1.yaml, and "least-squares regression line" is an existing
alias of "line of best fit". Every bolded term in the honors lessons links to an entry.

**Cards** (29, `cards-r2-a1-m8.yaml`): 11 for 36h1, 8 for 36h2, 10 for 36h3.

## For a reviewer to double-check
- Empirical-rule bands use the conventional rounded values (34, 13.5, 2.35, 0.15), and the
  lesson gives the exact 68.27 / 95.45 / 99.73%. The empirical drill uses the same cumulative
  values (0.15, 2.5, 16, 50, 84, 97.5, 99.85).
- Normal-table drill: the answer is the exact normcdf rounded to 2 decimals, with tolerance 0.06,
  so 1-decimal answers from the 4-digit table or from technology are accepted.
- The hospital data in 36h2 Example 1 are fictional (labeled as two hospitals with no source);
  the kidney stone and Berkeley figures are real. The kidney stone reading is labeled as
  simplified. The Berkeley summary says "no pattern of bias against women within departments"
  instead of a stronger claim.
- History credits are hedged: "around 1900" for Pearson and Yule's early versions of
  the paradox, and "since the 1790s" for Gauss's claim.
- The 36h3 Example 3 regression-to-the-mean numbers are labeled as an illustration, not real data.
- 36h3 derives the line through (x̄, ȳ) by minimizing over the intercept for a fixed slope (a
  parabola in c), so no calculus is used.
- On label questions, markers 2 and 4 of the box plot sit on the box edges (Q1, Q3), and marker 3
  of the residual picture covers most of the short residual segment it names.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was changed.

## Sources
OpenStax Introductory Statistics 2e (normal distribution, z-scores, empirical rule, least-squares
line, r²); Charig CR, Webb DR, Payne SR, Wickham JEA (1986), BMJ 292:879–882; Julious SA, Mullee
MA (1994), "Confounding and Simpson's paradox," BMJ 309:1480; Bickel PJ, Hammel EA, O'Connell JW
(1975), "Sex bias in graduate admissions: data from Berkeley," Science 187:398–404 (overall
figures checked at refsmmat.com and bookdown.org/pkaldunn); Galton F (1886), "Regression towards
mediocrity in hereditary stature"; Simpson EH (1951), J. Royal Statistical Society B. Every
number in the lessons, questions and drills was recomputed in Python (numpy/scipy).
