---
id: la-m8-h-jordan-form
module: la-m8
title: Defective matrices and the Jordan form
minutes: 45
honors: true
topics: [Jordan form]
drills: [la-m8-r2-jordan-power, la-m8-r2-jordan-ode]
refs: [la-ref-factor]
---
## When there aren't enough eigenvectors

The Diagonalization lesson ended with a warning: $S = \begin{bmatrix} 2 & 1 \\ 0 & 2\end{bmatrix}$ has the
eigenvalue 2 twice but only one independent eigenvector, so it can't be written as $PDP^{-1}$. And
in the differential equations lesson, the matrix exponential of $\begin{bmatrix} \lambda & 1 \\ 0 & \lambda\end{bmatrix}$
contained a strange factor $t$. This lesson explains both. A matrix without an eigenvector basis
is called **defective**: some eigenvalue has geometric multiplicity smaller than its algebraic
multiplicity. Defective matrices can't be made diagonal, but they can always be made *almost*
diagonal: eigenvalues on the diagonal and a few 1s just above it. That is the Jordan form.

## Generalized eigenvectors and Jordan chains

If $\lambda$ has too few eigenvectors, look one step further. Eigenvectors are the nonzero
solutions of $(A - \lambda I)\mathbf{v} = \mathbf{0}$. A **generalized eigenvector** for $\lambda$ is a
nonzero $\mathbf{v}$ with $(A - \lambda I)^k\mathbf{v} = \mathbf{0}$ for some $k \ge 1$. Every eigenvector is
one (with $k = 1$); the new ones need $k \ge 2$.

The useful way to find them is a chain. Start with an eigenvector $\mathbf{v}_1$ and solve

$$(A - \lambda I)\mathbf{v}_2 = \mathbf{v}_1, \qquad (A - \lambda I)\mathbf{v}_3 = \mathbf{v}_2, \qquad \dots$$

as long as these systems are consistent. The vectors $\mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_k$ form a
**Jordan chain**: $A - \lambda I$ pushes each one down to the previous one and sends $\mathbf{v}_1$ to $\mathbf{0}$.
Rearranged, the chain equations say

$$A\mathbf{v}_1 = \lambda\mathbf{v}_1, \qquad A\mathbf{v}_2 = \lambda\mathbf{v}_2 + \mathbf{v}_1, \qquad A\mathbf{v}_3 = \lambda\mathbf{v}_3 + \mathbf{v}_2, \ \dots$$

So $A$ doesn't keep $\mathbf{v}_2$ on its own line: it stretches it by $\lambda$ and then shifts it by
$\mathbf{v}_1$. The vectors of a Jordan chain are linearly independent (apply $(A - \lambda I)^{k-1}$ to a
dependence relation and only the coefficient of $\mathbf{v}_k$ survives; repeat).

## Jordan blocks

Put a chain into the columns of $P = [\,\mathbf{v}_1 \;\cdots\; \mathbf{v}_k\,]$. Column by column, $AP = PJ$ where

$$J = \begin{bmatrix} \lambda & 1 & & \\ & \lambda & \ddots & \\ & & \ddots & 1 \\ & & & \lambda\end{bmatrix}$$

has $\lambda$ on the diagonal, 1s on the superdiagonal, and zeros elsewhere: column $j$ of $PJ$ is
$\lambda\mathbf{v}_j + \mathbf{v}_{j-1}$, exactly $A\mathbf{v}_j$. This $k \times k$ matrix is a **Jordan block**.
A $1 \times 1$ Jordan block is just $[\lambda]$, so a diagonal matrix is made of $1 \times 1$ blocks.

Write a block as $J = \lambda I + N$, where $N$ has 1s on the superdiagonal. $N$ shifts coordinates
($N\mathbf{e}_1 = \mathbf{0}$, $N\mathbf{e}_2 = \mathbf{e}_1$, ...), so $N^k = 0$ for a $k \times k$ block.
A matrix with some power equal to zero is called **nilpotent**.

