---
id: a1-scatter
module: a1-m8
title: Scatter plots, correlation, and lines of fit
minutes: 35
topics: [Scatter plots, Correlation and residuals]
drills: [a1-d-fit-two-points, a1-d-predict-residual, a1-d-fit-solve-x]
refs: [a1-ref-data, alg-ref-equations]
---
This lesson brings the course full circle. In Module 3 you wrote equations of lines through exact points. Real paired data, like hours of study and test scores, never fall exactly on a line, but they often cluster around one. This lesson shows how to picture such data, how to measure how closely it follows a line, how to fit a line and use it to predict, and how to check whether a line was a good choice in the first place.

## Scatter plots

**Bivariate data** records two numerical variables for each individual. A **scatter plot** graphs each individual as a point $(x, y)$. Usually $x$ is the **explanatory variable** (the one you think helps explain or predict) and $y$ is the **response variable** (the outcome).

Here are ten students' study hours before a test and their scores:

| Hours $x$ | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|---|---|---|
| Score $y$ | 58 | 65 | 60 | 70 | 68 | 77 | 72 | 80 | 85 | 88 |

```plot
{"x": [0, 7], "y": [50, 95], "points": [[0.5, 58], [1, 65], [1.5, 60], [2, 70], [2.5, 68], [3, 77], [3.5, 72], [4, 80], [5, 85], [6, 88]], "functions": [{"f": "5.5*x + 56.4", "label": "ŷ = 5.5x + 56.4", "dashed": true, "from": 0, "to": 7}], "xLabel": "hours studied", "yLabel": "score", "caption": "A strong positive linear association, with the line of best fit"}
```

Describe a scatter plot by:

- *direction*: a **positive association** means $y$ tends to increase as $x$ increases (the cloud slopes up); a **negative association** means $y$ tends to decrease;
- *form*: linear (clustered around a line) or curved;
- *strength*: how tightly the points cluster around that form;
- *unusual points*: any that sit far from the pattern.

The study data show a strong, positive, linear association with no unusual points.

## The correlation coefficient

The **correlation coefficient** $r$ is a number from $-1$ to $1$ that measures the direction and strength of a *linear* association. It's computed by calculators and software; in this course you interpret it rather than compute it by hand.

| $r$ | Meaning |
|---|---|
| $r = 1$ or $r = -1$ | all points lie exactly on a line (rising or falling) |
| about $\pm 0.8$ to $\pm 1$ | strong linear association |
| about $\pm 0.5$ to $\pm 0.8$ | moderate |
| near 0 | weak or no *linear* association |

The sign gives the direction and the size $|r|$ gives the strength, so $r = -0.9$ is stronger than $r = 0.6$. For the study data, $r \approx 0.96$.

Two cautions. First, $r$ only measures straight-line patterns: points on a U-shaped curve can have $r$ near 0 even though $y$ depends on $x$ perfectly. Always look at the plot. Second, $r$ has no units and doesn't change if you swap $x$ and $y$.

## Correlation is not causation

A strong correlation says two variables move together; it does not say one causes the other. Across the months of a year, ice cream sales and swimming-pool accidents are positively correlated, but ice cream doesn't cause accidents. Both rise in hot weather. A variable like temperature, not part of the analysis but affecting both, is a **lurking variable**. Only a controlled experiment, where the researcher changes $x$ on purpose and keeps everything else the same, can establish cause and effect.

## Lines of fit

A **line of fit** is a line drawn through the middle of the cloud of points to model the trend. A quick way to get one is to pick two points that look representative and write the line through them, exactly as in Lesson 11.

### Example 1

Fit a line to the study data using the points $(1, 65)$ and $(5, 85)$, and interpret its slope and intercept.

1. Slope: $m = \dfrac{85 - 65}{5 - 1} = \dfrac{20}{4} = 5$.
2. Point-slope: $y - 65 = 5(x - 1)$, so $y = 5x + 60$.
3. Slope: each extra hour of study goes with about 5 more points, on average.
4. Intercept: a student who studies 0 hours would be predicted to score about 60.

Different people choose different points, so lines drawn this way vary. The standard choice is the **line of best fit** (also called the least-squares regression line), which a calculator finds from all the data. For the study data it is about

$$\hat y = 5.5x + 56.4.$$

