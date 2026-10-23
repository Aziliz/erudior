---
id: bio-energy-atp
module: bio-m3
title: Energy, ATP, and metabolism
minutes: 30
topics: [Energy, ATP]
refs: [bio-ref-cell-energy]
---
## Why cells need a power supply

The last module showed you what a cell is built from: membranes, organelles, and the molecules from module 1. But a cell is not a statue. Every second it pumps ions across its membrane against their gradients, builds proteins one amino acid at a time, copies DNA, moves vesicles along its cytoskeleton, and, in a muscle cell, pulls protein filaments past each other. All of that is work, and work takes energy. A cell that stops supplying energy to these jobs dies within minutes.

This module is about where that energy comes from and how cells handle it. This lesson sets up the rules: what energy is, the laws it obeys, and the molecule cells use as their everyday energy currency, ATP. The next two lessons follow energy through photosynthesis (capturing it from light) and cellular respiration (releasing it from food).

## Forms of energy and the laws they obey

Energy is the capacity to do work or cause change. Biologists meet it in two broad forms. Kinetic energy is energy of motion: a contracting muscle, molecules jiggling (which we feel as heat), photons of light streaming from the Sun. Potential energy is stored energy, energy of position or arrangement. Water behind a dam has it; so does a concentration gradient across a membrane. For living things the most important kind is chemical energy, the potential energy stored in the arrangement of atoms and bonds in molecules such as glucose and fat.

Two laws of physics govern every energy change in a cell.

The **first law of thermodynamics** says energy is never created or destroyed, only converted from one form to another. A plant does not make energy; it converts light energy into chemical energy. You do not "burn up" energy when you run; you convert chemical energy in food into kinetic energy and heat.

The **second law of thermodynamics** says every energy conversion turns some energy into heat that is no longer available to do work, so the disorder (entropy) of the universe increases. No conversion is 100% efficient. A car engine turns roughly a quarter to a third of the energy in gasoline into motion; your cells capture roughly a third of the energy in glucose as ATP. The rest leaves as heat, which is why you are warm and why a crowded room heats up.

How can living things be so highly ordered if disorder always increases? Because an organism is an open system. It takes in high-quality energy (light or food) and releases heat and simple waste molecules. The order inside the organism is paid for by a larger increase in disorder in its surroundings. Life does not break the second law; it depends on a constant flow of energy to stay ahead of it.

## Metabolism: building up and breaking down

**Metabolism** is the sum of all the chemical reactions in an organism. These reactions are arranged in metabolic pathways, chains of steps each catalyzed by its own enzyme, where the product of one step is the starting material for the next. Breaking food down in many small steps lets the cell capture energy in usable amounts instead of releasing it all at once as heat, the way a fire does.

Pathways come in two kinds:

- **Catabolism** breaks large molecules into smaller ones and releases energy. Cellular respiration, which breaks glucose into carbon dioxide and water, is catabolic.
- **Anabolism** builds large molecules from smaller ones and requires energy. Making proteins from amino acids, or glucose from carbon dioxide in photosynthesis, is anabolic.

Chemists sort individual reactions the same way. An **exergonic reaction** releases free energy: its products hold less usable energy than its reactants, so it can happen on its own (though an enzyme may be needed to make it happen quickly). An **endergonic reaction** absorbs free energy: its products hold more energy than its reactants, so it cannot happen unless energy is supplied from somewhere else.

The difference shows up clearly on an energy diagram. Both kinds of reaction first have to climb over a hill, the activation energy you met with enzymes in module 1; what decides exergonic or endergonic is whether the products end up lower or higher than where the reactants started.

![Two energy diagrams side by side. In the exergonic reaction on the left, the curve rises over an activation-energy hill and ends at products lower than the reactants, with an arrow showing energy released. In the endergonic reaction on the right, the curve ends at products higher than the reactants, with an arrow showing energy absorbed.](images/m3-energy-diagram.svg)

Every cell faces the same problem. The reactions it needs most (building proteins, pumping ions, contracting muscle) are endergonic. The reactions that release energy (breaking down food) happen somewhere else, at a different time. The cell needs a go-between: a molecule that can be charged up by exergonic reactions and then spent to drive endergonic ones.

## ATP, the energy currency

That go-between is **ATP** (adenosine triphosphate). It is a nucleotide, close kin to the building blocks of RNA you met in module 1: the base adenine, the sugar ribose, and a chain of three phosphate groups.

![Diagram of ATP: a chain of three phosphate groups attached to the sugar ribose, which is attached to the double-ring base adenine. A bracket marks adenine plus ribose as adenosine, and a dashed line marks the bond to the last phosphate, which is broken in hydrolysis.](images/m3-atp.svg)

The drawing shows the layout. Adenine plus ribose is called adenosine; add the chain of phosphates and you have adenosine triphosphate. The three phosphates each carry negative charges, and they sit packed together, repelling one another. When water is used to break off the last phosphate (hydrolysis), ATP becomes **ADP** (adenosine diphosphate) plus a free phosphate group, written Pᵢ ("inorganic phosphate"):

$$\text{ATP} + \text{H}_2\text{O} \rightarrow \text{ADP} + \text{P}_i + \text{energy}$$

Under standard laboratory conditions this releases about 30.5 kJ per mole of ATP; under the conditions inside a living cell it is closer to 50 kJ/mol. The products are more stable than ATP, much as a compressed spring is less stable than a relaxed one.

ATP is a currency, not a savings account. A cell holds only a few seconds' to a minute's worth of ATP at a time and remakes it constantly from ADP and phosphate. Adding a phosphate group to a molecule is called phosphorylation, and regenerating ATP this way is endergonic: it needs the energy released by breaking down food (or, in a plant, captured from light). The ATP cycle runs nonstop: catabolism charges ADP into ATP, and the cell's work discharges ATP back to ADP. A resting adult recycles roughly their own body mass of ATP every day, even though only about 50 grams or so exist in the body at any moment.

