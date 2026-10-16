---
id: mv-param-surfaces
module: mv-m8
title: Parametric surfaces and their areas
minutes: 40
topics: [Parametric surfaces, Surface area]
drills: [mv-d-param-normal, mv-d-cone-area]
refs: [mv-ref-vector-calculus]
---
## Surfaces described by two parameters

A curve in space is traced by one parameter, $\mathbf r(t)$. A surface needs two:
$\mathbf r(u, v)$. Graphs $z = f(x, y)$ are one kind of surface, but many important surfaces are
not graphs (a whole sphere, a cylinder on its side, a torus). Parametric descriptions handle
them all, and they are the setting for surface integrals, flux, and Stokes' theorem in the
lessons that follow.

## Parametric surfaces

A **parametric surface** $S$ is the set of points

$$\mathbf r(u, v) = \langle x(u, v),\; y(u, v),\; z(u, v)\rangle,\qquad (u, v)\in D,$$

as $(u, v)$ ranges over a region $D$ in the $uv$-plane. Holding $v$ fixed and varying $u$
traces a curve on $S$ (a **grid curve**); holding $u$ fixed traces another. The two families
of grid curves form a mesh over the surface, like lines of latitude and longitude.

### Standard parametrizations

| Surface | Parametrization | Parameter domain |
|---|---|---|
| Graph $z = f(x, y)$ | $\langle x,\, y,\, f(x, y)\rangle$ | the region in the $xy$-plane |
| Cylinder $x^2 + y^2 = a^2$ | $\langle a\cos\theta,\, a\sin\theta,\, z\rangle$ | $0 \le \theta \le 2\pi$, $z$ in a range |
| Sphere $x^2 + y^2 + z^2 = a^2$ | $\langle a\sin\phi\cos\theta,\, a\sin\phi\sin\theta,\, a\cos\phi\rangle$ | $0 \le \phi \le \pi$, $0 \le \theta \le 2\pi$ |
| Cone $z = \sqrt{x^2 + y^2}$ | $\langle r\cos\theta,\, r\sin\theta,\, r\rangle$ | $r \ge 0$, $0 \le \theta \le 2\pi$ |
| Plane through $P_0$ containing $\mathbf a$, $\mathbf b$ | $\mathbf r_0 + u\mathbf a + v\mathbf b$ | all $u, v$ |

The sphere comes straight from spherical coordinates with $\rho = a$ fixed; the cylinder from
cylindrical coordinates with $r = a$ fixed.

## Tangent vectors and normals

Differentiating in each parameter gives two tangent vectors at each point:

$$\mathbf r_u = \left\langle\frac{\partial x}{\partial u}, \frac{\partial y}{\partial u}, \frac{\partial z}{\partial u}\right\rangle,\qquad \mathbf r_v = \left\langle\frac{\partial x}{\partial v}, \frac{\partial y}{\partial v}, \frac{\partial z}{\partial v}\right\rangle.$$

They are tangent to the two grid curves through the point, so both lie in the tangent plane,
and their cross product

$$\mathbf N = \mathbf r_u\times\mathbf r_v$$

is a **normal vector** to the surface. If $\mathbf N \ne \mathbf 0$ everywhere, the surface is
called **smooth** (no corners or cusps).

### Example 1: a tangent plane

Find the tangent plane to $\mathbf r(u, v) = \langle u + v,\; u^2,\; v^2\rangle$ at the point where $u = v = 1$.

1. The point is $\mathbf r(1, 1) = (2, 1, 1)$.
2. $\mathbf r_u = \langle 1, 2u, 0\rangle = \langle 1, 2, 0\rangle$ and $\mathbf r_v = \langle 1, 0, 2v\rangle = \langle 1, 0, 2\rangle$.
3. $\mathbf N = \mathbf r_u\times\mathbf r_v = \langle 2\cdot2 - 0\cdot0,\; 0\cdot1 - 1\cdot2,\; 1\cdot0 - 2\cdot1\rangle = \langle 4, -2, -2\rangle$.
4. Plane: $4(x - 2) - 2(y - 1) - 2(z - 1) = 0$, or $2x - y - z = 2$. Check: $4 - 1 - 1 = 2$. ✓

## Surface area

