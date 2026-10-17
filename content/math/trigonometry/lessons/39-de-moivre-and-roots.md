---
id: trig-demoivre
module: trig-m9
title: De Moivre's theorem and nth roots
minutes: 40
topics: [De Moivre's theorem]
drills: [trig-d-demoivre, trig-d-nth-roots, trig-d-roots-unity]
refs: [trig-ref-triangles]
---
## Powers by repeated rotation

The last lesson showed that multiplying complex numbers multiplies moduli and adds
arguments. Multiplying a number by itself $n$ times therefore raises the modulus to the
$n$th power and multiplies the argument by $n$. That's De Moivre's theorem. It turns a
computation like $(\sqrt3 + i)^5$, which would take pages of algebra, into two lines, and run
backward it finds every $n$th root of a complex number. It is the last stop in this course
and a first step toward the complex analysis used in engineering and physics.

## De Moivre's theorem

For $z = r(\cos\theta + i\sin\theta)$ and any positive integer $n$:
$$z^n = r^n(\cos n\theta + i\sin n\theta) = r^n\operatorname{cis}(n\theta).$$
This is **De Moivre's theorem**. It follows from the product rule by induction:
$z^2 = r\cdot r\operatorname{cis}(\theta + \theta)$, $z^3 = z^2\cdot z = r^3\operatorname{cis}3\theta$, and so on. (It also holds for
negative integers, with $z^{-1} = r^{-1}\operatorname{cis}(-\theta)$.)

### Example 1

Find $(1 + i)^8$.

$1 + i = \sqrt2\operatorname{cis}45^\circ$, so $(1 + i)^8 = (\sqrt2)^8\operatorname{cis}360^\circ = 16(1 + 0i) = 16$.

### Example 2

Find $(\sqrt3 + i)^5$ in $a + bi$ form.

$\sqrt3 + i = 2\operatorname{cis}30^\circ$. So
$$(\sqrt3 + i)^5 = 2^5\operatorname{cis}150^\circ = 32\left(-\tfrac{\sqrt3}{2} + \tfrac12 i\right) = -16\sqrt3 + 16i.$$

### Example 3

Find $(1 - i)^{10}$.

$1 - i = \sqrt2\operatorname{cis}(-45^\circ)$, so $(1 - i)^{10} = 32\operatorname{cis}(-450^\circ)$. Since $-450^\circ$ is coterminal with $-90^\circ$:
$32(\cos(-90^\circ) + i\sin(-90^\circ)) = -32i$.

Expanding $(1 - i)^{10}$ with the binomial theorem would take eleven terms.

## nth roots

A complex number $w$ is an **nth root** of $z$ if $w^n = z$. Every nonzero complex number has exactly
$n$ distinct $n$th roots. To find them, write $z = r\operatorname{cis}\theta$ and look for $w = s\operatorname{cis}\alpha$ with
$w^n = s^n\operatorname{cis}(n\alpha) = r\operatorname{cis}\theta$. The moduli must match, $s = \sqrt[n]{r}$, and the angles must
match up to full turns, $n\alpha = \theta + 2k\pi$. So

$$w_k = \sqrt[n]{r}\,\operatorname{cis}\left(\frac{\theta + 2k\pi}{n}\right), \qquad k = 0, 1, \ldots, n - 1.$$

$k = n$ gives back $w_0$, so there are exactly $n$ roots. They all have the same modulus and
are spaced $\tfrac{2\pi}{n}$ (or $\tfrac{360^\circ}{n}$) apart: **the $n$ roots are the vertices of a regular
$n$-gon** centered at the origin.

### Example 4

Find the cube roots of $8i$.

$8i = 8\operatorname{cis}90^\circ$. Modulus of each root: $\sqrt[3]{8} = 2$. Arguments: $\tfrac{90^\circ + 360^\circ k}{3} = 30^\circ + 120^\circ k$:

- $k = 0$: $2\operatorname{cis}30^\circ = \sqrt3 + i$
- $k = 1$: $2\operatorname{cis}150^\circ = -\sqrt3 + i$
- $k = 2$: $2\operatorname{cis}270^\circ = -2i$

Check one: $(-2i)^3 = -8i^3 = -8(-i) = 8i$. ✓

```plot
{"x": [-2.6, 2.6], "y": [-2.6, 2.6], "equal": true, "circles": [{"center": [0, 0], "r": 2}], "polygons": [{"points": [[1.7321, 1], [-1.7321, 1], [0, -2]]}], "points": [{"at": [1.7321, 1], "label": "√3 + i"}, {"at": [-1.7321, 1], "label": "−√3 + i"}, {"at": [0, -2], "label": "−2i"}], "xLabel": "real", "yLabel": "imaginary", "caption": "The three cube roots of 8i form an equilateral triangle"}
```

### Example 5: roots of unity

Find the sixth roots of 1.

$1 = 1\operatorname{cis}0^\circ$, so the roots are $\operatorname{cis}(60^\circ k)$ for $k = 0, \ldots, 5$:
$$1,\quad \tfrac12 + \tfrac{\sqrt3}{2}i,\quad -\tfrac12 + \tfrac{\sqrt3}{2}i,\quad -1,\quad -\tfrac12 - \tfrac{\sqrt3}{2}i,\quad \tfrac12 - \tfrac{\sqrt3}{2}i.$$
The $n$th roots of 1 are called the **roots of unity**; they sit on the unit circle at the
vertices of a regular $n$-gon with one vertex at 1. Here the special-angle points of the unit
circle reappear.

```plot
{"x": [-1.6, 1.6], "y": [-1.6, 1.6], "equal": true, "circles": [{"center": [0, 0], "r": 1}], "polygons": [{"points": [[1, 0], [0.5, 0.866], [-0.5, 0.866], [-1, 0], [-0.5, -0.866], [0.5, -0.866]]}], "points": [[1, 0], [0.5, 0.866], [-0.5, 0.866], [-1, 0], [-0.5, -0.866], [0.5, -0.866]], "xLabel": "real", "yLabel": "imaginary", "caption": "The sixth roots of unity form a regular hexagon"}
```

### Example 6: solving an equation

Solve $z^4 = -16$.

$-16 = 16\operatorname{cis}180^\circ$. Roots: $2\operatorname{cis}(45^\circ + 90^\circ k)$, $k = 0, 1, 2, 3$:
$$\sqrt2 + \sqrt2\,i,\quad -\sqrt2 + \sqrt2\,i,\quad -\sqrt2 - \sqrt2\,i,\quad \sqrt2 - \sqrt2\,i.$$
A polynomial equation of degree 4 has four solutions in the complex numbers, and here
they form a square.

### Example 7: square roots of a complex number

Find both square roots of $-2 + 2\sqrt3\,i$.

From Lesson 38, $-2 + 2\sqrt3\,i = 4\operatorname{cis}120^\circ$. The square roots have modulus $\sqrt4 = 2$ and
arguments $\tfrac{120^\circ + 360^\circ k}{2} = 60^\circ + 180^\circ k$:
$$w_0 = 2\operatorname{cis}60^\circ = 1 + \sqrt3\,i, \qquad w_1 = 2\operatorname{cis}240^\circ = -1 - \sqrt3\,i.$$
Check: $(1 + \sqrt3\,i)^2 = 1 + 2\sqrt3\,i + 3i^2 = -2 + 2\sqrt3\,i$. ✓ The two square roots are negatives of each
other, as square roots always are.

## Why exactly $n$ roots?

The arguments $\tfrac{\theta + 2k\pi}{n}$ for $k = 0, 1, \ldots, n - 1$ are all different and less than one full turn
apart from the first. For $k = n$ the argument is $\tfrac{\theta}{n} + 2\pi$, which is the same direction as
$k = 0$, and every later $k$ repeats an earlier root. So the list closes up after exactly $n$
roots. This matches the Fundamental Theorem of Algebra: $z^n = c$ is a polynomial
equation of degree $n$, which has exactly $n$ complex solutions.

## Where this leads

De Moivre's theorem is a shadow of Euler's formula $e^{i\theta} = \cos\theta + i\sin\theta$, which you will meet in
calculus. With it, $r\operatorname{cis}\theta = re^{i\theta}$, and De Moivre's theorem becomes the ordinary exponent rule
$(re^{i\theta})^n = r^ne^{in\theta}$.

## Common mistakes

- **Multiplying the modulus by $n$** instead of raising it to the $n$th power.
- **Forgetting the $2k\pi$** and finding only one root. There are always $n$.
- **Dividing only $\theta$, not $2k\pi$, by $n$.** The spacing is $\tfrac{2\pi}{n}$.
- **Wrong argument for the base number.** Check the quadrant before applying either formula.

## Key points

- De Moivre: $\left[r\operatorname{cis}\theta\right]^n = r^n\operatorname{cis}(n\theta)$.
- The $n$th roots of $r\operatorname{cis}\theta$ are $\sqrt[n]{r}\operatorname{cis}\tfrac{\theta + 2k\pi}{n}$, $k = 0, \ldots, n - 1$.
- The roots are equally spaced, $\tfrac{2\pi}{n}$ apart, on a circle of radius $\sqrt[n]{r}$: a regular $n$-gon.
- The $n$th roots of unity lie on the unit circle, starting at 1.
