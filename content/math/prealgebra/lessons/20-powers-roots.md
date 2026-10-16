---
id: pre-powers-roots
module: pre-m6
title: Powers and square roots
minutes: 25
topics: [Powers, Square roots]
drills: [pre-power-eval, pre-sqrt-estimate]
refs: [pre-ref-algebra]
---
## Back to exponents

You met exponents in Lesson 3 as shorthand for repeated multiplication. Since then you've learned to work with negative numbers, fractions and decimals, so it's time to raise all of them to powers, and to run the process backward with square roots. Square roots are needed for the Pythagorean theorem in Module 8, and powers lead to scientific notation in Lesson 22.

## Powers of any number

The definition is the same for every base: $b^n$ is $n$ factors of $b$.

- Negative bases: $(-5)^2 = 25$, $(-5)^3 = -125$. An even power of a negative is positive; an odd power is negative.
- Fractions: $\left(\tfrac23\right)^3 = \tfrac23 \times \tfrac23 \times \tfrac23 = \tfrac{8}{27}$. Raise the numerator and the denominator to the power.
- Decimals: $0.3^2 = 0.3 \times 0.3 = 0.09$ (two decimal places, as the multiplication rule says). Squaring a number between 0 and 1 makes it *smaller*.
- Powers of 10 with whole-number exponents: $10^n$ is 1 followed by $n$ zeros.

Remember the warning from Lesson 8: $-5^2 = -25$, because the exponent applies only to the 5. Parentheses make the base negative: $(-5)^2 = 25$. Likewise $\tfrac{2^3}{3}$ is $\tfrac83$, not $\tfrac{8}{27}$; the exponent applies to whatever it's attached to.

### Example 1

Evaluate $-2^4 + (-3)^3 - \left(\tfrac12\right)^2$.

- $-2^4 = -(2^4) = -16$.
- $(-3)^3 = -27$.
- $\left(\tfrac12\right)^2 = \tfrac14$.
- Combine: $-16 + (-27) - \tfrac14 = -43 - \tfrac14 = -43\tfrac14$.

## Perfect squares and square roots

A **perfect square** is the square of a whole number: 0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, … Knowing the squares from $1^2$ to $15^2$ by heart pays off constantly.

A **square root** of a number $n$ is a number that, when squared, gives $n$. Since $6^2 = 36$ and $(-6)^2 = 36$, both 6 and $-6$ are square roots of 36. The **radical sign** $\sqrt{\phantom{x}}$ means the **principal square root**, the nonnegative one:

$$\sqrt{36} = 6, \qquad -\sqrt{36} = -6.$$

The number under the radical sign is called the **radicand**.

Square roots undo squaring: for $a \ge 0$, $\sqrt{a^2} = a$ and $\left(\sqrt{a}\right)^2 = a$. The name comes from geometry: a square with area 36 has sides of length $\sqrt{36} = 6$.

```shape
{"polygons": [{"points": [[0, 0], [6, 0], [6, 6], [0, 6]]}], "labels": [{"at": [3, 3], "text": "area 36"}], "segments": [{"from": [0, 0], "to": [6, 0], "label": "side √36 = 6"}], "caption": "The side of a square is the square root of its area"}
```

Some facts:

- $\sqrt{0} = 0$ and $\sqrt{1} = 1$.
- Square roots of fractions: $\sqrt{\tfrac{9}{25}} = \tfrac35$, because $\left(\tfrac35\right)^2 = \tfrac{9}{25}$.
- Square roots of decimals: $\sqrt{0.49} = 0.7$, because $0.7^2 = 0.49$.
- *Negative numbers have no real square root.* No real number squared is negative, so $\sqrt{-16}$ is not a real number. (Note that $-\sqrt{16} = -4$ is fine; the minus sign is outside.)

A radical sign groups like parentheses: $\sqrt{9 + 16} = \sqrt{25} = 5$, which is *not* $\sqrt9 + \sqrt{16} = 7$. Simplify inside first.

## Estimating square roots

Most whole numbers aren't perfect squares, so their square roots aren't whole numbers; in fact they are endless, non-repeating decimals called **irrational numbers**. You can still pin them down between two whole numbers.

### Example 2

Between which two consecutive whole numbers is $\sqrt{58}$? Estimate it to one decimal place.

The perfect squares on either side of 58 are 49 and 64, so $7 < \sqrt{58} < 8$. Since 58 is a bit closer to 64 than to 49 (6 away vs 9 away), the root is a bit more than 7.5. Try $7.6^2 = 57.76$ and $7.7^2 = 59.29$. So $\sqrt{58}$ is between 7.6 and 7.7, and since 57.76 is much closer to 58, $\sqrt{58} \approx 7.6$. (A calculator gives 7.6158…)

```numberline
{"x": [6.5, 8.5], "points": [{"at": [7, 0], "label": "7 = √49"}, {"at": [7.6158, 0], "label": "√58"}, {"at": [8, 0], "label": "8 = √64"}], "caption": "√58 lies between 7 and 8"}
```

## Cube roots

The **cube root** $\sqrt[3]{n}$ is the number whose cube is $n$: $\sqrt[3]{64} = 4$ because $4^3 = 64$. Unlike square roots, cube roots of negative numbers are fine: $\sqrt[3]{-27} = -3$ because $(-3)^3 = -27$. The perfect cubes worth knowing are 1, 8, 27, 64, 125 and 1,000.

## Roots in the order of operations

Roots are done with exponents, after grouping symbols, and the radical sign itself acts as a grouping symbol.

### Example 3

Evaluate $3\sqrt{49} - \sqrt{100 - 36} + 2^3$.

- $\sqrt{49} = 7$, so $3\sqrt{49} = 21$.
- Inside the second radical: $100 - 36 = 64$, and $\sqrt{64} = 8$.
- $2^3 = 8$.
- Combine: $21 - 8 + 8 = 21$.

### Example 4

A square garden has an area of 200 square feet. About how long is each side?

The side is $\sqrt{200}$. Since $14^2 = 196$ and $15^2 = 225$, the side is a little over 14 feet ($\sqrt{200} \approx 14.14$).

## Common mistakes

- *Doubling instead of squaring:* $7^2 = 49$, not 14.
- *Splitting a root across addition:* $\sqrt{9 + 16} \ne 3 + 4$.
- *Thinking $\sqrt{36} = \pm 6$.* The radical means the nonnegative root, 6.
- *Taking the square root of a negative* and getting a negative: $\sqrt{-25}$ is not a real number; $-\sqrt{25} = -5$ is.
- *Expecting squares to be bigger:* $0.5^2 = 0.25$ is smaller than 0.5.

## Key points

- $b^n$ is $n$ factors of $b$, for any base: negative, fraction or decimal.
- $\sqrt{n}$ is the nonnegative number whose square is $n$; negative numbers have no real square root.
- Know the perfect squares through $15^2 = 225$ and the cubes through $5^3 = 125$.
- Estimate a square root by finding the perfect squares on either side.
- Radicals group like parentheses: simplify inside first.
