---
id: mv-h-pdes
module: mv-m3
title: Partial differential equations and the chain rule
minutes: 45
honors: true
topics: [Heat and wave equations, Laplace's equation]
drills: [mv-m3-r2-heat-decay, mv-m3-r2-dalembert]
refs: [mv-ref-differential]
---
## Equations made of partial derivatives

Lesson 13 checked that $u = e^{-t}\sin x$ satisfies the heat equation $u_t = u_{xx}$, and named
Laplace's equation and the wave equation in passing. A partial differential equation (PDE)
relates an unknown function of several variables to its partial derivatives, and three of them
run through physics and engineering. This lesson does two things with the tools of this module.
It uses partial derivatives to *check* and *build* solutions, and it uses the chain rule to
*change variables* in a PDE, which is the idea behind d'Alembert's general solution of the wave equation. Solving
PDEs systematically is a course of its own; here the goal is to see what the equations say and how
far the chain rule alone can take you.

## Three classic equations

| Equation | Form | Models | Variables |
|---|---|---|---|
| Heat (diffusion) | $u_t = \alpha\,u_{xx}$, $\alpha > 0$ | temperature in a rod, a spreading dye | position $x$, time $t$ |
| **Wave equation** | $u_{tt} = c^2u_{xx}$, $c > 0$ | a vibrating string, sound, light | position $x$, time $t$ |
| **Laplace's equation** | $u_{xx} + u_{yy} = 0$ | steady temperature, electrostatic potential | two space variables |

Each is an idealization: the heat equation assumes a uniform material with constant
diffusivity $\alpha$, the wave equation assumes small vibrations of a uniform string, and so on.
Within those assumptions they are remarkably accurate.

All three are *linear* and *homogeneous*: each term contains $u$ or one of its derivatives
exactly once, to the first power, with no term free of $u$. That gives the **superposition
principle**: if $u_1$ and $u_2$ are solutions, so is $c_1u_1 + c_2u_2$ for any constants. (Check
for the heat equation: $(c_1u_1 + c_2u_2)_t = c_1\alpha u_{1,xx} + c_2\alpha u_{2,xx} = \alpha(c_1u_1 + c_2u_2)_{xx}$.)
An equation like $u_t = u_{xx} + u^2$ is not linear, and the sum of two solutions is usually not a
solution.

## The heat equation: wiggles die fast

Try a solution of the form $u = e^{-\lambda t}\sin(nx)$, a sine profile whose height changes with
time. Then $u_t = -\lambda u$ and $u_{xx} = -n^2u$, so $u_t = \alpha u_{xx}$ requires
$\lambda = \alpha n^2$.

### Example 1

For which $\lambda$ does $u = e^{-\lambda t}\sin 3x$ solve $u_t = 2u_{xx}$? How long until its height
halves?

1. $u_t = -\lambda e^{-\lambda t}\sin3x$ and $u_{xx} = -9e^{-\lambda t}\sin3x$.
2. Matching $-\lambda = 2(-9)$ gives $\lambda = 18$.
3. The height is $e^{-18t}$; it halves when $e^{-18t} = \tfrac12$, at $t = \tfrac{\ln2}{18} \approx 0.0385$.

The decay rate $\alpha n^2$ grows with the *square* of the frequency $n$. By superposition,
$u = e^{-t}\sin x + \tfrac12e^{-9t}\sin3x$ solves $u_t = u_{xx}$, and its $\sin3x$ ripple fades nine
times faster than the main hump. Heat flow smooths out sharp features first; Joseph Fourier built
his theory of heat in the early 1800s on exactly this idea of splitting a profile into sines.

```plot
{"x": [0, 3.1416], "y": [-0.2, 1.4], "functions": [{"f": "sin(x) + 0.5*sin(3*x)"}, {"f": "exp(-0.1)*sin(x) + 0.5*exp(-0.9)*sin(3*x)", "dashed": true}, {"f": "exp(-0.5)*sin(x) + 0.5*exp(-4.5)*sin(3*x)"}], "labels": [{"at": [0.7, 1.13], "text": "t = 0"}, {"at": [1.5708, 0.78], "text": "t = 0.1"}, {"at": [1.5708, 0.33], "text": "t = 0.5"}], "xLabel": "x", "yLabel": "u", "caption": "u = e^(−t) sin x + ½e^(−9t) sin 3x at t = 0 (two humps and a dip), t = 0.1 (dashed) and t = 0.5 (one smooth hump): the ripple disappears long before the hump"}
```

## The wave equation and d'Alembert's solution

Let $F$ and $G$ be any twice-differentiable functions of one variable. Then

$$u(x, t) = F(x - ct) + G(x + ct)$$

solves $u_{tt} = c^2u_{xx}$. The check is the one-parameter chain rule: $u_t = -cF'(x - ct) + cG'(x + ct)$,
so $u_{tt} = c^2F'' + c^2G''$, while $u_{xx} = F'' + G''$. The term $F(x - ct)$ is a
**traveling wave**: at time $t$ its graph is the graph of $F$ shifted right by $ct$, so the shape
moves right at speed $c$ without changing. Likewise $G(x + ct)$ moves left. The surprising part is
that *every* solution has this form, and the chain rule proves it.

### Example 2: changing variables in the wave equation

Introduce the **characteristic coordinates** $\xi = x - ct$ and $\eta = x + ct$, and write
$u(x, t) = U(\xi, \eta)$, assuming $U$ has continuous second partials.

1. *First derivatives* (tree: $u$ through $\xi$ and $\eta$ down to $x$ and $t$; $\xi_x = \eta_x = 1$, $\xi_t = -c$, $\eta_t = c$):
   $u_x = U_\xi + U_\eta$ and $u_t = -cU_\xi + cU_\eta$.
2. *Second derivatives.* Apply the same rule to $U_\xi$ and $U_\eta$:
   $u_{xx} = U_{\xi\xi} + 2U_{\xi\eta} + U_{\eta\eta}$, and
   $u_{tt} = c^2U_{\xi\xi} - 2c^2U_{\xi\eta} + c^2U_{\eta\eta}$.
   (Clairaut's theorem lets us combine $U_{\xi\eta}$ and $U_{\eta\xi}$.)
3. *Substitute:* $u_{tt} - c^2u_{xx} = -4c^2U_{\xi\eta}$. So the wave equation becomes simply
   $U_{\xi\eta} = 0$.
4. *Solve.* $U_{\xi\eta} = 0$ says $U_\xi$ does not depend on $\eta$: $U_\xi = f(\xi)$. Integrating
   in $\xi$, $U = F(\xi) + G(\eta)$, where $F$ is an antiderivative of $f$ and the "constant" $G$ may
   depend on $\eta$.
5. So $u = F(x - ct) + G(x + ct)$: every such solution is a right-moving wave plus a left-moving one.

The lines $x - ct = \text{constant}$ and $x + ct = \text{constant}$ in the $xt$-plane are the
*characteristics*: information travels along them at speed $c$.

If the string starts with shape $u(x, 0) = \varphi(x)$ and velocity $u_t(x, 0) = \psi(x)$, fitting
$F$ and $G$ to these gives **d'Alembert's formula**

$$u(x, t) = \frac{\varphi(x - ct) + \varphi(x + ct)}{2} + \frac{1}{2c}\int_{x - ct}^{x + ct}\psi(s)\,ds.$$

Jean le Rond d'Alembert found this solution in the 1740s while studying vibrating strings.

### Example 3: a plucked bump splits in two

Let $c = 1$, $\varphi(x) = e^{-x^2}$ and $\psi = 0$ (released from rest). Then
$u = \tfrac12\left(e^{-(x - t)^2} + e^{-(x + t)^2}\right)$.

1. At $x = 0$: $u(0, t) = e^{-t^2}$, which falls from 1 toward 0 as the bump leaves the middle.
2. At $(x, t) = (3, 3)$: $u = \tfrac12\left(e^{0} + e^{-36}\right) \approx 0.5$. The right half-bump, half
   the original height, has arrived at $x = 3$.

```plot
{"x": [-5, 5], "y": [-0.1, 1.15], "yAxisAt": "left", "functions": [{"f": "exp(-x^2)"}, {"f": "0.5*(exp(-(x-1)^2) + exp(-(x+1)^2))", "dashed": true}, {"f": "0.5*(exp(-(x-3)^2) + exp(-(x+3)^2))"}], "labels": [{"at": [0.95, 0.9], "text": "t = 0"}, {"at": [-1.4, 0.6], "text": "t = 1"}, {"at": [-3, 0.57], "text": "t = 3"}, {"at": [3, 0.57], "text": "t = 3"}], "xLabel": "x", "yLabel": "u", "caption": "d'Alembert's solution with c = 1 at t = 0, t = 1 (dashed) and t = 3: the bump splits into two half-height bumps moving apart at speed 1"}
```

## Laplace's equation and harmonic functions

A solution of Laplace's equation is called harmonic. Examples are $x^2 - y^2$, $x^3 - 3xy^2$,
$e^x\sin y$ and $\ln(x^2 + y^2)$ (away from the origin); each takes two quick differentiations to
check. In physics $u$ is a steady state: a temperature that has stopped changing (set $u_t = 0$ in
the two-dimensional heat equation) or an electrostatic potential in a charge-free region.

Many problems have circular symmetry, so we want the equation in polar coordinates. Applying the
chain rule of Lesson 15 twice (a longer computation in the spirit of Example 2) gives

$$u_{rr} + \frac1r u_r + \frac{1}{r^2}u_{\theta\theta} = 0.$$

### Example 4: harmonic functions in polar form

1. $u = \ln r$: $u_r = 1/r$, $u_{rr} = -1/r^2$, $u_{\theta\theta} = 0$. Sum: $-\dfrac{1}{r^2} + \dfrac{1}{r^2} + 0 = 0$.
   So $\ln r = \tfrac12\ln(x^2 + y^2)$ is harmonic away from the origin.
2. $u = r^n\cos n\theta$: $u_{rr} = n(n - 1)r^{n-2}\cos n\theta$, $\tfrac1r u_r = nr^{n-2}\cos n\theta$,
   $\tfrac{1}{r^2}u_{\theta\theta} = -n^2r^{n-2}\cos n\theta$. Sum: $(n^2 - n + n - n^2)r^{n-2}\cos n\theta = 0$.
   For $n = 2$ this is $r^2\cos2\theta = x^2 - y^2$; for $n = 3$, $x^3 - 3xy^2$.

Harmonic functions have two striking properties, which we state without proof. The
**mean value property**: the value at the center of any circle (whose disk lies in the region)
equals the average of the values on the circle. And, as a consequence, a nonconstant harmonic
function on a connected region has no local maximum or minimum inside it, only on the boundary.
For steady temperature that is common sense: an interior hot spot would have to be losing heat to
its cooler surroundings, so it could not be steady.

## Common mistakes

- Forgetting the chain-rule factor: $\dfrac{\partial}{\partial t}F(x - ct) = -cF'(x - ct)$, so $u_{tt}$ picks up $c^2$.
- Getting the direction backwards: $F(x - ct)$ moves *right* (toward larger $x$) as $t$ grows.
- Assuming traveling waves solve the heat equation. $F(x - ct)$ solves the wave equation for any $F$, but the heat equation only for special $F$.
- Applying superposition to a nonlinear equation such as $u_t = u_{xx} + u^2$.
- Writing the polar Laplace equation as $u_{rr} + u_{\theta\theta} = 0$; the $\tfrac1r u_r$ term and the $\tfrac1{r^2}$ are essential.

## Key points

- Heat $u_t = \alpha u_{xx}$, wave $u_{tt} = c^2u_{xx}$, Laplace $u_{xx} + u_{yy} = 0$: all linear and homogeneous, so superposition holds.
- $e^{-\alpha n^2t}\sin nx$ solves the heat equation: higher frequencies decay faster.
- Characteristic coordinates $\xi = x - ct$, $\eta = x + ct$ turn the wave equation into $U_{\xi\eta} = 0$, so $u = F(x - ct) + G(x + ct)$.
- d'Alembert: $u = \tfrac12[\varphi(x - ct) + \varphi(x + ct)] + \tfrac{1}{2c}\int_{x-ct}^{x+ct}\psi$.
- Harmonic functions satisfy the mean value property and have no interior maxima or minima unless constant.
