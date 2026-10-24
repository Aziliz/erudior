---
id: trig-m2-h-exact-geometry
module: trig-m2
title: 'Exact values from regular polygons: 15°, 22.5°, 18° and 36°'
minutes: 45
honors: true
topics: [Exact values from geometry, Regular polygons]
drills: [trig-m2-r2-polygon, trig-m2-r2-exact-extended]
refs: [trig-ref-unit-circle]
---
## Beyond the square and the equilateral triangle

In the lesson on special right triangles, two shapes did all the work: half a square gave
the exact values at $45^\circ$, and half an equilateral triangle gave them at $30^\circ$ and
$60^\circ$. Both shapes are **regular polygons**: every side has the same length and every
angle has the same size. This lesson asks what the *other* regular polygons can tell us.
Every regular polygon hides a right triangle, and three classical constructions squeeze
exact values out of it for $15^\circ$, $22.5^\circ$, $18^\circ$, $36^\circ$ and their
complements. You need nothing but similar triangles, isosceles triangles and the
Pythagorean theorem; Module 6 will reach some of the same values by formulas, and it is
worth seeing both routes.

## The right triangle inside a regular polygon

Take a regular polygon with $n$ sides and draw the circle through all its vertices. The
center $O$ of that circle is the center of the polygon, and its radius $R$ is the polygon's
**circumradius**. Joining $O$ to two neighboring vertices makes an isosceles triangle with
apex angle $\tfrac{360^\circ}{n}$ (the full turn shared equally among $n$ sides). The segment
from $O$ to the midpoint of a side is perpendicular to that side; it is called the
**apothem**, written $a$. It splits the isosceles triangle into two right triangles, each with

- hypotenuse $R$,
- an angle of $\tfrac{180^\circ}{n}$ at the center,
- opposite side $\tfrac{s}{2}$ (half of a side $s$), and adjacent side $a$.

![A regular pentagon with center O. A segment of length R runs from O to the lower right vertex, and a dashed apothem a runs straight down from O to the midpoint of the bottom side, meeting it at a right angle. The shaded right triangle between them has a 36 degree angle at O and a bottom leg labeled s/2.](images/trig-m2-pentagon.svg)

SOH-CAH-TOA on that triangle gives the three polygon formulas:
$$s = 2R\sin\frac{180^\circ}{n}, \qquad a = R\cos\frac{180^\circ}{n}, \qquad \text{Area} = n\cdot\tfrac12 s\,a = \tfrac12 n R^2 \cdot 2\sin\frac{180^\circ}{n}\cos\frac{180^\circ}{n}.$$
The area formula just adds up the $n$ isosceles triangles, each with base $s$ and height $a$.

### Example 1: a regular pentagon

A regular pentagon has circumradius $R = 10$ cm. Find its side, apothem and area.

The angle at the center of the small right triangle is $\tfrac{180^\circ}{5} = 36^\circ$.

- Side: $s = 2(10)\sin 36^\circ \approx 20(0.58779) \approx 11.76$ cm.
- Apothem: $a = 10\cos 36^\circ \approx 8.09$ cm.
- Area: $5 \cdot \tfrac12 \cdot 11.756 \cdot 8.090 \approx 237.8 \text{ cm}^2$.

Check with a hexagon, where you know the answer: $n = 6$ gives $s = 2R\sin 30^\circ = R$, which
matches the fact that a regular hexagon is six equilateral triangles.

### Archimedes and π

As $n$ grows, the polygon hugs the circle, so its perimeter $ns = 2nR\sin\tfrac{180^\circ}{n}$
approaches the circumference $2\pi R$. Archimedes (third century BCE) used polygons of 6, 12,
24, 48 and 96 sides, inside and outside the circle, to prove that $3\tfrac{10}{71} < \pi < 3\tfrac17$.
He had no sine tables; at each doubling of the number of sides he found the new side from the
old one using right triangles and an angle bisector, in effect the halving trick below. In modern notation the 96-gon inside the
circle gives $96\sin 1.875^\circ \approx 3.14103$, a lower bound for $\pi$.

## Halving an angle with an isosceles triangle

Here is the key construction. Take a right triangle $BCA$ with the right angle at $C$, an
acute angle $\theta$ at $A$, and hypotenuse $AB$. Extend the leg $CA$ past $A$ to a point $D$
with $AD = AB$. Triangle $ABD$ is isosceles, so its base angles at $B$ and $D$ are equal. The
exterior angle at $A$, which is $\theta$, equals the sum of those two angles, so each is
$\tfrac{\theta}{2}$. Now the big triangle $BCD$ is a right triangle with angle
$\tfrac{\theta}{2}$ at $D$, and
$$\tan\frac{\theta}{2} = \frac{BC}{CD} = \frac{\text{opp}}{\text{adj} + \text{hyp}},$$
where opp, adj and hyp are the sides of the original triangle seen from $\theta$.

### Example 2: $15^\circ$ from the 30°–60°–90° triangle

