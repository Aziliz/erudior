---
id: stat-m4-h-survey-estimation
module: stat-m4
honors: true
title: Estimating from complex samples
minutes: 45
topics: [Survey estimation]
drills: [stat-m4-r2-strat-estimate, stat-m4-r2-neyman, stat-m4-r2-design-effect]
refs: [stat-ref-which-test]
---
## From choosing a sample to using it

Lesson 16 showed how to *choose* a stratified, cluster or multistage sample. Real surveys
(government labor-force surveys, election polls, health surveys) almost never use a simple
random sample, so the next question is how to *use* the data. If you take a stratified sample and
then average all the answers as if it were an SRS, you can get the wrong number. If you take a
cluster sample and report the SRS margin of error, you will claim more precision than you have.
This lesson covers the three ideas professional survey statisticians use every day: sampling
weights, choosing how many to sample from each stratum, and the design effect of clustering.
It ends with weighting for nonresponse, and with the 1936 poll that taught everyone why weighting
can't fix everything.

## Sampling weights

When strata are sampled at different rates, each person in the sample stands for a different
number of people in the population. The **sampling weight** of a sampled individual is

$$w = \frac{\text{number in the stratum}}{\text{number sampled from the stratum}} = \frac{N_h}{n_h},$$

the number of population members that person represents. A weighted estimate of a population
mean or proportion is the weighted mean of the responses:

$$\hat{p}_{\text{weighted}} = \frac{\sum w\,y}{\sum w},$$

where $y$ is each person's response (1 or 0 for a proportion). Collecting terms stratum by stratum
gives the same thing in a handier form: weight each stratum's own sample result by that
stratum's share of the population,

$$\hat{p}_{\text{st}} = \sum_h \frac{N_h}{N}\,\hat{p}_h.$$

With proportional allocation every weight is the same ($N/n$), so the weighted and unweighted
answers agree. That is why lesson 16's examples never needed weights.

Why sample strata at different rates at all? Usually to get enough people from a small group to
say something about that group. Deliberately taking a larger share of a small stratum than its
population share is called **oversampling**. National health surveys, for example, often
oversample smaller ethnic groups or older adults so that each group's own estimate is precise.
The price is that the overall estimate must be weighted.

### Example 1: weighting an oversampled survey

A county has 40,000 households in its urban zone and 10,000 in its rural zone. A broadband
survey samples 200 households from each zone. In the urban sample 180 have broadband; in the
rural sample 110 do. Estimate the proportion of all county households with broadband.

1. Unweighted (wrong): $(180 + 110)/400 = 0.725$.
2. Weights: urban $40{,}000/200 = 200$; rural $10{,}000/200 = 50$. Each urban household in the
   sample stands for 200 households, each rural one for only 50.
3. Stratum results: $\hat{p}_U = 180/200 = 0.90$ and $\hat{p}_R = 110/200 = 0.55$.
4. Weighted: $\hat{p}_{\text{st}} = 0.8(0.90) + 0.2(0.55) = 0.72 + 0.11 = 0.83$.

```shape
{"bars": [{"x": 1, "height": 8, "width": 1.1, "label": "county"}, {"x": 2.3, "height": 5, "width": 1.1, "label": "sample"}, {"x": 4.6, "height": 2, "width": 1.1, "label": "county"}, {"x": 5.9, "height": 5, "width": 1.1, "label": "sample"}], "segments": [{"from": [0, 0], "to": [6.9, 0]}], "labels": [{"at": [1, 8.5], "text": "80%"}, {"at": [2.3, 5.5], "text": "50%"}, {"at": [4.6, 2.5], "text": "20%"}, {"at": [5.9, 5.5], "text": "50%"}, {"at": [1.65, -1.4], "text": "Urban zone"}, {"at": [5.25, -1.4], "text": "Rural zone"}], "caption": "Each zone's share of the county's households and of the sample. Rural households are 20% of the county but 50% of the sample, so each one gets a smaller weight."}
```

The unweighted figure is too low because rural households, who are less likely to have
broadband, make up half the sample but only a fifth of the county. The oversampling pays off in
the rural estimate itself: its standard error is $\sqrt{0.55(0.45)/200} \approx 0.035$, against
about $0.056$ if only the proportional 80 rural households had been sampled.

## How precise is a stratified estimate?

