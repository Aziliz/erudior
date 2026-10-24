# REVIEW2-calc-h1: review of honors module calc-h1, "Honors: Toward analysis"

Reviewer, independent of the writer. Scope: lessons 90–93, `questions/r2-calc-h1.yaml` (h01–h56), `drills/r2-calc-h1.yaml`, `glossary-r2-calc-h1.yaml`, `cards-r2-calc-h1.yaml`, `images/calc-h1-*`.
After the fixes, `content/math/check-module.sh calculus calc-h1` reports **OK** (4 lessons, 56 questions, 8 drills, 38 cards).

## Changes

| Where | What was wrong | Change |
|---|---|---|
| calc-h1-r2-h02 (explanation) | It said the distractor 39 comes from writing $\lvert a_n - 2\rvert$ as $\frac{1}{2(n+1)}$. That expression gives 9, not 39. 39 comes from $\frac{2}{n+1}$. | The explanation now says the distractor comes from miscomputing the numerator as $\frac{2}{n+1}$. |
| calc-h1-r2-h54 (match) | It had two defensible answers. $x^2$ is increasing on $[0, 1]$, so "Integrable because it is monotone" was also a true pairing for it. | The function is now $(2x - 1)^2$, which is continuous and not monotone on $[0, 1]$. The explanation says so. |
| drill calc-h1-r2-recursive-limit | With L = 3 and bb = 3, cc = 0. The prompt then showed $\sqrt{0 + 3a_n}$, and the solution said "its roots are 3 and a negative number", but the other root is 0. This affected about 1 in 18 instances. | Added `where: ['L > bb']`. The other root, $-(L - bb)$, is now always negative. |
| Lesson 91, Archimedean section | It quoted Lesson 90 as saying "choose a whole number $N \ge \frac1\varepsilon$". Lesson 90 never says that. | The sentence now says Lesson 90 relied on the property silently, because conditions like $n > \frac1\varepsilon$ need whole numbers that large to exist. |
| Lesson 91, Mermaid | The node label left out "nonempty" from the completeness axiom. | The label now reads "every nonempty set bounded above has a sup". |
| Lesson 92, after the chain diagram | "FTC Part 2 also needs Part 1" was stated as absolute. It holds only for this route: the usual partition-and-MVT proof of FTC 2 doesn't use Part 1. | Changed to "Along this route, FTC Part 2 also needs Part 1 (to know that $\int_a^x f(t)\,dt$ is an antiderivative)". |
| Card "Chain from completeness to FTC 2" | It had the same omission. | Added "(which also uses FTC Part 1)". |
| images/calc-h1-sup.svg | The text "upper bounds" ran into the vertical "upper bound" tick at x = 600. | Moved the text left (x 560.4 → 545). It is still over the shaded region. The blank copy has no text and is unchanged. |

## Checked and found right (things a reader might doubt)

- **Lesson 90.**
  - Example 1: N = 99 is the smallest cutoff for ε = 0.01.
  - Example 2: the simplification $(n + 10)/(2n(2n - 1))$ is right. The bound $\le \frac1n$ holds for $n \ge 10$. A brute-force search with exact fractions confirms the last term outside the 0.001 band is n = 260.
  - The terms of Example 2 decrease monotonically, which backs "Example 2's terms move steadily".
  - The plot values of $(-1)^n n/(n+1)$ are right.
- **Lesson 91.**
  - The sup and inf in Example 1 are right.
  - In Example 2, the terms 1, 1.732, 1.932, 1.983 and the limit 2 are right.
  - The nested-interval, Bolzano–Weierstrass and Cauchy arguments are sound.
  - The quote from 05h2 ("is really a statement that the real line has no holes") matches 05h2 line 124.
