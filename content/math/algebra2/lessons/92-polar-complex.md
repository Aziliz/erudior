---
id: a2-h1-polar-complex
module: a2-h1
title: Complex numbers in polar form
minutes: 50
topics: [Polar form of complex numbers, Powers and roots of complex numbers]
drills: [a2-h1-r2-modulus-argument, a2-h1-r2-polar-multiply, a2-h1-r2-de-moivre]
refs: [a2-ref-prob-trig]
---
Two lessons in this course meet here. The complex numbers lesson pictured $a + bi$ as the point $(a, b)$ in the complex plane, and noticed that the powers of $i$ cycle through $i, -1, -i, 1$. The unit circle lesson described points by an angle, with coordinates $(\cos\theta, \sin\theta)$. Put the two together and complex numbers get a second address, a distance and an angle, and in that form multiplication turns out to have a simple geometric meaning: *multiply the lengths and add the angles*. That one fact explains the cycle of the powers of $i$, makes large powers easy, and finds every root of a number, complex or real. Angles in this lesson are mostly in degrees; everything works the same in radians.

## Modulus and argument

Picture $z = a + bi$ as an arrow from the origin to the point $(a, b)$.

- Its length is the **modulus** of $z$, written $|z|$ or $r$: $\;|z| = \sqrt{a^2 + b^2}$. For a real number this is the ordinary absolute value, so the notation fits. (The honors lesson on the geometry of complex numbers in Module 2 studies the modulus in more detail, and proves that $|zw| = |z|\,|w|$. It leaves the angle half of the story for later; this lesson supplies it.)
- The angle from the positive real axis to the arrow, measured counterclockwise, is an **argument** of $z$, written $\theta$.

![The complex plane with a point z = a + bi in the first quadrant. An arrow of length r runs from the origin to z, the angle theta is marked from the positive real axis, and dashed lines show the real part a along the horizontal axis and the imaginary part b up to the point.](images/a2-h1-polar-form.svg)

Adding a full turn doesn't change the arrow, so $\theta$, $\theta + 360^\circ$, $\theta - 360^\circ$ and so on are all arguments of the same number. In this lesson we give the one with $0^\circ \le \theta < 360^\circ$. (Many books use $-180^\circ < \theta \le 180^\circ$ instead; both are correct as long as you say which.) The number 0 has modulus 0 and no defined argument.

To find $\theta$, find the reference angle from $\tan\theta = \tfrac{b}{a}$ using $|a|$ and $|b|$, then place it in the quadrant where $(a, b)$ lies, exactly as in the unit circle lesson. A calculator's $\tan^{-1}$ only returns angles between $-90^\circ$ and $90^\circ$, so it is wrong by $180^\circ$ whenever $a < 0$. Always sketch the point first.

## Polar form

Since the point at distance $r$ and angle $\theta$ is $(r\cos\theta, r\sin\theta)$, we have $a = r\cos\theta$ and $b = r\sin\theta$, so

$$z = r(\cos\theta + i\sin\theta).$$

This is the **polar form** (or trigonometric form) of $z$; $a + bi$ is called rectangular form. The expression $\cos\theta + i\sin\theta$ comes up so often that it has a short name: **cis**$\,\theta$ ("sis theta"). So $z = r\,\text{cis}\,\theta$.

### Example 1

Write $-2 + 2i$, $1 - \sqrt3\,i$ and $-3 + 4i$ in polar form.

