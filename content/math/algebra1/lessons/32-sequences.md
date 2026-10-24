---
id: a1-sequences
module: a1-m7
title: Arithmetic and geometric sequences
minutes: 30
topics: [Sequences]
drills: [a1-d-arith-nth, a1-d-geom-nth, a1-d-arith-two-terms]
refs: [a1-ref-data]
---
A list of numbers that follows a pattern, like the seat counts in the rows of a theater or the heights of a bouncing ball, is a sequence. This lesson treats sequences as functions whose inputs are the positions 1, 2, 3, …, and studies the two most important kinds. Arithmetic sequences add the same amount each time and turn out to be linear functions; geometric sequences multiply by the same amount and turn out to be exponential functions. So this lesson ties together everything in the last two lessons.

## Sequences as functions

A **sequence** is an ordered list of numbers. Each number in it is a **term of the sequence**. We write $a_1$ for the first term, $a_2$ for the second, and $a_n$ for the $n$th term (read "a sub n"). The little $n$ is the term's position.

A sequence is really a function: the input is the position $n$ and the output is the term $a_n$. The notation $a_n$ means the same thing as $a(n)$ or $f(n)$. The domain is the positive integers $1, 2, 3, \dots$ (sometimes starting at 0), so a sequence's graph is a set of separate points, not a connected curve.

There are two ways to describe a sequence with a formula:

- An **explicit formula** gives $a_n$ directly from $n$, like $a_n = 4n + 3$. To get the 50th term, substitute $n = 50$.
- A **recursive formula** gives the first term and a rule for getting each term from the one before it, like $a_1 = 7$, $a_n = a_{n-1} + 4$. To get the 50th term you must walk through the 49 before it, but the rule often matches how the situation is described.

## Arithmetic sequences

An **arithmetic sequence** adds the same number each time. That number is the **common difference** $d$:

$$7, 11, 15, 19, 23, \dots \qquad d = 4.$$

To reach $a_n$ from $a_1$ you take $n - 1$ steps of size $d$ (the 2nd term is one step past the first, the 3rd is two steps, and so on). That gives the formulas:

$$\text{explicit: } a_n = a_1 + (n - 1)d, \qquad \text{recursive: } a_1 \text{ given},\ a_n = a_{n-1} + d.$$

Expanding the explicit formula, $a_n = dn + (a_1 - d)$, which is a linear function of $n$ with slope $d$. An arithmetic sequence is a linear function evaluated only at whole-number inputs, and its graph is a row of points on a line.

### Example 1

For $7, 11, 15, 19, \dots$: write the explicit formula, find $a_{50}$, and find which term equals 143.

1. $a_1 = 7$ and $d = 11 - 7 = 4$ (check: every difference is 4).
2. $a_n = 7 + (n - 1)4 = 7 + 4n - 4 = 4n + 3$.
3. $a_{50} = 4(50) + 3 = 203$.
4. Solve $4n + 3 = 143$: $4n = 140$, $n = 35$. So 143 is the 35th term. (If $n$ had come out as a fraction, 143 would not be in the sequence at all.)

```plot
{"x": [0, 6], "y": [0, 30], "functions": [{"f": "4*x + 3", "dashed": true, "label": "y = 4x + 3"}], "points": [{"at": [1, 7], "label": "a₁ = 7"}, [2, 11], [3, 15], [4, 19], {"at": [5, 23], "label": "a₅ = 23"}], "xLabel": "n", "yLabel": "aₙ", "caption": "An arithmetic sequence: separate points that lie on a line of slope d = 4"}
```

### Example 2

In an arithmetic sequence, $a_4 = 17$ and $a_{10} = 41$. Find $d$, $a_1$ and the explicit formula.

1. From term 4 to term 10 is $10 - 4 = 6$ steps, and the value rises $41 - 17 = 24$.
2. $d = \dfrac{24}{6} = 4$. (This is the slope between the points $(4, 17)$ and $(10, 41)$.)
3. Back up 3 steps from $a_4$: $a_1 = 17 - 3(4) = 5$.
4. $a_n = 5 + (n - 1)4 = 4n + 1$. Check: $a_{10} = 41$. ✓

## Geometric sequences

A **geometric sequence** multiplies by the same number each time. That number is the **common ratio** $r$, found by dividing any term by the one before it:

$$3, 6, 12, 24, 48, \dots \qquad r = 2.$$

Again $a_n$ is $n - 1$ steps past $a_1$, but now each step multiplies by $r$:

$$\text{explicit: } a_n = a_1 \cdot r^{\,n-1}, \qquad \text{recursive: } a_1 \text{ given},\ a_n = r \cdot a_{n-1}.$$

