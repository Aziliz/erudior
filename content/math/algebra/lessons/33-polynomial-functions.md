---
id: alg-poly-functions
module: alg-m8
title: "Polynomial functions: end behavior, zeros, and multiplicity"
minutes: 35
topics: [Polynomial functions]
drills: [alg-d-poly-zeros-graph, alg-d-poly-from-zeros]
refs: [alg-ref-functions]
---
Lines and parabolas are the graphs of polynomial functions of degree 1 and 2. This module studies polynomial functions of any degree. Their graphs are smooth, unbroken curves, and a handful of features tell you their shape: how the ends behave, where the graph crosses or touches the $x$-axis, and how many turns it makes. This lesson shows how to read all of that from the equation, especially from its factored form.

## Polynomial functions

A **polynomial function** has the form

$$f(x) = a_nx^n + a_{n-1}x^{n-1} + \cdots + a_1x + a_0,$$

with whole-number exponents and $a_n \ne 0$. Its degree is $n$ and $a_n$ is its leading coefficient (Lesson 19). The graph of every polynomial function is **continuous** (no breaks or holes) and **smooth** (no sharp corners).

## End behavior

**End behavior** describes what $f(x)$ does as $x$ goes far to the right ($x \to \infty$) or far to the left ($x \to -\infty$). For large $|x|$, the leading term $a_nx^n$ dominates all the others. (For $f(x) = x^3 - 100x$, at $x = 1000$ the $x^3$ term is a billion while $100x$ is only a hundred thousand.) So a polynomial's ends behave like its leading term's ends, which depend only on whether the degree is even or odd and on the sign of the leading coefficient.

| | Leading coefficient $> 0$ | Leading coefficient $< 0$ |
|---|---|---|
| Even degree | up on both ends (like $x^2$) | down on both ends (like $-x^2$) |
| Odd degree | down on the left, up on the right (like $x^3$) | up on the left, down on the right (like $-x^3$) |

In arrow notation, "up on the right" is written: as $x \to \infty$, $f(x) \to \infty$.

```plot
{"x": [-3, 3], "y": [-8, 8], "functions": [{"f": "x^4 - 3*x^2", "label": "x⁴ - 3x²", "from": -2.3, "to": 2.3}, {"f": "x^3 - 3*x", "label": "x³ - 3x", "dashed": true, "from": -2.6, "to": 2.3}], "caption": "Even degree, positive lead: both ends up. Odd degree, positive lead: left down, right up"}
```

### Example 1

Describe the end behavior of $f(x) = -2x^5 + 7x^2 - 1$ and $g(x) = 3x^4 - x^3 + 8$.

1. $f$: degree 5 (odd), leading coefficient $-2$ (negative). As $x \to -\infty$, $f(x) \to \infty$; as $x \to \infty$, $f(x) \to -\infty$. Up on the left, down on the right.
2. $g$: degree 4 (even), leading coefficient 3 (positive). Both ends go up.

## Zeros and factors

A **zero** of $f$ is a number $c$ with $f(c) = 0$. For real $c$, it's an $x$-intercept of the graph. Zeros and factors are linked: $c$ is a zero exactly when $(x - c)$ is a factor (this is the Factor Theorem of Lesson 34). So when a polynomial is factored, its zeros can be read off directly.

## Multiplicity

If $(x - c)$ appears exactly $k$ times as a factor, $c$ is a zero of **multiplicity** $k$. Multiplicity controls how the graph behaves at the intercept:

- odd multiplicity (1, 3, …): the graph crosses the $x$-axis. With multiplicity 1 it crosses roughly like a line; with 3 it flattens out as it crosses, like $x^3$.
- even multiplicity (2, 4, …): the graph touches the axis and turns back, like $x^2$ at the origin.

Why? Near $x = c$, the other factors are close to some fixed nonzero number, so $f(x)$ behaves like a constant times $(x - c)^k$. When $k$ is even, $(x - c)^k$ doesn't change sign; when $k$ is odd, it does.

