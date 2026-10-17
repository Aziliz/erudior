---
id: calc-polar
module: calc-m11
title: Calculus in polar coordinates
minutes: 40
topics: [Polar coordinates]
drills: [calc-d-polar-area, calc-d-polar-slope]
refs: [calc-ref-series]
---
## A different way to locate points

Rectangular coordinates say "go right $x$, up $y$." **Polar coordinates** say "face direction $\theta$ (measured counterclockwise from the positive $x$-axis), then go distance $r$." Curves with rotational symmetry (circles centered at the origin, spirals, flowers) have much simpler polar equations. This final lesson finds slopes, areas and lengths for polar curves $r = f(\theta)$.

## Converting

From the right triangle with hypotenuse $r$ and angle $\theta$:

$$x = r\cos\theta, \quad y = r\sin\theta, \qquad r^2 = x^2 + y^2, \quad \tan\theta = \frac yx.$$

A point has many polar descriptions: $(r, \theta)$, $(r, \theta + 2\pi)$, and $(-r, \theta + \pi)$ are all the same point. A negative $r$ means "go backward" from the direction $\theta$.

### Example 1

Convert $r = 4\cos\theta$ to rectangular form.

Multiply by $r$: $r^2 = 4r\cos\theta$, so $x^2 + y^2 = 4x$. Complete the square: $(x - 2)^2 + y^2 = 4$, a circle of radius 2 centered at $(2, 0)$. It's traced once as $\theta$ runs from 0 to $\pi$.

## Common polar curves

| Equation | Shape |
|---|---|
| $r = a$ | circle of radius $\lvert a\rvert$ centered at the origin |
| $\theta = \alpha$ | line through the origin |
| $r = 2a\cos\theta$ or $2a\sin\theta$ | circle through the origin |
| $r = a(1 \pm \cos\theta)$ | cardioid (heart shape) |
| $r = a + b\cos\theta$ | limaçon (inner loop if $\lvert a\rvert < \lvert b\rvert$) |
| $r = a\cos(n\theta)$ | rose: $n$ petals if $n$ odd, $2n$ if $n$ even |
| $r = a\theta$ | spiral |

```plot
{"x": [-3, 3], "y": [-2.5, 2.5], "equal": true, "curves": [{"x": "(1 + cos(t))cos(t)", "y": "(1 + cos(t))sin(t)", "t": [0, "2pi"], "label": "r = 1 + cos θ"}, {"x": "2cos(3t)cos(t)", "y": "2cos(3t)sin(t)", "t": [0, "pi"], "dashed": true, "label": "r = 2cos 3θ"}], "caption": "A cardioid and a three-petal rose"}
```

To graph by hand, make a table of $\theta$ and $r$ at multiples of $\frac\pi6$ or $\frac\pi4$, and note where $r = 0$ (the curve passes through the origin) and where $|r|$ is largest.

## Slopes of polar curves

