---
id: de-laplace-def
module: de-m7
title: The Laplace transform
minutes: 30
topics: [Laplace transform]
drills: [de-laplace-eval, de-laplace-poly]
refs: [de-ref-laplace]
---
## A new way to solve linear equations

Undetermined coefficients and variation of parameters solve an IVP in stages: find $y_c$,
find $Y$, then fit constants. The **Laplace transform** does it all at once by turning a
differential equation into an *algebra* problem. It shines exactly where the earlier
methods struggle: forcing that switches on and off, sudden impulses, piecewise inputs.
Engineers use it constantly in circuits and control systems. This module builds it in
five steps: definition and table, inverting, solving IVPs, step functions, and impulses
with convolution.

## The definition

For a function $f(t)$ defined for $t \ge 0$, its Laplace transform is

$$\mathcal{L}\{f(t)\} = F(s) = \int_0^\infty e^{-st}f(t)\,dt,$$

for those values of $s$ where the improper integral converges. The transform takes a
function of $t$ and produces a function of a new variable $s$. Lowercase letters
($f$, $y$) denote functions of $t$; capitals ($F$, $Y$) their transforms.

### Example 1: a constant

$$\mathcal{L}\{1\} = \int_0^\infty e^{-st}\,dt = \lim_{b\to\infty}\left[-\frac{e^{-st}}{s}\right]_0^b = \frac1s \quad (s > 0).$$

For $s \le 0$ the integral diverges, so the transform exists only for $s > 0$.

### Example 2: an exponential

$$\mathcal{L}\{e^{at}\} = \int_0^\infty e^{-(s - a)t}\,dt = \frac{1}{s - a} \quad (s > a).$$

### Example 3: sine and cosine

Using $e^{iat} = \cos at + i\sin at$ and Example 2 with $a$ replaced by $ia$:

$$\frac{1}{s - ia} = \frac{s + ia}{s^2 + a^2},$$

so matching real and imaginary parts,

$$\mathcal{L}\{\cos at\} = \frac{s}{s^2 + a^2}, \qquad \mathcal{L}\{\sin at\} = \frac{a}{s^2 + a^2} \quad (s > 0).$$

(Integrating by parts twice gives the same result without complex numbers.)

### Example 4: powers of $t$

Integration by parts gives $\mathcal{L}\{t\} = \dfrac{1}{s^2}$, and in general

$$\mathcal{L}\{t^n\} = \frac{n!}{s^{n+1}} \quad (s > 0).$$

## Linearity

The integral is linear, so the transform is too:

$$\mathcal{L}\{af(t) + bg(t)\} = aF(s) + bG(s).$$

### Example 5

$\mathcal{L}\{3 - 2t^2 + 5e^{-4t}\} = \dfrac3s - 2\cdot\dfrac{2}{s^3} + \dfrac{5}{s + 4} = \dfrac3s - \dfrac{4}{s^3} + \dfrac{5}{s + 4}$.

### Example 6

$\mathcal{L}\{\cos^2 t\}$: use $\cos^2t = \tfrac12 + \tfrac12\cos 2t$ to get
$\dfrac{1}{2s} + \dfrac{s}{2(s^2 + 4)}$. The transform of a product is not the product of
transforms, so identities like this are needed.

## The first shifting theorem

Multiplying by an exponential shifts the transform:

$$\mathcal{L}\{e^{at}f(t)\} = F(s - a).$$

Proof: $\displaystyle\int_0^\infty e^{-st}e^{at}f(t)\,dt = \int_0^\infty e^{-(s - a)t}f(t)\,dt = F(s - a)$.

### Example 7

- $\mathcal{L}\{e^{2t}\sin 3t\} = \dfrac{3}{(s - 2)^2 + 9}$.
- $\mathcal{L}\{t^3e^{-t}\} = \dfrac{6}{(s + 1)^4}$.

