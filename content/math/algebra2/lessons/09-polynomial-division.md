---
id: alg-poly-division
module: a2-m3
title: Polynomial division; the remainder and factor theorems
minutes: 35
topics: [Polynomial division]
drills: [alg-d-synthetic, alg-d-remainder]
refs: [alg-ref-functions]
---
To find all the zeros of a polynomial of degree 3 or more, you usually find one zero and then divide out its factor to get a smaller polynomial. This lesson shows how to divide polynomials, by long division and by the faster shortcut called synthetic division, and proves two theorems that tie division to evaluation and to factoring.

## Long division of polynomials

Polynomial long division works exactly like long division of numbers: divide, multiply, subtract, bring down, repeat. Write both polynomials in standard form, and include missing powers with coefficient 0.

### Example 1

Divide $2x^3 - 3x^2 + 4x - 5$ by $x - 2$.

1. Divide leading terms: $2x^3 \div x = 2x^2$. Multiply: $2x^2(x - 2) = 2x^3 - 4x^2$. Subtract: $(2x^3 - 3x^2) - (2x^3 - 4x^2) = x^2$. Bring down $+4x$: $x^2 + 4x$.
2. $x^2 \div x = x$. Multiply: $x^2 - 2x$. Subtract: $6x$. Bring down $-5$: $6x - 5$.
3. $6x \div x = 6$. Multiply: $6x - 12$. Subtract: $7$.
4. The **quotient** is $2x^2 + x + 6$ and the **remainder** is 7.

$$\frac{2x^3 - 3x^2 + 4x - 5}{x - 2} = 2x^2 + x + 6 + \frac{7}{x - 2}.$$

The **division algorithm** says that for a polynomial $f$ and a nonzero divisor $d$,

$$f(x) = d(x)\,q(x) + r(x),$$

where the remainder $r$ is either 0 or has smaller degree than $d$. Check Example 1: $(x - 2)(2x^2 + x + 6) + 7 = 2x^3 - 3x^2 + 4x - 12 + 7$, which is the original.

### Example 2

Divide $x^4 - 3x^2 + 2x + 1$ by $x^2 + x - 1$.

1. Fill in the missing term: $x^4 + 0x^3 - 3x^2 + 2x + 1$.
2. $x^4 \div x^2 = x^2$. Subtract $x^2(x^2 + x - 1) = x^4 + x^3 - x^2$: left with $-x^3 - 2x^2 + 2x$.
3. $-x^3 \div x^2 = -x$. Subtract $-x(x^2 + x - 1) = -x^3 - x^2 + x$: left with $-x^2 + x + 1$.
4. $-x^2 \div x^2 = -1$. Subtract $-1(x^2 + x - 1) = -x^2 - x + 1$: left with $2x$.
5. Quotient $x^2 - x - 1$, remainder $2x$ (degree 1, less than the divisor's degree 2, so we stop).

## Synthetic division

When the divisor is $x - c$, the work can be compressed into rows of coefficients. This is **synthetic division**.

1. Write $c$ on the left and the dividend's coefficients (with zeros for missing terms) in a row.
2. Bring down the first coefficient.
3. Multiply it by $c$, write the product under the next coefficient, and add.
4. Repeat to the end. The last number is the remainder; the others are the quotient's coefficients, one degree lower than the dividend.

### Example 3

Divide $2x^3 - 3x^2 + 4x - 5$ by $x - 2$ synthetically.

$$\begin{array}{r|rrrr} 2 & 2 & -3 & 4 & -5 \\ & & 4 & 2 & 12 \\ \hline & 2 & 1 & 6 & 7 \end{array}$$

Bring down 2. $2 \cdot 2 = 4$; $-3 + 4 = 1$. $1 \cdot 2 = 2$; $4 + 2 = 6$. $6 \cdot 2 = 12$; $-5 + 12 = 7$. Quotient $2x^2 + x + 6$, remainder 7, matching Example 1.

For a divisor like $x + 3$, use $c = -3$, since $x + 3 = x - (-3)$.

### Example 4

Divide $x^4 - 5x^2 + 4$ by $x + 1$.

Coefficients $1, 0, -5, 0, 4$ with $c = -1$:

$$\begin{array}{r|rrrrr} -1 & 1 & 0 & -5 & 0 & 4 \\ & & -1 & 1 & 4 & -4 \\ \hline & 1 & -1 & -4 & 4 & 0 \end{array}$$

Quotient $x^3 - x^2 - 4x + 4$, remainder 0. So $x + 1$ is a factor.

## The Remainder Theorem

Put $d(x) = x - c$ in the division algorithm: $f(x) = (x - c)q(x) + r$, where $r$ is a number. Substitute $x = c$: the first term vanishes, leaving $f(c) = r$.

> **Remainder Theorem**: the remainder when $f(x)$ is divided by $x - c$ is $f(c)$.

In Example 1, $f(2) = 16 - 12 + 8 - 5 = 7$, the same as the remainder. This gives a fast way to evaluate polynomials (synthetic division with $c$) and, more importantly, links division to zeros.

## The Factor Theorem

A remainder of 0 means $x - c$ divides $f$ evenly. Combining with the Remainder Theorem:

> **Factor Theorem**: $x - c$ is a factor of $f(x)$ if and only if $f(c) = 0$.

### Example 5

Show that $x - 3$ is a factor of $f(x) = x^3 - 4x^2 + x + 6$, and factor $f$ completely.

1. $f(3) = 27 - 36 + 3 + 6 = 0$, so $x - 3$ is a factor.
2. Divide synthetically by 3: coefficients $1, -4, 1, 6$ give $1, -1, -2$ and remainder 0. Quotient $x^2 - x - 2$.
3. Factor the quotient: $(x - 2)(x + 1)$.
4. $f(x) = (x - 3)(x - 2)(x + 1)$, with zeros $3$, $2$ and $-1$.

```plot
{"x": [-2, 4.5], "y": [-6, 6], "functions": [{"f": "x^3 - 4*x^2 + x + 6", "label": "y = x³ - 4x² + x + 6", "from": -1.6, "to": 4.2}], "points": [{"at": [-1, 0], "label": "-1"}, {"at": [2, 0], "label": "2"}, {"at": [3, 0], "label": "3"}], "caption": "One known zero, divided out, reveals the rest"}
```

## Common mistakes

- Leaving out zero coefficients for missing powers, which misaligns every column.
- Using $c = 3$ for the divisor $x + 3$; it should be $c = -3$.
- Subtracting only the first term in a long-division step: subtract the whole product.
- Synthetic division with a divisor that isn't of the form $x - c$ (like $x^2 + 1$): use long division instead.
- Writing the quotient with the same degree as the dividend; it's one degree lower when dividing by $x - c$.

## Key points

- Division algorithm: $f = d \cdot q + r$, with $r = 0$ or $\deg r < \deg d$.
- Synthetic division divides by $x - c$ quickly; include zeros for missing terms.
- Remainder Theorem: dividing by $x - c$ leaves remainder $f(c)$.
- Factor Theorem: $(x - c)$ is a factor exactly when $f(c) = 0$.
