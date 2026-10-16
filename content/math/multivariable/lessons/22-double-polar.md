---
id: mv-double-polar
module: mv-m5
title: Double integrals in polar coordinates
minutes: 35
topics: [Polar double integrals]
drills: [mv-d-polar-disk, mv-d-polar-area]
refs: [mv-ref-integrals]
---
## When the region is round

Integrate $e^{-(x^2+y^2)}$ over a disk in rectangular coordinates and you are stuck: the
limits involve $\sqrt{4 - x^2}$, and the integrand has no elementary antiderivative in $x$.
But the region and the integrand are both naturally described by distance from the origin.
Switching to polar coordinates turns disks, rings and wedges into rectangles in the
$(r, \theta)$ plane, and $x^2 + y^2$ into simply $r^2$.

## Polar rectangles and the area element

Recall $x = r\cos\theta$, $y = r\sin\theta$, $x^2 + y^2 = r^2$. A **polar rectangle** is
$R = \{(r, \theta) : a \le r \le b,\ \alpha \le \theta \le \beta\}$: a sector of a ring.

The crucial question is the area of a tiny polar rectangle with sides $\Delta r$ and
$\Delta\theta$. It is not $\Delta r\,\Delta\theta$. The radial side has length $\Delta r$,
but the arc side has length $r\,\Delta\theta$ (arc length = radius × angle). The patch is
nearly a rectangle with sides $\Delta r$ and $r\,\Delta\theta$, so its area is about
$r\,\Delta r\,\Delta\theta$. Patches far from the origin are bigger than those near it,
for the same $\Delta r$ and $\Delta\theta$.

```plot
{"x": [-0.2, 3.2], "y": [-0.2, 3.2], "equal": true, "curves": [{"x": "1.5*cos(t)", "y": "1.5*sin(t)", "t": [0.5, 0.9]}, {"x": "2.5*cos(t)", "y": "2.5*sin(t)", "t": [0.5, 0.9], "label": "arc length r Δθ"}], "segments": [{"from": [1.3164, 0.7191], "to": [2.1939, 1.1986], "label": "Δr"}, {"from": [0.9324, 1.1750], "to": [1.5540, 1.9583]}, {"from": [0, 0], "to": [1.3164, 0.7191], "dashed": true}, {"from": [0, 0], "to": [0.9324, 1.1750], "dashed": true}], "caption": "A polar rectangle has sides Δr and about r Δθ, so dA = r dr dθ"}
```

Therefore:

$$dA = r\,dr\,d\theta,$$

and for continuous $f$ on a polar rectangle,

$$\iint_R f(x, y)\,dA = \int_\alpha^\beta\int_a^b f(r\cos\theta,\, r\sin\theta)\;r\,dr\,d\theta.$$

The extra factor $r$ is the single most commonly forgotten piece in this course. In Lesson
27 it will reappear as the Jacobian of the polar transformation.

### Example 1

Evaluate $\iint_D (x^2 + y^2)\,dA$ over the disk $x^2 + y^2 \le 4$.

1. In polar form the disk is $0 \le r \le 2$, $0 \le \theta \le 2\pi$, and $x^2 + y^2 = r^2$.
2. $\displaystyle\int_0^{2\pi}\int_0^2 r^2\cdot r\,dr\,d\theta = \int_0^{2\pi}\left[\frac{r^4}{4}\right]_0^2d\theta = \int_0^{2\pi}4\,d\theta = 8\pi.$

### Example 2: a volume

Find the volume of the solid under the paraboloid $z = 4 - x^2 - y^2$ and above the $xy$-plane.

1. The paraboloid meets $z = 0$ on the circle $x^2 + y^2 = 4$, so the base is the disk of radius 2.
2. $V = \displaystyle\int_0^{2\pi}\int_0^2(4 - r^2)\,r\,dr\,d\theta = 2\pi\left[2r^2 - \frac{r^4}{4}\right]_0^2 = 2\pi(8 - 4) = 8\pi.$

### Example 3: a quarter ring

Evaluate $\iint_D y\,dA$, where $D$ is the part of the ring $1 \le x^2 + y^2 \le 4$ in the first quadrant.

1. $D$: $1 \le r \le 2$, $0 \le \theta \le \tfrac\pi2$; $y = r\sin\theta$.
2. $\displaystyle\int_0^{\pi/2}\int_1^2 r\sin\theta\cdot r\,dr\,d\theta = \left(\int_0^{\pi/2}\sin\theta\,d\theta\right)\left(\int_1^2 r^2\,dr\right) = 1\cdot\frac{7}{3} = \frac73.$

