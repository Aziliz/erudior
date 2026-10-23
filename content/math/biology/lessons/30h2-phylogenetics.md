---
id: bio-h-phylogenetics
module: bio-m7
title: Building phylogenies and molecular clocks
minutes: 45
honors: true
topics: [Cladistics, Molecular clocks]
drills: [bio-h-mol-clock]
refs: [bio-ref-evolution-ecology]
---
In lesson 29 you built a vertebrate tree from a character table in which every trait fit perfectly: each one appeared once and was never lost. Real data are messier. Traits evolve more than once, get lost, and point to different trees. This lesson covers how biologists decide which states are ancestral, how they choose among competing trees, how they put dates on the branch points using DNA, and what happens to the tree picture when genes move sideways between species. The approach of grouping organisms strictly by shared derived traits is called cladistics, after the German entomologist Willi Hennig, who set out its rules in the 1950s and 1960s.

## Ancestral and derived characters

A character is any heritable feature that can be compared across species: the presence of hair, the number of toes, or the base at one position in a gene. Each character has states, such as present or absent, or A, C, G or T.

The key distinction is between two kinds of shared states. A **shared derived character** is a state that arose in the most recent common ancestor of a group and was inherited by its members. Hair is a shared derived character of mammals, and feathers of birds. A **shared ancestral character** is a state the group inherited from an older ancestor, so it is also found outside the group. Every mammal has a backbone, but so do fish, frogs and lizards; a backbone says nothing about which animals are mammals.

Only shared derived characters mark clades. Grouping by shared ancestral characters, or by overall resemblance, produces groups that leave some descendants out. The traditional "reptiles" (turtles, lizards, snakes, crocodiles) is the standard example. Crocodiles share a more recent common ancestor with birds than with lizards, so a group of reptiles that leaves out birds is a **paraphyletic group**: an ancestor and some, but not all, of its descendants. It was built on shared ancestral traits like scaly skin. Biologists who want reptiles to be a clade include birds in it.

## Outgroups: which state came first?

How do you know which state is ancestral? Hair is obviously new among vertebrates, but for many characters, such as which base sits at a position in a gene, it isn't obvious at all. The standard answer is an **outgroup**: a species known, from other evidence, to have branched off before the group being studied (the ingroup). A state found in the outgroup is taken to be ancestral, and a different state shared by some ingroup members is taken to be derived. In lesson 29 the lamprey was the outgroup for the jawed vertebrates. The outgroup also roots the tree: the root goes on the branch leading to it.

The outgroup should be fairly close to the ingroup. A very distant outgroup has had so much time to change that its states may no longer reflect the ingroup's ancestor.

## Choosing among trees: parsimony

The number of possible trees grows explosively with the number of species. For $n$ species there are $1 \times 3 \times 5 \times \cdots \times (2n - 3)$ different rooted trees with only two branches at each node: 3 trees for 3 species, 15 for 4, 105 for 5, about 34 million for 10, and about $8 \times 10^{21}$ for 20. No one can draw them all, so biologists need a rule for scoring a tree and computers to search for the best one.

Trees conflict because of **homoplasy**: similar character states that were not inherited from a common ancestor. Homoplasy comes from convergent evolution (the wings of birds and of bats, considered as wings, evolved separately) and from reversals (snakes lost the legs their ancestors had, so in leg count they resemble legless lizards and fish). On any tree, homoplasy shows up as the same change happening more than once.

The simplest scoring rule is **maximum parsimony**: prefer the tree that requires the fewest evolutionary changes in total. The reasoning is that any extra change is an extra assumption, so a tree that explains the data with fewer changes needs less homoplasy.

### Example 1

Three species, A, B and C, plus an outgroup are scored for six characters (0 = the state in the outgroup, 1 = a different state):

| | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Outgroup | 0 | 0 | 0 | 0 | 0 | 0 |
| Species A | 1 | 1 | 1 | 1 | 1 | 0 |
| Species B | 1 | 1 | 1 | 0 | 1 | 1 |
| Species C | 0 | 0 | 0 | 1 | 1 | 0 |

