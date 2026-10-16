---
id: trig-special
module: trig-m2
title: Special right triangles and cofunctions
minutes: 30
topics: [Special angles, Cofunctions]
drills: [trig-d-special-sides, trig-d-exact-special]
refs: [trig-ref-unit-circle]
---
## Why some angles are special

For most angles, $\sin\theta$ is an endless decimal that you need a calculator for. For
three angles, $30^\circ$, $45^\circ$ and $60^\circ$, the trig ratios can be found exactly
with nothing but the Pythagorean theorem. These **exact values** come up constantly: in
graphs, in identities, in physics problems, and on every test that bans calculators. This
lesson derives them so you can rebuild them any time instead of memorizing a table.

## The 45°–45°–90° triangle

Cut a square of side 1 along its diagonal. Each half is a right triangle with two equal
legs of length 1 and two $45^\circ$ angles. By the Pythagorean theorem, the hypotenuse is
$\sqrt{1^2 + 1^2} = \sqrt{2}$.

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [4, 4]]}], "rightAngles": [[[4, 0], [0, 0], [4, 4]]], "labels": [{"at": [1.0, 0.35], "text": "45°"}, {"at": [3.6, 2.9], "text": "45°"}, {"at": [2, -0.45], "text": "1"}, {"at": [4.4, 2], "text": "1"}, {"at": [1.6, 2.4], "text": "√2"}], "caption": "The 45°–45°–90° triangle: sides 1 : 1 : √2"}
```

So in every **45°–45°–90° triangle** the sides are in the ratio $1 : 1 : \sqrt2$:
the hypotenuse is $\sqrt2$ times a leg. Reading off the ratios,
$$\sin 45^\circ = \cos 45^\circ = \frac{1}{\sqrt2} = \frac{\sqrt2}{2}, \qquad \tan 45^\circ = 1.$$
Writing $\tfrac{1}{\sqrt2}$ as $\tfrac{\sqrt2}{2}$ is called rationalizing the denominator.
Both forms are correct; $\tfrac{\sqrt2}{2}$ is the conventional one.

## The 30°–60°–90° triangle

Start with an equilateral triangle of side 2: all angles are $60^\circ$. Drop an altitude
from the top vertex. It bisects the base (into two pieces of length 1) and the top angle
(into two $30^\circ$ angles). Each half is a right triangle with hypotenuse 2, short leg 1,
and long leg $\sqrt{2^2 - 1^2} = \sqrt3$.

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [2, 3.4641]]}], "segments": [{"from": [2, 0], "to": [2, 3.4641], "dashed": true}], "rightAngles": [[[2, 0], [4, 0], [2, 3.4641]]], "labels": [{"at": [0.7, 0.3], "text": "60°"}, {"at": [1.75, 2.6], "text": "30°"}, {"at": [1, -0.4], "text": "1"}, {"at": [3, -0.4], "text": "1"}, {"at": [0.6, 1.9], "text": "2"}, {"at": [2.4, 1.5], "text": "√3"}], "caption": "Half an equilateral triangle of side 2 is a 30°–60°–90° triangle"}
```

In every **30°–60°–90° triangle** the sides are in the ratio $1 : \sqrt3 : 2$
(short leg : long leg : hypotenuse). The short leg is opposite the $30^\circ$ angle and is
half the hypotenuse; the long leg is opposite $60^\circ$ and is $\sqrt3$ times the short leg.

From the $30^\circ$ angle: opposite $= 1$, adjacent $= \sqrt3$, hypotenuse $= 2$.
From the $60^\circ$ angle the legs swap roles.

| $\theta$ | $\sin\theta$ | $\cos\theta$ | $\tan\theta$ |
|---|---|---|---|
| $30^\circ = \frac{\pi}{6}$ | $\frac12$ | $\frac{\sqrt3}{2}$ | $\frac{1}{\sqrt3} = \frac{\sqrt3}{3}$ |
| $45^\circ = \frac{\pi}{4}$ | $\frac{\sqrt2}{2}$ | $\frac{\sqrt2}{2}$ | $1$ |
| $60^\circ = \frac{\pi}{3}$ | $\frac{\sqrt3}{2}$ | $\frac12$ | $\sqrt3$ |

A pattern helps with recall: the sines of $30^\circ, 45^\circ, 60^\circ$ are
$\tfrac{\sqrt1}{2}, \tfrac{\sqrt2}{2}, \tfrac{\sqrt3}{2}$, and the cosines are the same list
backward. The reciprocals follow: $\csc 30^\circ = 2$, $\sec 30^\circ = \tfrac{2}{\sqrt3} = \tfrac{2\sqrt3}{3}$,
$\cot 60^\circ = \tfrac{\sqrt3}{3}$, and so on.

