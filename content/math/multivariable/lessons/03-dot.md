---
id: mv-dot
module: mv-m1
title: The dot product and projections
minutes: 30
topics: [Dot product, Projections]
drills: [mv-d-dot-angle, mv-d-proj]
refs: [mv-ref-vectors]
---
## Why a product of vectors?

Adding vectors and scaling them tells us nothing about the *angle* between two directions.
Yet angles are everywhere: is a force helping or resisting a motion? Is a surface facing
the light? How fast does temperature change if I walk northeast? The dot product turns the
angle question into simple arithmetic, and it will reappear in work, flux and directional
derivatives.

## Definition and algebra

The **dot product** of $\mathbf a = \langle a_1,a_2,a_3\rangle$ and $\mathbf b = \langle b_1,b_2,b_3\rangle$ is the *number*

$$\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3.$$

It is commutative, distributes over addition, pulls out scalars, and satisfies
$\mathbf a\cdot\mathbf a = |\mathbf a|^2$. That last identity is the bridge to geometry.

## The geometric meaning

**Theorem.** If $\theta$ is the angle between $\mathbf a$ and $\mathbf b$ ($0 \le \theta \le \pi$), then

$$\mathbf a\cdot\mathbf b = |\mathbf a|\,|\mathbf b|\cos\theta.$$

*Why.* Apply the law of cosines to the triangle with sides $\mathbf a$, $\mathbf b$, and
$\mathbf a - \mathbf b$:
$|\mathbf a-\mathbf b|^2 = |\mathbf a|^2 + |\mathbf b|^2 - 2|\mathbf a||\mathbf b|\cos\theta$.
Expanding the left side with the algebra rules gives
$(\mathbf a-\mathbf b)\cdot(\mathbf a-\mathbf b) = |\mathbf a|^2 - 2\,\mathbf a\cdot\mathbf b + |\mathbf b|^2$.
Comparing the two expressions leaves $\mathbf a\cdot\mathbf b = |\mathbf a||\mathbf b|\cos\theta$.

Consequences:

- The angle: $\cos\theta = \dfrac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$.
- The sign tells the type of angle: positive means acute, zero means right angle,
  negative means obtuse.
- $\mathbf a$ and $\mathbf b$ are **orthogonal** (perpendicular) exactly when $\mathbf a\cdot\mathbf b = 0$.

### Example 1

Find the angle between $\mathbf a = \langle 2, 2, -1\rangle$ and $\mathbf b = \langle 5, -3, 2\rangle$.

1. $\mathbf a\cdot\mathbf b = 10 - 6 - 2 = 2$.
2. $|\mathbf a| = \sqrt{4+4+1} = 3$, $|\mathbf b| = \sqrt{25+9+4} = \sqrt{38}$.
3. $\cos\theta = \dfrac{2}{3\sqrt{38}} \approx 0.1081$, so $\theta \approx 1.462$ rad $\approx 83.8^\circ$.

The small positive dot product says the vectors are nearly, but not quite, perpendicular.

## Direction cosines

The angles $\alpha,\beta,\gamma$ that a nonzero vector makes with the positive $x$-, $y$-
and $z$-axes are its **direction angles**; their cosines are the components of the unit
vector: $\cos\alpha = v_1/|\mathbf v|$, and so on. Since a unit vector has length 1,
$\cos^2\alpha + \cos^2\beta + \cos^2\gamma = 1$.

## Projections

Often we want to split a vector into a part along a given direction and a part
perpendicular to it, for example the component of gravity along a ramp.

```plot
{"x": [-0.5, 6.5], "y": [-0.5, 4], "equal": true, "segments": [{"from": [0, 0], "to": [6, 0], "arrow": true}, {"from": [0, 0], "to": [4, 3], "arrow": true, "label": "b"}, {"from": [0, 0], "to": [4, 0], "arrow": true}, {"from": [4, 0], "to": [4, 3], "dashed": true}], "rightAngles": [[[4, 0], [6, 0], [4, 3]]], "caption": "The projection of b onto a is the shadow of b on the line of a", "labels": [{"at": [5.4, 0.25], "text": "a"}, {"at": [2.2, 0.25], "text": "proj_a b"}]}
```

