---
id: la-m5-h-block-elimination
module: la-m5
title: Block elimination, Schur complements and rank-one updates
minutes: 45
honors: true
topics: [Block elimination]
drills: [la-m5-r2-block-inv, la-m5-r2-schur, la-m5-r2-sherman]
refs: [la-ref-factor]
---
The matrix operations lesson showed that partitioned matrices multiply block by block, as if
each block were a single entry, provided you keep the order of every product. This lesson
takes that idea further. Row reduction can also be done a block at a time, and doing so
produces one of the most useful matrices in applied linear algebra, the Schur complement. We
start with a different way to read a matrix product, as a sum of simple pieces, and finish
with a formula that updates an inverse cheaply when one of those simple pieces is added to a
matrix.

## Products as sums of column–row pieces

The row–column rule builds $AB$ one entry at a time. Cut $A$ into columns and $B$ into rows
instead: $A = [\,\mathbf{a}_1 \;\cdots\; \mathbf{a}_n\,]$ is $1 \times n$ in blocks and $B$, with
rows $\mathbf{b}_1^T, \dots, \mathbf{b}_n^T$, is $n \times 1$ in blocks. The block rule then gives the
**column–row expansion**

$$AB = \mathbf{a}_1\mathbf{b}_1^T + \mathbf{a}_2\mathbf{b}_2^T + \cdots + \mathbf{a}_n\mathbf{b}_n^T.$$

Each term $\mathbf{u}\mathbf{v}^T$ (a column times a row) is an **outer product**: an
$m \times p$ matrix whose $(i, j)$ entry is $u_iv_j$. Every column of $\mathbf{u}\mathbf{v}^T$
is a multiple of $\mathbf{u}$ and every row is a multiple of $\mathbf{v}^T$, so a nonzero outer
product is the simplest kind of matrix there is; in Module 7's language it has rank 1. (Compare
the inner product $\mathbf{v}^T\mathbf{u}$, a $1 \times 1$ number, which needs $\mathbf{u}$ and
$\mathbf{v}$ to be the same length.)

### Example 1

Compute $AB$ for $A = \begin{bmatrix} 1 & 2 \\ 3 & -1\end{bmatrix}$ and $B = \begin{bmatrix} 2 & 0 & 1 \\ 1 & 4 & -2\end{bmatrix}$ as a sum of outer products.

1. Column 1 of $A$ times row 1 of $B$: $\begin{bmatrix} 1 \\ 3\end{bmatrix}\begin{bmatrix} 2 & 0 & 1\end{bmatrix} = \begin{bmatrix} 2 & 0 & 1 \\ 6 & 0 & 3\end{bmatrix}$.
2. Column 2 of $A$ times row 2 of $B$: $\begin{bmatrix} 2 \\ -1\end{bmatrix}\begin{bmatrix} 1 & 4 & -2\end{bmatrix} = \begin{bmatrix} 2 & 8 & -4 \\ -1 & -4 & 2\end{bmatrix}$.
3. Add: $AB = \begin{bmatrix} 4 & 8 & -3 \\ 5 & -4 & 5\end{bmatrix}$. The row–column rule gives the same thing; for example entry $(2, 3)$ is $3(1) + (-1)(-2) = 5$. ✓

The two terms are the "pieces" of $AB$. Data compression with the SVD in Module 9 works by
keeping only the most important pieces of this kind.

## Block triangular matrices

A $2 \times 2$ block matrix $\begin{bmatrix} A & B \\ 0 & D\end{bmatrix}$ with square diagonal
blocks $A$ and $D$ is **block upper triangular**. If $A$ and $D$ are invertible, so is the whole
matrix, and we can find its inverse by solving for the blocks. Write the unknown inverse as
$\begin{bmatrix} X & Y \\ Z & W\end{bmatrix}$ and require

$$\begin{bmatrix} A & B \\ 0 & D\end{bmatrix}\begin{bmatrix} X & Y \\ Z & W\end{bmatrix} = \begin{bmatrix} AX + BZ & AY + BW \\ DZ & DW\end{bmatrix} = \begin{bmatrix} I & 0 \\ 0 & I\end{bmatrix}.$$

