---
id: stat-simulation
module: stat-m5
title: Simulation
minutes: 30
topics: [Simulation]
drills: [stat-sim-digits, stat-sim-trials, stat-sim-pvalue]
refs: [stat-ref-probability, stat-ref-inference]
---
## When the formula is hard to find

The last lesson defined probability as a long-run proportion and proved a few rules for
computing it. Many real questions, though, are awkward to attack with rules: the chance that
a commuter train is on time at least 4 days out of 5, the chance a random committee contains
two or more seniors, the chance a sample result this lopsided happens by luck alone. The
long-run definition suggests a different route. If we can *imitate* the random process
cheaply, we can repeat it many times and simply count. That is a **simulation**, and it is
also the cleanest way to see the reasoning behind every significance test later in the
course.

## The four steps

A simulation is only as good as its model, so it helps to follow a fixed routine.

1. *State* the question: what chance process, and which event's probability you want.
2. *Plan* the model. Say how random numbers stand for outcomes, so that each outcome gets
   the right probability. Say what one **simulation trial** is (one complete run of the
   process) and what you record from it.
3. *Do* many trials, recording the result of each.
4. *Conclude*: the proportion of trials in which the event happened estimates the
   probability. Answer the question in context.

The Plan step is where simulations go wrong, so it deserves the most care.

## Random digits and random number generators

A **table of random digits** is a long list of the digits 0–9 in which every position is
equally likely to be any digit and positions are independent of one another. A
**random number generator** (a calculator's `randInt`, a spreadsheet's `RAND`, software)
does the same job faster. Both give you building blocks with known probabilities.

- *One digit* gives ten equally likely outcomes, so it handles probabilities in tenths.
  For $P(\text{success}) = 0.7$, let 0–6 be a success and 7–9 a failure: 7 of the 10
  digits, probability 0.7.
- *Two digits* read together give the hundred labels 00–99, which handle probabilities in
  hundredths. For $P(\text{defect}) = 0.13$, let 00–12 be a defect and 13–99 not.
- *Unequal label sets.* For six equally likely outcomes (a die), use digits 1–6 and
  *ignore* 0, 7, 8 and 9. Skipping unused digits keeps the six that count equally likely.
- *Without replacement.* When the same individual can't be picked twice (choosing people,
  dealing cards), skip any label that has already appeared in the current trial.

Whatever the assignment, write it down explicitly. "Use random digits" is not a plan;
"0–6 = on time, 7–9 = late, read 5 digits per trial" is.

### Example 1: on time at least 4 days out of 5

A commuter train is on time on 70% of weekdays, independently from day to day. Estimate the
probability that it is on time on at least 4 of the 5 days in a week.

*Plan.* One digit per day: 0–6 = on time, 7–9 = late. One trial = 5 digits (one week).
Record whether 4 or more of the 5 digits are in 0–6.

*Do.* Here are 50 random digits, split into 10 trials:

$$\texttt{15881 \; 39986 \; 98797 \; 30911 \; 41707 \; 53645 \; 56815 \; 18844 \; 72940 \; 55761}$$

Count the on-time digits (0–6) in each week: 15881 has 1, 5, 1 on time and the two 8s late,
so 3 on time. The counts for all ten weeks are 3, 2, 0, 4, 3, 5, 4, 3, 3, 4. The weeks with 4 or more are the
4th, 6th, 7th and 10th.

*Conclude.* 4 of the 10 simulated weeks had at least 4 on-time days, so the estimate is
$4/10 = 0.4$.

That estimate is rough. The exact answer (you'll be able to compute it with the binomial
model in lesson 26) is about 0.528. Ten trials can easily miss by that much, which is why real
simulations use hundreds or thousands of trials, usually on a computer.

## How many trials?

A simulation estimate is itself a sample proportion, so it varies from one run to the
next. The law of large numbers promises that it settles toward the true probability as the
number of trials grows. As a working guide, 100 trials usually land within about 0.10 of the
truth, while 1,000 trials typically land within about 0.03.

