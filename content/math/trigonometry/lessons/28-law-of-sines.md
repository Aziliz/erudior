---
id: trig-law-sines
module: trig-m7
title: The law of sines
minutes: 35
topics: [Law of sines]
drills: [trig-d-los-side, trig-d-los-angle]
refs: [trig-ref-triangles]
---
## Triangles without a right angle

Everything in Module 2 relied on a right angle. Most triangles in surveying, navigation
and engineering don't have one. A triangle with no right angle is an **oblique triangle**,
and this module develops two laws that solve any triangle: the law of sines (this lesson
and the next) and the law of cosines. Both reduce to familiar right-triangle facts when one
angle is $90^\circ$.

## Labels and the possible cases

As before, angles $A$, $B$, $C$ are opposite sides $a$, $b$, $c$. A triangle is determined (up to
the ambiguous case below) by three parts, at least one a side. The cases are named by the
order of the known parts around the triangle:

| Case | Known | Law to use |
|---|---|---|
| **AAS** | two angles and a side not between them | sines |
| **ASA** | two angles and the side between them | sines |
| **SSA** | two sides and an angle opposite one of them | sines (may be ambiguous) |
| **SAS** | two sides and the angle between them | cosines |
| **SSS** | three sides | cosines |

AAA is not on the list: three angles fix the shape but not the size.

The picture shows the labeling used throughout this module: each side is named by the
lowercase letter of the angle across from it, and the dashed altitude $h$ is the segment used in
the proof below.

![Triangle ABC with vertex C at the top. Side a runs from B to C opposite angle A, side b runs from A to C opposite angle B, and side c is the base from A to B opposite angle C. A dashed altitude h drops from C to the base and meets it at a right angle.](images/trig-m7-parts.svg)

## The law

$$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}.$$

Equivalently, $\dfrac{\sin A}{a} = \dfrac{\sin B}{b} = \dfrac{\sin C}{c}$, which is the handier form when the
unknown is an angle. In words: each side is proportional to the sine of the opposite angle.
This is the **law of sines**.

**Why it's true.** Drop the altitude $h$ from $C$ to side $c$ (or its extension). It splits
the triangle into two right triangles, and in each one $h$ is opposite a known angle:
$$h = b\sin A \quad\text{and}\quad h = a\sin B.$$
So $b\sin A = a\sin B$, which rearranges to $\tfrac{a}{\sin A} = \tfrac{b}{\sin B}$. Dropping the altitude from $A$
instead brings in $c$ and $C$. If $A$ is obtuse, the altitude falls outside the triangle and
the right triangle uses the angle $180^\circ - A$, but $\sin(180^\circ - A) = \sin A$, so the same equation holds.

```shape
{"polygons": [{"points": [[0, 0], [9, 0], [3, 4.5]]}], "segments": [{"from": [3, 4.5], "to": [3, 0], "dashed": true, "label": "h"}], "rightAngles": [[[3, 0], [9, 0], [3, 4.5]]], "labels": [{"at": [-0.35, -0.3], "text": "A"}, {"at": [9.35, -0.3], "text": "B"}, {"at": [3, 4.95], "text": "C"}, {"at": [4.5, -0.45], "text": "c"}, {"at": [6.35, 2.55], "text": "a"}, {"at": [1.15, 2.5], "text": "b"}], "caption": "The altitude h equals b sin A and also a sin B"}
```

In the obtuse case the picture changes: the altitude from $C$ meets the extension of side $c$
beyond $A$, and the right triangle it forms has the angle $180^\circ - A$ at $A$.

```shape
{"polygons": [{"points": [[3, 0], [10, 0], [0, 3.5]]}], "segments": [{"from": [3, 0], "to": [0, 0], "dashed": true}, {"from": [0, 3.5], "to": [0, 0], "dashed": true, "label": "h"}], "rightAngles": [[[0, 0], [3, 0], [0, 3.5]]], "labels": [{"at": [3.2, -0.45], "text": "A"}, {"at": [10.35, -0.3], "text": "B"}, {"at": [0, 3.95], "text": "C"}, {"at": [1.6, 0.4], "text": "180° − A"}, {"at": [2.0, 2.0], "text": "b"}, {"at": [5.4, 2.3], "text": "a"}, {"at": [6.5, -0.45], "text": "c"}], "caption": "Obtuse A: h = b sin(180° − A) = b sin A, and still h = a sin B"}
```

