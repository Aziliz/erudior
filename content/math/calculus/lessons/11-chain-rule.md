---
id: calc-chain-rule
module: calc-m3
title: The chain rule
minutes: 35
topics: [Chain rule]
drills: [calc-d-chain-power, calc-d-chain-trig]
refs: [calc-ref-derivatives]
---
## Functions inside functions

We can differentiate $\sin x$ and $x^5$, but not yet $\sin(x^2)$ or $(3x + 1)^5$. These are **composite functions**: one function applied to the output of another. Most functions you meet in practice are composites, so the chain rule is the single most-used derivative rule.

## Rates multiply

Suppose a gear $A$ turns 3 times as fast as gear $B$, and $B$ turns 2 times as fast as gear $C$. Then $A$ turns $3\times2 = 6$ times as fast as $C$. Rates of change chain together by multiplying.

In symbols, if $y$ depends on $u$ and $u$ depends on $x$:

$$\frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}.$$

Leibniz notation makes it look like fractions canceling. They aren't really fractions, but the notation was designed so that this works.

## The chain rule

For a composite $y = f(g(x))$, with **outer function** $f$ and **inner function** $g$:

$$\frac{d}{dx}f(g(x)) = f'(g(x))\cdot g'(x).$$

Read it as: *derivative of the outside, evaluated at the inside, times the derivative of the inside*. The inside stays untouched in the first factor.

*Why it's true (sketch).* Let $u = g(x)$ and $\Delta u = g(x + h) - g(x)$. When $\Delta u \ne 0$,
$$\frac{f(g(x + h)) - f(g(x))}{h} = \frac{f(u + \Delta u) - f(u)}{\Delta u}\cdot\frac{\Delta u}{h}.$$
As $h\to0$, $\Delta u \to 0$ (since $g$ is continuous), so the first factor tends to $f'(u)$ and the second to $g'(x)$. (A fully rigorous proof handles the case $\Delta u = 0$ separately.)

### Example 1

Differentiate $y = (3x^2 + 1)^5$.

- Inside: $u = 3x^2 + 1$, with $u' = 6x$.
- Outside: $u^5$, with derivative $5u^4$.

$$y' = 5(3x^2 + 1)^4\cdot6x = \mathbf{30x(3x^2 + 1)^4}.$$

Expanding $(3x^2 + 1)^5$ first would work, but it's a mess. The chain rule takes one line.

### Example 2

Differentiate $y = \sin(x^2)$ and $y = \sin^2 x$.

These are different functions.

- $\sin(x^2)$: outside is $\sin$, inside is $x^2$. So $y' = \cos(x^2)\cdot2x$.
- $\sin^2 x = (\sin x)^2$: outside is squaring, inside is $\sin x$. So $y' = 2\sin x\cdot\cos x$ (which equals $\sin 2x$).

## Common chain rule patterns

With $u$ a function of $x$:

