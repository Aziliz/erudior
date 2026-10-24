---
id: calc-h-cycloid-surface
module: calc-m11
honors: true
title: 'Surfaces from parametric curves, and the fastest slide'
minutes: 45
topics: [Parametric surface area, Cycloid descent]
drills: [calc-m11-r2-param-surface, calc-m11-r2-cycloid-time]
refs: [calc-ref-applications]
---
## Beyond length

Lesson 45 measured parametric curves: slopes from $\frac{dy/dt}{dx/dt}$ and lengths from $\int\sqrt{(x')^2 + (y')^2}\,dt$. Lesson 29 turned arc length into surface area for graphs $y = f(x)$. This honors lesson joins the two, so you can find the area of a surface swept out by a parametric or polar curve, and then uses the same arc-length element $ds$ to answer a famous seventeenth-century question: along which track does a bead slide from one point to a lower one in the least time? The answer, the cycloid, is the curve from Example 4 of Lesson 45, and it has a second surprising property that made it important to clockmakers.

## Surface area for parametric curves

Recall the idea from Lesson 29. A short piece of curve of length $ds$, at distance $y$ from the $x$-axis, sweeps out a thin band when it is rotated about that axis. Unrolled, the band is nearly a strip of length $2\pi y$ and width $ds$, so its area is about $2\pi y\,ds$. Nothing in that argument needs $y$ to be a function of $x$. For a curve $x = x(t)$, $y = y(t)$, $\alpha \le t \le \beta$,

$$ds = \sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2}\,dt,$$

and the area of the surface formed by rotating the curve about the $x$-axis is

$$S = 2\pi\int_\alpha^\beta y(t)\sqrt{x'(t)^2 + y'(t)^2}\,dt.$$

About the $y$-axis the radius is $x$ instead: $S = 2\pi\int x(t)\,ds$. Two conditions come with the formula, and both are easy to forget:

- the curve must stay on one side of the axis ($y \ge 0$ for the $x$-axis), because $y$ is a radius and a radius can't be negative;
- no part of the curve may be traced twice on $[\alpha, \beta]$, or its band is counted twice.

### Example 1 (the sphere again)

Rotate the upper half of the circle $x = R\cos t$, $y = R\sin t$, $0 \le t \le \pi$, about the $x$-axis.

The speed is $\sqrt{R^2\sin^2t + R^2\cos^2t} = R$, so $ds = R\,dt$ and
$$S = 2\pi\int_0^\pi R\sin t\cdot R\,dt = 2\pi R^2\Big[-\cos t\Big]_0^\pi = 4\pi R^2.$$
This matches Lesson 29, with less algebra: the parametric speed was constant, while the graph $y = \sqrt{R^2 - x^2}$ needed a messy derivative. If you had used $0 \le t \le 2\pi$, the lower half would contribute negative "radii" and the integral would come out 0, a clear signal that something is wrong.

## The cycloid up close

Let a wheel of radius $a$ roll without slipping along the $x$-axis, and follow a point $P$ on its rim that starts at the origin. After the wheel turns through an angle $t$ (in radians), the arc from the contact point $T$ back to $P$ has length $at$. Because the wheel doesn't slip, that arc has been laid down on the ground: $OT = at$. So the center is $C = (at, a)$, and $P$ sits at angle $t$ from straight down, turned back toward the origin:

$$x = a(t - \sin t), \qquad y = a(1 - \cos t).$$

![A wheel of radius a resting on the x-axis with center C and contact point T. A point P on the rim has turned through angle t from straight down. A red arc from T to P on the wheel and a red segment from O to T on the ground have equal length at. The blue path from O to P is the part of the cycloid traced so far; a dashed curve shows the rest of the arch.](images/calc-m11-rolling-circle.svg)

Differentiate: $x' = a(1 - \cos t)$ and $y' = a\sin t$. Using $1 - \cos t = 2\sin^2\frac t2$ and $\sin t = 2\sin\frac t2\cos\frac t2$,

$$\text{speed} = \sqrt{a^2(1 - \cos t)^2 + a^2\sin^2t} = a\sqrt{2 - 2\cos t} = 2a\left\lvert\sin\tfrac t2\right\rvert, \qquad \frac{dy}{dx} = \frac{\sin t}{1 - \cos t} = \cot\frac t2.$$

