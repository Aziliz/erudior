---
id: alg-m3-h-piecewise-models
module: alg-m3
title: Piecewise linear models
minutes: 45
honors: true
topics: [Piecewise linear models]
drills: [alg-m3-r2-plan-bill, alg-m3-r2-continuity, alg-m3-r2-bracket-tax]
refs: [alg-ref-functions, alg-ref-equations]
---
Lesson 12 built linear models: a starting value plus a constant rate. Lesson 13 showed how to evaluate and graph functions defined in pieces. Real pricing and tax rules combine the two: the rate is constant for a while, then changes at a threshold. A phone plan is free up to a data allowance and then charges per gigabyte; an income tax charges one rate on the first part of your income and higher rates on later parts. This honors lesson shows how to build such **piecewise linear** models from a description in words, how to make the pieces join up, how to tell the rate on the *next* unit from the *average* rate, and how to run a model backward. It uses point-slope form (Lesson 11) as its main tool.

## Building a model from a rule

A function is piecewise linear when each of its pieces is a linear formula. An input where one piece ends and the next begins is a **breakpoint**.

Here is a typical rule: *a phone plan costs \$35 a month and includes 10 GB of data; each gigabyte beyond 10 costs \$6, charged in proportion to the amount used.* Let $g$ be the data used in GB and $C(g)$ the monthly bill.

- Up to the allowance, the bill doesn't change: $C(g) = 35$ for $0 \le g \le 10$.
- Past the allowance, only the data *beyond* 10 GB costs extra. That amount is $g - 10$, so the bill is $35 + 6(g - 10)$.

$$C(g) = \begin{cases} 35, & 0 \le g \le 10 \\ 35 + 6(g - 10), & g > 10 \end{cases}$$

The second piece is in point-slope form: a line through the breakpoint $(10, 35)$ with slope 6. That's the natural way to write a piece that starts where another ends. Writing it as $35 + 6g$ would charge for all the data, including the 10 GB already paid for.

### Example 1

Using the phone plan, find $C(7)$ and $C(14.5)$, and find how much data was used if the bill is \$71.

1. $7 \le 10$, so $C(7) = 35$.
2. $14.5 > 10$: $C(14.5) = 35 + 6(4.5) = 35 + 27 = 62$ dollars.
3. For a bill of \$71, first decide which piece can produce it. The first piece only ever gives 35, so it must be the second: $35 + 6(g - 10) = 71$.
4. Solve: $6(g - 10) = 36$, $g - 10 = 6$, $g = 16$ GB. Check that it satisfies the piece's condition: $16 > 10$. ✓

A bill of exactly \$35 is different: every $g$ from 0 to 10 gives it, so the data used can't be pinned down. A flat piece has many inputs for one output.

```plot
{"x": [0, 20], "y": [0, 100], "functions": [{"f": "35", "from": 0, "to": 10}, {"f": "35 + 6*(x - 10)", "from": 10, "to": 20}], "points": [{"at": [10, 35], "label": "breakpoint (10, 35)"}, {"at": [14.5, 62], "label": "(14.5, 62)"}, {"at": [16, 71], "label": "(16, 71)"}], "xLabel": "data used (GB)", "yLabel": "monthly bill ($)", "caption": "Flat up to the allowance, then rising $6 per GB"}
```

## Pieces that join, and pieces that jump

The phone-plan graph has no break: you could draw it without lifting your pencil. A function whose graph has no breaks or jumps over an interval is called **continuous** there. (This is an informal description; calculus gives a precise definition.) For a piecewise linear function, the only places a break can happen are the breakpoints, so checking continuity means checking one thing at each breakpoint:

> Do the two formulas give the same value at the breakpoint?

If yes, the pieces meet there. If no, the graph jumps, as in the parking-garage staircase of Lesson 13.

Billing rules are usually designed to be continuous, so that using a tiny bit more never makes the price leap. That gives an equation for any unknown number in the rule.

### Example 2

