---
id: calc-m7-h-pappus
module: calc-m7
title: 'Honors: Centroids and the theorems of Pappus'
minutes: 45
honors: true
topics: [Center of mass, Theorems of Pappus]
drills: [calc-m7-r2-centroid-between, calc-m7-r2-pappus-torus, calc-m7-r2-pappus-line]
refs: [calc-ref-applications]
---
## Two old rules, one new proof

Lesson 30 found the centroid of the region under a single curve and ended with a one-line surprise: the volume of a solid of revolution is the area of the region times the distance its centroid travels. This lesson takes that surprise seriously. First it extends centroids to regions between two curves. Then it proves the volume rule, adds a second rule for surface area, and uses both rules forward (to find volumes and areas with almost no integration) and backward (to find centroids from volumes you already know).

The rules are much older than calculus. Pappus of Alexandria stated them in Book VII of his *Collection*, written around AD 320, and Paul Guldin restated them in 1640, so they are often called the Pappus–Guldinus theorems. With integrals, the proofs take only a few lines.

## Moments of a region between two curves

Take a thin plate of uniform density filling the region between $y = f(x)$ on top and $y = g(x)$ below, for $a \le x \le b$. Slice it into vertical strips. A strip at $x$ has area $[f(x) - g(x)]\,\Delta x$, and its own balance point is halfway up the strip, at height $\frac12[f(x) + g(x)]$.

A moment is area times signed distance (the density cancels, so we can use area instead of mass). Adding the strips' moments gives the two moments of the region:

$$M_y = \int_a^b x\,[f(x) - g(x)]\,dx, \qquad M_x = \int_a^b \tfrac12[f(x) + g(x)][f(x) - g(x)]\,dx = \int_a^b \tfrac12\left[f(x)^2 - g(x)^2\right]dx.$$

The names follow the axis you measure from. The **moment about the y-axis**, $M_y$, uses distances $x$ from the $y$-axis, so it locates $\bar x$; the **moment about the x-axis**, $M_x$, uses heights $y$, so it locates $\bar y$:

$$\bar x = \frac{M_y}{A}, \qquad \bar y = \frac{M_x}{A}, \qquad A = \int_a^b[f(x) - g(x)]\,dx.$$

With $g = 0$ these are exactly Lesson 30's formulas. Note that the integrand of $M_x$ is $\frac12(f^2 - g^2)$, a difference of squares, not $\frac12(f - g)^2$: the factor $f + g$ comes from the strip's midpoint.

### Example 1

Find the centroid of the region between $y = x$ and $y = x^2$ for $0 \le x \le 1$.

1. The line is on top on $[0, 1]$. Area: $A = \int_0^1(x - x^2)\,dx = \frac12 - \frac13 = \frac16$.
2. $M_y = \int_0^1 x(x - x^2)\,dx = \frac13 - \frac14 = \frac1{12}$, so $\bar x = \dfrac{1/12}{1/6} = \dfrac12$.
3. $M_x = \int_0^1\frac12(x^2 - x^4)\,dx = \frac12\left(\frac13 - \frac15\right) = \frac1{15}$, so $\bar y = \dfrac{1/15}{1/6} = \dfrac25$.

The centroid is $\left(\frac12, \frac25\right)$. Sanity check: it must lie inside the region's horizontal and vertical extent, and at $x = \frac12$ the region runs from $y = \frac14$ to $y = \frac12$, so $\bar y = 0.4$ is inside. (A centroid doesn't always lie inside the region; for a crescent or a ring it can fall in the gap.)

```plot
{"x": [-0.2, 1.3], "y": [-0.2, 1.2], "equal": true, "functions": [{"f": "x"}, {"f": "x^2"}], "shade": [{"f": "x", "g": "x^2", "from": 0, "to": 1}], "points": [{"at": [0.5, 0.4]}], "labels": [{"at": [0.55, 0.75], "text": "y = x"}, {"at": [1.02, 0.55], "text": "y = x²"}], "caption": "The region between y = x and y = x² balances at its centroid (1/2, 2/5), the dot"}
```

