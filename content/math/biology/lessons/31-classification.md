---
id: bio-classification
module: bio-m8
title: Classification, bacteria, archaea, and viruses
minutes: 35
topics: [Classification, Bacteria and archaea, Viruses]
drills: [bio-bacteria-growth, bio-serial-dilution]
refs: [bio-ref-lab]
---
## Sorting millions of kinds of life

The last module ended with the history of life: billions of years of branching descent from a common ancestor. This module surveys what that branching produced. Biologists have named about two million species, and estimates of the true total run from several million to far more once microbes are counted. To talk about them at all we need a system for naming and grouping them. This lesson builds that system, then looks at the two domains of single-celled life without a nucleus, bacteria and archaea, and at viruses, which sit outside the tree of cells altogether.

## Names and ranks

**Taxonomy** is the science of naming, describing and classifying organisms. Its modern form goes back to the Swedish botanist Carl Linnaeus, who in the 1750s popularized two habits that are still in use.

The first is **binomial nomenclature**: every species gets a two-part Latin name. The first part is the genus, capitalized; the second is the specific epithet, lowercase. Both are italicized in print (or underlined by hand): *Homo sapiens*, *Escherichia coli*, *Quercus alba* (white oak). After the first mention the genus may be shortened, as in *E. coli*. The point of a scientific name is that it is unique and worldwide. "Mountain lion," "cougar," "puma" and "panther" all mean *Puma concolor*, while "robin" means different birds in North America and Britain.

The second is a nested hierarchy of ranks. From most inclusive to least:

| Rank | Humans | Gray wolf |
|---|---|---|
| Domain | Eukarya | Eukarya |
| Kingdom | Animalia | Animalia |
| Phylum | Chordata | Chordata |
| Class | Mammalia | Mammalia |
| Order | Primates | Carnivora |
| Family | Hominidae | Canidae |
| Genus | *Homo* | *Canis* |
| Species | *Homo sapiens* | *Canis lupus* |

A memory line for the order is "Dear King Philip Came Over For Good Soup." Two organisms that share a lower rank share every rank above it: two members of the same family are automatically in the same order, class, phylum, kingdom and domain.

Linnaeus grouped organisms by visible similarity and had no idea of evolution. Since Darwin, the goal has changed: a good classification should reflect ancestry, so each named group should contain an ancestor and all of its descendants (the phylogenetic trees of the last module). When DNA evidence shows that a traditional group mixes separate branches, the classification gets revised. That's why classification is a hypothesis that changes with evidence rather than a fixed list.

## Three domains

For most of the twentieth century, living things were split into prokaryotes and eukaryotes, with prokaryotes treated as one group, "bacteria." In 1977 Carl Woese and George Fox compared the sequences of ribosomal RNA, a molecule every cell has and that changes slowly over evolutionary time. Some prokaryotes, starting with methane-producing microbes from swamps and sewage and later many from hot springs, turned out to be as different from ordinary bacteria as bacteria are from us. In 1990 Woese and his colleagues formalized this as the **three-domain system**: Bacteria, **Archaea** and Eukarya.

| Feature | Bacteria | Archaea | Eukarya |
|---|---|---|---|
| Nucleus | No | No | Yes |
| Peptidoglycan in cell wall | Usually yes | No | No |
| Membrane lipids | Ester-linked, unbranched | Ether-linked, branched | Ester-linked, unbranched |
| RNA polymerase | One, simpler | One, complex and eukaryote-like | Several, complex |
| Known disease-causing species | Many | None known | Some |

The table shows the surprise: in their machinery for copying DNA and making proteins, archaea resemble eukaryotes more than they resemble bacteria. Lesson 29 explained why. Most recent genome studies place eukaryotes inside the archaeal branch, closest to the Asgard archaea: the first eukaryote seems to have been an archaeal cell that took in a bacterium, which became the mitochondrion. On those trees there are only two primary branches, Bacteria and Archaea. (Eukaryotes are a mosaic: their membrane lipids are bacterial-type, as the table shows, possibly inherited partly from that bacterial partner.) Biologists still use the three domains to classify life, because eukaryotes are so distinctive, and this course does too. Either way, "prokaryote" names a cell plan, not a single evolutionary group.

Archaea are famous for extreme habitats: near-boiling hot springs, salt flats, acid mine drainage. But they also live in ordinary soil, oceans and the human gut, and every known methanogen (a microbe that makes methane as the end product of its energy metabolism) is an archaeon.

## Bacteria: small, fast, everywhere

Bacteria are classified partly by shape (spheres, or cocci; rods, or bacilli; spirals) and by cell wall. The Gram stain, developed in 1884, colors thick-walled Gram-positive bacteria purple and thin-walled Gram-negative bacteria, which have an extra outer membrane, pink. The distinction matters in medicine because the two groups respond differently to some antibiotics.

Bacteria reproduce by **binary fission**: the cell copies its single circular chromosome, grows, and pinches in two. There's no mitosis and no spindle. Under ideal conditions, the time between divisions, the **generation time**, can be as short as about 20 minutes for *E. coli*. Since every generation doubles the number of cells,

$$N = N_0 \times 2^{n},$$

where $N_0$ is the starting number and $n$ is the number of generations (elapsed time divided by generation time).

