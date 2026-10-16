---
id: mv-gradient
module: mv-m3
title: Directional derivatives and the gradient
minutes: 40
topics: [Directional derivatives, The gradient]
drills: [mv-d-gradient, mv-d-dir-deriv, mv-d-max-rate]
refs: [mv-ref-differential]
---
## Slopes in every direction

Partial derivatives give the rate of change of $f$ when moving due east ($f_x$) or due north
($f_y$). A hiker can walk in any direction. This lesson finds the rate of change in an
arbitrary direction, and in the process discovers the single most important vector in
multivariable calculus: the gradient. It points uphill, its length is the steepness, and it
is perpendicular to level curves. Much of the rest of the course (optimization, conservative
fields, potential functions) is built on it.

## Directional derivatives

Let $\mathbf u = \langle a, b\rangle$ be a unit vector. The **directional derivative**
of $f$ at $(x_0, y_0)$ in the direction $\mathbf u$ is

$$D_{\mathbf u}f(x_0, y_0) = \lim_{h\to0}\frac{f(x_0 + ha,\, y_0 + hb) - f(x_0, y_0)}{h}.$$

It is the slope of the surface along the line through $(x_0, y_0)$ in direction
$\mathbf u$. With $\mathbf u = \mathbf i$ it is $f_x$; with $\mathbf u = \mathbf j$ it is
$f_y$.

**Computing it.** Let $g(h) = f(x_0 + ha, y_0 + hb)$. Then $D_{\mathbf u}f = g'(0)$, and the
chain rule (with $dx/dh = a$, $dy/dh = b$) gives

$$D_{\mathbf u}f(x, y) = f_x(x, y)\,a + f_y(x, y)\,b.$$

## The gradient

That formula is a dot product. The **gradient** of $f$ is the vector of its partial
derivatives,

$$\nabla f(x, y) = \langle f_x(x, y),\, f_y(x, y)\rangle\qquad(\text{and } \langle f_x, f_y, f_z\rangle \text{ in three variables}),$$

read "del $f$" or "grad $f$." Then

$$D_{\mathbf u}f = \nabla f\cdot\mathbf u.$$

If the direction is given by a non-unit vector $\mathbf v$, first normalize:
$\mathbf u = \mathbf v/|\mathbf v|$.

### Example 1

Find the directional derivative of $f(x, y) = x^2y^3 - 4y$ at $(2, -1)$ in the direction of $\mathbf v = \langle 2, 5\rangle$.

1. $\nabla f = \langle 2xy^3,\; 3x^2y^2 - 4\rangle$, so $\nabla f(2, -1) = \langle -4, 8\rangle$.
2. $|\mathbf v| = \sqrt{29}$, so $\mathbf u = \tfrac{1}{\sqrt{29}}\langle 2, 5\rangle$.
3. $D_{\mathbf u}f = \dfrac{(-4)(2) + (8)(5)}{\sqrt{29}} = \dfrac{32}{\sqrt{29}} \approx 5.94$.

## Maximum rate of change

Since $D_{\mathbf u}f = \nabla f\cdot\mathbf u = |\nabla f|\,|\mathbf u|\cos\theta = |\nabla f|\cos\theta$,
where $\theta$ is the angle between $\nabla f$ and $\mathbf u$:

- The maximum value of $D_{\mathbf u}f$ is $|\nabla f|$, attained when $\mathbf u$ points
  in the direction of $\nabla f$ ($\theta = 0$). The gradient points in the direction of
  steepest ascent.
- The minimum is $-|\nabla f|$, in the direction $-\nabla f$ (steepest descent).
- $D_{\mathbf u}f = 0$ when $\mathbf u \perp \nabla f$: moving along the level curve.

### Example 2

At $(2, 0)$, in what direction does $f(x, y) = xe^y$ increase fastest, and how fast?

$\nabla f = \langle e^y,\, xe^y\rangle = \langle 1, 2\rangle$ at $(2, 0)$. The fastest increase
is in the direction $\tfrac{1}{\sqrt5}\langle 1, 2\rangle$, at rate $|\nabla f| = \sqrt5 \approx 2.24$.

