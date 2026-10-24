---
id: pre-m8-h-cones-spheres
module: pre-m8
title: Pyramids, cones and spheres
minutes: 45
honors: true
topics: [Cones, pyramids and spheres]
drills: [pre-m8-r2-cone-volume, pre-m8-r2-sphere, pre-m8-r2-slant-height]
refs: [pre-ref-geometry]
---
## Pointed and round solids

Lesson 34 listed the volume formulas for cones, pyramids and spheres "for reference." This lesson explains where they come from, why a third appears in two of them, and how to find the surface areas of these solids, which needs the Pythagorean theorem from Lesson 35. It ends with one of the most famous results in ancient mathematics: Archimedes' discovery of how a sphere compares with the cylinder that just holds it.

## The parts

A **pyramid** has a polygon for a base and triangular faces that meet at a single point, the **apex**. A square pyramid has a square base and four triangular faces. A **cone** is the round version: a circular base and a curved surface that narrows to an apex. (In this lesson, the apex sits directly above the center of the base: a *right* cone or pyramid.)

Two different "heights" matter, and mixing them up is the most common error with these solids:

- the height $h$ is the *perpendicular* distance from the apex straight down to the base;
- the **slant height** $\ell$ is measured along the slanted surface: for a cone, from the apex to the edge of the base; for a pyramid, from the apex down the middle of a triangular face to the base edge.

![A cone with its apex at the top, a dashed vertical height h from the apex to the center of the circular base, a radius r from the center to the edge of the base, a right-angle mark where they meet, and the slanted side labeled slant height ℓ.](images/pre-m8-h-cone-parts.svg)

Volume uses the height $h$. Surface area uses the slant height $\ell$.

## Volume: why one third?

A prism or cylinder has volume $V = Bh$ (base area times height). A pyramid or cone with the same base and height holds exactly one third as much:

$$\text{Pyramid: } V = \tfrac13 Bh \qquad \text{Cone: } V = \tfrac13 \pi r^2 h$$

There is a neat way to see the one third for one special pyramid. A cube with edge $s$ can be cut into three identical square pyramids. Each one has a face of the cube as its base and the same corner of the cube as its apex (the corner that doesn't touch any of those three faces). The three pyramids are identical and fill the cube, so each has volume $\tfrac13 s^3$, and $\tfrac13 s^3 = \tfrac13 (s^2)(s) = \tfrac13 Bh$.

To get from this one pyramid to all pyramids and cones, mathematicians use **Cavalieri's principle**: if two solids have the same height, and every horizontal slice through them at the same level has the same area, then they have the same volume. (Think of a stack of coins: push it so it leans, and its volume doesn't change.) Every pyramid or cone with base area $B$ and height $h$ has slices that shrink in the same way from $B$ at the bottom to 0 at the apex, so they all have the same volume, $\tfrac13 Bh$. The full argument is a topic for geometry and calculus courses; here we accept the result. You can also test it with water: a cone-shaped cup filled three times fills a cylinder with the same base and height.

### Example 1

A paper cone cup has radius 3 cm and height 4 cm. How much water does it hold?

$V = \tfrac13 \pi r^2 h = \tfrac13 \pi (3)^2 (4) = \tfrac13 \pi (36) = 12\pi \approx 37.7$ cm³, about 38 mL.

### Example 2

The Great Pyramid of Giza originally had a square base about 230 m on a side and a height of about 147 m. Estimate its volume.

$V = \tfrac13 Bh \approx \tfrac13 (230^2)(147) = \tfrac13(52{,}900)(147) \approx 2{,}592{,}000$ m³. Its volume is usually given as about 2.6 million cubic meters, so the estimate agrees.

## Slant height and the Pythagorean theorem

Slice a cone straight down through its apex and the middle of its base. The cut shows a right triangle: the height $h$ and the radius $r$ are the legs, and the slant height $\ell$ is the hypotenuse. So

$$\ell^2 = r^2 + h^2.$$

For a square pyramid with base side $s$, the right triangle runs from the apex straight down to the center of the base, then out to the middle of a base edge, which is half a side away. Its legs are $h$ and $\tfrac{s}{2}$:

$$\ell^2 = h^2 + \left(\tfrac{s}{2}\right)^2.$$

### Example 3

A cone has radius 5 cm and height 12 cm. Find its slant height.

$\ell^2 = 5^2 + 12^2 = 25 + 144 = 169$, so $\ell = 13$ cm (a 5-12-13 triple).

### Example 4

A square pyramid has base side 6 m and height 4 m. Find the slant height of each face.

Half the base side is 3 m. $\ell^2 = 4^2 + 3^2 = 25$, so $\ell = 5$ m.

## Surface area

