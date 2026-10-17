---
id: a1-exponential
module: a1-m7
title: "Exponential functions: growth and decay"
minutes: 30
topics: [Exponential functions]
drills: [a1-d-exp-evaluate, a1-d-percent-growth, a1-d-exp-from-table, a1-d-rate-restate]
refs: [a1-ref-data]
---
A linear function changes by adding the same amount at each step. Many real quantities instead change by *multiplying* by the same factor at each step: a population that grows 3% a year, a savings account earning interest, a medicine that the body clears at 20% per hour, a rumor that doubles every day. These are exponential functions. This lesson defines them, shows how their graphs look, and connects percent rates of change to the formula. It uses the exponent rules from Lesson 18, especially $b^0 = 1$ and $b^{-n} = \tfrac{1}{b^n}$.

## The form $y = a \cdot b^x$

An **exponential function** has the form

$$f(x) = a \cdot b^x, \qquad a \ne 0,\ b > 0,\ b \ne 1.$$

The variable is in the exponent. That's the difference from $x^2$, where the variable is the base.

- $a$ is the **initial value**: $f(0) = a \cdot b^0 = a \cdot 1 = a$, so the graph crosses the $y$-axis at $(0, a)$.
- $b$ is the **growth factor** (or decay factor): each time $x$ goes up by 1, the output is multiplied by $b$, because $a \cdot b^{x+1} = (a \cdot b^x) \cdot b$.

The restrictions on $b$ keep things sensible. With $b = 1$, $1^x = 1$ and the function is just the constant $a$. With $b$ negative, $b^x$ flips sign and isn't even defined for $x = \tfrac12$.

Here is a table for $f(x) = 3 \cdot 2^x$:

| $x$ | $-2$ | $-1$ | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|---|
| $f(x)$ | 0.75 | 1.5 | 3 | 6 | 12 | 24 |

Each step right doubles the output; each step left halves it. Negative inputs are fine: $f(-2) = 3 \cdot 2^{-2} = 3 \cdot \tfrac14 = 0.75$.

Notice the order of operations: $3 \cdot 2^x$ means "raise 2 to the power, then multiply by 3." It is not $6^x$. At $x = 2$, $3 \cdot 2^2 = 12$, while $6^2 = 36$.

## Growth and decay

If $a > 0$:

- $b > 1$ gives **exponential growth**: the outputs increase, slowly at first and then faster and faster.
- $0 < b < 1$ gives **exponential decay**: the outputs decrease, quickly at first and then more and more slowly, getting close to 0.

```plot
{"x": [-3, 4], "y": [-1, 10], "functions": [{"f": "2*1.8^x", "label": "y = 2(1.8)^x  growth"}, {"f": "6*0.5^x", "label": "y = 6(0.5)^x  decay", "dashed": true}], "points": [{"at": [0, 2], "label": "(0, 2)"}, {"at": [0, 6], "label": "(0, 6)"}], "caption": "Both graphs approach the x-axis on one side but never reach it"}
```

In both cases the outputs are always positive: a positive number multiplied by a positive factor stays positive, no matter how many times. So for $a > 0$ the domain is all real numbers and the range is $y > 0$. The graph gets closer and closer to the $x$-axis (to the left for growth, to the right for decay) without touching it. A line that a graph approaches this way is a **horizontal asymptote**; here it is $y = 0$.

## Percent rates of change

Growth "by 5% per year" means each year's amount is the previous amount plus 5% of it:

$$\text{new} = \text{old} + 0.05 \cdot \text{old} = 1.05 \cdot \text{old}.$$

So a **growth rate** $r$ (as a decimal) corresponds to the factor $b = 1 + r$, and a **decay rate** $r$ corresponds to $b = 1 - r$:

$$\text{growth: } y = a(1 + r)^t, \qquad \text{decay: } y = a(1 - r)^t.$$

Keep the rate and the factor apart. A 15% decay rate means you keep 85% each year: the factor is 0.85, not 0.15.

| Function | Factor $b$ | Meaning |
|---|---|---|
| $y = 500(1.08)^t$ | 1.08 | grows 8% per step |
| $y = 500(0.92)^t$ | 0.92 | decays 8% per step |
| $y = 500(2)^t$ | 2 | doubles: grows 100% per step |
| $y = 500(0.5)^t$ | 0.5 | halves: decays 50% per step |

