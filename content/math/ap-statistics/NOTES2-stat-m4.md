# AP Statistics module 4 (stat-m4, Collecting data), round 2: writer notes

## Added

**Honors lessons (3)** (`honors: true`, module stat-m4)
- `lessons/18h1-survey-estimation.md`: `stat-m4-h-survey-estimation`, "Estimating from complex samples", 45 min, about 1,650 words of prose.
  It covers sampling weights ($N_h/n_h$), oversampling, the stratified estimate and its SE, Neyman allocation (with the cost-adjusted form),
  the design effect $1 + (m-1)\rho$, effective sample size, post-stratification and its limits, and the 1936 Literary Digest poll.
  It has 4 worked examples (a weighted broadband estimate, Neyman allocation for bridge costs, a classroom design effect, reweighting a poll by age), a bar figure (shape) and a design-effect plot.
- `lessons/18h2-factorial-experiments.md`: `stat-m4-h-factorial`, "Factorial experiments and interaction", 40 min, about 1,360 words.
  It covers factorial designs, main effects, simple effects, interaction (as a difference of differences, noting the engineering ½ convention),
  interaction plots, why one-factor-at-a-time fails, when main effects mislead, randomizing, replicating and blocking a factorial, $2^k$ growth and fractional factorials,
  and Fisher at Rothamsted (1935). It has 3 worked examples and 2 interaction plots. All data are labeled made-up.