Start with the triangle whose sides are $BC = 1$, $CA = \sqrt3$ and $AB = 2$, so $\theta = 30^\circ$
at $A$. Extend $CA$ by $AD = 2$.

![Right triangle BCA with the right angle at C, BC = 1, CA = √3 and hypotenuse AB = 2, with a 30 degree angle at A. The base is extended past A to D with AD = 2, forming isosceles triangle ABD whose angles at B and D are each 15 degrees.](images/trig-m2-fifteen.svg)

In triangle $BCD$: opposite $BC = 1$, adjacent $CD = \sqrt3 + 2$, and the hypotenuse is
$$BD = \sqrt{1^2 + (2 + \sqrt3)^2} = \sqrt{8 + 4\sqrt3} = \sqrt6 + \sqrt2,$$
because $(\sqrt6 + \sqrt2)^2 = 6 + 2\sqrt{12} + 2 = 8 + 4\sqrt3$. So
$$\tan 15^\circ = \frac{1}{2 + \sqrt3} = 2 - \sqrt3, \qquad \sin 15^\circ = \frac{1}{\sqrt6 + \sqrt2} = \frac{\sqrt6 - \sqrt2}{4}, \qquad \cos 15^\circ = \frac{2 + \sqrt3}{\sqrt6 + \sqrt2} = \frac{\sqrt6 + \sqrt2}{4}.$$
To rationalize $\tfrac{1}{2 + \sqrt3}$, multiply top and bottom by $2 - \sqrt3$: the bottom
becomes $4 - 3 = 1$. The other acute angle of triangle $BCD$ is $75^\circ$, so for free,
$\tan 75^\circ = 2 + \sqrt3$, $\sin 75^\circ = \cos 15^\circ$ and $\cos 75^\circ = \sin 15^\circ$.
Check: $2 - \sqrt3 \approx 0.26795$ and a calculator gives $\tan 15^\circ \approx 0.26795$. ✓

The same trick on the 45°–45°–90° triangle (legs 1, hypotenuse $\sqrt2$) gives
$$\tan 22.5^\circ = \frac{1}{1 + \sqrt2} = \sqrt2 - 1 \approx 0.41421, \qquad \tan 67.5^\circ = \sqrt2 + 1.$$
The hypotenuse of the big triangle is $\sqrt{1 + (1 + \sqrt2)^2} = \sqrt{4 + 2\sqrt2}$, which
leads to $\sin 22.5^\circ = \tfrac{\sqrt{2 - \sqrt2}}{2}$ and $\cos 22.5^\circ = \tfrac{\sqrt{2 + \sqrt2}}{2}$.
These are the angles in a regular octagon ($\tfrac{180^\circ}{8} = 22.5^\circ$) and a regular
12-gon ($\tfrac{180^\circ}{12} = 15^\circ$).

## The pentagon and the golden triangle

The pentagon's angle, $36^\circ$, does not come from halving a special angle. It comes from a
triangle that contains a smaller copy of itself. Take an isosceles triangle $ABC$ with apex
angle $A = 36^\circ$ and legs $AB = AC = 1$, so the base angles are $72^\circ$. Call the base
$BC = x$. Such a triangle is called a **golden triangle**.

![Tall isosceles triangle ABC with apex A of 36 degrees and legs of length 1. A segment from B meets side AC at D, splitting the 72 degree angle at B into two 36 degree angles. Triangle BCD is shaded and has angles 36, 72 and 72 degrees. Sides are labeled AD = x, DC = 1 − x, BD = x and BC = x.](images/trig-m2-golden.svg)

Bisect the angle at $B$, meeting $AC$ at $D$. Follow the angles:

1. Triangle $BCD$ has angles $36^\circ$ at $B$ and $72^\circ$ at $C$, so $72^\circ$ at $D$. It is
   isosceles with $BD = BC = x$, and it has the same angles as $ABC$, so it is similar to $ABC$.
2. Triangle $ABD$ has $36^\circ$ at $A$ and $36^\circ$ at $B$, so it is isosceles with $AD = BD = x$.
3. Then $DC = AC - AD = 1 - x$.

Similarity says corresponding sides are in proportion, base over leg in each triangle:
$$\frac{BC}{AB} = \frac{DC}{BC} \quad\Longrightarrow\quad \frac{x}{1} = \frac{1 - x}{x} \quad\Longrightarrow\quad x^2 + x - 1 = 0.$$
The positive root is $x = \tfrac{\sqrt5 - 1}{2} \approx 0.618$. Its reciprocal,
$\tfrac{1 + \sqrt5}{2} \approx 1.618$, is the **golden ratio**, written $\varphi$ (phi).

Now drop right triangles out of the picture:

- The altitude from $A$ to $BC$ splits the apex into two $18^\circ$ angles, with hypotenuse 1 and
  opposite side $\tfrac{x}{2}$. So $\sin 18^\circ = \tfrac{x}{2} = \dfrac{\sqrt5 - 1}{4} \approx 0.30902$.
