---
id: calc-arc-length-surface
module: calc-m7
title: Arc length and surface area
minutes: 30
topics: [Arc length, Surface area]
drills: [calc-d-arc-length, calc-d-surface-area]
refs: [calc-ref-applications]
---
## Measuring a curve

How long is the cable hanging between two poles, or the path of a thrown ball? A straight segment's length comes from the distance formula. For a curve, use the slicing idea once more: chop the curve into tiny pieces, approximate each by a straight segment, add, and take a limit. This lesson does that for length and then for the area of a surface of revolution. These are BC and college Calculus II topics.

## Arc length

Divide $[a, b]$ into small steps $\Delta x$. Over one step the curve rises by about $\Delta y \approx f'(x)\Delta x$. The straight segment joining the endpoints has length

$$\sqrt{(\Delta x)^2 + (\Delta y)^2} \approx \sqrt{(\Delta x)^2 + [f'(x)\Delta x]^2} = \sqrt{1 + [f'(x)]^2}\,\Delta x.$$

```plot
{"x": [0, 3], "y": [0, 3], "equal": true, "functions": [{"f": "x^2/3 + 0.3"}], "segments": [{"from": [1, 0.6333], "to": [2, 1.6333], "label": "Δs"}, {"from": [1, 0.6333], "to": [2, 0.6333], "dashed": true, "label": "Δx"}, {"from": [2, 0.6333], "to": [2, 1.6333], "dashed": true, "label": "Δy"}], "caption": "Each small piece of curve is nearly the hypotenuse of a right triangle"}
```

