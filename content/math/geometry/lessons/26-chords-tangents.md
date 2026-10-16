---
id: geo-chords-tangents
module: geo-m7
title: Chords and tangents
minutes: 30
topics: [Chords, Tangents]
drills: [geo-chord-dist, geo-tangent-len, geo-tangent-radius]
refs: [geo-ref-theorems]
---
Chords and tangents are the two kinds of lines most closely tied to a circle. A chord connects two points of the circle; a tangent just touches it. This lesson proves their key properties with the triangle tools you already have: congruent triangles for chords, and the Pythagorean theorem for both.

## Chords and arcs

**Congruent Chords Theorem.** In the same circle (or congruent circles), two chords are congruent if and only if their minor arcs are congruent.

*Why.* If $\overline{AB} \cong \overline{CD}$ in $\odot O$, then $\triangle AOB \cong \triangle COD$ by SSS (the other sides are radii). So the central angles $\angle AOB$ and $\angle COD$ are congruent, and so are their arcs. The converse uses SAS.

**Perpendicular Chord Bisector Theorem.** If a diameter (or radius) is perpendicular to a chord, it bisects the chord and its arc.

*Why.* Let radius $\overline{OM}$ be perpendicular to chord $\overline{AB}$ at $M$. Then $\triangle OMA$ and $\triangle OMB$ are right triangles with congruent hypotenuses $\overline{OA}$, $\overline{OB}$ (radii) and a shared leg $\overline{OM}$. By HL they're congruent, so $AM = BM$.

**Converse.** The perpendicular bisector of a chord passes through the center. (The center is equidistant from $A$ and $B$, so it lies on that bisector.) This gives a way to find the center of any circle: draw two chords and their perpendicular bisectors; they meet at the center.

**Equidistant Chords Theorem.** In the same circle, two chords are congruent if and only if they are the same distance from the center.

```shape
{"circles": [{"center": [0, 0], "r": 5}], "segments": [{"from": [-4, -3], "to": [4, -3], "label": "8"}, {"from": [0, 0], "to": [0, -3], "label": "3"}, {"from": [0, 0], "to": [4, -3], "label": "5"}], "rightAngles": [[[0, -3], [4, -3], [0, 0]]], "points": [{"at": [0, 0], "label": "O"}], "caption": "The perpendicular from the center bisects the chord: half-chord 4, distance 3, radius 5."}
```

### Example 1

A chord of length 24 is 5 units from the center of a circle. Find the radius.

**Step 1.** The perpendicular from the center bisects the chord, so half the chord is 12.

**Step 2.** Radius, half-chord and distance form a right triangle: $r = \sqrt{12^2 + 5^2} = \sqrt{169} = 13$.

### Example 2

In a circle of radius 10, how far from the center is a chord of length 12?

Half-chord 6, so distance $= \sqrt{10^2 - 6^2} = \sqrt{64} = 8$.

The longest chord is the diameter (distance 0), and chords get shorter as they move away from the center.

## Tangents

**Tangent–Radius Theorem.** A tangent to a circle is perpendicular to the radius drawn to the point of tangency. Conversely, a line perpendicular to a radius at its endpoint on the circle is tangent.

*Why (indirect).* Suppose tangent $\ell$ touches $\odot O$ at $P$ but isn't perpendicular to $\overline{OP}$. Then the perpendicular from $O$ to $\ell$ meets it at some other point $Q$, and $OQ < OP$ (the perpendicular is the shortest segment from a point to a line). So $Q$ is *inside* the circle, and a line through an interior point must cross the circle twice, contradicting that $\ell$ is a tangent.

### Example 3

$\overline{PT}$ is tangent to $\odot O$ at $T$. The radius is 9 and $PO = 15$. Find $PT$.

$\triangle OTP$ has a right angle at $T$, so $PT = \sqrt{15^2 - 9^2} = \sqrt{144} = 12$.

### Example 4: is it a tangent?

In $\odot O$ with radius 6, a segment $\overline{AB}$ touches the circle at $A$, with $AB = 8$ and $OB = 10$. Is $\overline{AB}$ tangent to the circle?

Check for a right angle at $A$: $6^2 + 8^2 = 36 + 64 = 100 = 10^2$. By the converse of the Pythagorean theorem $\angle OAB = 90^\circ$, so yes, $\overline{AB}$ is tangent.

## Two tangents from one point

**Two Tangents Theorem.** If two segments from the same exterior point are tangent to a circle, they are congruent.

*Why.* If $\overline{PA}$ and $\overline{PB}$ are tangent at $A$ and $B$, then $\triangle OAP$ and $\triangle OBP$ are right triangles (tangent ⟂ radius) with congruent legs $\overline{OA}$, $\overline{OB}$ and shared hypotenuse $\overline{OP}$. By HL, $PA = PB$.

```shape
{"circles": [{"center": [0, 0], "r": 3}], "segments": [{"from": [6, 0], "to": [1.5, 2.598]}, {"from": [6, 0], "to": [1.5, -2.598]}, {"from": [0, 0], "to": [1.5, 2.598], "dashed": true}, {"from": [0, 0], "to": [1.5, -2.598], "dashed": true}, {"from": [0, 0], "to": [6, 0], "dashed": true}], "rightAngles": [[[1.5, 2.598], [0, 0], [6, 0]], [[1.5, -2.598], [0, 0], [6, 0]]], "points": [{"at": [0, 0], "label": "O"}, {"at": [6, 0], "label": "P"}, {"at": [1.5, 2.598], "label": "A"}, {"at": [1.5, -2.598], "label": "B"}], "caption": "Tangent segments PA and PB from the same point are congruent."}
```

### Example 5

A triangle is circumscribed about a circle (each side tangent to it). From vertex $A$ the tangent segments are 4, from $B$ they are 6, and from $C$ they are 9. Find the perimeter.

Each side is made of two tangent segments from its two endpoints: $AB = 4 + 6 = 10$, $BC = 6 + 9 = 15$, $CA = 9 + 4 = 13$. Perimeter $= 38$, which is $2(4 + 6 + 9)$.

### Example 6: a belt around two pulleys

Two pulleys have radii 5 and 2, with centers 13 apart. How long is the straight stretch of belt that touches both, on the same side (a common external tangent)?

**Step 1.** Both radii to the tangent points are perpendicular to the belt, so they are parallel. Slide the belt segment toward the centers by the smaller radius: it becomes one leg of a right triangle whose hypotenuse joins the centers (13) and whose other leg is the difference of the radii, $5 - 2 = 3$.

**Step 2.** Belt length $= \sqrt{13^2 - 3^2} = \sqrt{160} = 4\sqrt{10} \approx 12.65$.

## Common mistakes

- **Using the whole chord in the right triangle.** It's *half* the chord that forms a leg.
- **Putting the right angle in the wrong place.** With a tangent, the right angle is at the point of tangency, between the tangent and the radius.
- **Making the tangent segment the hypotenuse.** The hypotenuse is the segment from the exterior point to the center.
- **Assuming a segment is tangent because it looks like it.** Check for a right angle.

## Key points

- Congruent chords ⟺ congruent arcs ⟺ equal distances from the center.
- A radius perpendicular to a chord bisects it; the perpendicular bisector of a chord passes through the center.
- Radius, half-chord and distance to the center form a right triangle.
- A tangent is perpendicular to the radius at the point of tangency.
- Two tangent segments from one exterior point are congruent.
