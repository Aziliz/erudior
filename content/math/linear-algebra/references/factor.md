---
id: la-ref-factor
title: Matrix factorizations and key formulas
---
## Factorizations

| Name | Form | Conditions | Built from | Main use |
|---|---|---|---|---|
| Inverse ($2 \times 2$) | $A^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a\end{bmatrix}$ | $ad - bc \neq 0$ | swap, negate, divide | small systems |
| LU | $A = LU$ | no row swaps needed (else $PA = LU$) | $L$: multipliers $\ell_{ij}$; $U$: echelon form | many right-hand sides: $L\mathbf{y} = \mathbf{b}$, $U\mathbf{x} = \mathbf{y}$ |
| Diagonalization | $A = PDP^{-1}$ | $n$ independent (real) eigenvectors | $P$: eigenvectors; $D$: eigenvalues (same order) | powers $A^k = PD^kP^{-1}$, dynamics |
| Rotation–scaling | $A = PCP^{-1}$, $C = \begin{bmatrix} a & -b \\ b & a\end{bmatrix}$ | real $2 \times 2$, eigenvalue $a - bi$ | $P = [\,\operatorname{Re}\mathbf{v} \;\; \operatorname{Im}\mathbf{v}\,]$ | spirals, rotations |
| QR | $A = QR$ | independent columns | $Q$: Gram–Schmidt, normalized; $R = Q^TA$ | least squares: $R\hat{\mathbf{x}} = Q^T\mathbf{b}$ |
| Orthogonal diagonalization | $A = PDP^T$ | $A$ symmetric | orthonormal eigenvectors | quadratic forms, spectral decomposition |
| SVD | $A = U\Sigma V^T$ | any matrix | $V$: eigenvectors of $A^TA$; $\sigma_i = \sqrt{\lambda_i}$; $\mathbf{u}_i = A\mathbf{v}_i/\sigma_i$ | rank, low-rank approximation, condition number |

## Eigenvalues

| Item | Formula |
|---|---|
| Eigen-equation | $A\mathbf{x} = \lambda\mathbf{x}$, $\mathbf{x} \neq \mathbf{0}$ |
| Eigenspace | $\operatorname{Nul}(A - \lambda I)$ |
| $2 \times 2$ characteristic polynomial | $\lambda^2 - (\operatorname{tr} A)\lambda + \det A$ |
| Sum / product | $\sum\lambda_i = \operatorname{tr} A$, $\prod\lambda_i = \det A$ (with multiplicity, complex ones included) |
| Rotation–scaling | $\lambda = a \pm bi$, $r = \lvert\lambda\rvert = \sqrt{a^2 + b^2}$, angle of $(a, b)$ |
| Dynamical system | $\mathbf{x}_k = c_1\lambda_1^k\mathbf{v}_1 + \cdots + c_n\lambda_n^k\mathbf{v}_n$ |
| Markov steady state | $P\mathbf{q} = \mathbf{q}$, entries of $\mathbf{q}$ sum to 1 |

## Orthogonality and least squares

| Item | Formula |
|---|---|
| Dot product, length | $\mathbf{u}\cdot\mathbf{v} = \mathbf{u}^T\mathbf{v}$, $\lVert\mathbf{v}\rVert = \sqrt{\mathbf{v}\cdot\mathbf{v}}$ |
| Angle | $\cos\theta = \dfrac{\mathbf{u}\cdot\mathbf{v}}{\lVert\mathbf{u}\rVert\lVert\mathbf{v}\rVert}$ |
| Projection onto a line | $\operatorname{proj}_{\mathbf{u}}\mathbf{y} = \dfrac{\mathbf{y}\cdot\mathbf{u}}{\mathbf{u}\cdot\mathbf{u}}\mathbf{u}$ |
| Projection onto $W$ (orthogonal basis) | $\sum_j \dfrac{\mathbf{y}\cdot\mathbf{u}_j}{\mathbf{u}_j\cdot\mathbf{u}_j}\mathbf{u}_j$ |
| Gram–Schmidt | $\mathbf{v}_k = \mathbf{x}_k - \sum_{i<k}\dfrac{\mathbf{x}_k\cdot\mathbf{v}_i}{\mathbf{v}_i\cdot\mathbf{v}_i}\mathbf{v}_i$ |
| Orthonormal columns | $U^TU = I$; square: $U^{-1} = U^T$ |
| Normal equations | $A^TA\hat{\mathbf{x}} = A^T\mathbf{b}$ |
| Least-squares line | $\begin{bmatrix} n & \sum x_i \\ \sum x_i & \sum x_i^2\end{bmatrix}\begin{bmatrix} \beta_0 \\ \beta_1\end{bmatrix} = \begin{bmatrix} \sum y_i \\ \sum x_iy_i\end{bmatrix}$ |
| Quadratic form | $Q(\mathbf{x}) = \mathbf{x}^TA\mathbf{x}$; $ax_1^2 + bx_1x_2 + cx_2^2 \leftrightarrow \begin{bmatrix} a & b/2 \\ b/2 & c\end{bmatrix}$ |

## Matrix algebra rules

| Rule | Formula |
|---|---|
| Product size | $(m \times n)(n \times p) = m \times p$ |
| Columns of a product | $AB = [\,A\mathbf{b}_1 \;\cdots\; A\mathbf{b}_p\,]$ |
| Transpose of product | $(AB)^T = B^TA^T$ |
| Inverse of product | $(AB)^{-1} = B^{-1}A^{-1}$ |
| Homogeneous translation | $\begin{bmatrix} 1 & 0 & h \\ 0 & 1 & k \\ 0 & 0 & 1\end{bmatrix}$ |
| Rotation by $\theta$ | $\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta\end{bmatrix}$ |
