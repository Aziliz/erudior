---
id: geo-h-lines-vectors
module: geo-m3
title: 'Slopes and vectors: proving the slope rules'
minutes: 50
honors: true
topics: [Slope criteria proofs, Angle between lines, Foot of the perpendicular]
drills: [geo-m3-r2-angle-lines, geo-m3-r2-foot, geo-m3-r2-parallel-dist]
refs: [geo-ref-coord]
---
Lesson 9 gave three coordinate rules: parallel lines have equal slopes, perpendicular slopes multiply to $-1$, and the distance from $(x_0, y_0)$ to $Ax + By + C = 0$ is $\tfrac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}}$. It explained the perpendicular rule with a rotation picture and stated the distance formula without proof. This lesson proves all three, introduces the tool that makes the proofs short (direction vectors and the dot product), and uses it to measure the angle between any two lines and to find the exact point where a perpendicular meets a line. Two proofs borrow the Pythagorean theorem and the Law of Cosines from Module 6; if you have not studied them yet, take them on trust for now.

## Proving the slope criteria

**Parallel lines.** Two different non-vertical lines are parallel exactly when their slopes are equal.

*Proof.* Write the lines as $y = m_1 x + b_1$ and $y = m_2 x + b_2$. They meet where $m_1 x + b_1 = m_2 x + b_2$, that is, $(m_1 - m_2)x = b_2 - b_1$. If $m_1 \ne m_2$, this has the solution $x = \tfrac{b_2 - b_1}{m_1 - m_2}$, so the lines meet and are not parallel. If $m_1 = m_2$, the equation reads $0 = b_2 - b_1$; since the lines are different, $b_1 \ne b_2$, so there is no solution and the lines never meet. $\blacksquare$

**Perpendicular lines.** Two non-vertical lines are perpendicular exactly when $m_1 m_2 = -1$.

*Proof.* Sliding a line (a translation) changes neither its slope nor the angles it makes, so we may slide both lines until they pass through the origin $O$: $y = m_1 x$ and $y = m_2 x$. Take the point $A = (1, m_1)$ on the first line and $B = (1, m_2)$ on the second. By the distance formula,

$$OA^2 = 1 + m_1^2, \qquad OB^2 = 1 + m_2^2, \qquad AB^2 = (m_1 - m_2)^2 = m_1^2 - 2m_1 m_2 + m_2^2.$$

By the Pythagorean theorem and its converse, $\angle AOB$ is a right angle exactly when $OA^2 + OB^2 = AB^2$:

$$2 + m_1^2 + m_2^2 = m_1^2 - 2m_1 m_2 + m_2^2 \iff 2 = -2m_1 m_2 \iff m_1 m_2 = -1. \quad \blacksquare$$

Because every step is an "exactly when", this proves both directions at once: perpendicular lines have slopes multiplying to $-1$, and slopes multiplying to $-1$ give perpendicular lines.

## Direction vectors and the dot product

Slopes fail for vertical lines. Vectors don't. A **direction vector** of a line is any vector $\langle a, b \rangle$ that moves from one point of the line to another (Module 9 uses vectors for translations). The line through $(1, -2)$ and $(5, 4)$ has direction vector $\langle 4, 6 \rangle$, or any nonzero multiple such as $\langle 2, 3 \rangle$; when $a \ne 0$ its slope is $\tfrac{b}{a}$. A vertical line has direction vector $\langle 0, 1 \rangle$ and no slope.

The **dot product** of $\vec u = \langle a_1, b_1 \rangle$ and $\vec v = \langle a_2, b_2 \rangle$ is the number

$$\vec u \cdot \vec v = a_1 a_2 + b_1 b_2.$$

**Perpendicular vectors.** Nonzero vectors $\vec u$ and $\vec v$ are perpendicular exactly when $\vec u \cdot \vec v = 0$.

*Why.* Draw $\vec u$ and $\vec v$ from the origin, ending at $U = (a_1, b_1)$ and $V = (a_2, b_2)$. Expanding the distance formula gives $UV^2 = OU^2 + OV^2 - 2(a_1 a_2 + b_1 b_2)$. So the Pythagorean condition $UV^2 = OU^2 + OV^2$ holds exactly when the dot product is $0$. With direction vectors $\langle 1, m_1 \rangle$ and $\langle 1, m_2 \rangle$ the condition becomes $1 + m_1 m_2 = 0$, the slope rule again; but the vector form also covers vertical lines: $\langle 0, 1 \rangle \cdot \langle 1, 0 \rangle = 0$.

**Normal vectors.** For a line $Ax + By = C$, the vector $\langle A, B \rangle$ is perpendicular to the line; it is called a **normal vector**. Proof: if $(x_1, y_1)$ and $(x_2, y_2)$ are on the line, subtracting $Ax_1 + By_1 = C$ from $Ax_2 + By_2 = C$ gives $A(x_2 - x_1) + B(y_2 - y_1) = 0$, which says $\langle A, B \rangle$ dotted with a direction vector is $0$. A direction vector of the line is $\langle B, -A \rangle$.

