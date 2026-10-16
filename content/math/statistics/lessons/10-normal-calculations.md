---
id: stat-normal-calc
module: stat-m2
title: Normal calculations and inverse normal
minutes: 35
topics: [Normal calculations]
drills: [stat-normal-below, stat-normal-between, stat-invnorm]
refs: [stat-ref-probability]
---
## Beyond 68–95–99.7

The empirical rule handles values exactly 1, 2 or 3 standard deviations from the mean.
For anything else — "what fraction of bolts exceed 155 mm?" or "what score marks the top
10%?" — we need exact areas under the normal curve. Every normal calculation reduces to
the **standard normal distribution** $N(0, 1)$ by standardizing, which is why z-scores
came first.

## The standard normal distribution

If $X$ is $N(\mu, \sigma)$, then $Z = \dfrac{X - \mu}{\sigma}$ is $N(0, 1)$. So

$$P(X < x) = P\!\left(Z < \frac{x - \mu}{\sigma}\right).$$

Areas under the standard normal curve are tabulated in a **standard normal table**
(z-table), which gives the area to the *left* of each z-value, or computed by technology
(`normalcdf` on a TI calculator, `NORM.DIST` in spreadsheets, `pnorm` in R). The left-area
function is written $\Phi(z)$.

Three facts cover every case:

- *Left of $z$*: $\Phi(z)$, read directly.
- *Right of $z$*: $1 - \Phi(z)$, because the total area is 1.
- *Between $z_1$ and $z_2$*: $\Phi(z_2) - \Phi(z_1)$.

Symmetry also gives $\Phi(-z) = 1 - \Phi(z)$.

A few values worth knowing: $\Phi(1) \approx 0.8413$, $\Phi(1.645) \approx 0.95$,
$\Phi(1.96) \approx 0.975$, $\Phi(2.576) \approx 0.995$.

## The four-step method

1. *State* the distribution and the question as an area: "$X$ is $N(35, 4)$; find
   $P(X > 40)$."
2. *Draw* the curve and shade the area. This catches most sign and tail errors.
3. *Standardize* each boundary: $z = (x - \mu)/\sigma$.
4. *Find the area* from the table or technology, and answer in context.

### Example 1: area to the right

Commute times on a route are approximately $N(35, 4)$ minutes. What proportion of commutes
take longer than 40 minutes?

```plot
{"x": [21, 49], "y": [-0.013, 0.11], "grid": false, "functions": [{"f": "normpdf(x, 35, 4)"}], "shade": [{"f": "normpdf(x, 35, 4)", "from": 40, "to": 49}], "segments": [{"from": [21, 0], "to": [49, 0]}], "labels": [{"at": [35, -0.009], "text": "35"}, {"at": [40, -0.009], "text": "40"}], "caption": "P(X > 40) for N(35, 4)"}
```

1. $z = (40 - 35)/4 = 1.25$.
2. Table: $\Phi(1.25) = 0.8944$.
3. Right tail: $1 - 0.8944 = 0.1056$.

About 10.6% of commutes take longer than 40 minutes.

### Example 2: area between

Test scores are $N(500, 100)$. What proportion score between 430 and 520?

1. $z_1 = (430 - 500)/100 = -0.7$ and $z_2 = (520 - 500)/100 = 0.2$.
2. $\Phi(0.2) = 0.5793$ and $\Phi(-0.7) = 0.2420$.
3. Area between: $0.5793 - 0.2420 = 0.3373$.

About 33.7% score between 430 and 520.

## Working backward: inverse normal

Sometimes you know the area and need the value: "what score is the 90th percentile?"
Reverse the steps:

1. Find the z-value with the given area to its *left*: $z = \Phi^{-1}(p)$ (table read
   backward, or `invNorm` on a calculator).
2. Unstandardize: $x = \mu + z\sigma$.

If the question gives a right-tail area, convert it first: "top 10%" means 90% to the left.

### Example 3

Scores are $N(500, 100)$. What score is needed to be in the top 10%?

1. Area to the left $= 0.90$; $z = \Phi^{-1}(0.90) \approx 1.2816$ (table: 1.28).
2. $x = 500 + 1.2816(100) \approx 628.2$.

