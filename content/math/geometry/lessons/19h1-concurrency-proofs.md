---
id: geo-m5-h-concurrency
module: geo-m5
title: 'Honors: Proving the triangle centers exist'
minutes: 45
honors: true
topics: [Concurrency proofs, Euler line]
drills: [geo-m5-r2-orthocenter, geo-m5-r2-euler]
refs: [geo-ref-theorems, geo-ref-coord]
---
Lessons 15 and 16 introduced four triangle centers. Two of them came with proofs: the perpendicular bisectors meet at the circumcenter, and the angle bisectors meet at the incenter. The other two were stated without proof: that the medians meet at a point two-thirds of the way along each one, and that the altitudes meet at all. Lesson 16 also mentioned Euler's surprising discovery that three of the centers always lie on one line. This lesson proves all three facts, using nothing beyond midsegments, parallelograms and a little algebra with coordinates. Along the way you'll see two of the most useful moves in geometry: building a helper figure, and choosing coordinates that make the algebra easy.

## Why concurrency needs a proof

Draw three lines at random and they almost never pass through one point. Two lines cross somewhere; the third usually misses that crossing and forms a small triangle with the other two. So when three special lines of a triangle *always* meet at one point, that's a theorem that needs a reason.

Every concurrency proof in this lesson has the same plan, the one used for the circumcenter in Lesson 15:

1. Take two of the three lines and let them meet at a point.
2. Show that this point has some property that forces it onto the third line too.

## The centroid: why medians split 2 : 1

Let $\overline{AD}$ and $\overline{BE}$ be medians of $\triangle ABC$, so $D$ is the midpoint of $\overline{BC}$ and $E$ is the midpoint of $\overline{AC}$. Two medians from different vertices always cross inside the triangle; call the crossing point $G$. Now build a helper figure: let $M$ be the midpoint of $\overline{AG}$ and $N$ the midpoint of $\overline{BG}$.

![Triangle ABC with medians AD and BE crossing at G. M is the midpoint of AG and N is the midpoint of BG. The quadrilateral M N D E is shaded; its top side ED and bottom side MN are both parallel to AB, and its diagonals are MD and NE, which cross at G. Tick marks show D is the midpoint of BC, E is the midpoint of AC, and AM equals MG.](images/geo-m5-centroid-proof.svg)

**Step 1.** In $\triangle ABC$, $\overline{ED}$ joins the midpoints of two sides, so it is a midsegment: $\overline{ED} \parallel \overline{AB}$ and $ED = \tfrac12 AB$.

**Step 2.** In $\triangle ABG$, $\overline{MN}$ joins the midpoints of two sides, so it is also a midsegment: $\overline{MN} \parallel \overline{AB}$ and $MN = \tfrac12 AB$.

**Step 3.** So $\overline{MN}$ and $\overline{ED}$ are parallel (both are parallel to $\overline{AB}$) and congruent (both are half of $AB$). One pair of opposite sides both parallel and congruent makes $MNDE$ a parallelogram (test 5, Lesson 18).

**Step 4.** The diagonals of a parallelogram bisect each other. The diagonals of $MNDE$ are $\overline{MD}$ and $\overline{NE}$, and they cross at $G$. So $MG = GD$ and $NG = GE$.

**Step 5.** $M$ is the midpoint of $\overline{AG}$, so $AM = MG$. Together with Step 4, $AM = MG = GD$: the median $\overline{AD}$ is cut into three equal pieces, and $AG = 2\,GD$. In the same way $BN = NG = GE$, so $BG = 2\,GE$.

That proves the $2 : 1$ split for these two medians. Now concurrency. Run the same argument on medians $\overline{AD}$ and $\overline{CF}$ (where $F$ is the midpoint of $\overline{AB}$): they meet at a point that is also two-thirds of the way from $A$ to $D$. But only *one* point of $\overline{AD}$ is two-thirds of the way from $A$, namely $G$. So the third median passes through $G$ as well, and all three medians are concurrent. $\blacksquare$

### Example 1

In the figure, $AB = 18$ and $GD = 5$. Find $ED$, $MN$, $AG$ and $AD$.

**Step 1.** Both midsegments are half of $AB$: $ED = MN = 9$.

**Step 2.** The proof showed $AM = MG = GD$, so each third of the median is 5. Then $AG = 10$ and $AD = 15$.

**Check.** $AG = 2\,GD$: $10 = 2 \cdot 5$. ✓

## The orthocenter: borrowing the circumcenter

The altitudes are harder, because an altitude has no "equidistant" property to work with. The trick is to make them into perpendicular bisectors of a *different* triangle, then quote the Circumcenter Theorem.

Through each vertex of $\triangle ABC$, draw the line parallel to the opposite side. The three new lines form a larger triangle $A'B'C'$, with $A'$ opposite $A$, and so on.

