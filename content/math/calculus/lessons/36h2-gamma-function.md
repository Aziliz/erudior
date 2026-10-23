---
id: calc-m8-h-gamma
module: calc-m8
title: The gamma function
minutes: 45
honors: true
topics: [Gamma function]
drills: [calc-m8-r2-gamma-moment, calc-m8-r2-gamma-half]
refs: [calc-ref-integrals]
---
Lesson 35 showed that a region stretching out forever can have finite area, and Lesson 31 showed how integration by parts lowers a power of $x$. Put the two together on $\int_0^\infty x^ne^{-x}\,dx$ and something remarkable comes out: the answer is $n!$. This lesson turns that fact into the **gamma function**, an improper integral that extends the factorial from whole numbers to fractions such as $\frac12$, where it equals $\sqrt\pi$. The gamma function turns up throughout probability, physics and engineering, and it is a good workout for both techniques of this module.

## Factorials hiding in an improper integral

### Example 1

Evaluate $\displaystyle\int_0^\infty xe^{-x}\,dx$ and $\displaystyle\int_0^\infty x^2e^{-x}\,dx$.

For the first, parts with $u = x$, $dv = e^{-x}\,dx$ (so $v = -e^{-x}$):

$$\int_0^t xe^{-x}\,dx = \Big[-xe^{-x}\Big]_0^t + \int_0^t e^{-x}\,dx = -te^{-t} + 1 - e^{-t}.$$

As $t \to \infty$, $te^{-t} = \frac{t}{e^t} \to 0$ (L'Hôpital's rule, Lesson 16), and $e^{-t} \to 0$. So the integral converges to $\mathbf 1$.

For the second, parts with $u = x^2$: the boundary term $-t^2e^{-t}$ again tends to 0, and what is left is $2\int_0^\infty xe^{-x}\,dx = 2\cdot1 = \mathbf 2$.

The pattern continues: each round of parts brings down the current power as a factor and leaves the next lower power, so $\int_0^\infty x^ne^{-x}\,dx = n(n - 1)\cdots2\cdot1 = n!$. The exponential decays so fast that every boundary term vanishes.

## The definition

For $s > 0$, the gamma function is

$$\Gamma(s) = \int_0^\infty x^{s-1}e^{-x}\,dx.$$

The shift by one (the power is $s - 1$, not $s$) is a historical convention, explained below. With it, Example 1 says $\Gamma(2) = 1$ and $\Gamma(3) = 2$.

**Why it converges.** The integral is improper at both ends when $0 < s < 1$ (the integrand blows up at 0) and always improper at $\infty$. Split it at 1 and use the comparison test from Lesson 35 on each piece.

- On $(0, 1]$: $e^{-x} \le 1$, so $x^{s-1}e^{-x} \le x^{s-1} = \frac{1}{x^{1-s}}$. That is a p-integral on $(0, 1]$ with $p = 1 - s$, which converges when $p < 1$, that is, when $s > 0$.
- On $[1, \infty)$: $x^{s-1}e^{-x/2} \to 0$ as $x \to \infty$ (exponentials beat powers), so for large $x$ it is below 1 and $x^{s-1}e^{-x} = x^{s-1}e^{-x/2}\cdot e^{-x/2} \le e^{-x/2}$. And $\int_1^\infty e^{-x/2}\,dx$ converges.

So $\Gamma(s)$ is a finite number for every $s > 0$. For $s \le 0$ the piece near 0 diverges.

## The functional equation and factorials

Integrate by parts with $u = x^s$ and $dv = e^{-x}\,dx$, so $du = sx^{s-1}\,dx$ and $v = -e^{-x}$:

$$\Gamma(s + 1) = \int_0^\infty x^se^{-x}\,dx = \Big[-x^se^{-x}\Big]_0^\infty + s\int_0^\infty x^{s-1}e^{-x}\,dx.$$

For $s > 0$ the boundary term is 0 at both ends ($x^s \to 0$ as $x \to 0^+$, and $x^se^{-x} \to 0$ as $x \to \infty$), which leaves the **functional equation**

$$\Gamma(s + 1) = s\,\Gamma(s).$$

It is a reduction formula, like the ones in the previous honors lesson, but now $s$ need not be a whole number. Start from $\Gamma(1) = \int_0^\infty e^{-x}\,dx = 1$:

$$\Gamma(2) = 1\cdot\Gamma(1) = 1, \quad \Gamma(3) = 2\Gamma(2) = 2, \quad \Gamma(4) = 3\Gamma(3) = 6, \quad\dots,\quad \Gamma(n + 1) = n!.$$

