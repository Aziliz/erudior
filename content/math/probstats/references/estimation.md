---
id: ps-ref-estimation
title: Joint distributions, limit theorems and estimation
---
## Joint distributions

| Quantity | Discrete | Continuous |
|---|---|---|
| Probability of an event $A$ | $\sum_{(x,y) \in A} p(x, y)$ | $\iint_A f(x, y)\,dA$ |
| Marginal of $X$ | $p_X(x) = \sum_y p(x, y)$ | $f_X(x) = \int f(x, y)\,dy$ |
| Conditional of $Y$ given $X = x$ | $p(x, y)/p_X(x)$ | $f(x, y)/f_X(x)$ |
| Independence | $p(x, y) = p_X(x)p_Y(y)$ | $f(x, y) = f_X(x)f_Y(y)$ (rectangular support) |
| $E[g(X, Y)]$ | $\sum\sum g\,p$ | $\iint g\,f\,dA$ |

## Expectation, covariance, conditioning

| Identity | Formula |
|---|---|
| Covariance | $\operatorname{Cov}(X, Y) = E[XY] - E[X]E[Y]$ |
| Linear functions | $\operatorname{Cov}(aX + b, cY + d) = ac\operatorname{Cov}(X, Y)$ |
| Correlation | $\rho = \operatorname{Cov}(X, Y)/(\sigma_X\sigma_Y)$, $-1 \le \rho \le 1$ |
| Variance of a combination | $\operatorname{Var}(aX + bY) = a^2\operatorname{Var}X + b^2\operatorname{Var}Y + 2ab\operatorname{Cov}(X, Y)$ |
| iid sample mean | $E[\bar X] = \mu$, $\operatorname{Var}(\bar X) = \sigma^2/n$ |
| Total expectation | $E[Y] = E[E[Y \mid X]]$ |
| Total variance | $\operatorname{Var}(Y) = E[\operatorname{Var}(Y \mid X)] + \operatorname{Var}(E[Y \mid X])$ |
| Random sum $T = \sum_{i=1}^N X_i$ | $E[T] = \mu E[N]$, $\operatorname{Var}(T) = \sigma^2E[N] + \mu^2\operatorname{Var}(N)$ |

## Sums of independent random variables

| Rule | Result |
|---|---|
| Discrete convolution | $P(X + Y = z) = \sum_k p_X(k)p_Y(z - k)$ |
| Continuous convolution | $f_{X+Y}(z) = \int f_X(x)f_Y(z - x)\,dx$ |
| MGFs | $M_{X+Y}(t) = M_X(t)M_Y(t)$ |
| Poisson | $\text{Pois}(\lambda_1) + \text{Pois}(\lambda_2) = \text{Pois}(\lambda_1 + \lambda_2)$ |
| Binomial (same $p$) | $\text{Bin}(n_1, p) + \text{Bin}(n_2, p) = \text{Bin}(n_1 + n_2, p)$ |
| Normal | $aX + bY \sim N(a\mu_1 + b\mu_2,\ a^2\sigma_1^2 + b^2\sigma_2^2)$ |
| Gamma (shape $\alpha_i$, same scale $\theta$) | $\text{Gamma}(\alpha_1, \theta) + \text{Gamma}(\alpha_2, \theta) = \text{Gamma}(\alpha_1 + \alpha_2, \theta)$; $n$ iid exponentials with mean $\theta$ sum to Gamma($n, \theta$) |

## Bivariate normal and order statistics

| Fact | Formula |
|---|---|
| Conditional mean | $E[Y \mid X = x] = \mu_Y + \rho\dfrac{\sigma_Y}{\sigma_X}(x - \mu_X)$ |
| Conditional variance | $\operatorname{Var}(Y \mid X = x) = \sigma_Y^2(1 - \rho^2)$ |
| $\rho = 0$ | independent (bivariate normal only) |
| Maximum of $n$ iid | $F_{\max}(x) = F(x)^n$, $f_{\max} = nF^{n-1}f$ |
| Minimum of $n$ iid | $F_{\min}(x) = 1 - (1 - F(x))^n$, $f_{\min} = n(1 - F)^{n-1}f$ |
| $k$th order statistic | $f_{(k)}(x) = \dfrac{n!}{(k-1)!(n-k)!}F^{k-1}(1 - F)^{n-k}f$ |
| Uniform(0, 1) | $E[X_{(k)}] = k/(n + 1)$ |

## Limit theorems