| Function | Derivative |
|---|---|
| $u^n$ | $nu^{n-1}u'$ (general power rule) |
| $\sqrt u$ | $\dfrac{u'}{2\sqrt u}$ |
| $e^u$ | $e^u u'$ |
| $\sin u$ | $\cos u\cdot u'$ |
| $\cos u$ | $-\sin u\cdot u'$ |
| $\tan u$ | $\sec^2 u\cdot u'$ |
| $f(ax + b)$ | $a f'(ax + b)$ |

The last line is worth memorizing: a linear inside just multiplies by its slope. So $\frac{d}{dx}e^{5x} = 5e^{5x}$ and $\frac{d}{dx}\cos(2x - 1) = -2\sin(2x - 1)$.

### Example 3

Differentiate $y = \dfrac{1}{\sqrt{x^2 + 4}}$.

Rewrite: $y = (x^2 + 4)^{-1/2}$. General power rule:
$$y' = -\tfrac12(x^2 + 4)^{-3/2}\cdot2x = \mathbf{-\frac{x}{(x^2 + 4)^{3/2}}}.$$

No quotient rule needed.

## Chains of more than two links

Peel layers from the outside in, multiplying a derivative for each layer.

### Example 4

Differentiate $y = e^{\cos(3x)}$.

Three layers: exponential, then cosine, then $3x$.
$$y' = e^{\cos(3x)}\cdot\left(-\sin(3x)\right)\cdot3 = \mathbf{-3\sin(3x)\,e^{\cos(3x)}}.$$

Picture the function as three machines in a row. Each machine's rate is evaluated at whatever goes into it, and the chain rule multiplies the three rates.

![A chain of three boxes: x enters the inner box ×3, whose output 3x enters the middle box cos, whose output cos 3x enters the outer box e to the u, which outputs y. Under the boxes are their rates 3, −sin(3x) and e^(cos 3x), and below that y′ = e^(cos 3x) · (−sin 3x) · 3](images/calc-m3-chain-layers.svg)

### Example 5

Differentiate $y = \sqrt{1 + \tan^2(2x)}$ for $-\frac\pi4 < x < \frac\pi4$.

Simplify first. $1 + \tan^2 = \sec^2$, and $\sec(2x) > 0$ on this interval, so $y = \sec(2x)$. Then the chain rule with a linear inside gives $y' = \mathbf{2\sec(2x)\tan(2x)}$. Differentiating the square root directly gives the same answer after a page of algebra.

## Chain rule combined with other rules

### Example 6

Differentiate $y = x^3(2x - 5)^4$.

Product rule on the outside, chain rule for the second factor:
$$y' = 3x^2(2x - 5)^4 + x^3\cdot4(2x - 5)^3\cdot2.$$
Factor out the common pieces $x^2(2x - 5)^3$:
$$y' = x^2(2x - 5)^3\left[3(2x - 5) + 8x\right] = \mathbf{x^2(2x - 5)^3(14x - 15)}.$$

Factoring like this is what you want when you need to find where $y' = 0$ (zeros at $x = 0$, $\frac52$, $\frac{15}{14}$).

## Chain rule with values

If $h(x) = f(g(x))$ and you know $g(1) = 4$, $g'(1) = -2$, $f'(4) = 3$, then
$$h'(1) = f'(g(1))\cdot g'(1) = f'(4)\cdot(-2) = 3(-2) = -6.$$
The most common slip is using $f'(1)$ instead of $f'(g(1))$.

### Example 7 (a rate in context)

The temperature in a greenhouse $t$ hours after 6 a.m. is $T(t) = 20 + 10\sin\left(\dfrac{\pi t}{12}\right)$ °C. How fast is it rising at 10 a.m.?

10 a.m. is $t = 4$. By the chain rule (a linear inside, slope $\frac{\pi}{12}$),
$$T'(t) = 10\cos\left(\frac{\pi t}{12}\right)\cdot\frac{\pi}{12}.$$
At $t = 4$: $T'(4) = \frac{10\pi}{12}\cos\frac\pi3 = \frac{10\pi}{12}\cdot\frac12 = \frac{5\pi}{12} \approx 1.31$ °C per hour.

Forgetting the inner derivative $\frac{\pi}{12}$ would give $5$ °C per hour, nearly four times too big. The inner factor converts "per unit of angle" into "per hour."

```plot
{"x": [0, 24], "y": [0, 35], "functions": [{"f": "20 + 10*sin(pi*x/12)", "label": "T(t)"}], "tangents": [{"f": "20 + 10*sin(pi*x/12)", "at": 4}], "points": [{"at": [4, 28.66], "label": "10 a.m."}], "xLabel": "t (hours after 6 a.m.)", "yLabel": "T (°C)", "caption": "The greenhouse temperature; the tangent at t = 4 has slope 5π/12 ≈ 1.31 °C per hour"}
```

## Common mistakes

- *Forgetting the inner derivative.* $\frac{d}{dx}(3x^2 + 1)^5 \ne 5(3x^2 + 1)^4$. The factor $6x$ is the whole point.
- *Changing the inside.* In $f'(g(x))$ the inside stays $g(x)$: $\frac{d}{dx}\sin(x^2) = \cos(x^2)\cdot2x$, not $\cos(2x)$.
- **Mixing up $\sin^2 x$ and $\sin(x^2)$.**
- **Evaluating the outer derivative at $x$ instead of $g(x)$** in table problems.
- *Missing a layer* in long chains. Count layers before you start.

## Key points

- $\frac{d}{dx}f(g(x)) = f'(g(x))\,g'(x)$; equivalently $\frac{dy}{dx} = \frac{dy}{du}\frac{du}{dx}$.
- General power rule: $\frac{d}{dx}u^n = nu^{n-1}u'$.
- Linear inside: $\frac{d}{dx}f(ax + b) = af'(ax + b)$.
- Work from the outside in, one factor per layer.