Three facts follow. If $t$ is time (the wheel turns at 1 radian per unit time), the center moves at speed $a$, but $P$ moves at $0$ when it touches the ground ($t = 0, 2\pi$) and at $2a$ at the top ($t = \pi$): the bottom of a rolling wheel is momentarily at rest. At $t = 2\pi$ both $x'$ and $y'$ are 0, the case Lesson 45 said to investigate with a limit. As $t \to 2\pi^-$, $\cot\frac t2 \to -\infty$, and as $t \to 2\pi^+$, $\cot\frac t2 \to +\infty$, so the curve arrives going straight down and leaves going straight up: a cusp with a vertical tangent. Finally, one arch has length $8a$ (Lesson 45 did $a = 1$).

### Example 2 (rotating a cycloid arch)

Find the area of the surface formed by rotating one arch of the cycloid with $a = 1$ about the $x$-axis.

Here $y = 1 - \cos t = 2\sin^2\frac t2$ and $ds = 2\sin\frac t2\,dt$ (no absolute value is needed, since $\sin\frac t2 \ge 0$ on $[0, 2\pi]$). So
$$S = 2\pi\int_0^{2\pi}2\sin^2\tfrac t2\cdot2\sin\tfrac t2\,dt = 8\pi\int_0^{2\pi}\sin^3\tfrac t2\,dt.$$
Let $u = \frac t2$, $dt = 2\,du$, and $u$ runs from 0 to $\pi$:
$$S = 16\pi\int_0^\pi\sin^3u\,du = 16\pi\int_0^\pi(1 - \cos^2u)\sin u\,du = 16\pi\Big[-\cos u + \tfrac13\cos^3u\Big]_0^\pi = 16\pi\cdot\tfrac43 = \frac{64\pi}{3} \approx 67.02.$$
For a wheel of radius $a$ every length is multiplied by $a$, so every area is multiplied by $a^2$: $S = \frac{64\pi a^2}{3}$.

## Surface area for polar curves

