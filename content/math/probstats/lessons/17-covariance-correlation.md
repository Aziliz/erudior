---
id: ps-covariance
module: ps-m4
title: Expectation, covariance and correlation
minutes: 35
topics: [Covariance and correlation]
drills: [ps-d-cov-table, ps-d-cov-triangle, ps-d-var-lincomb]
refs: [ps-ref-estimation]
---
## Summarizing how two variables move together

A joint distribution holds everything about a pair $(X, Y)$, but often we want a few numbers:
the average of some combination, and a measure of whether large values of $X$ tend to come
with large values of $Y$. This lesson extends expectation to functions of two variables, then
defines covariance and correlation and uses them to find the variance of a sum, the single
most used formula in the rest of the course.

## Expected value of $g(X, Y)$

The rule for one variable, $E[g(X)] = \int g(x) f(x)\,dx$, extends directly:

$$E[g(X, Y)] = \sum_x \sum_y g(x, y)\,p(x, y) \quad\text{or}\quad E[g(X, Y)] = \iint g(x, y)\,f(x, y)\,dA.$$

You never need the distribution of $g(X, Y)$ itself; weight each value by the joint
probability.

*Linearity.* Take $g(x, y) = ax + by$:

$$E[aX + bY] = \iint (ax + by) f\,dA = a\iint x f\,dA + b\iint y f\,dA = aE[X] + bE[Y],$$

because $\iint x f(x, y)\,dy\,dx = \int x f_X(x)\,dx$. Linearity holds *whether or not* $X$ and $Y$ are
independent.

*Products under independence.* If $X$ and $Y$ are independent, $f = f_X f_Y$ and the
double integral splits:

$$E[XY] = \int x f_X(x)\,dx \int y f_Y(y)\,dy = E[X]\,E[Y],$$

and more generally $E[g(X)h(Y)] = E[g(X)]\,E[h(Y)]$. Without independence, $E[XY]$ can be
anything compatible with the joint distribution.

## Covariance

The **covariance** of $X$ and $Y$, with means $\mu_X$ and $\mu_Y$, is

$$\operatorname{Cov}(X, Y) = E\big[(X - \mu_X)(Y - \mu_Y)\big] = E[XY] - \mu_X\mu_Y.$$

The second form comes from expanding the product and using linearity:
$E[XY] - \mu_Y E[X] - \mu_X E[Y] + \mu_X\mu_Y = E[XY] - \mu_X\mu_Y$.

The sign is the point. When $X$ is above its mean and $Y$ tends to be above its mean too,
$(X - \mu_X)(Y - \mu_Y)$ is usually positive, so the covariance is positive; when one tends to be
high while the other is low, it is negative.

The picture shows why. Dashed lines through the mean point split the plane into four quadrants. A point up and to the right of the mean point (or down and to the left) has a positive product of deviations: the area of its green rectangle counts as positive. A point in the other two quadrants contributes a negative product (the red rectangle). The covariance is the probability-weighted average of these signed areas.

![A scatter of points with dashed lines through the mean point; a green rectangle joins the mean point to a point up and to the right, and a red rectangle joins it to a point up and to the left; the quadrants are marked (+)(+) greater than 0, (−)(+) less than 0, (−)(−) greater than 0 and (+)(−) less than 0](images/ps-m4-cov-quadrants.svg)

Rules (all follow from linearity):

- $\operatorname{Cov}(X, X) = \operatorname{Var}(X)$ and $\operatorname{Cov}(X, Y) = \operatorname{Cov}(Y, X)$.
- $\operatorname{Cov}(aX + b,\; cY + d) = ac\,\operatorname{Cov}(X, Y)$: shifts do nothing, scales multiply.
- $\operatorname{Cov}(X + Y,\; W) = \operatorname{Cov}(X, W) + \operatorname{Cov}(Y, W)$ (bilinearity).
- Independent $\Rightarrow \operatorname{Cov}(X, Y) = E[X]E[Y] - \mu_X\mu_Y = 0$.

