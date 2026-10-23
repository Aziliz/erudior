---
id: stat-normal
module: stat-m2
title: Density curves and the normal distribution
minutes: 25
topics: [Normal distribution]
drills: [stat-empirical, stat-zscore]
refs: [stat-ref-probability]
---
## From histograms to smooth curves

With a very large data set and narrow bins, a relative-frequency histogram starts to look
like a smooth curve. A **density curve** is that idealized curve: a mathematical model
for the overall pattern of a distribution. This lesson introduces density curves in
general and the most important family of them, the normal distributions, together with
the 68–95–99.7 rule that makes quick normal estimates possible.

## Density curves

A density curve

- is always on or above the horizontal axis, and
- has a total area of exactly 1 underneath it.

The **area under the curve** over an interval equals the proportion of values in that
interval. This is the key move of the rest of the course: *proportions are areas*.

For a density curve, the **median** is the point that splits the area in half; the
**mean** is the balance point of the curve. In a symmetric curve they are equal; in a
right-skewed curve the mean is to the right of the median, just as with data. We use
$\mu$ and $\sigma$ for the mean and SD of a density curve, because it models a population
(or an idealized distribution) rather than a particular sample.

A simple example is the uniform density on $[0, 4]$: a flat line at height $1/4$, so the
total area is $4 \times \tfrac14 = 1$. The proportion of values between 1 and 2.5 is the
rectangle area $1.5 \times \tfrac14 = 0.375$.

## Normal distributions

A **normal distribution** is described by a symmetric, single-peaked, bell-shaped density
curve. Every normal curve is determined by two numbers: its mean $\mu$ (the center and
peak) and its standard deviation $\sigma$ (the spread). We write $N(\mu, \sigma)$.

Changing $\mu$ slides the curve along the axis without changing its shape. Changing
$\sigma$ stretches or squeezes it, and because the total area must stay 1, a curve twice as
wide is only half as tall.

```plot
{"x": [20, 90], "y": [-0.01, 0.095], "grid": false, "functions": [{"f": "normpdf(x, 50, 5)"}, {"f": "normpdf(x, 50, 10)", "dashed": true}, {"f": "normpdf(x, 70, 5)"}], "segments": [{"from": [20, 0], "to": [90, 0]}], "labels": [{"at": [30, -0.006], "text": "30"}, {"at": [50, -0.006], "text": "50"}, {"at": [70, -0.006], "text": "70"}, {"at": [50, 0.087], "text": "N(50, 5)"}, {"at": [33, 0.03], "text": "N(50, 10)"}, {"at": [70, 0.087], "text": "N(70, 5)"}], "caption": "Same σ, different μ: the curve slides. Same μ, double σ: twice as wide, half as tall."}
```

The curve's formula is

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{1}{2}\left(\frac{x - \mu}{\sigma}\right)^2}.$$

You will never need to compute with it by hand, but the formula shows where the shape
comes from: the exponent depends on $\left(\frac{x-\mu}{\sigma}\right)^2$, the squared
z-score, so the curve is symmetric about $\mu$ and falls off quickly once $|z|$ gets past
about 2. The points where the curve changes from concave down to concave up — the
**inflection points** — are exactly at $\mu - \sigma$ and $\mu + \sigma$, which gives a
way to read $\sigma$ off a picture.

```plot
{"x": [-4, 4], "y": [-0.045, 0.45], "grid": false, "functions": [{"f": "normpdf(x)"}], "shade": [{"f": "normpdf(x)", "from": -1, "to": 1}], "segments": [{"from": [-4, 0], "to": [4, 0]}], "labels": [{"at": [-3, -0.03], "text": "μ−3σ"}, {"at": [-2, -0.03], "text": "μ−2σ"}, {"at": [-1, -0.03], "text": "μ−σ"}, {"at": [0, -0.03], "text": "μ"}, {"at": [1, -0.03], "text": "μ+σ"}, {"at": [2, -0.03], "text": "μ+2σ"}, {"at": [3, -0.03], "text": "μ+3σ"}, {"at": [0, 0.15], "text": "68%"}], "caption": "About 68% of a normal distribution lies within one SD of the mean"}
```

Normal distributions are everywhere for two reasons. Many measurements that are the sum
of many small, independent influences (heights, measurement errors, test scores) are
approximately normal. More importantly, the Central Limit Theorem (Module 7) shows that
*averages* of many observations are approximately normal even when individual
observations are not. That is why the normal curve runs through all of inference.