The bottom row gives $DZ = 0$, so $Z = 0$, and $DW = I$, so $W = D^{-1}$. Then $AX = I$ gives
$X = A^{-1}$, and $AY + BD^{-1} = 0$ gives $Y = -A^{-1}BD^{-1}$:

$$\begin{bmatrix} A & B \\ 0 & D\end{bmatrix}^{-1} = \begin{bmatrix} A^{-1} & -A^{-1}BD^{-1} \\ 0 & D^{-1}\end{bmatrix}.$$

(Multiplying in the other order also gives $I$, as you can check.) A special case worth
remembering: $\begin{bmatrix} I & B \\ 0 & I\end{bmatrix}^{-1} = \begin{bmatrix} I & -B \\ 0 & I\end{bmatrix}$,
the block version of undoing a row replacement.

## Block elimination and the Schur complement

Now take a general block matrix $M = \begin{bmatrix} A & B \\ C & D\end{bmatrix}$ with $A$ square
and invertible. Ordinary elimination clears the entries below a pivot by subtracting multiples
of the pivot row. Block elimination clears the block $C$ by subtracting $CA^{-1}$ times the
first block row from the second:

$$\begin{bmatrix} I & 0 \\ -CA^{-1} & I\end{bmatrix}\begin{bmatrix} A & B \\ C & D\end{bmatrix} = \begin{bmatrix} A & B \\ 0 & D - CA^{-1}B\end{bmatrix}.$$

The block that is left,

$$S = D - CA^{-1}B,$$

is the **Schur complement** of $A$ in $M$. (It is named for Issai Schur, who used it in a
1917 paper; Emilie Haynsworth introduced the name in 1968.) Moving the block elementary matrix to the other side
(its inverse just flips the sign of $CA^{-1}$) gives a **block LU factorization**

$$M = \begin{bmatrix} I & 0 \\ CA^{-1} & I\end{bmatrix}\begin{bmatrix} A & B \\ 0 & S\end{bmatrix}.$$

You have already met Schur complements without the name. When $A$ is the $1 \times 1$ block
$a_{11}$, the matrix $S = D - \frac{1}{a_{11}}\mathbf{c}\mathbf{b}^T$ is exactly what's left in
rows 2 to $n$ and columns 2 to $n$ after clearing column 1. For the LU lesson's matrix
$\begin{bmatrix} 2 & 1 & -1 \\ 4 & 5 & 1 \\ -2 & 2 & 6\end{bmatrix}$,
$$S = \begin{bmatrix} 5 & 1 \\ 2 & 6\end{bmatrix} - \frac12\begin{bmatrix} 4 \\ -2\end{bmatrix}\begin{bmatrix} 1 & -1\end{bmatrix} = \begin{bmatrix} 3 & 3 \\ 3 & 5\end{bmatrix},$$
the same rows $[\,0 \;\; 3 \;\; 3\,]$ and $[\,0 \;\; 3 \;\; 5\,]$ found there. Elimination is
a chain of Schur complements, one pivot at a time.

![A block matrix with blocks A, B, C, D is multiplied on the left by the block elementary matrix with I, 0 in the top row and minus C A inverse, I in the bottom row. The result has A and B in the top row, a zero block bottom left, and the Schur complement S = D minus C A inverse B bottom right.](images/la-m5-block-elimination.svg)

**Invertibility.** With $A$ invertible, $M$ is invertible exactly when $S$ is. If $S$ is
invertible, $M$ is a product of two invertible matrices. If instead $S\mathbf{z} = \mathbf{0}$ for
some $\mathbf{z} \ne \mathbf{0}$, the vector $(-A^{-1}B\mathbf{z},\ \mathbf{z})$ is a nonzero solution
of $M\mathbf{x} = \mathbf{0}$ (check it), so $M$ is singular by the IMT.

**Solving block systems.** To solve $A\mathbf{x}_1 + B\mathbf{x}_2 = \mathbf{f}$,
$C\mathbf{x}_1 + D\mathbf{x}_2 = \mathbf{g}$, eliminate $\mathbf{x}_1$ just as you would a single
unknown:

