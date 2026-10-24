---
id: trig-m5-h-arctan-identities
module: trig-m5
title: Adding arctangents and computing π
minutes: 45
honors: true
topics: [Arctangent identities]
drills: [trig-m5-r2-arctan-sum]
refs: [trig-ref-unit-circle]
---
## Two angles from two slopes

Lesson 18 made $\tan^{-1}$ an honest function: $\tan^{-1}a$ is the angle in $\left(-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right)$
whose tangent is $a$. Lesson 19 found one identity that ties two inverse functions together,
$\sin^{-1}x + \cos^{-1}x = \tfrac{\pi}{2}$. This lesson asks a natural next question: if you know two
arctangents, what is their sum? The answer is a short formula with a twist that comes straight
from the range of $\tan^{-1}$, and it powered almost three centuries of hand calculations of $\pi$.

Everything here uses only right triangles and coordinates. (Module 6 proves the general
tangent sum formula from the sine and cosine formulas; this lesson reaches the same result by a
different road.)

## Adding two angles with coordinates

Let $\alpha = \tan^{-1}a$ and $\beta = \tan^{-1}b$, and first take $a$ and $b$ positive. Build the
picture in two steps.

1. Mark $O = (0, 0)$, $A = (1, 0)$ and $B = (1, a)$. Triangle $OAB$ has a right angle at $A$,
   adjacent side 1 and opposite side $a$, so the angle at $O$ is $\alpha$.
2. At $B$, step off at a right angle to $OB$, turning counterclockwise, a distance equal to $b$ times
   the length $OB$. Call the end point $C$. Triangle $OBC$ has a right angle at $B$ and
   $\tfrac{\text{opposite}}{\text{adjacent}} = \tfrac{BC}{OB} = b$, so the angle at $O$ between $OB$ and $OC$ is $\beta$.

![Two right triangles stacked at the origin O. The lower triangle OAB has a right angle at A = (1, 0), a side of length 1 along the x-axis and a vertical side a up to B = (1, a); its angle at O is α. The upper triangle OBC has a right angle at B, with BC = b times OB, ending at C = (1 − ab, a + b); its angle at O is β.](images/trig-m5-arctan-construction.svg)

So the angle from the positive $x$-axis to $OC$ is $\alpha + \beta$. To find $C$, note that turning the
vector $(1, a)$ a quarter turn counterclockwise gives $(-a, 1)$, which has the same length as $OB$.
Moving $b$ of those from $B$:

$$C = (1, a) + b(-a, 1) = (1 - ab,\; a + b).$$

The result: **$\alpha + \beta$ is the direction angle of the point $(1 - ab, a + b)$.** The same
construction works when $a$ or $b$ is negative (the triangles then open clockwise), so the
statement holds for all real $a$ and $b$. Since each of $\alpha$ and $\beta$ lies strictly between $-\tfrac{\pi}{2}$ and
$\tfrac{\pi}{2}$, their sum lies strictly between $-\pi$ and $\pi$.

## The arctangent addition formula

The tangent of the direction angle of $(x, y)$ is $\tfrac{y}{x}$, so
$$\tan(\alpha + \beta) = \frac{a + b}{1 - ab} \qquad (ab \ne 1).$$
To turn this into a statement about $\alpha + \beta$ itself, look at the sign of $1 - ab$, the
$x$-coordinate of $C$. This gives the **arctangent addition formula**:

| Case | Where $C$ is | $\tan^{-1}a + \tan^{-1}b$ |
|---|---|---|
| $ab < 1$ | right half-plane | $\tan^{-1}\dfrac{a + b}{1 - ab}$ |
| $ab > 1$, $a > 0$ | quadrant II | $\tan^{-1}\dfrac{a + b}{1 - ab} + \pi$ |
| $ab > 1$, $a < 0$ | quadrant III | $\tan^{-1}\dfrac{a + b}{1 - ab} - \pi$ |
| $ab = 1$ | on the $y$-axis | $\tfrac{\pi}{2}$ if $a > 0$, $-\tfrac{\pi}{2}$ if $a < 0$ |

When $ab > 1$, $a$ and $b$ have the same sign, so the sign of $a$ tells you whether $C$ is above or
below the $x$-axis. The correction is needed because the calculator's $\tan^{-1}$ only reports
angles in the right half-plane; you will meet the same quadrant check again for the direction
angles of vectors and for polar coordinates.

Replacing $b$ by $-b$ (and using $\tan^{-1}(-b) = -\tan^{-1}b$) gives the difference version:
$$\tan^{-1}a - \tan^{-1}b = \tan^{-1}\frac{a - b}{1 + ab} \qquad \text{when } ab > -1.$$

### Example 1: a famous sum

