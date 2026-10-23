---
id: mv-m1-h-distances
module: mv-m1
honors: true
title: Vector identities and distances in space
minutes: 45
topics: [Vector identities, Distances in space]
drills: [mv-m1-r2-point-line, mv-m1-r2-skew-dist, mv-m1-r2-triple-vec]
refs: [mv-ref-vectors]
---
## Beyond the formulas

Lessons 3 to 5 gave you the dot product, the cross product and a formula for the distance from a point to a plane. This lesson pushes the same tools further in two directions. First, *proofs*: why is $|\cos\theta| \le 1$ guaranteed by the algebra itself, why can a side of a triangle never be longer than the other two together, and what happens when you take two cross products in a row? Second, *distances*: from a point to a line, and between two skew lines, together with the closest points themselves. Every formula here comes from one idea you already know: build a parallelogram or a box, and read a distance off as a height.

## The Cauchy–Schwarz inequality

Lesson 3 defined the angle between vectors by $\cos\theta = \dfrac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$. That only makes sense if the right side always lies between $-1$ and $1$. In two and three dimensions the law of cosines guarantees it, but there is a purely algebraic proof that works in any number of dimensions. The statement is the **Cauchy–Schwarz inequality**:

$$|\mathbf a\cdot\mathbf b| \le |\mathbf a|\,|\mathbf b|,$$

with equality exactly when one vector is a scalar multiple of the other.

*Proof.* If $\mathbf b = \mathbf 0$ both sides are 0. Otherwise, for every real number $t$ the length of $\mathbf a + t\mathbf b$ is at least zero, so

$$0 \le |\mathbf a + t\mathbf b|^2 = (\mathbf a + t\mathbf b)\cdot(\mathbf a + t\mathbf b) = |\mathbf b|^2t^2 + 2(\mathbf a\cdot\mathbf b)\,t + |\mathbf a|^2.$$

The right side is a quadratic in $t$ that is never negative, so it has at most one real root, and its discriminant cannot be positive: $4(\mathbf a\cdot\mathbf b)^2 - 4|\mathbf a|^2|\mathbf b|^2 \le 0$. Divide by 4 and take square roots. Equality means the quadratic touches zero at some $t$, that is, $\mathbf a + t\mathbf b = \mathbf 0$, so the vectors are parallel. ∎

Notice that the proof never used angles or pictures, only the algebra rules of the dot product. That is why mathematicians can define angles between vectors with 10 or 1,000 components, as in data science.

## The triangle inequality

Lesson 2 warned that $|\mathbf u + \mathbf v|$ is usually smaller than $|\mathbf u| + |\mathbf v|$. Cauchy–Schwarz proves the **triangle inequality** $|\mathbf u + \mathbf v| \le |\mathbf u| + |\mathbf v|$ in one line:

$$|\mathbf u+\mathbf v|^2 = |\mathbf u|^2 + 2\,\mathbf u\cdot\mathbf v + |\mathbf v|^2 \le |\mathbf u|^2 + 2|\mathbf u||\mathbf v| + |\mathbf v|^2 = (|\mathbf u| + |\mathbf v|)^2.$$

Both sides are lengths, so taking square roots keeps the inequality. In words: one side of a triangle is never longer than the other two together, and a straight path is never longer than a detour.

## Triple products

**Scalar triple product, again.** Lesson 4 showed $\mathbf a\cdot(\mathbf b\times\mathbf c)$ is a $3\times3$ determinant. Swapping two rows of a determinant changes its sign, and a cyclic shift is two swaps, so

$$\mathbf a\cdot(\mathbf b\times\mathbf c) = \mathbf b\cdot(\mathbf c\times\mathbf a) = \mathbf c\cdot(\mathbf a\times\mathbf b),$$

while swapping any two of the vectors flips the sign. Geometrically all three give the same signed volume of the same box.

**The vector triple product.** What is $\mathbf a\times(\mathbf b\times\mathbf c)$? The vector $\mathbf b\times\mathbf c$ is perpendicular to the plane of $\mathbf b$ and $\mathbf c$. Crossing it with $\mathbf a$ gives a vector perpendicular to $\mathbf b\times\mathbf c$, which therefore lies back in the plane of $\mathbf b$ and $\mathbf c$ (when $\mathbf b$ and $\mathbf c$ are not parallel). So it must be a combination of $\mathbf b$ and $\mathbf c$. Expanding the components shows exactly which one:

$$\mathbf a\times(\mathbf b\times\mathbf c) = \mathbf b\,(\mathbf a\cdot\mathbf c) - \mathbf c\,(\mathbf a\cdot\mathbf b).$$

