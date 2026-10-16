---
id: la-vector-spaces
module: la-m7
title: Vector spaces and subspaces
minutes: 35
topics: [Vector spaces, Subspaces]
drills: [la-lincomb, la-poly-comb]
refs: [la-ref-row]
---
## Beyond arrows

Everything so far has happened in $\mathbb{R}^n$. But many other mathematical objects can be
added and scaled with the same rules: polynomials, matrices, functions, signals, solutions of
differential equations. The idea of this module is to name the rules once, call anything
that obeys them a *vector space*, and then reuse every concept we've built (linear
combinations, span, independence, bases) in all those settings at once. We'll also study
the *subspaces* of $\mathbb{R}^n$ that come from a matrix, which is where most computations
live.

## The definition

A **vector space** is a nonempty set $V$ of objects, called vectors, with two operations,
addition and multiplication by real scalars, that satisfy these **axioms** for all
$\mathbf{u}, \mathbf{v}, \mathbf{w}$ in $V$ and scalars $c, d$:

1. $\mathbf{u} + \mathbf{v}$ is in $V$ (closed under addition).
2. $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$.
3. $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$.
4. There is a zero vector $\mathbf{0}$ in $V$ with $\mathbf{u} + \mathbf{0} = \mathbf{u}$.
5. Each $\mathbf{u}$ has a negative $-\mathbf{u}$ in $V$ with $\mathbf{u} + (-\mathbf{u}) = \mathbf{0}$.
6. $c\mathbf{u}$ is in $V$ (closed under scalar multiplication).
7. $c(\mathbf{u} + \mathbf{v}) = c\mathbf{u} + c\mathbf{v}$.
8. $(c + d)\mathbf{u} = c\mathbf{u} + d\mathbf{u}$.
9. $c(d\mathbf{u}) = (cd)\mathbf{u}$.
10. $1\mathbf{u} = \mathbf{u}$.

These are exactly the properties of $\mathbb{R}^n$ listed in Module 3. From them one can
prove other familiar facts, such as $0\mathbf{u} = \mathbf{0}$ and $(-1)\mathbf{u} = -\mathbf{u}$.

### Standard examples

