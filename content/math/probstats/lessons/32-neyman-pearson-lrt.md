---
id: ps-neyman-pearson
module: ps-m7
title: Most powerful tests and likelihood ratio tests
minutes: 45
topics: [Neyman–Pearson lemma, Likelihood ratio tests]
drills: [ps-d-mp-exponential, ps-d-lrt-poisson, ps-d-lrt-binomial]
refs: [ps-ref-testing]
---
## Where do good tests come from?

So far the test statistics have been chosen by intuition: reject $\mu = 50$ when $\bar X$ is
large. Is that the *best* choice, or could some other function of the data detect the
alternative more often at the same size? This lesson answers the question exactly when both
hypotheses are simple, and gives a general recipe, the likelihood ratio test, that produces
almost every standard test you have seen and many you haven't.

Write $L(\theta) = \prod_{i=1}^n f(x_i; \theta)$ for the likelihood of the observed sample.

## The Neyman–Pearson lemma

A level-$\alpha$ test of a simple $H_0: \theta = \theta_0$ versus a simple $H_1: \theta = \theta_1$ is
a **most powerful test** if no other test of size at most $\alpha$ has higher power at $\theta_1$.

**Neyman–Pearson lemma**. Let $k > 0$, and let $C$ be the rejection region

$$C = \left\{ \mathbf{x} : \frac{L(\theta_0)}{L(\theta_1)} \le k \right\}, \qquad \text{with } P_{\theta_0}(\mathbf X \in C) = \alpha.$$

Then $C$ is a most powerful region of size $\alpha$.

In words: reject when the data are at least $1/k$ times more likely under $H_1$ than under $H_0$.
Points are added to the rejection region in order of how strongly they favor $H_1$, which is the
most efficient way to "spend" the allowed Type I probability.

The bar chart shows this for ten Bernoulli trials, $H_0: p = 0.5$ against $H_1: p = 0.8$, with
$T = \sum X_i$. The ratio $f_1(t)/f_0(t) = 1.6^t\,0.4^{10}$ grows with $t$, so the outcomes enter the
rejection region from the top: first $t = 10$, then 9, then 8. Stopping after $t = 8$ spends
$0.001 + 0.010 + 0.044 = 0.055$ of null probability and buys power $0.107 + 0.268 + 0.302 = 0.678$.

```plot
{"x": [2.4, 10.7], "y": [0, 0.34], "xLabel": "number of successes t", "yLabel": "probability", "bars": [{"x": 2.82, "height": 0.1172, "width": 0.36, "color": "#2c5e8f"}, {"x": 3.18, "height": 0.0008, "width": 0.36, "color": "#c2570c"}, {"x": 3.82, "height": 0.2051, "width": 0.36, "color": "#2c5e8f"}, {"x": 4.18, "height": 0.0055, "width": 0.36, "color": "#c2570c"}, {"x": 4.82, "height": 0.2461, "width": 0.36, "color": "#2c5e8f"}, {"x": 5.18, "height": 0.0264, "width": 0.36, "color": "#c2570c"}, {"x": 5.82, "height": 0.2051, "width": 0.36, "color": "#2c5e8f"}, {"x": 6.18, "height": 0.0881, "width": 0.36, "color": "#c2570c"}, {"x": 6.82, "height": 0.1172, "width": 0.36, "color": "#2c5e8f"}, {"x": 7.18, "height": 0.2013, "width": 0.36, "color": "#c2570c"}, {"x": 7.82, "height": 0.0439, "width": 0.36, "color": "#2c5e8f"}, {"x": 8.18, "height": 0.302, "width": 0.36, "color": "#c2570c"}, {"x": 8.82, "height": 0.0098, "width": 0.36, "color": "#2c5e8f"}, {"x": 9.18, "height": 0.2684, "width": 0.36, "color": "#c2570c"}, {"x": 9.82, "height": 0.001, "width": 0.36, "color": "#2c5e8f"}, {"x": 10.18, "height": 0.1074, "width": 0.36, "color": "#c2570c"}], "segments": [{"from": [8.5, 0], "to": [8.5, 0.33], "dashed": true}], "labels": [{"at": [9.6, 0.325], "text": "reject: t ≥ 8"}, {"at": [5, 0.28], "text": "blue: p = 0.5 (H₀)"}, {"at": [5, 0.25], "text": "orange: p = 0.8 (H₁)"}], "caption": "Null (blue, left) and alternative (orange, right) probabilities of each t from 3 to 10 (t = 0, 1, 2 have null probability 0.001, 0.010, 0.044 and are never rejected); the region t ≥ 8 has size 0.055 and power 0.678"}
```

