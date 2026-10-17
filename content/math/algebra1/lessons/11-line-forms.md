---
id: alg-line-forms
module: alg-m3
title: Equations of lines
minutes: 30
topics: [Equations of lines]
drills: [alg-d-line-point-slope, alg-d-line-two-points, alg-d-intercepts]
refs: [alg-ref-equations]
---
A line is determined by its slope and one point on it, or by any two of its points. This lesson turns that geometric fact into equations. You'll learn the three standard forms of a line's equation (slope-intercept, point-slope and standard form), when each is most convenient, and how to graph a line quickly from each.

## Slope-intercept form

A **linear function** has the form $f(x) = mx + b$. Its graph is a line with slope $m$ that crosses the $y$-axis at $(0, b)$. Writing the line as

$$y = mx + b$$

is called **slope-intercept form**. Why does it work? At $x = 0$, $y = b$, so $(0, b)$ is on the line. And each time $x$ increases by 1, $mx$ increases by $m$, so $y$ rises by $m$: that's a slope of $m$.

To graph $y = mx + b$: plot the $y$-intercept $(0, b)$, then use the slope as rise over run to step to a second point, and draw the line through them.

### Example 1

Graph $y = -\tfrac{2}{3}x + 4$.

1. The $y$-intercept is $(0, 4)$.
2. The slope $-\tfrac23$ means down 2 for every 3 to the right. From $(0, 4)$ step to $(3, 2)$, then to $(6, 0)$.
3. Draw the line. It crosses the $x$-axis at $(6, 0)$.

```plot
{"x": [-3, 8], "y": [-2, 7], "functions": [{"f": "-2/3*x + 4", "label": "y = -2/3 x + 4"}], "points": [{"at": [0, 4], "label": "(0, 4)"}, {"at": [3, 2], "label": "(3, 2)"}, {"at": [6, 0], "label": "(6, 0)"}], "segments": [{"from": [0, 4], "to": [3, 4], "dashed": true, "label": "run 3"}, {"from": [3, 4], "to": [3, 2], "dashed": true, "label": "rise -2"}], "equal": true, "caption": "Start at the y-intercept, then step with the slope"}
```

## Point-slope form

If you know the slope $m$ and any point $(x_1, y_1)$ on the line, then for any other point $(x, y)$ on it, the slope formula says $\dfrac{y - y_1}{x - x_1} = m$. Multiply both sides by $x - x_1$:

$$y - y_1 = m(x - x_1).$$

This is **point-slope form**. It's the most direct way to write a line's equation when you aren't given the $y$-intercept.

### Example 2

Write an equation of the line through $(2, -3)$ with slope 4, in slope-intercept form.

1. Point-slope: $y - (-3) = 4(x - 2)$, that is $y + 3 = 4(x - 2)$.
2. Distribute: $y + 3 = 4x - 8$.
3. Subtract 3: $y = 4x - 11$.
4. Check: at $x = 2$, $y = 8 - 11 = -3$. Correct.

### Example 3

Write an equation of the line through $(-1, 6)$ and $(3, -2)$.

1. Slope first: $m = \dfrac{-2 - 6}{3 - (-1)} = \dfrac{-8}{4} = -2$.
2. Point-slope with $(-1, 6)$: $y - 6 = -2(x + 1)$.
3. Simplify: $y - 6 = -2x - 2$, so $y = -2x + 4$.
4. Check the other point: $-2(3) + 4 = -2$. Correct.

Using the other point gives $y + 2 = -2(x - 3)$, which simplifies to the same $y = -2x + 4$.

## Standard form

The **standard form** of a line is

$$Ax + By = C,$$

where $A$ and $B$ are not both zero (otherwise there is no line), usually written with integers $A$, $B$, $C$ and $A \ge 0$. Every line can be written this way, including vertical lines ($x = 5$ is $1x + 0y = 5$), which slope-intercept form can't express.

Standard form makes the intercepts easy to find. Set $y = 0$ to get the $x$-intercept, and $x = 0$ to get the $y$-intercept.

### Example 4

Graph $3x - 4y = 12$ using its intercepts, and find its slope.

1. $x$-intercept: $3x = 12$, so $(4, 0)$.
2. $y$-intercept: $-4y = 12$, so $(0, -3)$.
3. Plot both and draw the line.
4. Slope: solve for $y$. $-4y = -3x + 12$, so $y = \tfrac34 x - 3$, and $m = \tfrac34$. In general, the slope of $Ax + By = C$ is $-\tfrac{A}{B}$ when $B \ne 0$; if $B = 0$, the line is vertical and its slope is undefined.

```plot
{"x": [-3, 7], "y": [-5, 3], "functions": [{"f": "0.75*x - 3", "label": "3x - 4y = 12"}], "points": [{"at": [4, 0], "label": "(4, 0)"}, {"at": [0, -3], "label": "(0, -3)"}], "equal": true, "caption": "Intercepts make standard form quick to graph"}
```

## Horizontal and vertical lines

A horizontal line through $(a, b)$ has slope 0, so its equation is $y = b$: every point has the same $y$-coordinate. A vertical line through $(a, b)$ is $x = a$: every point has the same $x$-coordinate. A vertical line is not the graph of a function (it fails the vertical line test in the most dramatic way possible).

## Choosing a form

| You know | Start with | Notes |
|---|---|---|
| slope and $y$-intercept | $y = mx + b$ | fastest to graph |
| slope and a point | $y - y_1 = m(x - x_1)$ | then simplify if asked |
| two points | compute $m$, then point-slope | check with the second point |
| intercepts, or you need integer coefficients | $Ax + By = C$ | also handles vertical lines |

### Example 5

Write $y = \tfrac25 x - 3$ in standard form with integer coefficients.

1. Multiply by 5 to clear the fraction: $5y = 2x - 15$.
2. Move the $x$ term: $-2x + 5y = -15$.
3. Make $A$ positive by multiplying by $-1$: $2x - 5y = 15$.

## Common mistakes

- Sign errors in point-slope form: through $(-1, 6)$, it's $y - 6 = m(x + 1)$, because $x - (-1) = x + 1$.
- Reading the slope of $Ax + By = C$ as $A$. Solve for $y$ first; the slope is $-\tfrac{A}{B}$.
- Using the run as the rise when graphing from a slope.
- Writing the vertical line through $(4, 1)$ as $y = 4$. Vertical lines are $x = \ldots$
- Stopping at point-slope form when the problem asks for slope-intercept form.

## Key points

- Slope-intercept form $y = mx + b$: slope $m$, $y$-intercept $(0, b)$.
- Point-slope form $y - y_1 = m(x - x_1)$ comes straight from the slope formula.
- Standard form $Ax + By = C$: intercepts by setting $x$ or $y$ to 0; slope $-\tfrac{A}{B}$.
- Horizontal lines are $y = b$; vertical lines are $x = a$.
- From two points: find the slope, then use point-slope form.
