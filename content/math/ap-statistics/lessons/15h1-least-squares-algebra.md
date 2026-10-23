---
id: stat-m3-h-least-squares
module: stat-m3
honors: true
title: 'The mathematics of least squares'
minutes: 45
topics: [Least-squares theory]
drills: [stat-m3-r2-ss-decomp, stat-m3-r2-sse-summary]
refs: [stat-ref-descriptive]
---
## Where the formulas come from

The least-squares regression lesson stated two formulas, $b = r\,s_y/s_x$ and
$a = \bar{y} - b\bar{x}$, and the residuals lesson stated a third, $r^2 = 1 - \text{SSE}/\text{SST}$.
Each came with a sentence of intuition, but none was proved. This honors lesson proves all
three using nothing beyond algebra (no calculus), and the proofs pay off: they explain why the
line passes through $(\bar{x}, \bar{y})$, why the residuals always add to zero, why the
"fraction of variation explained" happens to be the square of the correlation, and why the
standard deviation of the residuals divides by $n - 2$.

Throughout, use the shorthand from the correlation lesson:

$$S_{xx} = \sum (x_i - \bar{x})^2, \quad S_{yy} = \sum (y_i - \bar{y})^2, \quad S_{xy} = \sum (x_i - \bar{x})(y_i - \bar{y}).$$

Note that $S_{yy}$ is the same as SST, and that $r = S_{xy}/\sqrt{S_{xx}S_{yy}}$.

## A short history

The method was first published by the French mathematician Adrien-Marie Legendre in 1805, in
an appendix to a work on the orbits of comets; he called it the *méthode des moindres carrés*.
Carl Friedrich Gauss published his own account in 1809 and said he had been using the method
since 1795, which started a long priority dispute. Gauss also showed why squares are natural
when measurement errors follow a normal curve. Astronomers and surveyors used it for most of a
century before Galton and Pearson brought it to biology and the social sciences.

## Step 1: the mean minimizes squared deviations

Take any list of numbers $d_1, \ldots, d_n$ with mean $\bar{d}$, and any constant $c$. Write
$d_i - c = (d_i - \bar{d}) + (\bar{d} - c)$ and square:

$$\sum (d_i - c)^2 = \sum (d_i - \bar{d})^2 + 2(\bar{d} - c)\sum (d_i - \bar{d}) + n(\bar{d} - c)^2.$$

The middle sum is zero, because deviations from the mean always add to zero. So

$$\sum (d_i - c)^2 = \sum (d_i - \bar{d})^2 + n(\bar{d} - c)^2.$$

The first term doesn't depend on $c$, and the second is never negative. The total is smallest
when $c = \bar{d}$: *the mean is the single number closest to a list in the squared-error
sense*. This one fact does most of the work below.

## Step 2: the best intercept for any slope

Fix any slope $b$. The squared error of the line $y = a + bx$ is

$$\text{SSE}(a, b) = \sum \big(y_i - a - bx_i\big)^2 = \sum (d_i - a)^2, \quad \text{where } d_i = y_i - bx_i.$$

By Step 1, the best $a$ is the mean of the $d_i$, which is $\bar{y} - b\bar{x}$. So whatever
slope you choose, the best line with that slope passes through $(\bar{x}, \bar{y})$. That
proves the intercept formula, and it shows why the least-squares line goes through the point
of means.

## Step 3: the best slope, by completing the square

Put $a = \bar{y} - b\bar{x}$ back in. Each error becomes
$y_i - \bar{y} - b(x_i - \bar{x})$, so

$$\text{SSE}(b) = \sum \big[(y_i - \bar{y}) - b(x_i - \bar{x})\big]^2 = S_{yy} - 2bS_{xy} + b^2 S_{xx}.$$

That is a quadratic in $b$ that opens upward. Completing the square:

$$\text{SSE}(b) = S_{xx}\left(b - \frac{S_{xy}}{S_{xx}}\right)^2 + S_{yy} - \frac{S_{xy}^2}{S_{xx}}.$$

The squared term is zero exactly when $b = S_{xy}/S_{xx}$, which is the least-squares slope.
Because $S_{xy} = (n - 1)\,r\,s_x s_y$ and $S_{xx} = (n - 1)s_x^2$, this equals
$r\,s_y/s_x$, the formula from the lesson.

```plot
{"x": [0, 1.6], "y": [0, 10], "xLabel": "slope b of a line through (3, 5)", "yLabel": "SSE", "functions": [{"f": "10*(x - 0.8)^2 + 3.6", "color": "#2c5e8f"}], "points": [{"at": [0.8, 3.6], "label": "b = 0.8, SSE = 3.6", "color": "#c2570c"}, {"at": [0.6, 4.0], "label": "b = 0.6, SSE = 4.0"}], "caption": "Training data: SSE(b) = 10(b − 0.8)² + 3.6 is a parabola with its lowest point at the least-squares slope"}
```

