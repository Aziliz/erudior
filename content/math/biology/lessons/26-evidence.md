---
id: bio-evidence
module: bio-m7
title: Evidence for evolution
minutes: 35
topics: [Evidence for evolution]
drills: [bio-half-life, bio-k-ar-age]
refs: [bio-ref-evolution-ecology]
---
Module 6 ended with mutations: random changes in DNA that create new alleles. This module asks what happens to those alleles over many generations. **Evolution** is a change in the inherited traits of a population over generations. Over long spans of time, that change produces new species, and all living species trace back through branching lines to common ancestors, which Darwin called descent with modification.

In science, a theory is not a guess. It is a broad explanation supported by many independent lines of evidence, like the cell theory or the germ theory of disease. This lesson lays out the main lines of evidence for evolution and shows how biologists read them. The strength of the case is that the lines are independent: rocks, anatomy, embryos, DNA and geography each tell the same story.

## The fossil record

Fossils are remains or traces of past organisms, mostly preserved in sedimentary rock. Sediment settles in layers, so in undisturbed rock, deeper layers are older. Fossils therefore come in a time order, and that order is consistent worldwide: simple single-celled life in the oldest rocks, then simple animals, fish before amphibians, amphibians before reptiles, and so on. No one has ever found a rabbit in rocks 500 million years old.

The record also contains **transitional fossils**, which show a mix of features of an older group and a later one. *Archaeopteryx* (about 150 million years old) had feathers and wings like a bird, but teeth, clawed fingers and a long bony tail like small dinosaurs. A series of fossil whales from about 50 to 40 million years ago shows four-legged land mammals gradually becoming fully aquatic, with nostrils moving up the head and hind legs shrinking.

### Example 1

By the late 1990s, fossils showed fish in rocks about 385 million years old and four-legged animals (tetrapods) in rocks about 365 million years old. If tetrapods evolved from fish, where should a researcher look for a fish–tetrapod transition?

Reason from the theory: the transition should be in rocks between those ages, roughly 375 million years old, and formed in shallow fresh water, where the earliest tetrapods lived. Neil Shubin and colleagues searched exposed rock of that age and type on Ellesmere Island in Arctic Canada. In 2004 they found *Tiktaalik*: a fish with scales, fins and gills, but also a flat head, a neck, lungs and sturdy fin bones matching our upper arm, forearm and wrist. The point is not just that the fossil exists, but that evolution predicted *when* and *where* it would be.

## Dating rocks: radiometric dating

Layer order gives relative age. **Radiometric dating** gives actual ages in years, using radioactive isotopes that decay at a steady, known rate. The **half-life** is the time for half of a radioactive isotope's atoms to decay. After one half-life, $\tfrac12$ is left; after two, $\tfrac14$; after $h$ half-lives, $\left(\tfrac12\right)^h$.

```plot
{"x": [0, 5.2], "y": [0, 1.05], "xLabel": "half-lives", "yLabel": "fraction remaining", "functions": [{"f": "0.5^x"}], "points": [{"at": [1, 0.5], "label": "1/2"}, {"at": [2, 0.25], "label": "1/4"}, {"at": [3, 0.125], "label": "1/8"}, {"at": [4, 0.0625], "label": "1/16"}], "caption": "Radioactive decay: each half-life leaves half of what was there"}
```

Different isotopes suit different ages:

- Carbon-14 (half-life 5,730 years) dates once-living material such as bone, wood or shell, up to about 50,000 years. Living things take in carbon-14 while alive; after death the carbon-14 decays and is not replaced.
- Potassium-40 (half-life 1.25 billion years) and uranium isotopes date volcanic rock, millions to billions of years old. Fossils in sedimentary rock are dated by volcanic layers above and below them.

### Example 2

A bone contains $\tfrac18$ as much carbon-14 as living tissue. How old is it?

$\tfrac18 = \left(\tfrac12\right)^3$, so 3 half-lives have passed. Age $= 3 \times 5{,}730 = 17{,}190$ years.

### Example 3

A volcanic ash layer contains 25% of its original potassium-40. A fossil lies just below it. What can you say about the fossil's age?

25% is $\tfrac14 = \left(\tfrac12\right)^2$: two half-lives, $2 \times 1.25 = 2.5$ billion years. The fossil is below the ash, so it is at least that old. (Carbon-14 is useless here: after 2.5 billion years, essentially none would be left.)

## Comparative anatomy

