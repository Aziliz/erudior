---
id: calc-ftc
module: calc-m6
title: The Fundamental Theorem of Calculus
minutes: 40
topics: [Fundamental Theorem of Calculus]
drills: [calc-d-ftc-eval, calc-d-ftc1]
refs: [calc-ref-integrals]
---
## Two ideas, one theorem

Differentiation (slopes, rates) and integration (areas, accumulation) were built separately, from different problems. The **Fundamental Theorem of Calculus** (FTC) says they are inverse processes. This is the most important theorem in the course: it turns the painful limit of Riemann sums from Lesson 22 into a one-line calculation, and it explains why antiderivatives and areas share the symbol $\int$.

## Accumulation functions

Fix a lower limit $a$ and let the upper limit vary. The **accumulation function**

$$g(x) = \int_a^x f(t)\,dt$$

gives the net area under $f$ from $a$ up to $x$. (The variable inside is called $t$ because $x$ is already in use as the upper limit; $t$ is a dummy variable.)

```plot
{"x": [-0.5, 5], "y": [-0.5, 3.5], "functions": [{"f": "1 + 0.5x + 0.3sin(2x)", "label": "y = f(t)"}], "shade": [{"f": "1 + 0.5x + 0.3sin(2x)", "from": 0.5, "to": 3}], "points": [{"at": [3, 0], "label": "x"}, {"at": [0.5, 0], "label": "a"}], "xLabel": "t", "caption": "g(x) is the shaded area from a to x; slide x right and the area grows at rate f(x)"}
```

How fast does $g$ change as $x$ moves? Nudge $x$ by $h$. The extra area is a thin strip of width $h$ and height about $f(x)$, so
$$g(x + h) - g(x) \approx f(x)\,h \quad\Longrightarrow\quad \frac{g(x + h) - g(x)}{h} \approx f(x).$$
As $h\to0$ the approximation becomes exact (because $f$ is continuous). That is the first half of the theorem.

## FTC Part 1

**FTC 1.** If $f$ is continuous on $[a, b]$, then $g(x) = \int_a^x f(t)\,dt$ is differentiable on $(a, b)$ and

$$\frac{d}{dx}\int_a^x f(t)\,dt = f(x).$$

The rate at which area accumulates equals the height of the curve at the moving edge. Consequence: every continuous function has an antiderivative, namely its accumulation function.

### Example 1

Find $\dfrac{d}{dx}\displaystyle\int_1^x\sqrt{t^3 + 1}\,dt$.

By FTC 1, it's $\sqrt{x^3 + 1}$. No integration needed (and none possible in elementary terms).

### Example 2 (chain rule version)

Find $\dfrac{d}{dx}\displaystyle\int_0^{x^2}\cos t\,dt$.

The upper limit is $u = x^2$, not $x$. Let $G(u) = \int_0^u\cos t\,dt$, so $G'(u) = \cos u$. By the chain rule,
$$\frac{d}{dx}G(x^2) = \cos(x^2)\cdot2x.$$

In general,

$$\frac{d}{dx}\int_a^{u(x)}f(t)\,dt = f(u(x))\,u'(x).$$

If the variable is in the lower limit, flip the limits first (which adds a minus sign): $\frac{d}{dx}\int_x^5 e^{t^2}dt = -e^{x^2}$. With variables in both limits, split at a constant: $\frac{d}{dx}\int_{v(x)}^{u(x)}f(t)\,dt = f(u)u' - f(v)v'$.

## FTC Part 2 (the evaluation theorem)

**FTC 2.** If $f$ is continuous on $[a, b]$ and $F$ is any antiderivative of $f$, then

$$\int_a^b f(x)\,dx = F(b) - F(a).$$

We write $F(b) - F(a)$ as $\Big[F(x)\Big]_a^b$ or $F(x)\Big|_a^b$.

**Why it follows from Part 1.** $g(x) = \int_a^x f(t)\,dt$ is one antiderivative of $f$, so any other is $F = g + C$. Then $F(b) - F(a) = g(b) - g(a) = \int_a^b f - 0$.

