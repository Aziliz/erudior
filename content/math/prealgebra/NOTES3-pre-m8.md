# Round 3, pre-m8: honors lesson "Scaling area and volume"

## Added

- Lesson `lessons/35h4-scaling-area-volume.md` (id `pre-m8-h-scaling`, honors, 45 min, topic
  "Scaling area and volume", about 2,100 words of prose). Builds on Lesson 16 (scale factor,
  1 : 24 model car), Lesson 33 (pizza: double radius, four times the area), Lesson 34 and the
  honors lesson on spheres (double radius, 8 times the volume). Sections: lengths by k; areas by
  k² (unit squares); volumes by k³ (unit cubes); a "which factor" Mermaid chart; maps and models;
  going backwards (square root / cube root); the square-cube law (bones, insects, cooling) with
  a labelled "Simplified" paragraph; Common mistakes; Key points. 7 worked examples.
- Pictures: `images/pre-m8-scaling-squares.svg`, `images/pre-m8-scaling-cubes.svg` (original,
  drawn by script; previewed). One ```plot (surface area ÷ volume of a cube, 6/s), one Mermaid
  flowchart. All previewed.
- Questions `questions/r3-pre-m8.yaml`: 15 (`pre-m8-r3-h01`–`h15`): 9 multiple choice, 2 select-all,
  2 text, 1 order, 1 match (6 of 15 new types). Correct MC indices spread 0–3.
- Drills `drills/r3-pre-m8.yaml`: `pre-m8-r3-scale-solid`, `pre-m8-r3-map-area`,
  `pre-m8-r3-area-to-length` (all answers exact; inputs chosen so they stay whole or short decimals).
- Glossary `glossary-r3-pre-m8.yaml`: 7 terms (area scale factor, volume scale factor, scale
  drawing, map scale, square-cube law, cross-sectional area, surface-area-to-volume ratio). Grepped
  every glossary*.yaml first; none existed. "scale factor" and "similar" already exist and are reused.
- Cards `cards-r3-pre-m8.yaml`: 12, topic "Scaling area and volume".
- `content/math/check-module.sh prealgebra pre-m8`: OK, zero problems.

## Facts to double-check (all believed correct)

- ISO 216 paper: A4 = 210 × 297 mm, A3 = 297 × 420 mm, A3 = two A4s, aspect ratio √2; copier
  presets 141% (A4→A3) and 71% (A3→A4).
- HO model-train scale "about 1 : 87" (usually given as 1 : 87.1).
- Galileo discussed bone thickness and size in *Two New Sciences* (1638).
- Carboniferous/Permian giant insects (Meganeura and relatives) with wingspans of roughly
  65–70 cm; the high-oxygen explanation is presented as "one leading explanation", since it is
  debated.
- Example 7 (giant 10× a person): "bone has some safety margin, but nowhere near tenfold". Bone
  safety factors are usually quoted at a few (roughly 1.5–4), so this is safe but stated loosely.
- The "Simplified" paragraph notes real animals are not scaled copies and that measured scaling
  (e.g. metabolic rate) is close to, but not exactly, the k²-vs-k³ prediction (Kleiber's ¾-power
  law is the real pattern; not named in the lesson to stay at prealgebra level).

## Uncertain / reviewer notes

- The chocolate-bunny example (Example 3) uses made-up but plausible numbers (100 g, 150 cm² of foil).
- Weight scaling by k³ is stated only for solid objects of the same material (big bronze statues
  are hollow, which is why the lesson avoids them).

## Sources

Standard geometry (similar figures, scaling of area and volume). ISO 216 paper dimensions.
Galileo, *Dialogues Concerning Two New Sciences* (1638), Second Day. J. B. S. Haldane, "On Being
the Right Size" (1926) as background for the biology examples (not quoted). All numbers recomputed
in Python.