This is the **vector triple product** identity, often remembered as "BAC minus CAB." The middle vector of the product always gets the plus sign. The identity is used to simplify expressions in mechanics and in electromagnetism. A cousin of it, with the operator $\nabla$ of Lesson 33 in place of $\mathbf a$ and $\mathbf b$, gives the "curl of a curl" formula $\nabla\times(\nabla\times\mathbf F) = \nabla(\nabla\cdot\mathbf F) - \nabla^2\mathbf F$ (in Cartesian components), which physicists use to turn Maxwell's equations into the wave equation for light. Since $\nabla$ is an operator and not a true vector, that version has to be checked separately rather than read off from BAC−CAB.

### Example 1: checking BAC−CAB

Let $\mathbf a = \langle 1,2,3\rangle$, $\mathbf b = \langle 1,0,1\rangle$, $\mathbf c = \langle 0,1,2\rangle$.

1. Directly: $\mathbf b\times\mathbf c = \langle 0\cdot2 - 1\cdot1,\; 1\cdot0 - 1\cdot2,\; 1\cdot1 - 0\cdot0\rangle = \langle -1,-2,1\rangle$, and then $\mathbf a\times\langle -1,-2,1\rangle = \langle 2\cdot1 - 3(-2),\; 3(-1) - 1\cdot1,\; 1(-2) - 2(-1)\rangle = \langle 8,-4,0\rangle$.
2. By the identity: $\mathbf a\cdot\mathbf c = 0 + 2 + 6 = 8$ and $\mathbf a\cdot\mathbf b = 1 + 0 + 3 = 4$, so $8\mathbf b - 4\mathbf c = \langle 8,0,8\rangle - \langle 0,4,8\rangle = \langle 8,-4,0\rangle$. ✓
3. For contrast, $(\mathbf a\times\mathbf b)\times\mathbf c = \langle 6,-4,2\rangle$, a different vector: the cross product is not associative, so the parentheses matter.

The identity needs two dot products and a subtraction instead of two full cross products, and it shows at once that the answer lies in the plane of $\mathbf b$ and $\mathbf c$.

## Distance from a point to a line

Let a line pass through $P$ with direction $\mathbf v$, and let $Q$ be a point. Build the parallelogram with sides $\overrightarrow{PQ}$ and $\mathbf v$. Its area is $|\overrightarrow{PQ}\times\mathbf v|$, its base is $|\mathbf v|$, and its height is exactly the distance from $Q$ to the line. Area divided by base gives

$$D = \frac{|\overrightarrow{PQ}\times\mathbf v|}{|\mathbf v|}.$$

You can also find $D$ with projections: split $\overrightarrow{PQ}$ into a part along $\mathbf v$ and a part perpendicular to it. The perpendicular part has length $D$, so $D^2 = |\overrightarrow{PQ}|^2 - (\operatorname{comp}_{\mathbf v}\overrightarrow{PQ})^2$. The projection route has a bonus: it gives the **foot of the perpendicular**, the point of the line closest to $Q$, at $P + t\mathbf v$ with $t = \dfrac{\overrightarrow{PQ}\cdot\mathbf v}{\mathbf v\cdot\mathbf v}$.

### Example 2: point to line

Find the distance from $Q(4,3,2)$ to the line through $P(1,0,2)$ with direction $\mathbf v = \langle 1,2,2\rangle$, and the closest point on the line.

1. $\overrightarrow{PQ} = \langle 3,3,0\rangle$ and $|\mathbf v| = \sqrt{1+4+4} = 3$.
2. $\overrightarrow{PQ}\times\mathbf v = \langle 3\cdot2 - 0\cdot2,\; 0\cdot1 - 3\cdot2,\; 3\cdot2 - 3\cdot1\rangle = \langle 6,-6,3\rangle$, of length $\sqrt{36+36+9} = 9$.
3. $D = 9/3 = 3$.
4. Closest point: $t = \dfrac{\langle 3,3,0\rangle\cdot\langle 1,2,2\rangle}{9} = \dfrac{9}{9} = 1$, so the foot is $P + \mathbf v = (2,2,4)$.

Check: the distance from $(4,3,2)$ to $(2,2,4)$ is $\sqrt{4 + 1 + 4} = 3$ ✓, and $\langle 2,1,-2\rangle\cdot\langle 1,2,2\rangle = 0$, so the connecting segment really is perpendicular to the line.

## Distance between skew lines

Two skew lines $\mathbf r_1 = P_1 + t\mathbf v_1$ and $\mathbf r_2 = P_2 + s\mathbf v_2$ never meet, but there is a shortest segment joining them. That segment is perpendicular to both lines, so it points along $\mathbf n = \mathbf v_1\times\mathbf v_2$; it is called the **common perpendicular**. Picture two parallel planes with normal $\mathbf n$, one containing each line: the lines' separation is the distance between those planes, which is the scalar projection of $\overrightarrow{P_1P_2}$ onto $\mathbf n$:

$$D = \frac{|\overrightarrow{P_1P_2}\cdot(\mathbf v_1\times\mathbf v_2)|}{|\mathbf v_1\times\mathbf v_2|}.$$

Read it as a box: the numerator is a scalar triple product, the volume of the box with edges $\overrightarrow{P_1P_2}$, $\mathbf v_1$, $\mathbf v_2$, and the denominator is the area of its base. Volume divided by base area is height. If the numerator is 0 the box is flat, and the lines (which are not parallel) intersect. If $\mathbf v_1\times\mathbf v_2 = \mathbf 0$ the formula fails because the lines are parallel; then use the point-to-line formula with any point of one line.

![Two skew lines drawn in perspective with the common perpendicular joining their closest points](images/mv-m1-skew-lines.svg)

**Finding the closest points.** Let $\mathbf w(t,s) = \mathbf r_1(t) - \mathbf r_2(s)$. At the closest pair, $\mathbf w$ is perpendicular to both directions, so solve

$$\mathbf w\cdot\mathbf v_1 = 0,\qquad \mathbf w\cdot\mathbf v_2 = 0,$$

two linear equations in $t$ and $s$.

### Example 3: skew lines

Find the distance between $\mathbf r_1 = \langle 1,0,2\rangle + t\langle 2,2,1\rangle$ and $\mathbf r_2 = \langle 3,1,-1\rangle + s\langle 1,0,1\rangle$, and the closest points.

1. $\mathbf n = \langle 2,2,1\rangle\times\langle 1,0,1\rangle = \langle 2\cdot1 - 1\cdot0,\; 1\cdot1 - 2\cdot1,\; 2\cdot0 - 2\cdot1\rangle = \langle 2,-1,-2\rangle$, with $|\mathbf n| = 3$. It is not $\mathbf 0$, so the lines are not parallel.
2. $\overrightarrow{P_1P_2} = \langle 2,1,-3\rangle$, and $\overrightarrow{P_1P_2}\cdot\mathbf n = 4 - 1 + 6 = 9$.
3. $D = 9/3 = 3$. Since $D \ne 0$, the lines are skew.
4. Closest points: $\mathbf w = \langle -2,-1,3\rangle + t\langle 2,2,1\rangle - s\langle 1,0,1\rangle$. Using $\mathbf v_1\cdot\mathbf v_1 = 9$, $\mathbf v_1\cdot\mathbf v_2 = 3$, $\mathbf v_2\cdot\mathbf v_2 = 2$:
   - $\mathbf w\cdot\mathbf v_1 = -3 + 9t - 3s = 0$,
   - $\mathbf w\cdot\mathbf v_2 = 1 + 3t - 2s = 0$.
5. The first gives $s = 3t - 1$; substituting, $1 + 3t - 6t + 2 = 0$, so $t = 1$ and $s = 2$.
6. The points are $\mathbf r_1(1) = (3,2,3)$ and $\mathbf r_2(2) = (5,1,1)$. Their difference is $\langle 2,-1,-2\rangle = \mathbf n$, of length 3 ✓.

## Common mistakes

- Dividing by $|\mathbf v|^2$ in the point-to-line formula. Area over base means dividing by $|\mathbf v|$ once.
- Writing BAC−CAB with the signs reversed. The vector in the middle of $\mathbf a\times(\mathbf b\times\mathbf c)$, here $\mathbf b$, gets the plus sign.
- Assuming $\mathbf a\times(\mathbf b\times\mathbf c) = (\mathbf a\times\mathbf b)\times\mathbf c$. They are usually different.
- Using the skew-line formula for parallel lines, where $\mathbf v_1\times\mathbf v_2 = \mathbf 0$ and the formula divides by zero.
- Forgetting the absolute value, and reporting a negative distance.
- Using the same parameter for both lines when searching for closest points.

## Key points

- Cauchy–Schwarz: $|\mathbf a\cdot\mathbf b| \le |\mathbf a||\mathbf b|$, proved from $|\mathbf a + t\mathbf b|^2 \ge 0$; it implies the triangle inequality.
- $\mathbf a\cdot(\mathbf b\times\mathbf c)$ is unchanged by cyclic shifts; $\mathbf a\times(\mathbf b\times\mathbf c) = \mathbf b(\mathbf a\cdot\mathbf c) - \mathbf c(\mathbf a\cdot\mathbf b)$.
- Point to line: $D = |\overrightarrow{PQ}\times\mathbf v|/|\mathbf v|$ (parallelogram height).
- Skew lines: $D = |\overrightarrow{P_1P_2}\cdot(\mathbf v_1\times\mathbf v_2)|/|\mathbf v_1\times\mathbf v_2|$ (box height); the closest points solve $\mathbf w\cdot\mathbf v_1 = \mathbf w\cdot\mathbf v_2 = 0$.
