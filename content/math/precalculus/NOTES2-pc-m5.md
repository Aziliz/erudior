# NOTES2-pc-m5: Trigonometry review, round 2

`content/math/check-module.sh precalculus pc-m5`: build and checker report **zero problems** (4 lessons, 64 questions, 12 drills, 33 cards).

## Honors lessons

The course leaves solving trig equations to the separate Trigonometry course (VERIFY.md, "Coverage gaps"), and lesson 21 only uses the sum identities forward. So the two honors lessons cover (1) solving trig equations and (2) running the sum identity backward to combine waves.

| File | Id | Minutes | Prose words* | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|
| 21h1-trig-equations.md | pc-m5-h-trig-equations, "Solving trigonometric equations" | 45 | ~1,760 | 6 (2 sin x + 1 = 0; cos x = 0.3 and sin x = −0.4 with a calculator; sin 2x = √3/2; 2cos²x − cos x − 1 = 0; sin 2x = cos x; sin x + cos x = 1 by squaring), plus a worked daylight-model question and an identity-substitution walkthrough | pc-m5-sine-level.svg; plot of sin x meeting y = −1/2; Mermaid strategy chart | pc-m5-r2-solve-sin, -solve-cos, -multiple-angle |
| 21h2-combining-waves.md | pc-m5-h-combining-waves, "Adding waves" | 45 | ~1,390 | 6 (sin x + √3 cos x; 3 sin x − 4 cos x; −sin x + cos x, the arctan quadrant trap; spring 4 sin 2t + 3 cos 2t; sin x + cos x = 1 without squaring; 440/444 Hz beats) | pc-m5-amp-phase.svg; 2 plots (sin x + √3 cos x as one wave; sin 10x + sin 12x inside its envelope); Mermaid "rewrite a sin x + b cos x" chart | pc-m5-r2-amp-phase, -wave-max, -beats |

*Prose words leave out code blocks, display math and image alt text.

Both have an intro tied to lessons 20–21, `##` sections that explain why (unit-circle symmetry for the two solutions per turn; coefficient matching and polar coordinates of (a, b) for the amplitude-phase form; derivation of sum-to-product from the sum identities), "Common mistakes" and "Key points". Simplifications are labeled: the daylight model is approximately sinusoidal, the spring is frictionless, the beats model assumes pure tones of equal loudness.

## Core lessons (additions only)

- **20-unit-circle.md**: pc-m5-radian-arc.svg (radius, arc, central angle; one introducing paragraph); pc-m5-quadrant-signs.svg (quadrant signs and the reference angle of 150°); Mermaid chart "evaluating a trig function of any angle".
- **21-trig-graphs-identities.md**: pc-m5-sinusoid-features.svg (amplitude, period, midline, max, min of y = 2 sin x + 1); a ```plot of y = tan x with dashed asymptotes; Mermaid chart of how the identities derive from the Pythagorean identity and the sum formulas.

## Questions (`questions/r2-pc-m5.yaml`, 40)

- Core, 6 per lesson (pc-m5-r2-q01–q12): 4 text, 2 match, 2 order, 2 select-all, 2 label (radian-arc blank, sinusoid-features blank). `module_quiz: true` on q01, q04, q07, q11.
- Honors, 14 per lesson (pc-m5-r2-h01–h28): 16 multiple choice (answer positions 2/2/2/2 per lesson) and 12 other types: 4 text, 2 order, 2 match, 3 select-all, 1 label (amp-phase blank). No `module_quiz` (honors lessons in a core module).

## Pictures

All original SVGs (white background, #1c2833 ink, ≥14px text, soft fills), 1–12 KB each, previewed as PNGs: pc-m5-radian-arc (+ -blank), pc-m5-quadrant-signs, pc-m5-sinusoid-features (+ -blank), pc-m5-sine-level, pc-m5-amp-phase (+ -blank). Label markers were generated from the same coordinates as the drawing and checked on the blanks with `--markers`. All 4 Mermaid diagrams and the 4 new plots were rendered and inspected.

## Drills (`drills/r2-pc-m5.yaml`, 6)

pc-m5-r2-solve-sin, -solve-cos (two solutions in [0, 2π), 3 decimals, tolerance 0.001), -multiple-angle (smallest positive solution of sin(Bx) = c and the count 2B), -amp-phase (R and φ = atan2(b, a) in (−π, π]), -wave-max (max, min, period of a sin Bx + b cos Bx + D), -beats (beat frequency and average tone).

## Glossary and cards

- `glossary-r2-pc-m5.yaml`, 10 terms: trigonometric equation, principal value, general solution, amplitude-phase form (alias harmonic addition), phase angle, product-to-sum formula, sum-to-product formulas, frequency, beats, beat frequency. Checked against every `glossary*.yaml` in the course (including the r2 files of pc-m1, pc-m2, pc-m8, pc-m10, pc-h1): no duplicate terms or aliases. "extraneous solution" is bolded in 21h1 and uses the existing entry.
- `cards-r2-pc-m5.yaml`: 20 cards (10 "Trig equations", 10 "Combining sinusoids").

## For a reviewer

- Every key, distractor and worked-example number was recomputed in Python/numpy (`/tmp/r2-pc-m5/vq.py`, 41 checks, all OK); sympy's `solveset` missed solutions of 2cos²x − cos x − 1 = 0, so that one was checked numerically.
- h11 (text) accepts `pi/4`, `π/4` and decimals 0.785 / 0.7854; a learner typing another form (e.g. `0.79`) is marked wrong.
- Sign convention: R sin(x + φ) with φ the direction of (a, b); the lesson spells out that this is phase shift C = −φ in the course's A sin(B(x − C)) + D form, and mentions the cosine version R cos(x − δ).
- Daylight answers (days ≈ 99 and 245 for 13 h; ≈ 122 and 222 for 14 h) come from lesson 21's model, not real data.

## Errors in existing content

None found in pc-m5's lessons, questions, drills, cards or glossary entries.

## Sources

Standard results (general solutions of sin/cos/tan equations, a sin x + b cos x = R sin(x + φ), sum-to-product and product-to-sum identities, beat frequency |f₁ − f₂|), checked against the course's own verified identities and recomputed numerically. Topics chosen to fill gaps listed in VERIFY.md (OpenStax Precalculus 2e chapters on trig equations and identities as a coverage reference; no text copied).
