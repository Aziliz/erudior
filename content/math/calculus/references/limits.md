---
id: calc-ref-limits
title: Limits and continuity
---
## Limit laws

If $\lim_{x\to a} f(x) = L$ and $\lim_{x\to a} g(x) = M$:

| Law | Result |
|---|---|
| Sum, difference | $L \pm M$ |
| Constant multiple | $cL$ |
| Product | $LM$ |
| Quotient | $L/M$ (need $M \ne 0$) |
| Power, root | $L^n$, $\sqrt[n]{L}$ ($L > 0$ for even $n$) |

## What to do after substituting

| Result | Next step |
|---|---|
| A number | That's the limit (if the function is continuous there) |
| $\dfrac{\text{nonzero}}{0}$ | Infinite limit or DNE: check the sign on each side |
| $\dfrac00$ | Factor and cancel; conjugate; common denominator; expand; trig limits; L'Hôpital |
| $\dfrac{\infty}{\infty}$, $\infty - \infty$, $0\cdot\infty$ | Divide by highest power; conjugate; L'Hôpital |
| $1^\infty$, $0^0$, $\infty^0$ | Take $\ln$, then L'Hôpital |

## Special limits

| Limit | Value |
|---|---|
| $\lim_{x\to0}\dfrac{\sin x}{x}$ | $1$ (radians) |
| $\lim_{x\to0}\dfrac{1 - \cos x}{x}$ | $0$ |
| $\lim_{x\to0}\dfrac{\sin ax}{bx}$ | $a/b$ |
| $\lim_{x\to0}\dfrac{e^x - 1}{x}$ | $1$ |
| $\lim_{x\to\infty}\left(1 + \dfrac1x\right)^x$ | $e$ |
| $\lim_{x\to\infty}\left(1 + \dfrac ax\right)^x$ | $e^a$ |
| $\lim_{x\to\pm\infty}\dfrac{1}{x^n}$ ($n > 0$) | $0$ |
| $\lim_{x\to\pm\infty}\arctan x$ | $\pm\pi/2$ |

Growth for large $x$: $\ln x \ll x^p \ll e^x \ll x!$-type growth ($p > 0$).

## Rational functions at infinity (degree $n$ over degree $m$)

| Case | Limit as $x \to \pm\infty$ |
|---|---|
| $n < m$ | $0$ |
| $n = m$ | ratio of leading coefficients |
| $n = m + 1$ | $\pm\infty$; slant asymptote from long division |
| $n > m$ | $\pm\infty$ |

## Definitions and theorems

- **One-sided:** $\lim_{x\to a}f = L \iff \lim_{x\to a^-}f = L = \lim_{x\to a^+}f$.
- **ε-δ:** for every $\varepsilon > 0$ there's $\delta > 0$ with $0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon$. For $f(x) = mx + b$: $\delta = \varepsilon/|m|$.
- **Squeeze:** $g \le f \le h$ near $a$, $g, h \to L$ ⇒ $f \to L$.
- **Continuous at $a$:** $f(a)$ defined, limit exists, $\lim_{x\to a} f(x) = f(a)$.
- **Discontinuities:** removable (hole), jump, infinite (vertical asymptote), oscillating.
- **IVT:** $f$ continuous on $[a, b]$, $N$ between $f(a)$ and $f(b)$ ⇒ some $c \in (a, b)$ has $f(c) = N$.
