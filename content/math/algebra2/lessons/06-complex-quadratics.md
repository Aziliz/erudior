---
id: a2-complex-quadratics
module: a2-m2
title: Quadratics with complex solutions
minutes: 35
topics: [Quadratics with complex solutions]
drills: [a2-d-cq-vertex, a2-d-cq-formula, a2-d-cq-from-roots]
refs: [alg-ref-functions]
---
In Algebra 1, some quadratic equations had "no solution" because the parabola never touched the $x$-axis. The last lesson gave those equations solutions: complex numbers. This lesson puts the two ideas together. You'll see how the graph tells you in advance whether the solutions are real or complex, solve such equations by completing the square and by the quadratic formula, see why complex solutions always come as a conjugate pair, and run the process backward to build a quadratic with given roots.

## Vertex form and what the graph says

Recall from Algebra 1 that a quadratic written in **vertex form**,

$$f(x) = a(x - h)^2 + k,$$

has its vertex at $(h, k)$ and opens up if $a > 0$, down if $a < 0$. (In the language of Module 1, it's $y = x^2$ stretched by $a$ and shifted so the vertex lands at $(h, k)$.) You get vertex form from $ax^2 + bx + c$ by **completing the square**: add and subtract the square of half the $x$-coefficient so that part of the expression becomes a perfect square.

Vertex form makes the equation $f(x) = 0$ easy to solve:

$$a(x - h)^2 + k = 0 \;\Longrightarrow\; (x - h)^2 = -\frac{k}{a} \;\Longrightarrow\; x = h \pm \sqrt{-\frac{k}{a}}.$$

If $-\tfrac ka$ is negative, the square root is imaginary and the solutions are complex. That happens exactly when $a$ and $k$ have the same sign, and the graph shows why: a parabola that opens up with its vertex above the $x$-axis (or opens down with its vertex below it) never crosses the axis, so there are no real zeros.

### Example 1

Solve $x^2 + 6x + 13 = 0$ by completing the square, and explain the answer with the graph.

1. Half of 6 is 3, and $3^2 = 9$: $x^2 + 6x + 13 = (x^2 + 6x + 9) + 4 = (x + 3)^2 + 4$.
2. Set it to zero: $(x + 3)^2 = -4$.
3. Take square roots: $x + 3 = \pm\sqrt{-4} = \pm 2i$.
4. $x = -3 \pm 2i$.
5. Check $x = -3 + 2i$: $(2i)^2 + 4 = -4 + 4 = 0$. ✓

The graph of $y = (x + 3)^2 + 4$ opens up from the vertex $(-3, 4)$, which is above the $x$-axis, so it has no $x$-intercepts. Notice that the real part of the solutions, $-3$, is the $x$-coordinate of the vertex.

```plot
{"x": [-7, 2], "y": [-1, 10], "functions": [{"f": "x^2 + 6x + 13", "label": "y = x² + 6x + 13"}], "points": [{"at": [-3, 4], "label": "vertex (−3, 4)"}], "segments": [{"from": [-3, -1], "to": [-3, 10], "dashed": true}], "caption": "The parabola never reaches the x-axis, so its zeros −3 ± 2i are not real; their real part is the axis of symmetry x = −3"}
```

## The discriminant decides

For $ax^2 + bx + c = 0$, the **quadratic formula** gives

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}.$$

The quantity under the root, $b^2 - 4ac$, is the **discriminant**. Its sign tells you what kind of solutions to expect before you finish the work:

| Discriminant | Solutions | Graph of $y = ax^2 + bx + c$ |
|---|---|---|
| $b^2 - 4ac > 0$ | two different real solutions | crosses the $x$-axis twice |
| $b^2 - 4ac = 0$ | one real **double root** | touches the $x$-axis at the vertex |
| $b^2 - 4ac < 0$ | two non-real complex solutions, conjugates of each other | never meets the $x$-axis |

So "no real solution" never means "no solution" anymore. Every quadratic equation has exactly two solutions in the complex numbers, if a double root is counted twice.

When the discriminant is negative, write $\sqrt{b^2 - 4ac} = i\sqrt{4ac - b^2}$, simplify the radical, and then divide *both* terms of the numerator by $2a$ to get the form $p \pm qi$.

### Example 2

Solve $2x^2 - 4x + 5 = 0$.

1. $a = 2$, $b = -4$, $c = 5$. Discriminant: $(-4)^2 - 4(2)(5) = 16 - 40 = -24$.
2. $\sqrt{-24} = i\sqrt{24} = i\sqrt{4 \cdot 6} = 2i\sqrt6$.
3. $x = \dfrac{4 \pm 2i\sqrt6}{4}$.
4. Split the fraction and reduce each part: $x = \dfrac44 \pm \dfrac{2\sqrt6}{4}i = 1 \pm \dfrac{\sqrt6}{2}i$.