```plot
{"x": [0, 1050], "y": [0.3, 0.8], "xLabel": "number of trials", "yLabel": "proportion of trials with 4+ on time", "functions": [{"f": "0.528", "dashed": true}], "segments": [{"from": [10, 0.7], "to": [20, 0.6]}, {"from": [20, 0.6], "to": [30, 0.633]}, {"from": [30, 0.633], "to": [40, 0.6]}, {"from": [40, 0.6], "to": [50, 0.58]}, {"from": [50, 0.58], "to": [60, 0.517]}, {"from": [60, 0.517], "to": [80, 0.512]}, {"from": [80, 0.512], "to": [100, 0.52]}, {"from": [100, 0.52], "to": [125, 0.544]}, {"from": [125, 0.544], "to": [150, 0.56]}, {"from": [150, 0.56], "to": [200, 0.56]}, {"from": [200, 0.56], "to": [250, 0.568]}, {"from": [250, 0.568], "to": [300, 0.557]}, {"from": [300, 0.557], "to": [400, 0.562]}, {"from": [400, 0.562], "to": [500, 0.552]}, {"from": [500, 0.552], "to": [600, 0.555]}, {"from": [600, 0.555], "to": [700, 0.544]}, {"from": [700, 0.544], "to": [800, 0.54]}, {"from": [800, 0.54], "to": [900, 0.539]}, {"from": [900, 0.539], "to": [1000, 0.529]}], "caption": "Running estimate from one simulation of 1,000 trials: wild at first, then settling near 0.528", "labels": [{"at": [800, 0.495], "text": "true value 0.528"}]}
```

More trials make the estimate more precise, but they cannot fix a wrong model. If the
digits were assigned so that "on time" had probability 0.6 instead of 0.7, a million trials
would converge confidently to the wrong number.

### Example 2: choosing without replacement

A crew has 10 workers, 4 of them from the night shift. Three workers are picked at random
for a safety audit. Estimate the probability that at least 2 of the 3 are from the night
shift.

