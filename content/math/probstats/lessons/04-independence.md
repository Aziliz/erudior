---
id: ps-independence
module: ps-m1
title: Independence
minutes: 35
topics: [Independence]
drills: [ps-d-reliability, ps-d-at-least-one]
refs: [ps-ref-probability]
---
## When information does not help

Conditioning usually changes probabilities. Sometimes it does not: knowing that today's
lottery number ended in 7 tells you nothing about whether a coin you toss lands heads.
Independence is the mathematical version of "irrelevant information." It is the assumption
behind almost every model of repeated trials in this course — binomial counts, random
samples, and eventually the Central Limit Theorem — so it deserves a careful definition.

## Independence of two events

Events $A$ and $B$ are **independent** if

$$P(A \cap B) = P(A)\,P(B).$$

When $P(B) > 0$ this is equivalent to $P(A \mid B) = P(A)$: divide both sides by $P(B)$. The
product form is used as the definition because it is symmetric in $A$ and $B$ and makes sense
even when a probability is zero (an event of probability 0 is independent of everything).

**Complements inherit independence.** If $A$ and $B$ are independent, so are $A$ and $B^c$:

$$P(A \cap B^c) = P(A) - P(A \cap B) = P(A) - P(A)P(B) = P(A)\,(1 - P(B)) = P(A)\,P(B^c).$$

Applying this twice, $A^c$ and $B^c$ are independent too. Whatever you learn about $B$ —
that it happened or that it did not — tells you nothing about $A$.

**Independent is not disjoint.** If $A$ and $B$ are mutually exclusive with positive
probabilities, then $P(A \cap B) = 0 \ne P(A)P(B)$. Disjoint events are strongly *dependent*:
learning that one occurred tells you the other did not.

Independence is sometimes *assumed* from the physical setup (separate dice, separate
machines with no shared cause) and sometimes *checked* from given probabilities. For
example, if $P(A) = 0.4$, $P(B) = 0.5$ and $P(A \cup B) = 0.7$, then
$P(A \cap B) = 0.4 + 0.5 - 0.7 = 0.2 = 0.4 \times 0.5$, so $A$ and $B$ are independent.

## More than two events

Events $A_1, \ldots, A_n$ are **mutually independent** if for *every* subcollection
$A_{i_1}, \ldots, A_{i_k}$ (with $k \ge 2$),

$$P(A_{i_1} \cap \cdots \cap A_{i_k}) = P(A_{i_1}) \cdots P(A_{i_k}).$$

For three events that is four conditions: three pairs and the triple. They are
**pairwise independent** if only the pair conditions hold — and that is genuinely weaker.

**Counterexample.** Toss two fair coins. Let $A$ = "first is heads," $B$ = "second is
heads," $C$ = "the two coins differ." Each has probability $\tfrac12$. Each pair intersects in
exactly one of the four outcomes ($A \cap B = \{HH\}$, $A \cap C = \{HT\}$, $B \cap C = \{TH\}$),
so each pair has probability $\tfrac14 = \tfrac12 \cdot \tfrac12$: pairwise independent. But
$A \cap B \cap C = \varnothing$, since if both coins are heads they do not differ. So
$P(A \cap B \cap C) = 0 \ne \tfrac18$. Any two of the events say nothing about each other, yet
knowing $A$ and $B$ together settles $C$ completely.

The reverse failure also happens: the single triple product can hold while a pair condition
fails. You must check every subcollection.

## Independent trials

A sequence of experiments is a sequence of **independent trials** if events determined by
different trials are mutually independent. Then the probability of any particular sequence
of results is the product of the individual probabilities, which is exactly what made the
birthday calculation work.

The most useful consequence is the "at least one" formula. If each trial succeeds with
probability $p$, then by independence of the failures,

$$P(\text{at least one success in } n \text{ trials}) = 1 - P(\text{all fail}) = 1 - (1 - p)^n.$$

To make this at least a target $q$, solve $(1-p)^n \le 1 - q$, giving
$n \ge \dfrac{\ln(1 - q)}{\ln(1 - p)}$ (the inequality flips because both logs are negative).

### Example 1: two old gambling bets

Is it better to bet on at least one six in 4 rolls of a die, or at least one double six in
24 rolls of a pair of dice?

1. One die: $1 - (5/6)^4 = 1 - 625/1296 \approx 0.5177$.
2. Pair of dice: $P(\text{double six}) = 1/36$ per roll, so $1 - (35/36)^{24} \approx 0.4914$.

The first bet is favorable and the second is not, even though $4/6 = 24/36$. The naive
"expected count" reasoning ignores that successes can repeat. How many rolls of the pair would
make the second bet favorable? We need $n \ge \ln(0.5)/\ln(35/36) \approx 24.6$, so 25 rolls.

