---
id: bio-natural-selection
module: bio-m7
title: Natural selection and adaptation
minutes: 35
topics: [Natural selection, Adaptation]
drills: [bio-selection-change]
refs: [bio-ref-evolution-ecology]
---
The last lesson showed that evolution happened: life has changed over time and shares common ancestors. This lesson explains the main mechanism that produces the fit between organisms and their surroundings, natural selection. Charles Darwin and Alfred Russel Wallace reached the idea independently and presented it together in 1858; Darwin's *On the Origin of Species* followed in 1859. Their argument is short enough to check step by step.

## The argument

Natural selection follows from four observations about any population:

1. *Variation.* Individuals differ in their traits: size, color, beak shape, resistance to disease.
2. *Inheritance.* Some of that variation is heritable, passed from parents to offspring through genes.
3. *Overproduction.* Populations produce more offspring than the environment can support. A single cod can release millions of eggs; most die young.
4. *Differential success.* Which individuals survive and reproduce is not entirely random. Individuals whose traits suit the environment better tend to leave more offspring.

Put these together and the conclusion follows: heritable traits that help survival and reproduction become more common in the next generation, and over many generations the population changes. That process is **natural selection**.

Biologists measure success with **fitness**: an individual's reproductive success, the number of offspring it contributes to the next generation, compared with others in the population. Fitness is not strength or speed. A strong animal that leaves no offspring has zero fitness; a small one that leaves many has high fitness.

An **adaptation** is a heritable trait that increases fitness in a particular environment: the thick fur of an arctic fox, the camouflage of a stick insect, the deep roots of a desert shrub. An adaptation is always relative to an environment. Thick fur is a burden in the tropics.

## Variation comes before selection

A common misunderstanding is that the environment *causes* the helpful variation: that bacteria become resistant because they need to. In 1952 Joshua and Esther Lederberg tested this with a clever trick called replica plating.

### Example 1

The Lederbergs grew many bacterial colonies on a dish with no antibiotic. They pressed a velvet pad onto it, picking up a few cells from every colony in the same arrangement, and pressed the pad onto a dish containing the antibiotic. A few colonies grew there, all from cells at the same positions, say positions 7 and 19. Then they went back to the original dish, which had never touched the antibiotic, and tested colonies 7 and 19. Predict: are they resistant?

If resistance arose in response to the antibiotic, colonies on the original dish would not be resistant, because they were never exposed. If resistant mutants already existed by chance, colonies 7 and 19 on the original dish would be resistant. The Lederbergs found the second result: cells from those colonies grew on antibiotic even though they had never met it. Conclusion: the mutations arose randomly, before exposure. The antibiotic did not create resistance; it selected the cells that already had it.

Mutation is random with respect to need. Selection is not random: it sorts the variation that mutation and sexual reproduction supply.

## Natural selection measured: Darwin's finches

Peter and Rosemary Grant have studied the finches of Daphne Major, a tiny Galápagos island, since 1973, catching, measuring and banding nearly every bird. In 1977 a severe drought struck. The medium ground finch eats seeds, and as small soft seeds ran out, the remaining food was mostly large, hard seeds that only birds with deep, strong beaks could crack. The population crashed by more than 80 percent. Survivors had deeper beaks on average than the birds that died, and because beak depth is heritable, the next generation's beaks were measurably deeper, by roughly 4 percent.

Later, after very wet years in the early 1980s, small seeds became plentiful and selection favored smaller beaks. Selection tracks the environment, so its direction can reverse.

### Example 2

A moth population has 600 light moths and 400 dark moths, so it is 40% dark. On tree bark darkened by soot, birds see light moths more easily: 40% of light moths survive to reproduce, but 70% of dark moths do. What percent of the survivors are dark?

- Light survivors: $600 \times 0.40 = 240$.
- Dark survivors: $400 \times 0.70 = 280$.
- Dark fraction: $\dfrac{280}{240 + 280} = \dfrac{280}{520} \approx 0.538$, or 53.8%.

One generation of selection moved the population from 40% dark to about 54% dark among the parents of the next generation. This is close to what happened to the peppered moth in England: in polluted industrial areas the dark form rose from rare in the 1840s to about 98% around Manchester by the late 1800s, and it fell again after clean-air laws in the 1950s let the bark lighten.

## Three patterns of selection

For a trait with many values, like beak depth or body size, selection can change the distribution in three ways. In each figure, the solid curve is the population before selection and the dashed curve after.

