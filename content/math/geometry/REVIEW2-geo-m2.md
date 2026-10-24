# Round 2 review: geo-m2 (Reasoning and proof), item 52

Reviewed: honors lessons 07h1, 07h2, 07h3; additions to core lessons 05, 06, 07; `questions/r2-geo-m2.yaml` (55),
`drills/r2-geo-m2.yaml` (2), `glossary-r2-geo-m2.yaml` (27), `cards-r2-geo-m2.yaml` (30), `images/geo-m2-*` (5 SVGs).
`content/math/check-module.sh geometry geo-m2` reports OK after the fixes (6 lessons, 88 questions, 6 drills).

## Changes

1. **07h1, "Truth tables" section (factual).** The lesson said the vacuous-truth convention is "the only choice that makes the conditional agree with its contrapositive and keeps the laws of deduction working, as Example 1 shows". Overstated: making the row (F, T) false also gives agreement with the contrapositive (the conditional becomes the biconditional), and Example 1 doesn't show uniqueness. Rewrote it as: with this convention every conditional agrees with its contrapositive (Example 1 checks it), and any other choice for the last two rows either breaks that agreement or turns $p \to q$ into "$p$ iff $q$". I checked all four possible assignments for those two rows in Python: (T,T) is the conditional, (F,T) the biconditional, and (T,F) and (F,F) both fail to agree with the contrapositive.
2. **07h2 Example 4, and the glossary entry `irrational number` (factual).** "Irrational" was defined as "not a fraction of whole numbers". In this course whole numbers are nonnegative, so that definition would make $-\tfrac12$ irrational. Changed to "a real number that cannot be written as a fraction $\tfrac ab$ of integers with $b \ne 0$". The lesson also notes that because $\sqrt2 > 0$, ruling out fractions of positive whole numbers is enough, so the proof is unchanged. (Standard definition, e.g. OpenStax *Prealgebra 2e* §7.1 and *Intermediate Algebra 2e* §1.1.)
3. **07h3 Example 2 (other: precision).** "The $k$ points cut the new line into $k+1$ pieces (two rays at the ends and $k-1$ segments between)" is wrong for $k = 0$, which the proof needs because its base case is $n = 0$. Added "for $k \ge 1$ …; for $k = 0$, the whole line". The count $k + 1$ was already right.
4. **07h3, "The circle regions, revisited" (other: wording).** Removed a doubled phrase, "here we just check it. Check it: …".
5. **Question geo-m2-r2-h22 (answer key: missing accepted forms).** Added `k(2k+2)` and `2k(1+k)` to `accept`. Both are correct expressions for $m$ that were not accepted.

## Checked and found right (things a reader might doubt)

- Every question was worked independently. All 55 keys are correct, every select-all set is exact, and the order questions (q08, q12, h09, h17, h31) have only one valid order. Match and label answers are plain text.
- Label markers: I computed each one against the SVG geometry. Each sits inside the region its label names: q04 markers 1–3, and q09 markers 1–4 (the kite is inside the outer ellipse and outside the rhombus ellipse; the rectangle is outside everything). In the pictures, the rhombus (36 × 60, equal sides) is not a square, the kite has perpendicular diagonals and unequal adjacent sides, the "2-by-5" rectangle is drawn 60 × 24, and the rectangle in the syllogism figure has non-perpendicular diagonals.
- Rendered all 5 SVGs, all 7 Mermaid diagrams and the 3 `shape` figures. All are readable and nothing is cut off. Mermaid edge labels sit on their edges, as Mermaid always draws them.
- Numbers recomputed in Python: circle regions $1 + \binom n2 + \binom n4$ = 1, 2, 4, 8, 16, 31, 57; line regions $R(n)$ (16 → 22, $R(10) = 56$); 190 segments for 20 points; $1+\dots+39 = 400$; $11+\dots+39 = 375$; the odd-range drill identity $b^2 - a^2$ for every allowed $(a, b)$; $(k+1)^2+(k+1)+1 = (k^2+k+1)+(2k+2)$; truth tables for the contrapositive, $\sim p \vee q$ and De Morgan's laws.
- History: De Morgan published his laws in the 1840s (*Formal Logic*, 1847), and Ockham and other medieval logicians stated them in words earlier (MacTutor, De Morgan). Aristotle's mention of the odd/even proof that the diagonal is incommensurable is *Prior Analytics* I.23 (41a26–27). Crediting the discovery to the Pythagoreans is labeled "traditionally", and Hippasus' drowning is labeled a legend (Heath, *A History of Greek Mathematics* vol. 1; MacTutor, Hippasus). "Modus tollens is sometimes called the Law of Contrapositive" matches some US high-school texts, and the lesson says "some books".
- The cross-references are correct: indirect proof in Module 4 (lesson 14), why the diagonal of a unit square is $\sqrt2$ in Module 6 (lesson 22), axiom systems in Module 10 (lesson 39).
- The core-lesson chart in 06 uses the contrapositive (the q10 key relies on it). The contrapositive is taught in lesson 05, so the chart is supported.
- Glossary: no term or alias duplicates another glossary file in the course. "indirect proof / proof by contradiction" and "contrapositive" stay in the main glossary, as the writer said.

## Overlap

- 07h3 Example 2 proves the line-regions formula by induction. geo-m1 honors lesson 04h2 makes essentially the same "the $k$th line adds $k$ regions" argument informally. The writer acknowledged this and cross-references 04h2. I think the overlap is acceptable because 07h3 uses it as a formal induction example, so I made no change.
- No other round-2 lesson in the course teaches truth tables, quantifiers, the irrationality of $\sqrt2$ or induction.

## Uncertain

Nothing open.
