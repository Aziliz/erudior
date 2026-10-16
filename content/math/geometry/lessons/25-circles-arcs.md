---
id: geo-circle-basics
module: geo-m7
title: Circles, arcs and arc length
minutes: 30
topics: [Circle vocabulary, Arcs and arc length]
drills: [geo-arc-length, geo-arc-measure, geo-radians]
refs: [geo-ref-measure, geo-ref-theorems]
---
So far every figure has been built from straight segments. Circles are the first curved figure, and they have a rich theory of their own: arcs, chords, tangents and the angles they form. This lesson sets up the vocabulary, defines how arcs are measured (in degrees and in length), and introduces radian measure, which connects the two.

## Parts of a circle

A **circle** is the set of all points in a plane at a fixed distance from a fixed point, the **center**. A circle with center $P$ is called $\odot P$.

- A **radius** is a segment from the center to the circle (plural *radii*). All radii of a circle are congruent.
- A **chord** is a segment with both endpoints on the circle.
- A **diameter** is a chord through the center. Its length is $d = 2r$.
- A **secant** is a line that intersects the circle at two points.
- A **tangent** is a line in the plane of the circle that touches it at exactly one point, the **point of tangency**.

```shape
{"circles": [{"center": [0, 0], "r": 5}], "segments": [{"from": [0, 0], "to": [3, 4], "label": "radius"}, {"from": [-5, 0], "to": [5, 0], "label": "diameter"}, {"from": [-4, -3], "to": [3, -4], "label": "chord"}, {"from": [-8, 5], "to": [2, 5], "label": "tangent"}, {"from": [-7, -1.4], "to": [7, 2.8]}], "points": [{"at": [0, 0], "label": "P"}, {"at": [0, 5]}], "labels": [{"at": [7.4, 3.2], "text": "secant"}], "caption": "Parts of a circle."}
```

Circles with the same radius are **congruent circles**. Circles with the same center are **concentric circles**.

## Central angles and arcs

A **central angle** has its vertex at the center of the circle. Its sides cut the circle into two **arcs**:

- the **minor arc**, inside the angle, named with two letters: $\overset{\frown}{AB}$;
- the **major arc**, the rest, named with three letters: $\overset{\frown}{ACB}$ (where $C$ is a point on it).

If the endpoints are ends of a diameter, both arcs are **semicircles**.

**Arc measure** is in degrees:

- a minor arc's measure is the measure of its central angle;
- a major arc measures $360^\circ$ minus its minor arc;
- a semicircle measures $180^\circ$.

**Arc Addition Postulate.** The measure of an arc formed by two adjacent arcs is the sum of their measures: $m\overset{\frown}{ABC} = m\overset{\frown}{AB} + m\overset{\frown}{BC}$.

Arcs in the same circle (or congruent circles) with equal measures are **congruent arcs**.

### Example 1

In $\odot O$, $\overline{AC}$ is a diameter and $m\angle AOB = 64^\circ$, with $B$ on one side of the diameter. Find $m\overset{\frown}{AB}$, $m\overset{\frown}{BC}$ and $m\overset{\frown}{BAC}$.

**Step 1.** $m\overset{\frown}{AB} = 64^\circ$ (equal to its central angle).

**Step 2.** $\overset{\frown}{ABC}$ is a semicircle, so $m\overset{\frown}{BC} = 180 - 64 = 116^\circ$.

**Step 3.** $\overset{\frown}{BAC}$ is the major arc from $B$ through $A$ to $C$: $360 - 116 = 244^\circ$.

## Arc length

Arc *measure* is an angle; **arc length** is a distance along the circle. An arc of $\theta^\circ$ is the fraction $\tfrac{\theta}{360}$ of the whole circle, so it is that fraction of the **circumference** $C = 2\pi r$:

$$\text{arc length} = \frac{\theta}{360^\circ} \cdot 2\pi r.$$

Two arcs can have the same measure but different lengths: a $90^\circ$ arc on a dinner plate is longer than a $90^\circ$ arc on a coin.

### Example 2

Find the length of a $135^\circ$ arc in a circle of radius 8.

$\tfrac{135}{360} \cdot 2\pi(8) = \tfrac38 \cdot 16\pi = 6\pi \approx 18.85$.

### Example 3

An arc of length $10\pi$ has measure $150^\circ$. Find the radius.

$\tfrac{150}{360} \cdot 2\pi r = 10\pi$, so $\tfrac{5}{12} \cdot 2r = 10$, giving $\tfrac{5r}{6} = 10$ and $r = 12$.

## Radian measure

Because arc length is proportional to the radius, the ratio $\tfrac{\text{arc length}}{r}$ depends only on the angle. That ratio is the angle's **radian** measure:

$$\theta_{\text{radians}} = \frac{s}{r}.$$

A full circle has arc length $2\pi r$, so a full turn is $2\pi$ radians. That gives the conversion

$$360^\circ = 2\pi \text{ rad}, \qquad 180^\circ = \pi \text{ rad}.$$

To convert degrees to radians multiply by $\tfrac{\pi}{180}$; radians to degrees multiply by $\tfrac{180}{\pi}$. For example, $90^\circ = \tfrac{\pi}{2}$ and $60^\circ = \tfrac{\pi}{3}$. One radian is about $57.3^\circ$: the angle whose arc is exactly one radius long.

With radians, arc length takes its simplest form: $s = r\theta$.

### Example 4

A wheel of radius 0.35 m turns through $3$ radians. How far does a point on its rim travel?

$s = r\theta = 0.35 \cdot 3 = 1.05$ m.

### Example 5: a clock

The minute hand of a clock is 12 cm long. How far does its tip travel between 3:00 and 3:25?

**Step 1.** In 25 minutes the hand turns $\tfrac{25}{60}$ of a full turn, which is $\tfrac{25}{60} \cdot 360^\circ = 150^\circ$.

**Step 2.** Arc length $= \tfrac{150}{360} \cdot 2\pi(12) = 10\pi \approx 31.42$ cm.

**Step 3 (radians).** $150^\circ = \tfrac{5\pi}{6}$, and $s = r\theta = 12 \cdot \tfrac{5\pi}{6} = 10\pi$, the same answer.

Notice that degree measure answers "how far around?" while arc length answers "how far along?". The first ignores the size of the circle; the second depends on it.

## Common mistakes

- **Confusing arc measure with arc length.** Measure is in degrees (or radians); length is in units of distance.
- **Naming a major arc with two letters.** Use three to show which way around.
- **Using the diameter in $2\pi r$.** Either $\pi d$ or $2\pi r$, not $2\pi d$.
- **Mixing degrees and radians.** $s = r\theta$ needs $\theta$ in radians.

## Key points

- Radius, diameter ($2r$), chord, secant and tangent are the basic parts.
- A minor arc equals its central angle; a major arc is $360^\circ$ minus the minor arc; a semicircle is $180^\circ$.
- Arc length $= \tfrac{\theta}{360} \cdot 2\pi r$, or $s = r\theta$ with $\theta$ in radians.
- $180^\circ = \pi$ radians.
