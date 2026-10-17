---
id: alg-domain-range
module: alg-m3
title: Domain, range, and graphs of functions
minutes: 30
topics: [Domain and range, Graphs of functions]
drills: [alg-d-read-graph, alg-d-domain-sqrt]
refs: [alg-ref-functions]
---
The last lesson defined a function's domain and range as its sets of inputs and outputs. This lesson shows how to find them: from a formula, from a graph, and from a real situation. It also builds the habit of reading a graph for its key features, such as intercepts, where it rises and falls, and its highest and lowest points.

## Domain from a formula

When a function is given only by a formula, its domain is every real number for which the formula makes sense. In algebra, two things can go wrong:

1. *Division by zero.* A denominator can't be 0.
2. *Even roots of negative numbers.* $\sqrt{u}$ (and $\sqrt[4]{u}$, and so on) requires $u \ge 0$ to give a real number.

Polynomials like $3x^2 - x + 5$ have neither problem, so their domain is all real numbers, $(-\infty, \infty)$. Odd roots, like $\sqrt[3]{x}$, work for negative inputs too (Lesson 29 graphs $y = \sqrt[3]{x}$).

### Example 1

Find the domain of $f(x) = \dfrac{x + 2}{x - 5}$ and of $g(x) = \sqrt{3 - 2x}$.

1. For $f$, the only problem is a zero denominator: $x - 5 = 0$ at $x = 5$. Domain: all reals except 5, written $(-\infty, 5) \cup (5, \infty)$.
2. For $g$, the radicand must be nonnegative: $3 - 2x \ge 0$, so $-2x \ge -3$ and (dividing by $-2$, flipping) $x \le \tfrac32$. Domain: $(-\infty, \tfrac32]$.

### Example 2

Find the domain of $h(x) = \dfrac{1}{\sqrt{x + 4}}$.

The square root needs $x + 4 \ge 0$, and it's in the denominator so it also can't be 0. Together, $x + 4 > 0$, so $x > -4$. Domain: $(-4, \infty)$.

## Domain and range from a graph

On a graph, the domain is the set of $x$-values the graph covers, which you see by squashing the graph flat onto the $x$-axis. The range is the set of $y$-values it covers, seen by squashing it onto the $y$-axis. Solid dots mean an endpoint is included, open dots mean it isn't, and arrows mean the graph continues forever.

```plot
{"x": [-4, 6], "y": [-6, 5], "functions": [{"f": "-(x - 1)^2 + 4", "from": -2, "to": 4}], "points": [{"at": [-2, -5], "label": "(-2, -5)"}, {"at": [4, -5], "open": true, "label": "(4, -5)"}, {"at": [1, 4], "label": "(1, 4)"}, {"at": [-1, 0], "label": "(-1, 0)"}, {"at": [3, 0], "label": "(3, 0)"}, {"at": [0, 3], "label": "(0, 3)"}], "caption": "A parabola segment from x = -2 (closed dot) to x = 4 (open dot)"}
```

The graph above is $f(x) = -(x - 1)^2 + 4$ restricted to $-2 \le x < 4$, with a closed dot at the left end and an open dot at the right end. Both ends are at height $-5$.

- Domain: the $x$-values run from $-2$ (included) to 4 (not included): $[-2, 4)$.
- Range: the highest point is the vertex at height 4. The lowest height reached is $-5$, at the included left endpoint. So the range is $[-5, 4]$. Note that the open dot at the right doesn't matter for the range, because the height $-5$ is already reached at $x = -2$.

## Key features of a graph

Reading a graph means answering a handful of standard questions.

- *Intercepts.* The **y-intercept** is where the graph crosses the $y$-axis, the point $(0, f(0))$. An **x-intercept** is where it meets the $x$-axis; those $x$-values are the **zeros** of $f$, the solutions of $f(x) = 0$. Above, the $y$-intercept is $(0, 3)$ and the zeros are $-1$ and 3.
- *Increasing and decreasing.* A function is **increasing** on an interval if the graph rises as you move right, and **decreasing** if it falls. Above, $f$ increases on $(-2, 1)$ and decreases on $(1, 4)$. These intervals describe $x$-values.
- *Maximum and minimum.* The highest point gives the **maximum value** (here 4, at $x = 1$). The lowest gives the **minimum value**.
- *Sign.* $f(x) > 0$ where the graph is above the $x$-axis (here on $(-1, 3)$), and $f(x) < 0$ where it is below.

