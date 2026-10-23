---
id: stat-m5-h-inclusion-exclusion
module: stat-m5
honors: true
title: 'Inclusion–exclusion, birthdays and matching'
minutes: 45
topics: [Inclusion–exclusion]
drills: [stat-m5-r2-incl-excl3, stat-m5-r2-birthday, stat-m5-r2-derange]
refs: [stat-ref-probability]
---
## Beyond two events

The general addition rule from the probability-rules lesson fixed one problem: adding $P(A)$ and
$P(B)$ counts the overlap twice, so you subtract it once. With three or more events the overlaps
themselves overlap, and the bookkeeping needs a system. This honors lesson builds that system, the
**inclusion–exclusion principle**, and then puts it to work, together with the complement rule and
the counting tools from the counting lesson, on two classic problems whose answers surprise almost
everyone: how many people it takes for two of them to share a birthday, and what happens when
letters are stuffed into envelopes at random.

## Three events

For any three events,

$$P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C).$$

Add the singles, subtract the pairs, add back the triple. Why does the triple come back? Follow
one outcome and count how many times the right side counts it:

| The outcome is in | Counted by the singles | Removed by the pairs | Added by the triple | Net |
|---|---|---|---|---|
| exactly one event | 1 | 0 | 0 | 1 |
| exactly two events | 2 | 1 | 0 | 1 |
| all three events | 3 | 3 | 1 | 1 |

Every outcome in the union is counted exactly once, which is what a probability of a union
needs. An outcome in all three events is added three times and removed three times (it lies in
all three pairwise overlaps), so without the last term it would vanish from the count entirely.

### Example 1: how commuters travel

A survey of 500 commuters found that 220 sometimes take the bus ($B$), 180 the train ($T$) and 90
ride a bike ($K$). Also 70 use both bus and train, 30 bus and bike, 25 train and bike, and 10 use all
three. How many use none of the three?

*Union.* By inclusion–exclusion, the number using at least one is
$220 + 180 + 90 - 70 - 30 - 25 + 10 = 375$. So $500 - 375 = 125$ use none, a probability of
$125/500 = 0.25$ for a randomly chosen commuter.

*Every region.* To fill in a three-circle Venn diagram, work from the inside out, just as with two
circles:

1. Center (all three): 10.
2. Exactly two: bus and train only $70 - 10 = 60$; bus and bike only $30 - 10 = 20$; train and bike
   only $25 - 10 = 15$. Each pairwise count *includes* the center, so subtract it.
3. Exactly one: bus only $220 - 60 - 20 - 10 = 130$; train only $180 - 60 - 15 - 10 = 95$; bike only
   $90 - 20 - 15 - 10 = 45$.
4. Neither: $500 - (10 + 60 + 20 + 15 + 130 + 95 + 45) = 500 - 375 = 125$. ✓

![A rectangle holds three overlapping circles: Bus (B) at upper left, Train (T) at upper right and Bike (K) at the bottom. Region counts: bus only 130, train only 95, bike only 45, bus and train only 60, bus and bike only 20, train and bike only 15, all three 10 in the center, and neither 125 outside all circles.](images/stat-m5-venn-three.svg)

Now other questions are quick. Exactly one mode: $130 + 95 + 45 = 270$ commuters, probability 0.54.
Train but not bus: $95 + 15 = 110$.

### Example 2: at least one six in three rolls

Roll a fair die three times and let $A_i$ be "a six on roll $i$." The rolls are independent, so each
single has probability $\tfrac16$, each pair $\tfrac1{36}$ and the triple $\tfrac1{216}$:

$$P(\text{at least one six}) = 3 \cdot \tfrac16 - 3 \cdot \tfrac1{36} + \tfrac1{216} = \tfrac{108 - 18 + 1}{216} = \tfrac{91}{216} \approx 0.421.$$

The complement gives the same answer faster: $1 - (5/6)^3 = 1 - 125/216 = 91/216$. When the
events are independent, the complement is usually the better route. Inclusion–exclusion earns its
keep when "none of them" is hard to count directly, as in the matching problem below.

