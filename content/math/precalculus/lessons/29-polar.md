---
id: pc-polar
module: pc-m7
title: Polar coordinates and polar graphs
minutes: 35
topics: [Polar coordinates]
drills: [pc-polar-to-rect, pc-rect-to-polar]
refs: [pc-ref-conics-polar]
---
## A different way to locate points

Rectangular coordinates say "go $x$ across and $y$ up." **Polar coordinates** say "face direction $\theta$ and walk distance $r$." Radar screens, sonar, antenna patterns and anything with rotational symmetry are much simpler in polar form: a circle centered at the origin is just $r = 3$. This lesson sets up polar coordinates using the unit circle from Module 5, converts between the two systems, and graphs the classic polar curves. The next lesson writes all three conics in a single polar equation.

## Polar coordinates

Fix a point $O$, the **pole** (the origin), and a ray from it, the **polar axis** (the positive $x$-axis). A point $P$ has polar coordinates $(r, \theta)$ when $\theta$ is the angle from the polar axis to the ray $OP$ and $r$ is the distance $OP$.

Two differences from rectangular coordinates:

- *Many names for one point.* Adding $2\pi$ to $\theta$ gives the same point: $(3, \frac{\pi}{4}) = (3, \frac{9\pi}{4})$.
- *Negative $r$.* $(-r, \theta)$ means go distance $r$ in the *opposite* direction, $\theta + \pi$. So $(-3, \frac{\pi}{4}) = (3, \frac{5\pi}{4})$.

The pole is $(0, \theta)$ for any $\theta$.

## Converting between systems

From the unit circle (scaled by $r$):

$$x = r\cos\theta, \qquad y = r\sin\theta,$$

$$r^2 = x^2 + y^2, \qquad \tan\theta = \frac{y}{x} \ (x \ne 0).$$

Going from rectangular to polar, $\tan\theta = \frac yx$ doesn't pin down the quadrant (it has period $\pi$), so always check which quadrant $(x, y)$ is in.

```plot
{"x": [-4.5, 2], "y": [-1, 3.5], "equal": true, "segments": [{"from": [0, 0], "to": [-3.464, 2], "label": "r = 4"}, {"from": [-3.464, 0], "to": [-3.464, 2], "dashed": true}], "points": [{"at": [-3.464, 2], "label": "(4, 5π/6) = (−2√3, 2)"}], "curves": [{"x": "0.6cos(t)", "y": "0.6sin(t)", "t": [0, 2.618]}], "labels": [{"at": [0.5, 0.75], "text": "θ = 5π/6"}], "caption": "Polar (4, 5π/6) is rectangular (4 cos 5π/6, 4 sin 5π/6) = (−2√3, 2)."}
```

### Example 1

Convert $(4, \frac{5\pi}{6})$ to rectangular coordinates.

$x = 4\cos\frac{5\pi}{6} = 4\left(-\frac{\sqrt3}{2}\right) = -2\sqrt3 \approx -3.46$ and $y = 4\sin\frac{5\pi}{6} = 4\cdot\frac12 = 2$.

### Example 2

Convert $(-2, 2)$ to polar coordinates with $r > 0$ and $0 \le \theta < 2\pi$.

$r = \sqrt{4 + 4} = 2\sqrt2$. $\tan\theta = \frac{2}{-2} = -1$. The calculator's $\tan^{-1}(-1) = -\frac{\pi}{4}$ points into Quadrant IV, but $(-2, 2)$ is in Quadrant II, so $\theta = \frac{3\pi}{4}$. Answer: $(2\sqrt2, \frac{3\pi}{4})$.

## Converting equations

Replace $x$ and $y$ with $r\cos\theta$ and $r\sin\theta$ (or the reverse, often after multiplying by $r$ to create $r^2$, $r\cos\theta$, $r\sin\theta$).

### Example 3

Write $r = 6\sin\theta$ in rectangular form and identify the graph.

Multiply by $r$: $r^2 = 6r\sin\theta$, so $x^2 + y^2 = 6y$. Complete the square: $x^2 + (y - 3)^2 = 9$. A circle with center $(0, 3)$ and radius 3. (Multiplying by $r$ could add the pole as a solution, but the pole is already on this circle.)

In the other direction, the line $x = 4$ becomes $r\cos\theta = 4$, i.e. $r = 4\sec\theta$, and the circle $x^2 + y^2 = 25$ becomes simply $r = 5$.

## Graphing polar equations

A polar graph $r = f(\theta)$ is plotted by sweeping $\theta$ around and marking distance $r$ in each direction. Tables of values and symmetry help. Some families to recognize:

| Equation | Graph |
|---|---|
| $r = a$ | circle of radius $\lvert a \rvert$ centered at the pole |
| $\theta = \alpha$ | line through the pole |
| $r = 2a\cos\theta$, $r = 2a\sin\theta$ | circles through the pole |
| $r = a + b\cos\theta$ (or $\sin\theta$) | **limaçon**; a **cardioid** when $\lvert a \rvert = \lvert b \rvert$ |
| $r = a\cos(n\theta)$ or $a\sin(n\theta)$, integer $n \ge 2$ | **rose curve**: $n$ petals if $n$ is odd, $2n$ if $n$ is even |
| $r = a\theta$ | spiral |

