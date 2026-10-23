---
id: bio-cancer
module: bio-m4
title: Regulating the cell cycle; cancer and stem cells
minutes: 35
topics: [Cell cycle regulation, Cancer, Stem cells]
drills: [bio-doubling, bio-doubling-time]
refs: [bio-ref-lab]
---
## Knowing when to divide

The last lesson showed how a cell divides. Just as important is when. A skin cell near a cut should divide until the wound closes and then stop. A nerve cell in your brain should almost never divide. If cells divided whenever they could, your body would lose its shape and function; if they never divided, wounds would not heal. This lesson is about the control system that makes these decisions, what happens when it breaks (cancer), and the special cells that keep supplying new cells for the body (stem cells).

## Checkpoints: the cycle's inspections

The cell cycle has built-in inspection points called **checkpoints**, where the cell checks conditions and either continues or stops. There are three major ones.

- *G1 checkpoint.* Is the cell big enough? Are there enough nutrients? Have neighboring cells sent signals to divide? Is the DNA undamaged? In many cells this is the main decision point. A cell that does not get the go-ahead may leave the cycle and enter a non-dividing state called G0. Mature nerve cells and heart muscle cells stay in G0 essentially for life; liver cells sit in G0 but can be called back into the cycle after an injury.
- *G2 checkpoint.* Has all the DNA been copied, and copied correctly? Damaged DNA is repaired before the cell is allowed into mitosis.
- *Spindle (metaphase) checkpoint.* Is every chromosome attached to spindle fibers from both poles? Anaphase is delayed until they are, so that each daughter cell gets exactly one copy of every chromosome.

If the damage at a checkpoint is too great to fix, the cell can trigger **apoptosis**, a tidy, programmed cell death in which the cell dismantles itself and is eaten by neighbors without causing inflammation. Apoptosis also sculpts the body during development: the webbing between your fingers disappeared before birth by apoptosis.

## The molecular clock: cyclins and CDKs

How does a cell "decide"? In 1970 Potu Rao and Robert Johnson fused pairs of cultured human cells at different stages into single cells with two nuclei. When an S-phase cell was fused with a G1 cell, the G1 nucleus immediately began copying its DNA, ahead of schedule. When a mitotic cell was fused with an interphase cell, the interphase nucleus's chromosomes began to condense, as in prophase. The conclusion: the cytoplasm contains chemical signals that drive the cell into the next phase.

Those signals turned out to be two kinds of proteins working together. **Cyclins** are proteins whose concentration rises and falls in each cycle; Tim Hunt discovered them in sea urchin eggs, where one protein built up steadily and then vanished at every division. Cyclin-dependent kinases (**CDKs**) are enzymes that are present all the time but active only when bound to a cyclin. An active cyclin–CDK complex adds phosphate groups to target proteins (phosphorylation, from lesson 11), switching on the machinery for the next phase. Destroying the cyclin switches the CDK off again. Different cyclin–CDK pairs act at different points; the one that triggers mitosis was first detected in frog eggs as "maturation-promoting factor." Leland Hartwell, Tim Hunt, and Paul Nurse shared the 2001 Nobel Prize for this work.

```plot
{"x": [0, 48], "y": [0, 1.2], "xLabel": "time (hours)", "yLabel": "relative level", "functions": [{"f": "0.5 - 0.5*cos(pi*mod(x,24)/24.5)", "label": "M cyclin"}, {"f": "0.35", "label": "CDK", "dashed": true}], "labels": [{"at": [24, 1.1], "text": "mitosis"}, {"at": [47, 1.1], "text": "mitosis"}], "caption": "Cyclin builds up through interphase and is destroyed at mitosis; the CDK level stays roughly constant"}
```

Signals from outside the cell also matter. Growth factors are proteins released by other cells that bind receptors on the cell's surface and push it past the G1 checkpoint. Platelets release one at a wound, which is part of why cells there start dividing. Normal cells in a dish also show density-dependent inhibition: they divide until they form a single layer touching their neighbors, then stop.

## Cancer: division without control

**Cancer** is a group of diseases in which cells divide uncontrollably, ignoring the checkpoints and signals that restrain normal cells, and can invade other tissues. It is caused by changes (mutations) in the genes that control the cell cycle. Two kinds of genes are involved.

- **Proto-oncogenes** code for proteins that stimulate division, such as growth-factor receptors and the RAS protein that relays their signal. They are the cell's gas pedal. A mutation that makes such a gene overactive turns it into an **oncogene**, like a stuck accelerator. One mutated copy is enough to push the cell to divide.
- **Tumor suppressor genes** code for proteins that slow or stop division, repair DNA, or trigger apoptosis. They are the brakes. The most famous is p53, which halts the cycle at G1 when DNA is damaged and triggers apoptosis if repair fails; it is mutated in about half of all human cancers. Because one working copy usually still brakes, both copies must be damaged.

