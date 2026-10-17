---
id: ps-lln
module: ps-m5
title: Markov and Chebyshev inequalities and the law of large numbers
minutes: 35
topics: [Probability inequalities, Law of large numbers]
drills: [ps-d-chebyshev, ps-d-lln-n]
refs: [ps-ref-estimation]
---
## From one distribution to the long run

Everyone believes that a fair coin flipped many times comes up heads about half the time,
and that averaging more measurements gives a more trustworthy answer. This module proves
these beliefs. The tools are two inequalities that bound tail probabilities using only a
mean or a variance, with no knowledge of the distribution's shape. From them comes the
weak law of large numbers: sample averages settle down to the population mean. The next
lesson describes *how* they fluctuate around it (the Central Limit Theorem).

## Markov's inequality

**Markov's inequality**: if $X \ge 0$ and $a > 0$, then

$$P(X \ge a) \le \frac{E[X]}{a}.$$

*Why.* Compare $X$ with the random variable $a \cdot \mathbf{1}\{X \ge a\}$, which equals $a$ when $X \ge a$
and 0 otherwise. Because $X \ge 0$, we always have $a\,\mathbf{1}\{X \ge a\} \le X$: when the indicator is 1,
$X \ge a$; when it is 0, $X \ge 0$. Taking expectations of both sides,
$a\,P(X \ge a) \le E[X]$.

Intuitively, a nonnegative quantity with mean 5 cannot exceed 50 more than 10% of the time;
otherwise those values alone would push the mean above 5. The bound uses nothing but the
mean, so it is usually crude, but it can't be improved in general: if $X$ is 0 with probability
$0.9$ and 50 with probability $0.1$, then $E[X] = 5$ and $P(X \ge 50) = 0.1$ exactly.

## Chebyshev's inequality

**Chebyshev's inequality**: if $X$ has mean $\mu$ and finite variance $\sigma^2$, then for any $k > 0$,

$$P\big(|X - \mu| \ge k\sigma\big) \le \frac{1}{k^2}, \qquad\text{equivalently}\qquad P\big(|X - \mu| \ge \varepsilon\big) \le \frac{\sigma^2}{\varepsilon^2}.$$

*Why.* The event $|X - \mu| \ge \varepsilon$ is the same as $(X - \mu)^2 \ge \varepsilon^2$. Apply Markov to the
nonnegative variable $(X - \mu)^2$, whose mean is $\sigma^2$:
$P\big((X - \mu)^2 \ge \varepsilon^2\big) \le \sigma^2/\varepsilon^2$. Put $\varepsilon = k\sigma$ for the first form.

So *any* distribution has at least $1 - 1/k^2$ of its probability within $k$ SDs of its mean:
at least 75% within 2 SDs and at least $8/9 \approx 89\%$ within 3 SDs. For a normal distribution the
true figures are 95.4% and 99.7%; Chebyshev is the guarantee that holds when the shape is
unknown. (For $k \le 1$ the bound says nothing.)

### Example 1: bounds versus the truth

Repair times $X$ are exponential with mean 2 hours, so $\sigma = 2$ as well.

1. Markov: $P(X \ge 6) \le 2/6 = \tfrac13$.
2. Chebyshev: $X \ge 6$ means $X - 2 \ge 4 = 2\sigma$, so $P(X \ge 6) \le P(|X - 2| \ge 4) \le \tfrac14$.
3. Exact: $P(X \ge 6) = e^{-6/2} = e^{-3} \approx 0.050$.

Both bounds are true and both are far from the exact value. Using more information (the
variance) gave a better bound; using the full distribution gives the exact answer. Bounds are
for when you lack that information, or for proving theorems, which is next.

## Convergence in probability

A sequence of random variables $Y_1, Y_2, \dots$ **converges in probability** to a constant $c$ if,
for every $\varepsilon > 0$,

$$P\big(|Y_n - c| \ge \varepsilon\big) \to 0 \quad\text{as } n \to \infty.$$

No matter how tight a tolerance $\varepsilon$ you choose, the chance of being outside it vanishes
for large $n$. We write $Y_n \xrightarrow{P} c$.

## The weak law of large numbers

The **weak law of large numbers** (**WLLN**): let $X_1, X_2, \dots$ be iid with mean $\mu$ and finite variance
$\sigma^2$, and let $\bar X_n = (X_1 + \cdots + X_n)/n$. Then $\bar X_n \xrightarrow{P} \mu$.

*Proof.* We know $E[\bar X_n] = \mu$ and $\operatorname{Var}(\bar X_n) = \sigma^2/n$. Chebyshev applied to $\bar X_n$:

$$P\big(|\bar X_n - \mu| \ge \varepsilon\big) \le \frac{\operatorname{Var}(\bar X_n)}{\varepsilon^2} = \frac{\sigma^2}{n\varepsilon^2} \longrightarrow 0.$$