### Example 3

The graph shows $g(x) = |x + 1| - 2$.

```plot
{"x": [-6, 4], "y": [-3, 4], "functions": [{"f": "abs(x + 1) - 2", "label": "y = g(x)"}], "points": [{"at": [-1, -2], "label": "(-1, -2)"}, {"at": [-3, 0], "label": "(-3, 0)"}, {"at": [1, 0], "label": "(1, 0)"}, {"at": [0, -1], "label": "(0, -1)"}], "caption": "g(x) = |x + 1| - 2"}
```

1. Domain: the V extends forever both ways, so $(-\infty, \infty)$.
2. Range: the lowest point is the corner at height $-2$, and the arms go up forever: $[-2, \infty)$.
3. Zeros: $x = -3$ and $x = 1$. Check: $g(1) = |2| - 2 = 0$.
4. $y$-intercept: $g(0) = 1 - 2 = -1$.
5. Decreasing on $(-\infty, -1)$, increasing on $(-1, \infty)$, minimum value $-2$.
6. $g(x) < 0$ for $-3 < x < 1$, where the V dips below the axis.

## Domain from context

A formula may make sense for more inputs than the situation allows. If a ball's height after $t$ seconds is $h(t) = -16t^2 + 64t$, the formula works for any $t$, but the physical model only applies from launch ($t = 0$) until it lands. The height is 0 at launch ($t = 0$) and again at $t = 4$, since $h(4) = -16(16) + 64(4) = -256 + 256 = 0$, so the practical domain is $[0, 4]$. The **practical domain** (or reasonable domain) is the set of inputs that make sense in context.

## A gallery of basic functions

These shapes appear again and again; knowing their domains and ranges by sight saves work.

| Function | Domain | Range |
|---|---|---|
| $f(x) = x$ | $(-\infty, \infty)$ | $(-\infty, \infty)$ |
| $f(x) = x^2$ | $(-\infty, \infty)$ | $[0, \infty)$ |
| $f(x) = \lvert x \rvert$ | $(-\infty, \infty)$ | $[0, \infty)$ |
| $f(x) = \sqrt{x}$ | $[0, \infty)$ | $[0, \infty)$ |
| $f(x) = \tfrac{1}{x}$ | $x \ne 0$ | $y \ne 0$ |
| $f(x) = x^3$ | $(-\infty, \infty)$ | $(-\infty, \infty)$ |

```plot
{"x": [-4, 4], "y": [-3, 5], "functions": [{"f": "x^2", "label": "x²"}, {"f": "sqrt(x)", "label": "√x", "dashed": true}, {"f": "x^3", "label": "x³", "from": -2.4, "to": 2.4}], "caption": "Three basic shapes: the parabola x², the half-parabola √x and the cubic x³"}
```

## Common mistakes

- Giving the domain as $y$-values or the range as $x$-values. Domain is horizontal, range is vertical.
- Forgetting to exclude values that make a denominator zero, or including them when the root is in a denominator.
- Writing increasing/decreasing intervals with $y$-values instead of $x$-values.
- Treating an open endpoint as excluding a range value that is reached elsewhere on the graph.
- Ignoring the context: negative times or lengths are usually not in the practical domain.

## Key points

- Domain from a formula: exclude zeros of denominators and inputs that make even roots negative.
- On a graph, the domain is the horizontal extent and the range is the vertical extent.
- Zeros are the $x$-intercepts; the $y$-intercept is $(0, f(0))$.
- Increasing and decreasing intervals, and positive and negative intervals, are stated in terms of $x$.
- In applications, restrict the domain to inputs that make sense.
