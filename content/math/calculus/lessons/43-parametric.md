---
id: calc-parametric
module: calc-m11
title: Calculus with parametric curves
minutes: 40
topics: [Parametric equations]
drills: [calc-d-param-slope, calc-d-param-arc]
refs: [calc-ref-series]
---
## Curves described by motion

Some curves fail the vertical line test (a circle, a loop), and many are most naturally described by *how they're traced*: a point moving in the plane with position $(x(t), y(t))$ at time $t$. These are **parametric equations**, with **parameter** $t$. This module, the last of the course, brings derivatives and integrals to parametric and polar curves (BC and Calculus II).

### Example 1 (eliminating the parameter)

Describe the curve $x = 3\cos t$, $y = 2\sin t$, $0 \le t \le 2\pi$.

Use $\cos^2t + \sin^2t = 1$: $\left(\frac x3\right)^2 + \left(\frac y2\right)^2 = 1$, an ellipse. As $t$ increases from 0, the point starts at $(3, 0)$ and moves counterclockwise once around.

```plot
{"x": [-4, 4], "y": [-3, 3], "equal": true, "curves": [{"x": "3cos(t)", "y": "2sin(t)", "t": [0, "2pi"]}], "points": [{"at": [3, 0], "label": "t = 0"}, {"at": [0, 2], "label": "t = π/2"}], "caption": "x = 3 cos t, y = 2 sin t traces an ellipse counterclockwise"}
```

The parametric description carries more information than the $xy$-equation: direction, speed, and where the point is at each time.

## Slopes

If $x$ and $y$ are differentiable functions of $t$, the chain rule gives $\frac{dy}{dt} = \frac{dy}{dx}\cdot\frac{dx}{dt}$. Solve for the slope:

$$\frac{dy}{dx} = \frac{dy/dt}{dx/dt}, \qquad \text{provided } \frac{dx}{dt} \ne 0.$$

- *Horizontal tangent:* $\frac{dy}{dt} = 0$ and $\frac{dx}{dt} \ne 0$.
- **Vertical tangent:** $\frac{dx}{dt} = 0$ and $\frac{dy}{dt} \ne 0$.
- If both are 0, investigate with a limit (it can be a cusp or a smooth point).

### Example 2

For $x = t^2 - 3$, $y = t^3 - 3t$, find the tangent line at $t = 2$ and the points with horizontal or vertical tangents.

$\frac{dx}{dt} = 2t$, $\frac{dy}{dt} = 3t^2 - 3$, so $\frac{dy}{dx} = \frac{3t^2 - 3}{2t}$.

At $t = 2$: the point is $(1, 2)$ and the slope is $\frac{9}{4}$. Tangent: $y - 2 = \frac94(x - 1)$.

Horizontal: $3t^2 - 3 = 0$, $t = \pm1$, giving $(-2, -2)$ and $(-2, 2)$. Vertical: $2t = 0$ at $t = 0$, giving $(-3, 0)$ (and $\frac{dy}{dt} = -3 \ne 0$ there).

```plot
{"x": [-4, 4], "y": [-4, 4], "equal": true, "curves": [{"x": "t^2 - 3", "y": "t^3 - 3t", "t": [-2.1, 2.1]}], "functions": [{"f": "2 + 2.25(x - 1)", "dashed": true}], "points": [{"at": [1, 2], "label": "t = 2"}, {"at": [-2, 2]}, {"at": [-2, -2]}, {"at": [-3, 0]}], "caption": "The curve crosses itself at (0, 0); horizontal tangents at (−2, ±2), vertical at (−3, 0)"}
```

Notice the curve passes through $(0, 0)$ twice (at $t = \pm\sqrt3$), with two different tangent lines. A parametric curve can do that; a function can't.

## Second derivatives

$\frac{d^2y}{dx^2}$ is the derivative of $\frac{dy}{dx}$ with respect to $x$. Since $\frac{dy}{dx}$ is a function of $t$, use the same trick again:

$$\frac{d^2y}{dx^2} = \frac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{dx/dt}.$$

It is *not* $\frac{d^2y/dt^2}{d^2x/dt^2}$.

### Example 3

For Example 2, find $\frac{d^2y}{dx^2}$ and the concavity at $t = 2$.

$\frac{dy}{dx} = \frac{3t^2 - 3}{2t} = \frac32t - \frac{3}{2t}$, so $\frac{d}{dt}\left(\frac{dy}{dx}\right) = \frac32 + \frac{3}{2t^2}$. Divide by $\frac{dx}{dt} = 2t$:
$$\frac{d^2y}{dx^2} = \frac{\frac32 + \frac{3}{2t^2}}{2t} = \frac{3(t^2 + 1)}{4t^3}.$$
At $t = 2$: $\frac{15}{32} > 0$, concave up.

