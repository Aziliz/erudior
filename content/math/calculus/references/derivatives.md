---
id: calc-ref-derivatives
title: Derivative rules
---
## Definition

$$f'(x) = \lim_{h\to0}\frac{f(x + h) - f(x)}{h}, \qquad f'(a) = \lim_{x\to a}\frac{f(x) - f(a)}{x - a}$$

Tangent line at $a$: $y = f(a) + f'(a)(x - a)$. Normal line slope: $-1/f'(a)$.

## Rules

| Rule | Formula |
|---|---|
| Constant | $(c)' = 0$ |
| Power | $(x^n)' = nx^{n-1}$ (any real $n$) |
| Constant multiple | $(cf)' = cf'$ |
| Sum/difference | $(f \pm g)' = f' \pm g'$ |
| Product | $(fg)' = f'g + fg'$ |
| Quotient | $\left(\dfrac fg\right)' = \dfrac{f'g - fg'}{g^2}$ |
| Chain | $\dfrac{d}{dx}f(g(x)) = f'(g(x))\,g'(x)$; $\dfrac{dy}{dx} = \dfrac{dy}{du}\dfrac{du}{dx}$ |
| Inverse function | $(f^{-1})'(b) = \dfrac{1}{f'(a)}$ where $f(a) = b$ |

## Exponential and logarithmic

| $f(x)$ | $f'(x)$ |
|---|---|
| $e^x$ | $e^x$ |
| $b^x$ | $b^x\ln b$ |
| $\ln x$ | $\dfrac1x$ |
| $\ln\lvert x\rvert$ | $\dfrac1x$ |
| $\log_b x$ | $\dfrac{1}{x\ln b}$ |
| $e^{u}$ | $e^{u}u'$ |
| $\ln u$ | $\dfrac{u'}{u}$ |

## Trigonometric (radians)

| $f(x)$ | $f'(x)$ | $f(x)$ | $f'(x)$ |
|---|---|---|---|
| $\sin x$ | $\cos x$ | $\csc x$ | $-\csc x\cot x$ |
| $\cos x$ | $-\sin x$ | $\sec x$ | $\sec x\tan x$ |
| $\tan x$ | $\sec^2 x$ | $\cot x$ | $-\csc^2 x$ |

## Inverse trigonometric

| $f(x)$ | $f'(x)$ | $f(x)$ | $f'(x)$ |
|---|---|---|---|
| $\arcsin x$ | $\dfrac{1}{\sqrt{1 - x^2}}$ | $\arccos x$ | $-\dfrac{1}{\sqrt{1 - x^2}}$ |
| $\arctan x$ | $\dfrac{1}{1 + x^2}$ | $\text{arccot}\, x$ | $-\dfrac{1}{1 + x^2}$ |
| $\text{arcsec}\, x$ | $\dfrac{1}{\lvert x\rvert\sqrt{x^2 - 1}}$ | $\text{arccsc}\, x$ | $-\dfrac{1}{\lvert x\rvert\sqrt{x^2 - 1}}$ |

The $\text{arcsec}$ formula assumes the range $[0, \pi]$ without $\frac\pi2$ (so $\text{arcsec}\,x = \arccos\frac1x$); books using $[0, \frac\pi2) \cup [\pi, \frac{3\pi}{2})$ get $\frac{1}{x\sqrt{x^2 - 1}}$.

## Hyperbolic

$\cosh x = \dfrac{e^x + e^{-x}}{2}$, $\sinh x = \dfrac{e^x - e^{-x}}{2}$, $\tanh x = \dfrac{\sinh x}{\cosh x}$; $\cosh^2x - \sinh^2x = 1$.

| $f(x)$ | $f'(x)$ | $f(x)$ | $f'(x)$ |
|---|---|---|---|
| $\sinh x$ | $\cosh x$ | $\sinh^{-1}x = \ln\left(x + \sqrt{x^2 + 1}\right)$ | $\dfrac{1}{\sqrt{x^2 + 1}}$ |
| $\cosh x$ | $\sinh x$ | $\cosh^{-1}x = \ln\left(x + \sqrt{x^2 - 1}\right)$ | $\dfrac{1}{\sqrt{x^2 - 1}}$ ($x > 1$) |
| $\tanh x$ | $\operatorname{sech}^2x$ | $\tanh^{-1}x = \dfrac12\ln\dfrac{1 + x}{1 - x}$ | $\dfrac{1}{1 - x^2}$ ($\lvert x\rvert < 1$) |

## Techniques

- **Implicit:** differentiate both sides in $x$; each $y$ term gets a factor $\frac{dy}{dx}$; solve for $\frac{dy}{dx}$.
- **Logarithmic:** for products/quotients/powers like $x^x$, take $\ln$ of both sides, differentiate, multiply by $y$.
- **Higher:** $f'' = (f')'$; position $s$, velocity $v = s'$, acceleration $a = v' = s''$.
- **Parametric:** $\dfrac{dy}{dx} = \dfrac{dy/dt}{dx/dt}$, $\dfrac{d^2y}{dx^2} = \dfrac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{dx/dt}$.
- **Polar:** $\dfrac{dy}{dx} = \dfrac{r'\sin\theta + r\cos\theta}{r'\cos\theta - r\sin\theta}$.

## Not differentiable at

Corners and cusps, vertical tangents, discontinuities. Differentiable ⇒ continuous (not conversely).
