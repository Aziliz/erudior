---
id: trig-transform
module: trig-m4
title: Amplitude, period, phase shift and vertical shift
minutes: 40
topics: [Sinusoidal transformations]
drills: [trig-d-amp-period, trig-d-write-sinusoid, trig-d-sinusoid-cycle]
refs: [trig-ref-unit-circle]
---
## The general sinusoid

Real waves are rarely exactly $\sin x$. A tide might rise 3 m above its average every
12.4 hours; a sound wave might repeat 440 times a second. To describe them we stretch and
slide the basic sine graph. Every such wave can be written in the form

$$y = A\sin\big(B(x - C)\big) + D \qquad\text{or}\qquad y = A\cos\big(B(x - C)\big) + D,$$

with $B > 0$. Each constant does one job, and this lesson takes them one at a time.

## Amplitude: $A$

As in the last lesson, $|A|$ is the **amplitude**, the vertical distance from the middle of
the wave to a peak. If $A < 0$ the graph is reflected across its middle line.

## Period: $B$

Replacing $x$ by $Bx$ squeezes the graph horizontally. The basic sine completes one cycle
as its input goes from $0$ to $2\pi$. In $\sin(Bx)$ the input is $Bx$, and $Bx$ goes from
$0$ to $2\pi$ while $x$ goes from $0$ to $\tfrac{2\pi}{B}$. So

$$\text{period} = \frac{2\pi}{B}.$$

$B > 1$ squeezes (shorter period, more waves); $0 < B < 1$ stretches. The number of cycles
per unit of $x$, $\tfrac{B}{2\pi}$, is called the **frequency**: it is the reciprocal of the period.

```plot
{"x": [-0.3, 6.6], "y": [-1.5, 1.5], "functions": [{"f": "sin(x)", "dashed": true, "label": "sin x"}, {"f": "sin(2x)", "label": "sin 2x"}], "caption": "sin 2x has period π: two cycles fit where sin x has one"}
```

## Phase shift: $C$

Replacing $x$ by $x - C$ slides the graph $C$ units to the right (left if $C < 0$). This
horizontal slide is the **phase shift**. Because of the factored form, a cycle of
$A\sin(B(x - C)) + D$ starts where $B(x - C) = 0$, at $x = C$.

**Watch the factoring.** In $y = \sin(2x - \tfrac{\pi}{2})$ the phase shift is *not*
$\tfrac{\pi}{2}$. Factor out $B$ first: $2x - \tfrac{\pi}{2} = 2\left(x - \tfrac{\pi}{4}\right)$, so the
shift is $\tfrac{\pi}{4}$ to the right. In general, for $\sin(Bx - c)$ the phase shift is
$\tfrac{c}{B}$.

## Vertical shift: $D$

Adding $D$ moves the whole graph up $D$ units. The horizontal line $y = D$, halfway
between the maximum and minimum values, is the **midline**. The **vertical shift** is $D$.
Then
$$\text{max} = D + |A|, \qquad \text{min} = D - |A|.$$

## Graphing in four steps

1. Read $|A|$, the period $\tfrac{2\pi}{B}$, the phase shift $C$, and the midline $y = D$.
2. One cycle runs from $x = C$ to $x = C + \tfrac{2\pi}{B}$. Split it into four equal
   quarters; each is $\tfrac14$ of the period.
3. At the five $x$-values, place the key points of the basic shape (for sine: midline, max,
   midline, min, midline; for cosine: max, midline, min, midline, max), measured from the
   midline and using the amplitude. Flip max and min if $A < 0$.
4. Join smoothly and extend periodically.

### Example 1

Graph $y = 3\sin\!\left(2x - \tfrac{\pi}{2}\right) + 1$.

**Step 1.** Factor: $3\sin\!\left(2\left(x - \tfrac{\pi}{4}\right)\right) + 1$. Amplitude 3,
period $\tfrac{2\pi}{2} = \pi$, phase shift $\tfrac{\pi}{4}$ right, midline $y = 1$.
Range: $[1 - 3, 1 + 3] = [-2, 4]$.

