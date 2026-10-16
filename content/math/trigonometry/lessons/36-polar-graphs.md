---
id: trig-polar-graphs
module: trig-m9
title: Graphs of polar equations
minutes: 40
topics: [Polar graphs]
drills: [trig-d-polar-eval, trig-d-rose]
refs: [trig-ref-triangles]
---
## Curves that are natural in polar form

A **polar equation** relates $r$ and $\theta$, usually as $r = f(\theta)$. Its graph is every point whose
polar coordinates satisfy it. Some curves that are messy in $x$ and $y$ are strikingly simple
in polar form: a heart-shaped cardioid is $r = 1 + \cos\theta$, and a three-petaled flower is
$r = \cos 3\theta$. This lesson builds the graphs from tables of values, uses symmetry to save
work, and catalogs the standard families so you can recognize them on sight.

## Plotting from a table

Think of $\theta$ as a direction that sweeps counterclockwise, and $r$ as how far out the
point is in that direction. A table of values with special angles, plus knowledge of
where $r$ is largest and where it is zero, is usually enough.

### Example 1: a cardioid

Graph $r = 2 + 2\cos\theta$.

| $\theta$ | $0$ | $\tfrac{\pi}{3}$ | $\tfrac{\pi}{2}$ | $\tfrac{2\pi}{3}$ | $\pi$ | $\tfrac{4\pi}{3}$ | $\tfrac{3\pi}{2}$ | $\tfrac{5\pi}{3}$ |
|---|---|---|---|---|---|---|---|---|
| $r$ | $4$ | $3$ | $2$ | $1$ | $0$ | $1$ | $2$ | $3$ |

The curve starts 4 units out along the polar axis, shrinks to the pole at $\theta = \pi$, and grows
back. Because $\cos(-\theta) = \cos\theta$, it's symmetric about the polar axis. The heart shape is a
**cardioid**.

```plot
{"x": [-1.5, 4.5], "y": [-3, 3], "equal": true, "curves": [{"x": "(2 + 2cos(t))cos(t)", "y": "(2 + 2cos(t))sin(t)", "t": [0, 6.2832], "label": "r = 2 + 2cos θ"}], "points": [{"at": [4, 0], "label": "(4, 0)"}, {"at": [0, 2], "label": "(2, π/2)"}, {"at": [0, 0]}], "caption": "A cardioid: r = 2 + 2cos θ"}
```

## Symmetry tests

A polar graph is symmetric

- about the **polar axis** if replacing $\theta$ with $-\theta$ gives an equivalent equation;
- about the **line $\theta = \tfrac{\pi}{2}$** if replacing $\theta$ with $\pi - \theta$ gives an equivalent equation;
- about the **pole** if replacing $r$ with $-r$ (or $\theta$ with $\theta + \pi$) gives an equivalent equation.

Equations in $\cos\theta$ usually pass the first test, and equations in $\sin\theta$ the second.
(The tests are sufficient, not necessary: a graph can be symmetric even if a test fails.)

## The standard families

**Circles.** $r = a$ is a circle of radius $|a|$ centered at the pole. $r = 2a\cos\theta$ and $r = 2a\sin\theta$
are circles of radius $|a|$ passing through the pole, centered on the $x$- or $y$-axis.

**Limaçons** $r = a + b\cos\theta$ or $r = a + b\sin\theta$ (with $a, b > 0$):

| Condition | Shape |
|---|---|
| $a < b$ | inner loop |
| $a = b$ | cardioid |
| $b < a < 2b$ | dimpled |
| $a \ge 2b$ | convex (oval) |

**Rose curves** $r = a\cos n\theta$ or $r = a\sin n\theta$ ($n \ge 2$ an integer): petals of length $|a|$; $n$ petals
if $n$ is odd, $2n$ petals if $n$ is even.

**Lemniscates** $r^2 = a^2\cos 2\theta$ or $r^2 = a^2\sin 2\theta$: a figure-eight (propeller) through the pole.

### Example 2: a limaçon with an inner loop

Graph $r = 1 + 2\cos\theta$.

Here $a = 1 < b = 2$: inner loop. The loop happens where $r$ is negative. $r = 0$ when
$\cos\theta = -\tfrac12$, at $\theta = \tfrac{2\pi}{3}$ and $\tfrac{4\pi}{3}$. Between those angles $r < 0$, and the points are
plotted backward, tracing the small loop inside. The largest $r$ is 3, at $\theta = 0$; at $\theta = \pi$,
$r = -1$, which is the point $(1, 0)$ in rectangular coordinates, the right end of the inner loop.

