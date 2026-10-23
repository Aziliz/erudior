---
id: bio-respiration
module: bio-m3
title: Cellular respiration and fermentation
minutes: 40
topics: [Cellular respiration, Fermentation]
drills: [bio-atp-yield, bio-respiration-mass, bio-fermentation-glucose]
refs: [bio-ref-cell-energy]
---
## Cashing in the sugar

Photosynthesis stores the Sun's energy in sugar. But a cell cannot use glucose directly to power a pump or a muscle; it needs ATP. **Cellular respiration** is the catabolic pathway that breaks down glucose (and other food molecules) and uses the released energy to make ATP. Every eukaryotic cell does it, plant cells included, and so do many prokaryotes.

The overall equation for aerobic respiration is the reverse of photosynthesis:

$$\text{C}_6\text{H}_{12}\text{O}_6 + 6\,\text{O}_2 \rightarrow 6\,\text{CO}_2 + 6\,\text{H}_2\text{O} + \text{energy (ATP and heat)}$$

Burning glucose in a flame gives the same products and the same total energy, about 2,870 kJ per mole. The difference is control. A flame releases it all at once as heat and light. A cell breaks glucose down in dozens of enzyme-catalyzed steps, stripping off electrons a few at a time with the carriers NAD⁺ and FAD (last lesson's redox ideas), and captures about a third of the energy as ATP.

**Aerobic** processes need oxygen; **anaerobic** ones do not. Respiration has three main stages, and only the first works without oxygen.

## Stage 1: glycolysis

**Glycolysis** ("sugar splitting") happens in the cytoplasm and needs no oxygen. In ten enzyme steps it splits one six-carbon glucose into two three-carbon molecules of pyruvate.

- Investment phase: the cell spends 2 ATP to phosphorylate glucose, making it reactive enough to split.
- Payoff phase: each three-carbon half yields 2 ATP and 1 NADH, so 4 ATP and 2 NADH in all.

Net result per glucose: 2 ATP (4 made − 2 spent), 2 NADH, and 2 pyruvate. Glycolysis is found in nearly every living cell, bacteria and archaea included, which suggests it evolved very early in the history of life, before oxygen was abundant in the atmosphere. The ATP in glycolysis is made by transferring a phosphate group directly from a substrate molecule to ADP, a process called substrate-level phosphorylation.

## Stage 2: pyruvate oxidation and the Krebs cycle

If oxygen is available, pyruvate enters the mitochondrion. In the matrix (the fluid inside the inner membrane), each pyruvate loses one carbon as CO₂, gives up electrons to NAD⁺, and is attached to a carrier molecule (coenzyme A) as a two-carbon **acetyl-CoA**.

Acetyl-CoA then enters the **Krebs cycle** (also called the citric acid cycle, worked out by Hans Krebs in 1937 using minced pigeon flight muscle). The two-carbon acetyl group joins a four-carbon molecule to make six-carbon citrate. Over eight steps, citrate loses two carbons as CO₂ and is rebuilt into the four-carbon starting molecule, so the cycle can turn again. Along the way it loads electrons onto carriers.

Per glucose (two turns, since one glucose makes two acetyl-CoA), pyruvate oxidation plus the Krebs cycle produce:

- 6 CO₂ in total (2 from pyruvate oxidation + 4 from the cycle). All six carbons of glucose have now left as CO₂; this is the CO₂ you exhale.
- 8 NADH (2 + 6) and 2 **FADH₂** (another electron carrier).
- 2 ATP.

So far, only 4 ATP have been made per glucose. Most of glucose's energy is now held as high-energy electrons in 10 NADH and 2 FADH₂.

## Stage 3: the electron transport chain and chemiosmosis

The inner mitochondrial membrane is folded into cristae, packed with an electron transport chain: a series of proteins that pass electrons from one to the next, like a bucket brigade, each holding them a little more tightly. NADH and FADH₂ drop off their electrons at the start of the chain.

1. As electrons move down the chain, they release energy in small steps. The proteins use it to pump H⁺ ions from the matrix into the intermembrane space, building a steep H⁺ gradient.
2. At the end of the chain, the electrons are handed to oxygen, which combines with H⁺ to form water. Oxygen is the final electron acceptor. This is the reason you need to breathe: without O₂ to clear electrons off the end of the chain, the whole chain backs up and stops.
3. H⁺ flows back into the matrix through ATP synthase, which turns like a tiny rotor and makes ATP from ADP and Pᵢ. This is chemiosmosis, the same mechanism as in the thylakoid.

Making ATP this way, powered by electron transport and an H⁺ gradient, is called **oxidative phosphorylation**, and it makes most of the cell's ATP. Peter Mitchell proposed chemiosmosis in 1961, when most biochemists expected a chemical intermediate instead; experiments in which an artificially imposed H⁺ gradient alone drove ATP synthesis helped convince them, and he received the 1978 Nobel Prize in Chemistry.

## The ATP total

Each NADH delivered to the chain yields about 2.5 ATP, and each FADH₂ about 1.5 ATP (FADH₂ enters the chain further along, so fewer H⁺ are pumped). Those figures are measured averages, not whole numbers, because the link between the chain and ATP synthase is a gradient, not a fixed recipe.

### Example 1

Add up the ATP from one glucose in a eukaryotic cell.

Step 1: Direct ATP: 2 (glycolysis) + 2 (Krebs) = 4.

Step 2: NADH: 2 (glycolysis) + 2 (pyruvate oxidation) + 6 (Krebs) = 10, and $10 \times 2.5 = 25$ ATP.

Step 3: FADH₂: $2 \times 1.5 = 3$ ATP.

Step 4: Total: $4 + 25 + 3 = 32$ ATP. In many cells, the two NADH from glycolysis (made in the cytoplasm) must pass their electrons into the mitochondrion through a shuttle that delivers them at the FADH₂ level, so they are worth 1.5 each. That brings the total to about 30. So the modern figure is about 30 to 32 ATP per glucose. Older textbooks give 36 or 38; those numbers assumed 3 ATP per NADH and 2 per FADH₂, before careful measurements lowered them.

```plot
{"x": [0, 4], "y": [0, 30], "xLabel": "stage", "yLabel": "ATP per glucose", "bars": [{"x": 1, "height": 2, "width": 0.7, "label": "glycolysis"}, {"x": 2, "height": 2, "width": 0.7, "label": "Krebs"}, {"x": 3, "height": 26, "width": 0.7, "label": "ETC"}], "caption": "Where the ATP comes from (about 30 per glucose): oxidative phosphorylation makes most of it"}
```

Efficiency: about 30 ATP × 30.5 kJ/mol ≈ 915 kJ out of 2,870 kJ, roughly 32%. The rest becomes heat, which is how birds and mammals keep warm.

## When there is no oxygen: fermentation

Without oxygen, the electron transport chain stops, so NADH cannot unload its electrons. The cell soon runs out of NAD⁺, and glycolysis, which needs NAD⁺, stops too. **Fermentation** solves this by passing NADH's electrons onto pyruvate (or a product made from it), regenerating NAD⁺ so glycolysis can keep making its 2 ATP per glucose. Fermentation itself makes no extra ATP; its job is to recycle NAD⁺.

- Lactic acid fermentation: pyruvate is reduced directly to lactate. Your muscle cells do this during hard sprinting when oxygen delivery cannot keep up, and bacteria such as Lactobacillus do it to turn milk into yogurt.
- Alcoholic fermentation: pyruvate loses CO₂ and is reduced to ethanol. Yeast do this; the CO₂ makes bread rise and the ethanol is the alcohol in beer and wine.

Louis Pasteur showed in the 1850s and 1860s that fermentation is carried out by living microorganisms, not a purely chemical process. He also noticed that yeast growing without air consumed sugar far faster than yeast with air (the Pasteur effect). The ATP numbers explain why: 2 ATP per glucose instead of about 30.

| | Aerobic respiration | Fermentation |
|---|---|---|
| Needs O₂? | Yes | No |
| Where (eukaryotes) | Cytoplasm, then mitochondria | Cytoplasm only |
| ATP per glucose | About 30–32 | 2 |
| End products | CO₂ + H₂O | Lactate, or ethanol + CO₂ |

### Example 2

Yeast cells need to make 120 ATP. How many glucose molecules must they use with oxygen (about 30 ATP each) and without oxygen (2 ATP each)? How many times as much glucose does fermentation need?

Step 1: With oxygen: $120 \div 30 = 4$ glucose.

Step 2: Without oxygen: $120 \div 2 = 60$ glucose.

Step 3: $60 \div 4 = 15$, so fermentation needs 15 times as much sugar for the same ATP. This is the Pasteur effect in numbers.

## Common mistakes

- Thinking only animals respire. Plants respire all the time; in light they also photosynthesize, usually faster, so they release O₂ overall.
- Thinking fermentation makes ATP of its own. Its ATP all comes from glycolysis; fermentation only regenerates NAD⁺.
- Thinking the oxygen you breathe becomes CO₂. The carbon and oxygen in exhaled CO₂ come from glucose (and water); inhaled O₂ ends up in water.
- Blaming lactic acid for muscle soreness a day or two after exercise. Lactate is cleared from muscle within about an hour; delayed soreness comes from small injuries to muscle fibers and the repair process.
- Giving "36 ATP" as an exact fact. About 30 (up to 32) is the current estimate, and it is an approximation.

## Key points

- $\text{C}_6\text{H}_{12}\text{O}_6 + 6\,\text{O}_2 \rightarrow 6\,\text{CO}_2 + 6\,\text{H}_2\text{O}$ + energy.
- Glycolysis (cytoplasm, anaerobic): glucose → 2 pyruvate, net 2 ATP and 2 NADH.
- Pyruvate oxidation and the Krebs cycle (mitochondrial matrix): release all 6 carbons as CO₂, make 2 ATP, 8 NADH, 2 FADH₂.
- Electron transport chain (inner membrane): electrons go to O₂, the final acceptor; the H⁺ gradient drives ATP synthase. Most ATP comes from here.
- About 30–32 ATP per glucose (older figures: 36–38).
- Fermentation regenerates NAD⁺ so glycolysis can continue: 2 ATP per glucose, producing lactate or ethanol + CO₂.
