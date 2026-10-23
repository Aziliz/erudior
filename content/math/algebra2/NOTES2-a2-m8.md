# Round 2 notes: module a2-m8 (Probability and statistics)

`content/math/check-module.sh algebra2 a2-m8`: build and checker report zero problems
(7 lessons, 111 questions, 19 drills, 77 cards).

## Added

**Honors lessons** (3, since the module has four dense core lessons and more worth teaching).
All have `honors: true` and `module: a2-m8`, 45 min.
- `lessons/28h1-expected-value.md` (a2-h-expected-value), "Random variables and expected value",
  ~1,630 words. Covers random variables, probability distributions and histograms, E(X) and why the
  formula is a long-run average, the law of large numbers (and the gambler's fallacy), fair games
  and fair price, insurance, the SD of a random variable, and E(aX + b) and E(X + Y).
  Examples: two-dice sum (E = 7), a raffle (−\$3.60), the old SAT guessing penalty (E = 0 and 1/16),
  and comparing the risk of two games (σ = 5 vs √475 ≈ 21.79).
- `lessons/28h2-binomial-distribution.md` (a2-h-binomial-dist), "The binomial distribution",
  ~1,470 words. Covers the BINS setting, deriving P(X = k), the link to the binomial theorem (the
  probabilities add to 1), "at least" and "at most", binompdf/binomcdf, μ = np, σ = √(np(1−p)),
  the normal approximation and its rule of thumb, and the 10% guideline.
  Examples: the full n = 5, p = 0.7 distribution; quiz guessing (0.2816, P(X ≥ 6) ≈ 0.0197);
  62 heads in 100 flips (z = 2.4, exact tail ≈ 0.0105).
- `lessons/28h3-bayes-theorem.md` (a2-h-bayes), "Bayes' theorem and reasoning from evidence",
  ~1,460 words. Covers the law of total probability, deriving Bayes' theorem, sensitivity and
  specificity, the four result types, natural frequencies, prior and posterior, updating, the base
  rate fallacy (Casscells 1978), the prosecutor's fallacy, and the two-way-table view.
  Examples: which machine made a defect (0.625); 1% prevalence with 90%/91% (90/981 ≈ 0.092); a
  second positive test (≈ 0.503).

**Core lessons** (additions only, no existing text changed):
- 25-counting: a license-plate slot picture after Example 1, and a "Choosing a counting method"
  Mermaid flowchart in "Does order matter?".
- 26-binomial-theorem: a picture of picking a or b from each factor of (a+b)³ in "Why the
  coefficients are combinations", and a "Finding one term" Mermaid procedure after Example 5.
- 27-probability: a Venn diagram of hearts and face cards in the addition-rule section (one new
  bolded term, **Venn diagram**, plus one sentence reading the regions), and a new short
  "Which rule?" section with a Mermaid decision chart, placed just before Common mistakes.
- 28-normal-distribution: a "Choosing a method for a normal probability" Mermaid chart at the end of
  the normal-CDF section, and a "From a population to an estimate" Mermaid chart in the sampling
  section.

**Pictures** (8 original SVGs in `images/`, each 1–12 KB, all rendered and checked, markers
checked on the blank ones): a2-m8-plate-slots, a2-m8-choose-factors, a2-m8-pascal-blank,
a2-m8-venn-cards, a2-m8-venn-cards-blank, a2-m8-normal-blank, a2-m8-bayes-tree,
a2-m8-bayes-tree-blank.

**Diagrams** (7 Mermaid, all with accTitle/accDescr, all rendered): counting method, finding one
term, which probability rule, normal-method choice, population to estimate, binomial-setting
check (28h2), Bayesian updating loop (28h3). Honors lessons also have 3 `plot` bar charts:
two-dice distribution, binomial n = 5, p = 0.7, and binomial n = 30, p = 0.5 with a normal curve
drawn over it.

**Questions** (`questions/r2-a2-m8.yaml`, 62 new)
- Core, a2-m8-r2-q01…q20 (5 per lesson): text 5 (q01, q05, q07, q12, q17), match 4 (q02, q10,
  q13, q18), order 4 (q03, q08, q15, q19), select-all 4 (q04, q09, q14, q20), label 3 (q06 Pascal,
  q11 Venn, q16 normal regions). module_quiz: q02, q04, q06, q10, q12, q14, q16, q18 (2 per lesson).
  No label question for lesson 25: its picture (plate slots) has nothing worth labeling.
- Honors, a2-m8-r2-h01…h42 (14 per lesson): each lesson has 9 multiple choice and 5 other types.
  Expected value: text h06 and h10, match h11, order h12, select-all h13. Binomial: text h23 and
  h24, match h25, order h26, select-all h27. Bayes: label h38, text h39, match h40, order h41,
  select-all h42. No module_quiz, since these are honors lessons in a core module.
- Answer positions of the 27 honors 4-choice questions: 0: 6, 1: 8, 2: 7, 3: 6.

**Drills** (`drills/r2-a2-m8.yaml`, 7, all linked from the honors lessons): a2-m8-r2-expected-value,
a2-m8-r2-fair-price, a2-m8-r2-binom-exact, a2-m8-r2-binom-atleast, a2-m8-r2-binom-mean-sd,
a2-m8-r2-total-prob, a2-m8-r2-bayes-test. I generated each drill 400 times and recomputed every
answer independently with scipy: 0 mismatches. Every correctly rounded answer (2 or 4 dp) falls
within tolerance; 4-dp answers use tolerance 0.00006. The fair-price drill only uses inputs where
the fair price is a whole number of cents. Big numbers inside TeX use `:dp0`, so no "1,700" shows up
in math.

**Glossary** (`glossary-r2-a2-m8.yaml`, 24 terms; I checked every glossary*.yaml in the course,
including the other writers' r2 files, and found no duplicates): Venn diagram, random variable,
probability distribution, expected value, law of large numbers, fair game, fair price, Bernoulli
trial, binomial setting, binomial distribution, binomial probability formula, normal approximation
to the binomial, law of total probability, Bayes' theorem, sensitivity, specificity, true positive,
false positive, false negative, prevalence (alias base rate), natural frequencies, prior
probability, posterior probability, base rate fallacy. Every term bolded in the new text has an
entry. (The bold list lead-ins "Two outcomes:", "Sums." and so on are labels, not terms.)

**Cards** (`cards-r2-a2-m8.yaml`, 30): Expected value 10, Binomial distribution 9, Bayes' theorem 9,
plus 2 core cards (Venn diagram for "or", choosing a counting method).

## For a reviewer to double-check
- SAT guessing penalty: −¼ point on 5-choice questions until the March 2016 redesign. The lesson
  says "Until a 2016 redesign".
- Casscells, Schoenberger and Graboys (1978): 60 respondents, the most common answer was 95%
  (27 of 60), and 11 of 60 gave the correct ≈2%. I checked this against a PMC review (PMC4955674).
  The lesson says "60 doctors and medical students" and doesn't name the hospitals.
- Bayes/Price/Laplace: Bayes died in 1761, Price presented the essay to the Royal Society in 1763,
  and Laplace stated the general form independently in 1774. Jacob Bernoulli's book: 1713
  (published after his death; the lesson only says it "appeared in 1713").
- The insurance numbers in 28h1 are labeled as made up for illustration. The second-test
  independence in 28h3 Example 3 is labeled as a simplification. The normal-approximation rule
  of thumb (10, with some books using 5) and the 10% guideline are labeled as guidelines.
- 28h2 states σ = √(np(1−p)) without a full proof. It is justified as "variances of independent
  variables add", labeled as a fact from statistics courses.
- Lesson 25's new flowchart treats "arranging all n items with identical groups" as a branch under
  "no repeats". Arrangements of letters like BANANA do reuse a letter, but the lesson already treats
  the letters as distinct tiles. The wording ("Can an item be used more than once?") follows that
  view.
- q06 (Pascal label): two of the blanks hold 21 and 35, and the same values also appear printed
  elsewhere in row 7 (by symmetry). This is intended as a hint, not an ambiguity.

## Errors found in existing content
None. I re-read all 49 existing a2-m8 questions, the 12 drills and the four core lessons. I spot-checked
the numbers in the lesson examples (normal areas 0.7865 and 0.0228, invNorm 46.4, the combinations)
and found nothing wrong.

## Sources
- Standard results (binomial distribution, expected value, Bayes' theorem) are written from first
  principles; all numbers were recomputed in Python (fractions, scipy.stats.binom).
- Casscells et al. 1978 figures: summary in PMC4955674 (pmc.ncbi.nlm.nih.gov/articles/PMC4955674).
