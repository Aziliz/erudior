---
id: pre-graphs
module: pre-m9
title: Reading tables and graphs
minutes: 25
topics: [Tables and graphs]
drills: [pre-bar-graph, pre-circle-graph]
refs: [pre-ref-arithmetic]
---
## Data you can see

Numbers in a long list are hard to compare at a glance. Tables organize them, and graphs turn them into pictures: you can see which bar is tallest or where a line rises fastest before reading a single number. This lesson covers the common displays (tables, bar graphs, line graphs and circle graphs), how to read values from them, and the calculations you'll often be asked to do with what you read: differences, totals, percents and percent change.

## Tables

A table arranges data in rows and columns. Always read the title, the row and column headings, and the units before reading any values.

| Month | Visitors | Revenue (dollars) |
|---|---|---|
| June | 1,240 | 9,920 |
| July | 1,860 | 14,880 |
| August | 1,550 | 12,400 |

### Example 1

Using the table, what was the mean revenue per visitor in July, and what was the percent increase in visitors from June to July?

Revenue per visitor in July: $14{,}880 \div 1{,}860 = 8$ dollars. Percent increase in visitors: $(1{,}860 - 1{,}240) \div 1{,}240 = 620 \div 1{,}240 = 0.5$, a 50% increase.

## Bar graphs

A **bar graph** compares amounts across categories using bars whose lengths are proportional to the amounts. Read a bar's value from where its top meets the scale on the vertical axis.

```plot
{"x": [0, 6], "y": [0, 50], "bars": [{"x": 1, "height": 35, "width": 0.7, "label": "Mon"}, {"x": 2, "height": 20, "width": 0.7, "label": "Tue"}, {"x": 3, "height": 45, "width": 0.7, "label": "Wed"}, {"x": 4, "height": 30, "width": 0.7, "label": "Thu"}, {"x": 5, "height": 40, "width": 0.7, "label": "Fri"}], "xLabel": "Day", "yLabel": "Books sold", "caption": "Books sold at a store, Monday to Friday"}
```

### Example 2

Using the bar graph: (a) How many more books were sold on Wednesday than on Tuesday? (b) What was the mean number sold per day?

(a) Wednesday 45, Tuesday 20: $45 - 20 = 25$ more.

(b) Total: $35 + 20 + 45 + 30 + 40 = 170$. Mean: $170 \div 5 = 34$ books per day.

*Watch the scale.* A vertical axis that doesn't start at zero exaggerates differences: if the axis ran from 15 to 50, Tuesday's bar would look a tiny fraction of Wednesday's even though Wednesday's value is a bit more than double. Always check where the scale starts.

## Line graphs

A **line graph** shows how a quantity changes over time. Points are plotted for each time and connected by segments. A segment that rises shows an increase, a falling one a decrease, and a steeper segment a faster change.

```plot
{"x": [0, 7], "y": [0, 80], "segments": [{"from": [1, 42], "to": [2, 48]}, {"from": [2, 48], "to": [3, 61]}, {"from": [3, 61], "to": [4, 70]}, {"from": [4, 70], "to": [5, 66]}, {"from": [5, 66], "to": [6, 52]}], "points": [{"at": [1, 42], "label": "42"}, {"at": [2, 48], "label": "48"}, {"at": [3, 61], "label": "61"}, {"at": [4, 70], "label": "70"}, {"at": [5, 66], "label": "66"}, {"at": [6, 52], "label": "52"}], "xLabel": "Month (1 = March … 6 = August)", "yLabel": "Average high (°F)", "caption": "Average monthly high temperature"}
```

### Example 3

Using the line graph: between which two consecutive months did the temperature rise the most? What was the overall range?

Changes: March→April +6, April→May +13, May→June +9, June→July −4, July→August −14. The biggest rise is April to May (+13°F), the steepest upward segment. The range is $70 - 42 = 28$°F.

## Circle graphs

A **circle graph** (pie chart) shows how a whole is divided into parts. Each sector's size is proportional to its share, and the shares add to 100%.