1. $-2 + 2i$: $r = \sqrt{4 + 4} = 2\sqrt2$. The point $(-2, 2)$ is in quadrant II with reference angle $45^\circ$, so $\theta = 180^\circ - 45^\circ = 135^\circ$. Polar form: $2\sqrt2\,\text{cis}\,135^\circ$.
2. $1 - \sqrt3\,i$: $r = \sqrt{1 + 3} = 2$. The point is in quadrant IV, and $\tan^{-1}\sqrt3 = 60^\circ$, so $\theta = 360^\circ - 60^\circ = 300^\circ$. Polar form: $2\,\text{cis}\,300^\circ$.
3. $-3 + 4i$: $r = \sqrt{9 + 16} = 5$. A calculator gives $\tan^{-1}\left(\tfrac{4}{-3}\right) \approx -53.1^\circ$, which points into quadrant IV, but $(-3, 4)$ is in quadrant II. The reference angle is $53.1^\circ$, so $\theta \approx 180^\circ - 53.1^\circ = 126.9^\circ$. Polar form: about $5\,\text{cis}\,126.9^\circ$.

### Example 2

Write $4\,\text{cis}\,150^\circ$ in rectangular form.

$\cos 150^\circ = -\tfrac{\sqrt3}{2}$ and $\sin 150^\circ = \tfrac12$, so $4\left(-\tfrac{\sqrt3}{2} + \tfrac12 i\right) = -2\sqrt3 + 2i$.

## Multiplying: multiply lengths, add angles

Multiply $z_1 = r_1\,\text{cis}\,\alpha$ by $z_2 = r_2\,\text{cis}\,\beta$ and expand with FOIL, using $i^2 = -1$:

$$z_1 z_2 = r_1 r_2\big[(\cos\alpha\cos\beta - \sin\alpha\sin\beta) + i(\sin\alpha\cos\beta + \cos\alpha\sin\beta)\big].$$

The two brackets are exactly the **angle-sum formulas** of trigonometry, $\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$ and $\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta$. They are proved in precalculus; here we use them. So

$$z_1 z_2 = r_1 r_2\,\text{cis}(\alpha + \beta), \qquad \frac{z_1}{z_2} = \frac{r_1}{r_2}\,\text{cis}(\alpha - \beta) \;\; (z_2 \ne 0).$$

The division rule follows because division undoes multiplication. In words: to multiply, multiply the moduli and add the arguments; to divide, divide the moduli and subtract the arguments.

### Example 3

Multiply $z_1 = 2\,\text{cis}\,30^\circ$ and $z_2 = 3\,\text{cis}\,60^\circ$, then check in rectangular form.

1. Polar: $z_1 z_2 = (2 \cdot 3)\,\text{cis}(30^\circ + 60^\circ) = 6\,\text{cis}\,90^\circ = 6(0 + i) = 6i$.
2. Rectangular: $z_1 = \sqrt3 + i$ and $z_2 = \tfrac32 + \tfrac{3\sqrt3}{2}i$. FOIL: $\tfrac{3\sqrt3}{2} + \tfrac{9}{2}i + \tfrac32 i + \tfrac{3\sqrt3}{2}i^2 = \left(\tfrac{3\sqrt3}{2} - \tfrac{3\sqrt3}{2}\right) + 6i = 6i$. The same answer, with much more work.

Geometrically, multiplying by $r\,\text{cis}\,\theta$ *stretches* the arrow by the factor $r$ and *rotates* it by $\theta$. In particular, $i = 1\,\text{cis}\,90^\circ$, so multiplying by $i$ rotates a point a quarter turn counterclockwise without changing its length. That is why the powers of $i$ cycle with period 4: $1, i, -1, -i$ are the four points reached by quarter turns, and four quarter turns bring you back to the start.

```plot
{"x": [-4.5, 4.5], "y": [-4.5, 4.5], "equal": true, "xLabel": "real", "yLabel": "imaginary", "segments": [{"from": [0, 0], "to": [3, 1], "arrow": true}, {"from": [0, 0], "to": [-1, 3], "arrow": true}, {"from": [0, 0], "to": [-3, -1], "arrow": true, "dashed": true}, {"from": [0, 0], "to": [1, -3], "arrow": true, "dashed": true}], "points": [{"at": [3, 1]}, {"at": [-1, 3]}, {"at": [-3, -1]}, {"at": [1, -3]}], "labels": [{"at": [3, 1.6], "text": "z = 3 + i"}, {"at": [-1, 3.6], "text": "iz = −1 + 3i"}, {"at": [-3, -1.7], "text": "i²z = −3 − i"}, {"at": [2.3, -3.2], "text": "i³z = 1 − 3i"}], "caption": "Each multiplication by i turns the arrow 90° counterclockwise and keeps its length"}
```