The constant $C$ cancels in $F(b) - F(a)$, so you can always use $C = 0$.

### Example 3

Evaluate $\displaystyle\int_0^2 x^2\,dx$.

$F(x) = \frac{x^3}{3}$, so $\left[\frac{x^3}{3}\right]_0^2 = \frac83 - 0 = \mathbf{\frac83}$. Compare Lesson 22's page of Riemann-sum algebra.

### Example 4

Evaluate $\displaystyle\int_1^4\left(3\sqrt x - \frac{2}{x}\right)dx$.

Antiderivative: $3\cdot\frac{x^{3/2}}{3/2} - 2\ln x = 2x^{3/2} - 2\ln x$.
$$\Big[2x^{3/2} - 2\ln x\Big]_1^4 = (2\cdot8 - 2\ln4) - (2 - 0) = \mathbf{14 - 2\ln 4} \approx 11.23.$$

### Example 5

Evaluate $\displaystyle\int_0^{\pi}\sin x\,dx$.

$\Big[-\cos x\Big]_0^{\pi} = -\cos\pi - (-\cos0) = 1 + 1 = \mathbf 2$. One arch of the sine curve has area exactly 2.

## The net change theorem

FTC 2 applied to $F'$ in place of $f$:

$$\int_a^b F'(x)\,dx = F(b) - F(a).$$

The integral of a rate of change is the total (net) change. If water flows into a tank at $r(t)$ liters per minute, then $\int_0^{10}r(t)\,dt$ is the net number of liters added in the first 10 minutes. Lesson 25 develops this.

## Analyzing accumulation functions

FTC 1 lets you analyze $g(x) = \int_a^x f(t)\,dt$ using the graph of $f$ alone, because $g' = f$ and $g'' = f'$:

- $g$ increases where $f > 0$ and decreases where $f < 0$.
- $g$ has a local max where $f$ changes from $+$ to $-$; a local min where $f$ changes from $-$ to $+$.
- $g$ is concave up where $f$ is increasing; inflection points where $f$ has a local max or min.
- Values of $g$ come from areas: $g(a) = 0$, and $g(x)$ adds or subtracts areas between $a$ and $x$.

### Example 6

$f$ is the line $f(t) = 2 - t$ on $[0, 4]$, and $g(x) = \int_0^x f(t)\,dt$. Find $g(2)$, $g(4)$, and where $g$ has its maximum on $[0, 4]$.

- $g(2)$: triangle above the axis from 0 to 2, base 2, height 2: area 2. So $g(2) = 2$.
- $g(4)$: add the triangle below the axis from 2 to 4 (area 2, counted negative): $g(4) = 2 - 2 = 0$.
- $g' = f$ changes from positive to negative at $t = 2$, so $g$ is largest at $x = 2$, where $g = 2$.

## Common mistakes

- *Subtracting in the wrong order.* It's $F(b) - F(a)$: upper minus lower.
- *Forgetting the chain rule* in FTC 1 when the limit is a function of $x$.
- **Writing $\frac{d}{dx}\int_a^x f(t)\,dt = f(t)$.** The answer is in terms of $x$: $f(x)$.
- **Using FTC 2 across a discontinuity.** $\int_{-1}^1\frac{1}{x^2}dx$ is not $\left[-\frac1x\right]_{-1}^1 = -2$; the integrand blows up at 0 (an improper integral, Lesson 35). A positive function can't have a negative integral.
- **Keeping $+C$ in a definite integral** (harmless, but it cancels).

## Key points

- FTC 1: $\frac{d}{dx}\int_a^x f(t)\,dt = f(x)$; with a function limit, $\frac{d}{dx}\int_a^{u(x)}f(t)\,dt = f(u(x))u'(x)$.
- FTC 2: $\int_a^b f(x)\,dx = F(b) - F(a)$ for any antiderivative $F$.
- Net change: $\int_a^b F'(x)\,dx = F(b) - F(a)$.
- For $g(x) = \int_a^x f(t)\,dt$: $g' = f$, so read $g$'s increase, extrema and concavity from $f$.
