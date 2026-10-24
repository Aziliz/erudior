---
id: calc-m4-h-error-convergence
module: calc-m4
title: How accurate? Error bounds and the speed of Newton's method
minutes: 45
honors: true
topics: [Approximation error, Convergence of Newton's method]
drills: [calc-m4-r2-tangent-error, calc-m4-r2-secant]
refs: [calc-ref-derivatives]
---
## From "about right" to "guaranteed"

Lesson 15 estimated $\sqrt{4.1} \approx 2.025$ and then looked up the true value to see that the error was about 0.00015. In real work you can't look up the answer; that is why you were approximating in the first place. This lesson answers two questions an engineer or a calculator designer has to answer *without* knowing the true value:

1. How far off can a linear approximation be? We'll get a guaranteed bound.
2. Why does Newton's method double the number of correct digits at each step, and when does it stop doing that?

The answer to both comes from the same fact: the gap between a smooth curve and its tangent line grows like the *square* of the distance from the point of tangency.

## The error of a linear approximation

Let $L(x) = f(a) + f'(a)(x - a)$ and call the error $E(x) = f(x) - L(x)$. Three facts about $E$ are immediate:

- $E(a) = f(a) - f(a) = 0$: the tangent line touches the curve at $a$.
- $E'(x) = f'(x) - f'(a)$, so $E'(a) = 0$: the error starts out flat.
- $E''(x) = f''(x)$, because $L$ is linear and its second derivative is 0.

So the error is a function that starts at 0 with slope 0, and whose bending is controlled entirely by $f''$. If $f''$ is small, $E$ can't get big quickly.

*Error bound for linear approximation.* If $|f''(t)| \le M$ for every $t$ between $a$ and $x$, then
$$|f(x) - L(x)| \le \frac{M}{2}(x - a)^2.$$

*Why (for $x > a$).* We use one consequence of the Mean Value Theorem (Lesson 17, by the same argument that shows $f' > 0$ makes $f$ increasing): a function whose derivative is never negative on an interval never decreases there.

- Let $p(t) = M(t - a) - E'(t)$. Then $p(a) = 0$ and $p'(t) = M - f''(t) \ge 0$, so $p(t) \ge 0$ for $t \ge a$. That says $E'(t) \le M(t - a)$.
- Let $q(t) = \frac M2(t - a)^2 - E(t)$. Then $q(a) = 0$ and $q'(t) = M(t - a) - E'(t) \ge 0$, so $q(x) \ge 0$. That says $E(x) \le \frac M2(x - a)^2$.

Repeating the argument with $-M$ in place of $M$ and every inequality reversed (now using $f''(t) \ge -M$) gives $E(x) \ge -\frac M2(x - a)^2$. The case $x < a$ works the same way. This is the first case of the Lagrange error bound for Taylor polynomials, which Lesson 44 develops in general.

The square is the important part. Halve the distance from $a$ and the error drops to about a quarter; move ten times closer and it drops a hundredfold.

### Example 1 (a guaranteed bound for $\sqrt{4.1}$)

Bound the error in $\sqrt{4.1} \approx 2.025$ from the linearization of $f(x) = \sqrt x$ at $a = 4$.

- $f''(x) = -\dfrac{1}{4x^{3/2}}$. On $[4, 4.1]$, $|f''|$ is largest at the left end (the denominator is smallest there): $M = \dfrac{1}{4\cdot 4^{3/2}} = \dfrac{1}{32}$.
- Bound: $\dfrac{M}{2}(0.1)^2 = \dfrac{1}{64}(0.01) = 0.00015625$.

So, *without knowing* $\sqrt{4.1}$, we can say $2.025 - 0.00016 \le \sqrt{4.1} \le 2.025$. (The upper end is $2.025$ itself, because $f'' < 0$ means the tangent line overestimates.) The actual error is $0.000154$, so this bound is very tight. The table shows the square law at work.

| $x$ | $x - 4$ | actual error $L(x) - \sqrt x$ | bound $\frac{1}{64}(x - 4)^2$ |
|---|---|---|---|
| 4.4 | 0.4 | 0.00238 | 0.0025 |
| 4.2 | 0.2 | 0.00061 | 0.000625 |
| 4.1 | 0.1 | 0.000154 | 0.000156 |
| 4.05 | 0.05 | 0.0000388 | 0.0000391 |

Each halving of $x - 4$ cuts the error by a factor of about 4.

### Example 2 (choosing $M$ well)

Bound the error of the small-angle approximation $\sin x \approx x$ for $0 \le x \le 0.1$ (radians).

Here $a = 0$, $L(x) = x$ and $f''(x) = -\sin x$.

- *Lazy choice:* $|\sin t| \le 1$ always, so $M = 1$ and the bound is $\frac12(0.1)^2 = 0.005$.
- *Careful choice:* on $[0, 0.1]$, $|\sin t| \le \sin 0.1 \approx 0.0998$, so the bound is $\frac{0.0998}{2}(0.01) \approx 0.0005$.

The actual error at $x = 0.1$ is $0.1 - \sin 0.1 \approx 0.000167$. Both bounds are *true*; the careful one is ten times more useful. A bound is a guarantee, not a prediction, and it is only as good as the $M$ you feed it. Use the largest value of $|f''|$ on the interval you actually care about, not on the whole real line.

## Why Newton's method doubles the digits

Let $r$ be a root of $f$ and write $e_n = x_n - r$ for the error at step $n$. Expanding $f(r)$ around the current guess $x_n$ with the exact (Lagrange) form of the error, the equality behind the bound that Lesson 44 states (the error of the tangent line equals $\frac12 f''(\xi)(r - x_n)^2$ for some $\xi$ between $x_n$ and $r$):
$$0 = f(r) = f(x_n) + f'(x_n)(r - x_n) + \tfrac12 f''(\xi)(r - x_n)^2.$$
Divide by $f'(x_n)$ and rearrange, using $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$:
$$x_{n+1} - r = \frac{f''(\xi)}{2f'(x_n)}(x_n - r)^2, \qquad\text{so}\qquad e_{n+1} \approx C\,e_n^2,\quad C = \frac{f''(r)}{2f'(r)}.$$

The new error is roughly a constant times the *square* of the old one. This is **quadratic convergence**. If $e_n$ is about $10^{-4}$ and $C$ is about 1, then $e_{n+1}$ is about $10^{-8}$: the number of correct digits roughly doubles. It needs $f'(r) \ne 0$ and a starting point close enough to $r$; how close depends on the function.

### Example 3 (watching the errors square)

Lesson 15 applied Newton's method to $f(x) = x^3 - 2x - 5$ from $x_0 = 2$. The root is $r = 2.0945514815\ldots$ Here $C = \dfrac{6r}{2(3r^2 - 2)} \approx 0.563$.

| $n$ | $x_n$ | error $e_n$ | $e_n / e_{n-1}^2$ |
|---|---|---|---|
| 0 | 2 | $-9.5\times10^{-2}$ | |
| 1 | 2.1 | $5.4\times10^{-3}$ | 0.609 |
| 2 | 2.0945681 | $1.7\times10^{-5}$ | 0.561 |
| 3 | 2.0945514817 | $1.6\times10^{-10}$ | 0.563 |

The exponents go $-2, -3, -5, -10$: they roughly double from step 2 on, and the ratio in the last column settles on $C$, just as the formula predicts. A fourth step would be correct to about 20 decimal places.

## When convergence slows down: multiple roots

The formula divides by $f'(r)$. If the root is a **multiple root** (the graph touches the axis there and $f'(r) = 0$ too), quadratic convergence is lost. For $f(x) = (x - r)^m$ exactly, Newton's step is
$$x_{n+1} = x_n - \frac{(x_n - r)^m}{m(x_n - r)^{m-1}} = x_n - \frac{x_n - r}{m}, \quad\text{so}\quad e_{n+1} = \frac{m - 1}{m}\,e_n.$$
The error shrinks by a fixed factor each step. That is **linear convergence**: you gain a fixed number of digits per step (for a double root, $m = 2$, the error only halves, which is about 0.3 digits per step).

### Example 4 (a double root)

$f(x) = x^3 - 3x + 2 = (x - 1)^2(x + 2)$ has a double root at $x = 1$. Newton's method from $x_0 = 2$:

| $n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| $e_n = x_n - 1$ | 1 | 0.556 | 0.298 | 0.155 | 0.080 | 0.040 | 0.020 |

Each error is about half the one before. Six steps give only two correct decimals, where a simple root would have given dozens.

If you know the multiplicity $m$, the fix is $x_{n+1} = x_n - m\dfrac{f(x_n)}{f'(x_n)}$. With $m = 2$ here the errors are $1, 0.11, 0.0019, 6.3\times10^{-7}$: quadratic again.

## When Newton's method fails outright

Quadratic convergence is a promise about what happens *near* a root. Far away, anything can happen.

```plot
{"x": [-2.5, 2], "y": [-3, 5], "functions": [{"f": "x^3 - 2x + 2", "label": "f"}, {"f": "2 - 2x", "dashed": true, "from": -0.3, "to": 1.3}, {"f": "x", "dashed": true, "from": 0, "to": 1.6}], "points": [{"at": [0, 2]}, {"at": [1, 1]}, {"at": [0, 0]}, {"at": [1, 0]}, {"at": [-1.769, 0]}], "labels": [{"at": [-0.5, 0.4], "text": "x₀ = x₂"}, {"at": [1.2, 0.4], "text": "x₁"}, {"at": [-2.15, 0.4], "text": "root"}], "caption": "f(x) = x³ − 2x + 2: the tangent at 0 leads to 1, and the tangent at 1 leads back to 0, forever"}
```

- *A cycle.* For $f(x) = x^3 - 2x + 2$ from $x_0 = 0$: $x_1 = 0 - \frac{2}{-2} = 1$ and $x_2 = 1 - \frac{1}{1} = 0$. The guesses bounce between 0 and 1 and never approach the real root near $-1.769$.
- *Running away.* For $f(x) = x^{1/3}$ (root at 0), $\frac{f}{f'} = \frac{x^{1/3}}{\frac13x^{-2/3}} = 3x$, so $x_{n+1} = x_n - 3x_n = -2x_n$. Every step doubles the distance from the root. The vertical tangent at the root is to blame: $f'$ blows up there.
- *A flat spot.* If $f'(x_n) = 0$ the step is undefined, and if $f'(x_n)$ is merely small the step throws you far away.

The practical defense: graph first, start near the root you want (the IVT can bracket it), and check that successive guesses settle down.

## The secant method: Newton without derivatives

Sometimes $f'$ is unavailable, for example when $f$ is computed by a long program or measured. The **secant method** replaces the tangent line by the secant line through the last two guesses:
$$x_{n+1} = x_n - f(x_n)\,\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}.$$
It needs two starting values and no derivatives. Near a simple root its error behaves like $e_{n+1} \approx K e_n^{1.618}$, where $1.618\ldots$ is the golden ratio: slower than Newton per step, but each step needs only one new function value, so in practice it is often just as fast.

### Example 5

Apply the secant method to $f(x) = x^3 - 2x - 5$ with $x_0 = 2$, $x_1 = 3$.

- $f(2) = -1$, $f(3) = 16$. $x_2 = 3 - 16\cdot\dfrac{3 - 2}{16 - (-1)} = 3 - \dfrac{16}{17} \approx 2.0588$.
- Continuing gives $2.0813$, $2.09482$, $2.0945494$, $2.0945514812$: the errors are about $10^{-2}, 3\times10^{-4}, 2\times10^{-6}, 3\times10^{-10}$, so the exponent grows by a factor of about 1.6 each step.

## Common mistakes

- *Taking $M$ at the wrong place.* $M$ must bound $|f''|$ on the whole interval between $a$ and $x$. Using $|f''(a)|$ alone can give a bound that is too small, which is a false guarantee.
- *Forgetting the square.* The error bound has $(x - a)^2$, not $|x - a|$.
- *Assuming Newton's method always converges quadratically.* It needs $f'(r) \ne 0$ and a good start. At a double root it is only linear.
- *Stopping when $f(x_n)$ is small.* At a multiple root, $f$ can be tiny while $x_n$ is still far from $r$; check that the $x_n$ have stopped changing.
- *Thinking a bigger bound is wrong.* A loose bound is still true. It is just less useful.

## Key points

- If $|f''| \le M$ between $a$ and $x$, then $|f(x) - L(x)| \le \frac M2(x - a)^2$: the tangent-line error grows like the square of the distance.
- Newton's method near a simple root: $e_{n+1} \approx \dfrac{f''(r)}{2f'(r)}e_n^2$, so correct digits roughly double each step.
- At a root of multiplicity $m$, Newton's method is only linear ($e_{n+1} \approx \frac{m-1}{m}e_n$); the step $x - m\frac{f}{f'}$ restores quadratic speed.
- Newton's method can cycle or diverge from a bad start; graph first and watch the iterates.
- The secant method uses two previous points instead of $f'$ and converges with order about 1.618.
