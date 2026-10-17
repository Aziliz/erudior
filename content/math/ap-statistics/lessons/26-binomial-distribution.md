---
id: stat-binomial
module: stat-m6
title: The binomial distribution
minutes: 35
topics: [Binomial distribution]
drills: [stat-binom-pdf, stat-binom-cdf, stat-binom-mean-sd]
refs: [stat-ref-probability]
---
## Counting successes

Many questions boil down to "how many successes in a fixed number of tries?" How many of 10
inspected welds are defective? How many of 200 surveyed voters support a measure? How many
of 20 free throws go in? When the tries are independent and the success probability stays
the same, the count follows a binomial distribution — the most important discrete
distribution, and the foundation for inference about proportions.

## The binomial setting

A **binomial setting** has four conditions (memory aid BINS):

- B — *Binary*: each trial is a success or a failure.
- I — *Independent*: the outcome of one trial doesn't affect another.
- N — *Number*: the number of trials $n$ is fixed in advance.
- S — *Same probability*: each trial has the same success probability $p$.

The count $X$ of successes is a **binomial random variable**, written $X \sim B(n, p)$ (or
$\text{Binomial}(n, p)$). It can take values $0, 1, \ldots, n$.

Sampling *without* replacement breaks independence, but if the sample is less than 10% of
the population (the **10% condition**), the binomial model is still an excellent
approximation. Counting until a success occurs — no fixed $n$ — is *not* binomial; that is
the geometric setting of the next lesson.

## The binomial formula

$$P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}, \qquad k = 0, 1, \ldots, n.$$

### Why it works

Any *particular* sequence with $k$ successes and $n - k$ failures — say SSFFF…F — has
probability $p^k(1-p)^{n-k}$ by the multiplication rule for independent trials. How many such
sequences are there? We must choose which $k$ of the $n$ positions are successes:
$\binom{n}{k}$ ways. All have the same probability, so multiply.

### Example 1

In an old section of track, 20% of the rail ties are cracked. An inspector checks 10 ties chosen at random
(the section has thousands of ties, so the 10% condition holds). Let $X$ = number cracked.
$X \sim B(10, 0.2)$.

1. $P(X = 3) = \binom{10}{3}(0.2)^3(0.8)^7 = 120 \times 0.008 \times 0.2097 \approx 0.2013$.
2. $P(X \le 2) = P(0) + P(1) + P(2) = 0.1074 + 0.2684 + 0.3020 = 0.6778$.
3. $P(X \ge 1) = 1 - P(X = 0) = 1 - 0.8^{10} \approx 0.8926$.

On a calculator: `binompdf(n, p, k)` gives $P(X = k)$ and `binomcdf(n, p, k)` gives
$P(X \le k)$. For "at least $k$" use $1 - P(X \le k - 1)$; for "more than $k$",
$1 - P(X \le k)$. Reading the inequality carefully is half the battle:

| Words | Meaning | Calculator |
|---|---|---|
| at most 4 | $X \le 4$ | binomcdf(n, p, 4) |
| fewer than 4 | $X \le 3$ | binomcdf(n, p, 3) |
| at least 4 | $X \ge 4$ | 1 − binomcdf(n, p, 3) |
| more than 4 | $X \ge 5$ | 1 − binomcdf(n, p, 4) |

```plot
{"x": [-1.874, 8.6], "y": [-0.054, 0.315], "grid": false, "bars": [{"x": 0, "height": 0.1074, "width": 0.7}, {"x": 1, "height": 0.2684, "width": 0.7}, {"x": 2, "height": 0.302, "width": 0.7}, {"x": 3, "height": 0.2013, "width": 0.7}, {"x": 4, "height": 0.0881, "width": 0.7}, {"x": 5, "height": 0.0264, "width": 0.7}, {"x": 6, "height": 0.0055, "width": 0.7}, {"x": 7, "height": 0.0008, "width": 0.7}, {"x": 8, "height": 0.0001, "width": 0.7}], "segments": [{"from": [-0.6000000000000001, 0], "to": [8.6, 0]}, {"from": [-0.6000000000000001, 0], "to": [-0.6000000000000001, 0.3]}, {"from": [-0.68, 0.1], "to": [-0.6000000000000001, 0.1]}, {"from": [-0.68, 0.2], "to": [-0.6000000000000001, 0.2]}, {"from": [-0.68, 0.3], "to": [-0.6000000000000001, 0.3]}], "labels": [{"at": [0, -0.018], "text": "0"}, {"at": [1, -0.018], "text": "1"}, {"at": [2, -0.018], "text": "2"}, {"at": [3, -0.018], "text": "3"}, {"at": [4, -0.018], "text": "4"}, {"at": [5, -0.018], "text": "5"}, {"at": [6, -0.018], "text": "6"}, {"at": [7, -0.018], "text": "7"}, {"at": [8, -0.018], "text": "8"}, {"at": [-1.335, 0.0964], "text": "0.1"}, {"at": [-1.335, 0.19640000000000002], "text": "0.2"}, {"at": [-1.335, 0.2964], "text": "0.3"}, {"at": [4.0, -0.042], "text": "k"}], "caption": "B(10, 0.2): right-skewed because p is small"}
```

