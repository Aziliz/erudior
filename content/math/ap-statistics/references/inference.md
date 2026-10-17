---
id: stat-ref-inference
title: Inference formulas
---
## Sampling distributions

| Statistic | Mean | Standard deviation | Approximately normal when |
|---|---|---|---|
| $\hat{p}$ | $p$ | $\sqrt{\dfrac{p(1-p)}{n}}$ | $np \ge 10$ and $n(1-p) \ge 10$ |
| $\bar{x}$ | $\mu$ | $\dfrac{\sigma}{\sqrt{n}}$ | population normal, or $n \ge 30$ (CLT) |
| $\hat{p}_1 - \hat{p}_2$ | $p_1 - p_2$ | $\sqrt{\dfrac{p_1(1-p_1)}{n_1} + \dfrac{p_2(1-p_2)}{n_2}}$ | large counts in both groups |
| $\bar{x}_1 - \bar{x}_2$ | $\mu_1 - \mu_2$ | $\sqrt{\dfrac{\sigma_1^2}{n_1} + \dfrac{\sigma_2^2}{n_2}}$ | both normal or both large |

All require random sampling (or random assignment) and, when sampling without replacement, $n \le 10\%$ of the population.

## General forms

- Confidence interval: **statistic ± (critical value)(standard error)**
- Test statistic: **(statistic − null value) / (standard error)**

## Confidence intervals

| Parameter | Interval | df |
|---|---|---|
| $p$ | $\hat{p} \pm z^*\sqrt{\dfrac{\hat{p}(1-\hat{p})}{n}}$ | — |
| $p_1 - p_2$ | $(\hat{p}_1 - \hat{p}_2) \pm z^*\sqrt{\dfrac{\hat{p}_1(1-\hat{p}_1)}{n_1} + \dfrac{\hat{p}_2(1-\hat{p}_2)}{n_2}}$ | — |
| $\mu$ | $\bar{x} \pm t^*\dfrac{s}{\sqrt{n}}$ | $n - 1$ |
| $\mu_d$ (paired) | $\bar{d} \pm t^*\dfrac{s_d}{\sqrt{n}}$ | $n - 1$ (pairs) |
| $\mu_1 - \mu_2$ | $(\bar{x}_1 - \bar{x}_2) \pm t^*\sqrt{\dfrac{s_1^2}{n_1} + \dfrac{s_2^2}{n_2}}$ | technology, or $\min(n_1, n_2) - 1$ |
| $\beta_1$ (slope) | $b \pm t^* SE_b$, $SE_b = \dfrac{s}{s_x\sqrt{n-1}}$ | $n - 2$ |

| Confidence | 80% | 90% | 95% | 98% | 99% |
|---|---|---|---|---|---|
| $z^*$ | 1.282 | 1.645 | 1.960 | 2.326 | 2.576 |

## Sample size

| Goal | Formula (round up) |
|---|---|
| Proportion, margin $M$ | $n \ge \left(\dfrac{z^*}{M}\right)^2 p^*(1 - p^*)$, $p^* = 0.5$ if unknown |
| Mean, margin $M$ | $n \ge \left(\dfrac{z^*\sigma^*}{M}\right)^2$ |

## Test statistics

| Null hypothesis | Statistic | Distribution |
|---|---|---|
| $p = p_0$ | $z = \dfrac{\hat{p} - p_0}{\sqrt{p_0(1-p_0)/n}}$ | $N(0, 1)$ |
| $p_1 = p_2$ | $z = \dfrac{\hat{p}_1 - \hat{p}_2}{\sqrt{\hat{p}_c(1-\hat{p}_c)\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$, $\hat{p}_c = \dfrac{X_1 + X_2}{n_1 + n_2}$ | $N(0, 1)$ |
| $\mu = \mu_0$ | $t = \dfrac{\bar{x} - \mu_0}{s/\sqrt{n}}$ | $t_{n-1}$ |
| $\mu_d = 0$ | $t = \dfrac{\bar{d}}{s_d/\sqrt{n}}$ | $t_{n-1}$ |
| $\mu_1 = \mu_2$ | $t = \dfrac{\bar{x}_1 - \bar{x}_2}{\sqrt{s_1^2/n_1 + s_2^2/n_2}}$ | $t$, df as above |
| distribution fits / independence | $\chi^2 = \sum \dfrac{(O - E)^2}{E}$ | $\chi^2$: df = $k - 1$ or $(r-1)(c-1)$ |
| $\beta_1 = 0$ | $t = \dfrac{b}{SE_b}$ | $t_{n-2}$ |

Two-way table expected count: $\dfrac{(\text{row total})(\text{column total})}{\text{grand total}}$.

## p-values and errors

| Alternative | p-value |
|---|---|
| $<$ | area left of the test statistic |
| $>$ | area right of the test statistic |
| $\ne$ | 2 × area beyond $\lvert\text{statistic}\rvert$ |
| chi-square | upper tail only |

| | $H_0$ true | $H_0$ false |
|---|---|---|
| Reject $H_0$ | Type I error ($\alpha$) | correct (power $= 1 - \beta$) |
| Fail to reject | correct | Type II error ($\beta$) |

## Critical values for reference

| df | 5 | 10 | 15 | 20 | 30 | 60 | ∞ |
|---|---|---|---|---|---|---|---|
| $t^*$ (95%) | 2.571 | 2.228 | 2.131 | 2.086 | 2.042 | 2.000 | 1.960 |
| $t^*$ (90%) | 2.015 | 1.812 | 1.753 | 1.725 | 1.697 | 1.671 | 1.645 |
| $\chi^2$ (α = 0.05) | 11.070 | 18.307 | 24.996 | 31.410 | 43.773 | 79.082 | — |
