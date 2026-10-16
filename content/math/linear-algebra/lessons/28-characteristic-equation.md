---
id: la-char-eq
module: la-m8
title: The characteristic equation
minutes: 30
topics: [Characteristic equation]
drills: [la-char-poly, la-eig2, la-eig-tri]
refs: [la-ref-det, la-ref-factor]
---
## Finding eigenvalues systematically

The last lesson could *test* whether a given number is an eigenvalue. To *find* the
eigenvalues, we need an equation whose solutions are exactly the eigenvalues. Determinants
supply it: $\lambda$ is an eigenvalue exactly when $A - \lambda I$ is singular, and a matrix is
singular exactly when its determinant is zero.

## The characteristic equation

> A scalar $\lambda$ is an eigenvalue of an $n \times n$ matrix $A$ if and only if it satisfies the **characteristic equation**
> $$\det(A - \lambda I) = 0.$$

Expanding $\det(A - \lambda I)$ gives a polynomial of degree $n$ in $\lambda$, the
**characteristic polynomial** of $A$. Its roots are the eigenvalues.

For a $2 \times 2$ matrix $A = \begin{bmatrix} a & b \\ c & d\end{bmatrix}$:

$$\det\begin{bmatrix} a - \lambda & b \\ c & d - \lambda\end{bmatrix} = (a - \lambda)(d - \lambda) - bc = \lambda^2 - (a + d)\lambda + (ad - bc).$$

The coefficient $a + d$ is the **trace** of $A$ (the sum of the diagonal entries), written
$\operatorname{tr} A$. So for $2 \times 2$ matrices the characteristic polynomial is
$\lambda^2 - (\operatorname{tr} A)\lambda + \det A$. Two consequences that hold for all $n$: the
eigenvalues (counted with multiplicity) add up to the trace and multiply to the determinant.

### Example 1

Find the eigenvalues of $A = \begin{bmatrix} 2 & 3 \\ 3 & -6\end{bmatrix}$.

1. $\operatorname{tr} A = 2 + (-6) = -4$ and $\det A = -12 - 9 = -21$.
2. Characteristic equation: $\lambda^2 + 4\lambda - 21 = 0$.
3. Factor: $(\lambda + 7)(\lambda - 3) = 0$, so $\lambda = 3$ or $\lambda = -7$.
4. Check: $3 + (-7) = -4 = \operatorname{tr} A$ and $3(-7) = -21 = \det A$. ✓

For eigenvectors, row-reduce $A - 3I = \begin{bmatrix} -1 & 3 \\ 3 & -9\end{bmatrix}$: $x_1 = 3x_2$,
giving $(3, 1)$. And $A + 7I = \begin{bmatrix} 9 & 3 \\ 3 & 1\end{bmatrix}$: $x_2 = -3x_1$, giving
$(1, -3)$.

### Example 2

Find the eigenvalues of $A = \begin{bmatrix} 1 & 2 & 0 \\ 2 & 1 & 0 \\ 0 & 0 & 4\end{bmatrix}$.

1. Expand $\det(A - \lambda I)$ down column 3, which has only one nonzero entry:
$$\det(A - \lambda I) = (4 - \lambda)\begin{vmatrix} 1 - \lambda & 2 \\ 2 & 1 - \lambda\end{vmatrix} = (4 - \lambda)\big[(1 - \lambda)^2 - 4\big].$$
2. $(1 - \lambda)^2 - 4 = 0$ gives $1 - \lambda = \pm 2$, so $\lambda = -1$ or $\lambda = 3$.
3. The eigenvalues are $4$, $3$ and $-1$. Their sum is $6 = 1 + 1 + 4$, the trace. ✓

For $3 \times 3$ and larger matrices, finding roots of the characteristic polynomial by hand is
only practical when the matrix has structure (zeros, triangular blocks) or the roots are
nice. Software finds eigenvalues by entirely different iterative methods, because polynomial
roots are numerically unstable to compute from coefficients.

## Multiplicity

The **algebraic multiplicity** of an eigenvalue is its multiplicity as a root of the
characteristic polynomial. For instance if the characteristic polynomial is
$(\lambda - 2)^2(\lambda - 5)$, the eigenvalue 2 has algebraic multiplicity 2 and 5 has
multiplicity 1. (Up to an overall sign, that's the polynomial of the matrix $B$ in the last lesson: for a $3 \times 3$ matrix, $\det(A - \lambda I)$ has leading term $-\lambda^3$.) For a
triangular matrix, the characteristic polynomial is $\prod(a_{ii} - \lambda)$, so repeated
diagonal entries give repeated eigenvalues.

A real matrix can have complex eigenvalues: $\begin{bmatrix} 0 & -1 \\ 1 & 0\end{bmatrix}$ has
characteristic polynomial $\lambda^2 + 1$, with no real roots. That's the subject of a later
lesson.

## Similar matrices

$A$ and $B$ are **similar** if there is an invertible $P$ with $B = P^{-1}AP$. Similar matrices
describe the same transformation in different coordinates, and:

> *Theorem.* Similar matrices have the same characteristic polynomial, hence the same eigenvalues with the same multiplicities.

Proof: $B - \lambda I = P^{-1}AP - \lambda P^{-1}P = P^{-1}(A - \lambda I)P$, so by the product
rule $\det(B - \lambda I) = \det P^{-1}\det(A - \lambda I)\det P = \det(A - \lambda I)$.

The converse is false: $\begin{bmatrix} 2 & 1 \\ 0 & 2\end{bmatrix}$ and
$\begin{bmatrix} 2 & 0 \\ 0 & 2\end{bmatrix}$ have the same characteristic polynomial but
aren't similar (the only matrix similar to $2I$ is $2I$ itself). Also, "similar" is not the
same as "row equivalent".

### Example 3

For what value of $h$ is 3 an eigenvalue of $A = \begin{bmatrix} 2 & h \\ 3 & 6\end{bmatrix}$? What is the other eigenvalue then?

1. 3 is an eigenvalue exactly when $\det(A - 3I) = 0$: $\det\begin{bmatrix} -1 & h \\ 3 & 3\end{bmatrix} = -3 - 3h = 0$, so $h = -1$.
2. The eigenvalues add up to the trace, $2 + 6 = 8$, so the other one is $8 - 3 = 5$.
3. Check with the determinant: with $h = -1$, $\det A = 12 - (-1)(3) = 15 = 3 \cdot 5$. ✓

Using the trace and determinant this way saves solving the quadratic when one eigenvalue is already known.

## Common mistakes

- *Sign of the middle term.* For $2 \times 2$, it's $\lambda^2 - (\operatorname{tr} A)\lambda + \det A$; with $\operatorname{tr} A = -4$ the term is $+4\lambda$.
- *Computing $\det A - \lambda$* instead of $\det(A - \lambda I)$.
- *Expecting real roots always.* Real matrices can have complex eigenvalues.
- *Assuming same eigenvalues means similar.*
- *Dropping a factor* like $(4 - \lambda)$ when expanding, and missing an eigenvalue.

## Key points

- Eigenvalues are the roots of the characteristic equation $\det(A - \lambda I) = 0$.
- For $2 \times 2$: $\lambda^2 - (\operatorname{tr} A)\lambda + \det A = 0$.
- The eigenvalues sum to the trace and multiply to the determinant (with multiplicity).
- Algebraic multiplicity is the multiplicity as a root.
- Similar matrices ($B = P^{-1}AP$) share characteristic polynomials and eigenvalues.