*Plan.* Label the workers 0–9, with 0–3 the night-shift workers. One trial = read digits
until 3 *different* labels appear (skip a repeat, because a worker can't be chosen twice).
Record whether at least 2 of the 3 labels are in 0–3.

*Do.* Digits: 01152 44939 0926.

- Trial 1: 0, 1, (1 repeat, skip), 5 → workers 0, 1, 5: two night-shift. Yes.
- Trial 2: 2, 4, (4 repeat, skip), 9 → 2, 4, 9: one night-shift. No.
- Trial 3: 3, 9, 0 → two night-shift. Yes.
- Trial 4: 9, 2, 6 → one night-shift. No.

*Conclude.* 2 of 4 trials, an estimate of 0.5. Four trials show the method, not the
answer: a computer run of 1,000 trials gave 328 successes, an estimate of 0.328. The exact
value from counting (lesson 23) is $40/120 = 1/3$. Notice that if repeats had *not* been
skipped, a trial like 0, 1, 1 would have counted worker 1 twice, which is a different
(and wrong) model.

## Simulation-based inference

Simulation can also answer "Is this result surprising?" The idea runs as follows.

1. Assume a specific model of how the data arose, usually "nothing special is going on."
   This is the **null model**.
2. Simulate many data sets from that model and compute the same statistic for each.
3. See where the actual observed statistic falls. If results at least as extreme as the
   observed one are rare in the simulation (as a rough guide, under 5% of trials), the
   observed result is hard to explain by chance under the model, so we have convincing
   evidence against the model. If such results are common, chance is a plausible
   explanation.

The proportion of simulated results at least as extreme as the observed one estimates what
lesson 33 calls the p-value. Using simulation this way is **simulation-based inference**.

### Example 3: is a 27-out-of-40 result convincing?

An app maker's designers say customers are evenly split between the old and new screen
layouts. In a random sample of 40 customers, 27 preferred the new layout. Is that convincing
evidence that more than half of all customers prefer it?

*Plan.* Null model: each customer prefers the new layout with probability 0.5. One trial
= 40 coin flips (or 40 random digits with 0–4 = new layout); record the number preferring
the new layout. Repeat 200 times.

*Do.* The simulated counts:

```plot
{"x": [10, 37], "y": [-3, 30], "xLabel": "count (of 40)", "yLabel": "number of simulated samples", "bars": [{"x": 12, "height": 1, "width": 0.8}, {"x": 13, "height": 1, "width": 0.8}, {"x": 14, "height": 5, "width": 0.8}, {"x": 15, "height": 10, "width": 0.8}, {"x": 16, "height": 11, "width": 0.8}, {"x": 17, "height": 11, "width": 0.8}, {"x": 18, "height": 26, "width": 0.8}, {"x": 19, "height": 20, "width": 0.8}, {"x": 20, "height": 23, "width": 0.8}, {"x": 21, "height": 25, "width": 0.8}, {"x": 22, "height": 20, "width": 0.8}, {"x": 23, "height": 13, "width": 0.8}, {"x": 24, "height": 10, "width": 0.8}, {"x": 25, "height": 16, "width": 0.8}, {"x": 26, "height": 5, "width": 0.8}, {"x": 27, "height": 1, "width": 0.8, "color": "#c2570c"}, {"x": 28, "height": 1, "width": 0.8, "color": "#c2570c"}, {"x": 29, "height": 1, "width": 0.8, "color": "#c2570c"}], "segments": [{"from": [26.5, 0], "to": [26.5, 28], "dashed": true}], "labels": [{"at": [30.5, 8], "text": "observed: 27"}], "caption": "200 simulated samples of 40 customers when p = 0.5; only 3 reach 27 or more"}
```

The simulated counts center near 20, as they should when $p = 0.5$. Only 3 of the 200
trials gave 27 or more.

*Conclude.* If customers really were evenly split, a sample with 27 or more preferring
the new layout would happen only about $3/200 = 0.015$ of the time. That is rare, so the
sample gives convincing evidence that more than half of customers prefer the new layout.
"At least as extreme" means 27 *or more*, in the direction of the claim being checked;
counting only exactly 27 would understate how unusual the result is in general.

### Randomization tests for experiments

The same logic works for experiments. Suppose 20 volunteers are randomly split into two
groups of 10 and the group given a new training method improves by 4.1 points more on
average. If the method had no effect, each person's improvement would have been the same
whichever group they landed in, so the 4.1 would just reflect which people happened to be
assigned where. To check, shuffle the 20 improvements into two new groups of 10 many times,
recording the difference in means each time. This is a **randomization test**. If, say, only
12 of 1,000 shuffles give a difference of 4.1 or more, the observed difference is unlikely
to be a fluke of the random assignment, and the method likely helps.

## Common mistakes

- Assigning digits that give the wrong probabilities, such as 0–7 for a probability of 0.7
  (that is 8 digits, probability 0.8).
- Forgetting to skip repeats when sampling without replacement, or skipping them when
  selections are independent.
- Not saying what one trial is or what is recorded, so the "Do" step can't be checked.
- Running a handful of trials and treating the estimate as exact.
- Using "exactly the observed value" instead of "at least as extreme" when judging whether
  a result is surprising.
- Concluding that the null model is *true* because the observed result was common in the
  simulation. It only means chance is a plausible explanation.

## Key points

- Simulation: State, Plan (assign random numbers to outcomes, define a trial), Do many
  trials, Conclude with the proportion of trials where the event happened.
- One digit handles tenths, two digits handle hundredths; ignore unused labels; skip
  repeats when sampling without replacement.
- Estimates improve with more trials (law of large numbers), but only if the model is right.
- Simulation-based inference: simulate under a null model; if results at least as extreme
  as the observed one are rare, that is convincing evidence against the model.
