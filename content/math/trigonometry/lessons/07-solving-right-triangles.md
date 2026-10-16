---
id: trig-solve-right
module: trig-m2
title: Solving right triangles
minutes: 30
topics: [Solving right triangles]
drills: [trig-d-right-side, trig-d-right-angle, trig-d-solve-right]
refs: [trig-ref-unit-circle]
---
## What "solving" means

A triangle has six parts: three sides and three angles. To **solve a triangle** is to
find all six from the ones you are given. For a right triangle, one angle is already
known ($90^\circ$), so you need just two more facts, and at least one of them must be a
side. With the trig ratios from the last two lessons, every case reduces to choosing the
right ratio and doing one step of algebra.

## Standard labels

We name the vertices $A$, $B$, $C$ with the right angle at $C$, and write $a$, $b$, $c$ for
the sides *opposite* those vertices. So $c$ is the hypotenuse, $a$ is opposite angle $A$,
and $b$ is opposite angle $B$ (and adjacent to $A$).

```shape
{"polygons": [{"points": [[0, 0], [7, 0], [7, 4]]}], "rightAngles": [[[7, 0], [0, 0], [7, 4]]], "labels": [{"at": [-0.3, -0.3], "text": "A"}, {"at": [7.3, 4.2], "text": "B"}, {"at": [7.3, -0.3], "text": "C"}, {"at": [3.5, -0.45], "text": "b"}, {"at": [7.4, 2], "text": "a"}, {"at": [3.2, 2.4], "text": "c"}]}
```

Two facts hold in every right triangle and serve as checks:

- the acute angles are complementary: $A + B = 90^\circ$;
- the sides satisfy $a^2 + b^2 = c^2$, and $c$ is the longest side. The longest leg is
  across from the larger acute angle.

## Finding a side

If you know an acute angle and one side, pick the ratio that involves the known side and
the side you want, then solve.

### Example 1

Solve the right triangle with $A = 34.5^\circ$ and $c = 18.2$.

**Angle $B$:** $B = 90^\circ - 34.5^\circ = 55.5^\circ$.

**Side $a$ (opposite $A$):** the ratio linking opposite and hypotenuse is sine.
$\sin 34.5^\circ = \dfrac{a}{18.2}$, so $a = 18.2\sin 34.5^\circ \approx 10.3$.

**Side $b$ (adjacent to $A$):** cosine links adjacent and hypotenuse.
$\cos 34.5^\circ = \dfrac{b}{18.2}$, so $b = 18.2\cos 34.5^\circ \approx 15.0$.

**Check:** $10.31^2 + 15.00^2 \approx 106.3 + 225.0 = 331.3$ and $18.2^2 = 331.24$. ✓
The longer leg ($b$) is across from the larger angle ($B$). ✓

When the unknown is in the denominator, it ends up dividing. If $A = 40^\circ$ and $a = 9$,
then $\tan 40^\circ = \tfrac{9}{b}$ gives $b = \dfrac{9}{\tan 40^\circ} \approx 10.73$, not
$9\tan 40^\circ$. Writing the equation before solving prevents that mix-up.

## Finding an angle

If you know two sides, compute the ratio that uses them and then ask "which angle has
this ratio?" The calculator answers that with the **inverse trig** keys
$\sin^{-1}$, $\cos^{-1}$, $\tan^{-1}$. For an acute angle in a right triangle:

$$\sin A = k \;\Rightarrow\; A = \sin^{-1} k, \qquad \tan A = k \;\Rightarrow\; A = \tan^{-1} k.$$

(The inverse functions are studied properly in Module 5. For now, read $\sin^{-1} k$ as
"the acute angle whose sine is $k$".)

### Example 2

Solve the right triangle with legs $a = 7$ and $b = 11$.

**Hypotenuse:** $c = \sqrt{7^2 + 11^2} = \sqrt{170} \approx 13.04$.

