---
id: ps-ref-testing
title: Hypothesis tests, regression and ANOVA
---
## Framework

| Quantity | Definition |
|---|---|
| Power function | $\pi(\theta) = P_\theta(\text{reject } H_0)$ |
| Size | $\alpha = \sup_{\theta \in \Omega_0}\pi(\theta)$ |
| Type II error at $\theta \in \Omega_1$ | $\beta(\theta) = 1 - \pi(\theta)$ |
| p-value (upper-tailed) | $P_{\theta_0}(T \ge t_{\text{obs}})$; two-sided: double the smaller tail (symmetric null) |
| Sample size, one-sided $z$ | $n \ge \big((z_\alpha + z_\beta)\sigma/\delta\big)^2$ (two-sided: $z_{\alpha/2}$) |

Rejection regions: $H_1: \theta > \theta_0$ → upper tail; $\theta < \theta_0$ → lower tail; $\theta \ne \theta_0$ → both tails, $\alpha/2$ each.

## Tests for normal samples

| $H_0$ | Statistic | Null distribution |
|---|---|---|
| $\mu = \mu_0$, $\sigma$ known | $Z = \dfrac{\bar X - \mu_0}{\sigma/\sqrt n}$ | $N(0, 1)$ |
| $\mu = \mu_0$ | $T = \dfrac{\bar X - \mu_0}{S/\sqrt n}$ | $t_{n-1}$ |
| $\mu_D = \Delta_0$ (paired) | $T = \dfrac{\bar D - \Delta_0}{S_D/\sqrt n}$ | $t_{n-1}$ |
| $\mu_1 - \mu_2 = \Delta_0$, $\sigma_1 = \sigma_2$ | $T = \dfrac{\bar X - \bar Y - \Delta_0}{S_p\sqrt{1/m + 1/n}}$ | $t_{m+n-2}$ |
| $\mu_1 - \mu_2 = \Delta_0$ (Welch) | $T = \dfrac{\bar X - \bar Y - \Delta_0}{\sqrt{S_1^2/m + S_2^2/n}}$ | $\approx t_\nu$ |
| $\sigma^2 = \sigma_0^2$ | $\chi^2 = (n-1)S^2/\sigma_0^2$ | $\chi^2_{n-1}$ |
| $\sigma_1^2 = \sigma_2^2$ | $F = S_1^2/S_2^2$ | $F_{m-1,\,n-1}$ |

$$S_p^2 = \frac{(m-1)S_1^2 + (n-1)S_2^2}{m+n-2}, \qquad \nu = \frac{(S_1^2/m + S_2^2/n)^2}{\dfrac{(S_1^2/m)^2}{m-1} + \dfrac{(S_2^2/n)^2}{n-1}}, \qquad F_{1-\alpha,\,a,\,b} = \frac{1}{F_{\alpha,\,b,\,a}}.$$

## Most powerful and likelihood ratio tests

| Result | Statement |
|---|---|
| Neyman–Pearson | Simple vs simple: reject when $L(\theta_0)/L(\theta_1) \le k$, size $\alpha$ → most powerful |
| UMP | Exists for one-sided $H_1$ with a monotone likelihood ratio; usually not for two-sided |
| LRT | $\Lambda = L(\hat\theta_0)/L(\hat\theta)$; reject for small $\Lambda$ |
| Wilks | $-2\ln\Lambda \approx \chi^2_r$, $r = \dim\Omega - \dim\Omega_0$ |
| Exponential sums | $2\lambda\sum X_i \sim \chi^2_{2n}$ |
| Poisson | $-2\ln\Lambda = 2n[\bar x\ln(\bar x/\lambda_0) - (\bar x - \lambda_0)]$ |
| Binomial | $-2\ln\Lambda = 2[x\ln\frac{x}{np_0} + (n-x)\ln\frac{n-x}{n(1-p_0)}]$ |

## Proportions and counts

