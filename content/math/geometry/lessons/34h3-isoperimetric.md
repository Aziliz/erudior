---
id: geo-m8-h-isoperimetric
module: geo-m8
title: 'The isoperimetric problem: the most area for the least fence'
minutes: 45
honors: true
topics: [Optimal shapes]
drills: [geo-m8-r2-fence-wall, geo-m8-r2-ngon-perimeter, geo-m8-r2-best-can]
refs: [geo-ref-measure]
---
Lessons 31 to 34 started with a shape and found its area or volume. This lesson turns the question around: with a fixed amount of fence, which shape encloses the most area? With a fixed amount of metal, which can holds the most? This is the **isoperimetric problem** ("isoperimetric" means "same perimeter"). Its answer, the circle, was believed in ancient Greece, but a complete proof took until the late 1800s. Along the way you'll meet a tool that solves many "best shape" problems without calculus: the AM–GM inequality.

An old legend, mentioned in Virgil's *Aeneid*, says Queen Dido, founding the city of Carthage, was offered only as much land as an ox hide could surround. In the usual telling she cut the hide into thin strips and laid them end to end in a great curve, enclosing far more land than anyone expected. It is a legend, but it is the right idea.

## Rectangles with a fixed perimeter

Suppose you have 40 m of fence for a rectangular pen. Length and width add to half the perimeter, $L + W = 20$. Some choices:

| $L$ | $W$ | Area |
|---|---|---|
| 15 | 5 | 75 |
| 12 | 8 | 96 |
| 11 | 9 | 99 |
| 10 | 10 | 100 |

```plot
{"x": [0, 26], "y": [0, 120], "xLabel": "width W (m)", "yLabel": "area (m²)", "functions": [{"f": "x*(20 - x)", "from": 0, "to": 20}], "points": [{"at": [5, 75]}, {"at": [8, 96]}, {"at": [10, 100], "label": "square (10, 100)"}], "labels": [{"at": [7.4, 68], "text": "(5, 75)"}], "caption": "Area A = W(20 − W) of a rectangle with perimeter 40, against its width W. The highest point is the square."}
```

The square wins, and here is why it always does. Write the sides as $L = \tfrac{P}{4} + t$ and $W = \tfrac{P}{4} - t$, so that they add to $\tfrac{P}{2}$ and $t$ measures how far the rectangle is from a square. Then

$$LW = \left(\tfrac{P}{4}\right)^2 - t^2.$$

The area is the square's area minus $t^2$, so it is largest when $t = 0$. With perimeter $P$, the best rectangle is a square of area $\tfrac{P^2}{16}$.

## The AM–GM inequality

For two positive numbers $a$ and $b$, the **arithmetic mean** is $\tfrac{a + b}{2}$ and the geometric mean (Lesson 23) is $\sqrt{ab}$. The **AM–GM inequality** says

$$\sqrt{ab} \le \frac{a + b}{2},$$

with equality only when $a = b$.

*Algebraic proof.* $(\sqrt a - \sqrt b)^2 \ge 0$ because it is a square. Expanding, $a - 2\sqrt{ab} + b \ge 0$, so $\sqrt{ab} \le \tfrac{a + b}{2}$. It is zero only when $\sqrt a = \sqrt b$.

*Geometric proof.* Draw a semicircle on a diameter of length $a + b$, and raise a perpendicular from the point that splits the diameter into $a$ and $b$. By Lesson 23 the perpendicular has length $\sqrt{ab}$ (it is the geometric mean of the two pieces). It can't be longer than the radius, $\tfrac{a + b}{2}$, and it equals the radius only when it stands at the center, where $a = b$.

