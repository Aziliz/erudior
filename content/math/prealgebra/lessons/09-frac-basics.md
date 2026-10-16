---
id: pre-frac-basics
module: pre-m3
title: Fractions, equivalent fractions and simplifying
minutes: 25
topics: [Fraction basics, Equivalent fractions]
drills: [pre-frac-simplify, pre-frac-missing]
refs: [pre-ref-arithmetic]
---
## Parts of a whole

Whole numbers and integers count whole things. But you often need part of something: half a pizza, three quarters of an hour, two thirds of the class. Fractions describe these parts, and they are also another way to write division. This lesson covers what a fraction means, how the same amount can be written as many different fractions, and how to write a fraction in simplest form, which uses the GCF from Module 1.

## What a fraction means

A **fraction** $\dfrac{a}{b}$ has a **numerator** $a$ on top and a **denominator** $b$ on the bottom ($b \ne 0$). The denominator tells how many equal parts the whole is cut into, and the numerator tells how many of those parts you have.

```shape
{"polygons": [{"points": [[0, 0], [1, 0], [1, 1], [0, 1]], "fill": true}, {"points": [[1, 0], [2, 0], [2, 1], [1, 1]], "fill": true}, {"points": [[2, 0], [3, 0], [3, 1], [2, 1]], "fill": true}, {"points": [[3, 0], [4, 0], [4, 1], [3, 1]]}, {"points": [[4, 0], [5, 0], [5, 1], [4, 1]]}], "caption": "A bar cut into 5 equal parts with 3 shaded shows 3/5"}
```

A fraction also means division: $\dfrac{a}{b} = a \div b$. If 3 pizzas are shared equally among 5 people, each gets $3 \div 5 = \tfrac35$ of a pizza. This "fraction bar means divide" idea is why a fraction bar acts as a grouping symbol, and it's why $\dfrac{a}{1} = a$ and $\dfrac{a}{a} = 1$ (for $a \ne 0$), while $\dfrac{0}{a} = 0$ and $\dfrac{a}{0}$ is undefined.

A fraction is a single number with a place on the number line. To find $\tfrac35$, cut the segment from 0 to 1 into 5 equal pieces and count 3.

```numberline
{"x": [0, 1], "points": [{"at": [0, 0], "label": "0"}, {"at": [0.2, 0], "label": "1/5"}, {"at": [0.4, 0], "label": "2/5"}, {"at": [0.6, 0], "label": "3/5"}, {"at": [0.8, 0], "label": "4/5"}, {"at": [1, 0], "label": "1"}], "caption": "Fifths on the number line"}
```

A fraction whose numerator is smaller than its denominator, like $\tfrac35$, is a **proper fraction** and is less than 1. One whose numerator is greater than or equal to its denominator, like $\tfrac74$ or $\tfrac44$, is an **improper fraction** and is at least 1. (Improper fractions are perfectly good numbers; Lesson 12 shows how to write them as mixed numbers.)

Negative fractions follow the integer sign rules: $-\dfrac{3}{4} = \dfrac{-3}{4} = \dfrac{3}{-4}$, because a negative divided by a positive (or the reverse) is negative.

## Equivalent fractions

Cut each fifth in the bar above into 2 pieces. Now the bar has 10 pieces and 6 are shaded, but the shaded amount hasn't changed: $\tfrac35 = \tfrac{6}{10}$. Fractions that name the same number are **equivalent fractions**.

The rule: multiplying or dividing the numerator and denominator by the same nonzero number gives an equivalent fraction.

$$\frac{a}{b} = \frac{a \times c}{b \times c}$$

Why? Because $\dfrac{c}{c} = 1$, and multiplying by 1 doesn't change a number. (You'll see in Lesson 10 that multiplying fractions works this way.)

### Example 1

Find the missing number: $\dfrac{4}{9} = \dfrac{?}{63}$.

The denominator went from 9 to 63, which is multiplying by 7. Do the same to the numerator: $4 \times 7 = 28$. So $\dfrac{4}{9} = \dfrac{28}{63}$.

## Simplest form

