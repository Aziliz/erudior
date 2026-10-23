---
id: calc-m10-h-complex
module: calc-m10
title: "Complex power series and Euler's formula"
minutes: 45
honors: true
topics: [Complex power series, Euler's formula]
drills: [calc-m10-r2-complex-radius, calc-m10-r2-de-moivre]
refs: [calc-ref-series]
---
## Two puzzles

Lesson 43 left a puzzle. The function $\frac{1}{1 + x^2}$ is smooth for every real $x$, with no asymptotes and no corners, yet its Maclaurin series $1 - x^2 + x^4 - \cdots$ converges only for $|x| < 1$. What stops it at $\pm1$? And why do we call $R$ a *radius*, when on the number line it is half the length of an interval?

Lesson 44 left another. The series for $e^x$, $\cos x$ and $\sin x$ look strangely alike: $e^x$ has every term $\frac{x^n}{n!}$, $\cos x$ has the even ones and $\sin x$ the odd ones, with some signs flipped. Is that a coincidence?

Both puzzles are solved by letting the variable be a complex number. This lesson shows how power series work for complex inputs, derives Euler's formula $e^{i\theta} = \cos\theta + i\sin\theta$, uses it to do trigonometry and calculus, and explains where the radius of convergence comes from.

## Complex numbers in brief

A **complex number** is $z = a + bi$ with $a, b$ real and $i^2 = -1$. You add and multiply as with polynomials, replacing $i^2$ by $-1$: $(1 + 2i)(3 - i) = 3 - i + 6i - 2i^2 = 5 + 5i$. Powers of $i$ repeat in a cycle of four: $i, -1, -i, 1, i, \dots$

Picture $a + bi$ as the point $(a, b)$ in the **complex plane**, with real numbers along the horizontal axis and multiples of $i$ along the vertical one. Its **modulus** $|z| = \sqrt{a^2 + b^2}$ is its distance from 0, and $|z - w|$ is the distance between $z$ and $w$. Moduli multiply: $|zw| = |z|\,|w|$. For a real number the modulus is the usual absolute value.

## Series with complex terms

Everything in Lessons 40 to 43 carries over, with $|\cdot|$ meaning modulus:

- $\sum z_n$ converges when its partial sums converge, which happens exactly when the real parts and the imaginary parts both converge.
- If $\sum|z_n|$ converges, then $\sum z_n$ converges (absolute convergence still implies convergence).
- The ratio test works as before with $L = \lim\left|\frac{z_{n+1}}{z_n}\right|$.

So the geometric series $\sum z^n = \frac{1}{1 - z}$ holds for every complex $z$ with $|z| < 1$, and a power series $\sum c_n(z - a)^n$ converges absolutely when $|z - a| < R$ and diverges when $|z - a| > R$. The set $|z - a| < R$ is a disk in the plane, the **disk of convergence**. That is why $R$ is called a radius. The real interval of convergence is just the part of the disk that lies on the real axis.

## Euler's formula

Since $\sum\frac{z^n}{n!}$ converges for every complex $z$ (the ratio is $\frac{|z|}{n + 1} \to 0$), we can use it to *define* $e^z$ for complex $z$. Multiplying two such series term by term shows that $e^{z + w} = e^z e^w$ still holds, so this definition behaves like the exponential you know.

Now put in $z = i\theta$ with $\theta$ real. The powers of $i\theta$ are $1, i\theta, -\theta^2, -i\theta^3, \theta^4, i\theta^5, \dots$, so
$$e^{i\theta} = 1 + i\theta - \frac{\theta^2}{2!} - i\frac{\theta^3}{3!} + \frac{\theta^4}{4!} + i\frac{\theta^5}{5!} - \cdots.$$
Collect the real terms and the imaginary terms (allowed because the series converges absolutely):
$$e^{i\theta} = \left(1 - \frac{\theta^2}{2!} + \frac{\theta^4}{4!} - \cdots\right) + i\left(\theta - \frac{\theta^3}{3!} + \frac{\theta^5}{5!} - \cdots\right) = \cos\theta + i\sin\theta.$$
This is **Euler's formula**, published by Leonhard Euler in 1748. It answers the second puzzle: cosine and sine are the even and odd halves of the exponential, seen along the imaginary axis.

Geometrically, $e^{i\theta}$ is the point on the unit circle at angle $\theta$ (in radians) from the positive real axis, so $|e^{i\theta}| = 1$ for every real $\theta$.

![The unit circle in the complex plane with the point e to the i theta at angle theta; its horizontal coordinate is cos theta and its vertical coordinate is sin theta](images/calc-m10-euler-circle.svg)

With $\theta = \pi$ you get $e^{i\pi} = -1$, usually written $e^{i\pi} + 1 = 0$ and called **Euler's identity**: it links $e$, $i$, $\pi$, 1 and 0 in one line.

Every complex number can be written as $z = re^{i\theta}$, with $r = |z|$ and $\theta$ its angle. Because $e^{z + w} = e^z e^w$, multiplying is easy: $r_1e^{i\theta_1}\cdot r_2e^{i\theta_2} = r_1r_2e^{i(\theta_1 + \theta_2)}$. Moduli multiply and angles add. Raising $e^{i\theta}$ to the $n$th power gives **De Moivre's formula**, named after Abraham de Moivre, who worked with it in the early 1700s:
$$(\cos\theta + i\sin\theta)^n = \cos n\theta + i\sin n\theta.$$

### Example 1

Evaluate $e^{i\pi/2}$, $e^{i\pi/3}$ and $e^{1 + i\pi}$.

- $e^{i\pi/2} = \cos\frac\pi2 + i\sin\frac\pi2 = i$.
- $e^{i\pi/3} = \frac12 + \frac{\sqrt3}{2}i$.
- $e^{1 + i\pi} = e^1\cdot e^{i\pi} = e(-1) = -e \approx -2.718$.

### Example 2 (trig identities for free)

Find formulas for $\cos3\theta$ and $\sin3\theta$ in terms of $c = \cos\theta$ and $s = \sin\theta$.

By De Moivre, $\cos3\theta + i\sin3\theta = (c + is)^3$. Expand with the binomial theorem:
$$(c + is)^3 = c^3 + 3c^2(is) + 3c(is)^2 + (is)^3 = (c^3 - 3cs^2) + i(3c^2s - s^3).$$
Match real and imaginary parts: $\cos3\theta = c^3 - 3cs^2$ and $\sin3\theta = 3c^2s - s^3$. Using $s^2 = 1 - c^2$ and $c^2 = 1 - s^2$:
$$\cos3\theta = 4\cos^3\theta - 3\cos\theta, \qquad \sin3\theta = 3\sin\theta - 4\sin^3\theta.$$
Check at $\theta = 0$: $\cos0 = 1 = 4 - 3$. No angle-addition formulas were needed.

### Example 3 (an integral without parts)

Find $\int e^x\cos x\,dx$.

Lesson 31 does this with integration by parts twice. Instead, $e^x\cos x$ is the real part of $e^xe^{ix} = e^{(1 + i)x}$, and the antiderivative of $e^{kx}$ is $\frac{e^{kx}}{k}$ for complex $k$ too. So take the real part of
$$\frac{e^{(1 + i)x}}{1 + i} = \frac{(1 - i)e^x(\cos x + i\sin x)}{2} = \frac{e^x}{2}\left[(\cos x + \sin x) + i(\sin x - \cos x)\right].$$
Answer: $\int e^x\cos x\,dx = \frac{e^x}{2}(\cos x + \sin x) + C$. Differentiate to check: $\frac{e^x}{2}(\cos x + \sin x) + \frac{e^x}{2}(-\sin x + \cos x) = e^x\cos x$. As a bonus, the imaginary part gives $\int e^x\sin x\,dx = \frac{e^x}{2}(\sin x - \cos x) + C$.

Adding and subtracting Euler's formula for $\theta$ and $-\theta$ also gives
$$\cos\theta = \frac{e^{i\theta} + e^{-i\theta}}{2}, \qquad \sin\theta = \frac{e^{i\theta} - e^{-i\theta}}{2i},$$
which look just like $\cosh x$ and $\sinh x$ from Lesson 36. Indeed $\cos(ix) = \cosh x$: the circular and hyperbolic functions are the same functions viewed along different axes.

## Why the radius is what it is

Back to the first puzzle. As a function of a complex $z$, $\frac{1}{1 + z^2}$ blows up where $z^2 = -1$, at $z = i$ and $z = -i$. Both are at distance 1 from the center 0. Partial fractions make the connection exact:
$$\frac{1}{1 + z^2} = \frac{1}{2i}\left(\frac{1}{z - i} - \frac{1}{z + i}\right),$$
and each piece is a geometric series that converges only while $|z| < 1$ (for example $\frac{1}{z - i} = \frac{i}{1 + iz}$, a geometric series in $-iz$). The series is blocked by points that are invisible on the real line.

This is a general fact, stated here without proof:

*For a rational function in lowest terms, the radius of convergence of its Taylor series centered at $a$ equals the distance from $a$ to the nearest zero of the denominator, real or complex.*

Complex analysis extends this to functions like $\tan x$ and $\ln(1 + x)$: $R$ is the distance from the center to the nearest **singularity**, a point where the function (as a function of a complex variable) blows up or otherwise fails to be differentiable. Functions with no singularities at all, such as $e^z$, $\sin z$ and $\cos z$, have $R = \infty$, matching Lesson 44.

![The complex plane for f of z equals 1 over 1 plus z squared. The singularities at i and minus i are marked. The disk of radius 1 about 0 is shaded, and the real interval from minus 1 to 1 is highlighted. A dashed circle of radius root 2 about the center 1 passes through both singularities](images/calc-m10-disk.svg)

### Example 4

Find the radius of convergence of the Taylor series of $\frac{1}{1 + x^2}$ centered at $a = 1$.

The singularities are $\pm i$. The distance from 1 to $i$ is $|1 - i| = \sqrt{1^2 + 1^2} = \sqrt2$, and the same for $-i$. So $R = \sqrt2$: the series converges for real $x$ in $(1 - \sqrt2, 1 + \sqrt2)$, wider than at center 0 even though the real graph gives no hint why.

### Example 5

Without computing any coefficients, find $R$ for (a) the Maclaurin series of $\frac{1}{x^2 - 4x + 13}$, (b) the Maclaurin series of $\tan x$, (c) the Taylor series of $\ln(1 + x)$ centered at $a = 2$.

(a) The denominator's zeros are $x = \frac{4 \pm \sqrt{16 - 52}}{2} = 2 \pm 3i$. The distance from 0 is $\sqrt{2^2 + 3^2} = \sqrt{13}$, so $R = \sqrt{13} \approx 3.61$.

(b) $\tan z = \frac{\sin z}{\cos z}$ blows up where $\cos z = 0$. It turns out $\cos z$ has no zeros off the real axis, so the nearest are $\pm\frac\pi2$ and $R = \frac\pi2$.

(c) $\ln(1 + z)$ breaks down at $z = -1$, at distance 3 from 2. So $R = 3$, which agrees with the ratio test applied to the series $\ln 3 + \sum_{n\ge1}\frac{(-1)^{n+1}(x - 2)^n}{n\,3^n}$.

## Common mistakes

- *Looking only at the real graph for the radius.* Complex singularities limit $R$ even when the real graph is perfectly smooth.
- *Forgetting the cycle of powers of $i$.* $i^2 = -1$, $i^3 = -i$, $i^4 = 1$; a sign slip here scrambles Euler's formula.
- *Using degrees in $e^{i\theta}$.* Euler's formula comes from the series for $\sin$ and $\cos$, which need radians.
- *Treating the modulus like a real absolute value.* $|3 + 4i| = 5$, not 7.
- *Dropping the real-part step.* In Example 3 the answer is the real part of the complex antiderivative, not the whole thing.

## Key points

- Complex power series converge on a disk $|z - a| < R$; the real interval is its slice along the real axis.
- $e^z = \sum\frac{z^n}{n!}$ for all complex $z$; Euler's formula $e^{i\theta} = \cos\theta + i\sin\theta$ and $e^{i\pi} + 1 = 0$.
- $re^{i\theta}$ form: moduli multiply, angles add; De Moivre: $(\cos\theta + i\sin\theta)^n = \cos n\theta + i\sin n\theta$.
- $\cos\theta = \frac{e^{i\theta} + e^{-i\theta}}{2}$, $\sin\theta = \frac{e^{i\theta} - e^{-i\theta}}{2i}$; complex exponentials turn trig identities and integrals like $\int e^x\cos x\,dx$ into algebra.
- For a rational function, $R$ is the distance from the center to the nearest complex zero of the denominator; more generally, to the nearest singularity.
