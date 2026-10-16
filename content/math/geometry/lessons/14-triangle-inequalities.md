---
id: geo-tri-ineq
module: geo-m4
title: Inequalities in triangles
minutes: 25
topics: [Triangle inequalities]
drills: [geo-tri-range, geo-tri-count]
refs: [geo-ref-theorems]
---
So far every triangle fact has been an *equality*: angles add to exactly $180^\circ$, congruent sides have equal lengths. This lesson is about *inequalities*: which side is longest, which angle is biggest, and which side lengths can form a triangle at all. These facts answer practical questions (can three boards form a triangular frame?) and set up indirect proof, a new proof technique.

## Bigger side, bigger angle

**Side–Angle Inequality.** In a triangle, the longer side is opposite the larger angle, and the larger angle is opposite the longer side.

*Why (sketch).* Suppose $AC > AB$ in $\triangle ABC$. Mark $D$ on $\overline{AC}$ with $AD = AB$. Then $\triangle ABD$ is isosceles, so $\angle ABD \cong \angle ADB$. The angle $\angle ABC$ contains $\angle ABD$, so it's bigger. And $\angle ADB$ is an exterior angle of $\triangle BDC$, so it's bigger than $\angle C$. Chaining: $m\angle ABC > m\angle ABD = m\angle ADB > m\angle C$. So the angle opposite the longer side $\overline{AC}$ (that's $\angle B$) is bigger than the angle opposite $\overline{AB}$ (that's $\angle C$).

So, to order the sides, order the angles opposite them, and vice versa. In a right triangle, the right angle is the largest angle, so the hypotenuse is the longest side.

### Example 1

In $\triangle XYZ$, $m\angle X = 72^\circ$ and $m\angle Y = 49^\circ$. List the sides from shortest to longest.

**Step 1.** $m\angle Z = 180 - 72 - 49 = 59^\circ$.

**Step 2.** Angles from smallest to largest: $\angle Y$ ($49^\circ$), $\angle Z$ ($59^\circ$), $\angle X$ ($72^\circ$).

**Step 3.** Opposite sides in the same order: $\overline{XZ}$ (opposite $Y$), $\overline{XY}$ (opposite $Z$), $\overline{YZ}$ (opposite $X$).

Shortest to longest: $XZ, XY, YZ$.

## The Triangle Inequality Theorem

**Triangle Inequality Theorem.** The sum of the lengths of any two sides of a triangle is greater than the length of the third side.

Intuitively, the straight path from $A$ to $C$ is shorter than the detour through $B$. To check whether three lengths can form a triangle, it's enough to check that *the two shorter sides add to more than the longest*.

```shape
{"segments": [{"from": [0, 0], "to": [10, 0], "label": "10"}, {"from": [0, 0], "to": [3, 0.6], "label": "3"}, {"from": [10, 0], "to": [5.2, 1.2], "label": "5"}], "points": [{"at": [0, 0]}, {"at": [10, 0]}], "caption": "Sides 3 and 5 can't reach each other across a gap of 10: 3 + 5 < 10."}
```

If the two shorter sides add to *exactly* the longest, the "triangle" collapses into a segment (it is called degenerate) and isn't a triangle.

### Example 2

Can segments of lengths 4, 7 and 12 form a triangle? What about 6, 8, 13?

**4, 7, 12:** $4 + 7 = 11 < 12$. No.

**6, 8, 13:** $6 + 8 = 14 > 13$. Yes.

### Example 3: the range for the third side

Two sides of a triangle are 9 and 15. What lengths are possible for the third side $x$?

**Step 1.** The third side must be shorter than the sum: $x < 9 + 15 = 24$.

**Step 2.** And the longer given side must be shorter than the other two together: $15 < 9 + x$, so $x > 6$, which is the difference $15 - 9$.

**Step 3.** So $6 < x < 24$. In general, the third side lies strictly between the *difference* and the *sum* of the other two.

If the sides must be whole numbers, $x$ can be $7, 8, \ldots, 23$: that's $23 - 7 + 1 = 17$ values.

## The Hinge Theorem

Picture two sides of a triangle as the arms of a door hinge. Open the hinge wider and the gap between the free ends grows.

**Hinge Theorem (SAS Inequality).** If two sides of one triangle are congruent to two sides of another, and the included angle of the first is larger, then the third side of the first is longer.

**Converse Hinge Theorem (SSS Inequality).** If two sides of one triangle are congruent to two sides of another, and the third side of the first is longer, then the included angle of the first is larger.

### Example 4

Two hikers leave camp. Each walks 5 km, then turns and walks 3 km. Hiker A turns $40^\circ$ off their path; hiker B turns $65^\circ$. Who ends farther from camp?

Each path forms a triangle with sides 5 and 3. The angle *between* those legs at the turning point is $180^\circ$ minus the turn: $140^\circ$ for A and $115^\circ$ for B. A's included angle is larger, so by the Hinge Theorem A's third side (distance from camp) is longer. Hiker A is farther.

## Indirect proof

Inequality theorems are often proved *indirectly*. An **indirect proof** (proof by contradiction) works like this:

1. Assume the opposite of what you want to prove.
2. Reason logically until you reach a contradiction with a given fact or a known theorem.
3. Conclude the assumption was false, so the original statement is true.

*Example.* Prove a triangle can't have two right angles. Assume it does. Then those two angles already sum to $180^\circ$, and the third angle must be $0^\circ$, contradicting that a triangle's angles are positive. So the assumption is false. $\blacksquare$

## Common mistakes

- **Pairing a side with an adjacent angle.** Always use the angle *opposite* the side.
- **Checking only one inequality** and picking the wrong one. Checking that the two shortest sides add to more than the longest is enough; checking that the two longest add to more than the shortest proves nothing.
- **Including the endpoints.** The third side is strictly between the difference and the sum.
- **Comparing sides in different triangles with the Side–Angle Inequality.** It applies within one triangle; across two triangles, use the Hinge Theorem.

## Key points

- Within a triangle, longer sides are opposite larger angles, and vice versa.
- Any two sides add to more than the third; the third side lies strictly between the difference and the sum of the other two.
- Hinge Theorem: with two pairs of congruent sides, the larger included angle gives the longer third side, and conversely.
- Indirect proof assumes the opposite and reaches a contradiction.
