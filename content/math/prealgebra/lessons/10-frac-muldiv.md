---
id: pre-frac-muldiv
module: pre-m3
title: Multiplying and dividing fractions
minutes: 25
topics: [Multiplying fractions, Dividing fractions]
drills: [pre-frac-mul, pre-frac-div]
refs: [pre-ref-arithmetic]
---
## Why multiplication comes first

It may seem odd to multiply fractions before adding them, but multiplication is actually the simpler operation: there's no need for a common denominator. Once you've seen it, division follows almost immediately. This lesson builds both, using the simplifying skills from the last lesson.

## Multiplying fractions

*Rule:* multiply the numerators, and multiply the denominators.

$$\frac{a}{b} \times \frac{c}{d} = \frac{a \times c}{b \times d}$$

Where does this come from? "Of" means multiply, so $\tfrac23 \times \tfrac45$ means "two thirds of four fifths." Picture a square. Shade $\tfrac45$ of it with vertical strips: cut it into 5 columns and shade 4. Now take $\tfrac23$ of that shaded part: cut the square into 3 rows and keep 2. The square is now cut into $3 \times 5 = 15$ equal small rectangles, and the doubly shaded region is $2 \times 4 = 8$ of them. So $\tfrac23 \times \tfrac45 = \tfrac{8}{15}$. The denominators multiply because the cuts multiply; the numerators multiply because the kept pieces do.

```shape
{"polygons": [{"points": [[0, 1], [4, 1], [4, 3], [0, 3]], "fill": true}, {"points": [[0, 0], [5, 0], [5, 3], [0, 3]]}], "segments": [{"from": [1, 0], "to": [1, 3]}, {"from": [2, 0], "to": [2, 3]}, {"from": [3, 0], "to": [3, 3]}, {"from": [4, 0], "to": [4, 3]}, {"from": [0, 1], "to": [5, 1]}, {"from": [0, 2], "to": [5, 2]}], "caption": "2/3 of 4/5: 8 of the 15 small rectangles, so 8/15"}
```

### Simplify before you multiply

Since the answer should end up in simplest form, it saves work to cancel common factors *before* multiplying. Any numerator may cancel with any denominator, because all of them are being multiplied together.

### Example 1

Multiply $\dfrac{9}{14} \times \dfrac{35}{12}$.

Multiplying straight across gives $\tfrac{315}{168}$, which is painful to simplify. Instead, cancel first:

- 9 and 12 share a factor 3: $9 \to 3$, $12 \to 4$.
- 35 and 14 share a factor 7: $35 \to 5$, $14 \to 2$.

Now $\dfrac{3}{2} \times \dfrac{5}{4} = \dfrac{15}{8}$. Check: 15 and 8 share no factors, so this is simplest form.

### Whole numbers and signs

A whole number is a fraction over 1: $6 = \tfrac61$. So $6 \times \tfrac{5}{8} = \tfrac61 \times \tfrac58 = \tfrac{30}{8} = \tfrac{15}{4}$. Signs follow the integer rules: $-\tfrac23 \times \tfrac{9}{10} = -\tfrac{3}{5}$.

### Example 2

A recipe needs $\tfrac34$ cup of sugar. You are making $\tfrac23$ of the recipe. How much sugar do you need?

$\tfrac23$ of $\tfrac34$: $\dfrac{2}{3} \times \dfrac{3}{4}$. Cancel the 3s and cancel 2 with 4 (leaving 1 and 2): $\dfrac{1}{1} \times \dfrac{1}{2} = \dfrac12$ cup.

## Reciprocals

Two numbers whose product is 1 are **reciprocals** (also called multiplicative inverses). The reciprocal of $\tfrac ab$ is $\tfrac ba$: flip the fraction.

- The reciprocal of $\tfrac35$ is $\tfrac53$, since $\tfrac35 \times \tfrac53 = \tfrac{15}{15} = 1$.
- The reciprocal of 7 is $\tfrac17$.
- The reciprocal of $-\tfrac{2}{9}$ is $-\tfrac92$ (the sign stays; a reciprocal is not an opposite).
- Zero has no reciprocal, since nothing times 0 is 1.

## Dividing fractions

*Rule:* to divide by a fraction, multiply by its reciprocal.

$$\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c}$$

People sometimes remember this as "keep, change, flip": keep the first fraction, change ÷ to ×, flip the second.

Why does it work? Two ways to see it.

*Meaning of division.* $6 \div \tfrac12$ asks "how many halves fit in 6?" Each whole holds 2 halves, so 6 holds 12. And $6 \times 2 = 12$: dividing by $\tfrac12$ is the same as multiplying by 2, its reciprocal.

*Algebra.* Write the division as a big fraction and multiply top and bottom by $\tfrac dc$ (that's multiplying by 1):

$$\frac{\tfrac ab}{\tfrac cd} = \frac{\tfrac ab \times \tfrac dc}{\tfrac cd \times \tfrac dc} = \frac{\tfrac ab \times \tfrac dc}{1} = \frac ab \times \frac dc.$$

### Example 3

Divide $\dfrac{5}{6} \div \dfrac{10}{9}$.

Keep, change, flip: $\dfrac{5}{6} \times \dfrac{9}{10}$. Cancel 5 with 10 (leaving 1 and 2) and 9 with 6 (leaving 3 and 2): $\dfrac{1}{2} \times \dfrac{3}{2} = \dfrac34$.

Check by multiplying back: $\tfrac34 \times \tfrac{10}{9} = \tfrac{30}{36} = \tfrac56$. ✓

### Example 4

A board is 12 feet long. How many pieces $\tfrac34$ foot long can be cut from it?

$12 \div \tfrac34 = \tfrac{12}{1} \times \tfrac43 = \tfrac{48}{3} = 16$ pieces. The answer is bigger than 12, which makes sense: each piece is shorter than a foot.

### Dividing by a whole number

To divide by a whole number, multiply by its reciprocal: $\tfrac{4}{5} \div 8 = \tfrac45 \times \tfrac18 = \tfrac{4}{40} = \tfrac1{10}$. Splitting four fifths of a cake among 8 people gives each one tenth of the cake.

## Size check

Multiplying by a fraction less than 1 makes a positive number *smaller*, and dividing by such a fraction makes it *larger*. That's the opposite of what happens with whole numbers greater than 1, and it's a quick way to catch errors. If $10 \div \tfrac25$ gives you 4, something is wrong; it should be 25.

## Common mistakes

- *Flipping the wrong fraction.* Only the divisor (the second fraction) is flipped: $\tfrac23 \div \tfrac45 = \tfrac23 \times \tfrac54$, not $\tfrac32 \times \tfrac45$.
- *Looking for a common denominator* to multiply or divide. You don't need one (though it doesn't hurt to cancel first).
- *Canceling two numerators* with each other, or two denominators. Cancel only a numerator against a denominator.
- *Taking the opposite instead of the reciprocal.* The reciprocal of $\tfrac23$ is $\tfrac32$, not $-\tfrac23$.
- *Forgetting a whole number is over 1.* $3 \times \tfrac27 = \tfrac67$, not $\tfrac{6}{21}$.

## Key points

- Multiply: numerators times numerators, denominators times denominators; cancel common factors first.
- "Of" means multiply.
- The reciprocal of $\tfrac ab$ is $\tfrac ba$; a number times its reciprocal is 1; 0 has no reciprocal.
- Divide by multiplying by the reciprocal of the divisor.
- Multiplying by a proper fraction shrinks a positive number; dividing by one enlarges it.
