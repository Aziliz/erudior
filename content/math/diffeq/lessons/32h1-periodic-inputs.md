---
id: de-m7-h-periodic
module: de-m7
title: 'Periodic inputs: square waves, sawtooths and rectified sines'
minutes: 40
topics: [Laplace transforms of periodic functions]
drills: [de-m7-r2-periodic-pulse, de-m7-r2-periodic-steady]
refs: [de-ref-laplace]
honors: true
---
## Inputs that repeat forever

Lesson 31 switched an input on and off once or twice, and each switch added one factor
$e^{-cs}$ to the transform. Many real inputs switch forever: a clock signal in a digital
circuit, a motor driven by on/off pulses, a heater controlled by a thermostat, the output
of a rectifier that turns alternating current into bumpy direct current. Written with step
functions, such an input needs infinitely many steps. This lesson shows that the infinite
sum of shifts adds up to a single closed-form transform, and that the same sum, read
backward, tells you how a system responds and how it settles into a repeating cycle.

## The transform of a periodic function

A function is periodic with period $T > 0$ if $f(t + T) = f(t)$ for all $t \ge 0$. (The
Fourier-series lesson uses the same idea on the whole real line; here only $t \ge 0$
matters.) Suppose $f$ is periodic and piecewise continuous. Split the transform integral
into one-period pieces:

$$F(s) = \sum_{n=0}^{\infty}\int_{nT}^{(n+1)T} e^{-st}f(t)\,dt.$$

In the $n$th piece substitute $t = \tau + nT$. Because $f(\tau + nT) = f(\tau)$, the piece
becomes $e^{-nTs}\int_0^T e^{-s\tau}f(\tau)\,d\tau$. Every piece is the first one times a
power of $e^{-Ts}$, and for $s > 0$ the geometric series $\sum e^{-nTs}$ adds up to
$1/(1 - e^{-Ts})$. So

$$\mathcal{L}\{f\} = \frac{1}{1 - e^{-Ts}}\int_0^T e^{-st}f(t)\,dt \qquad (s > 0).$$

The integral over one period is the transform of the **one-period window** $f_T$, the
function that agrees with $f$ on $[0, T)$ and is zero afterward. So in words: *transform one
period, then divide by $1 - e^{-Ts}$*.

There is a second way to see it that connects with Lesson 31. The periodic function is
its window repeated: $f(t) = \sum_{n} u_{nT}(t)\,f_T(t - nT)$. By the second shifting
theorem each copy contributes $e^{-nTs}F_T(s)$, and the copies add up to the same geometric
series. Both derivations need only that $f$ be periodic from $t = 0$ on.

![Three periodic inputs drawn over two or three periods each. Top: a square wave that is 1 for 0 to a, 0 from a to 2a, and repeats. Middle: a sawtooth that rises in a straight line from 0 to T, drops back to 0, and repeats. Bottom: a half-wave rectified sine, which follows the arches of sin t from 0 to pi, is 0 from pi to 2 pi, and repeats.](images/de-m7-periodic-waves.svg)

### Example 1: a square wave

Let $f$ be the on/off **square wave** that equals 1 for $0 \le t < a$ and 0 for
$a \le t < 2a$, repeating with period $T = 2a$.

- One period: $\displaystyle\int_0^{a} e^{-st}\,dt = \frac{1 - e^{-as}}{s}$.
- Divide by $1 - e^{-2as} = (1 - e^{-as})(1 + e^{-as})$:

$$F(s) = \frac{1 - e^{-as}}{s(1 - e^{-as})(1 + e^{-as})} = \frac{1}{s(1 + e^{-as})}.$$

A square wave that switches between $+1$ and $-1$ is twice this one minus 1, so its
transform is $\dfrac{2}{s(1 + e^{-as})} - \dfrac1s = \dfrac{1 - e^{-as}}{s(1 + e^{-as})}$. Multiplying top
and bottom by $e^{as/2}$ turns it into $\dfrac{1}{s}\tanh\dfrac{as}{2}$, the form most tables list.

### Example 2: a sawtooth

The **sawtooth wave** $f(t) = t$ for $0 \le t < T$, repeated with period $T$, rises steadily
and then drops back to 0. Integrate by parts over one period:

$$\int_0^T te^{-st}\,dt = \frac{1}{s^2} - e^{-Ts}\left(\frac{T}{s} + \frac{1}{s^2}\right).$$

Dividing by $1 - e^{-Ts}$ and simplifying (write $\dfrac{1}{s^2} - \dfrac{e^{-Ts}}{s^2} = \dfrac{1 - e^{-Ts}}{s^2}$):

$$F(s) = \frac{1}{s^2} - \frac{Te^{-Ts}}{s(1 - e^{-Ts})}.$$

