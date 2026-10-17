---
id: calc-taylor
module: calc-m10
title: Taylor and Maclaurin series
minutes: 45
topics: [Taylor series, Taylor's remainder]
drills: [calc-d-taylor-coeff, calc-d-taylor-approx]
refs: [calc-ref-series]
---
## Which power series is it?

Lesson 43 found power series for a few functions by manipulating the geometric series. That trick doesn't reach $e^x$ or $\sin x$. Taylor series answer the general question: if a function has a power series, what must its coefficients be? The answer uses derivatives, and the resulting polynomials are how calculators evaluate $e^x$, $\sin x$ and $\ln x$.

## Finding the coefficients

Suppose $f(x) = c_0 + c_1(x - a) + c_2(x - a)^2 + c_3(x - a)^3 + \cdots$ near $a$. Plug in $x = a$: $f(a) = c_0$. Differentiate and plug in again: $f'(a) = c_1$. Again: $f''(a) = 2c_2$. Again: $f'''(a) = 3\cdot2\,c_3$. In general $f^{(n)}(a) = n!\,c_n$, so

$$c_n = \frac{f^{(n)}(a)}{n!}.$$

The **Taylor series** of $f$ centered at $a$ is

$$\sum_{n=0}^\infty\frac{f^{(n)}(a)}{n!}(x - a)^n = f(a) + f'(a)(x - a) + \frac{f''(a)}{2!}(x - a)^2 + \cdots.$$

Centered at $a = 0$ it's called a **Maclaurin series**. If a function has any power series at $a$, it's this one: power series representations are unique.

## Taylor polynomials

Stopping after the $(x - a)^n$ term gives the **Taylor polynomial** of degree $n$, $P_n(x)$. It matches $f$ and its first $n$ derivatives at $a$. $P_1$ is the tangent line (linearization, Lesson 15); $P_2$ adds curvature; higher degrees hug the curve over a wider range.

```plot
{"x": [-6, 6], "y": [-2.5, 2.5], "functions": [{"f": "sin(x)", "label": "sin x"}, {"f": "x", "dashed": true, "label": "P₁"}, {"f": "x - x^3/6", "dashed": true, "label": "P₃"}, {"f": "x - x^3/6 + x^5/120 - x^7/5040", "dashed": true, "label": "P₇"}], "caption": "Maclaurin polynomials of sin x: each adds accuracy farther from 0"}
```

### Example 1 ($e^x$)

Every derivative of $e^x$ is $e^x$, which is 1 at $x = 0$. So $c_n = \frac{1}{n!}$:
$$e^x = \sum_{n=0}^\infty\frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots, \quad\text{all } x.$$
(Radius $\infty$ by Lesson 43, Example 2.) At $x = 1$: $e = 1 + 1 + \frac12 + \frac16 + \frac1{24} + \cdots \approx 2.71828$.

### Example 2 ($\sin x$ and $\cos x$)

Derivatives of $\sin x$ at 0 cycle $0, 1, 0, -1, \dots$ So only odd powers survive, with alternating signs:
$$\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots = \sum_{n=0}^\infty\frac{(-1)^nx^{2n+1}}{(2n + 1)!}.$$
Differentiating term by term:
$$\cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots = \sum_{n=0}^\infty\frac{(-1)^nx^{2n}}{(2n)!}.$$
Both converge for all $x$. Notice $\sin$ is odd and has only odd powers; $\cos$ is even and has only even powers.

### Example 3 (a Taylor polynomial at $a \ne 0$)

Find $P_3(x)$ for $f(x) = \ln x$ centered at $a = 1$.

| $n$ | $f^{(n)}(x)$ | $f^{(n)}(1)$ | $c_n = f^{(n)}(1)/n!$ |
|---|---|---|---|
| 0 | $\ln x$ | $0$ | $0$ |
| 1 | $x^{-1}$ | $1$ | $1$ |
| 2 | $-x^{-2}$ | $-1$ | $-\frac12$ |
| 3 | $2x^{-3}$ | $2$ | $\frac13$ |

$P_3(x) = (x - 1) - \frac12(x - 1)^2 + \frac13(x - 1)^3$. (Compare $\ln(1 + u) = u - \frac{u^2}{2} + \frac{u^3}{3} - \cdots$ with $u = x - 1$.)

## A table worth memorizing

| Function | Maclaurin series | Converges for |
|---|---|---|
| $\dfrac{1}{1 - x}$ | $1 + x + x^2 + x^3 + \cdots$ | $(-1, 1)$ |
| $e^x$ | $1 + x + \dfrac{x^2}{2!} + \dfrac{x^3}{3!} + \cdots$ | all $x$ |
| $\sin x$ | $x - \dfrac{x^3}{3!} + \dfrac{x^5}{5!} - \cdots$ | all $x$ |
| $\cos x$ | $1 - \dfrac{x^2}{2!} + \dfrac{x^4}{4!} - \cdots$ | all $x$ |
| $\ln(1 + x)$ | $x - \dfrac{x^2}{2} + \dfrac{x^3}{3} - \cdots$ | $(-1, 1]$ |
| $\arctan x$ | $x - \dfrac{x^3}{3} + \dfrac{x^5}{5} - \cdots$ | $[-1, 1]$ |
| $(1 + x)^k$ | $1 + kx + \dfrac{k(k - 1)}{2!}x^2 + \cdots$ | $(-1, 1)$ |

The last is the **binomial series**; for whole-number $k$ it stops and becomes the binomial theorem. (For other $k$ it converges on $(-1, 1)$; whether the endpoints $\pm1$ are included depends on $k$.)

New series come from these by substitution and multiplication, which is usually much faster than computing derivatives.

### Example 4

Find the Maclaurin series of $x^2e^{-x^2}$ through the $x^6$ term.

Substitute $-x^2$ into $e^u$: $e^{-x^2} = 1 - x^2 + \frac{x^4}{2} - \frac{x^6}{6} + \cdots$. Multiply by $x^2$: $x^2 - x^4 + \frac{x^6}{2} - \cdots$

Series also make hard limits easy: $\dfrac{\sin x - x}{x^3} = \dfrac{-\frac{x^3}{6} + \frac{x^5}{120} - \cdots}{x^3} \to -\dfrac16$.

## How accurate is $P_n$? Taylor's remainder

The error $R_n(x) = f(x) - P_n(x)$ is controlled by the next derivative.

**Taylor's theorem** (**Lagrange error bound**). If $|f^{(n+1)}(t)| \le M$ for all $t$ between $a$ and $x$, then

$$|R_n(x)| \le \frac{M}{(n + 1)!}|x - a|^{n+1}.$$

It looks like the next term of the series, with the derivative replaced by its worst-case size $M$. (For an alternating series with decreasing terms, the simpler alternating series bound from Lesson 42 also works.)

### Example 5

Use $P_4$ for $e^x$ at 0 to approximate $e^{0.5}$, and bound the error.

$P_4(0.5) = 1 + 0.5 + \frac{0.25}{2} + \frac{0.125}{6} + \frac{0.0625}{24} = 1.6484375$.

$f^{(5)}(t) = e^t \le e^{0.5} < 2$ on $[0, 0.5]$, so $M = 2$ works:
$$|R_4(0.5)| \le \frac{2}{5!}(0.5)^5 = \frac{2}{120}\cdot\frac{1}{32} \approx 0.00052.$$
Indeed $e^{0.5} = 1.6487213$, and the actual error is $0.00028$.

### Example 6

What degree Maclaurin polynomial of $\sin x$ approximates $\sin(0.3)$ within $10^{-6}$?

All derivatives of $\sin$ are bounded by $M = 1$, so we need $\dfrac{(0.3)^{n+1}}{(n + 1)!} < 10^{-6}$.

- $n + 1 = 5$: $\dfrac{0.00243}{120} \approx 2.0\times10^{-5}$. Too big.
- $n + 1 = 6$: $\dfrac{0.000729}{720} \approx 1.01\times10^{-6}$. Still (barely) too big.
- $n + 1 = 7$: $\dfrac{0.0002187}{5040} \approx 4.3\times10^{-8}$. Good.

So $n = 6$ works. For $\sin x$ the $x^6$ coefficient is 0, so $P_6 = P_5 = x - \frac{x^3}{6} + \frac{x^5}{120}$: the degree-5 polynomial already does the job. (The alternating series bound gives the same conclusion directly: the first omitted term of $P_5$ is $\frac{0.3^7}{7!} \approx 4.3\times10^{-8}$.)

## Common mistakes

- *Forgetting the factorial* in $c_n = \frac{f^{(n)}(a)}{n!}$.
- **Writing powers of $x$ instead of $(x - a)$** for a series centered at $a \ne 0$.
- *Computing many derivatives* when substitution into a known series would do.
- *Lagrange bound with the wrong derivative.* Use $f^{(n+1)}$, the one *after* the last term kept.
- *Assuming every function equals its Taylor series.* It does for the functions in the table (on their intervals), but the remainder must go to 0 for that to hold.

## Key points

- Taylor series: $\sum\frac{f^{(n)}(a)}{n!}(x - a)^n$; Maclaurin when $a = 0$.
- Know the series for $\frac{1}{1 - x}$, $e^x$, $\sin x$, $\cos x$, $\ln(1 + x)$, $\arctan x$; build others by substitution.
- $P_n$ matches $f$ and its first $n$ derivatives at $a$.
- Lagrange error: $|R_n(x)| \le \frac{M}{(n + 1)!}|x - a|^{n+1}$ with $M \ge |f^{(n+1)}|$ between $a$ and $x$.
