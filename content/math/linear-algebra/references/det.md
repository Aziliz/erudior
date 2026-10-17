---
id: la-ref-det
title: Determinant properties
---
## Computing determinants

| Method | Formula / steps |
|---|---|
| $2 \times 2$ | $\begin{vmatrix} a & b \\ c & d\end{vmatrix} = ad - bc$ |
| $3 \times 3$ (row 1) | $a_{11}\begin{vmatrix} a_{22} & a_{23} \\ a_{32} & a_{33}\end{vmatrix} - a_{12}\begin{vmatrix} a_{21} & a_{23} \\ a_{31} & a_{33}\end{vmatrix} + a_{13}\begin{vmatrix} a_{21} & a_{22} \\ a_{31} & a_{32}\end{vmatrix}$ |
| Cofactor | $C_{ij} = (-1)^{i+j}\det A_{ij}$ ($A_{ij}$: delete row $i$, column $j$) |
| Expansion | along row $i$: $\sum_j a_{ij}C_{ij}$; down column $j$: $\sum_i a_{ij}C_{ij}$ |
| Sign pattern | $\begin{bmatrix} + & - & + \\ - & + & - \\ + & - & +\end{bmatrix}$ |
| Triangular | product of the diagonal entries |
| Row reduction | $\det A = (-1)^r \times$ (product of pivots of an echelon form) when only replacements and swaps are used, $r$ = number of swaps |

## Row (and column) operations

| Operation | Effect on $\det$ |
|---|---|
| Add a multiple of one row to another | no change |
| Swap two rows | multiply by $-1$ |
| Multiply one row by $k$ | multiply by $k$ |
| Row of zeros, or two equal rows | $\det = 0$ |

Because $\det A^T = \det A$, the same rules hold for columns.

## Algebraic properties ($n \times n$)

| Property | Formula |
|---|---|
| Product | $\det(AB) = \det A \cdot \det B$ |
| Transpose | $\det A^T = \det A$ |
| Inverse | $\det A^{-1} = 1/\det A$ |
| Scalar | $\det(cA) = c^n\det A$ |
| Power | $\det(A^k) = (\det A)^k$ |
| Similar matrices | $\det(P^{-1}AP) = \det A$ |
| Eigenvalues | $\det A = \lambda_1\lambda_2\cdots\lambda_n$ (with multiplicity, complex ones included) |
| Sum | no rule: $\det(A + B) \neq \det A + \det B$ in general |
| Invertibility | $A$ invertible ⟺ $\det A \neq 0$ |

## Applications

| Use | Formula |
|---|---|
| Cramer's rule | $x_i = \dfrac{\det A_i(\mathbf{b})}{\det A}$ ($A_i(\mathbf{b})$: column $i$ replaced by $\mathbf{b}$) |
| Inverse | $A^{-1} = \dfrac{1}{\det A}\operatorname{adj} A$ |
| Area of parallelogram from $\mathbf{u}, \mathbf{v}$ | $\lvert\det[\,\mathbf{u} \;\; \mathbf{v}\,]\rvert$ |
| Area of triangle from edge vectors $\mathbf{u}, \mathbf{v}$ | $\tfrac12\lvert\det[\,\mathbf{u} \;\; \mathbf{v}\,]\rvert$ |
| Volume of parallelepiped | $\lvert\det[\,\mathbf{u} \;\; \mathbf{v} \;\; \mathbf{w}\,]\rvert$ |
| Area/volume scaling by $\mathbf{x} \mapsto A\mathbf{x}$ | multiply by $\lvert\det A\rvert$ |
| Characteristic equation | $\det(A - \lambda I) = 0$; for $2 \times 2$, $\lambda^2 - (\operatorname{tr} A)\lambda + \det A = 0$ |