The hat on $\hat y$ ("y-hat") marks a *predicted* value, as opposed to an observed $y$. The interpretation is the same as for any slope: about 5.5 more points per extra hour of study, on average.

## Predicting, and how far to trust it

To predict, substitute into the line. A student who studies 4.5 hours is predicted to score $\hat y = 5.5(4.5) + 56.4 \approx 81.2$. Since 4.5 is inside the range of the data (0.5 to 6 hours), this is **interpolation** and is fairly trustworthy.

For 10 hours the line predicts $5.5(10) + 56.4 = 111.4$, which is impossible on a 100-point test. Predicting far outside the data's range is **extrapolation**, and the trend may not continue there.

## Residuals

A **residual** measures how far an actual data point is from the line's prediction:

$$\text{residual} = y - \hat y = \text{actual} - \text{predicted}.$$

A positive residual means the point lies above the line (the actual value beat the prediction); a negative one means it lies below.

### Example 2

Using $\hat y = 5.5x + 56.4$, find the residuals for the students who studied 3 hours (score 77) and 1.5 hours (score 60).

1. At $x = 3$: $\hat y = 5.5(3) + 56.4 = 72.9$. Residual $= 77 - 72.9 = 4.1$. This student scored 4.1 points above the prediction.
2. At $x = 1.5$: $\hat y = 5.5(1.5) + 56.4 = 64.65$. Residual $= 60 - 64.65 = -4.65$. This student scored about 4.65 points below the prediction.

The line of best fit is "best" in a precise sense: of all lines, it makes the sum of the *squared* residuals as small as possible. Its residuals also add to (about) zero, so the points above and below balance.

## Residual plots

A **residual plot** graphs each residual against its $x$-value. It magnifies the leftover pattern that the line didn't capture.

- If a line is a good model, the residual plot looks like random scatter around 0, with no pattern.
- If the residual plot shows a curve (for example, positive at both ends and negative in the middle), the data are curved and a line is the wrong model, even if $r$ is high.

### Example 3

The data $(1, 1), (2, 5), (3, 8), (4, 16), (5, 26), (6, 36), (7, 48), (8, 64)$ have $r \approx 0.98$ and line of best fit $\hat y \approx 8.93x - 14.68$. Is a line a good model?

1. Compute the residuals $y - \hat y$: about $6.8, 1.8, -4.1, -5.0, -4.0, -2.9, 0.2, 7.3$.
2. Plot them against $x$:

```plot
{"x": [0, 9], "y": [-8, 10], "points": [[1, 6.8], [2, 1.8], [3, -4.1], [4, -5.0], [5, -4.0], [6, -2.9], [7, 0.2], [8, 7.3]], "functions": [{"f": "0", "dashed": true}], "xLabel": "x", "yLabel": "residual", "caption": "A U-shaped residual plot: the line overpredicts in the middle and underpredicts at both ends"}
```

3. The residuals are positive, then negative, then positive: a clear U shape. The data curve upward (they look like $y \approx x^2$), so a quadratic model would fit better. The high $r$ alone was misleading. The next lesson shows how to fit curved models like that one.

By contrast, the study-hours residuals from $\hat y = 5.5x + 56.4$ (about $-1.2, 3.1, -4.7, 2.6, -2.2, 4.1, -3.7, 1.6, 1.1, -1.4$ in order of $x$) bounce up and down with no pattern, so the line is a reasonable model there.

## Common mistakes

- Reading $r$ near 0 as "no relationship." It means no *linear* relationship; check the plot for a curve.
- Treating a strong correlation as proof of cause and effect.
- Computing a residual as predicted − actual. It's actual − predicted, so points above the line have positive residuals.
- Trusting a prediction far outside the range of the data.
- Interpreting the slope as an exact rule for each individual rather than an average trend.
- Calling $r = -0.9$ weak because it's negative; strength is about $|r|$.

## Key points

- Describe scatter plots by direction, form, strength and unusual points.
- $-1 \le r \le 1$: the sign is the direction, $|r|$ the strength of the linear pattern.
- Correlation does not imply causation; watch for lurking variables.
- Lines of fit predict $\hat y$; the slope is the average change in $y$ per unit of $x$. Avoid extrapolation.
- Residual = actual − predicted. A patternless residual plot supports a linear model; a curved one does not.
