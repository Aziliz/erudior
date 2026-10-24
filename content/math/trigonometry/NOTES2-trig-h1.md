# NOTES2-trig-h1: Honors module trig-h1, "Honors: Trigonometry in science and engineering"

`content/math/check-module.sh trigonometry trig-h1`: build and checker report **zero problems** (4 lessons, 56 questions, 12 drills, 40 cards).

## What was added

The module is a capstone. Each lesson applies trigonometry from several core modules to one science or engineering setting. Before choosing topics I checked the honors lessons other writers had already added (04h1–34h2, 39h1–h3) so these lessons wouldn't repeat them.

**Lessons** (module `trig-h1`, no `honors:` line needed):

| File | Id | Min | Prose words* | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|
| 90-robot-arms.md | trig-h1-robot-arms | 45 | ~1,600 | 4: rotate (4, 1) by 30°; forward kinematics; inverse kinematics with both solutions; an out-of-reach target | trig-h1-arm.svg; shape (elbow-up/elbow-down); Mermaid "inverse kinematics" chart | trig-h1-r2-rotate-point, -forward-kin, -inverse-kin |
| 91-phasors-ac-circuits.md | trig-h1-phasors | 45 | ~1,600 | 3: 5∠20° + 8∠−50°; two equal waves 120° apart; series RLC at 60 Hz | trig-h1-rlc-phasors.svg; plot of two waves and their sum; Mermaid "adding sinusoids" chart | trig-h1-r2-add-phasors, -rlc, -resonance |
| 92-light-and-refraction.md | trig-h1-refraction | 45 | ~1,400 | 3: air into water at 40°; critical angles of water and diamond; acceptance angle of a fiber | trig-h1-refraction.svg; shape (Huygens wavefront derivation); Mermaid "what happens at a boundary" chart | trig-h1-r2-snell, -critical-angle, -fiber |
| 93-great-circle-navigation.md | trig-h1-great-circles | 50 | ~1,600 | 3: New York to Madrid distance; initial bearing; pole-and-equator triangle area | trig-h1-spherical-triangle.svg; Mermaid "planning a great-circle route" chart | trig-h1-r2-great-circle, -initial-bearing, -spherical-excess |

*Prose words leave out code blocks, display math and image alt text.

What each lesson covers:
- **90:** rotation formulas (from the sum formulas, and as multiplication by cis θ); forward kinematics as vector addition; inverse kinematics by the law of cosines; the two-solution ambiguity (tied to the SSA ambiguous case); the workspace ring from the triangle inequality.
- **91:** a sinusoid as the shadow of a turning arrow; phasor addition; interference ($R^2 = A_1^2 + A_2^2 + 2A_1A_2\cos\Delta$); R/L/C phase relations; impedance as a complex number; resonance; power factor.
- **92:** angles from the normal; the law of reflection; Snell's law, with a derivation from Huygens' wavefronts (two right triangles sharing a hypotenuse); total internal reflection; numerical aperture, derived with the Pythagorean identity.
- **93:** the central angle derived from the 3-D dot product and the cosine difference formula; the spherical law of cosines on the pole triangle; the small-triangle limit giving the flat law of cosines; the initial bearing; rhumb lines; rounding trouble and the haversine formula; spherical excess and Girard's area formula.

Every lesson has an intro tying back to core modules, `##` sections that explain why, "Common mistakes" and "Key points".

**Questions** (`questions/r2-trig-h1.yaml`, trig-h1-r2-h01 to h56): 14 per lesson.
- 32 four-choice multiple choice. Answer positions are 2/2/2/2 within each lesson.
- 24 other types (43%):
  - 8 text;
  - 4 select-all;
  - 4 match;
  - 4 order;
  - 4 label (arm, RLC phasor diagram, refraction, spherical triangle).
- `module_quiz: true` on 20 questions (5 per lesson), covering all 8 topics.

**Pictures**: 4 original SVGs, each with a `-blank` copy for its label question. They total about 21 KB (largest 5.7 KB). Every one was previewed, and the label markers were checked on the blank copies.

**Diagrams and figures**: 4 Mermaid flowcharts (all `flowchart TD`, with accTitle/accDescr), 1 plot and 2 shapes. All were rendered and inspected.