### Example 2

Describe the zeros of $f(x) = (x + 2)(x - 1)^2(x - 3)$ and sketch the graph.

1. Zeros: $-2$ (multiplicity 1, crosses), $1$ (multiplicity 2, touches), $3$ (multiplicity 1, crosses).
2. Degree $1 + 2 + 1 = 4$; leading coefficient $1 > 0$: both ends up.
3. $y$-intercept: $f(0) = (2)(1)(-3) = -6$.
4. Sketch from the left: coming down from above, cross at $-2$, go below the axis through $(0, -6)$, come up to touch the axis at 1, go back down, then cross at 3 and rise.

```plot
{"x": [-3, 4], "y": [-10, 8], "functions": [{"f": "(x + 2)*(x - 1)^2*(x - 3)", "label": "f(x) = (x + 2)(x - 1)²(x - 3)", "from": -2.6, "to": 3.6}], "points": [{"at": [-2, 0], "label": "-2"}, {"at": [1, 0], "label": "1 (touch)"}, {"at": [3, 0], "label": "3"}, {"at": [0, -6], "label": "(0, -6)"}], "caption": "Crossing at the odd-multiplicity zeros, touching at the double zero"}
```

The signs between zeros can be checked with test values: $f(2) = (4)(1)(-1) = -4 < 0$, consistent with the graph dipping below the axis between 1 and 3.

## Turning points

A **turning point** is where the graph changes from rising to falling or vice versa (a local maximum or minimum). A polynomial of degree $n$ has at most $n - 1$ turning points, and at most $n$ real zeros. The quartic above has 3 turning points, the maximum possible for degree 4.

These limits work in reverse too: a graph with 4 turning points must have degree at least 5.

## Writing a polynomial from its zeros

### Example 3

Write a cubic polynomial with zeros $-1$, $2$ and $4$ whose graph passes through $(0, 16)$.

1. Factors: $f(x) = a(x + 1)(x - 2)(x - 4)$.
2. Use the point: $f(0) = a(1)(-2)(-4) = 8a = 16$, so $a = 2$.
3. $f(x) = 2(x + 1)(x - 2)(x - 4)$, or expanded, $2x^3 - 10x^2 + 4x + 16$.

### Example 4

What is the smallest possible degree of a polynomial whose graph touches the axis at $-3$, crosses at 0, and crosses at 5 with a flattened "S" shape?

Touch at $-3$: even multiplicity, at least 2. Cross at 0: at least 1. Flattened crossing at 5: odd multiplicity at least 3. Minimum degree $2 + 1 + 3 = 6$.

## The Intermediate Value Theorem

Because polynomial graphs are continuous, if $f(a)$ and $f(b)$ have opposite signs, the graph must cross the $x$-axis somewhere between $a$ and $b$. This is the **Intermediate Value Theorem** for polynomials. For example, $f(x) = x^3 - x - 1$ has $f(1) = -1$ and $f(2) = 5$, so it has a zero between 1 and 2 (about 1.32), even though that zero isn't a nice number.

## Common mistakes

- Judging end behavior from the first written term instead of the highest-degree term.
- Reading the zero of $(x + 2)$ as 2 instead of $-2$.
- Drawing a crossing at an even-multiplicity zero.
- Forgetting to add multiplicities to get the degree.
- Assuming a degree-$n$ polynomial always has $n$ real zeros; it has at most $n$.

## Key points

- End behavior follows the leading term: even degree, ends match; odd degree, ends go opposite ways; a negative leading coefficient flips the picture.
- $c$ is a zero exactly when $(x - c)$ is a factor.
- Odd multiplicity: the graph crosses. Even multiplicity: it touches and turns back.
- Degree $n$: at most $n$ real zeros and at most $n - 1$ turning points.
- Opposite signs of $f(a)$ and $f(b)$ guarantee a zero between $a$ and $b$.
