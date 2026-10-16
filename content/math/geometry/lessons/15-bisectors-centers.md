---
id: geo-bisectors
module: geo-m5
title: Perpendicular bisectors, angle bisectors and their centers
minutes: 30
topics: [Bisectors, Points of concurrency]
drills: [geo-perp-bis-alg, geo-circumcenter, geo-incenter-dist]
refs: [geo-ref-theorems]
---
Every triangle has four special "centers", each where three special lines meet. This lesson covers the two that come from bisectors: the circumcenter (from perpendicular bisectors of the sides) and the incenter (from bisectors of the angles). Each answers a practical question. Where should a cell tower go to be equally far from three towns? Where is the largest circle that fits inside a triangular garden? The proofs use the congruence tools from Module 4.

## Perpendicular bisectors

The **perpendicular bisector** of a segment is the line perpendicular to the segment at its midpoint.

**Perpendicular Bisector Theorem.** If a point is on the perpendicular bisector of a segment, it is **equidistant** (equally distant) from the segment's endpoints.

*Proof.* Let $\ell$ be the perpendicular bisector of $\overline{AB}$ at $M$, and $P$ any point on $\ell$. Then $AM = BM$, the right angles at $M$ are congruent, and $PM = PM$. So $\triangle PMA \cong \triangle PMB$ by SAS, and $PA = PB$ by CPCTC. $\blacksquare$

**Converse.** If a point is equidistant from the endpoints of a segment, it lies on the segment's perpendicular bisector.

Together: the perpendicular bisector of $\overline{AB}$ is *exactly* the set of points equidistant from $A$ and $B$. A set of points described by a condition like this is called a **locus**.

### Example 1

$P$ lies on the perpendicular bisector of $\overline{AB}$. $PA = 4x - 7$ and $PB = 2x + 11$. Find $PA$.

$P$ is equidistant from $A$ and $B$: $4x - 7 = 2x + 11$, so $x = 9$ and $PA = 29$.

## The circumcenter

Three or more lines that meet at one point are **concurrent**, and the point where they meet is a **point of concurrency**.

**Circumcenter Theorem.** The perpendicular bisectors of the sides of a triangle are concurrent at a point, the **circumcenter**, which is equidistant from the three vertices.

*Why.* Let the perpendicular bisectors of $\overline{AB}$ and $\overline{BC}$ meet at $O$. Then $OA = OB$ (first bisector) and $OB = OC$ (second). So $OA = OC$, and by the converse $O$ is on the third perpendicular bisector too.

Because $OA = OB = OC$, the circle centered at $O$ through $A$ passes through all three vertices. It's the **circumscribed circle** (circumcircle).

```shape
{"polygons": [{"points": [[0, 0], [8, 0], [2, 5]]}], "circles": [{"center": [4, 1.3], "r": 4.206}], "segments": [{"from": [4, 1.3], "to": [0, 0], "dashed": true}, {"from": [4, 1.3], "to": [8, 0], "dashed": true}, {"from": [4, 1.3], "to": [2, 5], "dashed": true}], "points": [{"at": [4, 1.3], "label": "O"}], "labels": [{"at": [-0.4, -0.4], "text": "A"}, {"at": [8.4, -0.4], "text": "B"}, {"at": [2, 5.5], "text": "C"}], "caption": "The circumcenter O is equally far from A, B and C."}
```

Where it lands depends on the triangle: *inside* an acute triangle, at the *midpoint of the hypotenuse* of a right triangle, and *outside* an obtuse triangle.

### Example 2

Find the circumcenter of the triangle with vertices $A(0, 0)$, $B(8, 0)$ and $C(0, 6)$.

**Step 1.** The perpendicular bisector of $\overline{AB}$ (from $x = 0$ to $x = 8$ along the $x$-axis) is the vertical line $x = 4$.

**Step 2.** The perpendicular bisector of $\overline{AC}$ (from $y = 0$ to $y = 6$ along the $y$-axis) is the horizontal line $y = 3$.

**Step 3.** They meet at $(4, 3)$. That's the midpoint of the hypotenuse $\overline{BC}$, as expected for a right triangle. The circumradius is the distance to any vertex: $\sqrt{4^2 + 3^2} = 5$.

## Angle bisectors

**Angle Bisector Theorem.** If a point is on the bisector of an angle, it is equidistant from the two sides of the angle. Distance to a side means the length of the *perpendicular* segment to it.

*Proof.* If $P$ is on the bisector of $\angle A$, drop perpendiculars $\overline{PD}$ and $\overline{PE}$ to the sides. Then $\triangle ADP \cong \triangle AEP$ by AAS (right angles, bisected angles, shared hypotenuse $\overline{AP}$), so $PD = PE$ by CPCTC. $\blacksquare$

**Converse.** A point in the interior of an angle that is equidistant from its sides lies on its bisector.

## The incenter

**Incenter Theorem.** The angle bisectors of a triangle are concurrent at a point, the **incenter**, which is equidistant from the three sides.

The common distance is the radius of the **inscribed circle** (incircle), the largest circle that fits inside the triangle, touching all three sides. Unlike the circumcenter, the incenter is *always* inside the triangle.

```shape
{"polygons": [{"points": [[0, 0], [8, 0], [0, 6]]}], "circles": [{"center": [2, 2], "r": 2}], "segments": [{"from": [2, 2], "to": [2, 0], "dashed": true}, {"from": [2, 2], "to": [0, 2], "dashed": true}, {"from": [2, 2], "to": [3.2, 3.6], "dashed": true}], "points": [{"at": [2, 2], "label": "I"}], "caption": "The incenter I of a 6-8-10 right triangle; the incircle has radius 2."}
```

### Example 3

The incenter $I$ of $\triangle ABC$ is 2 units from side $\overline{AB}$. The perpendicular from $I$ to $\overline{BC}$ meets it at $E$, and $BE = 6$. Find $IB$ and the distance from $I$ to $\overline{AC}$.

**Step 1.** The incenter is equidistant from all three sides, so $IE = 2$ and the distance to $\overline{AC}$ is also **2**.

**Step 2.** $\triangle IEB$ has a right angle at $E$, so $IB = \sqrt{IE^2 + BE^2} = \sqrt{4 + 36} = \sqrt{40} = 2\sqrt{10} \approx 6.32$.

**A useful formula.** If a triangle has area $K$ and **semiperimeter** $s$ (half the perimeter), the inradius is $r = \dfrac{K}{s}$. (Cut the triangle into three triangles from $I$, each with height $r$: $K = \tfrac12 r(a + b + c) = rs$.) For the 6-8-10 triangle in the figure, $K = 24$ and $s = 12$, so $r = 2$.

## Common mistakes

- **Confusing the two centers.** Circumcenter: perpendicular bisectors, equidistant from *vertices*. Incenter: angle bisectors, equidistant from *sides*.
- **Measuring distance to a side along a slanted segment.** Distance to a line is along the perpendicular.
- **Assuming the circumcenter is inside.** It's outside an obtuse triangle.
- **Assuming an angle bisector passes through the midpoint of the opposite side.** It usually doesn't (that's a median, next lesson).

## Key points

- Points on a perpendicular bisector are equidistant from the endpoints; points on an angle bisector are equidistant from the sides.
- Perpendicular bisectors meet at the circumcenter, the center of the circumscribed circle.
- Angle bisectors meet at the incenter, the center of the inscribed circle.
- Circumcenter: inside (acute), on the hypotenuse's midpoint (right), outside (obtuse). Incenter: always inside.
- Inradius $r = K / s$.