Putting Steps 2 and 3 together gives one identity for *any* line $y = a + bx$, with
$\hat{b} = S_{xy}/S_{xx}$ and $\hat{a} = \bar{y} - \hat{b}\bar{x}$ the least-squares values:

$$\text{SSE}(a, b) = \text{SSE}_{\min} + S_{xx}(b - \hat{b})^2 + n\big(\bar{y} - a - b\bar{x}\big)^2.$$

The second term is the price of a wrong slope; the third is the price of missing the point of
means.

### Example 1: checking a line that isn't the best

For the training data $(1, 3), (2, 5), (3, 4), (4, 7), (5, 6)$ we know $n = 5$, $\bar{x} = 3$,
$\bar{y} = 5$, $S_{xx} = 10$, $S_{xy} = 8$, $S_{yy} = 10$, and the least-squares line
$\hat{y} = 2.6 + 0.8x$ has $\text{SSE}_{\min} = 3.6$. How much worse is the line $y = 3 + 0.6x$?

1. Directly: the line predicts $3.6, 4.2, 4.8, 5.4, 6.0$, so the errors are
   $-0.6, 0.8, -0.8, 1.6, 0$ and $\text{SSE} = 0.36 + 0.64 + 0.64 + 2.56 + 0 = 4.2$.
2. From the identity: slope penalty $10(0.6 - 0.8)^2 = 0.4$; the line's height at $\bar{x}$ is
   $3 + 0.6(3) = 4.8$, so the means penalty is $5(5 - 4.8)^2 = 0.2$.
3. Total: $3.6 + 0.4 + 0.2 = 4.2$. ✓ Both routes agree, and the identity also says *why* the
   line is worse: mostly its slope.

## Step 4: why r² is the square of r

At the best slope, the completed square leaves

$$\text{SSE}_{\min} = S_{yy} - \frac{S_{xy}^2}{S_{xx}} = S_{yy}\left(1 - \frac{S_{xy}^2}{S_{xx}S_{yy}}\right) = \text{SST}\,(1 - r^2).$$

Divide by SST and rearrange: $1 - \text{SSE}/\text{SST} = r^2$. The residuals lesson
*defined* $r^2$ as a fraction of variation explained; this shows that fraction really is the
correlation squared. It also proves $|r| \le 1$, because SSE can't be negative, and that
$|r| = 1$ exactly when SSE $= 0$, which means every point is on the line.

## The sum-of-squares decomposition

Each point's deviation from the mean splits into two pieces:

$$\underbrace{y_i - \bar{y}}_{\text{total}} = \underbrace{\hat{y}_i - \bar{y}}_{\text{explained by the line}} + \underbrace{y_i - \hat{y}_i}_{\text{residual}}.$$

Here $\hat{y}_i$ is the **fitted value**, the line's prediction at the observed $x_i$.

