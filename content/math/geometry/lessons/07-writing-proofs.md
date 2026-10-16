---
id: geo-proofs
module: geo-m2
title: Two-column and paragraph proofs
minutes: 30
topics: [Geometric proof]
drills: [geo-vertical-alg, geo-alg-proof]
refs: [geo-ref-theorems]
---
You now have the raw materials of proof: definitions, postulates, properties of equality and congruence, and the law of detachment. This lesson puts them together to prove geometric statements. A **proof** is a logical argument in which every statement is justified by a reason. We'll write proofs in two styles, and prove the first family of angle theorems, which you'll rely on for the rest of the course.

## The anatomy of a proof

Every proof has:

1. **Given:** the facts you start with (the hypothesis of the theorem).
2. **Prove:** the statement you must reach (the conclusion).
3. A *diagram* showing the given information.
4. The argument itself, in which each step is justified by *given* information, a *definition*, a *postulate*, a *property*, or a previously proved *theorem*.

Allowed reasons never include "it looks like it" or "from the picture". You may read *positions* from a diagram (which points are collinear, which ray is between which), but not *measures* or *congruences* unless they're marked or given.

## Two-column proofs

A **two-column proof** lists numbered statements on the left and their reasons on the right.

### Example 1: Congruent Supplements Theorem

*Given:* $\angle 1$ and $\angle 2$ are supplementary; $\angle 3$ and $\angle 2$ are supplementary. *Prove:* $\angle 1 \cong \angle 3$.

| Statements | Reasons |
|---|---|
| 1. $\angle 1$ and $\angle 2$ are supplementary; $\angle 3$ and $\angle 2$ are supplementary | 1. Given |
| 2. $m\angle 1 + m\angle 2 = 180^\circ$; $m\angle 3 + m\angle 2 = 180^\circ$ | 2. Definition of supplementary angles |
| 3. $m\angle 1 + m\angle 2 = m\angle 3 + m\angle 2$ | 3. Transitive property (or substitution) |
| 4. $m\angle 1 = m\angle 3$ | 4. Subtraction property of equality |
| 5. $\angle 1 \cong \angle 3$ | 5. Definition of congruent angles |

The theorem in words: **Supplements of the same angle (or of congruent angles) are congruent.** The **Congruent Complements Theorem** is the same with $90^\circ$.

Notice the rhythm: definitions move us from geometry words ("supplementary", "congruent") into numbers, algebra does the work, and a definition moves us back.

## Proving vertical angles congruent

```shape
{"segments": [{"from": [-5, -2], "to": [5, 2]}, {"from": [-4, 3], "to": [4, -3]}], "labels": [{"at": [1.7, -0.1], "text": "1"}, {"at": [0, 1.3], "text": "2"}, {"at": [-1.7, 0.1], "text": "3"}, {"at": [0, -1.3], "text": "4"}], "caption": "Lines cross forming angles 1–4."}
```

### Example 2: Vertical Angles Theorem

*Given:* $\angle 1$ and $\angle 3$ are vertical angles. *Prove:* $\angle 1 \cong \angle 3$.

| Statements | Reasons |
|---|---|
| 1. $\angle 1$ and $\angle 3$ are vertical angles | 1. Given |
| 2. $\angle 1$ and $\angle 2$ form a linear pair; $\angle 2$ and $\angle 3$ form a linear pair | 2. Definition of linear pair (from the diagram: opposite rays) |
| 3. $\angle 1$ and $\angle 2$ are supplementary; $\angle 2$ and $\angle 3$ are supplementary | 3. Linear Pair Postulate |
| 4. $\angle 1 \cong \angle 3$ | 4. Congruent Supplements Theorem |

Using the theorem from Example 1 made this proof short. That is how mathematics grows: each proved theorem becomes a tool for the next.

## Paragraph proofs

A **paragraph proof** gives the same reasoning in sentences. It's the style used in college courses and in mathematics generally. It should still make every reason clear.

### Example 3: All right angles are congruent

*Given:* $\angle A$ and $\angle B$ are right angles. *Prove:* $\angle A \cong \angle B$.

*Proof.* Since $\angle A$ and $\angle B$ are right angles, by the definition of a right angle $m\angle A = 90^\circ$ and $m\angle B = 90^\circ$. By the transitive property of equality, $m\angle A = m\angle B$. By the definition of congruent angles, $\angle A \cong \angle B$. $\blacksquare$

### Example 4: A segment proof

*Given:* $AB = CD$, with points in the order $A, B, C, D$ on a line. *Prove:* $AC = BD$.

*Proof.* By the Segment Addition Postulate, $AC = AB + BC$ and $BD = BC + CD$. We are given $AB = CD$, so substituting $CD$ for $AB$ in the first equation gives $AC = CD + BC$, which equals $BC + CD$ by the commutative property. That is exactly $BD$. So $AC = BD$ by the transitive property. $\blacksquare$

```shape
{"segments": [{"from": [0, 0], "to": [12, 0]}], "points": [{"at": [0, 0], "label": "A"}, {"at": [3, 0], "label": "B"}, {"at": [9, 0], "label": "C"}, {"at": [12, 0], "label": "D"}], "caption": "AB = CD, so adding the shared piece BC gives AC = BD."}
```

The key move, adding the same shared piece to equal parts, is called the **overlapping segments** idea, and there is an angle version too.

## Strategy: how to find a proof

- **Start from both ends.** Ask what the given information lets you say (forward), and what you would need just before the conclusion (backward). Meet in the middle.
- **Translate words into equations.** "Midpoint", "bisects", "supplementary" and "perpendicular" each have a definition that produces an equation.
- **Look for shared parts.** Shared segments and angles, and vertical angles, give free facts.
- **Use earlier theorems.** If a step looks familiar, a theorem probably already does it.

## Common mistakes

- **Using the conclusion as a reason.** You can't assume what you're proving.
- **Reading measures off the diagram.** A segment that *looks* like a bisector isn't one unless that's given or proved.
- **Vague reasons.** "Angles" or "algebra" is not a reason; "Linear Pair Postulate" or "Subtraction property of equality" is.
- **Confusing $=$ and $\cong$.** Numbers are equal; figures are congruent. $m\angle 1 = m\angle 3$ but $\angle 1 \cong \angle 3$.
- **Skipping the definition step** between "congruent" and "equal measures".

## Key points

- A proof has Given, Prove, a diagram and a justified chain of statements.
- Two-column proofs pair each statement with a reason; paragraph proofs say the same in sentences.
- Congruent Supplements/Complements: supplements (complements) of the same or congruent angles are congruent.
- Vertical angles are congruent; all right angles are congruent.
- Definitions convert between figures and numbers in both directions.
