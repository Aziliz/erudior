---
id: geo-circle-seg
module: geo-m7
title: Segment lengths in circles and the equation of a circle
minutes: 35
topics: [Segment lengths in circles, Equation of a circle]
drills: [geo-chord-chord, geo-secant-secant, geo-circle-eq]
refs: [geo-ref-theorems, geo-ref-coord]
---
The last lesson found *angles* from arcs. This one finds *lengths*: when chords, secants and tangents cross, the pieces they cut obey simple product rules, all proved with similar triangles. Then we put circles on the coordinate plane, where the Pythagorean theorem turns the definition of a circle into an equation.

## Two chords

**Intersecting Chords Theorem.** If two chords intersect inside a circle, the products of their pieces are equal:

$$AE \cdot EB = CE \cdot ED.$$

```shape
{"circles": [{"center": [0, 0], "r": 5}], "segments": [{"from": [-5, 0], "to": [4, 3]}, {"from": [-3, 4], "to": [3, -4]}], "points": [{"at": [-5, 0], "label": "A"}, {"at": [4, 3], "label": "B"}, {"at": [-3, 4], "label": "C"}, {"at": [3, -4], "label": "D"}, {"at": [-1, 1.333], "label": "E"}], "caption": "AE · EB = CE · ED."}
```

*Why.* Draw $\overline{AC}$ and $\overline{BD}$. Then $\angle CAB \cong \angle CDB$ (inscribed angles on the same arc $\overset{\frown}{CB}$), and $\angle AEC \cong \angle DEB$ (vertical). So $\triangle AEC \sim \triangle DEB$ by AA, and $\tfrac{AE}{DE} = \tfrac{CE}{BE}$. Cross multiply.

### Example 1

Chords $\overline{AB}$ and $\overline{CD}$ meet at $E$, with $AE = 6$, $EB = 4$ and $CE = 3$. Find $ED$.

$6 \cdot 4 = 3 \cdot ED$, so $ED = 8$.

## Two secants, or a secant and a tangent

For segments from an exterior point $P$, each secant has an **external segment** (from $P$ to the near intersection) and a whole **secant segment** (from $P$ to the far intersection).

**Secant–Secant Theorem.** If two secants are drawn from an exterior point,

$$(\text{outside}) \cdot (\text{whole}) = (\text{outside}) \cdot (\text{whole}).$$

**Secant–Tangent Theorem.** If a secant and a tangent are drawn from an exterior point, the square of the tangent equals outside times whole:

$$(\text{tangent})^2 = (\text{outside}) \cdot (\text{whole}).$$

The tangent case is the secant case with both intersection points merged: "outside" and "whole" are both the tangent length.

*Why (secant–tangent).* With tangent $\overline{PT}$ and secant through $A$ (near) and $B$ (far), $\angle PTA$ (tangent–chord) and $\angle PBT$ (inscribed) both equal half of $\overset{\frown}{AT}$, and $\angle P$ is shared, so $\triangle PTA \sim \triangle PBT$ by AA. Then $\tfrac{PT}{PB} = \tfrac{PA}{PT}$, so $PT^2 = PA \cdot PB$.

All three theorems say the same thing: for a fixed point $P$ and a fixed circle, the product of the two distances from $P$ along any line to the circle is constant. That constant is called the **power of a point**.

### Example 2

From $P$, a secant meets a circle at $A$ and $B$ with $PA = 5$ and $AB = 7$. A second secant meets it at $C$ and $D$ with $PC = 4$. Find $CD$.

**Step 1.** Whole first secant: $PB = 5 + 7 = 12$. Product: $5 \cdot 12 = 60$.

**Step 2.** $4 \cdot PD = 60$, so $PD = 15$.

**Step 3.** $CD = PD - PC = 15 - 4 = 11$.

### Example 3

A tangent from $P$ has length 12. A secant from $P$ has external segment 8. Find the whole secant and the chord inside the circle.

$12^2 = 8 \cdot x$, so $x = 18$. The chord inside is $18 - 8 = 10$.

## The equation of a circle

A point $(x, y)$ lies on the circle with center $(h, k)$ and radius $r$ exactly when its distance from the center is $r$. By the distance formula, $\sqrt{(x - h)^2 + (y - k)^2} = r$. Squaring gives the **standard form** of the equation of a circle:

$$(x - h)^2 + (y - k)^2 = r^2.$$

Watch the signs: $(x + 3)^2 + (y - 2)^2 = 49$ has center $(-3, 2)$ and radius 7.

```plot
{"x": [-11, 5], "y": [-6, 10], "equal": true, "curves": [{"x": "-3 + 7cos(t)", "y": "2 + 7sin(t)", "t": [0, 6.2832]}], "points": [{"at": [-3, 2], "label": "(−3, 2)"}], "segments": [{"from": [-3, 2], "to": [4, 2], "label": "7"}], "caption": "(x + 3)² + (y − 2)² = 49"}
```

### Example 4

Write the equation of the circle with center $(4, -1)$ passing through $(7, 3)$.

**Step 1.** The radius is the distance from the center to the point: $r = \sqrt{3^2 + 4^2} = 5$.

**Step 2.** $(x - 4)^2 + (y + 1)^2 = 25$.

### Example 5: completing the square

Find the center and radius of $x^2 + y^2 - 6x + 10y + 9 = 0$.

**Step 1.** Group and move the constant: $(x^2 - 6x) + (y^2 + 10y) = -9$.

**Step 2.** Complete each square by adding (half the coefficient)² to both sides: $\left(\tfrac{-6}{2}\right)^2 = 9$ and $\left(\tfrac{10}{2}\right)^2 = 25$.

$$(x^2 - 6x + 9) + (y^2 + 10y + 25) = -9 + 9 + 25.$$

**Step 3.** $(x - 3)^2 + (y + 5)^2 = 25$. Center $(3, -5)$, radius 5.

### Example 6

Is the point $(1, 1)$ inside, on or outside the circle $(x - 3)^2 + (y + 5)^2 = 25$?

$(1 - 3)^2 + (1 + 5)^2 = 4 + 36 = 40 > 25$, so it's *outside* (its distance from the center is $\sqrt{40} > 5$).

## Common mistakes

- **Multiplying piece by piece for secants.** For secants it's outside × *whole*, not outside × inside.
- **Forgetting to subtract** when the question asks for the chord, not the whole secant.
- **Sign errors in the center.** $(x - h)$ means the center's $x$ is $+h$.
- **Giving $r^2$ as the radius.** In $(x - 3)^2 + (y + 5)^2 = 25$, the radius is 5.
- **Adding to only one side** when completing the square.

## Key points

- Chords: $AE \cdot EB = CE \cdot ED$.
- Secants from a point: outside · whole $=$ outside · whole. Tangent and secant: tangent² $=$ outside · whole.
- Circle with center $(h, k)$ and radius $r$: $(x - h)^2 + (y - k)^2 = r^2$.
- Complete the square to put a general equation in standard form.
