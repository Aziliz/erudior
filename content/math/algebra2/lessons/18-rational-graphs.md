---
id: a2-rational-graphs
module: a2-m5
title: Graphing rational functions
minutes: 40
topics: [Rational functions, Inverse variation]
drills: [a2-d-rat-features, a2-d-rat-hole, a2-d-inverse-variation]
refs: [alg-ref-functions]
---
The lessons so far in this module treated rational expressions as algebra: simplify, combine, solve. This lesson looks at them as functions and asks what their graphs look like. Unlike polynomials, rational functions have breaks: vertical asymptotes where the graph shoots up or down, holes where a single point is missing, and horizontal asymptotes that the graph levels off toward. The factoring and excluded-value skills from earlier in the module find every one of these features. The lesson ends with inverse variation, the simplest rational model. The next lesson uses the same zeros and asymptotes to solve inequalities.

## The reciprocal function

A **rational function** is a function of the form $f(x) = \dfrac{P(x)}{Q(x)}$, where $P$ and $Q$ are polynomials and $Q$ is not the zero polynomial. The simplest one is the **reciprocal function** $y = \dfrac1x$.

- It's undefined at $x = 0$. Near 0 the outputs get huge: $\tfrac{1}{0.01} = 100$ and $\tfrac{1}{-0.01} = -100$. The graph runs up along the $y$-axis on the right and down along it on the left, so the line $x = 0$ is a **vertical asymptote**.
- For large $|x|$ the outputs get close to 0: $\tfrac{1}{1000} = 0.001$. The graph levels off toward the $x$-axis, so $y = 0$ is a **horizontal asymptote**.

The two separate curves are called branches. Transformations from Module 1 move these features in the usual way: $y = \dfrac{a}{x - h} + k$ has a vertical asymptote at $x = h$ and a horizontal asymptote at $y = k$.

```plot
{"x": [-6, 6], "y": [-6, 6], "equal": true, "functions": [{"f": "1/x", "label": "y = 1/x"}], "points": [{"at": [1, 1], "label": "(1, 1)"}, {"at": [-1, -1], "label": "(−1, −1)"}], "caption": "The reciprocal function: two branches, a vertical asymptote x = 0 and a horizontal asymptote y = 0"}
```

## Domain, holes and vertical asymptotes

The domain of a rational function is every real number except the zeros of the denominator. What happens to the graph at an excluded value $c$ depends on whether the factor $(x - c)$ cancels.

Factor the numerator and denominator completely and cancel common factors.

- If $(x - c)$ cancels completely, the graph has a **hole** at $x = c$: the function behaves like the simplified expression, with one point removed. Find the hole's $y$-coordinate by plugging $c$ into the *simplified* expression.
- If $(x - c)$ is still in the denominator after cancelling, the graph has a vertical asymptote $x = c$.

Why the difference? Near an asymptote the denominator gets close to 0 while the numerator doesn't, and dividing by a tiny number gives a huge result. At a hole, the factor that goes to 0 is in both the numerator and denominator, and the two cancel out, so nothing blows up.

Near a vertical asymptote, the two sides of the graph go the same direction (both up or both down) if the factor appears an even number of times, as in $\dfrac{1}{(x - 1)^2}$, and opposite directions if it appears an odd number of times, as in $\dfrac1x$. A test point on each side tells you which.

## Horizontal asymptotes

A horizontal asymptote describes the end behavior: what $f(x)$ approaches as $x$ gets very large or very negative. For huge $|x|$, only the leading terms matter, so compare the degree of the numerator ($n$) with the degree of the denominator ($m$):

| Degrees | Horizontal asymptote | Example |
|---|---|---|
| $n < m$ | $y = 0$ | $\dfrac{3x + 1}{x^2 - 4} \to 0$ |
| $n = m$ | $y = \dfrac{\text{leading coefficient of } P}{\text{leading coefficient of } Q}$ | $\dfrac{6x^2 - 1}{2x^2 + x} \to 3$ |
| $n > m$ | none | $\dfrac{x^2 + 1}{x - 1}$ grows without bound |