## The 68–95–99.7 rule

In any normal distribution:

- about *68%* of values lie within $1\sigma$ of the mean,
- about *95%* within $2\sigma$,
- about *99.7%* within $3\sigma$.

This is the **empirical rule**. Combined with symmetry, it answers many questions
without a table. Since 68% is within $\pm 1\sigma$, 34% lies between $\mu$ and
$\mu + \sigma$; since 95% is within $\pm 2\sigma$, 47.5% lies between $\mu$ and
$\mu + 2\sigma$, so 13.5% lies between $\mu + \sigma$ and $\mu + 2\sigma$; and 2.5% lies
beyond $\mu + 2\sigma$.

| Region | Percent |
|---|---|
| below $\mu - 3\sigma$ | 0.15% |
| $\mu - 3\sigma$ to $\mu - 2\sigma$ | 2.35% |
| $\mu - 2\sigma$ to $\mu - \sigma$ | 13.5% |
| $\mu - \sigma$ to $\mu$ | 34% |
| $\mu$ to $\mu + \sigma$ | 34% |
| $\mu + \sigma$ to $\mu + 2\sigma$ | 13.5% |
| $\mu + 2\sigma$ to $\mu + 3\sigma$ | 2.35% |
| above $\mu + 3\sigma$ | 0.15% |

Sketching the curve and labeling these regions is the fastest way to avoid mistakes. A
finished sketch looks like this:

![A normal curve with vertical lines at μ and at 1, 2 and 3 standard deviations on each side. The regions are labeled 34% between μ and μ ± σ, 13.5% between σ and 2σ on each side, 2.35% between 2σ and 3σ on each side, and 0.15% beyond 3σ in each tail. Dots mark the inflection points at μ − σ and μ + σ.](images/stat-m2-empirical.svg)

### Example 1

Adult resting heart rates are approximately $N(72, 8)$ beats per minute. Use the
empirical rule.

1. What percent are between 64 and 80? These are $72 \pm 8$, one SD each side: *68%*.
2. What percent are above 88? $88 = 72 + 2(8)$, two SDs above. Above $+2\sigma$ is half of
   the 5% outside $\pm 2\sigma$: *2.5%*.
3. What percent are between 56 and 80? $56$ is $-2\sigma$ and $80$ is $+1\sigma$:
   $47.5\% + 34\% = 81.5\%$.
4. What heart rate is at the 16th percentile? Below $\mu - \sigma$ is
   $(100 - 68)/2 = 16\%$, so the 16th percentile is $72 - 8 = 64$ bpm.

### Example 2

The lengths of rail bolts are normal with mean 150 mm. About 95% of bolts are between 146
and 154 mm. What is $\sigma$, and what percent of bolts are longer than 155 mm?

1. The middle 95% spans $\mu \pm 2\sigma$, so $2\sigma = 4$ and $\sigma = 2$ mm.
2. $155 = 150 + 2.5\sigma$. That's between $2\sigma$ and $3\sigma$, so the empirical rule
   only brackets the answer: between 0.15% and 2.5%. The exact value needs the methods
   of the next lesson (it is about 0.6%).

## Is it really normal?

The empirical rule only works for distributions that are approximately normal. Before
using it on data, check: Is the histogram roughly symmetric and bell-shaped? Do about 68%
and 95% of the observations actually fall within 1 and 2 SDs of the mean? For skewed
data, the percentages can be far off — for a strongly right-skewed distribution almost
nothing lies below $\mu - 2\sigma$, but much more than 2.5% lies above $\mu + 2\sigma$. The
next lesson adds a sharper tool, the normal probability plot.

## Common mistakes

- Using the empirical rule on skewed data.
- Forgetting to halve: 95% within $\pm 2\sigma$ means 2.5% *in each tail*, not 5%.
- Treating height of the density curve as a probability. Only *areas* are proportions;
  for a continuous variable the proportion at any single exact value is 0.
- Mixing up $\sigma$ with the variance $\sigma^2$ in $N(\mu, \sigma)$.

## Key points

- A density curve is on or above the axis with total area 1; areas are proportions.
- Normal curves $N(\mu, \sigma)$ are symmetric and bell-shaped, with inflection points at
  $\mu \pm \sigma$.
- Empirical rule: 68% within $1\sigma$, 95% within $2\sigma$, 99.7% within $3\sigma$.
- Draw the curve, mark $\mu$ and $\mu \pm k\sigma$, and use symmetry.
