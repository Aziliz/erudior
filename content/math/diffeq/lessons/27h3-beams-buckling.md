---
id: de-m6-h-beams
module: de-m6
title: 'Beams and buckling: boundary value problems'
minutes: 45
honors: true
topics: [Beams and buckling]
drills: [de-m6-r2-beam-deflection, de-m6-r2-buckling]
refs: [de-ref-solutions]
---
## Conditions at both ends

Every problem so far in Modules 5 and 6 has been an initial value problem: all the conditions
($y$, $y'$, …) were given at one instant, and the existence and uniqueness theorem promised
exactly one solution. Lesson 27 ended with a different kind of problem. A beam's deflection
satisfies $EI\,y^{(4)} = w$, and its four conditions come two at each *end* of the beam. That
is a boundary value problem, and the guarantee no longer holds: such a problem may have one
solution, none, or infinitely many. This honors lesson works out the beam problems engineers
use most, then shows how a boundary value problem with *no* forcing at all explains why a
column buckles.

The model here is the classical **Euler–Bernoulli beam** theory: a long, slender beam of
elastic material bending by small amounts. It is a simplification (it ignores shear
deformation, for instance), but it is the standard first model and works well for slender
beams.

## The beam equation

Put the beam along the $x$-axis from $x = 0$ to $x = L$, and let $y(x)$ be its downward
deflection under a downward load of $w(x)$ newtons per meter. The model links four quantities
to derivatives of $y$:

| Quantity | In terms of $y$ |
|---|---|
| deflection | $y$ |
| slope of the bent beam | $y'$ |
| bending moment | $EI\,y''$ (up to a sign convention) |
| shear force | $EI\,y'''$ (up to a sign convention) |
| load per unit length | $EI\,y^{(4)} = w(x)$ |

Here $E$ measures the stiffness of the material and $I$ the stiffness of the cross-section's
shape (a plank on edge is far stiffer than the same plank lying flat). Only their product
matters, the **flexural rigidity** $EI$, in N·m². Books differ on the signs of the moment and
shear; the conditions below only ever set them to zero, so the sign doesn't matter here.

## Boundary conditions

Each end gets two conditions, depending on how it is held:

| End | Physical meaning | Conditions |
|---|---|---|
| **Clamped end** (built in) | can't move or rotate | $y = 0$, $y' = 0$ |
| **Simply supported** end (pinned) | can't move, free to rotate, no moment | $y = 0$, $y'' = 0$ |
| **Free end** | nothing holds it: no moment, no shear | $y'' = 0$, $y''' = 0$ |

A beam clamped at one end and free at the other is a **cantilever**: a diving board, a
balcony, an airplane wing to a first approximation.

![Two beams. Top: a beam resting on a pin support at the left end and a roller support at the right end, under a uniform distributed load drawn as a row of downward arrows, with its dashed deflected shape sagging most in the middle. Bottom: a beam built into a wall at the left end and sticking out freely to the right, with its dashed deflected shape drooping most at the free end.](images/de-m6-beams.svg)

## Solving the beam problems

With constant $w$, integrating $EI\,y^{(4)} = w$ four times gives

$$y = \frac{w}{24EI}x^4 + c_3x^3 + c_2x^2 + c_1x + c_0,$$

and the four boundary conditions fix the four constants.

### Example 1: a simply supported beam

A beam of length $L$ rests on supports at both ends and carries a uniform load $w$. Find the
deflection and the largest sag.

- At $x = 0$: $y(0) = 0$ gives $c_0 = 0$; $y''(0) = 0$ gives $2c_2 = 0$, so $c_2 = 0$.
- $y'' = \dfrac{w}{2EI}x^2 + 6c_3x$. At $x = L$: $\dfrac{wL^2}{2EI} + 6c_3L = 0$, so
  $c_3 = -\dfrac{wL}{12EI}$.
- $y(L) = \dfrac{wL^4}{24EI} - \dfrac{wL^4}{12EI} + c_1L = 0$, so $c_1 = \dfrac{wL^3}{24EI}$.
- $$y = \frac{w}{24EI}\left(x^4 - 2Lx^3 + L^3x\right).$$
- By symmetry the largest sag is in the middle:
  $y(L/2) = \dfrac{w}{24EI}\left(\dfrac{L^4}{16} - \dfrac{L^4}{4} + \dfrac{L^4}{2}\right) = \dfrac{5wL^4}{384EI}$.

With numbers: $L = 3$ m, $w = 500$ N/m and $EI = 2.0 \times 10^4$ N·m² give a sag of
$\dfrac{5(500)(81)}{384(20000)} \approx 0.0264$ m, about 2.6 cm. Notice the $L^4$: doubling the
span multiplies the sag by 16, which is why long spans need much deeper beams.

### Example 2: a cantilever

A cantilever of length $L$ is clamped at $x = 0$, free at $x = L$, with uniform load $w$.

- Clamped: $y(0) = 0$ and $y'(0) = 0$ give $c_0 = c_1 = 0$.
- Free: $y''' = \dfrac{w}{EI}x + 6c_3$, and $y'''(L) = 0$ gives $c_3 = -\dfrac{wL}{6EI}$.
- $y'' = \dfrac{w}{2EI}x^2 + 6c_3x + 2c_2$, and $y''(L) = 0$ gives
  $\dfrac{wL^2}{2EI} - \dfrac{wL^2}{EI} + 2c_2 = 0$, so $c_2 = \dfrac{wL^2}{4EI}$.
- $$y = \frac{w}{24EI}\left(x^4 - 4Lx^3 + 6L^2x^2\right) = \frac{wx^2}{24EI}\left(x^2 - 4Lx + 6L^2\right).$$
- The tip deflection is $y(L) = \dfrac{wL^4}{24EI}(1 - 4 + 6) = \dfrac{wL^4}{8EI}$.

Compare: the cantilever's tip sags $\frac18 \div \frac{5}{384} = 9.6$ times as much as the middle of
a simply supported beam of the same length and load. Clamping both ends instead (all four
conditions $y = y' = 0$) gives a middle sag of only $\dfrac{wL^4}{384EI}$, a fifth of the simply
supported value.

## One, none or infinitely many

For initial value problems a unique solution is guaranteed. For boundary value problems it is
not. Take $y'' + y = 0$, whose general solution is $y = c_1\cos x + c_2\sin x$, with $y(0) = 0$,
which forces $c_1 = 0$. Now impose a condition at the other end:

- $y(\pi/2) = 1$: $c_2 = 1$. Exactly one solution, $y = \sin x$.
- $y(\pi) = 1$: $c_2\sin\pi = 0 \ne 1$. *no* solution.
- $y(\pi) = 0$: $c_2\sin\pi = 0$ for every $c_2$. *infinitely many* solutions, $y = c_2\sin x$.

The beam problems above have unique solutions, but the third case is not a curiosity. A
homogeneous boundary value problem whose only expected answer is $y = 0$ can suddenly allow
nonzero solutions for special values of a parameter. Those values are called *eigenvalues*
of the problem, and in a column they are the loads at which it buckles.

## Buckling of a column

Stand a slender column of length $L$ upright with pinned ends, and press down on the top with
a force $P$. For small sideways deflection $y(x)$ (now measured sideways, with $x$ along the
column), the compressive force produces a bending moment $Py$, and setting it equal to the
beam's moment gives

$$EI\,y'' + Py = 0, \qquad y(0) = 0, \quad y(L) = 0.$$

The straight column $y = 0$ always solves this. Is there a bent shape too? Write $\lambda = P/(EI) > 0$:
the general solution is $y = c_1\cos\sqrt\lambda\,x + c_2\sin\sqrt\lambda\,x$. Then $y(0) = 0$ gives
$c_1 = 0$, and $y(L) = c_2\sin(\sqrt\lambda\,L) = 0$. For a nonzero $c_2$ we need
$\sqrt\lambda\,L = n\pi$, so

$$P_n = \frac{n^2\pi^2EI}{L^2}, \qquad y_n = c\sin\frac{n\pi x}{L}, \qquad n = 1, 2, 3, \dots$$

For any load below the smallest, only the straight shape is possible. At

$$P_{\text{cr}} = \frac{\pi^2EI}{L^2},$$

the **critical buckling load** (Euler's load, after Leonhard Euler, who found it in the 18th
century), a bowed shape $c\sin(\pi x/L)$ becomes possible and the column **buckles**: it bows
sideways in a half sine wave.

```plot
{"x": [0, 1], "y": [-1.2, 1.2], "xLabel": "x / L", "yLabel": "y", "functions": [{"f": "sin(pi*x)", "label": "n = 1"}, {"f": "sin(2pi*x)", "dashed": true, "label": "n = 2"}], "caption": "Buckled shapes of a pinned column. The first mode (n = 1) appears at the critical load π²EI/L²; the second (n = 2) would need four times that load, so in practice the column buckles in the first mode."}
```

### Example 3

A pinned column has $EI = 2.0 \times 10^4$ N·m² and $L = 3$ m. Find its critical load, and the
effect of halving its length.

- $P_{\text{cr}} = \dfrac{\pi^2(2.0 \times 10^4)}{3^2} \approx 21{,}900$ N, about 21.9 kN.
- Halving $L$ divides $L^2$ by 4, so the critical load becomes about 87.7 kN, four times larger.

Two honest caveats. First, the linear model predicts the load at which the bent shape becomes
*possible* but leaves its amplitude $c$ undetermined; finding how far the column actually bends
needs a nonlinear model. Second, real columns are never perfectly straight, so they start
bending gradually as $P$ approaches $P_{\text{cr}}$, and short, stocky columns fail by crushing
before they buckle. Euler's formula is a model for slender columns. Other end conditions change
the constant: a column clamped at the base and free at the top (a flagpole loaded from above)
has $P_{\text{cr}} = \dfrac{\pi^2EI}{4L^2}$, a quarter of the pinned value.

## Common mistakes

- **Mixing up end conditions.** A pinned end has $y'' = 0$ (no moment) but $y' \ne 0$; a clamped
  end has $y' = 0$. A free end has *no* condition on $y$ or $y'$.
- **Expecting a unique solution.** A boundary value problem can have none or infinitely many.
- **Forgetting the fourth power.** Deflection scales like $L^4$; the buckling load like $1/L^2$.
- **Thinking buckling needs a sideways push.** The equation shows a perfectly straight column
  loses uniqueness of its straight shape at $P_{\text{cr}}$, with no sideways force at all.
- **Using $n = 0$.** It gives $y = 0$, not a buckled shape; the first mode is $n = 1$.

## Key points

- Euler–Bernoulli beam: $EI\,y^{(4)} = w$; $y'$ is slope, $EI\,y''$ moment, $EI\,y'''$ shear
  (up to sign).
- Clamped: $y = y' = 0$. Simply supported: $y = y'' = 0$. Free: $y'' = y''' = 0$.
- Uniform load: simply supported sag $5wL^4/(384EI)$; cantilever tip $wL^4/(8EI)$.
- Boundary value problems can have one, none or infinitely many solutions.
- Pinned column: $EI\,y'' + Py = 0$, $y(0) = y(L) = 0$ has bent solutions only at
  $P_n = n^2\pi^2EI/L^2$; the critical load is $P_{\text{cr}} = \pi^2EI/L^2$.