- `lessons/18h3-causal-inference.md`: `stat-m4-h-causal-inference`, "Cause and effect without an experiment", 50 min, about 1,650 words.
  It covers potential outcomes and the ATE (Neyman 1923, Rubin 1970s), the split of the naive difference into the effect on the treated plus selection bias,
  why randomization is unbiased (all 70 assignments average exactly the ATE), direct standardization (linked to Simpson's paradox in lesson 15),
  natural experiments (the Oregon 2008 Medicaid lottery, and Snow's 1854 water companies), Doll and Hill (1950, 1951), the 1964 Surgeon General's report,
  the Bradford Hill viewpoints (1965) shown as a table, and a short note on other modern designs.
  It has 3 worked examples, a Mermaid causal diagram and a bar figure (shape).

**Questions** (`questions/r2-stat-m4.yaml`, 58)
- Core (`stat-m4-r2-q01` to `q15`):
  - L16: 6 questions (label, text, order, match, 2 select-all).
  - L17: 5 questions (label, text, order, match, select-all).
  - L18: 4 questions (label, text, match, select-all).
  - `module_quiz: true` on q01, q04 (L16), q09, q10 (L17) and q14 (L18).
- Honors (`stat-m4-r2-h01` to `h43`):
  - 18h1 has 15 questions: 10 multiple choice, 1 select-all, 2 text, 1 match, 1 order.
  - 18h2 has 14 questions: 9 multiple choice, 1 select-all, 2 text, 1 match, 1 order.
  - 18h3 has 14 questions: 10 multiple choice, 1 select-all, 1 text, 1 match, 1 order.
  - None of the honors questions is in the module quiz.
- Answer positions of the 29 single-answer multiple-choice questions: 7 / 7 / 8 / 7.

**Pictures** (7 original SVGs in `images/`, all rendered and checked, markers included)
- `stat-m4-sampling-methods.svg` and `-blank` (L16, label question q01): SRS, stratified, cluster and systematic samples on the same 40 dots.
- `stat-m4-bias-variability.svg` (L16): four targets showing bias against variability.
- `stat-m4-block-design.svg` and `-blank` (L17, label question q07): outline of the rail-lubricant randomized block design.
- `stat-m4-confounding.svg` and `-blank` (L18, label question q12): the income, wine and heart-disease confounding triangle.

**Mermaid diagrams (7)**, each with accTitle and accDescr, all rendered and checked:
- L16: where bias enters a survey (population, frame, sample, respondents, answers).
- L17: completely randomized design outline (Example 3) and a "which design" decision chart.
- L18: kinds of studies, and a scope-of-inference decision chart.
- 18h3: causal paths (math background measured, motivation not).

**Figures in the honors lessons**: 2 shape bar charts (18h1 sample and population shares, 18h3 Snow's rates) and 3 plots (design effect against cluster size, 2 interaction plots).
Each was rendered with the app's renderer and CSS and checked. Shape figures were used for the category bars because the plot axis ticks collide with the bar labels.

**Drills** (`drills/r2-stat-m4.yaml`, 6)
- `stat-m4-r2-strat-estimate`: weight and weighted proportion.
- `stat-m4-r2-neyman`
- `stat-m4-r2-design-effect`: deff and effective n.
- `stat-m4-r2-main-effects`: two main effects and the interaction.
- `stat-m4-r2-standardize`: two standardized rates.
- `stat-m4-r2-rate-ratio`: two rates per 10,000 and their ratio.
- 18h2 also links the existing `stat-factorial-design`.
- Each drill was generated 1,200 times and checked against an independent recomputation from the prompt text. Correctly rounded answers are accepted, and answers off by 1 are rejected.
  For the ratio, both the exact ratio and the ratio of the rounded rates are accepted (relTolerance 1%, with B's rate at least 8 per 10,000).

**Glossary** (`glossary-r2-stat-m4.yaml`, 21 terms)
- 18h1: sampling weight, oversampling, Neyman allocation, design effect, intraclass correlation, effective sample size, post-stratification.
- 18h2: factorial design, main effect, interaction, simple effect, interaction plot, one-factor-at-a-time, fractional factorial design.
- 18h3: potential outcomes, average treatment effect, selection bias, standardization, natural experiment, Bradford Hill criteria, dose-response relationship.
- I checked every glossary*.yaml in the course (including the other writers' r2 files present at the end) for duplicate terms and aliases, and found none.

**Cards** (`cards-r2-stat-m4.yaml`, 33): 3 core (one per core topic), 11 for survey estimation, 9 for factorial experiments, 10 for causal inference.

`content/math/check-module.sh ap-statistics stat-m4`: OK, zero problems.

## For a reviewer to double-check
- The interaction is defined as a "difference of differences". Many engineering texts call half of that the interaction effect. The lesson says so, and question h17 and the drill both state which definition they use.
- In Example 1 of 18h1, the SRS comparison SE (0.0188) assumes a true p of 0.83. The lesson says so.
- The Literary Digest history follows bitbybitbook (Salganik), Lohr & Brick (2017) and Squire (1988).
  The lesson says how much the frame and nonresponse each mattered is debated. It gives "about 57%" for Landon's predicted share and "about 61%" for Roosevelt's actual share (60.8%).
- In Snow's table, the Lambeth rate recomputes to 37.5 per 10,000, while Snow printed 37. The lesson shows both.
- Hill's viewpoints are presented as a guide, not a checklist. "Only temporality is generally treated as essential" is the usual modern reading, not a quotation from Hill.
- The glossary terms "interaction", "standardization" and "potential outcomes" are general. If the stat-h1 writer ("Beyond the AP exam") adds overlapping entries, keep one.

## Errors found in existing content
- None. Every worked example in lessons 16–18 was rechecked, and existing questions and drills were not edited.

## Sources
- Neyman (1934), "On the two different aspects of the representative method", JRSS. Kish (1965), *Survey Sampling* (design effect).
- Salganik, *Bit by Bit*, §3.3 (Literary Digest). Lohr & Brick (2017), "Roosevelt predicted to win: revisiting the 1936 Literary Digest poll". Squire (1988), *Public Opinion Quarterly*.
- Fisher (1935), *The Design of Experiments*.
- Snow's table, as reproduced in the Berkeley Data 8 textbook ("Snow's Grand Experiment"). Koch isolated the cholera bacterium in 1883–84.
- Doll & Hill (1950), BMJ. The British Doctors Study (from 1951). U.S. Surgeon General (1964). Hill (1965), "The environment and disease: association or causation?", Proc. R. Soc. Med.
- Holland (1986) and Rubin (1974) for potential outcomes. The Oregon Health Insurance Experiment (2008 lottery).
