---
id: de-m7-h-s-rules
module: de-m7
title: 'Calculus in s: multiplying and dividing by t'
minutes: 45
topics: [Transform rules in s]
drills: [de-m7-r2-t-times, de-m7-r2-sinc-integral]
refs: [de-ref-laplace]
honors: true
---
## Rules that run the other way

The core lessons built the transform table from two kinds of rules. Some act in $t$ and
show up as simple changes in $s$: a derivative $y'$ becomes $sY - y(0)$, and a delay becomes a
factor $e^{-cs}$. Others act in $s$ and show up in $t$: a shift $F(s - a)$ means a factor
$e^{at}$. This lesson completes the picture with the calculus of $F$ itself.
Differentiating $F$ with respect to $s$ multiplies $f$ by $-t$; integrating $F$ divides $f$
by $t$; dividing $F$ by $s$ integrates $f$. With these three rules you can transform powers
like $\sqrt t$, evaluate integrals that have no elementary antiderivative, and even solve
some equations whose coefficients depend on $t$.

A little history puts these rules in context. Integrals of the form $\int e^{-st}f(t)\,dt$
go back to Euler and Laplace in the eighteenth century. The idea of treating $d/dt$ as a
symbol you can do algebra with came later, from the English engineer Oliver Heaviside, who
used it for telegraph and circuit problems in the 1880s and 1890s with little concern for
proof. In the early twentieth century, mathematicians including T. J. Bromwich and the
engineer John Carson showed that his rules could be justified through the Laplace integral,
and the method became standard.

## Differentiating the transform: multiplication by $t$

Differentiate $F(s) = \int_0^\infty e^{-st}f(t)\,dt$ with respect to $s$. The only thing that
depends on $s$ is $e^{-st}$, and $\dfrac{\partial}{\partial s}e^{-st} = -te^{-st}$, so

$$F'(s) = \int_0^\infty e^{-st}\big(-tf(t)\big)\,dt, \qquad\text{that is,}\qquad \mathcal{L}\{tf(t)\} = -F'(s).$$

Moving the derivative inside the integral is allowed for every $s$ where the transform
converges absolutely (for $|f(t)| \le Me^{ct}$, every $s > c$): the extra factor $t$ is
swamped by the leftover exponential decay. Repeating, $\mathcal{L}\{t^nf(t)\} = (-1)^nF^{(n)}(s)$.

The rule explains entries you've been taking on trust. Starting from $\mathcal{L}\{1\} = 1/s$ and
differentiating $n$ times gives $\mathcal{L}\{t^n\} = n!/s^{n+1}$ again. Starting from
$\mathcal{L}\{\sin bt\} = b/(s^2 + b^2)$ gives the reference-sheet entry
$\mathcal{L}\{t\sin bt\} = \dfrac{2bs}{(s^2 + b^2)^2}$, which is exactly what appears in resonance problems.

### Example 1: a damped resonance term

Find $\mathcal{L}\{te^{-2t}\cos 3t\}$.

- Without the $t$: $F(s) = \mathcal{L}\{e^{-2t}\cos 3t\} = \dfrac{s + 2}{(s + 2)^2 + 9}$.
- Write $w = s + 2$, so $F = \dfrac{w}{w^2 + 9}$ and $\dfrac{dF}{ds} = \dfrac{dF}{dw} = \dfrac{(w^2 + 9) - w\cdot 2w}{(w^2 + 9)^2} = \dfrac{9 - w^2}{(w^2 + 9)^2}$.
- Multiply by $-1$:

$$\mathcal{L}\{te^{-2t}\cos 3t\} = \frac{(s + 2)^2 - 9}{\big((s + 2)^2 + 9\big)^2}.$$

(Equivalently, take the table entry for $t\cos 3t$ and shift $s \to s + 2$.)

### Example 2: inverting a logarithm

Find $f$ with $F(s) = \ln\dfrac{s + 3}{s + 1}$.

A logarithm isn't in the table, but its derivative is a rational function:
$F'(s) = \dfrac{1}{s + 3} - \dfrac{1}{s + 1}$. Since $\mathcal{L}\{tf\} = -F'$,

$$tf(t) = \mathcal{L}^{-1}\left\{\frac{1}{s + 1} - \frac{1}{s + 3}\right\} = e^{-t} - e^{-3t}, \qquad f(t) = \frac{e^{-t} - e^{-3t}}{t}.$$

This trick, differentiate $F$, invert, divide by $t$, works for logarithms and inverse
tangents of rational functions. For instance $F(s) = \arctan(1/s)$ has
$F'(s) = -\dfrac{1}{s^2 + 1}$, so $tf = \sin t$ and $f = \dfrac{\sin t}{t}$.