```shape
{"circles": [{"center": [0, 3], "r": 1.1}, {"center": [0, -3], "r": 1.1}], "labels": [{"at": [0, 3], "text": "ATP"}, {"at": [0, -3], "text": "ADP + Pi"}, {"at": [-4.6, 0.6], "text": "energy from food"}, {"at": [-4.6, -0.2], "text": "or light"}, {"at": [4.6, 0.6], "text": "energy for work:"}, {"at": [4.6, -0.2], "text": "pumps, muscle, synthesis"}], "segments": [{"from": [-1.3, -2.4], "to": [-1.3, 2.4], "arrow": true}, {"from": [1.3, 2.4], "to": [1.3, -2.4], "arrow": true}], "caption": "The ATP cycle: catabolism recharges ADP into ATP; cellular work spends ATP back to ADP"}
```

## Energy coupling: how ATP drives uphill reactions

If ATP simply split in water, the energy would be lost as heat. The trick is **energy coupling**: the cell links ATP hydrolysis directly to an endergonic process, usually by transferring the phosphate group onto another molecule. The phosphorylated molecule is less stable, more reactive, and now able to do what it could not do before.

Two examples show the idea.

- The sodium–potassium pump in your cell membranes (an active transport protein from the last module) is phosphorylated by ATP. The phosphate changes the pump's shape so it releases three Na⁺ ions outside the cell; losing the phosphate changes it back so it carries two K⁺ ions in.
- Joining glutamic acid and ammonia to make the amino acid glutamine is endergonic on its own. The cell first phosphorylates glutamic acid using ATP, then ammonia replaces the phosphate. The overall coupled process releases free energy, so it goes.

The rule for coupling is simple bookkeeping: a coupled process can proceed if the energy released by the ATP step is greater than the energy the endergonic step requires.

### Example 1

A reaction in a cell requires 21 kJ/mol to proceed. Hydrolysis of ATP releases about 30.5 kJ/mol under standard conditions. Can coupling to one ATP drive this reaction? What if the reaction needed 45 kJ/mol?

Step 1: Compare. The ATP step releases 30.5 kJ/mol; the reaction needs 21 kJ/mol. The net change is $-30.5 + 21 = -9.5$ kJ/mol. A negative total means energy is released overall, so the coupled process can proceed.

Step 2: For a reaction needing 45 kJ/mol, one ATP gives $-30.5 + 45 = +14.5$ kJ/mol, still uphill. The cell would need to couple it to two ATP hydrolyses ($-61 + 45 = -16$ kJ/mol), which is what many biosynthetic pathways actually do.

## Carrying electrons: NAD⁺ and NADP⁺

Breaking down food releases energy mainly by moving electrons. When glucose is broken down, its electrons (with hydrogen atoms) are stripped off and passed to oxygen, which holds them far more tightly. A reaction that moves electrons from one molecule to another is a redox reaction. Losing electrons is **oxidation**, and the molecule that loses them is said to be oxidized; gaining electrons is **reduction**, and the molecule that gains them is reduced. A memory aid: OIL RIG, "oxidation is loss, reduction is gain."

Cells do not hand electrons straight from glucose to oxygen; that would release energy in one uncontrolled burst. Instead, an electron carrier picks them up and delivers them later. The main carrier in respiration is NAD⁺, which accepts two electrons and a hydrogen ion to become **NADH**. Photosynthesis uses a close relative, NADP⁺, which becomes **NADPH**. Think of NADH and NADPH as charged batteries carrying high-energy electrons between pathways.

### Example 2

During one step of glucose breakdown, a molecule of malate is converted to oxaloacetate while NAD⁺ is converted to NADH. Which molecule is oxidized, and which is reduced?

Step 1: Follow the electrons. NAD⁺ gains two electrons (and a hydrogen ion) to become NADH. Gaining electrons is reduction, so NAD⁺ is reduced.

Step 2: Those electrons must have come from somewhere. Malate loses them, so malate is oxidized.

Step 3: Check the energy. Electrons carried by NADH are high-energy electrons; the cell will later "cash them in" to make ATP. So the energy has moved from malate into NADH.

## Common mistakes

- Saying ATP's bonds "store" energy that is released when they break. Breaking any bond takes energy. ATP hydrolysis releases energy because the products (ADP, phosphate, and their interaction with water) are much more stable than ATP. "High-energy bond" is a shorthand, not a literal description.
- Thinking plants make energy, or that energy is used up. Energy is converted, never created or destroyed; it eventually leaves as heat.
- Thinking cells store large amounts of ATP. They store energy as glycogen, starch, and fat, and remake ATP from ADP continuously.
- Mixing up oxidized and reduced. NADH is the reduced (electron-carrying) form; NAD⁺ is the oxidized (empty) form.
- Confusing catabolic with anabolic. Catabolic breaks down and releases energy; anabolic builds up and costs energy.

## Key points

- Energy is kinetic (motion, heat, light) or potential (position, gradients, chemical bonds).
- First law: energy is converted, never created or destroyed. Second law: every conversion loses some energy as heat, so living things need a constant energy input.
- Metabolism = catabolism (breakdown, releases energy) + anabolism (synthesis, requires energy).
- ATP → ADP + Pᵢ releases about 30.5 kJ/mol (standard conditions); cells regenerate ATP constantly.
- Energy coupling: ATP's phosphate is transferred to another molecule to drive an endergonic process.
- Redox: oxidation is loss of electrons, reduction is gain. NADH and NADPH carry high-energy electrons between pathways.