Because the strata are sampled independently, the variances add (lesson 25 shows why). With
stratum weights $W_h = N_h/N$, the standard error of a stratified proportion is

$$SE(\hat{p}_{\text{st}}) = \sqrt{\sum_h W_h^2\,\frac{\hat{p}_h(1-\hat{p}_h)}{n_h}}$$

(ignoring the small correction for sampling a large share of a stratum). In Example 1 this gives
about 0.0184. A proportional design with 320 urban and 80 rural households would give about
0.0174, and an SRS of 400 about 0.0188 if the true proportion is near 0.83. The stratified
designs win because no part of their error comes from how many urban versus rural households
happen to land in the sample. Oversampling the rural zone cost a little overall precision and
bought a much better rural estimate. Which matters more is a decision about purpose, not a
calculation.

## Optimal allocation

If the goal is the single most precise overall estimate for a fixed sample size, how should you
split $n$ among the strata? The answer, usually called **Neyman allocation** after Jerzy Neyman's
1934 paper on survey sampling (Alexander Chuprov had found it about a decade earlier), is

$$n_h = n \cdot \frac{N_h S_h}{\sum_k N_k S_k},$$

where $S_h$ is the standard deviation of the variable within stratum $h$. Big strata get more,
as in proportional allocation, but so do *variable* strata: where everyone is alike, a few
observations pin down the mean; where people differ a lot, you need many. If interviews cost
different amounts in different strata, the rule becomes $n_h \propto N_h S_h/\sqrt{c_h}$, so
expensive strata get fewer. In practice the $S_h$ are guesses from a pilot study or an earlier
survey, so the allocation is only as good as those guesses.

### Example 2: Neyman allocation

A railroad wants the mean yearly maintenance cost of its 800 bridges: 600 small ones (standard
deviation of cost about \$2,000) and 200 large ones (standard deviation about \$12,000). It can
inspect the records of 90 bridges.

1. $N_h S_h$: small $600 \times 2{,}000 = 1{,}200{,}000$; large $200 \times 12{,}000 = 2{,}400{,}000$; total $3{,}600{,}000$.
2. Small: $90 \times 1.2/3.6 = 30$. Large: $90 \times 2.4/3.6 = 60$.
3. Compare with proportional allocation (67.5 and 22.5; use the unrounded sizes to compare). With $W = 0.75$ and $0.25$,
   $SE^2 = W_1^2 S_1^2/n_1 + W_2^2 S_2^2/n_2$:
   - proportional: $0.5625(2000^2)/67.5 + 0.0625(12000^2)/22.5 \approx 433{,}333$, so $SE \approx \$658$;
   - Neyman: $0.5625(2000^2)/30 + 0.0625(12000^2)/60 = 225{,}000$, so $SE \approx \$474$.

Putting most of the sample where costs vary most cut the standard error by about 28% at no
extra cost. The large bridges are only a quarter of the population but two thirds of the sample,
so here too the estimate must be weighted.

## The price of clusters: the design effect

Cluster samples are cheap, but people in the same cluster tend to be alike: students in one
classroom share a teacher, households on one block share a neighborhood. Twenty-five students
from one classroom tell you less than 25 students scattered across a district.

The **design effect** measures this:

$$\text{deff} = \frac{\text{variance of the estimate under the actual design}}{\text{variance under an SRS of the same size}}.$$

For clusters of equal size $m$, Leslie Kish's widely used approximation is

$$\text{deff} \approx 1 + (m - 1)\rho,$$

where $\rho$ is the **intraclass correlation**: how similar members of the same cluster are,
from 0 (no more alike than strangers) up to 1 (identical). The **effective sample size**
$n/\text{deff}$ is the size of the SRS that would give the same precision. Small $\rho$ values
matter a lot when clusters are big, because $\rho$ is multiplied by $m - 1$.

```plot
{"x": [1, 50], "y": [0, 7], "xLabel": "cluster size m", "yLabel": "design effect", "functions": [{"f": "1 + (x-1)*0.02", "label": "ρ = 0.02"}, {"f": "1 + (x-1)*0.05", "label": "ρ = 0.05", "dashed": true}, {"f": "1 + (x-1)*0.10", "label": "ρ = 0.10"}], "points": [{"at": [25, 2.2]}], "labels": [{"at": [25, 1.75], "text": "2.2"}], "caption": "The approximate design effect 1 + (m − 1)ρ grows with cluster size, faster when members of a cluster are more alike. The marked point is m = 25, ρ = 0.05, deff = 2.2."}
```

