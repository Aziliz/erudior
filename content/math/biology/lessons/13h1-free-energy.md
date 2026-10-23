---
id: bio-h-free-energy
module: bio-m3
title: Free energy, coupled reactions, and redox
minutes: 45
topics: [Bioenergetics]
drills: [bio-h-delta-g-cell, bio-h-redox-energy]
refs: [bio-ref-cell-energy]
honors: true
---
## Putting numbers on "downhill"

In the core lessons you sorted reactions into exergonic (they release free energy and can go on their own) and endergonic (they need an input), and you added up kilojoules to decide whether ATP could drive a reaction. This honors lesson puts that bookkeeping on a firmer footing. You will see what "free energy" actually measures, why the same reaction can be uphill in a test tube and downhill in a cell, and how the energy carried by electrons in NADH can be calculated from a table of voltages. These are the tools biochemists use to explain why metabolic pathways run the way they do, and you will need them for the next honors lesson on electron transport and chemiosmosis.

## Gibbs free energy

Whether a reaction can happen on its own depends on two things. One is the change in heat content, the **enthalpy** change, $\Delta H$: forming strong bonds releases heat ($\Delta H$ negative), breaking them absorbs it. The other is the change in **entropy**, $\Delta S$, a measure of how many ways the energy and matter in a system can be arranged; more freedom (one molecule splitting into two, a solid dissolving, ordered water molecules being released) means higher entropy.

The American physicist J. Willard Gibbs showed in the 1870s that the two combine into a single quantity, the **Gibbs free energy** change:

$$\Delta G = \Delta H - T\,\Delta S$$

where $T$ is the absolute temperature in kelvins. $\Delta G$ is the energy that is free to do work at constant temperature and pressure, which is exactly the situation inside a cell. The rule is simple:

- $\Delta G < 0$: the reaction can proceed forward on its own (exergonic).
- $\Delta G > 0$: it cannot proceed forward unless energy is supplied (endergonic); the reverse reaction is the favorable one.
- $\Delta G = 0$: the reaction is at equilibrium; no net change happens in either direction.

Two warnings. First, "can proceed" says nothing about speed. Glucose sitting in air has a hugely negative $\Delta G$ for burning, yet it sits there for years, because the activation energy is high. Enzymes change the speed, never the $\Delta G$. Second, $\Delta G$ explains why living things can build order. Folding a protein lowers its entropy, but it releases water molecules that were held in a cage around its nonpolar side chains, and the gain in their entropy can outweigh the loss. Order in one place is paid for by disorder somewhere else.

## Standard conditions and the reaction quotient

