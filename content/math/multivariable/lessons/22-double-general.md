---
id: mv-double-general
module: mv-m5
title: Double integrals over general regions
minutes: 40
topics: [General regions, Reversing the order]
drills: [mv-d-dbl-region, mv-d-reverse]
refs: [mv-ref-integrals]
---
## Beyond rectangles

Real regions are rarely rectangles: a plate with a curved edge, a field bounded by a river,
the triangle under a line. To integrate over such a region we still use iterated integrals,
but now the inner limits are *functions* of the outer variable. The key skill is reading the
region correctly, and the most useful trick is reversing the order when one order leads to
an impossible integral.

## Two kinds of regions

A region is **Type I** if it lies between two graphs of functions of $x$:

$$D = \{(x, y) : a \le x \le b,\ g_1(x) \le y \le g_2(x)\}.$$

Then

$$\iint_D f(x, y)\,dA = \int_a^b\int_{g_1(x)}^{g_2(x)} f(x, y)\,dy\,dx.$$

Picture a vertical line crossing the region at a fixed $x$: it enters at the bottom curve
$y = g_1(x)$ and leaves at the top curve $y = g_2(x)$. Those are the inner limits.

A region is **Type II** if it lies between two graphs of functions of $y$:

$$D = \{(x, y) : c \le y \le d,\ h_1(y) \le x \le h_2(y)\},\qquad \iint_D f\,dA = \int_c^d\int_{h_1(y)}^{h_2(y)} f(x, y)\,dx\,dy.$$

Now a horizontal line enters at the left curve and leaves at the right curve.

Rule of thumb: *the outer limits are constants; the inner limits may depend on the outer
variable only.* If your final answer still contains $x$ or $y$, the limits were set up wrong.

### Example 1: a Type I region

Evaluate $\iint_D xy\,dA$, where $D$ is the region between $y = x^2$ and $y = x$.

```plot
{"x": [-0.2, 1.3], "y": [-0.2, 1.3], "equal": true, "functions": [{"f": "x", "label": "y = x (top)"}, {"f": "x^2", "label": "y = x² (bottom)"}], "shade": [{"f": "x", "g": "x^2", "from": 0, "to": 1}], "segments": [{"from": [0.6, 0.36], "to": [0.6, 0.6], "arrow": true}], "points": [[0, 0], [1, 1]], "caption": "A vertical line at x enters at y = x² and leaves at y = x"}
```

1. The curves meet where $x^2 = x$: $x = 0$ and $x = 1$. For $0 < x < 1$, $x$ is above $x^2$.
2. $\displaystyle\int_0^1\int_{x^2}^{x} xy\,dy\,dx = \int_0^1 x\left[\frac{y^2}{2}\right]_{x^2}^{x}dx = \int_0^1\frac{x^3 - x^5}{2}\,dx$.
3. $= \tfrac12\left(\tfrac14 - \tfrac16\right) = \tfrac{1}{24}$.

### Example 2: a Type II region and area

Find the area of the region bounded by $x = y^2$ and $x = y + 2$.

The area of $D$ is $\iint_D 1\,dA$. Here horizontal slices are easier: every horizontal
line meets the parabola on the left and the line on the right. (Vertical slices would need two
separate integrals, since the lower boundary changes at $x = 1$.)

```plot
{"x": [-0.5, 4.5], "y": [-1.6, 2.6], "equal": true, "curves": [{"x": "t^2", "y": "t", "t": [-1.6, 2.2], "label": "x = y²"}, {"x": "t+2", "y": "t", "t": [-1.6, 2.4], "label": "x = y + 2"}], "points": [{"at": [1, -1], "label": "(1, −1)"}, {"at": [4, 2], "label": "(4, 2)"}], "segments": [{"from": [0.25, 0.5], "to": [2.5, 0.5], "arrow": true}], "caption": "A horizontal line enters at x = y² and leaves at x = y + 2"}
```

1. Intersections: $y^2 = y + 2$ gives $y = -1$ and $y = 2$.
2. Area $= \displaystyle\int_{-1}^{2}\int_{y^2}^{y+2}1\,dx\,dy = \int_{-1}^{2}(y + 2 - y^2)\,dy$.
3. $= \left[\tfrac{y^2}{2} + 2y - \tfrac{y^3}{3}\right]_{-1}^{2} = \left(2 + 4 - \tfrac83\right) - \left(\tfrac12 - 2 + \tfrac13\right) = \tfrac{10}{3} + \tfrac76 = \tfrac92.$

## Reversing the order of integration

Some iterated integrals cannot be done in the given order because the inner integral has no
elementary antiderivative ($e^{y^2}$, $\sin(y^2)$, $\tfrac{\sin y}{y}$...). Since the double
integral does not depend on how we slice, we can redescribe the same region the other way.

The procedure:

1. From the limits, write the region as inequalities and sketch it.
2. Read the region in the other order: new outer limits are constants spanning the region;
   new inner limits are the curves where a line in the other direction enters and leaves.
3. Evaluate.

### Example 3

Evaluate $\displaystyle\int_0^2\int_{x/2}^{1} e^{y^2}\,dy\,dx$.

1. $\int e^{y^2}\,dy$ is not elementary, so reverse. The region is $0 \le x \le 2$, $\tfrac x2 \le y \le 1$: the triangle with vertices $(0, 0)$, $(0, 1)$, $(2, 1)$, above the line $y = x/2$.
2. Horizontally: for $0 \le y \le 1$, $x$ runs from $0$ to $2y$ (the line $y = x/2$ is $x = 2y$).
3. $\displaystyle\int_0^1\int_0^{2y} e^{y^2}\,dx\,dy = \int_0^1 2y\,e^{y^2}\,dy = \left[e^{y^2}\right]_0^1 = e - 1.$

```plot
{"x": [-0.3, 2.4], "y": [-0.3, 1.4], "equal": true, "functions": [{"f": "x/2", "label": "y = x/2  (x = 2y)"}, {"f": "1", "label": "y = 1"}], "shade": [{"f": "1", "g": "x/2", "from": 0, "to": 2}], "caption": "The triangle: 0 ≤ x ≤ 2, x/2 ≤ y ≤ 1, or equally 0 ≤ y ≤ 1, 0 ≤ x ≤ 2y"}
```

Reversing created the factor $2y$, exactly the derivative of $y^2$ needed for substitution.

## Properties

Double integrals are linear ($\iint(f + g) = \iint f + \iint g$, constants pull out), and
additive over regions: if $D = D_1\cup D_2$ with only boundary overlap, then
$\iint_D f = \iint_{D_1}f + \iint_{D_2}f$. Use additivity to split a region that is neither
Type I nor Type II into pieces that are. Also, if $m \le f \le M$ on $D$, then
$m\,A(D) \le \iint_D f\,dA \le M\,A(D)$, a quick sanity check.

## Common mistakes

- Putting functions in the outer limits, or the outer variable's constants in the inner limits.
- Using the lower curve as the upper limit (check by testing a point).
- Reversing the order by swapping the limits symbolically instead of re-reading the sketch.
- Forgetting that the area integrand is 1.

## Key points

- Type I: $\int_a^b\int_{g_1(x)}^{g_2(x)}f\,dy\,dx$; Type II: $\int_c^d\int_{h_1(y)}^{h_2(y)}f\,dx\,dy$.
- Inner limits come from where a slicing line enters and leaves the region.
- Reverse the order by sketching the region and describing it the other way.
- Area of $D = \iint_D 1\,dA$.
