---
id: calc-product-quotient
module: calc-m3
title: The product and quotient rules
minutes: 30
topics: [Product rule, Quotient rule]
drills: [calc-d-product, calc-d-quotient]
refs: [calc-ref-derivatives]
---
## Why we need new rules

Lesson 8 handled sums: the derivative of a sum is the sum of the derivatives. It's tempting to guess the same for products, but it fails immediately. Take $x\cdot x = x^2$: its derivative is $2x$, while the product of the derivatives is $1\cdot1 = 1$. Products and quotients need their own rules.

## The product rule

$$\frac{d}{dx}\left[f(x)\,g(x)\right] = f'(x)\,g(x) + f(x)\,g'(x).$$

In words: derivative of the first times the second, plus the first times the derivative of the second.

*Where it comes from.* Picture a rectangle with sides $f(x)$ and $g(x)$, so its area is $fg$. Nudge $x$ by $h$. The sides grow by $\Delta f$ and $\Delta g$, and the area grows by three pieces: a strip $\Delta f\cdot g$, a strip $f\cdot\Delta g$, and a tiny corner $\Delta f\,\Delta g$.

```shape
{"polygons": [{"points": [[0, 0], [5, 0], [5, 3], [0, 3]]}, {"points": [[5, 0], [6, 0], [6, 3], [5, 3]], "fill": true}, {"points": [[0, 3], [5, 3], [5, 3.6], [0, 3.6]], "fill": true}, {"points": [[5, 3], [6, 3], [6, 3.6], [5, 3.6]]}], "labels": [{"at": [2.5, 1.5], "text": "f·g"}, {"at": [5.5, 1.5], "text": "Δf·g"}, {"at": [2.5, 3.3], "text": "f·Δg"}, {"at": [6.5, 3.8], "text": "Δf·Δg"}], "caption": "Change in area = Δf·g + f·Δg + Δf·Δg"}
```

Divide the change by $h$:
$$\frac{\Delta(fg)}{h} = \frac{\Delta f}{h}g + f\frac{\Delta g}{h} + \frac{\Delta f}{h}\Delta g.$$
As $h \to 0$, $\frac{\Delta f}{h} \to f'$ and $\frac{\Delta g}{h} \to g'$, while $\Delta g \to 0$ (because $g$ is continuous), so the corner term disappears. What's left is $f'g + fg'$.

### Example 1

Differentiate $y = (x^2 + 1)e^x$.

Let $f = x^2 + 1$ (so $f' = 2x$) and $g = e^x$ (so $g' = e^x$).
$$y' = 2x\cdot e^x + (x^2 + 1)e^x = e^x(x^2 + 2x + 1) = \mathbf{e^x(x + 1)^2}.$$

Factoring out $e^x$ makes it easy to see that $y' \ge 0$ everywhere, with a horizontal tangent only at $x = -1$.

### Example 2

Differentiate $y = \sqrt x\,(3x - 2)$.

Product rule with $f = x^{1/2}$, $g = 3x - 2$:
$$y' = \tfrac12x^{-1/2}(3x - 2) + x^{1/2}\cdot3 = \frac{3x - 2}{2\sqrt x} + 3\sqrt x = \frac{3x - 2 + 6x}{2\sqrt x} = \mathbf{\frac{9x - 2}{2\sqrt x}}.$$