A common slip in step 4 is to divide only the 4 by 4 and write $1 \pm 2i\sqrt6$.

### Example 3

Solve $-2(x - 1)^2 - 8 = 0$ without expanding.

1. Here $a = -2$ and $k = -8$ have the same sign, so expect complex solutions (the parabola opens down from $(1, -8)$, below the axis).
2. $-2(x - 1)^2 = 8$, so $(x - 1)^2 = -4$.
3. $x - 1 = \pm 2i$, so $x = 1 \pm 2i$.

## Why the solutions are conjugates

When the discriminant $D$ is negative, the formula splits into a real part and an imaginary part:

$$x = -\frac{b}{2a} \pm \frac{\sqrt{-D}}{2a}\,i.$$

Both solutions have the same real part, $-\tfrac{b}{2a}$ (the $x$-coordinate of the vertex), and opposite imaginary parts. They are a **conjugate pair**, $p + qi$ and $p - qi$. So if the coefficients are real and you know one complex solution, you know the other: if $4 - i$ is a solution, so is $4 + i$.

Two more facts help check answers. For any quadratic $ax^2 + bx + c$ with solutions $r$ and $s$:

$$r + s = -\frac{b}{a}, \qquad rs = \frac{c}{a}.$$

In Example 2, the sum is $\left(1 + \tfrac{\sqrt6}{2}i\right) + \left(1 - \tfrac{\sqrt6}{2}i\right) = 2 = -\tfrac{-4}{2}$, and the product is $1^2 + \left(\tfrac{\sqrt6}{2}\right)^2 = 1 + \tfrac64 = \tfrac52 = \tfrac{c}{a}$. Both match. (The product uses $(p + qi)(p - qi) = p^2 + q^2$ from the last lesson.)

## Writing a quadratic from its roots

If $r$ and $s$ are the roots, then $(x - r)(x - s)$ is a quadratic with exactly those roots, by the zero product property; any multiple $a(x - r)(x - s)$ works too. With a conjugate pair $p \pm qi$, the product simplifies nicely if you group the real part with $x$:

$$\big(x - (p + qi)\big)\big(x - (p - qi)\big) = \big((x - p) - qi\big)\big((x - p) + qi\big) = (x - p)^2 + q^2.$$

This is a difference of squares in which $-(qi)^2 = q^2$. The result has real coefficients, and it's already in vertex form: vertex $(p, q^2)$.

### Example 4

Write a quadratic with leading coefficient 1 whose roots are $2 \pm 5i$.

1. $p = 2$, $q = 5$: $(x - 2)^2 + 25$.
2. Expand: $x^2 - 4x + 4 + 25 = x^2 - 4x + 29$.
3. Check with sum and product: the roots add to 4, which is $-\tfrac{-4}{1}$, and multiply to $2^2 + 5^2 = 29 = \tfrac{29}{1}$. ✓

### Example 5

A quadratic has real coefficients, leading coefficient 2, and one root $3 - i\sqrt2$. Find it.

1. The other root is the conjugate, $3 + i\sqrt2$. So $p = 3$, $q = \sqrt2$, $q^2 = 2$.
2. $2\left[(x - 3)^2 + 2\right] = 2(x^2 - 6x + 11) = 2x^2 - 12x + 22$.

## Common mistakes

- Saying a quadratic with negative discriminant has "no solution." It has no *real* solution; it has two complex ones.
- Writing $\sqrt{-24}$ as $-2\sqrt6$. The square root of a negative is imaginary: $2i\sqrt6$.
- Dividing only part of the numerator by $2a$. Both $-b$ and the root term get divided.
- Sign errors in $(x - r)$: for the root $-1 + 3i$, the factor is $x - (-1 + 3i) = x + 1 - 3i$.
- Forgetting the conjugate. A real quadratic can't have just one non-real root.

## Key points

- In vertex form $a(x - h)^2 + k = 0$, the solutions are $h \pm \sqrt{-k/a}$; they're complex when $a$ and $k$ have the same sign (the parabola misses the $x$-axis).
- Discriminant $b^2 - 4ac$: positive, two real roots; zero, a double root; negative, two complex conjugate roots.
- For a negative discriminant, $x = -\tfrac{b}{2a} \pm \tfrac{\sqrt{4ac - b^2}}{2a}i$.
- Roots $r$, $s$ of $ax^2 + bx + c$ satisfy $r + s = -\tfrac ba$ and $rs = \tfrac ca$.
- Roots $p \pm qi$ come from $(x - p)^2 + q^2$; multiply by $a$ for another leading coefficient.