Drop a perpendicular from the tip of $\mathbf b$ to the line of $\mathbf a$. The signed
length of the shadow is the **scalar projection** (component) of $\mathbf b$ onto $\mathbf a$:

$$\operatorname{comp}_{\mathbf a}\mathbf b = |\mathbf b|\cos\theta = \frac{\mathbf a\cdot\mathbf b}{|\mathbf a|}.$$

The **vector projection** is that length times the unit vector along $\mathbf a$:

$$\operatorname{proj}_{\mathbf a}\mathbf b = \frac{\mathbf a\cdot\mathbf b}{|\mathbf a|^2}\,\mathbf a = \frac{\mathbf a\cdot\mathbf b}{\mathbf a\cdot\mathbf a}\,\mathbf a.$$

The leftover $\mathbf b - \operatorname{proj}_{\mathbf a}\mathbf b$ is orthogonal to
$\mathbf a$; you can check by dotting it with $\mathbf a$ and getting zero. So every vector
splits as "along $\mathbf a$" plus "perpendicular to $\mathbf a$."

### Example 2

Find the scalar and vector projections of $\mathbf b = \langle 1, 1, 2\rangle$ onto
$\mathbf a = \langle -2, 3, 1\rangle$.

1. $\mathbf a\cdot\mathbf b = -2 + 3 + 2 = 3$ and $|\mathbf a|^2 = 4+9+1 = 14$.
2. Scalar projection: $3/\sqrt{14} \approx 0.802$.
3. Vector projection: $\tfrac{3}{14}\langle -2,3,1\rangle = \left\langle -\tfrac{3}{7}, \tfrac{9}{14}, \tfrac{3}{14}\right\rangle$.
4. Check orthogonality of the remainder: $\mathbf b - \text{proj} = \left\langle \tfrac{10}{7}, \tfrac{5}{14}, \tfrac{25}{14}\right\rangle$, and its dot product with $\mathbf a$ is $-\tfrac{20}{7}+\tfrac{15}{14}+\tfrac{25}{14} = 0$. ✓

## Work

If a constant force $\mathbf F$ moves an object along a straight displacement $\mathbf D$,
only the part of the force along the motion does **work**:

$$W = |\mathbf F|\cos\theta\;|\mathbf D| = \mathbf F\cdot\mathbf D.$$

### Example 3

A sled is pulled 50 m along level ground by a rope at $30^\circ$ above horizontal with
tension 80 N. The work is $W = 80\cdot 50\cdot\cos 30^\circ = 4000\cdot\tfrac{\sqrt3}{2} \approx 3464$ J.
The vertical part of the pull does no work, since the sled does not move vertically. In
Lesson 29 we let the force vary and the path curve, and this dot product becomes a line integral.

## Common mistakes

- Treating the dot product as a vector. It is a scalar.
- Using degrees and radians inconsistently when taking $\arccos$.
- Dividing by $|\mathbf a|$ instead of $|\mathbf a|^2$ in the vector projection (the result then has the wrong length).
- Projecting onto the wrong vector: $\operatorname{proj}_{\mathbf a}\mathbf b$ points along $\mathbf a$, not $\mathbf b$.

## Key points

- $\mathbf a\cdot\mathbf b = a_1b_1+a_2b_2+a_3b_3 = |\mathbf a||\mathbf b|\cos\theta$.
- Zero dot product means orthogonal; the sign tells acute or obtuse.
- $\operatorname{comp}_{\mathbf a}\mathbf b = \dfrac{\mathbf a\cdot\mathbf b}{|\mathbf a|}$ and $\operatorname{proj}_{\mathbf a}\mathbf b = \dfrac{\mathbf a\cdot\mathbf b}{|\mathbf a|^2}\mathbf a$.
- Work by a constant force is $\mathbf F\cdot\mathbf D$.
