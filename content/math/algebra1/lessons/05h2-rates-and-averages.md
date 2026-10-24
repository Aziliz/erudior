---
id: alg-m1-h-rates-averages
module: alg-m1
honors: true
title: 'Rates that combine: work, average speed and weighted averages'
minutes: 45
topics: [Rates and averages]
drills: [alg-m1-r2-work-together, alg-m1-r2-round-trip, alg-m1-r2-final-needed]
refs: [alg-ref-equations]
---
Lesson 5 used one idea over and over: an amount equals a rate times a time, as in $d = rt$, or a concentration times a volume. This honors lesson pushes that idea further. When two workers or two machines share a job, their rates add. When a trip has two speeds, the average speed is *not* the average of the speeds. And when quantities of different sizes are combined, the right average is a weighted one. All three lead to linear equations of the kind you solved in Lesson 3, often with fractions to clear first.

## Work problems: rates add, times don't

If a painter can finish a fence in 3 hours, then in one hour she paints $\tfrac13$ of the fence. That is her **work rate**: $\tfrac13$ of the job per hour. In general,

$$\text{rate} = \frac{1 \text{ job}}{\text{time for one job}}, \qquad \text{work done} = \text{rate} \times \text{time}.$$

When two workers share a job, their work in a given time adds up. If neither slows the other down (a modeling assumption, not a law of nature: two painters on one short fence may get in each other's way), their **combined rate** is the sum of their rates. It is the *rates* that add, not the times. A common wrong guess is that a 3-hour painter and a 6-hour painter together take $3 + 6 = 9$ hours, or the average, 4.5 hours. Common sense rules both out: with help, the job must take *less* than the faster worker's 3 hours alone.

### Example 1

Ana can paint a fence in 3 hours and Ben can paint it in 6 hours. How long does it take them working together?

| | Rate (fence per hour) | Time (hours) | Work done |
|---|---|---|---|
| Ana | $\tfrac13$ | $t$ | $\tfrac{t}{3}$ |
| Ben | $\tfrac16$ | $t$ | $\tfrac{t}{6}$ |

1. Together they paint one whole fence: $\dfrac{t}{3} + \dfrac{t}{6} = 1$.
2. Clear fractions by multiplying both sides by 6: $2t + t = 6$, so $3t = 6$.
3. Solve: $t = 2$ hours. Check: in 2 hours Ana paints $\tfrac23$ of the fence and Ben paints $\tfrac26 = \tfrac13$. Together, $\tfrac23 + \tfrac13 = 1$ fence.

![A long bar representing one whole fence, divided into six equal sixths. Under a bracket labeled hour 1, the first two sixths are shaded as Ana's work and the third sixth as Ben's work. Under a bracket labeled hour 2, the next two sixths are Ana's and the last sixth is Ben's. Each hour they paint 1/3 + 1/6 = 1/2 of the fence, so the fence takes 2 hours.](images/alg-m1-work-tape.svg)

The same equation holds in general. If one worker takes $a$ hours and another takes $b$ hours, then together $\tfrac{t}{a} + \tfrac{t}{b} = 1$, so $t\left(\tfrac1a + \tfrac1b\right) = 1$ and $t = \dfrac{1}{\frac1a + \frac1b} = \dfrac{ab}{a + b}$. For Ana and Ben, $\tfrac{3 \cdot 6}{3 + 6} = \tfrac{18}{9} = 2$.

### Example 2

An inlet pipe fills a tank in 4 hours. A drain empties the full tank in 10 hours. If both are open, starting with an empty tank, how long until the tank is full?

1. The drain works against the pipe, so its rate is subtracted: $\dfrac{t}{4} - \dfrac{t}{10} = 1$.
2. Multiply by 20: $5t - 2t = 20$, so $3t = 20$.
3. $t = \tfrac{20}{3}$ hours, which is 6 hours 40 minutes. As a check, the net rate $\tfrac14 - \tfrac1{10} = \tfrac{3}{20}$ tank per hour is positive, so the tank does fill, slowly.

### Example 3

Two printers together finish a print job in 12 minutes. The faster one alone would take 20 minutes. How long would the slower one take alone?

Setting the unknown time as $s$ puts the variable in a denominator, $\tfrac{12}{20} + \tfrac{12}{s} = 1$. A cleaner choice is to make the unknown the slower printer's *rate*, $r$ jobs per minute.

1. Combined rate times time is one job: $12\left(\tfrac{1}{20} + r\right) = 1$.
2. Divide by 12: $\tfrac{1}{20} + r = \tfrac{1}{12}$, so $r = \tfrac{1}{12} - \tfrac{1}{20} = \tfrac{5}{60} - \tfrac{3}{60} = \tfrac{2}{60} = \tfrac{1}{30}$.
3. A rate of $\tfrac{1}{30}$ job per minute means the slower printer takes 30 minutes alone. Check: $\tfrac{12}{20} + \tfrac{12}{30} = 0.6 + 0.4 = 1$.

Choosing *what* to call $x$ is part of the skill: the same problem can give a linear equation or a messier one.

## Average speed is total distance over total time

Your **average speed** for a trip is defined as

$$\text{average speed} = \frac{\text{total distance}}{\text{total time}}.$$

It is not the average of the speeds you drove, unless you spent equal *times* at each speed.

### Example 4

You drive 120 miles to a city at 60 mph and return the same 120 miles at 40 mph. What is your average speed for the round trip?

1. Time out: $\tfrac{120}{60} = 2$ hours. Time back: $\tfrac{120}{40} = 3$ hours.
2. Total distance 240 miles, total time 5 hours.
3. Average speed: $\tfrac{240}{5} = 48$ mph, not $\tfrac{60 + 40}{2} = 50$ mph.

You spent 3 of the 5 hours at the slower speed, so the average leans toward 40. On a graph of total distance traveled against time, the average speed is the slope of the straight line from the start to the end of the trip.

```plot
{"x": [0, 5.5], "y": [0, 260], "xLabel": "time (hours)", "yLabel": "total distance driven (miles)", "functions": [{"f": "60*x", "from": 0, "to": 2, "label": "60 mph"}, {"f": "120 + 40*(x - 2)", "from": 2, "to": 5, "label": "40 mph"}, {"f": "48*x", "from": 0, "to": 5, "dashed": true}], "points": [{"at": [2, 120]}, {"at": [5, 240], "label": "(5, 240)"}], "labels": [{"at": [1.45, 150], "text": "(2, 120)"}], "caption": "Total distance against time: 2 hours at 60 mph, then 3 hours at 40 mph. The dashed line's slope is the average speed, 240/5 = 48 mph."}
```

For two equal distances $d$ at speeds $a$ and $b$, the total time is $\tfrac{d}{a} + \tfrac{d}{b}$, and

$$\text{average speed} = \frac{2d}{\frac{d}{a} + \frac{d}{b}} = \frac{2}{\frac1a + \frac1b} = \frac{2ab}{a + b}.$$

The distance $d$ cancels. This expression is called the **harmonic mean** of $a$ and $b$. Check with Example 4: $\tfrac{2 \cdot 60 \cdot 40}{100} = 48$. The harmonic mean is always less than the ordinary average $\tfrac{a + b}{2}$ unless $a = b$, because you always spend longer at the slower speed.

### Example 5

A town is 60 miles away. You drive there at 40 mph. How fast must you drive back to average 60 mph for the round trip? What about 80 mph?

1. The trip out takes $\tfrac{60}{40} = 1.5$ hours. Let $t$ be the return time in hours. The round trip is 120 miles, so averaging 60 mph means $\dfrac{120}{1.5 + t} = 60$.
2. Multiply both sides by $1.5 + t$: $120 = 60(1.5 + t) = 90 + 60t$, so $60t = 30$ and $t = 0.5$ hour.
3. Return speed: $\tfrac{60}{0.5} = 120$ mph. Possible on paper, but well over any legal limit.
4. For an 80 mph average: $120 = 80(1.5 + t) = 120 + 80t$, so $80t = 0$ and $t = 0$. The return trip would have to take no time at all, which is impossible. An 80 mph average needs the whole trip done in $\tfrac{120}{80} = 1.5$ hours, and the trip out already used all of it.

This is a famous puzzle, and it is a good reminder from Lesson 3: an equation's answer has to make sense in the situation, not just on paper.

## Weighted averages

When groups of different sizes are combined, each value should count in proportion to its size. A **weighted average** is

$$\text{weighted average} = \frac{w_1 x_1 + w_2 x_2 + \cdots}{w_1 + w_2 + \cdots},$$

where the $x$'s are the values and the $w$'s are their weights. The ordinary mean is the special case where every weight is equal. Average speed is a weighted average of the speeds, weighted by *time*: $\tfrac{2(60) + 3(40)}{2 + 3} = 48$. A mixture's concentration is a weighted average of the concentrations, weighted by *volume*.

### Example 6

A course grade counts homework 20%, tests 50% and the final exam 30%. Maya has a homework average of 92 and a test average of 78. What score on the final gives her a course grade of 80?

1. The weights already add to 100%, so the weighted average is $0.20(92) + 0.50(78) + 0.30F$.
2. Set it equal to 80: $18.4 + 39 + 0.30F = 80$, so $0.30F = 22.6$.
3. $F = \tfrac{22.6}{0.30} = 75.\overline{3}$. She needs at least $75\tfrac13$, so 76 if the final is scored in whole points.

### The balance rule for two groups

Clear the fraction in a two-group weighted average $m = \dfrac{w_1 x_1 + w_2 x_2}{w_1 + w_2}$:

$$w_1 m + w_2 m = w_1 x_1 + w_2 x_2 \quad\Longrightarrow\quad w_1(m - x_1) = w_2(x_2 - m).$$

Picture a seesaw. Each weight sits at its value on a number line, and the average is the balance point, where weight times distance is the same on both sides. The heavier group pulls the average toward itself. Here is Lesson 5's acid mixture again: 10 liters at 15% and $x$ liters at 40% balance at 25%.

```numberline
{"x": [10, 45], "points": [{"at": [15, 0], "label": "15%"}, {"at": [25, 0], "label": "25%"}, {"at": [40, 0], "label": "40%"}], "segments": [{"from": [15, 0], "to": [25, 0]}, {"from": [25, 0], "to": [40, 0]}], "caption": "10 L of 15% and x L of 40% balance at 25%, which is 10 points from 15% and 15 points from 40%: 10 × 10 = x × 15"}
```

The balance rule gives $10(25 - 15) = x(40 - 25)$, so $100 = 15x$ and $x = \tfrac{20}{3} \approx 6.67$ liters, the same answer Lesson 5 found with a table. The rule also explains why the target must lie between the two ingredients: the balance point of a seesaw is always between the two ends.

## Common mistakes

- Adding or averaging times in work problems. Rates add; the combined time is shorter than either worker's time alone.
- Using a work rate that isn't per one job: a 3-hour painter's rate is $\tfrac13$ fence per hour, not 3.
- Forgetting to subtract a rate that works against you, such as a drain or a leak.
- Averaging speeds directly. Average speed is total distance over total time; for equal distances it is the harmonic mean, which is below the ordinary average.
- Leaving out the weights, or using weights that don't match the values (time for speeds, volume for concentrations, the stated percentages for grades).
- Accepting an answer that the situation rules out, such as a return trip taking 0 hours.

## Key points

- Work rate = one job divided by the time for one job. Working together, rates add: $\tfrac{t}{a} + \tfrac{t}{b} = 1$, so $t = \tfrac{ab}{a + b}$.
- Opposing rates (a drain, a current against you) are subtracted.
- Choosing the rate as the unknown can keep the equation linear.
- Average speed = total distance ÷ total time. For equal distances at speeds $a$ and $b$, it is the harmonic mean $\tfrac{2ab}{a + b}$.
- A weighted average counts each value by its weight. For two groups, $w_1(m - x_1) = w_2(x_2 - m)$: the average balances between the two values, nearer the heavier group.
