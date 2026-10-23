---
id: geo-m4-h-shortest-paths
module: geo-m4
title: Shortest paths and the Triangle Inequality
minutes: 45
honors: true
topics: [Shortest paths]
drills: [geo-m4-r2-quad-side, geo-m4-r2-heron]
refs: [geo-ref-theorems]
---
Lesson 14 stated the Triangle Inequality with an intuitive reason: going straight from $A$ to $C$ is shorter than detouring through $B$. This lesson turns that intuition into a proof, then uses the inequality as a tool for finding *shortest paths*: around a polygon, inside a triangle, by way of a mirror, and to several points at once. Each argument is short, and each is a model of how geometers prove that something is as small as it can be: show that every other choice is at least as long, then show when equality happens.

## Proving the Triangle Inequality

Euclid proved the Triangle Inequality as Book I, Proposition 20 of the *Elements*, and his proof uses only facts from this module.

**Theorem.** In $\triangle ABC$, $AB + BC > AC$.

*Proof.* Extend $\overline{AB}$ past $B$ to a point $D$ with $BD = BC$, and draw $\overline{CD}$.

```shape
{"segments": [{"from": [0, 0], "to": [7.61, 0]}, {"from": [0, 0], "to": [6, 3]}, {"from": [4, 0], "to": [6, 3]}, {"from": [6, 3], "to": [7.61, 0], "dashed": true}], "points": [{"at": [0, 0]}, {"at": [4, 0]}, {"at": [6, 3]}, {"at": [7.61, 0]}], "labels": [{"at": [-0.3, -0.45], "text": "A"}, {"at": [4, -0.5], "text": "B"}, {"at": [6, 3.45], "text": "C"}, {"at": [7.7, -0.5], "text": "D"}], "caption": "BD is made equal to BC, so AD = AB + BC and triangle BCD is isosceles."}
```

1. $\triangle BCD$ is isosceles with $BD = BC$, so its base angles are congruent: $\angle BDC \cong \angle BCD$ (Lesson 13).
2. $B$ lies between $A$ and $D$, so ray $\overrightarrow{CB}$ lies inside $\angle ACD$. Hence $m\angle ACD > m\angle BCD = m\angle BDC$.
3. In $\triangle ACD$, then, the angle at $C$ is larger than the angle at $D$. The side opposite the larger angle is longer (Lesson 14): $AD > AC$.
4. But $AD = AB + BD = AB + BC$. So $AB + BC > AC$. $\blacksquare$

This isn't circular: the Side–Angle Inequality in Lesson 14 was proved from isosceles triangles and the Exterior Angle Inequality, without using the Triangle Inequality.

What if $B$ is allowed to lie on line $AC$? If $B$ is on the segment between $A$ and $C$, then $AB + BC = AC$ exactly; this flat figure is called a **degenerate triangle**, and it is the *only* way equality can happen. So for any three points, $AB + BC \ge AC$, with equality exactly when $B$ is on $\overline{AC}$.

## Paths and the polygon inequality

A **polygonal path** is a chain of segments joined end to end, like $A \to B \to C \to D$. Its length is the sum of its segments. Applying the Triangle Inequality one step at a time,

$$AB + BC + CD \ \ge\ AC + CD \ \ge\ AD,$$

so a polygonal path is at least as long as the straight segment joining its ends, with equality only when all the points lie in order along that segment. The same is true for a path with any number of segments.

Now close the path into a polygon. Any one side is a straight route between two vertices, and the other sides form a path between the same two vertices. So:

**Polygon inequality.** In any polygon, each side is shorter than the sum of all the other sides.

As with triangles, it is enough to check the *longest* side. The converse is also true, though we won't prove it: if the longest of some lengths is less than the sum of the others, a polygon with those side lengths exists.

### Example 1

Three sides of a quadrilateral are 3, 4 and 12. What lengths are possible for the fourth side $s$?

**Step 1.** If $s$ is the longest side, it must be less than the others together: $s < 3 + 4 + 12 = 19$.

**Step 2.** If 12 is the longest side, it must be less than the others together: $12 < 3 + 4 + s$, so $s > 5$.

