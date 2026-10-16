---
id: geo-pythag
module: geo-m6
title: The Pythagorean theorem and its converse
minutes: 30
topics: [Pythagorean theorem]
drills: [geo-pyth-hyp, geo-pyth-leg, geo-pyth-classify]
refs: [geo-ref-theorems, geo-ref-coord]
---
The Pythagorean theorem is the single most-used result in geometry: it connects the three sides of every right triangle, and through the distance formula it measures every segment on the coordinate plane. This lesson proves it two ways (one with area, one with the similar triangles from the last lesson), applies it, and uses its converse to tell whether a triangle is right, acute or obtuse from its sides alone.

## The theorem

**Pythagorean Theorem.** In a right triangle with legs $a$ and $b$ and hypotenuse $c$,

$$a^2 + b^2 = c^2.$$

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [0, 3]]}, {"points": [[0, 0], [4, 0], [4, -4], [0, -4]]}, {"points": [[0, 0], [0, 3], [-3, 3], [-3, 0]]}, {"points": [[4, 0], [0, 3], [3, 7], [7, 4]]}], "rightAngles": [[[0, 0], [4, 0], [0, 3]]], "labels": [{"at": [2, -2], "text": "a² = 16"}, {"at": [-1.5, 1.5], "text": "b² = 9"}, {"at": [3.5, 3.5], "text": "c² = 25"}], "caption": "The squares on the legs together have the same area as the square on the hypotenuse."}
```

## Two proofs

**Proof by rearrangement.** Take four copies of the right triangle and arrange them inside a square of side $a + b$, so that their hypotenuses enclose a tilted square of side $c$ in the middle. The big square's area can be counted two ways:

$$(a + b)^2 = 4 \cdot \tfrac12 ab + c^2.$$

Expanding, $a^2 + 2ab + b^2 = 2ab + c^2$, so $a^2 + b^2 = c^2$. $\blacksquare$

**Proof by similar triangles.** Drop the altitude from the right angle $C$ to the hypotenuse $\overline{AB}$, meeting it at $D$. This splits $c$ into pieces $x = AD$ and $y = DB$. Each small triangle shares an acute angle with the big one, so all three triangles are similar (AA). From $\triangle ACD \sim \triangle ABC$: $\tfrac{x}{b} = \tfrac{b}{c}$, so $b^2 = cx$. From $\triangle CBD \sim \triangle ABC$: $\tfrac{y}{a} = \tfrac{a}{c}$, so $a^2 = cy$. Adding: $a^2 + b^2 = c(x + y) = c \cdot c = c^2$. $\blacksquare$

This second proof will come back in the next lesson as the "geometric mean" relationships.

## Using the theorem

### Example 1

A right triangle has legs 9 and 12. Find the hypotenuse.

$c = \sqrt{9^2 + 12^2} = \sqrt{81 + 144} = \sqrt{225} = 15$.

### Example 2

A right triangle has hypotenuse 13 and one leg 5. Find the other leg.

$b = \sqrt{13^2 - 5^2} = \sqrt{169 - 25} = \sqrt{144} = 12$.

To find a leg, *subtract* from the square of the hypotenuse.

### Example 3

A 20-foot ladder leans against a wall with its foot 6 feet from the wall. How high up does it reach? Give an exact answer and a decimal.

**Step 1.** The ladder is the hypotenuse: $h^2 + 6^2 = 20^2$.

**Step 2.** $h^2 = 400 - 36 = 364$, so $h = \sqrt{364} = \sqrt{4 \cdot 91} = 2\sqrt{91} \approx 19.08$ ft.

## Pythagorean triples

A **Pythagorean triple** is three positive whole numbers $a$, $b$, $c$ with $a^2 + b^2 = c^2$. Common ones:

| Triple | Multiples |
|---|---|
| 3, 4, 5 | 6, 8, 10; 9, 12, 15; 15, 20, 25 |
| 5, 12, 13 | 10, 24, 26 |
| 8, 15, 17 | 16, 30, 34 |
| 7, 24, 25 | 14, 48, 50 |

Any multiple of a triple is a triple (a similar triangle). Recognizing triples saves time: legs 15 and 20 must give hypotenuse 25.

## The converse and classifying triangles

**Converse of the Pythagorean Theorem.** If the sides of a triangle satisfy $a^2 + b^2 = c^2$, the triangle is a right triangle, with the right angle opposite $c$.

More generally, with $c$ the longest side, compare $c^2$ with $a^2 + b^2$:

| If | the triangle is |
|---|---|
| $c^2 = a^2 + b^2$ | right |
| $c^2 < a^2 + b^2$ | acute |
| $c^2 > a^2 + b^2$ | obtuse |

*Why.* Imagine the angle opposite $c$ as a hinge (Lesson 14). At $90^\circ$ the third side is exactly $\sqrt{a^2 + b^2}$. Close the hinge (acute angle) and the third side gets shorter; open it (obtuse) and it gets longer.

Always check first that the three lengths form a triangle at all.

### Example 4

Classify triangles with sides (a) 8, 15, 17, (b) 7, 9, 12, (c) 6, 7, 9.

**(a)** $17^2 = 289$ and $8^2 + 15^2 = 64 + 225 = 289$: **right**.

**(b)** $12^2 = 144$ and $49 + 81 = 130$. $144 > 130$: **obtuse**.

**(c)** $9^2 = 81$ and $36 + 49 = 85$. $81 < 85$: **acute**.

## The distance formula

The distance between $(x_1, y_1)$ and $(x_2, y_2)$ is the hypotenuse of a right triangle with legs $|x_2 - x_1|$ and $|y_2 - y_1|$:

$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}.$$

### Example 5

Find the distance from $(-1, 2)$ to $(5, 10)$.

$d = \sqrt{6^2 + 8^2} = \sqrt{100} = 10$.

### Example 6: the diagonal of a box

Find the length of the longest rod that fits inside a box 3 by 4 by 12.

**Step 1.** The diagonal of the base is $\sqrt{3^2 + 4^2} = 5$.

**Step 2.** The space diagonal is the hypotenuse of a right triangle with legs 5 (across the base) and 12 (straight up): $\sqrt{5^2 + 12^2} = 13$.

In general, a box $l \times w \times h$ has space diagonal $\sqrt{l^2 + w^2 + h^2}$: the Pythagorean theorem applied twice.

## Common mistakes

- **Adding when finding a leg.** For a leg, $b = \sqrt{c^2 - a^2}$.
- **Using a leg as $c$.** The hypotenuse is opposite the right angle and is the longest side.
- **Taking $\sqrt{a^2 + b^2} = a + b$.** Square roots don't split over addition: $\sqrt{9 + 16} = 5$, not 7.
- **Classifying with the wrong side as $c$.** Use the longest side.

## Key points

- In a right triangle, $a^2 + b^2 = c^2$, with $c$ the hypotenuse.
- Pythagorean triples (3-4-5, 5-12-13, 8-15-17, 7-24-25 and their multiples) give whole-number right triangles.
- With $c$ longest: $c^2 = a^2 + b^2$ right, $<$ acute, $>$ obtuse.
- Distance formula: $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.
