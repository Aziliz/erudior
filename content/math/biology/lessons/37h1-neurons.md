---
id: bio-h-neurons
module: bio-m9
title: Neurons, action potentials, and synapses
honors: true
minutes: 45
topics: [Action potential, Synapses]
drills: [bio-h-nernst, bio-h-reflex-time]
refs: [bio-ref-lab]
---
## Beyond "sodium in, potassium out"

The homeostasis lesson described the action potential in one sentence: sodium rushes in, potassium flows out, and the impulse travels like a row of falling dominoes. That's true, but it leaves the real questions open. Why is a resting neuron negative inside at all? What decides the size of the spike, and why is it all-or-none? Why can't an impulse turn around and run backward? This lesson answers those questions with a little physical chemistry, follows the signal across a synapse, and shows how several well-known drugs and toxins act. It goes a step beyond the core course, to the level of an honors or early AP Biology class.

## Why the inside is negative

Two things set up the resting potential.

First, the **sodium-potassium pump** (Na⁺/K⁺ pump) in the membrane uses one ATP to move 3 Na⁺ out of the cell and 2 K⁺ in. Run constantly, it builds steep concentration gradients: inside a typical mammalian neuron, K⁺ is about 140 mM and Na⁺ about 15 mM; outside, K⁺ is about 5 mM and Na⁺ about 145 mM. Keeping these gradients up is expensive. The pump accounts for a large share of the brain's energy use.

Second, the resting membrane is far more permeable to K⁺ than to Na⁺, because some K⁺ channels are always open. K⁺ ions diffuse out, down their gradient, and each one carries a positive charge with it. The inside becomes negative, and that negative charge starts pulling K⁺ back in. Very quickly the electrical pull inward balances the chemical push outward. The voltage at which the two balance for one ion is its **equilibrium potential**, given by the **Nernst equation**. At body temperature (37 °C), for an ion with charge $z$:

$$E_{\text{ion}} = \frac{61.5 \text{ mV}}{z} \log_{10}\frac{[\text{ion}]_{\text{out}}}{[\text{ion}]_{\text{in}}}$$

The 61.5 mV comes from physical constants ($2.303\,RT/F$ at 310 K). Notice that the pump itself contributes only a few millivolts directly (it moves 3 charges out for every 2 in). Its main job is to maintain the gradients; the K⁺ leak turns them into a voltage.

### Example 1: equilibrium potentials

Use the concentrations above to find $E_{\text{K}}$ and $E_{\text{Na}}$.

- Potassium: $E_{\text{K}} = 61.5 \log_{10}(5/140) = 61.5 \times (-1.447) \approx -89$ mV. The inside would have to be 89 mV negative to stop K⁺ leaking out.
- Sodium: $E_{\text{Na}} = 61.5 \log_{10}(145/15) = 61.5 \times 0.985 \approx +61$ mV. Na⁺ would keep flowing in until the inside was about 61 mV positive.

The real resting potential, about −70 mV, lies between the two but much closer to $E_{\text{K}}$, because at rest the membrane is mostly permeable to K⁺ with a small Na⁺ leak. A weighted version of the Nernst equation (the Goldman equation) captures this. If Na⁺ permeability is 4% of K⁺ permeability:

$$V_{\text{rest}} = 61.5 \log_{10}\frac{5 + 0.04(145)}{140 + 0.04(15)} = 61.5 \log_{10}\frac{10.8}{140.6} \approx -68.5 \text{ mV}.$$

That's the key idea of the whole lesson: *the membrane potential moves toward the equilibrium potential of whichever ion the membrane is most permeable to at that moment.* Open Na⁺ channels and the voltage heads toward +61 mV; open K⁺ channels and it heads toward −89 mV.

## The action potential, phase by phase

The action potential depends on **voltage-gated channels**: Na⁺ and K⁺ channels that open or close in response to the membrane voltage itself. The graph shows one action potential recorded at one point on an axon.

![Graph of membrane potential against time for one action potential. The potential rests at about −70 mV, rises after a stimulus to a threshold of about −55 mV, shoots up to a peak of about +35 mV, falls below the resting level to about −80 mV, and slowly returns to −70 mV. Dashed lines mark the sodium equilibrium potential near +60 mV and the potassium equilibrium potential near −90 mV.](images/m9-action-potential.svg)

1. Resting state. Both kinds of voltage-gated channels are closed; leak channels hold the membrane near −70 mV.
2. Depolarization to threshold. A stimulus (or input from other neurons) makes the inside less negative, a **depolarization**. If it reaches the **threshold**, about −55 mV, enough voltage-gated Na⁺ channels open to start a chain reaction.
3. Rising phase. Na⁺ rushes in, which depolarizes the membrane further, which opens more Na⁺ channels: a brief positive feedback loop. The potential races toward $E_{\text{Na}}$ and peaks around +30 to +40 mV, short of +61 mV because the next step begins first.
4. Falling phase, or **repolarization**. Within about a millisecond, Na⁺ channels inactivate: a separate gate plugs them, and they can't reopen until the membrane has been negative again for a moment. Meanwhile the slower voltage-gated K⁺ channels open, K⁺ flows out, and the potential falls.
5. Undershoot, or **hyperpolarization**. The K⁺ channels close slowly, so for a few milliseconds the membrane is even more permeable to K⁺ than at rest and dips toward $E_{\text{K}}$, to about −80 mV, before returning to rest.

