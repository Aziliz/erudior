---
id: stat-ref-descriptive
title: Describing data and regression
---
## One variable

| Quantity | Formula / rule |
|---|---|
| Relative frequency | count ÷ total |
| Pie chart angle | relative frequency × 360° |
| Mean | $\bar{x} = \dfrac{\sum x_i}{n}$ (population: $\mu = \dfrac{\sum x_i}{N}$) |
| Weighted mean | $\bar{x}_w = \dfrac{\sum w_i x_i}{\sum w_i}$ |
| Median | middle of sorted data, position $\dfrac{n+1}{2}$ |
| Range | max − min |
| Quartiles | $Q_1$ = median of lower half, $Q_3$ = median of upper half (leave out the median when $n$ is odd) |
| IQR | $Q_3 - Q_1$ |
| Sample variance | $s^2 = \dfrac{\sum (x_i - \bar{x})^2}{n - 1} = \dfrac{\sum x_i^2 - n\bar{x}^2}{n-1}$ |
| Sample SD | $s = \sqrt{s^2}$ (population: divide by $N$, use $\mu$) |
| Outlier fences | $Q_1 - 1.5\,\text{IQR}$ and $Q_3 + 1.5\,\text{IQR}$ |
| Five-number summary | min, $Q_1$, median, $Q_3$, max |

**Shape and center:** symmetric → mean ≈ median; skewed right → mean > median; skewed left → mean < median. Use mean & SD for symmetric data, median & IQR for skewed data or outliers.

## Position

| Quantity | Formula |
|---|---|
| z-score | $z = \dfrac{x - \text{mean}}{\text{SD}}$ |
| Value from z | $x = \text{mean} + z \cdot \text{SD}$ |
| Chebyshev | at least $1 - 1/k^2$ within $k$ SDs (any distribution) |

## Linear transformation $y = a + bx$

| Summary | New value |
|---|---|
| Mean, median, quartiles, percentiles | $a + b \times \text{old}$ |
| SD, IQR, range | $\lvert b\rvert \times \text{old}$ |
| Variance | $b^2 \times \text{old}$ |
| Shape | unchanged (mirrored if $b < 0$) |

## Normal distributions

| Fact | Value |
|---|---|
| Empirical rule | 68% / 95% / 99.7% within 1 / 2 / 3 SDs |
| Standardize | $P(X < x) = \Phi\!\left(\dfrac{x - \mu}{\sigma}\right)$ |
| Right tail; between | $1 - \Phi(z)$; $\Phi(z_2) - \Phi(z_1)$ |
| Inverse | $x = \mu + z\sigma$, $z = \Phi^{-1}(\text{area to the left})$ |

| $z$ | 0.674 | 1.000 | 1.282 | 1.645 | 1.960 | 2.326 | 2.576 |
|---|---|---|---|---|---|---|---|
| $\Phi(z)$ | 0.75 | 0.8413 | 0.90 | 0.95 | 0.975 | 0.99 | 0.995 |

## Two variables

| Quantity | Formula |
|---|---|
| Correlation | $r = \dfrac{1}{n-1}\sum \left(\dfrac{x_i - \bar{x}}{s_x}\right)\left(\dfrac{y_i - \bar{y}}{s_y}\right) = \dfrac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$ |
| LSRL | $\hat{y} = a + bx$ |
| Slope | $b = r\dfrac{s_y}{s_x} = \dfrac{S_{xy}}{S_{xx}}$ |
| Intercept | $a = \bar{y} - b\bar{x}$ (line passes through $(\bar{x}, \bar{y})$) |
| Residual | $y - \hat{y}$ |
| Coefficient of determination | $r^2 = 1 - \dfrac{\text{SSE}}{\text{SST}}$ |
| SD of residuals | $s = \sqrt{\dfrac{\sum (y - \hat{y})^2}{n - 2}}$ |
| Exponential model | $\log y$ linear in $x$; $\hat{y} = 10^{a + bx}$ |
| Power model | $\log y$ linear in $\log x$; $\hat{y} = 10^{a}x^{b}$ |

Here $S_{xy} = \sum (x_i - \bar{x})(y_i - \bar{y})$, $S_{xx} = \sum (x_i - \bar{x})^2$, $S_{yy} = \sum (y_i - \bar{y})^2$.

## Two-way tables

| Distribution | Divide the count by |
|---|---|
| Marginal | the grand total (using row or column totals) |
| Joint | the grand total (using one cell) |
| Conditional | the total of the "given" row or column |