This also explains the convention $0! = 1$: it is $\Gamma(1)$, the integral of $e^{-x}$ over $[0, \infty)$.

```plot
{"x": [0, 5.2], "y": [0, 10], "functions": [{"f": "gamma(x)", "from": 0.1, "to": 5.2, "label": "y = Γ(x)"}], "points": [{"at": [1, 1], "label": "(1, 1)"}, {"at": [2, 1], "label": "(2, 1)"}, {"at": [3, 2], "label": "(3, 2)"}, {"at": [4, 6], "label": "(4, 6)"}, {"at": [0.5, 1.7725], "label": "(1/2, √π)"}], "caption": "The gamma function for x > 0 passes through (n, (n − 1)!) and rises without bound as x → 0⁺; its minimum, about 0.8856, is near x ≈ 1.4616"}
```

## $\Gamma\left(\frac12\right) = \sqrt\pi$

The value at $s = \frac12$ is $\Gamma(\frac12) = \int_0^\infty x^{-1/2}e^{-x}\,dx$. Substitute $x = u^2$ (with $u \ge 0$), so $dx = 2u\,du$ and $x^{-1/2} = \frac1u$:

$$\Gamma\left(\tfrac12\right) = \int_0^\infty\frac1u\,e^{-u^2}\cdot2u\,du = 2\int_0^\infty e^{-u^2}\,du.$$

The last integral is half the **Gaussian integral** $\int_{-\infty}^\infty e^{-u^2}\,du = \sqrt\pi$. Lesson 35 showed that it converges and quoted its value; the proof needs double integrals in polar coordinates, so take it as given for now. Then

$$\Gamma\left(\tfrac12\right) = 2\cdot\frac{\sqrt\pi}{2} = \sqrt\pi \approx 1.7725.$$

With the functional equation, every half-integer follows: $\Gamma(\frac32) = \frac12\Gamma(\frac12) = \frac{\sqrt\pi}{2}$, $\Gamma(\frac52) = \frac32\cdot\frac{\sqrt\pi}{2} = \frac{3\sqrt\pi}{4}$, $\Gamma(\frac72) = \frac52\cdot\frac{3\sqrt\pi}{4} = \frac{15\sqrt\pi}{8}$. In factorial language, "$\left(\frac12\right)! = \Gamma(\frac32) = \frac{\sqrt\pi}{2}$."

## Using gamma to evaluate integrals

The working skill is to *substitute until the integral looks like the definition*. Two patterns cover most cases.

**A scaled exponential.** For $a > 0$, let $u = ax$:

$$\int_0^\infty x^ne^{-ax}\,dx = \int_0^\infty\left(\frac ua\right)^ne^{-u}\,\frac{du}{a} = \frac{\Gamma(n + 1)}{a^{n+1}} = \frac{n!}{a^{n+1}}.$$

**A square in the exponent.** For $\int_0^\infty x^me^{-x^2}\,dx$, let $u = x^2$, $x = u^{1/2}$, $dx = \frac12u^{-1/2}\,du$. The integral becomes $\frac12\int_0^\infty u^{(m-1)/2}e^{-u}\,du = \frac12\Gamma\left(\frac{m + 1}{2}\right)$.

### Example 2

Evaluate (a) $\displaystyle\int_0^\infty x^3e^{-2x}\,dx$ and (b) $\displaystyle\int_0^\infty\sqrt x\,e^{-x}\,dx$.

(a) With $n = 3$, $a = 2$: $\dfrac{3!}{2^4} = \dfrac{6}{16} = \mathbf{\dfrac38}$. Three rounds of parts would give the same answer with far more writing.

(b) $\sqrt x = x^{3/2 - 1}$, so this is $\Gamma(\frac32) = \mathbf{\dfrac{\sqrt\pi}{2}} \approx 0.8862$. No combination of the earlier techniques finds this value: $\sqrt x\,e^{-x}$ has no elementary antiderivative.

### Example 3

Evaluate $\displaystyle\int_0^\infty x^4e^{-x^2}\,dx$.

Use the second pattern with $m = 4$: $\frac12\Gamma\left(\frac52\right) = \frac12\cdot\frac{3\sqrt\pi}{4} = \mathbf{\dfrac{3\sqrt\pi}{8}} \approx 0.6647$.

Check the substitution step by step: $x^4 = u^2$ and $dx = \frac12u^{-1/2}\,du$, so the integrand becomes $\frac12u^{3/2}e^{-u}$, and $u^{3/2} = u^{5/2 - 1}$ matches $\Gamma(\frac52)$.

