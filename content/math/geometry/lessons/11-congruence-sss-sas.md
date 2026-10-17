---
id: geo-congruent
module: geo-m4
title: Congruent triangles, SSS and SAS
minutes: 30
topics: [Congruent figures, SSS and SAS]
drills: [geo-cong-x]
refs: [geo-ref-theorems]
---
Two figures are congruent when they have exactly the same size and shape: one could be moved (slid, turned or flipped) to land exactly on the other. For triangles, checking congruence by definition means comparing six parts: three sides and three angles. This lesson shows that *three* well-chosen parts are enough, using the SSS and SAS shortcuts. These shortcuts are the main tool for proving segments and angles equal in all of the geometry that follows.

## Congruent polygons and corresponding parts

Two polygons are **congruent polygons** when their vertices can be matched so that all pairs of **corresponding parts** (sides and angles) are congruent. The order of letters in a **congruence statement** records the match:

$$\triangle ABC \cong \triangle DEF \quad\text{means}\quad A \leftrightarrow D,\; B \leftrightarrow E,\; C \leftrightarrow F.$$

So $\angle A \cong \angle D$, $\angle B \cong \angle E$, $\angle C \cong \angle F$, and $\overline{AB} \cong \overline{DE}$, $\overline{BC} \cong \overline{EF}$, $\overline{AC} \cong \overline{DF}$. Read the sides off by taking the same two positions in each name: first-and-second letters of $ABC$ go with first-and-second letters of $DEF$.

Writing $\triangle ABC \cong \triangle EDF$ would be a *different* claim (it matches $A$ with $E$). Order matters.

### Example 1

$\triangle JKL \cong \triangle PQR$. $JK = 3x - 4$, $PQ = 2x + 5$ and $m\angle L = 40^\circ$. Find $JK$ and $m\angle R$.

**Step 1.** $\overline{JK}$ corresponds to $\overline{PQ}$ (first and second letters), so $3x - 4 = 2x + 5$ and $x = 9$.

**Step 2.** $JK = 3(9) - 4 = 23$.

**Step 3.** $\angle L$ corresponds to $\angle R$ (third letters), so $m\angle R = 40^\circ$.

**Third Angles Theorem.** If two angles of one triangle are congruent to two angles of another, the third angles are congruent too. (Each third angle is $180^\circ$ minus the same sum.)

## Why we need shortcuts

Checking all six parts is tedious, and often only some are known. The question is: what is the least information that pins a triangle down completely? Think about building a triangle from parts. If you're handed three sticks of fixed lengths, there's only one triangle you can make (up to moving it around): try it, and the triangle is rigid. That rigidity is why triangles are used in bridges and roof trusses, and it's the idea behind the first shortcut.

## SSS: Side-Side-Side

**SSS Congruence Postulate.** If three sides of one triangle are congruent to three sides of another, the triangles are congruent.

```shape
{"polygons": [{"points": [[0, 0], [5, 0], [1.5, 3]]}, {"points": [[8, 0], [13, 0], [9.5, 3]]}], "segments": [{"from": [2.4, -0.25], "to": [2.4, 0.25]}, {"from": [10.4, -0.25], "to": [10.4, 0.25]}, {"from": [0.55, 1.6], "to": [0.95, 1.4]}, {"from": [8.55, 1.6], "to": [8.95, 1.4]}, {"from": [3.15, 1.65], "to": [3.45, 1.95]}, {"from": [3.35, 1.45], "to": [3.65, 1.75]}, {"from": [11.15, 1.65], "to": [11.45, 1.95]}, {"from": [11.35, 1.45], "to": [11.65, 1.75]}], "labels": [{"at": [-0.3, -0.4], "text": "A"}, {"at": [5.3, -0.4], "text": "B"}, {"at": [1.5, 3.4], "text": "C"}, {"at": [7.7, -0.4], "text": "D"}, {"at": [13.3, -0.4], "text": "E"}, {"at": [9.5, 3.4], "text": "F"}], "caption": "Tick marks show three pairs of congruent sides: △ABC ≅ △DEF by SSS."}
```

## SAS: Side-Angle-Side

**SAS Congruence Postulate.** If two sides and the **included angle** (the angle *between* those two sides) of one triangle are congruent to the corresponding parts of another, the triangles are congruent.

Picture a door hinge: two fixed-length boards joined at a fixed angle. The distance between their free ends is forced, so the triangle is determined.

The angle must be *included*. Two sides and a non-included angle (SSA) does *not* guarantee congruence: with sides 5 and 7 and a $30^\circ$ angle opposite the 5, two different triangles fit. That's the "ambiguous case", and it's why there is no SSA shortcut. (Lesson 25 finds both triangles.)

