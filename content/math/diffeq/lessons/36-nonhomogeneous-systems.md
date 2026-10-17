---
id: de-nonhomog-systems
module: de-m8
title: Nonhomogeneous systems and the matrix exponential
minutes: 40
topics: [Nonhomogeneous systems, Matrix exponential]
drills: [de-sys-const-forcing, de-sys-exp-forcing, de-matrix-exp]
refs: [de-ref-solutions, de-ref-methods]
---
## Forcing a system

The last two lessons solved $\mathbf{x}' = A\mathbf{x}$ completely. Real systems are usually
driven from outside: brine pumped into a tank, a voltage source in one loop of a circuit, a
drug infused into the bloodstream. That adds a **forcing vector** $\mathbf{g}(t)$:

$$\mathbf{x}' = A\mathbf{x} + \mathbf{g}(t).$$

The structure is the same as for a single equation (Lesson 22). If $\mathbf{x}_p$ is any one
solution, every solution is

$$\mathbf{x} = \mathbf{x}_c + \mathbf{x}_p,$$

where $\mathbf{x}_c$ is the general solution of the homogeneous system. The reason is also the
same: the difference of two solutions of the forced system solves the unforced one. So the
work is finding one $\mathbf{x}_p$, and this lesson gives two ways, undetermined coefficients
and variation of parameters, after first packaging the homogeneous solutions into a matrix.

## Fundamental matrices

Put two independent solutions of $\mathbf{x}' = A\mathbf{x}$ side by side as columns:

$$\Psi(t) = \big[\mathbf{x}^{(1)}(t)\ \ \mathbf{x}^{(2)}(t)\big].$$

This is a **fundamental matrix**. Its determinant is the Wronskian (Lesson 33), so it is
invertible for every $t$. Each column solves the system, so $\Psi' = A\Psi$, and the general
homogeneous solution is $\mathbf{x}_c = \Psi(t)\mathbf{c}$ for a constant vector $\mathbf{c}$.
An initial condition $\mathbf{x}(0) = \mathbf{x}_0$ gives $\mathbf{c} = \Psi(0)^{-1}\mathbf{x}_0$.

## The matrix exponential

For a single equation $x' = ax$, the solution is $x = e^{at}x_0$. The same formula works for
systems once $e^{At}$ is defined, using the power series of the exponential:

$$e^{At} = I + At + \frac{A^2t^2}{2!} + \frac{A^3t^3}{3!} + \cdots$$

This **matrix exponential** always converges. Differentiating term by term gives
$\dfrac{d}{dt}e^{At} = A + A^2t + \dfrac{A^3t^2}{2!} + \cdots = Ae^{At}$, and at $t = 0$ it is $I$.
So $\mathbf{x} = e^{At}\mathbf{x}_0$ solves $\mathbf{x}' = A\mathbf{x}$, $\mathbf{x}(0) = \mathbf{x}_0$.

In other words, $e^{At}$ is the fundamental matrix that equals $I$ at $t = 0$. Any fundamental
matrix gives it:

$$e^{At} = \Psi(t)\Psi(0)^{-1}.$$

(Both sides solve $X' = AX$ with $X(0) = I$, and that matrix IVP has only one solution.) Two
easy special cases: for a diagonal matrix, exponentiate the diagonal entries; and if
$A = \lambda I + N$ with $N^2 = 0$, the series for $e^{Nt}$ stops after two terms, so
$e^{At} = e^{\lambda t}(I + Nt)$. For example,
$\begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}$ gives $e^{At} = e^{2t}\begin{bmatrix} 1 & t \\ 0 & 1 \end{bmatrix}$.

### Example 1

Find $e^{At}$ for $A = \begin{bmatrix} 1 & 1 \\ 4 & 1 \end{bmatrix}$.

- From Lesson 33, Example 3: $\lambda = 3$ with $(1, 2)$ and $\lambda = -1$ with $(1, -2)$. So
  $\Psi = \begin{bmatrix} e^{3t} & e^{-t} \\ 2e^{3t} & -2e^{-t} \end{bmatrix}$.
- $\Psi(0) = \begin{bmatrix} 1 & 1 \\ 2 & -2 \end{bmatrix}$ has determinant $-4$, so
  $\Psi(0)^{-1} = \dfrac{1}{-4}\begin{bmatrix} -2 & -1 \\ -2 & 1 \end{bmatrix} = \begin{bmatrix} \frac12 & \frac14 \\ \frac12 & -\frac14 \end{bmatrix}$.
- Multiply:

