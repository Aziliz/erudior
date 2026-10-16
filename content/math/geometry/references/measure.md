---
id: geo-ref-measure
title: Perimeter, area, surface area and volume
---
## Plane figures

| Figure | Perimeter / circumference | Area |
|---|---|---|
| Rectangle $b \times h$ | $2b + 2h$ | $bh$ |
| Square, side $s$ | $4s$ | $s^2$ |
| Parallelogram | sum of sides | $bh$ ($h$ perpendicular) |
| Triangle | $a + b + c$ | $\tfrac12 bh = \tfrac12 ab\sin C$ |
| Triangle (Heron) | $s = \tfrac{a+b+c}{2}$ | $\sqrt{s(s-a)(s-b)(s-c)}$ |
| Equilateral triangle, side $s$ | $3s$ | $\tfrac{\sqrt3}{4}s^2$ |
| Trapezoid | sum of sides | $\tfrac12(b_1 + b_2)h$ |
| Rhombus or kite | sum of sides | $\tfrac12 d_1 d_2$ |
| Regular $n$-gon (side $s$, apothem $a$) | $P = ns$ | $\tfrac12 aP$, with $a = \dfrac{s/2}{\tan(180^\circ/n)}$ |
| Circle, radius $r$ | $C = 2\pi r = \pi d$ | $\pi r^2$ |
| Sector, angle $\theta$ | arc $= \tfrac{\theta}{360^\circ} \cdot 2\pi r$ | $\tfrac{\theta}{360^\circ}\pi r^2$ |
| Segment of a circle | — | sector $-$ triangle |
| Annulus (radii $R > r$) | — | $\pi R^2 - \pi r^2$ |

With $\theta$ in radians: arc length $s = r\theta$ and sector area $\tfrac12 r^2\theta$.

## Solids

$B$ = base area, $P$ = base perimeter, $h$ = perpendicular height, $\ell$ = slant height.

| Solid | Lateral area | Surface area | Volume |
|---|---|---|---|
| Prism | $Ph$ | $Ph + 2B$ | $Bh$ |
| Box $l \times w \times h$ | — | $2(lw + lh + wh)$ | $lwh$ |
| Cylinder | $2\pi rh$ | $2\pi rh + 2\pi r^2$ | $\pi r^2 h$ |
| Pyramid (regular) | $\tfrac12 P\ell$ | $\tfrac12 P\ell + B$ | $\tfrac13 Bh$ |
| Cone | $\pi r\ell$ | $\pi r\ell + \pi r^2$ | $\tfrac13 \pi r^2 h$ |
| Sphere | — | $4\pi r^2$ | $\tfrac43 \pi r^3$ |

- Cone slant height: $\ell = \sqrt{r^2 + h^2}$. Square pyramid with base edge $s$: $\ell = \sqrt{(s/2)^2 + h^2}$.
- Box space diagonal: $\sqrt{l^2 + w^2 + h^2}$.
- Cavalieri: oblique prisms and cylinders use the same formulas with perpendicular height.
- Euler's formula (convex polyhedra): $V - E + F = 2$.

## Similar figures (scale factor $k$)

| Lengths | Areas | Volumes |
|---|---|---|
| $\times k$ | $\times k^2$ | $\times k^3$ |

## Units

$1 \text{ ft}^2 = 144 \text{ in}^2$, $1 \text{ yd}^2 = 9 \text{ ft}^2$, $1 \text{ m}^2 = 10{,}000 \text{ cm}^2$, $1 \text{ m}^3 = 1{,}000{,}000 \text{ cm}^3$, $1 \text{ L} = 1000 \text{ cm}^3$.

## Geometric probability

$P = \dfrac{\text{favorable length, area or volume}}{\text{total length, area or volume}}$
