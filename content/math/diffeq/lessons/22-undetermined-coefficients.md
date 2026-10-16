---
id: de-undetermined
module: de-m6
title: Undetermined coefficients
minutes: 35
topics: [Undetermined coefficients]
drills: [de-uc-poly, de-uc-exp, de-uc-trig]
refs: [de-ref-solutions, de-ref-methods]
---
## Finding one particular solution

Lesson 18 showed that every solution of $ay'' + by' + cy = g(t)$ is $y = y_c + Y$, where
$y_c$ is the general solution of the homogeneous equation (Module 5) and $Y$ is *any one*
particular solution. This lesson gives the fastest way to find $Y$ when the coefficients
are constant and $g(t)$ is built from polynomials, exponentials, sines and cosines: guess
its form with unknown coefficients, substitute, and solve for the coefficients. This is
the **method of undetermined coefficients**.

## Why guessing works

The method relies on a closure property. Derivatives of $e^{\alpha t}$ are multiples of
$e^{\alpha t}$; derivatives of a degree-$n$ polynomial are polynomials of degree at most
$n$; derivatives of $\sin\beta t$ and $\cos\beta t$ are combinations of the same two. So if
$g$ is of one of these types, plugging a function *of the same type* into
$aY'' + bY' + cY$ produces something of that type again, and we can match coefficients.

## The basic guesses

| $g(t)$ | Guess for $Y(t)$ |
|---|---|
| $P_n(t)$ (degree $n$ polynomial) | $A_nt^n + \cdots + A_1t + A_0$ |
| $Ce^{\alpha t}$ | $Ae^{\alpha t}$ |
| $C\cos\beta t$ or $C\sin\beta t$ | $A\cos\beta t + B\sin\beta t$ |
| $P_n(t)e^{\alpha t}$ | $(A_nt^n + \cdots + A_0)e^{\alpha t}$ |
| $e^{\alpha t}\cos\beta t$ or $e^{\alpha t}\sin\beta t$ | $e^{\alpha t}(A\cos\beta t + B\sin\beta t)$ |

Two rules are easy to forget:

- For a sine or cosine, **include both** $\cos$ and $\sin$ in the guess, even if $g$ has only
  one of them, because the derivative of one produces the other.
- For a polynomial, include **all lower powers**, even if $g$ is just $t^2$.

### Example 1

Find a particular solution of $y'' - 3y' - 4y = 3e^{2t}$.

- Guess $Y = Ae^{2t}$: $Y' = 2Ae^{2t}$, $Y'' = 4Ae^{2t}$.
- Substitute: $(4A - 6A - 4A)e^{2t} = -6Ae^{2t} = 3e^{2t}$, so $A = -\tfrac12$.
- $Y = -\tfrac12 e^{2t}$.

### Example 2

Find a particular solution of $y'' + 2y' + 5y = 10t + 9$.

- Guess $Y = At + B$: $Y' = A$, $Y'' = 0$.
- Substitute: $2A + 5(At + B) = 5At + (2A + 5B) = 10t + 9$.
- Match: $5A = 10$, so $A = 2$; $2A + 5B = 9$, so $B = 1$. $Y = 2t + 1$.

### Example 3

Find a particular solution of $y'' + y' - 2y = 10\sin t$.

- Guess $Y = A\cos t + B\sin t$: $Y' = -A\sin t + B\cos t$, $Y'' = -A\cos t - B\sin t$.
- Substitute and collect:
  - $\cos t$: $-A + B - 2A = -3A + B$
  - $\sin t$: $-B - A - 2B = -A - 3B$
- Match $-3A + B = 0$ and $-A - 3B = 10$. From the first, $B = 3A$; then $-A - 9A = 10$,
  so $A = -1$, $B = -3$.
- $Y = -\cos t - 3\sin t$.

## Sums: one guess per piece

If $g = g_1 + g_2$, find $Y_1$ for $g_1$ and $Y_2$ for $g_2$ separately; then $Y = Y_1 + Y_2$
(superposition for the nonhomogeneous term). For $y'' - 3y' - 4y = 3e^{2t} + 2\sin t$, solve
the two problems separately and add.

