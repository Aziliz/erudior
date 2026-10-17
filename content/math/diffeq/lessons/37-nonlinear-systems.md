---
id: de-nonlinear
module: de-m8
title: Nonlinear systems and linearization
minutes: 35
topics: [Nonlinear systems]
drills: [de-jacobian, de-predator-prey-eq]
refs: [de-ref-solutions, de-ref-models]
---
## Beyond linear

Most interesting systems are nonlinear: predators eat prey at a rate proportional to how
often they meet ($xy$), a pendulum's restoring force is $\sin\theta$, competing species crowd
each other. Nonlinear systems rarely have formula solutions, but the eigenvalue tools of Lessons
33–35 still tell us a great deal, because near an equilibrium a smooth nonlinear system
looks almost linear. This lesson develops **linearization** and applies it to the classic
**predator–prey** model.

## Autonomous systems and equilibria

We study autonomous systems

$$x' = F(x, y), \qquad y' = G(x, y).$$

An **equilibrium** (critical point) is a point where $F = 0$ and $G = 0$ simultaneously. Unlike a
linear system with $\det A \ne 0$, there can be several isolated ones. Find them by solving the two equations together;
factoring usually helps.

## Linearization

Near an equilibrium $(x_0, y_0)$, approximate $F$ and $G$ by their tangent planes. Since
$F(x_0, y_0) = G(x_0, y_0) = 0$, with $u = x - x_0$ and $v = y - y_0$:

$$\begin{bmatrix} u \\ v \end{bmatrix}' \approx J\begin{bmatrix} u \\ v \end{bmatrix}, \qquad J = \begin{bmatrix} F_x & F_y \\ G_x & G_y \end{bmatrix}\Bigg|_{(x_0, y_0)}.$$

$J$ is the **Jacobian matrix** evaluated at the equilibrium. The linear system $\mathbf{u}' = J\mathbf{u}$ is
the **linearization**.

**Theorem (linearization).** If the eigenvalues of $J$ are not purely imaginary and not
zero, the nonlinear system near the equilibrium has the same type and stability as the
linearization: saddles stay saddles, nodes stay nodes, spirals stay spirals, and sinks stay
sinks. (One fine point: if $J$ has a repeated real eigenvalue, the nonlinear terms can turn the
node into a spiral, though stability is unchanged.)

The borderline cases are the exception. If $J$ has a center (purely imaginary eigenvalues),
the nonlinear terms decide: the true picture may be a center, a slow spiral sink, or a slow
spiral source. Linearization alone can't tell.

### Example 1

Find and classify the equilibria of $x' = x - y$, $y' = x^2 - 4$.

- Equilibria: $x^2 = 4$ gives $x = \pm 2$, and $x = y$. So $(2, 2)$ and $(-2, -2)$.
- Jacobian: $J = \begin{bmatrix} 1 & -1 \\ 2x & 0 \end{bmatrix}$.
- At $(2, 2)$: $J = \begin{bmatrix} 1 & -1 \\ 4 & 0 \end{bmatrix}$, $T = 1$, $D = 4$, $T^2 - 4D = -15 < 0$: spiral source (unstable).
- At $(-2, -2)$: $J = \begin{bmatrix} 1 & -1 \\ -4 & 0 \end{bmatrix}$, $D = -4 < 0$: saddle.

## Predator–prey (Lotka–Volterra)

Let $x$ be the prey population (rabbits) and $y$ the predators (foxes). Without foxes,
rabbits grow exponentially; without rabbits, foxes die off; encounters (proportional to
$xy$) hurt rabbits and help foxes:

$$x' = ax - \alpha xy, \qquad y' = -cy + \gamma xy,$$

with all constants positive. This is the **Lotka–Volterra** model.

**Equilibria.** $x(a - \alpha y) = 0$ and $y(-c + \gamma x) = 0$ give $(0, 0)$ and
$\left(\dfrac{c}{\gamma}, \dfrac{a}{\alpha}\right)$.

**Linearize.** $J = \begin{bmatrix} a - \alpha y & -\alpha x \\ \gamma y & -c + \gamma x \end{bmatrix}$.

- At $(0, 0)$: $J = \begin{bmatrix} a & 0 \\ 0 & -c \end{bmatrix}$, eigenvalues $a > 0 > -c$: a saddle. Total
  extinction is unstable.
