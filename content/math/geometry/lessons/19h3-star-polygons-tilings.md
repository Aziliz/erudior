---
id: geo-m5-h-tilings
module: geo-m5
title: 'Honors: Turning angles, star polygons and tilings'
minutes: 45
honors: true
topics: [Turning and star polygons, Tilings]
drills: [geo-m5-r2-star-angle, geo-m5-r2-vertex-fill]
refs: [geo-ref-theorems]
---
Lesson 17 gave two angle facts about polygons: the interior angles of an $n$-gon add to $(n - 2) \cdot 180^\circ$, and the exterior angles of a convex polygon add to $360^\circ$, because walking once around the polygon turns you through one full revolution. It ended by asking which single regular polygon tiles the plane: only triangles, squares and hexagons. This lesson takes the walking idea seriously. Counting turns with signs handles concave polygons; counting how many times you circle the center handles star polygons; and adding angles around a point tells you exactly which *mixtures* of regular polygons can tile the plane.

## Turning around a concave polygon

Walk counterclockwise around a polygon, so the inside is on your left. At each vertex you turn left by the exterior angle, $180^\circ$ minus the interior angle. At a convex vertex that's a left turn between $0^\circ$ and $180^\circ$.

A concave polygon has at least one **reflex angle**, an interior angle greater than $180^\circ$. At that vertex, $180^\circ - (\text{interior})$ is negative, and indeed you turn *right*. Count left turns as positive and right turns as negative. Then:

**Turning Theorem (for polygons).** Walking once around any polygon whose sides don't cross, the signed turns add to exactly $360^\circ$.