For which value of $k$ is $f(x) = \begin{cases} 2x + 1, & x < 3 \\ kx - 5, & x \ge 3 \end{cases}$ continuous?

1. The breakpoint is $x = 3$. The first piece heads toward $2(3) + 1 = 7$ there.
2. The second piece gives $f(3) = 3k - 5$.
3. For the pieces to meet: $3k - 5 = 7$, so $3k = 12$ and $k = 4$.
4. With $k = 4$, both formulas give 7 at $x = 3$. With $k = 3$, say, the second piece starts at $f(3) = 4$, and the graph jumps down from just under 7 to 4.

```plot
{"x": [-1, 6], "y": [-2, 16], "functions": [{"f": "2*x + 1", "from": -1, "to": 3, "label": "2x + 1"}, {"f": "4*x - 5", "from": 3, "to": 5, "label": "4x - 5"}], "points": [{"at": [3, 7], "label": "(3, 7)"}], "caption": "k = 4: the pieces meet at (3, 7), so f is continuous"}
```

```plot
{"x": [-1, 6], "y": [-2, 16], "functions": [{"f": "2*x + 1", "from": -1, "to": 3, "label": "2x + 1"}, {"f": "3*x - 5", "from": 3, "to": 5, "label": "3x - 5"}], "points": [{"at": [3, 7], "open": true, "label": "(3, 7)"}, {"at": [3, 4], "label": "(3, 4)"}], "caption": "k = 3: a jump at x = 3"}
```

## Tax brackets: the rate on the next dollar

Many income tax systems, including the US federal income tax, use **brackets**: income is cut into layers, and each layer is taxed at its own rate. To keep the numbers simple, this lesson uses a made-up schedule, not any country's real one:

| Taxable income | Rate on income in this layer |
|---|---|
| \$0 to \$20,000 | 10% |
| \$20,000 to \$60,000 | 20% |
| over \$60,000 | 30% |

The key word is *layer*. Someone earning \$75,000 does not pay 30% on everything. They pay 10% on the first \$20,000, 20% on the next \$40,000, and 30% only on the last \$15,000.

![A vertical bar for an income of $75,000 split into three layers: $0 to $20,000 taxed at 10%, giving $2,000; $20,000 to $60,000 taxed at 20%, giving $8,000; $60,000 to $75,000 taxed at 30%, giving $4,500. Total tax $14,500, an average rate of 19.3%.](images/alg-m3-tax-brackets.svg)

As a function of income $x$ (in dollars), each piece starts from the tax already owed at its breakpoint. The tax on a full first layer is $0.10(20{,}000) = 2{,}000$, and on the first two layers $2{,}000 + 0.20(40{,}000) = 10{,}000$:

$$T(x) = \begin{cases} 0.10x, & 0 \le x \le 20{,}000 \\ 2{,}000 + 0.20(x - 20{,}000), & 20{,}000 < x \le 60{,}000 \\ 10{,}000 + 0.30(x - 60{,}000), & x > 60{,}000 \end{cases}$$

Written this way, $T$ is continuous by construction: each piece starts exactly where the previous one ended.

Two rates describe a tax like this:

- The **marginal tax rate** is the rate on the next dollar earned: the slope of the piece you are on. At \$75,000 it is 30%.
- The **average tax rate** (often called the effective tax rate) is the total tax divided by the total income, $\dfrac{T(x)}{x}$.

### Example 3

Find the tax, the marginal rate and the average rate for an income of \$75,000.

1. $75{,}000 > 60{,}000$, so use the third piece: $T(75{,}000) = 10{,}000 + 0.30(15{,}000) = 10{,}000 + 4{,}500 = 14{,}500$ dollars.
2. Marginal rate: the slope of the third piece, 30%.
3. Average rate: $\dfrac{14{,}500}{75{,}000} \approx 0.193$, about 19.3%.

The average rate is the slope of the segment from the origin to the point $(x, T(x))$: an average rate of change from 0 to $x$ (Lesson 10). Because the early layers are taxed at lower rates, that segment is less steep than the piece the point lies on, so the average rate is below the marginal rate.

