---
id: alg-arith-seq
module: alg-m10
title: Arithmetic sequences and series
minutes: 30
topics: [Arithmetic sequences]
drills: [alg-d-arith-nth, alg-d-arith-sum, alg-d-arith-find]
refs: [alg-ref-explog]
---
A sequence is an ordered list of numbers, and many come from a simple rule repeated over and over. When the rule is "add the same number each time," you get an arithmetic sequence, the discrete cousin of a linear function. This lesson introduces sequence notation, finds formulas for any term of an arithmetic sequence, and derives a formula for adding up its terms.

## Sequences and notation

A **sequence** is a function whose domain is the positive integers $1, 2, 3, \dots$. Instead of $f(n)$ we usually write $a_n$ for the term in position $n$: $a_1$ is the first term, $a_2$ the second, and so on.

A sequence can be given by an **explicit formula**, which computes $a_n$ directly from $n$, such as $a_n = 3n + 2$ (giving $5, 8, 11, 14, \dots$), or by a **recursive formula**, which gives the first term and a rule for getting each term from the previous one, such as $a_1 = 5$, $a_n = a_{n-1} + 3$.

### Example 1

Write the first four terms of $a_n = n^2 - 1$ and of $b_1 = 2$, $b_n = 2b_{n-1} + 1$.

1. $a_1 = 0$, $a_2 = 3$, $a_3 = 8$, $a_4 = 15$.
2. $b_1 = 2$, $b_2 = 2(2) + 1 = 5$, $b_3 = 11$, $b_4 = 23$.

## Arithmetic sequences

An **arithmetic sequence** adds the same number, the **common difference** $d$, to get from each term to the next:

$$a_n = a_{n-1} + d.$$

Examples: $4, 7, 10, 13, \dots$ ($d = 3$) and $20, 15, 10, 5, \dots$ ($d = -5$). To check whether a sequence is arithmetic, subtract consecutive terms; the differences must all be equal.

To reach the $n$th term from the first, you add $d$ a total of $n - 1$ times, so the explicit formula is

$$a_n = a_1 + (n - 1)d.$$

Plotted as points $(n, a_n)$, an arithmetic sequence lies on a straight line with slope $d$. It is a linear function restricted to the positive integers.

```plot
{"x": [0, 9], "y": [-2, 28], "points": [{"at": [1, 4]}, {"at": [2, 7]}, {"at": [3, 10]}, {"at": [4, 13]}, {"at": [5, 16]}, {"at": [6, 19]}, {"at": [7, 22]}, {"at": [8, 25]}], "functions": [{"f": "3*x + 1", "dashed": true, "label": "y = 3x + 1"}], "xLabel": "n", "yLabel": "aₙ", "caption": "The terms of 4, 7, 10, ... lie on a line with slope d = 3"}
```

### Example 2

Find the 50th term of $4, 7, 10, 13, \dots$

$a_1 = 4$ and $d = 3$, so $a_{50} = 4 + 49(3) = 151$. The formula simplifies to $a_n = 3n + 1$.

### Example 3

An arithmetic sequence has $a_4 = 17$ and $a_{11} = 45$. Find $a_1$, $d$ and $a_{20}$.

1. From term 4 to term 11 is 7 steps: $7d = 45 - 17 = 28$, so $d = 4$.
2. $a_4 = a_1 + 3d$: $17 = a_1 + 12$, so $a_1 = 5$.
3. $a_{20} = 5 + 19(4) = 81$.

### Example 4

Which term of $100, 94, 88, \dots$ equals $-26$?

$a_n = 100 + (n - 1)(-6) = -26$, so $(n - 1)(-6) = -126$, $n - 1 = 21$ and $n = 22$. The 22nd term.

## Series and sigma notation

A **series** is the sum of the terms of a sequence. The sum of the first $n$ terms is written $S_n$. **Sigma notation** writes sums compactly:

$$\sum_{k=1}^{n} a_k = a_1 + a_2 + \cdots + a_n.$$

The index $k$ starts at the lower limit and goes up by 1 to the upper limit. For example, $\sum_{k=1}^{4} (2k + 1) = 3 + 5 + 7 + 9 = 24$.

## The sum of an arithmetic series

There's a famous trick for adding $1 + 2 + \cdots + 100$: write the sum forward and backward and add the two lines.

$$\begin{aligned} S &= 1 + 2 + \cdots + 99 + 100 \\ S &= 100 + 99 + \cdots + 2 + 1 \\ 2S &= 101 + 101 + \cdots + 101 + 101 = 100 \cdot 101 \end{aligned}$$

So $S = 5050$. The same works for any arithmetic series: pairing the first and last terms, the second and second-to-last, and so on, every pair has the same sum $a_1 + a_n$. There are $n$ terms, so

$$S_n = \frac{n(a_1 + a_n)}{2} = \frac{n}{2}\left[2a_1 + (n - 1)d\right].$$

In words: the number of terms times the average of the first and last terms. The second version is handy when you know $d$ but not $a_n$.

### Example 5

Find the sum of the first 40 terms of $3, 8, 13, \dots$

1. $a_1 = 3$, $d = 5$, $a_{40} = 3 + 39(5) = 198$.
2. $S_{40} = \dfrac{40(3 + 198)}{2} = 20 \cdot 201 = 4020$.

### Example 6

Evaluate $\displaystyle\sum_{k=1}^{25} (4k - 1)$.

1. The terms are $3, 7, 11, \dots$: arithmetic with $a_1 = 3$ and $a_{25} = 99$.
2. $S_{25} = \dfrac{25(3 + 99)}{2} = 25 \cdot 51 = 1275$.

### Example 7

A theater has 20 seats in the first row and 2 more in each row after that. With 30 rows, how many seats are there?

$a_1 = 20$, $d = 2$, $n = 30$: $S_{30} = \dfrac{30}{2}[40 + 29(2)] = 15 \cdot 98 = 1470$ seats.

## Common mistakes

- Using $a_1 + nd$ instead of $a_1 + (n - 1)d$; the first term needs no steps.
- Computing the difference backwards ($a_1 - a_2$) and getting the sign of $d$ wrong.
- Counting terms incorrectly: from term 4 to term 11 is 7 steps, not 8.
- Using the sum formula on a sequence that isn't arithmetic.
- Forgetting to divide by 2 in $S_n$.

## Key points

- A sequence lists terms $a_1, a_2, \dots$, given explicitly or recursively.
- Arithmetic: constant difference $d$; $a_n = a_1 + (n - 1)d$; the terms lie on a line of slope $d$.
- $\sum_{k=1}^{n} a_k$ means $a_1 + \cdots + a_n$.
- Arithmetic series: $S_n = \dfrac{n(a_1 + a_n)}{2} = \dfrac n2[2a_1 + (n - 1)d]$.
