---
id: bio-method
module: bio-m1
title: 'How biologists know: experiments, data, and theories'
minutes: 30
topics: [Scientific method, Experimental design]
drills: [bio-percent-change, bio-mean-data]
refs: [bio-ref-lab]
---
## From "what is life" to "how do we know"

The last lesson listed what living things have in common. Every one of those statements was established by evidence: observations, experiments and measurements that other people could check. This lesson is about that process. You will learn how to design a fair experiment, how to read and summarize its data, and what scientists mean (and don't mean) by the words hypothesis, theory and law. These skills come back in every module, because a large part of this course is reading the data from classic experiments and deciding what they show.

## Observations, questions and hypotheses

Science starts with an observation that raises a question. In the 1600s most people believed that maggots arose from rotting meat by "spontaneous generation": life appearing from nonliving matter. The Italian physician Francesco Redi noticed that flies hovered around meat before maggots appeared, and he asked whether the maggots came from the flies.

A **hypothesis** is a proposed, testable explanation for an observation. Redi's hypothesis: maggots develop from eggs laid by flies, not from the meat itself. A good hypothesis makes a prediction you could check, often written as "if…then": *if* maggots come from fly eggs, *then* meat that flies cannot reach will not develop maggots.

Notice what a hypothesis must be: testable and falsifiable, meaning some possible result would show it is wrong. "Maggots come from an undetectable life force" cannot be tested, so it is not a scientific hypothesis.

## Designing a controlled experiment

Redi's experiment (1668) is a model of good design. He put pieces of meat in jars. Some jars were left open; others were covered with fine gauze that let air in but kept flies out. Maggots appeared on the meat in the open jars. In the covered jars no maggots appeared on the meat, though flies laid eggs on the gauze itself.

Every controlled experiment has the same parts.

- The **independent variable** is the one factor the experimenter deliberately changes. For Redi: whether flies can reach the meat (open jar or gauze).
- The **dependent variable** is what is measured to see the effect. For Redi: whether maggots appear on the meat.
- A **controlled variable** (also called a constant) is anything else that could affect the result, kept the same in every group. Redi used the same kind of meat, similar jars and the same room and time. The gauze still let air in, so "lack of air" could not explain the difference, which answered critics who said sealed jars lacked a "vital" air.
- The **control group** is the group used as a baseline for comparison, usually the normal or untreated condition (here, the open jars). The experimental group gets the treatment being tested.

The logic: if the groups differ in only one way, then a difference in the results must be caused by that one factor. Change two things at once and you cannot tell which caused the effect.

Two more features make results trustworthy. *Replication* means using many individuals or repeating trials, because living things vary; one plant that grows tall might just be a big plant. *Sample size* is how many individuals are in each group. Larger samples make it less likely that a difference is just chance.

### Example 1: Identify the parts

A student wants to know whether a fertilizer helps bean plants grow. She plants 20 bean seeds in identical pots with the same soil. Ten get 50 mL of water with fertilizer each day; ten get 50 mL of plain water. All pots sit on the same windowsill. After three weeks she measures each plant's height.

- Independent variable: whether the water contains fertilizer.
- Dependent variable: plant height after three weeks.
- Controlled variables: type of seed, pot, soil, volume of water, light (same windowsill), length of time.
- Control group: the ten plants given plain water.
- Experimental group: the ten plants given fertilizer.
- Replication: ten plants per group rather than one.

A common slip is to call the plain-water group "controlled variables." Controlled variables are factors held constant; the control group is a set of individuals.

## Summarizing data: means and percent change

Raw data are the individual measurements. To compare groups, we summarize them. The *mean* (average) is the sum of the values divided by how many there are:

$$\text{mean} = \frac{\text{sum of values}}{\text{number of values}}$$

To describe how much something changed relative to where it started, use *percent change*:

$$\text{percent change} = \frac{\text{new} - \text{original}}{\text{original}} \times 100\%$$

A positive result is an increase, a negative one a decrease. Always divide by the original value, not the new one.

### Example 2: Analyze the fertilizer data

Five of the plants in each group (heights in cm):

| Group | Plant 1 | Plant 2 | Plant 3 | Plant 4 | Plant 5 |
|---|---|---|---|---|---|
| Plain water | 12 | 15 | 14 | 11 | 13 |
| Fertilizer | 18 | 16 | 19 | 17 | 20 |

*Step 1: means.* Plain water: $(12 + 15 + 14 + 11 + 13)/5 = 65/5 = 13$ cm. Fertilizer: $(18 + 16 + 19 + 17 + 20)/5 = 90/5 = 18$ cm.

*Step 2: percent change.* Taking the control mean as the original:

$$\frac{18 - 13}{13} \times 100\% = \frac{5}{13} \times 100\% \approx 38\%$$

*Step 3: look at the spread.* The control heights run 11–15 cm and the fertilizer heights 16–20 cm. The ranges do not overlap, so the difference is unlikely to be chance. If the ranges overlapped a lot, the difference in means would be much less convincing. (Scientists use statistical tests to make this judgment precise; Module 5 introduces one, the chi-square test.)

*Step 4: graph it.* For comparing groups, a bar graph of the means works well; for a variable that changes continuously (like height over many days) a line graph is better. The independent variable goes on the x-axis and the dependent variable on the y-axis.

```plot
{"x": [0, 3], "y": [0, 22], "xLabel": "treatment", "yLabel": "mean height (cm)", "bars": [{"x": 1, "height": 13, "width": 0.6, "label": "plain water"}, {"x": 2, "height": 18, "width": 0.6, "label": "fertilizer"}], "caption": "Mean height of bean plants after three weeks"}
```

*Conclusion:* in this experiment, plants given fertilizer grew about 38% taller on average. That supports the hypothesis that the fertilizer increases growth under these conditions. Note the careful wording: data *support* a hypothesis; they never prove it for all conditions.

## Correlation is not causation

Some questions cannot be tested with a controlled experiment, for ethical or practical reasons. Biologists then use observational studies: they measure variables in a population and look for patterns. If two variables rise and fall together they are *correlated*. But correlation alone does not show that one causes the other. Ice cream sales and sunburns are correlated because both rise in summer; ice cream does not cause sunburn. A third, hidden variable (here, sunny weather) can drive both. Controlled experiments, where only one factor differs between groups, are the strongest way to show cause and effect.

### Example 3: Spot the flaw

A student tests whether music helps plants grow. She plays music to plants on a sunny windowsill and keeps a second group, with no music, in a dim closet. The music group grows more. What can she conclude?

Nothing about music. The groups differ in two ways: music and light. Light is a known cause of plant growth, so it could explain the whole result. To fix the design, keep both groups in the same light (and temperature, water and soil), and vary only the music. She should also use several plants per group.

## Hypothesis, theory and law

These three words have specific meanings in science that differ from everyday speech.

- A hypothesis is a testable explanation for a specific observation, before much evidence is in.
- A **theory** is a broad, well-tested explanation that ties together many observations and hypotheses and has survived repeated attempts to disprove it. Cell theory, the theory of evolution and germ theory are among the best-supported ideas in all of science. In everyday speech "theory" means a guess; in science it means close to the opposite.
- A scientific law *describes* a pattern, often as a mathematical relationship, without explaining why it happens. Mendel's law of segregation describes how traits are passed on; the chromosome theory of inheritance explains why.

Theories do not "graduate" into laws with more evidence. They do different jobs: laws describe, theories explain. Both remain open to revision if new evidence demands it, which is a strength of science, not a weakness.

Science is also a community process. Scientists publish their methods and data so that others can repeat the work, and journals use *peer review*, in which other experts check a study before it is published. A result that other labs cannot reproduce is not accepted, however exciting.

## Common mistakes

- *Changing more than one variable.* Then you cannot tell which change caused the effect.
- *Confusing the control group with controlled variables.* The control group is a baseline set of subjects; controlled variables are conditions kept the same.
- *Dividing by the new value in percent change.* Always divide by the original.
- *Saying data "prove" a hypothesis.* Data support or fail to support it.
- *Treating "theory" as "guess."* A scientific theory is a well-tested explanation.
- *Assuming correlation means causation.* A third variable may drive both.

## Key points

- A **hypothesis** is a testable, falsifiable explanation; it leads to an "if…then" prediction.
- In a controlled experiment, only the **independent variable** differs between groups; the **dependent variable** is measured; **controlled variables** are kept constant; the **control group** is the baseline.
- Replication and larger samples make results more reliable.
- Mean = sum / count. Percent change = (new − original) / original × 100%.
- Correlation does not show causation; controlled experiments can.
- A **theory** is a broad, well-supported explanation; a law describes a pattern. Neither is a guess.