```plot
{"x": [0, 6], "y": [0, 70], "xLabel": "generations", "yLabel": "cells (from 1)", "functions": [{"f": "2^x", "label": "N = 2ⁿ"}], "points": [{"at": [3, 8], "label": "8"}, {"at": [5, 32], "label": "32"}, {"at": [6, 64], "label": "64"}], "caption": "Exponential growth: each generation doubles the population"}
```

Growth can't stay exponential: food runs out and wastes build up. A real culture in a flask shows a lag phase, an exponential (log) phase, a stationary phase and a death phase.

Bacteria also exchange genes sideways. In conjugation one cell passes DNA to another through a connecting tube; others take up DNA from their surroundings or receive it from viruses. This horizontal gene transfer is one way antibiotic resistance spreads between species.

Most bacteria are harmless or helpful. They decompose dead matter, recycle nitrogen (some fix nitrogen gas into forms plants can use), make yogurt and cheese, and in the human gut alone number in the tens of trillions, about as many as the body's own cells. Ancient cyanobacteria filled the atmosphere with oxygen. A minority are **pathogens**, organisms or agents that cause disease: *Streptococcus* (strep throat), *Mycobacterium tuberculosis*, *Salmonella*. Antibiotics work by hitting structures bacteria have and our cells don't, such as peptidoglycan walls or bacterial ribosomes.

### Example 1

A broth starts with 300 *E. coli* cells, and the generation time is 20 minutes. Assuming exponential growth, how many cells are there after 2 hours?

- Time in the same units: 2 hours = 120 minutes.
- Generations: $n = 120 / 20 = 6$.
- $N = 300 \times 2^{6} = 300 \times 64 = 19\,200$ cells.

A common slip is to multiply by 6 instead of by $2^6$. Six generations means six doublings, not six times as many.

### Example 2: counting bacteria

Bacteria are too small and numerous to count directly, so microbiologists dilute a sample and spread a small volume on a nutrient plate. Each living cell grows into one visible colony, so colonies are counted as colony-forming units (CFU). Plates with about 30–300 colonies are counted; fewer is statistically unreliable and more run together.

A pond sample is diluted to $10^{-4}$ (one part in 10,000), and 0.1 mL is spread on a plate. After a day, 156 colonies appear. What was the concentration in the original sample?

- The plated volume held $156 / 0.1 = 1560$ CFU per mL of diluted sample.
- Undo the dilution: $1560 \times 10^{4} = 1.56 \times 10^{7}$ CFU/mL.

In one step: $\text{CFU/mL} = \dfrac{\text{colonies}}{\text{dilution} \times \text{volume plated}} = \dfrac{156}{10^{-4} \times 0.1}$.

## Viruses

You met viruses in the cell module: a protein coat around DNA or RNA, with no ribosomes and no metabolism of their own. Because they can only reproduce inside a host cell, they aren't placed in any domain, and whether to call them alive is a matter of definition. What they do have is genes, mutation and evolution by natural selection, which is why flu vaccines are updated every year.

A virus attaches to specific receptor molecules on a host cell, which is why each virus infects only certain species and tissues. Viruses that infect bacteria, called phages, show the two classic replication strategies:

- In the **lytic cycle**, the viral genome takes over the cell at once: it is copied, viral proteins are made, new viruses assemble, and the cell bursts (lyses), releasing them. Many viruses behave this way in our cells, killing the cells they multiply in.
- In the **lysogenic cycle**, the viral DNA is inserted into the host chromosome and copied along with it every time the cell divides, causing no harm for a while. A trigger such as radiation or stress can switch it into the lytic cycle later. Herpes viruses use a similar dormant stage, which is why cold sores come back.

HIV is a retrovirus: it carries RNA and an enzyme, reverse transcriptase, that copies the RNA into DNA, which then integrates into the host genome. Antibiotics have no effect on viruses since there's no cell wall or bacterial ribosome to target; antiviral drugs block virus-specific enzymes instead, and vaccines prevent infection (lesson 37).

### Example 3: lytic or lysogenic?

A researcher infects a bacterial culture with a phage. For three days the culture looks normal and keeps growing. Then she exposes it to UV light, and within an hour the culture clears as the cells burst. Interpret this.

Normal growth after infection means the cells weren't being destroyed, so the phage was in the lysogenic cycle, its DNA copied along with the bacterial chromosome. UV light damaged DNA, a classic trigger that switches the prophage into the lytic cycle, so the cells lysed.

## Common mistakes

- Writing *homo Sapiens* or *Homo Sapiens*: the genus is capitalized, the species epithet never is.
- Thinking archaea are a kind of bacteria. They are a separate domain, closer to eukaryotes in many molecular features.
- Assuming most bacteria cause disease. Pathogens are a small minority.
- Treating generations as multiplication: $n$ generations multiply the population by $2^{n}$, not by $n$ or $2n$.
- Expecting antibiotics to cure a viral infection.

## Key points

- Taxonomy names and groups organisms; binomial names are *Genus species*. Ranks: domain, kingdom, phylum, class, order, family, genus, species.
- Modern classification aims to reflect ancestry and changes as DNA evidence comes in.
- Three domains, from rRNA comparisons: Bacteria, Archaea, Eukarya. Archaea lack peptidoglycan and share many molecular traits with eukaryotes; current evidence suggests eukaryotes arose from within the archaea.
- Bacteria divide by binary fission; $N = N_0 \times 2^{n}$ during exponential growth.
- Viruses need host cells; lytic cycles kill the host quickly, lysogenic cycles hide in its genome.