![A small acute triangle ABC sits inside a larger triangle A′B′C′. A is the midpoint of side B′C′, B is the midpoint of side A′C′, and C is the midpoint of side A′B′, shown by matching tick marks. The three altitudes of ABC are drawn dashed; each one meets a side of ABC at a right angle, and all three cross at the point H.](images/geo-m5-anticomplementary.svg)

**Step 1.** $\overline{AC'} \parallel \overline{BC}$ and $\overline{BC'} \parallel \overline{AC}$ by construction, so $AC'BC$ is a parallelogram and $AC' = BC$. Likewise $AB'CB$... more simply, $ABCB'$ is a parallelogram ($\overline{AB'} \parallel \overline{BC}$ and $\overline{B'C} \parallel \overline{AB}$), so $AB' = BC$.

**Step 2.** So $AB' = AC'$: $A$ is the midpoint of $\overline{B'C'}$. In the same way $B$ is the midpoint of $\overline{A'C'}$ and $C$ is the midpoint of $\overline{A'B'}$.

**Step 3.** The altitude from $A$ is perpendicular to $\overline{BC}$. Since $\overline{B'C'} \parallel \overline{BC}$, it is also perpendicular to $\overline{B'C'}$ (Lesson 9), and it passes through $A$, the midpoint of $\overline{B'C'}$. So the line containing the altitude from $A$ is the perpendicular bisector of $\overline{B'C'}$.

**Step 4.** The same holds for the other two altitudes. The three altitude lines of $\triangle ABC$ are the three perpendicular bisectors of $\triangle A'B'C'$, and those are concurrent at its circumcenter. $\blacksquare$

The bonus: the orthocenter $H$ of $\triangle ABC$ is equidistant from $A'$, $B'$ and $C'$. Notice also that $\triangle ABC$ is formed by the three midsegments of $\triangle A'B'C'$. The triangle formed by a triangle's three midsegments is called its **medial triangle**, and the big triangle built here is the **anticomplementary triangle** of $\triangle ABC$.

### Example 2

Find the orthocenter of $A(0, 0)$, $B(4, 0)$, $C(6, 3)$, and check it with the big triangle.

**Step 1.** $\overline{AB}$ is horizontal, so the altitude from $C$ is the vertical line $x = 6$.

**Step 2.** The slope of $\overline{BC}$ is $\tfrac{3 - 0}{6 - 4} = \tfrac32$, so the altitude from $A$ has slope $-\tfrac23$ and passes through the origin: $y = -\tfrac23 x$.

**Step 3.** At $x = 6$, $y = -4$. The orthocenter is $H(6, -4)$, *below* the triangle. That fits: the angle at $B$ is obtuse (the vectors from $B$ to $A$ and to $C$ point "backward" and "forward-up", making an angle over $90^\circ$), and an obtuse triangle's orthocenter is outside.

**Check.** Each vertex of the big triangle is the sum of two vertices minus the third: $A' = B + C - A = (10, 3)$, $B' = A + C - B = (2, 3)$, $C' = A + B - C = (-2, -3)$. The squared distances from $H(6, -4)$ are $4^2 + 7^2 = 65$, $4^2 + 7^2 = 65$ and $8^2 + 1^2 = 65$. All equal, so $H$ is the circumcenter of $\triangle A'B'C'$, as the proof promised.

## The Euler line, proved with coordinates

**Euler Line Theorem.** In any triangle that isn't equilateral, the circumcenter $O$, the centroid $G$ and the orthocenter $H$ lie on one line, the Euler line, with $G$ between them and $HG = 2\,GO$. (In an equilateral triangle the three points are the same point.)

Leonhard Euler published this in 1767 (in a paper written in 1763), working with distances algebraically. A coordinate proof is short if the axes are chosen well. Put side $\overline{AB}$ on the $x$-axis and the altitude from $C$ on the $y$-axis:

$$A(a, 0), \qquad B(b, 0), \qquad C(0, c), \qquad c \ne 0.$$

Every triangle can be placed this way. Now find the three centers.

- **Centroid:** the average of the vertices, $G = \left(\dfrac{a + b}{3}, \dfrac{c}{3}\right)$.
- **Orthocenter:** the altitude from $C$ is the $y$-axis, $x = 0$. Side $\overline{BC}$ has slope $-\tfrac{c}{b}$, so the altitude from $A$ has slope $\tfrac{b}{c}$: $y = \tfrac{b}{c}(x - a)$. At $x = 0$ this gives $H = \left(0, -\dfrac{ab}{c}\right)$.
- **Circumcenter:** it is on the perpendicular bisector of $\overline{AB}$, so $x = \tfrac{a + b}{2}$. Setting $OA^2 = OC^2$, $(x - a)^2 + y^2 = x^2 + (y - c)^2$, which simplifies to $2cy = c^2 - a^2 + 2ax$. With $x = \tfrac{a+b}{2}$, $O = \left(\dfrac{a + b}{2}, \dfrac{c^2 + ab}{2c}\right)$.

Now compare. Add $H$ and twice $O$, coordinate by coordinate:

