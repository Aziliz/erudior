---
id: pc-ref-conics-polar
title: Conics, parametric, polar and vectors
---
## Conic sections (center or vertex at $(h, k)$)

| Conic | Standard form | Key facts |
|---|---|---|
| Parabola (up/down) | $(x - h)^2 = 4p(y - k)$ | focus $(h, k + p)$, directrix $y = k - p$ |
| Parabola (right/left) | $(y - k)^2 = 4p(x - h)$ | focus $(h + p, k)$, directrix $x = h - p$ |
| Circle | $(x - h)^2 + (y - k)^2 = r^2$ | $e = 0$ |
| Ellipse (horizontal) | $\dfrac{(x - h)^2}{a^2} + \dfrac{(y - k)^2}{b^2} = 1$, $a > b$ | $c^2 = a^2 - b^2$; vertices $(h \pm a, k)$; foci $(h \pm c, k)$ |
| Ellipse (vertical) | $\dfrac{(x - h)^2}{b^2} + \dfrac{(y - k)^2}{a^2} = 1$ | vertices $(h, k \pm a)$; foci $(h, k \pm c)$ |
| Hyperbola (left/right) | $\dfrac{(x - h)^2}{a^2} - \dfrac{(y - k)^2}{b^2} = 1$ | $c^2 = a^2 + b^2$; asymptotes $y - k = \pm\frac ba(x - h)$ |
| Hyperbola (up/down) | $\dfrac{(y - k)^2}{a^2} - \dfrac{(x - h)^2}{b^2} = 1$ | asymptotes $y - k = \pm\frac ab(x - h)$ |

| Eccentricity $e = \frac ca$ | Conic |
|---|---|
| $e = 0$ | circle |
| $0 < e < 1$ | ellipse |
| $e = 1$ | parabola |
| $e > 1$ | hyperbola |

General form $Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0$: $B^2 - 4AC < 0$ ellipse, $= 0$ parabola, $> 0$ hyperbola. Rotation angle: $\cot 2\theta = \dfrac{A - C}{B}$.

## Parametric equations

| Curve | Parametrization |
|---|---|
| Segment $(x_1, y_1) \to (x_2, y_2)$ | $x = x_1 + (x_2 - x_1)t$, $y = y_1 + (y_2 - y_1)t$, $0 \le t \le 1$ |
| Circle / ellipse | $x = h + a\cos t$, $y = k + b\sin t$ |
| Projectile (m, s) | $x = v_x t$, $y = h_0 + v_y t - 4.9t^2$ |

## Polar coordinates

| Conversion | Formula |
|---|---|
| Polar to rectangular | $x = r\cos\theta$, $y = r\sin\theta$ |
| Rectangular to polar | $r^2 = x^2 + y^2$, $\tan\theta = \frac yx$ (check quadrant) |
| Same point | $(r, \theta) = (r, \theta + 2\pi) = (-r, \theta + \pi)$ |

| Polar graph | Shape |
|---|---|
| $r = a$ | circle about the pole |
| $r = 2a\cos\theta$ | circle through the pole |
| $r = a + b\cos\theta$ | limaçon (cardioid if $\lvert a\rvert = \lvert b\rvert$) |
| $r = a\cos n\theta$, integer $n \ge 2$ | rose: $n$ petals ($n$ odd), $2n$ petals ($n$ even) |
| $r = \dfrac{ed}{1 \pm e\cos\theta}$, $\dfrac{ed}{1 \pm e\sin\theta}$ | conic with focus at the pole |

| Complex numbers | Rule |
|---|---|
| Polar form | $z = r(\cos\theta + i\sin\theta)$, $r = \lvert z\rvert$ |
| Product | multiply moduli, add arguments |
| De Moivre | $z^n = r^n(\cos n\theta + i\sin n\theta)$ |

## Vectors

| Idea | Formula |
|---|---|
| Component form | $\vec{PQ} = \langle x_2 - x_1, y_2 - y_1 \rangle$ |
| Magnitude | $\lVert\langle a, b\rangle\rVert = \sqrt{a^2 + b^2}$; in 3D $\sqrt{a^2 + b^2 + c^2}$ |
| From magnitude and angle | $\vec v = \langle \lVert\vec v\rVert\cos\theta, \lVert\vec v\rVert\sin\theta \rangle$ |
| Unit vector | $\dfrac{\vec v}{\lVert\vec v\rVert}$ |
| Dot product | $\vec u \cdot \vec v = u_1v_1 + u_2v_2 (+ u_3v_3) = \lVert\vec u\rVert\lVert\vec v\rVert\cos\theta$ |
| Angle | $\cos\theta = \dfrac{\vec u \cdot \vec v}{\lVert\vec u\rVert\lVert\vec v\rVert}$ |
| Orthogonal | $\vec u \cdot \vec v = 0$ |
| Projection | $\text{proj}_{\vec v}\vec u = \dfrac{\vec u \cdot \vec v}{\lVert\vec v\rVert^2}\vec v$ |
| Work | $W = \vec F \cdot \vec d$ |
| Distance in 3D | $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$ |
| Cross product | $\vec u \times \vec v = \langle u_2v_3 - u_3v_2,\ u_3v_1 - u_1v_3,\ u_1v_2 - u_2v_1\rangle$ |