## Any number of events

The pattern continues: for events $A_1, \ldots, A_n$,

$$P\Big(\bigcup_{i} A_i\Big) = \sum_i P(A_i) - \sum_{i<j} P(A_i \cap A_j) + \sum_{i<j<k} P(A_i \cap A_j \cap A_k) - \cdots \pm P(A_1 \cap \cdots \cap A_n).$$

The signs alternate: add singles, subtract pairs, add triples, subtract quadruples, and so on. (The
same counting argument works: an outcome in exactly $m$ of the events is counted
$\binom{m}{1} - \binom{m}{2} + \binom{m}{3} - \cdots = 1$ time, which follows from the binomial
theorem applied to $(1 - 1)^m = 0$.)

### The union bound

Stopping after the first sum gives an upper limit that needs no information about overlaps at all:

$$P(A_1 \cup \cdots \cup A_n) \le P(A_1) + \cdots + P(A_n).$$

This is the **union bound**, also called Boole's inequality. It holds whether the events are
independent or not, because the sum counts every overlap at least once. In the conditional
probability lesson, 10 independent relays each failed with probability 0.02, and the chance that
at least one fails was $1 - 0.98^{10} \approx 0.183$. The union bound says "at most
$10 \times 0.02 = 0.20$" without using independence. More generally, stopping after an odd number of
sums overestimates and stopping after an even number underestimates (these are the Bonferroni
inequalities, stated here without proof).

## The birthday problem

How many people must be in a room for the chance that at least two share a birthday to pass
one half? Most people guess well over 100. The answer is 23.

*Model.* Take 365 equally likely birthdays (ignore February 29) and assume different people's
birthdays are independent (no twins). This is a simplified model, discussed below.

*Complement.* "At least two share" is messy; "all different" is a chain of multiplications. The
first person can have any birthday; the second must avoid 1 day, the third 2 days, and so on:

$$P(\text{all } n \text{ different}) = \frac{365}{365} \cdot \frac{364}{365} \cdots \frac{365 - n + 1}{365} = \frac{_{365}P_n}{365^n}.$$

### Example 3: 23 people and 30 people

For $n = 23$ the product is about 0.4927, so $P(\text{a shared birthday}) \approx 0.507$. For
$n = 30$ the product is about 0.2937, so the chance of a match is about 0.706. (Multiply on a
calculator, or use $_{365}P_n$ directly.)

Why so few people? A match can come from *any pair*, and 23 people form $\binom{23}{2} = 253$
pairs. Each pair matches with probability $\tfrac1{365}$. Treating the pairs as if they were
independent (they are not quite) gives a handy approximation:

$$P(\text{no match}) \approx \Big(1 - \tfrac{1}{365}\Big)^{\binom{n}{2}} \approx e^{-\binom{n}{2}/365}.$$

For $n = 23$, $e^{-253/365} \approx 0.500$, close to the exact 0.4927.

```plot
{"x": [0, 70], "y": [0, 1.05], "xLabel": "number of people n", "yLabel": "P(at least one shared birthday)", "functions": [{"f": "1 - exp(-x*(x-1)/730)", "label": "approximation", "dashed": true}, {"f": "0.5", "dashed": true}], "points": [{"at": [10, 0.117]}, {"at": [15, 0.253]}, {"at": [20, 0.411]}, {"at": [23, 0.507]}, {"at": [30, 0.706]}, {"at": [40, 0.891]}, {"at": [50, 0.970]}, {"at": [60, 0.994]}], "labels": [{"at": [33, 0.44], "text": "n = 23: 0.507"}], "caption": "Exact probabilities (dots) and the approximation 1 − e^(−n(n−1)/730) (dashed curve)"}
```

Compare a different question: the chance that someone among 22 *others* shares *your* birthday is
$1 - (364/365)^{22} \approx 0.059$. Only 22 of the 253 pairs involve you. Mixing up "some pair" with
"someone matches me" is the usual source of disbelief.