| Test | Statistic | Reference |
|---|---|---|
| One proportion | $Z = \dfrac{\hat p - p_0}{\sqrt{p_0(1-p_0)/n}}$ | $N(0,1)$ |
| Two proportions | $Z = \dfrac{\hat p_1 - \hat p_2}{\sqrt{\hat p(1-\hat p)(1/n_1 + 1/n_2)}}$, $\hat p = \dfrac{X_1 + X_2}{n_1 + n_2}$ | $N(0,1)$ |
| Goodness of fit | $X^2 = \sum(O_i - E_i)^2/E_i$, $E_i = np_{i0}$ | $\chi^2_{k-1-m}$ |
| Independence / homogeneity | $X^2 = \sum(O_{ij} - E_{ij})^2/E_{ij}$, $E_{ij} = R_iC_j/n$ | $\chi^2_{(r-1)(c-1)}$ |
| Likelihood ratio version | $G^2 = 2\sum O\ln(O/E)$ | same df |

Use the chi-square approximations when all expected counts are at least about 5.

## Simple linear regression

$S_{xx} = \sum(x_i - \bar x)^2$, $S_{xy} = \sum(x_i - \bar x)(y_i - \bar y)$, $S_{yy} = \sum(y_i - \bar y)^2$.

| Quantity | Formula |
|---|---|
| Slope, intercept | $b_1 = S_{xy}/S_{xx}$, $b_0 = \bar y - b_1\bar x$ |
| SSE, $s^2$ | $\text{SSE} = S_{yy} - b_1S_{xy}$, $s^2 = \text{SSE}/(n-2)$ |
| Variances | $\operatorname{Var}(b_1) = \sigma^2/S_{xx}$, $\operatorname{Var}(b_0) = \sigma^2(1/n + \bar x^2/S_{xx})$ |
| Slope test / interval | $t = \dfrac{b_1 - \beta_{10}}{s/\sqrt{S_{xx}}}$ on $n - 2$ df; $b_1 \pm t_{\alpha/2,n-2}\,s/\sqrt{S_{xx}}$ |
| Mean response at $x_0$ | $\hat y_0 \pm t_{\alpha/2,n-2}\,s\sqrt{1/n + (x_0 - \bar x)^2/S_{xx}}$ |
| New observation at $x_0$ | $\hat y_0 \pm t_{\alpha/2,n-2}\,s\sqrt{1 + 1/n + (x_0 - \bar x)^2/S_{xx}}$ |
| Decomposition | $\text{SST} = \text{SSR} + \text{SSE}$, $r^2 = \text{SSR}/\text{SST}$, $F = \text{SSR}/s^2 = t^2$ |

## One-way ANOVA

| Source | df | SS | MS | F |
|---|---|---|---|---|
| Treatments | $k - 1$ | $\sum n_i(\bar y_{i\cdot} - \bar y_{\cdot\cdot})^2$ | $\text{SSTr}/(k-1)$ | $\text{MSTr}/\text{MSE}$ |
| Error | $N - k$ | $\sum(n_i - 1)s_i^2$ | $\text{SSE}/(N-k)$ | |
| Total | $N - 1$ | $\sum\sum(y_{ij} - \bar y_{\cdot\cdot})^2$ | | |

Under $H_0$: $F \sim F_{k-1,\,N-k}$; reject for large $F$. Bonferroni pairwise:
$\bar y_i - \bar y_j \pm t_{\alpha/(2m),\,N-k}\sqrt{\text{MSE}(1/n_i + 1/n_j)}$ for $m$ comparisons.

## Nonparametric tests

| Test | Statistic | Null mean | Null variance |
|---|---|---|---|
| Sign | $B$ = number of positive differences (zeros dropped) | $n/2$ | $n/4$ (exactly $\text{Bin}(n, 1/2)$) |
| Signed-rank | $W^+$ = sum of ranks of $\lvert D_i\rvert$ with $D_i > 0$ | $n(n+1)/4$ | $n(n+1)(2n+1)/24$ |
| Rank-sum | $W$ = sum of sample-1 ranks in the combined sample | $m(N+1)/2$ | $mn(N+1)/12$ |
| Mann–Whitney | $U = W - m(m+1)/2$ | $mn/2$ | $mn(N+1)/12$ |

Large samples: $z = (\text{statistic} - \text{mean})/\sqrt{\text{variance}}$. Rank-based alternative to ANOVA: Kruskal–Wallis ($\approx \chi^2_{k-1}$).
