---
id: stat-m4-h-factorial
module: stat-m4
honors: true
title: Factorial experiments and interaction
minutes: 40
topics: [Factorial experiments]
drills: [stat-m4-r2-main-effects, stat-factorial-design]
refs: [stat-ref-which-test]
---
## Two factors at once

Lesson 17 counted the treatments in a multifactor experiment: three fertilizer amounts and two
watering schedules make $3 \times 2 = 6$ treatments. It didn't say why anyone would study two
factors in one experiment instead of running two simpler experiments, or how to read the results.
This lesson does both. An experiment that uses every combination of the levels of two or more
factors is a **factorial design**. Its great advantage is that it can show an **interaction**:
the effect of one factor depending on the level of another. One-factor-at-a-time studies can
never show that.

Ronald Fisher developed these ideas for agricultural field trials at the Rothamsted Experimental
Station in England in the 1920s, and argued for them in *The Design of Experiments* (1935). Asking
about several factors at once, he showed, is both more efficient and more informative than asking
one question at a time.

## Main effects

Take the simplest case, a $2 \times 2$ design: factor A and factor B, each at two levels, so four
treatments. Arrange the mean responses in a table with one row per level of A and one column
per level of B.

The **main effect** of a factor is the change in the mean response when that factor moves from
its first level to its second, *averaged over the levels of the other factor*:

$$\text{main effect of A} = (\text{mean of the A-high row}) - (\text{mean of the A-low row}).$$

Each row mean averages two treatment means, so every unit in the experiment helps estimate the
main effect of A, and every unit also helps estimate the main effect of B. In a factorial
experiment with 40 subjects and 10 per treatment, each main effect compares 20 subjects with 20
other subjects. This reuse is sometimes called *hidden replication*: you get two experiments for
the price of one.

## Interaction

The effect of A *at a single level* of B is a **simple effect**. If the simple effects of A are
the same at both levels of B, the factors act independently and the main effect tells the whole
story. If they differ, there is an interaction. In this course we measure it as a
"difference of differences":

$$\text{interaction} = (\text{effect of A when B is high}) - (\text{effect of A when B is low}).$$

(Many engineering texts call half of this the interaction effect; either way, zero means no
interaction.) The measure is symmetric: the effect of B also changes by exactly the same amount
between the levels of A, so it doesn't matter which factor you call A.

An **interaction plot** shows this at a glance. Put one factor's levels on the horizontal axis, plot
the mean response, and draw one line for each level of the other factor. Parallel lines mean no
interaction; lines that converge, diverge or cross mean an interaction. With real data, lines are
never exactly parallel, because means vary by chance; deciding whether a gap is bigger than chance
needs a significance test (two-way ANOVA, a college topic).

### Example 1: practice quizzes and spacing

Forty volunteer students are randomly assigned, 10 per group, to four study plans for a vocabulary
test: material studied in one session (massed) or spread over four days (spaced), with or
without practice quizzes. The mean scores (made-up data) are:

| | No quizzes | Quizzes |
|---|---|---|
| **Massed** | 62 | 70 |
| **Spaced** | 66 | 82 |

1. Main effect of quizzes: column means are $(62 + 66)/2 = 64$ and $(70 + 82)/2 = 76$, so $76 - 64 = 12$ points.
2. Main effect of spacing: row means are $(62 + 70)/2 = 66$ and $(66 + 82)/2 = 74$, so $74 - 66 = 8$ points.
3. Simple effects of quizzes: massed $70 - 62 = 8$; spaced $82 - 66 = 16$.
4. Interaction: $16 - 8 = 8$ points. Check from the other side: spacing helps by $66 - 62 = 4$ without
   quizzes and by $82 - 70 = 12$ with them, and $12 - 4 = 8$ again.

Quizzes help more when study is spaced, so the two work better together than either suggests alone.

```plot
{"x": [-0.3, 1.3], "y": [55, 90], "xLabel": "practice quizzes (0 = no, 1 = yes)", "yLabel": "mean score", "functions": [{"f": "62 + 8*x", "from": 0, "to": 1, "label": "massed"}, {"f": "66 + 16*x", "from": 0, "to": 1, "label": "spaced", "dashed": true}], "points": [{"at": [0, 62]}, {"at": [1, 70]}, {"at": [0, 66]}, {"at": [1, 82]}], "caption": "Interaction plot for Example 1: the lines are not parallel, because quizzes add 8 points to massed study and 16 to spaced study"}
```

