---
id: de-ref-laplace
title: Laplace transform table
---
$\mathcal{L}\{f(t)\} = F(s) = \displaystyle\int_0^\infty e^{-st}f(t)\,dt$

## Basic transforms

| $f(t)$ | $F(s)$ |
|---|---|
| $1$ | $\dfrac1s$ |
| $t$ | $\dfrac{1}{s^2}$ |
| $t^n$ | $\dfrac{n!}{s^{n+1}}$ |
| $e^{at}$ | $\dfrac{1}{s - a}$ |
| $t^ne^{at}$ | $\dfrac{n!}{(s - a)^{n+1}}$ |
| $\sin bt$ | $\dfrac{b}{s^2 + b^2}$ |
| $\cos bt$ | $\dfrac{s}{s^2 + b^2}$ |
| $e^{at}\sin bt$ | $\dfrac{b}{(s - a)^2 + b^2}$ |
| $e^{at}\cos bt$ | $\dfrac{s - a}{(s - a)^2 + b^2}$ |
| $\sinh bt$ | $\dfrac{b}{s^2 - b^2}$ |
| $\cosh bt$ | $\dfrac{s}{s^2 - b^2}$ |
| $t\sin bt$ | $\dfrac{2bs}{(s^2 + b^2)^2}$ |
| $t\cos bt$ | $\dfrac{s^2 - b^2}{(s^2 + b^2)^2}$ |
| $\tfrac{1}{2b^3}(\sin bt - bt\cos bt)$ | $\dfrac{1}{(s^2 + b^2)^2}$ |
| $u_c(t)$ | $\dfrac{e^{-cs}}{s}$ |
| $\delta(t - c)$ | $e^{-cs}$ |

## Rules

| Rule | Formula |
|---|---|
| Linearity | $\mathcal{L}\{af + bg\} = aF + bG$ |
| First shift | $\mathcal{L}\{e^{at}f(t)\} = F(s - a)$ |
| Second shift | $\mathcal{L}\{u_c(t)f(t - c)\} = e^{-cs}F(s)$ |
| Step times a function | $\mathcal{L}\{u_c(t)g(t)\} = e^{-cs}\mathcal{L}\{g(t + c)\}$ |
| First derivative | $\mathcal{L}\{y'\} = sY - y(0)$ |
| Second derivative | $\mathcal{L}\{y''\} = s^2Y - sy(0) - y'(0)$ |
| $n$th derivative | $s^nY - s^{n-1}y(0) - \cdots - y^{(n-1)}(0)$ |
| Multiplication by $t$ | $\mathcal{L}\{tf(t)\} = -F'(s)$ |
| Integral | $\mathcal{L}\left\{\int_0^t f(\tau)\,d\tau\right\} = \dfrac{F(s)}{s}$ |
| Convolution | $\mathcal{L}\{f * g\} = F(s)G(s)$, $(f * g)(t) = \int_0^t f(t - \tau)g(\tau)\,d\tau$ |
| Initial value theorem | $f(0^+) = \lim_{s\to\infty} sF(s)$ |

## Inverting: partial-fraction forms

| Factor in the denominator | Terms to include |
|---|---|
| $(s - a)$ | $\dfrac{A}{s - a}$ |
| $(s - a)^k$ | $\dfrac{A_1}{s - a} + \cdots + \dfrac{A_k}{(s - a)^k}$ |
| $s^2 + bs + c$ (no real roots) | $\dfrac{Bs + C}{s^2 + bs + c}$; complete the square to $(s + \frac b2)^2 + \omega^2$ |

Delayed terms: $\mathcal{L}^{-1}\{e^{-cs}H(s)\} = u_c(t)\,h(t - c)$. Invert $H$ first, then shift.
