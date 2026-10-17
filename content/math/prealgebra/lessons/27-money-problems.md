---
id: pre-money-problems
module: pre-m7
title: Money word problems
minutes: 30
topics: [Money word problems]
drills: [pre-coin-problem, pre-ticket-problem, pre-mixture-problem]
refs: [pre-ref-algebra]
---
## Two kinds of numbers in one story

Lesson 26 gave you a five-step process for word problems: define a variable, write an equation, solve, answer, check. This lesson applies it to a family of problems that all share one structure: a jar of coins, a night of ticket sales, a bag of mixed nuts. Each story mixes two kinds of numbers, *how many* items there are and *how much each one is worth*, and the whole trick is keeping them apart.

## Count times value

Every money problem rests on one multiplication. The **total value** of a group of identical items is

$$\text{total value} = \text{number of items} \times \text{value of each item}.$$

Seven quarters are worth $7 \times 0.25 = 1.75$ dollars. Twelve adult tickets at \$9 bring in $12 \times 9 = 108$ dollars. Five pounds of coffee at \$8 a pound cost $5 \times 8 = 40$ dollars. When a problem has two kinds of items, two facts are usually given:

1. the *number* of items altogether (or a relationship between the numbers), and
2. the **total value** of everything together.

The numbers add up to the total number, and the values add up to the total value. What does *not* work is adding a count to a value, or adding the prices of the two kinds and calling that a total.

A small table keeps the two kinds of numbers in separate columns. Fill in one row per kind of item, then write the equation from the last column.

| Kind | Number | Value each | Total value |
|---|---|---|---|
| first kind | $x$ | … | $x \times \ldots$ |
| second kind | (in terms of $x$) | … | … |
| all together | given | | given |

*Work in cents for coins.* Dimes are worth 10 cents, quarters 25 cents, and \$5.10 is 510 cents. Using cents keeps every number whole, so you avoid decimal slips. Just be consistent: never put cents on one side of the equation and dollars on the other.

## Coin problems

### Example 1

A jar holds 30 coins, all dimes and quarters, worth \$5.10 altogether. How many of each are there?

*Define the variable.* Let $d$ be the number of dimes. There are 30 coins in all, so the quarters are whatever is left: $30 - d$.

| Kind | Number | Value each (cents) | Total value (cents) |
|---|---|---|---|
| dimes | $d$ | 10 | $10d$ |
| quarters | $30 - d$ | 25 | $25(30 - d)$ |
| all together | 30 | | 510 |

*Write the equation* from the last column: the two values add to 510 cents.

$$10d + 25(30 - d) = 510$$

*Solve.* Distribute: $10d + 750 - 25d = 510$. Combine like terms: $-15d + 750 = 510$. Subtract 750: $-15d = -240$. Divide by $-15$: $d = 16$.

*Answer.* There are 16 dimes and $30 - 16 = 14$ quarters.

*Check.* $16 + 14 = 30$ coins, and $16(10) + 14(25) = 160 + 350 = 510$ cents. ✓

Why "$30 - d$"? If you knew there were 12 dimes, you'd find the quarters by computing $30 - 12$. With an unknown number of dimes, you do the same subtraction with $d$. A second letter for the quarters would give two unknowns, and so far you have only solved equations with one.

### Example 2

Tara has nickels and dimes worth \$2.65. She has 4 more than twice as many dimes as nickels. How many of each coin does she have?

Here the relationship between the counts is given instead of the total count. Let $n$ be the number of nickels; then the dimes number $2n + 4$.

Values in cents: nickels $5n$, dimes $10(2n + 4)$, total 265.

$$5n + 10(2n + 4) = 265$$

Distribute: $5n + 20n + 40 = 265$. Combine: $25n + 40 = 265$. Subtract 40: $25n = 225$. Divide: $n = 9$.

She has 9 nickels and $2(9) + 4 = 22$ dimes. Check: $9(5) + 22(10) = 45 + 220 = 265$ cents. ✓

## Ticket problems

Ticket problems are coin problems in disguise: two kinds of tickets, each with its own price, a total number sold and a total amount collected.

### Example 3

A school play sold 220 tickets. Adult tickets cost \$12 and student tickets cost \$7. The ticket sales brought in \$2,190. How many adult tickets were sold?