## The modification rule

The guess fails if it already solves the homogeneous equation: substituting it gives 0,
which can never match $g$. Example: $y'' - 3y' - 4y = 5e^{4t}$. The guess $Ae^{4t}$ is part of
$y_c = c_1e^{4t} + c_2e^{-t}$, and $L[Ae^{4t}] = 0$.

**Rule:** if any term of the guess solves the homogeneous equation, multiply the whole
guess by $t$. If it still overlaps (which happens for a repeated root), multiply by $t^2$.

### Example 4

Solve $y'' - 3y' - 4y = 5e^{4t}$.

- $y_c = c_1e^{4t} + c_2e^{-t}$. Since $e^{4t}$ is in $y_c$, guess $Y = Ate^{4t}$.
- $Y' = A(1 + 4t)e^{4t}$, $Y'' = A(8 + 16t)e^{4t}$.
- Substitute: $Ae^{4t}\big[(8 + 16t) - 3(1 + 4t) - 4t\big] = Ae^{4t}(5) = 5e^{4t}$, so $A = 1$.
- General solution: $y = c_1e^{4t} + c_2e^{-t} + te^{4t}$.

The $t$ terms canceled, as they always do when the modification is right. If they don't,
re-check the algebra.

### Example 5

Find the form of $Y$ for $y'' + 4y = 3\cos 2t$ (don't solve).

- $y_c = c_1\cos 2t + c_2\sin 2t$ already contains $\cos 2t$ and $\sin 2t$.
- So $Y = t(A\cos 2t + B\sin 2t)$. (Solving gives $A = 0$, $B = \tfrac34$:
  $Y = \tfrac34 t\sin 2t$, an oscillation with growing amplitude, which is resonance,
  Lesson 25.)

### Example 6: a full IVP

Solve $y'' + y' - 2y = 2t$, $y(0) = 0$, $y'(0) = 1$.

- $r^2 + r - 2 = (r + 2)(r - 1)$: $y_c = c_1e^t + c_2e^{-2t}$.
- Guess $Y = At + B$: $A - 2(At + B) = 2t$, so $A = -1$, and $A - 2B = 0$ gives
  $B = -\tfrac12$. $Y = -t - \tfrac12$.
- $y = c_1e^t + c_2e^{-2t} - t - \tfrac12$. Conditions: $c_1 + c_2 = \tfrac12$ and
  $c_1 - 2c_2 - 1 = 1$, so $c_1 - 2c_2 = 2$. Subtracting: $3c_2 = -\tfrac32$, $c_2 = -\tfrac12$,
  $c_1 = 1$.
- $y = e^t - \tfrac12e^{-2t} - t - \tfrac12$.

Apply initial conditions to the full $y_c + Y$, never to $y_c$ alone.

## Limits of the method

Undetermined coefficients only works for constant coefficients and for $g$ of the forms
in the table. For $g(t) = \tan t$ or $\dfrac{1}{t}$, the derivatives never close up into a
finite family, and you need variation of parameters (next lesson).

## Common mistakes

- **Guessing only $A\cos\beta t$** for a cosine forcing; you need $A\cos\beta t + B\sin\beta t$.
- **Missing lower powers**: for $g = t^2$, guess $At^2 + Bt + C$.
- **Forgetting the modification rule** when the guess overlaps $y_c$. Always find $y_c$ first.
- **Multiplying by $t$ when not needed**: it makes the coefficients come out inconsistent.
- **Fitting initial conditions to $y_c$** before adding $Y$.

## Key points

- $y = y_c + Y$; find $y_c$ first, then guess $Y$ of the same type as $g$.
- Trig forcing: guess both sine and cosine. Polynomial forcing: all lower powers.
- If the guess overlaps $y_c$, multiply by $t$ (or $t^2$ for a double root).
- Split sums of forcing terms and add the particular solutions.
