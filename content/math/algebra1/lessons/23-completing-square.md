---
id: alg-complete-square
module: alg-m6
title: The square root property and completing the square
minutes: 30
topics: [Quadratic equations]
drills: [alg-d-sqrt-property, alg-d-complete-square]
refs: [alg-ref-polynomials]
---
Factoring is quick when it works, but most quadratics don't factor over the integers. $x^2 + 6x - 2 = 0$ is a typical example. This lesson develops a method that always works: rewrite the equation so that a perfect square equals a number, then take square roots. The process, called completing the square, is also how the quadratic formula is derived (next lesson) and how a parabola's vertex is found (Lesson 25).

## The square root property

If $x^2 = k$, what is $x$? Both $\sqrt{k}$ and $-\sqrt{k}$ square to $k$. So:

> **Square root property**: for $k \ge 0$, $x^2 = k$ means $x = \sqrt{k}$ or $x = -\sqrt{k}$, written $x = \pm\sqrt{k}$.

If $k < 0$, there is no real solution, because no real number squares to a negative.

The property works when a whole expression is squared: $(x + 3)^2 = 7$ means $x + 3 = \pm\sqrt7$, so $x = -3 \pm \sqrt7$.

The $\pm$ is essential. Writing $\sqrt{x^2} = x$ loses the negative solution; the correct statement is $\sqrt{x^2} = |x|$.

### Example 1

Solve $2(x - 1)^2 - 3 = 15$.

1. Isolate the square: $2(x - 1)^2 = 18$, so $(x - 1)^2 = 9$.
2. Square root property: $x - 1 = \pm 3$.
3. $x = 1 + 3 = 4$ or $x = 1 - 3 = -2$.

### Example 2

Solve $(3x + 2)^2 = 20$.

1. $3x + 2 = \pm\sqrt{20} = \pm 2\sqrt5$.
2. $3x = -2 \pm 2\sqrt5$, so $x = \dfrac{-2 \pm 2\sqrt5}{3}$.
3. Approximately $x \approx 0.824$ or $x \approx -2.157$.

(Simplifying $\sqrt{20} = 2\sqrt5$ uses a radical rule that Lesson 28 develops fully: $\sqrt{20} = \sqrt{4 \cdot 5} = 2\sqrt5$.)

## Completing the square

The square root property only applies when one side is a perfect square. **Completing the square** creates one. The key observation, from Lesson 19:

$$(x + h)^2 = x^2 + 2hx + h^2.$$

In a perfect square trinomial $x^2 + bx + \square$, the coefficient $b$ equals $2h$, so $h = \tfrac{b}{2}$ and the missing constant is $h^2 = \left(\tfrac{b}{2}\right)^2$. In words: *take half of $b$ and square it*.

For example, $x^2 + 10x + \square$: half of 10 is 5, and $5^2 = 25$. Indeed $x^2 + 10x + 25 = (x + 5)^2$.

Here's the picture. Start with an $x$ by $x$ square and split the $10x$ into two $x$ by 5 strips placed along two sides. The corner that's missing to finish the big square is $5 \times 5 = 25$.

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [4, 4], [0, 4]]}, {"points": [[4, 0], [6, 0], [6, 4], [4, 4]]}, {"points": [[0, 4], [4, 4], [4, 6], [0, 6]]}, {"points": [[4, 4], [6, 4], [6, 6], [4, 6]], "fill": true}], "labels": [{"at": [2, 2], "text": "x²"}, {"at": [5, 2], "text": "5x"}, {"at": [2, 5], "text": "5x"}, {"at": [5, 5], "text": "25"}], "segments": [{"from": [0, 0], "to": [4, 0], "label": "x"}, {"from": [4, 0], "to": [6, 0], "label": "5"}], "caption": "x² + 10x is a square with a corner missing; adding 25 completes it"}
```

### Steps for $x^2 + bx + c = 0$

1. Move the constant: $x^2 + bx = -c$.
2. Add $\left(\tfrac{b}{2}\right)^2$ to both sides.
3. Write the left side as $\left(x + \tfrac{b}{2}\right)^2$.
4. Use the square root property and solve.

### Example 3

Solve $x^2 + 6x - 2 = 0$ by completing the square.

1. $x^2 + 6x = 2$.
2. Half of 6 is 3; $3^2 = 9$. Add 9 to both sides: $x^2 + 6x + 9 = 11$.
3. $(x + 3)^2 = 11$.
4. $x + 3 = \pm\sqrt{11}$, so $x = -3 \pm \sqrt{11}$ (about $0.317$ and $-6.317$).

### When the leading coefficient isn't 1

Divide every term by $a$ first, so the $x^2$ coefficient is 1.

### Example 4

Solve $2x^2 - 8x + 3 = 0$.

1. Divide by 2: $x^2 - 4x + \tfrac32 = 0$.
2. Move the constant: $x^2 - 4x = -\tfrac32$.
3. Half of $-4$ is $-2$; $(-2)^2 = 4$. Add 4: $x^2 - 4x + 4 = \tfrac52$.
4. $(x - 2)^2 = \tfrac52$, so $x - 2 = \pm\sqrt{\tfrac52}$ and $x = 2 \pm \sqrt{\tfrac52} = 2 \pm \tfrac{\sqrt{10}}{2}$.

Fractions are common when $b$ is odd. For $x^2 + 5x$, half of 5 is $\tfrac52$ and the number to add is $\tfrac{25}{4}$: $x^2 + 5x + \tfrac{25}{4} = \left(x + \tfrac52\right)^2$.

## Completing the square in an expression

You can also complete the square without an equation, to rewrite $x^2 + bx + c$ as $(x + h)^2 + k$. Since there's no other side to balance, add and subtract the same number.

### Example 5

Write $x^2 - 8x + 5$ in the form $(x - h)^2 + k$.

1. Half of $-8$ is $-4$, and $(-4)^2 = 16$.
2. Add and subtract 16: $x^2 - 8x + 16 - 16 + 5$.
3. Group: $(x - 4)^2 - 11$.

This form shows at once that the smallest value of $x^2 - 8x + 5$ is $-11$, reached when $x = 4$ (since a square is never negative). That's the vertex of its parabola, as Lesson 25 will explain.

## Common mistakes

- Forgetting $\pm$: $x^2 = 16$ has two solutions, 4 and $-4$.
- Adding $\left(\tfrac{b}{2}\right)^2$ to only one side of an equation.
- Adding $\tfrac{b}{2}$ instead of its square, or squaring $b$ before halving.
- Completing the square before dividing by the leading coefficient.
- Writing $(x + 3)^2 = x^2 + 9$ and then wondering why the steps don't work.

## Key points

- Square root property: $u^2 = k$ (with $k \ge 0$) gives $u = \pm\sqrt{k}$.
- To complete the square on $x^2 + bx$, add $\left(\tfrac{b}{2}\right)^2$: then $x^2 + bx + \left(\tfrac b2\right)^2 = \left(x + \tfrac b2\right)^2$.
- Make the leading coefficient 1 before completing the square.
- Completing the square solves every quadratic and rewrites $x^2 + bx + c$ as $(x - h)^2 + k$.
