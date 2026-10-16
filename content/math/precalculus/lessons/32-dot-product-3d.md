---
id: pc-dot-product
module: pc-m8
title: The dot product and vectors in space
minutes: 35
topics: [Dot product, Vectors in 3D]
drills: [pc-dot-angle, pc-projection, pc-3d-distance]
refs: [pc-ref-conics-polar]
---
## Multiplying vectors

The last lesson added vectors and scaled them by numbers. Is there a useful way to multiply two vectors? There are two. The **dot product** produces a *number*, and it measures how much two vectors point the same way: it gives angles between vectors, tests for perpendicularity, splits a force into useful parts, and computes work. Then we move from the plane into three-dimensional space, where everything carries over with one extra component, and we meet the second product, the cross product, briefly.

## The dot product

For $\vec u = \langle u_1, u_2 \rangle$ and $\vec v = \langle v_1, v_2 \rangle$,

$$\vec u \cdot \vec v = u_1v_1 + u_2v_2.$$

Multiply matching components and add. (You met this as "row times column" in matrix multiplication.) Properties: $\vec u \cdot \vec v = \vec v \cdot \vec u$; $\vec u \cdot (\vec v + \vec w) = \vec u \cdot \vec v + \vec u \cdot \vec w$; and $\vec v \cdot \vec v = \lVert\vec v\rVert^2$.

## The angle between two vectors

The dot product has a geometric meaning:

$$\vec u \cdot \vec v = \lVert\vec u\rVert\,\lVert\vec v\rVert\cos\theta,$$

where $\theta$ ($0 \le \theta \le \pi$) is the angle between the vectors. Why: apply the law of cosines to the triangle with sides $\vec u$, $\vec v$ and $\vec u - \vec v$: $\lVert\vec u - \vec v\rVert^2 = \lVert\vec u\rVert^2 + \lVert\vec v\rVert^2 - 2\lVert\vec u\rVert\lVert\vec v\rVert\cos\theta$. Expanding the left side as $(\vec u - \vec v)\cdot(\vec u - \vec v) = \lVert\vec u\rVert^2 - 2\vec u \cdot \vec v + \lVert\vec v\rVert^2$ and comparing gives the formula. Solving for the angle:

$$\cos\theta = \frac{\vec u \cdot \vec v}{\lVert\vec u\rVert\,\lVert\vec v\rVert}.$$

The sign of the dot product tells you a lot: positive means an acute angle, zero means a right angle, negative means an obtuse angle.

### Example 1

Find the angle between $\vec u = \langle 3, 4 \rangle$ and $\vec v = \langle -2, 5 \rangle$.

$\vec u \cdot \vec v = -6 + 20 = 14$, $\lVert\vec u\rVert = 5$, $\lVert\vec v\rVert = \sqrt{29}$. So $\cos\theta = \frac{14}{5\sqrt{29}} \approx 0.5199$ and $\theta \approx 58.7^\circ$.

## Orthogonal vectors

Two vectors are **orthogonal** (perpendicular) when the angle between them is $90^\circ$, which happens exactly when

$$\vec u \cdot \vec v = 0.$$

For example, $\langle 2, -3 \rangle \cdot \langle 6, 4 \rangle = 12 - 12 = 0$, so they are orthogonal. This test is far quicker than comparing slopes, and it works in any dimension.

## Projections

Often we want the part of one vector that points along another: the part of gravity that pulls a cart down a ramp, or the part of a force that moves an object in its direction of travel. The **vector projection** of $\vec u$ onto $\vec v$ is

$$\text{proj}_{\vec v}\,\vec u = \frac{\vec u \cdot \vec v}{\lVert\vec v\rVert^2}\,\vec v.$$

Its signed length, $\dfrac{\vec u \cdot \vec v}{\lVert\vec v\rVert}$, is the **scalar projection** (or component of $\vec u$ along $\vec v$). The leftover $\vec u - \text{proj}_{\vec v}\vec u$ is orthogonal to $\vec v$, so every vector splits into a part along $\vec v$ plus a part perpendicular to it.

```plot
{"x": [-0.5, 5], "y": [-0.5, 3], "equal": true, "segments": [{"from": [0, 0], "to": [4, 2], "arrow": true, "label": "u"}, {"from": [0, 0], "to": [3, 1], "arrow": true, "label": "v"}, {"from": [0, 0], "to": [4.2, 1.4], "arrow": true, "label": "proj"}, {"from": [4, 2], "to": [4.2, 1.4], "dashed": true}], "caption": "The projection of u = ⟨4, 2⟩ onto v = ⟨3, 1⟩ is ⟨4.2, 1.4⟩; the dashed piece is perpendicular to v."}
```

### Example 2

Project $\vec u = \langle 4, 2 \rangle$ onto $\vec v = \langle 3, 1 \rangle$.

