---
id: la-m8-h-perron-frobenius
module: la-m8
title: Population models and the Perron–Frobenius theorem
minutes: 45
honors: true
topics: [Leslie models, Perron–Frobenius theorem]
drills: [la-m8-r2-leslie-step, la-m8-r2-leslie-growth]
refs: [la-ref-factor]
---
## Why do population models settle down?

The dynamical systems lesson showed that $\mathbf{x}_k = A^k\mathbf{x}_0$ is eventually dominated by
the eigenvalue of largest absolute value, *if* there is a single such eigenvalue and the starting
vector has some weight on its eigenvector. For Markov chains, the steady-state theorem promised
that a regular stochastic matrix always has a probability vector it settles into. Why are those
"ifs" so reliably true in models of populations, probabilities and rankings? Because those
matrices have no negative entries, and nonnegative matrices obey a remarkable theorem of Oskar
Perron and Georg Frobenius. This lesson builds the classic age-structured population model and
uses it to see the theorem at work.

## The Leslie model

Split a population of females into age classes of equal width (say 0–1, 1–2 and 2–3 years for a
short-lived bird) and count them once per time step of the same width. Two kinds of numbers drive
the model:

- the *fecundity* $f_i$: average number of newborn daughters (counted at the next census) per female in class $i$;
- the *survival rate* $s_i$: fraction of class $i$ alive one step later, and therefore in class $i + 1$.

Newborns all enter class 1, and survivors move up one class, so for three classes

$$\mathbf{x}_{k+1} = L\mathbf{x}_k, \qquad L = \begin{bmatrix} f_1 & f_2 & f_3 \\ s_1 & 0 & 0 \\ 0 & s_2 & 0\end{bmatrix}.$$

A matrix of this shape (fecundities across the top row, survival rates just below the diagonal,
zeros elsewhere) is a **Leslie matrix**, after P. H. Leslie, who published the model in
*Biometrika* in 1945. Every entry is nonnegative, and survival rates are between 0 and 1.
(Real studies have to decide which sex to count and exactly when births are recorded; counting
females only is the usual simplification.)

### Example 1

A bird population has three age classes with
$L = \begin{bmatrix} 0 & 2 & 1.5 \\ 0.9 & 0 & 0 \\ 0 & 0.5 & 0\end{bmatrix}$. Starting from $\mathbf{x}_0 = (90, 60, 30)$, find $\mathbf{x}_1$. Then find the long-run growth rate and age distribution.

1. One step: $\mathbf{x}_1 = (2 \cdot 60 + 1.5 \cdot 30,\ 0.9 \cdot 90,\ 0.5 \cdot 60) = (165, 81, 30)$. The total went from 180 to 276, a factor of about 1.53.
2. Characteristic equation. Expanding $\det(L - \lambda I)$ along the first row gives $-\lambda^3 + f_1\lambda^2 + f_2s_1\lambda + f_3s_1s_2 = 0$; here $f_1 = 0$, so (multiplying by $-1$) $\lambda^3 - 1.8\lambda - 0.675 = 0$.
3. Try $\lambda = 1.5$: $3.375 - 2.7 - 0.675 = 0$. ✓ Dividing out $(\lambda - 1.5)$ leaves $\lambda^2 + 1.5\lambda + 0.45$, with roots $\frac{-1.5 \pm \sqrt{0.45}}{2} \approx -0.415$ and $-1.085$. So 1.5 is the eigenvalue of largest absolute value.
4. Eigenvector for 1.5: the second row says $0.9x_1 = 1.5x_2$, so $x_2 = 0.6x_1$; the third says $0.5x_2 = 1.5x_3$, so $x_3 = x_2/3 = 0.2x_1$. With $x_1 = 5$: $\mathbf{v} = (5, 3, 1)$. Check row 1: $2 \cdot 3 + 1.5 \cdot 1 = 7.5 = 1.5 \cdot 5$. ✓
5. In the long run the population grows by a factor of 1.5 per step (50%), with the age classes in the ratio $5 : 3 : 1$, that is $\tfrac59 \approx 56\%$, $\tfrac39 \approx 33\%$ and $\tfrac19 \approx 11\%$.

The eigenvector of the largest eigenvalue, scaled so its entries add to 1, is the
**stable age distribution**. The pattern in step 4 works for every Leslie matrix: the eigenvector
for $r$ is $\big(1,\ \tfrac{s_1}{r},\ \tfrac{s_1s_2}{r^2},\ \dots\big)$, so it is automatically positive.

