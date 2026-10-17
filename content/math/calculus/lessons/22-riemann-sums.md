---
id: calc-riemann-sums
module: calc-m6
title: Riemann sums and the definite integral
minutes: 40
topics: [Riemann sums, Definite integral]
drills: [calc-d-riemann, calc-d-sigma, calc-d-geometric-area]
refs: [calc-ref-integrals]
---
## The area problem

Derivatives came from the tangent problem. Integrals come from the **area problem**: find the area of the region under a curve $y = f(x) \ge 0$, above the $x$-axis, from $x = a$ to $x = b$. For rectangles and triangles we have formulas; for a curved boundary we don't. The plan is the same one that worked for slopes: approximate, then take a limit.

The same computation answers many other questions. If $v(t)$ is a velocity, the "area" under its graph is a distance. If $r(t)$ is a flow rate, the area is a total amount. Areas are just the picture.

## Sigma notation

Sums of many terms are written with **sigma notation**:

$$\sum_{i=1}^{n} a_i = a_1 + a_2 + \cdots + a_n.$$

$i$ is the index; it runs from the lower limit 1 to the upper limit $n$. For example, $\sum_{i=1}^{4} i^2 = 1 + 4 + 9 + 16 = 30$.

Sums split and scale like integrals do: $\sum(a_i + b_i) = \sum a_i + \sum b_i$ and $\sum ca_i = c\sum a_i$. Three formulas come up often:

$$\sum_{i=1}^n 1 = n, \qquad \sum_{i=1}^n i = \frac{n(n + 1)}{2}, \qquad \sum_{i=1}^n i^2 = \frac{n(n + 1)(2n + 1)}{6}.$$

## Riemann sums

Divide $[a, b]$ into $n$ subintervals of equal width

$$\Delta x = \frac{b - a}{n},$$

with endpoints $x_i = a + i\,\Delta x$ for $i = 0, 1, \dots, n$. On each subinterval build a rectangle whose height is $f$ at some sample point $x_i^*$ in that subinterval. The total area of the rectangles is a **Riemann sum**:

$$\sum_{i=1}^{n} f(x_i^*)\,\Delta x.$$

Common choices of sample point:

- **Left Riemann sum** $L_n$: left endpoints, $x_i^* = x_{i-1}$.
- **Right Riemann sum** $R_n$: right endpoints, $x_i^* = x_i$.
- **Midpoint sum** $M_n$: midpoints, $x_i^* = \frac{x_{i-1} + x_i}{2}$.

### Example 1

Approximate the area under $f(x) = x^2$ on $[0, 2]$ with $n = 4$ using left, right and midpoint sums.

$\Delta x = \frac{2 - 0}{4} = 0.5$; endpoints $0, 0.5, 1, 1.5, 2$.

- $L_4 = 0.5\left[f(0) + f(0.5) + f(1) + f(1.5)\right] = 0.5(0 + 0.25 + 1 + 2.25) = \mathbf{1.75}$.
- $R_4 = 0.5\left[f(0.5) + f(1) + f(1.5) + f(2)\right] = 0.5(0.25 + 1 + 2.25 + 4) = \mathbf{3.75}$.
- $M_4 = 0.5\left[f(0.25) + f(0.75) + f(1.25) + f(1.75)\right] = 0.5(0.0625 + 0.5625 + 1.5625 + 3.0625) = \mathbf{2.625}$.

The exact area turns out to be $\frac83 \approx 2.667$. The left sum underestimates and the right sum overestimates because $x^2$ is increasing on $[0, 2]$; the midpoint sum is much closer.

```plot
{"x": [-0.2, 2.3], "y": [-0.3, 4.5], "bars": [{"x": 0.25, "height": 0.25, "width": 0.5}, {"x": 0.75, "height": 1, "width": 0.5}, {"x": 1.25, "height": 2.25, "width": 0.5}, {"x": 1.75, "height": 4, "width": 0.5}], "functions": [{"f": "x^2", "label": "y = x²"}], "caption": "Right Riemann sum R₄: each rectangle's height is f at its right end, so it overshoots"}
```

*Over or under?* For an increasing function, left sums underestimate and right sums overestimate; for a decreasing function it's the reverse. (Concavity governs midpoint and trapezoid errors; see Lesson 34.)

## Trapezoidal sums and uneven data

A fourth approximation replaces each rectangle with a trapezoid whose slanted top joins the curve's values at the two ends of the subinterval. One trapezoid has area $\frac12\left[f(x_{i-1}) + f(x_i)\right]\Delta x_i$, the average of the left and right rectangles. Adding them gives a **trapezoidal sum**. For Example 1 it's $\frac{L_4 + R_4}{2} = \frac{1.75 + 3.75}{2} = 2.75$.

Nothing here requires equal widths. Data from a table often come at uneven times, and then each piece uses its own width $\Delta x_i$. If $r(0) = 4$, $r(1) = 6$, $r(4) = 9$ (liters per hour), a trapezoidal sum for $\int_0^4 r(t)\,dt$ is $\frac{4 + 6}{2}(1) + \frac{6 + 9}{2}(3) = 5 + 22.5 = 27.5$ liters, and a left sum is $4(1) + 6(3) = 22$ liters. AP problems use exactly this kind of table.