A score of about 628 or higher is in the top 10%.

### Example 4: finding σ

A machine fills cereal boxes with a mean of 12.4 oz. The company wants only 5% of boxes to
contain less than 12 oz. What standard deviation is required?

1. 5% to the left means $z = \Phi^{-1}(0.05) \approx -1.645$.
2. Set up $z = (x - \mu)/\sigma$: $-1.645 = (12 - 12.4)/\sigma$.
3. $\sigma = 0.4/1.645 \approx 0.243$ oz.

The same setup solves for $\mu$ when $\sigma$ is known: to have only 1% below 12 oz with
$\sigma = 0.2$, need $\mu = 12 + 2.326(0.2) \approx 12.47$ oz, since $\Phi^{-1}(0.99) \approx 2.326$.

## Assessing normality

Normal calculations are only as good as the normal model. To check whether data are
approximately normal:

1. *Graph* the data: a histogram or dotplot should be roughly symmetric and
   single-peaked, with no outliers.
2. *Check the empirical rule*: about 68% of values within $\bar{x} \pm s$, 95% within
   $\bar{x} \pm 2s$.
3. **Normal probability plot**: plot each data value against the z-score it would have
   if the data were perfectly normal (its expected position). If the data are normal, the
   points fall close to a straight line. Systematic curvature means non-normality: a
   curve that bends upward at the right end shows right skew (the largest values are
   farther out than normal), and isolated points off the line at either end are outliers.

```plot
{"x": [-2.2, 2.2], "y": [40, 80], "xLabel": "expected z", "yLabel": "value", "points": [{"at": [-1.87, 46], "color": "#2c5e8f"}, {"at": [-1.28, 51], "color": "#2c5e8f"}, {"at": [-0.97, 54], "color": "#2c5e8f"}, {"at": [-0.73, 56], "color": "#2c5e8f"}, {"at": [-0.52, 58], "color": "#2c5e8f"}, {"at": [-0.34, 59], "color": "#2c5e8f"}, {"at": [-0.17, 61], "color": "#2c5e8f"}, {"at": [0, 61], "color": "#2c5e8f"}, {"at": [0.17, 63], "color": "#2c5e8f"}, {"at": [0.34, 64], "color": "#2c5e8f"}, {"at": [0.52, 65], "color": "#2c5e8f"}, {"at": [0.73, 68], "color": "#2c5e8f"}, {"at": [0.97, 69], "color": "#2c5e8f"}, {"at": [1.28, 72], "color": "#2c5e8f"}, {"at": [1.87, 77], "color": "#2c5e8f"}], "functions": [{"f": "61.6 + 8*x", "dashed": true}], "caption": "Normal probability plot: points near a line suggest a normal model fits"}
```

### Example 5: a quick plausibility check

A sample of 40 waiting times has mean 6 minutes and standard deviation 5 minutes. Could
these times be normal? If they were, about 11.5% would be below $6 - 1.2(5) = 0$, i.e.
negative — impossible for waiting times. With a minimum of 0 only 1.2 SDs below the mean,
the distribution must be right-skewed. Normal calculations would be inappropriate.

## Common mistakes

- Forgetting to subtract from 1 for a right-tail area (or subtracting for a left tail).
- Using a right-tail area directly in inverse normal: the top 5% cutoff uses
  $\Phi^{-1}(0.95)$, not $\Phi^{-1}(0.05)$.
- Standardizing with the variance instead of the SD.
- Applying normal calculations to clearly skewed data.
- Rounding z to one decimal too early; use two decimals with a table, full precision with
  technology.

## Key points

- Standardize: $P(X < x) = \Phi\!\left(\dfrac{x - \mu}{\sigma}\right)$.
- Right tail $1 - \Phi(z)$; between $\Phi(z_2) - \Phi(z_1)$.
- Inverse: $x = \mu + z\sigma$ with $z = \Phi^{-1}(\text{area to the left})$.
- Solve $z = (x - \mu)/\sigma$ for $\mu$ or $\sigma$ when one is unknown.
- Check normality with a graph and a normal probability plot before trusting the model.
