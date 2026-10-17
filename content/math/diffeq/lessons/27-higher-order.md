---
id: de-higher-order
module: de-m6
title: Higher-order linear equations
minutes: 30
topics: [Higher-order equations]
drills: [de-higher-roots, de-higher-ivp]
refs: [de-ref-solutions]
---
## Same ideas, more terms

Everything in Modules 5 and 6 extends to linear equations of order $n$:

$$a_ny^{(n)} + a_{n-1}y^{(n-1)} + \cdots + a_1y' + a_0y = g(t).$$

Such equations arise when systems are coupled (two masses on springs reduce to a
fourth-order equation), in beam bending ($EI\,y^{(4)} = w(x)$), and in control theory.
This lesson summarizes the theory and shows how the characteristic-equation method scales
up. The main new difficulty is algebraic: factoring a polynomial of degree $n$.

## Theory in one paragraph

If the coefficients are continuous on an interval and $a_n \ne 0$ there, an IVP with $n$
conditions $y(t_0), y'(t_0), \dots, y^{(n-1)}(t_0)$ has a unique solution on the whole
interval. The homogeneous equation has $n$ solutions $y_1, \dots, y_n$ forming a
**fundamental set** exactly when their Wronskian (the $n \times n$ determinant whose rows are
the functions and their first $n - 1$ derivatives) is nonzero. The general solution is
$y = c_1y_1 + \cdots + c_ny_n + Y$, with $Y$ any particular solution.

## Constant coefficients

Trying $y = e^{rt}$ gives the characteristic polynomial

$$a_nr^n + a_{n-1}r^{n-1} + \cdots + a_1r + a_0 = 0,$$

which has $n$ roots counted with multiplicity (by the fundamental theorem of algebra). Each
root contributes solutions:

| Root | Contribution |
|---|---|
| real $r$, multiplicity 1 | $e^{rt}$ |
| real $r$, multiplicity $k$ | $e^{rt}, te^{rt}, \dots, t^{k-1}e^{rt}$ |
| complex pair $\lambda \pm i\mu$, multiplicity 1 | $e^{\lambda t}\cos\mu t$, $e^{\lambda t}\sin\mu t$ |
| complex pair, multiplicity $k$ | the same two, each times $1, t, \dots, t^{k-1}$ |

Altogether you always get exactly $n$ independent solutions.

## Factoring the characteristic polynomial

Useful tools:

- **Rational root test**: any rational root $p/q$ has $p$ dividing $a_0$ and $q$ dividing $a_n$.
  Try $\pm1, \pm2, \dots$ first.
- Once you find a root $r_1$, divide by $(r - r_1)$ (synthetic division) to reduce the degree.
- **Grouping**: $r^3 - r^2 + 4r - 4 = r^2(r - 1) + 4(r - 1) = (r - 1)(r^2 + 4)$.
- Quadratics in $r^2$: $r^4 - 5r^2 + 4 = (r^2 - 1)(r^2 - 4)$.
- $r^4 + a^4$ and similar: use complex roots of $-a^4$ or complete the square.

### Example 1

Solve $y''' - 6y'' + 11y' - 6y = 0$.

- $r^3 - 6r^2 + 11r - 6$. Try $r = 1$: $1 - 6 + 11 - 6 = 0$. ✓
- Divide: $r^3 - 6r^2 + 11r - 6 = (r - 1)(r^2 - 5r + 6) = (r - 1)(r - 2)(r - 3)$.
- $y = c_1e^t + c_2e^{2t} + c_3e^{3t}$.

### Example 2

Solve $y^{(4)} - y = 0$.

- $r^4 - 1 = (r^2 - 1)(r^2 + 1) = (r - 1)(r + 1)(r^2 + 1)$: roots $1, -1, \pm i$.
- $y = c_1e^t + c_2e^{-t} + c_3\cos t + c_4\sin t$.

### Example 3

Solve $y''' + 3y'' + 3y' + y = 0$.

- $r^3 + 3r^2 + 3r + 1 = (r + 1)^3$: root $-1$ with multiplicity 3.
- $y = (c_1 + c_2t + c_3t^2)e^{-t}$.

### Example 4

Solve $y^{(4)} + 8y'' + 16y = 0$.

- $r^4 + 8r^2 + 16 = (r^2 + 4)^2$: roots $\pm 2i$, each with multiplicity 2.
- $y = (c_1 + c_2t)\cos 2t + (c_3 + c_4t)\sin 2t$.

### Example 5: an IVP

Solve $y''' - y' = 0$, $y(0) = 3$, $y'(0) = 1$, $y''(0) = 1$.

- $r^3 - r = r(r - 1)(r + 1)$: $y = c_1 + c_2e^t + c_3e^{-t}$.
- $y(0) = c_1 + c_2 + c_3 = 3$; $y'(0) = c_2 - c_3 = 1$; $y''(0) = c_2 + c_3 = 1$.
- From the last two: $c_2 = 1$, $c_3 = 0$. Then $c_1 = 2$.
- $y = 2 + e^t$.

## Nonhomogeneous equations

Undetermined coefficients works exactly as before, with the modification rule using the
**multiplicity** of the overlapping root: multiply the guess by $t^s$, where $s$ is the
multiplicity of the root that causes the overlap.

### Example 6

Find the form of $Y$ for $y''' - y'' = 3t^2$ (then solve for the coefficients).

- $r^3 - r^2 = r^2(r - 1)$: root 0 has multiplicity 2, so $y_c = c_1 + c_2t + c_3e^t$.
- The basic guess $At^2 + Bt + C$ overlaps $y_c$ (constants and $t$ correspond to $r = 0$).
  Multiply by $t^2$: $Y = At^4 + Bt^3 + Ct^2$.
- $Y'' = 12At^2 + 6Bt + 2C$, $Y''' = 24At + 6B$.
- $Y''' - Y'' = -12At^2 + (24A - 6B)t + (6B - 2C) = 3t^2$.
- $A = -\tfrac14$; $24A = 6B$ gives $B = -1$; $6B = 2C$ gives $C = -3$.
- $Y = -\tfrac14t^4 - t^3 - 3t^2$.

Variation of parameters also generalizes (with an $n \times n$ system), but by hand it's
rarely worth it beyond order 2.

## Beam deflection

A uniform beam with stiffness $EI$ under a load $w$ per unit length satisfies
$EI\,y^{(4)} = w$. With constant $w$, integrating four times gives
$y = \dfrac{w}{24EI}x^4 + c_3x^3 + c_2x^2 + c_1x + c_0$, and the four constants come from
**boundary conditions** at the two ends (for a clamped end, $y = y' = 0$). Engineers use
exactly this to size floor joists and bridge girders.

## Common mistakes

- **Losing roots.** A degree-$n$ polynomial has $n$ roots with multiplicity; count your
  solutions.
- **Wrong multiplicity powers.** A triple root $r$ gives $e^{rt}$, $te^{rt}$, $t^2e^{rt}$.
- **Root 0.** It contributes constants (and $t$, $t^2$, … if repeated), which affects
  polynomial guesses.
- **Synthetic-division slips.** Multiply back to check the factorization.

## Key points

- $n$th-order linear: $n$ conditions, $n$ fundamental solutions, general solution
  $c_1y_1 + \cdots + c_ny_n + Y$.
- Characteristic polynomial of degree $n$; each root of multiplicity $k$ gives $k$ solutions
  with powers $t^0, \dots, t^{k-1}$.
- Modification rule: multiply the guess by $t^s$, $s$ = multiplicity of the overlapping root.
