---
id: a2-transformations
module: a2-m1
title: Transformations of parent functions
minutes: 35
topics: [Transformations]
drills: [a2-d-transform-point, a2-d-transform-vertex, a2-d-transform-write]
refs: [alg-ref-functions]
---
Algebra 2 meets a lot of functions: quadratics, square roots, cubics, absolute values, reciprocals, exponentials and logarithms. You don't have to learn each graph from scratch. Most of them are a handful of basic shapes that have been slid, flipped or stretched, and each of those moves shows up in the formula in a predictable place. In Algebra 1 you saw one case of this: the vertex form $y = a(x - h)^2 + k$ puts the vertex of a parabola at $(h, k)$. This lesson makes that idea work for every function.

## Parent functions

A **parent function** is the simplest function in a family; every other member is built from it by changes to the formula. Here are the ones you'll use most. It's worth knowing each one's shape and a few exact points on it.

| Parent function | Formula | Key points | Domain | Range |
|---|---|---|---|---|
| Linear | $y = x$ | $(0, 0)$, $(1, 1)$ | all reals | all reals |
| Quadratic | $y = x^2$ | $(0, 0)$, $(\pm1, 1)$, $(\pm2, 4)$ | all reals | $y \ge 0$ |
| Cubic | $y = x^3$ | $(0, 0)$, $(1, 1)$, $(-1, -1)$ | all reals | all reals |
| Absolute value | $y = \lvert x \rvert$ | $(0, 0)$, $(\pm1, 1)$ | all reals | $y \ge 0$ |
| Square root | $y = \sqrt{x}$ | $(0, 0)$, $(1, 1)$, $(4, 2)$ | $x \ge 0$ | $y \ge 0$ |
| Cube root | $y = \sqrt[3]{x}$ | $(0, 0)$, $(1, 1)$, $(-8, -2)$ | all reals | all reals |
| Reciprocal | $y = \dfrac{1}{x}$ | $(1, 1)$, $(-1, -1)$ | $x \ne 0$ | $y \ne 0$ |
| Exponential | $y = 2^x$ | $(0, 1)$, $(1, 2)$ | all reals | $y > 0$ |

```plot
{"x": [-4, 4], "y": [-3, 5], "equal": true, "functions": [{"f": "x^2", "label": "y = x²"}, {"f": "abs(x)", "label": "y = |x|", "dashed": true}, {"f": "sqrt(x)", "from": 0, "to": 4, "label": "y = √x"}, {"f": "x^3", "label": "y = x³", "dashed": true}], "caption": "Four parent functions: the parabola, the V of |x|, the half-parabola √x, and the S-shaped cubic"}
```

A **transformation** changes a graph's position, orientation or size. There are three kinds: translations (slides), reflections (flips) and stretches or compressions. Throughout, $f$ is any function and $y = f(x)$ its graph.

## Translations

A **translation** slides the whole graph without turning or resizing it.

**Vertical shifts**. The graph of $y = f(x) + k$ is the graph of $f$ moved up $k$ units (down if $k < 0$). This one is easy to believe: every output gets $k$ added to it, so every point $(x, y)$ moves to $(x, y + k)$.

**Horizontal shifts**. The graph of $y = f(x - h)$ is the graph of $f$ moved right $h$ units (left if $h < 0$). The direction surprises people, so here's why. The new function at $x = h + 3$ gives $f(h + 3 - h) = f(3)$: it reaches the output that $f$ had at 3, but $h$ units later. Every point $(x, y)$ moves to $(x + h, y)$. So $y = \lvert x - 3 \rvert$ has its corner at $x = 3$ (the input that makes the inside zero), and $y = \lvert x + 3 \rvert = \lvert x - (-3) \rvert$ has its corner at $x = -3$.

A good rule of thumb: changes *outside* the function act on $y$ the way they look; changes *inside* act on $x$ the opposite way.

