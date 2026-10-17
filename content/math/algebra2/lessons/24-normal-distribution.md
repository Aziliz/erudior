---
id: a2-normal
module: a2-m8
title: The normal distribution and sampling
minutes: 35
topics: [Normal distribution, Sampling and surveys]
drills: [a2-d-empirical-rule, a2-d-normal-area, a2-d-margin-error]
refs: [a2-ref-prob-trig]
---
Many measurements, such as heights, test scores, the weight of cereal in a box or the lifetime of a battery, pile up around an average and thin out evenly on both sides. The bell-shaped normal distribution models data like this, and it turns probability into area under a curve. This lesson describes data with a mean and standard deviation, uses the normal curve to find probabilities, and ends with how surveys use samples to learn about a whole population.

## Mean and standard deviation

The **mean** of a data set is its average: add the values and divide by how many there are. The mean of a population is written $\mu$ ("mu"). The **standard deviation** $\sigma$ ("sigma") measures spread: roughly how far a typical value is from the mean. To compute it for a population of $n$ values:

$$\sigma = \sqrt{\frac{\sum (x - \mu)^2}{n}}.$$

Find each value's deviation from the mean, square the deviations (so negatives don't cancel positives), average them, and take the square root to get back to the original units.

### Example 1

Find the mean and standard deviation of $4, 8, 6, 5, 7$.

1. $\mu = \dfrac{4 + 8 + 6 + 5 + 7}{5} = \dfrac{30}{5} = 6$.
2. Deviations: $-2, 2, 0, -1, 1$. Squares: $4, 4, 0, 1, 1$, which add to 10.
3. $\sigma = \sqrt{10/5} = \sqrt2 \approx 1.41$.

Calculators also report a *sample* standard deviation $s$, which divides by $n - 1$ instead of $n$; it is used when the data are a sample from a larger population. For $4, 8, 6, 5, 7$ it gives $s = \sqrt{10/4} \approx 1.58$.

## The normal curve

A **normal distribution** is a continuous distribution whose graph, the **normal curve**, is a symmetric bell centered at the mean $\mu$. The standard deviation sets its width: the curve changes from bending down to bending up exactly one $\sigma$ from the mean. Two facts drive everything:

- The total area under the curve is 1 (that is, 100%).
- The probability that a value falls between $a$ and $b$ is the area under the curve from $a$ to $b$.

Because the curve is symmetric, half the area is on each side of the mean, and the mean, median and peak all coincide.

### The 68–95–99.7 rule

For every normal distribution, about

- 68% of values lie within 1 standard deviation of the mean,
- 95% lie within 2 standard deviations,
- 99.7% lie within 3 standard deviations.

This is the **68–95–99.7 rule**, also called the **empirical rule**.

```plot
{"x": [-4, 4], "y": [-0.06, 0.45], "grid": false, "functions": [{"f": "normpdf(x)"}], "shade": [{"f": "normpdf(x)", "from": -2, "to": 2, "color": "#9ec5e8"}, {"f": "normpdf(x)", "from": -1, "to": 1}], "segments": [{"from": [-4, 0], "to": [4, 0]}], "labels": [{"at": [-3, -0.035], "text": "μ−3σ"}, {"at": [-2, -0.035], "text": "μ−2σ"}, {"at": [-1, -0.035], "text": "μ−σ"}, {"at": [0, -0.035], "text": "μ"}, {"at": [1, -0.035], "text": "μ+σ"}, {"at": [2, -0.035], "text": "μ+2σ"}, {"at": [3, -0.035], "text": "μ+3σ"}, {"at": [0, 0.15], "text": "68%"}, {"at": [-1.5, 0.04], "text": "13.5%"}, {"at": [1.5, 0.04], "text": "13.5%"}, {"at": [-2.6, 0.04], "text": "2.35%"}, {"at": [2.6, 0.04], "text": "2.35%"}], "caption": "Within 1 SD: 68%; within 2 SD: 95%; each tail beyond 2 SD holds 2.5%"}
```

Splitting these percentages in half by symmetry gives the pieces: 34% between $\mu$ and $\mu + \sigma$, 13.5% between $\mu + \sigma$ and $\mu + 2\sigma$, 2.35% between $\mu + 2\sigma$ and $\mu + 3\sigma$, and 0.15% beyond $3\sigma$ on each side.

### Example 2

Adult women's heights in a region are approximately normal with mean 64 in and standard deviation 2.5 in. What percent are (a) between 59 and 69 in, (b) taller than 66.5 in, (c) between 61.5 and 69 in?

1. (a) $59 = 64 - 2(2.5)$ and $69 = 64 + 2(2.5)$: within 2 SD, so about 95%.
2. (b) $66.5 = \mu + \sigma$. Half the data (50%) is above the mean, and 34% is between $\mu$ and $\mu + \sigma$, so $50\% - 34\% = 16\%$ is above 66.5.
3. (c) $61.5 = \mu - \sigma$ and $69 = \mu + 2\sigma$. Add the pieces: $34\% + 34\% + 13.5\% = 81.5\%$.

## z-scores

The **z-score** of a value tells how many standard deviations it lies above or below the mean:

$$z = \frac{x - \mu}{\sigma}.$$

A positive $z$ is above the mean, a negative $z$ below it. Converting to z-scores turns any normal distribution into the **standard normal distribution**, the one with mean 0 and standard deviation 1. It also lets you compare values measured on different scales.

### Example 3

