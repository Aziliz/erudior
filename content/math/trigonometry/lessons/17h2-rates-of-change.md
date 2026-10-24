---
id: trig-m4-h-rates
module: trig-m4
title: 'How fast a sinusoid changes: slopes, speeds and the pendulum'
minutes: 50
honors: true
topics: [Rates of change of sinusoids, Oscillation speed]
drills: [trig-m4-r2-avg-rate, trig-m4-r2-slope-at, trig-m4-r2-max-rate, trig-m4-r2-pendulum]
refs: [trig-ref-unit-circle, trig-ref-identities]
---
## From shape to speed

Lesson 13 described the sine curve as "rounded at the peaks and steepest where it crosses the
axis". This lesson puts numbers on that sentence. How steep is the steepest part? How fast is a
Ferris-wheel rider rising as she passes the height of the hub? How fast is a spring moving when
it passes its rest position? The answers all come from one fact: the slope of the sine graph at
any point is given by the cosine. We reach that fact with tables first and then with an
argument, and it is the first result of the calculus of trig functions.

## Average rate of change

For any function, the **average rate of change** from $x = a$ to $x = b$ is

$$\frac{f(b) - f(a)}{b - a},$$

the change in height divided by the change in input. On the graph it is the slope of the
straight line joining the two points, called a *secant line* of the graph.

### Example 1: sine slows down as it climbs

Find the average rate of change of $y = \sin x$ over $\left[0, \tfrac{\pi}{6}\right]$,
$\left[\tfrac{\pi}{6}, \tfrac{\pi}{3}\right]$ and $\left[\tfrac{\pi}{3}, \tfrac{\pi}{2}\right]$.

Each interval has width $\tfrac{\pi}{6} \approx 0.5236$.

- $\dfrac{\sin\frac{\pi}{6} - \sin 0}{\pi/6} = \dfrac{0.5}{0.5236} \approx 0.955$
- $\dfrac{\sin\frac{\pi}{3} - \sin\frac{\pi}{6}}{\pi/6} = \dfrac{0.8660 - 0.5}{0.5236} \approx 0.699$
- $\dfrac{\sin\frac{\pi}{2} - \sin\frac{\pi}{3}}{\pi/6} = \dfrac{1 - 0.8660}{0.5236} \approx 0.256$

Over equal steps the climb shrinks: sine rises fast near 0 and hardly at all near its peak.

## The slope at a point

Now shrink the interval. The average rate of change over $[x, x + h]$ is the
**difference quotient**

$$\frac{\sin(x + h) - \sin x}{h}.$$

As $h$ gets very small, the secant line pivots into the line that just touches the curve at $x$,
and the difference quotient settles on a single number: the **slope of the curve** at $x$.

At $x = 0$ the difference quotient is $\tfrac{\sin h}{h}$, which approaches 1 (about 0.9983 at
$h = 0.1$ and 0.99998 at $h = 0.01$; the Module 3 honors lesson on small angles proves it). So the
sine curve leaves the origin with slope exactly 1. Here is the same computation, with
$h = 0.001$, at other points of the first half-cycle:

| $x$ | $0$ | $\tfrac{\pi}{6}$ | $\tfrac{\pi}{3}$ | $\tfrac{\pi}{2}$ | $\tfrac{2\pi}{3}$ | $\pi$ |
|---|---|---|---|---|---|---|
| $\dfrac{\sin(x + 0.001) - \sin x}{0.001}$ | 1.0000 | 0.8658 | 0.4996 | −0.0005 | −0.5004 | −1.0000 |
| $\cos x$ | 1 | 0.8660 | 0.5 | 0 | −0.5 | −1 |

The slopes match the values of cosine. That is no accident.

## Why the slope of sine is cosine

Expand $\sin(x + h)$ with the sum formula from Lesson 23 and regroup:

$$\frac{\sin(x + h) - \sin x}{h} = \frac{\sin x\cos h + \cos x\sin h - \sin x}{h} = \sin x\cdot\frac{\cos h - 1}{h} + \cos x\cdot\frac{\sin h}{h}.$$

Now let $h$ shrink toward 0, with $x$ held fixed.

- $\dfrac{\sin h}{h}$ approaches 1, as above.
- $\dfrac{\cos h - 1}{h}$ approaches 0, because $1 - \cos h$ is about $\tfrac{h^2}{2}$ for small $h$
  (another small-angle fact), so the quotient is about $-\tfrac{h}{2}$.

So the difference quotient approaches $\sin x \cdot 0 + \cos x \cdot 1 = \cos x$:

$$\text{the slope of } y = \sin x \text{ at } x \text{ is } \cos x.$$

In calculus this is written $\tfrac{d}{dx}\sin x = \cos x$. (The argument above leans on two limits
that a calculus course proves carefully; here we have used them as established.) Everything also
depends on measuring $x$ in **radians**: in degrees the slope would carry an extra factor of
$\tfrac{\pi}{180}$, the same factor that spoils $\tfrac{\sin x}{x} \to 1$.

Cosine follows for free. Since $\cos x = \sin\left(x + \tfrac{\pi}{2}\right)$, the cosine graph is the
sine graph slid left, and its slope at $x$ is the slope of sine at $x + \tfrac{\pi}{2}$:
$\cos\left(x + \tfrac{\pi}{2}\right) = -\sin x$. So the slope of $y = \cos x$ is $-\sin x$.

```plot
{"x": [-0.3, 6.6], "y": [-1.5, 1.5], "functions": [{"f": "sin(x)", "label": "y = sin x", "from": 0, "to": 6.2832}, {"f": "cos(x)", "dashed": true, "label": "slope of sin x", "from": 0, "to": 6.2832}], "points": [{"at": [0, 1], "label": "slope 1 at x = 0"}, {"at": [1.5708, 0], "label": "slope 0"}, {"at": [3.1416, -1]}], "labels": [{"at": [3.1416, -1.27], "text": "slope −1 at x = π"}], "caption": "The slope of y = sin x (solid) at each x is the height of y = cos x (dashed)"}
```

Read the two graphs together: where sine climbs (from $-\tfrac{\pi}{2}$ to $\tfrac{\pi}{2}$) cosine is
positive; where sine has a peak or a trough, cosine is zero; where sine falls, cosine is
negative.

## Slopes of a transformed sinusoid

Each constant in $y = A\sin\big(B(x - C)\big) + D$ affects slopes in a simple way:

- multiplying heights by $A$ multiplies every slope by $A$;
- replacing $x$ by $Bx$ squeezes the graph horizontally by a factor $B$, which multiplies every
  slope by $B$;
- shifting by $C$ or $D$ moves the graph without tilting it, so slopes just travel with it.

Putting these together, the slope of $y = A\sin\big(B(x - C)\big) + D$ at $x$ is
$AB\cos\big(B(x - C)\big)$. Since cosine runs between $-1$ and $1$, the **steepest slope** of the
sinusoid is $|A|B$, which can also be written $\dfrac{2\pi|A|}{\text{period}}$. It occurs at every
midline crossing, and the slope is 0 at every peak and trough.

![The graph of y = sin x from just left of 0 to 2π. Red tangent lines touch it at the origin with slope 1, at the peak π/2 with slope 0, at π with slope −1, and at the trough 3π/2 with slope 0. A dashed green secant line joins two points on either side of the trough.](images/trig-m4-slopes.svg)

### Example 2: slope at a point

Find the slope of $y = 3\sin(2x)$ at $x = \tfrac{\pi}{6}$, and check it with a difference quotient.

Here $A = 3$, $B = 2$, so the slope is $3 \cdot 2\cos\left(2 \cdot \tfrac{\pi}{6}\right) = 6\cos\tfrac{\pi}{3} = 3$. Check with
$h = 0.001$: $\dfrac{3\sin(2(\frac{\pi}{6} + 0.001)) - 3\sin\frac{\pi}{3}}{0.001} \approx 2.9948$, very close to 3.

### Example 3: the Ferris wheel rider

In Lesson 17 a rider's height was $h(t) = 30 - 25\cos\!\left(\tfrac{\pi}{2}t\right)$ m, $t$ in minutes.
How fast is the rider rising, at most, and when?

Amplitude 25, $B = \tfrac{\pi}{2}$. The fastest rise is $25 \cdot \tfrac{\pi}{2} \approx 39.27$ m/min, at the upward
midline crossing: the rider is at the hub's height, 30 m, on the way up, at $t = 1$ min (and
every 4 minutes after).

There is a satisfying check. The rim moves at linear speed $v = r\omega = 25 \cdot \tfrac{\pi}{2}$ m/min
(Lesson 4). At the side of the wheel the rim is moving straight up, so all of that speed is
vertical: the two methods agree.

### Example 4: the rule of twelfths

In Lesson 17's tide model, $h(t) = 1.8\cos\!\left(\tfrac{2\pi}{12.4}(t - 2)\right) + 2.4$, the water falls from
4.2 m to 0.6 m in about 6 hours. Sailors estimate the fall hour by hour with the **rule of
twelfths**: 1, 2, 3, 3, 2, 1 twelfths of the range in the six hours. Compare with the model.