### Example 4 (a disguised gamma integral)

Evaluate $\displaystyle\int_0^1(-\ln x)^3\,dx$.

This is a Type 2 improper integral ($-\ln x \to \infty$ as $x \to 0^+$), and nothing in it looks like $e^{-x}$. Make the exponential appear with $x = e^{-u}$, so $-\ln x = u$ and $dx = -e^{-u}\,du$. The limits move too: $x = 1$ gives $u = 0$, and $x \to 0^+$ gives $u \to \infty$. Then

$$\int_0^1(-\ln x)^3\,dx = \int_\infty^0u^3\left(-e^{-u}\right)du = \int_0^\infty u^3e^{-u}\,du = \Gamma(4) = \mathbf 6.$$

The minus sign in $dx$ is used up by swapping the limits back into increasing order. Euler's own integral was of exactly this form.

### Example 5 (a waiting time)

In probability, the time $X$ until the next event in a steady random process (a radioactive decay, a call arriving) is often modeled by the exponential density $f(x) = \lambda e^{-\lambda x}$ for $x \ge 0$, where $\lambda > 0$ is the average rate. The mean waiting time is $\int_0^\infty x\cdot\lambda e^{-\lambda x}\,dx$. By the first pattern with $n = 1$, $a = \lambda$:

$$\lambda\cdot\frac{1!}{\lambda^2} = \mathbf{\frac1\lambda}.$$

If calls arrive at an average rate of 4 per hour, the mean wait is $\frac14$ hour, 15 minutes, which matches intuition. (The exponential model is a simplification that assumes events happen independently at a constant rate.)

## History and where it leads

In letters to Christian Goldbach in 1729 and 1730, Leonhard Euler answered the question of how to make sense of $n!$ for fractional $n$, first with an infinite product and then with an integral equivalent to the one above. The letter $\Gamma$ and the shift by one, $\Gamma(n + 1) = n!$, came later from Adrien-Marie Legendre in the early 1800s; many mathematicians have wished the shift away, but it is now standard.

Two facts, stated here without proof:

- **Beyond $s > 0$.** Rewriting the functional equation as $\Gamma(s) = \frac{\Gamma(s + 1)}{s}$ defines $\Gamma$ for negative non-integers too (for example $\Gamma(-\frac12) = \frac{\Gamma(1/2)}{-1/2} = -2\sqrt\pi$). At $0, -1, -2, \dots$ it has vertical asymptotes. The integral itself only works for $s > 0$.
- **Stirling's approximation.** For large $n$, $n! \approx \sqrt{2\pi n}\left(\frac ne\right)^n$, with relative error that shrinks toward 0 (about $1.7\%$ at $n = 5$, under $0.5\%$ at $n = 20$). It is often derived from the gamma integral.

## Common mistakes

- *The off-by-one.* $\Gamma(n) = (n - 1)!$, not $n!$. $\Gamma(5) = 24$.
- *Matching the power wrongly.* $\Gamma(s)$ has $x^{s-1}$. So $\int_0^\infty x^{3/2}e^{-x}\,dx$ is $\Gamma(\frac52)$, not $\Gamma(\frac32)$.
- *Forgetting the $\frac1a$ from $dx = \frac{du}{a}$*, which gives $\frac{n!}{a^n}$ in place of $\frac{n!}{a^{n+1}}$.
- *Using the definition for $s \le 0$.* The integral diverges there; values like $\Gamma(-\frac12)$ come from the functional equation instead.
- *Thinking $\Gamma$ is smallest at $x = 1$.* $\Gamma(1) = \Gamma(2) = 1$, and the minimum lies between them, near $x \approx 1.46$.

## Key points

- $\Gamma(s) = \int_0^\infty x^{s-1}e^{-x}\,dx$ converges for $s > 0$ (comparison with a p-integral near 0 and with $e^{-x/2}$ near $\infty$).
- Parts gives $\Gamma(s + 1) = s\Gamma(s)$; with $\Gamma(1) = 1$ this gives $\Gamma(n + 1) = n!$.
- $\Gamma(\frac12) = \sqrt\pi$ (from the Gaussian integral), so $\Gamma(\frac32) = \frac{\sqrt\pi}{2}$, $\Gamma(\frac52) = \frac{3\sqrt\pi}{4}$, and so on.
- $\int_0^\infty x^ne^{-ax}\,dx = \frac{n!}{a^{n+1}}$; $\int_0^\infty x^me^{-x^2}\,dx = \frac12\Gamma\left(\frac{m + 1}{2}\right)$.
