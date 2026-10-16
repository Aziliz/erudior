---
id: de-bifurcation
module: de-m4
title: Population models and bifurcations
minutes: 30
topics: [Bifurcations]
drills: [de-harvest-eq, de-bifurcation-value]
refs: [de-ref-models]
---
## When a parameter changes the story

Models contain parameters: a growth rate, a harvesting quota, a drug dose. Usually,
nudging a parameter nudges the answer a little. But at certain critical values, the
whole qualitative picture changes: equilibria appear, vanish, or swap stability. Such a
change is a **bifurcation**, and the critical parameter value is a
**bifurcation value**. This lesson applies last lesson's phase lines to families of
equations $y' = f(y, c)$ that depend on a parameter $c$.

## Logistic growth with harvesting

Start with a fish population following the logistic law, and suppose fishing removes $h$
tonnes per year at a constant rate:

$$P' = rP\left(1 - \frac{P}{K}\right) - h.$$

Equilibria solve $rP(1 - P/K) = h$. The left side is a downward parabola with maximum
value $rK/4$ at $P = K/2$ (Lesson 4). Three cases:

- $h < rK/4$: the horizontal line at height $h$ crosses the parabola twice, giving two
  equilibria $P_1 < P_2$. The lower one is unstable (a threshold), the upper one stable.
  A population above $P_1$ settles at $P_2$; below $P_1$ it collapses.
- $h = rK/4$: one equilibrium at $P = K/2$, semistable.
- $h > rK/4$: no equilibria; $P' < 0$ always and the population crashes to zero no matter
  how large it starts.

So $h^* = rK/4$, the **maximum sustainable yield**, is the bifurcation value. Fishing
slightly below it looks safe, but the threshold $P_1$ creeps up toward $K/2$; a bad year
can push the population below it and into collapse.

### Example 1

For $P' = P(1 - P/100) - h$ (thousands of fish, per year), find the equilibria when
$h = 16$ and the bifurcation value.

- Equilibria: $P - \dfrac{P^2}{100} = 16$, so $P^2 - 100P + 1600 = 0$, giving
  $P = \dfrac{100 \pm \sqrt{10000 - 6400}}{2} = \dfrac{100 \pm 60}{2}$: $P_1 = 20$, $P_2 = 80$.
- Stability: $f'(P) = 1 - \dfrac{P}{50}$; $f'(20) = 0.6 > 0$ (unstable), $f'(80) = -0.6 < 0$
  (stable).
- Bifurcation: $h^* = rK/4 = 1 \cdot 100/4 = 25$.

## Bifurcation diagrams

A **bifurcation diagram** plots the equilibria against the parameter: parameter on the
horizontal axis, equilibrium values on the vertical. Stable branches are drawn solid,
unstable ones dashed. For harvesting with $r = 1$, $K = 100$, the equilibria
$P = 50 \pm \sqrt{2500 - 100h}$ trace a parabola lying on its side, opening to the left,
that ends at $h = 25$.

```plot
{"x": [0, 30], "y": [0, 110], "xLabel": "h", "yLabel": "P*", "functions": [{"f": "50 + sqrt(2500 - 100x)", "to": 25, "label": "stable"}, {"f": "50 - sqrt(2500 - 100x)", "to": 25, "dashed": true, "label": "unstable"}], "points": [{"at": [25, 50], "label": "h* = 25"}], "caption": "Bifurcation diagram for P′ = P(1 − P/100) − h: the two equilibria merge and vanish at h = 25."}
```

This kind of bifurcation, in which two equilibria collide and annihilate, is called a
**saddle-node bifurcation**. The prototype is $y' = c + y^2$:

- $c < 0$: equilibria $\pm\sqrt{-c}$; $-\sqrt{-c}$ stable, $+\sqrt{-c}$ unstable.
- $c = 0$: one semistable equilibrium at 0.
- $c > 0$: none.

## Other standard bifurcations

**Transcritical.** Two equilibria pass through each other and exchange stability.
Prototype $y' = cy - y^2 = y(c - y)$: equilibria $0$ and $c$. For $c < 0$, $0$ is stable;
for $c > 0$, $0$ is unstable and $c$ is stable. They swap at $c = 0$. Example: in
$P' = (b - d)P - kP^2$ (births minus deaths), the extinct state $P = 0$ is stable until the
birth rate overtakes the death rate.

**Pitchfork.** One equilibrium splits into three. Prototype $y' = cy - y^3$: for $c \le 0$
only $y = 0$ (stable); for $c > 0$, $y = 0$ becomes unstable and two new stable equilibria
$\pm\sqrt{c}$ appear. The diagram looks like a pitchfork.

### Example 2

Find the bifurcation value and describe the change for $y' = y^2 - 4y + c$.

- Equilibria: $y = \dfrac{4 \pm \sqrt{16 - 4c}}{2} = 2 \pm \sqrt{4 - c}$.
- For $c < 4$: two equilibria. $f'(y) = 2y - 4$, so $2 + \sqrt{4 - c}$ is unstable
  ($f' > 0$) and $2 - \sqrt{4 - c}$ is stable.
- At $c = 4$: one equilibrium $y = 2$ (semistable). For $c > 4$: none, and every solution
  increases (and in fact blows up).
- Bifurcation value $c = 4$; it's a saddle-node bifurcation.

### Example 3

For $y' = cy - y^3$, classify the equilibria when $c = 9$.

- $y(9 - y^2) = 0$ gives $y = 0, \pm 3$.
- $f'(y) = 9 - 3y^2$: $f'(0) = 9 > 0$ unstable; $f'(\pm3) = 9 - 27 = -18 < 0$ stable.
- Solutions starting at any positive value tend to 3; negative ones tend to $-3$.

## A general recipe

A bifurcation can only happen where an equilibrium stops being "robust", that is where
both

$$f(y, c) = 0 \quad\text{and}\quad \frac{\partial f}{\partial y}(y, c) = 0.$$

Solving these two equations together locates candidate bifurcation points. For harvesting:
$f = P - P^2/100 - h$ and $f_P = 1 - P/50 = 0$ give $P = 50$, then $h = 50 - 25 = 25$.

## Common mistakes

- **Plotting the wrong axes.** In a bifurcation diagram the parameter is horizontal.
- **Forgetting stability changes.** Count equilibria *and* check which are stable.
- **Assuming harvesting at the maximum sustainable yield is safe.** At $h = rK/4$ the
  equilibrium is semistable; any downward disturbance leads to collapse.
- **Mislabeling the types.** Two equilibria vanishing is saddle-node; exchanging stability
  is transcritical; one splitting into three is pitchfork.

## Key points

- A bifurcation is a qualitative change in the phase line as a parameter crosses a
  critical value.
- Logistic harvesting $P' = rP(1 - P/K) - h$ has two equilibria for $h < rK/4$, none for
  $h > rK/4$.
- Locate bifurcations by solving $f = 0$ and $f_y = 0$ together.
- Prototypes: saddle-node $c + y^2$, transcritical $cy - y^2$, pitchfork $cy - y^3$.