**Proof (continuous case).** Let $C'$ be any other region with $P_{\theta_0}(C') \le \alpha$, and write
$f_0, f_1$ for the joint densities. Split each region into the shared part $C \cap C'$ and the rest.
On $C \setminus C'$ (inside $C$) we have $f_1 \ge f_0/k$; on $C' \setminus C$ (outside $C$) we have
$f_1 < f_0/k$. Therefore

$$\int_C f_1 - \int_{C'} f_1 = \int_{C\setminus C'} f_1 - \int_{C'\setminus C} f_1 \ge \frac1k\left[\int_{C\setminus C'} f_0 - \int_{C'\setminus C} f_0\right] = \frac1k\left[\alpha - \int_{C'} f_0\right] \ge 0.$$

So $C$ has at least the power of $C'$. $\blacksquare$

With discrete data an exact size $\alpha$ may be unattainable; the lemma then holds for the
achievable sizes (or with a randomized decision on the boundary).

### Example 1: normal mean, $\sigma$ known

Test $H_0: \mu = \mu_0$ against $H_1: \mu = \mu_1$ with $\mu_1 > \mu_0$. The ratio is

$$\frac{L(\mu_0)}{L(\mu_1)} = \exp\!\left\{-\frac{1}{2\sigma^2}\left[\sum(x_i - \mu_0)^2 - \sum(x_i - \mu_1)^2\right]\right\} = \exp\!\left\{-\frac{\mu_1 - \mu_0}{\sigma^2}\sum x_i + \frac{n(\mu_1^2 - \mu_0^2)}{2\sigma^2}\right\}.$$

Since $\mu_1 - \mu_0 > 0$, the ratio is a *decreasing* function of $\sum x_i$, so "ratio $\le k$" is the
same as "$\bar x \ge c$" for some $c$. The size condition fixes $c = \mu_0 + z_\alpha\sigma/\sqrt n$. The
intuitive $z$ test is most powerful.

Notice that $c$ does not depend on which $\mu_1 > \mu_0$ we picked. The same region is most
powerful against *every* $\mu_1 > \mu_0$, so it is a **uniformly most powerful test** (UMP) for
$H_1: \mu > \mu_0$. This happens whenever the likelihood ratio is monotone in a statistic
$T$ (a **monotone likelihood ratio**), which is true for one-parameter exponential families whose
natural parameter is monotone in $\theta$ (normal, Poisson, binomial and exponential models among them). For
the two-sided $H_1: \mu \ne \mu_0$ there is no UMP test: the best region against $\mu_1 > \mu_0$ is
the upper tail, against $\mu_1 < \mu_0$ the lower tail, and no single region is best for both.

### Example 2: exponential lifetimes

Bearing lifetimes (thousands of hours) are exponential with rate $\lambda$:
$f(x;\lambda) = \lambda e^{-\lambda x}$. The old design has $\lambda = 2$ (mean 0.5); a new one is
claimed to have $\lambda = 1$ (mean 1). With $n = 10$ bearings, find the most powerful 5% test of
$H_0: \lambda = 2$ versus $H_1: \lambda = 1$, and its power.

1. *Ratio.* $\dfrac{L(2)}{L(1)} = \dfrac{2^{10} e^{-2\sum x_i}}{e^{-\sum x_i}} = 2^{10} e^{-\sum x_i}$, which decreases in $\sum x_i$.
   So reject when $S = \sum x_i \ge c$: long lifetimes favor the new design.
