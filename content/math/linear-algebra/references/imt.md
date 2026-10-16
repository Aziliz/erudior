---
id: la-ref-imt
title: The invertible matrix theorem
---
For an $n \times n$ matrix $A$, the following statements are **all true or all false**. To show
$A$ is invertible, check whichever is easiest; if any one fails, they all fail.

| # | Statement | Where it comes from |
|---|---|---|
| 1 | $A$ is invertible | definition: $AA^{-1} = A^{-1}A = I$ |
| 2 | $A$ is row equivalent to $I_n$ | inverse algorithm |
| 3 | $A$ has $n$ pivot positions | row reduction |
| 4 | $A\mathbf{x} = \mathbf{0}$ has only the trivial solution | no free variables |
| 5 | The columns of $A$ are linearly independent | pivot in every column |
| 6 | $\mathbf{x} \mapsto A\mathbf{x}$ is one-to-one | kernel is $\{\mathbf{0}\}$ |
| 7 | $A\mathbf{x} = \mathbf{b}$ has at least one solution for every $\mathbf{b}$ | pivot in every row |
| 8 | The columns of $A$ span $\mathbb{R}^n$ | spanning theorem |
| 9 | $\mathbf{x} \mapsto A\mathbf{x}$ maps $\mathbb{R}^n$ onto $\mathbb{R}^n$ | range is everything |
| 10 | There is $C$ with $CA = I$ | left inverse |
| 11 | There is $D$ with $AD = I$ | right inverse |
| 12 | $A^T$ is invertible | $(A^T)^{-1} = (A^{-1})^T$ |
| 13 | $A\mathbf{x} = \mathbf{b}$ has exactly one solution for every $\mathbf{b}$ | $\mathbf{x} = A^{-1}\mathbf{b}$ |
| 14 | $\det A \neq 0$ | determinants |
| 15 | $0$ is not an eigenvalue of $A$ | eigenvalues |
| 16 | The columns of $A$ form a basis of $\mathbb{R}^n$ | bases |
| 17 | $\operatorname{Col} A = \mathbb{R}^n$ | column space |
| 18 | $\operatorname{rank} A = n$ (so $\dim\operatorname{Col} A = n$) | rank |
| 19 | $\operatorname{Nul} A = \{\mathbf{0}\}$ (so $\dim\operatorname{Nul} A = 0$) | rank theorem |
| 20 | All singular values of $A$ are nonzero | SVD |

## For non-square matrices ($m \times n$)

| Property | Test |
|---|---|
| Columns span $\mathbb{R}^m$ / $A\mathbf{x} = \mathbf{b}$ always solvable / onto | pivot in every **row** |
| Columns independent / $A\mathbf{x} = \mathbf{0}$ only trivial / one-to-one | pivot in every **column** |
| Wide ($n > m$) | never one-to-one |
| Tall ($n < m$) | never onto |

## Inverse facts

| Fact | Formula |
|---|---|
| $2 \times 2$ inverse | $\begin{bmatrix} a & b \\ c & d\end{bmatrix}^{-1} = \dfrac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a\end{bmatrix}$ |
| Product | $(AB)^{-1} = B^{-1}A^{-1}$ |
| Transpose | $(A^T)^{-1} = (A^{-1})^T$ |
| Scalar multiple | $(cA)^{-1} = \tfrac1c A^{-1}$ |
| Algorithm | $[\,A \;\; I\,] \sim [\,I \;\; A^{-1}\,]$ |
| Adjugate | $A^{-1} = \dfrac{1}{\det A}\operatorname{adj} A$, $(\operatorname{adj} A)_{ij} = C_{ji}$ |