$$e^{At} = \begin{bmatrix} \frac12(e^{3t} + e^{-t}) & \frac14(e^{3t} - e^{-t}) \\ e^{3t} - e^{-t} & \frac12(e^{3t} + e^{-t}) \end{bmatrix}.$$

- Check: at $t = 0$ this is $I$. Its first column is the solution starting at $(1, 0)$.

## Undetermined coefficients for systems

When $A$ is constant and $\mathbf{g}$ is built from constants, polynomials, exponentials, sines
and cosines, guess $\mathbf{x}_p$ of the same form with unknown *vector* coefficients.

- **Constant forcing** $\mathbf{g} = \mathbf{b}$: try a constant $\mathbf{x}_p = \mathbf{a}$. Then
  $\mathbf{0} = A\mathbf{a} + \mathbf{b}$, so $\mathbf{a} = -A^{-1}\mathbf{b}$ (if $\det A \ne 0$). This
  constant solution is the equilibrium of the forced system.
- **Exponential forcing** $\mathbf{g} = e^{rt}\mathbf{b}$: try $\mathbf{x}_p = e^{rt}\mathbf{a}$. Then
  $re^{rt}\mathbf{a} = e^{rt}(A\mathbf{a} + \mathbf{b})$, so $(rI - A)\mathbf{a} = \mathbf{b}$. This works
  when $r$ is not an eigenvalue of $A$.
- **Polynomial forcing** $\mathbf{g} = t\mathbf{b}_1 + \mathbf{b}_0$: try $\mathbf{x}_p = t\mathbf{a}_1 + \mathbf{a}_0$
  and match powers of $t$.

If $r$ *is* an eigenvalue, the guess must include $te^{rt}\mathbf{a} + e^{rt}\mathbf{d}$ (both
vectors unknown), which is fiddly; variation of parameters is usually simpler.

### Example 2: brine in two tanks

Use the tanks of Lesson 33, Example 2, but now the 5 L/min entering tank 1 is brine at
2 g/L, bringing in 10 g/min of salt:

$$\mathbf{Q}' = \begin{bmatrix} -0.1 & 0.05 \\ 0.1 & -0.1 \end{bmatrix}\mathbf{Q} + \begin{bmatrix} 10 \\ 0 \end{bmatrix}.$$

- Constant guess $\mathbf{a}$: $-0.1a_1 + 0.05a_2 = -10$ and $0.1a_1 - 0.1a_2 = 0$.
- The second gives $a_1 = a_2$; then $-0.05a_1 = -10$, so $\mathbf{a} = (200, 200)$.
- The eigenvalues of $A$ are $-0.1 \pm 0.05\sqrt2$, both negative, so $\mathbf{x}_c \to \mathbf{0}$
  and every solution approaches $(200, 200)$ g: both tanks end at 2 g/L, the inflow
  concentration, as they should.

```plot
{"x": [0, 150], "y": [0, 230], "xLabel": "t (min)", "yLabel": "salt (g)", "functions": [{"f": "200 - 170.71*exp(-0.029289*x) - 29.289*exp(-0.170711*x)"}, {"f": "200 - 241.42*exp(-0.029289*x) + 41.421*exp(-0.170711*x)", "dashed": true}, {"f": "200", "dashed": true}], "caption": "Example 2 starting with fresh water in both tanks: Q₁ (solid) leads, Q₂ (dashed) follows, and both approach the equilibrium 200 g."}
```

### Example 3

Find a particular solution of $\mathbf{x}' = \begin{bmatrix} 1 & 1 \\ 4 & 1 \end{bmatrix}\mathbf{x} + \begin{bmatrix} e^t \\ 0 \end{bmatrix}$.

- $\mathbf{g} = e^t(1, 0)$ and $r = 1$ is not an eigenvalue ($3$ and $-1$), so try $e^t\mathbf{a}$.
- $(I - A)\mathbf{a} = \mathbf{b}$: $\begin{bmatrix} 0 & -1 \\ -4 & 0 \end{bmatrix}\mathbf{a} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$, so
  $a_2 = -1$ and $a_1 = 0$.
- $\mathbf{x}_p = e^t\begin{bmatrix} 0 \\ -1 \end{bmatrix}$. Check the first row:
  $x_1' = 0$ and $x_1 + x_2 + e^t = 0 - e^t + e^t = 0$. ✓
- General solution: $c_1e^{3t}(1, 2) + c_2e^{-t}(1, -2) + e^t(0, -1)$.

## Variation of parameters

This method works for any continuous $\mathbf{g}(t)$, even when $A$ depends on $t$. Replace the
constant $\mathbf{c}$ in $\Psi\mathbf{c}$ by a function: $\mathbf{x} = \Psi(t)\mathbf{u}(t)$. Then

