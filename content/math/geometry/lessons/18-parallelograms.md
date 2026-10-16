---
id: geo-parallelograms
module: geo-m5
title: Parallelograms
minutes: 30
topics: [Parallelograms]
drills: [geo-para-alg, geo-para-angle]
refs: [geo-ref-theorems]
---
Quadrilaterals are four-sided polygons, and their angles add to $360^\circ$ (Lesson 17). The most important family of quadrilaterals is the parallelograms. This lesson proves their properties using congruent triangles, and then turns the properties around into tests for proving a quadrilateral *is* a parallelogram.

## Definition and properties

A **parallelogram** is a quadrilateral with both pairs of opposite sides parallel. We write $\square ABCD$ (vertices in order around the figure).

```shape
{"polygons": [{"points": [[0, 0], [7, 0], [9, 4], [2, 4]]}], "segments": [{"from": [0, 0], "to": [9, 4], "dashed": true}, {"from": [7, 0], "to": [2, 4], "dashed": true}], "points": [{"at": [4.5, 2], "label": "E"}], "labels": [{"at": [-0.4, -0.4], "text": "A"}, {"at": [7.4, -0.4], "text": "B"}, {"at": [9.4, 4.4], "text": "C"}, {"at": [1.6, 4.4], "text": "D"}], "caption": "Parallelogram ABCD with diagonals meeting at E."}
```

Every parallelogram has these four properties:

1. **Opposite sides are congruent.** $AB = CD$ and $BC = DA$.
2. **Opposite angles are congruent.** $\angle A \cong \angle C$ and $\angle B \cong \angle D$.
3. **Consecutive angles are supplementary.** $m\angle A + m\angle B = 180^\circ$, and so on around.
4. **The diagonals bisect each other.** $AE = EC$ and $BE = ED$.

*Proof of 1 and 2.* Draw diagonal $\overline{AC}$. Because $\overline{AB} \parallel \overline{DC}$, alternate interior angles $\angle BAC \cong \angle DCA$. Because $\overline{AD} \parallel \overline{BC}$, $\angle DAC \cong \angle BCA$. With the shared side $\overline{AC}$, $\triangle ABC \cong \triangle CDA$ by ASA. By CPCTC, $\overline{AB} \cong \overline{CD}$, $\overline{BC} \cong \overline{DA}$ and $\angle B \cong \angle D$. (Using the other diagonal gives $\angle A \cong \angle C$.)

*Proof of 3.* $\overline{AD} \parallel \overline{BC}$ with transversal $\overline{AB}$, so $\angle A$ and $\angle B$ are consecutive interior angles: supplementary.

*Proof of 4.* $\triangle ABE \cong \triangle CDE$ by ASA (alternate interior angles at $A$ and $C$, at $B$ and $D$, and $AB = CD$ from property 1). By CPCTC, $AE = CE$ and $BE = DE$.

Notice that the diagonals of a general parallelogram are *not* congruent and *not* perpendicular. Those are extra properties of special parallelograms (next lesson).

### Example 1

In $\square PQRS$, $m\angle P = (3x + 15)^\circ$ and $m\angle Q = (5x - 3)^\circ$. Find all four angles.

**Step 1.** $\angle P$ and $\angle Q$ are consecutive, so they're supplementary: $8x + 12 = 180$, $x = 21$.

**Step 2.** $m\angle P = 78^\circ$, $m\angle Q = 102^\circ$.

**Step 3.** Opposite angles match: $m\angle R = 78^\circ$, $m\angle S = 102^\circ$. Sum: $360^\circ$ ✓.

### Example 2

The diagonals of $\square ABCD$ meet at $E$. $AE = 2y + 3$, $EC = 4y - 9$ and $BD = 22$. Find $AC$ and $BE$.

**Step 1.** The diagonals bisect each other: $2y + 3 = 4y - 9$, so $y = 6$ and $AE = 15$.

**Step 2.** $AC = 2 \cdot 15 = 30$.

**Step 3.** $BE = \tfrac12 BD = 11$.

## Proving a quadrilateral is a parallelogram

Each property has a true converse. A quadrilateral is a parallelogram if any one of these holds:

1. Both pairs of opposite sides are parallel (the definition).
2. Both pairs of opposite sides are congruent.
3. Both pairs of opposite angles are congruent.
4. The diagonals bisect each other.
5. **One pair of opposite sides is both congruent and parallel.**

Test 5 is especially handy. *Why it works:* if $\overline{AB} \parallel \overline{DC}$ and $AB = DC$, draw $\overline{AC}$. Alternate interior angles $\angle BAC \cong \angle DCA$, and $AC$ is shared, so $\triangle BAC \cong \triangle DCA$ by SAS. Then $\angle BCA \cong \angle DAC$ by CPCTC, and these are alternate interior angles for $\overline{BC}$ and $\overline{AD}$, so those sides are parallel too.

Careful: "one pair parallel and the *other* pair congruent" is *not* enough. An isosceles trapezoid has exactly that and isn't a parallelogram.

### Example 3

Is $A(-2, 1)$, $B(3, 2)$, $C(5, 6)$, $D(0, 5)$ a parallelogram?

**Method 1 (midpoints of diagonals).** Midpoint of $\overline{AC}$: $\left(\tfrac{-2+5}{2}, \tfrac{1+6}{2}\right) = (1.5, 3.5)$. Midpoint of $\overline{BD}$: $\left(\tfrac{3+0}{2}, \tfrac{2+5}{2}\right) = (1.5, 3.5)$. Same point, so the diagonals bisect each other: *yes*.

**Method 2 (slopes).** Slope $AB = \tfrac{1}{5}$, slope $DC = \tfrac{1}{5}$; slope $BC = \tfrac{4}{2} = 2$, slope $AD = \tfrac{4}{2} = 2$. Both pairs parallel: yes.

### Example 4

For what values of $x$ and $y$ is the quadrilateral with consecutive sides $3x + 2$, $2y$, $5x - 8$ and $y + 7$ a parallelogram?

**Step 1.** Opposite sides must be congruent: $3x + 2 = 5x - 8$ and $2y = y + 7$.

**Step 2.** $x = 5$ and $y = 7$, giving sides $17, 14, 17, 14$.

### Example 5

A parallelogram has a side of $2x + 3$, the opposite side $5x - 12$, and perimeter 56. Find the lengths of all four sides.

**Step 1.** Opposite sides are congruent: $2x + 3 = 5x - 12$, so $x = 5$ and that pair of sides is 13 each.

**Step 2.** The perimeter gives the other pair: $2(13) + 2b = 56$, so $b = 15$.

The sides are 13, 15, 13, 15.

## Why the diagonal test is so useful

Of all the tests, "the diagonals bisect each other" is the easiest to check with coordinates: it needs just two midpoint calculations, with no slopes or square roots. It also explains a familiar fact: if you cross two sticks at their midpoints, any angle you choose, the four ends always form a parallelogram.

## Common mistakes

- **Assuming diagonals of a parallelogram are congruent.** Only in rectangles.
- **Setting consecutive angles equal.** They're supplementary; *opposite* angles are equal.
- **Doubling where you shouldn't.** Each diagonal is bisected, so a half equals a half; the two diagonals themselves can differ.
- **Using "one pair parallel, other pair congruent"** as a test. It fails.

## Key points

- Parallelogram: opposite sides parallel and congruent, opposite angles congruent, consecutive angles supplementary, diagonals bisect each other.
- Each property's converse proves a quadrilateral is a parallelogram; so does one pair of sides both congruent and parallel.
- In coordinates, check that diagonals share a midpoint or that opposite slopes match.
