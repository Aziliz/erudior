---
id: bio-h-early-development
module: bio-h2
title: From zygote to embryo
minutes: 45
honors: true
topics: [Embryonic development]
drills: [bio-h-cleavage-cells]
refs: [bio-ref-lab]
---
The core course showed the end points of development: meiosis makes gametes (lesson 16), cells differentiate (lesson 10), and bilateral animals are built from three tissue layers (lesson 34). This module fills in what happens in between. This first lesson follows the physical events of the first few weeks: fertilization, the rapid divisions called cleavage, the hollow ball called the blastula, the great cell movements of gastrulation, and the folding of the nervous system. Most of it was learned from sea urchins, frogs, chicks and mice, which we will compare with humans as we go.

## Fertilization: one cell, two genomes, a switch

**Fertilization** is the fusion of a sperm and an egg to form a single diploid cell, the **zygote**. It does three jobs at once: it combines a maternal and a paternal genome, it makes sure only one sperm gets in, and it wakes the egg up from a metabolically quiet state.

Sea urchins showed the steps most clearly, because they release eggs and sperm into seawater and fertilization can be watched under a microscope.

1. *Recognition.* When the sperm meets the jelly coat around the egg, the vesicle at its tip releases enzymes that digest a path through the coat, and actin filaments push out a thin process carrying a binding protein. This is the **acrosome reaction**. The binding protein (bindin in sea urchins) sticks only to receptors on eggs of the same species, one reason different species living in the same water don't cross-fertilize.
2. *Fusion.* The sperm and egg membranes fuse, and the sperm nucleus enters.
3. *Fast block to polyspermy.* Within a few seconds, ion channels open and the egg's membrane voltage jumps from about −70 mV to positive values. Sperm cannot fuse with a positively charged sea urchin egg membrane. This block is temporary.
4. *Slow block.* Sperm entry releases calcium ions from the egg's endoplasmic reticulum, and a wave of calcium crosses the egg in less than a minute. The calcium makes thousands of cortical granules just under the membrane fuse with it and dump their contents outside. This **cortical reaction** lifts and hardens a fertilization envelope that no further sperm can cross.
5. *Activation.* The same calcium wave switches on protein synthesis and DNA replication. Eggs can even be activated artificially by injecting calcium, without any sperm.

One sperm per egg matters: an egg entered by two sperm has three chromosome sets and an extra centriole, builds a four-poled spindle, and develops abnormally.

Mammals differ in details. Human sperm must first spend hours in the female reproductive tract, a maturation step called capacitation. They then bind the zona pellucida, a protein coat around the egg, and fertilization usually happens in the oviduct within about a day of ovulation. Mammalian eggs show no clear electrical fast block; instead, cortical granules modify the zona pellucida so that it stops binding sperm.

## Cleavage: dividing without growing

The zygote now divides rapidly by mitosis. These early divisions are called **cleavage** and the resulting cells **blastomeres**. Cleavage is unusual: the cell cycle skips most of G1 and G2 and the embryo does not grow, so the egg's cytoplasm is chopped into ever smaller cells.

How the egg cleaves depends mostly on its yolk, the stored food that gets in the way of the cleavage furrow.

| Animal | Yolk | Cleavage pattern | Result |
|---|---|---|---|
| Sea urchin | Little, evenly spread | Complete (holoblastic), equal | Hollow blastula of equal-sized cells |
| Frog | Moderate, concentrated in the lower (vegetal) half | Complete but unequal | Small cells on top (animal pole), large yolky cells below |
| Chick | Huge; the "yolk" is the egg cell | Partial (meroblastic): only a small disc on top divides | Flat disc of cells on the yolk |
| Human, mouse | Very little | Complete, slow, with its own orientation | Morula, then blastocyst |

In a complete (holoblastic) pattern the furrows cut through the whole egg; in a partial (meroblastic) pattern they cannot cut through the yolk, so only a thin cap of cytoplasm divides.

![Cleavage from a zygote to a blastula: one cell, then 2, 4 and 8 cells, a solid ball of cells, and a cut-open hollow ball with a fluid-filled cavity.](images/h2-cleavage.svg)

As the drawing shows, cleavage ends in a **blastula**, a ball of cells surrounding a fluid-filled cavity, the **blastocoel**. In a sea urchin the blastula forms around the 128-cell stage, and after about ten rounds of division (roughly a thousand cells) it grows cilia, hatches from the fertilization envelope and swims.