A fraction is in **simplest form** (or **lowest terms**) when the numerator and denominator have no common factor other than 1. To **simplify** (reduce) a fraction, divide the numerator and denominator by a common factor; dividing by their GCF finishes the job in one step.

### Example 2

Simplify $\dfrac{84}{126}$.

Using prime factorizations: $84 = 2^2 \times 3 \times 7$ and $126 = 2 \times 3^2 \times 7$. The GCF is $2 \times 3 \times 7 = 42$. Divide both: $\dfrac{84 \div 42}{126 \div 42} = \dfrac{2}{3}$.

You can also simplify in stages with any common factors you spot: $\dfrac{84}{126} = \dfrac{42}{63}$ (divide by 2) $= \dfrac{14}{21}$ (by 3) $= \dfrac{2}{3}$ (by 7). Same result, more steps. Either way, check that the final numerator and denominator share no factor.

Another view of the same process is *canceling common factors*:

$$\frac{84}{126} = \frac{2 \cdot 2 \cdot 3 \cdot 7}{2 \cdot 3 \cdot 3 \cdot 7} = \frac{\cancel{2} \cdot 2 \cdot \cancel{3} \cdot \cancel{7}}{\cancel{2} \cdot \cancel{3} \cdot 3 \cdot \cancel{7}} = \frac{2}{3}$$

Each canceled pair is a factor of $\tfrac{2}{2}$, $\tfrac33$ or $\tfrac77$, which equals 1. You can only cancel *factors* (things multiplied), never terms that are added: $\dfrac{2 + 3}{2 + 5}$ is $\tfrac57$, not $\tfrac35$.

## Comparing fractions

- *Same denominator:* the larger numerator is larger. $\tfrac57 > \tfrac37$ (more of the same-size pieces).
- *Same numerator:* the smaller denominator is larger. $\tfrac38 > \tfrac3{10}$ (same number of pieces, but eighths are bigger than tenths).
- *Otherwise:* rewrite both with a common denominator, or use **cross-multiplication**: to compare $\tfrac ab$ and $\tfrac cd$ (positive denominators), compare $a \times d$ with $b \times c$.

### Example 3

Which is larger, $\tfrac58$ or $\tfrac7{11}$?

Common denominator 88: $\tfrac58 = \tfrac{55}{88}$ and $\tfrac7{11} = \tfrac{56}{88}$. Since $56 > 55$, $\tfrac7{11}$ is larger, though only just. Cross-multiplying gives the same comparison directly: $5 \times 11 = 55$ versus $8 \times 7 = 56$.

## Fractions in word problems

### Example 4

In a class of 32 students, 12 walk to school. What fraction of the class walks, in simplest form?

The fraction is part over whole: $\dfrac{12}{32}$. The GCF of 12 and 32 is 4, so it simplifies to $\dfrac38$. Three eighths of the class walks.

Note the whole goes on the bottom. "What fraction of the students *don't* walk?" would be $\dfrac{32 - 12}{32} = \dfrac{20}{32} = \dfrac58$; the two fractions add to 1, as they should.

## Common mistakes

- *Canceling across addition:* $\dfrac{x + 3}{x + 5} \ne \dfrac35$. Only common factors cancel.
- *Stopping before simplest form:* $\dfrac{18}{24} = \dfrac{9}{12}$ is equivalent but not simplified; divide by 3 again to get $\dfrac34$.
- *Changing only one part.* $\dfrac23 \ne \dfrac{2}{6}$; to get an equivalent fraction, multiply top and bottom by the same number.
- *Thinking a bigger denominator means a bigger fraction.* $\tfrac1{10} < \tfrac12$.
- *Putting the part on the bottom* in word problems. The whole is the denominator.

## Key points

- $\tfrac ab$: the denominator $b$ counts equal parts in the whole, the numerator $a$ counts parts taken; $\tfrac ab = a \div b$.
- Multiply or divide top and bottom by the same nonzero number to get an equivalent fraction.
- Simplify by dividing top and bottom by the GCF; only common factors cancel.
- Compare with a common denominator or by cross-multiplying.
