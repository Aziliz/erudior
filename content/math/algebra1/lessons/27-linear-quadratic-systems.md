---
id: a1-solve-fg
module: alg-m6
title: "Solving f(x) = g(x): linear-quadratic systems and intersections"
minutes: 30
topics: [Solving f(x) = g(x)]
drills: [a1-d-lin-quad-system, a1-d-intersection-count, a1-d-abs-line]
refs: [alg-ref-polynomials, alg-ref-equations]
---
In Lesson 14 you solved systems of two linear equations, and a solution was a point where two lines cross. This lesson keeps that idea but lets one of the graphs curve. You'll solve systems made of a line and a parabola exactly, with substitution and the quadratic-solving methods from Lessons 22–24, and you'll see how to solve any equation of the form $f(x) = g(x)$ from a graph or a table when algebra alone can't finish the job.

## Why intersections solve $f(x) = g(x)$

Graph $y = f(x)$ and $y = g(x)$ on the same axes. A point $(a, b)$ lies on both graphs exactly when $b = f(a)$ and $b = g(a)$, and that forces $f(a) = g(a)$. Going the other way, if $f(a) = g(a)$, then the point $(a, f(a))$ is on both graphs. So:

> The solutions of the equation $f(x) = g(x)$ are the $x$-coordinates of the points where the graphs of $y = f(x)$ and $y = g(x)$ intersect.

The $y$-coordinate is the common output value at that input. When a question asks you to solve $f(x) = g(x)$, it wants the $x$-values; when it asks for the solutions of the *system* $y = f(x)$, $y = g(x)$, it wants the points $(x, y)$.

The same fact explains a trick from Lesson 9: the solutions of $f(x) = 0$ are the $x$-intercepts, where $y = f(x)$ meets the graph of $y = 0$, the $x$-axis.

## Lines and parabolas

A **linear-quadratic system** pairs a linear equation with a quadratic one, such as $y = x^2$ and $y = x + 2$. A line and a parabola can meet in two points, in one point, or not at all.

```plot
{"x": [-3, 4], "y": [-3, 8], "functions": [{"f": "x^2", "label": "y = x²"}, {"f": "x + 2", "label": "y = x + 2"}, {"f": "2*x - 1", "label": "y = 2x - 1", "dashed": true}, {"f": "x - 2", "label": "y = x - 2", "dashed": true}], "points": [{"at": [-1, 1], "label": "(-1, 1)"}, {"at": [2, 4], "label": "(2, 4)"}, {"at": [1, 1], "label": "(1, 1)"}], "caption": "Two crossings, one touching point, or none"}
```

To see which case you're in and find the points, substitute. Setting $x^2 = x + 2$ gives $x^2 - x - 2 = 0$, so $(x - 2)(x + 1) = 0$ and $x = 2$ or $x = -1$: two points. For $y = 2x - 1$, $x^2 - 2x + 1 = 0$ is $(x - 1)^2 = 0$, a double root, so the line touches the parabola at the single point $(1, 1)$ without crossing it. A line that touches a curve at one point like this is called a **tangent line**. For $y = x - 2$, $x^2 - x + 2 = 0$ has discriminant $(-1)^2 - 4(1)(2) = -7 < 0$, so there are no real solutions and the line misses the parabola.

That is the general pattern. After substituting, you always reach a quadratic equation $ax^2 + bx + c = 0$, and its discriminant $D = b^2 - 4ac$ counts the intersection points: $D > 0$ gives two, $D = 0$ gives one, $D < 0$ gives none.

## Solving by substitution