## General polar regions

If the region is $\alpha \le \theta \le \beta$, $h_1(\theta) \le r \le h_2(\theta)$, then

$$\iint_D f\,dA = \int_\alpha^\beta\int_{h_1(\theta)}^{h_2(\theta)} f(r\cos\theta, r\sin\theta)\,r\,dr\,d\theta.$$

With $f = 1$ and $h_1 = 0$, the inner integral gives $\tfrac12h_2(\theta)^2$, recovering the
polar area formula from the bridge lesson.

### Example 4: one petal

Find the area of one petal of the rose $r = \cos2\theta$.

1. The petal around the positive $x$-axis is traced for $-\tfrac\pi4 \le \theta \le \tfrac\pi4$ (where $\cos2\theta \ge 0$).
2. Area $= \displaystyle\int_{-\pi/4}^{\pi/4}\int_0^{\cos2\theta}r\,dr\,d\theta = \int_{-\pi/4}^{\pi/4}\frac{\cos^22\theta}{2}\,d\theta = \frac12\cdot\frac{\pi}{4} = \frac{\pi}{8}.$

(Using $\cos^2u = \tfrac12(1 + \cos2u)$: $\int_{-\pi/4}^{\pi/4}\cos^22\theta\,d\theta = \tfrac\pi4$.)

## A famous application

Let $I = \int_{-\infty}^{\infty}e^{-x^2}\,dx$, the integral behind the normal distribution.
Then $I^2 = \iint_{\mathbb R^2}e^{-(x^2 + y^2)}\,dA$, and in polar coordinates

$$I^2 = \int_0^{2\pi}\int_0^\infty e^{-r^2}r\,dr\,d\theta = 2\pi\cdot\frac12 = \pi,$$

so $I = \sqrt\pi$. The factor $r$ is exactly what makes $e^{-r^2}$ integrable by substitution.

### Example 5: a disk that is not centered at the origin

The circle $x^2 + y^2 = 2x$ (center $(1, 0)$, radius 1) has polar equation $r^2 = 2r\cos\theta$, that is $r = 2\cos\theta$, traced once for $-\tfrac\pi2 \le \theta \le \tfrac\pi2$. The disk it bounds is therefore $-\tfrac\pi2 \le \theta \le \tfrac\pi2$, $0 \le r \le 2\cos\theta$.

1. Area check: $\displaystyle\int_{-\pi/2}^{\pi/2}\int_0^{2\cos\theta}r\,dr\,d\theta = \int_{-\pi/2}^{\pi/2}2\cos^2\theta\,d\theta = \pi$. ✓
2. The integral of the distance from the origin over this disk: $\displaystyle\iint\sqrt{x^2 + y^2}\,dA = \int_{-\pi/2}^{\pi/2}\int_0^{2\cos\theta}r\cdot r\,dr\,d\theta = \frac83\int_{-\pi/2}^{\pi/2}\cos^3\theta\,d\theta = \frac83\cdot\frac43 = \frac{32}{9}.$

```plot
{"x": [-0.5, 2.5], "y": [-1.3, 1.3], "equal": true, "curves": [{"x": "2*cos(t)*cos(t)", "y": "2*cos(t)*sin(t)", "t": ["-pi/2", "pi/2"], "label": "r = 2 cos θ"}], "segments": [{"from": [0, 0], "to": [1.5, 0.866], "dashed": true, "label": "r from 0 to 2 cos θ"}], "caption": "An off-center disk: for each θ, r runs from the origin to the circle"}
```

When choosing coordinates, ask two questions: is the *region* simpler (circles, rays, rings), and is the *integrand* simpler ($x^2 + y^2$, $\sqrt{x^2 + y^2}$, $\arctan(y/x)$)? If either answer is yes, polar coordinates are worth trying.

## Common mistakes

- Forgetting the factor $r$ in $dA = r\,dr\,d\theta$.
- Converting the region but not the integrand (or vice versa).
- Using $0 \le \theta \le \pi$ for a full disk.
- Taking the wrong $\theta$ range for a petal or loop: find where $r = 0$ to locate its ends.

## Key points

- $x = r\cos\theta$, $y = r\sin\theta$, $x^2 + y^2 = r^2$, and $dA = r\,dr\,d\theta$.
- Disks, rings, sectors and petals become rectangles or simple regions in $(r, \theta)$.
- Volume under $z = f$ over a disk is often easiest in polar form.
- $\int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi$ via a polar double integral.
