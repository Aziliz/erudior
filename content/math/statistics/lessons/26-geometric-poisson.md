---
id: stat-geom-poisson
module: stat-m6
title: Geometric and Poisson distributions
minutes: 30
topics: [Geometric and Poisson]
drills: [stat-geom, stat-geom-cdf, stat-poisson]
refs: [stat-ref-probability]
---
## Two more counting models

The binomial counts successes in a *fixed* number of trials. Two other questions come up
constantly. *How many trials until the first success?* — how many calls until a customer
answers, how many welds until the first defective one. And *how many events occur in a
fixed interval of time or space?* — how many trains arrive in an hour, how many defects
in a kilometer of rail. The first is answered by the geometric distribution, the second by
the Poisson distribution.

## The geometric distribution

In a **geometric setting**, trials are binary and independent with the same success
probability $p$, and we count the number of trials $X$ up to and including the first
success. Then $X$ is a **geometric random variable**, with values $1, 2, 3, \ldots$ (no
upper limit).

For the first success to occur on trial $k$, the first $k - 1$ trials must fail and the
$k$th succeed:

$$P(X = k) = (1 - p)^{k-1}p.$$

Two cumulative facts follow easily. "More than $k$ trials needed" means the first $k$ all
failed:

$$P(X > k) = (1 - p)^k, \qquad P(X \le k) = 1 - (1 - p)^k.$$

Mean and standard deviation:

$$\mu_X = \frac{1}{p}, \qquad \sigma_X = \frac{\sqrt{1-p}}{p}.$$

The mean makes intuitive sense: if 1 in 6 rolls is a six, you wait 6 rolls on average.

The geometric distribution is always right-skewed, with its highest probability at
$X = 1$. It is also **memoryless**: having already failed 10 times doesn't change the
distribution of the additional wait.

(Some books define the geometric variable as the number of *failures* before the first
success, with values $0, 1, 2, \ldots$ and mean $(1-p)/p$. This course counts trials.)

### Example 1

15% of callers on a support line need escalation. Calls are independent. Let $X$ be the
number of calls until the first escalation.

1. $P(X = 4) = (0.85)^3(0.15) \approx 0.0921$.
2. $P(X \le 5) = 1 - 0.85^5 \approx 0.5563$: a better-than-even chance the first escalation
   comes within 5 calls.
3. $\mu_X = 1/0.15 \approx 6.67$ calls; $\sigma_X = \sqrt{0.85}/0.15 \approx 6.15$ calls.

## The Poisson distribution

A **Poisson random variable** counts the number of events in a fixed interval of time,
area, length or volume when

- events occur one at a time and independently of each other, and
- the average rate $\lambda$ (lambda) per interval is constant, so the expected count is
  proportional to the size of the interval.

Then

$$P(X = k) = \frac{e^{-\lambda}\lambda^k}{k!}, \qquad k = 0, 1, 2, \ldots$$

and remarkably,

$$\mu_X = \lambda, \qquad \sigma_X^2 = \lambda, \qquad \sigma_X = \sqrt{\lambda}.$$

Mean equal to variance is a signature of Poisson data; if observed counts have a variance
much larger than their mean, the events are probably clustered and a Poisson model doesn't
fit.

### Where the formula comes from

Split the interval into $n$ tiny pieces, each with a small chance $p = \lambda/n$ of
containing an event. The count is then $B(n, \lambda/n)$. As $n \to \infty$, the binomial
probabilities converge to $e^{-\lambda}\lambda^k/k!$ (using $(1 - \lambda/n)^n \to e^{-\lambda}$).
So the Poisson is the limit of the binomial for many trials with a tiny success
probability — and that gives the **Poisson approximation to the binomial**: when $n$ is
large and $p$ is small, $B(n, p) \approx \text{Poisson}(\lambda = np)$.

### Example 2

Ultrasonic inspection finds an average of 2.4 internal flaws per kilometer of rail. Assume
a Poisson model.

1. $P(\text{no flaws in a km}) = e^{-2.4} \approx 0.0907$.
2. $P(X = 3) = \dfrac{e^{-2.4}(2.4)^3}{3!} = \dfrac{0.0907 \times 13.824}{6} \approx 0.2090$.
3. $P(X \ge 2) = 1 - P(0) - P(1) = 1 - 0.0907 - 0.2177 = 0.6916$.
4. For a half-kilometer, scale the rate: $\lambda = 1.2$, so
   $P(\text{no flaws}) = e^{-1.2} \approx 0.3012$.