**Step 2.** The cycle runs from $\tfrac{\pi}{4}$ to $\tfrac{\pi}{4} + \pi = \tfrac{5\pi}{4}$. A quarter period
is $\tfrac{\pi}{4}$, so the key $x$-values are $\tfrac{\pi}{4}, \tfrac{\pi}{2}, \tfrac{3\pi}{4}, \pi, \tfrac{5\pi}{4}$.

**Step 3.** Sine pattern from the midline: $y = 1, 4, 1, -2, 1$.

```plot
{"x": [-0.5, 5], "y": [-2.6, 4.6], "functions": [{"f": "3sin(2x - pi/2) + 1", "label": "y = 3 sin(2x − π/2) + 1"}, {"f": "1", "dashed": true}], "points": [{"at": [0.7854, 1]}, {"at": [1.5708, 4], "label": "max (π/2, 4)"}, {"at": [2.3562, 1]}, {"at": [3.1416, -2], "label": "min (π, −2)"}, {"at": [3.927, 1]}], "caption": "One cycle from π/4 to 5π/4; dashed line is the midline y = 1"}
```

**Check:** at $x = \tfrac{\pi}{2}$, $3\sin(\pi - \tfrac{\pi}{2}) + 1 = 3\sin\tfrac{\pi}{2} + 1 = 4$. ✓

### Example 2

Find the amplitude, period and range of $y = -2\cos\!\left(\tfrac{\pi}{3}x\right) - 1$, and
describe the first cycle starting at $x = 0$.

Amplitude $|-2| = 2$. Period $\dfrac{2\pi}{\pi/3} = 6$. Midline $y = -1$, so the range is
$[-3, 1]$. No phase shift.

Cycle from 0 to 6, quarter period $1.5$: $x = 0, 1.5, 3, 4.5, 6$. Cosine pattern
(max, mid, min, mid, max) flipped because $A < 0$: $y = -3, -1, 1, -1, -3$.

When $B$ contains $\pi$, the period often comes out a whole number. That's common in
models where $x$ is time in hours or seconds.

### Example 3: from graph to equation

A sinusoid has a maximum at $(1, 5)$ and the next minimum at $(4, -1)$. Write an equation.

**Midline and amplitude.** $D = \tfrac{5 + (-1)}{2} = 2$ and $|A| = \tfrac{5 - (-1)}{2} = 3$.

**Period.** Max to the next min is half a period: $4 - 1 = 3$, so the period is 6 and
$B = \tfrac{2\pi}{6} = \tfrac{\pi}{3}$.

**Phase shift.** Cosine starts its cycle at a maximum, so using cosine the shift is the
$x$-value of a maximum: $C = 1$.

$$y = 3\cos\!\left(\tfrac{\pi}{3}(x - 1)\right) + 2.$$

Equations are not unique. A sine version starts a cycle on the midline going up, a quarter
period ($1.5$) before the max: $y = 3\sin\!\left(\tfrac{\pi}{3}(x + 0.5)\right) + 2$ describes the
same graph. Any phase shift can also change by a whole period.

## Summary table

| Constant | Effect | Formula |
|---|---|---|
| $A$ | amplitude, reflection if negative | amplitude $= \lvert A\rvert$ |
| $B$ | horizontal stretch or squeeze | period $= \dfrac{2\pi}{B}$ |
| $C$ | horizontal shift | phase shift $= C$ (right if positive) |
| $D$ | vertical shift | midline $y = D$ |

## Common mistakes

- **Not factoring before reading the phase shift.** $\sin(3x + \pi)$ shifts $\tfrac{\pi}{3}$ left,
  not $\pi$ left.
- **Using $B$ itself as the period.** The period is $\tfrac{2\pi}{B}$.
- **Measuring the amplitude from the $x$-axis** when the graph has been shifted up. Measure
  from the midline: half of (max $-$ min).
- **Sign of the shift.** $x - C$ shifts right by $C$; $x + C$ shifts left.

## Key points

- $y = A\sin(B(x - C)) + D$: amplitude $|A|$, period $\tfrac{2\pi}{B}$, phase shift $C$, midline $y = D$.
- Factor $B$ out of the argument before reading the phase shift.
- One cycle runs from $x = C$ to $x = C + \tfrac{2\pi}{B}$; mark quarter points.
- From a graph: $D = \tfrac{\max + \min}{2}$, $|A| = \tfrac{\max - \min}{2}$, period from
  peak-to-peak distance.
