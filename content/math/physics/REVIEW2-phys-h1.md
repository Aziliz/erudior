# REVIEW2-phys-h1: Honors module phys-h1, Frontiers of physics (round 2 review)

Scope: lessons 90-93, `questions/r2-phys-h1.yaml` (h01-h56), `drills/r2-phys-h1.yaml` (12),
`glossary-r2-phys-h1.yaml` (48), `cards-r2-phys-h1.yaml` (40), `images/phys-h1-*` (4 + 4 blank),
4 Mermaid diagrams, 4 plots. `content/math/check-module.sh physics phys-h1` after fixes: OK, zero problems.

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| 90-gravity-spacetime, GPS plot | Labels "gravity" and "net" overlapped each other at the right edge; "speed" sat on the x-axis next to the axis title; "break-even" touched the net curve. | Curve and point labels moved to free `labels` placed clear of every curve and axis (gravity above its curve, net below its curve, speed below its curve, GPS below the point, break-even right of the point above the axis). Data unchanged. | Rendered with preview-plots |
| 92-cosmology, Hubble plot | The 4-digit y tick labels (1000-9000) were cut off at the left edge. | y axis now in thousands of km/s (`y: [0, 9]`, function `0.07*x`, points divided by 1000, axis title "recession speed (1000 km/s)"). Same data. | Rendered |
| 92-cosmology, rotation-curve plot | "expected from visible mass" label lay on the dashed curve. | Moved to a free label below the dashed curve. | Rendered |
| 93-climate-physics, ε plot | "Earth, 288 K" label sat on the rising curve. | Moved to a free label below and right of the point. | Rendered |
| 91-standard-model, Example 3(b) | $p \to e^+ + \gamma$ was said to fail only baryon number, but it also breaks lepton number ($0 \to -1$; the positron is an antilepton). A student checking $L$ as the lesson teaches would get a contradiction. | Added "(Lepton number fails too: $L$: $0 \to -1$ …)". | Lesson's own definition of $L$; PDG |
| question phys-h1-r2-h18 (explanation) | Same point: explanation implied only $B$ is violated. Key (choice 0) is right. | Added "It also breaks lepton number ($0 \to -1$), but the question asks about baryon number." | as above |
| 91-standard-model, Key points | "The Higgs field gives the W, Z, quarks and leptons mass": in the Standard Model neutrinos get no mass from the Higgs (their mass origin is open); the glossary and card already said "charged leptons". | "…quarks and charged leptons mass (where neutrino masses come from is still open)". | PDG review "Neutrino mass, mixing and oscillations" |
| 93-climate-physics, recap | "Eunice Foote (1856) and John Tyndall (1859) first showed in the laboratory that these gases absorb heat radiation" overstates Foote: she measured that sunlit cylinders of CO₂ and moist air warmed more than dry air; she did not isolate infrared absorption, which Tyndall did. | "Eunice Foote (1856) found that sunlit CO₂ and moist air warm more than dry air, and John Tyndall (1859) showed in the laboratory that these gases absorb heat (infrared) radiation." | Foote, Am. J. Sci. 22 (1856) 382; Jackson, *Notes Rec.* 75 (2021) on Foote vs Tyndall; Tyndall, Proc. R. Soc. 10 (1859) |
| 93-climate-physics, energy-balance alt text | Said infrared leaves "in all directions", but the picture shows three arrows on the right. | "Arrows on the right show infrared radiation leaving the planet to space." | Rendered SVG |
| glossary "gravitational redshift" | "First measured by Pound and Rebka in 1959": earlier astronomical attempts (Sirius B, 1925) existed, though unreliable; Pound-Rebka was the first laboratory measurement. | "First measured in the laboratory by Pound and Rebka in 1959." | Pound and Rebka, PRL 4, 337 (1960) |

## Checked and found right (a reader might doubt)