```plot
{"x": [-1.5, 3.5], "y": [-2.5, 2.5], "equal": true, "curves": [{"x": "(1 + 2cos(t))cos(t)", "y": "(1 + 2cos(t))sin(t)", "t": [0, 6.2832], "label": "r = 1 + 2cos θ"}], "points": [{"at": [3, 0], "label": "(3, 0)"}, {"at": [1, 0], "label": "inner loop"}], "caption": "A limaçon with an inner loop"}
```

### Example 3: a four-petaled rose

Graph $r = 3\sin 2\theta$.

$n = 2$ is even, so there are $2n = 4$ petals of length 3. $|r| = 3$ when $\sin 2\theta = \pm1$, at
$\theta = \tfrac{\pi}{4}, \tfrac{3\pi}{4}, \tfrac{5\pi}{4}, \tfrac{7\pi}{4}$, and those are the petal tips' directions.
$r = 0$ when $2\theta$ is a multiple of $\pi$: at multiples of $\tfrac{\pi}{2}$, where the curve passes through the
pole between petals. The petal in direction $\tfrac{3\pi}{4}$ is actually traced with $r < 0$ while $\theta$ goes
from $\tfrac{3\pi}{2}$ to $2\pi$.

```plot
{"x": [-3.5, 3.5], "y": [-3.5, 3.5], "equal": true, "curves": [{"x": "3sin(2t)cos(t)", "y": "3sin(2t)sin(t)", "t": [0, 6.2832], "label": "r = 3 sin 2θ"}, {"x": "4cos(3t)cos(t)", "y": "4cos(3t)sin(t)", "t": [0, 3.1416], "dashed": true, "label": "r = 4 cos 3θ"}], "caption": "Roses: sin 2θ has 4 petals (solid); cos 3θ has 3 (dashed)"}
```

### Example 4: a three-petaled rose

For $r = 4\cos 3\theta$: $n = 3$ is odd, so 3 petals of length 4. One tip is at $\theta = 0$ (where
$\cos 0 = 1$); the others are $\tfrac{2\pi}{3}$ apart. With odd $n$, the whole rose is traced once as $\theta$
goes from 0 to $\pi$; going on to $2\pi$ retraces it.

### Example 5: a lemniscate

$r^2 = 9\cos 2\theta$ is defined only where $\cos 2\theta \ge 0$, so $-\tfrac{\pi}{4} \le \theta \le \tfrac{\pi}{4}$ (and the same
interval shifted by $\pi$). The loops reach $r = 3$ at $\theta = 0$ and $\theta = \pi$.

```plot
{"x": [-3.5, 3.5], "y": [-1.8, 1.8], "equal": true, "curves": [{"x": "3sqrt(cos(2t))cos(t)", "y": "3sqrt(cos(2t))sin(t)", "t": [-0.7854, 0.7854]}, {"x": "-3sqrt(cos(2t))cos(t)", "y": "-3sqrt(cos(2t))sin(t)", "t": [-0.7854, 0.7854]}], "caption": "The lemniscate r² = 9 cos 2θ"}
```

## Graphing with technology

Graphing calculators and software have a polar mode in which you enter $r$ as a function of
$\theta$ and choose a $\theta$-range. Use $0 \le \theta \le 2\pi$ for most curves, and remember that some (odd
roses, for instance) are complete after $\theta = \pi$.

## Common mistakes

- **Counting rose petals wrong.** Odd $n$: $n$ petals. Even $n$: $2n$ petals. $r = \cos 2\theta$ has 4, not 2.
- **Ignoring negative $r$.** Negative values plot in the opposite direction; they create inner
  loops and some petals.
- **Plotting $\theta$ as if it were $x$.** In a polar graph, $\theta$ is a direction, not a horizontal position.
- **Assuming a failed symmetry test means no symmetry.** The tests can miss symmetry.

## Key points

- Graph $r = f(\theta)$ from a table, the zeros of $r$, and the maximum of $|r|$.
- Circles: $r = a$, $r = 2a\cos\theta$, $r = 2a\sin\theta$.
- Limaçon $r = a + b\cos\theta$: inner loop ($a < b$), cardioid ($a = b$), dimpled, convex.
- Rose $r = a\cos n\theta$: $n$ petals for odd $n$, $2n$ for even $n$, length $|a|$.
- Lemniscate $r^2 = a^2\cos 2\theta$.
