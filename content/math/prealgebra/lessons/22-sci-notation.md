---
id: pre-sci-notation
module: pre-m6
title: Scientific notation
minutes: 25
topics: [Scientific notation]
drills: [pre-sci-to-standard, pre-sci-multiply]
refs: [pre-ref-algebra]
---
## Very big and very small numbers

The distance from Earth to the Sun is about 150,000,000 kilometers. A red blood cell is about 0.000008 meters across. Numbers like these are hard to read and easy to miscopy: one missing zero changes the value tenfold. **Scientific notation** writes them compactly using the powers of 10 from the last lesson. It's the standard in science and engineering, and it's how calculators display very large and very small results.

## The form

A number is in scientific notation when it is written as

$$a \times 10^n$$

where the **coefficient** $a$ satisfies $1 \le a < 10$ (one nonzero digit before the decimal point) and $n$ is an integer.

- $150{,}000{,}000 = 1.5 \times 10^8$
- $0.000008 = 8 \times 10^{-6}$
- $4{,}070 = 4.07 \times 10^3$
- $3.2 = 3.2 \times 10^0$

The exponent tells you how far the decimal point moved. A positive exponent means a large number (10 or more); a negative exponent means a small number (between 0 and 1).

These are *not* in scientific notation: $15 \times 10^7$ (coefficient too big), $0.8 \times 10^{-5}$ (coefficient too small).

## Standard form to scientific notation

1. Move the decimal point so that exactly one nonzero digit is to its left. That's the coefficient.
2. Count how many places the point moved. That's the size of the exponent.
3. If the original number is 10 or more, the exponent is positive; if it's less than 1, the exponent is negative.

### Example 1

Write 93,000,000 in scientific notation.

The point is after the last 0. Moving it to just after the 9 gives 9.3, a move of 7 places left. The number is large, so the exponent is $+7$: $9.3 \times 10^7$.

Check: $9.3 \times 10^7 = 9.3 \times 10{,}000{,}000 = 93{,}000{,}000$. ✓

### Example 2

Write 0.000405 in scientific notation.

Move the point right to just after the 4: 4.05, a move of 4 places. The number is small, so the exponent is $-4$: $4.05 \times 10^{-4}$.

Why negative? $4.05 \times 10^{-4} = 4.05 \times \tfrac{1}{10{,}000} = 0.000405$. Multiplying by a negative power of 10 divides, moving the point left.

## Scientific notation to standard form

Multiplying by $10^n$ moves the point $n$ places right; multiplying by $10^{-n}$ moves it $n$ places left. Fill in zeros as needed.

- $6.02 \times 10^5 = 602{,}000$ (point 5 places right)
- $7.1 \times 10^{-3} = 0.0071$ (point 3 places left)

## Comparing numbers

In scientific notation, compare exponents first: a bigger exponent means a bigger number (for positive numbers), whatever the coefficients. Only when the exponents match do you compare coefficients. So $2.1 \times 10^{-3} > 9.8 \times 10^{-4}$, because $-3 > -4$: 0.0021 vs 0.00098.

## Multiplying and dividing

Use the commutative and associative properties to group the coefficients together and the powers of 10 together, then apply the exponent rules.

$$(a \times 10^m)(b \times 10^n) = (a \times b) \times 10^{m+n}$$

$$\frac{a \times 10^m}{b \times 10^n} = \frac{a}{b} \times 10^{m-n}$$

If the new coefficient isn't between 1 and 10, adjust it.

### Example 3

Multiply $(3 \times 10^4)(5 \times 10^6)$.

Coefficients: $3 \times 5 = 15$. Powers: $10^{4+6} = 10^{10}$. So $15 \times 10^{10}$. But 15 is too big: $15 = 1.5 \times 10^1$, so the answer is $1.5 \times 10^{11}$.

### Example 4

Divide $\dfrac{2.4 \times 10^{-3}}{8 \times 10^{5}}$.

Coefficients: $2.4 \div 8 = 0.3$. Powers: $10^{-3-5} = 10^{-8}$. So $0.3 \times 10^{-8}$. The coefficient is too small: $0.3 = 3 \times 10^{-1}$, giving $3 \times 10^{-9}$.

Adjusting rule of thumb: when you make the coefficient smaller (move its point left), make the exponent bigger by the same amount, and vice versa. The value doesn't change.

## Applications

### Example 5

Light travels about $3 \times 10^8$ meters per second. About how far does it travel in one minute?

One minute is 60 seconds. Distance $= (3 \times 10^8)(60) = (3 \times 10^8)(6 \times 10^1) = 18 \times 10^9 = 1.8 \times 10^{10}$ meters.

### Example 6

A country's annual budget is about \$4.4 trillion ($4.4 \times 10^{12}$ dollars) and its population is about 330 million ($3.3 \times 10^8$). What is the budget per person?

$\dfrac{4.4 \times 10^{12}}{3.3 \times 10^8} = \dfrac{4.4}{3.3} \times 10^{4} \approx 1.33 \times 10^4$, about \$13,300 per person.

On calculators, scientific notation often appears as `1.33E4` or `1.33e4`, meaning $1.33 \times 10^4$.

## Adding and subtracting

Unlike multiplication, adding or subtracting in scientific notation needs the *same power of 10*, just as adding fractions needs a common denominator. Rewrite one number so the exponents match, then add the coefficients.

### Example 7

Add $(4.6 \times 10^5) + (3.2 \times 10^4)$.

Rewrite $3.2 \times 10^4$ as $0.32 \times 10^5$. Then $4.6 + 0.32 = 4.92$, so the sum is $4.92 \times 10^5$. Check in standard form: $460{,}000 + 32{,}000 = 492{,}000$. ✓

When the exponents differ by a lot, the smaller number barely matters: $(5 \times 10^9) + (2 \times 10^3)$ is $5{,}000{,}002{,}000$, which is still about $5 \times 10^9$ to three significant digits.

## Common mistakes

- *Coefficient out of range:* $45 \times 10^3$ should be $4.5 \times 10^4$.
- *Wrong sign on the exponent:* small numbers (less than 1) get negative exponents.
- *Multiplying the exponents* when multiplying numbers: $10^4 \cdot 10^6 = 10^{10}$, not $10^{24}$.
- *Forgetting to adjust* after multiplying or dividing coefficients.
- *Comparing coefficients before exponents.*

## Key points

- Scientific notation: $a \times 10^n$ with $1 \le a < 10$ and $n$ an integer.
- Large numbers have positive exponents; numbers between 0 and 1 have negative exponents.
- The exponent counts how many places the decimal point moves.
- Multiply: multiply coefficients, add exponents. Divide: divide coefficients, subtract exponents. Then adjust the coefficient into $[1, 10)$.
