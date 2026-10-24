---
id: pc-sequences
module: pc-m9
title: Sequences, sigma notation and arithmetic series
minutes: 30
topics: [Sequences and series, Arithmetic sequences]
drills: [pc-arith-nth, pc-arith-sum, pc-sigma]
refs: [pc-ref-matrices-series]
---
## Functions on the counting numbers

A savings plan adds a fixed deposit each month; a ball bounces to 60% of its previous height each time; seats in a theater increase by two per row. Each of these is a list of numbers produced by a rule. This module studies such lists (sequences), their sums (series), a method for proving formulas about them (induction), and then counting and probability, which use the same whole-number thinking. Sums of sequences are also the starting point for integrals in calculus.

## Sequences

A **sequence** is a function whose domain is the positive integers (or another set of consecutive integers, such as $0, 1, 2, \dots$ when the counting starts at 0). Instead of $f(n)$ we write $a_n$, the $n$th **term**: $a_1, a_2, a_3, \dots$. A sequence can be given two ways.

- An **explicit formula** gives $a_n$ directly from $n$. Example: $a_n = \dfrac{(-1)^n}{n + 1}$ gives $-\frac12, \frac13, -\frac14, \frac15, \dots$. The factor $(-1)^n$ makes the signs alternate.
- A **recursive formula** gives a starting term and a rule for getting each term from earlier ones. Example: $a_1 = 3$, $a_{n+1} = 2a_n - 1$ gives $3, 5, 9, 17, 33, \dots$. The famous **Fibonacci sequence** is $F_1 = F_2 = 1$, $F_{n} = F_{n-1} + F_{n-2}$: $1, 1, 2, 3, 5, 8, 13, \dots$

Recursive formulas are natural (each step depends on the last) but slow for distant terms: to get $a_{100}$ you need all 99 before it. Explicit formulas jump straight there.

**Factorial** notation appears often: $n! = n(n - 1)(n - 2)\cdots 2 \cdot 1$, with $0! = 1$. So $5! = 120$. Factorials grow faster than any exponential, and they simplify nicely in quotients: $\dfrac{8!}{6!} = 8 \cdot 7 = 56$.

## Series and sigma notation

A **series** is the sum of the terms of a sequence. **Sigma notation** writes sums compactly:

$$\sum_{k=1}^{n} a_k = a_1 + a_2 + \dots + a_n.$$

The **index of summation** $k$ starts at the lower limit and increases by 1 up to the upper limit. The letter used for the index doesn't matter.

The picture names each part of a sigma expression.

![The sum from k = 1 to 5 of (2k − 1), with its parts labeled: the summation sign means add up, the 5 on top is the upper limit (the last value of k), the k = 1 below gives the index k and the lower limit (the first value of k), and (2k − 1) is the term formula. The sum is 1 + 3 + 5 + 7 + 9 = 25.](images/pc-m9-sigma-parts.svg)

### Example 1

Evaluate $\displaystyle\sum_{k=1}^{5}(2k - 1)$ and $\displaystyle\sum_{j=0}^{3} 2^j$.

- $k = 1, \dots, 5$: $1 + 3 + 5 + 7 + 9 = 25$.
- $j = 0, \dots, 3$: $1 + 2 + 4 + 8 = 15$. (Starting at $0$ gives four terms.)

Sums can be split and scaled, because addition is associative and multiplication distributes:

$$\sum (a_k + b_k) = \sum a_k + \sum b_k, \qquad \sum c\,a_k = c\sum a_k, \qquad \sum_{k=1}^{n} c = cn.$$

Together with a few known sums, such as $\displaystyle\sum_{k=1}^{n} k = \frac{n(n + 1)}{2}$ and $\displaystyle\sum_{k=1}^{n} k^2 = \frac{n(n + 1)(2n + 1)}{6}$, these let you evaluate many sums without adding term by term. (Lesson 38 shows how to prove formulas like these.)

## Arithmetic sequences

An **arithmetic sequence** adds the same number, the **common difference** $d$, each time: $a_{n+1} = a_n + d$. Starting from $a_1$, after $n - 1$ steps,

$$a_n = a_1 + (n - 1)d.$$

This is a linear function of $n$: plotted, the terms lie on a line with slope $d$.