$$x: \; 0 + (a + b) = a + b, \qquad y: \; -\frac{ab}{c} + \frac{c^2 + ab}{c} = c.$$

That's $(a + b, c)$, exactly $3G$. So $3G = H + 2O$, which rearranges to

$$G - O = \tfrac13 (H - O).$$

In words: to get from $O$ to $G$, take one-third of the trip from $O$ to $H$, in both $x$ and $y$. So $G$ lies on segment $\overline{OH}$, one-third of the way from $O$, which means $OG : GH = 1 : 2$. $\blacksquare$

### Example 3

Lesson 16 found the orthocenter of $A(0, 0)$, $B(6, 0)$, $C(2, 4)$ to be $H(2, 2)$. Find $O$ and $G$, and the equation of the Euler line.

**Step 1.** $G = \left(\tfrac{0 + 6 + 2}{3}, \tfrac{0 + 0 + 4}{3}\right) = \left(\tfrac83, \tfrac43\right)$.

**Step 2.** $O$ is on $x = 3$ (perpendicular bisector of $\overline{AB}$). Setting $OA^2 = OC^2$: $9 + y^2 = 1 + (y - 4)^2$, so $9 = 17 - 8y$ and $y = 1$. $O = (3, 1)$.

**Step 3.** Check the theorem: $H + 2O = (2 + 6, 2 + 2) = (8, 4) = 3G$. ✓

**Step 4.** The slope from $O(3, 1)$ to $H(2, 2)$ is $\tfrac{2 - 1}{2 - 3} = -1$, so the Euler line is $y - 1 = -(x - 3)$, or $y = -x + 4$. The centroid fits: $-\tfrac83 + 4 = \tfrac43$. ✓

```shape
{"polygons": [{"points": [[0, 0], [6, 0], [2, 4]]}], "segments": [{"from": [0.6, 3.4], "to": [4, 0], "dashed": true}], "points": [{"at": [3, 1], "label": "O"}, {"at": [2.667, 1.333], "label": "G"}, {"at": [2, 2], "label": "H"}], "labels": [{"at": [-0.3, -0.3], "text": "A"}, {"at": [6.3, -0.3], "text": "B"}, {"at": [2, 4.35], "text": "C"}], "caption": "The Euler line y = −x + 4 passes through O, G and H, with HG twice GO."}
```

### Example 4

A triangle has circumcenter $O(1, 2)$ and centroid $G(3, -1)$. Find its orthocenter without knowing the vertices.

From $3G = H + 2O$: $H = 3G - 2O = (9 - 2, -3 - 4) = (7, -7)$.

**Check.** $G - O = (2, -3)$ and $H - G = (4, -6)$, which is twice $G - O$. So $G$ is between them with $GH = 2\,OG$. ✓

## Where the centers sit in a right triangle

Lesson 15 said a right triangle's circumcenter is the midpoint of its hypotenuse. Here's a proof using quadrilaterals. Let $\triangle ABC$ have its right angle at $C$, and let $M$ be the midpoint of hypotenuse $\overline{AB}$. Extend $\overline{CM}$ past $M$ to a point $D$ with $MD = CM$.

- The diagonals $\overline{AB}$ and $\overline{CD}$ of $ACBD$ bisect each other at $M$, so $ACBD$ is a parallelogram.
- It has a right angle at $C$. Consecutive angles of a parallelogram are supplementary and opposite angles are congruent, so all four angles are right: it's a rectangle.
- A rectangle's diagonals are congruent, so $CD = AB$, and half of each: $CM = AM = BM$.

So $M$ is equidistant from all three vertices: it's the circumcenter. In a right triangle the legs are altitudes, so the orthocenter is the right-angle vertex $C$, and the Euler line is the median $\overline{CM}$.

## Common mistakes

- **Assuming concurrency because a drawing looks right.** A careful drawing suggests a theorem; only a proof shows it holds for *every* triangle.
- **Reversing the Euler ratio.** The centroid is closer to the circumcenter: $OG : GH = 1 : 2$, so $H = 3G - 2O$, not $3G - 2H$ or $\tfrac{O + H}{2}$.
- **Using the altitude itself instead of its line.** In an obtuse triangle the altitudes don't meet; the *lines* containing them do, outside the triangle.
- **Thinking the incenter is on the Euler line.** In general it isn't. It is only when the triangle is isosceles, where all four centers lie on the axis of symmetry.

## Key points

- Concurrency proofs: let two lines meet, then show the meeting point must be on the third.
- Medians: two midsegments make a parallelogram whose diagonals cut each median into thirds, so the centroid is two-thirds of the way from each vertex.
- Altitudes of $\triangle ABC$ are the perpendicular bisectors of the anticomplementary triangle, so they meet at its circumcenter.
- Euler line: $O$, $G$ and $H$ are collinear with $3G = H + 2O$ and $OG : GH = 1 : 2$.
- A right triangle's circumcenter is the midpoint of the hypotenuse, because completing it to a rectangle makes the hypotenuse a diagonal.
