# Round 2 notes: phys-m11 (Light and optics)

Checked with `content/math/check-module.sh university-physics-2 phys-m11`: build and checker OK, 0 problems (8 lessons, 130 questions, 22 drills).

## Honors lessons (3)
The module has five core lessons and three distinct directions worth teaching, so it got 3 honors lessons. Each one has `honors: true` and a module of phys-m11.

| File | id | Title | Words | Questions | Drills |
|---|---|---|---|---|---|
| 19h1-interferometers.md | phys-h-interferometers | Interferometers: measuring with light waves | ~1,690 | h01–h14 (14) | michelson, gas-cell, air-wedge |
| 19h2-gratings-xray.md | phys-h-gratings-xray | Grating spectrometers and X-ray diffraction | ~1,450 | h15–h28 (14) | resolving-power, bragg |
| 19h3-ray-matrices.md | phys-h-ray-matrices | Ray matrices, lens systems and aberrations | ~1,830 | h29–h42 (14) | lens-pair, achromat |

- **h1** covers the Michelson interferometer (fringe counting, gas cells, plates), the air wedge and Newton's rings, coherence length, Michelson–Morley, the krypton meter and LIGO. It has 3 worked examples, the Michelson SVG and a Mermaid chart that turns a path change into a fringe count.
- **h2** covers N-slit line width, angular dispersion, resolving power $R = Nm$ (derived), overlapping orders, Bragg's law, and the history (Laue, Friedrich and Knipping, the Braggs, Franklin's lab). It has 4 worked examples, an N = 2 vs N = 8 plot and the Bragg SVG.
- **h3** covers paraxial ray-transfer matrices (translation, thin lens, spherical surface), the system matrix, the effective focal length, the back focal distance, imaging with B = 0, the two-lens formula, a telephoto pair and a thick lens. It then covers spherical and chromatic aberration (including Hubble), Abbe numbers and achromatic doublet design. It has 3 worked examples, the aberrations SVG and a Mermaid procedure chart.
- None of the three overlaps the phys-h2 honors module (Maxwell, relativity and quanta). h1 mentions Michelson–Morley only as history.

## Core lessons (additions only)
- **15 Light:** EM-wave SVG (E, B, direction, λ) and a Mermaid chart of what happens at a boundary (refraction, TIR, Brewster).
- **16 EM energy:** an SVG of energy flowing into a resistor (E along the wire, B circling it, S inward), and a Mermaid chain from P to I to E0, B0 and to the pressure and force.
- **17 Mirrors and lenses:**
  - Two new sentences on ray rules for concave mirrors. **center of curvature** is now bolded and has a glossary entry.
  - A concave-mirror ray-diagram SVG.
  - A Mermaid chart of image type versus object position.
- **18 Instruments:** two sentences naming the parts of the eye, an eye SVG, and a Mermaid chart for choosing a corrective lens.
- **19 Wave optics:** a double-slit setup SVG, and a Mermaid chart of which condition to use (slits, single slit, aperture, thin film).

## Questions: `questions/r2-phys-m11.yaml` (67 total)
- **Core, q01–q25:** 5 per lesson, all new types. Totals: 5 text, 5 match, 5 order, 5 select-all and 4 label (L16's picture isn't worth labeling). Lessons 15, 17, 18 and 19 each have 2 marked module_quiz, and L16 has 1, for 9 in all.
- **Honors, h01–h42:** 23 multiple choice and 19 new types (8 text, 3 select-all, 3 order, 3 match, 2 label). The multiple-choice answer positions are 6/5/6/6.

## Drills: `drills/r2-phys-m11.yaml` (7)
phys-m11-r2-michelson, -gas-cell, -air-wedge, -resolving-power, -bragg, -lens-pair, -achromat. Every drill asks for 3 s.f. and accepts answers within relTolerance 0.01.

## Pictures and diagrams
- **SVGs:** phys-m11-em-wave, -concave-mirror, -eye, -double-slit, -michelson and -bragg, each with a `-blank` copy for its label question. Also -resistor-flow and -aberrations, which have no blank copy. All were previewed, and the blank copies were checked with their markers.
- **Mermaid:** 7 diagrams (5 core, 2 honors), all previewed.
- **Plot:** 1, in h2.

## Glossary and cards
- `glossary-r2-phys-m11.yaml`: 20 terms. I checked all glossary files in the course first, including the other r2 files, and none are duplicates.
- `cards-r2-phys-m11.yaml`: 29 cards (3 core, 8 h1, 8 h2, 10 h3).

## For a reviewer to double-check
- The resistor-flow SVG has no arrowheads on the B loops. This is on purpose: in a flat perspective drawing, the direction they would show is ambiguous. The text explains the directions.
- Air index in h1 Example 2 (n − 1 = 2.78e-4) is described as "close to tabulated values ... about 1.00027 to 1.00029, depending on temperature and pressure".
- In h1, coherence length $\lambda^2/\Delta\lambda$ is labeled an order-of-magnitude estimate. The influence of the Michelson–Morley result on Einstein is labeled as debated.
- In h3, the matrix sign convention is that θ is positive for a rising ray, and R is positive when the center of curvature is on the outgoing side. This matches lesson 18. Example 2 of h3 (thick lens, f = 10.34 cm) was checked against the thick-lens formula.
- The q12 order question relies on distinct |m| values (10, 5, 2, 0.67).

## Errors found in existing content
None.

## Sources
- Constants and examples were recomputed in Python (numpy/sympy).
- Facts checked against standard references:
  - the Michelson–Morley experiment (1887) and Michelson's 1907 Nobel Prize;
  - the krypton-86 meter definition (1960–1983);
  - LIGO GW150914 (14 Sept 2015) and the 2017 Nobel Prize;
  - Laue, and Friedrich and Knipping (1912);
  - the Braggs' 1915 Nobel Prize, with W. L. Bragg aged 25;
  - Franklin's lab DNA images (1952);
  - Hubble's primary mirror error of about 2.2 μm, corrected in 1993;
  - the Abbe d/F/C lines (587.6/486.1/656.3 nm);
  - Chester Moor Hall (1730s) and Dollond (1750s);
  - Cu Kα 0.154 nm and the NaCl plane spacing of 0.282 nm.