## Variance of a sum

Apply the rules to $\operatorname{Var}(aX + bY) = \operatorname{Cov}(aX + bY,\; aX + bY)$ and expand:

$$\operatorname{Var}(aX + bY) = a^2\operatorname{Var}(X) + b^2\operatorname{Var}(Y) + 2ab\operatorname{Cov}(X, Y).$$

For $n$ variables, $\operatorname{Var}\big(\sum a_i X_i\big) = \sum a_i^2 \operatorname{Var}(X_i) + 2\sum_{i<j} a_i a_j \operatorname{Cov}(X_i, X_j)$. If the
$X_i$ are independent (or merely uncorrelated), the cross terms vanish and *variances add*. This proves the rule, used since the discrete-distributions
module, that the variance of a sum of independent random variables is the sum of their variances.
In particular, for an iid sample with variance $\sigma^2$,

$$\operatorname{Var}(\bar X) = \frac{1}{n^2}\sum_{i=1}^{n}\operatorname{Var}(X_i) = \frac{\sigma^2}{n},$$

the fact behind every standard error later in the course.

## Correlation

Covariance has units (hours × passengers, say) and changes when you rescale, so its size is
hard to judge. The **correlation coefficient** removes the units:

$$\rho = \operatorname{Corr}(X, Y) = \frac{\operatorname{Cov}(X, Y)}{\sigma_X\,\sigma_Y}.$$

*Why $-1 \le \rho \le 1$.* Let $U = X/\sigma_X$ and $V = Y/\sigma_Y$, each with variance 1, so that
$\operatorname{Cov}(U, V) = \rho$. A variance is never negative, so

$$0 \le \operatorname{Var}(U \pm V) = 1 + 1 \pm 2\rho,$$

which gives $\rho \ge -1$ (with $+$) and $\rho \le 1$ (with $-$). Equality forces $\operatorname{Var}(U \pm V) = 0$,
so $U \pm V$ is a constant: $|\rho| = 1$ exactly when $Y = a + bX$ with probability 1, with $b$
having the sign of $\rho$. Correlation therefore measures *linear* association.

*Uncorrelated is not independent.* Let $X$ be $-1, 0, 1$ with probability $\tfrac13$ each, and
$Y = X^2$. Then $E[X] = 0$ and $E[XY] = E[X^3] = 0$, so $\operatorname{Cov}(X, Y) = 0$, yet $Y$ is a
function of $X$. The relationship is perfect but not linear, and covariance misses it.

```plot
{"x": [-1.5, 1.5], "y": [-0.3, 1.4], "xLabel": "x", "yLabel": "y", "functions": [{"f": "x^2", "dashed": true}], "points": [{"at": [-1, 1], "label": "(−1, 1)"}, {"at": [0, 0], "label": "(0, 0)"}, {"at": [1, 1], "label": "(1, 1)"}], "caption": "Y = X² with X uniform on {−1, 0, 1}: Y depends completely on X, yet Cov(X, Y) = 0"}
```

### Example 1: covariance from a table

Use the inspection table ($X$ = worn pads, $Y$ = wheel flat):

$$\begin{array}{c|cc} & y = 0 & y = 1 \\ \hline x = 0 & 0.30 & 0.10 \\ x = 1 & 0.20 & 0.15 \\ x = 2 & 0.10 & 0.15 \end{array}$$

1. Marginal means: $E[X] = 0(0.40) + 1(0.35) + 2(0.25) = 0.85$ and $E[Y] = 0.40$.
2. $E[XY]$: only cells with $x, y$ both nonzero contribute: $1 \cdot 1 \cdot 0.15 + 2 \cdot 1 \cdot 0.15 = 0.45$.
3. $\operatorname{Cov}(X, Y) = 0.45 - 0.85 \times 0.40 = 0.11$.
4. Variances: $E[X^2] = 0.35 + 4(0.25) = 1.35$, so $\operatorname{Var}(X) = 1.35 - 0.85^2 = 0.6275$; $Y$ is Bernoulli,
   so $\operatorname{Var}(Y) = 0.4 \times 0.6 = 0.24$.