```plot
{"x": [-6, 6], "y": [-2, 6], "functions": [{"f": "abs(x)", "label": "y = |x|"}, {"f": "abs(x - 3)", "dashed": true, "label": "y = |x − 3|"}, {"f": "abs(x) + 2", "dashed": true, "label": "y = |x| + 2"}], "points": [{"at": [0, 0]}, {"at": [3, 0], "label": "(3, 0)"}, {"at": [0, 2], "label": "(0, 2)"}], "caption": "Subtracting 3 inside moves the graph right 3; adding 2 outside moves it up 2"}
```

## Reflections

A **reflection** flips the graph across a line, like a mirror image.

- $y = -f(x)$ reflects the graph across the $x$-axis: every output changes sign, so $(x, y) \to (x, -y)$.
- $y = f(-x)$ reflects the graph across the $y$-axis: the output that $f$ had at $x$ now appears at $-x$, so $(x, y) \to (-x, y)$.

For example, $y = -\sqrt{x}$ is the square root graph turned upside down (it heads down and to the right), while $y = \sqrt{-x}$ heads up and to the left, with domain $x \le 0$.

## Stretches and compressions

Multiplying the output by a positive number $a$ changes the graph's height. The graph of $y = a f(x)$ is a **vertical stretch** of the graph of $f$ by a factor of $a$ when $a > 1$ (every point moves away from the $x$-axis), and a **vertical compression** when $0 < a < 1$ (every point moves toward it). Points go $(x, y) \to (x, ay)$. A negative $a$ also reflects across the $x$-axis: $y = -3x^2$ is $y = x^2$ stretched by 3 and flipped.

Multiplying the *input* works the opposite way, as you'd expect from an inside change. The graph of $y = f(bx)$ with $b > 1$ is a **horizontal compression** by a factor of $\tfrac1b$: the function reaches each output $b$ times sooner, so $(x, y) \to \left(\tfrac{x}{b}, y\right)$. With $0 < b < 1$ it's a **horizontal stretch**. For example, $y = \sqrt{4x}$ reaches height 2 at $x = 1$ instead of $x = 4$.

For some parent functions a horizontal compression looks exactly like a vertical stretch: $(2x)^2 = 4x^2$ and $\sqrt{4x} = 2\sqrt{x}$. That's why most problems in this course use the vertical form $a f(x)$.

## Putting transformations together

The general form you'll see most is

$$y = a\,f(x - h) + k.$$

Read it as: stretch by $|a|$ (and reflect across the $x$-axis if $a < 0$), then shift right $h$ and up $k$. Each point of the parent graph moves by

$$(x, y) \to (x + h,\; ay + k).$$

The order matters for the $y$-coordinate: multiply by $a$ first, then add $k$. The point that sat at the parent's "anchor" (the vertex of $x^2$ or $\lvert x \rvert$, the endpoint of $\sqrt x$, the center of $x^3$) lands at $(h, k)$.

### Example 1

Graph $g(x) = -2\lvert x + 3 \rvert + 1$ and give its range.

1. Parent: $y = \lvert x \rvert$, a V with its corner at the origin.
2. Match the form $a f(x - h) + k$: $x + 3 = x - (-3)$, so $h = -3$; $a = -2$; $k = 1$.
3. Describe: stretch vertically by 2, reflect across the $x$-axis, shift left 3 and up 1.
4. Move three key points with $(x, y) \to (x - 3, -2y + 1)$:
   - $(0, 0) \to (-3, 1)$, the new corner;
   - $(1, 1) \to (-2, -1)$;
   - $(-1, 1) \to (-4, -1)$.
5. The V opens downward from $(-3, 1)$ with slopes $\pm 2$, so the highest output is 1: the range is $y \le 1$.

```plot
{"x": [-8, 2], "y": [-5, 3], "functions": [{"f": "abs(x)", "dashed": true, "label": "y = |x|"}, {"f": "-2*abs(x + 3) + 1", "label": "g(x) = −2|x + 3| + 1"}], "points": [{"at": [-3, 1], "label": "(−3, 1)"}, {"at": [-2, -1], "label": "(−2, −1)"}, {"at": [-4, -1], "label": "(−4, −1)"}], "caption": "The parent V is stretched, flipped, and moved so its corner lands at (−3, 1)"}
```