*How good is the model?* Real birth dates are not spread perfectly evenly over the year (there are
seasonal and day-of-week patterns), and twins exist. Unevenness can only make a shared birthday
*more* likely, so for real groups 0.507 is, if anything, a slight underestimate. The problem was
first published by the mathematician Richard von Mises in 1939; who first posed it is uncertain.

## The matching problem

A secretary stuffs $n$ letters into $n$ addressed envelopes completely at random. What is the
probability that no letter lands in its own envelope? An arrangement in which nothing is in its
own place is called a **derangement**. This is one of the oldest problems in probability: Pierre
Rémond de Montmort studied it in 1708 as the *problème des rencontres* (problem of coincidences).

Let $A_i$ be "letter $i$ is in its own envelope." All $n!$ arrangements are equally likely.

- $P(A_i) = \dfrac{(n-1)!}{n!} = \dfrac1n$: fix letter $i$, arrange the rest.
- For any $k$ particular letters, $P(\text{all } k \text{ correct}) = \dfrac{(n-k)!}{n!}$.
- There are $\binom{n}{k}$ ways to pick the $k$ letters, so the $k$-th sum in inclusion–exclusion is
  $\binom{n}{k}\dfrac{(n-k)!}{n!} = \dfrac{1}{k!}$.

So

$$P(\text{at least one match}) = 1 - \frac{1}{2!} + \frac{1}{3!} - \cdots \pm \frac{1}{n!}, \qquad P(\text{no match}) = \frac{1}{0!} - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!} + \cdots \pm \frac{1}{n!}.$$

### Example 4: four letters

$P(\text{no match}) = 1 - 1 + \tfrac12 - \tfrac16 + \tfrac1{24} = \tfrac{12 - 4 + 1}{24} = \tfrac{9}{24} = 0.375.$
Of the 24 arrangements, 9 are derangements. Writing the envelope that letters 1, 2, 3, 4 go into,
they are 2143, 2341, 2413, 3142, 3412, 3421, 4123, 4312 and 4321; listing them is a good way to
check the formula.

The sum for $P(\text{no match})$ is the start of the series for $e^{-1}$, so as $n$ grows,
$P(\text{no match}) \to 1/e \approx 0.3679$, and very fast:

| $n$ | 2 | 3 | 4 | 5 | 6 | 10 |
|---|---|---|---|---|---|---|
| $P(\text{no match})$ | 0.5 | 0.3333 | 0.375 | 0.3667 | 0.3681 | 0.3679 |

The surprise is that $n$ hardly matters. With 10 letters or a million, the chance that nobody
gets the right letter is about 37%, and the chance of at least one match about 63%. More letters
mean more chances for a match, but each letter's chance ($1/n$) shrinks in proportion.

## Common mistakes

- Stopping after the pairwise terms with three events. The center is then counted zero times; add
  $P(A \cap B \cap C)$ back.
- Treating $P(A \cap B)$ as the "A and B only" region. It includes the center; subtract the triple
  to get "exactly A and B."
- Treating the union bound as the answer. It is only an upper limit (and can exceed 1).
- In the birthday problem, computing the chance that someone matches *you*, or using $n/365$.
- Forgetting the model: equally likely, independent birthdays and random envelope stuffing are
  assumptions, and real data can break them.

## Key points

- Three events: add singles, subtract pairs, add the triple. For $n$ events the signs alternate.
- Fill in a three-circle Venn diagram from the center out.
- Union bound: $P(\text{at least one}) \le \sum P(A_i)$, with no independence needed.
- Birthday problem: $P(\text{all different}) = {}_{365}P_n / 365^n$; 23 people give a match
  probability of about 0.507, because there are 253 pairs.
- Matching problem: $P(\text{no match}) = \sum_{k=0}^{n} (-1)^k / k! \to 1/e \approx 0.368$, almost
  regardless of $n$.
