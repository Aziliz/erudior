---
id: de-eigen-real
module: de-m8
title: Real eigenvalues and phase portraits
minutes: 35
topics: [Phase portraits]
drills: [de-system-ivp, de-eigenvalues-2x2]
refs: [de-ref-solutions]
---
## Solving and picturing $\mathbf{x}' = A\mathbf{x}$

Last lesson showed that each eigenpair $(\lambda, \mathbf{v})$ of $A$ gives a solution
$e^{\lambda t}\mathbf{v}$. When $A$ ($2 \times 2$) has two distinct real eigenvalues, the two
solutions are independent (eigenvectors for different eigenvalues are never parallel), so

$$\mathbf{x}(t) = c_1e^{\lambda_1t}\mathbf{v}^{(1)} + c_2e^{\lambda_2t}\mathbf{v}^{(2)}.$$

This lesson solves IVPs with that formula and, more importantly, reads off the geometry:
what trajectories do near the equilibrium at the origin.

## Solving an IVP

### Example 1

Solve $\mathbf{x}' = \begin{bmatrix} 1 & 1 \\ 4 & 1 \end{bmatrix}\mathbf{x}$, $\mathbf{x}(0) = \begin{bmatrix} 2 \\ 0 \end{bmatrix}$.

- From Lesson 33: $\lambda = 3$, $\mathbf{v} = (1, 2)$; $\lambda = -1$, $\mathbf{v} = (1, -2)$.
- At $t = 0$: $c_1\begin{bmatrix} 1 \\ 2 \end{bmatrix} + c_2\begin{bmatrix} 1 \\ -2 \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \end{bmatrix}$, so
  $c_1 + c_2 = 2$ and $2c_1 - 2c_2 = 0$: $c_1 = c_2 = 1$.
- $x_1 = e^{3t} + e^{-t}$, $x_2 = 2e^{3t} - 2e^{-t}$.

### Example 2

Solve $x_1' = -2x_1 + x_2$, $x_2' = x_1 - 2x_2$ with $x_1(0) = 3$, $x_2(0) = 1$.

- $A = \begin{bmatrix} -2 & 1 \\ 1 & -2 \end{bmatrix}$: trace $-4$, det $3$, so $\lambda^2 + 4\lambda + 3 = 0$,
  $\lambda = -1, -3$.
- $\lambda = -1$: $A + I = \begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}$, $\mathbf{v} = (1, 1)$.
- $\lambda = -3$: $A + 3I = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$, $\mathbf{v} = (1, -1)$.
- $c_1 + c_2 = 3$, $c_1 - c_2 = 1$: $c_1 = 2$, $c_2 = 1$.
- $x_1 = 2e^{-t} + e^{-3t}$, $x_2 = 2e^{-t} - e^{-3t}$. Both decay to 0.

## Three portraits for real eigenvalues

The signs of the eigenvalues decide everything.

### Saddle point: $\lambda_1 > 0 > \lambda_2$

The solution along $\mathbf{v}^{(2)}$ decays into the origin, the one along $\mathbf{v}^{(1)}$ grows
away. Every other trajectory comes in roughly parallel to $\mathbf{v}^{(2)}$, swings near the
origin, and leaves roughly parallel to $\mathbf{v}^{(1)}$, like water flowing past a mountain
pass. Almost every solution goes to infinity: a **saddle point** is **unstable**. Example 1
and the figure in Lesson 33 show one. Test: $\det A < 0$ exactly when the eigenvalues have
opposite signs.

### Nodal sink: $\lambda_1 < \lambda_2 < 0$

Both terms decay, so every trajectory approaches the origin: an asymptotically stable
**node** (a **sink**). Which direction do they come in along? As $t \to \infty$ the term with
the less negative eigenvalue, $\lambda_2$, decays more slowly and dominates, so trajectories
enter tangent to the **slow eigenvector** $\mathbf{v}^{(2)}$. Looking backward in time
($t \to -\infty$), the fast term dominates, so far from the origin trajectories run parallel
to the fast eigenvector.

