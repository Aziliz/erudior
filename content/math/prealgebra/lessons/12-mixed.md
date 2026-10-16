---
id: pre-mixed
module: pre-m3
title: Mixed numbers
minutes: 25
topics: [Mixed numbers]
drills: [pre-mixed-to-improper, pre-mixed-add, pre-mixed-mul]
refs: [pre-ref-arithmetic]
---
## Whole and part together

Recipes, lumber and stopwatches rarely give amounts like $\tfrac{11}{4}$. They say $2\tfrac34$ cups, $5\tfrac12$ feet, $1\tfrac14$ hours. These are **mixed numbers**: a whole number together with a proper fraction. This lesson connects mixed numbers to the improper fractions from Lesson 9 and shows how to do all four operations with them, which pulls together everything in this module.

## What a mixed number means

$2\tfrac34$ means $2 + \tfrac34$. The plus sign is understood, not written. (Don't confuse this with multiplication: $2\tfrac34$ is not $2 \times \tfrac34$.)

```numberline
{"x": [0, 4], "points": [{"at": [2.75, 0], "label": "2 3/4 = 11/4"}], "caption": "2 3/4 lies three quarters of the way from 2 to 3"}
```

## Converting between forms

*Mixed number to improper fraction.* Each whole is $\tfrac44$ here, so 2 wholes are $\tfrac84$, and $\tfrac84 + \tfrac34 = \tfrac{11}{4}$. The shortcut: multiply the whole number by the denominator, add the numerator, and keep the denominator.

$$a\frac{b}{c} = \frac{a \times c + b}{c} \qquad\text{so}\qquad 2\frac34 = \frac{2 \times 4 + 3}{4} = \frac{11}{4}.$$

*Improper fraction to mixed number.* Divide the numerator by the denominator. The quotient is the whole number and the remainder is the new numerator, over the same denominator.

$$\frac{23}{5}:\quad 23 \div 5 = 4 \text{ R } 3, \qquad\text{so}\qquad \frac{23}{5} = 4\frac35.$$

That's just the division check from Lesson 2 in reverse: $23 = 4 \times 5 + 3$.

### Example 1

Write $\dfrac{58}{8}$ as a mixed number in simplest form.

$58 \div 8 = 7$ R 2, so $\dfrac{58}{8} = 7\dfrac28 = 7\dfrac14$. (You could also simplify first: $\tfrac{58}{8} = \tfrac{29}{4}$, and $29 \div 4 = 7$ R 1.)

## Multiplying and dividing mixed numbers

Always *convert to improper fractions first*, then multiply or divide as in Lesson 10. Multiplying the whole parts and the fraction parts separately does not work: $2\tfrac12 \times 2\tfrac12$ is not $4\tfrac14$.

### Example 2

Multiply $2\dfrac{1}{2} \times 3\dfrac{1}{5}$.

Convert: $\dfrac52 \times \dfrac{16}{5}$. Cancel the 5s, and cancel 2 into 16 (leaving 1 and 8): $\dfrac{1}{1} \times \dfrac{8}{1} = 8$.

Estimate check: about $2.5 \times 3 = 7.5$, so 8 is reasonable.

### Example 3

A ribbon $10\tfrac12$ feet long is cut into pieces $1\tfrac34$ feet long. How many pieces are there?

$10\tfrac12 \div 1\tfrac34 = \dfrac{21}{2} \div \dfrac{7}{4} = \dfrac{21}{2} \times \dfrac{4}{7}$. Cancel 21 with 7 (leaving 3 and 1) and 4 with 2 (leaving 2 and 1): $\dfrac{3 \times 2}{1 \times 1} = 6$ pieces.

## Adding and subtracting mixed numbers

You have two good methods.

*Method A: whole parts and fraction parts separately.* Add the wholes, add the fractions (with a common denominator), then tidy up if the fraction part is improper.

### Example 4

Add $3\dfrac{2}{3} + 4\dfrac{3}{4}$.

Wholes: $3 + 4 = 7$. Fractions: $\tfrac23 + \tfrac34 = \tfrac8{12} + \tfrac9{12} = \tfrac{17}{12} = 1\tfrac5{12}$. Combine: $7 + 1\tfrac{5}{12} = 8\tfrac5{12}$.

*Method B: convert to improper fractions.* $\tfrac{11}{3} + \tfrac{19}{4} = \tfrac{44}{12} + \tfrac{57}{12} = \tfrac{101}{12} = 8\tfrac5{12}$. Same answer. Method A keeps the numbers smaller; Method B never needs regrouping.

### Subtracting with regrouping

Sometimes the fraction you're subtracting is bigger than the one you're subtracting from. Then borrow 1 from the whole number, just as you borrow 10 in whole-number subtraction.

### Example 5

Subtract $6\dfrac{1}{4} - 2\dfrac{5}{6}$.

Common denominator 12: $6\tfrac{3}{12} - 2\tfrac{10}{12}$. You can't take $\tfrac{10}{12}$ from $\tfrac3{12}$, so borrow 1 from the 6: $6\tfrac3{12} = 5 + 1 + \tfrac{3}{12} = 5\tfrac{15}{12}$. Now $5\tfrac{15}{12} - 2\tfrac{10}{12} = 3\tfrac{5}{12}$.

Check with Method B: $\tfrac{25}{4} - \tfrac{17}{6} = \tfrac{75}{12} - \tfrac{34}{12} = \tfrac{41}{12} = 3\tfrac5{12}$. ✓

## Negative mixed numbers

$-2\tfrac13$ means $-(2 + \tfrac13) = -\tfrac73$, *not* $-2 + \tfrac13$. The negative sign applies to the whole mixed number. When working with negatives, converting to improper fractions is the safest route.

### Example 6

Compute $1\tfrac12 - 3\tfrac34$.

Improper: $\tfrac32 - \tfrac{15}{4} = \tfrac64 - \tfrac{15}{4} = -\tfrac94 = -2\tfrac14$.

## Estimating with mixed numbers

Round each mixed number to the nearest whole number to check an answer: a fraction part of $\tfrac12$ or more rounds up. For $3\tfrac{2}{3} + 4\tfrac{3}{4}$, estimate $4 + 5 = 9$; the exact answer $8\tfrac{5}{12}$ is close. For $2\tfrac12 \times 3\tfrac15$, estimate $3 \times 3 = 9$ (or more carefully $2.5 \times 3 = 7.5$); the exact answer 8 is reasonable. An estimate is especially useful with mixed numbers because the most common error, multiplying the whole parts and fraction parts separately, often gives an answer that is far too small.

### Example 7

A recipe uses $2\tfrac{2}{3}$ cups of broth, and you want to make one quarter of it. How much broth do you need?

$2\tfrac23 \div 4 = \tfrac{8}{3} \times \tfrac14 = \tfrac{8}{12} = \tfrac23$ cup. Estimate: about 3 cups split four ways is a bit under 1 cup, so $\tfrac23$ cup fits.

## Common mistakes

- *Multiplying parts separately:* $2\tfrac12 \times 3\tfrac15 \ne 6\tfrac1{10}$. Convert first; the answer is 8.
- *Converting wrongly:* $3\tfrac25$ is $\tfrac{17}{5}$ (3 × 5 + 2), not $\tfrac{6}{5}$ or $\tfrac{3 \times 2 + 5}{5}$.
- *Borrowing 10 instead of 1 whole.* When regrouping $6\tfrac{3}{12}$, the borrowed 1 is $\tfrac{12}{12}$, giving $5\tfrac{15}{12}$.
- *Leaving an improper fraction in a mixed number,* like $7\tfrac{17}{12}$. Carry the extra whole: $8\tfrac5{12}$.
- *Misreading $-2\tfrac13$* as $-2 + \tfrac13$.

## Key points

- $a\tfrac bc = a + \tfrac bc = \dfrac{ac + b}{c}$.
- Improper to mixed: divide; quotient is the whole part, remainder over the denominator is the fraction part.
- Multiply and divide mixed numbers by converting to improper fractions first.
- Add and subtract either part by part (regroup when needed) or by converting to improper fractions.
- A negative sign in front of a mixed number applies to the whole thing.