- **Lesson 92.**
  - The bisection table is right: f(0.5) = −0.375, f(0.75) = 0.171875, f(0.625) = −0.130859375, and the root is ≈ 0.682328 (sympy).
  - The interval lengths are $(b - a)/2^{k-1}$.
  - Example 3 uses $x_n = \sqrt{1 - 1/(2n)}$, which gives $f(x_n) = 1 - \frac{1}{2n} > 1 - \frac1n$.
  - The claim that $\sin(1/x)$ with $f(0) = 0$ has the intermediate value property is correct, so it is a valid counterexample to the converse of the IVT.
  - The cross-references are right: Lesson 17 has the EVT, Fermat, Rolle and "tilt the picture"; Lesson 5 has the bisection method.
- **Lesson 93.**
  - Example 1 is right: L = 1.75, U = 3.75.
  - Example 2: n = 801.
  - The monotone telescoping and the Heine–Cantor sketch are right.
  - The FTC 1 proof is right.
  - Lesson 22 does make the promise the lesson quotes (line 84).
- **History** (all hedged in the text and correct):
  - Bolzano's 1817 halving argument, used as a lemma for the IVT; Weierstrass made the theorem standard about 50 years later ([Wikipedia: Bolzano–Weierstrass theorem](https://en.wikipedia.org/wiki/Bolzano%E2%80%93Weierstrass_theorem); [St Andrews, Bolzano](https://mathshistory.st-andrews.ac.uk/Strick/Bolzano.pdf)).
  - Dedekind's and Cantor's constructions of the reals (1872).
  - Riemann's Habilitationsschrift (1854).
  - Darboux's 1875 memoir.
  - Lebesgue's thesis (1902).
- **Questions.** I worked all 56 before reading the keys, and every key is right. Specifically:
  - Each select-all list is exactly the true set.
  - The order questions (h06, h20, h31, h48) have no steps that can be swapped.
  - The match questions (h12, h26, h38, and h54 after the fix) have unique pairings.
  - h13 = 1/19, h21 = 3, h32 = 0.6875, h44 = 4, h49 = 2701, h55 = 16.
- **Drills.** I generated 400 instances of each of the 7 new drills from the built JSON. A separate script re-solved each prompt from its text alone, with brute-force cutoffs and exact fractions.
  - Correct answers were accepted in every instance, as exact fractions and as rounded decimals at the precision the prompt asks for.
  - Off-by-one cutoffs, swapped sup/inf and wrong decimals were rejected.
  - No unfilled placeholders, "+ -", "1x" or thousands commas.
  - After the fix: 0 failures.
- **Pictures.** I rendered all 4 SVGs and the 4 blank copies with their markers. The geometry is right:
  - In the bisection figure, the root sits at 0.682 and the bars are correctly nested.
  - In the Darboux figure, the stacked gap heights 22 + 42 + 62 + 82 equal f(b) − f(a), and the column width equals Δx.
  - In the sup figure, the dots are at the correct places for 1 − 1/n.
  - Every marker sits on the part its label names.
- **Mermaid and plots.** All 3 Mermaid diagrams render readably, and their accTitle and accDescr cover the whole diagram. The plot labels do not sit on the curves.
- **Glossary and cards.** All 22 glossary entries and 38 cards are correct. The checker found no duplicate terms.

## Overlap with other round 2 work (reported, not changed)

- `calc-h1-r2-bisection-steps` and question h42 practise the same skill as `calc-m1-r2-bisection-steps` in 05h2: how many halvings until the interval is shorter than a tolerance. Both are correct, but one of them is redundant. Consider dropping one, or relinking the lesson to the calc-m1 drill.
- These lessons cross-reference 05h1 (sum law for functions) and 25h2 (telescoping picture) and say so explicitly. That is acceptable.
- 08h2 also discusses Darboux's theorem, a different result from the Darboux integral in Lesson 93. There is no conflict, but readers may confuse the two names.

## Left uncertain

- Nothing that affects accuracy.
- The `calc-h1-r2-sup-inf` prompt asks for exact values but also accepts decimals to 4 places (tolerance 0.0001). The writer noted this as normal app behavior, and I left it.
