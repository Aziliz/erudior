---
id: mv-several-vars
module: mv-m3
title: Functions of several variables
minutes: 30
topics: [Domain and range, Level curves]
drills: [mv-d-domain-eval, mv-d-level]
refs: [mv-ref-differential]
---
## One output, several inputs

So far our functions have had one input (a number $x$, or a time $t$). Most quantities in
the world depend on several: the temperature in a room depends on position $(x, y, z)$;
the volume of a cylinder depends on its radius and height; the cost of a shipment depends
on weight and distance. A **function of two variables** $f$ assigns to each point $(x, y)$
in a set $D$ (its **domain**) one real number $f(x, y)$. The set of outputs is the
**range**. Functions of three variables $f(x, y, z)$ are defined the same way.

When a formula is given without a stated domain, the domain is every point where the
formula makes sense: no division by zero, no square roots of negatives, no logarithms of
non-positive numbers.

### Example 1: a domain in the plane

Find and describe the domain of $f(x, y) = \dfrac{\sqrt{x + y + 1}}{x - 1}$.

1. The root needs $x + y + 1 \ge 0$, that is, $y \ge -x - 1$: on or above a line.
2. The denominator needs $x \ne 1$.
3. Domain: the closed half-plane above $y = -x - 1$, with the vertical line $x = 1$ removed.

```plot
{"x": [-4, 4], "y": [-4, 4], "functions": [{"f": "-x-1", "label": "y = −x − 1"}], "shade": [{"f": "-x-1", "g": "4", "from": -4, "to": 4}], "segments": [{"from": [1, -4], "to": [1, 4], "dashed": true, "label": "x = 1 excluded"}], "caption": "Domain of √(x + y + 1)/(x − 1): the shaded half-plane minus the dashed line"}
```

## Graphs

The **graph** of $f(x, y)$ is the surface $z = f(x, y)$ in space: above each point of the
domain, plot a point at height $f(x, y)$. For example, $z = 6 - 3x - 2y$ is a plane;
$z = \sqrt{9 - x^2 - y^2}$ is the upper half of the sphere of radius 3; $z = x^2 + y^2$ is a
paraboloid (Lesson 6). Sketching surfaces by hand is hard, which is why we also use a 2D
picture.

## Level curves and contour maps

A **level curve** of $f$ is the set of points in the domain where $f$ takes a fixed value
$c$: the curve $f(x, y) = c$. It is the horizontal trace of the graph at height $c$,
dropped onto the $xy$-plane. A **contour map** draws several level curves, labeled by
their $c$ values, for equally spaced $c$. Topographic maps of mountains, weather maps of
pressure (isobars) and temperature (isotherms) are all contour maps.

How to read one:

- Where level curves for equally spaced values are close together, the function changes
  quickly: the surface is steep.
- Where they are far apart, the surface is nearly flat.
- Level curves never cross (a point cannot have two heights).
- A small closed loop surrounded by others usually marks a peak or a pit.

### Example 2: circles

For $f(x, y) = x^2 + y^2$, the level curve $f = c$ is the circle $x^2 + y^2 = c$ of radius
$\sqrt c$ (for $c > 0$). With $c = 1, 4, 9, 16$ the radii are $1, 2, 3, 4$: evenly
spaced circles. But compare $g(x, y) = \sqrt{x^2 + y^2}$, whose level curves for
$c = 1, 2, 3, 4$ are *also* circles of radius $1, 2, 3, 4$. The pictures look alike, yet
the labels differ: for $f$ the values grow like the square of the radius (a bowl that
steepens), and for $g$ they grow linearly (a cone with constant slope). Always read the
labels.

```plot
{"x": [-4.5, 4.5], "y": [-4.5, 4.5], "equal": true, "curves": [{"x": "cos(t)", "y": "sin(t)", "t": [0, "2pi"], "label": "c = 1"}, {"x": "2*cos(t)", "y": "2*sin(t)", "t": [0, "2pi"], "label": "c = 4"}, {"x": "3*cos(t)", "y": "3*sin(t)", "t": [0, "2pi"], "label": "c = 9"}, {"x": "4*cos(t)", "y": "4*sin(t)", "t": [0, "2pi"], "label": "c = 16"}], "caption": "Contour map of f(x, y) = x² + y² at c = 1, 4, 9, 16"}
```

### Example 3: parabolas

Sketch the contour map of $f(x, y) = y - x^2$ for $c = -2, -1, 0, 1, 2$.

Setting $y - x^2 = c$ gives $y = x^2 + c$: the same upward parabola shifted vertically.
Because the shifts are equal (1 unit apart), the surface rises at the same rate as you
move in the $y$ direction, everywhere. (The graph $z = y - x^2$ is in fact a parabolic
cylinder whose rulings tilt upward along the direction $\langle 0, 1, 1\rangle$.)

```plot
{"x": [-3, 3], "y": [-3, 4], "functions": [{"f": "x^2-2", "label": "c = −2"}, {"f": "x^2-1", "label": "c = −1"}, {"f": "x^2", "label": "c = 0"}, {"f": "x^2+1", "label": "c = 1"}, {"f": "x^2+2", "label": "c = 2"}], "caption": "Level curves of f(x, y) = y − x²"}
```

A saddle has a very different signature: for $f(x, y) = xy$, the level curves $xy = c$ are
hyperbolas in the first and third quadrants for $c > 0$, in the second and fourth for
$c < 0$, and the two axes for $c = 0$.

## Functions of three variables

We cannot graph $w = f(x, y, z)$ (that would need four dimensions), but we can draw its
**level surfaces** $f(x, y, z) = c$. For $f(x, y, z) = x^2 + y^2 + z^2$ the level surfaces
are spheres centered at the origin; for $f = x + 2y + 3z$ they are parallel planes. If $f$
is a temperature, its level surfaces are surfaces of equal temperature. In Lesson 16 we
will see that the gradient of $f$ is perpendicular to these level sets.

## Common mistakes

- Forgetting that a domain is a region in the plane (draw it), not an interval.
- Using strict inequality for a square root ($\sqrt0$ is fine) or non-strict for a logarithm ($\ln0$ is not).
- Reading a contour map without its labels; equally spaced curves can describe very different surfaces.
- Thinking a level curve of $f(x, y)$ lives on the surface; it is drawn in the $xy$-plane.

## Key points

- $f(x, y)$ takes points in a plane region (the domain) to numbers; its graph is the surface $z = f(x, y)$.
- Level curves $f(x, y) = c$ form a contour map; close spacing means steep.
- Level surfaces $f(x, y, z) = c$ play the same role for three variables.