Symmetry tests: replacing $\theta$ by $-\theta$ without changing the equation means symmetry about the polar axis (true for any function of $\cos\theta$).

### Example 4

Graph the cardioid $r = 2 + 2\cos\theta$.

| $\theta$ | $0$ | $\frac{\pi}{2}$ | $\pi$ | $\frac{3\pi}{2}$ | $2\pi$ |
|---|---|---|---|---|---|
| $r$ | $4$ | $2$ | $0$ | $2$ | $4$ |

It starts 4 units to the right, shrinks to 0 at $\theta = \pi$ (the dimple at the pole), and grows back, symmetric about the polar axis.

```plot
{"x": [-2.5, 5], "y": [-3.5, 3.5], "equal": true, "curves": [{"x": "(2 + 2cos(t))cos(t)", "y": "(2 + 2cos(t))sin(t)", "t": [0, "2pi"]}, {"x": "3cos(2t)cos(t)", "y": "3cos(2t)sin(t)", "t": [0, "2pi"], "dashed": true}], "points": [{"at": [4, 0], "label": "(4, 0)"}], "caption": "The cardioid r = 2 + 2 cos θ (solid) and the four-petal rose r = 3 cos 2θ (dashed)."}
```

### Example 5

How many petals does $r = 3\cos 2\theta$ have, and how long are they?

$n = 2$ is even, so there are $2n = 4$ petals, each of length 3 (the maximum of $|r|$). The petals point along $\theta = 0, \frac{\pi}{2}, \pi, \frac{3\pi}{2}$, where $|\cos 2\theta| = 1$. (For $r = 3\cos 3\theta$, odd $n = 3$, there would be 3 petals.)

### Example 6

Write $r = \dfrac{2}{1 - \cos\theta}$ in rectangular form.

Clear the fraction: $r - r\cos\theta = 2$. Replace $r\cos\theta$ with $x$ and isolate $r$: $r = 2 + x$. Square, and replace $r^2$ with $x^2 + y^2$:

$$x^2 + y^2 = 4 + 4x + x^2 \implies y^2 = 4x + 4 = 4(x + 1).$$

That is a parabola opening right with vertex $(-1, 0)$ and $p = 1$, so its focus is at the origin, the pole. Squaring can introduce extra points, so it's worth checking: every point of $y^2 = 4(x + 1)$ has $x \ge -1$, so $2 + x > 0$ and $r = 2 + x$ is a legitimate distance. This "conic with a focus at the pole" is exactly the pattern the next lesson develops.

## Complex numbers in polar form, briefly

Plot the complex number $z = x + yi$ as the point $(x, y)$. Its polar coordinates give the **polar form of a complex number**:

$$z = r(\cos\theta + i\sin\theta), \qquad r = |z| = \sqrt{x^2 + y^2},$$

where $r$ is called the modulus and $\theta$ the argument. The payoff is multiplication: using the sum identities for sine and cosine, multiplying two complex numbers in polar form *multiplies their moduli and adds their arguments*. Repeating that gives **De Moivre's theorem**, $z^n = r^n(\cos n\theta + i\sin n\theta)$ for positive integers $n$.

### Example 7

Find $(1 + i)^8$.

$1 + i$ is the point $(1, 1)$: $r = \sqrt2$ and $\theta = \frac{\pi}{4}$. By De Moivre's theorem, $(1 + i)^8 = (\sqrt2)^8\left(\cos 2\pi + i\sin 2\pi\right) = 16(1 + 0i) = 16$. Expanding $(1 + i)^8$ with the binomial theorem gives the same answer, much more slowly.

## Common mistakes

- *Wrong quadrant from $\tan^{-1}$.* Check where $(x, y)$ lies and adjust by $\pi$.
- *Forgetting that negative $r$ points backward.*
- *Treating $(r, \theta)$ as unique.* Many polar pairs name the same point.
- *Rose petal count.* Odd $n$: $n$ petals; even $n$: $2n$.
- *Degree/radian mix-ups* in conversions; be consistent.

## Key points

- $x = r\cos\theta$, $y = r\sin\theta$; $r^2 = x^2 + y^2$, $\tan\theta = \frac yx$ (check the quadrant).
- $(r, \theta) = (r, \theta + 2\pi) = (-r, \theta + \pi)$.
- Convert equations by substituting, often after multiplying by $r$.
- Recognize circles, lines, limaçons, cardioids, roses and spirals.
- Plot with a table over $0 \le \theta \le 2\pi$ and use symmetry.
- A complex number in polar form is $r(\cos\theta + i\sin\theta)$; De Moivre: $z^n = r^n(\cos n\theta + i\sin n\theta)$.
