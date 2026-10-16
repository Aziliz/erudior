---
id: geo-tri-angles
module: geo-m4
title: Classifying triangles and their angles
minutes: 25
topics: [Triangle classification, Triangle angle sum]
drills: [geo-tri-sum, geo-ext-angle]
refs: [geo-ref-theorems]
---
Triangles are the building blocks of geometry: every polygon can be cut into triangles, and most measurement problems end up as triangle problems. This lesson classifies triangles and proves the most famous fact about them, that their angles add to $180^\circ$. The proof uses exactly the parallel-line theorems from Module 3.

## Classifying triangles

A **triangle** $\triangle ABC$ is the figure formed by three segments joining three noncollinear points. The points are its vertices; the segments are its sides.

**By sides:**

- **Equilateral triangle**: all three sides congruent.
- **Isosceles triangle**: at least two sides congruent. (So an equilateral triangle is a special isosceles triangle.)
- **Scalene triangle**: no sides congruent.

**By angles:**

- **Acute triangle**: all three angles acute.
- **Right triangle**: one right angle. The sides next to it are the **legs**; the side across from it is the **hypotenuse**.
- **Obtuse triangle**: one obtuse angle.
- **Equiangular triangle**: all three angles congruent.

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [2, 3.46]]}, {"points": [[6, 0], [10, 0], [8, 3]]}, {"points": [[12, 0], [16, 0], [12, 3]]}, {"points": [[18, 0], [23, 0], [19, 1.5]]}], "rightAngles": [[[12, 0], [16, 0], [12, 3]]], "labels": [{"at": [2, -1.3], "text": "equilateral"}, {"at": [8, -1.3], "text": "isosceles"}, {"at": [14, -1.3], "text": "right"}, {"at": [20.5, -1.3], "text": "obtuse"}]}
```

A triangle can't have two right angles or two obtuse angles, as we're about to see: two such angles would already use up $180^\circ$ or more.

## The Triangle Angle Sum Theorem

**Theorem.** The measures of the three interior angles of a triangle add to $180^\circ$.

*Proof.* Take $\triangle ABC$. Through $B$, draw the line $\ell$ parallel to $\overline{AC}$ (possible and unique by the parallel postulate). At $B$, the line $\ell$ and the sides $\overline{BA}$, $\overline{BC}$ make three angles, $\angle 1$, $\angle 2$ (the triangle's angle at $B$) and $\angle 3$, which together form a straight angle: $m\angle 1 + m\angle 2 + m\angle 3 = 180^\circ$.

$\overline{AB}$ is a transversal of the parallel lines $\ell$ and $\overleftrightarrow{AC}$, so $\angle 1 \cong \angle A$ (alternate interior angles). Likewise, with transversal $\overline{BC}$, $\angle 3 \cong \angle C$. Substituting, $m\angle A + m\angle 2 + m\angle C = 180^\circ$. $\blacksquare$

```shape
{"polygons": [{"points": [[0, 0], [8, 0], [3, 4]]}], "segments": [{"from": [-2, 4], "to": [10, 4], "dashed": true}], "labels": [{"at": [-0.3, -0.5], "text": "A"}, {"at": [8.3, -0.5], "text": "C"}, {"at": [3, 4.6], "text": "B"}, {"at": [10.3, 4.3], "text": "ℓ"}, {"at": [1.9, 3.6], "text": "1"}, {"at": [3.1, 3.2], "text": "2"}, {"at": [4.4, 3.6], "text": "3"}], "caption": "Line ℓ through B is parallel to AC; angles 1 and 3 match angles A and C."}
```

Two quick consequences, called **corollaries** (results that follow directly from a theorem):

- The acute angles of a right triangle are complementary.
- Each angle of an equiangular triangle measures $60^\circ$.

### Example 1

In $\triangle PQR$, $m\angle P = (2x + 5)^\circ$, $m\angle Q = (3x - 10)^\circ$ and $m\angle R = (x + 17)^\circ$. Find each angle and classify the triangle.

**Step 1.** Angle sum: $(2x + 5) + (3x - 10) + (x + 17) = 180$.

**Step 2.** $6x + 12 = 180$, so $x = 28$.

**Step 3.** $m\angle P = 61^\circ$, $m\angle Q = 74^\circ$, $m\angle R = 45^\circ$. Check: $61 + 74 + 45 = 180$.

**Step 4.** All three are acute, so $\triangle PQR$ is **acute** (and, with three different angles, scalene).

## Exterior angles

Extend one side of a triangle past a vertex. The angle formed outside the triangle, between the extension and the adjacent side, is an **exterior angle**. The two triangle angles not next to it are its **remote interior angles**.

```shape
{"polygons": [{"points": [[0, 0], [6, 0], [2, 4]]}], "segments": [{"from": [6, 0], "to": [10, 0]}], "labels": [{"at": [-0.4, -0.4], "text": "A"}, {"at": [2, 4.5], "text": "B"}, {"at": [6, -0.5], "text": "C"}, {"at": [6.9, 0.45], "text": "x"}, {"at": [0.8, 0.35], "text": "a"}, {"at": [2.15, 3.2], "text": "b"}], "caption": "Exterior angle x at C equals a + b."}
```

**Exterior Angle Theorem.** An exterior angle of a triangle equals the sum of its two remote interior angles.

*Why.* The exterior angle $x$ and the interior angle at $C$ form a linear pair, so $x = 180 - m\angle C$. The angle sum gives $a + b = 180 - m\angle C$ too. So $x = a + b$.

A consequence: an exterior angle is greater than either remote interior angle (the **Exterior Angle Inequality**). We'll use this in Lesson 14.

### Example 2

An exterior angle of a triangle measures $(5x - 12)^\circ$, and the remote interior angles measure $(2x + 7)^\circ$ and $(x + 15)^\circ$. Find the exterior angle and the third interior angle.

**Step 1.** Exterior Angle Theorem: $5x - 12 = (2x + 7) + (x + 15) = 3x + 22$.

**Step 2.** $2x = 34$, so $x = 17$.

**Step 3.** Exterior angle: $5(17) - 12 = 73^\circ$. Remote angles: $41^\circ$ and $32^\circ$ (sum 73 ✓).

**Step 4.** The adjacent interior angle is $180 - 73 = 107^\circ$. Check: $41 + 32 + 107 = 180$.

### Example 3

In a right triangle, one acute angle is four times the other. Find both.

The acute angles are complementary: $a + 4a = 90$, so $a = 18^\circ$ and the other is $72^\circ$.

### Example 4: the exterior angles of a triangle

At each vertex of a triangle, draw one exterior angle. What do the three exterior angles add up to?

**Step 1.** Each exterior angle forms a linear pair with its interior angle, so the three linear pairs total $3 \cdot 180^\circ = 540^\circ$.

**Step 2.** The three interior angles account for $180^\circ$ of that.

**Step 3.** The exterior angles therefore total $540 - 180 = 360^\circ$.

You can check this with the Exterior Angle Theorem too: the three exterior angles are $(B + C) + (A + C) + (A + B) = 2(A + B + C) = 360^\circ$. In Lesson 17 you'll see that *every* convex polygon's exterior angles add to $360^\circ$.

## Reading a diagram for angle facts

Many problems combine several of this lesson's facts with Module 3's parallel-line facts. A good habit is to label every angle you can find, one fact at a time, writing the reason next to it: "linear pair", "vertical", "alternate interior", "angle sum", "exterior angle". Each new angle often unlocks the next, and the written reasons double as the outline of a proof.

## Common mistakes

- **Adding the exterior angle into the angle sum.** The $180^\circ$ total is for the three interior angles only.
- **Using the adjacent interior angle in the Exterior Angle Theorem.** Only the two *remote* angles add up to the exterior angle.
- **Classifying by a picture.** A triangle that looks right-angled isn't unless the angle is marked or computed as $90^\circ$.
- **Forgetting that equilateral triangles are also isosceles.**

## Key points

- Triangles are classified by sides (equilateral, isosceles, scalene) and angles (acute, right, obtuse, equiangular).
- Interior angles of a triangle add to $180^\circ$; the proof uses a parallel line through a vertex.
- The acute angles of a right triangle are complementary; equiangular triangles have $60^\circ$ angles.
- An exterior angle equals the sum of the two remote interior angles.
