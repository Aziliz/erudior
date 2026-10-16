---
id: calc-concavity
module: calc-m5
title: Concavity, the second derivative test and curve sketching
minutes: 35
topics: [Concavity, Curve sketching]
drills: [calc-d-inflection, calc-d-second-test]
refs: [calc-ref-derivatives]
---
## How a graph bends

The first derivative says whether a graph goes up or down. Two increasing graphs can still look very different: one curving upward like a ramp getting steeper, the other leveling off like a learning curve. The second derivative captures that difference. This lesson defines concavity, gives a second test for extrema, and puts everything together into a curve-sketching routine.

## Concavity

A function is **concave up** on an interval if its slopes are increasing there ($f'$ is increasing): the graph bends upward like a cup and lies above its tangent lines. It is **concave down** if $f'$ is decreasing: the graph bends like a cap and lies below its tangent lines.

*Concavity test.*
- If $f''(x) > 0$ on an interval, $f$ is concave up there.
- If $f''(x) < 0$ on an interval, $f$ is concave down there.

(Apply the increasing/decreasing test to $f'$: $f'' > 0$ means $f'$ increases.)

```plot
{"x": [-3, 3], "y": [-5, 5], "functions": [{"f": "x^3 - 3x", "label": "y = x³ − 3x"}], "points": [{"at": [0, 0], "label": "inflection point"}], "labels": [{"at": [-2.6, -3.5], "text": "concave down"}, {"at": [1.2, 3.5], "text": "concave up"}], "caption": "f″(x) = 6x: concave down for x < 0, up for x > 0"}
```

A point on the graph where concavity changes is an **inflection point**. Inflection points can occur only where $f'' = 0$ or $f''$ is undefined, but (as with critical numbers) that's only a candidate list; you must check that $f''$ actually changes sign.

### Example 1

Find the intervals of concavity and the inflection points of $f(x) = x^4 - 6x^2 + 3$.

$f'(x) = 4x^3 - 12x$, $f''(x) = 12x^2 - 12 = 12(x - 1)(x + 1)$. Candidates: $x = \pm1$.

| Interval | Test | $f''$ | Concavity |
|---|---|---|---|
| $(-\infty, -1)$ | $-2$ | $36 > 0$ | up |
| $(-1, 1)$ | $0$ | $-12 < 0$ | down |
| $(1, \infty)$ | $2$ | $36 > 0$ | up |

Concavity changes at both, so the inflection points are $(-1, -2)$ and $(1, -2)$.

A candidate that fails: $f(x) = x^4$ has $f''(0) = 0$, but $f'' = 12x^2 \ge 0$ on both sides. No sign change, no inflection point; $x^4$ is concave up everywhere.

## The second derivative test

At a critical number where $f'(c) = 0$, concavity tells you which way the graph bends at the flat spot.

**Second derivative test.** Suppose $f'(c) = 0$ and $f''$ is continuous near $c$.
- If $f''(c) > 0$, $f$ has a local *minimum* at $c$ (flat and cupped up: a valley).
- If $f''(c) < 0$, $f$ has a local *maximum* at $c$ (flat and capped: a peak).
- If $f''(c) = 0$, the test is **inconclusive**: use the first derivative test.

### Example 2

Use the second derivative test on $f(x) = x^4 - 6x^2 + 3$ from Example 1.

$f'(x) = 4x(x^2 - 3)$: critical numbers $0$ and $\pm\sqrt3$. With $f''(x) = 12x^2 - 12$:
- $f''(0) = -12 < 0$: local max $f(0) = 3$.
- $f''(\pm\sqrt3) = 36 - 12 = 24 > 0$: local minima $f(\pm\sqrt3) = 9 - 18 + 3 = -6$.

When the test is inconclusive anything can happen: $x^4$ (min), $-x^4$ (max), and $x^3$ (neither) all have $f'(0) = f''(0) = 0$.

## Reading $f$, $f'$, $f''$ together

| Statement about $f$ | $f'$ | $f''$ |
|---|---|---|
| increasing | positive | |
| decreasing | negative | |
| concave up | increasing | positive |
| concave down | decreasing | negative |
| local max/min | changes sign | |
| inflection point | has a local max or min | changes sign |

The last row is useful with graphs of $f'$: inflection points of $f$ sit where the graph of $f'$ peaks or bottoms out.

## Curve sketching

To sketch $y = f(x)$ by hand:

1. *Domain*, and intercepts if easy.
2. *Symmetry* (even/odd) and **asymptotes**: vertical (where the function blows up), horizontal (limits at $\pm\infty$).
3. **$f'$**: critical numbers, increasing/decreasing intervals, local extrema.
4. **$f''$**: concavity intervals, inflection points.
5. *Plot* the key points and connect them with the right shapes.

### Example 3

Sketch $f(x) = \dfrac{x^2}{x^2 - 4}$.

1. Domain: $x \ne \pm2$. Intercept: $(0, 0)$.
2. Even function (symmetric about the $y$-axis). Vertical asymptotes $x = \pm2$. Horizontal asymptote $y = 1$ (equal degrees).
3. $f'(x) = \dfrac{2x(x^2 - 4) - x^2(2x)}{(x^2 - 4)^2} = \dfrac{-8x}{(x^2 - 4)^2}$. Sign: positive for $x < 0$, negative for $x > 0$ (avoiding $\pm2$). So $f$ increases on $(-\infty, -2)$ and $(-2, 0]$, decreases on $[0, 2)$ and $(2, \infty)$. Local max $f(0) = 0$.
4. $f''(x) = \dfrac{24x^2 + 32}{(x^2 - 4)^3}$. The numerator is always positive, so the sign is the sign of $(x^2 - 4)^3$: concave up for $|x| > 2$, concave down for $|x| < 2$. No inflection points (concavity changes only across the asymptotes, which aren't in the domain).

```plot
{"x": [-6, 6], "y": [-5, 6], "functions": [{"f": "x^2/(x^2 - 4)"}, {"f": "1", "dashed": true}], "segments": [{"from": [-2, -5], "to": [-2, 6], "dashed": true}, {"from": [2, -5], "to": [2, 6], "dashed": true}], "points": [{"at": [0, 0], "label": "local max"}], "caption": "y = x²/(x² − 4)"}
```

## Common mistakes

- **Declaring an inflection point from $f''(c) = 0$ alone.** Check for a sign change.
- *Calling a point an inflection point when it's not on the graph.* It must be in the domain.
- *Mixing up the second derivative test signs.* $f'' > 0$ (cup) ⇒ min; $f'' < 0$ (cap) ⇒ max.
- *Treating "inconclusive" as "neither."* $f''(c) = 0$ tells you nothing; go back to the first derivative test.
- *Confusing "increasing" with "concave up."* A graph can be decreasing and concave up (like $e^{-x}$).

## Key points

- $f'' > 0$: concave up (lies above tangents); $f'' < 0$: concave down.
- Inflection point: concavity changes; candidates where $f'' = 0$ or undefined.
- Second derivative test at $f'(c) = 0$: $f''(c) > 0$ min, $< 0$ max, $= 0$ inconclusive.
- Curve sketching: domain, intercepts, symmetry, asymptotes, $f'$ chart, $f''$ chart, plot.
