---
id: alg-quad-factoring
module: alg-m6
title: Solving quadratic equations by factoring
minutes: 25
topics: [Quadratic equations]
drills: [alg-d-factor-monic, alg-d-zero-product, alg-d-quad-factor-solve]
refs: [alg-ref-polynomials]
---
A linear equation has the variable only to the first power. A quadratic equation has a squared term, and that changes everything: it can have two solutions, and the balancing steps of Lesson 3 no longer isolate the variable. This lesson introduces the most direct method, which puts the factoring of Module 5 to work. The next two lessons develop methods that work even when factoring fails.

## Quadratic equations

A **quadratic equation** is one that can be written in the **standard form**

$$ax^2 + bx + c = 0, \qquad a \ne 0.$$

The condition $a \ne 0$ is what makes it quadratic; without the $x^2$ term it would be linear. Solutions of a quadratic equation are also called its **roots**.

## The zero product property

The key fact is about multiplication by zero:

> **Zero product property**: if $AB = 0$, then $A = 0$ or $B = 0$ (or both).

Why? If $A \ne 0$, we can divide both sides of $AB = 0$ by $A$ to get $B = 0$. So at least one factor must be zero.

This only works with 0 on one side. If $AB = 6$, nothing forces either factor to be any particular number: $A = 2, B = 3$ works, so does $A = 12, B = \tfrac12$, and so on.

## The method

1. Write the equation in standard form, with 0 on one side.
2. Factor the nonzero side completely.
3. Set each factor equal to zero (the zero product property).
4. Solve each resulting equation.
5. Check in the original equation.

### Example 1

Solve $x^2 + 2x = 15$.

1. Standard form: $x^2 + 2x - 15 = 0$.
2. Factor: product $-15$, sum $2$: $(x + 5)(x - 3) = 0$.
3. $x + 5 = 0$ or $x - 3 = 0$.
4. $x = -5$ or $x = 3$.
5. Check: $25 - 10 = 15$ and $9 + 6 = 15$.

Notice the signs: the factor $(x + 5)$ gives the root $-5$. Each factor $x - r$ corresponds to a root $r$.

### Example 2

Solve $6x^2 = 7x + 3$.

1. Standard form: $6x^2 - 7x - 3 = 0$.
2. ac method: $ac = -18$, sum $-7$: $-9$ and $2$. So $6x^2 - 9x + 2x - 3 = 3x(2x - 3) + 1(2x - 3) = (2x - 3)(3x + 1)$.
3. $2x - 3 = 0$ or $3x + 1 = 0$.
4. $x = \tfrac32$ or $x = -\tfrac13$.

### Example 3

Solve $4x^2 = 12x$.

1. Standard form: $4x^2 - 12x = 0$.
2. GCF: $4x(x - 3) = 0$.
3. $4x = 0$ or $x - 3 = 0$, so $x = 0$ or $x = 3$.

A tempting shortcut is to divide both sides by $x$, giving $4x = 12$ and $x = 3$. That loses the solution $x = 0$: dividing by $x$ assumes $x \ne 0$. Never divide an equation by an expression that could be zero; factor instead.

### Example 4

Solve $x^2 - 10x + 25 = 0$.

The left side is a perfect square: $(x - 5)^2 = 0$. Both factors give $x = 5$. This is a single solution that appears twice, called a **double root** (a root of multiplicity 2).

## Seeing the roots on a graph

The solutions of $ax^2 + bx + c = 0$ are the $x$-intercepts of the graph of $y = ax^2 + bx + c$, because those are the points where $y = 0$. The graph of a quadratic is a U-shaped curve called a parabola (Lesson 25 studies it in detail).

```plot
{"x": [-7, 7], "y": [-18, 8], "functions": [{"f": "x^2 + 2*x - 15", "label": "y = x² + 2x - 15", "from": -7, "to": 5}, {"f": "x^2 - 10*x + 25", "dashed": true, "label": "y = (x - 5)²", "from": 1, "to": 8}], "points": [{"at": [-5, 0], "label": "-5"}, {"at": [3, 0], "label": "3"}, {"at": [5, 0], "label": "5 (double)"}], "caption": "Two roots where the parabola crosses the axis; a double root where it just touches"}
```

The solid parabola from Example 1 crosses the $x$-axis at $-5$ and 3. The dashed one from Example 4 touches the axis at 5 without crossing, the picture of a double root. A parabola that stays entirely above or below the axis has no real roots; you'll see how to detect that in Lesson 24.

## Writing an equation from its roots

Running the method backward builds an equation with given solutions. If the roots are $r$ and $s$, then $(x - r)(x - s) = 0$ has exactly those roots.

### Example 5

Write a quadratic equation with integer coefficients whose solutions are $-2$ and $\tfrac34$.

1. Factors: $(x + 2)$ and $(x - \tfrac34)$. To avoid the fraction, use $4x - 3$ instead of $x - \tfrac34$ (it has the same root).
2. $(x + 2)(4x - 3) = 0$, which expands to $4x^2 + 5x - 6 = 0$.

## An application

### Example 6

A rectangular garden is 3 m longer than it is wide, and its area is 70 m². Find its dimensions.

1. Width $w$, length $w + 3$: $w(w + 3) = 70$.
2. Standard form: $w^2 + 3w - 70 = 0$.
3. Factor: $(w + 10)(w - 7) = 0$, so $w = -10$ or $w = 7$.
4. A width can't be negative, so $w = 7$ m and the length is 10 m.

Applications often produce a root that makes no sense in context. Check each root against the situation, and say why you reject one.

## Common mistakes

- Setting factors equal to the nonzero number: $(x - 2)(x + 1) = 4$ does not mean $x - 2 = 4$ or $x + 1 = 4$. Move everything to one side first.
- Dividing by the variable and losing the root $x = 0$.
- Sign slips between factor and root: $(x + 5) = 0$ gives $x = -5$.
- Forgetting a constant factor's role: in $4x(x - 3) = 0$, the factor 4 is never zero, but $x$ can be.
- Keeping a root that doesn't make sense in an application.

## Key points

- A quadratic equation has standard form $ax^2 + bx + c = 0$ with $a \ne 0$.
- Zero product property: if $AB = 0$, then $A = 0$ or $B = 0$. It requires 0 on one side.
- Method: standard form, factor, set each factor to zero, solve, check.
- The real solutions are the $x$-intercepts of $y = ax^2 + bx + c$; a double root is where the graph touches the axis.
- Roots $r$ and $s$ come from the equation $(x - r)(x - s) = 0$.
