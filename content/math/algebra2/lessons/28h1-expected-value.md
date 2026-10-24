---
id: a2-h-expected-value
module: a2-m8
honors: true
title: Random variables and expected value
minutes: 45
topics: [Expected value]
drills: [a2-m8-r2-expected-value, a2-m8-r2-fair-price]
refs: [a2-ref-prob-trig]
---
The probability lesson asked how likely an event is. Many real questions ask something different: *on average, how much?* How much does a raffle ticket pay back? How many points does guessing earn on a test? How much should an insurance company charge? To answer them, attach a number to every outcome and average those numbers, weighting each by its probability. This lesson builds that idea, the expected value, and then measures how much the actual result can stray from it, using the standard deviation from the normal distribution lesson.

## Random variables and their distributions

A **random variable** is a quantity whose value is a number determined by the outcome of a chance experiment. Capital letters name them: let $X$ be the sum when two dice are rolled, or the amount you win in a game. In this lesson $X$ can take only separate values that you can list (a *discrete* random variable).

The **probability distribution** of $X$ lists every value $X$ can take together with its probability. A valid distribution has two properties: every probability is between 0 and 1, and the probabilities add to 1.

For the sum of two fair dice, count the 36 equally likely outcomes from the probability lesson. A sum of 7 happens 6 ways, a sum of 6 or 8 happens 5 ways, and so on down to 1 way each for 2 and 12:

| Sum $x$ | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| $P(X = x)$ | $\tfrac{1}{36}$ | $\tfrac{2}{36}$ | $\tfrac{3}{36}$ | $\tfrac{4}{36}$ | $\tfrac{5}{36}$ | $\tfrac{6}{36}$ | $\tfrac{5}{36}$ | $\tfrac{4}{36}$ | $\tfrac{3}{36}$ | $\tfrac{2}{36}$ | $\tfrac{1}{36}$ |

A bar graph of a distribution is called a probability histogram. The height of each bar is a probability, so the heights add to 1.

```plot
{"x": [1, 13], "y": [0, 0.2], "xLabel": "sum of two dice", "yLabel": "probability", "bars": [{"x": 2, "height": 0.02778, "width": 0.7}, {"x": 3, "height": 0.05556, "width": 0.7}, {"x": 4, "height": 0.08333, "width": 0.7}, {"x": 5, "height": 0.11111, "width": 0.7}, {"x": 6, "height": 0.13889, "width": 0.7}, {"x": 7, "height": 0.16667, "width": 0.7}, {"x": 8, "height": 0.13889, "width": 0.7}, {"x": 9, "height": 0.11111, "width": 0.7}, {"x": 10, "height": 0.08333, "width": 0.7}, {"x": 11, "height": 0.05556, "width": 0.7}, {"x": 12, "height": 0.02778, "width": 0.7}], "caption": "The distribution of the sum of two dice: symmetric, with its balance point at 7"}
```

## Expected value

The **expected value** (or mean) of a random variable is the probability-weighted average of its values:

$$E(X) = \mu_X = \sum x \cdot P(X = x) = x_1p_1 + x_2p_2 + \cdots + x_np_n.$$

Why this formula? Imagine repeating the experiment a large number $N$ of times. The value $x_1$ shows up about $p_1N$ times, $x_2$ about $p_2N$ times, and so on. The average of all $N$ results is about

$$\frac{x_1(p_1N) + x_2(p_2N) + \cdots}{N} = x_1p_1 + x_2p_2 + \cdots.$$

