# NOTES2-pc-h1: Honors module pc-h1, "Proof, infinity and the road to calculus"

`content/math/check-module.sh precalculus pc-h1`: build and checker report **zero problems** (4 lessons, 56 questions, 8 drills, 39 cards).

## What was added

The module is a capstone that cuts across the course. Lesson 90 covers the logic of proof. Lesson 91 uses it, with inverse functions, to compare infinite sets. Lessons 92 and 93 use proof, limits, geometric series, partial fractions and the sum formulas from the induction lesson to handle infinite sums and areas, and end with a preview of the fundamental theorem of calculus. I checked the core modules' honors lessons (pc-m9: recurrences, counting, binomial probability; pc-m10: squeeze theorem, derivative rules and linear approximation) and found no overlap.

**Lessons** (module `pc-h1`; no `honors:` line, since the module itself is honors):

| File | Id | Minutes | Prose words* | Worked examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|
| 90-proof-methods.md | pc-h1-proof | 45 | ~1,720 | 5: product of odd numbers (direct); $n^2$ even ⇒ $n$ even (contrapositive); $\sqrt2$ irrational; Euclid's primes; $2^p - 1$ counterexample | pc-h1-conditionals.svg; Mermaid "choosing a proof method" | none (no computation to drill) |
| 91-sizes-of-infinity.md | pc-h1-infinity | 45 | ~1,830 | 5: $\mathbb{N} \sim$ evens; listing $\mathbb{Z}$ with inverse; Cantor pairing (forward and back); diagonal digits; $(-1, 1) \sim \mathbb{R}$ via $\frac{x}{1 - \lvert x \rvert}$ | pc-h1-rational-grid.svg; pc-h1-diagonal.svg; plot of $\frac{x}{1 - \lvert x \rvert}$; Mermaid "ladder of infinities" | pc-h1-r2-list-integers, -pairing, -unpair |
| 92-infinite-series.md | pc-h1-series | 45 | ~1,440 | 4: $0.999\ldots = 1$; Oresme bound for $S_n \ge 6$; $\sum \frac{1}{k(k+2)} = \frac34$; rearranged alternating harmonic series $= \frac{\ln 2}{2}$ (plus the $\sum \frac1{k^2} < 2$ comparison) | pc-h1-oresme.svg; plot of the partial sums of $\sum\frac1k$ and $\sum\frac1{k^2}$; Mermaid "testing a series" | pc-h1-r2-telescope-partial, -telescope-infinite |
| 93-area-and-integration.md | pc-h1-area | 50 | ~1,470 | 3: area under $9 - x^2$ (Archimedes); $\int_0^b x^2\,dx = \frac{b^3}{3}$; distance from $v(t) = 3t^2$ (plus the worked $R_4$, $L_4$ and $R_n \to \frac13$ in the text) | pc-h1-archimedes.svg; pc-h1-riemann.svg; Mermaid "two problems of calculus" | pc-h1-r2-riemann-right, -area-parabola, -archimedes |

*Prose words leave out code blocks, display math and image alt text.

Each lesson has an intro tying back to core lessons (38 induction, 37 geometric series, 07 inverses, 26 partial fractions, 41–43 limits and the derivative), `##` sections that explain why, "Common mistakes" and "Key points".

**Questions** (`questions/r2-pc-h1.yaml`, pc-h1-r2-h01 to h56): 14 per lesson.
- 30 four-choice multiple choice. Answer positions per lesson: 2/2/2/2, 1/2/2/2, 2/2/2/2 and 2/2/2/1.
- 26 other types: 11 text, 4 select-all, 4 order, 4 match and 3 label (conditionals, diagonal argument, Riemann sum).
- `module_quiz: true` on 20 questions, 5 per lesson, covering every topic.

**Pictures**: 6 original SVGs, plus blank copies for the 3 label questions. Each is under 10 KB. All were previewed as PNG, and the label markers were checked on the blank copies.

**Diagrams and figures**: 4 Mermaid diagrams (all `flowchart TD`, 6–10 boxes) and 2 plots, all rendered and inspected.

**Drills** (`drills/r2-pc-h1.yaml`): 8, listed in the table.

**Glossary** (`glossary-r2-pc-h1.yaml`): 31 terms.
- proof, conditional statement, hypothesis, conclusion, converse, contrapositive, direct proof, proof by contrapositive, proof by contradiction, contradiction, rational number, irrational number, counterexample
- one-to-one correspondence (alias bijection), cardinality, countable, uncountable, diagonal argument, Cantor pairing function
- partial sum, divergence test, harmonic series, comparison test, p-series, alternating harmonic series, conditionally convergent, absolutely convergent
- method of exhaustion, Riemann sum, definite integral, fundamental theorem of calculus (FTC)

Every bolded term in lessons 90–93 has an entry. On 2026-10-23 none of these terms or aliases duplicated a term or alias in any `glossary*.yaml` in the course, including the other writers' r2 files. Terms that already existed were deliberately not bolded: series, converges, diverges, telescoping sum, one-to-one, limit, derivative.

**Cards** (`cards-r2-pc-h1.yaml`): 39 (10 / 9 / 10 / 10 by lesson).

## Verification

