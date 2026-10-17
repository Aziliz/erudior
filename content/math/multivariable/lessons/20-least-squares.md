---
id: mv-least-squares
module: mv-m4
title: Least squares fitting
minutes: 35
topics: [Least squares]
drills: [mv-d-ls-points, mv-d-ls-sums, mv-d-ls-origin]
refs: [mv-ref-differential]
---
## The best line through scattered data

Measured data almost never falls exactly on a line. A sensor's reading drifts upward with
temperature, test scores rise with study time, a spring stretches with load, but the points
scatter around any line you draw. Which line is the *best* one? This lesson turns that
question into an optimization problem in two variables, the slope and the intercept, and
solves it with exactly the tools of Lesson 17: set both partial derivatives to zero, then
confirm the critical point is a minimum. The result, the **method of least squares**, is
the most widely used fitting method in science, engineering and statistics.

Throughout, the data are $n$ points $(x_1, y_1), \dots, (x_n, y_n)$, and $\sum$ means the
sum over $i = 1$ to $n$.

## Residuals and the error to minimize

Suppose we try the line $y = mx + b$. At the data value $x_i$ it predicts $mx_i + b$, while
the data say $y_i$. The difference

$$e_i = y_i - (mx_i + b)$$

is the **residual** of the $i$-th point: observed minus predicted, the vertical gap between
the point and the line. A good line makes all the residuals small at once. We measure the
total misfit with the **sum of squared errors**

$$S(m, b) = \sum\left(y_i - mx_i - b\right)^2.$$

The data are fixed numbers; the unknowns are $m$ and $b$. So $S$ is an ordinary function of
two variables, and the **least squares line** is the line whose $(m, b)$ minimizes it.

Why square the residuals? Simply adding them fails: positive and negative residuals cancel,
and many bad lines have a residual sum of zero. Absolute values avoid cancellation, but
$|e|$ has a corner at 0, so the partial derivatives do not always exist. Squares are
never negative, are smooth, and (as we are about to see) lead to *linear* equations for $m$
and $b$. One side effect: squaring penalizes large residuals heavily, so a single far-off
point (an outlier) can pull the line noticeably.

```plot
{"x": [-0.5, 3.8], "y": [-0.3, 5], "functions": [{"f": "x + 1.5", "label": "y = x + 1.5"}], "points": [{"at": [0, 1], "label": "(0, 1)"}, {"at": [1, 3], "label": "(1, 3)"}, {"at": [2, 4], "label": "(2, 4)"}, {"at": [3, 4], "label": "(3, 4)"}], "segments": [{"from": [0, 1], "to": [0, 1.5], "dashed": true}, {"from": [1, 3], "to": [1, 2.5], "dashed": true}, {"from": [2, 4], "to": [2, 3.5], "dashed": true}, {"from": [3, 4], "to": [3, 4.5], "dashed": true}], "caption": "Residuals are the vertical gaps (dashed) between the data and the line; least squares minimizes the sum of their squares"}
```

Notice the residuals are *vertical* distances, not perpendicular ones. That matches how the
line is used: it predicts $y$ from $x$, so the error that matters is the error in $y$.

## Setting the partial derivatives to zero

Differentiate $S$ term by term with the chain rule. The inside of each square is
$y_i - mx_i - b$, whose derivative is $-x_i$ with respect to $m$ and $-1$ with respect to $b$:

$$S_m = -2\sum x_i\left(y_i - mx_i - b\right),\qquad S_b = -2\sum\left(y_i - mx_i - b\right).$$

Setting both to zero, dividing by $-2$ and splitting the sums (note $\sum b = nb$, since $b$
is added $n$ times) gives the **normal equations**:

$$\begin{aligned} m\sum x_i^2 + b\sum x_i &= \sum x_iy_i,\\ m\sum x_i + nb &= \sum y_i. \end{aligned}$$

This is a linear system in $m$ and $b$ whose coefficients are just five sums computed from
the data: $n$, $\sum x_i$, $\sum y_i$, $\sum x_i^2$, $\sum x_iy_i$. Solving it (for example by
elimination) gives

$$m = \frac{n\sum x_iy_i - \sum x_i\sum y_i}{n\sum x_i^2 - \left(\sum x_i\right)^2},\qquad b = \frac{\sum y_i - m\sum x_i}{n}.$$