Adding and taking the limit gives the **arc length** of $y = f(x)$ from $x = a$ to $x = b$ (for $f'$ continuous):

$$L = \int_a^b\sqrt{1 + [f'(x)]^2}\,dx.$$

In differential form, $ds = \sqrt{dx^2 + dy^2} = \sqrt{1 + (dy/dx)^2}\,dx$, and $L = \int ds$. If the curve is given as $x = g(y)$, use $L = \int_c^d\sqrt{1 + [g'(y)]^2}\,dy$.

The square root makes most arc length integrals impossible to do by hand; in practice they're computed numerically. A few are designed to simplify.

### Example 1

Find the length of $y = \frac23x^{3/2}$ from $x = 0$ to $x = 3$.

$y' = x^{1/2}$, so $1 + (y')^2 = 1 + x$.
$$L = \int_0^3\sqrt{1 + x}\,dx = \left[\frac23(1 + x)^{3/2}\right]_0^3 = \frac23(8 - 1) = \mathbf{\frac{14}{3}}.$$

### Example 2 (a perfect square)

Find the length of $y = \dfrac{x^3}{6} + \dfrac{1}{2x}$ from $x = 1$ to $x = 2$.

$y' = \dfrac{x^2}{2} - \dfrac{1}{2x^2}$. Then
$$1 + (y')^2 = 1 + \frac{x^4}{4} - \frac12 + \frac{1}{4x^4} = \frac{x^4}{4} + \frac12 + \frac{1}{4x^4} = \left(\frac{x^2}{2} + \frac{1}{2x^2}\right)^2.$$
Adding 1 flipped the middle sign and made a perfect square. So
$$L = \int_1^2\left(\frac{x^2}{2} + \frac{1}{2x^2}\right)dx = \left[\frac{x^3}{6} - \frac{1}{2x}\right]_1^2 = \left(\frac86 - \frac14\right) - \left(\frac16 - \frac12\right) = \mathbf{\frac{17}{12}}.$$

### Example 3 (set up and approximate)

Set up the length of $y = x^2$ from $x = 0$ to $x = 1$, and estimate it.

$L = \int_0^1\sqrt{1 + 4x^2}\,dx$. It can be done with trig substitution (Lesson 32), but numerically it's about **1.4789**. Sanity check: the straight line from $(0, 0)$ to $(1, 1)$ has length $\sqrt2 \approx 1.414$, and the curve must be at least that long. (Few curves have arc-length integrals that come out exactly; the hanging-cable curve of Lesson 36 is a famous one that does.)

## Surface area of revolution

Rotate the curve $y = f(x) \ge 0$, $a \le x \le b$, about the $x$-axis. Each small piece of curve, of length $ds$, sweeps out a thin band. Unrolled, the band is nearly a strip of length $2\pi y$ (the circumference at radius $y$) and width $ds$. So:

$$S = 2\pi\int_a^b f(x)\sqrt{1 + [f'(x)]^2}\,dx = \int 2\pi y\,ds.$$

For rotation about the $y$-axis the radius is $x$: $S = \int2\pi x\,ds$.

![A curve y = f(x) above a horizontal axis of rotation, with its mirror image dashed below. A short piece of the curve of length ds, at height y, sweeps out a thin band around the axis; the band's circumference is 2πy.](images/calc-m7-band.svg)

The band's radius $y$ is measured from the axis to the curve, and its width is the slanted length $ds$ of the piece of curve.

The width of the band is $ds$, not $dx$. Using $dx$ would treat each band as a flat-sided cylinder and give the wrong answer for any slanted curve.

### Example 4

Find the surface area of a sphere of radius $r$.

Rotate $y = \sqrt{r^2 - x^2}$, $-r \le x \le r$, about the $x$-axis. $y' = \dfrac{-x}{\sqrt{r^2 - x^2}}$, so
$$\sqrt{1 + (y')^2} = \sqrt{\frac{r^2 - x^2 + x^2}{r^2 - x^2}} = \frac{r}{\sqrt{r^2 - x^2}}.$$
Then $y\sqrt{1 + (y')^2} = r$, and
$$S = 2\pi\int_{-r}^{r}r\,dx = 2\pi r\cdot2r = 4\pi r^2. \checkmark$$

### Example 5

Find the surface area when $y = 2\sqrt x$, $0 \le x \le 3$, is rotated about the $x$-axis.

$y' = x^{-1/2}$, $1 + (y')^2 = 1 + \frac1x = \frac{x + 1}{x}$. Then
$$y\sqrt{1 + (y')^2} = 2\sqrt x\cdot\frac{\sqrt{x + 1}}{\sqrt x} = 2\sqrt{x + 1}.$$
$$S = 2\pi\int_0^3 2\sqrt{x + 1}\,dx = 4\pi\left[\tfrac23(x + 1)^{3/2}\right]_0^3 = 4\pi\cdot\tfrac23(8 - 1) = \mathbf{\frac{56\pi}{3}}.$$

### Example 6 (another designed simplification)

Find the length of $y = \ln(\cos x)$ for $0 \le x \le \frac\pi4$.

$y' = \dfrac{-\sin x}{\cos x} = -\tan x$, so $1 + (y')^2 = 1 + \tan^2x = \sec^2x$, and on this interval $\sqrt{\sec^2x} = \sec x$. The integral of $\sec x$ is $\ln|\sec x + \tan x| + C$ (check it by differentiating; Lesson 32 shows where it comes from):
$$L = \int_0^{\pi/4}\sec x\,dx = \Big[\ln|\sec x + \tan x|\Big]_0^{\pi/4} = \ln\left(\sqrt2 + 1\right) - \ln 1 \approx \mathbf{0.8814}.$$

The identity $1 + \tan^2 = \sec^2$ did the same job as the perfect square in Example 2.

### Example 7

Find the surface area when $y = x^3$, $0 \le x \le 1$, is rotated about the $x$-axis.

$y' = 3x^2$, so $S = 2\pi\int_0^1x^3\sqrt{1 + 9x^4}\,dx$. Let $u = 1 + 9x^4$, $du = 36x^3\,dx$:
$$S = \frac{2\pi}{36}\int_1^{10}u^{1/2}\,du = \frac{\pi}{18}\cdot\frac23\left(10^{3/2} - 1\right) = \frac{\pi}{27}\left(10\sqrt{10} - 1\right) \approx 3.563.$$
The factor $x^3$ from the radius is exactly what made the substitution work.

## Common mistakes

- **Forgetting to square $f'$**, or forgetting the 1 under the root.
- **$\sqrt{1 + (f')^2} = 1 + f'$.** Square roots don't split over sums.
- **Using $dx$ instead of $ds$** in surface area.
- *Radius from the wrong axis* for surface area: $y$ for the $x$-axis, $x$ for the $y$-axis.
- *Expecting a closed form.* Most arc lengths need numerical integration; that's normal.

## Key points

- Arc length: $L = \int_a^b\sqrt{1 + [f'(x)]^2}\,dx$ (or in $y$ with $g'(y)$).
- $ds = \sqrt{1 + (dy/dx)^2}\,dx$.
- Surface area about the $x$-axis: $S = 2\pi\int_a^b f(x)\sqrt{1 + [f'(x)]^2}\,dx$.
- Designed problems often turn $1 + (f')^2$ into a perfect square.