```plot
{"x": [0, 9], "y": [0, 40], "xLabel": "n", "yLabel": "aₙ", "points": [[1, 7], [2, 11], [3, 15], [4, 19], [5, 23], [6, 27], [7, 31], [8, 35]], "functions": [{"f": "4x + 3", "dashed": true}], "caption": "The arithmetic sequence 7, 11, 15, … lies on the line y = 4x + 3."}
```

### Example 2

For $7, 11, 15, 19, \dots$, find $a_{20}$.

$a_1 = 7$, $d = 4$: $a_{20} = 7 + 19 \cdot 4 = 83$. Note the 19, not 20: you take one fewer step than the term number.

### Example 3

An arithmetic sequence has $a_5 = 17$ and $a_{12} = 45$. Find $a_1$ and $d$.

From the 5th to the 12th term is 7 steps: $7d = 45 - 17 = 28$, so $d = 4$. Then $a_1 = a_5 - 4d = 17 - 16 = 1$.

## Arithmetic series

To add $1 + 2 + \dots + 100$, the young Gauss reportedly paired the first and last terms, the second and second-to-last, and so on: each pair sums to 101, and there are 50 pairs, so the total is 5050. The same trick works for any arithmetic series. Write the sum forward and backward:

$$\begin{aligned} S_n &= a_1 + (a_1 + d) + \dots + a_n \\ S_n &= a_n + (a_n - d) + \dots + a_1 \end{aligned}$$

Adding column by column gives $n$ copies of $a_1 + a_n$, so $2S_n = n(a_1 + a_n)$ and

$$S_n = \frac{n(a_1 + a_n)}{2}.$$

In words: the number of terms times the average of the first and last terms.

The same pairing has a picture. Stack $1 + 2 + 3 + 4 + 5$ as a staircase of squares, then fit a second, upside-down copy on top: together they fill a rectangle 5 wide and 6 tall.

```shape
{"polygons": [{"points": [[0, 0], [5, 0], [5, 5], [4, 5], [4, 4], [3, 4], [3, 3], [2, 3], [2, 2], [1, 2], [1, 1], [0, 1]], "fill": true}, {"points": [[0, 1], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [3, 4], [4, 4], [4, 5], [5, 5], [5, 6], [0, 6]]}], "segments": [{"from": [0, -0.4], "to": [5, -0.4], "label": "5"}, {"from": [5.4, 0], "to": [5.4, 6], "label": "6"}], "caption": "Two copies of 1 + 2 + 3 + 4 + 5 fill a 5 × 6 rectangle, so the sum is 30 ÷ 2 = 15."}
```

### Example 4

Find the sum of the first 20 terms of $7, 11, 15, \dots$

$a_{20} = 83$ (Example 2), so $S_{20} = \dfrac{20(7 + 83)}{2} = 900$.

### Example 5

Evaluate $\displaystyle\sum_{k=1}^{40}(3k + 2)$.

Two ways. As an arithmetic series: $a_1 = 5$, $a_{40} = 122$, so $S = \dfrac{40(5 + 122)}{2} = 2540$. Or with properties: $3\sum k + \sum 2 = 3 \cdot \dfrac{40 \cdot 41}{2} + 80 = 2460 + 80 = 2540$.

### Example 6

A theater has 20 rows. The first row has 15 seats and each row has 2 more than the one in front. How many seats are there?

$a_{20} = 15 + 19 \cdot 2 = 53$, and $S_{20} = \dfrac{20(15 + 53)}{2} = 680$ seats.

## Common mistakes

- *Using $n$ instead of $n - 1$* in $a_n = a_1 + (n - 1)d$.
- *Miscounting terms* when the index starts at 0 or the sum runs from $k = 3$ to $k = 10$ (that's 8 terms).
- *Distributing a sum over a product.* $\sum a_kb_k \ne \left(\sum a_k\right)\left(\sum b_k\right)$.
- *Forgetting the $n$* when summing a constant: $\sum_{k=1}^{n} 5 = 5n$, not 5.
- *Treating $0!$ as 0.* By definition $0! = 1$.

## Key points

- A sequence is a function on the positive integers; it can be explicit or recursive.
- $\sum_{k=1}^{n} a_k$ adds the terms; sums split over addition and constants factor out.
- Arithmetic: $a_n = a_1 + (n - 1)d$.
- Arithmetic series: $S_n = \frac{n(a_1 + a_n)}{2}$.
- $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$.
