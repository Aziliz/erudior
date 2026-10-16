---
id: alg-system-apps
module: alg-m4
title: Applications of linear systems
minutes: 30
topics: [System applications]
drills: [alg-d-tickets, alg-d-mixture, alg-d-wind]
refs: [alg-ref-equations]
---
With substitution and elimination in hand, word problems with two unknowns get much easier. Instead of forcing everything into one variable, you name both unknowns and write one equation for each fact. This lesson works through the standard types: totals and values, mixtures, interest, motion with a current, and break-even analysis.

## The routine

1. Name two unknowns with clear definitions: "$a$ = number of adult tickets."
2. Find two independent facts in the problem, and write one equation for each. Usually one counts things and the other counts their value, cost, or amount.
3. Solve the system by whichever method is easiest.
4. Answer the question with units and check against the wording.

A table with a row for each kind of item and columns for (number, rate, total) organizes most of these problems.

## Totals and values

### Example 1

A theater sold 420 tickets for $4,140. Adult tickets cost $12 and child tickets cost $7. How many of each were sold?

| | Number | Price | Revenue |
|---|---|---|---|
| Adult | $a$ | 12 | $12a$ |
| Child | $c$ | 7 | $7c$ |
| Total | 420 | | 4140 |

1. Count: $a + c = 420$. Value: $12a + 7c = 4140$.
2. Substitute $c = 420 - a$: $12a + 7(420 - a) = 4140$, so $5a + 2940 = 4140$ and $a = 240$.
3. Then $c = 180$. Check: $240 \cdot 12 + 180 \cdot 7 = 2880 + 1260 = 4140$.

The theater sold 240 adult and 180 child tickets.

## Mixtures

Mixture problems have the same shape: the amount of each ingredient, and the amount of some substance in each.

### Example 2

A chemist needs 50 mL of a 34% acid solution. She has a 20% solution and a 55% solution. How much of each should she mix?

| | mL | Concentration | mL of acid |
|---|---|---|---|
| 20% solution | $x$ | 0.20 | $0.20x$ |
| 55% solution | $y$ | 0.55 | $0.55y$ |
| Mixture | 50 | 0.34 | $0.34(50) = 17$ |

1. Volume: $x + y = 50$. Acid: $0.20x + 0.55y = 17$.
2. Multiply the second by 100: $20x + 55y = 1700$. Multiply the first by $-20$: $-20x - 20y = -1000$.
3. Add: $35y = 700$, so $y = 20$, and $x = 30$.
4. Mix 30 mL of the 20% solution with 20 mL of the 55% solution. Check: $6 + 11 = 17$ mL of acid in 50 mL is 34%.

## Interest

### Example 3

Jordan invested $9,000, part at 4% and the rest at 6% simple annual interest. After one year the total interest was $450. How much was invested at each rate?

1. Let $p$ be the amount at 4% and $q$ the amount at 6%. Then $p + q = 9000$ and $0.04p + 0.06q = 450$.
2. Multiply the second by 100: $4p + 6q = 45000$. Multiply the first by $-4$: $-4p - 4q = -36000$.
3. Add: $2q = 9000$, so $q = 4500$ and $p = 4500$.
4. Check: $180 + 270 = 450$.

## Motion with a current or wind

A boat moving with a current goes at (boat speed + current speed); against it, at (boat speed − current speed). The same holds for planes with tailwinds and headwinds.

### Example 4

A plane flies 1,200 miles with a tailwind in 2.5 hours, and makes the return trip against the same wind in 3 hours. Find the plane's speed in still air and the wind speed.

| | Rate | Time | Distance |
|---|---|---|---|
| With wind | $p + w$ | 2.5 | 1200 |
| Against wind | $p - w$ | 3 | 1200 |

1. From $d = rt$: $p + w = \tfrac{1200}{2.5} = 480$ and $p - w = \tfrac{1200}{3} = 400$.
2. Add: $2p = 880$, so $p = 440$ mph. Then $w = 40$ mph.
3. Check: $480 \times 2.5 = 1200$ and $400 \times 3 = 1200$.

## Break-even analysis

A business's **cost function** is often linear: fixed costs plus a cost per item. Its **revenue function** is price times quantity. The **break-even point** is where revenue equals cost, the intersection of the two lines. Beyond it, the business makes a profit.

### Example 5

A small bakery pays $600 a week in fixed costs, and each loaf costs $1.50 to make. Loaves sell for $4.00. How many loaves must it sell each week to break even?

1. Cost: $C = 600 + 1.5n$. Revenue: $R = 4n$.
2. Break even when $R = C$: $4n = 600 + 1.5n$, so $2.5n = 600$ and $n = 240$ loaves.
3. At 240 loaves, both cost and revenue are $960.

```plot
{"x": [0, 400], "y": [0, 1600], "functions": [{"f": "600 + 1.5*x", "label": "cost"}, {"f": "4*x", "label": "revenue", "dashed": true}], "points": [{"at": [240, 960], "label": "break-even (240, 960)"}], "xLabel": "loaves", "yLabel": "dollars", "caption": "Profit starts where the revenue line rises above the cost line"}
```

## Common mistakes

- Writing two equations that say the same thing (for example, both about the count). You need two independent facts.
- Mixing percents and decimals: 20% is 0.20 in an equation.
- Using the boat's speed for both directions, forgetting the current.
- Solving for the variables but not answering the actual question (how many of each, which rate).
- Not checking that the answer makes sense: negative tickets or a 110% solution mean a setup error.

## Key points

- Name two unknowns and write one equation per independent fact, typically a count equation and a value equation.
- Tables (number, rate, total) organize mixture, interest, and value problems.
- With a current or wind: speeds are $p + w$ and $p - w$.
- Break-even is where revenue equals cost, the intersection of the two lines.
- Check against the words of the problem, not just the equations.
