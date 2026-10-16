---
id: calc-exp-log-derivs
module: calc-m3
title: Exponentials, logarithms and inverse functions
minutes: 35
topics: [Exponential and log derivatives, Logarithmic differentiation]
drills: [calc-d-exp-log-deriv, calc-d-inverse-fn-deriv]
refs: [calc-ref-derivatives]
---
## Finishing the toolbox

We know $\frac{d}{dx}e^x = e^x$. This lesson adds the natural logarithm, exponentials and logs to any base, a slick technique called logarithmic differentiation, and a general formula for the derivative of any inverse function. After this lesson you can differentiate every elementary function.

## The derivative of $\ln x$

$y = \ln x$ means $e^y = x$. Differentiate implicitly:

$$e^y\frac{dy}{dx} = 1 \quad\Longrightarrow\quad \frac{dy}{dx} = \frac{1}{e^y} = \frac1x.$$

So

$$\frac{d}{dx}\ln x = \frac{1}{x}, \quad x > 0.$$

For negative $x$, $\ln|x| = \ln(-x)$, whose derivative is $\frac{1}{-x}\cdot(-1) = \frac1x$. So $\frac{d}{dx}\ln|x| = \frac1x$ for all $x \ne 0$, a fact we'll need for integrals.

With the chain rule:

$$\frac{d}{dx}\ln u = \frac{u'}{u}.$$

This is sometimes called the logarithmic derivative: the rate of change of $u$ relative to its size.

### Example 1

Differentiate $y = \ln(x^2 + 1)$ and $y = \ln\left(\dfrac{x^3}{\sqrt{x + 2}}\right)$.

- $y' = \dfrac{2x}{x^2 + 1}$.
- For the second, use log properties *first*: $y = 3\ln x - \frac12\ln(x + 2)$. Then $y' = \dfrac3x - \dfrac{1}{2(x + 2)}$.

Expanding a log before differentiating turns products into sums and powers into coefficients, which is far easier than the quotient and chain rules.

## Other bases

Since $b = e^{\ln b}$, we can write $b^x = e^{x\ln b}$. The chain rule (linear inside) gives

$$\frac{d}{dx}b^x = b^x\ln b.$$

This explains Lesson 8's mystery constant: the slope of $2^x$ at 0 is $\ln 2 \approx 0.693$. For logs, the change-of-base formula $\log_b x = \frac{\ln x}{\ln b}$ gives

$$\frac{d}{dx}\log_b x = \frac{1}{x\ln b}.$$

Base $e$ is "natural" exactly because $\ln e = 1$ makes these formulas cleanest.

### Example 2

Differentiate $y = 5^{x^2}$ and $y = \log_{10}(3x)$.

- $y' = 5^{x^2}\ln5\cdot2x$.
- $y' = \dfrac{1}{3x\ln10}\cdot3 = \dfrac{1}{x\ln 10}$. (The 3 disappears, as it should: $\log(3x) = \log 3 + \log x$.)

### Example 3

Differentiate $y = e^{-x^2}\cos x$.

Product rule, with the chain rule for $e^{-x^2}$:
$$y' = -2xe^{-x^2}\cos x - e^{-x^2}\sin x = -e^{-x^2}(2x\cos x + \sin x).$$

## Logarithmic differentiation

Two situations call for taking logs before differentiating:

1. *Variable base and variable exponent*, like $x^x$ or $(\sin x)^x$. Neither the power rule (constant exponent) nor the exponential rule (constant base) applies.
2. *Messy products and quotients* of many factors.

Method: take $\ln$ of both sides, simplify with log rules, differentiate implicitly, then multiply by $y$.

### Example 4

Differentiate $y = x^x$ for $x > 0$.

1. $\ln y = x\ln x$.
2. Differentiate: $\dfrac{y'}{y} = 1\cdot\ln x + x\cdot\dfrac1x = \ln x + 1$.
3. Multiply by $y$: $y' = \mathbf{x^x(\ln x + 1)}$.

Notice the answer is neither $x\cdot x^{x-1}$ (power rule) nor $x^x\ln x$ (exponential rule); it's their sum. That's a nice way to remember it.

### Example 5

Differentiate $y = \dfrac{(x + 1)^4\sqrt{x - 3}}{(2x + 5)^3}$.

$\ln y = 4\ln(x + 1) + \frac12\ln(x - 3) - 3\ln(2x + 5)$. Differentiate:
$$\frac{y'}{y} = \frac{4}{x + 1} + \frac{1}{2(x - 3)} - \frac{6}{2x + 5}.$$
So $y' = \dfrac{(x + 1)^4\sqrt{x - 3}}{(2x + 5)^3}\left[\dfrac{4}{x + 1} + \dfrac{1}{2(x - 3)} - \dfrac{6}{2x + 5}\right]$.

Logarithmic differentiation also proves the power rule for every real $n$: if $y = x^n$, then $\ln y = n\ln x$, $\frac{y'}{y} = \frac nx$, and $y' = x^n\cdot\frac nx = nx^{n-1}$.

## Derivatives of inverse functions

If $f$ and $g = f^{-1}$ are inverses, then $f(g(x)) = x$. Differentiate with the chain rule: $f'(g(x))\,g'(x) = 1$, so

$$g'(x) = \frac{1}{f'(g(x))}.$$

At a specific point: if $f(a) = b$, then $(f^{-1})'(b) = \dfrac{1}{f'(a)}$. Geometrically, reflecting a graph across $y = x$ swaps rise and run, so slopes become reciprocals.

```plot
{"x": [-1, 9], "y": [-1, 9], "equal": true, "functions": [{"f": "x^2/4", "from": 0, "to": 6, "label": "f"}, {"f": "2sqrt(x)", "from": 0, "label": "f⁻¹"}, {"f": "x", "dashed": true}], "tangents": [{"f": "x^2/4", "at": 2}, {"f": "2sqrt(x)", "at": 1}], "points": [{"at": [2, 1], "label": "(2, 1)"}, {"at": [1, 2], "label": "(1, 2)"}], "caption": "Slope 1 for f at (2, 1); slope 1/1 = 1 for f⁻¹ at (1, 2). Reflected points have reciprocal slopes"}
```

### Example 6

Let $f(x) = x^3 + 2x - 1$. Find $(f^{-1})'(2)$.

We don't need a formula for $f^{-1}$. First find $a$ with $f(a) = 2$: try $a = 1$: $1 + 2 - 1 = 2$. ✓ Then $f'(x) = 3x^2 + 2$, so $f'(1) = 5$, and

$$(f^{-1})'(2) = \frac{1}{f'(1)} = \frac15.$$

The common error is computing $\frac{1}{f'(2)}$: you must evaluate $f'$ at the input $a$ that produces 2, not at 2 itself.

### Example 7

Find the tangent line to $y = x\ln x$ at $x = e$, and the point where the tangent is horizontal.

Product rule: $y' = 1\cdot\ln x + x\cdot\frac1x = \ln x + 1$.

- At $x = e$: $y = e\ln e = e$ and $y' = 1 + 1 = 2$. Tangent: $y - e = 2(x - e)$, or $y = 2x - e$.
- Horizontal tangent: $\ln x + 1 = 0$, so $\ln x = -1$ and $x = e^{-1} = \frac1e$. There $y = \frac1e\ln\frac1e = -\frac1e$.

The point $\left(\frac1e, -\frac1e\right)$ turns out to be the lowest point of the graph, which you'll be able to prove with the tools of Module 5.

## Common mistakes

- **$\frac{d}{dx}\ln(u) = \frac1u$.** Don't forget the $u'$ on top.
- **$\frac{d}{dx}\ln(5) = \frac15$.** $\ln 5$ is a constant; its derivative is 0.
- **Using the power rule on $x^x$.** Variable base and exponent need logarithmic differentiation.
- **Forgetting to multiply by $y$** at the end of logarithmic differentiation.
- **$(f^{-1})'(b) = \frac{1}{f'(b)}$.** It's $\frac{1}{f'(a)}$ where $f(a) = b$.

## Key points

- $(\ln x)' = \frac1x$; $(\ln u)' = \frac{u'}{u}$; $(\ln|x|)' = \frac1x$.
- $(b^x)' = b^x\ln b$; $(\log_b x)' = \frac{1}{x\ln b}$.
- Logarithmic differentiation: $\ln$ both sides, simplify, differentiate implicitly, multiply by $y$. Use it for $f(x)^{g(x)}$ and messy products.
- $(f^{-1})'(b) = \dfrac{1}{f'(a)}$ where $f(a) = b$.
