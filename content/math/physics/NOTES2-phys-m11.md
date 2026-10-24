# Round 2 notes: phys-m11 (Light and optics)

## Honors lessons (2)
| File | Id | Title | Words | Qs | Drills |
|---|---|---|---|---|---|
| lessons/45h1-polarization.md | phys-m11-h-polarization | Honors: Polarization by reflection, scattering and birefringence | ~2,160 | 15 | phys-m11-r2-brewster, phys-m11-r2-waveplate |
| lessons/45h2-interferometers.md | phys-m11-h-interferometry | Honors: Interferometers: measuring with light waves | ~1,820 | 15 | phys-m11-r2-air-wedge, phys-m11-r2-michelson, phys-m11-r2-gas-index |

- 45h1: radiating-dipole picture; s/p polarization and Brewster's angle derived from Snell's law (tan θB = n2/n1); Fresnel s-reflectance at Brewster stated, not derived; Rayleigh scattering (1/λ⁴, blue sky, red sunsets, skylight polarization at 90°); birefringence (calcite), quarter- and half-wave plates, circular polarization; twisted nematic LCD with a Mermaid diagram; 3D cinema and photoelasticity. 5 worked examples.
- 45h2: air wedge (flip counting, Δx = λL/2D), optical flats, Newton's rings (r_m = √(mλR) derived), Michelson interferometer (N = 2Δd/λ), gas cell (N = 2L(n−1)/λ), coherence length (λ²/Δλ, labeled as an estimate), Michelson–Morley (1887) and LIGO (2015). 4 worked examples, shape figure of the wedge.
- Both cover the VERIFY.md "optional" gaps (Brewster; interferometry). A third lesson (cameras, f-numbers and aberrations) would also fit if wanted.

## Core lessons (additions only)
- 42 light: EM-wave SVG (+ intro sentence); Mermaid "what happens at a boundary" decision chart.
- 43 mirrors/lenses: concave-mirror ray-diagram SVG (with one sentence defining C); Mermaid "solving a thin-lens or mirror problem" procedure.
- 44 optical instruments: eye cross-section SVG (+ one sentence on iris and optic nerve); Mermaid "choosing a corrective lens".
- 45 wave optics: double-slit setup SVG; Mermaid "count the phase flips" thin-film chart.

## Questions (questions/r2-phys-m11.yaml, 50)
- Core q01–q20 (5 per lesson): 4 text, 4 order, 4 match, 4 select-all, 4 label. Module quiz: q03, q04, q07, q09, q11, q14, q16, q19 (2 per lesson).
- Honors h01–h15 (polarization) and h16–h30 (interferometers): per lesson 9 multiple choice, 1 select-all, 2 text, 1 match, 1 order, 1 label. MC answer positions over the honors questions: 4/5/4/5.
- All keys and each named distractor value recomputed in Python.

## Pictures (images/, 6 + 6 blanks, all under 20 KB)
phys-m11-em-wave, phys-m11-concave-mirror, phys-m11-eye, phys-m11-double-slit (core); phys-m11-brewster, phys-m11-michelson (honors). Each has a -blank copy used by a label question; markers were placed from the drawing coordinates and checked in previews.

## Drills (drills/r2-phys-m11.yaml, 5)
phys-m11-r2-brewster, -waveplate, -air-wedge, -michelson, -gas-index. Each checked with 2,000 generated instances: answer recomputed from the prompt text, shown answer and a 3 s.f. (or 0.1°) rounded answer accepted, a 3% wrong answer rejected. 0 mismatches.

## Glossary and cards
- glossary-r2-phys-m11.yaml: 12 terms (plane of incidence, Brewster's angle, Rayleigh scattering, birefringent, quarter-wave plate, half-wave plate, circular polarization, interferometer, optical flat, Newton's rings, beam splitter, coherence length). Checked against every glossary*.yaml in the course: no duplicate terms or aliases.
- cards-r2-phys-m11.yaml: 19 cards (10 polarization, 9 interferometers).

## For a reviewer
- Stated without derivation: dipole radiation pattern, Fresnel s-reflectance 15.7% at Brewster for n = 1.52, Rayleigh 1/λ⁴.
- Material constants: calcite n_o 1.658, n_e 1.486; quartz n_o 1.544, n_e 1.553 in the lesson (Δn 0.009), while q-h09 and the waveplate drill state Δn = 0.0091 explicitly; MgF₂ Δn 0.0118 in the drill. Air n − 1 ≈ 2.7×10⁻⁴; helium 3.5×10⁻⁵ (q-h24).
- Approximate or simplified, labeled in the text: skylight maximum polarization "about 70 to 80%"; LCD gray-level model (ignores ellipticity); coherence length λ²/Δλ; He-Ne laser Δλ ≈ 0.002 nm → ~20 cm (typical, varies by laser).
- History: Brewster 1815; Michelson–Morley 1887 (about 11 m folded arms, expected ~0.4 fringe, observed at most a few hundredths); Michelson Nobel 1907; LIGO detection 14 September 2015, arm change a few ×10⁻¹⁸ m.
- The phys-h1 ("Frontiers") writer may cover gravitational waves; 45h2 mentions LIGO only in one paragraph.

## Errors found in existing content
None. (Re-checked the worked examples in lessons 42–45.)

## Build / check
`content/math/check-module.sh physics phys-m11`: OK, 0 problems (6 lessons, 98 questions, 18 drills).

## Sources
Standard optics results (Snell, Brewster, Malus, thin-film, Michelson fringe counting) as in OpenStax College/University Physics; calcite and quartz indices from standard tables (Hecht, *Optics*); Michelson & Morley, *Am. J. Sci.* 34 (1887); LIGO Scientific Collaboration, *Phys. Rev. Lett.* 116, 061102 (2016).