### Example 1

A 30°–60°–90° triangle has hypotenuse 10. Find both legs.

The short leg is half the hypotenuse: $5$. The long leg is $\sqrt3$ times the short leg:
$5\sqrt3 \approx 8.66$. Check: $5^2 + (5\sqrt3)^2 = 25 + 75 = 100 = 10^2$. ✓

### Example 2

The hypotenuse of a 45°–45°–90° triangle is 8. Find each leg.

The hypotenuse is $\sqrt2$ times a leg, so a leg is $\dfrac{8}{\sqrt2} = \dfrac{8\sqrt2}{2} = 4\sqrt2 \approx 5.66$.
Going the other way, a leg of 7 gives a hypotenuse of $7\sqrt2$.

### Example 3

Find the exact value of $2\sin 30^\circ + \sqrt3\tan 60^\circ - \cos^2 45^\circ$.

Substitute exact values: $2\cdot\tfrac12 + \sqrt3\cdot\sqrt3 - \left(\tfrac{\sqrt2}{2}\right)^2 = 1 + 3 - \tfrac{2}{4} = \tfrac72$.

The notation $\cos^2 45^\circ$ means $(\cos 45^\circ)^2$, not $\cos(45^2)$.

## Cofunctions

In a right triangle the two acute angles add to $90^\circ$, so they are complementary. The
side opposite one is adjacent to the other. That swaps sine with cosine, tangent with
cotangent, and secant with cosecant:

$$\sin\theta = \cos(90^\circ - \theta), \quad \tan\theta = \cot(90^\circ - \theta), \quad \sec\theta = \csc(90^\circ - \theta),$$

and the same with the roles reversed. These are the **cofunction identities**; in radians,
replace $90^\circ$ with $\tfrac{\pi}{2}$. The name tells the story: **cosine** is the
*complement's sine*. Sine and cosine (and each pair of a function and its "co-" partner)
are called **cofunctions**.

### Example 4

Find an acute angle $\theta$ with $\cos\theta = \sin 25^\circ$, and rewrite $\tan 72^\circ$
using a cofunction.

$\sin 25^\circ = \cos(90^\circ - 25^\circ) = \cos 65^\circ$, so $\theta = 65^\circ$.
$\tan 72^\circ = \cot 18^\circ$.

### Example 5: an equilateral triangle from its height

An equilateral triangle has an altitude of 6. Find its side length and area exactly.

The altitude splits it into two 30°–60°–90° triangles in which the altitude is the long leg.
So the short leg is $\tfrac{6}{\sqrt3} = 2\sqrt3$ and the hypotenuse, which is a full side, is $4\sqrt3$.
Area $= \tfrac12 \cdot \text{base} \cdot \text{height} = \tfrac12 \cdot 4\sqrt3 \cdot 6 = 12\sqrt3 \approx 20.78$.

## When to use exact values

Exact values matter whenever later steps would magnify rounding errors, or when a pattern
would be hidden by decimals. $\sin 60^\circ \approx 0.866$ is fine for measuring a roof, but writing
$\tfrac{\sqrt3}{2}$ makes it obvious that $\sin^2 60^\circ = \tfrac34$ exactly, which the decimal $0.749956$ only suggests.

## Common mistakes

- **Mixing up which leg goes with which angle.** The short leg is always opposite the
  smallest angle ($30^\circ$). If $\sin 30^\circ$ comes out bigger than $\sin 60^\circ$,
  something is swapped.
- **Doubling instead of halving.** In a 30°–60°–90° triangle the hypotenuse is *twice*
  the short leg, so the short leg is *half* the hypotenuse.
- **Thinking $\tan 30^\circ = \sqrt3$.** $\tan 30^\circ = \tfrac{1}{\sqrt3}$; $\tan 60^\circ = \sqrt3$.
  Small angles have small tangents.
- **Reading $\sin^2\theta$ as $\sin(\theta^2)$.**

## Key points

- 45°–45°–90°: sides $1 : 1 : \sqrt2$. 30°–60°–90°: sides $1 : \sqrt3 : 2$.
- $\sin 30^\circ = \tfrac12$, $\sin 45^\circ = \tfrac{\sqrt2}{2}$, $\sin 60^\circ = \tfrac{\sqrt3}{2}$;
  cosines are the same list reversed.
- $\tan 30^\circ = \tfrac{\sqrt3}{3}$, $\tan 45^\circ = 1$, $\tan 60^\circ = \sqrt3$.
- Cofunction identities: a function of $\theta$ equals its cofunction of $90^\circ - \theta$.