- `vq.py` checks 43 facts with sympy and Python, and all pass. They cover every question key and the numbers in the lessons and figures, including:
  - 30031 = 59 · 509, 2047 = 23 · 89 and 2³² + 1 = 641 · 6,700,417;
  - the $\mathbb{Z}$ listing and the Cantor pairing function are bijections;
  - the rational listing order in the grid picture;
  - harmonic thresholds (227 terms to reach 6, 12,367 to pass 10, 31 to reach 4);
  - $\sum\frac{1}{k(k+2)} = \frac34$, Basel, $\ln 2$, and the rearrangement summing to $\frac{\ln 2}{2}$;
  - Archimedes' stage areas;
  - $R_n = \frac{(n+1)(2n+1)}{6n^2}$, $R_4$, $L_4$, $R_{10}$, $L_{10}$, and that $R_n$ decreases.

  I also checked that each distractor is wrong, and that each order question has only one valid order.
- Drills: I generated 400 instances of each drill (3,200 in total) with `generate()` from the built JSON.
  - `vd.py` re-solved each instance from the prompt text alone (sympy and `Fraction`), with 0 mismatches.
  - Typed answers were accepted every time: exact fractions, unreduced fractions for the telescoping drills, and 3-decimal roundings where the prompt allows them. A wrong answer was never accepted.
  - The prompts and solutions contain no `+ -`, leftover `{placeholders}` or `\dfrac{n}{1}`.
- Fill-in-the-blank stems keep each `___` outside `$…$`.

## For a reviewer to double-check

- **Overlap risk.** Lesson 92 overlaps a little with lesson 37 (infinite geometric series) and with the "telescoping preview" in lesson 26. It builds on both rather than repeating them. Lesson 93's Riemann sums and FTC preview go beyond the core course. If a future Calculus-bridge honors lesson covers area, compare the two.
- **Stated without proof (labeled in the lessons):**
  - completeness of the reals (bounded increasing partial sums converge);
  - the p-series rule for general $p$;
  - $\sum (-1)^{k+1}/k = \ln 2$;
  - Riemann's rearrangement theorem, and that rearranging an absolutely convergent series keeps its sum;
  - Cantor's theorem on power sets;
  - the independence of the continuum hypothesis;
  - Archimedes' ¼ ratio at every stage;
  - the FTC itself.
- **Simplification (labeled).** Riemann sums are introduced with equal widths and right endpoints only.
- **Conventions.**
  - $\mathbb{N} = \{1, 2, 3, \dots\}$ (the lesson notes that some books start at 0).
  - Cantor pairing positions are numbered from 0, with pairs ordered by $b$ within each diagonal.
  - The rational-grid zigzag alternates direction, so its order differs from the pairing function's. The text treats them separately.
  - The diagonal argument uses the digits 4 and 5 to avoid numbers with two decimal names.
- **History (hedged in the lessons).**
  - Euclid's *Elements*, about 300 BC. The text notes that Euclid phrased the proof differently.
  - Fermat's conjecture on $2^{2^n} + 1$ and Euler's factor 641 (1732).
  - Galileo's 1638 squares paradox, with the quote paraphrased.
  - Hilbert's hotel: a 1924–25 lecture, popularized by Gamow in 1947. I checked this against Wikipedia.
  - Cantor: uncountability in 1874, and the diagonal argument in 1891.
  - Gödel (1940) and Cohen (1963).
  - Oresme in the 14th century.
  - Euler solved the Basel problem "in the 1730s".
  - Archimedes in the third century BC, using the method of exhaustion.
  - Riemann's integral "in the 1850s".
  - Newton and Leibniz independently in the later 1600s. Barrow is described as "Newton's predecessor as a professor at Cambridge" rather than as his teacher, which is debated.
- **Drills.**
  - The riemann-right, area-parabola and archimedes drills use tolerance 0.0006, so a correct 3-decimal rounding always passes. Their answer boxes are number boxes, so an exact fraction such as `405/32` also passes.
  - The two telescoping drills use `kind: fraction` and don't require lowest terms.
  - pc-h1-r2-telescope-infinite uses $d$ = 2, 3 or 4 only.
- **Lesson 90 has no drill.** Its content is proof writing and has no numeric skill to drill.

## Errors found in existing content

None. I read lessons 01, 07, 26, 37, 38, 41, 42 and 43, and the other writers' pc-m9 and pc-m10 honors lesson titles and glossaries, to check overlap and cross-references. I edited no shared or existing files.

## Sources

- Standard results: logic and proof methods, Euclid's and the $\sqrt2$ proofs, Cantor's countability and diagonal arguments, Oresme's grouping, telescoping and comparison, Archimedes' quadrature, Riemann sums, and the FTC. All explanations, examples, questions and pictures are original, and every number was recomputed in Python.
- Wikipedia, "Hilbert's paradox of the Grand Hotel" (fetched 2026-10-23): Hilbert's 1924–25 lecture "Über das Unendliche", and Gamow's *One Two Three... Infinity* (1947).
- These well-known facts were not re-fetched this round; a reviewer may want to spot-check them:
  - Galileo's *Two New Sciences* (1638);
  - Euler's factorization of $F_5$ (1732);
  - Cantor's 1874 and 1891 papers;
  - Gödel 1940 and Cohen 1963;
  - Euler and the Basel problem (1734–35);
  - Riemann's 1854 habilitation (on the integral).

Scratch scripts are in `/tmp/r2-pc-h1/gen`: the SVG generators `svg90.py`–`svg93.py`, the question checker `vq.py`, the drill tools `dump.mts` and `vd.py`, and the figure tools `figs.mts` and `shot.mjs`.