1. Solve $S\mathbf{x}_2 = \mathbf{g} - CA^{-1}\mathbf{f}$.
2. Then $\mathbf{x}_1 = A^{-1}(\mathbf{f} - B\mathbf{x}_2)$.

This pays off when $A$ is easy to invert (diagonal, or already factored) and $S$ is small.

### Example 2

Solve $M\mathbf{x} = (-2, -1, -2)$ for $M = \begin{bmatrix} 2 & 0 & 4 \\ 0 & 1 & 3 \\ 1 & 2 & 7\end{bmatrix}$, using the blocks $A = \begin{bmatrix} 2 & 0 \\ 0 & 1\end{bmatrix}$, $B = \begin{bmatrix} 4 \\ 3\end{bmatrix}$, $C = \begin{bmatrix} 1 & 2\end{bmatrix}$, $D = [\,7\,]$.

1. $A$ is diagonal, so $A^{-1} = \operatorname{diag}(\tfrac12, 1)$, and $A^{-1}B = (2, 3)$.
2. Schur complement: $S = 7 - CA^{-1}B = 7 - (1 \cdot 2 + 2 \cdot 3) = -1$. It's nonzero, so $M$ is invertible.
3. With $\mathbf{f} = (-2, -1)$ and $g = -2$: $A^{-1}\mathbf{f} = (-1, -1)$, so $g - CA^{-1}\mathbf{f} = -2 - (-1 - 2) = 1$, and $x_3 = 1/(-1) = -1$.
4. $\mathbf{x}_1 = A^{-1}(\mathbf{f} - Bx_3) = A^{-1}\big((-2, -1) + (4, 3)\big) = A^{-1}(2, 2) = (1, 2)$.
5. So $\mathbf{x} = (1, 2, -1)$. Check row 3: $1 + 2(2) + 7(-1) = -2$. ✓

## Updating an inverse: the Sherman–Morrison formula

Suppose you already know $A^{-1}$, and then $A$ changes a little: one entry is corrected, or one
new observation is added to a data matrix. Many such changes have the form
$A + \mathbf{u}\mathbf{v}^T$, a **rank-one update** (adding a single outer product). Changing
entry $(i, j)$ by $\delta$, for example, is adding $\delta\,\mathbf{e}_i\mathbf{e}_j^T$. Recomputing
the inverse from scratch costs on the order of $n^3$ operations, but there is a shortcut.

> *Sherman–Morrison formula.* If $A$ is invertible and $1 + \mathbf{v}^TA^{-1}\mathbf{u} \ne 0$, then
> $$(A + \mathbf{u}\mathbf{v}^T)^{-1} = A^{-1} - \frac{A^{-1}\mathbf{u}\,\mathbf{v}^TA^{-1}}{1 + \mathbf{v}^TA^{-1}\mathbf{u}}.$$

To prove it, multiply $A + \mathbf{u}\mathbf{v}^T$ by the right side and use the fact that
$\mathbf{v}^TA^{-1}\mathbf{u}$ is a number, call it $\beta$, which can move to the front:

$$(A + \mathbf{u}\mathbf{v}^T)A^{-1} - \frac{(A + \mathbf{u}\mathbf{v}^T)A^{-1}\mathbf{u}\mathbf{v}^TA^{-1}}{1 + \beta} = I + \mathbf{u}\mathbf{v}^TA^{-1} - \frac{\mathbf{u}\mathbf{v}^TA^{-1} + \beta\,\mathbf{u}\mathbf{v}^TA^{-1}}{1 + \beta} = I.$$