### The switch to the embryo's own genes

During early cleavage the embryo runs almost entirely on proteins and mRNAs the mother loaded into the egg. Its own genes are nearly silent. In the frog *Xenopus*, the first twelve divisions are fast and synchronous, about 30 minutes each after the first. Then, at about 4,000 cells, divisions slow, become unsynchronized, and the embryo begins transcribing its own genes. This is the **midblastula transition**. In 1982 John Newport and Marc Kirschner showed what triggers it: the ratio of DNA to cytoplasm. When they injected extra DNA into eggs, the transition came earlier; eggs constricted so that one half had no nucleus for a while reached it later in that half. Each cleavage doubles the DNA without adding cytoplasm, so the ratio climbs until it crosses a threshold. In humans, the embryo's genome switches on after far fewer divisions, mainly at about the 4- to 8-cell stage (around day 3).

### Example 1: Counting cells and shrinking cells

A *Xenopus* egg is about 1.2 mm across. Assume the cleavages are synchronous and the embryo's total volume stays constant. (a) How many cells are there after 12 cleavage divisions? (b) What is the average diameter of a cell then?

Step 1: Each division doubles the number of cells, so after $n$ divisions there are $2^n$ cells. $2^{12} = 4096$ cells, which is where the midblastula transition happens.

Step 2: The volume of each cell is the egg's volume divided by $2^{12}$. Volume scales as diameter cubed, so diameter scales as the cube root of volume:

$$d_{\text{cell}} = \frac{d_{\text{egg}}}{\left(2^{12}\right)^{1/3}} = \frac{1.2 \text{ mm}}{2^{4}} = \frac{1.2 \text{ mm}}{16} = 0.075 \text{ mm}$$

Step 3: That is 75 µm, still a large cell (a typical human body cell is 10–20 µm). Every three divisions halve a cell's diameter, because $2^3 = 8$ and $8^{1/3} = 2$. This is why cleavage is a good way to turn one giant cell into many cells of normal size without any growth.

## The mammalian version: the blastocyst

Mammalian cleavage is slow (about one division a day at first in humans) and the embryo travels down the oviduct while it divides. At about the 8-cell stage the blastomeres flatten against each other and form tight junctions, a step called compaction. By day 4 a solid ball of 16 or more cells, the morula, reaches the uterus. Fluid is then pumped into the middle, and by day 5 the embryo is a **blastocyst**: an outer layer, the **trophoblast**, which will form the embryo's part of the placenta, around a cavity with a small cluster of cells on one side, the **inner cell mass**. Only the inner cell mass becomes the body itself. The blastocyst hatches from the zona pellucida and begins to implant in the uterine wall at about day 6 or 7. The inner cell mass is also the source of embryonic stem cells (lesson 47).

## Gastrulation: building the layers

Next comes **gastrulation**, a period of coordinated cell movements that rearranges the blastula into three layers of cells and sets up the body's axes. The biologist Lewis Wolpert put it famously: it is not birth, marriage or death, but gastrulation, which is truly the most important time in your life.

The three layers are the **germ layers**:

- **Ectoderm**, the outer layer;
- **Mesoderm**, the middle layer;
- **Endoderm**, the inner layer, which lines the gut.

Sea urchins gastrulate most simply. Cells at the bottom (vegetal) pole of the blastula slip inward as individual cells that will make the skeleton. Then the vegetal sheet of cells buckles inward, like a finger pushed into a soft ball, forming a tube called the **archenteron**, the primitive gut. Its opening is the **blastopore**. The archenteron stretches across the blastocoel until it meets the far wall, where the mouth breaks through. The blastopore becomes the anus, the deuterostome pattern you met in lesson 34.

![A cut-open sea urchin gastrula: an outer layer of cells, an inner tube folding in from an opening at the bottom, loose cells in the cavity between them, and the remaining fluid-filled cavity.](images/h2-gastrula.svg)

Frogs, chicks and humans reach the same three-layer result in different ways because of their different shapes:

- *Frog:* cells roll inward over the upper edge of a slit-like blastopore (its "dorsal lip") and spread along the inside, while cells on the outside spread down to cover the whole embryo.
- *Chick:* the embryo is a flat disc, so there is no ball to fold. Instead, cells pile up along a groove down the midline called the **primitive streak** and move down through it to form the lower layers. A knot of cells at the front end of the streak (Hensen's node) does the job of the frog's dorsal lip.
- *Human:* the inner cell mass becomes a flat disc, much like the chick's, and gastrulates through a primitive streak in the third week after fertilization (the streak appears around day 14–15).

| Germ layer | Main derivatives in vertebrates |
|---|---|
| Ectoderm | Epidermis of the skin, hair, nails, tooth enamel; brain, spinal cord and nerves; lens of the eye; neural crest derivatives |
| Mesoderm | Notochord; skeletal, heart and smooth muscle; bone and cartilage; dermis; heart, blood and blood vessels; kidneys; gonads |
| Endoderm | Lining of the gut and its glands; liver and pancreas; lining of the lungs and airways; thyroid; lining of the bladder |

## Neurulation: making the nervous system

In vertebrates, the mesoderm along the back forms the **notochord**, a stiff rod that gave chordates their name. The notochord sends signals to the ectoderm above it, which thickens into a neural plate. In **neurulation**, the edges of the plate rise into folds, curl toward each other and fuse, pinching off a hollow **neural tube** beneath the surface ectoderm. The front of the tube becomes the brain and the rest the spinal cord. Beside the tube, mesoderm splits into blocks called **somites**, which form the vertebrae, the muscles of the back and limbs, and the dermis.

![Three cross-sections of a vertebrate embryo's back during neurulation: a flat thickened plate over a rod, folds rising on both sides, and a closed tube under the skin with cell blocks on each side.](images/h2-neurulation.svg)

Where the folds meet, a band of cells breaks away: the **neural crest**. These cells migrate all over the embryo and become an astonishing range of tissues: pigment cells of the skin, the neurons and glia of the peripheral nervous system, the adrenal medulla, and much of the cartilage and bone of the face. Because they come from the ectoderm but behave so independently, some biologists call the neural crest a "fourth germ layer." It also explains why some inherited conditions combine unrelated-looking problems: mice whose neural crest cells fail to migrate far have both white patches in their fur (no pigment cells) and a lower gut with no nerve cells, because both cell types come from the same migrating population.

### Example 2: Timing and folic acid

The human neural tube closes by about day 28 after fertilization. If it fails to close at the lower end, the result is spina bifida; failure at the head end causes anencephaly. Taking 400 micrograms of folic acid every day before and during early pregnancy greatly lowers the risk. Pregnancy is usually dated from the first day of the last menstrual period, which is about two weeks before fertilization. Why do public health agencies recommend folic acid for everyone who could become pregnant, not just those who know they are pregnant?

Step 1: Convert to the usual dating. Day 28 after fertilization is about 28 + 14 = 42 days, or 6 weeks, after the last menstrual period.

Step 2: A missed period is often the first sign of pregnancy, at about 4 weeks on that scale, and many people find out later than that.

Step 3: So the window when the neural tube closes overlaps the time when many people don't yet know they are pregnant. Folic acid has to be in the body already. This is why the U.S. Centers for Disease Control and Prevention recommends daily folic acid for anyone who could become pregnant, and why many countries add folic acid to flour.

## Common mistakes

- Thinking the embryo grows during cleavage. Cell number rises but total size does not; cells get smaller.
- Mixing up blastula and blastocyst. The blastocyst is the mammalian version, with a trophoblast and an inner cell mass; only the inner cell mass becomes the body.
- Calling the blastopore the mouth in all animals. In deuterostomes, including vertebrates, it becomes the anus.
- Putting the nervous system in the mesoderm. Brain, spinal cord and nerves come from ectoderm; the notochord, muscles and kidneys come from mesoderm.
- Thinking the lungs come from mesoderm because they are deep inside. Their lining comes from endoderm, as an outgrowth of the gut.
- Assuming the embryo's genes are active from the start. Early development runs largely on maternal mRNA and proteins.

## Key points

- Fertilization: acrosome reaction, membrane fusion, a fast electrical block (sea urchins) and a slow block from the calcium-triggered cortical reaction, then egg activation.
- Cleavage: rapid divisions without growth; the pattern depends on yolk (complete in sea urchin, frog and mammal; partial in chick). After $n$ divisions there are $2^n$ cells.
- The blastula is a ball of cells around a blastocoel; the mammalian blastocyst has a trophoblast and an inner cell mass.
- Gastrulation moves cells into three germ layers: ectoderm (skin, nervous system), mesoderm (muscle, bone, blood, kidneys), endoderm (gut lining and its organs).
- The notochord induces the neural plate to fold into the neural tube; neural crest cells migrate widely; somites form beside the tube.