To see the middle row, divide the top and bottom by $x^2$: $\dfrac{6 - 1/x^2}{2 + 1/x} \to \dfrac{6}{2} = 3$ as the fractions $\tfrac{1}{x^2}$ and $\tfrac1x$ shrink to 0. When $n = m + 1$, the graph instead approaches a slanted line called an **oblique asymptote**; you'll find those in precalculus.

A graph never crosses a vertical asymptote, but it may cross a horizontal one somewhere in the middle; the horizontal asymptote only describes the far left and far right. For example, $y = \dfrac{x}{x^2 + 1}$ has horizontal asymptote $y = 0$ and crosses it at the origin.

## Intercepts

- The $y$-intercept is $f(0)$, if 0 is in the domain.
- The $x$-intercepts are the zeros of the numerator after cancelling, as long as they are in the domain. A zero of the numerator that cancels is a hole, not an intercept.

## Sketching a rational function

1. Factor the numerator and denominator; note the domain.
2. Cancel common factors; each cancelled factor gives a hole.
3. Remaining zeros of the denominator: vertical asymptotes.
4. Compare degrees: horizontal asymptote.
5. Find the intercepts.
6. Plot a test point in each region between vertical asymptotes and $x$-intercepts, then draw smooth branches that follow the asymptotes.

### Example 1

Sketch $f(x) = \dfrac{2x - 2}{x + 2}$.

1. Domain: $x \ne -2$. Nothing cancels ($2x - 2 = 2(x - 1)$), so there are no holes.
2. Vertical asymptote: $x = -2$.
3. Degrees are equal (1 and 1): horizontal asymptote $y = \tfrac21 = 2$.
4. $x$-intercept: $2x - 2 = 0$ at $x = 1$. $y$-intercept: $f(0) = \tfrac{-2}{2} = -1$.
5. Test points left of the asymptote: $f(-3) = \tfrac{-8}{-1} = 8$ and $f(-6) = \tfrac{-14}{-4} = 3.5$. So the left branch is above $y = 2$, rising toward the asymptote. On the right, $f(4) = \tfrac{6}{6} = 1$, so the right branch is below $y = 2$, coming up from the bottom of the asymptote through $(0, -1)$ and $(1, 0)$ and leveling off toward $y = 2$.

```plot
{"x": [-10, 6], "y": [-8, 10], "functions": [{"f": "(2x - 2)/(x + 2)", "label": "f(x) = (2x − 2)/(x + 2)"}], "segments": [{"from": [-2, -8], "to": [-2, 10], "dashed": true, "label": "x = −2"}, {"from": [-10, 2], "to": [6, 2], "dashed": true, "label": "y = 2"}], "points": [{"at": [1, 0], "label": "(1, 0)"}, {"at": [0, -1], "label": "(0, −1)"}, {"at": [-3, 8], "label": "(−3, 8)"}], "caption": "Asymptotes x = −2 and y = 2, with intercepts (1, 0) and (0, −1)"}
```

This is a transformed reciprocal function: dividing gives $f(x) = 2 - \dfrac{6}{x + 2}$, which is $y = \tfrac1x$ stretched by 6, reflected across the $x$-axis, shifted left 2 and up 2.

### Example 2

Find all the features of $g(x) = \dfrac{x^2 - x - 6}{x^2 - 9}$ and sketch it.