When $r > 0$, this is an exponential function of $n$. Rewriting $a_1 r^{n-1} = \dfrac{a_1}{r}\cdot r^n$ puts it in the form $a \cdot b^x$ with $b = r$. For $3, 6, 12, \dots$, $a_n = 3 \cdot 2^{n-1} = 1.5 \cdot 2^n$; the 1.5 is the "term 0" you'd get by stepping back once.

If $r > 1$ the terms grow; if $0 < r < 1$ they shrink toward 0. A negative ratio makes the signs alternate: $5, -10, 20, -40, \dots$ has $r = -2$.

### Example 3

Find the explicit formula and $a_{10}$ for $3, 6, 12, 24, \dots$, and the explicit formula for $80, 20, 5, 1.25, \dots$.

1. First sequence: $r = \tfrac63 = 2$, so $a_n = 3 \cdot 2^{n-1}$ and $a_{10} = 3 \cdot 2^9 = 3 \cdot 512 = 1536$.
2. Second sequence: $r = \tfrac{20}{80} = \tfrac14$ (check: $\tfrac{5}{20} = \tfrac14$). So $a_n = 80\left(\tfrac14\right)^{n-1}$.

Graphed, the first sequence is a set of separate points that sit on an exponential curve, just as an arithmetic sequence's points sit on a line:

```plot
{"x": [0, 6], "y": [0, 60], "functions": [{"f": "1.5*2^x", "dashed": true, "label": "y = 1.5 · 2^x"}], "points": [{"at": [1, 3], "color": "var(--fig-0)"}, {"at": [2, 6], "color": "var(--fig-0)"}, {"at": [3, 12], "color": "var(--fig-0)"}, {"at": [4, 24], "color": "var(--fig-0)"}, {"at": [5, 48], "color": "var(--fig-0)"}], "labels": [{"at": [0.75, 9], "text": "a₁ = 3"}, {"at": [4.15, 50], "text": "a₅ = 48"}], "xLabel": "n", "yLabel": "aₙ", "caption": "A geometric sequence with r = 2: separate points on an exponential curve"}
```

### Example 4

A ball is dropped from 10 feet. Each bounce reaches 60% of the height of the previous one. How high does it rise after the 4th bounce?

![A ball dropped from 10 feet bounces along the ground. The first bounce reaches a₁ = 6 feet, the second a₂ = 3.6 feet, the third a₃ = 2.16 feet, and the fourth is smaller still. Each bounce is 60% as high as the one before.](images/a1-m7-bouncing-ball.svg)

Notice in the picture that the 10-foot drop is the starting height, not a bounce, so it is not one of the terms.

1. The first bounce reaches $0.6 \times 10 = 6$ feet, so $a_1 = 6$ and $r = 0.6$.
2. Recursive: $a_1 = 6$, $a_n = 0.6\,a_{n-1}$. Explicit: $a_n = 6(0.6)^{n-1}$.
3. $a_4 = 6(0.6)^3 = 6(0.216) = 1.296$ feet, about 1.3 feet.
4. Walking through the recursion gives the same thing: $6, 3.6, 2.16, 1.296$.

## Which kind is it?

| Test | Arithmetic | Geometric |
|---|---|---|
| Consecutive terms | constant difference $d$ | constant ratio $r$ |
| Explicit | $a_1 + (n - 1)d$ | $a_1 r^{n-1}$ |
| Recursive | $a_n = a_{n-1} + d$ | $a_n = r\,a_{n-1}$ |
| Function type | linear | exponential |

Some sequences are neither. The squares $1, 4, 9, 16, \dots$ have differences $3, 5, 7$ and ratios $4, 2.25, 1.78$, neither constant; their explicit formula is $a_n = n^2$. The Fibonacci sequence $1, 1, 2, 3, 5, 8, \dots$ has a recursive rule that uses *two* earlier terms: $a_n = a_{n-1} + a_{n-2}$.

## Common mistakes

- Using $a_1 + nd$ instead of $a_1 + (n - 1)d$. The first term has taken zero steps.
- Computing $a_1 r^{n-1}$ as $(a_1 r)^{n-1}$. The exponent applies to $r$ only.
- Finding $d$ by subtracting in the wrong order, giving the wrong sign. Use later term minus earlier term.
- Dividing $a_{10} - a_4$ by 10 or by 4 instead of by the number of steps, 6.
- Giving a recursive formula without the starting term. $a_n = a_{n-1} + 4$ alone describes every sequence with difference 4.

## Key points

- A sequence is a function on positions $n = 1, 2, 3, \dots$; $a_n$ is the $n$th term.
- Arithmetic: $a_n = a_1 + (n - 1)d$, a linear function of $n$ with slope $d$.
- Geometric: $a_n = a_1 r^{n-1}$, an exponential function of $n$ with base $r$ (when $r > 0$).
- A recursive formula needs a starting term and a rule from each term to the next.
