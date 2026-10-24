---
id: trig-graph-sincos
module: trig-m4
title: Graphs of sine and cosine
minutes: 30
topics: [Graphs of sine and cosine]
drills: [trig-d-read-graph, trig-d-sincos-value]
refs: [trig-ref-unit-circle]
---
## Unrolling the unit circle

The properties from the last lesson (period $2\pi$, range $[-1, 1]$, sine odd and cosine
even) already describe the shape of the graphs. This lesson draws them. Picture a point
moving counterclockwise around the unit circle at one unit of arc per second. Its height
at time $t$ is $\sin t$, and its horizontal position is $\cos t$. Plotting the height
against $t$ "unrolls" the circle into a wave.

The picture shows one moment of that motion. The point has traveled an arc of length $t$, so on
the graph it is plotted at $x = t$, at the same height $\sin t$.

![On the left, the unit circle with a point P at angle t in quadrant I: a blue arc of length t runs from (1, 0) to P, a green horizontal leg of length cos t and a red vertical leg of length sin t form a right triangle. On the right, the graph of y = sin x from 0 to 2π. A dashed line carries the height of P across to the point (t, sin t) on the graph, where a red segment of the same length sin t stands above x = t.](images/trig-m4-unroll.svg)

## The graph of $y = \sin x$

From the unit circle: the height starts at 0, rises to 1 at a quarter turn, returns to 0
at a half turn, falls to $-1$ at three quarters of a turn, and is back to 0 after a full
turn. Then everything repeats.

```plot
{"x": [-6.6, 6.6], "y": [-1.6, 1.6], "functions": [{"f": "sin(x)", "label": "y = sin x"}], "points": [{"at": [0, 0]}, {"at": [1.5708, 1], "label": "(π/2, 1)"}, {"at": [3.1416, 0], "label": "(π, 0)"}, {"at": [4.7124, -1], "label": "(3π/2, −1)"}, {"at": [6.2832, 0]}], "caption": "y = sin x; one cycle runs from 0 to 2π"}
```

One complete repetition of the wave is a **cycle**. For $y = \sin x$, a cycle runs from
$0$ to $2\pi$, and the five **key points** that split it into quarters are
$$(0, 0),\ \left(\tfrac{\pi}{2}, 1\right),\ (\pi, 0),\ \left(\tfrac{3\pi}{2}, -1\right),\ (2\pi, 0).$$
They are the zero, maximum, zero, minimum, zero of one cycle. To sketch, plot those five
points and join them with a smooth curve that is rounded at the peaks and steepest where
it crosses the axis.

Features to read off the graph:

- domain: all reals; range: $[-1, 1]$;
- **zeros** (x-intercepts) at $x = k\pi$;
- maximum value 1 at $x = \tfrac{\pi}{2} + 2k\pi$, minimum value $-1$ at $x = \tfrac{3\pi}{2} + 2k\pi$;
- symmetric about the origin, because sine is odd.

Any graph with this wavy shape (stretched, shifted or flipped) is called a **sinusoid**.

## The graph of $y = \cos x$

Cosine is the horizontal coordinate. It starts at 1, drops to 0 at a quarter turn, reaches
$-1$ at a half turn, returns to 0 at three quarters and to 1 at a full turn. Its key points
are
$$(0, 1),\ \left(\tfrac{\pi}{2}, 0\right),\ (\pi, -1),\ \left(\tfrac{3\pi}{2}, 0\right),\ (2\pi, 1).$$

```plot
{"x": [-6.6, 6.6], "y": [-1.6, 1.6], "functions": [{"f": "cos(x)", "label": "y = cos x"}, {"f": "sin(x)", "dashed": true, "label": "sin x"}], "points": [{"at": [0, 1], "label": "(0, 1)"}, {"at": [3.1416, -1], "label": "(π, −1)"}], "caption": "y = cos x (solid) is y = sin x (dashed) shifted left by π/2"}
```

The cosine graph is the sine graph shifted $\tfrac{\pi}{2}$ to the left:
$$\cos x = \sin\left(x + \tfrac{\pi}{2}\right).$$
It is symmetric about the $y$-axis because cosine is even. Its zeros are at
$x = \tfrac{\pi}{2} + k\pi$, its maxima at $x = 2k\pi$ and its minima at $x = \pi + 2k\pi$.

## Stretching vertically: amplitude

