---
id: geo-basics
module: geo-m1
title: Points, lines and planes
minutes: 25
topics: [Undefined terms, Postulates]
drills: [geo-segadd]
refs: [geo-ref-theorems]
---
Geometry is the study of shape, size and position, and it is built the way a house is built: from the ground up. Before we can talk about triangles or circles, we need a small set of basic objects and a few rules about how they behave. This first lesson sets up that foundation. Everything later in the course, from congruent triangles to the volume of a cone, rests on the words and rules introduced here.

## Three words we do not define

Every definition uses other words. If you tried to define every word, you would either go in circles or never finish. Geometry solves this by choosing three **undefined terms** and describing them by example instead of by definition.

- A **point** marks an exact location. It has no length, width or thickness. We draw it as a dot and name it with a capital letter, such as point $A$.
- A **line** is a straight path of points that extends forever in both directions. It has length but no width. We name it with two of its points, $\overleftrightarrow{AB}$, or with a single lowercase letter, such as line $\ell$.
- A **plane** is a flat surface that extends forever in every direction, with no thickness. We name it with three points that are not on one line, such as plane $ABC$, or with a single capital script letter, such as plane $\mathcal{P}$.

Why leave these undefined? Because any definition of "point" would need words like "location", which would need defining in turn. Instead, we agree on how points, lines and planes *behave*, through rules called postulates. That agreement is enough to build all of geometry.

## Words we do define

With the undefined terms in hand, we can define new objects precisely.

- Points are **collinear** if one line passes through all of them, and **coplanar** if one plane contains all of them.
- A **segment** $\overline{AB}$ is the part of a line made of $A$, $B$ and every point between them. $A$ and $B$ are its **endpoints**. Its length is written $AB$ (no bar).
- A **ray** $\overrightarrow{AB}$ starts at the endpoint $A$ and goes through $B$ forever. The order of the letters matters: $\overrightarrow{AB}$ and $\overrightarrow{BA}$ point in opposite directions.
- **Opposite rays** share an endpoint and point in opposite directions along one line; together they form a line.
- An **intersection** of two figures is the set of points they have in common.

```shape
{"segments": [{"from": [0, 0], "to": [10, 0], "arrow": true}, {"from": [10, 0], "to": [0, 0], "arrow": true}, {"from": [0, -2], "to": [6, -2]}, {"from": [0, -4], "to": [10, -4], "arrow": true}], "points": [{"at": [3, 0], "label": "A"}, {"at": [7, 0], "label": "B"}, {"at": [0, -2], "label": "C"}, {"at": [6, -2], "label": "D"}, {"at": [0, -4], "label": "E"}, {"at": [4, -4], "label": "F"}], "caption": "Top: line AB. Middle: segment CD. Bottom: ray EF, which starts at E."}
```

Notice that a line and a segment differ only in how far they go: the segment stops at its endpoints, the line never does.

## Postulates: rules we accept

A **postulate** (also called an **axiom**) is a statement accepted as true without proof. A **theorem**, by contrast, is a statement that has been proved from postulates, definitions and earlier theorems. The basic postulates about points, lines and planes match what you would expect from drawing:

1. **Two points determine a line.** Through any two points there is exactly one line.
2. **Three noncollinear points determine a plane.** Through any three points not on one line there is exactly one plane.
3. If two points lie in a plane, the whole line through them lies in that plane.
4. **Two lines meet in at most one point.** If two distinct lines intersect, their intersection is exactly one point.
5. **Two planes meet in a line.** If two distinct planes intersect, their intersection is a line.

These are the reasons a three-legged stool never wobbles (three feet ends are three noncollinear points, so they fit one plane, the floor) while a four-legged chair can (four points need not be coplanar). They are also why a crease in folded paper is straight: it is where two flat planes meet.

```shape
{"polygons": [{"points": [[0, 0], [8, 0], [10, 3], [2, 3]]}, {"points": [[4, -2], [8, 1.5], [8, 6], [4, 2.5]]}], "segments": [{"from": [4, -2], "to": [8, 1.5], "dashed": true}], "labels": [{"at": [1.6, 0.6], "text": "P"}, {"at": [7.2, 4.8], "text": "Q"}], "caption": "Two planes P and Q meet along a line."}
```

### Example 1

