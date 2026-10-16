---
id: la-diagonalization
module: la-m8
title: Diagonalization
minutes: 35
topics: [Diagonalization]
drills: [la-diag-power, la-eigvec]
refs: [la-ref-factor]
---
## A matrix in its own best coordinates

Diagonal matrices are as simple as matrices get: they scale each coordinate separately, and
their powers are just powers of the diagonal entries. Diagonalization rewrites a matrix as a
diagonal matrix in disguise, $A = PDP^{-1}$, where $P$ changes to a basis of eigenvectors.
In that basis $A$ simply stretches each coordinate by an eigenvalue. This lesson says when
that's possible and how to do it, and uses it to compute powers $A^k$ quickly.

## The factorization $A = PDP^{-1}$

A square matrix $A$ is **diagonalizable** if $A = PDP^{-1}$ for some invertible matrix $P$ and
diagonal matrix $D$; that is, if $A$ is similar to a diagonal matrix.

> *Diagonalization theorem.* An $n \times n$ matrix $A$ is diagonalizable if and only if $A$ has $n$ linearly independent eigenvectors. In that case $A = PDP^{-1}$, where the columns of $P$ are $n$ independent eigenvectors and the diagonal entries of $D$ are the corresponding eigenvalues, in the same order.

Why: $AP = PD$ says, column by column, $A\mathbf{p}_j = d_{jj}\mathbf{p}_j$. So $AP = PD$ holds
exactly when each column of $P$ is an eigenvector with eigenvalue $d_{jj}$, and $P$ is
invertible exactly when those eigenvectors are independent. Then multiply $AP = PD$ on the
right by $P^{-1}$.

A matrix with an eigenvector basis for $\mathbb{R}^n$ (an **eigenvector basis**) is exactly a
diagonalizable matrix.

## Powers

If $A = PDP^{-1}$, the inner factors cancel in products:

$$A^2 = PDP^{-1}PDP^{-1} = PD^2P^{-1}, \qquad A^k = PD^kP^{-1}.$$

And $D^k$ is diagonal with entries $\lambda_i^k$. Computing $A^{100}$ takes no more work than
$A^2$.

### Example 1

Diagonalize $A = \begin{bmatrix} 4 & -2 \\ 1 & 1\end{bmatrix}$ and find a formula for $A^k$.

1. Eigenvalues: $\lambda^2 - 5\lambda + 6 = (\lambda - 2)(\lambda - 3)$, so $\lambda = 2, 3$.
2. Eigenvectors (from the eigenvalues lesson): $(1, 1)$ for 2 and $(2, 1)$ for 3.
3. $P = \begin{bmatrix} 1 & 2 \\ 1 & 1\end{bmatrix}$, $D = \begin{bmatrix} 2 & 0 \\ 0 & 3\end{bmatrix}$, $P^{-1} = \dfrac{1}{-1}\begin{bmatrix} 1 & -2 \\ -1 & 1\end{bmatrix} = \begin{bmatrix} -1 & 2 \\ 1 & -1\end{bmatrix}$.
4. $A^k = PD^kP^{-1} = \begin{bmatrix} 1 & 2 \\ 1 & 1\end{bmatrix}\begin{bmatrix} 2^k & 0 \\ 0 & 3^k\end{bmatrix}\begin{bmatrix} -1 & 2 \\ 1 & -1\end{bmatrix} = \begin{bmatrix} 2\cdot3^k - 2^k & 2^{k+1} - 2\cdot3^k \\ 3^k - 2^k & 2^{k+1} - 3^k\end{bmatrix}.$
5. Check $k = 1$: $\begin{bmatrix} 6 - 2 & 4 - 6 \\ 3 - 2 & 4 - 3\end{bmatrix} = A$. ✓ For $k = 3$: $A^3 = \begin{bmatrix} 46 & -38 \\ 19 & -11\end{bmatrix}$.

The order of columns in $P$ must match the order of eigenvalues in $D$. Swapping both gives
another valid diagonalization.

## When is a matrix diagonalizable?

> *Theorem.* An $n \times n$ matrix with $n$ distinct eigenvalues is diagonalizable.

That follows because eigenvectors for distinct eigenvalues are independent. Distinct
eigenvalues are sufficient but not necessary. With repeated eigenvalues, count eigenvectors:
the **geometric multiplicity** of $\lambda$ is $\dim\operatorname{Nul}(A - \lambda I)$, the number of
independent eigenvectors for $\lambda$. It's always between 1 and the algebraic multiplicity.

> $A$ is diagonalizable exactly when, for every eigenvalue, the geometric multiplicity equals the algebraic multiplicity (equivalently, the eigenspace dimensions add up to $n$).

### Example 2

$B = \begin{bmatrix} 3 & 1 & 1 \\ 1 & 3 & 1 \\ 1 & 1 & 3\end{bmatrix}$ has eigenvalues 2 (algebraic multiplicity 2) and 5.

1. The eigenspace for 2 has basis $\{(-1, 1, 0), (-1, 0, 1)\}$: dimension 2, matching the multiplicity.
2. For 5: $B - 5I = \begin{bmatrix} -2 & 1 & 1 \\ 1 & -2 & 1 \\ 1 & 1 & -2\end{bmatrix}$ has null space spanned by $(1, 1, 1)$.
3. Three independent eigenvectors, so $B$ is diagonalizable: $P = \begin{bmatrix} -1 & -1 & 1 \\ 1 & 0 & 1 \\ 0 & 1 & 1\end{bmatrix}$, $D = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 5\end{bmatrix}$.

### Example 3

Is $S = \begin{bmatrix} 2 & 1 \\ 0 & 2\end{bmatrix}$ diagonalizable?

1. Triangular, so the only eigenvalue is 2, with algebraic multiplicity 2.
2. $S - 2I = \begin{bmatrix} 0 & 1 \\ 0 & 0\end{bmatrix}$: one pivot, one free variable, so the eigenspace is 1-dimensional (spanned by $(1, 0)$).
3. Only one independent eigenvector in $\mathbb{R}^2$: *not* diagonalizable.

Geometrically $S$ is a shear followed by scaling: the only direction it doesn't turn is the
$x$-axis. Not every matrix has enough eigenvectors.

A useful check on any diagonalization is to verify $AP = PD$ rather than computing $P^{-1}$:
multiply $A$ by each column of $P$ and confirm you get the corresponding eigenvalue times that
column. It catches mismatched orders and arithmetic slips at once.

## Common mistakes

- *Mismatched order.* Column $j$ of $P$ must be an eigenvector for the $j$th diagonal entry of $D$.
- *Thinking repeated eigenvalues rule out diagonalization.* $B$ in Example 2 is diagonalizable. Check eigenspace dimensions.
- *Confusing diagonalizable with invertible.* $\begin{bmatrix} 1 & 0 \\ 0 & 0\end{bmatrix}$ is diagonalizable but singular; $S$ in Example 3 is invertible but not diagonalizable.
- *Writing $A^k = P^kD^kP^{-k}$.* The $P$ and $P^{-1}$ appear once each: $A^k = PD^kP^{-1}$.

## Key points

- $A = PDP^{-1}$ with eigenvectors as the columns of $P$ and eigenvalues on the diagonal of $D$.
- $A$ is diagonalizable ⟺ it has $n$ independent eigenvectors; $n$ distinct eigenvalues guarantee it.
- With repeated eigenvalues, diagonalizable ⟺ each eigenspace's dimension equals the eigenvalue's algebraic multiplicity.
- $A^k = PD^kP^{-1}$, where $D^k$ just raises each eigenvalue to the $k$th power.