Tables list the **standard free energy change**, written $\Delta G^{\circ\prime}$: the $\Delta G$ when every reactant and product is at 1 M concentration, at pH 7 (the prime marks the biochemists' pH 7 convention) and usually 25 °C. That is a reference point, not what happens in a cell, where concentrations are millimolar or less and far from equal.

The actual free energy change depends on the concentrations through the **reaction quotient**, $Q$: the product concentrations multiplied together, divided by the reactant concentrations multiplied together (water is left out). For $\text{A} + \text{B} \rightarrow \text{C} + \text{D}$, $Q = \dfrac{[\text{C}][\text{D}]}{[\text{A}][\text{B}]}$. Then

$$\Delta G = \Delta G^{\circ\prime} + RT \ln Q$$

with $R = 8.314 \times 10^{-3}$ kJ/(mol·K). At body temperature (310 K), $RT \approx 2.58$ kJ/mol; at 25 °C it is about 2.48 kJ/mol.

Read the formula like this: when products are scarce compared with reactants ($Q$ small), $\ln Q$ is negative and the reaction is pushed forward; when products pile up, it is pushed back. At equilibrium $\Delta G = 0$ and $Q$ equals the **equilibrium constant** $K'$, so

$$\Delta G^{\circ\prime} = -RT \ln K'$$

Every 5.7 kJ/mol of $\Delta G^{\circ\prime}$ (at 25 °C) is a factor of 10 in $K'$. A reaction with $\Delta G^{\circ\prime} = -30.5$ kJ/mol, like ATP hydrolysis, has $K'$ of about $2 \times 10^{5}$: at equilibrium there would be hundreds of thousands of times more ADP and phosphate than ATP.

### Example 1

A muscle cell at 37 °C holds 3.0 mM ATP, 0.30 mM ADP and 2.0 mM phosphate. Using $\Delta G^{\circ\prime} = -30.5$ kJ/mol, find the actual $\Delta G$ of ATP hydrolysis.

Step 1: Write $Q$ with concentrations in mol/L: $Q = \dfrac{[\text{ADP}][\text{P}_i]}{[\text{ATP}]} = \dfrac{(0.30 \times 10^{-3})(2.0 \times 10^{-3})}{3.0 \times 10^{-3}} = 2.0 \times 10^{-4}$.

Step 2: $RT \ln Q = 2.577 \times \ln(2.0 \times 10^{-4}) = 2.577 \times (-8.52) = -21.95$ kJ/mol.

Step 3: $\Delta G = -30.5 + (-21.95) \approx -52$ kJ/mol.

The cell keeps ATP about ten times more concentrated than ADP, far from equilibrium, and that makes each ATP worth roughly 50 kJ/mol instead of 30.5. This is where the core lesson's "closer to 50 kJ/mol inside a cell" comes from. A cell whose ATP:ADP ratio collapses loses not only ATP but also the punch of each remaining ATP.

## Coupling, done properly

Free energy changes of reactions that share an intermediate simply add, because $G$ depends only on the state of the molecules, not on the route taken. That is the real basis of energy coupling. The first step of glycolysis is the standard example.

Joining phosphate to glucose on its own is uphill:

$$\text{glucose} + \text{P}_i \rightarrow \text{glucose-6-phosphate} + \text{H}_2\text{O} \qquad \Delta G^{\circ\prime} = +13.8 \text{ kJ/mol}$$

The enzyme hexokinase never actually lets free phosphate react. It holds glucose and ATP side by side and moves the phosphate group straight from ATP to glucose. The overall reaction is the sum of the uphill step and ATP hydrolysis:

$$\text{glucose} + \text{ATP} \rightarrow \text{glucose-6-phosphate} + \text{ADP} \qquad \Delta G^{\circ\prime} = 13.8 - 30.5 = -16.7 \text{ kJ/mol}$$

![Three free energy diagrams drawn to scale. Joining phosphate to glucose rises 13.8 kJ/mol. ATP hydrolysis falls 30.5 kJ/mol. The coupled reaction, glucose plus ATP giving glucose-6-phosphate plus ADP, falls 16.7 kJ/mol.](images/m3-coupling.svg)

### Example 2

How much does coupling change the equilibrium? Use $RT = 2.48$ kJ/mol (25 °C).

Step 1: Uncoupled: $K' = e^{-\Delta G^{\circ\prime}/RT} = e^{-13.8/2.48} = e^{-5.57} \approx 0.0038$. At equilibrium the glucose would be almost entirely unphosphorylated.

Step 2: Coupled: $K' = e^{16.7/2.48} = e^{6.73} \approx 840$. Now the reaction runs essentially to completion.

Step 3: The ratio $840 / 0.0038 \approx 2 \times 10^{5}$ is the equilibrium constant of ATP hydrolysis itself. Coupling multiplies equilibrium constants, because it adds free energies, and adding logarithms multiplies the numbers.

## Phosphoryl-transfer potential: why ATP sits in the middle

Phosphate groups attached to different molecules release different amounts of free energy when removed:

| Compound | $\Delta G^{\circ\prime}$ of hydrolysis (kJ/mol) |
|---|---|
| Phosphoenolpyruvate (PEP) | −61.9 |
| 1,3-Bisphosphoglycerate | −49.3 |
| Phosphocreatine | −43.0 |
| ATP (to ADP + Pᵢ) | −30.5 |
| Glucose-6-phosphate | −13.8 |
| Glycerol-3-phosphate | −9.2 |

(Values from standard biochemistry tables, rounded.) A phosphate group can be moved "down" this table spontaneously, from a compound higher up to the acceptor of a compound lower down. ATP sits in the middle, which is exactly why it works as a currency. Compounds above it, made during the breakdown of glucose, can hand their phosphate to ADP: that is substrate-level phosphorylation, and the last step of glycolysis (PEP + ADP → pyruvate + ATP, $-61.9 + 30.5 = -31.4$ kJ/mol) is an example. ATP in turn can phosphorylate the compounds below it, such as glucose. Phosphocreatine in muscle is a quick reserve: during the first seconds of a sprint it recharges ADP faster than glycolysis or respiration can.

## How far from equilibrium? The actual ΔG of pathway steps

Many steps of glycolysis have a positive $\Delta G^{\circ\prime}$, yet the pathway flows forward. The reason is $Q$: each step's products are pulled away by the next enzyme, so their concentrations stay low.

### Example 3

A step in a pathway converts A to B with $\Delta G^{\circ\prime} = +7.5$ kJ/mol (about the value for the glycolysis step that turns the three-carbon sugar DHAP into G3P). The next enzyme uses up B so quickly that the ratio [B]/[A] stays at 0.01. Find $\Delta G$ at 37 °C. Does the step run forward?

Step 1: $Q = 0.01$, so $RT \ln Q = 2.577 \times \ln 0.01 = 2.577 \times (-4.61) = -11.9$ kJ/mol.

Step 2: $\Delta G = 7.5 - 11.9 = -4.4$ kJ/mol. Negative, so the step runs forward even though its standard value is uphill.

Step 3: Check against the equilibrium constant at the same temperature: $K' = e^{-7.5/2.577} \approx 0.05$. Any ratio below about 0.05 makes the forward direction favorable, and 0.01 is below it.

Measured in real cells, many pathway steps sit close to equilibrium (small $|\Delta G|$) and can run either way, depending on which end is being drained. A few steps, such as hexokinase, have large negative $\Delta G$ in the cell; they are effectively one-way, and those are the steps cells regulate. This is a general rule in metabolism: control is exerted where $\Delta G$ is far from zero.

## Redox reactions measured in volts

Respiration releases most of its energy by moving electrons, not phosphate. The tendency of a molecule to accept electrons is measured as its **reduction potential**, $E^{\circ\prime}$, in volts, relative to a standard hydrogen electrode. Each value belongs to a redox pair, the oxidized and reduced forms of the same molecule. The more positive the value, the more strongly the oxidized form pulls electrons in; the more negative, the more readily the reduced form gives them up.

| Redox pair (oxidized / reduced) | $E^{\circ\prime}$ (V) |
|---|---|
| NAD⁺ / NADH | −0.32 |
| Pyruvate / lactate | −0.19 |
| Fumarate / succinate | +0.03 |
| Ubiquinone / ubiquinol (Q / QH₂) | +0.05 |
| Cytochrome c (Fe³⁺ / Fe²⁺) | +0.25 |
| ½ O₂ / H₂O | +0.82 |

Electrons flow spontaneously from a pair with a lower (more negative) $E^{\circ\prime}$ to one with a higher value. The free energy released is

$$\Delta G^{\circ\prime} = -nF\,\Delta E^{\circ\prime}$$

where $n$ is the number of electrons transferred, $F$ is the Faraday constant (96.5 kJ per mole of electrons per volt), and $\Delta E^{\circ\prime} = E^{\circ\prime}_{\text{acceptor}} - E^{\circ\prime}_{\text{donor}}$. A positive voltage difference gives a negative $\Delta G$.

![A vertical scale of standard reduction potentials from −0.4 volts at the top to +0.8 volts at the bottom. NAD+/NADH sits at −0.32 V, ubiquinone at +0.05 V, cytochrome c at +0.25 V and oxygen/water at +0.82 V. A dashed arrow shows electrons falling from NADH to oxygen, a difference of 1.14 V, releasing about 220 kJ/mol.](images/m3-redox-tower.svg)

### Example 4

How much free energy is released when NADH passes two electrons all the way to oxygen? How much when the electrons come from succinate instead (they enter the chain at the ubiquinone level, through FAD)?

Step 1: NADH to O₂: $\Delta E^{\circ\prime} = 0.82 - (-0.32) = 1.14$ V, and $\Delta G^{\circ\prime} = -2 \times 96.5 \times 1.14 \approx -220$ kJ/mol.

Step 2: Succinate to O₂: $\Delta E^{\circ\prime} = 0.82 - 0.03 = 0.79$ V, and $\Delta G^{\circ\prime} = -2 \times 96.5 \times 0.79 \approx -152$ kJ/mol.

Step 3: Interpret. Electrons from succinate (FADH₂ in the core lesson) start lower on the scale, so less energy is available to pump protons. That is the thermodynamic reason FADH₂ is worth about 1.5 ATP and NADH about 2.5. And 220 kJ/mol is about seven times the standard free energy of ATP hydrolysis; the chain captures it in small steps (complex I, III and IV each handle a part of the drop) instead of one burst.

## Common mistakes

- Treating $\Delta G^{\circ\prime}$ as the free energy change in a cell. It is the value at 1 M of everything; the real $\Delta G$ depends on concentrations through $RT \ln Q$.
- Thinking a negative $\Delta G$ means a reaction is fast. Thermodynamics says whether it can go; enzymes and activation energy decide how fast.
- Thinking an enzyme can make an endergonic reaction go. An enzyme cannot change $\Delta G$; only coupling to a favorable reaction or changing concentrations can.
- Getting the sign of $\Delta E$ backward. Electrons flow toward the more positive $E^{\circ\prime}$; subtract the donor's potential from the acceptor's.
- Forgetting $n$. NADH, FADH₂ and Q carry two electrons; a single cytochrome c carries one.
- Mixing units: $R$ in J versus kJ, temperature in °C instead of kelvins, concentrations in mM instead of M inside $Q$.

## Key points

- $\Delta G = \Delta H - T\Delta S$; negative $\Delta G$ means the reaction can proceed, zero means equilibrium.
- $\Delta G = \Delta G^{\circ\prime} + RT \ln Q$ and $\Delta G^{\circ\prime} = -RT \ln K'$; each 5.7 kJ/mol is a tenfold change in $K'$ at 25 °C.
- In cells, ATP hydrolysis releases about 50 kJ/mol (not 30.5) because ATP is kept far above equilibrium.
- Free energies of coupled reactions add (and equilibrium constants multiply); hexokinase couples glucose phosphorylation (+13.8) to ATP hydrolysis (−30.5) for −16.7 kJ/mol.
- ATP sits in the middle of the phosphoryl-transfer scale, so it can be made by substrate-level phosphorylation and spent on lower-energy acceptors.
- Reduction potentials: electrons flow toward more positive $E^{\circ\prime}$; $\Delta G^{\circ\prime} = -nF\Delta E^{\circ\prime}$. NADH to O₂ releases about 220 kJ/mol.