1. Factor: $g(x) = \dfrac{(x - 3)(x + 2)}{(x - 3)(x + 3)}$. Domain: $x \ne 3, -3$.
2. $(x - 3)$ cancels, so there's a hole at $x = 3$. Simplified: $\dfrac{x + 2}{x + 3}$, and at $x = 3$ that's $\tfrac56$. Hole: $\left(3, \tfrac56\right)$.
3. $(x + 3)$ remains: vertical asymptote $x = -3$.
4. Degrees equal, leading coefficients 1 and 1: horizontal asymptote $y = 1$.
5. $x$-intercept: $x + 2 = 0$, so $x = -2$. ($x = 3$ is not an intercept; it's the hole.) $y$-intercept: $g(0) = \tfrac{-6}{-9} = \tfrac23$.

```plot
{"x": [-9, 6], "y": [-5, 7], "functions": [{"f": "(x + 2)/(x + 3)", "label": "g(x)"}], "segments": [{"from": [-3, -5], "to": [-3, 7], "dashed": true, "label": "x = −3"}, {"from": [-9, 1], "to": [6, 1], "dashed": true, "label": "y = 1"}], "points": [{"at": [3, 0.8333], "open": true, "label": "hole (3, 5/6)"}, {"at": [-2, 0], "label": "(−2, 0)"}, {"at": [0, 0.6667], "label": "(0, 2/3)"}], "caption": "g has a hole at x = 3 (the cancelled factor) and a vertical asymptote at x = −3 (the factor that remains)"}
```

### Example 3

Find the vertical and horizontal asymptotes of (a) $\dfrac{3x + 1}{x^2 - 4}$, (b) $\dfrac{6x^2 - 1}{2x^2 + x}$, (c) $\dfrac{x^2 + 1}{x - 1}$.

1. (a) $x^2 - 4 = (x - 2)(x + 2)$ and nothing cancels: vertical asymptotes $x = 2$ and $x = -2$. Degree 1 over degree 2: $y = 0$.
2. (b) $2x^2 + x = x(2x + 1)$, zero at $x = 0$ and $x = -\tfrac12$. The numerator isn't zero at either ($-1$ and $\tfrac12$), so both are vertical asymptotes. Equal degrees: $y = \tfrac62 = 3$.
3. (c) Vertical asymptote $x = 1$ (the numerator there is 2). Degree 2 over degree 1: no horizontal asymptote.

## Inverse variation

Two quantities show **inverse variation** when their product is constant: $xy = k$, or

$$y = \frac{k}{x}, \qquad k \ne 0.$$

The number $k$ is the **constant of variation**. As one quantity doubles, the other halves. Compare **direct variation**, $y = kx$, where the ratio $\tfrac yx$ is constant and the two quantities grow together. The graph of an inverse variation is the reciprocal function stretched by $k$; in real situations usually only the first-quadrant branch matters.

To solve a variation problem, use one known pair to find $k$, then use $k$ to answer the question. For instance, if $y$ varies inversely with $x$ and $y = 8$ when $x = 3$, then $k = 24$, and when $x = 12$, $y = \tfrac{24}{12} = 2$.

### Example 4

The time a trip takes varies inversely with your average speed. At 60 mph a trip takes 3 hours. How long does it take at 45 mph? At 72 mph?

1. $t = \dfrac{k}{r}$ and $k = rt = 60 \cdot 3 = 180$ (the distance in miles).
2. At 45 mph: $t = \tfrac{180}{45} = 4$ hours.
3. At 72 mph: $t = \tfrac{180}{72} = 2.5$ hours.

## Common mistakes

- Calling every zero of the denominator a vertical asymptote. Factor and cancel first; a cancelled factor gives a hole.
- Finding the hole's height from the original expression (which gives $\tfrac00$) instead of the simplified one.
- Using the ratio of leading coefficients when the degrees are different.
- Listing a zero of the numerator as an $x$-intercept when it is also an excluded value.
- Thinking a graph can never touch its horizontal asymptote. It can cross it; it just levels off toward it at the far ends.
- Writing inverse variation as $y = k - x$ or $y = \tfrac xk$. Inverse variation means the product $xy$ is constant.

## Key points

- Domain: exclude the zeros of the denominator.
- Factor and cancel: cancelled factors give holes (height from the simplified form); remaining denominator zeros give vertical asymptotes.
- Horizontal asymptote by degrees: top smaller, $y = 0$; equal, ratio of leading coefficients; top larger, none.
- $x$-intercepts come from the simplified numerator; the $y$-intercept is $f(0)$.
- $y = \dfrac{a}{x - h} + k$ is the reciprocal function with asymptotes $x = h$ and $y = k$.
- Inverse variation: $y = \dfrac kx$, with $k = xy$.