A small rectangle $\Delta u\times\Delta v$ in $D$ maps to a small patch of $S$ that is nearly a
parallelogram with sides $\mathbf r_u\,\Delta u$ and $\mathbf r_v\,\Delta v$. Its area is
$|\mathbf r_u\times\mathbf r_v|\,\Delta u\,\Delta v$ (Lesson 4: the cross product's length is
the parallelogram's area). Adding the patches:

$$A(S) = \iint_D|\mathbf r_u\times\mathbf r_v|\,dA.$$

The factor $|\mathbf r_u\times\mathbf r_v|$ is the surface version of the speed $|\mathbf r'(t)|$
in arc length, and of the Jacobian in a change of variables. Write
$dS = |\mathbf r_u\times\mathbf r_v|\,du\,dv$ for the **surface area element**.

For a graph $\mathbf r = \langle x, y, f(x, y)\rangle$: $\mathbf r_x = \langle 1, 0, f_x\rangle$,
$\mathbf r_y = \langle 0, 1, f_y\rangle$, and $\mathbf r_x\times\mathbf r_y = \langle -f_x, -f_y, 1\rangle$,
recovering the formula $\iint\sqrt{1 + f_x^2 + f_y^2}\,dA$ from Lesson 23.

### Example 2: the sphere

For the sphere of radius $a$ parametrized by $(\phi, \theta)$:

1. $\mathbf r_\phi = \langle a\cos\phi\cos\theta,\; a\cos\phi\sin\theta,\; -a\sin\phi\rangle$ and $\mathbf r_\theta = \langle -a\sin\phi\sin\theta,\; a\sin\phi\cos\theta,\; 0\rangle$.
2. A computation gives $\mathbf r_\phi\times\mathbf r_\theta = a^2\sin\phi\,\langle\sin\phi\cos\theta,\; \sin\phi\sin\theta,\; \cos\phi\rangle$, so $|\mathbf r_\phi\times\mathbf r_\theta| = a^2\sin\phi$ (for $0 \le \phi \le \pi$).
3. $A = \displaystyle\int_0^{2\pi}\int_0^\pi a^2\sin\phi\,d\phi\,d\theta = 2\pi a^2\cdot2 = 4\pi a^2.$

Notice the normal is $a\sin\phi$ times the position vector: on a sphere, normals point radially,
as they should.

### Example 3: a cone

Find the area of the cone $z = \sqrt{x^2 + y^2}$ for $0 \le z \le h$.

1. $\mathbf r(r, \theta) = \langle r\cos\theta, r\sin\theta, r\rangle$, $0 \le r \le h$, $0 \le \theta \le 2\pi$.
2. $\mathbf r_r = \langle\cos\theta, \sin\theta, 1\rangle$, $\mathbf r_\theta = \langle -r\sin\theta, r\cos\theta, 0\rangle$.
3. $\mathbf r_r\times\mathbf r_\theta = \langle -r\cos\theta,\; -r\sin\theta,\; r\rangle$, with length $r\sqrt2$.
4. $A = \displaystyle\int_0^{2\pi}\int_0^h r\sqrt2\,dr\,d\theta = \sqrt2\,\pi h^2.$

Check with geometry: the cone's slant height is $h\sqrt2$ and its base circumference $2\pi h$,
and the lateral area of a cone is $\tfrac12\cdot\text{circumference}\cdot\text{slant} = \sqrt2\pi h^2$. ✓

```plot
{"x": [-2.5, 2.5], "y": [-0.5, 2.5], "equal": true, "functions": [{"f": "abs(x)", "from": -2, "to": 2, "label": "z = r"}, {"f": "2", "from": -2, "to": 2, "dashed": true}], "segments": [{"from": [0, 0], "to": [2, 2], "label": "slant h√2"}], "xLabel": "r (and −r)", "yLabel": "z", "caption": "Side view of the cone z = √(x² + y²) cut at height h = 2"}
```

## Common mistakes

- Forgetting the absolute value (length) in $|\mathbf r_u\times\mathbf r_v|$.
- Mixing up the parameter ranges for the sphere ($\phi$ to $\pi$, $\theta$ to $2\pi$).
- Using a parametrization that covers part of the surface twice, which double-counts area.
- Treating $\mathbf r_u\times\mathbf r_v$ as a unit normal; divide by its length if a unit normal is needed.

## Key points

- $\mathbf r(u, v)$ describes a surface; $\mathbf r_u$, $\mathbf r_v$ are tangent vectors and $\mathbf r_u\times\mathbf r_v$ a normal.
- $A(S) = \iint_D|\mathbf r_u\times\mathbf r_v|\,dA$, and $dS = |\mathbf r_u\times\mathbf r_v|\,du\,dv$.
- Sphere: $|\mathbf r_\phi\times\mathbf r_\theta| = a^2\sin\phi$, area $4\pi a^2$; graph: $\sqrt{1 + f_x^2 + f_y^2}$.
