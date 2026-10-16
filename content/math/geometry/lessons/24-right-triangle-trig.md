---
id: geo-trig
module: geo-m6
title: Sine, cosine and tangent
minutes: 35
topics: [Trigonometric ratios, Solving right triangles]
drills: [geo-trig-side, geo-trig-angle, geo-elevation]
refs: [geo-ref-coord]
---
Special right triangles handle $30^\circ$, $45^\circ$ and $60^\circ$. What about a $37^\circ$ angle? Similarity gives the key: every right triangle with a $37^\circ$ angle is similar to every other (AA), so the *ratios* of its sides are fixed numbers that depend only on the angle. Those ratios are the trigonometric ratios. This lesson defines them, uses them to find missing sides and angles, and applies them to angles of elevation and depression.

## The three ratios

In a right triangle, pick one acute angle $\theta$. Relative to $\theta$, the sides are:

- the **hypotenuse** (opposite the right angle),
- the **opposite** leg (across from $\theta$), and
- the **adjacent** leg (next to $\theta$, not the hypotenuse).

```shape
{"polygons": [{"points": [[0, 0], [8, 0], [8, 5]]}], "rightAngles": [[[8, 0], [0, 0], [8, 5]]], "segments": [{"from": [0, 0], "to": [8, 0], "label": "adjacent"}, {"from": [8, 0], "to": [8, 5]}, {"from": [8, 5], "to": [0, 0], "label": "hypotenuse"}], "labels": [{"at": [1.6, 0.45], "text": "θ"}, {"at": [9.4, 2.5], "text": "opposite"}]}
```

The **trigonometric ratios** of $\theta$ are

$$\sin\theta = \frac{\text{opposite}}{\text{hypotenuse}}, \qquad \cos\theta = \frac{\text{adjacent}}{\text{hypotenuse}}, \qquad \tan\theta = \frac{\text{opposite}}{\text{adjacent}}.$$

The memory aid **SOH-CAH-TOA** packs these together: SOH is Sine = Opposite / Hypotenuse, CAH is Cosine = Adjacent / Hypotenuse, and TOA is Tangent = Opposite / Adjacent.

Because the hypotenuse is the longest side, $\sin\theta$ and $\cos\theta$ are always between 0 and 1 for acute angles. $\tan\theta$ can be any positive number.

### Exact values from special triangles

From the 30°-60°-90° ($1 : \sqrt3 : 2$) and 45°-45°-90° ($1 : 1 : \sqrt2$) triangles:

| $\theta$ | $\sin\theta$ | $\cos\theta$ | $\tan\theta$ |
|---|---|---|---|
| $30^\circ$ | $\tfrac12$ | $\tfrac{\sqrt3}{2}$ | $\tfrac{\sqrt3}{3}$ |
| $45^\circ$ | $\tfrac{\sqrt2}{2}$ | $\tfrac{\sqrt2}{2}$ | $1$ |
| $60^\circ$ | $\tfrac{\sqrt3}{2}$ | $\tfrac12$ | $\sqrt3$ |

Notice $\sin 30^\circ = \cos 60^\circ$. In general, $\sin\theta = \cos(90^\circ - \theta)$: the side opposite one acute angle is adjacent to the other, and the two acute angles are complementary. That's where the name **cosine** ("complement's sine") comes from.

## Finding a side

Choose the ratio that uses the known side and the side you want, then solve. Make sure your calculator is in *degree* mode.

### Example 1

In right $\triangle ABC$ with the right angle at $C$, $m\angle A = 34^\circ$ and hypotenuse $AB = 15$. Find $BC$ and $AC$.

**Step 1.** $BC$ is opposite $\angle A$; we know the hypotenuse. Use sine: $\sin 34^\circ = \tfrac{BC}{15}$, so $BC = 15\sin 34^\circ \approx 15(0.5592) \approx 8.39$.

**Step 2.** $AC$ is adjacent to $\angle A$. Use cosine: $AC = 15\cos 34^\circ \approx 15(0.8290) \approx 12.44$.

**Check.** $8.39^2 + 12.44^2 \approx 70.4 + 154.8 = 225.2 \approx 15^2$ ✓.

### Example 2

A right triangle has an angle of $52^\circ$ whose adjacent leg is 20. Find the hypotenuse.

$\cos 52^\circ = \tfrac{20}{h}$, so $h = \tfrac{20}{\cos 52^\circ} \approx \tfrac{20}{0.6157} \approx 32.49$.

