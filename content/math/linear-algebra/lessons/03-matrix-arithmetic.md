---
id: la-matrix-arith
module: la-m1
title: Matrix arithmetic
minutes: 30
topics: [Matrix arithmetic]
drills: [la-mat-lin, la-mat-mult2, la-inv2]
refs: [la-ref-factor]
---
## Tables of numbers that act

The last lesson solved systems by juggling equations. Notice that the letters $x, y, z$
just went along for the ride; all the real work happened to the *coefficients*. A matrix
is a way to store those numbers in a grid and calculate with the grid directly. This
lesson covers the matrix arithmetic taught in Algebra 2 and Precalculus: adding,
scaling, multiplying, and the $2\times 2$ inverse. Later modules explain *why* the
multiplication rule is what it is; here the goal is fluency.

## Matrices, sizes and entries

A **matrix** is a rectangular array of numbers. A matrix with $m$ rows and $n$ columns has
**size** $m \times n$ ("m by n"; rows first, always). The number in row $i$, column $j$ is
the **entry** $a_{ij}$. For

$$A = \begin{bmatrix} 2 & -1 & 0 \\ 5 & 3 & 7 \end{bmatrix},$$

$A$ is $2 \times 3$, $a_{12} = -1$ and $a_{23} = 7$. A matrix with as many rows as columns
is a **square matrix**. A vector is just a matrix with one column.

## Adding and scaling

Two matrices of the *same size* are added entry by entry, and a scalar multiplies every
entry, exactly like vectors:

$$\begin{bmatrix} 1 & 2 \\ 3 & 4\end{bmatrix} + \begin{bmatrix} 0 & 5 \\ -1 & 2\end{bmatrix} = \begin{bmatrix} 1 & 7 \\ 2 & 6\end{bmatrix}, \qquad 3\begin{bmatrix} 1 & -2 \\ 0 & 4\end{bmatrix} = \begin{bmatrix} 3 & -6 \\ 0 & 12\end{bmatrix}.$$

Matrices of different sizes can't be added. The **zero matrix** (all entries 0) plays the
role of 0.

### Example 1

Let $A = \begin{bmatrix} 2 & -1 \\ 0 & 3\end{bmatrix}$ and $B = \begin{bmatrix} 1 & 4 \\ -2 & 5\end{bmatrix}$. Find $3A - 2B$.

1. $3A = \begin{bmatrix} 6 & -3 \\ 0 & 9\end{bmatrix}$ and $2B = \begin{bmatrix} 2 & 8 \\ -4 & 10\end{bmatrix}$.
2. Subtract entry by entry: $\begin{bmatrix} 6 - 2 & -3 - 8 \\ 0 - (-4) & 9 - 10\end{bmatrix} = \begin{bmatrix} 4 & -11 \\ 4 & -1\end{bmatrix}$.

The only trap is the double negative in the lower left: $0 - (-4) = 4$.

## Multiplying matrices

The **matrix product** $AB$ is *not* entry by entry. Its $(i, j)$ entry is row $i$ of $A$
"dotted" with column $j$ of $B$: multiply matching entries and add.

$$(AB)_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j} + \cdots + a_{in}b_{nj}.$$

For this to make sense, each row of $A$ must be as long as each column of $B$: the number
of *columns of A* must equal the number of *rows of B*. An $m \times n$ matrix times an
$n \times p$ matrix gives an $m \times p$ matrix. A handy check: write the sizes side by
side, $(m \times \underline{n})(\underline{n} \times p)$; the inner numbers must match and
the outer numbers give the size of the answer.

Why such an odd rule? Because it is exactly what substituting one linear system into
another does, and it's what makes $A\mathbf{x}$ reproduce the left side of a system of
equations. Module 5 builds that story; for now, trust the rule.

### Example 2

With $A$ and $B$ from Example 1, find $AB$ and $BA$.

1. $(AB)_{11}$: row 1 of $A$ is $(2, -1)$, column 1 of $B$ is $(1, -2)$. $2(1) + (-1)(-2) = 4$.
2. $(AB)_{12}$: row 1 with column 2 $(4, 5)$: $2(4) + (-1)(5) = 3$.
3. $(AB)_{21}$: row 2 $(0, 3)$ with column 1: $0 + 3(-2) = -6$.
4. $(AB)_{22}$: $0(4) + 3(5) = 15$. So $AB = \begin{bmatrix} 4 & 3 \\ -6 & 15\end{bmatrix}$.
5. The same process the other way round gives $BA = \begin{bmatrix} 2 & 11 \\ -4 & 17\end{bmatrix}$.

