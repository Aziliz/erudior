---
id: stat-sampling
module: stat-m4
title: Sampling methods and bias
minutes: 30
topics: [Sampling and bias]
drills: [stat-strat-alloc, stat-systematic]
refs: [stat-ref-which-test]
---
## Where data come from

Everything so far assumed the data were in hand. But conclusions are only as good as the
way the data were collected, and no formula can rescue a badly chosen sample. This module
is about collecting data well: this lesson covers samples and surveys; the next two cover
experiments and what each kind of study can conclude.

## Population, sample and sampling frame

The **population** is the whole group you want information about; a **sample** is the
part you actually examine. A **sampling frame** is the list from which the sample is
actually drawn — a list of registered voters, student ID numbers, customer accounts. If
the frame leaves out part of the population, no sampling method can fix it.

## Bad sampling methods

A sampling method is **biased** if it systematically favors certain outcomes — not just
"off by chance," but off in the same direction every time it is used.

- A **convenience sample** takes whoever is easiest to reach: shoppers at one mall,
  your friends, the first 50 people through the door. They are rarely representative.
- A **voluntary response sample** consists of people who choose to respond to an open
  invitation (call-in polls, online reviews, "click to vote"). People with strong —
  usually negative — opinions respond most, so these samples are typically badly biased.

Large size doesn't help: a voluntary response poll of 100,000 people is still biased.
Bias is about *how* individuals are chosen, not how many.

## Random sampling methods

The cure for bias is to let chance choose. **Random sampling** removes the selector's
preferences and makes it possible to calculate how far the results are likely to be from
the truth.

### Simple random sample

A **simple random sample** (SRS) of size $n$ is chosen so that every set of $n$
individuals in the population has the same chance of being the sample. To take one:
number the individuals in the frame $1$ to $N$, then use a random number generator (or
a table of random digits) to pick $n$ distinct numbers, skipping repeats and numbers
outside the range.

### Stratified random sample

Divide the population into **strata** — groups of similar individuals, such as grade
levels, regions or income brackets — and take a separate SRS within each stratum.
Stratifying guarantees every stratum is represented and gives *more precise* estimates
when the strata differ from each other but individuals within a stratum are similar.
With **proportional allocation**, each stratum's share of the sample matches its share
of the population.

### Cluster sample

Divide the population into **clusters** — usually location-based groups such as city
blocks, classrooms or train cars — randomly choose some clusters, and include *every*
individual in the chosen clusters. Clusters are used for convenience and cost: it's
cheaper to survey everyone on 5 randomly chosen trains than 200 riders scattered across
the network. Clusters work best when each cluster is a mini-version of the population
(heterogeneous within).

The contrast is the key exam point: *strata are similar inside, and we sample from every
stratum; clusters are mixed inside, and we sample whole clusters*.

### Systematic random sample

Choose a random starting point among the first $k$ individuals in a list, then take every
$k$th individual after it, where $k = N/n$. This is easy in the field (every 20th
customer through a door). It works like an SRS unless the list has a repeating pattern
that lines up with $k$.

### Multistage sampling

Large surveys combine methods: randomly choose counties, then neighborhoods within them,
then households within neighborhoods.

### Example 1

A university has 12,000 undergraduates: 4,200 first-years, 3,300 sophomores, 2,700
juniors and 1,800 seniors. Plan a stratified sample of 400 with proportional allocation.

1. Sampling fraction: $400/12{,}000 = 1/30$.
2. First-years: $4200/30 = 140$; sophomores $110$; juniors $90$; seniors $60$.
3. Check: $140 + 110 + 90 + 60 = 400$. Then take an SRS of the given size within each
   class year.

### Example 2

An inspector wants a 1-in-$k$ systematic sample of 50 welds from a line of 1,000 welds.

1. $k = 1000/50 = 20$.
2. Choose a random start between 1 and 20 — say 13.
3. Inspect welds 13, 33, 53, …, 993 (that is $13 + 20j$ for $j = 0, \dots, 49$).

## Bias in surveys

Even a random sample can produce biased results:

- **Undercoverage**: some groups are left out of the frame (people without phones or
  internet, people experiencing homelessness).
- **Nonresponse bias**: chosen individuals can't be reached or refuse, and nonresponders
  differ from responders. Response rates under 20% are common for phone polls.
- **Response bias**: answers are systematically inaccurate — people overstate voting and
  understate drinking; an interviewer's tone or appearance influences answers.
- *Wording of questions*: "Do you support the reckless plan to raise fares?" pushes
  answers. Loaded words, double negatives and questions that ask two things at once all
  distort results.

Random sampling protects against *selection* bias but not against these.

## Sampling variability

Different random samples give different results — this is **sampling variability**, and
it is not bias. Larger random samples vary less. The rest of the course measures this
variability precisely (margins of error). The goal is a method that is *unbiased* (right
on average) *and* has low variability (consistent from sample to sample).

## Common mistakes

- Calling any sample "random" because no one deliberately chose who's in it — a
  convenience sample is not random.
- Thinking a bigger sample fixes bias.
- Mixing up strata and clusters: you sample *within* every stratum but take *all* of a
  few clusters.
- Describing bias vaguely. Say which direction the estimate would likely be off and why.

## Key points

- Convenience and voluntary response samples are biased; random sampling avoids selection bias.
- SRS: every set of $n$ equally likely. Stratified: SRS within each similar group.
  Cluster: all members of randomly chosen groups. Systematic: every $k$th after a random start.
- Proportional allocation: stratum sample size $= n \times$ (stratum size ÷ $N$).
- Undercoverage, nonresponse, response bias and question wording can bias even random samples.
- Sampling variability is chance variation; larger samples reduce it, but don't reduce bias.