There are three possible rooted trees, depending on which two species are closest. Count the changes each one needs, character by character:

| Character | Tree 1: (A, B) closest | Tree 2: (A, C) closest | Tree 3: (B, C) closest |
|---|---|---|---|
| 1, 2, 3 (A and B have 1) | 1 each | 2 each | 2 each |
| 4 (A and C have 1) | 2 | 1 | 2 |
| 5 (all three have 1) | 1 | 1 | 1 |
| 6 (only B has 1) | 1 | 1 | 1 |
| **Total** | **7** | **9** | **10** |

On Tree 1, characters 1, 2 and 3 each change once, on the branch leading to A and B. Character 4 must change twice (or change once and then reverse in B), so it is homoplasy on this tree. Tree 1 needs the fewest changes and is the most parsimonious.

![Two trees side by side. Tree 1 groups species A and B and shows seven numbered change bars, with character 4 changing twice. Tree 2 groups species A and C and shows nine bars, with characters 1, 2 and 3 each changing twice.](images/m7-parsimony.svg)

Notice that characters 5 and 6 cost the same on every tree. A state found in all of the ingroup, or in only one species, can't tell trees apart; only states shared by some but not all ingroup species are informative.

Parsimony is the logic you can apply by hand. Studies of DNA today mostly use maximum likelihood or Bayesian methods, which use a model of how often each kind of base change happens and how rates vary among sites. They follow the same principle of scoring a tree by how well it explains the data, and on clean data they usually agree with parsimony.

## Molecular clocks

In the early 1960s Emile Zuckerkandl and Linus Pauling noticed that the number of amino acid differences in proteins such as hemoglobin rose roughly in proportion to the time since two lineages split, as dated by fossils. They called this a **molecular clock**: a gene or protein that collects changes at a roughly steady rate, so that the number of differences between two species estimates the time since their common ancestor. In 1968 Motoo Kimura's neutral theory offered an explanation. Many mutations have little or no effect on fitness, and those neutral changes spread or disappear by drift. For neutral mutations the rate at which changes become fixed in a lineage equals the mutation rate, which is fairly steady.

Two things must be kept straight. Since the split, *both* lineages have been collecting changes, so if each lineage changes at rate $r$, the difference between them grows at $2r$:

$$d = 2rT \quad\Longrightarrow\quad T = \frac{d}{2r}$$

And the rate must be measured before it can be used. This is **calibration**: find a split whose date is known from fossils or geology, measure the difference $d$ across it, and solve for $r$.

### Example 2

Fossils show that two lineages of lizards split 24 million years ago. In a particular gene they differ at 7.2% of sites. Two other species in the same group differ at 1.5% of sites. When did those two species split?

- Rate per lineage: $r = \dfrac{d}{2T} = \dfrac{7.2\%}{2 \times 24} = 0.15\%$ per million years.
- Split time: $T = \dfrac{d}{2r} = \dfrac{1.5\%}{2 \times 0.15\%} = 5$ million years.

A shortcut gives the same answer: the two lineages diverge from each other at $2r = 0.30\%$ per million years, and $1.5 / 0.30 = 5$. The usual error is to mix the two, dividing by $r$ when $d$ was measured between two species.

### Example 3

Pairs of species with fossil-dated splits are plotted below, with each pair's percent difference in a gene. Where does a pair that differs by 9% fall?

```plot
{"x": [0, 70], "y": [0, 22], "xLabel": "time since split (million years)", "yLabel": "percent difference", "functions": [{"f": "0.3*x", "label": "fitted clock"}], "points": [{"at": [10, 3.1]}, {"at": [20, 5.8]}, {"at": [40, 12.2]}, {"at": [60, 17.9]}, {"at": [30, 9], "label": "new pair"}], "segments": [{"from": [0, 9], "to": [30, 9], "dashed": true}, {"from": [30, 9], "to": [30, 0], "dashed": true}], "caption": "A calibration line through fossil-dated pairs: about 0.30% difference per million years between two lineages"}
```

