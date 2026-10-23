---
id: la-m4-h-lines
module: la-m4
title: Projections, reflections and rotations through any line
minutes: 45
honors: true
topics: [Reflections and projections]
drills: [la-m4-r2-project, la-m4-r2-reflect, la-m4-r2-two-reflections]
---
## Beyond the coordinate axes

The standard matrix lesson built a gallery of plane transformations: reflections across the
axes and the line $x_2 = x_1$, the projection onto the $x_1$-axis, rotations. Every one of
them used a line that sits nicely on the grid. Real problems are not so polite. A computer
game reflects a light ray off a slanted mirror; a surveyor projects a position onto a road
that runs at $27^\circ$. This lesson finds the matrices for projecting onto, and reflecting
across, *any* line through the origin. Along the way it proves a classic fact: two
reflections in a row always make a rotation.

The method is the one you already know: a linear transformation is pinned down by where it
sends a few vectors. The only new ingredient is a little trigonometry.

## What a linear map does to lines

First, a fact that explains why the "follow the unit square" method works at all. A line
in $\mathbb{R}^2$ (through the origin or not) is a set of points $\mathbf{p} + t\mathbf{d}$,
where $\mathbf{p}$ is a point on it, $\mathbf{d} \ne \mathbf{0}$ is a direction, and $t$ runs
over all real numbers. If $T$ is linear,

$$T(\mathbf{p} + t\mathbf{d}) = T(\mathbf{p}) + t\,T(\mathbf{d}).$$

So the image is again a line through $T(\mathbf{p})$ with direction $T(\mathbf{d})$, or a
single point if $T(\mathbf{d}) = \mathbf{0}$. Three consequences follow at once:

- Straight edges stay straight, so a polygon is sent to a polygon (possibly flattened).
- Parallel lines share a direction $\mathbf{d}$, so their images share the direction $T(\mathbf{d})$: parallel lines stay parallel (or collapse).
- The midpoint $\tfrac12(\mathbf{p} + \mathbf{q})$ goes to $\tfrac12(T(\mathbf{p}) + T(\mathbf{q}))$, the midpoint of the images.

That is why a grid of squares is carried to a grid of parallelograms, and why knowing the
images of $\mathbf{e}_1$ and $\mathbf{e}_2$ is enough to draw the image of any shape.

## Projection onto a line

Let $L$ be the line through the origin that makes an angle $\theta$ with the positive
$x_1$-axis, and let $\mathbf{u} = (\cos\theta, \sin\theta)$ be the unit vector along it. The
projection $P$ onto $L$ sends each point $\mathbf{x}$ to the point of $L$ closest to it: drop
a perpendicular from $\mathbf{x}$ to $L$ and take its foot. Projection onto a line is
linear (adding two vectors and then projecting gives the same point as projecting each and
adding), so we only need its standard matrix.

Where does $\mathbf{e}_1$ go? The segment from $\mathbf{0}$ to $\mathbf{e}_1$ (length 1) is
the hypotenuse of a right triangle whose other side lies along $L$ and makes the angle
$\theta$ with it. That side has length $\cos\theta$, so $P(\mathbf{e}_1) = \cos\theta\,\mathbf{u}$.
The same picture for $\mathbf{e}_2$, which makes the angle $90^\circ - \theta$ with $L$, gives
$P(\mathbf{e}_2) = \sin\theta\,\mathbf{u}$. (For other angles the lengths become signed, and
the result is the same.) The columns are therefore

$$P = \begin{bmatrix} \cos^2\theta & \cos\theta\sin\theta \\ \cos\theta\sin\theta & \sin^2\theta\end{bmatrix}.$$

You can check this formula for every $\theta$ without any picture. A point on $L$ should
stay put, and a vector perpendicular to $L$ should go to $\mathbf{0}$. Indeed
$P\mathbf{u} = (\cos^3\theta + \cos\theta\sin^2\theta,\ \cos^2\theta\sin\theta + \sin^3\theta) = \mathbf{u}$,
since $\cos^2\theta + \sin^2\theta = 1$, and for $\mathbf{n} = (-\sin\theta, \cos\theta)$ both
entries of $P\mathbf{n}$ are 0. Because $\mathbf{u}$ and $\mathbf{n}$ span the plane,
superposition says these two facts determine $P$ completely.

