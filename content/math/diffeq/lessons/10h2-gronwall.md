---
id: de-m2-h-gronwall
module: de-m2
title: Grönwall's inequality and continuous dependence
minutes: 45
topics: [Continuous dependence]
drills: [de-m2-r2-gronwall-bound, de-m2-r2-gronwall-precision]
refs: [de-ref-methods]
honors: true
---
## How much does a small error in the start matter?

Uniqueness (Lesson 7) says that two solutions starting at the *same* point are the same
solution. Real starting values are never exact, though: a measured temperature, a population
estimate, a voltage read off a meter all carry some error. A model is only useful if a small
error at the start causes a small error later, at least for a while. This property is called
**continuous dependence** on initial conditions, and together with existence and uniqueness
it is what makes an IVP "well posed" (a word due to Jacques Hadamard, early 1900s).

This lesson proves continuous dependence with one short, powerful tool, Grönwall's
inequality, and in the process gives a clean proof of uniqueness. It builds on the Lipschitz
condition from the previous honors lesson.

## The Lipschitz condition, more closely

A function $f(t, y)$ satisfies a **Lipschitz condition** in $y$ on a region if there is a
constant $L$ with

$$|f(t, y) - f(t, z)| \le L\,|y - z|$$

for every pair of points $(t, y)$ and $(t, z)$ in the region. The smallest such $L$ is the
best Lipschitz constant. (The previous lesson called it $K$.)

- **From a derivative bound.** If $|f_y| \le L$ on a rectangle, the Mean Value Theorem gives
  $f(t, y) - f(t, z) = f_y(t, \xi)(y - z)$ for some $\xi$ between them, so $f$ is Lipschitz
  with constant $L$. For $f = \sin y$, $|f_y| = |\cos y| \le 1$ everywhere, so $L = 1$ on the
  whole plane. For $f = y^2$ on $|y| \le 3$, $|f_y| = |2y| \le 6$, so $L = 6$.
- **Weaker than a continuous derivative.** $f = |y|$ has no derivative at $y = 0$, yet
  $\big||y| - |z|\big| \le |y - z|$, so it is Lipschitz with $L = 1$. The uniqueness theorem
  really only needs the Lipschitz condition.
- **Where it fails.** For $f = \sqrt{y}$ and $z = 0$, the ratio $\dfrac{|\sqrt{y} - 0|}{|y - 0|} = \dfrac{1}{\sqrt{y}}$
  grows without bound as $y \to 0^+$. No $L$ works near $y = 0$, which is exactly where
  uniqueness failed in Lesson 7. The same happens for $y^{1/3}$ and $y^{2/3}$.

## Grönwall's inequality

**Grönwall's inequality**. Let $u(t) \ge 0$ be continuous on $[t_0, T]$, and let $C \ge 0$
and $L \ge 0$ be constants. If

$$u(t) \le C + L\int_{t_0}^{t} u(s)\,ds \quad \text{for } t_0 \le t \le T,$$

then

$$u(t) \le C\,e^{L(t - t_0)} \quad \text{for } t_0 \le t \le T.$$

In words: a quantity that can grow at most in proportion to its own accumulated size can grow
at most exponentially. The Swedish-American mathematician Thomas Hakon Grönwall proved a
version of it in 1919, and Richard Bellman proved this integral form in 1943, so it is also
called the Grönwall–Bellman inequality.

