---
id: la-complex-eig
module: la-m8
title: Complex eigenvalues
minutes: 30
topics: [Complex eigenvalues]
drills: [la-complex-eig, la-rot-scale]
refs: [la-ref-factor]
---
## When no direction stays put

A rotation of the plane by $90^\circ$ turns *every* nonzero vector, so it has no real
eigenvectors. Its characteristic polynomial $\lambda^2 + 1$ has no real roots. But it does
have complex roots, $\pm i$, and those complex eigenvalues carry exactly the information
that describes the motion: an angle of rotation and a scaling factor. This lesson shows how
to read rotation and scaling from complex eigenvalues of a real $2 \times 2$ matrix.

## Complex numbers, briefly

A complex number is $z = a + bi$ with $i^2 = -1$; $a$ is its real part and $b$ its imaginary
part. Its **complex conjugate** is $\bar z = a - bi$, and its modulus (absolute value) is
$|z| = \sqrt{a^2 + b^2}$. Every quadratic with real coefficients has two roots in the complex
numbers, given by the quadratic formula; if the discriminant is negative, they form a
conjugate pair $a \pm bi$.

The definitions of eigenvalue and eigenvector carry over with complex scalars and vectors in
$\mathbb{C}^n$. A **complex eigenvalue** of a real matrix is a non-real root of its characteristic
polynomial.

## Complex eigenvalues of real matrices come in pairs

If $A$ is real and $A\mathbf{x} = \lambda\mathbf{x}$, then taking conjugates of everything,
$A\bar{\mathbf{x}} = \bar\lambda\bar{\mathbf{x}}$. So when $\lambda$ is a complex eigenvalue with
eigenvector $\mathbf{x}$, its conjugate $\bar\lambda$ is also an eigenvalue, with eigenvector
$\bar{\mathbf{x}}$.

## Rotation–scaling matrices

The model example is

$$C = \begin{bmatrix} a & -b \\ b & a\end{bmatrix}.$$

Its characteristic polynomial is $(a - \lambda)^2 + b^2$, so $\lambda = a \pm bi$. Write
$r = |\lambda| = \sqrt{a^2 + b^2}$ and let $\varphi$ be the angle of the point $(a, b)$ measured
from the positive $x$-axis. Then $a = r\cos\varphi$, $b = r\sin\varphi$ and

$$C = r\begin{bmatrix} \cos\varphi & -\sin\varphi \\ \sin\varphi & \cos\varphi\end{bmatrix}.$$

So $C$ is a **rotation–scaling matrix**: a rotation by $\varphi$ followed by scaling by $r$. The
modulus of the eigenvalue is the scale factor and its angle is the rotation angle. Repeated
multiplication by $C$ makes points spiral: outward if $r > 1$, inward if $r < 1$, around a
circle if $r = 1$.

In the complex plane, the eigenvalue $a + bi$ sits at the point $(a, b)$; its distance from 0 is the scale factor and its angle is the rotation angle:

![The complex plane with the eigenvalue λ = a + bi plotted as a point. The segment from 0 to λ has length r = |λ|, the angle φ between that segment and the positive real axis is the rotation angle, the real part a is measured along the real axis and the imaginary part b vertically. The conjugate a - bi is the mirror image below the real axis.](images/la-m8-complex-plane.svg)

```plot
{"x": [-4, 5], "y": [-3, 4], "equal": true, "segments": [{"from": [4.0, 0.0], "to": [3.12, 1.8], "arrow": true}, {"from": [3.12, 1.8], "to": [1.62, 2.81], "arrow": true}, {"from": [1.62, 2.81], "to": [0.0, 2.92], "arrow": true}, {"from": [0.0, 2.92], "to": [-1.31, 2.27], "arrow": true}, {"from": [-1.31, 2.27], "to": [-2.05, 1.18], "arrow": true}, {"from": [-2.05, 1.18], "to": [-2.13, 0.0], "arrow": true}, {"from": [-2.13, 0.0], "to": [-1.66, -0.96], "arrow": true}, {"from": [-1.66, -0.96], "to": [-0.86, -1.49], "arrow": true}, {"from": [-0.86, -1.49], "to": [0.0, -1.55], "arrow": true}, {"from": [0.0, -1.55], "to": [0.7, -1.21], "arrow": true}, {"from": [0.7, -1.21], "to": [1.09, -0.63], "arrow": true}, {"from": [1.09, -0.63], "to": [1.13, 0.0], "arrow": true}], "points": [{"at": [4.0, 0.0], "label": "x₀"}], "caption": "Iterates of a rotation–scaling matrix with r = 0.9 and angle 30°: an inward spiral"}
```

### Example 1

Find the eigenvalues of $C = \begin{bmatrix} \sqrt3 & -1 \\ 1 & \sqrt3\end{bmatrix}$ and describe the transformation.

