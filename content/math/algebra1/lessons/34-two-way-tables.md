---
id: a1-two-way
module: a1-m8
title: Two-way tables and relative frequency
minutes: 25
topics: [Two-way tables]
drills: [a1-d-two-way-freq, a1-d-two-way-complete]
refs: [a1-ref-data]
---
The previous lesson summarized numerical data, like times and scores. Many questions involve categories instead: grade level, yes or no, preferred option. When each person is classified by two categorical variables at once, a two-way table organizes the counts, and relative frequencies (fractions or percents) let you compare groups of different sizes and decide whether the two variables are related.

## Building a two-way table

**Categorical data** places each individual in a category rather than recording a measurement. A **two-way table** counts individuals by two categorical variables: one variable's categories label the rows, the other's label the columns, and each cell counts the individuals in that row *and* that column.

Suppose 200 students at a school are asked whether they prefer online or in-person classes:

| | Online | In person | Total |
|---|---|---|---|
| 9th grade | 36 | 84 | 120 |
| 12th grade | 48 | 32 | 80 |
| Total | 84 | 116 | 200 |

- The four inner cells are **joint frequencies**: 36 students are in 9th grade *and* prefer online.
- The row and column totals in the margins are **marginal frequencies**: 120 students are 9th graders, 84 prefer online.
- The bottom-right number is the grand total, 200. Both the row totals and the column totals add up to it, which is a handy check.

## Relative frequencies

A count on its own is hard to interpret: is 48 a lot? A **relative frequency** divides a count by a total, giving a fraction or percent. Which total you divide by is the whole skill, and it depends on the question.

**Joint relative frequency**: a cell divided by the grand total. "What percent of all students are 12th graders who prefer online?" $\tfrac{48}{200} = 24\%$.

**Marginal relative frequency**: a row or column total divided by the grand total. "What percent of all students prefer online?" $\tfrac{84}{200} = 42\%$.

**Conditional relative frequency**: a cell divided by its own row or column total. It answers a question that starts with a restriction, "among the students who…", so you divide by the size of that group. "Among 9th graders, what percent prefer online?" $\tfrac{36}{120} = 30\%$.

Dividing every cell by the grand total gives a table of joint and marginal relative frequencies:

| | Online | In person | Total |
|---|---|---|---|
| 9th grade | 0.18 | 0.42 | 0.60 |
| 12th grade | 0.24 | 0.16 | 0.40 |
| Total | 0.42 | 0.58 | 1.00 |

Dividing each cell by its *row* total instead gives the conditional relative frequencies within each grade, and each row then adds to 100%:

| | Online | In person | Total |
|---|---|---|---|
| 9th grade | 30% | 70% | 100% |
| 12th grade | 60% | 40% | 100% |

## Association

Two categorical variables have an **association** when the conditional relative frequencies differ noticeably between groups, so that knowing one variable helps predict the other. Here, 30% of 9th graders but 60% of 12th graders prefer online. That's a big difference, so grade level and preference are associated in this group. If both grades had shown about 42% online (the overall rate), there would be no association.

```plot
{"x": [0, 3], "y": [0, 100], "bars": [{"x": 1, "height": 30, "width": 0.6, "label": "9th: 30%"}, {"x": 2, "height": 60, "width": 0.6, "label": "12th: 60%"}], "xLabel": "grade", "yLabel": "% online", "caption": "Compare conditional percentages, not raw counts: 36 vs 48 looks close, but 30% vs 60% is not"}
```

Raw counts can mislead. In the original table, 36 and 48 look close, but the grades have different sizes (120 vs 80), and the percents reveal that 12th graders prefer online at twice the rate. Always compare conditional relative frequencies, never raw counts, when the groups differ in size.

An association is not proof that one variable causes the other. Perhaps 12th graders prefer online classes because more of them have jobs; the grade itself may not be the reason.

### Example 1

Using the table of 200 students, find: (a) the percent of online-preferring students who are 12th graders; (b) the percent of 12th graders who prefer online.

1. (a) The restriction is "online-preferring students," a column with total 84. Of those, 48 are 12th graders: $\tfrac{48}{84} \approx 0.571 = 57.1\%$.
2. (b) The restriction is "12th graders," a row with total 80. Of those, 48 prefer online: $\tfrac{48}{80} = 0.6 = 60\%$.
3. Same cell, different questions, different answers. The word after "of" or "among" names the group whose total goes in the denominator.

### Example 2

A gym surveys 150 members. 90 exercise at least three times a week. Of those, 60 say they sleep well. Of the members who exercise less, 20 say they sleep well. Build the two-way table and decide whether exercise and sleep quality are associated.

1. Fill in what's given: "3+ times" row total 90, with 60 sleeping well; "less" row total $150 - 90 = 60$, with 20 sleeping well.
2. Subtract to complete the rows: $90 - 60 = 30$ and $60 - 20 = 40$ don't sleep well.
3. Column totals: sleep well $60 + 20 = 80$; not well $30 + 40 = 70$; check $80 + 70 = 150$.

| | Sleep well | Not well | Total |
|---|---|---|---|
| 3+ times/week | 60 | 30 | 90 |
| Less | 20 | 40 | 60 |
| Total | 80 | 70 | 150 |

4. Conditional relative frequencies: $\tfrac{60}{90} \approx 66.7\%$ of frequent exercisers sleep well, versus $\tfrac{20}{60} \approx 33.3\%$ of the others.
5. The percents differ a lot, so there is an association in this sample. The survey alone can't show that exercise *causes* better sleep; people who sleep well might simply have more energy to exercise.

### Example 3

A teacher records whether students are left- or right-handed and whether they play an instrument:

| | Plays | Doesn't | Total |
|---|---|---|---|
| Left-handed | 6 | 14 | 20 |
| Right-handed | 39 | 91 | 130 |
| Total | 45 | 105 | 150 |

Is there an association?

1. Among left-handers: $\tfrac{6}{20} = 30\%$ play.
2. Among right-handers: $\tfrac{39}{130} = 30\%$ play.
3. The conditional percents are equal, so in these data handedness and playing an instrument are not associated, even though 39 is far bigger than 6.

## Common mistakes

- Dividing by the grand total when the question restricts to a group ("of the 9th graders…"). Conditional questions use the group's total.
- Dividing by the wrong total: "percent of online students who are 12th graders" uses the online column total, not the 12th-grade row total.
- Comparing raw counts between groups of different sizes.
- Concluding causation from an association.
- Forgetting to check that the row totals and column totals both add up to the grand total.

## Key points

- A two-way table counts individuals by two categorical variables; cells are joint frequencies, totals are marginal frequencies.
- Joint and marginal relative frequencies divide by the grand total; conditional ones divide by the total of the given group.
- Variables are associated when conditional relative frequencies differ noticeably between groups.
- Association does not show causation.
