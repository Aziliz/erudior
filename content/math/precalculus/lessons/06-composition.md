---
id: pc-composition
module: pc-m2
title: Combining functions and composition
minutes: 25
topics: [Combining functions, Composition]
drills: [pc-compose-eval, pc-compose-expr]
refs: [pc-ref-functions]
---
## Building new functions from old ones

Transformations changed one function. Now we combine two. Real models are built this way: profit is revenue minus cost; the area of a spreading oil spill depends on its radius, which depends on time. The second kind of combination, feeding one function's output into another, is called composition, and it is the idea behind the chain rule in calculus and behind inverse functions in the next lesson.

## Arithmetic combinations

Given functions $f$ and $g$, define new functions pointwise:

| Combination | Rule | Domain |
|---|---|---|
| Sum | $(f + g)(x) = f(x) + g(x)$ | in both domains |
| Difference | $(f - g)(x) = f(x) - g(x)$ | in both domains |
| Product | $(fg)(x) = f(x)\,g(x)$ | in both domains |
| Quotient | $\left(\dfrac fg\right)(x) = \dfrac{f(x)}{g(x)}$ | in both domains, and $g(x) \ne 0$ |

The domain rule makes sense: to compute $f(x) + g(x)$ you need both values to exist.

### Example 1

Let $f(x) = \sqrt{x}$ and $g(x) = x - 4$. Find $\left(\frac fg\right)(x)$ and its domain.

$\left(\frac fg\right)(x) = \dfrac{\sqrt x}{x - 4}$. The domain of $f$ is $[0, \infty)$; the domain of $g$ is all reals; and we need $g(x) \ne 0$, so $x \ne 4$. Domain: $[0, 4) \cup (4, \infty)$.

## Composition

The **composition** of $f$ with $g$ is

$$(f \circ g)(x) = f\big(g(x)\big).$$

Read it from the inside out: first apply $g$, then apply $f$ to the result. The small circle is not multiplication. You can think of an assembly line: $x$ enters machine $g$, and whatever comes out is fed into machine $f$.

Order matters. In general $f(g(x)) \ne g(f(x))$.

### Example 2

Let $f(x) = x^2 + 1$ and $g(x) = 3x - 2$. Find $(f \circ g)(x)$, $(g \circ f)(x)$ and $(f \circ g)(2)$.

- $(f \circ g)(x) = f(3x - 2) = (3x - 2)^2 + 1 = 9x^2 - 12x + 5$.
- $(g \circ f)(x) = g(x^2 + 1) = 3(x^2 + 1) - 2 = 3x^2 + 1$.
- $(f \circ g)(2)$: first $g(2) = 4$, then $f(4) = 17$. (Check with the formula: $36 - 24 + 5 = 17$.)

The two compositions are different functions, confirming that order matters.

## Evaluating compositions from tables and graphs

You don't need formulas. To find $f(g(3))$ from a table, look up $g(3)$, then look up $f$ of that.

| $x$ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| $f(x)$ | 4 | 3 | 1 | 2 |
| $g(x)$ | 2 | 4 | 4 | 1 |

$f(g(3)) = f(4) = 2$ and $g(f(3)) = g(1) = 2$. And $f(f(1)) = f(4) = 2$.

## The domain of a composition

For $f(g(x))$ to make sense, two things must happen: $x$ must be in the domain of $g$, and the output $g(x)$ must be in the domain of $f$. Simplifying the formula first can hide a restriction, so find the domain from the pieces.

### Example 3

Let $f(x) = \dfrac{1}{x - 2}$ and $g(x) = \sqrt{x}$. Find the domain of $f \circ g$.

1. $g$ needs $x \ge 0$.
2. $f$ needs its input $\ne 2$, so $g(x) = \sqrt x \ne 2$, which means $x \ne 4$.

Domain of $f \circ g$: $[0, 4) \cup (4, \infty)$. The formula $f(g(x)) = \dfrac{1}{\sqrt x - 2}$ shows both restrictions.

### Example 4

Let $f(x) = x^2$ and $g(x) = \sqrt{x}$. Then $f(g(x)) = (\sqrt x)^2 = x$, which looks defined everywhere. But $g$ only accepts $x \ge 0$, so the domain of $f \circ g$ is $[0, \infty)$. On the other hand $g(f(x)) = \sqrt{x^2} = |x|$ is defined for all $x$. This is a classic trap: $\sqrt{x^2}$ is $|x|$, not $x$.

## Decomposing a function

Calculus often needs the reverse: write a complicated function as a composition of simpler ones. For $H(x) = (5x + 1)^7$, the "inner" step is $5x + 1$ and the "outer" step is raising to the 7th power. So $H = f \circ g$ with

$$g(x) = 5x + 1, \qquad f(x) = x^7.$$

Decompositions are not unique ($g(x) = 5x$, $f(x) = (x + 1)^7$ also works), but the natural choice puts the innermost operation in $g$.

### Example 5

Write $K(x) = \dfrac{3}{\sqrt{x} + 2}$ as $f(g(x))$.

The first thing done to $x$ is the square root, but the obvious "chunk" is $\sqrt x + 2$. Take $g(x) = \sqrt{x} + 2$ and $f(x) = \dfrac3x$. Check: $f(g(x)) = \dfrac{3}{\sqrt x + 2}$. ✓

## Common mistakes

- *Reading $f \circ g$ as multiplication.* $(f \circ g)(x) = f(g(x))$, not $f(x)g(x)$.
- *Applying the functions in the wrong order.* The function written next to $x$ acts first.
- *Simplifying before finding the domain.* The domain of $f \circ g$ requires $x$ in the domain of $g$, even if the simplified formula looks friendlier.
- *Writing $\sqrt{x^2} = x$.* It is $|x|$.
- *Forgetting $g(x) \ne 0$ for a quotient.*

## Key points

- $f + g$, $f - g$, $fg$ live where both functions are defined; $f/g$ also needs $g(x) \ne 0$.
- $(f \circ g)(x) = f(g(x))$: apply $g$ first, then $f$. Order matters.
- Domain of $f \circ g$: $x$ in the domain of $g$ and $g(x)$ in the domain of $f$.
- With tables or graphs, compose by looking up the inner value, then the outer.
- Decompose by spotting the inner chunk $g$ and the outer operation $f$.