## Integrating the transform: division by $t$

Run the last rule backward. If $g(t) = f(t)/t$, then $f = tg$, so $F = -G'$. Integrating from
$s$ to $\infty$ and using $G(\infty) = 0$:

$$\mathcal{L}\left\{\frac{f(t)}{t}\right\} = \int_s^\infty F(\sigma)\,d\sigma,$$

valid when $f(t)/t$ has a finite limit as $t \to 0^+$ (otherwise $f/t$ may not have a
transform at all; $1/t$, for example, has a nonintegrable spike at 0). Note the limits: the
integral runs from $s$ up to infinity, because transforms vanish at infinity.

### Example 3: integrals you can't do by antiderivatives

The function $\dfrac{\sin t}{t}$ has no elementary antiderivative, yet its transform is easy:

$$\mathcal{L}\left\{\frac{\sin t}{t}\right\} = \int_s^\infty \frac{d\sigma}{\sigma^2 + 1} = \frac{\pi}{2} - \arctan s = \arctan\frac1s,$$

matching Example 2. Now read the definition at a particular $s$:
$\displaystyle\int_0^\infty e^{-st}\frac{\sin t}{t}\,dt = \arctan\frac1s$. At $s = 1$,
$\displaystyle\int_0^\infty e^{-t}\frac{\sin t}{t}\,dt = \frac{\pi}{4}$. Letting $s \to 0^+$ suggests the famous
**Dirichlet integral**

$$\int_0^\infty \frac{\sin t}{t}\,dt = \frac{\pi}{2}.$$

That last step is true, but taking the limit inside the integral needs an extra argument
here, because $\int_0^\infty |\sin t|/t\,dt$ diverges; the integral converges only because
positive and negative lobes cancel. So treat the Laplace calculation as a strong hint that a
careful proof confirms.

No such care is needed for absolutely convergent integrals. With Example 2,

$$\int_0^\infty \frac{e^{-t} - e^{-3t}}{t}\,dt = \lim_{s\to0^+}\ln\frac{s + 3}{s + 1} = \ln 3 \approx 1.0986.$$

## Dividing the transform by $s$: integration in $t$

The third rule is the convolution theorem in disguise: $\int_0^t f(\tau)\,d\tau = (f * 1)(t)$, and
$\mathcal{L}\{1\} = 1/s$, so

$$\mathcal{L}\left\{\int_0^t f(\tau)\,d\tau\right\} = \frac{F(s)}{s}.$$

In reverse, a factor $1/s$ in a transform means "integrate from 0 to $t$". That often beats
partial fractions. For example,
$\mathcal{L}^{-1}\left\{\dfrac{1}{s(s^2 + 4)}\right\} = \displaystyle\int_0^t \tfrac12\sin 2\tau\,d\tau = \frac{1 - \cos 2t}{4}$,
the same $h(t)$ that Lesson 31 found with partial fractions.

## Powers that aren't whole numbers

What is $\mathcal{L}\{\sqrt t\}$? The substitution $u = st$ in $\int_0^\infty e^{-st}t^a\,dt$ gives, for any
real $a > -1$ and $s > 0$,

$$\mathcal{L}\{t^a\} = \frac{1}{s^{a+1}}\int_0^\infty e^{-u}u^a\,du = \frac{\Gamma(a + 1)}{s^{a+1}},$$

where $\Gamma(x) = \int_0^\infty e^{-u}u^{x - 1}\,du$ is the **Gamma function**, introduced by Euler
around 1730 to extend the factorial. Integrating by parts gives $\Gamma(x + 1) = x\,\Gamma(x)$ and
$\Gamma(1) = 1$, so $\Gamma(n + 1) = n!$ and the familiar entry $n!/s^{n+1}$ is a special case.
The other value worth knowing is $\Gamma(\tfrac12) = \sqrt\pi$, which comes from the bell-curve
integral $\int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi$.

### Example 4: square roots

- $\mathcal{L}\{t^{-1/2}\} = \dfrac{\Gamma(\frac12)}{s^{1/2}} = \sqrt{\dfrac{\pi}{s}}$. (The function blows up at 0 but is
  integrable there, which is why $a > -1$ is the condition.)
- $\mathcal{L}\{\sqrt t\} = \dfrac{\Gamma(\frac32)}{s^{3/2}} = \dfrac{\tfrac12\Gamma(\tfrac12)}{s^{3/2}} = \dfrac{\sqrt\pi}{2s^{3/2}}$.
- Check with the $t$-rule: $\sqrt t = t\cdot t^{-1/2}$, so its transform is
  $-\dfrac{d}{ds}\big(\sqrt\pi\,s^{-1/2}\big) = \dfrac{\sqrt\pi}{2}s^{-3/2}$. ✓

