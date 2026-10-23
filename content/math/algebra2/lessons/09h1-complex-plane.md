---
id: a2-m2-h-complex-plane
module: a2-m2
title: The geometry of complex numbers
minutes: 45
honors: true
topics: [Complex plane geometry]
drills: [a2-m2-r2-modulus, a2-m2-r2-complex-sqrt]
refs: [alg-ref-functions]
---
The complex numbers lesson drew $a + bi$ as the point $(a, b)$ in the complex plane and noticed that a number and its conjugate are mirror images. That picture is much more than a filing system. Every operation on complex numbers has a geometric meaning: adding is sliding, the conjugate is a reflection, and multiplying by $i$ is a quarter turn. This lesson develops those meanings, uses them to prove a surprising fact about sums of two squares, finds square roots of complex numbers, and ends with the story of how mathematicians came to accept these "impossible" numbers.

## The modulus: distance from zero

The point $a + bi$ is $a$ units across and $b$ units up from the origin, so by the Pythagorean theorem its distance from 0 is $\sqrt{a^2 + b^2}$. This distance is the **modulus** of the complex number, written like an absolute value:

$$|a + bi| = \sqrt{a^2 + b^2}.$$

For a real number ($b = 0$) this is $\sqrt{a^2} = |a|$, the ordinary absolute value, which is also a distance from 0. So the modulus extends absolute value from the number line to the plane.

![The point z = 4 + 3i in the complex plane, joined to the origin by a segment labeled |z| = 5. A right triangle has a horizontal leg of length 4 labeled real part 4 along the real axis and a vertical leg of length 3 labeled imaginary part 3. Below the real axis, the conjugate 4 − 3i is the mirror image of z.](images/a2-m2-modulus.svg)

Two facts connect the modulus with the conjugate $\bar z$ (read "z bar"), which is $a - bi$ when $z = a + bi$:

- $z\bar z = (a + bi)(a - bi) = a^2 + b^2 = |z|^2$. You've used this since the first complex numbers lesson: it is why dividing by a complex number works.
- Reflecting across the real axis doesn't change the distance from 0, so $|\bar z| = |z|$.

Since $z\bar z = |z|^2$, the reciprocal of a nonzero complex number is $\dfrac1z = \dfrac{\bar z}{|z|^2}$. For example, $\dfrac{1}{3 - 4i} = \dfrac{3 + 4i}{25} = \dfrac{3}{25} + \dfrac{4}{25}i$.

Subtraction gives distances between points. The number $z - w$ has real part (difference of the real parts) and imaginary part (difference of the imaginary parts), so $|z - w|$ is exactly the distance formula from Algebra 1.

### Example 1

Find $|3 - 4i|$, and the distance between $z = 1 + 2i$ and $w = 4 - 2i$.

1. $|3 - 4i| = \sqrt{3^2 + (-4)^2} = \sqrt{25} = 5$. Square the parts, not $-4i$: the imaginary part is $-4$.
2. $z - w = (1 - 4) + (2 - (-2))i = -3 + 4i$.
3. The distance is $|-3 + 4i| = \sqrt{9 + 16} = 5$. The two points are 5 units apart, just as the distance formula gives for $(1, 2)$ and $(4, -2)$.

## Adding is sliding

To add complex numbers you add real parts and imaginary parts separately, which is exactly how arrows (vectors) add: put the tail of the arrow for $w$ at the head of the arrow for $z$, and the sum is where you end up. The four points $0$, $z$, $w$ and $z + w$ form a parallelogram.

```plot
{"x": [-1, 6], "y": [-1, 5], "equal": true, "xLabel": "real", "yLabel": "imaginary", "segments": [{"from": [0, 0], "to": [3, 1], "arrow": true}, {"from": [0, 0], "to": [1, 2], "arrow": true}, {"from": [0, 0], "to": [4, 3], "arrow": true}, {"from": [3, 1], "to": [4, 3], "dashed": true}, {"from": [1, 2], "to": [4, 3], "dashed": true}], "points": [{"at": [3, 1], "label": "z = 3 + i"}, {"at": [1, 2], "label": "w = 1 + 2i"}, {"at": [4, 3], "label": "z + w = 4 + 3i"}], "caption": "Adding complex numbers follows the parallelogram rule, like adding arrows"}
```

The picture also proves a useful inequality. Going from 0 to $z + w$ directly is never longer than going the long way, first along $z$ and then along $w$. That is the **triangle inequality**:

$$|z + w| \le |z| + |w|.$$

Equality happens only when $z$ and $w$ point in the same direction. For example, $|3 + 4i| = 5$, while $|3| + |4i| = 7$: the straight path is shorter.

## Multiplying by i is a quarter turn

Multiply a general number by $i$:

$$i(a + bi) = ai + bi^2 = -b + ai.$$

So the point $(a, b)$ moves to $(-b, a)$. The new point is the same distance from the origin, since $(-b)^2 + a^2 = a^2 + b^2$, and the two arrows are perpendicular (the slopes $\tfrac ba$ and $-\tfrac ab$ multiply to $-1$ when neither is 0 or undefined). Checking a few points shows the turn is counterclockwise: $1 \to i \to -1 \to -i \to 1$. So multiplying by $i$ rotates every point a quarter turn ($90°$) counterclockwise about the origin. That is the geometric reason the powers of $i$ cycle with period 4: four quarter turns make a full turn.

