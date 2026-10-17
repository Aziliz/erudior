---
id: la-quadratic-forms
module: la-m9
title: Quadratic forms
minutes: 35
topics: [Quadratic forms]
drills: [la-qf-matrix, la-qf-eval]
refs: [la-ref-factor]
---
## Second-degree expressions in several variables

Expressions like $5x_1^2 + 4x_1x_2 + 2x_2^2$ appear as energy in physics, as variance in
statistics, as the second-derivative test in multivariable calculus, and as the equations of
ellipses and hyperbolas. The cross term $4x_1x_2$ makes them hard to read. Using the
spectral theorem, a change of variables removes every cross term, and the eigenvalues of a
symmetric matrix then tell you everything: the shape of the level curves and whether the
expression is always positive.

## Quadratic forms and their matrices

A **quadratic form** on $\mathbb{R}^n$ is a function $Q(\mathbf{x}) = \mathbf{x}^TA\mathbf{x}$, where
$A$ is an $n \times n$ symmetric matrix, called the matrix of the form. For $n = 2$,

$$\begin{bmatrix} x_1 & x_2\end{bmatrix}\begin{bmatrix} a & b \\ b & c\end{bmatrix}\begin{bmatrix} x_1 \\ x_2\end{bmatrix} = ax_1^2 + 2bx_1x_2 + cx_2^2.$$

So squared terms go on the diagonal, and each cross-term coefficient is *split in half*
between the two symmetric off-diagonal positions. For three variables,
$Q = 3x_1^2 - x_2^2 + 4x_3^2 + 6x_1x_2 - 2x_2x_3$ has matrix
$\begin{bmatrix} 3 & 3 & 0 \\ 3 & -1 & -1 \\ 0 & -1 & 4\end{bmatrix}$.

## Removing cross terms: the principal axes theorem

Since $A$ is symmetric, $A = PDP^T$ with $P$ orthogonal. Substitute $\mathbf{x} = P\mathbf{y}$:

$$Q = \mathbf{x}^TA\mathbf{x} = \mathbf{y}^TP^TAP\mathbf{y} = \mathbf{y}^TD\mathbf{y} = \lambda_1y_1^2 + \lambda_2y_2^2 + \cdots + \lambda_ny_n^2.$$

> The **principal axes theorem**: every quadratic form $\mathbf{x}^TA\mathbf{x}$ can be turned into one with no cross terms by an orthogonal change of variable $\mathbf{x} = P\mathbf{y}$, where the columns of $P$ are orthonormal eigenvectors of $A$ and the new coefficients are the eigenvalues.

The columns of $P$ are the **principal axes** of the form. Because $P$ is orthogonal, the new
coordinates are just a rotation (possibly with a reflection) of the old ones.

### Example 1

Remove the cross term from $Q(\mathbf{x}) = 5x_1^2 + 4x_1x_2 + 2x_2^2$ and describe the curve $Q(\mathbf{x}) = 6$.

1. Matrix: $A = \begin{bmatrix} 5 & 2 \\ 2 & 2\end{bmatrix}$ (the 4 is split into $2 + 2$).
2. Eigenvalues: $\lambda^2 - 7\lambda + 6 = (\lambda - 6)(\lambda - 1)$, so 6 and 1.
3. Eigenvectors: $(2, 1)$ for 6 and $(1, -2)$ for 1; normalized, $P = \dfrac{1}{\sqrt5}\begin{bmatrix} 2 & 1 \\ 1 & -2\end{bmatrix}$.
4. With $\mathbf{x} = P\mathbf{y}$: $Q = 6y_1^2 + y_2^2$.
5. The curve $6y_1^2 + y_2^2 = 6$, i.e. $y_1^2 + \dfrac{y_2^2}{6} = 1$, is an ellipse with semi-axis 1 along $(2, 1)$ and semi-axis $\sqrt6$ along $(1, -2)$.

```plot
{"x": [-3, 3], "y": [-3, 3], "equal": true, "curves": [{"x": "(2*cos(t) + sqrt(6)*sin(t))/sqrt(5)", "y": "(cos(t) - 2*sqrt(6)*sin(t))/sqrt(5)", "t": [0, "2pi"]}], "segments": [{"from": [0, 0], "to": [0.894, 0.447], "arrow": true, "label": "u₁ (λ = 6)"}, {"from": [0, 0], "to": [0.447, -0.894], "arrow": true, "label": "u₂ (λ = 1)"}], "caption": "5x₁² + 4x₁x₂ + 2x₂² = 6 is a tilted ellipse; its axes are the eigenvectors"}
```

