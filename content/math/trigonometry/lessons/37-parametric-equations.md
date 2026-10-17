---
id: trig-parametric
module: trig-m9
title: Parametric equations
minutes: 40
topics: [Parametric equations]
drills: [trig-d-param-eliminate, trig-d-param-line, trig-d-projectile]
refs: [trig-ref-triangles]
---
## Describing a path, not just a shape

An equation like $x^2 + y^2 = 1$ tells you *which* points are on a circle, but nothing about
how something moves around it: where it starts, which way it goes, or how fast. A
satellite tracker, a robot arm or a video game needs more than the shape. It needs the
position at every moment. The last two lessons described points by direction and distance;
this lesson describes them by a third quantity, usually time, and writes $x$ and $y$
separately as functions of it. Sine and cosine turn out to be the natural tools, because
they are exactly the coordinates of a point moving around a circle.

## Parametric equations

A pair of equations
$$x = f(t), \qquad y = g(t), \qquad t \text{ in an interval } I$$
is a set of **parametric equations**. The variable $t$ is the **parameter**. As $t$ runs through $I$,
the point $(f(t), g(t))$ traces a **plane curve**. The direction the point travels as $t$
increases is the curve's **orientation**, shown on a graph with small arrows.

Think of $t$ as a clock reading. Each value of $t$ gives one point, so a table of $t$-values is
all you need to sketch the curve: compute $x$ and $y$, plot the points in order of $t$, and
join them in that order.

### Example 1: graphing from a table

Sketch $x = 2t - 1$, $y = t^2$ for $-2 \le t \le 2$, and show the orientation.

| $t$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|
| $x = 2t - 1$ | $-5$ | $-3$ | $-1$ | $1$ | $3$ |
| $y = t^2$ | $4$ | $1$ | $0$ | $1$ | $4$ |

The points run from $(-5, 4)$ down to $(-1, 0)$ and back up to $(3, 4)$, so the curve is a piece
of a parabola traced left to right. It starts at $t = -2$ and stops at $t = 2$; the endpoints
belong to the curve and nothing beyond them does.

```plot
{"x": [-6, 4], "y": [-1, 5], "equal": true, "curves": [{"x": "2t - 1", "y": "t^2", "t": [-2, 2]}], "points": [{"at": [-5, 4], "label": "t = −2"}, {"at": [-3, 1], "label": "t = −1"}, {"at": [-1, 0], "label": "t = 0"}, {"at": [1, 1], "label": "t = 1"}, {"at": [3, 4], "label": "t = 2"}], "segments": [{"from": [1.8, 1.96], "to": [2.2, 2.56], "arrow": true}, {"from": [-4.2, 2.56], "to": [-3.8, 1.96], "arrow": true}], "caption": "x = 2t − 1, y = t², −2 ≤ t ≤ 2; arrows show the orientation"}
```

## Eliminating the parameter

To find the ordinary $xy$-equation of a parametric curve, remove $t$. This is called
**eliminating the parameter**. There are two standard ways.

**Solve and substitute.** If one equation is easy to solve for $t$, do so and substitute into the
other. In Example 1, $t = \tfrac{x + 1}{2}$, so $y = \left(\tfrac{x + 1}{2}\right)^2 = \tfrac{(x + 1)^2}{4}$. Because $t$ was limited to $[-2, 2]$, the
curve is only the part with $-5 \le x \le 3$. Always carry the restriction across.

**Use an identity.** When $x$ and $y$ involve $\cos t$ and $\sin t$, isolate them and use
$\cos^2 t + \sin^2 t = 1$. For $x = 3\cos t$, $y = 2\sin t$: $\cos t = \tfrac{x}{3}$ and $\sin t = \tfrac{y}{2}$, so
$$\frac{x^2}{9} + \frac{y^2}{4} = 1,$$
an ellipse. Solving $\cos t = \tfrac{x}{3}$ for $t$ with $\cos^{-1}$ would also work, but it only returns angles in $[0, \pi]$
and gets messy; the identity removes $t$ in one step.

### Example 2: an ellipse off the origin

Eliminate the parameter from $x = 1 + 3\cos t$, $y = -2 + 2\sin t$, $0 \le t \le 2\pi$, and describe the
curve and its orientation.

**Isolate the trig functions.** $\cos t = \tfrac{x - 1}{3}$ and $\sin t = \tfrac{y + 2}{2}$.

**Apply the identity.** Squaring and adding gives
$$\frac{(x - 1)^2}{9} + \frac{(y + 2)^2}{4} = 1.$$
This is an ellipse centered at $(1, -2)$, reaching 3 units left and right and 2 units up and down.

