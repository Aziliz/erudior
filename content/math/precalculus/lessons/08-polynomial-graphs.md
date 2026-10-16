---
id: pc-polynomial-graphs
module: pc-m3
title: Polynomial functions and their graphs
minutes: 30
topics: [Polynomial graphs]
drills: [pc-poly-leading, pc-poly-yint]
refs: [pc-ref-functions]
---
## Beyond the parabola

Algebra 2 gave you lines and parabolas in detail. This module studies the whole family they belong to, the polynomials, and then their quotients, the rational functions. Polynomials are the simplest functions that can model curves with several turns, and calculus uses them constantly (Taylor polynomials approximate almost everything). This lesson is about reading a polynomial's graph from its formula: where it goes at the far ends, where it meets the $x$-axis, and how it behaves there.

## Vocabulary

A **polynomial function** of degree $n$ has the form

$$f(x) = a_n x^n + a_{n-1}x^{n-1} + \dots + a_1 x + a_0, \qquad a_n \ne 0,$$

where $n$ is a whole number. The **degree** is $n$, the **leading term** is $a_n x^n$, and the **leading coefficient** is $a_n$. Polynomials have domain all real numbers and smooth, unbroken graphs: no holes, jumps, corners or asymptotes.

## End behavior

**End behavior** describes what $f(x)$ does as $x \to \infty$ (far right) and $x \to -\infty$ (far left). For large $|x|$ the leading term dominates all the others. For example, at $x = 100$, $2x^3 = 2{,}000{,}000$ while $-50x^2 = -500{,}000$: the cubic term wins, and it wins by more the larger $x$ gets. Factoring shows why:

$$2x^3 - 50x^2 + 7 = 2x^3\left(1 - \frac{25}{x} + \frac{7}{2x^3}\right),$$

and the bracket approaches 1 as $|x|$ grows. So the end behavior of any polynomial is the end behavior of its leading term, which depends on two things only:

| | $a_n > 0$ | $a_n < 0$ |
|---|---|---|
| $n$ even | up on both ends ($\nearrow\ \nwarrow$ like $x^2$) | down on both ends |
| $n$ odd | down on the left, up on the right (like $x^3$) | up on the left, down on the right |

We write, for instance, "as $x \to \infty$, $f(x) \to \infty$; as $x \to -\infty$, $f(x) \to -\infty$."

## Zeros and multiplicity

If $f(c) = 0$, then $c$ is a **zero** of $f$ (also called a root), and $(c, 0)$ is an $x$-intercept when $c$ is real. When a polynomial is factored, each factor $(x - c)$ gives a zero $c$. If $(x - c)$ appears exactly $k$ times, $c$ is a zero of **multiplicity** $k$.

Multiplicity controls what the graph does at the intercept:

- *Odd multiplicity*: the graph *crosses* the axis (the factor changes sign). Multiplicity 1 crosses like a line; multiplicity 3 crosses with a flattened S-shape, like $x^3$.
- *Even multiplicity*: the graph *touches* the axis and turns back (the factor $(x - c)^2$ is never negative, so the sign does not change). It looks like a parabola's vertex there.

```plot
{"x": [-3, 4], "y": [-8, 8], "functions": [{"f": "(x + 2)*(x - 1)^2*(x - 3)/2", "label": "y = ½(x + 2)(x − 1)²(x − 3)"}], "points": [{"at": [-2, 0], "label": "−2"}, {"at": [1, 0], "label": "1 (touch)"}, {"at": [3, 0], "label": "3"}], "caption": "Crosses at −2 and 3 (multiplicity 1), touches and turns at 1 (multiplicity 2)."}
```

## Turning points

A **turning point** is where the graph changes from rising to falling or the reverse (a local max or min). A polynomial of degree $n$ has *at most* $n - 1$ turning points. A cubic can have two turning points or none (like $x^3$ itself); it cannot have three. This is a useful check on a sketch, and it lets you rule out degrees from a graph: a graph with 4 turning points must have degree at least 5.

