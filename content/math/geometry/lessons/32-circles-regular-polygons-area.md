---
id: geo-area-circle
module: geo-m8
title: Circles, sectors and regular polygons
minutes: 30
topics: [Area of circles and sectors, Regular polygons]
drills: [geo-sector-area, geo-reg-poly-area, geo-circle-area]
refs: [geo-ref-measure]
---
The polygon formulas from the last lesson all came from cutting and rearranging straight pieces. A circle has no straight pieces, so finding its area takes a new idea: approximate it with polygons and see what happens as the pieces get thinner. Along the way we get the area of any regular polygon, using a new segment called the apothem.

## Circumference

The ratio of a circle's circumference to its diameter is the same for every circle (all circles are similar; Lesson 38 proves it). That constant is $\pi \approx 3.14159$. So

$$C = \pi d = 2\pi r.$$

## Area of a circle

Cut a circle into many equal wedges and lay them out alternately point-up and point-down. The result looks more and more like a parallelogram (almost a rectangle) as the wedges get thinner. Its height is the radius $r$ and its base is half the circumference, $\pi r$. So

$$A = \pi r \cdot r = \pi r^2.$$

### Example 1

A circle has circumference $18\pi$. Find its area.

**Step 1.** $2\pi r = 18\pi$, so $r = 9$.

**Step 2.** $A = \pi(9)^2 = 81\pi \approx 254.47$.

## Sectors and segments

A **sector** is the region between two radii and their arc, a slice of pie. A sector with central angle $\theta^\circ$ is $\tfrac{\theta}{360}$ of the circle, so

$$A_{\text{sector}} = \frac{\theta}{360^\circ} \cdot \pi r^2 \qquad \left(\text{or } \tfrac12 r^2\theta \text{ with } \theta \text{ in radians}\right).$$

A **segment of a circle** is the region between a chord and its arc. Its area is the sector minus the triangle formed by the two radii and the chord.

```shape
{"circles": [{"center": [0, 0], "r": 5}], "polygons": [{"points": [[0, 0], [5, 0], [2.5, 4.33]], "fill": true}], "curves": [{"x": "5cos(t)", "y": "5sin(t)", "t": [0, 1.0472]}], "labels": [{"at": [1.2, 0.5], "text": "60°"}], "caption": "A 60° sector: the shaded triangle plus the thin segment between the chord and arc."}
```

### Example 2

Find the area of a $60^\circ$ sector and the corresponding segment in a circle of radius 6.

**Step 1.** Sector: $\tfrac{60}{360} \cdot 36\pi = 6\pi \approx 18.85$.

**Step 2.** The triangle has two sides 6 and a $60^\circ$ included angle, so it's equilateral with area $\tfrac{\sqrt3}{4} \cdot 36 = 9\sqrt3 \approx 15.59$.

**Step 3.** Segment $= 6\pi - 9\sqrt3 \approx 3.26$.

## Regular polygons and the apothem

For a regular polygon:

- the **center** is the common center of its inscribed and circumscribed circles;
- the **radius** is the distance from the center to a vertex;
- the **apothem** $a$ is the distance from the center to a side (perpendicular to it);
- the **central angle** is $\tfrac{360^\circ}{n}$.

Segments from the center to every vertex cut a regular $n$-gon into $n$ congruent isosceles triangles, each with base $s$ (a side) and height $a$. Their total area is $n \cdot \tfrac12 sa = \tfrac12 a(ns)$, and $ns$ is the perimeter $P$:

$$A = \tfrac12 aP.$$

```shape
{"polygons": [{"points": [[5, 0], [2.5, 4.33], [-2.5, 4.33], [-5, 0], [-2.5, -4.33], [2.5, -4.33]]}], "segments": [{"from": [0, 0], "to": [3.75, 2.165], "dashed": true, "label": "a"}, {"from": [0, 0], "to": [5, 0], "dashed": true, "label": "r"}], "rightAngles": [[[3.75, 2.165], [5, 0], [0, 0]]], "points": [{"at": [0, 0]}], "caption": "A regular hexagon with apothem a and radius r."}
```

To find the apothem, use the right triangle formed by the apothem, half a side, and a radius. The angle at the center in that triangle is half the central angle, $\tfrac{180^\circ}{n}$, so

$$a = \frac{s/2}{\tan(180^\circ/n)}.$$

### Example 3

Find the area of a regular hexagon with side 10.

**Step 1.** The central angle is $60^\circ$; half is $30^\circ$. The right triangle has short leg 5 (half a side), so the apothem is the long leg of a 30°-60°-90° triangle: $a = 5\sqrt3$.

**Step 2.** Perimeter $P = 60$.

**Step 3.** $A = \tfrac12 \cdot 5\sqrt3 \cdot 60 = 150\sqrt3 \approx 259.81$.

### Example 4

Find the area of a regular pentagon with side 8.

**Step 1.** Half the central angle is $\tfrac{180}{5} = 36^\circ$. So $a = \dfrac{4}{\tan 36^\circ} \approx \dfrac{4}{0.7265} \approx 5.506$.

**Step 2.** $P = 40$, so $A = \tfrac12 \cdot 5.506 \cdot 40 \approx 110.11$.

## Why the circle formula fits

A circle is the limit of regular polygons with more and more sides. As $n$ grows, the apothem approaches $r$ and the perimeter approaches $2\pi r$, so $\tfrac12 aP$ approaches $\tfrac12 \cdot r \cdot 2\pi r = \pi r^2$, matching the wedge argument.

## Shaded regions

Many problems ask for the area of a shaded region: find the area of the whole shape and subtract the unshaded part.

### Example 5: a ring

A circular path (an **annulus**) runs between circles of radius 10 m and 12 m. Find its area.

$A = \pi(12^2) - \pi(10^2) = 144\pi - 100\pi = 44\pi \approx 138.23$ m². Note it's *not* $\pi(12 - 10)^2 = 4\pi$; subtract areas, not radii.

### Example 6: a circle in a square

A circle is inscribed in a square of side 8. Find the area inside the square but outside the circle.

**Step 1.** The circle's diameter equals the side, so $r = 4$.

**Step 2.** $64 - 16\pi \approx 64 - 50.27 = 13.73$.

That leftover is about 21% of the square, a handy fact: a circle fills $\tfrac{\pi}{4} \approx 78.5\%$ of the square around it.

## Common mistakes

- **Using the diameter in $\pi r^2$.** Halve it first.
- **Confusing the apothem with the radius.** The apothem goes to the *middle of a side*; the radius goes to a *vertex*.
- **Using the full central angle** in the apothem triangle; use half of it.
- **Forgetting to subtract the triangle** when finding a segment's area.

## Key points

- $C = 2\pi r$ and $A = \pi r^2$.
- Sector area $= \tfrac{\theta}{360} \pi r^2$; segment area $=$ sector $-$ triangle.
- Regular polygon: $A = \tfrac12 aP$, with apothem $a = \tfrac{s/2}{\tan(180^\circ/n)}$.
