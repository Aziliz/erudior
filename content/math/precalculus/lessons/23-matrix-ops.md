---
id: pc-matrix-ops
module: pc-m6
title: Matrix operations
minutes: 30
topics: [Matrix operations]
drills: [pc-matmul-2x2, pc-mat-combo, pc-matmul-entry]
refs: [pc-ref-matrices-series]
---
## Matrices as objects

In the last lesson a matrix was bookkeeping for a system. Now we treat matrices as objects you can add, scale and multiply. The payoff comes in the next two lessons: a whole linear system becomes a single equation $AX = B$, which can be solved with an inverse matrix the way $ax = b$ is solved by dividing. Matrices also store data tables, describe transformations in computer graphics, and run the linear algebra underneath machine learning.

## Vocabulary

A matrix with $m$ rows and $n$ columns has **dimensions** $m \times n$ (rows first). The **entry** in row $i$, column $j$ of $A$ is written $a_{ij}$. A **square matrix** has as many rows as columns. Two matrices are equal when they have the same dimensions and all corresponding entries are equal.

$$A = \begin{bmatrix} 2 & -1 \\ 3 & 4 \end{bmatrix}\ (2 \times 2), \qquad C = \begin{bmatrix} 1 & 0 & 2 \\ -1 & 3 & 1 \end{bmatrix}\ (2 \times 3), \qquad c_{23} = 1.$$

## Addition and scalar multiplication

Matrices of the *same dimensions* add entry by entry. A **scalar** (a plain number) multiplies every entry. Subtraction is $A - B = A + (-1)B$.

### Example 1

With $A = \begin{bmatrix} 2 & -1 \\ 3 & 4 \end{bmatrix}$ and $B = \begin{bmatrix} 1 & 5 \\ 0 & -2 \end{bmatrix}$, find $3A - 2B$.

$$3A - 2B = \begin{bmatrix} 6 & -3 \\ 9 & 12 \end{bmatrix} - \begin{bmatrix} 2 & 10 \\ 0 & -4 \end{bmatrix} = \begin{bmatrix} 4 & -13 \\ 9 & 16 \end{bmatrix}.$$

These operations behave like ordinary arithmetic: $A + B = B + A$, $(A + B) + C = A + (B + C)$, $k(A + B) = kA + kB$. The **zero matrix** $O$ (all entries 0) plays the role of 0.

## Matrix multiplication

Multiplication is *not* entry by entry. The entry in row $i$, column $j$ of $AB$ is the **dot product** of row $i$ of $A$ with column $j$ of $B$: multiply matching entries and add.

$$(AB)_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j} + \dots + a_{in}b_{nj}.$$

For this to work, each row of $A$ must have as many entries as each column of $B$:

> $AB$ is defined only when (columns of $A$) = (rows of $B$). If $A$ is $m \times n$ and $B$ is $n \times p$, then $AB$ is $m \times p$.

Write the dimensions side by side: $(m \times \underline{n})(\underline{n} \times p)$. The inner numbers must match; the outer numbers give the size of the product.

### Why this definition?

Think of buying items. A row vector of quantities $\begin{bmatrix} 3 & 2 & 1 \end{bmatrix}$ (3 shirts, 2 hats, 1 jacket) times a column of prices $\begin{bmatrix} 12 \\ 8 \\ 5 \end{bmatrix}$ should give the total cost $3(12) + 2(8) + 1(5) = 57$. Row-times-column is exactly that. And it is what makes a system of equations a single matrix equation:

$$\begin{bmatrix} 2 & -1 \\ 3 & 4 \end{bmatrix}\begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 2x - y \\ 3x + 4y \end{bmatrix},$$

so the system $2x - y = 5$, $3x + 4y = 2$ is $AX = B$ with $X = \begin{bmatrix} x \\ y \end{bmatrix}$ and $B = \begin{bmatrix} 5 \\ 2 \end{bmatrix}$.

### Example 2

With $A$ and $B$ as in Example 1, find $AB$ and $BA$.

$$AB = \begin{bmatrix} 2(1) + (-1)(0) & 2(5) + (-1)(-2) \\ 3(1) + 4(0) & 3(5) + 4(-2) \end{bmatrix} = \begin{bmatrix} 2 & 12 \\ 3 & 7 \end{bmatrix},$$

$$BA = \begin{bmatrix} 1(2) + 5(3) & 1(-1) + 5(4) \\ 0(2) + (-2)(3) & 0(-1) + (-2)(4) \end{bmatrix} = \begin{bmatrix} 17 & 19 \\ -6 & -8 \end{bmatrix}.$$

$AB \ne BA$. Matrix multiplication is *not commutative*, so the order of factors always matters.

### Example 3

$C = \begin{bmatrix} 1 & 0 & 2 \\ -1 & 3 & 1 \end{bmatrix}$ is $2 \times 3$ and $D = \begin{bmatrix} 2 & 1 \\ 0 & -1 \\ 4 & 3 \end{bmatrix}$ is $3 \times 2$. Find $CD$ and state the size of $DC$.

$(2 \times 3)(3 \times 2)$: inner 3s match, product is $2 \times 2$.

$$CD = \begin{bmatrix} 1(2) + 0(0) + 2(4) & 1(1) + 0(-1) + 2(3) \\ -1(2) + 3(0) + 1(4) & -1(1) + 3(-1) + 1(3) \end{bmatrix} = \begin{bmatrix} 10 & 7 \\ 2 & -1 \end{bmatrix}.$$

$DC$ is $(3 \times 2)(2 \times 3)$, defined and $3 \times 3$: a different size altogether.

## Properties of multiplication

What still works: $(AB)C = A(BC)$ (associative), $A(B + C) = AB + AC$ and $(A + B)C = AC + BC$ (distributive), and $k(AB) = (kA)B$.

What fails: $AB \ne BA$ in general; and $AB = O$ does not force $A = O$ or $B = O$. For example $\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}\begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}$.

## The identity matrix

The $n \times n$ **identity matrix** $I_n$ has 1s on the main diagonal and 0s elsewhere:

$$I_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}, \qquad I_3 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}.$$

It plays the role of 1: $AI = IA = A$ for any square $A$ of the same size. (Try it: each row of $A$ dotted with a column of $I$ just picks out one entry.) The next lesson asks which matrices have a multiplicative inverse, the analog of $\frac1a$.

## Common mistakes

- *Multiplying entry by entry.* Use rows of the first times columns of the second.
- *Ignoring dimensions.* Check inner dimensions before multiplying; $(2 \times 3)(2 \times 3)$ is undefined.
- *Assuming $AB = BA$.* Keep factors in order, especially when "dividing" later.
- *Adding matrices of different sizes.* Undefined.
- *Writing dimensions as columns × rows.* It's rows × columns.

## Key points

- An $m \times n$ matrix has $m$ rows and $n$ columns; $a_{ij}$ is the row $i$, column $j$ entry.
- Add and scale entry by entry (same dimensions for addition).
- $(AB)_{ij}$ = row $i$ of $A$ dotted with column $j$ of $B$; needs inner dimensions to match; result is (outer) $m \times p$.
- Multiplication is associative and distributive but not commutative.
- $AI = IA = A$; a system can be written as $AX = B$.
