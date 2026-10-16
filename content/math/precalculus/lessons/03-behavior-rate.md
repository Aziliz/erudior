---
id: pc-behavior
module: pc-m1
title: Increasing, decreasing, extrema and average rate of change
minutes: 30
topics: [Function behavior, Average rate of change]
drills: [pc-avg-rate, pc-diff-quotient, pc-quad-extremum]
refs: [pc-ref-functions]
---
## From values to behavior

The last two lessons were about single values: what is $f(3)$, where is $f$ defined. This lesson is about *behavior*: where a function rises and falls, where it peaks, and how fast it changes. These are exactly the questions calculus answers with derivatives. Here we answer them with graphs and algebra, and the average rate of change you learn today becomes the derivative in the last module of the course.

## Increasing, decreasing and constant

Reading left to right, a function is **increasing** on an interval if its graph rises there: whenever $x_1 < x_2$ in the interval, $f(x_1) < f(x_2)$. It is **decreasing** if the graph falls: $x_1 < x_2$ implies $f(x_1) > f(x_2)$. It is **constant** if $f(x_1) = f(x_2)$ for all $x_1, x_2$ in the interval.

These are statements about $x$-intervals. Convention: use open intervals, because at a turning point the function is neither rising nor falling.

```plot
{"x": [-3, 4], "y": [-10, 8], "functions": [{"f": "x^3 - 1.5x^2 - 6x + 2", "from": -2.6, "to": 3.8, "label": "y = f(x)"}], "points": [{"at": [-1, 5.5], "label": "local max (−1, 5.5)"}, {"at": [2, -8], "label": "local min (2, −8)"}], "caption": "f increases on (−∞, −1), decreases on (−1, 2), then increases on (2, ∞)."}
```

## Local and absolute extrema

A **local maximum** of $f$ is a value $f(c)$ that is at least as large as every nearby value: the top of a hill. A **local minimum** is the bottom of a valley. Together they are **local extrema**. The **absolute maximum** is the largest value $f$ ever takes on its whole domain (if there is one), and the **absolute minimum** the smallest.

Vocabulary to keep straight: the maximum *value* is the $y$-coordinate $f(c)$; it *occurs at* $x = c$. "The maximum is 5.5 at $x = -1$."

For a quadratic $f(x) = ax^2 + bx + c$ you can find the extreme value without a graph. The vertex is at

$$x = -\frac{b}{2a},$$

which comes from completing the square: $ax^2 + bx + c = a\left(x + \frac{b}{2a}\right)^2 + c - \frac{b^2}{4a}$. The squared term is zero exactly at $x = -\frac{b}{2a}$ and positive elsewhere. If $a > 0$ the vertex is a minimum; if $a < 0$ it is a maximum.

### Example 1

A ball's height in meters after $t$ seconds is $h(t) = -4.9t^2 + 19.6t + 1.5$. When does it peak, and how high?

1. $a = -4.9 < 0$, so the vertex is a maximum.
2. $t = -\dfrac{b}{2a} = -\dfrac{19.6}{2(-4.9)} = 2$ seconds.
3. $h(2) = -4.9(4) + 19.6(2) + 1.5 = -19.6 + 39.2 + 1.5 = 21.1$ meters.

The ball rises on $(0, 2)$ and falls after $t = 2$.

## Average rate of change

The **average rate of change** of $f$ from $x = a$ to $x = b$ is the change in output divided by the change in input:

$$\frac{\Delta y}{\Delta x} = \frac{f(b) - f(a)}{b - a}.$$

Geometrically, it is the slope of the **secant line** through the points $(a, f(a))$ and $(b, f(b))$. Its units are output units per input unit: meters per second, dollars per year.

```plot
{"x": [-1, 5], "y": [-2, 18], "functions": [{"f": "x^2", "label": "y = x²"}, {"f": "5x - 4", "dashed": true, "label": "secant"}], "points": [{"at": [1, 1], "label": "(1, 1)"}, {"at": [4, 16], "label": "(4, 16)"}], "caption": "The secant line from x = 1 to x = 4 on y = x² has slope (16 − 1)/(4 − 1) = 5."}
```

### Example 2

For $h(t) = -4.9t^2 + 19.6t + 1.5$, find the average rate of change on $[0, 1]$ and on $[1, 3]$.

- $h(0) = 1.5$ and $h(1) = -4.9 + 19.6 + 1.5 = 16.2$. Rate: $\dfrac{16.2 - 1.5}{1 - 0} = 14.7$ m/s.
- $h(3) = -44.1 + 58.8 + 1.5 = 16.2$. Rate on $[1, 3]$: $\dfrac{16.2 - 16.2}{3 - 1} = 0$ m/s.

The second answer does not mean the ball stood still. It went up and came back to the same height, so its *average* velocity over that window was zero. An average hides what happens in between, which is why calculus later shrinks the interval.

## The difference quotient

If we make the interval run from $x$ to $x + h$, the average rate of change becomes the **difference quotient**:

$$\frac{f(x + h) - f(x)}{h}, \qquad h \ne 0.$$

It is the slope of the secant line from $(x, f(x))$ to a point $h$ units to the right. In Module 10 you will let $h$ shrink to 0 to get the slope of the tangent line, the derivative. For now the skill is the algebra: expand, cancel, then divide by $h$.

### Example 3

Simplify the difference quotient for $f(x) = 2x^2 - 3x$.

1. Find $f(x + h)$, substituting the whole input: $2(x+h)^2 - 3(x+h) = 2x^2 + 4xh + 2h^2 - 3x - 3h$.
2. Subtract $f(x) = 2x^2 - 3x$: the $2x^2$ and $-3x$ cancel, leaving $4xh + 2h^2 - 3h$.
3. Every remaining term has a factor $h$ (it must, since the difference is 0 when $h = 0$). Divide:

$$\frac{4xh + 2h^2 - 3h}{h} = 4x + 2h - 3.$$

If you ever end up with a term without $h$ in step 2, something went wrong: recheck the expansion.

### Example 4

Simplify the difference quotient for $f(x) = \dfrac{1}{x}$.

$$\frac{\frac{1}{x+h} - \frac{1}{x}}{h} = \frac{\frac{x - (x+h)}{x(x+h)}}{h} = \frac{-h}{x(x+h)\,h} = -\frac{1}{x(x+h)}.$$

The key step is combining the two fractions over the common denominator $x(x+h)$ before dividing by $h$.

## Common mistakes

- *Giving $y$-values for "where is $f$ increasing".* The answer is an interval of $x$-values.
- *Confusing where and what.* The maximum value is $f(c)$; it occurs at $x = c$.
- *Subtracting in different orders.* Use $f(b) - f(a)$ over $b - a$, both in the same order.
- *$f(x + h) = f(x) + h$.* Substitute $x + h$ for every $x$ and expand fully.
- *Dividing by $h$ before cancelling.* Cancel the terms without $h$ first; then every term has a factor $h$.

## Key points

- Increasing / decreasing are judged left to right and reported as open $x$-intervals.
- Local extrema are hilltops and valley floors; absolute extrema are the overall highest and lowest values.
- A quadratic $ax^2 + bx + c$ has its vertex at $x = -b/(2a)$: a minimum if $a > 0$, a maximum if $a < 0$.
- Average rate of change $= \dfrac{f(b) - f(a)}{b - a}$ = slope of the secant line.
- The difference quotient $\dfrac{f(x+h) - f(x)}{h}$ is the same idea on $[x, x + h]$ and leads to the derivative.