That is the whole proof, and it shows *why* averaging works: the variance of an average
shrinks like $1/n$. (The law still holds without a finite variance, given a finite mean, but
the proof is harder. The *strong* law says more: with probability 1 the sequence $\bar X_n$
actually converges to $\mu$.)

Apply it to indicators: if $X_i = 1$ when trial $i$ succeeds (probability $p$), then $\bar X_n$ is the
proportion of successes, $\hat p_n$, and $\hat p_n \xrightarrow{P} p$. This is the mathematical
content of "probability is long-run relative frequency".

```plot
{"x": [0, 400], "y": [0, 1], "xLabel": "number of flips n", "yLabel": "proportion of heads", "segments": [{"from": [1, 0.0], "to": [2, 0.5]}, {"from": [2, 0.5], "to": [3, 0.6667]}, {"from": [3, 0.6667], "to": [4, 0.5]}, {"from": [4, 0.5], "to": [5, 0.6]}, {"from": [5, 0.6], "to": [6, 0.6667]}, {"from": [6, 0.6667], "to": [7, 0.7143]}, {"from": [7, 0.7143], "to": [8, 0.75]}, {"from": [8, 0.75], "to": [9, 0.6667]}, {"from": [9, 0.6667], "to": [10, 0.7]}, {"from": [10, 0.7], "to": [11, 0.7273]}, {"from": [11, 0.7273], "to": [12, 0.6667]}, {"from": [12, 0.6667], "to": [13, 0.6154]}, {"from": [13, 0.6154], "to": [14, 0.6429]}, {"from": [14, 0.6429], "to": [15, 0.6667]}, {"from": [15, 0.6667], "to": [16, 0.625]}, {"from": [16, 0.625], "to": [17, 0.6471]}, {"from": [17, 0.6471], "to": [18, 0.6111]}, {"from": [18, 0.6111], "to": [19, 0.5789]}, {"from": [19, 0.5789], "to": [20, 0.6]}, {"from": [20, 0.6], "to": [21, 0.5714]}, {"from": [21, 0.5714], "to": [22, 0.5455]}, {"from": [22, 0.5455], "to": [23, 0.5217]}, {"from": [23, 0.5217], "to": [24, 0.5417]}, {"from": [24, 0.5417], "to": [25, 0.52]}, {"from": [25, 0.52], "to": [26, 0.5]}, {"from": [26, 0.5], "to": [27, 0.5185]}, {"from": [27, 0.5185], "to": [28, 0.5]}, {"from": [28, 0.5], "to": [29, 0.4828]}, {"from": [29, 0.4828], "to": [30, 0.5]}, {"from": [30, 0.5], "to": [32, 0.5]}, {"from": [32, 0.5], "to": [35, 0.4857]}, {"from": [35, 0.4857], "to": [38, 0.4737]}, {"from": [38, 0.4737], "to": [41, 0.439]}, {"from": [41, 0.439], "to": [44, 0.4545]}, {"from": [44, 0.4545], "to": [47, 0.4468]}, {"from": [47, 0.4468], "to": [50, 0.44]}, {"from": [50, 0.44], "to": [53, 0.4528]}, {"from": [53, 0.4528], "to": [56, 0.4821]}, {"from": [56, 0.4821], "to": [59, 0.4915]}, {"from": [59, 0.4915], "to": [62, 0.5]}, {"from": [62, 0.5], "to": [65, 0.5077]}, {"from": [65, 0.5077], "to": [68, 0.4853]}, {"from": [68, 0.4853], "to": [71, 0.493]}, {"from": [71, 0.493], "to": [74, 0.4865]}, {"from": [74, 0.4865], "to": [77, 0.4805]}, {"from": [77, 0.4805], "to": [80, 0.4875]}, {"from": [80, 0.4875], "to": [83, 0.506]}, {"from": [83, 0.506], "to": [86, 0.4884]}, {"from": [86, 0.4884], "to": [89, 0.4831]}, {"from": [89, 0.4831], "to": [92, 0.4891]}, {"from": [92, 0.4891], "to": [95, 0.4947]}, {"from": [95, 0.4947], "to": [98, 0.4898]}, {"from": [98, 0.4898], "to": [105, 0.4857]}, {"from": [105, 0.4857], "to": [113, 0.4867]}, {"from": [113, 0.4867], "to": [121, 0.4876]}, {"from": [121, 0.4876], "to": [129, 0.4884]}, {"from": [129, 0.4884], "to": [137, 0.4964]}, {"from": [137, 0.4964], "to": [145, 0.4966]}, {"from": [145, 0.4966], "to": [153, 0.4967]}, {"from": [153, 0.4967], "to": [161, 0.4969]}, {"from": [161, 0.4969], "to": [169, 0.5148]}, {"from": [169, 0.5148], "to": [177, 0.5028]}, {"from": [177, 0.5028], "to": [185, 0.5081]}, {"from": [185, 0.5081], "to": [193, 0.4974]}, {"from": [193, 0.4974], "to": [201, 0.5174]}, {"from": [201, 0.5174], "to": [209, 0.5167]}, {"from": [209, 0.5167], "to": [217, 0.5115]}, {"from": [217, 0.5115], "to": [225, 0.5067]}, {"from": [225, 0.5067], "to": [233, 0.5107]}, {"from": [233, 0.5107], "to": [241, 0.5104]}, {"from": [241, 0.5104], "to": [249, 0.51]}, {"from": [249, 0.51], "to": [257, 0.5058]}, {"from": [257, 0.5058], "to": [265, 0.5057]}, {"from": [265, 0.5057], "to": [273, 0.5055]}, {"from": [273, 0.5055], "to": [281, 0.5018]}, {"from": [281, 0.5018], "to": [289, 0.4983]}, {"from": [289, 0.4983], "to": [297, 0.4983]}, {"from": [297, 0.4983], "to": [305, 0.5016]}, {"from": [305, 0.5016], "to": [313, 0.4984]}, {"from": [313, 0.4984], "to": [321, 0.4953]}, {"from": [321, 0.4953], "to": [329, 0.4863]}, {"from": [329, 0.4863], "to": [337, 0.4926]}, {"from": [337, 0.4926], "to": [345, 0.487]}, {"from": [345, 0.487], "to": [353, 0.4901]}, {"from": [353, 0.4901], "to": [361, 0.4875]}, {"from": [361, 0.4875], "to": [369, 0.4905]}, {"from": [369, 0.4905], "to": [377, 0.4934]}, {"from": [377, 0.4934], "to": [385, 0.4935]}, {"from": [385, 0.4935], "to": [393, 0.4962]}, {"from": [0, 0.5], "to": [400, 0.5], "dashed": true}], "caption": "Running proportion of heads in 400 simulated fair-coin flips: it wanders early, then settles near 0.5"}
```

