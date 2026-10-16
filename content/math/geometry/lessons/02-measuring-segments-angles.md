---
id: geo-measure
module: geo-m1
title: Measuring segments and angles
minutes: 25
topics: [Segments and midpoints, Angle measure]
drills: [geo-midpoint-alg, geo-angadd, geo-segadd]
refs: [geo-ref-theorems]
---
The last lesson named the basic objects. This one measures them. Lengths of segments and sizes of angles are the two measurements that nearly every later topic depends on, so we set them on firm footing here: what the numbers mean, how they add, and what it means to cut a segment or an angle exactly in half.

## Measuring segments: the Ruler Postulate

Put a ruler along a line and every point gets a number, called its **coordinate**. The **Ruler Postulate** says this can always be done, and that the distance between two points is the absolute value of the difference of their coordinates:

$$AB = |b - a|.$$

The absolute value makes distance come out positive no matter which point you start from. If $A$ sits at $-3$ and $B$ at $5$ on a number line, then $AB = |5 - (-3)| = 8$.

Two segments with the same length are **congruent segments**. We write $\overline{AB} \cong \overline{CD}$ for the figures and $AB = CD$ for their lengths. In diagrams, congruent segments carry matching tick marks.

## Midpoints and segment bisectors

The **midpoint** of $\overline{AB}$ is the point $M$ on the segment with $AM = MB$. It splits the segment into two congruent halves, each half as long as the whole. On a number line, the midpoint's coordinate is the average of the endpoints:

$$m = \frac{a + b}{2}.$$

Why the average? Moving from $a$ toward $b$ by half of the distance $b - a$ lands at $a + \tfrac{b-a}{2} = \tfrac{a+b}{2}$.

A **segment bisector** is any point, ray, line, segment or plane that passes through the midpoint. A segment has exactly one midpoint but infinitely many bisectors.

```shape
{"segments": [{"from": [0, 0], "to": [5, 0]}, {"from": [5, 0], "to": [10, 0]}, {"from": [2.5, -0.25], "to": [2.5, 0.25]}, {"from": [7.5, -0.25], "to": [7.5, 0.25]}, {"from": [3, -3], "to": [7, 3]}], "points": [{"at": [0, 0], "label": "A"}, {"at": [5, 0], "label": "M"}, {"at": [10, 0], "label": "B"}], "labels": [{"at": [7.6, 2.6], "text": "ℓ"}], "caption": "M is the midpoint of AB; line ℓ bisects AB. Tick marks show AM = MB."}
```

### Example 1

$M$ is the midpoint of $\overline{PQ}$. $PM = 4x - 3$ and $MQ = 2x + 9$. Find $PQ$.

**Step 1.** A midpoint makes the halves equal: $4x - 3 = 2x + 9$.

**Step 2.** Solve: $2x = 12$, so $x = 6$.

**Step 3.** Each half is $4(6) - 3 = 21$, and $2(6) + 9 = 21$ agrees.

**Step 4.** The whole segment is twice a half: $PQ = 42$.

A common slip is to stop at $x = 6$ or at one half, 21. Read what is asked.

## Angles and how to name them

An **angle** is two rays with a common endpoint. The rays are the **sides** and the common endpoint is the **vertex**. An angle with vertex $B$ and sides $\overrightarrow{BA}$ and $\overrightarrow{BC}$ is named $\angle ABC$ or $\angle CBA$ (vertex always in the middle), or just $\angle B$ if no other angle shares that vertex. Its size, in degrees, is written $m\angle ABC$.

The **Protractor Postulate** says the rays from a point on one side of a line can be matched with the numbers 0 to 180, and the measure of an angle is the difference of its two rays' numbers. That is exactly what you do when you read a protractor.

Angles are classified by measure:

| Type | Measure |
|---|---|
| **acute angle** | between $0^\circ$ and $90^\circ$ |
| **right angle** | exactly $90^\circ$ (marked with a small square) |
| **obtuse angle** | between $90^\circ$ and $180^\circ$ |
| **straight angle** | exactly $180^\circ$ (opposite rays) |

Angles with equal measures are **congruent angles**, shown with matching arcs.

## Angle addition and angle bisectors

The angle version of segment addition is the **Angle Addition Postulate**: if point $D$ is in the interior of $\angle ABC$, then

$$m\angle ABD + m\angle DBC = m\angle ABC.$$

An **angle bisector** is a ray that divides an angle into two congruent angles. If $\overrightarrow{BD}$ bisects $\angle ABC$, each half measures $\tfrac12 m\angle ABC$.

```shape
{"segments": [{"from": [0, 0], "to": [10, 0], "arrow": true}, {"from": [0, 0], "to": [6.43, 7.66], "arrow": true}, {"from": [0, 0], "to": [9.06, 4.23], "arrow": true}], "curves": [{"x": "2.2cos(t)", "y": "2.2sin(t)", "t": [0, 0.436]}, {"x": "2.6cos(t)", "y": "2.6sin(t)", "t": [0.436, 0.873]}], "points": [{"at": [0, 0], "label": "B"}, {"at": [10, 0], "label": "C"}, {"at": [6.43, 7.66], "label": "A"}, {"at": [9.06, 4.23], "label": "D"}], "caption": "D is in the interior of angle ABC, so m∠ABD + m∠DBC = m∠ABC."}
```

### Example 2

$D$ is in the interior of $\angle ABC$. $m\angle ABD = 3x + 4$, $m\angle DBC = 5x - 10$ and $m\angle ABC = 82^\circ$. Find each angle, then decide whether $\overrightarrow{BD}$ bisects $\angle ABC$.

**Step 1.** Angle addition: $(3x + 4) + (5x - 10) = 82$.

**Step 2.** Simplify: $8x - 6 = 82$, so $8x = 88$ and $x = 11$.

**Step 3.** $m\angle ABD = 3(11) + 4 = 37^\circ$ and $m\angle DBC = 5(11) - 10 = 45^\circ$.

**Step 4.** Check: $37 + 45 = 82$. The two parts are not equal, so $\overrightarrow{BD}$ is *not* a bisector.

### Example 3

$\overrightarrow{QS}$ bisects $\angle PQR$ and $m\angle PQS = 2y + 7$, $m\angle PQR = 6y - 18$. Find $m\angle PQR$.

**Step 1.** Since the bisector halves the angle, $m\angle PQR = 2 \cdot m\angle PQS$: $6y - 18 = 2(2y + 7) = 4y + 14$.

**Step 2.** Solve: $2y = 32$, $y = 16$.

**Step 3.** $m\angle PQR = 6(16) - 18 = 78^\circ$, and each half is $2(16)+7 = 39^\circ$. Check: $2 \cdot 39 = 78$.

## Common mistakes

- **Naming an angle with the vertex on the end.** $\angle BAC$ and $\angle ABC$ are different angles.
- **Doubling the wrong thing.** With a bisector or midpoint, the *whole* is twice a *half*. Setting the half equal to the whole is a frequent error.
- **Dropping the absolute value.** Distance $|b - a|$ is never negative.
- **Reading the wrong protractor scale.** If an angle is clearly acute, a reading of $130^\circ$ came from the other scale.
- **Assuming a ray is a bisector because it looks central.** Only equal measures make it a bisector.

## Key points

- Distance on a number line: $AB = |b - a|$; midpoint: $\tfrac{a+b}{2}$.
- Congruent segments have equal lengths; congruent angles have equal measures.
- Angles are acute, right, obtuse or straight by measure.
- Angle Addition: if $D$ is inside $\angle ABC$, the two parts add to the whole.
- A midpoint or bisector creates two equal halves; the whole is twice either half.
