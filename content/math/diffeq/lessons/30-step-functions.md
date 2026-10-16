---
id: de-laplace-step
module: de-m7
title: Step functions and the second shifting theorem
minutes: 35
topics: [Step functions]
drills: [de-step-transform, de-step-response]
refs: [de-ref-laplace]
---
## Switching things on and off

Real inputs are often piecewise: a voltage switched on at $t = 2$, a pump that runs for ten
minutes, a load applied and later removed. Such inputs are awkward for undetermined
coefficients, which would have to be applied separately on each piece with constants
matched at the joins. With Laplace transforms they're routine, thanks to one function and
one theorem.

## The unit step function

The **unit step function** (or **Heaviside function**) switches from 0 to 1 at $t = c$:

$$u_c(t) = \begin{cases} 0, & t < c, \\ 1, & t \ge c, \end{cases} \qquad c \ge 0.$$

Other common notations are $u(t - c)$ and $H(t - c)$. Its transform:

$$\mathcal{L}\{u_c(t)\} = \int_c^\infty e^{-st}\,dt = \frac{e^{-cs}}{s}.$$

### Building piecewise functions

- On between $a$ and $b$ (a **rectangular pulse**): $u_a(t) - u_b(t)$.
- A function that equals $f_1(t)$ for $t < c$ and $f_2(t)$ for $t \ge c$:
  $f_1(t) + \big(f_2(t) - f_1(t)\big)u_c(t)$. Read it as "start with $f_1$; at $t = c$, swap it for $f_2$."

### Example 1

Write $g(t) = \begin{cases} 0, & t < 1 \\ 3, & 1 \le t < 4 \\ 0, & t \ge 4 \end{cases}$ with step functions.

$g(t) = 3\big(u_1(t) - u_4(t)\big)$, with transform $\dfrac{3(e^{-s} - e^{-4s})}{s}$.

```plot
{"x": [0, 6], "y": [-0.5, 4], "xLabel": "t", "segments": [{"from": [0, 0], "to": [1, 0]}, {"from": [1, 3], "to": [4, 3]}, {"from": [4, 0], "to": [6, 0]}, {"from": [1, 0], "to": [1, 3], "dashed": true}, {"from": [4, 3], "to": [4, 0], "dashed": true}], "points": [{"at": [1, 3]}, {"at": [4, 0]}, {"at": [1, 0], "open": true}, {"at": [4, 3], "open": true}], "caption": "The pulse 3(u₁(t) − u₄(t)): on at t = 1, off at t = 4."}
```

## The second shifting theorem

Delaying a function by $c$ and switching it on at $t = c$ multiplies its transform by $e^{-cs}$:

$$\mathcal{L}\{u_c(t)\,f(t - c)\} = e^{-cs}F(s),$$

and conversely $\mathcal{L}^{-1}\{e^{-cs}F(s)\} = u_c(t)f(t - c)$.

Proof: substitute $\tau = t - c$:
$\displaystyle\int_c^\infty e^{-st}f(t - c)\,dt = \int_0^\infty e^{-s(\tau + c)}f(\tau)\,d\tau = e^{-cs}F(s)$.

The crucial detail: the function must be written in terms of $t - c$. Compare with the first
shifting theorem: there, multiplying by $e^{at}$ in $t$ shifted $s$; here, multiplying by
$e^{-cs}$ in $s$ shifts $t$.

### Example 2: transforming

Find $\mathcal{L}\{u_2(t)\,t^2\}$.

- Rewrite $t^2$ in terms of $t - 2$: $t^2 = (t - 2)^2 + 4(t - 2) + 4$.
- So $f(\tau) = \tau^2 + 4\tau + 4$, with $F(s) = \dfrac{2}{s^3} + \dfrac{4}{s^2} + \dfrac4s$.
- $\mathcal{L}\{u_2(t)t^2\} = e^{-2s}\left(\dfrac{2}{s^3} + \dfrac{4}{s^2} + \dfrac4s\right)$.

A shortcut: $\mathcal{L}\{u_c(t)g(t)\} = e^{-cs}\mathcal{L}\{g(t + c)\}$. Here $g(t + 2) = (t + 2)^2$.

### Example 3: inverting

Find $\mathcal{L}^{-1}\left\{\dfrac{e^{-3s}}{s^2 + 1}\right\}$.

- Without the exponential: $\mathcal{L}^{-1}\left\{\dfrac{1}{s^2 + 1}\right\} = \sin t$.
- With it: $u_3(t)\sin(t - 3)$. The function is zero until $t = 3$, then a sine starting from 0.

## Solving IVPs with switched forcing

### Example 4: a pulse

