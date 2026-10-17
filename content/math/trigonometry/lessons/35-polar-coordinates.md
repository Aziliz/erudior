---
id: trig-polar
module: trig-m9
title: Polar coordinates
minutes: 35
topics: [Polar coordinates]
drills: [trig-d-polar-to-rect, trig-d-rect-to-polar]
refs: [trig-ref-triangles]
---
## Locating points by distance and direction

Rectangular coordinates locate a point by how far right and how far up it is. A radar
screen, a lighthouse keeper or a ship's navigator locates it differently: how far away,
and in which direction. That is the idea of polar coordinates. Converting between the two
systems is exactly the conversion between a vector's components and its magnitude and
direction from the last module, so the trigonometry is already familiar.

## The polar system

Choose a point $O$, the **pole** (the origin), and a ray from it, the **polar axis** (the
positive $x$-axis). A point $P$ has **polar coordinates** $(r, \theta)$ if it is reached by rotating
the polar axis through the angle $\theta$ and then moving a directed distance $r$ along that ray.
Positive $\theta$ is counterclockwise, as usual.

```plot
{"x": [-3.5, 3.5], "y": [-3.5, 3.5], "equal": true, "circles": [{"center": [0, 0], "r": 1}, {"center": [0, 0], "r": 2}, {"center": [0, 0], "r": 3}], "segments": [{"from": [0, 0], "to": [2.1213, 2.1213]}, {"from": [0, 0], "to": [1, -1.7321], "dashed": true}, {"from": [0, 0], "to": [1.7321, 1], "dashed": true}], "points": [{"at": [2.1213, 2.1213], "label": "(3, π/4)"}, {"at": [1, -1.7321], "label": "(2, −π/3)"}, {"at": [-1.7321, -1], "label": "(−2, π/6)"}], "caption": "Points in polar coordinates; circles mark r = 1, 2, 3"}
```

**Negative $r$.** If $r < 0$, move $|r|$ units in the *opposite* direction, along the ray $\theta + \pi$. So
$(-2, \tfrac{\pi}{6})$ is in quadrant III: face $\tfrac{\pi}{6}$, then back up 2 units.

## Many names for one point

In rectangular coordinates every point has exactly one name. In polar coordinates every
point has infinitely many, because adding full turns doesn't change the direction and
flipping the sign of $r$ is the same as turning a half turn:
$$(r, \theta) = (r, \theta + 2k\pi) = (-r, \theta + \pi + 2k\pi).$$
The pole is $(0, \theta)$ for every $\theta$.

### Example 1

Give three other polar representations of $\left(3, \tfrac{\pi}{4}\right)$: one with $\theta > 2\pi$, one with $\theta < 0$ and
$r > 0$, and one with $r < 0$.

$\left(3, \tfrac{9\pi}{4}\right)$; $\left(3, -\tfrac{7\pi}{4}\right)$; $\left(-3, \tfrac{5\pi}{4}\right)$.

## Polar to rectangular

The point at distance $r$ and angle $\theta$ is, by the definitions of sine and cosine,

$$x = r\cos\theta, \qquad y = r\sin\theta.$$

These hold for negative $r$ too, since $(-r)\cos\theta = r\cos(\theta + \pi)$.

### Example 2

Convert $\left(4, \tfrac{2\pi}{3}\right)$ and $\left(-2, \tfrac{\pi}{6}\right)$ to rectangular coordinates.

$x = 4\cos\tfrac{2\pi}{3} = 4\left(-\tfrac12\right) = -2$, $y = 4\sin\tfrac{2\pi}{3} = 4\cdot\tfrac{\sqrt3}{2} = 2\sqrt3$. So $(-2, 2\sqrt3)$.

$x = -2\cos\tfrac{\pi}{6} = -\sqrt3$, $y = -2\sin\tfrac{\pi}{6} = -1$. So $(-\sqrt3, -1)$, in quadrant III as predicted.

## Rectangular to polar

From the same right triangle:
$$r^2 = x^2 + y^2, \qquad \tan\theta = \frac{y}{x}\ (x \ne 0).$$

Taking $r = \sqrt{x^2 + y^2} \ge 0$, you must choose $\theta$ in the quadrant of $(x, y)$. The calculator's
$\tan^{-1}\tfrac{y}{x}$ only returns angles between $-\tfrac{\pi}{2}$ and $\tfrac{\pi}{2}$, which is right for quadrants I and IV
and wrong (off by $\pi$) for quadrants II and III. Points on an axis are read off directly.

