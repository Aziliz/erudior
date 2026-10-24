# Round 2 notes: ps-m5 (Limit theorems)

## Added

**Honors lessons (2)**
- `lessons/22h1-chernoff-hoeffding.md`: *Exponential tail bounds: Chernoff and Hoeffding*
  (`ps-m5-h-chernoff-hoeffding`, 45 min, ~1,580 words). The Chernoff method (Markov on $e^{tX}$), the normal and
  binomial Chernoff bounds with KL divergence, Hoeffding's lemma (stated without proof) and a derivation of Hoeffding's
  inequality, poll and classifier test-set sample sizes (Chebyshev, Hoeffding and CLT side by side), Cramér's theorem and
  the rate function (stated without proof). 4 worked examples.
- `lessons/22h2-convergence-slutsky.md`: *Modes of convergence and Slutsky's theorem*
  (`ps-m5-h-convergence-slutsky`, 45 min, ~1,650 words). Almost sure and mean-square convergence, how the four modes relate,
  both Borel–Cantelli lemmas (second half stated without proof), three standard counterexamples, the continuous mapping
  theorem, Slutsky's theorem, the large-sample $t$ statistic and the Wald interval, and a Slutsky proof of the delta
  method. 5 worked examples.

**Core lessons (additions only)**
- 21 (ps-lln): a `plot` of the Markov proof (step $a\mathbf{1}\{x \ge a\}$ under $y = x$); SVG of Chebyshev's band on a skewed
  density (`images/ps-m5-chebyshev-band.svg`, blank copy for labeling); a new short section "Which tool when" with a
  Mermaid decision chart (exact / CLT / Chebyshev / Markov).
- 22 (ps-clt): SVG of the continuity correction, Bin(30, 0.4) bars with the normal curve and the 10.5 cutoff
  (`images/ps-m5-continuity-bars.svg`, blank copy); a new short section "The procedure in one chart" with a Mermaid
  flowchart of a CLT approximation.

**Pictures and diagrams**: 2 SVGs + 2 blank copies (all under 13 KB), 4 Mermaid diagrams (2 core, 1 per honors
lesson), 3 new `plot` figures (Markov proof; Chebyshev/Hoeffding/CLT tail curves vs n; a simulated Bernoulli(1/n) path).

**Questions** (`questions/r2-ps-m5.yaml`, 40):
- Core q01–q12 (6 per lesson): text 4, label 2, order 2, match 2, select-all 2. module_quiz: q01, q05, q09, q11.
- Honors h01–h28 (14 per lesson): multiple choice 16, select-all 4, text 4, order 2, match 2 (6 new-type questions per lesson).

**Drills** (`drills/r2-ps-m5.yaml`, 4): `ps-m5-r2-hoeffding-n`, `ps-m5-r2-chernoff-binom` (22h1);
`ps-m5-r2-slutsky-ci`, `ps-m5-r2-wald-prop` (22h2).

**Glossary** (`glossary-r2-ps-m5.yaml`, 12): concentration inequality, Chernoff bound, Kullback–Leibler divergence,
Hoeffding's lemma, Hoeffding's inequality, Cramér's theorem, rate function, almost sure convergence, convergence in mean
square, Borel–Cantelli lemma, continuous mapping theorem, Slutsky's theorem. Checked against every `glossary*.yaml` (incl.
r2 files of ps-m1–m3): no term or alias repeats.

**Cards** (`cards-r2-ps-m5.yaml`, 24): 11 Concentration inequalities, 11 Modes of convergence, 2 for the core topics.

## Verification
- Every number in lessons, questions and explanations recomputed in Python/scipy (Chernoff/Hoeffding/Chebyshev
  comparisons, sample-size table, normal tails, KL values, CI endpoints, delta-method SE, simulated spike path with numpy
  seed 1).
- Drills: each generated 500 times with `generate()`; targets matched an independent Python calculation (numerical
  optimisation of the Chernoff bound over $t$; brute-force minimal $n$ for Hoeffding; scipy for intervals); the displayed
  answer and correctly rounded answers (3 s.f. / 2 dp / 3 dp as the prompt asks) are accepted, and a wrong value is
  rejected.
- SVGs and Mermaid diagrams previewed as PNGs; label markers checked on the blank copies.
- `content/math/check-module.sh probstats ps-m5`: build and checker OK, zero problems.

## For a reviewer
- Attributions: Chernoff (1952 paper on tests based on sums), Bernstein's earlier use of exponential moments (1920s),
  Hoeffding (1963), Cramér (1938), Slutsky (1925), the strong law in full generality to Kolmogorov. These are standard but
  were written from memory; please confirm.
- Results stated without proof are labeled as such (Hoeffding's lemma, second Borel–Cantelli lemma, Cramér's theorem,
  in probability ⇒ in distribution).
- 22h2 Example 5 re-derives the delta method (introduced in lesson 25, ps-m6) rigorously via Slutsky; if the ps-m6 Round 2
  writer adds a Slutsky or delta-method honors lesson, check for overlap.
- The 22h1 plot uses `normcdf` inside a lesson `plot` function (lesson 22 already uses `normpdf` the same way).

## Errors found in existing content
None. Spot-checked lesson 21–22 example numbers (Monte Carlo variance, rounding-error CLT, gamma exact 0.242, binomial
0.1498) and they are right.

## Sources
Standard results; definitions and statements cross-checked against my knowledge of the usual texts (Wackerly et al.;
Casella & Berger; Billingsley for modes of convergence; Hoeffding 1963, JASA). All text, examples and figures are original.