Show that $\tan^{-1}\tfrac12 + \tan^{-1}\tfrac13 = \tfrac{\pi}{4}$.

Here $ab = \tfrac16 < 1$, so the first row applies:
$$\frac{a + b}{1 - ab} = \frac{\tfrac12 + \tfrac13}{1 - \tfrac16} = \frac{\tfrac56}{\tfrac56} = 1, \qquad \tan^{-1}1 = \frac{\pi}{4}.$$

A grid gives a proof you can see. The segment from $O$ to $A(6, 2)$ has slope $\tfrac13$, so it makes
the angle $\tan^{-1}\tfrac13$ with the $x$-axis. The segment from $A$ to $D(5, 5)$ has slope $-3$, the negative
reciprocal, so the angle at $A$ is a right angle. In the right triangle $OAD$, $OA = \sqrt{40} = 2\sqrt{10}$ and
$AD = \sqrt{10}$, so the angle at $O$ has tangent $\tfrac{\sqrt{10}}{2\sqrt{10}} = \tfrac12$. The two angles together reach $D$,
which lies on the line $y = x$: a $45^\circ$ angle.

![A square grid from 0 to 6 across and 0 to 5 up. From the origin O, one segment goes to A(6, 2) and another to D(5, 5); segment AD meets OA at a right angle. The angle between the x-axis and OA is marked tan⁻¹(1/3), and the angle between OA and OD is marked tan⁻¹(1/2). Together they make the 45° angle up to the diagonal.](images/trig-m5-grid-pi4.svg)

### Example 2: when the plain formula lies

Evaluate $\tan^{-1}2 + \tan^{-1}3$.

The plain formula gives $\tan^{-1}\tfrac{2 + 3}{1 - 6} = \tan^{-1}(-1) = -\tfrac{\pi}{4}$, a negative angle, which is
impossible for the sum of two positive angles. Here $ab = 6 > 1$, so $C = (1 - 6,\, 5) = (-5, 5)$ is in
quadrant II and we must add $\pi$:
$$\tan^{-1}2 + \tan^{-1}3 = -\tfrac{\pi}{4} + \pi = \tfrac{3\pi}{4}.$$
Check numerically: $1.1071 + 1.2490 = 2.3562 \approx \tfrac{3\pi}{4}$. Adding $\tan^{-1}1 = \tfrac{\pi}{4}$ gives a surprising
identity: $\tan^{-1}1 + \tan^{-1}2 + \tan^{-1}3 = \pi$.

### Example 3: reciprocals

Find $\tan^{-1}x + \tan^{-1}\tfrac1x$ for $x \ne 0$.

The product is $x \cdot \tfrac1x = 1$, the last row of the table: the sum is $\tfrac{\pi}{2}$ when $x > 0$ and $-\tfrac{\pi}{2}$
when $x < 0$. For $x > 0$ this is no surprise: in a right triangle with legs $x$ and 1, the two
acute angles are $\tan^{-1}x$ and $\tan^{-1}\tfrac1x$, and they are complementary. The graph of the sum is
two flat pieces with a jump at 0.

```plot
{"x": [-5, 5], "y": [-2.2, 2.2], "functions": [{"f": "atan(x) + atan(1/x)", "from": 0.01, "to": 5}, {"f": "atan(x) + atan(1/x)", "from": -5, "to": -0.01}], "labels": [{"at": [3, 1.8], "text": "x > 0: π/2"}, {"at": [-3, -1.35], "text": "x < 0: −π/2"}], "points": [{"at": [0, 1.5708], "open": true}, {"at": [0, -1.5708], "open": true}], "caption": "y = tan⁻¹ x + tan⁻¹(1/x) is constant on each side of 0"}
```

## Doubling, and Machin's formula

With $b = a$ and $a^2 < 1$ the first row gives a doubling rule:
$$2\tan^{-1}a = \tan^{-1}\frac{2a}{1 - a^2} \qquad (-1 < a < 1).$$

In 1706 the English astronomer John Machin found the identity now called **Machin's formula**:
$$\frac{\pi}{4} = 4\tan^{-1}\frac15 - \tan^{-1}\frac{1}{239}.$$

### Example 4: checking Machin's formula exactly