- In the isosceles triangle $ABD$ ($AD = BD = x$, $AB = 1$), the altitude from $D$ hits the
  midpoint of $AB$, making a right triangle with a $36^\circ$ angle at $A$, adjacent side
  $\tfrac12$ and hypotenuse $x$. So
  $\cos 36^\circ = \dfrac{1/2}{x} = \dfrac{1}{\sqrt5 - 1} = \dfrac{1 + \sqrt5}{4} = \dfrac{\varphi}{2} \approx 0.80902$.

The complements follow: $\cos 72^\circ = \sin 18^\circ$ and $\sin 54^\circ = \cos 36^\circ$. With
the Pythagorean theorem you can finish the set, for example
$\cos 18^\circ = \sqrt{1 - \sin^2 18^\circ} = \tfrac{\sqrt{10 + 2\sqrt5}}{4}$.

### Example 3: a regular decagon

A regular decagon (10 sides) has circumradius $R$. Find the exact side length.

The center angle of the small right triangle is $\tfrac{180^\circ}{10} = 18^\circ$, so
$$s = 2R\sin 18^\circ = 2R\cdot\frac{\sqrt5 - 1}{4} = R\cdot\frac{\sqrt5 - 1}{2} \approx 0.618R.$$
The side of a regular decagon is the radius divided by the golden ratio. For $R = 10$, $s = 5(\sqrt5 - 1) \approx 6.18$.

### Example 4: an exact roof rise

A shed roof rises at $15^\circ$ over a horizontal run of 12 ft. Find the rise exactly.

The rise is opposite $15^\circ$ and the run is adjacent, so
$$\text{rise} = 12\tan 15^\circ = 12(2 - \sqrt3) = 24 - 12\sqrt3 \approx 3.215 \text{ ft}.$$
Check: $12\tan 15^\circ$ on a calculator is $3.2154$. ✓

## A table of the new values

| $\theta$ | $\sin\theta$ | $\cos\theta$ | $\tan\theta$ | Where it lives |
|---|---|---|---|---|
| $15^\circ$ | $\frac{\sqrt6 - \sqrt2}{4}$ | $\frac{\sqrt6 + \sqrt2}{4}$ | $2 - \sqrt3$ | 12-gon |
| $22.5^\circ$ | $\frac{\sqrt{2 - \sqrt2}}{2}$ | $\frac{\sqrt{2 + \sqrt2}}{2}$ | $\sqrt2 - 1$ | octagon |
| $18^\circ$ | $\frac{\sqrt5 - 1}{4}$ | $\frac{\sqrt{10 + 2\sqrt5}}{4}$ | | decagon |
| $36^\circ$ | $\frac{\sqrt{10 - 2\sqrt5}}{4}$ | $\frac{1 + \sqrt5}{4}$ | | pentagon |

You don't need to memorize this table. The point is that you can rebuild any entry from a
picture in a minute.

Not every whole-degree angle has a value like these. A famous theorem (Gauss around 1800,
completed by Wantzel in 1837) says exactly which regular polygons can be built with straightedge and
compass. A regular 9-gon cannot, which means $\cos 20^\circ$ cannot be written with
whole numbers and square roots alone.

## Common mistakes

- **Using $\tfrac{360^\circ}{n}$ in the small right triangle.** The apothem halves the central
  angle, so the angle in the right triangle is $\tfrac{180^\circ}{n}$.
- **Confusing the apothem with the radius.** The radius goes to a vertex (it is the
  hypotenuse); the apothem goes to the midpoint of a side (it is a leg) and is shorter.
- **Halving the wrong thing.** In the halving construction you extend the *adjacent* leg by the
  *hypotenuse*, giving $\tan\tfrac{\theta}{2} = \tfrac{\text{opp}}{\text{adj} + \text{hyp}}$, not
  $\tfrac12\tan\theta$. In fact $\tan 15^\circ \approx 0.268$ while $\tfrac12\tan 30^\circ \approx 0.289$.
- **Mixing up $x$ and $\varphi$.** The base of the golden triangle with legs 1 is
  $\tfrac{\sqrt5 - 1}{2} \approx 0.618$; the golden ratio is its reciprocal, about $1.618$.

## Key points

- In a regular $n$-gon with circumradius $R$: $s = 2R\sin\tfrac{180^\circ}{n}$ and
  $a = R\cos\tfrac{180^\circ}{n}$.
- Extending the adjacent leg by the hypotenuse halves the angle:
  $\tan\tfrac{\theta}{2} = \tfrac{\text{opp}}{\text{adj} + \text{hyp}}$.
- $\tan 15^\circ = 2 - \sqrt3$, $\tan 22.5^\circ = \sqrt2 - 1$.
- The golden triangle (angles $36^\circ, 72^\circ, 72^\circ$) gives
  $\sin 18^\circ = \tfrac{\sqrt5 - 1}{4}$ and $\cos 36^\circ = \tfrac{1 + \sqrt5}{4}$.
