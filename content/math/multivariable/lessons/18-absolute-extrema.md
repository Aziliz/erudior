---
id: mv-absolute-extrema
module: mv-m4
title: Absolute extrema on closed regions
minutes: 35
topics: [Absolute extrema]
drills: [mv-d-abs-rect]
refs: [mv-ref-differential]
---
## The largest and smallest values overall

The second-derivative test finds *local* behavior. Often we need the *absolute* maximum and
minimum of $f$ over a whole region: the hottest point on a plate, the cheapest design within
limits. In one variable, the closed interval method checked critical points and the two
endpoints. In two variables the "endpoints" become an entire boundary curve, so the method
has one extra stage: optimizing along the boundary.

## When are absolute extrema guaranteed?

A set in the plane is **closed** if it contains all its boundary points (a disk including
its circle, a rectangle including its edges), and **bounded** if it fits inside some disk.

**Extreme Value Theorem.** If $f$ is continuous on a closed, bounded set $D$, then $f$ attains
an absolute maximum value and an absolute minimum value at some points of $D$.

Both conditions matter. On the open disk $x^2 + y^2 < 1$, $f = x$ has no maximum (it gets
close to 1 but never reaches it); on the unbounded plane, $f = x$ has neither.

## The closed-region method

To find the absolute extrema of a continuous $f$ on a closed, bounded $D$:

1. Find the values of $f$ at the critical points of $f$ that lie *inside* $D$.
2. Find the extreme values of $f$ on the *boundary* of $D$. Usually the boundary splits into
   pieces; on each, substitute a description of the piece to get a function of one
   variable, then use one-variable methods (critical points and endpoints of the piece).
3. The largest value from steps 1 and 2 is the absolute maximum; the smallest is the
   absolute minimum.

No second-derivative test is needed: we simply compare a finite list of candidate values.

### Example 1: a rectangle

Find the absolute extrema of $f(x, y) = x^2 - xy + y^2 - 3x$ on the rectangle
$R = \{0 \le x \le 3,\ 0 \le y \le 2\}$.

**Interior.** $f_x = 2x - y - 3 = 0$ and $f_y = -x + 2y = 0$. The second gives $x = 2y$; then
$4y - y - 3 = 0$, so $y = 1$, $x = 2$. The point $(2, 1)$ is inside $R$, and $f(2, 1) = 4 - 2 + 1 - 6 = -3$.

Boundary, one edge at a time:

| Edge | Restriction | Candidates |
|---|---|---|
| $y = 0$, $0 \le x \le 3$ | $x^2 - 3x$ | $x = 1.5$: $-2.25$; ends: $0$, $0$ |
| $y = 2$, $0 \le x \le 3$ | $x^2 - 5x + 4$ | $x = 2.5$: $-2.25$; ends: $4$, $-2$ |
| $x = 0$, $0 \le y \le 2$ | $y^2$ | ends: $0$, $4$ |
| $x = 3$, $0 \le y \le 2$ | $y^2 - 3y$ | $y = 1.5$: $-2.25$; ends: $0$, $-2$ |

**Compare.** The largest candidate is $4$, at $(0, 2)$; the smallest is $-3$, at $(2, 1)$. So
the absolute maximum is $4$ and the absolute minimum is $-3$.

```plot
{"x": [-0.5, 3.5], "y": [-0.5, 2.5], "equal": true, "polygons": [{"points": [[0, 0], [3, 0], [3, 2], [0, 2]], "fill": true}], "points": [{"at": [2, 1], "label": "min −3"}, {"at": [0, 2], "label": "max 4"}, {"at": [1.5, 0]}, {"at": [2.5, 2]}, {"at": [3, 1.5]}], "caption": "Candidates in the rectangle: the interior critical point and the critical points and corners of each edge"}
```

### Example 2: a disk

Find the absolute extrema of $f(x, y) = x^2 + 2y^2 - x$ on the disk $x^2 + y^2 \le 1$.

**Interior.** $f_x = 2x - 1 = 0$, $f_y = 4y = 0$: the point $\left(\tfrac12, 0\right)$, inside
the disk, with $f = \tfrac14 - \tfrac12 = -\tfrac14$.

**Boundary.** On the circle, $y^2 = 1 - x^2$ with $-1 \le x \le 1$. Then
$f = x^2 + 2(1 - x^2) - x = 2 - x - x^2$. Its derivative $-1 - 2x$ is zero at
$x = -\tfrac12$, where $f = 2 + \tfrac12 - \tfrac14 = \tfrac94$. The ends $x = 1$ and $x = -1$
give $f = 0$ and $f = 2$.

**Compare.** Absolute maximum $\tfrac94$ at $\left(-\tfrac12, \pm\tfrac{\sqrt3}{2}\right)$;
absolute minimum $-\tfrac14$ at $\left(\tfrac12, 0\right)$.

A circle can also be parametrized as $x = \cos t$, $y = \sin t$, $0 \le t \le 2\pi$, which
avoids square roots. And in the next lesson, Lagrange multipliers give a third way to handle
a curved boundary.

## A word on triangles and other shapes

For a triangle, each side is a line segment: write it as $y = mx + b$ over an interval of
$x$ (or as $x = c$ for a vertical side), substitute, and treat the vertices as endpoints. Always include the
corners; they are endpoints of the edge pieces and are easy to forget.

### Example 3: a quick triangle

Find the maximum of $f(x, y) = 4xy$ on the triangle with vertices $(0,0)$, $(2,0)$, $(0,2)$.

1. Interior: $\nabla f = \langle 4y, 4x\rangle = \mathbf 0$ only at the corner $(0,0)$, which is not interior.
2. On the axes $f = 0$. On the hypotenuse $y = 2 - x$, $0 \le x \le 2$: $f = 4x(2 - x)$, maximized at $x = 1$ with $f = 4$.
3. Absolute maximum $4$ at $(1, 1)$; absolute minimum $0$ along both legs.

## Common mistakes

- Including critical points that lie outside the region.
- Forgetting the corners where boundary pieces meet.
- Using the second-derivative test to pick the absolute max; just compare values.
- Applying the method to a region that is not closed and bounded, where extrema may not exist.

## Key points

- Continuous $f$ on a closed, bounded set attains an absolute max and min (Extreme Value Theorem).
- Candidates: interior critical points, plus the extremes along each boundary piece (including corners).
- The largest candidate value is the absolute max, the smallest the absolute min.