```plot
{"x": [-3, 3], "y": [-3, 3], "xLabel": "x₁", "yLabel": "x₂", "equal": true, "vectorField": {"u": "-2x + y", "v": "x - 2y", "step": 0.5}, "functions": [{"f": "x", "dashed": true, "label": "slow: v = (1, 1), λ = −1"}, {"f": "-x", "dashed": true, "label": "fast: v = (1, −1), λ = −3"}], "curves": [{"x": "2exp(-t) + exp(-3t)", "y": "2exp(-t) - exp(-3t)", "t": [-0.4, 6]}, {"x": "-2exp(-t) - exp(-3t)", "y": "-2exp(-t) + exp(-3t)", "t": [-0.4, 6]}, {"x": "exp(-t) - 2exp(-3t)", "y": "exp(-t) + 2exp(-3t)", "t": [-0.2, 6]}, {"x": "-exp(-t) + 2exp(-3t)", "y": "-exp(-t) - 2exp(-3t)", "t": [-0.2, 6]}], "caption": "Nodal sink for Example 2: trajectories approach the origin tangent to the slow eigenvector (1, 1)."}
```

### Nodal source: $0 < \lambda_1 < \lambda_2$

The same picture with arrows reversed: everything flows out. It's **unstable**. Trajectories
leave the origin tangent to the slower-growing eigenvector (the one with the smaller
positive eigenvalue).

## Summary table

| Eigenvalues | Name | Stability |
|---|---|---|
| $\lambda_1 > 0 > \lambda_2$ | saddle point | unstable |
| both negative | nodal sink | asymptotically stable |
| both positive | nodal source | unstable |

### Example 3

Classify the origin for $\mathbf{x}' = \begin{bmatrix} 3 & -2 \\ 2 & -2 \end{bmatrix}\mathbf{x}$.

- Trace 1, det $-6 + 4 = -2 < 0$: a saddle point, unstable, without even finding the
  eigenvalues. (They are $\lambda^2 - \lambda - 2 = 0$: $2$ and $-1$.)

### Example 4

Classify the origin for $\mathbf{x}' = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}\mathbf{x}$.

- Trace 7, det 10: $\lambda^2 - 7\lambda + 10 = 0$, $\lambda = 2, 5$. Both positive: nodal source.

## Zero eigenvalue

If $\det A = 0$, one eigenvalue is 0 and $A$ is not invertible: there's a whole line of
equilibria (the eigenvector for $\lambda = 0$). Trajectories are parallel straight lines moving
toward that line (if the other eigenvalue is negative) or away from it. This is a borderline
case that rarely matters in applications but makes good exam questions.

## Reading solutions from the picture

Phase portraits answer questions without formulas: Will the tanks' salt both go to zero?
(Sink: yes.) Will a small disturbance from equilibrium grow? (Saddle or source: yes.) Along
which combination does the system decay slowest? (The slow eigenvector.) For the two-tank
example in Lesson 33, the matrix has trace $-0.2$ and determinant $0.005$, giving
$\lambda = -0.1 \pm \sqrt{0.005}$, about $-0.029$ and $-0.171$. Both negative: a sink, and the salt
washes out, slowly, along the slow eigenvector.

## Common mistakes

- **Fitting $c_1, c_2$ to the wrong equations.** At $t = 0$ the exponentials are 1, so solve
  $c_1\mathbf{v}^{(1)} + c_2\mathbf{v}^{(2)} = \mathbf{x}_0$.
- **Calling a saddle stable** because some trajectories approach the origin. Almost all leave.
- **Tangent direction.** Sink trajectories enter along the *slow* eigenvector (eigenvalue closer to 0).
- **Forgetting the determinant test.** $\det A < 0$ means saddle, immediately.

## Key points

- Distinct real eigenvalues: $\mathbf{x} = c_1e^{\lambda_1t}\mathbf{v}^{(1)} + c_2e^{\lambda_2t}\mathbf{v}^{(2)}$.
- Opposite signs: saddle (unstable). Both negative: nodal sink (stable). Both positive: nodal source (unstable).
- Straight-line trajectories follow eigenvectors; others are tangent to the slow eigenvector near a node.
