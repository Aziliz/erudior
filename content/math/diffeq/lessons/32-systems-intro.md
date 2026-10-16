---
id: de-systems-intro
module: de-m8
title: Systems of first-order equations
minutes: 30
topics: [Linear systems]
drills: [de-eigenvalues-2x2, de-system-convert]
refs: [de-ref-solutions]
---
## Many quantities changing together

So far each problem had one unknown function. Real systems usually have several that
influence each other: predators and prey, salt in two connected tanks, currents in the
loops of a circuit, position and velocity of a mass. This module studies **systems** of
first-order equations,

$$x_1' = f_1(t, x_1, \dots, x_n), \quad \dots, \quad x_n' = f_n(t, x_1, \dots, x_n),$$

especially **linear systems with constant coefficients**, which can be solved completely
with eigenvalues and eigenvectors from linear algebra.

## Higher-order equations become systems

Any $n$th-order equation can be rewritten as $n$ first-order equations. For
$y'' + py' + qy = g$, let $x_1 = y$ and $x_2 = y'$. Then

$$x_1' = x_2, \qquad x_2' = -qx_1 - px_2 + g.$$

This is how numerical solvers (Lesson 17) handle higher-order equations, and it shows that
systems are the more general framework.

### Example 1

Convert $y'' + 3y' + 2y = 0$ to a system. With $x_1 = y$, $x_2 = y'$:
$x_1' = x_2$, $x_2' = -2x_1 - 3x_2$.

## Matrix form

A linear system with constant coefficients

$$x_1' = ax_1 + bx_2, \qquad x_2' = cx_1 + dx_2$$

is written compactly as

$$\mathbf{x}' = A\mathbf{x}, \qquad \mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}, \quad A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}.$$

For Example 1, $A = \begin{bmatrix} 0 & 1 \\ -2 & -3 \end{bmatrix}$. A nonhomogeneous system
adds a forcing vector: $\mathbf{x}' = A\mathbf{x} + \mathbf{g}(t)$.

### Example 2: two tanks

Tank 1 and tank 2 each hold 100 L. Water flows from tank 1 to tank 2 at 10 L/min, from tank 2
back to tank 1 at 5 L/min, and out of tank 2 at 5 L/min; pure water enters tank 1 at
5 L/min. With $Q_1$, $Q_2$ the salt amounts:

$$Q_1' = -\frac{10}{100}Q_1 + \frac{5}{100}Q_2, \qquad Q_2' = \frac{10}{100}Q_1 - \frac{10}{100}Q_2,$$

so $A = \begin{bmatrix} -0.1 & 0.05 \\ 0.1 & -0.1 \end{bmatrix}$. (Tank 2 loses 10 L/min in
total: 5 back to tank 1 and 5 out.)

## The structure of solutions

The theory parallels Lesson 18:

- **Superposition**: if $\mathbf{x}^{(1)}$ and $\mathbf{x}^{(2)}$ solve $\mathbf{x}' = A\mathbf{x}$,
  so does $c_1\mathbf{x}^{(1)} + c_2\mathbf{x}^{(2)}$.
- **Wronskian**: $W = \det\big[\mathbf{x}^{(1)}\ \mathbf{x}^{(2)}\big]$. If it's nonzero, the two
  solutions form a fundamental set, and every solution is $c_1\mathbf{x}^{(1)} + c_2\mathbf{x}^{(2)}$.
- An IVP $\mathbf{x}' = A\mathbf{x}$, $\mathbf{x}(0) = \mathbf{x}_0$ has exactly one solution.

## Eigenvalues: the key idea

For a single equation $x' = ax$ the solution is $e^{at}x_0$. For a system, try a solution
that changes only by an exponential factor along a fixed direction:

$$\mathbf{x} = e^{\lambda t}\mathbf{v}.$$

Then $\mathbf{x}' = \lambda e^{\lambda t}\mathbf{v}$ and $A\mathbf{x} = e^{\lambda t}A\mathbf{v}$. They're equal
exactly when

$$A\mathbf{v} = \lambda\mathbf{v}.$$

So $\lambda$ must be an **eigenvalue** of $A$ and $\mathbf{v}$ a corresponding **eigenvector**
(nonzero). Eigenvalues solve the **characteristic equation**

$$\det(A - \lambda I) = 0.$$

For a $2 \times 2$ matrix this is

$$\lambda^2 - (\operatorname{tr}A)\lambda + \det A = 0,$$

where the **trace** $\operatorname{tr}A = a + d$ and $\det A = ad - bc$. Once you have $\lambda$, find
$\mathbf{v}$ by solving $(A - \lambda I)\mathbf{v} = \mathbf{0}$; the two rows are multiples of each
other, so one row is enough.

