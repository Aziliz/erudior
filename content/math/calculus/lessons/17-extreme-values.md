---
id: calc-extreme-values
module: calc-m5
title: Extreme values and the Mean Value Theorem
minutes: 35
topics: [Extreme values, Mean Value Theorem]
drills: [calc-d-closed-interval, calc-d-mvt-c]
refs: [calc-ref-derivatives]
---
## Finding the highest and lowest points

Module 5 uses derivatives to analyze the shape of a function: where it's highest and lowest, where it rises and falls, how it bends. This lesson starts with the biggest question, the largest and smallest values a function takes, and then proves the Mean Value Theorem, the result that justifies everything else in the module.

## Absolute and local extrema

Let $c$ be in the domain of $f$.

- $f(c)$ is an **absolute maximum** if $f(c) \ge f(x)$ for every $x$ in the domain, and an **absolute minimum** if $f(c) \le f(x)$ for every $x$. (Also called global extrema.)
- $f(c)$ is a **local maximum** if $f(c) \ge f(x)$ for all $x$ *near* $c$, and a **local minimum** similarly. (Also called relative extrema.)

"Extremum" (plural "extrema") means either a max or a min.

```plot
{"x": [-0.5, 6.5], "y": [-6, 14], "functions": [{"f": "0.5x^3 - 4.5x^2 + 12x - 5", "from": 0, "to": 6}], "points": [{"at": [0, -5], "label": "abs min"}, {"at": [2, 5], "label": "local max"}, {"at": [4, 3], "label": "local min"}, {"at": [6, 13]}], "caption": "Local extrema at x = 2 and x = 4; on [0, 6] the absolute min is at the left endpoint"}
```

## When must extrema exist?

**Extreme Value Theorem** (EVT). If $f$ is continuous on a closed interval $[a, b]$, then $f$ attains both an absolute maximum and an absolute minimum on $[a, b]$.

Both hypotheses matter. On the open interval $(0, 1)$, $f(x) = x$ never reaches a max (it gets close to 1 but never gets there). And a function with a jump or asymptote can avoid its extremes. Closed and continuous guarantees them.

## Where can extrema be?

**Fermat's theorem.** If $f$ has a local extremum at an interior point $c$ and $f'(c)$ exists, then $f'(c) = 0$.