The walk-around picture makes this believable: you end facing the way you started, having made one net revolution. A fully careful proof is harder than it looks (it's a special case of a result in topology), so we accept it here. It immediately gives the interior angle sum for *every* such polygon, concave or not. Adding $180^\circ - (\text{interior})$ over all $n$ vertices:

$$180n - S = 360, \qquad\text{so}\qquad S = (n - 2) \cdot 180^\circ.$$

### Example 1

An L-shaped hexagon has vertices $(0, 0)$, $(6, 0)$, $(6, 2)$, $(2, 2)$, $(2, 5)$ and $(0, 5)$. Check both theorems.

```shape
{"polygons": [{"points": [[0, 0], [6, 0], [6, 2], [2, 2], [2, 5], [0, 5]]}], "labels": [{"at": [2.6, 2.6], "text": "270°"}, {"at": [0.5, 0.45], "text": "90°"}, {"at": [5.5, 0.45], "text": "90°"}, {"at": [5.5, 1.55], "text": "90°"}, {"at": [1.5, 4.55], "text": "90°"}, {"at": [0.5, 4.55], "text": "90°"}], "caption": "An L-shaped hexagon: five 90° angles and one reflex angle of 270°."}
```

**Step 1.** Five interior angles are $90^\circ$ and the one at $(2, 2)$ is reflex, $270^\circ$. Sum: $5 \cdot 90 + 270 = 720^\circ = (6 - 2) \cdot 180^\circ$. ✓

**Step 2.** Turns: five left turns of $90^\circ$, and at $(2, 2)$ a turn of $180 - 270 = -90^\circ$, a right turn. Total: $450 - 90 = 360^\circ$. ✓

Notice that the plain exterior-angle sum (Lesson 17) is stated for convex polygons because at a reflex vertex the "exterior angle" isn't an angle you can draw outside; the signed turn fixes that.

## Star polygons

Put $n$ points evenly around a circle and join every $k$th point: $P_0$ to $P_k$ to $P_{2k}$, and so on, until you return to $P_0$. If $k$ and $n$ have no common factor (other than 1) and $1 < k < \tfrac{n}{2}$, you visit every point once and get a **star polygon**, written with the **Schläfli symbol** $\{n/k\}$. The pentagram is $\{5/2\}$; there are two seven-pointed stars, $\{7/2\}$ and $\{7/3\}$. ($\{6/2\}$ is not one star: joining every second of six points draws one triangle and stops, so the six-pointed star is two overlapping triangles.)

```shape
{"polygons": [{"points": [[0, 4], [-2.351, -3.236], [3.804, 1.236], [-3.804, 1.236], [2.351, -3.236]]}], "circles": [{"center": [0, 0], "r": 4}], "labels": [{"at": [0, 2.7], "text": "36°"}], "caption": "The pentagram {5/2}: each tip angle is 36°."}
```

Walk along a star polygon and count your turning. Each step moves you $k$ places around the circle, so by the time you return to the start you have gone around the center $k$ times, and your total turning is $360k$ degrees. (This is the walk-around idea again; we take it from the picture.) All $n$ turns are equal, so each is $\tfrac{360k}{n}$, and the angle at each tip is what's left of a straight angle:

$$\text{tip angle of } \{n/k\} = 180^\circ - \frac{360^\circ k}{n}, \qquad \text{sum of the } n \text{ tip angles} = 180n - 360k = 180(n - 2k) \text{ degrees}.$$

With $k = 1$ this is the ordinary regular polygon. A second check uses inscribed angles (Lesson 29): the tip at $P_0$ is an inscribed angle whose intercepted arc runs from $P_k$ to $P_{n-k}$, which is $n - 2k$ of the $n$ equal arcs. Half of that arc is $\tfrac12 \cdot \tfrac{360(n - 2k)}{n} = 180 - \tfrac{360k}{n}$, the same answer.

### Example 2

Find the tip angle and the tip-angle sum of the pentagram $\{5/2\}$ and of the sharper heptagram $\{7/3\}$.

**Pentagram.** $180 - \tfrac{360 \cdot 2}{5} = 180 - 144 = 36^\circ$; the five tips add to $180(5 - 4) = 180^\circ$, the same as one triangle.

**Heptagram $\{7/3\}$.** $180 - \tfrac{360 \cdot 3}{7} = 180 - \tfrac{1080}{7} = \tfrac{180}{7} \approx 25.71^\circ$; the seven tips add to $180(7 - 6) = 180^\circ$ again. (For $\{7/2\}$, each tip is $\tfrac{540}{7} \approx 77.14^\circ$ and the sum is $540^\circ$.)

### Example 3

Which star polygon has tip angles of $45^\circ$?

**Step 1.** $180 - \tfrac{360k}{n} = 45$ gives $\tfrac{360k}{n} = 135$, so $\tfrac{k}{n} = \tfrac{135}{360} = \tfrac38$.

**Step 2.** In lowest terms, $k = 3$ and $n = 8$: the octagram $\{8/3\}$. (Other fractions equal to $\tfrac38$, like $\tfrac{6}{16}$, share a factor, so they don't give a single star.)

## Tiling with more than one regular polygon

A **tessellation** by regular polygons is **edge-to-edge** if polygons meet only full side to full side (no vertex lands in the middle of another polygon's side). The polygons around a vertex are listed in order by their numbers of sides: the **vertex configuration**. Squares meeting four at a point are $4.4.4.4$; the tiling with a square and two octagons at every vertex is $4.8.8$.

![Four square patches of tilings by regular polygons. 4.8.8: octagons with small squares in the gaps. 3.6.3.6: hexagons meeting corner to corner, with triangles between them, so triangle and hexagon alternate around each vertex. 3.12.12: dodecagons with small triangles in the gaps. 4.6.12: dodecagons separated by squares, with hexagons filling the rest.](images/geo-m5-tilings.svg)

The basic condition is that the angles at a vertex add to $360^\circ$. A regular $n$-gon's angle is $180 - \tfrac{360}{n}$, so for three polygons with $a$, $b$ and $c$ sides:

$$\left(180 - \frac{360}{a}\right) + \left(180 - \frac{360}{b}\right) + \left(180 - \frac{360}{c}\right) = 360 \quad\Longleftrightarrow\quad \frac1a + \frac1b + \frac1c = \frac12.$$

Similar equations hold for four polygons ($\tfrac1a + \tfrac1b + \tfrac1c + \tfrac1d = 1$), five and six. More than six is impossible, since each angle is at least $60^\circ$. Solving them by checking cases gives exactly 17 combinations of regular polygons that fit around a point, and 21 **vertex types** once you count different orders (3.3.6.6 and 3.6.3.6 use the same polygons in different orders).

### Example 4

A square and a regular hexagon meet at a vertex, with one more regular polygon filling the gap. What is it?

**Step 1.** The angles so far: $90^\circ + 120^\circ = 210^\circ$.

**Step 2.** The third angle must be $360 - 210 = 150^\circ$, so its exterior angle is $30^\circ$ and $n = \tfrac{360}{30} = 12$.

The vertex is $4.6.12$, one of the tilings in the picture. (With the equation: $\tfrac14 + \tfrac16 + \tfrac1c = \tfrac12$ gives $\tfrac1c = \tfrac1{12}$.)

## Fitting at one point is not enough

Fitting around one point doesn't guarantee a whole tiling. Take $3.7.42$: $60 + \tfrac{900}{7} + \tfrac{1200}{7} = 60 + 300 = 360$, so a triangle, a heptagon and a 42-gon fit around a point. But try to make *every* vertex look like that.

### Example 5

Show that no tiling has every vertex of type $3.7.42$.

**Step 1.** Look at one triangle. At each of its three corners, the other two polygons are a 7-gon and a 42-gon. The triangle's two sides at that corner touch those two other polygons, one each.

**Step 2.** So walking around the triangle, the neighbors across its sides must alternate: 7-gon, 42-gon, 7-gon, …

**Step 3.** Number the triangle's sides 1, 2, 3. If side 1 borders a 7-gon, then side 2 borders the 42-gon and side 3 a 7-gon. But sides 3 and 1 meet at a corner, so they must border *different* polygons, and both border 7-gons. Contradiction: an odd number of sides can't alternate between two kinds.

The same argument shows that if a vertex type $a.b.c$ has $a$ odd, then $b = c$. That rules out $3.7.42$, $3.8.24$, $3.9.18$, $3.10.15$, $4.5.20$ (look at the pentagon) and $5.5.10$, and it allows $3.12.12$. In fact those six vertex types can't appear in any edge-to-edge tiling by regular polygons, even mixed with other vertex types. Four more ($3.3.4.12$, $3.4.3.12$, $3.3.6.6$ and $3.4.4.6$) can't be the *only* vertex type, though they do turn up in tilings that mix vertex types.

That leaves 11 tilings in which every vertex looks the same: the 3 regular tilings ($3.3.3.3.3.3$, $4.4.4.4$, $6.6.6$) and 8 **semiregular tilings**, also called Archimedean tilings ($3.12.12$, $4.6.12$, $4.8.8$, $3.6.3.6$, $3.4.6.4$, $3.3.3.3.6$, $3.3.3.4.4$, $3.3.4.3.4$). Johannes Kepler gave the first systematic treatment of these tilings in *Harmonices Mundi* (1619).

## Common mistakes

- **Ignoring signs at a reflex vertex.** The turn there is negative; counting it as positive makes the turns add to more than $360^\circ$.
- **Using $k$ and $n$ with a common factor.** $\{6/2\}$ and $\{8/2\}$ are not single star polygons.
- **Forgetting the order in a vertex configuration.** $3.3.6.6$ and $3.6.3.6$ are different vertex types.
- **Assuming that angles adding to $360^\circ$ at one point guarantees a tiling.** $3.7.42$ fits at a point but tiles nothing.

## Key points

- Count turns with signs (right turns negative): the turns around any polygon whose sides don't cross add to $360^\circ$, which gives $(n - 2) \cdot 180^\circ$ for concave polygons too.
- Star polygon $\{n/k\}$ ($k$, $n$ with no common factor, $1 < k < \tfrac n2$): total turning $360k$ degrees, tip angle $180 - \tfrac{360k}{n}$, tip sum $180(n - 2k)$.
- Regular polygons fit around a point when their angles add to $360^\circ$; for three polygons, $\tfrac1a + \tfrac1b + \tfrac1c = \tfrac12$. There are 17 combinations and 21 vertex types.
- If $a$ is odd in $a.b.c$, then $b = c$ for the vertex type to repeat; 11 tilings have every vertex alike: 3 regular and 8 semiregular.
