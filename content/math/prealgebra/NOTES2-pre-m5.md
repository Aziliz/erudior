# Pre-algebra module 5 (pre-m5, Percents), round 2: writer notes

## Added

**Honors lessons (2)**
- `lessons/19h1-compound-interest.md` (pre-m5-h-compound-interest, "Compound interest and exponential growth", 45 min, about 1,740 words of prose plus tables and figures): year-by-year table (\$1,000 at 10%, exact numbers), $A = P(1 + r)^t$ and the growth factor, exponential growth versus simple interest, $A = P(1 + r/n)^{nt}$ with a table of compounding frequencies (and a one-line mention of continuous compounding and $e$), APY and comparing accounts, APR (labeled a simplified description), the rule of 72 with an accuracy table, depreciation $A = P(1 - r)^t$. 5 worked examples.
- `lessons/19h2-percent-reasoning.md` (pre-m5-h-percent-reasoning, "Reasoning with percents: chains, reversals and percentage points", 40 min, about 1,640 words): multipliers, chains of changes, why order doesn't matter for percent changes (and does with a flat amount off), undoing a change ($r/(1+r)$, $r/(1-r)$, table), percentage points versus relative change, absolute versus relative risk, Simpson's paradox (invented free-throw data). 6 worked examples.

**Core lessons (additions only)**
- 17-pct-basics: hundred-grid picture (37%), triple number line picture (fractions / decimals / percents), Mermaid conversion map.
- 18-pct-solve: bar model picture for "42 is 60% of what number?", Mermaid "which kind of percent problem" decision chart, bar plot for +20% then −20% (100 → 120 → 96).
- 19-pct-apps: Mermaid chain original price → sale price → total, receipt picture for Example 3, plot of simple vs compound interest (\$1,000 at 5%, 20 years).

**Questions (`questions/r2-pre-m5.yaml`, 43)**
- Core, 5 per lesson (pre-m5-r2-q01–q15): 3 text, 3 match, 3 order, 3 select-all, 3 label. `module_quiz: true` on q02, q04, q07, q09, q11, q13 (2 per lesson).
- Honors compound interest (h01–h14): 9 multiple choice, 2 text, 1 match, 1 select-all, 1 order.
- Honors percent reasoning (h15–h28): 9 multiple choice, 2 text, 1 match, 1 select-all, 1 order.
- Answer positions of the 18 new multiple-choice questions: 0→4, 1→4, 2→5, 3→5.

**Pictures (7 SVGs in `images/`, original)**: pre-m5-hundred-grid, pre-m5-percent-bar (+ -blank), pre-m5-bar-model (+ -blank), pre-m5-receipt (+ -blank), pre-m5-undo-change. **Mermaid**: 5 (3 core, 1 per honors lesson). **Plots**: 4 (1 in lesson 18, 1 in lesson 19, 2 in 19h1).

**Drills (`drills/r2-pre-m5.yaml`, 8)**: pre-m5-r2-compound-annual, -compound-n, -apy, -rule72, -depreciation (all five linked from 19h1); pre-m5-r2-net-change, -undo-change, -points (19h2). All 8 pass the checker. Rounded answers: half-cent / half-last-place cases excluded with `where`, tolerances 0.0051 (2 dp) and 0.051 (1 dp) around the exact value.

**Glossary (`glossary-r2-pre-m5.yaml`, 13)**: growth factor, exponential growth, compounding period, annual percentage yield (APY), APR, rule of 72, doubling time, depreciation, multiplier, percentage point, relative change, absolute change, Simpson's paradox. Checked against every glossary file in the course: no duplicates. (compound interest already exists.)

**Cards (`cards-r2-pre-m5.yaml`, 20)**: 11 Compound interest, 9 Percent reasoning.

`content/math/check-module.sh prealgebra pre-m5`: OK, zero problems.

## For a reviewer
- APR wording (19h1, glossary, card): "roughly the yearly cost of a loan, including some fees, but generally without compounding". It's labeled simplified; U.S. rules (Truth in Lending) have many details.
- Rule of 72 accuracy claim: "within about 4% of the true doubling time for 3%–15%, most accurate near 8%" (checked: the worst case in that range is 3.2%, at 15%).
- 19h1 says U.S. banks must disclose APY on savings accounts and CDs (Truth in Savings Act / Regulation DD).
- 19h2's medicine example and Simpson's-paradox table are invented and labeled as such.
- Label marker positions were checked on rendered previews.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Standard formulas (compound interest, APY) recomputed in Python; Truth in Savings Act / Regulation DD (APY disclosure) and Truth in Lending Act / Regulation Z (APR) from general knowledge. All examples and numbers are original and checked in Python.