```plot
{"x": [-4, 4], "y": [-4, 4], "equal": true, "xLabel": "real", "yLabel": "imaginary", "segments": [{"from": [0, 0], "to": [3, 1], "arrow": true}, {"from": [0, 0], "to": [-1, 3], "arrow": true}, {"from": [0, 0], "to": [-3, -1], "arrow": true, "dashed": true}, {"from": [0, 0], "to": [1, -3], "arrow": true, "dashed": true}], "points": [{"at": [3, 1], "label": "z = 3 + i"}, {"at": [-1, 3], "label": "iz = −1 + 3i"}, {"at": [-3, -1], "label": "i²z = −3 − i"}, {"at": [1, -3], "label": "i³z = 1 − 3i"}], "caption": "Each multiplication by i turns the arrow 90° counterclockwise without changing its length"}
```

Multiplying by a positive real number $r$ just stretches the arrow by the factor $r$. Multiplying by $-1$ is a half turn. A general product combines a stretch and a turn: multiplying by $w$ stretches by $|w|$ and turns by the angle that $w$ makes with the positive real axis. The turning half of that statement needs trigonometry; it is proved in the honors lesson on complex numbers in polar form (at the end of the course) and in precalculus. The stretching half can be proved right now.

### The modulus of a product

*Claim.* $|zw| = |z|\,|w|$ for all complex numbers $z$ and $w$.

*Proof.* Let $z = a + bi$ and $w = c + di$. Then $zw = (ac - bd) + (ad + bc)i$, and

$$|zw|^2 = (ac - bd)^2 + (ad + bc)^2 = a^2c^2 - 2abcd + b^2d^2 + a^2d^2 + 2abcd + b^2c^2.$$

The middle terms cancel, and the four squares factor:

$$a^2c^2 + a^2d^2 + b^2c^2 + b^2d^2 = (a^2 + b^2)(c^2 + d^2) = |z|^2|w|^2.$$

Both moduli are nonnegative, so taking square roots gives $|zw| = |z|\,|w|$. $\blacksquare$

The same equation, read without $i$ at all, says

$$(a^2 + b^2)(c^2 + d^2) = (ac - bd)^2 + (ad + bc)^2.$$

This is the **Brahmagupta–Fibonacci identity**: a product of two sums of two squares is again a sum of two squares. It was known long before complex numbers (it appears in Diophantus, and Brahmagupta and Fibonacci both used it), but complex numbers explain *why* it's true.

### Example 2

Let $z = 3 + 4i$ and $w = 1 + i$. Check that $|zw| = |z|\,|w|$.

1. $|z| = 5$ and $|w| = \sqrt2$, so $|z|\,|w| = 5\sqrt2$.
2. $zw = 3 + 3i + 4i + 4i^2 = -1 + 7i$.
3. $|zw| = \sqrt{1 + 49} = \sqrt{50} = 5\sqrt2$. ✓

### Example 3

Write $65 = 5 \cdot 13$ as a sum of two squares in two different ways.

1. Each factor is a sum of two squares: $5 = 1^2 + 2^2 = |1 + 2i|^2$ and $13 = 2^2 + 3^2 = |2 + 3i|^2$.
2. Multiply: $(1 + 2i)(2 + 3i) = 2 + 3i + 4i + 6i^2 = -4 + 7i$. So $65 = |{-4} + 7i|^2 = 4^2 + 7^2 = 16 + 49$.
3. Use the conjugate of one factor instead (it has the same modulus): $(1 + 2i)(2 - 3i) = 2 - 3i + 4i - 6i^2 = 8 + i$. So $65 = 8^2 + 1^2 = 64 + 1$.

## Square roots of complex numbers

Every nonzero complex number has exactly two square roots, negatives of each other, and they are complex numbers too. You don't need anything new to find them, just the equality rule (real parts equal, imaginary parts equal).

To find $\sqrt{p + qi}$, look for $x + yi$ with $(x + yi)^2 = p + qi$. Since $(x + yi)^2 = (x^2 - y^2) + 2xyi$:

$$x^2 - y^2 = p, \qquad 2xy = q.$$

This is a nonlinear system, like those in the nonlinear systems lesson. A shortcut makes it easy: the modulus of a square is the square of the modulus, so $x^2 + y^2 = |p + qi| = \sqrt{p^2 + q^2}$. Adding and subtracting this with $x^2 - y^2 = p$ gives $x^2$ and $y^2$ directly. Then the sign of $q = 2xy$ tells you whether $x$ and $y$ have the same sign ($q > 0$) or opposite signs ($q < 0$).

### Example 4

Find the square roots of $5 + 12i$.