*Pyramid.* Add the base and the triangular faces. Each face of a square pyramid is a triangle with base $s$ and height $\ell$ (the slant height *is* the triangle's height), so

$$SA = s^2 + 4 \cdot \tfrac12 s\ell = s^2 + 2s\ell.$$

*Cone.* The base is a circle, $\pi r^2$. The curved part, called the **lateral surface**, unrolls into a fan shape: a slice of a circle of radius $\ell$ whose curved edge has length $2\pi r$ (it wrapped around the base). A full circle of radius $\ell$ would have area $\pi \ell^2$ and edge $2\pi \ell$; our slice has $\tfrac{2\pi r}{2\pi \ell} = \tfrac{r}{\ell}$ of that edge, so it has $\tfrac{r}{\ell}$ of that area: $\tfrac{r}{\ell} \cdot \pi \ell^2 = \pi r \ell$. So

$$\text{lateral area} = \pi r \ell, \qquad SA = \pi r^2 + \pi r \ell.$$

### Example 5

Find the surface areas of the cone in Example 3 and the pyramid in Example 4.

Cone: $SA = \pi(5)^2 + \pi(5)(13) = 25\pi + 65\pi = 90\pi \approx 282.7$ cm².

Pyramid: $SA = 6^2 + 2(6)(5) = 36 + 60 = 96$ m².

Notice that both used the slant height, not the height. Using $h = 12$ in the cone would give $25\pi + 60\pi = 85\pi$, which is wrong.

## Spheres

A **sphere** is the set of all points in space at the same distance $r$ from a center: the surface of a ball. Its formulas are

$$V = \tfrac43 \pi r^3, \qquad SA = 4\pi r^2.$$

Volume has $r^3$ (cubic units) and surface area $r^2$ (square units): doubling the radius multiplies the volume by 8 and the surface area by 4. Half a sphere is a **hemisphere**: half the volume, $\tfrac23 \pi r^3$, and a curved surface of $2\pi r^2$ (plus a flat circle of $\pi r^2$ if it is closed).

### Archimedes' sphere and cylinder

In the 200s BC, the Greek mathematician Archimedes of Syracuse compared a sphere with the cylinder that fits around it exactly: radius $r$ and height $2r$.

```shape
{"polygons": [{"points": [[-3, -3], [3, -3], [3, 3], [-3, 3]]}], "circles": [{"center": [0, 0], "r": 3}], "points": [[0, 0]], "segments": [{"from": [0, 0], "to": [3, 0], "label": "r"}, {"from": [3.5, -3], "to": [3.5, 3], "label": "2r"}], "caption": "Side view of a sphere of radius r inside a cylinder of radius r and height 2r"}
```

- The cylinder's volume is $\pi r^2 (2r) = 2\pi r^3$. The sphere's is $\tfrac43 \pi r^3$, which is exactly $\tfrac23$ of it.
- The cylinder's curved surface is $2\pi r \cdot 2r = 4\pi r^2$, exactly the sphere's surface area.
- A cone with the same base and height has volume $\tfrac13 \pi r^2(2r) = \tfrac23 \pi r^3$. So cone : sphere : cylinder $= \tfrac23 : \tfrac43 : 2 = 1 : 2 : 3$.

Archimedes was so proud of this result that, according to the Roman writer Cicero, his tomb was marked with a sphere inside a cylinder; Cicero wrote that he found the overgrown tomb in Syracuse more than a century later.

### Example 6

A basketball has a diameter of about 24 cm. Find its volume and surface area.

$r = 12$ cm. $V = \tfrac43 \pi (12)^3 = \tfrac43 \pi (1{,}728) = 2{,}304\pi \approx 7{,}238$ cm³, a little over 7 liters. $SA = 4\pi(12)^2 = 576\pi \approx 1{,}810$ cm².

### Example 7

A grain silo is a cylinder of radius 3 m and height 10 m with a hemisphere on top. How much does it hold?

Cylinder: $\pi(3)^2(10) = 90\pi$. Hemisphere: $\tfrac23 \pi (3)^3 = 18\pi$. Total $108\pi \approx 339.3$ m³. Keep $\pi$ until the end so the pieces add exactly.

## Common mistakes

- *Using the slant height for volume, or the height for surface area.* Volume uses $h$; lateral area uses $\ell$.
- *Forgetting the $\tfrac13$* for pyramids and cones.
- *Using the diameter* in place of the radius, especially in $\tfrac43\pi r^3$, where the error is multiplied by 8.
- *Squaring instead of cubing.* Sphere volume has $r^3$; sphere surface area has $r^2$.
- *Using the full base side* in the pyramid's slant-height triangle. The leg is half the side, $\tfrac{s}{2}$.
- *Forgetting the base* in a total surface area, or including it when the problem is about an open shape like an ice-cream cone.

## Key points

- Pyramid $V = \tfrac13 Bh$; cone $V = \tfrac13 \pi r^2 h$: one third of the matching prism or cylinder.
- Slant height by the Pythagorean theorem: cone $\ell^2 = r^2 + h^2$; square pyramid $\ell^2 = h^2 + (\tfrac s2)^2$.
- Square pyramid $SA = s^2 + 2s\ell$; cone $SA = \pi r^2 + \pi r\ell$.
- Sphere $V = \tfrac43 \pi r^3$, $SA = 4\pi r^2$; hemisphere half the volume.
- Archimedes: a sphere is $\tfrac23$ of its surrounding cylinder, and cone : sphere : cylinder $= 1 : 2 : 3$.