## An equation with variable coefficients

Up to now the Laplace method needed constant coefficients, because only then does each
term become a multiple of $Y$. The $t$-rule lets a coefficient $t$ through: it turns into a
derivative in $s$. The transformed equation is then a *differential* equation for $Y(s)$,
but often a first-order one that is easier than the original.

### Example 5: Bessel's equation of order zero

Solve $ty'' + y' + ty = 0$ with $y(0) = 1$, for a solution that stays bounded near $t = 0$.

- Transform each term. $\mathcal{L}\{ty''\} = -\dfrac{d}{ds}\big(s^2Y - s\,y(0) - y'(0)\big) = -s^2Y' - 2sY + 1$.
  $\mathcal{L}\{y'\} = sY - 1$. $\mathcal{L}\{ty\} = -Y'$.
- Add: $-s^2Y' - 2sY + 1 + sY - 1 - Y' = 0$, which simplifies to $(s^2 + 1)Y' = -sY$.
  The unknown $y'(0)$ dropped out.
- Separate: $\dfrac{Y'}{Y} = -\dfrac{s}{s^2 + 1}$, so $Y = \dfrac{C}{\sqrt{s^2 + 1}}$.
- Find $C$ with the initial value theorem: $y(0) = \lim_{s\to\infty}sY(s) = C$, so $C = 1$.

$$\mathcal{L}\{J_0(t)\} = \frac{1}{\sqrt{s^2 + 1}}.$$

The solution is the Bessel function $J_0$, which describes, among other things, the
vibration of a drumhead and heat flow in a cylinder. It isn't an elementary function, but
we found its transform in four lines. To check, expand for large $s$:
$\dfrac{1}{\sqrt{s^2 + 1}} = \dfrac1s - \dfrac{1}{2s^3} + \dfrac{3}{8s^5} - \cdots$, and inverting term by term
gives $1 - \dfrac{t^2}{4} + \dfrac{t^4}{64} - \cdots$, the start of the power series
$J_0(t) = \sum_{k\ge0}\dfrac{(-1)^k}{(k!)^2}\left(\dfrac t2\right)^{2k}$. (That series is what the method of
Frobenius produces for this equation; the honors lesson on that method in Module 9 derives it.)

Two cautions. First, $t = 0$ is a singular point of this equation, so it has only one
solution that is bounded there; the derivative rules assumed $y$, $y'$ and $y''$ behave
nicely at 0, and that silently picked out $J_0$. Second, term-by-term inversion of a series
in $1/s$ is legitimate here but not in general; it is a check, not a method.

## Common mistakes

- **Sign of the $t$-rule.** $\mathcal{L}\{tf\} = -F'(s)$, with a minus sign; for $t^2f$ the
  sign is $+$.
- **Wrong limits for division by $t$.** It's $\int_s^\infty F(\sigma)\,d\sigma$, not $\int_0^s$.
- **Ignoring the condition at $t = 0$.** $f(t)/t$ needs $f(0) = 0$ (or another reason for a finite
  limit); $\mathcal{L}\{\cos t/t\}$ does not exist.
- **Off-by-one with Gamma.** $\mathcal{L}\{t^a\} = \Gamma(a + 1)/s^{a+1}$, not $\Gamma(a)/s^a$.
- **Treating $\mathcal{L}\{ty\}$ as $tY$.** Multiplying by $t$ in the time domain is
  differentiation in $s$, never multiplication by $t$ or $s$.

## Key points

- $\mathcal{L}\{tf(t)\} = -F'(s)$ and $\mathcal{L}\{t^nf(t)\} = (-1)^nF^{(n)}(s)$.
- $\mathcal{L}\{f(t)/t\} = \int_s^\infty F(\sigma)\,d\sigma$ when $f(t)/t$ has a limit at $0^+$; setting $s$ to a
  value evaluates integrals like $\int_0^\infty e^{-t}\frac{\sin t}{t}dt = \frac\pi4$.
- $\mathcal{L}\{\int_0^t f\} = F(s)/s$: a factor $1/s$ means "integrate from 0 to $t$".
- $\mathcal{L}\{t^a\} = \Gamma(a + 1)/s^{a+1}$ for $a > -1$; $\Gamma(n + 1) = n!$, $\Gamma(\frac12) = \sqrt\pi$.
- A coefficient $t$ in an ODE becomes $-d/ds$, giving an ODE for $Y(s)$; Bessel's equation
  gives $\mathcal{L}\{J_0\} = 1/\sqrt{s^2 + 1}$.
