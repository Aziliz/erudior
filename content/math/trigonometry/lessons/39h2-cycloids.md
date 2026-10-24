---
id: trig-m9-h-cycloids
module: trig-m9
title: Cycloids and rolling curves
minutes: 45
honors: true
topics: [Rolling curves]
drills: [trig-m9-r2-cycloid-point, trig-m9-r2-roulette]
refs: [trig-ref-triangles]
---
Lesson 37 wrote a circle as $x = h + r\cos t$, $y = k + r\sin t$ and a moving object as a pair of functions of time. Put the two ideas together and let the circle itself move: roll a wheel along the ground and follow one point on its rim. The path is not a circle and not a parabola. It is a **cycloid**, a curve that puzzled and delighted mathematicians for a century and that turns out to be fastest, in a precise sense, for a sliding bead. This lesson derives its parametric equations with the tools you already have (arc length, vector addition and the unit circle), then rolls circles on other circles to get a whole family of curves, including the cardioid of Lesson 36.

## Deriving the cycloid

A wheel of radius $a$ rolls to the right along the $x$-axis without slipping. A point $P$ on the rim starts at the origin, touching the ground. Let $t$ be the angle (in radians) the wheel has turned.

**Where is the center?** Rolling without slipping means the length of ground covered equals the length of rim that has touched it. That arc is $s = at$ (Lesson 3: arc length is radius times angle). So the center is at $C = (at, a)$, and the point of contact is $T = (at, 0)$.

**Where is $P$ relative to the center?** At the start, $P$ is straight below $C$. Rolling to the right turns the wheel clockwise, so after turning through $t$ the vector from $C$ to $P$ has rotated $t$ clockwise from straight down:
$$\overrightarrow{CP} = \langle -a\sin t,\ -a\cos t\rangle.$$
(Check: $t = 0$ gives $\langle 0, -a\rangle$, straight down; $t = \tfrac{\pi}{2}$ gives $\langle -a, 0\rangle$, a quarter turn clockwise from down is to the left.)

**Add the vectors** (Lesson 32): $P = C + \overrightarrow{CP}$, so
$$x = a(t - \sin t), \qquad y = a(1 - \cos t).$$

![A wheel of radius a rolling to the right along the ground. Its center C is at (at, a) and its point of contact T is at (at, 0). The ground from the starting point O to T and the arc of the wheel from T to the tracing point P are both highlighted, since they have the same length at. The angle t at the center between CT and CP is marked. The part of the cycloid already traced runs from O to P, and the rest of the arch is dashed.](images/trig-m9-rolling-circle.svg)

One full turn, $0 \le t \le 2\pi$, traces one arch: it starts and ends on the ground, $2\pi a$ apart (one circumference), and reaches its greatest height $2a$ at $t = \pi$, when $P$ is at the top of the wheel. The points where $P$ touches the ground are sharp points called **cusps**: there the point stops for an instant and reverses its vertical direction.

```plot
{"x": [-1, 20], "y": [-0.5, 4.5], "equal": true, "curves": [{"x": "1.5(t - sin(t))", "y": "1.5(1 - cos(t))", "t": [0, 12.566], "label": "cycloid, a = 1.5"}, {"x": "1.5*4.2 + 1.5cos(t)", "y": "1.5 + 1.5sin(t)", "t": [0, 6.2832], "dashed": true}], "points": [{"at": [0, 0], "label": "cusp"}, {"at": [9.4248, 0], "label": "cusp"}, {"at": [4.7124, 3], "label": "top (πa, 2a)"}], "caption": "Two arches of a cycloid with a = 1.5: each arch is 2πa ≈ 9.42 wide and 2a = 3 high"}
```

### Example 1: a pebble in a tire

A bicycle wheel of radius 30 cm picks up a pebble at its lowest point. Where is the pebble after the wheel turns $90^\circ$, $120^\circ$ and $180^\circ$?

Convert to radians and use $x = 30(t - \sin t)$, $y = 30(1 - \cos t)$.

- $t = \tfrac{\pi}{2}$: $x = 30\left(\tfrac{\pi}{2} - 1\right) \approx 17.12$ cm, $y = 30(1 - 0) = 30$ cm.
- $t = \tfrac{2\pi}{3}$: $x = 30\left(\tfrac{2\pi}{3} - \tfrac{\sqrt3}{2}\right) \approx 36.85$ cm, $y = 30\left(1 + \tfrac12\right) = 45$ cm.
- $t = \pi$: $x = 30\pi \approx 94.25$ cm, $y = 60$ cm, the top of the arch.

Notice the uneven spacing. In the first quarter turn the bike moves $30 \cdot \tfrac{\pi}{2} \approx 47.1$ cm, but the pebble moves forward only 17.1 cm; it is mostly lifted. Near the top it moves forward faster than the bike. A point on a rolling wheel travels at a speed that changes with its position, which is why the spokes at the top of a moving wheel in a photo blur while those at the bottom look sharp.

