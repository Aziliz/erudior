---
id: alg-real-numbers
module: alg-m1
title: Real numbers and their properties
minutes: 25
topics: [Real numbers]
drills: [alg-d-fraction-arith, alg-d-abs-distance]
refs: [alg-ref-equations]
---
Algebra is arithmetic with the numbers left unspecified. Before we start replacing numbers with letters, it pays to be precise about which numbers we mean and which rules they obey, because every algebra step you will ever take is one of these rules applied to a letter instead of a digit. This lesson sorts the numbers into families, puts them on the number line, defines absolute value, and names the properties that make algebra work.

## The families of numbers

The numbers you count with, $1, 2, 3, \dots$, are the **natural numbers**. Add $0$ and you get the **whole numbers**. Add the negatives, $\dots, -3, -2, -1, 0, 1, 2, 3, \dots$, and you have the **integers**.

A **rational number** is any number you can write as a fraction $\dfrac{p}{q}$ of two integers with $q \ne 0$. Every integer is rational ($7 = \tfrac71$), and so are $-\tfrac{3}{4}$, $0.25 = \tfrac14$ and $0.\overline{3} = \tfrac13$. In decimal form, a rational number either stops (terminates) or repeats a block of digits forever. That happens because long division by $q$ can only leave the remainders $0, 1, \dots, q-1$; once a remainder comes back, the digits cycle.

An **irrational number** is a real number that cannot be written as a fraction of integers. Its decimal goes on forever without repeating. The standard examples are $\sqrt{2} \approx 1.41421$, $\sqrt{5}$, and $\pi \approx 3.14159$. The square root of any whole number that is not a perfect square is irrational.

Together, the rational and irrational numbers make up the **real numbers**, written $\mathbb{R}$. Every real number is exactly one of rational or irrational, and the sets nest like this:

| Set | Examples | Contains |
|---|---|---|
| Natural numbers | $1, 2, 3$ | — |
| Whole numbers | $0, 1, 2$ | naturals |
| Integers | $-5, 0, 12$ | wholes |
| Rational numbers | $-\tfrac{2}{3}, 0.75, 4$ | integers |
| Irrational numbers | $\sqrt{3}, \pi$ | (no overlap with rationals) |
| Real numbers | all of the above | rationals and irrationals |

### Example 1

Classify $-6$, $\tfrac{9}{3}$, $0.\overline{18}$, $\sqrt{49}$ and $\sqrt{50}$.

- $-6$ is an integer, so it is also rational and real (not whole, because it is negative).
- $\tfrac{9}{3}$ looks like a fraction, but it simplifies to $3$: a natural number, and therefore also whole, integer, rational and real. Always simplify before classifying.
- $0.\overline{18}$ repeats, so it is rational. (It equals $\tfrac{18}{99} = \tfrac{2}{11}$.)
- $\sqrt{49} = 7$ is natural.
- $\sqrt{50} = 5\sqrt{2}$ is irrational, because 50 is not a perfect square.

## The number line and order

Every real number has a spot on the **number line**: zero in the middle, positives to the right, negatives to the left. A number is greater than another exactly when it sits farther to the right. That is why $-2 > -5$ even though 5 is "bigger": $-2$ is to the right of $-5$.

```numberline
{"x": [-6, 6], "points": [{"at": [-5, 0], "label": "-5"}, {"at": [-2, 0], "label": "-2"}, {"at": [1.5, 0], "label": "1.5"}, {"at": [3.14159, 0], "label": "π"}], "caption": "Numbers further right are greater: -5 < -2 < 1.5 < π"}
```

The symbols $<$, $\le$, $>$ and $\ge$ compare numbers. The point of the symbol always faces the smaller number.

## Absolute value

The **absolute value** of a number, written $|a|$, is its distance from zero on the number line. Distances are never negative, so $|5| = 5$, $|-5| = 5$ and $|0| = 0$. As a formula,

$$|a| = \begin{cases} a & \text{if } a \ge 0 \\ -a & \text{if } a < 0 \end{cases}$$

The second line confuses people: if $a$ is negative, then $-a$ is positive. For $a = -5$, $-a = -(-5) = 5$.

Because absolute value measures distance from zero, $|a - b|$ measures the distance between $a$ and $b$. The distance from $-3$ to $4$ is $|4 - (-3)| = |7| = 7$; you can count the seven steps on the number line. Order doesn't matter: $|-3 - 4| = |-7| = 7$ too.

## Operations with signed numbers and fractions

The sign rules follow from the number line. Adding a negative moves left; subtracting a number is the same as adding its **opposite** (so $5 - (-2) = 5 + 2 = 7$). For multiplication and division, two like signs give a positive result and unlike signs give a negative one.

Fractions add only over a common denominator, because you can only add pieces of the same size:

$$\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}, \qquad \frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}, \qquad \frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \cdot \frac{d}{c}.$$

Dividing by a fraction means multiplying by its **reciprocal**, the fraction flipped upside down. The reciprocal of $\tfrac{c}{d}$ is $\tfrac{d}{c}$, and a number times its reciprocal is 1.

### Example 2

Compute $\dfrac{5}{6} - \dfrac{3}{4}$ and $-\dfrac{2}{3} \div \dfrac{8}{9}$.

1. The least common denominator of 6 and 4 is 12. Rewrite: $\tfrac{10}{12} - \tfrac{9}{12} = \tfrac{1}{12}$.
2. Division becomes multiplication by the reciprocal: $-\tfrac{2}{3} \cdot \tfrac{9}{8} = -\tfrac{18}{24}$.
3. Reduce by the common factor 6: $-\tfrac{3}{4}$. The sign is negative because the signs were unlike.

## The properties of real numbers

These are the rules that every algebraic manipulation rests on. They hold for all real numbers $a$, $b$, $c$.

| Property | Addition | Multiplication |
|---|---|---|
| **Commutative property** | $a + b = b + a$ | $ab = ba$ |
| **Associative property** | $(a + b) + c = a + (b + c)$ | $(ab)c = a(bc)$ |
| **Identity property** | $a + 0 = a$ | $a \cdot 1 = a$ |
| **Inverse property** | $a + (-a) = 0$ | $a \cdot \tfrac{1}{a} = 1$ for $a \ne 0$ |

and the one that links the two operations, the **distributive property**:

$$a(b + c) = ab + ac.$$

Commutative means order can change; associative means grouping can change. Zero is the **additive identity** and 1 is the **multiplicative identity**, because adding 0 or multiplying by 1 leaves a number unchanged. The **additive inverse** of $a$ is $-a$ and the **multiplicative inverse** of $a$ is its reciprocal $\tfrac1a$.

Why does the distributive property hold? Picture a rectangle $a$ units tall and $b + c$ units wide. Its area is $a(b + c)$, but you can also split it into an $a \times b$ piece and an $a \times c$ piece, with total area $ab + ac$. Same rectangle, same area.

```shape
{"polygons": [{"points": [[0, 0], [5, 0], [5, 2], [0, 2]]}], "segments": [{"from": [3, 0], "to": [3, 2], "dashed": true}, {"from": [0, 0], "to": [3, 0], "label": "b"}, {"from": [3, 0], "to": [5, 0], "label": "c"}, {"from": [0, 2], "to": [0, 0], "label": "a"}], "labels": [{"at": [1.5, 1], "text": "ab"}, {"at": [4, 1], "text": "ac"}], "caption": "a(b + c) = ab + ac: one rectangle, two pieces"}
```

Subtraction and division are not commutative or associative: $5 - 3 \ne 3 - 5$ and $(12 \div 6) \div 2 = 1$ while $12 \div (6 \div 2) = 4$. That is one reason we often rewrite subtraction as adding the opposite.

Finally, division by zero is **undefined**. If $\tfrac{6}{0}$ were some number $n$, then $n \cdot 0$ would have to equal 6, but anything times 0 is 0. (By contrast $\tfrac{0}{6} = 0$ is perfectly fine.)

### Example 3

Name the property used in each step of $3(x + 4) + 2x = 3x + 12 + 2x = 3x + 2x + 12 = 5x + 12$.

1. $3(x + 4) = 3x + 12$: the distributive property.
2. $12 + 2x = 2x + 12$: the commutative property of addition, to bring like terms together.
3. $3x + 2x = (3 + 2)x = 5x$: the distributive property again, used in reverse.

## Common mistakes

- Thinking a fraction is automatically "not an integer." $\tfrac{12}{4}$ is the integer 3.
- Calling every square root irrational. $\sqrt{16} = 4$ is rational; only roots of non-perfect squares are irrational.
- Writing $|-a| = a$ for every $a$. If $a$ is already negative, say $a = -3$, then $|-a| = |3| = 3 = -a$.
- Adding fractions straight across: $\tfrac12 + \tfrac13 \ne \tfrac25$.
- Distributing to only the first term: $4(x + 3) = 4x + 12$, not $4x + 3$.

## Key points

- Naturals ⊂ wholes ⊂ integers ⊂ rationals ⊂ reals; irrationals are the reals that are not rational.
- Rational decimals terminate or repeat; irrational decimals do neither.
- $|a|$ is distance from 0, and $|a - b|$ is the distance between $a$ and $b$.
- Commutative (order), associative (grouping), identity (0 and 1), inverse (opposite and reciprocal), and distributive properties justify every algebra step.
- Division by zero is undefined.