- $\mathbb{R}^n$ for each $n \ge 1$.
- $\mathbb{P}_n$: the polynomials of degree at most $n$, $p(t) = a_0 + a_1t + \cdots + a_nt^n$, added and scaled coefficient by coefficient. The zero vector is the zero polynomial. (Degree *exactly* $n$ wouldn't work: $t^2 + (-t^2 + t)$ has degree 1.)
- $M_{m \times n}$: all $m \times n$ matrices, with matrix addition and scalar multiplication.
- The set of all real-valued functions on an interval, added and scaled pointwise: $(f + g)(t) = f(t) + g(t)$.

In $\mathbb{P}_2$, the "vector" $3 - t + 2t^2$ behaves just like $(3, -1, 2)$ in
$\mathbb{R}^3$. That resemblance will be made precise in the coordinates lesson.

## Subspaces

Most vector spaces we meet sit inside a bigger one. A **subspace** of a vector space $V$ is a
subset $H$ of $V$ with three properties:

1. The zero vector of $V$ is in $H$.
2. $H$ is closed under addition: if $\mathbf{u}, \mathbf{v}$ are in $H$, so is $\mathbf{u} + \mathbf{v}$.
3. $H$ is closed under scalar multiplication: if $\mathbf{u}$ is in $H$ and $c$ is a scalar, $c\mathbf{u}$ is in $H$.

A subspace is a vector space in its own right; the other axioms are inherited from $V$. Every
vector space has two trivial subspaces: $V$ itself and the **zero subspace** $\{\mathbf{0}\}$.
The subspaces of $\mathbb{R}^3$ are exactly: $\{\mathbf{0}\}$, lines through the origin, planes
through the origin, and $\mathbb{R}^3$.

The most important source of subspaces:

> *Theorem.* If $\mathbf{v}_1, \dots, \mathbf{v}_p$ are in a vector space $V$, then $\operatorname{Span}\{\mathbf{v}_1, \dots, \mathbf{v}_p\}$ is a subspace of $V$.

Proof sketch: $\mathbf{0} = 0\mathbf{v}_1 + \cdots + 0\mathbf{v}_p$; the sum of two
combinations is a combination (add the weights); a multiple of a combination is a combination
(scale the weights). We call $\operatorname{Span}\{\mathbf{v}_1, \dots, \mathbf{v}_p\}$ the
subspace *spanned* (or generated) by those vectors, and the vectors a **spanning set** for it.

### Example 1

Is $H = \{(a, b, 0) : a, b \text{ real}\}$ a subspace of $\mathbb{R}^3$? Yes: $(0, 0, 0)$ is
in $H$ (take $a = b = 0$); $(a, b, 0) + (c, d, 0) = (a + c, b + d, 0)$ is in $H$; and
$k(a, b, 0) = (ka, kb, 0)$ is in $H$. In fact $H = \operatorname{Span}\{\mathbf{e}_1, \mathbf{e}_2\}$,
the $x_1x_2$-plane.

### Example 2

Is the line $L = \{(x, y) : y = 2x + 1\}$ a subspace of $\mathbb{R}^2$? No: $(0, 0)$ is not on
it, since $0 \ne 2(0) + 1$. (It also fails closure: $(0, 1)$ and $(1, 3)$ are on $L$ but their
sum $(1, 4)$ is not.) Lines and planes that miss the origin are never subspaces.

### Example 3

Show that $H = \{(a - 3b,\ b - a,\ a,\ b) : a, b \text{ real}\}$ is a subspace of $\mathbb{R}^4$.

1. Split by parameter: $(a - 3b, b - a, a, b) = a(1, -1, 1, 0) + b(-3, 1, 0, 1)$.
2. So $H = \operatorname{Span}\{(1, -1, 1, 0), (-3, 1, 0, 1)\}$.
3. By the theorem, a span is a subspace. Done, with no axioms to check one by one.

Writing a set as a span is usually the fastest proof that it's a subspace.

### Example 4

Is $H = \{p \in \mathbb{P}_2 : p(1) = 0\}$ a subspace of $\mathbb{P}_2$? The zero polynomial
satisfies $0(1) = 0$. If $p(1) = q(1) = 0$ then $(p + q)(1) = 0 + 0 = 0$ and
$(cp)(1) = c \cdot 0 = 0$. So yes. By contrast, $\{p : p(1) = 5\}$ is not a subspace, because
it doesn't contain the zero polynomial.

## Common mistakes

- *Checking only that $\mathbf{0}$ is in the set.* Containing $\mathbf{0}$ is necessary, not sufficient: the union of the two axes in $\mathbb{R}^2$ contains $\mathbf{0}$ but $(1, 0) + (0, 1)$ is not in it.
- *Testing closure with one example.* Closure must hold for *all* vectors and scalars; a single example can only disprove it.
- *Forgetting negative scalars.* The first quadrant $\{(x, y) : x, y \ge 0\}$ is closed under addition but not under multiplication by $-1$.
- *Calling $\mathbb{R}^2$ a subspace of $\mathbb{R}^3$.* Vectors in $\mathbb{R}^2$ have two entries, so $\mathbb{R}^2$ isn't even a subset of $\mathbb{R}^3$; the plane $\{(a, b, 0)\}$ is the subspace that looks like it.

## Key points

- A vector space is a set with addition and scalar multiplication obeying ten axioms; $\mathbb{R}^n$, $\mathbb{P}_n$, $M_{m \times n}$ and function spaces are examples.
- A subspace contains $\mathbf{0}$ and is closed under addition and scalar multiplication.
- Every span is a subspace; writing a set as a span proves it's a subspace.
- Subspaces of $\mathbb{R}^3$: $\{\mathbf{0}\}$, lines and planes through the origin, and $\mathbb{R}^3$.
