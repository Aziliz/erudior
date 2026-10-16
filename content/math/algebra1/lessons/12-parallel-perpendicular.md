---
id: alg-parallel-perp
module: alg-m3
title: Parallel and perpendicular lines; linear models
minutes: 30
topics: [Parallel and perpendicular, Linear models]
drills: [alg-d-perp-line, alg-d-linear-model]
refs: [alg-ref-equations]
---
Slope tells you the direction of a line, so comparing slopes tells you how two lines are positioned relative to each other. This lesson shows that parallel lines have equal slopes and perpendicular lines have slopes that are negative reciprocals, then uses lines to model real data: writing a linear function from a description, interpreting its slope and intercept, and making predictions.

## Parallel lines

Two distinct lines in a plane are **parallel lines** if they never meet. Lines with the same slope rise at the same rate, so the gap between them never changes: they're parallel. Conversely, lines with different slopes must eventually cross. So:

> Two non-vertical lines are parallel exactly when they have the same slope and different $y$-intercepts. All vertical lines are parallel to each other.

If two lines have the same slope and the same intercept, they're the same line, not two parallel ones.

### Example 1

Write the equation of the line through $(4, -1)$ parallel to $3x + 2y = 6$.

1. Find the given line's slope: $2y = -3x + 6$, so $y = -\tfrac32 x + 3$ and $m = -\tfrac32$.
2. The new line has the same slope. Point-slope: $y + 1 = -\tfrac32(x - 4)$.
3. Simplify: $y + 1 = -\tfrac32 x + 6$, so $y = -\tfrac32 x + 5$.

## Perpendicular lines

**Perpendicular lines** meet at a right angle. Their slopes have a neat relationship: if one line has slope $m$ (not 0), a perpendicular line has slope $-\tfrac{1}{m}$, the **negative reciprocal**. Equivalently, the product of their slopes is $-1$.

Here's why. Take a slope triangle for the first line: run $a$, rise $b$, so $m = \tfrac{b}{a}$. Rotate the whole picture $90°$ counterclockwise. The run $a$ becomes a rise of $a$, and the rise $b$ becomes a run of $-b$ (pointing left). The rotated line is perpendicular to the original and has slope $\tfrac{a}{-b} = -\tfrac{a}{b} = -\tfrac{1}{m}$.

```plot
{"x": [-5, 5], "y": [-4, 4], "functions": [{"f": "2*x/3", "label": "m = 2/3"}, {"f": "-3*x/2", "label": "m = -3/2"}], "segments": [{"from": [0, 0], "to": [3, 0], "dashed": true}, {"from": [3, 0], "to": [3, 2], "dashed": true}, {"from": [0, 0], "to": [0, 3], "dashed": true}, {"from": [0, 3], "to": [-2, 3], "dashed": true}], "rightAngles": [[[0, 0], [3, 2], [-2, 3]]], "equal": true, "caption": "Rotating the slope triangle 90° turns slope 2/3 into slope -3/2"}
```

Horizontal and vertical lines are perpendicular to each other; this is the case the formula can't handle, since 0 has no reciprocal.

| Line slope | Parallel slope | Perpendicular slope |
|---|---|---|
| $2$ | $2$ | $-\tfrac12$ |
| $-\tfrac34$ | $-\tfrac34$ | $\tfrac43$ |
| $0$ (horizontal) | $0$ | undefined (vertical) |

### Example 2

Write the equation of the line through $(-2, 5)$ perpendicular to $y = \tfrac25 x - 1$.

1. The given slope is $\tfrac25$. The perpendicular slope is $-\tfrac52$.
2. Point-slope: $y - 5 = -\tfrac52(x + 2)$.
3. Simplify: $y - 5 = -\tfrac52 x - 5$, so $y = -\tfrac52 x$.
4. Check: at $x = -2$, $y = 5$. And $\tfrac25 \cdot \left(-\tfrac52\right) = -1$.

### Example 3

Are the lines $4x - 6y = 3$ and $3x + 2y = 8$ parallel, perpendicular or neither?