```plot
{"x": [0, 16], "y": [0, 2.8], "xLabel": "step k", "yLabel": "growth factor of the total", "functions": [{"f": "1.5", "dashed": true, "label": "r = 1.5"}], "points": [{"at": [1, 0.9]}, {"at": [2, 2.5]}, {"at": [3, 1.02]}, {"at": [4, 2.029]}, {"at": [5, 1.213]}, {"at": [6, 1.758]}, {"at": [7, 1.34]}, {"at": [8, 1.629]}, {"at": [9, 1.414]}, {"at": [10, 1.566]}, {"at": [11, 1.454]}, {"at": [12, 1.534]}, {"at": [13, 1.476]}, {"at": [14, 1.518]}, {"at": [15, 1.487]}], "caption": "Starting with 100 newborns only, the step-to-step growth factor swings and then settles at 1.5"}
```

The swings in the picture come from the eigenvalue $-1.085$: it is negative, so its term flips
sign every step, and $|{-1.085}|/1.5 \approx 0.72$ says how much of the swing survives each step.
The closer that ratio is to 1, the slower the population settles.

## The Perron–Frobenius theorem

Write $\rho(A)$ for the largest absolute value of an eigenvalue of $A$ (its *spectral radius*). An
eigenvalue equal to $\rho(A)$ and strictly larger in absolute value than every other eigenvalue is a
*dominant eigenvalue*. A square matrix $A$ with nonnegative entries is a **primitive matrix** if
some power $A^k$ has all entries strictly positive. (A regular stochastic matrix is exactly a
primitive stochastic matrix.) The **Perron–Frobenius theorem** describes the eigenvalues of primitive matrices:

> *Perron–Frobenius theorem (for primitive matrices).* If $A$ is primitive, then:
> 1. $r = \rho(A)$ is a positive real eigenvalue of $A$, and it is dominant: $|\lambda| < r$ for every other eigenvalue $\lambda$.
> 2. $r$ is a simple root of the characteristic polynomial, so its eigenspace is a line.
> 3. That line contains a vector with all entries positive.
> 4. No other eigenvalue has an eigenvector with all entries nonnegative.

Perron proved this for matrices with all entries positive in 1907; Frobenius extended it to
nonnegative matrices in 1912. (The full theorem also covers *irreducible* matrices, which may have
several eigenvalues of absolute value $r$; this lesson uses only the primitive case.)

What it buys: if $A$ is primitive and $\mathbf{x}_0$ is nonnegative and nonzero, then $\mathbf{x}_0$ has
positive weight on the positive eigenvector $\mathbf{v}$, and

$$\mathbf{x}_k = A^k\mathbf{x}_0 \approx c\,r^k\,\mathbf{v} \quad\text{for large } k, \text{ with } c > 0.$$

The shares $\mathbf{x}_k / (\text{sum of entries})$ approach $\mathbf{v}$ scaled to sum 1, whatever the start.
Two familiar results are special cases:

- *Markov chains.* Every column of a stochastic matrix sums to 1, which forces $\rho(P) = 1$ (a
  bound below makes this precise). For a regular $P$, Perron–Frobenius gives a unique positive
  steady state that every chain approaches: the steady-state theorem.
- *Leslie models.* A Leslie matrix whose last class reproduces and whose survival rates are all positive is
  primitive if, for example, two neighboring age classes both have positive fecundity (as in Example 1, classes 2 and 3).

A quick bound on $r$ without solving anything: for a nonnegative matrix, $r$ lies between the
smallest and largest *row* sums, and also between the smallest and largest *column* sums ($A$ and
$A^T$ have the same eigenvalues). For a stochastic matrix every column sum is 1, so $r = 1$.

Repeatedly multiplying by $A$ and rescaling, as in the plot above, is also how $r$ and $\mathbf{v}$
are computed for very large matrices; numerical analysts call it the *power method*.

### Example 2

Why primitivity matters. A species breeds only in its second year: $L = \begin{bmatrix} 0 & 4 \\ 0.25 & 0\end{bmatrix}$, starting from $\mathbf{x}_0 = (100, 0)$.

