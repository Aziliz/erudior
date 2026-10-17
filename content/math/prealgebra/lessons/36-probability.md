---
id: pre-probability
module: pre-m9
title: Simple probability
minutes: 30
topics: [Probability]
drills: [pre-prob-simple, pre-prob-complement, pre-prob-independent]
refs: [pre-ref-arithmetic]
---
## Measuring chance

Will it rain tomorrow? What is the chance of rolling a six? How likely is a defective part? **Probability** puts a number on how likely something is. It uses almost everything in this course: fractions, decimals, percents, ratios and multiplication. This final lesson covers the basic definitions, how to count outcomes, complements, and the probability of two independent events both happening.

## Experiments, outcomes and events

An **experiment** is any process with an uncertain result: flipping a coin, rolling a die, drawing a card. Each possible result is an **outcome**, and the set of all outcomes is the **sample space**. An **event** is a collection of outcomes you're interested in.

Rolling a standard six-sided die has sample space $\{1, 2, 3, 4, 5, 6\}$. The event "roll an even number" is $\{2, 4, 6\}$.

## Theoretical probability

When all outcomes are equally likely, the probability of an event $E$ is

$$P(E) = \frac{\text{number of outcomes in } E}{\text{total number of outcomes}}.$$

So $P(\text{even}) = \tfrac36 = \tfrac12$.

Every probability is between 0 and 1:

```numberline
{"x": [0, 1], "points": [{"at": [0, 0], "label": "0 impossible"}, {"at": [0.5, 0], "label": "1/2 equally likely"}, {"at": [1, 0], "label": "1 certain"}], "caption": "The probability scale"}
```

- $P = 0$: the event is **impossible** (rolling a 7).
- $P = 1$: the event is **certain** (rolling a number less than 7).
- Probabilities can be written as fractions, decimals or percents: $\tfrac14 = 0.25 = 25\%$.

### Example 1

A bag holds 5 red, 3 blue and 4 green marbles. One marble is drawn at random. Find $P(\text{blue})$ and $P(\text{red or green})$.

Total marbles: $5 + 3 + 4 = 12$. $P(\text{blue}) = \tfrac{3}{12} = \tfrac14$. Red or green: $5 + 4 = 9$ outcomes, so $P = \tfrac{9}{12} = \tfrac34$.

"At random" means each marble is equally likely to be drawn, which is what makes the formula valid.

## Complements

The **complement** of an event $E$ is "not $E$": all outcomes not in $E$. Since an event either happens or it doesn't,

$$P(\text{not } E) = 1 - P(E).$$

In Example 1, $P(\text{not blue}) = 1 - \tfrac14 = \tfrac34$, matching $P(\text{red or green})$, as it should.

The complement is often the easy way in. If a weather forecast gives a 30% chance of rain, the chance of no rain is 70%.

## Experimental probability

Sometimes we can't count equally likely outcomes, so we observe instead. The **experimental probability** of an event is

$$\frac{\text{number of times the event happened}}{\text{number of trials}}.$$

### Example 2

A basketball player made 42 of her last 60 free throws. Estimate the probability she makes her next one.

$\tfrac{42}{60} = 0.7$, so about 70%.

With more trials, experimental probability tends to get closer to the theoretical probability. Flip a coin 10 times and you might get 7 heads (70%); flip it 10,000 times and you'll almost certainly be very close to 50%.

## Predictions

Probability times the number of trials gives the *expected* number of times an event happens.

### Example 3

A fair die is rolled 300 times. About how many times should you expect a 5?

$P(5) = \tfrac16$, so expect about $\tfrac16 \times 300 = 50$ fives. The actual count will vary a little.

## Two events: listing outcomes

When an experiment has two stages, list all the combined outcomes in a table or tree. Flipping a coin and rolling a die gives $2 \times 6 = 12$ equally likely outcomes. This **counting principle** (multiply the number of choices at each stage) is a fast way to count.

### Example 4

Two fair dice are rolled. What is the probability that the sum is 7?

There are $6 \times 6 = 36$ outcomes. Sums of 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1), which is 6 outcomes. $P = \tfrac{6}{36} = \tfrac16$.

| + | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| 6 | 7 | 8 | 9 | 10 | 11 | 12 |

The table shows why 7 is the most likely sum: it appears on the longest diagonal.

## Independent events

Two events are **independent** if one happening doesn't change the probability of the other: a coin flip and a die roll, or two draws *with replacement* (putting the first item back before drawing again). For independent events,

$$P(A \text{ and } B) = P(A) \times P(B).$$

Why multiply? Of all the equally likely combined outcomes, the fraction where $A$ happens is $P(A)$, and among those, the fraction where $B$ also happens is $P(B)$. A fraction of a fraction is a product, as in Lesson 10.

### Example 5

Flip a coin and roll a die. What is $P(\text{heads and a number greater than 4})$?

$P(\text{heads}) = \tfrac12$ and $P(5 \text{ or } 6) = \tfrac26 = \tfrac13$. Independent, so $P = \tfrac12 \times \tfrac13 = \tfrac16$. Check by counting: of the 12 outcomes, H5 and H6 work, $\tfrac{2}{12} = \tfrac16$. ✓

### Example 6

From the bag in Example 1 (5 red, 3 blue, 4 green), a marble is drawn, replaced, and a second marble is drawn. What is the probability both are red?

With replacement the draws are independent: $\tfrac{5}{12} \times \tfrac{5}{12} = \tfrac{25}{144} \approx 0.17$.

(Without replacement, the second draw would be $\tfrac{4}{11}$, since one red marble is gone; the events are then *dependent*. You'll study that case in statistics.)

## Common mistakes

- *Forgetting the total.* The denominator is the number of all possible outcomes, not the number of "other" outcomes. With 3 blue and 9 others, $P(\text{blue}) = \tfrac{3}{12}$, not $\tfrac39$.
- *Probabilities outside 0 to 1.* An answer of $\tfrac54$ or 120% means a mistake.
- *Adding instead of multiplying* for "and" with independent events.
- *Assuming outcomes are equally likely when they aren't:* sums of two dice are not all equally likely.
- *The gambler's fallacy:* after five heads in a row, a fair coin is still 50% heads on the next flip.

## Key points

- $P(E) = \dfrac{\text{favorable outcomes}}{\text{total outcomes}}$ when outcomes are equally likely; $0 \le P(E) \le 1$.
- $P(\text{not } E) = 1 - P(E)$.
- Experimental probability = successes ÷ trials; expected count = probability × number of trials.
- Count combined outcomes by multiplying the choices at each stage.
- For independent events, $P(A \text{ and } B) = P(A) \cdot P(B)$.
