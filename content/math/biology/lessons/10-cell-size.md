---
id: bio-cell-size
module: bio-m2
title: 'Cell size, surface area, and specialization'
minutes: 30
topics: [Surface area to volume, Cell specialization]
drills: [bio-sa-volume, bio-agar-cube]
refs: [bio-ref-lab]
---
## Why are cells so small?

The last lesson showed that everything a cell takes in or gets rid of must cross its plasma membrane, mostly by diffusion. That fact sets a limit on how big a cell can be. An elephant is not made of bigger cells than a mouse; it is made of more of them. This lesson explains why, using a little geometry, and then asks the second half of the question: if a large organism is made of many small cells, how do those cells come to be so different from each other?

## Surface area and volume

A cell's needs depend on its *volume*: the more cytoplasm, the more reactions, the more oxygen and nutrients used and the more waste made. But a cell's supply depends on its *surface area*, because everything enters and leaves through the membrane. The comparison that matters is the **surface-area-to-volume ratio** (SA:V), the surface area divided by the volume.

The trouble is that as an object grows, its volume grows faster than its surface area. Use a cube of side $s$ as a model cell:

$$\text{SA} = 6s^2, \qquad V = s^3, \qquad \frac{\text{SA}}{V} = \frac{6s^2}{s^3} = \frac{6}{s}.$$

Surface area grows with the square of the side, volume with the cube. Double the side and the surface area becomes 4 times larger, but the volume becomes 8 times larger, so the ratio halves.

### Example 1: Three cubes

Find the surface area, volume and SA:V for cubes with sides 1, 2 and 4 units.

| Side | Surface area $6s^2$ | Volume $s^3$ | SA:V |
|---|---|---|---|
| 1 | 6 | 1 | 6 : 1 |
| 2 | 24 | 8 | 3 : 1 |
| 4 | 96 | 64 | 1.5 : 1 |

Step by step for the side-2 cube: each face has area $2 \times 2 = 4$, six faces give 24; volume $2 \times 2 \times 2 = 8$; ratio $24 / 8 = 3$. Check with the shortcut: $6 / 2 = 3$.

Going from side 1 to side 4, the volume rose 64-fold but the surface area only 16-fold. Each unit of volume in the big cube has only a quarter as much membrane serving it as in the small cube.

```plot
{"x": [0, 10], "y": [0, 8], "xLabel": "side length of cube", "yLabel": "SA:V ratio", "functions": [{"f": "6/x", "from": 0.75}], "points": [{"at": [1, 6], "label": "s = 1"}, {"at": [2, 3], "label": "s = 2"}, {"at": [4, 1.5], "label": "s = 4"}], "caption": "SA:V = 6/s falls as a cube gets bigger"}
```

## Diffusion distance

A second problem compounds the first. Diffusion is fast over tiny distances and painfully slow over large ones: the time it takes grows roughly with the *square* of the distance. Oxygen diffuses across 10 µm in a fraction of a second, but across 1 cm it would take minutes to hours. A large cell would starve or poison itself in its center long before diffusion caught up. A large cell also has more volume for one nucleus to manage. So cells stay small, usually 10–100 µm, and big organisms are built from many of them.

### Example 2: The agar cube experiment

A classic way to model this uses cubes of agar jelly containing an indicator, soaked in a solution that changes the indicator's color as it diffuses in. A student soaks cubes of side 1 cm, 2 cm and 3 cm for 10 minutes; in each, the color has spread 0.5 cm in from every face. What percent of each cube's volume did the solution reach?

The uncolored part is a smaller cube in the center whose side is $s - 2(0.5) = s - 1$ cm (the color came 0.5 cm in from both sides).

| Cube side | Total volume | Uncolored center | Colored volume | % reached |
|---|---|---|---|---|
| 1 cm | 1 cm³ | $0^3 = 0$ cm³ | 1 cm³ | 100% |
| 2 cm | 8 cm³ | $1^3 = 1$ cm³ | 7 cm³ | 87.5% |
| 3 cm | 27 cm³ | $2^3 = 8$ cm³ | 19 cm³ | ≈ 70.4% |

The diffusion distance was the same for every cube, but the bigger the cube, the smaller the fraction of its volume that was reached. In a cell, the unreached center is the part that would be short of oxygen and nutrients.

## How cells and organisms beat the limit

Living things have evolved many ways to keep a high SA:V or short diffusion distances:

- *Flat shapes.* Red blood cells are thin biconcave discs about 7–8 µm across, so no hemoglobin is far from the surface where oxygen enters.
- *Long, thin shapes.* A nerve cell can be a meter long but only a few micrometers wide.
- *Folded surfaces.* Cells lining the small intestine are covered in microvilli, tiny finger-like projections that multiply the area for absorbing nutrients. Root hair cells do the same for absorbing water.
- *Many cells, plus delivery systems.* Large organisms solve the problem at the organism level: lungs and gills with huge internal surfaces, blood vessels that bring supplies within a few cells of every tissue. Module 9 shows these systems.

## Cell specialization

In a multicellular organism, cells divide the work. Each type has a structure suited to its job:

| Cell | Job | Structural features |
|---|---|---|
| Red blood cell | Carry oxygen | Packed with hemoglobin; no nucleus in mammals; flexible disc shape |
| Neuron | Carry signals | Long extensions (axon, dendrites) to reach distant cells |
| Muscle cell | Contract | Many protein fibers (actin, myosin) and mitochondria |
| Sperm cell | Reach and fertilize egg | Flagellum; many mitochondria; little cytoplasm |
| Root hair cell (plant) | Absorb water and minerals | Long projection that increases surface area |
| Guard cell (plant) | Open and close leaf pores | Paired, change shape as they gain or lose water |

All of these cells in one organism came from a single fertilized egg and contain (with rare exceptions) the same DNA. They differ because they use different genes. **Differentiation** is the process by which a cell becomes specialized in structure and function, by switching certain genes on and others off. A muscle cell uses its genes for actin and myosin; a red blood cell precursor uses its hemoglobin genes. Module 6 explains how genes are switched on and off, and Module 4 discusses the stem cells that differentiated cells come from.

### Example 3: Do specialized cells keep all their genes?

In 1962 John Gurdon tested whether differentiation throws away genes. He destroyed the nucleus of a frog egg cell and replaced it with the nucleus from a fully specialized intestinal cell of a tadpole. Although most transplants failed, some of the eggs developed into normal swimming tadpoles, and some of those grew into adult frogs. What does this show?

1. The new frog was built entirely using the DNA from an intestinal cell nucleus.
2. A frog needs every kind of cell (nerve, muscle, skin, blood), so that one nucleus must still have contained the genes for all of them.
3. Therefore differentiation does not delete the unused genes; it switches them off, and the right signals (here, from the egg's cytoplasm) can switch them back on.

Gurdon shared the 2012 Nobel Prize for this work. The same principle underlies cloning animals and reprogramming adult cells into stem cells.

## Levels again: tissues and organs

Specialized cells cooperate in groups. A **tissue** is a group of similar cells that perform a common function. Animals have four main tissue types: epithelial tissue (covers surfaces and lines organs), connective tissue (supports and binds, including bone, blood and fat), muscle tissue (contracts) and nervous tissue (carries signals). Plants have their own tissues: dermal (outer covering), vascular (xylem and phloem for transport) and ground tissue (photosynthesis and storage).

An **organ** is a structure made of two or more tissue types working together for a particular function. The stomach has epithelial tissue that secretes acid and enzymes, muscle tissue that churns, connective tissue that holds it together and nervous tissue that controls it. A leaf is a plant organ. Organs that work together form organ systems, completing the hierarchy from Lesson 1: cell → tissue → organ → organ system → organism.

## Common mistakes

- *Thinking bigger organisms have bigger cells.* They mostly have more cells of similar size.
- *Saying surface area and volume grow at the same rate.* Area grows with $s^2$, volume with $s^3$, so SA:V falls as size increases.
- *Forgetting the factor of 6.* A cube has six faces: SA $= 6s^2$.
- *In the agar problem, subtracting the depth only once.* Color enters from both sides, so the center's side is $s - 2d$.
- *Saying specialized cells have different DNA.* They have the same DNA but express different genes.

## Key points

- A cell's needs scale with volume, its supply with surface area; the **surface-area-to-volume ratio** falls as a cell grows (for a cube, SA:V = $6/s$).
- Diffusion is only fast over short distances, so cells stay small; flat, thin and folded shapes raise SA:V.
- **Differentiation** makes cells specialized by switching genes on and off; the DNA is the same in nearly every cell (Gurdon's frog nuclear transfer).
- A **tissue** is a group of similar cells with a shared job; an **organ** is made of several tissues working together.