```plot
{"x": [-1.874, 8.6], "y": [-0.054, 0.315], "grid": false, "bars": [{"x": 0, "height": 0.0907, "width": 0.7}, {"x": 1, "height": 0.2177, "width": 0.7}, {"x": 2, "height": 0.2613, "width": 0.7}, {"x": 3, "height": 0.209, "width": 0.7}, {"x": 4, "height": 0.1254, "width": 0.7}, {"x": 5, "height": 0.0602, "width": 0.7}, {"x": 6, "height": 0.0241, "width": 0.7}, {"x": 7, "height": 0.0083, "width": 0.7}, {"x": 8, "height": 0.0025, "width": 0.7}], "segments": [{"from": [-0.6000000000000001, 0], "to": [8.6, 0]}, {"from": [-0.6000000000000001, 0], "to": [-0.6000000000000001, 0.3]}, {"from": [-0.68, 0.1], "to": [-0.6000000000000001, 0.1]}, {"from": [-0.68, 0.2], "to": [-0.6000000000000001, 0.2]}, {"from": [-0.68, 0.3], "to": [-0.6000000000000001, 0.3]}], "labels": [{"at": [0, -0.018], "text": "0"}, {"at": [1, -0.018], "text": "1"}, {"at": [2, -0.018], "text": "2"}, {"at": [3, -0.018], "text": "3"}, {"at": [4, -0.018], "text": "4"}, {"at": [5, -0.018], "text": "5"}, {"at": [6, -0.018], "text": "6"}, {"at": [7, -0.018], "text": "7"}, {"at": [8, -0.018], "text": "8"}, {"at": [-1.335, 0.0964], "text": "0.1"}, {"at": [-1.335, 0.19640000000000002], "text": "0.2"}, {"at": [-1.335, 0.2964], "text": "0.3"}, {"at": [4.0, -0.042], "text": "flaws per km"}], "caption": "Poisson distribution with λ = 2.4"}
```

### Example 3: Poisson approximation

A batch of 500 fuses has a 0.4% defect rate per fuse, independently. $P(\text{no defectives})$:

- Binomial: $0.996^{500} \approx 0.1348$.
- Poisson with $\lambda = 500 \times 0.004 = 2$: $e^{-2} \approx 0.1353$.

The approximation is excellent, and much easier to compute by hand.

## Choosing a model

| Question | Model | Values |
|---|---|---|
| Successes in $n$ fixed trials | Binomial $B(n, p)$ | $0, \ldots, n$ |
| Trials until the first success | Geometric$(p)$ | $1, 2, 3, \ldots$ |
| Events in a fixed interval at rate $\lambda$ | Poisson$(\lambda)$ | $0, 1, 2, \ldots$ |

### Example 4: picking the right model

1. *A quality engineer counts flaws per square meter of sheet steel, averaging 0.8.* Events in
   a fixed area at a steady rate → Poisson with $\lambda = 0.8$.
2. *A recruiter calls candidates until one accepts; each accepts with probability 0.25.* Trials
   until the first success → geometric with $p = 0.25$; expected calls $1/0.25 = 4$.
3. *An inspector checks 15 welds, each defective with probability 0.04.* Fixed $n$, binary
   outcomes → binomial $B(15, 0.04)$ (and since $n$ is moderate and $p$ small, a Poisson with
   $\lambda = 0.6$ would approximate it well).

## Common mistakes

- Using the geometric formula with $(1-p)^k$ instead of $(1-p)^{k-1}$ for $P(X = k)$.
- Using a binomial when there is no fixed number of trials.
- Forgetting to rescale $\lambda$ when the interval changes.
- Forgetting $0! = 1$ in $P(X = 0)$ for a Poisson.
- Applying a Poisson model to clustered events (e.g., accidents that cause other accidents).

## Key points

- Geometric: $P(X = k) = (1-p)^{k-1}p$, $P(X > k) = (1-p)^k$, $\mu = 1/p$, $\sigma = \sqrt{1-p}/p$.
- Poisson: $P(X = k) = e^{-\lambda}\lambda^k/k!$, mean and variance both $\lambda$.
- Poisson approximates $B(n, p)$ with $\lambda = np$ when $n$ is large and $p$ small.
- Rescale $\lambda$ in proportion to the interval length.
