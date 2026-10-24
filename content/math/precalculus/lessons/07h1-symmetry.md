---
id: pc-m2-h-symmetry
module: pc-m2
title: Symmetry beyond even and odd
minutes: 45
honors: true
topics: [Symmetry about a line or point, Even and odd parts]
drills: [pc-m2-r2-cubic-center, pc-m2-r2-even-odd-parts]
refs: [pc-ref-functions]
---
## Symmetry that has moved

Lesson 4 gave two algebraic tests: $f(-x) = f(x)$ for symmetry about the $y$-axis and $f(-x) = -f(x)$ for symmetry about the origin. But most symmetric graphs you meet are not centered at the origin. A parabola is symmetric about its own vertical axis, wherever that is, and (as you will see) every cubic is symmetric about a point that is usually not $(0, 0)$. This honors lesson combines the symmetry tests with the shifts from Lesson 5 to test symmetry about *any* vertical line or point. Then it studies how evenness and oddness behave under arithmetic and composition, proves that every function on a symmetric domain splits into an even part plus an odd part, and ends with two ways to build symmetric graphs, $f(\lvert x \rvert)$ and $\lvert f(x) \rvert$.

## Symmetry about a vertical line

Mirror symmetry across the line $x = a$ pairs the point $a + t$ (that is, $t$ units right of the line) with $a - t$ ($t$ units left). So the graph of $f$ is symmetric about $x = a$ exactly when

$$f(a + t) = f(a - t) \quad \text{for every } t$$

(with $a + t$ in the domain exactly when $a - t$ is).

There is a cleaner way to see this. Let $g(t) = f(t + a)$. By Lesson 5, the graph of $g$ is the graph of $f$ shifted $a$ units *left*, which carries the line $x = a$ onto the $y$-axis. So

> $f$ is symmetric about $x = a$ exactly when $g(t) = f(t + a)$ is an even function of $t$.

Shift the suspected line of symmetry to the $y$-axis, then use the even test you already know.

### Example 1

Show that $f(x) = 2x^2 - 12x + 7$ is symmetric about $x = 3$, and explain where the axis $x = -\tfrac{b}{2a}$ of any parabola comes from.

Substitute $x = 3 + t$:

$$f(3 + t) = 2(9 + 6t + t^2) - 12(3 + t) + 7 = 18 + 12t + 2t^2 - 36 - 12t + 7 = 2t^2 - 11.$$

The $t$ terms cancel, leaving only an even power of $t$, so $f(3 + t)$ is even in $t$ and the graph is symmetric about $x = 3$.

For a general quadratic $f(x) = ax^2 + bx + c$ with $a \ne 0$, substitute $x = h + t$. The coefficient of $t$ comes out to $2ah + b$. Choosing $h = -\tfrac{b}{2a}$ makes it zero, so $f(h + t)$ has only $t^2$ and constant terms and is even in $t$. That is the reason every parabola $y = ax^2 + bx + c$ has its **axis of symmetry** at $x = -\tfrac{b}{2a}$: it is the one shift that kills the odd power.

## Symmetry about a point

A graph has **point symmetry** about the point $(a, b)$, called its **center of symmetry**, when rotating the graph 180° about $(a, b)$ leaves it unchanged. A half-turn about $(a, b)$ sends each point to the point on the opposite side with $(a, b)$ as the midpoint. So the points above $x = a + t$ and $x = a - t$ must have average height $b$:

$$f(a + t) + f(a - t) = 2b \quad \text{for every } t.$$

The shift picture again does the work. Move $(a, b)$ to the origin by shifting left $a$ and down $b$: $g(t) = f(t + a) - b$. Then

> the graph of $f$ is symmetric about $(a, b)$ exactly when $g(t) = f(t + a) - b$ is odd.

Origin symmetry from Lesson 4 is the special case $(a, b) = (0, 0)$.

**Every cubic has a center of symmetry.** Take $f(x) = Ax^3 + Bx^2 + Cx + D$ with $A \ne 0$ and substitute $x = a + t$. Expanding, the $t^2$ terms are $3Aa\,t^2$ (from the cube) and $B t^2$ (from the square), so the coefficient of $t^2$ is $3Aa + B$. Choosing $a = -\tfrac{B}{3A}$ makes it zero, and then

$$f(a + t) = At^3 + (\text{number})\,t + f(a).$$

Subtracting $f(a)$ leaves only odd powers of $t$, so $f(a + t) - f(a)$ is odd. Every cubic is symmetric about the point $\left(-\tfrac{B}{3A},\, f\!\left(-\tfrac{B}{3A}\right)\right)$. (In calculus this point is called the inflection point; you will not need that word here.)

### Example 2

