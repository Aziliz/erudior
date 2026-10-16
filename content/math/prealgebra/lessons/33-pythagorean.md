---
id: pre-pythagorean
module: pre-m8
title: The Pythagorean theorem
minutes: 25
topics: [Pythagorean theorem]
drills: [pre-hypotenuse, pre-leg]
refs: [pre-ref-geometry]
---
## Distances you can't measure directly

How long a ladder reaches the window? How far is it across a rectangular field on the diagonal? What's the screen size of a TV that is 48 inches wide and 27 inches tall? All of these involve right triangles, and one theorem answers them all. It ties together squares and square roots (Lesson 20), equations (Module 7) and area (Lesson 30).

## Parts of a right triangle

In a right triangle, the two sides that form the right angle are the **legs**, usually called $a$ and $b$. The side opposite the right angle is the **hypotenuse**, $c$. The hypotenuse is always the longest side.

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [4, 3]]}], "rightAngles": [[[4, 0], [0, 0], [4, 3]]], "segments": [{"from": [0, 0], "to": [4, 0], "label": "a = 4"}, {"from": [4, 0], "to": [4, 3], "label": "b = 3"}, {"from": [4, 3], "to": [0, 0], "label": "c = 5"}], "caption": "A right triangle with legs 3 and 4 and hypotenuse 5"}
```

## The theorem

The **Pythagorean theorem**: in a right triangle with legs $a$ and $b$ and hypotenuse $c$,

$$a^2 + b^2 = c^2.$$

In the triangle above, $3^2 + 4^2 = 9 + 16 = 25 = 5^2$. ✓

In terms of area: a square built on the hypotenuse has exactly the same area as the two squares built on the legs combined.

*Why it's true (one of many proofs).* Take four copies of the right triangle and arrange them inside a big square of side $a + b$, with their hypotenuses forming a tilted square of side $c$ in the middle. The big square's area is $(a + b)^2$. It's also the four triangles plus the middle square: $4 \cdot \tfrac12 ab + c^2 = 2ab + c^2$. Now rearrange the same four triangles in the big square as two $a \times b$ rectangles (each cut along its diagonal), leaving two squares uncovered, of areas $a^2$ and $b^2$. Both big squares have the same area and hold the same four triangles, so the uncovered areas are equal: $c^2 = a^2 + b^2$.

```shape
{"polygons": [{"points": [[0, 0], [7, 0], [7, 7], [0, 7]]}, {"points": [[9, 0], [16, 0], [16, 7], [9, 7]]}, {"points": [[0, 0], [3, 0], [0, 4]], "fill": true}, {"points": [[7, 0], [7, 3], [3, 0]], "fill": true}, {"points": [[7, 7], [4, 7], [7, 3]], "fill": true}, {"points": [[0, 7], [0, 4], [4, 7]], "fill": true}, {"points": [[12, 0], [16, 0], [16, 3]], "fill": true}, {"points": [[12, 0], [12, 3], [16, 3]], "fill": true}, {"points": [[9, 3], [12, 3], [12, 7]], "fill": true}, {"points": [[9, 3], [9, 7], [12, 7]], "fill": true}], "segments": [{"from": [0, -0.5], "to": [3, -0.5], "label": "a"}, {"from": [3, -0.5], "to": [7, -0.5], "label": "b"}, {"from": [9, -0.5], "to": [12, -0.5], "label": "a"}, {"from": [12, -0.5], "to": [16, -0.5], "label": "b"}], "labels": [{"at": [3.5, 3.5], "text": "c²"}, {"at": [10.5, 1.5], "text": "a²"}, {"at": [14, 5], "text": "b²"}], "caption": "The same four right triangles (legs a and b, hypotenuse c) in two squares of side a + b. Left: the uncovered area is c². Right: it is a² + b²."}
```

The theorem works only for *right* triangles. For other triangles, $a^2 + b^2 \ne c^2$.

## Finding the hypotenuse

### Example 1

A rectangular field is 60 m by 80 m. How long is the diagonal path across it?

The diagonal is the hypotenuse of a right triangle with legs 60 and 80.

$c^2 = 60^2 + 80^2 = 3{,}600 + 6{,}400 = 10{,}000$, so $c = \sqrt{10{,}000} = 100$ m.

### Example 2

Find the hypotenuse of a right triangle with legs 5 and 9, to the nearest tenth.

$c^2 = 25 + 81 = 106$, so $c = \sqrt{106} \approx 10.3$. (Check the estimate: $10^2 = 100$ and $11^2 = 121$, so it should be a bit over 10. ✓)

## Finding a leg

If you know the hypotenuse and one leg, subtract:

$$a^2 = c^2 - b^2.$$

### Example 3

A 13-foot ladder leans against a wall with its foot 5 feet from the wall. How high up the wall does it reach?

```shape
{"polygons": [{"points": [[0, 0], [5, 0], [0, 12]]}], "rightAngles": [[[0, 0], [5, 0], [0, 12]]], "segments": [{"from": [0, 0], "to": [5, 0], "label": "5 ft"}, {"from": [5, 0], "to": [0, 12], "label": "13 ft"}, {"from": [0, 0], "to": [0, 12], "label": "h"}], "caption": "A ladder against a wall"}
```

The ladder is the hypotenuse. $h^2 = 13^2 - 5^2 = 169 - 25 = 144$, so $h = 12$ ft.

A very common mistake is adding $13^2 + 5^2$ here. Ask "which side is across from the right angle?" That one is $c$, and it must be the largest.

## Pythagorean triples

Sets of whole numbers that fit the theorem are called **Pythagorean triples**. The most common are

$$3, 4, 5 \qquad 5, 12, 13 \qquad 8, 15, 17 \qquad 7, 24, 25$$

Multiples work too: 6, 8, 10 and 9, 12, 15 come from 3, 4, 5. Recognizing these saves time.

## Testing for a right angle

The converse is also true: if the sides of a triangle satisfy $a^2 + b^2 = c^2$ (with $c$ the longest), the triangle is a right triangle. Builders use this to check square corners: mark 3 ft along one wall and 4 ft along the other; if the marks are 5 ft apart, the corner is square.

### Example 4

Is a triangle with sides 7, 10 and 12 a right triangle?

Longest side 12: $7^2 + 10^2 = 49 + 100 = 149$, but $12^2 = 144$. Not equal, so no.

### Example 5

A TV screen is 48 in wide and 27 in tall. Screen sizes are given by the diagonal. What size is it?

$c^2 = 48^2 + 27^2 = 2{,}304 + 729 = 3{,}033$, so $c = \sqrt{3{,}033} \approx 55.1$ in: a "55-inch" TV.

## Distance on a grid

The theorem also measures straight-line distance between two points on a grid. To go from $(1, 2)$ to $(7, 10)$, you move 6 units across and 8 units up. Those moves are the legs of a right triangle, and the straight-line distance is the hypotenuse:

$$d = \sqrt{6^2 + 8^2} = \sqrt{36 + 64} = \sqrt{100} = 10.$$

```plot
{"x": [0, 9], "y": [0, 12], "equal": true, "points": [{"at": [1, 2], "label": "(1, 2)"}, {"at": [7, 10], "label": "(7, 10)"}], "segments": [{"from": [1, 2], "to": [7, 2], "dashed": true, "label": "6"}, {"from": [7, 2], "to": [7, 10], "dashed": true, "label": "8"}, {"from": [1, 2], "to": [7, 10], "label": "10"}], "caption": "The distance between two points is the hypotenuse of a right triangle"}
```

In algebra this becomes the distance formula, but it is nothing more than the Pythagorean theorem.

## Common mistakes

- *Adding when you should subtract.* If the hypotenuse is given, $a^2 = c^2 - b^2$.
- *Forgetting the square root at the end:* $c^2 = 100$ means $c = 10$, not 100.
- *Writing $a + b = c$* or $\sqrt{a^2 + b^2} = a + b$. The square root does not split across addition.
- *Using the theorem on a triangle that isn't a right triangle.*
- *Calling a leg the hypotenuse.* The hypotenuse is opposite the right angle and is always longest.

## Key points

- In a right triangle, $a^2 + b^2 = c^2$, where $c$ is the hypotenuse (opposite the right angle).
- Hypotenuse: $c = \sqrt{a^2 + b^2}$. Leg: $a = \sqrt{c^2 - b^2}$.
- Common triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25, and their multiples.
- If $a^2 + b^2 = c^2$ for a triangle's sides, it's a right triangle.
