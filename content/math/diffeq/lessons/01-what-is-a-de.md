---
id: de-intro
module: de-m1
title: What a differential equation is
minutes: 25
topics: [DE basics]
drills: [de-verify-1, de-ivp-constant]
refs: [de-ref-methods]
---
## Why this course exists

Most laws of nature don't tell you what a quantity *is*; they tell you how fast it
*changes*. A cup of coffee cools at a rate proportional to how much hotter it is than
the room. A population grows at a rate proportional to its size. A spring pushes back
with a force proportional to how far it is stretched, and force sets acceleration, which
is a second derivative. Each of these statements is an equation involving an unknown
function and its derivatives. That is a **differential equation**.

This first module is a bridge. It covers the material in an AP Calculus course
(slope fields, separable equations, exponential and logistic growth, Euler's method) so
that the college modules that follow can build on solid ground. If you have seen these
ideas before, read quickly and use the quizzes to confirm you have them.

## Equations whose unknown is a function

In algebra, an equation like $x^2 = 9$ has numbers as solutions. In a differential
equation the unknown is a whole function, usually written $y(x)$ or $y(t)$, and the
equation links the function to its derivatives. For example

$$\frac{dy}{dx} = 2x, \qquad y' = 3y, \qquad y'' + 4y = 0.$$

A **solution** of a differential equation on an interval is a function that, when you
substitute it and its derivatives into the equation, makes the equation true at every
point of that interval. You never have to trust a claimed solution: you can check it
by differentiating and substituting.

The **order** of a differential equation is the order of the highest derivative that
appears. $y' = 3y$ is first order; $y'' + 4y = 0$ is second order. We'll classify
equations more carefully in Module 2.

## Checking a solution

Checking is mechanical: compute the derivatives the equation needs, substitute, and
simplify both sides.

### Example 1

Show that $y = 5e^{3x}$ solves $y' = 3y$.

- Differentiate: $y' = 5 \cdot 3e^{3x} = 15e^{3x}$.
- Right side: $3y = 3 \cdot 5e^{3x} = 15e^{3x}$.
- The two sides agree for every $x$, so $y = 5e^{3x}$ is a solution on $(-\infty, \infty)$.

Nothing about the 5 mattered. Any $y = Ce^{3x}$ works, because the factor $C$ rides
along through the derivative. That's our first glimpse of a general pattern.

### Example 2

Is $y = \cos 2t$ a solution of $y'' + 4y = 0$? Is $y = \cos t$?

- For $y = \cos 2t$: $y' = -2\sin 2t$, $y'' = -4\cos 2t$. Then
  $y'' + 4y = -4\cos 2t + 4\cos 2t = 0$. Yes.
- For $y = \cos t$: $y'' = -\cos t$, so $y'' + 4y = -\cos t + 4\cos t = 3\cos t$, which is
  not zero for all $t$. No.

A function that only satisfies the equation at a few points is not a solution; it must
work on a whole interval.

## Families of solutions and the general solution

The simplest differential equations are ones you already know how to solve:
$\dfrac{dy}{dx} = f(x)$. Its solutions are the antiderivatives of $f$:

$$y = \int f(x)\,dx + C.$$

So $\dfrac{dy}{dx} = 2x$ has solutions $y = x^2 + C$, one for each constant $C$. A
formula that contains every solution, with arbitrary constants, is called the
**general solution**. It describes a **one-parameter family** of curves: for a
first-order equation there is typically one arbitrary constant, for a second-order
equation two, and so on. That makes sense: solving a second-order equation undoes two
derivatives, and each undoing brings in a constant.

```plot
{"x": [-3, 3], "y": [-4, 8], "functions": [{"f": "x^2 - 2", "label": "C = -2"}, {"f": "x^2", "label": "C = 0"}, {"f": "x^2 + 2", "label": "C = 2"}, {"f": "x^2 + 4", "label": "C = 4"}], "points": [{"at": [1, 3], "label": "(1, 3)"}], "caption": "Solutions y = x² + C of dy/dx = 2x. Exactly one passes through (1, 3)."}
```

## Initial value problems

Usually we want *one* solution, the one that fits a known starting state: the
temperature of the coffee right now, the population this year. Pairing an equation with
such a condition gives an **initial value problem** (IVP):

$$\frac{dy}{dx} = f(x, y), \qquad y(x_0) = y_0.$$

The **initial condition** $y(x_0) = y_0$ picks out a single member of the family. The
result is called a **particular solution**.

### Example 3

Solve $\dfrac{dy}{dx} = 2x$, $y(1) = 3$.

- General solution: $y = x^2 + C$.
- Apply the condition: $3 = 1^2 + C$, so $C = 2$.
- Particular solution: $y = x^2 + 2$. In the figure above it is the curve through $(1, 3)$.

### Example 4

Solve $\dfrac{dy}{dt} = 6t^2 - \sin t$, $y(0) = 4$.

- Integrate: $y = 2t^3 + \cos t + C$.
- At $t = 0$: $4 = 0 + \cos 0 + C = 1 + C$, so $C = 3$.
- Answer: $y = 2t^3 + \cos t + 3$.

Notice the trap: $\cos 0 = 1$, not 0. Forgetting that gives $C = 4$, which is wrong.

### Example 5

Find a value of $k$ so that $y = e^{kt}$ solves $y'' - y' - 6y = 0$.

- Substitute: $y' = ke^{kt}$, $y'' = k^2e^{kt}$.
- The equation becomes $(k^2 - k - 6)e^{kt} = 0$. Since $e^{kt}$ is never zero, we need
  $k^2 - k - 6 = (k - 3)(k + 2) = 0$.
- So $k = 3$ or $k = -2$. This trick of guessing an exponential is the heart of Module 5.

## Equilibrium (constant) solutions

Sometimes a constant function solves an equation. If $y = c$ is constant, then
$y' = 0$, so $c$ works exactly when the right side is zero there. For
$y' = y(4 - y)$, both $y = 0$ and $y = 4$ are solutions. These **equilibrium solutions**
describe states that never change, like a population exactly at its environment's
capacity. They will matter a lot in the logistic model and in Module 4.

## Reading a differential equation in words

A big part of the subject is translating sentences into equations.

| Statement | Equation |
|---|---|
| $y$ grows at a rate proportional to itself | $\dfrac{dy}{dt} = ky$, $k > 0$ |
| $T$ changes at a rate proportional to the difference between $T$ and 20 | $\dfrac{dT}{dt} = -k(T - 20)$ |
| The rate of change of $P$ is proportional to $P$ and to $1000 - P$ | $\dfrac{dP}{dt} = kP(1000 - P)$ |
| $v$ decreases at a rate proportional to the square of $v$ | $\dfrac{dv}{dt} = -kv^2$ |

"Proportional to" always means "equals a constant times". The sign of the constant
usually comes from whether the quantity rises or falls.

## Common mistakes

- **Checking only one side.** Substitute into the *whole* equation, then simplify both
  sides; don't stop after computing $y'$.
- **Dropping the constant.** $\dfrac{dy}{dx} = 2x$ does not have the single solution
  $y = x^2$; it has the family $y = x^2 + C$. Add $C$ when you integrate, then use the
  initial condition.
- **Applying the initial condition too early.** Find the general solution first (with
  $C$), then substitute $x_0$ and $y_0$.
- **Treating a solution at one point as a solution.** A solution must satisfy the
  equation for every $x$ in an interval.

## Key points

- A differential equation relates an unknown function to its derivatives; its order is
  the highest derivative present.
- A solution makes the equation true on an interval; verify by differentiating and
  substituting.
- The general solution has arbitrary constants (one per order, typically); an initial
  condition picks out one particular solution.
- Constant functions that make the right side zero are equilibrium solutions.
