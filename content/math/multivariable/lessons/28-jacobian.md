---
id: mv-jacobian
module: mv-m6
title: Change of variables and Jacobians
minutes: 40
topics: [Jacobians, Change of variables]
drills: [mv-d-jacobian, mv-d-cov-linear]
refs: [mv-ref-integrals]
---
## Substitution for multiple integrals

In one variable, substitution $x = g(u)$ turns $\int f(x)\,dx$ into
$\int f(g(u))\,g'(u)\,du$: the factor $g'(u)$ records how much the substitution stretches
lengths. Polar, cylindrical and spherical coordinates were special substitutions in two and
three variables, and each came with its own stretch factor ($r$, $r$, $\rho^2\sin\phi$).
This lesson gives the general rule. The stretch factor for any substitution is the absolute
value of a determinant called the Jacobian, and with it you can design your own
coordinates to fit an awkward region or integrand.

## Transformations

A **transformation** $T$ from the $uv$-plane to the $xy$-plane is given by
$x = g(u, v)$, $y = h(u, v)$. It sends a region $S$ in the $uv$-plane to a region $R = T(S)$
in the $xy$-plane. For example, polar coordinates are the transformation
$x = r\cos\theta$, $y = r\sin\theta$ that sends the rectangle $[0, 1]\times[0, 2\pi]$ in the
$r\theta$-plane onto the unit disk.

## How areas stretch

Take a tiny rectangle in the $uv$-plane with corner $(u_0, v_0)$ and sides $\Delta u$,
$\Delta v$. Its image is nearly a parallelogram. Moving $\Delta u$ in $u$ moves the image point
by about $\mathbf r_u\,\Delta u$, where $\mathbf r_u = \langle x_u, y_u\rangle$; moving $\Delta v$
moves it by $\mathbf r_v\,\Delta v$ with $\mathbf r_v = \langle x_v, y_v\rangle$. The area of the
parallelogram spanned by those two vectors is the absolute value of a $2\times2$ determinant:

$$\Delta A \approx \left|\det\begin{bmatrix} x_u & x_v\\ y_u & y_v\end{bmatrix}\right|\Delta u\,\Delta v.$$

The **Jacobian** of $T$ is that determinant:

$$\frac{\partial(x, y)}{\partial(u, v)} = \begin{vmatrix}\dfrac{\partial x}{\partial u} & \dfrac{\partial x}{\partial v}\\[2mm] \dfrac{\partial y}{\partial u} & \dfrac{\partial y}{\partial v}\end{vmatrix} = x_uy_v - x_vy_u.$$

**Check with polar coordinates:** $x_r = \cos\theta$, $x_\theta = -r\sin\theta$,
$y_r = \sin\theta$, $y_\theta = r\cos\theta$, so the Jacobian is
$r\cos^2\theta + r\sin^2\theta = r$. That is exactly the $r$ in $dA = r\,dr\,d\theta$.

## The change of variables formula

If $T$ is one-to-one (except perhaps on the boundary) with continuous partial derivatives
and a nonzero Jacobian, mapping $S$ onto $R$, then

$$\iint_R f(x, y)\,dA = \iint_S f\big(x(u, v),\, y(u, v)\big)\left|\frac{\partial(x, y)}{\partial(u, v)}\right|du\,dv.$$

Note the **absolute value**: areas are positive even if the transformation flips
orientation.

### Example 1: a tilted square

Evaluate $\iint_R (x + y)(x - y)\,dA$, where $R$ is the square bounded by the lines
$x + y = 0$, $x + y = 2$, $x - y = 0$ and $x - y = 4$.

```plot
{"x": [-1, 4], "y": [-2.5, 1.5], "equal": true, "polygons": [{"points": [[0, 0], [1, 1], [3, -1], [2, -2]], "fill": true}], "functions": [{"f": "-x", "dashed": true, "label": "x + y = 0"}, {"f": "2-x", "dashed": true, "label": "x + y = 2"}, {"f": "x", "dashed": true, "label": "x − y = 0"}, {"f": "x-4", "dashed": true, "label": "x − y = 4"}], "caption": "R becomes the rectangle 0 ≤ u ≤ 2, 0 ≤ v ≤ 4 under u = x + y, v = x − y"}
```