## Points inside or outside the rim

If the tracing point is at distance $b$ from the center instead of on the rim, the same derivation with $\overrightarrow{CP} = \langle -b\sin t, -b\cos t\rangle$ gives a **trochoid**:
$$x = at - b\sin t, \qquad y = a - b\cos t.$$

- $b < a$ (a reflector on a spoke): a wavy curve that never touches the ground.
- $b = a$: the cycloid.
- $b > a$: the point is below the rolling surface at the bottom of each turn, and the curve has loops.

```plot
{"x": [-1, 14], "y": [-1.2, 4.8], "equal": true, "curves": [{"x": "t - 0.5sin(t)", "y": "1 - 0.5cos(t)", "t": [0, 12.566], "label": "b = 0.5a"}, {"x": "t - 1.8sin(t)", "y": "1 - 1.8cos(t)", "t": [0, 12.566], "dashed": true, "label": "b = 1.8a"}], "segments": [{"from": [-1, 0], "to": [14, 0]}], "caption": "Trochoids with a = 1: a point inside the rim (solid) makes waves; a point outside it (dashed) makes loops below the line it rolls on"}
```

### Example 2: the train that goes backward

A train wheel rolls on the rail at radius $a = 0.46$ m, and its flange (the lip that keeps it on the track) reaches $b = 0.49$ m from the axle, 3 cm below the top of the rail. (Roughly typical sizes, used for illustration.) Track the lowest point of the flange, measuring $y$ from the top of the rail.

$x = 0.46t - 0.49\sin t$ and $y = 0.46 - 0.49\cos t$. A table near $t = 0$:

| $t$ | $-0.3$ | $-0.2$ | $-0.1$ | $0$ | $0.1$ | $0.2$ | $0.3$ |
|---|---|---|---|---|---|---|---|
| $x$ (cm) | $0.68$ | $0.53$ | $0.29$ | $0$ | $-0.29$ | $-0.53$ | $-0.68$ |
| $y$ (cm) | $-0.81$ | $-2.02$ | $-2.76$ | $-3.00$ | $-2.76$ | $-2.02$ | $-0.81$ |

While the train moves forward, $x$ *decreases*: that part of the flange is moving backward. It is below the rail top exactly when $0.49\cos t > 0.46$, that is for $|t| < \cos^{-1}\tfrac{0.46}{0.49} \approx 0.352$, and calculus shows this is also exactly when it moves backward. So at every moment some of a moving train is going the wrong way, by about 1.4 cm per turn. It's a favorite puzzle, and the prolate trochoid is the answer.

## Rolling on a circle

Now roll a circle of radius $b$ around a fixed circle of radius $a$ centered at the origin.

**Outside (epicycloid).** The rolling circle's center moves on a circle of radius $a + b$, so it is at $(a + b)\langle\cos t, \sin t\rangle$. Rolling without slipping matches arcs: $at$ on the fixed circle equals $b\phi$ on the rolling one, so the rolling circle turns $\phi = \tfrac{a}{b}t$ relative to the line of centers, and its total turn is $t + \tfrac ab t = \tfrac{a + b}{b}t$. Starting with $P$ at $(a, 0)$ gives the **epicycloid**
$$x = (a + b)\cos t - b\cos\!\left(\tfrac{a + b}{b}t\right), \qquad y = (a + b)\sin t - b\sin\!\left(\tfrac{a + b}{b}t\right).$$

**Inside (hypocycloid).** The center moves on radius $a - b$ and the circle turns the other way, giving the **hypocycloid**:
$$x = (a - b)\cos t + b\cos\!\left(\tfrac{a - b}{b}t\right), \qquad y = (a - b)\sin t - b\sin\!\left(\tfrac{a - b}{b}t\right).$$

When $\tfrac ab = k$ is a whole number, the curve closes after one trip around and has $k$ cusps, one for each time the rolling circle's point touches the fixed circle.

```plot
{"x": [-4.2, 4.2], "y": [-4.2, 4.2], "equal": true, "curves": [{"x": "2cos(t) - cos(2t)", "y": "2sin(t) - sin(2t)", "t": [0, 6.2832], "label": "cardioid (a = b = 1)"}, {"x": "3cos(t) - cos(3t)", "y": "3sin(t) - sin(3t)", "t": [0, 6.2832], "dashed": true, "label": "nephroid (a = 2, b = 1)"}], "circles": [{"center": [0, 0], "r": 1}, {"center": [0, 0], "r": 2}], "caption": "Epicycloids around a fixed circle of radius 1 (cardioid) and radius 2 (nephroid, two cusps)"}
```

### Example 3: the cardioid is an epicycloid