The four calibration points lie close to a line through the origin with slope about 0.30% per million years ($r = 0.15\%$ per lineage). A 9% difference corresponds to $9 / 0.30 = 30$ million years. Read the line, not a single point: each calibration date has its own error.

Clocks need care. Different genes tick at different rates: genes where almost any change is harmful, such as histones, change very slowly; much noncoding DNA, and the mitochondrial DNA of animals, change fast. (A long-used rule of thumb for animal mitochondrial DNA is about 2% difference between two lineages per million years, but it varies widely among groups.) Rates can differ among lineages, for example with generation time. Over very long times the same site can change more than once, hiding earlier changes, so the difference stops growing in proportion to time; this is called saturation, and it makes old splits look younger than they are. Modern studies use many genes, several fossil calibrations and "relaxed" clocks that let the rate vary across the tree, and they report dates with ranges. The Isthmus of Panama from lesson 29 is a popular calibration for marine animals, because its closure split Caribbean and Pacific populations; most estimates put the final closure near 3 million years ago, though some geologists argue for earlier dates.

## When the tree is not a tree: horizontal gene transfer

A tree assumes that genes pass only from parents to offspring. **Horizontal gene transfer** is the movement of genes between organisms by any other route, often between different species. Bacteria do it in three main ways: taking up DNA released by other cells (transformation), receiving DNA carried by a virus (transduction), and passing plasmids through direct contact (conjugation). This is how a gene for antibiotic resistance that arises in one species can turn up in distantly related bacteria within a few years.

![A tree of four bacteria. A gene arises on the branch leading to bacterium 1, and a curved arrow carries it across to the branch leading to bacterium 4, so bacteria 1 and 4 share the gene although they are not each other's closest relatives.](images/m7-hgt.svg)

For tree builders, horizontal transfer means that a gene's own history (its gene tree) can differ from the history of the species that carry it. A resistance gene would group bacteria 1 and 4 in the figure, while most of their other genes group 1 with 2 and 3 with 4. Biologists therefore build species trees from many genes and treat a gene whose tree sharply disagrees as a candidate for transfer. Among bacteria and archaea, transfer has been so common over billions of years that some biologists describe the base of the tree of life as more like a web.

Eukaryotes are not immune. Many genes of the bacterium that became the mitochondrion moved into the host cell's nucleus long ago (lesson 30). And pea aphids carry genes for making carotenoid pigments that were transferred from fungi, although most animals cannot make carotenoids at all and must get them from food. Still, in plants and animals most genes follow the species tree, so tree-thinking remains the right default.

## Common mistakes

- Using a shared ancestral character to define a group. A backbone doesn't make a clade of mammals; hair does.
- Forgetting the outgroup. Without it you can't tell which state is ancestral, and the tree has no root.
- Counting characters that cost the same on every tree as support. A state found in only one species, or in all of them, is uninformative.
- Dividing by $r$ instead of $2r$. The difference between two species grows along both lineages.
- Treating a molecular-clock date as exact. Dates depend on calibrations and on how much the rate varies, and come with ranges.
- Assuming every gene's tree is the species tree. Horizontal gene transfer, especially in bacteria, can give single genes a different history.

## Key points

- Shared derived characters define clades; shared ancestral characters don't. Groups like the traditional reptiles that leave out some descendants are paraphyletic.
- An outgroup shows which character states are ancestral and roots the tree.
- Homoplasy (convergence or reversal) makes characters conflict; maximum parsimony picks the tree with the fewest changes, and modern DNA studies use likelihood and Bayesian methods.
- Molecular clocks: calibrate with a dated split, then $T = d/(2r)$, where $r$ is the rate per lineage. Rates vary among genes and lineages, and old splits saturate.
- Horizontal gene transfer moves genes between lineages, common in bacteria (transformation, transduction, conjugation) and rarer in eukaryotes, so gene trees can differ from the species tree.
