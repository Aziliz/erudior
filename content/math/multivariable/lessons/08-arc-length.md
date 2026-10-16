---
id: mv-arc-length
module: mv-m2
title: Arc length and curvature
minutes: 35
topics: [Arc length, Curvature]
drills: [mv-d-arc-helix, mv-d-curv-plane]
refs: [mv-ref-differential]
---
## Measuring a curve

The previous lesson gave us tangent vectors. Two natural questions follow: how *long* is a
curve, and how sharply does it *bend*? Engineers ask the second one when designing
railway transitions and highway ramps: a sudden jump in curvature means a sudden jerk
sideways for passengers. Both answers come from the tangent vector.

## Arc length

In time $dt$ the point $\mathbf r(t)$ moves by approximately $\mathbf r'(t)\,dt$, a
displacement of length $|\mathbf r'(t)|\,dt$. Adding these up gives the **arc length**
from $t = a$ to $t = b$:

$$L = \int_a^b |\mathbf r'(t)|\,dt = \int_a^b\sqrt{f'(t)^2 + g'(t)^2 + h'(t)^2}\,dt.$$

This is the bridge lesson's parametric formula with a third term under the root. The
quantity $|\mathbf r'(t)|$ is the **speed** of the moving point, and length is the
integral of speed, just as distance travelled is the integral of speed in one variable.

### Example 1: one turn of a helix

Find the length of $\mathbf r(t) = \langle \cos t,\, \sin t,\, t\rangle$ for $0\le t\le 2\pi$.

1. $\mathbf r'(t) = \langle -\sin t,\, \cos t,\, 1\rangle$.
2. $|\mathbf r'(t)| = \sqrt{\sin^2t + \cos^2t + 1} = \sqrt2$, a constant speed.
3. $L = \int_0^{2\pi}\sqrt2\,dt = 2\pi\sqrt2 \approx 8.886$.

Sanity check: unrolled, one turn of the helix is the diagonal of a rectangle of width
$2\pi$ (the circle's circumference) and height $2\pi$ (the rise), whose length is
$\sqrt{(2\pi)^2 + (2\pi)^2} = 2\pi\sqrt2$. ✓

Most arc length integrals have no elementary antiderivative, so in practice they are
often done numerically. Exercises therefore use curves whose speed simplifies, such as
helices, or $\mathbf r(t) = \langle 2t,\, t^2,\, \tfrac13t^3\rangle$, whose speed is
$\sqrt{4 + 4t^2 + t^4} = t^2 + 2$, a perfect square under the root.

### The arc length function

Measuring length from a starting time $t = a$ gives the **arc length function**

$$s(t) = \int_a^t |\mathbf r'(u)|\,du,\qquad \frac{ds}{dt} = |\mathbf r'(t)|.$$

Re-expressing the curve with $s$ as the parameter is called *parametrizing by arc length*.
For the helix, $s = \sqrt2\,t$, so $t = s/\sqrt2$ and
$\mathbf r = \langle \cos(s/\sqrt2), \sin(s/\sqrt2), s/\sqrt2\rangle$. In this
parametrization the speed is exactly 1, so the parameter literally counts distance along
the curve. That makes it the natural parameter for describing shape, independent of how
fast a particle happens to travel.

## Curvature

The unit tangent $\mathbf T$ always has length 1, so the only thing it can do is turn. How
fast it turns *per unit of distance* measures bending. The **curvature** is

$$\kappa = \left|\frac{d\mathbf T}{ds}\right|.$$

Using $s$, not $t$, makes $\kappa$ a property of the curve's shape alone: driving a curve
faster does not make it sharper. By the chain rule, $\dfrac{d\mathbf T}{dt} = \dfrac{d\mathbf T}{ds}\dfrac{ds}{dt}$, so

$$\kappa(t) = \frac{|\mathbf T'(t)|}{|\mathbf r'(t)|}.$$

### A formula that skips T

Computing $\mathbf T'$ often means differentiating a messy quotient. A cleaner formula is

$$\kappa(t) = \frac{|\mathbf r'(t)\times\mathbf r''(t)|}{|\mathbf r'(t)|^3}.$$

*Why.* Write $\mathbf r' = s'\,\mathbf T$ where $s' = |\mathbf r'|$. Differentiate:
$\mathbf r'' = s''\,\mathbf T + s'\,\mathbf T'$. Cross with $\mathbf r'$: since
$\mathbf T\times\mathbf T = \mathbf 0$, we get $\mathbf r'\times\mathbf r'' = (s')^2\,\mathbf T\times\mathbf T'$.
Because $|\mathbf T| = 1$ is constant, $\mathbf T' \perp \mathbf T$ (Lesson 7), so
$|\mathbf T\times\mathbf T'| = |\mathbf T'|$. Thus $|\mathbf r'\times\mathbf r''| = (s')^2|\mathbf T'| = (s')^2\cdot\kappa s' = \kappa(s')^3$.