### Example 3

Find the eigenvalues and eigenvectors of $A = \begin{bmatrix} 1 & 1 \\ 4 & 1 \end{bmatrix}$.

- $\operatorname{tr}A = 2$, $\det A = 1 - 4 = -3$. Characteristic equation $\lambda^2 - 2\lambda - 3 = (\lambda - 3)(\lambda + 1) = 0$.
- $\lambda_1 = 3$: $A - 3I = \begin{bmatrix} -2 & 1 \\ 4 & -2 \end{bmatrix}$. First row: $-2v_1 + v_2 = 0$, so
  $\mathbf{v}^{(1)} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$.
- $\lambda_2 = -1$: $A + I = \begin{bmatrix} 2 & 1 \\ 4 & 2 \end{bmatrix}$. $2v_1 + v_2 = 0$, so
  $\mathbf{v}^{(2)} = \begin{bmatrix} 1 \\ -2 \end{bmatrix}$.
- General solution: $\mathbf{x} = c_1e^{3t}\begin{bmatrix} 1 \\ 2 \end{bmatrix} + c_2e^{-t}\begin{bmatrix} 1 \\ -2 \end{bmatrix}$.

### Example 4: the link to the characteristic equation

For Example 1's matrix $\begin{bmatrix} 0 & 1 \\ -2 & -3 \end{bmatrix}$: trace $-3$, determinant $2$,
so $\lambda^2 + 3\lambda + 2 = 0$. That's exactly the characteristic equation of
$y'' + 3y' + 2y = 0$. Eigenvalues of the system are the characteristic roots of the equation.

## Phase plane

Instead of graphing $x_1$ and $x_2$ against $t$, we usually plot the curve
$(x_1(t), x_2(t))$ in the $x_1x_2$-plane, the **phase plane**. The system assigns a velocity
vector $A\mathbf{x}$ to every point, giving a **direction field** (vector field); solution
curves, called **trajectories**, follow it. A picture with several trajectories is a
**phase portrait**. Where $A\mathbf{x} = \mathbf{0}$ there's an equilibrium (a **critical point**);
for invertible $A$ the only one is the origin.

```plot
{"x": [-3, 3], "y": [-3, 3], "xLabel": "x₁", "yLabel": "x₂", "equal": true, "vectorField": {"u": "x + y", "v": "4x + y", "step": 0.5}, "functions": [{"f": "2x", "dashed": true, "label": "v⁽¹⁾ (λ = 3)"}, {"f": "-2x", "dashed": true, "label": "v⁽²⁾ (λ = −1)"}], "curves": [{"x": "0.5exp(3t) + exp(-t)", "y": "exp(3t) - 2exp(-t)", "t": [-2, 1]}, {"x": "-0.5exp(3t) - exp(-t)", "y": "-exp(3t) + 2exp(-t)", "t": [-2, 1]}, {"x": "0.5exp(3t) - exp(-t)", "y": "exp(3t) + 2exp(-t)", "t": [-2, 1]}, {"x": "-0.5exp(3t) + exp(-t)", "y": "-exp(3t) - 2exp(-t)", "t": [-2, 1]}], "caption": "Phase portrait of x′ = Ax with A = [[1, 1], [4, 1]]: trajectories come in along v⁽²⁾ and leave along v⁽¹⁾."}
```

The straight-line solutions run along the eigenvector directions: outward along
$\mathbf{v}^{(1)}$ (growth, $\lambda = 3$) and inward along $\mathbf{v}^{(2)}$ (decay, $\lambda = -1$).
The next two lessons classify such pictures.

## Common mistakes

- **Mixing up rows and columns** of $A$: row $i$ holds the coefficients in the equation for $x_i'$.
- **Sign of the trace term.** The characteristic equation is $\lambda^2 - (\operatorname{tr}A)\lambda + \det A = 0$.
- **Using the zero vector** as an eigenvector. Eigenvectors must be nonzero; any nonzero
  multiple works.
- **Forgetting the $g$ term** when converting a forced equation to a system.

## Key points

- Higher-order equations become first-order systems via $x_1 = y$, $x_2 = y'$, ….
- $\mathbf{x}' = A\mathbf{x}$; trying $e^{\lambda t}\mathbf{v}$ requires $A\mathbf{v} = \lambda\mathbf{v}$.
- $2 \times 2$: $\lambda^2 - (\operatorname{tr}A)\lambda + \det A = 0$.
- Distinct eigenvalues give $\mathbf{x} = c_1e^{\lambda_1t}\mathbf{v}^{(1)} + c_2e^{\lambda_2t}\mathbf{v}^{(2)}$.
