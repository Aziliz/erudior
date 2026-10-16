---
id: stat-residuals
module: stat-m3
title: Residuals, r² and influential points
minutes: 30
topics: [Residuals and r-squared]
drills: [stat-residual, stat-r-squared]
refs: [stat-ref-descriptive]
---
## How good is the line?

Every data set has a least-squares line, even when a line is a poor description. This
lesson gives three ways to judge the fit — residual plots, $r^2$ and the standard
deviation of the residuals — and shows how individual points can distort a regression.

## Residuals

Recall that a residual is $e = y - \hat{y}$. A positive residual means the point is
*above* the line (the line under-predicted); negative means below (over-predicted). For
any least-squares line, the residuals add to zero (and so have mean zero).

For the training data with $\hat{y} = 2.6 + 0.8x$:

| $x$ | $y$ | $\hat{y}$ | residual $y - \hat{y}$ |
|---|---|---|---|
| 1 | 3 | 3.4 | −0.4 |
| 2 | 5 | 4.2 | 0.8 |
| 3 | 4 | 5.0 | −1.0 |
| 4 | 7 | 5.8 | 1.2 |
| 5 | 6 | 6.6 | −0.6 |

The residuals sum to $0$, as promised.

## Residual plots

A **residual plot** graphs the residuals (vertical) against $x$ (or against $\hat{y}$).
It magnifies departures from the line that are hard to see on the scatterplot.

- *Random scatter* around the zero line, with no pattern: a line is an appropriate
  model.
- *A curved pattern* (for instance residuals positive at both ends, negative in the
  middle): the relationship is curved; a line is the wrong form.
- *A fan shape* (spread growing with $x$): predictions are less precise for large $x$.

```plot
{"x": [0, 10], "y": [-3, 3], "xLabel": "x", "yLabel": "residual", "points": [{"at": [1, 2.1], "color": "#2c5e8f"}, {"at": [2, 0.8], "color": "#2c5e8f"}, {"at": [3, -0.4], "color": "#2c5e8f"}, {"at": [4, -1.2], "color": "#2c5e8f"}, {"at": [5, -1.6], "color": "#2c5e8f"}, {"at": [6, -1.5], "color": "#2c5e8f"}, {"at": [7, -0.9], "color": "#2c5e8f"}, {"at": [8, 0.1], "color": "#2c5e8f"}, {"at": [9, 1.5], "color": "#2c5e8f"}], "caption": "A curved residual pattern: a straight line is not the right model"}
```

## The coefficient of determination r²

The square of the correlation, $r^2$, is called the **coefficient of determination**. It
has a clean meaning: the fraction of the variation in $y$ that is accounted for by the
linear relationship with $x$.

$$r^2 = 1 - \frac{\sum (y - \hat{y})^2}{\sum (y - \bar{y})^2} = 1 - \frac{\text{SSE}}{\text{SST}}.$$

Why: $\text{SST} = \sum (y - \bar{y})^2$ is the total variation in $y$ — the squared
error you'd make predicting every $y$ by $\bar{y}$, ignoring $x$. $\text{SSE}$ is the
squared error left after using the line. So $1 - \text{SSE}/\text{SST}$ is the fraction
of the original squared error that the line removes.

For the training data: $\text{SST} = 10$ (from the last lesson), and
$\text{SSE} = 0.16 + 0.64 + 1 + 1.44 + 0.36 = 3.6$. So $r^2 = 1 - 3.6/10 = 0.64$, which is
$0.8^2$. ✓

Interpretation template: "About 64% of the variation in skill score is accounted for by
the linear relationship with weeks of training."

Going back from $r^2$ to $r$: $r = \pm\sqrt{r^2}$, with the sign of the slope. If
$r^2 = 0.81$ and the slope is negative, $r = -0.9$.

## The standard deviation of the residuals

The typical size of a prediction error is measured by

$$s = \sqrt{\frac{\sum (y - \hat{y})^2}{n - 2}} = \sqrt{\frac{\text{SSE}}{n-2}}.$$

We divide by $n - 2$ because two quantities (slope and intercept) were estimated from the
data. For the training data, $s = \sqrt{3.6/3} \approx 1.10$: predictions of skill
score are typically off by about 1.1 points. $r^2$ is a percentage with no units; $s$ is
in the units of $y$. Report both.

## Outliers, leverage and influential points

- An **outlier** in regression is a point with a large residual — far from the line in
  the $y$ direction.
- A point has high **leverage** if its $x$ value is far from $\bar{x}$. Such points pull on
  the line like a long lever.
- A point is **influential** if removing it would markedly change the slope, intercept
  or correlation. High-leverage points are often influential, especially when they don't
  follow the pattern of the rest.

An influential point may have a *small* residual — because it has pulled the line
toward itself. So don't hunt for influential points by looking at residuals; refit
without the point and compare.

```plot
{"x": [0, 16], "y": [0, 12], "xLabel": "x", "yLabel": "y", "points": [{"at": [1, 4], "color": "#2c5e8f"}, {"at": [2, 5], "color": "#2c5e8f"}, {"at": [3, 4.5], "color": "#2c5e8f"}, {"at": [4, 6], "color": "#2c5e8f"}, {"at": [5, 6.5], "color": "#2c5e8f"}, {"at": [6, 7.5], "color": "#2c5e8f"}, {"at": [15, 2], "label": "P", "color": "#c53030"}], "functions": [{"f": "3.233 + 0.671*x", "dashed": true}, {"f": "5.998 - 0.180*x", "color": "#c53030"}], "caption": "One high-leverage point P flips the slope (dashed: fit without P; solid: fit with P)"}
```

### Example 1

A regression of salary on years of experience for 30 employees gives $r = 0.52$. One
employee, the founder, has 40 years of experience while everyone else has under 15.
Removing the founder changes $r$ to 0.31 and the slope from 2.1 to 1.2 (thousands per
year). The founder is influential: one point accounts for a large share of the apparent
relationship. Report both analyses and explain.

### Example 2

For a regression of fuel used (gallons) on distance (miles) with $\hat{y} = 0.4 + 0.035x$,
a trip of 300 miles used 11.9 gallons. Find and interpret the residual.

1. $\hat{y} = 0.4 + 0.035(300) = 0.4 + 10.5 = 10.9$ gallons.
2. Residual $= 11.9 - 10.9 = 1.0$ gallon.
3. This trip used 1 gallon *more* than the line predicts — the point is above the line.

### Example 3

A study reports $r^2 = 0.36$ and a negative slope. What is $r$? $r = -\sqrt{0.36} = -0.6$.
Only 36% of the variation in the response is explained by the linear relationship.

## Common mistakes

- Computing a residual as predicted minus observed.
- Saying "$r^2 = 0.64$ means the line is correct 64% of the time" or "64% of the points
  are on the line." It is a fraction of *variation* explained.
- Forgetting the sign when taking $\sqrt{r^2}$.
- Judging fit by $r^2$ alone; a curved pattern can have a high $r^2$. Check the residual plot.
- Assuming an influential point must have a big residual.

## Key points

- Residual $= y - \hat{y}$; residuals of an LSRL sum to 0.
- Residual plot: random scatter means a line fits; curves or fans signal problems.
- $r^2 = 1 - \text{SSE}/\text{SST}$: fraction of variation in $y$ explained by the line.
- $s = \sqrt{\text{SSE}/(n-2)}$: typical prediction error, in $y$'s units.
- Outliers have big residuals; high-leverage points have extreme $x$; influential points
  change the fit when removed.
