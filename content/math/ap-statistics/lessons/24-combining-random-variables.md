---
id: stat-combining-rv
module: stat-m6
title: Transforming and combining random variables
minutes: 30
topics: [Combining random variables]
drills: [stat-linear-rv, stat-combine-rv]
refs: [stat-ref-probability]
---
## Building new random variables

Total trip time is loading time plus travel time. Profit is revenue minus cost. A score
in points is converted to a percentage. Each is a random variable built from others. This
lesson gives the rules for the mean and standard deviation of such combinations — rules
that underlie every two-sample inference procedure later in the course.

*AP exam scope:* the AP Statistics framework that took effect in the 2026–27 school year
dropped "combining random variables" as a separate topic. The rule that variances add for
independent variables is still the reason behind the standard errors of $\hat{p}_1 - \hat{p}_2$
and $\bar{x}_1 - \bar{x}_2$ on the AP formula sheet, so the main idea of this lesson is still
used in Module 7.

## Linear transformations

For $Y = a + bX$, exactly as with data in Module 2:

$$\mu_Y = a + b\mu_X, \qquad \sigma_Y = |b|\,\sigma_X, \qquad \sigma_Y^2 = b^2\sigma_X^2.$$

Adding $a$ shifts the distribution without changing its spread; multiplying by $b$ scales
both center and spread. Shape is unchanged.

### Example 1

The number of defects per weld $X$ has $\mu_X = 0.75$ and $\sigma_X \approx 0.887$. Each
defect costs \$40 to repair, plus a fixed \$25 inspection fee per weld: $C = 25 + 40X$.

- $\mu_C = 25 + 40(0.75) = \$55$.
- $\sigma_C = 40(0.887) \approx \$35.50$ (the \$25 doesn't affect spread).

## Sums and differences

For any two random variables,

$$\mu_{X+Y} = \mu_X + \mu_Y, \qquad \mu_{X-Y} = \mu_X - \mu_Y.$$

Means always combine the obvious way. Variances are subtler. If $X$ and $Y$ are
**independent**,

$$\sigma_{X+Y}^2 = \sigma_X^2 + \sigma_Y^2 \qquad\text{and}\qquad \sigma_{X-Y}^2 = \sigma_X^2 + \sigma_Y^2.$$

Two points deserve emphasis:

1. *Variances add, standard deviations don't*. $\sigma_{X+Y} = \sqrt{\sigma_X^2 + \sigma_Y^2}$,
   which is less than $\sigma_X + \sigma_Y$. (Think Pythagorean theorem: independent sources of
   variation combine like perpendicular sides of a triangle.)
2. *Variances add even for differences*. $X - Y = X + (-1)Y$, and multiplying by $-1$
   leaves the variance unchanged: $(-1)^2\sigma_Y^2 = \sigma_Y^2$. Subtracting a random
   quantity adds uncertainty; it can't cancel it.

Why independence is needed: if $X$ and $Y$ tend to move together (positively correlated),
their sum varies *more* than independent variables would; if they move oppositely, less.
The general formula is $\sigma_{X \pm Y}^2 = \sigma_X^2 + \sigma_Y^2 \pm 2\rho\,\sigma_X\sigma_Y$, where
$\rho$ is the correlation; independence makes $\rho = 0$.

### Example 2

A freight shipment's loading time $X$ has mean 12 min and SD 3 min; travel time $Y$ has mean
30 min and SD 4 min; they are independent. Find the mean and SD of total time $T = X + Y$
and of the difference $D = Y - X$.

1. $\mu_T = 12 + 30 = 42$ min; $\sigma_T = \sqrt{3^2 + 4^2} = \sqrt{25} = 5$ min. (Not 7.)
2. $\mu_D = 30 - 12 = 18$ min; $\sigma_D = \sqrt{9 + 16} = 5$ min. (Not 1.)

## Sums of identical copies vs. multiplying by n

Let $X_1, X_2, X_3$ be three *independent* bags of flour, each with mean 320 g and SD 25 g,
and let $T = X_1 + X_2 + X_3$. Then $\mu_T = 960$ g and

$$\sigma_T = \sqrt{25^2 + 25^2 + 25^2} = 25\sqrt{3} \approx 43.3 \text{ g}.$$

Compare $3X$ (one bag's weight tripled): $\sigma_{3X} = 3 \times 25 = 75$ g. Three independent
bags partly offset each other's errors; one bag counted three times does not. In general,
for $n$ independent copies, $\sigma_{\text{sum}} = \sqrt{n}\,\sigma$ — the root of the
square-root laws in sampling distributions (Module 7).

## Combining normal random variables

If $X$ and $Y$ are independent and *normally* distributed, then $X + Y$ and $X - Y$ are also
normal. (Any linear combination of independent normals is normal.) So once you have the
mean and SD, you can find probabilities with z-scores.

### Example 3

Ann's commute is $N(25, 4)$ minutes and Bob's is $N(22, 3)$, independent. On a random day,
what is the probability Ann's commute is longer than Bob's?

1. Let $D = A - B$. $\mu_D = 25 - 22 = 3$; $\sigma_D = \sqrt{16 + 9} = 5$. $D$ is normal.
2. $P(A > B) = P(D > 0)$. $z = (0 - 3)/5 = -0.6$.
3. $P(Z > -0.6) = 1 - 0.2743 = 0.7257$.

About 73% of days, Ann's commute is longer.

### Example 4

For the freight shipment of Example 2, suppose $X$ and $Y$ are normal. What is
$P(T > 50)$? $T$ is $N(42, 5)$, so $z = (50 - 42)/5 = 1.6$ and $P(Z > 1.6) \approx 0.0548$.

### Example 5: a difference that matters

A railway's daily revenue $R$ has mean \$52,000 and SD \$4,000; daily operating cost $K$ has
mean \$47,000 and SD \$3,000, independent of revenue. Daily profit $P = R - K$ has

- $\mu_P = 52{,}000 - 47{,}000 = \$5{,}000$;
- $\sigma_P = \sqrt{4000^2 + 3000^2} = \$5{,}000$.

If revenue and cost are normal, so is profit, and $P(P < 0) = P(Z < (0 - 5000)/5000) = P(Z < -1) \approx 0.16$:
roughly one day in six loses money, even though the average day earns \$5,000. Note that
subtracting the cost *added* uncertainty.

## Common mistakes

- Adding standard deviations instead of variances.
- Subtracting variances for a difference.
- Using the variance rules for variables that aren't independent (for example, a person's
  height in inches and in centimeters).
- Treating $X_1 + X_2$ (two independent observations) as $2X$.
- Forgetting that a sum is normal only when its parts are normal (or, approximately, when
  many are added — the Central Limit Theorem).

## Key points

- $Y = a + bX$: $\mu_Y = a + b\mu_X$, $\sigma_Y = |b|\sigma_X$.
- $\mu_{X \pm Y} = \mu_X \pm \mu_Y$ always.
- If independent: $\sigma_{X \pm Y}^2 = \sigma_X^2 + \sigma_Y^2$ — for sums *and* differences.
- $n$ independent copies: sum has SD $\sqrt{n}\sigma$; $nX$ has SD $n\sigma$.
- Independent normals combine to normals.
