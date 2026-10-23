---
id: la-m2-h-cost-accuracy
module: la-m2
title: 'Honors: The cost and accuracy of elimination'
minutes: 45
honors: true
topics: [Cost and accuracy of elimination]
drills: [la-m2-r2-flops, la-m2-r2-scale-time, la-m2-r2-ill-cond]
refs: [la-ref-row]
---
## From hand work to machines

By hand, row reduction is something you do to a $3 \times 3$ matrix. In practice it is done by
computers to systems with thousands or millions of unknowns: structural models of bridges,
circuit simulations, weather and climate codes, the least-squares fits behind data analysis.
Two new questions then matter as much as "what is the answer?":

1. *Cost.* How much arithmetic does elimination take, and how does that grow with the size of the system?
2. *Accuracy.* Computers round every result. Does the rounding stay small, or can it ruin the answer?

This lesson answers both for the algorithm you already know (forward phase, then back-substitution
or the backward phase). The answers explain choices that every serious linear algebra program
makes.

## Counting operations

Numerical analysts measure cost by counting **flops**: a flop is one floating-point addition,
subtraction, multiplication or division. A count like this, an **operation count**, ignores
the time spent moving numbers around in memory, so it is only a first estimate of running time,
but a very useful one.

Take an $n \times n$ system with augmented matrix $[\,A \;\; \mathbf{b}\,]$, and assume no row swaps
are needed. In the forward phase, the step that clears column $k$ works on the $n - k$ rows below
the pivot. For each of those rows it:

- computes the multiplier (entry $\div$ pivot): 1 flop;
- updates the entries in columns $k + 1$ through $n + 1$ (the right side included): $n - k + 1$ entries, each a multiply and a subtract, so $2(n - k + 1)$ flops. (The entry in column $k$ is simply set to 0.)

Write $j = n - k$ for the number of rows below the pivot. The step costs $j(2j + 3)$ flops, and
$j$ runs from $n - 1$ down to 1. Using $\sum j = \tfrac{n(n-1)}{2}$ and $\sum j^2 = \tfrac{(n-1)n(2n-1)}{6}$ for $j$ from 1 to $n - 1$,

$$\text{forward phase} = \sum_{j=1}^{n-1} j(2j + 3) = \frac{2n^3}{3} + \frac{n^2}{2} - \frac{7n}{6}\ \text{flops}.$$

Back-substitution is much cheaper. Finding $x_i$ takes $n - i$ multiplications, $n - i$
subtractions and 1 division, and adding these up for $i = 1, \dots, n$ gives exactly $n^2$ flops.
(The backward phase of row reduction, done bottom-up as in lesson 05, does the same arithmetic
and also costs about $n^2$.)

For large $n$ the cubic term dominates everything else:

> *Cost of elimination.* Solving an $n \times n$ system by Gaussian elimination and back-substitution takes about $\tfrac23 n^3$ flops. Back-substitution alone takes about $n^2$.

```plot
{"x": [0, 20], "y": [0, 6000], "functions": [{"f": "2x^3/3", "label": "forward phase ≈ (2/3)n³"}, {"f": "x^2", "label": "back-substitution = n²", "dashed": true}], "xLabel": "n (number of unknowns)", "yLabel": "flops", "caption": "The forward phase grows like n³; back-substitution like n²"}
```

The practical rule: doubling $n$ multiplies the work by about $2^3 = 8$, and multiplying $n$ by
10 multiplies it by about 1,000.

### Example 1

Count the flops to solve a $3 \times 3$ system by elimination and back-substitution, step by step.

1. Clearing column 1: two rows below the pivot. Each needs 1 division for its multiplier and updates 3 entries (columns 2, 3 and the right side) at 2 flops each: $1 + 6 = 7$ per row, 14 in all.
2. Clearing column 2: one row. 1 division plus 2 entries (column 3 and the right side) at 2 flops each: 5.
3. Forward phase: $14 + 5 = 19$. The formula agrees: $\tfrac23(27) + \tfrac12(9) - \tfrac76(3) = 18 + 4.5 - 3.5 = 19$.
4. Back-substitution: $x_3$ takes 1 division; $x_2$ takes 1 multiplication, 1 subtraction and 1 division (3 flops); $x_1$ takes 2 multiplications, 2 subtractions and 1 division (5 flops). Total $1 + 3 + 5 = 9 = 3^2$.

The whole solve costs $19 + 9 = 28$ flops. For $n = 3$ the cubic term is not yet dominant, but by
$n = 1000$ the forward phase is about 667 million flops and back-substitution only 1 million.

### Example 2

A program solves a dense $2000 \times 2000$ system in 0.4 seconds. Estimate the time for a
$6000 \times 6000$ system on the same machine.

1. The work is about $\tfrac23 n^3$, so time is roughly proportional to $n^3$.
2. The size grows by a factor of $6000/2000 = 3$, so the work grows by $3^3 = 27$.
3. Estimated time: $0.4 \times 27 = 10.8$ seconds, about 11 seconds.

This is an estimate: memory effects and parallel hardware change the constant, but the $n^3$
growth is real, and it is why huge systems that are mostly zeros (sparse systems) are solved
with special methods that avoid touching the zeros.

### Where the extra arithmetic goes

The row reduction lesson warned against clearing *above* each pivot during the forward phase.
Now we can price that habit. If at every column you scale the pivot row and clear the entries
both above and below the pivot, each of the $n$ steps updates $n - 1$ rows, and the total comes
to about $n^3$ flops, half again as much as the $\tfrac23 n^3$ of elimination followed by
back-substitution. The same reasoning says: to solve $A\mathbf{x} = \mathbf{b}$, don't compute $A^{-1}$
first (that costs about $2n^3$); just eliminate.