> **Jordan form theorem.** If every eigenvalue of the $n \times n$ matrix $A$ is real, there is an invertible real $P$ with $A = PJP^{-1}$, where $J$ is block diagonal with Jordan blocks on its diagonal. $J$, the **Jordan form** of $A$, is unique except for the order of the blocks. (Allowing complex numbers, every square matrix has a Jordan form.)

The proof, which builds a basis out of Jordan chains, belongs to a second course. What you can
read off $J$:

- the eigenvalues are its diagonal entries, each repeated by its algebraic multiplicity;
- the number of blocks for $\lambda$ equals the geometric multiplicity of $\lambda$ (each block contributes one eigenvector, the first vector of its chain);
- $A$ is diagonalizable exactly when every block is $1 \times 1$;
- the size of the largest block for $\lambda$ is the power of $(t - \lambda)$ in the minimal polynomial.

The block sizes can be found from ranks: the number of blocks for $\lambda$ of size at least $j$ is
$\operatorname{rank}(A - \lambda I)^{j-1} - \operatorname{rank}(A - \lambda I)^{j}$, where $(A - \lambda I)^0 = I$ has rank $n$.

The form is named for Camille Jordan, who described it in his 1870 treatise on permutation groups
and equations. Karl Weierstrass's theory of elementary divisors (1868) contains an equivalent
classification, and in 1874 the two approaches led to a public dispute between Jordan and Leopold
Kronecker.

### Example 1

Find the Jordan form of $A = \begin{bmatrix} 3 & 1 \\ -1 & 1\end{bmatrix}$ and a formula for $A^k$.

1. $\operatorname{tr} A = 4$, $\det A = 3 + 1 = 4$: $\lambda^2 - 4\lambda + 4 = (\lambda - 2)^2$. One eigenvalue, $\lambda = 2$, with algebraic multiplicity 2.
2. $A - 2I = \begin{bmatrix} 1 & 1 \\ -1 & -1\end{bmatrix}$ has rank 1, so the eigenspace is 1-dimensional: $A$ is defective. Eigenvector $\mathbf{v}_1 = (1, -1)$.
3. Chain: solve $(A - 2I)\mathbf{v}_2 = \mathbf{v}_1$, i.e. $x_1 + x_2 = 1$ (the second equation is the negative of the first). Take $\mathbf{v}_2 = (1, 0)$.
4. $P = \begin{bmatrix} 1 & 1 \\ -1 & 0\end{bmatrix}$, $J = \begin{bmatrix} 2 & 1 \\ 0 & 2\end{bmatrix}$. Check $AP = PJ$: both are $\begin{bmatrix} 2 & 3 \\ -2 & -1\end{bmatrix}$. ✓
5. Powers: $J^k = (2I + N)^k$, and since $N^2 = 0$ the binomial expansion stops after two terms (allowed because $2I$ and $N$ commute): $J^k = 2^kI + k2^{k-1}N = \begin{bmatrix} 2^k & k2^{k-1} \\ 0 & 2^k\end{bmatrix}$.
6. $A^k = PJ^kP^{-1}$ with $P^{-1} = \begin{bmatrix} 0 & -1 \\ 1 & 1\end{bmatrix}$ gives $A^k = 2^{k-1}\begin{bmatrix} k + 2 & k \\ -k & 2 - k\end{bmatrix}$. Check $k = 1$: $\begin{bmatrix} 3 & 1 \\ -1 & 1\end{bmatrix}$ ✓; $k = 2$: $2\begin{bmatrix} 4 & 2 \\ -2 & 0\end{bmatrix} = \begin{bmatrix} 8 & 4 \\ -4 & 0\end{bmatrix} = A^2$. ✓

The vector $\mathbf{v}_2$ is not unique: $(0, 1)$, or $\mathbf{v}_2$ plus any multiple of $\mathbf{v}_1$, works too, giving a different $P$ but the same $J$.

