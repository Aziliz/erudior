---
id: ps-m8-h-multiple-regression
module: ps-m8
title: 'Honors: Multiple regression in matrix form'
minutes: 50
honors: true
topics: [Multiple regression]
drills: [ps-m8-r2-two-predictor-fit, ps-m8-r2-coef-test, ps-m8-r2-adj-r2-f]
refs: [ps-ref-testing]
---
## From one predictor to several

The simple linear regression lesson fitted $y$ against a single $x$ and needed $S_{xx}$, $S_{xy}$ and a
handful of formulas. Real responses depend on several things at once: rail wear depends on
traffic *and* on track curvature, stopping distance on speed *and* on grade. Writing a separate
formula for every number of predictors would be hopeless. Matrices give one formula that covers
them all, and they make the geometry of least squares visible: the fitted values are a
projection, and the residuals are what is left over at right angles. This lesson builds that
machinery, re-derives the simple regression results as a special case, and adds the new issues
that only appear with several predictors.

## The model in matrix form

The **multiple linear regression model** with $k$ predictors is

$$Y_i = \beta_0 + \beta_1x_{i1} + \cdots + \beta_kx_{ik} + \varepsilon_i, \qquad \varepsilon_i \text{ i.i.d. } N(0, \sigma^2).$$

Stack the $n$ equations. The **design matrix** $\mathbf{X}$ is $n \times p$ with $p = k + 1$: a first
column of ones (for the intercept) and one column per predictor. Then

$$\mathbf{Y} = \mathbf{X}\boldsymbol\beta + \boldsymbol\varepsilon, \qquad \boldsymbol\varepsilon \sim N(\mathbf{0}, \sigma^2\mathbf{I}).$$

We assume the columns of $\mathbf{X}$ are linearly independent (no predictor is an exact linear
combination of the others), so $\mathbf{X}^\top\mathbf{X}$ is invertible. In simple regression this is the
familiar requirement that the $x_i$ are not all equal.

## Least squares and the normal equations

Least squares minimizes $Q(\mathbf{b}) = (\mathbf{y} - \mathbf{X}\mathbf{b})^\top(\mathbf{y} - \mathbf{X}\mathbf{b})$. Expanding,
$Q = \mathbf{y}^\top\mathbf{y} - 2\mathbf{b}^\top\mathbf{X}^\top\mathbf{y} + \mathbf{b}^\top\mathbf{X}^\top\mathbf{X}\mathbf{b}$, and setting the gradient
$-2\mathbf{X}^\top\mathbf{y} + 2\mathbf{X}^\top\mathbf{X}\mathbf{b}$ to zero gives the normal equations

$$\mathbf{X}^\top\mathbf{X}\,\mathbf{b} = \mathbf{X}^\top\mathbf{y}, \qquad \text{so} \qquad \mathbf{b} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}.$$

These are the same two equations you met before, now one per coefficient. Row $j$ of
$\mathbf{X}^\top(\mathbf{y} - \mathbf{X}\mathbf{b}) = \mathbf{0}$ says $\sum_i x_{ij}e_i = 0$: the residual vector is orthogonal to every
column of $\mathbf{X}$, including the column of ones, so the residuals still sum to zero.

## The geometry: a projection

Think of $\mathbf{y}$ as one point in $n$-dimensional space. As $\mathbf{b}$ varies, $\mathbf{X}\mathbf{b}$ sweeps out the
**column space** of $\mathbf{X}$, a flat $p$-dimensional subspace. Least squares picks the point of that
subspace closest to $\mathbf{y}$, and the closest point is the foot of the perpendicular. That is why the
residual is orthogonal to the columns.

![An arrow from the origin O to the data vector y rises above a shaded plane, the column space of X. A dashed red arrow, the residual e = y − ŷ, drops straight down from the tip of y to the point ŷ = Hy in the plane and meets it at a right angle. A second arrow runs from O to ŷ inside the plane.](images/ps-m8-projection.svg)

The fitted values are $\hat{\mathbf{y}} = \mathbf{X}\mathbf{b} = \mathbf{H}\mathbf{y}$, where