Treat the curve as parametric with parameter $\theta$: $x = f(\theta)\cos\theta$, $y = f(\theta)\sin\theta$. Then (product rule, with $r' = \frac{dr}{d\theta}$):

$$\frac{dy}{dx} = \frac{dy/d\theta}{dx/d\theta} = \frac{r'\sin\theta + r\cos\theta}{r'\cos\theta - r\sin\theta}.$$

Note that $\frac{dr}{d\theta}$ is *not* the slope; it's the rate at which the distance from the origin changes.

### Example 2

Find the slope of the cardioid $r = 1 + \cos\theta$ at $\theta = \frac\pi2$.

$r' = -\sin\theta$. At $\theta = \frac\pi2$: $r = 1$, $r' = -1$, $\sin\theta = 1$, $\cos\theta = 0$.
$$\frac{dy}{dx} = \frac{(-1)(1) + (1)(0)}{(-1)(0) - (1)(1)} = \frac{-1}{-1} = \mathbf 1.$$
The point is $(x, y) = (0, 1)$, and the tangent line there is $y = x + 1$.

## Area in polar coordinates

Polar regions are naturally sliced into thin wedges from the origin, not rectangles. A circular sector of radius $r$ and angle $\Delta\theta$ has area $\frac12r^2\Delta\theta$. Adding wedges for the region bounded by $r = f(\theta)$ from $\theta = \alpha$ to $\theta = \beta$:

$$A = \frac12\int_\alpha^\beta r^2\,d\theta = \frac12\int_\alpha^\beta\left[f(\theta)\right]^2d\theta.$$

```plot
{"x": [-0.5, 2.5], "y": [-0.5, 1.5], "equal": true, "curves": [{"x": "(1 + cos(t))cos(t)", "y": "(1 + cos(t))sin(t)", "t": [0, 1.5708]}], "segments": [{"from": [0, 0], "to": [1.7113, 0.8266]}, {"from": [0, 0], "to": [1.5065, 1.0307]}], "caption": "A thin wedge of angle Δθ has area about ½r²Δθ"}
```

### Example 3

Find the area inside one petal of the rose $r = 2\cos3\theta$.

One petal is traced as $r$ goes from 0 to 2 and back to 0: $\cos3\theta \ge 0$ for $-\frac\pi6 \le \theta \le \frac\pi6$.
$$A = \frac12\int_{-\pi/6}^{\pi/6}4\cos^23\theta\,d\theta = 2\int_{-\pi/6}^{\pi/6}\frac{1 + \cos6\theta}{2}\,d\theta = \left[\theta + \frac{\sin6\theta}{6}\right]_{-\pi/6}^{\pi/6} = \mathbf{\frac\pi3}.$$

### Example 4

Find the area enclosed by the cardioid $r = 1 + \cos\theta$.

$$A = \frac12\int_0^{2\pi}(1 + \cos\theta)^2d\theta = \frac12\int_0^{2\pi}\left(1 + 2\cos\theta + \cos^2\theta\right)d\theta = \frac12\left(2\pi + 0 + \pi\right) = \mathbf{\frac{3\pi}{2}}.$$

### Area between two polar curves

For the region between an outer curve $r_{\text{out}}$ and an inner curve $r_{\text{in}}$:
$$A = \frac12\int_\alpha^\beta\left(r_{\text{out}}^2 - r_{\text{in}}^2\right)d\theta.$$
(As with washers, square first, then subtract.) Find the limits by solving $r_{\text{out}} = r_{\text{in}}$.

### Example 5

Find the area inside $r = 3\cos\theta$ and outside $r = 1 + \cos\theta$.

Intersections: $3\cos\theta = 1 + \cos\theta \Rightarrow \cos\theta = \frac12$, $\theta = \pm\frac\pi3$. Between them the circle is outside.
$$A = \frac12\int_{-\pi/3}^{\pi/3}\left(9\cos^2\theta - (1 + \cos\theta)^2\right)d\theta = \frac12\int_{-\pi/3}^{\pi/3}\left(8\cos^2\theta - 2\cos\theta - 1\right)d\theta.$$
With $8\cos^2\theta = 4 + 4\cos2\theta$: the integrand is $3 + 4\cos2\theta - 2\cos\theta$, and
$$A = \frac12\Big[3\theta + 2\sin2\theta - 2\sin\theta\Big]_{-\pi/3}^{\pi/3} = \frac12\left(2\pi + 2\sqrt3 - 2\sqrt3\right) = \mathbf{\pi}.$$

## Arc length in polar coordinates

From the parametric formula with $x = r\cos\theta$, $y = r\sin\theta$, the cross terms cancel and

$$L = \int_\alpha^\beta\sqrt{r^2 + \left(\frac{dr}{d\theta}\right)^2}\,d\theta.$$

For the cardioid $r = 1 + \cos\theta$: $r^2 + (r')^2 = 2 + 2\cos\theta = 4\cos^2\frac\theta2$, and the total length is $\int_0^{2\pi}2\left|\cos\frac\theta2\right|d\theta = 8$.

### Example 6 (tangents at the origin)

Where a polar curve passes through the origin ($r = 0$ at $\theta = \theta_0$, with $r' \ne 0$), the slope formula reduces to $\frac{\sin\theta_0}{\cos\theta_0} = \tan\theta_0$: the tangent line there is simply the ray $\theta = \theta_0$. For the rose $r = 2\cos3\theta$, $r = 0$ at $\theta = \frac\pi6$, so one petal leaves the origin along the line $y = \frac{x}{\sqrt3}$.

## Common mistakes

- **Treating $\frac{dr}{d\theta}$ as the slope.** Use the full formula.
- **Forgetting the $\frac12$** or the square in the area formula.
- *Integrating over too wide an interval* and counting a region twice (a rose petal or a circle traced twice).
- **$(r_{\text{out}} - r_{\text{in}})^2$ instead of $r_{\text{out}}^2 - r_{\text{in}}^2$.**
- *Missing intersection points at the origin,* which can occur at different $\theta$ values on each curve.

## Key points

- $x = r\cos\theta$, $y = r\sin\theta$, $r^2 = x^2 + y^2$.
- Slope: $\dfrac{dy}{dx} = \dfrac{r'\sin\theta + r\cos\theta}{r'\cos\theta - r\sin\theta}$.
- Area: $\frac12\int_\alpha^\beta r^2\,d\theta$; between curves, $\frac12\int(r_{\text{out}}^2 - r_{\text{in}}^2)\,d\theta$.
- Arc length: $\int\sqrt{r^2 + (r')^2}\,d\theta$.