So $AB \ne BA$. *Matrix multiplication is not commutative*: order matters, and you must
keep track of which matrix is on the left. Sizes can make it even starker: a $2\times 3$
matrix times a $3 \times 2$ matrix is $2 \times 2$, but in the other order it's
$3 \times 3$.

Other rules of ordinary algebra do survive: $(AB)C = A(BC)$ (associative), and
$A(B + C) = AB + AC$ (distributive).

## The identity and the inverse

The **identity matrix** $I$ has 1s on the main diagonal (top left to bottom right) and 0s
elsewhere, for example $I_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1\end{bmatrix}$. It acts like
the number 1: $AI = IA = A$ for any square $A$ of the same size.

A square matrix $A$ has an **inverse** $A^{-1}$ if $AA^{-1} = A^{-1}A = I$, like
$\tfrac{1}{5}$ for 5. For a $2 \times 2$ matrix there is a formula. The number
$ad - bc$ is called the **determinant** of $\begin{bmatrix} a & b \\ c & d\end{bmatrix}$, and

$$\begin{bmatrix} a & b \\ c & d\end{bmatrix}^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a\end{bmatrix} \quad\text{when } ad - bc \ne 0.$$

In words: swap the diagonal entries, negate the off-diagonal entries, and divide by the
determinant. You can check it by multiplying: the product comes out to
$\frac{1}{ad - bc}\begin{bmatrix} ad - bc & 0 \\ 0 & ad - bc\end{bmatrix} = I$. When the
determinant is 0 there is no inverse, just as 0 has no reciprocal.

## Solving a system with an inverse

The system $4x + 3y = 5$, $x + y = 2$ is the single matrix equation

$$\begin{bmatrix} 4 & 3 \\ 1 & 1\end{bmatrix}\begin{bmatrix} x \\ y\end{bmatrix} = \begin{bmatrix} 5 \\ 2\end{bmatrix},$$

because multiplying out the left side gives $\begin{bmatrix} 4x + 3y \\ x + y\end{bmatrix}$.
Call it $A\mathbf{x} = \mathbf{b}$. If $A$ has an inverse, multiply both sides on the
left by $A^{-1}$: $\mathbf{x} = A^{-1}\mathbf{b}$.

### Example 3

Solve the system above with the inverse.

1. Determinant: $4(1) - 3(1) = 1$, so the inverse exists.
2. $A^{-1} = \dfrac{1}{1}\begin{bmatrix} 1 & -3 \\ -1 & 4\end{bmatrix}$.
3. $\mathbf{x} = A^{-1}\mathbf{b} = \begin{bmatrix} 1(5) + (-3)(2) \\ -1(5) + 4(2)\end{bmatrix} = \begin{bmatrix} -1 \\ 3\end{bmatrix}$.
4. Check: $4(-1) + 3(3) = 5$ and $-1 + 3 = 2$. ✓

## Common mistakes

- *Multiplying entry by entry.* $\begin{bmatrix} 1 & 2 \\ 3 & 4\end{bmatrix}^2$ is not $\begin{bmatrix} 1 & 4 \\ 9 & 16\end{bmatrix}$; it's $\begin{bmatrix} 7 & 10 \\ 15 & 22\end{bmatrix}$.
- *Assuming $AB = BA$.* Keep the order; $\mathbf{x} = A^{-1}\mathbf{b}$, never $\mathbf{b}A^{-1}$.
- *Mixing up the inverse formula*: swap the diagonal and negate the *off*-diagonal, not the other way round.
- *Size order.* $2 \times 3$ means 2 rows and 3 columns.

## Key points

- An $m \times n$ matrix has $m$ rows and $n$ columns; $a_{ij}$ is row $i$, column $j$.
- Add and scale entry by entry (same sizes only).
- $(AB)_{ij}$ = row $i$ of $A$ times column $j$ of $B$; needs (columns of $A$) = (rows of $B$); generally $AB \neq BA$.
- $I$ acts like 1. For $2\times 2$, $A^{-1} = \frac{1}{ad-bc}\begin{bmatrix} d & -b \\ -c & a\end{bmatrix}$ when $ad - bc \neq 0$.
- A square system $A\mathbf{x} = \mathbf{b}$ with invertible $A$ has the unique solution $\mathbf{x} = A^{-1}\mathbf{b}$.