1. Set up: $x^2 - y^2 = 5$ and $2xy = 12$.
2. Modulus: $x^2 + y^2 = \sqrt{25 + 144} = 13$.
3. Add the first and third equations: $2x^2 = 18$, so $x^2 = 9$. Subtract: $2y^2 = 8$, so $y^2 = 4$.
4. $xy = 6 > 0$, so $x$ and $y$ have the same sign: $x = 3, y = 2$ or $x = -3, y = -2$.
5. The square roots are $\pm(3 + 2i)$. Check: $(3 + 2i)^2 = 9 + 12i + 4i^2 = 5 + 12i$. ✓

With square roots of complex numbers in hand, the quadratic formula works even when the coefficients themselves are complex.

### Example 5

Solve $z^2 - 3z + (3 - i) = 0$.

1. $a = 1$, $b = -3$, $c = 3 - i$. Discriminant: $9 - 4(3 - i) = -3 + 4i$.
2. Square root of $-3 + 4i$: $x^2 - y^2 = -3$, $x^2 + y^2 = \sqrt{9 + 16} = 5$, so $x^2 = 1$ and $y^2 = 4$. Since $2xy = 4 > 0$, the roots are $\pm(1 + 2i)$.
3. $z = \dfrac{3 \pm (1 + 2i)}{2}$, so $z = \dfrac{4 + 2i}{2} = 2 + i$ or $z = \dfrac{2 - 2i}{2} = 1 - i$.
4. Check with sum and product: $(2 + i) + (1 - i) = 3 = -\tfrac ba$, and $(2 + i)(1 - i) = 2 - 2i + i - i^2 = 3 - i = \tfrac ca$. ✓

Notice that $2 + i$ and $1 - i$ are *not* conjugates. Non-real roots come in conjugate pairs only when all the coefficients are real; here $c = 3 - i$ is not.

## How "impossible" numbers were accepted

For centuries, square roots of negative numbers were treated as signs that a problem had no answer. In his 1545 book *Ars Magna*, Gerolamo Cardano posed the problem of splitting 10 into two parts whose product is 40. In modern notation that is the nonlinear system $x + y = 10$, $xy = 40$, which leads to $x^2 - 10x + 40 = 0$ and the solutions $5 \pm \sqrt{-15}$, that is $5 \pm i\sqrt{15}$. Cardano checked that $(5 + \sqrt{-15})(5 - \sqrt{-15}) = 25 + 15 = 40$, but called such quantities useless.

The turning point came from cubic equations. A formula for cubics published by Cardano, applied to $x^3 = 15x + 4$, produces the expression

$$x = \sqrt[3]{2 + 11i} + \sqrt[3]{2 - 11i},$$

even though the equation has the plain real solution $x = 4$ (check: $64 = 60 + 4$). Around 1572, Rafael Bombelli noticed that $(2 + i)^3 = 2 + 11i$ and $(2 - i)^3 = 2 - 11i$. (Check the first: $(2 + i)^2 = 3 + 4i$, and $(3 + 4i)(2 + i) = 6 + 3i + 8i + 4i^2 = 2 + 11i$.) So the formula's answer is $(2 + i) + (2 - i) = 4$: the imaginary parts cancel and the real root appears. Complex numbers were needed as a route to a real answer.

The name "imaginary" comes from René Descartes (1637), and he meant it dismissively. The picture of complex numbers as points in a plane was published by Caspar Wessel (1799) and Jean-Robert Argand (1806), and Carl Friedrich Gauss's use of it in the 1830s made it standard. That is why the complex plane is also called the Argand plane or Gaussian plane.

## Common mistakes

- Including $i$ when squaring the imaginary part: $|3 - 4i| = \sqrt{9 + 16}$, not $\sqrt{9 - 16}$ or $\sqrt{9 + 16i^2}$.
- Thinking the modulus can be negative or complex. It is a distance, so it's a nonnegative real number.
- Expecting $|z + w| = |z| + |w|$. Moduli multiply ($|zw| = |z|\,|w|$), but they don't add.
- Rotating the wrong way: multiplying by $i$ turns counterclockwise, so $1 \to i$; multiplying by $-i$ turns clockwise.
- When finding $\sqrt{p + qi}$, forgetting to use the sign of $q$ to pair the signs of $x$ and $y$. For $5 + 12i$, the pair $3 - 2i$ squares to $5 - 12i$.
- Assuming roots come in conjugate pairs when some coefficient is not real.

## Key points

- The modulus $|a + bi| = \sqrt{a^2 + b^2}$ is the distance from 0; $|z - w|$ is the distance between $z$ and $w$.
- $z\bar z = |z|^2$, so $\dfrac1z = \dfrac{\bar z}{|z|^2}$; the conjugate is a reflection across the real axis.
- Adding complex numbers follows the parallelogram rule, and $|z + w| \le |z| + |w|$ (the triangle inequality).
- Multiplying by $i$ rotates a point $90°$ counterclockwise about 0; $|zw| = |z|\,|w|$.
- The square roots of $p + qi$ are $\pm(x + yi)$ with $x^2 - y^2 = p$, $x^2 + y^2 = \sqrt{p^2 + q^2}$, and $xy$ having the sign of $q$.
- Complex numbers entered mathematics through equations (Cardano, Bombelli) and were pictured as points by Wessel, Argand and Gauss.
