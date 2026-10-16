---
id: de-substitutions
module: de-m2
title: Bernoulli and homogeneous equations
minutes: 30
topics: [Substitutions]
drills: [de-bernoulli-w, de-homog-ivp]
refs: [de-ref-methods]
---
## Changing variables to reach a known type

The last three lessons gave three solvable types: separable, linear and exact. Many
other equations can be turned into one of these by a clever **substitution**, a new
unknown defined in terms of the old one. This lesson covers the two classic cases,
Bernoulli equations (which become linear) and homogeneous equations (which become
separable), plus the general habit of trying a substitution when an expression keeps
repeating.

## Bernoulli equations

A **Bernoulli equation** has the form

$$y' + p(t)\,y = q(t)\,y^n,$$

where $n$ is any real number. If $n = 0$ or $n = 1$, it's already linear. Otherwise the
$y^n$ makes it nonlinear, but the substitution

$$v = y^{1 - n}$$

makes it linear in $v$. Here's why. Divide the equation by $y^n$:

$$y^{-n}y' + p(t)\,y^{1-n} = q(t).$$

Since $v = y^{1-n}$, the chain rule gives $v' = (1 - n)y^{-n}y'$, so
$y^{-n}y' = \dfrac{v'}{1 - n}$. Substituting:

$$\frac{1}{1 - n}v' + p(t)\,v = q(t) \quad\Longrightarrow\quad v' + (1 - n)p(t)\,v = (1 - n)q(t).$$

That's linear, and the integrating factor finishes it. Then return to $y = v^{1/(1-n)}$.
(Dividing by $y^n$ loses the solution $y = 0$ when $n > 0$; check it separately.)

### Example 1

Solve $y' + y = y^2$, $y(0) = \tfrac12$.

- $n = 2$, so $v = y^{-1}$, $v' = -y^{-2}y'$.
- Divide by $y^2$: $y^{-2}y' + y^{-1} = 1$, which is $-v' + v = 1$, or $v' - v = -1$.
- Integrating factor $e^{-t}$: $(e^{-t}v)' = -e^{-t}$, so $e^{-t}v = e^{-t} + C$ and
  $v = 1 + Ce^t$.
- $v(0) = 1/y(0) = 2$, so $C = 1$: $v = 1 + e^t$.
- Answer: $y = \dfrac{1}{1 + e^t}$.

Check: $y' = -\dfrac{e^t}{(1 + e^t)^2}$ and $y^2 - y = \dfrac{1 - (1 + e^t)}{(1 + e^t)^2} = -\dfrac{e^t}{(1 + e^t)^2}$. ✓

The logistic equation $P' = kP - \tfrac{k}{K}P^2$ is a Bernoulli equation with $n = 2$,
which gives a second route to its solution.

### Example 2

Solve $ty' + y = t^2y^3$ for $t > 0$.

- Standard form: $y' + \dfrac1t y = ty^3$. $n = 3$, so $v = y^{-2}$.
- The linear equation is $v' + (1 - 3)\dfrac1t v = (1 - 3)t$, that is
  $v' - \dfrac2t v = -2t$.
- $\mu = e^{-2\ln t} = t^{-2}$: $(t^{-2}v)' = -\dfrac2t$, so $t^{-2}v = -2\ln t + C$.
- $v = t^2(C - 2\ln t)$, and $y^{-2} = v$ gives $y = \pm\dfrac{1}{t\sqrt{C - 2\ln t}}$.

## Homogeneous first-order equations

A first-order equation is called **homogeneous** (a different meaning from the linear
one) if it can be written as

$$\frac{dy}{dx} = F\!\left(\frac{y}{x}\right),$$

that is, the right side depends only on the ratio $y/x$. A quick test: replace $x$ by
$\lambda x$ and $y$ by $\lambda y$; if the right side doesn't change, it's homogeneous.
For example $\dfrac{x^2 + y^2}{xy}$ is homogeneous (divide top and bottom by $x^2$ to get
$\dfrac{1 + (y/x)^2}{y/x}$), but $\dfrac{x + y^2}{x}$ is not.

Substitute $v = \dfrac{y}{x}$, so $y = vx$ and $y' = v + xv'$. The equation becomes

$$v + x\frac{dv}{dx} = F(v) \quad\Longrightarrow\quad \frac{dv}{F(v) - v} = \frac{dx}{x},$$

which is separable. Solve for $v$, then put back $y = vx$.

### Example 3

Solve $\dfrac{dy}{dx} = \dfrac{x + y}{x}$, $y(1) = 2$, for $x > 0$.

- Right side: $1 + \dfrac{y}{x} = 1 + v$. Homogeneous.
- $v + xv' = 1 + v$, so $xv' = 1$ and $v = \ln x + C$.
- $y = x\ln x + Cx$. At $x = 1$: $2 = 0 + C$.
- Answer: $y = x\ln x + 2x$.

### Example 4

Solve $\dfrac{dy}{dx} = \dfrac{x^2 + y^2}{xy}$ for $x > 0$, $y(1) = 3$.

- $F(v) = \dfrac{1 + v^2}{v} = \dfrac1v + v$.
- $v + xv' = \dfrac1v + v$, so $xv' = \dfrac1v$, and $v\,dv = \dfrac{dx}{x}$.
- $\dfrac{v^2}{2} = \ln x + C$, so $\dfrac{y^2}{x^2} = 2\ln x + 2C$.
- At $(1, 3)$: $9 = 2C$. So $y^2 = x^2(2\ln x + 9)$ and, with $y > 0$,
  $y = x\sqrt{2\ln x + 9}$.

## Other substitutions

When a combination keeps appearing, make it the new unknown. For
$y' = (x + y + 1)^2$, let $u = x + y + 1$. Then $u' = 1 + y' = 1 + u^2$, which is
separable: $\arctan u = x + C$, so $y = \tan(x + C) - x - 1$. The general pattern for
$y' = f(ax + by + c)$ is $u = ax + by + c$.

## Which substitution?

| Form | Substitution | Result |
|---|---|---|
| $y' + p y = q y^n$ | $v = y^{1-n}$ | linear in $v$ |
| $y' = F(y/x)$ | $v = y/x$ | separable in $v$, $x$ |
| $y' = f(ax + by + c)$ | $u = ax + by + c$ | separable in $u$, $x$ |

## Common mistakes

- **Wrong power.** For Bernoulli, $v = y^{1-n}$, so $n = 3$ gives $v = y^{-2}$, not $y^{3}$.
- **Forgetting the factor $(1 - n)$** in front of both $p$ and $q$ in the linear equation for $v$.
- **Using $y' = v'$.** With $y = vx$, the product rule gives $y' = v + xv'$.
- **Not converting the initial condition.** If $y(0) = \tfrac12$ and $v = 1/y$, then $v(0) = 2$.
- **Confusing the two meanings of homogeneous.** Here it means "depends only on $y/x$".

## Key points

- Bernoulli $y' + py = qy^n$: set $v = y^{1-n}$ to get $v' + (1-n)pv = (1-n)q$.
- Homogeneous $y' = F(y/x)$: set $y = vx$, $y' = v + xv'$, then separate.
- After solving for the new variable, convert back and apply the initial condition.