## The definite integral

As $n \to \infty$ the rectangles get thinner and the sums close in on the true area. For continuous $f$, the limit exists and doesn't depend on which sample points you use. It is the **definite integral**:

$$\int_a^b f(x)\,dx = \lim_{n\to\infty}\sum_{i=1}^n f(x_i^*)\,\Delta x.$$

The notation mirrors the sum: $\int$ is a stretched S for "sum," $f(x)$ is the height, $dx$ the width. $a$ and $b$ are the **limits of integration** (lower and upper). A function for which the limit exists is **integrable**; every continuous function on $[a, b]$ is, and so is every function with finitely many jump discontinuities.

A definite integral is a *number*. An indefinite integral is a *family of functions*. The next lesson explains why they share a symbol.

### Example 2 (a limit of Riemann sums)

Compute $\int_0^2 x^2\,dx$ from the definition, using right endpoints.

$\Delta x = \frac2n$ and $x_i = \frac{2i}{n}$, so
$$R_n = \sum_{i=1}^n\left(\frac{2i}{n}\right)^2\frac2n = \frac{8}{n^3}\sum_{i=1}^n i^2 = \frac{8}{n^3}\cdot\frac{n(n + 1)(2n + 1)}{6}.$$
As $n\to\infty$, $\frac{n(n+1)(2n+1)}{n^3} \to 2$, so $R_n \to \frac{8\cdot2}{6} = \mathbf{\frac83}$.

That works but is laborious. Lesson 23 gives a far faster route.

## Net signed area

If $f$ takes negative values, the terms $f(x_i^*)\Delta x$ are negative there. So the definite integral measures **net signed area**: area above the axis counts positive, area below counts negative.

$$\int_a^b f(x)\,dx = (\text{area above}) - (\text{area below}).$$

### Example 3

Evaluate $\int_{-1}^{3}(x - 1)\,dx$ using geometry.

The line $y = x - 1$ is below the axis on $[-1, 1]$ (a triangle with base 2, height 2, area 2) and above it on $[1, 3]$ (base 2, height 2, area 2). Net: $2 - 2 = \mathbf 0$. The total area (counting both as positive) would be 4.

```plot
{"x": [-1.5, 3.5], "y": [-2.5, 2.5], "functions": [{"f": "x - 1"}], "shade": [{"f": "x - 1", "from": -1, "to": 3}], "caption": "Equal areas above and below the axis cancel: the integral is 0"}
```

When the region is made of familiar shapes (triangles, rectangles, semicircles), use geometry. For example, $\int_{-3}^{3}\sqrt{9 - x^2}\,dx$ is the area of a semicircle of radius 3: $\frac12\pi(3)^2 = \frac{9\pi}{2}$.

## Properties of the definite integral

| Property | Statement |
|---|---|
| Zero width | $\int_a^a f\,dx = 0$ |
| Reversed limits | $\int_b^a f\,dx = -\int_a^b f\,dx$ |
| Constant | $\int_a^b c\,dx = c(b - a)$ |
| Linearity | $\int_a^b(cf \pm g)\,dx = c\int_a^b f\,dx \pm \int_a^b g\,dx$ |
| Additivity | $\int_a^b f\,dx + \int_b^c f\,dx = \int_a^c f\,dx$ |
| Comparison | if $f \le g$ on $[a, b]$, then $\int_a^b f \le \int_a^b g$ |
| Bounds | if $m \le f \le M$, then $m(b - a) \le \int_a^b f \le M(b - a)$ |

### Example 4

Given $\int_0^5 f(x)\,dx = 8$ and $\int_0^2 f(x)\,dx = 3$, find $\int_2^5 f(x)\,dx$ and $\int_5^2 4f(x)\,dx$.

- Additivity: $\int_2^5 f = 8 - 3 = 5$.
- Reverse and scale: $\int_5^2 4f = -4\int_2^5 f = -20$.

## Common mistakes

- **Wrong $\Delta x$.** It's $\frac{b - a}{n}$, not $\frac1n$ (unless the interval has length 1).
- *Off-by-one sample points.* A left sum on $[0, 2]$ with $n = 4$ uses $x = 0, 0.5, 1, 1.5$ (not 2).
- *Treating net signed area as total area.* Regions below the axis subtract.
- **Thinking $\int_a^b f\,dx$ depends on the letter $x$.** It doesn't: $\int_0^2 t^2\,dt = \int_0^2 x^2\,dx$ (a dummy variable).
- *Forgetting the sign when reversing limits.*

## Key points

- Riemann sum: $\sum f(x_i^*)\Delta x$ with $\Delta x = \frac{b - a}{n}$; left, right and midpoint choices.
- $\int_a^b f(x)\,dx = \lim_{n\to\infty}\sum f(x_i^*)\Delta x$: net signed area.
- For increasing $f$: left sums under, right sums over (reverse for decreasing).
- Use geometry when the region is made of simple shapes.
- Know the properties: reversing limits, additivity, linearity, comparison.