Take $a = b = 1$: $x = 2\cos t - \cos 2t$, $y = 2\sin t - \sin 2t$. It has $k = 1$ cusp, at $(1, 0)$ when $t = 0$. At $t = \pi$, $x = -2 - 1 = -3$, $y = 0$, the far end, 4 units from the cusp. Shift so the cusp is at the origin: $X = x - 1$. Using $\cos 2t = 2\cos^2 t - 1$ and $\sin 2t = 2\sin t\cos t$,
$$X = 2\cos t - 2\cos^2 t = 2\cos t(1 - \cos t), \qquad y = 2\sin t(1 - \cos t).$$
So $(X, y) = 2(1 - \cos t)\langle\cos t, \sin t\rangle$: in polar form with the cusp as pole, $\theta = t$ and $r = 2 - 2\cos\theta$. That is a cardioid from Lesson 36 (opening the other way from $r = 2 + 2\cos\theta$). A cardioid is the path of a point on a coin rolled around another coin of the same size.

### Example 4: the astroid

Take a hypocycloid with $a = 4b$, so $k = 4$ cusps. With $b = \tfrac a4$:
$$x = \tfrac{3a}{4}\cos t + \tfrac{a}{4}\cos 3t, \qquad y = \tfrac{3a}{4}\sin t - \tfrac{a}{4}\sin 3t.$$
The triple-angle formulas $\cos 3t = 4\cos^3 t - 3\cos t$ and $\sin 3t = 3\sin t - 4\sin^3 t$ (from the sum formulas, Lesson 23) collapse these:
$$x = \tfrac a4\left(3\cos t + 4\cos^3 t - 3\cos t\right) = a\cos^3 t, \qquad y = a\sin^3 t.$$
This four-cusped curve is the **astroid**. Eliminating the parameter with $\cos^2 t + \sin^2 t = 1$ gives $x^{2/3} + y^{2/3} = a^{2/3}$. With $a = 3b$ instead you get the three-cusped **deltoid**. And $a = 2b$ is a surprise: $x = 2b\cos t$, $y = 0$. A point on a circle rolling inside one twice its size moves back and forth along a straight diameter. The Persian astronomer Naṣīr al-Dīn al-Ṭūsī described this device in the 13th century, and it is still called the Tusi couple.

```plot
{"x": [-4.4, 4.4], "y": [-4.4, 4.4], "equal": true, "curves": [{"x": "4cos(t)^3", "y": "4sin(t)^3", "t": [0, 6.2832], "label": "astroid (a = 4b)"}, {"x": "2cos(t) + cos(2t)", "y": "2sin(t) - sin(2t)", "t": [0, 6.2832], "dashed": true, "label": "deltoid (a = 3b)"}], "circles": [{"center": [0, 0], "r": 4}, {"center": [0, 0], "r": 3}], "caption": "Hypocycloids inside a circle of radius 4 (astroid, four cusps) and radius 3 (deltoid, three cusps)"}
```

## A curve with a history

The cycloid was a favorite problem of 17th-century mathematics; it was even called "the Helen of geometers" for the quarrels it caused. A few of its facts, proved with calculus, which grew partly out of these problems:

- The area under one arch is $3\pi a^2$, three times the area of the rolling circle (Roberval and Torricelli, 1630s–1640s).
- One arch is $8a$ long, four times the wheel's diameter (Christopher Wren, 1658).
- **Tautochrone:** a bead sliding without friction on an upside-down arch reaches the bottom in the same time from any starting point. Christiaan Huygens found this in 1659 and used it to design more accurate pendulum clocks.
- **Brachistochrone:** among all curves joining two points, the upside-down cycloid is the one along which a sliding bead gets from the higher point to the lower one fastest. Johann Bernoulli posed the problem in 1696; he, his brother Jakob, Leibniz, Newton and L'Hôpital solved it.

## Common mistakes

- **Mixing degrees into $t - \sin t$.** The $t$ outside the sine is a distance factor ($at$ is arc length), so $t$ must be in radians.
- **Rotating the wrong way.** A wheel rolling to the right turns clockwise; that is why the signs are $-\sin t$ and $-\cos t$.
- **Expecting even spacing.** Equal steps in $t$ give unequal steps along the curve; the point is slow near the cusps and fast near the top.
- **Using $a$ for the center path of an epicycloid.** The center moves on a circle of radius $a + b$ (outside) or $a - b$ (inside).

## Key points

- Cycloid (rim point, wheel radius $a$): $x = a(t - \sin t)$, $y = a(1 - \cos t)$; arch width $2\pi a$, height $2a$, cusps on the ground.
- Trochoid (point at distance $b$): $x = at - b\sin t$, $y = a - b\cos t$; loops when $b > a$.
- Epicycloid and hypocycloid: center on radius $a \pm b$; $\tfrac ab = k$ whole gives $k$ cusps.
- Cardioid = epicycloid with $a = b$; astroid = hypocycloid with $a = 4b$, $x = a\cos^3 t$, $y = a\sin^3 t$.
