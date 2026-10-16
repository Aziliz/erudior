---
id: mv-spherical
module: mv-m6
title: Spherical coordinates
minutes: 40
topics: [Spherical coordinates]
drills: [mv-d-sph-convert, mv-d-sph-ball]
refs: [mv-ref-integrals]
---
## Coordinates centered on a point

Cylindrical coordinates suit solids with an axis. Solids centered on a *point* (balls,
spherical shells, ice-cream cones with a spherical cap) and integrands containing
$x^2 + y^2 + z^2$ call for **spherical coordinates**, which locate a point by its distance
from the origin and two angles, like latitude and longitude on a globe. They are the
natural language for gravity, electric fields of point charges, and anything that radiates
from a center.

## The coordinate system

A point $P$ has spherical coordinates $(\rho, \theta, \phi)$:

- $\rho = |OP|$ is the distance from the origin ($\rho \ge 0$);
- $\theta$ is the same angle as in cylindrical coordinates (measured in the $xy$-plane from
  the positive $x$-axis);
- $\phi$ is the angle between the positive $z$-axis and $\overrightarrow{OP}$, with
  $0 \le \phi \le \pi$. ($\phi = 0$ is the north pole, $\phi = \tfrac\pi2$ the equator,
  $\phi = \pi$ the south pole.)

```plot
{"x": [-0.3, 2.5], "y": [-0.5, 2.5], "equal": true, "segments": [{"from": [0, 0], "to": [0, 2.3], "arrow": true, "label": "z"}, {"from": [0, 0], "to": [1.414, 1.414], "arrow": true, "label": "ρ"}, {"from": [1.414, 1.414], "to": [1.414, 0], "dashed": true, "label": "z = ρ cos φ"}, {"from": [0, 0], "to": [1.414, 0], "dashed": true, "label": "r = ρ sin φ"}], "curves": [{"x": "0.6*sin(t)", "y": "0.6*cos(t)", "t": [0, 0.785]}], "labels": [{"at": [0.3, 0.9], "text": "φ"}], "caption": "In the vertical half-plane through P: r = ρ sin φ and z = ρ cos φ"}
```

From the right triangle in the figure, $z = \rho\cos\phi$ and the distance from the
$z$-axis is $r = \rho\sin\phi$. Combining with $x = r\cos\theta$, $y = r\sin\theta$:

$$x = \rho\sin\phi\cos\theta,\qquad y = \rho\sin\phi\sin\theta,\qquad z = \rho\cos\phi,\qquad \rho^2 = x^2 + y^2 + z^2.$$

Basic surfaces: $\rho = c$ is a sphere; $\phi = c$ is a cone around the $z$-axis (for
example $\phi = \tfrac\pi4$ is $z = \sqrt{x^2 + y^2}$); $\theta = c$ is a vertical half-plane.

### Example 1: converting points

1. Spherical $\left(2, \tfrac\pi4, \tfrac\pi3\right)$ (that is $\rho = 2$, $\theta = \tfrac\pi4$, $\phi = \tfrac\pi3$): $x = 2\cdot\tfrac{\sqrt3}{2}\cdot\tfrac{\sqrt2}{2} = \tfrac{\sqrt6}{2}$, $y = \tfrac{\sqrt6}{2}$, $z = 2\cdot\tfrac12 = 1$.
2. Rectangular $(0, 2\sqrt3, -2)$: $\rho = \sqrt{0 + 12 + 4} = 4$; $\cos\phi = z/\rho = -\tfrac12$, so $\phi = \tfrac{2\pi}{3}$; the shadow $(0, 2\sqrt3)$ lies on the positive $y$-axis, so $\theta = \tfrac\pi2$.

## The volume element

A small spherical "box" is bounded by two spheres ($\rho$ and $\rho + \Delta\rho$), two
cones ($\phi$ and $\phi + \Delta\phi$) and two half-planes ($\theta$ and
$\theta + \Delta\theta$). Its three edges are approximately

- $\Delta\rho$ in the radial direction,
- $\rho\,\Delta\phi$ along a meridian (an arc of a circle of radius $\rho$),
- $\rho\sin\phi\,\Delta\theta$ along a parallel (an arc of a circle of radius $r = \rho\sin\phi$).

Multiplying,

$$dV = \rho^2\sin\phi\;d\rho\,d\theta\,d\phi.$$

The $\sin\phi$ reflects that circles of latitude shrink toward the poles. Then

