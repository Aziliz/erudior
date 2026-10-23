# Round 2 notes: geo-m2 (Reasoning and proof)

`content/math/check-module.sh geometry geo-m2` reports zero problems: 6 lessons, 88 questions, 6 drills.

## Honors lessons (3, all `honors: true`, `module: geo-m2`)
I wrote a third lesson because induction fits this module well: it answers lesson 05's "patterns can lie" by proving patterns.
- `lessons/07h1-symbolic-logic.md`, id `geo-m2-h-symbolic-logic`: "Symbolic logic: truth tables, negations and valid arguments" (45 min). Covers connectives, truth tables ($2^n$ rows), a truth-table proof of the contrapositive rule, tautology and contradiction, De Morgan's laws, $\sim(p \to q) \equiv p \wedge \sim q$, quantifiers and how to negate them, valid and sound arguments, modus ponens and tollens, disjunctive syllogism, and denying the antecedent. 3 worked examples.
- `lessons/07h2-proof-methods.md`, id `geo-m2-h-proof-methods`: "Proof strategies: contrapositive, contradiction and cases" (45 min). 5 worked examples: a linear-pair proof by contrapositive; "$n^2$ even ⇒ $n$ even"; "two lines meet in at most one point" by contradiction from the two-points postulate; $\sqrt2$ irrational; a proof by cases on linear pairs. Also what examples can and can't prove, and a decision chart for choosing a method.
- `lessons/07h3-mathematical-induction.md`, id `geo-m2-h-induction`: "Mathematical induction: from patterns to proofs" (45 min). Covers the principle, why it is valid (well-ordering / smallest counterexample), and 3 worked examples: segments $n(n-1)/2$, regions made by $n$ lines in general position $\tfrac{n(n+1)}{2} + 1$, and the sum of odd numbers $= n^2$ with a gnomon figure. It revisits the circle-regions count (formula stated without proof). Pitfalls: a missing base case, and the all-horses joke.

Prose word counts (without tables, code blocks or display math): about 1,890, 1,630 and 1,500.

## Core lessons (additions only)
- 05: an Euler (set) diagram of "square ⇒ rectangle" (SVG), with a short paragraph on counterexamples to the converse; a Mermaid diagram of conditional / converse / inverse / contrapositive.
- 06: a nested-sets SVG for the syllogism square ⊂ rhombus ⊂ perpendicular diagonals (with a kite and a rectangle); a Mermaid chart "what can you conclude from a true conditional" (detachment, contrapositive, syllogism, nothing follows).
- 07: a Mermaid flowchart proof of the Vertical Angles Theorem; a Mermaid procedure for finding a proof (forward, backward, bridge, check reasons).

## Questions (`questions/r2-geo-m2.yaml`, 55)
- Core (q01–q16): 4 text, 4 match, 2 order, 3 select-all, 2 label, 1 multiple choice. Module quiz: q02, q03 (05); q07, q10 (06); q12, q15 (07).
- Honors (h01–h39, 13 per lesson): 8 text, 3 match, 3 order, 4 select-all, 21 multiple choice. New types per lesson: 6, 5 and 7 of 13.
- Multiple-choice answer positions: 0 ×5, 1 ×5, 2 ×6, 3 ×6.

## Pictures and diagrams
- `images/geo-m2-square-rectangle.svg` + `-blank.svg` (label question q04), `images/geo-m2-syllogism-sets.svg` + `-blank.svg` (label q09), `images/geo-m2-quantifiers.svg` (07h1). All were previewed and the markers checked.
- 7 Mermaid diagrams: 05 ×1, 06 ×1, 07 ×2, 07h1 ×1, 07h2 ×1, 07h3 ×1. All previewed.
- 3 `shape` figures in honors lessons (two lines crossing at P, 3 lines making 7 regions, odd-number gnomons), rendered and checked.

## Drills (`drills/r2-geo-m2.yaml`)
`geo-m2-r2-line-regions` (regions from $n$ lines in general position) and `geo-m2-r2-odd-sum` (sum $1 + 3 + \dots + (2n-1)$), linked from 07h3. Whole-number answers.

## Glossary and cards
- `glossary-r2-geo-m2.yaml`: 28 terms (truth table, truth value, compound statement, conjunction, disjunction, tautology, contradiction, De Morgan's laws, quantifier, universal statement, existential statement, valid argument, sound argument, modus ponens, modus tollens, denying the antecedent, direct proof, proof by contrapositive, proof by cases, irrational number, incommensurable, mathematical induction, base case, inductive step, inductive hypothesis, well-ordering principle, general position, gnomon). Before adding them I checked every term and alias against `glossary.yaml` and `glossary-r2-geo-m3.yaml`. "Proof by contradiction" and "indirect proof" already exist (the indirect proof entry), so I didn't add them again.
- `cards-r2-geo-m2.yaml`: 30 cards (3 core, 10 / 8 / 9 for the honors lessons).

## For a reviewer
- Truth tables, argument validity, the line-region and circle-region counts and the odd sums were all checked in Python.
- History, worded cautiously: De Morgan stated his laws in the 1840s, and medieval logicians described the idea earlier. The discovery of incommensurability is "traditionally credited" to the Pythagoreans, and the Hippasus drowning story is called a legend. Aristotle mentions the odd/even argument for the diagonal (Prior Analytics I.23). Gnomon pebble figures are "traditionally linked" with the early Pythagoreans.
- 07h2 Example 3 notes that lesson 01 lists "two lines meet in at most one point" as a postulate, though it follows from "two points determine a line". This is consistent with lesson 01 and is not a correction to it.
- The Mermaid chart added to lesson 06 includes the branch "q is false ⇒ p is false (use the contrapositive)". The core text doesn't name this rule (modus tollens), but it follows from lesson 05's contrapositive rule, and the chart's caption says so. Question q10 relies on it.
- The circle-regions formula in 07h3 is stated without proof and labeled as such.

## Errors found in existing content
None in lessons 05–07, `questions/m2.yaml` or `drills/m2.yaml`. No existing files were edited apart from the additions to lessons 05–07.

## Sources
Standard logic and proof material (truth tables, De Morgan's laws, valid argument forms, induction). The historical notes rely on standard histories of Greek mathematics: Heath, *A History of Greek Mathematics*, and the MacTutor History of Mathematics biographies of De Morgan and Hippasus. All writing, examples and figures are original.
