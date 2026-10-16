---
id: pre-angles
module: pre-m8
title: Angles, triangles and perimeter
minutes: 30
topics: [Angles, Perimeter]
drills: [pre-angle-pair, pre-triangle-angle, pre-perimeter]
refs: [pre-ref-geometry]
---
## The vocabulary of shapes

Geometry is the mathematics of shape and size. This lesson sets up the basic vocabulary (points, lines, angles, triangles and polygons) and two measurements you'll use constantly: angle measure in degrees and perimeter, the distance around a shape. Many angle problems turn into the simple equations you solved in Module 7.

## Points, lines and angles

A **line** extends forever in both directions; a **line segment** is the part of a line between two endpoints; a **ray** starts at one endpoint and goes forever in one direction. An **angle** is formed by two rays with a common endpoint, called the **vertex**.

Angles are measured in **degrees** (°). A full turn is 360°, so one degree is $\tfrac{1}{360}$ of a full turn. Angles are classified by size:

| Type | Measure |
|---|---|
| **acute angle** | between 0° and 90° |
| **right angle** | exactly 90° (marked with a small square) |
| **obtuse angle** | between 90° and 180° |
| **straight angle** | exactly 180° (a straight line) |

Lines that meet at a right angle are **perpendicular** ($\perp$). Lines in the same plane that never meet are **parallel** ($\parallel$).

## Angle pairs

Two angles are **complementary** if their measures add to 90°, and **supplementary** if they add to 180°.

```shape
{"segments": [{"from": [0, 0], "to": [4, 0]}, {"from": [0, 0], "to": [0, 4]}, {"from": [0, 0], "to": [3.4, 2]}, {"from": [7, 0], "to": [13, 0]}, {"from": [10, 0], "to": [8.2, 2.8]}], "rightAngles": [[[0, 0], [1, 0], [0, 1]]], "labels": [{"at": [1.6, 0.45], "text": "30°"}, {"at": [0.75, 1.6], "text": "60°"}, {"at": [11, 0.5], "text": "123°"}, {"at": [8.9, 0.4], "text": "57°"}], "caption": "Complementary angles (30° + 60° = 90°) and supplementary angles (123° + 57° = 180°)"}
```

When two lines cross, they form two pairs of **vertical angles**, the angles opposite each other. Vertical angles are always equal. Why? Each one is supplementary to the same angle between them: if the angles around the crossing are $a$, $b$, $c$ in order, then $a + b = 180°$ and $b + c = 180°$, so $a = c$.

### Example 1

An angle measures 38°. Find its complement and its supplement.

Complement: $90° - 38° = 52°$. Supplement: $180° - 38° = 142°$.

### Example 2

Two supplementary angles are such that one is 24° more than twice the other. Find both.

Let the smaller be $x$. The other is $2x + 24$. Supplementary: $x + (2x + 24) = 180$, so $3x = 156$ and $x = 52$. The angles are 52° and $2(52) + 24 = 128°$. Check: $52 + 128 = 180$. ✓

## Triangles

A **triangle** has three sides and three angles. The most important fact about triangles:

*The angles of a triangle add to 180°.*

Why? Draw a line through the top vertex parallel to the bottom side. The three angles at the top along that line form a straight angle (180°). The left one equals the triangle's left angle and the right one equals its right angle (they are matching angles formed by parallel lines), and the middle one is the triangle's top angle. So the three angles of the triangle make up a straight angle. You can also check it physically: tear the three corners off a paper triangle and line them up; they form a straight line.

Triangles are classified by angles (acute, right or obtuse, by their largest angle) and by sides:

- **equilateral**: all three sides equal (and all angles 60°);
- **isosceles**: at least two sides equal (the angles opposite them are equal too);
- **scalene**: no sides equal.

### Example 3

A triangle has angles of 47° and 68°. Find the third angle and classify the triangle.

$180° - 47° - 68° = 65°$. All three angles are less than 90°, so it's an acute triangle; all are different, so its sides are all different lengths: scalene.

### Example 4

In an isosceles triangle, the angle between the two equal sides is 40°. Find the other two angles.

The other two angles are equal; call each $x$. Then $40 + 2x = 180$, so $2x = 140$ and $x = 70$. The angles are 40°, 70°, 70°.

## Polygons and perimeter

A **polygon** is a closed figure made of straight sides: triangles (3 sides), quadrilaterals (4), pentagons (5), hexagons (6), octagons (8). A polygon with all sides and angles equal is **regular**.

The **perimeter** of a polygon is the total length around it: add the lengths of all the sides. Perimeter is a length, so its units are plain units (cm, ft), not square units.

| Shape | Perimeter |
|---|---|
| Rectangle, length $l$ and width $w$ | $P = 2l + 2w$ |
| Square, side $s$ | $P = 4s$ |
| Triangle, sides $a, b, c$ | $P = a + b + c$ |
| Regular polygon, $n$ sides of length $s$ | $P = ns$ |

### Example 5

A rectangular yard is 42 ft by 27 ft. Fencing costs \$8.50 per foot. How much will it cost to fence the yard?

Perimeter: $2(42) + 2(27) = 84 + 54 = 138$ ft. Cost: $138 \times 8.50 = 1{,}173$ dollars.

### Example 6

A rectangle has perimeter 50 cm and length 16 cm. Find its width.

$2(16) + 2w = 50$, so $2w = 18$ and $w = 9$ cm.

## Common mistakes

- *Confusing complementary (90°) and supplementary (180°).* A memory aid: C comes before S, and 90 comes before 180.
- *Forgetting that the triangle's angles total 180°,* or using 360° (that's for quadrilaterals).
- *Adding only two sides of a rectangle* for its perimeter; there are four.
- *Mixing units,* such as adding feet and inches without converting.
- *Writing square units for perimeter.* Perimeter is a length.

## Key points

- Acute < 90° < obtuse < 180°; right = 90°; straight = 180°.
- Complementary angles add to 90°, supplementary to 180°; vertical angles are equal.
- The angles of a triangle add to 180°.
- Perimeter is the distance around: add all the sides; for a rectangle $P = 2l + 2w$.