1. $\mathbf{x}_1 = (0, 25)$, $\mathbf{x}_2 = (100, 0)$, $\mathbf{x}_3 = (0, 25)$, ... The population alternates forever and never settles into a fixed age distribution.
2. Eigenvalues: $\lambda^2 - 4(0.25) = 0$, so $\lambda = \pm1$. Two eigenvalues share the largest absolute value, so there is no dominant eigenvalue.
3. $L$ is not primitive: $L^2 = I$, and every power is either $L$ or $I$, each with zero entries.
4. If even a few first-year birds breed, say $f_1 = 0.2$, then $L^2 = \begin{bmatrix} 1.04 & 0.8 \\ 0.05 & 1\end{bmatrix}$ is positive, the matrix is primitive, and the oscillation dies out. The eigenvalues become $\frac{0.2 \pm \sqrt{0.04 + 4}}{2} \approx 1.105$ and $-0.905$.

## Growth or decline: the net reproductive number

Ecologists often want just one thing: will the population grow or shrink? Let
$\ell_1 = 1$, $\ell_2 = s_1$, $\ell_3 = s_1s_2$, ... be the chance that a newborn survives to reach
class $i$. The **net reproductive number**

$$R_0 = f_1\ell_1 + f_2\ell_2 + f_3\ell_3 + \cdots$$

is the expected number of daughters a newborn female produces over her whole life.

> For a Leslie matrix whose last class reproduces, $r > 1$ exactly when $R_0 > 1$, $r = 1$ exactly when $R_0 = 1$, and $r < 1$ exactly when $R_0 < 1$.

*Why.* Divide the characteristic equation by $\lambda^n$; it becomes
$g(\lambda) = \dfrac{f_1\ell_1}{\lambda} + \dfrac{f_2\ell_2}{\lambda^2} + \cdots = 1$ (the discrete Euler–Lotka equation).
For $\lambda > 0$, $g$ is strictly decreasing, so it equals 1 at exactly one positive $\lambda$, which
is $r$. Since $g(1) = R_0$: if $R_0 > 1$ then $g(1) > 1 = g(r)$, which forces $r > 1$, and similarly
for the other cases.

### Example 3

For the birds of Example 1, find $R_0$, and find the first-year survival $s_1$ that would make the population exactly stationary.

1. $\ell_1 = 1$, $\ell_2 = 0.9$, $\ell_3 = 0.9 \cdot 0.5 = 0.45$.
2. $R_0 = 0 \cdot 1 + 2 \cdot 0.9 + 1.5 \cdot 0.45 = 1.8 + 0.675 = 2.475 > 1$: growth, consistent with $r = 1.5$.
3. With unknown $s_1$: $R_0 = 2s_1 + 1.5 \cdot 0.5\,s_1 = 2.75s_1$. Setting $R_0 = 1$ gives $s_1 = 1/2.75 \approx 0.364$.
4. Check: with $s_1 = 4/11$, the characteristic equation $\lambda^3 = 2s_1\lambda + 0.75s_1$ at $\lambda = 1$ reads $1 = \tfrac{8}{11} + \tfrac{3}{11}$. ✓ So $r = 1$: if fewer than about 36% of first-year birds survived, this population would decline.

Note what $R_0$ and $r$ measure differently: $R_0$ is per *generation* and $r$ is per *time step*.
They agree on the verdict (above or below 1) but not on the size.

## Common mistakes

- *Putting survival rates on the diagonal.* Survivors move *up* a class, so $s_i$ sits in row $i + 1$, column $i$.
- *Expecting every nonnegative matrix to have a dominant eigenvalue.* Example 2 is nonnegative but not primitive, and it oscillates.
- *Reading the growth rate as $R_0$.* $R_0 = 2.475$ in Example 1, but the population grows by 1.5 per step.
- *Forgetting to normalize.* The stable age distribution is the Perron eigenvector scaled so its entries add up to 1.
- *Overstating the model.* Fecundities and survival rates are assumed constant; real populations face crowding, weather and harvest, so the Leslie model describes tendencies, not forecasts.

## Key points

- A Leslie matrix has fecundities in the first row and survival rates just below the diagonal; $\mathbf{x}_{k+1} = L\mathbf{x}_k$.
- Perron–Frobenius: a primitive matrix has a positive, simple, dominant eigenvalue $r$ with a positive eigenvector, and $A^k\mathbf{x}_0 \approx c\,r^k\mathbf{v}$ for every nonnegative nonzero start.
- For Leslie models, $r$ is the long-run growth factor per step and its eigenvector is the stable age distribution, $(1, s_1/r, s_1s_2/r^2, \dots)$ before scaling.
- The ratio $|\lambda_2|/r$ sets how fast the age distribution settles.
- $R_0 = \sum f_i\ell_i$ decides growth ($R_0 > 1$) or decline ($R_0 < 1$); regular Markov chains are the special case $r = 1$.