Maya scored 82 on a history test (mean 70, SD 8) and 88 on a math test (mean 80, SD 10). On which test did she do better compared with her class?

1. History: $z = \dfrac{82 - 70}{8} = 1.5$.
2. Math: $z = \dfrac{88 - 80}{10} = 0.8$.
3. Her history score is 1.5 SD above the mean and her math score only 0.8 SD above, so history was the stronger performance, even though 88 is the higher raw score.

## Finding areas with a normal CDF

The 68–95–99.7 rule only handles whole numbers of standard deviations. For any other cutoff, use a **normal CDF** (cumulative distribution function): a calculator command, often `normalcdf(lower, upper, μ, σ)`, that returns the area under the normal curve between two values. For "less than $b$" use a very negative lower bound (such as $-10^{99}$); for "greater than $a$" use a huge upper bound. Without a graphing calculator, convert to $z$ and read a standard normal table, which gives the area to the left of each $z$.

### Example 4

A battery's lifetime is normal with mean 40 hours and standard deviation 5 hours. Find the probability a battery lasts between 32 and 45 hours, and the probability it lasts more than 50 hours.

```plot
{"x": [22, 58], "y": [-0.012, 0.09], "grid": false, "functions": [{"f": "normpdf(x, 40, 5)"}], "shade": [{"f": "normpdf(x, 40, 5)", "from": 32, "to": 45}], "segments": [{"from": [22, 0], "to": [58, 0]}], "labels": [{"at": [32, -0.007], "text": "32"}, {"at": [40, -0.007], "text": "40"}, {"at": [45, -0.007], "text": "45"}, {"at": [50, -0.007], "text": "50"}, {"at": [39.5, 0.03], "text": "0.7865"}], "caption": "Lifetime in hours: the shaded area is P(32 < X < 45)"}
```

1. z-scores: $z = \dfrac{32 - 40}{5} = -1.6$ and $z = \dfrac{45 - 40}{5} = 1$.
2. Area left of $z = 1$ is $0.8413$; area left of $z = -1.6$ is $0.0548$. Subtract: $0.8413 - 0.0548 = 0.7865$. (Directly: `normalcdf(32, 45, 40, 5)` $\approx 0.7865$.)
3. More than 50 hours: $z = 2$, and the area to the left of $z = 2$ is $0.9772$, so $P(X > 50) = 1 - 0.9772 = 0.0228$, about 2.3%. That matches the empirical rule's 2.5%, which is only approximate.

The reverse question, "what lifetime is at the 90th percentile?", uses the inverse: `invNorm(0.90, 40, 5)` $\approx 46.4$ hours.

Not every data set is normal. Incomes and waiting times, for example, are **skewed**, with a long tail on one side, and the 68–95–99.7 rule doesn't apply to them. Check the shape (a histogram) before using normal methods.

## Samples, surveys and margin of error

Usually we want to know something about a **population**, the entire group of interest, such as all voters in a state. Measuring everyone is rarely possible, so we study a **sample**, a part of the population, and use it to estimate the population. A number describing the population (the true percent of all voters who support a law) is a **parameter**; the matching number computed from a sample is a **statistic**.

A sample is only useful if it represents the population. In a **simple random sample**, every group of $n$ individuals is equally likely to be chosen. Samples chosen for convenience (people walking by a mall) or by volunteering (an online poll) are prone to **bias**: they systematically over- or under-represent part of the population, and no amount of extra data fixes that.

Even a perfect random sample won't match the population exactly, because samples vary by chance. The **margin of error** says how far a sample percent is likely to be from the population percent. For a random sample of size $n$, a quick estimate at about 95% confidence is

$$\text{margin of error} \approx \frac{1}{\sqrt n}.$$

This shortcut is a rounded, cautious version of the full formula $1.96\sqrt{\hat p(1 - \hat p)/n}$, where $\hat p$ is the sample proportion. It is close to exact when $\hat p$ is near 50% and a little too large otherwise, so it never understates the uncertainty.

### Example 5

A random sample of 1,200 voters finds 54% support a proposal. Estimate the margin of error and the likely range for all voters.

1. $\dfrac{1}{\sqrt{1200}} \approx 0.029$, about $\pm 2.9$ percentage points.
2. The likely range is $54\% - 2.9\% = 51.1\%$ to $54\% + 2.9\% = 56.9\%$.
3. Since the whole range is above 50%, the poll gives good evidence that a majority supports the proposal.

Because of the square root, halving the margin of error takes four times as many people.

## Common mistakes

- Using the 68–95–99.7 rule on data that isn't roughly normal.
- Forgetting to halve: 68% is within 1 SD on *both* sides, so only 34% is between $\mu$ and $\mu + \sigma$.
- Computing $z = \dfrac{\mu - x}{\sigma}$ (the sign comes out backward) or dividing by the variance instead of the SD.
- Reading a table's left-tail area as the answer to a "greater than" question; subtract from 1.
- Thinking a bigger sample cures bias. A large voluntary-response poll is still biased.

## Key points

- $\sigma = \sqrt{\sum(x - \mu)^2 / n}$ measures spread around the mean.
- Normal curve: symmetric bell, total area 1, probability = area.
- 68–95–99.7: the share within 1, 2, 3 standard deviations of the mean.
- $z = \dfrac{x - \mu}{\sigma}$; find other areas with `normalcdf` or a z-table.
- A random sample estimates a population; margin of error $\approx 1/\sqrt n$.