The second normal equation has a neat meaning. Divided by $n$ it says
$\bar y = m\bar x + b$, where $\bar x$ and $\bar y$ are the means of the data: *the least
squares line passes through the point of means* $(\bar x, \bar y)$. It also says
$\sum e_i = 0$: the residuals of the best line balance out exactly.

## Why the critical point is the minimum

The second partials of $S$ are constants:
$S_{mm} = 2\sum x_i^2$, $S_{bb} = 2n$, $S_{mb} = 2\sum x_i$. The discriminant is

$$D = S_{mm}S_{bb} - S_{mb}^2 = 4\left[n\sum x_i^2 - \left(\sum x_i\right)^2\right] = 4n\sum\left(x_i - \bar x\right)^2.$$

(The last step uses $\sum(x_i - \bar x)^2 = \sum x_i^2 - n\bar x^2$.) A sum of squares is
positive unless every $x_i$ equals $\bar x$. So as long as the $x$-values are not all equal,
$D > 0$ and $S_{mm} > 0$, and the critical point is a local minimum.

It is in fact the absolute minimum over all $(m, b)$, even though the domain is the whole
unbounded plane (where Lesson 18's closed-region method does not apply). The reason: $S$
is a quadratic polynomial, so its second-degree Taylor expansion at the critical point is
not an approximation but an identity. $S$ equals its minimum value plus a quadratic in the
displacements that is positive whenever $D > 0$ and $S_{mm} > 0$. The graph of $S$ is an
upward bowl, and its level curves are ellipses around the best $(m, b)$.

If all the $x_i$ are equal, the points stack on one vertical line, $D = 0$, and no
non-vertical line is singled out: infinitely many $(m, b)$ tie.

### Example 1

Find the least squares line for $(0, 1)$, $(1, 3)$, $(2, 4)$, $(3, 4)$.

1. Sums: $n = 4$, $\sum x_i = 6$, $\sum y_i = 12$, $\sum x_i^2 = 0 + 1 + 4 + 9 = 14$, $\sum x_iy_i = 0 + 3 + 8 + 12 = 23$.
2. Normal equations: $14m + 6b = 23$ and $6m + 4b = 12$.
3. The second gives $b = 3 - \tfrac32m$. Substitute: $14m + 18 - 9m = 23$, so $5m = 5$ and $m = 1$. Then $b = \tfrac32$.
4. The line is $y = x + 1.5$. Check: it passes through the means $(\bar x, \bar y) = (1.5, 3)$, since $1.5 + 1.5 = 3$.
5. Residuals: $1 - 1.5 = -0.5$, $3 - 2.5 = 0.5$, $4 - 3.5 = 0.5$, $4 - 4.5 = -0.5$. They sum to 0, and the minimum error is $S = 4(0.25) = 1$.
6. Second-derivative test: $D = 4(4\cdot14 - 36) = 80 > 0$ and $S_{mm} = 28 > 0$, a minimum.

Expanding $S$ for this data gives $S(m, b) = 14m^2 + 12mb + 4b^2 - 46m - 24b + 42$. Its
level curves are the ellipses below, nested around the minimum point $(1, 1.5)$, where $S = 1$.

```plot
{"x": [-0.6, 3], "y": [-1.5, 4.3], "equal": true, "xLabel": "m", "yLabel": "b", "curves": [{"x": "1+0.3889*cos(t)-0.2209*sin(t)", "y": "1.5-0.8302*cos(t)-0.1035*sin(t)", "t": [0, "2pi"]}, {"x": "1+0.7777*cos(t)-0.4417*sin(t)", "y": "1.5-1.6605*cos(t)-0.2069*sin(t)", "t": [0, "2pi"]}, {"x": "1+1.1666*cos(t)-0.6626*sin(t)", "y": "1.5-2.4907*cos(t)-0.3104*sin(t)", "t": [0, "2pi"]}], "points": [{"at": [1, 1.5], "label": "min"}], "labels": [{"at": [1.42, 0.42], "text": "S = 2"}, {"at": [1.82, -0.42], "text": "S = 5"}, {"at": [2.2, -1.28], "text": "S = 10"}], "caption": "Level curves of the error S(m, b) for Example 1: ellipses around the best slope and intercept"}
```

### Example 2: centering the data

Five students report hours of study $x$ and exam score $y$: $(1, 52)$, $(2, 55)$, $(3, 61)$,
$(4, 64)$, $(5, 68)$. Fit a least squares line and predict the score after 6 hours.

1. Means: $\bar x = 3$ and $\bar y = 300/5 = 60$.
2. A useful shortcut: subtracting the means first does not change the slope, and the formula becomes $m = \dfrac{\sum(x_i - \bar x)(y_i - \bar y)}{\sum(x_i - \bar x)^2}$. (It is the formula for $m$ above with numerator and denominator divided by $n$.)
3. Deviations: $x_i - \bar x = -2, -1, 0, 1, 2$ and $y_i - \bar y = -8, -5, 1, 4, 8$.
4. Products: $16 + 5 + 0 + 4 + 16 = 41$. Squares of $x$-deviations: $4 + 1 + 0 + 1 + 4 = 10$. So $m = 4.1$.
5. The line passes through $(3, 60)$: $b = 60 - 4.1(3) = 47.7$. The line is $y = 4.1x + 47.7$.
6. Prediction at $x = 6$: $4.1(6) + 47.7 = 72.3$.

Check with the raw formula: $\sum x_iy_i = 941$ and $\sum x_i^2 = 55$, so
$m = \dfrac{5(941) - 15(300)}{5(55) - 15^2} = \dfrac{205}{50} = 4.1$, the same. A
prediction at $x = 6$, just past the data, is reasonable; one at $x = 40$ would not be, since
nothing says the trend continues that far.

## Other models, same method

The method works for any model whose unknown coefficients appear linearly. Every
coefficient gives one partial derivative, and every equation is linear.

- **A line through the origin**, $y = kx$ (physics often demands this, as in Hooke's law). Now $S(k) = \sum(y_i - kx_i)^2$ has one variable, and $S'(k) = -2\sum x_i(y_i - kx_i) = 0$ gives $k = \dfrac{\sum x_iy_i}{\sum x_i^2}$.
- **A parabola** $y = c_0 + c_1x + c_2x^2$: three partials, three linear normal equations.
- **A plane** $z = ax + by + c$ fitted to points $(x_i, y_i, z_i)$: three unknowns, three normal equations. (In linear algebra the general system is written $A^{\mathsf T}A\,\mathbf c = A^{\mathsf T}\mathbf y$.)

### Example 3: a spring constant

A spring stretched $x = 1, 2, 3, 4$ cm needs forces $F = 1, 4, 6, 9$ N. Hooke's law says
$F = kx$ with no intercept. Find the least squares $k$.

1. $\sum x_iF_i = 1 + 8 + 18 + 36 = 63$ and $\sum x_i^2 = 1 + 4 + 9 + 16 = 30$.
2. $k = 63/30 = 2.1$ N/cm. Since $S''(k) = 2\sum x_i^2 > 0$, this is the minimum.

The ratio of sums, $\sum F_i/\sum x_i = 20/10 = 2$, is a tempting shortcut but is not the
least squares answer: the correct formula weights each point by its $x_i$.

## Common mistakes

- Writing $b$ instead of $nb$ in the second normal equation; the constant $b$ is summed $n$ times.
- Confusing $\sum x_i^2$ (square, then add) with $\left(\sum x_i\right)^2$ (add, then square).
- Dropping the chain-rule factor $x_i$ in $S_m$; without it both equations say the same thing.
- Minimizing the plain sum of residuals, which cancel; every line through $(\bar x, \bar y)$ makes it zero.
- Measuring perpendicular distances to the line instead of vertical residuals.
- Trusting predictions far outside the range of the data.

## Key points

- Residual: $e_i = y_i - (mx_i + b)$. Least squares minimizes $S(m, b) = \sum e_i^2$.
- $S_m = 0$ and $S_b = 0$ give the normal equations $m\sum x_i^2 + b\sum x_i = \sum x_iy_i$ and $m\sum x_i + nb = \sum y_i$.
- The best line passes through $(\bar x, \bar y)$, and its residuals sum to zero.
- $D = 4n\sum(x_i - \bar x)^2 > 0$ unless all $x_i$ are equal, so the critical point is the absolute minimum.
- Any model linear in its coefficients (line through the origin, parabola, plane) is fitted the same way.