This reads nicely: the sawtooth is the ramp $t$ minus a staircase that drops by $T$ at
$t = T, 2T, 3T, \dots$, and that staircase $T\big(u_T + u_{2T} + \cdots\big)$ has transform
$\dfrac{T}{s}\big(e^{-Ts} + e^{-2Ts} + \cdots\big) = \dfrac{Te^{-Ts}}{s(1 - e^{-Ts})}$.

### Example 3: a rectified sine

A rectifier passes only the positive half of an alternating voltage. The
**half-wave rectified sine** is $\sin t$ for $0 \le t < \pi$ and 0 for $\pi \le t < 2\pi$, period
$2\pi$. Using $\int e^{-st}\sin t\,dt$ from a table (or two integrations by parts),

$$\int_0^{\pi} e^{-st}\sin t\,dt = \frac{1 + e^{-\pi s}}{s^2 + 1},$$

and $1 - e^{-2\pi s} = (1 - e^{-\pi s})(1 + e^{-\pi s})$, so

$$F(s) = \frac{1}{(s^2 + 1)(1 - e^{-\pi s})}.$$

The **full-wave rectified sine** $|\sin t|$ has period $\pi$ and the same one-period integral,
so its transform is $\dfrac{1 + e^{-\pi s}}{(s^2 + 1)(1 - e^{-\pi s})}$. As a numerical check of the
half-wave result, at $s = 1$ the formula gives $\dfrac{1}{2(1 - e^{-\pi})} \approx 0.5226$, and
integrating $e^{-t}\max(\sin t, 0)$ numerically over $[0, \infty)$ gives the same.

## Solving with a periodic input

The factor $1/(1 - e^{-Ts})$ or $1/(1 + e^{-as})$ is not in any table, but it doesn't need to
be: expand it back into its geometric series and use the second shifting theorem term by
term. At any fixed time only finitely many terms have switched on, so the "infinite" answer
is a finite sum wherever you evaluate it.

### Example 4: an RC circuit driven by a square wave

Solve $y' + y = f(t)$, $y(0) = 0$, where $f$ is the square wave of Example 1 with $a = 1$ (on
for one unit of time, off for one, and so on). Think of $y$ as the voltage on a capacitor
charged through a resistor by a switched source.

- Transform: $(s + 1)Y = \dfrac{1}{s(1 + e^{-s})}$, so $Y = H(s)\cdot\dfrac{1}{1 + e^{-s}}$ with
  $H(s) = \dfrac{1}{s(s + 1)} = \dfrac1s - \dfrac{1}{s + 1}$ and $h(t) = 1 - e^{-t}$.
- Expand: $\dfrac{1}{1 + e^{-s}} = 1 - e^{-s} + e^{-2s} - e^{-3s} + \cdots$ (valid for $s > 0$).
- Shift term by term:

$$y(t) = \sum_{n=0}^{\infty}(-1)^n\,u_n(t)\,h(t - n) = h(t) - u_1(t)h(t - 1) + u_2(t)h(t - 2) - \cdots$$

- For instance, at $t = 1.5$ only two terms are on:
  $y(1.5) = (1 - e^{-1.5}) - (1 - e^{-0.5}) = e^{-0.5} - e^{-1.5} \approx 0.3834$. Directly: the
  capacitor reached $1 - e^{-1} \approx 0.6321$ at $t = 1$ and then decayed for half a unit,
  $0.6321e^{-0.5} \approx 0.3834$. ✓

```plot
{"x": [0, 8], "y": [-0.05, 1.1], "xLabel": "t", "functions": [{"f": "1 - exp(-x)", "from": 0, "to": 1, "color": "#2e86c1", "label": "y(t)"}, {"f": "0.632121*exp(-(x - 1))", "from": 1, "to": 2, "color": "#2e86c1"}, {"f": "1 - 0.767456*exp(-(x - 2))", "from": 2, "to": 3, "color": "#2e86c1"}, {"f": "0.717669*exp(-(x - 3))", "from": 3, "to": 4, "color": "#2e86c1"}, {"f": "1 - 0.735984*exp(-(x - 4))", "from": 4, "to": 5, "color": "#2e86c1"}, {"f": "0.729246*exp(-(x - 5))", "from": 5, "to": 6, "color": "#2e86c1"}, {"f": "1 - 0.731725*exp(-(x - 6))", "from": 6, "to": 7, "color": "#2e86c1"}, {"f": "0.730813*exp(-(x - 7))", "from": 7, "to": 8, "color": "#2e86c1"}, {"f": "0.731059", "dashed": true, "label": "0.731"}, {"f": "0.268941", "dashed": true, "label": "0.269"}], "segments": [{"from": [0, 1], "to": [1, 1], "dashed": true}, {"from": [2, 1], "to": [3, 1], "dashed": true}, {"from": [4, 1], "to": [5, 1], "dashed": true}, {"from": [6, 1], "to": [7, 1], "dashed": true}], "caption": "y′ + y = square wave (on for 1, off for 1), y(0) = 0. Short dashed bars at height 1 mark when the input is on. The response settles into a repeating cycle between about 0.269 and 0.731."}
```