Solve $y' + y = g(t)$, $y(0) = 0$, where $g = 1$ for $0 \le t < 2$ and $0$ after.

- $g(t) = 1 - u_2(t)$, so $G(s) = \dfrac{1 - e^{-2s}}{s}$.
- $(s + 1)Y = \dfrac{1 - e^{-2s}}{s}$, so $Y = (1 - e^{-2s})H(s)$ with $H(s) = \dfrac{1}{s(s + 1)} = \dfrac1s - \dfrac{1}{s + 1}$.
- $h(t) = 1 - e^{-t}$. Then $y = h(t) - u_2(t)h(t - 2)$:

$$y(t) = 1 - e^{-t} - u_2(t)\left(1 - e^{-(t - 2)}\right).$$

- Piece by piece: for $t < 2$, $y = 1 - e^{-t}$ (charging up); for $t \ge 2$,
  $y = e^{-(t - 2)} - e^{-t} = (e^2 - 1)e^{-t}$ (decaying after the input switches off).

```plot
{"x": [0, 7], "y": [-0.1, 1.1], "xLabel": "t", "functions": [{"f": "1 - exp(-x)", "to": 2, "label": "input on"}, {"f": "(exp(2) - 1)*exp(-x)", "from": 2, "label": "input off"}, {"f": "1", "to": 2, "dashed": true}], "caption": "Response of y′ + y = 1 − u₂(t): it rises toward 1, then decays once the input switches off at t = 2."}
```

### Example 5: second order

Solve $y'' + 4y = u_\pi(t)$, $y(0) = 0$, $y'(0) = 0$.

- $(s^2 + 4)Y = \dfrac{e^{-\pi s}}{s}$, so $Y = e^{-\pi s}H(s)$ with $H = \dfrac{1}{s(s^2 + 4)}$.
- $H = \dfrac14\left(\dfrac1s - \dfrac{s}{s^2 + 4}\right)$, so $h(t) = \tfrac14(1 - \cos 2t)$.
- $y = u_\pi(t)\cdot\tfrac14\big(1 - \cos 2(t - \pi)\big) = \tfrac14u_\pi(t)(1 - \cos 2t)$, since
  $\cos(2t - 2\pi) = \cos 2t$.
- The spring sits still until $t = \pi$, then oscillates between 0 and $\tfrac12$.

## The general pattern

Whenever $Y(s) = e^{-cs}H(s)$: find $h = \mathcal{L}^{-1}\{H\}$ first, *then* replace $t$ by $t - c$
and multiply by $u_c(t)$. Doing these in the wrong order is the most common error.

### Example 6: switching from one input to another

Solve $y' + 2y = g(t)$, $y(0) = 0$, where $g = 4$ for $t < 1$ and $g = 0$ afterwards, then
describe the solution on each piece.

- $g = 4 - 4u_1(t)$, so $(s + 2)Y = \dfrac{4(1 - e^{-s})}{s}$.
- $H(s) = \dfrac{4}{s(s + 2)} = \dfrac2s - \dfrac{2}{s + 2}$, so $h(t) = 2 - 2e^{-2t}$.
- $y = h(t) - u_1(t)h(t - 1)$: for $t < 1$, $y = 2 - 2e^{-2t}$; for $t \ge 1$,
  $y = 2e^{-2(t - 1)} - 2e^{-2t}$, a decaying exponential that starts where the first piece ended.

Notice that $y$ itself is continuous at $t = 1$ even though the input jumps; only $y'$ jumps.

## Common mistakes

- **Not rewriting in terms of $t - c$.** $\mathcal{L}\{u_2(t)t\}$ is not $e^{-2s}/s^2$; it's
  $e^{-2s}\left(\dfrac{1}{s^2} + \dfrac{2}{s}\right)$.
- **Shifting the wrong variable.** The inverse of $e^{-cs}H(s)$ is $u_c(t)h(t - c)$, with
  the shift inside $h$.
- **Pulse sign.** "On from $a$ to $b$" is $u_a - u_b$, not $u_b - u_a$.
- **Forgetting the step factor** in the final answer, which would make the delayed piece
  act before it should.

## Key points

- $u_c(t)$ steps from 0 to 1 at $t = c$; $\mathcal{L}\{u_c\} = e^{-cs}/s$.
- Piecewise functions: $f_1 + (f_2 - f_1)u_c$; pulses $u_a - u_b$.
- Second shift: $\mathcal{L}\{u_c(t)f(t - c)\} = e^{-cs}F(s)$;
  $\mathcal{L}^{-1}\{e^{-cs}H(s)\} = u_c(t)h(t - c)$.
