---
id: stat-data-types
module: stat-m1
title: Data, variables and types
minutes: 20
topics: [Types of data]
drills: [stat-relfreq]
refs: [stat-ref-descriptive]
---
## What statistics is for

Statistics is the science of learning from data when the data are noisy, incomplete or
too numerous to look at one by one. A coach comparing two training plans, an engineer
checking whether rail welds meet a strength standard, and a pollster estimating how a
city will vote all face the same problem: the numbers they have vary, and they need to
separate real patterns from chance. This course builds the tools for that, starting with
the vocabulary used to describe a data set. Every later idea — which graph to draw, which
average to report, which test to run — depends on correctly identifying what kind of
data you have.

## Individuals and variables

A data set records information about a collection of **individuals** (also called
cases or observational units). Individuals can be people, but also cars, days, cities,
batches of concrete or hospital visits. A **variable** is any characteristic recorded
for each individual, and it can take different values for different individuals.

A spreadsheet makes this concrete: each *row* is an individual and each *column* is
a variable.

| Student | Grade level | Hours of sleep | Favorite subject | Commute (min) |
|---|---|---|---|---|
| A | 10 | 7.5 | Biology | 12 |
| B | 11 | 6.0 | History | 25 |
| C | 10 | 8.0 | Math | 5 |

Here the individuals are students and there are four variables.

## Categorical versus quantitative

The most important distinction is between two kinds of variables.

- A **categorical variable** places each individual into a group or category: favorite
  subject, blood type, state of residence, yes/no answers.
- A **quantitative variable** takes numerical values for which arithmetic makes sense:
  hours of sleep, commute time, income, temperature.

The test is not "is it written with digits?" but "does averaging it make sense?" A zip
code is written with digits, yet the average of 80203 and 80210 means nothing, so zip
code is categorical. Jersey numbers, phone numbers and ID numbers are categorical for
the same reason.

Grade level is a borderline case: 10, 11, 12 are numbers and the average grade level of a
club is meaningful, so it is usually treated as quantitative; but if you only use it to
form groups ("sophomores vs juniors"), you are treating it as categorical. The way a
variable is *used* matters.

### Discrete and continuous

Quantitative variables split further.

- A **discrete variable** takes a countable set of separate values, usually counts:
  number of siblings, number of defects on a rail segment, goals scored.
- A **continuous variable** can take any value in an interval, at least in principle:
  height, time, weight, temperature. In practice we round, but the underlying quantity
  is continuous.

A quick check: if a value comes from *counting*, it is discrete; if it comes from
*measuring*, it is continuous.

### Levels of measurement

Some textbooks use a finer four-way classification.

| Level | Meaning | Example |
|---|---|---|
| Nominal | Categories with no order | eye color, brand |
| Ordinal | Categories with a natural order, but gaps not meaningful | survey rating "poor, fair, good" |
| Interval | Numeric, differences meaningful, no true zero | temperature in °F |
| Ratio | Numeric with a true zero, ratios meaningful | weight, income, time |