This gives one-line equations, with no slopes and no fractions. Through the point $(p, q)$:

- the line parallel to $Ax + By = C$ is $Ax + By = Ap + Bq$ (same normal vector);
- the line perpendicular to it is $Bx - Ay = Bp - Aq$ (its normal vector $\langle B, -A \rangle$ is the old direction vector).

### Example 1

Find the line through $(3, -2)$ perpendicular to $5x - 2y = 7$.

**Step 1.** Here $A = 5$, $B = -2$, $(p, q) = (3, -2)$. The perpendicular line is $Bx - Ay = Bp - Aq$: $-2x - 5y = (-2)(3) - (5)(-2) = 4$.

**Step 2.** Multiply by $-1$: $2x + 5y = -4$.

**Check.** The point: $2(3) + 5(-2) = -4$. ✓ The slopes: the given line has slope $\tfrac52$ and the new one $-\tfrac25$; their product is $-1$. ✓

## The angle between two lines

Two intersecting lines make two pairs of vertical angles, one acute (or both right). The **angle between two lines** means the one that is not obtuse, between $0^\circ$ and $90^\circ$.

Apply the Law of Cosines to the triangle $OUV$ from above, with angle $\varphi$ at $O$: $UV^2 = OU^2 + OV^2 - 2\,OU \cdot OV \cos\varphi$. Comparing with the expansion $UV^2 = OU^2 + OV^2 - 2\,\vec u \cdot \vec v$ gives the key identity

$$\vec u \cdot \vec v = |\vec u|\,|\vec v| \cos\varphi,$$

where $|\vec u| = \sqrt{a_1^2 + b_1^2}$ is the length of $\vec u$. For lines, use direction vectors (or normal vectors, which are the direction vectors turned $90^\circ$ and so make the same angle) and take the absolute value to get the non-obtuse angle:

$$\cos\varphi = \frac{|\vec u \cdot \vec v|}{|\vec u|\,|\vec v|}.$$

A second formula, which you may see in precalculus, uses slopes: $\tan\varphi = \left|\dfrac{m_2 - m_1}{1 + m_1 m_2}\right|$. It comes from a trigonometric identity not proved in this course, and it breaks down when $m_1 m_2 = -1$ (the lines are then perpendicular) or a line is vertical. The cosine formula always works.

```plot
{"x": [-3, 4], "y": [-2, 6], "equal": true, "functions": [{"f": "2x + 1", "label": "y = 2x + 1"}, {"f": "-3x + 4", "label": "y = −3x + 4"}], "points": [{"at": [0.6, 2.2], "label": "(0.6, 2.2)"}], "caption": "The lines y = 2x + 1 and y = −3x + 4 meet at (0.6, 2.2) at an angle of 45°."}
```

### Example 2

Find the angle between $y = 2x + 1$ and $y = -3x + 4$.

**Step 1.** Direction vectors: $\vec u = \langle 1, 2 \rangle$ and $\vec v = \langle 1, -3 \rangle$ (one step right, slope steps up).

**Step 2.** $\vec u \cdot \vec v = 1 - 6 = -5$; $|\vec u| = \sqrt5$, $|\vec v| = \sqrt{10}$.

**Step 3.** $\cos\varphi = \dfrac{5}{\sqrt5\sqrt{10}} = \dfrac{5}{\sqrt{50}} = \dfrac{1}{\sqrt2}$, so $\varphi = 45^\circ$. (The other angle at the crossing is $135^\circ$; the negative dot product just says the two chosen direction vectors point $135^\circ$ apart.)

### Example 3

Find the angle between $3x + 4y = 12$ and $x - y = 1$, to the nearest tenth of a degree.

**Step 1.** Use the normal vectors $\langle 3, 4 \rangle$ and $\langle 1, -1 \rangle$: dot product $3 - 4 = -1$, lengths $5$ and $\sqrt2$.

**Step 2.** $\cos\varphi = \dfrac{1}{5\sqrt2} \approx 0.1414$, so $\varphi = \cos^{-1}(0.1414) \approx 81.9^\circ$. The lines are close to, but not exactly, perpendicular, as the slopes $-\tfrac34$ and $1$ (product $-\tfrac34$, not $-1$) confirm.

## The foot of the perpendicular, and the distance formula proved

The **foot of the perpendicular** from a point $P$ to a line is the point $F$ where the perpendicular through $P$ meets the line. Lesson 9 measured $PF$ with a formula; now we find $F$ itself and see where the formula comes from.

Start at $P = (x_0, y_0)$ and move along the normal vector $\langle A, B \rangle$ of the line $Ax + By + C = 0$. After "$t$ steps" you are at $(x_0 + tA,\ y_0 + tB)$, and this point is on the line when

$$A(x_0 + tA) + B(y_0 + tB) + C = 0 \quad\Longrightarrow\quad t = -\frac{Ax_0 + By_0 + C}{A^2 + B^2}.$$

That point is $F$. The distance traveled is $|t|$ times the length of $\langle A, B \rangle$:

