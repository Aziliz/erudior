---
id: stat-geom-poisson
module: stat-m6
title: The geometric distribution
minutes: 30
topics: [Geometric distribution]
drills: [stat-geom, stat-geom-cdf]
refs: [stat-ref-probability]
---
## Waiting for the first success

The binomial counts successes in a *fixed* number of trials. A different question comes up
just as often: *how many trials until the first success?* How many calls until a customer
answers, how many welds until the first defective one, how many rolls until a six. When the
trials are independent with the same success probability, the answer follows the geometric
distribution, the second most common named discrete distribution in introductory statistics.

*AP exam scope:* the geometric distribution was part of AP Statistics until the framework
revision that took effect in the 2026–27 school year, which removed it. It is still taught in
most introductory college statistics courses.

## The geometric setting

In a **geometric setting**:

- each trial is a success or a failure (binary);
- trials are independent;
- each trial has the same success probability $p$;
- we count the number of trials $X$ up to and including the first success.

The first three conditions are exactly the binomial ones. The difference is the fourth: there
is no fixed number of trials $n$. We keep going until the first success, however long that
takes. Then $X$ is a **geometric random variable**, with possible values $1, 2, 3, \ldots$
(no upper limit). The smallest value is 1, not 0: you need at least one trial to get a success.

As with the binomial, drawing *without* replacement breaks independence; it is fine to treat
the trials as independent when the individuals checked are less than 10% of the population.

## The geometric formula

For the first success to occur on trial $k$, the first $k - 1$ trials must all fail and the
$k$th must succeed. By the multiplication rule for independent trials,

$$P(X = k) = (1 - p)^{k-1}p, \qquad k = 1, 2, 3, \ldots$$

There is no $\binom{n}{k}$ factor: only one arrangement puts the single success last
(F F … F S).

Two cumulative facts follow easily. "More than $k$ trials needed" means the first $k$ trials
all failed:

$$P(X > k) = (1 - p)^k, \qquad P(X \le k) = 1 - (1 - p)^k.$$

On a TI-83/84, `geometpdf(p, k)` gives $P(X = k)$ and `geometcdf(p, k)` gives $P(X \le k)$.

## Mean and standard deviation

$$\mu_X = \frac{1}{p}, \qquad \sigma_X = \frac{\sqrt{1-p}}{p}.$$

The mean makes intuitive sense: if 1 in 6 rolls is a six, then over many rolls there is one six
per 6 rolls, so the average wait is 6 rolls. Rarer successes mean longer waits, and the
standard deviation grows too — waits are very unpredictable when $p$ is small.

## Shape

The geometric distribution is always right-skewed, with its tallest bar at $X = 1$: each
probability is the previous one multiplied by $1 - p$, so the bars shrink steadily, and the tail
goes on forever. The geometric distribution is also **memoryless**: having already failed 10
times doesn't change the probabilities for the additional wait, because the trials are
independent and the coin, die or caller has no memory of the earlier failures.

```plot
{"x": [-0.9, 12.6], "y": [-0.03, 0.165], "grid": false, "bars": [{"x": 1, "height": 0.15, "width": 0.7}, {"x": 2, "height": 0.1275, "width": 0.7}, {"x": 3, "height": 0.1084, "width": 0.7}, {"x": 4, "height": 0.0921, "width": 0.7}, {"x": 5, "height": 0.0783, "width": 0.7}, {"x": 6, "height": 0.0666, "width": 0.7}, {"x": 7, "height": 0.0566, "width": 0.7}, {"x": 8, "height": 0.0481, "width": 0.7}, {"x": 9, "height": 0.0409, "width": 0.7}, {"x": 10, "height": 0.0347, "width": 0.7}, {"x": 11, "height": 0.0295, "width": 0.7}, {"x": 12, "height": 0.0251, "width": 0.7}], "segments": [{"from": [0.3, 0], "to": [12.6, 0]}, {"from": [0.3, 0], "to": [0.3, 0.15]}, {"from": [0.22, 0.05], "to": [0.3, 0.05]}, {"from": [0.22, 0.1], "to": [0.3, 0.1]}, {"from": [0.22, 0.15], "to": [0.3, 0.15]}], "labels": [{"at": [1, -0.009], "text": "1"}, {"at": [2, -0.009], "text": "2"}, {"at": [3, -0.009], "text": "3"}, {"at": [4, -0.009], "text": "4"}, {"at": [5, -0.009], "text": "5"}, {"at": [6, -0.009], "text": "6"}, {"at": [7, -0.009], "text": "7"}, {"at": [8, -0.009], "text": "8"}, {"at": [9, -0.009], "text": "9"}, {"at": [10, -0.009], "text": "10"}, {"at": [11, -0.009], "text": "11"}, {"at": [12, -0.009], "text": "12"}, {"at": [-0.5, 0.048], "text": "0.05"}, {"at": [-0.5, 0.098], "text": "0.10"}, {"at": [-0.5, 0.148], "text": "0.15"}, {"at": [6.5, -0.022], "text": "call number of first escalation"}], "caption": "Geometric distribution with p = 0.15: tallest bar at X = 1, long right tail"}
```

