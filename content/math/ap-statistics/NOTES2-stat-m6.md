# Round 2 notes: stat-m6 (Random variables)

Module check: `content/math/check-module.sh ap-statistics stat-m6` reports OK: 6 lessons, 92 questions, 16 drills, zero problems.

## Honors lessons (2)
- `lessons/27h1-indicators-linearity.md`, `stat-m6-h-indicators`, "Linearity of expectation and indicator variables" (45 min, about 1,900 words). It proves that means add without independence, defines indicator variables, and works four examples: the hypergeometric mean (the box of 12 from lesson 26), the matching problem (checked for n = 3 by listing every case), the coupon collector (n = 6: 14.7 boxes, SD 6.24) and the expected number of shared-birthday pairs (versus the probability of at least one). It ends with Common mistakes and Key points.
- `lessons/27h2-covariance.md`, `stat-m6-h-covariance`, "Covariance: when random variables move together" (45 min, about 1,800 words). It covers joint tables of two random variables, covariance and its shortcut, ρ, the fact that independent implies uncorrelated but not the reverse (Y = X²), and a proof of Var(X ± Y) and Var(aX + bY). Examples: a railway joint table (Cov 0.17, Var(T) 1.19, checked directly), diversification (50(1 + ρ), labeled as a simplified model), the finite population correction derived from negative covariance (box of 12: SD 0.772 against a binomial 0.968), and why the 10% condition works (labeled as a convention).

## Core lessons (additions only)
- 24: balance-point picture (`images/stat-m6-ev-balance.svg`) with a short lead-in; a Mermaid tree for the two-relay example.
- 25: a Pythagorean ```shape (SDs 3, 4 → 5); a Mermaid "which rule when" chart; a ```plot of D = A − B ~ N(3, 5) with P(D > 0) shaded.
- 26: a Mermaid "is it binomial?" chart; a picture of the three binomial shapes for n = 10 (`images/stat-m6-binomial-shapes.svg`) with two sentences about it.
- 27: a Mermaid chain (F F F S for the first success on call 4); a ```plot of the geometric cdf 1 − 0.85^k; a Mermaid model-choice chart after the existing table.

## Questions (`questions/r2-stat-m6.yaml`, 48)
- Core lessons, 20 (q01–q20, 5 per lesson): label 2, text 6, order 4, match 4, select-all 4. module_quiz: q01, q05, q07, q11, q13, q17.
- Honors, 28 (h01–h14 for 27h1, h15–h28 for 27h2): multiple choice 14, text 6, select-all 4, match 2, order 2. The honors questions have no module_quiz flag, because honors lessons in a core module are left out of the module quiz.
- The correct answers to the 14 honors multiple-choice questions are spread over positions 0/1/2/3 as 4/3/3/4.

## Drills (`drills/r2-stat-m6.yaml`, 6)
stat-m6-r2-coupon, -shared-pairs, -empty-boxes (27h1); -cov-table, -portfolio, -fpc (27h2). I generated 300 instances of each and checked them against an independent Python calculation with 0 mismatches. -fpc was checked against exact hypergeometric sums. Every tolerance is at least half of the last decimal place asked for.

## Pictures and diagrams
- SVG: stat-m6-ev-balance (+ -blank), stat-m6-binomial-shapes (+ -blank). I previewed each one, and previewed the blanks with their label markers.
- Mermaid: 7 (relay tree, combining rules, is-it-binomial, F-F-F-S chain, binomial-or-geometric, indicator method, variance-of-a-sum). All are previewed, and all have accTitle and accDescr.
- Figures: 5 (```shape triangle, normal plot, geometric cdf, coupon stage bars, portfolio SD against ρ).

## Glossary and cards
- `glossary-r2-stat-m6.yaml`: 9 terms. linearity of expectation, indicator variable, matching problem, coupon collector problem, harmonic number, covariance, uncorrelated, diversification, finite population correction (alias FPC). I grepped every glossary file in the course, and none of these terms or aliases appears elsewhere.
- `cards-r2-stat-m6.yaml`: 20 cards, 10 per honors lesson (topics: Linearity of expectation, Covariance).

## For the reviewer
- q11 (binomial-shapes label question) has 3 labels and no distractors, and its blank image uses the same panel order as the lesson picture.
- 27h1 states facts that are given, not derived: H_n ≈ ln n + 0.58 for large n, and P(no match) → 1/e. The coupon-collector simulation figures ("about 58% need 14 boxes or fewer", "about 1 in 200 need 40 or more") come from my own 200,000-run simulation.
- In 27h2, the investment example is labeled as simplified, and so is the sentence that correlations tend to rise in crises (a general observation that I did not attribute to a source). The 10% rule is called a convention.
- The 27h2 railway joint table is invented for illustration.

## Errors found in existing content
None. I re-read lessons 24–27 and recomputed their numbers, and no existing question, drill, card or glossary entry was edited.

## Sources
All results used are standard probability results: linearity of expectation, indicators, the matching problem, the coupon collector problem, covariance identities and the hypergeometric variance with the finite population correction. Every number was recomputed in Python, by exact enumeration where possible (hypergeometric, matching for n = 3 and 4, the joint table) and by simulation for the coupon collector. No outside text was copied.