For a plane curve $y = f(x)$ (treat it as $\langle x, f(x), 0\rangle$) this becomes

$$\kappa(x) = \frac{|f''(x)|}{\left(1 + f'(x)^2\right)^{3/2}}.$$

### Benchmarks

- A straight line has $\mathbf T$ constant, so $\kappa = 0$.
- A circle of radius $a$ has $\kappa = 1/a$: small circles bend sharply.
- The helix $\langle \cos t, \sin t, t\rangle$ has $\kappa = \tfrac12$ everywhere (check: $\mathbf r'\times\mathbf r'' = \langle \sin t, -\cos t, 1\rangle$ has length $\sqrt2$, and $\sqrt2/(\sqrt2)^3 = \tfrac12$).

The reciprocal $\rho = 1/\kappa$ is the **radius of curvature**: the radius of the
**osculating circle**, the circle that best hugs the curve at that point. It sits on the
concave side, tangent to the curve.

### Example 2

Find the curvature of $y = x^2$ at $x = 0$ and $x = 1$.

1. $f' = 2x$, $f'' = 2$.
2. At $x = 0$: $\kappa = \dfrac{2}{(1 + 0)^{3/2}} = 2$, so the osculating circle has radius $\tfrac12$ and center $(0, \tfrac12)$.
3. At $x = 1$: $\kappa = \dfrac{2}{(1 + 4)^{3/2}} = \dfrac{2}{5\sqrt5} \approx 0.179$.

The parabola is sharpest at its vertex and straightens out as it climbs.

```plot
{"x": [-2, 2], "y": [-0.5, 2.5], "equal": true, "functions": [{"f": "x^2", "label": "y = x²"}], "circles": [{"center": [0, 0.5], "r": 0.5}], "points": [{"at": [0, 0.5], "label": "center (0, ½)"}], "caption": "The osculating circle of y = x² at the vertex has radius 1/κ = ½"}
```

### Example 3: the twisted cubic

Find the curvature of $\mathbf r(t) = \langle t, t^2, t^3\rangle$ at $t = 1$.

1. $\mathbf r' = \langle 1, 2t, 3t^2\rangle$, $\mathbf r'' = \langle 0, 2, 6t\rangle$. At $t = 1$: $\langle 1,2,3\rangle$ and $\langle 0,2,6\rangle$.
2. Cross: $\langle 2\cdot6 - 3\cdot2,\; 3\cdot0 - 1\cdot6,\; 1\cdot2 - 2\cdot0\rangle = \langle 6, -6, 2\rangle$, length $\sqrt{76}$.
3. $|\mathbf r'| = \sqrt{14}$, so $\kappa = \dfrac{\sqrt{76}}{14^{3/2}} \approx \dfrac{8.718}{52.38} \approx 0.166$.

## Common mistakes

- Integrating $\mathbf r'(t)$ (a vector) instead of its length $|\mathbf r'(t)|$ for arc length.
- Using $|\mathbf T'(t)|$ alone as the curvature; it must be divided by the speed.
- Forgetting the cube in $|\mathbf r'|^3$, or the $\tfrac32$ power in the plane formula.
- Expecting a large curvature to mean a large circle; it is the reverse, $\rho = 1/\kappa$.

## Key points

- $L = \int_a^b|\mathbf r'(t)|\,dt$; $ds/dt = |\mathbf r'(t)|$ is the speed.
- $\kappa = |d\mathbf T/ds| = |\mathbf T'|/|\mathbf r'| = |\mathbf r'\times\mathbf r''|/|\mathbf r'|^3$.
- For $y = f(x)$: $\kappa = |f''|/(1 + f'^2)^{3/2}$.
- Line: $\kappa = 0$; circle of radius $a$: $\kappa = 1/a$; osculating circle radius $1/\kappa$.