(You could also expand first, $y = 3x^{3/2} - 2x^{1/2}$, and use the power rule: $y' = \frac92x^{1/2} - x^{-1/2}$, which is the same thing.)

For three factors, apply the rule twice: $(fgh)' = f'gh + fg'h + fgh'$. Each term differentiates one factor and leaves the others alone.

## The quotient rule

$$\frac{d}{dx}\left[\frac{f(x)}{g(x)}\right] = \frac{f'(x)\,g(x) - f(x)\,g'(x)}{\left[g(x)\right]^2}, \qquad g(x) \ne 0.$$

A common mnemonic, with "hi" for the numerator and "lo" for the denominator: *lo d-hi minus hi d-lo, over lo squared*. The order in the numerator matters because of the minus sign.

*Where it comes from.* Let $Q = f/g$, so $f = Qg$. Product rule: $f' = Q'g + Qg'$. Solve for $Q'$:
$$Q' = \frac{f' - Qg'}{g} = \frac{f' - \frac fg g'}{g} = \frac{f'g - fg'}{g^2}.$$

### Example 3

Differentiate $y = \dfrac{2x + 1}{x^2 + 3}$.

Hi $= 2x + 1$ (d-hi $= 2$); lo $= x^2 + 3$ (d-lo $= 2x$).
$$y' = \frac{2(x^2 + 3) - (2x + 1)(2x)}{(x^2 + 3)^2} = \frac{2x^2 + 6 - 4x^2 - 2x}{(x^2 + 3)^2} = \mathbf{\frac{-2x^2 - 2x + 6}{(x^2 + 3)^2}}.$$

Simplify the numerator; leave the denominator factored.

### Example 4

Find the tangent line to $y = \dfrac{x}{x - 2}$ at $x = 3$.

$y' = \dfrac{1\cdot(x - 2) - x\cdot1}{(x - 2)^2} = \dfrac{-2}{(x - 2)^2}$. At $x = 3$: $y = 3$ and $y' = -2$. Tangent: $y - 3 = -2(x - 3)$, or $y = -2x + 9$.

```plot
{"x": [-2, 8], "y": [-6, 8], "functions": [{"f": "x/(x - 2)"}], "tangents": [{"f": "x/(x - 2)", "at": 3}], "points": [{"at": [3, 3], "label": "(3, 3)"}], "caption": "y = x/(x − 2) and its tangent at x = 3"}
```

## Using the rules with values

Often you get a table of function values rather than formulas. The rules work the same way.

### Example 5

Given $f(2) = 3$, $f'(2) = -1$, $g(2) = 4$, $g'(2) = 5$. Find $(fg)'(2)$ and $\left(\frac fg\right)'(2)$.

- $(fg)'(2) = f'(2)g(2) + f(2)g'(2) = (-1)(4) + (3)(5) = 11$.
- $\left(\frac fg\right)'(2) = \dfrac{f'(2)g(2) - f(2)g'(2)}{g(2)^2} = \dfrac{-4 - 15}{16} = -\dfrac{19}{16}$.

## When not to use the quotient rule

A quotient with a constant denominator is just a constant multiple: $\frac{x^3 + x}{5} = \frac15(x^3 + x)$, derivative $\frac15(3x^2 + 1)$. A quotient with a monomial denominator can be split: $\frac{x^2 + 4}{x} = x + 4x^{-1}$. And a constant over a function, like $\frac{3}{x^2 + 1}$, is often easier as $3(x^2 + 1)^{-1}$ with the chain rule (Lesson 11). The quotient rule always works, but these routes are shorter and less error-prone.

### Example 6

Differentiate $y = \dfrac{x^2 - 1}{x^2 + 1}$, find where its tangent line is horizontal, and find the tangent line at $x = 1$.

Quotient rule with hi $= x^2 - 1$, lo $= x^2 + 1$ (both have derivative $2x$):
$$y' = \frac{2x(x^2 + 1) - (x^2 - 1)(2x)}{(x^2 + 1)^2} = \frac{2x^3 + 2x - 2x^3 + 2x}{(x^2 + 1)^2} = \frac{4x}{(x^2 + 1)^2}.$$
The denominator is never 0, so $y' = 0$ only when $4x = 0$: a horizontal tangent at $x = 0$, the point $(0, -1)$. At $x = 1$: $y = 0$ and $y' = \frac{4}{4} = 1$, so the tangent line is $y = x - 1$.

Notice how the cubic terms canceled in the numerator. Always simplify the numerator fully; that's where the zeros of $y'$ come from.

## Common mistakes

- **$(fg)' = f'g'$.** False; check with $x\cdot x$.
- *Reversing the quotient numerator.* $fg' - f'g$ gives the negative of the right answer.
- *Forgetting to square the denominator.*
- *Dropping parentheses* when subtracting $f g'$: in Example 3 the whole product $(2x + 1)(2x)$ is subtracted.
- *Expanding the denominator.* Leave $(x^2 + 3)^2$ alone; expanding only creates work and hides where $y'$ is undefined.

## Key points

- Product rule: $(fg)' = f'g + fg'$.
- Quotient rule: $\left(\frac fg\right)' = \dfrac{f'g - fg'}{g^2}$ ("lo d-hi minus hi d-lo, over lo squared").
- Simplify before differentiating when you can; simplify the numerator after.
- The rules apply equally to formulas and to tables of values.