$$PF = |t|\sqrt{A^2 + B^2} = \frac{|Ax_0 + By_0 + C|}{A^2 + B^2}\sqrt{A^2 + B^2} = \frac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}},$$

which is exactly Lesson 9's formula. Going twice as far, to $(x_0 + 2tA,\ y_0 + 2tB)$, lands on the mirror image of $P$ in the line, since $F$ is then the midpoint (reflections are Module 9's topic).

```plot
{"x": [-6, 6], "y": [-3, 9], "equal": true, "functions": [{"f": "(9 - 3x)/4", "label": "3x + 4y = 9"}], "segments": [{"from": [2, 7], "to": [-1, 3]}, {"from": [-1, 3], "to": [-4, -1], "dashed": true}], "points": [{"at": [2, 7], "label": "P(2, 7)"}, {"at": [-1, 3], "label": "F(−1, 3)"}, {"at": [-4, -1], "label": "P′(−4, −1)"}], "rightAngles": [[[-1, 3], [2, 7], [3, 0]]], "caption": "The foot F of the perpendicular from P, and P′, the reflection of P in the line."}
```

### Example 4

Find the foot of the perpendicular from $P(2, 7)$ to $3x + 4y = 9$, the distance, and the reflection of $P$ in the line.

**Step 1.** Write the line as $3x + 4y - 9 = 0$: $A = 3$, $B = 4$, $C = -9$. Then $Ax_0 + By_0 + C = 6 + 28 - 9 = 25$ and $A^2 + B^2 = 25$, so $t = -1$.

**Step 2.** Foot: $F = (2 + (-1)(3),\ 7 + (-1)(4)) = (-1, 3)$. Check: $3(-1) + 4(3) = 9$. ✓

**Step 3.** Distance: $PF = |t|\sqrt{25} = 5$, matching Lesson 9, Example 4. Directly: $\sqrt{3^2 + 4^2} = 5$. ✓

**Step 4.** Reflection: $P' = (2 + 2(-1)(3),\ 7 + 2(-1)(4)) = (-4, -1)$. Its midpoint with $P$ is $(-1, 3) = F$. ✓

## Distance between parallel lines

Parallel lines can be written with the *same* $A$ and $B$: $Ax + By + C_1 = 0$ and $Ax + By + C_2 = 0$. Take any point $(x_0, y_0)$ on the first, so $Ax_0 + By_0 = -C_1$; its distance to the second is $\tfrac{|-C_1 + C_2|}{\sqrt{A^2 + B^2}}$. So the distance between the parallel lines is

$$d = \frac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}.$$

### Example 5

Find the distance between $6x + 8y = 5$ and $3x + 4y = 1$.

**Step 1.** Match the coefficients: divide the first equation by 2 to get $3x + 4y = 2.5$. In the form above, $3x + 4y - 2.5 = 0$ and $3x + 4y - 1 = 0$.

**Step 2.** $d = \dfrac{|-2.5 - (-1)|}{\sqrt{9 + 16}} = \dfrac{1.5}{5} = 0.3$.

Using $C = -5$ from the unscaled first equation would give $\tfrac{4}{5}$, which is wrong: the formula needs identical $A$ and $B$.

## Common mistakes

- **Applying the slope rules to vertical lines.** A vertical line has no slope; use direction vectors, or remember that vertical and horizontal lines are perpendicular.
- **Reporting the obtuse angle.** The angle between two lines is the non-obtuse one; take the absolute value of the dot product, or subtract an obtuse result from $180^\circ$.
- **Mixing up normal and direction vectors.** For $Ax + By = C$, $\langle A, B \rangle$ is perpendicular to the line and $\langle B, -A \rangle$ runs along it.
- **Unmatched coefficients** in the parallel-line distance formula. Scale one equation so both have the same $A$ and $B$ first.
- **Dropping the sign of $t$.** The foot is $(x_0 + tA, y_0 + tB)$ with $t$ possibly negative; only the distance uses $|t|$.

## Key points

- Equal slopes mean parallel (for different lines) because $(m_1 - m_2)x = b_2 - b_1$ then has no solution; $m_1 m_2 = -1$ is the Pythagorean condition for lines through the origin.
- Dot product: $\langle a_1, b_1 \rangle \cdot \langle a_2, b_2 \rangle = a_1 a_2 + b_1 b_2 = |\vec u||\vec v|\cos\varphi$; zero exactly for perpendicular vectors.
- $\langle A, B \rangle$ is a normal vector of $Ax + By = C$. Parallel through $(p, q)$: $Ax + By = Ap + Bq$. Perpendicular: $Bx - Ay = Bp - Aq$.
- Angle between lines: $\cos\varphi = \tfrac{|\vec u \cdot \vec v|}{|\vec u||\vec v|}$, giving $0^\circ$ to $90^\circ$.
- Foot of the perpendicular: $(x_0 + tA, y_0 + tB)$ with $t = -\tfrac{Ax_0 + By_0 + C}{A^2 + B^2}$; the reflection uses $2t$.
- Distance between $Ax + By + C_1 = 0$ and $Ax + By + C_2 = 0$: $\tfrac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}$.
