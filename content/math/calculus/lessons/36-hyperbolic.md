---
id: calc-hyperbolic
module: calc-m8
title: Hyperbolic functions
minutes: 40
topics: [Hyperbolic functions]
drills: [calc-d-hyp-deriv, calc-d-hyp-integral, calc-d-catenary]
refs: [calc-ref-derivatives, calc-ref-integrals]
---
## Two halves of $e^x$

This lesson closes the techniques module with a family of functions built from $e^x$ that behaves almost exactly like the trig functions. They describe hanging cables, appear in relativity and heat flow, and give a second way to handle integrals with $\sqrt{x^2 + a^2}$, the shape Lesson 32 attacked with $x = a\tan\theta$.

Every function can be split into an even part and an odd part. Doing that to $e^x$ gives

$$\cosh x = \frac{e^x + e^{-x}}{2}, \qquad \sinh x = \frac{e^x - e^{-x}}{2},$$

the **hyperbolic cosine** and the **hyperbolic sine** (said "cosh" and "sinch" or "shine"). Adding them gives back $\cosh x + \sinh x = e^x$. The other four **hyperbolic functions** are defined from these two, just as in trig:

$$\tanh x = \frac{\sinh x}{\cosh x}, \quad \coth x = \frac{\cosh x}{\sinh x}, \quad \operatorname{sech} x = \frac{1}{\cosh x}, \quad \operatorname{csch} x = \frac{1}{\sinh x}.$$

```plot
{"x": [-3, 3], "y": [-4, 5], "functions": [{"f": "cosh(x)"}, {"f": "sinh(x)"}, {"f": "e^x/2", "dashed": true}, {"f": "e^(-x)/2", "dashed": true}], "labels": [{"at": [-2.9, 4.3], "text": "cosh x"}, {"at": [-2.2, -3.4], "text": "sinh x"}], "caption": "cosh x (even, minimum 1 at x = 0) and sinh x (odd, through the origin); for large x both hug the dashed curve eˣ/2"}
```

What the graphs show, straight from the definitions:

- $\cosh 0 = 1$ and $\sinh 0 = 0$. Since $e^{-x}$ and $e^x$ swap when $x \to -x$, $\cosh$ is even and $\sinh$ is odd.
- $\cosh x \ge 1$ for every $x$: it's the average of $e^x$ and $e^{-x}$, whose product is 1.
- For large $x$, $e^{-x}$ is negligible, so both are close to $\frac{e^x}{2}$.
- $\tanh x = \dfrac{e^x - e^{-x}}{e^x + e^{-x}}$ lies strictly between $-1$ and $1$, with horizontal asymptotes $y = \pm1$.

Unlike $\sin$ and $\cos$, none of these is periodic.

## Why "hyperbolic": the identities

Square the definitions and subtract:

$$\cosh^2x - \sinh^2x = \frac{e^{2x} + 2 + e^{-2x}}{4} - \frac{e^{2x} - 2 + e^{-2x}}{4} = 1.$$

So the point $(\cosh t, \sinh t)$ always lies on the hyperbola $x^2 - y^2 = 1$ (its right branch, since $\cosh t > 0$), the way $(\cos t, \sin t)$ lies on the circle $x^2 + y^2 = 1$. That is the source of the name. The parameter $t$ is not an angle, though.

```plot
{"x": [-1, 4], "y": [-3, 3], "equal": true, "curves": [{"x": "cosh(t)", "y": "sinh(t)", "t": [-1.9, 1.9]}], "functions": [{"f": "x", "dashed": true}, {"f": "-x", "dashed": true}], "points": [{"at": [1.5431, 1.1752], "label": "(cosh 1, sinh 1)"}, {"at": [1, 0], "label": "t = 0"}], "caption": "As t runs over all real numbers, (cosh t, sinh t) traces the right branch of x² − y² = 1"}
```

Dividing the main identity by $\cosh^2x$ gives $1 - \tanh^2x = \operatorname{sech}^2x$. Expanding exponentials the same way proves the double-angle versions $\sinh 2x = 2\sinh x\cosh x$ and $\cosh 2x = \cosh^2x + \sinh^2x$. A handy pattern: a hyperbolic identity looks like its trig twin, except that the sign flips on any term containing a product of two sines (so $\cos^2 + \sin^2$ becomes $\cosh^2 - \sinh^2$).

## Derivatives and integrals

Differentiate the definitions; the chain rule gives $\frac{d}{dx}e^{-x} = -e^{-x}$:

$$\frac{d}{dx}\sinh x = \frac{e^x + e^{-x}}{2} = \cosh x, \qquad \frac{d}{dx}\cosh x = \frac{e^x - e^{-x}}{2} = \sinh x.$$