**Step 3.** The conditions for the sides 3 and 4 hold automatically. So $5 < s < 19$. (Notice the lower bound isn't zero: the short sides 3 and 4 need help from $s$ to span the gap of 12.)

## A point inside a triangle

Euclid's very next proposition (Book I, Proposition 21) compares two paths with the same ends.

**Theorem.** If $P$ is inside $\triangle ABC$, then $PB + PC < AB + AC$.

*Proof.* Extend $\overline{BP}$ until it meets $\overline{AC}$ at $E$.

```shape
{"polygons": [{"points": [[0, 0], [8, 0], [3, 5]]}], "segments": [{"from": [0, 0], "to": [5.82, 2.18], "dashed": true}, {"from": [4, 1.5], "to": [8, 0]}], "points": [{"at": [4, 1.5]}, {"at": [5.82, 2.18]}], "labels": [{"at": [-0.35, -0.4], "text": "B"}, {"at": [8.35, -0.4], "text": "C"}, {"at": [3, 5.45], "text": "A"}, {"at": [3.9, 1.95], "text": "P"}, {"at": [6.25, 2.45], "text": "E"}], "caption": "Extending BP to meet AC at E splits the comparison into two triangle inequalities."}
```

1. In $\triangle ABE$: $AB + AE > BE = BP + PE$.
2. Add $EC$ to both sides: $AB + AC > BP + PE + EC$ (since $AE + EC = AC$).
3. In $\triangle PEC$: $PE + EC > PC$.
4. Combining, $AB + AC > BP + PE + EC > BP + PC$. $\blacksquare$

Apply this at all three vertices and add: $2(PA + PB + PC) < 2(AB + BC + CA)$, so the three distances from an inside point add to *less than the perimeter*. And the Triangle Inequality in $\triangle PAB$, $\triangle PBC$, $\triangle PCA$ gives $2(PA + PB + PC) > AB + BC + CA$, so they add to *more than half the perimeter*.

## Heron's problem: the shortest path by way of a line

**Heron's problem.** Points $A$ and $B$ lie on the same side of a line $\ell$. Find the point $P$ on $\ell$ that makes the path $A \to P \to B$ as short as possible.

Think of a hiker at $A$ who must fetch water from a straight river $\ell$ and then walk to camp $B$. The trick is to **reflect** $A$ across $\ell$: let $A'$ be the point on the other side with $\ell$ the perpendicular bisector of $\overline{AA'}$.

**Step 1: every point of $\ell$ is equally far from $A$ and $A'$.** Let $M$ be where $\overline{AA'}$ crosses $\ell$. For any point $P$ of $\ell$ other than $M$, triangles $PMA$ and $PMA'$ have $\overline{PM}$ in common, right angles at $M$, and $AM = A'M$. So they are congruent by SAS, and $PA = PA'$ by CPCTC. (At $P = M$ it is just $AM = A'M$.)

**Step 2: compare paths.** For every $P$ on $\ell$,

$$AP + PB = A'P + PB \ \ge\ A'B,$$