## Why not one factor at a time?

The intuitive plan is to vary one factor while holding the others fixed, find its best level, then
move on. This **one-factor-at-a-time** (OFAT) approach has two weaknesses.

1. *It wastes units.* Each comparison uses only the units at the fixed settings, so each effect is
   estimated from fewer observations than in a factorial design of the same total size.
2. *It can't see interactions*, so it can predict the wrong result for combinations it never tried.

### Example 2: what OFAT would have concluded

Suppose a researcher with the same four true means as Example 1 starts at massed study with no
quizzes (62).

1. Vary quizzes, holding massed study: $70 - 62 = 8$, so quizzes are worth 8 points.
2. Vary spacing, holding no quizzes: $66 - 62 = 4$, so spacing is worth 4 points.
3. Predict spaced study with quizzes: $62 + 8 + 4 = 74$.

The true mean for that combination is 82. Because OFAT never ran the combination, it
underestimated the best plan by 8 points, exactly the interaction. With 40 students split into the
three groups OFAT needs, each comparison would also rest on about 13 students per group instead of
20.

## When main effects mislead

If the lines cross, a main effect can be close to zero even though the factor matters a great deal.

### Example 3: a fertilizer that helps and hurts

A greenhouse trial crosses a fertilizer (none or added) with soil moisture (dry or wet), using
randomly assigned trays. Mean yields in grams per plant:

| | No fertilizer | Fertilizer |
|---|---|---|
| **Dry** | 40 | 46 |
| **Wet** | 58 | 52 |

1. Main effect of fertilizer: $(46 + 52)/2 - (40 + 58)/2 = 49 - 49 = 0$.
2. Simple effects: dry $+6$; wet $-6$.
3. Interaction: $-6 - 6 = -12$.

Reporting "fertilizer has no effect" would be badly wrong: it raises yield in dry soil and lowers
it in wet soil. When an interaction is large, report the simple effects, not the main effects.

```plot
{"x": [-0.3, 1.3], "y": [35, 65], "xLabel": "fertilizer (0 = none, 1 = added)", "yLabel": "mean yield (g)", "functions": [{"f": "40 + 6*x", "from": 0, "to": 1, "label": "dry soil"}, {"f": "58 - 6*x", "from": 0, "to": 1, "label": "wet soil", "dashed": true}], "points": [{"at": [0, 40]}, {"at": [1, 46]}, {"at": [0, 58]}, {"at": [1, 52]}], "caption": "Interaction plot for Example 3: the fertilizer's effect has opposite signs in dry and wet soil"}
```

## Running a factorial experiment well

All the principles of lesson 17 still apply.

- *Randomize* units to all the treatment combinations, not one factor at a time. With 40 students
  and 4 treatments, number them 1–40 and use random numbers to fill four groups of 10.
- *Replicate* every combination. With one unit per treatment, chance variation and interaction
  can't be told apart.
- *Block* when a known variable affects the response: run the whole factorial within each block.
- *Keep it balanced.* With equal numbers in every cell, the factors are unrelated to each other
  by design, so each main effect is estimated cleanly. An interaction is not confounding: it is a
  real feature of how the response behaves, not a mix-up between the factors.

The number of treatments grows fast: $k$ factors at two levels each need $2^k$ treatments, so
5 factors need 32 and 7 need 128. Industrial experimenters often run a
**fractional factorial design**, a carefully chosen fraction of the combinations (say 16 of the 32), accepting that some
higher-order interactions can no longer be separated from each other. That trade is usually
worth it when most of those interactions are expected to be small.

## Common mistakes

- Reporting only main effects when the interaction plot shows crossing lines.
- Confusing interaction with confounding. Confounding mixes up a factor with an outside variable; interaction means one factor's effect depends on another factor.
- Adding levels instead of multiplying them when counting treatments.
- Concluding there is an interaction because sample lines aren't perfectly parallel. Small departures can be chance.
- Running a factorial design with one unit per treatment, so there is no replication.

## Key points

- Factorial design: every combination of factor levels; each unit helps estimate every main effect.
- Main effect: difference between the average responses at two levels of a factor, averaged over the other factor.
- Simple effect: a factor's effect at one level of the other factor.
- Interaction: the simple effects differ; measured here as the difference of the simple effects.
  Parallel lines on an interaction plot mean no interaction.
- One-factor-at-a-time experiments use units less efficiently and can't detect interactions.
- With a strong interaction, describe simple effects instead of main effects.