There is no minus sign in the second one, unlike $(\cos x)' = -\sin x$. The quotient rule and the main identity then give

$$\frac{d}{dx}\tanh x = \frac{\cosh^2x - \sinh^2x}{\cosh^2x} = \operatorname{sech}^2x.$$

| $f(x)$ | $f'(x)$ | | $f(x)$ | $f'(x)$ |
|---|---|---|---|---|
| $\sinh x$ | $\cosh x$ | | $\coth x$ | $-\operatorname{csch}^2x$ |
| $\cosh x$ | $\sinh x$ | | $\operatorname{sech} x$ | $-\operatorname{sech}x\tanh x$ |
| $\tanh x$ | $\operatorname{sech}^2x$ | | $\operatorname{csch} x$ | $-\operatorname{csch}x\coth x$ |

Read backward, the table gives integrals: $\int\cosh x\,dx = \sinh x + C$, $\int\sinh x\,dx = \cosh x + C$, $\int\operatorname{sech}^2x\,dx = \tanh x + C$. Substitution with $u = \cosh x$ gives $\int\tanh x\,dx = \ln(\cosh x) + C$ (no absolute value needed, since $\cosh x > 0$).

### Example 1

Differentiate (a) $f(x) = \cosh(x^3)$, (b) $g(x) = x\tanh 2x$, (c) $h(x) = \ln(\cosh x)$.

(a) Chain rule: $f'(x) = \sinh(x^3)\cdot3x^2 = \mathbf{3x^2\sinh(x^3)}$.

(b) Product rule, then the chain rule on $\tanh 2x$: $g'(x) = \mathbf{\tanh 2x + 2x\operatorname{sech}^2 2x}$.

(c) $h'(x) = \dfrac{\sinh x}{\cosh x} = \mathbf{\tanh x}$, which confirms the integral of $\tanh x$ above.

### Example 2

Evaluate (a) $\displaystyle\int\sinh^2x\cosh x\,dx$ and (b) $\displaystyle\int_0^{\ln 2}\cosh x\,dx$.

(a) Let $u = \sinh x$, $du = \cosh x\,dx$: $\int u^2\,du = \mathbf{\tfrac13\sinh^3x + C}$.

(b) $\Big[\sinh x\Big]_0^{\ln 2} = \sinh(\ln 2) - 0$. Use the definition with $e^{\ln 2} = 2$ and $e^{-\ln 2} = \frac12$: $\sinh(\ln 2) = \frac{2 - \frac12}{2} = \mathbf{\tfrac34}$. Hyperbolic functions of logarithms always simplify this way.

## Inverse hyperbolic functions

$\sinh$ is increasing on all of $\mathbb{R}$, so it has an inverse, the **inverse hyperbolic sine** $\sinh^{-1}x$ (also written arsinh). Because $\sinh$ is built from $e^x$, its inverse is a logarithm. Solve $x = \sinh y$ for $y$: multiply $x = \frac{e^y - e^{-y}}{2}$ by $2e^y$ to get $(e^y)^2 - 2x\,e^y - 1 = 0$, a quadratic in $e^y$. The quadratic formula gives $e^y = x \pm\sqrt{x^2 + 1}$, and only the plus sign is positive. So

$$\sinh^{-1}x = \ln\left(x + \sqrt{x^2 + 1}\right) \quad\text{for all } x.$$

$\cosh$ isn't one-to-one, so (as with $\cos$) we restrict it to $x \ge 0$. With $\tanh$ the formulas are:

$$\cosh^{-1}x = \ln\left(x + \sqrt{x^2 - 1}\right),\ x \ge 1; \qquad \tanh^{-1}x = \frac12\ln\frac{1 + x}{1 - x},\ -1 < x < 1.$$

Derivatives come from implicit differentiation, exactly as in Lesson 12. If $y = \sinh^{-1}x$ then $\sinh y = x$, so $\cosh y\cdot y' = 1$ and $y' = \frac{1}{\cosh y} = \frac{1}{\sqrt{1 + \sinh^2y}} = \frac{1}{\sqrt{1 + x^2}}$. The same steps give the other two:

$$\frac{d}{dx}\sinh^{-1}x = \frac{1}{\sqrt{x^2 + 1}}, \qquad \frac{d}{dx}\cosh^{-1}x = \frac{1}{\sqrt{x^2 - 1}}\ (x > 1), \qquad \frac{d}{dx}\tanh^{-1}x = \frac{1}{1 - x^2}\ (\lvert x\rvert < 1).$$

Reading these backward (with $u = x/a$, $a > 0$) gives integrals that skip trig substitution entirely:

$$\int\frac{dx}{\sqrt{x^2 + a^2}} = \sinh^{-1}\frac xa + C, \qquad \int\frac{dx}{\sqrt{x^2 - a^2}} = \cosh^{-1}\frac xa + C\ \ (x > a).$$

### Example 3

Evaluate $\displaystyle\int_0^4\frac{dx}{\sqrt{x^2 + 9}}$.

With $a = 3$: $\Big[\sinh^{-1}\frac x3\Big]_0^4 = \sinh^{-1}\frac43 - 0$. Use the log form: $\ln\left(\frac43 + \sqrt{\frac{16}{9} + 1}\right) = \ln\left(\frac43 + \frac53\right) = \mathbf{\ln 3} \approx 1.0986$.

Trig substitution reaches the same place: $x = 3\tan\theta$ leads to $\ln\lvert\sec\theta + \tan\theta\rvert$, which at $\tan\theta = \frac43$, $\sec\theta = \frac53$ is again $\ln 3$. The two antiderivatives differ only by a constant.

## The catenary

A flexible cable or chain hanging under its own weight between two supports does not form a parabola. Balancing the forces on each small piece leads to the condition $y'' = \frac1a\sqrt{1 + (y')^2}$, where $a$ is the ratio of the horizontal tension to the cable's weight per unit length. The curve that satisfies it is the **catenary**

$$y = a\cosh\frac xa,$$

with its lowest point at $(0, a)$. Check: $y' = \sinh\frac xa$, so $\sqrt{1 + (y')^2} = \cosh\frac xa$, and $y'' = \frac1a\cosh\frac xa$. ✓

The same identity makes catenary arc length easy. On $[-b, b]$ (Lesson 29's formula):

$$L = \int_{-b}^{b}\sqrt{1 + \sinh^2\frac xa}\,dx = \int_{-b}^{b}\cosh\frac xa\,dx = 2a\sinh\frac ba.$$

### Example 4

A power line hangs between two poles 40 m apart in the shape $y = 25\cosh\frac{x}{25}$ (meters, poles at $x = \pm20$). How far does it sag below the tops of the poles, and how long is the cable?

*Sag.* The supports are at height $25\cosh(0.8) \approx 25(1.33743) = 33.436$, and the low point is at height 25. Sag $= 25(\cosh 0.8 - 1) \approx \mathbf{8.44}$ m.

*Length.* $L = 2(25)\sinh\frac{20}{25} = 50\sinh(0.8) \approx 50(0.88811) \approx \mathbf{44.41}$ m, about 4.4 m more than the straight-line gap.

```plot
{"x": [-24, 24], "y": [0, 40], "equal": true, "functions": [{"f": "25cosh(x/25)", "from": -20, "to": 20, "label": "catenary"}, {"f": "25 + 0.021090*x^2", "from": -20, "to": 20, "dashed": true}], "segments": [{"from": [-20, 0], "to": [-20, 33.436]}, {"from": [20, 0], "to": [20, 33.436]}], "caption": "The catenary y = 25 cosh(x/25) (solid) and the parabola with the same low point and supports (dashed): close, but not the same curve"}
```

## Common mistakes

- *Adding a minus sign to $(\cosh x)'$.* It's $+\sinh x$; only the trig version has the sign change.
- *Using the trig identity.* $\cosh^2x - \sinh^2x = 1$, with a minus sign.
- *Reading $\sinh^{-1}x$ as $\frac{1}{\sinh x}$.* That's $\operatorname{csch}x$; $\sinh^{-1}$ is the inverse function.
- *Forgetting domains.* $\cosh^{-1}x$ needs $x \ge 1$ and $\tanh^{-1}x$ needs $\lvert x\rvert < 1$.
- *Matching $\int\frac{dx}{\sqrt{x^2 + a^2}}$ to arcsin.* Arcsin goes with $\sqrt{a^2 - x^2}$; the plus sign under the root gives $\sinh^{-1}$.

## Key points

- $\cosh x = \frac{e^x + e^{-x}}{2}$, $\sinh x = \frac{e^x - e^{-x}}{2}$, $\tanh x = \frac{\sinh x}{\cosh x}$; $\cosh^2x - \sinh^2x = 1$.
- $(\sinh x)' = \cosh x$, $(\cosh x)' = \sinh x$, $(\tanh x)' = \operatorname{sech}^2x$.
- $\sinh^{-1}x = \ln(x + \sqrt{x^2 + 1})$, with derivative $\frac{1}{\sqrt{x^2 + 1}}$; $\int\frac{dx}{\sqrt{x^2 + a^2}} = \sinh^{-1}\frac xa + C$.
- A hanging cable is a catenary $y = a\cosh\frac xa$; its length on $[-b, b]$ is $2a\sinh\frac ba$.