In 1971 Alfred Knudson studied retinoblastoma, a rare eye cancer in children. Children with the inherited form often got tumors in both eyes, at a young age; children with the non-inherited form got a single tumor, later. Knudson's "two-hit" explanation: inherited cases start life with one damaged copy of a tumor suppressor gene (later identified as RB) in every cell, so a single new mutation in any retinal cell is enough. Non-inherited cases need two separate mutations in the same cell, which is much less likely.

One mutation is almost never enough. Most cancers need several, in both kinds of genes, which is one reason cancer risk rises sharply with age. Mutations come from copying errors, from mutagens such as tobacco smoke and ultraviolet light, and from certain viruses (for example, some types of HPV cause cervical cancer, which is why the HPV vaccine prevents many cases). Some people inherit a mutation that raises their risk, such as a faulty BRCA1 gene.

A mass of abnormally dividing cells is a tumor. A benign tumor stays in one place and can often be removed completely. A malignant tumor invades nearby tissue, and its cells can break away, travel in blood or lymph, and form new tumors elsewhere, a spread called **metastasis**. Most cancer deaths are caused by metastasis. Treatments include surgery, radiation and chemotherapy (which damage rapidly dividing cells, explaining side effects in hair follicles and the gut lining), and newer drugs targeting specific mutated proteins or helping the immune system attack cancer cells.

### Example 1

A tumor becomes detectable at about 1 billion ($10^9$) cells. Starting from a single cell, how many doublings does this take? If the cells double every 60 days, how long does it take?

Step 1: After $n$ doublings, one cell becomes $2^n$ cells. We need $2^n \approx 10^9$.

Step 2: $2^{10} = 1024 \approx 10^3$, so $2^{30} = (2^{10})^3 \approx 10^9$. About 30 doublings. (Exactly: $2^{30} = 1{,}073{,}741{,}824$.)

Step 3: Time: $30 \times 60 = 1800$ days, about 4.9 years. A tumor can grow silently for years before it is found. And only 10 more doublings give $2^{40} \approx 10^{12}$ cells, roughly a kilogram of tissue. This is why early detection matters.

### Example 2

Researchers grow two cultures of cells. Culture A has a mutation that leaves RAS permanently switched on. Culture B has lost both copies of p53. Both are exposed to a dose of radiation that damages DNA. Predict what happens in each, compared with normal cells.

Step 1: Normal cells: p53 detects the DNA damage, halts the cycle at G1 for repair, and triggers apoptosis in cells that cannot be repaired.

Step 2: Culture A: RAS keeps sending a "divide" signal even without growth factors, but p53 still works. Damaged cells are still stopped or eliminated, so the damage is mostly not passed on, even though the cells divide too often.

Step 3: Culture B: there is no p53 brake. Damaged cells keep dividing and pass on new mutations, so this culture accumulates mutations much faster. This is why p53 is called the "guardian of the genome."

## Stem cells

Most of your cells are specialized and divide rarely, if at all. **Stem cells** are unspecialized cells that can divide to renew themselves and can also produce cells that specialize (differentiate). They differ in how many cell types they can become, their potency:

| Potency | Can become | Example |
|---|---|---|
| Totipotent | Every cell type, including the placenta | Zygote and the first few cells of an embryo |
| **Pluripotent** | Every cell type of the body | Embryonic stem cells from an early embryo |
| Multipotent | Several related cell types | Blood stem cells in bone marrow |

Adult stem cells, such as those in bone marrow and the skin, replace cells that wear out; bone marrow transplants treat leukemia by supplying healthy blood stem cells. In 2006 Shinya Yamanaka showed that adding just four genes could reprogram ordinary skin cells into induced pluripotent stem cells (**iPSCs**), which behave much like embryonic stem cells; he shared the 2012 Nobel Prize. iPSCs avoid the use of embryos, which some people object to on ethical grounds, and can be made from a patient's own cells.

## Common mistakes

- Calling cancer a single disease with a single cause. It is many diseases, each driven by several mutations.
- Mixing up oncogenes and tumor suppressors. Oncogenes are overactive accelerators (one copy enough); tumor suppressors are lost brakes (usually both copies).
- Thinking all tumors are cancer. Benign tumors do not invade or spread.
- Thinking G0 cells are dead or dormant. They are fully active; they just are not dividing.
- Thinking adult stem cells can become anything. Most are multipotent.

## Key points

- Checkpoints at G1, G2, and the spindle (metaphase) check size, signals, DNA integrity, and chromosome attachment.
- Cyclins rise and fall; they activate CDKs, which phosphorylate targets to move the cycle forward.
- Cancer: uncontrolled division from accumulated mutations in proto-oncogenes (become oncogenes) and tumor suppressor genes (such as p53).
- Malignant tumors invade and metastasize; benign tumors do not.
- Stem cells self-renew and differentiate: totipotent, pluripotent, multipotent; iPSCs are reprogrammed body cells.