```shape
{"polygons": [{"points": [[0, 0], [0.0, 3.0], [0.624, 2.934], [1.22, 2.741], [1.763, 2.427], [2.229, 2.007], [2.598, 1.5], [2.853, 0.927], [2.984, 0.314], [2.984, -0.314], [2.853, -0.927], [2.598, -1.5], [2.229, -2.007], [1.763, -2.427]]}, {"points": [[0, 0], [1.763, -2.427], [1.431, -2.636], [1.075, -2.801], [0.7, -2.917], [0.314, -2.984], [-0.079, -2.999], [-0.469, -2.963], [-0.852, -2.876], [-1.22, -2.741], [-1.567, -2.558], [-1.888, -2.331], [-2.176, -2.065], [-2.427, -1.763]]}, {"points": [[0, 0], [-2.427, -1.763], [-2.558, -1.567], [-2.673, -1.362], [-2.772, -1.148], [-2.853, -0.927], [-2.917, -0.7], [-2.963, -0.469], [-2.991, -0.235], [-3.0, -0.0], [-2.991, 0.235], [-2.963, 0.469], [-2.917, 0.7], [-2.853, 0.927]]}, {"points": [[0, 0], [-2.853, 0.927], [-2.801, 1.075], [-2.741, 1.22], [-2.673, 1.362], [-2.598, 1.5], [-2.516, 1.634], [-2.427, 1.763], [-2.331, 1.888], [-2.229, 2.007], [-2.121, 2.121], [-2.007, 2.229], [-1.888, 2.331], [-1.763, 2.427]]}, {"points": [[0, 0], [-1.763, 2.427], [-1.634, 2.516], [-1.5, 2.598], [-1.362, 2.673], [-1.22, 2.741], [-1.075, 2.801], [-0.927, 2.853], [-0.776, 2.898], [-0.624, 2.934], [-0.469, 2.963], [-0.314, 2.984], [-0.157, 2.996], [-0.0, 3.0]]}], "labels": [{"at": [1.81, 0.59], "text": "Rent 40%"}, {"at": [-0.3, -1.88], "text": "Food 25%"}, {"at": [-1.88, -0.3], "text": "Transport 15%"}, {"at": [-1.54, 1.12], "text": "Savings 10%"}, {"at": [-0.59, 1.81], "text": "Other 10%"}], "caption": "How a monthly budget of $3,000 is spent"}
```

To find the amount in a sector, take its percent of the total. To find the angle of a sector, take its percent of 360°.

### Example 4

The circle graph shows a monthly budget of \$3,000. How much goes to food, and what is the angle of the food sector?

Amount: $25\% \times 3{,}000 = 0.25 \times 3{,}000 = 750$ dollars. Angle: $0.25 \times 360° = 90°$, a quarter of the circle.

### Example 5

In the same budget, how much more is spent on rent than on transport?

Rent: $0.40 \times 3{,}000 = 1{,}200$. Transport: $0.15 \times 3{,}000 = 450$. Difference: $1{,}200 - 450 = 750$ dollars. (Or directly: $40\% - 15\% = 25\%$ of 3,000.)

## Choosing a display

| Display | Best for |
|---|---|
| Table | exact values, several variables |
| Bar graph | comparing amounts across categories |
| Line graph | change over time |
| Circle graph | parts of a whole (percent shares) |

## Frequency tables

A **frequency table** lists each value and how many times it occurs. To find the mean from one, multiply each value by its frequency, add, and divide by the total frequency.

| Children per family | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Number of families | 3 | 7 | 6 | 3 | 1 |

### Example 6

Find the mean number of children per family in the table.

There are $3 + 7 + 6 + 3 + 1 = 20$ families. Total children: $0(3) + 1(7) + 2(6) + 3(3) + 4(1) = 0 + 7 + 12 + 9 + 4 = 32$. Mean: $32 \div 20 = 1.6$ children per family. (Adding the frequencies alone, or the values alone, gives a meaningless result.)

## Common mistakes

- *Ignoring the scale.* Each grid line might be 5 or 10 units, and the axis might not start at 0.
- *Reading the wrong axis or the wrong bar.* Read the labels first.
- *Using a circle graph's percent as an amount.* 25% of a budget is a dollar amount only after you multiply by the total.
- *Assuming a line graph's trend continues* beyond the data shown.
- *Adding percents from different wholes.*

## Key points

- Read the title, labels, units and scale before reading values.
- Bar graphs compare categories; line graphs show change over time; circle graphs show parts of a whole.
- Typical calculations: differences, totals, means, percents of a total, and percent change.
- A circle graph sector's angle is its percent of 360°.
- The mean from a frequency table is the sum of value × frequency, divided by the total frequency.