2. *Null distribution.* $S \sim \text{Gamma}(n, 1/\lambda)$ (scale $1/\lambda$), and $2\lambda S \sim \chi^2_{2n}$ (an MGF check:
   $(1 - 2t)^{-n}$). Under $H_0$, $4S \sim \chi^2_{20}$.
3. *Critical value.* $P(4S \ge 4c) = 0.05$ gives $4c = \chi^2_{0.05, 20} = 31.41$, so $c = 7.853$.
4. *Power.* Under $H_1$, $2S \sim \chi^2_{20}$, so power $= P(\chi^2_{20} \ge 15.71) \approx 0.735$.

```plot
{"x": [0, 22], "y": [-0.04, 0.3], "grid": false, "functions": [{"f": "2^10*x^9*exp(-2*x)/362880", "from": 0, "to": 22}, {"f": "x^9*exp(-x)/362880", "dashed": true, "from": 0, "to": 22}], "shade": [{"f": "x^9*exp(-x)/362880", "from": 7.853, "to": 22, "color": "#9bbbd9"}, {"f": "2^10*x^9*exp(-2*x)/362880", "from": 7.853, "to": 22, "color": "#c2570c"}], "segments": [{"from": [0, 0], "to": [22, 0]}, {"from": [7.853, 0], "to": [7.853, 0.27], "dashed": true}], "labels": [{"at": [3.2, 0.285], "text": "λ = 2 (H₀)"}, {"at": [12.5, 0.15], "text": "λ = 1 (H₁)"}, {"at": [7.853, -0.022], "text": "c = 7.85"}, {"at": [15.5, 0.045], "text": "power 0.735"}], "caption": "Density of the total lifetime S under each hypothesis; the most powerful region is S ≥ 7.85"}
```

## Generalized likelihood ratio tests

Most real hypotheses are composite. The natural extension compares the best fit allowed by
$H_0$ with the best fit overall:

$$\Lambda = \frac{\sup_{\theta \in \Omega_0} L(\theta)}{\sup_{\theta \in \Omega} L(\theta)} = \frac{L(\hat\theta_0)}{L(\hat\theta)}, \qquad 0 < \Lambda \le 1,$$

where $\hat\theta$ is the unrestricted MLE and $\hat\theta_0$ the MLE under $H_0$. A
**likelihood ratio test** (LRT, also called a generalized likelihood ratio test) rejects
$H_0$ when $\Lambda \le k$, with $k$ chosen to give size $\alpha$. Values near 1 mean $H_0$ fits almost as
well as the best possible model; small values mean it fits badly.

### Example 3: the $t$ test is a likelihood ratio test

For $N(\mu, \sigma^2)$ with both unknown, test $H_0: \mu = \mu_0$ versus $H_1: \mu \ne \mu_0$. The
unrestricted MLEs are $\hat\mu = \bar x$, $\hat\sigma^2 = \frac1n\sum(x_i - \bar x)^2$; under $H_0$,
$\hat\sigma_0^2 = \frac1n\sum(x_i - \mu_0)^2$. At an MLE of $\sigma^2$ the exponent of the normal
likelihood equals $-n/2$, so $L = (2\pi\hat\sigma^2)^{-n/2}e^{-n/2}$ and

$$\Lambda = \left(\frac{\hat\sigma^2}{\hat\sigma_0^2}\right)^{n/2}.$$

Now $\sum(x_i - \mu_0)^2 = \sum(x_i - \bar x)^2 + n(\bar x - \mu_0)^2$, so with $t = \dfrac{\bar x - \mu_0}{s/\sqrt n}$,

$$\frac{\hat\sigma_0^2}{\hat\sigma^2} = 1 + \frac{n(\bar x - \mu_0)^2}{(n-1)s^2} = 1 + \frac{t^2}{n-1}, \qquad \Lambda = \left(1 + \frac{t^2}{n-1}\right)^{-n/2}.$$