### Example 2: how many trials are enough?

How many flips of a coin with unknown $p$ guarantee, by Chebyshev, that
$P(|\hat p_n - p| \ge 0.05) \le 0.10$?

1. $\operatorname{Var}(\hat p_n) = p(1-p)/n$, and $p(1-p) \le \tfrac14$ for every $p$ (the parabola peaks at $p = \tfrac12$).
2. Chebyshev: $P(|\hat p_n - p| \ge 0.05) \le \dfrac{p(1-p)}{n(0.05)^2} \le \dfrac{0.25}{0.0025\,n} = \dfrac{100}{n}$.
3. Require $100/n \le 0.10$: $n \ge 1000$.

This guarantee holds for every $p$ with no approximation. The Central Limit Theorem (next
lesson) will show about 271 flips actually suffice, because the true distribution of $\hat p_n$
is much more concentrated than Chebyshev assumes.

### Example 3: Monte Carlo integration

To estimate $I = \int_0^1 e^{-x^2}\,dx$, draw $U_1, \dots, U_n$ iid Uniform(0, 1) and average
$g(U_i) = e^{-U_i^2}$. Since $E[g(U)] = \int_0^1 g(u)\,du = I$, the WLLN says the average converges to $I$.
Its accuracy depends on $\operatorname{Var}(g(U)) = \int_0^1 e^{-2u^2}du - I^2 \approx 0.598 - 0.558 = 0.040$. For error at most
0.01 with probability at least 0.95, Chebyshev asks for $0.040/(n \cdot 0.0001) \le 0.05$, about
$n \ge 8100$ draws. This is how high-dimensional integrals in physics and finance are computed.

## What the law does *not* say

The LLN is about the *average*. The *total* number of heads minus $n/2$ does not settle down;
its typical size grows like $\sqrt n$. Nor does the coin "correct" a run of tails: future flips
are independent of past ones. Early deviations get *diluted* by many later flips, not
cancelled. Believing otherwise is the gambler's fallacy.

## Common mistakes

- *Applying Markov to a variable that can be negative.* It requires $X \ge 0$.
- *Using Chebyshev without a finite variance*, or with $k \le 1$, where it is useless.
- *Treating a bound as an approximation.* $P \le 0.25$ does not mean $P \approx 0.25$.
- *Mixing the two forms.* $P(|X - \mu| \ge \varepsilon) \le \sigma^2/\varepsilon^2$ uses the variance; $1/k^2$ uses $k = \varepsilon/\sigma$.
- *The gambler's fallacy*: the LLN works by dilution, not compensation.

## Key points

- Markov: $X \ge 0 \Rightarrow P(X \ge a) \le E[X]/a$.
- Chebyshev: $P(|X - \mu| \ge k\sigma) \le 1/k^2$; at least $1 - 1/k^2$ within $k$ SDs.
- $Y_n \xrightarrow{P} c$ means $P(|Y_n - c| \ge \varepsilon) \to 0$ for every $\varepsilon > 0$.
- WLLN: $\bar X_n \xrightarrow{P} \mu$, proved by Chebyshev with $\operatorname{Var}(\bar X_n) = \sigma^2/n$.
- Chebyshev sample sizes are guaranteed but conservative.
