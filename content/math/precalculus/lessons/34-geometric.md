---
id: pc-geometric
module: pc-m9
title: Geometric sequences and series
minutes: 30
topics: [Geometric sequences]
drills: [pc-geo-nth, pc-geo-sum, pc-infinite-geo]
refs: [pc-ref-matrices-series]
---
## Multiplying instead of adding

An arithmetic sequence adds the same amount each step. A geometric sequence *multiplies* by the same factor each step: it's the whole-number version of the exponential functions in Module 4. Geometric sums answer questions about savings plans, loan payments, bouncing balls and drug doses, and the infinite version gives the first example of adding infinitely many numbers and getting a finite answer, an idea at the heart of calculus.

## Geometric sequences

A **geometric sequence** has a constant **common ratio** $r$ between consecutive terms: $a_{n+1} = r\,a_n$. After $n - 1$ multiplications,

$$a_n = a_1 r^{n - 1}.$$

To test whether a sequence is geometric, divide each term by the one before; the ratios must all be equal. For $3, 6, 12, 24$ the ratio is 2. For $8, -4, 2, -1$ it is $-\frac12$; a negative ratio makes the signs alternate.

### Example 1

Find the 10th term of $3, 6, 12, \dots$

$a_{10} = 3 \cdot 2^{9} = 3 \cdot 512 = 1536$.

### Example 2

A geometric sequence has $a_2 = 12$ and $a_5 = -96$. Find $r$ and $a_1$.

From term 2 to term 5 is three multiplications: $r^3 = \frac{-96}{12} = -8$, so $r = -2$. Then $a_1 = \frac{a_2}{r} = \frac{12}{-2} = -6$.

## Finite geometric series

Let $S_n = a_1 + a_1r + a_1r^2 + \dots + a_1r^{n-1}$. Multiply by $r$ and subtract; almost every term cancels:

$$\begin{aligned} S_n &= a_1 + a_1r + \dots + a_1r^{n-1} \\ rS_n &= \phantom{a_1 + {}} a_1r + \dots + a_1r^{n-1} + a_1r^n \\ S_n - rS_n &= a_1 - a_1r^n \end{aligned}$$

So, for $r \ne 1$,

$$S_n = a_1\,\frac{1 - r^n}{1 - r}.$$

(If $r = 1$, all terms equal $a_1$ and $S_n = na_1$.)

### Example 3

Find $5 + 15 + 45 + \dots$ through 8 terms.

$a_1 = 5$, $r = 3$, $n = 8$: $S_8 = 5 \cdot \dfrac{1 - 3^8}{1 - 3} = 5 \cdot \dfrac{-6560}{-2} = 16{,}400$.

### Example 4: an annuity

You deposit \$100 at the end of each month into an account earning 6% a year compounded monthly (0.5% a month). How much is there after 10 years?

The last deposit has earned nothing, the one before it has grown by a factor $1.005$, and the first has grown for 119 months. The balance is a geometric series with $a_1 = 100$, $r = 1.005$, $n = 120$:

$$100 \cdot \frac{1 - 1.005^{120}}{1 - 1.005} \approx 16{,}387.93.$$

You deposited \$12,000; the other \$4,387.93 is interest.

## Infinite geometric series

What happens to $S_n$ as $n \to \infty$? If $|r| < 1$, then $r^n \to 0$ (repeated multiplication by a number smaller than 1 in size shrinks toward 0), so

$$S = \sum_{k=1}^{\infty} a_1 r^{k - 1} = \frac{a_1}{1 - r}, \qquad |r| < 1.$$

The infinite series **converges** to this sum. If $|r| \ge 1$ (and $a_1 \ne 0$), the terms don't shrink and the series **diverges**: it has no finite sum.

```plot
{"x": [0, 11], "y": [0, 10], "xLabel": "n", "yLabel": "Sₙ", "points": [[1, 6], [2, 8], [3, 8.667], [4, 8.889], [5, 8.963], [6, 8.988], [7, 8.996], [8, 8.999], [9, 9.0], [10, 9.0]], "functions": [{"f": "9", "dashed": true, "label": "S = 9"}], "caption": "Partial sums of 6 + 2 + 2/3 + … approach 9."}
```

### Example 5

Find $\displaystyle\sum_{k=1}^{\infty} 6\left(\tfrac13\right)^{k-1} = 6 + 2 + \tfrac23 + \dots$

$a_1 = 6$, $r = \frac13$: $S = \dfrac{6}{1 - \frac13} = \dfrac{6}{2/3} = 9$. The partial sums $6, 8, 8.67, 8.89, \dots$ creep up to 9 without passing it.

### Example 6: repeating decimals

Write $0.\overline{27} = 0.272727\ldots$ as a fraction.

$0.\overline{27} = 0.27 + 0.0027 + 0.000027 + \dots$, a geometric series with $a_1 = 0.27$ and $r = 0.01$:

$$\frac{0.27}{1 - 0.01} = \frac{0.27}{0.99} = \frac{27}{99} = \frac{3}{11}.$$

Every repeating decimal is a geometric series, which is why every repeating decimal is a rational number.

### Example 7: a bouncing ball

A ball dropped from 10 m rebounds to 60% of its previous height each time. What total distance does it travel?

It falls 10 m, then goes up and down $6$ m, then $3.6$ m, and so on. Total:

$$10 + 2(6 + 3.6 + 2.16 + \dots) = 10 + 2 \cdot \frac{6}{1 - 0.6} = 10 + 30 = 40 \text{ m}.$$

### Example 8: a medicine that builds up

A patient takes 100 mg of a drug every morning. By the next morning, 40% of the drug in the body remains. Right after a dose, how much is in the body in the long run?

Right after the $n$th dose, the amount is $100 + 100(0.4) + 100(0.4)^2 + \dots + 100(0.4)^{n-1}$: today's dose, plus what's left of yesterday's, and so on. As $n$ grows this approaches

$$\frac{100}{1 - 0.4} \approx 166.7 \text{ mg}.$$

The level rises quickly at first (100, 140, 156, 162.4, …) and then levels off. Pharmacists use exactly this calculation to choose doses that settle at a safe, effective level.

## Convergence at a glance

| Ratio | Behavior of $a_1 + a_1r + a_1r^2 + \dots$ |
|---|---|
| $\lvert r \rvert < 1$ | converges to $\frac{a_1}{1 - r}$ |
| $r = 1$ | partial sums $na_1$ grow without bound: diverges |
| $r = -1$ | partial sums jump between $a_1$ and 0: diverges |
| $\lvert r \rvert > 1$ | terms grow in size: diverges |

## Common mistakes

- *Using $r^n$ instead of $r^{n-1}$* in $a_n = a_1r^{n-1}$.
- *Applying $\frac{a_1}{1 - r}$ when $|r| \ge 1$.* The series diverges; $1 + 2 + 4 + \dots$ is not $\frac{1}{1 - 2} = -1$.
- *Confusing arithmetic and geometric.* Check differences and ratios.
- *Getting $r$ from a ratio of non-consecutive terms* without taking the root: $\frac{a_5}{a_2} = r^3$.
- *Counting the bounce distances once.* Each rebound goes up and comes back down.

## Key points

- Geometric: constant ratio $r$; $a_n = a_1r^{n-1}$.
- $S_n = a_1\frac{1 - r^n}{1 - r}$ for $r \ne 1$.
- If $|r| < 1$, $\sum_{k=1}^{\infty} a_1r^{k-1} = \frac{a_1}{1 - r}$; otherwise the series diverges.
- Repeating decimals and bouncing balls are infinite geometric series.
- Regular deposits with compound interest form a finite geometric series (an annuity).