When the unknown is in the *denominator*, you divide by the trig value.

## Finding an angle: inverse ratios

If you know two sides, the **inverse trigonometric ratios** $\sin^{-1}$, $\cos^{-1}$ and $\tan^{-1}$ (also written arcsin, arccos, arctan) give the angle. For example, if $\tan A = 0.75$, then $m\angle A = \tan^{-1}(0.75) \approx 36.87^\circ$.

### Example 3

A right triangle has legs 7 and 10. Find the angle opposite the leg of length 7.

$\tan\theta = \tfrac{7}{10}$, so $\theta = \tan^{-1}(0.7) \approx 34.99^\circ \approx 35.0^\circ$. The other acute angle is about $55.0^\circ$.

*Solving a right triangle* means finding all its sides and angles. Use the angle sum ($90^\circ$ for the two acute angles), the Pythagorean theorem and the trig ratios, in whatever order is quickest.

## Angles of elevation and depression

The **angle of elevation** is the angle from the horizontal *up* to a line of sight. The **angle of depression** is from the horizontal *down*. If you look up at a bird at a $25^\circ$ angle of elevation, the bird looks down at you at a $25^\circ$ angle of depression: the two horizontals are parallel, so the angles are alternate interior angles.

```shape
{"segments": [{"from": [0, 0], "to": [12, 0]}, {"from": [12, 0], "to": [12, 5.6]}, {"from": [0, 0], "to": [12, 5.6], "dashed": true}, {"from": [12, 5.6], "to": [7, 5.6], "dashed": true}], "rightAngles": [[[12, 0], [0, 0], [12, 5.6]]], "labels": [{"at": [2.5, 0.5], "text": "elevation"}, {"at": [9.3, 6.1], "text": "depression"}], "caption": "The angle of elevation from the ground equals the angle of depression from the top."}
```

### Example 4

From a point 40 m from the base of a building, the angle of elevation to the top is $58^\circ$. How tall is the building?

$\tan 58^\circ = \tfrac{h}{40}$, so $h = 40\tan 58^\circ \approx 40(1.6003) \approx 64.0$ m.

### Example 5

A lighthouse keeper 30 m above the sea sees a boat at an angle of depression of $12^\circ$. How far is the boat from the base of the lighthouse?

The angle of elevation from the boat is also $12^\circ$. $\tan 12^\circ = \tfrac{30}{d}$, so $d = \tfrac{30}{\tan 12^\circ} \approx \tfrac{30}{0.2126} \approx 141.1$ m.

### Example 6: solving a right triangle completely

In right $\triangle PQR$ with right angle at $R$, $PR = 9$ and $QR = 14$. Find $PQ$, $m\angle P$ and $m\angle Q$.

**Step 1.** Pythagoras: $PQ = \sqrt{81 + 196} = \sqrt{277} \approx 16.64$.

**Step 2.** For $\angle P$, the opposite side is $QR = 14$ and the adjacent side is $PR = 9$: $m\angle P = \tan^{-1}\left(\tfrac{14}{9}\right) \approx 57.26^\circ$.

**Step 3.** $m\angle Q = 90 - 57.26 \approx 32.74^\circ$.

**Check.** $\sin P = \tfrac{14}{16.64} \approx 0.841$, and $\sin 57.26^\circ \approx 0.841$ ✓.

## Common mistakes

- **Calculator in radian mode.** $\sin 30$ in radians is $-0.988$, a dead giveaway.
- **Mixing up opposite and adjacent.** They depend on *which* acute angle you're using.
- **Multiplying instead of dividing** when the unknown side is in the denominator.
- **Putting the angle of depression inside the triangle at the observer.** It's measured from the horizontal, and it equals the angle of elevation at the other end.
- **Writing $\sin^{-1}x$ as $\tfrac{1}{\sin x}$.** The inverse ratio gives an angle, not a reciprocal.

## Key points

- SOH-CAH-TOA: $\sin = \tfrac{\text{opp}}{\text{hyp}}$, $\cos = \tfrac{\text{adj}}{\text{hyp}}$, $\tan = \tfrac{\text{opp}}{\text{adj}}$.
- The ratios depend only on the angle because right triangles with the same acute angle are similar.
- Use inverse ratios to find an angle from two sides.
- $\sin\theta = \cos(90^\circ - \theta)$.
- Angles of elevation and depression are measured from the horizontal and are equal (alternate interior angles).