$\Lambda$ is a decreasing function of $\lvert t\rvert$, so "$\Lambda \le k$" is "$\lvert t\rvert \ge c$": the LRT is
exactly the two-sided $t$ test.

## The large-sample approximation

Often $\Lambda$ does not reduce to a statistic with a known distribution. Then use
**Wilks' theorem**: under regularity conditions, if $H_0$ is true,

$$-2\ln\Lambda \;\xrightarrow{d}\; \chi^2_r, \qquad r = \dim\Omega - \dim\Omega_0,$$

the number of free parameters that $H_0$ pins down. So reject when
$-2\ln\Lambda \ge \chi^2_{\alpha, r}$. Behind it is a second-order Taylor expansion of the
log-likelihood about the MLE: for one parameter,
$-2\ln\Lambda \approx (\hat\theta - \theta_0)^2 \, nI(\theta_0)$, the square of an asymptotically
standard normal quantity.

### Example 4: Poisson defect counts

Forty rail segments show a mean of $\bar x = 3.6$ surface defects each. Is this consistent with the
historical Poisson rate $\lambda_0 = 3$?

1. *Log-likelihood.* $\ell(\lambda) = n\bar x\ln\lambda - n\lambda - \sum\ln x_i!$, maximized at $\hat\lambda = \bar x$.
2. *Statistic.* $-2\ln\Lambda = 2[\ell(\hat\lambda) - \ell(\lambda_0)] = 2n\left[\bar x\ln\dfrac{\bar x}{\lambda_0} - (\bar x - \lambda_0)\right]$
   $= 80[3.6\ln 1.2 - 0.6] = 80(0.0564) = 4.51.$
3. *Reference distribution.* $\Omega$ is one-dimensional and $\Omega_0$ is a point, so $r = 1$. The
   p-value is $P(\chi^2_1 \ge 4.51) \approx 0.034$. Reject at 5%.

The Wald-type $z$ statistic $(\bar x - \lambda_0)/\sqrt{\lambda_0/n} = 2.19$ has $z^2 = 4.80$, close to 4.51,
as the Taylor argument predicts.

```plot
{"x": [2.4, 5], "y": [-6, 0.8], "xLabel": "λ", "yLabel": "ℓ(λ) − ℓ(λ̂)", "functions": [{"f": "40*(3.6*ln(x/3.6) - (x - 3.6))", "from": 2.4, "to": 5}], "segments": [{"from": [3, 0], "to": [3, -2.254], "dashed": true}], "points": [{"at": [3.6, 0], "label": "MLE 3.6"}, {"at": [3, -2.254], "label": "λ₀ = 3: drop 2.25"}], "caption": "The log-likelihood falls by 2.25 from its peak at λ₀ = 3, so −2 ln Λ = 4.51"}
```

## Common mistakes

- Writing the Neyman–Pearson ratio upside down. With $L(\theta_0)/L(\theta_1)$ you reject for *small* values.
- Forgetting the direction when reducing the ratio: multiplying by a negative constant flips "$\le$" to "$\ge$."
- Claiming a UMP test exists for a two-sided alternative.
- Counting degrees of freedom for Wilks' theorem as $n - 1$; it is the number of parameters fixed by $H_0$.
- Using the $\chi^2$ approximation with tiny samples or when $\theta_0$ is on the boundary of $\Omega$.

## Key points

- Neyman–Pearson: for simple versus simple, rejecting when $L(\theta_0)/L(\theta_1) \le k$ is most powerful.
- If the best region doesn't depend on $\theta_1$ (monotone likelihood ratio), the test is UMP for the one-sided alternative.
- LRT: $\Lambda = L(\hat\theta_0)/L(\hat\theta)$; reject for small $\Lambda$. The $z$, $t$, and many other tests are LRTs.
- Wilks: $-2\ln\Lambda \approx \chi^2_r$ under $H_0$, $r$ = number of parameters fixed by $H_0$.
- For a one-parameter Poisson: $-2\ln\Lambda = 2n[\bar x\ln(\bar x/\lambda_0) - (\bar x - \lambda_0)]$.