```plot
{"x": [0, 100], "y": [0, 25], "functions": [{"f": "0.1*x", "from": 0, "to": 20}, {"f": "2 + 0.2*(x - 20)", "from": 20, "to": 60}, {"f": "10 + 0.3*(x - 60)", "from": 60, "to": 100}], "points": [{"at": [20, 2], "label": "(20, 2)"}, {"at": [60, 10], "label": "(60, 10)"}, {"at": [75, 14.5], "label": "(75, 14.5)"}], "segments": [{"from": [0, 0], "to": [75, 14.5], "dashed": true, "label": "average rate"}], "xLabel": "income (thousands of $)", "yLabel": "tax (thousands of $)", "caption": "The tax function T: slopes 0.1, 0.2, 0.3; the dashed segment's slope is the average rate"}
```

### A common myth

People sometimes say, "Don't take that raise; it puts you in a higher bracket and you'll take home less." Under a bracket schedule like this one, that is false. Compare incomes of \$59,000 and \$61,000:

- $T(59{,}000) = 2{,}000 + 0.20(39{,}000) = 9{,}800$, leaving \$49,200.
- $T(61{,}000) = 10{,}000 + 0.30(1{,}000) = 10{,}300$, leaving \$50,700.

The \$2,000 raise added \$500 of tax and \$1,500 of take-home pay. Only the dollars above \$60,000 are taxed at 30%. In general, after-tax income $x - T(x)$ has slope $1 - (\text{marginal rate})$ on each piece, which is positive whenever the rate is below 100%, and $T$ has no jumps, so after-tax income always rises with income. (Real tax codes are messier: credits, deductions and benefits that phase out can change the picture, and a benefit that stops completely at an income limit creates a jump, sometimes called a "cliff." A continuous bracket schedule has no cliffs.)

## Working backward

To find the input that produces a given output, use the outputs at the breakpoints to pick the right piece first, then solve.

### Example 4

Under the same schedule, someone owes \$8,000 in tax. What is their income?

1. Outputs at the breakpoints: $T(20{,}000) = 2{,}000$ and $T(60{,}000) = 10{,}000$.
2. Since $2{,}000 < 8{,}000 \le 10{,}000$, the income is in the second layer.
3. Solve $2{,}000 + 0.20(x - 20{,}000) = 8{,}000$: $0.20(x - 20{,}000) = 6{,}000$, so $x - 20{,}000 = 30{,}000$ and $x = 50{,}000$.
4. Check: $T(50{,}000) = 2{,}000 + 0.20(30{,}000) = 8{,}000$. ✓

What if you skipped step 2 and tried the third piece? $10{,}000 + 0.30(x - 60{,}000) = 8{,}000$ gives $x \approx 53{,}333$, which is *not* over \$60,000, so that piece doesn't apply and the "solution" must be rejected. A solution of one piece's equation counts only if it satisfies that piece's condition.

## Common mistakes

- Applying the top rate to the whole income. Each rate applies only to its own layer.
- Writing the second piece of a plan as $35 + 6g$ instead of $35 + 6(g - 10)$. Anchor each new piece at its breakpoint with point-slope form.
- Accepting a solution of one piece's equation without checking that it satisfies that piece's condition.
- Mixing up the marginal rate (slope of the current piece) with the average rate (total divided by total).
- Assuming every piecewise function is continuous. Check by comparing the two formulas at each breakpoint.

## Key points

- A piecewise linear model changes rate at breakpoints; write each later piece in point-slope form through the previous breakpoint.
- A piecewise linear function is continuous when neighboring formulas agree at every breakpoint; setting them equal finds a missing constant.
- In a bracket system, each rate applies only to the income in its layer. The marginal rate is the slope of the current piece; the average rate is $T(x)/x$.
- With increasing bracket rates, the average rate is below the marginal rate once income is past the first bracket.
- To run a model backward, compare with the outputs at the breakpoints to choose the piece, then solve and check the condition.