## Powers: De Moivre's theorem

Multiplying $z = r\,\text{cis}\,\theta$ by itself $n$ times multiplies $r$ by itself $n$ times and adds $\theta$ to itself $n$ times. This is **De Moivre's theorem**: for every positive integer $n$,

$$\big(r\,\text{cis}\,\theta\big)^n = r^n\,\text{cis}(n\theta).$$

It is named after Abraham de Moivre (1667–1754), a French-born mathematician working in London, whose work used closely related formulas, although he never wrote it in exactly this form. Compare the alternative: expanding $(1 + \sqrt3\,i)^5$ by the binomial theorem gives six terms to simplify.

### Example 4

Compute $(1 + \sqrt3\,i)^5$ and $(1 + i)^8$.

1. $1 + \sqrt3\,i$ has $r = 2$ and $\theta = 60^\circ$. By De Moivre, $(2\,\text{cis}\,60^\circ)^5 = 2^5\,\text{cis}\,300^\circ = 32\left(\tfrac12 - \tfrac{\sqrt3}{2}i\right) = 16 - 16\sqrt3\,i$.
2. $1 + i$ has $r = \sqrt2$ and $\theta = 45^\circ$. So $(1 + i)^8 = (\sqrt2)^8\,\text{cis}\,360^\circ = 16\,\text{cis}\,0^\circ = 16$.

A check on the second: $(1 + i)^2 = 1 + 2i + i^2 = 2i$, so $(1 + i)^8 = (2i)^4 = 16i^4 = 16$.

## Roots: n of them, evenly spaced

In this section an $n$th root of a number $w$ means *any* solution of $z^n = w$, real or not. (The radical sign keeps its old meaning: for a positive real $R$, $\sqrt[n]{R}$ is still the one positive real root.) By the Fundamental Theorem of Algebra, $z^n - w = 0$ has exactly $n$ solutions (counting multiplicity), and when $w \ne 0$ they are all different. De Moivre's theorem finds them. Write $w = R\,\text{cis}\,\varphi$ and look for $z = r\,\text{cis}\,\theta$ with $r^n\,\text{cis}(n\theta) = R\,\text{cis}\,\varphi$. The moduli must match, so $r = \sqrt[n]{R}$. The angles need only match up to whole turns: $n\theta = \varphi + 360^\circ k$. Dividing by $n$,

$$z_k = \sqrt[n]{R}\;\text{cis}\left(\frac{\varphi + 360^\circ k}{n}\right), \qquad k = 0, 1, \dots, n - 1.$$

Taking $k = n$ would just repeat $z_0$, so there are exactly $n$ roots. They all have the same modulus and their arguments are $\tfrac{360^\circ}{n}$ apart, so they sit at the corners of a regular $n$-sided polygon centered at the origin. The roots of $z^n = 1$ are called the nth **roots of unity**.

### Example 5

Find all three cube roots of 8.

1. $8 = 8\,\text{cis}\,0^\circ$, so $r = \sqrt[3]{8} = 2$ and the angles are $\tfrac{0^\circ + 360^\circ k}{3}$: $0^\circ$, $120^\circ$, $240^\circ$.
2. $z_0 = 2\,\text{cis}\,0^\circ = 2$.
3. $z_1 = 2\,\text{cis}\,120^\circ = 2\left(-\tfrac12 + \tfrac{\sqrt3}{2}i\right) = -1 + \sqrt3\,i$.
4. $z_2 = 2\,\text{cis}\,240^\circ = -1 - \sqrt3\,i$.

