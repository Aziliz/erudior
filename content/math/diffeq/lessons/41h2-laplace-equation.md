---
id: de-m9-h-laplace
module: de-m9
title: 'Laplace''s equation: steady states in two dimensions'
minutes: 45
topics: [Laplace's equation]
drills: [de-m9-r2-plate-mode, de-m9-r2-disk]
refs: [de-ref-solutions]
honors: true
---
## Where the heat equation ends up

In Lesson 41 a rod with its ends held at fixed temperatures settled to an equilibrium
$v(x)$ with $v'' = 0$: a straight line. Now take a thin flat plate instead of a rod. Its
temperature $u(x, y, t)$ obeys the two-dimensional heat equation
$u_t = \alpha^2(u_{xx} + u_{yy})$, and once it stops changing ($u_t = 0$), what is left is

$$u_{xx} + u_{yy} = 0.$$

This is **Laplace's equation**, and its solutions are called **harmonic functions**. It is
the two-dimensional version of $v'' = 0$, but its solutions are far richer than straight
lines. The same equation describes the electric potential in a region with no charge, the
gravitational potential in empty space, and the velocity potential of an ideal fluid; it
carries the name of Pierre-Simon Laplace, who studied it in the 1780s in his work on
gravitation (Euler and Lagrange had already met it in fluid flow).

There is no time and no initial condition. Instead, the temperature is given all the way
around the boundary of the region. Finding $u$ inside from its values on the boundary is
called the **Dirichlet problem**. This lesson solves it on a rectangle and on a disk, then
looks at two properties that every harmonic function has.

## A rectangle with one heated edge

Take the rectangle $0 < x < a$, $0 < y < b$, with three edges held at 0 and the top edge at a
given temperature:

$$u(0, y) = u(a, y) = u(x, 0) = 0, \qquad u(x, b) = f(x).$$

![A rectangular plate with corners at the origin, (a, 0), (a, b) and (0, b). The top edge is highlighted and labeled u(x, b) = f(x); the left, right and bottom edges are labeled u = 0. Inside, the plate is labeled with Laplace's equation, the steady temperature.](images/de-m9-laplace-plate.svg)

Separate as in Lesson 40: $u = X(x)Y(y)$ gives $X''Y + XY'' = 0$, so

$$\frac{X''}{X} = -\frac{Y''}{Y} = -\lambda.$$

- **The $x$ problem** has zeros at both ends: $X'' + \lambda X = 0$, $X(0) = X(a) = 0$. You know this
  one: $\lambda_n = (n\pi/a)^2$, $X_n = \sin\dfrac{n\pi x}{a}$.
- **The $y$ problem** has the opposite sign: $Y'' - \lambda_nY = 0$, whose solutions are
  exponentials, or equivalently $\cosh$ and $\sinh$ of $\dfrac{n\pi y}{a}$. The bottom condition
  $Y(0) = 0$ kills the $\cosh$, leaving $Y_n = \sinh\dfrac{n\pi y}{a}$.

The sign flip is the heart of the matter. Laplace's equation treats $x$ and $y$ alike, so
if one direction oscillates, the other must grow or decay. Superposing,

$$u(x, y) = \sum_{n=1}^\infty c_n\sinh\frac{n\pi y}{a}\sin\frac{n\pi x}{a}.$$

At the top edge, $f(x) = \sum c_n\sinh\dfrac{n\pi b}{a}\sin\dfrac{n\pi x}{a}$, a Fourier sine series. So
$c_n\sinh\dfrac{n\pi b}{a} = b_n$, the sine coefficients of $f$ on $(0, a)$, and

$$u(x, y) = \sum_{n=1}^\infty b_n\,\frac{\sinh(n\pi y/a)}{\sinh(n\pi b/a)}\,\sin\frac{n\pi x}{a}, \qquad b_n = \frac2a\int_0^af(x)\sin\frac{n\pi x}{a}\,dx.$$

The ratio of sinh's equals 1 on the top edge and shrinks toward the bottom, faster for
larger $n$. Wiggles in the boundary data fade quickly as you move into the plate, just as
high modes of the heat equation fade quickly in time.

### Example 1: a single mode

A plate with $a = 2$, $b = 1$ has its top edge at $f(x) = 10\sin\dfrac{\pi x}{2}$ and the other edges
at 0. Find the temperature at the centre $(1, \tfrac12)$.

- The data is already one sine mode: $b_1 = 10$, all other $b_n = 0$.
- $u(x, y) = 10\,\dfrac{\sinh(\pi y/2)}{\sinh(\pi/2)}\sin\dfrac{\pi x}{2}$.
- At $(1, \tfrac12)$: $\sin\dfrac\pi2 = 1$ and $\dfrac{\sinh(\pi/4)}{\sinh(\pi/2)} \approx \dfrac{0.8687}{2.3013} \approx 0.3775$,
  so $u \approx 3.775$.

The isotherms (curves of constant temperature) of this solution show how the heat from
the top edge spreads down into the plate:

```plot
{"x": [0, 2], "y": [0, 1], "equal": true, "functions": [{"f": "(2/pi)*asinh(1*2.3012989/(10*sin(pi*x/2)))"}, {"f": "(2/pi)*asinh(3*2.3012989/(10*sin(pi*x/2)))"}, {"f": "(2/pi)*asinh(5*2.3012989/(10*sin(pi*x/2)))"}, {"f": "(2/pi)*asinh(8*2.3012989/(10*sin(pi*x/2)))"}], "caption": "Isotherms of Example 1 on the plate 0 < x < 2, 0 < y < 1: from bottom to top, u = 1, 3, 5 and 8. The hotter the isotherm, the closer it stays to the middle of the top edge, where f is largest."}
```

### Example 2: a whole edge at 100°, and a symmetry check

A square plate ($a = b = 1$) has its top edge at 100° and the other three at 0°. Find the
temperature at the centre.

- The sine coefficients of the constant 100 on $(0, 1)$ are $b_n = \dfrac{400}{n\pi}$ for odd $n$
  and 0 for even $n$ (Lesson 39, Example 3).
- At $(\tfrac12, \tfrac12)$, use $\dfrac{\sinh(n\pi/2)}{\sinh(n\pi)} = \dfrac{1}{2\cosh(n\pi/2)}$ and $\sin\dfrac{n\pi}{2} = \pm1$:
  $$u = \sum_{n\text{ odd}}\frac{200}{n\pi}\cdot\frac{(-1)^{(n-1)/2}}{\cosh(n\pi/2)} \approx 25.372 - 0.381 + 0.010 - \cdots \approx 25.00.$$

Exactly 25? Here is why, with no computation at all. Rotate the plate a quarter turn at a
time: you get four problems, each with a different edge at 100°. Their sum (by
superposition) is the problem with *all four* edges at 100°, whose solution is the
constant $u = 100$. By symmetry the four problems give the same value at the centre, so each
gives $100/4 = 25$. The series agrees.

The same superposition idea solves the general rectangle: split the boundary data into four
problems, each with only one nonzero edge, solve each with sines in the right direction,
and add.

## A disk

On a disk of radius $R$, use polar coordinates. Laplace's equation becomes

$$u_{rr} + \frac1ru_r + \frac{1}{r^2}u_{\theta\theta} = 0,$$

and the boundary data is $u(R, \theta) = f(\theta)$. Separating $u = \rho(r)\Theta(\theta)$ gives
$\Theta'' + \lambda\Theta = 0$ with $\Theta$ periodic of period $2\pi$, so $\lambda = n^2$ and
$\Theta = \cos n\theta$, $\sin n\theta$; and $r^2\rho'' + r\rho' - n^2\rho = 0$, a Cauchy–Euler equation
(Lesson 21) with solutions $r^n$ and $r^{-n}$ (or $1$ and $\ln r$ when $n = 0$). The temperature at
the centre must be finite, which rules out $r^{-n}$ and $\ln r$. So

$$u(r, \theta) = \frac{a_0}{2} + \sum_{n=1}^\infty\left(\frac rR\right)^n\big(a_n\cos n\theta + b_n\sin n\theta\big),$$

where $a_n$ and $b_n$ are the ordinary Fourier coefficients of $f(\theta)$ on $(-\pi, \pi)$.

### Example 3

A disk of radius 2 has edge temperature $f(\theta) = 3 + 4\cos\theta - \sin 2\theta$.

- The data is already a Fourier series: $\frac{a_0}{2} = 3$, $a_1 = 4$, $b_2 = -1$.
- $u = 3 + 4\left(\dfrac r2\right)\cos\theta - \left(\dfrac r2\right)^2\sin 2\theta$.
- In Cartesian form, $r\cos\theta = x$ and $r^2\sin 2\theta = 2xy$, so $u = 3 + 2x - \dfrac{xy}{2}$. Check:
  $u_{xx} = 0$ and $u_{yy} = 0$, so $u$ is harmonic.
- At the centre, $u = 3$, which is the average of $f$ around the circle (the cosine and sine terms
  average to zero). At $(1, 1)$, $u = 3 + 2 - \tfrac12 = 4.5$.

## Two properties of every harmonic function

**Mean value property**. Example 3 is no accident. Set $r = 0$ in the disk formula: the value
at the centre is $\tfrac{a_0}{2}$, the average of $f$ around the circle. Since any circle inside a
region can be treated this way, the value of a harmonic function at any point equals its
average over every circle centred there (as long as the disk lies in the region).

**Maximum principle**. A harmonic function that is not constant has no maximum or minimum
inside its region; its largest and smallest values are on the boundary. The mean value
property shows why: an interior maximum would have to equal the average of the values
around it, which is impossible unless they are all equal. Physically, a steady temperature
with no heat sources can't have a hot spot inside; heat would flow away from it. In
Example 2, the maximum principle guarantees $0 < u < 100$ everywhere inside the plate.

**Uniqueness follows.** If $u_1$ and $u_2$ solve the same Dirichlet problem, their difference
is harmonic and is 0 on the boundary, so its maximum and minimum are both 0: $u_1 = u_2$.
That is what justified the symmetry argument in Example 2: the constant 100 is *the*
solution with all edges at 100.

## Common mistakes

- **Giving both directions sines.** One direction must use $\sinh$ (or $\cosh$); choose the sine
  direction to be the one with zero values at both ends.
- **Forgetting to divide by $\sinh(n\pi b/a)$.** The top-edge data gives $c_n\sinh(n\pi b/a) = b_n$,
  not $c_n = b_n$.
- **Keeping $r^{-n}$ or $\ln r$ on a disk.** They blow up at the centre.
- **Looking for an initial condition.** Laplace's equation describes a steady state; the data
  is on the boundary only.
- **Expecting a hot spot inside.** By the maximum principle, the extremes are always on the
  boundary.

## Key points

- Steady temperatures in a plate satisfy Laplace's equation $u_{xx} + u_{yy} = 0$; its solutions are
  harmonic functions, determined by their boundary values (the Dirichlet problem).
- Rectangle with only the top edge nonzero: $u = \sum b_n\dfrac{\sinh(n\pi y/a)}{\sinh(n\pi b/a)}\sin\dfrac{n\pi x}{a}$, $b_n$ the
  sine coefficients of $f$. Several nonzero edges: solve one edge at a time and add.
- Disk of radius $R$: $u = \frac{a_0}{2} + \sum(r/R)^n(a_n\cos n\theta + b_n\sin n\theta)$ with the Fourier
  coefficients of the edge data.
- Mean value property: the value at a point is the average over any circle around it.
  Maximum principle: extremes occur on the boundary. Together they give uniqueness.