The positive feedback in step 3 explains the all-or-none rule: below threshold, K⁺ leakage wins and the voltage drifts back; above it, the Na⁺ loop runs to completion, and the peak is set by the channels and the gradients, not by the stimulus. Remarkably few ions move. One action potential changes the concentrations inside a typical neuron by a tiny fraction of a percent, which is why a neuron can keep firing for a while even if its pumps are blocked, though not indefinitely.

Hodgkin and Huxley worked this out in 1952 with the squid giant axon and a voltage clamp, a circuit that holds the membrane at a chosen voltage and measures the current needed to do it. Replacing external Na⁺ with a non-permeating ion abolished the early inward current, proving it was carried by Na⁺. Later, the pufferfish toxin tetrodotoxin (TTX) was found to block voltage-gated Na⁺ channels specifically, and tetraethylammonium to block the K⁺ channels, letting each current be studied alone.

## The refractory period: one-way and rate-limited

During and just after an action potential, the membrane is in a **refractory period**:

- Absolute refractory period: while the Na⁺ channels are open or inactivated, no stimulus, however strong, can trigger a second action potential.
- Relative refractory period: during the undershoot, a second action potential is possible, but only with a stronger than normal stimulus, because the membrane starts farther from threshold and some Na⁺ channels are still inactivated.

This has two consequences. First, an impulse travels only forward: the patch behind it is refractory, so the current spreading backward can't re-excite it. Second, it caps the firing rate. An absolute refractory period of about 1 ms means a neuron can't fire more than about 1,000 times a second, and most fire far less often.

### Example 2: testing the refractory period

An experimenter stimulates an axon twice and varies the gap between the stimuli. The table shows the smallest second stimulus that fires a second action potential, as a multiple of the normal threshold stimulus.

| Gap between stimuli (ms) | 0.5 | 1.0 | 2.0 | 3.0 | 5.0 | 8.0 |
|---|---|---|---|---|---|---|
| Second stimulus needed (× threshold) | none works | none works | 2.5 | 1.6 | 1.1 | 1.0 |

Interpretation:

- Up to at least 1.0 ms, no stimulus fires a second spike: that's the absolute refractory period (Na⁺ channels inactivated).
- From about 2 to 5 ms, a second spike is possible but needs more than the normal stimulus: the relative refractory period (undershoot plus partial recovery of Na⁺ channels).
- By 8 ms the axon has fully recovered.
- Prediction: the highest steady firing rate is limited by the absolute refractory period, somewhere between about 1 and 2 ms here, so roughly 500 to 1,000 impulses per second at the very most.

## Myelin and saltatory conduction

In an unmyelinated axon, each patch of membrane must fire in turn, so conduction is slow (about 0.5–2 m/s in thin fibers). Making an axon wider speeds conduction, which is why the squid evolved a giant axon. Vertebrates found a better solution: **myelin**, layers of membrane wrapped around the axon by Schwann cells (in peripheral nerves) or oligodendrocytes (in the brain and spinal cord). Myelin insulates the axon and lowers its capacitance, so current from one active region spreads quickly and with little loss under the myelin to the next gap. The gaps, the **nodes of Ranvier**, are packed with voltage-gated Na⁺ channels, and the action potential is regenerated only there.

![Two axons compared. A myelinated axon has long yellow myelin segments separated by short gaps labeled nodes of Ranvier, with curved arrows jumping from node to node. Below, an unmyelinated axon has many small arrows showing each patch of membrane firing in turn.](images/m9-saltatory.svg)

This node-to-node regeneration is **saltatory conduction** (from the Latin for "to leap"). The impulse doesn't literally jump; the current flows continuously, but the slow step, opening channels, only happens at the nodes. Myelinated fibers conduct at up to about 120 m/s while staying thin, which is how a spinal cord can hold millions of fast axons. In multiple sclerosis, the immune system damages myelin in the brain and spinal cord, and conduction slows or fails.

## Synapses in depth

At a chemical synapse, the electrical signal becomes a chemical one and then electrical again.

![A chemical synapse. An axon terminal at the top holds round synaptic vesicles filled with neurotransmitter; one vesicle is fusing with the membrane and releasing transmitter into the narrow synaptic cleft. Calcium ions enter through a calcium channel. Transmitter binds receptor channels on the postsynaptic cell below, letting sodium ions in, and a reuptake transporter carries transmitter back into the terminal.](images/m9-synapse.svg)