**Drills** (`drills/r2-trig-h1.yaml`): 12, listed in the table.

**Glossary** (`glossary-r2-trig-h1.yaml`): 40 terms. I checked them against every `glossary*.yaml` in the course (m1–m9 r2 files and glossary.yaml, as of this writing): no term or alias is a duplicate.

**Cards** (`cards-r2-trig-h1.yaml`): 40 in total, 10 per lesson.

## Verification

**Numbers.** Every worked-example number, question key and figure coordinate was recomputed in Python (`/tmp/r2-trig-h1/py/`). Every distractor was checked to be wrong. The inverse-kinematics answers were confirmed by running them back through forward kinematics. The phasor sums were checked against the original waves at several times.

**Drills.**
- 400 seeded instances of each drill were generated with the app's `generate()`, 4,800 in total.
- `vd.py` re-solved every instance independently from its inputs:
  - initial bearings from tangent vectors, not the bearing formula;
  - great-circle distances from 3-D vectors, also cross-checked with the haversine formula;
  - inverse kinematics checked by forward kinematics.

  There were 0 mismatches.
- These typed answers were accepted in every instance:
  - correctly rounded answers;
  - answers from students who round intermediate values (4-decimal sines/cosines, 2-decimal reactances and angles).
- A shifted answer (+1) was rejected everywhere except great-circle distance near a .5 km boundary (its tolerance is ±0.6 km).

**Order questions.** Each one has a single valid order, because every step needs the result of the step before it.

## For a reviewer to double-check

- **Overlap with trig-m8's honors lesson 34h1 (rotation and area).** That lesson derives the rotation formula. Lesson 90 keeps a short rotation section, because the arm needs it and honors lessons are optional. The section says it is a review for anyone who did 34h1. I did not add a glossary entry for "rotation formula", since m8's file defines it, and I did not bold it.
- **Terms from other writers' files, not bolded in my lessons:**
  - latitude and great circle (m1's 04h1 defines them; "central angle" is bolded and links to the existing entry);
  - beats (core lesson 26);
  - $a\sin x + b\cos x$ (core lesson 23), which lesson 91 builds on and cites.
- **Conventions:**
  - The arm's elbow angle is relative to link 1. Positive $\theta_2$ pairs with $\theta_1 = \varphi - \psi$; the lesson calls this "elbow down" for targets above the shoulder.
  - Phasors use cosine form and peak values; lesson 91 notes that 120 V is the RMS value.
  - Longitude: east positive. Bearing: clockwise from north.
- **Simplifications, each labeled in the text:**
  - ideal circuit components;
  - the ray picture for very thin fibers;
  - Earth treated as a sphere with $R = 6371$ km ("off by up to about half a percent");
  - the bearing formula and the haversine identity stated without full derivation.
- **History and facts** (hedged in the text):
  - Ibn Sahl 984, Harriot 1602, Snellius 1621, Descartes 1637, Huygens 1678 (checked against Wikipedia, "Snell's law");
  - Steinmetz and phasors "in the 1890s";
  - Girard's theorem "usually credited to Albert Girard (1629)";
  - refractive indices: water 1.33, glass about 1.5, diamond 2.42;
  - North American mains: 60 Hz, about 170 V peak;
  - city coordinates for New York and Madrid are approximate;
  - the "about 46° N" high point of the NY–Madrid great circle was computed;
  - noise-cancelling headphones "only partial, best for steady low sounds".
- **Drill tolerances:**
  - Snell's law: ±0.02°, with "round only at the end";
  - RLC $Z$: ±0.02 Ω;
  - fiber numerical aperture asked to 4 decimal places, so the angle from a rounded value still passes;
  - great-circle distance: ±0.6 km.

## Errors found in existing content

None. I read core lessons 23, 26, 30, 32–33 and 38 and the honors lessons 04h1, 12h1 and 34h1 for overlap and cross-references. I edited no existing or shared files.

## Sources

- The formulas are standard: rotation, two-link kinematics, phasors and RLC impedance, Snell's law and the critical angle, numerical aperture, the spherical law of cosines, the haversine formula, the initial-bearing formula and Girard's theorem. All explanations, examples, questions and pictures are original.
- The history of the law of refraction was checked against Wikipedia, "Snell's law" (fetched 2026-10-23).
