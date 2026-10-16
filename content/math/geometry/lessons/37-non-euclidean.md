---
id: geo-non-euclid
module: geo-m10
title: Non-Euclidean geometry
minutes: 35
topics: [Non-Euclidean geometry]
drills: [geo-sph-excess, geo-great-circle]
refs: [geo-ref-theorems]
---
For two thousand years mathematicians tried to prove Euclid's parallel postulate from the other four. In the early 1800s, Gauss, Bolyai and Lobachevsky independently tried something bolder: *replace* it with its opposite and see what happens. Instead of a contradiction, they found a whole new, perfectly consistent geometry. This lesson introduces the two classic non-Euclidean geometries, hyperbolic and spherical (elliptic), and shows how the parallel postulate controls the angle sum of a triangle.

## Three possibilities for parallels

Given a line $\ell$ and a point $P$ not on it, how many lines through $P$ never meet $\ell$?

| Geometry | Parallels through $P$ | Triangle angle sum |
|---|---|---|
| Euclidean | exactly one | $= 180^\circ$ |
| **Hyperbolic geometry** | infinitely many | $< 180^\circ$ |
| **Elliptic geometry** (spherical) | none | $> 180^\circ$ |

Each choice gives a consistent geometry. Since hyperbolic geometry satisfies Euclid's first four postulates but not the fifth, the fifth can't be a consequence of the first four: it is **independent**. That settled the two-thousand-year question.

## Spherical geometry

On the surface of a sphere, the "straight lines" (shortest paths) are **great circles**: circles whose center is the center of the sphere, like the equator or the lines of longitude. Airline routes follow great circles, which is why a flight from Chicago to Rome arcs up toward the north.

- Any two great circles intersect (in two opposite points), so *there are no parallel lines*.
- Lines have finite length (one great circle is $2\pi R$ around).
- Two "points" (opposite points counted as one, in the version called elliptic geometry) determine a line.

Spherical geometry breaks Euclid's second postulate as well (lines don't extend forever), which is why mathematicians usually study the related **elliptic geometry** in which opposite points are identified.

### Triangles on a sphere

A **spherical triangle** is formed by three arcs of great circles. Its angles add to *more* than $180^\circ$.

Example: start at the North Pole, go down a line of longitude to the equator, turn $90^\circ$, travel a quarter of the way around the equator, turn $90^\circ$ again, and head back up to the pole. The triangle has three right angles: an angle sum of $270^\circ$.

```shape
{"circles": [{"center": [0, 0], "r": 5}], "curves": [{"x": "5cos(t)", "y": "1.2sin(t)", "t": [3.1416, 6.2832]}, {"x": "5cos(t)", "y": "1.2sin(t)", "t": [0, 3.1416], "dashed": true}, {"x": "-3.536cos(t)", "y": "-0.849 + 5.849sin(t)", "t": [0, 1.5708]}], "segments": [{"from": [0, 5], "to": [0, -1.2]}], "points": [{"at": [0, 5], "label": "N"}, {"at": [0, -1.2]}, {"at": [-3.536, -0.849]}], "caption": "A spherical triangle: the North Pole N and two points on the equator, joined by great-circle arcs."}
```

**Spherical excess.** The amount by which the angle sum exceeds $180^\circ$ is the **spherical excess** $E$. A remarkable theorem (Girard's theorem) says the triangle's area is proportional to its excess:

$$\text{Area} = R^2 \cdot E, \qquad E \text{ in radians} = \frac{\pi}{180}\left(A + B + C - 180^\circ\right).$$

### Example 1

Find the area of the three-right-angle triangle above on a sphere of radius $R$.

**Step 1.** $E = 270^\circ - 180^\circ = 90^\circ = \tfrac{\pi}{2}$ radians.

**Step 2.** Area $= R^2 \cdot \tfrac{\pi}{2} = \tfrac{\pi R^2}{2}$.

**Check.** The sphere's total area is $4\pi R^2$, and this triangle covers one octant (one-eighth) of the sphere: $\tfrac{4\pi R^2}{8} = \tfrac{\pi R^2}{2}$ ✓.

### Example 2

On Earth (radius about 6371 km), a triangle has angles $62^\circ$, $71^\circ$ and $50^\circ$. Find its area.

**Step 1.** Excess: $62 + 71 + 50 - 180 = 3^\circ = \tfrac{3\pi}{180} \approx 0.05236$ rad.

**Step 2.** Area $\approx 6371^2 \cdot 0.05236 \approx 2.125 \times 10^6$ km².

Small triangles have tiny excess, which is why Earth looks Euclidean on a city map.

## Hyperbolic geometry

In hyperbolic geometry, through a point not on a line there are infinitely many parallels. It is harder to picture because it doesn't fit naturally on a surface in ordinary space. The most common picture is the **Poincaré disk model**: the "plane" is the inside of a circle, and the "lines" are diameters and circular arcs that meet the boundary circle at right angles. Distances grow without bound toward the edge, so the boundary is infinitely far away.

```shape
{"circles": [{"center": [0, 0], "r": 5}], "segments": [{"from": [-5, 0], "to": [5, 0]}], "curves": [{"x": "-3 + 7.6273sin(t)", "y": "8.6125 - 7.6273cos(t)", "t": [-0.245, 0.915]}, {"x": "0 + 7.0125sin(t)", "y": "8.6125 - 7.0125cos(t)", "t": [-0.619, 0.619]}, {"x": "3 + 7.6273sin(t)", "y": "8.6125 - 7.6273cos(t)", "t": [-0.915, 0.245]}], "points": [{"at": [0, 1.6], "label": "P"}], "labels": [{"at": [4, -0.5], "text": "ℓ"}], "caption": "Poincaré disk: three different 'lines' through P (arcs meeting the rim at right angles) never meet ℓ."}
```

In hyperbolic geometry:

- the angle sum of every triangle is less than $180^\circ$, and the **defect** $180^\circ - (A + B + C)$ is proportional to the area;
- similar triangles are automatically congruent (AAA is a congruence test!);
- rectangles don't exist.

Each of these differs from Euclid exactly where the parallel postulate was used.

## Why this matters

Non-Euclidean geometry showed that axioms are *choices*, not self-evident truths, and that geometry is about the logical consequences of those choices. It also turned out to describe reality: Einstein's general relativity (1915) models spacetime as curved, and the geometry of large regions of space is a question for measurement, not for Euclid's postulates.

## Common mistakes

- **Thinking non-Euclidean geometry is "wrong".** It's consistent; it simply starts from a different parallel axiom.
- **Using degrees in the area formula.** Convert the excess to radians.
- **Calling a line of latitude a great circle.** Only the equator is; the others are smaller circles and aren't shortest paths.
- **Assuming Euclidean theorems carry over.** Anything proved with the parallel postulate (angle sums, similar triangles, the Pythagorean theorem) can fail.

## Key points

- Euclidean: one parallel, triangle sum $180^\circ$. Hyperbolic: many parallels, sum $< 180^\circ$. Elliptic (spherical): no parallels, sum $> 180^\circ$.
- On a sphere the lines are great circles; triangle area $= R^2 E$ with excess $E$ in radians.
- The existence of hyperbolic geometry proves the parallel postulate is independent of Euclid's other postulates.
