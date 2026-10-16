---
id: alg-expressions
module: alg-m1
title: Expressions, order of operations, and like terms
minutes: 25
topics: [Expressions]
drills: [alg-d-order-ops, alg-d-evaluate-expr, alg-d-combine-like]
refs: [alg-ref-equations]
---
With the real numbers and their properties in hand, we can start writing algebra. This lesson covers the vocabulary of expressions, the agreed order for carrying out operations, how to evaluate an expression for given values, and how to simplify by combining like terms. These are the moves you will make inside every equation that follows.

## Variables, terms and expressions

A **variable** is a letter that stands for a number we either don't know yet or want to leave open, such as $x$ in $3x + 5$. A fixed number like 5 is a **constant**. An **algebraic expression** combines variables and constants with operations: $3x + 5$, $\tfrac{a + b}{2}$, $4x^2 - 7xy$.

The pieces of an expression that are added together are its **terms**. In $4x^2 - 7xy + 9$ the terms are $4x^2$, $-7xy$ and $9$. Notice the minus sign travels with the term that follows it: subtracting $7xy$ is the same as adding $-7xy$. The number in front of a variable part is its **coefficient**: here 4 and $-7$. A term with no variable, like 9, is a **constant term**.

An expression is not an equation. An expression has no equals sign; you can simplify or evaluate it, but you can't "solve" it.

## Order of operations

The expression $2 + 3 \cdot 4$ would give 20 if you worked left to right and 14 if you multiplied first. Mathematicians agreed long ago to the **order of operations**, so everyone gets 14:

1. Grouping first: parentheses, brackets, fraction bars, absolute value bars and radicals all group. Work from the innermost group outward.
2. Exponents next.
3. Multiplication and division, from left to right, as they appear.
4. Addition and subtraction, from left to right, as they appear.

The memory aid **PEMDAS** (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction) is handy, but it hides a trap: multiplication does not come before division, and addition does not come before subtraction. Each pair has equal rank and is done left to right. So $12 \div 3 \cdot 2 = 4 \cdot 2 = 8$, not $12 \div 6 = 2$.

A second trap is the exponent on a negative number. An exponent applies only to what is immediately to its left. In $-3^2$ the exponent applies to 3, and the negative sign is applied after: $-3^2 = -(3^2) = -9$. To square $-3$ you must write $(-3)^2 = 9$.

### Example 1

Evaluate $18 - 2\left[5 - (1 - 4)^2\right] \div 4$.

1. Innermost group: $1 - 4 = -3$.
2. Exponent: $(-3)^2 = 9$.
3. Finish the bracket: $5 - 9 = -4$.
4. Now $18 - 2(-4) \div 4$. Multiplication and division left to right: $2(-4) = -8$, then $-8 \div 4 = -2$.
5. Finally $18 - (-2) = 20$.

A fraction bar groups everything above it and everything below it. In $\dfrac{6 + 10}{2 \cdot 4}$, finish the numerator (16) and the denominator (8) before dividing: the value is 2.

## Evaluating expressions

To **evaluate** an expression, substitute the given value for each variable and then follow the order of operations. Always substitute in parentheses, especially for negative numbers: it keeps the signs and exponents straight.

### Example 2

Evaluate $2x^2 - 3xy + y$ when $x = -2$ and $y = 5$.

1. Substitute with parentheses: $2(-2)^2 - 3(-2)(5) + (5)$.
2. Exponent first: $(-2)^2 = 4$, so the first term is $2 \cdot 4 = 8$.
3. Second term: $-3(-2)(5) = 30$. Two negatives make a positive.
4. Add: $8 + 30 + 5 = 43$.

Without the parentheses, someone might write $2 \cdot -2^2$ and get $-8$ for the first term, which is the exponent trap again.

## Like terms and simplifying

**Like terms** have exactly the same variable part: the same letters raised to the same powers. $5x^2$ and $-2x^2$ are like terms; $5x^2$ and $5x$ are not, and neither are $3xy$ and $3x$. Constants are like terms with each other.

You combine like terms by adding their coefficients. This is just the distributive property used in reverse:

$$5x^2 - 2x^2 = (5 - 2)x^2 = 3x^2.$$

Unlike terms cannot be combined: $3x + 4y$ is already as simple as it gets, much as 3 apples plus 4 oranges can't be called 7 of anything.

To **simplify** an expression, first remove parentheses with the distributive property, then combine like terms. Pay attention to a minus sign in front of parentheses. It means "multiply by $-1$," so it changes the sign of every term inside:

$$-(2x - 7) = -2x + 7.$$

### Example 3

Simplify $4(2x - 3) - (5x - 8) + x^2$.

1. Distribute the 4: $8x - 12$.
2. Distribute the $-1$: $-5x + 8$.
3. The expression is now $8x - 12 - 5x + 8 + x^2$.
4. Combine like terms: $x$-terms $8x - 5x = 3x$; constants $-12 + 8 = -4$; the $x^2$ term has no partner.
5. Result, written with the highest power first: $x^2 + 3x - 4$.

### Example 4

Simplify $3a - 2(4a + b) + 6b$.

1. Distribute $-2$ to both terms: $-8a - 2b$.
2. Now $3a - 8a - 2b + 6b$.
3. Combine: $-5a + 4b$.

A common slip is distributing only $2$ and writing $-8a + 2b$; the negative belongs to the multiplier and must hit both terms.

## Translating words into expressions

Algebra lets you describe a quantity before you know its value. Some standard translations:

| Words | Expression |
|---|---|
| 7 more than a number | $n + 7$ |
| 7 less than a number | $n - 7$ (not $7 - n$) |
| twice a number, decreased by 3 | $2n - 3$ |
| the quotient of a number and 4 | $\tfrac{n}{4}$ |
| the square of the sum of $a$ and $b$ | $(a + b)^2$ |
| the sum of the squares of $a$ and $b$ | $a^2 + b^2$ |

"Less than" reverses the order you read it in: "5 less than $x$" starts at $x$ and takes 5 away.

## Common mistakes

- Doing multiplication before division (or addition before subtraction) regardless of position. Pairs of equal rank go left to right.
- Treating $-x^2$ as $(-x)^2$. When $x = 3$, $-x^2 = -9$.
- Forgetting to distribute a negative sign to every term in parentheses.
- Combining unlike terms, like $2x + 3x^2 = 5x^3$. The powers differ, so these don't combine.
- Substituting negative values without parentheses.

## Key points

- Terms are the parts being added; a coefficient is the number multiplying a term's variable part.
- Order of operations: grouping, exponents, multiplication and division (left to right), addition and subtraction (left to right).
- An exponent applies only to what is directly before it: $-3^2 = -9$ but $(-3)^2 = 9$.
- To evaluate, substitute in parentheses, then follow the order of operations.
- Like terms share the same variables and powers; combine them by adding coefficients (the distributive property in reverse).