$$\mathbf{H} = \mathbf{X}(\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top$$

is the **hat matrix** (it puts the hat on $\mathbf{y}$). It is symmetric and idempotent ($\mathbf{H}\mathbf{H} = \mathbf{H}$:
projecting twice changes nothing), and the residuals are $\mathbf{e} = (\mathbf{I} - \mathbf{H})\mathbf{y}$. Its trace is
$\operatorname{tr}\mathbf{H} = \operatorname{tr}\big((\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{X}\big) = \operatorname{tr}\mathbf{I}_p = p$, which is where the
degrees of freedom come from: fitted values live in $p$ dimensions, residuals in the other $n - p$.

### Example 1: simple regression is the case $p = 2$

Take the rail-wear data of the simple regression lesson ($x = 2, 4, \dots, 12$). Then
$\sum x_i = 42$, $\sum x_i^2 = 364$, $\sum y_i = 39$ and $\sum x_iy_i = 319.4$, so

$$\mathbf{X}^\top\mathbf{X} = \begin{bmatrix} 6 & 42 \\ 42 & 364 \end{bmatrix}, \qquad \mathbf{X}^\top\mathbf{y} = \begin{bmatrix} 39 \\ 319.4 \end{bmatrix}.$$

1. The determinant is $6(364) - 42^2 = 420$, which is $n S_{xx} = 6(70)$.
2. $(\mathbf{X}^\top\mathbf{X})^{-1} = \dfrac{1}{420}\begin{bmatrix} 364 & -42 \\ -42 & 6 \end{bmatrix}$.
3. $\mathbf{b} = \dfrac{1}{420}\begin{bmatrix} 364(39) - 42(319.4) \\ -42(39) + 6(319.4) \end{bmatrix} = \dfrac{1}{420}\begin{bmatrix} 781.2 \\ 278.4 \end{bmatrix} = \begin{bmatrix} 1.860 \\ 0.6629 \end{bmatrix}$,
   the same line as before.
4. The lower-right entry of the inverse is $6/420 = 1/70 = 1/S_{xx}$, matching $\operatorname{Var}(b_1) = \sigma^2/S_{xx}$.

## Sampling distribution of $\mathbf{b}$

Since $\mathbf{b} = \mathbf{A}\mathbf{Y}$ with the fixed matrix $\mathbf{A} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top$, and $\mathbf{A}\mathbf{X} = \mathbf{I}$,

$$E(\mathbf{b}) = \mathbf{A}\mathbf{X}\boldsymbol\beta = \boldsymbol\beta, \qquad \operatorname{Cov}(\mathbf{b}) = \mathbf{A}(\sigma^2\mathbf{I})\mathbf{A}^\top = \sigma^2(\mathbf{X}^\top\mathbf{X})^{-1}.$$

Write $c_{jj}$ for the $j$th diagonal entry of $(\mathbf{X}^\top\mathbf{X})^{-1}$, so $\operatorname{Var}(b_j) = \sigma^2c_{jj}$. The
error variance is estimated by

$$s^2 = \frac{\text{SSE}}{n - p}, \qquad \text{SSE} = \mathbf{e}^\top\mathbf{e},$$

and, stated here without the full proof, $\text{SSE}/\sigma^2 \sim \chi^2_{n-p}$ independently of $\mathbf{b}$. Hence

$$T_j = \frac{b_j - \beta_j}{s\sqrt{c_{jj}}} \sim t_{n-p},$$

which gives tests of $H_0: \beta_j = 0$ and intervals $b_j \pm t_{\alpha/2,\, n-p}\, s\sqrt{c_{jj}}$.

**Gauss–Markov in one line.** Any other linear unbiased estimator can be written
$(\mathbf{A} + \mathbf{D})\mathbf{Y}$; unbiasedness for every $\boldsymbol\beta$ forces $\mathbf{D}\mathbf{X} = \mathbf{0}$, so the cross terms vanish and
its covariance is $\sigma^2(\mathbf{X}^\top\mathbf{X})^{-1} + \sigma^2\mathbf{D}\mathbf{D}^\top$. The extra $\mathbf{D}\mathbf{D}^\top$ is positive
semidefinite, so no linear unbiased estimator beats least squares, coefficient by coefficient.
(Gauss proved the result in the 1820s. Markov's name was attached in the twentieth century, an
attribution that historians of statistics have questioned.)

## What a coefficient means

$b_j$ estimates the change in mean response per unit of $x_j$ **with the other predictors held
fixed**. That can differ a lot from the slope of $y$ on $x_j$ alone, because when predictors are
correlated, a simple regression lets $x_j$ take credit for its partners.

### Example 2: wear, traffic and curvature

Six sites give traffic $x_1$, curvature class $x_2$ and wear $y$ (mm):

| $x_1$ | 2 | 4 | 6 | 8 | 10 | 12 |
|---|---|---|---|---|---|---|
| $x_2$ | 1 | 3 | 0 | 2 | 3 | 3 |
| $y$ | 3.4 | 5.6 | 5.0 | 7.0 | 10.2 | 10.0 |

Centering the predictors separates the intercept: $b_0 = \bar y - b_1\bar x_1 - b_2\bar x_2$, and the two
slopes solve a 2 by 2 system built from centered sums of squares and products.

1. *Means.* $\bar x_1 = 7$, $\bar x_2 = 2$, $\bar y = 6.8667$.
2. *Centered sums.* $S_{11} = 70$, $S_{22} = 8$, $S_{12} = 12$, $S_{1y} = 48.8$, $S_{2y} = 12.4$, $S_{yy} = 38.053$.
3. *Solve* $\begin{bmatrix} 70 & 12 \\ 12 & 8 \end{bmatrix}\begin{bmatrix} b_1 \\ b_2 \end{bmatrix} = \begin{bmatrix} 48.8 \\ 12.4 \end{bmatrix}$. The determinant is $70(8) - 12^2 = 416$, so
   $b_1 = \dfrac{8(48.8) - 12(12.4)}{416} = \dfrac{241.6}{416} = 0.5808$ and $b_2 = \dfrac{70(12.4) - 12(48.8)}{416} = \dfrac{282.4}{416} = 0.6788$.
4. *Intercept.* $b_0 = 6.8667 - 0.5808(7) - 0.6788(2) = 1.4436$.
5. *Error.* $\text{SSE} = S_{yy} - b_1S_{1y} - b_2S_{2y} = 1.2941$ on $n - p = 3$ df, so $s^2 = 0.4314$ and $s = 0.6568$.
6. *Standard errors.* For two predictors, $c_{11} = S_{22}/416 = 0.01923$ and $c_{22} = S_{11}/416 = 0.1683$. So
   $\text{SE}(b_1) = 0.6568\sqrt{0.01923} = 0.0911$ and $\text{SE}(b_2) = 0.6568\sqrt{0.1683} = 0.2694$.
7. *Tests.* $t_1 = 6.38$ ($p = 0.008$) and $t_2 = 2.52$ ($p = 0.086$) on 3 df, against $t_{0.025,3} = 3.182$.

Traffic matters clearly; curvature's effect is positive but not established with six sites.
Regressing $y$ on traffic alone gives slope $S_{1y}/S_{11} = 0.697$, larger than $b_1 = 0.581$: the
busier sites here also happen to be more curved, and the simple slope absorbs part of the curvature effect.

## $R^2$, adjusted $R^2$ and the overall $F$ test

$\text{SST} = \text{SSR} + \text{SSE}$ still holds (the orthogonality of $\mathbf{e}$ and $\hat{\mathbf{y}} - \bar y\mathbf{1}$ kills the cross
term), and $R^2 = 1 - \text{SSE}/\text{SST}$. But $R^2$ can never fall when a predictor is added, even a
useless one, because least squares can always set its coefficient to zero. The
**adjusted $R^2$** charges for each parameter:

$$R^2_{\text{adj}} = 1 - \frac{\text{SSE}/(n - p)}{\text{SST}/(n - 1)}.$$

The **overall $F$ test** of $H_0: \beta_1 = \cdots = \beta_k = 0$ uses

$$F = \frac{\text{SSR}/(p - 1)}{\text{SSE}/(n - p)} \sim F_{p-1,\, n-p} \text{ under } H_0.$$

In Example 2, $\text{SST} = 38.053$, so $R^2 = 1 - 1.2941/38.053 = 0.966$, $R^2_{\text{adj}} = 1 - (1.2941/3)/(38.053/5) = 0.943$,
and $F = (36.759/2)/0.4314 = 42.6$ on (2, 3) df, $p = 0.006$.

## Multicollinearity and leverage

With two predictors, $c_{11} = S_{22}/(S_{11}S_{22} - S_{12}^2)$, which simplifies to

$$\operatorname{Var}(b_1) = \frac{\sigma^2}{S_{11}(1 - r_{12}^2)},$$

where $r_{12}$ is the correlation between the two predictors. The factor $1/(1 - r_{12}^2)$ is the
**variance inflation factor** (VIF); with more predictors, $r_{12}^2$ becomes the $R^2$ from regressing $x_j$
on all the other predictors. **Multicollinearity** (strongly correlated predictors) makes VIFs large,
so individual coefficients are poorly determined even when the fit as a whole is good. In Example 2,
$r_{12} = 12/\sqrt{70 \cdot 8} = 0.507$ and the VIF is $1/(1 - 0.257) = 1.35$: mild.

The diagonal entries $h_{ii}$ of the hat matrix are the **leverages**. Since $\hat y_i = \sum_j h_{ij}y_j$,
$h_{ii}$ measures how much $y_i$ pulls on its own fitted value, and $\operatorname{Var}(e_i) = \sigma^2(1 - h_{ii})$.
Leverages lie between 0 and 1 and sum to $p$, so their average is $p/n$; a common rule of thumb
flags $h_{ii} > 2p/n$.

### Example 3: one far-out site

In simple regression $h_{ii} = \dfrac1n + \dfrac{(x_i - \bar x)^2}{S_{xx}}$. For the six sites of Example 1 the
leverages are 0.524, 0.295, 0.181, 0.181, 0.295, 0.524, summing to 2. Add a seventh site at $x = 30$.
Now $\bar x = 10.286$, $S_{xx} = 523.43$, and the new site has

$$h = \frac17 + \frac{(30 - 10.286)^2}{523.43} = 0.143 + 0.743 = 0.885,$$

far above $2p/n = 4/7 = 0.571$. Its residual has variance only $0.115\sigma^2$: the line is forced to
pass close to that one point, so a mistake there would hardly show in its residual. High leverage
is not the same as being wrong, but such points deserve a second look.

## Common mistakes

- Reading $b_j$ as the effect of $x_j$ alone; it is the effect with the other predictors held fixed.
- Using $n - 2$ degrees of freedom out of habit; with $p$ coefficients it is $n - p$.
- Choosing between models by $R^2$; it always favors the bigger model. Use adjusted $R^2$, $F$ tests or held-out data.
- Concluding a predictor is useless because its $t$ test is not significant when it is highly correlated with another predictor.
- Dropping the column of ones from $\mathbf{X}$ (forcing the fit through the origin) without meaning to.
- Treating a point with a small residual as harmless; a high-leverage point can drag the fit toward itself.

## Key points

- $\mathbf{Y} = \mathbf{X}\boldsymbol\beta + \boldsymbol\varepsilon$; least squares solves $\mathbf{X}^\top\mathbf{X}\mathbf{b} = \mathbf{X}^\top\mathbf{y}$, so $\mathbf{b} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$.
- $\hat{\mathbf{y}} = \mathbf{H}\mathbf{y}$ is the orthogonal projection of $\mathbf{y}$ onto the column space; residuals are orthogonal to every column.
- $\operatorname{Cov}(\mathbf{b}) = \sigma^2(\mathbf{X}^\top\mathbf{X})^{-1}$; $s^2 = \text{SSE}/(n - p)$; $(b_j - \beta_j)/(s\sqrt{c_{jj}}) \sim t_{n-p}$.
- Adjusted $R^2$ and the overall $F = \dfrac{\text{SSR}/(p-1)}{\text{SSE}/(n-p)}$ account for the number of parameters.
- Correlated predictors inflate variances by the VIF $1/(1 - R_j^2)$; leverages $h_{ii}$ sum to $p$ and flag influential $x$ positions.
