---
id: bio-h-social-behavior
module: bio-h3
title: Social behavior, altruism, and kin selection
minutes: 45
honors: true
topics: [Social behavior]
drills: [bio-h-hamilton, bio-h-worker-relatedness]
refs: [bio-ref-genetics]
---
The last lesson ended with a warning: behavior doesn't evolve "for the good of the species." Natural selection favors whatever spreads the genes behind it. That makes some of the most familiar animal behaviors puzzling. A ground squirrel calls out when a hawk appears, warning others and drawing the hawk's attention to itself. A worker honeybee never reproduces and dies when she stings. How can genes for self-sacrifice spread? This lesson works through the answer biologists found, using the probability you learned in genetics (lessons 17–20), and then turns to the most competitive social arena of all: mating.

## The puzzle of altruism

In evolutionary biology, **altruism** means a behavior that lowers the actor's own reproductive success and raises another individual's. (The word says nothing about intentions.) Paul Sherman's long study of Belding's ground squirrels in California showed the puzzle in numbers. Squirrels that give alarm calls when a predator approaches are stalked and caught more often than squirrels that keep quiet. Yet calling persists.

Sherman also noticed *who* calls. Females stay near where they were born, surrounded by mothers, sisters and daughters; males move away. Adult females with relatives nearby called far more often than males or than females without kin nearby. The warnings went mostly to relatives.

## Kin selection and Hamilton's rule

Your relatives carry copies of some of your alleles. An allele that makes you help them can therefore spread by helping copies of itself in their bodies. Natural selection acting through the success of relatives is called **kin selection**, and W. D. Hamilton put it in a simple inequality in 1964. **Hamilton's rule** says a helping behavior is favored when

$$rB > C$$

- $C$ is the cost to the actor, in offspring the actor doesn't produce because of the act.
- $B$ is the benefit to the recipient, in extra offspring the recipient produces because of it.
- $r$ is the **coefficient of relatedness**: the probability that an allele in the actor is also present in the recipient because both inherited it from a common ancestor.

To find $r$, trace every path through common ancestors. Each step of a path (parent to child or child to parent) passes a given allele with probability $\tfrac12$, so a path with $L$ steps contributes $(\tfrac12)^L$; add the paths.

| Relationship (diploid) | Paths | $r$ |
|---|---|---|
| Parent and child | 1 step | $\tfrac12$ |
| Full siblings | 2 paths of 2 steps (via mother, via father) | $\tfrac14 + \tfrac14 = \tfrac12$ |
| Half siblings | 1 path of 2 steps | $\tfrac14$ |
| Grandparent, aunt or uncle and niece or nephew | 2 steps, or 2 paths of 3 steps | $\tfrac14$ |
| First cousins | 2 paths of 4 steps | $\tfrac18$ |

The biologist J. B. S. Haldane is said to have joked that he would lay down his life for two brothers or eight cousins. Hamilton's rule shows why that is the break-even point: $\tfrac12 \times 2 = 1$ and $\tfrac18 \times 8 = 1$.

Counting both your own offspring and the extra offspring of relatives you help, each weighted by relatedness, gives your **inclusive fitness**. Kin selection is natural selection on inclusive fitness.

### Example 1: should she help her sister?

A young female bird can breed on her own and raise 1 chick, or skip breeding and help her full sister, which raises 3 more chicks than her sister would raise alone. Which does Hamilton's rule favor?

1. Relatedness to her sister: $r = \tfrac12$. Benefit to the sister: $B = 3$ extra chicks. Cost: $C = 1$ chick of her own.
2. $rB = \tfrac12 \times 3 = 1.5$, which is greater than $C = 1$. Helping is favored.
3. Check by counting gene copies. Her own chick carries a given allele of hers with probability $\tfrac12$: expected 0.5 copies. Her sister's 3 extra chicks are her nieces and nephews ($r = \tfrac14$): $3 \times \tfrac14 = 0.75$ copies. Helping passes on more.
4. If she were helping a half sister ($r = \tfrac14$), $rB = 0.75 < 1$, and breeding on her own wins.

Helpers at the nest are common in birds such as white-fronted bee-eaters, where nonbreeding birds choose to help their closest relatives, just as the rule predicts.