```plot
{"x": [-1.5, 3.8], "y": [-1.8, 1.5], "equal": true, "functions": [{"f": "-x", "dashed": true, "label": "eigenvector line"}], "segments": [{"from": [0, 0], "to": [1, -1], "arrow": true, "label": "v₁"}, {"from": [0, 0], "to": [1, 0], "arrow": true, "label": "v₂"}, {"from": [0, 0], "to": [2, 0], "dashed": true, "arrow": true, "label": "2v₂"}, {"from": [2, 0], "to": [3, -1], "arrow": true, "label": "+ v₁"}, {"from": [0, 0], "to": [3, -1], "arrow": true, "label": "Av₂"}], "caption": "A stretches v₂ by 2 and then shifts it by v₁: Av₂ = 2v₂ + v₁"}
```

In general, for a $k \times k$ block the powers are
$J^m = \lambda^mI + \binom{m}{1}\lambda^{m-1}N + \binom{m}{2}\lambda^{m-2}N^2 + \cdots$, so the entries one, two, ...
places above the diagonal are $m\lambda^{m-1}$, $\binom{m}{2}\lambda^{m-2}$, and so on. For example, with
$\lambda = 2$ and a $3 \times 3$ block, $J^4$ has 16 on the diagonal, $4 \cdot 2^3 = 32$ just above it, and
$\binom{4}{2}2^2 = 24$ in the corner. Polynomial factors like $m$ and $\binom{m}{2}$ are the signature of a
defective matrix. In a dynamical system $\mathbf{x}_{m+1} = A\mathbf{x}_m$ with $|\lambda| < 1$ they don't change
the long-run verdict ($m\lambda^{m-1} \to 0$ still), but they can make the state grow for a while
before it decays.

### Example 2

A $3 \times 3$ matrix $A$ has characteristic polynomial $-(\lambda - 5)^3$. List its possible Jordan forms, and find the one for $A = \begin{bmatrix} 5 & 1 & 2 \\ 0 & 5 & 0 \\ 0 & 0 & 5\end{bmatrix}$.

1. The block sizes for 5 must add up to 3: $1 + 1 + 1$, $2 + 1$, or $3$. The number of blocks equals $\dim\operatorname{Nul}(A - 5I) = 3 - \operatorname{rank}(A - 5I)$.

| $\operatorname{rank}(A - 5I)$ | Eigenspace dimension | Blocks | Minimal polynomial |
|---|---|---|---|
| 0 | 3 | three $1 \times 1$ ($A = 5I$) | $t - 5$ |
| 1 | 2 | one $2 \times 2$, one $1 \times 1$ | $(t - 5)^2$ |
| 2 | 1 | one $3 \times 3$ | $(t - 5)^3$ |

2. For the given matrix, $A - 5I = \begin{bmatrix} 0 & 1 & 2 \\ 0 & 0 & 0 \\ 0 & 0 & 0\end{bmatrix}$ has rank 1, so there are two blocks: $J = \begin{bmatrix} 5 & 1 & 0 \\ 0 & 5 & 0 \\ 0 & 0 & 5\end{bmatrix}$.
3. Check with the rank formula: blocks of size at least 2 number $\operatorname{rank}(A - 5I) - \operatorname{rank}(A - 5I)^2 = 1 - 0 = 1$, since $(A - 5I)^2 = 0$. ✓ One block of size 2, and the remaining size is a $1 \times 1$ block.

## The exponential of a Jordan block

The same splitting $J = \lambda I + N$ solves $\mathbf{x}' = J\mathbf{x}$. Because $\lambda I$ and $N$ commute,
$e^{Jt} = e^{\lambda t}e^{Nt}$, and the series for $e^{Nt}$ stops once $N^k = 0$:

$$e^{Jt} = e^{\lambda t}\Big(I + tN + \tfrac{t^2}{2!}N^2 + \cdots + \tfrac{t^{k-1}}{(k-1)!}N^{k-1}\Big).$$

For a $2 \times 2$ block, $e^{Jt} = e^{\lambda t}\begin{bmatrix} 1 & t \\ 0 & 1\end{bmatrix}$, the formula from the
differential equations lesson. In terms of a chain $\mathbf{v}_1, \mathbf{v}_2$ of $A$, the solutions of
$\mathbf{x}' = A\mathbf{x}$ are

$$\mathbf{x}(t) = c_1e^{\lambda t}\mathbf{v}_1 + c_2e^{\lambda t}\big(t\mathbf{v}_1 + \mathbf{v}_2\big),$$