Lines are often given by a slope instead of an angle. For the line $x_2 = m x_1$, the point
$(1, m)$ lies on it, so $\cos\theta = 1/\sqrt{1 + m^2}$ and $\sin\theta = m/\sqrt{1 + m^2}$
(taking $\theta$ between $-90^\circ$ and $90^\circ$). Then

$$P = \frac{1}{1 + m^2}\begin{bmatrix} 1 & m \\ m & m^2\end{bmatrix}.$$

## Reflection across a line

Reflecting $\mathbf{x}$ across $L$ moves it straight across the line to the same distance on
the other side. The foot of the perpendicular, $P\mathbf{x}$, is exactly halfway between
$\mathbf{x}$ and its reflection $R\mathbf{x}$:

$$P\mathbf{x} = \tfrac12(\mathbf{x} + R\mathbf{x}), \quad\text{so}\quad R\mathbf{x} = 2P\mathbf{x} - \mathbf{x}.$$

In matrix terms $R = 2P - I$. Using the **double-angle identities**
$\cos 2\theta = 2\cos^2\theta - 1 = 1 - 2\sin^2\theta$ and $\sin 2\theta = 2\sin\theta\cos\theta$:

$$R = \begin{bmatrix} 2\cos^2\theta - 1 & 2\cos\theta\sin\theta \\ 2\cos\theta\sin\theta & 2\sin^2\theta - 1\end{bmatrix} = \begin{bmatrix} \cos 2\theta & \sin 2\theta \\ \sin 2\theta & -\cos 2\theta\end{bmatrix}.$$

Notice the angle $2\theta$: the reflection matrix for a line at angle $\theta$ is built from
*twice* that angle. Check against the gallery: $\theta = 0$ gives
$\begin{bmatrix} 1 & 0 \\ 0 & -1\end{bmatrix}$ (the $x_1$-axis) and $\theta = 45^\circ$ gives
$\begin{bmatrix} 0 & 1 \\ 1 & 0\end{bmatrix}$ (the line $x_2 = x_1$). In slope form,

$$R = \frac{1}{1 + m^2}\begin{bmatrix} 1 - m^2 & 2m \\ 2m & m^2 - 1\end{bmatrix}.$$

Two properties are worth naming. Projecting twice is the same as projecting once, since a
point already on $L$ stays put: $P(P\mathbf{x}) = P\mathbf{x}$. A map with this property is
**idempotent**. Reflecting twice brings every point back: $R(R\mathbf{x}) = \mathbf{x}$. A
map that undoes itself is an **involution**.

### Example 1

Find the matrices of the projection onto, and reflection across, the line $x_2 = 2x_1$, and
use them on $\mathbf{x} = (3, 1)$.

1. Here $m = 2$ and $1 + m^2 = 5$, so $P = \dfrac15\begin{bmatrix} 1 & 2 \\ 2 & 4\end{bmatrix}$ and $R = \dfrac15\begin{bmatrix} -3 & 4 \\ 4 & 3\end{bmatrix}$.
2. $P\mathbf{x} = \tfrac15(3 + 2,\ 6 + 4) = (1, 2)$. This point is on the line, as it should be.
3. $R\mathbf{x} = 2P\mathbf{x} - \mathbf{x} = (2, 4) - (3, 1) = (-1, 3)$. Directly: $\tfrac15(-9 + 4,\ 12 + 3) = (-1, 3)$.
4. Checks: the midpoint of $(3, 1)$ and $(-1, 3)$ is $(1, 2)$, on the line; the segment between them has direction $(-4, 2)$, perpendicular to the line's direction $(1, 2)$ (their slopes $-\tfrac12$ and $2$ multiply to $-1$); and both vectors have length $\sqrt{10}$.

![The line x₂ = 2x₁ through the origin, the vector x = (3, 1), its projection Px = (1, 2) on the line, and its reflection Rx = (−1, 3). A dashed segment from x to Rx crosses the line at a right angle at Px.](images/la-m4-reflect-line.svg)

## A reflection reverses angles