Nominal and ordinal data are categorical; interval and ratio data are quantitative.
"Twice as hot" makes no sense in Fahrenheit (0 °F isn't "no heat"), but "twice as heavy"
does, which is the difference between interval and ratio.

## Populations, samples, parameters and statistics

The **population** is the entire group you want to know about. A **sample** is the part
of the population you actually collect data from. Usually the population is too large,
too expensive or impossible to measure completely, so we study a sample and generalize.

A number that describes a population is a **parameter**; a number computed from a sample
is a **statistic**. Memory hook: *p*opulation–*p*arameter, *s*ample–*s*tatistic.
Parameters are usually unknown and fixed; statistics are known but change from sample to
sample. Much of this course is about how well a statistic estimates a parameter.

Standard notation:

| Quantity | Parameter (population) | Statistic (sample) |
|---|---|---|
| Mean | $\mu$ | $\bar{x}$ |
| Standard deviation | $\sigma$ | $s$ |
| Proportion | $p$ | $\hat{p}$ |
| Size | $N$ | $n$ |

A **census** collects data from every individual in the population — then the numbers
you compute are parameters, not estimates.

## Descriptive versus inferential statistics

**Descriptive statistics** summarizes the data you have: graphs, averages, percentages.
**Inferential statistics** uses a sample to draw conclusions about a larger population,
with a statement of how uncertain those conclusions are. Modules 1–3 are mostly
descriptive; modules 7–9 are inferential; probability (modules 5–6) is the bridge.

## Starting from an investigative question

Every study should begin with an **investigative question**: the question about a
population that the data are collected to answer. Decide it before gathering data, and
don't rewrite it after seeing the results. A useful investigative question does three jobs.

1. It names the variables, which tells you what to measure.
2. It says what kind of answer is wanted, which tells you how to analyze the data:
   estimating a parameter (such as a mean or a proportion), or checking whether a parameter
   is larger than, smaller than or different from some value, or whether two variables are
   associated.
3. It names the population the answer is about, which limits what can be concluded.

"Do students at our school who live more than 5 miles away sleep less on school nights, on
average, than students who live closer?" names a population (students at this school), two
variables (distance from home to school, hours of sleep), a parameter for each group (mean
hours of sleep) and a direction (less). "Is sleep important?" does none of those things,
so no data set can answer it. An investigative question is also different from the
questions on a survey form. Those are the tool for collecting the data; the investigative
question is what the whole study is trying to find out.

## Distributions

The **distribution** of a variable tells what values it takes and how often it takes
each one. For a categorical variable, the distribution is a list of categories with
counts or percentages. For a quantitative variable, it is described by its shape, center
and spread — the subject of the next few lessons.

For counts, the **frequency** of a category is how many individuals fall in it, and the
**relative frequency** is the frequency divided by the total:

$$\text{relative frequency} = \frac{\text{count in category}}{\text{total count}}$$

Relative frequencies add to 1 (or 100%), apart from rounding.

### Example 1

A rail maintenance crew logs 50 track defects in a month: 18 are loose fasteners,
14 are worn rail, 11 are drainage problems and 7 are cracked ties. Identify the
individuals, the variable and its type, and find the relative frequency of worn rail.

1. The individuals are the 50 defects (not the crew or the month).
2. The variable is "defect type," which places each defect into a group, so it is
   categorical (nominal — no natural order).
3. Relative frequency of worn rail $= \tfrac{14}{50} = 0.28$, or 28%.

Check: $18 + 14 + 11 + 7 = 50$, and the four relative frequencies $0.36 + 0.28 + 0.22 + 0.14 = 1$.

### Example 2

A study records, for 200 randomly chosen adults in a state, their age in years, number
of children, smartphone brand, and satisfaction with public transit on a 1–5 scale. The
study reports that the average age in the sample is 44.3 years. Classify everything.

1. Age: quantitative, continuous (age is a measured amount of time, even when rounded
   to whole years); ratio level.
2. Number of children: quantitative, discrete (a count).
3. Smartphone brand: categorical, nominal.
4. Satisfaction 1–5: categorical, ordinal. Averages of rating scales are often reported,
   but the gaps between "2" and "3" aren't guaranteed equal, so treat it with care.
5. 44.3 years is computed from the sample, so it is a statistic ($\bar{x} = 44.3$). The
   average age of all adults in the state is the parameter $\mu$, which is unknown.
6. The population is all adults in the state; the sample is the 200 surveyed.

## Common mistakes

- Calling a variable quantitative because it's coded with numbers (zip codes, ID
  numbers, a "1 = yes, 0 = no" code).
- Confusing the individuals with the variable: in "the heights of 30 trees," the trees
  are the individuals and height is the variable.
- Mixing up parameter and statistic. Ask: was it computed from everyone, or from a
  subset?
- Thinking a continuous variable becomes discrete because it is rounded.

## Key points

- Individuals are the objects described; variables are the characteristics recorded.
- Categorical variables sort into groups; quantitative variables are numbers you can
  average. Quantitative variables are discrete (counts) or continuous (measurements).
- Population/parameter versus sample/statistic: $\mu, \sigma, p$ versus $\bar{x}, s, \hat{p}$.
- Relative frequency = count ÷ total; relative frequencies add to 1.