with the weights again from $P\mathbf{c} = \mathbf{x}(0)$. (Check the second piece: its derivative is
$\lambda e^{\lambda t}(t\mathbf{v}_1 + \mathbf{v}_2) + e^{\lambda t}\mathbf{v}_1$, and $A$ times it is
$e^{\lambda t}(t\lambda\mathbf{v}_1 + \lambda\mathbf{v}_2 + \mathbf{v}_1)$, the same.)

### Example 3

Solve $\mathbf{x}' = A\mathbf{x}$ for the matrix of Example 1 with $\mathbf{x}(0) = (1, 2)$.

1. From Example 1: $\lambda = 2$, $\mathbf{v}_1 = (1, -1)$, $\mathbf{v}_2 = (1, 0)$.
2. Weights: $c_1(1, -1) + c_2(1, 0) = (1, 2)$. The second entries give $-c_1 = 2$, so $c_1 = -2$; then $c_2 = 1 - c_1 = 3$.
3. $\mathbf{x}(t) = -2e^{2t}(1, -1) + 3e^{2t}\big(t(1, -1) + (1, 0)\big) = e^{2t}(1 + 3t,\ 2 - 3t)$.
4. Check: at $t = 0$ this is $(1, 2)$. ✓ The derivative of the first entry is $e^{2t}(2 + 6t + 3) = e^{2t}(5 + 6t)$, and row 1 of $A\mathbf{x}$ is $e^{2t}\big(3(1 + 3t) + (2 - 3t)\big) = e^{2t}(5 + 6t)$. ✓

## A fragile form

The Jordan form is a theoretical tool more than a computational one. It jumps under tiny changes:
$\begin{bmatrix} 2 & 1 \\ \varepsilon & 2\end{bmatrix}$ has eigenvalues $2 \pm \sqrt{\varepsilon}$, distinct for every small
$\varepsilon > 0$, so it is diagonalizable, while at $\varepsilon = 0$ it is a single Jordan block. A
computer working with rounded numbers can't reliably tell these apart, so numerical software
avoids the Jordan form and uses other factorizations, such as the Schur form (an orthogonal change
of basis to a triangular matrix). Exact matrices with small integer entries, like the ones in this
lesson, are where the Jordan form is computed by hand.

## Common mistakes

- *Assuming a repeated eigenvalue means a Jordan block.* $5I$ has eigenvalue 5 three times and is diagonal. Count eigenvectors (or ranks) first.
- *Solving $(A - \lambda I)\mathbf{v}_2 = \mathbf{0}$ again.* The second chain vector solves $(A - \lambda I)\mathbf{v}_2 = \mathbf{v}_1$, with $\mathbf{v}_1$ on the right.
- *Putting the chain in the wrong order.* The eigenvector goes in the first column of $P$; then the 1 sits above the diagonal.
- *Computing $J^k$ entrywise.* $\begin{bmatrix} 2 & 1 \\ 0 & 2\end{bmatrix}^k$ has $k2^{k-1}$ in the corner, not $1^k = 1$.
- *Forgetting the factor $t$.* For a $2 \times 2$ block the solutions include $te^{\lambda t}$, not just $e^{\lambda t}$.

## Key points

- A matrix is defective when some eigenvalue has fewer independent eigenvectors than its algebraic multiplicity.
- A Jordan chain solves $(A - \lambda I)\mathbf{v}_1 = \mathbf{0}$, $(A - \lambda I)\mathbf{v}_{j+1} = \mathbf{v}_j$; then $A\mathbf{v}_{j+1} = \lambda\mathbf{v}_{j+1} + \mathbf{v}_j$.
- Every matrix with real eigenvalues is $PJP^{-1}$ with $J$ made of Jordan blocks $\lambda I + N$; one block per independent eigenvector.
- $J^m$ and $e^{Jt}$ follow from the binomial expansion and the series, which stop because $N$ is nilpotent: factors $m\lambda^{m-1}$ and $te^{\lambda t}$ appear.
- The Jordan form is exact but fragile; software uses other factorizations.