The work is two matrix–vector products ($A^{-1}\mathbf{u}$ and $\mathbf{v}^TA^{-1}$) and one outer
product, about $n^2$ operations each. If $1 + \mathbf{v}^TA^{-1}\mathbf{u} = 0$, the updated matrix
is singular (the formula's denominator warns you). The formula is named for Jack Sherman and
Winifred J. Morrison, who published it in 1949–1950 for adjusting an inverse after one entry,
row or column changes (versions of it had appeared earlier). Max Woodbury's 1950 report extended it to
updates $UCV^T$ of higher rank (the Woodbury identity). Recursive least squares, which updates
a regression fit as each new data point arrives, uses exactly this formula, and the higher-rank version
is a standard tool in deriving the Kalman filter's update equations.

### Example 3

The inverse lesson found that $A = \begin{bmatrix} 1 & 2 & 0 \\ 0 & 1 & 1 \\ 1 & 2 & 1\end{bmatrix}$ has $A^{-1} = \begin{bmatrix} -1 & -2 & 2 \\ 1 & 1 & -1 \\ -1 & 0 & 1\end{bmatrix}$. Find the inverse of $A'$, which is $A$ with $a_{33}$ changed from 1 to 2.

1. The change adds 1 to entry $(3, 3)$: $A' = A + \mathbf{e}_3\mathbf{e}_3^T$, so $\mathbf{u} = \mathbf{v} = \mathbf{e}_3$.
2. $A^{-1}\mathbf{u}$ is column 3 of $A^{-1}$: $(2, -1, 1)$. $\mathbf{v}^TA^{-1}$ is row 3 of $A^{-1}$: $(-1, 0, 1)$.
3. The denominator is $1 + \mathbf{v}^TA^{-1}\mathbf{u} = 1 + (A^{-1})_{33} = 1 + 1 = 2$, nonzero, so $A'$ is invertible.
4. The correction is $\dfrac12\begin{bmatrix} 2 \\ -1 \\ 1\end{bmatrix}\begin{bmatrix} -1 & 0 & 1\end{bmatrix} = \dfrac12\begin{bmatrix} -2 & 0 & 2 \\ 1 & 0 & -1 \\ -1 & 0 & 1\end{bmatrix}$.
5. Subtract: $(A')^{-1} = \begin{bmatrix} 0 & -2 & 1 \\ \tfrac12 & 1 & -\tfrac12 \\ -\tfrac12 & 0 & \tfrac12\end{bmatrix}$.
6. Check one entry of $A'(A')^{-1}$: row 3 of $A'$ is $(1, 2, 2)$, and column 1 of $(A')^{-1}$ is $(0, \tfrac12, -\tfrac12)$: $0 + 1 - 1 = 0$. ✓ (Row 3 of $A'$ times column 3 is $1 - 1 + 1 = 1$, also as it should be.)

Notice that column 2 of the inverse didn't change: row 3 of $A^{-1}$ has a 0 in column 2, so
the outer product has a zero column there.

## Common mistakes

- *Changing the order inside block products.* Blocks are matrices: $CA^{-1}B$ is not $A^{-1}BC$, and the Schur complement is $D - CA^{-1}B$, never $D - BA^{-1}C$ (which usually isn't even defined).
- *Confusing $\mathbf{u}\mathbf{v}^T$ with $\mathbf{v}^T\mathbf{u}$.* The outer product is a matrix; the inner product is a number.
- *Dropping the 1 in the denominator.* Sherman–Morrison divides by $1 + \mathbf{v}^TA^{-1}\mathbf{u}$, not by $\mathbf{v}^TA^{-1}\mathbf{u}$.
- *Applying block formulas without checking invertibility.* $A$ must be invertible to form $S$; $D$ must be too for the block triangular inverse.

## Key points

- $AB = \sum_k (\text{column } k \text{ of } A)(\text{row } k \text{ of } B)$: a product is a sum of outer products.
- $\begin{bmatrix} A & B \\ 0 & D\end{bmatrix}^{-1} = \begin{bmatrix} A^{-1} & -A^{-1}BD^{-1} \\ 0 & D^{-1}\end{bmatrix}$ when $A$ and $D$ are invertible.
- Block elimination leaves the Schur complement $S = D - CA^{-1}B$; with $A$ invertible, $M$ is invertible exactly when $S$ is. Ordinary elimination is the $1 \times 1$ case.
- Sherman–Morrison updates $A^{-1}$ after adding $\mathbf{u}\mathbf{v}^T$ in about $n^2$ operations instead of $n^3$.
