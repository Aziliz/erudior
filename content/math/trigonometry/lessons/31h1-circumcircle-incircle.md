---
id: trig-m7-h-circles
module: trig-m7
title: 'Honors: The circumcircle, the incircle and the extended law of sines'
minutes: 45
honors: true
topics: [Circumcircle and incircle]
drills: [trig-m7-r2-circumradius, trig-m7-r2-circle-radii]
refs: [trig-ref-triangles]
---
## Two circles that every triangle carries

Near the end of the lesson on triangle area there was a remark you were told you wouldn't
need: the ratio $\tfrac{a}{\sin A}$ in the law of sines equals the diameter of the circle through
the three vertices. This lesson proves that remark and puts it to work. Every triangle has
two special circles: one passing through its three corners, and one fitting snugly inside,
touching all three sides. Their radii tie together the law of sines, the area formula
$\tfrac12 bc\sin A$ and Heron's formula, and they answer practical questions such as "what
circle passes through three given posts?" or "what is the largest round bed that fits in a
triangular garden?"

As in the core lessons, angles $A$, $B$, $C$ are opposite sides $a$, $b$, $c$, $K$ is the area
and $s = \tfrac{a + b + c}{2}$ is the semiperimeter.

## The circumcircle

The **circumcircle** of a triangle is the circle that passes through all three vertices. Its
center is the **circumcenter**, usually written $O$, and its radius is written $R$.

**Why it always exists.** The points that are the same distance from $A$ and from $B$ form a
line: the perpendicular bisector of $AB$. Likewise, the points equally far from $B$ and $C$ form
the perpendicular bisector of $BC$. These two lines are not parallel (that would need $A$, $B$, $C$
on one line), so they cross at exactly one point $O$. That point is equally far from $A$ and $B$,
and from $B$ and $C$, so it is the same distance $R$ from all three vertices. It is therefore
also on the third perpendicular bisector, and the circle centered at $O$ with radius $R$ passes
through $A$, $B$ and $C$. There is only one such circle, because its center has to lie on all
three bisectors.

Where $O$ lands depends on the largest angle: inside the triangle if every angle is acute, at
the midpoint of the hypotenuse for a right triangle, and outside the triangle if one angle is
obtuse.

## The extended law of sines

$$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R.$$

This is the **extended law of sines**. The proof uses one fact from geometry, the
**inscribed angle theorem**: an angle whose vertex is on a circle and whose sides are chords
equals half the central angle standing on the same arc. Two consequences matter here.
Inscribed angles that stand on the same arc, from the same side, are equal. And an angle
inscribed in a semicircle (standing on a diameter) is a right angle.

**Proof when $A$ is acute.** Draw the diameter from $B$ through $O$ to the point $D$ on the circle.
The angles at $A$ and at $D$ both stand on the arc $BC$ from the same side, so $\angle BDC = A$.
Because $BD$ is a diameter, $\angle BCD = 90^\circ$. In the right triangle $BCD$, the side $BC = a$ is
opposite the angle at $D$ and the hypotenuse is $BD = 2R$, so
$$\sin A = \sin D = \frac{a}{2R}, \qquad\text{that is,}\qquad \frac{a}{\sin A} = 2R.$$

![A circle with center O through the vertices of triangle ABC. A dashed diameter runs from B through O to a point D on the circle, and dashed segment DC completes triangle BCD, which has a right angle at C. The angles at A and at D are marked as equal, the two halves of the diameter are each labeled R, and side BC is labeled a.](images/trig-m7-h-circumcircle.svg)

**When $A$ is obtuse or right.** If $A$ is obtuse, $A$ and $D$ sit on opposite sides of chord $BC$,
so $ABDC$ is a four-sided figure inscribed in the circle, and its opposite angles add to $180^\circ$:
$\angle D = 180^\circ - A$. The right triangle still gives $\sin D = \tfrac{a}{2R}$, and
$\sin(180^\circ - A) = \sin A$, so the formula is unchanged. If $A = 90^\circ$, then $BC$ itself is a
diameter, $a = 2R$ and $\sin A = 1$. The same argument works for $b$ and $c$, so all three ratios
equal $2R$.