### Example 3: a classroom survey

A district surveys all 25 students in each of 40 randomly chosen classrooms, so $n = 1{,}000$.
For a question about liking math, past surveys suggest $\rho \approx 0.05$.

1. $\text{deff} \approx 1 + 24(0.05) = 2.2$.
2. Effective sample size: $1{,}000/2.2 \approx 455$ students.
3. A 95% margin of error for a proportion near 0.5 would be $1.96\sqrt{0.25/1000} \approx 0.031$
   for an SRS of 1,000, but multiply by $\sqrt{2.2} \approx 1.48$: about $0.046$.

Reporting "±3.1 points" would overstate the precision: the honest margin is about half again as large (±4.6). The cluster design may still be the
right choice, because visiting 40 classrooms is far cheaper than finding 1,000 students in 1,000
places; the design effect just makes the trade honest.

Stratified samples usually have a design effect *below* 1, because stratifying removes part of
the variation. Cluster samples usually have one *above* 1. Large surveys that use both, plus
weights, compute their margins of error with special software rather than the SRS formula.

## Weighting for nonresponse

Weights can also correct for *who answered*. In **post-stratification**, respondents are grouped
by a variable whose population distribution is known from a census (age group, sex, region),
and each group is weighted by

$$\text{weight} = \frac{\text{population share of the group}}{\text{sample share of the group}}.$$

### Example 4: reweighting a poll by age

A poll of 300 adults has 120 respondents aged 18–44 (40%) and 180 aged 45 or older (60%), but
census figures say the adult population is 55% and 45%. Support for a new transit tax is 70%
among the younger respondents and 40% among the older.

1. Unweighted: $(84 + 72)/300 = 0.52$.
2. Weights: younger $0.55/0.40 = 1.375$; older $0.45/0.60 = 0.75$.
3. Weighted: $0.55(0.70) + 0.45(0.40) = 0.385 + 0.18 = 0.565$.

Weighting moved the estimate from 52% to about 57%, because the poll reached too few younger
adults. But this only works if, *within each age group*, the people who answered resemble the
people who didn't. If younger people who answer polls are unusually interested in transit,
weighting by age can't detect or fix it. Weighting repairs imbalance on the variables you weight
by and nothing else.

## A cautionary history: 1936

In 1936 the *Literary Digest* mailed about 10 million straw ballots, mostly to people on lists of
telephone and car owners and its own subscribers, and got about 2.4 million back. It predicted
that Alf Landon would beat Franklin Roosevelt with about 57% of the vote. Roosevelt won with
about 61% of the popular vote. Two problems combined: the frame overrepresented better-off
households, and fewer than a quarter of those mailed a ballot returned it. Analysts still debate
how much each one mattered; several later studies point to nonresponse as the larger one. George
Gallup's much smaller quota-based poll got the winner right. The lesson that survives is the one
from lesson 16: a huge sample from a flawed process is still biased, and no amount of arithmetic
afterward can recover people who were never in the frame or never answered.

## Common mistakes

- Averaging all responses from a disproportionate stratified sample without weights.
- Using the SRS margin of error for a cluster sample, which makes results look more precise than they are.
- Thinking Neyman allocation is always proportional allocation; it also depends on each stratum's variability.
- Believing that weighting removes nonresponse bias in general. It only fixes imbalance on the weighting variables.
- Treating a weight as a measure of how important a person's answer is. It is how many people they represent.

## Key points

- Sampling weight $= N_h/n_h$: the number of population members a sampled person represents.
- Stratified estimate: $\hat{p}_{\text{st}} = \sum (N_h/N)\,\hat{p}_h$, with $SE = \sqrt{\sum W_h^2\,\hat{p}_h(1-\hat{p}_h)/n_h}$.
- Neyman allocation: $n_h \propto N_h S_h$; sample more where strata are large *and* variable.
- Design effect: $\text{deff} \approx 1 + (m-1)\rho$ for clusters of size $m$; effective sample size $= n/\text{deff}$.
- Post-stratification reweights respondents to match known population shares, but it can't fix
  bias that isn't explained by the weighting variables.
