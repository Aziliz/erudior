---
id: calc-area-between
module: calc-m7
title: Area between curves
minutes: 30
topics: [Area between curves]
drills: [calc-d-area-between, calc-d-area-y]
refs: [calc-ref-applications]
---
## Slicing, the master idea

Module 7 uses the definite integral to compute areas, volumes, lengths, work and more. Every one of these follows the same pattern, so it's worth stating once:

1. *Slice* the quantity into thin pieces.
2. *Approximate* one piece by something simple (a rectangle, disk, shell, straight segment, constant force), giving an expression like $(\text{something})\cdot\Delta x$.
3. *Add* the pieces and take the limit: the sum becomes an integral.

You don't need to memorize separate formulas if you can do these three steps. This lesson applies them to the area between two curves.

## Vertical slices

Suppose $f(x) \ge g(x)$ on $[a, b]$. Slice the region between them into thin vertical rectangles. A rectangle at position $x$ has height $f(x) - g(x)$ (top minus bottom) and width $\Delta x$. Adding and taking the limit:

$$A = \int_a^b\left[f(x) - g(x)\right]dx = \int_a^b(\text{top} - \text{bottom})\,dx.$$

This works whether the curves are above or below the $x$-axis: the height top minus bottom is always positive.

```plot
{"x": [-2, 3], "y": [-1, 7], "functions": [{"f": "x + 2", "label": "top: y = x + 2"}, {"f": "x^2", "label": "bottom: y = x²"}], "shade": [{"f": "x + 2", "g": "x^2", "from": -1, "to": 2}], "segments": [{"from": [0.8, 0.64], "to": [0.8, 2.8], "dashed": true}], "caption": "A typical vertical slice has height top − bottom"}
```

### Example 1

Find the area between $y = x + 2$ and $y = x^2$.

1. Intersections: $x^2 = x + 2 \Rightarrow (x - 2)(x + 1) = 0$, so $x = -1, 2$.
2. Which is on top? Test $x = 0$: the line gives 2, the parabola 0. The line is on top.
3. Integrate:
$$A = \int_{-1}^{2}(x + 2 - x^2)\,dx = \left[\frac{x^2}{2} + 2x - \frac{x^3}{3}\right]_{-1}^{2} = \left(2 + 4 - \tfrac83\right) - \left(\tfrac12 - 2 + \tfrac13\right) = \frac{10}{3} + \frac{7}{6} = \mathbf{\frac92}.$$

## When the curves cross

If the curves cross inside $[a, b]$, "top" and "bottom" swap. Split the integral at the crossing points, or integrate the absolute value:

$$A = \int_a^b\lvert f(x) - g(x)\rvert\,dx.$$

### Example 2

Find the total area between $y = \sin x$ and $y = \cos x$ for $0 \le x \le \pi/2$.

They cross where $\sin x = \cos x$: $x = \pi/4$. Cosine is on top on $[0, \pi/4]$; sine on $[\pi/4, \pi/2]$.
$$A = \int_0^{\pi/4}(\cos x - \sin x)\,dx + \int_{\pi/4}^{\pi/2}(\sin x - \cos x)\,dx.$$
The first: $[\sin x + \cos x]_0^{\pi/4} = \sqrt2 - 1$. By symmetry the second is the same. Total: $\mathbf{2\sqrt2 - 2} \approx 0.828$.

Without splitting, $\int_0^{\pi/2}(\cos x - \sin x)\,dx = 0$: the two pieces cancel. That's net signed area, not the area of the region.

## Horizontal slices

Some regions are easier sliced horizontally. If the region is bounded on the right by $x = f(y)$ and on the left by $x = g(y)$ for $c \le y \le d$:

$$A = \int_c^d\left[f(y) - g(y)\right]dy = \int_c^d(\text{right} - \text{left})\,dy.$$

Use this when the boundaries are naturally functions of $y$ (like $x = y^2$), or when vertical slices would hit different curves in different places.

### Example 3

Find the area between $x = y^2$ and $y = x - 2$.

With vertical slices this region needs two integrals (the bottom boundary changes from the lower half of the parabola to the line at $x = 1$). With horizontal slices it's one.

1. Write both as $x$ in terms of $y$: $x = y^2$ (left) and $x = y + 2$ (right).
2. Intersections: $y^2 = y + 2 \Rightarrow y = -1, 2$.
3. $$A = \int_{-1}^{2}\left(y + 2 - y^2\right)dy = \frac92.$$

It's the same integral as Example 1 with the letters renamed: the region is Example 1's region reflected across $y = x$.

```plot
{"x": [-0.5, 5], "y": [-2, 3], "equal": true, "curves": [{"x": "t^2", "y": "t", "t": [-1.6, 2.2], "label": "x = y²"}], "functions": [{"f": "x - 2", "label": "y = x − 2"}], "segments": [{"from": [0.25, 0.5], "to": [2.5, 0.5], "dashed": true}], "points": [{"at": [1, -1]}, {"at": [4, 2]}], "caption": "Horizontal slice from x = y² (left) to x = y + 2 (right)"}
```

## Area from a rate

Area integrals show up in context too. If two rates are given (rain falling in versus water draining out, say), the area between their graphs over a time interval is the net accumulated difference. If $R(t) \ge D(t)$, $\int_a^b[R(t) - D(t)]\,dt$ is the net gain.

### Example 4

Find the area enclosed by $y = x^3$ and $y = x$.

Intersections: $x^3 = x \Rightarrow x(x - 1)(x + 1) = 0$, so $x = -1, 0, 1$. On $[-1, 0]$, $x^3 \ge x$ (test $-\frac12$: $-\frac18 > -\frac12$); on $[0, 1]$, $x \ge x^3$.
$$A = \int_{-1}^{0}(x^3 - x)\,dx + \int_0^1(x - x^3)\,dx = \frac14 + \frac14 = \mathbf{\frac12}.$$
(The region is symmetric about the origin, so you could compute one piece and double it.)

### Example 5

Find the area between $y = e^x$ and $y = x$ for $0 \le x \le 1$.

The curves don't intersect ($e^x > x$ for all $x$), so the limits come from the interval given, and $e^x$ is on top throughout:
$$A = \int_0^1(e^x - x)\,dx = \left[e^x - \frac{x^2}{2}\right]_0^1 = \left(e - \frac12\right) - 1 = e - \frac32 \approx 1.218.$$

When the problem gives the interval, you don't need intersections, but you still need to know which curve is on top across the whole interval.

## Common mistakes

- *Bottom minus top.* That gives a negative "area." Always top minus bottom (or right minus left).
- *Not splitting at crossings.* Integrating $f - g$ straight across a crossing gives net, not total, area.
- *Wrong limits.* Find all intersection points; with horizontal slices the limits are $y$-values.
- *Mixing variables.* With $dy$, everything must be written in terms of $y$.
- *Forgetting to identify which curve is on top* by testing a point.

## Key points

- Slice, approximate, add: the integral is the limit of a sum of thin pieces.
- Vertical slices: $A = \int_a^b(\text{top} - \text{bottom})\,dx$.
- Horizontal slices: $A = \int_c^d(\text{right} - \text{left})\,dy$.
- Find intersections for limits; split where the curves cross.
