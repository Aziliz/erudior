---
id: geo-conditional
module: geo-m2
title: Inductive reasoning and conditional statements
minutes: 30
topics: [Inductive reasoning, Conditional statements]
drills: [geo-pattern-lines, geo-seq-term]
refs: [geo-ref-theorems]
---
Module 1 gave us objects and measurements. Module 2 is about how we *know* things in geometry. There are two kinds of reasoning. Inductive reasoning looks at examples and guesses a rule; it is how most discoveries start. Deductive reasoning proves the rule must be true; it is how geometry confirms discoveries. This lesson covers inductive reasoning and the language of "if … then" statements, which is the grammar every proof is written in.

## Inductive reasoning and conjectures

**Inductive reasoning** means finding a pattern in specific cases and extending it to a general rule. The general rule you arrive at is a **conjecture**: an educated guess, not yet proved.

### Example 1

Mark $n$ points on a circle and connect every pair with a segment. Count the segments.

| Points $n$ | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|
| Segments | 1 | 3 | 6 | 10 | 15 |

```shape
{"circles": [{"center": [0, 0], "r": 5}], "segments": [{"from": [0.0, 5.0], "to": [-4.755, 1.545]}, {"from": [0.0, 5.0], "to": [-2.939, -4.045]}, {"from": [0.0, 5.0], "to": [2.939, -4.045]}, {"from": [0.0, 5.0], "to": [4.755, 1.545]}, {"from": [-4.755, 1.545], "to": [-2.939, -4.045]}, {"from": [-4.755, 1.545], "to": [2.939, -4.045]}, {"from": [-4.755, 1.545], "to": [4.755, 1.545]}, {"from": [-2.939, -4.045], "to": [2.939, -4.045]}, {"from": [-2.939, -4.045], "to": [4.755, 1.545]}, {"from": [2.939, -4.045], "to": [4.755, 1.545]}], "points": [[0.0, 5.0], [-4.755, 1.545], [-2.939, -4.045], [2.939, -4.045], [4.755, 1.545]], "caption": "Five points on a circle: every pair joined gives 10 segments."}
```

The differences are $2, 3, 4, 5$, growing by one each time. Each point connects to the $n - 1$ others, giving $n(n-1)$ connections, but every segment is counted from both ends, so

$$\text{segments} = \frac{n(n-1)}{2}.$$

For $n = 10$ this conjecture predicts $\tfrac{10 \cdot 9}{2} = 45$ segments. Here the reasoning about "each point connects to $n - 1$ others" actually turns the conjecture into a proof, which is the ideal outcome.

### When patterns lie

Patterns can fool you. Mark $n$ points on a circle, connect them all, and count the regions inside the circle (with points placed so that no three chords meet at one point):

| Points | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Regions | 1 | 2 | 4 | 8 | 16 | 31 |

The first five values double every time, so the conjecture "$2^{n-1}$ regions" looks certain, until six points give 31, not 32. That's why inductive reasoning alone never proves anything.

## Counterexamples

To show a conjecture is false, you need just one **counterexample**: a case where the hypothesis holds but the conclusion fails.

- Conjecture: "The sum of two angles is always obtuse." Counterexample: $20^\circ + 30^\circ = 50^\circ$, acute.
- Conjecture: "If two angles are supplementary, they form a linear pair." Counterexample: a $100^\circ$ angle in one corner of a page and an $80^\circ$ angle in another.

One counterexample destroys a conjecture; a thousand examples never prove one.

## Conditional statements

A **conditional statement** is an "if $p$, then $q$" statement, written $p \to q$. The part after "if" is the **hypothesis** ($p$); the part after "then" is the **conclusion** ($q$).

*If two angles form a linear pair, then they are supplementary.*

Hypothesis: two angles form a linear pair. Conclusion: they are supplementary.

Many statements are conditionals in disguise. "All right angles are congruent" means "If two angles are right angles, then they are congruent." "Vertical angles are congruent" means "If two angles are vertical, then they are congruent."

A conditional is **false only when the hypothesis is true and the conclusion is false.** If the hypothesis is false, the conditional is counted as true (it made no promise about that case). Think of it as a promise: "If it rains, I'll bring an umbrella" is only broken if it rains and you come without one.

## Converse, inverse and contrapositive

From $p \to q$ we can build three related statements. The symbol $\sim p$ means "not $p$" (the **negation** of $p$).

| Name | Form | Example |
|---|---|---|
| Conditional | $p \to q$ | If an angle measures $30^\circ$, then it is acute. |
| **Converse** | $q \to p$ | If an angle is acute, then it measures $30^\circ$. |
| **Inverse** | $\sim p \to \sim q$ | If an angle does not measure $30^\circ$, then it is not acute. |
| **Contrapositive** | $\sim q \to \sim p$ | If an angle is not acute, then it does not measure $30^\circ$. |

In this example the conditional is true, the converse is false (a $50^\circ$ angle is acute), the inverse is false (again, $50^\circ$), and the contrapositive is true.

That pattern always holds: **a conditional and its contrapositive always have the same truth value**, and so do the converse and inverse. Statements with the same truth value in every case are called **logically equivalent**. Why? The contrapositive says "whenever the conclusion fails, the hypothesis must have failed too", which is just another way of saying "the hypothesis forces the conclusion".

The converse and inverse are contrapositives of *each other*, which is why they match each other but can differ from the original.

### Example 2

Write the converse, inverse and contrapositive of "If two lines are perpendicular, then they intersect." Decide whether each is true.

**Conditional:** True. Perpendicular lines meet at a right angle.

**Converse:** If two lines intersect, then they are perpendicular. *False*: lines can cross at $40^\circ$.

**Inverse:** If two lines are not perpendicular, then they do not intersect. *False*: same counterexample.

**Contrapositive:** If two lines do not intersect, then they are not perpendicular. *True*, matching the conditional.

## Biconditionals and good definitions

When both a conditional and its converse are true, they can be joined into a **biconditional**: "$p$ if and only if $q$", written $p \leftrightarrow q$ (sometimes "iff").

*An angle is a right angle if and only if it measures $90^\circ$.*

Every good definition is a biconditional. That matters in proofs: a definition can be used in both directions. Knowing $M$ is a midpoint lets you conclude $AM = MB$ (with $M$ on the segment), and knowing $AM = MB$ with $M$ on the segment lets you conclude $M$ is the midpoint.

### Example 3

Can "If an angle is a straight angle, then its measure is $180^\circ$" be written as a biconditional?

**Step 1.** The conditional is true by definition.

**Step 2.** Converse: "If an angle measures $180^\circ$, then it is a straight angle." True, also by definition.

**Step 3.** Both directions hold, so: *An angle is a straight angle if and only if it measures $180^\circ$.*

## Common mistakes

- **Treating a pattern as a proof.** The circle-regions example breaks at the sixth case.
- **Assuming the converse is true.** "All squares are rectangles" is true; "all rectangles are squares" is not.
- **Mixing up inverse and contrapositive.** Contrapositive *swaps and negates*; inverse only negates.
- **Writing a biconditional when only one direction holds.**
- **Thinking a false hypothesis makes the conditional false.** It doesn't; only true-then-false does.

## Key points

- Inductive reasoning makes conjectures from patterns; one counterexample disproves a conjecture.
- A conditional $p \to q$ is false only when $p$ is true and $q$ is false.
- Converse $q \to p$, inverse $\sim p \to \sim q$, contrapositive $\sim q \to \sim p$.
- A conditional and its contrapositive are logically equivalent; so are the converse and inverse.
- A biconditional ("if and only if") holds when a conditional and its converse are both true; definitions are biconditionals.