Let $a$ be the adult tickets; the student tickets are $220 - a$.

| Kind | Number | Price | Money |
|---|---|---|---|
| adult | $a$ | 12 | $12a$ |
| student | $220 - a$ | 7 | $7(220 - a)$ |
| all together | 220 | | 2,190 |

$$12a + 7(220 - a) = 2{,}190$$

Distribute: $12a + 1{,}540 - 7a = 2{,}190$. Combine: $5a + 1{,}540 = 2{,}190$. Subtract: $5a = 650$, so $a = 130$.

The play sold 130 adult tickets (and 90 student tickets). Check: $130(12) + 90(7) = 1{,}560 + 630 = 2{,}190$. ✓

A quick reasonableness test helps here. If all 220 tickets had been student tickets, sales would be $220 \times 7 = 1{,}540$ dollars. Each adult ticket adds \$5 more than a student ticket, and the actual sales are \$650 above that, so there must be $650 \div 5 = 130$ adult tickets. This is the same arithmetic the equation did, seen from another angle.

## Mixture problems

A **mixture problem** blends two ingredients with different prices into a mix with a price in between. The "number" is now an amount (pounds, liters) and the "value each" is a price per unit, but the table and the equation have the same shape. The new idea is that the mix itself has a value too: its total amount times its price per unit.

### Example 4

A shop blends coffee that sells for \$9 per pound with coffee that sells for \$14 per pound to make 20 pounds of a blend that sells for \$11 per pound. How many pounds of each should it use?

Let $x$ be the pounds of \$9 coffee; then $20 - x$ pounds are the \$14 coffee. The blend is worth $20 \times 11 = 220$ dollars.

$$9x + 14(20 - x) = 220$$

Distribute: $9x + 280 - 14x = 220$. Combine: $-5x + 280 = 220$. Subtract 280: $-5x = -60$. Divide: $x = 12$.

Use 12 pounds of the \$9 coffee and 8 pounds of the \$14 coffee. Check: $12(9) + 8(14) = 108 + 112 = 220$. ✓

Notice that \$11 is closer to \$9 than to \$14, so the blend needs *more* of the cheaper coffee. The number line shows the idea: the mix price sits between the two prices, nearer the ingredient there is more of.

```numberline
{"x": [8, 15], "points": [{"at": [9, 0], "label": "$9 (12 lb)"}, {"at": [11, 0], "label": "blend $11"}, {"at": [14, 0], "label": "$14 (8 lb)"}], "caption": "The blend's price lies between the two prices, closer to the one used more"}
```

### Example 5

How many pounds of peanuts at \$4 per pound must be added to 6 pounds of cashews at \$10 per pound to make a mix worth \$6 per pound?

This time one amount is fixed and the total is unknown. Let $p$ be the pounds of peanuts. The mix weighs $p + 6$ pounds and is worth $6(p + 6)$ dollars.

$$4p + 10(6) = 6(p + 6)$$

Simplify: $4p + 60 = 6p + 36$. Subtract $4p$: $60 = 2p + 36$. Subtract 36: $24 = 2p$, so $p = 12$.

Add 12 pounds of peanuts, making 18 pounds of mix. Check: $12(4) + 60 = 108$ and $18 \times 6 = 108$. ✓

## Common mistakes

- *Adding counts and values together*, such as writing $d + 25(30 - d) = 510$. Each term in the value equation must be a count *times* a value.
- *Mixing units*: $10d + 25q = 5.10$ puts cents on the left and dollars on the right. Use cents throughout, or dollars throughout.
- *Using two unknowns* without relating them. If you know the total number, write the second count as "total minus the first."
- *Averaging the prices.* The blend in Example 4 is not \$11.50 just because $\tfrac{9 + 14}{2} = 11.5$; the price depends on how much of each is used.
- *Answering half the question.* After finding $d = 16$, the problem still wants the number of quarters.
- *Forgetting the mix in a mixture problem*: its total value is (total amount) × (its price), not the sum of the two prices.

## Key points

- Total value = number of items × value of each item.
- Let the variable be one count, and write the other count in terms of it (total minus the first, or the given relationship).
- The values of the parts add up to the total value; write that as the equation.
- For coins, work in cents. For mixtures, the mix's value is its amount times its price.
- Check both facts: the counts and the values.