## The gradient is perpendicular to level sets

If $\mathbf r(t)$ runs along a level curve $f(x, y) = c$, then $f(\mathbf r(t)) = c$ for all
$t$. Differentiate with the chain rule: $\nabla f\cdot\mathbf r'(t) = 0$. So $\nabla f$ is
orthogonal to the level curve through each point (wherever $\nabla f \ne \mathbf 0$). On a
contour map, gradient vectors cross the level curves at right angles, pointing toward
higher values, and they are longer where the curves are crowded.

```plot
{"x": [-3, 3], "y": [-2.2, 2.2], "equal": true, "curves": [{"x": "sqrt(2)*cos(t)", "y": "sin(t)", "t": [0, "2pi"], "label": "c = 2"}, {"x": "2*cos(t)", "y": "sqrt(2)*sin(t)", "t": [0, "2pi"], "label": "c = 4"}, {"x": "sqrt(6)*cos(t)", "y": "sqrt(3)*sin(t)", "t": [0, "2pi"], "label": "c = 6"}], "vectorField": {"u": "2*x", "v": "4*y", "step": 0.75}, "caption": "f = x² + 2y²: the gradient field ⟨2x, 4y⟩ crosses every level curve at a right angle"}
```

The same argument in three variables shows that $\nabla F(x_0, y_0, z_0)$ is perpendicular to
the level surface $F(x, y, z) = k$ through that point. That gives the **tangent plane to a level surface**:

$$F_x(x_0,y_0,z_0)(x - x_0) + F_y(x_0,y_0,z_0)(y - y_0) + F_z(x_0,y_0,z_0)(z - z_0) = 0,$$

and the **normal line** $\mathbf r = \langle x_0, y_0, z_0\rangle + t\,\nabla F(x_0, y_0, z_0)$.
(For a graph $z = f(x, y)$, take $F = f(x, y) - z$; then $\nabla F = \langle f_x, f_y, -1\rangle$,
the normal from Lesson 14.)

### Example 3

Find the tangent plane to the ellipsoid $\dfrac{x^2}{4} + y^2 + \dfrac{z^2}{9} = 3$ at $(-2, 1, -3)$.

1. $\nabla F = \left\langle \dfrac{x}{2},\, 2y,\, \dfrac{2z}{9}\right\rangle = \left\langle -1, 2, -\tfrac23\right\rangle$ at the point.
2. Plane: $-(x + 2) + 2(y - 1) - \tfrac23(z + 3) = 0$. Multiply by $-3$: $3x - 6y + 2z + 18 = 0$.
3. Check the point: $-6 - 6 - 6 + 18 = 0$. ✓

## Properties worth knowing

The gradient obeys the derivative rules: $\nabla(f + g) = \nabla f + \nabla g$,
$\nabla(fg) = f\nabla g + g\nabla f$, and $\nabla(cf) = c\nabla f$. And the chain rule from
Lesson 15 can be written compactly as $\dfrac{d}{dt}f(\mathbf r(t)) = \nabla f(\mathbf r(t))\cdot\mathbf r'(t)$,
a form we will meet again in the fundamental theorem for line integrals.

## Common mistakes

- Using a non-unit direction vector in $\nabla f\cdot\mathbf u$; always normalize first.
- Reporting the direction of steepest ascent as the maximum rate (or vice versa): the direction is $\nabla f$, the rate is $|\nabla f|$.
- Thinking the gradient is tangent to level curves; it is perpendicular.
- For a level surface, forgetting to move everything to one side before computing $\nabla F$.

## Key points

- $\nabla f = \langle f_x, f_y\rangle$ (or $\langle f_x, f_y, f_z\rangle$); $D_{\mathbf u}f = \nabla f\cdot\mathbf u$ for unit $\mathbf u$.
- Steepest ascent: direction $\nabla f$, rate $|\nabla f|$; zero rate along level curves.
- $\nabla f$ is perpendicular to level curves and level surfaces.
- Tangent plane to $F = k$ at $P$: $\nabla F(P)\cdot\langle x - x_0, y - y_0, z - z_0\rangle = 0$.