## Rounding and partial pivoting

Computers store numbers in **floating-point arithmetic**: a fixed number of significant digits
(about 16 decimal digits in standard double precision) times a power of the base. After every
operation the result is rounded to that many digits. The difference between the computed and
the exact value is **round-off error**. Each single rounding is tiny; the danger is a step that
*magnifies* errors made earlier.

To see it happen with small numbers, imagine a computer that keeps only 3 significant digits.

### Example 3

Solve $0.0001x + y = 1$, $x + y = 2$ with 3-digit rounding after every operation. (The exact
solution is $x = \tfrac{10000}{9999} \approx 1.0001$, $y = \tfrac{9998}{9999} \approx 0.9999$.)

*Without a swap.* The pivot is $0.0001$.

1. Multiplier: $1 \div 0.0001 = 10000$.
2. New row 2: $y$-coefficient $1 - 10000 = -9999$, which rounds to $-10000$; right side $2 - 10000 = -9998$, which also rounds to $-10000$.
3. So $y = (-10000) \div (-10000) = 1.00$.
4. Back-substitute in row 1: $0.0001x = 1 - 1.00 = 0$, so $x = 0$.

The computed $x$ is not slightly off; it is completely wrong. The tiny pivot produced a huge
multiplier, the huge numbers swamped the "2" and the "1" of row 2 (they were rounded away), and
dividing by the tiny pivot at the end blew up the leftover error.

*With a swap.* Put the larger entry of column 1 on top: $x + y = 2$, $0.0001x + y = 1$.

1. Multiplier: $0.0001 \div 1 = 0.0001$.
2. New row 2: $y$-coefficient $1 - 0.0001 = 0.9999 \to 1.00$; right side $1 - 0.0002 = 0.9998 \to 1.00$.
3. So $y = 1.00$, and $x = 2 - 1.00 = 1.00$.

Both values are correct to 3 digits. The cure was to choose the pivot well. **Partial pivoting**
does this at every step of the forward phase: among the entries of the current column, from the
pivot row down, pick the one with the largest absolute value and swap its row into the pivot
position. Then every multiplier has absolute value at most 1, so no row is ever multiplied by a
huge number.

Partial pivoting is the standard choice in numerical libraries. There are contrived matrices
for which even partial pivoting lets errors grow badly, but they almost never turn up in
practice. The error analysis behind these facts was developed largely by James H. Wilkinson
around 1960.

## When the problem itself is touchy

Pivoting protects the *algorithm*. Some *problems* are sensitive no matter how they are solved.

### Example 4

Solve $x + y = 2$, $x + 1.001y = 2.001$, and then the same system with the second right side
changed to $2.002$.

1. Original: subtract row 1 from row 2: $0.001y = 0.001$, so $y = 1$ and $x = 1$.
2. Changed: $0.001y = 0.002$, so $y = 2$ and $x = 0$.

A change of $0.001$ in one number (less than 0.05%) moved the solution from $(1, 1)$ to $(0, 2)$.
Geometrically, the two lines are nearly parallel, so sliding one of them a tiny bit moves their
crossing point a long way. The plot exaggerates the effect so you can see it (it uses $1.1$
in place of $1.001$).

```plot
{"x": [-2, 4], "y": [-1, 4], "functions": [{"f": "2 - x", "label": "x + y = 2"}, {"f": "(2.1 - x)/1.1", "label": "x + 1.1y = 2.1"}, {"f": "(2.2 - x)/1.1", "label": "x + 1.1y = 2.2", "dashed": true}], "points": [{"at": [1, 1], "label": "(1, 1)"}, {"at": [0, 2], "label": "(0, 2)"}], "caption": "Nearly parallel lines: a small shift of one line moves the crossing point far"}
```

A system like this is called **ill-conditioned**: small changes in the data cause large changes
in the solution. Data from measurements always has small errors, so an ill-conditioned system
gives an answer you cannot trust beyond a few digits, and no choice of pivots can fix that.
Notice also that $(0, 2)$ satisfies the *original* system almost perfectly (the left sides are
$2$ and $2.002$, off by only $0.001$), even though it is far from the true solution $(1, 1)$. For
an ill-conditioned system, "the equations are nearly satisfied" does not mean "the answer is
nearly right". (The singular value decomposition lesson measures this sensitivity with a
number, the condition number.)

## Common mistakes

- *Treating cost as proportional to $n$.* Elimination grows like $n^3$: a system 10 times larger takes about 1,000 times longer.
- *Computing $A^{-1}$ to solve one system.* It costs about three times as much as elimination and is usually less accurate.
- *Pivoting on the first nonzero entry.* By hand that is fine; in floating-point arithmetic a tiny pivot can destroy the answer. Use the entry of largest absolute value.
- *Blaming the algorithm for an ill-conditioned problem.* Pivoting controls the errors the algorithm makes; it cannot make a touchy problem insensitive to errors in its data.
- *Judging an answer only by how well it satisfies the equations.* For an ill-conditioned system a badly wrong answer can leave a tiny leftover.

## Key points

- A flop is one arithmetic operation. The forward phase on an $n \times n$ system costs $\tfrac23 n^3 + \tfrac12 n^2 - \tfrac76 n$ flops; back-substitution costs $n^2$.
- Work grows like $n^3$: doubling $n$ multiplies the time by about 8.
- Clearing above and below every pivot in one pass costs about $n^3$ flops, 1.5 times as much as elimination plus back-substitution.
- Floating-point arithmetic rounds every result; a tiny pivot creates huge multipliers that magnify round-off error.
- Partial pivoting swaps the largest available entry (in absolute value) into the pivot position, so every multiplier is at most 1 in size.
- An ill-conditioned system is sensitive to tiny changes in its data; that is a property of the problem, not of the method.