$$\iiint_E f\,dV = \iiint f(\rho\sin\phi\cos\theta,\ \rho\sin\phi\sin\theta,\ \rho\cos\phi)\,\rho^2\sin\phi\;d\rho\,d\theta\,d\phi.$$

### Example 2: volume of a ball

The ball of radius $a$ is $0 \le \rho \le a$, $0 \le \theta \le 2\pi$, $0 \le \phi \le \pi$:

$$V = \int_0^\pi\int_0^{2\pi}\int_0^a\rho^2\sin\phi\,d\rho\,d\theta\,d\phi = \frac{a^3}{3}\cdot2\pi\cdot\left[-\cos\phi\right]_0^\pi = \frac{a^3}{3}\cdot2\pi\cdot2 = \frac43\pi a^3.$$

### Example 3: an ice-cream cone

Find the volume of the solid above the cone $z = \sqrt{x^2 + y^2}$ and inside the sphere $x^2 + y^2 + z^2 = 4$.

1. The cone is $\phi = \tfrac\pi4$ (where $z = r$), and the solid is inside it: $0 \le \phi \le \tfrac\pi4$. The sphere is $\rho = 2$.
2. $V = \displaystyle\int_0^{\pi/4}\int_0^{2\pi}\int_0^2\rho^2\sin\phi\,d\rho\,d\theta\,d\phi = \frac83\cdot2\pi\cdot\left(1 - \frac{\sqrt2}{2}\right) = \frac{8\pi}{3}\left(2 - \sqrt2\right) \approx 4.91.$

### Example 4: a radial integrand

Evaluate $\iiint_B e^{(x^2 + y^2 + z^2)^{3/2}}\,dV$ over the unit ball.

In spherical form the integrand is $e^{\rho^3}$, and
$\displaystyle\int_0^\pi\int_0^{2\pi}\int_0^1 e^{\rho^3}\rho^2\sin\phi\,d\rho\,d\theta\,d\phi = 2\cdot2\pi\cdot\frac{e - 1}{3} = \frac{4\pi}{3}(e - 1).$
The $\rho^2$ from $dV$ supplies exactly the derivative of $\rho^3$, just as $r$ did in polar
coordinates.

## Choosing coordinates

| Situation | Best choice |
|---|---|
| Box or region bounded by planes | rectangular |
| Axis symmetry, $x^2 + y^2$ in the problem, cylinders, paraboloids | cylindrical |
| Point symmetry, $x^2 + y^2 + z^2$ in the problem, spheres, cones from the origin | spherical |

### Example 5: the centroid of a solid hemisphere

Find the height $\bar z$ of the centroid of the solid hemisphere $x^2 + y^2 + z^2 \le a^2$, $z \ge 0$.

1. The volume is half a ball: $V = \tfrac23\pi a^3$.
2. $\displaystyle\iiint z\,dV = \int_0^{\pi/2}\int_0^{2\pi}\int_0^a(\rho\cos\phi)\,\rho^2\sin\phi\,d\rho\,d\theta\,d\phi = \frac{a^4}{4}\cdot2\pi\cdot\frac12 = \frac{\pi a^4}{4}.$
3. $\bar z = \dfrac{\pi a^4/4}{2\pi a^3/3} = \dfrac{3a}{8}$.

By symmetry $\bar x = \bar y = 0$. The balance point of a solid half-ball sits $\tfrac38$ of the way up, lower than the $\tfrac{4a}{3\pi} \approx 0.42a$ of the flat half-disk in Lesson 23.

## Common mistakes

- Using $\rho^2\sin\theta$ instead of $\rho^2\sin\phi$; the sine is of the angle from the $z$-axis.
- Letting $\phi$ run to $2\pi$; its range is $[0, \pi]$.
- Confusing $\rho$ (distance from the origin) with $r$ (distance from the $z$-axis).
- Swapping the roles of $\theta$ and $\phi$ (some books use the opposite letters; read definitions carefully).

## Key points

- $x = \rho\sin\phi\cos\theta$, $y = \rho\sin\phi\sin\theta$, $z = \rho\cos\phi$, $\rho^2 = x^2 + y^2 + z^2$.
- $0 \le \phi \le \pi$ measured from the positive $z$-axis; $\phi = c$ is a cone, $\rho = c$ a sphere.
- $dV = \rho^2\sin\phi\,d\rho\,d\theta\,d\phi$.
