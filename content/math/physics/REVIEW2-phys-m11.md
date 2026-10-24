# Round 2 review: phys-m11 (Light and optics)

Reviewed: honors lessons 45h1-polarization and 45h2-interferometers; round 2 additions to core lessons 42–45 (4 SVGs, 4 Mermaid charts); `questions/r2-phys-m11.yaml` (50), `drills/r2-phys-m11.yaml` (5), `glossary-r2-phys-m11.yaml` (12), `cards-r2-phys-m11.yaml` (19); `images/phys-m11-*` (6 + 6 blanks).

## Changes

| Where | Problem | Fix |
|---|---|---|
| images/phys-m11-eye.svg, -eye-blank.svg; q11 marker | The optic nerve was attached exactly where the rays focus, so the picture put the image on the optic disc (the blind spot). In a real eye the focus (fovea) and the nerve exit are separate. | Moved the nerve below the focal point (attachment y 250–294 instead of 218–262), moved its text label, and moved the q11 "Optic nerve" marker from y 58.1 to 65.2. Re-rendered and checked with markers. |
| images/phys-m11-concave-mirror.svg, -blank.svg | The ray to the mirror's vertex and its reflection were dashed. These are real rays; the course uses dashed lines for traced-back (virtual) rays (lesson 44 magnifier figure), so the dashes could suggest a virtual ray. | Made both segments solid. |
| 45h2, air-wedge ```shape figure | Rendered very flat; the "spacer, D" label sat on the spacer line and the "x" label sat on the dashed t line, so x looked like a point, not a distance. | Taller wedge (D = 2.4 units), separate dimension lines for x (0 to 6) and L (0 to 10), labels t and D placed off the lines, "air wedge" inside the wedge; caption now also names D and L. Re-rendered. |
| 45h1, Example 5 last sentence | "An ideal display can never pass more than half the backlight" is true only with absorbing polarizers; many current LCD backlights use reflective polarizer (recycling) films. | Qualified as "With an absorbing first polarizer…" and added a sentence on recycling films. |
| q-h19 explanation | Distractor reasons were loose: 600 nm was attributed to "forgetting the gap is crossed twice" without saying it also assumes a full fringe, and 75 nm had no explanation. | Rewrote the distractor sentence to name each mistake. Key (150 nm) unchanged. |

## Checked and found right (a reader might doubt)
- All 50 keys worked independently before reading them; every numeric key and named distractor recomputed in Python (e.g. h01 58.9/37.0/31.1/53.0°, h04 36.9° vs critical 48.8°, h06 3.16, h09 17.4 μm, h12 0.375, h17 101, h20 2.10/1.48/2.97/1.05 mm, h22 632.1, h24 4.42 and 1.26×10⁵, h28 3.6 mm, q01 24.4°, q17 3.0 mm, q20 99.6 nm).
- Fresnel s-reflectance at Brewster for n = 1.52: Rs = ((n²−1)/(n²+1))² = 0.1567 (15.7%); unpolarized total 7.8%, matching "under 8%".
- Lesson worked examples: Brewster 53.1°/56.7°/33.3°, critical 41.1°; Rayleigh 9.4 and 5.9; quartz plate 16.4 μm, calcite 0.86 μm; hair 58.9 μm and exactly 200 spacings; R = 1.497 m; λ = 588.2 nm; n − 1 = 2.72×10⁻⁴; ℓc white ≈ 1.0 μm, He-Ne 0.002 nm → 20 cm.
- Material constants: calcite n_o 1.658, n_e 1.486; quartz 1.544/1.553 (Δn 0.0091); MgF₂ Δn 0.0118 (n_o 1.3777, n_e 1.3895) — Hecht, *Optics*, birefringence table.
- EM-wave SVG: E and B in phase, and with the oblique projection (lower-left = toward viewer) E × B points along the travel arrow. Double-slit SVG: P sits on the 3rd bright fringe; fringes evenly spaced. Brewster SVG: incidence 56.9°, refraction 33.7°, 90° between outgoing rays; field arrows perpendicular to each ray. Concave mirror: d_o = 3f, image at 1.5f, m = −0.5, all three rays pass through the image tip. Michelson: splitter orientation sends reflected/transmitted beams the right way. All markers sit on the parts their labels name.
- Mermaid charts (42 boundary, 43 procedure, 44 corrective lens, 45 phase flips, 45h1 LCD) rendered: readable, content correct, accDescr covers the whole chart.
- Drills: 3,000 instances each generated with the app's own engine (src/lib/drills.ts) from the built module; answers recomputed independently from the prompt values; correctly rounded answers (3 s.f., or 0.1° for Brewster) accepted, 3% wrong answers rejected, displayed answers accepted, no unfilled placeholders: 0 failures. (Gas-index answers typed as `2.72e-4`, `2.72*10^-4` or `2.72 × 10^-4` are accepted; `2.72x10^-4` is not, an engine limit, and the prompt shows the e-notation form.)
- History: Brewster's law 1815 (Phil. Trans. R. Soc.); Michelson–Morley 1887, ~11 m folded path, 0.4 fringe expected, under 1/20 fringe seen (Am. J. Sci. 34, 333); Michelson Nobel 1907 (nobelprize.org); GW150914 on 14 Sep 2015, peak strain 1.0×10⁻²¹ → ΔL ≈ 4×10⁻¹⁸ m (PRL 116, 061102).
- Glossary: no term or alias duplicates any glossary*.yaml in the course (glossary.yaml has "Rayleigh criterion" and an alias "coherence", distinct from these).

## Overlap
- LIGO appears in 45h2 (one paragraph) and in phys-h1 lesson 90 (full treatment, with an L-shaped interferometer picture and the ΔL = hL example). Numbers agree; lesson 90 cross-references 45h2. Acceptable, not duplicated.
- Michelson–Morley is mentioned in one sentence in core lesson 46; 45h2's fuller account agrees with it.

## Left as is / uncertain
- Brewster SVG draws the refracted ray with 3 in-plane arrows and 1 dot, a cartoon of "partly polarized"; by Example 2 the transmitted beam is only slightly polarized (500 p vs 422 s). It is the usual textbook drawing, so I left it.
- "Soap films show colors only when thinner than about a micrometer" is an order-of-magnitude statement tied to the labeled ℓc estimate; fine as worded.

## Counts
Answer-key errors: 0. Factual fixes: 2 (eye focus on optic nerve, LCD half-backlight limit). Picture fixes: 2 (concave-mirror dashes, air-wedge figure). Other fixes: 1 (h19 distractor explanation).

`content/math/check-module.sh physics phys-m11`: OK, 0 problems.
