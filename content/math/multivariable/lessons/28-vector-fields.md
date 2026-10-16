---
id: mv-vector-fields
module: mv-m7
title: Vector fields
minutes: 30
topics: [Vector fields, Gradient fields]
drills: [mv-d-vf-eval, mv-d-grad-field]
refs: [mv-ref-vector-calculus]
---
## Arrows everywhere

The last part of the course is about **vector calculus**: calculus of quantities that have a
direction at every point. Wind on a weather map, water flowing in a river, the gravitational
pull around a planet, the electric field around a charge: each assigns a vector to every
point of a region. To work with them we need one new object, the vector field, and then
new kinds of integrals (along curves and over surfaces) that measure what a field does.

## Definition

A **vector field** on a region $D$ of the plane is a function $\mathbf F$ that assigns to
each point $(x, y)$ in $D$ a two-dimensional vector:

$$\mathbf F(x, y) = P(x, y)\,\mathbf i + Q(x, y)\,\mathbf j = \langle P(x, y),\, Q(x, y)\rangle.$$

In space, $\mathbf F(x, y, z) = \langle P, Q, R\rangle$. The scalar functions $P, Q, R$ are the
**component functions**. We say $\mathbf F$ is continuous (or smooth) when its components
are. To picture a field, draw the vector $\mathbf F(x, y)$ as an arrow starting at
$(x, y)$ for a grid of points; arrows are usually scaled down so they do not overlap.

### Example 1: rotation

Sketch $\mathbf F(x, y) = \langle -y,\, x\rangle$.

At $(1, 0)$ the vector is $\langle 0, 1\rangle$ (up); at $(0, 1)$ it is $\langle -1, 0\rangle$
(left); at $(-1, 0)$ it is $\langle 0, -1\rangle$ (down). Each arrow is perpendicular to the
position vector $\langle x, y\rangle$, since $\langle x, y\rangle\cdot\langle -y, x\rangle = 0$,
and has length $\sqrt{x^2 + y^2}$, the distance from the origin. The field swirls
counterclockwise, faster farther out, like a rotating turntable.

```plot
{"x": [-3, 3], "y": [-3, 3], "equal": true, "vectorField": {"u": "-y", "v": "x", "step": 0.75}, "curves": [{"x": "2*cos(t)", "y": "2*sin(t)", "t": [0, "2pi"], "dashed": true}], "caption": "F = ⟨−y, x⟩: a counterclockwise rotation; its flow lines are circles"}
```

### Example 2: radial fields

$\mathbf F(x, y) = \langle x, y\rangle$ points straight away from the origin, with length equal
to the distance. Fields pointing along the position vector are called **radial**.

```plot
{"x": [-3, 3], "y": [-3, 3], "equal": true, "vectorField": {"u": "x", "v": "y", "step": 0.75}, "caption": "F = ⟨x, y⟩: a radial field pointing outward"}
```

### Example 3: gravity

By Newton's law of gravitation, a mass $M$ at the origin pulls a mass $m$ at position
$\mathbf x = \langle x, y, z\rangle$ with force

$$\mathbf F(\mathbf x) = -\frac{mMG}{|\mathbf x|^3}\,\mathbf x,$$

which points toward the origin (the minus sign) with magnitude $\dfrac{mMG}{|\mathbf x|^2}$:
an inverse-square law. The electric field of a point charge has the same form. This field
is radial too, but pointing inward and weakening with distance.

## Gradient fields

If $f(x, y)$ is a scalar function, its gradient
$\nabla f = \langle f_x, f_y\rangle$ is a vector field, the **gradient field** of $f$. Its
arrows point uphill and cross the level curves of $f$ at right angles (Lesson 16).

For example, $f(x, y) = x^2y - y^3$ has gradient field
$\nabla f = \langle 2xy,\; x^2 - 3y^2\rangle$.

A vector field $\mathbf F$ is called **conservative** if it is the gradient of some scalar
function: $\mathbf F = \nabla f$. Then $f$ is called a **potential function** for
$\mathbf F$. The gravitational field is conservative: it is the gradient of
$f(\mathbf x) = \dfrac{mMG}{|\mathbf x|}$ (check one component:
$\partial_x\left(mMG(x^2 + y^2 + z^2)^{-1/2}\right) = -\dfrac{mMGx}{|\mathbf x|^3}$). The rotation
field $\langle -y, x\rangle$ is not conservative, as we will see in Lesson 30. Conservative
fields have remarkable properties, and much of the next three lessons is about recognizing
them.

### Example 4

Is $\mathbf F = \langle 2x + y,\; x + 2y\rangle$ a gradient field? Try to find $f$ with
$f_x = 2x + y$: integrating in $x$ gives $f = x^2 + xy + g(y)$. Then
$f_y = x + g'(y)$ must equal $x + 2y$, so $g'(y) = 2y$ and $g = y^2$. So
$f(x, y) = x^2 + xy + y^2$ works, and $\mathbf F$ is conservative. Lesson 30 makes this
procedure systematic.

## Flow lines

If $\mathbf F$ is the velocity field of a fluid, a particle dropped into the fluid moves along a
**flow line** (streamline): a curve $\mathbf r(t)$ whose velocity always equals the field,
$\mathbf r'(t) = \mathbf F(\mathbf r(t))$. For the rotation field, the curve
$\mathbf r(t) = \langle \cos t, \sin t\rangle$ has $\mathbf r' = \langle -\sin t, \cos t\rangle = \mathbf F(\mathbf r(t))$,
so the flow lines are circles around the origin. On a picture of the field, flow lines are
the curves that the arrows are tangent to everywhere.

## Fields in three dimensions

Everything above works in space. For example, $\mathbf F = \langle -y,\, x,\, 1\rangle$ combines the rotation about the $z$-axis with a steady upward drift: its flow lines are helices $\langle\cos t, \sin t, t\rangle$, the curves from Lesson 7. A picture of a 3D field is hard to draw, so we often study its slices or its flow lines instead.

## Common mistakes

- Treating a vector field as a scalar: $\mathbf F(1, 2)$ is a vector, not a number.
- Drawing arrows at the origin instead of at the point where the field is evaluated.
- Assuming every field is a gradient; most are not.
- Confusing the potential $f$ (a scalar) with the field $\nabla f$ (a vector).

## Key points

- A vector field assigns a vector $\langle P, Q\rangle$ or $\langle P, Q, R\rangle$ to each point.
- Gradient fields $\nabla f$ are perpendicular to the level curves of $f$.
- $\mathbf F$ is conservative if $\mathbf F = \nabla f$; $f$ is a potential function.
- Flow lines satisfy $\mathbf r'(t) = \mathbf F(\mathbf r(t))$.