- All 56 keys worked independently before reading them; every distractor's stated mistake reproduces its number (h03 1.09e-13 / 3.27e-5 / 1.09e-16 / 5.44e-14; h09 5.4e47, 1.1e49 with 62 M☉, 6.4e48 with 36, 1.8e39 with mc; h23 0.535 T is the real LHC injection field at 450 GeV; h35 1.85e41 / 1.85e35 / 9.2e35 / 6.0e21; h45 274 / 340 / 237 / 303 K; h43, h44, h48, h49).
- h02: a clock in a deep mine is at lower gravitational potential than at sea level (potential keeps falling toward Earth's center), so it does record the least time.
- h55: more CO₂ does not change $T_e$ in the model, and the radius cancels: only choices 0 and 1 are right.
- Lesson numbers recomputed in Python: Everest 9.6e-13, 30 μs/yr; GPS 5.29e-10 → 45.7 μs, v = 3.874 km/s, 7.2 μs, net 38.5 μs, r = 4.17 R_E; break-even at 1.5 R_E (60.1 and 30.1 μs/day coefficients); r_s 2.95 km/M☉, Sgr A* 1.27e10 m = 0.085 AU, Earth 8.9 mm; GW150914 ΔL 4.0e-18 m (~1/400 of a 1.7 fm proton), E = 5.4e47 J; antiproton thresholds 938 MeV head-on, 6 m_pc² = 5.6 GeV fixed target; Yukawa 1.4 fm (pion), 2.5e-3 fm (W); LHC r = 2.80 km, γ ≈ 7460, 1 − β ≈ 9e-9; Proxima 1.30 pc = 4.24 ly; Hα z = 0.0101, 3.02e3 km/s, 43 Mpc = 140 Mly; 1/H₀ = 13.97 Gyr; ρ_c = 9.20e-27 kg/m³ (5.5 H atoms); Milky Way 2.0e41 kg = 1.0e11 M☉; T_e = 254.6 K, ε = 0.779; 4σT_e³ = 3.74; 5.35 ln 2 = 3.71, 5.35 ln 1.5 = 2.17; f = 0.6 and 2.4 / 4.0 K.
- Dates and facts spot-checked: MICROSCOPE final result (2022, ~1e-15); Pound-Rebka 22.5 m Jefferson tower; Chou et al. 2010 (33 cm, "30 centimeters" is fair); 1.75″ deflection, Mercury 43″/century; Michell 1783; Schwarzschild 1916; EHT M87* 2019 and Sgr A* 2022; GW150914 (Livingston ~7 ms before Hanford, 36 + 29 → 62 M☉, ~410 Mpc ≈ 1.3 Gly, peak strain 1.0e-21), Nobel 2017; GW170817 speed bound ~1e-15; Dirac 1928, Anderson 1932, Bevatron 1955 (~6.2 GeV); Gell-Mann/Zweig 1964, SLAC 1968; top quark 1995 (173 GeV vs gold atom ~183 GeV); muon 206.8 m_e; solar neutrino flux (~6.5e10 /cm²/s → hundreds of trillions per second through a body); Super-K 1998 / SNO 2001; Yukawa 1935, pion 1947; Higgs 2012, Nobel 2013; proton lifetime > 1e34 yr (Super-K); Leavitt 1912, Slipher 1910s, Lemaître 1927, Hubble 1929; Planck 2018 (Ω_b 0.049, Ω_c 0.266, Ω_Λ 0.685 → 5/27/68%); CMB 2.725 K, z ≈ 1100, ~380 kyr; COBE FIRAS 1990; Zwicky 1933; Nobel 2011; Arrhenius 1896 (~5-6 °C); Manabe and Wetherald 1967 (~2.3 °C); Nobel 2021 (Manabe and Hasselmann, with Parisi); IPCC AR6 ECS 3 °C, likely 2.5-4 °C, 1.09 °C warming 2011-2020 vs 1850-1900; Myhre et al. 1998 coefficient 5.35.
- Simplifications are labeled in the text as the writer claims (weak-field formulas, Yukawa estimate, rough strengths, v ≈ cz, central-mass galaxy, teaching-model greenhouse, 1.0 vs 1.2 K Planck response); contested points (Hubble tension, dark matter/energy, clouds) are labeled.
- Pictures: all four (and blanks with markers) rendered. LIGO beam-splitter orientation sends both returning beams to the detector correctly; Standard Model chart groupings and generations correct; parallax angle drawn at the star against the 1 AU baseline; every marker on the part its label names; no overlaps or clipping.
- Mermaid: all 4 render cleanly; accTitle/accDescr describe the whole diagram; timeline dates correct (acceleration began ~5-6 Gyr ago).
- Drills: each of the 12 formulas recomputed in Python from its prompt for sample inputs; relTolerance 0.01 exceeds the 0.5% worst-case rounding error at 3 significant figures; hubble drill computes z from the rounded observed wavelength shown in the prompt; unit maps consistent. The module checker (40 generations per drill) passes.
- Glossary/cards: definitions correct; checker found no duplicate terms or aliases.

## Overlap

- 45h2-interferometers already describes LIGO and GW150914 in a paragraph; lesson 90 refers to it and goes further (strain, energy, timing), consistent figures ("a few times 1e-18 m"). Acceptable.
- 20h3-orbital-mechanics weighs Sgr A* with S2 (4.3e6 M☉); lesson 90 cites it rather than repeating it.
- 29h3-radiation-balance (T_e = 255 K, all-absorbing layer at 303 K) is recapped in one section of lesson 93; 49h2-nuclear-energy covers annihilation and pair production, recapped briefly in lesson 91. No other overlap found.

## Left uncertain

- Relative interaction strengths (1, 1e-2, 1e-6, 1e-38) are convention-dependent; the lesson says so. Weak strength is quoted anywhere from 1e-5 to 1e-13 in textbooks.
- The 3.7 W/m² doubling forcing follows Myhre et al. (1998); IPCC AR6 revised it to about 3.9 W/m². The lesson presents 5.35 ln(C/C₀) as a fit, which is fine for teaching, but a later edit could mention the AR6 value.
