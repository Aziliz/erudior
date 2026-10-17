---
id: trig-ref-triangles
title: Triangles, vectors, polar, parametric and complex
---
## Right triangles

| Fact | Formula |
|---|---|
| SOH-CAH-TOA | $\sin\theta = \tfrac{\text{opp}}{\text{hyp}}$, $\cos\theta = \tfrac{\text{adj}}{\text{hyp}}$, $\tan\theta = \tfrac{\text{opp}}{\text{adj}}$ |
| Pythagorean theorem | $a^2 + b^2 = c^2$ |
| Acute angles | $A + B = 90^\circ$ |
| Bearing $\theta$ (clockwise from north), distance $d$ | north $= d\cos\theta$, east $= d\sin\theta$ |

## Oblique triangles

| Case | Method |
|---|---|
| AAS, ASA | third angle, then law of sines |
| SSA | law of sines; 0, 1 or 2 triangles |
| SAS | law of cosines for the third side |
| SSS | law of cosines for the largest angle |

| Law | Formula |
|---|---|
| Law of sines | $\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C}$ |
| Law of cosines | $c^2 = a^2 + b^2 - 2ab\cos C$ |
| Angle from sides | $\cos C = \dfrac{a^2 + b^2 - c^2}{2ab}$ |
| SSA height | $h = b\sin A$: acute $A$ gives 0 ($a < h$), 1 ($a = h$ or $a \ge b$), 2 ($h < a < b$) |

## Area

| Known | Area |
|---|---|
| SAS | $\tfrac12 ab\sin C$ |
| SSS (Heron) | $\sqrt{s(s-a)(s-b)(s-c)}$, $s = \tfrac{a + b + c}{2}$ |
| AAS / ASA | $\dfrac{a^2\sin B\sin C}{2\sin A}$ |

## Vectors in the plane

| Fact | Formula |
|---|---|
| Component form | $\mathbf{v} = \langle a, b\rangle = a\mathbf{i} + b\mathbf{j}$ |
| From $P(x_1, y_1)$ to $Q(x_2, y_2)$ | $\langle x_2 - x_1, y_2 - y_1\rangle$ |
| Magnitude | $\lVert\mathbf{v}\rVert = \sqrt{a^2 + b^2}$ |
| From magnitude and direction | $\mathbf{v} = \langle \lVert\mathbf{v}\rVert\cos\theta, \lVert\mathbf{v}\rVert\sin\theta\rangle$ |
| Direction angle | $\tan\theta = \tfrac{b}{a}$, quadrant from the signs of $a$, $b$ |
| Unit vector | $\dfrac{\mathbf{v}}{\lVert\mathbf{v}\rVert}$ |
| Dot product | $\mathbf{u}\cdot\mathbf{v} = u_1v_1 + u_2v_2 = \lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert\cos\theta$ |
| Angle between | $\cos\theta = \dfrac{\mathbf{u}\cdot\mathbf{v}}{\lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert}$ |
| Orthogonal | $\mathbf{u}\cdot\mathbf{v} = 0$ |
| Projection of $\mathbf{u}$ onto $\mathbf{v}$ | $\text{proj}_{\mathbf{v}}\mathbf{u} = \dfrac{\mathbf{u}\cdot\mathbf{v}}{\lVert\mathbf{v}\rVert^2}\mathbf{v}$ |
| Work | $W = \mathbf{F}\cdot\overrightarrow{PQ} = \lVert\mathbf{F}\rVert\lVert\overrightarrow{PQ}\rVert\cos\theta$ |

## Polar coordinates

| Fact | Formula |
|---|---|
| Polar to rectangular | $x = r\cos\theta$, $y = r\sin\theta$ |
| Rectangular to polar | $r^2 = x^2 + y^2$, $\tan\theta = \tfrac{y}{x}$ (check the quadrant) |
| Same point | $(r, \theta) = (r, \theta + 2k\pi) = (-r, \theta + \pi)$ |
| Circles | $r = a$; $r = 2a\cos\theta$; $r = 2a\sin\theta$ |
| Rose $r = a\cos n\theta$ or $a\sin n\theta$ | $n$ petals if $n$ odd, $2n$ if $n$ even |
| Limaçon $r = a \pm b\cos\theta$ | inner loop if $a < b$; cardioid if $a = b$ |
| Lemniscate | $r^2 = a^2\cos 2\theta$ |

## Parametric equations

| Fact | Formula |
|---|---|
| Eliminate $t$ | solve for $t$ and substitute, or use $\cos^2 t + \sin^2 t = 1$; keep restrictions |
| Segment $P \to Q$ | $x = x_1 + (x_2 - x_1)t$, $y = y_1 + (y_2 - y_1)t$, $0 \le t \le 1$ |
| Circle, center $(h, k)$, radius $r$ | $x = h + r\cos t$, $y = k + r\sin t$ (counterclockwise) |
| Ellipse | $x = h + a\cos t$, $y = k + b\sin t$ |
| Projectile | $x = (v_0\cos\theta)t$, $y = h + (v_0\sin\theta)t - \tfrac12 gt^2$ |
| Projectile, level ground | flight time $\tfrac{2v_0\sin\theta}{g}$, range $\tfrac{v_0^2\sin 2\theta}{g}$, top at $t = \tfrac{v_0\sin\theta}{g}$ |

## Complex numbers

| Fact | Formula |
|---|---|
| Modulus | $\lvert z\rvert = \sqrt{a^2 + b^2}$ for $z = a + bi$ |
| Trigonometric form | $z = r(\cos\theta + i\sin\theta) = r\operatorname{cis}\theta$ |
| Product | $r_1r_2\operatorname{cis}(\theta_1 + \theta_2)$ |
| Quotient | $\tfrac{r_1}{r_2}\operatorname{cis}(\theta_1 - \theta_2)$ |
| De Moivre | $z^n = r^n\operatorname{cis}(n\theta)$ |
| $n$th roots | $\sqrt[n]{r}\operatorname{cis}\dfrac{\theta + 2k\pi}{n}$, $k = 0, 1, \ldots, n - 1$ |