## The first theorem of Pappus: volume

*Theorem.* If a plane region of area $A$ is rotated about a line in its plane that does not pass through the region's interior, the volume of the solid is

$$V = 2\pi\bar r\,A,$$

where $\bar r$ is the distance from the region's centroid to the axis. In words: volume = area × distance traveled by the centroid.

*Proof for a vertical axis.* Choose coordinates so the axis is the $y$-axis and the region (between $g$ and $f$ on $[a, b]$) lies on the side $x \ge 0$. Shells give

$$V = 2\pi\int_a^b x\,[f(x) - g(x)]\,dx = 2\pi M_y = 2\pi\,\bar x\,A,$$

and $\bar x$ is the centroid's distance to the axis. *Proof for a horizontal axis.* Put the axis on the $x$-axis with the region above it ($0 \le g \le f$). Washers give

$$V = \pi\int_a^b\left[f(x)^2 - g(x)^2\right]dx = 2\pi\int_a^b\tfrac12\left[f^2 - g^2\right]dx = 2\pi M_x = 2\pi\,\bar y\,A.$$

Either way, the volume integral *is* $2\pi$ times a moment. That's the whole theorem. Any axis can be moved to one of these two positions by shifting coordinates, so the rule holds for any axis in the plane that doesn't cut through the region.

### Example 2 (three volumes from one centroid)

Lessons 27 and 28 rotated the region of Example 1 about three different axes with three separate integrals. With the centroid $\left(\frac12, \frac25\right)$ and $A = \frac16$ in hand, each is one line:

| Axis | Distance $\bar r$ | $V = 2\pi\bar r A$ | Earlier answer |
|---|---|---|---|
| $x$-axis | $\frac25$ | $2\pi\cdot\frac25\cdot\frac16 = \frac{2\pi}{15}$ | Lesson 27, washers |
| $y = 2$ | $2 - \frac25 = \frac85$ | $2\pi\cdot\frac85\cdot\frac16 = \frac{8\pi}{15}$ | Lesson 27, washers |
| $x = 2$ | $2 - \frac12 = \frac32$ | $2\pi\cdot\frac32\cdot\frac16 = \frac{\pi}{2}$ | Lesson 28, shells |

All three agree. The work of computing the centroid is paid once and reused for every axis.

### Example 3 (a torus)

A **torus** (a doughnut shape) is made by rotating a disk of radius $r$ about an axis in its plane at distance $R$ from the disk's center, with $R \ge r$ so the axis doesn't cut the disk. Find its volume.

The disk's centroid is its center (by symmetry), at distance $R$ from the axis, and its area is $\pi r^2$. So

$$V = 2\pi R\cdot\pi r^2 = 2\pi^2Rr^2.$$

For $R = 3$ and $r = 1$: $V = 6\pi^2 \approx 59.22$. Doing this with shells instead leads to $4\pi\int_{R - r}^{R + r}x\sqrt{r^2 - (x - R)^2}\,dx$, which needs a trigonometric substitution (Lesson 32).