Points $A$, $B$ and $C$ are not collinear. How many lines can be drawn through two of them, and how many planes contain all three?

**Step 1.** Each pair of points determines exactly one line (postulate 1). The pairs are $AB$, $AC$ and $BC$, so there are **3 lines**.

**Step 2.** The three points are noncollinear, so exactly one plane contains them (postulate 2). There is **1 plane**.

If the points *were* collinear, all three pairs would give the same line, and infinitely many planes would contain that line (think of pages of a book turning around the spine).

## Segment addition

Between-ness gives us our first measurement rule. If $B$ is on segment $\overline{AC}$, between $A$ and $C$, then the two smaller pieces add up to the whole:

$$AB + BC = AC.$$

This is the **Segment Addition Postulate**. It is "obvious", but it is the tool behind many algebra-in-geometry problems.

```shape
{"segments": [{"from": [0, 0], "to": [4, 0], "label": "2x + 1"}, {"from": [4, 0], "to": [10, 0], "label": "3x − 4"}], "points": [{"at": [0, 0], "label": "A"}, {"at": [4, 0], "label": "B"}, {"at": [10, 0], "label": "C"}], "labels": [{"at": [5, -1.2], "text": "AC = 22"}], "caption": "B lies between A and C."}
```

### Example 2

$B$ is between $A$ and $C$, with $AB = 2x + 1$, $BC = 3x - 4$ and $AC = 22$. Find $x$ and the length of each piece.

**Step 1.** Write the segment addition equation: $(2x + 1) + (3x - 4) = 22$.

**Step 2.** Combine like terms: $5x - 3 = 22$, so $5x = 25$ and $x = 5$.

**Step 3.** Substitute back: $AB = 2(5) + 1 = 11$ and $BC = 3(5) - 4 = 11$.

**Check.** $11 + 11 = 22$. The two pieces happen to be equal, so $B$ is actually the midpoint of $\overline{AC}$ (next lesson).

Always finish a problem like this by substituting $x$ back in. The question usually asks for lengths, not just $x$, and a negative length would tell you an equation was set up wrong.

## Space, collinear and coplanar in practice

We usually draw on paper, which is a plane, but geometry also lives in three-dimensional **space**, the set of all points. Lines in space can do something lines in a plane cannot: they can miss each other without being parallel. Two lines that are not coplanar are called **skew lines**. Think of a road on an overpass and a road underneath going a different direction: they never meet, yet they are not parallel.

### Example 3

In a rectangular box with top face $ABCD$ and bottom face $EFGH$ (with $E$ under $A$, $F$ under $B$, and so on), classify the pair of lines $\overleftrightarrow{AB}$ and $\overleftrightarrow{GH}$, and the pair $\overleftrightarrow{AB}$ and $\overleftrightarrow{CG}$.

**Step 1.** $\overleftrightarrow{AB}$ runs along the top front edge and $\overleftrightarrow{GH}$ runs along the bottom back edge in the same direction. They lie in one plane (the slanted plane $ABGH$) and never meet, so they are **parallel**.

**Step 2.** $\overleftrightarrow{CG}$ is a vertical edge at the back. It does not meet $\overleftrightarrow{AB}$, and no plane contains both, so they are **skew**.

## Common mistakes

- **Mixing up notation.** $\overline{AB}$ is the segment (a set of points), $AB$ is its length (a number), $\overrightarrow{AB}$ is a ray and $\overleftrightarrow{AB}$ is a line. Writing $\overline{AB} = 5$ mixes a figure with a number.
- **Reversing a ray.** $\overrightarrow{AB}$ starts at $A$. $\overrightarrow{BA}$ starts at $B$. They are different rays.
- **Assuming points are coplanar or collinear from a sketch.** Any three points are coplanar, but four may not be. Only conclude collinearity if you are told or can prove it.
- **Forgetting to answer the question.** In segment addition problems, finding $x$ is usually just the middle step.
- **Thinking non-intersecting lines must be parallel.** In space they may be skew.

## Key points

- Point, line and plane are undefined; everything else is defined from them.
- Postulates are accepted without proof; theorems are proved.
- Two points determine a line; three noncollinear points determine a plane; two lines meet in at most a point; two planes meet in a line.
- Segment Addition: if $B$ is between $A$ and $C$, then $AB + BC = AC$.
- Lines in space can be intersecting, parallel or skew.