### Example 2

Write an equation for the square root graph that has been reflected across the $x$-axis, shifted left 4 and shifted up 3. State its domain and range.

1. Reflect: $y = -\sqrt{x}$.
2. Left 4 is an inside change of $+4$: $y = -\sqrt{x + 4}$.
3. Up 3 is an outside change: $g(x) = -\sqrt{x + 4} + 3$.
4. The endpoint $(0, 0)$ moves to $(-4, 3)$. The radicand must be nonnegative, so the domain is $x \ge -4$. The graph starts at height 3 and goes down, so the range is $y \le 3$.
5. Check another point: $(4, 2)$ on $y = \sqrt x$ moves to $(4 - 4, -2 + 3) = (0, 1)$, and indeed $g(0) = -\sqrt4 + 3 = 1$.

```plot
{"x": [-6, 6], "y": [-2, 5], "functions": [{"f": "sqrt(x)", "from": 0, "to": 6, "dashed": true, "label": "y = √x"}, {"f": "-sqrt(x + 4) + 3", "from": -4, "to": 6, "label": "g(x) = −√(x + 4) + 3"}], "points": [{"at": [-4, 3], "label": "(−4, 3)"}, {"at": [0, 1], "label": "(0, 1)"}], "caption": "The endpoint moves from (0, 0) to (−4, 3), and the graph now heads downward"}
```

### Example 3

The point $(2, 5)$ is on the graph of $y = f(x)$. Find the matching point on each graph: (a) $y = 3f(x - 1) - 4$; (b) $y = f(-x)$; (c) $y = f(2x)$.

1. (a) $h = 1$, $a = 3$, $k = -4$: $(2 + 1,\; 3 \cdot 5 - 4) = (3, 11)$. Check: at $x = 3$, $3f(3 - 1) - 4 = 3f(2) - 4 = 3(5) - 4 = 11$.
2. (b) Reflect across the $y$-axis: $(-2, 5)$, since $f(-(-2)) = f(2) = 5$.
3. (c) Horizontal compression by $\tfrac12$: $(1, 5)$, since $f(2 \cdot 1) = f(2) = 5$.

In each case you can check the answer by plugging the new $x$ into the new formula and seeing that the inside lands on the old input, 2.

## Common mistakes

- Shifting the wrong way: $y = (x + 5)^2$ moves $y = x^2$ *left* 5, not right. Ask "what input makes the inside zero?"
- Mixing up $-f(x)$ (flip top to bottom) and $f(-x)$ (flip left to right).
- Adding $k$ before multiplying by $a$. For $y = 2f(x) + 1$, a point at height 3 goes to $2(3) + 1 = 7$, not $2(3 + 1) = 8$.
- Treating $f(2x)$ as a horizontal stretch. Multiplying the input by 2 squeezes the graph toward the $y$-axis.
- Forgetting that shifts change the domain or range: $y = \sqrt{x - 2}$ has domain $x \ge 2$, and $y = x^2 - 6$ has range $y \ge -6$.

## Key points

- Learn the parent graphs: $x$, $x^2$, $x^3$, $\lvert x \rvert$, $\sqrt x$, $\sqrt[3]x$, $\tfrac1x$, $2^x$.
- $f(x) + k$: up $k$. $f(x - h)$: right $h$. Inside changes act on $x$ in the opposite way to how they look.
- $-f(x)$ reflects across the $x$-axis; $f(-x)$ reflects across the $y$-axis.
- $a f(x)$ stretches vertically by $|a|$; $f(bx)$ compresses horizontally by $\tfrac1b$.
- For $y = a f(x - h) + k$, points move $(x, y) \to (x + h, ay + k)$, and the parent's anchor point lands at $(h, k)$.