**Orientation.** At $t = 0$ the point is $(4, -2)$; at $t = \tfrac{\pi}{2}$ it is $(1, 0)$. Moving from the right end up to
the top means counterclockwise. Over $0 \le t \le 2\pi$ it goes around exactly once.

```plot
{"x": [-3, 5], "y": [-4.5, 0.8], "equal": true, "curves": [{"x": "1 + 3cos(t)", "y": "-2 + 2sin(t)", "t": [0, 6.2832]}], "points": [{"at": [4, -2], "label": "t = 0"}, {"at": [1, 0], "label": "t = π/2"}, {"at": [1, -2], "label": "center (1, −2)"}], "segments": [{"from": [3.476, -0.871], "to": [2.98, -0.497], "arrow": true}], "caption": "x = 1 + 3cos t, y = −2 + 2sin t: an ellipse traced counterclockwise"}
```

### Example 3: a hidden restriction

Eliminate the parameter from $x = \sin t$, $y = \cos 2t$ for all real $t$.

The double-angle formula $\cos 2t = 1 - 2\sin^2 t$ (Lesson 24) gives $y = 1 - 2x^2$. But $x = \sin t$ can never leave
$[-1, 1]$, so the curve is only the arch of that parabola with $-1 \le x \le 1$, and the point slides back and
forth along it forever as $t$ increases. The $xy$-equation alone would suggest the whole parabola.

```plot
{"x": [-2, 2], "y": [-2.5, 1.5], "equal": true, "functions": [{"f": "1 - 2x^2", "dashed": true, "label": "y = 1 − 2x²"}], "curves": [{"x": "sin(t)", "y": "cos(2t)", "t": [0, 6.2832]}], "points": [{"at": [-1, -1]}, {"at": [1, -1]}], "caption": "The parametric curve (solid) is only the part of the parabola with −1 ≤ x ≤ 1"}
```

## Writing parametric equations for a curve

Going the other way, a **parametrization** of a curve is a set of parametric equations that
traces it. A curve has many parametrizations, which can differ in starting point, direction
and speed, so a problem usually says where to start or which way to go. Four standard ones:

- **Graph of a function** $y = f(x)$: $x = t$, $y = f(t)$.
- **Line through** $P(x_1, y_1)$ and $Q(x_2, y_2)$: $x = x_1 + (x_2 - x_1)t$, $y = y_1 + (y_2 - y_1)t$. This is the vector
  idea from Lesson 32: start at $P$ and add $t$ copies of $\overrightarrow{PQ}$. It is at $P$ when $t = 0$ and at $Q$ when $t = 1$, so
  $0 \le t \le 1$ gives just the segment $PQ$.
- **Circle** with center $(h, k)$ and radius $r$: $x = h + r\cos t$, $y = k + r\sin t$, $0 \le t \le 2\pi$. It starts at $(h + r, k)$ and
  runs counterclockwise, because $(\cos t, \sin t)$ is the unit-circle point at angle $t$. For clockwise,
  use $y = k - r\sin t$.
- **Ellipse** $\tfrac{(x - h)^2}{a^2} + \tfrac{(y - k)^2}{b^2} = 1$: $x = h + a\cos t$, $y = k + b\sin t$.

Changing the speed changes the parametrization but not the curve: $x = \cos 2t$, $y = \sin 2t$ on $[0, 2\pi]$
traces the unit circle twice.

### Example 4: a segment and a circle

(a) Parametrize the segment from $(-2, 5)$ to $(4, 1)$, and find its midpoint from the
parametrization. (b) Parametrize the circle of radius 4 centered at $(2, -1)$, traced once
counterclockwise from its rightmost point.

**(a)** The change is $\langle 4 - (-2), 1 - 5\rangle = \langle 6, -4\rangle$, so
$$x = -2 + 6t, \qquad y = 5 - 4t, \qquad 0 \le t \le 1.$$
The midpoint is halfway in time, $t = \tfrac12$: $(-2 + 3, 5 - 2) = (1, 3)$. At $t = \tfrac14$ the point is $(-0.5, 4)$, one
quarter of the way along.

**(b)** $x = 2 + 4\cos t$, $y = -1 + 4\sin t$, $0 \le t \le 2\pi$. Check: $t = 0$ gives $(6, -1)$, the rightmost point, and
$(x - 2)^2 + (y + 1)^2 = 16(\cos^2 t + \sin^2 t) = 16$.

## Projectile motion

The most important application is **projectile motion**. Launch an object from height $h$ with
speed $v_0$ at angle $\theta$ above the horizontal, and ignore air resistance. Its initial velocity
vector has components $\langle v_0\cos\theta, v_0\sin\theta\rangle$ (Lesson 32). Nothing pushes it sideways, so the
horizontal velocity stays $v_0\cos\theta$. Gravity pulls it down with acceleration $g$, which subtracts
$\tfrac12 gt^2$ from the height after $t$ seconds. So
$$x = (v_0\cos\theta)\,t, \qquad y = h + (v_0\sin\theta)\,t - \tfrac12 g t^2,$$
with $g \approx 9.8$ m/s² (or $32$ ft/s², making the last term $16t^2$ in feet).

