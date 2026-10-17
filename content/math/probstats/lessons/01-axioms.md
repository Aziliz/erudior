---
id: ps-axioms
module: ps-m1
title: Sample spaces, events and the axioms of probability
minutes: 35
topics: [Sample spaces and events, Probability axioms]
drills: [ps-d-union-two, ps-d-incl-excl-three]
refs: [ps-ref-probability]
---
## Why start with axioms?

You have probably computed probabilities before by counting favorable cases or reading
values off a table. This course builds probability as a piece of mathematics: a few
definitions, three axioms, and everything else proved from them. That foundation pays off
later, when the questions become too subtle for intuition alone (conditioning on events of
probability zero, infinite sequences of trials, limit theorems). This lesson sets up the
language — sample spaces, events and set operations — and then derives the rules you will
use constantly, including inclusion–exclusion.

## Sample spaces and events

A random experiment is any process whose result is uncertain in advance. Its
**sample space** $S$ is the set of all possible results, and each element of $S$ is an
**outcome**. Choosing $S$ is the first modeling decision, and it should be detailed enough to
answer the questions you care about.

- Roll two dice, one red and one blue: $S = \{(i, j) : i, j = 1, \ldots, 6\}$, with 36 outcomes.
  Listing ordered pairs (rather than the sum) keeps the outcomes equally likely.
- Count the trains that pass a signal before the first one that is late:
  $S = \{0, 1, 2, \ldots\}$, which is countably infinite.
- Measure the lifetime of a bearing in hours: $S = [0, \infty)$, an interval.

An **event** is a subset of $S$ — a collection of outcomes about which we can ask "did it
happen?" The event $A$ *occurs* when the actual outcome is a member of $A$. For the two dice,
"the sum is 7" is the event $\{(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)\}$. The empty set
$\varnothing$ is the impossible event and $S$ itself is the certain event.

## Combining events

Because events are sets, set operations build new events from old ones:

| Operation | Notation | Occurs when… |
|---|---|---|
| **union** | $A \cup B$ | $A$ occurs, or $B$ occurs, or both |
| **intersection** | $A \cap B$ | both $A$ and $B$ occur |
| **complement** | $A^c$ | $A$ does not occur |
| difference | $A \cap B^c$ | $A$ occurs but $B$ does not |

Events $A$ and $B$ are **mutually exclusive** (or **disjoint**) when $A \cap B = \varnothing$:
they cannot happen together. A collection of events $B_1, B_2, \ldots$ is a **partition** of
$S$ if they are pairwise disjoint and their union is all of $S$, so exactly one of them occurs.

```shape
{"x": [-3.6, 6.0], "y": [-2.9, 2.9], "polygons": [{"points": [[-3.4, -2.7], [5.8, -2.7], [5.8, 2.7], [-3.4, 2.7]]}], "circles": [{"center": [0, 0], "r": 2.2, "fill": true}, {"center": [2.4, 0], "r": 2.2, "fill": true}], "labels": [{"at": [-1.3, 0], "text": "A ∩ Bᶜ"}, {"at": [1.2, 0], "text": "A ∩ B"}, {"at": [3.5, 0], "text": "Aᶜ ∩ B"}, {"at": [-3.0, 2.3], "text": "S"}, {"at": [-0.3, 2.35], "text": "A"}, {"at": [2.7, 2.35], "text": "B"}, {"at": [4.2, -2.3], "text": "(A ∪ B)ᶜ"}], "caption": "A Venn diagram splits S into four disjoint regions"}
```

Two identities, **De Morgan's laws**, convert between unions and intersections:

$$(A \cup B)^c = A^c \cap B^c, \qquad (A \cap B)^c = A^c \cup B^c.$$

In words: "not (A or B)" means "neither A nor B," and "not both" means "at least one fails."
They extend to any number of events, and they are the reason "at least one" problems are
usually solved through the complement "none."

## The axioms

A **probability measure** assigns a number $P(A)$ to each event so that the
**axioms of probability** (Kolmogorov's axioms) hold:

1. $P(A) \ge 0$ for every event $A$.
2. $P(S) = 1$.
3. **Countable additivity**: if $A_1, A_2, \ldots$ are pairwise disjoint, then
   $P\left(\bigcup_{i} A_i\right) = \sum_i P(A_i)$.

That is all. The axioms do not say *which* numbers to use — that is the job of a model
(equally likely outcomes, a fitted distribution, physical symmetry). They only say how any
sensible assignment must behave.

## Consequences you can prove

Each rule below follows from the axioms; seeing why makes it easy to rebuild a rule you
have forgotten.

**The empty set has probability 0.** Take every $A_i = \varnothing$ in axiom 3. The union is
$\varnothing$, so $P(\varnothing) = \sum P(\varnothing)$, which is only finite if
$P(\varnothing) = 0$. Countable additivity then also gives *finite* additivity (pad a finite
list with empty sets).

**Complement rule.** $A$ and $A^c$ are disjoint with union $S$, so
$P(A) + P(A^c) = P(S) = 1$:

$$P(A^c) = 1 - P(A).$$

**Monotonicity.** If $A \subseteq B$, write $B = A \cup (B \cap A^c)$, a disjoint union. Then
$P(B) = P(A) + P(B \cap A^c) \ge P(A)$. In particular $P(A) \le P(S) = 1$.

**Addition rule for two events.** Split $A \cup B$ into the three disjoint regions of the
Venn diagram. Since $P(A) = P(A \cap B^c) + P(A \cap B)$ and similarly for $B$, adding
$P(A) + P(B)$ counts the overlap twice; subtract it once:

$$P(A \cup B) = P(A) + P(B) - P(A \cap B).$$

**Inclusion–exclusion for three events.** Applying the two-event rule twice gives

$$P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C).$$

