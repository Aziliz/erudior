---
id: calc-first-derivative-test
module: calc-m5
title: Increasing, decreasing and the first derivative test
minutes: 30
topics: [First derivative test]
drills: [calc-d-crit-points, calc-d-local-max]
refs: [calc-ref-derivatives]
---
## Reading the sign of $f'$

Lesson 17 found where extrema *might* be: at critical numbers. This lesson decides which critical numbers are local maxima, which are local minima, and which are neither, by looking at the sign of $f'$ on either side. It also tells you exactly where a function rises and falls.

## The increasing/decreasing test

A function is **increasing** on an interval if $x_1 < x_2$ implies $f(x_1) < f(x_2)$, and **decreasing** if it implies $f(x_1) > f(x_2)$.

*Increasing/decreasing test.*
- If $f'(x) > 0$ on an interval, $f$ is increasing on it.
- If $f'(x) < 0$ on an interval, $f$ is decreasing on it.

Why: for any $x_1 < x_2$ in the interval, the MVT gives a $c$ between them with $f(x_2) - f(x_1) = f'(c)(x_2 - x_1)$. If $f' > 0$, the right side is positive, so $f(x_2) > f(x_1)$.

The sign of $f'$ can only change at critical numbers (where $f' = 0$ or undefined) or at points outside the domain. So those points chop the number line into intervals where $f'$ keeps one sign, and one test value per interval tells you the sign.

## Sign charts

### Example 1

Where is $f(x) = 2x^3 - 3x^2 - 12x + 5$ increasing and decreasing?

1. $f'(x) = 6x^2 - 6x - 12 = 6(x - 2)(x + 1)$. Critical numbers: $x = -1, 2$.
2. Test a point in each interval:

| Interval | Test $x$ | $6(x - 2)(x + 1)$ | Sign of $f'$ | $f$ |
|---|---|---|---|---|
| $(-\infty, -1)$ | $-2$ | $6(-4)(-1) = 24$ | $+$ | increasing |
| $(-1, 2)$ | $0$ | $6(-2)(1) = -12$ | $-$ | decreasing |
| $(2, \infty)$ | $3$ | $6(1)(4) = 24$ | $+$ | increasing |

So $f$ increases on $(-\infty, -1]$ and $[2, \infty)$, and decreases on $[-1, 2]$.

```numberline
{"x": [-4, 5], "points": [{"at": [-1, 0], "label": "−1"}, {"at": [2, 0], "label": "2"}], "labels": [{"at": [-2.5, 0.5], "text": "f′ > 0"}, {"at": [0.5, 0.5], "text": "f′ < 0"}, {"at": [3.5, 0.5], "text": "f′ > 0"}], "caption": "Sign chart for f′(x) = 6(x − 2)(x + 1)"}
```

## The first derivative test

Suppose $c$ is a critical number of a continuous function $f$.

- If $f'$ changes from *positive to negative* at $c$, then $f$ has a **local maximum** at $c$ (rising, then falling).
- If $f'$ changes from *negative to positive* at $c$, then $f$ has a **local minimum** at $c$.
- If $f'$ does *not change sign* at $c$, there's no local extremum at $c$.

That's the **first derivative test**. In Example 1: $f'$ goes $+$ to $-$ at $x = -1$, so $f(-1) = 12$ is a local max; $-$ to $+$ at $x = 2$, so $f(2) = -15$ is a local min.

```plot
{"x": [-3, 4], "y": [-20, 16], "functions": [{"f": "2x^3 - 3x^2 - 12x + 5", "label": "f"}], "points": [{"at": [-1, 12], "label": "local max (−1, 12)"}, {"at": [2, -15], "label": "local min (2, −15)"}], "caption": "f rises, falls, then rises again"}
```

### Example 2

Classify the critical numbers of $g(x) = x^4 - 4x^3$.

$g'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$. Critical numbers: $0$ and $3$.

| Interval | Sign of $4x^2$ | Sign of $x - 3$ | $g'$ |
|---|---|---|---|
| $(-\infty, 0)$ | $+$ | $-$ | $-$ |
| $(0, 3)$ | $+$ | $-$ | $-$ |
| $(3, \infty)$ | $+$ | $+$ | $+$ |

- At $x = 0$: $g'$ is negative on both sides. *No extremum* (just a flat spot on the way down).
- At $x = 3$: $-$ to $+$, so $g(3) = 81 - 108 = -27$ is a local min (in fact the absolute min).

The squared factor $x^2$ never changes sign; factors raised to even powers don't flip the sign chart.

### Example 3 (a critical number where $f'$ is undefined)

Classify the critical numbers of $h(x) = x^{1/3}(x + 4)$.

$h(x) = x^{4/3} + 4x^{1/3}$, so $h'(x) = \frac43x^{1/3} + \frac43x^{-2/3} = \dfrac{4(x + 1)}{3x^{2/3}}$.

Critical numbers: $x = -1$ ($h' = 0$) and $x = 0$ ($h'$ undefined).

- On $(-\infty, -1)$: numerator negative, denominator positive: $h' < 0$.
- On $(-1, 0)$: $h' > 0$.
- On $(0, \infty)$: $h' > 0$.

So $h(-1) = -3$ is a local min, and at $x = 0$ there's no extremum (a vertical tangent while rising).

## Using a graph of $f'$

AP problems often give the graph of $f'$, not $f$. Read signs from it:

- Where the graph of $f'$ is above the $x$-axis, $f$ is increasing.
- Where $f'$ crosses the axis from above to below, $f$ has a local max; from below to above, a local min.
- Where $f'$ touches the axis without crossing, no extremum.

Don't read the max of the $f'$ graph as a max of $f$. The peak of $f'$ is where $f$ is *steepest*, an inflection point of $f$ (next lesson).

## Justifying answers

A complete justification names the sign change. For example: "$f$ has a local maximum at $x = -1$ because $f'$ changes from positive to negative there." Saying "$f'(-1) = 0$" alone is not enough, since $f' = 0$ also happens at non-extrema like $x = 0$ in Example 2.

## Common mistakes

- **Concluding an extremum from $f'(c) = 0$ alone.** You need a sign change.
- **Forgetting points where $f'$ is undefined** in the sign chart.
- *Even-power factors.* $(x - a)^2$ doesn't change sign at $a$.
- **Confusing the graphs of $f$ and $f'$.** Max of $f'$ ≠ max of $f$.
- *Using test points outside the domain*, or forgetting vertical asymptotes, where the sign can also change.

## Key points

- $f' > 0$ ⇒ increasing; $f' < 0$ ⇒ decreasing (by the MVT).
- Build a sign chart: critical numbers (and domain breaks) split the line; test one point per interval.
- First derivative test: $+\to-$ local max; $-\to+$ local min; no sign change, no extremum.
- Justify with the sign change of $f'$, not just $f'(c) = 0$.