## Sketching a polynomial

1. Find the end behavior from the leading term (expand mentally: multiply the leading terms of the factors).
2. Find the zeros and their multiplicities; mark crossing or touching.
3. Find the $y$-intercept $f(0)$.
4. Connect smoothly, using the sign between zeros if needed.

### Example 1

Sketch $f(x) = -x(x - 2)^2(x + 3)$.

1. Leading term: $-x \cdot x^2 \cdot x = -x^4$. Degree 4, negative leading coefficient: down on both ends.
2. Zeros: $0$ (mult. 1, crosses), $2$ (mult. 2, touches), $-3$ (mult. 1, crosses).
3. $f(0) = 0$.
4. From the far left (going down there, so negative), the graph comes up and crosses at $-3$, is positive on $(-3, 0)$, crosses at $0$ going down, is negative on $(0, 2)$, touches at $2$ and turns back down, and stays negative to the right.

```plot
{"x": [-4, 3.5], "y": [-15, 36], "functions": [{"f": "-x*(x - 2)^2*(x + 3)", "label": "y = −x(x − 2)²(x + 3)"}], "points": [{"at": [-3, 0]}, {"at": [0, 0]}, {"at": [2, 0]}], "caption": "Degree 4, leading coefficient −1: both ends down; it touches at x = 2."}
```

Check a point: $f(-1) = -(-1)(9)(2) = 18 > 0$. ✓ The graph has 3 turning points, the most allowed for degree 4.

## The intermediate value theorem

Because a polynomial's graph has no breaks, it cannot get from below the axis to above it without crossing. The **intermediate value theorem** (IVT) states: if $f$ is a polynomial (or any continuous function) and $f(a)$ and $f(b)$ have opposite signs, then $f$ has at least one zero between $a$ and $b$.

### Example 2

Show that $g(x) = x^3 - 4x + 1$ has a zero between 1 and 2, and narrow it to an interval of width $0.5$.

$g(1) = 1 - 4 + 1 = -2 < 0$ and $g(2) = 8 - 8 + 1 = 1 > 0$. Opposite signs, so by the IVT a zero lies in $(1, 2)$. Try the midpoint: $g(1.5) = 3.375 - 6 + 1 = -1.625 < 0$. The sign change is now between 1.5 and 2, so the zero is in $(1.5, 2)$. (It is about 1.86.) Repeating this halving is the bisection method that calculators use.

## Building a polynomial from its zeros

Zeros give the factors; one more point fixes the leading coefficient.

### Example 3

Find the cubic with zeros $-1$, $2$ and $4$ that passes through $(0, 16)$.

$f(x) = a(x + 1)(x - 2)(x - 4)$. At $x = 0$: $a(1)(-2)(-4) = 8a = 16$, so $a = 2$:

$$f(x) = 2(x + 1)(x - 2)(x - 4).$$

## Common mistakes

- *Using a term other than the leading term for end behavior.* Multiply the leading parts of every factor, including signs.
- *Ignoring multiplicity.* $(x - 3)^2$ touches at 3; it does not cross.
- *Too many turning points.* Degree $n$ allows at most $n - 1$.
- *Misreading the IVT.* Same signs at $a$ and $b$ do *not* prove there's no zero between them (there could be two).
- *Forgetting the leading coefficient* when building from zeros: $(x+1)(x-2)(x-4)$ alone has $y$-intercept 8, not 16.

## Key points

- End behavior follows the leading term: even degree means both ends match; odd degree means they are opposite; a negative leading coefficient flips the picture.
- A factor $(x - c)^k$ gives a zero $c$ of multiplicity $k$: odd crosses, even touches.
- Degree $n$ means at most $n$ real zeros and at most $n - 1$ turning points.
- IVT: a sign change between $a$ and $b$ guarantees a zero in between.
- Zeros plus one point determine a polynomial of known degree.