Let $\theta = \tan^{-1}\tfrac15$. Double twice, each time with an input below 1:
$$\tan 2\theta = \frac{2 \cdot \tfrac15}{1 - \tfrac{1}{25}} = \frac{\tfrac25}{\tfrac{24}{25}} = \frac{5}{12}, \qquad \tan 4\theta = \frac{2 \cdot \tfrac{5}{12}}{1 - \tfrac{25}{144}} = \frac{\tfrac56}{\tfrac{119}{144}} = \frac{120}{119}.$$
So $4\theta = \tan^{-1}\tfrac{120}{119}$. Now subtract with the difference formula ($ab = \tfrac{120}{119 \cdot 239} > -1$):
$$\frac{\tfrac{120}{119} - \tfrac{1}{239}}{1 + \tfrac{120}{119 \cdot 239}} = \frac{120 \cdot 239 - 119}{119 \cdot 239 + 120} = \frac{28\,561}{28\,561} = 1.$$
The result is $\tan^{-1}1 = \tfrac{\pi}{4}$. (The common value is $28\,561 = 13^4$, which is why the numbers work out
so neatly.)

## Why this computes π

Calculus proves the **arctangent series**: for $-1 \le x \le 1$,
$$\tan^{-1}x = x - \frac{x^3}{3} + \frac{x^5}{5} - \frac{x^7}{7} + \cdots$$
In Europe it is credited to James Gregory (1671) and Gottfried Leibniz (1670s); the series was
already known to the Kerala school in India, whose texts credit Madhava of Sangamagrama
(about 1400). Putting $x = 1$ gives $\tfrac{\pi}{4} = 1 - \tfrac13 + \tfrac15 - \cdots$, which is beautiful but nearly useless:
even 1,000 terms give $\pi \approx 3.1406$, still wrong in the third decimal place.

Small inputs fix this. With $x = \tfrac15$ each term is less than $\tfrac{1}{25}$ the size of the one before, and with
$x = \tfrac{1}{239}$ the terms shrink more than 50,000 times at each step. That is the point of Machin's
formula: it trades the slow $\tan^{-1}1$ for two fast series.

### Example 5: π from a handful of terms

Use three terms of the series for $\tan^{-1}\tfrac15$ and one term for $\tan^{-1}\tfrac{1}{239}$.
$$\tan^{-1}\tfrac15 \approx 0.2 - \tfrac{0.008}{3} + \tfrac{0.00032}{5} = 0.2 - 0.0026667 + 0.000064 = 0.1973973,$$
$$\tan^{-1}\tfrac{1}{239} \approx \tfrac{1}{239} \approx 0.0041841.$$
Then $\pi \approx 4\left(4 \times 0.1973973 - 0.0041841\right) = 4 \times 0.7854052 \approx 3.14162$, already correct to four
decimal places ($\pi = 3.14159\ldots$). Four terms of the first series would give $3.1415917$.

With his formula, Machin computed $\pi$ to 100 decimal places by hand. Formulas of this kind, now
called **Machin-like formulas**, carried the record for more than two centuries: William Shanks pushed one to 707
places in 1873 (an error in the 528th place spoiled the rest, and was found only in 1946), and in
1949 the ENIAC computer used Machin's formula to find 2,037 digits. (This history is simplified; the
records also used other arctangent identities of the same kind.)

## Common mistakes

- **Using $\tan^{-1}\tfrac{a + b}{1 - ab}$ without checking $ab$.** When $ab > 1$ the answer is off by $\pi$:
  $\tan^{-1}2 + \tan^{-1}3$ is $\tfrac{3\pi}{4}$, not $-\tfrac{\pi}{4}$.
- **Adding the inputs.** $\tan^{-1}a + \tan^{-1}b$ is not $\tan^{-1}(a + b)$: $\tan^{-1}\tfrac12 + \tan^{-1}\tfrac13 = \tfrac{\pi}{4}$, but
  $\tan^{-1}\tfrac56 \approx 0.6947$.
- **Doubling the input.** $2\tan^{-1}a$ is $\tan^{-1}\tfrac{2a}{1 - a^2}$ (for $|a| < 1$), not $\tan^{-1}2a$.
- **Mixing degrees and radians** when checking numerically. The series and Machin's formula need
  radians.

## Key points

- $\tan^{-1}a + \tan^{-1}b$ is the direction angle of the point $(1 - ab, a + b)$, and it lies in $(-\pi, \pi)$.
- If $ab < 1$: $\tan^{-1}a + \tan^{-1}b = \tan^{-1}\tfrac{a + b}{1 - ab}$. If $ab > 1$: add $\pi$ when $a > 0$, subtract
  $\pi$ when $a < 0$. If $ab = 1$: $\pm\tfrac{\pi}{2}$.
- $\tan^{-1}a - \tan^{-1}b = \tan^{-1}\tfrac{a - b}{1 + ab}$ when $ab > -1$; $2\tan^{-1}a = \tan^{-1}\tfrac{2a}{1 - a^2}$ when $|a| < 1$.
- Machin's formula $\tfrac{\pi}{4} = 4\tan^{-1}\tfrac15 - \tan^{-1}\tfrac{1}{239}$ plus the arctangent series gives $\pi$ quickly,
  because small inputs make the series converge fast.