## System reliability

Engineers use independence to compute the **reliability** (probability of working) of a
system built from components that fail independently.

- A **series system** works only if every component works: $R = p_1 p_2 \cdots p_n$.
- A **parallel system** works if at least one component works:
  $R = 1 - (1 - p_1)(1 - p_2)\cdots(1 - p_n)$.

Series connections can only lower reliability (each factor is at most 1); parallel
redundancy raises it.

### Example 2: a mixed system

A signal must pass through component $A$ (reliability 0.95), then through either of two
redundant units $B$ or $C$ (0.90 each), then through $D$ (0.98). All fail independently.

```shape
{"x": [-0.2, 8.2], "y": [-1.8, 1.8], "segments": [{"from": [0, 0], "to": [1, 0]}, {"from": [2, 0], "to": [3, 0]}, {"from": [3, -1], "to": [3, 1]}, {"from": [3, 1], "to": [3.5, 1]}, {"from": [3, -1], "to": [3.5, -1]}, {"from": [4.5, 1], "to": [5, 1]}, {"from": [4.5, -1], "to": [5, -1]}, {"from": [5, -1], "to": [5, 1]}, {"from": [5, 0], "to": [6, 0]}, {"from": [7, 0], "to": [8, 0]}], "polygons": [{"points": [[1, -0.4], [2, -0.4], [2, 0.4], [1, 0.4]]}, {"points": [[3.5, 0.6], [4.5, 0.6], [4.5, 1.4], [3.5, 1.4]]}, {"points": [[3.5, -1.4], [4.5, -1.4], [4.5, -0.6], [3.5, -0.6]]}, {"points": [[6, -0.4], [7, -0.4], [7, 0.4], [6, 0.4]]}], "labels": [{"at": [1.4, -0.1], "text": "A"}, {"at": [3.9, 0.9], "text": "B"}, {"at": [3.9, -1.1], "text": "C"}, {"at": [6.4, -0.1], "text": "D"}], "caption": "A, then B or C in parallel, then D"}
```

1. The parallel block fails only if both $B$ and $C$ fail: $R_{BC} = 1 - (0.10)(0.10) = 0.99$.
2. The system is a series of $A$, the block, and $D$: $R = 0.95 \times 0.99 \times 0.98 \approx 0.9217$.

The redundant pair is more reliable (0.99) than either unit alone; the weakest link is now
$A$. Doubling $A$ instead would give $0.9975 \times 0.99 \times 0.98 \approx 0.968$.

## Conditional independence

Events can be independent given some information without being independent overall, and
vice versa. $A$ and $B$ are **conditionally independent** given $C$ if
$P(A \cap B \mid C) = P(A \mid C)\,P(B \mid C)$.

### Example 3: a coin of unknown type

A bag holds a fair coin and a two-headed coin. You pick one at random and toss it twice.
Given which coin you have, the tosses are independent. But unconditionally:

1. By total probability, $P(H_1) = \tfrac12 \cdot \tfrac12 + \tfrac12 \cdot 1 = \tfrac34$, and
   likewise $P(H_2) = \tfrac34$.
2. $P(H_1 \cap H_2) = \tfrac12 \cdot \tfrac14 + \tfrac12 \cdot 1 = \tfrac58$.
3. $\tfrac58 \ne \tfrac34 \cdot \tfrac34 = \tfrac{9}{16}$, so the tosses are *dependent*:
   $P(H_2 \mid H_1) = \tfrac{5/8}{3/4} = \tfrac56 > \tfrac34$.

A first head is evidence that you hold the two-headed coin, which makes a second head more
likely. Many real "dependent" observations work this way: they are independent given an
unknown common cause (a machine's setting, a patient's condition) and dependent because the
cause is unknown.

## Common mistakes

- Treating "mutually exclusive" as a kind of independence; it is the opposite.
- Checking only the pairs when mutual independence is needed (or only the triple).
- Multiplying probabilities for events that share a cause without checking independence.
- Computing "at least one" as $np$ — that is an expected count and can exceed 1.
- Forgetting to flip the inequality when dividing by $\ln(1 - p) < 0$.

## Key points

- Independent: $P(A \cap B) = P(A)P(B)$, equivalently $P(A \mid B) = P(A)$ when $P(B) > 0$.
- Independence passes to complements; disjoint events with positive probability are dependent.
- Mutual independence requires the product rule for every subcollection; pairwise is weaker.
- Independent trials: $P(\text{at least one success}) = 1 - (1-p)^n$.
- Series: $\prod p_i$; parallel: $1 - \prod(1 - p_i)$.
- Conditional independence given $C$ does not imply independence, and vice versa.
