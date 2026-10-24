---
id: trig-m4-h-small-angles
module: trig-m4
title: 'How fast a sinusoid changes: slopes and small angles'
minutes: 50
honors: true
topics: [Rates of change of sinusoids, Small-angle approximations]
drills: [trig-m4-r2-avg-rate, trig-m4-r2-max-rate, trig-m4-r2-small-angle, trig-m4-r2-pendulum]
refs: [trig-ref-unit-circle]
---
## From shape to speed

Lesson 13 described the sine curve as "rounded at the peaks and steepest where it crosses the
axis". This lesson puts numbers on that sentence. How steep is the steepest part? How fast is a
Ferris-wheel rider rising when she passes the height of the hub? Why can a surveyor, an
astronomer or a physicist replace $\sin x$ by plain $x$ for small angles? The answers come from
one fact about the unit circle, which we prove here with areas. It is the same fact that starts
the calculus of trig functions.

## Average rate of change

For any function, the **average rate of change** from $x = a$ to $x = b$ is

$$\frac{f(b) - f(a)}{b - a},$$

the change in height divided by the change in input. On the graph it is the slope of the
straight line (a *secant line*) joining the two points.

### Example 1: sine slows down as it climbs

Find the average rate of change of $y = \sin x$ over $\left[0, \tfrac{\pi}{6}\right]$,
$\left[\tfrac{\pi}{6}, \tfrac{\pi}{3}\right]$ and $\left[\tfrac{\pi}{3}, \tfrac{\pi}{2}\right]$.

Each interval has width $\tfrac{\pi}{6} \approx 0.5236$.

- $\dfrac{\sin\frac{\pi}{6} - \sin 0}{\pi/6} = \dfrac{0.5}{0.5236} \approx 0.955$
- $\dfrac{\sin\frac{\pi}{3} - \sin\frac{\pi}{6}}{\pi/6} = \dfrac{0.8660 - 0.5}{0.5236} \approx 0.699$
- $\dfrac{\sin\frac{\pi}{2} - \sin\frac{\pi}{3}}{\pi/6} = \dfrac{1 - 0.8660}{0.5236} \approx 0.256$

Over equal steps the climb shrinks: sine rises fast near 0 and hardly at all near its peak.
That is the numerical meaning of "rounded at the top".

## Zooming in at the origin

Make the interval $[0, h]$ smaller and smaller. The average rate is $\dfrac{\sin h - 0}{h} = \dfrac{\sin h}{h}$:

| $h$ (radians) | 0.5 | 0.1 | 0.01 | 0.001 |
|---|---|---|---|---|
| $\dfrac{\sin h}{h}$ | 0.95885 | 0.99833 | 0.99998 | 0.9999998 |

The slopes approach 1. So right at the origin the sine curve rises with slope exactly 1: it
leaves the origin along the line $y = x$. A table is evidence, not proof; here is the proof.

### Why $\dfrac{\sin x}{x}$ approaches 1

Take an angle $x$ with $0 < x < \tfrac{\pi}{2}$ on the unit circle, with $O$ the center,
$A = (1, 0)$, $P = (\cos x, \sin x)$ on the circle, and $T = (1, \tan x)$ where the ray $OP$ meets
the vertical line $x = 1$ (its height is $\tan x$ because the ray has slope $\tan x$).

![A quarter of the unit circle with center O and A = (1, 0) on the x-axis. The ray at angle x meets the circle at P and the vertical line through A at T = (1, tan x). The small triangle O, A, P has height sin x; the sector from A to P has an arc of length x; the large triangle O, A, T has a vertical side of length tan x.](images/trig-m4-sin-x-tan.svg)

Three regions are nested, each inside the next: triangle $OAP$, the sector $OAP$, and triangle
$OAT$. Their areas are