## The periodic steady state

The graph shows the response climbing during each "on" interval and sagging during each
"off" interval, with the peaks creeping up: $0.6321$, $0.7177$, $0.7292$, $0.7308$, … The
peaks approach a limit because the part of the solution that remembers the initial
condition decays like $e^{-t}$. What remains is the **periodic steady state**, a solution
with the same period as the input.

You can find the steady state without the infinite sum. Call its minimum $m$ (reached when
the input switches on) and its maximum $M$ (reached when it switches off). On an "on"
interval of length 1 the solution of $y' + y = 1$ moves from $m$ toward 1:
$M = 1 - (1 - m)e^{-1}$. On an "off" interval it decays: $m = Me^{-1}$. Substituting,
$M = 1 - e^{-1} + Me^{-2}$, so

$$M = \frac{1 - e^{-1}}{1 - e^{-2}} = \frac{1}{1 + e^{-1}} \approx 0.7311, \qquad m = \frac{e^{-1}}{1 + e^{-1}} \approx 0.2689.$$

The average of the cycle is $\tfrac12$, the average of the input, as you'd expect for a
linear system whose response to a constant input $c$ is eventually $c$. A slower circuit
(replace the equation by $y' + ky = kf(t)$ with small $k$, which keeps the average at
$\tfrac12$) smooths the square wave into a small ripple around the average; a fast one (large
$k$) follows the square wave closely.

### Example 5: the ripple for a general time constant

For $y' + ky = b f(t)$ with the square wave of half-period $p$ (on for $p$, off for $p$), the
same two-step argument with $r = e^{-kp}$ gives

$$M = \frac{b}{k}\cdot\frac{1}{1 + r}, \qquad m = \frac{b}{k}\cdot\frac{r}{1 + r}.$$

With $k = 2$, $b = 6$, $p = 0.5$: $r = e^{-1}$, $M = 3/(1 + e^{-1}) \approx 2.1932$ and
$m \approx 0.8068$. The ripple is $M - m = \dfrac{b}{k}\cdot\dfrac{1 - r}{1 + r} = \dfrac{b}{k}\tanh\dfrac{kp}{2}$. For a
fixed average level $\dfrac{b}{2k}$, it shrinks as $kp$ gets small (a slow circuit, or fast
switching), which is the idea behind a smoothing capacitor in a power supply.

## Laplace or Fourier?

Fourier series (Lesson 39) describe the same inputs as sums of sines and cosines, and they
give the periodic steady state as a sum over frequencies, which is the right picture when
you care about which frequencies get amplified. The Laplace route gives the *whole*
solution, start-up transient included, as a finite sum of shifted pieces at any given
time. The two answers agree once the transient has died out. Neither is "the" method;
engineers use both.

## Common mistakes

- **Integrating over the wrong interval.** The integral in the formula runs over exactly one
  period, $0$ to $T$, even when the function is zero for part of it.
- **Dividing by the wrong factor.** It's $1 - e^{-Ts}$ with $T$ the full period, not the
  length of the "on" part.
- **Forgetting the geometric-series factor**, which turns the answer into the transform of a
  single pulse.
- **Applying the formula to a function that isn't periodic from $t = 0$**, such as a wave
  that starts at $t = 2$: write it with a step function first.
- **Expecting the steady state at once.** The transient dies out only gradually, on the
  system's time scale (here like $e^{-t}$).

## Key points

- Periodic $f$ with period $T$: $\mathcal{L}\{f\} = \dfrac{1}{1 - e^{-Ts}}\displaystyle\int_0^T e^{-st}f(t)\,dt$.
- On/off square wave (on for $a$, off for $a$): $\dfrac{1}{s(1 + e^{-as})}$; $\pm1$ square wave:
  $\dfrac1s\tanh\dfrac{as}{2}$; sawtooth: $\dfrac{1}{s^2} - \dfrac{Te^{-Ts}}{s(1 - e^{-Ts})}$; half-wave
  rectified $\sin t$: $\dfrac{1}{(s^2 + 1)(1 - e^{-\pi s})}$.
- To invert, expand $1/(1 \pm e^{-cs})$ as a geometric series and shift term by term.
- A stable linear system driven periodically settles into a periodic steady state; match the
  values at the switching times to find it.