1. Here $a = \sqrt3$, $b = 1$, so $\lambda = \sqrt3 \pm i$.
2. $r = \sqrt{3 + 1} = 2$, and $(\sqrt3, 1)$ is at angle $\varphi = 30^\circ$.
3. So $C$ rotates by $30^\circ$ counterclockwise and doubles lengths. Applying it 12 times rotates by $360^\circ$ and scales by $2^{12}$: $C^{12} = 4096I$.

## Every real $2 \times 2$ matrix with complex eigenvalues is a disguised rotation–scaling

> *Theorem.* Let $A$ be a real $2 \times 2$ matrix with a complex eigenvalue $\lambda = a - bi$ ($b \neq 0$) and associated eigenvector $\mathbf{v}$. Then $A = PCP^{-1}$, where
> $$P = [\,\operatorname{Re}\mathbf{v} \;\; \operatorname{Im}\mathbf{v}\,] \quad\text{and}\quad C = \begin{bmatrix} a & -b \\ b & a\end{bmatrix}.$$

In the coordinates given by the columns of $P$, $A$ acts as a rotation–scaling. The picture
is an elliptical spiral rather than a circular one, but the scale factor per step is still
$r = |\lambda|$.

### Example 2

Let $A = \begin{bmatrix} 1 & -2 \\ 1 & 3\end{bmatrix}$. Find the eigenvalues, the scale factor, and a factorization $A = PCP^{-1}$.

1. $\operatorname{tr} A = 4$, $\det A = 3 + 2 = 5$: $\lambda^2 - 4\lambda + 5 = 0$, so $\lambda = \dfrac{4 \pm \sqrt{16 - 20}}{2} = 2 \pm i$.
2. Scale factor $r = |2 \pm i| = \sqrt5 \approx 2.24$, so iterates spiral outward. The rotation angle of $C$ is that of $(2, 1)$: $\tan^{-1}(1/2) \approx 26.6^\circ$.
3. Eigenvector for $\lambda = 2 - i$: row 2 of $A - (2 - i)I$ is $[\,1 \;\; 1 + i\,]$, so $x_1 = -(1 + i)x_2$. Take $\mathbf{v} = (-1 - i,\ 1)$.
4. $\operatorname{Re}\mathbf{v} = (-1, 1)$, $\operatorname{Im}\mathbf{v} = (-1, 0)$. So $P = \begin{bmatrix} -1 & -1 \\ 1 & 0\end{bmatrix}$ and $C = \begin{bmatrix} 2 & -1 \\ 1 & 2\end{bmatrix}$.
5. Check $AP = PC$: both equal $\begin{bmatrix} -3 & -1 \\ 2 & -1\end{bmatrix}$. ✓

(With $\lambda = a - bi$, the matrix $C$ has $-b$ in the top right; here $b = 1$.)

### Example 3

Check that $\mathbf{v} = (1, -i)$ is an eigenvector of the $90^\circ$ rotation $R = \begin{bmatrix} 0 & -1 \\ 1 & 0\end{bmatrix}$, and find its eigenvalue.

1. $R\mathbf{v} = (0 \cdot 1 + (-1)(-i),\ 1 \cdot 1 + 0) = (i, 1)$.
2. Compare with $i\mathbf{v} = (i, -i^2) = (i, 1)$. They match, so $R\mathbf{v} = i\mathbf{v}$: eigenvalue $i$.
3. By conjugation, $\bar{\mathbf{v}} = (1, i)$ is an eigenvector for $-i$.

Here $a = 0$ and $b = 1$, so $r = 1$ and the angle is $90^\circ$: exactly the rotation we started with. Complex arithmetic is just a bookkeeping device; the real content is "rotate by $90^\circ$, don't scale".

## Common mistakes

- *Concluding there are no eigenvalues* when the discriminant is negative. There are two complex ones.
- *Forgetting the pair.* If $2 + i$ is an eigenvalue of a real matrix, so is $2 - i$.
- *Using $a$ instead of $r$ as the scale factor.* The scaling per step is $|\lambda| = \sqrt{a^2 + b^2}$.
- *Mixing up the sign convention* in $A = PCP^{-1}$: it pairs $\lambda = a - bi$ with $C = \begin{bmatrix} a & -b \\ b & a\end{bmatrix}$.

## Key points

- Real matrices can have complex eigenvalues; they come in conjugate pairs $a \pm bi$, with conjugate eigenvectors.
- $\begin{bmatrix} a & -b \\ b & a\end{bmatrix}$ rotates by the angle of $(a, b)$ and scales by $r = \sqrt{a^2 + b^2}$.
- Any real $2 \times 2$ matrix with eigenvalues $a \pm bi$ is similar to that rotation–scaling matrix: $A = PCP^{-1}$ with $P = [\,\operatorname{Re}\mathbf{v} \;\; \operatorname{Im}\mathbf{v}\,]$.
- Iterates spiral outward if $|\lambda| > 1$, inward if $|\lambda| < 1$.