Multiplying by a constant $a$ stretches the graph vertically. In $y = a\sin x$ every
$y$-value is multiplied by $a$, so the wave now runs between $-|a|$ and $|a|$. The number
$|a|$ is the **amplitude**: half the distance from the lowest point to the highest point.

If $a < 0$, the graph is also flipped across the $x$-axis (a **reflection**): $y = -\sin x$
goes *down* first instead of up.

### Example 1

Sketch one cycle of $y = 3\sin x$ and give its range.

Multiply each key point's $y$-coordinate by 3:
$(0, 0)$, $\left(\tfrac{\pi}{2}, 3\right)$, $(\pi, 0)$, $\left(\tfrac{3\pi}{2}, -3\right)$, $(2\pi, 0)$.
Amplitude 3, range $[-3, 3]$. The zeros don't move, because $3 \cdot 0 = 0$.

### Example 2

Sketch one cycle of $y = -2\cos x$ and compare it with $y = \cos x$.

Key points of $\cos x$ times $-2$: $(0, -2)$, $\left(\tfrac{\pi}{2}, 0\right)$, $(\pi, 2)$,
$\left(\tfrac{3\pi}{2}, 0\right)$, $(2\pi, -2)$. Amplitude $|-2| = 2$. The graph starts at its
minimum instead of its maximum: it's the cosine curve stretched by 2 and turned upside down.

```plot
{"x": [-0.5, 6.8], "y": [-3.4, 3.4], "functions": [{"f": "3sin(x)", "label": "y = 3 sin x"}, {"f": "-2cos(x)", "label": "y = −2 cos x"}, {"f": "sin(x)", "dashed": true}], "caption": "Amplitude 3 (sin) and amplitude 2 reflected (cos); dashed: y = sin x"}
```

### Example 3

Using the graph, find every $x$ in $[0, 2\pi]$ where $\cos x = 0$, and every $x$ in
$[-2\pi, 2\pi]$ where $\sin x$ has a maximum.

Cosine crosses the axis at $x = \tfrac{\pi}{2}$ and $x = \tfrac{3\pi}{2}$ in $[0, 2\pi]$.
Sine peaks at $\tfrac{\pi}{2} + 2k\pi$: in $[-2\pi, 2\pi]$ that's $x = -\tfrac{3\pi}{2}$ and $x = \tfrac{\pi}{2}$.

## Reading values from the graph

The graph is a picture of the unit-circle values. Between $0$ and $\tfrac{\pi}{2}$, sine
increases from 0 to 1 and cosine decreases from 1 to 0; they cross at $\tfrac{\pi}{4}$, where
both equal $\tfrac{\sqrt2}{2} \approx 0.707$. Values at $\tfrac{\pi}{6}$ and $\tfrac{\pi}{3}$ ($\tfrac12$ and
$\tfrac{\sqrt3}{2} \approx 0.866$) show that the curve rises fast near 0 and flattens near the top.

### Example 4: reflecting across the $y$-axis

Compare the graphs of $y = \sin(-x)$ and $y = \cos(-x)$ with the originals.

Replacing $x$ by $-x$ reflects a graph across the $y$-axis. Cosine is even, so $\cos(-x) = \cos x$:
the reflection changes nothing, which is what $y$-axis symmetry means. Sine is odd, so
$\sin(-x) = -\sin x$: reflecting across the $y$-axis gives the same picture as flipping across the
$x$-axis.

## Common mistakes

- **Treating the curve as a zigzag.** The peaks are rounded and the curve is steepest at
  the zeros; straight segments between key points are wrong.
- **Mixing up the starting points.** Sine starts a cycle at 0 going up; cosine starts at
  its maximum.
- **Giving a negative amplitude.** Amplitude is $|a|$. The sign of $a$ means a reflection.
- **Using degrees on the $x$-axis by accident.** Graphs in this course use radians: one
  cycle is $2\pi \approx 6.28$ units long.

## Key points

- $y = \sin x$: key points $(0,0), (\tfrac{\pi}{2},1), (\pi,0), (\tfrac{3\pi}{2},-1), (2\pi,0)$.
- $y = \cos x$: key points $(0,1), (\tfrac{\pi}{2},0), (\pi,-1), (\tfrac{3\pi}{2},0), (2\pi,1)$.
- Both have period $2\pi$ and range $[-1, 1]$; $\cos x = \sin(x + \tfrac{\pi}{2})$.
- $y = a\sin x$ and $y = a\cos x$ have amplitude $|a|$; $a < 0$ reflects across the $x$-axis.
