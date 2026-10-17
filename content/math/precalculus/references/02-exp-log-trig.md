---
id: pc-ref-exp-log
title: Exponentials, logarithms and trig review
---
## Exponential functions

| Fact | Formula |
|---|---|
| Exponential function | $f(x) = b^x$, $b > 0$, $b \ne 1$; through $(0, 1)$; asymptote $y = 0$ |
| Growth / decay | $b > 1$ grows; $0 < b < 1$ decays |
| Compound interest | $A = P\left(1 + \dfrac{r}{n}\right)^{nt}$ |
| Continuous compounding | $A = Pe^{rt}$ |
| Natural base | $e = \lim\limits_{n\to\infty}\left(1 + \tfrac1n\right)^n \approx 2.71828$ |

## Logarithms

| Rule | Formula |
|---|---|
| Definition | $\log_b x = y \iff b^y = x$ ($x > 0$) |
| Special values | $\log_b 1 = 0$, $\log_b b = 1$ |
| Inverse properties | $\log_b b^x = x$, $b^{\log_b x} = x$ |
| Product | $\log_b(MN) = \log_b M + \log_b N$ |
| Quotient | $\log_b\dfrac MN = \log_b M - \log_b N$ |
| Power | $\log_b M^p = p\log_b M$ |
| Change of base | $\log_b x = \dfrac{\ln x}{\ln b}$ |
| Common / natural | $\log x = \log_{10} x$, $\ln x = \log_e x$ |

## Solving equations

| Type | Method |
|---|---|
| $b^{u} = b^{v}$ | $u = v$ |
| $a \cdot b^{x} = c$ | $x = \dfrac{\ln(c/a)}{\ln b}$ |
| $b^{2x}$ and $b^x$ | substitute $u = b^x$ |
| $\log_b u = k$ | $u = b^k$; check for extraneous solutions |

## Models

| Model | Formula |
|---|---|
| Exponential | $Q = Q_0e^{kt}$ |
| Doubling time | $T = \dfrac{\ln 2}{k}$ |
| Half-life $T$ | $Q = Q_0\left(\tfrac12\right)^{t/T}$, $k = -\dfrac{\ln 2}{T}$ |
| Newton's cooling | $T = T_s + (T_0 - T_s)e^{-kt}$ |
| Logistic | $P = \dfrac{C}{1 + Ae^{-kt}}$, $A = \dfrac{C}{P_0} - 1$, half capacity at $t = \dfrac{\ln A}{k}$ |

## Fitting models to data

| Pattern (equally spaced $x$) | Model |
|---|---|
| constant first differences | linear $y = mx + b$ |
| constant second differences | quadratic $y = ax^2 + bx + c$ |
| constant ratios | exponential $y = ab^x$ ($\ln y$ vs. $x$ is linear) |
| equal steps each time $x$ doubles | logarithmic $y = a + b\ln x$ ($y$ vs. $\ln x$ is linear) |

| Idea | Rule |
|---|---|
| Residual | $y - \hat y$ (observed $-$ predicted) |
| Least-squares line | $m = \dfrac{\sum(x - \bar x)(y - \bar y)}{\sum(x - \bar x)^2}$, $b = \bar y - m\bar x$ |
| Good fit | residual plot shows no pattern |

## Trigonometry review

| Angle | $0$ | $\frac{\pi}{6}$ | $\frac{\pi}{4}$ | $\frac{\pi}{3}$ | $\frac{\pi}{2}$ |
|---|---|---|---|---|---|
| $\sin$ | $0$ | $\frac12$ | $\frac{\sqrt2}{2}$ | $\frac{\sqrt3}{2}$ | $1$ |
| $\cos$ | $1$ | $\frac{\sqrt3}{2}$ | $\frac{\sqrt2}{2}$ | $\frac12$ | $0$ |
| $\tan$ | $0$ | $\frac{\sqrt3}{3}$ | $1$ | $\sqrt3$ | undefined |

| Fact | Formula |
|---|---|
| Degrees to radians | multiply by $\dfrac{\pi}{180}$ |
| Unit circle | $(\cos\theta, \sin\theta)$; $\tan\theta = \dfrac{\sin\theta}{\cos\theta}$ |
| Sinusoid | $y = A\sin(B(x - C)) + D$: amplitude $\lvert A \rvert$, period $\dfrac{2\pi}{\lvert B \rvert}$, phase shift $C$, midline $y = D$ |
| Pythagorean | $\sin^2\theta + \cos^2\theta = 1$, $1 + \tan^2\theta = \sec^2\theta$ |
| Sum | $\sin(a \pm b) = \sin a\cos b \pm \cos a \sin b$; $\cos(a \pm b) = \cos a \cos b \mp \sin a \sin b$ |
| Double angle | $\sin 2\theta = 2\sin\theta\cos\theta$; $\cos 2\theta = \cos^2\theta - \sin^2\theta$ |
| Even / odd | $\cos(-\theta) = \cos\theta$; $\sin(-\theta) = -\sin\theta$ |
