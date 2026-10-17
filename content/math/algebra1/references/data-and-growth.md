---
id: a1-ref-data
title: Growth, sequences and statistics
---
## Exponential functions $y = a \cdot b^x$

| Idea | Rule |
|---|---|
| Initial value | $a = y$ at $x = 0$ |
| Factor | each +1 in $x$ multiplies $y$ by $b$ ($b > 0$, $b \ne 1$) |
| Growth / decay | $b > 1$ growth; $0 < b < 1$ decay |
| Percent rate $r$ | growth $b = 1 + r$; decay $b = 1 - r$ |
| Interest (yearly) | $A = P(1 + r)^t$ |
| Another time step | factor $b$ per step $\Rightarrow$ $b^n$ per $n$ steps, $\sqrt b$ per half-step: $1.21^t = 1.1^{2t}$ |
| Graph ($a > 0$) | domain all reals, range $y > 0$, asymptote $y = 0$ |

## Linear vs exponential

| | Linear $y = mx + c$ | Exponential $y = a \cdot b^x$ |
|---|---|---|
| Equal steps in $x$ | equal differences (add $m$) | equal ratios (multiply by $b$) |
| Words | fixed amount per step | fixed percent per step |
| Long run | — | a growing exponential overtakes any linear or quadratic |

## Sequences

| | Arithmetic | Geometric |
|---|---|---|
| Pattern | add $d$ | multiply by $r$ |
| Explicit | $a_n = a_1 + (n - 1)d$ | $a_n = a_1 r^{\,n-1}$ |
| Recursive | $a_n = a_{n-1} + d$, $a_1$ given | $a_n = r\,a_{n-1}$, $a_1$ given |
| Function type | linear in $n$ | exponential in $n$ (when $r > 0$) |

## One-variable statistics

| Measure | How |
|---|---|
| Mean | $\bar x = \dfrac{\text{sum of values}}{n}$ |
| Median | middle value of the sorted data (average the two middle values if $n$ is even) |
| Quartiles | $Q_1$ = median of the lower half, $Q_3$ = median of the upper half (leave out the median when $n$ is odd) |
| Five-number summary | min, $Q_1$, median, $Q_3$, max (drawn as a box plot) |
| Range, IQR | max − min; $\text{IQR} = Q_3 - Q_1$ |
| Outlier fences | below $Q_1 - 1.5\,\text{IQR}$ or above $Q_3 + 1.5\,\text{IQR}$ |
| Standard deviation | $\sigma = \sqrt{\dfrac{\sum (x - \bar x)^2}{n}}$ (population); the sample version $s$ divides by $n - 1$ |

Skewed data or outliers: report the median and IQR. Roughly symmetric data: the mean and standard deviation.

## Two-way tables

| Frequency | Divide by |
|---|---|
| Joint relative | the grand total (one cell) |
| Marginal relative | the grand total (a row or column total) |
| Conditional relative | the total of the row or column you are given |

Association: the conditional relative frequencies differ noticeably from one group to the other.

## Scatter plots and lines of fit

| Idea | Rule |
|---|---|
| Correlation $r$ | $-1 \le r \le 1$; sign = direction, closeness to $\pm1$ = strength of the *linear* pattern |
| Line of fit | $\hat y = mx + b$; slope = predicted change in $y$ per 1 unit of $x$ |
| Residual | actual − predicted $= y - \hat y$ (positive: point above the line) |
| Good linear fit | residual plot shows random scatter around 0, no curve |
| Caution | correlation is not causation; extrapolating far outside the data is unreliable |

## Choosing and fitting models

| Idea | Rule |
|---|---|
| Quadratic regression | $\hat y = ax^2 + bx + c$; vertex gives the max or min; $c$ = prediction at $x = 0$ |
| Exponential regression | $\hat y = a \cdot b^x$; $a$ = prediction at $x = 0$; rate per step $b - 1$ (growth) or $1 - b$ (decay) |
| Equal $x$-steps | constant differences: linear; constant second differences: quadratic; constant ratios: exponential |
| Choosing | pick the model with a patternless residual plot that fits the context; a high $r$ or $R^2$ alone is not enough |
