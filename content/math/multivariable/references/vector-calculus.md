---
id: mv-ref-vector-calculus
title: Vector calculus and the big theorems
---
## Operators

| Operator | Formula | Type |
|---|---|---|
| Gradient | $\nabla f = \langle f_x, f_y, f_z\rangle$ | vector |
| Divergence | $\nabla\cdot\mathbf F = P_x + Q_y + R_z$ | scalar |
| Curl | $\nabla\times\mathbf F = \langle R_y - Q_z,\; P_z - R_x,\; Q_x - P_y\rangle$ | vector |
| Laplacian | $\nabla^2 f = f_{xx} + f_{yy} + f_{zz}$ | scalar |

Identities: $\nabla\times(\nabla f) = \mathbf 0$, $\nabla\cdot(\nabla\times\mathbf F) = 0$.

## Line and surface integrals

| Integral | Computation |
|---|---|
| $\int_C f\,ds$ | $\int_a^b f(\mathbf r(t))\lvert\mathbf r'(t)\rvert\,dt$ |
| $\int_C\mathbf F\cdot d\mathbf r$ | $\int_a^b\mathbf F(\mathbf r(t))\cdot\mathbf r'(t)\,dt = \int_C P\,dx + Q\,dy + R\,dz$ |
| Surface area | $\iint_D\lvert\mathbf r_u\times\mathbf r_v\rvert\,dA$ |
| $\iint_S f\,dS$ | $\iint_D f(\mathbf r(u,v))\lvert\mathbf r_u\times\mathbf r_v\rvert\,dA$ |
| Flux $\iint_S\mathbf F\cdot d\mathbf S$ | $\iint_D\mathbf F(\mathbf r(u,v))\cdot(\mathbf r_u\times\mathbf r_v)\,dA$ |
| Flux, graph $z = g$ upward | $\iint_D(-Pg_x - Qg_y + R)\,dA$ |

Standard parametrizations: sphere $\langle a\sin\phi\cos\theta, a\sin\phi\sin\theta, a\cos\phi\rangle$ with
$\lvert\mathbf r_\phi\times\mathbf r_\theta\rvert = a^2\sin\phi$; cylinder $\langle a\cos\theta, a\sin\theta, z\rangle$
with factor $a$; cone $\langle r\cos\theta, r\sin\theta, r\rangle$ with factor $r\sqrt2$.

## Conservative fields

On an open, simply connected region the following are equivalent:
$\mathbf F = \nabla f$; $\int_C\mathbf F\cdot d\mathbf r$ is path independent; $\oint_C\mathbf F\cdot d\mathbf r = 0$
for every closed $C$; $P_y = Q_x$ (2D) or $\nabla\times\mathbf F = \mathbf 0$ (3D).

Find $f$: integrate $P$ in $x$, add $g(y, z)$, match the other components.

## The fundamental theorems

| Theorem | Statement |
|---|---|
| FTC | $\int_a^b F'(x)\,dx = F(b) - F(a)$ |
| Line integrals | $\int_C\nabla f\cdot d\mathbf r = f(\mathbf r(b)) - f(\mathbf r(a))$ |
| Green (circulation) | $\oint_C P\,dx + Q\,dy = \iint_D(Q_x - P_y)\,dA$ |
| Green (flux) | $\oint_C\mathbf F\cdot\mathbf n\,ds = \iint_D(P_x + Q_y)\,dA$ |
| Stokes | $\oint_C\mathbf F\cdot d\mathbf r = \iint_S(\nabla\times\mathbf F)\cdot d\mathbf S$ |
| Divergence (Gauss) | $\iint_S\mathbf F\cdot d\mathbf S = \iiint_E\nabla\cdot\mathbf F\,dV$ |

Orientation: Green, counterclockwise; Stokes, right-hand rule (thumb along $\mathbf n$);
Divergence, outward normal on a closed surface. Area: $A = \tfrac12\oint_C x\,dy - y\,dx$.

## Physics

| Law | Integral form | Differential form |
|---|---|---|
| Gauss | $\iint_S\mathbf E\cdot d\mathbf S = Q/\varepsilon_0$ | $\nabla\cdot\mathbf E = \rho/\varepsilon_0$ |
| No monopoles | $\iint_S\mathbf B\cdot d\mathbf S = 0$ | $\nabla\cdot\mathbf B = 0$ |
| Faraday | $\oint\mathbf E\cdot d\mathbf r = -\frac{d}{dt}\iint\mathbf B\cdot d\mathbf S$ | $\nabla\times\mathbf E = -\partial_t\mathbf B$ |
| Ampère (steady) | $\oint\mathbf B\cdot d\mathbf r = \mu_0I$ | $\nabla\times\mathbf B = \mu_0\mathbf J$ |
| Continuity | $\frac{d}{dt}\iiint\rho\,dV = -\iint\rho\mathbf v\cdot d\mathbf S$ | $\partial_t\rho + \nabla\cdot(\rho\mathbf v) = 0$ |
| Heat | $\mathbf q = -k\nabla T$ | $T_t = \alpha\nabla^2T$ |
