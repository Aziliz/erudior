---
id: geo-deductive
module: geo-m2
title: Deductive reasoning and algebraic proof
minutes: 30
topics: [Deductive reasoning, Algebraic proof]
drills: [geo-alg-proof]
refs: [geo-ref-theorems]
---
Inductive reasoning suggests what might be true; **deductive reasoning** shows what *must* be true. It starts from facts already accepted (definitions, postulates, given information, proven theorems) and applies the rules of logic to reach a conclusion that cannot be false if the starting facts are true. This lesson introduces the two basic rules of deduction and the properties of equality and congruence that serve as reasons in every proof you will write.

## Two laws of logic

**Law of Detachment.** If $p \to q$ is true and $p$ is true, then $q$ is true.

*If two angles are vertical, then they are congruent. $\angle 1$ and $\angle 3$ are vertical. Therefore $\angle 1 \cong \angle 3$.*

The law of detachment is the workhorse of proof: you check that a theorem's hypothesis is met, then you "detach" its conclusion.

A common trap is running it backwards. Knowing $p \to q$ and $q$ tells you **nothing** about $p$. "If a figure is a square, it has four sides. This figure has four sides." It could be a trapezoid. This error is called *affirming the consequent* (the "consequent" is another name for the conclusion $q$), and is also known as the converse error.

**Law of Syllogism.** If $p \to q$ and $q \to r$ are both true, then $p \to r$ is true.

*If a polygon is a square, then it is a rhombus. If a polygon is a rhombus, then its diagonals are perpendicular. So: if a polygon is a square, then its diagonals are perpendicular.*

Syllogism chains conditionals together like links, as long as the conclusion of one exactly matches the hypothesis of the next.

### Example 1

Decide what (if anything) follows.

(a) If $m\angle A > 90^\circ$, then $\angle A$ is obtuse. $m\angle A = 125^\circ$.

(b) If a number ends in 0, it is divisible by 5. The number 35 is divisible by 5.

(c) If $x = 4$, then $3x = 12$. If $3x = 12$, then $3x + 1 = 13$.

**(a)** The hypothesis holds, so by detachment $\angle A$ is obtuse.

**(b)** Nothing follows. The given fact matches the *conclusion*, not the hypothesis. (35 doesn't end in 0.)

**(c)** By syllogism: if $x = 4$, then $3x + 1 = 13$.

## Properties of equality

Algebra you already know is deductive reasoning. Each step of solving an equation is justified by a property of equality. For real numbers $a$, $b$, $c$:

| Property | Statement |
|---|---|
| Addition | If $a = b$, then $a + c = b + c$. |
| Subtraction | If $a = b$, then $a - c = b - c$. |
| Multiplication | If $a = b$, then $ac = bc$. |
| Division | If $a = b$ and $c \ne 0$, then $\tfrac{a}{c} = \tfrac{b}{c}$. |
| **Reflexive property** | $a = a$. |
| **Symmetric property** | If $a = b$, then $b = a$. |
| **Transitive property** | If $a = b$ and $b = c$, then $a = c$. |
| **Substitution property** | If $a = b$, then $a$ can replace $b$ in any expression. |
| **Distributive property** | $a(b + c) = ab + ac$. |

Segment lengths and angle measures are real numbers, so all of these apply to them. The reflexive, symmetric and transitive properties also hold for **congruence**: $\overline{AB} \cong \overline{AB}$; if $\angle A \cong \angle B$ then $\angle B \cong \angle A$; if $\overline{AB} \cong \overline{CD}$ and $\overline{CD} \cong \overline{EF}$ then $\overline{AB} \cong \overline{EF}$.

## Algebraic proofs

An **algebraic proof** writes the steps of solving an equation in a two-column format, with the reason for each step. This is good practice for geometric proofs, which have the same structure.

### Example 2

Prove: if $5(x - 3) = 2x + 6$, then $x = 7$.

| Statements | Reasons |
|---|---|
| 1. $5(x - 3) = 2x + 6$ | 1. Given |
| 2. $5x - 15 = 2x + 6$ | 2. Distributive property |
| 3. $3x - 15 = 6$ | 3. Subtraction property of equality |
| 4. $3x = 21$ | 4. Addition property of equality |
| 5. $x = 7$ | 5. Division property of equality |

Each statement follows from the one before it by a named rule. Nothing is assumed beyond what is given.

### Example 3

Given that $B$ is between $A$ and $C$, $AB = 2x + 3$, $BC = x - 1$ and $AC = 17$. Prove that $x = 5$.

```shape
{"segments": [{"from": [0, 0], "to": [13, 0], "label": "2x + 3"}, {"from": [13, 0], "to": [17, 0], "label": "x − 1"}], "points": [{"at": [0, 0], "label": "A"}, {"at": [13, 0], "label": "B"}, {"at": [17, 0], "label": "C"}], "labels": [{"at": [8.5, 1.4], "text": "AC = 17"}], "caption": "Segment addition sets up the equation (2x + 3) + (x − 1) = 17."}
```

| Statements | Reasons |
|---|---|
| 1. $B$ is between $A$ and $C$; $AB = 2x + 3$, $BC = x - 1$, $AC = 17$ | 1. Given |
| 2. $AB + BC = AC$ | 2. Segment Addition Postulate |
| 3. $(2x + 3) + (x - 1) = 17$ | 3. Substitution property |
| 4. $3x + 2 = 17$ | 4. Simplify (combine like terms) |
| 5. $3x = 15$ | 5. Subtraction property of equality |
| 6. $x = 5$ | 6. Division property of equality |

Step 2 is the geometric idea; the rest is algebra. Almost every "find $x$" problem in this course has this hidden structure: a geometry fact sets up the equation and algebra finishes it.

## Telling the properties apart

Students often confuse symmetric, transitive and substitution:

- **Symmetric** flips one equation: $m\angle 1 = m\angle 2$ becomes $m\angle 2 = m\angle 1$.
- **Transitive** links two equations through a shared middle: $AB = CD$ and $CD = EF$ give $AB = EF$.
- **Substitution** replaces a quantity with an equal one inside a larger expression: from $AB + BC = AC$ and $AB = 7$ you get $7 + BC = AC$.

## Common mistakes

- **Affirming the consequent.** From $p \to q$ and $q$, you cannot conclude $p$.
- **Breaking the chain in a syllogism.** "If $p$ then $q$" and "if $r$ then $s$" don't combine unless $q$ and $r$ match.
- **Naming the wrong property.** Moving a term to the other side is really adding or subtracting on both sides; name it that way.
- **Dividing by zero** or by an expression that might be zero.
- **Skipping the geometry reason.** In Example 3, "Segment Addition Postulate" is the step a grader looks for.

## Key points

- Deductive reasoning proves conclusions from accepted facts.
- Detachment: $p \to q$ and $p$ give $q$. Syllogism: $p \to q$ and $q \to r$ give $p \to r$.
- Properties of equality (and reflexive, symmetric, transitive for congruence) justify algebraic steps.
- An algebraic proof is a list of statements, each with a reason.