## Mean and standard deviation

For $X \sim B(n, p)$:

$$\mu_X = np, \qquad \sigma_X = \sqrt{np(1-p)}.$$

Why: $X$ is the sum of $n$ independent "indicator" variables, each equal to 1 (success,
probability $p$) or 0. Each indicator has mean $p$ and variance
$E(I^2) - p^2 = p - p^2 = p(1-p)$. Adding $n$ independent copies (last lesson) gives mean
$np$ and variance $np(1-p)$.

For the ties: $\mu = 10(0.2) = 2$ cracked ties, $\sigma = \sqrt{10(0.2)(0.8)} = \sqrt{1.6} \approx 1.265$.

## Shape and the normal approximation

A binomial distribution is symmetric when $p = 0.5$, right-skewed when $p$ is small, and
left-skewed when $p$ is large. As $n$ grows, it becomes more and more bell-shaped. The
**large counts condition**: if

$$np \ge 10 \quad\text{and}\quad n(1-p) \ge 10,$$

then $B(n, p)$ is approximately $N\!\left(np, \sqrt{np(1-p)}\right)$.

### Example 2

40% of a state's voters support a measure. In an SRS of 200 voters, what is the
probability at least 90 support it?

1. $X \sim B(200, 0.4)$. Check: $np = 80 \ge 10$, $n(1-p) = 120 \ge 10$. ✓
2. $\mu = 80$, $\sigma = \sqrt{200(0.4)(0.6)} = \sqrt{48} \approx 6.928$.
3. Normal approximation: $z = (90 - 80)/6.928 \approx 1.44$, $P(Z \ge 1.44) \approx 0.075$.
4. The exact binomial value is $1 - P(X \le 89) \approx 0.086$. A **continuity
   correction** — using 89.5 in place of 90, since the bar for $X = 90$ spans 89.5 to 90.5 —
   gives $z = 9.5/6.928 \approx 1.37$ and $P \approx 0.085$, much closer.

With technology, use the exact binomial; the approximation matters because it is the
bridge to the sampling distribution of $\hat{p}$ in Module 7.

### Example 3: is it binomial?

Decide whether each count is binomial.

1. *Number of sixes in 30 rolls of a fair die.* Binary (six or not), independent rolls,
   $n = 30$ fixed, $p = 1/6$ each time: binomial, $B(30, 1/6)$.
2. *Number of rolls until the first six.* No fixed $n$: not binomial (geometric, next lesson).
3. *Number of defective items when 5 are drawn from a box of 12 containing 3 defectives.* The
   sample is 42% of the box, so draws without replacement are far from independent: not
   binomial (use the hypergeometric count from lesson 23).
4. *Number of 50 randomly selected voters (from a city of 400,000) who favor a measure.* The
   10% condition holds, so it is approximately binomial.

## Common mistakes

- Using the binomial when trials aren't independent or $p$ changes (e.g., drawing from a
  small population without replacement).
- Mixing up "at least" and "more than" when converting to a cdf.
- Forgetting the $\binom{n}{k}$ factor (that gives one particular sequence's probability).
- Using $\sqrt{np}$ for the standard deviation.
- Applying the normal approximation when $np$ or $n(1-p)$ is below 10.

## Key points

- Binomial setting: binary, independent, fixed $n$, same $p$ (BINS).
- $P(X = k) = \binom{n}{k}p^k(1-p)^{n-k}$; cumulative probabilities add these.
- $\mu = np$, $\sigma = \sqrt{np(1-p)}$.
- If $np \ge 10$ and $n(1-p) \ge 10$, $X$ is approximately normal.
