---
id: de-linear-first
module: de-m2
title: Linear first-order equations
minutes: 30
topics: [Linear first-order]
drills: [de-linear-if, de-linear-ivp, de-linear-power]
refs: [de-ref-methods]
---
## The workhorse method

Separation of variables only handles equations that factor. The equation $y' = t - y$
from the slope-field lesson doesn't, but it is **linear**, and every linear first-order
equation can be solved by one systematic method, the **integrating factor**. This is the
single most used technique in the first half of the course; the modeling lessons in
Module 3 rely on it constantly.

## Standard form

Put the equation in standard form, with $y'$ alone and coefficient 1:

$$y' + p(t)\,y = g(t).$$

If you start with $a(t)y' + b(t)y = c(t)$, divide through by $a(t)$. Getting $p$ and $g$
right is half the work, including their signs: $y' = 3y + t$ becomes $y' - 3y = t$, so
$p(t) = -3$.

## The idea: make the left side a product-rule derivative

The left side $y' + py$ looks almost like the derivative of a product. Multiply the
whole equation by a function $\mu(t)$:

$$\mu y' + \mu p\,y = \mu g.$$

The product rule says $(\mu y)' = \mu y' + \mu' y$. The left side will equal $(\mu y)'$
exactly when $\mu' = \mu p$. That's a separable equation for $\mu$, with solution

$$\mu(t) = e^{\int p(t)\,dt}.$$

(Any antiderivative works; we don't need a constant here.) With this choice the equation
becomes

$$\big(\mu(t)\,y\big)' = \mu(t)\,g(t),$$

and integrating both sides gives

$$\mu(t)\,y = \int \mu(t)g(t)\,dt + C, \qquad y = \frac{1}{\mu(t)}\left(\int \mu g\,dt + C\right).$$

## The recipe

1. Write the equation in standard form; identify $p(t)$ and $g(t)$.
2. Compute $\mu = e^{\int p\,dt}$ and simplify (for example, $e^{2\ln t} = t^2$).
3. Write $(\mu y)' = \mu g$.
4. Integrate, **including the constant $C$**, then divide by $\mu$.
5. Apply the initial condition.

### Example 1

Solve $y' + 2y = 6$, $y(0) = 1$.

- $p = 2$, $g = 6$, so $\mu = e^{2t}$.
- $(e^{2t}y)' = 6e^{2t}$.
- Integrate: $e^{2t}y = 3e^{2t} + C$, so $y = 3 + Ce^{-2t}$.
- $y(0) = 1$: $1 = 3 + C$, $C = -2$. Answer: $y = 3 - 2e^{-2t}$.

The solution has two parts: $3$, the steady value the system settles to, and
$-2e^{-2t}$, a **transient** that dies out. You'll see this split in every model with
constant forcing and positive $p$. (This equation is also separable, and both methods
agree.)

### Example 2

Solve $y' + y = t$, $y(0) = 1$. (This is the slope-field equation $y' = t - y$.)

- $\mu = e^t$, so $(e^ty)' = te^t$.
- Integrate by parts: $\int te^t\,dt = te^t - e^t + C$.
- Divide: $y = t - 1 + Ce^{-t}$.
- $y(0) = 1$: $1 = -1 + C$, $C = 2$. Answer: $y = t - 1 + 2e^{-t}$.

This confirms what the slope field showed: every solution approaches the line $y = t - 1$,
since $Ce^{-t} \to 0$.

### Example 3

Solve $ty' + 2y = 4t^2$ for $t > 0$, with $y(1) = 2$.

- Standard form: divide by $t$: $y' + \dfrac{2}{t}y = 4t$.
- $\mu = e^{\int 2/t\,dt} = e^{2\ln t} = t^2$.
- $(t^2y)' = 4t^3$, so $t^2y = t^4 + C$ and $y = t^2 + \dfrac{C}{t^2}$.
- $y(1) = 2$: $2 = 1 + C$, $C = 1$. Answer: $y = t^2 + t^{-2}$, valid on $(0, \infty)$, as
  the existence theorem predicted from the trouble point $t = 0$.

Skipping the division and using $p = 2$ instead of $2/t$ is the most common error here.

### Example 4

Solve $y' - 3y = e^{t}$, $y(0) = 0$.

- $p = -3$ (note the sign), $\mu = e^{-3t}$.
- $(e^{-3t}y)' = e^{-2t}$, so $e^{-3t}y = -\tfrac12 e^{-2t} + C$.
- $y = -\tfrac12 e^t + Ce^{3t}$. From $y(0) = 0$: $C = \tfrac12$.
- Answer: $y = \tfrac12(e^{3t} - e^t)$.

## The structure of the answer

Every answer above has the form

$$y = \underbrace{\frac{C}{\mu(t)}}_{\text{solves } y' + py = 0} + \underbrace{\frac{1}{\mu(t)}\int \mu g\,dt}_{\text{one particular solution}}.$$

The general solution of a linear equation is (general solution of the homogeneous
equation) + (any one particular solution). This decomposition holds for linear equations
of every order, and Module 6 is built on it.

## When the integral can't be done

If $\int \mu g\,dt$ has no elementary antiderivative, write the answer with a definite
integral starting at $t_0$:

$$y(t) = \frac{1}{\mu(t)}\left(\mu(t_0)y_0 + \int_{t_0}^{t}\mu(s)g(s)\,ds\right).$$

For $y' - 2ty = 1$, $y(0) = 3$: $\mu = e^{-t^2}$ and $y = e^{t^2}\left(3 + \int_0^t e^{-s^2}ds\right)$.
That's a complete, computable answer.

## Common mistakes

- **Not dividing by the coefficient of $y'$** before reading off $p$.
- **Sign of $p$.** $y' = ky$ is $y' - ky = 0$, so $p = -k$.
- **Forgetting $C$ before dividing by $\mu$.** $y = \frac{1}{\mu}\int \mu g\,dt$ with no $C$
  gives only one solution, and the initial condition can't be met.
- **Dividing only part of the right side.** $\mu y = F(t) + C$ gives $y = F/\mu + C/\mu$,
  not $F/\mu + C$.
- **Leaving $e^{\ln}$ unsimplified.** $e^{2\ln t} = t^2$ and $e^{-\ln t} = 1/t$ (for $t > 0$).

## Key points

- Standard form $y' + p(t)y = g(t)$; integrating factor $\mu = e^{\int p\,dt}$.
- Multiplying by $\mu$ turns the left side into $(\mu y)'$; integrate and divide.
- General solution = $C/\mu$ (homogeneous part) + particular solution.
- The interval of validity is where $p$ and $g$ are continuous.