### Example 3

Convert $(-3, 3)$, $(2\sqrt3, -2)$ and $(-1, -\sqrt3)$ to polar coordinates with $r > 0$ and
$0 \le \theta < 2\pi$.

**$(-3, 3)$:** $r = \sqrt{9 + 9} = 3\sqrt2$. Quadrant II; reference angle $\tfrac{\pi}{4}$; $\theta = \tfrac{3\pi}{4}$.
So $\left(3\sqrt2, \tfrac{3\pi}{4}\right)$. (The calculator would give $\tan^{-1}(-1) = -\tfrac{\pi}{4}$, the wrong quadrant.)

**$(2\sqrt3, -2)$:** $r = \sqrt{12 + 4} = 4$. Quadrant IV; $\tan\theta = -\tfrac{1}{\sqrt3}$, reference angle $\tfrac{\pi}{6}$;
$\theta = \tfrac{11\pi}{6}$. So $\left(4, \tfrac{11\pi}{6}\right)$.

**$(-1, -\sqrt3)$:** $r = 2$. Quadrant III; reference angle $\tfrac{\pi}{3}$; $\theta = \pi + \tfrac{\pi}{3} = \tfrac{4\pi}{3}$.

### Example 4: a non-special angle

Convert $(-5, 2)$ to polar form, $\theta$ in radians to four decimals.

$r = \sqrt{29} \approx 5.3852$. Quadrant II. $\tan^{-1}\!\left(\tfrac{2}{-5}\right) \approx -0.3805$ is in quadrant IV, so add $\pi$:
$\theta \approx 2.7611$.

## Converting equations

The same substitutions turn equations from one system into the other:

- $r = 5$ means $x^2 + y^2 = 25$, a circle.
- $\theta = \tfrac{\pi}{3}$ means the line $y = \sqrt3\,x$.
- $x = 4$ becomes $r\cos\theta = 4$, or $r = 4\sec\theta$.
- $r = 6\cos\theta$: multiply by $r$ to get $r^2 = 6r\cos\theta$, i.e. $x^2 + y^2 = 6x$, which is the
  circle $(x - 3)^2 + y^2 = 9$.

The next lesson graphs equations that are much simpler in polar form than in
rectangular form.

### Example 5: converting equations both ways

Convert $r = 4\sin\theta$ to rectangular form, and $y = x^2$ to polar form.

**$r = 4\sin\theta$.** Multiply by $r$: $r^2 = 4r\sin\theta$, so $x^2 + y^2 = 4y$. Completing the square gives
$x^2 + (y - 2)^2 = 4$, a circle of radius 2 centered at $(0, 2)$.

**$y = x^2$.** Substitute: $r\sin\theta = r^2\cos^2\theta$. Divide by $r$ (the pole is on the curve anyway):
$\sin\theta = r\cos^2\theta$, so $r = \dfrac{\sin\theta}{\cos^2\theta} = \tan\theta\sec\theta$. Some curves are simpler in rectangular
form, and that's fine: choose whichever system makes the problem easier.

## Why polar coordinates are useful

Anything with rotational symmetry is simpler in polar form: circles centered at the
origin, radar sweeps, planetary orbits, antenna radiation patterns. Lesson 38 applies the
same idea to complex numbers.

## Common mistakes

- **Trusting $\tan^{-1}$ for $\theta$.** Check the quadrant of $(x, y)$.
- **Forgetting that negative $r$ points backward.** $(-2, \tfrac{\pi}{6})$ is in quadrant III, not I.
- **Degree/radian mix-ups.** Polar work is usually in radians.
- **Thinking a polar point has one name.** $(3, \tfrac{\pi}{4})$, $(3, \tfrac{9\pi}{4})$ and $(-3, \tfrac{5\pi}{4})$ are the same point.

## Key points

- $(r, \theta)$: rotate by $\theta$, then move $r$ (backward if $r < 0$).
- $x = r\cos\theta$, $y = r\sin\theta$; $r^2 = x^2 + y^2$, $\tan\theta = \tfrac{y}{x}$ with the quadrant checked.
- $(r, \theta) = (r, \theta + 2k\pi) = (-r, \theta + \pi)$.
- Substitute $x = r\cos\theta$, $y = r\sin\theta$, $x^2 + y^2 = r^2$ to convert equations.