### Example 2

In the figure below, $\overline{AB} \cong \overline{CB}$ and $\overline{BD}$ bisects $\angle ABC$. Prove $\triangle ABD \cong \triangle CBD$.

```shape
{"polygons": [{"points": [[0, 0], [8, 0], [4, 5]]}], "segments": [{"from": [4, 5], "to": [4, 0]}], "labels": [{"at": [-0.4, -0.4], "text": "A"}, {"at": [8.4, -0.4], "text": "C"}, {"at": [4, 5.5], "text": "B"}, {"at": [4, -0.5], "text": "D"}]}
```

| Statements | Reasons |
|---|---|
| 1. $\overline{AB} \cong \overline{CB}$ | 1. Given |
| 2. $\overline{BD}$ bisects $\angle ABC$ | 2. Given |
| 3. $\angle ABD \cong \angle CBD$ | 3. Definition of angle bisector |
| 4. $\overline{BD} \cong \overline{BD}$ | 4. Reflexive property |
| 5. $\triangle ABD \cong \triangle CBD$ | 5. SAS |

The angle at $B$ is included between sides $\overline{AB}$ and $\overline{BD}$ in one triangle and $\overline{CB}$ and $\overline{BD}$ in the other, so SAS applies. Shared sides like $\overline{BD}$ are common in congruence proofs; the reflexive property supplies them for free.

### Example 3

Points $A(0, 0)$, $B(4, 0)$, $C(0, 3)$ and $D(10, 2)$, $E(10, 6)$, $F(13, 2)$. Is $\triangle ABC \cong \triangle DEF$?

**Step 1.** In $\triangle ABC$, $\overline{AB}$ is horizontal with $AB = 4$ and $\overline{AC}$ is vertical with $AC = 3$. Horizontal and vertical lines are perpendicular, so $\angle A$ is a right angle, and it is the angle *between* $\overline{AB}$ and $\overline{AC}$.

**Step 2.** In $\triangle DEF$, $\overline{DE}$ is vertical with $DE = 4$ and $\overline{DF}$ is horizontal with $DF = 3$, so $\angle D$ is a right angle between them.

**Step 3.** $AB = DE$, $\angle A \cong \angle D$ (all right angles are congruent) and $AC = DF$. Two sides and the included angle match, so $\triangle ABC \cong \triangle DEF$ by SAS. (Once you have the Pythagorean theorem in Module 6, you can also find $BC = EF = 5$ and use SSS.)

### Example 4: an SSS proof with a shared side

*Given:* $\overline{AB} \cong \overline{AD}$ and $\overline{CB} \cong \overline{CD}$ in quadrilateral $ABCD$ (a kite shape). *Prove:* $\triangle ABC \cong \triangle ADC$.

| Statements | Reasons |
|---|---|
| 1. $\overline{AB} \cong \overline{AD}$, $\overline{CB} \cong \overline{CD}$ | 1. Given |
| 2. $\overline{AC} \cong \overline{AC}$ | 2. Reflexive property |
| 3. $\triangle ABC \cong \triangle ADC$ | 3. SSS |

Notice the order in the conclusion: $A \leftrightarrow A$, $B \leftrightarrow D$, $C \leftrightarrow C$, because $\overline{AB}$ was matched with $\overline{AD}$. Getting the order right now saves trouble later, when you use the congruence to say which angles match ($\angle B \cong \angle D$, as you'll prove in the next lesson).

## Which parts are "given for free"?

Before hunting for a shortcut, mark everything a diagram gives you without any work: a *shared side* (reflexive property), **vertical angles** where two segments cross, and angles from **parallel lines** (alternate interior and corresponding). Most textbook congruence proofs need exactly one or two of these free facts plus the given information.

## Common mistakes

- **Writing the congruence statement in the wrong order.** Match vertices by their equal angles or by the sides they connect.
- **Using SSA.** Two sides and a *non-included* angle do not prove congruence.
- **Using AAA.** Three equal angles make triangles the same shape but not necessarily the same size.
- **Forgetting the shared side.** Write it with the reflexive property.
- **Calling an angle "included" when it isn't between the two named sides.**

## Key points

- Congruent polygons have all corresponding sides and angles congruent; the order in a congruence statement gives the correspondence.
- Third Angles Theorem: two pairs of congruent angles force the third pair.
- SSS: three pairs of congruent sides prove triangles congruent.
- SAS: two sides and the included angle prove triangles congruent.
- SSA and AAA are not congruence tests.
