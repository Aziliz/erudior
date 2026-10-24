# Round 2 review: ps-m5 (Limit theorems)

Reviewed: lessons 22h1-chernoff-hoeffding.md and 22h2-convergence-slutsky.md (honors), the round 2
additions to 21 and 22, `questions/r2-ps-m5.yaml` (40), `drills/r2-ps-m5.yaml` (4),
`glossary-r2-ps-m5.yaml` (12), `cards-r2-ps-m5.yaml` (24), and the four `images/ps-m5-*` SVGs.

## Changes

| Where | Problem | Fix |
|---|---|---|
| ps-m5-r2-q04 (order) | "Apply Chebyshev to X̄ₙ" and "Compute E and Var of X̄ₙ" could be done in either order (Chebyshev can be written first, then filled in), so two orders were defensible. | Step 2 now reads "Plug that mean and variance into Chebyshev's inequality for X̄ₙ", which can only follow step 1. |
| ps-m5-r2-q08 (order) | The item "Apply the continuity correction: use k + 0.5" could go anywhere before standardizing (even first, or before scaling up to the sum), so the order was not unique. | Folded the correction into the standardize step ("Standardize the continuity-corrected cutoff: z = (k + 0.5 − nμ)/(σ√n)"); 4 items with one order. Explanation updated. |
| 22h1 plot (Chebyshev/Hoeffding/CLT vs n) | The "Hoeffding" and "CLT approx." curve labels were drawn on top of each other at the bottom right, and the y-axis title sat on the Chebyshev and Hoeffding curves. | y range 0–0.6 (curves now end below the axis title), CLT curve starts at n = 40, Hoeffding and CLT labels moved to free space next to their curves via `labels`. Re-rendered: nothing overlaps. |
| Lesson 21 "Which tool when" Mermaid + matching card | Chart sent "average of many iid values" straight to "Chebyshev on the mean: guaranteed bound", but Chebyshev needs σ² (or a bound on it, like p(1 − p) ≤ 1/4). | Box now says "Chebyshev on the mean (needs σ² or a bound on it)"; accDescr and the card "Which tool for a tail probability?" say the same. |
| 22h2 Common mistakes, "Adding limits in distribution" | "Take Yₙ = −Xₙ with Xₙ = Z: the sum is 0, not N(0, 2)" implied X + Y has a definite N(0, 2) law, which only holds for independent limits. | Reworded: each converges in distribution to N(0, 1), yet the sum is 0, "not the N(0, 2) that independent limits would give" (matches h24's explanation). |
| 22h2 Example 4, Wald interval | Wald interval presented with no caveat; a solo learner could take it as reliable at any n. | Added one sentence: Slutsky makes it valid only as n → ∞; for small n or p̂ near 0 or 1 coverage can fall well below 95% (consistent with ps-m6's 29h3). |

## Checked and right (a reader might doubt)

- 22h1 numbers (Python/scipy): e^−4.5 = 0.0111 vs exact 0.00135; Cantelli 1/10; t = ln(7/3) = 0.847;
  70 ln(3/7) + 100 ln(5/3) = −8.228, bound 2.67e-4; exact P(S ≥ 70) = 3.93e-5 (ratio 6.9, "seven times");
  t = 0.5 gives 1.0e-3; D(0.7‖0.5) = 0.0823; e^−8 = 3.4e-4; poll table 1000/600/271, 10000/1060/664,
  100000/1521/1083; classifier n = 6623. Plot functions: Chebyshev 1/(4n·0.05²) = 100/n, CLT
  2(1 − Φ(0.1√n)).
- Hoeffding lemma ⇔ normal with variance (b − a)²/4; optimum s = 4u/c; D(a‖p) ≥ 2(a − p)² (Pinsker);
  Chernoff bound for the mean equals e^{−nI(a)} for a > μ (t ≤ 0 never helps by Jensen).
- 22h2: proof that convergence in distribution to a constant gives convergence in probability (cutoffs
  c − ε and c + ε/2 are continuity points); P(|Z| ≥ 0.5) = 0.617; H₂₀₀₀ ≈ 8.18 (8 spikes in the plot
  is typical); Example 4 interval (47.79, 56.81); Wald 0.3 ± 0.0449; Example 5 λ̂ = 0.4545, SE 0.0455,
  (0.365, 0.544). S² formula and the "finite variance suffices" argument are right.
- Core additions: Gamma(3) band μ ± 1.5σ = (0.402, 5.598) holds 0.9095 (lesson says about 0.91);
  SVG geometry matches (64 px per unit). Bin(30, 0.4): P(X ≤ 10) = 0.2915, corrected normal 0.2881;
  SVG bar heights are proportional to the pmf for x = 4…21.
- All 40 questions worked independently before reading keys; every key, accept list and distractor
  explanation is right (h08: D(0.6‖0.5) = 0.020136, e^−10.07 = 4.24e-5; h13: 2e^−5 = 0.0135; h03: 184.4 → 185;
  h23: 42.94; h26: 0.0449 → 0.045).
- Drills: hoeffding-n checked over all 81 valid parameter combinations against a brute-force minimal n;
  chernoff-binom over all 266 valid combinations against numerical minimisation over t (a = kk/nn is
  always exactly p + d, so its 2-decimal display is exact; Hoeffding ≥ Chernoff in every case);
  slutsky-ci (tolerance 0.01) and wald-prop (0.001) accept correctly rounded answers and table z values
  (1.645 / 1.96 / 2.576), and reject t-based or wrong-SE answers.
- Label markers (q02, q07) sit on the parts named; all four Mermaid diagrams render, readable, accTitle/accDescr
  describe the whole diagram.
- Attributions: Chernoff, Ann. Math. Statist. 23 (1952); Hoeffding, JASA 58 (1963); Cramér 1938
  (Actualités scientifiques); Slutsky, "Über stochastische Asymptoten und Grenzwerte", Metron 5 (1925)
  ([Wikipedia: Slutsky's theorem](https://en.wikipedia.org/wiki/Slutsky%27s_theorem),
  [MacTutor: Slutsky](https://mathshistory.st-andrews.ac.uk/Biographies/Slutsky/)); strong law for iid
  with finite mean due to Kolmogorov (1930/1933,
  [Shafer & Vovk, origins of the Grundbegriffe](https://arxiv.org/pdf/1802.06071)); Bernstein's
  exponential-moment inequalities 1920s. Results stated without proof are labeled.

## Overlap

- 22h2 Example 5 (delta method for the exponential rate 1/X̄) overlaps ps-m6's `wald-exp` drill and the
  delta method in 29h1; and 22h2's Wald proportion interval and `ps-m5-r2-wald-prop` drill overlap ps-m6's
  29h3 (proportion intervals, Wald coverage) and ps-m7's 33h1. Here they serve as Slutsky applications;
  the new caveat sentence points the same way as 29h3. Not changed beyond that.

## Uncertain

- Nothing material. The "Which tool when" chart is a simplification (it omits Hoeffding/Chernoff, taught
  only in honors); acceptable for the core lesson.

`content/math/check-module.sh probstats ps-m5`: OK, zero problems.
