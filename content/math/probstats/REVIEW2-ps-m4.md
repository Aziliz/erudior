# Round 2 review: ps-m4 (Joint distributions)

Reviewer pass over the round 2 work for ps-m4: honors lessons 20h1 and 20h2, the additions to core lessons 15–20,
`questions/r2-ps-m4.yaml` (58), `drills/r2-ps-m4.yaml` (6), `glossary-r2-ps-m4.yaml` (12), `cards-r2-ps-m4.yaml` (20)
and the four `images/ps-m4-*` SVGs (plus `-blank` copies). `content/math/check-module.sh probstats ps-m4` reports OK
after the fixes.

## Changes

### Answer keys / questions
- **ps-m4-r2-q09** (order): the first two steps ("write $f_X$", "write $f_{Y|X}$") could be done in either order, so
  the question had two correct orders. Merged them into one step (now 4 items); explanation adjusted.
- **ps-m4-r2-h17**: the distractor $n^2u^{n-1}v^{n-1}$ was explained as "treats min and max as independent", but the
  product of the marginals is $n(1-u)^{n-1}\cdot nv^{n-1}$. Changed the distractor to $n^2(1-u)^{n-1}v^{n-1}$ so it
  really is the independence mistake the explanation names.
- **ps-m4-r2-q08** (match): "$P(X<Y)$ for independent exponentials with rates $a$ and $b$" did not say which variable
  has which rate, so the distractor $b/(a+b)$ was defensible. Now "$X$ with rate $a$ and $Y$ with rate $b$".
- **ps-m4-r2-h12**: explanation said −3 comes from "keeping a covariance term"; keeping one gives −4 or −6. −3 is
  $4 - 9 + 2$, adding the covariance twice instead of letting the terms cancel. Reworded.

### Facts / wording
- **20h2, Example 2**: "Five uniform readings almost always spread over more than half the interval" — the lesson's
  own number gives $P(R > 0.5) = 0.8125$. Changed to "usually … ($P(R > 0.5) = 0.8125$)".
- **20h2, after Example 3**: "redundancy pays off slowly at first and most at the end" was misleading (the expected
  life of a parallel system of $n$ is $\theta H_n$: each extra component adds less, $\theta/n$). Rewritten: the gaps
  grow as fewer pumps remain, the last survivor adds 1000 h, but each extra pump adds less than the one before (the
  fifth adds 200 h), i.e. diminishing returns.
- **20h1, "Not every symmetric matrix…"**: "every symmetric PSD matrix is a covariance matrix (the construction below
  produces one)" overstated, since the lesson's only factorization (Cholesky) is for positive definite matrices. Now
  says the construction works given any $A$ with $AA^\top = \Sigma$ and that such an $A$ exists for every PSD matrix
  (stated without proof; true via the symmetric square root, e.g. Horn & Johnson, *Matrix Analysis*, Thm 7.2.6).
- **20h1, Example 1**: the parenthetical story for the negative section 2–3 correlation ("a late arrival at section 3
  means a quieter, faster path") did not explain a relation between sections 2 and 3; reworded to "a train delayed on
  section 2 reaches section 3 after the busy period and tends to lose less time there". Numbers unchanged.

### Plots
- **20h1** Mahalanobis plot: the "(85, 60)" point label sat on the Q = 9 ellipse. Moved it to a separate label at
  (94, 55), clear of the curve.
- **19** mixture plot: the x-axis label "life (thousand km)" sat on supplier B's dashed tail. Widened x to [35, 95].

### Drills
- **ps-m4-r2-cholesky**: solution printed "$\mu_1 + 1Z_1$" when $\ell_{11} = 1$ (70 of 400 instances). Now `{l11:coef}`.
- **ps-m4-r2-mahalanobis**: with $Q$ up to 14 the probability can be 0.0009, and the 0.002 tolerance then accepted
  0 and the $\chi^2_1$ tail (a real mistake). Restricted to $Q \le 9$ (probability ≥ 0.0111). Tolerance 0.002 kept:
  it is needed for the rounded-Q route ($e^{-Q/2}$ with $Q$ to 2 dp differs by up to 0.0015 at $Q = 1$), and over
  $1 \le Q \le 9$ it now rejects 0, $e^{-Q}$, $\chi^2_1$ and $\chi^2_3$ tails (closest miss 0.0084).

## Checked and right (a reader might doubt)
- 20h1 Example 1: $\Sigma$, total variance 27 (SD 5.20), $\Sigma c = (-4,-5,16)$, Var(D) = 20, Cov = 7, Corr 0.301.
- 20h1 Example 2: variance −0.6; eigenvalues of the claimed matrix $1, 1 \pm 0.9\sqrt2$ (one negative); $\rho \ge -1/(n-1)$.
- 20h1 Example 4: $Q = 6.0625/0.64 = 9.47$, tail $e^{-4.74} = 0.0088$; ellipses use the Cholesky factor
  $(10, 0; 7.2, 9.6)$ of $\Sigma = (100, 72; 72, 144)$; Q = 1, 4, 9 hold 39.3%, 86.5%, 98.89%. Point is just outside.
- $\chi^2_2$ = exponential mean 2; 95% ellipse $Q = 5.99$; density and $\det\Sigma = \sigma_X^2\sigma_Y^2(1-\rho^2)$.
- 20h2: inclusion–exclusion 0.1467 vs product 0.1677; range cdf $nr^{n-1} - (n-1)r^n$ = Beta(n−1, 2) (checked with
  scipy); Example 2 0.1875 and 2/3; Rényi rates and Jacobian argument; Example 3: 783 h, Var 213,611 (SD 462),
  2283 h; Example 4 $(1-e^{-0.5})^3 = 0.0609$; k-out-of-n fails at failure $n-k+1$.
- All 58 questions worked independently: keys correct, one defensible answer each, order questions (q02, q15, q19,
  q30, h11, h26, and q09 after the fix) have a single order (h11 Q values 0, 1.25, 2.81, 3.52, 5; h26 means 0.25,
  0.58, 1, 1.08, 2.08 are distinct). h21 accepts 58.3/58.33/58.333/175/3.
- Core additions: Mermaid charts in 15, 16, 18, 19, 20 and 20h1 rendered and read (content matches the lessons;
  accTitle/accDescr describe the whole diagram). Lesson 18 plot: segments x + y = 0.6 and 1.4 correct. Lesson 19
  mixture is unimodal (single max at 50.3) with a right shoulder, as the text says; normal shapes labeled as assumed.
- SVGs: bvn-lines ellipse axes ratio 2 = √(1.6/0.4) for ρ = 0.6 along the 45° SD line; regression lines slopes 0.6
  and 1/0.6, and the E[Y|X] line passes through the ellipse's vertical tangents. All four label questions rendered
  with markers: each marker sits on the part its label names.
- Drills: 400 instances each generated with the app's own generator; every target recomputed in Python from the
  prompt text (numpy eigenvalues/Cholesky, scipy chi2/beta, direct sums) with zero mismatches; every displayed
  answer accepted; no unfilled placeholders, "+ -" or "1X"; tolerances ≥ half the last place.
- Glossary: no term or alias clashes with any other `glossary*.yaml` in the course. Cards checked.

## Overlap
None found. Lesson 29h1 (another writer) mentions a multivariate normal approximation in passing and could link the
glossary term; ps-h1's James–Stein lesson does not redefine these terms.

## Uncertain
Nothing material. The 0.002 tolerance in ps-m4-r2-mahalanobis cannot separate $p$ from $1-p$ when $p \approx 0.5$
(inherent to that answer).