| Result | Statement |
|---|---|
| Markov | $X \ge 0$: $P(X \ge a) \le E[X]/a$ |
| Chebyshev | $P(\lvert X - \mu\rvert \ge k\sigma) \le 1/k^2$; $P(\lvert X - \mu\rvert \ge \varepsilon) \le \sigma^2/\varepsilon^2$ |
| Weak law of large numbers | $P(\lvert\bar X_n - \mu\rvert \ge \varepsilon) \le \dfrac{\sigma^2}{n\varepsilon^2} \to 0$ |
| Central Limit Theorem | $\dfrac{\bar X_n - \mu}{\sigma/\sqrt n} \xrightarrow{d} N(0, 1)$; $S_n \approx N(n\mu, n\sigma^2)$ |
| Binomial approximation | $\text{Bin}(n, p) \approx N(np, np(1-p))$, continuity correction $\pm 0.5$ |

## Sampling distributions (normal population)

| Statistic | Distribution |
|---|---|
| $\bar X$ | $N(\mu, \sigma^2/n)$ |
| $(n-1)S^2/\sigma^2$ | $\chi^2_{n-1}$, independent of $\bar X$ |
| $(\bar X - \mu)/(S/\sqrt n)$ | $t_{n-1}$ |
| $(S_1^2/\sigma_1^2)/(S_2^2/\sigma_2^2)$ | $F_{n_1 - 1,\,n_2 - 1}$ |
| $\chi^2_\nu$ | mean $\nu$, variance $2\nu$; Gamma(shape $\nu/2$, scale 2) |
| $Z/\sqrt{V/\nu}$ | $t_\nu$; $T^2 \sim F_{1,\nu}$ |

## Estimators

