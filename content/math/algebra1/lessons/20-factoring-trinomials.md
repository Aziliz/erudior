---
id: alg-factor-trinomials
module: alg-m5
title: Factoring trinomials and special patterns
minutes: 35
topics: [Factoring]
drills: [alg-d-factor-ac, alg-d-factor-special, alg-d-factor-cubes]
refs: [alg-ref-polynomials]
---
Quadratic trinomials like $x^2 + 5x + 6$ are the polynomials you'll factor most often, because they lead directly to solving quadratic equations in Module 6. This lesson reverses FOIL to factor them, then reverses the special products from Lesson 18 to recognize perfect squares, differences of squares, and sums and differences of cubes. It ends with a strategy for deciding which method to use.

## Trinomials with leading coefficient 1

Multiplying $(x + m)(x + n)$ gives

$$x^2 + (m + n)x + mn.$$

So to factor $x^2 + bx + c$, find two integers $m$ and $n$ whose *product is $c$* and whose *sum is $b$*. Then $x^2 + bx + c = (x + m)(x + n)$.

The signs guide the search:

| $c$ | $b$ | Signs of $m$ and $n$ |
|---|---|---|
| positive | positive | both positive |
| positive | negative | both negative |
| negative | either | opposite signs; the larger absolute value takes the sign of $b$ |

### Example 1

Factor $x^2 - 9x + 20$.

1. Product $20$, sum $-9$. Since $c > 0$ and $b < 0$, both numbers are negative.
2. Negative factor pairs of 20: $(-1, -20)$, $(-2, -10)$, $(-4, -5)$. Sums: $-21$, $-12$, $-9$.
3. The pair $-4, -5$ works: $(x - 4)(x - 5)$.
4. Check: $x^2 - 5x - 4x + 20 = x^2 - 9x + 20$.

### Example 2

Factor $x^2 + 3x - 28$.

1. Product $-28$, sum $3$: opposite signs, larger absolute value positive.
2. Pairs: $(7, -4)$ has sum 3.
3. $(x + 7)(x - 4)$.

If no integer pair works, the trinomial is prime over the integers. For $x^2 + x + 1$, the only factor pairs of 1 are $(1, 1)$ and $(-1, -1)$, with sums 2 and $-2$, so it is prime.

## Trinomials with leading coefficient other than 1

For $ax^2 + bx + c$ with $a \ne 1$ (after taking out any GCF), the **ac method** turns the problem into grouping:

1. Multiply $a \cdot c$.
2. Find two integers with product $ac$ and sum $b$.
3. Use them to split the middle term $bx$ into two terms.
4. Factor by grouping.

### Example 3

Factor $6x^2 + 11x - 10$.

1. $ac = 6(-10) = -60$.
2. Two numbers with product $-60$ and sum $11$: $15$ and $-4$.
3. Split: $6x^2 + 15x - 4x - 10$.
4. Group: $3x(2x + 5) - 2(2x + 5) = (2x + 5)(3x - 2)$.
5. Check: $6x^2 - 4x + 15x - 10 = 6x^2 + 11x - 10$.

Why does this work? If $ax^2 + bx + c = (px + q)(rx + s)$, then $a = pr$, $c = qs$ and $b = ps + qr$. The two numbers $ps$ and $qr$ have sum $b$ and product $ps \cdot qr = pr \cdot qs = ac$. Splitting $bx$ into $psx + qrx$ is exactly what makes grouping succeed.

The alternative is trial and error: list the factor pairs of $a$ and of $c$ and test combinations until the outer plus inner products give $bx$. With practice this is often faster for small numbers.

### Example 4

Factor $12x^3 - 2x^2 - 2x$ completely.

1. GCF first: $2x(6x^2 - x - 1)$.
2. For $6x^2 - x - 1$: $ac = -6$, sum $-1$: the numbers $-3$ and $2$.
3. Split and group: $6x^2 - 3x + 2x - 1 = 3x(2x - 1) + 1(2x - 1) = (2x - 1)(3x + 1)$.
4. Result: $2x(2x - 1)(3x + 1)$.

## Special patterns

Reading the special products backward gives factoring patterns.

| Pattern | Factored form |
|---|---|
| Difference of squares | $a^2 - b^2 = (a + b)(a - b)$ |
| Perfect square trinomial | $a^2 + 2ab + b^2 = (a + b)^2$ |
| Perfect square trinomial | $a^2 - 2ab + b^2 = (a - b)^2$ |
| **Sum of cubes** | $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$ |
| **Difference of cubes** | $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ |

A sum of squares, $a^2 + b^2$, is prime over the real numbers. No pair of real binomials multiplies to it.

To recognize a perfect square trinomial, check that the first and last terms are squares and the middle term is twice the product of their square roots: $9x^2 - 30x + 25$ has $(3x)^2$, $5^2$ and $2(3x)(5) = 30x$, so it equals $(3x - 5)^2$.

For the cube patterns, a sign memory aid is **SOAP**: the binomial has the Same sign as the original, the next sign is the Opposite, and the last is Always Positive. You can verify the sum of cubes by multiplying: $(a + b)(a^2 - ab + b^2) = a^3 - a^2b + ab^2 + a^2b - ab^2 + b^3 = a^3 + b^3$.

### Example 5

Factor $50x^2 - 8$, $x^3 - 27$ and $8y^3 + 125$.

1. $50x^2 - 8 = 2(25x^2 - 4) = 2(5x + 2)(5x - 2)$. GCF first, then difference of squares.
2. $x^3 - 27 = x^3 - 3^3 = (x - 3)(x^2 + 3x + 9)$.
3. $8y^3 + 125 = (2y)^3 + 5^3 = (2y + 5)(4y^2 - 10y + 25)$.

### Example 6

Factor $x^4 - 81$ completely.

1. Difference of squares with $a = x^2$, $b = 9$: $(x^2 + 9)(x^2 - 9)$.
2. $x^2 - 9$ factors again: $(x + 3)(x - 3)$.
3. $x^2 + 9$ is a sum of squares: prime.
4. Result: $(x^2 + 9)(x + 3)(x - 3)$.

## A factoring strategy

1. Factor out the GCF (a negative one if the leading coefficient is negative).
2. Count the terms.
   - Two terms: difference of squares, sum of cubes, or difference of cubes.
   - Three terms: perfect square trinomial? Otherwise $x^2 + bx + c$ (sum-product) or $ax^2 + bx + c$ (ac method).
   - Four terms: grouping.
3. Check each factor to see if it factors further.
4. Check by multiplying.

## Common mistakes

- Getting the sum and product backwards: for $x^2 + bx + c$ the product is $c$ and the sum is $b$.
- Factoring $a^2 + b^2$ as $(a + b)^2$. That product has a middle term $2ab$.
- Sign errors in cube patterns: in $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$, the middle sign in the trinomial is $+$.
- Forgetting the GCF, so that the ac method has huge numbers or the result isn't complete.
- Stopping at $x^4 - 16 = (x^2 + 4)(x^2 - 4)$ without factoring $x^2 - 4$.

## Key points

- $x^2 + bx + c$: find integers with product $c$ and sum $b$.
- $ax^2 + bx + c$: the ac method splits $bx$ using numbers with product $ac$ and sum $b$, then groups.
- Recognize $a^2 - b^2$, $a^2 \pm 2ab + b^2$, $a^3 \pm b^3$; a sum of squares is prime over the reals.
- Strategy: GCF, count terms, pick the method, factor completely, check by multiplying.