$\vec u \cdot \vec v = 12 + 2 = 14$ and $\lVert\vec v\rVert^2 = 10$, so

$$\text{proj}_{\vec v}\,\vec u = \frac{14}{10}\langle 3, 1 \rangle = \langle 4.2, 1.4 \rangle.$$

The perpendicular part is $\langle 4, 2 \rangle - \langle 4.2, 1.4 \rangle = \langle -0.2, 0.6 \rangle$; check: $\langle -0.2, 0.6 \rangle \cdot \langle 3, 1 \rangle = -0.6 + 0.6 = 0$. ✓

## Work

If a constant force $\vec F$ moves an object along a displacement $\vec d$, the **work** done is

$$W = \vec F \cdot \vec d = \lVert\vec F\rVert\,\lVert\vec d\rVert\cos\theta.$$

Only the part of the force along the motion does work.

### Example 3

A child pulls a wagon 50 m along level ground with a force of 30 N on a handle angled $25^\circ$ above horizontal. How much work is done?

$W = 30 \cdot 50 \cdot \cos 25^\circ \approx 1359.5$ joules.

## Vectors in three dimensions

Space gets a third axis, $z$, perpendicular to the $xy$-plane (by the right-hand rule: curl the fingers of your right hand from $x$ toward $y$, and your thumb points along $z$). A point is an ordered triple $(x, y, z)$. Everything from the plane extends by adding a third component:

| Idea | In 3D |
|---|---|
| Distance between points | $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$ |
| Vector from $P$ to $Q$ | $\langle x_2 - x_1,\ y_2 - y_1,\ z_2 - z_1 \rangle$ |
| Magnitude | $\sqrt{a^2 + b^2 + c^2}$ |
| Dot product | $u_1v_1 + u_2v_2 + u_3v_3$ |
| Standard unit vectors | $\mathbf{i}, \mathbf{j}, \mathbf{k}$ |

The sphere with center $(h, k, l)$ and radius $r$ is $(x - h)^2 + (y - k)^2 + (z - l)^2 = r^2$, the 3D version of a circle.

### Example 4

Find the distance between $(1, -2, 3)$ and $(4, 2, -9)$, and the angle between $\vec u = \langle 1, 2, -2 \rangle$ and $\vec v = \langle 3, 0, 4 \rangle$.

- Distance: $\sqrt{3^2 + 4^2 + (-12)^2} = \sqrt{169} = 13$.
- $\vec u \cdot \vec v = 3 + 0 - 8 = -5$; $\lVert\vec u\rVert = 3$; $\lVert\vec v\rVert = 5$. $\cos\theta = -\frac{5}{15} = -\frac13$, so $\theta \approx 109.5^\circ$ (obtuse, as the negative dot product predicted).

## The cross product, briefly

In 3D only, there is a product that gives a *vector* orthogonal to both factors, the **cross product**:

$$\vec u \times \vec v = \langle u_2v_3 - u_3v_2,\ u_3v_1 - u_1v_3,\ u_1v_2 - u_2v_1 \rangle.$$

Its magnitude $\lVert\vec u\rVert\lVert\vec v\rVert\sin\theta$ is the area of the parallelogram the two vectors span. For $\vec u = \langle 1, 2, -2 \rangle$ and $\vec v = \langle 3, 0, 4 \rangle$: $\vec u \times \vec v = \langle 8 - 0,\ -6 - 4,\ 0 - 6 \rangle = \langle 8, -10, -6 \rangle$, and indeed $\vec u \cdot \langle 8, -10, -6 \rangle = 8 - 20 + 12 = 0$. The cross product is developed in multivariable calculus.

## Common mistakes

- *Expecting a vector from a dot product.* $\vec u \cdot \vec v$ is a number.
- *Dividing by $\lVert\vec v\rVert$ instead of $\lVert\vec v\rVert^2$* in the vector projection.
- *Degree/radian confusion* when taking $\cos^{-1}$.
- *Thinking a negative dot product is an error.* It means the angle is obtuse.
- *Forgetting the $z$-terms* in 3D distances and dot products.

## Key points

- $\vec u \cdot \vec v = u_1v_1 + u_2v_2\,(+\,u_3v_3) = \lVert\vec u\rVert\lVert\vec v\rVert\cos\theta$.
- $\cos\theta = \frac{\vec u \cdot \vec v}{\lVert\vec u\rVert\lVert\vec v\rVert}$; orthogonal $\iff \vec u \cdot \vec v = 0$.
- $\text{proj}_{\vec v}\vec u = \frac{\vec u \cdot \vec v}{\lVert\vec v\rVert^2}\vec v$; work $W = \vec F \cdot \vec d$.
- In 3D, add a $z$-component to every formula; distance $\sqrt{\Delta x^2 + \Delta y^2 + \Delta z^2}$.
- $\vec u \times \vec v$ (3D only) is orthogonal to both $\vec u$ and $\vec v$.