So the expected value is the long-run average result per trial. The **law of large numbers** makes this precise: as the number of independent trials grows, the average result gets closer and closer to $E(X)$ (not in a steady march: it still wanders, but the wandering shrinks). It says nothing about any single trial, and it does not say that a streak of losses has to be "made up" soon (that belief is the gambler's fallacy).

The expected value need not be a value $X$ can actually take. A family's expected number of children might be 1.9, though no family has 1.9 children. Graphically, $E(X)$ is the balance point of the probability histogram.

### Example 1: The sum of two dice

Find the expected sum of two dice.

1. Multiply each value by its probability: $2 \cdot \tfrac{1}{36} + 3 \cdot \tfrac{2}{36} + 4 \cdot \tfrac{3}{36} + \cdots + 12 \cdot \tfrac{1}{36}$.
2. The numerators add to $2 + 6 + 12 + 20 + 30 + 42 + 40 + 36 + 30 + 22 + 12 = 252$.
3. $E(X) = \tfrac{252}{36} = 7$.

That matches the picture: the distribution is symmetric about 7, so 7 is its balance point.

## Games, raffles and fair prices

For a game, let $X$ be your *net* gain: what you win minus what you paid. A game is a **fair game** when $E(X) = 0$: in the long run neither side gains. A negative expected value means you lose on average; that is how casinos and lotteries pay their bills.

### Example 2: A raffle

A school sells 1,000 raffle tickets at \$5 each. One ticket wins \$1,000 and four tickets win \$100 each. What is the expected net gain of buying one ticket?

1. List the net gains. Winning the big prize nets $1000 - 5 = 995$ dollars; a \$100 prize nets 95; every other ticket loses 5.
2. Probabilities: $\tfrac{1}{1000}$, $\tfrac{4}{1000}$ and $\tfrac{995}{1000}$. They add to 1.
3. $E(X) = 995\left(\tfrac{1}{1000}\right) + 95\left(\tfrac{4}{1000}\right) + (-5)\left(\tfrac{995}{1000}\right) = 0.995 + 0.38 - 4.975 = -3.60$.

A shortcut gives the same answer: the expected prize is $\tfrac{1000 + 4 \cdot 100}{1000} = 1.40$ dollars, and you pay 5, so $E(X) = 1.40 - 5 = -3.60$. On average each ticket loses \$3.60, which is exactly the school's profit per ticket: it takes in \$5,000 and pays out \$1,400. The **fair price** of a ticket, the price that would make the game fair, is the expected prize, \$1.40.

### Example 3: Guessing on a test

Until a 2016 redesign, the SAT used multiple-choice questions with 5 choices, gave 1 point for a right answer, and took away $\tfrac14$ point for a wrong one (a blank scored 0). Was random guessing worth it?

1. Guessing at random among 5 choices: $P(\text{right}) = \tfrac15$, $P(\text{wrong}) = \tfrac45$.
2. $E(\text{points}) = 1 \cdot \tfrac15 + \left(-\tfrac14\right) \cdot \tfrac45 = \tfrac15 - \tfrac15 = 0$. The penalty was set to make blind guessing exactly a fair game.
3. If you can rule out one choice and guess among the other 4: $E = 1 \cdot \tfrac14 - \tfrac14 \cdot \tfrac34 = \tfrac14 - \tfrac{3}{16} = \tfrac{1}{16}$ point. Positive, so an educated guess paid off on average.

Today's SAT and most classroom tests have no penalty, so a guess can't lower the expected score.

## Insurance: paying to reduce risk

An insurance company is the house in a game played with its customers. Suppose (these numbers are made up for illustration) a phone plan costs \$120 a year, and in a year a phone is replaced (\$800) with probability 0.04, repaired (\$150) with probability 0.10, and otherwise costs the company nothing. The expected payout is

$$800(0.04) + 150(0.10) + 0(0.86) = 32 + 15 = 47 \text{ dollars}.$$

So each customer's expected net gain is $47 - 120 = -73$ dollars. Why would anyone buy it? Because expected value isn't the only thing that matters. A customer pays a small, certain cost to avoid a small chance of a large loss. The company, with thousands of customers, can rely on the law of large numbers: its average payout per customer will be close to \$47, so it can cover costs and profit. Whether a policy is a good buy depends on how much the possible loss would hurt you, not just on $E(X)$.

## How far from the mean? Standard deviation of a random variable

Two games can have the same expected value and feel completely different. Game A pays \$10 with probability 0.5 (otherwise nothing). Game B pays \$100 with probability 0.05. Both have expected payout \$5.

The spread is measured the same way as for data in the normal distribution lesson, with each squared deviation weighted by its probability:

$$\sigma_X = \sqrt{\sum (x - \mu_X)^2 \, P(X = x)}.$$

### Example 4: Comparing risk

Find the standard deviation of each game's payout ($\mu = 5$ for both).

1. Game A: deviations are $10 - 5 = 5$ and $0 - 5 = -5$. $\sigma_A = \sqrt{5^2(0.5) + (-5)^2(0.5)} = \sqrt{25} = 5$ dollars.
2. Game B: deviations are $100 - 5 = 95$ and $0 - 5 = -5$. $\sigma_B = \sqrt{95^2(0.05) + (-5)^2(0.95)} = \sqrt{451.25 + 23.75} = \sqrt{475} \approx 21.79$ dollars.
3. Same average, but B's payout is far more spread out: usually nothing, occasionally a lot. The standard deviation is how statisticians and investors measure that risk.

## Two shortcuts for expected values

These rules follow directly from the definition (each is a weighted average of shifted or added values):

- **Scaling and shifting.** $E(aX + b) = a\,E(X) + b$. If a booth earns \$3 per game played and has \$20 of fixed costs, and the expected number of games per hour is 15, its expected profit per hour is $3(15) - 20 = 25$ dollars.
- **Sums.** $E(X + Y) = E(X) + E(Y)$, for any two random variables, independent or not. The expected total of 10 dice is $10 \cdot 3.5 = 35$, since one die has $E = \tfrac{1 + 2 + \cdots + 6}{6} = 3.5$.

The standard deviation does not follow such simple rules: $\sigma_{aX + b} = |a|\,\sigma_X$ (shifting doesn't change spread), and standard deviations of sums don't simply add. Statistics courses treat those rules carefully.

## Common mistakes

- Forgetting to subtract the cost of playing. Expected *prize* and expected *net gain* differ by the price.
- Using a distribution whose probabilities don't add to 1 (for example, leaving out the "lose" outcome).
- Thinking the expected value is the most likely value, or a value you will actually get. It is a long-run average.
- Believing in "luck evening out": the law of large numbers is about averages over many trials, not about the next trial.
- Judging two choices by expected value alone when their risks (standard deviations) are very different.

## Key points

- A random variable assigns a number to each outcome; its distribution lists the values and their probabilities, which add to 1.
- $E(X) = \sum x\,P(X = x)$ is the probability-weighted average, the long-run average per trial.
- A game is fair when the expected net gain is 0; the fair price equals the expected prize.
- $\sigma_X = \sqrt{\sum (x - \mu_X)^2 P(X = x)}$ measures how far results typically fall from the mean.
- $E(aX + b) = aE(X) + b$ and $E(X + Y) = E(X) + E(Y)$ always.
