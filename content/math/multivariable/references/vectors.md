---
id: mv-ref-vectors
title: Vectors, lines, planes and surfaces
---
## Vectors

| Quantity | Formula |
|---|---|
| Distance | $\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$ |
| Sphere | $(x-h)^2 + (y-k)^2 + (z-l)^2 = r^2$ |
| Magnitude | $\lvert\mathbf v\rvert = \sqrt{v_1^2 + v_2^2 + v_3^2}$ |
| Unit vector | $\mathbf v/\lvert\mathbf v\rvert$ |
| Dot product | $\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3 = \lvert\mathbf a\rvert\lvert\mathbf b\rvert\cos\theta$ |
| Angle | $\cos\theta = \dfrac{\mathbf a\cdot\mathbf b}{\lvert\mathbf a\rvert\lvert\mathbf b\rvert}$ |
| Scalar projection | $\operatorname{comp}_{\mathbf a}\mathbf b = \dfrac{\mathbf a\cdot\mathbf b}{\lvert\mathbf a\rvert}$ |
| Vector projection | $\operatorname{proj}_{\mathbf a}\mathbf b = \dfrac{\mathbf a\cdot\mathbf b}{\lvert\mathbf a\rvert^2}\mathbf a$ |
| Cross product | $\langle a_2b_3 - a_3b_2,\; a_3b_1 - a_1b_3,\; a_1b_2 - a_2b_1\rangle$ |
| $\lvert\mathbf a\times\mathbf b\rvert$ | $\lvert\mathbf a\rvert\lvert\mathbf b\rvert\sin\theta$ = parallelogram area |
| Triangle area | $\tfrac12\lvert\overrightarrow{PQ}\times\overrightarrow{PR}\rvert$ |
| Triple product | $\mathbf a\cdot(\mathbf b\times\mathbf c) = \det[\mathbf a; \mathbf b; \mathbf c]$; volume $= \lvert\cdot\rvert$ |
| Work (constant force) | $W = \mathbf F\cdot\mathbf D$ |
| Torque | $\boldsymbol\tau = \mathbf r\times\mathbf F$ |

Tests: orthogonal ⇔ $\mathbf a\cdot\mathbf b = 0$; parallel ⇔ $\mathbf a\times\mathbf b = \mathbf 0$; coplanar ⇔ triple product $= 0$.

## Lines and planes

| Object | Equation |
|---|---|
| Line | $\mathbf r = \mathbf r_0 + t\mathbf v$; $x = x_0 + at$, $y = y_0 + bt$, $z = z_0 + ct$ |
| Symmetric form | $\dfrac{x-x_0}{a} = \dfrac{y-y_0}{b} = \dfrac{z-z_0}{c}$ |
| Segment $\mathbf r_0 \to \mathbf r_1$ | $(1-t)\mathbf r_0 + t\mathbf r_1$, $0 \le t \le 1$ |
| Plane | $a(x-x_0) + b(y-y_0) + c(z-z_0) = 0$, normal $\langle a,b,c\rangle$ |
| Plane through $P, Q, R$ | normal $\overrightarrow{PQ}\times\overrightarrow{PR}$ |
| Line of two planes | direction $\mathbf n_1\times\mathbf n_2$ |
| Point to plane $ax + by + cz = d$ | $D = \dfrac{\lvert ax_1 + by_1 + cz_1 - d\rvert}{\sqrt{a^2+b^2+c^2}}$ |

## Quadric surfaces

| Surface | Equation | Traces |
|---|---|---|
| Ellipsoid | $\frac{x^2}{a^2} + \frac{y^2}{b^2} + \frac{z^2}{c^2} = 1$ | ellipses |
| Elliptic paraboloid | $\frac zc = \frac{x^2}{a^2} + \frac{y^2}{b^2}$ | ellipses, parabolas |
| Hyperbolic paraboloid | $\frac zc = \frac{x^2}{a^2} - \frac{y^2}{b^2}$ | hyperbolas, parabolas |
| Cone | $\frac{z^2}{c^2} = \frac{x^2}{a^2} + \frac{y^2}{b^2}$ | ellipses, hyperbolas (line pairs through the axis) |
| Hyperboloid, one sheet | $\frac{x^2}{a^2} + \frac{y^2}{b^2} - \frac{z^2}{c^2} = 1$ | ellipses, hyperbolas |
| Hyperboloid, two sheets | $-\frac{x^2}{a^2} - \frac{y^2}{b^2} + \frac{z^2}{c^2} = 1$ | ellipses ($\lvert z\rvert > c$), hyperbolas |

A missing variable means a cylinder parallel to that axis.
