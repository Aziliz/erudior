---
id: de-m9-h-dalembert
module: de-m9
title: 'd''Alembert''s solution: waves that travel'
minutes: 45
topics: [d'Alembert's solution]
drills: [de-m9-r2-pulse, de-m9-r2-velocity-kick]
refs: [de-ref-solutions]
honors: true
---
## A second way to see a vibrating string

Lesson 40 solved the wave equation $u_{tt} = a^2u_{xx}$ as a sum of standing waves, each one
vibrating in place. But pluck a long rope or flick a slinky and you see something else: a
bump that *travels*, keeping its shape. This lesson finds the solution in that form. It is
older than the Fourier approach: Jean le Rond d'Alembert wrote down the wave equation for a
string and solved it this way in 1747. When Daniel Bernoulli proposed a few years later that
every vibration is a sum of sine modes, d'Alembert, Euler and Bernoulli argued for years
over whether the two answers could describe the same motions. They do, and seeing why is
part of this lesson.

## Traveling waves

Take any twice-differentiable function $F$ and set $u(x, t) = F(x - at)$. The graph at time $t$
is the graph of $F$ slid $at$ units to the right: a shape moving right at speed $a$. The chain
rule gives $u_t = -aF'$, $u_{tt} = a^2F''$ and $u_{xx} = F''$, so $u_{tt} = a^2u_{xx}$. Likewise
$G(x + at)$ is a shape moving left at speed $a$. So every

$$u(x, t) = F(x - at) + G(x + at)$$

solves the wave equation, and $a$ really is the speed of the waves.

**Every solution has this form.** Change variables to $\xi = x - at$ and $\eta = x + at$. By the
chain rule, $u_x = u_\xi + u_\eta$ and $u_t = -au_\xi + au_\eta$, and differentiating again,

$$u_{xx} = u_{\xi\xi} + 2u_{\xi\eta} + u_{\eta\eta}, \qquad u_{tt} = a^2\big(u_{\xi\xi} - 2u_{\xi\eta} + u_{\eta\eta}\big).$$

So $u_{tt} - a^2u_{xx} = -4a^2u_{\xi\eta}$, and the wave equation becomes simply $u_{\xi\eta} = 0$.
Integrating in $\eta$ shows $u_\xi$ depends on $\xi$ alone; integrating that in $\xi$ gives
$u = F(\xi) + G(\eta)$. The lines $x - at = \text{const}$ and $x + at = \text{const}$ along which the two
pieces travel unchanged are the **characteristics** of the wave equation.

## d'Alembert's formula

On an infinite string with initial position $u(x, 0) = f(x)$ and initial velocity
$u_t(x, 0) = g(x)$, the conditions say

$$F(x) + G(x) = f(x), \qquad -aF'(x) + aG'(x) = g(x).$$

Integrate the second: $G(x) - F(x) = \dfrac1a\displaystyle\int_0^xg(s)\,ds + C$. Adding and subtracting
with the first equation gives $F$ and $G$, and putting them back into $F(x - at) + G(x + at)$
(the constant $C$ cancels) gives **d'Alembert's formula**:

$$u(x, t) = \frac{f(x - at) + f(x + at)}{2} + \frac{1}{2a}\int_{x-at}^{x+at}g(s)\,ds.$$

Read it as: the initial shape splits into two half-size copies that move apart, and the
initial velocity contributes the integral of $g$ over an interval that widens at speed $a$ in
each direction.

### Example 1: a plucked pulse splits in two

A long string with $a = 2$ starts at rest ($g = 0$) with the triangular bump
$f(x) = \max(0,\ 1 - |x|)$: height 1 at $x = 0$, zero outside $|x| < 1$.

- $u(x, t) = \tfrac12\big[f(x - 2t) + f(x + 2t)\big]$: two triangles of height $\tfrac12$, centred at
  $x = 2t$ and $x = -2t$.
- At $t = 0.25$, centre: $u(0, 0.25) = \tfrac12[f(-0.5) + f(0.5)] = \tfrac12(0.5 + 0.5) = 0.5$.
- At $t = 0.25$, $x = 0.75$: $u = \tfrac12[f(0.25) + f(1.25)] = \tfrac12(0.75 + 0) = 0.375$.
- Each half has width 2, and their centres are $4t$ apart, so they stop overlapping at
  $t = 0.5$. After that the string between them is flat. At $t = 1$, $u(2, 1) = \tfrac12[f(0) + f(4)] = 0.5$:
  the peak of the right-moving half has reached $x = 2$.

```plot
{"x": [-3.5, 3.5], "y": [-0.1, 1.1], "functions": [{"f": "max(0, 1 - abs(x))", "dashed": true, "label": "t = 0"}, {"f": "0.5*max(0, 1 - abs(x - 0.5)) + 0.5*max(0, 1 - abs(x + 0.5))", "label": "t = 0.25"}, {"f": "0.5*max(0, 1 - abs(x - 1.5)) + 0.5*max(0, 1 - abs(x + 1.5))", "label": "t = 0.75"}], "caption": "Example 1 (a = 2): the initial triangle (dashed) splits into two half-height copies moving apart at speed 2, shown at t = 0.25 (still overlapping) and t = 0.75 (separated)."}
```

## Domain of dependence and finite speed

d'Alembert's formula says exactly which initial data can affect $u$ at a point $(x_0, t_0)$:
only the values of $f$ at $x_0 \pm at_0$ and of $g$ between them. The interval
$[x_0 - at_0,\ x_0 + at_0]$ is the **domain of dependence** of the point. In the $xt$-plane it is cut
out by the two characteristics through $(x_0, t_0)$.

