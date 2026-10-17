---
id: alg-exponent-rules
module: alg-m5
title: Exponent rules and scientific notation
minutes: 30
topics: [Exponents, Scientific notation]
drills: [alg-d-exp-simplify, alg-d-negative-exp, alg-d-sci-notation]
refs: [alg-ref-polynomials]
---
Polynomials, the subject of the rest of this module, are built from powers of a variable. Before working with them we need complete control of exponents. This lesson derives the exponent rules from the meaning of a power, extends exponents to zero and negative integers, and applies the rules to scientific notation, the standard way to write very large and very small numbers.

## What an exponent means

For a positive integer $n$, the **power** $a^n$ means $n$ factors of $a$ multiplied together:

$$a^n = \underbrace{a \cdot a \cdots a}_{n \text{ factors}}.$$

Here $a$ is the **base** and $n$ is the **exponent**. So $2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$. Every rule below comes from counting factors.

## The product, quotient and power rules

The **product rule** says $a^m \cdot a^n = a^{m+n}$. Writing out $a^3 \cdot a^2 = (a \cdot a \cdot a)(a \cdot a)$ shows five factors of $a$. The exponents add because the factors pile up.

The **quotient rule** says $\dfrac{a^m}{a^n} = a^{m-n}$ for $a \ne 0$. In $\dfrac{a^5}{a^2}$, two factors on the bottom cancel two on top, leaving $a^3$.

The **power rule** says $(a^m)^n = a^{mn}$. The expression $(a^2)^3 = a^2 \cdot a^2 \cdot a^2$ has three groups of two factors, six in all.

For a power of a product or quotient, $(ab)^n = a^n b^n$ and $\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n}$. Rearranging $(ab)(ab)(ab)$ gives $aaa \cdot bbb$.

These rules need the same base. $2^3 \cdot 3^2$ can't be combined into a single power; it's just $8 \cdot 9 = 72$.

### Example 1

Simplify $(3x^2y)^3 \cdot 2xy^4$.

1. Power of a product: $(3x^2y)^3 = 3^3 (x^2)^3 y^3 = 27x^6y^3$.
2. Multiply by $2xy^4$: coefficients $27 \cdot 2 = 54$; $x^6 \cdot x = x^7$; $y^3 \cdot y^4 = y^7$.
3. Result: $54x^7y^7$.

A common slip is writing $(3x^2y)^3 = 3x^6y^3$. The exponent applies to every factor inside, including the 3.

## Zero and negative exponents

What should $a^0$ mean? If the quotient rule is to keep working, $\dfrac{a^3}{a^3} = a^{3-3} = a^0$. But anything nonzero divided by itself is 1. So we define

$$a^0 = 1 \quad (a \ne 0).$$

Similarly, $\dfrac{a^2}{a^5} = a^{2-5} = a^{-3}$, while cancelling directly gives $\dfrac{1}{a^3}$. So we define

$$a^{-n} = \frac{1}{a^n} \quad (a \ne 0).$$

A negative exponent means "reciprocal," not "negative number": $2^{-3} = \tfrac18$, which is positive. With these definitions, all the rules above work for every integer exponent.

Two handy consequences: $\dfrac{1}{a^{-n}} = a^n$, so a factor can move between numerator and denominator by changing the sign of its exponent; and $\left(\dfrac{a}{b}\right)^{-n} = \left(\dfrac{b}{a}\right)^n$.

### Example 2

Evaluate $4^{-2}$, $\left(\tfrac23\right)^{-3}$ and $-5^0$.

1. $4^{-2} = \dfrac{1}{4^2} = \dfrac{1}{16}$.
2. $\left(\tfrac23\right)^{-3} = \left(\tfrac32\right)^3 = \tfrac{27}{8}$.
3. $-5^0 = -(5^0) = -1$. The exponent applies only to the 5, just as in $-3^2 = -9$.

### Example 3

Simplify $\dfrac{12x^{-3}y^5}{4x^2y^{-1}}$ and write it with positive exponents only.

1. Coefficients: $\tfrac{12}{4} = 3$.
2. $x$: $x^{-3-2} = x^{-5}$.
3. $y$: $y^{5-(-1)} = y^6$.
4. Result: $3x^{-5}y^6 = \dfrac{3y^6}{x^5}$.

Subtracting a negative exponent is where most errors happen: $5 - (-1) = 6$, not 4.

## Summary of the rules

| Rule | Statement |
|---|---|
| Product | $a^m a^n = a^{m+n}$ |
| Quotient | $\dfrac{a^m}{a^n} = a^{m-n}$ |
| Power | $(a^m)^n = a^{mn}$ |
| Product to a power | $(ab)^n = a^n b^n$ |
| Quotient to a power | $\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n}$ |
| Zero exponent | $a^0 = 1$ |
| Negative exponent | $a^{-n} = \dfrac{1}{a^n}$ |

Any base that ends up in a denominator, or is raised to the power 0 or a negative power, must be nonzero: the quotient, zero-exponent and negative-exponent rules all assume $a \ne 0$ (and $b \ne 0$ in the quotient-to-a-power rule).

Not a rule: $(a + b)^n$ is not $a^n + b^n$. For instance $(1 + 2)^2 = 9$ but $1^2 + 2^2 = 5$. Exponents distribute over multiplication, never over addition.

## Scientific notation

**Scientific notation** writes a number as

$$c \times 10^n, \qquad 1 \le |c| < 10,\; n \text{ an integer}.$$

The exponent counts how many places the decimal point moves. Large numbers get positive exponents and small numbers negative ones: $93{,}000{,}000 = 9.3 \times 10^7$ and $0.00042 = 4.2 \times 10^{-4}$.

To multiply or divide, handle the decimal parts and the powers of ten separately (using the product and quotient rules), then adjust so the decimal part is between 1 and 10.

### Example 4

Compute $(6 \times 10^{5})(8 \times 10^{-9})$ and $\dfrac{3 \times 10^{4}}{7.5 \times 10^{-2}}$.

1. Multiply: $6 \times 8 = 48$ and $10^5 \cdot 10^{-9} = 10^{-4}$. So $48 \times 10^{-4}$. Adjust: $48 = 4.8 \times 10^1$, giving $4.8 \times 10^{-3}$.
2. Divide: $\tfrac{3}{7.5} = 0.4$ and $\tfrac{10^4}{10^{-2}} = 10^6$. So $0.4 \times 10^6 = 4 \times 10^5$.

### Example 5

Light travels about $3.0 \times 10^8$ meters per second. How far does it travel in one year, about $3.15 \times 10^7$ seconds?

$d = rt = (3.0 \times 10^8)(3.15 \times 10^7) = 9.45 \times 10^{15}$ meters. This distance is one light-year.

## Common mistakes

- Multiplying exponents when multiplying powers: $x^3 \cdot x^4 = x^7$, not $x^{12}$.
- Applying an outside exponent to only part of a product: $(2x)^3 = 8x^3$, not $2x^3$.
- Treating a negative exponent as a negative number: $3^{-2} = \tfrac19$, not $-9$.
- Distributing an exponent over a sum: $(x + 3)^2 \ne x^2 + 9$.
- Leaving scientific notation unadjusted, such as $48 \times 10^{-4}$.

## Key points

- Same base: multiply → add exponents; divide → subtract; power of a power → multiply.
- An exponent outside parentheses applies to every factor inside.
- $a^0 = 1$ and $a^{-n} = \dfrac{1}{a^n}$ for $a \ne 0$, defined so the rules keep working.
- Scientific notation $c \times 10^n$ with $1 \le |c| < 10$; work on the decimals and the powers of ten separately.