1. Solve the linear equation for $y$ (if it isn't already).
2. Substitute into the quadratic equation, or set the two expressions for $y$ equal.
3. Move everything to one side to get $ax^2 + bx + c = 0$.
4. Solve by factoring, the quadratic formula, or completing the square.
5. Find each $y$ from the *linear* equation (it's quicker), then check each point in the quadratic one.

### Example 1

Solve the system $y = x^2 - 4x + 1$ and $y = 2x - 7$.

1. Both are solved for $y$, so set them equal: $x^2 - 4x + 1 = 2x - 7$.
2. Subtract $2x$ and add 7: $x^2 - 6x + 8 = 0$.
3. Factor: $(x - 2)(x - 4) = 0$, so $x = 2$ or $x = 4$.
4. From the line: $x = 2$ gives $y = 2(2) - 7 = -3$; $x = 4$ gives $y = 1$.
5. Check in the parabola: $2^2 - 4(2) + 1 = -3$ ✓ and $4^2 - 4(4) + 1 = 1$ ✓.

The solutions are $(2, -3)$ and $(4, 1)$.

```plot
{"x": [-1, 6], "y": [-5, 6], "functions": [{"f": "x^2 - 4*x + 1", "label": "y = x² - 4x + 1"}, {"f": "2*x - 7", "label": "y = 2x - 7", "dashed": true}], "points": [{"at": [2, -3], "label": "(2, -3)"}, {"at": [4, 1], "label": "(4, 1)"}], "caption": "The line crosses the parabola at the two solutions"}
```

### Example 2

How many times does the line $y = 3x - 5$ meet the parabola $y = x^2 - x - 1$? Find the point(s).

1. Set equal: $x^2 - x - 1 = 3x - 5$, so $x^2 - 4x + 4 = 0$.
2. Discriminant: $D = (-4)^2 - 4(1)(4) = 16 - 16 = 0$. Exactly one intersection: the line is tangent to the parabola.
3. $x^2 - 4x + 4 = (x - 2)^2 = 0$, so $x = 2$ and $y = 3(2) - 5 = 1$.
4. Check: $2^2 - 2 - 1 = 1$ ✓. The only common point is $(2, 1)$.

## Intersections of other graphs

The same reasoning works for any two functions. Sometimes algebra finishes the job; when it can't, a graph or a table finds the solutions, at least approximately.

### Example 3

Solve $|x - 1| = 0.5x + 1$.

1. Split the absolute value at $x = 1$, as in Lesson 13. For $x \ge 1$, $|x - 1| = x - 1$, so $x - 1 = 0.5x + 1$, giving $0.5x = 2$ and $x = 4$. That satisfies $x \ge 1$, so keep it.
2. For $x < 1$, $|x - 1| = 1 - x$, so $1 - x = 0.5x + 1$, giving $-1.5x = 0$ and $x = 0$. That satisfies $x < 1$: keep it.
3. Check: $|0 - 1| = 1 = 0.5(0) + 1$ ✓ and $|4 - 1| = 3 = 0.5(4) + 1$ ✓.

```plot
{"x": [-3, 7], "y": [-1, 6], "functions": [{"f": "abs(x - 1)", "label": "y = |x - 1|"}, {"f": "0.5*x + 1", "label": "y = 0.5x + 1", "dashed": true}], "points": [{"at": [0, 1], "label": "(0, 1)"}, {"at": [4, 3], "label": "(4, 3)"}], "caption": "The V and the line meet at x = 0 and x = 4"}
```

The solutions are $x = 0$ and $x = 4$. The graph confirms there are no others: left of $x = 0$ the V rises while the line falls, and right of $x = 4$ the V's slope (1) is steeper than the line's (0.5), so in both directions the V stays above the line.

### Example 4

Solve $2^x = x + 2$.

Algebra 1 has no step that gets $x$ out of an exponent, so use a table and a graph. Let $f(x) = 2^x$ and $g(x) = x + 2$.

| $x$ | $-2$ | $-1$ | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|---|
| $f(x) = 2^x$ | 0.25 | 0.5 | 1 | 2 | 4 | 8 |
| $g(x) = x + 2$ | 0 | 1 | 2 | 3 | 4 | 5 |

1. At $x = 2$ the outputs match: $2^2 = 4 = 2 + 2$. So $x = 2$ is an exact solution.
2. At $x = -2$, $f > g$; at $x = -1$, $f < g$. The comparison switches between them, so the graphs cross somewhere between $-2$ and $-1$.
3. A graphing tool's intersect feature (or a finer table) places that crossing at $x \approx -1.69$.

```plot
{"x": [-3, 4], "y": [-1, 8], "functions": [{"f": "2^x", "label": "y = 2ˣ"}, {"f": "x + 2", "label": "y = x + 2", "dashed": true}], "points": [{"at": [2, 4], "label": "(2, 4)"}, {"at": [-1.69, 0.31], "label": "(-1.69, 0.31)"}], "caption": "Two intersections: one exact, one found by technology"}
```

So $x \approx -1.69$ or $x = 2$. After $x = 2$ the exponential grows faster and pulls away for good (Lesson 31 explains why), so there are no more solutions.

Whenever you find solutions approximately, check by substituting: $2^{-1.69} \approx 0.310$ and $-1.69 + 2 = 0.31$, close enough for a two-decimal answer.

## Common mistakes

- Stopping at one solution. A quadratic step can produce two; a line and a parabola can meet twice.
- Forgetting the $y$-values when a system asks for points, or reporting $y$-values when the question asks only to solve $f(x) = g(x)$.
- Not moving everything to one side before factoring: $x^2 = x + 2$ is not solved by setting $x = 0$ or $x = x + 2$.
- Dividing both sides by $x$, which throws away the solution $x = 0$.
- Keeping a value from one piece of an absolute value that doesn't satisfy that piece's condition.
- Trusting a rough sketch for an exact answer. Use the graph to count and estimate, then confirm by substituting.

## Key points

- Solutions of $f(x) = g(x)$ are the $x$-coordinates of the intersection points of $y = f(x)$ and $y = g(x)$.
- Linear-quadratic system: substitute, rearrange to $ax^2 + bx + c = 0$, solve, then find $y$ from the line.
- The discriminant of that quadratic counts intersections: two, one (tangent), or none.
- When algebra can't isolate $x$, use a table (look for equal outputs or a switch in which is larger) or a graph's intersect feature, and check by substituting.