![The xt-plane with a point (x0, t0) above the x-axis. Two straight characteristic lines run down from it to the x-axis: the left one, x − at = x0 − at0, meets the axis at x0 − at0, and the right one, x + at = x0 + at0, meets it at x0 + at0. The triangle between them is shaded, and the base interval on the x-axis is highlighted and labeled domain of dependence.](images/de-m9-characteristics.svg)

Turned around, a disturbance at a point $x_1$ at time 0 can affect only the region
$|x - x_1| \le at$ at later times, its **range of influence**: a wedge opening upward. Signals
travel at speed $a$ and no faster. The heat equation is completely different: in that model
a change anywhere on an infinite rod is felt everywhere at once (if only very faintly far
away). Finite speed is the mathematical signature of a wave.

### Example 2: a string struck by a hammer

A long string with $a = 1$ is flat at $t = 0$ ($f = 0$), and a hammer gives the piece $|x| < 1$ an
upward velocity: $g(x) = 1$ there and 0 elsewhere.

- $u(x, t) = \dfrac12\displaystyle\int_{x-t}^{x+t}g(s)\,ds = \tfrac12 \times$ (length of the part of $[x - t,\ x + t]$ inside $[-1, 1]$).
- **At $x = 0$:** the overlap has length $2t$ until $t = 1$, then 2. So $u(0, t) = t$ for $t \le 1$, and
  $u = 1$ after that.
- **At $x = 3$:** the interval $[3 - t,\ 3 + t]$ first reaches $[-1, 1]$ when $3 - t = 1$, at $t = 2$. So
  $u(3, t) = 0$ for $t \le 2$ (the news hasn't arrived), $u = \tfrac12(t - 2)$ for $2 \le t \le 4$, and
  $u = 1$ for $t \ge 4$. For instance $u(3, 3) = 0.5$.

On an infinite string the struck region ends up permanently raised by 1, and the raised
part keeps spreading outward at speed 1. (A real string has fixed ends and some
damping, so this is an idealization.)

## Strings with fixed ends

For a string on $0 < x < L$ with $u(0, t) = u(L, t) = 0$, extend $f$ and $g$ to be **odd** about
$x = 0$ and periodic with period $2L$, exactly the odd extension of Lesson 39. Then
d'Alembert's formula with the extended data solves the problem: the oddness makes the
two traveling pieces cancel at $x = 0$ and $x = L$ at every instant. Physically, a pulse that
reaches a fixed end comes back upside down: the "mirror" pulse arriving from beyond
the end is its negative.

### Example 3: reflection from the ends

A string with $L = 4$, $a = 1$ starts at rest with a triangle of height 1 in the middle:
$f(x) = \max(0,\ 1 - |x - 2|)$.

- **$t = 1$:** two half-height triangles centred at $x = 1$ and $x = 3$, each just touching an end.
- **$t = 2$:** each half is centred on an end, where it meets its upside-down mirror image.
  They cancel everywhere: $u(x, 2) = 0$ for all $x$. The string is flat for an instant, but
  still moving.
- **$t = 4 = L/a$:** the reflected, inverted halves meet again in the middle: $u(x, 4) = -f(x)$,
  the original pulse upside down.
- **$t = 8 = 2L/a$:** after a second round of reflections, $u(x, 8) = f(x)$. The motion repeats
  with period $2L/a$, which is the period of the fundamental mode, $\dfrac{a}{2L}$ cycles per unit
  time (Lesson 40).

## The two pictures agree

Why do standing waves and traveling waves describe the same motions? A product-to-sum
identity shows that each normal mode is itself two traveling waves:

$$\sin\frac{n\pi x}{L}\cos\frac{n\pi at}{L} = \frac12\left[\sin\frac{n\pi(x - at)}{L} + \sin\frac{n\pi(x + at)}{L}\right].$$

So a sum of modes is a sum of right-moving and left-moving waves, which is d'Alembert's
form. Conversely, expanding the odd extension of $f$ in its sine series turns d'Alembert's
solution back into Lesson 40's. Settling exactly which functions $f$ such series can represent
took until the nineteenth century, after Fourier.

## Common mistakes

- **Forgetting the $\tfrac12$.** The initial shape splits into two copies of *half* the height.
- **Using $f$ in the velocity term.** The integral is of $g$, over $[x - at,\ x + at]$, divided by $2a$.
- **Mixing up directions.** $F(x - at)$ moves right; $G(x + at)$ moves left.
- **Ignoring the ends.** On a finite string, use the odd periodic extension; a pulse returns
  inverted from a fixed end.
- **Thinking the wave equation smooths corners.** It doesn't: the corners of the triangle
  travel along characteristics forever (in this undamped model).

## Key points

- Every solution of $u_{tt} = a^2u_{xx}$ is $F(x - at) + G(x + at)$: two shapes traveling in
  opposite directions at speed $a$ along the characteristics $x \mp at = \text{const}$.
- d'Alembert: $u = \frac12\big[f(x - at) + f(x + at)\big] + \frac{1}{2a}\int_{x-at}^{x+at}g(s)\,ds$.
- The domain of dependence of $(x_0, t_0)$ is $[x_0 - at_0,\ x_0 + at_0]$; disturbances spread
  at finite speed $a$.
- Fixed ends: use the odd $2L$-periodic extension; pulses reflect upside down, and the motion
  has period $2L/a$.
- Each standing wave is a sum of two traveling waves, so the Fourier and d'Alembert solutions
  agree.