This also explains *why* the law of sines is true: every side of the triangle is a chord of
the same circle, and a chord's length is $2R$ times the sine of any inscribed angle standing on it.

### Example 1

A triangle has $A = 30^\circ$ and $a = 10$. Find the radius of its circumcircle.

$2R = \dfrac{10}{\sin 30^\circ} = 20$, so $R = 10$. Notice that the other angles never entered: every
triangle with a $30^\circ$ angle across from a side of 10 fits in a circle of radius 10.

### Example 2

In Lesson 28, Example 1 had $A = 40^\circ$, $B = 60^\circ$, $C = 80^\circ$ and $a = 12$. Find $R$, then use it for
the other two sides.

$R = \dfrac{12}{2\sin 40^\circ} \approx 9.334$. Then $b = 2R\sin 60^\circ \approx 16.17$ and $c = 2R\sin 80^\circ \approx 18.39$,
matching Lesson 28. Once $2R$ is known, every side is simply $2R$ times the sine of its
opposite angle.

## The circumradius from the three sides

Put $\sin A = \tfrac{a}{2R}$ into the area formula $K = \tfrac12 bc\sin A$:
$$K = \frac12 bc \cdot \frac{a}{2R} = \frac{abc}{4R}, \qquad\text{so}\qquad R = \frac{abc}{4K}.$$
With Heron's formula for $K$, this gives $R$ from the sides alone.

### Example 3

Find $R$ for the triangle with sides 13, 14 and 15.

$s = 21$, and Heron gives $K = \sqrt{21 \cdot 8 \cdot 7 \cdot 6} = \sqrt{7056} = 84$. Then
$$R = \frac{13 \cdot 14 \cdot 15}{4 \cdot 84} = \frac{2730}{336} = 8.125.$$

## The incircle

The **incircle** is the circle inside the triangle that touches all three sides. Its center is
the **incenter** $I$, and its radius is the **inradius** $r$.

**Why it always exists.** The points inside an angle that are equally far from its two sides
lie on the angle's bisector. The bisectors of $A$ and $B$ cross at a point $I$ inside the
triangle, which is equally far from all three sides; call that distance $r$. So $I$ is also on
the bisector of $C$, and the circle centered at $I$ with radius $r$ touches each side at exactly
one point, where the radius meets the side at a right angle.

**Area and the inradius.** Join $I$ to the three vertices. That cuts the triangle into three
smaller triangles with bases $a$, $b$, $c$, and each has height $r$ (the radius to the touching
point is perpendicular to the side). Adding their areas:
$$K = \tfrac12 ar + \tfrac12 br + \tfrac12 cr = r \cdot \frac{a + b + c}{2} = rs, \qquad\text{so}\qquad r = \frac{K}{s}.$$

**Tangent lengths.** From a point outside a circle, the two segments to the touching points of
the two tangent lines are equal. Call these lengths $x$ from $A$, $y$ from $B$ and $z$ from $C$. Each
side is made of two of them: $y + z = a$, $x + z = b$, $x + y = c$. Adding all three gives
$2(x + y + z) = 2s$, so $x + y + z = s$, and subtracting each equation in turn:
$$x = s - a, \qquad y = s - b, \qquad z = s - c.$$
The tangent length from a vertex is $s$ minus the side *opposite* that vertex.

![Triangle ABC with its incircle. The incenter I is marked, with a dashed radius r down to the point where the circle touches side BC. Each side is split at its touching point, and the pieces are labeled with tangent lengths: s − a on the two pieces next to A, s − b on the two next to B, and s − c on the two next to C.](images/trig-m7-h-incircle.svg)

### Example 4

The triangle in the picture has $a = 14$, $b = 15$, $c = 13$. Find $r$ and the tangent lengths.