**Angle $A$:** both legs are known, so use tangent. $\tan A = \tfrac{7}{11}$, and
$A = \tan^{-1}\!\left(\tfrac{7}{11}\right) \approx 32.47^\circ$.

**Angle $B$:** $B = 90^\circ - 32.47^\circ = 57.53^\circ$.

Using the original numbers rather than the rounded hypotenuse keeps rounding errors from
piling up. If you did use $c$, $\sin A = 7/13.04$ gives the same angle to two decimals.

## Choosing the ratio

| Known | Want | Use |
|---|---|---|
| angle, hypotenuse | opposite leg | $\sin$: $\text{opp} = \text{hyp}\sin\theta$ |
| angle, hypotenuse | adjacent leg | $\cos$: $\text{adj} = \text{hyp}\cos\theta$ |
| angle, adjacent leg | opposite leg | $\tan$: $\text{opp} = \text{adj}\tan\theta$ |
| angle, a leg | hypotenuse | $\sin$ or $\cos$, then divide |
| two legs | angle | $\tan^{-1}(\text{opp}/\text{adj})$ |
| leg and hypotenuse | angle | $\sin^{-1}$ or $\cos^{-1}$ |

### Example 3

A 20-ft ladder is safe only if it makes an angle of at most $75^\circ$ with the ground.
How high up a wall can it safely reach, and how far from the wall is its foot then?

The ladder is the hypotenuse; the height is opposite the $75^\circ$ angle, the distance
from the wall is adjacent.

Height: $20\sin 75^\circ \approx 19.32$ ft. Distance: $20\cos 75^\circ \approx 5.18$ ft.

```shape
{"polygons": [{"points": [[0, 0], [5.18, 0], [5.18, 19.32]]}], "rightAngles": [[[5.18, 0], [0, 0], [5.18, 19.32]]], "labels": [{"at": [1.0, 1.0], "text": "75°"}, {"at": [2.6, -1.1], "text": "≈ 5.18 ft"}, {"at": [7.6, 9.66], "text": "≈ 19.32 ft"}, {"at": [1.2, 10.5], "text": "20 ft"}], "caption": "The ladder at its steepest safe angle"}
```

## Rounding

Round only the final answers, and keep full calculator precision for intermediate values.
A common convention matches accuracy to the data: sides given to three significant
figures give answers to three significant figures, and angles given to the nearest tenth
of a degree give angles to the nearest tenth.

### Example 4: given the other angle

Solve the right triangle with $B = 62.4^\circ$ and $b = 15.3$.

$A = 90^\circ - 62.4^\circ = 27.6^\circ$. Side $b$ is opposite $B$, so relative to $B$:
$\tan B = \tfrac{b}{a}$ gives $a = \tfrac{15.3}{\tan 62.4^\circ} \approx 8.00$, and $\sin B = \tfrac{b}{c}$ gives
$c = \tfrac{15.3}{\sin 62.4^\circ} \approx 17.26$.

Check: $8.00^2 + 15.3^2 \approx 298.1$ and $17.26^2 \approx 297.9$, equal up to rounding. ✓

## Common mistakes

- **Multiplying when you should divide.** If the unknown is in the denominator
  ($\tan 40^\circ = 9/b$), it ends up as $9/\tan 40^\circ$.
- **Calculator in radian mode.** $\sin 34.5$ in radian mode is about $0.057$, not $0.566$.
- **Forgetting the third angle.** Once one acute angle is known, the other is $90^\circ$ minus it.
- **Using rounded values in later steps.** Carry full precision, round at the end.

## Key points

- Label with $C = 90^\circ$ and sides $a, b, c$ opposite $A, B, C$.
- Angle + side: choose the ratio connecting the known and unknown sides.
- Two sides: use the Pythagorean theorem for the third side and an inverse trig key for
  an angle.
- Check with $A + B = 90^\circ$, $a^2 + b^2 = c^2$, and "longest side opposite largest angle".