## Arc length and speed

A small change $dt$ moves the point by $dx = x'(t)dt$ and $dy = y'(t)dt$, a distance $\sqrt{dx^2 + dy^2}$. So the length of the path traced for $\alpha \le t \le \beta$ (if no part is traced twice) is

$$L = \int_\alpha^\beta\sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2}\,dt.$$

The integrand is the **speed**. In vector language, the position is $\langle x(t), y(t)\rangle$, the velocity vector is $\langle x'(t), y'(t)\rangle$, and speed is its length. Total distance traveled = $\int$ speed $dt$, just as in Lesson 25.

### Example 4

Find the length of one arch of the cycloid $x = t - \sin t$, $y = 1 - \cos t$, $0 \le t \le 2\pi$.

$x' = 1 - \cos t$, $y' = \sin t$. Then
$$(x')^2 + (y')^2 = 1 - 2\cos t + \cos^2t + \sin^2t = 2 - 2\cos t = 4\sin^2\frac t2.$$
(The half-angle identity $1 - \cos t = 2\sin^2\frac t2$.) On $[0, 2\pi]$, $\sin\frac t2 \ge 0$, so
$$L = \int_0^{2\pi}2\sin\frac t2\,dt = \Big[-4\cos\frac t2\Big]_0^{2\pi} = 4 + 4 = \mathbf 8.$$

```plot
{"x": [-0.5, 6.8], "y": [-0.5, 2.5], "equal": true, "curves": [{"x": "t - sin(t)", "y": "1 - cos(t)", "t": [0, "2pi"]}], "caption": "One arch of the cycloid traced by a point on a rolling wheel of radius 1: length 8"}
```

### Example 5 (particle motion, AP style)

A particle moves with $x'(t) = 2t$ and $y'(t) = \cos(\pi t)$, starting at $(1, 0)$ at $t = 0$. Find its speed at $t = 1$ and its position at $t = 2$.

- Speed at $t = 1$: $\sqrt{2^2 + \cos^2\pi} = \sqrt{4 + 1} = \sqrt5$.
- Position: $x(2) = 1 + \int_0^2 2t\,dt = 1 + 4 = 5$; $y(2) = 0 + \int_0^2\cos(\pi t)\,dt = \left[\frac{\sin \pi t}{\pi}\right]_0^2 = 0$. So $(5, 0)$.

## Area under a parametric curve

The area under a curve $y \ge 0$ is $\int y\,dx$. With $x = x(t)$, $dx = x'(t)\,dt$, so

$$A = \int_\alpha^\beta y(t)\,x'(t)\,dt,$$

with the limits ordered so that $x$ moves left to right (or take absolute value). Under one cycloid arch: $\int_0^{2\pi}(1 - \cos t)(1 - \cos t)\,dt = 3\pi$.

### Example 6 (a check you can do in your head)

Find the length of $x = 1 + 3t$, $y = 2 - 4t$ for $0 \le t \le 2$.

$x' = 3$ and $y' = -4$, so the speed is $\sqrt{9 + 16} = 5$ and $L = \int_0^2 5\,dt = 10$. The path is the segment from $(1, 2)$ to $(7, -6)$, and the distance formula gives $\sqrt{36 + 64} = 10$. ✓

## Common mistakes

- **$\frac{dy}{dx} = \frac{dx/dt}{dy/dt}$.** It's $y$ over $x$.
- **Second derivative as $\frac{y''(t)}{x''(t)}$.** Differentiate $\frac{dy}{dx}$ in $t$, then divide by $\frac{dx}{dt}$.
- **Plugging the $x$-coordinate in for $t$.** Find the $t$-value of the point first.
- *Forgetting the square root* (or a square) in arc length.
- *Ignoring direction or retracing* when computing length or area.

## Key points

- $\frac{dy}{dx} = \frac{y'(t)}{x'(t)}$; horizontal tangents where $y' = 0$, vertical where $x' = 0$.
- $\frac{d^2y}{dx^2} = \frac{d}{dt}\left(\frac{dy}{dx}\right)\Big/\frac{dx}{dt}$.
- Arc length and distance traveled: $\int\sqrt{(x')^2 + (y')^2}\,dt$; speed is the integrand.
- Area: $\int y(t)\,x'(t)\,dt$.