## Eusociality and haplodiploidy

The most extreme cooperation is **eusociality**: a colony with overlapping generations, cooperative care of young, and a reproductive division of labor in which most individuals (workers) don't reproduce. Ants, many bees and wasps, and termites are eusocial; so are two African mole-rat species, including the naked mole-rat.

Ants, bees and wasps (the order Hymenoptera) share an unusual genetic system called **haplodiploidy**. Females develop from fertilized eggs and are diploid. Males develop from unfertilized eggs and are haploid, so a male has only his mother's genes and passes all of them to every daughter.

![A haplodiploid family: a diploid queen and a haploid male produce diploid daughters and haploid sons. Arrows show that a worker shares, on average, three quarters of her genes with a full sister, one quarter with a brother, and one half with her own offspring.](images/h3-haplodiploidy.svg)

Work out how related two sisters are when the queen mated once:

1. Both got their father's entire genome, so an allele a sister inherited from her father is certainly in her sister: half her genome, shared with probability 1.
2. An allele she got from her mother is in her sister with probability $\tfrac12$.
3. $r = \tfrac12(1) + \tfrac12\left(\tfrac12\right) = \tfrac34$.

A worker is more related to a full sister ($\tfrac34$) than she would be to her own daughter ($\tfrac12$). Hamilton suggested that this "three-quarters relatedness" made it easier for worker sterility to evolve in Hymenoptera. The idea is elegant, but it is not the whole story, and it is now taught with caveats:

- A worker's relatedness to a brother is only $\tfrac14$ (he got no genes from her father). Averaged over equal numbers of sisters and brothers, it comes back to $\tfrac12$. The advantage holds only if workers bias the colony's investment toward sisters, which workers in many ant species do.
- Many queens mate with several males. Honeybee queens typically mate with a dozen or more drones, so most workers are half sisters ($r = \tfrac14$).
- Termites and naked mole-rats are fully diploid and eusocial, and most haplodiploid species are not eusocial at all.
- Comparative studies show that eusociality arose in lineages whose queens mated once (high relatedness helped get it started), and that ecology mattered too: a valuable, defensible nest makes staying and helping pay. In 2010 Martin Nowak, Corina Tarnita and E. O. Wilson argued that kin selection theory is unnecessary for explaining eusociality; more than a hundred other researchers published replies defending it. Most evolutionary biologists still treat kin selection as central, alongside ecology.

### Example 2: how multiple mating dilutes relatedness

A queen mates with $n$ males, each fathering an equal share of her daughters. What is the average relatedness between two of her worker daughters?

1. Two workers have the same father with probability $\tfrac1n$; then $r = \tfrac34$. Otherwise they are half sisters, sharing only their mother: $r = \tfrac12 \times \tfrac12 = \tfrac14$.
2. Average: $\bar r = \tfrac1n\left(\tfrac34\right) + \left(1 - \tfrac1n\right)\tfrac14 = \tfrac14 + \tfrac{1}{2n}$.
3. $n = 1$: $\tfrac34$. $n = 2$: $\tfrac12$. $n = 12$: $\tfrac14 + \tfrac{1}{24} \approx 0.29$.

