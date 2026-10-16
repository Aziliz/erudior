---
id: geo-special-right
module: geo-m6
title: Special right triangles and the geometric mean
minutes: 30
topics: [Special right triangles, Geometric mean]
drills: [geo-454590, geo-306090, geo-geomean]
refs: [geo-ref-theorems]
---
Two right triangles appear so often that it pays to know their side ratios by heart: the $45^\circ$-$45^\circ$-$90^\circ$ triangle (half a square) and the $30^\circ$-$60^\circ$-$90^\circ$ triangle (half an equilateral triangle). With them you can find exact lengths, with radicals, without a calculator. This lesson derives both from the Pythagorean theorem, then returns to the altitude-on-the-hypotenuse picture from the last lesson to get the geometric mean relationships.

## The 45°-45°-90° triangle

Cut a square of side $s$ along a diagonal. Each half is an isosceles right triangle with legs $s$ and angles $45^\circ$, $45^\circ$, $90^\circ$. By Pythagoras, the hypotenuse is $\sqrt{s^2 + s^2} = \sqrt{2s^2} = s\sqrt2$.

**45°-45°-90° Triangle Theorem.** The sides are in the ratio

$$1 : 1 : \sqrt2 \qquad (\text{leg} : \text{leg} : \text{hypotenuse}).$$

So hypotenuse $=$ leg $\cdot \sqrt2$, and leg $=$ hypotenuse $\div \sqrt2 = \tfrac{\text{hypotenuse} \cdot \sqrt2}{2}$.

```shape
{"polygons": [{"points": [[0, 0], [5, 0], [0, 5]]}], "rightAngles": [[[0, 0], [5, 0], [0, 5]]], "segments": [{"from": [0, 0], "to": [5, 0], "label": "x"}, {"from": [0, 5], "to": [0, 0], "label": "x"}, {"from": [5, 0], "to": [0, 5], "label": "x√2"}], "labels": [{"at": [3.9, 0.4], "text": "45°"}, {"at": [0.45, 3.8], "text": "45°"}]}
```

### Example 1

(a) A 45°-45°-90° triangle has legs 7. Find the hypotenuse. (b) Another has hypotenuse 10. Find a leg.

**(a)** $7\sqrt2 \approx 9.90$.

**(b)** $\dfrac{10}{\sqrt2} = \dfrac{10\sqrt2}{2} = 5\sqrt2 \approx 7.07$. (Multiplying top and bottom by $\sqrt2$ is called *rationalizing the denominator*.)

## The 30°-60°-90° triangle

Take an equilateral triangle with side $2s$ and drop the altitude from one vertex. It bisects the opposite side (Lesson 13), making two 30°-60°-90° triangles, each with hypotenuse $2s$ and short leg $s$. The long leg (the altitude) is $\sqrt{(2s)^2 - s^2} = \sqrt{3s^2} = s\sqrt3$.

**30°-60°-90° Triangle Theorem.** The sides are in the ratio

$$1 : \sqrt3 : 2 \qquad (\text{short leg} : \text{long leg} : \text{hypotenuse}).$$

The short leg is opposite $30^\circ$, the long leg opposite $60^\circ$, and the hypotenuse is twice the short leg.

```shape
{"polygons": [{"points": [[0, 0], [5.196, 0], [0, 3]]}], "rightAngles": [[[0, 0], [5.196, 0], [0, 3]]], "segments": [{"from": [0, 0], "to": [5.196, 0], "label": "x√3"}, {"from": [0, 3], "to": [0, 0], "label": "x"}, {"from": [5.196, 0], "to": [0, 3], "label": "2x"}], "labels": [{"at": [3.9, 0.35], "text": "30°"}, {"at": [0.5, 2.2], "text": "60°"}]}
```

**Strategy:** always find the short leg first. From the hypotenuse, halve it. From the long leg, divide by $\sqrt3$.

### Example 2

In a 30°-60°-90° triangle the hypotenuse is 18. Find both legs.

Short leg $= 18 / 2 = 9$. Long leg $= 9\sqrt3 \approx 15.59$.

### Example 3

In a 30°-60°-90° triangle the long leg is 12. Find the short leg and hypotenuse.

**Step 1.** Short leg $= \dfrac{12}{\sqrt3} = \dfrac{12\sqrt3}{3} = 4\sqrt3 \approx 6.93$.

**Step 2.** Hypotenuse $= 2 \cdot 4\sqrt3 = 8\sqrt3 \approx 13.86$.

### Example 4