Write a unit vector by its angle, $\mathbf{w}_\varphi = (\cos\varphi, \sin\varphi)$. Multiplying
by $R$ and using the angle-difference formulas,

$$R\mathbf{w}_\varphi = (\cos 2\theta\cos\varphi + \sin 2\theta\sin\varphi,\ \sin 2\theta\cos\varphi - \cos 2\theta\sin\varphi) = \mathbf{w}_{2\theta - \varphi}.$$

In words: the reflection across the line at angle $\theta$ sends the direction at angle
$\varphi$ to the direction at angle $2\theta - \varphi$. That matches the picture: a vector
$\theta - \varphi$ below the line ends up $\theta - \varphi$ above it. A rotation by $\gamma$,
by contrast, sends $\varphi$ to $\varphi + \gamma$: it keeps the order of directions, while a
reflection reverses it.

## Two reflections make a rotation

Now reflect across the line at angle $\alpha$, and then across the line at angle $\beta$.
Follow a direction $\varphi$:

$$\varphi \;\longmapsto\; 2\alpha - \varphi \;\longmapsto\; 2\beta - (2\alpha - \varphi) = \varphi + 2(\beta - \alpha).$$

Every direction turns by the same angle $2(\beta - \alpha)$, and lengths don't change. In
particular $\mathbf{e}_1$ and $\mathbf{e}_2$ land exactly where the rotation by
$2(\beta - \alpha)$ sends them, and a linear map is determined by those two images. So:

> *Theorem.* Reflecting across the line at angle $\alpha$ and then across the line at angle $\beta$ (both through the origin) is the rotation by $2(\beta - \alpha)$.

The angle is *twice* the angle between the mirrors, and the order matters: swapping the two
reflections rotates by $2(\alpha - \beta)$, the same amount the other way.

The same bookkeeping handles a rotation followed by a reflection. Rotate by $\gamma$, then
reflect across the line at angle $\beta$: $\varphi \mapsto \varphi + \gamma \mapsto 2\beta - \varphi - \gamma$.
That is $2(\beta - \tfrac{\gamma}{2}) - \varphi$, the reflection across the line at angle
$\beta - \tfrac{\gamma}{2}$. A rotation combined with a reflection is always a reflection.

### Example 2

Reflect across the $x_1$-axis and then across the line at $30^\circ$. Find the standard
matrix of the result.

1. By the theorem with $\alpha = 0$ and $\beta = 30^\circ$, the result is the rotation by $60^\circ$: $\begin{bmatrix} \tfrac12 & -\tfrac{\sqrt3}{2} \\ \tfrac{\sqrt3}{2} & \tfrac12\end{bmatrix}$.
2. Check by following $\mathbf{e}_1$: the first reflection leaves it alone, and the second (matrix $\begin{bmatrix} \cos 60^\circ & \sin 60^\circ \\ \sin 60^\circ & -\cos 60^\circ\end{bmatrix}$) sends it to its first column, $(\tfrac12, \tfrac{\sqrt3}{2})$, the direction $60^\circ$.
3. Follow $\mathbf{e}_2$: the first reflection sends it to $(0, -1)$, and the second sends that to minus its second column, $(-\tfrac{\sqrt3}{2}, \tfrac12)$, the direction $150^\circ = 90^\circ + 60^\circ$.
4. Both columns agree with the rotation by $60^\circ$. Reversing the order (the $30^\circ$ line first) gives the rotation by $-60^\circ$ instead.

```plot
{"x": [-2, 3], "y": [-1.5, 2.5], "equal": true, "functions": [{"f": "0.57735*x", "label": "line at 30°", "dashed": true}], "polygons": [{"points": [[1, 0.25], [2.2, 0.25], [2.2, 0.65], [1.5, 0.65], [1.5, 1.1], [1, 1.1]]}, {"points": [[1, -0.25], [2.2, -0.25], [2.2, -0.65], [1.5, -0.65], [1.5, -1.1], [1, -1.1]]}, {"points": [[0.283, 0.991], [0.883, 2.03], [0.537, 2.23], [0.187, 1.624], [-0.203, 1.849], [-0.453, 1.416]]}], "labels": [{"at": [2.65, 0.45], "text": "start"}, {"at": [1.6, -1.35], "text": "after 1st"}, {"at": [-0.9, 2.2], "text": "after 2nd"}], "caption": "A flag reflected across the x₁-axis, then across the line at 30°, ends up rotated 60° from where it started"}
```