Over half a period the cosine goes from 1 to $-1$, so after $k$ sixths of that half-period the
fraction of the range covered is $\tfrac{1 - \cos(k\pi/6)}{2}$. Taking differences gives
0.067, 0.183, 0.250, 0.250, 0.183, 0.067, while the rule uses $\tfrac{1}{12} \approx 0.083$,
$\tfrac{2}{12} \approx 0.167$ and $\tfrac{3}{12} = 0.25$. The rule is a rough version of the sinusoid: slow
near high and low water, fastest in the middle. The fastest fall is
$1.8 \cdot \tfrac{2\pi}{12.4} \approx 0.91$ m per hour, at the midline crossing $t = 2 + 3.1 = 5.1$, about
5:06 AM. (Real tides are only roughly sinusoidal, so treat both as estimates.)

## Speed in simple harmonic motion

For an object in simple harmonic motion, $d = a\sin(\omega t)$, the slope of the graph is the
**velocity**: the rate at which the displacement changes. By the rule above it is
$a\omega\cos(\omega t)$. So the object moves fastest, at speed $|a|\omega$, as it passes through
equilibrium, and it is momentarily at rest at the turning points, where $|d| = |a|$.

### Example 5: the spring again

Lesson 17's spring has $d = 6\sin(3\pi t)$ cm, $t$ in seconds. Find its greatest speed and its
velocity at $t = 0.25$ s.

The greatest speed is $|a|\omega = 6 \cdot 3\pi = 18\pi \approx 56.5$ cm/s, reached every time it passes
equilibrium. At $t = 0.25$: $18\pi\cos(0.75\pi) = 18\pi\left(-\tfrac{\sqrt2}{2}\right) \approx -40.0$ cm/s. The
negative sign means it is moving down, even though its displacement there ($3\sqrt2 \approx 4.24$ cm)
is still above equilibrium: it is on its way back.

## The pendulum

A pendulum is the classic place where a small-angle approximation turns into a physical law.
Physics shows that the force pulling a pendulum bob back toward the bottom is proportional to
$\sin\theta$, where $\theta$ is its angle from vertical. For small swings $\sin\theta \approx \theta$ (in radians),
so the pull is proportional to the displacement itself, and that is exactly the condition for
simple harmonic motion. The result, which we take from physics without deriving it, is the
period

$$T = 2\pi\sqrt{\frac{L}{g}},$$

where $L$ is the length and $g \approx 9.81$ m/s² is the acceleration due to gravity. For small swings
the period depends on neither the mass nor how far the bob swings.

### Example 6: a seconds pendulum

Find the period of a 1 m pendulum, and the length whose period is exactly 2 s (one second per
swing, the length used in many pendulum clocks).

$T = 2\pi\sqrt{1/9.81} \approx 2.006$ s. For $T = 2$: square both sides of $2 = 2\pi\sqrt{L/9.81}$ to get
$\tfrac{L}{9.81} = \tfrac{1}{\pi^2}$, so $L = \tfrac{9.81}{\pi^2} \approx 0.994$ m.

For larger swings the formula slowly fails, because $\sin\theta$ is noticeably smaller than $\theta$.
The true period is longer: by about 0.2% for a swing of $10^\circ$ to each side, about 1.7% for
$30^\circ$, and about 18% for $90^\circ$. Clocks keep their swings small for this reason.

## Common mistakes

- **Taking the amplitude as the steepest slope.** The steepest slope is $|A|B$; the same amplitude
  with a shorter period makes a steeper wave.
- **Looking for the fastest change at a peak.** At a maximum or minimum the slope is 0; the
  fastest change is at the midline.
- **Confusing average and instantaneous rates.** An average rate over an interval is a secant
  slope; it equals the slope at a point only in the limit of tiny intervals.
- **Using degrees.** "The slope of $\sin x$ is $\cos x$" is true only with $x$ in radians.

## Key points

- Average rate of change: $\dfrac{f(b) - f(a)}{b - a}$, the slope of a secant line.
- The slope of $y = \sin x$ at $x$ is $\cos x$, and the slope of $y = \cos x$ is $-\sin x$ (radians).
- The slope of $A\sin(B(x - C)) + D$ is $AB\cos(B(x - C))$; the steepest slope, $|A|B$, comes at
  the midline crossings, and the slope is 0 at peaks and troughs.
- In simple harmonic motion $d = a\sin\omega t$, the greatest speed is $|a|\omega$, at equilibrium.
- Small-swing pendulum: $T = 2\pi\sqrt{L/g}$.