with equality exactly when $P$ lies on segment $\overline{A'B}$. Since $A'$ and $B$ are on opposite sides of $\ell$, that segment crosses $\ell$ at exactly one point. That crossing is the answer.

![Points A and B lie above a horizontal line ℓ. A′ is the mirror image of A below the line, joined to A by a dotted segment that meets ℓ at a right angle. The straight dashed segment from A′ to B crosses ℓ at P, and the solid path A to P to B is drawn. A gray dashed path from A to another point Q on the line and then to B is longer. The note reads AP + PB = A′P + PB = A′B.](images/geo-m4-heron.svg)

**Step 3: equal angles.** At the best point $P$, the path makes equal angles with $\ell$ on the two sides: the angle between $\overline{PA}$ and $\ell$ equals the angle between $\overline{PA'}$ and $\ell$ (CPCTC from Step 1), which equals the angle between $\overline{PB}$ and $\ell$ (vertical angles, since $A'$, $P$, $B$ are collinear). This is the law of reflection for light, "angle in equals angle out". Heron of Alexandria (around the first century CE) is credited with using this argument to show that a light ray bouncing off a flat mirror takes the shortest possible path.

### Example 2

A river runs along the $x$-axis. A hiker starts at $A(0, 3)$, must touch the river, and ends at camp $B(12, 6)$. Find the best point $P$ and the shortest length.

**Step 1.** Reflect $A$ across the $x$-axis: $A'(0, -3)$.

**Step 2.** The line from $A'(0, -3)$ to $B(12, 6)$ has slope $\dfrac{6 - (-3)}{12 - 0} = \dfrac{9}{12} = \dfrac34$, so it is $y = \tfrac34 x - 3$. It crosses the $x$-axis where $\tfrac34 x = 3$: $x = 4$. So $P = (4, 0)$.

**Step 3.** The shortest length is $A'B = \sqrt{12^2 + 9^2} = \sqrt{225} = 15$ (Pythagorean theorem, Module 6). Check: $AP = \sqrt{4^2 + 3^2} = 5$ and $PB = \sqrt{8^2 + 6^2} = 10$, total 15.

**Step 4.** Compare a different point, $Q = (6, 0)$: $AQ + QB = \sqrt{45} + \sqrt{72} \approx 6.71 + 8.49 = 15.20$, longer, as the theorem promises. And the angles match: $\overline{AP}$ drops 3 over a run of 4 and $\overline{PB}$ rises 6 over a run of 8, the same steepness.

## Several points: where the diagonals cross

Where should a point $P$ go to make $PA + PB + PC + PD$ as small as possible, if $ABCD$ is a convex quadrilateral? Pair the points across the diagonals:

$$PA + PC \ \ge\ AC \quad\text{and}\quad PB + PD \ \ge\ BD.$$

The first is an equality only when $P$ is on diagonal $\overline{AC}$, the second only when $P$ is on $\overline{BD}$. Both happen at one point: where the diagonals cross. There the total is $AC + BD$; everywhere else it is larger. (For *three* points the best spot is called the Fermat point, and finding it takes more than the Triangle Inequality.)

### Example 3

Four stores sit at $A(0, 0)$, $B(12, 0)$, $C(12, 5)$ and $D(0, 9)$, in that order around a convex quadrilateral. A delivery van makes a separate round trip from a warehouse to each store, so the total trip is proportional to $PA + PB + PC + PD$. Where should the warehouse go, and what is the smallest possible value of $PA + PB + PC + PD$?

**Step 1.** The best point is where the diagonals $\overline{AC}$ and $\overline{BD}$ cross.

**Step 2.** $AC = \sqrt{12^2 + 5^2} = 13$ and $BD = \sqrt{12^2 + 9^2} = 15$, so the minimum is $13 + 15 = 28$.

**Step 3.** Sanity check at a corner, $P = B$: $PA + PB + PC + PD = 12 + 0 + 5 + 15 = 32 > 28$.

### Example 4

Quadrilateral $ABCD$ is convex with $AB = 5$, $BC = 6$, $CD = 7$ and $DA = 8$. What do the inequalities say about the sum of the diagonals, $AC + BD$?

**Step 1.** Let the diagonals cross at $O$. In $\triangle AOB$ and $\triangle COD$: $AB < AO + OB$ and $CD < CO + OD$. Adding, $AB + CD < AC + BD$, so $AC + BD > 12$.

**Step 2.** The same argument with $\triangle AOD$ and $\triangle BOC$ gives $AD + BC < AC + BD$, so $AC + BD > 14$. The stronger bound wins: $AC + BD > 14$.

**Step 3.** For an upper bound, $AC < AB + BC = 11$ and $BD < BC + CD = 13$, so $AC + BD < 24$. (Using the other two triangles, $AC < CD + DA = 15$ and $BD < DA + AB = 13$; the best bounds are the smaller ones.)

So $14 < AC + BD < 24$. In words: the diagonals of a convex quadrilateral add to more than half its perimeter (here, more than 13) and less than its perimeter (26), and pairing the sides cleverly can sharpen both bounds.

## Common mistakes

- **Allowing equality in a real triangle.** $AB + BC = AC$ means $B$ is on $\overline{AC}$; the "triangle" is degenerate.
- **Checking only one inequality for a polygon.** Test the longest side against the sum of all the others; that's the one that can fail.
- **Reflecting the wrong way in Heron's problem.** Reflect one of the points *across the line the path must touch*, then join the image to the *other* point with a straight segment.
- **Joining $A$ to $B$ directly.** The segment $\overline{AB}$ doesn't touch $\ell$ when both points are on the same side; the straight segment that solves the problem is $\overline{A'B}$.
- **Assuming the best point is halfway along.** In Example 2 the point halfway between the two hikers' positions along the river, $x = 6$, is not the answer; the best point, $x = 4$, is nearer to $A$, the point that is closer to the river.

## Key points

- Euclid's proof of the Triangle Inequality extends a side to build an isosceles triangle, then uses "larger angle, longer side".
- $AB + BC \ge AC$ for any three points, with equality only when $B$ is on $\overline{AC}$.
- A polygonal path is at least as long as the segment joining its ends; each side of a polygon is shorter than the sum of the others.
- For $P$ inside $\triangle ABC$, $PB + PC < AB + AC$.
- Heron's problem: reflect $A$ across $\ell$; the best point is where $\overline{A'B}$ crosses $\ell$, and the path makes equal angles with $\ell$.
- The point minimizing the total distance to the four corners of a convex quadrilateral is the intersection of its diagonals.