**Homologous structures** are body parts that share an underlying structure because they were inherited from a common ancestor, even if they now do different jobs. The forelimbs of a human (grasping), a cat (walking), a whale (swimming) and a bat (flying) all have one upper-arm bone, two forearm bones, a group of wrist bones and five sets of finger bones. An engineer designing each limb from scratch would not use the same parts list; shared ancestry explains it.

**Analogous structures** do similar jobs but are built differently and evolved separately. Bird wings and insect wings both fly, but a bird wing is a modified forelimb with bones and feathers, while an insect wing is a thin outgrowth of the body wall. Similar environments can shape unrelated lineages in similar ways, a pattern called convergent evolution. Analogous structures are evidence for natural selection, but not of close relationship.

**Vestigial structures** are reduced remnants of parts that were functional in ancestors. Some whales and snakes have tiny hip bones not attached to any leg. Humans have a tailbone and small muscles that once moved the ears. "Vestigial" doesn't always mean useless (a tailbone anchors muscles); it means much reduced from its ancestral role.

Embryos show homology too. Early vertebrate embryos, from fish to humans, all have a tail and a series of pouches in the throat region. In fish these pouches become gill structures; in humans they become parts of the ear, throat and glands.

## Molecular evidence

Every living thing uses DNA, the same genetic code (lesson 23) and the same 20 amino acids. That shared machinery is hard to explain except by common descent. Beyond that, the number of differences in a gene or protein between two species is a measure of how long ago they shared an ancestor: the longer two lines have been separate, the more mutations each has collected.

### Example 4

Cytochrome c is a protein of about 104 amino acids used in cellular respiration by nearly all eukaryotes. Approximate numbers of amino acids that differ from the human version:

| Species | Differences from human |
|---|---|
| Chimpanzee | 0 |
| Rhesus monkey | 1 |
| Chicken | 13 |
| Tuna | 21 |
| Baker's yeast | about 44 |

Which species is most distantly related to humans, and which conclusion do the data support?

Yeast, with the most differences, shares the most distant common ancestor with humans. The ranking (primates, then birds, then fish, then fungi) matches the order of relatedness worked out independently from anatomy and fossils. Two separate kinds of evidence agree.

DNA also holds "molecular fossils." Humans, other apes and monkeys carry the same broken copy of a gene for making vitamin C, with some of the same disabling mutations, at the same spot in the genome. The simplest explanation is that the gene broke once in a common ancestor.

## Biogeography

**Biogeography** is the study of where species live. Its patterns make sense only with history. Species on islands resemble species on the nearest mainland, not species living in similar climates far away: Galápagos finches and mockingbirds resemble South American birds. Australia, isolated for tens of millions of years, has a great variety of marsupials filling roles that placental mammals fill on other continents. Related fossils on now-separate continents fit the slow movement of the continents over time.

## Evolution observed

Evolution is also seen directly. Bacteria evolve resistance to antibiotics within years. In a long-term experiment started by Richard Lenski in 1988, populations of *E. coli* have been followed for more than 75,000 generations; one population evolved the ability to use citrate as food, something normal *E. coli* cannot do in oxygen. The next lesson explains the mechanism behind such changes.

## Common mistakes

- Thinking "theory" means a hunch. A scientific theory is a well-tested explanation supported by large bodies of evidence.
- Saying humans evolved from chimpanzees. Humans and chimpanzees share a common ancestor that lived roughly 6 to 8 million years ago (estimates vary); both lines have evolved since.
- Calling bird and insect wings homologous. They are analogous: same function, different structure and origin.
- Using carbon-14 to date dinosaurs. Dinosaur fossils are tens of millions of years old, far beyond carbon-14's range; their ages come from isotopes in nearby volcanic rock.
- Thinking that after two half-lives nothing is left. Each half-life removes half of what remains: $\tfrac14$ is left after two.

## Key points

- Evolution is change in a population's inherited traits over generations; all life shares common ancestry.
- Fossils appear in a consistent order; transitional fossils such as *Tiktaalik* and *Archaeopteryx* link groups, and some were found by prediction.
- Radiometric dating gives absolute ages: after $h$ half-lives, $\left(\tfrac12\right)^h$ of the isotope remains.
- Homologous structures show shared ancestry; analogous structures show similar selection on unrelated groups; vestigial structures are reduced remnants.
- Molecular similarities and differences, embryos and biogeography independently support the same tree of relationships.
