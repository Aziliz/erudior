---
id: geo-axiomatic
module: geo-m10
title: Axiomatic systems and Euclid's postulates
minutes: 35
topics: [Axiomatic systems, Euclid's postulates]
drills: [geo-pattern-lines, geo-finite-geom]
refs: [geo-ref-theorems]
---
All through this course we've built geometry from undefined terms, postulates and proofs. This lesson steps back and looks at that structure itself, the way a college course in the foundations of geometry does. What exactly is an axiomatic system? What makes one good? And what did Euclid actually assume, about 300 BCE, in the book that taught geometry for two thousand years?

## Axiomatic systems

An **axiomatic system** consists of:

1. **undefined terms** (like point and line),
2. **axioms**, statements about the undefined terms accepted without proof,
3. definitions of new terms built from the old ones, and
4. **theorems**, statements proved from the axioms by logic.

The undefined terms don't have to mean anything in particular. Any interpretation of them that makes all the axioms true is called a **model** of the system. Every theorem proved from the axioms is then automatically true in every model, which is the power of the method: prove once, apply everywhere.

## A tiny geometry

Consider this system. Undefined terms: *point*, *line*, *on*.

- **Axiom 1.** There are exactly four points.
- **Axiom 2.** Each pair of distinct points is on exactly one line.
- **Axiom 3.** Each line is on exactly two points.

How many lines are there? Each line corresponds to exactly one pair of points (Axioms 2 and 3), so the number of lines equals the number of pairs: $\binom42 = 6$. That's a **theorem** of this system, proved by pure reasoning. A model: the four corners of a square with its four sides and two diagonals as the lines. Another model: four people, with "lines" being pairs of people who shake hands. The theorem holds in both.

```shape
{"segments": [{"from": [0, 0], "to": [4, 0]}, {"from": [4, 0], "to": [4, 4]}, {"from": [4, 4], "to": [0, 4]}, {"from": [0, 4], "to": [0, 0]}, {"from": [0, 0], "to": [4, 4]}, {"from": [4, 0], "to": [0, 4]}], "points": [{"at": [0, 0], "label": "A"}, {"at": [4, 0], "label": "B"}, {"at": [4, 4], "label": "C"}, {"at": [0, 4], "label": "D"}], "caption": "A model of the four-point geometry: 4 points, 6 lines (the diagonals don't meet at a point of the geometry)."}
```

Notice that in this model the two diagonals do *not* intersect, because their crossing in the picture is not one of the four points. So in this geometry there are lines with no common point: "parallel" lines exist, and each line has exactly one parallel (for example, line $AB$ and line $CD$).

## Properties of axiom systems

- **Consistency.** A system is **consistent** if its axioms never lead to a contradiction. The usual way to show consistency is to exhibit a model: if a real example satisfies every axiom, the axioms can't contradict each other.
- **Independence.** An axiom is **independent** if it can't be proved from the others. To show this, find a model where all the *other* axioms hold but this one fails. (If it could be proved from the others, it would have to hold too.)
- **Completeness.** A system is **complete** if every statement in its language can be either proved or disproved from the axioms.

Consistency is essential. Independence is elegant (no wasted axioms) but not required. Completeness turns out to be surprisingly subtle: in the 1930s Kurt Gödel showed that any consistent system rich enough to include ordinary arithmetic is incomplete.

### Example 1: showing independence

In the four-point geometry, is Axiom 3 independent of Axioms 1 and 2?

Find a model of Axioms 1 and 2 where Axiom 3 fails. Take four points $A, B, C, D$, with one line containing $A$, $B$ and $C$, plus lines $AD$, $BD$, $CD$. Every pair of points is on exactly one line (Axiom 2) and there are four points (Axiom 1), but one line has three points, so Axiom 3 fails. Hence Axiom 3 is independent.

## Euclid's postulates

Euclid's *Elements* begins with 23 definitions, five "common notions" (general facts like "things equal to the same thing are equal to each other", our transitive property), and five postulates:

1. A straight line can be drawn from any point to any point.
2. A finite straight line can be extended continuously in a straight line.
3. A circle can be drawn with any center and any radius.
4. All right angles are equal to one another.
5. **The parallel postulate.** If a straight line crossing two straight lines makes the interior angles on the same side add up to less than two right angles, then the two lines, if extended indefinitely, meet on that side.

```shape
{"segments": [{"from": [0, 4], "to": [10, 2.6]}, {"from": [0, -0.5], "to": [10, 0.9]}, {"from": [2, -2], "to": [2.6, 5]}], "labels": [{"at": [3.2, 3.1], "text": "a"}, {"at": [3.1, 0.4], "text": "b"}, {"at": [8, 1.75], "text": "meet this way →"}], "caption": "Postulate 5: if a + b < 180°, the two lines meet on the side of a and b."}
```

The first four are short and obvious. The fifth is long and complicated, and it reads more like a theorem than a self-evident truth. For two thousand years, mathematicians tried to prove it from the other four. They failed, and in the process found many statements *equivalent* to it (each can be proved from the other, given the rest of Euclid's assumptions):

- **Playfair's axiom**: through a point not on a line there is exactly one parallel (Lesson 8).
- The angles of every triangle add to $180^\circ$.
- There exist similar triangles that are not congruent.
- There exists a rectangle.
- The Pythagorean theorem.

Each of these depends on the parallel postulate. Our proof of the triangle angle sum (Lesson 10) used a unique parallel through a vertex, which is exactly where it entered.

## Modern axiom systems

Euclid's proofs had gaps: he sometimes relied on what a diagram showed, for instance that two circles in his first construction actually intersect. In 1899 David Hilbert published a rigorous, gap-free set of axioms for Euclidean geometry, with undefined terms point, line, plane, *lies on*, *between*, and *congruent*, and axioms of incidence, order, congruence, continuity and parallels. School geometry courses use a friendlier system based on the ruler and protractor postulates (Lesson 2), introduced by George Birkhoff in 1932.

## Common mistakes

- **Treating an undefined term as meaningless.** It has no definition, but the axioms control how it behaves.
- **Proving consistency by "not finding a contradiction".** You need a model.
- **Confusing "independent" with "true".** An independent axiom can be true in some models and false in others; that's the point.

## Key points

- An axiomatic system has undefined terms, axioms, definitions and theorems; a model is an interpretation where all axioms hold.
- A system is consistent if it has a model; an axiom is independent if some model satisfies the others but not it.
- Euclid's fifth (parallel) postulate is equivalent to Playfair's axiom, to the $180^\circ$ triangle sum, and to the existence of non-congruent similar triangles.
