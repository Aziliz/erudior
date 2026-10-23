# Round 2 notes: stat-m5 (Probability)

`content/math/check-module.sh ap-statistics stat-m5`: build and checker report zero problems
(7 lessons, 110 questions, 20 drills).

## Honors lessons (2)

1. `lessons/23h1-inclusion-exclusion.md`, id `stat-m5-h-inclusion-exclusion`: **Inclusion–exclusion,
   birthdays and matching** (about 1,840 words, 45 min). Three-event rule with a counting argument for
   why the triple term comes back; filling in a three-circle Venn diagram from the center out;
   general n-event formula; union bound (Boole) with the Bonferroni pattern stated without proof;
   birthday problem (exact product, pairs argument, e^(−C(n,2)/365) approximation, "shares my
   birthday" contrast, model caveats); matching problem / derangements via inclusion–exclusion,
   limit 1/e. Four worked examples.
2. `lessons/23h2-odds-likelihood-ratios.md`, id `stat-m5-h-bayes-odds`: **Bayes with odds: likelihood
   ratios and weighing evidence** (about 1,790 words, 45 min). Odds; derivation of the odds form of
   Bayes; LR+ and LR− of a test; repeated tests and the conditional-independence assumption; log odds
   and weight of evidence (Turing and Good); prosecutor's fallacy with a simplified trace-evidence
   example and the Sally Clark case; Monty Hall in odds form, including how the host's rules change
   the answer. Four worked examples. Examples 1–2 reproduce lesson 22's 0.162 and 0.648 exactly.

Two honors lessons rather than three: the module's other natural extensions (binomial,
sampling distributions of simulation estimates) belong to stat-m6/stat-m7.

## Core lessons (additions only)

| Lesson | Pictures and diagrams added |
|---|---|
| 19 probability rules | SVG Venn diagram of Example 1 with region probabilities (`stat-m5-venn-coffee.svg`); Mermaid "which rule?" chart |
| 20 simulation | Mermaid four-step (State/Plan/Do/Conclude) chain; Mermaid simulation-based inference flow |
| 21 conditional probability | SVG area model of Example 1 (`stat-m5-area-model.svg`), with a short paragraph introducing the **area model**; Mermaid "mutually exclusive / independent / dependent" chart |
| 22 trees and Bayes | Mermaid steps of a Bayes calculation; SVG natural-frequency tree for Example 3 (`stat-m5-frequency-tree.svg`) |
| 23 counting | `shape` tree for the multiplication principle (2 shirts × 3 pants); Mermaid "which counting rule?" chart |

Front matter: lesson 21 also links `stat-m5-r2-without-repl`; lesson 22 links `stat-m5-r2-neg-test`.

## Questions (`questions/r2-stat-m5.yaml`, 54)

- Core, 25 (5 per lesson, ids `stat-m5-r2-q01`–`q25`): 3 label, 7 text, 4 match, 3 order,
  5 select-all, 3 multiple choice (q11's label answers are probabilities; the others name regions
  or groups). 2 per lesson marked `module_quiz: true`.
- Honors 1, 14 (`h01`–`h14`): 1 label, 2 text, 1 match, 1 order, 1 select-all, 8 multiple choice.
- Honors 2, 15 (`h15`–`h29`): 2 text, 1 match, 1 order, 1 select-all, 10 multiple choice.
- Multiple-choice answer positions (21 questions): 5 / 6 / 5 / 5 across indices 0–3.

## Pictures (`images/`)

`stat-m5-venn-coffee(-blank)`, `stat-m5-area-model(-blank)`, `stat-m5-frequency-tree(-blank)`,
`stat-m5-venn-three(-blank)`: original SVGs, 1–5 KB each, previewed with markers. The blank copies
are used by label questions q01, q11, q16 and h01.

## Drills (`drills/r2-stat-m5.yaml`, 8)

Core: `stat-m5-r2-without-repl` (two draws without replacement), `stat-m5-r2-neg-test` (P(D | −),
3 sig figs). Honors 1: `stat-m5-r2-incl-excl3`, `stat-m5-r2-birthday` (uses lgamma to avoid
overflowing 365!), `stat-m5-r2-derange`. Honors 2: `stat-m5-r2-odds-convert`,
`stat-m5-r2-odds-update`, `stat-m5-r2-repeat-tests`. Rounded answers: 4-decimal answers use
tolerance 0.0001, 2-decimal LR uses 0.006, others use `sigfigs: 3`.

## Glossary and cards

`glossary-r2-stat-m5.yaml` (9): area model, inclusion–exclusion principle, union bound, derangement,
odds, likelihood ratio, conditionally independent, weight of evidence, prosecutor's fallacy. No
duplicates with `glossary.yaml` or the other `glossary-r2-*.yaml` files present when checked.
`cards-r2-stat-m5.yaml` (20): 1 for the area model, 10 for honors 1, 9 for honors 2.

## For the reviewer

- All numbers recomputed in Python (birthday values, derangement counts and the listing of the 9
  derangements of 4, odds examples, cab problem 0.4138, DNA example 0.0196, Venn regions).
- Birthday section: "first published by Richard von Mises in 1939; who first posed it is
  uncertain" and "unevenness can only make a shared birthday more likely" (uniform birthdays
  minimize the match probability). Montmort's *problème des rencontres*, 1708.
- Sally Clark facts checked against Wikipedia: convicted November 1999; 1 in 73 million from
  squaring 1 in 8,543; RSS statement October 2001; convictions overturned January 2003, mainly over
  undisclosed microbiology evidence. Worth a second look since it is a real person.
- Turing and Good's "ban/deciban" weight-of-evidence scale is stated from general knowledge
  (Good's own accounts); not re-verified online.
- The trace-evidence and Monty Hall examples are labeled as simplified, with the assumptions stated.
- If the stat-h1 writer also defines odds, likelihood ratio or prosecutor's fallacy, one of the
  glossary entries needs to go.

## Errors found in existing content

None. (Lesson 19 says mutually exclusive vs. independent is covered in "lesson 21"; that matches the
current numbering.)

## Sources

Wikipedia: Sally Clark; Birthday problem; Derangement (for Montmort 1708 and von Mises 1939).
Everything else is standard probability (inclusion–exclusion, union bound, odds form of Bayes'
theorem, likelihood ratios of diagnostic tests).
