---
id: mv-ref-integrals
title: Multiple integrals and coordinate systems
---
## Setting up

| Region | Integral |
|---|---|
| Rectangle | $\int_a^b\int_c^d f\,dy\,dx$ (either order, Fubini) |
| Type I | $\int_a^b\int_{g_1(x)}^{g_2(x)}f\,dy\,dx$ |
| Type II | $\int_c^d\int_{h_1(y)}^{h_2(y)}f\,dx\,dy$ |
| Type 1 solid | $\iint_D\int_{u_1(x,y)}^{u_2(x,y)}f\,dz\,dA$ |

Outer limits are constants; inner limits depend only on outer variables. To reverse the
order, sketch the region and slice the other way.

## Coordinate systems

| System | Conversion | Element |
|---|---|---|
| Polar | $x = r\cos\theta$, $y = r\sin\theta$ | $dA = r\,dr\,d\theta$ |
| Cylindrical | $x = r\cos\theta$, $y = r\sin\theta$, $z = z$ | $dV = r\,dz\,dr\,d\theta$ |
| Spherical | $x = \rho\sin\phi\cos\theta$, $y = \rho\sin\phi\sin\theta$, $z = \rho\cos\phi$ | $dV = \rho^2\sin\phi\,d\rho\,d\theta\,d\phi$ |
| General | $x = x(u,v)$, $y = y(u,v)$ | $dA = \left\lvert\frac{\partial(x,y)}{\partial(u,v)}\right\rvert du\,dv$ |

Ranges: $0 \le \theta \le 2\pi$, $0 \le \phi \le \pi$. Surfaces: $r = c$ cylinder, $z = r$ cone,
$\rho = c$ sphere, $\phi = c$ cone.

Jacobian: $\dfrac{\partial(x,y)}{\partial(u,v)} = x_uy_v - x_vy_u = 1\Big/\dfrac{\partial(u,v)}{\partial(x,y)}$.

## Applications

| Quantity | Lamina ($dA$) | Solid ($dV$) |
|---|---|---|
| Area / volume | $\iint_D 1\,dA$ | $\iiint_E 1\,dV$ |
| Mass | $\iint_D\rho\,dA$ | $\iiint_E\rho\,dV$ |
| Moments | $M_y = \iint x\rho$, $M_x = \iint y\rho$ | $M_{yz} = \iiint x\rho$, $M_{xz} = \iiint y\rho$, $M_{xy} = \iiint z\rho$ |
| Center of mass | $\bar x = M_y/m$, $\bar y = M_x/m$ | $\bar x = M_{yz}/m$, $\bar y = M_{xz}/m$, $\bar z = M_{xy}/m$ |
| Average value | $\frac{1}{A}\iint f\,dA$ | $\frac1V\iiint f\,dV$ |
| Moment of inertia | $I_0 = \iint(x^2+y^2)\rho\,dA$ | $I_z = \iiint(x^2+y^2)\rho\,dV$ |
| Surface area of $z = f(x,y)$ | $\iint_D\sqrt{1 + f_x^2 + f_y^2}\,dA$ | |
| Probability (joint density $f$) | $P\big((X,Y)\in D\big) = \iint_D f\,dA$, $E(X) = \iint x f\,dA$ | |

## Useful values

| Integral | Value |
|---|---|
| $\int_0^{2\pi}\sin^2\theta\,d\theta = \int_0^{2\pi}\cos^2\theta\,d\theta$ | $\pi$ |
| $\int_0^\pi\sin\phi\,d\phi$ | $2$ |
| $\int_{-\infty}^\infty e^{-x^2}\,dx$ | $\sqrt\pi$ |
| Ball, radius $a$ | $V = \tfrac43\pi a^3$, surface $4\pi a^2$ |
| Tetrahedron $\frac xa + \frac yb + \frac zc \le 1$ | $V = abc/6$ |
| Half-disk centroid | $\bar y = 4a/(3\pi)$ |
| Solid hemisphere centroid | $\bar z = 3a/8$ |