## Classifying quadratic forms

The diagonal form shows at once whether $Q$ can be negative. A quadratic form (and its
matrix) is:

| Name | Meaning | Eigenvalues of $A$ |
|---|---|---|
| **positive definite** | $Q(\mathbf{x}) > 0$ for all $\mathbf{x} \ne \mathbf{0}$ | all positive |
| **negative definite** | $Q(\mathbf{x}) < 0$ for all $\mathbf{x} \ne \mathbf{0}$ | all negative |
| **indefinite** | takes both positive and negative values | some positive, some negative |
| **positive semidefinite** | $Q(\mathbf{x}) \ge 0$ for all $\mathbf{x}$ | all $\ge 0$ |
| negative semidefinite | $Q(\mathbf{x}) \le 0$ for all $\mathbf{x}$ | all $\le 0$ |

Every positive definite form is also positive semidefinite (and likewise for negative), so
"semidefinite but not definite" means some eigenvalue is 0.

The form in Example 1 has eigenvalues 6 and 1, so it's positive definite: its level curves
are ellipses. For $2 \times 2$ forms there's a shortcut: $\det A = \lambda_1\lambda_2$, so
$\det A < 0$ means indefinite, $\det A > 0$ means definite (positive if $a > 0$, negative if
$a < 0$), and $\det A = 0$ means one eigenvalue is 0, so the form is only semidefinite.
The next lesson extends this shortcut to any size, with tests that use pivots or determinants
instead of eigenvalues.

### Example 2

Classify $Q(\mathbf{x}) = x_1^2 - 6x_1x_2 + x_2^2$.

1. $A = \begin{bmatrix} 1 & -3 \\ -3 & 1\end{bmatrix}$, $\det A = 1 - 9 = -8 < 0$.
2. Eigenvalues: $\lambda^2 - 2\lambda - 8 = (\lambda - 4)(\lambda + 2)$: 4 and $-2$.
3. Mixed signs: indefinite. For example $Q(1, 1) = 1 - 6 + 1 = -4$ but $Q(1, -1) = 1 + 6 + 1 = 8$.
4. In principal-axis coordinates $Q = 4y_1^2 - 2y_2^2$, so its level curves are hyperbolas.

## Constrained optimization

What are the largest and smallest values of $Q(\mathbf{x})$ on the unit sphere $\|\mathbf{x}\| = 1$?
In principal-axis coordinates ($\|\mathbf{y}\| = \|\mathbf{x}\|$ because $P$ is orthogonal),
$Q = \sum\lambda_iy_i^2$ with $\sum y_i^2 = 1$: a weighted average of the eigenvalues.

> The maximum of $\mathbf{x}^TA\mathbf{x}$ over unit vectors is the largest eigenvalue of $A$, attained at a corresponding unit eigenvector; the minimum is the smallest eigenvalue.

For Example 1, the maximum of $5x_1^2 + 4x_1x_2 + 2x_2^2$ on the unit circle is 6, at
$\pm\tfrac{1}{\sqrt5}(2, 1)$, and the minimum is 1. This is the idea behind principal component
analysis: the direction of greatest variance is the top eigenvector of a covariance matrix.

## Common mistakes

- *Not halving the cross term.* $4x_1x_2$ puts 2 (not 4) in each off-diagonal slot.
- *Classifying by the diagonal entries.* $\begin{bmatrix} 1 & -3 \\ -3 & 1\end{bmatrix}$ has positive diagonal but is indefinite. Use eigenvalues (or the determinant test in $2 \times 2$).
- *Using a non-orthogonal $P$.* Then $P^TAP$ isn't diagonal and lengths aren't preserved.
- *Mixing up semidefinite and definite.* Eigenvalue 0 allows $Q(\mathbf{x}) = 0$ for some $\mathbf{x} \ne \mathbf{0}$.

## Key points

- $Q(\mathbf{x}) = \mathbf{x}^TA\mathbf{x}$ with $A$ symmetric; squares on the diagonal, half of each cross coefficient off the diagonal.
- Principal axes theorem: $\mathbf{x} = P\mathbf{y}$ (orthonormal eigenvectors) gives $Q = \sum\lambda_iy_i^2$.
- Positive definite ⟺ all eigenvalues positive; indefinite ⟺ eigenvalues of both signs.
- On unit vectors, $Q$ ranges between the smallest and largest eigenvalues of $A$.