The power rule from Lesson 18 lets you restate a rate over a different time step. Since $1.21 = 1.1^2$, the function $y = 500(1.21)^t$ can be written $y = 500(1.1)^{2t}$: growing 21% per year is the same as growing 10% per half-year. Going the other way, a factor of 1.1 per month compounds to $1.1^{12} \approx 3.14$ per year, about 214% yearly growth, far more than $12 \times 10\% = 120\%$.

### Example 1

A town has 2,400 residents and grows 5% per year. Write a function for the population after $t$ years and predict it after 10 years.

1. Initial value $a = 2400$; rate $r = 0.05$, so the factor is $b = 1.05$.
2. $P(t) = 2400(1.05)^t$.
3. $P(10) = 2400(1.05)^{10} \approx 2400(1.62889) \approx 3909.3$.
4. About 3,909 residents. Compare with adding 5% of 2,400 (120 people) every year, which would give only $2400 + 1200 = 3600$. Exponential growth pulls ahead because each year's 5% is taken of a larger number.

### Example 2

A car bought for \$28,000 loses 15% of its value each year. What is it worth after 4 years?

1. Decay rate $r = 0.15$, so the factor is $b = 1 - 0.15 = 0.85$.
2. $V(t) = 28000(0.85)^t$.
3. $V(4) = 28000(0.85)^4 = 28000(0.52200625) \approx 14{,}616.17$.
4. The car is worth about \$14,616. Each year it loses 15% of its *current* value, so the dollar loss shrinks: \$4,200 the first year, but only about \$2,579 the fourth.

## Writing an exponential function from data

To recognize exponential data in a table with equally spaced inputs, divide each output by the one before it. If the ratio is always the same, the data are exponential and that ratio is $b$. The output at $x = 0$ is $a$.

### Example 3

Write a function for the table.

| $x$ | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| $y$ | 80 | 40 | 20 | 10 |

1. Ratios: $\tfrac{40}{80} = \tfrac{20}{40} = \tfrac{10}{20} = \tfrac12$. Constant, so the data are exponential with $b = \tfrac12$.
2. At $x = 0$, $y = 80$, so $a = 80$.
3. $y = 80\left(\tfrac12\right)^x$. Check: $x = 3$ gives $80 \cdot \tfrac18 = 10$. ✓

If the table skips inputs, account for the gap. Suppose $f(0) = 6$ and $f(2) = 54$. Two steps multiply by $b$ twice, so $6b^2 = 54$, $b^2 = 9$ and $b = 3$ (the base must be positive). The function is $f(x) = 6 \cdot 3^x$.

### Example 4

A lab culture starts with 500 bacteria and doubles every hour. How many are there after 6 hours, and when does the count first pass 100,000?

1. $N(t) = 500 \cdot 2^t$.
2. $N(6) = 500 \cdot 64 = 32{,}000$.
3. Keep doubling: $N(7) = 64{,}000$ and $N(8) = 128{,}000$. The count first passes 100,000 between 7 and 8 hours, so it has passed it by hour 8.

Solving $500 \cdot 2^t = 100{,}000$ exactly takes logarithms, a later-course tool; in Algebra 1 you answer such questions with a table or a graph.

## Interest

Money earning interest once a year at rate $r$ grows like any other percent growth: $A = P(1 + r)^t$, where $P$ is the starting amount (the principal). With \$1,000 at 4% for 3 years, $A = 1000(1.04)^3 \approx 1124.86$ dollars. This is called compound interest because each year's interest also earns interest; simple interest, $I = Prt$, pays interest only on the original \$1,000 and would give \$1,120.

## Common mistakes

- Using the rate as the factor: 6% growth is $b = 1.06$, not $0.06$ or $6$.
- Using the rate lost instead of the part kept: 20% decay is $b = 0.8$.
- Multiplying $a$ and $b$ before applying the exponent: $5 \cdot 3^x \ne 15^x$.
- Treating exponential data as linear because the first few outputs look close together. Check the ratios, not just the differences.
- Thinking decay reaches zero. For $a > 0$ the outputs get close to 0 but stay positive.

## Key points

- $f(x) = a \cdot b^x$: $a$ is the value at $x = 0$; $b$ is the factor applied for each increase of 1 in $x$.
- $b > 1$ is growth, $0 < b < 1$ is decay; with $a > 0$ the range is $y > 0$ and the asymptote is $y = 0$.
- Growth rate $r$: $b = 1 + r$. Decay rate $r$: $b = 1 - r$.
- Equal input steps with a constant ratio of outputs mean exponential data.