The pattern — add singles, subtract pairs, add triples, … — is the
**inclusion–exclusion principle**. For $n$ events,

$$P\left(\bigcup_{i=1}^n A_i\right) = \sum_i P(A_i) - \sum_{i<j} P(A_i \cap A_j) + \sum_{i<j<k} P(A_i \cap A_j \cap A_k) - \cdots + (-1)^{n+1} P(A_1 \cap \cdots \cap A_n).$$

Why it works: an outcome lying in exactly $m \ge 1$ of the events is counted
$\binom{m}{1} - \binom{m}{2} + \binom{m}{3} - \cdots = 1 - (1 - 1)^m = 1$ time, by the binomial
theorem.

**Union bound.** Dropping the subtracted terms can only increase the right side, giving
**Boole's inequality** $P\left(\bigcup A_i\right) \le \sum P(A_i)$. It is crude but needs no
information about overlaps — handy for bounding the chance that *any* of many rare failures
occurs.

### Example 1: two events

On a commuter line, 30% of trains are late ($L$), 25% are overcrowded ($O$), and 10% are
both. Find the probability that a train is (a) late or overcrowded, (b) late but not
overcrowded, (c) neither.

1. Addition rule: $P(L \cup O) = 0.30 + 0.25 - 0.10 = 0.45$.
2. "Late but not overcrowded" is the region $L \cap O^c$. Since
   $P(L) = P(L \cap O) + P(L \cap O^c)$, we get $P(L \cap O^c) = 0.30 - 0.10 = 0.20$.
3. By De Morgan, "neither" is $L^c \cap O^c = (L \cup O)^c$, so its probability is
   $1 - 0.45 = 0.55$.

A quick check: the four Venn regions have probabilities $0.20, 0.10, 0.15, 0.55$, which add
to 1.

### Example 2: divisibility by inclusion–exclusion

Pick an integer uniformly at random from $1, 2, \ldots, 100$. What is the probability it is
divisible by 2, 3 or 5?

Let $A_2, A_3, A_5$ be the events "divisible by 2, 3, 5." The number of multiples of $d$ up to
100 is $\lfloor 100/d \rfloor$, and divisible by both 2 and 3 means divisible by 6, and so on.

- Singles: $50 + 33 + 20 = 103$.
- Pairs: multiples of 6, 10, 15: $16 + 10 + 6 = 32$.
- Triple: multiples of 30: $3$.

So the count is $103 - 32 + 3 = 74$ and the probability is $74/100 = 0.74$. Notice that the
singles alone exceed 100 — exactly the overcounting that the correction terms remove.

### Example 3: a lower bound from the axioms

Suppose $P(A) = 0.9$ and $P(B) = 0.8$, with nothing known about how they overlap. How small
can $P(A \cap B)$ be?

Rearranging the addition rule, $P(A \cap B) = P(A) + P(B) - P(A \cup B)$, and since
$P(A \cup B) \le 1$,

$$P(A \cap B) \ge P(A) + P(B) - 1 = 0.7.$$

This is the **Bonferroni inequality**. It guarantees, for instance, that if two systems are
each available 90% and 80% of the time, both are available at least 70% of the time — no
matter how their outages are related.

## Equally likely outcomes

When $S$ is finite and symmetry makes every outcome equally likely, the axioms force
$P(\{s\}) = 1/|S|$ for each outcome, and additivity gives

$$P(A) = \frac{|A|}{|S|} = \frac{\text{number of outcomes in } A}{\text{number of outcomes in } S}.$$

For two fair dice, $P(\text{sum} = 7) = 6/36 = 1/6$. Probability then becomes counting, which
is the subject of the next lesson. Be careful that the outcomes really are equally likely:
the eleven possible *sums* 2–12 are not.

## Common mistakes

- Adding $P(A) + P(B)$ for events that can happen together. The addition rule without the
  overlap term is only for mutually exclusive events.
- Confusing "mutually exclusive" with "independent" (lesson 4). Disjoint events with positive
  probabilities are never independent: knowing one occurred rules the other out.
- Getting De Morgan backwards: the complement of "A or B" is "not A *and* not B."
- Treating a coarse description of results (like dice sums) as equally likely outcomes.
- Stopping inclusion–exclusion after the pair terms when there are three or more events.

## Key points

- A sample space $S$ lists all outcomes; events are subsets of $S$.
- Axioms: $P(A) \ge 0$, $P(S) = 1$, countable additivity for disjoint events.
- Consequences: $P(\varnothing) = 0$, $P(A^c) = 1 - P(A)$, $A \subseteq B \Rightarrow P(A) \le P(B)$.
- $P(A \cup B) = P(A) + P(B) - P(A \cap B)$; for more events, alternate signs over singles,
  pairs, triples, ….
- Union bound: $P(\bigcup A_i) \le \sum P(A_i)$; Bonferroni: $P(A \cap B) \ge P(A) + P(B) - 1$.
- With finitely many equally likely outcomes, $P(A) = |A|/|S|$.
