---
id: pc-parametric
module: pc-m7
title: Parametric equations
minutes: 30
topics: [Parametric equations]
drills: [pc-param-point, pc-param-eliminate]
refs: [pc-ref-conics-polar]
---
## Describing motion, not just shape

The equation $\frac{x^2}{9} + \frac{y^2}{4} = 1$ tells you the shape of an ellipse, but not where a planet is on it at a given time, or which way it's moving. **Parametric equations** describe a curve by giving both coordinates as functions of a third variable, the **parameter**, usually $t$ for time:

$$x = f(t), \qquad y = g(t), \qquad t \text{ in some interval}.$$

As $t$ increases, the point $(f(t), g(t))$ traces the curve. This lets us describe motion, and it handles curves that aren't graphs of functions (circles, loops, spirals) with no fuss. Parametric curves reappear in calculus (arc length, velocity vectors) and connect directly to the vectors in Module 8.

## Plotting from a table

Choose values of $t$, compute $x$ and $y$, plot the points in order, and draw arrows showing the direction of increasing $t$: the curve's **orientation**.

### Example 1

Sketch $x = t^2 - 1$, $y = 2t$ for $-2 \le t \le 2$.

| $t$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|
| $x$ | $3$ | $0$ | $-1$ | $0$ | $3$ |
| $y$ | $-4$ | $-2$ | $0$ | $2$ | $4$ |

The points trace a parabola opening right, moving upward as $t$ increases, starting at $(3, -4)$ and ending at $(3, 4)$.

```plot
{"x": [-2, 5], "y": [-5, 5], "equal": true, "curves": [{"x": "t^2 - 1", "y": "2t", "t": [-2, 2]}], "points": [{"at": [3, -4], "label": "t = −2"}, {"at": [0, -2], "label": "t = −1"}, {"at": [-1, 0], "label": "t = 0"}, {"at": [0, 2], "label": "t = 1"}, {"at": [3, 4], "label": "t = 2"}], "segments": [{"from": [-0.6, 1], "to": [-0.4, 1.4], "arrow": true}], "caption": "x = t² − 1, y = 2t: a parabola traced upward."}
```

## Eliminating the parameter

To find the ordinary equation in $x$ and $y$, solve one equation for $t$ and substitute into the other. In Example 1, $t = \frac{y}{2}$, so

$$x = \left(\frac{y}{2}\right)^2 - 1 = \frac{y^2}{4} - 1.$$

This rectangular equation describes the shape but loses the direction and the timing, and sometimes it describes more than the parametric curve does (here the parametric version is only the piece with $-4 \le y \le 4$).

For trig parameters, solve for $\cos t$ and $\sin t$ and use $\cos^2 t + \sin^2 t = 1$.

### Example 2

Eliminate the parameter from $x = 3\cos t$, $y = 2\sin t$, $0 \le t \le 2\pi$, and describe the motion.

$\cos t = \frac{x}{3}$ and $\sin t = \frac{y}{2}$, so

$$\frac{x^2}{9} + \frac{y^2}{4} = \cos^2 t + \sin^2 t = 1.$$

An ellipse. At $t = 0$ the point is $(3, 0)$; at $t = \frac{\pi}{2}$ it is $(0, 2)$. So it travels counterclockwise, once around.

## Writing parametric equations

The same curve has many parametrizations. Some standard ones:

| Curve | Parametrization |
|---|---|
| graph $y = f(x)$ | $x = t$, $y = f(t)$ |
| segment from $(x_1, y_1)$ to $(x_2, y_2)$ | $x = x_1 + (x_2 - x_1)t$, $y = y_1 + (y_2 - y_1)t$, $0 \le t \le 1$ |
| circle, center $(h, k)$, radius $r$ | $x = h + r\cos t$, $y = k + r\sin t$, $0 \le t \le 2\pi$ |
| ellipse $\frac{(x-h)^2}{a^2} + \frac{(y-k)^2}{b^2} = 1$ | $x = h + a\cos t$, $y = k + b\sin t$ |

Speeding up or reversing is a change of parameter: $x = \cos 2t$, $y = \sin 2t$ goes around the unit circle twice as fast; $x = \cos t$, $y = -\sin t$ goes clockwise.

### Example 3

Parametrize the segment from $(1, 2)$ to $(5, -4)$.

The change is $(5 - 1, -4 - 2) = (4, -6)$. So $x = 1 + 4t$, $y = 2 - 6t$, $0 \le t \le 1$. At $t = 0$ you're at the start; at $t = 1$, at the end; at $t = \tfrac12$, at the midpoint $(3, -1)$.

## Projectile motion

Ignoring air resistance, an object launched with horizontal velocity $v_x$ and vertical velocity $v_y$ from height $h$ moves according to

$$x = v_x t, \qquad y = h + v_y t - \tfrac12 g t^2, \qquad g = 9.8 \text{ m/s}^2.$$

The horizontal motion is steady and the vertical motion is a falling parabola, and parametric equations keep them separate.

### Example 4

A ball is kicked from the ground with $v_x = 20$ m/s and $v_y = 15$ m/s, so $x = 20t$, $y = 15t - 4.9t^2$. How far does it travel, and how high does it go?

- It lands when $y = 0$: $t(15 - 4.9t) = 0$, so $t = \frac{15}{4.9} \approx 3.06$ s. Then $x = 20(3.06) \approx 61.2$ m.
- The top of the arc is at the vertex of $y(t)$: $t = \frac{15}{9.8} \approx 1.53$ s, and $y \approx 15(1.53) - 4.9(1.53)^2 \approx 11.5$ m.

```plot
{"x": [0, 80], "y": [0, 15], "xLabel": "x (m)", "yLabel": "y (m)", "curves": [{"x": "20t", "y": "15t - 4.9t^2", "t": [0, 3.0612]}], "points": [{"at": [30.6, 11.48], "label": "top (30.6, 11.5)"}, {"at": [61.2, 0]}], "labels": [{"at": [61.2, 2], "text": "lands (61.2, 0)"}], "caption": "The ball's path: x = 20t, y = 15t − 4.9t²."}
```

## Common mistakes

- *Forgetting orientation.* A parametric curve has a direction; show it with arrows.
- *Ignoring the parameter interval.* It can restrict the curve to a piece of the rectangular graph.
- *Eliminating by solving a trig equation for $t$.* Use $\cos^2 t + \sin^2 t = 1$ instead.
- *Mixing up which coordinate gets $\cos$.* $x = r\cos t$, $y = r\sin t$ starts at $(r, 0)$ and goes counterclockwise.
- *Treating $t$ as a coordinate.* It's not plotted; it only labels the order of points.

## Key points

- Parametric equations $x = f(t)$, $y = g(t)$ give a curve with a direction.
- Eliminate the parameter by solving for $t$, or with $\cos^2 t + \sin^2 t = 1$ for trig.
- Segment: $x = x_1 + (x_2 - x_1)t$, $y = y_1 + (y_2 - y_1)t$ on $[0, 1]$.
- Circle/ellipse: $x = h + a\cos t$, $y = k + b\sin t$.
- Projectiles: $x = v_x t$, $y = h + v_y t - 4.9t^2$ (meters).
