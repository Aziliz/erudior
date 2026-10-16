---
id: calc-power-series
module: calc-m10
title: Power series
minutes: 40
topics: [Power series]
drills: [calc-d-radius, calc-d-power-series-rep]
refs: [calc-ref-series]
---
## Infinite polynomials

So far each series was a sum of numbers. A **power series** has a variable in it:

$$\sum_{n=0}^\infty c_n(x - a)^n = c_0 + c_1(x - a) + c_2(x - a)^2 + \cdots.$$

It's a polynomial that never ends. The numbers $c_n$ are its coefficients and $a$ is its **center**. For each $x$ you plug in, you get a series of numbers that may converge or diverge. Where it converges, the power series defines a function of $x$. This lesson finds where that is, and shows how to build power series for familiar functions.

## The geometric power series

The most important example: with ratio $x$,

$$\sum_{n=0}^\infty x^n = 1 + x + x^2 + x^3 + \cdots = \frac{1}{1 - x}, \quad |x| < 1.$$

On $(-1, 1)$, the function $\frac{1}{1 - x}$ *is* this infinite polynomial. Outside that interval the series diverges, even though $\frac{1}{1 - x}$ is still defined (except at 1). A power series can represent a function on only part of its domain.

```plot
{"x": [-1.5, 1.2], "y": [-1, 8], "functions": [{"f": "1/(1 - x)", "label": "1/(1 − x)"}, {"f": "1 + x + x^2 + x^3", "dashed": true, "label": "degree 3"}, {"f": "1 + x + x^2 + x^3 + x^4 + x^5 + x^6 + x^7", "dashed": true, "label": "degree 7"}], "caption": "Partial sums hug 1/(1 − x) inside (−1, 1) and peel away outside"}
```

## Radius and interval of convergence

*Theorem.* For a power series centered at $a$, exactly one of these holds:
1. it converges only at $x = a$;
2. it converges for all $x$;
3. there is an $R > 0$ such that it converges (absolutely) for $|x - a| < R$ and diverges for $|x - a| > R$.

$R$ is the **radius of convergence** (with $R = 0$ in case 1 and $R = \infty$ in case 2). The set of all $x$ where it converges is the **interval of convergence**. At the two endpoints $x = a \pm R$ anything can happen, so they must be checked separately.

### How to find them

1. Apply the ratio test to $|a_n| = |c_n(x - a)^n|$ (keeping $x$ as a fixed number).
2. The ratio limit has the form $L = K|x - a|$. Convergence needs $L < 1$: $|x - a| < \frac1K = R$.
3. Test each endpoint by plugging it in and using the series tests (p-series, AST, divergence test…).

### Example 1

Find the interval of convergence of $\displaystyle\sum_{n=1}^\infty\frac{(x - 3)^n}{n\,2^n}$.

Ratio test:
$$\left|\frac{(x - 3)^{n+1}}{(n + 1)2^{n+1}}\cdot\frac{n\,2^n}{(x - 3)^n}\right| = \frac{n}{n + 1}\cdot\frac{|x - 3|}{2} \to \frac{|x - 3|}{2}.$$
Need $\frac{|x - 3|}{2} < 1$: $|x - 3| < 2$, so $R = 2$ and the open interval is $(1, 5)$.

Endpoints:
- $x = 5$: $\sum\frac{2^n}{n2^n} = \sum\frac1n$, harmonic: **diverges**.
- $x = 1$: $\sum\frac{(-2)^n}{n2^n} = \sum\frac{(-1)^n}{n}$, alternating harmonic: **converges**.

Interval of convergence: $\mathbf{[1, 5)}$.

### Example 2

Find the radius of convergence of $\displaystyle\sum\frac{x^n}{n!}$ and of $\displaystyle\sum n!\,x^n$.

- $\dfrac{|x|^{n+1}}{(n + 1)!}\cdot\dfrac{n!}{|x|^n} = \dfrac{|x|}{n + 1} \to 0 < 1$ for every $x$: $R = \infty$.
- $\dfrac{(n + 1)!|x|^{n+1}}{n!|x|^n} = (n + 1)|x| \to \infty$ unless $x = 0$: $R = 0$.