Why: at a local max, the difference quotient $\frac{f(c + h) - f(c)}{h}$ is $\le 0$ for small $h > 0$ (the function can't go up) and $\ge 0$ for small $h < 0$. A limit that is both $\le 0$ and $\ge 0$ must be 0.

So local extrema can only occur where $f' = 0$ or where $f'$ doesn't exist. Those points get a name: a **critical number** (or critical point) of $f$ is a number $c$ in the domain where $f'(c) = 0$ or $f'(c)$ is undefined.

Careful: a critical number is only a *candidate*. $f(x) = x^3$ has $f'(0) = 0$, but 0 is neither a max nor a min; the graph just flattens and keeps rising.

## The closed interval method

To find the absolute max and min of a continuous $f$ on $[a, b]$:

1. Find the critical numbers of $f$ in $(a, b)$.
2. Evaluate $f$ at each critical number and at the endpoints $a$ and $b$.
3. The largest value is the absolute max; the smallest is the absolute min.

No tests for max vs min are needed; you're just comparing a short list of numbers.

### Example 1

Find the absolute extrema of $f(x) = x^3 - 3x^2 - 9x + 2$ on $[-2, 6]$.

1. $f'(x) = 3x^2 - 6x - 9 = 3(x - 3)(x + 1)$. Critical numbers: $x = -1$ and $x = 3$, both inside $[-2, 6]$.
2. Evaluate:

| $x$ | $-2$ | $-1$ | $3$ | $6$ |
|---|---|---|---|---|
| $f(x)$ | $0$ | $7$ | $-25$ | $56$ |

3. Absolute max **56** at $x = 6$; absolute min **$-25$** at $x = 3$.

The local max at $x = -1$ ($f = 7$) isn't the absolute max on this interval; the right endpoint wins.

### Example 2

Find the absolute extrema of $g(x) = x^{2/3}(x - 5)$ on $[-1, 4]$.

Expand: $g(x) = x^{5/3} - 5x^{2/3}$, so
$$g'(x) = \tfrac53x^{2/3} - \tfrac{10}{3}x^{-1/3} = \frac{5x - 10}{3x^{1/3}}.$$
Critical numbers: $g'(x) = 0$ at $x = 2$; $g'(x)$ undefined at $x = 0$ (and $0$ is in the domain).

| $x$ | $-1$ | $0$ | $2$ | $4$ |
|---|---|---|---|---|
| $g(x)$ | $-6$ | $0$ | $2^{2/3}(-3) \approx -4.76$ | $4^{2/3}(-1) \approx -2.52$ |

Absolute max $0$ at $x = 0$ (a cusp); absolute min $-6$ at $x = -1$.

## Rolle's theorem and the Mean Value Theorem

**Rolle's theorem.** If $f$ is continuous on $[a, b]$, differentiable on $(a, b)$, and $f(a) = f(b)$, then there is a $c$ in $(a, b)$ with $f'(c) = 0$.

Why: by the EVT, $f$ has a max and a min on $[a, b]$. If both are at the endpoints, $f$ is constant (since $f(a) = f(b)$) and $f' = 0$ everywhere. Otherwise one of them is inside, and Fermat's theorem makes $f' = 0$ there.

Now tilt the picture. **Mean Value Theorem** (MVT). If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, then there is at least one $c$ in $(a, b)$ with

$$f'(c) = \frac{f(b) - f(a)}{b - a}.$$

Somewhere, the instantaneous rate equals the average rate: some tangent line is parallel to the secant line.

```plot
{"x": [-0.5, 4.5], "y": [-1, 7], "functions": [{"f": "x^3 - 6x^2 + 9x + 1", "label": "f"}, {"f": "1 + x", "from": 0, "to": 4, "dashed": true, "label": "secant"}], "tangents": [{"f": "x^3 - 6x^2 + 9x + 1", "at": 0.8453}, {"f": "x^3 - 6x^2 + 9x + 1", "at": 3.1547}], "points": [{"at": [0, 1]}, {"at": [4, 5]}], "caption": "Two tangents parallel to the secant from (0, 1) to (4, 5): c ≈ 0.845 and c ≈ 3.155"}
```

The everyday version: if you drive 120 miles in 2 hours, your speedometer read exactly 60 mph at some instant.

### Example 3

Verify the MVT for $f(x) = x^3 - x$ on $[0, 2]$ and find every $c$.

$f$ is a polynomial, so it's continuous and differentiable everywhere. Average rate: $\frac{f(2) - f(0)}{2 - 0} = \frac{6 - 0}{2} = 3$. Solve $f'(c) = 3c^2 - 1 = 3$: $c^2 = \frac43$, $c = \pm\frac{2}{\sqrt3}$. Only $c = \frac{2}{\sqrt3} \approx 1.155$ is in $(0, 2)$.

### Example 4 (when the MVT doesn't apply)

$f(x) = |x|$ on $[-1, 2]$: average rate $\frac{2 - 1}{3} = \frac13$, but $f'$ is only ever $\pm1$. No contradiction: $f$ isn't differentiable at 0, so the hypotheses fail.

## Consequences of the MVT

The MVT turns information about $f'$ into information about $f$:

- **If $f' = 0$ on an interval, $f$ is constant there.** (Any two values differ by $f'(c)(b - a) = 0$.)
- **If $f' = g'$ on an interval, then $f = g + C$.** Functions with the same derivative differ by a constant; this is the foundation of antiderivatives (Lesson 21).
- **If $f' > 0$ on an interval, $f$ is increasing there** (next lesson).
- *Bounds:* if $|f'| \le M$, then $|f(b) - f(a)| \le M|b - a|$.

## Common mistakes

- *Forgetting the endpoints* in the closed interval method.
- **Missing critical numbers where $f'$ is undefined** (cusps, corners, like $x = 0$ in Example 2).
- *Including critical numbers outside the interval.*
- *Assuming every critical number is an extremum.* $x^3$ at 0 isn't.
- **Reporting $x$ when asked for the value.** The maximum *value* is $f(c)$; it occurs *at* $x = c$.
- *Applying the MVT without checking continuity and differentiability.*

## Key points

- EVT: continuous on $[a, b]$ ⇒ absolute max and min exist.
- Critical numbers: $f'(c) = 0$ or undefined (with $c$ in the domain). Local extrema occur only there.
- Closed interval method: evaluate $f$ at critical numbers and endpoints; compare.
- MVT: $f'(c) = \frac{f(b) - f(a)}{b - a}$ for some $c$ in $(a, b)$; Rolle's theorem is the case $f(a) = f(b)$.
- $f' = 0$ ⇒ constant; $f' = g'$ ⇒ $f = g + C$.