**Proof.** Call the right side $U(t) = C + L\int_{t_0}^{t} u(s)\,ds$. Then $u \le U$, and
$U' = L\,u \le L\,U$. Multiply $U' - LU \le 0$ by the integrating factor $e^{-L(t - t_0)}$
(Lesson 8's trick, with an inequality):

$$\frac{d}{dt}\Big(e^{-L(t - t_0)}\,U(t)\Big) = e^{-L(t - t_0)}\big(U' - LU\big) \le 0.$$

So $e^{-L(t - t_0)}U(t)$ never increases, and it starts at $U(t_0) = C$. Hence
$U(t) \le Ce^{L(t - t_0)}$, and $u \le U$ finishes the proof. ∎

## Continuous dependence and uniqueness

Let $y$ and $z$ solve the same equation $y' = f(t, y)$ with $y(t_0) = y_0$ and
$z(t_0) = z_0$, and suppose $f$ is Lipschitz with constant $L$ in a region containing both
curves. Write each in integral form and subtract:

$$y(t) - z(t) = y_0 - z_0 + \int_{t_0}^{t}\big(f(s, y(s)) - f(s, z(s))\big)\,ds.$$

Take absolute values and use the Lipschitz condition. With $u = |y - z|$,

$$u(t) \le |y_0 - z_0| + L\int_{t_0}^{t} u(s)\,ds,$$

and Grönwall's inequality gives the **continuous dependence estimate**

$$|y(t) - z(t)| \le |y_0 - z_0|\,e^{L|t - t_0|}.$$

(The same argument run backward in time gives the absolute value in the exponent.)

Two consequences:

1. **Uniqueness.** If $y_0 = z_0$, the right side is $0$, so $y = z$. That's the uniqueness
   half of the existence and uniqueness theorem, in two lines.
2. **Stability over finite times.** On any fixed interval, making the starting error small
   makes the error everywhere on the interval small, in proportion.

### Example 1

Two solutions of $y' = \sin y$ start at $y(0) = 1$ and $z(0) = 1.01$. Bound $|y(3) - z(3)|$,
and compare with the truth.

- $f = \sin y$ has $L = 1$, so $|y(3) - z(3)| \le 0.01\,e^{3} \approx 0.201$.
- This equation is separable, with solution $y = 2\arctan\!\big(\tan(y_0/2)\,e^{t}\big)$.
  That gives $y(3) \approx 2.95983$ and $z(3) \approx 2.96195$, a difference of only about $0.0021$.

The bound is true but about 100 times too large. Both solutions are heading for the stable
equilibrium $\pi$, where nearby solutions squeeze together. Grönwall's estimate assumes the
worst case at every instant, so it can't see that squeezing.

### Example 2

When is the bound exactly right? Take $y' = ky$ with $k > 0$. Solutions are
$y = y_0e^{kt}$ and $z = z_0e^{kt}$, so $|y - z| = |y_0 - z_0|\,e^{kt}$ exactly, with $L = k$.
The exponential factor in the estimate can't be improved in general: some equations really
do separate nearby solutions that fast.

## A sharper one-sided version

For a single equation there is a refinement that captures squeezing. If $f_y \le \lambda$
on the region (a bound from above only; $\lambda$ may be negative), then for $t \ge t_0$

$$|y(t) - z(t)| \le |y_0 - z_0|\,e^{\lambda(t - t_0)}.$$

Reason: with $w = y - z$, the Mean Value Theorem gives $w' = f_y(t, \xi)\,w$, so
$(w^2)' = 2f_y\,w^2 \le 2\lambda w^2$, and the integrating-factor argument above gives
$w^2 \le w_0^2e^{2\lambda(t - t_0)}$. A condition like this is called a
**one-sided Lipschitz condition**. For $y' = -y$, $\lambda = -1$: solutions get *closer*,
like $e^{-t}$, which the two-sided estimate (growth like $e^{t}$) badly misses.

### Example 3

A process follows $y' = 0.4\sin y$. To predict $y(5)$ within $0.1$, how accurately must
$y(0)$ be known, using the continuous dependence estimate?

- $L = 0.4$, so an initial error $\delta$ grows to at most $\delta e^{0.4 \cdot 5} = \delta e^{2}$.
- Require $\delta e^{2} \le 0.1$: $\delta \le 0.1e^{-2} \approx 0.0135$.

Knowing the start to within about $0.013$ is enough. This is a guarantee; the actual
requirement may be looser, as Example 1 showed.

```plot
{"x": [0, 3], "y": [0, 0.21], "xLabel": "t", "yLabel": "gap", "functions": [{"f": "0.01exp(x)", "dashed": true}, {"f": "2atan(tan(0.505)exp(x)) - 2atan(tan(0.5)exp(x))"}], "labels": [{"at": [1.3, 0.09], "text": "Grönwall bound 0.01eᵗ"}, {"at": [2.2, 0.025], "text": "actual gap"}], "caption": "For y′ = sin y with starts 1 and 1.01: the Grönwall bound 0.01eᵗ (dashed) and the actual gap between the two solutions (solid), which grows briefly and then shrinks as both approach π."}
```

## Errors in the equation itself

Models are never exact either: a coefficient is measured, a term is dropped. Suppose $y$
solves $y' = f(t, y)$ and $z$ solves a slightly different equation $z' = g(t, z)$, with
$|f - g| \le \varepsilon$ along $z$ and $f$ Lipschitz with constant $L$. The same subtraction
gives $u \le |y_0 - z_0| + \varepsilon(t - t_0) + L\int u$, and the integrating-factor argument
(now with the extra $\varepsilon$) gives

$$|y(t) - z(t)| \le |y_0 - z_0|\,e^{L(t - t_0)} + \frac{\varepsilon}{L}\left(e^{L(t - t_0)} - 1\right).$$

Small changes to the equation also cause small changes in the solution, over a fixed time.
The same estimate is the starting point for proving that numerical methods like Euler's
converge.

### Example 4

The equation $y' = \sin y$, $y(0) = 0.2$ is replaced by the simpler $z' = z - \dfrac{z^3}{6}$,
$z(0) = 0.2$ (two terms of the sine series). Bound the difference on $0 \le t \le 1$.

- For $0 \le z \le 0.6$, the alternating series gives $0 \le \sin z - \left(z - \dfrac{z^3}{6}\right) \le \dfrac{z^5}{120} \le \dfrac{0.6^5}{120} \approx 0.00065$, so $\varepsilon = 0.00065$.
- Both solutions increase but stay below about $0.54$ on $[0, 1]$, inside that range.
- $L = 1$ and the starts agree, so $|y(t) - z(t)| \le 0.00065\,(e^{1} - 1) \approx 0.0011$.

A numerical solution gives an actual difference at $t = 1$ of about $0.00009$. The simpler
model is safe to use on this interval, and the estimate says so without solving either
equation exactly.

## Sensitive dependence: a word on chaos

The factor $e^{L(t - t_0)}$ is finite for every fixed time, but it can be enormous for long
times. In some systems the exponential separation is real, not just a pessimistic bound:
nearby states stay close for a while and then become unrelated. This
**sensitive dependence on initial conditions** is the hallmark of chaos, made famous by Edward Lorenz's 1963 study of
a simplified three-variable convection model. A single first-order autonomous equation can't
be chaotic (its solutions are monotone, as Module 4 shows), but autonomous systems of three or
more equations can (and so can two equations with a periodic forcing term, such as a driven
pendulum). Continuous dependence still holds for them on every finite interval; it just
stops being useful for long-range prediction.

## Common mistakes

- **Using a Lipschitz constant from the wrong region.** $L$ must work wherever both solutions
  actually go; $y^2$ is Lipschitz on $|y| \le 3$, but not on the whole line.
- **Treating the bound as the actual error.** Grönwall gives a ceiling, often far above the truth.
- **Dropping the absolute values.** The two-sided estimate uses $|f_y| \le L$. A bound from
  above alone ($f_y \le \lambda$) gives only the one-sided version.
- **Forgetting the exponential.** The error doesn't stay the size of the starting error; it
  can grow by $e^{L(t - t_0)}$.
- **Calling $\sqrt{y}$ Lipschitz near 0** because it is continuous there. Continuity isn't enough.

## Key points

- Lipschitz: $|f(t, y) - f(t, z)| \le L|y - z|$; a bound $|f_y| \le L$ on a rectangle gives it.
- Grönwall: $u \le C + L\int_{t_0}^t u$ implies $u \le Ce^{L(t - t_0)}$.
- Continuous dependence: $|y(t) - z(t)| \le |y_0 - z_0|\,e^{L|t - t_0|}$; with $y_0 = z_0$ this proves uniqueness.
- One-sided: if $f_y \le \lambda$, the gap is at most $|y_0 - z_0|e^{\lambda(t - t_0)}$ for $t \ge t_0$.
- An $\varepsilon$ error in the equation adds at most $\frac{\varepsilon}{L}(e^{L(t - t_0)} - 1)$.
