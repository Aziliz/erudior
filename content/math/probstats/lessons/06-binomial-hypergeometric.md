---
id: ps-binomial
module: ps-m2
title: Bernoulli, binomial and hypergeometric distributions
minutes: 40
topics: [Binomial distribution, Hypergeometric distribution]
drills: [ps-d-binom-prob, ps-d-hypergeom]
refs: [ps-ref-probability]
---
## Named distributions

Certain random variables appear so often that their distributions have names, formulas and
known moments. Recognizing one saves you from rederiving its pmf every time. This lesson
covers the distributions of counts in a fixed number of trials: the Bernoulli (one trial),
the binomial (independent trials) and the hypergeometric (sampling without replacement). Each
derivation uses the counting and independence ideas of Module 1.

## The Bernoulli distribution

A **Bernoulli trial** is an experiment with two outcomes, labeled success (1) and failure (0),
with $P(\text{success}) = p$. The indicator $X$ of success has the **Bernoulli distribution**:

$$p(x) = p^x (1 - p)^{1 - x}, \quad x \in \{0, 1\}.$$

Its moments are immediate: $E(X) = p$, and since $X^2 = X$ for a 0–1 variable,
$E(X^2) = p$, so $\operatorname{Var}(X) = p - p^2 = p(1 - p)$. The variance is largest at
$p = \tfrac12$ and zero when the outcome is certain.

## The binomial distribution

Run $n$ independent Bernoulli trials, each with success probability $p$, and let $X$ count the
successes. Then $X$ has the **binomial distribution**, written $X \sim \text{Bin}(n, p)$:

$$p(k) = \binom{n}{k} p^k (1 - p)^{n - k}, \qquad k = 0, 1, \ldots, n.$$

**Derivation.** Any particular sequence with $k$ successes and $n - k$ failures has probability
$p^k(1-p)^{n-k}$ by independence. The event $\{X = k\}$ is the disjoint union of all such
sequences, and there are $\binom{n}{k}$ of them (choose which trials succeed). The binomial
theorem confirms the total is 1: $\sum_k \binom{n}{k}p^k(1-p)^{n-k} = (p + 1 - p)^n = 1$.

**Mean.** Using the identity $k\binom{n}{k} = n\binom{n-1}{k-1}$ (choose a committee of $k$ with a
chair, two ways),

$$E(X) = \sum_{k=1}^{n} k\binom{n}{k}p^k q^{n-k} = np\sum_{k=1}^{n}\binom{n-1}{k-1}p^{k-1}q^{n-k} = np(p + q)^{n-1} = np,$$

where $q = 1 - p$. The indicator view gives the same answer instantly: $X$ is a sum of $n$
Bernoulli indicators, each with mean $p$.

**Variance.** Apply the same identity twice to the **factorial moment**:
$E[X(X-1)] = n(n-1)p^2$. Then

$$\operatorname{Var}(X) = E[X(X-1)] + E(X) - (EX)^2 = n(n-1)p^2 + np - n^2p^2 = np(1 - p).$$

(In Module 4 you will see this as "variances of independent variables add": $n$ copies of
$p(1-p)$.)

**Shape.** The pmf rises and then falls, peaking near $np$ (the most likely value, the
**mode**, is $\lfloor (n+1)p \rfloor$). It is symmetric when $p = \tfrac12$, skewed right for small
$p$ and skewed left for large $p$.

### Example 1: signal faults

Each of 12 track circuits independently shows a fault on a given day with probability 0.25.
Let $X$ be the number showing faults, so $X \sim \text{Bin}(12, 0.25)$.

```plot
{"bars": [{"x": 0, "height": 0.0317, "width": 0.7}, {"x": 1, "height": 0.1267, "width": 0.7}, {"x": 2, "height": 0.2323, "width": 0.7}, {"x": 3, "height": 0.2581, "width": 0.7, "color": "#c05621"}, {"x": 4, "height": 0.1936, "width": 0.7, "color": "#c05621"}, {"x": 5, "height": 0.1032, "width": 0.7, "color": "#c05621"}, {"x": 6, "height": 0.0401, "width": 0.7, "color": "#c05621"}, {"x": 7, "height": 0.0115, "width": 0.7, "color": "#c05621"}, {"x": 8, "height": 0.0024, "width": 0.7, "color": "#c05621"}, {"x": 9, "height": 0.0004, "width": 0.7, "color": "#c05621"}], "x": [-1, 13], "y": [0, 0.3], "xLabel": "k", "yLabel": "P(X = k)", "caption": "Bin(12, 0.25); orange bars make up P(X ≥ 3) ≈ 0.609 (bars above 9 are too small to see)"}
```

1. $P(X = 3) = \binom{12}{3}(0.25)^3(0.75)^9 = 220 \times 0.015625 \times 0.07508 \approx 0.2581$.
2. $P(X \ge 3) = 1 - [p(0) + p(1) + p(2)] = 1 - (0.0317 + 0.1267 + 0.2323) \approx 0.609$.
   Complements save work: three terms instead of ten.