The parametric form answers "when" questions directly:

- It lands when $y = 0$; solve the quadratic in $t$ and keep the positive root. That time is the
  **time of flight**.
- It is highest when the vertical velocity $v_0\sin\theta - gt$ is zero, at $t = \tfrac{v_0\sin\theta}{g}$.
- To find the height when it is a given distance $d$ away, solve $x = d$ for $t$ first.

On level ground ($h = 0$), $y = 0$ gives $t = \tfrac{2v_0\sin\theta}{g}$, and then
$x = v_0\cos\theta \cdot \tfrac{2v_0\sin\theta}{g} = \tfrac{v_0^2\sin 2\theta}{g}$: the range formula from Lesson 24. Eliminating $t$ shows the path is a
parabola: $y = h + (\tan\theta)x - \tfrac{g}{2v_0^2\cos^2\theta}x^2$.

### Example 5: will it clear the fence?

A ball is hit from 1 m above the ground at 40 m/s, $35^\circ$ above the horizontal. A 10 m fence stands
140 m away. Use $g = 9.8$ m/s².

**Equations.** $v_0\cos 35^\circ \approx 32.766$ and $v_0\sin 35^\circ \approx 22.943$, so
$x = 32.766t$ and $y = 1 + 22.943t - 4.9t^2$.

**Maximum height.** At $t = \tfrac{22.943}{9.8} \approx 2.341$ s, $y \approx 1 + 22.943(2.341) - 4.9(2.341)^2 \approx 27.86$ m.

**At the fence.** $32.766t = 140$ gives $t \approx 4.273$ s. Then $y \approx 1 + 22.943(4.273) - 4.9(4.273)^2 \approx 9.57$ m.
That is below 10 m, so the ball hits the fence, just barely.

**Without the fence.** $4.9t^2 - 22.943t - 1 = 0$ gives
$t = \tfrac{22.943 + \sqrt{22.943^2 + 4(4.9)(1)}}{9.8} \approx 4.725$ s (the other root is negative), and then $x \approx 32.766(4.725) \approx 154.8$ m.

```plot
{"x": [0, 170], "y": [0, 32], "xLabel": "x (m)", "yLabel": "y (m)", "curves": [{"x": "32.766t", "y": "1 + 22.943t - 4.9t^2", "t": [0, 4.7254]}], "segments": [{"from": [140, 0], "to": [140, 10]}], "labels": [{"at": [155, 13], "text": "fence 10 m"}], "points": [{"at": [76.71, 27.86], "label": "top (76.7, 27.9)"}, {"at": [140, 9.57]}, {"at": [154.83, 0]}], "caption": "x = 32.766t, y = 1 + 22.943t − 4.9t²: the ball reaches x = 140 m at a height of 9.57 m and would land at 154.8 m"}
```

## Common mistakes

- **Dropping the restriction after eliminating.** $x = \sin t$, $y = \cos 2t$ is not the whole parabola
  $y = 1 - 2x^2$. Check what values $x$ and $y$ can actually take.
- **Forgetting that elimination loses information.** The $xy$-equation has no starting point,
  direction or speed. State the orientation separately.
- **Swapping sine and cosine in projectile motion.** With $\theta$ measured from the horizontal, the
  horizontal part is $v_0\cos\theta$ and the vertical part is $v_0\sin\theta$.
- **Writing $-gt^2$ instead of $-\tfrac12 gt^2$**, or mixing units: $4.9t^2$ goes with meters, $16t^2$ with feet.
- **Calculator in the wrong mode.** Launch angles are usually in degrees; trig parameters like
  $\cos t$ in a curve are in radians.
- **Expecting one right answer when parametrizing.** Many parametrizations are correct; match the
  starting point and direction the problem asks for.

## Key points

- Parametric equations $x = f(t)$, $y = g(t)$ describe a curve together with its direction of travel.
- Eliminate $t$ by solving and substituting, or with $\cos^2 t + \sin^2 t = 1$; keep any restriction on $x$ or $y$.
- Segment from $P$ to $Q$: $P + t\,\overrightarrow{PQ}$, $0 \le t \le 1$. Circle: $(h + r\cos t,\ k + r\sin t)$. Ellipse: $(h + a\cos t,\ k + b\sin t)$.
- Projectile: $x = (v_0\cos\theta)t$, $y = h + (v_0\sin\theta)t - \tfrac12 gt^2$; solve $y = 0$ for the time of flight.