- triangle $OAP$: base $OA = 1$, height $\sin x$, area $\tfrac12\sin x$;
- sector $OAP$: from Lesson 3, $\tfrac12 r^2\theta = \tfrac12 x$;
- triangle $OAT$: base 1, height $\tan x$, area $\tfrac12\tan x$.

Nested regions have growing areas, so

$$\sin x < x < \tan x \qquad \left(0 < x < \tfrac{\pi}{2}\right).$$

Divide through by $\sin x$ (positive here) and flip to reciprocals (which reverses the
inequalities):

$$\cos x < \frac{\sin x}{x} < 1.$$

As $x$ shrinks toward 0, $\cos x$ climbs to 1, so $\tfrac{\sin x}{x}$ is squeezed between two
quantities that both approach 1. It must approach 1 too. For negative $x$ nothing changes,
because $\tfrac{\sin x}{x}$ is even. This argument works only because $x$ is in **radians**: the
sector area $\tfrac12 x$ uses radian measure.

## Small-angle approximations

For angles near 0, measured in radians,

$$\sin x \approx x, \qquad \tan x \approx x, \qquad \cos x \approx 1 - \frac{x^2}{2}.$$

These are the **small-angle approximations**. The first two follow from the squeeze above
($\tfrac{\sin x}{x}$ and $\tfrac{\tan x}{x} = \tfrac{\sin x}{x}\cdot\tfrac{1}{\cos x}$ both approach 1). The third uses
the identity $\cos x = 1 - 2\sin^2\tfrac{x}{2}$ from Module 6: replacing $\sin\tfrac{x}{2}$ by $\tfrac{x}{2}$ gives
$1 - 2\cdot\tfrac{x^2}{4} = 1 - \tfrac{x^2}{2}$.

How good are they?

| angle | $x$ (rad) | $\sin x$ | $\tan x$ | $\cos x$ | $1 - \tfrac{x^2}{2}$ |
|---|---|---|---|---|---|
| $5^\circ$ | 0.08727 | 0.08716 | 0.08749 | 0.99619 | 0.99619 |
| $10^\circ$ | 0.17453 | 0.17365 | 0.17633 | 0.98481 | 0.98477 |
| $20^\circ$ | 0.34907 | 0.34202 | 0.36397 | 0.93969 | 0.93908 |
| $30^\circ$ | 0.52360 | 0.50000 | 0.57735 | 0.86603 | 0.86292 |

Measured as a percent of the true value, $\sin x \approx x$ is off by less than 1% up to about
$14^\circ$, and $\tan x \approx x$ up to about $10^\circ$. At $30^\circ$ the errors are about 5% and 9%.
"Small" is a judgment call that depends on the accuracy you need.

In degrees the approximations look different, which is one more reason radians are the natural
unit: $\sin(d^\circ) \approx \tfrac{\pi}{180}\,d \approx 0.01745\,d$. The tidy "$\sin x \approx x$" only holds in radians.

### Example 2: the height of a distant tower

From 2 km away, a tower's top is $1.5^\circ$ above the horizontal. Estimate its height above eye
level without a trig table.

Convert: $1.5^\circ = 1.5 \cdot \tfrac{\pi}{180} \approx 0.02618$ rad. The height is
$2000\tan(1.5^\circ) \approx 2000 \times 0.02618 \approx 52.36$ m. The exact value, $2000\tan 1.5^\circ$, is
$52.37$ m: the shortcut is off by about 1 cm. Astronomers use the same shortcut all the time,
because the angles they measure are tiny.

## The steepest slope of a sinusoid

Near a midline crossing, the small-angle approximation turns a sinusoid into a straight line.
Take $y = A\sin\big(B(x - C)\big) + D$ with $A > 0$, which crosses its midline going up at $x = C$.
For $x$ close to $C$ the angle $B(x - C)$ is small, so

$$y - D \approx A \cdot B(x - C).$$