Find the center of symmetry of $f(x) = x^3 - 6x^2 + 9x + 1$ and use it to find $f(4)$ from $f(0)$.

Here $A = 1$ and $B = -6$, so $a = -\tfrac{-6}{3} = 2$ and $f(2) = 8 - 24 + 18 + 1 = 3$. The center is $(2, 3)$. As a check, expanding gives $f(2 + t) = t^3 - 3t + 3$, and $t^3 - 3t$ is odd. ✓

The points $x = 0$ and $x = 4$ sit 2 units on either side of $x = 2$, so $f(0) + f(4) = 2 \cdot 3 = 6$. Since $f(0) = 1$, $f(4) = 5$. Direct check: $64 - 96 + 36 + 1 = 5$. ✓ The symmetry also pairs the turning points: the local maximum $(1, 5)$ and the local minimum $(3, 1)$ have midpoint $(2, 3)$.

![The cubic y = x³ − 6x² + 9x + 1 with its center of symmetry (2, 3) marked. A dashed segment joins (0, 1) to (4, 5) through the center, and the local maximum (1, 5) and local minimum (3, 1) sit symmetrically on either side.](images/pc-m2-cubic-center.svg)

Rational functions can have centers too. For example, $y = 2 + \dfrac{3}{x - 1}$ is the odd function $\dfrac3x$ shifted right 1 and up 2, so it is symmetric about $(1, 2)$, the point where its asymptotes $x = 1$ and $y = 2$ cross.

## The algebra of even and odd functions

Assume all domains are symmetric about 0. Evenness and oddness combine like the signs $+$ and $-$:

| Combination | Result | Reason |
|---|---|---|
| even $\pm$ even | even | $E_1(-x) \pm E_2(-x) = E_1(x) \pm E_2(x)$ |
| odd $\pm$ odd | odd | the two minus signs factor out |
| even $\times$ even, odd $\times$ odd | even | $(-f(x))(-g(x)) = f(x)g(x)$ |
| even $\times$ odd | odd | one minus sign survives |
| $f \circ g$ with $g$ even | even | $f(g(-x)) = f(g(x))$, whatever $f$ is |
| odd $\circ$ odd | odd | $f(g(-x)) = f(-g(x)) = -f(g(x))$ |
| even $\circ$ odd | even | $f(-g(x)) = f(g(x))$ |

The sum of a nonzero even function and a nonzero odd function is *neither*. Here is why: if $h = E + O$ were even, then $O = h - E$ would be even as well as odd, and the only function that is both is the zero function, because $f(x) = f(-x) = -f(x)$ forces $f(x) = 0$. A similar argument rules out $h$ being odd.

### Example 3

Classify without expanding: (a) $x^3\lvert x \rvert$, (b) $\lvert x^3 - x \rvert$, (c) $(x^2 + 1)^5$, (d) $(x^3 + x)^3$.

- (a) odd $\times$ even, so odd.
- (b) $\lvert u \rvert$ is even and $x^3 - x$ is odd; even $\circ$ odd is even.
- (c) The inner function $x^2 + 1$ is even, so the composition is even.
- (d) $u^3$ and $x^3 + x$ are both odd; odd $\circ$ odd is odd.

## Splitting any function into even and odd parts

Lesson 4 said most functions are neither even nor odd. Remarkably, every function on a domain symmetric about 0 is the sum of one even function and one odd function. Define the **even part** and the **odd part** of $f$ by

$$E(x) = \frac{f(x) + f(-x)}{2}, \qquad O(x) = \frac{f(x) - f(-x)}{2}.$$

Three checks:

- $E(-x) = \dfrac{f(-x) + f(x)}{2} = E(x)$, so $E$ is even.
- $O(-x) = \dfrac{f(-x) - f(x)}{2} = -O(x)$, so $O$ is odd.
- $E(x) + O(x) = \dfrac{2f(x)}{2} = f(x)$.

The split is also *unique*. If $f = E_1 + O_1 = E_2 + O_2$, then $E_1 - E_2 = O_2 - O_1$ is both even and odd, hence zero. For a polynomial, $E$ is just the even-power terms and $O$ the odd-power terms: for $f(x) = x^3 + 2x^2 - 5x + 4$, $E(x) = 2x^2 + 4$ and $O(x) = x^3 - 5x$.

### Example 4

Find the even and odd parts of $f(x) = 2^x$ and of $g(x) = \dfrac{1}{x - 2}$.

For $2^x$, the domain is all reals:

$$E(x) = \frac{2^x + 2^{-x}}{2}, \qquad O(x) = \frac{2^x - 2^{-x}}{2}.$$