![A torus formed by rotating a disk about a vertical axis. The disk's center is at distance R from the axis, the disk has radius r, and a dashed circle shows the path of the center around the axis.](images/calc-m7-torus.svg)

Quick check with a shape you know: rotate the right triangle with vertices $(0, 0)$, $(a, 0)$ and $(0, h)$ about the $y$-axis. You get a cone of radius $a$ and height $h$. The centroid of a triangle is the average of its vertices, so $\bar x = \frac a3$, and Pappus gives $V = 2\pi\cdot\frac a3\cdot\frac{ah}{2} = \frac13\pi a^2h$, the familiar cone formula.

## Running the theorem backward

If you already know a volume, Pappus hands you a centroid.

### Example 4 (centroid of a half-disk)

Find the centroid of the upper half of the disk $x^2 + y^2 \le r^2$.

By symmetry $\bar x = 0$. For $\bar y$, rotate the half-disk about its diameter (the $x$-axis). The solid is a sphere, so

$$\frac43\pi r^3 = 2\pi\,\bar y\cdot\frac12\pi r^2 \quad\Longrightarrow\quad \bar y = \frac{4r}{3\pi} \approx 0.424r.$$

Computing $M_x = \int_{-r}^{r}\frac12(r^2 - x^2)\,dx = \frac23r^3$ directly and dividing by $\frac12\pi r^2$ gives the same thing, but the backward route needs no integral at all.

## The second theorem of Pappus: surface area

The **centroid of a curve** is the balance point of a thin uniform wire bent into that shape:

$$\bar x = \frac1L\int x\,ds, \qquad \bar y = \frac1L\int y\,ds,$$

where $L$ is the curve's length and $ds$ is the arc-length element of Lesson 29.

The **second theorem of Pappus** says: if a curve of length $L$ is rotated about a line in its plane that doesn't cross the curve, the area of the surface swept out is

$$S = 2\pi\bar r\,L,$$

with $\bar r$ the distance from the *curve's* centroid to the axis.

*Proof.* With the axis on the $x$-axis and the curve above it, Lesson 29 gives $S = \int 2\pi y\,ds = 2\pi\int y\,ds = 2\pi\,\bar y\,L$.

### Example 5

Find the surface area of the torus of Example 3.

The surface comes from rotating the boundary circle, of length $2\pi r$, whose centroid is again the center, at distance $R$:

$$S = 2\pi R\cdot2\pi r = 4\pi^2Rr.$$

For $R = 3$, $r = 1$: $S = 12\pi^2 \approx 118.4$.

### Example 6 (centroid of a semicircular arc)

Run the second theorem backward. Rotating the upper semicircle of radius $r$ (length $\pi r$) about its diameter gives a sphere's surface, $4\pi r^2$:

$$4\pi r^2 = 2\pi\,\bar y\cdot\pi r \quad\Longrightarrow\quad \bar y = \frac{2r}{\pi} \approx 0.637r.$$

Compare Example 4: the wire's centroid ($0.637r$) is higher than the half-disk's ($0.424r$). The half-disk includes all the area near the diameter, which pulls its balance point down; the wire has all its mass out on the arc.

## Common mistakes

- **Using the region's centroid for surface area.** The second theorem needs the centroid of the *curve*, which is usually in a different place (Examples 4 and 6).
- **Letting the axis cut through the region.** Rotate a whole disk about a diameter and the centroid lies on the axis, so $2\pi\bar r A = 0$, yet the sphere has volume. Parts on opposite sides of the axis sweep through the same space, so the theorem doesn't apply.
- *Writing $M_x = \int\frac12(f - g)^2\,dx$.* The correct integrand is $\frac12(f^2 - g^2)$.
- *Mixing up $M_x$ and $M_y$.* $M_y$ (distances from the $y$-axis) gives $\bar x$; $M_x$ gives $\bar y$.
- *Using $R$ for the wrong distance.* $\bar r$ is from the centroid to the axis, not from the axis to the near edge of the region.
- *Forgetting the $2\pi$.* The centroid travels a full circle of length $2\pi\bar r$.

## Key points

- Region between $g$ and $f$: $M_y = \int x(f - g)\,dx$, $M_x = \int\frac12(f^2 - g^2)\,dx$, $\bar x = M_y/A$, $\bar y = M_x/A$.
- Pappus (volume): $V = 2\pi\bar r A$; it's the shell or washer integral written as $2\pi$ times a moment.
- Pappus (surface): $S = 2\pi\bar r L$ with the curve's centroid.
- The axis may touch the region's edge but not cut through it.
- Backward: known volume or area gives a centroid (half-disk $\frac{4r}{3\pi}$, semicircular arc $\frac{2r}{\pi}$).
- Torus: $V = 2\pi^2Rr^2$, $S = 4\pi^2Rr$.