1. The action potential reaches the axon terminal and opens voltage-gated Ca²⁺ channels.
2. Ca²⁺ flows in (it's far more concentrated outside) and triggers synaptic vesicles to fuse with the membrane and release neurotransmitter by exocytosis.
3. The transmitter diffuses across the cleft (about 20–40 nm) and binds receptors on the postsynaptic cell. Many are ligand-gated ion channels, which open when the transmitter binds.
4. The signal is ended by an enzyme that breaks the transmitter down (acetylcholinesterase, for acetylcholine), by **reuptake** transporters that pump it back into the terminal, or by diffusion away.

The whole sequence takes about half a millisecond, the synaptic delay.

Whether a synapse excites or inhibits depends on the receptor. If the channel lets in Na⁺, the postsynaptic membrane depolarizes a little: an **excitatory postsynaptic potential (EPSP)**. If it lets in Cl⁻ or lets out K⁺, the membrane is pushed further from threshold: an **inhibitory postsynaptic potential (IPSP)**. Glutamate is the main excitatory transmitter of the brain; GABA is the main inhibitory one. A single EPSP is usually only a millivolt or so, far short of threshold. A neuron fires only when **summation** of many inputs, arriving close together in time (temporal summation) or at many synapses at once (spatial summation), brings the axon's starting region (the axon hillock) to threshold. Each neuron is a small calculator, adding thousands of plus and minus signals.

### Drugs and toxins at the synapse

Because each step is a distinct protein, each can be blocked or boosted:

| Agent | Target | Effect |
|---|---|---|
| Tetrodotoxin (pufferfish) and local anesthetics such as lidocaine | Voltage-gated Na⁺ channels | Action potentials can't fire, so signals (including pain) are blocked |
| Botulinum toxin | Proteins that let vesicles fuse | No acetylcholine release; muscles are paralyzed |
| Curare | Acetylcholine receptors on muscle | Transmitter can't bind; paralysis |
| Organophosphate nerve agents and some insecticides | Acetylcholinesterase | Acetylcholine builds up; muscles are overstimulated |
| SSRIs (such as fluoxetine) | Serotonin reuptake transporter | Serotonin stays in the cleft longer |
| Cocaine | Reuptake transporters for dopamine and related transmitters | Dopamine signaling is prolonged |
| Benzodiazepines | GABA receptors | Inhibitory GABA signals are strengthened |

These are descriptions of mechanism, not medical advice; how a drug affects a whole person depends on far more than one synapse.

### Example 3: reflex timing

A knee-jerk reflex uses a sensory axon and a motor axon, each about 0.9 m long and conducting at 60 m/s, with one synapse in the spinal cord. Estimate the reflex time, taking 0.5 ms per synapse and ignoring the time for the muscle to contract.

- Conduction: total path $= 0.9 + 0.9 = 1.8$ m; time $= 1.8 / 60 = 0.030$ s $= 30$ ms.
- Synapses: one, so 0.5 ms.
- Total: about 30.5 ms.

Now suppose the same path used unmyelinated fibers conducting at 1 m/s: conduction alone would take 1.8 s. Measured knee-jerk latencies are a few tens of milliseconds, which only fast, myelinated fibers can explain. A withdrawal reflex that passes through one or two interneurons adds only a millisecond or so of synaptic delay, so conduction distance and speed dominate.

## Common mistakes

- Saying the Na⁺/K⁺ pump "creates" the resting potential directly. It builds the gradients; the K⁺ leak produces most of the voltage.
- Thinking the spike stops at the peak because Na⁺ has run out. Na⁺ channels inactivate; the gradients barely change.
- Confusing threshold (about −55 mV) with the resting potential (about −70 mV) or with $E_{\text{K}}$ (about −90 mV).
- Believing myelin carries the impulse. Myelin insulates; the action potential is regenerated at the nodes.
- Thinking one EPSP fires a neuron. Firing needs summation of many inputs.
- Mixing up a drug that blocks reuptake (transmitter stays longer) with one that blocks receptors (transmitter can't act).

## Key points

- The pump (3 Na⁺ out, 2 K⁺ in) maintains the gradients; K⁺ leak makes the resting potential, close to $E_{\text{K}}$.
- Nernst: $E = \dfrac{61.5}{z}\log_{10}\dfrac{[\text{out}]}{[\text{in}]}$ mV at 37 °C; the membrane moves toward the equilibrium potential of the most permeable ion.
- Action potential: threshold, Na⁺ in (positive feedback), Na⁺ channels inactivate and K⁺ out, undershoot, rest.
- Refractory periods make conduction one-way and limit firing rate.
- Myelin plus nodes of Ranvier give fast saltatory conduction.
- Synapse: Ca²⁺ in, vesicles release transmitter, receptors respond (EPSP or IPSP), signal ended by enzymes or reuptake. Many drugs act on one of these steps.
