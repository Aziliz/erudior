---
id: a1-m8-h-least-squares
module: a1-m8
title: "Honors: Where the line of best fit comes from"
minutes: 50
honors: true
topics: [Least-squares regression]
drills: [a1-m8-r2-lsrl-points, a1-m8-r2-lsrl-summary, a1-m8-r2-r-squared]
refs: [a1-ref-data]
---
Lessons 35 and 36 let a calculator find the line of best fit and said it is "best" because it makes the sum of the squared residuals as small as possible. This lesson opens the calculator up. Using nothing more than the vertex of a parabola from Module 6, you'll see why the best line always passes through the point of averages, derive the formula for its slope, connect that slope to the correlation coefficient $r$, and learn what $r^2$ measures. Along the way you'll meet a surprising consequence called regression to the mean.

## Why square the residuals?

A line of fit should make the residuals $y - \hat y$ small overall. Adding them up doesn't work as a measure: positive and negative residuals cancel, and in fact *every* line through the point of averages $(\bar x, \bar y)$ has residuals that add to exactly 0, including terrible ones. Squaring makes every residual count as a positive amount, and it counts big misses heavily (a residual of 4 costs 16, while two residuals of 2 cost only 8 together).

The **least-squares regression line** is the line that makes the **sum of squared residuals**

$$\text{SSE} = \sum (y - \hat y)^2$$

as small as possible. ("SSE" stands for "sum of squared errors," another name for residuals.) Squaring is a choice, not the only reasonable one: adding the absolute values of the residuals also works and is sometimes used, because it is less affected by outliers. Squares became the standard because they lead to simple exact formulas, as you're about to see. The method was first published by Adrien-Marie Legendre in 1805; Carl Friedrich Gauss published it in 1809 and said he had been using it since the 1790s, and historians still debate how much credit each deserves.

## The setup: deviations from the means

Everything is easier if you measure each value from its mean. For each data point, write

$$d_x = x - \bar x, \qquad d_y = y - \bar y.$$

These are the same deviations used for the standard deviation in Lesson 33, and as there, each set adds to 0. Any line through $(\bar x, \bar y)$ with slope $m$ is $\hat y - \bar y = m(x - \bar x)$, so its predicted deviation is $m\,d_x$ and each residual is

$$y - \hat y = d_y - m\,d_x.$$

## Step 1: the best line passes through the point of averages

Fix any slope $m$ and ask which intercept is best. With $\hat y = mx + c$, each residual is $(y - mx) - c$. Write $u = y - mx$ for each point; then you want the number $c$ that makes $\sum (u - c)^2$ smallest. Expanding,

$$\sum (u - c)^2 = n c^2 - 2c\sum u + \sum u^2,$$

a quadratic in $c$ that opens upward. Its vertex is at $c = \dfrac{2\sum u}{2n} = \dfrac{\sum u}{n}$, the mean of the $u$'s, which is $\bar y - m\bar x$. So the best intercept is $c = \bar y - m\bar x$, which says exactly that the point $(\bar x, \bar y)$ lies on the line. Whatever the slope, the least-squares line goes through the point of averages. (The same calculation proves a fact about the mean itself: of all numbers, the mean is the one whose squared distances to the data add up to the least. That is one reason the mean and the standard deviation belong together.)

## Step 2: the best slope is the vertex of a parabola

Now only the slope is left. Using the residuals $d_y - m\,d_x$, the sum of squared residuals as a function of $m$ is

$$S(m) = \sum (d_y - m\,d_x)^2 = \Big(\sum d_x^2\Big)m^2 - 2\Big(\sum d_x d_y\Big)m + \sum d_y^2.$$

This is a quadratic in $m$ of the form $Am^2 + Bm + C$ with $A = \sum d_x^2 > 0$, so its graph opens upward and its lowest point is the vertex, $m = -\dfrac{B}{2A}$:

$$b = \frac{\sum d_x d_y}{\sum d_x^2}, \qquad a = \bar y - b\,\bar x.$$

These two formulas are the least-squares line $\hat y = a + bx$, or $\hat y = bx + a$ in the slope-intercept form you know.

### Example 1

Find the least-squares line for $(1, 2), (2, 3), (3, 5), (4, 4), (5, 6)$.

1. Means: $\bar x = \tfrac{15}{5} = 3$ and $\bar y = \tfrac{20}{5} = 4$.
2. Deviations and products:

| $x$ | $y$ | $d_x$ | $d_y$ | $d_x d_y$ | $d_x^2$ | $d_y^2$ |
|---|---|---|---|---|---|---|
| 1 | 2 | $-2$ | $-2$ | 4 | 4 | 4 |
| 2 | 3 | $-1$ | $-1$ | 1 | 1 | 1 |
| 3 | 5 | 0 | 1 | 0 | 0 | 1 |
| 4 | 4 | 1 | 0 | 0 | 1 | 0 |
| 5 | 6 | 2 | 2 | 4 | 4 | 4 |
| Sum | | 0 | 0 | 9 | 10 | 10 |

3. Slope: $b = \tfrac{9}{10} = 0.9$. Intercept: $a = 4 - 0.9(3) = 1.3$. The line is $\hat y = 0.9x + 1.3$.
4. Check: $S(m) = 10m^2 - 18m + 10$, whose vertex is at $m = \tfrac{18}{20} = 0.9$ with $S(0.9) = 1.9$. Any other slope does worse; for example $S(1) = 2$ and $S(0.5) = 3.5$.

![The five data points with the line y-hat equals 0.9x plus 1.3 passing through the point of averages (3, 4). Each residual is drawn as a dashed vertical segment with a shaded square on it whose area is the squared residual. A table lists residuals negative 0.2, negative 0.1, 1.0, negative 0.9 and 0.2, which add to 0, and squared residuals 0.04, 0.01, 1.00, 0.81 and 0.04, which add to 1.90.](images/a1-m8-squares.svg)

```plot
{"x": [0, 1.8], "y": [0, 12], "functions": [{"f": "10x^2 - 18x + 10"}], "points": [{"at": [0.9, 1.9]}], "labels": [{"at": [0.9, 8.5], "text": "S(m) = 10m² − 18m + 10"}, {"at": [0.9, 0.7], "text": "minimum at m = 0.9, S = 1.9"}], "xLabel": "slope m", "yLabel": "sum of squared residuals", "caption": "The sum of squared residuals is a parabola in the slope; the least-squares slope is its vertex"}
```

## The slope and the correlation coefficient

The correlation coefficient that calculators report can be written with the same sums:

$$r = \frac{\sum d_x d_y}{\sqrt{\sum d_x^2 \cdot \sum d_y^2}}.$$

The numerator is the heart of it. A point above and to the right of $(\bar x, \bar y)$ has $d_x > 0$ and $d_y > 0$, so it adds a positive product; so does a point below and to the left. Points in the other two corners add negative products. A rising cloud has mostly positive products, so $r > 0$; a falling cloud, $r < 0$. The denominator scales the result so that $r$ always lands between $-1$ and $1$. (Dividing each $d_x$ and $d_y$ by its standard deviation turns them into z-scores, and $r$ is the average product of the z-scores, $r = \tfrac{1}{n}\sum z_x z_y$, when the standard deviations divide by $n$.)

Comparing the formulas for $b$ and $r$, and using $\sum d_x^2 = n\sigma_x^2$ and $\sum d_y^2 = n\sigma_y^2$, gives the slope in terms of summary statistics:

$$b = r\,\frac{\sigma_y}{\sigma_x}.$$

The $n$'s cancel, so the formula gives the same slope whether you use population ($\div n$) or sample ($\div (n-1)$) standard deviations, as long as both are the same kind. In words: for every standard deviation that $x$ increases, the line predicts that $y$ increases by $r$ standard deviations.

### Example 2

For the study-hours data of Lesson 35, $\bar x = 2.9$ hours, $\bar y = 72.3$ points, $\sigma_x \approx 1.67$, $\sigma_y \approx 9.60$ and $r \approx 0.956$. Find the least-squares line.

1. Slope: $b = 0.956 \times \dfrac{9.60}{1.67} \approx 5.50$ points per hour.
2. Intercept: $a = \bar y - b\bar x \approx 72.3 - 5.50(2.9) \approx 56.4$.
3. The line is $\hat y \approx 5.5x + 56.4$, the same line Lesson 35 got from a calculator. (Keep the unrounded slope when computing $a$ if you want more decimal places to agree.)

## How much does the line explain? $r^2$

Before knowing $x$, the best single prediction of $y$ is $\bar y$, and its squared misses add to $\sum d_y^2$, the total variation in $y$. The line's misses add to SSE. The fraction of the variation that the line removes is the **coefficient of determination**:

$$r^2 = 1 - \frac{\text{SSE}}{\sum d_y^2}.$$

It really is the square of $r$. The lowest value of the parabola $S(m) = Am^2 + Bm + C$ is $C - \dfrac{B^2}{4A}$, which here is $\sum d_y^2 - \dfrac{(\sum d_x d_y)^2}{\sum d_x^2} = \sum d_y^2\,(1 - r^2)$. Dividing by $\sum d_y^2$ gives $\tfrac{\text{SSE}}{\sum d_y^2} = 1 - r^2$.

- In Example 1, $r = \tfrac{9}{\sqrt{10 \cdot 10}} = 0.9$ and $r^2 = 1 - \tfrac{1.9}{10} = 0.81$: the line accounts for 81% of the variation in $y$.
- For the study data, $r^2 \approx 0.956^2 \approx 0.91$: about 91% of the variation in test scores is accounted for by the linear relationship with hours studied. The other 9% comes from everything else (sleep, prior knowledge, luck).

"Explained" here is a statistical word, not a claim about cause: $r^2$ says how well the line *predicts*, not why.

## Regression to the mean

Rewrite the line in standard-deviation units. Since the line passes through $(\bar x, \bar y)$ with slope $r\sigma_y/\sigma_x$,

$$\frac{\hat y - \bar y}{\sigma_y} = r \cdot \frac{x - \bar x}{\sigma_x}, \qquad\text{that is,}\qquad \hat z_y = r\,z_x.$$

Unless the points lie exactly on a line, $|r| < 1$, so whenever $x$ is not exactly at its mean, the prediction is fewer standard deviations from its mean than $x$ was from its own. This is **regression to the mean**. Francis Galton described it in 1886 after measuring the heights of parents and their adult children: children of very tall parents were, on average, tall, but less extremely tall than their parents, and children of very short parents were less extremely short. Galton called it "regression towards mediocrity," and the word "regression" for fitting lines comes from his work.

### Example 3

Suppose (as an illustration, not real data) that scores on two quizzes have correlation $r = 0.5$, the first quiz has mean 70 and standard deviation 10, and the second has mean 75 and standard deviation 8. Predict the second-quiz score of a student who scored 90 on the first.

1. Standardize: $z_x = \dfrac{90 - 70}{10} = 2$.
2. Regress: $\hat z_y = 0.5 \times 2 = 1$.
3. Convert back: $\hat y = 75 + 1(8) = 83$.
4. The student was 2 standard deviations above average on quiz 1 but is predicted to be only 1 above on quiz 2. Nothing about the student changed; part of any extreme score is luck that is not expected to repeat.

Regression to the mean also explains why swapping the variables gives a different line. Predicting $x$ from $y$ uses $\hat z_x = r z_y$, which also pulls toward the mean, so it is not the same line solved for $x$ (unless $r = \pm 1$).

## Common mistakes

- Thinking the least-squares line makes the residuals add to as little as possible. They add to 0 for many lines; it is the *squared* residuals that are minimized.
- Using $b = r \cdot \frac{\sigma_x}{\sigma_y}$, upside down. The $y$-spread goes on top because the slope is in $y$-units per $x$-unit.
- Forgetting that the line passes through $(\bar x, \bar y)$, which is the quickest way to find $a$.
- Reading $r^2 = 0.81$ as "81% of the points are on the line," or as proof that $x$ causes $y$.
- Rounding $b$ heavily before computing $a = \bar y - b\bar x$, which can shift $a$ noticeably when $\bar x$ is large.
- Expecting an extreme value to be followed by an equally extreme one. With $|r| < 1$, predictions move toward the mean.

## Key points

- The least-squares line minimizes $\text{SSE} = \sum (y - \hat y)^2$; its residuals add to 0.
- It always passes through $(\bar x, \bar y)$; its slope is $b = \dfrac{\sum d_x d_y}{\sum d_x^2}$, the vertex of a parabola in $m$, and $a = \bar y - b\bar x$.
- $r = \dfrac{\sum d_x d_y}{\sqrt{\sum d_x^2 \sum d_y^2}}$ and $b = r\dfrac{\sigma_y}{\sigma_x}$.
- $r^2 = 1 - \dfrac{\text{SSE}}{\sum d_y^2}$ is the fraction of the variation in $y$ that the line accounts for.
- In z-scores the line is $\hat z_y = r z_x$: predictions regress toward the mean.