## Maps that keep lengths

Rotations and reflections never change the length of a vector; such a map is an
**isometry** (from the Greek for "equal measure"). Projections are not isometries: they
shorten every vector that is not on the line, and send the perpendicular direction to
$\mathbf{0}$. It is a theorem (stated here without proof) that every linear isometry of the
plane is either a rotation or a reflection across a line through the origin. The formulas
above show how to tell them apart from the matrix: a rotation has the pattern
$\begin{bmatrix} a & -b \\ b & a\end{bmatrix}$ and a reflection the pattern
$\begin{bmatrix} a & b \\ b & -a\end{bmatrix}$, each with $a^2 + b^2 = 1$.

### Example 3

Is $T(\mathbf{x}) = \dfrac{1}{5}\begin{bmatrix} 4 & 3 \\ 3 & -4\end{bmatrix}\mathbf{x}$ a rotation or a reflection? Find its line or angle.

1. The matrix has the reflection pattern with $a = \tfrac45$, $b = \tfrac35$, and $a^2 + b^2 = \tfrac{16 + 9}{25} = 1$.
2. So $\cos 2\theta = \tfrac45$ and $\sin 2\theta = \tfrac35$. Rather than find $\theta$ with a calculator, use the slope form: we need $\tfrac{1 - m^2}{1 + m^2} = \tfrac45$, so $5 - 5m^2 = 4 + 4m^2$, $m^2 = \tfrac19$; and $\tfrac{2m}{1 + m^2} = \tfrac35$ needs $m > 0$, so $m = \tfrac13$.
3. Check: $(3, 1)$ is on the line $x_2 = \tfrac13 x_1$, and $T(3, 1) = \tfrac15(12 + 3,\ 9 - 4) = (3, 1)$. A reflection fixes its own line, so $T$ is the reflection across $x_2 = \tfrac13 x_1$ (an angle of about $18.4^\circ$).

## Common mistakes

- *Using $\theta$ instead of $2\theta$ in the reflection matrix.* The entries are $\cos 2\theta$ and $\sin 2\theta$. Test with $\theta = 45^\circ$: the matrix must swap coordinates.
- *Dropping the factor $\tfrac{1}{1 + m^2}$* in the slope forms. Without it, points on the line don't stay put.
- *Mixing up $P$ and $R$.* $P$ lands on the line ($P\mathbf{x}$ is the foot of the perpendicular); $R$ lands on the far side. They are tied by $R = 2P - I$.
- *Getting the rotation angle wrong.* Two reflections rotate by *twice* the angle between the lines, from the first line toward the second: $2(\beta - \alpha)$, not $\beta - \alpha$ and not $2(\alpha - \beta)$.
- *Calling a projection one-to-one.* Every point on a perpendicular line goes to the same foot, so a projection is neither one-to-one nor onto $\mathbb{R}^2$.

## Key points

- A linear map sends lines to lines (or points), keeps parallel lines parallel and keeps midpoints.
- Projection onto the line at angle $\theta$: $P = \begin{bmatrix} \cos^2\theta & \cos\theta\sin\theta \\ \cos\theta\sin\theta & \sin^2\theta\end{bmatrix}$; for $x_2 = mx_1$, $P = \tfrac{1}{1 + m^2}\begin{bmatrix} 1 & m \\ m & m^2\end{bmatrix}$.
- Reflection: $R = 2P - I = \begin{bmatrix} \cos 2\theta & \sin 2\theta \\ \sin 2\theta & -\cos 2\theta\end{bmatrix}$; it sends the direction $\varphi$ to $2\theta - \varphi$.
- $P$ is idempotent ($P$ twice $= P$); $R$ is an involution ($R$ twice $=$ identity).
- Reflecting across the line at $\alpha$, then the line at $\beta$, is the rotation by $2(\beta - \alpha)$; a rotation combined with a reflection is a reflection.
- Rotations and reflections are the length-preserving (isometric) linear maps of the plane.