That is a line through $(C, D)$ with slope $AB$. So the **steepest slope** of the sinusoid,
reached at every midline crossing, is $|A|\,B$: amplitude times $B$, or equivalently
$\dfrac{2\pi|A|}{\text{period}}$. At the peaks and valleys the slope is 0.

In calculus you will see that the slope of $y = \sin x$ at *every* point $x$ is $\cos x$, a wave
a quarter period ahead of sine. A quick numerical check at $x = \tfrac{\pi}{3}$:
$\dfrac{\sin(\frac{\pi}{3} + 0.001) - \sin\frac{\pi}{3}}{0.001} \approx 0.4996$, very close to $\cos\tfrac{\pi}{3} = 0.5$.

### Example 3: the Ferris wheel rider

In Lesson 17 a rider's height was $h(t) = 30 - 25\cos\!\left(\tfrac{\pi}{2}t\right)$ m, $t$ in minutes.
How fast is the rider rising, at most, and when?

Amplitude 25, $B = \tfrac{\pi}{2}$. The fastest rise is $25 \cdot \tfrac{\pi}{2} \approx 39.27$ m/min. It happens
at the upward midline crossing: the rider is at the hub's height, 30 m, on the way up, at
$t = 1$ min (and every 4 minutes after).

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

## The pendulum

A pendulum is the classic place where the small-angle approximation becomes a physical law.
Physics shows that the force pulling a pendulum bob back toward the bottom is proportional to
$\sin\theta$, where $\theta$ is its angle from vertical. For small swings $\sin\theta \approx \theta$, the pull is
proportional to the displacement itself, and that is exactly the condition for simple harmonic
motion (Lesson 17). The result, which we take from physics without deriving it, is the period

$$T = 2\pi\sqrt{\frac{L}{g}},$$

where $L$ is the length and $g \approx 9.81$ m/s² is the acceleration due to gravity. The period
does not depend on the mass or (for small swings) on how far the bob swings.

### Example 5: a seconds pendulum

Find the period of a 1 m pendulum, and the length whose period is exactly 2 s (one second per
swing, the length used in many pendulum clocks).

$T = 2\pi\sqrt{1/9.81} \approx 2.006$ s. For $T = 2$: square both sides of $2 = 2\pi\sqrt{L/9.81}$ to get
$\tfrac{L}{9.81} = \tfrac{1}{\pi^2}$, so $L = \tfrac{9.81}{\pi^2} \approx 0.994$ m.

For larger swings the formula slowly fails, because $\sin\theta$ is noticeably smaller than $\theta$.
The true period is longer: by about 0.2% for a swing of $10^\circ$ to each side, about 1.7% for
$30^\circ$, and about 18% for $90^\circ$. Clocks keep their swings small for this reason.

## Common mistakes

- **Using degrees in a small-angle formula.** $\sin 5^\circ \approx 5$ is nonsense; convert first:
  $\sin 5^\circ \approx 0.0873$.
- **Using the approximation for big angles.** At $30^\circ$, $\tan x \approx x$ is already 9% off.
- **Taking the amplitude as the steepest slope.** The steepest slope is $|A|B$; the same
  amplitude with a shorter period means a steeper wave.
- **Confusing average and instantaneous rates.** The average rate over an interval is a
  secant slope; it equals the slope at a point only in the limit of tiny intervals.

## Key points

- Average rate of change: $\dfrac{f(b) - f(a)}{b - a}$, the slope of a secant line.
- For $0 < x < \tfrac{\pi}{2}$: $\sin x < x < \tan x$ (areas), so $\cos x < \tfrac{\sin x}{x} < 1$ and
  $\tfrac{\sin x}{x} \to 1$.
- Small angles, in radians: $\sin x \approx x$, $\tan x \approx x$, $\cos x \approx 1 - \tfrac{x^2}{2}$.
- The steepest slope of $A\sin(B(x - C)) + D$ is $|A|B$, at the midline crossings.
- Small-swing pendulum: $T = 2\pi\sqrt{L/g}$.
