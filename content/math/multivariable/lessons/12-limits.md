---
id: mv-limits
module: mv-m3
title: Limits and continuity
minutes: 30
topics: [Limits of several variables, Continuity]
drills: [mv-d-limit-path]
refs: [mv-ref-differential]
---
## Why limits get harder

In one variable, $x$ can approach $a$ from only two directions, left and right. In the plane,
$(x, y)$ can approach $(a, b)$ from infinitely many directions, and along curved paths
too. That makes limits of functions of two variables subtler: a limit exists only if *every*
way of approaching gives the same value. This lesson shows how to prove a limit does not
exist (easy: find two paths that disagree) and how to show one does exist (harder:
continuity, algebra, or squeezing). Derivatives in the next lessons are limits, so this is
the foundation.

## The definition

We write $\displaystyle\lim_{(x,y)\to(a,b)} f(x, y) = L$ if $f(x, y)$ can be made as close
to $L$ as we like by taking $(x, y)$ close enough to $(a, b)$ (but not equal to it). In
symbols: for every $\varepsilon > 0$ there is a $\delta > 0$ such that
$0 < \sqrt{(x-a)^2 + (y-b)^2} < \delta$ implies $|f(x, y) - L| < \varepsilon$. "Close" now
means "inside a small disk," which contains every direction at once.

## Showing a limit does not exist: the two-path test

If $f(x, y) \to L_1$ along one path to $(a, b)$ and $f(x, y) \to L_2$ along another, with
$L_1 \ne L_2$, the limit does not exist.

### Example 1

Show that $\displaystyle\lim_{(x,y)\to(0,0)}\frac{x^2 - y^2}{x^2 + y^2}$ does not exist.

1. Along the $x$-axis ($y = 0$, $x \ne 0$): $f = \dfrac{x^2}{x^2} = 1$.
2. Along the $y$-axis ($x = 0$): $f = \dfrac{-y^2}{y^2} = -1$.
3. Two different values, so no limit.

The contour map shows why. Every level curve is a line through the origin (in polar form
$f = \cos2\theta$ depends only on direction), so arbitrarily close to $(0,0)$ the function
takes every value between $-1$ and $1$.

```plot
{"x": [-3, 3], "y": [-3, 3], "equal": true, "functions": [{"f": "0*x", "label": "c = 1"}, {"f": "0.57735*x", "label": "c = 0.5"}, {"f": "-0.57735*x"}, {"f": "x", "label": "c = 0"}, {"f": "-x"}, {"f": "1.73205*x", "label": "c = −0.5"}, {"f": "-1.73205*x"}], "segments": [{"from": [0, -3], "to": [0, 3], "label": "c = −1"}], "points": [{"at": [0, 0], "open": true}], "caption": "Level curves of (x² − y²)/(x² + y²) all crowd into the origin"}
```

### Example 2: lines are not enough

Consider $f(x, y) = \dfrac{xy^2}{x^2 + y^4}$ near the origin.

1. Along any line $y = mx$: $f = \dfrac{m^2x^3}{x^2 + m^4x^4} = \dfrac{m^2x}{1 + m^4x^2} \to 0$. Along the $y$-axis, $f = 0$.
2. So every straight line gives 0. Yet along the parabola $x = y^2$:
   $f = \dfrac{y^2\cdot y^2}{y^4 + y^4} = \dfrac12$.
3. The limit does not exist.

The lesson: agreement along all lines does not prove a limit exists. Paths of the form
$x = y^2$ or $y = x^2$ are worth trying when powers are unbalanced.

## Showing a limit exists

**Continuity.** A function is **continuous** at $(a, b)$ if
$\lim_{(x,y)\to(a,b)}f(x,y) = f(a, b)$. Polynomials are continuous everywhere; rational
functions are continuous wherever the denominator is nonzero; and sums, products,
quotients (nonzero denominator) and compositions of continuous functions are continuous.
So for "nice" functions at points in their domain, you can simply substitute. For
instance, $\lim_{(x,y)\to(1,2)}\left(x^2y^3 - 3xy + \ln(x + y)\right) = 8 - 6 + \ln3$.

**Algebra.** Sometimes a factor cancels:

$$\lim_{(x,y)\to(1,1)}\frac{x^2 - y^2}{x - y} = \lim_{(x,y)\to(1,1)}(x + y) = 2.$$

**Squeeze theorem.** If $|f(x,y) - L| \le g(x, y)$ and $g \to 0$, then $f \to L$. A handy
fact is that $|x| \le \sqrt{x^2 + y^2}$ and $\dfrac{x^2}{x^2 + y^2} \le 1$.

### Example 3: squeezing

Show $\displaystyle\lim_{(x,y)\to(0,0)}\frac{3x^2y}{x^2 + y^2} = 0$.

1. Because $0 \le \dfrac{x^2}{x^2 + y^2} \le 1$, we get $\left|\dfrac{3x^2y}{x^2 + y^2}\right| \le 3|y|$.
2. As $(x, y)\to(0, 0)$, $3|y| \to 0$.
3. By the squeeze theorem the limit is $0$.

Compare with Example 1: here the numerator has degree 3 and the denominator degree 2, so
the numerator wins and drags the fraction to 0. When numerator and denominator have the
same total degree, suspect a path-dependent limit.

### Polar coordinates

Writing $x = r\cos\theta$, $y = r\sin\theta$ turns "$(x, y)\to(0,0)$" into "$r \to 0^+$,
whatever $\theta$ does." If $|f| \le g(r)$ with $g(r)\to 0$ independent of $\theta$, the
limit is 0. In Example 3: $\dfrac{3r^3\cos^2\theta\sin\theta}{r^2} = 3r\cos^2\theta\sin\theta$,
bounded by $3r \to 0$. In Example 1: $\dfrac{r^2(\cos^2\theta - \sin^2\theta)}{r^2} = \cos2\theta$,
which depends on the direction $\theta$ and does not settle down.

## Continuity and its uses

A function is continuous on a region if it is continuous at every point of it. Removing
a problem point can sometimes be fixed: $f(x,y) = \dfrac{3x^2y}{x^2+y^2}$ is undefined at the
origin, but defining $f(0,0) = 0$ makes it continuous everywhere, by Example 3. By
contrast, no value at the origin can make Example 1 continuous.

Everything here extends to three variables: $(x, y, z)\to(a, b, c)$, with balls in place of
disks.

## Common mistakes

- Concluding a limit exists because two (or all straight-line) paths agree.
- Plugging in when the function is undefined at the point (0/0 is not an answer).
- Forgetting that in polar form the bound must not depend on $\theta$.
- Thinking "defined at the point" means continuous: the limit must also exist and match.

## Key points

- A limit exists only if every approach gives the same value.
- Two paths with different limits prove nonexistence; try axes, lines $y = mx$, and parabolas.
- To prove existence: continuity (substitute), algebraic simplification, or squeeze (often via polar coordinates).
- Polynomials and rational functions (away from zeros of the denominator) are continuous.