**Directional selection** favors one extreme, so the average shifts. Drought finches with deeper beaks are an example.

```plot
{"x": [0, 10], "y": [0, 1.2], "xLabel": "trait value", "yLabel": "number of individuals", "functions": [{"f": "exp(-(x-4.5)^2/2)", "label": "before"}, {"f": "exp(-(x-6)^2/2)", "dashed": true, "label": "after"}], "caption": "Directional selection: the average moves toward one extreme"}
```

**Stabilizing selection** favors the average and removes both extremes, so variation shrinks. Human birth weight was a classic case: very small and very large babies historically had lower survival. (Modern medicine has weakened this selection.)

```plot
{"x": [0, 10], "y": [0, 1.6], "xLabel": "trait value", "yLabel": "number of individuals", "functions": [{"f": "exp(-(x-5)^2/2)", "label": "before"}, {"f": "1.5*exp(-(x-5)^2/0.9)", "dashed": true, "label": "after"}], "caption": "Stabilizing selection: the middle is favored and the spread narrows"}
```

**Disruptive selection** favors both extremes over the middle. In an African finch, the black-bellied seedcracker, birds with small bills handle soft seeds well and birds with large bills crack hard seeds, while intermediate bills do neither well. Over time the population can split into two peaks.

```plot
{"x": [0, 10], "y": [0, 1.2], "xLabel": "trait value", "yLabel": "number of individuals", "functions": [{"f": "exp(-(x-5)^2/2)", "label": "before"}, {"f": "0.8*(exp(-(x-3)^2/1.2) + exp(-(x-7)^2/1.2))", "dashed": true, "label": "after"}], "caption": "Disruptive selection: both extremes are favored and the middle declines"}
```

A related process, sexual selection, favors traits that improve mating success rather than survival, such as a peacock's tail. The tail may attract predators, but if it attracts more mates, its genes spread.

## Artificial selection

Darwin opened the *Origin* with breeders, not wild animals. In **artificial selection**, people choose which individuals breed, based on traits they want. From one species of wild cabbage (*Brassica oleracea*, a relative of mustard), farmers have bred cabbage (selected for the end bud), broccoli (flower clusters), kale (leaves), kohlrabi (stem) and Brussels sprouts (side buds). From ancient wolves came every breed of dog. If people can change a species this much in a few thousand years, natural selection acting over millions of years can do far more. The difference is who does the choosing: in nature, the environment "chooses" through survival and reproduction.

## Selection in medicine

When an antibiotic is used, it kills susceptible bacteria; any resistant cells survive and multiply. Overuse and misuse, such as taking antibiotics for viral colds, speed this up. Methicillin-resistant *Staphylococcus aureus* (MRSA) and drug-resistant tuberculosis are results of natural selection happening now. The same logic explains insects resistant to pesticides and weeds resistant to herbicides.

## What selection cannot do

- It acts on individuals, but populations evolve. A single moth doesn't change color; the proportion of dark moths in the population changes.
- It has no foresight. Selection favors what works now, not what might help later.
- It works only with existing variation. If no individual has a helpful allele, selection cannot produce it.
- Traits acquired during life are not inherited. Jean-Baptiste Lamarck proposed that a giraffe stretching its neck passed a longer neck to its young. A gym-built muscle isn't coded in your DNA, so it isn't passed on.
- Adaptations are compromises. A bigger beak cracks harder seeds but costs more to grow.

## Common mistakes

- Defining fitness as physical strength. Fitness is reproductive success relative to others.
- Saying organisms evolve because they need to. Mutations arise randomly; selection keeps the ones that happen to help.
- Treating "survival of the fittest" as survival alone. An organism that survives but doesn't reproduce has no effect on the next generation.
- Mixing up stabilizing and directional selection. Stabilizing keeps the average and narrows the spread; directional moves the average.
- Thinking individuals evolve. Individuals are selected; populations evolve.

## Key points

- Natural selection follows from heritable variation, overproduction and differential reproductive success.
- Fitness is relative reproductive success; an adaptation is a heritable trait that raises fitness in a given environment.
- Variation arises randomly, before selection (Lederberg replica plating); selection sorts it.
- The Grant finches and peppered moths show selection measured in wild populations, and its direction can reverse.
- Directional selection shifts the average, stabilizing selection favors the average, disruptive selection favors both extremes.
- Artificial selection by breeders and antibiotic resistance in bacteria show the same process.
