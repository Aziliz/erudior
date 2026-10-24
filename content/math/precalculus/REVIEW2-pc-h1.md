# REVIEW2-pc-h1: review of honors module pc-h1 ("Proof, infinity and the road to calculus")

Reviewer for item 114. Scope: lessons 90–93, `questions/r2-pc-h1.yaml` (h01–h56), `drills/r2-pc-h1.yaml` (8 drills), `glossary-r2-pc-h1.yaml` (31 terms), `cards-r2-pc-h1.yaml` (39 cards), `images/pc-h1-*` (6 SVGs + 3 blanks), 4 Mermaid diagrams and 2 plots.

`content/math/check-module.sh precalculus pc-h1` after the fixes: **zero problems** (4 lessons, 56 questions, 8 drills, 39 cards).

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| Lesson 90, end of Example 3 | Said the area under a curve "has to be defined by a limit, because" $\sqrt2$ is a limit of fractions. That is a misleading reason: $\int_0^1 x^2\,dx = \frac13$ is rational and still needs a limit. | Reworded: $\sqrt2$ is a limit of fractions ($1.4, 1.41, \dots$) without being one; later lessons define sums and areas as limits, and those limits need the real numbers, not just the fractions. | Standard (completeness of $\mathbb{R}$) |
| Lesson 91, "Why only the digits 4 and 5?" | Said "the last lesson of this module explains why" $0.5000\ldots = 0.4999\ldots$. That explanation ($0.999\ldots = 1$) is in lesson 92, the next lesson. Lesson 93 is the last one. | "the next lesson explains why" | Lesson 92 Example 1 |
| Lesson 91, plot of $\frac{x}{1-\lvert x\rvert}$ | The dashed asymptotes $x = \pm1$ ran through the axis tick labels "−1" and "1". | Each asymptote is now split into two pieces with a gap at the tick label. The y-range is now ±5 instead of ±8, which clears the "−0.4" tick label, and the "(0.75, 3)" label moved to (0.45, 3.6). Re-rendered and checked. | Rendered PNG |
| Lesson 92, Mermaid "Testing a series" | The last box said "Compare with a known series" without the positive-terms condition. The comparison test as taught only works for positive terms. (The accDescr already said so.) | Box now reads "Positive terms: compare with a known series, such as a p-series or geometric". | OpenStax Calculus Vol. 2, §5.4 (Comparison tests) |
| Lesson 93, FTC history | "Isaac Barrow … had already proved a geometric form of it" overstates the priority. Newton's fluxion work (1665–66) came before Barrow's *Lectiones Geometricae* (1669/1670). | "… published a geometric form of it around 1670." | Wikipedia, "Isaac Barrow" (first Lucasian professor in 1663, resigned in Newton's favour in 1669, *Lectiones Geometricae* 1670); arXiv 1111.6145 (Barrow and Leibniz on the FTC) |
| pc-h1-r2-h15 explanation | It cited $(0,1)$ and $(0,2)$ for "the same smallest and largest elements". Open intervals have no smallest or largest element. | Uses $[0,1]$ and $[0,2]$ (different largest elements, same cardinality). | — |
| pc-h1-r2-h38 explanation | It said the other three series have terms "larger than" $\frac1{k^2}$. At $k = 1$, $\frac1k = \frac1{k^2}$. | "at least as large as" | — |
| Drill pc-h1-r2-riemann-right, solution | With $b = 1$ the solution printed $\tfrac{1i}{n}$ ("1i"). | `{b}i` → `{b:coef}i` (2 places). It now prints $\tfrac{i}{3}$ or $\tfrac{3i}{2}$. | — |
| Card "Matching $(-1,1)$ with $\mathbb{R}$" | Said "Every interval has the same cardinality as $\mathbb{R}$". A one-point interval $[a,a]$ does not. | "Every interval of positive length …" (the lesson's own wording). | — |
| Card "Distance from velocity" | "Distance traveled = area under the velocity graph" holds only when the velocity is $\ge 0$. | Added "(for velocity $\ge 0$)". | — |

No answer key was wrong.

## Checked and found right (a reader might doubt these)

- **Every question key, worked independently.** All 56 questions, including each distractor's explanation, order uniqueness (h06, h20, h34, h49) and match/label pairings.
  - h17: $\pi(3,4) = 32$.
  - h28: position 20 is $(0,5)$.
  - h36: $\sum \frac{2}{k(k+2)} = \frac32$.
  - h37: $m = 6$, 64 terms; the actual $H_{31} \approx 4.027$ is the first partial sum past 4.
  - h45: $L_4 = \frac7{32}$.
  - h48: $L_n = \frac13 - \frac1{2n} + \frac1{6n^2} < \frac13 < R_n$.
  - h52: 64 m.
  - h54: $L_{10} = 0.285$.
- **Lesson numbers, recomputed in Python.**
  - $n^2+n+41$ is first composite at $n = 40$.
  - $30031 = 59 \cdot 509$, $2047 = 23 \cdot 89$, $2^{32}+1 = 641 \cdot 6700417$; $F_0$ to $F_4$ are 3, 5, 17, 257, 65537.
  - Harmonic thresholds: 31, 227 and 12,367 terms (for 4, 6 and 10); $S_{1000} \approx 7.485$.
  - Oresme block sums: 0.5, 0.583, 0.635, 0.663.
  - $\sum_{k \le 1000}\frac1{k(k+2)} \approx 0.7490$.
  - All 39 plotted partial sums.
  - The rearranged alternating series converges numerically to $\frac{\ln2}{2}$.
  - Archimedes' stage-2 triangle area is $\frac18$, by the shoelace formula.
  - $R_4 = \frac{30}{64}$, $L_4 = \frac{14}{64}$, $R_{10} = 0.385$, $R_{100} = 0.33835$, $R_{1000} = 0.33383$.
  - $\int_1^3 x^2\,dx = \frac{26}3$.
- **The Example 4 rearrangement.** Grouping each positive term with the next negative term is legitimate here: blocks of bounded length with terms → 0. The lesson states Riemann's rearrangement theorem and the absolute-convergence fact without proof and labels them so.
- **The diagonal argument's 4/5 rule.** It is sound: $x$ has a unique decimal form, so differing from $r_n$ in digit $n$ gives $x \ne r_n$ whichever form of $r_n$ the list used.
- **Rational-grid zigzag order** (1/1, 1/2, 2/1, 3/1, 1/3, 1/4, 2/3, 3/2, 4/1, 5/1, 1/5). It matches the picture and the text, and the gray cells are exactly the non-lowest-terms fractions.
- **The $\mathbb{Z}$ listing.** The listing and its inverse are correct (the $-7 \to 15$ example). The pairing and unpairing examples are correct.
- **History.**
  - Fermat (1640) and Euler's 641 (1732). Source: Wikipedia, "Fermat number".
  - Galileo, *Two New Sciences* (1638).
  - Hilbert's 1924–25 lecture and Gamow (1947).
  - Cantor: 1874 (uncountability) and 1891 (diagonal argument).
  - Gödel (1940) and Cohen (1963).
  - Oresme in the 14th century.
  - Basel problem in the 1730s (1734–35).
  - Riemann's integral in the 1850s (1854 habilitation).
  - Archimedes' double reductio in *Quadrature of the Parabola*.
  - Barrow as Newton's predecessor in the Lucasian chair.
- **Drills.** I generated 300 instances of each of the 8 drills with the app's `generate()`, 2,400 in total. A Python script re-solved each one from the prompt text alone: brute-force lists for the $\mathbb{Z}$ listing and the pairing, `Fraction` sums for the telescoping, Riemann and area drills, and a numeric check of the infinite telescoping sums. Results:
  - 0 mismatches.
  - Target + 1 was rejected every time.
  - The 3-decimal tolerance (0.0006 ≥ 0.0005) accepts every correct rounding.
  - No `+ -`, leftover placeholders, or "1x" / "1i" after the fix.
- **Pictures.** All 6 SVGs and the 3 blanks were rendered with the label markers and checked.
  - Riemann rectangle heights are to scale (300 px per unit).
  - The diagonal digits match Example 4, and the conditionals square is correct.
  - Every marker sits on the part its label names: h03, h21 (marker 2 is on digit 4 of $r_2$, a digit the argument doesn't use) and h46.
- **Mermaid and plots.** The 4 Mermaid diagrams and 2 plots were rendered. Their accTitle and accDescr cover the whole diagram.
- **Glossary.** None of the 31 terms or aliases duplicates any `glossary*.yaml` in the course.

## Overlap

No overlap with the other precalculus round 2 lessons. I grepped every `*h*.md` lesson for Riemann sums, the harmonic series, the contrapositive, countability, Archimedes and integrals. Lesson 19h1 only mentions that an integral is needed. Lesson 92 builds on core lessons 26 (telescoping preview) and 37 (geometric series, repeating decimals) without repeating them: $0.999\ldots = 1$ is new there.

## Left as is / uncertain

- In the lesson 91 plot, the curve still brushes the app-drawn "−0.2" tick label near the origin. Tick placement can't be set from a figure spec, and the curve has to pass close to the axis there.
- pc-h1-r2-area-parabola with $a = 1$ prints "Multiplying the height by 1 …" in the solution. This is awkward but correct.
- pc-h1-r2-telescope-infinite prints unreduced coefficients such as $\frac{4}{2}$. This is correct.
- The Mermaid "Choosing a proof method" chart is a rule of thumb, and the lesson says so.
