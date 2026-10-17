---
id: stat-prob-basics
module: stat-m5
title: Probability rules and Venn diagrams
minutes: 30
topics: [Probability rules]
drills: [stat-union, stat-venn-regions]
refs: [stat-ref-probability]
---
## Why probability

Random sampling and random assignment deliberately introduce chance. To reason about how
much a statistic might vary from sample to sample — the heart of inference — we need the
mathematics of chance. This module builds that from the ground up: rules, conditional
probability, Bayes' theorem and counting.

## Randomness and the law of large numbers

A process is **random** if individual outcomes are uncertain but there is a regular
distribution of outcomes in a large number of repetitions. A single coin toss is
unpredictable; the proportion of heads in 10,000 tosses is very predictable.

The **probability** of an outcome is the proportion of times it would occur in a very
long series of repetitions. This is the **law of large numbers**: as the number of trials
grows, the observed proportion gets closer and closer to the true probability.

The law says nothing about the short run. After five heads in a row, a fair coin is *not*
"due" for tails — the coin has no memory. Believing otherwise is the **gambler's fallacy**.
The long-run proportion settles down because early streaks are swamped by later trials,
not because they are corrected.

## Sample spaces and events

The **sample space** $S$ is the set of all possible outcomes. An **event** is any set of
outcomes (a subset of $S$). For two dice, $S$ has $6 \times 6 = 36$ equally likely
outcomes; the event "sum is 7" is $\{(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)\}$.

When all outcomes are equally likely,

$$P(A) = \frac{\text{number of outcomes in } A}{\text{number of outcomes in } S}.$$

So $P(\text{sum} = 7) = 6/36 = 1/6$.

## The basic rules

1. $0 \le P(A) \le 1$ for any event.
2. $P(S) = 1$: some outcome must occur.
3. **Complement rule**: the **complement** $A^c$ ("not $A$") has $P(A^c) = 1 - P(A)$.
4. *Addition rule for mutually exclusive events*: events are **mutually exclusive**
   (disjoint) if they cannot happen together. Then $P(A \text{ or } B) = P(A) + P(B)$.

The complement rule is a powerful shortcut: "at least one" is often hard to compute
directly but easy as $1 - P(\text{none})$.

## Unions, intersections and Venn diagrams

- The **union** $A \cup B$ is "$A$ or $B$ or both."
- The **intersection** $A \cap B$ is "$A$ and $B$."

A **Venn diagram** draws the sample space as a rectangle and events as overlapping
circles.

```shape
{"polygons": [{"points": [[0, 0], [10, 0], [10, 6], [0, 6]]}], "circles": [{"center": [3.8, 3], "r": 2.2, "fill": true, "color": "#2c5e8f"}, {"center": [6.2, 3], "r": 2.2, "fill": true, "color": "#c2570c"}], "labels": [{"at": [2.6, 3.1], "text": "A only"}, {"at": [5, 3.1], "text": "A ∩ B"}, {"at": [7.4, 3.1], "text": "B only"}, {"at": [1.2, 5.4], "text": "S"}, {"at": [8.9, 0.6], "text": "neither"}], "caption": "Venn diagram: the overlap is A ∩ B"}
```

### The general addition rule

For any two events,

$$P(A \cup B) = P(A) + P(B) - P(A \cap B).$$

Why subtract? Adding $P(A)$ and $P(B)$ counts the overlap twice — once in each circle — so
one copy must be removed. If $A$ and $B$ are mutually exclusive, the overlap is empty and
the rule reduces to rule 4.

### Example 1

At a station, 45% of riders buy coffee ($C$), 30% buy a newspaper ($N$) and 12% buy both.

1. $P(C \cup N) = 0.45 + 0.30 - 0.12 = 0.63$.
2. Neither: $1 - 0.63 = 0.37$.
3. Coffee only: $0.45 - 0.12 = 0.33$. Newspaper only: $0.30 - 0.12 = 0.18$.
4. Check: $0.33 + 0.12 + 0.18 + 0.37 = 1$. ✓

Filling in a Venn diagram from the inside out — overlap first, then the "only" regions,
then "neither" — solves most two-event problems.

### Example 2

Roll two fair dice. Find $P(\text{at least one six})$.

Directly, you'd count outcomes with a six in either position, being careful not to count
$(6, 6)$ twice. With the complement it's quicker: $P(\text{no six}) = 25/36$ (each die has 5
non-six faces), so $P(\text{at least one six}) = 1 - 25/36 = 11/36 \approx 0.306$.

Check with the addition rule: $P(\text{six on die 1}) + P(\text{six on die 2}) - P(\text{both}) = \tfrac{6}{36} + \tfrac{6}{36} - \tfrac{1}{36} = \tfrac{11}{36}$. ✓

### Example 3: a valid probability model?

A model for the number of defects per weld assigns $P(0) = 0.62$, $P(1) = 0.21$,
$P(2) = 0.11$, $P(3 \text{ or more}) = 0.08$. Is it valid?

The probabilities are each between 0 and 1, but they sum to $1.02$, not 1. The model is
invalid. (If $P(3 \text{ or more})$ were unknown, it would have to be $1 - 0.94 = 0.06$.)

## Simulation

When a probability is hard to compute, estimate it by **simulation**: model the random
process with random numbers, repeat it many times, and use the proportion of repetitions in
which the event occurs. For example, to estimate the chance that a family of four children
has at least three girls, use random digits (even = girl, odd = boy), read four digits per
family, repeat 1,000 times, and count. The law of large numbers guarantees the estimate
improves with more repetitions. The next lesson shows how to design and run simulations
step by step, and how to use them to judge whether a result is surprising.

## Common mistakes

- Adding probabilities of events that overlap without subtracting the intersection.
- Confusing "mutually exclusive" with "independent" (lesson 21): mutually exclusive
  events with positive probabilities are never independent.
- The gambler's fallacy: expecting short-run results to even out.
- Forgetting to check that a probability model sums to 1.

## Key points

- Probability = long-run relative frequency; law of large numbers.
- Equally likely outcomes: $P(A) = \dfrac{\text{favorable}}{\text{total}}$.
- Complement: $P(A^c) = 1 - P(A)$; use it for "at least one."
- General addition rule: $P(A \cup B) = P(A) + P(B) - P(A \cap B)$; drop the last term
  when $A$ and $B$ are mutually exclusive.
- Venn diagrams: fill in the overlap first.
