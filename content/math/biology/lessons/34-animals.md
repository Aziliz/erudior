---
id: bio-animals
module: bio-m8
title: Animal diversity
minutes: 35
topics: [Animals]
refs: [bio-ref-evolution-ecology]
---
## What makes an animal

Plants, the subject of the last lesson, make their own food. Animals can't: they are multicellular eukaryotes that get energy by eating other organisms and digesting them inside the body (fungi, by contrast, digest outside). Animal cells have no cell walls, which lets them change shape, and most animals have nerve and muscle tissue and can move during at least part of their lives. Almost all develop from a zygote that divides into a hollow ball of cells, the blastula, which then folds into tissue layers.

Biologists have described well over a million animal species, and roughly 95% of them are **invertebrates**, animals without a backbone. Insects alone account for most named animal species. This lesson organizes that diversity using a few body-plan features, each of which marks a branch point in animal evolution.

## Body-plan features

### Tissues

Sponges are the simplest animals. Their cells are specialized (some beat flagella to pump water, some build the skeleton), but they aren't organized into true tissues, and a sponge has no nerves, muscles or gut. Every other animal has true tissues.

### Symmetry

Cnidarians (jellyfish, corals, sea anemones) have radial symmetry: like a pie, they can be cut into matching halves along many planes through a central axis. A radial animal meets its environment equally from all sides, which suits drifting or sitting still and catching food with tentacles.

Most other animals have **bilateral symmetry**: only one plane divides the body into mirror-image left and right halves. A bilateral animal has a front and back end, a top (dorsal) and bottom (ventral) side. Moving head-first favored cephalization: nerve cells and sense organs concentrated at the front end, where the animal first meets new surroundings. A brain is the extreme of this trend.

### Germ layers and body cavity

Embryos of bilateral animals form three tissue layers: ectoderm (giving rise to skin and nervous system), mesoderm (muscle, bone, blood, kidneys) and endoderm (lining of the gut and its organs). Cnidarians have only two.

Many animals have a **coelom**, a fluid-filled body cavity completely lined by tissue from the mesoderm, between the gut and the outer body wall. A coelom cushions organs and lets the gut move independently of the body wall; in worms its fluid also works as a hydrostatic skeleton. Flatworms have no body cavity at all, roundworms have a cavity only partly lined by mesoderm, and most other bilateral animals, including us, have a true coelom.

### Two developmental paths

Bilateral animals split into two great lineages, first recognized by how the embryo develops. In protostomes (including mollusks, annelids and arthropods, and, DNA shows, flatworms and roundworms too), the first opening in the embryo becomes the mouth. In deuterostomes (echinoderms and chordates), it becomes the anus and the mouth forms later. This embryological detail, confirmed by DNA, is why sea stars are closer relatives of humans than insects are.

## A tour of the major phyla

| Phylum | Examples | Symmetry | Body cavity | Notable features |
|---|---|---|---|---|
| Porifera | Sponges | None | None | No true tissues; filter feeders |
| Cnidaria | Jellyfish, corals | Radial | None (gut cavity only) | Stinging cells; two tissue layers |
| Platyhelminthes | Planarians, tapeworms | Bilateral | None | Flat body; one gut opening |
| Nematoda | Roundworms | Bilateral | Partly lined | Gut with mouth and anus; very abundant |
| Mollusca | Snails, clams, octopuses | Bilateral | Coelom | Muscular foot, mantle; often a shell |
| Annelida | Earthworms, leeches | Bilateral | Coelom | Segmented body |
| Arthropoda | Insects, spiders, crabs | Bilateral | Coelom | Jointed legs; exoskeleton of chitin; segmented |
| Echinodermata | Sea stars, sea urchins | Radial as adults, bilateral larvae | Coelom | Water-vascular system; deuterostomes |
| Chordata | Fish, frogs, birds, humans | Bilateral | Coelom | Notochord, nerve cord, pharyngeal slits, tail |

Arthropods are the most successful phylum by number of species. Their exoskeleton protects them and prevents drying out, which helped insects colonize land, but it can't grow, so they molt to get larger.

## Chordates and vertebrates

A **chordate** is an animal that, at some point in its life, has all four of these features:

1. a notochord, a flexible rod along the back that supports the body;
2. a hollow nerve cord running along the back (dorsal), above the notochord;
3. pharyngeal slits (or pouches) in the throat region;
4. a tail extending past the anus.

In humans, the notochord and slits appear only in the embryo; the notochord is replaced by the vertebral column, and the pouches develop into parts of the ear and throat glands. Most chordates are vertebrates, with a backbone of vertebrae around the nerve cord, but a few, such as lancelets and sea squirts, are invertebrate chordates.

Vertebrate history is a series of innovations, each opening new ways of life:

- Jaws (most fish) allowed vertebrates to grab and bite large prey.
- Four limbs (amphibians), together with lungs already present in their fish ancestors, allowed life on land, though most amphibians still lay eggs in water and many undergo metamorphosis from aquatic larva to land-dwelling adult.
- The **amniotic egg** (reptiles, birds, mammals) has membranes that enclose the embryo in its own fluid, store wastes, and exchange gases through a shell. It freed reproduction from water. Most mammals keep the embryo inside the mother instead, but the same membranes still form.
- Hair and milk (mammals); feathers (birds).

Evolutionary trees place birds inside the reptiles: birds descend from feathered dinosaurs, and crocodiles are more closely related to birds than to lizards.

### Body temperature

An **endotherm** generates most of its body heat from its own metabolism and holds a nearly constant body temperature; birds and mammals are endotherms. An ectotherm gets most of its body heat from the environment, so its body temperature tracks its surroundings, adjusted by behavior such as basking in sun or retreating to shade; most fish, amphibians, reptiles and invertebrates are ectotherms. ("Warm-blooded" and "cold-blooded" are misleading: a lizard basking in the desert can be warmer than a mammal.) Endothermy lets an animal stay active in the cold, but it is expensive: an endotherm needs several times as much food as an ectotherm of the same size.

```plot
{"x": [0, 40], "y": [0, 45], "xLabel": "air temperature (°C)", "yLabel": "body temperature (°C)", "functions": [{"f": "37", "label": "mouse (endotherm)"}, {"f": "x + 2", "from": 0, "to": 40, "label": "lizard in shade (ectotherm)", "dashed": true}], "caption": "Body temperature versus air temperature for an endotherm and an ectotherm"}
```

### Example 1: reading the graph

On the graph, at what air temperature do the mouse and the lizard have the same body temperature, and what happens to each at 10 °C?

The lines cross where $x + 2 = 37$, at an air temperature of 35 °C. At 10 °C, the mouse is still at 37 °C, which means it must burn food fast to replace the heat it loses to the cold air. The lizard's body is about 12 °C; its metabolism and movement slow down, but it spends very little energy. Neither strategy is "better"; they trade activity for food cost.

### Example 2: using a dichotomous key

A **dichotomous key** isn't new to you if you've used one in a field guide: it identifies an organism through a series of paired choices, each pair splitting the remaining options in two. Here is a short key for animals found in a tide pool:

1. a. Body has radial symmetry → go to 2
   b. Body has bilateral symmetry → go to 3
2. a. Soft body with stinging tentacles → sea anemone (Cnidaria)
   b. Spiny skin; tube feet → sea star (Echinodermata)
3. a. Jointed legs and an exoskeleton → crab (Arthropoda)
   b. No jointed legs → go to 4
4. a. Soft body with a muscular foot, often a shell → snail (Mollusca)
   b. Long, segmented body → marine worm (Annelida)

An animal has bilateral symmetry, no legs, a soft body and a coiled shell. Step 1b sends it to 3; it has no jointed legs, so 3b sends it to 4; a soft body with a shell matches 4a: a snail, a mollusk. Notice that each choice uses a feature you can observe directly, and that the two options in each pair can't both be true.

### Example 3: placing a mystery animal

A deep-sea animal has bilateral symmetry, a true coelom, a body made of repeated segments, no jointed legs and no exoskeleton. Its embryo's first opening becomes the mouth. Which phylum fits best?

- Bilateral with a coelom rules out sponges, cnidarians, flatworms and roundworms.
- First opening becomes the mouth: a protostome, which rules out echinoderms and chordates.
- Segmented, but without jointed legs or an exoskeleton: not an arthropod. Mollusks aren't obviously segmented.

The best fit is Annelida, the segmented worms. Classification works like this in practice: each feature eliminates branches.

## Common mistakes

- Equating "animal" with "vertebrate." Vertebrates are a small minority of animal species.
- Thinking all chordates have a backbone. Lancelets and sea squirts are chordates without one.
- Using "cold-blooded" literally; ectotherms can be warm. The difference is the heat source.
- Assuming radial symmetry is always ancestral. Echinoderms are bilateral as larvae and became radial as adults.

## Key points

- Animals are multicellular heterotrophs without cell walls that digest food internally; most species are invertebrates.
- Key body-plan features: true tissues, symmetry (radial vs bilateral), germ layers, body cavity (coelom), protostome vs deuterostome development.
- Major phyla: sponges, cnidarians, flatworms, roundworms, mollusks, annelids, arthropods, echinoderms, chordates.
- Chordates have a notochord, dorsal hollow nerve cord, pharyngeal slits and a post-anal tail at some stage.
- Vertebrate innovations: jaws, lungs and limbs, the amniotic egg, endothermy in birds and mammals.