## AAS and ASA

With two angles known, the third is $180^\circ$ minus their sum. Then every side has a known
opposite angle, and the law of sines gives each missing side from the known one.

### Example 1 (AAS)

Solve the triangle with $A = 40^\circ$, $B = 60^\circ$ and $a = 12$.

**Third angle:** $C = 180^\circ - 40^\circ - 60^\circ = 80^\circ$.

**Side $b$:** $\dfrac{b}{\sin 60^\circ} = \dfrac{12}{\sin 40^\circ}$, so $b = \dfrac{12\sin 60^\circ}{\sin 40^\circ} \approx 16.17$.

**Side $c$:** $c = \dfrac{12\sin 80^\circ}{\sin 40^\circ} \approx 18.39$.

**Check:** the largest side, $c$, is opposite the largest angle, $C$. ✓

### Example 2 (ASA): across a river

Surveyors mark points $A$ and $B$ 200 m apart along one bank of a river and sight a tree $C$
on the far bank. They measure $\angle A = 52^\circ$ and $\angle B = 71^\circ$. How far is the tree from $A$,
and how wide is the river?

$C = 180^\circ - 52^\circ - 71^\circ = 57^\circ$. The side $AC$ is $b$, opposite $B$:
$$b = \frac{c\sin B}{\sin C} = \frac{200\sin 71^\circ}{\sin 57^\circ} \approx 225.5 \text{ m}.$$
The river's width is the perpendicular distance from $C$ to line $AB$, which is the altitude
$b\sin A \approx 225.5\sin 52^\circ \approx 177.7$ m.

### Example 3: locating a fire

Ranger station $A$ is 30 mi due west of station $B$. A fire is spotted on a bearing of
N $52^\circ$ E from $A$ and N $28^\circ$ W from $B$. How far is the fire from each station?

Turn the bearings into triangle angles. At $A$, the line to $B$ points due east, and the
fire is $52^\circ$ east of north, so the angle between them is $90^\circ - 52^\circ = 38^\circ$. At $B$, the line
to $A$ points due west and the fire is $28^\circ$ west of north: angle $90^\circ - 28^\circ = 62^\circ$. The angle at the
fire $F$ is $180^\circ - 38^\circ - 62^\circ = 80^\circ$.

$$AF = \frac{30\sin 62^\circ}{\sin 80^\circ} \approx 26.9 \text{ mi}, \qquad BF = \frac{30\sin 38^\circ}{\sin 80^\circ} \approx 18.8 \text{ mi}.$$

```plot
{"x": [-3, 33], "y": [-3, 24], "equal": true, "polygons": [{"points": [[0, 0], [30, 0], [21.2, 16.56]]}], "labels": [{"at": [-1.5, -1.5], "text": "A"}, {"at": [31.5, -1.5], "text": "B"}, {"at": [21.2, 18.2], "text": "F"}, {"at": [3.6, 1.2], "text": "38°"}, {"at": [27.3, 1.4], "text": "62°"}, {"at": [15, -1.6], "text": "30 mi"}], "caption": "Two bearings fix the fire's position"}
```

## Finding an angle

If you know a side and its opposite angle, plus one more side, the law of sines gives the
sine of another angle:
$$\sin B = \frac{b\sin A}{a}.$$
Because sine is positive for both acute and obtuse angles, $\sin B = k$ has two candidates
between $0^\circ$ and $180^\circ$: $B = \sin^{-1}k$ and $B = 180^\circ - \sin^{-1}k$. Sometimes both give valid
triangles. That is the **ambiguous case**, the subject of the next lesson.

## Common mistakes

- **Pairing a side with the wrong angle.** Each fraction must be a side over the sine of the
  angle *opposite* it.
- **Using the law of sines for SAS or SSS.** No side–opposite-angle pair is known, so it
  can't start; use the law of cosines.
- **Forgetting the third angle** in AAS or ASA. It's free: $180^\circ$ minus the other two.
- **Rounding the third angle or a side early** and reusing it.

## Key points

- Law of sines: $\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C}$.
- It comes from writing an altitude two ways: $h = b\sin A = a\sin B$.
- Use it for AAS and ASA (always one triangle) and for SSA (zero, one or two triangles).
- Use the law of cosines for SAS and SSS.
