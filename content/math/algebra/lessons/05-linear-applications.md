---
id: alg-linear-apps
module: alg-m1
title: Linear equations in applications
minutes: 30
topics: [Linear applications]
drills: [alg-d-consecutive, alg-d-percent-change, alg-d-distance-rate]
refs: [alg-ref-equations]
---
The point of solving equations is to answer questions about the world. This lesson turns word problems into linear equations, using what you learned about translating words (Lesson 2) and solving (Lessons 3 and 4). The algebra is usually easy; the skill is setting up the equation. A steady routine makes that much easier.

## A routine for word problems

1. Read and identify what is being asked. Write it down in words.
2. Name the unknown with a variable, and write the other unknown quantities in terms of it. "Let $x$ = the width in meters."
3. Write an equation that says the same thing as the problem. Look for the fact that gives two expressions for the same quantity.
4. Solve the equation.
5. Answer the question in words, with units, and check it against the original wording (not against your equation, which might be wrong).

A table or sketch often helps with step 3.

## Number and consecutive integer problems

**Consecutive integers** follow one another: $n$, $n + 1$, $n + 2$. Consecutive even integers (like 8, 10, 12) and consecutive odd integers (like 7, 9, 11) both step by 2: $n$, $n + 2$, $n + 4$. The step is 2 in both cases; whether they are even or odd depends only on the first one.

### Example 1

The sum of three consecutive odd integers is 141. Find them.

1. Let $n$ be the smallest. The others are $n + 2$ and $n + 4$.
2. Equation: $n + (n + 2) + (n + 4) = 141$.
3. Solve: $3n + 6 = 141$, so $3n = 135$ and $n = 45$.
4. The integers are 45, 47 and 49. Check: they're odd, consecutive, and sum to 141.

## Percent problems

"Percent" means "per hundred," so 8% is $0.08$. The key relationship is

$$\text{part} = \text{rate} \times \text{whole}.$$

For a **percent change**, compare the change with the original amount:

$$\text{percent change} = \frac{\text{new} - \text{original}}{\text{original}} \times 100\%.$$

A price rising by 20% becomes $1.20$ times the original, and a price falling by 20% becomes $0.80$ times the original. Writing increases and decreases as multipliers like this avoids most errors.

### Example 2

After a 15% discount, a jacket costs $68. What was the original price?

1. Let $p$ be the original price. A 15% discount leaves 85% of it.
2. Equation: $0.85p = 68$.
3. Solve: $p = 68 / 0.85 = 80$.
4. The original price was $80. Check: 15% of 80 is 12, and 80 − 12 = 68.

The tempting mistake is to add 15% of 68 back on, which gives $78.20. The discount was 15% of the original price, not of the sale price.

## Distance, rate and time

Motion at constant speed obeys $d = rt$. A table with one row per moving object keeps things organized.

### Example 3

Two cyclists leave the same point at the same time and ride in opposite directions, one at 14 mph and the other at 18 mph. How long until they are 56 miles apart?

| | Rate | Time | Distance |
|---|---|---|---|
| Cyclist A | 14 | $t$ | $14t$ |
| Cyclist B | 18 | $t$ | $18t$ |

1. They move apart, so their distances add up to the gap: $14t + 18t = 56$.
2. Solve: $32t = 56$, so $t = 1.75$ hours.
3. Answer: 1.75 hours, which is 1 hour 45 minutes. Check: $14(1.75) = 24.5$ and $18(1.75) = 31.5$, total 56.

When one object chases another, the equation is instead that the distances are equal at the moment one catches up.

## Geometry problems

Use the formula for the figure and express every dimension using one variable.

### Example 4

A rectangular garden is 3 meters longer than twice its width, and its perimeter is 48 meters. Find its dimensions.

1. Let $w$ be the width. Then the length is $2w + 3$.
2. Perimeter: $2w + 2(2w + 3) = 48$.
3. Solve: $2w + 4w + 6 = 48$, so $6w = 42$ and $w = 7$.
4. Length: $2(7) + 3 = 17$. The garden is 7 m by 17 m. Check: $2(7) + 2(17) = 48$.

```shape
{"polygons": [{"points": [[0, 0], [17, 0], [17, 7], [0, 7]]}], "segments": [{"from": [0, 0], "to": [17, 0], "label": "2w + 3 = 17"}, {"from": [0, 7], "to": [0, 0], "label": "w = 7"}], "caption": "The garden: width 7 m, length 17 m"}
```

## Value and mixture problems

When items of different values are combined, the total value is the sum of (number of items × value of each). The same idea covers mixing solutions: the amount of pure substance is (volume × concentration).

### Example 5

How many liters of a 40% acid solution must be added to 10 liters of a 15% solution to make a 25% solution?

| | Liters | Concentration | Liters of acid |
|---|---|---|---|
| 15% solution | 10 | 0.15 | 1.5 |
| 40% solution | $x$ | 0.40 | $0.40x$ |
| Mixture | $10 + x$ | 0.25 | $0.25(10 + x)$ |

1. The acid in the mixture is the acid from both parts: $1.5 + 0.40x = 0.25(10 + x)$.
2. Distribute: $1.5 + 0.40x = 2.5 + 0.25x$.
3. Collect: $0.15x = 1$, so $x = \tfrac{1}{0.15} = \tfrac{20}{3} \approx 6.67$ liters.
4. Check: total acid $1.5 + 0.40(6.67) \approx 4.17$ liters in $16.67$ liters, which is 25%.

The mixture's concentration must land between the two ingredients' concentrations (here between 15% and 40%). If your setup gives a target outside that range, something is wrong.

## Linear models of cost

Many costs have a fixed part plus a part that grows at a constant rate per unit: a phone plan with a monthly fee plus a charge per gigabyte, or a taxi with a base fare plus a charge per mile. The total is

$$\text{total} = \text{fixed cost} + \text{rate} \times \text{number of units}.$$

### Example 6

A taxi charges $3.50 plus $2.25 per mile. A ride cost $30.50. How far was it?

1. Let $m$ be the miles. Equation: $3.50 + 2.25m = 30.50$.
2. Subtract 3.50: $2.25m = 27$.
3. Divide: $m = 12$ miles.

This kind of relationship is a linear function, which we'll study properly in Module 3.

## Common mistakes

- Using $n$, $n + 1$, $n + 2$ for consecutive odd or even integers. They step by 2.
- Taking a percent of the wrong base, such as the sale price instead of the original price.
- Adding a percent increase and then subtracting the same percent decrease and expecting to return to the start: a 10% rise and then a 10% fall gives $1.1 \times 0.9 = 0.99$ of the original.
- Mixing units, such as a speed in miles per hour with a time in minutes.
- Answering with the value of the variable when the question asked for something else (the length, not the width; the time in minutes, not hours).

## Key points

- Name the unknown, express the other quantities in terms of it, and find the fact that gives an equation.
- Consecutive integers step by 1; consecutive even or odd integers step by 2.
- Part = rate × whole; percent change compares the change to the original.
- Use $d = rt$ with a table for motion problems.
- Answer the actual question, with units, and check against the original words.