$$\mathbf{x}' = \Psi'\mathbf{u} + \Psi\mathbf{u}' = A\Psi\mathbf{u} + \Psi\mathbf{u}'.$$

Setting this equal to $A\Psi\mathbf{u} + \mathbf{g}$ leaves $\Psi\mathbf{u}' = \mathbf{g}$, so

$$\mathbf{u}' = \Psi^{-1}\mathbf{g}, \qquad \mathbf{x}_p = \Psi(t)\int\Psi(t)^{-1}\mathbf{g}(t)\,dt.$$

With $\Psi = e^{At}$ (constant $A$), using $(e^{At})^{-1} = e^{-At}$ and an IVP, this becomes the
**variation of constants formula**

$$\mathbf{x}(t) = e^{At}\mathbf{x}_0 + \int_0^te^{A(t - s)}\mathbf{g}(s)\,ds,$$

the exact analog of the integrating-factor solution of $x' = ax + g$ in Lesson 8: the
initial state evolved forward, plus every past input evolved forward from when it arrived.

### Example 4

Find a particular solution of $\mathbf{x}' = \begin{bmatrix} 1 & 1 \\ 4 & 1 \end{bmatrix}\mathbf{x} + \begin{bmatrix} 0 \\ 4e^{-t} \end{bmatrix}$.
Here $r = -1$ is an eigenvalue, so the simple guess fails.

- $\det\Psi = -2e^{2t} - 2e^{2t} = -4e^{2t}$, so
  $\Psi^{-1} = \dfrac{1}{-4e^{2t}}\begin{bmatrix} -2e^{-t} & -e^{-t} \\ -2e^{3t} & e^{3t} \end{bmatrix} = \begin{bmatrix} \frac12e^{-3t} & \frac14e^{-3t} \\ \frac12e^{t} & -\frac14e^{t} \end{bmatrix}$.
- $\mathbf{u}' = \Psi^{-1}\mathbf{g} = \begin{bmatrix} e^{-4t} \\ -1 \end{bmatrix}$, so $\mathbf{u} = \begin{bmatrix} -\frac14e^{-4t} \\ -t \end{bmatrix}$
  (any antiderivative will do).
- $\mathbf{x}_p = \Psi\mathbf{u} = \begin{bmatrix} -\frac14e^{-t} - te^{-t} \\ -\frac12e^{-t} + 2te^{-t} \end{bmatrix}$.
- The $te^{-t}$ terms are the system's version of resonance: the forcing rate matches an
  eigenvalue. Substituting back confirms the answer.

## Common mistakes

- **Scalar thinking with matrices.** $e^{At}$ is not the matrix of entrywise exponentials
  $e^{a_{ij}t}$ unless $A$ is diagonal, and $e^{A + B} \ne e^Ae^B$ in general.
- **Wrong order of multiplication.** It is $\Psi(t)\Psi(0)^{-1}$ and $\Psi(t)\int\Psi^{-1}\mathbf{g}$;
  matrix products don't commute.
- **Sign in the constant case.** $A\mathbf{a} + \mathbf{b} = \mathbf{0}$ gives $\mathbf{a} = -A^{-1}\mathbf{b}$, not $A^{-1}\mathbf{b}$.
- **$(A - rI)$ instead of $(rI - A)$** for exponential forcing, which flips the sign of $\mathbf{a}$.
- **Fitting initial conditions to $\mathbf{x}_c$ alone.** Fit them to $\mathbf{x}_c + \mathbf{x}_p$.

## Key points

- $\mathbf{x}' = A\mathbf{x} + \mathbf{g}$: general solution $\mathbf{x}_c + \mathbf{x}_p$.
- A fundamental matrix $\Psi$ has independent solutions as columns; $\mathbf{x}_c = \Psi\mathbf{c}$.
- $e^{At} = I + At + \frac{A^2t^2}{2!} + \cdots = \Psi(t)\Psi(0)^{-1}$; it solves the IVP: $\mathbf{x} = e^{At}\mathbf{x}_0$.
- Undetermined coefficients: constant $\mathbf{b}$ gives $\mathbf{a} = -A^{-1}\mathbf{b}$; $e^{rt}\mathbf{b}$ gives $(rI - A)\mathbf{a} = \mathbf{b}$ ($r$ not an eigenvalue).
- Variation of parameters: $\mathbf{x}_p = \Psi\int\Psi^{-1}\mathbf{g}\,dt$; with $e^{At}$, $\mathbf{x} = e^{At}\mathbf{x}_0 + \int_0^te^{A(t - s)}\mathbf{g}(s)\,ds$.