(Some books define the geometric variable as the number of *failures* before the first
success, with values $0, 1, 2, \ldots$ and mean $(1-p)/p$. This course counts trials, as
AP Statistics did and as most introductory textbooks do.)

### Example 1

15% of callers on a support line need escalation. Calls are independent. Let $X$ be the
number of calls until the first escalation, so $p = 0.15$.

1. $P(X = 4) = (0.85)^3(0.15) \approx 0.0921$: three calls without escalation, then one with.
2. $P(X \le 5) = 1 - 0.85^5 \approx 1 - 0.4437 = 0.5563$: a better-than-even chance the first
   escalation comes within 5 calls.
3. $\mu_X = 1/0.15 \approx 6.67$ calls; $\sigma_X = \sqrt{0.85}/0.15 \approx 6.15$ calls.

The histogram above shows this distribution. The single most likely value is $X = 1$, even
though the mean is 6.67 — the long right tail pulls the mean well above the typical values.

### Example 2: rolling for a six

Roll a fair die until a six appears. Let $X$ be the number of rolls; $p = 1/6$.

1. $P(\text{first six on roll } 3) = \left(\tfrac{5}{6}\right)^2\left(\tfrac{1}{6}\right) = \tfrac{25}{216} \approx 0.1157$.
2. $P(\text{more than 3 rolls needed}) = P(X > 3) = \left(\tfrac{5}{6}\right)^3 \approx 0.5787$.
   Check with the complement: $P(X \le 3) = 1 - 0.5787 = 0.4213$.
3. $\mu_X = 1/(1/6) = 6$ rolls, and $\sigma_X = \sqrt{5/6}\big/(1/6) \approx 5.48$ rolls.

Reading the inequality carefully matters just as it did for the binomial: "at most 3 rolls" is
$X \le 3$, "more than 3 rolls" is $X > 3$, and "at least 3 rolls" is $X \ge 3$, which is
$P(X > 2) = (5/6)^2 \approx 0.694$.

### Example 3: binomial or geometric?

1. *A recruiter calls candidates until one accepts; each accepts with probability 0.25,
   independently.* No fixed number of calls; we wait for the first success → geometric with
   $p = 0.25$. Expected calls: $1/0.25 = 4$. The chance it takes more than 4 calls is
   $0.75^4 \approx 0.316$.
2. *An inspector checks 15 welds, each defective with probability 0.04.* Fixed $n = 15$,
   counting defectives → binomial $B(15, 0.04)$.
3. *Cards are dealt from a shuffled deck until the first ace appears.* Not geometric: the
   deck is dealt without replacement, so the chance of an ace changes after every card (and
   52 cards is a small population).

## Choosing a model

| Question | Model | Values |
|---|---|---|
| Successes in $n$ fixed trials | Binomial $B(n, p)$ | $0, 1, \ldots, n$ |
| Trials until the first success | Geometric$(p)$ | $1, 2, 3, \ldots$ |

## Common mistakes

- Using $(1-p)^k p$ instead of $(1-p)^{k-1}p$ for $P(X = k)$ (that counts $k$ failures
  *before* the success, so the success is on trial $k + 1$).
- Using a binomial when there is no fixed number of trials, or a geometric when there is.
- Mixing up $P(X > k) = (1-p)^k$ and $P(X \ge k) = (1-p)^{k-1}$.
- Allowing $X = 0$: under the trials-counting definition the smallest value is 1.
- Thinking a long run of failures makes a success "due" (the gambler's fallacy again).

## Key points

- Geometric setting: binary, independent trials with the same $p$, counting trials until the
  first success.
- $P(X = k) = (1-p)^{k-1}p$; $P(X > k) = (1-p)^k$; $P(X \le k) = 1 - (1-p)^k$.
- $\mu = 1/p$, $\sigma = \sqrt{1-p}/p$.
- Always right-skewed, with the highest probability at $X = 1$.