1. The boundaries suggest $u = x + y$, $v = x - y$. Then $S$ is the rectangle $0 \le u \le 2$, $0 \le v \le 4$.
2. Solve for $x, y$: $x = \tfrac{u + v}{2}$, $y = \tfrac{u - v}{2}$.
3. Jacobian: $\begin{vmatrix}\tfrac12 & \tfrac12\\ \tfrac12 & -\tfrac12\end{vmatrix} = -\tfrac14 - \tfrac14 = -\tfrac12$, so $|J| = \tfrac12$.
4. $\displaystyle\iint_R(x + y)(x - y)\,dA = \int_0^2\int_0^4 uv\cdot\frac12\,dv\,du = \frac12\cdot2\cdot8 = 8.$

**Shortcut.** It is often easier to compute $\dfrac{\partial(u, v)}{\partial(x, y)}$ from the
formulas for $u, v$ and take the reciprocal, since
$\dfrac{\partial(x, y)}{\partial(u, v)} = 1\Big/\dfrac{\partial(u, v)}{\partial(x, y)}$.
Here $\begin{vmatrix} 1 & 1\\ 1 & -1\end{vmatrix} = -2$, whose reciprocal is $-\tfrac12$. ✓

### Example 2: the area of an ellipse

The ellipse $\dfrac{x^2}{a^2} + \dfrac{y^2}{b^2} \le 1$ is the image of the unit disk
$u^2 + v^2 \le 1$ under $x = au$, $y = bv$. The Jacobian is
$\begin{vmatrix} a & 0\\ 0 & b\end{vmatrix} = ab$, so

$$\text{Area} = \iint_{u^2+v^2\le1} ab\,du\,dv = ab\cdot\pi.$$

The transformation stretches every area by the same factor $ab$, turning a disk of area $\pi$
into an ellipse of area $\pi ab$.

### Example 3: a curved region

Find the area of the region in the first quadrant bounded by $xy = 1$, $xy = 4$, $y = x$
and $y = 3x$.

1. Let $u = xy$ (from 1 to 4) and $v = \tfrac yx$ (from 1 to 3).
2. $\dfrac{\partial(u, v)}{\partial(x, y)} = \begin{vmatrix} y & x\\ -\tfrac{y}{x^2} & \tfrac1x\end{vmatrix} = \tfrac yx + \tfrac yx = \tfrac{2y}{x} = 2v$. So $\left|\dfrac{\partial(x, y)}{\partial(u, v)}\right| = \dfrac{1}{2v}$.
3. Area $= \displaystyle\int_1^4\int_1^3\frac{1}{2v}\,dv\,du = 3\cdot\frac{\ln3}{2} = \frac{3\ln3}{2} \approx 1.648.$

## Three variables

For $x = g(u, v, w)$, $y = h(u, v, w)$, $z = k(u, v, w)$ the Jacobian is a $3\times3$
determinant,

$$\frac{\partial(x, y, z)}{\partial(u, v, w)} = \begin{vmatrix} x_u & x_v & x_w\\ y_u & y_v & y_w\\ z_u & z_v & z_w\end{vmatrix},$$

and $dV = \left|\dfrac{\partial(x,y,z)}{\partial(u,v,w)}\right|du\,dv\,dw$. Computing it for
spherical coordinates gives $-\rho^2\sin\phi$ in the order $(\rho, \theta, \phi)$ (the sign
depends on the order of the variables); its absolute value $\rho^2\sin\phi$ is the factor
from Lesson 27. The geometric meaning is the one from Lesson 4: the absolute value of a
$3\times3$ determinant is the volume of a parallelepiped.

## Common mistakes

- Forgetting the absolute value of the Jacobian.
- Using $\dfrac{\partial(u,v)}{\partial(x,y)}$ where $\dfrac{\partial(x,y)}{\partial(u,v)}$ is needed (they are reciprocals).
- Transforming the integrand but not the region, or vice versa.
- Choosing $u, v$ that do not map the region one-to-one.

## Key points

- $\dfrac{\partial(x,y)}{\partial(u,v)} = x_uy_v - x_vy_u$; $dA = \left|\dfrac{\partial(x,y)}{\partial(u,v)}\right|du\,dv$.
- Polar: $J = r$; spherical: $|J| = \rho^2\sin\phi$.
- Choose $u, v$ from the boundary curves so the new region is a rectangle.
- $\dfrac{\partial(x,y)}{\partial(u,v)}$ is the reciprocal of $\dfrac{\partial(u,v)}{\partial(x,y)}$.