| Concept | Formula |
|---|---|
| Bias | $E[\hat\theta] - \theta$ |
| Mean squared error | $\operatorname{MSE} = \operatorname{Var}(\hat\theta) + \operatorname{Bias}^2$ |
| Unbiased variance | $S^2 = \frac{1}{n-1}\sum(X_i - \bar X)^2$; $\hat\sigma^2 = \frac1n\sum(X_i - \bar X)^2$ has bias $-\sigma^2/n$ |
| Fisher information | $I(\theta) = -E\big[\partial_\theta^2\ln f(X; \theta)\big]$ |
| Cramér–Rao bound | $\operatorname{Var}(\hat\theta) \ge 1/(nI(\theta))$ (unbiased, regular family) |
| Large-sample MLE | $\hat\theta \approx N(\theta, 1/(nI(\theta)))$ |
| Delta method | $g(\hat\theta) \approx N\big(g(\theta), [g'(\theta)]^2\operatorname{Var}(\hat\theta)\big)$ |
| Sufficiency (factorization) | $T = u(\mathbf X)$ sufficient iff $f(\mathbf x; \theta) = \phi(u(\mathbf x); \theta)\,h(\mathbf x)$, $h$ free of $\theta$ |
| Rao–Blackwell | $W$ unbiased, $T$ sufficient: $E[W \mid T]$ unbiased, $\operatorname{Var}(E[W \mid T]) \le \operatorname{Var}(W)$ |
| Complete statistic | $E_\theta[g(T)] = 0$ for all $\theta$ $\Rightarrow$ $g(T) = 0$ |
| Lehmann–Scheffé | unbiased function of a complete sufficient $T$ = unique MVUE |
| Exponential family | $f = h(x)c(\theta)e^{w(\theta)t(x)}$: $\sum t(X_i)$ complete sufficient if $w(\theta)$ fills an interval |

| Model | MoM | MLE | $I(\theta)$ |
|---|---|---|---|
| Bernoulli($p$) | $\bar x$ | $\bar x$ | $1/(p(1-p))$ |
| Poisson($\lambda$) | $\bar x$ | $\bar x$ | $1/\lambda$ |
| Exponential (rate $\lambda$) | $1/\bar x$ | $1/\bar x$ | $1/\lambda^2$ |
| Geometric($p$), $x \ge 1$ | $1/\bar x$ | $1/\bar x$ | $1/(p^2(1-p))$ |
| $N(\mu, \sigma^2)$ | $\bar x$, $\frac1n\sum(x_i - \bar x)^2$ | same | $1/\sigma^2$ for $\mu$ |
| Uniform$(0, \theta)$ | $2\bar x$ | $\max x_i$ | (not regular) |

| Target | MVUE (from complete sufficient $T$) |
|---|---|
| Bernoulli $p$, $p^2$, $p(1-p)$ | $T/n$, $\dfrac{T(T-1)}{n(n-1)}$, $\dfrac{T(n-T)}{n(n-1)}$ with $T = \sum X_i$ |
| Poisson $\lambda$, $e^{-\lambda}$ | $\bar X$, $(1 - 1/n)^T$ |
| Exponential rate $\lambda$ | $(n-1)/\sum X_i$ (MLE $n/\sum X_i$ is biased) |
| Normal $\mu$, $\sigma^2$, $\mu^2$ | $\bar X$, $S^2$, $\bar X^2 - S^2/n$ |
| Uniform$(0, \theta)$ | $\frac{n+1}{n}X_{(n)}$ |

## Confidence intervals

| Parameter | Pivot | Interval |
|---|---|---|
| $\mu$, $\sigma$ known | $\dfrac{\bar X - \mu}{\sigma/\sqrt n} \sim N(0, 1)$ | $\bar x \pm z_{\alpha/2}\,\sigma/\sqrt n$ |
| $\mu$, $\sigma$ unknown | $\dfrac{\bar X - \mu}{S/\sqrt n} \sim t_{n-1}$ | $\bar x \pm t_{\alpha/2,n-1}\,s/\sqrt n$ |
| $\sigma^2$ | $\dfrac{(n-1)S^2}{\sigma^2} \sim \chi^2_{n-1}$ | $\left[\dfrac{(n-1)s^2}{\chi^2_U},\ \dfrac{(n-1)s^2}{\chi^2_L}\right]$ |
| $p$ (large $n$) | $\dfrac{\hat p - p}{\sqrt{p(1-p)/n}} \approx N(0, 1)$ | $\hat p \pm z_{\alpha/2}\sqrt{\hat p(1-\hat p)/n}$ |
| $\mu_1 - \mu_2$, $\sigma$'s known | normal | $(\bar x_1 - \bar x_2) \pm z_{\alpha/2}\sqrt{\sigma_1^2/n_1 + \sigma_2^2/n_2}$ |
| $\mu_1 - \mu_2$, equal unknown $\sigma$ | $t_{n_1+n_2-2}$ | $(\bar x_1 - \bar x_2) \pm t_{\alpha/2}\,s_p\sqrt{1/n_1 + 1/n_2}$ |
| $p_1 - p_2$ (large $n$) | normal | $(\hat p_1 - \hat p_2) \pm z_{\alpha/2}\sqrt{\frac{\hat p_1(1-\hat p_1)}{n_1} + \frac{\hat p_2(1-\hat p_2)}{n_2}}$ |
| Exponential rate $\lambda$ | $2\lambda\sum X_i \sim \chi^2_{2n}$ | $\left[\dfrac{\chi^2_L}{2\sum x_i},\ \dfrac{\chi^2_U}{2\sum x_i}\right]$ |

Pooled variance: $s_p^2 = \dfrac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$. Sample size for margin $E$: $n = (z_{\alpha/2}\sigma/E)^2$, rounded up.
$\chi^2_L$ and $\chi^2_U$ are the $\alpha/2$ and $1 - \alpha/2$ quantiles. Common $z_{\alpha/2}$: 1.645 (90%), 1.960 (95%), 2.576 (99%).

## Bootstrap and resampling

| Quantity | Formula |
|---|---|
| Bootstrap sample | $n$ draws with replacement from $x_1, \dots, x_n$; a point is omitted with probability $(1 - 1/n)^n \approx 0.368$ |
| Bootstrap SE | SD of the replicates $\hat\theta^*_1, \dots, \hat\theta^*_B$ (divide by $B - 1$) |
| Bias estimate | $\bar\theta^* - \hat\theta$ |
| Ideal SE of $\bar x$ | $\hat\sigma/\sqrt n$, $\hat\sigma^2 = \frac1n\sum(x_i - \bar x)^2$ |
| Percentile interval | $\alpha/2$ and $1 - \alpha/2$ quantiles of the replicates |
| Normal bootstrap interval | $\hat\theta \pm z_{\alpha/2}\,\widehat{\text{SE}}_{\text{boot}}$ |
| Permutation p-value | fraction of relabelings (without replacement) with a statistic at least as extreme as observed |

## Bayesian conjugate updates

| Data | Prior | Posterior | Posterior mean |
|---|---|---|---|
| $x$ successes in $n$ trials | Beta$(a, b)$ | Beta$(a + x,\ b + n - x)$ | $\dfrac{a + x}{a + b + n}$ |
| $n$ Poisson counts | Gamma$(\alpha, \beta)$ (shape $\alpha$, rate $\beta$) | Gamma$(\alpha + \sum x_i,\ \beta + n)$ | $\dfrac{\alpha + \sum x_i}{\beta + n}$ |
| $n$ readings $N(\theta, \sigma^2)$, $\sigma$ known | $N(\mu_0, \tau_0^2)$ | $N(\mu_n, \tau_n^2)$, $\dfrac{1}{\tau_n^2} = \dfrac{1}{\tau_0^2} + \dfrac{n}{\sigma^2}$ | $\mu_n = \tau_n^2\left(\dfrac{\mu_0}{\tau_0^2} + \dfrac{n\bar x}{\sigma^2}\right)$ |

Beta$(\alpha, \beta)$ mode (MAP): $(\alpha - 1)/(\alpha + \beta - 2)$. Equal-tailed credible interval: the $\alpha/2$ and $1 - \alpha/2$ posterior quantiles.
