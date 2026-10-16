---
id: calc-ref-integrals
title: Integral table
---
## Basic antiderivatives

| $\int f(x)\,dx$ | $=$ | $\int f(x)\,dx$ | $=$ |
|---|---|---|---|
| $\int x^n\,dx$ ($n \ne -1$) | $\dfrac{x^{n+1}}{n+1} + C$ | $\int \dfrac1x\,dx$ | $\ln\lvert x\rvert + C$ |
| $\int e^x\,dx$ | $e^x + C$ | $\int b^x\,dx$ | $\dfrac{b^x}{\ln b} + C$ |
| $\int \sin x\,dx$ | $-\cos x + C$ | $\int\cos x\,dx$ | $\sin x + C$ |
| $\int\sec^2 x\,dx$ | $\tan x + C$ | $\int\csc^2 x\,dx$ | $-\cot x + C$ |
| $\int\sec x\tan x\,dx$ | $\sec x + C$ | $\int\csc x\cot x\,dx$ | $-\csc x + C$ |
| $\int\tan x\,dx$ | $\ln\lvert\sec x\rvert + C$ | $\int\cot x\,dx$ | $\ln\lvert\sin x\rvert + C$ |
| $\int\sec x\,dx$ | $\ln\lvert\sec x + \tan x\rvert + C$ | $\int\csc x\,dx$ | $-\ln\lvert\csc x + \cot x\rvert + C$ |
| $\int\dfrac{dx}{a^2 + x^2}$ | $\dfrac1a\arctan\dfrac xa + C$ | $\int\dfrac{dx}{\sqrt{a^2 - x^2}}$ | $\arcsin\dfrac xa + C$ |
| $\int\dfrac{dx}{x^2 - a^2}$ | $\dfrac{1}{2a}\ln\left\lvert\dfrac{x - a}{x + a}\right\rvert + C$ | $\int\dfrac{dx}{x\sqrt{x^2 - a^2}}$ | $\dfrac1a\text{arcsec}\dfrac{\lvert x\rvert}{a} + C$ |
| $\int\ln x\,dx$ | $x\ln x - x + C$ | $\int\sec^3x\,dx$ | $\tfrac12(\sec x\tan x + \ln\lvert\sec x + \tan x\rvert) + C$ |
| $\int\sin^2 x\,dx$ | $\dfrac x2 - \dfrac{\sin 2x}{4} + C$ | $\int\cos^2 x\,dx$ | $\dfrac x2 + \dfrac{\sin 2x}{4} + C$ |

## Fundamental Theorem

- **FTC 1:** $\dfrac{d}{dx}\displaystyle\int_a^{x}f(t)\,dt = f(x)$; $\dfrac{d}{dx}\displaystyle\int_a^{u(x)}f(t)\,dt = f(u(x))\,u'(x)$.
- **FTC 2:** $\displaystyle\int_a^b f(x)\,dx = F(b) - F(a)$ where $F' = f$.
- **Net change:** $\displaystyle\int_a^b F'(x)\,dx = F(b) - F(a)$.
- **Average value:** $f_{\text{avg}} = \dfrac{1}{b - a}\displaystyle\int_a^b f(x)\,dx$.

## Properties

$\int_a^a f = 0$; $\int_b^a f = -\int_a^b f$; $\int_a^b f + \int_b^c f = \int_a^c f$; even $f$: $\int_{-a}^a f = 2\int_0^a f$; odd $f$: $\int_{-a}^a f = 0$.

## Riemann sums and numerical rules ($\Delta x = \frac{b - a}{n}$)

| Rule | Formula | Error bound |
|---|---|---|
| Left $L_n$ | $\Delta x\,[f(x_0) + \dots + f(x_{n-1})]$ | |
| Right $R_n$ | $\Delta x\,[f(x_1) + \dots + f(x_n)]$ | |
| Midpoint $M_n$ | $\Delta x\,[f(\bar x_1) + \dots + f(\bar x_n)]$ | $\dfrac{K(b - a)^3}{24n^2}$, $\lvert f''\rvert \le K$ |
| Trapezoid $T_n$ | $\dfrac{\Delta x}{2}[f(x_0) + 2f(x_1) + \dots + 2f(x_{n-1}) + f(x_n)]$ | $\dfrac{K(b - a)^3}{12n^2}$, $\lvert f''\rvert \le K$ |
| Simpson $S_n$ ($n$ even) | $\dfrac{\Delta x}{3}[f(x_0) + 4f(x_1) + 2f(x_2) + \dots + 4f(x_{n-1}) + f(x_n)]$ | $\dfrac{K(b - a)^5}{180n^4}$, $\lvert f^{(4)}\rvert \le K$ |

Sums: $\sum_{i=1}^n i = \frac{n(n+1)}{2}$, $\sum_{i=1}^n i^2 = \frac{n(n+1)(2n+1)}{6}$, $\sum_{i=1}^n i^3 = \left[\frac{n(n+1)}{2}\right]^2$.

## Techniques

| Technique | Use when | Key formula |
|---|---|---|
| Substitution | inner function with its derivative present | $\int f(g(x))g'(x)\,dx = \int f(u)\,du$ |
| By parts | product of unlike types | $\int u\,dv = uv - \int v\,du$ (LIATE for $u$) |
| Trig powers | $\sin^m\cos^n$, $\tan^m\sec^n$ | save one factor, convert the rest |
| Trig substitution | $\sqrt{a^2 - x^2}$, $\sqrt{a^2 + x^2}$, $\sqrt{x^2 - a^2}$ | $x = a\sin\theta$, $a\tan\theta$, $a\sec\theta$ |
| Partial fractions | rational functions | factor the denominator, split |

## Improper integrals

$\int_1^\infty \dfrac{dx}{x^p}$ converges iff $p > 1$ (to $\frac{1}{p - 1}$); $\int_0^1\dfrac{dx}{x^p}$ converges iff $p < 1$ (to $\frac{1}{1 - p}$).