At $x = 1$: $E(1) = \frac{2 + 0.5}{2} = 1.25$ and $O(1) = 0.75$, which add to $2^1 = 2$. ✓ With base $e$ instead of 2, these two parts are famous enough to have names, the hyperbolic cosine and hyperbolic sine ($\cosh x$ and $\sinh x$), which you will meet in calculus.

For $g$, the domain $x \ne 2$ is *not* symmetric: $g(-x)$ needs $x \ne -2$. So the split lives on the symmetric domain $x \ne \pm 2$. With $g(-x) = \dfrac{1}{-x - 2} = -\dfrac{1}{x + 2}$:

$$E(x) = \frac12\left(\frac{1}{x - 2} - \frac{1}{x + 2}\right) = \frac{2}{x^2 - 4}, \qquad O(x) = \frac12\left(\frac{1}{x - 2} + \frac{1}{x + 2}\right) = \frac{x}{x^2 - 4}.$$

Check: $\dfrac{2 + x}{x^2 - 4} = \dfrac{x + 2}{(x - 2)(x + 2)} = \dfrac{1}{x - 2}$ for $x \ne -2$. ✓

## Building symmetric graphs: $f(\lvert x \rvert)$ and $\lvert f(x) \rvert$

Two compositions with absolute value create graphs from a known one, and they are easy to confuse.

- $y = f(\lvert x \rvert)$: for $x \ge 0$ it equals $f(x)$; for $x < 0$ it equals $f(-x)$. So keep the right half of the graph of $f$, throw away the left half, and replace it by the mirror image of the right half. The result is always even (the inner function $\lvert x \rvert$ is even).
- $y = \lvert f(x) \rvert$: keep every point on or above the $x$-axis and reflect every point below it up across the $x$-axis. The result is never below the axis, but it is usually not even.

```plot
{"x": [-5, 5], "y": [-5, 6], "functions": [{"f": "x^2 - 2*x - 3", "dashed": true, "label": "y = f(x)"}, {"f": "abs(x^2 - 2*x - 3)", "label": "y = |f(x)|"}], "points": [{"at": [1, 4], "label": "(1, 4)"}, {"at": [-1, 0]}, {"at": [3, 0]}], "caption": "f(x) = x² − 2x − 3 (dashed) and |f(x)|: the part between the zeros −1 and 3 flips up, so the vertex (1, −4) becomes (1, 4)."}
```

```plot
{"x": [-5, 5], "y": [-5, 6], "functions": [{"f": "x^2 - 2*x - 3", "dashed": true, "label": "y = f(x)"}, {"f": "x^2 - 2*abs(x) - 3", "label": "y = f(|x|)"}], "points": [{"at": [1, -4], "label": "(1, −4)"}, {"at": [-1, -4], "label": "(−1, −4)"}], "caption": "f(|x|) keeps the right half of f and mirrors it across the y-axis, giving two vertices (±1, −4) and zeros ±3."}
```

## Common mistakes

- *Testing the wrong center.* $f(-x) = f(x)$ only tests the $y$-axis. For a line $x = a$ or a point $(a, b)$, shift first: test $f(a + t)$.
- *Forgetting the height of the center.* Point symmetry about $(a, b)$ means $f(a + t) + f(a - t) = 2b$, not $= 0$.
- *Using $-\tfrac{B}{2A}$ for a cubic.* The center of $Ax^3 + Bx^2 + Cx + D$ is at $x = -\tfrac{B}{3A}$; $-\tfrac{b}{2a}$ is for parabolas.
- *Thinking "odd times odd is odd".* Like signs, it is even: $x \cdot x^3 = x^4$.
- *Splitting on a non-symmetric domain.* $E$ and $O$ use $f(-x)$, so they exist only where both $x$ and $-x$ are in the domain.
- *Mixing up $f(\lvert x \rvert)$ and $\lvert f(x) \rvert$.* The first mirrors the right half across the $y$-axis; the second flips the negative parts up across the $x$-axis.

## Key points

- Symmetric about $x = a$: $f(a + t) = f(a - t)$, that is, $f(t + a)$ is even in $t$.
- Symmetric about $(a, b)$: $f(a + t) + f(a - t) = 2b$, that is, $f(t + a) - b$ is odd in $t$.
- Every parabola has its axis at $x = -\tfrac{b}{2a}$; every cubic has a center of symmetry at $x = -\tfrac{B}{3A}$.
- Parity combines like signs: odd $\times$ odd is even, even $\times$ odd is odd; $f \circ g$ is even whenever $g$ is even.
- On a symmetric domain, $f = E + O$ with $E(x) = \frac{f(x) + f(-x)}{2}$ and $O(x) = \frac{f(x) - f(-x)}{2}$, and the split is unique.
- $f(\lvert x \rvert)$ is always even; $\lvert f(x) \rvert$ is never negative.