Check with algebra: $z^3 - 8 = (z - 2)(z^2 + 2z + 4)$, and the quadratic formula gives $z = \tfrac{-2 \pm \sqrt{4 - 16}}{2} = -1 \pm \sqrt3\,i$. The three roots form an equilateral triangle on the circle of radius 2.

```plot
{"x": [-3, 3], "y": [-3, 3], "equal": true, "xLabel": "real", "yLabel": "imaginary", "circles": [{"center": [0, 0], "r": 2}], "polygons": [{"points": [[2, 0], [-1, 1.7321], [-1, -1.7321]]}], "points": [{"at": [2, 0]}, {"at": [-1, 1.7321]}, {"at": [-1, -1.7321]}], "labels": [{"at": [2.4, 0.35], "text": "2"}, {"at": [-1.9, 2.3], "text": "−1 + √3 i"}, {"at": [-1.9, -2.4], "text": "−1 − √3 i"}], "caption": "The three cube roots of 8 are evenly spaced, 120° apart, on the circle of radius 2"}
```

### Example 6

Solve $z^4 = -16$.

1. $-16 = 16\,\text{cis}\,180^\circ$. So $r = \sqrt[4]{16} = 2$ and the angles are $\tfrac{180^\circ + 360^\circ k}{4} = 45^\circ + 90^\circ k$: $45^\circ$, $135^\circ$, $225^\circ$, $315^\circ$.
2. $2\,\text{cis}\,45^\circ = 2\left(\tfrac{\sqrt2}{2} + \tfrac{\sqrt2}{2}i\right) = \sqrt2 + \sqrt2\,i$, and the others follow by symmetry.
3. The solutions are $\pm\sqrt2 \pm \sqrt2\,i$ (all four sign combinations), the corners of a square.

## Beyond: Euler's formula

In calculus you will meet the number $e$ again, through infinite series, and find that $\text{cis}\,\theta$ is really an exponential: with $\theta$ in radians,

$$e^{i\theta} = \cos\theta + i\sin\theta.$$

Leonhard Euler published this in 1748. It explains the rules above, since exponents add when you multiply ($e^{i\alpha}e^{i\beta} = e^{i(\alpha + \beta)}$), and with $\theta = \pi$ it gives $e^{i\pi} = -1$. Here it is only a preview; the proof needs calculus.

## Common mistakes

- Trusting a calculator's $\tan^{-1}\tfrac{b}{a}$ when $a < 0$. Plot the point and use the reference angle in the right quadrant.
- Writing the modulus as $a^2 + b^2$ without the square root.
- Multiplying the arguments or adding the moduli. Moduli multiply; arguments add.
- Raising only the angle (or only the modulus) to the $n$th power. De Moivre gives $r^n$ and $n\theta$.
- Stopping at one root. $z^n = w$ has $n$ roots, spaced $\tfrac{360^\circ}{n}$ apart.
- Dividing $\varphi$ by $n$ but forgetting to add $360^\circ k$ first, which gives only the first root.

## Key points

- Modulus $|a + bi| = \sqrt{a^2 + b^2}$; the argument is the angle from the positive real axis, placed in the correct quadrant.
- Polar form: $z = r(\cos\theta + i\sin\theta) = r\,\text{cis}\,\theta$, with $a = r\cos\theta$ and $b = r\sin\theta$.
- Multiply: $r_1 r_2\,\text{cis}(\alpha + \beta)$. Divide: $\tfrac{r_1}{r_2}\,\text{cis}(\alpha - \beta)$. Multiplying by $i$ is a $90^\circ$ rotation.
- De Moivre: $(r\,\text{cis}\,\theta)^n = r^n\,\text{cis}(n\theta)$.
- The $n$ roots of $z^n = R\,\text{cis}\,\varphi$ are $\sqrt[n]{R}\,\text{cis}\tfrac{\varphi + 360^\circ k}{n}$, $k = 0, \dots, n - 1$: the corners of a regular $n$-gon.
