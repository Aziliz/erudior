---
id: calc-continuity
module: calc-m1
title: Continuity and the Intermediate Value Theorem
minutes: 30
topics: [Continuity, Intermediate Value Theorem]
drills: [calc-d-continuity-k, calc-d-ivt-bisect]
refs: [calc-ref-limits]
---
## Why continuity matters

Informally, a continuous function is one whose graph you can draw without lifting your pencil. That picture is fine, but calculus needs a definition you can check with algebra, because the big theorems (the Intermediate Value Theorem here, the Extreme Value Theorem and Mean Value Theorem later) only hold for continuous functions. Limits from the last four lessons give that definition.

## Definition

A function $f$ is **continuous** at $x = a$ if

$$\lim_{x\to a} f(x) = f(a).$$

Unpacked, that's three conditions, and all three must hold:

1. $f(a)$ is defined;
2. $\lim_{x\to a} f(x)$ exists;
3. the two are equal.

If any condition fails, $f$ has a **discontinuity** at $a$. A function is continuous on an interval if it's continuous at every point of the interval (using one-sided limits at closed endpoints).

The definition says exactly that "you can find the limit by plugging in." That's why direct substitution worked in Lesson 2: polynomials, rational functions, roots, exponentials, logarithms, and trig and inverse trig functions are **continuous on their domains**. Sums, products, quotients (where the denominator isn't 0) and compositions of continuous functions are continuous too.

## Kinds of discontinuity

| Type | What fails | Picture | Example at $x = 1$ |
|---|---|---|---|
| **Removable discontinuity** | Limit exists but $f(a)$ is missing or different | hole | $\dfrac{x^2 - 1}{x - 1}$ |
| **Jump discontinuity** | One-sided limits exist but differ | step | $\begin{cases} x, & x < 1\\ x + 2, & x \ge 1\end{cases}$ |
| **Infinite discontinuity** | A one-sided limit is $\pm\infty$ | vertical asymptote | $\dfrac{1}{x - 1}$ |

"Removable" means you could fix it by defining or redefining one value: setting $f(1) = 2$ makes $\frac{x^2-1}{x-1}$ continuous at 1. Jumps and asymptotes can't be fixed that way. (A fourth, rarer kind is oscillating, like $\sin(1/x)$ at 0.)

```plot
{"x": [-2, 4], "y": [-2, 6], "functions": [{"f": "x", "to": 1}, {"f": "x + 2", "from": 1}], "points": [{"at": [1, 1], "open": true}, {"at": [1, 3]}], "caption": "A jump discontinuity at x = 1"}
```

## Making a piecewise function continuous

A piecewise function is continuous at a break point when the pieces meet there: the left-hand limit, the right-hand limit and the function value all agree.

### Example 1

Find $k$ so that
$$f(x) = \begin{cases} kx^2 - 1, & x < 2\\ 3x + k, & x \ge 2\end{cases}$$
is continuous everywhere.

Each piece is a polynomial, so the only risk is $x = 2$.

- Left limit: $k(2)^2 - 1 = 4k - 1$.
- Right limit and $f(2)$: $3(2) + k = 6 + k$.

Set them equal: $4k - 1 = 6 + k$, so $3k = 7$ and $k = \mathbf{\tfrac73}$.

### Example 2

Classify the discontinuities of $g(x) = \dfrac{x^2 - 4}{x^2 - 5x + 6}$.

Factor: $g(x) = \dfrac{(x - 2)(x + 2)}{(x - 2)(x - 3)}$. The function is undefined at $x = 2$ and $x = 3$.

- At $x = 2$ the factor cancels: $g(x) = \dfrac{x + 2}{x - 3}$ for $x \ne 2$, so $\lim_{x\to2} g(x) = \frac{4}{-1} = -4$. Limit exists, value doesn't: **removable** (a hole at $(2, -4)$).
- At $x = 3$ the denominator is still zero after canceling and the top is $5 \ne 0$: **infinite** discontinuity (vertical asymptote).

## The Intermediate Value Theorem

**Intermediate Value Theorem** (IVT): if $f$ is continuous on the closed interval $[a, b]$ and $N$ is any number between $f(a)$ and $f(b)$, then there is at least one $c$ in $(a, b)$ with $f(c) = N$.

The picture: a continuous graph that starts at height $f(a)$ and ends at height $f(b)$ must cross every height in between. Without continuity it could jump over $N$.

The IVT promises a $c$ exists; it doesn't say where, or how many there are. Its most common use is locating roots: if $f(a)$ and $f(b)$ have opposite signs, then 0 is between them, so $f$ has a zero in $(a, b)$.

### Example 3

Show that $x^3 + x - 3 = 0$ has a solution between 1 and 2, then narrow it down to an interval of length 0.25.

Let $f(x) = x^3 + x - 3$, a polynomial, so continuous on $[1, 2]$.

- $f(1) = 1 + 1 - 3 = -1 < 0$
- $f(2) = 8 + 2 - 3 = 7 > 0$

Zero lies between $-1$ and $7$, so by the IVT there's a root $c$ in $(1, 2)$.

To narrow it down, use the **bisection method**: test the midpoint and keep the half where the sign changes.

- $f(1.5) = 3.375 + 1.5 - 3 = 1.875 > 0$. Sign change is on $[1, 1.5]$.
- $f(1.25) = 1.953125 + 1.25 - 3 = 0.203 > 0$. Sign change on $[1, 1.25]$.

The root is in $(1, 1.25)$. (It's about 1.2134.)

```plot
{"x": [0, 2.2], "y": [-4, 8], "functions": [{"f": "x^3 + x - 3"}], "points": [{"at": [1, -1], "label": "(1, −1)"}, {"at": [2, 7], "label": "(2, 7)"}, {"at": [1.2134, 0], "label": "root"}], "caption": "The sign change from f(1) < 0 to f(2) > 0 forces a root between"}
```

### Example 4 (a word problem)

At 6 a.m. the temperature was 41°F; at 2 p.m. it was 68°F. Must the temperature have been exactly 55°F at some moment in between?

Temperature varies continuously with time, and 55 is between 41 and 68, so yes, by the IVT. The theorem doesn't say *when*, and it might have happened more than once.

## Where the IVT can fail

- *Not continuous:* $f(x) = 1/x$ on $[-1, 1]$ has $f(-1) = -1$ and $f(1) = 1$ but never equals 0. The asymptote at 0 breaks the hypothesis.
- *Wrong interval:* IVT on $[a, b]$ needs continuity on all of $[a, b]$, not just at the endpoints.
- *Converse is false:* a function can take every intermediate value without being continuous. The IVT only runs one way.

## Common mistakes

- **Checking only that $f(a)$ exists.** Continuity needs all three conditions; a defined value with a mismatched limit is still discontinuous.
- *Calling a canceled factor an asymptote.* Factor and cancel first; canceled zeros are removable.
- *Applying the IVT without stating continuity.* On a free-response exam the justification must say "$f$ is continuous on $[a,b]$."
- *Thinking IVT gives the number of roots.* It gives *at least one*.
- *Setting the wrong pieces equal.* At a break point, compare the left piece's limit to the right piece's limit, both evaluated at the break point.

## Key points

- Continuous at $a$: $f(a)$ defined, $\lim_{x\to a} f(x)$ exists, and they're equal.
- Discontinuities: removable (hole), jump, infinite (asymptote).
- Elementary functions are continuous on their domains.
- IVT: continuous on $[a, b]$ ⇒ every value between $f(a)$ and $f(b)$ is hit.
- Opposite signs at the endpoints of a continuous function ⇒ a root in between; bisection narrows it down.