1. Slopes: $-\tfrac{A}{B}$ gives $-\tfrac{4}{-6} = \tfrac23$ and $-\tfrac32$.
2. Product: $\tfrac23 \cdot \left(-\tfrac32\right) = -1$. The lines are perpendicular.

## Linear models

A **linear model** describes a quantity that changes at a constant rate. In $y = mx + b$ form:

- the slope $m$ is the rate of change (units of $y$ per unit of $x$);
- the intercept $b$ is the starting value, the output when the input is 0.

### Example 4

A plumber charges a fixed call-out fee plus an hourly rate. A 2-hour job costs $190 and a 5-hour job costs $385. Write the cost $C$ as a function of hours $h$, interpret the parameters, and predict the cost of a 3.5-hour job.

1. Two data points: $(2, 190)$ and $(5, 385)$.
2. Slope: $m = \dfrac{385 - 190}{5 - 2} = \dfrac{195}{3} = 65$ dollars per hour.
3. Point-slope: $C - 190 = 65(h - 2)$, so $C = 65h + 60$.
4. Interpretation: $65 an hour, plus a $60 call-out fee (the cost at $h = 0$).
5. Prediction: $C(3.5) = 65(3.5) + 60 = 287.50$ dollars.

```plot
{"x": [0, 7], "y": [0, 520], "functions": [{"f": "65*x + 60", "label": "C = 65h + 60"}], "points": [{"at": [2, 190], "label": "(2, 190)"}, {"at": [5, 385], "label": "(5, 385)"}, {"at": [3.5, 287.5], "label": "(3.5, 287.5)"}], "xLabel": "hours", "yLabel": "cost ($)", "caption": "A linear cost model"}
```

### Example 5

A city had 48,000 residents in 2010 and 55,200 in 2022. Assuming linear growth, write a model and estimate the population in 2030.

1. Let $t$ be years since 2010. Points $(0, 48000)$ and $(12, 55200)$.
2. Slope: $\dfrac{7200}{12} = 600$ people per year. Intercept: 48,000.
3. Model: $P(t) = 600t + 48000$.
4. 2030 is $t = 20$: $P(20) = 12000 + 48000 = 60000$.

Predicting inside the range of your data (**interpolation**) is usually safer than predicting beyond it (**extrapolation**), because the trend may not continue.

## Using slopes in geometry

Slopes give a quick test for right angles and parallel sides in figures on a coordinate grid.

### Example 6

Show that the triangle with vertices $O(0, 0)$, $A(4, 2)$ and $B(3, 4)$ is a right triangle.

1. Slope of $OA$: $\tfrac{2 - 0}{4 - 0} = \tfrac12$.
2. Slope of $AB$: $\tfrac{4 - 2}{3 - 4} = -2$.
3. The product is $\tfrac12 \cdot (-2) = -1$, so $OA \perp AB$ and the triangle has a right angle at $A$.

```plot
{"x": [-1, 6], "y": [-1, 5], "equal": true, "polygons": [{"points": [[0, 0], [4, 2], [3, 4]]}], "rightAngles": [[[4, 2], [0, 0], [3, 4]]], "points": [{"at": [0, 0], "label": "O"}, {"at": [4, 2], "label": "A"}, {"at": [3, 4], "label": "B"}], "caption": "Slopes 1/2 and -2 multiply to -1: a right angle at A"}
```

## Common mistakes

- Using the reciprocal without changing the sign (or the opposite without flipping) for a perpendicular slope. Both changes are needed.
- Calling lines with equal slopes parallel when they also have the same intercept: that's one line.
- Comparing slopes without first solving for $y$ (or using $-\tfrac{A}{B}$).
- Mixing up the slope and intercept in a model: the fixed fee is the intercept, the per-unit rate is the slope.
- Trusting extrapolations far outside the data.

## Key points

- Parallel: equal slopes (different intercepts). Perpendicular: slopes multiply to $-1$, $m_2 = -\tfrac{1}{m_1}$.
- Horizontal and vertical lines are perpendicular to each other.
- In a linear model, slope is the constant rate of change and the intercept is the starting value.
- Build a model from two data points just like a line through two points.
- Interpolation is more reliable than extrapolation.