- At $\left(\dfrac c\gamma, \dfrac a\alpha\right)$: $J = \begin{bmatrix} 0 & -\alpha c/\gamma \\ \gamma a/\alpha & 0 \end{bmatrix}$,
  $T = 0$, $D = ac > 0$: eigenvalues $\pm i\sqrt{ac}$, a center for the linearization.

The linearization is inconclusive, but a separate argument settles it: separating
$\dfrac{dy}{dx} = \dfrac{y(-c + \gamma x)}{x(a - \alpha y)}$ gives a conserved quantity
$H = \gamma x - c\ln x + \alpha y - a\ln y$, constant along trajectories. Its level curves are
closed loops, so the true picture is a center: populations cycle forever, with the predator
peak lagging the prey peak by about a quarter cycle. The period near equilibrium is about
$\dfrac{2\pi}{\sqrt{ac}}$.

### Example 2

For $x' = x - 0.5xy$, $y' = -0.75y + 0.25xy$:

- $a = 1$, $\alpha = 0.5$, $c = 0.75$, $\gamma = 0.25$. Coexistence equilibrium:
  $\left(\dfrac{0.75}{0.25}, \dfrac{1}{0.5}\right) = (3, 2)$.
- Small oscillations around it have period about $\dfrac{2\pi}{\sqrt{0.75}} \approx 7.26$.

```plot
{"x": [0, 9], "y": [0, 6], "xLabel": "prey x", "yLabel": "predators y", "vectorField": {"u": "x - 0.5x*y", "v": "-0.75y + 0.25x*y", "step": 0.75}, "points": [{"at": [3, 2], "label": "(3, 2)"}], "caption": "Lotka–Volterra direction field: trajectories circle counterclockwise around the coexistence equilibrium (3, 2)."}
```

Counterclockwise: when prey are plentiful (right), predators grow (up); then prey decline
(left), then predators decline (down), and prey recover.

## Competing species

Two species competing for the same food, each logistic on its own:

$$x' = x(\epsilon_1 - \sigma_1x - \alpha_1y), \qquad y' = y(\epsilon_2 - \sigma_2y - \alpha_2x).$$

Linearizing at the four possible equilibria (both extinct, one extinct, coexistence) shows
two typical outcomes: if competition is weak, the coexistence point is a stable node; if
strong, it's a saddle and one species wins, depending on the starting point.

### Example 3

For $x' = x(1 - x - y)$, $y' = y(0.75 - y - 0.5x)$, the coexistence point solves
$x + y = 1$, $0.5x + y = 0.75$: $x = 0.5$, $y = 0.5$. There
$J = \begin{bmatrix} -x & -x \\ -0.5y & -y \end{bmatrix} = \begin{bmatrix} -0.5 & -0.5 \\ -0.25 & -0.5 \end{bmatrix}$,
$T = -1$, $D = 0.25 - 0.125 = 0.125$, $T^2 - 4D = 0.5 > 0$: a nodal sink. The species coexist stably.

## The pendulum

$\theta'' + \sin\theta = 0$ becomes $x' = y$, $y' = -\sin x$. Equilibria at $x = k\pi$, $y = 0$.
$J = \begin{bmatrix} 0 & 1 \\ -\cos x & 0 \end{bmatrix}$: at $x = 0$, eigenvalues $\pm i$ (center: small swings);
at $x = \pi$, $D = -1 < 0$ (saddle: balanced upside down, unstable).

## Common mistakes

- **Missing equilibria.** Solve $F = 0$ and $G = 0$ *together*; check every factor combination.
- **Jacobian entries in the wrong places.** Row 1 is the partials of $F$, row 2 of $G$.
- **Evaluating $J$ at the origin** instead of at the equilibrium in question.
- **Trusting a linearized center.** Purely imaginary eigenvalues are inconclusive for the
  nonlinear system.

## Key points

- Equilibria: $F = G = 0$. Linearize with the Jacobian $J$ of partial derivatives at each one.
- If $J$'s eigenvalues have nonzero real parts, the nonlinear system has the same type and stability.
- Lotka–Volterra $x' = ax - \alpha xy$, $y' = -cy + \gamma xy$: saddle at the origin, center at
  $(c/\gamma, a/\alpha)$; populations cycle.