With two or more fathers, workers are no more related to their sisters than to their own offspring would be, so Hamilton's three-quarters argument can't be what keeps honeybee workers sterile. (Other factors, such as workers policing each other's eggs, do.)

## Reciprocal altruism

Animals sometimes help non-relatives. Robert Trivers proposed in 1971 that **reciprocal altruism**, helping now in exchange for help later, can evolve when the same individuals meet repeatedly, can recognize each other, and can stop helping those who don't return the favor. Without those conditions, cheaters who take help and never give it would win.

Vampire bats are a well-studied case. A bat that fails to find a blood meal for two or three nights in a row can starve, and roost-mates often regurgitate blood to a hungry bat. Gerald Wilkinson found in the 1980s that sharing happened between relatives but also between unrelated bats that roosted together often, and later lab experiments showed that bats that had donated in the past were more likely to receive food. In computer tournaments run by Robert Axelrod around 1980, a simple strategy called tit for tat (cooperate first, then copy whatever the partner did last time) did very well, which suggests how reciprocity can be stable.

## Mating systems and sexual selection

Robert Trivers also pointed out that the sexes often invest unequally in offspring. **Parental investment** is anything a parent spends on one offspring that it can't spend on others: a large egg, pregnancy, milk, feeding, guarding. Usually females invest more, starting with eggs far larger than sperm. The sex that invests more is the limiting resource for the other, so it tends to be choosier, and members of the other sex compete for access to it.

| Mating system | Pattern | Examples |
|---|---|---|
| Monogamy | One male, one female | Most bird species (socially), gibbons, prairie voles |
| Polygyny | One male, several females | Elk, elephant seals, many lizards |
| Polyandry | One female, several males | Jacanas, spotted sandpipers |
| Promiscuity | No lasting pair bonds; both sexes mate with several partners | Chimpanzees, many fish |

"Social" monogamy and genetic monogamy differ: DNA testing shows that chicks in many socially monogamous songbird nests have a different father from the male raising them. Where males invest more, roles flip. Male seahorses and pipefish carry the young, and in several pipefish species females are the more ornamented sex and compete for males; in polyandrous jacanas, larger females defend territories holding several males that incubate the eggs.

**Sexual selection** is selection on traits that increase mating success. It comes in two forms:

- *Intrasexual selection*: competition within one sex for mates. Bull elephant seals fight for control of beaches; in some colonies a few dominant males do most of the mating, which selects for huge size.
- *Intersexual selection*: mate choice by the other sex. Malte Andersson cut the long tails of some male long-tailed widowbirds in Kenya and glued the pieces onto others. Males with lengthened tails attracted more females to nest in their territories than males with normal or shortened tails, showing that females prefer long tails.

Why prefer an ornament? Hypotheses include *good genes* (only a healthy male can grow a costly ornament, so it honestly signals quality) and *runaway selection* (once a preference exists, sons with the trait and daughters with the preference both do well, so trait and preference can exaggerate together). Both have experimental support in different species.

### Example 3: who varies more?

Five female and five male elephant seals in a small colony produce these numbers of pups in one season. Females: 1, 1, 1, 1, 0. Males: 4, 0, 0, 0, 0. Compare mean and variance.

1. Means: females $\tfrac45 = 0.8$; males $\tfrac45 = 0.8$. They must match: every pup has one mother and one father, and the sexes are equal in number.
2. Variance (mean squared deviation from the mean). Females: $\tfrac{4(0.2)^2 + (0.8)^2}{5} = \tfrac{0.80}{5} = 0.16$. Males: $\tfrac{(3.2)^2 + 4(0.8)^2}{5} = \tfrac{12.8}{5} = 2.56$.
3. Male success varies 16 times as much. The bigger the variance in a sex's mating success, the stronger sexual selection acts on that sex, which is why the competing sex is usually the more ornamented or armed one.

## Common mistakes

- Thinking altruism requires that an animal understands relatedness. Kin selection only requires that helping is directed, on average, toward relatives (for example, toward whoever shares the home burrow).
- Using $r$ for the actor's own offspring in Hamilton's rule. $r$ is the relatedness between actor and recipient, and $B$ and $C$ are measured in offspring.
- Saying haplodiploidy explains eusociality. It may have helped, but brothers, multiple mating, diploid eusocial species and ecology all complicate it.
- Calling reciprocal altruism kin selection. Reciprocity works between non-relatives and depends on repeated encounters.
- Assuming males are always the ornamented sex. The sex that invests less in offspring tends to compete; in role-reversed species that is the female.

## Key points

- Altruism lowers the actor's direct reproduction and raises another's; kin selection explains much of it through inclusive fitness.
- Hamilton's rule: helping is favored when $rB > C$. Find $r$ by adding $(\tfrac12)^L$ over all paths through common ancestors.
- Haplodiploid full sisters share $r = \tfrac34$, but the idea has strong caveats; average worker relatedness with $n$ fathers is $\tfrac14 + \tfrac{1}{2n}$.
- Reciprocal altruism needs repeated meetings, recognition and punishment of cheaters.
- The sex with lower parental investment usually competes for the other; mating systems include monogamy, polygyny, polyandry and promiscuity.
- Sexual selection works through competition within a sex and through mate choice.