Damped oscillations $e^{\lambda t}\cos\mu t$ have transforms with a completed-square
denominator $(s - \lambda)^2 + \mu^2$. Recognizing that shape is key for inverting.

## When does the transform exist?

The transform exists (for large enough $s$) if $f$ is **piecewise continuous** (finitely
many jump discontinuities on each bounded interval) and of **exponential order**, meaning
$|f(t)| \le Me^{ct}$ for large $t$. Polynomials, exponentials, sines, cosines and step
functions all qualify. $e^{t^2}$ does not: it grows faster than every exponential. Also,
for any such $f$, $F(s) \to 0$ as $s \to \infty$, so a function like $F(s) = s$ is not the
transform of any ordinary function.

## The basic table

| $f(t)$ | $F(s)$ |
|---|---|
| $1$ | $\dfrac1s$ |
| $t^n$ | $\dfrac{n!}{s^{n+1}}$ |
| $e^{at}$ | $\dfrac{1}{s - a}$ |
| $\sin bt$ | $\dfrac{b}{s^2 + b^2}$ |
| $\cos bt$ | $\dfrac{s}{s^2 + b^2}$ |
| $e^{at}\sin bt$ | $\dfrac{b}{(s - a)^2 + b^2}$ |
| $e^{at}\cos bt$ | $\dfrac{s - a}{(s - a)^2 + b^2}$ |
| $t^ne^{at}$ | $\dfrac{n!}{(s - a)^{n+1}}$ |

The full table, including the entries from later lessons, is on the Laplace reference sheet.

### Example 8: a numerical value

$F(s) = \mathcal{L}\{e^{-t}\cos 2t\}$ at $s = 1$: $F(s) = \dfrac{s + 1}{(s + 1)^2 + 4}$, so
$F(1) = \dfrac{2}{4 + 4} = \dfrac14$. As a check, numerically integrating
$\int_0^\infty e^{-2t}\cos 2t\,dt$ gives 0.25.

## Transforming a piecewise function from the definition

The definition works directly on piecewise functions: split the integral where the formula
changes.

### Example 9

Let $f(t) = 2$ for $0 \le t < 3$ and $f(t) = 0$ for $t \ge 3$. Then

$$F(s) = \int_0^3 2e^{-st}\,dt = \left[-\frac{2e^{-st}}{s}\right]_0^3 = \frac{2(1 - e^{-3s})}{s}.$$

The factor $e^{-3s}$ records the switch-off time. Lesson 31 turns this observation into a
general rule (step functions and the second shifting theorem), so that you rarely need to
integrate by hand.

### Example 10: a power times an exponential

$\mathcal{L}\{te^{-5t}\}$: start from $\mathcal{L}\{t\} = \dfrac{1}{s^2}$ and shift $s \to s + 5$ to get
$\dfrac{1}{(s + 5)^2}$. Repeated linear factors like $(s + 5)^2$ in a denominator always signal
a factor $t$ in the original function, a fact you'll use constantly when inverting.

## Common mistakes

- **Product of transforms.** $\mathcal{L}\{fg\} \ne FG$; use identities or shifting.
- **Sine and cosine swapped.** $\sin bt \to \dfrac{b}{s^2 + b^2}$ has the constant on top;
  $\cos bt \to \dfrac{s}{s^2 + b^2}$ has $s$.
- **Shift direction.** $e^{at}f(t) \to F(s - a)$: multiplying by $e^{2t}$ replaces $s$ by $s - 2$.
- **Forgetting $n!$** in $\mathcal{L}\{t^n\}$.

## Key points

- $\mathcal{L}\{f\} = \int_0^\infty e^{-st}f(t)\,dt$; it's linear.
- Core table: $1/s$, $n!/s^{n+1}$, $1/(s - a)$, $b/(s^2 + b^2)$, $s/(s^2 + b^2)$.
- First shift: $\mathcal{L}\{e^{at}f\} = F(s - a)$.
- Transforms exist for piecewise continuous functions of exponential order.