5. $\rho = 0.11 / \sqrt{0.6275 \times 0.24} \approx 0.11/0.3881 \approx 0.283$.

A modest positive association: more worn pads go with more flats.

### Example 2: covariance from a density

For $f(x, y) = 8xy$ on $0 < y < x < 1$, find $\operatorname{Cov}(X, Y)$.

1. From the marginals $f_X = 4x^3$ and $f_Y = 4y(1 - y^2)$: $E[X] = \int_0^1 4x^4\,dx = \tfrac45$ and
   $E[Y] = \int_0^1 (4y^2 - 4y^4)\,dy = \tfrac43 - \tfrac45 = \tfrac{8}{15}$.
2. $E[XY]$ needs the joint density:
   $E[XY] = \int_0^1\int_0^x xy \cdot 8xy\,dy\,dx = \int_0^1 8x^2 \cdot \dfrac{x^3}{3}\,dx = \dfrac{8}{18} = \dfrac49.$
3. $\operatorname{Cov}(X, Y) = \tfrac49 - \tfrac45 \cdot \tfrac8{15} = \tfrac{100 - 96}{225} = \tfrac{4}{225} \approx 0.0178.$

Positive, as the triangle suggests: a large $X$ leaves room for a large $Y$. (With
$\operatorname{Var}(X) = \tfrac{2}{75}$ and $\operatorname{Var}(Y) = \tfrac{11}{225}$, $\rho \approx 0.49$.)

### Example 3: sums and differences

Delays on two consecutive line sections have SDs $\sigma_X = 3$ and $\sigma_Y = 4$ minutes and
correlation $\rho = 0.5$ (bad weather affects both). Find the SDs of the total delay $X + Y$ and of
the difference $X - Y$.

1. $\operatorname{Cov}(X, Y) = \rho\sigma_X\sigma_Y = 0.5 \times 3 \times 4 = 6$.
2. $\operatorname{Var}(X + Y) = 9 + 16 + 2(6) = 37$, SD $\approx 6.08$.
3. $\operatorname{Var}(X - Y) = 9 + 16 - 2(6) = 13$, SD $\approx 3.61$.

Positive correlation makes totals *more* variable than the independent value $\sqrt{25} = 5$,
and differences *less* variable. Note that SDs never add: even with $\rho = 1$, $\sqrt{9 + 16 + 24} = 7 = 3 + 4$
is the largest possible.

## Common mistakes

- *Subtracting variances for a difference.* $\operatorname{Var}(X - Y) = \operatorname{Var}X + \operatorname{Var}Y - 2\operatorname{Cov}$;
  for independent variables both sums and differences *add* variances.
- *Forgetting to square constants.* $\operatorname{Var}(2X) = 4\operatorname{Var}(X)$, and $\operatorname{Cov}(2X, 3Y) = 6\operatorname{Cov}(X, Y)$.
- *Using $E[XY] = E[X]E[Y]$ without independence.* It is true exactly when the covariance is 0.
- *Reading $\rho = 0$ as "no relationship".* It means no *linear* relationship.
- *Computing $E[XY]$ from the marginals.* It needs the joint distribution.

## Key points

- $E[g(X, Y)] = \iint g f\,dA$ (or a double sum); expectation is always linear.
- $\operatorname{Cov}(X, Y) = E[XY] - E[X]E[Y]$; independent $\Rightarrow$ covariance 0, not conversely.
- $\operatorname{Var}(aX + bY) = a^2\operatorname{Var}X + b^2\operatorname{Var}Y + 2ab\operatorname{Cov}(X, Y)$.
- iid: $\operatorname{Var}(\bar X) = \sigma^2/n$.
- $\rho = \operatorname{Cov}/(\sigma_X\sigma_Y) \in [-1, 1]$; $|\rho| = 1$ iff $Y$ is a linear function of $X$.
