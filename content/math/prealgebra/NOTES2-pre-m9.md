# Round 2 notes: pre-m9 (Data and probability)

`content/math/check-module.sh prealgebra pre-m9`: build and checker report zero problems
(5 lessons, 78 questions, 14 drills, 38 cards).

## Added

**Honors lessons** (`honors: true`, `module: pre-m9`)
- `lessons/38h1-spread.md`, `pre-m9-h-spread`, "Measuring spread: MAD, quartiles and box plots"
  (45 min, about 2,100 words with alt text). Deviations and why they sum to 0 (short proof), mean
  absolute deviation, quartiles by the median-of-halves method (labeled as one convention among
  several), five-number summary, IQR, box plots and how to read them, comparing two box plots, the
  1.5 × IQR fence rule (labeled a convention), resistant measures and pairing mean–MAD /
  median–IQR, a preview of standard deviation. Examples: MAD of 4, 6, 7, 9, 14 (2.8); two towns
  with equal mean and range but MAD 3.3 vs 8; five-number summaries for n = 9 and n = 10; two-class
  box plot comparison; fences applied to both data sets (one flagged, one not).
- `lessons/38h2-expected-value.md`, `pre-m9-h-expected`, "Tree diagrams, dependent events and
  expected value" (45 min, about 1,650 words). Tree diagrams (multiply along, add across, paths
  sum to 1), dependent events, with/without replacement, the general multiplication rule (with
  $P(B \mid A)$ mentioned), "at least one" by complement, expected value as a probability-weighted
  mean (linked to Lesson 37's frequency-table mean), fair games, the law of large numbers.
  Examples: free throws (independence labeled a simplification), 5 red/3 blue without
  replacement, 3 bulbs from 10 with 2 defective, die EV 3.5, spinner game (−\$0.50), raffle
  (−\$3.25, checked from the organizer's side).

**Core lessons** (additions only; nothing rewritten or removed)
- 36-stats: balance-point SVG after Example 1; Mermaid "choosing a measure of center" chart and the
  center-and-spread dot plot SVG (with a one-sentence lead-in) in "Choosing a measure".
- 37-graphs: "parts of a graph" SVG (lettered key) in "Bar graphs"; truncated-axis SVG plus one
  sentence of arithmetic (5 vs 30 units, 6× vs 2.25×) after "Watch the scale"; Mermaid "choosing a
  display" chart after the display table.
- 38-probability: probability-scale SVG with die events; coin-and-die tree SVG (bolds **tree
  diagram**, defined in my glossary file); new short section "Which rule when" with a Mermaid
  chart, before Common mistakes.

**Pictures** (15 SVGs, original, 2–4 KB each, all rendered and looked at; markers checked):
pre-m9-balance, pre-m9-center-spread (+ -blank), pre-m9-graph-parts (+ -blank), pre-m9-truncated,
pre-m9-prob-scale (+ -blank), pre-m9-coin-die-tree, pre-m9-h-deviations, pre-m9-h-boxplot
(+ -blank), pre-m9-h-two-boxplots, pre-m9-h-tree (+ -blank).

**Diagrams** (5 Mermaid, accTitle/accDescr, rendered): measure of center (36, TD), display (37,
TD), which probability rule (38, LR fan-out of 5 boxes, no long chain), data → box plot (38h1, TD),
tree-diagram method (38h2, TD). **Plot**: 38h2 has a bar plot of the spinner game's net-gain
distribution with the expected value marked.

**Questions** (45, `questions/r2-pre-m9.yaml`)
- Core q01–q16. Lesson 36 (q01–q06): text q01, q06; order q02; match q03; select-all q04;
  label q05. Lesson 37 (q07–q11): label q07; match q08; text q09; select-all q10; order q11.
  Lesson 38 (q12–q16): label q12; text q13; match q14; select-all q15; order q16.
  module_quiz: q01, q05, q07, q09, q12, q13.
- Honors 38h1 h01–h15 (15): MC 8, text 3 (h02, h05, h15), select-all h07, label h08, order h09,
  match h10.
- Honors 38h2 h16–h29 (14): MC 7, text 3 (h17, h23, h29), label h19, order h20, match h21,
  select-all h25.
- No module_quiz on honors questions. Correct positions of the 15 honors MC: 4/4/4/3 at 0–3.

**Drills** (6, `drills/r2-pre-m9.yaml`): `pre-m9-r2-mad` (mean + MAD, integer mean),
`pre-m9-r2-quartiles` (9 distinct values shown shuffled; Q1, Q3, IQR), `pre-m9-r2-fences`
(fences + outlier yes/no as 1/0) for 38h1; `pre-m9-r2-no-replace` (both red, one of each),
`pre-m9-r2-at-least-one` (complement, without replacement), `pre-m9-r2-expected` (dice game,
expected prize and net, net ≤ 0) for 38h2. Each generated 2,000 times with tsx (`generate` +
`checkAll`) against an independent solver that parses the prompt (sorting for quartiles, exact
fractions): every correct answer accepted, a wrong one rejected, no unfilled placeholders.

**Glossary** (`glossary-r2-pre-m9.yaml`, 20 terms): deviation, mean absolute deviation (MAD),
standard deviation, quartiles, first quartile (Q1), third quartile (Q3), five-number summary,
interquartile range (IQR), box plot, whiskers, fences, resistant, tree diagram, dependent events,
without replacement, with replacement, general multiplication rule, expected value, fair game,
law of large numbers. Checked against every `glossary*.yaml` in the course: no clashes.

**Cards** (`cards-r2-pre-m9.yaml`, 21): 11 for 38h1 (topics Mean absolute deviation, Quartiles
and box plots), 10 for 38h2 (Tree diagrams, Expected value).

## For a reviewer to double-check
- Quartile convention: the lessons, questions and drills use median-of-halves, leaving the median
  out of both halves for an odd count (same as the engine's `quartile()`). 38h1 says other
  calculators/spreadsheets may differ; h04 and h14 say "median-of-halves" in the stem.
- Attributions: box plots popularized by John Tukey in the 1970s (introduced 1970, *Exploratory
  Data Analysis* 1977); the 1.5 × IQR fences are also Tukey's. Both are stated without exact dates.
- Label markers: center-spread-blank markers for mean/median sit just below the triangle and
  diamond so the shapes stay visible; graph-parts-blank markers sit on the title, the rotated
  y-label, the scale numbers, the Pizza bar, the "Salad" label and the x-label; tree-blank markers
  sit at the midpoint of each branch.
- q12 (probability scale) distractors are "a 1 or a 2" and "a 5 or a 6" (both 1/3), chosen so no
  distractor fits a numbered point.
- h23 accepts '-1', '−1', '-$1', '-$1.00'.
- The fences drill asks for "outlier?" as 1/0 because there is no yes/no answer type.

## Errors found in existing content
None. All existing pre-m9 lessons, questions, drills, cards and glossary entries were read; nothing
was edited except the additions listed above.

## Sources
Standard statistics and probability (definitions of MAD, quartiles, IQR, box plots, the general
multiplication rule, expected value, law of large numbers). J. W. Tukey, *Exploratory Data
Analysis* (1977) for box plots and the 1.5 × IQR rule. All numbers recomputed in Python
(fractions module) and the drills checked with the app's drill engine.
