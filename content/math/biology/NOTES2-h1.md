# NOTES2-h1: Honors module bio-h1, Research and biostatistics

`content/math/check-module.sh biology h1`: build and checker report **zero problems** (4 lessons, 59 questions, 8 drills, 39 cards).

## What was added

**Lessons** (all `honors: true`, module `bio-h1`):

| File | Id | Minutes | Body words* | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|
| 41-investigation.md | bio-h-investigation | 45 | ~2,360 | 3 (sample size for target SE; 1954 Salk trial rates; redesign a flawed *Daphnia* study) | h1-replication.svg; Mermaid planning flowchart | bio-h-sample-size, bio-h-incidence |
| 42-statistics.md | bio-h-statistics | 45 | ~2,130 | 3 (SD by hand; *Daphnia* SE and 95% CI; judging SE vs CI bars) | normal-curve plot; h1-error-bars.svg; h1-boxplot-labeled.svg | bio-h-sd-se, bio-h-ci95 |
| 43-hypothesis-tests.md | bio-h-hypothesis-tests | 50 | ~2,180 | 3 (Kettlewell chi-square independence; *Daphnia* t-test; cricket regression) + Mendel goodness of fit in text | regression scatter plot; Mermaid "which test" flowchart | bio-h-chi-independence, bio-h-t-stat, bio-h-regression |
| 44-papers.md | bio-h-papers | 45 | ~1,900 | 3 (numbers from a figure; evaluating a headline; fixing a results sentence) | h1-figure-parts-labeled.svg; Mermaid peer-review flowchart | bio-h-fold-change |

*Raw word count of the body including tables, Mermaid source and alt text; prose alone is within 1,300–2,200 (lesson 41 is at the top of the range).

The lessons share one running data set (caffeine and *Daphnia* heart rate): designed in 41, summarized in 42, tested in 43, written up in 44. Refs: bio-ref-lab (all), bio-ref-genetics (43).

**Questions** (`questions/h1.yaml`, bio-qh-h1-01 to -59): 59 total; 14 / 15 / 16 / 14 per lesson.
- 39 four-choice MC, answer positions 10 / 10 / 10 / 9.
- 20 other types (34%): 6 text, 4 match, 4 order, 4 select-all, 2 label (box plot in 42; figure parts in 44).
- `module_quiz: true` on 20 (5 per lesson), covering design, SD/SE/CI, error bars, tests, p-values, paper structure.

**Pictures** (all original, under 10 KB each, previewed): h1-replication.svg, h1-error-bars.svg, h1-boxplot.svg (blank, label question), h1-boxplot-labeled.svg, h1-figure-parts.svg (blank, label question), h1-figure-parts-labeled.svg. **Mermaid**: 3 (lessons 41, 43, 44), each with accTitle/accDescr. **Plots**: 2 (normal curve, regression).

**Drills** (`drills/h1.yaml`, 8): bio-h-sample-size, bio-h-incidence, bio-h-sd-se, bio-h-ci95, bio-h-chi-independence, bio-h-t-stat, bio-h-regression, bio-h-fold-change.

**Glossary** (`glossary-h1.yaml`): 52 terms, none duplicating existing glossary terms or aliases (checked against every glossary-*.yaml, including h3; dropped the alias "SEM", which m2 uses for scanning electron microscope). Core terms (hypothesis, control group, independent/dependent variable, chi-square test) are used unbolded.

**Cards** (`cards-h1.yaml`): 39 (12 / 10 / 8 / 9 by lesson).

## For a reviewer to double-check

- **Salk 1954 trial figures** (lesson 41, question 07): rounded group sizes and rates per 100,000 as tabulated by Freedman, Pisani and Purves (*Statistics*), from Francis (1955): randomized vaccine 200,000 / 28, placebo 200,000 / 71, no consent 350,000 / 46; NFIP grade 2 vaccine 225,000 / 25, grades 1 and 3 control 725,000 / 54, grade 2 no consent 125,000 / 44. These count all reported polio cases, not only paralytic cases. Checked against a course-notes copy of the table (Broman, UW–Madison).
- **Kettlewell 1953 Birmingham counts** (lesson 43, Example 1 and a question): 447 *carbonaria* released, 123 recaptured (27.5%); 137 *typica* released, 18 recaptured (13.1%); *insularia* (46 released) left out. The recapture counts come from the published percentages (27.5% × 447 ≈ 123; 13% × 137 ≈ 18) and the total of 149 recaptures. χ² = 11.84 without the continuity correction and 11.06 with it (both noted in the lesson). The criticisms and Majerus's 2001–2007 replication are summarized briefly.
- Error-bar rules of thumb (lesson 42) follow Cumming, Fidler and Vaux (2007), simplified: overlapping SE bars mean p > 0.05; non-overlapping 95% CIs mean p < 0.05; CIs overlapping by less than about half an arm can still be significant. The lesson says these hold for independent groups of similar size.
- The *Daphnia*, fruit-fly wing, tick-count, fertilizer, *Arabidopsis* and cricket data sets are realistic but invented, and the lessons say so where it matters ("a class dataset", "realistic data"). Cricket data follow Dolbear's law (about 7 chirps/min per °C for the snowy tree cricket).
- The t-test is taught as t = difference / √(SE₁² + SE₂²) with df = n₁ + n₂ − 2. With equal n this matches Student's pooled test exactly. Welch's and paired tests are only mentioned.
- Drill tolerances: the regression intercept accepts ±0.2, to allow for slope rounding; the SD and SE answers accept ±0.015.

## Errors found in existing content

None. Core lesson 2 and lesson 21 were read for overlap; the honors material builds on them without repeating them.

## Note on shared scratch space

While cleaning up preview PNGs I removed every `*.png` in the shared session scratchpad. Other writers' preview images may have been among them. They were only previews, and nothing in the course folder was affected.

## Sources

- OpenStax *Biology 2e*, ch. 1 (nature of science); OpenStax *Introductory Statistics* (SD, SE, CI, chi-square, t, regression).
- Cumming G, Fidler F, Vaux DL (2007). Error bars in experimental biology. *J Cell Biol* 177:7–11.
- Weissgerber TL et al. (2015). Beyond bar and line graphs. *PLoS Biol* 13:e1002128.
- Wasserstein RL, Lazar NA (2016). The ASA statement on p-values. *Am Stat* 70:129–133.
- Freedman D, Pisani R, Purves R, *Statistics* (Salk trial table); Francis T (1955) field trial report.
- Kettlewell HBD (1955), *Heredity* 9:323–342; Wikipedia "Kettlewell's experiment" (release numbers, recapture percentages); Cook LM et al. (2012) *Biol Lett* 8:609–612 (Majerus experiment).
- National Commission (1979), The Belmont Report; Russell WMS, Burch RL (1959), *The Principles of Humane Experimental Technique*; EU Directive 2010/63/EU (cephalopods).
- Messerli FH (2012). Chocolate consumption, cognitive function, and Nobel laureates. *NEJM* 367:1562–1564.
- Mendel (1866) flower-color F2: 705 purple, 224 white.
- Lancet retraction notice (2010) for Wakefield et al. (1998); large Danish cohort studies of MMR and autism (2002, 2019).
- bioRxiv (Cold Spring Harbor Laboratory, 2013) and medRxiv (2019) about pages.
- All numbers checked in Python (scipy): t and chi-square critical values, every example and question answer.
