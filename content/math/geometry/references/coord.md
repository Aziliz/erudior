---
id: geo-ref-coord
title: Coordinates, trigonometry and transformations
---
## Coordinate formulas

| Quantity | Formula |
|---|---|
| Distance | $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ |
| Midpoint | $\left(\tfrac{x_1 + x_2}{2}, \tfrac{y_1 + y_2}{2}\right)$ |
| Point dividing $\overline{AB}$ as $m : n$ | $\left(x_1 + \tfrac{m}{m+n}(x_2 - x_1),\; y_1 + \tfrac{m}{m+n}(y_2 - y_1)\right)$ |
| Slope | $m = \tfrac{y_2 - y_1}{x_2 - x_1}$ |
| Parallel / perpendicular | $m_1 = m_2$ / $m_1 m_2 = -1$ |
| Point-slope form | $y - y_1 = m(x - x_1)$ |
| Slope of $Ax + By = C$ | $-\tfrac{A}{B}$ |
| Point to line $Ax + By + C = 0$ | $\tfrac{\lvert Ax_0 + By_0 + C\rvert}{\sqrt{A^2 + B^2}}$ |
| Centroid | $\left(\tfrac{x_1 + x_2 + x_3}{3}, \tfrac{y_1 + y_2 + y_3}{3}\right)$ |
| Circle | $(x - h)^2 + (y - k)^2 = r^2$ |
| Parabola, vertex $(h, k)$, opens up/down | $(x - h)^2 = 4p(y - k)$; focus $(h, k + p)$, directrix $y = k - p$ |
| Parabola, vertex $(h, k)$, opens right/left | $(y - k)^2 = 4p(x - h)$; focus $(h + p, k)$, directrix $x = h - p$ |
| $y = a(x - h)^2 + k$ | $p = \tfrac{1}{4a}$ |

## Right-triangle trigonometry

| Ratio | Definition |
|---|---|
| $\sin\theta$ | opposite / hypotenuse |
| $\cos\theta$ | adjacent / hypotenuse |
| $\tan\theta$ | opposite / adjacent |

| $\theta$ | $\sin$ | $\cos$ | $\tan$ |
|---|---|---|---|
| $30^\circ$ | $\tfrac12$ | $\tfrac{\sqrt3}{2}$ | $\tfrac{\sqrt3}{3}$ |
| $45^\circ$ | $\tfrac{\sqrt2}{2}$ | $\tfrac{\sqrt2}{2}$ | $1$ |
| $60^\circ$ | $\tfrac{\sqrt3}{2}$ | $\tfrac12$ | $\sqrt3$ |

- $\sin\theta = \cos(90^\circ - \theta)$.
- Angle from sides: $\theta = \tan^{-1}\left(\tfrac{\text{opp}}{\text{adj}}\right)$ (calculator in degree mode).
- Radians: $180^\circ = \pi$; multiply degrees by $\tfrac{\pi}{180}$.
- Obtuse angles: $\sin\theta = \sin(180^\circ - \theta)$, $\cos\theta = -\cos(180^\circ - \theta)$. Law of Sines and Law of Cosines: see the theorems sheet.

## Transformations (center at the origin)

| Transformation | Rule |
|---|---|
| Translation $\langle a, b \rangle$ | $(x, y) \to (x + a, y + b)$ |
| Reflect in $x$-axis | $(x, y) \to (x, -y)$ |
| Reflect in $y$-axis | $(x, y) \to (-x, y)$ |
| Reflect in $y = x$ | $(x, y) \to (y, x)$ |
| Reflect in $y = -x$ | $(x, y) \to (-y, -x)$ |
| Reflect in $x = h$ | $(x, y) \to (2h - x, y)$ |
| Reflect in $y = k$ | $(x, y) \to (x, 2k - y)$ |
| Rotate $90^\circ$ counterclockwise | $(x, y) \to (-y, x)$ |
| Rotate $180^\circ$ | $(x, y) \to (-x, -y)$ |
| Rotate $270^\circ$ counterclockwise | $(x, y) \to (y, -x)$ |
| Dilate by $k$ | $(x, y) \to (kx, ky)$ |

For a center $C$ other than the origin: subtract $C$, apply the rule, add $C$ back.

- Two reflections in parallel lines = translation by twice the distance between them.
- Two reflections in lines meeting at angle $\alpha$ = rotation by $2\alpha$.
- Congruent: related by rigid motions. Similar: rigid motions and dilations.
- Any two circles are similar: translate center to center, then dilate by $\tfrac{r_2}{r_1}$.
- Regular $n$-gon: $n$ lines of symmetry, rotational symmetry angle $\tfrac{360^\circ}{n}$.