The sides are 13, 14 and 15 again, so $s = 21$ and $K = 84$, giving $r = \tfrac{84}{21} = 4$. The tangent
lengths are $s - a = 7$ from $A$, $s - b = 6$ from $B$ and $s - c = 8$ from $C$. Check side $BC$: it is made of
the pieces from $B$ and $C$, and $6 + 8 = 14 = a$. ✓

### Example 5: right triangles

For the 3-4-5 right triangle, $K = 6$ and $s = 6$, so $r = 1$. The hypotenuse stands on a right
angle, so it is a diameter of the circumcircle: $R = \tfrac52$. In any right triangle with legs $a$, $b$
and hypotenuse $c$, the radii to the two legs and the legs themselves form a square of side $r$
at the right angle, so the tangent length there is $r$ itself. That gives the shortcut
$r = s - c = \tfrac{a + b - c}{2}$; here $\tfrac{3 + 4 - 5}{2} = 1$. ✓

### Example 6: three posts and a flower bed

Three lamp posts stand at the corners of a triangle with sides 8 m, 10 m and 12 m. A circular
path is to pass through all three posts, and the largest possible circular flower bed is to be
planted inside the triangle. Find both radii.

$s = 15$ and $K = \sqrt{15 \cdot 7 \cdot 5 \cdot 3} = \sqrt{1575} \approx 39.69$ m². The path's radius is
$$R = \frac{8 \cdot 10 \cdot 12}{4K} = \frac{960}{4(39.69)} \approx 6.05 \text{ m},$$
and the bed's radius is $r = \tfrac{K}{s} \approx \tfrac{39.69}{15} \approx 2.65$ m. The largest angle, from the law of cosines,
is $\cos^{-1}\!\left(\tfrac{8^2 + 10^2 - 12^2}{2 \cdot 8 \cdot 10}\right) \approx 82.8^\circ$, so the triangle is acute and the center of the path lies
inside the triangle.

## How the two radii compare

The circumcircle is always at least twice as large as the incircle:
$$R \ge 2r,$$
with equality only for an equilateral triangle. This is **Euler's inequality**. It follows from a
formula of Euler's for the distance between the two centers, $OI^2 = R(R - 2r)$; since a squared
distance can't be negative, $R - 2r \ge 0$. (We state that distance formula without proof; its
proof needs more geometry than this course covers.)

For an equilateral triangle with side 6: $R = \tfrac{6}{2\sin 60^\circ} = 2\sqrt3 \approx 3.46$ and
$r = \tfrac{K}{s} = \tfrac{9\sqrt3}{9} = \sqrt3 \approx 1.73$, exactly half. The ratio $\tfrac{R}{r}$ works as a measure of how far a
triangle is from equilateral: about 2.03 for the nearly regular 13-14-15 triangle, 2.5 for the
3-4-5 right triangle, and about 5.3 for the long, thin triangle with sides 9, 10 and 17.

## Common mistakes

- **Dropping the 2.** $\tfrac{a}{\sin A}$ is the *diameter* $2R$; the radius is $\tfrac{a}{2\sin A}$.
- **Using the perimeter in $r = \tfrac{K}{s}$.** It is the semiperimeter; with the perimeter you get $\tfrac{r}{2}$.
- **Assuming the circumcenter is inside the triangle.** For an obtuse triangle it lies outside.
- **Mixing up the two centers.** The circumcenter is where the perpendicular bisectors of the
  sides meet; the incenter is where the angle bisectors meet.
- **Misplacing a tangent length.** $s - a$ is measured from vertex $A$ along the two sides that
  meet at $A$, not along side $a$.

## Key points

- Extended law of sines: $\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C} = 2R$, proved with the inscribed angle theorem.
- From the sides: $R = \dfrac{abc}{4K}$ and $r = \dfrac{K}{s}$, with $K$ from Heron's formula.
- The incircle touches the sides at distances $s - a$, $s - b$, $s - c$ from $A$, $B$, $C$.
- Right triangles: $R$ is half the hypotenuse and $r = \tfrac{a + b - c}{2}$.
- Euler's inequality: $R \ge 2r$, with equality only for an equilateral triangle.