## Building new series from old

Start from $\frac{1}{1 - u} = \sum u^n$ ($|u| < 1$) and substitute, multiply, differentiate or integrate.

### Example 3 (substitution)

Find a power series for $\dfrac{1}{1 + x^2}$.

Replace $u$ by $-x^2$:
$$\frac{1}{1 + x^2} = \sum_{n=0}^\infty(-x^2)^n = 1 - x^2 + x^4 - x^6 + \cdots, \quad |x| < 1.$$

### Example 4 (rewriting to fit the pattern)

Find a power series for $\dfrac{3}{2 - x}$ and its interval of convergence.

Factor out the 2 to make the constant term 1: $\dfrac{3}{2 - x} = \dfrac32\cdot\dfrac{1}{1 - x/2} = \dfrac32\sum_{n=0}^\infty\left(\dfrac x2\right)^n = \sum_{n=0}^\infty\frac{3x^n}{2^{n+1}}$, valid for $\left|\frac x2\right| < 1$, i.e. $(-2, 2)$.

## Differentiating and integrating term by term

*Theorem.* If $f(x) = \sum c_n(x - a)^n$ has radius $R > 0$, then on $|x - a| < R$, $f$ is differentiable and
$$f'(x) = \sum_{n=1}^\infty nc_n(x - a)^{n-1}, \qquad \int f(x)\,dx = C + \sum_{n=0}^\infty\frac{c_n(x - a)^{n+1}}{n + 1},$$
and both series have the same radius $R$. (Endpoints may change.)

### Example 5

Find power series for $\ln(1 + x)$ and $\arctan x$.

- $\frac{1}{1 + t} = 1 - t + t^2 - \cdots$. Integrate from 0 to $x$:
$$\ln(1 + x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \frac{x^4}{4} + \cdots = \sum_{n=1}^\infty\frac{(-1)^{n+1}x^n}{n}, \quad -1 < x \le 1.$$
At $x = 1$ this gives $\ln2 = 1 - \frac12 + \frac13 - \cdots$, the alternating harmonic series.
- Integrate Example 3's series: $\arctan x = x - \dfrac{x^3}{3} + \dfrac{x^5}{5} - \cdots$ for $|x| \le 1$. At $x = 1$: $\frac\pi4 = 1 - \frac13 + \frac15 - \cdots$.

### Example 6 (differentiating)

Differentiate $\frac{1}{1 - x} = \sum x^n$: $\dfrac{1}{(1 - x)^2} = \sum_{n=1}^\infty nx^{n-1} = 1 + 2x + 3x^2 + \cdots$ for $|x| < 1$. At $x = \frac12$: $\sum_{n=1}^\infty\frac{n}{2^{n-1}} = 4$.

## Common mistakes

- *Forgetting the endpoints.* The ratio test says nothing there.
- *Radius from the wrong expression.* Solve $|x - a| < R$; for $\sum\frac{(2x)^n}{n}$, $|2x| < 1$ gives $R = \frac12$, not 1.
- **Not making the constant 1** before using $\frac{1}{1 - u}$ (Example 4).
- *Dropping the constant of integration* when integrating a series; fix it by plugging in the center.
- *Assuming the series equals the function everywhere it's defined.* Only inside the interval of convergence.

## Key points

- Power series $\sum c_n(x - a)^n$ converge on an interval centered at $a$ with radius $R$ (possibly $0$ or $\infty$).
- Find $R$ with the ratio test; test endpoints separately.
- $\frac{1}{1 - x} = \sum x^n$ on $(-1, 1)$; substitute, multiply, differentiate and integrate to get new series.
- Term-by-term calculus keeps the radius: $\ln(1 + x) = \sum\frac{(-1)^{n+1}x^n}{n}$, $\arctan x = \sum\frac{(-1)^nx^{2n+1}}{2n + 1}$.