![The training data with the least-squares line and a dashed horizontal line at the mean of y, 5. For the point (4, 7), a purple bar shows the total deviation y minus y-bar = 2 from the mean line up to the point. Beside it, a green bar from the mean line up to the line's fitted value 5.8 shows the explained part, 0.8, and an orange bar from the fitted value up to the point shows the residual, 1.2.](images/stat-m3-ss-decomp.svg)

Squaring and adding over all points, the cross term $2\sum(\hat{y}_i - \bar{y})(y_i - \hat{y}_i)$
turns out to be zero (see the next section), which leaves the **sum-of-squares decomposition**

$$\text{SST} = \text{SSR} + \text{SSE},$$

where $\text{SSR} = \sum (\hat{y}_i - \bar{y})^2$ is the **regression sum of squares**. Since
$\hat{y}_i - \bar{y} = \hat{b}(x_i - \bar{x})$, it equals $\hat{b}^2 S_{xx}$. Then
$r^2 = \text{SSR}/\text{SST}$ as well. (Some books call SSR the "model" sum of squares, and a
few use "SSR" for the *residual* sum of squares, so check the definition before you use a
formula from another source.)

### Example 2: the decomposition for the training data

1. $\text{SST} = S_{yy} = 10$.
2. $\text{SSR} = \hat{b}^2 S_{xx} = 0.8^2 \times 10 = 6.4$.
3. $\text{SSE} = 3.6$ (from the residuals lesson's table).
4. Check: $6.4 + 3.6 = 10$. ✓ And $r^2 = 6.4/10 = 0.64 = 0.8^2$.

For the single point $(4, 7)$ in the picture: total $7 - 5 = 2$, explained $5.8 - 5 = 0.8$,
residual $7 - 5.8 = 1.2$, and $0.8 + 1.2 = 2$. The squares do *not* add for one point
($0.64 + 1.44 \ne 4$); the decomposition holds only for the sums over all points.

## Two facts about the residuals

Write $e_i = y_i - \hat{y}_i = (y_i - \bar{y}) - \hat{b}(x_i - \bar{x})$.

- **They add to zero.** $\sum e_i = 0 - \hat{b} \cdot 0 = 0$, because deviations from a mean
  add to zero.
- **They are uncorrelated with $x$.** $\sum (x_i - \bar{x})e_i = S_{xy} - \hat{b}S_{xx} = 0$
  because $\hat{b} = S_{xy}/S_{xx}$.

The second fact explains a feature of residual plots: after a least-squares fit, a residual
plot against $x$ never shows a straight-line tilt. Any pattern left over is a curve, a fan
or an unusual point. The two facts together also make the cross term above vanish, since each
$\hat{y}_i - \bar{y}$ is a multiple of $x_i - \bar{x}$.

## Why n − 2

Because the $n$ residuals must satisfy those two equations, only $n - 2$ of them can vary
freely: given any $n - 2$ residuals, the last two are forced. So the residuals carry $n - 2$
degrees of freedom, and

$$s = \sqrt{\frac{\text{SSE}}{n - 2}}.$$

This mirrors the $n - 1$ in the ordinary standard deviation, where one equation
($\sum(y_i - \bar{y}) = 0$) costs one degree of freedom. Combining with Step 4 gives a
shortcut from summary statistics:

$$\text{SSE} = (n - 1)s_y^2(1 - r^2).$$

### Example 3: s from summary statistics

A regression on $n = 20$ points has $s_y = 5$ and $r = 0.6$. Find SSE and $s$.

1. $\text{SST} = (n - 1)s_y^2 = 19 \times 25 = 475$.
2. $\text{SSE} = 475(1 - 0.36) = 304$.
3. $s = \sqrt{304/18} = \sqrt{16.89} \approx 4.11$.

Compare: $s_y = 5$ is the typical miss when predicting every $y$ by $\bar{y}$; using the line
cuts it to about 4.11. A correlation of 0.6 sounds strong, but it shrinks the typical error by
only about 18%.

## Why squares and not absolute values?

Minimizing $\sum |y_i - a - bx_i|$ instead gives the **least absolute deviations** line. It is
more resistant to outliers, much as the median is more resistant than the mean, and it is
used in robust statistics. But it has no simple formula (it is found by an algorithm), it can
have more than one best line, and it has no tidy decomposition like SST = SSR + SSE. Squares
give closed-form answers, a clean link to the mean and to $r$, and (as Gauss showed) the best
estimates when the errors are normal. That is why least squares became the standard, along
with its weakness: like the mean, it is pulled hard by outliers and influential points.

## Common mistakes

- Thinking the residuals add to zero for *any* line. They do only for lines through
  $(\bar{x}, \bar{y})$; the line $y = 3 + 0.6x$ in Example 1 has residuals adding to 1.0.
- Expecting the decomposition to hold point by point. Total = explained + residual holds for
  each point's deviations, but the *squares* add only after summing over all points.
- Mixing up SSR (regression) with SSE (residual), especially in books that use other letters.
- Dividing SSE by $n$ or $n - 1$ instead of $n - 2$.
- Believing $r^2 = 1 - \text{SSE}/\text{SST}$ holds for any line. It holds for the
  least-squares line; a worse line has a larger SSE.

## Key points

- The mean minimizes $\sum (d_i - c)^2$. For any slope, this puts the best line through
  $(\bar{x}, \bar{y})$.
- $\text{SSE}(b) = S_{xx}(b - S_{xy}/S_{xx})^2 + S_{yy} - S_{xy}^2/S_{xx}$, so the best slope is
  $S_{xy}/S_{xx} = r\,s_y/s_x$.
- $\text{SSE}_{\min} = \text{SST}(1 - r^2)$, which proves $r^2 = 1 - \text{SSE}/\text{SST}$ and $|r| \le 1$.
- $\text{SST} = \text{SSR} + \text{SSE}$ with $\text{SSR} = \hat{b}^2 S_{xx}$, and $r^2 = \text{SSR}/\text{SST}$.
- Residuals add to zero and are uncorrelated with $x$, so they have $n - 2$ degrees of freedom.
