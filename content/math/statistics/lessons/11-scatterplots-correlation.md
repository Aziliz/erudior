---
id: stat-scatter-corr
module: stat-m3
title: Scatterplots and correlation
minutes: 30
topics: [Scatterplots and correlation]
drills: [stat-corr-calc]
refs: [stat-ref-descriptive]
---
## Two variables at once

So far each variable has been studied alone. Much of the interesting work in statistics
asks how two quantitative variables are related: does rail temperature predict track
buckling risk? Does study time predict exam score? This module builds the tools —
scatterplots, correlation and regression — and this lesson starts with the picture and
the number that measures a straight-line relationship.

## Explanatory and response variables

When one variable may help explain or predict the other, call it the **explanatory
variable** ($x$, on the horizontal axis) and the other the **response variable**
($y$, on the vertical axis). Hours of study is explanatory, exam score is response.
Calling a variable explanatory does *not* claim it causes the response — only that we're
using it to describe or predict.

## Scatterplots

A **scatterplot** shows one point $(x, y)$ for each individual. Describe a scatterplot by
four features — the *direction, form, strength* of the relationship and any *unusual
features*:

- *Direction*: a **positive association** means above-average $x$ values tend to go
  with above-average $y$ values (the cloud rises left to right); a **negative
  association** means the cloud falls.
- *Form*: linear (points scatter around a line), curved, or clustered.
- *Strength*: how closely the points follow the form — strong, moderate, weak.
- *Unusual features*: outliers (points far from the pattern) and distinct clusters.

```plot
{"x": [0, 6], "y": [0, 8], "xLabel": "weeks of training", "yLabel": "skill score", "points": [{"at": [1, 3], "color": "#2c5e8f"}, {"at": [2, 5], "color": "#2c5e8f"}, {"at": [3, 4], "color": "#2c5e8f"}, {"at": [4, 7], "color": "#2c5e8f"}, {"at": [5, 6], "color": "#2c5e8f"}], "caption": "A fairly strong, positive, linear association (r = 0.8)"}
```

## The correlation coefficient

The **correlation** $r$ measures the direction and strength of a *linear* relationship:

$$r = \frac{1}{n - 1}\sum \left(\frac{x_i - \bar{x}}{s_x}\right)\left(\frac{y_i - \bar{y}}{s_y}\right) = \frac{1}{n-1}\sum z_{x_i} z_{y_i}.$$

### Why this formula works

Standardize both variables and multiply each point's two z-scores. A point in the upper
right (both above average) or lower left (both below) gives a *positive* product; a point
in the upper left or lower right gives a *negative* product. If most points sit in the
upper-right and lower-left quadrants around $(\bar{x}, \bar{y})$, the products are mostly
positive and $r > 0$. If points are spread evenly over all four quadrants, the products
cancel and $r \approx 0$. Averaging z-products (rather than raw products) makes $r$ free of
units and scale.

An equivalent form that is easier by hand:

$$r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}.$$

### Example 1

Compute $r$ for the training data: $(1, 3), (2, 5), (3, 4), (4, 7), (5, 6)$.

1. Means: $\bar{x} = 15/5 = 3$, $\bar{y} = 25/5 = 5$.
2. Deviations: $x - \bar{x} = -2, -1, 0, 1, 2$; $y - \bar{y} = -2, 0, -1, 2, 1$.
3. Products: $4, 0, 0, 2, 2$; sum $S_{xy} = 8$.
4. $S_{xx} = 4 + 1 + 0 + 1 + 4 = 10$ and $S_{yy} = 4 + 0 + 1 + 4 + 1 = 10$.
5. $r = \dfrac{8}{\sqrt{10 \cdot 10}} = 0.8$.

A strong positive linear association.

## Properties of r

- $-1 \le r \le 1$. $r = \pm 1$ only when all points lie exactly on a line.
- The sign gives the direction; $|r|$ near 1 means strong, near 0 means weak *linear*
  association. Rough guide: $|r| > 0.8$ strong, $0.5$–$0.8$ moderate, below $0.5$ weak —
  but always look at the plot.
- $r$ has no units, and it doesn't change if you change units (inches to cm) or
  transform either variable linearly with a positive multiplier. (A negative multiplier
  flips its sign.)
- $r$ is symmetric: swapping $x$ and $y$ gives the same $r$.
- $r$ is *not resistant*: one outlier can raise or lower it substantially.
- $r$ measures only *linear* association. A perfect parabola can have $r = 0$.

```plot
{"x": [-3.5, 3.5], "y": [-1, 10], "points": [{"at": [-3, 9], "color": "#2c5e8f"}, {"at": [-2, 4], "color": "#2c5e8f"}, {"at": [-1, 1], "color": "#2c5e8f"}, {"at": [0, 0], "color": "#2c5e8f"}, {"at": [1, 1], "color": "#2c5e8f"}, {"at": [2, 4], "color": "#2c5e8f"}, {"at": [3, 9], "color": "#2c5e8f"}], "caption": "A perfect curved relationship with r = 0"}
```

### Example 2

For the points above, $y = x^2$ exactly, yet the positive products on the right cancel the
negative products on the left and $r = 0$. The lesson: $r = 0$ means *no linear*
relationship, not no relationship. Always plot first.

## Correlation is not causation

A strong correlation does not show that changes in $x$ cause changes in $y$. Ice cream
sales and drowning deaths are positively correlated because both rise in hot weather — a
**lurking variable** (here, temperature) affects both. Other explanations for a
correlation include reverse causation and coincidence. Only a well-designed experiment
(Module 4) can establish causation.

Correlations based on averages (such as state-level averages) are usually much stronger
than correlations for individuals, because averaging removes individual variation. This
is sometimes called an **ecological correlation**; don't apply it to individuals.

### Example 3

A study of 50 towns finds $r = 0.72$ between the number of churches and the number of
bars. Should a town reduce bars by limiting churches? No: both counts grow with
population size, a lurking variable. The correlation reflects town size, not any link
between churches and bars.

## Common mistakes

- Saying "the correlation is strong" from $r = -0.9$ but calling it "weak" because it's
  negative. Sign is direction; size is strength.
- Using $r$ for curved relationships or categorical variables (correlation needs two
  quantitative variables).
- Inferring causation from correlation.
- Forgetting that a single outlier can create or destroy a large $r$.

## Key points

- Describe scatterplots by direction, form, strength and unusual features.
- $r = \frac{1}{n-1}\sum z_x z_y$: unitless, between −1 and 1, measures *linear*
  association, not resistant.
- $r$ is unchanged by positive linear changes of units and by swapping $x$ and $y$.
- Correlation is not causation: look for lurking variables.
