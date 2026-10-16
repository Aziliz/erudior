---
id: geo-surface
module: geo-m8
title: Solids and surface area
minutes: 30
topics: [Solids, Surface area]
drills: [geo-sa-cyl, geo-sa-cone, geo-sa-prism]
refs: [geo-ref-measure]
---
Now we move from flat figures into space. This lesson names the common solids, introduces nets (a solid unfolded flat), and uses nets to find **surface area**: the total area of all the outside faces. Every formula here is just the area formulas of the last two lessons applied to the pieces of a net.

## Solids

A **polyhedron** is a solid bounded by polygons, called **faces**. Faces meet in **edges**, and edges meet at vertices.

- A **prism** has two congruent, parallel faces called **bases**, joined by rectangular (or parallelogram) **lateral faces**. It's named by its base: triangular prism, rectangular prism, and so on. In a *right* prism the lateral edges are perpendicular to the bases.
- A **pyramid** has one polygon base and triangular lateral faces meeting at a point, the apex. A *regular* pyramid has a regular polygon base with the apex directly above its center.
- A **cylinder** has two congruent parallel circular bases joined by a curved surface.
- A **cone** has one circular base and a curved surface rising to an apex.
- A **sphere** is the set of points in space at a fixed distance $r$ from a center.

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [4, 3], [0, 3]]}, {"points": [[4, 0], [6, 1.5], [6, 4.5], [4, 3]]}, {"points": [[0, 3], [4, 3], [6, 4.5], [2, 4.5]]}, {"points": [[9, 0], [13, 0], [11, 4]]}, {"points": [[13, 0], [14.5, 1], [11, 4]]}], "segments": [{"from": [0, 0], "to": [2, 1.5], "dashed": true}, {"from": [2, 1.5], "to": [6, 1.5], "dashed": true}, {"from": [2, 1.5], "to": [2, 4.5], "dashed": true}, {"from": [9, 0], "to": [10.5, 1], "dashed": true}, {"from": [10.5, 1], "to": [14.5, 1], "dashed": true}, {"from": [10.5, 1], "to": [11, 4], "dashed": true}], "caption": "A rectangular prism and a square pyramid (hidden edges dashed)."}
```

**Euler's formula.** For any convex polyhedron, the numbers of vertices $V$, edges $E$ and faces $F$ satisfy

$$V - E + F = 2.$$

A cube has $8 - 12 + 6 = 2$ ✓. A square pyramid has $5 - 8 + 5 = 2$ ✓.

## Nets and lateral area

A **net** is a flat pattern that folds up into the solid. The **lateral area** is the area of the sides only (not the bases); the **surface area** adds the bases.

## Prisms and cylinders

Unfold the lateral faces of a right prism and they form one long rectangle whose width is the base perimeter $P$ and whose height is the prism's height $h$. So

$$L = Ph, \qquad S = Ph + 2B,$$

where $B$ is the area of one base. A cylinder works the same way: its curved side unrolls into a rectangle of width $2\pi r$ (the circumference) and height $h$:

$$L = 2\pi r h, \qquad S = 2\pi r h + 2\pi r^2.$$

### Example 1

Find the surface area of a box 8 by 5 by 3.

$S = 2(8 \cdot 5 + 8 \cdot 3 + 5 \cdot 3) = 2(40 + 24 + 15) = 158$. (Same as $Ph + 2B = 26 \cdot 3 + 2 \cdot 40$.)

### Example 2

A can has radius 4 cm and height 10 cm. Find the area of the label (the lateral area) and the total surface area.

**Lateral:** $2\pi(4)(10) = 80\pi \approx 251.3$ cm².

**Total:** $80\pi + 2\pi(16) = 112\pi \approx 351.9$ cm².

## Pyramids and cones

For a regular pyramid, each lateral face is a triangle whose height is the **slant height** $\ell$ (measured along the face, from the apex to the midpoint of a base edge). The lateral faces have total area $\tfrac12 P\ell$, so

$$L = \tfrac12 P\ell, \qquad S = \tfrac12 P\ell + B.$$

A cone is the limit of pyramids with circular bases ($P \to 2\pi r$):

$$L = \pi r\ell, \qquad S = \pi r\ell + \pi r^2.$$

The slant height is *not* the height. In a right cone, the height $h$, radius $r$ and slant height $\ell$ form a right triangle: $\ell = \sqrt{r^2 + h^2}$. In a square pyramid with base edge $s$, use half the base edge: $\ell = \sqrt{(s/2)^2 + h^2}$.

### Example 3

A cone has radius 5 and height 12. Find its surface area.

**Step 1.** Slant height: $\ell = \sqrt{25 + 144} = 13$.

**Step 2.** $S = \pi(5)(13) + \pi(25) = 65\pi + 25\pi = 90\pi \approx 282.7$.

### Example 4

A square pyramid has base edge 10 and height 12. Find its surface area.

**Step 1.** Slant height: $\ell = \sqrt{5^2 + 12^2} = 13$.

**Step 2.** $L = \tfrac12 \cdot 40 \cdot 13 = 260$; $B = 100$.

**Step 3.** $S = 360$.

## Spheres

A sphere can't be unfolded flat, so its formula comes from a different argument (Archimedes showed it equals the lateral area of the cylinder that just encloses it):

$$S = 4\pi r^2.$$

That's exactly four times the area of a great circle (a circle through the center), $\pi r^2$.

### Example 5

Find the surface area of a ball with diameter 10 in.

$r = 5$: $S = 4\pi(25) = 100\pi \approx 314.2$ in².

### Example 6: a triangular prism

A tent is a triangular prism. Each triangular end is a right triangle with legs 6 and 8 (hypotenuse 10), and the tent is 12 long. Find the surface area.

**Step 1.** Each base has area $\tfrac12 \cdot 6 \cdot 8 = 24$; two bases give 48.

**Step 2.** The base perimeter is $6 + 8 + 10 = 24$, so the lateral area is $Ph = 24 \cdot 12 = 288$.

**Step 3.** $S = 288 + 48 = 336$.

## Common mistakes

- **Using height instead of slant height** in pyramid and cone lateral areas.
- **Counting one base instead of two** for prisms and cylinders (or two instead of one for pyramids and cones).
- **Using the diameter as the radius.**
- **Forgetting square units.**

## Key points

- Prism: $S = Ph + 2B$. Cylinder: $S = 2\pi rh + 2\pi r^2$.
- Pyramid: $S = \tfrac12 P\ell + B$. Cone: $S = \pi r\ell + \pi r^2$, with $\ell = \sqrt{r^2 + h^2}$.
- Sphere: $S = 4\pi r^2$.
- Euler's formula for polyhedra: $V - E + F = 2$.
