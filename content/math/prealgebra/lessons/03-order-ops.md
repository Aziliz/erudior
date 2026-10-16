---
id: pre-order-ops
module: pre-m1
title: Exponents and the order of operations
minutes: 25
topics: [Exponents, Order of operations]
drills: [pre-order-ops-1, pre-order-ops-2]
refs: [pre-ref-arithmetic, pre-ref-algebra]
---
## Why we need an agreed order

What is $2 + 3 \times 4$? If you work left to right you get $5 \times 4 = 20$. If you multiply first you get $2 + 12 = 14$. Both can't be right, and a calculation that depends on who does it is useless. Mathematicians settled the question long ago with an agreed set of rules called the **order of operations**. The answer is 14. Before the rules, we need one new operation: exponents.

## Exponents as repeated multiplication

Just as multiplication is shorthand for repeated addition, an **exponent** is shorthand for repeated multiplication:

$$5^3 = 5 \times 5 \times 5 = 125$$

The 5 is the **base** (the number being multiplied) and the small raised 3 is the exponent (how many times the base appears as a factor). The whole expression $5^3$ is called a **power**, read "five to the third power" or "five cubed." Similarly $7^2$ is "seven squared" ($= 49$); the names come from geometry, since a square with side 7 has area $7^2$ and a cube with edge 5 has volume $5^3$.

Two special cases:

- Any number to the first power is itself: $9^1 = 9$.
- Powers of 10 are easy: $10^1 = 10$, $10^2 = 100$, $10^3 = 1{,}000$, $10^6 = 1{,}000{,}000$. The exponent counts the zeros.

Be careful: $5^3$ is *not* $5 \times 3$. The exponent is a count of factors, not a factor itself.

## The order of operations

Work in this order:

1. *Grouping symbols* first: parentheses ( ), brackets [ ], braces { }, the bar of a fraction, and absolute value bars. Work from the innermost group outward.
2. *Exponents* (and roots).
3. *Multiplication and division*, together, from left to right.
4. *Addition and subtraction*, together, from left to right.

Many people remember this with the acronym **PEMDAS** ("Please Excuse My Dear Aunt Sally"): Parentheses, Exponents, Multiplication/Division, Addition/Subtraction. The acronym hides a trap: M comes before D in the word, but multiplication does *not* come before division. They have equal rank and are done in the order they appear, left to right. The same goes for A and S.

Why this order? It goes from the "strongest" operation to the "weakest." An exponent is repeated multiplication, and multiplication is repeated addition, so the more powerful operations bind their numbers more tightly. Writing $2 + 3 \times 4$ means "2 plus three fours," and we'd lose that meaning if we added first. Parentheses exist precisely to override the default when we want something different: $(2 + 3) \times 4 = 20$.

### Example 1

Evaluate $18 - 12 \div 3 \times 2 + 1$.

No grouping or exponents. Multiplication and division from left to right: $12 \div 3 = 4$ comes first, then $4 \times 2 = 8$. The expression is now $18 - 8 + 1$. Addition and subtraction from left to right: $18 - 8 = 10$, then $10 + 1 = 11$.

Result: 11. (Doing $3 \times 2$ first gives $18 - 2 + 1 = 17$, and doing $8 + 1$ before the subtraction gives 9. Both are wrong because they break the left-to-right rule.)

### Example 2

Evaluate $4 + 2 \times (9 - 3^2 \div 3)^2$.

- Inside the parentheses, the exponent first: $3^2 = 9$, so we have $9 - 9 \div 3$.
- Still inside, division before subtraction: $9 \div 3 = 3$, so $9 - 3 = 6$.
- Now the expression is $4 + 2 \times 6^2$. Exponent: $6^2 = 36$.
- Multiply: $2 \times 36 = 72$.
- Add: $4 + 72 = 76$.

Result: 76.

## Nested grouping and fraction bars

When groups are inside groups, start with the innermost one. Brackets and braces are just parentheses with a different shape, used so you can see which closing symbol matches which opening one.

### Example 3

Evaluate $2[15 - (4 + 1)^2 \div 5] + 7$.

- Innermost parentheses: $4 + 1 = 5$.
- Inside the brackets: $15 - 5^2 \div 5 = 15 - 25 \div 5 = 15 - 5 = 10$.
- Now $2 \times 10 + 7 = 20 + 7 = 27$.

Result: 27. A number written right next to a bracket, like the 2 in $2[\ldots]$, means multiply.

A fraction bar groups everything above it and everything below it, as if each had invisible parentheses. So

$$\frac{6 + 3 \times 4}{2 \times 5 - 1} = \frac{6 + 12}{10 - 1} = \frac{18}{9} = 2.$$

Simplify the top and the bottom separately, then divide. Entering this on a calculator as `6 + 3 × 4 ÷ 2 × 5 - 1` gives the wrong answer (35); you would need `(6 + 3 × 4) ÷ (2 × 5 - 1)`.

## Writing a calculation from a word problem

Order of operations matters when you turn a story into a single expression.

### Example 4

Maya buys 3 shirts at $12 each and 2 pairs of socks at $4 each. She pays with a $50 bill. How much change does she get?

The cost is $3 \times 12 + 2 \times 4$, and the change is 50 minus that whole cost, so the cost needs parentheses:

$$50 - (3 \times 12 + 2 \times 4) = 50 - (36 + 8) = 50 - 44 = 6.$$

She gets $6 in change. Without the parentheses, $50 - 3 \times 12 + 2 \times 4 = 50 - 36 + 8 = 22$, which subtracts the shirts but *adds* the socks, a meaningless result.

## Common mistakes

- *Multiplying before dividing (or adding before subtracting) regardless of position.* They're paired; go left to right.
- *Treating an exponent as multiplication:* $2^4 = 16$, not 8.
- *Applying an exponent to the wrong thing.* In $2 \times 6^2$ only the 6 is squared: $2 \times 36 = 72$, not $12^2 = 144$.
- *Ignoring a fraction bar's grouping*, especially on a calculator.
- *Working outside parentheses before finishing inside them.*

## Key points

- An exponent counts how many times the base is used as a factor: $b^n = b \times b \times \cdots \times b$ ($n$ factors).
- Order: grouping, exponents, multiplication/division left to right, addition/subtraction left to right.
- PEMDAS is a memory aid; M and D share a rank, as do A and S.
- Fraction bars and brackets group just like parentheses; work from the inside out.
- When translating a story, add parentheses wherever a whole quantity is being used.
