---
id: geo-m8-h-frustums-pappus
module: geo-m8
title: Frustums, spherical caps and Pappus's theorem
minutes: 45
honors: true
topics: [Frustums and caps, Pappus's theorem]
drills: [geo-m8-r2-frustum-volume, geo-m8-r2-cap-volume, geo-m8-r2-torus]
refs: [geo-ref-measure]
---
Lesson 34 found the volumes of whole cones and spheres. Real objects are often *pieces* of them (a bucket, a lampshade, the water in a bowl, a dome) or are made by spinning a shape (a ring, a pipe bend, a doughnut). This lesson builds three tools for them out of ideas you already have: similar solids, Cavalieri's principle, and solids of revolution from Lesson 33.

## The frustum of a cone

Slice a cone with a plane parallel to its base. The piece below the cut is a **frustum**: a solid with two parallel circular faces of different sizes, joined by a sloping side. Buckets, flowerpots and lampshades are frustums.

![A cone whose top has been sliced off parallel to the base. The remaining frustum has a bottom radius R, a top radius r, a dashed height h between the centers of the two circles, and a slanted side of length s. The small cone that was cut off is drawn with dashed lines above.](images/geo-m8-frustum.svg)

Let the bottom radius be $R$, the top radius $r$, and the height of the frustum $h$. The frustum is a big cone minus a small cone. The small cone is similar to the big one, so if the big cone's height is $H$,

$$\frac{H - h}{H} = \frac{r}{R}, \qquad\text{so}\qquad H = \frac{hR}{R - r}.$$

Subtracting the volumes, $\tfrac13 \pi R^2 H - \tfrac13 \pi r^2 (H - h) = \tfrac13 \pi \big[H(R^2 - r^2) + r^2 h\big]$. Since $R^2 - r^2 = (R - r)(R + r)$, the first term is $\tfrac{hR}{R - r} \cdot (R - r)(R + r) = hR(R + r)$, and the volume simplifies to

$$V_{\text{frustum}} = \frac{\pi h}{3}\left(R^2 + Rr + r^2\right).$$

Two checks: if $r = 0$ it becomes the cone $\tfrac13 \pi R^2 h$, and if $r = R$ it becomes the cylinder $\pi R^2 h$. A common wrong guess is "average the two circles and multiply by $h$"; that gives $\tfrac{\pi h}{2}(R^2 + r^2)$, which is always too big when $R \ne r$.

### Example 1: a bucket

A bucket is 24 cm deep, with a bottom radius of 10 cm and a top radius of 15 cm. How much does it hold?

**Step 1.** It is a frustum (upside down, but that doesn't matter) with $R = 15$, $r = 10$, $h = 24$.

**Step 2.** $R^2 + Rr + r^2 = 225 + 150 + 100 = 475$.

**Step 3.** $V = \tfrac{\pi \cdot 24}{3} \cdot 475 = 3800\pi \approx 11{,}938$ cm³, about 11.9 liters.

The same subtraction works for a pyramid cut parallel to its base. With base areas $B_1$ and $B_2$, the volume is $\tfrac{h}{3}\big(B_1 + B_2 + \sqrt{B_1 B_2}\big)$. This formula is very old: the Egyptian *Moscow Mathematical Papyrus* (about 1850 BCE) finds the volume of a square frustum with bottom side 4, top side 2 and height 6 as $\tfrac63(16 + 4 + 8) = 56$.

**Lateral area.** Unrolled, the sloping side of a frustum is a piece of a ring. Its area is the big cone's lateral area minus the small cone's, which (by the same similar-cones algebra) simplifies to

$$L_{\text{frustum}} = \pi (R + r)s, \qquad s = \sqrt{h^2 + (R - r)^2},$$

where $s$ is the frustum's own slant height, measured along the side between the two circles.

### Example 2: a lampshade

A lampshade, open at the top and bottom, has radii 15 cm and 10 cm and is 12 cm tall. How much fabric covers it?

**Step 1.** $s = \sqrt{12^2 + (15 - 10)^2} = \sqrt{169} = 13$ cm.

**Step 2.** $L = \pi(15 + 10)(13) = 325\pi \approx 1021$ cm². (No circles are added; both ends are open.)

## Spherical caps

A plane that cuts a ball slices off a **spherical cap**. Describe it by the sphere's radius $R$ and the cap's height $h$ (its thickness, from the cutting plane to the top of the sphere).

![A sphere of radius R with a cap above a horizontal cutting plane shaded. The cap has height h. A dashed segment of length R minus h runs from the center up to the center of the cut, a segment of length a runs along the cut to the sphere, and a radius R joins the center to that point, forming a right triangle.](images/geo-m8-spherical-cap.svg)

**The base of the cap.** The center of the sphere, the center of the cut, and a point on the cut's edge form a right triangle with legs $R - h$ and $a$ (the radius of the cut) and hypotenuse $R$. So $a^2 = R^2 - (R - h)^2 = h(2R - h)$.

**The volume.** Use Archimedes' comparison from Lesson 34. At height $y$ above the center, the hemisphere and the "cylinder minus cone" have equal cross sections, $\pi(R^2 - y^2)$. The cap is the part of the hemisphere from $y = R - h$ up to $y = R$, so it has the same volume as the slab of the cylinder-minus-cone between those heights. That slab is a cylinder of radius $R$ and height $h$, minus the part of the cone between those heights, and that part of the cone is a frustum with radii $R - h$ and $R$. So

$$V = \pi R^2 h - \frac{\pi h}{3}\left(R^2 + R(R - h) + (R - h)^2\right) = \pi R^2 h - \frac{\pi h}{3}\left(3R^2 - 3Rh + h^2\right),$$

which simplifies to

$$V_{\text{cap}} = \frac{\pi h^2}{3}(3R - h).$$

Checks: $h = R$ gives $\tfrac23 \pi R^3$, a hemisphere, and $h = 2R$ gives $\tfrac43 \pi R^3$, the whole ball.

**The curved area.** Archimedes also proved a remarkable fact, now called the **hat-box theorem**: the curved surface of a cap, or of any band of a sphere between two parallel planes, has area

$$S = 2\pi R h,$$

exactly the area of the matching band of a cylinder wrapped snugly around the sphere. Only the band's height matters, not where it sits. (Near the poles the sphere's surface is slanted, which adds area, but its circles are smaller, which removes area; the two effects cancel exactly. Proving that takes calculus or Archimedes' own careful argument.) With $h = 2R$ it gives $4\pi R^2$, the whole sphere, matching Lesson 33.

### Example 3: water in a bowl

A hemispherical bowl of radius 10 cm holds water 4 cm deep. Find the volume of the water and the area of its top surface.

**Step 1.** The water is a cap of a sphere with $R = 10$ and $h = 4$ (the bowl is upside down compared with the picture, which changes nothing).

**Step 2.** $V = \tfrac{\pi(16)}{3}(30 - 4) = \tfrac{416\pi}{3} \approx 435.6$ cm³.

**Step 3.** The surface is a circle with $a^2 = h(2R - h) = 4(16) = 64$, so $a = 8$ and its area is $64\pi \approx 201.1$ cm².

### Example 4: how much of Earth is in the Arctic?

Treat Earth as a sphere (it is slightly flattened, but this is close). The Arctic Circle is at latitude about $66.56^\circ$ N. What fraction of Earth's surface lies north of it?

**Step 1.** The plane of the Arctic Circle is $R\sin 66.56^\circ$ above Earth's center, so the polar cap has height $h = R(1 - \sin 66.56^\circ) \approx R(1 - 0.9175) = 0.0825R$.

**Step 2.** By the hat-box theorem the cap's area is $2\pi R h$, and the whole sphere is $4\pi R^2$. The fraction is $\tfrac{2\pi R h}{4\pi R^2} = \tfrac{h}{2R} \approx 0.041$.

About 4.1% of Earth's surface is north of the Arctic Circle.

## Pappus's theorem

Lesson 33 spun flat regions around an axis to make solids of revolution. Pappus of Alexandria, writing in the 300s CE, gave a beautiful shortcut for their volume. It uses the **centroid of a region**: its balance point, the point where a cardboard cutout of the region would balance on a pin. A rectangle's or a circle's centroid is its center, and a triangle's is the average of its vertices (Lesson 16).

**Pappus's theorem**. Spin a flat region of area $A$ around an axis in its plane that does not cut through the region. If its centroid is a distance $d$ from the axis, the solid swept out has volume

$$V = A \cdot 2\pi d,$$

the area times the distance the centroid travels. A companion rule gives surface area: a curve of length $\ell$ whose own centroid is a distance $d$ from the axis sweeps out an area $\ell \cdot 2\pi d$. (Both rules were rediscovered in the 1600s by Paul Guldin, so some books call them Guldin's theorems. A proof needs calculus.)

### Example 5: checking Pappus on solids we know

**A cone.** Spin a right triangle with legs $r$ (across) and $h$ (along the axis) around the leg $h$. Put the axis on the $y$-axis: the vertices are at $x = 0$, $0$ and $r$, so the centroid is at $x = \tfrac{r}{3}$. Pappus gives $V = \tfrac12 rh \cdot 2\pi \cdot \tfrac{r}{3} = \tfrac13 \pi r^2 h$ ✓.

**A pipe.** Spin a 2-by-6 rectangle around a line parallel to its long side, 3 units from the nearer side. It sweeps out a pipe with inner radius 3, outer radius 5 and length 6. The centroid is $3 + 1 = 4$ from the axis, so $V = 12 \cdot 2\pi \cdot 4 = 96\pi$. Subtracting cylinders agrees: $\pi(25 - 9)(6) = 96\pi$ ✓.

### Example 6: a doughnut

Spin a circle of radius $r$ around an axis a distance $R$ from its center ($R > r$). The solid is a **torus**, a doughnut shape.

![A torus around a vertical axis. On the right, a shaded circle of radius r is the cross section; its center is a distance R from the axis. A dotted circle through the centers of the cross sections shows the path of the centroid, of length 2 pi R.](images/geo-m8-torus.svg)

**Step 1.** The disk's centroid is its center, which travels $2\pi R$. Its area is $\pi r^2$, so $V = \pi r^2 \cdot 2\pi R = 2\pi^2 R r^2$.

**Step 2.** The boundary circle has length $2\pi r$ and its centroid is also the center, so the surface area is $S = 2\pi r \cdot 2\pi R = 4\pi^2 R r$.

**Step 3.** For a doughnut with $r = 1.5$ cm and $R = 4$ cm: $V = 2\pi^2(4)(2.25) = 18\pi^2 \approx 177.7$ cm³ and $S = 4\pi^2(4)(1.5) = 24\pi^2 \approx 236.9$ cm².

## Common mistakes

- **Averaging the two ends of a frustum.** The volume is $\tfrac{\pi h}{3}(R^2 + Rr + r^2)$, not $\pi h \cdot \tfrac{R^2 + r^2}{2}$.
- **Using the cone's full height** in the frustum formula; $h$ is the height of the frustum itself.
- **Mixing up $R$ and $a$ in a cap.** $R$ is the sphere's radius; $a$ is the radius of the flat cut.
- **Measuring Pappus's distance to the edge of the region.** It is the distance from the axis to the centroid, and the region must not cross the axis.

## Key points

- Frustum of a cone: $V = \tfrac{\pi h}{3}(R^2 + Rr + r^2)$, lateral area $\pi(R + r)s$.
- Spherical cap: $V = \tfrac{\pi h^2}{3}(3R - h)$, base radius $a$ with $a^2 = h(2R - h)$, curved area $2\pi R h$ (Archimedes' hat-box theorem).
- Pappus: volume of revolution $=$ area $\times$ distance traveled by the centroid; surface $=$ curve length $\times$ distance traveled by its centroid.
- Torus: $V = 2\pi^2 R r^2$, $S = 4\pi^2 R r$.