Find the area of an equilateral triangle with side 10.

The altitude splits it into two 30°-60°-90° triangles with short leg 5, so the height is $5\sqrt3$. Area $= \tfrac12 \cdot 10 \cdot 5\sqrt3 = 25\sqrt3 \approx 43.30$. In general, an equilateral triangle with side $s$ has height $\tfrac{\sqrt3}{2}s$ and area $\tfrac{\sqrt3}{4}s^2$.

## Geometric mean in right triangles

Recall from Lesson 22: the altitude from the right angle to the hypotenuse splits a right triangle into two smaller triangles, all three similar. Call the altitude $h$ and the pieces of the hypotenuse $x$ and $y$ (with $x$ next to leg $b$ and $y$ next to leg $a$).

```shape
{"polygons": [{"points": [[0, 0], [10, 0], [3.6, 4.8]]}], "segments": [{"from": [3.6, 4.8], "to": [3.6, 0], "dashed": true, "label": "h"}], "rightAngles": [[[3.6, 4.8], [0, 0], [10, 0]], [[3.6, 0], [10, 0], [3.6, 4.8]]], "labels": [{"at": [1.8, -0.6], "text": "x"}, {"at": [6.8, -0.6], "text": "y"}, {"at": [1.2, 2.9], "text": "b"}, {"at": [7.3, 2.9], "text": "a"}], "caption": "Altitude h to the hypotenuse splits it into x and y."}
```

**Geometric Mean (Altitude) Theorem.** The altitude is the geometric mean of the two pieces: $\dfrac{x}{h} = \dfrac{h}{y}$, so $h = \sqrt{xy}$.

**Geometric Mean (Leg) Theorem.** Each leg is the geometric mean of the whole hypotenuse and the piece next to that leg: $b = \sqrt{cx}$ and $a = \sqrt{cy}$, where $c = x + y$.

*Why.* $\triangle ACD \sim \triangle CBD$ gives $\tfrac{x}{h} = \tfrac{h}{y}$; the leg version came out of the similarity proof of Pythagoras.

### Example 5

The altitude to the hypotenuse splits it into pieces 4 and 9. Find the altitude and both legs.

**Step 1.** $h = \sqrt{4 \cdot 9} = 6$.

**Step 2.** Hypotenuse $c = 13$. Leg next to the 4-piece: $\sqrt{13 \cdot 4} = \sqrt{52} = 2\sqrt{13}$. Leg next to the 9-piece: $\sqrt{13 \cdot 9} = 3\sqrt{13}$.

**Check.** $(2\sqrt{13})^2 + (3\sqrt{13})^2 = 52 + 117 = 169 = 13^2$ ✓.

### Example 6: a regular hexagon

A regular hexagon has side 6. Find the distance between two opposite sides.

**Step 1.** A regular hexagon is six equilateral triangles meeting at the center, each with side 6.

**Step 2.** The distance from the center to a side is the height of one of those triangles: the long leg of a 30°-60°-90° triangle with short leg 3, so $3\sqrt3$.

**Step 3.** Opposite sides are twice that apart: $6\sqrt3 \approx 10.39$.

This distance from the center to a side is called the apothem; you'll use it for areas of regular polygons in Module 8.

## Exact or decimal?

Answers like $5\sqrt2$ are *exact*; $7.07$ is an approximation. Keep radicals until the last step, because rounding early compounds errors. When a problem says "exact", leave the radical; when it asks for a decimal, round only at the end.

## Common mistakes

- **Swapping the legs in 30°-60°-90°.** The *short* leg is opposite $30^\circ$; the hypotenuse is twice the *short* leg.
- **Multiplying by $\sqrt2$ when going from hypotenuse to leg.** Going down to a leg, divide.
- **Using the wrong piece in the leg theorem.** Pair each leg with the piece of hypotenuse *adjacent* to it.
- **Thinking $\sqrt3 \approx 1.5$.** It's about 1.732; $\sqrt2 \approx 1.414$.

## Key points

- 45°-45°-90°: $1 : 1 : \sqrt2$. Hypotenuse $=$ leg $\cdot \sqrt2$.
- 30°-60°-90°: $1 : \sqrt3 : 2$. Find the short leg first.
- Equilateral triangle with side $s$: height $\tfrac{\sqrt3}{2}s$, area $\tfrac{\sqrt3}{4}s^2$.
- Altitude to the hypotenuse: $h = \sqrt{xy}$; each leg $= \sqrt{c \cdot \text{adjacent piece}}$.