3. $E(X) = 12(0.25) = 3$ and $\sigma = \sqrt{12(0.25)(0.75)} = \sqrt{2.25} = 1.5$.

The most likely count is 3, which matches $\lfloor 13 \times 0.25 \rfloor = 3$.

## The hypergeometric distribution

Now sample *without* replacement. A population of $N$ items contains $K$ "successes" (say,
defective units). Draw $n$ items at random, all $\binom{N}{n}$ subsets equally likely, and let $X$
be the number of successes in the sample. Then $X$ has the **hypergeometric distribution**:

$$p(k) = \frac{\binom{K}{k}\binom{N - K}{n - k}}{\binom{N}{n}}, \qquad \max(0, n - N + K) \le k \le \min(n, K).$$

**Derivation:** choose $k$ of the $K$ successes and $n - k$ of the $N - K$ failures, then divide
by the number of possible samples — exactly the committee calculation of lesson 2.

**Mean.** Let $I_j$ indicate that the $j$-th draw is a success. By the symmetry seen in lesson 3,
each draw alone is a success with probability $K/N$, so

$$E(X) = n\frac{K}{N}.$$

This is the binomial mean with $p = K/N$. The draws are dependent, which does not matter for the
mean but does affect the variance:

$$\operatorname{Var}(X) = n\frac{K}{N}\left(1 - \frac{K}{N}\right)\frac{N - n}{N - 1}.$$

The last factor, the **finite population correction**, is less than 1: sampling without
replacement gives less variability, because each draw removes an item and pulls the remaining
proportion back toward balance. (Its derivation needs covariances, which arrive in Module 4.)
When $n$ is small compared with $N$, the correction is close to 1 and the hypergeometric is
well approximated by $\text{Bin}(n, K/N)$ — the reason survey samples from large populations can
be treated as independent.

### Example 2: acceptance sampling

A shipment of 50 bearings contains 6 defective ones. An inspector tests 5 chosen at random.

1. $P(\text{no defectives}) = \dfrac{\binom{6}{0}\binom{44}{5}}{\binom{50}{5}} = \dfrac{1{,}086{,}008}{2{,}118{,}760} \approx 0.5126$,
   so $P(\text{at least one}) \approx 0.4874$.
2. The binomial approximation with $p = 6/50 = 0.12$ gives $1 - 0.88^5 \approx 0.4723$ — close but
   noticeably off, because the sample is 10% of the shipment.
3. $E(X) = 5 \times 0.12 = 0.6$ and
   $\operatorname{Var}(X) = 5(0.12)(0.88)\tfrac{45}{49} \approx 0.4849$, compared with the binomial
   value $0.528$.

### Example 3: an acceptance rule

A lot of 100 parts with 8 defective is accepted if a random sample of 10 contains at most 1
defective. Then

$$P(\text{accept}) = \frac{\binom{92}{10}}{\binom{100}{10}} + \frac{\binom{8}{1}\binom{92}{9}}{\binom{100}{10}} \approx 0.4166 + 0.4015 = 0.818.$$

The rule accepts this fairly poor lot (8% defective) over 80% of the time — a reminder that
small samples cannot discriminate finely between good and bad lots. The binomial approximation
$\text{Bin}(10, 0.08)$ gives 0.812, since here the sample is only 10% of the lot.

## Choosing the model

| Situation | Model |
|---|---|
| One trial, success or failure | Bernoulli$(p)$ |
| Fixed $n$ independent trials, same $p$, count successes | Binomial$(n, p)$ |
| Sample $n$ without replacement from $N$ with $K$ successes | Hypergeometric$(N, K, n)$ |
| Same, but $n$ is a small fraction of $N$ | Binomial$(n, K/N)$ approximately |

## Common mistakes

- Using the binomial when trials are not independent or $p$ changes (e.g. drawing without
  replacement from a small lot).
- Forgetting the $\binom{n}{k}$ factor, which gives the probability of one particular sequence.
- Misreading "at least $k$" as $1 - P(X \le k)$; it is $1 - P(X \le k - 1)$.
- Using $\sqrt{np}$ or $np(1-p)$ as the standard deviation; $\sigma = \sqrt{np(1-p)}$.
- Dropping the finite population correction when the sample is a large fraction of $N$.

## Key points

- Bernoulli$(p)$: mean $p$, variance $p(1-p)$.
- Binomial: $p(k) = \binom{n}{k}p^k(1-p)^{n-k}$, mean $np$, variance $np(1-p)$.
- Hypergeometric: $p(k) = \binom{K}{k}\binom{N-K}{n-k}/\binom{N}{n}$, mean $nK/N$, variance with
  the factor $(N - n)/(N - 1)$.
- Counting variables are sums of indicators, so their means are sums of probabilities.