The rectangle result is AM–GM in disguise: $LW = (\sqrt{LW})^2 \le \left(\tfrac{L + W}{2}\right)^2 = \left(\tfrac{P}{4}\right)^2$. The same is true for three positive numbers, $\sqrt[3]{abc} \le \tfrac{a + b + c}{3}$ with equality only when all three are equal (we'll use this version without proof).

### Example 1: a fence along a wall

A farmer has 60 m of fence and wants a rectangular pen against a long barn wall, so only three sides need fence. What is the largest area?

**Step 1.** Let $W$ be each side touching the wall and $L$ the side parallel to it. Then $L + 2W = 60$ and the area is $LW$.

**Step 2.** Apply AM–GM to the two numbers $L$ and $2W$, whose sum is fixed: $L \cdot 2W \le \left(\tfrac{60}{2}\right)^2 = 900$, so $LW \le 450$.

**Step 3.** Equality needs $L = 2W$, so $4W = 60$: $W = 15$ m, $L = 30$ m, area $450$ m².

A reflection shows why: mirror the pen in the wall. The pen and its image form a rectangle with $120$ m of fence around it and twice the area, and the best such rectangle is a square, $30 \times 30$. Half of it is $30 \times 15$.

## Triangles and regular polygons

**Triangles.** Among triangles with perimeter $2s$, Heron's formula (Lesson 31) gives $A^2 = s(s - a)(s - b)(s - c)$. The three numbers $s - a$, $s - b$, $s - c$ always add up to $3s - 2s = s$, a fixed amount, so by the three-number AM–GM their product is largest when they are equal, that is, when $a = b = c$. The equilateral triangle wins.

### Example 2: three triangles with perimeter 12

Here $s = 6$.

- Equilateral, sides 4, 4, 4: $A = \sqrt{6 \cdot 2 \cdot 2 \cdot 2} = \sqrt{48} = 4\sqrt3 \approx 6.93$.
- Right triangle, sides 3, 4, 5: $A = \sqrt{6 \cdot 3 \cdot 2 \cdot 1} = 6$.
- Isosceles, sides 2, 5, 5: $A = \sqrt{6 \cdot 4 \cdot 1 \cdot 1} = \sqrt{24} \approx 4.90$.

**Regular polygons.** Among all polygons with $n$ sides and a fixed perimeter, the regular one has the most area (the Greek mathematician Zenodorus studied results like this, probably in the 2nd century BCE). And the more sides, the better. A regular $n$-gon with perimeter $P$ has side $\tfrac{P}{n}$ and apothem $\tfrac{P/(2n)}{\tan(180^\circ/n)}$ (Lesson 32), so

$$A = \tfrac12 aP = \frac{P^2}{4n\tan(180^\circ/n)}.$$

![An equilateral triangle, a square, a regular hexagon and a circle, each with perimeter 12. Their areas are 6.93, 9, 10.39 and 11.46.](images/geo-m8-same-perimeter.svg)

| Shape, perimeter 12 | Area |
|---|---|
| Equilateral triangle | 6.93 |
| Square | 9 |
| Regular hexagon | 10.39 |
| Regular 12-gon | 11.20 |
| Circle | 11.46 |

## The isoperimetric inequality

The areas creep up toward the circle's. For a circle with circumference $P$, the radius is $\tfrac{P}{2\pi}$, so $A = \pi\left(\tfrac{P}{2\pi}\right)^2 = \tfrac{P^2}{4\pi}$. The **isoperimetric inequality** says that *every* closed curve of length $P$ encloses area

$$A \le \frac{P^2}{4\pi}, \qquad\text{that is,}\qquad 4\pi A \le P^2,$$

with equality only for a circle. A way to measure how "round" a shape is, is its **isoperimetric quotient** $Q = \tfrac{4\pi A}{P^2}$. It is 1 for a circle and less than 1 for everything else: about 0.785 for a square ($\tfrac{\pi}{4}$) and 0.605 for an equilateral triangle.

*Why the best shape is round (an idea, not a proof).* If a shape has a dent, reflect the dented part outward across a line: the perimeter stays the same and the area grows, so the best shape is convex. In the 1830s Jakob Steiner gave several clever arguments like this, showing that any non-circle can be improved. But they assume that a best shape exists in the first place, and proving that took later mathematicians several more decades. This gap is a famous lesson in why proofs need care.

### Example 3: how round is a 6 by 2 rectangle?

**Step 1.** $P = 16$ and $A = 12$.

**Step 2.** $Q = \tfrac{4\pi(12)}{16^2} = \tfrac{48\pi}{256} \approx 0.589$.

**Step 3.** A circle with the same perimeter would enclose $\tfrac{16^2}{4\pi} \approx 20.37$, about 70% more.

## In three dimensions

Among all solids with a given surface area, the ball holds the most volume. That is why soap bubbles are round: the film pulls itself into the least area that can hold the trapped air. Two everyday versions can be done with AM–GM.

**Boxes.** A box with sides $\ell$, $w$, $h$ has surface area $2(\ell w + \ell h + wh)$. The three face areas $\ell w$, $\ell h$, $wh$ multiply to $(\ell w h)^2 = V^2$, a fixed amount, so by three-number AM–GM their sum is smallest when they are equal: a cube. A 1000 cm³ cube ($10 \times 10 \times 10$) has surface area 600 cm²; a $20 \times 10 \times 5$ box with the same volume needs $2(200 + 100 + 50) = 700$ cm².

**Cans.** A closed cylinder with volume $V$ has $h = \tfrac{V}{\pi r^2}$, so its surface area is

$$S = 2\pi r^2 + 2\pi r h = 2\pi r^2 + \frac{2V}{r} = 2\pi r^2 + \frac{V}{r} + \frac{V}{r}.$$

The three terms multiply to $2\pi V^2$, a fixed amount, so their sum is smallest when they are equal: $2\pi r^2 = \tfrac{V}{r}$, so $V = 2\pi r^3$. Since also $V = \pi r^2 h$, this gives $h = 2r$. **The can that uses the least metal is exactly as tall as it is wide.**

### Example 4: the best 355 mL can

**Step 1.** $V = 355$ cm³ $= 2\pi r^3$, so $r = \sqrt[3]{\tfrac{355}{2\pi}} \approx 3.84$ cm.

**Step 2.** $h = 2r \approx 7.67$ cm.

**Step 3.** $S = 6\pi r^2 \approx 277.5$ cm² (the three equal terms are each $2\pi r^2$).

Real soda cans are much taller than they are wide. This model is a simplification: it counts every square centimeter of metal the same, but a can's top and bottom are made of thicker metal than its side, and a can must also be easy to hold, stack and ship.

Nature has another famous example. Bees build honeycombs from regular hexagons, and in 1999 Thomas Hales proved the long-standing honeycomb conjecture: of all ways to divide a flat surface into cells of equal area, regular hexagons use the least total wall length.

## Common mistakes

- **Thinking equal perimeters mean equal areas.** A 1-by-19 rectangle and a 10-by-10 square both have perimeter 40, with areas 19 and 100.
- **Applying AM–GM to numbers whose sum isn't fixed.** In the wall problem the fixed sum is $L + 2W$, so compare $L$ with $2W$, not with $W$.
- **Dropping the "positive" condition.** AM–GM needs positive numbers.
- **Treating a model's best shape as the real one.** The $h = 2r$ can ignores thick lids and other design needs.

## Key points

- For a fixed perimeter: the best rectangle is a square, the best triangle is equilateral, the best $n$-gon is regular, and the best shape of all is the circle.
- AM–GM: $\sqrt{ab} \le \tfrac{a + b}{2}$, equal only when $a = b$; a fixed sum gives the largest product when the parts are equal.
- Isoperimetric inequality: $4\pi A \le P^2$, equality only for a circle; $Q = \tfrac{4\pi A}{P^2} \le 1$.
- With a wall as one side, the best pen is twice as long as it is wide.
- Least surface for a given volume: a cube among boxes, $h = 2r$ among cylinders, and a sphere among all solids.