A polar curve $r = f(\theta)$ is the parametric curve $x = r\cos\theta$, $y = r\sin\theta$ with parameter $\theta$, and Lesson 46 showed $ds = \sqrt{r^2 + (r')^2}\,d\theta$. Rotating about the polar axis (the $x$-axis):

$$S = 2\pi\int_\alpha^\beta r\sin\theta\,\sqrt{r^2 + \left(\frac{dr}{d\theta}\right)^2}\,d\theta,$$

with the same two conditions: $r\sin\theta \ge 0$ on the interval, and nothing traced twice.

### Example 3 (a cardioid surface)

Rotate the upper half of the cardioid $r = 1 + \cos\theta$, $0 \le \theta \le \pi$, about the polar axis.

Lesson 46 found $r^2 + (r')^2 = 2 + 2\cos\theta = 4\cos^2\frac\theta2$, so $ds = 2\cos\frac\theta2\,d\theta$ on $[0, \pi]$. With half-angle identities, $1 + \cos\theta = 2\cos^2\frac\theta2$ and $\sin\theta = 2\sin\frac\theta2\cos\frac\theta2$, the radius of rotation is
$$y = r\sin\theta = 4\cos^3\tfrac\theta2\sin\tfrac\theta2.$$
Then
$$S = 2\pi\int_0^\pi4\cos^3\tfrac\theta2\sin\tfrac\theta2\cdot2\cos\tfrac\theta2\,d\theta = 16\pi\int_0^\pi\cos^4\tfrac\theta2\sin\tfrac\theta2\,d\theta.$$
Let $u = \cos\frac\theta2$, $du = -\frac12\sin\frac\theta2\,d\theta$; $u$ runs from 1 down to 0:
$$S = 16\pi\cdot2\int_0^1u^4\,du = \frac{32\pi}{5} \approx 20.11.$$
The surface looks like an apple, with the dimple where the cardioid's cusp sits at the origin.

## The fastest slide: the brachistochrone

In June 1696 Johann Bernoulli challenged the mathematicians of Europe in the journal *Acta Eruditorum*: given two points $A$ and $B$, with $B$ lower but not directly below $A$, find the track along which a bead, starting from rest and pulled only by gravity, slides from $A$ to $B$ in the least time. This is the **brachistochrone** problem (Greek *brachistos*, shortest, and *chronos*, time). Jakob Bernoulli, Leibniz and Newton were among those who sent solutions. The answer is an upside-down cycloid with its cusp at $A$.

Proving that no other track is faster needs the calculus of variations, which is beyond this course. What we can do is compute the time on the cycloid and compare it with other tracks. Two physics facts are needed, both assuming no friction or air resistance:

- *Speed from height.* A bead that starts from rest and has dropped a vertical distance $h$ has speed $v = \sqrt{2gh}$, whatever the shape of the track (conservation of energy: $\frac12mv^2 = mgh$).
- *Time from speed.* Time is distance over speed, piece by piece: $dT = \frac{ds}{v}$, so $T = \int\frac{ds}{v}$.

Turn the cycloid over: $x = a(t - \sin t)$, $y = -a(1 - \cos t)$, starting at the cusp $(0, 0)$ when $t = 0$ and reaching the lowest point $(\pi a, -2a)$ when $t = \pi$. Here $t$ is just the parameter, not time. The depth below the start is $a(1 - \cos t) = 2a\sin^2\frac t2$, so
$$v = \sqrt{2g\cdot2a\sin^2\tfrac t2} = 2\sqrt{ga}\,\sin\tfrac t2, \qquad ds = 2a\sin\tfrac t2\,dt.$$
The sines cancel, and
$$dT = \frac{2a\sin\frac t2}{2\sqrt{ga}\sin\frac t2}\,dt = \sqrt{\frac ag}\,dt, \qquad T = \int_0^\pi\sqrt{\frac ag}\,dt = \pi\sqrt{\frac ag}.$$

### Example 4 (three tracks compared)

A bead slides from $(0, 0)$ to $(\pi a, -2a)$. Compare three frictionless tracks.

```plot
{"x": [-0.4, 3.6], "y": [-2.5, 0.5], "equal": true, "curves": [{"x": "t - sin(t)", "y": "-(1 - cos(t))", "t": [0, "pi"]}], "segments": [{"from": [0, 0], "to": [3.1416, -2], "dashed": true}, {"from": [0, 0], "to": [0, -2]}, {"from": [0, -2], "to": [3.1416, -2]}], "points": [{"at": [0, 0], "label": "start"}, {"at": [3.1416, -2], "label": "end"}], "labels": [{"at": [0.7, -1.8], "text": "cycloid"}, {"at": [2.1, -0.8], "text": "straight line"}, {"at": [1.6, -2.35], "text": "drop, then slide"}], "caption": "Three tracks with a = 1: cycloid (curve), straight line (dashed), and drop-then-slide (down the y-axis, then along y = −2)"}
```

- *Cycloid:* $T = \pi\sqrt{a/g} \approx 3.142\sqrt{a/g}$.
- *Straight line:* its length is $L = a\sqrt{\pi^2 + 4}$, and the acceleration along a ramp is the constant $g\sin\alpha$, where $\sin\alpha = \frac{2a}{L}$. From $L = \frac12(g\sin\alpha)T^2$: $T = \sqrt{\frac{2L}{g\sin\alpha}} = \sqrt{\frac{L^2}{ag}} = \sqrt{\pi^2 + 4}\,\sqrt{a/g} \approx 3.724\sqrt{a/g}$.
- *Drop, then slide:* falling $2a$ straight down takes $\sqrt{2\cdot2a/g} = 2\sqrt{a/g}$ and ends at speed $\sqrt{2g\cdot2a} = 2\sqrt{ga}$. If the corner is rounded so the bead keeps that speed (an idealization), sliding $\pi a$ along the bottom takes $\frac{\pi a}{2\sqrt{ga}} = \frac\pi2\sqrt{a/g}$. Total: $\left(2 + \frac\pi2\right)\sqrt{a/g} \approx 3.571\sqrt{a/g}$.

With $a = 1$ m and $g = 9.8$ m/s², the times are about 1.004 s, 1.190 s and 1.141 s. The straight line, the shortest path, is the *slowest* of the three. A steep start builds speed early, and that speed is used over the whole trip; the cycloid balances building speed against path length best.

## Equal times from anywhere: the tautochrone

The upside-down cycloid has a second property. Release the bead from rest at *any* point of the arch, not just the cusp, and it reaches the bottom in the same time $\pi\sqrt{a/g}$. A curve with this property is called a **tautochrone** (*tauto*, same). Christiaan Huygens published this result in 1673 in his book on pendulum clocks, because a pendulum whose bob moves along a cycloid keeps the same period whether it swings widely or narrowly, while an ordinary circular pendulum does so only approximately, for small swings.

### Example 5 (proving the equal-time property)

Start from rest at parameter $t_0$ ($0 < t_0 < \pi$). At a later parameter $t$ the bead has dropped $a(1 - \cos t) - a(1 - \cos t_0) = a(\cos t_0 - \cos t)$, so $v^2 = 2ga(\cos t_0 - \cos t)$. Using $\cos t = 2\cos^2\frac t2 - 1$ and writing $c_0 = \cos\frac{t_0}2$:
$$v = 2\sqrt{ga}\,\sqrt{c_0^2 - \cos^2\tfrac t2}, \qquad T = \int_{t_0}^{\pi}\frac{2a\sin\frac t2}{2\sqrt{ga}\sqrt{c_0^2 - \cos^2\frac t2}}\,dt.$$
Substitute $u = \cos\frac t2$, $du = -\frac12\sin\frac t2\,dt$; as $t$ goes from $t_0$ to $\pi$, $u$ goes from $c_0$ to 0:
$$T = 2\sqrt{\frac ag}\int_0^{c_0}\frac{du}{\sqrt{c_0^2 - u^2}} = 2\sqrt{\frac ag}\Big[\arcsin\frac{u}{c_0}\Big]_0^{c_0} = 2\sqrt{\frac ag}\cdot\frac\pi2 = \pi\sqrt{\frac ag}.$$
The starting point $c_0$ cancels completely. (The integrand blows up at $u = c_0$, where the bead starts at rest, so this is an improper integral; it converges, as the arcsine shows.) A bead released lower moves more slowly but has less distance to cover, and on a cycloid the two effects cancel exactly.

## Common mistakes

- **Using $dx$ or $dt$ instead of $ds$.** The band's width is the slanted length $ds = \sqrt{(x')^2 + (y')^2}\,dt$.
- **Letting the radius go negative or tracing twice.** Rotating a full circle with $0 \le t \le 2\pi$ gives 0, not $4\pi R^2$; use the upper half only.
- *Dropping the absolute value carelessly.* $\sqrt{4\sin^2\frac t2} = 2\lvert\sin\frac t2\rvert$; it equals $2\sin\frac t2$ only where the sine is nonnegative.
- **Treating the parameter as time.** In the descent problem $t$ is the wheel angle; the travel time comes from $\int ds/v$.
- *Using constant-acceleration formulas on a curve.* They hold on a straight ramp only; on a curve the acceleration along the track keeps changing.
- *Forgetting how area scales.* Doubling the wheel radius multiplies lengths by 2 and surface areas by 4, but times only by $\sqrt2$.

## Key points

- Surface area about the $x$-axis: $S = 2\pi\int y\,ds$ with $ds = \sqrt{(x')^2 + (y')^2}\,dt$ (parametric) or $\sqrt{r^2 + (r')^2}\,d\theta$ (polar, with $y = r\sin\theta$). About the $y$-axis use radius $x$.
- Check that the radius is never negative and that nothing is traced twice.
- Cycloid $x = a(t - \sin t)$, $y = a(1 - \cos t)$: speed $2a\lvert\sin\frac t2\rvert$, slope $\cot\frac t2$, vertical tangents at the cusps, arch length $8a$, surface area of a rotated arch $\frac{64\pi a^2}{3}$.
- Frictionless descent: $v = \sqrt{2gh}$ and $T = \int\frac{ds}{v}$.
- The upside-down cycloid is the brachistochrone (fastest track) and the tautochrone (equal times from any start), with descent time $\pi\sqrt{a/g}$.
