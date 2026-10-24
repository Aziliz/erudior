---
id: pc-matrix-inverse
module: pc-m6
title: Inverse matrices
minutes: 30
topics: [Inverse matrices]
drills: [pc-inverse-2x2, pc-solve-inverse]
refs: [pc-ref-matrices-series]
---
## Dividing by a matrix

To solve $5x = 15$ you multiply both sides by $\frac15$, the number that undoes multiplication by 5. The last lesson wrote a linear system as $AX = B$. If some matrix $A^{-1}$ undoes $A$, the same move solves the system: $X = A^{-1}B$. This lesson defines that inverse, gives a quick formula for $2 \times 2$ matrices, shows how row reduction finds it in general, and explains when it fails to exist.

## Definition

An $n \times n$ matrix $A$ is **invertible** if there is an $n \times n$ matrix $A^{-1}$, its **inverse matrix**, with

$$AA^{-1} = A^{-1}A = I_n.$$

Only square matrices can have inverses. When an inverse exists it is unique. A square matrix with no inverse is called **singular**.

To check a claimed inverse, multiply: if the product is $I$, it's right.

## The $2 \times 2$ formula

For $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$, the number $ad - bc$ is the **determinant** of $A$, written $\det A$ or $|A|$. If $\det A \ne 0$,

$$A^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}.$$

In words: swap the main-diagonal entries, negate the other two, divide by the determinant. Verify by multiplying:

$$\begin{bmatrix} a & b \\ c & d \end{bmatrix}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix} = \begin{bmatrix} ad - bc & -ab + ba \\ cd - dc & -cb + da \end{bmatrix} = (ad - bc)\,I.$$

Dividing by $ad - bc$ leaves $I$. If $ad - bc = 0$ that division is impossible, and in fact no inverse exists: the matrix is singular.

### Example 1

Find the inverse of $A = \begin{bmatrix} 3 & 5 \\ 1 & 2 \end{bmatrix}$, and use it to solve $\begin{cases} 3x + 5y = 4 \\ x + 2y = 1 \end{cases}$.

$\det A = 3(2) - 5(1) = 1$, so

$$A^{-1} = \frac11\begin{bmatrix} 2 & -5 \\ -1 & 3 \end{bmatrix} = \begin{bmatrix} 2 & -5 \\ -1 & 3 \end{bmatrix}.$$

The system is $AX = B$ with $B = \begin{bmatrix} 4 \\ 1 \end{bmatrix}$. Multiply both sides *on the left* by $A^{-1}$:

$$X = A^{-1}B = \begin{bmatrix} 2(4) + (-5)(1) \\ -1(4) + 3(1) \end{bmatrix} = \begin{bmatrix} 3 \\ -1 \end{bmatrix}.$$

So $x = 3$, $y = -1$. Check: $3(3) + 5(-1) = 4$ ✓ and $3 + 2(-1) = 1$ ✓.

The side matters. From $AX = B$, multiplying on the left gives $A^{-1}AX = A^{-1}B$, i.e. $X = A^{-1}B$. Writing $BA^{-1}$ is wrong (and here not even defined, since $B$ is $2 \times 1$).

### Example 2

Is $M = \begin{bmatrix} 4 & 6 \\ 2 & 3 \end{bmatrix}$ invertible?

$\det M = 4(3) - 6(2) = 0$. No: $M$ is singular. Notice that the first row is twice the second. The system $MX = B$ then has either no solution or infinitely many, never exactly one.

## Finding an inverse by row reduction

For larger matrices, write $A$ and $I$ side by side, $[A \mid I]$, and row-reduce. If the left side becomes $I$, the right side has become $A^{-1}$:

$$[A \mid I] \xrightarrow{\text{row operations}} [I \mid A^{-1}].$$

![Left: the 3 by 3 matrix A with rows (1, 1, 0), (1, 2, 1), (0, 1, 2) written beside the identity I. An arrow labeled row operations points right to I written beside A inverse, whose rows are (3, −2, 1), (−2, 2, −1), (1, −1, 1). This is Example 3 below.](images/pc-m6-inverse-by-rows.svg)

Why this works: the row operations that turn $A$ into $I$ amount to multiplying on the left by $A^{-1}$; doing the same operations to $I$ produces $A^{-1}I = A^{-1}$. If the left side develops a row of zeros, $A$ is singular.

### Example 3

Find $A^{-1}$ for $A = \begin{bmatrix} 1 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 2 \end{bmatrix}$.

Start with $\left[\begin{array}{ccc|ccc} 1 & 1 & 0 & 1 & 0 & 0 \\ 1 & 2 & 1 & 0 & 1 & 0 \\ 0 & 1 & 2 & 0 & 0 & 1 \end{array}\right]$.

1. $R_2 - R_1 \to R_2$: row 2 becomes $\begin{bmatrix} 0 & 1 & 1 & -1 & 1 & 0 \end{bmatrix}$.
2. $R_3 - R_2 \to R_3$: row 3 becomes $\begin{bmatrix} 0 & 0 & 1 & 1 & -1 & 1 \end{bmatrix}$.
3. $R_2 - R_3 \to R_2$: row 2 becomes $\begin{bmatrix} 0 & 1 & 0 & -2 & 2 & -1 \end{bmatrix}$.
4. $R_1 - R_2 \to R_1$: row 1 becomes $\begin{bmatrix} 1 & 0 & 0 & 3 & -2 & 1 \end{bmatrix}$.

$$A^{-1} = \begin{bmatrix} 3 & -2 & 1 \\ -2 & 2 & -1 \\ 1 & -1 & 1 \end{bmatrix}.$$

Check one entry of $AA^{-1}$: row 2 of $A$ times column 1 of $A^{-1}$ is $1(3) + 2(-2) + 1(1) = 0$, as the $(2, 1)$ entry of $I$ should be.

## Properties

- $(A^{-1})^{-1} = A$.
- $(AB)^{-1} = B^{-1}A^{-1}$ (reverse order, like taking off socks and shoes).
- $(kA)^{-1} = \frac1k A^{-1}$ for $k \ne 0$.
- If $A$ is invertible, $AX = B$ has exactly one solution, $X = A^{-1}B$, for every $B$.

## Common mistakes

- *Forgetting to divide by the determinant* in the $2 \times 2$ formula.
- *Swapping the wrong entries.* Swap $a$ and $d$; negate $b$ and $c$.
- *Multiplying on the wrong side.* $X = A^{-1}B$, not $BA^{-1}$.
- *Inverting a singular matrix.* Check $\det A \ne 0$ first.
- *Inverting non-square matrices.* Only square matrices can have inverses.

## Key points

- $A^{-1}$ satisfies $AA^{-1} = A^{-1}A = I$; it exists only for square matrices with nonzero determinant.
- $2 \times 2$: $A^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$.
- General method: row-reduce $[A \mid I]$ to $[I \mid A^{-1}]$.
- Solve $AX = B$ by $X = A^{-1}B$ (inverse on the left).
- $(AB)^{-1} = B^{-1}A^{-1}$.
